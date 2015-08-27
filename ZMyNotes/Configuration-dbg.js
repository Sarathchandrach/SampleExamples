/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.notes.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ca.scfld.md.ConfigurationBase.extend("cus.crm.notes.Configuration", {

    oServiceParams: {
        serviceList: [
            {
                name: "CRM_NOTES",
                masterCollection: "NoteHeaders",
                serviceUrl: URI("/sap/opu/odata/sap/CRM_NOTES/").directory(),
                countSupported: false,
 //               useBatch: true,
                isDefault: true,
                mockedDataSource: "model/metadata.xml"
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
        return ["NoteGuid"];
    }
});
