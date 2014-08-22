// ==UserScript==
// @name        Duolingo stop the time
// @namespace   https://github.com/maxim5
// @version     0.1
// @description Stops the time-session timer completely
// @match       https://www.duolingo.com/*
// @copyright   2014+
// ==/UserScript==

duo.TimingModule = duo.TimingModule.extend({
    getSecondsLeft: function() {
        return this.original_total_time / 1E3;
    }
});

console.log("[Duolingo stop the time applied]");
