//display side menu class list
document.addEventListener("DOMContentLoaded", function () {
    function setupClassesMenu(menuId, menuTitleId) {
        var classesSidemenu = document.getElementById(menuId);
        var classesMenuTitle = document.getElementById(menuTitleId);
        var userClickedMenuTitle = false;

        function initializeMenu(forceOpen = false) {
            if (document.getElementById("wrapper").classList.contains('enlarged') && !forceOpen) {
                return;
            }

            classesMenuTitle.classList.add("subdrop");
            classesSidemenu.style.height = "0";
            classesSidemenu.style.transition = "height 0.8s ease";
            classesSidemenu.style.overflow = "hidden";
            classesSidemenu.style.display = "block";
            classesSidemenu.offsetHeight;
            //classesSidemenu.style.transition = "height 0.8s ease";
            classesSidemenu.style.height = classesSidemenu.scrollHeight + "px";
        }

        classesMenuTitle.addEventListener("click", function () {
            userClickedMenuTitle = true;
            classesSidemenu.style.transition = "none";
            classesSidemenu.style.height = classesSidemenu.scrollHeight + "px";
            classesSidemenu.offsetHeight;
            classesSidemenu.style.overflow = "hidden";
        });

        var classesSidemenuObserver = new MutationObserver(function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (!userClickedMenuTitle && classesSidemenu.style.display === '') {
                        setTimeout(() => initializeMenu(), 300);
                    }
                }
            }
        });
        classesSidemenuObserver.observe(classesSidemenu, {
            attributes: true
        });

        return { menu: classesSidemenu, title: classesMenuTitle, initialize: initializeMenu };
    }

    // Initialize the menu behavior for both active and inactive classes
    var activeMenu = document.getElementById("active-classes-sidemenu") && document.getElementById("active-classes-menu-title")
        ? setupClassesMenu("active-classes-sidemenu", "active-classes-menu-title")
        : null;

    var inactiveMenu = document.getElementById("inactive-classes-sidemenu") && document.getElementById("inactive-classes-menu-title")
        ? setupClassesMenu("inactive-classes-sidemenu", "inactive-classes-menu-title")
        : null;

    // find the li element that class contains "active" and expand it's parent element menu
    var activeLi = document.querySelector('li.active');
    if (activeLi) {
        var parentMenu = activeLi.closest('#active-classes-sidemenu, #inactive-classes-sidemenu');
        if (parentMenu) {
            setTimeout(function () {
                if (parentMenu.id === 'active-classes-sidemenu' && activeMenu) {
                    activeMenu.initialize(true);
                } else if (parentMenu.id === 'inactive-classes-sidemenu' && inactiveMenu) {
                    inactiveMenu.initialize(true);
                }
            }, 300);
        }
    }
});


// dispaly class day respondingly in class details
document.addEventListener("DOMContentLoaded", function () {
    var classDaysData = document.getElementById("class-days-data").value;
    var classDaysArray = classDaysData.split(",").map(Number);

    var daysOfWeek = {
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday"
    };

    var classDaysDisplay = classDaysArray.map(function (day) {
        return daysOfWeek[day];
    });

    var classDaysString = classDaysDisplay.join(", ");

    document.getElementById("class-days-display").innerText = classDaysString;
});

//Morris chart
$(document).ready(function () {
    var totalStudent = JSON.parse(document.getElementById('data-enrolled-student').textContent);
    var totalAttendance = JSON.parse(document.getElementById('morris-data-attendance').textContent);

    var recordId = parseInt(document.getElementById('record-id').textContent);
    var latestAttendanceDateStr = new Date(document.getElementById('latest-attendance-date').textContent);

    console.log(recordId);
    console.log(latestAttendanceDateStr)

    function formatDate(date) {
        var day = date.getDate().toString().padStart(2, '0');
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var year = date.getFullYear().toString().slice(-2);
        return day + "/" + month + "/" + year;
    }

    var latestDate = new Date(latestAttendanceDateStr)
    var formattedLatestDate = formatDate(latestDate)
   
    var presentCount = totalAttendance.filter(function (attendance) {
        var formattedAttendanceDate = formatDate(new Date(attendance.dateAndTime));
        //console.log(formattedAttendanceDate);
        //console.log(formattedLatestDate);
        //console.log(attendance.attendanceId);
        //console.log(recordId);
        return formattedAttendanceDate === formattedLatestDate &&
            attendance.attendanceId === recordId;
    }).length;

    var absentCount = totalStudent.length - presentCount;

    new Morris.Donut({
        element: 'attendance-pie-chart',
        data: [
            { label: "Absent", value: absentCount },
            { label: "Present", value: presentCount },
        ],
        colors: ['#fa6e7b', '#4bd396']
    });
});

