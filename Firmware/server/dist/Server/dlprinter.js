var app = {
    pages: [{
            'general': 'General',
            'printing': 'Printing',
            'settings': 'Settings'
        },
        {
            'logout': 'Logout'
        }
    ],
    ws: false,
    settings: false,
    currentPage: 'general',
    currentlyPrinting: false,
    init: function () {
        //app.ws = new WebSocket('ws://' + window.location.host);
        app.pages.forEach(function (nav, i) {
            for (var k in nav) {
                var menu = i == 0 ? '#primary-menu' : '#secondary-menu';
                $(menu).append($('<li>', {
                    "class": 'nav-item'
                }).append($('<a>', {
                    "class": 'nav-link',
                    text: nav[k],
                    href: '#' + k
                })));
            }
        });
        // build settings form
        $.each(app.settings, function (k, v) {
            $('form#form-settings').append($('<label>', {
                text: v.name,
                "class": 'col-sm-2 col-xs-8',
                attr: { 'for': k }
            })).append($('<input>', {
                type: 'text',
                name: k,
                "class": 'col-sm-2 col-xs-4',
                style: 'text-align: right',
                value: v.value,
                id: k,
                attr: {
                    'data-toggle': 'tooltip',
                    'data-html': 'true',
                    'title': v.description
                }
            }));
        });
        $('form#form-settings').append($('<div>', { "class": 'w-100' }));
        $('form#form-settings').append($('<button>', {
            text: 'save',
            "class": 'btn btn-primary',
            type: 'submit',
            id: 'save-settings'
        }));
        $('form#form-settings').submit(function (e) {
            e.preventDefault();
            e.stopPropagation();
            // build new settingsobject from inputs
            var tmpSettings = {};
            $(this).find('label').each(function () {
                tmpSettings[$(this).attr('for')] = {
                    'value': $('input[name="' + $(this).attr('for') + '"]').val(),
                    'name': $(this).text(),
                    'description': $('input[name="' + $(this).attr('for') + '"]').attr('data-original-title')
                };
            });
            app.sendMain({ 'cmd': 'settings', 'settings': tmpSettings });
        });
        $('input[data-toggle="tooltip"]').tooltip({ 'trigger': 'focus' });
        // debug stuff
        $('button').click(function (e) {
            if ($(this).attr('id') == 'white' || $(this).attr('id') == 'black') {
                app.sendMain({ 'cmd': 'color', 'color': $(this).attr('id') });
            }
            else if ($(this).attr('id') == 'text') {
                app.sendMain({ 'cmd': 'text', 'text': 'Hello world!' });
            }
            else if ($(this).attr('id') == 'layer') {
                app.sendMain('layer');
            }
        });
        app.navigate();
    },
    sendMain: function (msg) {
        // https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
        var WsReadyState = {
            CONNECTING: 0,
            OPEN: 1,
            CLOSING: 2,
            CLOSED: 3
        };
        if (!app.ws || app.ws.readyState == WsReadyState.CLOSED) {
            app.ws = new WebSocket('ws://' + window.location.host);
            app.ws.onclose = function (e) {
                $('#lifesign').removeClass('alive');
            };
        }
        if (typeof msg == 'string') {
            msg = { 'cmd': msg };
        }
        if (app.ws.readyState == WsReadyState.OPEN) {
            app.ws.send(JSON.stringify(msg));
            $('#lifesign').addClass('alive');
        }
        return app.ws.readyState == WsReadyState.OPEN;
    },
    navigate: function (e) {
        var hash = (window.location.hash.length == 0) ? ('#' + Object.keys(app.pages[0])[0]) : window.location.hash;
        $('.navbar-nav li').removeClass('active');
        $('a[href="' + hash + '"]').parent().addClass('active');
        $('.content-element').hide();
        $('.content-element' + hash).show();
    }
};
$(window).on('hashchange', app.navigate);
$(document).ready(function () {
    $.ajax({ 'url': '/settings', success: function (d) {
            app.settings = d;
            app.init();
        } });
    setInterval(function () {
        // send heartbeat
        app.sendMain('heartbeat');
    }, 1000);
});
//# sourceMappingURL=dlprinter.js.map