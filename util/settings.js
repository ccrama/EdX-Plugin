/* Settings */
function getSettingsObject() {
    let foundOptions = localStorage.getItem('edx-improver:' + currentCourse)

    return foundOptions ? JSON.parse(foundOptions) : { skip_intro: 0 }
}

function setCourseOption(key, value) {
    let pageOptions = getSettingsObject()
    pageOptions[key] = value

    localStorage.setItem('edx-improver:' + currentCourse, JSON.stringify(pageOptions))
}

function getCourseOption(key) {
    let pageOptions = getSettingsObject()
    return pageOptions[key]
}

function checkPageSettings() {
    chrome.runtime.sendMessage({ setting: "dark_mode" }, function (response) {
        setDarkMode(response.value)
    });
}

function setDarkMode(enabled) {
    let topParent = document
    while (document.parentElement) {
        topParent = document.parentElement
    }
    let html = topParent.getElementsByTagName("body")[0]

    if (enabled) {
        html.classList.add("dark")
    } else {
        html.classList.remove("dark")
    }
}

function addDarkModeButton() {
    let darkModeButton = htmlToElement('<button class="btn btn-outline-primary " style="float: right;" aria-disabled="false" title="Turn on dark mode" aria-label="Turn on dark mode"><span class="" aria-hidden="true"><svg height="20px" fill="#000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M32 256c0-123.8 100.3-224 223.8-224c11.36 0 29.7 1.668 40.9 3.746c9.616 1.777 11.75 14.63 3.279 19.44C245 86.5 211.2 144.6 211.2 207.8c0 109.7 99.71 193 208.3 172.3c9.561-1.805 16.28 9.324 10.11 16.95C387.9 448.6 324.8 480 255.8 480C132.1 480 32 379.6 32 256z"/></svg></span></button>')
    darkModeButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({ setting: "toggle_dark_mode" }, function (response) {

        })
    });

    //The navbar HTML seems to reset at some point during page load, this is a bad way of doing it, find a solution later 
    setTimeout(function () {
        document.getElementsByClassName("user-dropdown")[0].parentElement.appendChild(darkModeButton)
    }, 3000)
}

export {
    getSettingsObject,
    getCourseOption,
    setCourseOption,
    checkPageSettings,
    addDarkModeButton,
    setDarkMode
}