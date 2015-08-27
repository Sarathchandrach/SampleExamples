/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("cus.crm.notes.Main", {

	onInit : function() {
		jQuery.sap.require("cus.crm.notes.util.Formatter");
		jQuery.sap.require("cus.crm.notes.util.DomHelper");		
		jQuery.sap.require("sap.ca.scfld.md.Startup");
		
		sap.ca.scfld.md.Startup.init('cus.crm.notes', this);
	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources
	 * and finalize activities.
	 * 
	 * @memberOf MainXML
	 */
	onExit : function() {
		// exit cleanup code here
	}
});