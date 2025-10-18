// login modal that pops up when we click the user icon
function createLoginModal() {
    if (document.getElementById('modal-login-bg')) return;
    const modalBg = document.createElement('div');
    modalBg.className = 'modal-login-bg hidden';
    modalBg.id = 'modal-login-bg';
    modalBg.innerHTML = `
        <div class="modal-login">
            <button class="modal-login-close" aria-label="Close">&times;</button>
            <h2>Login</h2>
            <form id="modalLoginForm">
                <div>
                    <label for="modal-login-email">Email Address</label>
                    <input type="email" id="modal-login-email" required autocomplete="username">
                </div>
                <div>
                    <label for="modal-login-password">Password</label>
                    <input type="password" id="modal-login-password" required autocomplete="current-password">
                </div>
                <button type="submit" class="modal-login-btn">Login</button>
            </form>
            <div class="modal-login-footer">
                Don't have an account? <a href="register.html">Sign up</a>
            </div>
        </div>
    `;
    document.body.appendChild(modalBg);

    modalBg.querySelector('.modal-login-close').onclick = () => modalBg.classList.add('hidden');
    modalBg.onclick = e => { if (e.target === modalBg) modalBg.classList.add('hidden'); };

    // fake login submit (for demo)
    modalBg.querySelector('#modalLoginForm').onsubmit = function(e) {
        e.preventDefault();
        modalBg.classList.add('hidden');
        showNotification('Logged in! (demo)');
    };
}

document.addEventListener('DOMContentLoaded', () => {
    createLoginModal();
    document.querySelectorAll('.login-icon').forEach(icon => {
        icon.addEventListener('click', e => {
            e.preventDefault();
            const modal = document.getElementById('modal-login-bg');
            if (modal) modal.classList.remove('hidden');
        });
    });
});
const products = [
    // Page 1
    {
        badge: 'New',
        image: 'images/butter_croissant.png',
        alt: 'Butter Croissant',
        category: 'Pastries',
        title: 'Butter Croissant',
        description: 'Flaky, buttery layers of French-style croissant, perfect with your morning coffee.',
        price: '₱850.00',
        oldPrice: '',
        id: 'butter-croissant',
    },
    {
        badge: 'Popular',
        image: 'images/sourdough.png',
        alt: 'Sourdough Bread',
        category: 'Breads',
        title: 'Fresh Sourdough',
        description: 'Traditional sourdough bread with a crispy crust and soft, airy interior.',
        price: '₱599.99',
        oldPrice: '₱800.00',
        id: 'sourdough',
    },
    {
        badge: '',
        image: 'images/cookies.png',
        alt: 'Chocolate Chip Cookie',
        category: 'Cookies',
        title: 'Chocolate Chip Cookie',
        description: 'Classic cookie loaded with melty chocolate chips for the perfect treat.',
        price: '₱150.00',
        oldPrice: '',
        id: 'chocolate-chip-cookie',
    },
    {
        badge: 'Best Seller',
        image: 'images/redvelvetcake.png',
        alt: 'Red Velvet Cake',
        category: 'Cakes',
        title: 'Red Velvet Cake',
        description: 'Moist layers of red velvet cake with cream cheese frosting.',
        price: '₱3,200.00',
        oldPrice: '',
        id: 'red-velvet-cake',
    },
    {
        badge: '',
        image: 'images/wholegrainbread.png',
        alt: 'Multigrain Bread',
        category: 'Breads',
        title: 'Multigrain Bread',
        description: 'Hearty bread packed with whole grains, seeds, and nuts.',
        price: '₱350.50',
        oldPrice: '₱400.00',
        id: 'multigrain-bread',
    },
    {
        badge: 'New',
        image: 'images/almondcroissant.png',
        alt: 'Almond Croissant',
        category: 'Pastries',
        title: 'Almond Croissant',
        description: 'Buttery croissant filled with almond cream and topped with sliced almonds.',
        price: '₱250.00',
        oldPrice: '',
        id: 'almond-croissant',
    },
    // Page 2
    {
        badge: '',
        image: 'images/banana.png',
        alt: 'Banana Bread',
        category: 'Breads',
        title: 'Banana Bread',
        description: 'Moist banana bread with a hint of cinnamon and walnuts.',
        price: '₱300.00',
        oldPrice: '',
        id: 'banana-bread',
    },
    {
        badge: 'Popular',
        image: 'images/chococake.png',
        alt: 'Chocolate Cake',
        category: 'Cakes',
        title: 'Chocolate Cake',
        description: 'Rich and decadent chocolate cake with creamy frosting.',
        price: '₱2,800.00',
        oldPrice: '',
        id: 'chocolate-cake',
    },
    {
        badge: '',
        image: 'images/applepie.png',
        alt: 'Apple Pie',
        category: 'Pastries',
        title: 'Apple Pie',
        description: 'Classic apple pie with a flaky crust and cinnamon apples.',
        price: '₱500.00',
        oldPrice: '',
        id: 'apple-pie',
    },
    {
        badge: '',
        image: 'images/cheesecake.png',
        alt: 'Cheesecake',
        category: 'Cakes',
        title: 'Cheesecake',
        description: 'Creamy cheesecake with a buttery graham cracker crust.',
        price: '₱2,500.00',
        oldPrice: '',
        id: 'cheesecake',
    },
    {
        badge: 'New',
        image: 'images/panau.png',
        alt: 'Pain au Chocolat',
        category: 'Pastries',
        title: 'Pain au Chocolat',
        description: 'French pastry with rich chocolate inside flaky dough.',
        price: '₱950.00',
        oldPrice: '',
        id: 'pain-au-chocolat',
    },
    {
        badge: '',
        image: 'images/oatcookies.png',
        alt: 'Oatmeal Cookie',
        category: 'Cookies',
        title: 'Oatmeal Cookie',
        description: 'Chewy oatmeal cookie with raisins and a touch of spice.',
        price: '₱180.00',
        oldPrice: '',
        id: 'oatmeal-cookie',
    },
    // Page 3
    {
        badge: '',
        image: 'images/blueberrymuffs.png',
        alt: 'Blueberry Muffin',
        category: 'Pastries',
        title: 'Blueberry Muffin',
        description: 'Moist muffin bursting with fresh blueberries.',
        price: '₱220.00',
        oldPrice: '',
        id: 'blueberry-muffin',
    },
    {
        badge: '',
        image: 'images/ciabatta.png',
        alt: 'Ciabatta Bread',
        category: 'Breads',
        title: 'Ciabatta Bread',
        description: 'Rustic Italian bread with a chewy crust and airy crumb.',
        price: '₱400.00',
        oldPrice: '',
        id: 'ciabatta-bread',
    },
    {
        badge: '',
        image: 'images/carrotcake.png',
        alt: 'Carrot Cake',
        category: 'Cakes',
        title: 'Carrot Cake',
        description: 'Spiced carrot cake with cream cheese frosting and walnuts.',
        price: '₱2,200.00',
        oldPrice: '',
        id: 'carrot-cake',
    },
];

