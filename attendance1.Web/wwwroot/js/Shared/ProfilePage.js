// function for check empty input 
function checkElementEmpty(elementId, errorId) {
    var element = document.getElementById(elementId);
    var errorElement = document.getElementById(errorId);
    if (element.value === '') {
        errorElement.style.display = 'block';
        return false;
    } else {
        errorElement.style.display = 'none';
        return true;
    }
}

function checkStringFormatById(elementId, errorId, regexExpression) {
    var element = document.getElementById(elementId);
    var errorElement = document.getElementById(errorId);
    var pattern = new RegExp(regexExpression)

    var inputValue = element.value.trim();

    if (inputValue !== '' && !pattern.test(inputValue)) {
        errorElement.style.display = 'block';
        return false;
    } else if (inputValue == '') {
        errorElement.style.display = 'none';
        return false;
    } else {
        errorElement.style.display = 'none';
        return true;
    }
}

function checkAnyChange(nameElementId, pwElementId, errorId) {
    var nameElement = document.getElementById(nameElementId);
    var nameOriginalValue = nameElement.getAttribute('data-original-value');
    var pwElement = document.getElementById(pwElementId);
    var errorElement = document.getElementById(errorId);

    let isChanged = false;

    if (nameElement.value.trim() !== nameOriginalValue || pwElement.value.trim() !== "") {
        isChanged = true;
    }

    if (!isChanged) {
        errorElement.style.display = 'block';
        return false;
    } else {
        errorElement.style.display = 'none';
        return true;
    }
}

// edit user Detail
// display button and form
function editProfile() {
    //name
    document.getElementById('staff-name').style.display = 'none';
    document.getElementById('staff-name-input-container').style.display = 'block';

    //pw
    document.getElementById('old-password').style.display = 'block';
    document.getElementById('new-password').style.display = 'block';

    //buttons
    document.getElementById('edit-btn').style.display = 'none';

    document.getElementById('save-btn').style.display = 'flex';
    document.getElementById('cancel-btn').style.display = 'flex';
}

// cancel edit user profile
// update the button display
function cancelEdit() {
    // show initial display
    document.getElementById('staff-name').style.display = 'inline';

    // Restore the input's value to its original value
    // name
    const nameInput = document.getElementById('staff-name-input');
    const nameInputContainer = document.getElementById('staff-name-input-container');
    nameInputContainer.style.display = 'none';
    nameInput.value = nameInput.getAttribute('data-original-value');

    // pw
    const oldPwInputGroup = document.getElementById('old-password');
    const newPwInputGroup = document.getElementById('new-password');
    oldPwInputGroup.style.display = 'none';
    newPwInputGroup.style.display = 'none';
    const oldPwInput = document.getElementById('staff-old-password-input');
    const newPwInput = document.getElementById('staff-new-password-input');
    oldPwInput.value = oldPwInput.getAttribute('data-original-value');
    newPwInput.value = newPwInput.getAttribute('data-original-value');

    // buttons
    document.getElementById('edit-btn').style.display = 'flex';

    document.getElementById('save-btn').style.display = 'none';
    document.getElementById('cancel-btn').style.display = 'none';

    //prompt text reset
    var prompts = document.querySelectorAll('.prompt-text');
    prompts.forEach(function (prompt) {
        prompt.style.display = 'none';
    });
}

//save edited userDetail
document.getElementById('save-btn').addEventListener('click', function (event) {
    event.preventDefault();

    var valid = true;

    // name
    valid &= checkElementEmpty('staff-name-input', 'staff-name-empty');
    valid &= checkStringFormatById('staff-name-input', 'staff-name-error', '^[a-zA-Z0-9\\s]+$');

    //pw
    valid &= checkElementEmpty('staff-old-password-input', 'staff-old-password-empty');

    var newPassword = document.getElementById('staff-new-password-input').value.trim();
    if (newPassword !== '') {
        valid &= checkStringFormatById('staff-new-password-input', 'staff-new-password-error', '^(?=\\S{8,})\\S*$');
    }

    valid &= checkAnyChange('staff-name-input', 'staff-new-password-input', 'no-change-error');

    if (valid) {
        document.getElementById('edit-profile-form').submit();
    }
});

// clear form input
document.addEventListener('DOMContentLoaded', function () {
    var inputs = document.querySelectorAll('.clearable');
    inputs.forEach(function (input) {
        input.addEventListener('input', function () {
            var clearButton = this.nextElementSibling;
            if (this.value) {
                clearButton.style.display = 'inline';
            } else {
                clearButton.style.display = 'none';
            }
        });
    });
});


function clearInput(button) {
    var input = button.previousElementSibling;
    input.value = '';
    button.style.display = 'none';
    input.focus();
}
