/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("cus.crm.salespipeline.sim.Main", {
	onInit : function() {
		jQuery.sap.require("cus.crm.salespipeline.sim.util.formatter");
		jQuery.sap.require("sap.ca.scfld.md.Startup");
		sap.ca.scfld.md.Startup.init('cus.crm.salespipeline.sim', this);
	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources
	 * and finalize activities.
	 * 
	 * @memberOf MainXML
	 */
	onExit : function() {
		// exit cleanup code here
		if (document.getElementById("Infopopup")){
			var oInfo = document.getElementById("Infopopup");
			if(sap.ui.Device.browser.name == sap.ui.Device.browser.BROWSER.INTERNET_EXPLORER)
				oInfo.parentNode.removeChild(oInfo);
			else
				oInfo.remove();
		}
		if (sap.ui.getCore().byId("Infopopup"))
			sap.ui.getCore().byId("Infopopup").destroy();
		if (document.getElementById("acButAppS")){
			var oButton = document.getElementById("acButAppS");
			if(sap.ui.Device.browser.name == sap.ui.Device.browser.BROWSER.INTERNET_EXPLORER)
				oButton.parentNode.removeChild(oButton);
			else
				oButton.remove();
		}
		if (sap.ui.getCore().byId("acButAppS"))
			sap.ui.getCore().byId("acButAppS").destroy();
	}
});