const product = JSON.parse(localStorage.getItem('currentProduct'));

if (product) {
    const productInfoEl = document.getElementById('product-info');
    productInfoEl.innerHTML = `
        <div class="product-gallery">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='../images/placeholder.jpg'">
        </div>
        <div class="product-details">
            <h1>${product.name}</h1>
            <p>${product.desc}</p>
            <p class="price">$${product.price}</p>
            <div class="specs">
                <h3>Характеристикаҳо</h3>
                <ul>
                    <li>RAM: ${product.specs.ram}</li>
                    <li>CPU: ${product.specs.cpu}</li>
                    <li>SSD: ${product.specs.ssd}</li>
                </ul>
            </div>
            <button onclick="addToCart(${product.id})">Харидан ҳозир</button>
        </div>
    `;

    const reviewsEl = document.getElementById('reviews-list');
    product.reviews.forEach(review => {
        const reviewEl = document.createElement('div');
        reviewEl.className = 'review';
        reviewEl.innerHTML = `
            <p><strong>${review.user}</strong> (${review.rating}/5)</p>
            <p>${review.text}</p>
        `;
        reviewsEl.appendChild(reviewEl);
    });
} else {
    document.getElementById('product-info').innerHTML = '<p>Маҳсулот ёфт нашуд.</p>';
}

function addToCart(id) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Маҳсулот ба сабад илова шуд!');
}