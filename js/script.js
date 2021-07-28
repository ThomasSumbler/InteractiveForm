
// Focus on name input when loading page
const nameInput = document.getElementById("name");
nameInput.focus()



const jobRoleSelect = document.getElementById("title");
const otherJobRoleInput = document.getElementById("other-job-role");
// Hide other job role input when loading page
otherJobRoleInput.hidden = true;
// Reveal other job role input only when "other" is selected
// for the job role
jobRoleSelect.addEventListener("change", (e) => {
    if (jobRoleSelect.value === "other") {
        otherJobRoleInput.hidden = false;
    } else {
        otherJobRoleInput.hidden = true;
    }
});

// disable color selecting until a design is chosen
const shirtColorSelect = document.getElementById("color");
shirtColorSelect.disabled = true;
const shirtColorOptions = shirtColorSelect.children;

// Remove the "(<design> shirt only)" from each option
for (let i = 0; i < shirtColorOptions.length; i++) {
    const option = shirtColorOptions[i];
    option.textContent = option.textContent.replace(/ \([^)]+\)/g,"").trim();
}

// Filter color options when shirt design is selected
// (and enable the color selection)
const shirtDesignSelect = document.getElementById("design");
shirtDesignSelect.addEventListener("change", (e) => {
    const shirtColorOptions = shirtColorSelect.children;
    // By traversing shirtColorOptions in reverse order, 
    // option.selected = true will select the first allowed color
    // in the list as the default color for each design
    for (let i = shirtColorOptions.length - 1; i >= 0; i--) {
        const option = shirtColorOptions[i];
        if (option.getAttribute("data-theme") === shirtDesignSelect.value) {
            option.hidden = false;
            option.selected = true;
        } else {
            option.hidden = true;
        }
    }
    shirtColorSelect.disabled = false;
});



// Update Total Cost and disable checkboxes
// for conflicting events
const checkboxFieldset = document.getElementById("activities");
const activityCostDisplay = document.getElementById("activities-cost");
const checkboxList = checkboxFieldset.querySelectorAll("input[type=checkbox]")

function updateEventCost() {
    let cost = 0;
    for (let i = 0; i < checkboxList.length; i++) {
        const checkbox = checkboxList[i];
        if (checkbox.checked) {
            cost += parseInt(checkbox.getAttribute("data-cost"));
        }
    }
    activityCostDisplay.textContent = `Total: $${cost}`;
}

function changeEventSelectability(changedNode) {
    const checked = changedNode.checked;
    for (let i = 0; i < checkboxList.length; i++) {
        const checkbox = checkboxList[i];
        if (checkbox.getAttribute("data-day-and-time") === changedNode.getAttribute("data-day-and-time") 
                && checkbox.name !== changedNode.name) {
            checkbox.disabled = checked;
        }
    }
}

checkboxFieldset.addEventListener("change", (e) => {
    updateEventCost();
    changeEventSelectability(e.target);
});

// Show only relevant payment information
// Show credit card as default method

const paymentSelect = document.getElementById("payment");

const creditCardDiv = document.getElementById("credit-card");
const paypalDiv = document.getElementById("paypal");
const bitcoinDiv = document.getElementById("bitcoin");

const paymentDivList = [creditCardDiv,
                        paypalDiv,
                        bitcoinDiv,
                        ]


function hideIrrelevantPaymentDivs() {
    const selectedPayment = paymentSelect.value;
    for (let i = 0; i < paymentDivList.length; i++) {
        let div = paymentDivList[i];
        if (div.id === selectedPayment) {
            div.hidden = false;
        } else {
            div.hidden = true;
        }
    }
}

paymentSelect.addEventListener("change", (e) => hideIrrelevantPaymentDivs()) 

// Set initial payment type to Credit Card:
paymentSelect.value = "credit-card";
hideIrrelevantPaymentDivs();

// Form Validation

// isValid<Thing>() --> bool
// If input for <Thing> is valid, the parent element is given the '.valid'
// class name (and the '.not-valid' class is removed).
// true is returned
// If input for <Thing> is not valid, the parent element is given the 
// '.not-valid' class name (and the '.valid' class is removed)
// false is returned

// id is the string that will get the input field with
// document.getElementById
// validationRegex is the regex that makes the input valid
function makeValidator(id,validationRegex) {
    const thingInput = document.getElementById(id);
    const parentLabel = thingInput.parentElement;
    const hint = parentLabel.lastElementChild;
    const hiddenHintClass = hint.className;
    // the space in the regex means that the '-hint' in 'thing-hint hint' won't be touched
    const visibleHintClass = hiddenHintClass.replace(/ hint/,"");
    function isValidThing() {
        if (thingInput.value && thingInput.value.match(validationRegex)) {
            parentLabel.className = "valid";
            hint.className = hiddenHintClass;
            return true;
        } else {
            parentLabel.className = "not-valid"
            hint.className = visibleHintClass;
            return false;
        }
    }
    return isValidThing;
}
        
const isValidName = makeValidator("name",/^.+$/);
const isValidEmail = makeValidator("email",/^[^@]+@[^@.]+\.com$/);
const isValidCreditCardNumber = makeValidator("cc-num",/^\d{13,16}$/);
const isValidZip = makeValidator("zip",/^\d{5}$/);
const isValidCVV = makeValidator("cvv",/^\d\d\d$/);
        

// Checking validity of checkboxes is different, so make custom function for that
function isValidRegisterForActivities() {
    const checkboxHint = document.getElementById("activities-hint");
    for (let i = 0; i < checkboxList.length; i++) {
        if (checkboxList[i].checked) {
            checkboxFieldset.className = "activities valid";
            checkboxHint.className = "activities-hint hint";
            return true;
        }
    }
    // if we get here, no checkbox has been selected
    checkboxFieldset.className = "activities not-valid";
    checkboxHint.className = "activities-hint";
    return false;
}


const formElement = document.querySelector("form")
formElement.addEventListener("submit",(e) => {
    let allFieldsValid = true;
    // Computing allFieldsValid must be done on separate
    // lines, since short circuiting would prevent other
    // isValid<Thing> functions from running, and those functions
    // are important to run show all input errors
    allFieldsValid = isValidName() && allFieldsValid;
    allFieldsValid = isValidEmail() && allFieldsValid;
    allFieldsValid = isValidRegisterForActivities() && allFieldsValid;
    if (paymentSelect.value === "credit-card") {
        allFieldsValid = isValidCreditCardNumber() && allFieldsValid;
        allFieldsValid = isValidZip() && allFieldsValid;
        allFieldsValid = isValidCVV() && allFieldsValid;
    }
    if (!allFieldsValid) {
        e.preventDefault();
        return;
    }
    return;
});


// Visible checkbox focus

checkboxFieldset.addEventListener('focusin', (e) => {
    console.log(e.target.type);
    if (e.target.type === "checkbox") {
        console.log("checkbox");
        e.target.parentNode.className = "focus";
    }
});

checkboxFieldset.addEventListener('focusout', (e) => {
    document.querySelector("label.focus").className="";
});



