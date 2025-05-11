const BASE_URL = (window.location.hostname.includes('localhost') || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:8080/api'
  : 'https://pelada-gestao.onrender.com/api';

const apiUrlSorteios = `${BASE_URL}/sorteios`;

document.addEventListener("DOMContentLoaded", () => {
  atualizarAssinatura();
  carregarSorteios();

  document.getElementById("btnCriarSorteio").addEventListener("click", criarSorteio);
  document.getElementById("btnVoltarConfig").addEventListener("click", () => window.location.href = "../index.html");
});

function atualizarAssinatura() {
  document.getElementById("assinatura").textContent = `${new Date().toLocaleDateString('pt-BR')} - Wallaks Cardoso`;
}

async function carregarSorteios() {
  showLoading(true);
  try {
    const res = await fetch(apiUrlSorteios);
    if (!res.ok) throw new Error("Erro ao buscar sorteios");
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
  const ul = document.getElementById("listaSorteios");
  ul.innerHTML = "";

  sorteios.forEach(sorteio => {
    const li = document.createElement("li");
    const content = document.createElement("div");
    Object.assign(content.style, { display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" });

    const span = document.createElement("span");
    span.textContent = `${sorteio.nome || "Sem nome"} - ${new Date(sorteio.data).toLocaleDateString("pt-BR")}`;
    span.style.cursor = "pointer";
    span.onclick = () => {
      window.location.href = `cadastro.html?sorteioId=${sorteio.id}&nome=${encodeURIComponent(sorteio.nome)}&sorteado=${sorteio.sorteado ? 'true' : 'false'}`;
    };

    const btn = document.createElement("button");
    btn.textContent = "Excluir";
    btn.classList.add("btn-excluir");
    if (sorteio.sorteado) {
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

async function criarSorteio() {
  const nome = document.getElementById("nomeSorteio").value.trim();
  const qtd = parseInt(document.getElementById("qtdPorEquipe").value);
  const data = new Date().toISOString().split("T")[0];

  if (!nome || isNaN(qtd) || qtd <= 0) return showToast("Preencha todos os campos corretamente.", true);
  if (nome.length > 20) return showToast("O nome do sorteio deve ter no máximo 20 caracteres.", true);

  const payload = { nome, jogadoresPorEquipe: qtd, data };

  showLoading(true);
  try {
    const res = await fetch(apiUrlSorteios, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error("Erro ao criar sorteio");
    showToast("Sorteio criado com sucesso.");
    document.getElementById("nomeSorteio").value = "";
    document.getElementById("qtdPorEquipe").value = "";
    carregarSorteios();
  } catch (err) {
    showToast(err.message, true);
  } finally {
    showLoading(false);
  }
}

async function deletarSorteio(id) {
  if (!confirm("Tem certeza que deseja excluir este sorteio?")) return;

  showLoading(true);
  try {
    const res = await fetch(`${apiUrlSorteios}/${id}`, { method: "DELETE" });

    if (res.status === 409) {
      const errorMessage = await res.text();
      showToast(errorMessage, true);
      return;
    }

    if (!res.ok) throw new Error("Erro ao excluir sorteio");

    showToast("Sorteio excluído.");
    carregarSorteios();
  } catch (err) {
    showToast(err.message, true);
  } finally {
    showLoading(false);
  }
}

function getLocalDateISO() {
  const tzOffset = new Date().getTimezoneOffset() * 60000;
  return new Date(Date.now() - tzOffset).toISOString().slice(0, 10);
}
