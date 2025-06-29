const BASE_URL = (window.location.hostname.includes('localhost') || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:8080/api'
  : 'https://pelada-gestao.onrender.com/api';

const apiUrlSorteios = `${BASE_URL}/sorteios`;

document.addEventListener("DOMContentLoaded", () => {
  atualizarAssinatura();
  carregarSorteiosAnteriores();

  document.querySelector(".btn-voltar")?.addEventListener("click", () => {
    window.location.href = "home.html";
  });
});

function atualizarAssinatura() {
  document.getElementById("assinatura").textContent = `${new Date().toLocaleDateString('pt-BR')} - Wallaks Cardoso`;
}

async function carregarSorteiosAnteriores() {
  showLoading(true);
  try {
    const res = await fetch(apiUrlSorteios, {
      headers: getAuthHeaders()
    });

    if (!res.ok) throw new Error("Erro ao buscar sorteios");

    const sorteios = await res.json();
    const sorteiosFechados = sorteios.filter(s => s.sorteado);

    exibirSorteiosAnteriores(sorteiosFechados);
  } catch (err) {
    showToast(err.message, true);
  } finally {
    showLoading(false);
  }
}

function exibirSorteiosAnteriores(sorteios) {
  const ul = document.getElementById("listaSorteiosAnteriores");
  ul.innerHTML = "";

  if (sorteios.length === 0) {
    ul.innerHTML = "<li>Nenhuma lista fechada.</li>";
    return;
  }

  sorteios.forEach(sorteio => {
    const li = document.createElement("li");
    const span = document.createElement("span");

    span.textContent = `${sorteio.nome} - ${new Date(sorteio.data).toLocaleDateString("pt-BR")}`;
    span.style.cursor = "pointer";

    span.onclick = () => {
      window.location.href = `cadastroJogador.html?sorteioId=${sorteio.id}&nome=${encodeURIComponent(sorteio.nome)}&sorteado=true`;
    };

    li.appendChild(span);
    ul.appendChild(li);
  });
}
