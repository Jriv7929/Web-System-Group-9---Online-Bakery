// Cart Management System for Fresh Pastries Bakery
// Uses localStorage to persist cart data across pages

// Cart Class
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.init();
    }

    // Load cart from localStorage
    loadCart() {
        const cartData = localStorage.getItem('freshPastriesCart');
        return cartData ? JSON.parse(cartData) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('freshPastriesCart', JSON.stringify(this.items));
        this.updateCartBadge();
    }

    // Add item to cart
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

    // Remove item from cart
    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCart();
        this.renderCart();
    }

    // Update item quantity
    updateQuantity(itemId, quantity) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
            this.renderCart();
        }
    }

    // Get cart total
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get cart item count
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    // Update cart badge
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
            } else if (badgeElement) {
                badgeElement.remove();
            }
        }
    }

    // Show notification
    showNotification(message) {
        // Remove existing notification if any
        const existing = document.querySelector('.cart-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Render cart page
    renderCart() {
        const cartItemsContainer = document.querySelector('.cart-items');
        if (!cartItemsContainer) return;

        const cartItemsHTML = cartItemsContainer.querySelector('h2');

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
                            <button class="qty-btn qty-decrease" data-item-id="${item.id}">-</button>
                            <span class="qty-display">${item.quantity}</span>
                            <button class="qty-btn qty-increase" data-item-id="${item.id}">+</button>
                            <button class="cart-item-remove" data-item-id="${item.id}" title="Remove item">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = itemsHTML;
        this.attachCartEventListeners();
        this.updateOrderSummary();
    }

    // Format price
    formatPrice(price) {
        return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Update order summary
    updateOrderSummary() {
        const subtotal = this.getTotal();
        const vat = subtotal * 0.12;
        const deliveryFeeElement = document.querySelector('input[name="delivery-method"]:checked');
        const deliveryFee = deliveryFeeElement ? parseFloat(deliveryFeeElement.dataset.fee) : 60;
        const discount = 0; // Can be updated with promo code logic
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

    // Attach event listeners to cart page elements
    attachCartEventListeners() {
        // Quantity increase buttons
        document.querySelectorAll('.qty-increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(btn.dataset.itemId);
                const item = this.items.find(i => i.id === itemId);
                if (item) {
                    this.updateQuantity(itemId, item.quantity + 1);
                }
            });
        });

        // Quantity decrease buttons
        document.querySelectorAll('.qty-decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(btn.dataset.itemId);
                const item = this.items.find(i => i.id === itemId);
                if (item && item.quantity > 1) {
                    this.updateQuantity(itemId, item.quantity - 1);
                }
            });
        });

        // Remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(btn.dataset.itemId);
                this.removeItem(itemId);
            });
        });
    }

    // Initialize cart functionality
    init() {
        this.updateCartBadge();

        // If on cart page, render cart
        if (window.location.pathname.includes('cart.html')) {
            this.renderCart();

            // Delivery method change listener
            document.querySelectorAll('input[name="delivery-method"]').forEach(radio => {
                radio.addEventListener('change', () => this.updateOrderSummary());
            });

            // Place order button
            const placeOrderBtn = document.querySelector('.place-order-btn');
            if (placeOrderBtn) {
                placeOrderBtn.addEventListener('click', () => this.placeOrder());
            }
        }

        // Add to cart buttons on product pages
        this.attachAddToCartListeners();
    }

    // Attach "Add to Cart" button listeners
    attachAddToCartListeners() {
        // For product detail pages
        const detailAddBtn = document.querySelector('.product-detail-info .add-to-cart-btn');
        if (detailAddBtn) {
            detailAddBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addFromDetailPage();
            });
        }

        // For product grid pages (products.html, index.html)
        document.querySelectorAll('.add-to-cart, .add-to-cart-btn').forEach(btn => {
            // Skip if already handled above
            if (btn.classList.contains('product-detail-info')) return;

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.addFromProductCard(btn);
            });
        });

        // For related products section
        document.querySelectorAll('.related-add').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addFromRelatedCard(btn);
            });
        });
    }

    // Add from detail page
    addFromDetailPage() {
        const titleElement = document.querySelector('.product-detail-info .product-title');
        const qtyInput = document.querySelector('#qty');
        const imageElement = document.querySelector('.product-detail-img img');
        const selectedVariation = document.querySelector('input[name="variation"]:checked');
        
        if (!titleElement) return;

        let price = 850; // Default
        let variation = 'Regular';
        
        if (selectedVariation) {
            const variationLabel = document.querySelector(`label[for="${selectedVariation.id}"]`);
            const priceElement = variationLabel?.querySelector('.variation-price');
            if (priceElement) {
                price = parseFloat(priceElement.textContent.replace(/[₱,]/g, ''));
            }
            variation = variationLabel?.querySelector('.variation-name')?.textContent || 'Regular';
        }

        const product = {
            name: titleElement.textContent.trim(),
            price: price,
            image: imageElement ? imageElement.src : '../images/logo.png',
            quantity: qtyInput ? parseInt(qtyInput.value) : 1,
            variation: variation
        };

        this.addItem(product);
    }

    // Add from product card
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

    // Add from related card
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

    // Place order
    placeOrder() {
        if (this.items.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Validate address form
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

        // Simulate order placement
        const orderNumber = 'FPB' + Date.now();
        alert(`Order placed successfully!\nOrder Number: ${orderNumber}\n\nThank you for your purchase!`);
        
        // Clear cart
        this.items = [];
        this.saveCart();
        this.renderCart();
    }
}

// Initialize cart when DOM is loaded
let cart;
document.addEventListener('DOMContentLoaded', () => {
    cart = new ShoppingCart();
});
