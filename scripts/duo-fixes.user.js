// ==UserScript==
// @name        Duolingo fixes
// @namespace   https://github.com/maxim5
// @version     0.1
// @description Various bug-fixes
// @match       https://www.duolingo.com/*
// @copyright   2014+
// ==/UserScript==

var fixCtrlClick = _.throttle(function() {
    $("a[href]").each(function() {
        var link = $(this),
            href = link.attr("href");
        if (!href || href == "#" || href == "javascript:" || href == "javascript:;") {
            return;
        }
        link.off("click.ctrl-fix").on("click.ctrl-fix", function(e) {
            if (e.ctrlKey || e.metaKey) {
                window.open(href, '_blank');
                return false;
            }
        });
    });
}, 100);

$(document).ajaxStop(function() {
    fixCtrlClick();
});

console.log("[Duolingo fixes applied]");
