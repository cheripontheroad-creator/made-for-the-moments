document.addEventListener("DOMContentLoaded", function () {
  const steps = Array.from(document.querySelectorAll(".wizard-step"));
  const nextBtn = document.getElementById("nextStep");
  const prevBtn = document.getElementById("prevStep");
  const stepCounter = document.getElementById("stepCounter");
  const stepTitle = document.getElementById("stepTitle");
  const progressFill = document.getElementById("progressFill");
  const wizardForm = document.querySelector(".wizard-form");

  const productRadios = document.querySelectorAll('input[name="product"]');
  const summaryProduct = document.getElementById("summaryProduct");
  const summaryPrice = document.getElementById("summaryPrice");
  const summaryTotal = document.getElementById("summaryTotal");

  const occasion = document.getElementById("occasion");
  const otherOccasionBox = document.getElementById("otherOccasionBox");
  const otherOccasion = document.getElementById("otherOccasion");

  const songStyle = document.getElementById("songStyle");
  const otherSongStyleBox = document.getElementById("otherSongStyleBox");
  const otherSongStyle = document.getElementById("otherSongStyle");

  const mailChoice = document.getElementById("mailChoice");
  const payButton = document.getElementById("payButton");
  const termsCheckbox = document.getElementById("termsCheckbox");

  const answerMap = {
    customerName: document.getElementById("customerName"),
    customerEmail: document.getElementById("customerEmail"),
    recipientName: document.getElementById("recipientName"),
    occasion: document.getElementById("occasion"),
    requestedDate: document.getElementById("requestedDate"),
    songStyle: document.getElementById("songStyle"),
    songMood: document.getElementById("songMood"),
    vocalStyle: document.getElementById("vocalStyle"),
    cardStyle: document.getElementById("cardStyle"),
    mailChoice: document.getElementById("mailChoice")
  };

  let currentStepIndex = 0;
  let initialized = false;

  function selectedProductValue() {
    const selected = document.querySelector('input[name="product"]:checked');
    return selected ? selected.value : "";
  }

  function getVisibleSteps() {
    const product = selectedProductValue();

    return steps.filter(function (step) {
      const allowedProducts = step.dataset.product;
      if (!allowedProducts) return true;
      if (!product) return false;
      return allowedProducts.split(",").includes(product);
    });
  }

  function updateStepDisplay(shouldScroll = false) {
    const visibleSteps = getVisibleSteps();

    if (currentStepIndex >= visibleSteps.length) {
      currentStepIndex = visibleSteps.length - 1;
    }

    if (currentStepIndex < 0) {
      currentStepIndex = 0;
    }

    steps.forEach(function (step) {
      step.classList.remove("active");
    });

    const activeStep = visibleSteps[currentStepIndex];
    if (!activeStep) return;

    activeStep.classList.add("active");

    if (stepCounter) {
      stepCounter.textContent =
        "Step " + (currentStepIndex + 1) + " of " + visibleSteps.length;
    }

    if (stepTitle) {
      stepTitle.textContent = activeStep.dataset.title || "";
    }

    if (progressFill) {
      progressFill.style.width =
        ((currentStepIndex + 1) / visibleSteps.length * 100) + "%";
    }

    if (prevBtn) {
      prevBtn.disabled = currentStepIndex === 0;
    }

    if (nextBtn) {
      nextBtn.style.display =
        currentStepIndex === visibleSteps.length - 1 ? "none" : "inline-block";
    }

    if (shouldScroll && initialized && wizardForm) {
      wizardForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    initialized = true;
  }

  function validateCurrentStep() {
    const visibleSteps = getVisibleSteps();
    const activeStep = visibleSteps[currentStepIndex];
    if (!activeStep) return true;

    const requiredFields = activeStep.querySelectorAll(
      "input[required], select[required], textarea[required]"
    );

    for (const field of requiredFields) {
      if (field.type === "radio") {
        const group = activeStep.querySelectorAll('input[name="' + field.name + '"]');
        if (![...group].some((radio) => radio.checked)) {
          field.reportValidity();
          return false;
        }
      } else if (field.type === "file") {
        if (field.files.length === 0) {
          field.reportValidity();
          return false;
        }
      } else if (!field.value) {
        field.reportValidity();
        return false;
      }
    }

    const product = selectedProductValue();

    if ((product === "song" || product === "bundle") && activeStep.id === "songSection") {
      for (const id of ["songStyle", "songMood", "vocalStyle"]) {
        const field = document.getElementById(id);
        if (field && !field.value) {
          field.reportValidity();
          return false;
        }
      }
    }

    if ((product === "card" || product === "bundle") && activeStep.id === "cardSection") {
      for (const id of ["cardStyle", "mailChoice"]) {
        const field = document.getElementById(id);
        if (field && !field.value) {
          field.reportValidity();
          return false;
        }
      }

      const photos = document.getElementById("cardPhotos");
      if (photos && photos.files.length === 0) {
        alert("Please upload at least one photo for the greeting card.");
        return false;
      }
    }

    return true;
  }

  function updateProductSummary() {
    const selected = document.querySelector('input[name="product"]:checked');

    if (!selected) {
      if (summaryProduct) summaryProduct.textContent = "No product selected";
      if (summaryPrice) summaryPrice.textContent = "$0.00";
      if (summaryTotal) summaryTotal.textContent = "$0.00";
      return;
    }

    const productName = selected.dataset.name || "Selected Product";
    const productPrice = Number(selected.dataset.price || 0);

    if (summaryProduct) summaryProduct.textContent = productName;
    if (summaryPrice) summaryPrice.textContent = "$" + productPrice.toFixed(2);
    if (summaryTotal) summaryTotal.textContent = "$" + productPrice.toFixed(2);
  }

  function updateAnswers() {
    Object.keys(answerMap).forEach(function (key) {
      const field = answerMap[key];
      const target = document.querySelector('[data-answer="' + key + '"]');
      if (!field || !target) return;

      let value = field.value || "â€”";
      if (field.tagName === "SELECT" && field.selectedOptions.length) {
        value = field.selectedOptions[0].textContent || value;
      }
      target.textContent = value;
    });
  }

  productRadios.forEach(function (radio) {
    radio.addEventListener("change", function () {
      updateProductSummary();
      currentStepIndex = 0;
      updateStepDisplay(false);
      updateAnswers();
    });
  });

  document.querySelectorAll("input, select, textarea").forEach(function (field) {
    field.addEventListener("input", updateAnswers);
    field.addEventListener("change", updateAnswers);
  });

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      if (!validateCurrentStep()) return;
      currentStepIndex += 1;
      updateStepDisplay(true);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      currentStepIndex -= 1;
      updateStepDisplay(true);
    });
  }

  if (occasion && otherOccasionBox && otherOccasion) {
    occasion.addEventListener("change", function () {
      if (this.value === "Other") {
        otherOccasionBox.style.display = "flex";
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
        otherSongStyleBox.style.display = "flex";
        otherSongStyle.required = true;
      } else {
        otherSongStyleBox.style.display = "none";
        otherSongStyle.required = false;
        otherSongStyle.value = "";
      }
    });
  }

  if (termsCheckbox && payButton) {
    payButton.classList.add("disabled");
    payButton.setAttribute("aria-disabled", "true");

    termsCheckbox.addEventListener("change", function () {
      if (this.checked) {
        payButton.classList.remove("disabled");
        payButton.removeAttribute("aria-disabled");
      } else {
        payButton.classList.add("disabled");
        payButton.setAttribute("aria-disabled", "true");
      }
    });
  }

  if (payButton) {
    payButton.addEventListener("click", async function (e) {
      e.preventDefault();

      if (termsCheckbox && !termsCheckbox.checked) {
        alert("Please accept the terms before continuing.");
        return;
      }

      const selectedProduct = document.querySelector('input[name="product"]:checked');

      if (!selectedProduct) {
        alert("Please select a product.");
        return;
      }

      payButton.textContent = "Opening Secure Checkout...";
      payButton.classList.add("disabled");

      try {
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product: selectedProduct.value })
        });

        const data = await response.json();

        if (data.url) {
          window.location.href = data.url;
        } else {
          console.error(data);
          alert("Unable to start checkout.");
          payButton.classList.remove("disabled");
          payButton.textContent = "Complete Secure Checkout";
        }
      } catch (err) {
        console.error(err);
        alert("Error connecting to Stripe.");
        payButton.classList.remove("disabled");
        payButton.textContent = "Complete
 Secure Checkout";
      }
    });
  }

  updateProductSummary();
  updateAnswers();
  updateStepDisplay(false);
});
