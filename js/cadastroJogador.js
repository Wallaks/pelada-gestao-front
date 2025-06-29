const BASE_URL = (window.location.hostname.includes('localhost') || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:8080/api'
  : 'https://pelada-gestao.onrender.com/api';

const apiUrlJogadores = `${BASE_URL}/jogadores`;
const apiUrlSorteio = `${BASE_URL}/sorteios`;

const urlParams = new URLSearchParams(window.location.search);
const sorteioId = urlParams.get("sorteioId");
const nomeSorteio = urlParams.get("nome");
let sorteioJaFeito = urlParams.get("sorteado") === 'true';

const titulo = document.getElementById("nomeSorteio");
if (titulo) {
  titulo.textContent = `Sorteio: ${decodeURIComponent(nomeSorteio)}`;
  titulo.style.textAlign = "left";
}

atualizarAssinatura();
carregarJogadores();
verificarPermissaoSorteio();

const btnSortear = document.getElementById("btnSortear");
const btnAdicionar = document.getElementById("btnAdicionar");
const btnGoleiro = document.getElementById("btnGoleiro");

let goleiroAtivo = false;

btnGoleiro?.addEventListener("click", () => {
  goleiroAtivo = !goleiroAtivo;
  btnGoleiro.classList.toggle("ativo", goleiroAtivo);
});

if (sorteioJaFeito) {
  desabilitarAcaoJaSorteado(btnSortear);
  desabilitarAcaoJaSorteado(btnAdicionar);
  preencherSorteioExistente();
}

btnAdicionar.addEventListener("click", adicionarJogador);
document.querySelector(".btn-voltar")?.addEventListener("click", () => window.location.href = "home.html");
btnSortear.addEventListener("click", sortearTimes);

function atualizarAssinatura() {
  document.getElementById("assinatura").textContent = `${new Date().toLocaleDateString("pt-BR")} - Wallaks Cardoso`;
}

async function extrairMensagemErro(res) {
  try {
    const data = await res.json();
    return data?.mensagem || "Erro inesperado";
  } catch {
    return "Erro inesperado ao processar resposta do servidor";
  }
}

function obterUsuarioLogado() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || payload.user_name;
  } catch {
    return null;
  }
}

