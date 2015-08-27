/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mytasks.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");
jQuery.sap.require("cus.crm.mytasks.util.AppConfig");
jQuery.sap.require("cus.crm.mytasks.util.Formatter");

sap.ca.scfld.md.ConfigurationBase.extend("cus.crm.mytasks.Configuration", {
	isInitialised : false,
	oServiceParams : {
		serviceList : [ {
			name : "CRM_TASK",
			masterCollection : "Tasks",
			serviceUrl : "/sap/opu/odata/sap/CRM_TASK/",
			isDefault : true,
			mockedDataSource : "/cus.crm.mytasks/model/metadata.xml"
		} ]
	},

	getServiceParams : function() {
		return this.oServiceParams;
	},
	
	/**
	 * @inherit
	 */

	getServiceList : function() {
		this.initMyTasksApp();
		return this.oServiceParams.serviceList;
	},

	getMasterKeyAttributes : function() {
		return [ "Id" ];
	},

	getExcludedQueryStringParameters : function() {
		return [ "sap-client", "sap-language" ];
	},

	injectResourceBundleToFormatter : function() {
		var oBundle = this.oApplicationFacade.getResourceBundle();
		cus.crm.mytasks.util.Formatter.oBundle = oBundle;
		cus.crm.mytasks.util.Util.logObjectToConsole(
				"Setting ResBundle to formatter: ", oBundle);
	},

	initMyTasksApp : function() {
		if (!this.isInitialised) {
			// cus.crm.mytasks.util.AppConfig.init();
			this.injectResourceBundleToFormatter();
			this.isInitialised = true;
		}
	}
});