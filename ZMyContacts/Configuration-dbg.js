/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/*global jQuery: false, sap: false, cus: false, console: false */
(function () {
	'use strict';

	jQuery.sap.declare("cus.crm.mycontacts.Configuration");
	jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
	jQuery.sap.require("cus.crm.mycontacts.util.Util");

	sap.ca.scfld.md.ConfigurationBase.extend("cus.crm.mycontacts.Configuration", {
		oServiceParams:{
			serviceList:[
				{
					name:"CRM_BUPA_ODATA",
					serviceUrl : "/sap/opu/odata/sap/CRM_BUPA_ODATA/",
					isDefault:true,
					useBatch:true,
					countSupported:true,
					mockedDataSource:jQuery.sap.getModulePath("cus.crm.mycontacts")+"/model/metadata.xml"
				},
				{
					name:"CRM_BUPA_ODATA_CREATE",
					serviceUrl : "/sap/opu/odata/sap/CRM_BUPA_ODATA/",
					countSupported:false,
					//useBatch:true,
					mockedDataSource:jQuery.sap.getModulePath("cus.crm.mycontacts")+"/model/metadata.xml"
				}
			]
		},

		/**
		 * @inherit
		 */
		getServiceList:function () {
			return this.oServiceParams.serviceList;
		},
		
		setApplicationFacade : function(oApplicationFacade) {
			sap.ca.scfld.md.ConfigurationBase.prototype.setApplicationFacade.call(this, oApplicationFacade);
			cus.crm.mycontacts.util.Util.setApplicationFacade(oApplicationFacade);
		}
	});
}());
