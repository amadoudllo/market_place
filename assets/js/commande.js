(function () {
  "use strict";
  const form = document.getElementById("orderForm");
  const success = document.getElementById("orderSuccess");

  function getParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  }
  function prefill() {
    const p = getParam("product");
    const price = getParam("price");
    if (p) document.getElementById("product").value = decodeURIComponent(p);
    if (price)
      document.getElementById("price").value = parseInt(price, 10) || "";
  }

  async function submit(e) {
    e.preventDefault();
    const payload = {
      customer_name: document.getElementById("name").value.trim(),
      customer_phone: document.getElementById("phone").value.trim(),
      customer_address: document.getElementById("address").value.trim(),
      product_name: document.getElementById("product").value.trim(),
      quantity: parseInt(document.getElementById("quantity").value, 10) || 1,
      price: parseInt(document.getElementById("price").value, 10) || 0,
      notes: document.getElementById("notes").value.trim(),
    };
    try {
      const res = await fetch("backend/orders/create.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Erreur");
      success.classList.remove("d-none");
      form.reset();
    } catch (err) {
      alert("Impossible d'envoyer la commande.");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    prefill();
    form && form.addEventListener("submit", submit);
  });
})();
