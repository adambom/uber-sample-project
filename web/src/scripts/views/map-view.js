(function (App, Backbone, _, $) {

    var __super__ = Backbone.View.prototype;

    App.views.Map = Backbone.View.extend({

        infoWindowTemplate: App.tmpl.infoWindow,

        initialize: function () {
            this.listenTo(this.collection, 'destroy', this.render, this);
            this.listenTo(this.collection, 'sync', this.render, this);
        },

        render: _.debounce(function () {
            var that = this;

            if (!this.collection.length) {
                if (navigator.geolocation){
                    navigator.geolocation.getCurrentPosition(function (pos) {
                        that.drawMap({
                            lat: pos.coords.latitude,
                            lng: pos.coords.longitude
                        });
                    });
                }
            }

            this.drawMap();
        }, 300),

        drawMap: function (mid) {
            mid = mid || this.collection.midpoint() || { lat: 0, lng: 0 };

            this.map = new google.maps.Map(this.el, {
                zoom: 13,
                center: new google.maps.LatLng(mid.lat, mid.lng),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            this.drawMarkers();
        },

        drawMarkers: function () {
            var that = this;
            this.infoWindows = {};

            this.collection.each(function (location) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(location.get('lat'), location.get('lng')),
                    map: this.map,
                    animation: google.maps.Animation.DROP,
                    title: location.get('nickname')
                });

                this.infoWindows[location.get('id')] = new google.maps.InfoWindow({
                    content: this.infoWindowTemplate(location.toJSON())
                });

                google.maps.event.addListener(marker, 'click', function () {
                    that.infoWindows[location.get('id')].open(that.map, marker);
                });
            }, this);
        }

    });

})(window.UBER, window.Backbone, window._, window.$);