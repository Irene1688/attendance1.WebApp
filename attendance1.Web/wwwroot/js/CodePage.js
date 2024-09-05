// Count Down time
document.addEventListener("DOMContentLoaded", function () {
    var codeEndTime = JSON.parse(document.getElementById('data-code-end-time').textContent);

    function updateCountdown() {
        // Get current time
        var today = new Date();
        var codeEndTimeFormatted = codeEndTime.split(".")[0];

        // Format codeEndTime to match Date object's format
        var codeEndTimeParts = codeEndTimeFormatted.split(":");
        var codeEndDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), codeEndTimeParts[0], codeEndTimeParts[1], codeEndTimeParts[2]);

        // Calculate difference in milliseconds
        var distance = codeEndDateTime.getTime() - today.getTime();

        // Convert distance to readable format (minutes and seconds)
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("count-down-minute").innerHTML = minutes;
        document.getElementById("count-down-second").innerHTML = seconds;

        if (distance == 0 || distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById("expired").innerHTML = "EXPIRED";
            document.getElementById("expired").style.justifyContent = "center";
            document.getElementById("expired").style.fontSize = "35px";
            document.getElementById("expired").style.fontFamily = "'Hind Madurai', sans-serif";
        }
    }

    updateCountdown();
    var countdownInterval = setInterval(updateCountdown, 1000);
});

