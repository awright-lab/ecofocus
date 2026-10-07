import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const publicRoot = new URL("../public/", import.meta.url);
const readerRoot = new URL("gpi-reader/", publicRoot);
const source = fs.readFileSync(new URL("viewer.js", readerRoot), "utf8");
const html = fs.readFileSync(new URL("index.html", readerRoot), "utf8");

// Run the shipped script without browser/dependency installation. These focused
// DOM stubs test state/events, not layout, native touch delivery, or CSS rendering.
function reader({ width = 1000, reduced = false, frame = null, native = false } = {}) {
  let document;
  class Element {
    constructor(tagName = "div", className = "") {
      this.tagName = tagName.toUpperCase();
      this.className = className;
      this.children = [];
      this.dataset = {};
      this.attributes = {};
      this.listeners = new Map();
      this.style = { cssText: "", overflow: "", setProperty(k, v) { this[k] = v; } };
      this.classList = {
        contains: (name) => this.className.split(/\s+/).includes(name),
        add: (...names) => { this.className = [...new Set([...this.className.split(/\s+/).filter(Boolean), ...names])].join(" "); },
        remove: (...names) => { this.className = this.className.split(/\s+/).filter((n) => !names.includes(n)).join(" "); },
        toggle: (name, on) => { const add = on ?? !this.classList.contains(name); this.classList[add ? "add" : "remove"](name); return add; },
      };
    }
    append(...children) { for (const child of children) { child.parentElement = this; this.children.push(child); } }
    replaceChildren(...children) { this.children = []; this.append(...children); }
    remove() { if (this.parentElement) this.parentElement.children = this.parentElement.children.filter((child) => child !== this); }
    setAttribute(name, value) { this.attributes[name] = value; }
    addEventListener(name, callback) { this.listeners.set(name, [...(this.listeners.get(name) ?? []), callback]); }
    emit(name, event = {}) { return (this.listeners.get(name) ?? []).map((fn) => fn({ target: this, ...event })); }
    closest(selector) { assert.equal(selector, "[hidden]"); if (this.hidden) return this; return this.parentElement?.closest(selector) ?? null; }
    focus() { if (!this.closest("[hidden]")) document.activeElement = this; }
    cloneNode(deep) { const copy = new Element(this.tagName, this.className); copy.dataset = { ...this.dataset }; if (deep) copy.append(...this.children.map((child) => child.cloneNode(true))); return copy; }
  }
  const root = new Element("section", "reader");
  const stage = new Element("div", "stage");
  Object.assign(stage, { clientWidth: width, clientHeight: 650, scrollWidth: 1800, scrollLeft: 0, scrollTop: 0 });
  const wrap = new Element("div", "book-wrap");
  const pages = new Element("div", "pages");
  Object.defineProperty(pages, "offsetWidth", { get: () => parseFloat(root.style["--page-width"] || 360) * pages.children.length });
  const select = new Element("select");
  const status = new Element("p");
  const reduceInput = new Element("input");
  const error = new Element("p", "error-message");
  error.hidden = true;
  const errorLink = new Element("a");
  error.append(errorLink);
  const spreadLabel = new Element("span");
  const progress = new Element("span");
  const actions = Object.fromEntries(["zoom-out", "fit", "zoom-in", "fullscreen", "previous", "next"].map((name) => [name, new Element("button")]));
  const openPdf = new Element("a"), download = new Element("a");
  const focusOrder = [actions["zoom-out"], actions.fit, actions["zoom-in"], actions.fullscreen, openPdf, download, stage, actions.previous, select, actions.next, errorLink];
  root.append(...focusOrder.filter((element) => element !== errorLink), wrap, error);
  wrap.append(pages);
  root.querySelector = (selector) => ({ ".stage": stage, ".book-wrap": wrap, ".pages": pages, select, "[data-status]": status, ".error-message": error, ".spread-label": spreadLabel, ".reading-progress span": progress })[selector] ?? actions[selector.match(/^\[data-action="(.+)"\]$/)?.[1]];
  root.querySelectorAll = (selector) => {
    assert.equal(selector, 'button:not(:disabled),a[href],select,[tabindex="0"]');
    return focusOrder.filter((element) => !element.disabled);
  };
  document = new Element("document");
  document.body = new Element("body");
  document.body.style.overflow = "auto";
  document.activeElement = actions.fullscreen;
  document.querySelector = (selector) => ({ "[data-flipbook]": root, "[data-reduce-motion]": reduceInput })[selector];
  document.createElement = (tag) => new Element(tag);
  document.fullscreenEnabled = !!native;
  document.exitFullscreen = async () => { document.fullscreenElement = null; document.emit("fullscreenchange"); };
  if (native) root.requestFullscreen = async () => {
    if (native === "reject") throw new Error("Fullscreen denied by the browser");
    document.fullscreenElement = root;
    document.emit("fullscreenchange");
  };
  const motion = new Element("media-query");
  motion.matches = reduced;
  const window = { matchMedia: () => motion };
  Object.defineProperty(window, "frameElement", { get() { if (frame === "cross-origin") throw new Error("SecurityError"); return frame; } });
  let resize, timerId = 0, now = 0;
  const timers = new Map();
  vm.runInNewContext(source, {
    document, window, location: { search: "?embed=1" }, URLSearchParams,
    Image: class extends Element { constructor() { super("img"); } },
    ResizeObserver: class { constructor(callback) { resize = callback; } observe() {} },
    requestAnimationFrame: (fn) => fn(),
    setTimeout: (fn) => { const id = ++timerId; timers.set(id, fn); return id; },
    clearTimeout: (id) => timers.delete(id),
    performance: { now: () => now },
  }, { filename: "public/gpi-reader/viewer.js" });
  return {
    root, stage, wrap, pages, select, status, reduceInput, error, errorLink, actions, document, motion, timers,
    visible: () => pages.children.map((sheet) => sheet.dataset.page),
    turns: () => wrap.children.filter((element) => element.classList.contains("turning")),
    click: (action) => Promise.all(actions[action].emit("click")),
    choose(page) { select.value = String(page); select.emit("change"); },
    resize(width) { stage.clientWidth = width; resize(); },
    key(key, target = stage, extra = {}) { let prevented = false; root.emit("keydown", { key, target, preventDefault() { prevented = true; }, ...extra }); return prevented; },
    swipe(dx, dy = 0, duration = 100, extra = {}) {
      stage.emit("pointerdown", { isPrimary: true, pointerType: "touch", pointerId: 1, clientX: 200, clientY: 200, ...extra });
      now += duration;
      stage.emit("pointerup", { pointerId: 1, clientX: 200 + dx, clientY: 200 + dy });
    },
  };
}

