console.log("Locus script loaded");

// ===== 0. Уникальный идентификатор клиента =====
let myClientId = localStorage.getItem("my_client_id");
if (!myClientId) {
  myClientId = "client-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
  localStorage.setItem("my_client_id", myClientId);
}

// ===== 1. Тёмная тема =====
const themeBtn = document.querySelector("#theme");

function applyTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  document.documentElement.classList.toggle("dark", isDark);
  if (themeBtn) {
    const iconSpan = themeBtn.querySelector(".material-symbols-outlined");
    if (iconSpan) {
      iconSpan.textContent = isDark ? "light_mode" : "dark_mode";
    } else {
      themeBtn.textContent = isDark ? "☀️" : "🌙";
    }
  }
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

if (themeBtn) {
  applyTheme(localStorage.getItem("theme") === "dark");
  themeBtn.addEventListener("click", () => {
    applyTheme(!document.documentElement.classList.contains("dark"));
  });
} else {
  // Применить тему без кнопки (страница без кнопки, но тема нужна)
  applyTheme(localStorage.getItem("theme") === "dark");
}


// ===== 2. Показать / скрыть телефон =====
const showBtn = document.querySelector("#show-phone");
const phoneEl = document.querySelector("#phone");
if (showBtn && phoneEl) {
  showBtn.addEventListener("click", () => {
    phoneEl.hidden = !phoneEl.hidden;
    showBtn.textContent = phoneEl.hidden ? "📞 Показать телефон" : "📞 Скрыть телефон";
  });
}

// ===== 3. Калькулятор цены за м² =====
const priceEl = document.querySelector("#calc-price");
const areaEl  = document.querySelector("#calc-area");
const resultEl = document.querySelector("#calc-result");

function recalc() {
  if (!priceEl || !areaEl || !resultEl) return;
  const price = Number(priceEl.value);
  const area  = Number(areaEl.value);
  if (!price || !area || area <= 0) { resultEl.textContent = "—"; return; }
  resultEl.textContent = Math.round(price / area).toLocaleString("ru-RU") + " у.е./м²";
}
if (priceEl && areaEl) {
  priceEl.addEventListener("input", recalc);
  areaEl.addEventListener("input", recalc);
  recalc();
}

// ===== 4. Валидация формы контактов =====
const contactForm = document.querySelector("#contact-form");
const nameInput   = document.querySelector("#name");
const phoneInput  = document.querySelector("#phone-input");
const emailInput  = document.querySelector("#email");
const errorBox    = document.querySelector("#form-error");

if (contactForm && nameInput && phoneInput && errorBox) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    if (name.length < 2) {
      errorBox.textContent = "Введите имя — минимум 2 буквы";
      nameInput.focus(); return;
    }

    const digits = phoneInput.value.replace(/\D/g, "");
    if (digits.length !== 12 || !digits.startsWith("998")) {
      errorBox.textContent = "Телефон должен быть в формате +998 90 123 45 67";
      phoneInput.focus(); return;
    }

    if (emailInput) {
      const email = emailInput.value.trim();
      if (email.length > 0) {
        const atPos = email.indexOf("@");
        const dotPos = email.lastIndexOf(".");
        if (!email.includes("@") || atPos <= 0 || dotPos <= atPos + 1 || dotPos === email.length - 1) {
          errorBox.textContent = "Некорректный email";
          emailInput.focus(); return;
        }
      }
    }

    errorBox.textContent = "";
    alert(`Спасибо, ${name}! Ваша заявка принята. Менеджер свяжется с вами.`);
    contactForm.reset();
  });
}

// ===== 5. Каталог объявлений =====
let allListings    = [];
let activeDistrict = "all";
let activeRooms    = "all";
let activeMaxPrice = null;
let searchQuery    = "";
let sortMode       = "";

const filterButtons = document.querySelectorAll(".filters button");
const countEl       = document.querySelector("#listings-count");
const listingsGrid  = document.querySelector("#listingsGrid");

