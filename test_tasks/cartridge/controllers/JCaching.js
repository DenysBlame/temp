'use strict';
/**
* Controller for cache tasks
*
* @module  controllers/Cache
*/

var app = require('*/cartridge/scripts/app');
var guard = require('storefront_controllers/cartridge/scripts/guard');
/* var URLUtils = require('dw/web/URLUtils'); */

function Start() {
    app.getView().render('cachedpage');
}

/* Web exposed methods */
exports.Start = guard.ensure(['get'], Start);