test("all shipped local script, style, image, and PDF paths resolve", () => {
  for (const [, path] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|data:|#)/.test(path)) continue;
    const file = path.startsWith("/") ? new URL(path.slice(1), publicRoot) : new URL(path, readerRoot);
    assert.ok(fs.statSync(file).isFile(), path);
  }
  for (let page = 1; page <= 6; page++) assert.ok(fs.statSync(new URL(`assets/page-${page}.jpg`, readerRoot)).size > 0);
  assert.match(html, /class="error-message" hidden/);
  assert.match(html, /data-reduce-motion/);
});

test("desktop navigation, bounds, progress, controls, and rapid-turn cleanup", async () => {
  const r = reader();
  assert.deepEqual(r.visible(), [1]);
  assert.equal(r.actions.previous.disabled, true);
  for (const expected of [[2, 3], [4, 5], [6], [6]]) {
    await r.click("next");
    assert.deepEqual(r.visible(), expected);
    assert.ok(r.turns().length <= 1);
    assert.ok(r.timers.size <= 1);
  }
  assert.equal(r.actions.next.disabled, true);
  for (const expected of [[4, 5], [2, 3], [1], [1]]) { await r.click("previous"); assert.deepEqual(r.visible(), expected); }
  r.choose(2); r.choose(3);
  assert.equal(r.turns().length, 0);
  assert.equal(r.select.value, "3");
  await r.click("next");
  assert.equal(r.turns().length, 1);
  [...r.timers.values()][0]();
  assert.equal(r.turns().length, 0);
});

test("resizing switches to single pages and preserves the selected page", async () => {
  const r = reader();
  r.choose(3); r.resize(390);
  assert.deepEqual(r.visible(), [3]);
  assert.equal(r.turns().length, 0);
  await r.click("next"); assert.deepEqual(r.visible(), [4]);
  await r.click("previous"); assert.deepEqual(r.visible(), [3]);
  r.resize(1000); assert.deepEqual(r.visible(), [2, 3]);
});

