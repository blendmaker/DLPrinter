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
    currentPage: 'general',
    currentlyPrinting: false,

    init: function() {
        app.pages.forEach(function(nav, i) {
            for (let k in nav) {
                let menu = i == 0 ? '#primary-menu' : '#secondary-menu';
                $(menu).append($('<li>').append($('<a>', {
                    text: nav[k],
                    href: '#' + k,
                })));
            }
        });

        app.navigate();
    },
    navigate: function(e) {
        let hash = (window.location.hash.length == 0) ? ('#' + Object.keys(app.pages[0])[0]) : window.location.hash;
        //console.log(hash);
        $('.navbar-nav li').removeClass('active');
        $('a[href="' + hash + '"]').parent().addClass('active');
        $('.content-element').hide();
        $('.content-element' + hash).show();
    }
};
$(window).on('hashchange', app.navigate);
$(document).ready(function() {
    app.init();
});