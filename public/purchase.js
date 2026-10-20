
const form = document.querySelector("#purchase-form");
const fields = Array.from(form.querySelectorAll("input, select"));

function message(field) {
    const validity = field.validity;

    if (validity.valueMissing) {
        return "See väli on kohustuslik.";
    }

    if (validity.typeMismatch) {
        return "Kontrolli sisestatud andmete kuju.";
    }

    if (validity.tooShort) {
        return `Vähemalt ${field.minLength} tähemärki.`;
    }

    if (validity.tooLong) {
        return `Kuni ${field.maxLength} tähemärki.`;
    }

    if (validity.rangeUnderflow) {
        return `Väikseim väärtus on ${field.min}.`;
    }

    if (validity.rangeOverflow) {
        return `Suurim väärtus on ${field.max}.`;
    }

    if (validity.stepMismatch) {
        return `Kasuta sammu ${field.step}.`;
    }

    if (validity.patternMismatch) {
        return "Kontrolli sisestatud andmete kuju.";
    }

    if (validity.customError) {
        return field.validationMessage;
    }

    return field.validity.valid ? "" : field.validationMessage;
}

function show(field) {
    const error = document.getElementById(`${field.id}-error`);
    const errorMessage = message(field);

    error.textContent = errorMessage;

    if (errorMessage) {
        field.setAttribute("aria-invalid", "true");
    } else {
        field.removeAttribute("aria-invalid");
    }

    return !errorMessage;
}

function checkMatch() {
    const email = document.getElementById("email");
    const confirmation = document.getElementById("email-confirm");

    confirmation.setCustomValidity("");

    if (confirmation.value && email.value !== confirmation.value) {
        confirmation.setCustomValidity("E-posti aadressid ei ühti.");
    }
}

fields.forEach((field) => {
    field.addEventListener("blur", () => {
        if (field.id === "email" || field.id === "email-confirm") {
            checkMatch();
        }

        show(field);
    });

    field.addEventListener("input", () => {
        if (field.id === "email" || field.id === "email-confirm") {
            checkMatch();
        }

        show(field);
    });

    field.addEventListener("change", () => {
        if (field.id === "email" || field.id === "email-confirm") {
            checkMatch();
        }

        show(field);
    });
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    checkMatch();

    let firstInvalid = null;

    fields.forEach((field) => {
        if (!show(field) && !firstInvalid) {
            firstInvalid = field;
        }
    });

    if (firstInvalid) {
        firstInvalid.focus();
    }
});
