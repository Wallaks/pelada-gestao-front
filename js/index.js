const BASE_URL = (window.location.hostname.includes('localhost') || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:8081/api'
  : 'https://pelada-gestao.onrender.com/api';

document.addEventListener("DOMContentLoaded", () => {
  atualizarAssinatura();

  document.getElementById("btnLogin").addEventListener("click", async () => {
    const nome = document.getElementById("nome").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!nome || !senha) {
      showToast("Preencha todos os campos", true);
      return;
    }

    try {
      showLoading(true);
      const res = await fetch(`${BASE_URL}/auth/login`, {
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
  document.getElementById("assinatura").textContent = `${new Date().toLocaleDateString('pt-BR')} - Wallaks Cardoso`;
}
