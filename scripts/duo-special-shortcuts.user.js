// ==UserScript==
// @name        Duolingo shortcuts for special symbols
// @namespace   https://github.com/maxim5
// @version     0.3
// @description Provides shortcuts for special symbols
// @match       https://www.duolingo.com/*
// @copyright   2014+
// ==/UserScript==

var originalSessionView = duo.SessionView;

var KEY_INDEX = {
    es: {           // áéíóúüñ¿¡ ÁÉÍÓÚÜÑ¿¡
        a: "á", e: "é", i: "í¡", o: "ó", u: "úü", n: "ñ", "?": "¿",
        A: "Á", E: "É", I: "Í¡", O: "Ó", U: "ÚÜ", N: "Ñ"
    },
    de: {           // äöüß ÄÖÜß
        a: "ä", o: "ö", u: "ü", s: "ß",
        A: "Ä", O: "Ö", U: "Ü", S: "ß"
    },
    fr: {           // àâæèéêëîïôùûüçœ ÀÂÆÈÉÊËÎÏÔÙÛÜÇŒ
        a: "àâæ", e: "èéêë", i: "îï", o: "ôœ", u: "ùûü", c: "ç",
        A: "ÀÂÆ", E: "ÈÉÊË", I: "ÎÏ", O: "ÔŒ", U: "ÙÛÜ", C: "Ç"
    },
    pt: {           // ãáâàéêíõóôúüç ÃÁÂÀÉÊÍÕÓÔÚÜÇ
        a: "ãáâà", e: "éê", i: "í", o: "õóô", u: "úü", c: "ç",
        A: "ÃÁÂÀ", E: "ÉÊ", I: "Í", O: "ÕÓÔ", U: "ÚÜ", C: "Ç"
    },
    it: {           // àáèéìíòóùú ÀÁÈÉÌÍÒÓÙÚ
        a: "àá", e: "èé", i: "ìí", o: "òó", u: "ùú",
        A: "ÀÁ", E: "ÈÉ", I: "ÌÍ", O: "ÒÓ", U: "ÙÚ"
    },
    da: {           // æøå ÆØÅ
        a: "æå", o: "ø",
        A: "ÆÅ", O: "Ø"
    },
    ga: {           // áéíóú ÁÉÍÓÚ
        a: "á", e: "éíóú", i: "í", o: "ó", u: "ú",
        A: "Á", E: "ÉÍÓÚ", I: "Í", O: "Ó", U: "Ú"
    },
    dn: {           // áéèëï ÁÉÈËÏ
        a: "á", e: "éèë", i: "ï",
        A: "Á", E: "ÉÈË", I: "Ï"
    }
};

// Stolen from http://stackoverflow.com/questions/2897155/get-cursor-position-in-characters-within-a-text-input-field
$.fn.getCursorPosition = function() {
    var input = this.get(0);
    if (!input) return;             // No (input) element found
    if ('selectionStart' in input) {
        // Standard-compliant browsers
        return input.selectionStart;
    } else if (document.selection) {
        // IE
        input.focus();
        var sel = document.selection.createRange();
        var selLen = document.selection.createRange().text.length;
        sel.moveStart('character', -input.value.length);
        return sel.text.length - selLen;
    }
};

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
        var keyIndex = KEY_INDEX[lang];

        function getNextChar(previous, current) {
            if (!previous || !current) {
                return;
            }
            var sequence = (current == "`") ? keyIndex[previous] : keyIndex[current];
            if (!sequence) {
                return;
            }
            if (current == "`") {
                return sequence[0];     // TODO: support next ` hits
            }
            var idx = sequence.indexOf(previous);
            return previous == "\\" ? sequence[0] : idx >= 0 ? sequence[(idx + 1) % sequence.length] : null;
        }

        input.keypress(function(e) {
            var cursor = input.getCursorPosition();
            var value = input.val();
            var charBeforeCursor = cursor == 0 ? null : value.charAt(cursor - 1);
            var pressedChar = String.fromCharCode(e.which);
            var nextInSequence = getNextChar(charBeforeCursor, pressedChar);

            if (nextInSequence) {
                // For simplicity support all normal browsers and IE 9+
                if (typeof this.selectionStart == "number" && typeof this.selectionEnd == "number") {
                    var start = this.selectionStart;
                    var end = this.selectionEnd;
                    this.value = value.slice(0, start - 1) + nextInSequence + value.slice(end);
                    this.selectionStart = this.selectionEnd = start;     // Move the caret
                }
                return false;
            }
        });
    }
});

duo.TimedSessionView = duo.TimedSessionView.extend({
    render: function () {
        duo.SessionView.prototype.render.call(this);
        duo.SessionView.prototype.attachShortcuts.call(this);
        return this;
    }
});

console.log("[Duolingo shortcuts for special symbols applied]");
