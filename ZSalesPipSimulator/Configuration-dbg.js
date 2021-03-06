/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.salespipeline.sim.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ui.getCore().loadLibrary("sap.viz");
// jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("cus.crm.salespipeline.sim.controls.Bubble",".css"),"sap-ui-theme-sap.crm.sps");
jQuery.sap.require("cus.crm.salespipeline.sim.controls.Bubble");
jQuery.sap.require("cus.crm.salespipeline.sim.controls.BubbleChart");
jQuery.sap.require("cus.crm.salespipeline.sim.controls.BubbleChartRenderer");
jQuery.sap.require("cus.crm.salespipeline.sim.controls.MDualSlider");
jQuery.sap.require("cus.crm.salespipeline.sim.controls.MDualSliderLabel");
jQuery.sap.require("cus.crm.salespipeline.sim.controls.MDualSliderRenderer");
jQuery.sap.require("cus.crm.salespipeline.sim.controls.DateInput");
jQuery.sap.require("cus.crm.salespipeline.sim.controls.DateInputRenderer");

sap.ca.scfld.md.ConfigurationBase
		.extend(
				"cus.crm.salespipeline.sim.Configuration",
				{
					oServiceParams : {
						serviceList : [ {
							name : "CRM_SALESPIPELINE_SALESREP",
							masterCollection : "Opportunities",
							serviceUrl : "/sap/opu/odata/sap/CRM_SALESPIPELINE_SALESREP/",
							isDefault : true,
							mockedDataSource : "/cus.crm.salespipeline.sim/model/metadata.xml"
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