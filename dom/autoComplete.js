function getURLFrom(document) {
    //The url for video completion is in the data-metadata of the video div

    let videoParent = document.getElementsByClass('video')[0]
    let metadata = videoParent.getAttribute('data-metadata')
    let metadataObj = JSON.parse(metadata)

    if(metadataObj && metadataObj.publishCompletionUrl) {
        return metadataObj.publishCompletionUrl
    }

    return null
}

//Since this dom is in an iframe in the parent, and the parent is the one that actually has the next button, we need to hook into the page unload event to fire off the API request


function enable(document, window) {
    console.log("Getting URL")
    let autoCompleteUrl = null
    window.addEventListener('beforeunload', function (e) {
        if (autoCompleteUrl) {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", autoCompleteUrl, true);
            xhr.send();
        }
    });

    //Get the url from the DOM
    autoCompleteUrl = getURLFrom(document)
    console.log("Got url", autoCompleteUrl)

}