// ==UserScript==
// @name        Duolingo Long Time Session Userscript
// @namespace   https://github.com/maxim5
// @version     0.3
// @description Makes the time session longer (5 minutes)
// @match       https://www.duolingo.com/*
// @copyright   2014+
// ==/UserScript==

var originalTimingModule = duo.TimingModule;

duo.TimingModule = duo.TimingModule.extend({
    initialize: function(options) {
        options.total_time = 300;
        options.original_total_time = 300;
        options.long_sentence_bonus = 5;
        originalTimingModule.prototype.initialize.call(this, options);
    }
});

console.log("[Duolingo Long Time Session patch applied]");
