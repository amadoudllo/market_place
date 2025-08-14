(function () {
  "use strict";
  const form = document.getElementById("adminLoginForm");
  const toggle = document.getElementById("togglePassword");
  const password = document.getElementById("password");
  const alertContainer = document.getElementById("alertContainer");

  function showAlert(type, message) {
    const el = document.createElement("div");
    el.className = `alert alert-${type} alert-dismissible fade show`;
    el.role = "alert";
    el.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    alertContainer.appendChild(el);
    setTimeout(() => {
      try {
        el.remove();
      } catch (e) {}
    }, 5000);
  }

  toggle &&
    toggle.addEventListener("click", () => {
      if (!password) return;
      password.type = password.type === "password" ? "text" : "password";
      const i = toggle.querySelector("i");
      i && i.classList.toggle("fa-eye-slash");
    });

  form &&
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const pwd = password.value;
      try {
        const res = await fetch("../backend/auth/login.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password: pwd }),
        });
        const data = await res.json();
        if (!data.success) {
          showAlert("danger", data.message || "Connexion échouée");
          return;
        }
        showAlert("success", "Connexion réussie, redirection...");
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 700);
      } catch (err) {
        showAlert("danger", "Erreur réseau");
      }
    });
})();
