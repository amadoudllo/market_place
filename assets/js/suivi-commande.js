// Amado Shop - JS Suivi de commande
(function () {
  "use strict";

  const trackingForm = document.getElementById("trackingForm");
  const trackingResult = document.getElementById("trackingResult");
  const errorSection = document.getElementById("errorSection");
  const productsTableBody = document.getElementById("productsTableBody");
  const orderTitle = document.getElementById("orderTitle");
  const orderDate = document.getElementById("orderDate");
  const currentStatus = document.getElementById("currentStatus");
  const estimatedDelivery = document.getElementById("estimatedDelivery");
  const orderTotal = document.getElementById("orderTotal");

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

  async function handleSubmit(e) {
    e.preventDefault();
    const number = document.getElementById("orderNumber").value.trim();
    const phone = document.getElementById("phoneNumber").value.trim();
    if (!number || !phone) return;
    showTrackingForm();

    try {
      const res = await fetch("backend/orders/track.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_number: number, phone }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Non trouvé");
      renderOrder(data.order);
    } catch (err) {
      showError();
    }
  }

  function renderOrder(order) {
    hideAll();
    trackingResult.style.display = "";
    orderTitle.textContent = `Commande #${order.order_number}`;
    orderDate.textContent = order.created_at_text || "";
    currentStatus.textContent = order.status_label || order.status || "";
    estimatedDelivery.textContent = order.eta || "";

    productsTableBody.innerHTML = (order.items || [])
      .map(
        (it) => `
      <tr>
        <td>${it.name}</td>
        <td>${formatGNF(it.price)}</td>
        <td>${it.quantity}</td>
        <td>${formatGNF((it.price || 0) * (it.quantity || 1))}</td>
      </tr>
    `
      )
      .join("");

    orderTotal.textContent = formatGNF(order.total || 0);

    // timeline states
    setActiveSteps(order.status);
  }

  function setActiveSteps(status) {
    const steps = ["step1", "step2", "step3", "step4"];
    const map = { pending: 1, processing: 2, delivering: 3, delivered: 4 };
    const activeCount = map[String(status || "").toLowerCase()] || 1;
    steps.forEach((id, idx) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (idx < activeCount) el.classList.add("active");
      else el.classList.remove("active");
    });
  }

  function hideAll() {
    trackingResult.style.display = "none";
    errorSection.style.display = "none";
  }
  window.showTrackingForm = function () {
    hideAll();
    document
      .querySelector(".tracking-section")
      .scrollIntoView({ behavior: "smooth" });
  };
  window.printOrder = function () {
    window.print();
  };
  window.contactSupport = function () {
    const phone = "+224123456789";
    const text = encodeURIComponent(
      "Bonjour, je souhaite des informations sur ma commande."
    );
    window.open(
      `https://wa.me/${phone.replace(/\D/g, "")}?text=${text}`,
      "_blank"
    );
  };
  window.newSearch = function () {
    showTrackingForm();
  };

  function showError() {
    hideAll();
    errorSection.style.display = "";
  }

  document.addEventListener("DOMContentLoaded", () => {
    trackingForm && trackingForm.addEventListener("submit", handleSubmit);
  });
})();
