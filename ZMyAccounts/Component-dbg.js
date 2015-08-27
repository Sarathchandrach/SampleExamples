/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// define a root UIComponent which exposes the main view
jQuery.sap.declare("cus.crm.myaccounts.Component");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");
jQuery.sap.require("sap.ui.core.routing.HashChanger");
sap.ca.scfld.md.ComponentBase.extend("cus.crm.myaccounts.Component", {

    metadata : sap.ca.scfld.md.ComponentBase.createMetaData("FS", {
	"name" : "My Accounts",
	"version" : "1.0.16",
	"library" : "cus.crm.myaccounts",
	"includes" : [],
	"dependencies" : {
	    "libs" : [ "sap.m", "sap.me" ],
	    "components" : []
	},
	"config" : {
	    "resourceBundle" : "i18n/i18n.properties",
	    "titleResource" : "FULLSCREEN_TITLE",
	    "icon" : "sap-icon://Fiori2/F0002",
	    "favIcon" : "./resources/sap/ca/ui/themes/base/img/favicon/F0002_My_Accounts.ico",
	    "homeScreenIconPhone" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/57_iPhone_Desktop_Launch.png",
	    "homeScreenIconPhone@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/114_iPhone-Retina_Web_Clip.png",
	    "homeScreenIconTablet" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/72_iPad_Desktop_Launch.png",
	    "homeScreenIconTablet@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/144_iPad_Retina_Web_Clip.png",
	    "startupImage320x460" : "./resources/sap/ca/ui/themes/base/img/splashscreen/320_x_460.png",
	    "startupImage640x920" : "./resources/sap/ca/ui/themes/base/img/splashscreen/640_x_920.png",
	    "startupImage640x1096" : "./resources/sap/ca/ui/themes/base/img/splashscreen/640_x_1096.png",
	    "startupImage768x1004" : "./resources/sap/ca/ui/themes/base/img/splashscreen/768_x_1004.png",
	    "startupImage748x1024" : "./resources/sap/ca/ui/themes/base/img/splashscreen/748_x_1024.png",
	    "startupImage1536x2008" : "./resources/sap/ca/ui/themes/base/img/splashscreen/1536_x_2008.png",
	    "startupImage1496x2048" : "./resources/sap/ca/ui/themes/base/img/splashscreen/1496_x_2048.png"
	},
	viewPath : "cus.crm.myaccounts.view",
	fullScreenPageRoutes : {
		
		"S2" : {
		pattern : "",
		view : "S2",

	    },
	    "mainPage" : {
			pattern : "mainPage/{filterState}",
			view : "S2",

		},
	    "detail" : {
		pattern : "detail/{contextPath}", // will be the url and from
		view : "S360",

	    },
	    "edit" : {
			pattern : "edit/{contextPath}",
			view : "maintain.GeneralDataEdit",
		},
		"new" : {
			pattern : "new/{accountCategory}",
			view : "maintain.GeneralDataEdit",
		},
	    "AccountNotes" : {
		pattern : "AccountNotes/{contextPath}", // will be the url and
		view : "S4Notes",

	    },
	    "AccountAttachments" : {
		pattern : "AccountAttachments/{contextPath}", // will be the
		view : "S4Attachments",

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
	    viewName : "cus.crm.myaccounts.Main",
	    type : sap.ui.core.mvc.ViewType.XML,
	    viewData : oViewData
	});
    },
    init : function() {
	// Get accountID query parameter
	var myComponent = this, context, accountID;
	if (myComponent && myComponent.getComponentData() && myComponent.getComponentData().startupParameters) {
	    jQuery.sap.log.debug("startup parameters are " + JSON.stringify(myComponent.getComponentData().startupParameters));
	    if (undefined != myComponent.getComponentData().startupParameters.accountID[0]) {
		accountID = myComponent.getComponentData().startupParameters.accountID[0];
	    }
	}
	if (accountID) {
	    // fix : the hash change could be not initialized in that moment
	    if (undefined == this.getRouter().oHashChanger) {
		this.getRouter().oHashChanger = sap.ui.core.routing.HashChanger.getInstance();

	    }
	    context = "AccountCollection('" + accountID + "')";
	    this.getRouter().navTo("detail", {
		contextPath : context
	    }, true);
	}

    },

});