// DealSleuth front end: renders the deal board, and wires up search,
// category, store and discount filters plus sorting. No network calls:
// the deals come from deals.js, and every store link is a plain <a>.

import { DEALS, CHECKED_LABEL } from "./deals.js";
import { money, discountPercent, saving, signalLabel, signalNote } from "./format.js";

// Where each store's product search lives, so a deal's store link opens
// that store's search for the exact product.
const STORE_SEARCH = {
  Amazon: "https://www.amazon.com/s?k=",
  "Best Buy": "https://www.bestbuy.com/site/searchpage.jsp?st=",
  Walmart: "https://www.walmart.com/search?q=",
  HP: "https://www.hp.com/us-en/shop/sitesearch?keyword=",
};

function storeLink(deal) {
  if (deal.direct) return deal.direct;
  const base = STORE_SEARCH[deal.store] || "";
  return base + encodeURIComponent(deal.q || deal.name);
}

function signalClass(signal) {
  return signal === "new-low" ? "sig-low" : signal === "strong" ? "sig-strong" : "sig-routine";
}

// --- state ---------------------------------------------------------------

const state = {
  query: "",
  category: "All",
  store: "All",
  minDiscount: 0,
  sort: "best",
};

// --- filtering and sorting ----------------------------------------------

function visibleDeals() {
  const q = state.query.trim().toLowerCase();
  let list = DEALS.filter((d) => {
    if (state.category !== "All" && d.category !== state.category) return false;
    if (state.store !== "All" && d.store !== state.store) return false;
    if (discountPercent(d.sale, d.usual) < state.minDiscount) return false;
    if (q && !(d.name + " " + d.store + " " + d.category).toLowerCase().includes(q)) return false;
    return true;
  });
  const rank = { "new-low": 0, strong: 1, routine: 2 };
  const by = {
    best: (a, b) =>
      rank[a.signal] - rank[b.signal] ||
      discountPercent(b.sale, b.usual) - discountPercent(a.sale, a.usual),
    discount: (a, b) => discountPercent(b.sale, b.usual) - discountPercent(a.sale, a.usual),
    saving: (a, b) => saving(b.sale, b.usual) - saving(a.sale, a.usual),
    price: (a, b) => a.sale - b.sale,
    newest: (a, b) => rank[a.signal] - rank[b.signal],
  };
  return list.sort(by[state.sort] || by.best);
}

// --- rendering -----------------------------------------------------------

const grid = document.getElementById("deal-grid");
const countLine = document.getElementById("result-count");

function cardHtml(deal) {
  const pct = discountPercent(deal.sale, deal.usual);
  const save = saving(deal.sale, deal.usual);
  return `
  <article class="card" data-id="${deal.id}">
    <div class="card-top">
      <span class="badge ${signalClass(deal.signal)}">${signalLabel(deal.signal)}</span>
      <span class="store">${deal.store}</span>
    </div>
    <h3 class="name">${deal.name}</h3>
    <p class="cat">${deal.category}</p>
    <p class="prices">
      <span class="sale">${money(deal.sale)}</span>
      <span class="usual">${money(deal.usual)}</span>
      <span class="pct">&minus;${pct}%</span>
    </p>
    <p class="save">You save ${money(save)}</p>
    <p class="evidence">${deal.evidence}</p>
    <p class="checked">Checked ${CHECKED_LABEL} &middot; Source: ${deal.source}</p>
    <a class="store-link" href="${storeLink(deal)}" target="_blank" rel="noopener">View at ${deal.store} &rarr;</a>
  </article>`;
}

function renderStats() {
  const lows = DEALS.filter((d) => d.signal === "new-low").length;
  const avg = Math.round(
    DEALS.reduce((sum, d) => sum + discountPercent(d.sale, d.usual), 0) / DEALS.length,
  );
  const stores = new Set(DEALS.map((d) => d.store)).size;
  const cats = new Set(DEALS.map((d) => d.category)).size;
  document.getElementById("stat-deals").textContent = DEALS.length;
  document.getElementById("stat-stores").textContent = stores;
  document.getElementById("stat-cats").textContent = cats;
  document.getElementById("stat-avg").textContent = avg + "%";
  document.getElementById("stat-lows").textContent = lows;
}

function render() {
  const list = visibleDeals();
  grid.innerHTML = list.map(cardHtml).join("") ||
    `<p class="empty">No deals match those filters. Try clearing the search or lowering the discount.</p>`;
  const shown = list.length;
  countLine.textContent =
    shown === DEALS.length
      ? `Showing all ${shown} deals, best first`
      : `Showing ${shown} of ${DEALS.length} deals`;
}

// --- filter controls -----------------------------------------------------

function fillSelect(select, values) {
  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  }
}

function buildFilters() {
  const categories = ["All", ...new Set(DEALS.map((d) => d.category))];
  const stores = ["All", ...new Set(DEALS.map((d) => d.store))];
  fillSelect(document.getElementById("filter-category"), categories);
  fillSelect(document.getElementById("filter-store"), stores);

  document.getElementById("search").addEventListener("input", (event) => {
    state.query = event.target.value;
    render();
  });
  document.getElementById("filter-category").addEventListener("change", (event) => {
    state.category = event.target.value;
    render();
  });
  document.getElementById("filter-store").addEventListener("change", (event) => {
    state.store = event.target.value;
    render();
  });
  document.getElementById("filter-discount").addEventListener("change", (event) => {
    state.minDiscount = Number(event.target.value);
    render();
  });
  document.getElementById("sort").addEventListener("change", (event) => {
    state.sort = event.target.value;
    render();
  });
  document.getElementById("clear-filters").addEventListener("click", () => {
    state.query = "";
    state.category = "All";
    state.store = "All";
    state.minDiscount = 0;
    state.sort = "best";
    document.getElementById("search").value = "";
    document.getElementById("filter-category").value = "All";
    document.getElementById("filter-store").value = "All";
    document.getElementById("filter-discount").value = "0";
    document.getElementById("sort").value = "best";
    render();
  });
}

renderStats();
buildFilters();
render();
