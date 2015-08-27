/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */

jQuery.sap.declare("hcm.emp.myleaverequests.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ca.scfld.md.ConfigurationBase.extend("hcm.emp.myleaverequests.Configuration", {

    oServiceParams: {
        serviceList: [
            {
                name: "LEAVEREQUEST",
                masterCollection: "LeaveRequestCollection",
                serviceUrl:  URI("/sap/opu/odata/GBHCM/LEAVEREQUEST;v=2/").directory(),
                isDefault: true,
                mockedDataSource: "/hcm.emp.myleaverequests/model/metadata.xml"
            }
        ]
    },

	getServiceParams: function () {
		return this.oServiceParams;
	},

	/**
	 * @inherit
	 */
	getServiceList: function () {
		return this.oServiceParams.serviceList;
	},

	getMasterKeyAttributes: function () {
		return ["Id"];
	}

});
