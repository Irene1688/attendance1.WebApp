// display and hide device detail
//function toggleDeviceDetails(studentId, element) {
//    var detailsRow = document.getElementById('device-details-row-' + studentId);
//    var detailsContent = detailsRow.querySelector('.device-details-content');

//    if (detailsRow.style.display === 'none' || !detailsRow.style.display) {
//        detailsRow.style.display = 'table-row';
//        var actualHeight = detailsContent.scrollHeight + 'px';
//        detailsContent.style.maxHeight = actualHeight;
//        detailsContent.classList.add('expanded');
//        element.querySelector('i').classList.remove('mdi-chevron-down');
//        element.querySelector('i').classList.add('mdi-chevron-up');

//    } else {
//        detailsContent.classList.remove('expanded');
//        detailsContent.style.maxHeight = '0';
//        detailsContent.addEventListener('transitionend', function onTransitionEnd() {
//            detailsContent.removeEventListener('transitionend', onTransitionEnd);
//            detailsRow.style.display = 'none';
//            element.querySelector('i').classList.remove('mdi-chevron-up');
//            element.querySelector('i').classList.add('mdi-chevron-down');
//           // element.querySelector('span').textContent = 'Display Classes';
//        });
//    }
//}

// display and hide class detail
function toggleClassDetails(studentId, element) {
    var detailsRow = document.getElementById('class-details-row-' + studentId);
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

// disable remove button if no device available 
document.addEventListener('DOMContentLoaded', function () {
    const rows = document.querySelectorAll('tr[id^="row-student-"]');

    rows.forEach(function (row) {
        const noDeviceRow = row.querySelector('.no-device-row');
        const removeDeviceButton = row.querySelector('.remove-device-btn');

        if (noDeviceRow) {
            removeDeviceButton.disabled = true;
        }
    });
});


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

        currentValue = input.value.trim();
      
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

// edit student Id
// display button and form
function editRow(studentId) {
    const row = document.getElementById('row-student-' + studentId);

    //id
    row.querySelector('.student-id').style.display = 'none';
    row.querySelector('.student-id-input').style.display = 'inline';
   
    //buttons
    row.querySelector('.edit-btn').style.display = 'none';
    row.querySelector('.remove-device-btn').style.display = 'none';
    row.querySelector('.delete-btn').style.display = 'none';

    row.querySelector('.save-btn').style.display = 'flex';
    row.querySelector('.cancel-btn').style.display = 'flex';
}

// cancel edit programme
// update the button display
function cancelEdit(studentId) {
    const row = document.getElementById('row-student-' + studentId);

    // show initial display
    row.querySelector('.student-id').style.display = 'inline';

    // Restore the input's value to its original value
    // id
    const IdInput = row.querySelector('.student-id-input');
    IdInput.style.display = 'none';
    IdInput.value = IdInput.getAttribute('data-original-value');

    // buttons
    row.querySelector('.edit-btn').style.display = 'flex';
    row.querySelector('.remove-device-btn').style.display = 'flex';
    row.querySelector('.delete-btn').style.display = 'flex';

    row.querySelector('.save-btn').style.display = 'none';
    row.querySelector('.cancel-btn').style.display = 'none';

    //prompt text reset
    var prompts = row.querySelectorAll('.prompt-text');
    prompts.forEach(function (prompt) {
        prompt.style.display = 'none';
    });

    // Check if device is available
    const noDeviceRow = row.querySelector('.no-device-row');
    const removeDeviceButton = row.querySelector('.remove-device-btn');
    if (noDeviceRow) {
        removeDeviceButton.disabled = true;
    } else {
        removeDeviceButton.disabled = false;
    }
}

//save edited student row
function saveRow(studentId) {
    const form = document.getElementById('edit-student-form-' + studentId);
    const row = document.getElementById('row-student-' + studentId);
    const studentName = row.querySelector('.student-name').textContent.trim();

    let isValid = true;

    // validate
    //check change
    isValid &= checkAnyChange(row, '#form-data-no-change-error');

    // id
    isValid &= checkEmpty(row, '.student-id-input', '#student-id-empty');
    isValid &= checkStringFormat(row, '.student-id-input', '#student-id-error', '^[A-Z]{3}\\d{8}$');
    isValid &= checkDuplicate(row, '.student-id-input', '#student-id-existed', '.student-id');

    

    if (isValid && confirmedEdit) {
        confirmedEdit = confirmEdit();

        if (confirmedEdit) {
            const hiddenInput = document.createElement('input');
            hiddenInput.setAttribute('type', 'hidden');
            hiddenInput.setAttribute('name', 'studentName');
            hiddenInput.setAttribute('value', studentName);
            form.appendChild(hiddenInput);
            form.submit();
        }
    }
}

// edit student
// confirm edit
document.addEventListener("DOMContentLoaded", function () {
    window.confirmEdit = function (studentId) {
        if (confirm("Are you sure you want to edit this student ID? You need to inform the student to login with new student ID in order to avoid he/she re-register new account with old student ID.")) {
            return true;
        }
        else {
            return false;
        }
    }
});

// delete student
// confirm delete 
document.addEventListener("DOMContentLoaded", function () {
    window.confirmDelete = function (studentId) {
        if (confirm("Are you sure you want to delete this student? All of the related data and record will be deleted.")) {
            const deleteForm = document.getElementById('delete-student-form');
            const deleteInput = document.getElementById('delete-student-id');
            deleteInput.value = studentId;
            deleteForm.submit();
        }
    }
});

//remove device
//confirm remove
document.addEventListener("DOMContentLoaded", function () {
    window.confirmRemove = function (studentId) {
        if (confirm("Are you sure you want to remove this device for the student? Student need to login again to have at least a binding device to take attendnace.")) {
            const specifiedRow = document.getElementById('row-student-' + studentId);
            const deviceId = specifiedRow.querySelector('.device-id-' + studentId).innerText;

            const removeForm = document.getElementById('remove-device-form');
            const removeInput = document.getElementById('remove-device-id');
            const studentInput = document.getElementById('related-student-id');
            removeInput.value = deviceId;
            studentInput.value = studentId;
            removeForm.submit();
        }
    }
});

// search table by studentId & name & email
function searchTable() {
    console.log('Search started');
    var input = document.getElementById("search-student-input");
    var filter = input.value.toUpperCase();
    var tbody = document.getElementById("student-table-tbody");
    var tr = tbody.getElementsByTagName("tr");

    var clearBtn = document.getElementById("clear-search-input");
    clearBtn.style.display = input.value ? "flex" : "none";

    var isFound = false;
    for (i = 0; i < tr.length; i++) {
        var isMatch = false;
        var row = tr[i];

        // skip to search the nested table and prompt text
        if (row.classList.contains('class-details-row') || row.classList.contains('promt-text')) {
            continue; 
        }

        var parentTable = row.closest('table');
        if (parentTable && (parentTable.id === 'class-details-table')) {
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

            classDetailsRow = tr[i + 1];
            classDetailsRow.style.display = 'none';

            //// 初始化 deviceDetailsRow 为 classDetailsRow 的下一个兄弟节点
            //var deviceDetailsRow = classDetailsRow.nextElementSibling;

            //// 迭代兄弟节点，直到找到第一个非嵌套的 tr
            //while (deviceDetailsRow && deviceDetailsRow.closest('table').id === 'class-details-table') {
            //    deviceDetailsRow = deviceDetailsRow.nextElementSibling;
            //}

            //if (deviceDetailsRow) {
            //    deviceDetailsRow.style.display = 'none';
            //}

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
    var input = document.getElementById("search-student-input");
    input.value = "";
    input.focus();
    searchTable();
}

// sort table
function sortTable(tableId, col, reverse) {
    var table = document.getElementById(tableId);
    var tbody = table.getElementsByTagName('tbody')[0];
    var rows = Array.prototype.slice.call(tbody.rows, 0);

    // filter the class-details-row
    var filteredRows = rows.filter(function (row) {
        var parentTable = row.closest('table');
        return !row.classList.contains('class-details-row') && (!parentTable || parentTable.id !== 'class-details-table') && !row.classList.contains('device-details-row') && (!parentTable || parentTable.id !== 'device-details-table');
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
        //var nextNextRowIndex = rows.indexOf(row) + 2;
        var nextRow = rows[nextRowIndex];
        //var nextNextRow = rows[nextNextRowIndex];

        if (nextRow && !filteredRows.includes(nextRow)) {
            tbody.appendChild(nextRow);
        }

        //if (nextNextRow && !filteredRows.includes(nextNextRow)) {
        //    tbody.appendChild(nextNextRow);
        //}
    });
}

function addSortHandlers() {
    var headers = document.querySelectorAll('.sortable');
    headers.forEach(function (header) {
        var colIndex = header.getAttribute('data-sort-column');
        var asc = true;
        header.addEventListener('click', function () {
            sortTable('student-table', colIndex, asc);
            asc = !asc;
        });
    });
}

document.addEventListener('DOMContentLoaded', addSortHandlers);
