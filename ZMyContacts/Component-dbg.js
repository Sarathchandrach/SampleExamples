/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/*global jQuery: false, sap: false, cus: false, console: false */
(function () {
	'use strict';
	jQuery.sap.declare("cus.crm.mycontacts.Component");
	jQuery.sap.require("sap.ca.scfld.md.ComponentBase");
	jQuery.sap.require("cus.crm.mycontacts.Configuration");
	jQuery.sap.require("sap.m.routing.RouteMatchedHandler");

	sap.ca.scfld.md.ComponentBase.extend("cus.crm.mycontacts.Component", {
		metadata: sap.ca.scfld.md.ComponentBase.createMetaData("MD",{
			"name":"My Contacts",
			"version" : "1.5.6",
			"library":"cus.crm.mycontacts",
			"includes":[],
			"dependencies":{
				"libs":[ "sap.m", "sap.me" ],
				"components":[]
			},
			
			"config":{
				"resourceBundle":"i18n/i18n.properties",
				"titleResource":"MY_CONTACTS",
				"icon":"sap-icon://Fiori2/F0004",
				"favIcon":"./resources/sap/ca/ui/themes/base/img/favicon/F0004_My_Contacts.ico",
				"homeScreenIconPhone":"./resources/sap/ca/ui/themes/base/img/launchicon/F0004_My_Contacts/57_iPhone_Desktop_Launch.png",
				"homeScreenIconPhone@2":"./resources/sap/ca/ui/themes/base/img/launchicon/F0004_My_Contacts/114_iPhone-Retina_Web_Clip.png",
				"homeScreenIconTablet":"./resources/sap/ca/ui/themes/base/img/launchicon/F0004_My_Contacts/72_iPad_Desktop_Launch.png",
				"homeScreenIconTablet@2":"./resources/sap/ca/ui/themes/base/img/launchicon/F0004_My_Contacts/144_iPad_Retina_Web_Clip.png",
				"startupImage320x460":"./resources/sap/ca/ui/themes/base/img/splashscreen/320_x_460.png",
				"startupImage640x920":"./resources/sap/ca/ui/themes/base/img/splashscreen/640_x_920.png",
				"startupImage640x1096":"./resources/sap/ca/ui/themes/base/img/splashscreen/640_x_1096.png",
				"startupImage768x1004":"./resources/sap/ca/ui/themes/base/img/splashscreen/768_x_1004.png",
				"startupImage748x1024":"./resources/sap/ca/ui/themes/base/img/splashscreen/748_x_1024.png",
				"startupImage1536x2008":"./resources/sap/ca/ui/themes/base/img/splashscreen/1536_x_2008.png",
				"startupImage1496x2048":"./resources/sap/ca/ui/themes/base/img/splashscreen/1496_x_2048.png"
			},
			
			"viewPath" : "cus.crm.mycontacts.view",
			
			"detailPageRoutes" :{  
				"detail2":{
					"pattern": "detail2/{contextPath}/{filter}/{sort}/{isSearch}/{search}/{accountID}/{contactID}/{itemCount}",
					"view": "S3",
					"viewLevel": 1
				},
				"subDetail":{
					"pattern": "subDetail/{editPath}/{filter}/{sort}/{isSearch}/{search}/{accountID}/{contactID}/{itemCount}",
					"view": "S4",
					"viewLevel": 1
				},
				"noData":{
					"pattern": "noData/{viewTitle}/{languageKey}",
					"viewPath": "sap.ca.scfld.md.view",
					"view": "empty",
					"viewLevel": 1
				}
			},
			
			"masterPageRoutes" :{
				"master":{
					"pattern":"",
					"view":"S2",
					"targetControl":"MainSplitContainer",
					"viewLevel":0,
				},
				"selected":{
					"pattern": "selected/{contextPath}/{name}",
					"view": "S2",
                    "targetControl": "MainSplitContainer",
                    "viewLevel": 0
				},
			},
			
			"fullScreenPageRoutes" : {  
	        	"fullScreen"  : {
	        		"view":"MainSplitContainer",
					"viewPath":"sap.ca.scfld.md.view",
					"targetControl":"fioriContent",
					"targetAggregation":"pages",
					"pattern":"_neverusethispattern_",              
	         	},
				"edit": {
					pattern : "edit/{contextPath}",
					view : "S4",
				},
				"display": {
					pattern : "display/{contextPath}",
					view : "S3",
				},
	         	"new": {
					pattern : "new/{accountContextPath}",
					view : "S4",
				}
	        }
			
		}),

		/**
		 * Initialize the application
		 *
		 * @returns {sap.ui.core.Control} the content
		 */
		createContent:function () {
			var oViewData = {component:this};

			return sap.ui.view({
				viewName:"cus.crm.mycontacts.Main",
				type:sap.ui.core.mvc.ViewType.XML,
				viewData:oViewData
			});
		},

		init:function () {
			sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

			this._routeMatchedHandler = new sap.m.routing.RouteMatchedHandler(this.getRouter());
		}
	});
}());