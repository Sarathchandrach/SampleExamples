/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/*global jQuery: false, sap: false, cus: false, console: false, window : false */
/*jslint plusplus: true */
(function () {
	'use strict';
	sap.ui.controller("cus.crm.mycontacts.view.AccountBusinessCard", {

		onTapPhone:function (oEvent) {
			sap.m.URLHelper.triggerTel(oEvent.getSource().getText());
		},
	
		onMapIconPressed: function (oEvent) {
			sap.m.URLHelper.redirect("http"+"://"+"maps.apple.com/?q="+this.getView().getModel().getProperty("/address").split("\n").join(" "), !jQuery.device.is.phone);
		},
	});
}());