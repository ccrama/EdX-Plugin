function getURLFrom(document) {
    //The url for video completion is in the data-metadata of the video div

    let videoParent = document.getElementsByClassName('video')[0]
    let metadata = videoParent.getAttribute('data-metadata')
    let metadataObj = JSON.parse(metadata)

    if(metadataObj && metadataObj.publishCompletionUrl) {
        return metadataObj.publishCompletionUrl
    }

    return null
}

function enable(document) {
    let autoCompleteUrl = null

    //Get the url from the DOM
    autoCompleteUrl = getURLFrom(document)
    console.log("Autocomplete URL is:", autoCompleteUrl)

    //Send this event to the parent window
    chrome.runtime.sendMessage({ autocomplete_url: autoCompleteUrl }, function(response) {
        console.log("Response from parent:", response)
    })
}

export {
    enable
}