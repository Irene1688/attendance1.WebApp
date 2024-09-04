// display and hide class detail
function toggleClassDetails(staffId, button) {
    var detailsRow = document.getElementById('class-details-row-' + staffId);
    var detailsContent = detailsRow.querySelector('.class-details-content');

    if (detailsRow.style.display === 'none' || !detailsRow.style.display) {
        detailsRow.style.display = 'table-row';
        var actualHeight = detailsContent.scrollHeight + 'px';
        detailsContent.style.maxHeight = actualHeight;
        detailsContent.classList.add('expanded');
        button.querySelector('i').classList.remove('mdi-chevron-down');
        button.querySelector('i').classList.add('mdi-chevron-up');
        button.querySelector('span').textContent = 'Hide Classes';
    } else {
        detailsContent.classList.remove('expanded');
        detailsContent.style.maxHeight = '0';
        detailsContent.addEventListener('transitionend', function onTransitionEnd() {
            detailsContent.removeEventListener('transitionend', onTransitionEnd);
            detailsRow.style.display = 'none';
            button.querySelector('i').classList.remove('mdi-chevron-up');
            button.querySelector('i').classList.add('mdi-chevron-down');
            button.querySelector('span').textContent = 'Display Classes';
        });
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

// edit lecturer
// display button and form
function editRow(staffId) {
    const row = document.getElementById('row-lecturer-' + staffId);
    //name 
    //row.querySelector('.admin-name').style.display = 'none';
    //row.querySelector('.admin-name-input').style.display = 'inline';

    //id
    row.querySelector('.lecturer-id').style.display = 'none';
    row.querySelector('.lecturer-id-input').style.display = 'inline';
                        
    //email             
    row.querySelector('.lecturer-email').style.display = 'none';
    row.querySelector('.lecturer-email-input').style.display = 'inline';
                        
    //programme         
    //row.querySelector('.lecturer-under-programme').style.display = 'none';
    //row.querySelector('.lecturer-under-programme-input').style.display = 'inline';
    //setDefaultSelectProgramme(row, '.lecturer-under-programme-input');

    //buttons
    row.querySelector('.edit-btn').style.display = 'none';
    row.querySelector('.delete-btn').style.display = 'none';

    row.querySelector('.save-btn').style.display = 'flex';
    row.querySelector('.cancel-btn').style.display = 'flex';
}

// cancel edit lecturer
// update the button display
function cancelEdit(staffId) {
    const row = document.getElementById('row-lecturer-' + staffId);
    // show initial display
    //row.querySelector('.lecturer-name').style.display = 'inline';
    row.querySelector('.lecturer-id').style.display = 'inline';
    row.querySelector('.lecturer-email').style.display = 'inline';
    //row.querySelector('.lecturer-under-programme').style.display = 'inline';

    // Restore the input's value to its original value
    // name
    //const NameInput = row.querySelector('.admin-name-input');
    //NameInput.style.display = 'none';
    //NameInput.value = NameInput.getAttribute('data-original-value');

    // id
    const IdInput = row.querySelector('.lecturer-id-input');
    IdInput.style.display = 'none';
    IdInput.value = IdInput.getAttribute('data-original-value');

    // email
    const EmailInput = row.querySelector('.lecturer-email-input');
    EmailInput.style.display = 'none';
    EmailInput.value = EmailInput.getAttribute('data-original-value');

    // programme
    //const ProgrammeInput = row.querySelector('.admin-under-programme-input');
    //ProgrammeInput.style.display = 'none';
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

//save edited lecturer row
function saveRow(staffId) {
    const form = document.getElementById('edit-lecturer-form-' + staffId);
    const row = document.getElementById('row-lecturer-' + staffId);
    const lecturerName = row.querySelector('.lecturer-name').textContent.trim();

    let isValid = true;

    // validate
    //check change
    isValid &= checkAnyChange(row, '#form-data-no-change-error');

    // id
    isValid &= checkEmpty(row, '.lecturer-id-input', '#lecturer-id-empty');
    isValid &= checkStringFormat(row, '.lecturer-id-input', '#lecturer-id-error', '^[a-zA-Z0-9]+$');
    isValid &= checkDuplicate(row, '.lecturer-id-input', '#lecturer-id-existed', '.lecturer-id');

    // name
    //isValid &= checkEmpty(row, '.admin-name-input', '#admin-name-empty');
    //isValid &= checkStringFormat(row, '.admin-name-input', '#admin-name-error', '^[a-zA-Z0-9\\s]+$');
    //isValid &= checkDuplicate(row, '.admin-name-input', '#admin-name-existed', '.admin-name');

    // email
    isValid &= checkEmpty(row, '.lecturer-email-input', '#lecturer-email-empty');
    isValid &= checkStringFormat(row, '.lecturer-email-input', '#lecturer-email-error', '^[^\\s]+@uts\.edu\.my$');
    isValid &= checkDuplicate(row, '.lecturer-email-input', '#lecturer-email-existed', '.lecturer-email');

    // programme
    //isValid &= checkStringFormat(row, '.admin-under-programme-input', '#admin-under-programme-error', '^(?=.*[a-zA-Z])[a-zA-Z0-9 ()]{1,100}$');

    if (isValid) {
        const hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', 'lecturerName');
        hiddenInput.setAttribute('value', lecturerName);
        form.appendChild(hiddenInput);
        form.submit();
    }
}

// check lecturer name by passsing html element id
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

//add new lecturer to list
document.getElementById('add-lecturer-submit-button').addEventListener('click', function (event) {
    event.preventDefault();

    var valid = true;

    // id
    valid &= checkElementEmpty('new-lecturer-id-fill-space', 'new-lecturer-id-empty');
    valid &= checkStringFormatById('new-lecturer-id-fill-space', 'new-lecturer-id-error', '^[a-zA-Z0-9]+$');
    valid &= checkDuplicateById('new-lecturer-id-fill-space', 'new-lecturer-id-existed', '.lecturer-id')

    // name
    valid &= checkElementEmpty('new-lecturer-name-fill-space', 'new-lecturer-name-empty');
    valid &= checkStringFormatById('new-lecturer-name-fill-space', 'new-lecturer-name-error', '^[a-zA-Z0-9\\s]+$');

    // email 
    valid &= checkElementEmpty('new-lecturer-email-fill-space', 'new-lecturer-email-empty');
    valid &= checkStringFormatById('new-lecturer-email-fill-space', 'new-lecturer-email-error', '^[^\\s]+@uts\.edu\.my$');
    valid &= checkDuplicateById('new-lecturer-email-fill-space', 'new-lecturer-email-existed', '.lecturer-email')

    //programme
    //none

    if (valid) {
        document.getElementById('add-lecturer-form').submit();
    }
});

// clear add lecturer form input
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
    input.dispatchEvent(new Event('input')); // Trigger the input event to update the password
}

// default password
function updatePassword() {
    var lecturerName = document.getElementById('new-lecturer-name-fill-space').value;
    var passwordInput = document.getElementById('default-password-input');
    if (lecturerName.trim() === '') {
        passwordInput.value = 'name + 1234';
    } else {
        var firstName = lecturerName.split(' ')[0].toLowerCase();
        passwordInput.value = firstName + '1234';
    }
}


// close add lecturer modal
document.querySelectorAll('.close-button').forEach(function (button) {
    button.addEventListener('click', function () {
        //reset form
        document.getElementById('add-lecturer-form').reset();

        //hide prompt text
        var prompts = document.querySelectorAll('.prompt-text');
        prompts.forEach(function (prompt) {
            prompt.style.display = 'none';
        });
    });
});

// delete lecturer
//confirm delete 
document.addEventListener("DOMContentLoaded", function () {
    window.confirmDelete = function (staffId) {
        if (confirm("Are you sure you want to delete this lecturer? All of the related data and record will be deleted. This may affect the function of lecturer's side and student's side.")) {
            const deleteForm = document.getElementById('delete-lecturer-form');
            const deleteInput = document.getElementById('delete-lecturer-id');
            deleteInput.value = staffId;
            deleteForm.submit();
        }
    }
});

// search table by lecturerId & name & email
//function searchTable() {
//    console.log('Search started');
//    var input = document.getElementById("search-lecturer-input");
//    var filter = input.value.toUpperCase();
//    var tbody = document.getElementById("lecturer-table-tbody");
//    var tr = tbody.getElementsByTagName("tr");

//    var clearBtn = document.getElementById("clear-search-input");
//    clearBtn.style.display = input.value ? "flex" : "none";

//    var isFound = false;
//    for (i = 0; i < tr.length; i++) {
//        var isMatch = false;
//        var row = tr[i];

//        // skip to search the nested table and prompt text
//        if (row.classList.contains('class-details-row') || row.classList.contains('promt-text')) {
//            continue; 
//        }

//        var parentTable = row.closest('table');
//        if (parentTable && parentTable.id === 'class-details-table') {
//            continue;
//        }

//        td = tr[i].getElementsByTagName("td");
//        for (j = 0; j < td.length; j++) {
//            if (td[j]) {
//                span = td[j].querySelector("span");
//                if (span) {
//                    txtValue = span.textContent || span.innerText;
//                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
//                        isMatch = true;
//                        isFound = true;
//                        break;
//                    }
//                }
//            }
//        }
//        if (isMatch) {
//            tr[i].style.display = "";
//            //tr[i + 1].style.display = 'none';
//        }
//        else {
//            tr[i].style.display = 'none';

//            tr[i + 1].style.display = 'none';
//            var button = tr[i].querySelector('button.display-class-btn');
//            if (button) {
//                button.querySelector('i').classList.remove('mdi-chevron-up');
//                button.querySelector('i').classList.add('mdi-chevron-down');
//                button.querySelector('span').textContent = 'Display Classes';
//            }
//        }
//    }

//    var noFoundRow = document.getElementById("no-found-row");
//    if (noFoundRow) {
//        noFoundRow.style.display = !isFound && filter ? "block" : "none";
//    }
//    console.log('Search completed');
//}
//clear search input
//function clearSearch() {
//    var input = document.getElementById("search-lecturer-input");
//    input.value = "";
//    input.focus();
//    searchTable();
//}

//customize
function searchTable() {
    console.log('Search started');
    var input = document.getElementById("search-lecturer-input");
    var filter = input.value.toUpperCase();
    var tbody = document.getElementById("lecturer-table-tbody");
    var tr = tbody.getElementsByTagName("tr");

    var clearBtn = document.getElementById("clear-search-input");
    clearBtn.style.display = input.value ? "flex" : "none";

    var isFound = false;

    // 外层表格的搜索
    for (i = 0; i < tr.length; i++) {
        var isMatch = false;
        var row = tr[i];

        // 跳过嵌套表格和提示文本行
        if (row.classList.contains('class-details-row') || row.classList.contains('promt-text')) {
            continue;
        }

        var parentTable = row.closest('table');
        if (parentTable && parentTable.id === 'class-details-table') {
            continue;
        }

        var td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j]) {
                var span = td[j].querySelector("span");
                var txtValue = span ? (span.textContent || span.innerText) : (td[j].textContent || td[j].innerText);
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    isMatch = true;
                    isFound = true;
                    break;
                }
            }
        }

        if (isMatch) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = 'none';
            tr[i + 1].style.display = 'none';
            var button = tr[i].querySelector('button.display-class-btn');
            if (button) {
                button.querySelector('i').classList.remove('mdi-chevron-up');
                button.querySelector('i').classList.add('mdi-chevron-down');
                button.querySelector('span').textContent = 'Display Classes';
            }
        }
    }

    // 嵌套表格的搜索
    for (i = 0; i < tr.length; i++) {
        if (tr[i].classList.contains('class-details-row')) {

            var nestedTable = tr[i].querySelector('#class-details-table');
            if (nestedTable) {
                var nestedTr = nestedTable.getElementsByTagName("tr");
                for (var k = 0; k < nestedTr.length; k++) {
                    // 跳过已经找到匹配的行的嵌套表格搜索
                    if (nestedTr[k].closest('table').id === 'class-details-table') {
                        var parentRow = tr[i].closest('.class-details-row').previousElementSibling;
                        if (parentRow.style.display !== 'none') {
                            break;
                        }
                    }
                    var nestedTd = nestedTr[k].getElementsByTagName("td");
                    for (var j = 0; j < nestedTd.length; j++) {
                        if (nestedTd[j]) {
                            var txtValue = nestedTd[j].textContent || nestedTd[j].innerText;
                            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                                isFound = true;
                                nestedTr[k].style.display = "";

                                // 向上查找显示外层表格行
                                var outerRow = tr[i].previousElementSibling;
                                while (outerRow && outerRow.closest('table').id === 'class-details-table') {
                                    outerRow = outerRow.previousElementSibling;
                                }
                                if (outerRow) {
                                    // tr[i] is match table-details row
                                    tr[i].style.display = "table-row";
                                    var detailsContent = tr[i].querySelector('.class-details-content');
                                    var actualHeight = detailsContent.scrollHeight + 'px';
                                    detailsContent.style.maxHeight = actualHeight;
                                    detailsContent.classList.add('expanded');
                                    var button = outerRow.querySelector('button.display-class-btn');
                                    button.querySelector('i').classList.remove('mdi-chevron-down');
                                    button.querySelector('i').classList.add('mdi-chevron-up');
                                    button.querySelector('span').textContent = 'Hide Classes';
                                }
                                break;
                            } else {
                                nestedTr[k].style.display = 'none';
                            }
                        }
                    }
                    if (k === nestedTr.length - 1 && isFound) {
                        outerRow.style.display = "";
                    }
                }
            }
        }
    }

    var noFoundRow = document.getElementById("no-found-row");
    if (noFoundRow) {
        noFoundRow.style.display = !isFound && filter ? "block" : "none";
    }
    console.log('Search completed');
}

