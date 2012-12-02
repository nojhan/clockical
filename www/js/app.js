
require.config({
    baseUrl: 'js/lib',
    paths: {'jquery':
            ['//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
             'jquery']},

});


// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

define(function(require) {

    // jQuery
    var $ = require("jquery");
    //var $ = require("http://code.jquery.com/jquery-1.7.1.min.js");

    // Need to verify receipts? This library is included by default.
    // https://github.com/mozilla/receiptverifier
    require('receiptverifier');

    // Want to install the app locally? This library hooks up the
    // installation button. See <button class="install-btn"> in
    // index.html
    require('./install-button');


    // Return the handler on an object in the SVG clock, given its id.
    function getLayer( id )
    {
        console.assert( id != null );
        console.assert( id != "" );
        var svgTag = document.getElementById( "clockical" );
        console.assert( svgTag != null );
        var svgDoc = svgTag.getSVGDocument();
        console.assert( svgDoc != null );
        var layer = svgDoc.getElementById(id);
        console.assert( layer != null );
        //console.debug("Layer ",layer);
        return layer;
    }

    // Apply a given transformation on a hand (rotation, scale)
    // and translate it to the center.
    function updateHand( id, angle, width, scale )
    {
        console.assert( id != null );
        console.assert( id != "" );
        console.assert( angle >= 0 && angle <= 360 );
        console.assert( width > 0 );
        console.assert( scale > 0 );

        // FIXME use the rotation center
        var offset = width * scale / 2;

        console.debug( "Update", id, "to", angle, "°+", offset, "*", scale );

        var layer = getLayer( id );

        // NOTE: the order of the transformations is important!
        layer.setAttribute('transform',
              'translate('+ offset +','+ offset +') '
            + 'rotate('+ angle +')'
            + 'scale('+ scale +') '
        );
    }

    // Apply a scale transformation on all given layers (defaults to the known ones).
    // Do not scale the hand, this is done in the updateHand function.
    function scaleAll( scale, layers = ["clock","numbers","glass"] )
    {
        console.assert( scale > 0 );
        console.assert( layers.length >= 1 );

        console.debug( "Scale *",scale, "for", layers );

        for(var i=0,len=layers.length; img=layers[i], i<len; i++) {
            var layer = getLayer( img );
            layer.setAttribute('transform', 'scale('+scale+')');
        } // for img
    }

    // Change attributes of the clock SVG, given a new theme and size.
    function loadClock( theme, width, scale )
    {
        console.assert( theme != "" );
        console.assert( width > 0 );
        console.assert( scale > 0 );

        var offset = width * scale / 2;

        console.debug( "Load clock", theme,"+", offset, "*", scale, "x", width );

        var svgTag = document.getElementById( "clockical" );
        console.assert( svgTag != null );

        svgTag.setAttribute( 'data', 'img/themes/'+ theme +'.svg' );
        svgTag.setAttribute( 'style', 'position:absolute;top:'+ offset +'px;left:'+ offset +'px;' );
        svgTag.setAttribute( 'width', ''+ width * scale );
    }

    // When document is ready, configure the clock SVG
    // and add the update function to be called every minute.
    (function($) {
        $(document).ready( function() {

            var _width = 100;
            var _scale = 4;

            function tick()
            {
                var now = new Date();
                var seconds = now.getSeconds();
                var minutes = now.getMinutes();
                var hours   = now.getHours() + minutes / 60;

                a0 = 90; // angle offset between axis and a clock
                tn = 24; // ticks number

                console.assert( 0 <= seconds && seconds <= 60 );
                console.assert( 0 <= minutes && minutes <= 60 );
                console.assert( 0 <= hours && hours <= 24 );
                console.assert( 0 <= a0 && a0 <= 360 );
                console.assert( tn == 12 || tn == 24 );

                console.debug( "===== Tick =====\n", hours, "h ", minutes, "m", seconds, "s /", tn, "@", a0 );

                updateHand("hand_seconds", seconds *  6     - a0, _width, _scale );
                updateHand("hand_minutes", minutes *  6     - a0, _width, _scale );
                updateHand("hand_hours",     hours * 360/tn - a0, _width, _scale );

                scaleAll( _scale ); // we need to scale every second (not sure to know why)
            }

            loadClock('default', _width, _scale );
            //tick(); // FIXME cannot do a first update??
            setInterval( tick, 1000 ); // every second
            //setInterval( tick, 60000 ); // every minute

        }); // document ready
    })(jQuery);
});

