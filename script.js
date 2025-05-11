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
  alert(`Jogador "${nome}" adicionado! Total: ${jogadores.length}`);
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

  const body = {
    data: dataInput, 
    jogadores
  };

  try {
    const response = await fetch("https://pelada-gestao.onrender.com/api/sorteios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      alert("Sorteio enviado com sucesso!");
      jogadores = [];
    } else {
      const errorText = await response.text();
      alert("Erro ao enviar dados:\n" + errorText);
    }
  } catch (err) {
    alert("Erro na requisição: " + err.message);
  }
});
