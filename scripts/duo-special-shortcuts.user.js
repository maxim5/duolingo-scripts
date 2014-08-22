// ==UserScript==
// @name        Duolingo shortcuts for special symbols
// @namespace   https://github.com/maxim5
// @version     0.2
// @description Provides shortcuts for special symbols
// @match       https://www.duolingo.com/*
// @copyright   2014+
// ==/UserScript==

var originalSessionView = duo.SessionView;

duo.SessionView = duo.SessionView.extend({
    initialize: function(options) {
        originalSessionView.prototype.initialize.call(this, options);
        this.model.bind("render", this.attachShortcuts, this);
    },

    attachShortcuts: function() {
        // It is possible to have two virtual keyboards: from the current challenge and from the previous one.
        var placeholder = $("#session-element-container").find("#vkeyboard-placeholder"),
            data = placeholder.data("vkeyboard");
        if (!data) {
            return;
        }

        var input = data.input_field;
        var vdata = input.data("vkeyboard");
        var lang = vdata.language;
        input.keydown(function(e) {
            var code = e.keyCode;
            var capitalKey = e.shiftKey && (e.altKey || e.ctrlKey);
            var normalKey = e.altKey && e.ctrlKey;
            if ((!capitalKey && !normalKey) || (code < 49) || (code > 57)) {
                return;
            }

            var ch = $.vkeyboard.getChars(lang, capitalKey).charAt(code - 49);
            if (ch) {
                var range = (document.selection) ? document.selection.createRange() : null;
                var firstRange = (window.getSelection && 0 < window.getSelection().rangeCount) ?
                                window.getSelection().getRangeAt(0) : null;
                input.insertAtCaret(ch, range, firstRange);
                return false;
            }
        });
    }
});

console.log("[Duolingo shortcuts for special symbols applied]");
