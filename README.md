# <img src="https://github.com/TheDudeThatCode/TheDudeThatCode/blob/master/Assets/Hi.gif" width="35" /> WELCOME

This repository contains the source code for the custom online ordering system we developed for the client. Our goal was to create a robust and user-friendly platform to help the client manage their orders efficiently and expand their customer base.

### <img src="https://github.com/TheDudeThatCode/TheDudeThatCode/blob/master/Assets/Developer.gif" width="45" /> About the TEAM:
<h1 align="center"> 🥐 FRESH PASTRIES BAKERY -  E-Commerce Website 🍰 </h1>

This project is a collaborative effort by a group of IT students from Mapúa Malayan Digital College, specializing in Web Systems and Technology. We developed a full-featured e-commerce website to apply our academic knowledge to a real-world business challenge, showcasing our ability to create practical, scalable, and elegant software solutions. The application's front end is built using HTML, and CSS, featuring a clean and intuitive user interface enhanced with custom images and icons. Core functionality includes a dynamic product catalog, a robust shopping cart system, and user authentication through a login modal. To improve the user experience, we also implemented features that allow users to easily filter and sort products. This academic project demonstrates our strong skills in front-end development and our capability to build a complete and professional-grade web system from scratch.

## 🔑 KEY FEATURES

## 📖 Pages
- **Home** - Landing page with featured products and call-to-action
- **Products** - Complete product catalog with filtering options
- **Product Detail** - Detailed view of individual products
- **About Us** - Company story, values, and team information
- **Contact** - Contact form and store information
- **Login/Register** - User authentication pages
- **Shopping Cart** - Cart management and checkout process

## 👾 TECHNOLOGIES USED
- HTML5
- CSS3 (with CSS Variables for theming)
- JavaScript
- Bootstrap
- Font Awesome Icons
- Google Fonts (Merriweather)

## ⚡ How to Run

Simply open `index.html` in your browser. All pages and features work without any JavaScript.

## 📁 Folder Structure

```
├── index.html              # Homepage
├── products2.html          # Bakery products page
├── products3.html          # Additional products page
├── cart.html              # Shopping cart page
├── about.html             # About us page
├── contact.html           # Contact information
├── login.html             # Login page
├── register.html          # Registration page
├── css/
│   └── styles.css         # All styling (semantic classes)
├── images/                # Product and website images
├── products/              # Individual product detail pages
│   ├── almond-croissant.html
│   ├── apple-pie.html
│   ├── banana-bread.html
│   ├── blueberry-muffin.html
│   ├── butter-croissant.html
│   ├── carrot-cake.html
│   ├── cheesecake.html
│   ├── chocolate-cake.html
│   ├── chocolate-chip-cookie.html
│   ├── ciabatta-bread.html
│   ├── multigrain-bread.html
│   ├── oatmeal-cookie.html
│   ├── pain-au-chocolat.html
│   ├── red-velvet-cake.html
│   └── sourdough-bread.html
├── footerlink/            # Footer navigation pages
│   ├── privacy.html       # Privacy policy page
│   ├── terms.html         # Terms of service page  
│   ├── delivery.html      # Delivery information page
│   ├── returns.html       # Returns policy page              
│   └── faq.html           # FAQ page
├── js
|   └── cart.js            # Shopping cart functionality
|   └── forms.js           # Form validation and accessibility helpers
```

## 📢 UPDATE!
- Added JavaScript Shopping Cart System- Fully functional cart with localStorage persistence
- Implemented Cart Badge - Real-time item count display in navigation header
- Added Customer Service Pages- FAQ, Delivery Info, Returns, Terms, and Privacy pages
- Organized Footer Links- Moved all footer pages to dedicated `footerlinks/` folder
- Enhanced User Experience- Visual notifications, quantity controls, and price calculations

### Recent updates from the feedback 
- CSS cleanup: consolidated duplicate rules in `css/styles.css` (promo button, cart badge), reduced redundant selectors and centralized badge styles to avoid conflicts.
- Accessibility improvements: added screen-reader friendly utilities and live-region announcements; keyboard support and visible focus styles were standardized for cart controls and form elements.
- Minor bug fixes: image-fallback handlers and safer localStorage writing to avoid redundant writes.

## Demo & User Testing Guide
This section provides guided test scenarios for manual QA or user testing sessions. It explains the interactive features we've added and how to verify them quickly.

1) User testing
 - Open `index.html` in a browser. Verify header, footer and product pages load.
 - Go to 'Our Products' Add a product to the cart from any product page. Confirm the cart badge updates and the cart shows the item.

2) Promo code demo (10% discount)
 - On `cart.html`, in the Promo Code box enter one of the demo codes: `WELCOME10` or `BAKE10` (case-insensitive).
 - Click Apply. Expected: the Discount row updates immediately, Total recalculates, and a small popup appears below the promo box saying the promo was applied. The Apply button becomes "Applied".
 - To remove the promo: clear the promo input and press Enter or click Apply while empty; the discount is removed and totals update.
 - Invalid code: entering an unsupported code shows a non-blocking popup below the promo box with the message "Invalid promo code." and an accessible announcement for screen readers.

3) Checkout phone validation (Philippine mobile numbers)
 - In the Delivery Address section on below the shopping cart, test the Phone Number field.
 - Valid accepted formats (demo rule): local `09XXXXXXXXX` (11 digits) or `639XXXXXXXXX` (12 digits starting with 639). Example: `09171234567` or `639171234567`.
 - Try invalid values (too short, includes letters) — the form displays inline errors and prevents placing an order until corrected.

4) Quantity and cart behaviours
 - Use the + / - buttons next to quantities — totals should update immediately.
 - Enter an invalid quantity (0 or negative) and confirm an inline small error appears near the control and then disappears after a moment.

5) Accessibility & Keyboard
 - Tab through the page to ensure the focus order is logical (header → cart items → promo → payment → place order).
 - Use Enter/Space to activate quantity controls and the Apply promo button.
 - Screen readers: the cart-announcer and promo-announcer live regions announce applied promos and cart notifications.

Notes for testers
 - This is a front-end demo using localStorage; actions are local to your browser and do not send data to a server.
 
Reporting issues
 - If you find visual regressions or behavior that looks wrong while doing the testing, flag one of the group members of GROUP 9 
 

## 🔄 Future Features

- Allow users to create accounts and log in securely
- Enable customers to save recent orders and manage their passwords
- Add more product categories and seasonal promos
- Improve checkout flow with order tracking and confirmation messages
- Add a troubleshooting or known issues section for easier debugging
-(Note: the Contact Us page is not yet functional — planned for future implementation)