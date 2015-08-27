jQuery.sap.registerPreloadedModules({
"name":"cus/crm/mycontacts/Component-preload",
"version":"2.0",
"modules":{
	"cus/crm/mycontacts/Component.js":function(){/*
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
},
	"cus/crm/mycontacts/Configuration.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/*global jQuery: false, sap: false, cus: false, console: false */
(function () {
	'use strict';

	jQuery.sap.declare("cus.crm.mycontacts.Configuration");
	jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
	jQuery.sap.require("cus.crm.mycontacts.util.Util");

	sap.ca.scfld.md.ConfigurationBase.extend("cus.crm.mycontacts.Configuration", {
		oServiceParams:{
			serviceList:[
				{
					name:"CRM_BUPA_ODATA",
					serviceUrl : "/sap/opu/odata/sap/CRM_BUPA_ODATA/",
					isDefault:true,
					useBatch:true,
					countSupported:true,
					mockedDataSource:jQuery.sap.getModulePath("cus.crm.mycontacts")+"/model/metadata.xml"
				},
				{
					name:"CRM_BUPA_ODATA_CREATE",
					serviceUrl : "/sap/opu/odata/sap/CRM_BUPA_ODATA/",
					countSupported:false,
					//useBatch:true,
					mockedDataSource:jQuery.sap.getModulePath("cus.crm.mycontacts")+"/model/metadata.xml"
				}
			]
		},

		/**
		 * @inherit
		 */
		getServiceList:function () {
			return this.oServiceParams.serviceList;
		},
		
		setApplicationFacade : function(oApplicationFacade) {
			sap.ca.scfld.md.ConfigurationBase.prototype.setApplicationFacade.call(this, oApplicationFacade);
			cus.crm.mycontacts.util.Util.setApplicationFacade(oApplicationFacade);
		}
	});
}());

},
	"cus/crm/mycontacts/Main.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/*global jQuery: false, sap: false */
(function () {
	'use strict';
	sap.ui.controller("cus.crm.mycontacts.Main", {

		onInit:function () {
			jQuery.sap.require("sap.ca.scfld.md.Startup");
			jQuery.sap.require("cus.crm.mycontacts.formatter.ReleaseFormatter");

			sap.ca.scfld.md.Startup.init('cus.crm.mycontacts', this);
		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 *
		 * @memberOf MainXML
		 */
		onExit:function () {
			//exit cleanup code here
		}

	});
}());

},
	"cus/crm/mycontacts/Main.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core"\n           xmlns="sap.m" controllerName="cus.crm.mycontacts.Main" displayBlock="true" height="100%">\n    <NavContainer id="fioriContent" showHeader="false">\n    </NavContainer>\n</core:View>',
	"cus/crm/mycontacts/formatter/ReleaseFormatter.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/*global jQuery: false, sap: false, cus: false, console: false, location: false, URI:false */
(function () {
	'use strict';
	jQuery.sap.declare("cus.crm.mycontacts.formatter.ReleaseFormatter");

	cus.crm.mycontacts.formatter.ReleaseFormatter = {};

	cus.crm.mycontacts.formatter.ReleaseFormatter.pictureUrlFormatter = function (photo) {
		if(photo && photo.__metadata.media_src){
			return cus.crm.mycontacts.formatter.ReleaseFormatter.getRelativePathFromURL(photo.__metadata.media_src);
		}
		return "sap-icon://person-placeholder";
	};

	cus.crm.mycontacts.formatter.ReleaseFormatter.getRelativePathFromURL = function(absoluteURL){
		var url =  document.createElement('a');
		url.href = absoluteURL;
		if(url.pathname.substring(0, 1) == "/")
			return url.pathname;
		else
			return "/" + url.pathname;
	};

	cus.crm.mycontacts.formatter.ReleaseFormatter.logoUrlFormatter = function (oLogo) {
		var sLogoUrl = "sap-icon://factory";

		if (oLogo && oLogo.__metadata && oLogo.__metadata.media_src) {
			sLogoUrl = cus.crm.mycontacts.formatter.ReleaseFormatter.getRelativePathFromURL(oLogo.__metadata.media_src);
		}

		return sLogoUrl;
	};


	cus.crm.mycontacts.formatter.ReleaseFormatter.urlFormatter = function (value) {
		var sSapServer, sSapHost, sSapHostHttp, sSapClient, oUri, sCurrentProtocol;

		sSapServer = jQuery.sap.getUriParameters().get("sap-server");
		sSapHost = jQuery.sap.getUriParameters().get("sap-host");
		sSapHostHttp = jQuery.sap.getUriParameters().get("sap-host-http");
		sSapClient = jQuery.sap.getUriParameters().get("sap-client");

		oUri = URI(location.protocol + "//" + location.hostname + (location.port ? ':'+location.port: '') + cus.crm.mycontacts.formatter.ReleaseFormatter.getRelativePathFromURL(value));
		sCurrentProtocol = location.protocol.replace(':', '');
		if (sCurrentProtocol !== oUri.protocol()) {
			oUri.protocol(sCurrentProtocol);
		}

		if (sSapServer) {
			oUri.addSearch('sap-server', sSapServer);
		}

		if (sSapHost) {
			oUri.addSearch('sap-host', sSapHost);
		}

		if (sSapHostHttp) {
			oUri.addSearch('sap-host-http', sSapHostHttp);
		}


		if (sSapClient) {
			oUri.addSearch('sap-client', sSapClient);
		}

		return oUri.toString();

	};

	cus.crm.mycontacts.formatter.ReleaseFormatter.addressFormatter = function (address) {
		return address.split("\n").join(" ");
	};

	cus.crm.mycontacts.formatter.ReleaseFormatter.isMainContact = function (value) {
		var mainContact = "";
		if (value) {
			mainContact = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("MAIN_CONTACT");
		}

		return mainContact;
	};
	
	cus.crm.mycontacts.formatter.ReleaseFormatter.locationFormatter= function (oCity, oCountry, accountID) {
		var text = "";
		var idPrefix = "";
		
		if (accountID){
			idPrefix = accountID + " / ";
			text = accountID;
		}
		if(!oCity && oCountry){
			text = idPrefix + oCountry;
		}
		else if(!oCountry && oCity){
			text = idPrefix + oCity;
		}
		else if(oCountry && oCity){
			text = idPrefix + oCity +", " + oCountry;
		}
		return text;
	};

	cus.crm.mycontacts.formatter.ReleaseFormatter.formatMediumDate = function(oValue){
		if(oValue){
			return sap.ca.ui.model.format.DateFormat.getDateInstance({style: "medium"}).format(oValue);
		}
		else {
			return "";
		}
	};	
	
	cus.crm.mycontacts.formatter.ReleaseFormatter.isUnequal = function (value1, value2) {
		if(typeof(value1)=="string" && typeof(value2)=="string"){
			return value1.valueOf() != value2.valueOf();}
		else{
			return value1 != value2;
		}
	};
	
	cus.crm.mycontacts.formatter.ReleaseFormatter.isNotInitial = function (value) {
		if (value)
			return true;
		else
			return false;
	};
}());

},
	"cus/crm/mycontacts/i18n/i18n.properties":'#Fiori CRM My Contacts application\n# __ldi.translation.uuid=47e50220-1ea3-11e3-8224-0800200c9a66\n# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\n\n# Note: This file was created according to the conventions that can be found at \n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\n\n#XTIT,20: this is the title for the master section when "All Contacts" are displayed\nMASTER_TITLE=All Contacts ({0})\n\n#XTIT,20: this is the title for the master section when "My Contacts" are displayed\nMASTER_TITLE_FOR_MY_CONTACTS=My Contacts ({0})\n\n#XTIT,20 : this is the title for the detail section\nDETAIL_TITLE=Contact\n\n#XFLD, 30: this is the place holder dummy in the detail page\nDETAIL_TEXT=Insert your controls here...\n\n#XFLD,20: All contacts for filter\nALL_CONTACTS=All Contacts\n\n#XFLD,30: My contacts for filter\nMY_CONTACTS=My Contacts\n\n# XTIT,40: Application title\nSHELL_TITLE=Contacts\n\n# XFLD,40: Spinning wheel text\nMASTER_BUSY_TEXT=Loading Contacts ...\n\n# XFLD,40: Text in result list if no entries exist\nMASTER_LIST_NODATA=No Contacts found\n\n# XFLD,20: Search default test\nMASTER_SEARCH_PLACEHOLDER=Search ...\n\n# XTOL,50: Search default test\nMASTER_SEARCH_TOOLTIP=Search for Contacts\n\n# XTIT,40: Title for the list\nMASTER_TITLE1=Contacts\n\n# XTIT,40: Title for the list\nMASTER_TITLE2=My Contacts\n\n# XTIT,50: Detail View title name\nDETAILS_TITLE=Contact\n\n# XFLD,20: Contact Detail field for E-Mail\nCONTACT_EMAIL=E-Mail\n\n# XFLD,20: Contact Detail field for Mobile Phone\nCONTACT_MOBILE_PHONE=Mobile\n\n# XFLD,20: Contact Detail field for Phone\nCONTACT_PHONE=Phone\n\n# XFLD,20: Contact Detail field for Company\nCONTACT_ACCOUNT=Account\n\n# XFLD,20: Contact Detail field for Job Function\nCONTACT_FUNCTION=Function\n\n# XFLD,20: Contact Detail field for First Name\nCONTACT_FIRST_NAME=First Name\n\n# XFLD,20: Contact Detail field for Last Name\nCONTACT_LAST_NAME=Last Name\n\n# XFLD,20: Contact Detail field for Postal Code\nCONTACT_POSTAL_CODE=Postal Code\n\n# XFLD,20: Contact Detail field for Address\nCONTACT_ADDRESS=Address\n\n# XTIT,50: Edit Detail View title name\nEDIT_DETAILS_TITLE=Edit Contact\n\n# XTIT,50: Contact Detail View title name\nCONTACT_DETAILS_TITLE=Contact Details\n\n#XBUT,20\nS3_EDIT=Edit\n\n#XBUT,20\nS4_SAVE=Save\n\n#XBUT,20\nS4_CANCEL=Cancel\n\n# XTIT,50: New contact title\nNEW_CONTACT=New Contact\n\n# XTIT,50: Edit contact title\nEDIT_CONTACT=Edit Contact\n\n# XTIT,60: Shows which contact is the Main Contact\nMAIN_CONTACT=Main Contact\n\n# XFLD,20: Contact Detail field for Birthday\nCONTACT_BIRTHDAY=Birthday\n\n# XFLD,20: Contact Detail field for Note\nCONTACT_NOTE=Note\n\n# XFLD,20: Contact Detail field for Job Department\nCONTACT_DEPARTMENT=Department\n\n# XFLD,20: Contact Detail field for Contact Title\nCONTACT_TITLE=Title\n\n#XTIT,20: W7: Title of pop-up used in confirm popup\nCONFIRM_TITLE=Confirm\n\n# XFLD,20: Contact Detail field for  Academic Title\nCONTACT_ACADEMIC_TITLE=Academic Title\n\n# XMSG : Contact creation succeeded\nCREATION_SUCCESS=The contact has been created.\n\n# XMSG : Contact creation failed\nCREATION_ERROR=The creation failed.\n\n# XMSG : Contact creation succeeded\nUPDATE_SUCCESS=The contact has been updated.\n\n# XMSG : Contact creation failed\nUPDATE_ERROR=The update failed.\n\n# XMSG : Contact creation : nothing has been changed\nNO_CHANGE=No changes made\n\n# XMSG: message that will be displayed, if not all mandatory fields are not filled\nMSG_MANDATORY_FIELDS=Not all mandatory fields are filled.\n\n# XMSG : Photo update failed\nUPDATE_PHOTO_ERROR=The photo\'s update failed.\n\n\n# XBUT,10: OK\nOK=OK\n\n# XMSG: Cancel confirmation\nCONFIRM_CANCEL=Leave this page without saving the changes you may have made?\n\n# XBUT,30: Add photo\nADD_PHOTO=Add Photo\n\n#XMSG\nNO_ITEMS_AVAILABLE=No items are currently available\n\n# XBUT,30: add field\nADD_FIELD=Add Field\n\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\nFILTERED_BY_ALL_CONTACTS=Filtered By: All Contacts\n\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\nFILTERED_BY_MY_CONTACTS=Filtered By: My Contacts\n\n#XFLD,20: Information "Filtered By: [value]" displayed in the master list information bar\nFILTERED_BY=Filtered By: {0}\n\n#XFLD,20: Placeholder for the select account input\nSELECT_ACCOUNT=Select Account\n\n#XFLD,20: Placeholder for the search in the select account dialog\nSEARCH=Search\n\n#XFLD,20: No Data text after loading/searching list\nNO_DATA_TEXT=No Data\n\n#XFLD,20: No Data text when loading/searching list\nLOADING_TEXT=Loading....\n\n# XMSG: message that will be displayed in case of conflicting data during account editing\nMSG_CONFLICTING_DATA=Data has been changed by another user. Do you want to overwrite the other user\'s changes with your own?\n\n# XMSG: message that will be displayed in case of conflicts during file renaming\nMSG_CONFLICTING_FILE_NAME=The file name has been changed by another user. Do you want to overwrite the other user\'s changes with your own?\n',
	"cus/crm/mycontacts/i18n/i18n_ar.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT,20: this is the title for the master section when "All Contacts" are displayed\r\nMASTER_TITLE=\\u062C\\u0645\\u064A\\u0639 \\u062C\\u0647\\u0627\\u062A \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644 ({0})\r\n\r\n#XTIT,20: this is the title for the master section when "My Contacts" are displayed\r\nMASTER_TITLE_FOR_MY_CONTACTS=\\u062C\\u0647\\u0627\\u062A \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644 \\u0627\\u0644\\u062E\\u0627\\u0635\\u0629 \\u0628\\u064A ({0})\r\n\r\n#XTIT,20 : this is the title for the detail section\r\nDETAIL_TITLE=\\u062C\\u0647\\u0629 \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644\r\n\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=\\u0623\\u062F\\u062E\\u0644 \\u0639\\u0646\\u0627\\u0635\\u0631 \\u0627\\u0644\\u062A\\u062D\\u0643\\u0645 \\u0647\\u0646\\u0627\r\n\r\n#XFLD,20: All contacts for filter\r\nALL_CONTACTS=\\u0643\\u0644 \\u062C\\u0647\\u0627\\u062A \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644\r\n\r\n#XFLD,30: My contacts for filter\r\nMY_CONTACTS=\\u062C\\u0647\\u0627\\u062A \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644 \\u0627\\u0644\\u062E\\u0627\\u0635\\u0629 \\u0628\\u064A\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=\\u062C\\u0647\\u0627\\u062A \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644\r\n\r\n# XFLD,40: Spinning wheel text\r\nMASTER_BUSY_TEXT=\\u062C\\u0627\\u0631\\u064D \\u062A\\u062D\\u0645\\u064A\\u0644 \\u062C\\u0647\\u0627\\u062A \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644...\r\n\r\n# XFLD,40: Text in result list if no entries exist\r\nMASTER_LIST_NODATA=\\u0644\\u0645 \\u064A\\u062A\\u0645 \\u0627\\u0644\\u0639\\u062B\\u0648\\u0631 \\u0639\\u0644\\u0649 \\u0623\\u064A\\u0629 \\u062C\\u0647\\u0627\\u062A \\u0627\\u062A\\u0635\\u0627\\u0644\r\n\r\n# XFLD,20: Search default test\r\nMASTER_SEARCH_PLACEHOLDER=\\u0628\\u062D\\u062B\r\n\r\n# XTOL,50: Search default test\r\nMASTER_SEARCH_TOOLTIP=\\u0628\\u062D\\u062B \\u0639\\u0646 \\u062C\\u0647\\u0627\\u062A \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE1=\\u062C\\u0647\\u0627\\u062A \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE2=\\u062C\\u0647\\u0627\\u062A \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644 \\u0627\\u0644\\u062E\\u0627\\u0635\\u0629 \\u0628\\u064A\r\n\r\n# XTIT,50: Detail View title name\r\nDETAILS_TITLE=\\u062C\\u0647\\u0629 \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644\r\n\r\n# XFLD,20: Contact Detail field for E-Mail\r\nCONTACT_EMAIL=\\u0627\\u0644\\u0628\\u0631\\u064A\\u062F \\u0627\\u0644\\u0625\\u0644\\u0643\\u062A\\u0631\\u0648\\u0646\\u064A\r\n\r\n# XFLD,20: Contact Detail field for Mobile Phone\r\nCONTACT_MOBILE_PHONE=\\u0627\\u0644\\u062C\\u0648\\u0627\\u0644\r\n\r\n# XFLD,20: Contact Detail field for Phone\r\nCONTACT_PHONE=\\u0627\\u0644\\u0647\\u0627\\u062A\\u0641\r\n\r\n# XFLD,20: Contact Detail field for Company\r\nCONTACT_ACCOUNT=\\u0627\\u0644\\u0639\\u0645\\u064A\\u0644\r\n\r\n# XFLD,20: Contact Detail field for Job Function\r\nCONTACT_FUNCTION=\\u0627\\u0644\\u0648\\u0638\\u064A\\u0641\\u0629\r\n\r\n# XFLD,20: Contact Detail field for First Name\r\nCONTACT_FIRST_NAME=\\u0627\\u0644\\u0627\\u0633\\u0645 \\u0627\\u0644\\u0623\\u0648\\u0644\r\n\r\n# XFLD,20: Contact Detail field for Last Name\r\nCONTACT_LAST_NAME=\\u0627\\u0644\\u0627\\u0633\\u0645 \\u0627\\u0644\\u0623\\u062E\\u064A\\u0631\r\n\r\n# XFLD,20: Contact Detail field for Postal Code\r\nCONTACT_POSTAL_CODE=\\u0627\\u0644\\u0631\\u0645\\u0632 \\u0627\\u0644\\u0628\\u0631\\u064A\\u062F\\u064A\r\n\r\n# XFLD,20: Contact Detail field for Address\r\nCONTACT_ADDRESS=\\u0627\\u0644\\u0639\\u0646\\u0648\\u0627\\u0646\r\n\r\n# XTIT,50: Edit Detail View title name\r\nEDIT_DETAILS_TITLE=\\u062A\\u062D\\u0631\\u064A\\u0631 \\u062C\\u0647\\u0629 \\u0627\\u062A\\u0635\\u0627\\u0644\r\n\r\n# XTIT,50: Contact Detail View title name\r\nCONTACT_DETAILS_TITLE=\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u062C\\u0647\\u0629 \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644\r\n\r\n#XBUT,20\r\nS3_EDIT=\\u062A\\u062D\\u0631\\u064A\\u0631\r\n\r\n#XBUT,20\r\nS4_SAVE=\\u062D\\u0641\\u0638\r\n\r\n#XBUT,20\r\nS4_CANCEL=\\u0625\\u0644\\u063A\\u0627\\u0621\r\n\r\n# XTIT,50: New contact title\r\nNEW_CONTACT=\\u062C\\u0647\\u0629 \\u0627\\u062A\\u0635\\u0627\\u0644 \\u062C\\u062F\\u064A\\u062F\\u0629\r\n\r\n# XTIT,50: Edit contact title\r\nEDIT_CONTACT=\\u062A\\u062D\\u0631\\u064A\\u0631 \\u062C\\u0647\\u0629 \\u0627\\u062A\\u0635\\u0627\\u0644\r\n\r\n# XTIT,60: Shows which contact is the Main Contact\r\nMAIN_CONTACT=\\u062C\\u0647\\u0629 \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644 \\u0627\\u0644\\u0631\\u0626\\u064A\\u0633\\u064A\\u0629\r\n\r\n# XFLD,20: Contact Detail field for Birthday\r\nCONTACT_BIRTHDAY=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0645\\u064A\\u0644\\u0627\\u062F\r\n\r\n# XFLD,20: Contact Detail field for Note\r\nCONTACT_NOTE=\\u0645\\u0644\\u0627\\u062D\\u0638\\u0629\r\n\r\n# XFLD,20: Contact Detail field for Job Department\r\nCONTACT_DEPARTMENT=\\u0627\\u0644\\u0642\\u0633\\u0645\r\n\r\n# XFLD,20: Contact Detail field for Contact Title\r\nCONTACT_TITLE=\\u0627\\u0644\\u0639\\u0646\\u0648\\u0627\\u0646\r\n\r\n#XTIT,20: W7: Title of pop-up used in confirm popup\r\nCONFIRM_TITLE=\\u062A\\u0623\\u0643\\u064A\\u062F\r\n\r\n# XFLD,20: Contact Detail field for  Academic Title\r\nCONTACT_ACADEMIC_TITLE=\\u0644\\u0642\\u0628 \\u0623\\u0643\\u0627\\u062F\\u064A\\u0645\\u064A\r\n\r\n# XMSG : Contact creation succeeded\r\nCREATION_SUCCESS=\\u062A\\u0645 \\u0625\\u0646\\u0634\\u0627\\u0621 \\u062C\\u0647\\u0629 \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644\r\n\r\n# XMSG : Contact creation failed\r\nCREATION_ERROR=\\u0641\\u0634\\u0644 \\u0627\\u0644\\u0625\\u0646\\u0634\\u0627\\u0621\r\n\r\n# XMSG : Contact creation succeeded\r\nUPDATE_SUCCESS=\\u062A\\u0645 \\u062A\\u062D\\u062F\\u064A\\u062B \\u062C\\u0647\\u0629 \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644\r\n\r\n# XMSG : Contact creation failed\r\nUPDATE_ERROR=\\u0641\\u0634\\u0644 \\u0627\\u0644\\u062A\\u062D\\u062F\\u064A\\u062B\r\n\r\n# XMSG : Contact creation : nothing has been changed\r\nNO_CHANGE=\\u0644\\u0645 \\u064A\\u062A\\u0645 \\u0625\\u062C\\u0631\\u0627\\u0621 \\u062A\\u063A\\u064A\\u064A\\u0631\\u0627\\u062A\r\n\r\n# XMSG: message that will be displayed, if not all mandatory fields are not filled\r\nMSG_MANDATORY_FIELDS=\\u0644\\u0645 \\u064A\\u062A\\u0645 \\u0645\\u0644\\u0621 \\u062C\\u0645\\u064A\\u0639 \\u0627\\u0644\\u062D\\u0642\\u0648\\u0644 \\u0627\\u0644\\u0625\\u0644\\u0632\\u0627\\u0645\\u064A\\u0629\r\n\r\n# XMSG : Photo update failed\r\nUPDATE_PHOTO_ERROR=\\u0641\\u0634\\u0644 \\u062A\\u062D\\u062F\\u064A\\u062B \\u0627\\u0644\\u0635\\u0648\\u0631\\u0629 \\u0627\\u0644\\u0641\\u0648\\u062A\\u0648\\u063A\\u0631\\u0627\\u0641\\u064A\\u0629\r\n\r\n\r\n# XBUT,10: OK\r\nOK=\\u0645\\u0648\\u0627\\u0641\\u0642\r\n\r\n# XMSG: Cancel confirmation\r\nCONFIRM_CANCEL=\\u0633\\u064A\\u062A\\u0645 \\u0641\\u0642\\u062F\\u0627\\u0646 \\u0623\\u064A\\u0629 \\u062A\\u063A\\u064A\\u064A\\u0631\\u0627\\u062A \\u063A\\u064A\\u0631 \\u0645\\u062D\\u0641\\u0648\\u0638\\u0629. \\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0627\\u0644\\u0645\\u062A\\u0627\\u0628\\u0639\\u0629\\u061F\r\n\r\n# XBUT,30: Add photo\r\nADD_PHOTO=\\u0625\\u0636\\u0627\\u0641\\u0629 \\u0635\\u0648\\u0631\\u0629 \\u0641\\u0648\\u062A\\u0648\\u063A\\u0631\\u0627\\u0641\\u064A\\u0629\r\n\r\n#XMSG\r\nNO_ITEMS_AVAILABLE=\\u0644\\u0627 \\u062A\\u062A\\u0648\\u0641\\u0631 \\u0623\\u064A\\u0629 \\u0639\\u0646\\u0627\\u0635\\u0631 \\u062D\\u0627\\u0644\\u064A\\u064B\\u0627\r\n\r\n# XBUT,30: add field\r\nADD_FIELD=\\u0625\\u0636\\u0627\\u0641\\u0629 \\u0627\\u0644\\u062D\\u0642\\u0644\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_ALL_CONTACTS=\\u062A\\u0635\\u0641\\u064A\\u0629 \\u062D\\u0633\\u0628\\: \\u0643\\u0644 \\u062C\\u0647\\u0627\\u062A \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_MY_CONTACTS=\\u062A\\u0635\\u0641\\u064A\\u0629 \\u062D\\u0633\\u0628\\: \\u062C\\u0647\\u0627\\u062A \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644 \\u0627\\u0644\\u062E\\u0627\\u0635\\u0629 \\u0628\\u064A\r\n\r\n#XFLD,20: Information "Filtered By: [value]" displayed in the master list information bar\r\nFILTERED_BY=\\u062A\\u0645\\u062A \\u0627\\u0644\\u062A\\u0635\\u0641\\u064A\\u0629 \\u062D\\u0633\\u0628\\: {0}\r\n\r\n#XFLD,20: Placeholder for the select account input\r\nSELECT_ACCOUNT=\\u062A\\u062D\\u062F\\u064A\\u062F \\u0627\\u0644\\u062D\\u0633\\u0627\\u0628\r\n\r\n#XFLD,20: Placeholder for the search in the select account dialog\r\nSEARCH=\\u0628\\u062D\\u062B\r\n\r\n#XFLD,20: No Data text after loading/searching list\r\nNO_DATA_TEXT=\\u0644\\u0627 \\u062A\\u0648\\u062C\\u062F \\u0628\\u064A\\u0627\\u0646\\u0627\\u062A\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=\\u062C\\u0627\\u0631\\u064D \\u0627\\u0644\\u062A\\u062D\\u0645\\u064A\\u0644...\r\n\r\n# XMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=\\u062A\\u0645 \\u062A\\u063A\\u064A\\u064A\\u0631 \\u0627\\u0644\\u0628\\u064A\\u0627\\u0646\\u0627\\u062A \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629 \\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0622\\u062E\\u0631. \\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0627\\u0633\\u062A\\u0628\\u062F\\u0627\\u0644 \\u062A\\u063A\\u064A\\u064A\\u0631\\u0627\\u062A \\u0627\\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0627\\u0644\\u0622\\u062E\\u0631 \\u0628\\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\\u0627\\u062A \\u0627\\u0644\\u062E\\u0627\\u0635\\u0629 \\u0628\\u0643\\u061F\r\n\r\n# XMSG: message that will be displayed in case of conflicts during file renaming\r\nMSG_CONFLICTING_FILE_NAME=\\u062A\\u0645 \\u062A\\u063A\\u064A\\u064A\\u0631 \\u0627\\u0633\\u0645 \\u0627\\u0644\\u0645\\u0644\\u0641 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629 \\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0622\\u062E\\u0631. \\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0627\\u0633\\u062A\\u0628\\u062F\\u0627\\u0644 \\u062A\\u063A\\u064A\\u064A\\u0631\\u0627\\u062A \\u0627\\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0627\\u0644\\u0622\\u062E\\u0631 \\u0628\\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\\u0627\\u062A \\u0627\\u0644\\u062E\\u0627\\u0635\\u0629 \\u0628\\u0643\\u061F\r\n',
	"cus/crm/mycontacts/i18n/i18n_bg.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\n\n# Note: This file was created according to the conventions that can be found at \n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\n\n#XTIT,20: this is the title for the master section when "All Contacts" are displayed\nMASTER_TITLE=\\u0412\\u0441\\u0438\\u0447\\u043A\\u0438 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438 ({0})\n\n#XTIT,20: this is the title for the master section when "My Contacts" are displayed\nMASTER_TITLE_FOR_MY_CONTACTS=\\u041C\\u043E\\u0438\\u0442\\u0435 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438 ({0})\n\n#XTIT,20 : this is the title for the detail section\nDETAIL_TITLE=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\n\n#XFLD, 30: this is the place holder dummy in the detail page\nDETAIL_TEXT=\\u0412\\u043C\\u044A\\u043A\\u043D\\u0435\\u0442\\u0435 \\u0432\\u0430\\u0448\\u0438\\u0442\\u0435 \\u043A\\u043E\\u043D\\u0442\\u0440\\u043E\\u043B\\u0438 \\u0442\\u0443\\u043A\n\n#XFLD,20: All contacts for filter\nALL_CONTACTS=\\u0412\\u0441\\u0438\\u0447\\u043A\\u0438 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438\n\n#XFLD,30: My contacts for filter\nMY_CONTACTS=\\u041C\\u043E\\u0438\\u0442\\u0435 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438\n\n# XTIT,40: Application title\nSHELL_TITLE=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438\n\n# XFLD,40: Spinning wheel text\nMASTER_BUSY_TEXT=\\u0417\\u0430\\u0440\\u0435\\u0436\\u0434\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438...\n\n# XFLD,40: Text in result list if no entries exist\nMASTER_LIST_NODATA=\\u041D\\u0435 \\u0441\\u0430 \\u043E\\u0442\\u043A\\u0440\\u0438\\u0442\\u0438 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438\n\n# XFLD,20: Search default test\nMASTER_SEARCH_PLACEHOLDER=\\u0422\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435\n\n# XTOL,50: Search default test\nMASTER_SEARCH_TOOLTIP=\\u0422\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435 \\u0437\\u0430 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438\n\n# XTIT,40: Title for the list\nMASTER_TITLE1=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438\n\n# XTIT,40: Title for the list\nMASTER_TITLE2=\\u041C\\u043E\\u0438\\u0442\\u0435 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438\n\n# XTIT,50: Detail View title name\nDETAILS_TITLE=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\n\n# XFLD,20: Contact Detail field for E-Mail\nCONTACT_EMAIL=\\u0418\\u043C\\u0435\\u0439\\u043B\n\n# XFLD,20: Contact Detail field for Mobile Phone\nCONTACT_MOBILE_PHONE=\\u041C\\u043E\\u0431\\u0438\\u043B\\u0435\\u043D\n\n# XFLD,20: Contact Detail field for Phone\nCONTACT_PHONE=\\u0422\\u0435\\u043B\\u0435\\u0444\\u043E\\u043D\n\n# XFLD,20: Contact Detail field for Company\nCONTACT_ACCOUNT=\\u0410\\u043A\\u0430\\u0443\\u043D\\u0442\n\n# XFLD,20: Contact Detail field for Job Function\nCONTACT_FUNCTION=\\u0424\\u0443\\u043D\\u043A\\u0446\\u0438\\u044F\n\n# XFLD,20: Contact Detail field for First Name\nCONTACT_FIRST_NAME=\\u0421\\u043E\\u0431\\u0441\\u0442\\u0432\\u0435\\u043D\\u043E \\u0438\\u043C\\u0435\n\n# XFLD,20: Contact Detail field for Last Name\nCONTACT_LAST_NAME=\\u0424\\u0430\\u043C\\u0438\\u043B\\u0438\\u044F\n\n# XFLD,20: Contact Detail field for Postal Code\nCONTACT_POSTAL_CODE=\\u041F\\u043E\\u0449\\u0435\\u043D\\u0441\\u043A\\u0438 \\u041A\\u043E\\u0434\n\n# XFLD,20: Contact Detail field for Address\nCONTACT_ADDRESS=\\u0410\\u0434\\u0440\\u0435\\u0441\n\n# XTIT,50: Edit Detail View title name\nEDIT_DETAILS_TITLE=\\u0420\\u0435\\u0434\\u0430\\u043A\\u0446\\u0438\\u044F \\u043D\\u0430 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\n\n# XTIT,50: Contact Detail View title name\nCONTACT_DETAILS_TITLE=\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438 \\u0437\\u0430 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\n\n#XBUT,20\nS3_EDIT=\\u0420\\u0435\\u0434\\u0430\\u043A\\u0446\\u0438\\u044F\n\n#XBUT,20\nS4_SAVE=\\u0417\\u0430\\u043F\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435\n\n#XBUT,20\nS4_CANCEL=\\u041E\\u0442\\u043A\\u0430\\u0437\n\n# XTIT,50: New contact title\nNEW_CONTACT=\\u041D\\u043E\\u0432 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\n\n# XTIT,50: Edit contact title\nEDIT_CONTACT=\\u0420\\u0435\\u0434\\u0430\\u043A\\u0446\\u0438\\u044F \\u043D\\u0430 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\n\n# XTIT,60: Shows which contact is the Main Contact\nMAIN_CONTACT=\\u041E\\u0441\\u043D\\u043E\\u0432\\u0435\\u043D \\u0434\\u043E\\u0433\\u043E\\u0432\\u043E\\u0440\n\n# XFLD,20: Contact Detail field for Birthday\nCONTACT_BIRTHDAY=\\u0414\\u0430\\u0442\\u0430 \\u043D\\u0430 \\u0440\\u0430\\u0436\\u0434\\u0430\\u043D\\u0435\n\n# XFLD,20: Contact Detail field for Note\nCONTACT_NOTE=\\u0417\\u0430\\u0431\\u0435\\u043B\\u0435\\u0436\\u043A\\u0430\n\n# XFLD,20: Contact Detail field for Job Department\nCONTACT_DEPARTMENT=\\u041E\\u0442\\u0434\\u0435\\u043B\n\n# XFLD,20: Contact Detail field for Contact Title\nCONTACT_TITLE=\\u0417\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435\n\n#XTIT,20: W7: Title of pop-up used in confirm popup\nCONFIRM_TITLE=\\u041F\\u043E\\u0442\\u0432\\u044A\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435\n\n# XFLD,20: Contact Detail field for  Academic Title\nCONTACT_ACADEMIC_TITLE=\\u041D\\u0430\\u0443\\u0447\\u043D\\u0430 \\u0441\\u0442\\u0435\\u043F\\u0435\\u043D\n\n# XMSG : Contact creation succeeded\nCREATION_SUCCESS=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u044A\\u0442 \\u0435 \\u0441\\u044A\\u0437\\u0434\\u0430\\u0434\\u0435\\u043D\n\n# XMSG : Contact creation failed\nCREATION_ERROR=\\u041D\\u0435\\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u043E \\u0441\\u044A\\u0437\\u0434\\u0430\\u0432\\u0430\\u043D\\u0435\n\n# XMSG : Contact creation succeeded\nUPDATE_SUCCESS=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u044A\\u0442 \\u0435 \\u0430\\u043A\\u0442\\u0443\\u0430\\u043B\\u0438\\u0437\\u0438\\u0440\\u0430\\u043D\n\n# XMSG : Contact creation failed\nUPDATE_ERROR=\\u041D\\u0435\\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u0430 \\u0430\\u043A\\u0442\\u0443\\u0430\\u043B\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F\n\n# XMSG : Contact creation : nothing has been changed\nNO_CHANGE=\\u041D\\u0435 \\u0441\\u0430 \\u043D\\u0430\\u043F\\u0440\\u0430\\u0432\\u0435\\u043D\\u0438 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438\n\n# XMSG: message that will be displayed, if not all mandatory fields are not filled\nMSG_MANDATORY_FIELDS=\\u041D\\u0435 \\u0441\\u0430 \\u043F\\u043E\\u043F\\u044A\\u043B\\u043D\\u0435\\u043D\\u0438 \\u0432\\u0441\\u0438\\u0447\\u043A\\u0438 \\u0437\\u0430\\u0434\\u044A\\u043B\\u0436\\u0438\\u0442\\u0435\\u043B\\u043D\\u0438 \\u043F\\u043E\\u043B\\u0435\\u0442\\u0430\n\n# XMSG : Photo update failed\nUPDATE_PHOTO_ERROR=\\u041D\\u0435\\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u043E \\u0430\\u043A\\u0442\\u0443\\u0430\\u043B\\u0438\\u0437\\u0438\\u0440\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0441\\u043D\\u0438\\u043C\\u043A\\u0430\n\n\n# XBUT,10: OK\nOK=OK\n\n# XMSG: Cancel confirmation\nCONFIRM_CANCEL=\\u041D\\u0435\\u0437\\u0430\\u043F\\u0430\\u0437\\u0435\\u043D\\u0438\\u0442\\u0435 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438 \\u0449\\u0435 \\u0431\\u044A\\u0434\\u0430\\u0442 \\u0438\\u0437\\u0433\\u0443\\u0431\\u0435\\u043D\\u0438. \\u0416\\u0435\\u043B\\u0430\\u0435\\u0442\\u0435 \\u043B\\u0438 \\u043F\\u0440\\u043E\\u0434\\u044A\\u043B\\u0436\\u0430\\u0432\\u0430\\u043D\\u0435?\n\n# XBUT,30: Add photo\nADD_PHOTO=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u0441\\u043D\\u0438\\u043C\\u043A\\u0430\n\n#XMSG\nNO_ITEMS_AVAILABLE=\\u0412 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442\\u0430 \\u043D\\u044F\\u043C\\u0430 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u0438\n\n# XBUT,30: add field\nADD_FIELD=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u043E\\u043B\\u0435\n\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\nFILTERED_BY_ALL_CONTACTS=\\u0424\\u0438\\u043B\\u0442\\u0440\\u0438\\u0440\\u0430\\u043D\\u0438 \\u043F\\u043E\\: \\u0432\\u0441\\u0438\\u0447\\u043A\\u0438 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438\n\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\nFILTERED_BY_MY_CONTACTS=\\u0424\\u0438\\u043B\\u0442\\u0440\\u0438\\u0440\\u0430\\u043D\\u0438 \\u043F\\u043E\\: \\u043C\\u043E\\u0438\\u0442\\u0435 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438\n\n#XFLD,20: Information "Filtered By: [value]" displayed in the master list information bar\nFILTERED_BY=\\u0424\\u0438\\u043B\\u0442\\u0440\\u0438\\u0440\\u0430\\u043D \\u043F\\u043E\\: {0}\n\n#XFLD,20: Placeholder for the select account input\nSELECT_ACCOUNT=\\u0418\\u0437\\u0431\\u043E\\u0440 \\u043D\\u0430 \\u0430\\u043A\\u0430\\u0443\\u043D\\u0442\n\n#XFLD,20: Placeholder for the search in the select account dialog\nSEARCH=\\u0422\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435\n\n#XFLD,20: No Data text after loading/searching list\nNO_DATA_TEXT=\\u041D\\u044F\\u043C\\u0430 \\u0434\\u0430\\u043D\\u043D\\u0438\n\n#XFLD,20: No Data text when loading/searching list\nLOADING_TEXT=\\u0417\\u0430\\u0440\\u0435\\u0436\\u0434\\u0430\\u043D\\u0435...\n\n# XMSG: message that will be displayed in case of conflicting data during account editing\nMSG_CONFLICTING_DATA=\\u0414\\u0430\\u043D\\u043D\\u0438\\u0442\\u0435 \\u0441\\u0430 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438 \\u043E\\u0442 \\u0434\\u0440\\u0443\\u0433 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B. \\u0416\\u0435\\u043B\\u0430\\u0435\\u0442\\u0435 \\u043B\\u0438 \\u0434\\u0430 \\u043F\\u0440\\u0435\\u0437\\u0430\\u043F\\u0438\\u0448\\u0435\\u0442\\u0435 \\u043D\\u0435\\u0433\\u043E\\u0432\\u0438\\u0442\\u0435 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438 \\u0441 \\u0432\\u0430\\u0448\\u0438\\u0442\\u0435?\n\n# XMSG: message that will be displayed in case of conflicts during file renaming\nMSG_CONFLICTING_FILE_NAME=\\u0418\\u043C\\u0435\\u0442\\u043E \\u043D\\u0430 \\u0444\\u0430\\u0439\\u043B\\u0430 \\u0435 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0435\\u043D\\u043E \\u043E\\u0442 \\u0434\\u0440\\u0443\\u0433 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B. \\u0416\\u0435\\u043B\\u0430\\u0435\\u0442\\u0435 \\u043B\\u0438 \\u0434\\u0430 \\u043F\\u0440\\u0435\\u0437\\u0430\\u043F\\u0438\\u0448\\u0435\\u0442\\u0435 \\u043D\\u0435\\u0433\\u043E\\u0432\\u0438\\u0442\\u0435 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438 \\u0441 \\u0432\\u0430\\u0448\\u0438\\u0442\\u0435?\n',
	"cus/crm/mycontacts/i18n/i18n_cs.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT,20: this is the title for the master section when "All Contacts" are displayed\r\nMASTER_TITLE=V\\u0161echny kontakty ({0})\r\n\r\n#XTIT,20: this is the title for the master section when "My Contacts" are displayed\r\nMASTER_TITLE_FOR_MY_CONTACTS=Moje kontakty ({0})\r\n\r\n#XTIT,20 : this is the title for the detail section\r\nDETAIL_TITLE=Kontakt\r\n\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Sem vlo\\u017Ete sv\\u00E9 ovl\\u00E1dac\\u00ED prvky\r\n\r\n#XFLD,20: All contacts for filter\r\nALL_CONTACTS=V\\u0161echny kontakty\r\n\r\n#XFLD,30: My contacts for filter\r\nMY_CONTACTS=Moje kontakty\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=Kontakty\r\n\r\n# XFLD,40: Spinning wheel text\r\nMASTER_BUSY_TEXT=Na\\u010D\\u00EDt\\u00E1n\\u00ED kontakt\\u016F...\r\n\r\n# XFLD,40: Text in result list if no entries exist\r\nMASTER_LIST_NODATA=Nebyly nalezeny \\u017E\\u00E1dn\\u00E9 kontakty\r\n\r\n# XFLD,20: Search default test\r\nMASTER_SEARCH_PLACEHOLDER=Hledat\r\n\r\n# XTOL,50: Search default test\r\nMASTER_SEARCH_TOOLTIP=Hledat kontakty\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE1=Kontakty\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE2=Moje kontakty\r\n\r\n# XTIT,50: Detail View title name\r\nDETAILS_TITLE=Kontakt\r\n\r\n# XFLD,20: Contact Detail field for E-Mail\r\nCONTACT_EMAIL=E-mail\r\n\r\n# XFLD,20: Contact Detail field for Mobile Phone\r\nCONTACT_MOBILE_PHONE=Mobiln\\u00ED telefon\r\n\r\n# XFLD,20: Contact Detail field for Phone\r\nCONTACT_PHONE=Telefon\r\n\r\n# XFLD,20: Contact Detail field for Company\r\nCONTACT_ACCOUNT=Z\\u00E1kazn\\u00EDk\r\n\r\n# XFLD,20: Contact Detail field for Job Function\r\nCONTACT_FUNCTION=Funkce\r\n\r\n# XFLD,20: Contact Detail field for First Name\r\nCONTACT_FIRST_NAME=K\\u0159estn\\u00ED jm\\u00E9no\r\n\r\n# XFLD,20: Contact Detail field for Last Name\r\nCONTACT_LAST_NAME=P\\u0159\\u00EDjmen\\u00ED\r\n\r\n# XFLD,20: Contact Detail field for Postal Code\r\nCONTACT_POSTAL_CODE=PS\\u010C\r\n\r\n# XFLD,20: Contact Detail field for Address\r\nCONTACT_ADDRESS=Adresa\r\n\r\n# XTIT,50: Edit Detail View title name\r\nEDIT_DETAILS_TITLE=Upravit kontakt\r\n\r\n# XTIT,50: Contact Detail View title name\r\nCONTACT_DETAILS_TITLE=Detaily kontaktu\r\n\r\n#XBUT,20\r\nS3_EDIT=Upravit\r\n\r\n#XBUT,20\r\nS4_SAVE=Ulo\\u017Eit\r\n\r\n#XBUT,20\r\nS4_CANCEL=Zru\\u0161it\r\n\r\n# XTIT,50: New contact title\r\nNEW_CONTACT=Nov\\u00FD kontakt\r\n\r\n# XTIT,50: Edit contact title\r\nEDIT_CONTACT=Upravit kontakt\r\n\r\n# XTIT,60: Shows which contact is the Main Contact\r\nMAIN_CONTACT=Hlavn\\u00ED kontakt\r\n\r\n# XFLD,20: Contact Detail field for Birthday\r\nCONTACT_BIRTHDAY=Datum narozen\\u00ED\r\n\r\n# XFLD,20: Contact Detail field for Note\r\nCONTACT_NOTE=Pozn\\u00E1mka\r\n\r\n# XFLD,20: Contact Detail field for Job Department\r\nCONTACT_DEPARTMENT=Odd\\u011Blen\\u00ED\r\n\r\n# XFLD,20: Contact Detail field for Contact Title\r\nCONTACT_TITLE=N\\u00E1zev\r\n\r\n#XTIT,20: W7: Title of pop-up used in confirm popup\r\nCONFIRM_TITLE=Potvrzen\\u00ED\r\n\r\n# XFLD,20: Contact Detail field for  Academic Title\r\nCONTACT_ACADEMIC_TITLE=Akademick\\u00FD titul\r\n\r\n# XMSG : Contact creation succeeded\r\nCREATION_SUCCESS=Kontakt vytvo\\u0159en\r\n\r\n# XMSG : Contact creation failed\r\nCREATION_ERROR=Vytvo\\u0159en\\u00ED se nezda\\u0159ilo\r\n\r\n# XMSG : Contact creation succeeded\r\nUPDATE_SUCCESS=Kontakt byl aktualizov\\u00E1n\r\n\r\n# XMSG : Contact creation failed\r\nUPDATE_ERROR=Aktualizace se nezda\\u0159ila\r\n\r\n# XMSG : Contact creation : nothing has been changed\r\nNO_CHANGE=Nebyly provedeny \\u017E\\u00E1dn\\u00E9 zm\\u011Bny\r\n\r\n# XMSG: message that will be displayed, if not all mandatory fields are not filled\r\nMSG_MANDATORY_FIELDS=V\\u0161echna povinn\\u00E1 pole nejsou vypln\\u011Bna.\r\n\r\n# XMSG : Photo update failed\r\nUPDATE_PHOTO_ERROR=Nepoda\\u0159ilo se aktualizovat fotografii\r\n\r\n\r\n# XBUT,10: OK\r\nOK=OK\r\n\r\n# XMSG: Cancel confirmation\r\nCONFIRM_CANCEL=V\\u0161echny neulo\\u017Een\\u00E9 zm\\u011Bny budou ztraceny. Chcete pokra\\u010Dovat?\r\n\r\n# XBUT,30: Add photo\r\nADD_PHOTO=P\\u0159idat fotografii\r\n\r\n#XMSG\r\nNO_ITEMS_AVAILABLE=V sou\\u010Dasn\\u00E9 dob\\u011B nejsou k dispozici \\u017E\\u00E1dn\\u00E9 polo\\u017Eky\r\n\r\n# XBUT,30: add field\r\nADD_FIELD=P\\u0159idat pole\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_ALL_CONTACTS=Filtrov\\u00E1no podle\\: v\\u0161echny kontakty\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_MY_CONTACTS=Filtrov\\u00E1no podle\\: moje kontakty\r\n\r\n#XFLD,20: Information "Filtered By: [value]" displayed in the master list information bar\r\nFILTERED_BY=Filtrov\\u00E1no podle\\: {0}\r\n\r\n#XFLD,20: Placeholder for the select account input\r\nSELECT_ACCOUNT=Vybrat \\u00FA\\u010Det\r\n\r\n#XFLD,20: Placeholder for the search in the select account dialog\r\nSEARCH=Hledat\r\n\r\n#XFLD,20: No Data text after loading/searching list\r\nNO_DATA_TEXT=Chyb\\u00ED data\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=Zav\\u00E1d\\u00ED se...\r\n\r\n# XMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Data zm\\u011Bnil jin\\u00FD u\\u017Eivatel. Chcete p\\u0159epsat zm\\u011Bny jin\\u00E9ho u\\u017Eivatele vlastn\\u00EDmi?\r\n\r\n# XMSG: message that will be displayed in case of conflicts during file renaming\r\nMSG_CONFLICTING_FILE_NAME=N\\u00E1zev souboru zm\\u011Bnil jin\\u00FD u\\u017Eivatel. Chcete p\\u0159epsat zm\\u011Bny jin\\u00E9ho u\\u017Eivatele vlastn\\u00EDmi zm\\u011Bnami?\r\n',
	"cus/crm/mycontacts/i18n/i18n_de.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT,20: this is the title for the master section when "All Contacts" are displayed\r\nMASTER_TITLE=Alle Ansprechpartner ({0})\r\n\r\n#XTIT,20: this is the title for the master section when "My Contacts" are displayed\r\nMASTER_TITLE_FOR_MY_CONTACTS=Meine Ansprechpartner ({0})\r\n\r\n#XTIT,20 : this is the title for the detail section\r\nDETAIL_TITLE=Ansprechpartner\r\n\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Controls hier einf\\u00FCgen\r\n\r\n#XFLD,20: All contacts for filter\r\nALL_CONTACTS=Alle Ansprechpartner\r\n\r\n#XFLD,30: My contacts for filter\r\nMY_CONTACTS=Meine Ansprechpartner\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=Ansprechpartner\r\n\r\n# XFLD,40: Spinning wheel text\r\nMASTER_BUSY_TEXT=Ansprechpartner werden geladen...\r\n\r\n# XFLD,40: Text in result list if no entries exist\r\nMASTER_LIST_NODATA=Keine Ansprechpartner gefunden\r\n\r\n# XFLD,20: Search default test\r\nMASTER_SEARCH_PLACEHOLDER=Suchen\r\n\r\n# XTOL,50: Search default test\r\nMASTER_SEARCH_TOOLTIP=Ansprechpartner suchen\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE1=Ansprechpartner\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE2=Meine Ansprechpartner\r\n\r\n# XTIT,50: Detail View title name\r\nDETAILS_TITLE=Ansprechpartner\r\n\r\n# XFLD,20: Contact Detail field for E-Mail\r\nCONTACT_EMAIL=E-Mail\r\n\r\n# XFLD,20: Contact Detail field for Mobile Phone\r\nCONTACT_MOBILE_PHONE=Mobil\r\n\r\n# XFLD,20: Contact Detail field for Phone\r\nCONTACT_PHONE=Telefon\r\n\r\n# XFLD,20: Contact Detail field for Company\r\nCONTACT_ACCOUNT=Account\r\n\r\n# XFLD,20: Contact Detail field for Job Function\r\nCONTACT_FUNCTION=Funktion\r\n\r\n# XFLD,20: Contact Detail field for First Name\r\nCONTACT_FIRST_NAME=Vorname\r\n\r\n# XFLD,20: Contact Detail field for Last Name\r\nCONTACT_LAST_NAME=Nachname\r\n\r\n# XFLD,20: Contact Detail field for Postal Code\r\nCONTACT_POSTAL_CODE=Postleitzahl\r\n\r\n# XFLD,20: Contact Detail field for Address\r\nCONTACT_ADDRESS=Adresse\r\n\r\n# XTIT,50: Edit Detail View title name\r\nEDIT_DETAILS_TITLE=Ansprechpartner bearbeiten\r\n\r\n# XTIT,50: Contact Detail View title name\r\nCONTACT_DETAILS_TITLE=Ansprechpartnerdetails\r\n\r\n#XBUT,20\r\nS3_EDIT=Bearbeiten\r\n\r\n#XBUT,20\r\nS4_SAVE=Sichern\r\n\r\n#XBUT,20\r\nS4_CANCEL=Abbrechen\r\n\r\n# XTIT,50: New contact title\r\nNEW_CONTACT=Neuer Ansprechpartner\r\n\r\n# XTIT,50: Edit contact title\r\nEDIT_CONTACT=Ansprechpartner bearbeiten\r\n\r\n# XTIT,60: Shows which contact is the Main Contact\r\nMAIN_CONTACT=Hauptansprechpartner\r\n\r\n# XFLD,20: Contact Detail field for Birthday\r\nCONTACT_BIRTHDAY=Geburtsdatum\r\n\r\n# XFLD,20: Contact Detail field for Note\r\nCONTACT_NOTE=Notiz\r\n\r\n# XFLD,20: Contact Detail field for Job Department\r\nCONTACT_DEPARTMENT=Abteilung\r\n\r\n# XFLD,20: Contact Detail field for Contact Title\r\nCONTACT_TITLE=Anrede\r\n\r\n#XTIT,20: W7: Title of pop-up used in confirm popup\r\nCONFIRM_TITLE=Best\\u00E4tigen\r\n\r\n# XFLD,20: Contact Detail field for  Academic Title\r\nCONTACT_ACADEMIC_TITLE=Akademischer Titel\r\n\r\n# XMSG : Contact creation succeeded\r\nCREATION_SUCCESS=Ansprechpartner angelegt\r\n\r\n# XMSG : Contact creation failed\r\nCREATION_ERROR=Anlegen fehlgeschlagen\r\n\r\n# XMSG : Contact creation succeeded\r\nUPDATE_SUCCESS=Ansprechpartner aktualisiert\r\n\r\n# XMSG : Contact creation failed\r\nUPDATE_ERROR=Aktualisierung fehlgeschlagen\r\n\r\n# XMSG : Contact creation : nothing has been changed\r\nNO_CHANGE=Keine \\u00C4nderungen vorgenommen\r\n\r\n# XMSG: message that will be displayed, if not all mandatory fields are not filled\r\nMSG_MANDATORY_FIELDS=Es sind nicht alle erforderlichen Felder gef\\u00FCllt\r\n\r\n# XMSG : Photo update failed\r\nUPDATE_PHOTO_ERROR=Aktualisierung von Foto fehlgeschlagen\r\n\r\n\r\n# XBUT,10: OK\r\nOK=OK\r\n\r\n# XMSG: Cancel confirmation\r\nCONFIRM_CANCEL=Ungesicherte \\u00C4nderungen gehen verloren. M\\u00F6chten Sie fortfahren?\r\n\r\n# XBUT,30: Add photo\r\nADD_PHOTO=Foto hinzuf\\u00FCgen\r\n\r\n#XMSG\r\nNO_ITEMS_AVAILABLE=Derzeit sind keine Positionen verf\\u00FCgbar\r\n\r\n# XBUT,30: add field\r\nADD_FIELD=Feld hinzuf\\u00FCgen\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_ALL_CONTACTS=Gefiltert nach\\: Alle Ansprechpartner\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_MY_CONTACTS=Gefiltert nach\\: Meine Ansprechpartner\r\n\r\n#XFLD,20: Information "Filtered By: [value]" displayed in the master list information bar\r\nFILTERED_BY=Gefiltert nach\\: {0}\r\n\r\n#XFLD,20: Placeholder for the select account input\r\nSELECT_ACCOUNT=Account ausw\\u00E4hlen\r\n\r\n#XFLD,20: Placeholder for the search in the select account dialog\r\nSEARCH=Suchen\r\n\r\n#XFLD,20: No Data text after loading/searching list\r\nNO_DATA_TEXT=Keine Daten\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=Ladevorgang l\\u00E4uft...\r\n\r\n# XMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Daten wurden von einem anderen Benutzer ge\\u00E4ndert. M\\u00F6chten Sie die \\u00C4nderungen des anderen Benutzers mit Ihren \\u00C4nderungen \\u00FCberschreiben?\r\n\r\n# XMSG: message that will be displayed in case of conflicts during file renaming\r\nMSG_CONFLICTING_FILE_NAME=Der Dateiname wurde von einem anderen Benutzer ge\\u00E4ndert. M\\u00F6chten Sie die \\u00C4nderungen des anderen Benutzers mit Ihren \\u00C4nderungen \\u00FCberschreiben?\r\n',
	"cus/crm/mycontacts/i18n/i18n_en.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT,20: this is the title for the master section when "All Contacts" are displayed\r\nMASTER_TITLE=All Contacts ({0})\r\n\r\n#XTIT,20: this is the title for the master section when "My Contacts" are displayed\r\nMASTER_TITLE_FOR_MY_CONTACTS=My Contacts ({0})\r\n\r\n#XTIT,20 : this is the title for the detail section\r\nDETAIL_TITLE=Contact\r\n\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Insert your controls here\r\n\r\n#XFLD,20: All contacts for filter\r\nALL_CONTACTS=All Contacts\r\n\r\n#XFLD,30: My contacts for filter\r\nMY_CONTACTS=My Contacts\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=Contacts\r\n\r\n# XFLD,40: Spinning wheel text\r\nMASTER_BUSY_TEXT=Loading contacts...\r\n\r\n# XFLD,40: Text in result list if no entries exist\r\nMASTER_LIST_NODATA=No contacts found\r\n\r\n# XFLD,20: Search default test\r\nMASTER_SEARCH_PLACEHOLDER=Search\r\n\r\n# XTOL,50: Search default test\r\nMASTER_SEARCH_TOOLTIP=Search for Contacts\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE1=Contacts\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE2=My Contacts\r\n\r\n# XTIT,50: Detail View title name\r\nDETAILS_TITLE=Contact\r\n\r\n# XFLD,20: Contact Detail field for E-Mail\r\nCONTACT_EMAIL=Email\r\n\r\n# XFLD,20: Contact Detail field for Mobile Phone\r\nCONTACT_MOBILE_PHONE=Mobile\r\n\r\n# XFLD,20: Contact Detail field for Phone\r\nCONTACT_PHONE=Phone\r\n\r\n# XFLD,20: Contact Detail field for Company\r\nCONTACT_ACCOUNT=Account\r\n\r\n# XFLD,20: Contact Detail field for Job Function\r\nCONTACT_FUNCTION=Function\r\n\r\n# XFLD,20: Contact Detail field for First Name\r\nCONTACT_FIRST_NAME=First Name\r\n\r\n# XFLD,20: Contact Detail field for Last Name\r\nCONTACT_LAST_NAME=Last Name\r\n\r\n# XFLD,20: Contact Detail field for Postal Code\r\nCONTACT_POSTAL_CODE=Postal Code\r\n\r\n# XFLD,20: Contact Detail field for Address\r\nCONTACT_ADDRESS=Address\r\n\r\n# XTIT,50: Edit Detail View title name\r\nEDIT_DETAILS_TITLE=Edit Contact\r\n\r\n# XTIT,50: Contact Detail View title name\r\nCONTACT_DETAILS_TITLE=Contact Details\r\n\r\n#XBUT,20\r\nS3_EDIT=Edit\r\n\r\n#XBUT,20\r\nS4_SAVE=Save\r\n\r\n#XBUT,20\r\nS4_CANCEL=Cancel\r\n\r\n# XTIT,50: New contact title\r\nNEW_CONTACT=New Contact\r\n\r\n# XTIT,50: Edit contact title\r\nEDIT_CONTACT=Edit Contact\r\n\r\n# XTIT,60: Shows which contact is the Main Contact\r\nMAIN_CONTACT=Main Contact\r\n\r\n# XFLD,20: Contact Detail field for Birthday\r\nCONTACT_BIRTHDAY=Date of Birth\r\n\r\n# XFLD,20: Contact Detail field for Note\r\nCONTACT_NOTE=Note\r\n\r\n# XFLD,20: Contact Detail field for Job Department\r\nCONTACT_DEPARTMENT=Department\r\n\r\n# XFLD,20: Contact Detail field for Contact Title\r\nCONTACT_TITLE=Title\r\n\r\n#XTIT,20: W7: Title of pop-up used in confirm popup\r\nCONFIRM_TITLE=Confirm\r\n\r\n# XFLD,20: Contact Detail field for  Academic Title\r\nCONTACT_ACADEMIC_TITLE=Academic Title\r\n\r\n# XMSG : Contact creation succeeded\r\nCREATION_SUCCESS=Contact created\r\n\r\n# XMSG : Contact creation failed\r\nCREATION_ERROR=Creation failed\r\n\r\n# XMSG : Contact creation succeeded\r\nUPDATE_SUCCESS=Contact updated\r\n\r\n# XMSG : Contact creation failed\r\nUPDATE_ERROR=Update failed\r\n\r\n# XMSG : Contact creation : nothing has been changed\r\nNO_CHANGE=No changes made\r\n\r\n# XMSG: message that will be displayed, if not all mandatory fields are not filled\r\nMSG_MANDATORY_FIELDS=Not all mandatory fields are filled\r\n\r\n# XMSG : Photo update failed\r\nUPDATE_PHOTO_ERROR=Update of photo failed\r\n\r\n\r\n# XBUT,10: OK\r\nOK=OK\r\n\r\n# XMSG: Cancel confirmation\r\nCONFIRM_CANCEL=Any unsaved changes will be lost. Do you want to continue?\r\n\r\n# XBUT,30: Add photo\r\nADD_PHOTO=Add Photo\r\n\r\n#XMSG\r\nNO_ITEMS_AVAILABLE=No items are currently available\r\n\r\n# XBUT,30: add field\r\nADD_FIELD=Add Field\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_ALL_CONTACTS=Filtered By\\: All Contacts\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_MY_CONTACTS=Filtered By\\: My Contacts\r\n\r\n#XFLD,20: Information "Filtered By: [value]" displayed in the master list information bar\r\nFILTERED_BY=Filtered By\\: {0}\r\n\r\n#XFLD,20: Placeholder for the select account input\r\nSELECT_ACCOUNT=Select account\r\n\r\n#XFLD,20: Placeholder for the search in the select account dialog\r\nSEARCH=Search\r\n\r\n#XFLD,20: No Data text after loading/searching list\r\nNO_DATA_TEXT=No data\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=Loading...\r\n\r\n# XMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Data has been changed by another user. Do you want to overwrite the other user\'s changes with your own?\r\n\r\n# XMSG: message that will be displayed in case of conflicts during file renaming\r\nMSG_CONFLICTING_FILE_NAME=The file name has been changed by another user. Do you want to overwrite the other user\'s changes with your own?\r\n',
	"cus/crm/mycontacts/i18n/i18n_en_US_sappsd.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT,20: this is the title for the master section when "All Contacts" are displayed\r\nMASTER_TITLE=[[[\\u0100\\u013A\\u013A \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163\\u015F ({0})]]]\r\n\r\n#XTIT,20: this is the title for the master section when "My Contacts" are displayed\r\nMASTER_TITLE_FOR_MY_CONTACTS=[[[\\u039C\\u0177 \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163\\u015F ({0})]]]\r\n\r\n#XTIT,20 : this is the title for the detail section\r\nDETAIL_TITLE=[[[\\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163]]]\r\n\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=[[[\\u012C\\u014B\\u015F\\u0113\\u0157\\u0163 \\u0177\\u014F\\u0171\\u0157 \\u010B\\u014F\\u014B\\u0163\\u0157\\u014F\\u013A\\u015F \\u0125\\u0113\\u0157\\u0113...]]]\r\n\r\n#XFLD,20: All contacts for filter\r\nALL_CONTACTS=[[[\\u0100\\u013A\\u013A \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163\\u015F]]]\r\n\r\n#XFLD,30: My contacts for filter\r\nMY_CONTACTS=[[[\\u039C\\u0177 \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163\\u015F]]]\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=[[[\\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163\\u015F]]]\r\n\r\n# XFLD,40: Spinning wheel text\r\nMASTER_BUSY_TEXT=[[[\\u013B\\u014F\\u0105\\u018C\\u012F\\u014B\\u011F \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163\\u015F ...]]]\r\n\r\n# XFLD,40: Text in result list if no entries exist\r\nMASTER_LIST_NODATA=[[[\\u0143\\u014F \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163\\u015F \\u0192\\u014F\\u0171\\u014B\\u018C]]]\r\n\r\n# XFLD,20: Search default test\r\nMASTER_SEARCH_PLACEHOLDER=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125 ...]]]\r\n\r\n# XTOL,50: Search default test\r\nMASTER_SEARCH_TOOLTIP=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125 \\u0192\\u014F\\u0157 \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163\\u015F]]]\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE1=[[[\\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163\\u015F]]]\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE2=[[[\\u039C\\u0177 \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163\\u015F]]]\r\n\r\n# XTIT,50: Detail View title name\r\nDETAILS_TITLE=[[[\\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163]]]\r\n\r\n# XFLD,20: Contact Detail field for E-Mail\r\nCONTACT_EMAIL=[[[\\u0114-\\u039C\\u0105\\u012F\\u013A]]]\r\n\r\n# XFLD,20: Contact Detail field for Mobile Phone\r\nCONTACT_MOBILE_PHONE=[[[\\u039C\\u014F\\u0183\\u012F\\u013A\\u0113]]]\r\n\r\n# XFLD,20: Contact Detail field for Phone\r\nCONTACT_PHONE=[[[\\u01A4\\u0125\\u014F\\u014B\\u0113]]]\r\n\r\n# XFLD,20: Contact Detail field for Company\r\nCONTACT_ACCOUNT=[[[\\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163]]]\r\n\r\n# XFLD,20: Contact Detail field for Job Function\r\nCONTACT_FUNCTION=[[[\\u0191\\u0171\\u014B\\u010B\\u0163\\u012F\\u014F\\u014B]]]\r\n\r\n# XFLD,20: Contact Detail field for First Name\r\nCONTACT_FIRST_NAME=[[[\\u0191\\u012F\\u0157\\u015F\\u0163 \\u0143\\u0105\\u0271\\u0113]]]\r\n\r\n# XFLD,20: Contact Detail field for Last Name\r\nCONTACT_LAST_NAME=[[[\\u013B\\u0105\\u015F\\u0163 \\u0143\\u0105\\u0271\\u0113]]]\r\n\r\n# XFLD,20: Contact Detail field for Postal Code\r\nCONTACT_POSTAL_CODE=[[[\\u01A4\\u014F\\u015F\\u0163\\u0105\\u013A \\u0108\\u014F\\u018C\\u0113]]]\r\n\r\n# XFLD,20: Contact Detail field for Address\r\nCONTACT_ADDRESS=[[[\\u0100\\u018C\\u018C\\u0157\\u0113\\u015F\\u015F]]]\r\n\r\n# XTIT,50: Edit Detail View title name\r\nEDIT_DETAILS_TITLE=[[[\\u0114\\u018C\\u012F\\u0163 \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163]]]\r\n\r\n# XTIT,50: Contact Detail View title name\r\nCONTACT_DETAILS_TITLE=[[[\\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F]]]\r\n\r\n#XBUT,20\r\nS3_EDIT=[[[\\u0114\\u018C\\u012F\\u0163]]]\r\n\r\n#XBUT,20\r\nS4_SAVE=[[[\\u015C\\u0105\\u028B\\u0113]]]\r\n\r\n#XBUT,20\r\nS4_CANCEL=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A]]]\r\n\r\n# XTIT,50: New contact title\r\nNEW_CONTACT=[[[\\u0143\\u0113\\u0175 \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163]]]\r\n\r\n# XTIT,50: Edit contact title\r\nEDIT_CONTACT=[[[\\u0114\\u018C\\u012F\\u0163 \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163]]]\r\n\r\n# XTIT,60: Shows which contact is the Main Contact\r\nMAIN_CONTACT=[[[\\u039C\\u0105\\u012F\\u014B \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163]]]\r\n\r\n# XFLD,20: Contact Detail field for Birthday\r\nCONTACT_BIRTHDAY=[[[\\u0181\\u012F\\u0157\\u0163\\u0125\\u018C\\u0105\\u0177]]]\r\n\r\n# XFLD,20: Contact Detail field for Note\r\nCONTACT_NOTE=[[[\\u0143\\u014F\\u0163\\u0113]]]\r\n\r\n# XFLD,20: Contact Detail field for Job Department\r\nCONTACT_DEPARTMENT=[[[\\u010E\\u0113\\u03C1\\u0105\\u0157\\u0163\\u0271\\u0113\\u014B\\u0163]]]\r\n\r\n# XFLD,20: Contact Detail field for Contact Title\r\nCONTACT_TITLE=[[[\\u0162\\u012F\\u0163\\u013A\\u0113]]]\r\n\r\n#XTIT,20: W7: Title of pop-up used in confirm popup\r\nCONFIRM_TITLE=[[[\\u0108\\u014F\\u014B\\u0192\\u012F\\u0157\\u0271]]]\r\n\r\n# XFLD,20: Contact Detail field for  Academic Title\r\nCONTACT_ACADEMIC_TITLE=[[[\\u0100\\u010B\\u0105\\u018C\\u0113\\u0271\\u012F\\u010B \\u0162\\u012F\\u0163\\u013A\\u0113]]]\r\n\r\n# XMSG : Contact creation succeeded\r\nCREATION_SUCCESS=[[[\\u0162\\u0125\\u0113 \\u010B\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163 \\u0125\\u0105\\u015F \\u0183\\u0113\\u0113\\u014B \\u010B\\u0157\\u0113\\u0105\\u0163\\u0113\\u018C.]]]\r\n\r\n# XMSG : Contact creation failed\r\nCREATION_ERROR=[[[\\u0162\\u0125\\u0113 \\u010B\\u0157\\u0113\\u0105\\u0163\\u012F\\u014F\\u014B \\u0192\\u0105\\u012F\\u013A\\u0113\\u018C.]]]\r\n\r\n# XMSG : Contact creation succeeded\r\nUPDATE_SUCCESS=[[[\\u0162\\u0125\\u0113 \\u010B\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163 \\u0125\\u0105\\u015F \\u0183\\u0113\\u0113\\u014B \\u0171\\u03C1\\u018C\\u0105\\u0163\\u0113\\u018C.]]]\r\n\r\n# XMSG : Contact creation failed\r\nUPDATE_ERROR=[[[\\u0162\\u0125\\u0113 \\u0171\\u03C1\\u018C\\u0105\\u0163\\u0113 \\u0192\\u0105\\u012F\\u013A\\u0113\\u018C.]]]\r\n\r\n# XMSG : Contact creation : nothing has been changed\r\nNO_CHANGE=[[[\\u0143\\u014F \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F \\u0271\\u0105\\u018C\\u0113]]]\r\n\r\n# XMSG: message that will be displayed, if not all mandatory fields are not filled\r\nMSG_MANDATORY_FIELDS=[[[\\u0143\\u014F\\u0163 \\u0105\\u013A\\u013A \\u0271\\u0105\\u014B\\u018C\\u0105\\u0163\\u014F\\u0157\\u0177 \\u0192\\u012F\\u0113\\u013A\\u018C\\u015F \\u0105\\u0157\\u0113 \\u0192\\u012F\\u013A\\u013A\\u0113\\u018C.]]]\r\n\r\n# XMSG : Photo update failed\r\nUPDATE_PHOTO_ERROR=[[[\\u0162\\u0125\\u0113 \\u03C1\\u0125\\u014F\\u0163\\u014F\'\\u015F \\u0171\\u03C1\\u018C\\u0105\\u0163\\u0113 \\u0192\\u0105\\u012F\\u013A\\u0113\\u018C.]]]\r\n\r\n\r\n# XBUT,10: OK\r\nOK=[[[\\u014E\\u0136]]]\r\n\r\n# XMSG: Cancel confirmation\r\nCONFIRM_CANCEL=[[[\\u013B\\u0113\\u0105\\u028B\\u0113 \\u0163\\u0125\\u012F\\u015F \\u03C1\\u0105\\u011F\\u0113 \\u0175\\u012F\\u0163\\u0125\\u014F\\u0171\\u0163 \\u015F\\u0105\\u028B\\u012F\\u014B\\u011F \\u0163\\u0125\\u0113 \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F \\u0177\\u014F\\u0171 \\u0271\\u0105\\u0177 \\u0125\\u0105\\u028B\\u0113 \\u0271\\u0105\\u018C\\u0113?]]]\r\n\r\n# XBUT,30: Add photo\r\nADD_PHOTO=[[[\\u0100\\u018C\\u018C \\u01A4\\u0125\\u014F\\u0163\\u014F]]]\r\n\r\n#XMSG\r\nNO_ITEMS_AVAILABLE=[[[\\u0143\\u014F \\u012F\\u0163\\u0113\\u0271\\u015F \\u0105\\u0157\\u0113 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163\\u013A\\u0177 \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113]]]\r\n\r\n# XBUT,30: add field\r\nADD_FIELD=[[[\\u0100\\u018C\\u018C \\u0191\\u012F\\u0113\\u013A\\u018C]]]\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_ALL_CONTACTS=[[[\\u0191\\u012F\\u013A\\u0163\\u0113\\u0157\\u0113\\u018C \\u0181\\u0177\\: \\u0100\\u013A\\u013A \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163\\u015F]]]\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_MY_CONTACTS=[[[\\u0191\\u012F\\u013A\\u0163\\u0113\\u0157\\u0113\\u018C \\u0181\\u0177\\: \\u039C\\u0177 \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163\\u015F]]]\r\n\r\n#XFLD,20: Information "Filtered By: [value]" displayed in the master list information bar\r\nFILTERED_BY=[[[\\u0191\\u012F\\u013A\\u0163\\u0113\\u0157\\u0113\\u018C \\u0181\\u0177\\: ]]]{0}\r\n\r\n#XFLD,20: Placeholder for the select account input\r\nSELECT_ACCOUNT=[[[\\u015C\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163]]]\r\n\r\n#XFLD,20: Placeholder for the search in the select account dialog\r\nSEARCH=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125]]]\r\n\r\n#XFLD,20: No Data text after loading/searching list\r\nNO_DATA_TEXT=[[[\\u0143\\u014F \\u010E\\u0105\\u0163\\u0105]]]\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=[[[\\u013B\\u014F\\u0105\\u018C\\u012F\\u014B\\u011F....]]]\r\n\r\n# XMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=[[[\\u010E\\u0105\\u0163\\u0105 \\u0125\\u0105\\u015F \\u0183\\u0113\\u0113\\u014B \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u018C \\u0183\\u0177 \\u0105\\u014B\\u014F\\u0163\\u0125\\u0113\\u0157 \\u0171\\u015F\\u0113\\u0157. \\u010E\\u014F \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u014F\\u028B\\u0113\\u0157\\u0175\\u0157\\u012F\\u0163\\u0113 \\u0163\\u0125\\u0113 \\u014F\\u0163\\u0125\\u0113\\u0157 \\u0171\\u015F\\u0113\\u0157\'\\u015F \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F \\u0175\\u012F\\u0163\\u0125 \\u0177\\u014F\\u0171\\u0157 \\u014F\\u0175\\u014B?]]]\r\n\r\n# XMSG: message that will be displayed in case of conflicts during file renaming\r\nMSG_CONFLICTING_FILE_NAME=[[[\\u0162\\u0125\\u0113 \\u0192\\u012F\\u013A\\u0113 \\u014B\\u0105\\u0271\\u0113 \\u0125\\u0105\\u015F \\u0183\\u0113\\u0113\\u014B \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u018C \\u0183\\u0177 \\u0105\\u014B\\u014F\\u0163\\u0125\\u0113\\u0157 \\u0171\\u015F\\u0113\\u0157. \\u010E\\u014F \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u014F\\u028B\\u0113\\u0157\\u0175\\u0157\\u012F\\u0163\\u0113 \\u0163\\u0125\\u0113 \\u014F\\u0163\\u0125\\u0113\\u0157 \\u0171\\u015F\\u0113\\u0157\'\\u015F \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F \\u0175\\u012F\\u0163\\u0125 \\u0177\\u014F\\u0171\\u0157 \\u014F\\u0175\\u014B?]]]\r\n',
	"cus/crm/mycontacts/i18n/i18n_en_US_saptrc.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT,20: this is the title for the master section when "All Contacts" are displayed\r\nMASTER_TITLE=H4MbU5N7vG/icsbmyxOsXg_All Contacts ({0})\r\n\r\n#XTIT,20: this is the title for the master section when "My Contacts" are displayed\r\nMASTER_TITLE_FOR_MY_CONTACTS=reGUVBQQfqGaBAvx1qYRog_My Contacts ({0})\r\n\r\n#XTIT,20 : this is the title for the detail section\r\nDETAIL_TITLE=Pbq1noyHfFXfQEnyrNOprA_Contact\r\n\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Sw66QwP1blRRXtVth5G2cw_Insert your controls here...\r\n\r\n#XFLD,20: All contacts for filter\r\nALL_CONTACTS=1+p9RSmKHvl/5X8ckalmWQ_All Contacts\r\n\r\n#XFLD,30: My contacts for filter\r\nMY_CONTACTS=R9VLRsQcqu6gOrbcViHoTw_My Contacts\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=rWw9ayqx1zY6uJdZAA6oCA_Contacts\r\n\r\n# XFLD,40: Spinning wheel text\r\nMASTER_BUSY_TEXT=YGNSbjOdiaMCX4gW0JYswQ_Loading Contacts ...\r\n\r\n# XFLD,40: Text in result list if no entries exist\r\nMASTER_LIST_NODATA=98eIa9ndJhUqiVnlhgvpPw_No Contacts found\r\n\r\n# XFLD,20: Search default test\r\nMASTER_SEARCH_PLACEHOLDER=scblGBjLtY0PAHK0RKG5HA_Search ...\r\n\r\n# XTOL,50: Search default test\r\nMASTER_SEARCH_TOOLTIP=mLntVY3IGZXxsLsKWNKwEA_Search for Contacts\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE1=c2bp7WtNaCNqBGLsqPecmA_Contacts\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE2=58ZQadz/cZoFShM7FFiVFg_My Contacts\r\n\r\n# XTIT,50: Detail View title name\r\nDETAILS_TITLE=40YAZpLVZaHUWH/1D4GY7A_Contact\r\n\r\n# XFLD,20: Contact Detail field for E-Mail\r\nCONTACT_EMAIL=aWCaWLLhacG0rtP1NVBMqQ_E-Mail\r\n\r\n# XFLD,20: Contact Detail field for Mobile Phone\r\nCONTACT_MOBILE_PHONE=2BTRLaA+gp2LDeUQq8Z8rg_Mobile\r\n\r\n# XFLD,20: Contact Detail field for Phone\r\nCONTACT_PHONE=ZGrDvHZAEh8NK2byIwHAfA_Phone\r\n\r\n# XFLD,20: Contact Detail field for Company\r\nCONTACT_ACCOUNT=02r2faa3Ag8mfNil1cugKA_Account\r\n\r\n# XFLD,20: Contact Detail field for Job Function\r\nCONTACT_FUNCTION=R89i48SF6vK734V801Y9AQ_Function\r\n\r\n# XFLD,20: Contact Detail field for First Name\r\nCONTACT_FIRST_NAME=YEObFGjHXEDMzYrPgWHHBA_First Name\r\n\r\n# XFLD,20: Contact Detail field for Last Name\r\nCONTACT_LAST_NAME=74o3v0oOC/E187CVTNMJMQ_Last Name\r\n\r\n# XFLD,20: Contact Detail field for Postal Code\r\nCONTACT_POSTAL_CODE=/jRk2BNkJlPSM5nRPT/xQg_Postal Code\r\n\r\n# XFLD,20: Contact Detail field for Address\r\nCONTACT_ADDRESS=GgkFn/fFnlkpLgZM6i6rvA_Address\r\n\r\n# XTIT,50: Edit Detail View title name\r\nEDIT_DETAILS_TITLE=shM/oxK+itYFourlRvc/og_Edit Contact\r\n\r\n# XTIT,50: Contact Detail View title name\r\nCONTACT_DETAILS_TITLE=L0B9DOvq7RJpsgw23c97xA_Contact Details\r\n\r\n#XBUT,20\r\nS3_EDIT=ufYHmlPvS5ARxbFI3S6tyw_Edit\r\n\r\n#XBUT,20\r\nS4_SAVE=eP1auc2QUBMlVr35ZPgSvg_Save\r\n\r\n#XBUT,20\r\nS4_CANCEL=dODIC2o5OEpVSKvynyR1Rg_Cancel\r\n\r\n# XTIT,50: New contact title\r\nNEW_CONTACT=5EHEAI9IiIqsrGru6Xf5Nw_New Contact\r\n\r\n# XTIT,50: Edit contact title\r\nEDIT_CONTACT=bzm77apxeBQhQtVgUu+k/Q_Edit Contact\r\n\r\n# XTIT,60: Shows which contact is the Main Contact\r\nMAIN_CONTACT=Qm3QWHuSyrYsKohhhRWZqw_Main Contact\r\n\r\n# XFLD,20: Contact Detail field for Birthday\r\nCONTACT_BIRTHDAY=c4cVS9nHgAVHLl8+sqUojA_Birthday\r\n\r\n# XFLD,20: Contact Detail field for Note\r\nCONTACT_NOTE=1oawzW1ucfguHxLJe0NF5w_Note\r\n\r\n# XFLD,20: Contact Detail field for Job Department\r\nCONTACT_DEPARTMENT=d99ei5Jgt5QUp3omKn1aXA_Department\r\n\r\n# XFLD,20: Contact Detail field for Contact Title\r\nCONTACT_TITLE=AyaOYK1wmgEfkFAUdJUr7g_Title\r\n\r\n#XTIT,20: W7: Title of pop-up used in confirm popup\r\nCONFIRM_TITLE=4xFy3H7tV5l3uYOvtgwPtg_Confirm\r\n\r\n# XFLD,20: Contact Detail field for  Academic Title\r\nCONTACT_ACADEMIC_TITLE=V1ybibnKIYYOKsl/o9rAxA_Academic Title\r\n\r\n# XMSG : Contact creation succeeded\r\nCREATION_SUCCESS=cfI+YKTdCwNaKx5y35vacw_The contact has been created.\r\n\r\n# XMSG : Contact creation failed\r\nCREATION_ERROR=Mo6KZWgFaCT8MV9bUrA9FQ_The creation failed.\r\n\r\n# XMSG : Contact creation succeeded\r\nUPDATE_SUCCESS=d57Hjx/MZMiub6gJGquGdg_The contact has been updated.\r\n\r\n# XMSG : Contact creation failed\r\nUPDATE_ERROR=ill38xesPH/C9lkKrJC1NA_The update failed.\r\n\r\n# XMSG : Contact creation : nothing has been changed\r\nNO_CHANGE=rn1XDjz8sNp8SuHNYfvnWg_No changes made\r\n\r\n# XMSG: message that will be displayed, if not all mandatory fields are not filled\r\nMSG_MANDATORY_FIELDS=7slzxo5dILJmm3uBg5qIpQ_Not all mandatory fields are filled.\r\n\r\n# XMSG : Photo update failed\r\nUPDATE_PHOTO_ERROR=f576XTznDC//PFRdQGsGMQ_The photo\'s update failed.\r\n\r\n\r\n# XBUT,10: OK\r\nOK=wiy+WHjSOKBdQ6mm5EVsAQ_OK\r\n\r\n# XMSG: Cancel confirmation\r\nCONFIRM_CANCEL=n9B15vDg5kKsFMIclUN6bw_Leave this page without saving the changes you may have made?\r\n\r\n# XBUT,30: Add photo\r\nADD_PHOTO=13siSibRSlwIV53TUyrtRQ_Add Photo\r\n\r\n#XMSG\r\nNO_ITEMS_AVAILABLE=2q5e+5hynbA5J0orIrCKVA_No items are currently available\r\n\r\n# XBUT,30: add field\r\nADD_FIELD=P1xeNqF5lh+X+7SEU6fy1g_Add Field\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_ALL_CONTACTS=qiWTNqRsvipMQUzd439gqQ_Filtered By\\: All Contacts\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_MY_CONTACTS=RISACEpQcmjZXVx2oq45eQ_Filtered By\\: My Contacts\r\n\r\n#XFLD,20: Information "Filtered By: [value]" displayed in the master list information bar\r\nFILTERED_BY=wPiu64pmt+DJzrlbr4HNaQ_Filtered By\\: {0}\r\n\r\n#XFLD,20: Placeholder for the select account input\r\nSELECT_ACCOUNT=eknr/rNSx0YpHCsr7leoPQ_Select Account\r\n\r\n#XFLD,20: Placeholder for the search in the select account dialog\r\nSEARCH=qij+tlN0v60k4rhO4h7uQw_Search\r\n\r\n#XFLD,20: No Data text after loading/searching list\r\nNO_DATA_TEXT=XH8RpSa8F/9bdPHerrtDPA_No Data\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=S+sj01r9VCeqQFuLu1Cftw_Loading....\r\n\r\n# XMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=yyglqgQMjpp8tsex/cT3Uw_Data has been changed by another user. Do you want to overwrite the other user\'s changes with your own?\r\n\r\n# XMSG: message that will be displayed in case of conflicts during file renaming\r\nMSG_CONFLICTING_FILE_NAME=BIfc4/+6+eLFQpXXr0BIow_The file name has been changed by another user. Do you want to overwrite the other user\'s changes with your own?\r\n',
	"cus/crm/mycontacts/i18n/i18n_es.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT,20: this is the title for the master section when "All Contacts" are displayed\r\nMASTER_TITLE=Todos los contactos ({0})\r\n\r\n#XTIT,20: this is the title for the master section when "My Contacts" are displayed\r\nMASTER_TITLE_FOR_MY_CONTACTS=Mis contactos ({0})\r\n\r\n#XTIT,20 : this is the title for the detail section\r\nDETAIL_TITLE=Contacto\r\n\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Inserte sus controles aqu\\u00ED\r\n\r\n#XFLD,20: All contacts for filter\r\nALL_CONTACTS=Todos los contactos\r\n\r\n#XFLD,30: My contacts for filter\r\nMY_CONTACTS=Mis contactos\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=Contactos\r\n\r\n# XFLD,40: Spinning wheel text\r\nMASTER_BUSY_TEXT=Cargando contactos...\r\n\r\n# XFLD,40: Text in result list if no entries exist\r\nMASTER_LIST_NODATA=No hay contactos\r\n\r\n# XFLD,20: Search default test\r\nMASTER_SEARCH_PLACEHOLDER=Buscar\r\n\r\n# XTOL,50: Search default test\r\nMASTER_SEARCH_TOOLTIP=Buscar contactos\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE1=Contactos\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE2=Mis contactos\r\n\r\n# XTIT,50: Detail View title name\r\nDETAILS_TITLE=Contacto\r\n\r\n# XFLD,20: Contact Detail field for E-Mail\r\nCONTACT_EMAIL=E-mail\r\n\r\n# XFLD,20: Contact Detail field for Mobile Phone\r\nCONTACT_MOBILE_PHONE=M\\u00F3vil\r\n\r\n# XFLD,20: Contact Detail field for Phone\r\nCONTACT_PHONE=Tel\\u00E9fono\r\n\r\n# XFLD,20: Contact Detail field for Company\r\nCONTACT_ACCOUNT=Cliente\r\n\r\n# XFLD,20: Contact Detail field for Job Function\r\nCONTACT_FUNCTION=Funci\\u00F3n\r\n\r\n# XFLD,20: Contact Detail field for First Name\r\nCONTACT_FIRST_NAME=Nombre\r\n\r\n# XFLD,20: Contact Detail field for Last Name\r\nCONTACT_LAST_NAME=Apellido\r\n\r\n# XFLD,20: Contact Detail field for Postal Code\r\nCONTACT_POSTAL_CODE=C\\u00F3digo postal\r\n\r\n# XFLD,20: Contact Detail field for Address\r\nCONTACT_ADDRESS=Direcci\\u00F3n\r\n\r\n# XTIT,50: Edit Detail View title name\r\nEDIT_DETAILS_TITLE=Editar contacto\r\n\r\n# XTIT,50: Contact Detail View title name\r\nCONTACT_DETAILS_TITLE=Detalles de contacto\r\n\r\n#XBUT,20\r\nS3_EDIT=Editar\r\n\r\n#XBUT,20\r\nS4_SAVE=Guardar\r\n\r\n#XBUT,20\r\nS4_CANCEL=Cancelar\r\n\r\n# XTIT,50: New contact title\r\nNEW_CONTACT=Contacto nuevo\r\n\r\n# XTIT,50: Edit contact title\r\nEDIT_CONTACT=Editar contacto\r\n\r\n# XTIT,60: Shows which contact is the Main Contact\r\nMAIN_CONTACT=Contacto principal\r\n\r\n# XFLD,20: Contact Detail field for Birthday\r\nCONTACT_BIRTHDAY=Fecha de nacimiento\r\n\r\n# XFLD,20: Contact Detail field for Note\r\nCONTACT_NOTE=Nota\r\n\r\n# XFLD,20: Contact Detail field for Job Department\r\nCONTACT_DEPARTMENT=Departamento\r\n\r\n# XFLD,20: Contact Detail field for Contact Title\r\nCONTACT_TITLE=T\\u00EDtulo\r\n\r\n#XTIT,20: W7: Title of pop-up used in confirm popup\r\nCONFIRM_TITLE=Confirmar\r\n\r\n# XFLD,20: Contact Detail field for  Academic Title\r\nCONTACT_ACADEMIC_TITLE=T\\u00EDtulo acad\\u00E9mico\r\n\r\n# XMSG : Contact creation succeeded\r\nCREATION_SUCCESS=Contacto creado\r\n\r\n# XMSG : Contact creation failed\r\nCREATION_ERROR=Error de creaci\\u00F3n\r\n\r\n# XMSG : Contact creation succeeded\r\nUPDATE_SUCCESS=Contacto actualizado\r\n\r\n# XMSG : Contact creation failed\r\nUPDATE_ERROR=Error de actualizaci\\u00F3n\r\n\r\n# XMSG : Contact creation : nothing has been changed\r\nNO_CHANGE=Ninguna modificaci\\u00F3n realizada\r\n\r\n# XMSG: message that will be displayed, if not all mandatory fields are not filled\r\nMSG_MANDATORY_FIELDS=No se han rellenado todos los campos obligatorios\r\n\r\n# XMSG : Photo update failed\r\nUPDATE_PHOTO_ERROR=Error en la actualizaci\\u00F3n de foto\r\n\r\n\r\n# XBUT,10: OK\r\nOK=OK\r\n\r\n# XMSG: Cancel confirmation\r\nCONFIRM_CANCEL=Cualquier modificaci\\u00F3n que no haya guardado se perder\\u00E1. \\u00BFDesea continuar?\r\n\r\n# XBUT,30: Add photo\r\nADD_PHOTO=A\\u00F1adir foto\r\n\r\n#XMSG\r\nNO_ITEMS_AVAILABLE=Actualmente no hay posiciones disponibles\r\n\r\n# XBUT,30: add field\r\nADD_FIELD=A\\u00F1adir un campo\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_ALL_CONTACTS=Filtrada por\\: Todos los contactos\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_MY_CONTACTS=Filtrada por\\: Mis contactos\r\n\r\n#XFLD,20: Information "Filtered By: [value]" displayed in the master list information bar\r\nFILTERED_BY=Filtrado por\\: {0}\r\n\r\n#XFLD,20: Placeholder for the select account input\r\nSELECT_ACCOUNT=Seleccionar cliente\r\n\r\n#XFLD,20: Placeholder for the search in the select account dialog\r\nSEARCH=Buscar\r\n\r\n#XFLD,20: No Data text after loading/searching list\r\nNO_DATA_TEXT=No hay datos\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=Cargando...\r\n\r\n# XMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Otro usuario ha modificado los datos. \\u00BFDesea sobrescribir las modificaciones del otro usuario con sus propias modificaciones?\r\n\r\n# XMSG: message that will be displayed in case of conflicts during file renaming\r\nMSG_CONFLICTING_FILE_NAME=Otro usuario ha modificado el nombre del fichero. \\u00BFDesea sobrescribir las modificaciones del otro usuario con sus propias modificaciones?\r\n',
	"cus/crm/mycontacts/i18n/i18n_fr.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT,20: this is the title for the master section when "All Contacts" are displayed\r\nMASTER_TITLE=Tous les contacts ({0})\r\n\r\n#XTIT,20: this is the title for the master section when "My Contacts" are displayed\r\nMASTER_TITLE_FOR_MY_CONTACTS=Mes contacts ({0})\r\n\r\n#XTIT,20 : this is the title for the detail section\r\nDETAIL_TITLE=Contact\r\n\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Ins\\u00E9rez vos contr\\u00F4les ici\r\n\r\n#XFLD,20: All contacts for filter\r\nALL_CONTACTS=Tous les contacts\r\n\r\n#XFLD,30: My contacts for filter\r\nMY_CONTACTS=Mes contacts\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=Contacts\r\n\r\n# XFLD,40: Spinning wheel text\r\nMASTER_BUSY_TEXT=Chargement des contacts en cours...\r\n\r\n# XFLD,40: Text in result list if no entries exist\r\nMASTER_LIST_NODATA=Aucun contact trouv\\u00E9\r\n\r\n# XFLD,20: Search default test\r\nMASTER_SEARCH_PLACEHOLDER=Rechercher\r\n\r\n# XTOL,50: Search default test\r\nMASTER_SEARCH_TOOLTIP=Rechercher contacts\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE1=Contacts\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE2=Mes contacts\r\n\r\n# XTIT,50: Detail View title name\r\nDETAILS_TITLE=Contact\r\n\r\n# XFLD,20: Contact Detail field for E-Mail\r\nCONTACT_EMAIL=E-mail\r\n\r\n# XFLD,20: Contact Detail field for Mobile Phone\r\nCONTACT_MOBILE_PHONE=T\\u00E9l\\u00E9phone portable\r\n\r\n# XFLD,20: Contact Detail field for Phone\r\nCONTACT_PHONE=T\\u00E9l\\u00E9phone\r\n\r\n# XFLD,20: Contact Detail field for Company\r\nCONTACT_ACCOUNT=Compte\r\n\r\n# XFLD,20: Contact Detail field for Job Function\r\nCONTACT_FUNCTION=Fonction\r\n\r\n# XFLD,20: Contact Detail field for First Name\r\nCONTACT_FIRST_NAME=Pr\\u00E9nom\r\n\r\n# XFLD,20: Contact Detail field for Last Name\r\nCONTACT_LAST_NAME=Nom\r\n\r\n# XFLD,20: Contact Detail field for Postal Code\r\nCONTACT_POSTAL_CODE=Code postal\r\n\r\n# XFLD,20: Contact Detail field for Address\r\nCONTACT_ADDRESS=Adresse\r\n\r\n# XTIT,50: Edit Detail View title name\r\nEDIT_DETAILS_TITLE=Modifier contact\r\n\r\n# XTIT,50: Contact Detail View title name\r\nCONTACT_DETAILS_TITLE=D\\u00E9tails du contact\r\n\r\n#XBUT,20\r\nS3_EDIT=Modifier\r\n\r\n#XBUT,20\r\nS4_SAVE=Sauvegarder\r\n\r\n#XBUT,20\r\nS4_CANCEL=Interrompre\r\n\r\n# XTIT,50: New contact title\r\nNEW_CONTACT=Nouveau contact\r\n\r\n# XTIT,50: Edit contact title\r\nEDIT_CONTACT=Modifier contact\r\n\r\n# XTIT,60: Shows which contact is the Main Contact\r\nMAIN_CONTACT=Contact principal\r\n\r\n# XFLD,20: Contact Detail field for Birthday\r\nCONTACT_BIRTHDAY=Date de naissance\r\n\r\n# XFLD,20: Contact Detail field for Note\r\nCONTACT_NOTE=Note\r\n\r\n# XFLD,20: Contact Detail field for Job Department\r\nCONTACT_DEPARTMENT=Service\r\n\r\n# XFLD,20: Contact Detail field for Contact Title\r\nCONTACT_TITLE=Titre\r\n\r\n#XTIT,20: W7: Title of pop-up used in confirm popup\r\nCONFIRM_TITLE=Confirmation\r\n\r\n# XFLD,20: Contact Detail field for  Academic Title\r\nCONTACT_ACADEMIC_TITLE=Titre universitaire\r\n\r\n# XMSG : Contact creation succeeded\r\nCREATION_SUCCESS=Contact cr\\u00E9\\u00E9\r\n\r\n# XMSG : Contact creation failed\r\nCREATION_ERROR=Echec de la cr\\u00E9ation\r\n\r\n# XMSG : Contact creation succeeded\r\nUPDATE_SUCCESS=Contact mis \\u00E0 jour\r\n\r\n# XMSG : Contact creation failed\r\nUPDATE_ERROR=Echec de la mise \\u00E0 jour\r\n\r\n# XMSG : Contact creation : nothing has been changed\r\nNO_CHANGE=Aucune modification effectu\\u00E9e\r\n\r\n# XMSG: message that will be displayed, if not all mandatory fields are not filled\r\nMSG_MANDATORY_FIELDS=Certaines zones obligatoires ne sont pas renseign\\u00E9es.\r\n\r\n# XMSG : Photo update failed\r\nUPDATE_PHOTO_ERROR=Echec de la mise \\u00E0 jour de la photo\r\n\r\n\r\n# XBUT,10: OK\r\nOK=OK\r\n\r\n# XMSG: Cancel confirmation\r\nCONFIRM_CANCEL=Toutes les modifications non sauvegard\\u00E9es seront perdues. Voulez-vous continuer ?\r\n\r\n# XBUT,30: Add photo\r\nADD_PHOTO=Ajouter photo\r\n\r\n#XMSG\r\nNO_ITEMS_AVAILABLE=Aucun poste disponible actuellement\r\n\r\n# XBUT,30: add field\r\nADD_FIELD=Ajouter zone\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_ALL_CONTACTS=Filtr\\u00E9 par \\: tous les contacts\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_MY_CONTACTS=Filtr\\u00E9 par \\: Mes contacts\r\n\r\n#XFLD,20: Information "Filtered By: [value]" displayed in the master list information bar\r\nFILTERED_BY=Filtr\\u00E9 par\\u00A0\\: {0}\r\n\r\n#XFLD,20: Placeholder for the select account input\r\nSELECT_ACCOUNT=S\\u00E9lectionner compte\r\n\r\n#XFLD,20: Placeholder for the search in the select account dialog\r\nSEARCH=Rechercher\r\n\r\n#XFLD,20: No Data text after loading/searching list\r\nNO_DATA_TEXT=Aucune donn\\u00E9e\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=Chargement...\r\n\r\n# XMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Les donn\\u00E9es ont \\u00E9t\\u00E9 modifi\\u00E9es par un autre utilisateur. Voulez-vous remplacer les modifications de l\'autre utilisateur par vos entr\\u00E9es ?\r\n\r\n# XMSG: message that will be displayed in case of conflicts during file renaming\r\nMSG_CONFLICTING_FILE_NAME=Le nom du fichier a \\u00E9t\\u00E9 modifi\\u00E9 par un autre utilisateur. Voulez-vous remplacer les modifications de l\'autre utilisateur par vos entr\\u00E9es ?\r\n',
	"cus/crm/mycontacts/i18n/i18n_hr.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\n\n# Note: This file was created according to the conventions that can be found at \n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\n\n#XTIT,20: this is the title for the master section when "All Contacts" are displayed\nMASTER_TITLE=Svi kontakti ({0})\n\n#XTIT,20: this is the title for the master section when "My Contacts" are displayed\nMASTER_TITLE_FOR_MY_CONTACTS=Moji kontakti ({0})\n\n#XTIT,20 : this is the title for the detail section\nDETAIL_TITLE=Kontakt\n\n#XFLD, 30: this is the place holder dummy in the detail page\nDETAIL_TEXT=Ovdje umetnite kontrole\n\n#XFLD,20: All contacts for filter\nALL_CONTACTS=Svi kontakti\n\n#XFLD,30: My contacts for filter\nMY_CONTACTS=Moji kontakti\n\n# XTIT,40: Application title\nSHELL_TITLE=Kontakti\n\n# XFLD,40: Spinning wheel text\nMASTER_BUSY_TEXT=U\\u010Ditavanje kontakata...\n\n# XFLD,40: Text in result list if no entries exist\nMASTER_LIST_NODATA=Kontakti nisu na\\u0111eni\n\n# XFLD,20: Search default test\nMASTER_SEARCH_PLACEHOLDER=Tra\\u017Eenje\n\n# XTOL,50: Search default test\nMASTER_SEARCH_TOOLTIP=Tra\\u017Eenje kontakata\n\n# XTIT,40: Title for the list\nMASTER_TITLE1=Kontakti\n\n# XTIT,40: Title for the list\nMASTER_TITLE2=Moji kontakti\n\n# XTIT,50: Detail View title name\nDETAILS_TITLE=Kontakt\n\n# XFLD,20: Contact Detail field for E-Mail\nCONTACT_EMAIL=E-po\\u0161ta\n\n# XFLD,20: Contact Detail field for Mobile Phone\nCONTACT_MOBILE_PHONE=Mobilni telefon\n\n# XFLD,20: Contact Detail field for Phone\nCONTACT_PHONE=Telefon\n\n# XFLD,20: Contact Detail field for Company\nCONTACT_ACCOUNT=Klijent\n\n# XFLD,20: Contact Detail field for Job Function\nCONTACT_FUNCTION=Funkcija\n\n# XFLD,20: Contact Detail field for First Name\nCONTACT_FIRST_NAME=Ime\n\n# XFLD,20: Contact Detail field for Last Name\nCONTACT_LAST_NAME=Prezime\n\n# XFLD,20: Contact Detail field for Postal Code\nCONTACT_POSTAL_CODE=Po\\u0161tanski broj\n\n# XFLD,20: Contact Detail field for Address\nCONTACT_ADDRESS=Adresa\n\n# XTIT,50: Edit Detail View title name\nEDIT_DETAILS_TITLE=Uredi kontakt\n\n# XTIT,50: Contact Detail View title name\nCONTACT_DETAILS_TITLE=Detalji kontakta\n\n#XBUT,20\nS3_EDIT=Uredi\n\n#XBUT,20\nS4_SAVE=Snimi\n\n#XBUT,20\nS4_CANCEL=Otka\\u017Ei\n\n# XTIT,50: New contact title\nNEW_CONTACT=Novi kontakt\n\n# XTIT,50: Edit contact title\nEDIT_CONTACT=Uredi kontakt\n\n# XTIT,60: Shows which contact is the Main Contact\nMAIN_CONTACT=Glavni kontakt\n\n# XFLD,20: Contact Detail field for Birthday\nCONTACT_BIRTHDAY=Datum ro\\u0111enja\n\n# XFLD,20: Contact Detail field for Note\nCONTACT_NOTE=Bilje\\u0161ka\n\n# XFLD,20: Contact Detail field for Job Department\nCONTACT_DEPARTMENT=Odjel\n\n# XFLD,20: Contact Detail field for Contact Title\nCONTACT_TITLE=Naslov\n\n#XTIT,20: W7: Title of pop-up used in confirm popup\nCONFIRM_TITLE=Potvrdi\n\n# XFLD,20: Contact Detail field for  Academic Title\nCONTACT_ACADEMIC_TITLE=Akademska titula\n\n# XMSG : Contact creation succeeded\nCREATION_SUCCESS=Kontakt kreiran\n\n# XMSG : Contact creation failed\nCREATION_ERROR=Kreiranje nije uspjelo\n\n# XMSG : Contact creation succeeded\nUPDATE_SUCCESS=Kontakt a\\u017Euriran\n\n# XMSG : Contact creation failed\nUPDATE_ERROR=A\\u017Euriranje nije uspjelo\n\n# XMSG : Contact creation : nothing has been changed\nNO_CHANGE=Promjene nisu izvr\\u0161ene\n\n# XMSG: message that will be displayed, if not all mandatory fields are not filled\nMSG_MANDATORY_FIELDS=Sva polja obaveznog unosa nisu popunjena\n\n# XMSG : Photo update failed\nUPDATE_PHOTO_ERROR=A\\u017Euriranje fotografije nije uspjelo\n\n\n# XBUT,10: OK\nOK=U redu\n\n# XMSG: Cancel confirmation\nCONFIRM_CANCEL=Nesnimljene promjene \\u0107e se izgubiti. \\u017Delite li nastaviti?\n\n# XBUT,30: Add photo\nADD_PHOTO=Dodaj fotografiju\n\n#XMSG\nNO_ITEMS_AVAILABLE=Stavke trenutno nisu raspolo\\u017Eive\n\n# XBUT,30: add field\nADD_FIELD=Dodaj polje\n\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\nFILTERED_BY_ALL_CONTACTS=Filtrirano po\\: svi kontakti\n\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\nFILTERED_BY_MY_CONTACTS=Filtrirano po\\: moji kontakti\n\n#XFLD,20: Information "Filtered By: [value]" displayed in the master list information bar\nFILTERED_BY=Filtrirano prema\\: {0}\n\n#XFLD,20: Placeholder for the select account input\nSELECT_ACCOUNT=Odaberi klijenta\n\n#XFLD,20: Placeholder for the search in the select account dialog\nSEARCH=Tra\\u017Eenje\n\n#XFLD,20: No Data text after loading/searching list\nNO_DATA_TEXT=Nema podataka\n\n#XFLD,20: No Data text when loading/searching list\nLOADING_TEXT=U\\u010Ditavanje...\n\n# XMSG: message that will be displayed in case of conflicting data during account editing\nMSG_CONFLICTING_DATA=Podatke je promijenio drugi korisnik. \\u017Delite li pisati preko promjena drugog korisnika?\n\n# XMSG: message that will be displayed in case of conflicts during file renaming\nMSG_CONFLICTING_FILE_NAME=Naziv datoteke promijenio je drugi korisnik. \\u017Delite li pisati preko promjena drugog korisnika?\n',
	"cus/crm/mycontacts/i18n/i18n_hu.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT,20: this is the title for the master section when "All Contacts" are displayed\r\nMASTER_TITLE=\\u00D6sszes kapcsolat ({0})\r\n\r\n#XTIT,20: this is the title for the master section when "My Contacts" are displayed\r\nMASTER_TITLE_FOR_MY_CONTACTS=Saj\\u00E1t kapcsolatok ({0})\r\n\r\n#XTIT,20 : this is the title for the detail section\r\nDETAIL_TITLE=T\\u00E1rgyal\\u00F3partner\r\n\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Control besz\\u00FAr\\u00E1sa itt\r\n\r\n#XFLD,20: All contacts for filter\r\nALL_CONTACTS=\\u00D6sszes t\\u00E1rgyal\\u00F3part.\r\n\r\n#XFLD,30: My contacts for filter\r\nMY_CONTACTS=Saj\\u00E1t t\\u00E1rgyal\\u00F3partnereim\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=Kapcsolatok\r\n\r\n# XFLD,40: Spinning wheel text\r\nMASTER_BUSY_TEXT=T\\u00E1rgyal\\u00F3partnerek bet\\u00F6lt\\u00E9se...\r\n\r\n# XFLD,40: Text in result list if no entries exist\r\nMASTER_LIST_NODATA=Nem tal\\u00E1lhat\\u00F3k t\\u00E1rgyal\\u00F3partnerek\r\n\r\n# XFLD,20: Search default test\r\nMASTER_SEARCH_PLACEHOLDER=Keres\\u00E9s\r\n\r\n# XTOL,50: Search default test\r\nMASTER_SEARCH_TOOLTIP=T\\u00E1rgyal\\u00F3partnerek keres\\u00E9se\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE1=Kapcsolatok\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE2=Saj\\u00E1t t\\u00E1rgyal\\u00F3partnereim\r\n\r\n# XTIT,50: Detail View title name\r\nDETAILS_TITLE=T\\u00E1rgyal\\u00F3partner\r\n\r\n# XFLD,20: Contact Detail field for E-Mail\r\nCONTACT_EMAIL=E-mail\r\n\r\n# XFLD,20: Contact Detail field for Mobile Phone\r\nCONTACT_MOBILE_PHONE=Mobil\r\n\r\n# XFLD,20: Contact Detail field for Phone\r\nCONTACT_PHONE=Telefon\r\n\r\n# XFLD,20: Contact Detail field for Company\r\nCONTACT_ACCOUNT=\\u00DCgyf\\u00E9l\r\n\r\n# XFLD,20: Contact Detail field for Job Function\r\nCONTACT_FUNCTION=Funkci\\u00F3\r\n\r\n# XFLD,20: Contact Detail field for First Name\r\nCONTACT_FIRST_NAME=Ut\\u00F3n\\u00E9v\r\n\r\n# XFLD,20: Contact Detail field for Last Name\r\nCONTACT_LAST_NAME=Vezet\\u00E9kn\\u00E9v\r\n\r\n# XFLD,20: Contact Detail field for Postal Code\r\nCONTACT_POSTAL_CODE=Ir\\u00E1ny\\u00EDt\\u00F3sz\\u00E1m\r\n\r\n# XFLD,20: Contact Detail field for Address\r\nCONTACT_ADDRESS=C\\u00EDm\r\n\r\n# XTIT,50: Edit Detail View title name\r\nEDIT_DETAILS_TITLE=T\\u00E1rgyal\\u00F3partner feldolgoz\\u00E1sa\r\n\r\n# XTIT,50: Contact Detail View title name\r\nCONTACT_DETAILS_TITLE=Kapcsolattart\\u00F3 r\\u00E9szletek\r\n\r\n#XBUT,20\r\nS3_EDIT=Feldolgoz\\u00E1s\r\n\r\n#XBUT,20\r\nS4_SAVE=Ment\\u00E9s\r\n\r\n#XBUT,20\r\nS4_CANCEL=M\\u00E9gse\r\n\r\n# XTIT,50: New contact title\r\nNEW_CONTACT=\\u00DAj t\\u00E1rgyal\\u00F3partner\r\n\r\n# XTIT,50: Edit contact title\r\nEDIT_CONTACT=T\\u00E1rgyal\\u00F3partner feldolgoz\\u00E1sa\r\n\r\n# XTIT,60: Shows which contact is the Main Contact\r\nMAIN_CONTACT=F\\u0151 t\\u00E1rgyal\\u00F3partner\r\n\r\n# XFLD,20: Contact Detail field for Birthday\r\nCONTACT_BIRTHDAY=Sz\\u00FClet\\u00E9si d\\u00E1tum\r\n\r\n# XFLD,20: Contact Detail field for Note\r\nCONTACT_NOTE=Megjegyz\\u00E9s\r\n\r\n# XFLD,20: Contact Detail field for Job Department\r\nCONTACT_DEPARTMENT=Oszt\\u00E1ly\r\n\r\n# XFLD,20: Contact Detail field for Contact Title\r\nCONTACT_TITLE=C\\u00EDm\r\n\r\n#XTIT,20: W7: Title of pop-up used in confirm popup\r\nCONFIRM_TITLE=Visszaigazol\\u00E1s\r\n\r\n# XFLD,20: Contact Detail field for  Academic Title\r\nCONTACT_ACADEMIC_TITLE=Tudom\\u00E1nyos fokozat\r\n\r\n# XMSG : Contact creation succeeded\r\nCREATION_SUCCESS=T\\u00E1rgyal\\u00F3partner l\\u00E9trehozva\r\n\r\n# XMSG : Contact creation failed\r\nCREATION_ERROR=L\\u00E9trehoz\\u00E1s sikertelen\r\n\r\n# XMSG : Contact creation succeeded\r\nUPDATE_SUCCESS=T\\u00E1rgyal\\u00F3partner aktualiz\\u00E1lva\r\n\r\n# XMSG : Contact creation failed\r\nUPDATE_ERROR=Aktualiz\\u00E1l\\u00E1s sikertelen\r\n\r\n# XMSG : Contact creation : nothing has been changed\r\nNO_CHANGE=Nem t\\u00F6rt\\u00E9nt m\\u00F3dos\\u00EDt\\u00E1s\r\n\r\n# XMSG: message that will be displayed, if not all mandatory fields are not filled\r\nMSG_MANDATORY_FIELDS=Nincs kit\\u00F6ltve az \\u00F6sszes k\\u00F6telez\\u0151 mez\\u0151\r\n\r\n# XMSG : Photo update failed\r\nUPDATE_PHOTO_ERROR=Nem siker\\u00FClt a f\\u00E9nyk\\u00E9p aktualiz\\u00E1l\\u00E1sa\r\n\r\n\r\n# XBUT,10: OK\r\nOK=Rendben\r\n\r\n# XMSG: Cancel confirmation\r\nCONFIRM_CANCEL=Elv\\u00E9sz minden el nem mentett m\\u00F3dos\\u00EDt\\u00E1s. Szeretn\\u00E9 folytatni?\r\n\r\n# XBUT,30: Add photo\r\nADD_PHOTO=F\\u00E9nyk\\u00E9p hozz\\u00E1ad\\u00E1sa\r\n\r\n#XMSG\r\nNO_ITEMS_AVAILABLE=Jelenleg nem \\u00E1ll rendelkez\\u00E9sre t\\u00E9tel\r\n\r\n# XBUT,30: add field\r\nADD_FIELD=Mez\\u0151 hozz\\u00E1ad\\u00E1sa\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_ALL_CONTACTS=Sz\\u0171r\\u00E9s a k\\u00F6vetkez\\u0151 szerint\\: \\u00F6sszes t\\u00E1rgyal\\u00F3partner\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_MY_CONTACTS=Sz\\u0171r\\u00E9s a k\\u00F6vetkez\\u0151 szerint\\: saj\\u00E1t t\\u00E1rgyal\\u00F3partnereim\r\n\r\n#XFLD,20: Information "Filtered By: [value]" displayed in the master list information bar\r\nFILTERED_BY=Sz\\u0171r\\u00E9s a k\\u00F6vetkez\\u0151 szerint\\: {0}\r\n\r\n#XFLD,20: Placeholder for the select account input\r\nSELECT_ACCOUNT=Sz\\u00E1mla kiv\\u00E1laszt\\u00E1sa\r\n\r\n#XFLD,20: Placeholder for the search in the select account dialog\r\nSEARCH=Keres\\u00E9s\r\n\r\n#XFLD,20: No Data text after loading/searching list\r\nNO_DATA_TEXT=Nincs adat\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=Bet\\u00F6lt\\u00E9s...\r\n\r\n# XMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Az adatokat egy m\\u00E1sik felhaszn\\u00E1l\\u00F3 m\\u00F3dos\\u00EDtotta. Szeretn\\u00E9 fel\\u00FCl\\u00EDrni ezeket a m\\u00F3dos\\u00EDt\\u00E1sokat?\r\n\r\n# XMSG: message that will be displayed in case of conflicts during file renaming\r\nMSG_CONFLICTING_FILE_NAME=A f\\u00E1jl nev\\u00E9t egy m\\u00E1sik felhaszn\\u00E1l\\u00F3 m\\u00F3dos\\u00EDtotta. Szeretn\\u00E9 fel\\u00FCl\\u00EDrni ezt a m\\u00F3dos\\u00EDt\\u00E1st?\r\n',
	"cus/crm/mycontacts/i18n/i18n_it.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT,20: this is the title for the master section when "All Contacts" are displayed\r\nMASTER_TITLE=Tutti i contatti ({0})\r\n\r\n#XTIT,20: this is the title for the master section when "My Contacts" are displayed\r\nMASTER_TITLE_FOR_MY_CONTACTS=I miei contatti ({0})\r\n\r\n#XTIT,20 : this is the title for the detail section\r\nDETAIL_TITLE=Contatto\r\n\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Inserisci qui i controlli\r\n\r\n#XFLD,20: All contacts for filter\r\nALL_CONTACTS=Tutti i contatti\r\n\r\n#XFLD,30: My contacts for filter\r\nMY_CONTACTS=I miei contatti\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=Contatti\r\n\r\n# XFLD,40: Spinning wheel text\r\nMASTER_BUSY_TEXT=Caricamento contatti in corso...\r\n\r\n# XFLD,40: Text in result list if no entries exist\r\nMASTER_LIST_NODATA=Nessun contatto trovato\r\n\r\n# XFLD,20: Search default test\r\nMASTER_SEARCH_PLACEHOLDER=Cerca\r\n\r\n# XTOL,50: Search default test\r\nMASTER_SEARCH_TOOLTIP=Ricerca di contatti\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE1=Contatti\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE2=I miei contatti\r\n\r\n# XTIT,50: Detail View title name\r\nDETAILS_TITLE=Contatto\r\n\r\n# XFLD,20: Contact Detail field for E-Mail\r\nCONTACT_EMAIL=E-mail\r\n\r\n# XFLD,20: Contact Detail field for Mobile Phone\r\nCONTACT_MOBILE_PHONE=Cellulare\r\n\r\n# XFLD,20: Contact Detail field for Phone\r\nCONTACT_PHONE=Telefono\r\n\r\n# XFLD,20: Contact Detail field for Company\r\nCONTACT_ACCOUNT=Cliente\r\n\r\n# XFLD,20: Contact Detail field for Job Function\r\nCONTACT_FUNCTION=Funzione\r\n\r\n# XFLD,20: Contact Detail field for First Name\r\nCONTACT_FIRST_NAME=Nome\r\n\r\n# XFLD,20: Contact Detail field for Last Name\r\nCONTACT_LAST_NAME=Cognome\r\n\r\n# XFLD,20: Contact Detail field for Postal Code\r\nCONTACT_POSTAL_CODE=Codice postale\r\n\r\n# XFLD,20: Contact Detail field for Address\r\nCONTACT_ADDRESS=Indirizzo\r\n\r\n# XTIT,50: Edit Detail View title name\r\nEDIT_DETAILS_TITLE=Elabora contatto\r\n\r\n# XTIT,50: Contact Detail View title name\r\nCONTACT_DETAILS_TITLE=Dettagli contatto\r\n\r\n#XBUT,20\r\nS3_EDIT=Elabora\r\n\r\n#XBUT,20\r\nS4_SAVE=Salva\r\n\r\n#XBUT,20\r\nS4_CANCEL=Annulla\r\n\r\n# XTIT,50: New contact title\r\nNEW_CONTACT=Nuovo contatto\r\n\r\n# XTIT,50: Edit contact title\r\nEDIT_CONTACT=Elabora contatto\r\n\r\n# XTIT,60: Shows which contact is the Main Contact\r\nMAIN_CONTACT=Contatto principale\r\n\r\n# XFLD,20: Contact Detail field for Birthday\r\nCONTACT_BIRTHDAY=Data di nascita\r\n\r\n# XFLD,20: Contact Detail field for Note\r\nCONTACT_NOTE=Nota\r\n\r\n# XFLD,20: Contact Detail field for Job Department\r\nCONTACT_DEPARTMENT=Reparto\r\n\r\n# XFLD,20: Contact Detail field for Contact Title\r\nCONTACT_TITLE=Titolo\r\n\r\n#XTIT,20: W7: Title of pop-up used in confirm popup\r\nCONFIRM_TITLE=Conferma\r\n\r\n# XFLD,20: Contact Detail field for  Academic Title\r\nCONTACT_ACADEMIC_TITLE=Titolo accademico\r\n\r\n# XMSG : Contact creation succeeded\r\nCREATION_SUCCESS=Contatto creato\r\n\r\n# XMSG : Contact creation failed\r\nCREATION_ERROR=Creazione non riuscita\r\n\r\n# XMSG : Contact creation succeeded\r\nUPDATE_SUCCESS=Contatto aggiornato\r\n\r\n# XMSG : Contact creation failed\r\nUPDATE_ERROR=Aggiornamento non riuscito\r\n\r\n# XMSG : Contact creation : nothing has been changed\r\nNO_CHANGE=Nessuna modifica apportata\r\n\r\n# XMSG: message that will be displayed, if not all mandatory fields are not filled\r\nMSG_MANDATORY_FIELDS=Non tutti i campi obbligatori sono stati alimentati\r\n\r\n# XMSG : Photo update failed\r\nUPDATE_PHOTO_ERROR=Aggiornamento foto non riuscito\r\n\r\n\r\n# XBUT,10: OK\r\nOK=OK\r\n\r\n# XMSG: Cancel confirmation\r\nCONFIRM_CANCEL=Le modifiche non salvate andranno perse. Continuare?\r\n\r\n# XBUT,30: Add photo\r\nADD_PHOTO=Aggiungi foto\r\n\r\n#XMSG\r\nNO_ITEMS_AVAILABLE=Nessuna posizione attualmente disponibile\r\n\r\n# XBUT,30: add field\r\nADD_FIELD=Aggiungi campo\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_ALL_CONTACTS=Filtrato in base a\\: tutti i contatti\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_MY_CONTACTS=Filtrato in base a\\: i miei contatti\r\n\r\n#XFLD,20: Information "Filtered By: [value]" displayed in the master list information bar\r\nFILTERED_BY=Filtrato in base a\\: {0}\r\n\r\n#XFLD,20: Placeholder for the select account input\r\nSELECT_ACCOUNT=Seleziona cliente\r\n\r\n#XFLD,20: Placeholder for the search in the select account dialog\r\nSEARCH=Cerca\r\n\r\n#XFLD,20: No Data text after loading/searching list\r\nNO_DATA_TEXT=Nessun dato\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=In caricamento...\r\n\r\n# XMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=I dati sono stati modificati da un altro utente. Vuoi sovrascrivere le modifiche dell\'altro utente con le tue?\r\n\r\n# XMSG: message that will be displayed in case of conflicts during file renaming\r\nMSG_CONFLICTING_FILE_NAME=Il nome file \\u00E8 stato modificato da un altro utente. Vuoi sovrascrivere le modifiche dell\'altro utente con le tue?\r\n',
	"cus/crm/mycontacts/i18n/i18n_iw.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT,20: this is the title for the master section when "All Contacts" are displayed\r\nMASTER_TITLE=\\u05DB\\u05DC \\u05D0\\u05E0\\u05E9\\u05D9 \\u05D4\\u05E7\\u05E9\\u05E8 ({0})\r\n\r\n#XTIT,20: this is the title for the master section when "My Contacts" are displayed\r\nMASTER_TITLE_FOR_MY_CONTACTS=\\u05D0\\u05E0\\u05E9\\u05D9 \\u05D4\\u05E7\\u05E9\\u05E8 \\u05E9\\u05DC\\u05D9 ({0})\r\n\r\n#XTIT,20 : this is the title for the detail section\r\nDETAIL_TITLE=\\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8\r\n\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05D0\\u05EA \\u05D4\\u05D1\\u05E7\\u05E8\\u05D5\\u05EA \\u05E9\\u05DC\\u05DA \\u05DB\\u05D0\\u05DF\r\n\r\n#XFLD,20: All contacts for filter\r\nALL_CONTACTS=\\u05DB\\u05DC \\u05D0\\u05E0\\u05E9\\u05D9 \\u05D4\\u05E7\\u05E9\\u05E8\r\n\r\n#XFLD,30: My contacts for filter\r\nMY_CONTACTS=\\u05D0\\u05E0\\u05E9\\u05D9 \\u05D4\\u05E7\\u05E9\\u05E8 \\u05E9\\u05DC\\u05D9\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=\\u05D0\\u05E0\\u05E9\\u05D9 \\u05E7\\u05E9\\u05E8\r\n\r\n# XFLD,40: Spinning wheel text\r\nMASTER_BUSY_TEXT=\\u05D8\\u05D5\\u05E2\\u05DF \\u05D0\\u05E0\\u05E9\\u05D9 \\u05E7\\u05E9\\u05E8...\r\n\r\n# XFLD,40: Text in result list if no entries exist\r\nMASTER_LIST_NODATA=\\u05DC\\u05D0 \\u05E0\\u05DE\\u05E6\\u05D0\\u05D5 \\u05D0\\u05E0\\u05E9\\u05D9 \\u05E7\\u05E9\\u05E8\r\n\r\n# XFLD,20: Search default test\r\nMASTER_SEARCH_PLACEHOLDER=\\u05D7\\u05E4\\u05E9\r\n\r\n# XTOL,50: Search default test\r\nMASTER_SEARCH_TOOLTIP=\\u05D7\\u05E4\\u05E9 \\u05D0\\u05E0\\u05E9\\u05D9 \\u05E7\\u05E9\\u05E8\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE1=\\u05D0\\u05E0\\u05E9\\u05D9 \\u05E7\\u05E9\\u05E8\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE2=\\u05D0\\u05E0\\u05E9\\u05D9 \\u05D4\\u05E7\\u05E9\\u05E8 \\u05E9\\u05DC\\u05D9\r\n\r\n# XTIT,50: Detail View title name\r\nDETAILS_TITLE=\\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8\r\n\r\n# XFLD,20: Contact Detail field for E-Mail\r\nCONTACT_EMAIL=\\u05D3\\u05D5\\u05D0"\\u05DC\r\n\r\n# XFLD,20: Contact Detail field for Mobile Phone\r\nCONTACT_MOBILE_PHONE=\\u05D8\\u05DC\\u05E4\\u05D5\\u05DF \\u05E0\\u05D9\\u05D9\\u05D3\r\n\r\n# XFLD,20: Contact Detail field for Phone\r\nCONTACT_PHONE=\\u05D8\\u05DC\\u05E4\\u05D5\\u05DF\r\n\r\n# XFLD,20: Contact Detail field for Company\r\nCONTACT_ACCOUNT=\\u05DC\\u05E7\\u05D5\\u05D7\r\n\r\n# XFLD,20: Contact Detail field for Job Function\r\nCONTACT_FUNCTION=\\u05E4\\u05D5\\u05E0\\u05E7\\u05E6\\u05D9\\u05D4\r\n\r\n# XFLD,20: Contact Detail field for First Name\r\nCONTACT_FIRST_NAME=\\u05E9\\u05DD \\u05E4\\u05E8\\u05D8\\u05D9\r\n\r\n# XFLD,20: Contact Detail field for Last Name\r\nCONTACT_LAST_NAME=\\u05E9\\u05DD \\u05DE\\u05E9\\u05E4\\u05D7\\u05D4\r\n\r\n# XFLD,20: Contact Detail field for Postal Code\r\nCONTACT_POSTAL_CODE=\\u05DE\\u05D9\\u05E7\\u05D5\\u05D3\r\n\r\n# XFLD,20: Contact Detail field for Address\r\nCONTACT_ADDRESS=\\u05DB\\u05EA\\u05D5\\u05D1\\u05EA\r\n\r\n# XTIT,50: Edit Detail View title name\r\nEDIT_DETAILS_TITLE=\\u05E2\\u05E8\\u05D5\\u05DA \\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8\r\n\r\n# XTIT,50: Contact Detail View title name\r\nCONTACT_DETAILS_TITLE=\\u05E4\\u05E8\\u05D8\\u05D9 \\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8\r\n\r\n#XBUT,20\r\nS3_EDIT=\\u05E2\\u05E8\\u05D5\\u05DA\r\n\r\n#XBUT,20\r\nS4_SAVE=\\u05E9\\u05DE\\u05D5\\u05E8\r\n\r\n#XBUT,20\r\nS4_CANCEL=\\u05D1\\u05D8\\u05DC\r\n\r\n# XTIT,50: New contact title\r\nNEW_CONTACT=\\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8 \\u05D7\\u05D3\\u05E9\r\n\r\n# XTIT,50: Edit contact title\r\nEDIT_CONTACT=\\u05E2\\u05E8\\u05D5\\u05DA \\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8\r\n\r\n# XTIT,60: Shows which contact is the Main Contact\r\nMAIN_CONTACT=\\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8 \\u05E8\\u05D0\\u05E9\\u05D9\r\n\r\n# XFLD,20: Contact Detail field for Birthday\r\nCONTACT_BIRTHDAY=\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05DC\\u05D9\\u05D3\\u05D4\r\n\r\n# XFLD,20: Contact Detail field for Note\r\nCONTACT_NOTE=\\u05D4\\u05E2\\u05E8\\u05D4\r\n\r\n# XFLD,20: Contact Detail field for Job Department\r\nCONTACT_DEPARTMENT=\\u05DE\\u05D7\\u05DC\\u05E7\\u05D4\r\n\r\n# XFLD,20: Contact Detail field for Contact Title\r\nCONTACT_TITLE=\\u05DB\\u05D5\\u05EA\\u05E8\\u05EA\r\n\r\n#XTIT,20: W7: Title of pop-up used in confirm popup\r\nCONFIRM_TITLE=\\u05D0\\u05E9\\u05E8\r\n\r\n# XFLD,20: Contact Detail field for  Academic Title\r\nCONTACT_ACADEMIC_TITLE=\\u05EA\\u05D5\\u05D0\\u05E8 \\u05D0\\u05E7\\u05D3\\u05DE\\u05D9\r\n\r\n# XMSG : Contact creation succeeded\r\nCREATION_SUCCESS=\\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8 \\u05E0\\u05D5\\u05E6\\u05E8\r\n\r\n# XMSG : Contact creation failed\r\nCREATION_ERROR=\\u05D9\\u05E6\\u05D9\\u05E8\\u05D4 \\u05E0\\u05DB\\u05E9\\u05DC\\u05D4\r\n\r\n# XMSG : Contact creation succeeded\r\nUPDATE_SUCCESS=\\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8 \\u05E2\\u05D5\\u05D3\\u05DB\\u05DF\r\n\r\n# XMSG : Contact creation failed\r\nUPDATE_ERROR=\\u05E2\\u05D3\\u05DB\\u05D5\\u05DF \\u05E0\\u05DB\\u05E9\\u05DC\r\n\r\n# XMSG : Contact creation : nothing has been changed\r\nNO_CHANGE=\\u05DC\\u05D0 \\u05E0\\u05E2\\u05E9\\u05D5 \\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD\r\n\r\n# XMSG: message that will be displayed, if not all mandatory fields are not filled\r\nMSG_MANDATORY_FIELDS=\\u05DC\\u05D0 \\u05DB\\u05DC \\u05E9\\u05D3\\u05D5\\u05EA \\u05D4\\u05D7\\u05D5\\u05D1\\u05D4 \\u05DE\\u05D5\\u05DC\\u05D0\\u05D5\r\n\r\n# XMSG : Photo update failed\r\nUPDATE_PHOTO_ERROR=\\u05E2\\u05D3\\u05DB\\u05D5\\u05DF \\u05EA\\u05DE\\u05D5\\u05E0\\u05D4 \\u05E0\\u05DB\\u05E9\\u05DC\r\n\r\n\r\n# XBUT,10: OK\r\nOK=OK\r\n\r\n# XMSG: Cancel confirmation\r\nCONFIRM_CANCEL=\\u05DB\\u05DC \\u05D4\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD \\u05E9\\u05DC\\u05D0 \\u05E0\\u05E9\\u05DE\\u05E8\\u05D5 \\u05D9\\u05D0\\u05D1\\u05D3\\u05D5. \\u05D4\\u05D0\\u05DD \\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05D4\\u05DE\\u05E9\\u05D9\\u05DA?\r\n\r\n# XBUT,30: Add photo\r\nADD_PHOTO=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05EA\\u05DE\\u05D5\\u05E0\\u05D4\r\n\r\n#XMSG\r\nNO_ITEMS_AVAILABLE=\\u05D0\\u05D9\\u05DF \\u05DB\\u05E8\\u05D2\\u05E2 \\u05E4\\u05E8\\u05D9\\u05D8\\u05D9\\u05DD \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD\r\n\r\n# XBUT,30: add field\r\nADD_FIELD=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05E9\\u05D3\\u05D4\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_ALL_CONTACTS=\\u05D1\\u05D5\\u05E6\\u05E2 \\u05E1\\u05D9\\u05E0\\u05D5\\u05DF \\u05DC\\u05E4\\u05D9\\: \\u05DB\\u05DC \\u05D0\\u05E0\\u05E9\\u05D9 \\u05D4\\u05E7\\u05E9\\u05E8\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_MY_CONTACTS=\\u05D1\\u05D5\\u05E6\\u05E2 \\u05E1\\u05D9\\u05E0\\u05D5\\u05DF \\u05DC\\u05E4\\u05D9\\: \\u05D0\\u05E0\\u05E9\\u05D9 \\u05D4\\u05E7\\u05E9\\u05E8 \\u05E9\\u05DC\\u05D9\r\n\r\n#XFLD,20: Information "Filtered By: [value]" displayed in the master list information bar\r\nFILTERED_BY=\\u05E1\\u05D5\\u05E0\\u05DF \\u05DC\\u05E4\\u05D9\\: {0}\r\n\r\n#XFLD,20: Placeholder for the select account input\r\nSELECT_ACCOUNT=\\u05D1\\u05D7\\u05D9\\u05E8\\u05EA \\u05DC\\u05E7\\u05D5\\u05D7\r\n\r\n#XFLD,20: Placeholder for the search in the select account dialog\r\nSEARCH=\\u05D7\\u05E4\\u05E9\r\n\r\n#XFLD,20: No Data text after loading/searching list\r\nNO_DATA_TEXT=\\u05D0\\u05D9\\u05DF \\u05E0\\u05EA\\u05D5\\u05E0\\u05D9\\u05DD\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=\\u05D8\\u05D5\\u05E2\\u05DF...\r\n\r\n# XMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=\\u05D4\\u05E0\\u05EA\\u05D5\\u05E0\\u05D9\\u05DD \\u05E9\\u05D5\\u05E0\\u05D5 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D0\\u05D7\\u05E8. \\u05D4\\u05D0\\u05DD \\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05E9\\u05DB\\u05EA\\u05D1 \\u05D0\\u05EA \\u05D4\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD \\u05E9\\u05DC \\u05D4\\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D5\\u05DC\\u05E8\\u05E9\\u05D5\\u05DD \\u05D0\\u05EA \\u05D4\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD \\u05E9\\u05DC\\u05DA?\r\n\r\n# XMSG: message that will be displayed in case of conflicts during file renaming\r\nMSG_CONFLICTING_FILE_NAME=\\u05E9\\u05DD \\u05D4\\u05E7\\u05D5\\u05D1\\u05E5 \\u05E9\\u05D5\\u05E0\\u05D4 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D0\\u05D7\\u05E8. \\u05D4\\u05D0\\u05DD \\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05E9\\u05DB\\u05EA\\u05D1 \\u05D0\\u05EA \\u05D4\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD \\u05E9\\u05DC \\u05D4\\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D5\\u05DC\\u05E8\\u05E9\\u05D5\\u05DD \\u05D0\\u05EA \\u05D4\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD \\u05E9\\u05DC\\u05DA?\r\n',
	"cus/crm/mycontacts/i18n/i18n_ja.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT,20: this is the title for the master section when "All Contacts" are displayed\r\nMASTER_TITLE=\\u5168\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005 ({0})\r\n\r\n#XTIT,20: this is the title for the master section when "My Contacts" are displayed\r\nMASTER_TITLE_FOR_MY_CONTACTS=My \\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005 ({0})\r\n\r\n#XTIT,20 : this is the title for the detail section\r\nDETAIL_TITLE=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\r\n\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=\\u3053\\u3053\\u306B\\u30B3\\u30F3\\u30C8\\u30ED\\u30FC\\u30EB\\u3092\\u633F\\u5165\r\n\r\n#XFLD,20: All contacts for filter\r\nALL_CONTACTS=\\u5168\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\r\n\r\n#XFLD,30: My contacts for filter\r\nMY_CONTACTS=My \\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\r\n\r\n# XFLD,40: Spinning wheel text\r\nMASTER_BUSY_TEXT=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\\u30ED\\u30FC\\u30C9\\u4E2D...\r\n\r\n# XFLD,40: Text in result list if no entries exist\r\nMASTER_LIST_NODATA=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\\u304C\\u898B\\u3064\\u304B\\u308A\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n\r\n# XFLD,20: Search default test\r\nMASTER_SEARCH_PLACEHOLDER=\\u691C\\u7D22\r\n\r\n# XTOL,50: Search default test\r\nMASTER_SEARCH_TOOLTIP=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\\u691C\\u7D22\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE1=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE2=My \\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\r\n\r\n# XTIT,50: Detail View title name\r\nDETAILS_TITLE=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\r\n\r\n# XFLD,20: Contact Detail field for E-Mail\r\nCONTACT_EMAIL=\\u30E1\\u30FC\\u30EB\r\n\r\n# XFLD,20: Contact Detail field for Mobile Phone\r\nCONTACT_MOBILE_PHONE=\\u643A\\u5E2F\\u96FB\\u8A71\r\n\r\n# XFLD,20: Contact Detail field for Phone\r\nCONTACT_PHONE=\\u96FB\\u8A71\r\n\r\n# XFLD,20: Contact Detail field for Company\r\nCONTACT_ACCOUNT=\\u9867\\u5BA2\r\n\r\n# XFLD,20: Contact Detail field for Job Function\r\nCONTACT_FUNCTION=\\u8077\\u80FD\r\n\r\n# XFLD,20: Contact Detail field for First Name\r\nCONTACT_FIRST_NAME=\\u540D\r\n\r\n# XFLD,20: Contact Detail field for Last Name\r\nCONTACT_LAST_NAME=\\u59D3\r\n\r\n# XFLD,20: Contact Detail field for Postal Code\r\nCONTACT_POSTAL_CODE=\\u90F5\\u4FBF\\u756A\\u53F7\r\n\r\n# XFLD,20: Contact Detail field for Address\r\nCONTACT_ADDRESS=\\u4F4F\\u6240\r\n\r\n# XTIT,50: Edit Detail View title name\r\nEDIT_DETAILS_TITLE=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\\u306E\\u7DE8\\u96C6\r\n\r\n# XTIT,50: Contact Detail View title name\r\nCONTACT_DETAILS_TITLE=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\\u8A73\\u7D30\r\n\r\n#XBUT,20\r\nS3_EDIT=\\u7DE8\\u96C6\r\n\r\n#XBUT,20\r\nS4_SAVE=\\u4FDD\\u5B58\r\n\r\n#XBUT,20\r\nS4_CANCEL=\\u4E2D\\u6B62\r\n\r\n# XTIT,50: New contact title\r\nNEW_CONTACT=\\u65B0\\u898F\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\r\n\r\n# XTIT,50: Edit contact title\r\nEDIT_CONTACT=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\\u306E\\u7DE8\\u96C6\r\n\r\n# XTIT,60: Shows which contact is the Main Contact\r\nMAIN_CONTACT=\\u4E3B\\u8981\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\r\n\r\n# XFLD,20: Contact Detail field for Birthday\r\nCONTACT_BIRTHDAY=\\u8A95\\u751F\\u65E5\r\n\r\n# XFLD,20: Contact Detail field for Note\r\nCONTACT_NOTE=\\u30E1\\u30E2\r\n\r\n# XFLD,20: Contact Detail field for Job Department\r\nCONTACT_DEPARTMENT=\\u90E8\\u9580\r\n\r\n# XFLD,20: Contact Detail field for Contact Title\r\nCONTACT_TITLE=\\u656C\\u79F0\r\n\r\n#XTIT,20: W7: Title of pop-up used in confirm popup\r\nCONFIRM_TITLE=\\u78BA\\u8A8D\r\n\r\n# XFLD,20: Contact Detail field for  Academic Title\r\nCONTACT_ACADEMIC_TITLE=\\u5B66\\u4F4D\r\n\r\n# XMSG : Contact creation succeeded\r\nCREATION_SUCCESS=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\\u304C\\u767B\\u9332\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n# XMSG : Contact creation failed\r\nCREATION_ERROR=\\u767B\\u9332\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n\r\n# XMSG : Contact creation succeeded\r\nUPDATE_SUCCESS=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\\u304C\\u66F4\\u65B0\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n# XMSG : Contact creation failed\r\nUPDATE_ERROR=\\u66F4\\u65B0\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n\r\n# XMSG : Contact creation : nothing has been changed\r\nNO_CHANGE=\\u5909\\u66F4\\u3055\\u308C\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n\r\n# XMSG: message that will be displayed, if not all mandatory fields are not filled\r\nMSG_MANDATORY_FIELDS=\\u4E00\\u90E8\\u306E\\u5165\\u529B\\u5FC5\\u9808\\u9805\\u76EE\\u304C\\u5165\\u529B\\u3055\\u308C\\u3066\\u3044\\u307E\\u305B\\u3093\r\n\r\n# XMSG : Photo update failed\r\nUPDATE_PHOTO_ERROR=\\u5199\\u771F\\u3092\\u66F4\\u65B0\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n\r\n\r\n# XBUT,10: OK\r\nOK=OK\r\n\r\n# XMSG: Cancel confirmation\r\nCONFIRM_CANCEL=\\u672A\\u4FDD\\u5B58\\u306E\\u5909\\u66F4\\u306F\\u5931\\u308F\\u308C\\u307E\\u3059\\u3002\\u7D9A\\u884C\\u3057\\u307E\\u3059\\u304B\\u3002\r\n\r\n# XBUT,30: Add photo\r\nADD_PHOTO=\\u5199\\u771F\\u8FFD\\u52A0\r\n\r\n#XMSG\r\nNO_ITEMS_AVAILABLE=\\u73FE\\u5728\\u5229\\u7528\\u3067\\u304D\\u308B\\u30A2\\u30A4\\u30C6\\u30E0\\u306F\\u3042\\u308A\\u307E\\u305B\\u3093\r\n\r\n# XBUT,30: add field\r\nADD_FIELD=\\u9805\\u76EE\\u8FFD\\u52A0\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_ALL_CONTACTS=\\u30D5\\u30A3\\u30EB\\u30BF\\u57FA\\u6E96\\: \\u5168\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_MY_CONTACTS=\\u30D5\\u30A3\\u30EB\\u30BF\\u57FA\\u6E96\\: My \\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\r\n\r\n#XFLD,20: Information "Filtered By: [value]" displayed in the master list information bar\r\nFILTERED_BY=\\u30D5\\u30A3\\u30EB\\u30BF\\u57FA\\u6E96\\:  {0}\r\n\r\n#XFLD,20: Placeholder for the select account input\r\nSELECT_ACCOUNT=\\u9078\\u629E\\u9867\\u5BA2\r\n\r\n#XFLD,20: Placeholder for the search in the select account dialog\r\nSEARCH=\\u691C\\u7D22\r\n\r\n#XFLD,20: No Data text after loading/searching list\r\nNO_DATA_TEXT=\\u30C7\\u30FC\\u30BF\\u306A\\u3057\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=\\u30ED\\u30FC\\u30C9\\u4E2D...\r\n\r\n# XMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=\\u30C7\\u30FC\\u30BF\\u306F\\u5225\\u306E\\u30E6\\u30FC\\u30B6\\u306B\\u3088\\u308A\\u5909\\u66F4\\u3055\\u308C\\u3066\\u3044\\u307E\\u3059\\u3002\\u3053\\u306E\\u30E6\\u30FC\\u30B6\\u306B\\u3088\\u308B\\u5909\\u66F4\\u3092\\u81EA\\u5206\\u306E\\u5909\\u66F4\\u3067\\u4E0A\\u66F8\\u304D\\u3057\\u307E\\u3059\\u304B\\u3002\r\n\r\n# XMSG: message that will be displayed in case of conflicts during file renaming\r\nMSG_CONFLICTING_FILE_NAME=\\u30D5\\u30A1\\u30A4\\u30EB\\u540D\\u306F\\u5225\\u306E\\u30E6\\u30FC\\u30B6\\u306B\\u3088\\u308A\\u5909\\u66F4\\u3055\\u308C\\u3066\\u3044\\u307E\\u3059\\u3002\\u3053\\u306E\\u30E6\\u30FC\\u30B6\\u306B\\u3088\\u308B\\u5909\\u66F4\\u3092\\u81EA\\u5206\\u306E\\u5909\\u66F4\\u3067\\u4E0A\\u66F8\\u304D\\u3057\\u307E\\u3059\\u304B\\u3002\r\n',
	"cus/crm/mycontacts/i18n/i18n_no.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT,20: this is the title for the master section when "All Contacts" are displayed\r\nMASTER_TITLE=Alle kontakter ({0})\r\n\r\n#XTIT,20: this is the title for the master section when "My Contacts" are displayed\r\nMASTER_TITLE_FOR_MY_CONTACTS=Mine kontakter ({0})\r\n\r\n#XTIT,20 : this is the title for the detail section\r\nDETAIL_TITLE=Kontakt\r\n\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Sett inn kontrollene her\r\n\r\n#XFLD,20: All contacts for filter\r\nALL_CONTACTS=Alle kontakter\r\n\r\n#XFLD,30: My contacts for filter\r\nMY_CONTACTS=Mine kontakter\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=Kontakter\r\n\r\n# XFLD,40: Spinning wheel text\r\nMASTER_BUSY_TEXT=Laster kontakter ...\r\n\r\n# XFLD,40: Text in result list if no entries exist\r\nMASTER_LIST_NODATA=Finner ingen kontakter\r\n\r\n# XFLD,20: Search default test\r\nMASTER_SEARCH_PLACEHOLDER=S\\u00F8k\r\n\r\n# XTOL,50: Search default test\r\nMASTER_SEARCH_TOOLTIP=S\\u00F8k etter kontakter\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE1=Kontakter\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE2=Mine kontakter\r\n\r\n# XTIT,50: Detail View title name\r\nDETAILS_TITLE=Kontakt\r\n\r\n# XFLD,20: Contact Detail field for E-Mail\r\nCONTACT_EMAIL=E-post\r\n\r\n# XFLD,20: Contact Detail field for Mobile Phone\r\nCONTACT_MOBILE_PHONE=Mobil\r\n\r\n# XFLD,20: Contact Detail field for Phone\r\nCONTACT_PHONE=Telefon\r\n\r\n# XFLD,20: Contact Detail field for Company\r\nCONTACT_ACCOUNT=Kunde\r\n\r\n# XFLD,20: Contact Detail field for Job Function\r\nCONTACT_FUNCTION=Funksjon\r\n\r\n# XFLD,20: Contact Detail field for First Name\r\nCONTACT_FIRST_NAME=Fornavn\r\n\r\n# XFLD,20: Contact Detail field for Last Name\r\nCONTACT_LAST_NAME=Etternavn\r\n\r\n# XFLD,20: Contact Detail field for Postal Code\r\nCONTACT_POSTAL_CODE=Postnummer\r\n\r\n# XFLD,20: Contact Detail field for Address\r\nCONTACT_ADDRESS=Adresse\r\n\r\n# XTIT,50: Edit Detail View title name\r\nEDIT_DETAILS_TITLE=Rediger kontakt\r\n\r\n# XTIT,50: Contact Detail View title name\r\nCONTACT_DETAILS_TITLE=Kontaktdetaljer\r\n\r\n#XBUT,20\r\nS3_EDIT=Rediger\r\n\r\n#XBUT,20\r\nS4_SAVE=Lagre\r\n\r\n#XBUT,20\r\nS4_CANCEL=Annuller\r\n\r\n# XTIT,50: New contact title\r\nNEW_CONTACT=Ny kontakt\r\n\r\n# XTIT,50: Edit contact title\r\nEDIT_CONTACT=Rediger kontakt\r\n\r\n# XTIT,60: Shows which contact is the Main Contact\r\nMAIN_CONTACT=Hovedkontakt\r\n\r\n# XFLD,20: Contact Detail field for Birthday\r\nCONTACT_BIRTHDAY=F\\u00F8dselsdato\r\n\r\n# XFLD,20: Contact Detail field for Note\r\nCONTACT_NOTE=Merknad\r\n\r\n# XFLD,20: Contact Detail field for Job Department\r\nCONTACT_DEPARTMENT=Avdeling\r\n\r\n# XFLD,20: Contact Detail field for Contact Title\r\nCONTACT_TITLE=Tittel\r\n\r\n#XTIT,20: W7: Title of pop-up used in confirm popup\r\nCONFIRM_TITLE=Bekreft\r\n\r\n# XFLD,20: Contact Detail field for  Academic Title\r\nCONTACT_ACADEMIC_TITLE=Akademisk tittel\r\n\r\n# XMSG : Contact creation succeeded\r\nCREATION_SUCCESS=Kontakt opprettet\r\n\r\n# XMSG : Contact creation failed\r\nCREATION_ERROR=Oppretting mislyktes\r\n\r\n# XMSG : Contact creation succeeded\r\nUPDATE_SUCCESS=Kontakt oppdatert\r\n\r\n# XMSG : Contact creation failed\r\nUPDATE_ERROR=Oppdatering mislyktes\r\n\r\n# XMSG : Contact creation : nothing has been changed\r\nNO_CHANGE=Ingen endringer utf\\u00F8rt\r\n\r\n# XMSG: message that will be displayed, if not all mandatory fields are not filled\r\nMSG_MANDATORY_FIELDS=Alle obligatoriske felt er ikke utfylt\r\n\r\n# XMSG : Photo update failed\r\nUPDATE_PHOTO_ERROR=Oppdatering av foto mislyktes\r\n\r\n\r\n# XBUT,10: OK\r\nOK=OK\r\n\r\n# XMSG: Cancel confirmation\r\nCONFIRM_CANCEL=Ikke lagrede endringer vil g\\u00E5 tapt. Fortsette?\r\n\r\n# XBUT,30: Add photo\r\nADD_PHOTO=Legg til foto\r\n\r\n#XMSG\r\nNO_ITEMS_AVAILABLE=Ingen elementer er for \\u00F8yeblikket tilgjengelige\r\n\r\n# XBUT,30: add field\r\nADD_FIELD=Legg til felt\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_ALL_CONTACTS=Filtrer etter\\: Alle kontakter\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_MY_CONTACTS=Filtrer etter\\: Mine kontakter\r\n\r\n#XFLD,20: Information "Filtered By: [value]" displayed in the master list information bar\r\nFILTERED_BY=Filtrert etter\\: {0}\r\n\r\n#XFLD,20: Placeholder for the select account input\r\nSELECT_ACCOUNT=Velg konto\r\n\r\n#XFLD,20: Placeholder for the search in the select account dialog\r\nSEARCH=S\\u00F8k\r\n\r\n#XFLD,20: No Data text after loading/searching list\r\nNO_DATA_TEXT=Ingen data\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=Laster ...\r\n\r\n# XMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=En annen bruker har endret dataene. Vil du overskrive endringene til den andre brukeren med dine egne?\r\n\r\n# XMSG: message that will be displayed in case of conflicts during file renaming\r\nMSG_CONFLICTING_FILE_NAME=En annen bruker har endret filnavnet. Vil du overskrive endringene til den andre brukeren med dine egne?\r\n',
	"cus/crm/mycontacts/i18n/i18n_pl.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT,20: this is the title for the master section when "All Contacts" are displayed\r\nMASTER_TITLE=Wszystkie kontakty ({0})\r\n\r\n#XTIT,20: this is the title for the master section when "My Contacts" are displayed\r\nMASTER_TITLE_FOR_MY_CONTACTS=Moje kontakty ({0})\r\n\r\n#XTIT,20 : this is the title for the detail section\r\nDETAIL_TITLE=Kontakt\r\n\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Wstaw obiekty sterowania tutaj\r\n\r\n#XFLD,20: All contacts for filter\r\nALL_CONTACTS=Wszystkie kontakty\r\n\r\n#XFLD,30: My contacts for filter\r\nMY_CONTACTS=Moje kontakty\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=Kontakty\r\n\r\n# XFLD,40: Spinning wheel text\r\nMASTER_BUSY_TEXT=Wczytywanie kontakt\\u00F3w...\r\n\r\n# XFLD,40: Text in result list if no entries exist\r\nMASTER_LIST_NODATA=Brak kontakt\\u00F3w\r\n\r\n# XFLD,20: Search default test\r\nMASTER_SEARCH_PLACEHOLDER=Szukaj\r\n\r\n# XTOL,50: Search default test\r\nMASTER_SEARCH_TOOLTIP=Szukaj kontakt\\u00F3w\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE1=Kontakty\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE2=Moje kontakty\r\n\r\n# XTIT,50: Detail View title name\r\nDETAILS_TITLE=Kontakt\r\n\r\n# XFLD,20: Contact Detail field for E-Mail\r\nCONTACT_EMAIL=E-mail\r\n\r\n# XFLD,20: Contact Detail field for Mobile Phone\r\nCONTACT_MOBILE_PHONE=Telefon kom\\u00F3rkowy\r\n\r\n# XFLD,20: Contact Detail field for Phone\r\nCONTACT_PHONE=Telefon\r\n\r\n# XFLD,20: Contact Detail field for Company\r\nCONTACT_ACCOUNT=Klient\r\n\r\n# XFLD,20: Contact Detail field for Job Function\r\nCONTACT_FUNCTION=Funkcja\r\n\r\n# XFLD,20: Contact Detail field for First Name\r\nCONTACT_FIRST_NAME=Imi\\u0119\r\n\r\n# XFLD,20: Contact Detail field for Last Name\r\nCONTACT_LAST_NAME=Nazwisko\r\n\r\n# XFLD,20: Contact Detail field for Postal Code\r\nCONTACT_POSTAL_CODE=Kod pocztowy\r\n\r\n# XFLD,20: Contact Detail field for Address\r\nCONTACT_ADDRESS=Adres\r\n\r\n# XTIT,50: Edit Detail View title name\r\nEDIT_DETAILS_TITLE=Edycja kontaktu\r\n\r\n# XTIT,50: Contact Detail View title name\r\nCONTACT_DETAILS_TITLE=Szczeg\\u00F3\\u0142y kontaktu\r\n\r\n#XBUT,20\r\nS3_EDIT=Edytuj\r\n\r\n#XBUT,20\r\nS4_SAVE=Zapisz\r\n\r\n#XBUT,20\r\nS4_CANCEL=Anuluj\r\n\r\n# XTIT,50: New contact title\r\nNEW_CONTACT=Nowy kontakt\r\n\r\n# XTIT,50: Edit contact title\r\nEDIT_CONTACT=Edycja kontaktu\r\n\r\n# XTIT,60: Shows which contact is the Main Contact\r\nMAIN_CONTACT=G\\u0142\\u00F3wny kontakt\r\n\r\n# XFLD,20: Contact Detail field for Birthday\r\nCONTACT_BIRTHDAY=Data urodzenia\r\n\r\n# XFLD,20: Contact Detail field for Note\r\nCONTACT_NOTE=Notatka\r\n\r\n# XFLD,20: Contact Detail field for Job Department\r\nCONTACT_DEPARTMENT=Dzia\\u0142\r\n\r\n# XFLD,20: Contact Detail field for Contact Title\r\nCONTACT_TITLE=Tytu\\u0142\r\n\r\n#XTIT,20: W7: Title of pop-up used in confirm popup\r\nCONFIRM_TITLE=Potwierdzenie\r\n\r\n# XFLD,20: Contact Detail field for  Academic Title\r\nCONTACT_ACADEMIC_TITLE=Tytu\\u0142 akademicki\r\n\r\n# XMSG : Contact creation succeeded\r\nCREATION_SUCCESS=Utworzono kontakt\r\n\r\n# XMSG : Contact creation failed\r\nCREATION_ERROR=Tworzenie nie powiod\\u0142o si\\u0119\r\n\r\n# XMSG : Contact creation succeeded\r\nUPDATE_SUCCESS=Zaktualizowano kontakt\r\n\r\n# XMSG : Contact creation failed\r\nUPDATE_ERROR=Aktualizacja nie powiod\\u0142a si\\u0119\r\n\r\n# XMSG : Contact creation : nothing has been changed\r\nNO_CHANGE=Nie dokonano zmian\r\n\r\n# XMSG: message that will be displayed, if not all mandatory fields are not filled\r\nMSG_MANDATORY_FIELDS=Nie wszystkie pola obowi\\u0105zkowe s\\u0105 wype\\u0142nione\r\n\r\n# XMSG : Photo update failed\r\nUPDATE_PHOTO_ERROR=Aktualizacja zdj\\u0119cia nie powiod\\u0142a si\\u0119\r\n\r\n\r\n# XBUT,10: OK\r\nOK=OK\r\n\r\n# XMSG: Cancel confirmation\r\nCONFIRM_CANCEL=Niezapisane zmiany zostan\\u0105 utracone. Czy chcesz kontynuowa\\u0107?\r\n\r\n# XBUT,30: Add photo\r\nADD_PHOTO=Dodaj zdj\\u0119cie\r\n\r\n#XMSG\r\nNO_ITEMS_AVAILABLE=Obecnie brak dost\\u0119pnych pozycji\r\n\r\n# XBUT,30: add field\r\nADD_FIELD=Dodaj pole\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_ALL_CONTACTS=Filtrowane wed\\u0142ug\\: Wszystkie kontakty\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_MY_CONTACTS=Filtrowane wed\\u0142ug\\: Moje kontakty\r\n\r\n#XFLD,20: Information "Filtered By: [value]" displayed in the master list information bar\r\nFILTERED_BY=Przefiltrowane wed\\u0142ug\\: {0}\r\n\r\n#XFLD,20: Placeholder for the select account input\r\nSELECT_ACCOUNT=Wybierz klienta\r\n\r\n#XFLD,20: Placeholder for the search in the select account dialog\r\nSEARCH=Szukaj\r\n\r\n#XFLD,20: No Data text after loading/searching list\r\nNO_DATA_TEXT=Brak danych\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=Wczytywanie...\r\n\r\n# XMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Dane zosta\\u0142y zmienione przez innego u\\u017Cytkownika. Czy chcesz nadpisa\\u0107 zmiany innego u\\u017Cytkownika w\\u0142asnymi zmianami?\r\n\r\n# XMSG: message that will be displayed in case of conflicts during file renaming\r\nMSG_CONFLICTING_FILE_NAME=Nazwa pliku zosta\\u0142a zmieniona przez innego u\\u017Cytkownika. Czy chcesz nadpisa\\u0107 zmiany innego u\\u017Cytkownika w\\u0142asnymi zmianami?\r\n',
	"cus/crm/mycontacts/i18n/i18n_pt.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT,20: this is the title for the master section when "All Contacts" are displayed\r\nMASTER_TITLE=Todos os contatos ({0})\r\n\r\n#XTIT,20: this is the title for the master section when "My Contacts" are displayed\r\nMASTER_TITLE_FOR_MY_CONTACTS=Meus contatos ({0})\r\n\r\n#XTIT,20 : this is the title for the detail section\r\nDETAIL_TITLE=Contato\r\n\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Insira seus controles aqui\r\n\r\n#XFLD,20: All contacts for filter\r\nALL_CONTACTS=Todos os contatos\r\n\r\n#XFLD,30: My contacts for filter\r\nMY_CONTACTS=Meus contatos\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=Contatos\r\n\r\n# XFLD,40: Spinning wheel text\r\nMASTER_BUSY_TEXT=Carregando contatos...\r\n\r\n# XFLD,40: Text in result list if no entries exist\r\nMASTER_LIST_NODATA=Nenhum contato encontrado\r\n\r\n# XFLD,20: Search default test\r\nMASTER_SEARCH_PLACEHOLDER=Procurar\r\n\r\n# XTOL,50: Search default test\r\nMASTER_SEARCH_TOOLTIP=Procurar contatos\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE1=Contatos\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE2=Meus contatos\r\n\r\n# XTIT,50: Detail View title name\r\nDETAILS_TITLE=Contato\r\n\r\n# XFLD,20: Contact Detail field for E-Mail\r\nCONTACT_EMAIL=E-mail\r\n\r\n# XFLD,20: Contact Detail field for Mobile Phone\r\nCONTACT_MOBILE_PHONE=Celular\r\n\r\n# XFLD,20: Contact Detail field for Phone\r\nCONTACT_PHONE=Telefone\r\n\r\n# XFLD,20: Contact Detail field for Company\r\nCONTACT_ACCOUNT=Conta\r\n\r\n# XFLD,20: Contact Detail field for Job Function\r\nCONTACT_FUNCTION=Fun\\u00E7\\u00E3o\r\n\r\n# XFLD,20: Contact Detail field for First Name\r\nCONTACT_FIRST_NAME=1\\u00BA nome\r\n\r\n# XFLD,20: Contact Detail field for Last Name\r\nCONTACT_LAST_NAME=Sobrenome\r\n\r\n# XFLD,20: Contact Detail field for Postal Code\r\nCONTACT_POSTAL_CODE=C\\u00F3digo Postal\r\n\r\n# XFLD,20: Contact Detail field for Address\r\nCONTACT_ADDRESS=Endere\\u00E7o\r\n\r\n# XTIT,50: Edit Detail View title name\r\nEDIT_DETAILS_TITLE=Processar contato\r\n\r\n# XTIT,50: Contact Detail View title name\r\nCONTACT_DETAILS_TITLE=Detalhes de contato\r\n\r\n#XBUT,20\r\nS3_EDIT=Editar\r\n\r\n#XBUT,20\r\nS4_SAVE=Gravar\r\n\r\n#XBUT,20\r\nS4_CANCEL=Anular\r\n\r\n# XTIT,50: New contact title\r\nNEW_CONTACT=Novo contato\r\n\r\n# XTIT,50: Edit contact title\r\nEDIT_CONTACT=Editar contato\r\n\r\n# XTIT,60: Shows which contact is the Main Contact\r\nMAIN_CONTACT=Contato principal\r\n\r\n# XFLD,20: Contact Detail field for Birthday\r\nCONTACT_BIRTHDAY=Data de nascimento\r\n\r\n# XFLD,20: Contact Detail field for Note\r\nCONTACT_NOTE=Nota\r\n\r\n# XFLD,20: Contact Detail field for Job Department\r\nCONTACT_DEPARTMENT=Departamento\r\n\r\n# XFLD,20: Contact Detail field for Contact Title\r\nCONTACT_TITLE=T\\u00EDtulo\r\n\r\n#XTIT,20: W7: Title of pop-up used in confirm popup\r\nCONFIRM_TITLE=Confirmar\r\n\r\n# XFLD,20: Contact Detail field for  Academic Title\r\nCONTACT_ACADEMIC_TITLE=T\\u00EDtulo acad\\u00EAmico\r\n\r\n# XMSG : Contact creation succeeded\r\nCREATION_SUCCESS=Contato criado\r\n\r\n# XMSG : Contact creation failed\r\nCREATION_ERROR=Falha ao criar\r\n\r\n# XMSG : Contact creation succeeded\r\nUPDATE_SUCCESS=Contato atualizado\r\n\r\n# XMSG : Contact creation failed\r\nUPDATE_ERROR=Atualiza\\u00E7\\u00E3o falhada\r\n\r\n# XMSG : Contact creation : nothing has been changed\r\nNO_CHANGE=Nenhuma modifica\\u00E7\\u00E3o efetuada\r\n\r\n# XMSG: message that will be displayed, if not all mandatory fields are not filled\r\nMSG_MANDATORY_FIELDS=Nem todos os campos obrigat\\u00F3rios foram preenchidos\r\n\r\n# XMSG : Photo update failed\r\nUPDATE_PHOTO_ERROR=Falha ao atualizar foto\r\n\r\n\r\n# XBUT,10: OK\r\nOK=OK\r\n\r\n# XMSG: Cancel confirmation\r\nCONFIRM_CANCEL=As modifica\\u00E7\\u00F5es n\\u00E3o gravadas se perder\\u00E3o. Continuar?\r\n\r\n# XBUT,30: Add photo\r\nADD_PHOTO=Inserir foto\r\n\r\n#XMSG\r\nNO_ITEMS_AVAILABLE=Nenhum item atualmente dispon\\u00EDvel\r\n\r\n# XBUT,30: add field\r\nADD_FIELD=Adicionar cpo.\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_ALL_CONTACTS=Filtrado por\\: Todos os contatos\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_MY_CONTACTS=Filtrado por\\: Meus contatos\r\n\r\n#XFLD,20: Information "Filtered By: [value]" displayed in the master list information bar\r\nFILTERED_BY=Filtrado por\\: {0}\r\n\r\n#XFLD,20: Placeholder for the select account input\r\nSELECT_ACCOUNT=Selecionar conta\r\n\r\n#XFLD,20: Placeholder for the search in the select account dialog\r\nSEARCH=Procurar\r\n\r\n#XFLD,20: No Data text after loading/searching list\r\nNO_DATA_TEXT=Sem dados\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=Carregando...\r\n\r\n# XMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Os dados foram modificados por outro usu\\u00E1rio. Sobregravar as modifica\\u00E7\\u00F5es do outro usu\\u00E1rio com suas pr\\u00F3prias?\r\n\r\n# XMSG: message that will be displayed in case of conflicts during file renaming\r\nMSG_CONFLICTING_FILE_NAME=O nome do arquivo foi modificado por outro usu\\u00E1rio. Sobregravar as modifica\\u00E7\\u00F5es do outro usu\\u00E1rio com suas pr\\u00F3prias?\r\n',
	"cus/crm/mycontacts/i18n/i18n_ro.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\n\n# Note: This file was created according to the conventions that can be found at \n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\n\n#XTIT,20: this is the title for the master section when "All Contacts" are displayed\nMASTER_TITLE=Toate persoanele de contact ({0})\n\n#XTIT,20: this is the title for the master section when "My Contacts" are displayed\nMASTER_TITLE_FOR_MY_CONTACTS=Persoanele mele de contact ({0})\n\n#XTIT,20 : this is the title for the detail section\nDETAIL_TITLE=Persoan\\u0103 de contact\n\n#XFLD, 30: this is the place holder dummy in the detail page\nDETAIL_TEXT=Insera\\u0163i aici controalele dvs.\n\n#XFLD,20: All contacts for filter\nALL_CONTACTS=Toate pers.contact\n\n#XFLD,30: My contacts for filter\nMY_CONTACTS=Persoanele mele de contact\n\n# XTIT,40: Application title\nSHELL_TITLE=Persoane de contact\n\n# XFLD,40: Spinning wheel text\nMASTER_BUSY_TEXT=\\u00CEnc\\u0103rcare persoane de contact...\n\n# XFLD,40: Text in result list if no entries exist\nMASTER_LIST_NODATA=F\\u0103r\\u0103 persoane de contact g\\u0103site\n\n# XFLD,20: Search default test\nMASTER_SEARCH_PLACEHOLDER=C\\u0103utare\n\n# XTOL,50: Search default test\nMASTER_SEARCH_TOOLTIP=C\\u0103utare persoane de contact\n\n# XTIT,40: Title for the list\nMASTER_TITLE1=Persoane de contact\n\n# XTIT,40: Title for the list\nMASTER_TITLE2=Persoanele mele de contact\n\n# XTIT,50: Detail View title name\nDETAILS_TITLE=Persoan\\u0103 de contact\n\n# XFLD,20: Contact Detail field for E-Mail\nCONTACT_EMAIL=E-mail\n\n# XFLD,20: Contact Detail field for Mobile Phone\nCONTACT_MOBILE_PHONE=Telefon mobil\n\n# XFLD,20: Contact Detail field for Phone\nCONTACT_PHONE=Telefon\n\n# XFLD,20: Contact Detail field for Company\nCONTACT_ACCOUNT=Cont\n\n# XFLD,20: Contact Detail field for Job Function\nCONTACT_FUNCTION=Func\\u0163ie\n\n# XFLD,20: Contact Detail field for First Name\nCONTACT_FIRST_NAME=Prenume\n\n# XFLD,20: Contact Detail field for Last Name\nCONTACT_LAST_NAME=Nume familie\n\n# XFLD,20: Contact Detail field for Postal Code\nCONTACT_POSTAL_CODE=Cod po\\u015Ftal\n\n# XFLD,20: Contact Detail field for Address\nCONTACT_ADDRESS=Adres\\u0103\n\n# XTIT,50: Edit Detail View title name\nEDIT_DETAILS_TITLE=Editare persoan\\u0103 de contact\n\n# XTIT,50: Contact Detail View title name\nCONTACT_DETAILS_TITLE=Detalii persoan\\u0103 de contact\n\n#XBUT,20\nS3_EDIT=Editare\n\n#XBUT,20\nS4_SAVE=Salvare\n\n#XBUT,20\nS4_CANCEL=Anulare\n\n# XTIT,50: New contact title\nNEW_CONTACT=Persoan\\u0103 de contact nou\\u0103\n\n# XTIT,50: Edit contact title\nEDIT_CONTACT=Editare persoan\\u0103 de contact\n\n# XTIT,60: Shows which contact is the Main Contact\nMAIN_CONTACT=Persoan\\u0103 de contact principal\\u0103\n\n# XFLD,20: Contact Detail field for Birthday\nCONTACT_BIRTHDAY=Dat\\u0103 de na\\u015Ftere\n\n# XFLD,20: Contact Detail field for Note\nCONTACT_NOTE=Not\\u0103\n\n# XFLD,20: Contact Detail field for Job Department\nCONTACT_DEPARTMENT=Departament\n\n# XFLD,20: Contact Detail field for Contact Title\nCONTACT_TITLE=Titlu\n\n#XTIT,20: W7: Title of pop-up used in confirm popup\nCONFIRM_TITLE=Confirmare\n\n# XFLD,20: Contact Detail field for  Academic Title\nCONTACT_ACADEMIC_TITLE=Titlu academic\n\n# XMSG : Contact creation succeeded\nCREATION_SUCCESS=Persoan\\u0103 de contact creat\\u0103\n\n# XMSG : Contact creation failed\nCREATION_ERROR=Creare nereu\\u015Fit\\u0103\n\n# XMSG : Contact creation succeeded\nUPDATE_SUCCESS=Persoan\\u0103 de contact actualizat\\u0103\n\n# XMSG : Contact creation failed\nUPDATE_ERROR=Actualizare nereu\\u015Fit\\u0103\n\n# XMSG : Contact creation : nothing has been changed\nNO_CHANGE=F\\u0103r\\u0103 modific\\u0103ri efectuate\n\n# XMSG: message that will be displayed, if not all mandatory fields are not filled\nMSG_MANDATORY_FIELDS=Nu toate c\\u00E2mpurile de intrare obligatorie sunt completate\n\n# XMSG : Photo update failed\nUPDATE_PHOTO_ERROR=Actualizare fotografie nereu\\u015Fit\\u0103\n\n\n# XBUT,10: OK\nOK=OK\n\n# XMSG: Cancel confirmation\nCONFIRM_CANCEL=Orice modific\\u0103ri nesalvate vor fi pierdute. Dori\\u0163i s\\u0103 continua\\u0163i?\n\n# XBUT,30: Add photo\nADD_PHOTO=Ad\\u0103ugare fotografie\n\n#XMSG\nNO_ITEMS_AVAILABLE=\\u00CEn prezent nu sunt disponibile pozi\\u0163ii\n\n# XBUT,30: add field\nADD_FIELD=Ad\\u0103ugare c\\u00E2mp\n\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\nFILTERED_BY_ALL_CONTACTS=Filtrat dup\\u0103\\: toate persoanele de contact\n\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\nFILTERED_BY_MY_CONTACTS=Filtrat dup\\u0103\\: persoanele mele de contact\n\n#XFLD,20: Information "Filtered By: [value]" displayed in the master list information bar\nFILTERED_BY=Filtrat dup\\u0103\\: {0}\n\n#XFLD,20: Placeholder for the select account input\nSELECT_ACCOUNT=Selectare cont\n\n#XFLD,20: Placeholder for the search in the select account dialog\nSEARCH=C\\u0103utare\n\n#XFLD,20: No Data text after loading/searching list\nNO_DATA_TEXT=F\\u0103r\\u0103 date\n\n#XFLD,20: No Data text when loading/searching list\nLOADING_TEXT=\\u00CEnc\\u0103rcare ...\n\n# XMSG: message that will be displayed in case of conflicting data during account editing\nMSG_CONFLICTING_DATA=Datele au fost modificate de alt utilizator. Dori\\u0163i s\\u0103 suprascrie\\u0163i modific\\u0103rile celuilalt utilizator cu ale dvs.?\n\n# XMSG: message that will be displayed in case of conflicts during file renaming\nMSG_CONFLICTING_FILE_NAME=Numele de fi\\u015Fier a fost modificat de alt utilizator. Dori\\u0163i s\\u0103 suprascrie\\u0163i modific\\u0103rile celuilalt utilizator cu ale dvs.?\n',
	"cus/crm/mycontacts/i18n/i18n_ru.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT,20: this is the title for the master section when "All Contacts" are displayed\r\nMASTER_TITLE=\\u0412\\u0441\\u0435 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u044B ({0})\r\n\r\n#XTIT,20: this is the title for the master section when "My Contacts" are displayed\r\nMASTER_TITLE_FOR_MY_CONTACTS=\\u041C\\u043E\\u0438 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u044B ({0})\r\n\r\n#XTIT,20 : this is the title for the detail section\r\nDETAIL_TITLE=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=\\u0412\\u0441\\u0442\\u0430\\u0432\\u044C\\u0442\\u0435 \\u0443\\u043F\\u0440\\u0430\\u0432\\u043B\\u044F\\u044E\\u0449\\u0438\\u0435 \\u044D\\u043B\\u0435\\u043C\\u0435\\u043D\\u0442\\u044B\r\n\r\n#XFLD,20: All contacts for filter\r\nALL_CONTACTS=\\u0412\\u0441\\u0435 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u044B\r\n\r\n#XFLD,30: My contacts for filter\r\nMY_CONTACTS=\\u041C\\u043E\\u0438 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u044B\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u044B\r\n\r\n# XFLD,40: Spinning wheel text\r\nMASTER_BUSY_TEXT=\\u0417\\u0430\\u0433\\u0440\\u0443\\u0437\\u043A\\u0430 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u043E\\u0432...\r\n\r\n# XFLD,40: Text in result list if no entries exist\r\nMASTER_LIST_NODATA=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u044B \\u043D\\u0435 \\u043D\\u0430\\u0439\\u0434\\u0435\\u043D\\u044B\r\n\r\n# XFLD,20: Search default test\r\nMASTER_SEARCH_PLACEHOLDER=\\u041F\\u043E\\u0438\\u0441\\u043A\r\n\r\n# XTOL,50: Search default test\r\nMASTER_SEARCH_TOOLTIP=\\u041F\\u043E\\u0438\\u0441\\u043A \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u043E\\u0432\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE1=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u044B\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE2=\\u041C\\u043E\\u0438 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u044B\r\n\r\n# XTIT,50: Detail View title name\r\nDETAILS_TITLE=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n\r\n# XFLD,20: Contact Detail field for E-Mail\r\nCONTACT_EMAIL=\\u042D\\u043B\\u0435\\u043A\\u0442\\u0440\\u043E\\u043D\\u043D\\u0430\\u044F \\u043F\\u043E\\u0447\\u0442\\u0430\r\n\r\n# XFLD,20: Contact Detail field for Mobile Phone\r\nCONTACT_MOBILE_PHONE=\\u041C\\u043E\\u0431\\u0438\\u043B\\u044C\\u043D\\u044B\\u0439\r\n\r\n# XFLD,20: Contact Detail field for Phone\r\nCONTACT_PHONE=\\u0422\\u0435\\u043B\\u0435\\u0444\\u043E\\u043D\r\n\r\n# XFLD,20: Contact Detail field for Company\r\nCONTACT_ACCOUNT=\\u041A\\u043B\\u0438\\u0435\\u043D\\u0442\r\n\r\n# XFLD,20: Contact Detail field for Job Function\r\nCONTACT_FUNCTION=\\u0424\\u0443\\u043D\\u043A\\u0446\\u0438\\u044F\r\n\r\n# XFLD,20: Contact Detail field for First Name\r\nCONTACT_FIRST_NAME=\\u0418\\u043C\\u044F\r\n\r\n# XFLD,20: Contact Detail field for Last Name\r\nCONTACT_LAST_NAME=\\u0424\\u0430\\u043C\\u0438\\u043B\\u0438\\u044F\r\n\r\n# XFLD,20: Contact Detail field for Postal Code\r\nCONTACT_POSTAL_CODE=\\u041F\\u043E\\u0447\\u0442\\u043E\\u0432\\u044B\\u0439 \\u0438\\u043D\\u0434\\u0435\\u043A\\u0441\r\n\r\n# XFLD,20: Contact Detail field for Address\r\nCONTACT_ADDRESS=\\u0410\\u0434\\u0440\\u0435\\u0441\r\n\r\n# XTIT,50: Edit Detail View title name\r\nEDIT_DETAILS_TITLE=\\u041E\\u0431\\u0440\\u0430\\u0431\\u043E\\u0442\\u0430\\u0442\\u044C \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n\r\n# XTIT,50: Contact Detail View title name\r\nCONTACT_DETAILS_TITLE=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u043D\\u0430\\u044F \\u0438\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0438\\u044F\r\n\r\n#XBUT,20\r\nS3_EDIT=\\u041E\\u0431\\u0440\\u0430\\u0431\\u043E\\u0442\\u0430\\u0442\\u044C\r\n\r\n#XBUT,20\r\nS4_SAVE=\\u0421\\u043E\\u0445\\u0440\\u0430\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XBUT,20\r\nS4_CANCEL=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\r\n\r\n# XTIT,50: New contact title\r\nNEW_CONTACT=\\u041D\\u043E\\u0432\\u044B\\u0439 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n\r\n# XTIT,50: Edit contact title\r\nEDIT_CONTACT=\\u041E\\u0431\\u0440\\u0430\\u0431\\u043E\\u0442\\u0430\\u0442\\u044C \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n\r\n# XTIT,60: Shows which contact is the Main Contact\r\nMAIN_CONTACT=\\u041E\\u0441\\u043D\\u043E\\u0432\\u043D\\u043E\\u0439 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n\r\n# XFLD,20: Contact Detail field for Birthday\r\nCONTACT_BIRTHDAY=\\u0414\\u0430\\u0442\\u0430 \\u0440\\u043E\\u0436\\u0434\\u0435\\u043D\\u0438\\u044F\r\n\r\n# XFLD,20: Contact Detail field for Note\r\nCONTACT_NOTE=\\u041F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u0435\r\n\r\n# XFLD,20: Contact Detail field for Job Department\r\nCONTACT_DEPARTMENT=\\u041F\\u043E\\u0434\\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\\u0435\\u043D\\u0438\\u0435\r\n\r\n# XFLD,20: Contact Detail field for Contact Title\r\nCONTACT_TITLE=\\u041E\\u0431\\u0440\\u0430\\u0449\\u0435\\u043D\\u0438\\u0435\r\n\r\n#XTIT,20: W7: Title of pop-up used in confirm popup\r\nCONFIRM_TITLE=\\u041F\\u043E\\u0434\\u0442\\u0432\\u0435\\u0440\\u0434\\u0438\\u0442\\u044C\r\n\r\n# XFLD,20: Contact Detail field for  Academic Title\r\nCONTACT_ACADEMIC_TITLE=\\u0423\\u0447\\u0435\\u043D\\u0430\\u044F \\u0441\\u0442\\u0435\\u043F\\u0435\\u043D\\u044C\r\n\r\n# XMSG : Contact creation succeeded\r\nCREATION_SUCCESS=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442 \\u0441\\u043E\\u0437\\u0434\\u0430\\u043D\r\n\r\n# XMSG : Contact creation failed\r\nCREATION_ERROR=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u0441\\u043E\\u0437\\u0434\\u0430\\u0442\\u044C\r\n\r\n# XMSG : Contact creation succeeded\r\nUPDATE_SUCCESS=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442 \\u043E\\u0431\\u043D\\u043E\\u0432\\u043B\\u0435\\u043D\r\n\r\n# XMSG : Contact creation failed\r\nUPDATE_ERROR=\\u0421\\u0431\\u043E\\u0439 \\u043E\\u0431\\u043D\\u043E\\u0432\\u043B\\u0435\\u043D\\u0438\\u044F\r\n\r\n# XMSG : Contact creation : nothing has been changed\r\nNO_CHANGE=\\u041D\\u0435\\u0442 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u0439\r\n\r\n# XMSG: message that will be displayed, if not all mandatory fields are not filled\r\nMSG_MANDATORY_FIELDS=\\u041D\\u0435 \\u0432\\u0441\\u0435 \\u043E\\u0431\\u044F\\u0437\\u0430\\u0442\\u0435\\u043B\\u044C\\u043D\\u044B\\u0435 \\u043F\\u043E\\u043B\\u044F \\u0437\\u0430\\u043F\\u043E\\u043B\\u043D\\u0435\\u043D\\u044B\r\n\r\n# XMSG : Photo update failed\r\nUPDATE_PHOTO_ERROR=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u043E\\u0431\\u043D\\u043E\\u0432\\u0438\\u0442\\u044C \\u0444\\u043E\\u0442\\u043E\r\n\r\n\r\n# XBUT,10: OK\r\nOK=\\u041E\\u041A\r\n\r\n# XMSG: Cancel confirmation\r\nCONFIRM_CANCEL=\\u0412\\u0441\\u0435 \\u043D\\u0435\\u0441\\u043E\\u0445\\u0440\\u0430\\u043D\\u0435\\u043D\\u043D\\u044B\\u0435 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F \\u0431\\u0443\\u0434\\u0443\\u0442 \\u043F\\u043E\\u0442\\u0435\\u0440\\u044F\\u043D\\u044B. \\u041F\\u0440\\u043E\\u0434\\u043E\\u043B\\u0436\\u0438\\u0442\\u044C?\r\n\r\n# XBUT,30: Add photo\r\nADD_PHOTO=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u0444\\u043E\\u0442\\u043E\r\n\r\n#XMSG\r\nNO_ITEMS_AVAILABLE=\\u0412 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0439 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442 \\u043D\\u0435\\u0442 \\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\\u0445 \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u0439\r\n\r\n# XBUT,30: add field\r\nADD_FIELD=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u043F\\u043E\\u043B\\u0435\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_ALL_CONTACTS=\\u041E\\u0442\\u0444\\u0438\\u043B\\u044C\\u0442\\u0440\\u043E\\u0432\\u0430\\u043D\\u043E \\u043F\\u043E\\: \\u0432\\u0441\\u0435 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u044B\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_MY_CONTACTS=\\u041E\\u0442\\u0444\\u0438\\u043B\\u044C\\u0442\\u0440\\u043E\\u0432\\u0430\\u043D\\u043E \\u043F\\u043E\\: \\u043C\\u043E\\u0438 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u044B\r\n\r\n#XFLD,20: Information "Filtered By: [value]" displayed in the master list information bar\r\nFILTERED_BY=\\u041E\\u0442\\u0444\\u0438\\u043B\\u044C\\u0442\\u0440\\u043E\\u0432\\u0430\\u043D\\u043E \\u043F\\u043E\\: {0}\r\n\r\n#XFLD,20: Placeholder for the select account input\r\nSELECT_ACCOUNT=\\u0412\\u044B\\u0431\\u0440\\u0430\\u0442\\u044C \\u0441\\u0447\\u0435\\u0442\r\n\r\n#XFLD,20: Placeholder for the search in the select account dialog\r\nSEARCH=\\u041F\\u043E\\u0438\\u0441\\u043A\r\n\r\n#XFLD,20: No Data text after loading/searching list\r\nNO_DATA_TEXT=\\u041D\\u0435\\u0442 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0445\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=\\u0417\\u0430\\u0433\\u0440\\u0443\\u0437\\u043A\\u0430...\r\n\r\n# XMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=\\u0414\\u0430\\u043D\\u043D\\u044B\\u0435 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u044B \\u0434\\u0440\\u0443\\u0433\\u0438\\u043C \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u0435\\u043C. \\u041F\\u0435\\u0440\\u0435\\u0437\\u0430\\u043F\\u0438\\u0441\\u0430\\u0442\\u044C \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F \\u0434\\u0440\\u0443\\u0433\\u043E\\u0433\\u043E \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044F \\u0441\\u0432\\u043E\\u0438\\u043C\\u0438?\r\n\r\n# XMSG: message that will be displayed in case of conflicts during file renaming\r\nMSG_CONFLICTING_FILE_NAME=\\u0418\\u043C\\u044F \\u0444\\u0430\\u0439\\u043B\\u0430 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u043E \\u0434\\u0440\\u0443\\u0433\\u0438\\u043C \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u0435\\u043C. \\u041F\\u0435\\u0440\\u0435\\u0437\\u0430\\u043F\\u0438\\u0441\\u0430\\u0442\\u044C \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F \\u0434\\u0440\\u0443\\u0433\\u043E\\u0433\\u043E \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044F \\u0441\\u0432\\u043E\\u0438\\u043C\\u0438?\r\n',
	"cus/crm/mycontacts/i18n/i18n_sh.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\n\n# Note: This file was created according to the conventions that can be found at \n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\n\n#XTIT,20: this is the title for the master section when "All Contacts" are displayed\nMASTER_TITLE=Svi kontakti ({0})\n\n#XTIT,20: this is the title for the master section when "My Contacts" are displayed\nMASTER_TITLE_FOR_MY_CONTACTS=Moji kontakti ({0})\n\n#XTIT,20 : this is the title for the detail section\nDETAIL_TITLE=Kontakt\n\n#XFLD, 30: this is the place holder dummy in the detail page\nDETAIL_TEXT=Ovde unesite kontrole\n\n#XFLD,20: All contacts for filter\nALL_CONTACTS=Svi kontakti\n\n#XFLD,30: My contacts for filter\nMY_CONTACTS=Moji kontakti\n\n# XTIT,40: Application title\nSHELL_TITLE=Kontakti\n\n# XFLD,40: Spinning wheel text\nMASTER_BUSY_TEXT=U\\u010Ditavanje kontakata...\n\n# XFLD,40: Text in result list if no entries exist\nMASTER_LIST_NODATA=Kontakti nisu na\\u0111eni\n\n# XFLD,20: Search default test\nMASTER_SEARCH_PLACEHOLDER=Tra\\u017Ei\n\n# XTOL,50: Search default test\nMASTER_SEARCH_TOOLTIP=Tra\\u017Ei kontakte\n\n# XTIT,40: Title for the list\nMASTER_TITLE1=Kontakti\n\n# XTIT,40: Title for the list\nMASTER_TITLE2=Moji kontakti\n\n# XTIT,50: Detail View title name\nDETAILS_TITLE=Kontakt\n\n# XFLD,20: Contact Detail field for E-Mail\nCONTACT_EMAIL=E-po\\u0161ta\n\n# XFLD,20: Contact Detail field for Mobile Phone\nCONTACT_MOBILE_PHONE=Mobilni telefon\n\n# XFLD,20: Contact Detail field for Phone\nCONTACT_PHONE=Telefon\n\n# XFLD,20: Contact Detail field for Company\nCONTACT_ACCOUNT=Ra\\u010Dun\n\n# XFLD,20: Contact Detail field for Job Function\nCONTACT_FUNCTION=Funkcija\n\n# XFLD,20: Contact Detail field for First Name\nCONTACT_FIRST_NAME=Ime\n\n# XFLD,20: Contact Detail field for Last Name\nCONTACT_LAST_NAME=Prezime\n\n# XFLD,20: Contact Detail field for Postal Code\nCONTACT_POSTAL_CODE=Po\\u0161tanski broj\n\n# XFLD,20: Contact Detail field for Address\nCONTACT_ADDRESS=Adresa\n\n# XTIT,50: Edit Detail View title name\nEDIT_DETAILS_TITLE=Uredi kontakt\n\n# XTIT,50: Contact Detail View title name\nCONTACT_DETAILS_TITLE=Detalji kontakta\n\n#XBUT,20\nS3_EDIT=Uredi\n\n#XBUT,20\nS4_SAVE=Sa\\u010Duvaj\n\n#XBUT,20\nS4_CANCEL=Odustani\n\n# XTIT,50: New contact title\nNEW_CONTACT=Novi kontakt\n\n# XTIT,50: Edit contact title\nEDIT_CONTACT=Uredi kontakt\n\n# XTIT,60: Shows which contact is the Main Contact\nMAIN_CONTACT=Glavni kontakt\n\n# XFLD,20: Contact Detail field for Birthday\nCONTACT_BIRTHDAY=Datum ro\\u0111enja\n\n# XFLD,20: Contact Detail field for Note\nCONTACT_NOTE=Bele\\u0161ka\n\n# XFLD,20: Contact Detail field for Job Department\nCONTACT_DEPARTMENT=Odeljak\n\n# XFLD,20: Contact Detail field for Contact Title\nCONTACT_TITLE=Naslov\n\n#XTIT,20: W7: Title of pop-up used in confirm popup\nCONFIRM_TITLE=Potvrdi\n\n# XFLD,20: Contact Detail field for  Academic Title\nCONTACT_ACADEMIC_TITLE=Akademska titula\n\n# XMSG : Contact creation succeeded\nCREATION_SUCCESS=Kontakt kreiran\n\n# XMSG : Contact creation failed\nCREATION_ERROR=Kreiranje nije uspelo\n\n# XMSG : Contact creation succeeded\nUPDATE_SUCCESS=Kontakt a\\u017Euriran\n\n# XMSG : Contact creation failed\nUPDATE_ERROR=A\\u017Euriranje nije uspelo\n\n# XMSG : Contact creation : nothing has been changed\nNO_CHANGE=Promene nisu izvr\\u0161ene\n\n# XMSG: message that will be displayed, if not all mandatory fields are not filled\nMSG_MANDATORY_FIELDS=Nisu popunjena sva obavezna polja\n\n# XMSG : Photo update failed\nUPDATE_PHOTO_ERROR=A\\u017Euriranje fotografije nije uspelo\n\n\n# XBUT,10: OK\nOK=OK\n\n# XMSG: Cancel confirmation\nCONFIRM_CANCEL=Sve nesa\\u010Duvane promene \\u0107e biti izgubljene. Da li \\u017Eelite da nastavite?\n\n# XBUT,30: Add photo\nADD_PHOTO=Dodaj fotografiju\n\n#XMSG\nNO_ITEMS_AVAILABLE=Stavke trenutno nisu dostupne\n\n# XBUT,30: add field\nADD_FIELD=Dodaj polje\n\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\nFILTERED_BY_ALL_CONTACTS=Filtrirano po\\: Svi kontakti\n\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\nFILTERED_BY_MY_CONTACTS=Filtrirano po\\: Moji kontakti\n\n#XFLD,20: Information "Filtered By: [value]" displayed in the master list information bar\nFILTERED_BY=Filtrirano po\\: {0}\n\n#XFLD,20: Placeholder for the select account input\nSELECT_ACCOUNT=Odaberi klijenta\n\n#XFLD,20: Placeholder for the search in the select account dialog\nSEARCH=Tra\\u017Ei\n\n#XFLD,20: No Data text after loading/searching list\nNO_DATA_TEXT=Nema podataka\n\n#XFLD,20: No Data text when loading/searching list\nLOADING_TEXT=U\\u010Ditavanje...\n\n# XMSG: message that will be displayed in case of conflicting data during account editing\nMSG_CONFLICTING_DATA=Podatke je zamenio drugi korisnik. Da li \\u017Eelite da pi\\u0161ete sopstvene promene preko promena drugog korisnika?\n\n# XMSG: message that will be displayed in case of conflicts during file renaming\nMSG_CONFLICTING_FILE_NAME=Naziv fajla je promenio drugi korisnik. Da li \\u017Eelite da pi\\u0161ete sopstvene promene preko promena drugog korisnika?\n',
	"cus/crm/mycontacts/i18n/i18n_sk.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\n\n# Note: This file was created according to the conventions that can be found at \n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\n\n#XTIT,20: this is the title for the master section when "All Contacts" are displayed\nMASTER_TITLE=V\\u0161etky kontakty ({0})\n\n#XTIT,20: this is the title for the master section when "My Contacts" are displayed\nMASTER_TITLE_FOR_MY_CONTACTS=Moje kontakty ({0})\n\n#XTIT,20 : this is the title for the detail section\nDETAIL_TITLE=Kontakt\n\n#XFLD, 30: this is the place holder dummy in the detail page\nDETAIL_TEXT=Sem vlo\\u017Ete ovl\\u00E1dacie prvky\n\n#XFLD,20: All contacts for filter\nALL_CONTACTS=V\\u0161etky kontakty\n\n#XFLD,30: My contacts for filter\nMY_CONTACTS=Moje kontakty\n\n# XTIT,40: Application title\nSHELL_TITLE=Kontakty\n\n# XFLD,40: Spinning wheel text\nMASTER_BUSY_TEXT=Na\\u010D\\u00EDtanie kontaktov...\n\n# XFLD,40: Text in result list if no entries exist\nMASTER_LIST_NODATA=Neboli n\\u00E1jden\\u00E9 \\u017Eiadne kontakty\n\n# XFLD,20: Search default test\nMASTER_SEARCH_PLACEHOLDER=H\\u013Eada\\u0165\n\n# XTOL,50: Search default test\nMASTER_SEARCH_TOOLTIP=H\\u013Eada\\u0165 kontakty\n\n# XTIT,40: Title for the list\nMASTER_TITLE1=Kontakty\n\n# XTIT,40: Title for the list\nMASTER_TITLE2=Moje kontakty\n\n# XTIT,50: Detail View title name\nDETAILS_TITLE=Kontakt\n\n# XFLD,20: Contact Detail field for E-Mail\nCONTACT_EMAIL=E-mail\n\n# XFLD,20: Contact Detail field for Mobile Phone\nCONTACT_MOBILE_PHONE=Mobiln\\u00FD telef\\u00F3n\n\n# XFLD,20: Contact Detail field for Phone\nCONTACT_PHONE=Telef\\u00F3n\n\n# XFLD,20: Contact Detail field for Company\nCONTACT_ACCOUNT=Z\\u00E1kazn\\u00EDk\n\n# XFLD,20: Contact Detail field for Job Function\nCONTACT_FUNCTION=Funkcia\n\n# XFLD,20: Contact Detail field for First Name\nCONTACT_FIRST_NAME=Meno\n\n# XFLD,20: Contact Detail field for Last Name\nCONTACT_LAST_NAME=Priezvisko\n\n# XFLD,20: Contact Detail field for Postal Code\nCONTACT_POSTAL_CODE=PS\\u010C\n\n# XFLD,20: Contact Detail field for Address\nCONTACT_ADDRESS=Adresa\n\n# XTIT,50: Edit Detail View title name\nEDIT_DETAILS_TITLE=Upravi\\u0165 kontakt\n\n# XTIT,50: Contact Detail View title name\nCONTACT_DETAILS_TITLE=Detaily kontaktu\n\n#XBUT,20\nS3_EDIT=Upravi\\u0165\n\n#XBUT,20\nS4_SAVE=Ulo\\u017Ei\\u0165\n\n#XBUT,20\nS4_CANCEL=Zru\\u0161i\\u0165\n\n# XTIT,50: New contact title\nNEW_CONTACT=Nov\\u00FD kontakt\n\n# XTIT,50: Edit contact title\nEDIT_CONTACT=Upravi\\u0165 kontakt\n\n# XTIT,60: Shows which contact is the Main Contact\nMAIN_CONTACT=Hlavn\\u00FD kontakt\n\n# XFLD,20: Contact Detail field for Birthday\nCONTACT_BIRTHDAY=D\\u00E1tum narodenia\n\n# XFLD,20: Contact Detail field for Note\nCONTACT_NOTE=Pozn\\u00E1mka\n\n# XFLD,20: Contact Detail field for Job Department\nCONTACT_DEPARTMENT=Oddelenie\n\n# XFLD,20: Contact Detail field for Contact Title\nCONTACT_TITLE=Oslovenie\n\n#XTIT,20: W7: Title of pop-up used in confirm popup\nCONFIRM_TITLE=Potvrdi\\u0165\n\n# XFLD,20: Contact Detail field for  Academic Title\nCONTACT_ACADEMIC_TITLE=Akademick\\u00FD titul\n\n# XMSG : Contact creation succeeded\nCREATION_SUCCESS=Kontakt vytvoren\\u00FD\n\n# XMSG : Contact creation failed\nCREATION_ERROR=Vytvorenie sa nepodarilo\n\n# XMSG : Contact creation succeeded\nUPDATE_SUCCESS=Kontakt aktualizovan\\u00FD\n\n# XMSG : Contact creation failed\nUPDATE_ERROR=Aktualiz\\u00E1cia sa nepodarila\n\n# XMSG : Contact creation : nothing has been changed\nNO_CHANGE=Neboli vykonan\\u00E9 \\u017Eiadne zmeny\n\n# XMSG: message that will be displayed, if not all mandatory fields are not filled\nMSG_MANDATORY_FIELDS=Nie s\\u00FA vyplnen\\u00E9 v\\u0161etky povinn\\u00E9 polia\n\n# XMSG : Photo update failed\nUPDATE_PHOTO_ERROR=Nepodarilo sa aktualizova\\u0165 fotografiu\n\n\n# XBUT,10: OK\nOK=OK\n\n# XMSG: Cancel confirmation\nCONFIRM_CANCEL=V\\u0161etky neulo\\u017Een\\u00E9 zmeny sa stratia. Chcete pokra\\u010Dova\\u0165?\n\n# XBUT,30: Add photo\nADD_PHOTO=Prida\\u0165 fotografiu\n\n#XMSG\nNO_ITEMS_AVAILABLE=Aktu\\u00E1lne nie s\\u00FA k dispoz\\u00EDcii \\u017Eiadne polo\\u017Eky\n\n# XBUT,30: add field\nADD_FIELD=Prida\\u0165 pole\n\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\nFILTERED_BY_ALL_CONTACTS=Filtrovan\\u00E9 pod\\u013Ea\\: V\\u0161etky kontakty\n\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\nFILTERED_BY_MY_CONTACTS=Filtrovan\\u00E9 pod\\u013Ea\\: Moje kontakty\n\n#XFLD,20: Information "Filtered By: [value]" displayed in the master list information bar\nFILTERED_BY=Filtrovan\\u00E9 pod\\u013Ea\\: {0}\n\n#XFLD,20: Placeholder for the select account input\nSELECT_ACCOUNT=Vybra\\u0165 z\\u00E1kazn\\u00EDka\n\n#XFLD,20: Placeholder for the search in the select account dialog\nSEARCH=H\\u013Eada\\u0165\n\n#XFLD,20: No Data text after loading/searching list\nNO_DATA_TEXT=\\u017Diadne d\\u00E1ta\n\n#XFLD,20: No Data text when loading/searching list\nLOADING_TEXT=Na\\u010D\\u00EDtava sa...\n\n# XMSG: message that will be displayed in case of conflicting data during account editing\nMSG_CONFLICTING_DATA=D\\u00E1ta zmenil in\\u00FD pou\\u017E\\u00EDvate\\u013E. Chcete zmeny in\\u00E9ho pou\\u017E\\u00EDvate\\u013Ea prep\\u00EDsa\\u0165 vlastn\\u00FDmi zmenami?\n\n# XMSG: message that will be displayed in case of conflicts during file renaming\nMSG_CONFLICTING_FILE_NAME=N\\u00E1zov s\\u00FAboru zmenil in\\u00FD pou\\u017E\\u00EDvate\\u013E. Chcete zmeny in\\u00E9ho pou\\u017E\\u00EDvate\\u013Ea prep\\u00EDsa\\u0165 vlastn\\u00FDmi zmenami?\n',
	"cus/crm/mycontacts/i18n/i18n_sl.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\n\n# Note: This file was created according to the conventions that can be found at \n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\n\n#XTIT,20: this is the title for the master section when "All Contacts" are displayed\nMASTER_TITLE=Vsi kontakti ({0})\n\n#XTIT,20: this is the title for the master section when "My Contacts" are displayed\nMASTER_TITLE_FOR_MY_CONTACTS=Moji kontakti ({0})\n\n#XTIT,20 : this is the title for the detail section\nDETAIL_TITLE=Kontakt\n\n#XFLD, 30: this is the place holder dummy in the detail page\nDETAIL_TEXT=Tukaj vnesite svoje nadzore\n\n#XFLD,20: All contacts for filter\nALL_CONTACTS=Vse kontaktne osebe\n\n#XFLD,30: My contacts for filter\nMY_CONTACTS=Moje kontaktne osebe\n\n# XTIT,40: Application title\nSHELL_TITLE=Kontaktne osebe\n\n# XFLD,40: Spinning wheel text\nMASTER_BUSY_TEXT=Nalaganje kontaktov ...\n\n# XFLD,40: Text in result list if no entries exist\nMASTER_LIST_NODATA=Kontakti niso najdeni\n\n# XFLD,20: Search default test\nMASTER_SEARCH_PLACEHOLDER=Iskanje\n\n# XTOL,50: Search default test\nMASTER_SEARCH_TOOLTIP=Iskanje kontaktov\n\n# XTIT,40: Title for the list\nMASTER_TITLE1=Kontaktne osebe\n\n# XTIT,40: Title for the list\nMASTER_TITLE2=Moje kontaktne osebe\n\n# XTIT,50: Detail View title name\nDETAILS_TITLE=Kontakt\n\n# XFLD,20: Contact Detail field for E-Mail\nCONTACT_EMAIL=E-po\\u0161ta\n\n# XFLD,20: Contact Detail field for Mobile Phone\nCONTACT_MOBILE_PHONE=Mobilna naprava\n\n# XFLD,20: Contact Detail field for Phone\nCONTACT_PHONE=Telefon\n\n# XFLD,20: Contact Detail field for Company\nCONTACT_ACCOUNT=Konto\n\n# XFLD,20: Contact Detail field for Job Function\nCONTACT_FUNCTION=Funkcija\n\n# XFLD,20: Contact Detail field for First Name\nCONTACT_FIRST_NAME=Ime\n\n# XFLD,20: Contact Detail field for Last Name\nCONTACT_LAST_NAME=Priimek\n\n# XFLD,20: Contact Detail field for Postal Code\nCONTACT_POSTAL_CODE=Po\\u0161tna \\u0161tevilka\n\n# XFLD,20: Contact Detail field for Address\nCONTACT_ADDRESS=Naslov\n\n# XTIT,50: Edit Detail View title name\nEDIT_DETAILS_TITLE=Urejanje kontakta\n\n# XTIT,50: Contact Detail View title name\nCONTACT_DETAILS_TITLE=Detajli kontakta\n\n#XBUT,20\nS3_EDIT=Obdelava\n\n#XBUT,20\nS4_SAVE=Shranjevanje\n\n#XBUT,20\nS4_CANCEL=Prekinitev\n\n# XTIT,50: New contact title\nNEW_CONTACT=Nov kontakt\n\n# XTIT,50: Edit contact title\nEDIT_CONTACT=Urejanje kontakta\n\n# XTIT,60: Shows which contact is the Main Contact\nMAIN_CONTACT=Glavna kontaktna oseba\n\n# XFLD,20: Contact Detail field for Birthday\nCONTACT_BIRTHDAY=Datum rojstva\n\n# XFLD,20: Contact Detail field for Note\nCONTACT_NOTE=Opomba\n\n# XFLD,20: Contact Detail field for Job Department\nCONTACT_DEPARTMENT=Oddelek\n\n# XFLD,20: Contact Detail field for Contact Title\nCONTACT_TITLE=Naslov\n\n#XTIT,20: W7: Title of pop-up used in confirm popup\nCONFIRM_TITLE=Potrditev\n\n# XFLD,20: Contact Detail field for  Academic Title\nCONTACT_ACADEMIC_TITLE=Akademski naslov\n\n# XMSG : Contact creation succeeded\nCREATION_SUCCESS=Kontakt kreiran\n\n# XMSG : Contact creation failed\nCREATION_ERROR=Kreiranje ni uspelo\n\n# XMSG : Contact creation succeeded\nUPDATE_SUCCESS=Kontakt a\\u017Euriran\n\n# XMSG : Contact creation failed\nUPDATE_ERROR=A\\u017Euriranje ni uspelo\n\n# XMSG : Contact creation : nothing has been changed\nNO_CHANGE=Ni bilo izvedenih sprememb\n\n# XMSG: message that will be displayed, if not all mandatory fields are not filled\nMSG_MANDATORY_FIELDS=Izpolnjena niso vsa obvezna polja\n\n# XMSG : Photo update failed\nUPDATE_PHOTO_ERROR=A\\u017Euriranje fotografije ni uspelo\n\n\n# XBUT,10: OK\nOK=OK\n\n# XMSG: Cancel confirmation\nCONFIRM_CANCEL=Vse neshranjene spremembe bodo izgubljene. \\u017Delite nadaljevati?\n\n# XBUT,30: Add photo\nADD_PHOTO=Dodajanje fotografije\n\n#XMSG\nNO_ITEMS_AVAILABLE=Trenutno ni razpolo\\u017Eljivih postavk\n\n# XBUT,30: add field\nADD_FIELD=Dodajanje polja\n\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\nFILTERED_BY_ALL_CONTACTS=Filtrirano po\\: Vse kontaktne osebe\n\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\nFILTERED_BY_MY_CONTACTS=Filtrirano po\\: Moje kontaktne osebe\n\n#XFLD,20: Information "Filtered By: [value]" displayed in the master list information bar\nFILTERED_BY=Filtrirano po\\: {0}\n\n#XFLD,20: Placeholder for the select account input\nSELECT_ACCOUNT=Izbira stranke\n\n#XFLD,20: Placeholder for the search in the select account dialog\nSEARCH=Iskanje\n\n#XFLD,20: No Data text after loading/searching list\nNO_DATA_TEXT=Ni podatkov\n\n#XFLD,20: No Data text when loading/searching list\nLOADING_TEXT=Nalaganje poteka ...\n\n# XMSG: message that will be displayed in case of conflicting data during account editing\nMSG_CONFLICTING_DATA=Podatke je spremenil drug uporabnik. \\u017Delite prepisati spremembe drugega uporabnika s svojimi?\n\n# XMSG: message that will be displayed in case of conflicts during file renaming\nMSG_CONFLICTING_FILE_NAME=Naziv datoteke je spremenil drug uporabnik. \\u017Delite prepisati spremembe drugega uporabnika s svojimi?\n',
	"cus/crm/mycontacts/i18n/i18n_tr.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT,20: this is the title for the master section when "All Contacts" are displayed\r\nMASTER_TITLE=T\\u00FCm ilgili ki\\u015Filer ({0})\r\n\r\n#XTIT,20: this is the title for the master section when "My Contacts" are displayed\r\nMASTER_TITLE_FOR_MY_CONTACTS=\\u0130lgili ki\\u015Filerim ({0})\r\n\r\n#XTIT,20 : this is the title for the detail section\r\nDETAIL_TITLE=\\u0130lgili ki\\u015Fi\r\n\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Kontrollerinizi buraya ekleyin\r\n\r\n#XFLD,20: All contacts for filter\r\nALL_CONTACTS=T\\u00FCm ilgili ki\\u015Filer\r\n\r\n#XFLD,30: My contacts for filter\r\nMY_CONTACTS=\\u0130lgili ki\\u015Filerim\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=\\u0130lgili ki\\u015Filer\r\n\r\n# XFLD,40: Spinning wheel text\r\nMASTER_BUSY_TEXT=\\u0130lgili ki\\u015Filer y\\u00FCkleniyor...\r\n\r\n# XFLD,40: Text in result list if no entries exist\r\nMASTER_LIST_NODATA=\\u0130lgili ki\\u015Fi bulunamad\\u0131\r\n\r\n# XFLD,20: Search default test\r\nMASTER_SEARCH_PLACEHOLDER=Ara\r\n\r\n# XTOL,50: Search default test\r\nMASTER_SEARCH_TOOLTIP=\\u0130lgili ki\\u015Filer i\\u00E7in arama\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE1=\\u0130lgili ki\\u015Filer\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE2=\\u0130lgili ki\\u015Filerim\r\n\r\n# XTIT,50: Detail View title name\r\nDETAILS_TITLE=\\u0130lgili ki\\u015Fi\r\n\r\n# XFLD,20: Contact Detail field for E-Mail\r\nCONTACT_EMAIL=E-posta\r\n\r\n# XFLD,20: Contact Detail field for Mobile Phone\r\nCONTACT_MOBILE_PHONE=Cep telefonu\r\n\r\n# XFLD,20: Contact Detail field for Phone\r\nCONTACT_PHONE=Telefon\r\n\r\n# XFLD,20: Contact Detail field for Company\r\nCONTACT_ACCOUNT=M\\u00FC\\u015Fteri\r\n\r\n# XFLD,20: Contact Detail field for Job Function\r\nCONTACT_FUNCTION=\\u0130\\u015Flev\r\n\r\n# XFLD,20: Contact Detail field for First Name\r\nCONTACT_FIRST_NAME=Ad\\u0131\r\n\r\n# XFLD,20: Contact Detail field for Last Name\r\nCONTACT_LAST_NAME=Soyad\\u0131\r\n\r\n# XFLD,20: Contact Detail field for Postal Code\r\nCONTACT_POSTAL_CODE=Posta kodu\r\n\r\n# XFLD,20: Contact Detail field for Address\r\nCONTACT_ADDRESS=Adres\r\n\r\n# XTIT,50: Edit Detail View title name\r\nEDIT_DETAILS_TITLE=\\u0130lgili ki\\u015Fiyi d\\u00FCzenle\r\n\r\n# XTIT,50: Contact Detail View title name\r\nCONTACT_DETAILS_TITLE=\\u0130lgili ki\\u015Fi ayr\\u0131nt\\u0131lar\\u0131\r\n\r\n#XBUT,20\r\nS3_EDIT=D\\u00FCzenle\r\n\r\n#XBUT,20\r\nS4_SAVE=Kaydet\r\n\r\n#XBUT,20\r\nS4_CANCEL=\\u0130ptal\r\n\r\n# XTIT,50: New contact title\r\nNEW_CONTACT=Yeni ilgili ki\\u015Fi\r\n\r\n# XTIT,50: Edit contact title\r\nEDIT_CONTACT=\\u0130lgili ki\\u015Fiyi d\\u00FCzenle\r\n\r\n# XTIT,60: Shows which contact is the Main Contact\r\nMAIN_CONTACT=Ana ilgili ki\\u015Fi\r\n\r\n# XFLD,20: Contact Detail field for Birthday\r\nCONTACT_BIRTHDAY=Do\\u011Fum tarihi\r\n\r\n# XFLD,20: Contact Detail field for Note\r\nCONTACT_NOTE=Not\r\n\r\n# XFLD,20: Contact Detail field for Job Department\r\nCONTACT_DEPARTMENT=Departman\r\n\r\n# XFLD,20: Contact Detail field for Contact Title\r\nCONTACT_TITLE=Ba\\u015Fl\\u0131k\r\n\r\n#XTIT,20: W7: Title of pop-up used in confirm popup\r\nCONFIRM_TITLE=Teyit et\r\n\r\n# XFLD,20: Contact Detail field for  Academic Title\r\nCONTACT_ACADEMIC_TITLE=Akademik unvan\r\n\r\n# XMSG : Contact creation succeeded\r\nCREATION_SUCCESS=\\u0130lgili ki\\u015Fi olu\\u015Fturuldu\r\n\r\n# XMSG : Contact creation failed\r\nCREATION_ERROR=Olu\\u015Fturma ba\\u015Far\\u0131s\\u0131z oldu\r\n\r\n# XMSG : Contact creation succeeded\r\nUPDATE_SUCCESS=\\u0130lgili ki\\u015Fi g\\u00FCncellendi\r\n\r\n# XMSG : Contact creation failed\r\nUPDATE_ERROR=G\\u00FCncelleme ba\\u015Far\\u0131s\\u0131z\r\n\r\n# XMSG : Contact creation : nothing has been changed\r\nNO_CHANGE=De\\u011Fi\\u015Fiklik yap\\u0131lmad\\u0131\r\n\r\n# XMSG: message that will be displayed, if not all mandatory fields are not filled\r\nMSG_MANDATORY_FIELDS=T\\u00FCm zorunlu alanlar doldurulmad\\u0131\r\n\r\n# XMSG : Photo update failed\r\nUPDATE_PHOTO_ERROR=Resim g\\u00FCncelleme ba\\u015Far\\u0131s\\u0131z\r\n\r\n\r\n# XBUT,10: OK\r\nOK=Tamam\r\n\r\n# XMSG: Cancel confirmation\r\nCONFIRM_CANCEL=Kaydedilmeyen de\\u011Fi\\u015Fiklikler kaybolacak. Devam etmek istiyor musunuz?\r\n\r\n# XBUT,30: Add photo\r\nADD_PHOTO=Foto\\u011Fraf ekle\r\n\r\n#XMSG\r\nNO_ITEMS_AVAILABLE=\\u015Eu anda kalem yok\r\n\r\n# XBUT,30: add field\r\nADD_FIELD=Alan ekle\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_ALL_CONTACTS=Filtreleme \\u00F6l\\u00E7\\u00FCt\\u00FC\\: T\\u00FCm ilgili ki\\u015Filer\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_MY_CONTACTS=Filtreleme \\u00F6l\\u00E7\\u00FCt\\u00FC\\: \\u0130lgili ki\\u015Filerim\r\n\r\n#XFLD,20: Information "Filtered By: [value]" displayed in the master list information bar\r\nFILTERED_BY=Filtreleme \\u00F6l\\u00E7\\u00FCt\\u00FC\\: {0}\r\n\r\n#XFLD,20: Placeholder for the select account input\r\nSELECT_ACCOUNT=M\\u00FC\\u015Fteri se\\u00E7\r\n\r\n#XFLD,20: Placeholder for the search in the select account dialog\r\nSEARCH=Ara\r\n\r\n#XFLD,20: No Data text after loading/searching list\r\nNO_DATA_TEXT=Veri mevcut de\\u011Fil\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=Y\\u00FCkleniyor...\r\n\r\n# XMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Veriler ba\\u015Fka kullan\\u0131c\\u0131 taraf\\u0131ndan de\\u011Fi\\u015Ftirildi. Di\\u011Fer kullan\\u0131c\\u0131n\\u0131n de\\u011Fi\\u015Fikliklerinin \\u00FCzerine kendikilerinizi yazmak istiyor musunuz?\r\n\r\n# XMSG: message that will be displayed in case of conflicts during file renaming\r\nMSG_CONFLICTING_FILE_NAME=Dosya ad\\u0131 ba\\u015Fka kullan\\u0131c\\u0131 taraf\\u0131ndan de\\u011Fi\\u015Ftirildi. Di\\u011Fer kullan\\u0131c\\u0131n\\u0131n de\\u011Fi\\u015Fikliklerinin \\u00FCzerine kendikilerinizi yazmak istiyor musunuz?\r\n',
	"cus/crm/mycontacts/i18n/i18n_zh_CN.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT,20: this is the title for the master section when "All Contacts" are displayed\r\nMASTER_TITLE=\\u6240\\u6709\\u8054\\u7CFB\\u4EBA ({0})\r\n\r\n#XTIT,20: this is the title for the master section when "My Contacts" are displayed\r\nMASTER_TITLE_FOR_MY_CONTACTS=\\u6211\\u7684\\u8054\\u7CFB\\u4EBA ({0})\r\n\r\n#XTIT,20 : this is the title for the detail section\r\nDETAIL_TITLE=\\u8054\\u7CFB\\u4EBA\r\n\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=\\u5728\\u6B64\\u5904\\u63D2\\u5165\\u63A7\\u4EF6\r\n\r\n#XFLD,20: All contacts for filter\r\nALL_CONTACTS=\\u5168\\u90E8\\u8054\\u7CFB\\u4EBA\r\n\r\n#XFLD,30: My contacts for filter\r\nMY_CONTACTS=\\u6211\\u7684\\u8054\\u7CFB\\u4EBA\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=\\u8054\\u7CFB\\u4EBA\r\n\r\n# XFLD,40: Spinning wheel text\r\nMASTER_BUSY_TEXT=\\u6B63\\u5728\\u52A0\\u8F7D\\u8054\\u7CFB\\u4EBA...\r\n\r\n# XFLD,40: Text in result list if no entries exist\r\nMASTER_LIST_NODATA=\\u672A\\u627E\\u5230\\u8054\\u7CFB\\u4EBA\r\n\r\n# XFLD,20: Search default test\r\nMASTER_SEARCH_PLACEHOLDER=\\u641C\\u7D22\r\n\r\n# XTOL,50: Search default test\r\nMASTER_SEARCH_TOOLTIP=\\u641C\\u7D22\\u8054\\u7CFB\\u4EBA\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE1=\\u8054\\u7CFB\\u4EBA\r\n\r\n# XTIT,40: Title for the list\r\nMASTER_TITLE2=\\u6211\\u7684\\u8054\\u7CFB\\u4EBA\r\n\r\n# XTIT,50: Detail View title name\r\nDETAILS_TITLE=\\u8054\\u7CFB\\u4EBA\r\n\r\n# XFLD,20: Contact Detail field for E-Mail\r\nCONTACT_EMAIL=\\u7535\\u5B50\\u90AE\\u4EF6\r\n\r\n# XFLD,20: Contact Detail field for Mobile Phone\r\nCONTACT_MOBILE_PHONE=\\u624B\\u673A\r\n\r\n# XFLD,20: Contact Detail field for Phone\r\nCONTACT_PHONE=\\u7535\\u8BDD\r\n\r\n# XFLD,20: Contact Detail field for Company\r\nCONTACT_ACCOUNT=\\u5BA2\\u6237\r\n\r\n# XFLD,20: Contact Detail field for Job Function\r\nCONTACT_FUNCTION=\\u804C\\u52A1\r\n\r\n# XFLD,20: Contact Detail field for First Name\r\nCONTACT_FIRST_NAME=\\u540D\r\n\r\n# XFLD,20: Contact Detail field for Last Name\r\nCONTACT_LAST_NAME=\\u59D3\r\n\r\n# XFLD,20: Contact Detail field for Postal Code\r\nCONTACT_POSTAL_CODE=\\u90AE\\u653F\\u7F16\\u7801\r\n\r\n# XFLD,20: Contact Detail field for Address\r\nCONTACT_ADDRESS=\\u5730\\u5740\r\n\r\n# XTIT,50: Edit Detail View title name\r\nEDIT_DETAILS_TITLE=\\u7F16\\u8F91\\u8054\\u7CFB\\u4EBA\r\n\r\n# XTIT,50: Contact Detail View title name\r\nCONTACT_DETAILS_TITLE=\\u8054\\u7CFB\\u4EBA\\u8BE6\\u7EC6\\u4FE1\\u606F\r\n\r\n#XBUT,20\r\nS3_EDIT=\\u7F16\\u8F91\r\n\r\n#XBUT,20\r\nS4_SAVE=\\u4FDD\\u5B58\r\n\r\n#XBUT,20\r\nS4_CANCEL=\\u53D6\\u6D88\r\n\r\n# XTIT,50: New contact title\r\nNEW_CONTACT=\\u65B0\\u5EFA\\u8054\\u7CFB\\u4EBA\r\n\r\n# XTIT,50: Edit contact title\r\nEDIT_CONTACT=\\u7F16\\u8F91\\u8054\\u7CFB\\u4EBA\r\n\r\n# XTIT,60: Shows which contact is the Main Contact\r\nMAIN_CONTACT=\\u4E3B\\u8981\\u8054\\u7CFB\\u4EBA\r\n\r\n# XFLD,20: Contact Detail field for Birthday\r\nCONTACT_BIRTHDAY=\\u51FA\\u751F\\u65E5\\u671F\r\n\r\n# XFLD,20: Contact Detail field for Note\r\nCONTACT_NOTE=\\u6CE8\\u91CA\r\n\r\n# XFLD,20: Contact Detail field for Job Department\r\nCONTACT_DEPARTMENT=\\u90E8\\u95E8\r\n\r\n# XFLD,20: Contact Detail field for Contact Title\r\nCONTACT_TITLE=\\u79F0\\u8C13\r\n\r\n#XTIT,20: W7: Title of pop-up used in confirm popup\r\nCONFIRM_TITLE=\\u786E\\u8BA4\r\n\r\n# XFLD,20: Contact Detail field for  Academic Title\r\nCONTACT_ACADEMIC_TITLE=\\u804C\\u79F0\r\n\r\n# XMSG : Contact creation succeeded\r\nCREATION_SUCCESS=\\u8054\\u7CFB\\u4EBA\\u5DF2\\u521B\\u5EFA\r\n\r\n# XMSG : Contact creation failed\r\nCREATION_ERROR=\\u521B\\u5EFA\\u5931\\u8D25\r\n\r\n# XMSG : Contact creation succeeded\r\nUPDATE_SUCCESS=\\u8054\\u7CFB\\u4EBA\\u5DF2\\u66F4\\u65B0\r\n\r\n# XMSG : Contact creation failed\r\nUPDATE_ERROR=\\u66F4\\u65B0\\u5931\\u8D25\r\n\r\n# XMSG : Contact creation : nothing has been changed\r\nNO_CHANGE=\\u6CA1\\u6709\\u8FDB\\u884C\\u66F4\\u6539\r\n\r\n# XMSG: message that will be displayed, if not all mandatory fields are not filled\r\nMSG_MANDATORY_FIELDS=\\u672A\\u586B\\u5199\\u90E8\\u5206\\u5FC5\\u586B\\u5B57\\u6BB5\r\n\r\n# XMSG : Photo update failed\r\nUPDATE_PHOTO_ERROR=\\u7167\\u7247\\u66F4\\u65B0\\u5931\\u8D25\r\n\r\n\r\n# XBUT,10: OK\r\nOK=\\u786E\\u5B9A\r\n\r\n# XMSG: Cancel confirmation\r\nCONFIRM_CANCEL=\\u6240\\u6709\\u672A\\u4FDD\\u5B58\\u7684\\u66F4\\u6539\\u5C06\\u4E22\\u5931\\u3002\\u662F\\u5426\\u7EE7\\u7EED\\uFF1F\r\n\r\n# XBUT,30: Add photo\r\nADD_PHOTO=\\u6DFB\\u52A0\\u7167\\u7247\r\n\r\n#XMSG\r\nNO_ITEMS_AVAILABLE=\\u5F53\\u524D\\u65E0\\u53EF\\u7528\\u9879\\u76EE\r\n\r\n# XBUT,30: add field\r\nADD_FIELD=\\u6DFB\\u52A0\\u5B57\\u6BB5\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_ALL_CONTACTS=\\u8FC7\\u6EE4\\u6761\\u4EF6\\uFF1A\\u6240\\u6709\\u8054\\u7CFB\\u4EBA\r\n\r\n#XFLD,20: Information on the sort criterium displayed in the master list information bar\r\nFILTERED_BY_MY_CONTACTS=\\u8FC7\\u6EE4\\u6761\\u4EF6\\uFF1A\\u6211\\u7684\\u8054\\u7CFB\\u4EBA\r\n\r\n#XFLD,20: Information "Filtered By: [value]" displayed in the master list information bar\r\nFILTERED_BY=\\u8FC7\\u6EE4\\u6761\\u4EF6\\uFF1A {0}\r\n\r\n#XFLD,20: Placeholder for the select account input\r\nSELECT_ACCOUNT=\\u9009\\u62E9\\u5BA2\\u6237\r\n\r\n#XFLD,20: Placeholder for the search in the select account dialog\r\nSEARCH=\\u641C\\u7D22\r\n\r\n#XFLD,20: No Data text after loading/searching list\r\nNO_DATA_TEXT=\\u65E0\\u6570\\u636E\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=\\u6B63\\u5728\\u52A0\\u8F7D...\r\n\r\n# XMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=\\u6570\\u636E\\u5DF2\\u88AB\\u5176\\u4ED6\\u7528\\u6237\\u66F4\\u6539\\u3002\\u662F\\u5426\\u4F7F\\u7528\\u60A8\\u81EA\\u5DF1\\u7684\\u66F4\\u6539\\u8986\\u76D6\\u5176\\u4ED6\\u7528\\u6237\\u7684\\u66F4\\u6539\\uFF1F\r\n\r\n# XMSG: message that will be displayed in case of conflicts during file renaming\r\nMSG_CONFLICTING_FILE_NAME=\\u6587\\u4EF6\\u540D\\u5DF2\\u88AB\\u5176\\u4ED6\\u7528\\u6237\\u66F4\\u6539\\u3002\\u662F\\u5426\\u4F7F\\u7528\\u60A8\\u81EA\\u5DF1\\u7684\\u66F4\\u6539\\u8986\\u76D6\\u5176\\u4ED6\\u7528\\u6237\\u7684\\u66F4\\u6539\\uFF1F\r\n',
	"cus/crm/mycontacts/util/Constants.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
cus.crm.mycontacts.util.Constants = {
		
		accountCategoryPerson: "1",
		accountCategoryCompany: "2",
		accountCategoryGroup: "3",
		
};
},
	"cus/crm/mycontacts/util/Util.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mycontacts.util.Util");

cus.crm.mycontacts.util.Util = {
		
	setApplicationFacade : function(oApplicationFacade) {
		this.oApplicationFacade = oApplicationFacade;
	},

	geti18NResourceBundle : function() {
		if (this.oApplicationFacade) {
			return this.oApplicationFacade.getResourceBundle();
		} else {
			return null ;
		}
	},

	geti18NText : function(key) {
		if (this.geti18NResourceBundle()) {
			return this.geti18NResourceBundle().getText(key);
		} else {
			return null ;
		}
	},

	readODataObjects: function(oContext, relationshipName, callbackFunction){

		var oContextObject = oContext.getModel().getProperty(oContext.sPath);

		if (oContext.getModel().getProperty(oContext.sPath+"/"+relationshipName)){
			callbackFunction(oContext.getModel().getProperty(oContext.sPath+"/"+relationshipName));
			return;
		}

		var oItemTemplate = new sap.m.StandardListItem({text:""});
    	var oList = new sap.m.List({
    	    items: {
    			path: relationshipName,
    			template: oItemTemplate
    		}
    	});
    	oList.setModel(oContext.getModel());
    	oList.setBindingContext(oContext);

    	var oBinding = oList.getBinding("items");
    	var fnReceivedHandler = null;
    	fnReceivedHandler = jQuery.proxy(function (response) {

//    		if (response.getSource().aKeys.length > 0)
//    			oContextObject[relationshipName] = {__list: response.getSource().aKeys};
//    		else
//    			oContextObject[relationshipName] = null;

    		oBinding.detachDataReceived(fnReceivedHandler);
    		oList.destroy();

    		callbackFunction(response.getSource().aKeys);

//    		oContextObject[relationshipName] = null;

    	}, this);

    	oBinding.attachDataReceived(fnReceivedHandler);
	},

	readODataObject: function(oContext, relationshipName, callbackFunction){

		var oContextObject = oContext.getModel().getProperty(oContext.sPath);

		if (oContext.getModel().getProperty(oContext.sPath+"/"+relationshipName)){
			callbackFunction(oContext.getModel().getProperty(oContext.sPath+"/"+relationshipName));
			return;
		}

    	var oLabel = new sap.m.List();
    	oLabel.bindElement(oContext.sPath + "/" + relationshipName);

    	oLabel.setModel(oContext.getModel());
    	oLabel.setBindingContext(oContext);

    	var oBinding = oLabel.getElementBinding();
    	var fnReceivedHandler = null;
    	fnReceivedHandler = jQuery.proxy(function (response) {

    		if (response.getSource().getBoundContext())
    			oContextObject[relationshipName] = {__ref: response.getSource().getBoundContext().sPath.substr(1)};
    		else
    			oContextObject[relationshipName] = null;

    		oBinding.detachDataReceived(fnReceivedHandler);
    		oLabel.destroy();

    		callbackFunction(oContext.getModel().getProperty(oContext.sPath+"/"+relationshipName));

    		oContextObject[relationshipName] = null;

    	}, this);

    	oBinding.attachDataReceived(fnReceivedHandler);
	},
	
	getRefreshUIObject: function(oModel, contextPath, expand) {

		if(!this.refreshList)
			this.refreshList = new sap.m.List();
		else{
			this.refreshList.unbindElement();
			this.refreshList.setModel(null);
		}

		var oList = this.refreshList;

		if(expand)
			oList.bindElement(contextPath, {expand: expand});
		else
			oList.bindElement(contextPath);

		oList.setModel(oModel);
		var oBinding = oList.getElementBinding();

		var oRefreshObject = {
			refresh: function(fnDataReceived){
				if(fnDataReceived)
					oBinding.attachDataReceived(fnDataReceived);
				if(oBinding)
					oBinding.refresh();
			},
			destroy: function(){
				oBinding = null;
			},
		};

		return oRefreshObject;
	},

	sendBatchReadOperations: function(oModel, aRequestURLs, callbackFunction){
		oModel.clearBatch();
		for(var i in aRequestURLs){
			var oReadOp = oModel.createBatchOperation(aRequestURLs[i], "GET");
			oModel.addBatchReadOperations([oReadOp]);
		}
				
		oModel.submitBatch(
				function(data){
					var oError = null;
					var aBatchResponse = data.__batchResponses;
					var responseObjects = {};
					for (var i = 0; i < aBatchResponse.length; i++) {
						
						if(aBatchResponse[i].statusCode == "200"){
							if(aBatchResponse[i].data.__metadata)
								responseObjects[aBatchResponse[i].data.__metadata.type] = aBatchResponse[i].data.results;
							else 
                                responseObjects[aBatchResponse[i].data[Object.keys(aBatchResponse[i].data)[0]][0].__metadata.type] = aBatchResponse[i].data[Object.keys(aBatchResponse[i].data)[0]];

							
						}
						else{
							var oResponse = jQuery.parseJSON(aBatchResponse[i].response.body);
							oError = {
									type : sap.ca.ui.message.Type.ERROR,
									message : oResponse.error.message.value,
									details : oResponse.error.innererror.Error_Resolution.SAP_Note
									};
						}
					}
					if (oError) {
						sap.ca.ui.message.showMessageBox(oError);
					}
					else {
						callbackFunction(responseObjects);
					}
				}, 
				function(data){
					jQuery.sap.log.error("Read failed in Util.js->sendBatchReadOperations");
				}, true);		
	},
	
	sendBatchChangeOperations: function(oModel, aBatchOperation, callbackSuccess, callbackError){
		oModel.clearBatch();
		oModel.addBatchChangeOperations(aBatchOperation);
		var that = this;
		oModel.submitBatch(
			jQuery.proxy(function (data) {
				var oError = {};
				var aBatchResponse = data.__batchResponses;
				var responseObject = null;
				for (var i = 0; i < aBatchResponse.length; i++) {
					if (aBatchResponse[i].response) {
						oError = jQuery.parseJSON(aBatchResponse[i].response.body).error;
						oError.statusCode = aBatchResponse[i].response.statusCode;
						oError.statusText = aBatchResponse[i].response.statusText;
					}
					if (aBatchResponse[i].__changeResponses &&
						aBatchResponse[i].__changeResponses.length > 0 && 
						aBatchResponse[i].__changeResponses[0].statusCode == 201){
						responseObject = aBatchResponse[i].__changeResponses[0].data;
					}
				}
				if (!oError.message) {
					if (callbackSuccess)
						callbackSuccess.call(that, responseObject);
				}
				else {
					if (callbackError)
						callbackError.call(that, oError);
					else
						sap.m.MessageBox.alert(oError.message.value);
				}

			}, this),
			true);
	},
};

},
	"cus/crm/mycontacts/view/AccountBusinessCard.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/*global jQuery: false, sap: false, cus: false, console: false, window : false */
/*jslint plusplus: true */
(function () {
	'use strict';
	sap.ui.controller("cus.crm.mycontacts.view.AccountBusinessCard", {

		onTapPhone:function (oEvent) {
			sap.m.URLHelper.triggerTel(oEvent.getSource().getText());
		},
	
		onMapIconPressed: function (oEvent) {
			sap.m.URLHelper.redirect("http"+"://"+"maps.apple.com/?q="+this.getView().getModel().getProperty("/address").split("\n").join(" "), !jQuery.device.is.phone);
		},
	});
}());
},
	"cus/crm/mycontacts/view/AccountBusinessCard.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n     xmlns:core="sap.ui.core"\n\t xmlns:mvc="sap.ui.core.mvc"\n\t xmlns:form="sap.ui.layout.form"\n\t xmlns="sap.m"\n\t xmlns:layout="sap.ui.layout"\n\t controllerName="cus.crm.mycontacts.view.AccountBusinessCard"\n     xmlns:html="http://www.w3.org/1999/xhtml"\n     resourceBundleName="sap.ca.ui.i18n.i18n" resourceBundleAlias="ca_i18n">\n     \t\t\n\t<form:SimpleForm id="bcCompanyContainer" class="bcUpperContainer" minWidth="1024" maxContainerCols="2">\n\t\t<form:content>\n\t\t\t<core:Title id="bcAccountContact" text="{ca_i18n>Quickoverview.company.contacttitle}" />\n\t\t\t<Label text="{ca_i18n>Quickoverview.company.phone}"></Label>\n\t\t\t<Link text="{/phone}" press="onTapPhone"/>\n\t\t\t<Label text="{ca_i18n>Quickoverview.company.address}" />\n\t\t\t<layout:HorizontalLayout>\n        \t\t<Text id="addressInput"\n        \t\t\t  text="{/address}"/>\n        \t\t<layout:HorizontalLayout id="mapIcon" visible="false">\n        \t\t\t<core:Icon src="sap-icon://map" press="onMapIconPressed" size="1.2rem" class="cusMyContactsPaddingLeft"  visible="{path : \'/address\', formatter:\'cus.crm.mycontacts.formatter.ReleaseFormatter.isNotInitial\'}"/>\n        \t\t</layout:HorizontalLayout>\n\t\t\t</layout:HorizontalLayout>\n\t\t</form:content>\n\t</form:SimpleForm>\n\n</core:View>',
	"cus/crm/mycontacts/view/AccountSelectDialog.fragment.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<core:FragmentDefinition\r\n  xmlns="sap.m"\r\n  xmlns:core="sap.ui.core"\r\n  id="AccountSelectFragment">\r\n\r\n\t<SelectDialog\r\n\t        title="{i18n>CONTACT_ACCOUNT}"\r\n\t        noDataText="{i18n>NO_DATA_TEXT}"\r\n\t        liveChange="searchAccount"\r\n\t        confirm="selectAccount"\r\n\t        cancel="closeAccountSelectDialog">\r\n\t    <StandardListItem \r\n\t    \ttitle="{fullName}" \r\n\t    \tdescription="{parts:[{path:\'MainAddress/city\'}, {path:\'MainAddress/country\'}, {path:\'accountID\'}],formatter:\'cus.crm.mycontacts.formatter.ReleaseFormatter.locationFormatter\'}">\r\n\t        <customData>\r\n\t            <core:CustomData key="accountID" value="{accountID}"/>\r\n\t        </customData>\r\n\t    </StandardListItem>\r\n\t</SelectDialog>\r\n\r\n</core:FragmentDefinition>\n',
	"cus/crm/mycontacts/view/ContactDetails.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/*global jQuery: false, sap: false, cus: false, console: false, window : false */
/*jslint plusplus: true */
(function () {
	'use strict';
    jQuery.sap.require("sap.ca.ui.model.type.Date");
	sap.ui.controller("cus.crm.mycontacts.view.ContactDetails", {

		/*
		 * make call
		 */
		makeCall: function(oEvent) {
			if(jQuery.device.is.ipad)
				sap.m.URLHelper.redirect("facetime://"+oEvent.getSource().getText().replace(/[()\s]/g, ''), false);
			else
				sap.m.URLHelper.triggerTel(oEvent.getSource().getText());
		},

		/*
		 * send email
		 */
		sendEmail:function (oEvent) {
			sap.m.URLHelper.triggerEmail(oEvent.getSource().getText());
		},

		formatLabelVisible:function (src) {
			return (src !== undefined && null !== src && src.length !== 0);
		},
		
		onMapIconPressed: function (oEvent) {
			sap.m.URLHelper.redirect("http"+"://"+"maps.apple.com/?q="+this.getView().getBindingContext().getProperty("WorkAddress/address").split("\n").join(" "), !jQuery.device.is.phone);
		},

	});
}());
},
	"cus/crm/mycontacts/view/ContactDetails.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n     xmlns:core="sap.ui.core"\n\t xmlns:form="sap.ui.layout.form"\n\t xmlns="sap.m"\n\t xmlns:layout="sap.ui.layout"\n     controllerName="cus.crm.mycontacts.view.ContactDetails"\n     xmlns:html="http://www.w3.org/1999/xhtml">\n\t<form:SimpleForm maxContainerCols="2" editable="false">\n        <form:content>\n\t\t\t<Label id="mobilePhoneLabel"\n\t\t\t       text="{i18n>CONTACT_MOBILE_PHONE}"\n\t\t\t\t   visible="{path : \'WorkAddress/mobilePhone\', formatter:\'.formatLabelVisible\'}"/>\n        \t<Link id="mobilePhoneInput"\n        \t      text="{WorkAddress/mobilePhone}"\n        \t      press="makeCall"\n        \t      visible="{path : \'WorkAddress/mobilePhone\', formatter:\'.formatLabelVisible\'}"/>\n        \t<Label id="phoneLabel"\n\t\t\t       text="{i18n>CONTACT_PHONE}"\n        \t       visible="{path : \'WorkAddress/phone\', formatter:\'.formatLabelVisible\'}"/>\n        \t<Link id="phoneInput"\n\t\t\t      text="{WorkAddress/phone}"\n        \t      press="makeCall"\n        \t      visible="{path : \'WorkAddress/phone\', formatter:\'.formatLabelVisible\'}"/>\n        \t<Label id="emailLabel"\n\t\t\t       text="{i18n>CONTACT_EMAIL}"\n        \t       visible="{path : \'WorkAddress/email\', formatter:\'.formatLabelVisible\'}"/>\n        \t<Link id="emailInput"\n\t\t\t      text="{WorkAddress/email}"\n        \t      press="sendEmail"\n        \t      visible="{path : \'WorkAddress/email\', formatter:\'.formatLabelVisible\'}"/>\n        \t<Label id="addressLabel"\n\t\t\t       text="{i18n>CONTACT_ADDRESS}"\n        \t       visible="{path : \'WorkAddress/address\', formatter:\'.formatLabelVisible\'}" />\n        \t<layout:HorizontalLayout>\n        \t\t<Text id="addressInput"\n        \t\t\t  text="{WorkAddress/address}"\n        \t\t\t  visible="{path : \'WorkAddress/address\', formatter:\'.formatLabelVisible\'}"/>\n        \t\t<layout:HorizontalLayout id="mapIcon" visible="false">\n        \t\t\t<core:Icon src="sap-icon://map" press="onMapIconPressed" size="1.2rem" class="cusMyContactsPaddingLeft" visible="{path : \'WorkAddress/address\', formatter:\'.formatLabelVisible\'}" />\n        \t\t</layout:HorizontalLayout>\n\t\t\t</layout:HorizontalLayout>\n\t\t\t<Label id="emptyLabel" text="" visible="{path: \'birthDate\', formatter:\'.formatLabelVisible\'}" />\n        \t<Text id="emptyInput" text="" visible="{path: \'birthDate\', formatter:\'.formatLabelVisible\'}"/>        \t      \n        \t<Label id="birthDateLabel"\n\t\t\t\t   text="{i18n>CONTACT_BIRTHDAY}"\n\t\t\t\t   visible="{path: \'birthDate\', formatter:\'.formatLabelVisible\'}"/>\n\t\t\t<Text id="birthDateInput"\n\t\t\t      text="{path: \'birthDate\', type: \'sap.ca.ui.model.type.Date\', formatOptions: {style:\'medium\'}}"\n\t\t\t\t  visible="{path: \'birthDate\', formatter:\'.formatLabelVisible\'}"/>\n\t\t\t<!-- Extends the form containing contact details -->\n\t\t\t<core:ExtensionPoint name="extContactDetailsInfo" />\n        </form:content>\n    </form:SimpleForm>\n\n</core:View>',
	"cus/crm/mycontacts/view/S2.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/*global jQuery: false, sap: false, cus: false, console: false, window : false */
/*jslint plusplus: true */
(function () {
	'use strict';
	jQuery.sap.require("sap.ca.scfld.md.controller.BaseMasterController");

	sap.ca.scfld.md.controller.BaseMasterController.extend("cus.crm.mycontacts.view.S2", {
		sDefaultValue:"-1",
		iAccountID:undefined,
		iContactID:undefined,
		bToolbarInfo:false,

		aFilterKey:{
			sAll:"All",
			sMy:"My Contacts"
		},

		aSorterKey:{
			sLastName:"lastName",
			sFirstName:"firstName",
			sCompany:"company"
		},

		constructor:function () {
			this.bHasInit = true;
		},

		onInit:function () {
			var self = this;
			// get routing object for navigation
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			this.oApplicationImplementation = sap.ca.scfld.md.app.Application.getImpl();
			this.oApplicationFacade = this.oApplicationImplementation.oConfiguration.oApplicationFacade;

			// Retrieve the application bundle
			this.resourceBundle = this.oApplicationFacade.getResourceBundle();

			this._initHeaderFooterOptions();

			// get account or contact id : if there is the cross application,
			// the account or contact id are gave
			this._getParameters();

			this.oRouter.attachRouteMatched(this._handleRouteMatched, this);
			
			this.oApplicationImplementation.oMHFHelper.defineMasterHeaderFooter(this);
		},

		getHeaderFooterOptions:function () {
			return this.oHeaderFooterOptions;
		},

		setListItem: function(oItem, bNotNav) {
			var that = this;
			this._handleUnsavedChanges(
				function() {
					that._handleSetListItem(oItem, bNotNav);
				},
				function() {
					if(that.prevItem) {
						var oList = that.getList();
						oList.removeSelections();
						oList.setSelectedItem(that.prevItem, true);
					}
				}
			);
		},

		_handleSetListItem: function(oItem, bNotNav) {
			if (oItem) {
				var oList = this.getList(), oParameter;
				oList.removeSelections();
				oList.setSelectedItem(oItem, true);

				if (!bNotNav) {
					oParameter = {
						contextPath:oItem.getBindingContext().sPath.substr(1)
					};
					
					this.sContext = oItem.getBindingContext().sPath.substr(1);

					this._updateParameter(oParameter);

					// Store oItem as previous item. In case of future navigation to
					// another item with unsaved changes for previous item,
					// the user might cancel the navigation and want to stay at previous
					// item to e.g. save changes.
					this.prevItem = oItem;
					this.oRouter.navTo("detail2", oParameter, !jQuery.device.is.phone);
				}
			}
		},
		
		_handleUnsavedChanges: function(fnConfirmed, fnRejected) {
			// In case navigation to another list item is triggered
			// and there are unsaved changes on edit screen,
			// data loss pop up is opened.
			var oCurrentDetailPage = sap.ca.scfld.md.app.Application.getImpl().oSplitContainer.getCurrentDetailPage();
			// Check if the controller of the current detail page is the edit controller.
			if(oCurrentDetailPage && oCurrentDetailPage.getController() && oCurrentDetailPage.getController()._checkSaveNeeded) {
				var oCurrentDetailController = oCurrentDetailPage.getController();
				// Check if the edit controller has unsaved changes.
				if(oCurrentDetailController.getView().getBindingContext() && oCurrentDetailController._checkSaveNeeded()) {
					var that = this;
                    sap.m.MessageBox.confirm(
                       cus.crm.mycontacts.util.Util.geti18NText("CONFIRM_CANCEL"),
                       jQuery.proxy(function (confirmed) {
                              if(confirmed === "OK") {
                                    oCurrentDetailController.getView().setBindingContext(null);
                                    if(oCurrentDetailController._cleanUp && oCurrentDetailController._setEmptyScreen) {
                                    	// Effects of clean up are only visible in creation mode.
                                        oCurrentDetailController.editMode = false;
                                        oCurrentDetailController._cleanUp();
                                        oCurrentDetailController._setEmptyScreen();	
                                    }
                                    fnConfirmed();
                              } else {
                                    fnRejected();
                              }
                       }, that));
				} else {
                  fnConfirmed();
				}
			} else {
				fnConfirmed();
			}
		},

		navToEmpty:function () {
			this.updateMasterTitle();
			this._showLoadingText(false);
			if (!jQuery.device.is.phone) {
				this.oRouter.navTo("noData", {
					viewTitle:"DETAIL_TITLE",
					languageKey:"NO_ITEMS_AVAILABLE"
				}, true);
			}
		},

		/**
		 * Display "Loading..." when the list is loading after search, filter,
		 * sort ... and display usual "No data" after
		 *
		 * @param bLoading
		 * @private
		 */
		_showLoadingText:function (bLoading) {
			if (bLoading) {
				this.getList().setNoDataText(this.resourceBundle.getText("LOADING_TEXT"));
			} else {
				this.getList().setNoDataText(this.resourceBundle.getText("NO_DATA_TEXT"));
			}
		},

		/**
		 * @Override contains the server filter
		 */
		applyBackendSearchPattern:function () {
			this._applyFilter();
		},

		/**
		 * Handle for master list sort
		 */
		handleSort:function (sKey) {
			this._setSelectedSort(sKey);
			var oSorter = this._createSorter(), oListBinding;

			// update master list binding
			oListBinding = this.getList().getBinding("items");
			if (oListBinding) {
				oListBinding.aSorters = oSorter;
				oListBinding.sort(oSorter);
				if (!jQuery.device.is.portrait)
					oListBinding.attachChange(this._selectFirstElement, this);
			}
		},

		/**
		 * determines whether search (triggered by search field) is performed on
		 * backend or frontend (frontend being default behavior).
		 */
		isBackendSearch:function () {
			return true;
		},

		handleFilter:function (sKey) {
			this._setSelectedFilter(sKey);
			this._applyFilter();
		},

		updateMasterTitle:function () {
			var iNumberOfContacts, oScaffold;
			iNumberOfContacts = this.getList().getBinding('items').getLength();
			oScaffold = this.oApplicationImplementation.oMHFHelper;
			oScaffold.setMasterTitle.apply(oScaffold, [ this, iNumberOfContacts ]);
			this._showLoadingText(true);
		},

		/**
		 * Handle for adding
		 */
		onAddButtonPressed:function () {
			var that = this;
			this._handleUnsavedChanges(function() {that._handleAdd();}, function() {});
		},

		/**
		 * Handle for adding
		 */
		_handleAdd: function() {
			var oParameter = {
				editPath:"Old" + this.sContext
			};
			this._updateParameter(oParameter);
			this.oRouter.navTo("subDetail", oParameter, true);
		},

		_createSorter:function () {
			var oSorter, oSelectedSort = this._getSelectedSort();
			switch (oSelectedSort) {
				case this.aSorterKey.sCompany:
					oSorter = [ new sap.ui.model.Sorter(oSelectedSort, false, this._handleCompanyGroup), new sap.ui.model.Sorter("lastName", false, false) ];
					break;
				case this.aSorterKey.sLastName:
					oSorter = [ new sap.ui.model.Sorter(oSelectedSort, false, this._handleLastNameGroup) ];
					break;
				default:
					oSorter = [ new sap.ui.model.Sorter(oSelectedSort, false, this._handleFirstNameGroup) ];
			}

			return oSorter;
		},

		_handleFirstNameGroup:function (oContext) {
			var oText = oContext.getProperty("firstName");
			if (oText && typeof oText === "string") {
				return oText.charAt(0).toUpperCase();
			}
			return "";
		},

		_handleLastNameGroup:function (oContext) {
			var oText = oContext.getProperty("lastName");
			if (oText && typeof oText === "string") {
				return oText.charAt(0).toUpperCase();
			}
			return "";
		},

		_handleCompanyGroup:function (oContext) {
			return oContext.getProperty("company");
		},

		_getParameters:function () {
			var sComponentId, oMyComponent, aStartupParameters;
			sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
			oMyComponent = sap.ui.component(sComponentId);

			if (oMyComponent && oMyComponent.getComponentData()) {
				aStartupParameters = oMyComponent.getComponentData().startupParameters;

				if (aStartupParameters) {
					jQuery.sap.log.debug("startup parameters of CRM-MyContacts are " + JSON.stringify(aStartupParameters));

					if (aStartupParameters.accountID && aStartupParameters.accountID[0]) {
						this.iAccountID = aStartupParameters.accountID[0];
					}

					if (aStartupParameters.contactID && aStartupParameters.contactID[0]) {
						this.iContactID = aStartupParameters.contactID[0];
					}

					if (this.iAccountID || this.iContactID) {
						this._setSelectedSort(this.aSorterKey.sLastName);
						this._setSelectedFilter(this.aFilterKey.sAll);
					}
				}
			}
		},

		_getFilters:function () {
			var aFilters = [], bIsMyContact = this._getSelectedFilter() !== this.aFilterKey.sAll, sSearch;

			sSearch = this._getSearchText();

			aFilters.push(new sap.ui.model.Filter("isMyContact", sap.ui.model.FilterOperator.EQ, bIsMyContact));

			if (this.iAccountID) {
				aFilters.push(new sap.ui.model.Filter("accountID", sap.ui.model.FilterOperator.EQ, this.iAccountID));
			}

			if (this.iContactID) {
				aFilters.push(new sap.ui.model.Filter("contactID", sap.ui.model.FilterOperator.EQ, this.iContactID));
			}

			// add filter from search
			if (sSearch) {
				aFilters.push(new sap.ui.model.Filter("fullName", sap.ui.model.FilterOperator.Contains, sSearch));
			}

			return aFilters;
		},

		_selectContextPath:function (oEvent) {
			var oList = this.getList(), aItems, oModel, oElement, i, len, sPath, oBindingContext;
			if(oList) {
				aItems = oList.getItems();
			}
			this.byId("toolbarInfo").setVisible(this.bToolbarInfo);
			if(this.contextPath) {
				if(aItems && aItems.length > 0) {
					oEvent.getSource().detachChange(this._selectContextPath, this);
					oModel = oList.getModel();
					sPath = "/" + this.contextPath;
					oElement = oModel.getProperty(sPath);
					if (oElement) {
						//Set the contextual filtering
						//In case of cross-navigation, the app might be started with given accountID or contactID
						if(this.bToolbarInfo) {
							this._setToolbarInfoText(oElement.fullName, oElement.company);
						}
						
						for (i = 0, len = aItems.length; i < len; i++) {
							oBindingContext = aItems[i].getBindingContext();
							if (oBindingContext && oBindingContext.sPath === sPath) {
								this.contextPath = undefined;
								this.setListItem(aItems[i], jQuery.device.is.phone);
								this._setFocus(oList, aItems[i]);
								this.updateMasterTitle();
								return;
							}
						}
					} else {
						if (oList._oGrowingDelegate._iItemCount < this.getList().getBinding('items').getLength()) {
							oList._oGrowingDelegate.requestNewPage();
							oEvent.getSource().attachChange(this._selectContextPath, this);
						} else {
							this.navToEmpty();
						}
					}
				} else {
					this.navToEmpty();
				}
			}
		},

		_selectFirstElement:function (oEvent) {
			var oList = this.getList(), aItems = oList.getItems(), i, len, oBindingContext, oElement;
			oEvent.getSource().detachChange(this._selectFirstElement, this);
			if (aItems.length > 0) {
				for (i = 0, len = aItems.length; i < len; i++) {
					oBindingContext = aItems[i].getBindingContext();
					if (oBindingContext && oBindingContext.sPath) {
						this.setListItem(aItems[i], jQuery.device.is.phone);
						//Set the contextual filtering
						//In case of cross-navigation, the app might be started with given accountID or contactID
						this.byId("toolbarInfo").setVisible(this.bToolbarInfo);
						if(this.bToolbarInfo) {
							oElement = oList.getModel().getProperty(oBindingContext.sPath);
							if (oElement) {
								this._setToolbarInfoText(oElement.fullName, oElement.company);
							}
						}
						
						this.updateMasterTitle();
						return;
					}
				}
			}

			this.navToEmpty();
		},

		_initHeaderFooterOptions:function () {
			var that = this;
			this.oHeaderFooterOptions = {
				sI18NMasterTitle:"MASTER_TITLE_FOR_MY_CONTACTS",
				buttonList:[],
				onBack: that._getBackFunction(),
				oFilterOptions:{
					aFilterItems:[
						{
							key:this.aFilterKey.sAll,
							text:this.resourceBundle.getText("ALL_CONTACTS")
						},
						{
							key:this.aFilterKey.sMy,
							text:this.resourceBundle.getText("MY_CONTACTS")
						}
					],
					sSelectedItemKey:this.aFilterKey.sMy,
					onFilterSelected:jQuery.proxy(this.handleFilter, this)
				},
				oSortOptions:{
					aSortItems:[
						{
							key:this.aSorterKey.sLastName,
							text:this.resourceBundle.getText("CONTACT_LAST_NAME")
						},
						{
							key:this.aSorterKey.sFirstName,
							text:this.resourceBundle.getText("CONTACT_FIRST_NAME")
						},
						{
							key:this.aSorterKey.sCompany,
							text:this.resourceBundle.getText("CONTACT_ACCOUNT")
						}
					],
					sSelectedItemKey:this.aSorterKey.sLastName,
					onSortSelected:jQuery.proxy(this.handleSort, this)
				},
				onAddPress:jQuery.proxy(this.onAddButtonPressed, this)
			};
		},

		_getSelectedFilter:function () {
			return this.oHeaderFooterOptions.oFilterOptions.sSelectedItemKey;
		},

		_setSelectedFilter:function (sKey) {
			if (this.oHeaderFooterOptions) {
				this.oHeaderFooterOptions.oFilterOptions.sSelectedItemKey = sKey;

				switch (sKey) {
					case this.aFilterKey.sAll:
						this.oHeaderFooterOptions.sI18NMasterTitle = "MASTER_TITLE";
						break;
					default:
						this.oHeaderFooterOptions.sI18NMasterTitle = "MASTER_TITLE_FOR_MY_CONTACTS";
						break;
				}
			}
		},

		_getSelectedSort:function () {
			return this.oHeaderFooterOptions.oSortOptions.sSelectedItemKey;
		},

		_setSelectedSort:function (sKey) {
			if (this.oHeaderFooterOptions) {
				this.oHeaderFooterOptions.oSortOptions.sSelectedItemKey = sKey;
			}
		},

		_handleRouteMatched:function (oEvent) {
			var name = oEvent.getParameter("name");
			switch (name) {
				case "master":
					this._masterRouteMatched(oEvent);
					break;
				case "selected":
					this._selectedRouteMatched(oEvent);
					break;
			}
		},

		_masterRouteMatched:function (oEvent) {
			var oList = this.getList(), oBinding, oArguments;
			if (this.bHasInit) {
				this.bHasInit = false;

				oArguments = oEvent.getParameter("arguments");

				this._initState(oArguments);

				this._createBindAggregation();

				if (oArguments.itemCount) {
					oList._oGrowingDelegate._iItemCount = oArguments.itemCount;
				}

				this.oApplicationImplementation.setModels(this);

				oBinding = oList.getBinding("items");
				if (this.contextPath) {
					oBinding.attachChange(this._selectContextPath, this);
				} else if (!this.editPath) {
					oBinding.attachChange(this._selectFirstElement, this);
				}
				// Fix for issue with PullToRefresh control
				// Hiding behavior does only work as expected
				// if this._oMasterListBinding is set 
				this._oMasterListBinding = this.getList().getBinding("items");
			}
		},

		_initState:function (oState) {
			if (oState) {

				if (oState.contextPath) {
					this.contextPath = oState.contextPath;
				}

				if (oState.editPath) {
					this.editPath = oState.editPath;
				}

				if (oState.filter) {
					this._setSelectedFilter(oState.filter);
				}

				if (oState.sort) {
					this._setSelectedSort(oState.sort);
				}

				if (oState.accountID && oState.accountID !== this.sDefaultValue) {
					this.iAccountID = oState.accountID;
					this.bToolbarInfo = true;
				}

				if (oState.contactID && oState.contactID !== this.sDefaultValue) {
					this.iContactID = oState.contactID;
					this.bToolbarInfo = true;
				}
				
				if (oState.itemCount && oState.itemCount !== this.sDefaultValue) {
					this.iItemCount = parseInt(oState.itemCount, 0);
				}

				if (oState.isSearch && oState.isSearch === "true" && this._oControlStore && this._oControlStore.oMasterSearchField) {
					this._oControlStore.oMasterSearchField.setValue(oState.search);
				}

				this.oApplicationImplementation.oMHFHelper.defineMasterHeaderFooter(this);
			}
		},

		_selectedRouteMatched:function (oEvent) {
			var oArguments, oList, oBinding, aFilters;

			oArguments = {
				contextPath:oEvent.getParameter("arguments").contextPath,
				filter:this.aFilterKey.sAll,
				isSearch:"true",
				search:oEvent.getParameter("arguments").name
			};

			this._initState(oArguments);

			this.iAccountID = undefined;
			this.iContactID = undefined;

			oList = this.getList();
			oBinding = oList.getBinding("items");
			if (oBinding) {
				oBinding.aApplicationFilters = [];

				aFilters = this._getFilters();

				// update master list binding
				oBinding.filter(aFilters);

				oBinding.attachChange(this._selectContextPath, this);
			}
		},

		_createBindAggregation:function () {
			var oTemplate, aFilters, aSorter, oList;
			oTemplate = this.getList().getItems()[0].clone();
			aFilters = this._getFilters();
			aSorter = this._createSorter();
			oList = this.getList();
			oList.bindAggregation("items", {
				path:'/ContactCollection',
				template:oTemplate,
				filters:aFilters,
				sorter:aSorter,
				parameters:{
					expand:'Photo,WorkAddress'
				}
			});
		},

		_getSearchText:function () {
			return this._oControlStore && this._oControlStore.oMasterSearchField && this._oControlStore.oMasterSearchField.getValue();
		},

		_updateParameter:function (oParameter) {
			var iAccountID = this.sDefaultValue, iContactID = this.sDefaultValue, sSearch = this.sDefaultValue, bIsSearch = false;
			if (this.iAccountID) {
				iAccountID = this.iAccountID;
			}
			if (this.iContactID) {
				iContactID = this.iContactID;
			}

			if (this._getSearchText()) {
				sSearch = this._getSearchText();
				bIsSearch = true;
			}

			oParameter.filter = this._getSelectedFilter();
			oParameter.sort = this._getSelectedSort();
			oParameter.isSearch = bIsSearch;
			oParameter.search = sSearch;
			oParameter.accountID = iAccountID;
			oParameter.contactID = iContactID;
			oParameter.itemCount = this.getList()._oGrowingDelegate._iItemCount;
		},

		_setFocus:function (oList, oItem) {
			// fix for ipad. This timeout solution is defined by Internal
			// Message 3789770/2013
			jQuery.sap.delayedCall(500, this, function () {
				this.getView().byId("page").getScrollDelegate().scrollTo(0, oItem.$().offset().top - oList.$().offset().top);
			});
		},

		_handleToolBar:function () {
			this.byId("toolbarInfo").setVisible(false);
			this.bToolbarInfo = false;
			this.iAccountID = undefined;
			this.iContactID = undefined;
			this._applyFilter();
		},
		
		/**
		 * Set the text of the info-toolbar.
		 * Text depends on whether contactID or accountID is given when launching the app.
		 *
		 * @param contactName
		 * @param companyName 
		 * @private
		 */
		_setToolbarInfoText:function(contactName, companyName) {
			if(this.iContactID && this.iAccountID) {
				this.byId("labelInfo").setText(this.resourceBundle.getText('FILTERED_BY', [contactName + ", " + companyName]));
			}
			else if(this.iContactID) {
				this.byId("labelInfo").setText(this.resourceBundle.getText('FILTERED_BY', [contactName]));
			}
			else if(this.iAccountID) {
				this.byId("labelInfo").setText(this.resourceBundle.getText('FILTERED_BY', [companyName]));
			}
		},

		_applyFilter:function () {
			var aFilters = this._getFilters(), oListBinding;

			// HACK: Remove initial filter (Status = New) which is by default
			// concatenated (or) to custom filters
			oListBinding = this.getList().getBinding("items");

			if (oListBinding) {
				oListBinding.aApplicationFilters = [];

				// update master list binding
				oListBinding.filter(aFilters);

				if (jQuery.device.is.portrait) {
					var that = this;
					oListBinding.attachChange(function () {
						that._showLoadingText(false);
					});
				}
				else {
					oListBinding.attachChange(this._selectFirstElement, this);
				}

				this.updateMasterTitle();
			}
		},

		_getBackFunction: function() {
			return function(){
				var oCurrentDetailPage = sap.ca.scfld.md.app.Application.getImpl().oSplitContainer.getCurrentDetailPage();
				if(oCurrentDetailPage && oCurrentDetailPage.getControllerName() == "cus.crm.mycontacts.view.S4") {
					var oCurrentDetailController = oCurrentDetailPage.getController();
					oCurrentDetailController._navBack();
				} else {
					window.history.back(1);
				}
			};
		}

	});
}());

},
	"cus/crm/mycontacts/view/S2.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core"\n           xmlns="sap.m" controllerName="cus.crm.mycontacts.view.S2">\n    <Page id="page">\n        <content>\n            <List id="list"\n                  selectionChange="_handleSelect"\n                  noDataText="{i18n>LOADING_TEXT}"\n                  growing="true"\n                  growingThreshold="20"\n                  growingScrollToLoad="true"\n                  mode="{device>/listMode}">\n                <items>\n                \t<!-- Extends the master list by a list item -->\n                \t<core:ExtensionPoint name="extListItem">\n                    \t<ObjectListItem id="MAIN_LIST_ITEM" type="{device>/listItemType}" press="_handleItemPress"\n                        \t            icon="{path:\'Photo\', formatter: \'cus.crm.mycontacts.formatter.ReleaseFormatter.pictureUrlFormatter\'}"\n                            \t        title="{fullName}">\n                        \t<attributes>\n                            \t<ObjectAttribute id="company" text="{company}"></ObjectAttribute>\n                            \t<!-- Extends the attributes of a list item -->\n                            \t<core:ExtensionPoint name="extListItemInfo" />\n                        \t</attributes>\n                        \t<firstStatus>\n                            \t<ObjectStatus\n                                \t    text="{parts: [{path : \'isMainContact\' }], formatter: \'cus.crm.mycontacts.formatter.ReleaseFormatter.isMainContact\'}">\n                            \t</ObjectStatus>\n                        \t</firstStatus>\n                    \t</ObjectListItem>\n                    </core:ExtensionPoint>\n                </items>\n                <infoToolbar>\n                    <Toolbar id="toolbarInfo" visible="false">\n                        <Label id="labelInfo" text=""/>\n                        <ToolbarSpacer/>\n                        <core:Icon src="sap-icon://sys-cancel" press="_handleToolBar"/>\n                    </Toolbar>\n                </infoToolbar>\n            </List>\n        </content>\n    </Page>\n</core:View>',
	"cus/crm/mycontacts/view/S3.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/*global jQuery: false, sap: false, cus: false, console: false */
(function () {
	'use strict';

	jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
	jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");
	jQuery.sap.require("sap.ca.ui.message.message");
	jQuery.sap.require("sap.ca.ui.model.type.DateTime");
	jQuery.sap.require("sap.m.MessageBox");

	sap.ca.scfld.md.controller.BaseDetailController.extend("cus.crm.mycontacts.view.S3", {

		onInit:function () {

			this.fullScreenMode = false;


			// execute the onInit for the base class BaseDetailController
			sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);

			this.oFileUpload = this.byId('fileupload');

			var oView = this.getView(), oFileUpload = this.byId('fileupload'), sUrlParams = this.getView().getModel().sUrlParams;

			// if upload enabled, must set xsrf token and the base64 encodingUrl service for IE9 support!
			if (oFileUpload.getUploadEnabled()) {
				oFileUpload.setXsrfToken(this.getXsrfToken());
				oFileUpload.setEncodeUrl("/sap/bc/ui2/encode_file" + (sUrlParams ? '?' + sUrlParams : ''));
			}

			this.oRouter.attachRouteMatched(function (oEvent) {

				var eventParameterName = oEvent.getParameter("name");

				if(eventParameterName === "detail2" || eventParameterName === "display") {

					if(eventParameterName === "display") {
						this.fullScreenMode = true;
					} else {
						this.fullScreenMode = false;
					}

					var oModel = this.getView().getModel(); 
					var oArguments = oEvent.getParameter("arguments"); 
					var oContext = new sap.ui.model.Context(oModel, '/' + oArguments.contextPath);

					if(eventParameterName === "detail2") {
						this.sFilter    = oArguments.filter;
						this.sSort      = oArguments.sort;
						this.bIsSearch  = oArguments.isSearch;
						this.sSearch    = oArguments.search;
						this.iAccountID = oArguments.accountID;
						this.iContactID = oArguments.contactID;
						this.iItemCount = oArguments.itemCount;
					}

					if(!oContext.getObject()) { 
						//if context has no account object
						// this happens 
						// - if the view has been called directly with a link
						// - or after saving the new contact --> has to be read from backend
						var that = this;
						oModel.createBindingContext(oContext.sPath, "", {
							expand : this._getExpandForDataBinding()}, 
							function() {
								oView.setBindingContext(oContext);
								that._bindSelectedTab(oModel, oContext);
							}, 
							true); 
					} else {
						if(eventParameterName === "detail2") {
							oView.setBindingContext(oContext);
							this.byId("iconTabBar").setSelectedKey("details");
							this._bindSelectedTab(oModel, oContext); 
						}
					}
				} 
			}, this);
		},

		onUploadFile:function (oEvent) {
			var oData, oFile;
			// with some browsers (eg. IE9) the data comes in a different property!
			oData = oEvent.getParameters() && oEvent.getParameters().d ? oEvent.getParameters().d : oEvent.getParameters();

			oFile = this.buildFileDescriptorObject(oData);

			// commit the file descriptor object to the FileUpload control
			this.byId('fileupload').commitFileUpload(oFile);
			// Model has to be refreshed due to upload of attachment.
			// Since getRefreshUIObject does bindElement with attachment and
			// a new attachment has been created, no further refresh is necessary.
			cus.crm.mycontacts.util.Util.getRefreshUIObject(this.getView().getModel(), "/AttachmentCollection(documentID='"+oData.documentID+"',documentClass='"+oData.documentClass+"',businessPartnerID='"+oData.businessPartnerID+"')");
		},

		onFileUploadFailed:function (e) {
			sap.ca.ui.message.showMessageBox({
				type:sap.ca.ui.message.Type.ERROR,
				message:e.getParameters().exception.message,
				details: e.getParameters().response
			});
		},
		

		/**
		 *  builds a file descriptor object based on the incoming OData response
		 */
		buildFileDescriptorObject:function (value) {
			
			var oFile, url;
			if(value["URL"])
				url = value["URL"];
			else
				url = cus.crm.mycontacts.formatter.ReleaseFormatter.urlFormatter(value.__metadata.media_src);
			var oFile;
			oFile = {
				name:value.name,
				size:value.fileSize,
				url:url,
				uploadedDate:value.createdAt,
				contributor:value.createdBy,
				mimeType:value.mimeType,
				fileId:value.documentID,
				mediaURL:cus.crm.mycontacts.formatter.ReleaseFormatter.urlFormatter(value.__metadata.media_src)
			};

			return oFile;
		},
		
		onRenameFile: function(oEvent){
			var parameters = oEvent.getParameters();
			var removStartVal = "";
			if(parameters.mediaURL)
				removStartVal = parameters.mediaURL.split("(").pop();
			else
				removStartVal = parameters.url.split("(").pop();
		 	
		    var path = "AttachmentCollection(";
		    removStartVal = removStartVal.replace(/%27/g, "'");
		    this._renameFile((path + removStartVal).split("/")[0] , parameters.newFilename + parameters.parsedFileExtension);
		 },

		_renameFile: function(contextPath, attachmentName, forceRename){
			var eTagString = null;
	    	if(forceRename)
	    		eTagString = "*";
			
	    	var oModel = this.getView().getModel();
	    	var oAttachment = {};
	    	oAttachment.name = attachmentName;
	    	var url = contextPath;
	 
	    	var aBatchOperation = [];
	    	var oBatchOperation = oModel.createBatchOperation(url, "PUT", oAttachment, {sETag: eTagString});
	    	aBatchOperation.push(oBatchOperation);	  
	    	var that = this;
	    	cus.crm.mycontacts.util.Util.sendBatchChangeOperations(oModel, aBatchOperation, 
	    			function(){
	    		 		that._onAfterRename(contextPath);
	    	 		}, 
	    	 		function(oError){
	    	 			oError.newAttachmentName = attachmentName;
	    	 			that._onAfterRename(contextPath, oError);
	    	 		});
	    },
	    
	    _onAfterRename: function(contextPath, oError){
	 		if(oError){
	 			if(this["_onAfterSaveHandleErrorCode_"+oError.statusCode])
	 				this["_onAfterSaveHandleErrorCode_"+oError.statusCode](contextPath, oError);
	 			else{
	 				sap.m.MessageBox.alert(oError.message.value);
	 				this.oFileUpload.abandonPendingRenames();
	 			}
	 		}
	 		else{
	 			cus.crm.mycontacts.util.Util.getRefreshUIObject(this.getView().getModel(), "/"+contextPath).refresh();
	 			this.oFileUpload.commitPendingRenames();
	 		}
	 	},
	 	
	 	_onAfterSaveHandleErrorCode_412: function(contextPath, oError){
			var that = this;
			sap.m.MessageBox.show(cus.crm.mycontacts.util.Util.geti18NText("MSG_CONFLICTING_FILE_NAME"), {
			    title: cus.crm.mycontacts.util.Util.geti18NText("CONFIRM_TITLE"),
			    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			    onClose: function (confirmed) {
					if(confirmed == sap.m.MessageBox.Action.YES){
						that._renameFile(contextPath, oError.newAttachmentName, true);
					}
					else{
						that.oFileUpload.abandonPendingRenames();
						that._bindAttachments(that.getView().getModel(), that.getView().getBindingContext()); 
					}
				},
			});
		},
    
    onDeleteFile : function(oEvent){
    	var oModel = this.getView().getModel(); 
    	var parameters = oEvent.getParameters();
        var removStartVal = "";
        if (parameters.mediaURL)
        	removStartVal = parameters.mediaURL.split("(").pop();
        else
        	removStartVal = parameters.url.split("(").pop();
        	
        var path = "AttachmentCollection(";

        var url = path + removStartVal ;

        var aBatchOperation = [];
		var oBatchOperation = oModel.createBatchOperation(url, "DELETE", undefined, {sETag: "*"});
	    aBatchOperation.push(oBatchOperation);	
	    this._submitBatchOperation(aBatchOperation,  function(){this.oFileUpload.removeFile([parameters.fileId]);});

     },
     
     
    _submitBatchOperation: function(aBatchOperation, callbackSuccess, callbackError){
		var oModel = this.getView().getModel();
		oModel.clearBatch();
		oModel.addBatchChangeOperations(aBatchOperation);
		var that = this;
		oModel.submitBatch(
			jQuery.proxy(function (data) {
				var sErrorMessage = null;
				var aBatchResponse = data.__batchResponses;
				var responseObject = null;
				for (var i = 0; i < aBatchResponse.length; i++) {
					if (aBatchResponse[i].response) {
						sErrorMessage = jQuery.parseJSON(aBatchResponse[i].response.body).error.message.value;
					}
					if (aBatchResponse[i].__changeResponses &&
						aBatchResponse[i].__changeResponses.length > 0 && 
						aBatchResponse[i].__changeResponses[0].statusCode == 201){
						responseObject = aBatchResponse[i].__changeResponses[0].data;
					}
				}
				if (!sErrorMessage) {
					if (callbackSuccess)
						callbackSuccess.call(that, responseObject);
				}
				else {
					sap.m.MessageBox.alert(sErrorMessage);
					if (callbackError)
						callbackError.call(that);
				}

			}, this),
			true);
    	},


		/**
		 * gets the Xsrf token if it exists, if not, request it explicitly
		 */
		getXsrfToken:function () {
			var sToken = this.getView().getModel().getHeaders()['x-csrf-token'];
			if (!sToken) {

				this.getView().getModel().refreshSecurityToken(function (e, o) {
					sToken = o.headers['x-csrf-token'];
				}, function () {
					sap.ca.ui.message.showMessageBox({
						type:sap.ca.ui.message.Type.ERROR,
						message:'Could not get XSRF token',
						details:''
					});
				}, false);
			}
			return sToken;
		},

		/*
		 * handler for business card
		 */
		onShowBusinessCard:function () {
			var oModel = this.getView().getModel(),
				oContext = this.getView().getBindingContext(),
				sAccountId = oModel.getProperty("accountID", oContext),
				sContactId = oModel.getProperty("contactID", oContext),
				sPath = "/AccountCollection('" + sAccountId + "')",
				oAccount = oModel.getProperty(sPath),
				oDummy = new sap.m.Button(), oBinding, fnReceivedHandler;

			// Use dummy control to bind account data for business card
			oDummy.setModel(oModel);

			if (oAccount) {
				this.showBusinessCard(oAccount);
			} else {
				fnReceivedHandler = jQuery.proxy(function () {
					var oAccount = oModel.getProperty(sPath, null);
					if (oAccount) {
						this.showBusinessCard(oAccount);
					}

					// Use dummy control for unbinding
					// If this.byId("company") is used, then business closes after unbinding 
					oDummy.unbindElement();
					oBinding.detachDataReceived(fnReceivedHandler);
				}, this);
				oDummy.bindElement("/ContactCollection(contactID='" + sContactId + "',accountID='" + sAccountId + "')/Account", {
					expand:'MainAddress,MainContact,MainContact/WorkAddress,Logo'
				});
				oBinding = oDummy.getElementBinding();
				oBinding.attachDataReceived(fnReceivedHandler);
			}
		},

		showBusinessCard:function (oAccount) {
			var oModel, sPath, companyName, oMainAddress, oLogo, fnCallbackNavParaComp, oCompanyData, oControl, oCompanyLaunch, bcModel;

			oModel = this.getView().getModel();
			sPath = "/AccountCollection('" + oAccount.accountID + "')";
			oLogo = oModel.getProperty(sPath + "/Logo");
			fnCallbackNavParaComp = function () {
				// callback function for providing external navigation
				var oNavConfig = {};
				oNavConfig.target = {};
				oNavConfig.target.semanticObject = "Account";
				oNavConfig.target.action = "MyAccounts&/detail/AccountCollection('" + oAccount.accountID + "')";
				return oNavConfig;
			};
			companyName = oModel.getProperty(sPath + "/fullName");
			if (!companyName){
				companyName = oModel.getProperty(sPath + "/name1");	
			}			
			oMainAddress = oModel.getProperty(sPath + "/MainAddress");

			bcModel = new sap.ui.model.json.JSONModel();
			bcModel.setData(oMainAddress);

			this.resourceBundle = this.oApplicationFacade.getResourceBundle();

			oCompanyData = {
				popoverHeight:"22rem",
				title:this.resourceBundle.getText("CONTACT_ACCOUNT"),
				headerNoIcon:false,
				headerImgURL:cus.crm.mycontacts.formatter.ReleaseFormatter.logoUrlFormatter(oLogo),
				headerTitle:companyName,
				subViewName:"cus.crm.mycontacts.view.AccountBusinessCard",
				beforeExtNav:fnCallbackNavParaComp,
				oModel:bcModel
			};

			// get control that triggers the BusinessCard
			oControl = this.byId("company");

			// call 'Business Card' component. The use of Quickoverview is because CompanyLaunch cannot handle empty main contact data
			oCompanyLaunch = new sap.ca.ui.quickoverview.Quickoverview(oCompanyData);

			oCompanyLaunch.openBy(oControl);
		},

		getHeaderFooterOptions:function () {
			var that = this;
			return {

				buttonList:[
					{
						sI18nBtnTxt:"S3_EDIT",
						onBtnPressed:function () {
							var oParameter;
							if(that.fullScreenMode){
								oParameter = {
										contextPath:that.getView().getBindingContext().getPath().substr(1),
								};
								// edit a contact
								that.oRouter.navTo("edit", oParameter, false);	
							}
							else{
								oParameter = {
										editPath:that.getView().getBindingContext().getPath().substr(1),
										filter:that.sFilter,
										sort:that.sSort,
										isSearch:that.bIsSearch,
										search:that.sSearch,
										accountID:that.iAccountID,
										contactID:that.iContactID,
										itemCount:that.iItemCount
									};

								// edit a contact
								that.oRouter.navTo("subDetail", oParameter, true);	
							}
						}
					}
				],
				oAddBookmarkSettings:{
					icon:"sap-icon://Fiori2/F0004"
				},
				onBack: that._getBackFunction(),
			};
		},
		
		_getBackFunction: function(){
			if (this.fullScreenMode)
				return function(){window.history.back(1);};
			else
				return undefined;
		},
		
		onSelectTab:function (oEvent) {
			var oModel, oContext;
			oModel = oEvent.getSource().getModel();
			oContext = oEvent.getSource().getBindingContext();
			this._bindSelectedTab(oModel, oContext);
		},

		_bindSelectedTab:function (oModel, oContext) {
			switch (this.byId("iconTabBar").getSelectedKey()) {
				case "details":
					break;
				case "attachments":
					this._bindAttachments(oModel, oContext);
					break;
				case "notes":
					this._bindNotes(oContext);
					break;
			}

		},

		_bindAttachments:function (oModel, oContext) {
			var self = this; 
			var urlParams = oModel.sUrlParams;
			var oData2 = {Attachments:[]};

			// clear bound data		
			self.oFileUpload.setModel(new sap.ui.model.json.JSONModel(oData2));

			// set the upload URL for the current account
			if (self.oFileUpload.getUploadEnabled()) {
				self.oFileUpload.setUploadUrl(oContext.getModel().sServiceUrl + oContext.getPath() + '/Attachments' + (urlParams ? '?' + urlParams : ''));
			}	

			cus.crm.mycontacts.util.Util.readODataObjects(oContext, "Attachments", function (results) {
				// build json model
				jQuery.each(results, function (index, value) {
					oData2.Attachments.push(self.buildFileDescriptorObject(oModel.getProperty("/"+value)));
				});

				// bind json model to control
				self.oFileUpload.setModel(new sap.ui.model.json.JSONModel(oData2));
			});
		},

		_bindNotes:function (oContext) {
			var oTemplate, oModel;
			oTemplate = new sap.ca.ui.ExpansibleFeedListItem({
				type:sap.m.ListType.Inactive, // sap.m.ListType
				activeIcon:undefined, // sap.ui.core.URI
				sender:"{CRM_BUPA_ODATA_CREATE>creator}", // string
				text:"{CRM_BUPA_ODATA_CREATE>content}", // string
				timestamp:"{path:'CRM_BUPA_ODATA_CREATE>createdAt', type:'sap.ca.ui.model.type.DateTime', formatOptions : { style:'medium'}}", // string
				senderActive:false, // boolean
				iconActive:true, // boolean
				showIcon:false, // boolean
				maxLines:3
				// int
			});
			oModel = this.oConnectionManager.getModel("CRM_BUPA_ODATA_CREATE");
			this.byId("myNotes").reset();
			this.byId("myNotes").destroyAggregation("items");
			this.byId("myNotes").setBindingContext(oContext);
			this.byId("myNotes").bindAggregation("items", {
				path:"CRM_BUPA_ODATA_CREATE>" + oContext.getPath() + "/Notes",
				template:oTemplate

			});

			this.byId("myNotes").setModel(oModel);
		},

		_handleAddNote:function (oEvent) {
            var sText, oView, oModel, contactId = "", oNote, oContext, oNoteCreateError;
            // sText is the string you entered in the textarea.
            sText = oEvent.getParameter("value");
            
            //Trim text and do not create note if string is empty
            sText = jQuery.trim(sText);
            if(sText.length == 0){
                            return; 
            }
            
            oView = this.getView();
            oModel = oView.getModel("CRM_BUPA_ODATA_CREATE");
            oNote = {
                            "tdname":contactId, // must not be null, but
                            "tdid":"",
                            "tdspras":"",
                            "content":sText,
                            "createdAt":null, // must be null (or set)
                            "creator":""
            };

            oContext = oView.getBindingContext();
            oNoteCreateError = jQuery.proxy(function (oError) {
                            var sMessage;
                            if (oError.response) {
                                           sMessage = jQuery.parseJSON(oError.response.body).error.message.value;
                            }
                            sap.ca.ui.message.showMessageBox({
                                           type:sap.ca.ui.message.Type.ERROR,
                                           message:sMessage
                            });           
            }, this);
            oModel.forceNoCache(true);
            oModel.create("Notes", oNote, oContext, undefined, oNoteCreateError);
		},

		_getExpandForDataBinding: function(){
			var expandString='Photo';
			var aDependentRelations = this._getDependentRelations();
			for(var i in aDependentRelations){
				expandString = expandString + "," + aDependentRelations[i];
			}
			return expandString;
		},

		_getDependentRelations: function(){
			var oDependentRelations = ["WorkAddress"];
			var oDependentCustomRelations = [];
			/** * @ControllerHook extHookGetDependentCustomRelations
			 * The method extHookGetDependentCustomRelations should return an array 
			 * with additional navigation properties for the ContactCollection, which should be considered in the read process 
			 * @callback cus.crm.mycontacts.view.S3~extHookGetDependentCustomRelations
			 * @return {array} */
			if (this.extHookGetDependentCustomRelations)
				oDependentCustomRelations = this.extHookGetDependentCustomRelations();
			for(var i in oDependentCustomRelations){
				oDependentRelations.push(oDependentCustomRelations[i]);
			}

			return oDependentRelations;
		},
	});

}());

},
	"cus/crm/mycontacts/view/S3.view.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<core:View xmlns:core="sap.ui.core"\r\n           xmlns="sap.m"\r\n           xmlns:ui="sap.ca.ui"\r\n           xmlns:mvc="sap.ui.core.mvc"\r\n           controllerName="cus.crm.mycontacts.view.S3"\r\n           xmlns:html="http://www.w3.org/1999/xhtml">\r\n    <html:style>\r\n      .cusMyContactsPaddingLeft {\r\n         padding-left: 1rem;\r\n      }\r\n    </html:style>\r\n\t<Page title="{i18n>DETAIL_TITLE}" showNavButton="{device>/isPhone}" navButtonPress="_navBack">\r\n\t\t<content>\r\n\t\t\r\n           <ObjectHeader title="{fullName}"\r\n                         icon="{path:\'Photo\',\r\n                                formatter:\'cus.crm.mycontacts.formatter.ReleaseFormatter.pictureUrlFormatter\'}" >\r\n                <attributes>\r\n                \t<!-- Extends the object header by attributes -->\r\n                \t<core:ExtensionPoint name="extContact">\r\n                    \t<ObjectAttribute\r\n                            \tid="company"\r\n                            \ttext="{company}"                            \r\n                            \tactive="true"\r\n                            \tpress="onShowBusinessCard"\r\n                        />\r\n                    \t<ObjectAttribute id="function" text="{function}" />\r\n\t\t\t\t\t\t<ObjectAttribute id="department" text="{department}"/>\r\n\t\t\t\t\t\t<!-- Extends the attributes of the object header -->\r\n\t\t\t\t\t\t<core:ExtensionPoint name="extContactInfo" />\r\n\t\t\t\t\t</core:ExtensionPoint>\r\n                </attributes>\r\n           </ObjectHeader>\r\n       \t\r\n        \t <IconTabBar expanded="true" select="onSelectTab" id="iconTabBar"  selectedKey="details" expandable="false">\r\n\t\t\t\t<items>\r\n\t\t\t\t\t<!-- Extends the icon tab bar by a tab for contact details -->\r\n\t\t\t\t\t<core:ExtensionPoint name="extContactDetailsTab">\r\n\t\t\t\t\t\t<IconTabFilter id="details" key="details" icon="sap-icon://hint">\r\n\t\t\t\t\t\t\t<mvc:XMLView id="x1" viewName="cus.crm.mycontacts.view.ContactDetails" />\r\n                    \t</IconTabFilter>\r\n                    </core:ExtensionPoint>\r\n\t\t\t\t\t<IconTabFilter id="attachments" key="attachments" icon="sap-icon://attachment">\r\n                            <ui:FileUpload\r\n                            \tid="fileupload"\r\n                                items="/Attachments"\r\n                                contributor="contributor"\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\tmimeType="mimeType"\r\n\t\t\t\t\t\t\t\tfileId="fileId" \r\n\t\t\t\t\t\t\t\tfileName="name"\t\t\r\n\t\t\t\t\t\t\t\tsize="size" \t\t\t\t\t\t\t\t \r\n\t\t\t\t\t\t\t\tuploadedDate="uploadedDate"\r\n\t\t\t\t\t\t\t\turl="url"\t\t\t\t\t\t\t    \r\n\t\t\t\t\t\t\t\tuseMultipart="false"\r\n\t\t\t\t\t\t\t\tuploadFile="onUploadFile"\r\n\t\t\t\t\t\t\t\trenameFile="onRenameFile"\r\n\t\t\t\t\t\t\t\tdeleteFile="onDeleteFile"\r\n\t\t\t\t\t\t\t\tacceptRequestHeader="application/json"\r\n\t\t\t\t\t\t\t\tuploadEnabled="true"\r\n\t\t\t\t\t\t\t\tuseEditControls="true"\r\n\t\t\t\t\t\t\t\tuploadUrl="" \r\n\t\t\t\t\t\t\t\tshowNoData="true"\r\n\t\t\t\t\t\t\t\trenameEnabled="true"\r\n\t\t\t\t\t\t\t\tfileUploadFailed="onFileUploadFailed"/>\r\n\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t</IconTabFilter>\r\n\t\t\t\t\t<IconTabFilter id="notes" key="notes" icon="sap-icon://notes">\r\n                        <ui:Notes id="myNotes" inset="false" growing="true" growingThreshold="4"\r\n                        \t\t  showNoteInput="true" textMaxLength="1000" addNote="_handleAddNote">\r\n                        </ui:Notes>\r\n                    </IconTabFilter>\r\n                    <!-- Extends the items of the icon tab bar -->\r\n                    <core:ExtensionPoint name="extContactInfoTab" />\r\n\t\t\t\t</items>\r\n\t\t\t</IconTabBar>\r\n\t\t\t\r\n\t\t</content>\r\n\t</Page>\r\n</core:View>',
	"cus/crm/mycontacts/view/S4.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/*global jQuery: false, sap: false, cus: false, console: false, window: false */
/*jslint plusplus: true */
(function () {
	'use strict';
	jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
	jQuery.sap.require("sap.ca.ui.model.type.Date");

	jQuery.sap.require("sap.m.MessageToast");
	jQuery.sap.require("sap.m.MessageBox");

	jQuery.sap.require("cus.crm.mycontacts.formatter.ReleaseFormatter");
	jQuery.sap.require("cus.crm.mycontacts.util.Constants");
	jQuery.sap.require("cus.crm.mycontacts.util.Util");

	sap.ca.scfld.md.controller.BaseDetailController.extend("cus.crm.mycontacts.view.S4", {
		
		/**
         * @memberOf view.S4
         * */  
        onInit: function() {
        	this.fullScreenMode = false;
			this.editMode = true;

			this.oDataModel = this.getView().getModel();

			this.pictureModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.pictureModel, "pictureModel");

			this.customizingModel = new sap.ui.model.json.JSONModel({TitleCustomizing: [], AcademicTitleCustomizing: []});
			this.getView().setModel(this.customizingModel, "Customizing");
			this._readCustomizing(this._refreshDropDownBoxes);

			var that = this;
			this.oRouter.attachRouteMatched(function (oEvent) {
				var oArguments = oEvent.getParameter("arguments");
				if(oEvent.getParameter("name") === "subDetail") {
					that.fullScreenMode = false;
					that.editMode = (oArguments.editPath.substring(0, 3) !== "Old");

					that.filter = oArguments.filter;
					that.sort = oArguments.sort;
					that.isSearch = oArguments.isSearch;
					that.search = oArguments.search;
					that.accountID = oArguments.accountID;
					that.contactID = oArguments.contactID;
					that.itemCount = oArguments.itemCount;

					that._cleanUp();

					// case: detail view and edit mode
					if(that.editMode) {
						var oModel = that.oConnectionManager.getModel();
						var contextPath = "/" + oArguments.editPath;
						that._fillScreen(oModel, contextPath);
					}
					// case: detail view and create mode
					else {
						that.oldContextPath = oArguments.editPath.substring(3, oArguments.editPath.length);
						that._setEmptyScreen();
					}
				} else {
					// case: full screen mode and edit mode
					if (oEvent.getParameter("name") === "edit") {
						that.fullScreenMode = true;
						that.editMode = true;
						that._cleanUp();
						var oModel = that.oDataModel;
						var contextPath = "/"+oEvent.getParameter("arguments").contextPath;
						that._fillScreen(oModel, contextPath);
					} else {
						// case: full screen mode and create mode
						if (oEvent.getParameter("name") === "new") {
							that.fullScreenMode = true;
							that.editMode = false;
							that._cleanUp();
							that._setEmptyScreen("/"+oArguments.accountContextPath);
						}
					}
				}
			});
		},

		_fillScreen: function(oModel, contextPath) {
			var oContext = oModel.getContext(contextPath);
			this.getView().setModel(oModel);
			this.getView().setBindingContext(oContext);
			var that = this;
			if(!oContext.getObject()){ //if context has no contact object (if the view has been called directly with a link)
				oModel.createBindingContext(contextPath, "", {
					expand : that._getExpandForDataBinding() + ",Account,Account/Addresses"},
					function() {
						that._updateAddresses(oContext.getObject().accountID);
						that._updatePicture();
					},
					true);
			} else {
				that._updateAddresses(oContext.getObject().accountID);
				that._updatePicture();
			}
		},

		_setEmptyScreen: function(accountContextPath) {
			var oContactTemplate = this._getTemplateForContact();

			var aDependentRelations = this._getDependentRelations();
			for(var i in aDependentRelations) {
				oContactTemplate[aDependentRelations[i]] = this._getTemplateForDependentObject("ContactCollection/" + aDependentRelations[i]);
			}

			var oNewContactModel = new sap.ui.model.json.JSONModel({NewContact: oContactTemplate});
			oNewContactModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay); //to be similar to oData model
			this.getView().setModel(oNewContactModel);
			this.getView().setBindingContext(oNewContactModel.getContext("/NewContact"));

			// In case of full screen mode, the company and address field are prefilled
			if(this.fullScreenMode) {
				if(accountContextPath && accountContextPath.split("'").length > 0) {
					var oModel = this.oDataModel;
					var oAccountContext = new sap.ui.model.Context(oModel, accountContextPath);
					var oAccount = oAccountContext.getObject();
					var accountID = accountContextPath.split("'")[1];
					if(!oAccount) {
						var that = this;
						oModel.createBindingContext(accountContextPath, "",
							{expand : "MainAddress,Addresses"},
							function() {
								var oAccount = oModel.getProperty(accountContextPath);
								// Update company and addresses based on accountID
								that._setDefaultCompany(oAccount.accountID, oAccount.fullName);
								that._updateAddresses(accountID);
							},
							true
						);
					} else {
						// Update company and addresses based on accountID
						this._setDefaultCompany(oAccount.accountID, oAccount.fullName);
						this._updateAddresses(accountID);
					}
				}
			} else {
				this._adaptAddressFields(false, true);
			}
		},

		_getTemplateForContact: function() {
			var oContactTemplate = this._generateTemplateUsingMetadata("ContactCollection");
			oContactTemplate.isMyContact = false;
			oContactTemplate.isMainContact = false;
			if(oContactTemplate.birthDate == "")
				oContactTemplate.birthDate = null;
			return oContactTemplate;
		},

		_generateTemplateUsingMetadata: function(path){
			var oEntityMetadata = this.oDataModel.oMetadata._getEntityTypeByPath(path);
			var oTemplate = {};
			for(var i in oEntityMetadata.property) {
				oTemplate[oEntityMetadata.property[i].name] = "";
			}
			return oTemplate;
		},

		_setBusy: function(busy){
			this.setBtnEnabled("saveButton", !busy);
			this.setBtnEnabled("cancelButton", !busy);
			if(!this.oBusyDialog)
				this.oBusyDialog = new sap.m.BusyDialog();			
			if(busy)
				this.oBusyDialog.open();
			else{
				var that = this;
				window.setTimeout(function() {
					that.oBusyDialog.close();
				},300);
			}
		},
		
		_cleanUp: function() {
			this.getView().setModel(null);

			this.pictureModel.setProperty("/Pictures", []);
			this.pictureModel.setProperty("/PictureSrc", undefined);
			this.pictureModel.setProperty("/OldPictureSrc", undefined);
			this._setContactPictureEditable(true);
			this.byId("contactPicture").removeAllPictures();

			var oLastNameInput = this.byId("lastNameInput");
            oLastNameInput.setShowSuggestion(!this.editMode);
			this.byId('lastNameInput').setValueState(sap.ui.core.ValueState.None);
        	
			var oCompanyInput = this.byId("companyValueHelp");
			oCompanyInput.setEnabled(!this.fullScreenMode && !this.editMode);
			oCompanyInput.setEditable(!this.fullScreenMode && !this.editMode);
			oCompanyInput.setShowSuggestion(!this.fullScreenMode && !this.editMode);
			this.byId('companyValueHelp').setValueState(sap.ui.core.ValueState.None);

			var oAddressSelect = this.byId("addressSelect");
			oAddressSelect.setBindingContext(undefined);
			oAddressSelect.removeAllItems();
		},

		// #############################################################################################
		// Picture
		// #############################################################################################

		onPictureSelected: function(oEvent) {
			this._toggleContactPictureFieldStatus();
		},

		onRemoveContactPicture: function(oEvent) {
			if(!this.pictureModel.getProperty("/OldPictureSrc")) {
				this.pictureModel.setProperty("/OldPictureSrc", this.pictureModel.getProperty("/PictureSrc"));
			}
			this._toggleContactPictureFieldStatus();
		},

		_toggleContactPictureFieldStatus: function() {
			this._setContactPictureEditable(!this.byId("contactPicture").getEditable());
		},

		_setContactPictureEditable: function(isEditable) {
			this.byId("contactPicture").setEditable(isEditable);
			this.byId("removeContactPictureButton").setVisible(!isEditable);
			if(isEditable) {
				this.byId("contactPicture").destroyPictures();
			}
		},

		_updatePicture: function() {
			var oModel = this.getView().getModel();
			var oContext = this.getView().getBindingContext();
			var oPicture = oModel.getProperty("Photo", oContext);
			if(oPicture) {
				if(oPicture.mimeType) {
					var pictureSrc = cus.crm.mycontacts.formatter.ReleaseFormatter.getRelativePathFromURL(oPicture.__metadata.media_src);
					this.pictureModel.setProperty("/Pictures", [{src: pictureSrc}]);
					this.pictureModel.setProperty("/PictureSrc", pictureSrc);
					this._setContactPictureEditable(false);
				}
			} else {
				this._setContactPictureEditable(true);
			}
		},

		_sendPictureRequests: function(oContact, changesInContact) {
			if(this._changeForPictureExists()) {
				var oModel = this.oConnectionManager.getModel(),
				    aPictures = this.byId("contactPicture").getPictures(),
					oPicture = (aPictures && aPictures.length > 0) ? aPictures[0] : undefined,
					token,
					oDeleteParameters = {},
					oAddParameters = {},
					pictureHasBeenAdded = aPictures && aPictures.length > 0 && oPicture.isSourceDataUri(),
					pictureHasBeenDeleted = this.pictureModel.getProperty("/OldPictureSrc") && this.pictureModel.getProperty("/OldPictureSrc").length > 0;
				if(pictureHasBeenAdded || pictureHasBeenDeleted) {
					token = oModel.oHeaders["x-csrf-token"];
					if (!token) {
						oModel.refreshSecurityToken();
						token = oModel.oHeaders["x-csrf-token"];
					}
					// If picture shall be deleted, set parameters for sending picture request to backend
					if(pictureHasBeenDeleted) {
						oDeleteParameters.pictureURL = this.pictureModel.getProperty("/OldPictureSrc");
						oDeleteParameters.type = "DELETE";
						oDeleteParameters.oHeaders = {
							"X-CSRF-Token":token,
							"If-Match": "*"
						};
						oDeleteParameters.data = "";
					}
					// If picture shall be added, set parameters for sending picture request to backend
					if(pictureHasBeenAdded) {
						oAddParameters.pictureURL = oModel.sServiceUrl + "/ContactCollection(contactID='" + oContact.contactID + "',accountID='" + oContact.accountID + "')/Attachments";
						oAddParameters.type = "POST";
						oAddParameters.oHeaders = {
							"Content-Type": oPicture.getMimeType(),
							"Content-Encoding": "base64",
							"Content-Disposition": 'attachment; filename="' + oPicture.getName() + '"',
							"slug": "isImage",
							"X-CSRF-Token": token
						};
						oAddParameters.data = oPicture.getBase64Encoding();
					}
					var fnOnAfterSave = function() {
						this._updatePicture();
						this._onAfterSave(oContact, true, changesInContact);
					};
					if(pictureHasBeenDeleted) {
						if(pictureHasBeenAdded) {
							// If both a picture has been deleted and a picture has been added,
							// then first a deletion request is sent to the backend and
							// in case of success a POST request is sent to the backend
							this._sendPictureRequest(oContact, oDeleteParameters, function() {
								this._sendPictureRequest(oContact, oAddParameters, fnOnAfterSave);
							});
						} else {
							this._sendPictureRequest(oContact, oDeleteParameters, fnOnAfterSave);
						}
					} else {
						this._sendPictureRequest(oContact, oAddParameters, fnOnAfterSave);
					}
				} else {
					this._onAfterSave(oContact, true, changesInContact);
				}
			} else {
				this._onAfterSave(oContact, true, changesInContact);
			}
		},

		_sendPictureRequest: function(oContact, oParameters, fnSuccess) {
			jQuery.ajax({
				url: oParameters.pictureURL,
				type: oParameters.type,
				headers: oParameters.oHeaders,
				success: jQuery.proxy(fnSuccess, this),
				error: jQuery.proxy(
					function(oMessage) {
						this.oBusyDialog.close();
						this._displayResponseErrorMessage(oMessage, cus.crm.mycontacts.util.Util.geti18NText("UPDATE_PHOTO_ERROR"));
					}
					, this),
				dataType: "json",
				data: oParameters.data
			});
		},

		_changeForPictureExists: function() {
			var pictureSrc = this.pictureModel.getProperty("/PictureSrc");
			var oldPictureSrc = this.pictureModel.getProperty("/OldPictureSrc");
			var aPictures = this.byId("contactPicture").getPictures();
			if((!pictureSrc && aPictures.length > 0 && aPictures[0].getMimeType()) || oldPictureSrc) {
				return true;
			}
			return false;
		},

		// #############################################################################################
		// Account
		// #############################################################################################

		/**
		 * Select accounts in a selectDialog control
		 */
		displayAccount: function(oEvent) {

			if(!this._accountSelectDialog) {
				this._accountSelectDialog = sap.ui.xmlfragment("cus.crm.mycontacts.view.AccountSelectDialog", this);
				//filter for category is set to NE (not equal) to 1 (Individual Account)
				var aFilters = [];
				aFilters.push(new sap.ui.model.Filter("category", sap.ui.model.FilterOperator.NE, "1"));
				this._accountSelectDialog.bindAggregation("items", {
					path : '/AccountCollection',
					template : this._accountSelectDialog.getItems()[0].clone(),
					parameters: {expand: 'MainAddress'},
					filters : aFilters,
					sorter : new sap.ui.model.Sorter("name1", false, this.groupAccount),
				});
				this._accountSelectDialog.setModel(this.oConnectionManager.getModel());
				this._accountSelectDialog.setModel(oEvent.getSource().getModel("i18n"), "i18n");

				//Ux requirement : Display "Loading..." as no data text when searching
				this.getView().getModel().attachRequestSent(
						function() {
							if(this._list) {
								this._list.setNoDataText(cus.crm.mycontacts.util.Util.geti18NText("LOADING_TEXT"));
							}
						}
						, this._accountSelectDialog);
				this.getView().getModel().attachRequestCompleted(
						function() {
							if(this._list) {
								this._list.setNoDataText(cus.crm.mycontacts.util.Util.geti18NText("NO_DATA_TEXT"));
							}
						}
						, this._accountSelectDialog);
			} else {
				this._accountSelectDialog._list.getBinding("items").filter([]);
			}

			this._accountSelectDialog.open(this.getView().getModel().getProperty("/Account"));
		},

		/**
		 * Update selected account
		 */
        selectAccount: function(oEvent) {
        	//Retrieve the selected item
        	var oSelectedItem = oEvent.getParameter("selectedItem");
        	if(oSelectedItem) {
        		var oSelectedObject = oSelectedItem.getBindingContext().getObject();
        		this._setCompany(oSelectedObject.accountID, oSelectedObject.fullName);
				this._updateAddresses(oSelectedObject.accountID);
        	}
        	this.closeAccountSelectDialog(oEvent);
        },

        closeAccountSelectDialog: function(oEvent) {
        	if(oEvent.getSource().getBinding("items").aFilters.length){
    	    	oEvent.getSource().destroyItems();
    	    }
        },

        searchAccount: function(oEvent) {
			var value = oEvent.getParameter("value");
			if(value === "") {
				oEvent.getParameter("itemsBinding").filter([]);
			} else {
				if(value !== undefined) {
					// apply the filter to the bound items, and the Select Dialog will update
					oEvent.getParameter("itemsBinding").filter([new sap.ui.model.Filter("name1", sap.ui.model.FilterOperator.Contains, value)]);
				}
			}
		},

		/**
		 * Groups the accounts alphabetically
		 */
		groupAccount: function(oContext) {
			var oText = oContext.getProperty("name1");
			if(oText && typeof oText === "string") {
				return oText.charAt(0).toUpperCase();
			}
			return "";
		},

		// #############################################################################################
		// Address
		// #############################################################################################

		_updateAddresses: function(accountID) {
			var oModel = this.oDataModel;
			var oAccountContext = new sap.ui.model.Context(oModel, "/AccountCollection('" + accountID + "')");
			var oAccount = oAccountContext.getObject();

			var fnUpdateAddresses = function(oAccount) {
				if(oAccount.category != cus.crm.mycontacts.util.Constants.accountCategoryPerson) {
					this._setAddressSelect(oAccount.accountID);
					this.byId("addressSelect").setEnabled(true);
				}
				else {
					this._adaptAddressFields(false, true);
					this.byId("addressSelect").setEnabled(false);
				}
			};

			// In case of my contact -> account context not yet bound
			if(!oAccount) {
				var oAccountPath = oAccountContext.getPath();
				var that = this;
				oModel.createBindingContext(oAccountPath, "",
					{expand : "MainAddress,Addresses"},
					function() {
						var oAccount = oModel.getProperty(oAccountPath);
						fnUpdateAddresses.call(that, oAccount);
					},
					true
				);
			} else {
				fnUpdateAddresses.call(this, oAccount);
			}
        },

        _setAddressSelect: function(accountID) {
        	var oModel = this.oDataModel;
        	var oContext = this.getView().getBindingContext();
        	var oAccountContext = new sap.ui.model.Context(oModel, "/AccountCollection('" + accountID + "')");
        	var oSelect = this.byId('addressSelect');
        	oSelect.unbindProperty("selectedKey");
    		oSelect.unbindAggregation("items");
        	if (oSelect && accountID && accountID.length > 0) {
        		var addressKey = oModel.getProperty(oContext.getPath()+"/WorkAddress/addressNumber");
        		
        		if(addressKey) {
        			this._adaptAddressFields(true, false);
        			this._bindAddressSelect(oAccountContext, addressKey);
        		} else {
        			if(this.editMode) {
        				this._adaptAddressFields(false, false);
	    				this._bindAddressSelect(oAccountContext, addressKey);
        			} else {
		        		//If contact has no work address, then use main address of account
	        			var that = this;
		    			cus.crm.mycontacts.util.Util.readODataObject(oAccountContext, "MainAddress", function(address) {
		    				addressKey = address.addressNumber;
		    				// In case address is not filled, the address fields should be read-only
		    				that._adaptAddressFields(addressKey != "", false);
		    				that._bindAddressSelect(oAccountContext, addressKey);
		    			});
        			}
        		}
        	}
        },

        _bindAddressSelect: function(oAccountContext, addressKey) {
        	var oSelect = this.byId('addressSelect');
			oSelect.setModel(this.oConnectionManager.getModel());
			oSelect.bindAggregation("items", {path: oAccountContext.getPath() + "/Addresses", template:new sap.ui.core.Item({
				key:"{addressNumber}",
				text:"{path: 'address', formatter:'cus.crm.mycontacts.formatter.ReleaseFormatter.addressFormatter'}"
			})});
			// Insert an empty entry to the drop-down list for addresses
			oSelect.insertItem(new sap.ui.core.Item({key: "", text: ""}), 0);

    		if(addressKey) {
    			oSelect.bindProperty("selectedKey", addressKey);
    			oSelect.setSelectedKey(addressKey);
    			// In case of create and full screen mode, the address field
    			// is set to the default address.
    			if(!this.editMode && this.fullScreenMode)
    				this._setDefaultAddressNumberInput(addressKey);
    			else
    				this._setAddressNumberInput(addressKey);
		    }
        },

        onAddressSelectInputFieldChanged: function(oEvent) {
        	var addressKey = oEvent.getParameter("selectedItem").getProperty('key');
            this._setAddressNumberInput(addressKey);
            // In case contact has no work address, the address fields should be read-only
            this._adaptAddressFields(addressKey != "", false);
		},

		_setDefaultAddressNumberInput: function(addressKey) {
			this.getView().getModel().setProperty(this.getView().getBindingContext().getPath() + "/WorkAddress/addressNumber", addressKey);
			this._setAddressNumberInput(addressKey);
		},
		
		_setAddressNumberInput: function(addressKey) {
			var addressNumberInput = this.getView().byId("WorkAddress.addressNumberInput");
			if(addressNumberInput)
				addressNumberInput.setValue(addressKey);
		},

		/**
		 * Adapts all address fields. First parameter is a Boolean, which determines
		 * if the fields are set to be enabled or not. Second parameter is a Boolean,
		 * which determines if the fields are emptied or not. 
		 */
		_adaptAddressFields: function(isEnabled, emptyFields) {
			var oForm = this.byId("editForm");
			if(!oForm)
				return;
			var aFormElements = oForm.getContent();
			var viewId = this.getView().getId();
			for(var i in aFormElements) {
				var oField = aFormElements[i];
				var fieldId = oField.getId();
				var regEx = new RegExp(viewId+"--WorkAddress.[A-z0-9]+Input","g");
				if(regEx.test(fieldId)) {
					oField.setEnabled(isEnabled);
					if(emptyFields)
						oField.setValue("");
				}
				if(fieldId == viewId+"--addressSelect"){
					if(emptyFields)
						oField.setSelectedKey("");
				}
			}
		},

		// #############################################################################################
		// Field checks
		// #############################################################################################

		_checkSaveNeeded: function(){
			var oContactContext = this.getView().getBindingContext();
			var oContact = oContactContext.getObject();
			var oNewContact = {};

			var changesInContact=false, changesForDependentRelations=false, changesForPicture=false;

			changesInContact = this._fillNewObject(oContact, oNewContact, "");
			if(changesInContact)
				return true;
			
			changesForDependentRelations = this._changesForDependentRelationsExists();
			if(changesForDependentRelations)
				return true;
			
			 changesForPicture = this._changeForPictureExists();
			 if(changesForPicture)
				 return true;
			 else
				 return false;
			 
			
		},

		_checkSavePossible: function(){
			//Check if all mandatory fields are filled
			var isMandatoryFieldsFilled = true;
			if(!this.editMode) {
				if (!this.byId("accountIDInput").getValue()){
					this.byId('companyValueHelp').setValueState(sap.ui.core.ValueState.Error);
					isMandatoryFieldsFilled = false;	
				}
			}
			if (this.byId("lastNameInput").getValue().length === 0){
				this.byId('lastNameInput').setValueState(sap.ui.core.ValueState.Error);
				isMandatoryFieldsFilled = false;	
			}
			
			if(!isMandatoryFieldsFilled)
				sap.m.MessageBox.alert( cus.crm.mycontacts.util.Util.geti18NText("MSG_MANDATORY_FIELDS"));
			
			return isMandatoryFieldsFilled;
		},

		_fillNewObject: function(sourceObject, targetObject, fieldPrefix) {
			var changesExist = false;
			var inputFieldId = "";
			for (var key in sourceObject) {
				inputFieldId = this.getView().getId()+"--"+fieldPrefix+key+"Input";

				if(typeof sourceObject[key] != "object" || key == "birthDate")
					targetObject[key] = sourceObject[key];

				//get new value from input field
				var oInputField = this.byId(inputFieldId);
				if (oInputField){
					var newValue = "";
					if(oInputField.getDateValue){	//special logic for dates
						newValue = oInputField.getValue();
						if(newValue == ""){
							newValue = null;
						}
						else{
							var dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({style : "medium"});
							var oDate = dateFormatter.parse(newValue);
							if(oDate){
								var oNewDate = new Date();
								oNewDate.setUTCFullYear(oDate.getFullYear());
								oNewDate.setUTCMonth(oDate.getMonth());
								oNewDate.setUTCDate(oDate.getDate());
								oNewDate.setUTCHours(0);
								oNewDate.setUTCMinutes(0);
								oNewDate.setUTCSeconds(0);
								oNewDate.setUTCMilliseconds(0);
								newValue = oNewDate;
							}
							else{
								newValue = null;
							}
						}
					}
					else if (oInputField.getSelectedKey) //special logic for select field
						newValue = oInputField.getSelectedKey();
					else if (oInputField.getValue) 	//special logic for input field
						newValue = oInputField.getValue();

					//check if the new value is different from the original value
					if (newValue && newValue.getTime){
						if(!targetObject[key] || newValue.getTime() != targetObject[key].getTime()){
							changesExist = true;
							targetObject[key] = newValue;
						}
					}
					else if(targetObject[key] != newValue){
						changesExist = true;
						targetObject[key] = newValue;
					}
				}		
			}
			return changesExist;
		},

		// #############################################################################################
		// Dependent relations
		// #############################################################################################

		_getExpandForDataBinding: function(){
			var expandString='Photo';
			var aDependentRelations = this._getDependentRelations();
			for(var i in aDependentRelations){
				expandString = expandString + "," + aDependentRelations[i];
			}
			return expandString;
		},

		_getDependentRelations: function(){
			var oDependentRelations = ["WorkAddress"];
			var oDependentCustomRelations = [];
			/** * @ControllerHook extHookGetDependentCustomRelations
			 * The method extHookGetDependentCustomRelations should return an array 
			 * with additional navigation properties for the ContactCollection, which should be considered in the create/update process 
			 * @callback cus.crm.mycontacts.view.S4~extHookGetDependentCustomRelations
			 * @return {array} */
			if (this.extHookGetDependentCustomRelations)
				oDependentCustomRelations = this.extHookGetDependentCustomRelations();
			for(var i in oDependentCustomRelations){
				oDependentRelations.push(oDependentCustomRelations[i]);
			}

			return oDependentRelations;
		},

		_getTemplateForDependentObject: function(relationName){
			return this._generateTemplateUsingMetadata("ContactCollection/"+relationName);
		},
		
		_changesForDependentRelationsExists: function(saveMode){
			var oModel = this.oDataModel;
			var oContactContext = this.getView().getBindingContext();
			var changesInDependentObject = false;
			var aDependentRelations = this._getDependentRelations();
			for(var i in aDependentRelations){
				var oDependentObject = oModel.getProperty(oContactContext+"/"+aDependentRelations[i]);	//check if entity exists. In create case it will be always empty
				if(!saveMode)
					oDependentObject = oContactContext.getProperty(aDependentRelations[i]);	//check if entity exists. In create case it will be always filled
				if(!oDependentObject)
					oDependentObject = this._getTemplateForDependentObject("ContactCollection/" + aDependentRelations[i]);	//if the entity does not exist -> use template
				var oNewDependentObject = {};
				changesInDependentObject = this._fillNewObject(oDependentObject, oNewDependentObject, aDependentRelations[i]+".");
				if(changesInDependentObject)
					return changesInDependentObject;
			}

			return changesInDependentObject;
		},

		_adaptContactWithDependentRelationsBeforeCreate: function(oNewContact) {
			var aDependentRelations = this._getDependentRelations();
			for(var i in aDependentRelations){
				var oDependentObject = this._getTemplateForDependentObject("ContactCollection/" + aDependentRelations[i]);
				var oNewDependentObject = {};
				var changesInDependentObject = this._fillNewObject(oDependentObject, oNewDependentObject, aDependentRelations[i]+".");
				if (changesInDependentObject)		
					oNewContact[aDependentRelations[i]] = oNewDependentObject;
			}
		},

		// #############################################################################################
		// Save
		// #############################################################################################

		onSaveButtonPressed: function(oEvent){
			this._saveData(false);
		},
		
		_saveData: function(forceSave){
			var eTagString = null;
			if(forceSave)
				eTagString = "*";
			
			// In case contact has no work address, the address fields are emptied
			if(!this.byId('addressSelect').getSelectedKey()) {
				this._adaptAddressFields(false, true);
			}

			if(!this._checkSavePossible())
				return;

			this._setBusy(true);
			var oModel = this.getView().getModel();
			var oContactContext = this.getView().getBindingContext();
			var oContact = oContactContext.getObject();
			var oNewContact = {};

			var changesInContact=false, changesForDependentRelations=false;

			changesInContact = this._fillNewObject(oContact, oNewContact, "");

			changesForDependentRelations = this._changesForDependentRelationsExists("saveMode");
			
			if(!changesInContact && !changesForDependentRelations && !this._changeForPictureExists()) {
				sap.m.MessageToast.show(cus.crm.mycontacts.util.Util.geti18NText("NO_CHANGE"));
				this._setBusy(false);
				this._onAfterSave(oContact, false, changesInContact);
			} else {

				var oBatchOperation, requestURL;
				var aBatchOperation = [];
				var that = this;
				if(this.editMode){
	
					if (changesInContact) {
						requestURL = oContactContext.sPath;
						oBatchOperation = oModel.createBatchOperation(requestURL, "PUT", oNewContact, {sETag: eTagString});
						aBatchOperation.push(oBatchOperation);
					}
	
					if(changesForDependentRelations) {
						this._createBatchOperationForDependentRelations(aBatchOperation, eTagString);
					}
	
					if(!changesInContact && !changesForDependentRelations && this._changeForPictureExists()){
						this._sendPictureRequests(oContact, changesInContact);
					}
					else {
						cus.crm.mycontacts.util.Util.sendBatchChangeOperations(
							this.oDataModel,
							aBatchOperation,
							function() {
								that._sendPictureRequests(oContact, changesInContact);
								sap.m.MessageToast.show(cus.crm.mycontacts.util.Util.geti18NText("UPDATE_SUCCESS"));
							},
							function(oError) {
								that._onAfterSave(null, false, changesInContact, oError);
							}
						); 
					}
				}
				else {
	
					requestURL = "/ContactCollection";
					oBatchOperation = this.oDataModel.createBatchOperation(requestURL, "POST", oNewContact);
	
					if(changesForDependentRelations){
						this._adaptContactWithDependentRelationsBeforeCreate(oNewContact);
					}
	
					aBatchOperation.push(oBatchOperation);
					cus.crm.mycontacts.util.Util.sendBatchChangeOperations(
							this.oDataModel,
							aBatchOperation,
							function(responseObject) {
								that._sendPictureRequests(responseObject, changesInContact);
								// Before navigation to display screen, a check if data has been changed is done.
								// In this check, object belonging to current binding context is
								// compared to input fields. Therefore, binding context is set to new contact.
								that.getView().setBindingContext(new sap.ui.model.Context(oModel, "/ContactCollection(contactID='" + responseObject.contactID + "',accountID='" + responseObject.accountID + "')"));
								sap.m.MessageToast.show(cus.crm.mycontacts.util.Util.geti18NText("CREATION_SUCCESS"));
							},
							function(oError) {
								that._onAfterSave(null, false, changesInContact, oError);
							}
					);
				}
			}
		},

		/**
		 * After having saved the changes of a contact, refresh contact
		 * if necessary and navigate to the display screen.
		 * @param {object} responseObject: Contact object
		 * @param {Boolean} changesExist: Indicates if contact has been changed
		 * @param {Boolean} changesInContact: Indicates if contact entity has been
		 *        changed directy (e.g. function) without considering dependent
		 *        relations (e.g. WorkAddress)
		 * @param {object} oError: Error object returned by the save process
		 */
		_onAfterSave: function(responseObject, changesExist, changesInContact, oError){
			this._setBusy(false);
			
			if(oError){
				if(this["_onAfterSaveHandleErrorCode_"+oError.statusCode])
					this["_onAfterSaveHandleErrorCode_"+oError.statusCode]();
				else
					sap.m.MessageBox.alert(oError.message.value);
				return;
			}

			var oBus = sap.ui.getCore().getEventBus();

			if(changesExist && this.editMode) {
				var contextPath = "ContactCollection(contactID='" + responseObject.contactID + "',accountID='" + responseObject.accountID + "')";
				// In case, dependent relations (e.g. WorkAddress) have been changed,
				// but the contact entity has not been changed directly (e.g. function),
				// a refresh of the contact is triggered.
				// In case, the contact entity has been changed directly, the framework
				// triggeres a refesh of the contact with dependent relations and the
				// master list.
				if(!changesInContact)
					cus.crm.mycontacts.util.Util.getRefreshUIObject(this.oConnectionManager.getModel(), "/"+contextPath , this._getExpandForDataBinding()).refresh();
				oBus.publish("cus.crm.mycontacts", "contactChanged", {
					contextPath : contextPath
				});
			}
			if(!this.editMode)
				oBus.publish("cus.crm.mycontacts", "contactCreated");
			if(this.fullScreenMode)
				window.history.back();
			else {
				if(this.editMode) {	
					var oParameter = {
						contextPath: "ContactCollection(contactID='" + responseObject.contactID + "',accountID='" + responseObject.accountID + "')",
						filter: this.filter,
						sort: this.sort,
						isSearch: this.isSearch,
						search: this.search,
						accountID: this.accountID,
						contactID: this.contactID,
						itemCount: this.itemCount
					};
					this.oRouter.navTo("detail2", oParameter, true);
				}
				else {

					var contextPath = "ContactCollection(contactID='" + responseObject.contactID + "',accountID='" + responseObject.accountID + "')";
					var searchString = (responseObject.firstName != "") 
						? responseObject.firstName + " " + responseObject.lastName
						: responseObject.lastName;					

					this.oRouter.navTo("selected", {contextPath: contextPath, name: searchString}, true);	
				}
			}
		},
		
		_onAfterSaveHandleErrorCode_412: function(){
			var that = this;
			sap.m.MessageBox.show(cus.crm.mycontacts.util.Util.geti18NText("MSG_CONFLICTING_DATA"), {
			    title: cus.crm.mycontacts.util.Util.geti18NText("CONFIRM_TITLE"),
			    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			    onClose: function (confirmed) {
					if(confirmed == sap.m.MessageBox.Action.YES){
						that._saveData(true);
					}
					else{
						var oRefreshUIObject = cus.crm.mycontacts.util.Util.getRefreshUIObject(that.getView().getModel(), that.getView().getBindingContext().sPath, that._getExpandForDataBinding());
						oRefreshUIObject.refresh(function(){
							that._setAddressSelect(that.getView().getBindingContext().getProperty("accountID"));
						}); 
					}
				},
			});
		},

		_createBatchOperationForDependentRelations: function(aBatchOperation, eTagString){
			var oModel = this.getView().getModel();
			var oContactContext = this.getView().getBindingContext();
			var oContact = oContactContext.getObject();

			var aDependentRelations = this._getDependentRelations();
			for(var i in aDependentRelations){
				var oDependentObject = oModel.getProperty(oContactContext+"/"+aDependentRelations[i]);
				var oDependentObjectContext = null;
				if (oDependentObject)
					oDependentObjectContext = oModel.getContext("/"+oContact[aDependentRelations[i]]["__ref"]); 
				var oNewDependentObject = {};

				var changesInDependentObject=false;

				var dependentObjectToBeCreated = false;
				if(!oDependentObject || this._objectKeyIsInitial(oDependentObject, "ContactCollection/"+aDependentRelations[i])){	//odata contains initial address with no keys -> only if user comes from search result list
					dependentObjectToBeCreated = true;
					oDependentObject = this._getTemplateForDependentObject(aDependentRelations[i]);
					if(oDependentObject.contactID != null && oDependentObject.contactID != undefined)
						oDependentObject.contactID = oContact.contactID;
					if(oDependentObject.personID != null && oDependentObject.personID != undefined)  //Address entity has property personID instead of contactID
						oDependentObject.personID = oContact.contactID;
					if(oDependentObject.accountID != null && oDependentObject.accountID != undefined)
						oDependentObject.accountID = oContact.accountID;
				}
				changesInDependentObject = this._fillNewObject(oDependentObject, oNewDependentObject, aDependentRelations[i]+".");

				var oBatchOperation, requestURL;
				if(changesInDependentObject){
					var httpMethod;
					if(dependentObjectToBeCreated){
						httpMethod = "POST";
						var oEntityMetadata = this.oDataModel.oMetadata._getEntityTypeByPath("ContactCollection/"+aDependentRelations[i]);
						requestURL = oEntityMetadata.name+"Collection";
					}
					else{
						httpMethod = "PUT";
						requestURL = oDependentObjectContext.sPath;
					}
					oBatchOperation = oModel.createBatchOperation(requestURL, httpMethod, oNewDependentObject, {sETag: eTagString});
					aBatchOperation.push(oBatchOperation);
				}			
			}
		},

		_objectKeyIsInitial: function(object, path){
			var oEntityMetadata = this.oDataModel.oMetadata._getEntityTypeByPath(path);
			for(var i in oEntityMetadata.key.propertyRef)
				if(object[oEntityMetadata.key.propertyRef[i].name] != "")
					return false;

			return true;
		},

		// #############################################################################################
		// Cancel
		// #############################################################################################

		onCancelButtonPressed: function() {
			var oContact = this.getView().getBindingContext().getObject();
			if(!this._checkSaveNeeded()){
				this._onAfterCancel(oContact);
				return;
			}

			sap.m.MessageBox.confirm(
				cus.crm.mycontacts.util.Util.geti18NText("CONFIRM_CANCEL"),
				jQuery.proxy(function (confirmed) {
					if(confirmed === "OK") {
						this._onAfterCancel(oContact);
					}
				}, this)
			);
		},

		_onAfterCancel: function(oContact) {
			if(this.fullScreenMode)
				window.history.back();
			else {
				if(jQuery.device.is.phone && !this.editMode) {
					this.oRouter.navTo("master", undefined, true);
				} else {
					var oParameter = {
							contextPath: this.editMode ? "ContactCollection(contactID='" + oContact.contactID + "',accountID='" + oContact.accountID + "')"
					                   				   : this.oldContextPath,
							filter: this.filter,
							sort: this.sort,
							isSearch: this.isSearch,
							search: this.search,
							accountID: this.accountID,
							contactID: this.contactID,
							itemCount: this.itemCount
					};
					this.oRouter.navTo("detail2", oParameter, true);
				}
			}
		},

		// #############################################################################################
		// Back
		// #############################################################################################

		_navBack: function() {
			if(this._checkSaveNeeded()) {
				sap.m.MessageBox.confirm(
						cus.crm.mycontacts.util.Util.geti18NText("CONFIRM_CANCEL"),
						jQuery.proxy(function (confirmed) {
							if(confirmed === "OK")
								window.history.back(1);
							}, this)
						);
			} else
				window.history.back(1);
		},

		// #############################################################################################
		// Error Handling
		// #############################################################################################

		/**
		 * Display the error message contained in the message or a default one
		 * @param oMessage
		 * @param sDefaultMessage
		 */
		_displayResponseErrorMessage:function (oMessage, sDefaultMessage) {
			var sMessage;
			if (oMessage.response) {
				sMessage = jQuery.parseJSON(oMessage.response.body).error.message.value;
			}
			sap.m.MessageBox.alert(sMessage || sDefaultMessage);
		},

		// #############################################################################################
		// Customizing for title and academic title
		// #############################################################################################

		_readCustomizing: function(callbackCustomizingRead) {
			var that = this;
			cus.crm.mycontacts.util.Util.sendBatchReadOperations(this.oDataModel, ["CustomizingTitleCollection", "CustomizingAcademicTitleCollection"], function(oResponses) {

				var aTitles = oResponses["CRM_BUPA_ODATA.CustomizingTitle"];			
				aTitles.unshift({title:"", titleDescription:"", person:"X", organization:"X", group:"X"});
				that.customizingModel.setProperty("/TitleCustomizing", aTitles);

				var aAcademicTitles = oResponses["CRM_BUPA_ODATA.CustomizingAcademicTitle"];			
				aAcademicTitles.unshift({title:"", titleDescription:""});
				that.customizingModel.setProperty("/AcademicTitleCustomizing", aAcademicTitles);

				if (callbackCustomizingRead)
					callbackCustomizingRead.call(that);
			});
		},

		_refreshDropDownBoxes: function() {
			var aDropDownBoxesIDs = this._getIDForDropDownBoxes();
			for(var i in aDropDownBoxesIDs) {
				var oDropDownBox = this.byId(this.getView().getId() + "--" + aDropDownBoxesIDs[i]);
				if(oDropDownBox) {
					var oBinding = oDropDownBox.getBinding("selectedKey");
					if(oBinding) {
						oDropDownBox.bindProperty("selectedKey", oBinding.sPath);
					}
				}
			}
		},

		_getIDForDropDownBoxes: function() {
			return ["titleIDInput", "academicTitleIDInput"];
		},

		// #############################################################################################
		// Suggestion for account
		// #############################################################################################

		_setDefaultCompany: function(accountID, company) {
			var oModel = this.getView().getModel();
			var contactContextPath = this.getView().getBindingContext().getPath();
        	oModel.setProperty(contactContextPath + "/accountID", accountID);
        	oModel.setProperty(contactContextPath + "/company", company);
        	this._setCompany(accountID, company);
        },

		_setCompany: function(accountID, company) {
			var accountIDInput = this.getView().byId("accountIDInput");
        	if(accountIDInput)
        		accountIDInput.setValue(accountID);
        	var companyInput = this.getView().byId("companyValueHelp");
        	if(companyInput)
        		companyInput.setValue(company);
        },

        onCompanySuggestItemSelected: function(oEvent) {
        	var oItem = oEvent.getParameter("selectedItem");
        	var oAccount = null;
        	for(var i in oItem.getCustomData()) {
        		var oCustomData = oItem.getCustomData()[i];
        		if (oCustomData.getKey() == "oAccount")
        			oAccount = oCustomData.getValue();
        	}
        	this._setCompany(oAccount.accountID, oAccount.fullName);
			this._updateAddresses(oAccount.accountID);
        },

        onCompanyInputFieldChanged: function(oEvent) {
        	this.byId('companyValueHelp').setValueState(sap.ui.core.ValueState.None);
        	var companyInput = oEvent.getSource();
        	this._setCompany("", companyInput.getValue());
        	this._adaptAddressFields(false, true);
        	
        	companyInput.removeAllSuggestionItems();
        	companyInput.setFilterSuggests(false);
        	var fnCheckAccount = function(aAccounts) {
        		for(var i=0; i<aAccounts.length; i++) {
        			var oAccount = aAccounts[i];
        			if(oAccount.fullName.toUpperCase() == companyInput.getValue().toUpperCase()) {
        				this._setCompany(oAccount.accountID, oAccount.fullName);
        			}
        			var oCustomData = new sap.ui.core.CustomData({key:"oAccount", value:oAccount});
        			var oItem = new sap.ui.core.Item({text:oAccount.fullName, customData:oCustomData});
        			companyInput.addSuggestionItem(oItem);
        		}
        	};
        	this._readCompany(companyInput.getValue(),fnCheckAccount);
        },

        _readCompany: function(searchString,callbackRead) {
        	var that = this;
        	var delay = (searchString ? 500 : 0);
        	window.clearTimeout(this.liveChangeTimer);
        	if(delay) {
        		this.liveChangeTimer = window.setTimeout(function () {
        			// /AccountCollection?$filter=category ne '1' andsubstringof('XXXsearchstringXXX',name1)
        			that.oDataModel.read("/AccountCollection", null, '$top=10&$filter=category%20ne%20%27'+cus.crm.mycontacts.util.Constants.accountCategoryPerson+'%27%20and%20substringof(%27'+encodeURIComponent(searchString)+'%27,name1)', true,
        					function(oData, oResponse) {
        						var accountData = jQuery.parseJSON(JSON.stringify(oData));
        						if(callbackRead)
        							callbackRead.call(that,accountData.results);
        					},
        					function(oError) {
        						jQuery.sap.log.error("Read failed in S4->_readCompany:"+oError.response.body);
        					}
        			);
        		}, delay);
        	}
        },
        
        // #############################################################################################
		// Suggestion for last name.
		// #############################################################################################

        _setContact: function(oContact, contactID) {
        	var contactIDInput = this.getView().byId("contactIDInput");
        	var titleIDInput = this.getView().byId("titleIDInput");
        	var academicTitleIDInput = this.getView().byId("academicTitleIDInput");
        	var birthDateInput = this.getView().byId("birthDateInput");

        	if(oContact) {
        		if(contactIDInput)
        			contactIDInput.setValue(oContact.accountID);
        		var lastNameInput = this.getView().byId("lastNameInput");
        		if(lastNameInput)
        			lastNameInput.setValue(oContact.name1);

        		var firstNameInput = this.getView().byId("firstNameInput");
        		if(firstNameInput)
        			firstNameInput.setValue(oContact.name2);
        		if(titleIDInput)
        			titleIDInput.setSelectedKey(oContact.titleID);
        		if(academicTitleIDInput)
        			academicTitleIDInput.setSelectedKey(oContact.academicTitleID);
        		
        		var oDate = cus.crm.mycontacts.formatter.ReleaseFormatter.formatMediumDate(oContact.birthDate);
        		if(birthDateInput)
         			birthDateInput.setValue(oDate.toString());
      		} else {
        		var oldContactID = contactIDInput.getValue();
        		// In case the app is in creation mode and the user has changed
        		// the first time the first or last name of a suggested contact, the id,
        		// title, academic title and date of birth have to be reset.
        		if(!this.editMode && oldContactID && !contactID) {
        			titleIDInput.setSelectedKey("");
        			academicTitleIDInput.setSelectedKey("");
        			birthDateInput.setValue("");
        		}
        		contactIDInput.setValue(contactID);
        	}
        },

        onLastNameSuggestItemSelected: function(oEvent) {
        	var oItem = oEvent.getParameter("selectedItem");
        	var oContact = null;
        	for(var i in oItem.getCustomData()) {
        		var oCustomData = oItem.getCustomData()[i];
        		if (oCustomData.getKey() == "oContact")
        			oContact = oCustomData.getValue();
        	}
        	this._setContact(oContact, "");
        },

        onLastNameInputFieldChanged: function(oEvent) {
        	this.byId('lastNameInput').setValueState(sap.ui.core.ValueState.None);
        	if(this.editMode){
        		this._setContact("", this.byId("contactIDInput").getValue());
        	}else{
        		// In case, the user has selected a suggested contact while being in creation mode,
    			// but then changes first or last name, a new contact with newly generated contactID will be created.
        		this._setContact("", "");
        	}
        	
        	var lastNameInput = oEvent.getSource();
        	lastNameInput.removeAllSuggestionItems();
        	lastNameInput.setFilterSuggests(false);
        	var fnCheckContact = function(aContacts) {
        		for(var i=0; i<aContacts.length; i++) {
        			var oContact = aContacts[i];
        			var oCustomData = new sap.ui.core.CustomData({key:"oContact", value:oContact});
        			var oItem = new sap.ui.core.Item({text:oContact.fullName, customData:oCustomData});
        			lastNameInput.addSuggestionItem(oItem);
        		}
        	};
        	this._readContact(lastNameInput.getValue(),fnCheckContact);
        },

        onFirstNameInputFieldChanged: function(oEvent) {
        	if(this.editMode){
        		this._setContact("", this.byId("contactIDInput").getValue());
        	}else{
        		// In case, the user has selected a suggested contact while being in creation mode,
    			// but then changes first or last name, a new contact with newly generated contactID will be created.
        		this._setContact("", "");
        	}
        },

        _readContact:function(searchString,callbackRead) {
        	var that = this;
        	var delay = (searchString ? 500 : 0);
        	window.clearTimeout(this.liveChangeTimer);
        	if(delay) {
        		this.liveChangeTimer = window.setTimeout(function () {
        			// /AccountCollection?$filter=category eq '1' and substringof('XXXsearchstringXXX',name1)
        			that.oDataModel.read("/AccountCollection", null, '$top=10&$filter=category%20eq%20%27'+cus.crm.mycontacts.util.Constants.accountCategoryPerson+'%27%20and%20substringof(%27'+encodeURIComponent(searchString)+'%27,name1)', true,
        					function(oData, oResponse) {
        						var contactData = jQuery.parseJSON(JSON.stringify(oData));
        						if(callbackRead)
        							callbackRead.call(that,contactData.results);
        					},
        					function(oError) {
        						jQuery.sap.log.error("Read failed in S4->_readContact:"+oError.response.body);
        					}
        			);
        		}, delay);
        	}
        },

        // #############################################################################################
		// redefinition of framework methods
		// #############################################################################################

		getHeaderFooterOptions: function() {
			var that = this;
			return {
				sI18NFullscreenTitle : "DETAIL_TITLE",
				buttonList : [
					{
						sI18nBtnTxt : "S4_SAVE",
						sId : "saveButton",
						onBtnPressed : jQuery.proxy(this.onSaveButtonPressed, this)
					},
					{
						sI18nBtnTxt : "S4_CANCEL",
						sId : "cancelButton",
						onBtnPressed : jQuery.proxy(this.onCancelButtonPressed, this),
					},
				],
				onBack: that._getBackFunction(),
				oAddBookmarkSettings : {
					icon : "sap-icon://Fiori2/F0004"
				},
			};
		},

		_getBackFunction: function() {
			if (this.fullScreenMode || jQuery.device.is.phone){
				var that = this;
				return function(){that.onCancelButtonPressed();};
			}
			else
				return undefined;
		},

	});

}());


},
	"cus/crm/mycontacts/view/S4.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n        xmlns:core="sap.ui.core"\n        xmlns="sap.m"\n        xmlns:ui="sap.ca.ui"\n        xmlns:form="sap.ui.layout.form"\n        xmlns:layout="sap.ui.layout"\n        controllerName="cus.crm.mycontacts.view.S4">\n    <Page id="S4_PAGE" title="{i18n>NEW_CONTACT}">\n        <content>\n        <layout:Grid defaultSpan="L12 M12 S12" width="auto">\n            <layout:content>\n                <form:SimpleForm id="editForm"\n                \t\t\t\t editable="true"\n                                 maxContainerCols="2"\n                                 layout="ResponsiveGridLayout"\n                                 labelSpanL="4"\n                                 labelSpanM="4"\n                                 emptySpanL="1"\n                                 emptySpanM="1"\n                                 columnsL="1"\n                                 columnsM="1"\n                                 class="editableForm">\n                    <form:content>\n                        <Label>\n                        </Label>\n                        <!-- Extends the form by a picture of a contact -->\n                        <core:ExtensionPoint name="extContactPicture">\n                        \t<ui:AddPicture id="contactPicture" buttonPageType="Form" maxPictureNumber="1" pictureAlign="Right"\n                                      \t   uploadUrl="/sap/bc/ui2/encode_file"\n                                     \t   pictures="{pictureModel>/Pictures}"\n                                   \t       text="{i18n>ADD_PHOTO}"\n                                           compression="high"\n                                           pictureAdded="onPictureSelected">\n                            \t<ui:pictures>\n                                \t<ui:PictureItem id="pictureItem" source="{pictureModel>src}"/>\n                            \t</ui:pictures>\n                            \t<ui:layoutData>\n                                \t<layout:GridData span="L5 M6 S10"/>\n                            \t</ui:layoutData>\n                        \t</ui:AddPicture>\n                        \t<Button id="removeContactPictureButton" icon="sap-icon://sys-cancel-2" press="onRemoveContactPicture"\n                              \t    type="Transparent" width="3rem" visible="false">\n                            \t<layoutData>\n                                \t<layout:GridData span="L2 M2 S2"/>\n                            \t</layoutData>\n                        \t</Button>\n                        </core:ExtensionPoint>\n\n\t\t\t\t\t\t<Label text="{i18n>CONTACT_TITLE}" id="titleLabel" width="100%"  required="false"/>\n                       \t<Select id="titleIDInput" value="{titleID}" items="{path:\'Customizing>/TitleCustomizing\', filters:[{path:\'person\', operator: \'EQ\', value1: \'X\' }] }" width="100%" selectedKey="{titleID}">\n                          \t\t<core:Item key="{Customizing>title}" text="{Customizing>titleDescription}"></core:Item>\n                           \t<layoutData>\n                               \t<layout:GridData span="L5 M6 S10"/>\n                           \t</layoutData>\n                       \t</Select>\n\n                       \t<Label text="{i18n>CONTACT_ACADEMIC_TITLE}" id="academicTitleLabel" width="100%" required="false"/>\n                       \t<Select id="academicTitleIDInput" value="{academicTitleID}" items="{Customizing>/AcademicTitleCustomizing}" width="100%" selectedKey="{academicTitleID}">\n                           \t<core:Item key="{Customizing>title}" text="{Customizing>titleDescription}"></core:Item>\n                           \t<layoutData>\n                               \t<layout:GridData span="L5 M6 S10"/>\n                           \t</layoutData>\n                       \t</Select>\n\n                       \t<Label text="{i18n>CONTACT_FIRST_NAME}" id="firstNameLabel" width="100%"/>\n                       \t<Input value="{firstName}"\n                       \t       maxLength="40"\n                       \t       id="firstNameInput"\n                       \t       liveChange="onFirstNameInputFieldChanged">\n                           \t<layoutData>\n                               \t<layout:GridData span="L5 M6 S10"/>\n                           \t</layoutData>\n                       \t</Input>\n\n                        <Label text="{i18n>CONTACT_LAST_NAME}" id="lastNameLabel" width="100%"  required="true"/>\n                        <Input value="{lastName}"\n                               maxLength="40"\n                               id="lastNameInput"\n                         \t   liveChange="onLastNameInputFieldChanged"\n                         \t   suggestionItemSelected= "onLastNameSuggestItemSelected">\n                         \t<layoutData>\n                         \t\t<layout:GridData span="L5 M6 S10"/>\n                            </layoutData>\n                        </Input>\n\n                        <Input id="contactIDInput" value="{contactID}" type="Text" visible="false">\n                            <layoutData>\n                         \t\t<layout:GridData span="L5 M6 S10"/>\n                            </layoutData>\n                        </Input>\n\n                       \t<Label text="{i18n>CONTACT_FUNCTION}" id="functionLabel" width="100%" required="false"/>\n                       \t<Input value="{function}" maxLength="40" id="functionInput">\n                           \t<layoutData>\n                               \t<layout:GridData span="L5 M6 S10"/>\n                           \t</layoutData>\n                       \t</Input>\n\n                       \t<Label text="{i18n>CONTACT_DEPARTMENT}" id="departmentLabel" width="100%"  required="false"/>\n                       \t<Input value="{department}" maxLength="40" id="departmentInput">\n                           \t<layoutData>\n                               \t<layout:GridData span="L5 M6 S10"/>\n                           \t</layoutData>\n                       \t</Input>\n                       \t\n                        <Label text="{i18n>CONTACT_ACCOUNT}" id="accountLabel" width="100%" required="true"/>\n                        <Input value="{company}"\n                        \t   maxLength="80"\n                        \t   id="companyValueHelp"\n                        \t   placeholder="{i18n>SELECT_ACCOUNT}"\n                        \t   showValueHelp="true"\n                        \t   valueHelpOnly="false"\n                        \t   valueHelpRequest="displayAccount"\n                        \t   liveChange="onCompanyInputFieldChanged"\n                        \t   suggestionItemSelected="onCompanySuggestItemSelected">\n                            <layoutData>\n                               \t<layout:GridData span="L5 M6 S10"/>\n                           \t</layoutData>\n                        </Input>\n\n                        <Input id="accountIDInput" value="{accountID}" type="Text" visible="false">\n                           \t<layoutData>\n                               \t<layout:GridData span="L5 M6 S10"/>\n                           \t</layoutData>\n                        </Input>\n\n                       \t<Label text="{i18n>CONTACT_ADDRESS}" id="addressLabel" width="100%" visible="true"/>\n                       \t<Select id="addressSelect" width="100%" change="onAddressSelectInputFieldChanged" visible="true">\n                           \t<layoutData>\n                               \t<layout:GridData span="L5 M6 S10"/>\n                           \t</layoutData>\n                       \t</Select>\n\n                        <Input id="WorkAddress.addressNumberInput" type="Text" value="{WorkAddress/addressNumber}" visible="false">\n                            <layoutData>\n                            \t<layout:GridData span="L5 M6 S10"/>\n                            </layoutData>\n                        </Input>\n\n                       \t<Label text="{i18n>CONTACT_MOBILE_PHONE}" id="WorkAddress.mobilePhoneLabel" width="100%" required="false" visible="true"/>\n                       \t<Input value="{WorkAddress/mobilePhone}" maxLength="30" id="WorkAddress.mobilePhoneInput" visible="true">\n                           \t<layoutData>\n                               \t<layout:GridData span="L5 M6 S10"/>\n                           \t</layoutData>\n                       \t</Input>\n\n                       \t<Label text="{i18n>CONTACT_PHONE}" id="WorkAddress.phoneLabel" width="100%" visible="true"/>\n                       \t<Input value="{WorkAddress/phone}" maxLength="30" id="WorkAddress.phoneInput" visible="true">\n                           \t<layoutData>\n                               \t<layout:GridData span="L5 M6 S10"/>\n                           \t</layoutData>\n                       \t</Input>\n\n                       \t<Label text="{i18n>CONTACT_EMAIL}" id="WorkAddress.emailLabel" width="100%" visible="true"/>\n                       \t<Input value="{WorkAddress/email}" maxLength="241" id="WorkAddress.emailInput" visible="true">\n                           \t<layoutData>\n                               \t<layout:GridData span="L5 M6 S10"/>\n                           \t</layoutData>\n                       \t</Input>\n\n                       \t<Label text="{i18n>CONTACT_BIRTHDAY}" id="birthDateLabel" width="100%" required="false"/>\n                       \t<DatePicker value="{path:\'birthDate\', type:\'sap.ui.model.type.Date\', formatOptions: { style: \'medium\'}}" id="birthDateInput" width="100%" displayFormat="medium">\n                           \t<layoutData>\n                               \t<layout:GridData span="L5 M6 S10"/>\n                           \t</layoutData>\n                       \t</DatePicker>\n\n\t\t\t\t\t\t<!-- Extends the form containing contact data -->\n                       \t<core:ExtensionPoint name="extContactDataInfo" />\n\n                    </form:content>\n                </form:SimpleForm>\n            </layout:content>\n        </layout:Grid>\n        </content>\n    </Page>\n</core:View>\n'
}});
