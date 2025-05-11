function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast" + (isError ? " error" : "");
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 3000);
}

function showLoading(show) {
  const loading = document.getElementById("loading");
  loading.classList.toggle("hidden", !show);
}
