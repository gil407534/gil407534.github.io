async function loadMenu() {
    try {
        const response = await fetch('menu.html');
        const data = await response.text();
        document.getElementById('header').innerHTML = data;
    } catch (error) {
        console.error('Error loading menu:', error);
    }
}

// Wait for menu to load before continuing
loadMenu().then(() => {
    // Sample product data
    const products = [
        // ...existing product data...
    ];
    
    // Sample user data
    const users = [
        // ...existing user data...
    ];
    
    // Initialize cart
    let cart = [];
    let currentUser = null;
    
    // DOM elements
    const productGrid = document.getElementById('product-grid');
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const cartModal = document.getElementById('cart-modal');
    const closeLogin = document.getElementById('close-login');
    const closeRegister = document.getElementById('close-register');
    const closeCart = document.getElementById('close-cart');
    const registerLink = document.getElementById('register-link');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const cartBtn = document.getElementById('cart-btn');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Display products
    function displayProducts() {
        productGrid.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-details">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <p class="product-description">${product.description}</p>
                    <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            
            productGrid.appendChild(productCard);
        });
        
        // Add event listeners to the Add to Cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                addToCart(productId);
            });
        });
    }
    
    // Add product to cart
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        
        if (product) {
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }
            
            updateCartCount();
            alert(`${product.name} added to cart!`);
        }
    }
    
    // Update cart count
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = `(${totalItems})`;
    }
    
    // Display cart items
    function displayCartItems() {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty.</p>';
            cartTotal.textContent = '0.00';
            return;
        }
        
        cartItems.innerHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        <span class="cart-item-remove" data-id="${item.id}">Remove</span>
                    </div>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        cartTotal.textContent = total.toFixed(2);
        
        // Add event listeners to the quantity buttons and remove links
        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                decreaseQuantity(productId);
            });
        });
        
        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                increaseQuantity(productId);
            });
        });
        
        document.querySelectorAll('.cart-item-remove').forEach(link => {
            link.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                removeFromCart(productId);
            });
        });
    }
    
    // Decrease item quantity
    function decreaseQuantity(productId) {
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                removeFromCart(productId);
                return;
            }
            
            updateCartCount();
            displayCartItems();
        }
    }
    
    // Increase item quantity
    function increaseQuantity(productId) {
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            item.quantity += 1;
            updateCartCount();
            displayCartItems();
        }
    }
    
    // Remove item from cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartCount();
        displayCartItems();
    }
    
    // Handle login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = user;
            loginBtn.textContent = user.name;
            loginModal.style.display = 'none';
            alert('Login successful!');
        } else {
            alert('Invalid email or password.');
        }
    });
    
    // Handle registration
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        
        if (users.some(u => u.email === email)) {
            alert('Email already registered.');
            return;
        }
        
        const newUser = {
            name,
            email,
            password
        };
        
        users.push(newUser);
        
        registerModal.style.display = 'none';
        loginModal.style.display = 'block';
        
        alert('Registration successful! You can now log in.');
    });
    
    // Handle checkout
    checkoutBtn.addEventListener('click', function() {
        if (!currentUser) {
            alert('Please log in to checkout.');
            cartModal.style.display = 'none';
            loginModal.style.display = 'block';
            return;
        }
        
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }
        
        alert('Order placed successfully!');
        cart = [];
        updateCartCount();
        cartModal.style.display = 'none';
    });
    
    // Event listeners for modals
    loginBtn.addEventListener('click', function() {
        if (currentUser) {
            if (confirm('Do you want to log out?')) {
                currentUser = null;
                loginBtn.textContent = 'Login';
            }
        } else {
            loginModal.style.display = 'block';
        }
    });
    
    cartBtn.addEventListener('click', function() {
        displayCartItems();
        cartModal.style.display = 'block';
    });
    
    registerLink.addEventListener('click', function() {
        loginModal.style.display = 'none';
        registerModal.style.display = 'block';
    });
    
    closeLogin.addEventListener('click', function() {
        loginModal.style.display = 'none';
    });
    
    closeRegister.addEventListener('click', function() {
        registerModal.style.display = 'none';
    });
    
    closeCart.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        } else if (event.target === registerModal) {
            registerModal.style.display = 'none';
        } else if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Initialize the page
    displayProducts();
});
