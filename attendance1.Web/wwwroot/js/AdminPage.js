// function for default select programme of admin 
function setDefaultSelectProgramme(row, selectId) {
    var selectElement = row.querySelector(selectId);
    if (!selectElement) {
        console.error('Select element not found:', selectId);
        return;
    }

    var originalValue = selectElement.getAttribute('data-original-value');
    var options = selectElement.options;

    for (var i = 0; i < options.length; i++) {
        if (options[i].innerText === originalValue) {
            selectElement.selectedIndex = i;
            break;
        }
    }
}

// function for check empty input 
// used by edit
function checkEmpty(row, elementQuery, errorId) {
    var element = row.querySelector(elementQuery);
    var errorElement = row.querySelector(errorId);
    if (element.value === '') {
        errorElement.style.display = 'block';
        return false;
    } else {
        errorElement.style.display = 'none';
        return true;
    }
}

function checkStringFormat(row, elementQuery, errorId, regexExpression) {
    var element = row.querySelector(elementQuery);
    var errorElement = row.querySelector(errorId);
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

function checkDuplicate(row, elementQuery, errorId, ExistedQuery) {
    var element = row.querySelector(elementQuery);
    var errorElement = row.querySelector(errorId);
    var inputValue = element.value.trim().toLowerCase();
    var originalValue = row.querySelector(ExistedQuery).textContent.trim().toLowerCase();

    var existingValues = Array.from(document.querySelectorAll(ExistedQuery))
        .map(span => span.textContent.trim().toLowerCase())
        .filter(value => value !== originalValue);

    if (existingValues.includes(inputValue)) {
        errorElement.style.display = 'block';
        return false;
    } else {
        errorElement.style.display = 'none';
        return true;
    }
}

function checkAnyChange(row, errorId) {
    var errorElement = row.querySelector(errorId);
    var inputs = row.querySelectorAll('input[type="text"], select'); 

    var isChanged = Array.from(inputs).some(function (input) {
        var originalValue = input.getAttribute('data-original-value');

        if (input.tagName.toLowerCase() === 'select') {
            currentValue = input.options[input.selectedIndex].text.trim();
        } else {
            currentValue = input.value.trim();
        }

        return originalValue !== currentValue;
    });

    if (!isChanged) {
        errorElement.style.display = 'block';
        return false;
    } else {
        errorElement.style.display = 'none';
        return true;
    }
}

// edit admin
// display button and form
function editRow(staffId) {
    const row = document.getElementById('row-admin-' + staffId);
    //name 
    //row.querySelector('.admin-name').style.display = 'none';
    //row.querySelector('.admin-name-input').style.display = 'inline';

    //id
    row.querySelector('.admin-id').style.display = 'none';
    row.querySelector('.admin-id-input').style.display = 'inline';

    //email
    row.querySelector('.admin-email').style.display = 'none';
    row.querySelector('.admin-email-input').style.display = 'inline';

    //programme
    row.querySelector('.admin-under-programme').style.display = 'none';
    row.querySelector('.admin-under-programme-input').style.display = 'inline';
    setDefaultSelectProgramme(row, '.admin-under-programme-input');

    //buttons
    row.querySelector('.edit-btn').style.display = 'none';
    row.querySelector('.delete-btn').style.display = 'none';

    row.querySelector('.save-btn').style.display = 'flex';
    row.querySelector('.cancel-btn').style.display = 'flex';
}

// cancel edit admin
// update the button display
function cancelEdit(staffId) {
    const row = document.getElementById('row-admin-' + staffId);
    // show initial display
    row.querySelector('.admin-name').style.display = 'inline';
    row.querySelector('.admin-id').style.display = 'inline';
    row.querySelector('.admin-email').style.display = 'inline';
    row.querySelector('.admin-under-programme').style.display = 'inline';

    // Restore the input's value to its original value
    // name
    //const NameInput = row.querySelector('.admin-name-input');
    //NameInput.style.display = 'none';
    //NameInput.value = NameInput.getAttribute('data-original-value');

    // id
    const IdInput = row.querySelector('.admin-id-input');
    IdInput.style.display = 'none';
    IdInput.value = IdInput.getAttribute('data-original-value');

    // email
    const EmailInput = row.querySelector('.admin-email-input');
    EmailInput.style.display = 'none';
    EmailInput.value = EmailInput.getAttribute('data-original-value');

    // programme
    const ProgrammeInput = row.querySelector('.admin-under-programme-input');
    ProgrammeInput.style.display = 'none';
    //ProgrammeInput.value = ProgrammeInput.getAttribute('data-original-value');

    // buttons
    row.querySelector('.edit-btn').style.display = 'flex';
    row.querySelector('.delete-btn').style.display = 'flex';

    row.querySelector('.save-btn').style.display = 'none';
    row.querySelector('.cancel-btn').style.display = 'none';

    //prompt text reset
    var prompts = row.querySelectorAll('.prompt-text');
    prompts.forEach(function (prompt) {
        prompt.style.display = 'none';
    });
}

//save edited admin row
function saveRow(staffId) {
    const form = document.getElementById('edit-admin-form-' + staffId);
    const row = document.getElementById('row-admin-' + staffId);
    const adminName = row.querySelector('.admin-name').textContent.trim();

    let isValid = true;

    // validate
    //check change
    isValid &= checkAnyChange(row,'#form-data-no-change-error');

    // id
    isValid &= checkEmpty(row, '.admin-id-input', '#admin-id-empty');
    isValid &= checkStringFormat(row, '.admin-id-input', '#admin-id-error', '^[a-zA-Z0-9]+$');
    isValid &= checkDuplicate(row, '.admin-id-input', '#admin-id-existed', '.admin-id');

    // name
    //isValid &= checkEmpty(row, '.admin-name-input', '#admin-name-empty');
    //isValid &= checkStringFormat(row, '.admin-name-input', '#admin-name-error', '^[a-zA-Z0-9\\s]+$');
    //isValid &= checkDuplicate(row, '.admin-name-input', '#admin-name-existed', '.admin-name');

    // email
    isValid &= checkEmpty(row, '.admin-email-input', '#admin-email-empty');
    isValid &= checkStringFormat(row, '.admin-email-input', '#admin-email-error', '^[^\\s]+@uts\.edu\.my$');
    isValid &= checkDuplicate(row, '.admin-email-input', '#admin-email-existed', '.admin-email');

    // programme
    //isValid &= checkStringFormat(row, '.admin-under-programme-input', '#admin-under-programme-error', '^(?=.*[a-zA-Z])[a-zA-Z0-9 ()]{1,100}$');

    if (isValid) {
        const hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', 'adminName');
        hiddenInput.setAttribute('value', adminName);
        form.appendChild(hiddenInput);
        form.submit();
    }
}

//=========================================================================//
//=========================================================================//
//=========================================================================//

// check admin name by passsing html element id
// used by add 
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

function checkDuplicateById(elementId, errorId, ExistedQuery) {
    var element = document.getElementById(elementId);
    var errorElement = document.getElementById(errorId);
    var inputValue = element.value.trim().toLowerCase();

    var existingValues = Array.from(document.querySelectorAll(ExistedQuery))
        .map(span => span.textContent.trim().toLowerCase());

    console.log(existingValues);

    if (existingValues.includes(inputValue)) {
        errorElement.style.display = 'block';
        return false;
    } else {
        errorElement.style.display = 'none';
        return true;
    }
}

//add new admin to list
document.getElementById('add-admin-submit-button').addEventListener('click', function (event) {
    event.preventDefault();

    var valid = true;

    // id
    valid &= checkElementEmpty('new-admin-id-fill-space', 'new-admin-id-empty');
    valid &= checkStringFormatById('new-admin-id-fill-space', 'new-admin-id-error', '^[a-zA-Z0-9]+$');
    valid &= checkDuplicateById('new-admin-id-fill-space', 'new-admin-id-existed', '.admin-id')

    // name
    valid &= checkElementEmpty('new-admin-name-fill-space', 'new-admin-name-empty');
    valid &= checkStringFormatById('new-admin-name-fill-space', 'new-admin-name-error', '^[a-zA-Z0-9\\s]+$');

    // email 
    valid &= checkElementEmpty('new-admin-email-fill-space', 'new-admin-email-empty');
    valid &= checkStringFormatById('new-admin-email-fill-space', 'new-admin-email-error', '^[^\\s]+@uts\.edu\.my$');
    valid &= checkDuplicateById('new-admin-email-fill-space', 'new-admin-email-existed', '.admin-email')

    //programme
    //none

    if (valid) {
        document.getElementById('add-admin-form').submit();
    }
});

// clear add admin form input
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


// close add admin modal
document.querySelectorAll('.close-button').forEach(function (button) {
    button.addEventListener('click', function () {
        //reset form
        document.getElementById('add-admin-form').reset();

        //hide prompt text
        var prompts = document.querySelectorAll('.prompt-text');
        prompts.forEach(function (prompt) {
            prompt.style.display = 'none';
        });
    });
});


// delete admin
//confirm delete 
document.addEventListener("DOMContentLoaded", function () {
    window.confirmDelete = function (staffId) {
        if (confirm("Are you sure you want to delete this admin?")) {
            const deleteForm = document.getElementById('delete-admin-form');
            const deleteInput = document.getElementById('delete-admin-id');
            deleteInput.value = staffId;
            deleteForm.submit();
        }
    }
});

// search table by adminId & name & programme
function searchTable() {
    var input, filter, scope, tr, td, i, j, txtValue;
    input = document.getElementById("search-admin-input");
    filter = input.value.toUpperCase();
    scope = document.getElementById("admin-table-tbody");
    tr = scope.getElementsByTagName("tr");

    //display clear button or not
    var clearBtn = document.getElementById("clear-search-input");
    if (input.value) {
        clearBtn.style.display = "flex";
    } else {
        clearBtn.style.display = "none";
    }

    var isFound = false;
    for (i = 0; i < tr.length; i++) {
        var isMatch = false;
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j]) {
                span = td[j].querySelector("span");
                if (span) {
                    txtValue = span.textContent || span.innerText;
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        isMatch = true;
                        isFound = true;
                        break;
                    }
                }
            }
        }
        tr[i].style.display = isMatch ? "" : "none";
    }

    var noFoundRow = document.getElementById("no-found-row");
    if (!isFound) {
        if (noFoundRow) {
            noFoundRow.style.display = filter ? "block" : "none";
        }
    } else {
        if (noFoundRow) {
            noFoundRow.style.display = "none";
        }
    }
}

