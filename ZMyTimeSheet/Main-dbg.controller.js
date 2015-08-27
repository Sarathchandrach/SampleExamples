/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("hcm.emp.mytimesheet.Main", {

	onInit : function() {
        jQuery.sap.require("sap.ca.scfld.md.Startup");				
		sap.ca.scfld.md.Startup.init('hcm.emp.mytimesheet', this);
		
		var effectiveUrl = jQuery.sap.getModulePath("hcm.emp.mytimesheet") + "/" + "css/style.css";

		jQuery.sap.includeStyleSheet(effectiveUrl, "notes_css");


	},
	
	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * 
	 * @memberOf MainXML
	 */
	onExit : function() {
		//exit cleanup code here
	}
		
});