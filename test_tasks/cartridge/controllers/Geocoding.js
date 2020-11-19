'use strict';

/**
* Controller that update cities position (using services)
*
* @module  controllers/Geocoding
*/

var app = require('*/cartridge/scripts/app');
var guard = require('storefront_controllers/cartridge/scripts/guard');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');

function Start() {
    var GeocodingService = getService();
    var citiesCount = 0;
    var updatedCities = [];

    var cityIterator = CustomObjectMgr.getAllCustomObjects('city');
    
    while (cityIterator.hasNext()) {
        citiesCount++;
        var city = cityIterator.next().custom;

        var result = GeocodingService.call(city.name);
        if (result.status == 'OK' && result.object) {
            var position = result.object.position;
            
            try {
                dw.system.Transaction.wrap(function () {
                    city.latitude = position.lat;
                    city.longitude = position.lon;
                });
                updatedCities.push({
                    name: city.name,
                    latitude: position.lat,
                    longitude: position.lon
                });
            } catch (error) {}
        }
    }
    cityIterator.close();

    app.getView({
        cities: { 
            updated: JSON.stringify(updatedCities, null, '\t'), 
            count: { 
                all: citiesCount, 
                updated: updatedCities.length 
            }
        }
    }).render('services/geocoding');
}


function getService() {
    var baseURL;
    return dw.svc.LocalServiceRegistry.createService('test_tasks.http.geocode.get', {
        createRequest: function(svc, query) {
            if (!baseURL) {
                baseURL = svc.getURL();
                svc.setRequestMethod('GET');
                svc.addParam('key', 'rad9CE0LF6j9WYnJBlSLvIqyPT2KowyM');
                svc.addParam('typeahead', true);
            }
            svc.setURL(baseURL + encodeURI(query) + '.json');
        },
        parseResponse : function(svc, response) {
            response = JSON.parse(response.text);
            if (response.results.length) {
                return response.results[0];
            }
            return false;
        }
    });
}


/* Web exposed methods */
exports.Start = guard.ensure(['get', 'https'], Start);