test("zoom is bounded, resettable, scrollable, and cancels page-turn animation", async () => {
  const r = reader();
  await r.click("next"); await r.click("zoom-in");
  assert.equal(r.turns().length, 0);
  assert.equal(r.actions.fit.textContent, "125%");
  assert.equal(r.stage.classList.contains("zoomed"), true);
  assert.equal(r.key("ArrowRight"), false);
  assert.deepEqual(r.visible(), [2, 3]);
  for (let i = 0; i < 9; i++) await r.click("zoom-in");
  assert.equal(r.actions.fit.textContent, "250%");
  assert.equal(r.actions["zoom-in"].disabled, true);
  await r.click("next"); assert.equal(r.turns().length, 0);
  await r.click("fit");
  assert.equal(r.actions.fit.textContent, "100%");
  assert.equal(r.actions["zoom-out"].disabled, true);
  assert.equal(r.stage.classList.contains("zoomed"), false);
});

test("keyboard shortcuts preserve form input and modified browser keys", () => {
  const r = reader();
  assert.equal(r.key("ArrowRight", r.select), false);
  assert.equal(r.key("ArrowRight", r.stage, { ctrlKey: true }), false);
  assert.deepEqual(r.visible(), [1]);
  assert.equal(r.key("ArrowRight"), true); assert.deepEqual(r.visible(), [2, 3]);
  r.key("End"); assert.deepEqual(r.visible(), [6]);
  r.key("Home"); assert.deepEqual(r.visible(), [1]);
});

test("swipes navigate only for deliberate single-pointer unzoomed gestures", async () => {
  const r = reader({ width: 390 });
  r.swipe(-100); assert.deepEqual(r.visible(), [2]);
  r.swipe(100); assert.deepEqual(r.visible(), [1]);
  r.swipe(-40); r.swipe(-100, 100); r.swipe(-100, 0, 1000);
  r.swipe(-100, 0, 100, { pointerType: "mouse" });
  r.swipe(-100, 0, 100, { isPrimary: false });
  assert.deepEqual(r.visible(), [1]);
  r.stage.emit("pointerdown", { isPrimary: true, pointerType: "touch", pointerId: 1, clientX: 200, clientY: 200 });
  r.stage.emit("pointercancel");
  r.stage.emit("pointerup", { pointerId: 1, clientX: 50, clientY: 200 });
  assert.deepEqual(r.visible(), [1]);
  await r.click("zoom-in"); r.swipe(-100); assert.deepEqual(r.visible(), [1]);
});

test("OS and reader reduced-motion controls cancel and suppress animation", async () => {
  const r = reader({ reduced: true });
  assert.equal(r.reduceInput.checked, true);
  await r.click("next"); assert.equal(r.turns().length, 0);
  r.reduceInput.checked = false; r.reduceInput.emit("change");
  await r.click("next"); assert.equal(r.turns().length, 1);
  r.motion.emit("change", { matches: true });
  assert.equal(r.turns().length, 0);
  assert.equal(r.reduceInput.checked, true);
  assert.equal(r.document.body.classList.contains("motion-reduced"), true);
});

test("fallback fullscreen wraps focus past hidden error content and Escape works from select", async () => {
  const r = reader();
  await r.click("fullscreen");
  assert.equal(r.root.classList.contains("expanded"), true);
  r.actions.next.focus(); assert.equal(r.key("Tab", r.actions.next), true);
  assert.equal(r.document.activeElement, r.actions.fit);
  assert.equal(r.key("Tab", r.actions.fit, { shiftKey: true }), true);
  assert.equal(r.document.activeElement, r.actions.next);
  r.select.focus(); assert.equal(r.key("Escape", r.select), true);
  assert.equal(r.root.classList.contains("expanded"), false);
  assert.equal(r.document.body.style.overflow, "auto");
  assert.equal(r.document.activeElement, r.actions.fullscreen);
});

test("same-origin fallback expands and exactly restores frame and parent styles", async () => {
  const originalStyle = "height:760px;border:1px solid green";
  const body = { style: { overflow: "scroll" } };
  const frame = { style: { cssText: originalStyle }, ownerDocument: { body } };
  const r = reader({ frame, native: "reject" });
  for (let cycle = 0; cycle < 2; cycle++) {
    await r.click("fullscreen");
    assert.match(frame.style.cssText, /position:fixed/);
    assert.match(frame.style.cssText, /height:100dvh/);
    assert.equal(body.style.overflow, "hidden");
    assert.equal(r.root.classList.contains("expanded"), true);
    await r.click("fullscreen");
    assert.equal(frame.style.cssText, originalStyle);
    assert.equal(body.style.overflow, "scroll");
    assert.equal(r.document.body.style.overflow, "auto");
    assert.equal(r.actions.fullscreen.attributes["aria-label"], "Enter full screen");
  }
});

