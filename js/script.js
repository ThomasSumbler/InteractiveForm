    // Focus on Name Input on Page Load

// Focus on name input when loading page
const nameInput = document.getElementById("name");
nameInput.focus()



    // Hide Job Role Input

// Reveal other job role input only when "other" is selected
// for the job role
const jobRoleSelect = document.getElementById("title");
const otherJobRoleInput = document.getElementById("other-job-role");
jobRoleSelect.addEventListener("change", (e) => {
    if (jobRoleSelect.value === "other") {
        otherJobRoleInput.hidden = false;
    } else {
        otherJobRoleInput.hidden = true;
    }
});
// Hide other job role input when loading page
otherJobRoleInput.hidden = true;



    // Shirt Colors And Designs

// disable color selecting until a design is chosen
const shirtColorSelect = document.getElementById("color");
shirtColorSelect.disabled = true;

// Remove the "(<design> shirt only)" from each option
const shirtColorOptions = shirtColorSelect.children;
for (let i = 0; i < shirtColorOptions.length; i++) {
    const option = shirtColorOptions[i];
    option.textContent = option.textContent.replace(/ \([^)]+\)/g,"").trim();
}

// Filter color options when shirt design is selected
// (and enable the color selection)
const shirtDesignSelect = document.getElementById("design");
shirtDesignSelect.addEventListener("change", (e) => {
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
    // Since "Select Theme" can't be chosen as an option, we know for sure
    // that shirt color selection can be enabled
    shirtColorSelect.disabled = false;
});



    // Checkbox Costs and Conflicts

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

// Note: this listener also validates the checkbox inputs
// using a function defined below
checkboxFieldset.addEventListener("change", (e) => {
    updateEventCost();
    changeEventSelectability(e.target);
    isValidRegisterForActivities();
});



    // Hide Irrelevant Payment Information

// Show only relevant payment information
// Show credit card as default method
const paymentSelect = document.getElementById("payment");
const paymentDivList = [document.getElementById("credit-card"),
                        document.getElementById("paypal"),
                        document.getElementById("bitcoin"),
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
paymentSelect.addEventListener("change",hideIrrelevantPaymentDivs) 

// Set initial payment type to Credit Card:
paymentSelect.value = "credit-card";
hideIrrelevantPaymentDivs();



    // Form Validation

// Will programmatically create several functions:
//
// isValid<Thing>() --> bool
//
// If input for <Thing> is valid, the parent element is given the '.valid'
// class name (and the '.not-valid' class is removed).
// true is returned
// If input for <Thing> is not valid, the parent element is given the 
// '.not-valid' class name (and the '.valid' class is removed)
// false is returned
// focus is placed on that element

// id is the string that will get the input field with
// document.getElementById
// validationRegex is the regex that makes the input valid

// An event listener validating each individual field on input is also created.

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
            thingInput.focus()
            return false;
        }
    }
    thingInput.addEventListener('input',isValidThing);
    return isValidThing;
}
        
const isValidName = makeValidator("name",/^.+$/);
//const isValidEmail = makeValidator("email",/^[^@]+@[^@.]+\.com$/); // replaced below
const isValidCreditCardNumber = makeValidator("cc-num",/^\d{13,16}$/);
const isValidZip = makeValidator("zip",/^\d{5}$/);
const isValidCVV = makeValidator("cvv",/^\d\d\d$/);


// make isValidEmail() with different messages
// depending on the error
const emailInput = document.getElementById("email");
const emailParentLabel = emailInput.parentElement;
const emailHintElement = emailParentLabel.lastElementChild;
const emailHiddenHintClass = emailHintElement.className;
// the space in the regex means that the '-hint' in 'thing-hint hint' won't be touched
const emailVisibleHintClass = emailHiddenHintClass.replace(/ hint/,"")

function failedValidation(hint) {
    emailParentLabel.className = "not-valid";
    emailHintElement.className = emailVisibleHintClass;
    emailHintElement.textContent = hint;
    emailInput.focus();
}

