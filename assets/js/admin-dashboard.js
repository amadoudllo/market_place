(function () {
  "use strict";

  const pages = {
    dashboard: document.getElementById("dashboard-page"),
    products: document.getElementById("products-page"),
    orders: document.getElementById("orders-page"),
  };

  function showPage(key) {
    Object.values(pages).forEach((p) => p && (p.style.display = "none"));
    pages[key] && (pages[key].style.display = "");
  }

  function bindSidebar() {
    document.querySelectorAll("#sidebar a[data-page]").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const key = a.getAttribute("data-page");
        showPage(key);
      });
    });
    const btn = document.getElementById("sidebarCollapseBtn");
    btn &&
      btn.addEventListener("click", () => {
        document.getElementById("sidebar").classList.toggle("open");
      });
  }

  async function checkSession() {
    try {
      const r = await fetch("../backend/auth/check.php");
      const d = await r.json();
      if (!d.success) window.location.href = "index.html";
      else {
        const el = document.getElementById("adminName");
        if (el) el.textContent = d.admin?.name || "Admin";
      }
    } catch (e) {
      window.location.href = "index.html";
    }
  }

  function formatGNF(n) {
    try {
      return new Intl.NumberFormat("fr-GN", {
        style: "currency",
        currency: "GNF",
        maximumFractionDigits: 0,
      }).format(n);
    } catch (e) {
      return `${(n || 0).toLocaleString("fr-FR")} GNF`;
    }
  }

  async function loadDashboard() {
    // Charts (démo)
    const salesCtx = document.getElementById("salesChart");
    const categoryCtx = document.getElementById("categoryChart");
    if (salesCtx)
      new Chart(salesCtx, {
        type: "line",
        data: {
          labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
          datasets: [
            {
              label: "Ventes",
              data: [12, 19, 7, 11, 15, 22, 18],
              borderColor: "#10b981",
              tension: 0.3,
            },
          ],
        },
        options: { plugins: { legend: { display: false } } },
      });
    if (categoryCtx)
      new Chart(categoryCtx, {
        type: "doughnut",
        data: {
          labels: ["Mode", "Électronique", "Alimentation", "Accessoires"],
          datasets: [
            {
              data: [35, 25, 20, 20],
              backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"],
            },
          ],
        },
        options: { plugins: { legend: { position: "bottom" } } },
      });
    // Date
    const d = new Date();
    const dateEl = document.getElementById("currentDate");
    if (dateEl)
      dateEl.textContent = d.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    // Stats dynamiques
    await refreshStats();
  }

  async function refreshStats() {
    try {
      const r = await fetch("../backend/stats/overview.php");
      const s = await r.json();
      if (!s.success) return;
      document.getElementById("totalOrders").textContent = s.ordersToday;
      document.getElementById("dailyRevenue").textContent = formatGNF(
        s.revenueToday
      );
      document.getElementById("pendingOrders").textContent = s.pending;
      document.getElementById("totalCustomers").textContent = s.totalCustomers;
    } catch (e) {
      /* ignore */
    }
  }

  async function loadProducts() {
    try {
      const r = await fetch("../backend/products/list.php?page=1&pageSize=100");
      const d = await r.json();
      const body = document.getElementById("productsTableBody");
      if (!body) return;
      body.innerHTML = (d.products || [])
        .map(
          (p) => `
				<tr>
					<td><img src="${
            p.image_url || "../assets/images/placeholders/product.jpg"
          }" alt="" width="44" height="44" style="object-fit:cover;border-radius:8px"></td>
					<td>${p.name}</td>
					<td>${p.category || ""}</td>
					<td>${formatGNF(p.price || 0)}</td>
					<td>${p.stock ?? "-"}</td>
					<td>${
            p.promo
              ? '<span class="badge bg-warning">Promo</span>'
              : '<span class="badge bg-secondary">Normal</span>'
          }</td>
					<td>
						<button class="btn btn-sm btn-outline-primary" data-action="edit" data-id="${
              p.id
            }"><i class="fas fa-edit"></i></button>
						<button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${
              p.id
            }"><i class="fas fa-trash"></i></button>
					</td>
				</tr>
			`
        )
        .join("");
    } catch (e) {
      /* ignore */
    }
  }

  async function loadOrders() {
    try {
      const r = await fetch("../backend/orders/list.php?page=1&pageSize=50");
      const d = await r.json();
      const body = document.getElementById("ordersTableBody");
      const recent = document.getElementById("recentOrdersTable");
      if (!body || !recent) return;
      const rows = (d.orders || [])
        .map(
          (o) => `
				<tr>
					<td>#${o.order_number}</td>
					<td>${o.customer_name || ""}</td>
					<td>${o.items_count || 0}</td>
					<td>${formatGNF(o.total || 0)}</td>
					<td><span class="badge ${
            o.status === "delivered"
              ? "bg-success"
              : o.status === "processing"
              ? "bg-info"
              : o.status === "delivering"
              ? "bg-warning"
              : "bg-secondary"
          }">${o.status}</span></td>
					<td>${new Date(o.created_at).toLocaleString("fr-FR")}</td>
					<td>
						<div class="btn-group">
							<button class="btn btn-sm btn-outline-secondary" data-action="view" data-id="${
                o.id
              }"><i class="fas fa-eye"></i></button>
							<button class="btn btn-sm btn-outline-success" data-action="status" data-status="delivered" data-id="${
                o.id
              }"><i class="fas fa-check"></i></button>
						</div>
					</td>
				</tr>`
        )
        .join("");
      body.innerHTML = rows;
      recent.innerHTML = rows;
    } catch (e) {
      /* ignore */
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    await checkSession();
    bindSidebar();
    showPage("dashboard");
    await loadDashboard();
    await Promise.all([loadProducts(), loadOrders()]);
    setInterval(() => {
      refreshStats();
      loadOrders();
    }, 30000);
  });
})();
