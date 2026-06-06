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

function dismissToast(toast) {
  toast.classList.remove("show");
  setTimeout(() => toast.remove(), 300);
}

function showToast(msg, type, noAutoDismiss = false) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = msg;

  toast.addEventListener("click", () => dismissToast(toast));

  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add("show"));
  });
  if (type === "success") {
    if (!noAutoDismiss) {
      setTimeout(() => dismissToast(toast), 4000);
    }
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
    
    document.querySelectorAll(".toast.sending").forEach((t) => t.remove());

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
    document.querySelectorAll(".toast.sending").forEach((t) => t.remove());
    showToast(
      'Network error. <a href="mailto:ch.arslanad+portfolio@gmail.com">Email me directly</a>',
      "error"
    );
  }
}
// if form exists

if (form) {
  form.addEventListener("submit", handleSubmit);
}


// Nav section switching

const homeSection = document.getElementById("home");
const contactSection = document.getElementById("contact");
// add more sections
const navLinks = document.querySelectorAll(".nav-links a");

function switchSection(targetId) {
  homeSection.classList.toggle("hidden", targetId !== "home");
  contactSection.classList.toggle("hidden", targetId !== "contact");
  navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${targetId}`));
  console.log("switchSection", targetId + " is", "hidden:", contactSection.classList.contains("hidden"));

  if (window.innerWidth < 768) {
    menuToggle.classList.remove("is-open");
    nav.classList.add("closed");
  }
}

navLinks.forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href").slice(1); // get attribute & removing the #
    if (id === "home" || id === "contact") {
      e.preventDefault();
      switchSection(id);
    }
  });
});


// time
const timeElement = document.querySelector(".date");

function getTime() {
  const time = new Date();
  timeElement.textContent = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  }) + ',' + time.getFullYear();
}

setInterval(getTime, 1000);