function isValidEmail() {
    const value = emailInput.value;
    if (!value) {
        failedValidation("Email Address field cannot be blank");
        return false;
    } else if (!value.match(/^[^@]+/)) {
        failedValidation("Email Address field cannot begin with '@'");
        return false;
    } else if (!value.match(/^[^@]+@/)) {
        failedValidation("Email Address field must contain an '@'");
        return false;
    } else if (!value.match(/^[^@]+@.*\.com$/)) {
        failedValidation("This form can only accept email addresses ending in '.com'");
        return false;
    } else if (!value.match(/^[^@]+@.+\.com$/)) {
        failedValidation("There must be at least 1 character between '@' and '.com'");
        return false;
    } else if (!value.match(/^[^@]+@[^@]+\.com$/)) {
        failedValidation("Email Address field must have only 1 '@'");
        return false;
    } else if (!value.match(/^[^@]+@[^@.]+\.com$/)) {
        failedValidation("There must be no '.' characters between '@' and '.com'");
        return false;
    } else {
        // The last regex is the full email validation regex, so if the program gets past the
        // last else if statement, the email is known to be good (at least according to the
        // requirements of this project
        emailParentLabel.className = "valid";
        emailHintElement.className = emailHiddenHintClass;
        emailHintElement.textContent = "Email address must be formatted correctly";
        return true;
    }
}
emailInput.addEventListener('input',isValidEmail);
        
// Checking validity of checkboxes is different, so make custom function for that
// Note that this is in the "change" listener for the checkboxFieldset above
const checkboxHint = document.getElementById("activities-hint");
function isValidRegisterForActivities() {
    for (let i = 0; i < checkboxList.length; i++) {
        if (checkboxList[i].checked) {
            // only one checkbox needs to be selected for the input to be valid
            checkboxFieldset.className = "activities valid";
            checkboxHint.className = "activities-hint hint";
            return true;
        }
    }
    // if we get here, no checkbox has been selected
    checkboxFieldset.className = "activities not-valid";
    checkboxHint.className = "activities-hint";
    checkboxList[0].focus()
    return false;
}

// Make sure Expiration Date is set
const expireMonth = document.getElementById("exp-month");
const expireMonthDiv = expireMonth.parentElement;
const expireMonthLabel = expireMonthDiv.querySelector('label');
const expireYear = document.getElementById("exp-year");
const expireYearDiv = expireYear.parentElement;
const expireYearLabel = expireYearDiv.querySelector('label');
function isValidExpireDate() {
    if (expireYear.value === "Select Year") {
        expireYearDiv.className = "year-box not-valid";
        expireYearLabel.className = "not-valid";
        expireYear.focus()
    } else {
        expireYearDiv.className = "year-box";
        expireYearLabel.className = "";
    }
    if (expireMonth.value === "Select Date") {
        expireMonthDiv.className="month-box not-valid";
        expireMonthLabel.className="month-box not-valid";
        expireMonth.focus();
    } else {
        expireMonthDiv.className="month-box";
        expireMonthLabel.className = "";
    }
    return !(expireMonth.value === "Select Date" || expireYear.value === "Select Year")
}
expireMonth.addEventListener("change",isValidExpireDate);
expireYear.addEventListener("change",isValidExpireDate)


// Validate the entire form upon attempted submission
const formElement = document.querySelector("form")
formElement.addEventListener("submit",(e) => {
    let allFieldsValid = true;
    // Computing allFieldsValid must be done on separate
    // lines, since short circuiting would prevent other
    // isValid<Thing> functions from running, and those functions
    // are important to run show all input errors
    // Computation is done in reverse order, since validation places focus
    // on invalid input.  Reverse order means the input highest up the page
    // will end up with focus
    if (paymentSelect.value === "credit-card") {
        allFieldsValid = isValidCVV() && allFieldsValid;
        allFieldsValid = isValidZip() && allFieldsValid;
        allFieldsValid = isValidCreditCardNumber() && allFieldsValid;
        allFieldsValid = isValidExpireDate() && allFieldsValid;
    }
    allFieldsValid = isValidRegisterForActivities() && allFieldsValid;
    allFieldsValid = isValidEmail() && allFieldsValid;
    allFieldsValid = isValidName() && allFieldsValid;
    if (!allFieldsValid) {
        // If some fields are invalid, e.preventDefault() stops the form from being submitted
        e.preventDefault();
        return;
    }
    return;
});



    // Visible checkbox focus

// note 'focus' and 'blur' events don't bubble,
// would use 'focusin' and 'focusout' to build a version
// using bubbling

for (let i = 0; i < checkboxList.length; i++) {
    const checkbox = checkboxList[i];
    const checkboxParent = checkboxList[i].parentNode;
    checkbox.addEventListener('focus', () =>  checkboxParent.className = "focus");
    checkbox.addEventListener('blur', () => checkboxParent.className = "");
}