// Резервный список на случай сетевых сбоев
const fallbackListings = [
  { id: 1, title: "2-комн. рядом с метро Чиланзар", price: 48000, district: "Чиланзар", address: "ул. Катартал, д. 12", rooms: 2, imageUrl: "images/room.jpg", ownerId: "", createdAt: "2026-09-17T06:22:55.7905085" },
  { id: 2, title: "3-комн. с дизайнерским ремонтом", price: 71000, district: "Юнусабад", address: "14-й квартал, д. 5", rooms: 3, imageUrl: "images/kitchen.jpg", ownerId: "", createdAt: "2026-09-17T06:22:55.7905194" },
  { id: 3, title: "1-комн. видовая студия", price: 32000, district: "Мирзо-Улугбек", address: "пр-т Мустакиллик, д. 88", rooms: 1, imageUrl: "images/view.jpg", ownerId: "", createdAt: "2026-09-17T06:22:55.7905195" },
  { id: 4, title: "Элитный пентхаус в центре", price: 150000, district: "Мирабад", address: "ул. Нукусская, 21", rooms: 5, imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80", ownerId: "", createdAt: "2026-09-17T06:23:00.3012716" }
];

async function loadCatalog() {
  try {
    const res = await fetch("/api/listings");
    if (res.ok) {
      allListings = await res.json();
    } else {
      allListings = fallbackListings;
    }
  } catch (err) {
    try {
      const resLocal = await fetch("http://localhost:5000/api/listings");
      if (resLocal.ok) {
        allListings = await resLocal.json();
      } else {
        allListings = fallbackListings;
      }
    } catch {
      allListings = fallbackListings;
    }
  }

  // Применяем фильтры из URL (если пришли с главной страницы или перезагрузили)
  applyUrlFilters();

  renderCatalog();
  renderFeatured();
  updateHeroStats();
}

// Быстрый переход по клику на карточку района
function goToDistrict(name) {
  window.location.href = `catalog.html?district=${encodeURIComponent(name)}`;
}

// Быстрый поиск из панели Hero на главной
function heroQuickSearch() {
  const district = document.getElementById("heroDistrict")?.value || "all";
  const rooms = window.selectedHeroRooms || "all";
  const maxPriceInput = document.getElementById("heroMaxPrice")?.value || "";

  const params = new URLSearchParams();
  if (district !== "all") params.set("district", district);
  if (rooms && rooms !== "all") params.set("rooms", rooms);
  
  const parsedPrice = parseFloat(maxPriceInput);
  if (!isNaN(parsedPrice) && parsedPrice > 0) {
    params.set("maxPrice", parsedPrice);
  }

  window.location.href = `catalog.html?${params.toString()}`;
}

// Чтение параметров URL на странице catalog.html
function applyUrlFilters() {
  const params = new URLSearchParams(window.location.search);
  const districtParam = params.get("district");
  const roomsParam = params.get("rooms");
  const maxPriceParam = params.get("maxPrice");
  const searchParam = params.get("search");

  if (districtParam) {
    activeDistrict = districtParam;
  }
  if (roomsParam) {
    activeRooms = roomsParam;
  }
  if (maxPriceParam) {
    const val = parseFloat(maxPriceParam);
    if (!isNaN(val) && val > 0) {
      activeMaxPrice = val;
    }
  }
  if (searchParam) {
    searchQuery = searchParam.toLowerCase();
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = searchParam;
  }

  const catPriceInput = document.getElementById("catalogMaxPrice");
  if (catPriceInput && activeMaxPrice) {
    catPriceInput.value = activeMaxPrice;
  }
}

function onSearch() {
  searchQuery = (document.getElementById("searchInput")?.value || "").toLowerCase();
  updateUrlParams();
  renderCatalog();
}

function onSortChange() {
  sortMode = document.getElementById("sortSelect")?.value || "";
  renderCatalog();
}

function onCatalogRoomClick(roomsVal) {
  activeRooms = roomsVal;
  updateUrlParams();
  renderCatalog();
}

function onMaxPriceChange() {
  const val = parseFloat(document.getElementById("catalogMaxPrice")?.value);
  activeMaxPrice = (!isNaN(val) && val > 0) ? val : null;
  updateUrlParams();
  renderCatalog();
}

function resetAllFilters() {
  activeDistrict = "all";
  activeRooms = "all";
  activeMaxPrice = null;
  searchQuery = "";
  sortMode = "";

  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.value = "";
  const catPriceInput = document.getElementById("catalogMaxPrice");
  if (catPriceInput) catPriceInput.value = "";
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) sortSelect.value = "";

  updateUrlParams();
  renderCatalog();
}

function updateUrlParams() {
  const params = new URLSearchParams();
  if (activeDistrict !== "all") params.set("district", activeDistrict);
  if (activeRooms !== "all") params.set("rooms", activeRooms);
  if (activeMaxPrice) params.set("maxPrice", activeMaxPrice);
  if (searchQuery) params.set("search", searchQuery);

  const queryStr = params.toString();
  const newUrl = window.location.pathname + (queryStr ? `?${queryStr}` : "");
  if (window.history && window.history.replaceState) {
    window.history.replaceState({}, "", newUrl);
  }
}

