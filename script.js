if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("pageshow", function () {
  window.scrollTo(0, 0);
});

document.addEventListener("DOMContentLoaded", function () {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-link-list .gallery-item");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const filter = button.getAttribute("data-filter");

      filterButtons.forEach(function (btn) {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      galleryItems.forEach(function (item) {
        const category = item.getAttribute("data-category");
        item.style.display = filter === "all" || category === filter ? "block" : "none";
      });
    });
  });

  const modal = document.getElementById("exampleModal");
  const modalBody = document.getElementById("exampleModalBody");
  const closeBtn = document.getElementById("closeExampleModal");
  const links = document.querySelectorAll(".example-modal-link");

  function closeModal() {
    if (!modal || !modalBody) return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    modalBody.innerHTML = "";
  }

  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      if (!modal || !modalBody) return;

      const type = this.dataset.type;
      const src = this.dataset.src;
      const title = this.textContent.trim();

      if (type === "image") {
        modalBody.innerHTML = `<img src="${src}" alt="${title}">`;
      }

      if (type === "audio") {
        modalBody.innerHTML = `<h3>${title}</h3><audio controls autoplay><source src="${src}"></audio>`;
      }

      if (type === "video") {
        modalBody.innerHTML = `<video controls autoplay><source src="${src}"></video>`;
      }

      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });
});
