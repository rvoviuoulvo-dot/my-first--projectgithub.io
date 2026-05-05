const products = [
    {
        id: 1,
        name: 'Компютер Gaming Pro',
        price: 1500,
        desc: 'Барои гейминг ва корҳои вазнин',
        image: '../images/pc1.jpg',
        specs: { ram: '16GB', cpu: 'Intel i7', ssd: '512GB' },
        type: 'PC',
        brand: 'BrandA',
        reviews: [
            { user: 'Али', rating: 5, text: 'Беҳтарин компютер!' },
            { user: 'Фатима', rating: 4, text: 'Хуб, аммо гарм мешавад.' }
        ]
    },
    {
        id: 2,
        name: 'Ноутбук Office Lite',
        price: 800,
        desc: 'Барои корҳои офисӣ',
        image: '../images/laptop1.jpg',
        specs: { ram: '8GB', cpu: 'Intel i5', ssd: '256GB' },
        type: 'Ноутбук',
        brand: 'BrandB',
        reviews: [
            { user: 'Олим', rating: 4, text: 'Барои офис хуб аст.' }
        ]
    },
    {
        id: 3,
        name: 'Компютер Workstation',
        price: 2000,
        desc: 'Барои тарроҳӣ ва муҳандисӣ',
        image: '../images/pc2.jpg',
        specs: { ram: '32GB', cpu: 'Intel i9', ssd: '1TB' },
        type: 'PC',
        brand: 'BrandA',
        reviews: [
            { user: 'Саид', rating: 5, text: 'Тез ва қавӣ!' }
        ]
    },
    {
        id: 4,
        name: 'Ноутбук Gaming Beast',
        price: 1800,
        desc: 'Ноутбуки геймингӣ',
        image: '../images/laptop2.jpg',
        specs: { ram: '16GB', cpu: 'AMD Ryzen 7', ssd: '512GB' },
        type: 'Ноутбук',
        brand: 'BrandB',
        reviews: [
            { user: 'Ҳасан', rating: 5, text: 'Графикаи аъло!' }
        ]
    }
];

let filteredProducts = [...products];

function renderProducts() {
    const productsEl = document.getElementById('products');
    productsEl.innerHTML = '';
    filteredProducts.forEach(product => {
        const productEl = document.createElement('div');
        productEl.className = 'product-card';
        productEl.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.src='../images/placeholder.jpg'">
            <h3>${product.name}</h3>
            <p>${product.desc}</p>
            <p class="price">$${product.price}</p>
            <button onclick="addToCart(${product.id})">Ба сабад</button>
            <button onclick="viewProduct(${product.id})">Тафсилот</button>
        `;
        productsEl.appendChild(productEl);
    });
}

function filterProducts() {
    const search = document.getElementById('search').value.toLowerCase();
    const type = document.getElementById('type-filter').value;
    const brand = document.getElementById('brand-filter').value;
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;

    filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search) &&
        (!type || p.type === type) &&
        (!brand || p.brand === brand) &&
        p.price >= minPrice &&
        p.price <= maxPrice
    );
    renderProducts();
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

function viewProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        localStorage.setItem('currentProduct', JSON.stringify(product));
        window.location.href = 'product.html';
    }
}

// AI Recommendation
function updateAIRecommendation() {
    const recEl = document.getElementById('rec-text');
    // Simple logic: if search includes 'gaming', recommend high spec
    const search = document.getElementById('search').value.toLowerCase();
    if (search.includes('гейм') || search.includes('gaming')) {
        recEl.textContent = 'Барои гейминг, мо тавсия медиҳем компютерҳои бо RAM 16GB ва болотар.';
    } else if (search.includes('офис') || search.includes('office')) {
        recEl.textContent = 'Барои корҳои офисӣ, ноутбукҳои сабук ва арзонро интихоб кунед.';
    } else {
        recEl.textContent = 'Маҳсулоти маъмулиро барои эҳтиёҷоти умумӣ тавсия медиҳем.';
    }
}

document.getElementById('search').addEventListener('input', () => {
    filterProducts();
    updateAIRecommendation();
});

renderProducts();
updateAIRecommendation();