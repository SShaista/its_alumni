const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "its2026"; // Change ce mot de passe

document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const error = document.getElementById("loginError");

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    localStorage.setItem("its_admin_session", "active");
    localStorage.setItem("its_admin_login_time", Date.now().toString());

    window.location.href = "admin.html";
  } else {
    error.style.display = "block";
  }
});
