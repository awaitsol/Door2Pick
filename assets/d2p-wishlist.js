/*
 * Door2Pick wishlist.
 *
 * Saved products live in this browser's localStorage as a list of product
 * handles (newest first), so no account or app is needed. Every heart on the
 * page is a button with data-d2p-wish and data-handle; clicking one toggles
 * that product and every other heart for the same product updates with it.
 * The header link shows the count via [data-d2p-wish-count].
 */
(() => {
  const KEY = 'd2p:wishlist';
  const MAX = 60;

  const read = () => {
    try {
      const list = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(list) ? list.filter((h) => typeof h === 'string') : [];
    } catch (err) {
      return [];
    }
  };

  const write = (list) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
    } catch (err) {
      // Storage blocked (private mode): the hearts still toggle for this page view.
    }
  };

  const sync = () => {
    const list = read();
    document.querySelectorAll('[data-d2p-wish][data-handle]').forEach((btn) => {
      const saved = list.includes(btn.dataset.handle);
      btn.setAttribute('aria-pressed', saved ? 'true' : 'false');
      const label = btn.querySelector('[data-d2p-wish-label]');
      if (label) label.textContent = saved ? btn.dataset.labelSaved : btn.dataset.labelAdd;
    });
    document.querySelectorAll('[data-d2p-wish-count]').forEach((el) => {
      el.textContent = list.length;
      el.hidden = list.length === 0;
    });
  };

  const toggle = (handle) => {
    let list = read();
    list = list.includes(handle) ? list.filter((h) => h !== handle) : [handle, ...list];
    write(list);
    sync();
    document.dispatchEvent(new CustomEvent('d2p:wishlist-change', { detail: { list } }));
  };

  document.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-d2p-wish][data-handle]');
    if (!btn) return;
    // Hearts sit on top of card links; stop the click from opening the product.
    event.preventDefault();
    event.stopPropagation();
    toggle(btn.dataset.handle);
  });

  // Cards can arrive later (recommendations, recently viewed, infinite scroll),
  // so re-sync whenever new hearts appear.
  const observer = new MutationObserver((mutations) => {
    if (mutations.some((m) => [...m.addedNodes].some((n) => n.nodeType === 1 && (n.matches?.('[data-d2p-wish]') || n.querySelector?.('[data-d2p-wish]'))))) {
      sync();
    }
  });

  const start = () => {
    sync();
    observer.observe(document.body, { childList: true, subtree: true });
  };

  window.D2PWishlist = { read, toggle, sync };

  // Other tabs: keep counts in step.
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) sync();
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
