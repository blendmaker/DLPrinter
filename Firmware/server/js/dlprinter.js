var app = {
    pages : [ 'general', 'printing', 'settings', ],

    init : function() {
        /**
         * Build Bootstrap Navigation
         */
        
    },
    navigate : function(e) {
        console.log(e);
    }
};
$(window).on('hashchange', app.navigate);
$(document).ready(function(){
    app.init();
});