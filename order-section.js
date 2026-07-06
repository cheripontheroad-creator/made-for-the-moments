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
  const payButton = document.getElementById("payButton");

  function hideOptionalSections() {
    if (songSection) songSection.style.display = "none";
    if (cardSection) cardSection.style.display = "none";
    if (mailSection) mailSection.style.display = "none";
  }

  productRadios.forEach(function (radio) {
    radio.addEventListener("change", function () {
      const productName = this.dataset.name || "Selected Product";
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
      if (this.value === "customer" || this.value === "recipient") {
        mailSection.style.display = "block";
      } else {
        mailSection.style.display = "none";
      }
    });
  }

  if (payButton) {
    payButton.addEventListener("click", async function (e) {
      e.preventDefault();

      const selectedProduct = document.querySelector('input[name="product"]:checked');

      if (!selectedProduct) {
        alert("Please select a product.");
        return;
      }

      payButton.textContent = "Opening Checkout...";

      try {
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            product: selectedProduct.value
          })
        });

        const data = await response.json();

        if (data.url) {
          window.location.href = data.url;
        } else {
          console.error(data);
          alert("Unable to start checkout.");
          payButton.textContent = "Continue to Payment";
        }
      } catch (err) {
        console.error(err);
        alert("Error connecting to Stripe.");
        payButton.textContent = "Continue to Payment";
      }
    });
  }
});