function renderCatalog() {
  if (!listingsGrid) return;

  // Фильтрация
  let filtered = allListings;

  // Район
  if (activeDistrict === "mine") {
    filtered = allListings.filter(i => i.ownerId === myClientId);
  } else if (activeDistrict !== "all") {
    filtered = allListings.filter(i => i.district === activeDistrict);
  }

  // Комнатность
  if (activeRooms && activeRooms !== "all") {
    if (activeRooms === "1") {
      filtered = filtered.filter(i => Number(i.rooms) === 1);
    } else if (activeRooms === "2") {
      filtered = filtered.filter(i => Number(i.rooms) === 2);
    } else if (activeRooms === "3") {
      filtered = filtered.filter(i => Number(i.rooms) === 3);
    } else if (activeRooms === "3+") {
      filtered = filtered.filter(i => Number(i.rooms) >= 3);
    } else if (activeRooms === "4" || activeRooms === "4+") {
      filtered = filtered.filter(i => Number(i.rooms) >= 4);
    }
  }

  // Бюджет
  if (activeMaxPrice && activeMaxPrice > 0) {
    filtered = filtered.filter(i => Number(i.price) <= activeMaxPrice);
  }

  // Поиск по тексту
  if (searchQuery) {
    filtered = filtered.filter(i =>
      (i.title && i.title.toLowerCase().includes(searchQuery)) ||
      (i.address && i.address.toLowerCase().includes(searchQuery)) ||
      (i.district && i.district.toLowerCase().includes(searchQuery))
    );
  }

  // Сортировка
  if (sortMode === "price") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortMode === "-price") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  if (countEl) countEl.textContent = `Найдено: ${filtered.length} из ${allListings.length}`;

  // Подсветка активного фильтра районов (Tailwind чипсы)
  filterButtons.forEach(btn => {
    const isMineBtn = btn.dataset.district === "mine";
    if (btn.dataset.district === activeDistrict) {
      btn.className = isMineBtn
        ? "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all bg-amber-500 text-white shadow-sm flex items-center gap-1"
        : "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all bg-primary text-white shadow-sm";
    } else {
      btn.className = isMineBtn
        ? "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 flex items-center gap-1"
        : "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all bg-surface-container hover:bg-surface-variant text-on-surface-variant";
    }
  });

  // Подсветка активного фильтра комнатности в каталоге
  const catalogRoomBtns = document.querySelectorAll(".catalog-room-btn");
  catalogRoomBtns.forEach(btn => {
    const isMatch = btn.dataset.rooms === activeRooms ||
                    (activeRooms === "3+" && btn.dataset.rooms === "3") ||
                    (activeRooms === "4+" && btn.dataset.rooms === "4+");

    if (btn.dataset.rooms === activeRooms) {
      btn.className = "catalog-room-btn px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all bg-primary text-white shadow-xs";
    } else {
      btn.className = "catalog-room-btn px-2.5 sm:px-3 py-1 rounded-lg text-xs font-medium transition-all bg-surface-container hover:bg-surface-variant text-on-surface-variant";
    }
  });

  if (!filtered.length) {
    listingsGrid.innerHTML = `
      <div class="col-span-full text-center py-16 text-on-surface-variant">
        <p class="text-3xl mb-2">🔍</p>
        <p class="font-bold font-display">${activeDistrict === "mine" ? "У вас пока нет опубликованных объявлений." : "Объявлений по заданным критериям не найдено."}</p>
        <p class="text-xs text-outline mt-1">Попробуйте выбрать другой район или <button onclick="resetAllFilters()" class="text-primary underline font-bold cursor-pointer">сбросить фильтры</button></p>
      </div>`;
    return;
  }

  listingsGrid.innerHTML = filtered.map(item => renderCard(item)).join("");
}


