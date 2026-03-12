(function () {
  'use strict';

  var STORAGE_KEY = 'shopify_wishlist';

  /* ── LocalStorage helpers ── */
  function getWishlist() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { return []; }
  }

  function saveWishlist(list) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }
    catch (e) { /* storage full / private mode */ }
  }

  function isWishlisted(id) {
    return getWishlist().some(function (item) { return item.id == id; });
  }

  function addToWishlist(product) {
    var list = getWishlist();
    if (!list.some(function (i) { return i.id == product.id; })) {
      list.push(product);
      saveWishlist(list);
    }
  }

  function removeFromWishlist(id) {
    var list = getWishlist().filter(function (i) { return i.id != id; });
    saveWishlist(list);
  }

  /* ── Toast ── */
  var toastTimer;
  function showToast(msg) {
    var toast = document.querySelector('.wl-toast');
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.classList.add('wl-toast--visible');
    toastTimer = setTimeout(function () {
      toast.classList.remove('wl-toast--visible');
    }, 2600);
  }

  /* ── Sync all buttons for same product ── */
  function syncButtons(productId, added) {
    document.querySelectorAll('[data-wishlist-btn][data-product-id="' + productId + '"]')
      .forEach(function (btn) {
        btn.setAttribute('aria-pressed', added ? 'true' : 'false');
        btn.setAttribute('aria-label',
          (added ? 'Remove ' : 'Add ') + btn.dataset.productTitle + ' ' + (added ? 'from' : 'to') + ' wishlist');
      });
  }

  /* ── Burst animation ── */
  function triggerBurst(btn) {
    btn.classList.remove('wl-btn--bursting');
    /* force reflow */
    void btn.offsetWidth;
    btn.classList.add('wl-btn--bursting');
    btn.addEventListener('animationend', function handler(e) {
      if (e.target === btn.querySelector('.wl-btn__dot:last-child')) {
        btn.classList.remove('wl-btn--bursting');
        btn.removeEventListener('animationend', handler);
      }
    });
    setTimeout(function () { btn.classList.remove('wl-btn--bursting'); }, 700);
  }

  /* ── Init each button ── */
  function initButton(btn) {
    var id = btn.dataset.productId;
    if (!id) return;

    /* Set initial state */
    if (isWishlisted(id)) {
      btn.setAttribute('aria-pressed', 'true');
    }

    btn.addEventListener('click', function () {
      var added = btn.getAttribute('aria-pressed') === 'true';

      if (!added) {
        /* — ADD — */
        addToWishlist({
          id:    id,
          title: btn.dataset.productTitle,
          url:   btn.dataset.productUrl,
          image: btn.dataset.productImage,
          price: btn.dataset.productPrice,
        });
        syncButtons(id, true);
        triggerBurst(btn);
        showToast('✓  Added to your wishlist');

        /* Dispatch custom event for theme integrations */
        document.dispatchEvent(new CustomEvent('wishlist:added', {
          detail: { productId: id, button: btn }
        }));

      } else {
        /* — REMOVE — */
        removeFromWishlist(id);
        syncButtons(id, false);
        btn.classList.add('wl-btn--removing');
        setTimeout(function () { btn.classList.remove('wl-btn--removing'); }, 500);
        showToast('Removed from wishlist');

        document.dispatchEvent(new CustomEvent('wishlist:removed', {
          detail: { productId: id, button: btn }
        }));
      }
    });
  }

  /* ── Boot ── */
  function init() {
    document.querySelectorAll('[data-wishlist-btn]').forEach(initButton);
  }

  /* Support theme section reloads (Theme Editor) */
  document.addEventListener('shopify:section:load', init);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
