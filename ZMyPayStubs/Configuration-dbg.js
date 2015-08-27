/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.payslip.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ca.scfld.md.ConfigurationBase.extend("hcm.emp.payslip.Configuration", {

	oServiceParams: {
        serviceList: [
            {
                name: "SRA006_SRV",
                masterCollection: "Payslips",
                serviceUrl: "/sap/opu/odata/sap/SRA006_SRV/",
                isDefault: true,
                mockedDataSource: "/hcm.emp.payslip/model/metadata.xml"
            }
        ]
    },
    
//    oRouteConfig:{        
//        isMaster: function (sPageId) {
//	        // if there are more master views we could have a list of masters to check against
//            return "S2" === sPageId;
//        },
//        viewName: function (sPageId) {
//            return "hcm.emp.payslip" + ".view." + sPageId;
//        },
//        viewType: "XML",
//        transition: "slide",
//        routes : [{
//			pattern : "", // will be the url and from has to be provided in the data
//			viewId : "S2",
//			name : "master", // name used for listening or navigating to this route
//			isHome : true,
//            containerName: "split",
//            parentRoute: "md",
//		}, {
//			pattern : "detail/{from}/:context:", // will be the url and from has to be provided in the data
//			viewId : "S3",
//			name : "detail",// name used for listening or navigating to this route
//            containerName: "split",
//            parentRoute: "master",
//		}]
//    },
   

    getServiceParams: function () {
        return this.oServiceParams;
    },

    /**
     * @inherit
     */
    getServiceList: function () {
        return this.oServiceParams.serviceList;
    },


    getMasterKeyAttributes : function() {
        return ["Id"];
    }

});
