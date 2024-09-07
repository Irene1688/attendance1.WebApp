// display today classes title
//document.addEventListener("DOMContentLoaded", function () {
//    document.getElementById('today-classes-title').style.display = 'none';
//    var allClass = JSON.parse(document.getElementById('data-class-days').textContent);
//    var today = new Date().getDay();

//    allClass.forEach(function (item) {
//        if (item.classDays) {
//            var classDays = item.classDays.split(', ').map(Number);

//            if (classDays.includes(today)) {
//                document.getElementById('today-classes-title').style.display = 'block';
//                return;
//            }
//        }
//    });
//});

document.addEventListener("DOMContentLoaded", function () {
    var todayClasses = document.getElementById('today-classes');
    var otherClasses = document.getElementById('other-classes');
    //var todayClassesContainer = document.getElementById('today-classes-container');
    var noClassesMessage = document.getElementById('no-class-message');
    var otherClassesContainer = document.getElementById('other-classes-conntainer');

    if (todayClasses === null) {
        //todayClassesTitle.style.display = 'none';
        noClassesMessage.style.display = 'block';
    }
    else {
        noClassesMessage.style.display = 'none';
    }

    if (otherClasses === null) {
        otherClassesContainer.style.display = 'none';
    }
});
