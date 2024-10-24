// prevent browser backward
function preventBack() {
    window.history.forward();
    }
    setTimeout("preventBack()", 0);
    window.onunload = function () {
        null
};

// mobile add padding top
document.addEventListener("DOMContentLoaded", function () {
    var body = document.body;
    if (body.classList.contains('mobile')) {
        body.style.paddingTop = '80px';
    }

    const chk = document.getElementById('chk');
    const previousUI = localStorage.getItem('login-ui');
    if (previousUI === 'staff') {
        chk.checked = true;
    } else {
        chk.checked = false;
    }

    // change css layout for container height to display help message
    const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
    if (isMobile) {
        const outterContainer = document.getElementById('outter-container');
        const innerContainer = document.getElementById('inner-container');
        if (outterContainer && innerContainer) {
            innerContainer.style.height = '';
            innerContainer.style.minHeight = '100%';
            outterContainer.style.padding = '';
        }
    } else {
        const innerContainer = document.getElementById('inner-container');
        if (innerContainer) {
            innerContainer.style.height = '100vh';
        }
    }

    preventBack();
});


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
    return info1+info2+info3+info4;
}

// generate uuid 
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

async function getUUID() {
    const uuid = localStorage.getItem('UUID') || generateUUID();

    // 存储生成的 UUID
    localStorage.setItem('UUID', uuid);
    return uuid;
}

//reset prompt text
document.getElementById('chk').addEventListener('click', function () {
    var prompts = document.querySelectorAll('.prompt-text');
    const container = document.querySelector('.main');
    const registerContainer = document.querySelector('.register');
    const studentLoginForm = document.getElementById('student-login-form');
    prompts.forEach(function (prompt) {
        prompt.style.display = 'none';
    });

    container.style.height = '580px';
    registerContainer.style.height = '500px';
    studentLoginForm.style.gap = '35px';
});

// change the container height & save the ui role to storage
document.getElementById('chk').addEventListener('change', function () {
    const registerContainer = document.querySelector('.register');
    const prompts = document.querySelectorAll('.prompt-text');
    const studentLoginForm = document.getElementById('student-login-form');

    let allPromptsHidden = true;
    prompts.forEach(function (prompt) {
        if (prompt.style.display !== 'none') {
            allPromptsHidden = false;
        }
    });

    if (this.checked) {
        localStorage.setItem('login-ui', 'staff');
        if (allPromptsHidden) {
            registerContainer.style.transform = 'translateY(-67%)';
            registerContainer.style.minHeight = '580px';
            studentLoginForm.style.gap = '35px';
        } else {
            registerContainer.style.transform = 'translateY(-75%)';
            studentLoginForm.style.gap = '35px';
        }
    } else {
        localStorage.setItem('login-ui', 'student');
        registerContainer.style.transform = 'translateY(1%)';
        if (allPromptsHidden) {
            studentLoginForm.style.gap = '35px';
        } else {
            studentLoginForm.style.gap = '35px';
        }
    }
});


//function for form empty validation
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

function checkStudentNameFormat() {
    var studentName = document.getElementById('student-username').value;
    var studentNamePattern = /^(?=.*[a-zA-Z])[a-zA-Z\s]{1,100}$/;
    var studentNameError = document.getElementById('student-username-error');

    if (studentName !== '' && !studentNamePattern.test(studentName)) {
        studentNameError.style.display = 'block';
        return false;
    } else if (studentName == '') {
        studentNameError.style.display = 'none';
        return false;
    } else {
        studentNameError.style.display = 'none';
        return true;
    }
}

//function validate student ID format
function checkStudentIDFormat() {
    var studentId = document.getElementById('student-id').value;
    var studentIdPattern = /^[A-Z]{3}\d{8}$/;
    var studentIdError = document.getElementById('student-id-error');

    if (studentId !== '' && !studentIdPattern.test(studentId)) {
        studentIdError.style.display = 'block';
        return false;
    } else if (studentId == '') {
        studentIdError.style.display = 'none';
        return false;
    } else {
        studentIdError.style.display = 'none';
        return true;
    }
}

