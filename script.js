
let jogadores = [];

document.getElementById("cadastro-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const nome = document.getElementById("nome").value;
  const goleiro = document.getElementById("goleiro").value === "true";

  jogadores.push({ nome, goleiro });
  alert("Jogador adicionado!");
  this.reset();
});

document.getElementById("enviar").addEventListener("click", async () => {
  const data = document.getElementById("data").value;
  if (!data || jogadores.length === 0) {
    alert("Preencha a data e adicione pelo menos um jogador.");
    return;
  }

  const body = { data, jogadores };

  const response = await fetch("https://pelada-gestao.onrender.com/api/sorteios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (response.ok) {
    alert("Sorteio enviado com sucesso!");
    jogadores = [];
  } else {
    alert("Erro ao enviar dados.");
  }
});
