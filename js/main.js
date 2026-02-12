const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => [...el.querySelectorAll(q)];

$("#year").textContent = new Date().getFullYear();

// Mobile nav
const toggleBtn = $(".nav-toggle");
const nav = $(".nav");

toggleBtn?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  toggleBtn.setAttribute("aria-expanded", String(isOpen));
});

$$(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggleBtn.setAttribute("aria-expanded", "false");
  });
});

// Active link highlight
const sections = ["diensten", "werkwijze", "team", "prijzen", "duurzaam", "contact"]
  .map(id => document.getElementById(id))
  .filter(Boolean);

const links = $$(".nav-link");

const obs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    links.forEach(a => a.classList.remove("active"));
    const active = $(`.nav-link[href="#${entry.target.id}"]`);
    active?.classList.add("active");
  });
}, { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 });

sections.forEach(sec => obs.observe(sec));

/* Custom dropdown: Type klant */
const typeSelect = $("#typeSelect");
const typeHidden = $("#typeHidden");
const typeTrigger = $(".select-trigger", typeSelect);
const typeValue = $(".select-value", typeSelect);
const typeOptions = $$(".select-option", typeSelect);

function closeSelect() {
  typeSelect?.classList.remove("open");
  typeTrigger?.setAttribute("aria-expanded", "false");
}

typeTrigger?.addEventListener("click", () => {
  const open = typeSelect.classList.toggle("open");
  typeTrigger.setAttribute("aria-expanded", String(open));
});

typeOptions.forEach(btn => {
  btn.addEventListener("click", () => {
    const val = btn.dataset.value;

    typeHidden.value = val;
    typeValue.textContent = val;

    typeOptions.forEach(o => o.setAttribute("aria-selected", "false"));
    btn.setAttribute("aria-selected", "true");

    closeSelect();
  });
});

document.addEventListener("click", (e) => {
  if (!typeSelect) return;
  if (!typeSelect.contains(e.target)) closeSelect();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSelect();
});

// Form -> Formspree (AJAX) -> redirect naar bedankt.html
$("#quoteForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.currentTarget;

  const type = form.type?.value?.trim?.() || "";
  if (!type) {
    alert("Kies aub een type klant.");
    return;
  }

  const endpoint = form.action; // https://formspree.io/f/mreaewgk
  const data = new FormData(form);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      body: data,
      headers: { "Accept": "application/json" }
    });

    if (res.ok) {
      window.location.href = "bedankt.html";
      return;
    }

    let msg = "Verzenden mislukt. Probeer opnieuw.";
    try {
      const json = await res.json();
      if (json?.errors?.length) msg = json.errors[0].message || msg;
    } catch (_) {}

    alert(msg);
  } catch (err) {
    alert("Geen verbinding. Probeer opnieuw.");
  }
});