test("native fullscreen succeeds and exits without touching iframe styles", async () => {
  const body = { style: { overflow: "auto" } };
  const frame = { style: { cssText: "height:760px" }, ownerDocument: { body } };
  const r = reader({ frame, native: true });
  await r.click("fullscreen");
  assert.equal(r.document.fullscreenElement, r.root);
  assert.equal(r.root.classList.contains("expanded"), false);
  assert.equal(frame.style.cssText, "height:760px");
  assert.equal(body.style.overflow, "auto");
  assert.equal(r.actions.fullscreen.attributes["aria-label"], "Exit full screen");
  await r.click("fullscreen"); assert.equal(r.document.fullscreenElement, null);
});

test("cross-origin fallback is contained and page-load errors expose a working PDF escape", async () => {
  const r = reader({ frame: "cross-origin" });
  await r.click("fullscreen");
  assert.equal(r.root.classList.contains("expanded"), true);
  r.key("Escape"); assert.equal(r.root.classList.contains("expanded"), false);
  r.pages.children[0].children[0].emit("error");
  assert.equal(r.error.hidden, false);
});

test("hiding the document cancels any unfinished turn", async () => {
  const r = reader();
  await r.click("next"); assert.equal(r.turns().length, 1);
  r.document.hidden = true; r.document.emit("visibilitychange");
  assert.equal(r.turns().length, 0);
  assert.equal(r.timers.size, 0);
});

test("reusable case-study layout puts the reader immediately after the client strip", () => {
  const layout = fs.readFileSync(new URL("../components/CaseStudyLayout.tsx", import.meta.url), "utf8");
  const page = fs.readFileSync(new URL("../app/case-studies/glass-packaging-institute/page.tsx", import.meta.url), "utf8");
  assert.match(layout, /aria-label="Study at a glance"[\s\S]*?<\/section>\s*<section id="case-study"/);
  assert.match(layout, /src=\{study\.document\.readerSrc\}/);
  assert.match(page, /<CaseStudyLayout study=\{study\} \/>/);
  assert.doesNotMatch(page, /value: "(?:59|64|49|42)%"/);
  assert.match(page, /4,046 U\.S\. adults, age 18\+/);
  assert.match(page, /May 28–June 14, 2026/);
});

test("reader download button matches the site's emerald color and rounded corners", () => {
  const css = fs.readFileSync(new URL("viewer.css", readerRoot), "utf8");
  assert.match(css, /\.tools \.download\{[^}]*background:#059669;[^}]*border-radius:12px;/);
  assert.match(css, /\.tools \.download:hover\{background:#047857;/);
});


test("reader uses the original FileText icon without duplicate download section", () => {
  const layout = fs.readFileSync(new URL("../components/CaseStudyLayout.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(layout, /Explore the full case study|The challenge|id="download"/);
  assert.match(html, /class="book-symbol" viewBox="0 0 24 24"/);
  for (const path of ["M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", "M14 2v4a2 2 0 0 0 2 2h4", "M10 9H8", "M16 13H8", "M16 17H8"]) assert.ok(html.includes(`d="${path}"`));
});

test("original bottom call to action copy is restored", () => {
  const layout = fs.readFileSync(new URL("../components/CaseStudyLayout.tsx", import.meta.url), "utf8");
  assert.match(layout, /Turn sustainability intelligence into /);
  assert.match(layout, /market advantage\./);
  assert.match(layout, /Talk with EcoFocus about the business questions you need to answer\. We combine nationally representative consumer research with deep sustainability and packaging expertise to turn evidence into clear action\./);
  assert.match(layout, /Book a discovery call/);
});


test("overview uses balanced cards with aligned desktop headings", () => {
  const layout = fs.readFileSync(new URL("../components/CaseStudyLayout.tsx", import.meta.url), "utf8");
  assert.match(layout, /id="overview"[^>]*lg:grid-cols-2/);
  assert.match(layout, /border-blue-100 bg-brand-tint-blue p-7 sm:p-9/);
  assert.match(layout, /border-emerald-100 bg-brand-tint-emerald p-7 sm:p-9/);
  assert.equal((layout.match(/lg:min-h-\[4\.5rem\]/g) ?? []).length, 2);
  assert.match(layout, /The research need/);
});

test("bottom CTA places the button beside the copy only on desktop", () => {
  const layout = fs.readFileSync(new URL("../components/CaseStudyLayout.tsx", import.meta.url), "utf8");
  assert.match(layout, /aria-labelledby="contact-title"[^>]*lg:grid-cols-\[minmax\(0,1fr\)_auto\][^>]*lg:items-center/);
  assert.match(layout, /<\/div>\s*<Link href="\/contact" className="btn-primary-emerald justify-self-start gap-2 lg:justify-self-end">Book a discovery call/);
});
