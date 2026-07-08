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

        if (filter === "all" || category === filter) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("exampleModal");
  const modalBody = document.getElementById("exampleModalBody");
  const closeBtn = document.getElementById("closeExampleModal");
  const links = document.querySelectorAll(".example-modal-link");

  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const type = this.dataset.type;
      const src = this.dataset.src;

      if (type === "image") {
        modalBody.innerHTML = `<img src="${src}" alt="Example">`;
      }

      if (type === "audio") {
        modalBody.innerHTML = `<audio controls autoplay><source src="${src}"></audio>`;
      }

      if (type === "video") {
        modalBody.innerHTML = `<video controls autoplay><source src="${src}"></video>`;
      }

      modal.classList.add("active");
    });
  });

  closeBtn.addEventListener("click", function () {
    modal.classList.remove("active");
    modalBody.innerHTML = "";
  });

  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.classList.remove("active");
      modalBody.innerHTML = "";
    }
  });
});