$(document).ready(function () {
    // 监听复选框变化事件
    $('#showPastNoAttendance, #showFutureNoAttendance').change(function () {
        updateWeekHeaders(); // 复选框变化时重新计算和设置周标题的显示
    });

    // 初始化页面时调用一次，确保初始状态正确
    //updateWeekHeaders();
});



function updateWeekHeaders() {
    var showPast = $('#showPastNoAttendance').is(':checked');
    var showFuture = $('#showFutureNoAttendance').is(':checked');
    var weekLengths = JSON.parse(document.getElementById('thead-data-week-length').textContent);

    $('.past-no-attendance').toggle(showPast);
    $('.future-no-attendance').toggle(showFuture);
    var weekIndex = 0;
    var previousStartIndex = 0;

    $('thead .week-header').each(function () {
        var attendanceDays = 0;
        var noAttendanceDays = 0;
        

        var weekHeader = $(this);
        //var startIndex = weekHeader.index();
        if (weekHeader.index() == 1) {
            var startIndex = 2;
            previousStartIndex = startIndex;
        }
        else {
            var startIndex = previousStartIndex + weekLengths[weekIndex-1];
            previousStartIndex = startIndex;
        }

        //var startIndex = 1 + weekLengths[weekIndex];
        var endIndex = startIndex + weekLengths[weekIndex];
        //var endIndex = startIndex + parseInt(weekHeader.attr('colspan'));

        // Iterate over the days in the current week
        $('thead tr:nth-child(2) th').slice(startIndex, endIndex).each(function () {
            var type = $(this).attr('data-type'); // Get the type of the day
            this.outerHTML;

            if (type === 'future-no-attendance' && showFuture) {
                noAttendanceDays++;
            } else if (type === 'past-no-attendance' && showPast) {
                noAttendanceDays++;
            } else if (type === 'attendance') {
                attendanceDays++;
            }
        });

        // 计算新的 colspan 值
        var newColspan = attendanceDays + noAttendanceDays;

        // 根据新的 colspan 值设置周标题的显示
        if (newColspan == 0) {
            weekHeader.hide(); // 如果新的 colspan 为 0，隐藏当前周标题
        } else {
            weekHeader.attr('colspan', newColspan).show(); // 否则设置新的 colspan 并显示当前周标题
        }
        weekIndex++;
    });
}

//search table
function searchTable() {
    var input, filter, scope, tr, td, i, j, tfoot, txtValue;
    input = document.getElementById("search-input");
    filter = input.value.toUpperCase();
    scope = document.getElementById("attendance-tbody");
    tr = scope.getElementsByTagName("tr");
    tfoot = document.getElementById("attendance-tfoot");

    var clearBtn = document.getElementById("clear-input");
    if (input.value) {
        clearBtn.style.display = "inline";
    } else {
        clearBtn.style.display = "none";
    }

    var isFound = false;
    for (i = 0; i < tr.length; i++) {
        var isMatch = false;
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j]) {
                txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    isMatch = true;
                    isFound = true;
                    break;
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

    if (tfoot) {
        tfoot.style.display = filter ? "none" : "";
    }
}

//clear search input
function clearSearch() {
    var input = document.getElementById("search-input");
    input.value = "";
    input.focus();
    searchTable();
}

// change attendance table style
var currentStyle = 1;

function toggleStyle() {

    var cells = document.querySelectorAll('.cell');

    switch (currentStyle) {
        case 1:
            for (var i = 0; i < cells.length; i++) {
                cells[i].innerHTML = cells[i].getAttribute('data-style2');
            }
            currentStyle = 2;
            break;
        case 2:
            for (var i = 0; i < cells.length; i++) {
                cells[i].innerHTML = cells[i].getAttribute('data-style3');
            }
            currentStyle = 3;
            break;
        case 3:
            for (var i = 0; i < cells.length; i++) {
                cells[i].innerHTML = cells[i].getAttribute('data-style1');
            }
            currentStyle = 1;
            break;
    }
}

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

    rows.forEach(function (row) {
        tbody.appendChild(row);
    });
}

