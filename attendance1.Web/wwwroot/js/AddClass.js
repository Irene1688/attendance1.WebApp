// generate year for session
document.addEventListener("DOMContentLoaded", function () {
    var yearSelect = document.getElementById("session-year-select");
    var currentYear = new Date().getFullYear();

    var option1 = document.createElement("option");
    option1.text = (currentYear - 1) + "/" + currentYear;
    option1.value = (currentYear - 1) + "/" + currentYear;
    yearSelect.add(option1);

    var option2 = document.createElement("option");
    option2.text = currentYear + "/" + (currentYear + 1);
    option2.value = currentYear + "/" + (currentYear + 1);
    yearSelect.add(option2);
});

//initialize date range picker
document.addEventListener("DOMContentLoaded", function () {
    var startDateInput = document.getElementById("start-date-select");
    var endDateInput = document.getElementById("end-date-select");

    if (startDateInput.value === "0001-01-01") {
        startDateInput.value = "";
        //startDateInput.placeholder = "dd/mm/yyyy";
    }

    if (endDateInput.value === "0001-01-01") {
        endDateInput.value = "";
        //endDateInput.placeholder = "dd/mm/yyyy";
    }
});


// validation for csv file
function validateCSV(text, fileInput) { 
    var allLines = text.split(/\r\n|\n/);
    var headers = allLines[0].split(',');
    var errorElement = document.getElementById('file-column-error');
    var studentIdErrorElement = document.getElementById('studentid-error');
    var nameErrorElement = document.getElementById('name-error');

    errorElement.style.display = 'none';
    studentIdErrorElement.style.display = 'none';
    nameErrorElement.style.display = 'none';

    if (!headers.includes('StudentID') || !headers.includes('Name')) {
        errorElement.style.display = 'block';
        fileInput.value = '';
        return;
    }

    var studentIdIndex = headers.indexOf('StudentID');
    var nameIndex = headers.indexOf('Name');
    var studentIdPattern = /^[A-Z]{3}\d{8}$/;
    var namePattern = /[a-zA-Z]/;
    

    for (var i = 1; i < allLines.length; i++) {
        var data = allLines[i].split(',');
        if (data.length !== headers.length) continue; // Skip if row does not match header length

        var studentId = data[studentIdIndex];
        var name = data[nameIndex];

        if (!studentIdPattern.test(studentId)) {
            studentIdErrorElement.style.display = 'block';
            fileInput.value = '';
            return;
        }

        if (!namePattern.test(name)) {
            nameErrorElement.style.display = 'block';
            fileInput.value = '';
            return;
        }
    }
}

document.getElementById('csv-file-input').addEventListener('change', function(event) {
    var fileInput = event.target;
    var file = fileInput.files[0];
    var errorDiv = document.getElementById('file-error');
    var emptyElement = document.getElementById('csv-file-empty');

    if (file) {
        var fileType =  file.name.split('.').pop().toLowerCase();

        if (fileType !== 'csv' && file.type !== 'text/csv') {
            errorDiv.style.display = 'block';
            fileInput.value = '';
        } else {
            errorDiv.style.display = 'none';
            var reader = new FileReader();
            reader.onload = function (e) {
                var text = e.target.result;
                validateCSV(text, fileInput);
            };
            reader.readAsText(file);
        }
    }

    if (fileInput.value === '') {
        emptyElement.style.display = 'block';
    } else {
        emptyElement.style.display = 'none';
    }
});

// Check validation
function checkEmpty(elementId, errorId) {
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

function checkCourseCode() {
    var courseCode = document.getElementById('course-code-fill').value;
    var courseCodePattern = /^[A-Z]{3}\s?\d{4}$/;
    var courseCodeError = document.getElementById('course-code-error');

    if (courseCode !== '' && !courseCodePattern.test(courseCode)) {
        courseCodeError.style.display = 'block';
        return false;
    } else if (courseCode == '') {
        courseCodeError.style.display = 'none';
        return false;
    } else {
        courseCodeError.style.display = 'none';
        return true;
    }
}

function checkCourseName() {
    var courseName = document.getElementById('course-name-fill').value;
    var courseNamePattern = /^(?=.*[A-Za-z])[A-Za-z\d\s]+$/;
    var courseNameError = document.getElementById('course-name-error');

    if (courseName !== '' && !courseNamePattern.test(courseName)) {
        courseNameError.style.display = 'block';
        return false;
    } else if (courseName == '') {
        courseCodeError.style.display = 'none';
        return false;
    } else {
        courseNameError.style.display = 'none';
        return true;
    }
}

function checkDateRange() {
    var startDateInput = document.getElementById('start-date-select');
    var endDateInput = document.getElementById('end-date-select');
    var startDate = new Date(startDateInput.value);
    var endDate = new Date(endDateInput.value);
    var dateEmpty = document.getElementById('date-empty');
    var dateError = document.getElementById('date-error');
    var dateGapError = document.getElementById('date-gap-error');

    if (startDateInput.value && endDateInput.value) {
        dateEmpty.style.display = 'none';

        if (endDate < startDate) {
            dateError.style.display = 'block';
            return false; //if end date is before start date
        } else if ((endDate - startDate) < (46 * 24 * 60 * 60 * 1000)) {
            dateError.style.display = 'none';
            dateGapError.style.display = 'block';
            return false;
        } else {
            dateError.style.display = 'none';
            dateGapError.style.display = 'none';
            return true;
        }
    }

    dateEmpty.style.display = 'block';
    return false; //if any of these two date is empty
}

function checkClassDay() {
    var Monday = document.getElementById('ClassDay-Mon').checked;
    var Tuesday = document.getElementById('ClassDay-Tue').checked;
    var Wednesday = document.getElementById('ClassDay-Wed').checked;
    var Thursday = document.getElementById('ClassDay-Thu').checked;
    var Friday = document.getElementById('ClassDay-Fri').checked;
    var classDayEmpty = document.getElementById('class-day-empty');

    if (!Monday && !Tuesday && !Wednesday && !Thursday && !Friday) {
        classDayEmpty.style.display = 'block';
        return false;
    } else {
        classDayEmpty.style.display = 'none';
        return true;
    }
}

document.getElementById('submit-button').addEventListener('click', function(event) {
    event.preventDefault();

    var valid = true;

    valid &= checkEmpty('programme-select', 'programme-empty');
    valid &= checkEmpty('session-month-select', 'session-month-empty');
    valid &= checkEmpty('session-year-select', 'session-year-empty');
    valid &= checkEmpty('course-code-fill', 'course-code-empty');
    valid &= checkEmpty('course-name-fill', 'course-name-empty');
    valid &= checkEmpty('csv-file-input', 'csv-file-empty');

    valid &= checkDateRange();
    valid &= checkClassDay();
    valid &= checkCourseCode();
    valid &= checkCourseName();

    if (valid) {
        document.getElementById('add-class').submit();
    }
});

//generate class days by joinning multiple values before submit form
document.addEventListener("DOMContentLoaded", function () {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            var selectedDays = [];
            checkboxes.forEach(function (cb) {
                if (cb.checked) {
                    selectedDays.push(cb.value);
                }
            });
            document.getElementById('classDaysHidden').value = selectedDays.join(', ');
        });
    });
});

//edit class days
document.addEventListener("DOMContentLoaded", function () {
    var classDaysHidden = document.getElementById("classDaysHidden");
    var classDays = classDaysHidden.value.split(", ");

    classDays.forEach(function (day) {
        var daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];
        var checkbox = document.getElementById("ClassDay-" + daysOfWeek[parseInt(day) - 1]);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
});