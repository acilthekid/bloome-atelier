
document.addEventListener("DOMContentLoaded", function () {
    const order = JSON.parse(
        localStorage.getItem("bloomeLastOrder") || "null"
    );

    const itemsContainer = document.getElementById("order-items");
    const totalElement = document.getElementById("order-total");

    function formatRupiah(amount) {
        return "Rp " + Number(amount).toLocaleString("id-ID");
    }

    if (!order || !Array.isArray(order.items) || order.items.length === 0) {
        itemsContainer.textContent =
            "Your order details will appear here.";

        totalElement.textContent = "Rp 0";
        return;
    }

    itemsContainer.innerHTML = "";

    order.items.forEach(function (item) {
        const row = document.createElement("p");
        const quantity = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;

        row.textContent =
            `${item.name} × ${quantity} — ` +
            formatRupiah(price * quantity);

        itemsContainer.appendChild(row);
    });

    const total = order.items.reduce(function (sum, item) {
        return sum +
            (Number(item.price) || 0) *
            (Number(item.quantity) || 0);
    }, 0);

    totalElement.textContent = formatRupiah(total);
});
