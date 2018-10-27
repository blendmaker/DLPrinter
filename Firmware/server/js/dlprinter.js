var app = {
    pages: [{
            'general': 'General',
            'printing': 'Printing',
            'settings': 'Settings',
        },
        {
            'logout': 'Logout',
        }
    ],
    ws: false,
    settings: false,
    currentPage: 'general',
    currentlyPrinting: false,

    init: function() {
        app.ws = new WebSocket('ws://' + window.location.host);
        app.pages.forEach(function(nav, i) {
            for (let k in nav) {
                let menu = i == 0 ? '#primary-menu' : '#secondary-menu';
                $(menu).append($('<li>', {
                    class : 'nav-item',
                }).append($('<a>', {
                    class : 'nav-link',
                    text : nav[k],
                    href : '#' + k,
                })));
            }
        });

        $('button').click(function(e){
            if ($(this).attr('id') == 'white' || $(this).attr('id') == 'black') {
                app.ws.send(JSON.stringify({ 'cmd' : 'color', 'color' : $(this).attr('id') }));
            } else if ($(this).attr('id') == 'text') {
                app.ws.send(JSON.stringify({ 'cmd' : 'text', 'text' : 'Hello world!' }));
            } else if ($(this).attr('id') == 'layer') {
                app.ws.send(JSON.stringify({ 'cmd' : 'layer' }));
            }
        });

        app.navigate();
    },

    navigate: function(e) {
        let hash = (window.location.hash.length == 0) ? ('#' + Object.keys(app.pages[0])[0]) : window.location.hash;
        $('.navbar-nav li').removeClass('active');
        $('a[href="' + hash + '"]').parent().addClass('active');
        $('.content-element').hide();
        $('.content-element' + hash).show();
    }
};

$(window).on('hashchange', app.navigate);
$(document).ready(function() {
    $.ajax({ 'url' : '/settings', success : function(d){
        app.settings = d;
        app.init();
    }});

    setInterval(function(){
        // send heartbeat
        if (app.ws.readyState == 'OPEN') {
            app.ws.send("{ 'cmd':'heartbeat'}");
        } else if (app.ws.readyState == 'CLOSED') {
            app.ws.open();
        }
    }, 1000);
});