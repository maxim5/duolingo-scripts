// ==UserScript==
// @name        Duolingo long Time-Session
// @namespace   https://github.com/maxim5
// @author      maxim
// @version     0.4
// @description Makes the time-session longer (5 minutes)
// @match       https://www.duolingo.com/*
// @license     BSD
// @copyright   2014+
// ==/UserScript==

var originalTimingModule = duo.TimingModule;

duo.TimingModule = duo.TimingModule.extend({
    initialize: function(options) {
        options.total_time = localStorage ? localStorage.getItem("duo.time-session.time") || 60 : 60;
        options.shown_max_time = 0;
        originalTimingModule.prototype.initialize.call(this, options);
    }
});

console.log("[Duolingo long Time-Session applied]");
