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
      id: 'edgeLabels',
      label: 'Edge labels',
      desc: 'Branch type prefix [Continue], [Escalate], [Delegate], etc.',
      defaultEnabled: false, // false = hidden by default
      htmlClass: 'show-edge-labels',
      // when value is true → add class (show)
      classWhen: 'true',
    },
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
      pop.style.top = (rect.bottom + window.scrollY + 4) + 'px';
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
})();
