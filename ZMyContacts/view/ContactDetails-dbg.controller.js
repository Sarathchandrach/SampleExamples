/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/*global jQuery: false, sap: false, cus: false, console: false, window : false */
/*jslint plusplus: true */
(function () {
	'use strict';
    jQuery.sap.require("sap.ca.ui.model.type.Date");
	sap.ui.controller("cus.crm.mycontacts.view.ContactDetails", {

		/*
		 * make call
		 */
		makeCall: function(oEvent) {
			if(jQuery.device.is.ipad)
				sap.m.URLHelper.redirect("facetime://"+oEvent.getSource().getText().replace(/[()\s]/g, ''), false);
			else
				sap.m.URLHelper.triggerTel(oEvent.getSource().getText());
		},

		/*
		 * send email
		 */
		sendEmail:function (oEvent) {
			sap.m.URLHelper.triggerEmail(oEvent.getSource().getText());
		},

		formatLabelVisible:function (src) {
			return (src !== undefined && null !== src && src.length !== 0);
		},
		
		onMapIconPressed: function (oEvent) {
			sap.m.URLHelper.redirect("http"+"://"+"maps.apple.com/?q="+this.getView().getBindingContext().getProperty("WorkAddress/address").split("\n").join(" "), !jQuery.device.is.phone);
		},

	});
}());