function renderCard(item) {
  const photo  = item.imageUrl || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80";
  const isMine = item.ownerId === myClientId;
  const priceUzs = Math.round(item.price * 12750).toLocaleString("ru-RU") + " сум";
  const approxArea = (item.rooms * 26 + 10) + " м²";

  const ownerBanner = isMine ? `
    <div class="bg-amber-500/10 border-b border-amber-500/20 px-3.5 py-2 flex items-center justify-between">
      <span class="inline-flex items-center gap-1 text-xs text-amber-800 font-bold">
        <span>⭐ Ваше объявление</span>
      </span>
      <span class="text-[11px] font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Активно</span>
    </div>
  ` : "";

  const actionButtons = isMine ? `
    <div class="grid grid-cols-2 gap-2 pt-2 border-t border-outline-variant/30">
      <button onclick="event.stopPropagation(); openEditModal(${item.id})" class="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-all active:scale-95">
        <span class="material-symbols-outlined text-sm">edit</span>
        <span>Редактировать</span>
      </button>
      <button onclick="event.stopPropagation(); deleteOwnListing(${item.id})" class="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95">
        <span class="material-symbols-outlined text-sm">delete</span>
        <span>Удалить</span>
      </button>
    </div>
  ` : `
    <div class="pt-2 border-t border-outline-variant/30 flex gap-2">
      <button onclick="event.stopPropagation(); openDetails(${item.id})" class="flex-1 py-2 bg-surface-container hover:bg-surface-variant text-primary rounded-xl font-bold text-xs transition-colors text-center">
        Подробнее
      </button>
      <a href="tel:+998901234567" onclick="event.stopPropagation()" class="p-2 bg-surface-container text-primary rounded-xl hover:bg-surface-variant transition-colors flex items-center justify-center" title="Позвонить">
        <span class="material-symbols-outlined text-base">call</span>
      </a>
    </div>
  `;

  return `
    <article class="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${isMine ? 'owner-card-glow' : ''}">
      <div>
        ${ownerBanner}
        <div class="relative aspect-[16/10] w-full overflow-hidden bg-surface-container cursor-pointer" onclick="openDetails(${item.id})">
          <img class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" src="${photo}" alt="${escapeHtml(item.title)}" onerror="this.src='https://placehold.co/600x400/1e293b/a5b4fc?text=Locus'"/>
          <div class="absolute top-2.5 left-2.5">
            <span class="bg-secondary text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-xs">Продажа</span>
          </div>
          <div class="absolute bottom-2.5 right-2.5 bg-black/70 text-white text-[11px] px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">location_on</span>
            <span>${escapeHtml(item.district)}</span>
          </div>
        </div>
        <div class="p-4 space-y-2">
          <div class="flex items-baseline justify-between">
            <div>
              <span class="text-xl font-extrabold text-primary font-display">${item.price.toLocaleString("ru-RU")} у.е.</span>
              <span class="block text-[11px] text-on-surface-variant font-medium">${priceUzs}</span>
            </div>
            <span class="text-[11px] font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
              ~${Math.round(item.price / (item.rooms * 26 + 10))} $/м²
            </span>
          </div>
          <h3 class="text-sm sm:text-base font-bold text-on-surface font-display truncate" title="${escapeHtml(item.title)}">
            ${escapeHtml(item.title)}
          </h3>
          <p class="text-xs text-on-surface-variant flex items-center gap-1">
            <span class="material-symbols-outlined text-sm text-outline shrink-0">near_me</span>
            <span class="truncate">${escapeHtml(item.address)}</span>
          </p>
          <div class="flex flex-wrap items-center gap-1.5 pt-1">
            <span class="px-2 py-0.5 bg-surface-container-low rounded text-[11px] font-medium text-on-surface-variant">${approxArea}</span>
            <span class="px-2 py-0.5 bg-surface-container-low rounded text-[11px] font-medium text-on-surface-variant">${item.rooms} комн.</span>
            <span class="px-2 py-0.5 bg-surface-container-low rounded text-[11px] font-medium text-on-surface-variant">Евроремонт</span>
          </div>
        </div>
      </div>
      <div class="p-4 pt-0">
        ${actionButtons}
      </div>
    </article>
  `;
}


filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    activeDistrict = btn.dataset.district;
    updateUrlParams();
    renderCatalog();
  });
});

// ===== 6. Главная страница: горячие предложения и счётчик =====
function renderFeatured() {
  const grid = document.querySelector("#featuredGrid");
  if (!grid) return;
  const items = allListings.slice(0, 3);
  if (!items.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">Нет доступных предложений</div>`;
    return;
  }
  grid.innerHTML = items.map(item => renderCard(item)).join("");
}

function updateHeroStats() {
  const heroCount = document.querySelector("#hero-count");
  const statCount = document.querySelector("#stat-count");
  const total = allListings.length ? allListings.length : 150;
  if (heroCount) heroCount.textContent = total;
  if (statCount) statCount.textContent = `${total}+`;
}


