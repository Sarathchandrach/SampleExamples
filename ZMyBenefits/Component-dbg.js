/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// define a root UIComponent which exposes the main view
jQuery.sap.declare("hcm.emp.mybenefits.Component");
jQuery.sap.require("hcm.emp.mybenefits.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase"); // new Component

sap.ca.scfld.md.ComponentBase.extend("hcm.emp.mybenefits.Component", {
	metadata: sap.ca.scfld.md.ComponentBase.createMetaData("MD", {
		"name": "Master Detail Sample",
		"version": "1.4.3",
		"library": "hcm.emp.mybenefits",
		"includes": [],
		"dependencies": {
			"libs": ["sap.m", "sap.me"],
			"components": []
		},
		"config": {
			"resourceBundle": "i18n/i18n.properties",
			"titleResource": "MB_APP_TITLE",
			"icon": "sap-icon://family-care", //Fiori2/F0396
			"favIcon": "./resources/sap/ca/ui/themes/base/img/favicon/My_Benefits.ico",
			"homeScreenIconPhone": "./resources/sap/ca/ui/themes/base/img/launchicon/My_Benefits/57_iPhone_Desktop_Launch.png",
			"homeScreenIconPhone@2": "./resources/sap/ca/ui/themes/base/img/launchicon/My_Benefits/114_iPhone-Retina_Web_Clip.png",
			"homeScreenIconTablet": "./resources/sap/ca/ui/themes/base/img/launchicon/My_Benefits/72_iPad_Desktop_Launch.png",
			"homeScreenIconTablet@2": "./resources/sap/ca/ui/themes/base/img/launchicon/My_Benefits/144_iPad_Retina_Web_Clip.png"
		},

		// Navigation related properties
		masterPageRoutes: {
			"master": {
				"pattern": "",
				"view": "hcm.emp.mybenefits.view.S2"
			}
		},
		detailPageRoutes: {
			"Health": {
				"pattern": "Health/{contextPath}",
				"view": "hcm.emp.mybenefits.view.S3"
			},
			"Insurance": {
				"pattern": "Insurance/{contextPath}",
				"view": "hcm.emp.mybenefits.view.S4"
			},
			"Savings": {
				"pattern": "Savings/{contextPath}",
				"view": "hcm.emp.mybenefits.view.S5"
			},
			"FSA": {
				"pattern": "FSA/{contextPath}",
				"view": "hcm.emp.mybenefits.view.S6"
			},
			"Miscellaneous": {
				"pattern": "Miscellaneous/{contextPath}",
				"view": "hcm.emp.mybenefits.view.S7"
			},
			"Unenrolled": {
				"pattern": "Unenrolled/{contextPath}",
				"view": "hcm.emp.mybenefits.view.S8"
			}
		}
	}),

	/**
	 * Initialize the application
	 *
	 * @returns {sap.ui.core.Control} the content
	 */
	createContent: function() {

		var oViewData = {
			component: this
		};
		return sap.ui.view({
			viewName: "hcm.emp.mybenefits.Main",
			type: sap.ui.core.mvc.ViewType.XML,
			viewData: oViewData
		});
	}
});
