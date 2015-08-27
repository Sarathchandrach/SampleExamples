/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.ppm.mgr.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ui.getCore().loadLibrary("sap.viz");
//jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("cus.crm.ppm.mgr.simulator.simulator", ".css"),"sap-ui-theme-sap.crm.ppm");

jQuery.sap.require("cus.crm.ppm.mgr.controls.Bubble");
jQuery.sap.require("cus.crm.ppm.mgr.controls.BubbleChart");
jQuery.sap.require("cus.crm.ppm.mgr.controls.BubbleChartRenderer");
jQuery.sap.require("cus.crm.ppm.mgr.controls.MDualSlider");
jQuery.sap.require("cus.crm.ppm.mgr.controls.MDualSliderLabel");
jQuery.sap.require("cus.crm.ppm.mgr.controls.MDualSliderRenderer");

sap.ca.scfld.md.ConfigurationBase.extend("cus.crm.ppm.mgr.Configuration", {

	oServiceParams : {
		serviceList : [ {
			name : "CRM_SALESPIPELINE_MANAGER",
			masterCollection : "Opportunities",
			serviceUrl : "/sap/opu/odata/sap/CRM_SALESPIPELINE_MANAGER/",
			isDefault : true,
			mockedDataSource : "/cus.crm.ppm.mgr/model/metadata.xml"
		} ]
	},

	getServiceParams : function() {
		return this.oServiceParams;
	},

	/**
	 * @inherit
	 */
	getServiceList : function() {
		return this.oServiceParams.serviceList;
	},

	getMasterKeyAttributes : function() {
		return [ "Id" ];
	},

	getExcludedQueryStringParameters : function() {
		return [ "sap-client", "sap-language" ];
	}
});