// ==UserScript==
// @name        Duolingo Time Session UX Userscript
// @namespace   https://github.com/maxim5
// @version     0.3
// @description Stops the time session timer after the answer is done
// @match       https://www.duolingo.com/*
// @copyright   2014+
// ==/UserScript==

var originalTimingModule = duo.TimingModule;

duo.TimingModule = duo.TimingModule.extend({
    initialize: function(options) {
        originalTimingModule.prototype.initialize.call(this, options);
      	this.model.bind("continue", this.resume, this);
    },

    // A copy that does not call `this.resume();`.
    graded: function() {
        var solution = this.model.getSubmittedSolution(),
            session = solution.get("session_element");
        this.extra && solution.get("correct") && (this.total_time += 1E3 * this.model.calculateExtraTime(session));
    }
});

console.log("[Duolingo Time Session UX patch applied]");
