(function () {
  'use strict';

  if (window.__ECOFOCUS_NEWSLETTER_POPUP__) {
    return;
  }

  var DEFAULT_CONFIG = {
    submitUrl: '/api/hubspot/newsletter',
    privacyUrl: '/legal#privacy-policy',
    delayMs: 7000,
    frequencyDays: 7,
    zIndex: 2147483000,
    heading: 'Get EcoNuggets Weekly',
    subheading:
      'Bite-sized sustainability intelligence for marketers and brand leaders. Data-backed, practical, and usable.',
    ctaText: 'Subscribe',
    successTitle: 'You are subscribed',
    successBody: 'Thanks for joining EcoNuggets. Watch your inbox for the next issue.',
    showOnExitIntent: true,
    showOnScrollPercent: 45,
    imageUrl: '/images/newsletter-bg.png',
    accentA: '#14b8a6',
    accentB: '#1d4ed8',
    backgroundA: '#081a2b',
    backgroundB: '#0f2840'
  };

  var storageKeys = {
    dismissedUntil: 'ef_newsletter_dismissed_until'
  };

  var state = {
    config: null,
    root: null,
    shown: false,
    submitting: false,
    startedAt: Date.now(),
    timeoutId: null,
    cleanup: []
  };

  function extend(base, overrides) {
    var out = {};
    var k;
    for (k in base) out[k] = base[k];
    if (overrides) {
      for (k in overrides) {
        if (Object.prototype.hasOwnProperty.call(overrides, k) && overrides[k] !== undefined) {
          out[k] = overrides[k];
        }
      }
    }
    return out;
  }

  function getCookie(name) {
    var matches = document.cookie.match(new RegExp('(?:^|;\\s*)' + name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&') + '=([^;]*)'));
    return matches ? decodeURIComponent(matches[1]) : '';
  }

  function getUTM() {
    var params = new URLSearchParams(window.location.search || '');
    return {
      source: params.get('utm_source') || '',
      medium: params.get('utm_medium') || '',
      campaign: params.get('utm_campaign') || ''
    };
  }

  function getDismissedUntil() {
    var raw = localStorage.getItem(storageKeys.dismissedUntil);
    var ts = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(ts) ? ts : 0;
  }

  function setDismissed(days) {
    var until = Date.now() + Math.max(1, days) * 24 * 60 * 60 * 1000;
    localStorage.setItem(storageKeys.dismissedUntil, String(until));
  }

  function shouldShow() {
    return Date.now() > getDismissedUntil();
  }

  function addStyle(config) {
    if (document.getElementById('ef-newsletter-popup-style')) {
      return;
    }
    var style = document.createElement('style');
    style.id = 'ef-newsletter-popup-style';
    style.textContent =
      '.efnp-backdrop{position:fixed;inset:0;z-index:' +
      config.zIndex +
      ';display:none;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.56);backdrop-filter:blur(4px)}' +
      '.efnp-backdrop[data-open="1"]{display:flex;animation:efnpFade .2s ease-out}' +
      '.efnp-modal{width:min(760px,100%);border-radius:22px;overflow:hidden;background:#fff;box-shadow:0 30px 80px rgba(0,0,0,.4);font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif}' +
      '.efnp-shell{display:grid;grid-template-columns:1.1fr 1fr}' +
      '.efnp-panel{background:linear-gradient(140deg,' +
      config.backgroundA +
      ' 0%,' +
      config.backgroundB +
      ' 72%);color:#fff;padding:28px;position:relative;isolation:isolate}' +
      '.efnp-pill{display:inline-block;font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:7px 10px;border-radius:999px;background:rgba(20,184,166,.18);color:#6ee7d8;border:1px solid rgba(45,212,191,.3)}' +
      '.efnp-title{margin:14px 0 8px;font-size:34px;line-height:1.08;font-weight:800}' +
      '.efnp-title .efnp-highlight{background-image:linear-gradient(90deg,#3b82f6,#2dd4bf,#10b981);background-size:200% 200%;background-position:0% 50%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:efnpGradient 8s linear infinite}' +
      '.efnp-sub{margin:0;font-size:15px;line-height:1.5;color:rgba(255,255,255,.88)}' +
      '.efnp-form{padding:24px;position:relative}' +
      '.efnp-close{position:absolute;right:10px;top:10px;width:34px;height:34px;border-radius:999px;border:0;background:#f0f4f8;color:#0f172a;font-size:18px;cursor:pointer}' +
      '.efnp-label{display:block;font-size:12px;font-weight:700;color:#334155;margin-bottom:6px}' +
      '.efnp-input{width:100%;border:1px solid #cbd5e1;border-radius:10px;padding:10px 12px;font-size:14px;line-height:1.2}' +
      '.efnp-input:focus{outline:2px solid rgba(20,184,166,.35);border-color:' +
      config.accentA +
      '}' +
      '.efnp-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
      '.efnp-row{margin-bottom:10px}' +
      '.efnp-consent{display:flex;align-items:flex-start;gap:8px;font-size:12px;line-height:1.45;color:#475569;margin-top:8px}' +
      '.efnp-consent input{margin-top:2px}' +
      '.efnp-consent a{color:#0f766e;text-decoration:underline}' +
      '.efnp-error{font-size:12px;color:#dc2626;margin:8px 0 0}' +
      '.efnp-submit{margin-top:12px;width:100%;border:0;border-radius:999px;padding:12px 18px;background:#059669;color:#fff;font-weight:600;cursor:pointer;transition:background-color .2s ease}' +
      '.efnp-submit:hover{background:#047857}' +
      '.efnp-submit:focus-visible{outline:2px solid rgba(16,185,129,.35);outline-offset:2px}' +
      '.efnp-submit[disabled]{opacity:.7;cursor:not-allowed}' +
      '.efnp-note{font-size:11px;color:#64748b;margin:8px 0 0}' +
      '.efnp-success{display:none;padding:30px 24px}' +
      '.efnp-success[data-open="1"]{display:block}' +
      '.efnp-success h3{margin:0 0 8px;font-size:22px;color:#0f172a}' +
      '.efnp-success p{margin:0;color:#334155;font-size:14px;line-height:1.5}' +
      '@media (max-width:760px){.efnp-backdrop{align-items:flex-end;padding:0}.efnp-modal{border-radius:20px 20px 0 0;max-height:92vh;overflow:auto}.efnp-shell{grid-template-columns:1fr}.efnp-title{font-size:28px}.efnp-grid{grid-template-columns:1fr}}' +
      '@keyframes efnpFade{from{opacity:0}to{opacity:1}}' +
      '@keyframes efnpGradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}';

    document.head.appendChild(style);
  }

  function buildMarkup(config) {
    var root = document.createElement('div');
    root.className = 'efnp-backdrop';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'EcoNuggets signup popup');
    root.innerHTML =
      '<div class="efnp-modal" role="document">' +
      '  <div class="efnp-shell" data-ui="shell">' +
      '    <section class="efnp-panel">' +
      '      <span class="efnp-pill">EcoNuggets Newsletter</span>' +
      '      <h2 class="efnp-title">' +
      config.heading.replace(/weekly/i, '<span class="efnp-highlight">$&</span>') +
      '</h2>' +
      '      <p class="efnp-sub">' +
      config.subheading +
      '</p>' +
      '    </section>' +
      '    <section class="efnp-form">' +
      '      <button type="button" class="efnp-close" aria-label="Close popup">&times;</button>' +
      '      <form novalidate>' +
      '        <div class="efnp-grid">' +
      '          <div class="efnp-row"><label class="efnp-label" for="efnp-firstname">First name</label><input class="efnp-input" id="efnp-firstname" name="firstname" autocomplete="given-name"></div>' +
      '          <div class="efnp-row"><label class="efnp-label" for="efnp-lastname">Last name</label><input class="efnp-input" id="efnp-lastname" name="lastname" autocomplete="family-name"></div>' +
      '        </div>' +
      '        <div class="efnp-row"><label class="efnp-label" for="efnp-email">Email <span aria-hidden="true">*</span></label><input class="efnp-input" id="efnp-email" name="email" type="email" required autocomplete="email" inputmode="email"></div>' +
      '        <label class="efnp-consent"><input name="consent" type="checkbox" required><span>I agree to receive EcoNuggets. See our <a href="' +
      config.privacyUrl +
      '" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</span></label>' +
      '        <input type="text" name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;opacity:0;height:0;width:0">' +
      '        <p class="efnp-error" hidden></p>' +
      '        <button class="efnp-submit" type="submit">' +
      config.ctaText +
      '</button>' +
      '        <p class="efnp-note">No spam. Unsubscribe anytime.</p>' +
      '      </form>' +
      '      <div class="efnp-success" data-open="0">' +
      '        <h3>' +
      config.successTitle +
      '</h3>' +
      '        <p>' +
      config.successBody +
      '</p>' +
      '      </div>' +
      '    </section>' +
      '  </div>' +
      '</div>';

    document.body.appendChild(root);
    return root;
  }

  function renderError(root, message) {
    var node = root.querySelector('.efnp-error');
    if (!node) return;
    if (!message) {
      node.hidden = true;
      node.textContent = '';
      return;
    }
    node.hidden = false;
    node.textContent = message;
  }

  function closePopup(trackDismiss) {
    if (!state.root) return;
    state.root.setAttribute('data-open', '0');
    document.body.style.removeProperty('overflow');
    if (trackDismiss) {
      setDismissed(state.config.frequencyDays);
    }
  }

  function openPopup() {
    if (!state.root || state.shown) return;
    if (!shouldShow()) return;
    state.root.setAttribute('data-open', '1');
    state.shown = true;
    document.body.style.overflow = 'hidden';

    var emailInput = state.root.querySelector('#efnp-email');
    if (emailInput) {
      setTimeout(function () {
        emailInput.focus();
      }, 80);
    }
  }

  async function submitForm(root, form) {
    if (state.submitting) return;
    state.submitting = true;
    renderError(root, '');

    var submitBtn = root.querySelector('.efnp-submit');
    var success = root.querySelector('.efnp-success');
    var shell = root.querySelector('[data-ui="shell"]');

    var data = new FormData(form);
    var email = String(data.get('email') || '').trim().toLowerCase();
    var consent = data.get('consent') === 'on';
    var hp = String(data.get('website') || '');

    if (!email) {
      renderError(root, 'Please enter your email.');
      state.submitting = false;
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      renderError(root, 'Please use a valid email address.');
      state.submitting = false;
      return;
    }
    if (!consent) {
      renderError(root, 'Please agree to receive EcoNuggets.');
      state.submitting = false;
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
    }

    try {
      var res = await fetch(state.config.submitUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          firstname: String(data.get('firstname') || '').trim(),
          lastname: String(data.get('lastname') || '').trim(),
          consent: consent,
          hutk: getCookie('hubspotutk'),
          pageUri: window.location.href,
          pageName: document.title,
          utm: getUTM(),
          hp: hp,
          elapsedMs: Date.now() - state.startedAt
        })
      });

      var payload = await res.json().catch(function () {
        return { ok: false };
      });

      if (!res.ok || !payload.ok) {
        throw new Error(payload.error || 'Unable to subscribe right now.');
      }

      setDismissed(state.config.frequencyDays);

      if (shell && success) {
        shell.style.display = 'none';
        success.setAttribute('data-open', '1');
      }

      setTimeout(function () {
        closePopup(false);
      }, 1800);
    } catch (err) {
      renderError(root, err && err.message ? err.message : 'Something went wrong. Please try again.');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = state.config.ctaText;
      }
    } finally {
      state.submitting = false;
    }
  }

  function wireEvents(root, config) {
    var closeBtn = root.querySelector('.efnp-close');
    var form = root.querySelector('form');

    var onBackdropClick = function (e) {
      if (e.target === root) {
        closePopup(true);
      }
    };

    var onEsc = function (e) {
      if (e.key === 'Escape') {
        closePopup(true);
      }
    };

    var onClose = function () {
      closePopup(true);
    };

    var onSubmit = function (e) {
      e.preventDefault();
      submitForm(root, form);
    };

    root.addEventListener('click', onBackdropClick);
    document.addEventListener('keydown', onEsc);
    if (closeBtn) closeBtn.addEventListener('click', onClose);
    if (form) form.addEventListener('submit', onSubmit);

    state.cleanup.push(function () {
      root.removeEventListener('click', onBackdropClick);
      document.removeEventListener('keydown', onEsc);
      if (closeBtn) closeBtn.removeEventListener('click', onClose);
      if (form) form.removeEventListener('submit', onSubmit);
    });

    if (config.showOnExitIntent) {
      var onMouseOut = function (e) {
        if (!state.shown && e.clientY <= 8) {
          openPopup();
        }
      };
      document.addEventListener('mouseout', onMouseOut);
      state.cleanup.push(function () {
        document.removeEventListener('mouseout', onMouseOut);
      });
    }

    if (typeof config.showOnScrollPercent === 'number' && config.showOnScrollPercent > 0) {
      var onScroll = function () {
        if (state.shown) return;
        var doc = document.documentElement;
        var max = doc.scrollHeight - window.innerHeight;
        if (max <= 0) return;
        var p = (window.scrollY / max) * 100;
        if (p >= config.showOnScrollPercent) {
          openPopup();
          window.removeEventListener('scroll', onScroll);
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      state.cleanup.push(function () {
        window.removeEventListener('scroll', onScroll);
      });
    }
  }

  function init(options) {
    var mergedConfig = extend(DEFAULT_CONFIG, window.EcoFocusNewsletterPopupConfig || {});
    state.config = extend(mergedConfig, options || {});
    state.startedAt = Date.now();

    if (!shouldShow()) {
      return;
    }

    addStyle(state.config);
    state.root = buildMarkup(state.config);
    wireEvents(state.root, state.config);

    state.timeoutId = window.setTimeout(openPopup, Math.max(0, state.config.delayMs));
  }

  function destroy() {
    if (state.timeoutId) {
      clearTimeout(state.timeoutId);
      state.timeoutId = null;
    }
    for (var i = 0; i < state.cleanup.length; i += 1) {
      state.cleanup[i]();
    }
    state.cleanup = [];
    if (state.root && state.root.parentNode) {
      state.root.parentNode.removeChild(state.root);
    }
    state.root = null;
    state.shown = false;
    document.body.style.removeProperty('overflow');
  }

  window.__ECOFOCUS_NEWSLETTER_POPUP__ = {
    init: init,
    open: openPopup,
    close: function () {
      closePopup(true);
    },
    destroy: destroy,
    version: '1.0.0'
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init();
    });
  } else {
    init();
  }
})();
