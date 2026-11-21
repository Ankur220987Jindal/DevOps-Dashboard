
/* =========================
   FOOD DATA
========================= */

const foods = [
    {
        id: 1,
        name: "Margherita Pizza",
        category: "Pizza",
        price: 249,
        rating: 4.9,
        description: "Classic cheese, fresh basil and tomato.",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 2,
        name: "Classic Burger",
        category: "Burger",
        price: 199,
        rating: 4.8,
        description: "Juicy patty with fresh lettuce and sauce.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 3,
        name: "Creamy Alfredo",
        category: "Pasta",
        price: 279,
        rating: 4.7,
        description: "Creamy parmesan pasta with herbs.",
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 4,
        name: "Chocolate Cake",
        category: "Dessert",
        price: 149,
        rating: 4.9,
        description: "Rich chocolate cake with silky frosting.",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 5,
        name: "Pepperoni Pizza",
        category: "Pizza",
        price: 329,
        rating: 4.8,
        description: "Loaded with cheese and pepperoni.",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 6,
        name: "Crispy Chicken Burger",
        category: "Burger",
        price: 229,
        rating: 4.6,
        description: "Crunchy chicken with creamy mayo.",
        image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 7,
        name: "Fresh Lemonade",
        category: "Drinks",
        price: 99,
        rating: 4.7,
        description: "Refreshing lemon drink with mint.",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 8,
        name: "Strawberry Cheesecake",
        category: "Dessert",
        price: 179,
        rating: 4.9,
        description: "Creamy cheesecake with fresh berries.",
        image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=700&q=80"
    }
];


/* =========================
   STATE
========================= */

let cart = [];
let selectedCategory = "All";


/* =========================
   DOM ELEMENTS
========================= */

const foodGrid = document.getElementById("foodGrid");
const categoryList = document.getElementById("categoryList");
const searchInput = document.getElementById("searchInput");

const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");

const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const checkoutButton = document.getElementById("checkoutButton");
const toast = document.getElementById("toast");

const mobileMenu = document.getElementById("mobileMenu");
const navLinks = document.querySelector(".nav-links");


/* =========================
   DISPLAY FOOD
========================= */

function renderFoods() {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredFoods = foods.filter(food => {
        const matchesCategory =
            selectedCategory === "All" ||
            food.category === selectedCategory;

        const matchesSearch =
            food.name.toLowerCase().includes(searchTerm) ||
            food.description.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    if (filteredFoods.length === 0) {
        foodGrid.innerHTML = `
            <div class="no-results">
                <h3>No delicious matches found 😔</h3>
                <p>Try another food or category.</p>
            </div>
        `;
        return;
    }

    foodGrid.innerHTML = filteredFoods.map(food => `
        <article class="food-card">

            <div class="food-image">
                <img
                    src="${food.image}"
                    alt="${food.name}"
                    loading="lazy"
                >

                <span class="food-tag">
                    ⭐ ${food.rating}
                </span>
            </div>

            <div class="food-details">
                <h3>${food.name}</h3>

                <p class="food-description">
                    ${food.description}
                </p>

                <div class="food-meta">
                    <span class="food-price">
                        ₹${food.price}
                    </span>

                    <button
                        class="add-button"
                        onclick="addToCart(${food.id})"
                        aria-label="Add ${food.name} to cart"
                    >
                        +
                    </button>
                </div>
            </div>

        </article>
    `).join("");
}


/* =========================
   CATEGORY FILTER
========================= */

categoryList.addEventListener("click", event => {
    const button = event.target.closest(".category-item");

    if (!button) return;

    document.querySelectorAll(".category-item")
        .forEach(item => item.classList.remove("active"));

    button.classList.add("active");

    selectedCategory = button.dataset.category;

    renderFoods();
});


/* =========================
   SEARCH
========================= */

searchInput.addEventListener("input", renderFoods);


/* =========================
   ADD TO CART
========================= */

function addToCart(foodId) {
    const food = foods.find(item => item.id === foodId);

    const existingItem = cart.find(item => item.id === foodId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...food,
            quantity: 1
        });
    }

    updateCart();

    showToast(`${food.name} added to cart!`);
}


/* =========================
   UPDATE CART
========================= */

function updateCart() {
    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    cartCount.textContent = totalItems;
    cartTotal.textContent = `₹${totalPrice}`;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty. Add something delicious!
            </p>
        `;
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">

            <div class="cart-item-info">
                <strong>${item.name}</strong>
                <small>₹${item.price} each</small>
            </div>

            <div class="quantity-controls">
                <button
                    onclick="changeQuantity(${item.id}, -1)"
                    aria-label="Decrease quantity"
                >
                    −
                </button>

                <span>${item.quantity}</span>

                <button
                    onclick="changeQuantity(${item.id}, 1)"
                    aria-label="Increase quantity"
                >
                    +
                </button>
            </div>

        </div>
    `).join("");
}


/* =========================
   CHANGE QUANTITY
========================= */

function changeQuantity(foodId, change) {
    const item = cart.find(item => item.id === foodId);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== foodId);
    }

    updateCart();
}


/* =========================
   CART MODAL
========================= */

cartButton.addEventListener("click", () => {
    cartModal.classList.add("show");
});

closeCart.addEventListener("click", () => {
    cartModal.classList.remove("show");
});

cartModal.addEventListener("click", event => {
    if (event.target === cartModal) {
        cartModal.classList.remove("show");
    }
});


/* =========================
   CHECKOUT
========================= */

checkoutButton.addEventListener("click", () => {
    if (cart.length === 0) {
        showToast("Your cart is empty!");
        return;
    }

    showToast("Demo checkout! Payment is not connected.");

    cart = [];
    updateCart();

    setTimeout(() => {
        cartModal.classList.remove("show");
    }, 1200);
});


/* =========================
   TOAST MESSAGE
========================= */

let toastTimer;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


/* =========================
   MOBILE MENU
========================= */

mobileMenu.addEventListener("click", () => {
    navLinks.classList.toggle("show");
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("show");
    });
});


/* =========================
   INITIALIZE
========================= */

renderFoods();
updateCart();