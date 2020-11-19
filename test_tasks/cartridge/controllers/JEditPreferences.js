'use strict';
/**
* Description of the Controller and the logic it provides
*
* @module  controllers/JEditPreferences
*/

var app = require('*/cartridge/scripts/app');
var guard = require('storefront_controllers/cartridge/scripts/guard');
var URLUtils = require('dw/web/URLUtils');

var preferencesForm = app.getForm('preferences');

function Start() {
    preferencesForm.clearFormElement();
    preferencesForm.copyFrom(customer.profile);
    app.getView({
        ContinueURL: URLUtils.https('JEditPreferences-HandleForm'),
        CurrentForms: session.forms
    }).render('account/user/editpreferences');
}

function HandleForm() {
    preferencesForm.handleAction({
        apply: function () {

            dw.system.Transaction.wrap(function () {
                preferencesForm.accept();
            });

            response.redirect(URLUtils.https('Account-Show'));
        }
    });
}

/* Web exposed methods */
exports.Start = guard.ensure(['get', 'https', 'loggedIn'], Start);
exports.HandleForm = guard.ensure(['post'], HandleForm);