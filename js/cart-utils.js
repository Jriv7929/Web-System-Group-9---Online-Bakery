// cart-utils.js - shared cart stuff we use on all pages
function setupCartIconClick() {
    document.querySelectorAll('.cart-icon').forEach(icon => {
        if (!icon.getAttribute('data-cart-listener')) {
            icon.addEventListener('click', e => {
                const linkEl = icon.tagName && icon.tagName.toLowerCase() === 'a' ? icon : icon.closest('a');
                const targetHref = linkEl && linkEl.getAttribute('href') ? linkEl.href : 'cart.html';
                e.preventDefault();
                window.location.href = targetHref;
            });
            icon.setAttribute('data-cart-listener', 'true');
        }
    });
}

function initCartUtils() {
    setupCartIconClick();
    
    window.BakeryCart.updateCartCount();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCartUtils);
} else {
    initCartUtils();
}

const CART_KEY = 'bakeryCart';

window.BakeryCart = window.BakeryCart || {};

window.BakeryCart.getCart = function() {
    try {
        const saved = localStorage.getItem(CART_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error('Error getting cart from localStorage:', e);
        return [];
    }
};

window.BakeryCart.saveCart = function(cart) {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        return true;
    } catch (e) {
        console.error('Error saving cart to localStorage:', e);
        return false;
    }
};

window.BakeryCart.updateCartCount = function() {
    try {
        const cart = window.BakeryCart.getCart();
        const totalItems = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
        
        document.querySelectorAll('.cart-count').forEach(el => {
            if (el) {  
                el.textContent = totalItems;
                el.classList.remove('cart-animate');
                void el.offsetWidth;
                el.classList.add('cart-animate');
                el.style.visibility = totalItems > 0 ? 'visible' : 'hidden';
            }
        });
        
        return totalItems;
    } catch (e) {
        console.error('Error updating cart count:', e);
        return 0;
    }
};

// add item to cart (global)
window.BakeryCart.addToCart = function(product) {
    try {
        if (!product || !product.id) {
            console.error('Invalid product data:', product);
            return false;
        }

        const cart = window.BakeryCart.getCart();
        const idx = cart.findIndex(item => item.id === product.id);

        let imagePath = 'images/default-product.jpg';
        if (product.image) {
            if (product.image.startsWith('http') || product.image.startsWith('data:image')) {
                imagePath = product.image;
            } else {
                let filename = product.image.split(/[\\/]/).pop();
                imagePath = 'images/' + filename;
            }
        }

        if (idx !== -1) {
            cart[idx].quantity = (parseInt(cart[idx].quantity) || 0) + (parseInt(product.quantity) || 1);
        } else {
            cart.push({
                id: product.id,
                name: product.name || product.title || 'Product',
                price: parseFloat(product.price) || 0,
                image: imagePath, 
                quantity: parseInt(product.quantity) || 1
            });
        }

        const saved = window.BakeryCart.saveCart(cart);
        if (saved) {
            window.BakeryCart.updateCartCount();

            if (typeof window.showNotification === 'function') {
                window.showNotification(`${product.quantity || 1}x ${product.name || product.title} added to cart!`);
            }

            console.log('Added to cart:', product);
            return true;
        }
        return false;
    } catch (e) {
        console.error('Error adding to cart:', e);
        return false;
    }
};

if (typeof document !== 'undefined' && !document.getElementById('cart-animate-style')) {
    const style = document.createElement('style');
    style.id = 'cart-animate-style';
    style.textContent = `
    .cart-count {
        display: inline-block;
        min-width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        font-size: 12px;
        font-weight: 600;
        color: #fff;
        background-color: #e67e22;
        border-radius: 50%;
        position: absolute;
        top: -5px;
        right: -5px;
    }
    
    .cart-count.cart-animate {
        animation: cart-bounce 0.5s cubic-bezier(.68,-0.55,.27,1.55);
        background: #e67e22;
        color: #fff;
        border-radius: 50%;
        box-shadow: 0 0 0 2px #fff, 0 2px 8px rgba(230,103,34,0.2);
    }
    
    @keyframes cart-bounce {
        0% { transform: scale(1); }
        30% { transform: scale(1.3); }
        60% { transform: scale(0.9); }
        100% { transform: scale(1); }
    }`;
    
    if (document.head) {
        document.head.appendChild(style);
    } else if (document.body) {
        document.body.appendChild(style);
    }
}
