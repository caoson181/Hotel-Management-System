document.addEventListener("DOMContentLoaded", function () {

    const googleBtn = document.getElementById("googleLoginBtn");
    const facebookBtn = document.getElementById("facebookLoginBtn");

    if (googleBtn) {
        googleBtn.addEventListener("click", function () {
            window.location.href = "/oauth2/authorization/google";
        });
    }

    if (facebookBtn) {
        facebookBtn.addEventListener("click", function () {
            window.location.href = "/oauth2/authorization/facebook";
        });
    }

});

function handleGoogleLogin() {
    window.location.href = "/oauth2/authorization/google";
}

function handleFacebookLogin() {
    window.location.href = "/oauth2/authorization/facebook";
}
/* ===== AUTO FILL GOOGLE INFO WHEN REDIRECT TO SIGNUP ===== */
document.addEventListener("DOMContentLoaded", function () {

    const params = new URLSearchParams(window.location.search);

    const email = params.get("email");
    const username = params.get("username");
    const name = params.get("name");

    if (email) {
        const emailInput = document.getElementById("email");
        if (emailInput) {
            emailInput.value = email;
            emailInput.readOnly = true;
        }
    }

    if (username) {
        const usernameInput = document.getElementById("loginUsername");
        if (usernameInput) {
            usernameInput.value = username;
        }
    }

    if (name) {
        const fullNameInput = document.getElementById("fullName");
        if (fullNameInput) {
            fullNameInput.value = name;
        }
    }

});