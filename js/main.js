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

    // set hidden value for form submit
    typeHidden.value = val;
    typeValue.textContent = val;

    // aria-selected
    typeOptions.forEach(o => o.setAttribute("aria-selected", "false"));
    btn.setAttribute("aria-selected", "true");

    closeSelect();
  });
});

// close when clicking outside
document.addEventListener("click", (e) => {
  if (!typeSelect) return;
  if (!typeSelect.contains(e.target)) closeSelect();
});

// close on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSelect();
});

// Form -> mailto
$("#quoteForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.currentTarget;

  const org = form.org.value.trim();
  const type = form.type.value.trim();
  const count = form.count.value.trim();
  const date = form.date.value;
  const msg = form.msg.value.trim();

  if (!type) {
    alert("Kies aub een type klant.");
    return;
  }

  const to = "rolfriss004@gmail.com";
  const subject = encodeURIComponent(`Offerteaanvraag Rolfris – ${org}`);
  const body = encodeURIComponent(
`Naam of instelling: ${org}
Type klant: ${type}
Aantal rolstoelen (indicatie): ${count || "-"}
Gewenste datum: ${date}
Bericht:
${msg}

Verzonden via: ${window.location.href}`
  );

  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
});
