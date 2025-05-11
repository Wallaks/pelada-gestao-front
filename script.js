let jogadores = [];

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
    } else {
      const errorText = await response.text();
      alert("Erro ao enviar dados:\n" + errorText);
    }
  } catch (err) {
    alert("Erro na requisição: " + err.message);
  }
});
