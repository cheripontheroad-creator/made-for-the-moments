document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // =========================================================
  // ELEMENTS
  // =========================================================

  const steps = Array.from(document.querySelectorAll(".wizard-step"));

  const nextBtn = document.getElementById("nextStep");
  const prevBtn = document.getElementById("prevStep");

  const stepCounter = document.getElementById("stepCounter");
  const stepTitle = document.getElementById("stepTitle");
  const progressFill = document.getElementById("progressFill");

  const productRadios = document.querySelectorAll(
    'input[name="product"]'
  );

  const summaryProduct = document.getElementById("summaryProduct");
  const summaryPrice = document.getElementById("summaryPrice");
  const summaryTotal = document.getElementById("summaryTotal");

  const occasion = document.getElementById("occasion");
  const otherOccasionBox =
    document.getElementById("otherOccasionBox");
  const otherOccasion =
    document.getElementById("otherOccasion");

  const songStyle = document.getElementById("songStyle");
  const otherSongStyleBox =
    document.getElementById("otherSongStyleBox");
  const otherSongStyle =
    document.getElementById("otherSongStyle");

  const mailChoice = document.getElementById("mailChoice");

  const payButton = document.getElementById("payButton");
  const termsCheckbox =
    document.getElementById("termsCheckbox");

  const orderForm =
    document.getElementById("momentOrderForm");

  const wizardForm =
    document.querySelector(".wizard-form");

  const answerMap = {
    customerName:
      document.getElementById("customerName"),

    customerEmail:
      document.getElementById("customerEmail"),

    recipientName:
      document.getElementById("recipientName"),

    occasion:
      document.getElementById("occasion"),

    requestedDate:
      document.getElementById("requestedDate"),

    songStyle:
      document.getElementById("songStyle"),

    songMood:
      document.getElementById("songMood"),

    vocalStyle:
      document.getElementById("vocalStyle"),

    cardStyle:
      document.getElementById("cardStyle"),

    mailChoice:
      document.getElementById("mailChoice")
  };

  let currentStepIndex = 0;

  // =========================================================
  // HELPERS
  // =========================================================

  function getSelectedProduct() {
    return document.querySelector(
      'input[name="product"]:checked'
    );
  }

  function getSelectedProductValue() {
    const selected = getSelectedProduct();

    return selected ? selected.value : "";
  }

  function getValue(selector) {
    const field = document.querySelector(selector);

    return field
      ? String(field.value || "").trim()
      : "";
  }

  function getSelectedOptionText(field) {
    if (!field || field.tagName !== "SELECT") {
      return "";
    }

    const selectedOption =
      field.options[field.selectedIndex];

    if (!field.value || !selectedOption) {
      return "";
    }

    return selectedOption.text.trim();
  }

  function createOrderNumber() {
    const datePart = new Date()
      .toISOString()
      .slice(0, 10)
      .replaceAll("-", "");

    let randomPart;

    if (
      window.crypto &&
      typeof window.crypto.randomUUID === "function"
    ) {
      randomPart = window.crypto
        .randomUUID()
        .replaceAll("-", "")
        .slice(0, 6)
        .toUpperCase();
    } else {
      randomPart = Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase();
    }

    return `MFTM-${datePart}-${randomPart}`;
  }

  function scrollToQuestionArea() {
    if (!wizardForm) {
      return;
    }

    wizardForm.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  // =========================================================
  // VISIBLE STEPS
  // =========================================================

  function getVisibleSteps() {
    const product = getSelectedProductValue();

    return steps.filter(function (step) {
      const allowedProducts = step.dataset.product;

      if (!allowedProducts) {
        return true;
      }

      if (!product) {
        return false;
      }

      const products = allowedProducts
        .split(",")
        .map(function (item) {
          return item.trim();
        });

      return products.includes(product);
    });
  }

  function updateStepDisplay() {
    const visibleSteps = getVisibleSteps();

    if (!visibleSteps.length) {
      return;
    }

    if (currentStepIndex < 0) {
      currentStepIndex = 0;
    }

    if (currentStepIndex >= visibleSteps.length) {
      currentStepIndex = visibleSteps.length - 1;
    }

    steps.forEach(function (step) {
      step.classList.remove("active");
    });

    const activeStep =
      visibleSteps[currentStepIndex];

    if (!activeStep) {
      return;
    }

    activeStep.classList.add("active");

    if (stepCounter) {
      stepCounter.textContent =
        "Step " +
        (currentStepIndex + 1) +
        " of " +
        visibleSteps.length;
    }

    if (stepTitle) {
      stepTitle.textContent =
        activeStep.dataset.title || "";
    }

    if (progressFill) {
      const percentage =
        ((currentStepIndex + 1) /
          visibleSteps.length) *
        100;

      progressFill.style.width =
        percentage + "%";
    }

    if (prevBtn) {
      prevBtn.disabled =
        currentStepIndex === 0;
    }

    if (nextBtn) {
      nextBtn.style.display =
        currentStepIndex ===
        visibleSteps.length - 1
          ? "none"
          : "inline-block";
    }

    /*
     * Do not scroll here.
     * This function runs when the page first opens.
     */
  }

  // =========================================================
  // PRODUCT SUMMARY
  // =========================================================

  function updateProductSummary() {
    const selected = getSelectedProduct();

    if (!selected) {
      if (summaryProduct) {
        summaryProduct.textContent =
          "No product selected";
      }

      if (summaryPrice) {
        summaryPrice.textContent = "$0.00";
      }

      if (summaryTotal) {
        summaryTotal.textContent = "$0.00";
      }

      return;
    }

    const productName =
      selected.dataset.name ||
      "Selected Product";

    const productPrice =
      Number(selected.dataset.price || 0);

    if (summaryProduct) {
      summaryProduct.textContent =
        productName;
    }

    if (summaryPrice) {
      summaryPrice.textContent =
        "$" + productPrice.toFixed(2);
    }

    if (summaryTotal) {
      summaryTotal.textContent =
        "$" + productPrice.toFixed(2);
    }
  }

  // =========================================================
  // YOUR ANSWERS SIDEBAR
  // =========================================================

  function updateAnswers() {
    Object.keys(answerMap).forEach(
      function (key) {
        const field = answerMap[key];

        const target =
          document.querySelector(
            '[data-answer="' + key + '"]'
          );

        if (!field || !target) {
          return;
        }

        let displayText = "";

        if (field.tagName === "SELECT") {
          displayText =
            getSelectedOptionText(field);
        } else {
          displayText =
            String(field.value || "").trim();
        }

        target.textContent =
          displayText || "—";
      }
    );
  }

  // =========================================================
  // CONDITIONAL FIELDS
  // =========================================================

  function updateOtherOccasion() {
    if (
      !occasion ||
      !otherOccasionBox ||
      !otherOccasion
    ) {
      return;
    }

    const showOther =
      occasion.value === "Other";

    otherOccasionBox.style.display =
      showOther ? "flex" : "none";

    otherOccasion.required = showOther;

    if (!showOther) {
      otherOccasion.value = "";
    }
  }

  function updateOtherSongStyle() {
    if (
      !songStyle ||
      !otherSongStyleBox ||
      !otherSongStyle
    ) {
      return;
    }

    const showOther =
      songStyle.value === "Other";

    otherSongStyleBox.style.display =
      showOther ? "flex" : "none";

    otherSongStyle.required = showOther;

    if (!showOther) {
      otherSongStyle.value = "";
    }
  }

  // =========================================================
  // VALIDATION
  // =========================================================

  function validateRequiredFields(container) {
    const requiredFields = Array.from(
      container.querySelectorAll(
        "input[required], select[required], textarea[required]"
      )
    );

    for (const field of requiredFields) {
      if (field.disabled) {
        continue;
      }

      if (field.type === "radio") {
        const radioGroup =
          container.querySelectorAll(
            'input[name="' +
              field.name +
              '"]'
          );

        const hasSelection =
          Array.from(radioGroup).some(
            function (radio) {
              return radio.checked;
            }
          );

        if (!hasSelection) {
          field.reportValidity();
          return false;
        }
      } else if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }

    return true;
  }

  function validateProductFields(step) {
    const product =
      getSelectedProductValue();

    if (
      (product === "song" ||
        product === "bundle") &&
      step.id === "songSection"
    ) {
      const songFields = [
        document.getElementById("songStyle"),
        document.getElementById("songMood"),
        document.getElementById("vocalStyle")
      ];

      for (const field of songFields) {
        if (field && !field.value) {
          field.setCustomValidity(
            "Please complete this field."
          );

          field.reportValidity();
          field.setCustomValidity("");

          return false;
        }
      }
    }

    if (
      (product === "card" ||
        product === "bundle") &&
      step.id === "cardSection"
    ) {
      const cardFields = [
        document.getElementById("cardStyle"),
        document.getElementById("mailChoice")
      ];

      for (const field of cardFields) {
        if (field && !field.value) {
          field.setCustomValidity(
            "Please complete this field."
          );

          field.reportValidity();
          field.setCustomValidity("");

          return false;
        }
      }

      const photos =
        document.getElementById("cardPhotos");

      if (
        photos &&
        photos.files.length === 0
      ) {
        alert(
          "Please upload at least one photo for the greeting card."
        );

        photos.focus();
        return false;
      }
    }

    return true;
  }

  function validateCurrentStep() {
    const visibleSteps =
      getVisibleSteps();

    const activeStep =
      visibleSteps[currentStepIndex];

    if (!activeStep) {
      return true;
    }

    if (
      activeStep.dataset.step === "1" &&
      !getSelectedProductValue()
    ) {
      alert("Please select a product.");
      return false;
    }

    if (
      !validateRequiredFields(activeStep)
    ) {
      return false;
    }

    return validateProductFields(activeStep);
  }

  function validateAllSteps() {
    const visibleSteps =
      getVisibleSteps();

    for (
      let index = 0;
      index < visibleSteps.length;
      index += 1
    ) {
      const step = visibleSteps[index];

      if (
        step.dataset.step === "1" &&
        !getSelectedProductValue()
      ) {
        currentStepIndex = index;
        updateStepDisplay();
        scrollToQuestionArea();

        alert("Please select a product.");
        return false;
      }

      if (!validateRequiredFields(step)) {
        currentStepIndex = index;
        updateStepDisplay();
        scrollToQuestionArea();

        return false;
      }

      if (!validateProductFields(step)) {
        currentStepIndex = index;
        updateStepDisplay();
        scrollToQuestionArea();

        return false;
      }
    }

    return true;
  }

  // =========================================================
  // PRODUCT SELECTION EVENTS
  // =========================================================

  productRadios.forEach(function (radio) {
    radio.addEventListener(
      "change",
      function () {
        updateProductSummary();
        updateAnswers();

        currentStepIndex = 0;
        updateStepDisplay();
      }
    );
  });

  // =========================================================
  // ANSWER FIELD EVENTS
  // =========================================================

  document
    .querySelectorAll(
      "input, select, textarea"
    )
    .forEach(function (field) {
      field.addEventListener(
        "input",
        updateAnswers
      );

      field.addEventListener(
        "change",
        updateAnswers
      );
    });

  if (occasion) {
    occasion.addEventListener(
      "change",
      function () {
        updateOtherOccasion();
        updateAnswers();
      }
    );
  }

  if (songStyle) {
    songStyle.addEventListener(
      "change",
      function () {
        updateOtherSongStyle();
        updateAnswers();
      }
    );
  }

  if (mailChoice) {
    mailChoice.addEventListener(
      "change",
      updateAnswers
    );
  }

  // =========================================================
  // NEXT AND BACK BUTTONS
  // =========================================================

  if (nextBtn) {
    nextBtn.addEventListener(
      "click",
      function () {
        if (!validateCurrentStep()) {
          return;
        }

        currentStepIndex += 1;

        updateStepDisplay();
        scrollToQuestionArea();
      }
    );
  }

  if (prevBtn) {
    prevBtn.addEventListener(
      "click",
      function () {
        currentStepIndex -= 1;

        updateStepDisplay();
        scrollToQuestionArea();
      }
    );
  }

  // =========================================================
  // PAYMENT BUTTON
  // =========================================================

  function updatePaymentButtonState() {
    if (
      !payButton ||
      !termsCheckbox
    ) {
      return;
    }

    if (termsCheckbox.checked) {
      payButton.classList.remove(
        "disabled"
      );

      payButton.removeAttribute(
        "aria-disabled"
      );
    } else {
      payButton.classList.add(
        "disabled"
      );

      payButton.setAttribute(
        "aria-disabled",
        "true"
      );
    }
  }

  if (termsCheckbox) {
    termsCheckbox.addEventListener(
      "change",
      updatePaymentButtonState
    );
  }

  // =========================================================
  // BUILD ORDER DATA
  // =========================================================
function sanitizeFilename(filename) {
  return String(filename || "photo")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-");
}

async function createUploadAuthorization(
  orderNumber,
  customerEmail,
  product
) {
  const response = await fetch(
    "/api/create-upload-session",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        orderNumber,
        customerEmail,
        product
      })
    }
  );

  const result = await response.json();

  if (!response.ok || !result.uploadToken) {
    throw new Error(
      result.error ||
      "Photo uploads could not be authorized."
    );
  }

  return result.uploadToken;
}

