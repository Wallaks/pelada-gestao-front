const BASE_URL = (window.location.hostname.includes('localhost') || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:8080/api'
  : 'https://pelada-gestao.onrender.com/api';

const apiUrlSorteios = `${BASE_URL}/sorteios`;

document.addEventListener("DOMContentLoaded", () => {
  verificarAutenticacao();
  atualizarAssinatura();
  carregarSorteios();

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

function getUsuarioLogado() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.sub || null;
  } catch {
    return null;
  }
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

async function carregarSorteios() {
  showLoading(true);
  try {
    const res = await fetch(apiUrlSorteios, {
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      const msg = await extrairMensagemErro(res);
      throw new Error(msg);
    }

    const sorteios = await res.json();
    const sorteiosEmAndamento = sorteios.filter(s => !s.sorteado);
    exibirSorteios(sorteiosEmAndamento);
  } catch (err) {
    showToast(err.message, true);
  } finally {
    showLoading(false);
  }
}

function exibirSorteios(sorteios) {
  const usuarioLogado = getUsuarioLogado();
  const ul = document.getElementById("listaSorteios");
  ul.innerHTML = "";

  sorteios.forEach(sorteio => {
    const li = document.createElement("li");
    const content = document.createElement("div");
    Object.assign(content.style, {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%"
    });

    const span = document.createElement("span");
    span.textContent = `${sorteio.nome || "Sem nome"} - ${new Date(sorteio.data).toLocaleDateString("pt-BR")}`;
    span.style.cursor = "pointer";
    span.onclick = () => {
      window.location.href = `cadastroJogador.html?sorteioId=${sorteio.id}&nome=${encodeURIComponent(sorteio.nome)}&sorteado=${sorteio.sorteado ? 'true' : 'false'}`;
    };

    const btn = document.createElement("button");
    btn.textContent = "Excluir";
    btn.classList.add("btn-excluir");

    const isDono = usuarioLogado && sorteio.cadastradoPor === usuarioLogado;

    if (!isDono) {
      btn.disabled = true;
      btn.style.opacity = "0.6";
      btn.style.cursor = "not-allowed";
    } else {
      btn.onclick = () => deletarSorteio(sorteio.id);
    }

    content.append(span, btn);
    li.appendChild(content);
    ul.appendChild(li);
  });
}

async function deletarSorteio(id) {
  if (!confirm("Tem certeza que deseja excluir este sorteio?")) return;

  showLoading(true);
  try {
    const res = await fetch(`${apiUrlSorteios}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      const msg = await extrairMensagemErro(res);
      throw new Error(msg);
    }

    showToast("Sorteio excluído.");
    carregarSorteios();
  } catch (err) {
    showToast(err.message, true);
  } finally {
    showLoading(false);
  }
}
