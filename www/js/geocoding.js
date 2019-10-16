
function bes_geocode_initialize() {
    var gc = new google.maps.Geocoder();
    $("div.geocode").each(function(idx) {
      var widget = this;

      $("input.postcode-lookup", widget).click(function() {
        var address = $("input.postcode", widget).val();

        if (address == "") {
          return(true);
        } else {
          gc.geocode({address: address, region: 'uk'}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              if ($.inArray("GB", $.map(results[0].address_components, function(i) { return(i.short_name); })) == -1) {
                alert("This location does not appear to be in Great Britain. Please check that you have entered your postcode or address correctly.");
                return(false);
              }
              
              var ll = results[0].geometry.location;
              $(".lat", widget).val(ll.lat());
              $(".lon", widget).val(ll.lng());
              
              $("form").submit();
            } else {
              alert("We could not find this location. Please try again.");
              return(false);
            }
          });
          return(false);
        }
      });
    });

}
google.maps.event.addDomListener(window, 'load', bes_geocode_initialize);
