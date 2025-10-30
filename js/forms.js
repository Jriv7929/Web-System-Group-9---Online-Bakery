// Form validation for checkout, login, and registration
(function(){
function addError(field, message) {
    if (!field) return;
    const existing = field.parentNode && field.parentNode.querySelector('.field-error');
    field.classList.add('input-error');
    let span;
    if (existing) {
        span = existing;
        span.textContent = message;
    } else {
        span = document.createElement('span');
        span.className = 'field-error';
        span.textContent = message;
        span.style.color = '#e74c3c';
        span.style.fontSize = '0.85em';
        span.style.display = 'block';
        span.style.marginTop = '6px';
        field.parentNode.appendChild(span);
    }

    let errId = span.id;
    if (!errId) {
        if (field.id) errId = field.id + '-error';
        else if (field.name) errId = (field.name + '-error').replace(/[^a-zA-Z0-9\-_:.]/g, '_');
        else errId = 'field-error-' + Math.floor(Math.random() * 100000);
        span.id = errId;
    }

    span.setAttribute('role', 'alert');
    span.setAttribute('aria-live', 'assertive');
    span.setAttribute('aria-atomic', 'true');

    try {
        const described = field.getAttribute('aria-describedby');
        if (described) {
            const parts = described.split(' ').filter(Boolean);
            if (!parts.includes(errId)) parts.push(errId);
            field.setAttribute('aria-describedby', parts.join(' '));
        } else {
            field.setAttribute('aria-describedby', errId);
        }
    } catch (e) {
    }
}

    function removeError(field) {
        if (!field) return;
        field.classList.remove('input-error');
        const existing = field.parentNode && field.parentNode.querySelector('.field-error');
        if (existing) {
            try {
                const desc = field.getAttribute('aria-describedby');
                if (desc) {
                    const parts = desc.split(' ').filter(Boolean).filter(id => id !== existing.id);
                    if (parts.length) field.setAttribute('aria-describedby', parts.join(' '));
                    else field.removeAttribute('aria-describedby');
                }
            } catch (e) {}
            existing.remove();
        }
    }

    function isEmail(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }

    function isPhone(v) {
        return /^[0-9+()\-\s]{7,20}$/.test(v);
    }

    function validateAddressForm(form) {
        if (!form) return true;
        let valid = true;
        const fullname = form.querySelector('#address-name');
        const phone = form.querySelector('#address-phone');
        const line = form.querySelector('#address-line');
        const city = form.querySelector('#address-city');
        const barangay = form.querySelector('#address-barangay');
        const zipcode = form.querySelector('#address-zipcode');

        if (!fullname || !fullname.value.trim()) {
            addError(fullname, 'Full name is required.'); valid = false;
        } else removeError(fullname);

        if (!phone || !phone.value.trim() || !isPhone(phone.value.trim())) {
            addError(phone, 'Enter a valid phone number.'); valid = false;
        } else removeError(phone);

        if (!line || !line.value.trim()) { addError(line, 'Street address is required.'); valid = false; } else removeError(line);
        if (!city || !city.value.trim()) { addError(city, 'City is required.'); valid = false; } else removeError(city);
        if (!barangay || !barangay.value.trim()) { addError(barangay, 'Barangay is required.'); valid = false; } else removeError(barangay);

        if (zipcode) {
            const z = zipcode.value.trim();
            if (!/^\d{4,5}$/.test(z)) { addError(zipcode, 'Enter a valid zip code.'); valid = false; } else removeError(zipcode);
        }

        return valid;
    }

    function validateLoginForm(form) {
        if (!form) return true;
        let valid = true;
        const email = form.querySelector('#email');
        const password = form.querySelector('#password');

        if (!email || !email.value.trim() || !isEmail(email.value.trim())) { addError(email, 'Enter a valid email.'); valid = false; } else removeError(email);
        if (!password || password.value.length < 6) { addError(password, 'Password must be at least 6 characters.'); valid = false; } else removeError(password);
        return valid;
    }

    function validateRegisterForm(form) {
        if (!form) return true;
        let valid = true;
        const first = form.querySelector('#firstName');
        const last = form.querySelector('#lastName');
        const email = form.querySelector('#email');
        const password = form.querySelector('#password');
        const confirm = form.querySelector('#confirmPassword') || form.querySelector('#confirm-password');

        if (first && !first.value.trim()) { addError(first, 'First name required.'); valid = false; } else if (first) removeError(first);
        if (last && !last.value.trim()) { addError(last, 'Last name required.'); valid = false; } else if (last) removeError(last);

        if (!email || !email.value.trim() || !isEmail(email.value.trim())) { addError(email, 'Enter a valid email.'); valid = false; } else removeError(email);
        if (!password || password.value.length < 6) { addError(password, 'Password must be at least 6 characters.'); valid = false; } else removeError(password);

        if (confirm) {
            if (confirm.value !== password.value) { addError(confirm, 'Passwords do not match.'); valid = false; } else removeError(confirm);
        }

        return valid;
    }

    document.addEventListener('DOMContentLoaded', () => {
        // Checkout address form
        const addressForm = document.querySelector('.address-form');
        if (addressForm) {
            addressForm.querySelectorAll('input, textarea').forEach(inp => {
                inp.addEventListener('blur', () => validateAddressForm(addressForm));
                inp.addEventListener('input', () => removeError(inp));
            });

            const placeBtn = document.querySelector('.place-order-btn');
            if (placeBtn) {
                placeBtn.addEventListener('click', (e) => {
                    const ok = validateAddressForm(addressForm);
                    if (!ok) {
                        e.preventDefault();
                        e.stopPropagation();
                        const firstErr = addressForm.querySelector('.input-error');
                        if (firstErr) firstErr.focus();
                    }
                });
            }
        }

        // Login form
        const loginForm = document.querySelector('#loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                const ok = validateLoginForm(loginForm);
                if (!ok) {
                    e.preventDefault();
                    e.stopPropagation();
                    const firstErr = loginForm.querySelector('.input-error'); if (firstErr) firstErr.focus();
                }
            });

            loginForm.querySelectorAll('input').forEach(inp => {
                inp.addEventListener('blur', () => validateLoginForm(loginForm));
                inp.addEventListener('input', () => removeError(inp));
            });
        }

        // Register form
        const registerForm = document.querySelector('#registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                const ok = validateRegisterForm(registerForm);
                if (!ok) {
                    e.preventDefault();
                    e.stopPropagation();
                    const firstErr = registerForm.querySelector('.input-error'); if (firstErr) firstErr.focus();
                }
            });

            registerForm.querySelectorAll('input').forEach(inp => {
                inp.addEventListener('blur', () => validateRegisterForm(registerForm));
                inp.addEventListener('input', () => removeError(inp));
            });
        }

    });
})();