async function uploadOrderPhotos({
  orderNumber,
  customerEmail,
  product,
  onProgress
}) {
  if (
    product !== "card" &&
    product !== "bundle"
  ) {
    return [];
  }

  const photoInput =
    document.getElementById("cardPhotos");

  const files = photoInput
    ? Array.from(photoInput.files)
    : [];

  if (!files.length) {
    throw new Error(
      "Please upload at least one greeting-card photo."
    );
  }

  if (
    typeof window.vercelBlobUpload !==
    "function"
  ) {
    throw new Error(
      "The photo-upload service has not finished loading. Please wait a moment and try again."
    );
  }

  const uploadToken =
    await createUploadAuthorization(
      orderNumber,
      customerEmail,
      product
    );

  const uploadedPhotos = [];

  for (
    let index = 0;
    index < files.length;
    index += 1
  ) {
    const file = files[index];

    if (typeof onProgress === "function") {
      onProgress(index + 1, files.length);
    }

    const safeFilename =
      sanitizeFilename(file.name);

    const pathname =
      `orders/${orderNumber}/${safeFilename}`;

    const blob =
      await window.vercelBlobUpload(
        pathname,
        file,
        {
          access: "private",

          handleUploadUrl:
            "/api/upload-photo",

          clientPayload:
            JSON.stringify({
              orderNumber,
              uploadToken
            })
        }
      );

    uploadedPhotos.push({
      filename: file.name,
      pathname: blob.pathname,
      contentType:
        file.type || "application/octet-stream",
      size: file.size
    });
  }

  return uploadedPhotos;
}
 function buildOrderData(
  orderNumber,
  photoBlobs
) {
    const selectedProduct =
      getSelectedProduct();

  
    return {
      orderNumber: orderNumber,

      product:
        selectedProduct.value,

      productName:
        selectedProduct.dataset.name ||
        "Selected Product",

      price:
        "$" +
        Number(
          selectedProduct.dataset.price ||
            0
        ).toFixed(2),

      customerName:
        getValue("#customerName"),

      customerEmail:
        getValue("#customerEmail"),

      customerPhone:
        getValue("#customerPhone"),

      recipientName:
        getValue("#recipientName"),

      occasion:
        getValue("#occasion"),

      otherOccasion:
        getValue("#otherOccasion"),

      requestedDate:
        getValue("#requestedDate"),

      sharedStory:
        getValue("#sharedStory"),

      songStyle:
        getValue("#songStyle"),

      otherSongStyle:
        getValue("#otherSongStyle"),

      songMood:
        getValue("#songMood"),

      vocalStyle:
        getValue("#vocalStyle"),

      songAvoid:
        getValue(
          '[name="song_avoid"]'
        ),

      cardStyle:
        getValue("#cardStyle"),

      favoriteColors:
        getValue("#favoriteColors"),

      mailChoice:
        getValue("#mailChoice"),

     photoBlobs: photoBlobs || [],
      
addressType: getValue('[name="address_type"]:checked'),
      
      mailName:
        getValue(
          '[name="mail_name"]'
        ),

      street:
        getValue('[name="street"]'),

      apt:
        getValue('[name="apt"]'),

      city:
        getValue('[name="city"]'),

      state:
        getValue('[name="state"]'),

      zip:
        getValue('[name="zip"]'),

      additionalNotes:
        getValue(
          '[name="additional_notes"]'
        )
    };
  }

  // =========================================================
  // RESEND AND STRIPE
  // =========================================================

  if (payButton) {
    payButton.addEventListener(
      "click",
      async function (event) {
        event.preventDefault();

        if (
          termsCheckbox &&
          !termsCheckbox.checked
        ) {
          alert(
            "Please accept the terms before continuing."
          );

          return;
        }

        const selectedProduct =
          getSelectedProduct();

        if (!selectedProduct) {
          alert(
            "Please select a product."
          );

          return;
        }

        if (!orderForm) {
          alert(
            "The order form could not be found. Please refresh the page."
          );

          return;
        }

        if (!validateAllSteps()) {
          return;
        }

        const customerName =
          getValue("#customerName");

        const customerEmail =
          getValue("#customerEmail");

        if (
          !customerName ||
          !customerEmail
        ) {
          alert(
            "Please enter your name and email address."
          );

          return;
        }

        const orderNumber =
          createOrderNumber();

        let photoBlobs = [];

if (
  selectedProduct.value === "card" ||
  selectedProduct.value === "bundle"
) {
  payButton.textContent =
    "Preparing Photo Uploads...";

  photoBlobs = await uploadOrderPhotos({
    orderNumber,
    customerEmail,
    product: selectedProduct.value,

    onProgress: function (
      current,
      total
    ) {
      payButton.textContent =
        `Uploading Photo ${current} of ${total}...`;
    }
  });
}

payButton.textContent =
  "Saving Your Order...";

let photoBlobs = [];

if (
  selectedProduct.value === "card" ||
  selectedProduct.value === "bundle"
) {
  payButton.textContent = "Preparing Photo Uploads...";

  photoBlobs = await uploadOrderPhotos({
    orderNumber: orderNumber,
    customerEmail: customerEmail,
    product: selectedProduct.value,

    onProgress: function (current, total) {
      payButton.textContent =
        `Uploading Photo ${current} of ${total}...`;
    }
  });
}

payButton.textContent = "Saving Your Order...";

const orderData = buildOrderData(
  orderNumber,
  photoBlobs
);
  

        const originalButtonText =
          payButton.textContent;

        payButton.textContent =
          "Saving Your Order...";

        payButton.classList.add(
          "disabled"
        );

        payButton.setAttribute(
          "aria-disabled",
          "true"
        );

        try {
          /*
           * First, email all written order information.
           */
          const orderResponse =
            await fetch(
              "/api/send-order",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json"
                },

                body:
                  JSON.stringify(
                    orderData
                  )
              }
            );

          const orderResult =
            await orderResponse.json();

          if (
            !orderResponse.ok ||
            !orderResult.success
          ) {
            throw new Error(
              orderResult.error ||
                "The order details could not be sent."
            );
          }

          payButton.textContent =
            "Opening Secure Checkout...";

          /*
           * Second, open Stripe Checkout.
           */
          const checkoutResponse =
            await fetch(
              "/api/create-checkout-session",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json"
                },

                body:
                  JSON.stringify({
                    product:
                      selectedProduct.value,

                    orderNumber:
                      orderNumber,

                    customerEmail:
                      customerEmail,

                    customerName:
                      customerName
                  })
              }
            );

          const checkoutResult =
            await checkoutResponse.json();

          if (
            !checkoutResponse.ok ||
            !checkoutResult.url
          ) {
            throw new Error(
              checkoutResult.error ||
                "Stripe Checkout could not be opened."
            );
          }

          window.location.href =
            checkoutResult.url;
        } catch (error) {
          console.error(
            "Order checkout error:",
            error
          );

          alert(
            error.message ||
              "There was a problem saving your order. Please try again."
          );

          payButton.textContent =
            originalButtonText;

          updatePaymentButtonState();
        }
      }
    );
  }

  // =========================================================
  // INITIAL PAGE STATE
  // =========================================================

  updateOtherOccasion();
  updateOtherSongStyle();
  updateProductSummary();
  updateAnswers();
  updatePaymentButtonState();
  updateStepDisplay();
});
