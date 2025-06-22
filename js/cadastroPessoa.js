const BASE_URL = (window.location.hostname.includes('localhost') || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:8081/api'
  : 'https://spring-jwt-auth-jdli.onrender.com/api';

document.addEventListener("DOMContentLoaded", () => {
  atualizarAssinatura();

  document.getElementById("btnCadastrarPessoa").addEventListener("click", async () => {
    const nome = document.getElementById("nome").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!nome || !senha) {
      showToast("Preencha todos os campos", true);
      return;
    }

    try {
      showLoading(true);
      const res = await fetch(`${BASE_URL}/pessoas/cadastrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, senha })
      });

      if (!res.ok) {
        const erroTexto = await res.text();
        throw new Error(erroTexto || "Erro ao cadastrar");
      }

      showToast("Cadastro realizado com sucesso");
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1500);
    } catch (err) {
      showToast(err.message, true);
    } finally {
      showLoading(false);
    }
  });

  document.querySelector(".btn-voltar")?.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
});

function atualizarAssinatura() {
  document.getElementById("assinatura").textContent = `${new Date().toLocaleDateString('pt-BR')} - Wallaks Cardoso`;
}
