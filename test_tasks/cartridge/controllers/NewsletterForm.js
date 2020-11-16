'use strict';

/**
* Description of the Controller and the logic it provides
*
* @module  controllers/NewsletterForm
*/

var app = require('*/cartridge/scripts/app');
var guard = require('storefront_controllers/cartridge/scripts/guard');
var URLUtils = require('dw/web/URLUtils');

exports.Start = guard.ensure(['get'], function () {
    app.getView({
        ContinueURL: URLUtils.https('NewsletterForm-HandleForm'),
        CurrentForms: session.forms
    }).render('newsletter/newslettersignup');
});

exports.HandleForm = guard.ensure(['post'], function () {
    var currentForm = app.getForm('newsletter');

    currentForm.handleAction({
        subscribe: function () {
            var resultTemplate = 'newslettersuccess';
            try {
                dw.system.Transaction.wrap(function () {
                    require('~/cartridge/scripts/customobjects/NewsletterSubscription').createObject(currentForm);
                });
            } catch (error) {
                resultTemplate = 'newslettererror';
            }

            app.getView({
                CurrentForms: session.forms
            }).render('newsletter/' + resultTemplate);

            currentForm.clearFormElement(); 
        },
        error: function () {
            response.redirect(URLUtils.https('NewsletterForm-Start'));
        }
    });
});