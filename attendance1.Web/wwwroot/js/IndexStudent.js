//function for check empty input
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

//functuon for check attendance code format
function checkAttendanceCode() {
    var attendanceCode = document.getElementById('attendance-code-fill-space').value;
    //var attendanceCodePattern = /^[a-zA-Z0-9]{6}$/;
    var attendanceCodePattern = /^[0-9]{6}$/;
    var attendanceCodeError = document.getElementById('attendance-code-error');

    if (attendanceCode !== '' && !attendanceCodePattern.test(attendanceCode)) {
        attendanceCodeError.style.display = 'block';
        return false;
    } else if (attendanceCode == '') {
        attendanceCodeError.style.display = 'none';
        return false;
    } else {
        attendanceCodeError.style.display = 'none';
        return true;
    }
}

// get device info
function getStableDeviceInfo() {
    const deviceInfo = {
        hardwareConcurrency: navigator.hardwareConcurrency,
        colorDepth: screen.colorDepth,
        screenResolution: `${screen.width}x${screen.height}`,
        deviceType: (() => {
            const userAgent = navigator.userAgent;
            if (/mobile/i.test(userAgent)) {
                return 'Mobile';
            } else if (/tablet/i.test(userAgent)) {
                return 'Tablet';
            } else {
                return 'Desktop';
            }
        })(),
    };
    const info1 = `hardwareConcurrency:${deviceInfo.hardwareConcurrency};`;
    const info2 = `colorDepth:${deviceInfo.colorDepth};`;
    const info3 = `screenResolution:${deviceInfo.screenResolution};`;
    const info4 = `deviceType:${deviceInfo.deviceType};`;
    return info1 + info2 + info3 + info4;
}

document.getElementById('attendance-code-submit-btn').addEventListener('click', function (event) {
    event.preventDefault();

    var valid = true;

    valid &= checkEmpty('attendance-code-fill-space', 'attendance-code-empty');

    valid &= checkAttendanceCode();

    if (valid) {
        var form = document.getElementById('student-submit-attendance-form');

        var studentID = `studentId:${document.getElementById('studentID').innerText.trim().toLowerCase()};`
        var deviceInfo = getStableDeviceInfo();
        var deviceCode = studentID + deviceInfo;

        var deviceInput = document.createElement('input');
        deviceInput.setAttribute('type', 'hidden');
        deviceInput.setAttribute('name', 'DeviceCode');
        deviceInput.setAttribute('value', deviceCode);

        form.appendChild(deviceInput);
        form.submit();
    }
});

//set the date card selected mode 
function selectCard(date) {
    // Remove selected mode for all cards
    var cards = document.querySelectorAll('.date-card');
    cards.forEach(card => card.classList.remove('selected'));

    // Add selected mode to clicked card
    var selectedCard = document.querySelector(`[onclick="selectCard(${date})"] .date-card`);
    if (selectedCard !== null) {
        selectedCard.classList.add('selected');
    }

    // Filter attendance records based on selected date
    var records = document.querySelectorAll('#attendance-records .attendance-record-card');
    var hasRecords = false;
    records.forEach(record => {
        var recordDate = parseInt(record.getAttribute('data-date'), 10);
        if (recordDate === date) {
            record.style.display = 'flex';
            hasRecords = true;
        } else {
            record.style.display = 'none';
        }
    });

    // Display no record message if no records are found
    var noRecordMessage = document.getElementById('no-record-message');
    if (hasRecords) {
        noRecordMessage.style.display = 'none';
    } else {
        noRecordMessage.style.display = 'block';
    }
}

// Default select today's card
window.onload = function () {
    var todayDate = new Date().getDate();
    selectCard(todayDate);
};

//feedback modal region
// Show the modal
function showModal() {
    document.getElementById('feedback-modal').style.display = 'flex';
    document.body.classList.add('modal-open'); //disable background scroll function
    toggleMenu(); //close the menu btn
}

// Hide the modal and clear the form
function cancelModal() {
    document.getElementById('feedback-modal').style.display = 'none';
    document.getElementById('feedback-form').reset();
    clearSelectedRates();

    // Hide error messages
    document.getElementById('feedback-rate-empty').style.display = 'none';
    document.getElementById('feedback-content-empty').style.display = 'none';

    //reable the page scroll function
    document.body.classList.remove('modal-open');
}

