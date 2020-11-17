'use strict';

/**
* Description of the Controller and the logic it provides
*
* @module  controllers/NewsletterForm
*/

var app = require('*/cartridge/scripts/app');
var guard = require('storefront_controllers/cartridge/scripts/guard');
var URLUtils = require('dw/web/URLUtils');

function Start() {
    app.getView({
        ContinueURL: URLUtils.https('NewsletterForm-HandleForm'),
        CurrentForms: session.forms
    }).render('newsletter/newslettersignup');
}

function HandleForm() {
    var currentForm = app.getForm('newsletter');

    currentForm.handleAction({
        subscribe: function () {
            try {
                dw.system.Transaction.wrap(function () {
                    require('~/cartridge/scripts/customobjects/NewsletterSubscription').createObjectByForm(currentForm);
                });
                app.getView({
                    CurrentForms: session.forms
                }).render('newsletter/newslettersuccess');
    
                currentForm.clearFormElement(); 
            } catch (error) {
            	currentForm.get('email').invalidateFormElement();
                response.redirect(URLUtils.https('NewsletterForm-Start'));
            }
        },
        error: function () {
            response.redirect(URLUtils.https('NewsletterForm-Start'));
        }
    });
}


/* Web exposed methods */
exports.Start = guard.ensure(['get'], Start);
exports.HandleForm = guard.ensure(['post'], HandleForm);