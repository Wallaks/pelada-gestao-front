
document.addEventListener("DOMContentLoaded", () => {
  const hoje = new Date();
  const formatado = hoje.toLocaleDateString('pt-BR');
  document.getElementById("assinatura").textContent = `${formatado} - Wallaks Cardoso`;

  document.getElementById("btnNovoSorteio").addEventListener("click", () => {
    window.location.href = "configuracao.html";
  });

  document.getElementById("btnSorteiosAnteriores").addEventListener("click", () => {
    alert("Funcionalidade em construção");
  });
});