// ===== 7. Детальный просмотр =====
function openDetails(id) {
  const item = allListings.find(i => i.id === id);
  if (!item) return;

  const photo = item.imageUrl || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80";
  const isMine = item.ownerId === myClientId;
  const approxArea = (item.rooms * 26 + 10) + " м²";
  const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString("ru-RU") : "Недавно";
  const priceUzs = Math.round(item.price * 12750).toLocaleString("ru-RU") + " сум";

  const modal = document.getElementById("detailModal");
  if (!modal) return;

  // Базовые поля
  const img = document.getElementById("modalDetailImg");
  const title = document.getElementById("modalDetailTitle");
  const price = document.getElementById("modalDetailPrice");
  const priceUzsEl = document.getElementById("modalDetailPriceUzs");
  const addr = document.getElementById("modalDetailAddress");
  const idEl = document.getElementById("modalDetailId");
  const ownBadge = document.getElementById("modalDetailOwnBadge");
  const linkBtn = document.getElementById("modalDetailDirectLink");
  const specs = document.getElementById("modalDetailSpecs");

  if (img) img.src = photo;
  if (title) title.textContent = item.title;
  if (price) price.textContent = item.price.toLocaleString("ru-RU") + " у.е.";
  if (priceUzsEl) priceUzsEl.textContent = `~ ${priceUzs} (по курсу ЦБ)`;
  if (addr) addr.textContent = `📍 г. Ташкент, ${item.district}, ${item.address}`;
  if (idEl) idEl.textContent = `ID: #${item.id}`;
  if (ownBadge) ownBadge.style.display = isMine ? "inline-block" : "none";
  if (linkBtn) linkBtn.href = `listing.html?id=${item.id}`;

  if (specs) {
    specs.innerHTML = `
      <div class="bg-surface-container-low p-2.5 rounded-xl text-center border border-outline-variant/30">
        <span class="block text-[11px] text-on-surface-variant uppercase font-bold tracking-wider mb-0.5">Комнат</span>
        <span class="text-sm font-bold text-on-surface font-display">🚪 ${item.rooms}</span>
      </div>
      <div class="bg-surface-container-low p-2.5 rounded-xl text-center border border-outline-variant/30">
        <span class="block text-[11px] text-on-surface-variant uppercase font-bold tracking-wider mb-0.5">Район</span>
        <span class="text-sm font-bold text-on-surface font-display truncate">🗺️ ${escapeHtml(item.district)}</span>
      </div>
      <div class="bg-surface-container-low p-2.5 rounded-xl text-center border border-outline-variant/30">
        <span class="block text-[11px] text-on-surface-variant uppercase font-bold tracking-wider mb-0.5">Площадь</span>
        <span class="text-sm font-bold text-on-surface font-display">📐 ~${approxArea}</span>
      </div>
      <div class="bg-surface-container-low p-2.5 rounded-xl text-center border border-outline-variant/30">
        <span class="block text-[11px] text-on-surface-variant uppercase font-bold tracking-wider mb-0.5">Дата</span>
        <span class="text-sm font-bold text-on-surface font-display">📅 ${dateStr}</span>
      </div>
    `;
  }

  modal.style.display = "flex";
}

function closeDetails() {
  const m = document.getElementById("detailModal");
  if (m) m.style.display = "none";
}


// ===== 8. Добавление объявления =====
function openCreateModal() {
  document.getElementById("clientAddForm")?.reset();
  const prev = document.getElementById("clientPhotoPreview");
  if (prev) prev.src = "";
  const wrap = document.getElementById("clientPhotoPreviewWrap");
  if (wrap) wrap.style.display = "none";
  const modal = document.getElementById("clientAddModal");
  if (modal) modal.style.display = "flex";
}

function closeCreateModal() {
  const m = document.getElementById("clientAddModal");
  if (m) m.style.display = "none";
}

function handleClientPhotoSelect(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const prev = document.getElementById("clientPhotoPreview");
    if (prev) prev.src = ev.target.result;
    const wrap = document.getElementById("clientPhotoPreviewWrap");
    if (wrap) wrap.style.display = "block";
    const url = document.getElementById("newListingUrl");
    if (url) url.value = "";
  };
  reader.readAsDataURL(file);
}

async function handleClientCreate(e) {
  e.preventDefault();
  let imageUrl = document.getElementById("newListingUrl")?.value.trim() || "";
  const fileInput = document.getElementById("newListingFile");

  if (fileInput?.files.length > 0) {
    const fd = new FormData();
    fd.append("file", fileInput.files[0]);
    try {
      const r = await fetch("/api/listings/upload", { method: "POST", body: fd });
      if (r.ok) { const d = await r.json(); imageUrl = d.url; }
    } catch {}
  }

  const payload = {
    title:    document.getElementById("newListingTitle")?.value,
    price:    parseFloat(document.getElementById("newListingPrice")?.value),
    district: document.getElementById("newListingDistrict")?.value,
    address:  document.getElementById("newListingAddress")?.value,
    rooms:    parseInt(document.getElementById("newListingRooms")?.value),
    imageUrl: imageUrl || null
  };

  try {
    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Client-Id": myClientId },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      closeCreateModal();
      alert("Объявление успешно опубликовано!");
      await loadCatalog();
      renderFeatured();
    } else {
      alert("Ошибка при сохранении объявления");
    }
  } catch { alert("Ошибка соединения с сервером"); }
}

