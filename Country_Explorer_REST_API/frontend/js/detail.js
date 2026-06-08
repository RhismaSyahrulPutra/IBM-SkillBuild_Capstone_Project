/* =========================
   BACK BUTTON HANDLER
========================= */

function backButtonHandler() {
  window.location.href = "index.html";
}

/* =========================
   EVENT LISTENERS
========================= */

document.getElementById("backBtn").addEventListener("click", backButtonHandler);

/* =========================
   DOM CONTENT LOADED
========================= */

document.addEventListener("DOMContentLoaded", () => {
  /* EXTRACT QUERY PARAMS */

  const params = new URLSearchParams(window.location.search);

  const name = decodeURIComponent(params.get("name") || "");
  const flag = decodeURIComponent(params.get("flag") || "");
  const population = params.get("population") || "";
  const region = params.get("region") || "";
  const subRegion = decodeURIComponent(params.get("subRegion") || "");
  const capital = decodeURIComponent(params.get("capital") || "");
  const currencies = decodeURIComponent(params.get("currencies") || "");
  const languages = decodeURIComponent(params.get("languages") || "");

  /* POPULATE PAGE */

  document.getElementById("detail-name").textContent = name;
  document.getElementById("detail-flag").src = flag;
  document.getElementById("detail-flag").alt = name;
  document.getElementById("detail-population").textContent =
    Number(population).toLocaleString();
  document.getElementById("detail-region").textContent = region;
  document.getElementById("detail-subregion").textContent = subRegion || "N/A";
  document.getElementById("detail-capital").textContent = capital || "N/A";
  document.getElementById("detail-currencies").textContent =
    currencies || "N/A";
  document.getElementById("detail-languages").textContent = languages || "N/A";
});