async function carregarJogadores() {
  showLoading(true);
  try {
    const res = await fetch(apiUrlJogadores, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(await extrairMensagemErro(res));
    const jogadores = await res.json();
    exibirJogadores(jogadores.filter(j => j.sorteioId == sorteioId));
  } catch (err) {
    showToast(err.message, true);
  } finally {
    showLoading(false);
  }
}

function exibirJogadores(jogadores) {
  const usuarioLogado = obterUsuarioLogado();
  const ul = document.getElementById("listaJogadores");
  ul.innerHTML = jogadores.length ? "" : "<li>Nenhum jogador cadastrado.</li>";

  jogadores.forEach(jogador => {
    const li = document.createElement("li");
    const nomeSpan = document.createElement("span");
    nomeSpan.textContent = jogador.nome;
    if (jogador.goleiro) {
      nomeSpan.textContent += " - Goleiro";
      Object.assign(nomeSpan.style, { color: "green", fontWeight: "bold" });
    }

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir";
    btnExcluir.classList.add("btn-excluir");

    const podeExcluir = !sorteioJaFeito && jogador.cadastradoPor === usuarioLogado;
    if (podeExcluir) {
      btnExcluir.onclick = () => deletarJogador(jogador.id);
    } else {
      Object.assign(btnExcluir, { disabled: true, style: { opacity: "0.6", cursor: "not-allowed" } });
    }

    li.append(nomeSpan, btnExcluir);
    ul.appendChild(li);
  });
}

async function verificarPermissaoSorteio() {
  const usuarioLogado = obterUsuarioLogado();
  if (!usuarioLogado) return;
  try {
    const res = await fetch(`${apiUrlSorteio}/${sorteioId}`, { headers: getAuthHeaders() });
    if (!res.ok) return;
    const sorteio = await res.json();
    if (sorteio.cadastradoPor !== usuarioLogado) desabilitarAcaoSemPermissao(btnSortear);
  } catch (err) {
    console.error("Erro ao verificar permissão do sorteio:", err);
  }
}

async function adicionarJogador() {
  const nome = document.getElementById("nome").value.trim();
  if (!nome) return showToast("Informe o nome do jogador.", true);

  const payload = {
    nome,
    goleiro: goleiroAtivo,
    data: new Date().toISOString().split("T")[0],
    sorteioId: parseInt(sorteioId)
  };

  showLoading(true);
  try {
    const res = await fetch(apiUrlJogadores, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(await extrairMensagemErro(res));

    document.getElementById("nome").value = "";
    goleiroAtivo = false;
    btnGoleiro.classList.remove("ativo");

    showToast("Jogador adicionado com sucesso.");
    carregarJogadores();
  } catch (err) {
    showToast(err.message, true);
  } finally {
    showLoading(false);
  }
}

async function deletarJogador(id) {
  if (!confirm("Tem certeza que deseja excluir este jogador?")) return;
  showLoading(true);
  try {
    const res = await fetch(`${apiUrlJogadores}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    if (!res.ok) throw new Error(await extrairMensagemErro(res));
    showToast("Jogador excluído.");
    carregarJogadores();
  } catch (err) {
    showToast(err.message, true);
  } finally {
    showLoading(false);
  }
}

async function sortearTimes() {
  if (sorteioJaFeito) return showToast("Este sorteio já foi realizado.", true);
  showLoading(true);
  try {
    const res = await fetch(`${apiUrlSorteio}/sortear/${sorteioId}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(await extrairMensagemErro(res));
    const resultado = await res.json();
    ["timeAzul", "timeVermelho", "reservas"].forEach(time => exibirTimes(time, resultado[time]));
    desabilitarAcaoJaSorteado(btnSortear);
    desabilitarAcaoJaSorteado(btnAdicionar);
    desabilitarTodosExcluir();
    sorteioJaFeito = true;
  } catch (err) {
    showToast(err.message, true);
  } finally {
    showLoading(false);
  }
}

function exibirTimes(elementId, jogadores) {
  const ul = document.getElementById(elementId);
  ul.innerHTML = jogadores.length ? "" : "<li>Nenhum jogador.</li>";

  jogadores.forEach(jogador => {
    const li = document.createElement("li");
    li.textContent = jogador.nome;
    if (jogador.goleiro) {
      li.textContent += " - Goleiro";
      Object.assign(li.style, { color: "green", fontWeight: "bold" });
    }
    ul.appendChild(li);
  });
}

async function preencherSorteioExistente() {
  try {
    const res = await fetch(`${apiUrlSorteio}/resultado/${sorteioId}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(await extrairMensagemErro(res));
    const resultado = await res.json();
    ["timeAzul", "timeVermelho", "reservas"].forEach(time => exibirTimes(time, resultado[time]));
  } catch (err) {
    showToast(err.message, true);
  }
}

function desabilitarAcaoJaSorteado(botao) {
  botao.disabled = true;
  botao.textContent = "Já sorteado";
  botao.style.opacity = "0.6";
  botao.style.cursor = "not-allowed";
}

function desabilitarAcaoSemPermissao(botao) {
  botao.disabled = true;
  botao.textContent = "Sortear";
  botao.style.opacity = "0.6";
  botao.style.cursor = "not-allowed";
}

function desabilitarTodosExcluir() {
  document.querySelectorAll(".btn-excluir").forEach(btn => desabilitarAcaoJaSorteado(btn));
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".titulo-expandivel").forEach(titulo => {
    titulo.addEventListener("click", () => {
      const targetId = titulo.dataset.target;
      const lista = document.getElementById(targetId);
      if (lista) {
        lista.classList.toggle("hidden");
        titulo.classList.toggle("aberto");
      }
    });
  });
});
