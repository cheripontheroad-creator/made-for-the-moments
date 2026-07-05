document.addEventListener("DOMContentLoaded", function () {
  const productRadios = document.querySelectorAll('input[name="product"]');
  const totalPrice = document.getElementById("orderTotal");

  const songSection = document.getElementById("songSection");
  const cardSection = document.getElementById("cardSection");
  const mailSection = document.getElementById("mailSection");
  const otherOccasionBox = document.getElementById("otherOccasionBox");

  const occasionSelect = document.getElementById("occasion");
  const mailChoice = document.getElementById("mailChoice");
  const orderForm = document.getElementById("customOrderForm");

  const prices = {
    song: 24.99,
    card: 7.99,
    bundle: 29.99
  };

  function hideSections() {
    if (songSection) songSection.style.display = "none";
    if (cardSection) cardSection.style.display = "none";
    if (mailSection) mailSection.style.display = "none";
  }

  productRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      const value = this.value;

      if (totalPrice && prices[value]) {
        totalPrice.textContent = "$" + prices[value].toFixed(2);
      }

      hideSections();

      if (value === "song") {
        songSection.style.display = "block";
      }

      if (value === "card") {
        cardSection.style.display = "block";
      }

      if (value === "bundle") {
        songSection.style.display = "block";
        cardSection.style.display = "block";
      }
    });
  });

  if (occasionSelect) {
    occasionSelect.addEventListener("change", function () {
      if (this.value === "Other") {
        otherOccasionBox.style.display = "block";
        document.getElementById("otherOccasion").required = true;
      } else {
        otherOccasionBox.style.display = "none";
        document.getElementById("otherOccasion").required = false;
        document.getElementById("otherOccasion").value = "";
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
        alert("Please select what you would like to order.");
        return;
      }

      alert("Thank you! Payment setup is the next step.");
    });
  }
});