// Filtering and sorting state
let currentCategory = 'all';
let currentSort = 'featured';

const categorySelect = document.getElementById('category');
const sortSelect = document.getElementById('sort');

function getFilteredSortedProducts() {
    let filtered = products;
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category.toLowerCase() === currentCategory);
    }
    // Sorting
    if (currentSort === 'price-low') {
        filtered = filtered.slice().sort((a, b) => parseFloat(a.price.replace(/[^\d.]/g, '')) - parseFloat(b.price.replace(/[^\d.]/g, '')));
    } else if (currentSort === 'price-high') {
        filtered = filtered.slice().sort((a, b) => parseFloat(b.price.replace(/[^\d.]/g, '')) - parseFloat(a.price.replace(/[^\d.]/g, '')));
    } else if (currentSort === 'newest') {
        filtered = filtered.slice().reverse();
    } else if (currentSort === 'popularity') {
        filtered = filtered.slice().sort((a, b) => (b.badge === 'Popular' ? 1 : 0) - (a.badge === 'Popular' ? 1 : 0));
    }
    return filtered;
}

const productsPerPage = 6;
const productsGrid = document.querySelector('.products-grid');
const paginationLinks = document.querySelectorAll('.pagination a');
const productsSection = document.querySelector('.products-section');

function renderProducts(page) {
    paginationLinks.forEach(link => link.classList.remove('active'));
    if (paginationLinks[page + 1]) paginationLinks[page + 1].classList.add('active');

    const filteredProducts = getFilteredSortedProducts();
    let start = page * productsPerPage;
    let end = start + productsPerPage;
    if (end > filteredProducts.length) end = filteredProducts.length;

    productsGrid.innerHTML = '';
    for (let i = start; i < end && i < filteredProducts.length; i++) {
        const p = filteredProducts[i];
        productsGrid.innerHTML += `
        <div class="product-card clickable-product" data-product='${JSON.stringify(p)}'>
            ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
            <div class="product-image">
                <img src="${p.image}" alt="${p.alt}">
            </div>
            <div class="product-info">
                <span class="product-category">${p.category}</span>
                <h3 class="product-title">${p.title}</h3>
                <p class="product-description">${p.description}</p>
                <div class="product-footer">
                    <div class="product-price">${p.price}${p.oldPrice ? ` <span>${p.oldPrice}</span>` : ''}</div>
                    <button class="add-to-cart" 
                            data-product-id="${p.id}"
                            data-product-name="${p.title.replace(/'/g, "\\'")}"
                            data-product-price="${parseFloat(p.price.replace(/[^\d.]/g, ''))}"
                            data-product-image="${p.image}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
        `;
    }
    setTimeout(() => {
      document.querySelectorAll('.clickable-product').forEach(card => {
        card.addEventListener('click', function(e) {
          if (e.target.closest('button')) return;
          const prod = JSON.parse(this.getAttribute('data-product'));
          localStorage.setItem('selectedProduct', JSON.stringify(prod));
          window.location.href = 'products/product_details.html';
        });
      });
    }, 10);
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    document.querySelector('.pagination').style.display = filteredProducts.length > productsPerPage ? '' : 'none';
}

