const BASE_URL = (window.location.hostname.includes('localhost') || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:8081/api/pessoas'
  : 'https://spring-jwt-auth-jdli.onrender.com/api/pessoas';

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
      const res = await fetch(`${BASE_URL}/cadastrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, senha })
      });

      if (!res.ok) {
        let mensagemErro = "Erro ao cadastrar";
        try {
          const json = await res.json();
          if (json.erro) mensagemErro = json.erro;
        } catch (_) {
        }
        throw new Error(mensagemErro);
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
  document.getElementById("assinatura").textContent =
    `${new Date().toLocaleDateString('pt-BR')} - Wallaks Cardoso`;
}
