document.addEventListener("DOMContentLoaded", function () {
  const productRadios = document.querySelectorAll('input[name="product"]');

  const summaryProduct = document.getElementById("summaryProduct");
  const summaryPrice = document.getElementById("summaryPrice");
  const summaryTotal = document.getElementById("summaryTotal");

  const songSection = document.getElementById("songSection");
  const cardSection = document.getElementById("cardSection");
  const mailSection = document.getElementById("mailSection");

  const occasion = document.getElementById("occasion");
  const otherOccasionBox = document.getElementById("otherOccasionBox");
  const otherOccasion = document.getElementById("otherOccasion");

  const songStyle = document.getElementById("songStyle");
  const otherSongStyleBox = document.getElementById("otherSongStyleBox");
  const otherSongStyle = document.getElementById("otherSongStyle");

  const mailChoice = document.getElementById("mailChoice");

  function hideOptionalSections() {
    if (songSection) songSection.style.display = "none";
    if (cardSection) cardSection.style.display = "none";
    if (mailSection) mailSection.style.display = "none";
  }

  productRadios.forEach(function (radio) {
    radio.addEventListener("change", function () {
      const productName = this.dataset.name || "Selected product";
      const productPrice = Number(this.dataset.price || 0);
      const productValue = this.value;

      if (summaryProduct) summaryProduct.textContent = productName;
      if (summaryPrice) summaryPrice.textContent = "$" + productPrice.toFixed(2);
      if (summaryTotal) summaryTotal.textContent = "$" + productPrice.toFixed(2);

      hideOptionalSections();

      if (productValue === "song" && songSection) {
        songSection.style.display = "block";
      }

      if (productValue === "card" && cardSection) {
        cardSection.style.display = "block";
      }

      if (productValue === "bundle") {
        if (songSection) songSection.style.display = "block";
        if (cardSection) cardSection.style.display = "block";
      }
    });
  });

  if (occasion && otherOccasionBox && otherOccasion) {
    occasion.addEventListener("change", function () {
      if (this.value === "Other") {
        otherOccasionBox.style.display = "block";
        otherOccasion.required = true;
      } else {
        otherOccasionBox.style.display = "none";
        otherOccasion.required = false;
        otherOccasion.value = "";
      }
    });
  }

  if (songStyle && otherSongStyleBox && otherSongStyle) {
    songStyle.addEventListener("change", function () {
      if (this.value === "Other") {
        otherSongStyleBox.style.display = "block";
        otherSongStyle.required = true;
      } else {
        otherSongStyleBox.style.display = "none";
        otherSongStyle.required = false;
        otherSongStyle.value = "";
      }
    });
  }

  if (mailChoice && mailSection) {
    mailChoice.addEventListener("change", function () {
      mailSection.style.display =
        this.value === "customer" || this.value === "recipient"
          ? "block"
          : "none";
    });
  }
});
