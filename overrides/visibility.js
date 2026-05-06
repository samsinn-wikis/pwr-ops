/* procmd visibility controls — eye-icon popover with per-category toggles.
 *
 * Persists prefs to localStorage at pwr-eops:visibility-prefs (versioned).
 * Adds override classes to <html> immediately. An inline <script> in main.html
 * applies the same classes pre-paint to avoid FOUC.
 *
 * No deps; vanilla JS; ~140 LOC.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'pwr-eops:visibility-prefs';
  var SCHEMA_VERSION = 1;

  // Categories: id, label, description, default state, classToAdd-when-non-default.
  // The class added on <html> is what flips the display.
  // For edge-labels: defaults to hidden; class 'show-edge-labels' shows them.
  // For rationale / step-id: default visible; class 'hide-X' hides them.
  var CATEGORIES = [
    {
      id: 'rationale',
      label: 'Rationale',
      desc: 'Because: / Against: lines under branches',
      defaultEnabled: true, // true = visible by default
      htmlClass: 'hide-rationale',
      // when value is false → add class (hide)
      classWhen: 'false',
    },
    {
      id: 'stepIdSuffix',
      label: 'Step IDs',
      desc: 'Code-span suffix on step headings',
      defaultEnabled: true,
      htmlClass: 'hide-step-id-suffix',
      classWhen: 'false',
    },
  ];

  function defaultPrefs() {
    var p = {};
    for (var i = 0; i < CATEGORIES.length; i++) {
      p[CATEGORIES[i].id] = CATEGORIES[i].defaultEnabled;
    }
    return p;
  }

  function loadPrefs() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultPrefs();
      var p = JSON.parse(raw);
      if (p.version !== SCHEMA_VERSION) return defaultPrefs();
      var out = defaultPrefs();
      for (var k in p.prefs) if (k in out) out[k] = !!p.prefs[k];
      return out;
    } catch (e) {
      return defaultPrefs();
    }
  }

  function savePrefs(prefs) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: SCHEMA_VERSION, prefs: prefs })
      );
    } catch (e) {/* quota / disabled */}
  }

  function applyPrefs(prefs) {
    var html = document.documentElement;
    for (var i = 0; i < CATEGORIES.length; i++) {
      var c = CATEGORIES[i];
      var enabled = prefs[c.id];
      var addClass = (c.classWhen === 'true' ? enabled : !enabled);
      html.classList.toggle(c.htmlClass, addClass);
    }
  }

  // SVG eye icon (heroicons-style; 24×24 viewBox; currentColor)
  var EYE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';

  function buildPopover(prefs) {
    var pop = document.createElement('div');
    pop.className = 'procmd-vis-popover';
    pop.setAttribute('role', 'dialog');
    pop.setAttribute('aria-label', 'Visibility controls');
    pop.innerHTML = '<h4>Show / hide</h4>';
    CATEGORIES.forEach(function (c) {
      var row = document.createElement('label');
      row.className = 'procmd-vis-row';
      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = !!prefs[c.id];
      cb.setAttribute('aria-label', c.label);
      cb.addEventListener('change', function () {
        prefs[c.id] = cb.checked;
        applyPrefs(prefs);
        savePrefs(prefs);
      });
      var labelWrap = document.createElement('span');
      labelWrap.innerHTML = '<strong>' + c.label + '</strong><span class="procmd-vis-desc">' + c.desc + '</span>';
      row.appendChild(cb);
      row.appendChild(labelWrap);
      pop.appendChild(row);
    });
    var resetWrap = document.createElement('div');
    resetWrap.className = 'procmd-vis-reset';
    var resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.textContent = 'Reset defaults';
    resetBtn.addEventListener('click', function () {
      var d = defaultPrefs();
      for (var k in d) prefs[k] = d[k];
      applyPrefs(prefs);
      savePrefs(prefs);
      // refresh checkbox state in popover
      var cbs = pop.querySelectorAll('input[type=checkbox]');
      CATEGORIES.forEach(function (c, i) { cbs[i].checked = !!prefs[c.id]; });
    });
    resetWrap.appendChild(resetBtn);
    pop.appendChild(resetWrap);
    return pop;
  }

  function mountButton(prefs) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'procmd-vis-button';
    btn.setAttribute('aria-label', 'Visibility controls');
    btn.innerHTML = EYE_SVG;

    var headerEnd =
      document.querySelector('.md-header__inner .md-header__option:last-child') ||
      document.querySelector('.md-header__inner') ||
      null;
    if (headerEnd && headerEnd.classList.contains('md-header__option')) {
      headerEnd.parentNode.insertBefore(btn, headerEnd.nextSibling);
    } else if (headerEnd) {
      headerEnd.appendChild(btn);
    } else {
      // Fallback: floating button
      btn.classList.add('procmd-vis-floating');
      document.body.appendChild(btn);
    }

    var pop = null;
    function closePop() {
      if (pop && pop.parentNode) pop.parentNode.removeChild(pop);
      pop = null;
      document.removeEventListener('click', onDocClick, true);
      document.removeEventListener('keydown', onKey);
    }
    function onDocClick(e) {
      if (pop && !pop.contains(e.target) && !btn.contains(e.target)) closePop();
    }
    function onKey(e) {
      if (e.key === 'Escape') closePop();
    }
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (pop) { closePop(); return; }
      pop = buildPopover(prefs);
      var rect = btn.getBoundingClientRect();
      // Fixed positioning — viewport-anchored so it stays put on scroll.
      pop.style.top = (rect.bottom + 4) + 'px';
      pop.style.right = Math.max(8, window.innerWidth - rect.right) + 'px';
      document.body.appendChild(pop);
      document.addEventListener('click', onDocClick, true);
      document.addEventListener('keydown', onKey);
      // Focus first checkbox for keyboard users
      var first = pop.querySelector('input[type=checkbox]');
      if (first) first.focus();
    });
  }

  function init() {
    var prefs = loadPrefs();
    applyPrefs(prefs);
    mountButton(prefs);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ---- Source modal --------------------------------------------------------
  // On procedure pages (those with a baked raw-source block), inject a
  // hover-revealed icon top-right of the article body that opens a modal
  // showing the raw markdown.

  var CODE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';

  function getSourceText() {
    var s = document.querySelector('.procmd-source-raw');
    if (!s) return null;
    // textContent decodes any HTML entities the markdown parser may have applied
    return s.textContent;
  }

  function buildSourceModal(text, title) {
    var overlay = document.createElement('div');
    overlay.className = 'procmd-source-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Raw markdown source');

    var modal = document.createElement('div');
    modal.className = 'procmd-source-modal';

    var head = document.createElement('div');
    head.className = 'procmd-source-modal-head';
    var titleEl = document.createElement('span');
    titleEl.className = 'procmd-source-modal-title';
    titleEl.textContent = title || 'Raw source';
    var actions = document.createElement('span');
    actions.className = 'procmd-source-modal-actions';
    var copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(text).then(function () {
        copyBtn.textContent = 'Copied';
        setTimeout(function () { copyBtn.textContent = 'Copy'; }, 1200);
      }).catch(function () {
        copyBtn.textContent = 'Copy failed';
      });
    });
    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = 'Close';
    actions.appendChild(copyBtn);
    actions.appendChild(closeBtn);
    head.appendChild(titleEl);
    head.appendChild(actions);

    var pre = document.createElement('pre');
    var code = document.createElement('code');
    code.textContent = text;
    pre.appendChild(code);

    modal.appendChild(head);
    modal.appendChild(pre);
    overlay.appendChild(modal);

    function close() {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', onKey);

    return overlay;
  }

  function mountSourceIcon() {
    var sourceEl = document.querySelector('.procmd-source-raw');
    if (!sourceEl) return; // not a procedure page
    var article = document.querySelector('.md-content__inner') || document.querySelector('article');
    if (!article) return;
    if (getComputedStyle(article).position === 'static') article.style.position = 'relative';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'procmd-source-icon';
    btn.setAttribute('aria-label', 'View raw markdown source');
    btn.title = 'View raw markdown source';
    btn.innerHTML = CODE_SVG;

    btn.addEventListener('click', function () {
      var text = getSourceText();
      if (!text) return;
      var titleEl = article.querySelector('h1');
      var title = titleEl ? 'Raw source — ' + titleEl.textContent.replace(/¶$/, '').trim() : 'Raw source';
      var modal = buildSourceModal(text, title);
      document.body.appendChild(modal);
    });

    article.insertBefore(btn, article.firstChild);
  }

  function initSource() { mountSourceIcon(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSource);
  } else {
    initSource();
  }
})();
