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
const sections = ["diensten", "werkwijze", "prijzen", "duurzaam", "contact"]
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

// Form -> mailto (met datum)
$("#quoteForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.currentTarget;

  const org = form.org.value.trim();
  const type = form.type.value.trim();
  const count = form.count.value.trim();
  const date = form.date.value;
  const msg = form.msg.value.trim();

  const to = "rolfriss004@gmail.com";
  const subject = encodeURIComponent(`Offerteaanvraag Rolfris – ${org}`);
  const body = encodeURIComponent(
`Naam/Instelling: ${org}
Type klant: ${type}
Aantal rolstoelen (schatting): ${count || "-"}
Gewenste datum: ${date}
Bericht:
${msg}

Verzonden via: ${window.location.href}`
  );

  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
});
