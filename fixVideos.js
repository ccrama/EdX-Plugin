let isParentWindow = window.location.href.includes("learning.edx.org")
let currentCourse = window.location.pathname.split("/")[2]

if (currentCourse) {
    if (isParentWindow) {
        currentCourse.replace("course-v1:", "")
    } else {
        currentCourse.replace("block-v1:", "")
    }
} else {
    currentCourse = "global"
}


//Set up event listeners
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.setting === 'dark_mode') {
        setDarkMode(msg.new_value)
        sendResponse()
    }
});

function checkPageSettings() {
    chrome.runtime.sendMessage({ setting: "dark_mode" }, function(response) {
        setDarkMode(response.value)
    });
}

function getCourseOptions() {
    let foundOptions = localStorage.getItem('edx-improver:' + currentCourse)

    return foundOptions ? JSON.parse(foundOptions) : { skip_intro: 0 }
}

let pageOptions = getCourseOptions()

function setCourseOption(key, value) {
    pageOptions.skip_intro = value

    localStorage.setItem('edx-improver:' + currentCourse, JSON.stringify(pageOptions))
}


function wrapVideos() {
    var players = document.getElementsByTagName('video');

    for (var i = 0, l = players.length; i < l; i++) {
        let node = players[i]
        node.muted = false;

        node.addEventListener('timeupdate', (event) => {
            if (event.srcElement.currentTime < pageOptions.skip_intro) {
                skipIntro(pageOptions.skip_intro - event.srcElement.currentTime, event.srcElement);
            }
        })

        node.addEventListener("click", event => {
            event.stopPropagation();

            if (node.playing) {
                node.controls = true;
            }

        }, { capture: true });

        let settingsMenu = htmlToElement('<div class="" style="display: inline-block; float: left;"></div>')
        let settingsButton = htmlToElement('<button class="control" type="button"><span class="fa fa-cog"></span></button>')

        let menu = htmlToElement('<div class="hidden" id="settings-dropdown" ></div>')

        settingsButton.addEventListener('click', function(event) {
            menu.classList.toggle('hidden')
        })

        let nonDefault = pageOptions.skip_intro ? `value="${pageOptions.skip_intro}"` : ''
        let secondsInput = htmlToElement('<span>Skip first <input type="numeric" ' + nonDefault + ' " placeholder="" style="width: 30px;"/> seconds</span>')

        secondsInput.addEventListener('change', function(event) {
            let newValue = event.target.value

            setCourseOption('skip_intro', newValue)
        })

        menu.appendChild(secondsInput)
        settingsMenu.appendChild(settingsButton)
        settingsMenu.appendChild(menu)

        document.getElementsByClassName('video-controls')[0].appendChild(settingsMenu)
    }
}


checkPageSettings()

if (isParentWindow) {
    addDarkModeButton()
} else {
    wrapVideos()
}

function skipIntro(seconds, video) {
    video.currentTime += seconds
}

function setDarkMode(enabled) {
    let topParent = document
    while (document.parentElement) {
        topParent = document.parentElement
    }
    let html = topParent.getElementsByTagName("html")[0]

    if (enabled) {
        html.classList.add("dark")
    } else {
        html.classList.remove("dark")
    }
}

function addDarkModeButton() {
    let darkModeButton = htmlToElement('<button class="btn btn-outline-primary " style="float: right;" aria-disabled="false" title="Turn on dark mode" aria-label="Turn on dark mode"><span class="" aria-hidden="true"><svg height="20px" fill="#000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M32 256c0-123.8 100.3-224 223.8-224c11.36 0 29.7 1.668 40.9 3.746c9.616 1.777 11.75 14.63 3.279 19.44C245 86.5 211.2 144.6 211.2 207.8c0 109.7 99.71 193 208.3 172.3c9.561-1.805 16.28 9.324 10.11 16.95C387.9 448.6 324.8 480 255.8 480C132.1 480 32 379.6 32 256z"/></svg></span></button>')
    darkModeButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({ setting: "toggle_dark_mode" }, function(response) {

        })
    });

    //The navbar HTML seems to reset at some point during page load, this is a bad way of doing it, find a solution later 
    setTimeout(function() {
        document.getElementsByClassName("user-dropdown")[0].parentElement.appendChild(darkModeButton)
    }, 3000)
}