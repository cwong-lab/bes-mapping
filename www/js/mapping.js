/*!
 * Onine map survey demo
 * http://research.markmfredrickson.com
 * Requires the jQuery Java Script Library
 *
 * Copyright 2010, Mark Fredrickson
 * Dual licensed under the MIT or GPL Version 2 licenses, the
 * same license employed by jQuery:
 * http://jquery.org/license
 *
 */

function bes_drawing_initialize() {

  // polygon defaults
  var polycolor = "#000000"; // black turns grey with opacity
  var fillopacity = 0.5;
  var strokeweight = 1;
   
  var makeButton = function(text) {
    return(jQuery("<a class = 'drawing-button'><span class = 'ui-button-text'>" + text + "</span></a>"))
  }

  // record map events
  // map is a Google Map object,
  // hiddenField is an input into which events are appended
  var mapRecorder = function(map, hiddenField) {
    var f = $(hiddenField);
    f.val("(Started," + (new Date().getTime()) + ")");
    var record = function(msg) {
      f.val(f.val() + ";(" + msg + "," + (new Date().getTime()) + ")");
    };

    // records zoom, moving
    google.maps.event.addListener(map, 
                                  "zoom_changed", 
                                  function() { record("zoom:" + map.getZoom())});

    google.maps.event.addListener(map,
                                  "center_changed",
                                   function() { record("center:" + map.getCenter().toString())});
  }

  $(".scribble-map").each(function(idx) {
    var map;
    var communities = [];
    var widget = $(this);
    var lat = $(".lat", this).val();
    var lon = $(".lon", this).val();
    var zoom = 6;

    // if the user did not specify a postcode or address, just display the UK at zoom 6
    if (lat == "") {
        lat = 53;
    }

    if (lon == "") {
        lon = -1;
    }

    // user did provide a post code
    if ($(".postcode", this).val() != "") {
        zoom = parseInt($(".zoom", this).val());
    }

    var center = new google.maps.LatLng(lat, lon);
    var options = {center: center,
                 zoom: zoom,
                 mapTypeId: google.maps.MapTypeId.ROADMAP,
                 scrollwheel: false,
                 maxZoom: 17,
                 minZoom: 4,
                 streetViewControl: false};

    var mapContainer = $(".map-canvas", this).get(0);  

    var map = new google.maps.Map(mapContainer,
                                  options);

    if ($(".postcode", this).val() != "") {
        var centerMarker = new google.maps.Marker({ position: center, map: map }); 
    }

    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: false,
        drawingControlOptions: {
            drawingModes: [google.maps.drawing.OverlayType.POLYGON]
        },
        polygonOptions: { editable: true }
    });
    drawingManager.setMap(map);
    drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON); // start the user in drawing mode

    var stopToggle = false;

    var mkButton = function(txt) {

        var style = "font-size: " + Math.ceil(0.025 * Math.min($(document).width(), $(document).height())) + "px;";
        return($("<div class = 'mapbutton' style = '" + style + "'><b>" + txt + "</b></div>"));
    }

    var resetButton = mkButton("Reset");
    var doneButton  = mkButton("Done");
    var skipButton  = mkButton("Skip Drawing");
    var abortButton = mkButton("Stop");
    var drawButton  = mkButton("Draw");

    var startDrawing = function() {
        stopToggle = false; // just to be sure
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
        drawButton.hide();
        abortButton.show();
    }

    var stopDrawing = function() {
        drawingManager.setDrawingMode(null);
        drawButton.show();
        abortButton.hide();
    }
                                 
    resetButton.click(function() {
        $.each(communities, function(idx, c) { c.setMap(null); })
        communities = [];
        stopToggle = true;
        stopDrawing();
        return(false);
    });
                                 
    doneButton.click(function() {
        stopToggle = true;
        stopDrawing();
        $("form").submit();
    });

    // identical to done button
    skipButton.click(function() {
        stopToggle = true;
        stopDrawing();
        $("form").submit();
    });

    abortButton.click(function() { stopToggle = true; stopDrawing() });
    drawButton.click(startDrawing);

    startDrawing();

    var buttonContainer = $("<div>");
    buttonContainer.append(drawButton);
    buttonContainer.append(abortButton);
    buttonContainer.append(resetButton);
    buttonContainer.append(doneButton);
    buttonContainer.append(skipButton);
    buttonContainer.css("z-index", 1);

    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(buttonContainer[0]);

    this.gmap = map;

    // record user interations
    mapRecorder(map, $("input.events", this));

    var hiddenfield = $(".drawing", this);


    var popupmutex = true; // prevents multiple pop ups from appearing.
    // var communities = [];
    google.maps.event.addListener(
        drawingManager,
        'polygoncomplete',
        function(poly) {
            if (!stopToggle) {

                // save the polygon to the array of drawings
                communities.push(poly);
                stopToggle = false;

                google.maps.event.addListener(poly, 'click', function(e) {
                    if (popupmutex) {
                        popupmutex = false;
                        // Note: might be slightly more efficient to create the window
                        // once, rather than for each click.
                        var content = $("<div class = 'delete-community'></div>").addClass("polygon-popup"); 
                        content.append($("<p>Do you want to delete this community?</p>"));
                        var buttons = $("<p></p>");
                        buttons.append(
                            makeButton("Yes").click(function() {
                                // TODO: remove poly from list of polys
                                communities = $.grep(communities, function(e,i) { return e !== poly; }) 
                                poly.setMap(null);
                                popup.close();
                                popupmutex = true;
                            }));
                        buttons.append(makeButton("No").click(function() {
                            popup.close();
                            popupmutex = true;
                            return(false);
                        }));
                        content.append(buttons);
                        content.append("<div>");

                        var popup = new google.maps.InfoWindow({content: content[0], position: e.latLng});

                        google.maps.event.addListener(popup, "closeclick", function() {
                            popupmutex = true;
                        });
                        popup.open(map);
                    }
            });
        } else {
            poly.setMap(null); // discard the poly because the user click abort/reset/etc.
        }
      stopToggle = false;
    });

    // this would need to be changed for YouGov's system.
    $("form").submit(function(event) {
        var asString = $.map(communities,
                             function(p) {
                                 return($.map(p.getPath().getArray(), function(i) {
                                     return(i.lng() + " " + i.lat()); }).join(',')) }).join(';');
        hiddenfield.val(asString);
    });

  });

  var staticMap = function(within, center) {
    return(new google.maps.Map($("div.map-canvas", within).get(0),{
      center: center,
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      draggable: false,
      disableDefaultUI: true,
      disableDoubleClickZoom: true,
      scrollwheel: false
    }));
  }

  // Static mapping with supplied polygons in hidden fields
  $("div.static-map").each(function(idx) {
    // setMapWidth($("div.map-canvas", this)[0]);
    
    var raw = $("input.polygon", this).val();

    if (raw != "") {
        var bounds = new google.maps.LatLngBounds();
        var polygons = $.map(raw.split(";"), function(linestr, idx) {
        var latlngs = $.map(linestr.split(","), function(pair, idx) {
            var tmp = pair.split(" ");
            var ll = new google.maps.LatLng(tmp[1], tmp[0]);
            bounds.extend(ll);
            return(ll);
        });
        return(new google.maps.Polygon({paths: latlngs, 
                                        fillColor: polycolor,
                                        fillOpacity: fillopacity,
                                        strokeColor: polycolor,
                                        strokeWeight: strokeweight}));

    }); //.get(); // turn into a regular array for convenience

        var map = staticMap(this, bounds.getCenter());

        map.fitBounds(bounds);
        $.each(polygons, function(idx, p) {
            p.setMap(map);
        });
    }
  });

} // end initialize function

google.maps.event.addDomListener(window, 'load', bes_drawing_initialize);