// check device type 
function checkDeviceType(errorId) {
    const errorElement = document.getElementById(errorId);
    
    const userAgent = navigator.userAgent;
    if (/mobile/i.test(userAgent)) {
        errorElement.style.display = 'none';
        return true;
    //} else if (/tablet/i.test(userAgent)) {
    //    errorElement.style.display = 'none';
    //    return true;
    } else {
        errorElement.style.display = 'block';
        return false;
    }
}

//validate student form
function validateForm() {
    var valid = true;

    valid &= checkEmpty('student-username', 'student-username-empty');
    valid &= checkEmpty('student-id', 'student-id-empty');

    valid &= checkStudentNameFormat();
    valid &= checkStudentIDFormat();

    valid &= checkDeviceType('device-type-error');

    return valid;
}

// student login
document.getElementById('student-login-button').addEventListener('click', function (event) {
    event.preventDefault();
    const studentLoginForm = document.getElementById('student-login-form');
    if (validateForm()) {
        studentLoginForm.style.gap = '35px';
        let userIdentifier;
        let uuidStatus;
        var uuid = localStorage.getItem('UUID'); 

        if (uuid) {
            userIdentifier = `uuid:${uuid};`;
            //localStorage.setItem('UUID', uuid);
            uuidStatus = "re-use";
        }
        else {
            // login action but get null uuid, regenerate uuid
            uuid = generateUUID();
            userIdentifier = `uuid:${uuid};`;
            localStorage.setItem('UUID', uuid);
            uuidStatus = "re-assign";
        }

        var studentID = `studentId:${document.getElementById('student-id').value.trim().toLowerCase()};`;
        var deviceInfo = getStableDeviceInfo();
        var deviceIdentifier = userIdentifier + studentID + deviceInfo;
        var form = document.getElementById('student-login-form');

        // is register = false
        var hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', 'IsRegister');
        hiddenInput.setAttribute('value', 'false');


        // device identifier
        var deviceInput = document.createElement('input');
        deviceInput.setAttribute('type', 'hidden');
        deviceInput.setAttribute('name', 'DeviceIdentifier');
        deviceInput.setAttribute('value', deviceIdentifier);

        // uuid status
        var uuidInput = document.createElement('input');
        uuidInput.setAttribute('type', 'hidden');
        uuidInput.setAttribute('name', 'UuidStatus');
        uuidInput.setAttribute('value', uuidStatus);

        form.appendChild(uuidInput);
        form.appendChild(deviceInput);
        form.appendChild(hiddenInput);
        form.submit();
    }
    else {
        const container = document.querySelector('.main');
        container.style.height = '640px';
        const prompts = document.querySelectorAll('.prompt-text');
        
        // calculate the number of prompts that displays
        let numberOfPrompts = 0;
        prompts.forEach(function (prompt) {
            if (prompt.style.display !== 'none') {
                numberOfPrompts++;
            }
        });
        studentLoginForm.style.gap = `${45 - numberOfPrompts * 5}px`;
        //container.style.height = '640px';
    }
});

