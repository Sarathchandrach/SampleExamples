/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("cus.crm.mytasks.Main", {
	onInit : function() {
		jQuery.sap.require("sap.ca.scfld.md.Startup");
		jQuery.sap.require("sap.ca.ui.message.message");
		jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
		jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");
		jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
		jQuery.sap.require("sap.m.MessageBox");
		jQuery.sap.require("sap.ca.ui.FileUpload");
		jQuery.sap.require("cus.crm.mytasks.util.AppConfig");
		jQuery.sap.require("cus.crm.mytasks.util.AccountF4");
		jQuery.sap.require("cus.crm.mytasks.util.ContactF4");
		jQuery.sap.require("cus.crm.mytasks.util.EmployeeF4");
		jQuery.sap.require("cus.crm.mytasks.util.Formatter");
		jQuery.sap.require("cus.crm.mytasks.util.PriorityListUtil");
		jQuery.sap.require("cus.crm.mytasks.util.TechnicalInfoUtil");
		jQuery.sap.require("cus.crm.mytasks.util.Util");
		// WAVE 4 ENHANCEMENT
		jQuery.sap.require("cus.crm.mytasks.util.Schema");
		// WAVE 6 ENHANCEMENT
		jQuery.sap.require("cus.crm.mytasks.util.StatusListUtil");
		// WAVE 7 ENHANCEMENT
		jQuery.sap.require("cus.crm.mytasks.util.Attachments");
		jQuery.sap.require("cus.crm.mytasks.util.DocumentHistory");

		var effectiveUrl = jQuery.sap.getModulePath("cus.crm.mytasks")
				+ "/css/cus.crm.mytasks.css";
		jQuery.sap.includeStyleSheet(effectiveUrl, "mytasks_css");
		sap.ca.scfld.md.Startup.init('cus.crm.mytasks', this);
	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources
	 * and finalize activities.
	 * 
	 * @memberOf MainXML
	 */

	onExit : function() {
		// exit cleanup code here
		cus.crm.mytasks.util.Util.getCustomizingModel().setData({}, false);
	}
});