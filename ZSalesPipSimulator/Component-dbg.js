/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// define a root UIComponent which exposes the main view
jQuery.sap.declare("cus.crm.salespipeline.sim.Component");
jQuery.sap.require("cus.crm.salespipeline.sim.Configuration");
jQuery.sap.require("sap.ca.ui.utils.Lessifier");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

//new Component
sap.ca.scfld.md.ComponentBase.extend("cus.crm.salespipeline.sim.Component", {
	metadata : sap.ca.scfld.md.ComponentBase.createMetaData("FS", {
		"name" : "Fullscreen Sample",
		"version" : "1.2.18",
		"library" : "cus.crm.salespipeline.sim",
		"includes" : [],
		"dependencies" : {
			"libs" : [ "sap.m", "sap.me" ],
			"components" : []
		},
		"config" : {
			"resourceBundle" : "i18n/i18n.properties",
			"titleResource" : "FULLSCREEN_TITLE",
			"icon" : "sap-icon://Fiori2/F0013",
			"favIcon" : "./resources/sap/ca/ui/themes/base/img/favicon/F0013_Simulate_Sales_Pipeline.ico",
			"homeScreenIconPhone" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0013_Simulate_Sales_Pipeline/57_iPhone_Desktop_Launch.png",
			"homeScreenIconPhone@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0013_Simulate_Sales_Pipeline/114_iPhone-Retina_Web_Clip.png",
			"homeScreenIconTablet" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0013_Simulate_Sales_Pipeline/72_iPad_Desktop_Launch.png",
			"homeScreenIconTablet@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0013_Simulate_Sales_Pipeline/144_iPad_Retina_Web_Clip.png",
			"startupImage320x460" : "./resources/sap/ca/ui/themes/base/img/splashscreen/startup-image-320x460.png",
			"startupImage640x920" : "./resources/sap/ca/ui/themes/base/img/splashscreen/startup-image-640x920.png",
			"startupImage640x1096" : "./resources/sap/ca/ui/themes/base/img/splashscreen/startup-image-640x1096.png",
			"startupImage768x1004" : "./resources/sap/ca/ui/themes/base/img/splashscreen/startup-image-768x1004.png",
			"startupImage748x1024" : "./resources/sap/ca/ui/themes/base/img/splashscreen/startup-image-748x1024.png",
			"startupImage1536x2008" : "./resources/sap/ca/ui/themes/base/img/splashscreen/startup-image-1536x2008.png",
			"startupImage1496x2048" : "./resources/sap/ca/ui/themes/base/img/splashscreen/startup-image-1496x2048.png",
		},
		"viewPath" : "cus.crm.salespipeline.sim.view",
		"fullScreenPageRoutes" : {
			// fill the routes to your full screen pages in here.
			"fullscreen" : {
				"pattern" : "",
				"view" : "S1"
			}
		},
	}),
	
	createContent : function() {
		if (sap.ca.ui.utils.Lessifier)
			if(sap.ui.getCore().getConfiguration().getRTL())
				sap.ca.ui.utils.Lessifier.lessifyCSS("cus.crm.salespipeline.sim",
				"/controls/BubbleRTL.css");
			else
				sap.ca.ui.utils.Lessifier.lessifyCSS("cus.crm.salespipeline.sim",
				"/controls/Bubble.css");
		
		var oViewData = {
			component : this
		};
		return sap.ui.view({
			viewName : "cus.crm.salespipeline.sim.Main",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : oViewData
		});
	}
});