// student register
document.getElementById('student-register-button').addEventListener('click', function (event) {
    event.preventDefault();
    const studentLoginForm = document.getElementById('student-login-form');
    if (validateForm()) {
        studentLoginForm.style.gap = '35px';
        var uuid = localStorage.getItem('UUID');
        let uuidStatus;

        if (uuid) {
            uuidStatus = "re-use";
        }

        if (!uuid) {
            uuid = generateUUID();
            localStorage.setItem('UUID', uuid);
            uuidStatus = "first-assign";
        }

        const userIdentifier = `uuid:${uuid};`;

        var studentID = `studentId:${document.getElementById('student-id').value.trim().toLowerCase()};`;
        var deviceInfo = getStableDeviceInfo();
        var deviceIdentifier = userIdentifier + studentID + deviceInfo;
        var form = document.getElementById('student-login-form');

        // is regiter = true
        var hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', 'IsRegister');
        hiddenInput.setAttribute('value', 'true');

        // device identifier
        var deviceInput = document.createElement('input');
        deviceInput.setAttribute('type', 'hidden');
        deviceInput.setAttribute('name', 'DeviceIdentifier');
        deviceInput.setAttribute('value', deviceIdentifier);

        // uuid status
        var uuidInput = document.createElement('input');
        uuidInput.setAttribute('type', 'hidden');
        uuidInput.setAttribute('name', 'UuidStatus');
        uuidInput.setAttribute('value', uuidStatus);

        form.appendChild(uuidInput);
        form.appendChild(deviceInput);
        form.appendChild(hiddenInput);
        form.submit();
    }
    else {
        const container = document.querySelector('.main');
        container.style.height = '640px';
        
        // calculate the number of prompts that displays
        const prompts = document.querySelectorAll('.prompt-text');
        let numberOfPrompts = 0;
        prompts.forEach(function (prompt) {
            if (prompt.style.display !== 'none') {
                numberOfPrompts++;
            }
        });
        studentLoginForm.style.gap = `${45 - numberOfPrompts * 5}px`;
        //container.style.height = '580px';
    }
});



// check the format of the staff name
function checkStaffNameFormat() {
    var staffName = document.getElementById('staff-username').value;
    var staffNamePattern = /^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{1,100}$/;
    var staffNameError = document.getElementById('staff-username-error');

    if (staffName !== '' && !staffNamePattern.test(staffName)) {
        staffNameError.style.display = 'block';
        return false;
    } else if (staffName == '') {
        staffNameError.style.display = 'none';
        return false;
    } else {
        staffNameError.style.display = 'none';
        return true;
    }
}

//function validate staff ID format
function checkStaffPasswordFormat() {
    var staffPw = document.getElementById('staff-password').value;
    var staffPwPattern = /^.{6,}$/;
    var staffPwError = document.getElementById('staff-password-error');

    if (staffPw !== '' && !staffPwPattern.test(staffPw)) {
        staffPwError.style.display = 'block';
        return false;
    } else if (staffPw == '') {
        staffPwError.style.display = 'none';
        return false;
    } else {
        staffPwError.style.display = 'none';
        return true;
    }
}

// function check staff role at least select one 
function checkStaffRoleEmpty(errorId) {
    const roleInputs = document.querySelectorAll('input[name="Role"]');
    const errorElement = document.getElementById(errorId);
    let roleSelected = false;

    for (const roleInput of roleInputs) {
        if (roleInput.checked) {
            roleSelected = true;
            break;
        }
    }

    if (!roleSelected) {
        errorElement.style.display = 'block';
        return false;
    } else {
        errorElement.style.display = 'none';
        return true;
    }
}

//function validate the staff login form before submitting
document.getElementById('staff-login-button').addEventListener('click', function (event) {
    event.preventDefault();
    var valid = true;

    valid &= checkEmpty('staff-username', 'staff-username-empty');
    valid &= checkEmpty('staff-password', 'staff-password-empty');
    valid &= checkStaffRoleEmpty('staff-role-empty');

    valid &= checkStaffNameFormat();
    valid &= checkStaffPasswordFormat();

    if (valid) {
        //document.getElementById('staff-login-form').submit();
        var form = document.getElementById('staff-login-form');
        form.style.gap = '30px';

        var hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', 'IsRegister');
        hiddenInput.setAttribute('value', 'false');
        form.appendChild(hiddenInput);
        form.submit();
    }
    else {
        const container = document.querySelector('.main');
        container.style.height = '630px';

        const innerContainer = document.querySelector('.register');
        innerContainer.style.minHeight = '580px';

        innerContainer.style.transform = 'translateY(-67%)';
        const staffLoginForm = document.getElementById('staff-login-form');
        staffLoginForm.style.gap = '25px';

        // calculate the number of prompts that displays
        const prompts = document.querySelectorAll('.prompt-text');
        let numberOfPrompts = 0;
        prompts.forEach(function (prompt) {
            if (prompt.style.display !== 'none') {
                numberOfPrompts++;
            }
        });
        staffLoginForm.style.gap = `${30 - numberOfPrompts * 3}px`;
    }
});
