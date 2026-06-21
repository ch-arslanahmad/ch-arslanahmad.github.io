// Default: open on desktop (≥768px, ≥500px height), closed on mobile.

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

let beforeDesktop;

/**
 * Adjust nav/menu state with current screen size (open in Desktop, closed in mobile).
 * @returns {void}
 */
function autoSyncNavToScreenSize() {
  if (!menuToggle || !nav) return;

  const nowDesktop = window.innerWidth >= 768 && window.innerHeight >= 500;

  if (beforeDesktop === nowDesktop) return;
  beforeDesktop = nowDesktop;

  if (nowDesktop) {
    menuToggle.classList.add("is-open");
    nav.classList.remove("closed");
    return;
  }
    menuToggle.classList.remove("is-open");
    nav.classList.add("closed");
}



document.addEventListener("DOMContentLoaded", autoSyncNavToScreenSize);
window.addEventListener("resize", autoSyncNavToScreenSize);

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("is-open");
  nav.classList.toggle("closed");
});


// Handle form submission via Web3Forms

/**
 * Dismiss a toast element (due to CSS animation) and thenremove it from the DOM.
 * @param {HTMLElement} toast - Toast element to dismiss.
 * @returns {void}
 */
function dismissToast(toast) {
  toast.classList.remove("show");
  setTimeout(() => toast.remove(), 500);
}

/**
 * Create and display a toast message.
 * @param {string} msg - HTML string to show inside the toast.
 * @param {'success'|'error'|'sending'|'info'} type - Styling type for the toast.
 * @param {boolean} [noAutoDismiss=false] - If true, success toasts won't auto-dismiss, made for debugging.
 * @returns {void}
 */
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
      setTimeout(() => dismissToast(toast), 3000);
    }
  }
}

// Expose for console testing
window.showToast = showToast;

const form = document.getElementById("contactForm");



/**
 * Handle form submission via Web3Forms API.
 * Prevents default submit, posts JSON payload, and shows toasts for status.
 * @param {Event} e - Submit event from the form.
 * @returns {Promise<void>}
 */
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


const sections = document.querySelectorAll("section[id]");
// add more sections
const navLinks = document.querySelectorAll(".nav-links a");

// UPDATE active nav link on SCROLL
const observer = new IntersectionObserver((entries) => { // you recive all entries
  entries.forEach((entry) => { // loop over each entry
    if (entry.isIntersecting) { // if the section is in view
      const id = entry.target.id;
      navLinks.forEach((a) => { // get all the nav links
        a.classList.toggle("active", a.getAttribute("href").slice(1) === id); // if the entry id is equal to the nav link
      });
    }
  });
}, { threshold: 0.1 }); // fires as soon as any part of a section enters the viewport

// observe each section & implement the property of the observer
sections.forEach((s) => observer.observe(s));

// Move the section to the nav link when clicked (smooth scroll)
navLinks.forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault(); // prevent browser from instantly jumping to the anchor
    const id = a.getAttribute("href").slice(1); // get attribute & removing the #
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    navLinks.forEach(l => {
      if (l !== a) {
        l.classList.remove("active"); // remove active state from other links
      }
    });
    a.classList.add("active");
    if (window.innerWidth < 768) { // if on mobile close the menu after clicking
      menuToggle.classList.remove("is-open");
      nav.classList.add("closed");
    }
  });
});

// time
const timeElement = document.querySelector(".date");

/**
 * Update the `.date` element with the current localized time and year.
 * @returns {void}
 */
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



// == Syntax Highlighting for Code Block ==

/**
 * Simple syntax highlighter that wraps matched tokens in span elements.
 * @param {string} code - Source code to highlight.
 * @returns {string} HTML string with syntax spans.
 */
function highlight(code) {

  // regex to match all the code components
  const commentGroup = /(\/\/.*$|\/\*[\s\S]*?\*\/)/;
  const strGroup = /(".*?"|'.*?')/;
  const numGroup = /(\b\d+\b)/;
  const kwGroup = /\b(const|let|var|function|if|else|for|while|return|class|new|this)\b/;
  const bracketStr = /([\[\]{}()])/g;
  const opStr = /([.,;:=!<>?+\-*/&|])/g;
  const funcStr = /(\b[a-zA-Z_]\w*\b)(?=\()/g;

  // combine all regex
  const combined = new RegExp(
    `${commentGroup.source}|${strGroup.source}|${numGroup.source}|${kwGroup.source}|${bracketStr.source}|${opStr.source}|${funcStr.source}`,
    'gm'
  );

  // syntax highlight first
  const highlighted = code.replace(combined, (match, comment, str, num, kw, bracket, op, func) => {
    if (comment) return `<span class="c-comment">${comment}</span>`;
    if (str) return `<span class="c-str">${str}</span>`;
    if (num) return `<span class="c-num">${num}</span>`;
    if (kw) return `<span class="c-kw">${kw}</span>`;
    if (bracket) return `<span class="c-bracket">${bracket}</span>`;
    if (op) return `<span class="c-rand">${op}</span>`;
    if (func) return `<span class="c-func">${func}</span>`;
    return match;
  });

  // split into lines with gutter
  const lines = highlighted.split("\n");
  const gutter = lines.map((_, i) => `<div>${i + 1}</div>`).join('');
  const content = lines.map(line => `<div>${line || "&nbsp;"}</div>`).join('');

  return `
    <div class="gutter">${gutter}</div>
    <div class="code-content">${content}</div>
  `;
}

const heroCode = `const arslan = {
  status: "building",
  approach: "build it, break it, understand why",
  stack: ["HTML", "CSS", "JS"],
  skills: ["]
  pretending_to_know: false
};

function buildSomething(idea) {
  return idea + "✦";
}`;

const heroEditor = document.querySelector("#hero-code");
if (heroEditor) {
  heroEditor.innerHTML = highlight(heroCode);
}

showToast("Operation in progress", "success", true)

// == SHOWCASE section ==


// ... Showcase section switching (projects, skills, tools, ideas)

const showcase_items = document.querySelectorAll(".showcase-options ul li a");
const showcase_sections = document.querySelectorAll(".showcase-items > div"); // all children of showcase (projects, skills, tools, ideas)



// for scrolling showcase sections (projects, skills, tools, ideas) and updating active state of the buttons
const newobserver = new IntersectionObserver((entries) => { // you recive all entries

  entries.forEach((entry) => { // loop over each entry

    if (entry.isIntersecting) {
      const id = entry.target.id;

      showcase_items.forEach((a) => { // get all the showcase buttons
        a.classList.toggle("active", a.getAttribute("href").slice(1) === id); // if the entry id is equal to the showcase button
      });

    }
  });
}, { threshold: 0.3 }); // fires as soon as any part of a section enters the viewport

// observe each showcase section & implement the property of the observer
showcase_sections.forEach((s) => newobserver.observe(s));



  showcase_items.forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const id = el.getAttribute("href").slice(1);

      document.getElementById(id).scrollIntoView({behaviour: "smooth"});

      el.classList.toggle("active"); // makes the clicked button into active state

      showcase_items.forEach((item) => {
        if (item !== el) {
          item.classList.remove("active"); // remove active state from other buttons
        }
      });

    });
  });
