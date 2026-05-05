const products = [
    { id: 1, name: 'Компютер Gaming Pro', price: 1500 },
    { id: 2, name: 'Ноутбук Office Lite', price: 800 },
    { id: 3, name: 'Компютер Workstation', price: 2000 },
    { id: 4, name: 'Ноутбук Gaming Beast', price: 1800 }
];

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsEl = document.getElementById('cart-items');
    cartItemsEl.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            const itemTotal = product.price * item.quantity;
            total += itemTotal;
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <h3>${product.name}</h3>
                <p>Нарх: $${product.price} x ${item.quantity} = $${itemTotal}</p>
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
                <button onclick="removeFromCart(${item.id})">Хориҷ</button>
            `;
            cartItemsEl.appendChild(itemEl);
        }
    });

    document.getElementById('total').textContent = total;
}

function changeQuantity(id, delta) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            updateCartCount();
        }
    }
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

function placeOrder() {
    alert('Заказ оформлен! Мы свяжемся с вами скоро.');
    localStorage.removeItem('cart');
    renderCart();
    updateCartCount();
}

renderCart();