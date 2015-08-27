/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mycalendar.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");
//
sap.ca.scfld.md.ConfigurationBase.extend("cus.crm.mycalendar.Configuration", {

	oServiceParams : {
		serviceList : [ {
			name : "CRM_APPOINTMENT_SRV",
			//masterCollection : "AppointmentSet",
			serviceUrl : "/sap/opu/odata/sap/CRM_APPOINTMENT_SRV/",
			isDefault : true,
			mockedDataSource : "model/metadatamock.xml"
		} ]
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
	
	setApplicationFacade : function(oApplicationFacade) {
		sap.ca.scfld.md.ConfigurationBase.prototype.setApplicationFacade.call(this, oApplicationFacade);
		cus.crm.mycalendar.util.Util.setApplicationFacade(oApplicationFacade);
	}


});
