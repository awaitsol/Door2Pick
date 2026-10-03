/*
 * Door2Pick cart extras: gift wrap checkbox and gift message
 * (markup in snippets/d2p-gift-wrap.liquid).
 *
 * Event delegation on document, so it keeps working after the theme swaps in
 * fresh cart HTML. After adding or removing gift wrap it fires the same
 * "shopify:cart:lines-update" event the theme listens for, so the drawer,
 * totals and cart count refresh without a reload.
 */
(() => {
  if (window.__d2pGiftReady) return;
  window.__d2pGiftReady = true;
  const root = window.Shopify?.routes?.root || '/';

  // Tell the theme the cart changed so the drawer, totals and count refresh.
  const announce = async () => {
    const cart = await fetch(`${root}cart.js`).then((r) => r.json());
    const event = new Event('shopify:cart:lines-update', { bubbles: true });
    event.promise = Promise.resolve({
      cart: { totalQuantity: cart.item_count },
      detail: { itemCount: cart.item_count },
    });
    document.dispatchEvent(event);
  };

  document.addEventListener('change', async (e) => {
    const box = e.target.closest('[data-d2p-gift-toggle]');
    if (!box) return;
    const wrap = box.closest('[data-d2p-gift]');
    const id = Number(wrap.dataset.variantId);
    box.disabled = true;
    try {
      const res = box.checked
        ? await fetch(`${root}cart/add.js`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: [{ id, quantity: 1 }] }) })
        : await fetch(`${root}cart/change.js`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: String(id), quantity: 0 }) });
      if (!res.ok) throw new Error();
      await announce();
    } catch (err) {
      box.checked = !box.checked;
      wrap.querySelector('[data-d2p-gift-status]').textContent = 'Could not update gift wrap. Please try again.';
    } finally {
      box.disabled = false;
    }
  });

  let timer;
  document.addEventListener('input', (e) => {
    const field = e.target.closest('[data-d2p-gift-message]');
    if (!field) return;
    const status = field.closest('[data-d2p-gift]').querySelector('[data-d2p-gift-status]');
    clearTimeout(timer);
    timer = setTimeout(async () => {
      try {
        await fetch(`${root}cart/update.js`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ attributes: { 'Gift message': field.value.trim() } }) });
        status.textContent = field.value.trim() ? 'Gift message saved' : '';
      } catch (err) {
        status.textContent = 'Could not save the message.';
      }
    }, 600);
  });
})();
