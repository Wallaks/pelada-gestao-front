let jogadores = [];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("cadastro-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const goleiro = document.getElementById("goleiro").value === "true";

    if (!nome) {
      alert("Nome não pode estar vazio.");
      return;
    }

    jogadores.push({ nome, goleiro });
    atualizarTabela();
    this.reset();
  });

  document.getElementById("enviar").addEventListener("click", async () => {
    const dataInput = document.getElementById("data").value;

    if (!dataInput) {
      alert("Preencha a data.");
      return;
    }

    if (jogadores.length < 16) {
      alert("Adicione pelo menos 16 jogadores.");
      return;
    }

    const body = { data: dataInput, jogadores };

    try {
      const response = await fetch("https://pelada-gestao.onrender.com/api/sorteios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        alert("Sorteio enviado com sucesso!");
        jogadores = [];
        atualizarTabela();
        carregarSorteiosSalvos();
      } else {
        const errorText = await response.text();
        alert("Erro ao enviar dados:\n" + errorText);
      }
    } catch (err) {
      alert("Erro na requisição: " + err.message);
    }
  });

  document.getElementById("btn-sorteios").addEventListener("click", carregarSorteiosSalvos);
});

function atualizarTabela() {
  const tbody = document.querySelector("#tabela-jogadores tbody");
  tbody.innerHTML = "";

  jogadores.forEach((jogador, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${jogador.nome}</td>
      <td>${jogador.goleiro ? "Sim" : "Não"}</td>
      <td><button class="excluir" onclick="removerJogador(${index})">Excluir</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function removerJogador(index) {
  jogadores.splice(index, 1);
  atualizarTabela();
}

async function carregarSorteiosSalvos() {
  try {
    const response = await fetch("https://pelada-gestao.onrender.com/api/sorteios");
    if (!response.ok) throw new Error("Erro ao buscar sorteios");

    const sorteios = await response.json();
    exibirSorteiosNaTela(sorteios);
  } catch (err) {
    console.error("Erro ao carregar sorteios:", err);
  }
}

function exibirSorteiosNaTela(sorteios) {
  const tabela = document.querySelector("#sorteios-salvos tbody");
  tabela.innerHTML = "";

  sorteios.forEach(sorteio => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${new Date(sorteio.data).toLocaleDateString("pt-BR")}</td>
      <td>${sorteio.jogadores.length}</td>
    `;
    tabela.appendChild(linha);
  });
}
