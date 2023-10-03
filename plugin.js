//Used for localstorage for per-class settings
let isParentWindow = window.location.href.includes("learning.edx.org")
let currentCourse = window.location.pathname.split("/")[2]

let darkModeSetting = null
let skipIntroSetting = null

;(async () => {
    const settings = await import('./util/settings.js')
    //const autoComplete = await import('./dom/autoComplete.js')

    if (currentCourse) {
        if (isParentWindow) {
            currentCourse = currentCourse.replace("course-v1:", "")
        } else {
            let split = currentCourse.split("@")
            currentCourse = split[0].replace("block-v1:", "")
        }
    } else {
        currentCourse = "global"
    }


    /* Event Listeners */
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.setting === 'dark_mode') {
            settings.setDarkMode(request.new_value)
            sendResponse()
        } else if (false && request.autocomplete_url && isParentWindow) {
            sendResponse()
            //Find all .next-btn and .next-button elements, and add a click listener
            let nextButtons = document.getElementsByClassName('next-btn').append(...document.getElementsByClassName('next-button'))
            for (let i = 0; i < nextButtons.length; i++) {
                console.log("Adding to button")
                nextButtons[i].addEventListener('click', function () {
                    console.log("Sending a POST request to", request.autocomplete_url)
                    //Send a POST request to the URL
                    let xhr = new XMLHttpRequest();
                    xhr.open("POST", request.autocomplete_url, true);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send(JSON.stringify({}));
                }, true)
            }
        }
    });


    /* Videos */
    function skipIntro(seconds, video) {
        video.currentTime += seconds
    }

    function wrapVideos() {
        var players = document.getElementsByTagName('video');

        for (var i = 0, l = players.length; i < l; i++) {
            let node = players[i]
            node.muted = false;

            node.addEventListener('timeupdate', (event) => {
                let skipIntroTime = settings.getCourseOption("skip_intro")
                if (skipIntroTime && event.srcElement.currentTime < skipIntroTime) {
                    skipIntro(skipIntroTime - event.srcElement.currentTime, event.srcElement);
                }
            })

            node.addEventListener("click", event => {
                event.stopPropagation();

                if (node.playing) {
                    node.controls = true;
                }

            }, { capture: true });

            //Add a settings menu to the current video menu
            let settingsMenu = htmlToElement('<div class="" style="display: inline-block; float: left;"></div>')
            let settingsButton = htmlToElement('<button class="control" type="button"><span class="fa fa-cog"></span></button>')

            let menu = htmlToElement('<div class="hidden" id="settings-dropdown" ></div>')

            settingsButton.addEventListener('click', function (event) {
                menu.classList.toggle('hidden')
            })

            let nonDefault = settings.getCourseOption("skip_intro") != null ? `value="${settings.getCourseOption("skip_intro")}"` : ''
            let secondsInput = htmlToElement('<span>Skip first <input type="numeric" ' + nonDefault + ' " placeholder="" style="width: 30px;"/> seconds</span>')

            secondsInput.addEventListener('change', function (event) {
                let newValue = event.target.value

                settings.setCourseOption('skip_intro', newValue)
            })

            menu.appendChild(secondsInput)
            settingsMenu.appendChild(settingsButton)
            settingsMenu.appendChild(menu)

            document.getElementsByClassName('video-controls')[0].appendChild(settingsMenu)
        }
    }


    /* Set up page */
    if (isParentWindow) {
        settings.addDarkModeButton()
    } else {
        wrapVideos()
        if (false && settings.getCourseOption("complete_on_next")) {
            autoComplete.enable(document)
        }
    }
})();