let currentPage = 0;

function updatePaginationButtons() {
    if (paginationLinks[0]) {
        if (currentPage === 0) {
            paginationLinks[0].classList.add('disabled');
        } else {
            paginationLinks[0].classList.remove('disabled');
        }
    }
    if (paginationLinks[paginationLinks.length - 1]) {
        if (currentPage === 2) {
            paginationLinks[paginationLinks.length - 1].classList.add('disabled');
        } else {
            paginationLinks[paginationLinks.length - 1].classList.remove('disabled');
        }
    }
}

paginationLinks.forEach((link, idx) => {
    if (idx === 0) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentPage > 0) {
                currentPage--;
                renderProducts(currentPage);
                updatePaginationButtons();
            }
        });
        return;
    }
    if (idx === paginationLinks.length - 1) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentPage < 2) {
                currentPage++;
                renderProducts(currentPage);
                updatePaginationButtons();
            }
        });
        return;
    }
    link.addEventListener('click', function(e) {
        e.preventDefault();
        currentPage = idx - 1;
        renderProducts(currentPage);
        updatePaginationButtons();
    });
});

renderProducts(currentPage);
updatePaginationButtons();

if (categorySelect) {
    categorySelect.addEventListener('change', function() {
        currentCategory = this.value;
        currentPage = 0;
        renderProducts(currentPage);
        updatePaginationButtons();
    });
}
if (sortSelect) {
    sortSelect.addEventListener('change', function() {
        currentSort = this.value;
        currentPage = 0;
        renderProducts(currentPage);
        updatePaginationButtons();
    });
}
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

let cart = [];

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}

function initCart() {
    const savedCart = localStorage.getItem('bakeryCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}


function saveCart() {
    localStorage.setItem('bakeryCart', JSON.stringify(cart));
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

document.addEventListener('click', function(e) {
    const addToCartBtn = e.target.closest('.add-to-cart');
    if (addToCartBtn) {
        e.preventDefault();
        e.stopPropagation();
        
        const productId = addToCartBtn.getAttribute('data-product-id');
        const productName = addToCartBtn.getAttribute('data-product-name');
        const productPrice = parseFloat(addToCartBtn.getAttribute('data-product-price'));
        let productImage = addToCartBtn.getAttribute('data-product-image');
        
        if (productImage && !productImage.startsWith('http') && !productImage.startsWith('data:image')) {
            const cleanPath = productImage.replace(/^[\/\\]|\.\.\//g, '');
            productImage = cleanPath.startsWith('images/') ? cleanPath : `images/${cleanPath}`;
        }
        
        if (window.addToCart) {
            window.addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        } else {
            console.error('addToCart function not found');
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const savedCart = localStorage.getItem('bakeryCart');
    cart = savedCart ? JSON.parse(savedCart) : [];
    updateCartCount();
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, 
                    behavior: 'smooth'
                });
            }
        });
    });
});

const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background-color: var(--accent-color);
        color: var(--text-color);
        padding: 15px 30px;
        border-radius: 30px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .notification.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
`;

document.head.appendChild(notificationStyles);