function clearSearch() {
    var input = document.getElementById("search-lecturer-input");
    input.value = '';
    var clearBtn = document.getElementById("clear-search-input");
    clearBtn.style.display = "none";

    var tbody = document.getElementById("lecturer-table-tbody");
    var tr = tbody.getElementsByTagName("tr");

    // 显示所有外层表格行
    for (var i = 0; i < tr.length; i++) {
        if (!tr[i].classList.contains('class-details-row')) {
            tr[i].style.display = "";
        }
    }

    // 重置并显示所有内嵌表格行
    for (var i = 0; i < tr.length; i++) {
        if (tr[i].classList.contains('class-details-row')) {
            tr[i].style.display = "none";  // 默认隐藏内嵌表格行
            var nestedTable = tr[i].querySelector('#class-details-table');
            if (nestedTable) {
                var nestedTr = nestedTable.getElementsByTagName("tr");
                for (var k = 0; k < nestedTr.length; k++) {
                    nestedTr[k].style.display = "";  // 显示所有内嵌表格行
                }
            }
        }
    }

    // 重置所有展开/折叠按钮
    var buttons = document.querySelectorAll('button.display-class-btn');
    buttons.forEach(function (button) {
        button.querySelector('i').classList.remove('mdi-chevron-up');
        button.querySelector('i').classList.add('mdi-chevron-down');
        button.querySelector('span').textContent = 'Display Classes';
    });

    // 隐藏"未找到结果"的提示
    var noFoundRow = document.getElementById("no-found-row");
    if (noFoundRow) {
        noFoundRow.style.display = "none";
    }
}




// sort table
function sortTable(tableId, col, reverse) {
    var table = document.getElementById(tableId);
    var tbody = table.getElementsByTagName('tbody')[0];
    var rows = Array.prototype.slice.call(tbody.rows, 0);

    // filter the class-details-row
    var filteredRows = rows.filter(function (row) {
        var parentTable = row.closest('table');
        return !row.classList.contains('class-details-row') && (!parentTable || parentTable.id !== 'class-details-table');
    });
    console.log(filteredRows);

    
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
        var nextRow = rows[nextRowIndex];

        if (nextRow && !filteredRows.includes(nextRow)) {
            tbody.appendChild(nextRow);
        }
    });
}

function addSortHandlers() {
    var headers = document.querySelectorAll('.sortable');
    headers.forEach(function (header) {
        var colIndex = header.getAttribute('data-sort-column');
        var asc = true;
        header.addEventListener('click', function () {
            sortTable('lecturer-table', colIndex, asc);
            asc = !asc;
        });
    });
}

document.addEventListener('DOMContentLoaded', addSortHandlers);
