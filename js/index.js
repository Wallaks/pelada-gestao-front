const BASE_URL = (window.location.hostname.includes('localhost') || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:8081/api/auth'
  : 'https://spring-jwt-auth-jdli.onrender.com/api/auth';

document.addEventListener("DOMContentLoaded", () => {
  atualizarAssinatura();

  const html = document.documentElement;
  const toggle = document.getElementById("darkSwitch");
  const savedTheme = localStorage.getItem("darkMode") === "true";

  if (savedTheme) html.classList.add("dark-mode");

  toggle.checked = savedTheme;

  toggle.addEventListener("change", () => {
    const isDark = toggle.checked;
    html.classList.toggle("dark-mode", isDark);
    localStorage.setItem("darkMode", isDark);
  });

  document.getElementById("btnLogin").addEventListener("click", async () => {
    const nome = document.getElementById("nome").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!nome || !senha) {
      showToast("Preencha todos os campos", true);
      return;
    }

    try {
      showLoading(true);
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, senha })
      });

      if (!res.ok) throw new Error("Usuário ou senha inválidos");

      const data = await res.json();
      localStorage.setItem("token", data.token);
      window.location.href = "pages/home.html";
    } catch (err) {
      showToast(err.message, true);
    } finally {
      showLoading(false);
    }
  });

  document.getElementById("btnCadastro").addEventListener("click", () => {
    window.location.href = "pages/cadastroPessoa.html";
  });
});

function atualizarAssinatura() {
  document.getElementById("assinatura").textContent =
    `${new Date().toLocaleDateString('pt-BR')} - Wallaks Cardoso`;
}
