document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("requestForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const lines = [];

  lines.push("New Personalized Creation Request");
  lines.push("--------------------------------");
  lines.push("");

  for (const [key, value] of formData.entries()) {
    if (key === "Permission") continue;
    lines.push(`${key}: ${value || "Not provided"}`);
  }

  const subject = encodeURIComponent("Personalized Creation Request");
  const body = encodeURIComponent(lines.join("\n"));

  // IMPORTANT: Replace this email address with your real business email.
  window.location.href = `mailto:cheripontheroad@gmail.com?subject=${subject}&body=${body}`;
});
const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.getAttribute("data-filter");

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    galleryItems.forEach((item) => {
      const category = item.getAttribute("data-category");

      if (filter === "all" || category === filter) {
        item.classList.remove("hide");
      } else {
        item.classList.add("hide");
      }
    });
  });
});
