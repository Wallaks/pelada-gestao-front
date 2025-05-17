const apiUrl = "https://pelada-gestao.onrender.com/api/jogadores";

document.addEventListener("DOMContentLoaded", () => {
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
    const payload = { nome, goleiro, data };

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
    window.location.href = "index.html";
  });
});

function atualizarAssinatura() {
  const hoje = new Date();
  const formatado = hoje.toLocaleDateString('pt-BR');
  document.getElementById("assinatura").textContent = `${formatado} - Wallaks Cardoso`;
}

async function carregarJogadores() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Erro ao buscar jogadores");

    const jogadores = await response.json();
    exibirJogadores(jogadores);
  } catch (err) {
    console.error(err);
  }
}

function exibirJogadores(jogadores) {
  const ul = document.getElementById("listaJogadores");
  ul.innerHTML = "";

  jogadores.forEach(jogador => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${jogador.nome} - ${jogador.goleiro ? "Goleiro" : "Linha"} - ${new Date(jogador.data).toLocaleDateString("pt-BR")}
      <button class="btn-excluir" onclick="deletarJogador(${jogador.id})">???</button>
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
