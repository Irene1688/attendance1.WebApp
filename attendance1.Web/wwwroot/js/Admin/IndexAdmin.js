// display and hide the admin detail
function toggleAdminDetails(programmeId, element) {
    var detailsRow = document.getElementById('admin-details-row-' + programmeId);
    var detailsContent = detailsRow.querySelector('.admin-details-content');

    if (detailsRow.style.display === 'none' || !detailsRow.style.display) {
        detailsRow.style.display = 'table-row';
        var actualHeight = detailsContent.scrollHeight + 'px';
        detailsContent.style.maxHeight = actualHeight;
        detailsContent.classList.add('expanded');
        element.querySelector('i').classList.remove('mdi-chevron-down');
        element.querySelector('i').classList.add('mdi-chevron-up');

    } else {
        detailsContent.classList.remove('expanded');
        detailsContent.style.maxHeight = '0';
        detailsContent.addEventListener('transitionend', function onTransitionEnd() {
            detailsContent.removeEventListener('transitionend', onTransitionEnd);
            detailsRow.style.display = 'none';
            element.querySelector('i').classList.remove('mdi-chevron-up');
            element.querySelector('i').classList.add('mdi-chevron-down');
            // element.querySelector('span').textContent = 'Display Classes';
        });
    }
}

// display and hide the class details
function toggleClassDetails(programmeId, element) {
    var detailsRow = document.getElementById('class-details-row-' + programmeId);
    var detailsContent = detailsRow.querySelector('.class-details-content');

    if (detailsRow.style.display === 'none' || !detailsRow.style.display) {
        detailsRow.style.display = 'table-row';
        var actualHeight = detailsContent.scrollHeight + 'px';
        detailsContent.style.maxHeight = actualHeight;
        detailsContent.classList.add('expanded');
        element.querySelector('i').classList.remove('mdi-chevron-down');
        element.querySelector('i').classList.add('mdi-chevron-up');

    } else {
        detailsContent.classList.remove('expanded');
        detailsContent.style.maxHeight = '0';
        detailsContent.addEventListener('transitionend', function onTransitionEnd() {
            detailsContent.removeEventListener('transitionend', onTransitionEnd);
            detailsRow.style.display = 'none';
            element.querySelector('i').classList.remove('mdi-chevron-up');
            element.querySelector('i').classList.add('mdi-chevron-down');
        });
    }
}

// function for check empty input 
// used by edit
function checkEmpty(row, errorId) {
    var element = row.querySelector('.programme-name-input');
    var errorElement = row.querySelector(errorId);

    if (element.value === '') {
        errorElement.style.display = 'block';
        return false;
    } else {
        errorElement.style.display = 'none';
        return true;
    }
}

// function for check programme Name format 
// used by edit
function checkProgrammeNameFormat(row) {
    const newProgrammeName = row.querySelector('.programme-name-input').value.trim();
    var newProgrammeNamePattern = /^(?=.*[a-zA-Z])[a-zA-Z0-9 ()]{1,100}$/;
    var programmeNameError = row.querySelector('#programme-name-error');

    if (newProgrammeName !== '' && !newProgrammeNamePattern.test(newProgrammeName)) {
        programmeNameError.style.display = 'block';
        return false;
    } else if (newProgrammeName == '') {
        programmeNameError.style.display = 'none';
        return false;
    } else {
        programmeNameError.style.display = 'none';
        return true;
    }
}

// function for check any change of new programme name and original proramme name 
// used by edit
function checkNewProgrammeChangeExits(row) {
    // const row = document.getElementById('row-programme-' + programmeId);
    const programmeInput = row.querySelector('.programme-name-input');
    const originalProgrammeName = row.querySelector('.programme-name').innerText;
    const newProgrammeName = programmeInput.value.trim();
    var programmeNameNoChangeError = row.querySelector('#programme-name-no-change');

    if (newProgrammeName !== '' && newProgrammeName === originalProgrammeName) {
        programmeNameNoChangeError.style.display = 'block';
        return false;
    } else if (newProgrammeName == '') {
        programmeNameNoChangeError.style.display = 'none';
        return false;
    } else {
        programmeNameNoChangeError.style.display = 'none';
        return true;
    }
}

// function for check duplicate name of existed programme
// used by edit
function checkDuplicateProgrammeName(row) {
    const input = row.querySelector('.programme-name-input');
    const newProgrammeName = input.value.trim().toLowerCase();
    const originalProgrammeName = row.querySelector('.programme-name').textContent.trim().toLowerCase();
    const allProgrammeNames = Array.from(document.querySelectorAll('.programme-name'))
        .map(span => span.textContent.trim().toLowerCase())
        .filter(value => value !== originalProgrammeName);

    if (allProgrammeNames.includes(newProgrammeName)) {
        row.querySelector('#programme-name-existed').style.display = 'block';
        return false;
    }
    row.querySelector('#programme-name-existed').style.display = 'none';
    return true;
}


