// Promo code (simple demo)
(function(){
    const SUPPORTED_CODES = ['WELCOME10','BAKE10']; // case-insensitive
    const STORAGE_KEY = 'freshPastriesPromo';

    function normalize(code){ return (code || '').toString().trim().toUpperCase(); }
    function getCartInstance(){
        if (typeof window !== 'undefined' && window.cart) return window.cart;
        try { if (typeof cart !== 'undefined' && cart) return cart; } catch (e) {}
        return null;
    }

    function getSubtotal(){ const c = getCartInstance(); return (c && typeof c.getTotal === 'function') ? c.getTotal() : 0; }

    function announce(message){
        const ann = document.getElementById('cart-announcer') || document.getElementById('promo-announcer');
        if (ann) ann.textContent = message;
    }

    function showPromoError(message) {
        clearPromoError();
        const existing = document.getElementById('promo-popup');
        if (existing) existing.remove();

        const popup = document.createElement('div');
        popup.id = 'promo-popup';
        popup.className = 'promo-popup';
    popup.setAttribute('role', 'alert');
    popup.setAttribute('aria-live', 'assertive');
    popup.setAttribute('aria-atomic', 'true');
    popup.textContent = message;
    popup.classList.add('fade-in');

        const promoSection = document.querySelector('.promo-section');
        if (promoSection && promoSection.parentNode) {
            promoSection.insertAdjacentElement('afterend', popup);
        } else {
            document.body.appendChild(popup);
        }

        // auto-dismiss after 4 seconds
        popup.dataset.timeout = setTimeout(() => {
            try { popup.remove(); } catch(e) {}
        }, 4000);
    }

    function clearPromoError() {
        try {
            const popup = document.getElementById('promo-popup');
            if (popup) {
                const to = popup.dataset.timeout;
                if (to) clearTimeout(to);
                popup.remove();
            }
        } catch (e) {}
    }

    function applyPromo(code){
        const c = normalize(code);
        if (!c) { announce('Please enter a promo code.'); return false; }
        if (!SUPPORTED_CODES.includes(c)) {
            announce('Promo code not recognized.');
            showPromoError('Invalid promo code.');
            return false;
        }

        const percent = 0.10;
        const promoObj = { code: c, percent: percent };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(promoObj)); } catch (e) { console.error(e); }

    const cartInstance = getCartInstance();
    if (cartInstance && typeof cartInstance.updateOrderSummary === 'function') cartInstance.updateOrderSummary();

    clearPromoError();
    const discount = getSubtotal() * percent;
    announce(Promo ${c} applied. You saved ₱${discount.toFixed(2)}.);

        const btn = document.querySelector('.promo-btn');
        if (btn) {
            // Keep the button enabled so the user can remove the applied promo.
            btn.disabled = false;
            btn.textContent = 'Remove';
            btn.setAttribute('aria-pressed','true');
        }
        return true;
    }

    function clearPromo(){
    try { localStorage.removeItem(STORAGE_KEY); } catch(e) {  }
    clearPromoError();
    const cartInstance = getCartInstance();
    if (cartInstance && typeof cartInstance.updateOrderSummary === 'function') cartInstance.updateOrderSummary();
        const btn = document.querySelector('.promo-btn');
        if (btn) { btn.disabled = false; btn.textContent = 'Apply'; btn.removeAttribute('aria-pressed'); }
        announce('Promo removed.');
    }

    document.addEventListener('DOMContentLoaded', function(){
        const input = document.querySelector('.promo-input');
        const btn = document.querySelector('.promo-btn');
        if (!input || !btn) return;

        btn.addEventListener('click', function(e){
            e.preventDefault();
            const code = input.value || '';
            // If the button currently offers removal, respect that first.
            if (btn.textContent && btn.textContent.toLowerCase().indexOf('remove') !== -1) {
                clearPromo();
                input.value = '';
                return;
            }
            if (!code.trim()) {
                clearPromo();
                return;
            }
            applyPromo(code);
        });

        input.addEventListener('keydown', function(e){
            if (e.key === 'Enter') {
                e.preventDefault();
                const code = input.value || '';
                if (!code.trim()) {
                    clearPromo();
                } else {
                    applyPromo(code);
                }
            }
        });

        input.addEventListener('input', function(){
            clearPromoError();
            try {
                const promoJson = localStorage.getItem(STORAGE_KEY);
                const appliedCode = promoJson ? (JSON.parse(promoJson) || {}).code : null;
                const val = normalize(input.value);
                const btnEl = document.querySelector('.promo-btn');
                if (!btnEl) return;
                if (appliedCode && val === appliedCode) {
                    btnEl.textContent = 'Remove';
                    btnEl.disabled = false;
                    btnEl.setAttribute('aria-pressed','true');
                } else {
                    btnEl.textContent = 'Apply';
                    btnEl.disabled = false;
                    btnEl.removeAttribute('aria-pressed');
                }
            } catch(e) { /* ignore */ }
        });

        try {
            const promoJson = localStorage.getItem(STORAGE_KEY);
            if (promoJson) {
                const promo = JSON.parse(promoJson);
                    if (promo && promo.code) {
                    input.value = promo.code;
                    // allow removal from the UI
                    btn.disabled = false;
                    btn.textContent = 'Remove';
                    btn.setAttribute('aria-pressed','true');
                    const cartInstance = getCartInstance();
                    if (cartInstance && typeof cartInstance.updateOrderSummary === 'function') cartInstance.updateOrderSummary();
                }
            }
        } catch (e) {  }

        if (!document.getElementById('promo-announcer')) {
            const span = document.createElement('span');
            span.id = 'promo-announcer';
            span.className = 'sr-only';
            span.setAttribute('aria-live','polite');
            span.setAttribute('aria-atomic','true');
            document.body.appendChild(span);
        }
    });

    window.applyPromoCode = applyPromo;
    window.clearPromoCode = clearPromo;
    window.getAppliedPromo = function(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch(e){ return null; } };

})();