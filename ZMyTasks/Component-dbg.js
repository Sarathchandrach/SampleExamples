/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// define a root UIComponent which exposes the main view
jQuery.sap.declare("cus.crm.mytasks.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

// new Component - CRM My Tasks
sap.ca.scfld.md.ComponentBase.extend("cus.crm.mytasks.Component", {
	metadata : sap.ca.scfld.md.ComponentBase.createMetaData("FS", {
		"name" : "CRM My Tasks",
		"version" : "1.5.4",
		"library" : "cus.crm.mytasks",
		"includes" : [],
		"dependencies" : {
			"libs" : [ "sap.m", "sap.me", "sap.ca.ui" ],
			"components" : []
		},
		"config" : {
			resourceBundle : "i18n/i18n.properties",
			titleResource : "MASTER_TITLE",
			icon : "sap-icon://Fiori2/F0003",
			favIcon : "./resources/sap/ca/ui/themes/base/img/favicon/F0003_Manage_Tasks.ico",
			"homeScreenIconPhone" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0003_Manage_Tasks/57_iPhone_Desktop_Launch.png",
			"homeScreenIconPhone@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0003_Manage_Tasks/114_iPhone-Retina_Web_Clip.png",
			"homeScreenIconTablet" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0003_Manage_Tasks/72_iPad_Desktop_Launch.png",
			"homeScreenIconTablet@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0003_Manage_Tasks/144_iPad_Retina_Web_Clip.png",
			"startupImage320x460" : "./resources/sap/ca/ui/themes/base/img/splashscreen/startup-image-320x460.png",
			"startupImage640x920" : "./resources/sap/ca/ui/themes/base/img/splashscreen/startup-image-640x920.png",
			"startupImage640x1096" : "./resources/sap/ca/ui/themes/base/img/splashscreen/startup-image-640x1096.png",
			"startupImage768x1004" : "./resources/sap/ca/ui/themes/base/img/splashscreen/startup-image-768x1004.png",
			"startupImage748x1024" : "./resources/sap/ca/ui/themes/base/img/splashscreen/startup-image-748x1024.png",
			"startupImage1536x2008" : "./resources/sap/ca/ui/themes/base/img/splashscreen/startup-image-1536x2008.png",
			"startupImage1496x2048" : "./resources/sap/ca/ui/themes/base/img/splashscreen/startup-image-1496x2048.png",
		},
		"viewPath" : "cus.crm.mytasks.view",
		"fullScreenPageRoutes" : {
			// fill the routes to your full screen pages in here.
			"taskDetail" : {
				"pattern" : "taskDetail/{contextPath}",
				"view" : "S3"
			},
			"newTask" : {
				"pattern" : "newTask/{processType}",
				"view" : "S3"
			},
			"newTaskFromNote" : {
				"pattern" : "newTask/{processType}",
				"view" : "S3"
			},
			"newTaskWithAccount" : {
				"pattern" : "newTaskWithAccount/{processType}/{accountName}",
				"view" : "S3"
			},
			"taskOverview" : {
				"pattern" : "taskOverview/{contextPath}",
				"view" : "S4"
			},
			"taskList" : {
				"pattern" : "",
				"view" : "S2"
			}
		},
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
			viewName : "cus.crm.mytasks.Main",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : oViewData
		});
	},
});