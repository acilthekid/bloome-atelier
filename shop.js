

function showBloomeToast(message) {
    let toast = document.querySelector(".bloome-toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.className = "bloome-toast";
        toast.setAttribute("role", "status");

        toast.innerHTML = `
            <div class="bloome-toast-icon">♡</div>
            <div class="bloome-toast-message">
                <strong>A Little Bloom Added!</strong>
                <span class="toast-text"></span>
            </div>
        `;

        document.body.appendChild(toast);
    }

    toast.querySelector(".toast-text").textContent = message;

    const title = toast.querySelector("strong");
    title.textContent = "Added to your cart!";

    toast.classList.add("show");

    clearTimeout(window.bloomeToastTimer);

    window.bloomeToastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


const CART_KEY = "bloomeCart";

// Mengambil isi keranjang
function readCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (error) {
        return [];
    }
}

// Menyimpan isi keranjang
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

// Memperbarui jumlah barang di navbar
function updateCartCount() {
    const countElement = document.getElementById("cart-count");
    if (!countElement) return;

    const totalItems = readCart().reduce(
        (sum, item) => sum + item.quantity, 0
    );

    countElement.textContent = totalItems;
}

// Mengambil informasi produk dari tombol
function productFromButton(button) {
    return {
        name: button.dataset.name,
        price: Number(button.dataset.price),
        image: button.dataset.image
    };
}

// Menambahkan produk ke keranjang
function addProduct(product, goToCheckout = false) {
    const cart = readCart();

    const existing = cart.find(
        item => item.name === product.name
    );

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart(cart);

    if (goToCheckout) {
        window.location.href = "checkout.html";
    } else {
        showBloomeToast(name + " our lovely pick is now in your basket. ♡");
    }
}

// Tombol Add to Cart
document.querySelectorAll(".add-cart-btn").forEach(button => {
    button.addEventListener("click", () => {
        addProduct(productFromButton(button));
    });
});

// Tombol Buy Now
document.querySelectorAll(".buy-now-btn").forEach(button => {
    button.addEventListener("click", () => {
        addProduct(productFromButton(button), true);
    });
});

// Form Contact
const contactForm = document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();

        alert("Thank you for contacting Bloomé!");

        contactForm.reset();
    });
}

// Menampilkan jumlah barang saat halaman dibuka
updateCartCount();
