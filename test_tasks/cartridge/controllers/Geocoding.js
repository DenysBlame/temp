'use strict';

/**
* Controller that update cities position (using services)
*
* @module  controllers/Geocoding
*/

var app = require('*/cartridge/scripts/app');
var guard = require('storefront_controllers/cartridge/scripts/guard');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var Geocoding = require('~/cartridge/scripts/services/geocoding');

function Start() {
    var GeocodingService = Geocoding.getService();
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





/* Web exposed methods */
exports.Start = guard.ensure(['get', 'https'], Start);