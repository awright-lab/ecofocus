(() => {
  'use strict';
  if (new URLSearchParams(location.search).get('embed') === '1') document.body.classList.add('is-embedded');
  const root = document.querySelector('[data-flipbook]');
  if (!root) return;
  const stage = root.querySelector('.stage'), wrap = root.querySelector('.book-wrap'), pages = root.querySelector('.pages');
  const select = root.querySelector('select'), status = root.querySelector('[data-status]');
  const byAction = name => root.querySelector(`[data-action="${name}"]`);
  const titles = ['Turning consumer evidence into a stronger business case for glass packaging', 'The challenge and the EcoFocus approach', 'What the research revealed', 'The deliverable: a research report', 'The value created for GPI', 'Why EcoFocus'];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let page = 1, zoom = 1, narrow = stage.clientWidth < 720, turn = null, timer = null, pointer = null;
  let reduced = motion.matches, lastFocused = null, previousOverflow = '';
  let expandedFrame = null;
  const reduceInput = document.querySelector('[data-reduce-motion]');
  reduceInput.checked = reduced;
  const imagePath = p => `assets/page-${p}.jpg`;
  function visiblePages() {
    if (narrow || page === 1 || page === 6) return [page];
    const first = page % 2 === 0 ? page : page - 1;
    return [first, first + 1];
  }
  function cancelTurn() { if (timer) clearTimeout(timer); timer = null; if (turn) turn.remove(); turn = null; }
  function fit() {
    const mobile = stage.clientWidth < 720;
    if (mobile !== narrow) { narrow = mobile; cancelTurn(); draw(); return; }
    const count = visiblePages().length;
    const padX = narrow ? 32 : 70, padY = narrow ? 45 : 56;
    const width = Math.max(110, Math.min((stage.clientWidth - padX) / count, (stage.clientHeight - padY) * 17 / 22));
    root.style.setProperty('--page-width', `${width * zoom}px`);
  }
  function announce(message) { status.textContent = message; }
  function draw() {
    const nums = visiblePages();
    pages.replaceChildren(...nums.map(n => {
      const sheet = document.createElement('div'); sheet.className = 'sheet'; sheet.dataset.page = n;
      const img = document.createElement('img'); img.src = imagePath(n); img.alt = `Page ${n} of 6: ${titles[n - 1]}. Full page displayed as an image.`;
      img.width = 1275; img.height = 1650; img.draggable = false;
      img.addEventListener('error', () => { root.querySelector('.error-message').hidden = false; });
      sheet.append(img); return sheet;
    }));
    pages.classList.toggle('spread', nums.length === 2);
    select.value = String(page);
    byAction('previous').disabled = nums[0] === 1;
    byAction('next').disabled = nums[nums.length - 1] === 6;
    root.querySelector('.spread-label').textContent = nums.length === 2 ? `Viewing ${nums[0]}–${nums[1]}` : '';
    root.querySelector('.reading-progress span').style.width = `${nums[nums.length - 1] / 6 * 100}%`;
    byAction('zoom-out').disabled = zoom <= 1;
    byAction('zoom-in').disabled = zoom >= 2.5;
    byAction('fit').textContent = `${Math.round(zoom * 100)}%`;
    stage.classList.toggle('zoomed', zoom > 1);
    fit();
    announce(nums.length === 1 ? `Page ${nums[0]} of 6. ${titles[nums[0] - 1]}.` : `Pages ${nums[0]} and ${nums[1]} of 6.`);
  }
  function go(target, animate = true) {
    target = Math.min(6, Math.max(1, target));
    if (target === page) return;
    cancelTurn();
    const oldPages = visiblePages().join(','), direction = target > page ? 'next' : 'previous';
    const old = animate && !reduced && zoom === 1 ? pages.cloneNode(true) : null;
    const oldWidth = pages.offsetWidth;
    page = target; draw(); stage.scrollTop = 0; stage.scrollLeft = 0;
    if (old && oldPages !== visiblePages().join(',')) {
      old.classList.add('turning', direction); old.setAttribute('aria-hidden', 'true'); old.style.width = `${oldWidth}px`;
      for (const sheet of old.children) sheet.style.width = `${oldWidth / old.children.length}px`;
      wrap.append(old); turn = old; timer = setTimeout(cancelTurn, 680);
    }
  }
  function next() { const nums = visiblePages(); go(nums[nums.length - 1] + 1); }
  function previous() { go(visiblePages()[0] - 1); }
  function setZoom(value) {
    cancelTurn(); zoom = Math.min(2.5, Math.max(1, value)); draw();
    stage.scrollLeft = Math.max(0, (stage.scrollWidth - stage.clientWidth) / 2); stage.scrollTop = 0;
    announce(`Zoom ${Math.round(zoom * 100)} percent. ${zoom > 1 ? 'Scroll to move around the pages. Swipe page turns are paused while zoomed in.' : 'Pages fit to the reader.'}`);
  }
  byAction('previous').addEventListener('click', previous); byAction('next').addEventListener('click', next);
  select.addEventListener('change', () => go(Number(select.value)));
  byAction('zoom-in').addEventListener('click', () => setZoom(zoom + .25));
  byAction('zoom-out').addEventListener('click', () => setZoom(zoom - .25));
  byAction('fit').addEventListener('click', () => setZoom(1));
  root.addEventListener('keydown', event => {
    if (event.key === 'Tab' && root.classList.contains('expanded')) {
      const focusable = [...root.querySelectorAll('button:not(:disabled),a[href],select,[tabindex="0"]')].filter(element => !element.closest('[hidden]'));
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      return;
    }
    if (event.key === 'Escape') { cancelTurn(); if (root.classList.contains('expanded')) { event.preventDefault(); exitExpanded(); } return; }
    if (['SELECT', 'INPUT', 'TEXTAREA'].includes(event.target.tagName) || event.ctrlKey || event.metaKey || event.altKey) return;
    if (zoom > 1 && event.target === stage && event.key.startsWith('Arrow')) return;
    const action = {ArrowRight:next, ArrowLeft:previous, Home:()=>go(1), End:()=>go(6), '+':()=>setZoom(zoom+.25), '-':()=>setZoom(zoom-.25)}[event.key];
    if (action) { event.preventDefault(); action(); }
  });
  stage.addEventListener('pointerdown', event => {
    if (!event.isPrimary) { pointer = null; return; }
    if (zoom !== 1 || event.pointerType === 'mouse') return;
    pointer = {id:event.pointerId, x:event.clientX, y:event.clientY, at:performance.now()};
  });
  stage.addEventListener('pointerup', event => {
    const p = pointer; pointer = null;
    if (!p || p.id !== event.pointerId || zoom !== 1) return;
    const dx = event.clientX - p.x, dy = event.clientY - p.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.6 && performance.now() - p.at < 900) {
      if (dx < 0) next(); else previous();
    }
  });
  stage.addEventListener('pointercancel', () => { pointer = null; });
  function setReduced(value) { reduced = value; reduceInput.checked = value; document.body.classList.toggle('motion-reduced', value); cancelTurn(); }
  reduceInput.addEventListener('change', () => setReduced(reduceInput.checked));
  motion.addEventListener('change', event => setReduced(event.matches));
  function syncFullscreen() {
    const active = !!document.fullscreenElement || root.classList.contains('expanded');
    byAction('fullscreen').setAttribute('aria-label', active ? 'Exit full screen' : 'Enter full screen');
    byAction('fullscreen').title = active ? 'Exit full screen' : 'Full screen';
    cancelTurn(); requestAnimationFrame(fit);
  }
  function exitExpanded() {
    root.classList.remove('expanded'); document.body.style.overflow = previousOverflow;
    if (expandedFrame) {
      expandedFrame.frame.style.cssText = expandedFrame.style;
      expandedFrame.body.style.overflow = expandedFrame.overflow;
      expandedFrame = null;
    }
    syncFullscreen(); lastFocused?.focus();
  }
  function expandFrame() {
    // On our same-origin case-study page, expand the iframe as well as its reader.
    // Cross-origin embeds keep the in-frame fallback and the original PDF links.
    try {
      const frame = window.frameElement;
      if (!frame) return;
      const body = frame.ownerDocument.body;
      expandedFrame = { frame, body, style: frame.style.cssText, overflow: body.style.overflow };
      body.style.overflow = 'hidden';
      frame.style.cssText += ';position:fixed;inset:0;width:100vw;height:100dvh;max-width:none;max-height:none;z-index:2147483647;border:0;';
    } catch { /* A cross-origin parent cannot be changed by this reader. */ }
  }
  byAction('fullscreen').addEventListener('click', async () => {
    cancelTurn();
    if (document.fullscreenElement) { await document.exitFullscreen(); return; }
    if (root.classList.contains('expanded')) { exitExpanded(); return; }
    lastFocused = document.activeElement;
    if (root.requestFullscreen && document.fullscreenEnabled) { try { await root.requestFullscreen(); return; } catch { /* Embedded browsers may deny native full screen. */ } }
    previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; expandFrame(); root.classList.add('expanded'); syncFullscreen();
    announce('Expanded reader. Press Escape or the full screen button to close.');
  });
  document.addEventListener('fullscreenchange', syncFullscreen);
  const observer = new ResizeObserver(() => { cancelTurn(); fit(); }); observer.observe(stage);
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelTurn(); });
  setReduced(reduced); draw();
  for (let n = 1; n <= 6; n++) { const img = new Image(); img.src = imagePath(n); }
})();
