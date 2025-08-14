// Amado Shop - JS Accueil
(function () {
  "use strict";

  const popularProductsEl = document.getElementById("popular-products");

  function formatGNF(amount) {
    try {
      return new Intl.NumberFormat("fr-GN", {
        style: "currency",
        currency: "GNF",
        maximumFractionDigits: 0,
      }).format(amount);
    } catch (e) {
      return `${amount.toLocaleString("fr-FR")} GNF`;
    }
  }

  async function fetchPopularProducts() {
    if (!popularProductsEl) return;
    try {
      const res = await fetch("backend/products/list.php?popular=1");
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Erreur");
      renderProducts(data.products || []);
    } catch (err) {
      popularProductsEl.innerHTML =
        '<div class="col-12 text-center text-muted">Impossible de charger les produits pour le moment.</div>';
    }
  }

  function renderProducts(products) {
    if (!products.length) {
      popularProductsEl.innerHTML =
        '<div class="col-12 text-center text-muted">Aucun produit disponible.</div>';
      return;
    }
    popularProductsEl.innerHTML = products
      .slice(0, 8)
      .map(
        (p) => `
      <div class="col-sm-6 col-lg-3 fade-up">
        <div class="product-card">
          <img class="product-thumb" src="${
            p.image_url || "assets/images/placeholders/product.jpg"
          }" alt="${p.name}">
          <div class="product-body">
            <h3 class="product-title">${p.name}</h3>
            <div class="d-flex align-items-center justify-content-between">
              <span class="product-price">${formatGNF(p.price || 0)}</span>
              <button class="btn btn-sm btn-primary" data-product='${JSON.stringify(
                p
              ).replace(/'/g, "&#39;")}'>Commander</button>
            </div>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    popularProductsEl.querySelectorAll("button.btn-primary").forEach((btn) => {
      btn.addEventListener("click", () => {
        const product = JSON.parse(
          btn.getAttribute("data-product").replace(/&#39;/g, "'")
        );
        const phone = "+224123456789";
        const text = encodeURIComponent(
          `Bonjour, je souhaite commander: ${product.name} (${formatGNF(
            product.price
          )}). Adresse: `
        );
        window.open(
          `https://wa.me/${phone.replace(/\D/g, "")}?text=${text}`,
          "_blank"
        );
      });
    });
  }

  function setupContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      form.reset();
      const alert = document.createElement("div");
      alert.className = "alert alert-success mt-3";
      alert.textContent =
        "Merci, votre message a été envoyé. Nous vous répondrons rapidement.";
      form.parentElement.appendChild(alert);
      setTimeout(() => alert.remove(), 4000);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    fetchPopularProducts();
    setupContactForm();
  });
})();
