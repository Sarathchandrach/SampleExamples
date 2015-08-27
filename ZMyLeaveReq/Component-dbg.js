/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.myleaverequests.Component");
jQuery.sap.require("hcm.emp.myleaverequests.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

sap.ca.scfld.md.ComponentBase.extend("hcm.emp.myleaverequests.Component", {

	metadata : sap.ca.scfld.md.ComponentBase.createMetaData("MD", {
		"name" : "My Leave Requests",
		"version" : "1.4.5",
		"library" : "hcm.emp.myleaverequests",
		"includes" : [],
			"dependencies" : {
			"libs" : ["sap.m", "sap.me"],
		"components" : []
		},
		"config" : {
            "titleResource": "app.Identity",
            "resourceBundle": "i18n/i18n.properties",
            "icon": "sap-icon://Fiori2/F0394",
            "favIcon": "./resources/sap/ca/ui/themes/base/img/favicon/My_Leave_Requests.ico",
            "homeScreenIconPhone": "./resources/sap/ca/ui/themes/base/img/launchicon/My_Leave_Requests/57_iPhone_Desktop_Launch.png",
            "homeScreenIconPhone@2": "./resources/sap/ca/ui/themes/base/img/launchicon/My_Leave_Requests/114_iPhone-Retina_Web_Clip.png",
            "homeScreenIconTablet": "./resources/sap/ca/ui/themes/base/img/launchicon/My_Leave_Requests/72_iPad_Desktop_Launch.png",
            "homeScreenIconTablet@2": "./resources/sap/ca/ui/themes/base/img/launchicon/My_Leave_Requests/144_iPad_Retina_Web_Clip.png"
		},
		
		viewPath : "hcm.emp.myleaverequests.view",
	
		masterPageRoutes : {
			"master" : {
				"pattern" : "history",
				"view" : "S3"				
			}
		},
		
		detailPageRoutes :{
			// fill the routes to your detail pages in here. The application will navigate from the master
			// page to route
			// "detail" leading to detail screen S3.
			// If this is not desired please define your own route "detail"
			"detail" : {
					"pattern" : "detail/{contextPath}",
					"view" : "S6B"
			}
		},
		
		fullScreenPageRoutes : {
			// fill the routes to your full screen pages in here.
				"home" : {
					"pattern" : "",
					"view" : "S1"
				},
				"change" : {
					"pattern" : "change/{requestID}",
					"view" : "S1"
				},
				"entitlements" : {
					"pattern" : "entitlements",
					"view" : "S2"
				}
			}
		}),


	/**
	 * Initialize the application
	 *
	 * @returns {sap.ui.core.Control} the content
	 */
	createContent : function() {

		var oViewData = {
			component : this
		};
		return sap.ui.view({
			viewName : "hcm.emp.myleaverequests.Main",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : oViewData
		});
	}

});