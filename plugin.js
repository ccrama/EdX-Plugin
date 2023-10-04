//Used for localstorage for per-class settings
let isParentWindow = window.location.href.includes("learning.edx.org")
let currentCourse = window.location.pathname.split("/")[2]

;(async () => {
    var settings = await import('./util/settings.js')
    settings = settings.settings
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
            settings.darkMode.setGlobalOption(request.new_value)
            settings.darkMode.apply()
            sendResponse()
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
                let skipIntroTime = settings.skipIntro.getCourseOption(currentCourse)
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

            let nonDefault = settings.skipIntro.getCourseOption(currentCourse) != null ? `value="${settings.skipIntro.getCourseOption(currentCourse) }"` : ''
            let secondsInput = htmlToElement('<span>Skip first <input type="numeric" ' + nonDefault + ' " placeholder="" style="width: 30px;"/> seconds</span>')

            secondsInput.addEventListener('change', function (event) {
                let newValue = event.target.value

                settings.skipIntro.setCourseOption(currentCourse, newValue)
            })

            menu.appendChild(secondsInput)
            settingsMenu.appendChild(settingsButton)
            settingsMenu.appendChild(menu)

            document.getElementsByClassName('video-controls')[0].appendChild(settingsMenu)
        }
    }

    settings.darkMode.apply();

    /* Set up page */
    if (isParentWindow) {
        settings.darkMode.addDarkModeButton()
    } else {
        wrapVideos()
    }
})();