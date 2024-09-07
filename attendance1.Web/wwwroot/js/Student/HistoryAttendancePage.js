// switch toggle for light theme and dark theme
document.addEventListener("DOMContentLoaded", () => {
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

    // 函数：从localStorage加载主题偏好
    function loadThemePreference() {
        const preference = localStorage.getItem('themePreference');
        if (preference === 'light') {
            //checkbox.checked = true;
            applyTheme("/css/Student/student-light-theme.css");
        } else {
            //checkbox.checked = false;
            applyTheme("/css/Student/student-dark-theme.css");
        }
    }

    // 初始化时加载保存的主题偏好
    loadThemePreference();
});