// edit programme
// display button and form
function editRow(programmeId) {
    const row = document.getElementById('row-programme-' + programmeId);
    row.querySelector('.programme-name').style.display = 'none';
    row.querySelector('.programme-name-input').style.display = 'inline';

    row.querySelector('.edit-btn').style.display = 'none';
    row.querySelector('.delete-btn').style.display = 'none';

    row.querySelector('.save-btn').style.display = 'flex';
    row.querySelector('.cancel-btn').style.display = 'flex';
}

// cancel edit programme
// update the button display
function cancelEdit(programmeId) {
    const row = document.getElementById('row-programme-' + programmeId);
    row.querySelector('.programme-name').style.display = 'inline';
    //row.querySelector('.programme-name-input').style.display = 'none';

    // Restore the input's value to its original value
    const input = row.querySelector('.programme-name-input');
    input.style.display = 'none';
    input.value = input.getAttribute('data-original-value');

    row.querySelector('.edit-btn').style.display = 'flex';
    row.querySelector('.delete-btn').style.display = 'flex';

    row.querySelector('.save-btn').style.display = 'none';
    row.querySelector('.cancel-btn').style.display = 'none';

    var prompts = row.querySelectorAll('.prompt-text');
    prompts.forEach(function (prompt) {
        prompt.style.display = 'none';
    });
}

//save edited programme row
function saveRow(programmeId) {
    const form = document.getElementById('edit-programme-form-' + programmeId);
    const row = document.getElementById('row-programme-' + programmeId);

    let isValid = true;

    //validate
    isValid &= checkEmpty(row, '#programme-name-empty');
    isValid &= checkProgrammeNameFormat(row);
    isValid &= checkNewProgrammeChangeExits(row);
    isValid &= checkDuplicateProgrammeName(row);

    if (isValid) {
        const hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', 'programmeId');
        hiddenInput.setAttribute('value', programmeId);
        form.appendChild(hiddenInput);
        form.submit();
    }
}

// check programme name by passsing html element id
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

function checkProgrammeNameFormatByElementId() {
    var newProgrammeName = document.getElementById('new-programme-name-fill-space').value;
    var newProgrammeNamePattern = /^(?=.*[a-zA-Z])[a-zA-Z0-9 ()]{1,100}$/;
    var programmeNameError = document.getElementById('new-programme-name-error');

    if (newProgrammeName !== '' && !newProgrammeNamePattern.test(newProgrammeName)) {
        programmeNameError.style.display = 'block';
        return false;
    } else if (newProgrammeName == '') {
        programmeNameError.style.display = 'none';
        return false;
    } else {
        programmeNameError.style.display = 'none';
        return true;
    }
}

function checkDuplicateProgrammeNameByElementId() {
    var newProgrammeName = document.getElementById('new-programme-name-fill-space').value.trim().toLowerCase();
    var allProgrammeNames = Array.from(document.querySelectorAll('.programme-name'))
        .map(span => span.textContent.trim().toLowerCase());
    var programmeNameExistedError = document.getElementById('new-programme-name-existed');

    if (allProgrammeNames.includes(newProgrammeName)) {
        programmeNameExistedError.style.display = 'block';
        return false;
    }
    programmeNameExistedError.style.display = 'none';
    return true;
}

//add new programme to list
document.getElementById('add-programme-submit-button').addEventListener('click', function (event) {
    event.preventDefault();

    var valid = true;

    valid &= checkElementEmpty('new-programme-name-fill-space', 'new-programme-name-empty');

    valid &= checkProgrammeNameFormatByElementId();
    valid &= checkDuplicateProgrammeNameByElementId();

    if (valid) {
        document.getElementById('add-programme-form').submit();
    }
});

// close add programme modal
document.querySelectorAll('.close-button').forEach(function (button) {
    button.addEventListener('click', function () {
        //reset form
        document.getElementById('add-programme-form').reset();

        //hide prompt text
        var prompts = document.querySelectorAll('.prompt-text');
        prompts.forEach(function (prompt) {
            prompt.style.display = 'none';
        });
    });
});


// delete programme
//confirm delete 
document.addEventListener("DOMContentLoaded", function () {
    window.confirmDelete = function (programmeId) {
        if (confirm("Are you sure you want to delete this programme?")) {
            const deleteForm = document.getElementById('delete-programme-form');
            const deleteInput = document.getElementById('delete-programme-id');
            deleteInput.value = programmeId;
            deleteForm.submit();
        }
    }
});

