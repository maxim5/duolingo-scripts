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
        // For some reason original_total_time is 60 seconds.
        return 30;
    }
});

console.log("[Duolingo stop the time applied]");
