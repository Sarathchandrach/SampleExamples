/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// define a root UIComponent which exposes the main view
jQuery.sap.declare("cus.crm.ppm.mgr.Component");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");
jQuery.sap.require("cus.crm.ppm.mgr.Configuration");
jQuery.sap.require("sap.ca.ui.utils.Lessifier");

// new Component
sap.ca.scfld.md.ComponentBase.extend("cus.crm.ppm.mgr.Component", {
	metadata : sap.ca.scfld.md.ComponentBase.createMetaData("FS", {

		"name" : "Fullscreen Sample",
		"version" : "1.2.16",
		"library" : "cus.crm.ppm.mgr",
		"includes" : [],
		"dependencies" : {
			"libs" : [ "sap.m", "sap.me" ],
			"components" : []
		},
		config : {
			resourceBundle : "i18n/i18n.properties",
			titleResource : "FULLSCREEN_TITLE",
			icon : "sap-icon://Fiori2/F0016",
			favIcon : "./sap/ca/ui/themes/base/img/favicon/F0016_Track_Sales_Pipeline.ico",
			"homeScreenIconPhone" : "./sap/ca/ui/themes/base/img/launchicon/F0016_Track_Sales_Pipeline/57_iPhone_Desktop_Launch.png",
			"homeScreenIconPhone@2" : "./sap/ca/ui/themes/base/img/launchicon/F0016_Track_Sales_Pipeline/114_iPhone-Retina_Web_Clip.png",
			"homeScreenIconTablet" : "./sap/ca/ui/themes/base/img/launchicon/F0016_Track_Sales_Pipeline/72_iPad_Desktop_Launch.png",
			"homeScreenIconTablet@2" : "./sap/ca/ui/themes/base/img/launchicon/F0016_Track_Sales_Pipeline/144_iPad_Retina_Web_Clip.png",
			"startupImage320x460" : "./sap/ca/ui/themes/base/img/splashscreen/startup-image-320x460.png",
			"startupImage640x920" : "./sap/ca/ui/themes/base/img/splashscreen/startup-image-640x920.png",
			"startupImage640x1096" : "./sap/ca/ui/themes/base/img/splashscreen/startup-image-640x1096.png",
			"startupImage768x1004" : "./sap/ca/ui/themes/base/img/splashscreen/startup-image-768x1004.png",
			"startupImage748x1024" : "./sap/ca/ui/themes/base/img/splashscreen/startup-image-748x1024.png",
			"startupImage1536x2008" : "./sap/ca/ui/themes/base/img/splashscreen/startup-image-1536x2008.png",
			"startupImage1496x2048" : "./sap/ca/ui/themes/base/img/splashscreen/startup-image-1496x2048.png",
		},

		viewPath : "cus.crm.ppm.mgr.view",
		fullScreenPageRoutes : {
			// fill the routes to your full screen pages in here.
			"fullscreen" : {
				"pattern" : "",
				"view" : "S1"
			}
//
//			"subscreen" : {
//				"pattern" : "Targetbyteam",
//				"view" : "Targetbyteam"
//			}
		},

	}),
	createContent : function() {
		if (sap.ca.ui.utils.Lessifier)
			if(sap.ui.getCore().getConfiguration().getRTL())
				sap.ca.ui.utils.Lessifier.lessifyCSS("cus.crm.ppm.mgr",
				"/controls/BubbleRTL.css");
			else
				sap.ca.ui.utils.Lessifier.lessifyCSS("cus.crm.ppm.mgr",
					"/controls/Bubble.css");
		var oViewData = {
			component : this
		};
		return sap.ui.view({
			viewName : "cus.crm.ppm.mgr.Main",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : oViewData
		});
	},
});