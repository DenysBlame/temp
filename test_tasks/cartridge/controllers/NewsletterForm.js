'use strict';

/**
* Сontroller contains the logic for subscribing on email newsletters
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
            var CustomObjectMgr = require('dw/object/CustomObjectMgr');
            var email = currentForm.getValue('email');
            var result;

            try {
                result = dw.system.Transaction.wrap(function () {
                    if (CustomObjectMgr.getCustomObject('NewsletterSubscription', email)) {
                        return false;
                    }
                	currentForm.copyTo(
                        require('dw/object/CustomObjectMgr').createCustomObject('NewsletterSubscription', email)
                    );
                    return true;
                    //return require('~/cartridge/scripts/customobjects/NewsletterSubscription').createObjectByForm(currentForm);
                });
            } catch (error) {
                require('dw/system/Logger').getLogger('test').debug('Error occurred in sing up form with email {0}', email);
                return app.getView().render('newsletter/newslettererror');
            }

            if (result) {
                app.getView({
                    CurrentForms: session.forms
                }).render('newsletter/newslettersuccess');
                currentForm.clearFormElement(); 
            } else {
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