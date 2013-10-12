(function (global) {
    var map,
        geocoder,
        LocationViewModel,
        app = global.app = global.app || {};
        
    
    LocationViewModel = kendo.data.ObservableObject.extend({
        _lastMarker: null,
        _isLoading: false,
        address: "",

        onNavigateHome: function () {
            var that = this,
                position;
            
            that._isLoading = true;
            that.showLoading();
            
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    
                    position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    //map.panTo(position);
                    //that._putMarker(position);   
                    
                    
                    that._isLoading = false;
                    that.hideLoading();
                    
                    that.onPositionChange();
                    that.drawPath();
                    
                    that._isLoading = false;
                    that.hideLoading();
                },
                function (error) {
                    //default map coordinates                    
                    position = new google.maps.LatLng(43.459336, -80.462494);
                    map.panTo(position);

                    that._isLoading = false;
                    that.hideLoading();

                    navigator.notification.alert("Unable to determine current location. Cannot connect to GPS satellite.",
                        function () { }, "Location failed", 'OK');
                },
                {
                    timeout: 30000,
                    enableHighAccuracy: true
                }
            );
        },
        onPositionChange: function(){
              var watchID = null;

            // Cordova is ready
            //
            // Throw an error if no update is received every 30 seconds
            var options = { timeout: 30000 };
            watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
            

            // onSuccess Geolocation
            //
            function onSuccess(position) {
                
                // On successful position change push the data in the FileModel.geoPoints array
                var geoData = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        speed: position.coords.speed,
                        timestamp: position.coords.timestamp
                    };
                
                var len = window.fileModel.geoPoints.length;
                if (len !== null && len !== 0){
                    
                    if (window.fileModel.geoPoints[len - 1].latitude !== geoData.latitude || 
                        window.fileModel.geoPoints[len - 1].longitude !== geoData.longitude) {
                            
                        window.fileModel.geoPoints.push(geoData);
                        console.log("GeoData: ", window.fileModel.geoPoints);
                        console.log("WatchID: ", watchID);
                    }
                }
                else {
                    window.fileModel.geoPoints.push(geoData);
                        console.log("GeoData1: ", window.fileModel.geoPoints);
                }
            }

            // onError Callback receives a PositionError object
            //
            function onError(error) {
                console.log("Error: ", error.code, "Message: ", error.Message);
                alert('code: '    + error.code    + '\n' +
                      'message: ' + error.message + '\n');
            }  
        },
        drawPath: function(){
            var that = this;
            
            $.getJSON('data/pathToKaufland.json', function(data) {        
                
              var items = [];
                
              $.each(data, function(key, val) {
                items.push( new google.maps.LatLng(val.latitude, val.longitude) );
              });
                
                var len = data.length;
                
                var positionOfStartMarker = new google.maps.LatLng(data[0].latitude, data[0].longitude);
                var positionOfEndMarker = new google.maps.LatLng(data[len - 1].latitude, data[len - 1].longitude);
                
                
                map.panTo(positionOfStartMarker);
                that._putMarker(positionOfStartMarker);
                that._putMarker(positionOfEndMarker);
                
                var flightPath = new google.maps.Polyline({
                    path: items,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.5,
                    strokeWeight: 2
                  });

                  flightPath.setMap(map);
            });
        },
        
        onSearchAddress: function () {
            var that = this;

            geocoder.geocode(
                {
                    'address': that.get("address")
                },
                function (results, status) {
                    if (status !== google.maps.GeocoderStatus.OK) {
                        navigator.notification.alert("Unable to find address.",
                            function () { }, "Search failed", 'OK');

                        return;
                    }

                    map.panTo(results[0].geometry.location);
                    that._putMarker(results[0].geometry.location);
                });
        },

        showLoading: function () {
            if (this._isLoading) {
                app.application.showLoading();
            }
        },

        hideLoading: function () {
            app.application.hideLoading();
        },

        _putMarker: function (position) {
            var that = this;

            /*if (that._lastMarker !== null && that._lastMarker !== undefined) {
                that._lastMarker.setMap(null);
            }*/

            that._lastMarker = new google.maps.Marker({
                map: map,
                position: position
            });
        }
    });

    app.locationService = {
        initLocation: function () {
            var mapOptions = {
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    zoomControl: true,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.LEFT_BOTTOM
                    },
    
                    mapTypeControl: false,
                    streetViewControl: false
                };

            map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);            
            geocoder = new google.maps.Geocoder();
            app.locationService.viewModel.onNavigateHome.apply(app.locationService.viewModel, []);
        },

        show: function () {
            //show loading mask in case the location is not loaded yet 
            //and the user returns to the same tab
            app.locationService.viewModel.showLoading();
            
            //resize the map in case the orientation has been changed while showing other tab
            google.maps.event.trigger(map, "resize");
        },

        hide: function () {
            //hide loading mask if user changed the tab as it is only relevant to location tab
            app.locationService.viewModel.hideLoading();
        },

        viewModel: new LocationViewModel()
    };
}
)(window);