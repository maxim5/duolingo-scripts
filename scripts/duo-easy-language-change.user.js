// ==UserScript==
// @name        Duolingo easy language switch
// @namespace   https://github.com/maxim5
// @version     0.1
// @description Allows to switch between different language directions much easier
// @match       https://www.duolingo.com/*
// @copyright   2014+
// ==/UserScript==


/*
    Util: local storage layer
 */

var KEY = "duo.easy-lang-switch.language_directions";

function store(language_direction) {
    if (language_direction && localStorage) {
        var current_direction = duo.user.get("ui_language") + "_" + duo.user.get("learning_language");
        var data = JSON.parse(localStorage[KEY] || "{}");
        data[language_direction] = true;
        data[current_direction] = true;
        localStorage[KEY] = JSON.stringify(data);
    }
}

function getFiltered() {
    var directions = [];
    if (localStorage) {
        var data = JSON.parse(localStorage[KEY] || "{}");
        var ui_language = duo.user.get("ui_language");
        var all_directions = Object.keys(data);
        for (var i = 0; i < all_directions.length; ++i) {
            var direction = all_directions[i],
                langs = direction.split("_");
            if (langs[0] != ui_language) {
                directions.push({
                    ui_lang: langs[0],
                    target_lang: langs[1],
                    name: langs[1] + " from " + langs[0]
                });
            }
        }
    }
    return directions;
}

/*
    Topbar language menu: show saved options
 */

var TEMPLATE =
    "<li data-switch='{{ui_lang}}_{{target_lang}}'>" +
        "<a href='javascript:;'>" +
            "<span class='flag flag-svg-micro flag-{{ui_lang}}'></span>" +
            "<span class='flag flag-svg-micro flag-{{target_lang}}' style='margin-left: 20px'></span>" +
            "<span style='margin-left: 45px'>{{name}}</span>" +
        "</a>" +
    "</li>";

var originalUserTopbarView = duo.UserTopbarView;
duo.UserTopbarView = duo.UserTopbarView.extend({
    render: function() {
        originalUserTopbarView.prototype.render.call(this);

        var directions = getFiltered();
        if (directions.length) {
            var menu = this.$(".dropdown-menu.languages");
            var divider = menu.find(".divider");

            divider.before($("<li>", {"class": "divider"}));
            for (var i = 0; i < directions.length; ++i) {
                var rendered = $.duostache(TEMPLATE, directions[i], duo.templates);
                divider.before(rendered);
            }

            menu.find("[data-switch]").click(function() {
                var lang_direction = $(this).attr("data-switch");
                if (lang_direction) {
                    var username = duo.user.get("username"),
                        data = {language_direction: lang_direction};

                    $.ajax({
                        url: "/users/" + username,
                        data: JSON.stringify(data),
                        success: function(xhr) {
                            if ("ok" == xhr.response) {
                                window.location.reload(true);
                            }
                        },
                        type: "PUT",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8"
                    });
                }
            });
        }

        return this;
    },

    switchLanguage: function(data) {
        originalUserTopbarView.prototype.switchLanguage.call(this, data);
        var learning_language = $(data.currentTarget).data("value");
        if (learning_language) {
            var language_direction = duo.user.get("ui_language") + "_" + learning_language;
            store(language_direction);
        }
    }
});
// Replace the global variable and re-render.
duo.topbar = new duo.UserTopbarView({model: duo.user});
$("#topbar").replaceWith(duo.topbar.render().el);

/*
    Settings: store the user language choices locally
 */

var originalSettingsView = duo.SettingsView;
duo.SettingsView = duo.SettingsView.extend({
    update: function(e) {
        originalSettingsView.prototype.update.call(this, e);

        var language_direction = this.getSettings().language_direction;
        store(language_direction);
    }
});
// Update the instance in the router.
// TODO: Currently does not patch the view instance if it is already presented.
duo.settingsRouter.settings = new duo.SettingsView;


console.log("[Duolingo easy language switch applied]");
