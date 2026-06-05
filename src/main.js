// Default: open on desktop (≥768px, ≥500px height), closed on mobile.
// Manual click overrides auto-behavior until breakpoint is crossed.

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

let prevScreenIsDesktop = window.innerWidth >= 768 && window.innerHeight >= 500;
let navOverridden = false;

function autoSyncNavToScreenSize() {
  if (!menuToggle || !nav) return;

  const nowDesktop = window.innerWidth >= 768 && window.innerHeight >= 500;

  if (nowDesktop !== prevScreenIsDesktop) {
    prevScreenIsDesktop = nowDesktop;
    navOverridden = false;
  }

  if (!navOverridden) {
    menuToggle.classList.toggle("is-open", nowDesktop);
    nav.classList.toggle("closed", !nowDesktop);
  }
}

document.addEventListener("DOMContentLoaded", autoSyncNavToScreenSize);
window.addEventListener("resize", autoSyncNavToScreenSize);

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navOverridden = true;
    menuToggle.classList.toggle("is-open");
    nav.classList.toggle("closed");
  });
}


// Handle form submission via Web3Forms

function showToast(msg, type) {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = msg;

  toast.addEventListener("click", () => toast.remove());

  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("toast-visible"));

  if (type === "success") {
    setTimeout(() => {
      toast.classList.remove("toast-visible");
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

// Expose for console testing
window.showToast = showToast;

const form = document.getElementById("contactForm");



async function handleSubmit(e) {
  e.preventDefault();
  form.classList.add("submitted");

  const formData = new FormData(form);
  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);

  showToast("Sending...", "sending");


  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: json
    });
    
    document.querySelectorAll(".toast-sending").forEach((t) => t.remove());

    // if response not ok
    if (!res.ok) {
      showToast('Unexpected error. Please try again later or <a href="mailto:ch.arslanad+portfolio@gmail.com">Email me directly</a>', "error");
      return;
    }
    showToast("Message sent! I'll get back to you soon.", "success");
    form.reset();
    form.classList.remove("submitted");
    
  }
  catch (error) {
    document.querySelectorAll(".toast-sending").forEach((t) => t.remove());
    showToast(
      'Network error. <a href="mailto:ch.arslanad+portfolio@gmail.com">Email me directly</a>',
      "error"
    );
  }
}
// if form exists

if (form) {
}