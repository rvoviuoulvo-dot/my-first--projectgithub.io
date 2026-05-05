// --- 1. ИДОРАКУНИИ ТИРЕЗАҲО ВА СЕКСИЯҲО ---

function openAuth(sectionId) {
    const modal = document.getElementById('auth-modal-main');
    if (modal) {
        modal.style.display = 'block';
        showSection(sectionId);
    }
}

function closeAuth() {
    const modal = document.getElementById('auth-modal-main');
    if (modal) modal.style.display = 'none';
}

function showSection(sectionId) {
    const sections = ['reg-section', 'login-section', 'forgot-section', 'verify-section'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    const target = document.getElementById(sectionId);
    if (target) target.style.display = 'block';
}

// --- 2. МАНТИҚИ РЕГИСТРАТСИЯ (REGISTRATION) ---

function handleRegister() {
    // Тафтиши капча
    const captchaInput = document.getElementById("reg-captcha-input").value;
    if (captchaInput !== window.currentCaptcha) {
        alert("Хато: Коди капча нодуруст аст!");
        generateCaptcha();
        return;
    }

    const u = document.getElementById("reg-login").value;
    const e = document.getElementById("reg-email").value;
    const p = document.getElementById("reg-pass").value;

    if (!u || !e || !p) {
        alert("Лутфан ҳамаи сатрҳоро пур кунед!");
        return;
    }

    // Эҷоди OTP ва захираи муваққатии маълумот
    const otp = Math.floor(100000 + Math.random() * 900000);
    window.generatedOTP = otp;
    window.tempUser = { username: u, password: p, email: e };

    // Фиристодан тавассути EmailJS
    emailjs.send("service_e16telz", "template_hsf83g9", {
        email: e,
        passcode: otp
    }).then(function() {
        alert("Код ба почтаи " + e + " фиристода шуд!");
        showSection('verify-section');
    }, function(error) {
        alert("Хатогӣ дар EmailJS! Танзимотро санҷед.");
        console.error(error);
    });
}

// Тасдиқи ниҳоӣ баъди ворид кардани код аз почта
function finalVerify() {
    const userCode = document.getElementById('v-code').value;
    
    if (userCode == window.generatedOTP) {
        // 1. Гирифтани ID-и навбатӣ
        const newUserId = getNextUserId();
        
        // 2. Илова кардани ID ба маълумоти корбар
        window.tempUser.id = newUserId;
        window.tempUser.referralId = "REF" + newUserId;

        // 3. Захира дар LocalStorage
        localStorage.setItem("user", JSON.stringify(window.tempUser));
        localStorage.setItem("logged", "true");
        
        alert("Регистратсия бомуваффақият анҷом ёфт! ID-и шумо: " + newUserId);
        closeAuth();
        updateUI();
    } else {
        alert("Коди тасдиқ хато аст!");
    }
}

// --- 3. МАНТИҚИ ВОРИДШАВӢ (LOGIN) ---

function handleLogin() {
    // Тафтиши капча
    const captchaInput = document.getElementById("login-captcha-input").value;
    if (captchaInput !== window.currentLoginCaptcha) {
        alert("Хато: Капчаи воридшавӣ нодуруст аст!");
        generateCaptchaLogin();
        return;
    }

    const userInp = document.getElementById("login-user").value;
    const passInp = document.getElementById("login-pass").value;

    // Гирифтани маълумот аз базаи браузер
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (savedUser) {
        // Тафтиши ҳушманд: Логин ё Email + Парол
        if ((userInp === savedUser.username || userInp === savedUser.email) && passInp === savedUser.password) {
            localStorage.setItem("logged", "true");
            alert("Хуш омадед, " + savedUser.username + "!");
            closeAuth();
            updateUI();
        } else {
            alert("Логин ё парол хато аст!");
        }
    } else {
        alert("Корбар ёфт нашуд! Лутфан аввал регистратсия кунед.");
    }
}

// --- 4. ИДОРАКУНИИ КАБИНЕТ ВА UI ---
function updateUI() {
    const isLogged = localStorage.getItem("logged") === "true";
    const userData = JSON.parse(localStorage.getItem("user"));
    
    const panel = document.getElementById("user-panel");
    const regBtn = document.querySelector(".btn.reg");
    const loginBtn = document.querySelector(".btn.login");
    const logoutBtn = document.querySelector(".btn.logout");

    if (isLogged && userData) {
        // Пур кардани маълумоти профил
        const userEl = document.getElementById("profile-username");
        const emailEl = document.getElementById("profile-email");
        const idEl = document.getElementById("profile-id"); // Барои нишон додани ID

        if(userEl) userEl.innerText = userData.username;
        if(emailEl) emailEl.innerText = userData.email;
        if(idEl) idEl.innerText = userData.id; // Дар инҷо ID-и воқеиро мемонем

        if (panel) panel.style.display = "block"; 
        if (regBtn) regBtn.style.display = "none";
        if (loginBtn) loginBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-block";
    } else {
        if (panel) panel.style.display = "none";
        if (regBtn) regBtn.style.display = "inline-block";
        if (loginBtn) loginBtn.style.display = "inline-block";
        if (logoutBtn) logoutBtn.style.display = "none";
    }
}

function logout() {
    localStorage.removeItem("logged");
    // Эзоҳ: "user"-ро нест намекунем, то дафъаи баъд "Вход" кор кунад
    window.location.reload(); 
}

// --- 5. ГЕНЕРАТСИЯИ КАПЧАҲО ---

function generateCaptcha() {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captcha = "";
    for (let i = 0; i < 5; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const el = document.getElementById("captcha-code");
    if (el) {
        el.innerText = captcha;
        window.currentCaptcha = captcha;
    }
}

function generateCaptchaLogin() {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let captcha = "";
    for (let i = 0; i < 5; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const el = document.getElementById("captcha-code-login");
    if (el) {
        el.innerText = captcha;
        window.currentLoginCaptcha = captcha;
    }
}

// --- ИҶРОҲОИ АВВАЛИЯ ҲАНГОМИ БОРШАВӢ ---

window.addEventListener('load', () => {
    generateCaptcha();
    generateCaptchaLogin();
    updateUI();
});


// 1. Генератсияи капча барои барқарорсозӣ
function generateCaptchaForgot() {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let captcha = "";
    for (let i = 0; i < 5; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const el = document.getElementById("captcha-code-forgot");
    if (el) {
        el.innerText = captcha;
        window.currentForgotCaptcha = captcha;
    }
}

// 2. Коркарди тугмаи "Фиристодани код"
function handleForgot() {
    const emailInp = document.getElementById("forgot-email").value;
    const captchaInp = document.getElementById("forgot-captcha-input").value;

    // Тафтиши капча
    if (captchaInp !== window.currentForgotCaptcha) {
        alert("Капча хато аст!");
        generateCaptchaForgot();
        return;
    }

    // Тафтиши мавҷудияти Email дар база (LocalStorage)
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser || savedUser.email !== emailInp) {
        alert("Корбар бо ин Email ёфт нашуд!");
        return;
    }

    // Эҷоди OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    window.forgotOTP = otp;

    // Фиристодани код тавассути EmailJS
    emailjs.send("service_e16telz", "template_hsf83g9", {
        email: emailInp,
        passcode: otp
    }).then(function() {
        alert("Коди барқарорсозӣ ба почта фиристода шуд!");
        showSection('reset-password-section'); // Гузаштан ба бахши пароли нав
    }, function(error) {
        alert("Хатогӣ дар фиристодан!");
    });
}

// 3. Тасдиқи код ва захира кардани пароли нав
function finalResetPassword() {
    const userCode = document.getElementById('v-code-forgot').value;
    const newPass = document.getElementById('new-password').value;
    
    if (userCode != window.forgotOTP) {
        alert("Коди тасдиқ хато аст!");
        return;
    }

    if (newPass.length < 4) {
        alert("Парол бояд на кам аз 4 аломат бошад!");
        return;
    }

    // Навсозии парол дар LocalStorage
    let userData = JSON.parse(localStorage.getItem("user"));
    userData.password = newPass; // Пароли навро мемонем
    localStorage.setItem("user", JSON.stringify(userData));

    alert("Пароли шумо бомуваффақият иваз шуд!");
    showSection('login-section'); // Баргашт ба логин
}

// Навсозии window.onload барои илова кардани капчаи нав
window.addEventListener('load', () => {
    generateCaptcha();
    generateCaptchaLogin();
    generateCaptchaForgot(); // Капчаи барқарорсозӣ
    updateUI();
});


// Ин кодро дар охири файли .js илова кунед
function toggleSidebar() {
    const panel = document.getElementById("user-panel");
    if (panel) {
        panel.classList.toggle("active");
    }
}



// Функсия барои гирифтани ID-и навбатӣ
function getNextUserId() {
    let lastId = localStorage.getItem('last_user_id') || 0; // Агар набуд, аз 0 сар кун
    let newId = parseInt(lastId) + 1;
    localStorage.setItem('last_user_id', newId); // ID-и навро захира кун
    return newId;
}

// Ҳангоми регистрасия
let newUser = {
    id: getNextUserId(),
    username: "Исми Корбар",
    referralId: "REF" + getNextUserId() // Реферал ID-и воқеӣ
};