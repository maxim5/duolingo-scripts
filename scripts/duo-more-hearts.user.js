// ==UserScript==
// @name        Duolingo more hearts
// @namespace   https://github.com/maxim5
// @version     0.1
// @description Provides more hearts for the leaning sessions
// @match       https://www.duolingo.com/*
// @copyright   2014+
// ==/UserScript==

duo.SessionView = duo.SessionView.extend({
    getNumHearts: function() {
        return 6;
    }
});

console.log("[Duolingo more hearts applied]");