// Handle form submission
document.getElementById('feedback-form-submit-btn').addEventListener('click', function (event) {
    event.preventDefault();
    var valid = true;

    valid &= checkEmpty('feedback-rating-input', 'feedback-rate-empty');
    valid &= checkEmpty('feedback-content-fill-space', 'feedback-content-empty');

    if (valid) {
        document.getElementById('feedback-form').submit();
        cancelModal();
    }
});

// Select rate function
let selectedRate = '';
function selectRate(element, value) {
    clearSelectedRates();
    element.classList.add('selected-rate');

    // Update the hidden input value
    selectedRate = value;
    document.getElementById('feedback-rating-input').value = selectedRate;
}

// Clear selected rates
function clearSelectedRates() {
    var rates = document.querySelectorAll('.rate-container');
    rates.forEach(rate => rate.classList.remove('selected-rate'));

    selectedRate = '';
    document.getElementById('feedback-rating-input').value = selectedRate;
}

function toggleMenu() {
    var menuToggle = document.getElementById('menu-toggle');
    menuToggle.checked = !menuToggle.checked;
}

//admin modal region
// Show the modal
function showAdminModal() {
    document.getElementById('contact-admin-modal').style.display = 'flex';
    document.body.classList.add('modal-open'); //disable background scroll function
    toggleMenu(); //close the menu btn
}

// Hide the modal
function cancelAdminModal() {
    document.getElementById('contact-admin-modal').style.display = 'none';

    //reable the page scroll function
    document.body.classList.remove('modal-open');
}

// contact admin
function contactAdmin(emailAddress) {
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}`;

    // open gmail tab
    window.open(gmailLink, '_blank');
}

// copy admin email
function copyEmail(email) {
    navigator.clipboard.writeText(email).catch(function (error) {
        console.error("Failed to copy admin's email address:", error);
        alert("Failed to copy admin's email address:", error)
    });
}

// switch toggle for light theme and dark theme
//document.addEventListener("DOMContentLoaded", () => {
//    const checkbox = document.getElementById("themeToggle");

//    checkbox.addEventListener("change", () => {
//        if (checkbox.checked) {
//            applyTheme("/css/student-light-theme.css");
//        } else {
//            applyTheme("/css/student-dark-theme.css");
//        }
//    });

//    // Function to apply selected theme stylesheet
//    function applyTheme(theme) {
//        // Remove any existing theme stylesheet
//        const existingTheme = document.querySelector('link[href*="theme"]');
//        if (existingTheme) {
//            existingTheme.remove();
//        }

//        // Append the new theme stylesheet
//        const newTheme = document.createElement("link");
//        newTheme.setAttribute("rel", "stylesheet");
//        newTheme.setAttribute("href", theme);
//        newTheme.setAttribute("type", "text/css");
//        newTheme.setAttribute("id", "theme");
//        document.head.appendChild(newTheme);
//    }

//    // Initialize theme based on initial checkbox state
//    if (checkbox.checked) {
//        applyTheme("/css/student-light-theme.css");
//    } else {
//        applyTheme("/css/student-dark-theme.css");
//    }
//});

document.addEventListener("DOMContentLoaded", () => {
    const checkbox = document.getElementById("themeToggle");

    // 函数：应用主题
    function applyTheme(theme) {
        const existingTheme = document.querySelector('link[href*="theme"]');
        if (existingTheme) {
            existingTheme.remove();
        }
        const newTheme = document.createElement("link");
        newTheme.setAttribute("rel", "stylesheet");
        newTheme.setAttribute("href", theme);
        newTheme.setAttribute("type", "text/css");
        newTheme.setAttribute("id", "theme");
        document.head.appendChild(newTheme);
    }

    // 函数：保存主题偏好到localStorage
    function saveThemePreference(isLight) {
        localStorage.setItem('themePreference', isLight ? 'light' : 'dark');
    }

    // 函数：从localStorage加载主题偏好
    function loadThemePreference() {
        const preference = localStorage.getItem('themePreference');
        if (preference === 'light') {
            checkbox.checked = true;
            applyTheme("/css/student-light-theme.css");
        } else {
            checkbox.checked = false;
            applyTheme("/css/student-dark-theme.css");
        }
    }

    // 监听复选框变化
    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            applyTheme("/css/student-light-theme.css");
            saveThemePreference(true);
        } else {
            applyTheme("/css/student-dark-theme.css");
            saveThemePreference(false);
        }
    });

    // 初始化时加载保存的主题偏好
    loadThemePreference();
});

