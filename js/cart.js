class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.init();
    }

    hydrateFromDOM() {
       
        const container = document.querySelector('.cart-items');
        if (!container) return;

        const domItems = Array.from(container.querySelectorAll('.cart-item'));
        if (!domItems.length) return;
        if (this.items.length > 0) return; 

        domItems.forEach((el, idx) => {
            const titleEl = el.querySelector('.cart-item-title');
            const priceEl = el.querySelector('.cart-item-price');
            const qtyEl = el.querySelector('.qty-display');
            const imgEl = el.querySelector('img');

            const name = titleEl ? titleEl.textContent.trim() : `Item ${idx + 1}`;
            let price = 0;
            if (priceEl) {
                const raw = priceEl.textContent.replace(/[^0-9.,]/g, '').replace(/,/g, '');
                price = parseFloat(raw) || 0;
            }
            const quantity = qtyEl ? parseInt(qtyEl.textContent) || 1 : 1;
            // ensure quantities are at least 1
            const safeQuantity = (Number.isInteger(quantity) && quantity >= 1) ? quantity : 1;
            const image = imgEl ? imgEl.src : 'images/logo.png';

            const existingId = el.dataset.itemId ? parseFloat(el.dataset.itemId) : null;
            const id = existingId || (Date.now() + idx); 

            this.items.push({
                id,
                name,
                price,
                image,
                variation: 'Regular',
                quantity: safeQuantity,
                category: ''
            });

            // Annotate DOM
            el.dataset.itemId = id;
            el.querySelectorAll('.qty-increase, .qty-decrease, .cart-item-remove').forEach(btn => {
                btn.dataset.itemId = id;
            });
        });

        // ensure any broken images in the hydrated DOM are replaced with fallback
        this.attachImageErrorHandlers();

        this.saveCart();
    }

    loadCart() {
        const cartData = localStorage.getItem('freshPastriesCart');
        return cartData ? JSON.parse(cartData) : [];
    }

    saveCart() {
        try {
            const key = 'freshPastriesCart';
            const newJson = JSON.stringify(this.items);
            const prevJson = localStorage.getItem(key);
            if (prevJson === newJson) {
                return;
            }
            localStorage.setItem(key, newJson);
        } catch (err) {
            console.error('Error saving cart to localStorage:', err);
        } finally {
            this.updateCartBadge();
        }
    }

    addItem(product) {
        const existingItem = this.items.find(item =>
            item.name === product.name && item.variation === product.variation
        );
        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            this.items.push({
                id: Date.now(),
                name: product.name,
                price: product.price,
                image: product.image,
                variation: product.variation || 'Regular',
                quantity: product.quantity,
                category: product.category || ''
            });
        }
        this.saveCart();
        this.showNotification(`${product.name} added to cart!`);
    }

    removeItem(itemId) {
        const removedItem = this.items.find(item => item.id === itemId);
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCart();
        this.renderCart();
        if (removedItem) {
            this.showNotification(`${removedItem.name} removed from cart.`);
        }
    }

    updateQuantity(itemId, quantity) {
        const item = this.items.find(item => item.id === itemId);
        if (!item) return;

        const valid = this.parseAndValidateQuantity(quantity);
        if (Number.isNaN(valid)) {
           
            try {
                const itemEl = document.querySelector(`.cart-item[data-item-id="${itemId}"]`);
                const qtyDisplay = itemEl ? itemEl.querySelector('.qty-display') : null;
                this.showQuantityErrorNear(qtyDisplay, 'Quantity must be at least 1.');
                if (qtyDisplay) qtyDisplay.focus();
            } catch (err) {
                alert('Quantity must be at least 1.');
            }
            return;
        }

        item.quantity = valid;
        this.saveCart();
        this.renderCart();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    parseAndValidateQuantity(value) {
        if (value === null || value === undefined) return NaN;
        const n = parseInt(value, 10);
        if (!Number.isInteger(n)) return NaN;
        return n >= 1 ? n : NaN;
    }

    showQuantityErrorNear(element, message) {
        if (!element || !element.parentNode) {
            alert(message);
            return;
        }
        const existing = element.parentNode.querySelector('.qty-error');
        if (existing) existing.remove();
        const span = document.createElement('span');
        span.className = 'qty-error';
        span.textContent = message;
        span.style.color = '#e74c3c';
        span.style.fontSize = '0.9em';
        span.style.marginLeft = '8px';
        element.parentNode.insertBefore(span, element.nextSibling);
        setTimeout(() => span.remove(), 3000);
    }

    updateCartBadge() {
        const badge = document.querySelector('.cart-icon');
        if (badge) {
            const count = this.getItemCount();
            let badgeElement = badge.querySelector('.cart-badge');

            if (count > 0) {
                if (!badgeElement) {
                    badgeElement = document.createElement('span');
                    badgeElement.className = 'cart-badge';
                    badge.appendChild(badgeElement);
                }
                badgeElement.textContent = count;
                badgeElement.setAttribute('aria-hidden', 'true');
                const live = document.getElementById('cart-count-live');
                if (live) live.textContent = `${count} item${count === 1 ? '' : 's'} in cart`;
            } else if (badgeElement) {
                badgeElement.remove();
                const live = document.getElementById('cart-count-live');
                if (live) live.textContent = 'Cart is empty';
            }
        }
    }

    showNotification(message) {
        const existing = document.querySelector('.cart-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);

        try {
            const announcer = document.getElementById('cart-announcer');
            if (announcer) announcer.textContent = message;
        } catch (e) {}

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    attachImageErrorHandlers() {
        const fallback = 'images/fallback.jpg';
        const imgs = Array.from(document.querySelectorAll('img'));
        imgs.forEach(img => {
            if (img.dataset.fallbackHandlerAttached === 'true') return;

            const onError = () => {
                try {
                    const srcLower = (img.src || '').toLowerCase();
                    if (srcLower.includes('fallback.jpg') || img.dataset.fallbackApplied === 'true') {
                        img.removeEventListener('error', onError);
                        return;
                    }
                    img.dataset.fallbackApplied = 'true';
                    img.src = fallback;
                } catch (err) {
                    img.removeEventListener('error', onError);
                }
            };

            img.addEventListener('error', onError);
            img.dataset.fallbackHandlerAttached = 'true';
        });
    }

    renderCart() {
        const cartItemsContainer = document.querySelector('.cart-items');
        if (!cartItemsContainer) return;

        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = `
                <h2>Shopping Cart</h2>
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="products.html" class="btn">Continue Shopping</a>
                </div>
            `;
            this.updateOrderSummary();
            return;
        }

        let itemsHTML = '<h2>Shopping Cart</h2>';
        this.items.forEach((item, index) => {
            itemsHTML += `
                <div class="cart-item" data-item-id="${item.id}">
                    <img class="cart-item-img" src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}${item.variation !== 'Regular' ? ` (${item.variation})` : ''}</div>
                        <div class="cart-item-row">
                            <span class="cart-item-price">Unit Price: ₱${this.formatPrice(item.price)}</span>
                            <span class="cart-item-total">Total: <strong>₱${this.formatPrice(item.price * item.quantity)}</strong></span>
                        </div>
                        <div class="cart-item-qty">
                            <button class="qty-btn qty-decrease" data-item-id="${item.id}" aria-label="Decrease quantity for ${item.name}" tabindex="0">-</button>
                            <span class="qty-display" aria-live="polite" aria-atomic="true">${item.quantity}</span>
                            <button class="qty-btn qty-increase" data-item-id="${item.id}" aria-label="Increase quantity for ${item.name}" tabindex="0">+</button>
                            <button class="cart-item-remove" data-item-id="${item.id}" title="Remove item" aria-label="Remove ${item.name} from cart" tabindex="0">
                                <i class="fas fa-trash" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = itemsHTML;
        this.attachImageErrorHandlers();
        this.updateOrderSummary();
    }

    formatPrice(price) {
        return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    updateOrderSummary() {
        const subtotal = this.getTotal();
        const vat = subtotal * 0.12;
        const deliveryFeeElement = document.querySelector('input[name="delivery-method"]:checked'); 
        const deliveryFee = deliveryFeeElement ? parseFloat(deliveryFeeElement.dataset.fee) : 60;
        const discount = 0;
        const total = subtotal + vat + deliveryFee - discount;

        const summaryElements = {
            subtotal: document.querySelector('.summary-row:nth-child(1) .summary-value'),
            vat: document.querySelector('.summary-row:nth-child(2) .summary-value'),
            delivery: document.querySelector('.summary-row:nth-child(3) .summary-value'),
            discount: document.querySelector('.summary-row:nth-child(4) .summary-value'),
            total: document.querySelector('.summary-total')
        };

        if (summaryElements.subtotal) summaryElements.subtotal.textContent = `₱${this.formatPrice(subtotal)}`;
        if (summaryElements.vat) summaryElements.vat.textContent = `₱${this.formatPrice(vat)}`;
        if (summaryElements.delivery) summaryElements.delivery.textContent = `₱${this.formatPrice(deliveryFee)}`;
        if (summaryElements.discount) summaryElements.discount.textContent = `-₱${this.formatPrice(discount)}`;
        if (summaryElements.total) summaryElements.total.textContent = `₱${this.formatPrice(total)}`;
    }

    delegateCartEvents() {
        const container = document.querySelector('.cart-items');
        if (!container) return;

        if (container.hasAttribute('data-events-attached')) {
            return;
        }

        container.addEventListener('click', (e) => {
            
            const possible = e.target.closest('.qty-increase, .qty-decrease, .cart-item-remove, button, .cart-item');
            if (!possible) return;

            const actionEl = possible.closest('.qty-increase, .qty-decrease, .cart-item-remove') || possible;

            const rawId = (actionEl && actionEl.dataset && actionEl.dataset.itemId) || (possible.closest && possible.closest('.cart-item')?.dataset?.itemId);
            const itemId = rawId ? parseFloat(rawId) : NaN;

            if (Number.isNaN(itemId)) return;

            const classList = (actionEl.className || '').toString();

            if (classList.includes('qty-increase') || actionEl.textContent.trim() === '+') {
                const item = this.items.find(i => i.id === itemId);
                if (item) this.updateQuantity(itemId, item.quantity + 1);
                return;
            }

            if (classList.includes('qty-decrease') || actionEl.textContent.trim() === '-') {
                const item = this.items.find(i => i.id === itemId);
                if (item) this.updateQuantity(itemId, item.quantity - 1);
                return;
            }

            if (classList.includes('cart-item-remove') || actionEl.title === 'Remove item') {
                this.removeItem(itemId);
                return;
            }

        });

        // Keyboard activation for accessibility
        container.addEventListener('keydown', (e) => {
            const key = e.key || e.keyCode;
            const isEnter = key === 'Enter' || key === 13;
            const isSpace = key === ' ' || key === 'Spacebar' || key === 32;
            if (!isEnter && !isSpace) return;

            const possible = e.target.closest('.qty-increase, .qty-decrease, .cart-item-remove, button, .cart-item');
            if (!possible) return;

            // prevent default to avoid duplicate native click activation
            e.preventDefault();

            const actionEl = possible.closest('.qty-increase, .qty-decrease, .cart-item-remove') || possible;
            const rawId = (actionEl && actionEl.dataset && actionEl.dataset.itemId) || (possible.closest && possible.closest('.cart-item')?.dataset?.itemId);
            const itemId = rawId ? parseFloat(rawId) : NaN;
            if (Number.isNaN(itemId)) return;

            const classList = (actionEl.className || '').toString();

            if (classList.includes('qty-increase') || actionEl.textContent.trim() === '+') {
                const item = this.items.find(i => i.id === itemId);
                if (item) this.updateQuantity(itemId, item.quantity + 1);
                return;
            }

            if (classList.includes('qty-decrease') || actionEl.textContent.trim() === '-') {
                const item = this.items.find(i => i.id === itemId);
                if (item) this.updateQuantity(itemId, item.quantity - 1);
                return;
            }

            if (classList.includes('cart-item-remove') || actionEl.title === 'Remove item') {
                this.removeItem(itemId);
                return;
            }
        });

        container.setAttribute('data-events-attached', 'true');
    }

    init() {
        this.updateCartBadge();
        
       
        const cartContainer = document.querySelector('.cart-items');
        if (cartContainer) {
            this.hydrateFromDOM();
            this.renderCart();
            this.delegateCartEvents();

            document.querySelectorAll('input[name="delivery-method"]').forEach(radio => {
                radio.addEventListener('change', () => this.updateOrderSummary());
            });

            const placeOrderBtn = document.querySelector('.place-order-btn');
            if (placeOrderBtn) {
                placeOrderBtn.addEventListener('click', () => this.placeOrder());
            }
        }
        
        this.attachAddToCartListeners();
        this.attachImageErrorHandlers();
    }

    attachAddToCartListeners() {
        const detailAddBtn = document.querySelector('.product-detail-info .add-to-cart-btn');
        if (detailAddBtn) {
            detailAddBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addFromDetailPage();
            });
        }

        document.querySelectorAll('.add-to-cart, .add-to-cart-btn').forEach(btn => {
            if (btn.classList.contains('product-detail-info')) return;
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.addFromProductCard(btn);
            });
        });

        document.querySelectorAll('.related-add').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addFromRelatedCard(btn);
            });
        });
    }

    addFromDetailPage() {
        const titleElement = document.querySelector('.product-detail-info .product-title');
        const qtyInput = document.querySelector('#qty');
        const imageElement = document.querySelector('.product-detail-img img');
        const selectedVariation = document.querySelector('input[name="variation"]:checked');

        if (!titleElement) return;

        let price = 850;
        let variation = 'Regular';

        if (selectedVariation) {
            const variationLabel = document.querySelector(`label[for="${selectedVariation.id}"]`);
            const priceElement = variationLabel?.querySelector('.variation-price');
            if (priceElement) {
                price = parseFloat(priceElement.textContent.replace(/[₱,]/g, ''));
            }
            variation = variationLabel?.querySelector('.variation-name')?.textContent || 'Regular';
        }

        const rawQty = qtyInput ? qtyInput.value : '1';
        const qty = this.parseAndValidateQuantity(rawQty);
        if (Number.isNaN(qty)) {
            this.showQuantityErrorNear(qtyInput, 'Please enter a valid quantity (minimum 1).');
            if (qtyInput) qtyInput.focus();
            return;
        }

        const product = {
            name: titleElement.textContent.trim(),
            price: price,
            image: imageElement ? imageElement.src : '../images/logo.png',
            quantity: qty,
            variation: variation
        };

        this.addItem(product);
    }

    addFromProductCard(button) {
        const card = button.closest('.product-card, .collection-product-card');
        if (!card) return;

        const titleElement = card.querySelector('.product-title, h3');
        const priceElement = card.querySelector('.product-price, .collection-product-price');
        const imageElement = card.querySelector('img');

        if (!titleElement || !priceElement) return;

        const priceText = priceElement.textContent.trim();
        const price = parseFloat(priceText.replace(/[₱,]/g, ''));

        const product = {
            name: titleElement.textContent.trim(),
            price: price,
            image: imageElement ? imageElement.src : 'images/logo.png',
            quantity: 1,
            variation: 'Regular'
        };

        this.addItem(product);
    }

    addFromRelatedCard(button) {
        const card = button.closest('.related-card');
        if (!card) return;

        const titleElement = card.querySelector('h4');
        const priceElement = card.querySelector('.related-price');
        const imageElement = card.querySelector('img');

        if (!titleElement || !priceElement) return;

        const price = parseFloat(priceElement.textContent.replace(/[₱,]/g, ''));

        const product = {
            name: titleElement.textContent.trim(),
            price: price,
            image: imageElement ? imageElement.src : '../images/logo.png',
            quantity: 1,
            variation: 'Regular'
        };

        this.addItem(product);
    }

    placeOrder() {
        if (this.items.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const addressForm = document.querySelector('.address-form');
        if (addressForm) {
            const inputs = addressForm.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#e74c3c';
                } else {
                    input.style.borderColor = '';
                }
            });

            if (!isValid) {
                alert('Please fill in all required fields in the delivery address section.');
                return;
            }
        }

        const orderNumber = 'FPB' + Date.now();
        alert(`Order placed successfully!\nOrder Number: ${orderNumber}\n\nThank you for your purchase!`);

        this.items = [];
        this.saveCart();
        this.renderCart();
    }
}

let cart;
document.addEventListener('DOMContentLoaded', () => {
    cart = new ShoppingCart();
});


