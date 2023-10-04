/* Add new properties to Video players */

Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
    get: function() {
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
})
Object.defineProperty(HTMLMediaElement.prototype, 'ct', {
    get: function() {
        return this.currentTime;
    }
})