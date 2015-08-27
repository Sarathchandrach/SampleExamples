/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mgr.approve.leaverequests.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ca.scfld.md.ConfigurationBase.extend("hcm.mgr.approve.leaverequests.Configuration", {

    oServiceParams: {
        serviceList: [{
            name: "LEAVEAPPROVAL",
            masterCollection: "LeaveRequestCollection",
            serviceUrl: "/sap/opu/odata/GBHCM/LEAVEAPPROVAL;mo/",
            isDefault: true,
            mockedDataSource: "/hcm.mgr.approve.leaverequests/model/metadata.xml"
        }]
    },

    getServiceParams: function() {
        return this.oServiceParams;
    },

    /**
     * @inherit
     */
    getServiceList: function() {
        return this.oServiceParams.serviceList;
    },


    getMasterKeyAttributes: function() {
        return ["RequestId"];
    },

    setApplicationFacade: function(oApplicationFacade) {
        hcm.mgr.approve.leaverequests.Configuration.oApplicationFacade = oApplicationFacade;
    }
});