function addSortHandlers() {
    var headers = document.querySelectorAll('.sortable');
    headers.forEach(function (header) {
        var colIndex = header.getAttribute('data-sort-column');
        var asc = true;
        header.addEventListener('click', function () {
            sortTable('attendance-table', colIndex, asc);
            asc = !asc;
        });
    });
}

document.addEventListener('DOMContentLoaded', addSortHandlers);


//Validate add student form
document.getElementById('submit-button').addEventListener('click', function (event) {
    event.preventDefault();
    validateForm();
});

function validateForm() {
    var studentIdInput = document.getElementById("student-id");
    var studentNameInput = document.getElementById("student-name");
    var csvFileInput = document.getElementById("csv-file-input");

    var modeError = document.getElementById("mode-error");
    var studentIdEmptyError = document.getElementById("studentid-empty");
    var studentIdFormatError = document.getElementById("studentid-error");
    var studentIdDuplicateError = document.getElementById("studentid-duplicate-error");
    var studentNameEmptyError = document.getElementById("studentname-empty");
    var studentNameFormatError = document.getElementById("studentname-error");
    var csvFileEmptyError = document.getElementById("csv-file-empty");
    var fileError = document.getElementById("file-error");
    var fileColumnError = document.getElementById("file-column-error");
    var fileStudentIdError = document.getElementById("file-studentid-error");
    var fileStudentIdDuplicateError = document.getElementById("csv-studentid-duplicate-error");
    var fileNameError = document.getElementById("file-name-error");

    modeError.style.display = "none";
    studentIdEmptyError.style.display = "none";
    studentIdFormatError.style.display = "none";
    studentIdDuplicateError.style.display = "none";
    studentNameEmptyError.style.display = "none";
    studentNameFormatError.style.display = "none";
    csvFileEmptyError.style.display = "none";
    fileError.style.display = "none";
    fileColumnError.style.display = "none";
    fileStudentIdError.style.display = "none";
    fileStudentIdDuplicateError.style.display = "none";
    fileNameError.style.display = "none";

    var studentIdPattern = /^[A-Z]{3}\d{8}$/;
    var studentNamePattern = /[a-zA-Z]/;

    var isValid = true;

    var enrolledStudents = JSON.parse(document.getElementById('data-enrolled-student').textContent);
    var existingStudentIds = enrolledStudents.map(student => student.studentID.toUpperCase());

    function checkDuplicate(studentId) {
        return existingStudentIds.includes(studentId.toUpperCase());
    }

    if ((csvFileInput.files.length === 0 && (studentIdInput.value.trim() === "" && studentNameInput.value.trim() === "")) ||
        (csvFileInput.files.length > 0 && (studentIdInput.value.trim() !== "" || studentNameInput.value.trim() !== ""))) {
        modeError.style.display = "block";
        studentIdEmptyError.style.display = "none";
        studentNameEmptyError.style.display = "none";
        isValid = false;
        return isValid;
    }

    if (csvFileInput.files.length > 0) {
        var file = csvFileInput.files[0];
        if (file.type !== "text/csv") {
            fileError.style.display = "block";
            isValid = false;
        } else {
            var reader = new FileReader();
            reader.onload = function (e) {
                var csvContent = e.target.result;
                var rows = csvContent.split("\n");
                var headers = rows[0].split(",");

                if (headers.length < 2 || headers[0].trim() !== "StudentID" || headers[1].trim() !== "Name") {
                    fileColumnError.style.display = "block";
                    isValid = false;
                } else {
                    for (var i = 1; i < rows.length; i++) {
                        var cols = rows[i].split(",");
                        if (cols.length >= 2) {
                            var studentId = cols[0].trim();
                            var studentName = cols[1].trim();
                            if (!studentIdPattern.test(studentId)) {
                                fileStudentIdError.style.display = "block";
                                isValid = false;
                                break;
                            }
                            if (checkDuplicate(studentId)) {
                                fileStudentIdDuplicateError.style.display = "block";
                                isValid = false;
                                break;
                            }
                            if (!studentNamePattern.test(studentName)) {
                                fileNameError.style.display = "block";
                                isValid = false;
                                break;
                            }
                        }
                    }
                }
                if (isValid) {
                    document.getElementById('add-student').submit();
                }
            };
            reader.readAsText(file);
        }
    } else {
        if (studentIdInput.value.trim() === "") {
            studentIdEmptyError.style.display = "block";
            isValid = false;
        } else if (!studentIdPattern.test(studentIdInput.value.trim())) {
            studentIdFormatError.style.display = "block";
            isValid = false;
        } else if (checkDuplicate(studentIdInput.value.trim())) {
            studentIdDuplicateError.style.display = "block";
            isValid = false;
        } else if (studentNameInput.value.trim() === "") {
            studentNameEmptyError.style.display = "block";
            isValid = false;
        } else if (!studentNamePattern.test(studentNameInput.value.trim())) {
            studentNameFormatError.style.display = "block";
            isValid = false;
        }

        if (isValid) {
            document.getElementById('add-student').submit();
        }
    }

    return isValid;
}

