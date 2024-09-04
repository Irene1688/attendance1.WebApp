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



document.addEventListener("DOMContentLoaded", function () {
    // 获取表单中的初始值
    var initialFormState = {
        programme: document.getElementById("programme-select").value,
        sessionMonth: document.getElementById("session-month-select").value,
        sessionYear: document.getElementById("session-year-select").value,
        courseCode: document.getElementById("course-code-fill").value,
        className: document.getElementById("course-name-fill").value,
        startDate: document.getElementById("start-date-select").value,
        endDate: document.getElementById("end-date-select").value,
        classDays: document.getElementById("classDaysHidden").value
        //classDays: Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(el => el.value).join(",")
    };

    function checkChange() {
        document.getElementById("no-change-warning").style.display = "none";
        var currentFormState = {
            programme: document.getElementById("programme-select").value,
            sessionMonth: document.getElementById("session-month-select").value,
            sessionYear: document.getElementById("session-year-select").value,
            courseCode: document.getElementById("course-code-fill").value,
            className: document.getElementById("course-name-fill").value,
            startDate: document.getElementById("start-date-select").value,
            endDate: document.getElementById("end-date-select").value,
            classDays: Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(el => el.value).join(", ")
        };

        if (JSON.stringify(initialFormState) === JSON.stringify(currentFormState)) {
            // 显示提示消息并阻止提交
            document.getElementById("no-change-warning").style.display = "block";
            return false;
            //event.preventDefault();
        } else {
            return true;
        }
    }

    document.getElementById('submit-button').addEventListener('click', function (event) {
        event.preventDefault();

        var valid = true;

        valid &= checkEmpty('programme-select', 'programme-empty');
        valid &= checkEmpty('session-month-select', 'session-month-empty');
        valid &= checkEmpty('session-year-select', 'session-year-empty');
        valid &= checkEmpty('course-code-fill', 'course-code-empty');
        valid &= checkEmpty('course-name-fill', 'course-name-empty');

        valid &= checkDateRange();
        valid &= checkClassDay();
        valid &= checkCourseCode();
        valid &= checkCourseName();
        valid &= checkChange();

        if (valid) {
            document.getElementById('edit-class').submit();
        }
    });

    //cancel button redirect
    document.getElementById("cancel-button").addEventListener("click", function () {
        var courseId = document.querySelector("input[name='CourseId']").value;
        document.getElementById("edit-class").reset();
        window.location.href = '/Class/ClassAttendance/' + courseId;
    });
});

//generate class days by joinning multiple values 
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

//pre-select class days
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




