document.addEventListener("DOMContentLoaded", () => {
  atualizarAssinatura();
  carregarSorteios();

  document.getElementById("btnCriarSorteio").addEventListener("click", async () => {
    const nome = document.getElementById("nomeSorteio").value.trim();
    const qtd = parseInt(document.getElementById("qtdPorEquipe").value);
    const data = new Date().toISOString().split("T")[0];

    if (!nome || isNaN(qtd) || qtd <= 0) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    const payload = { nome, jogadoresPorEquipe: qtd, data };

    try {
      const response = await fetch("https://pelada-gestao.onrender.com/api/sorteios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Erro ao criar sorteio");

      document.getElementById("nomeSorteio").value = "";
      document.getElementById("qtdPorEquipe").value = "";
      carregarSorteios();
    } catch (err) {
      alert("Erro: " + err.message);
    }
  });

  document.getElementById("btnVoltarConfig").addEventListener("click", () => {
    window.location.href = "index.html";
  });
});

function atualizarAssinatura() {
  const hoje = new Date();
  const formatado = hoje.toLocaleDateString('pt-BR');
  document.getElementById("assinatura").textContent = `${formatado} - Wallaks Cardoso`;
}

async function carregarSorteios() {
  try {
    const response = await fetch("https://pelada-gestao.onrender.com/api/sorteios");
    if (!response.ok) throw new Error("Erro ao buscar sorteios");

    const sorteios = await response.json();
    exibirSorteios(sorteios);
  } catch (err) {
    console.error(err);
  }
}

function exibirSorteios(sorteios) {
  const ul = document.getElementById("listaSorteios");
  ul.innerHTML = "";

  sorteios.forEach(sorteio => {
    const li = document.createElement("li");

    const content = document.createElement("div");
    content.style.display = "flex";
    content.style.justifyContent = "space-between";
    content.style.alignItems = "center";
    content.style.width = "100%";

    const span = document.createElement("span");
    span.style.cursor = "pointer";
    span.textContent = `${sorteio.nome || "Sem nome"} - ${new Date(sorteio.data).toLocaleDateString("pt-BR")}`;
    span.onclick = () => {
      window.location.href = `cadastro.html?sorteioId=${sorteio.id}`;
    };

    const btn = document.createElement("button");
    btn.textContent = "🗑️";
    btn.classList.add("btn-excluir");
    btn.onclick = () => deletarSorteio(sorteio.id);

    content.appendChild(span);
    content.appendChild(btn);
    li.appendChild(content);
    ul.appendChild(li);
  });
}

async function deletarSorteio(id) {
  if (!confirm("Tem certeza que deseja excluir este sorteio?")) return;

  try {
    const response = await fetch(`https://pelada-gestao.onrender.com/api/sorteios/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) throw new Error("Erro ao excluir sorteio");

    carregarSorteios();
  } catch (err) {
    alert("Erro: " + err.message);
  }
}
