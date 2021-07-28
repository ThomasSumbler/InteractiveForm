# Interactive Form

Repository for Treehouse Techdegree Project 3

## Project Summary

This project adds JavaScript to a supplied HTML form, and adds the following kinds of features:

1. Hiding text input and information fields based on choices in select input menus.
2. Hiding options a select menu, based on the choice of another select menu.
3. Disabling of checkboxes and select menus, based on choices made (or not yet made) in other parts of the form.
4. Validation of user text input, and revealing hints for invalid fields.
5. Changing element classes so supplied CSS can make invalid fields more visible.
6. Alerting users if their text input is valid or invalid as they type.
7. Helping users spot their exact mistake in the email field, by changing the hint based on the error detected during validation.

## Feature Details

### Real-Time Error Message

This form features real-time validation of forms.  This is achieved by using the [```'input'``` event listener](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event), which is triggered every time the input box is changed.  The event listener executes the validation function for the corresponding script.

### Conditional Error Message

This form features hints for the email address field, based on the kind of error that is detected.  ```if else``` statements test a series of regular expressions on the input, and the first one that fails supplies a hint explaining the problem.
These are the hints:

1. "Email Address field cannot be blank"
1. "Email Address field cannot begin with '@'"
1. "Email Address field must contain an '@'"
1. "This form can only accept email addresses ending in '.com'"
1. "There must be at least 1 character between '@' and '.com'"
1. "Email Address field must have only 1 '@'"
1. "There must be no '.' characters between '@' and '.com'"

## Remarks

The HTML and CSS files were provided, because the purpose of this project was to write JavaScript.

The email validation could be improved (most notably only '.com' TLDs are valid), but I stopped at the requirements specified by the assignment.