//search student for delete / remove student
function searchStudents() {
    var input, filter, studentItems, i, student, studentId, studentName;
    input = document.getElementById("search-delete-student-input");
    filter = input.value.toUpperCase();
    studentItems = document.getElementsByClassName("student-item");

    var clearBtn = document.getElementById("clear-delete-search-input");
    if (input.value) {
        clearBtn.style.display = "inline";
    } else {
        clearBtn.style.display = "none";
    }

    for (i = 0; i < studentItems.length; i++) {
        student = studentItems[i];
        studentId = student.querySelector("input").getAttribute("id");
        studentName = student.querySelector("label").innerText;
        if (studentId.toUpperCase().indexOf(filter) > -1 || studentName.toUpperCase().indexOf(filter) > -1) {
            student.style.display = "";
        } else {
            student.style.display = "none";
        }
    }
}

function clearStudentSearch() {
    var input = document.getElementById("search-delete-student-input");
    input.value = "";
    input.focus();
    searchStudents()
}

//validate delete student form
document.getElementById('submit-delete').addEventListener('click', function (event) {
    event.preventDefault();
    var IsValid = validateSelection();
    if (IsValid) {
        if (confirm("Are you sure you want to remove the selected student(s)? The attendance record of the student(s) will be removed also.")) {
            document.getElementById('delete-student').submit();
        }
    }
});

function validateSelection() {
    var selectionEmptyError = document.getElementById("selection-empty");
    selectionEmptyError.style.display = "none";
    const checkboxes = document.querySelectorAll('input[name="selectedStudentId"]:checked');

    if (checkboxes.length === 0) {
        selectionEmptyError.style.display = "block";
        return false;
    }
    return true; 
}

//validate delete class day form
document.getElementById('delete-class-day-submit').addEventListener('click', function (event) {
    event.preventDefault();
    var IsValid = validateClassDaySelection();
    if (IsValid) {
        if (confirm("Are you sure you want to delete the selected class day? The attendance record will be deleted also.")) {
            document.getElementById('delete-class-day').submit();
        }
    }
});

function validateClassDaySelection() {
    var selectionEmptyError = document.getElementById("selection-date-empty");
    selectionEmptyError.style.display = "none";
    var date = document.getElementById("selectedClassDay");

    // 检查日期选择是否为空
    if (date.selectedIndex === 0) {
        selectionEmptyError.style.display = "block";
        return false;
    }
    return true;
}

//reconfirm for delete class
document.getElementById('delete-class-btn').addEventListener('click', function (event) {
    event.preventDefault();
    if (confirm("Are you sure you want to delete the class? The attendance record will not be able to recovery.")) {
        document.getElementById('delete-class').submit();
    }
});