//clear search input
function clearSearch() {
    var input = document.getElementById("search-admin-input");
    input.value = "";
    input.focus();
    searchTable();
}

//sort table by admin name, admin id, programme
// sort table
function sortTable(tableId, col, reverse) {
    var table = document.getElementById(tableId);
    var tbody = table.getElementsByTagName('tbody')[0];
    var rows = Array.prototype.slice.call(tbody.rows, 0);

    reverse = -((+reverse) || -1);

    rows = rows.sort(function (a, b) {
        var aCell = a.cells[col];
        var bCell = b.cells[col];

        if (!aCell || !bCell) return 0;

        var aValue = aCell.innerText.trim();
        var bValue = bCell.innerText.trim();

        if (aValue.endsWith('%') && bValue.endsWith('%')) {
            // Convert percentage strings to numbers and compare
            var aNum = parseFloat(aValue.slice(0, -1));
            var bNum = parseFloat(bValue.slice(0, -1));
            return reverse * (aNum - bNum);
        } else if (!isNaN(aValue) && !isNaN(bValue)) {
            // If the values are numeric, compare as numbers
            return reverse * (parseFloat(aValue) - parseFloat(bValue));
        } else {
            // Default to string comparison
            return reverse * aValue.localeCompare(bValue);
        }
    });

    rows.forEach(function (row, index) {
        // Reassign sequence numbers
        row.cells[0].innerText = index + 1;
        tbody.appendChild(row);
    });
}

function addSortHandlers() {
    var headers = document.querySelectorAll('.sortable');
    headers.forEach(function (header) {
        var colIndex = header.getAttribute('data-sort-column');
        var asc = true;
        header.addEventListener('click', function () {
            sortTable('admin-table', colIndex, asc);
            asc = !asc;
        });
    });
}

document.addEventListener('DOMContentLoaded', addSortHandlers);


