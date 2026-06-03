// if on desktop sidebar is open by default, but on mobile it's closed by default, and can be toggled by the menu button.

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

function syncNavToViewport() {
  if (!menuToggle || !nav) return;

  const isDesktop = window.innerWidth >= 768 && window.innerHeight >= 500;
  menuToggle.classList.toggle("is-open", isDesktop);
  menuToggle.setAttribute("aria-pressed", String(isDesktop));
  nav.classList.toggle("closed", !isDesktop);
}

document.addEventListener("DOMContentLoaded", syncNavToViewport);
window.addEventListener("resize", syncNavToViewport);

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.classList.toggle("is-open");
    menuToggle.setAttribute("aria-pressed", String(isOpen));
    nav.classList.toggle("closed");
  });
}


// this will link all the JS modules.

// Get input field values (what user typed)

class Email {
  constructor(name, subject, email, message) {
    this.name = name;
    this.subject = subject;
    this.email = email;
    this.message = message;
  }
}

// this will recive the form container
function fetchEmail(form_container) {
  
  const inputs = form_container.querySelectorAll("#contactForm input");
  const message_contaner = form_container.querySelector("#contactForm textarea");

  let name, subject, email, message;

  inputs.forEach((input) => {
    if (input.id === "name") name = input.value;
    if (input.id === "subject") subject = input.value;
    if (input.id === "email") email = input.value;
  });

  message = message_contaner.value;

  return new Email(name, subject, email, message);
}


// Handle form submission

const form = document.getElementById("contactForm");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent default form submission behavior

  form.classList.add('submitted');      

  const emailData = fetchEmail(form);

  // For demonstration, we'll just log the email data to the console
  console.log("Email Data:", emailData);

  // todo: allow functionality to actually send email to you
});