//student profile for change student attendance
document.addEventListener("DOMContentLoaded", function () {
    var closeButtons = document.querySelectorAll("button[data-dismiss='modal']");

    closeButtons.forEach(function (closeButton) {
        closeButton.addEventListener("click", function () {
            var prompts = document.querySelectorAll(".prompt-text");
            prompts.forEach(function (prompt) {
                prompt.style.display = "none";
            });
        });
    });

    // List to store changed statuses
    var changedStatuses = [];
    var initialStatuses = {};
    
   
    // Function to handle Change status button click
    function handleChangeStatusClick(event) {
        var button = event.target;
        var studentId = button.getAttribute("data-student-id");
        //var dateStr = button.getAttribute("data-date-time");
        //var dateParts = dateStr.split('/');
        //var date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T00:00:00.000Z`;
        var dateStr = button.getAttribute("data-date-time");
        var dateParts = dateStr.split('/');
        var now = new Date();

        var hours = String(now.getHours()).padStart(2, '0');
        var minutes = String(now.getMinutes()).padStart(2, '0');
        var seconds = String(now.getSeconds()).padStart(2, '0');

        var date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${hours}:${minutes}:${seconds}.000Z`;

        //var date = new Date(dateStr).toISOString();
        var attendanceId = parseInt(button.getAttribute("data-attendance-id"));
        var currentStatus = button.getAttribute("data-current-status");

        // Determine the action based on the current status
        var action = currentStatus === "Present" ? "delete" : "add";

        //record the initial status of the attendance id and date 
        if (!initialStatuses.hasOwnProperty(attendanceId)) {
            initialStatuses[attendanceId] = currentStatus;
        }

        // Remove any existing entries with the same attendanceId
        changedStatuses = changedStatuses.filter(status => status.AttendanceId !== attendanceId);

        // Only add the action different with initial status, if same, means no change made
        if (!(action === "delete" && initialStatuses[attendanceId] === "Absent") &&
            !(action === "add" && initialStatuses[attendanceId] === "Present")) {
            changedStatuses.push({ StudentId: studentId, AttendanceId: attendanceId, DateAndTime: date, Action: action });
        }

        // Toggle the status visually (optional, for user feedback)
        var statusCell = button.parentElement.previousElementSibling;
        if (currentStatus === "Present") {
            statusCell.textContent = "Absent";
            statusCell.classList.remove("text-success");
            statusCell.classList.add("text-danger");
            button.setAttribute("data-current-status", "Absent");
        } else {
            statusCell.textContent = "Present";
            statusCell.classList.remove("text-danger");
            statusCell.classList.add("text-success");
            button.setAttribute("data-current-status", "Present");
        }

        var prompts = document.querySelectorAll(".prompt-text");
        prompts.forEach(function (prompt) {
            prompt.style.display = "none";
        });

        // You can also toggle the status here if needed
        console.log("Change status for:", studentId, attendanceId);
    }

    // Attach click event listener to all Change status buttons
    var changeStatusButtons = document.querySelectorAll(".change-status-btn");
    changeStatusButtons.forEach(function(button) {
        button.addEventListener("click", handleChangeStatusClick);
    });

    var forms = document.querySelectorAll("form[id^='student-profile-attendance-form-']");
    forms.forEach(function (form) {
        form.addEventListener("submit", function (event) {
            // Check if changedStatuses is empty
            if (changedStatuses.length === 0) {
                // Prevent form submission
                event.preventDefault();

                // Display the empty change message
                var prompts = document.querySelectorAll(".prompt-text");
                prompts.forEach(function (prompt) {
                    //var studentId = prompt.id.replace("change-empty-", "");

                    //if (hasChanges) {
                    //    prompt.style.display = "none";
                    //} else {   
                        prompt.style.display = "block";
                });

                // Optionally, scroll to the top to show the message clearly
                window.scrollTo(0, 0);

                // Return false to stop further processing
                return false;
            }

            // Add changedStatuses list to the form as a hidden input
            var input = document.createElement("input");
            input.type = "hidden";
            input.name = "changedStatuses";
            input.value = JSON.stringify(changedStatuses);
            form.appendChild(input);

            // You can log the final data or perform any additional actions before submitting
            console.log("Submitting form with changed statuses:", changedStatuses);
        });
    });
});

// close modal
document.querySelectorAll('.close-button').forEach(function (button) {
    button.addEventListener('click', function () {
        //reset form
        document.getElementById('add-student').reset();
        document.getElementById('delete-student').reset();
        document.getElementById('delete-class-day').reset();

        //hide prompt text
        var prompts = document.querySelectorAll('.prompt-text');
        prompts.forEach(function (prompt) {
            prompt.style.display = 'none';
        });
    });
});

function closeModal() {
    Custombox.close();
    // Reset the form
    document.getElementById('delete-class-day').reset();
    document.getElementById('add-student').reset();
    document.getElementById('delete-student').reset();
    var prompts = document.querySelectorAll('.prompt-text');
    prompts.forEach(function (prompt) {
        prompt.style.display = 'none';
    });
}

function closeChangeStatusModal(studentId) {
    Custombox.close();

    // Reset the form
    var form = document.getElementById('student-profile-attendance-form-' + studentId);
    if (form) {
        form.reset();
    }

    // Hide any validation messages or other UI elements
    var prompts = document.querySelectorAll('.prompt-text');
    prompts.forEach(function (prompt) {
        prompt.style.display = 'none';
    });
}


