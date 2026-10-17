
const CART_KEY = "bloomeCart";
const ORDER_KEY = "bloomeLastOrder";

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function rupiah(value) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(value);
}

function renderCart() {
    const cart = getCart();
    const container = document.getElementById("cart-items");
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");
    const submitButton = document.querySelector(".checkout-submit");

    if (!container || !subtotalElement || !totalElement) return;

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = `
            <p class="cart-empty">
                Your cart is empty.
                <a href="index.html#products">Choose your flowers here.</a>
            </p>
        `;
    } else {
        cart.forEach((item, index) => {
            const article = document.createElement("article");
            article.className = "cart-item";

            const image = document.createElement("img");
            image.src = item.image || "";
            image.alt = item.name || "Flower bouquet";

            const details = document.createElement("div");

            const title = document.createElement("h3");
            title.textContent = item.name;

            const price = document.createElement("p");
            price.className = "item-price";
            price.textContent = rupiah(item.price * item.quantity);

            const controls = document.createElement("div");
            controls.className = "quantity-controls";

            const minus = document.createElement("button");
            minus.type = "button";
            minus.textContent = "−";
            minus.dataset.action = "decrease";
            minus.dataset.index = index;

            const quantity = document.createElement("span");
            quantity.textContent = item.quantity;

            const plus = document.createElement("button");
            plus.type = "button";
            plus.textContent = "+";
            plus.dataset.action = "increase";
            plus.dataset.index = index;

            controls.append(minus, quantity, plus);

            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "remove-item";
            remove.textContent = "Remove";
            remove.dataset.action = "remove";
            remove.dataset.index = index;

            details.append(title, price, controls, remove);
            article.append(image, details);
            container.appendChild(article);
        });
    }

    const subtotal = cart.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
    );

    subtotalElement.textContent = rupiah(subtotal);
    totalElement.textContent = rupiah(subtotal);

    if (submitButton) {
        submitButton.disabled = cart.length === 0;
    }
}

// Tombol tambah, kurang, dan hapus produk
document.getElementById("cart-items").addEventListener("click", function(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const cart = getCart();
    const index = Number(button.dataset.index);

    if (!cart[index]) return;

    if (button.dataset.action === "increase") {
        cart[index].quantity++;
    } else if (button.dataset.action === "decrease") {
        cart[index].quantity--;
    } else if (button.dataset.action === "remove") {
        cart.splice(index, 1);
    }

    if (cart[index] && cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
});

// Proses pesanan dan pindah ke halaman sukses
document.getElementById("checkout-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const cart = getCart();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    if (!this.checkValidity()) {
        this.reportValidity();
        return;
    }

    const formData = new FormData(this);

    const total = cart.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
    );

    const order = {
        items: cart,
        total: total,
        customer: {
            name: formData.get("customerName"),
            phone: formData.get("phone"),
            address: formData.get("address"),
            payment: formData.get("payment"),
            notes: formData.get("notes")
        }
    };

    // Simpan data pesanan SEBELUM mengosongkan keranjang
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
    localStorage.removeItem(CART_KEY);

    // Buka halaman sukses
    window.location.href = "success.html";
});

renderCart();
