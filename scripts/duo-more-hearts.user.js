// ==UserScript==
// @name        Duolingo more hearts
// @namespace   https://github.com/maxim5
// @author      maxim
// @version     0.2
// @description Provides more hearts for the leaning sessions
// @match       https://www.duolingo.com/*
// @license     BSD
// @copyright   2014+
// ==/UserScript==

duo.SessionView = duo.SessionView.extend({
    getNumHearts: function() {
        return localStorage ? localStorage.getItem("duo.session.hearts") || 5 : 5;
    }
});

console.log("[Duolingo more hearts applied]");
