// Nav email icon: copies the address and confirms in its tooltip (and to screen readers).
// The clipboard is only allowed on https and localhost, so elsewhere it opens the email app instead.
const emailButton = document.querySelector(".nav-email");
const emailStatus = document.querySelector(".nav-email-status");

emailButton?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(emailButton.dataset.email);
  } catch {
    location.href = `mailto:${emailButton.dataset.email}`;
    return;
  }
  emailButton.dataset.tip = "copied!";
  emailStatus.textContent = "Email address copied";
});

// back to the hint once the pointer or keyboard focus moves away
for (const type of ["pointerleave", "blur"]) {
  emailButton?.addEventListener(type, () => {
    emailButton.dataset.tip = "copy email";
    emailStatus.textContent = "";
  });
}
