document.addEventListener("DOMContentLoaded", function () {
  const productRadios = document.querySelectorAll('input[name="product"]');

  const songSection = document.getElementById("songSection");
  const cardSection = document.getElementById("cardSection");
  const mailSection = document.getElementById("mailSection");

  const occasionSelect = document.getElementById("occasion");
  const otherOccasionBox = document.getElementById("otherOccasionBox");
  const otherOccasionInput = document.getElementById("otherOccasion");

  const mailChoice = document.getElementById("mailChoice");

  const summaryProduct = document.getElementById("summaryProduct");
  const summaryPrice = document.getElementById("summaryPrice");
  const summaryTotal = document.getElementById("summaryTotal");
  const payButton = document.getElementById("payButton");

  const orderForm = document.getElementById("momentOrderForm");

  function hideConditionalSections() {
    songSection.style.display = "none";
    cardSection.style.display = "none";
    mailSection.style.display = "none";
  }

  productRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      const productName = this.dataset.name;
      const productPrice = parseFloat(this.dataset.price).toFixed(2);
      const productValue = this.value;

      summaryProduct.textContent = productName;
      summaryPrice.textContent = "$" + productPrice;
      summaryTotal.textContent = "$" + productPrice;

      payButton.classList.remove("disabled");
      payButton.setAttribute("aria-disabled", "false");

      hideConditionalSections();

      if (productValue === "song") {
        songSection.style.display = "block";
      }

      if (productValue === "card") {
        cardSection.style.display = "block";
      }

      if (productValue === "bundle") {
        songSection.style.display = "block";
        cardSection.style.display = "block";
      }
    });
  });

  if (occasionSelect) {
    occasionSelect.addEventListener("change", function () {
      if (this.value === "Other") {
        otherOccasionBox.style.display = "block";
        otherOccasionInput.required = true;
      } else {
        otherOccasionBox.style.display = "none";
        otherOccasionInput.required = false;
        otherOccasionInput.value = "";
      }
    });
  }

  if (mailChoice) {
    mailChoice.addEventListener("change", function () {
      if (this.value === "customer" || this.value === "recipient") {
        mailSection.style.display = "block";
      } else {
        mailSection.style.display = "none";
      }
    });
  }

  if (orderForm) {
    orderForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const selectedProduct = document.querySelector('input[name="product"]:checked');

      if (!selectedProduct) {
        alert("Please choose what you would like to order.");
        return;
      }

      alert("Your order form is ready. Payment connection is the next step.");
    });
  }
});
