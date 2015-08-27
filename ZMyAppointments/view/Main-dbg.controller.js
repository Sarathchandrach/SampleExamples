/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("cus.crm.mycalendar.util.Util");
jQuery.sap.require("sap.ca.ui.message.message");

sap.ui.controller("cus.crm.mycalendar.view.Main", {
	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 */
	onInit : function() {
		jQuery.sap.require("sap.ca.scfld.md.Startup");
		sap.ca.scfld.md.Startup.init('cus.crm.mycalendar', this);
	}

});
