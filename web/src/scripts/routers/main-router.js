(function (App, Backbone, _, $) {

    var __super__ = Backbone.Router.prototype;

    App.routers.Main = Backbone.Router.extend({

        routes: {
            '': 'index'
        },

        index: function () {
            var listView = new App.views.LocationsList({
                collection: App.collections.locations,
                el: '#locations-list'
            });

            var searchView = new App.views.Search({
                model: App.collections.locations.query,
                el: '#search-locations'
            });

            var createView = new App.views.CreateLocation({
                collection: App.collections.locations,
                el: '#new-location'
            });

            var mapView = new App.views.Map({
                collection: App.collections.locations,
                el: '#map'
            });

            listView.render();
            searchView.render();
            createView.render();
            mapView.render();
        }

    });

})(window.UBER, window.Backbone, window._, window.$);