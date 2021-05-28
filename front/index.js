console.log(window.location);

if (sessionStorage.getItem('auth')) {
    if (JSON.parse(sessionStorage.getItem('auth'))['_id']) {
        if (window.location.pathname == '/profile.html') {
            document.querySelector('.logo').innerHTML =
                `
                <a href="index.html">
                    <span class="logo_big">NothingServe</span>
                    <span class="logo_medium">| Bank</span>
                </a>
                `
            document.querySelector('.auth').innerHTML =
                `
                    <span id="main_button"><a href="./index.html">ГОЛОВНА</a></span>
                    <span id="signout_button"><a href="#">ВИХІД</a></span>
                    `;
        } else {
            document.querySelector('.auth').innerHTML =
                `
                    <span id="profile_button"><a href="./profile.html">ПЕРСОНАЛЬНИЙ КАБІНЕТ</a></span>
                    <span id="signout_button"><a href="#">ВИХІД</a></span>
                    `;
        }
        document.querySelector('#signout_button').addEventListener('click', signOut);
    }
}

function toggleLoginPopup(){
    document.getElementById("popup-1").classList.toggle("active");
}

function toggleRegisterPopup(){
    document.getElementById("popup-2").classList.toggle("active");
}

if (document.querySelector('#login_button')) {
    document.querySelector('#login_button').addEventListener('click', () => {
        toggleLoginPopup();
    });
}

if (document.querySelector('#register_button')) {
    document.querySelector('#register_button').addEventListener('click', () => {
        toggleRegisterPopup();
    });
}

document.querySelectorAll('.close-btn')[0].addEventListener('click', () => {
    toggleLoginPopup();
});

document.querySelectorAll('.close-btn')[1].addEventListener('click', () => {
    toggleRegisterPopup();
});

if (document.querySelector('.navbar')) {
    document.querySelector('.navbar').querySelectorAll('li').forEach((el, i) => {
        el.addEventListener('click', () => {
            document.querySelector('iframe').setAttribute('src', `components/${el.getAttribute('name')}.html`);
        });
    });
}

document.querySelector('.logo').addEventListener('click', () => {
    document.querySelector('iframe').setAttribute('src', `components/main.html`);
});

document.querySelector('#login-btn').addEventListener('click', () => {
    fetch('http://localhost:80/api/signin', {method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login: document.querySelector('.login_input').value,
            password: document.querySelector('.password_input').value
        })
    }).then((res) => res.json())
        .then((res) => {
            console.log(res);
            if (res._id) {
                sessionStorage.setItem('auth', JSON.stringify(res));
                document.querySelector('.auth').innerHTML =
                    `
                    <span id="profile_button"><a href="./profile.html">ПЕРСОНАЛЬНИЙ КАБІНЕТ</a></span>
                    <span id="signout_button"><a href="#">ВИХІД</a></span>
                    `;
                toggleLoginPopup();
                document.querySelector('#signout_button').addEventListener('click', signOut);
            }
        });
})

document.querySelector('#registration-btn').addEventListener('click', () => {
    fetch('http://localhost:80/api/signup', {method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login: document.querySelectorAll('.login_input')[1].value,
            password: document.querySelectorAll('.password_input')[1].value
        })
    }).then((res) => res.json())
        .then((res) => {
            console.log(res);
            if (res._id) {
                sessionStorage.setItem('auth', JSON.stringify(res));
                document.querySelector('.auth').innerHTML =
                    `
                    <span id="profile_button"><a href="./profile.html">ПЕРСОНАЛЬНИЙ КАБІНЕТ</a></span>
                    <span id="signout_button"><a href="#">ВИХІД</a></span>
                    `;
                toggleRegisterPopup();
                document.querySelector('#signout_button').addEventListener('click', signOut);
            }
        });
})

function signOut() {
    sessionStorage.removeItem('auth');
    window.location.replace('/');
    document.location.reload();
}
