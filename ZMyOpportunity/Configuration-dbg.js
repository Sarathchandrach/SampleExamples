/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.opportunity.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");


sap.ca.scfld.md.ConfigurationBase
		.extend(
				"cus.crm.opportunity.Configuration",
				{

					oServiceParams : {
						serviceList : [{
							name : "CRM_OPPORTUNITY",
							masterCollection : "Opportunities",
							serviceUrl : URI("/sap/opu/odata/sap/CRM_OPPORTUNITY/").directory(),
							isDefault : true,
							countSupported : true,
							mockedDataSource : "model/metadata.xml"
						}]
					},

					getServiceParams : function() {
						return this.oServiceParams;
					},

					/**
					 * @inherit
					 */
					getServiceList : function() {
						return this.getServiceParams().serviceList;
					},

					getMasterKeyAttributes : function() {
						return ["Id"];
					},
					
					
			});
