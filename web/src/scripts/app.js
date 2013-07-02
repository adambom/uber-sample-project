(function (App, Backbone, _, $) {

    App.autocomplete = function ($addr, $lat, $lng) {
        return function () {
            var that = this;

            this.gc = this.gc || new google.maps.Geocoder();

            $addr.autocomplete({
                source: function (query, process) {
                    that.gc.geocode({ address: query.term }, function (results, status) {
                        process(_.map(results, function (result) {
                            return {
                                label: result.formatted_address,
                                lat: result.geometry.location.jb,
                                lon: result.geometry.location.kb
                            };
                        }));
                    });
                },

                focus: function (e, ui) {
                    $(this).val(ui.item.label);
                    return false;
                },

                select: function (e, ui) {
                    $lat.val(ui.item.lat);
                    $lng.val(ui.item.lon);
                    return false;
                }
            });
        };
    };

    $(function () {
        App.collections.locations = new App.collections.Locations(App.bootstrap, { parse: true });

        App.routers.main = new App.routers.Main();

        Backbone.history.start();
    });
})(window.UBER, window.Backbone, window._, window.$);