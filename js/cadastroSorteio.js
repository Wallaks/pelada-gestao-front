const BASE_URL = (window.location.hostname.includes('localhost') || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:8080/api'
  : 'https://pelada-gestao.onrender.com/api';

const apiUrlSorteios = `${BASE_URL}/sorteios`;

document.addEventListener("DOMContentLoaded", () => {
  verificarAutenticacao();
  atualizarAssinatura();

  document.getElementById("btnCriarSorteio").addEventListener("click", criarSorteio);
  document.querySelector(".btn-voltar")?.addEventListener("click", () => {
    window.location.href = "home.html";
  });
});

function verificarAutenticacao() {
  const token = localStorage.getItem("token");
  if (!token) window.location.href = "../index.html";
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

function atualizarAssinatura() {
  document.getElementById("assinatura").textContent = `${new Date().toLocaleDateString('pt-BR')} - Wallaks Cardoso`;
}

async function extrairMensagemErro(res) {
  try {
    const data = await res.json();
    return data?.mensagem || "Erro inesperado";
  } catch {
    return "Erro inesperado ao processar resposta do servidor";
  }
}

async function criarSorteio() {
  const nome = document.getElementById("nomeSorteio").value.trim();
  const qtd = parseInt(document.getElementById("qtdPorEquipe").value);
  const email = document.getElementById("emailNotificacao").value.trim();
  const data = new Date().toISOString().split("T")[0];

  if (!nome || isNaN(qtd) || qtd <= 0 || !email) {
    return showToast("Preencha todos os campos corretamente.", true);
  }

  if (nome.length > 20) {
    return showToast("O nome do sorteio deve ter no máximo 20 caracteres.", true);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return showToast("Informe um e-mail válido.", true);
  }

  const payload = {
    nome,
    jogadoresPorEquipe: qtd,
    data,
    emailNotificacao: email
  };

  showLoading(true);
  try {
    const res = await fetch(apiUrlSorteios, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const msg = await extrairMensagemErro(res);
      throw new Error(msg);
    }

    showToast("Sorteio criado com sucesso.");
    document.getElementById("nomeSorteio").value = "";
    document.getElementById("qtdPorEquipe").value = "";
    document.getElementById("emailNotificacao").value = "";
  } catch (err) {
    showToast(err.message, true);
  } finally {
    showLoading(false);
  }
}
