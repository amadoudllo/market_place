// Amado Shop - JS Boutique
(function () {
  "use strict";

  const gridEl = document.getElementById("products-grid");
  const paginationEl = document.getElementById("pagination");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const priceFilter = document.getElementById("priceFilter");
  const sortFilter = document.getElementById("sortFilter");

  const productModal = document.getElementById("productModal");
  const productModalTitle = document.getElementById("productModalTitle");
  const productModalBody = document.getElementById("productModalBody");
  const orderWhatsAppBtn = document.getElementById("orderWhatsAppBtn");

  const state = { page: 1, pageSize: 12, total: 0, products: [], filters: {} };

  function formatGNF(amount) {
    try {
      return new Intl.NumberFormat("fr-GN", {
        style: "currency",
        currency: "GNF",
        maximumFractionDigits: 0,
      }).format(amount);
    } catch (e) {
      return `${(amount || 0).toLocaleString("fr-FR")} GNF`;
    }
  }

  function parsePriceRange(value) {
    if (!value) return null;
    if (value.endsWith("+")) return { min: parseInt(value), max: null };
    const [min, max] = value.split("-").map(Number);
    return { min, max };
  }

  function buildQuery() {
    const params = new URLSearchParams();
    if (searchInput && searchInput.value)
      params.set("q", searchInput.value.trim());
    if (categoryFilter && categoryFilter.value)
      params.set("category", categoryFilter.value);
    if (priceFilter && priceFilter.value)
      params.set("price", priceFilter.value);
    if (sortFilter && sortFilter.value) params.set("sort", sortFilter.value);
    params.set("page", String(state.page));
    params.set("pageSize", String(state.pageSize));
    return params.toString();
  }

  async function fetchProducts() {
    if (!gridEl) return;
    gridEl.innerHTML =
      '<div class="col-12 text-center text-muted">Chargement...</div>';
    try {
      const res = await fetch(`backend/products/list.php?${buildQuery()}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Erreur");
      state.products = data.products || [];
      state.total = data.total || state.products.length;
      renderGrid();
      renderPagination();
    } catch (err) {
      gridEl.innerHTML =
        '<div class="col-12 text-center text-muted">Impossible de charger les produits.</div>';
      paginationEl && (paginationEl.innerHTML = "");
    }
  }

  function renderGrid() {
    if (!state.products.length) {
      gridEl.innerHTML =
        '<div class="col-12 text-center text-muted">Aucun produit trouvé.</div>';
      return;
    }
    gridEl.innerHTML = state.products
      .map(
        (p) => `
      <div class="col-sm-6 col-lg-3">
        <div class="product-card h-100">
          <img class="product-thumb" src="${
            p.image_url || "assets/images/placeholders/product.jpg"
          }" alt="${p.name}">
          <div class="product-body d-flex flex-column">
            <h3 class="product-title">${p.name}</h3>
            <div class="mb-2 text-muted" style="font-size:.9rem">${
              p.category_name || ""
            }</div>
            <div class="mt-auto d-flex align-items-center justify-content-between">
              <span class="product-price">${formatGNF(p.price || 0)}</span>
              <div class="btn-group">
                <button class="btn btn-sm btn-outline-secondary" data-action="details" data-id="${
                  p.id
                }"><i class="fas fa-eye"></i></button>
                <button class="btn btn-sm btn-primary" data-action="order" data-id="${
                  p.id
                }"><i class="fab fa-whatsapp"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    gridEl
      .querySelectorAll("[data-action]")
      .forEach((btn) =>
        btn.addEventListener("click", (e) => onActionClick(e, btn))
      );
  }

  function renderPagination() {
    if (!paginationEl) return;
    const totalPages = Math.max(1, Math.ceil(state.total / state.pageSize));
    const current = state.page;
    let html = "";
    const pageBtn = (p, label = p, disabled = false, active = false) => `
      <li class="page-item ${disabled ? "disabled" : ""} ${
      active ? "active" : ""
    }">
        <a class="page-link" href="#" data-page="${p}">${label}</a>
      </li>`;
    html += pageBtn(current - 1, "&laquo;", current <= 1);
    for (
      let p = Math.max(1, current - 2);
      p <= Math.min(totalPages, current + 2);
      p++
    ) {
      html += pageBtn(p, String(p), false, p === current);
    }
    html += pageBtn(current + 1, "&raquo;", current >= totalPages);
    paginationEl.innerHTML = html;

    paginationEl.querySelectorAll("a[data-page]").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const p = parseInt(a.getAttribute("data-page"));
        if (!isNaN(p) && p !== state.page) {
          state.page = p;
          fetchProducts();
        }
      });
    });
  }

  function onActionClick(e, btn) {
    e.preventDefault();
    const id = btn.getAttribute("data-id");
    const action = btn.getAttribute("data-action");
    const product = state.products.find((x) => String(x.id) === String(id));
    if (!product) return;
    if (action === "details") return openModal(product);
    if (action === "order") return orderWhatsApp(product);
  }

  function openModal(product) {
    if (!productModal) return;
    productModalTitle.textContent = product.name;
    const images =
      Array.isArray(product.images) && product.images.length
        ? product.images
        : [product.image_url];
    productModalBody.innerHTML = `
      <div class="row g-4">
        <div class="col-md-6">
          <img src="${
            images[0] || "assets/images/placeholders/product.jpg"
          }" class="img-fluid rounded" alt="${product.name}">
        </div>
        <div class="col-md-6">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <h5 class="mb-0">${product.name}</h5>
            <span class="badge badge-gold">${product.category_name || ""}</span>
          </div>
          <div class="h4 text-emerald mb-3">${formatGNF(
            product.price || 0
          )}</div>
          <p class="text-muted">${product.description || ""}</p>
        </div>
      </div>
    `;
    orderWhatsAppBtn.onclick = () => orderWhatsApp(product);
    const modal = bootstrap.Modal.getOrCreateInstance(productModal);
    modal.show();
  }

  function orderWhatsApp(product) {
    const phone = "+224123456789";
    const text = encodeURIComponent(
      `Bonjour, je souhaite commander: ${product.name} (${formatGNF(
        product.price
      )}). Quantité: 1. Adresse: `
    );
    window.open(
      `https://wa.me/${phone.replace(/\D/g, "")}?text=${text}`,
      "_blank"
    );
  }

  function applyUrlCategory() {
    const url = new URL(window.location.href);
    const c = url.searchParams.get("category");
    if (c && categoryFilter) {
      categoryFilter.value = c;
    }
  }

  function bindFilters() {
    [searchInput, categoryFilter, priceFilter, sortFilter].forEach((el) => {
      if (!el) return;
      el.addEventListener("change", () => {
        state.page = 1;
        fetchProducts();
      });
      if (el === searchInput)
        el.addEventListener("keyup", (e) => {
          if (e.key === "Enter") {
            state.page = 1;
            fetchProducts();
          }
        });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyUrlCategory();
    bindFilters();
    fetchProducts();
  });
})();
