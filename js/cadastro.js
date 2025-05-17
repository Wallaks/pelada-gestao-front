const apiUrl = "https://pelada-gestao.onrender.com/api/jogadores";

// Recupera o ID do sorteio da URL
const urlParams = new URLSearchParams(window.location.search);
const sorteioId = urlParams.get("sorteioId");

document.addEventListener("DOMContentLoaded", () => {
  if (!sorteioId) {
    alert("ID do sorteio não informado.");
    window.location.href = "../index.html";
    return;
  }

  atualizarAssinatura();
  carregarJogadores();

  document.getElementById("btnAdicionar").addEventListener("click", async () => {
    const nome = document.getElementById("nome").value.trim();
    const goleiro = document.getElementById("goleiro").checked;

    if (!nome) {
      alert("Informe o nome do jogador.");
      return;
    }

    const data = new Date().toISOString().split("T")[0];

    const payload = {
      nome,
      goleiro,
      data,
      sorteio: { id: parseInt(sorteioId) }
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Erro ao adicionar jogador");

      document.getElementById("nome").value = "";
      document.getElementById("goleiro").checked = false;
      carregarJogadores();
    } catch (err) {
      alert("Erro: " + err.message);
    }
  });

  document.getElementById("btnVoltar").addEventListener("click", () => {
    window.location.href = "../index.html";
  });
});

function atualizarAssinatura() {
  const hoje = new Date();
  const formatado = hoje.toLocaleDateString("pt-BR");
  document.getElementById("assinatura").textContent = `${formatado} - Wallaks Cardoso`;
}

async function carregarJogadores() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Erro ao buscar jogadores");

    const jogadores = await response.json();
    const jogadoresDoSorteio = jogadores.filter(j => j.sorteioId == sorteioId); // aqui estava errado
    exibirJogadores(jogadoresDoSorteio);
  } catch (err) {
    console.error("Erro ao carregar jogadores:", err);
  }
}

function exibirJogadores(jogadores) {
  const ul = document.getElementById("listaJogadores");
  ul.innerHTML = "";

  if (jogadores.length === 0) {
    ul.innerHTML = "<li>Nenhum jogador cadastrado.</li>";
    return;
  }

  jogadores.forEach(jogador => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${jogador.nome} - ${jogador.goleiro ? "Goleiro" : "Linha"} - ${new Date(jogador.data).toLocaleDateString("pt-BR")}
      <button class="btn-excluir" onclick="deletarJogador(${jogador.id})">🗑️</button>
    `;
    ul.appendChild(li);
  });
}

async function deletarJogador(id) {
  if (!confirm("Tem certeza que deseja excluir este jogador?")) return;

  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) throw new Error("Erro ao excluir jogador");

    carregarJogadores();
  } catch (err) {
    alert("Erro: " + err.message);
  }
}
