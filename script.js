(function () {
  "use strict";

  // Easy manual edit area: update this fallback if the page has no WhatsApp link.
  const FALLBACK_WHATSAPP_NUMBER = "97430975205";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function getWhatsAppNumber() {
    const link = $('a[href*="wa.me/"]');
    const match = link ? link.href.match(/wa\.me\/(\d+)/) : null;
    return match ? match[1] : FALLBACK_WHATSAPP_NUMBER;
  }

  function showToast(title, text, type = "success") {
    const oldToast = $(".site-toast");
    if (oldToast) oldToast.remove();

    const colors = {
      success: "border-green-500 text-green-600 bg-green-100",
      error: "border-red-500 text-red-600 bg-red-100",
      info: "border-indigo-500 text-indigo-600 bg-indigo-100",
    };

    const toast = document.createElement("div");
    toast.className = "site-toast fixed bottom-24 right-6 max-w-sm bg-white border-l-4 shadow-2xl p-5 rounded-2xl z-[100] transition-all";
    toast.classList.add(...(colors[type] || colors.info).split(" "));
    toast.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="w-9 h-9 rounded-full flex items-center justify-center bg-current/10">
          <i class="fa-solid ${type === "error" ? "fa-triangle-exclamation" : "fa-check"}"></i>
        </div>
        <div>
          <p class="font-black text-slate-900">${title}</p>
          <p class="text-sm text-slate-600">${text}</p>
        </div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4200);
  }

  function setupMobileMenu() {
    const header = $("header");
    const nav = $("header nav");
    if (!header || !nav || $(".mobile-menu-button", header)) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "mobile-menu-button lg:hidden w-11 h-11 rounded-full border border-slate-200 flex items-center justify-center text-dark";
    button.setAttribute("aria-label", "Open menu");
    button.setAttribute("aria-expanded", "false");
    button.innerHTML = '<i class="fa-solid fa-bars"></i>';

    const actions = $("header > div:last-child");
    if (actions) header.insertBefore(button, actions);
    else header.appendChild(button);

    const panel = document.createElement("div");
    panel.className = "mobile-menu-panel hidden lg:hidden fixed left-4 right-4 top-24 z-50 bg-white border border-slate-100 rounded-3xl shadow-2xl p-5";
    panel.innerHTML = `
      <div class="flex flex-col gap-2 font-bold uppercase text-sm text-slate-600">
        <a href="index.html" class="px-4 py-3 rounded-2xl hover:bg-indigo-50 hover:text-primary">Home</a>
        <a href="about.html" class="px-4 py-3 rounded-2xl hover:bg-indigo-50 hover:text-primary">About Us</a>
        <button type="button" data-mobile-repairs class="text-left px-4 py-3 rounded-2xl hover:bg-indigo-50 hover:text-primary">Repairs</button>
        <a href="used.html" class="px-4 py-3 rounded-2xl hover:bg-indigo-50 hover:text-primary">Used</a>
        <a href="contact.html" class="px-4 py-3 rounded-2xl hover:bg-indigo-50 hover:text-primary">Contact Us</a>
      </div>
    `;
    header.insertAdjacentElement("afterend", panel);

    button.addEventListener("click", () => {
      const open = panel.classList.toggle("hidden") === false;
      button.setAttribute("aria-expanded", String(open));
      button.innerHTML = `<i class="fa-solid ${open ? "fa-xmark" : "fa-bars"}"></i>`;
      document.body.style.overflow = open ? "hidden" : "";
    });

    panel.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        panel.classList.add("hidden");
        button.setAttribute("aria-expanded", "false");
        button.innerHTML = '<i class="fa-solid fa-bars"></i>';
        document.body.style.overflow = "";
      }
    });
  }

  function setupRepairsMenu() {
    $$("header nav .relative.group").forEach((item) => {
      if ($(".repairs-menu", item)) return;
      item.classList.add("relative");
      const menu = document.createElement("div");
      menu.className = "repairs-menu invisible opacity-0 translate-y-2 absolute top-full left-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-3 transition-all z-50";
      menu.innerHTML = `
        <a href="contact.html?service=Laptop%20Repair" class="block px-4 py-3 rounded-2xl hover:bg-indigo-50 hover:text-primary">Laptop Repair</a>
        <a href="contact.html?service=Mobile%20Phone%20Repair" class="block px-4 py-3 rounded-2xl hover:bg-indigo-50 hover:text-primary">Mobile Phone Repair</a>
        <a href="contact.html?service=iPad%20Repair" class="block px-4 py-3 rounded-2xl hover:bg-indigo-50 hover:text-primary">iPad Repair</a>
      `;
      item.appendChild(menu);

      item.addEventListener("mouseenter", () => menu.classList.remove("invisible", "opacity-0", "translate-y-2"));
      item.addEventListener("mouseleave", () => menu.classList.add("invisible", "opacity-0", "translate-y-2"));
      item.addEventListener("click", () => menu.classList.toggle("invisible"));
    });

    const mobileRepairs = $("[data-mobile-repairs]");
    if (mobileRepairs) {
      mobileRepairs.addEventListener("click", () => {
        window.location.href = "contact.html?service=Device%20Repair";
      });
    }
  }

  function setupButtonActions() {
    $$("button").forEach((button) => {
      const label = button.textContent.replace(/\s+/g, " ").trim().toLowerCase();
      if (label.includes("repair my device")) {
        button.addEventListener("click", () => {
          window.location.href = "contact.html?service=Device%20Repair";
        });
      }
      if (label.includes("contact us") || label.includes("question")) {
        button.addEventListener("click", () => {
          window.location.href = "contact.html";
        });
      }
    });

    $$('a[href="#"]').forEach((link) => {
      const text = link.textContent.replace(/\s+/g, " ").trim().toLowerCase();
      if (text.includes("explore service")) {
        link.href = "contact.html?service=Device%20Repair";
      } else if (text.includes("blog")) {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          showToast("Blogs coming soon", "This section is not published yet.", "info");
        });
      }
    });
  }

  function setupActiveNav() {
    const file = location.pathname.split("/").pop() || "index.html";
    $$("header nav a").forEach((link) => {
      const href = link.getAttribute("href");
      if (href && href === file) {
        link.classList.add("text-primary");
      }
    });
  }

  function setupFaq() {
    const answers = {
      "How can I prevent future damages to my devices?": "Use a protective case, keep liquids away, avoid overheating, update software regularly, and bring the device for inspection when you notice early warning signs.",
      "What types of issues can you fix on mobile phones?": "We handle screen replacement, battery problems, charging faults, speaker and microphone issues, camera faults, software errors, and water damage checks.",
      "Is it possible to repair a water-damaged laptop or phone?": "Yes, many water-damaged devices can be restored if they are inspected quickly. Switch the device off and contact us before charging it again.",
      "Do you provide genuine warranties on your repairs?": "Yes, eligible repairs include warranty support. The warranty period depends on the repair type and replacement part used.",
      "Can you repair broken iPad screens?": "Yes, we repair broken iPad screens and can also inspect battery, charging, and software issues during the same visit.",
    };

    $$(".faq-item").forEach((item, index) => {
      const title = $("h4", item);
      const icon = $(".faq-icon", item);
      if (!title) return;

      let answer = $("p", item);
      if (!answer) {
        answer = document.createElement("p");
        answer.className = "hidden text-slate-500 text-sm leading-relaxed mt-4";
        answer.textContent = answers[title.textContent.trim()] || "Contact our team and we will guide you with the best repair option.";
        item.appendChild(answer);
      } else if (index !== 0) {
        answer.classList.add("hidden");
      }

      item.addEventListener("click", () => {
        const isOpen = !answer.classList.contains("hidden");
        $$(".faq-item p").forEach((p) => p.classList.add("hidden"));
        $$(".faq-icon").forEach((i) => {
          i.classList.remove("fa-chevron-up", "text-primary");
          i.classList.add("fa-chevron-down", "text-slate-400");
        });
        $$(".faq-item").forEach((faq) => {
          faq.classList.remove("bg-indigo-50", "border-primary/20");
          faq.classList.add("bg-white", "border-slate-100");
        });

        if (!isOpen) {
          answer.classList.remove("hidden");
          item.classList.add("bg-indigo-50", "border-primary/20");
          item.classList.remove("bg-white", "border-slate-100");
          if (icon) {
            icon.classList.add("fa-chevron-up", "text-primary");
            icon.classList.remove("fa-chevron-down", "text-slate-400");
          }
        }
      });
    });
  }

  function setupTestimonials() {
    const section = $$("section").find((candidate) => candidate.textContent.includes("Hear from them"));
    if (!section) return;

    const quote = $("p.text-xl", section);
    const name = $(".font-bold.text-dark.text-lg", section);
    const role = $(".text-slate-400.text-sm", section);
    const buttons = $$("button", section);
    if (!quote || !name || buttons.length < 2) return;

    const testimonials = [
      {
        quote: "Excellent service! The team was professional, fast, and the pickup and delivery made the repair very easy.",
        name: "Shawn Thornhill",
        role: "Verified Customer",
      },
      {
        quote: "My laptop battery was replaced quickly and the staff explained everything clearly before starting the repair.",
        name: "Amina Hassan",
        role: "Laptop Repair Customer",
      },
      {
        quote: "They fixed my phone screen the same day. The service felt honest, affordable, and careful.",
        name: "Mohammed Ali",
        role: "Mobile Repair Customer",
      },
    ];

    let current = 0;
    const render = () => {
      quote.textContent = testimonials[current].quote;
      name.textContent = testimonials[current].name;
      if (role) role.textContent = testimonials[current].role;
    };

    buttons[0].addEventListener("click", () => {
      current = (current - 1 + testimonials.length) % testimonials.length;
      render();
    });
    buttons[1].addEventListener("click", () => {
      current = (current + 1) % testimonials.length;
      render();
    });
  }

  function setupContactForm() {
    const form = $("#contactForm");
    if (!form || form.dataset.enhanced === "true") return;
    form.dataset.enhanced = "true";

    const params = new URLSearchParams(window.location.search);
    const selectedService = params.get("service");
    const subjectInput = $('input[placeholder="How can we help?"]', form);
    if (selectedService && subjectInput && !subjectInput.value) {
      subjectInput.value = selectedService;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const fields = $$("input, select, textarea", form);
      const values = fields.map((field) => field.value.trim());
      const [name, brand, email, phone, subject, message] = values;
      const submit = $('button[type="submit"]', form);

      if (!name || !email || !phone || !subject || !message) {
        showToast("Check the form", "Please fill all required fields before sending.", "error");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast("Invalid email", "Please enter a valid email address.", "error");
        return;
      }

      const original = submit.innerHTML;
      submit.disabled = true;
      submit.innerHTML = 'Preparing WhatsApp... <i class="fa-solid fa-circle-notch fa-spin"></i>';

      const text = [
        "New repair request from INFINOWA website",
        `Name: ${name}`,
        `Brand: ${brand}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Subject: ${subject}`,
        `Message: ${message}`,
      ].join("\n");

      setTimeout(() => {
        showToast("Request ready", "WhatsApp will open with your repair details.", "success");
        window.open(`https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(text)}`, "_blank");
        submit.disabled = false;
        submit.innerHTML = original;
        form.reset();
      }, 700);
    });
  }

  function setupImageFallbacks() {
    $$("img").forEach((img) => {
      img.addEventListener("error", () => {
        if (img.dataset.fallbackApplied) return;
        img.dataset.fallbackApplied = "true";
        img.src = "image/logo.png";
        img.classList.add("object-contain", "bg-slate-50", "p-4");
      });
    });
  }

  function setupUsedLaptopPage() {
    const cards = $$("[data-used-card]");
    if (!cards.length) return;

    const search = $("#usedSearch");
    const brandFilter = $("#usedBrandFilter");
    const resultCount = $("#usedResultCount");
    const emptyState = $("#usedEmptyState");

    const applyFilters = () => {
      const query = (search ? search.value : "").trim().toLowerCase();
      const brand = brandFilter ? brandFilter.value : "all";
      let visible = 0;

      cards.forEach((card) => {
        const matchesBrand = brand === "all" || card.dataset.brand === brand;
        const matchesQuery = !query || card.textContent.toLowerCase().includes(query);
        const show = matchesBrand && matchesQuery;
        card.classList.toggle("hidden", !show);
        if (show) visible += 1;
      });

      if (resultCount) resultCount.textContent = String(visible);
      if (emptyState) emptyState.classList.toggle("hidden", visible !== 0);
    };

    if (search) search.addEventListener("input", applyFilters);
    if (brandFilter) brandFilter.addEventListener("change", applyFilters);

    $$("[data-used-enquire]").forEach((button) => {
      button.addEventListener("click", () => {
        const card = button.closest("[data-used-card]");
        const title = card ? card.dataset.title : "Used Laptop";
        window.location.href = `contact.html?service=${encodeURIComponent(`Used Laptop Enquiry - ${title}`)}`;
      });
    });

    applyFilters();
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupMobileMenu();
    setupRepairsMenu();
    setupButtonActions();
    setupActiveNav();
    setupFaq();
    setupTestimonials();
    setupContactForm();
    setupImageFallbacks();
    setupUsedLaptopPage();
  });
})();
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("serviceModal");
  const modalBox = modal.querySelector(".transform");
  const closeModalBtn = document.getElementById("closeModal");
  
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");

  // Open Modal function
  const openModal = (card) => {
    // Read parameters dynamically from clicked elements
    const imgSrc = card.getAttribute("data-img");
    const titleText = card.getAttribute("data-title");
    const descText = card.getAttribute("data-desc");

    // Assign data to modal nodes
    modalImage.src = imgSrc;
    modalTitle.textContent = titleText;
    modalDesc.textContent = descText;

    // Trigger visual transitions safely via class changes
    modal.classList.remove("opacity-0", "pointer-events-none");
    modalBox.classList.remove("scale-95");
    modalBox.classList.add("scale-100");
    document.body.style.overflow = "hidden"; // Prevents background body scrolling
  };

  // Close Modal function
  const closeModal = () => {
    modal.classList.add("opacity-0", "pointer-events-none");
    modalBox.classList.remove("scale-100");
    modalBox.classList.add("scale-95");
    document.body.style.overflow = ""; // Restores background scrolling
  };

  // Attach event listeners to all card click instances
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("click", () => openModal(card));
  });

  // Structural closing actions (clicking button or mask background area)
  closeModalBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Keyboard accessibility feature (close via Escape button click)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("opacity-0")) {
      closeModal();
    }
  });
});
function openModal(title, desc, image) {
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalDesc").textContent = desc;
    document.getElementById("modalImg").src = image;

    document.getElementById("serviceModal")
        .classList.remove("hidden");
}

function closeModal() {
    document.getElementById("serviceModal")
        .classList.add("hidden");
}