const BASE_URL = (window.location.hostname.includes('localhost') || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:8081/api/pessoas'
  : 'https://spring-jwt-auth-jdli.onrender.com/api/pessoas';

document.addEventListener("DOMContentLoaded", () => {
  atualizarAssinatura();

  document.getElementById("btnCadastrarPessoa").addEventListener("click", cadastrarPessoa);

  document.querySelector(".btn-voltar")?.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
});

function atualizarAssinatura() {
  document.getElementById("assinatura").textContent =
    `${new Date().toLocaleDateString('pt-BR')} - Wallaks Cardoso`;
}

async function extrairMensagemErro(res) {
  try {
    const data = await res.json();
    if (data?.mensagem) return data.mensagem;

    const primeiroErro = Object.values(data)[0];
    if (typeof primeiroErro === 'string') return primeiroErro;

    return "Erro inesperado ao processar o cadastro.";
  } catch {
    return "Erro inesperado ao processar resposta do servidor.";
  }
}

async function cadastrarPessoa() {
  const nome = document.getElementById("nome").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!nome || !senha) {
    showToast("Preencha todos os campos", true);
    return;
  }

  showLoading(true);
  try {
    const res = await fetch(`${BASE_URL}/cadastrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, senha })
    });

    if (!res.ok) {
      const mensagem = await extrairMensagemErro(res);
      throw new Error(mensagem);
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
}
