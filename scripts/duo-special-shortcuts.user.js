// ==UserScript==
// @name        Duolingo shortcuts for special symbols
// @namespace   https://github.com/maxim5
// @version     0.4
// @description Provides shortcuts for special symbols
// @match       https://www.duolingo.com/*
// @copyright   2014+
// ==/UserScript==

var originalSessionView = duo.SessionView;

/*
    Util: make indices for the special chars.
 */

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
        a: "á", e: "é", i: "í", o: "ó", u: "ú",
        A: "Á", E: "É", I: "Í", O: "Ó", U: "Ú"
    },
    dn: {           // áéèëï ÁÉÈËÏ
        a: "á", e: "éèë", i: "ï",
        A: "Á", E: "ÉÈË", I: "Ï"
    }
};

var REVERSE_INDEX = {};
$.each(KEY_INDEX, function(lang, index) {
    var reverseIndex = {};
    $.each(index, function(k, sequence) {
        $.each(sequence, function(i, chr) {
            reverseIndex[chr] = reverseIndex[chr] || sequence + k;      // note: the sequence includes raw char!
        });
    });
    REVERSE_INDEX[lang] = reverseIndex;
});

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

/*
    Patch the SessionView and TimedSessionView.
 */

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
        var reverseIndex = REVERSE_INDEX[lang];

        function getNextChar(previous, current) {
            if (!previous || !current) {
                return;
            }
            if (current == "`") {
                var sequence = keyIndex[previous];
                if (sequence) {
                    return sequence[0];
                }
                sequence = reverseIndex[previous];
                var idx = sequence ? sequence.indexOf(previous) : -1;
                if (idx >= 0) {
                    return sequence[(idx + 1) % sequence.length];
                }
            }
        }

        input.keypress(function(e) {
            var cursor = input.getCursorPosition();
            var value = input.val();
            var charBeforeCursor = cursor == 0 ? null : value.charAt(cursor - 1);
            var pressedChar = String.fromCharCode(e.which);
            var nextInSequence = getNextChar(charBeforeCursor, pressedChar);

            // For simplicity support all normal browsers and IE 9+
            if (nextInSequence && typeof this.selectionStart == "number" && typeof this.selectionEnd == "number") {
                var start = this.selectionStart;
                var end = this.selectionEnd;
                this.value = value.slice(0, start - 1) + nextInSequence + value.slice(end);
                this.selectionStart = this.selectionEnd = start;     // Move the caret
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
