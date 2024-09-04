//delete feedback
//confirm delete 
document.addEventListener("DOMContentLoaded", function () {
    window.confirmDelete = function (feedbackId) {
        if (confirm("Are you sure you want to delete this feedback? All of the related data will be deleted.")) {
            const deleteForm = document.getElementById('delete-feedback-form');
            const deleteInput = document.getElementById('delete-feedback-id');
            deleteInput.value = feedbackId;
            deleteForm.submit();
        }
    }
});

//contact student
//function contactStudent(studentId) {
//    const receiverEmailAddress = `${studentId}@student.uts.edu.my`;
//    const mailtoLink = `mailto:${receiverEmailAddress}`;

//    // open mail app
//    window.location.href = mailtoLink;
//}
function contactStudent(studentId) {
    const receiverEmailAddress = `${studentId}@student.uts.edu.my`;

    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(receiverEmailAddress)}`;

    // open gmail tab
    window.open(gmailLink, '_blank');
}

// sort feedback list
function sortFeedbacks() {
    const feedbackList = document.getElementById('feedback-list');
    const feedbackItems = Array.from(document.getElementsByClassName('feedback-item'));
    const sortOption = document.querySelector('input[name="sort-option"]:checked').value;

    feedbackItems.sort((a, b) => {
        if (sortOption === 'date') {
            const dateA = parseCustomDate(a.getAttribute('data-date'));
            const dateB = parseCustomDate(b.getAttribute('data-date'));
            return dateB - dateA; // from new to old
        } else if (sortOption === 'rating') {
            const ratingA = parseInt(a.getAttribute('data-rating'));
            const ratingB = parseInt(b.getAttribute('data-rating'));
            return ratingB - ratingA; // from hign to low
        }
    });

    // rearrange
    feedbackList.innerHTML = '';
    feedbackItems.forEach(item => feedbackList.appendChild(item));
}

function parseCustomDate(dateString) {
    // format date time
    const [datePart, timePart, period] = dateString.split(' ');

    const [day, month, year] = datePart.split('/').map(num => parseInt(num));
    let [hours, minutes, seconds] = timePart.split(':').map(num => parseInt(num));

    // adjust hour based on am/pm
    if (period === 'PM' && hours < 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) {
        hours = 0;
    }

    return new Date(year, month - 1, day, hours, minutes, seconds);
}

// search function
function searchFeedbacks() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const feedbackItems = document.getElementsByClassName('feedback-item');

    var clearBtn = document.getElementById("clear-search-input");
    if (searchInput) {
        clearBtn.style.display = "inline";
    } else {
        clearBtn.style.display = "none";
    }

    Array.from(feedbackItems).forEach(item => {
        const studentId = item.getAttribute('data-studentid').toLowerCase();
        const studentName = item.getAttribute('data-studentname').toLowerCase();
        const feedbackContent = item.getAttribute('data-feedbackcontent').toLowerCase();

        if (studentId.includes(searchInput) || studentName.includes(searchInput) || feedbackContent.includes(searchInput)) {
            item.style.display = ''; // 显示匹配的反馈
        } else {
            item.style.display = 'none'; // 隐藏不匹配的反馈
        }
    });
}

//clear search input
function clearSearch() {
    var input = document.getElementById("search-input");
    input.value = "";
    input.focus();
    searchFeedbacks();
}

