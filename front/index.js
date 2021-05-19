function toggleLoginPopup(){
    document.getElementById("popup-1").classList.toggle("active");
}

function toggleRegisterPopup(){
    document.getElementById("popup-2").classList.toggle("active");
}

document.querySelector('#login_button').addEventListener('click', () => {
    toggleLoginPopup();
});

document.querySelector('#register_button').addEventListener('click', () => {
    toggleRegisterPopup();
});

document.querySelectorAll('.close-btn')[0].addEventListener('click', () => {
    toggleLoginPopup();
});

document.querySelectorAll('.close-btn')[1].addEventListener('click', () => {
    toggleRegisterPopup();
});
