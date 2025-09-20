// cart.js - this handles showing the cart, updating qty, promo, and simple checkout (demo)

const { getCart, saveCart: saveCartToStorage } = (() => {
    try {
        return {
            getCart: () => JSON.parse(localStorage.getItem('bakeryCart') || '[]'),
            saveCart: (cart) => localStorage.setItem('bakeryCart', JSON.stringify(cart))
        };
    } catch (e) {
        console.error('Error accessing localStorage:', e);
        return {
            getCart: () => [],
            saveCart: () => {}
        };
    }
})();

function formatPHP(num) {
    return '₱' + Number(num).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

let cart = [];
const DELIVERY_FEE = 60;
const VAT_RATE = 0.12;
let promoDiscount = 0;

function loadCart() {
    try {
        cart = getCart();
        console.log('Loaded cart:', cart);
    } catch (e) {
        console.error('Error loading cart:', e);
        cart = [];
    }
}

function saveCart() {
    try {
        saveCartToStorage(cart);
        console.log('Saved cart:', cart);
    } catch (e) {
        console.error('Error saving cart:', e);
    }
}

// show cart items on the page
function renderCart() {
    loadCart(); 
    const cartItemsDiv = document.getElementById('cart-items');
    if (!cartItemsDiv) {
        console.error('Cart items container not found');
        return;
    }

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align:center; color:#888; font-size:1.1rem; margin:40px 0;">Your cart is empty.</p>';
        renderSummary();
        return;
    }

    cartItemsDiv.innerHTML = cart.map((item, idx) => {
        try {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 1;
            const totalPrice = price * quantity;

            let imgPath = 'images/default-product.jpg';
            if (item.image) {
                imgPath = item.image;
            }

            const productName = item.name || item.title || 'Product';

            return `
                <div class="cart-item" style="transition: background 0.2s;">
                    <img class="cart-item-img" src="${imgPath}" alt="${productName}"
                         onerror="this.onerror=null; this.src='images/default-product.jpg'" />
                    <div class="cart-item-info">
                        <div class="cart-item-title">${productName}</div>
                        <div class="cart-item-row">
                            <span class="cart-item-price">Unit Price: ${formatPHP(price)}</span>
                            <span class="cart-item-total">Total: <strong>${formatPHP(totalPrice)}</strong></span>
                        </div>
                        <div class="cart-item-qty">
                            <button class="qty-btn" onclick="updateQty(${idx}, -1)" title="Decrease quantity">-</button>
                            <span>${quantity}</span>
                            <button class="qty-btn" onclick="updateQty(${idx}, 1)" title="Increase quantity">+</button>
                            <button class="cart-item-remove" onclick="removeItem(${idx})" title="Remove item">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } catch (e) {
            console.error('Error rendering cart item:', e);
            return '';
        }
    }).join('');

    renderSummary();

    document.querySelectorAll('.qty-btn, .cart-item-remove').forEach(button => {
        button.addEventListener('mousedown', () => button.classList.add('pressed'));
        button.addEventListener('mouseup', () => button.classList.remove('pressed'));
        button.addEventListener('mouseleave', () => button.classList.remove('pressed'));
    });
}

// change quantity (+/-)
function updateQty(index, change) {
    loadCart(); 
    
    if (index >= 0 && index < cart.length) {
        cart[index].quantity = Math.max(1, cart[index].quantity + change);
        saveCart();
        renderCart();
        updateCartCount();
    }
}

// remove an item from cart
function removeItem(index) {
    loadCart(); 
    
    if (index >= 0 && index < cart.length) {
        if (confirm('Are you sure you want to remove this item from your cart?')) {
            cart.splice(index, 1);
            saveCart();
            renderCart();
            updateCartCount();
        }
    }
}

// update the summary numbers (subtotal, vat, etc.)
function renderSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 0);
    const vat = subtotal * VAT_RATE;
    const total = subtotal + vat + DELIVERY_FEE - promoDiscount;
    if (document.getElementById('summary-subtotal')) document.getElementById('summary-subtotal').textContent = formatPHP(subtotal);
    if (document.getElementById('summary-delivery')) document.getElementById('summary-delivery').textContent = formatPHP(DELIVERY_FEE);
    if (document.getElementById('summary-discount')) document.getElementById('summary-discount').textContent = '-' + formatPHP(promoDiscount);
    if (document.getElementById('summary-vat')) document.getElementById('summary-vat').textContent = formatPHP(vat);
    if (document.getElementById('summary-total')) document.getElementById('summary-total').textContent = formatPHP(total);
}

// fake checkout (for demo only)
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    alert('Proceeding to checkout! (Demo only)');
    
}

function updateCartCount() {
    try {
        const currentCart = getCart();
        const totalItems = currentCart.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);
        
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = totalItems;
            el.style.visibility = totalItems > 0 ? 'visible' : 'hidden';
        });
    } catch (e) {
        console.error('Error updating cart count:', e);
    }
}

function initCart() {
    try {
        loadCart();
        renderCart();
        updateCartCount();
        
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', proceedToCheckout);
        }
    } catch (e) {
        console.error('Error initializing cart:', e);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCart);
} else {
    initCart();
}

window.updateQty = updateQty;
window.removeItem = removeItem;
window.proceedToCheckout = proceedToCheckout;
