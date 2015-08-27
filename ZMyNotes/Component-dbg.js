/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// define a root UIComponent which exposes the main view
jQuery.sap.declare("cus.crm.notes.Component");
jQuery.sap.require("cus.crm.notes.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

// new Component
sap.ca.scfld.md.ComponentBase.extend("cus.crm.notes.Component", {
	
	metadata : sap.ca.scfld.md.ComponentBase.createMetaData("MD", {
		"name": "Master Detail Sample",
		"version" : "1.0.0",
		"library" : "cus.crm.notes",
		"includes" : ["css/style.css"],  
		"dependencies" : { 
			"libs" : [ 
				"sap.m",
				"sap.me"
			],  
			"components" : [ 
			]/*, 
			"ui5version" : "1.16.3-SNAPSHOT"*/
		},
		"config" : {
			"resourceBundle" : "i18n/i18n.properties",
			"titleResource" : "SHELL_TITLE",
			"icon" : "sap-icon://Fiori2/F0006",
            "favIcon":"./resources/sap/ca/ui/themes/base/img/favicon/F0006_My_Notes.ico",
			"homeScreenIconPhone" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0006_My_Notes/57_iPhone_Desktop_Launch.png",
			"homeScreenIconPhone@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0006_My_Notes/114_iPhone-Retina_Web_Clip.png",
			"homeScreenIconTablet" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0006_My_Notes/72_iPad_Desktop_Launch.png",
			"homeScreenIconTablet@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0006_My_Notes/144_iPad_Retina_Web_Clip.png",
			"startupImage320x460" : "./resources/sap/ca/ui/themes/base/img/splashscreen/320_x_460.png",
			"startupImage640x920" : "./resources/sap/ca/ui/themes/base/img/splashscreen/640_x_920.png",
			"startupImage640x1096" : "./resources/sap/ca/ui/themes/base/img/splashscreen/640_x_1096.png",
			"startupImage768x1004" : "./resources/sap/ca/ui/themes/base/img/splashscreen/768_x_1004.png",
			"startupImage748x1024" : "./resources/sap/ca/ui/themes/base/img/splashscreen/748_x_1024.png",
			"startupImage1536x2008" : "./resources/sap/ca/ui/themes/base/img/splashscreen/1536_x_2008.png",
			"startupImage1496x2048" : "./resources/sap/ca/ui/themes/base/img/splashscreen/1496_x_2048.png"
		},
		
		viewPath : "cus.crm.notes.view",
		
	}),

	/**
	 * Initialize the application
	 * 
	 * @returns {sap.ui.core.Control} the content
	 */
	createContent : function() {
		var oViewData = {component: this};

		return sap.ui.view({
			viewName : "cus.crm.notes.Main",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : oViewData
		});
	},    
	
	/**
	 * Check if there are unsynchronized batch operations, which must be finished.
	 * The user will be prompted and can cancel the unload event.
	 * @param oEvent
	 * @returns {String}
	 */
	onWindowBeforeUnload : function(oEvent) {
		//Singleton object of the model handler
		this.oModelHandler = new cus.crm.notes.handler.ModelHandler();
		
		if(this.oModelHandler.hasBatchOperations()) {
			sap.ca.ui.utils.busydialog.requireBusyDialog();
			
			//TODO: This is a workaround, because it is unclear where the translation model is stored at this point in time
			var oTranslationModel = new sap.ui.model.resource.ResourceModel({
                bundleUrl : jQuery.sap.getModulePath("cus.crm.notes.i18n.i18n", ".properties"),
				bundleLocale : sap.ui.getCore().getConfiguration().getLanguage()
			});			
			
			//Will be called when the batch operations are finished
			this.oModelHandler.emptyBatchCallback = jQuery.proxy(
					function() {
						this.oModelHandler.emptyBatchCallback = function() {
						}; // clear function
						sap.ca.ui.utils.busydialog.releaseBusyDialog();
						sap.m.MessageToast.show( oTranslationModel.getResourceBundle().getText("MSG_SYNCHRONIZATION_SUCCEEDED"), {
							at: sap.ui.core.Popup.Dock.CenterCenter
						});
						//TODO: Re-execution of the original leave event possible (the event data is stored in oEvent)? 
					}, this);
			
			//Show data loss pop up with this given string
			return oTranslationModel.getResourceBundle().getText("MSG_SYNCHRONIZATION_ONGOING");
		}		
	}
});