// ===== 9. Редактирование своего объявления =====
function openEditModal(id) {
  const item = allListings.find(i => i.id === id);
  if (!item) return;
  document.getElementById("editListingId").value       = item.id;
  document.getElementById("editListingTitle").value    = item.title;
  document.getElementById("editListingPrice").value    = item.price;
  document.getElementById("editListingDistrict").value = item.district;
  document.getElementById("editListingAddress").value  = item.address;
  document.getElementById("editListingRooms").value    = item.rooms;
  document.getElementById("editListingUrl").value      = item.imageUrl || "";
  const wrap = document.getElementById("editPhotoPreviewWrap");
  if (wrap) wrap.style.display = "none";
  document.getElementById("editModal").style.display = "flex";
}

function closeEditModal() {
  const m = document.getElementById("editModal");
  if (m) m.style.display = "none";
}

function handleEditPhotoSelect(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const prev = document.getElementById("editPhotoPreview");
    if (prev) prev.src = ev.target.result;
    const wrap = document.getElementById("editPhotoPreviewWrap");
    if (wrap) wrap.style.display = "block";
    const url = document.getElementById("editListingUrl");
    if (url) url.value = "";
  };
  reader.readAsDataURL(file);
}

async function handleEditSubmit(e) {
  e.preventDefault();
  const id = document.getElementById("editListingId")?.value;
  let imageUrl = document.getElementById("editListingUrl")?.value.trim() || "";
  const fileInput = document.getElementById("editListingFile");

  if (fileInput?.files.length > 0) {
    const fd = new FormData();
    fd.append("file", fileInput.files[0]);
    try {
      const r = await fetch("/api/listings/upload", { method: "POST", body: fd });
      if (r.ok) { const d = await r.json(); imageUrl = d.url; }
    } catch {}
  }

  const payload = {
    title:    document.getElementById("editListingTitle")?.value,
    price:    parseFloat(document.getElementById("editListingPrice")?.value),
    district: document.getElementById("editListingDistrict")?.value,
    address:  document.getElementById("editListingAddress")?.value,
    rooms:    parseInt(document.getElementById("editListingRooms")?.value),
    imageUrl: imageUrl || null
  };

  try {
    const res = await fetch(`/api/listings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-Client-Id": myClientId },
      body: JSON.stringify(payload)
    });
    if (res.status === 204) {
      closeEditModal();
      alert("Объявление обновлено!");
      await loadCatalog();
      renderFeatured();
    } else if (res.status === 403) {
      alert("Вы можете редактировать только свои объявления.");
    } else {
      alert("Ошибка при обновлении");
    }
  } catch { alert("Ошибка соединения"); }
}

// ===== 10. Удаление своего объявления =====
async function deleteOwnListing(id) {
  if (!confirm(`Удалить объявление #${id}? Это необратимо.`)) return;
  try {
    const res = await fetch(`/api/listings/${id}`, {
      method: "DELETE",
      headers: { "X-Client-Id": myClientId }
    });
    if (res.status === 204) {
      alert("Объявление удалено.");
      await loadCatalog();
      renderFeatured();
    } else if (res.status === 403) {
      alert("Вы можете удалять только свои объявления.");
    } else {
      alert("Ошибка при удалении");
    }
  } catch { alert("Ошибка соединения"); }
}

// ===== 11. Счётчик посещений =====
const viewsEl = document.querySelector("#views-count");
if (viewsEl) {
  let views = Number(localStorage.getItem("views")) || 0;
  views += 1;
  localStorage.setItem("views", views);
  viewsEl.textContent = views;
}

// ===== 12. Кнопка «Наверх» =====
const scrollTopBtn = document.querySelector("#scroll-top");
if (scrollTopBtn) {
  window.addEventListener("scroll", () => {
    scrollTopBtn.style.display = window.scrollY > 400 ? "block" : "none";
  });
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ===== 13. Сортировка таблицы цен =====
const tableHeaders = document.querySelectorAll("table thead th");
const tableBody    = document.querySelector("table tbody");
if (tableHeaders.length && tableBody) {
  tableHeaders.forEach((th, colIndex) => {
    if (colIndex > 0) {
      th.style.cursor = "pointer";
      th.title = "Нажмите для сортировки";
      let asc = true;
      th.addEventListener("click", () => {
        const rows = Array.from(tableBody.querySelectorAll("tr"));
        rows.sort((a, b) => {
          const va = Number(a.children[colIndex].textContent.replace(/\D/g, "")) || 0;
          const vb = Number(b.children[colIndex].textContent.replace(/\D/g, "")) || 0;
          return asc ? va - vb : vb - va;
        });
        asc = !asc;
        tableBody.append(...rows);
      });
    }
  });
}

// ===== 14. Логика страницы отдельного объявления (listing.html) =====
async function initListingPage() {
  const container = document.getElementById("listingPageContainer");
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");
  if (!idParam) {
    const loadEl = document.getElementById("listingLoading");
    if (loadEl) {
      loadEl.innerHTML = `
        <h3>⚠️ Номер объявления не указан</h3>
        <p><a href="catalog.html" class="btn btn-secondary">Перейти в каталог</a></p>
      `;
    }
    return;
  }

  const id = parseInt(idParam);
  let item = allListings.find(i => i.id === id);
  if (!item) {
    try {
      const res = await fetch(`/api/listings/${id}`);
      if (res.ok) {
        item = await res.json();
      }
    } catch {}
  }

  if (!item) {
    const loadEl = document.getElementById("listingLoading");
    if (loadEl) {
      loadEl.innerHTML = `
        <h3>❌ Объявление #${id} не найдено или удалено</h3>
        <p><a href="catalog.html" class="btn btn-secondary">Вернуться в каталог</a></p>
      `;
    }
    return;
  }

  // Заполняем страницу
  const loadEl = document.getElementById("listingLoading");
  const viewEl = document.getElementById("listingDetailView");
  if (loadEl) loadEl.style.display = "none";
  if (viewEl) viewEl.style.display = "block";

  const isMine = item.ownerId === myClientId;
  const photo = item.imageUrl || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80";
  const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString("ru-RU") : "Недавно";
  const approxArea = (item.rooms * 26 + 10) + " м²";
  const priceUzs = Math.round(item.price * 12750).toLocaleString("ru-RU") + " сум";

  document.title = `${item.title} — Locus Недвижимость`;

  const elId = document.getElementById("pageDetailId");
  const elDate = document.getElementById("pageDetailDate");
  const elTitle = document.getElementById("pageDetailTitle");
  const elAddress = document.getElementById("pageDetailAddress");
  const elPrice = document.getElementById("pageDetailPrice");
  const elPriceUzs = document.getElementById("pageDetailPriceUzs");
  const elImg = document.getElementById("pageDetailImg");
  const elSpecs = document.getElementById("pageDetailSpecs");

  if (elId) elId.textContent = `ID: #${item.id}`;
  if (elDate) elDate.textContent = `Опубликовано: ${dateStr}`;
  if (elTitle) elTitle.textContent = item.title;
  if (elAddress) elAddress.textContent = `📍 г. Ташкент, ${item.district}, ${item.address}`;
  if (elPrice) elPrice.textContent = item.price.toLocaleString("ru-RU") + " у.е.";
  if (elPriceUzs) elPriceUzs.textContent = `~ ${priceUzs} (по курсу ЦБ)`;
  if (elImg) elImg.src = photo;

  if (elSpecs) {
    elSpecs.innerHTML = `
      <div class="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/30 flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
          <span class="material-symbols-outlined text-xl">meeting_room</span>
        </div>
        <div>
          <span class="text-xs text-on-surface-variant block font-medium">Комнатность</span>
          <span class="text-sm font-bold text-on-surface font-display">${item.rooms} раздельные</span>
        </div>
      </div>
      <div class="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/30 flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
          <span class="material-symbols-outlined text-xl">straighten</span>
        </div>
        <div>
          <span class="text-xs text-on-surface-variant block font-medium">Общая площадь</span>
          <span class="text-sm font-bold text-on-surface font-display">${approxArea}</span>
        </div>
      </div>
      <div class="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/30 flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
          <span class="material-symbols-outlined text-xl">location_city</span>
        </div>
        <div>
          <span class="text-xs text-on-surface-variant block font-medium">Район столицы</span>
          <span class="text-sm font-bold text-on-surface font-display">${escapeHtml(item.district)}</span>
        </div>
      </div>
      <div class="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/30 flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
          <span class="material-symbols-outlined text-xl">brush</span>
        </div>
        <div>
          <span class="text-xs text-on-surface-variant block font-medium">Состояние ремонта</span>
          <span class="text-sm font-bold text-on-surface font-display">Евроремонт</span>
        </div>
      </div>
      <div class="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/30 flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
          <span class="material-symbols-outlined text-xl">apartment</span>
        </div>
        <div>
          <span class="text-xs text-on-surface-variant block font-medium">Материал стен</span>
          <span class="text-sm font-bold text-on-surface font-display">Кирпич-монолит</span>
        </div>
      </div>
      <div class="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/30 flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
          <span class="material-symbols-outlined text-xl">calendar_today</span>
        </div>
        <div>
          <span class="text-xs text-on-surface-variant block font-medium">Размещение</span>
          <span class="text-sm font-bold text-on-surface font-display">${dateStr}</span>
        </div>
      </div>
    `;
  }


  // Ипотечный расчёт
  const downPayment = Math.round(item.price * 0.3);
  const loanAmount = item.price - downPayment;
  const monthlyRate = 0.18 / 12;
  const months = 120;
  const monthlyPayment = Math.round(loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1));

  const elDown = document.getElementById("detailCalcDown");
  const elMonthly = document.getElementById("detailCalcMonthly");
  if (elDown) elDown.value = `${downPayment.toLocaleString("ru-RU")} у.е.`;
  if (elMonthly) elMonthly.value = `~ ${monthlyPayment.toLocaleString("ru-RU")} у.е./мес`;

  // Своё объявление?
  if (isMine) {
    const controls = document.getElementById("pageOwnControls");
    if (controls) controls.style.display = "block";
    const editBtn = document.getElementById("pageEditBtn");
    const delBtn = document.getElementById("pageDeleteBtn");
    if (editBtn) editBtn.onclick = () => { window.location.href = `catalog.html`; };
    if (delBtn) delBtn.onclick = async () => {
      await deleteOwnListing(item.id);
      window.location.href = "catalog.html";
    };
  }
}

// ===== Калькулятор стоимости 1 м² (Stitch) =====
function initStitchCalculator() {
  const districtSelect = document.getElementById("calc-district");
  const areaInput = document.getElementById("calc-area");
  const totalOutput = document.getElementById("calc-total");
  const rateOutput = document.getElementById("calc-rate");

  function updateCalc() {
    if (!districtSelect || !areaInput || !totalOutput || !rateOutput) return;
    const rate = parseInt(districtSelect.value, 10) || 870;
    const area = parseFloat(areaInput.value) || 0;
    const total = Math.round(rate * area);
    rateOutput.textContent = `${rate} $/м²`;
    totalOutput.textContent = `$${total.toLocaleString("en-US")}`;
  }

  if (districtSelect && areaInput) {
    districtSelect.addEventListener("change", updateCalc);
    areaInput.addEventListener("input", updateCalc);
    updateCalc();
  }
}

// ===== Выбор комнат в Hero на главной =====
function initHeroRoomButtons() {
  window.selectedHeroRooms = "all";
  const roomButtons = document.querySelectorAll(".room-btn");
  if (!roomButtons.length) return;

  roomButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const isAlreadyActive = btn.classList.contains("bg-surface-container-lowest") && btn.dataset.rooms !== "all";

      roomButtons.forEach(b => {
        b.classList.remove("bg-surface-container-lowest", "text-primary", "shadow-xs");
        b.classList.add("text-on-surface-variant");
      });

      if (isAlreadyActive) {
        // Если повторно нажали на выбранную кнопку, сбрасываем на "Все"
        const allBtn = document.querySelector('.room-btn[data-rooms="all"]');
        if (allBtn) {
          allBtn.classList.add("bg-surface-container-lowest", "text-primary", "shadow-xs");
          allBtn.classList.remove("text-on-surface-variant");
        }
        window.selectedHeroRooms = "all";
      } else {
        btn.classList.add("bg-surface-container-lowest", "text-primary", "shadow-xs");
        btn.classList.remove("text-on-surface-variant");
        window.selectedHeroRooms = btn.dataset.rooms || "all";
      }
    });
  });
}

// ===== Утилиты =====
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ===== Загрузка при старте =====
async function init() {
  initHeroRoomButtons(); // Инициализация кнопок комнат в Hero
  await loadCatalog();
  renderFeatured(); // Только на главной (если есть #featuredGrid)
  initListingPage(); // Только на странице listing.html (если есть #listingPageContainer)
  initStitchCalculator(); // Калькулятор м² на главной
}

init();