// search table by programme name 
function searchTable() {
    console.log('Search started');
    var input = document.getElementById("search-programme-input");
    var filter = input.value.toUpperCase();
    var tbody = document.getElementById("programme-table-tbody");
    var tr = tbody.getElementsByTagName("tr");

    var clearBtn = document.getElementById("clear-input");
    clearBtn.style.display = input.value ? "flex" : "none";

    var isFound = false;
    for (i = 0; i < tr.length; i++) {
        var isMatch = false;
        var row = tr[i];

        // skip to search the nested table and prompt text
        if (row.classList.contains('class-details-row') || row.classList.contains('admin-details-row') || row.classList.contains('promt-text')) {
            continue;
        }

        var parentTable = row.closest('table');
        if (parentTable && (parentTable.id === 'class-details-table' || parentTable.id === 'admin-details-table')) {
            continue;
        }

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
        if (isMatch) {
            tr[i].style.display = "";
        }
        else {
            tr[i].style.display = 'none';

            adminDetailsRow = tr[i + 1];
            adminDetailsRow.style.display = 'none';

            // 初始化 deviceDetailsRow 为 classDetailsRow 的下一个兄弟节点
            var classDetailsRow = adminDetailsRow.nextElementSibling;

            // 迭代兄弟节点，直到找到第一个非嵌套的 tr
            while (classDetailsRow && classDetailsRow.closest('table').id === 'admin-details-table') {
                classDetailsRow = deviceDetailsRow.nextElementSibling;
            }

            if (classDetailsRow) {
                classDetailsRow.style.display = 'none';
            }

            var elements = tr[i].querySelectorAll('div.expandable');
            elements.forEach(function (element) {
                element.querySelector('i').classList.remove('mdi-chevron-up');
                element.querySelector('i').classList.add('mdi-chevron-down');
            });

        }
    }

    var noFoundRow = document.getElementById("no-found-row");
    if (noFoundRow) {
        noFoundRow.style.display = !isFound && filter ? "block" : "none";
    }
    console.log('Search completed');
}

//clear search input
function clearSearch() {
    var input = document.getElementById("search-programme-input");
    input.value = "";
    input.focus();
    searchTable();
}

//sort table by programme name
// sort table
function sortTable(tableId, col, reverse) {
    var table = document.getElementById(tableId);
    var tbody = table.getElementsByTagName('tbody')[0];
    var rows = Array.prototype.slice.call(tbody.rows, 0);

    // filter the class-details-row
    var filteredRows = rows.filter(function (row) {
        var parentTable = row.closest('table');
        return !row.classList.contains('class-details-row') && (!parentTable || parentTable.id !== 'class-details-table') && !row.classList.contains('admin-details-row') && (!parentTable || parentTable.id !== 'admin-details-table');
    });


    reverse = -((+reverse) || -1);
    filteredRows = filteredRows.sort(function (a, b) {
        var aCell = a.cells[col];
        var bCell = b.cells[col];

        if (!aCell || !bCell) return 0;

        var aValue = aCell.innerText.trim();
        var bValue = bCell.innerText.trim();

        if (aValue.endsWith('%') && bValue.endsWith('%')) {
            var aNum = parseFloat(aValue.slice(0, -1));
            var bNum = parseFloat(bValue.slice(0, -1));
            return reverse * (aNum - bNum);
        } else if (!isNaN(aValue) && !isNaN(bValue)) {
            return reverse * (parseFloat(aValue) - parseFloat(bValue));
        } else {
            return reverse * aValue.localeCompare(bValue);
        }
    });

    filteredRows.forEach(function (row, index) {
        row.cells[0].innerText = index + 1;
        tbody.appendChild(row);

        var nextRowIndex = rows.indexOf(row) + 1;
        var nextNextRowIndex = rows.indexOf(row) + 2;
        var nextRow = rows[nextRowIndex];
        var nextNextRow = rows[nextNextRowIndex];

        if (nextRow && !filteredRows.includes(nextRow)) {
            tbody.appendChild(nextRow);
        }

        if (nextNextRow && !filteredRows.includes(nextNextRow)) {
            tbody.appendChild(nextNextRow);
        }
    });
}

function addSortHandlers() {
    var headers = document.querySelectorAll('.sortable');
    headers.forEach(function (header) {
        var colIndex = header.getAttribute('data-sort-column');
        var asc = true;
        header.addEventListener('click', function () {
            sortTable('programme-table', colIndex, asc);
            asc = !asc;
        });
    });
}

document.addEventListener('DOMContentLoaded', addSortHandlers);
