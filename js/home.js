document.addEventListener("DOMContentLoaded", () => {
  const hoje = new Date();
  const formatado = hoje.toLocaleDateString('pt-BR');
  document.getElementById("assinatura").textContent = `${formatado} - Wallaks Cardoso`;

  document.getElementById("btnNovoSorteio").addEventListener("click", () => {
    window.location.href = "cadastroSorteio.html";
  });

  document.getElementById("btnSorteiosEmAndamento").addEventListener("click", () => {
    window.location.href = "sorteiosEmAndamento.html";
  });

  document.getElementById("btnSorteiosAnteriores").addEventListener("click", () => {
    window.location.href = "sorteiosAnteriores.html";
  });

  document.querySelector(".btn-voltar")?.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
});

