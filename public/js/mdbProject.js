//Get Buttons and panels from html
var tabButtons = document.querySelectorAll(".tab-container .tab-btn-container .tab-btn");
var tabPanels = document.querySelectorAll(".tab-container .tab-panel");

//Show selected panel and change background color
function showPanel(panelIndex, colorCode) {
    tabButtons.forEach(function (node) {
        node.style.backgroundColor = "";
        node.style.color = "";
    });
    tabButtons[panelIndex].style.backgroundColor = colorCode;
    tabButtons[panelIndex].style.color = "#495f72";
    tabPanels.forEach(function (node) {
        node.style.display = "none";
    });
    tabPanels[panelIndex].style.display = "block";
    tabPanels[panelIndex].style.backgroundColor = colorCode;
}
showPanel(0, '#ddd');


//Adding and updating user About Me

var settingsForm = document.getElementById('settingsForm');
var userBioContainer = document.querySelector('#userBioText');

settingsForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var bioInput = settingsForm.elements.newBio;
    addBio(bioInput.value);
    bioInput.value = '';

})

function addBio(bio) {
    var newBio = document.createElement('p');
    newBio.append(bio);
    userBioContainer.append(newBio);
}

// Login/Sign up logic
var loginForm = document.getElementById("loginForm");
var signupForm = document.getElementById("signupForm");
var toggleForms = document.getElementById("logSignBtn");

function login() {
    loginForm.style.left = "50px";
    signupForm.style.left = "450px";
    toggleForms.style.left = "0";
}

function signUp() {
    loginForm.style.left = "-400px";
    signupForm.style.left = "50px";
    toggleForms.style.left = "110px";
}

loginForm.addEventListener('submit', function (evt) {
    alert('Logged In!');
    evt.preventDefault();
})


