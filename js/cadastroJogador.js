const BASE_URL = (window.location.hostname.includes('localhost') || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:8080/api'
  : 'https://pelada-gestao.onrender.com/api';

const apiUrlJogadores = `${BASE_URL}/jogadores`;
const apiUrlSorteio = `${BASE_URL}/sorteios`;

const urlParams = new URLSearchParams(window.location.search);
const sorteioId = urlParams.get("sorteioId");
const nomeSorteio = urlParams.get("nome");
let sorteioJaFeito = urlParams.get("sorteado") === 'true';

document.addEventListener("DOMContentLoaded", () => {
  if (!sorteioId) {
    showToast("ID do sorteio não informado.", true);
    window.location.href = "home.html";
    return;
  }

  const titulo = document.getElementById("nomeSorteio");
  if (titulo) titulo.textContent = `Sorteio: ${decodeURIComponent(nomeSorteio)}`;

  atualizarAssinatura();
  carregarJogadores();

  const btnSortear = document.getElementById("btnSortear");
  const btnAdicionar = document.getElementById("btnAdicionar");

  if (sorteioJaFeito) {
    desabilitarAcao(btnSortear);
    desabilitarAcao(btnAdicionar);
    preencherSorteioExistente();
  }

  btnAdicionar.addEventListener("click", adicionarJogador);
  document.querySelector(".btn-voltar")?.addEventListener("click", () => {
    window.location.href = "home.html";
  });
  btnSortear.addEventListener("click", sortearTimes);
});

function atualizarAssinatura() {
  document.getElementById("assinatura").textContent = `${new Date().toLocaleDateString("pt-BR")} - Wallaks Cardoso`;
}

async function carregarJogadores() {
  showLoading(true);
  try {
    const res = await fetch(apiUrlJogadores, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Erro ao buscar jogadores");
    const jogadores = await res.json();
    exibirJogadores(jogadores.filter(j => j.sorteioId == sorteioId));
  } catch (err) {
    showToast(err.message, true);
  } finally {
    showLoading(false);
  }
}

function exibirJogadores(jogadores) {
  const ul = document.getElementById("listaJogadores");
  ul.innerHTML = jogadores.length ? "" : "<li>Nenhum jogador cadastrado.</li>";

  jogadores.forEach(jogador => {
    const li = document.createElement("li");
    const nomeSpan = document.createElement("span");
    nomeSpan.textContent = `${jogador.nome} - ${jogador.goleiro ? "Goleiro" : "Linha"}`;
    if (jogador.goleiro) Object.assign(nomeSpan.style, { color: "green", fontWeight: "bold" });

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir";
    btnExcluir.classList.add("btn-excluir");

    if (sorteioJaFeito) {
      desabilitarAcao(btnExcluir);
    } else {
      btnExcluir.onclick = () => deletarJogador(jogador.id);
    }

    li.append(nomeSpan, btnExcluir);
    ul.appendChild(li);
  });
}

async function adicionarJogador() {
  const nome = document.getElementById("nome").value.trim();
  const goleiro = document.getElementById("goleiro").checked;

  if (!nome) return showToast("Informe o nome do jogador.", true);

  const payload = { nome, goleiro, data: new Date().toISOString().split("T")[0], sorteioId: parseInt(sorteioId) };

  showLoading(true);
  try {
    const res = await fetch(apiUrlJogadores, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Erro ao adicionar jogador");
    document.getElementById("nome").value = "";
    document.getElementById("goleiro").checked = false;
    showToast("Jogador adicionado com sucesso.");
    //carregarJogadores();
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
    if (!res.ok) throw new Error("Erro ao excluir jogador");
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
    const res = await fetch(`${apiUrlSorteio}/sortear/${sorteioId}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Erro ao sortear times");
    const resultado = await res.json();

    ["timeAzul", "timeVermelho", "reservas"].forEach(time => exibirTimes(time, resultado[time]));

    const btnSortear = document.getElementById("btnSortear");
    const btnAdicionar = document.getElementById("btnAdicionar");

    desabilitarAcao(btnSortear);
    desabilitarAcao(btnAdicionar);

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
    li.textContent = `${jogador.nome} - ${jogador.goleiro ? "Goleiro" : "Linha"}`;
    if (jogador.goleiro) Object.assign(li.style, { color: "green", fontWeight: "bold" });
    ul.appendChild(li);
  });
}

async function preencherSorteioExistente() {
  try {
    const res = await fetch(`${apiUrlSorteio}/resultado/${sorteioId}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Erro ao obter sorteio realizado");
    const resultado = await res.json();
    ["timeAzul", "timeVermelho", "reservas"].forEach(time => exibirTimes(time, resultado[time]));
  } catch (err) {
    showToast(err.message, true);
  }
}

function desabilitarAcao(botao) {
  botao.disabled = true;
  botao.textContent = "Já sorteado";
  botao.style.opacity = "0.6";
  botao.style.cursor = "not-allowed";
}

function desabilitarTodosExcluir() {
  document.querySelectorAll(".btn-excluir").forEach(btn => {
    desabilitarAcao(btn);
  });
}
