import { showAlert } from "./index.js";

const generateRandomPassword = () => {
    const lowerCase = "abcdefghijklmnopqrstuvwxyz";
    const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";
    const specialChars = "!@#$%^&*()_+";
    const allChars = lowerCase + upperCase + digits + specialChars;

    const getRandomChar = (charset) => charset[Math.floor(Math.random() * charset.length)];

    const length = document.getElementById('passwordLength').value;

    let password = [
        getRandomChar(lowerCase),
        getRandomChar(upperCase),
        getRandomChar(digits),
        getRandomChar(specialChars)
    ];

    for (let i = 4; i < length; i++) {
        password.push(getRandomChar(allChars));
    }

    password = password.sort(() => Math.random() - 0.5).join('');

    document.getElementById('newPassword').value = password;
};

const updatePasswordLengthLabel = (value) => {
    document.getElementById('passwordLengthLabel').textContent = value;
};

const togglePasswordVisibility = (passwordFieldId, iconElement) => {
    const passwordField = document.getElementById(passwordFieldId);
    const passwordIcon = iconElement.querySelector('i');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        passwordIcon.classList.replace('bi-eye-fill', 'bi-eye-slash-fill');
    } else {
        passwordField.type = 'password';
        passwordIcon.classList.replace('bi-eye-slash-fill', 'bi-eye-fill');
    }
};


export async function handleResetPassword(row) {
    const newPassword = document.getElementById('newPassword').value;
    const response = await fetch(`/api/users/${row.USER_ID}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword })
    });
   
    if (!response.ok) {
        const error = await response.json();
        console.error('Error:', error);
        showAlert(error.message, 'danger');
        return;
    }
    showAlert(`Password reset for user ${row.USERNAME}`, 'success');
    $('#universalModal').modal('hide');
}

export const generateResetPasswordForm = (row) => {
    const formHtml = `
        <form id="resetPasswordForm">
            <div class="mb-3">
                <label for="newPassword" class="form-label">New Password</label>
                <div class="input-group">
                    <input type="password" class="form-control" id="newPassword" name="newPassword">
                    <a class="input-group-text" href="#" id="generatePassword"><i class="bi bi-dice-5"></i></a>
                    <a class="input-group-text" href="#" id="togglePasswordVisibility"><i class="bi bi-eye-fill"></i></a>
                </div>
            </div>
            <div class="mb-3">
                <label for="passwordLength" class="form-label">Password Length <span id="passwordLengthLabel"><b>12</b></span></label>
                <input type="range" class="form-range" min="8" max="32" id="passwordLength" value="12">
            </div>
        </form>
    `;
    setTimeout(() => {
        generateRandomPassword();
        document.getElementById('generatePassword').addEventListener('click', (e) => {
            e.preventDefault();
            generateRandomPassword();
        });
        document.getElementById('togglePasswordVisibility').addEventListener('click', (e) => {
            e.preventDefault();
            togglePasswordVisibility('newPassword', e.currentTarget);
        });
        document.getElementById('passwordLength').addEventListener('input', (e) => {
            updatePasswordLengthLabel(e.target.value);
            generateRandomPassword();
        });
    }, 0);
    return formHtml;
};