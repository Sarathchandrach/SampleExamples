/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("cus.crm.ppm.mgr.Main", {

	onInit : function() {
		jQuery.sap.require("cus.crm.ppm.mgr.util.formatter");
		jQuery.sap.require("sap.ca.scfld.md.Startup");
		sap.ca.scfld.md.Startup.init('cus.crm.ppm.mgr', this);
	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources
	 * and finalize activities.
	 * 
	 * @memberOf MainXML
	 */
	onExit : function() {
		// exit cleanup code here
		if (document.getElementById("acButAppS")) {
			var oButton = document.getElementById("acButAppS");
			if(sap.ui.Device.browser.name == sap.ui.Device.browser.BROWSER.INTERNET_EXPLORER)
				oButton.parentNode.removeChild(oButton);
			else
				oButton.remove();
		}
		if(document.getElementById("liBarChart")) {
			var oLI = document.getElementById("liBarChart");
			if(sap.ui.Device.browser.name == sap.ui.Device.browser.BROWSER.INTERNET_EXPLORER)
				oLI.parentNode.removeChild(oLI);
			else
				oLI.remove();
		}
		if (sap.ui.getCore().byId("acButAppS"))
			sap.ui.getCore().byId("acButAppS").destroy();
		if (sap.ui.getCore().byId("liBarChart"))
			sap.ui.getCore().byId("liBarChart").destroy();
	}
});