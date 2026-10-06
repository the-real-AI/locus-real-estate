console.log("Скрипт подключён");
if (document.querySelector("h1")) {
  console.log(document.querySelector("h1").textContent);
}

// ===== 1. Показать / скрыть телефон =====
const showBtn = document.querySelector("#show-phone");
const phone = document.querySelector("#phone");

if (showBtn && phone) {
  showBtn.addEventListener("click", () => {
    phone.hidden = !phone.hidden;
    showBtn.textContent = phone.hidden ? "Показать телефон" : "Скрыть телефон";
  });
}

// ===== 2. Тёмная тема с запоминанием в localStorage =====
const themeBtn = document.querySelector("#theme");

function applyTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  if (themeBtn) {
    themeBtn.textContent = isDark ? "☀️ Светлая" : "🌙 Тёмная";
  }
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

if (themeBtn) {
  applyTheme(localStorage.getItem("theme") === "dark");

  themeBtn.addEventListener("click", () => {
    applyTheme(!document.body.classList.contains("dark"));
  });
}

// ===== 3. Проверка формы обратной связи =====
const form = document.querySelector("#contact-form");
const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone-input");
const emailInput = document.querySelector("#email");
const errorBox = document.querySelector("#form-error");

if (form && nameInput && phoneInput && errorBox) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Проверка 1: Имя (минимум 2 буквы)
    const name = nameInput.value.trim();
    if (name.length < 2) {
      errorBox.textContent = "Введите имя — минимум 2 буквы";
      nameInput.focus();
      return;
    }

    // Проверка 2: Телефон (формат Узбекистана +998 и 12 цифр)
    const digits = phoneInput.value.replace(/\D/g, "");
    if (digits.length !== 12 || !digits.startsWith("998")) {
      errorBox.textContent = "Телефон должен быть в формате +998 90 123 45 67";
      phoneInput.focus();
      return;
    }

    // Проверка 3 (Обязательное задание Урока 3): Email через includes и indexOf (без RegExp)
    if (emailInput) {
      const email = emailInput.value.trim();
      if (email.length > 0) {
        const atPos = email.indexOf("@");
        const dotPos = email.lastIndexOf(".");
        if (!email.includes("@") || atPos <= 0 || dotPos <= atPos + 1 || dotPos === email.length - 1) {
          errorBox.textContent = "Некорректный email: адрес должен содержать @ и точку после неё";
          emailInput.focus();
          return;
        }
      }
    }

    // Успешная отправка
    errorBox.textContent = "";
    alert(`Спасибо, ${name}! Перезвоним на +${digits}`);
    form.reset();
  });
}

// ===== 4. Калькулятор цены за м² =====
const priceEl = document.querySelector("#calc-price");
const areaEl = document.querySelector("#calc-area");
const resultEl = document.querySelector("#calc-result");

function recalc() {
  if (!priceEl || !areaEl || !resultEl) return;

  const price = Number(priceEl.value);
  const area = Number(areaEl.value);

  if (!price || !area || area <= 0) {
    resultEl.textContent = "—";
    return;
  }

  const perMeter = Math.round(price / area);
  resultEl.textContent = perMeter.toLocaleString("ru-RU") + " у.е.";
}

if (priceEl && areaEl) {
  priceEl.addEventListener("input", recalc);
  areaEl.addEventListener("input", recalc);
  recalc();
}

// ===== 5. Фильтр похожих объявлений по району =====
const filterButtons = document.querySelectorAll(".filters button");
const countEl = document.querySelector("#listings-count");
const listingsContainer = document.querySelector(".listings");

function applyFilter(district) {
  const currentItems = document.querySelectorAll(".listings li");
  let shown = 0;

  currentItems.forEach((item) => {
    const match = district === "all" || item.dataset.district === district;
    item.hidden = !match;
    if (match) shown++;
  });

  if (countEl) {
    countEl.textContent = `Показано: ${shown} из ${currentItems.length}`;
  }

  // Подсветка активной кнопки
  filterButtons.forEach((btn) => {
    if (btn.dataset.district === district) {
      btn.style.background = "#1e40af";
    } else {
      btn.style.background = "";
    }
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyFilter(button.dataset.district);
  });
});

// Задание со звёздочкой: Загрузка дополнительных объявлений из listings.json через fetch()
if (listingsContainer) {
  fetch("listings.json")
    .then((r) => {
      if (!r.ok) throw new Error("Network error");
      return r.json();
    })
    .then((items) => {
      // Очищаем и наполняем из JSON
      listingsContainer.innerHTML = "";
      items.forEach((item) => {
        const li = document.createElement("li");
        li.dataset.district = item.district;
        li.textContent = `${item.title} — ${Number(item.price).toLocaleString("ru-RU")} у.е.`;
        listingsContainer.appendChild(li);
      });
      applyFilter("all");
    })
    .catch(() => {
      // Фолбэк на статические элементы HTML при открытии через file://
      applyFilter("all");
    });
} else {
  applyFilter("all");
}

// ===== 6. Задания со звёздочкой =====

// 6.1. Счётчик просмотров страницы (localStorage)
const viewsEl = document.querySelector("#views-count");
if (viewsEl) {
  let views = Number(localStorage.getItem("views")) || 0;
  views += 1;
  localStorage.setItem("views", views);
  viewsEl.textContent = views;
}

// 6.2. Кнопка «Наверх» с плавным скроллом
const scrollTopBtn = document.querySelector("#scroll-top");
if (scrollTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      scrollTopBtn.style.display = "block";
    } else {
      scrollTopBtn.style.display = "none";
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// 6.3. Сортировка таблицы цен при клике на заголовок столбца
const tableHeaders = document.querySelectorAll("table thead th");
const tableBody = document.querySelector("table tbody");

if (tableHeaders.length && tableBody) {
  tableHeaders.forEach((th, colIndex) => {
    // Начиная со 2-го столбца (числовые цены)
    if (colIndex > 0) {
      th.title = "Нажмите для сортировки по возрастанию/убыванию";
      let ascending = true;

      th.addEventListener("click", () => {
        const rows = Array.from(tableBody.querySelectorAll("tr"));
        rows.sort((a, b) => {
          const valA = Number(a.children[colIndex].textContent.replace(/\D/g, "")) || 0;
          const valB = Number(b.children[colIndex].textContent.replace(/\D/g, "")) || 0;
          return ascending ? valA - valB : valB - valA;
        });

        ascending = !ascending;
        tableBody.append(...rows);
      });
    }
  });
}
