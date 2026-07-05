document.addEventListener("DOMContentLoaded", function () {

    // Product Selection
    const productRadios = document.querySelectorAll('input[name="product"]');

    const totalPrice = document.getElementById("orderTotal");

    const songSection = document.getElementById("songSection");
    const cardSection = document.getElementById("cardSection");

    const mailSection = document.getElementById("mailSection");

    const mailChoice = document.getElementById("mailChoice");

    // Prices
    const prices = {
        song: 24.99,
        card: 7.99,
        bundle: 29.99
    };

    productRadios.forEach(radio => {

        radio.addEventListener("change", function () {

            let value = this.value;

            // Update total
            totalPrice.innerHTML = "$" + prices[value].toFixed(2);

            // Hide everything
            songSection.style.display = "none";
            cardSection.style.display = "none";
            mailSection.style.display = "none";

            // Song
            if (value === "song") {

                songSection.style.display = "block";

            }

            // Greeting Card
            if (value === "card") {

                cardSection.style.display = "block";

            }

            // Bundle
            if (value === "bundle") {

                songSection.style.display = "block";
                cardSection.style.display = "block";

            }

        });

    });

    // Mailing Option

    if (mailChoice) {

        mailChoice.addEventListener("change", function () {

            if (this.value === "customer" || this.value === "recipient") {

                mailSection.style.display = "block";

            } else {

                mailSection.style.display = "none";

            }

        });

    }

    // Smooth Scroll Buttons

    const orderButtons = document.querySelectorAll(".order-now");

    orderButtons.forEach(button => {

        button.addEventListener("click", function () {

            document.getElementById("orderSection").scrollIntoView({
                behavior: "smooth"
            });

        });

    });

});


//---------------------------------------------
// Ready for Stripe or PayPal Integration
//---------------------------------------------

function checkout() {

    const selected = document.querySelector('input[name="product"]:checked');

    if (!selected) {

        alert("Please select a product.");
        return;

    }

    switch (selected.value) {

        case "song":

            // Replace with your Stripe or PayPal link
            window.location.href = "#";

            break;

        case "card":

            window.location.href = "#";

            break;

        case "bundle":

            window.location.href = "#";

            break;

    }

}
