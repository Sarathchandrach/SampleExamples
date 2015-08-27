jQuery.sap.registerPreloadedModules({
"name":"cus/crm/ppm/mgr/Component-preload",
"version":"2.0",
"modules":{
	"cus/crm/ppm/mgr/Component.js":function(){/*
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
},
	"cus/crm/ppm/mgr/Configuration.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.ppm.mgr.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ui.getCore().loadLibrary("sap.viz");
//jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("cus.crm.ppm.mgr.simulator.simulator", ".css"),"sap-ui-theme-sap.crm.ppm");

jQuery.sap.require("cus.crm.ppm.mgr.controls.Bubble");
jQuery.sap.require("cus.crm.ppm.mgr.controls.BubbleChart");
jQuery.sap.require("cus.crm.ppm.mgr.controls.BubbleChartRenderer");
jQuery.sap.require("cus.crm.ppm.mgr.controls.MDualSlider");
jQuery.sap.require("cus.crm.ppm.mgr.controls.MDualSliderLabel");
jQuery.sap.require("cus.crm.ppm.mgr.controls.MDualSliderRenderer");

sap.ca.scfld.md.ConfigurationBase.extend("cus.crm.ppm.mgr.Configuration", {

	oServiceParams : {
		serviceList : [ {
			name : "CRM_SALESPIPELINE_MANAGER",
			masterCollection : "Opportunities",
			serviceUrl : "/sap/opu/odata/sap/CRM_SALESPIPELINE_MANAGER/",
			isDefault : true,
			mockedDataSource : "/cus.crm.ppm.mgr/model/metadata.xml"
		} ]
	},

	getServiceParams : function() {
		return this.oServiceParams;
	},

	/**
	 * @inherit
	 */
	getServiceList : function() {
		return this.oServiceParams.serviceList;
	},

	getMasterKeyAttributes : function() {
		return [ "Id" ];
	},

	getExcludedQueryStringParameters : function() {
		return [ "sap-client", "sap-language" ];
	}
});
},
	"cus/crm/ppm/mgr/Main.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("cus.crm.ppm.mgr.Main", {

	onInit : function() {
		jQuery.sap.require("cus.crm.ppm.mgr.util.formatter");
		jQuery.sap.require("sap.ca.scfld.md.Startup");
		sap.ca.scfld.md.Startup.init('cus.crm.ppm.mgr', this);
	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources
	 * and finalize activities.
	 * 
	 * @memberOf MainXML
	 */
	onExit : function() {
		// exit cleanup code here
		if (document.getElementById("acButAppS")) {
			var oButton = document.getElementById("acButAppS");
			if(sap.ui.Device.browser.name == sap.ui.Device.browser.BROWSER.INTERNET_EXPLORER)
				oButton.parentNode.removeChild(oButton);
			else
				oButton.remove();
		}
		if(document.getElementById("liBarChart")) {
			var oLI = document.getElementById("liBarChart");
			if(sap.ui.Device.browser.name == sap.ui.Device.browser.BROWSER.INTERNET_EXPLORER)
				oLI.parentNode.removeChild(oLI);
			else
				oLI.remove();
		}
		if (sap.ui.getCore().byId("acButAppS"))
			sap.ui.getCore().byId("acButAppS").destroy();
		if (sap.ui.getCore().byId("liBarChart"))
			sap.ui.getCore().byId("liBarChart").destroy();
	}
});
},
	"cus/crm/ppm/mgr/Main.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core" xmlns="sap.m"\n\tcontrollerName="cus.crm.ppm.mgr.Main" displayBlock="true" height="100%">\n\t<App id="fioriContent" class="cusCrmSalesPipelineSim" showHeader="false">\n\t</App>\n</core:View>',
	"cus/crm/ppm/mgr/i18n/i18n.properties":'# Track Sales Pipeline\n# __ldi.translation.uuid=7f5341c0-1f59-11e3-8224-0800200c9a66\n# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\n\n# Note: This file was created according to the conventions that can be found at \n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\n\n\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\nFULLSCREEN_TITLE=Track Sales Pipeline\n\n#XFLD: This is the label for the Target value achieved text\nLBL_OF=of\n\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\nLBL_TARGET_ACHIEVEMENT=Target Achievement\n\n#XBUT: This is the button\'s text indicating the option for the user the logout.\nBTN_LOGOUT=Log Out\n\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\nBTN_APPSETTINGS=App Settings\n\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\nBTN_ACTIONLIST=Actions\n\n#XTIT: This is the title message of the application settings dialog.\nAPPSETTINGS_TITLE=App Settings\n\n#XLST: This is the list item\'s text present in application settings dialog.\nSALESTARGET_ITEM=Sales Target\n\n#XLST: This is the list item\'s text present in application settings dialog.\nOPPORTUNITY_ITEM=Opportunity\n\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\nBTN_CLOSE_APPSETT=Close\n\n#XTIT: This is the title message of the Sales Target Settings dialog.\nAS_SALESTARGET_TITLE=Sales Target Details\n\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\nLBL_ST_SALESPERIOD=Sales Target Periodicity\n\n#XFLD: This is the label indicating the target amount for the current sales period.\nLBL_ST_SALESTARGET=Sales Target for Current Period\n\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\nLBL_ST_CURRENCY=Currency\n\n#XFLD: This is the label indicating the sales period\'s timespan.\nLBL_ST_TIMESPAN=Time Span\n\n#XFLD: This is the label indicating the start of the Sales Period.\nLBL_ST_TIMEFROM=From\n\n#XFLD: This is the label indicating the end of the Sales Period.\nLBL_ST_TIMETO=To\n\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\nBTN_AS_SAVEAPPSETT=Save\n\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\nBTN_AS_CANCELAPPSETT=Cancel\n\n#XTIT: This is the title message of the Opportunity Settings dialog.\nAS_OPPORTUNITY_TITLE=View Opportunity Settings\n\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\nLBL_OP_STEPVALUE=Step Value\n\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\nLBL_OP_SETVALUES=Set Values Manually\n\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\nLBL_OP_MINVALUE=Minimum Opportunity Value\n\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\nLBL_OP_MAXVALUE=Maximum Opportunity Value\n\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\nBTN_SAVE_OPPORT=Save\n\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\nBTN_REFRESH_APP=Reset\n\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\nBTN_EXPORTEXCL=Export to Excel\n\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\nBTN_SHARETO=Share\n\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\nBTN_SHOW_CHANGELOG=View Change Log\n\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\nLBL_CONFIRM_REFRESH=Any unsaved changes will be lost. Do you want to continue?\n\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\nLBL_SUCCESSUPDATE=Update Successful\n\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\nLBL_FAILEDUPDATE=Update Failed\n\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\nBTN_RF_OK=OK\n\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\nBTN_RF_CANCEL=Cancel\n\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\nCHANGELOG_TITLE=View Change Log\n\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\nLBL_CL_CHANGES=Changes\n\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\nLBL_CL_NEWVALUE=New Value\n\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\nLBL_CL_OLDVALUE=Old Value\n\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\nBTN_CL_DISCARD=Discard\n\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\nBTN_CL_CLOSE=Close\n\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\nBTN_TBT_CLOSE=Close\n\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \nLBL_OPPORT_DETAILS=Details\n\n#XFLD: This is the label indicating the start date of the opportunity selected.\nLBL_OD_STARTDATE=Start Date\n\n#XFLD: This is the label indicating the end date of the opportunity selected.\nLBL_OD_ENDDATE=End Date\n\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\nLBL_OD_EXPECTEDREVENUEHEADER=Expected Sales Volume\n\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\nLBL_OD_EXPECTEDREVENUE=Unweighted\n\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\nLBL_OD_WEIGHTEDREVENUE=Weighted\n\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\nLBL_OD_FORECASTRELEVANCE=Relevant for Forecast\n\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\nLBL_OD_CHANCEOFSUCCESS=Chance of Success (in %)\n\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\nLBL_OD_SALESSTAGE=Sales Stage\n\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\nLBL_OD_STATUS=Status\n\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\nLBL_OD_ACCPROSPECT=Account\n\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\nLBL_OD_MAINCONTACT=Main Contact\n\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\nLBL_OD_EMPLRESP=Employee Responsible\n\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\nBTN_OD_OK=OK\n\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\nBTN_OD_CANCEL=Cancel\n\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\nLBL_OVERALL_TARGET=Overall Target\n\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\nBTN_SELECT_SALESPIPELINE=Team\'s Sales Pipeline\n\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\nBTN_SELECT_TOP10OPPORTUNITIES=Top 10 Opportunities\n\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\nBTN_SELECT_BARCHART=Target By Team\n\n#XMSG: This is the Label to Show Employee Name.\nEMP_NAME=Employee Name\n\n#XFLD: This is the Employee Id\nEMP_ID=Employee ID\n\n#XMSG: This is the Label to Show Account Name.\nACC_NAME=Account Name\n\n#XFLD: This is the Account Id\nACC_ID=Account ID\n\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\nERROR_MSG=Error\n\n#XFLD: This is the Employee Responsible\nEMPLOYEE_RESPONSIBLE=Employee Responsible\n\n#XFLD: This is the Accounts .\nACCOUNTS=Accounts\n\n#XFLD: This is the sales organizations .\nLBL_ORG=Sales Organizations\n\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\nLBL_NOOFTO_SELECTED = Top {0} Opportunities\n\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\nLBL_ALLTO_SELECTED = All Opportunities\n\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\nLBL_NOTO_SELECTED = No Opportunity\n\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\nLBL_CBX_EXCLUDE_LOST= Exclude Lost\n\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\nLBL_CBX_EXCLUDE_WON=Exclude Won\n\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\nBTN_OPEN_OPPORTUNITY_SLIDER=Display By Size\n\n#XFLD: This is the label indicating the y axis label for target by team.\nLBL_REVENUE=Revenue\n\n#XFLD: This is the label indicating the target for target by team chart.\nLBL_TARGET=Target\n\n#XFLD: This is the label indicating the Expected for target by team chart.\nLBL_EXPECTED=Expected\n\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\nLBL_SALESSTAGE=Sales Stage\n\n#XFLD: This is the label indicating the organization name for those opportunities who are not maintaining organization.\nLBL_OTHERS=Others\n\n#XBUT: This is the Button\'s text indicating user to open Opportunity related to organization.\nBTN_VIEW_DETAILS=View Details\n\n#XFLD: This is the label indicating the bar chart\'s measure with respect to a currency (parameter)\nLBL_REVENUE_BAR_CHART=Revenue ({0})',
	"cus/crm/ppm/mgr/i18n/i18n_ar.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=\\u062A\\u062A\\u0628\\u0639 \\u062E\\u0637\\u0629 \\u0627\\u0644\\u0645\\u0628\\u064A\\u0639\\u0627\\u062A\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=\\u0645\\u0646\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=\\u0625\\u0646\\u062C\\u0627\\u0632 \\u0627\\u0644\\u0647\\u062F\\u0641\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=\\u062A\\u0633\\u062C\\u064A\\u0644 \\u062E\\u0631\\u0648\\u062C\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=\\u0625\\u0639\\u062F\\u0627\\u062F\\u0627\\u062A\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=\\u0627\\u0644\\u0625\\u062C\\u0631\\u0627\\u0621\\u0627\\u062A\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=\\u0625\\u062F\\u0627\\u0631\\u0629 \\u0627\\u0644\\u0625\\u0639\\u062F\\u0627\\u062F\\u0627\\u062A\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=\\u0647\\u062F\\u0641 \\u0627\\u0644\\u0645\\u0628\\u064A\\u0639\\u0627\\u062A\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=\\u0627\\u0644\\u0641\\u0631\\u0635\\u0629 \\u0627\\u0644\\u0628\\u064A\\u0639\\u064A\\u0629\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=\\u0625\\u063A\\u0644\\u0627\\u0642\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=\\u0625\\u062F\\u0627\\u0631\\u0629 \\u0625\\u0639\\u062F\\u0627\\u062F\\u0627\\u062A \\u0647\\u062F\\u0641 \\u0627\\u0644\\u0645\\u0628\\u064A\\u0639\\u0627\\u062A\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=\\u0627\\u0644\\u0641\\u0627\\u0635\\u0644 \\u0627\\u0644\\u062F\\u0648\\u0631\\u064A \\u0644\\u0647\\u062F\\u0641 \\u0627\\u0644\\u0645\\u0628\\u064A\\u0639\\u0627\\u062A\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=\\u0647\\u062F\\u0641 \\u0627\\u0644\\u0645\\u0628\\u064A\\u0639\\u0627\\u062A \\u0644\\u0644\\u0641\\u062A\\u0631\\u0629 \\u0627\\u0644\\u062D\\u0627\\u0644\\u064A\\u0629\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=\\u0627\\u0644\\u0639\\u0645\\u0644\\u0629\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=\\u0627\\u0644\\u0641\\u062A\\u0631\\u0629 \\u0627\\u0644\\u0632\\u0645\\u0646\\u064A\\u0629\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=\\u0645\\u0646\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=\\u0625\\u0644\\u0649\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=\\u062D\\u0641\\u0638\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=\\u0625\\u0644\\u063A\\u0627\\u0621\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=\\u0625\\u062F\\u0627\\u0631\\u0629 \\u0625\\u0639\\u062F\\u0627\\u062F\\u0627\\u062A \\u0627\\u0644\\u0641\\u0631\\u0635\\u0629 \\u0627\\u0644\\u0628\\u064A\\u0639\\u064A\\u0629\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=\\u0642\\u064A\\u0645\\u0629 \\u0627\\u0644\\u062E\\u0637\\u0648\\u0629\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=\\u062A\\u0639\\u064A\\u064A\\u0646 \\u0627\\u0644\\u0642\\u064A\\u0645 \\u064A\\u062F\\u0648\\u064A\\u064B\\u0627\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=\\u0623\\u062F\\u0646\\u0649 \\u0642\\u064A\\u0645\\u0629 \\u0644\\u0644\\u0641\\u0631\\u0635\\u0629 \\u0627\\u0644\\u0628\\u064A\\u0639\\u064A\\u0629\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=\\u0623\\u0642\\u0635\\u0649 \\u0642\\u064A\\u0645\\u0629 \\u0644\\u0644\\u0641\\u0631\\u0635\\u0629 \\u0627\\u0644\\u0628\\u064A\\u0639\\u064A\\u0629\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=\\u062D\\u0641\\u0638\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=\\u0625\\u0639\\u0627\\u062F\\u0629 \\u062A\\u0639\\u064A\\u064A\\u0646\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=\\u062A\\u0635\\u062F\\u064A\\u0631 \\u0625\\u0644\\u0649 Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=\\u0645\\u0634\\u0627\\u0631\\u0643\\u0629\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=\\u0639\\u0631\\u0636 \\u0633\\u062C\\u0644 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=\\u0633\\u064A\\u062A\\u0645 \\u0641\\u0642\\u062F \\u0623\\u064A \\u0628\\u064A\\u0627\\u0646\\u0627\\u062A \\u063A\\u064A\\u0631 \\u0645\\u062D\\u0641\\u0648\\u0638\\u0629. \\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0628\\u0627\\u0644\\u062A\\u0623\\u0643\\u064A\\u062F \\u0627\\u0644\\u0645\\u062A\\u0627\\u0628\\u0639\\u0629\\u061F\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=\\u062A\\u0645 \\u062D\\u0641\\u0638 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\\u0627\\u062A\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=\\u0641\\u0634\\u0644 \\u0627\\u0644\\u062A\\u062D\\u062F\\u064A\\u062B\r\n\r\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\r\nBTN_RF_OK=\\u0645\\u0648\\u0627\\u0641\\u0642\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\r\nBTN_RF_CANCEL=\\u0625\\u0644\\u063A\\u0627\\u0621\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=\\u0639\\u0631\\u0636 \\u0633\\u062C\\u0644 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=\\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\\u0627\\u062A\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=\\u0642\\u064A\\u0645\\u0629 \\u062C\\u062F\\u064A\\u062F\\u0629\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=\\u0642\\u064A\\u0645\\u0629 \\u0642\\u062F\\u064A\\u0645\\u0629\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=\\u062A\\u062C\\u0627\\u0647\\u0644\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=\\u0625\\u063A\\u0644\\u0627\\u0642\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\r\nBTN_TBT_CLOSE=\\u0625\\u063A\\u0644\\u0627\\u0642\r\n\r\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=\\u0627\\u0644\\u0641\\u0631\\u0635\\u0629 \\u0627\\u0644\\u0628\\u064A\\u0639\\u064A\\u0629\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0628\\u062F\\u0627\\u064A\\u0629\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0627\\u0646\\u062A\\u0647\\u0627\\u0621\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=\\u062D\\u062C\\u0645 \\u0627\\u0644\\u0645\\u0628\\u064A\\u0639\\u0627\\u062A \\u0627\\u0644\\u0645\\u062A\\u0648\\u0642\\u0639\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=\\u063A\\u064A\\u0631 \\u0645\\u0631\\u062C\\u062D\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=\\u0645\\u0631\\u062C\\u062D\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=\\u0630\\u0648 \\u0635\\u0644\\u0629 \\u0628\\u0627\\u0644\\u062A\\u0648\\u0642\\u0639\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=\\u0646\\u0633\\u0628\\u0629 \\u0641\\u0631\\u0635 \\u0627\\u0644\\u0646\\u062C\\u0627\\u062D\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=\\u0645\\u0631\\u062D\\u0644\\u0629 \\u0627\\u0644\\u0645\\u0628\\u064A\\u0639\\u0627\\u062A\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=\\u0627\\u0644\\u062D\\u0627\\u0644\\u0629\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=\\u0627\\u0644\\u0639\\u0645\\u064A\\u0644\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=\\u062C\\u0647\\u0629 \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644 \\u0627\\u0644\\u0631\\u0626\\u064A\\u0633\\u064A\\u0629\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=\\u0627\\u0644\\u0645\\u0648\\u0638\\u0641 \\u0627\\u0644\\u0645\\u0633\\u0624\\u0648\\u0644\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=\\u0645\\u0648\\u0627\\u0641\\u0642\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=\\u0625\\u0644\\u063A\\u0627\\u0621\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\r\nLBL_OVERALL_TARGET=\\u0627\\u0644\\u0647\\u062F\\u0641 \\u0627\\u0644\\u0643\\u0644\\u064A\r\n\r\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\r\nBTN_SELECT_SALESPIPELINE=\\u062E\\u0637\\u0629 \\u0645\\u0628\\u064A\\u0639\\u0627\\u062A \\u0627\\u0644\\u0641\\u0631\\u064A\\u0642\r\n\r\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\r\nBTN_SELECT_TOP10OPPORTUNITIES=\\u0623\\u0639\\u0644\\u0649 10 \\u0641\\u0631\\u0635 \\u0628\\u064A\\u0639\\u064A\\u0629\r\n\r\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\r\nBTN_SELECT_BARCHART=\\u0627\\u0644\\u0647\\u062F\\u0641 \\u062D\\u0633\\u0628 \\u0627\\u0644\\u0641\\u0631\\u064A\\u0642\r\n\r\n#XMSG: This is the Label to Show Employee Name.\r\nEMP_NAME=\\u0627\\u0633\\u0645 \\u0627\\u0644\\u0645\\u0648\\u0638\\u0641\r\n\r\n#XFLD: This is the Employee Id\r\nEMP_ID=\\u0645\\u0639\\u0631\\u0641 \\u0627\\u0644\\u0645\\u0648\\u0638\\u0641\r\n\r\n#XMSG: This is the Label to Show Account Name.\r\nACC_NAME=\\u0627\\u0633\\u0645 \\u0627\\u0644\\u0639\\u0645\\u064A\\u0644\r\n\r\n#XFLD: This is the Account Id\r\nACC_ID=\\u0645\\u0639\\u0631\\u0641 \\u0627\\u0644\\u062D\\u0633\\u0627\\u0628\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=\\u062E\\u0637\\u0623\r\n\r\n#XFLD: This is the Employee Responsible\r\nEMPLOYEE_RESPONSIBLE=\\u0627\\u0644\\u0645\\u0648\\u0638\\u0641\\u0648\\u0646 \\u0627\\u0644\\u0645\\u0633\\u0624\\u0648\\u0644\\u0648\\u0646\r\n\r\n#XFLD: This is the Accounts .\r\nACCOUNTS=\\u0627\\u0644\\u0639\\u0645\\u0644\\u0627\\u0621\r\n\r\n#XFLD: This is the sales organizations .\r\nLBL_ORG=\\u0645\\u0646\\u0638\\u0645\\u0627\\u062A \\u0627\\u0644\\u0645\\u0628\\u064A\\u0639\\u0627\\u062A\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=\\u0623\\u0639\\u0644\\u0649 {0} \\u0645\\u0646 \\u0627\\u0644\\u0641\\u0631\\u0635 \\u0627\\u0644\\u0628\\u064A\\u0639\\u064A\\u0629\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=\\u0643\\u0644 \\u0627\\u0644\\u0641\\u0631\\u0635 \\u0627\\u0644\\u0628\\u064A\\u0639\\u064A\\u0629\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=\\u0644\\u0627 \\u062A\\u062A\\u0648\\u0641\\u0631 \\u0623\\u064A \\u0641\\u0631\\u0635\\u0629 \\u0628\\u064A\\u0639\\u064A\\u0629\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=\\u0627\\u0633\\u062A\\u062B\\u0646\\u0627\\u0621 \\u0627\\u0644\\u062E\\u0633\\u0627\\u0626\\u0631\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=\\u0627\\u0633\\u062A\\u062B\\u0646\\u0627\\u0621 \\u0627\\u0644\\u0645\\u0643\\u0627\\u0633\\u0628\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=\\u0639\\u0631\\u0636 \\u062D\\u0633\\u0628 \\u0627\\u0644\\u062D\\u062C\\u0645\r\n\r\n#XFLD: This is the label indicating the y axis label for target by team.\r\nLBL_REVENUE=\\u0627\\u0644\\u0625\\u064A\\u0631\\u0627\\u062F\r\n\r\n#XFLD: This is the label indicating the target for target by team chart.\r\nLBL_TARGET=\\u0627\\u0644\\u0647\\u062F\\u0641\r\n\r\n#XFLD: This is the label indicating the Expected for target by team chart.\r\nLBL_EXPECTED=\\u0627\\u0644\\u0645\\u062A\\u0648\\u0642\\u064E\\u0639\r\n\r\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\r\nLBL_SALESSTAGE=\\u0645\\u0631\\u062D\\u0644\\u0629 \\u0627\\u0644\\u0645\\u0628\\u064A\\u0639\\u0627\\u062A\r\n\r\n#XFLD: This is the label indicating the organization name for those opportunities who are not maintaining organization.\r\nLBL_OTHERS=\\u0623\\u062E\\u0631\\u0649\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Opportunity related to organization.\r\nBTN_VIEW_DETAILS=\\u0639\\u0631\\u0636 \\u0627\\u0644\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644\r\n\r\n#XFLD: This is the label indicating the bar chart\'s measure with respect to a currency (parameter)\r\nLBL_REVENUE_BAR_CHART=\\u0627\\u0644\\u0625\\u064A\\u0631\\u0627\\u062F ({0})\r\n',
	"cus/crm/ppm/mgr/i18n/i18n_bg.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=\\u041F\\u0440\\u043E\\u0441\\u043B\\u0435\\u0434\\u044F\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 pipeline \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\\u0431\\u0438\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=\\u043E\\u0442\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=\\u041F\\u043E\\u0441\\u0442\\u0438\\u0433\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0446\\u0435\\u043B\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=\\u0418\\u0437\\u0445\\u043E\\u0434\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=\\u041D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=\\u0414\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u044F\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=\\u0423\\u043F\\u0440\\u0430\\u0432\\u043B\\u0435\\u043D\\u0438\\u0435 \\u043D\\u0430 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=\\u0426\\u0435\\u043B \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\\u0431\\u0438\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=\\u0412\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=\\u0417\\u0430\\u0442\\u0432\\u0430\\u0440\\u044F\\u043D\\u0435\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=\\u0423\\u043F\\u0440\\u0430\\u0432\\u043B\\u0435\\u043D\\u0438\\u0435 \\u043D\\u0430 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438 \\u0437\\u0430 \\u0446\\u0435\\u043B \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\\u0431\\u0438\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=\\u041F\\u0435\\u0440\\u0438\\u043E\\u0434\\u0438\\u0447\\u043D\\u043E\\u0441\\u0442 \\u043D\\u0430 \\u0446\\u0435\\u043B \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\\u0431\\u0438\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=\\u0426\\u0435\\u043B \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\\u0431\\u0438 \\u0437\\u0430 \\u0442\\u0435\\u043A\\u0443\\u0449 \\u043F\\u0435\\u0440\\u0438\\u043E\\u0434\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=\\u0412\\u0430\\u043B\\u0443\\u0442\\u0430\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=\\u0412\\u0440\\u0435\\u043C\\u0435\\u0432\\u0438 \\u0438\\u043D\\u0442\\u0435\\u0440\\u0432\\u0430\\u043B\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=\\u041E\\u0442\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=\\u0414\\u043E\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=\\u0417\\u0430\\u043F\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=\\u041E\\u0442\\u043A\\u0430\\u0437\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=\\u0423\\u043F\\u0440\\u0430\\u0432\\u043B\\u0435\\u043D\\u0438\\u0435 \\u043D\\u0430 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438 \\u0437\\u0430 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=\\u0421\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442 \\u043D\\u0430 \\u0441\\u0442\\u044A\\u043F\\u043A\\u0430\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=\\u0420\\u044A\\u0447\\u043D\\u043E \\u0437\\u0430\\u0434\\u0430\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0441\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442\\u0438\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=\\u041C\\u0438\\u043D\\u0438\\u043C\\u0430\\u043B\\u043D\\u0430 \\u0441\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442 \\u043D\\u0430 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=\\u041C\\u0430\\u043A\\u0441\\u0438\\u043C\\u0430\\u043B\\u043D\\u0430 \\u0441\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442 \\u043D\\u0430 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=\\u0417\\u0430\\u043F\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=\\u041F\\u043E\\u0432\\u0442\\u043E\\u0440\\u043D\\u043E \\u0437\\u0430\\u0434\\u0430\\u0432\\u0430\\u043D\\u0435\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=\\u0415\\u043A\\u0441\\u043F\\u043E\\u0440\\u0442 \\u0432 Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=\\u0421\\u043F\\u043E\\u0434\\u0435\\u043B\\u044F\\u043D\\u0435\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=\\u041F\\u0440\\u0435\\u0433\\u043B\\u0435\\u0434 \\u043D\\u0430 \\u0436\\u0443\\u0440\\u043D\\u0430\\u043B \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=\\u041D\\u0435\\u0437\\u0430\\u043F\\u0430\\u0437\\u0435\\u043D\\u0438\\u0442\\u0435 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438 \\u0449\\u0435 \\u0431\\u044A\\u0434\\u0430\\u0442 \\u0438\\u0437\\u0433\\u0443\\u0431\\u0435\\u043D\\u0438. \\u0421\\u0438\\u0433\\u0443\\u0440\\u043D\\u0438 \\u043B\\u0438 \\u0441\\u0442\\u0435, \\u0447\\u0435 \\u0436\\u0435\\u043B\\u0430\\u0435\\u0442\\u0435 \\u0434\\u0430 \\u043F\\u0440\\u043E\\u0434\\u044A\\u043B\\u0436\\u0438\\u0442\\u0435?\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=\\u041F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438\\u0442\\u0435 \\u0441\\u0430 \\u0437\\u0430\\u043F\\u0430\\u0437\\u0435\\u043D\\u0438\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=\\u041D\\u0435\\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u0430 \\u0430\\u043A\\u0442\\u0443\\u0430\\u043B\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F\r\n\r\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\r\nBTN_RF_CANCEL=\\u041E\\u0442\\u043A\\u0430\\u0437\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=\\u041F\\u0440\\u0435\\u0433\\u043B\\u0435\\u0434 \\u043D\\u0430 \\u0436\\u0443\\u0440\\u043D\\u0430\\u043B \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=\\u041F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=\\u041D\\u043E\\u0432\\u0430 \\u0441\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=\\u0421\\u0442\\u0430\\u0440\\u0430 \\u0441\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=\\u041E\\u0442\\u0445\\u0432\\u044A\\u0440\\u043B\\u044F\\u043D\\u0435\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=\\u0417\\u0430\\u0442\\u0432\\u0430\\u0440\\u044F\\u043D\\u0435\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\r\nBTN_TBT_CLOSE=\\u0417\\u0430\\u0442\\u0432\\u0430\\u0440\\u044F\\u043D\\u0435\r\n\r\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=\\u0412\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=\\u041D\\u0430\\u0447\\u0430\\u043B\\u043D\\u0430 \\u0434\\u0430\\u0442\\u0430\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=\\u041A\\u0440\\u0430\\u0439\\u043D\\u0430 \\u0434\\u0430\\u0442\\u0430\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=\\u041E\\u0447\\u0430\\u043A\\u0432\\u0430\\u043D \\u043E\\u0431\\u0435\\u043C \\u043D\\u0430 \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\\u0431\\u0438\\u0442\\u0435\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=\\u041D\\u0435\\u043F\\u0440\\u0435\\u0442\\u0435\\u0433\\u043B\\u0435\\u043D\\u0438\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=\\u041F\\u0440\\u0435\\u0442\\u0435\\u0433\\u043B\\u0435\\u043D\\u0438\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=\\u0420\\u0435\\u043B\\u0435\\u0432\\u0430\\u043D\\u0442\\u0435\\u043D \\u0437\\u0430 \\u043F\\u0440\\u043E\\u0433\\u043D\\u043E\\u0437\\u0430\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=\\u0428\\u0430\\u043D\\u0441 \\u0437\\u0430 \\u0443\\u0441\\u043F\\u0435\\u0445 (\\u0432 %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=\\u0415\\u0442\\u0430\\u043F \\u043D\\u0430 \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\\u0431\\u0438\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=\\u0421\\u0442\\u0430\\u0442\\u0443\\u0441\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=\\u0410\\u043A\\u0430\\u0443\\u043D\\u0442\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=\\u041E\\u0441\\u043D\\u043E\\u0432\\u0435\\u043D \\u0434\\u043E\\u0433\\u043E\\u0432\\u043E\\u0440\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=\\u041E\\u0442\\u0433\\u043E\\u0432\\u043E\\u0440\\u0435\\u043D \\u0441\\u043B\\u0443\\u0436\\u0438\\u0442\\u0435\\u043B\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=OK\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=\\u041E\\u0442\\u043A\\u0430\\u0437\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\r\nLBL_OVERALL_TARGET=\\u041E\\u0431\\u0449\\u0430 \\u0446\\u0435\\u043B\r\n\r\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\r\nBTN_SELECT_SALESPIPELINE=Pipeline \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\\u0431\\u0438 \\u043D\\u0430 \\u0435\\u043A\\u0438\\u043F\r\n\r\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\r\nBTN_SELECT_TOP10OPPORTUNITIES=\\u0412\\u043E\\u0434\\u0435\\u0449\\u0438\\u0442\\u0435 10 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438\r\n\r\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\r\nBTN_SELECT_BARCHART=\\u0426\\u0435\\u043B \\u043F\\u043E \\u0435\\u043A\\u0438\\u043F\r\n\r\n#XMSG: This is the Label to Show Employee Name.\r\nEMP_NAME=\\u0418\\u043C\\u0435 \\u043D\\u0430 \\u0441\\u043B\\u0443\\u0436\\u0438\\u0442\\u0435\\u043B\r\n\r\n#XFLD: This is the Employee Id\r\nEMP_ID=\\u0418\\u0414 \\u043D\\u0430 \\u0441\\u043B\\u0443\\u0436\\u0438\\u0442\\u0435\\u043B\r\n\r\n#XMSG: This is the Label to Show Account Name.\r\nACC_NAME=\\u0418\\u043C\\u0435 \\u043D\\u0430 \\u0441\\u043B\\u0443\\u0436\\u0438\\u0442\\u0435\\u043B\r\n\r\n#XFLD: This is the Account Id\r\nACC_ID=\\u0418\\u0414 \\u043D\\u0430 \\u0430\\u043A\\u0430\\u0443\\u043D\\u0442\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=\\u0413\\u0440\\u0435\\u0448\\u043A\\u0430\r\n\r\n#XFLD: This is the Employee Responsible\r\nEMPLOYEE_RESPONSIBLE=\\u041E\\u0442\\u0433\\u043E\\u0432\\u043E\\u0440\\u0435\\u043D \\u0441\\u043B\\u0443\\u0436\\u0438\\u0442\\u0435\\u043B\r\n\r\n#XFLD: This is the Accounts .\r\nACCOUNTS=\\u0410\\u043A\\u0430\\u0443\\u043D\\u0442\\u0438\r\n\r\n#XFLD: This is the sales organizations .\r\nLBL_ORG=\\u0422\\u044A\\u0440\\u0433\\u043E\\u0432\\u0441\\u043A\\u0438 \\u043E\\u0440\\u0433\\u0430\\u043D\\u0438\\u0437\\u0430\\u0446\\u0438\\u0438\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=\\u0412\\u043E\\u0434\\u0435\\u0449\\u0438 {0} \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=\\u0412\\u0441\\u0438\\u0447\\u043A\\u0438 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=\\u041D\\u044F\\u043C\\u0430 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=\\u0418\\u0437\\u043A\\u043B\\u044E\\u0447\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0438\\u0437\\u0433\\u0443\\u0431\\u0435\\u043D\\u0438\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=\\u0418\\u0437\\u043A\\u043B\\u044E\\u0447\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0441\\u043F\\u0435\\u0447\\u0435\\u043B\\u0435\\u043D\\u0438\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=\\u041F\\u043E\\u043A\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435 \\u043F\\u043E \\u0440\\u0430\\u0437\\u043C\\u0435\\u0440\r\n\r\n#XFLD: This is the label indicating the y axis label for target by team.\r\nLBL_REVENUE=\\u041F\\u0440\\u0438\\u0445\\u043E\\u0434\r\n\r\n#XFLD: This is the label indicating the target for target by team chart.\r\nLBL_TARGET=\\u0426\\u0435\\u043B\r\n\r\n#XFLD: This is the label indicating the Expected for target by team chart.\r\nLBL_EXPECTED=\\u041E\\u0447\\u0430\\u043A\\u0432\\u0430\\u043D\\u0438\r\n\r\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\r\nLBL_SALESSTAGE=\\u0415\\u0442\\u0430\\u043F \\u043D\\u0430 \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\\u0431\\u0438\r\n\r\n#XFLD: This is the label indicating the organization name for those opportunities who are not maintaining organization.\r\nLBL_OTHERS=\\u0414\\u0440\\u0443\\u0433\\u0438\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Opportunity related to organization.\r\nBTN_VIEW_DETAILS=\\u041F\\u043E\\u043A\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438\r\n\r\n#XFLD: This is the label indicating the bar chart\'s measure with respect to a currency (parameter)\r\nLBL_REVENUE_BAR_CHART=\\u041F\\u0440\\u0438\\u0445\\u043E\\u0434 ({0})\r\n',
	"cus/crm/ppm/mgr/i18n/i18n_cs.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Sledovat pipeline prodeje\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=z\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Dosa\\u017Een\\u00ED c\\u00EDle\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Odhl\\u00E1sit se\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Nastaven\\u00ED\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=\\u010Cinnosti\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Nastaven\\u00ED spr\\u00E1vy\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=C\\u00EDl prodeje\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=P\\u0159\\u00EDle\\u017Eitost\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Zav\\u0159\\u00EDt\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Spr\\u00E1va nastaven\\u00ED c\\u00EDle prodeje\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Periodicita c\\u00EDle prodeje\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=C\\u00EDl prodeje pro aktu\\u00E1ln\\u00ED obdob\\u00ED\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=M\\u011Bna\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=\\u010Casov\\u00FD interval\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=Od\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=Do\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Ulo\\u017Eit\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Zru\\u0161it\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Spr\\u00E1va nastaven\\u00ED p\\u0159\\u00EDle\\u017Eitost\\u00ED\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Hodnota kroku\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Nastavit hodnoty manu\\u00E1ln\\u011B\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Minim\\u00E1ln\\u00ED hodnota p\\u0159\\u00EDle\\u017Eitosti\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Maxim\\u00E1ln\\u00ED hodnota p\\u0159\\u00EDle\\u017Eitosti\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Ulo\\u017Eit\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Reset\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Export pro Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Sd\\u00EDlet\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=Zobrazit protokol zm\\u011Bn\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=V\\u0161echny neulo\\u017Een\\u00E9 zm\\u011Bny budou ztraceny. Opravdu chcete pokra\\u010Dovat?\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=Zm\\u011Bny ulo\\u017Eeny\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=Aktualizace se nezda\\u0159ila\r\n\r\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\r\nBTN_RF_CANCEL=Zru\\u0161it\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=Zobrazit protokol zm\\u011Bn\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Zm\\u011Bny\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Nov\\u00E1 hodnota\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Star\\u00E1 hodnota\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Zam\\u00EDtnout\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Zav\\u0159\\u00EDt\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\r\nBTN_TBT_CLOSE=Zav\\u0159\\u00EDt\r\n\r\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=P\\u0159\\u00EDle\\u017Eitost\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Datum zah\\u00E1jen\\u00ED\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Koncov\\u00E9 datum\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=O\\u010Dek\\u00E1van\\u00FD objem prodeje\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Nev\\u00E1\\u017Een\\u00E9\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=V\\u00E1\\u017Een\\u00E9\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Relevantn\\u00ED pro progn\\u00F3zu\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=\\u0160ance \\u00FAsp\\u011Bchu (v %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=F\\u00E1ze prodeje\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Stav\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Z\\u00E1kazn\\u00EDk\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Hlavn\\u00ED kontakt\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Odpov\\u011Bdn\\u00FD zam\\u011Bstnanec\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=OK\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Zru\\u0161it\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\r\nLBL_OVERALL_TARGET=Celkov\\u00FD c\\u00EDl\r\n\r\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\r\nBTN_SELECT_SALESPIPELINE=Pipeline prodeje t\\u00FDmu\r\n\r\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\r\nBTN_SELECT_TOP10OPPORTUNITIES=10 prvn\\u00EDch p\\u0159\\u00EDle\\u017Eitost\\u00ED\r\n\r\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\r\nBTN_SELECT_BARCHART=C\\u00EDl podle t\\u00FDmu\r\n\r\n#XMSG: This is the Label to Show Employee Name.\r\nEMP_NAME=Jm\\u00E9no zam\\u011Bstnance\r\n\r\n#XFLD: This is the Employee Id\r\nEMP_ID=ID zam\\u011Bstnance\r\n\r\n#XMSG: This is the Label to Show Account Name.\r\nACC_NAME=N\\u00E1zev \\u00FA\\u010Dtu\r\n\r\n#XFLD: This is the Account Id\r\nACC_ID=ID \\u00FA\\u010Dtu\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Chyba\r\n\r\n#XFLD: This is the Employee Responsible\r\nEMPLOYEE_RESPONSIBLE=Odpov\\u011Bdn\\u00ED zam\\u011Bstnanci\r\n\r\n#XFLD: This is the Accounts .\r\nACCOUNTS=Z\\u00E1kazn\\u00EDci\r\n\r\n#XFLD: This is the sales organizations .\r\nLBL_ORG=Prodejn\\u00ED organizace\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Prvn\\u00EDch {0} p\\u0159\\u00EDle\\u017Eitost\\u00ED\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=V\\u0161echny p\\u0159\\u00EDle\\u017Eitosti\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=Nen\\u00ED k dispozici \\u017E\\u00E1dn\\u00E1 p\\u0159\\u00EDle\\u017Eitost\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Vylou\\u010Dit ztracen\\u00E9\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Vylou\\u010Dit z\\u00EDskan\\u00E9\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Zobrazit podle velikosti\r\n\r\n#XFLD: This is the label indicating the y axis label for target by team.\r\nLBL_REVENUE=V\\u00FDnos\r\n\r\n#XFLD: This is the label indicating the target for target by team chart.\r\nLBL_TARGET=C\\u00EDl\r\n\r\n#XFLD: This is the label indicating the Expected for target by team chart.\r\nLBL_EXPECTED=O\\u010Dek\\u00E1v\\u00E1no\r\n\r\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\r\nLBL_SALESSTAGE=F\\u00E1ze prodeje\r\n\r\n#XFLD: This is the label indicating the organization name for those opportunities who are not maintaining organization.\r\nLBL_OTHERS=Jin\\u00E1\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Opportunity related to organization.\r\nBTN_VIEW_DETAILS=Zobrazen\\u00ED detail\\u016F\r\n\r\n#XFLD: This is the label indicating the bar chart\'s measure with respect to a currency (parameter)\r\nLBL_REVENUE_BAR_CHART=V\\u00FDnos ({0})\r\n',
	"cus/crm/ppm/mgr/i18n/i18n_de.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Sales Pipeline nachverfolgen\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=von\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Zielerreichung\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Abmelden\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Einstellungen\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=Aktionen\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Einstellungen verwalten\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Verkaufsziel\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Opportunity\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Schlie\\u00DFen\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Verkaufszieleinstellungen verwalten\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Verkaufszielperiodizit\\u00E4t\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Verkaufsziel im aktuellen Zeitraum\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=W\\u00E4hrung\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=Zeitraum\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=Von\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=Bis\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Sichern\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Abbrechen\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Opportunity-Einstellungen verwalten\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Schrittwert\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Werte manuell eingeben\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Minimalwert der Opportunity\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Maximalwert der Opportunity\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Sichern\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Zur\\u00FCcksetzen\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=In Excel exportieren\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Teilen\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=\\u00C4nderungsprotokoll anzeigen\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Ungesicherte \\u00C4nderungen gehen verloren. M\\u00F6chten Sie wirklich fortfahren?\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=\\u00C4nderungen wurden gesichert\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=Update fehlgeschlagen\r\n\r\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\r\nBTN_RF_CANCEL=Abbrechen\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=\\u00C4nderungsprotokoll anzeigen\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=\\u00C4nderungen\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Neuer Wert\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Alter Wert\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Verwerfen\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Schlie\\u00DFen\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\r\nBTN_TBT_CLOSE=Schlie\\u00DFen\r\n\r\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Opportunity\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Startdatum\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Enddatum\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=Erwarteter Umsatz\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Ungewichtet\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=Gewichtet\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Prognoserelevant\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Erfolgschance (in %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=Verkaufsphase\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Status\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Account\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Hauptansprechpartner\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Zust\\u00E4ndiger Mitarbeiter\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=OK\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Abbrechen\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\r\nLBL_OVERALL_TARGET=Gesamtziel\r\n\r\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\r\nBTN_SELECT_SALESPIPELINE=Sales Pipeline des Teams\r\n\r\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\r\nBTN_SELECT_TOP10OPPORTUNITIES=Top-10-Opportunitys\r\n\r\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\r\nBTN_SELECT_BARCHART=Ziel nach Team\r\n\r\n#XMSG: This is the Label to Show Employee Name.\r\nEMP_NAME=Mitarbeitername\r\n\r\n#XFLD: This is the Employee Id\r\nEMP_ID=Mitarbeiter-ID\r\n\r\n#XMSG: This is the Label to Show Account Name.\r\nACC_NAME=Account-Name\r\n\r\n#XFLD: This is the Account Id\r\nACC_ID=Account-ID\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Fehler\r\n\r\n#XFLD: This is the Employee Responsible\r\nEMPLOYEE_RESPONSIBLE=Zust\\u00E4ndige Mitarbeiter\r\n\r\n#XFLD: This is the Accounts .\r\nACCOUNTS=Accounts\r\n\r\n#XFLD: This is the sales organizations .\r\nLBL_ORG=Verkaufsorganisationen\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Top-{0}-Opportunitys\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=Alle Opportunitys\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=Keine Opportunity verf\\u00FCgbar\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Verlust ausschlie\\u00DFen\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Gewinn ausschlie\\u00DFen\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Nach Gr\\u00F6\\u00DFe anzeigen\r\n\r\n#XFLD: This is the label indicating the y axis label for target by team.\r\nLBL_REVENUE=Umsatz\r\n\r\n#XFLD: This is the label indicating the target for target by team chart.\r\nLBL_TARGET=Ziel\r\n\r\n#XFLD: This is the label indicating the Expected for target by team chart.\r\nLBL_EXPECTED=Erwartet\r\n\r\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\r\nLBL_SALESSTAGE=Verkaufsphase\r\n\r\n#XFLD: This is the label indicating the organization name for those opportunities who are not maintaining organization.\r\nLBL_OTHERS=Sonstige\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Opportunity related to organization.\r\nBTN_VIEW_DETAILS=Details anzeigen\r\n\r\n#XFLD: This is the label indicating the bar chart\'s measure with respect to a currency (parameter)\r\nLBL_REVENUE_BAR_CHART=Umsatz ({0})\r\n',
	"cus/crm/ppm/mgr/i18n/i18n_en.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Track Sales Pipeline\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=of\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Target Achievement\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Log Out\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Settings\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=Actions\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Manage Settings\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Sales Target\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Opportunity\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Close\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Manage Sales Target Settings\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Sales Target Periodicity\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Sales Target for Current Period\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Currency\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=Time Span\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=From\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=To\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Save\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Cancel\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Manage Opportunity Settings\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Step Value\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Set Values Manually\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Minimum Opportunity Value\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Maximum Opportunity Value\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Save\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Reset\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Export to Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Share\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=View Change Log\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Any unsaved changes will be lost. Are you sure you want to continue?\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=Changes saved\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=Update failed\r\n\r\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\r\nBTN_RF_CANCEL=Cancel\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=View Change Log\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Changes\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=New Value\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Old Value\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Discard\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Close\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\r\nBTN_TBT_CLOSE=Close\r\n\r\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Opportunity\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Start Date\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=End Date\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=Expected Sales Volume\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Unweighted\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=Weighted\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Relevant for Forecast\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Chance of Success (in %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=Sales Stage\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Status\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Account\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Main Contact\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Employee Responsible\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=OK\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Cancel\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\r\nLBL_OVERALL_TARGET=Overall Target\r\n\r\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\r\nBTN_SELECT_SALESPIPELINE=Team\'s Sales Pipeline\r\n\r\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\r\nBTN_SELECT_TOP10OPPORTUNITIES=Top 10 Opportunities\r\n\r\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\r\nBTN_SELECT_BARCHART=Target By Team\r\n\r\n#XMSG: This is the Label to Show Employee Name.\r\nEMP_NAME=Employee Name\r\n\r\n#XFLD: This is the Employee Id\r\nEMP_ID=Employee ID\r\n\r\n#XMSG: This is the Label to Show Account Name.\r\nACC_NAME=Account Name\r\n\r\n#XFLD: This is the Account Id\r\nACC_ID=Account ID\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Error\r\n\r\n#XFLD: This is the Employee Responsible\r\nEMPLOYEE_RESPONSIBLE=Employees Responsible\r\n\r\n#XFLD: This is the Accounts .\r\nACCOUNTS=Accounts\r\n\r\n#XFLD: This is the sales organizations .\r\nLBL_ORG=Sales Organizations\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Top {0} Opportunities\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=All Opportunities\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=No Opportunity Available\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Exclude Lost\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Exclude Won\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Display By Size\r\n\r\n#XFLD: This is the label indicating the y axis label for target by team.\r\nLBL_REVENUE=Revenue\r\n\r\n#XFLD: This is the label indicating the target for target by team chart.\r\nLBL_TARGET=Target\r\n\r\n#XFLD: This is the label indicating the Expected for target by team chart.\r\nLBL_EXPECTED=Expected\r\n\r\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\r\nLBL_SALESSTAGE=Sales Stage\r\n\r\n#XFLD: This is the label indicating the organization name for those opportunities who are not maintaining organization.\r\nLBL_OTHERS=Others\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Opportunity related to organization.\r\nBTN_VIEW_DETAILS=View Details\r\n\r\n#XFLD: This is the label indicating the bar chart\'s measure with respect to a currency (parameter)\r\nLBL_REVENUE_BAR_CHART=Revenue ({0})\r\n',
	"cus/crm/ppm/mgr/i18n/i18n_en_US_sappsd.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=[[[\\u0162\\u0157\\u0105\\u010B\\u0137 \\u015C\\u0105\\u013A\\u0113\\u015F \\u01A4\\u012F\\u03C1\\u0113\\u013A\\u012F\\u014B\\u0113]]]\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=[[[\\u014F\\u0192]]]\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=[[[\\u0162\\u0105\\u0157\\u011F\\u0113\\u0163 \\u0100\\u010B\\u0125\\u012F\\u0113\\u028B\\u0113\\u0271\\u0113\\u014B\\u0163]]]\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=[[[\\u013B\\u014F\\u011F \\u014E\\u0171\\u0163]]]\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=[[[\\u0100\\u03C1\\u03C1 \\u015C\\u0113\\u0163\\u0163\\u012F\\u014B\\u011F\\u015F]]]\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=[[[\\u0100\\u010B\\u0163\\u012F\\u014F\\u014B\\u015F]]]\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=[[[\\u0100\\u03C1\\u03C1 \\u015C\\u0113\\u0163\\u0163\\u012F\\u014B\\u011F\\u015F]]]\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=[[[\\u015C\\u0105\\u013A\\u0113\\u015F \\u0162\\u0105\\u0157\\u011F\\u0113\\u0163]]]\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=[[[\\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u0177]]]\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=[[[\\u0108\\u013A\\u014F\\u015F\\u0113]]]\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=[[[\\u015C\\u0105\\u013A\\u0113\\u015F \\u0162\\u0105\\u0157\\u011F\\u0113\\u0163 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F]]]\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=[[[\\u015C\\u0105\\u013A\\u0113\\u015F \\u0162\\u0105\\u0157\\u011F\\u0113\\u0163 \\u01A4\\u0113\\u0157\\u012F\\u014F\\u018C\\u012F\\u010B\\u012F\\u0163\\u0177]]]\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=[[[\\u015C\\u0105\\u013A\\u0113\\u015F \\u0162\\u0105\\u0157\\u011F\\u0113\\u0163 \\u0192\\u014F\\u0157 \\u0108\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163 \\u01A4\\u0113\\u0157\\u012F\\u014F\\u018C]]]\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=[[[\\u0108\\u0171\\u0157\\u0157\\u0113\\u014B\\u010B\\u0177]]]\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=[[[\\u0162\\u012F\\u0271\\u0113 \\u015C\\u03C1\\u0105\\u014B]]]\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=[[[\\u0191\\u0157\\u014F\\u0271]]]\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=[[[\\u0162\\u014F]]]\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=[[[\\u015C\\u0105\\u028B\\u0113]]]\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A]]]\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=[[[\\u01B2\\u012F\\u0113\\u0175 \\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u0177 \\u015C\\u0113\\u0163\\u0163\\u012F\\u014B\\u011F\\u015F]]]\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=[[[\\u015C\\u0163\\u0113\\u03C1 \\u01B2\\u0105\\u013A\\u0171\\u0113]]]\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=[[[\\u015C\\u0113\\u0163 \\u01B2\\u0105\\u013A\\u0171\\u0113\\u015F \\u039C\\u0105\\u014B\\u0171\\u0105\\u013A\\u013A\\u0177]]]\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=[[[\\u039C\\u012F\\u014B\\u012F\\u0271\\u0171\\u0271 \\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u0177 \\u01B2\\u0105\\u013A\\u0171\\u0113]]]\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=[[[\\u039C\\u0105\\u03C7\\u012F\\u0271\\u0171\\u0271 \\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u0177 \\u01B2\\u0105\\u013A\\u0171\\u0113]]]\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=[[[\\u015C\\u0105\\u028B\\u0113]]]\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=[[[\\u0158\\u0113\\u015F\\u0113\\u0163]]]\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=[[[\\u0114\\u03C7\\u03C1\\u014F\\u0157\\u0163 \\u0163\\u014F \\u0114\\u03C7\\u010B\\u0113\\u013A]]]\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=[[[\\u015C\\u0125\\u0105\\u0157\\u0113]]]\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=[[[\\u01B2\\u012F\\u0113\\u0175 \\u0108\\u0125\\u0105\\u014B\\u011F\\u0113 \\u013B\\u014F\\u011F]]]\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=[[[\\u0100\\u014B\\u0177 \\u0171\\u014B\\u015F\\u0105\\u028B\\u0113\\u018C \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F \\u0175\\u012F\\u013A\\u013A \\u0183\\u0113 \\u013A\\u014F\\u015F\\u0163. \\u010E\\u014F \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u010B\\u014F\\u014B\\u0163\\u012F\\u014B\\u0171\\u0113?]]]\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=[[[\\u016E\\u03C1\\u018C\\u0105\\u0163\\u0113 \\u015C\\u0171\\u010B\\u010B\\u0113\\u015F\\u015F\\u0192\\u0171\\u013A]]]\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=[[[\\u016E\\u03C1\\u018C\\u0105\\u0163\\u0113 \\u0191\\u0105\\u012F\\u013A\\u0113\\u018C]]]\r\n\r\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\r\nBTN_RF_OK=[[[\\u014E\\u0136]]]\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\r\nBTN_RF_CANCEL=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A]]]\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=[[[\\u01B2\\u012F\\u0113\\u0175 \\u0108\\u0125\\u0105\\u014B\\u011F\\u0113 \\u013B\\u014F\\u011F]]]\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F]]]\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=[[[\\u0143\\u0113\\u0175 \\u01B2\\u0105\\u013A\\u0171\\u0113]]]\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=[[[\\u014E\\u013A\\u018C \\u01B2\\u0105\\u013A\\u0171\\u0113]]]\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=[[[\\u010E\\u012F\\u015F\\u010B\\u0105\\u0157\\u018C]]]\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=[[[\\u0108\\u013A\\u014F\\u015F\\u0113]]]\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\r\nBTN_TBT_CLOSE=[[[\\u0108\\u013A\\u014F\\u015F\\u0113]]]\r\n\r\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=[[[\\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F]]]\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=[[[\\u015C\\u0163\\u0105\\u0157\\u0163 \\u010E\\u0105\\u0163\\u0113]]]\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=[[[\\u0114\\u014B\\u018C \\u010E\\u0105\\u0163\\u0113]]]\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=[[[\\u0114\\u03C7\\u03C1\\u0113\\u010B\\u0163\\u0113\\u018C \\u015C\\u0105\\u013A\\u0113\\u015F \\u01B2\\u014F\\u013A\\u0171\\u0271\\u0113]]]\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=[[[\\u016E\\u014B\\u0175\\u0113\\u012F\\u011F\\u0125\\u0163\\u0113\\u018C]]]\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=[[[\\u0174\\u0113\\u012F\\u011F\\u0125\\u0163\\u0113\\u018C]]]\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=[[[\\u0158\\u0113\\u013A\\u0113\\u028B\\u0105\\u014B\\u0163 \\u0192\\u014F\\u0157 \\u0191\\u014F\\u0157\\u0113\\u010B\\u0105\\u015F\\u0163]]]\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=[[[\\u0108\\u0125\\u0105\\u014B\\u010B\\u0113 \\u014F\\u0192 \\u015C\\u0171\\u010B\\u010B\\u0113\\u015F\\u015F (\\u012F\\u014B %)]]]\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=[[[\\u015C\\u0105\\u013A\\u0113\\u015F \\u015C\\u0163\\u0105\\u011F\\u0113]]]\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=[[[\\u015C\\u0163\\u0105\\u0163\\u0171\\u015F]]]\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=[[[\\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163]]]\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=[[[\\u039C\\u0105\\u012F\\u014B \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163]]]\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=[[[\\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113 \\u0158\\u0113\\u015F\\u03C1\\u014F\\u014B\\u015F\\u012F\\u0183\\u013A\\u0113]]]\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=[[[\\u014E\\u0136]]]\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A]]]\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\r\nLBL_OVERALL_TARGET=[[[\\u014E\\u028B\\u0113\\u0157\\u0105\\u013A\\u013A \\u0162\\u0105\\u0157\\u011F\\u0113\\u0163]]]\r\n\r\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\r\nBTN_SELECT_SALESPIPELINE=[[[\\u0162\\u0113\\u0105\\u0271\'\\u015F \\u015C\\u0105\\u013A\\u0113\\u015F \\u01A4\\u012F\\u03C1\\u0113\\u013A\\u012F\\u014B\\u0113]]]\r\n\r\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\r\nBTN_SELECT_TOP10OPPORTUNITIES=[[[\\u0162\\u014F\\u03C1 10 \\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u012F\\u0113\\u015F]]]\r\n\r\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\r\nBTN_SELECT_BARCHART=[[[\\u0162\\u0105\\u0157\\u011F\\u0113\\u0163 \\u0181\\u0177 \\u0162\\u0113\\u0105\\u0271]]]\r\n\r\n#XMSG: This is the Label to Show Employee Name.\r\nEMP_NAME=[[[\\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113 \\u0143\\u0105\\u0271\\u0113]]]\r\n\r\n#XFLD: This is the Employee Id\r\nEMP_ID=[[[\\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113 \\u012C\\u010E]]]\r\n\r\n#XMSG: This is the Label to Show Account Name.\r\nACC_NAME=[[[\\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163 \\u0143\\u0105\\u0271\\u0113]]]\r\n\r\n#XFLD: This is the Account Id\r\nACC_ID=[[[\\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163 \\u012C\\u010E]]]\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=[[[\\u0114\\u0157\\u0157\\u014F\\u0157]]]\r\n\r\n#XFLD: This is the Employee Responsible\r\nEMPLOYEE_RESPONSIBLE=[[[\\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113 \\u0158\\u0113\\u015F\\u03C1\\u014F\\u014B\\u015F\\u012F\\u0183\\u013A\\u0113]]]\r\n\r\n#XFLD: This is the Accounts .\r\nACCOUNTS=[[[\\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163\\u015F]]]\r\n\r\n#XFLD: This is the sales organizations .\r\nLBL_ORG=[[[\\u015C\\u0105\\u013A\\u0113\\u015F \\u014E\\u0157\\u011F\\u0105\\u014B\\u012F\\u017E\\u0105\\u0163\\u012F\\u014F\\u014B\\u015F]]]\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=[[[\\u0162\\u014F\\u03C1 {0} \\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u012F\\u0113\\u015F]]]\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=[[[\\u0100\\u013A\\u013A \\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u012F\\u0113\\u015F]]]\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=[[[\\u0143\\u014F \\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u0177]]]\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=[[[\\u0114\\u03C7\\u010B\\u013A\\u0171\\u018C\\u0113 \\u013B\\u014F\\u015F\\u0163]]]\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=[[[\\u0114\\u03C7\\u010B\\u013A\\u0171\\u018C\\u0113 \\u0174\\u014F\\u014B]]]\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=[[[\\u010E\\u012F\\u015F\\u03C1\\u013A\\u0105\\u0177 \\u0181\\u0177 \\u015C\\u012F\\u017E\\u0113]]]\r\n\r\n#XFLD: This is the label indicating the y axis label for target by team.\r\nLBL_REVENUE=[[[\\u0158\\u0113\\u028B\\u0113\\u014B\\u0171\\u0113]]]\r\n\r\n#XFLD: This is the label indicating the target for target by team chart.\r\nLBL_TARGET=[[[\\u0162\\u0105\\u0157\\u011F\\u0113\\u0163]]]\r\n\r\n#XFLD: This is the label indicating the Expected for target by team chart.\r\nLBL_EXPECTED=[[[\\u0114\\u03C7\\u03C1\\u0113\\u010B\\u0163\\u0113\\u018C]]]\r\n\r\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\r\nLBL_SALESSTAGE=[[[\\u015C\\u0105\\u013A\\u0113\\u015F \\u015C\\u0163\\u0105\\u011F\\u0113]]]\r\n\r\n#XFLD: This is the label indicating the organization name for those opportunities who are not maintaining organization.\r\nLBL_OTHERS=[[[\\u014E\\u0163\\u0125\\u0113\\u0157\\u015F]]]\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Opportunity related to organization.\r\nBTN_VIEW_DETAILS=[[[\\u01B2\\u012F\\u0113\\u0175 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F]]]\r\n\r\n#XFLD: This is the label indicating the bar chart\'s measure with respect to a currency (parameter)\r\nLBL_REVENUE_BAR_CHART=[[[\\u0158\\u0113\\u028B\\u0113\\u014B\\u0171\\u0113 ({0})]]]\r\n',
	"cus/crm/ppm/mgr/i18n/i18n_en_US_saptrc.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=KCK8hjmqWE+dkGC7ghCklQ_Track Sales Pipeline\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=4nPvuinhgFMtCgBPrC0hpg_of\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=SSiFoYwpTaItnYGh5ccnFQ_Target Achievement\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=ZXQEna6bt8BDahiBpcFJ4g_Log Out\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=vm/aJ80TxnypBlEJRm2/XQ_App Settings\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=KtR/FVqkh4mmR33o9ZHP8w_Actions\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=QEjW3ZDu3NRJsFkkU+Zvvw_App Settings\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=7p6CY8HOCNHGQqPdyPqneg_Sales Target\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=7sjZTNgCU4QtATfsuiWtTg_Opportunity\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=gSnRIjE11oLhCE0rR8o+vQ_Close\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=tgsaB7G7GvmYvmUmcWr4vg_Sales Target Details\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=wGimI3PAfsIC9d+oVyCU/w_Sales Target Periodicity\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=w13ZZkPvaNNPSZhhsR82Ng_Sales Target for Current Period\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=8R+hbJO8fKqoghSsHlKxOQ_Currency\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=DzyKLDBaXi94RoR0kCSMfA_Time Span\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=7cnRpcd09eIfibrkwmJREQ_From\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=Vur8q9zjm6h+DTBWhv3enw_To\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=KuMBgA9d1WnM6Lo3Rb2o3w_Save\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=RU9j7IFcBfAuryj652Y9jA_Cancel\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=xiyaXQeTsF21Fl162jJmbg_View Opportunity Settings\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=fhVnZhC7d70TeT2OMhyt5A_Step Value\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Zp6TFDP99Kj7KTPYsRKKcA_Set Values Manually\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=5FNN41o5AFsKq3TEHH9Y6g_Minimum Opportunity Value\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=rBdKj1DbDlFbnUhbSKCEmg_Maximum Opportunity Value\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=YOXBBpwfbstDkNG8UzXk4Q_Save\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=2jJ5qfp+VDZoPhS8cN3bvw_Reset\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=fJIX2SFQdBdOrQcz2VV88A_Export to Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=rek3AvVuBWSoMRK16sce+g_Share\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=nl0IXt1GnkeyUxhvHblDdw_View Change Log\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=00lwSt6oDmZ4Ue6+OyWAZA_Any unsaved changes will be lost. Do you want to continue?\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=LAjbxBCdRsNWUBYQYT8EJw_Update Successful\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=xf6cug8FBP+JzLuGVnmNKA_Update Failed\r\n\r\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\r\nBTN_RF_OK=l4Fox+d/bWZ0cPXr+MNHPQ_OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\r\nBTN_RF_CANCEL=A0byrELmpKCRARP3AE64KQ_Cancel\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=Ik7wHe7J03GqDYFvWlJHgA_View Change Log\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=KCfjL5dGxybhzbScmAqLVw_Changes\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=SUSahLVCA2SEmYk/nhdQpw_New Value\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=kZLSI5jeeaVDryw4jsnB0Q_Old Value\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=BANsP1N80mBJPMqdW0N8EQ_Discard\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=QN9tCUZNL+36UI4pVs98zw_Close\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\r\nBTN_TBT_CLOSE=l5QQMV8mpeuiEgAyRJPr+A_Close\r\n\r\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Vtj0I+HsyKTjBBOMaJYOoQ_Details\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=iN83EoOdwDHgYeuFWFy0MQ_Start Date\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=RQ33/cAZF9VS3zoiPCAD+g_End Date\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=6QwFfFazVDzimk4A2FYTkA_Expected Sales Volume\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=MZzF7LgUuxnHK1xHRUTmVQ_Unweighted\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=ECuea04QRzHeXAwEu1bQ8g_Weighted\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=mrsqIiZlhPuNDJuCKYevVQ_Relevant for Forecast\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=eEryjzpyTGHmfkIFJBmUsA_Chance of Success (in %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=J1wpI9+12IPLM6SwN1+imw_Sales Stage\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=13x7Azn6N3WUcVlmAUAogQ_Status\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=1ItDlj2PVQcvyhzbme8Hnw_Account\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=rNTOyddVpSkRpw8wFFw2GQ_Main Contact\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=R82yaSOZxva8ca/mPwJ0Fw_Employee Responsible\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=ZYpjM/gkeHUNcHIxzItm9Q_OK\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=yfbYwnkmuvSTwM2igSIKHA_Cancel\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\r\nLBL_OVERALL_TARGET=kayhX16KTZEqXAcO7yU3+w_Overall Target\r\n\r\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\r\nBTN_SELECT_SALESPIPELINE=/1l2JOePZSn7MHY+wOk0HA_Team\'s Sales Pipeline\r\n\r\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\r\nBTN_SELECT_TOP10OPPORTUNITIES=DGiyWaOb+IzNz0QGvBPqmQ_Top 10 Opportunities\r\n\r\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\r\nBTN_SELECT_BARCHART=9TD+08gPpqTQpJ+5zfQOwg_Target By Team\r\n\r\n#XMSG: This is the Label to Show Employee Name.\r\nEMP_NAME=Xxin0JcBqXuhf3uyM/rVvw_Employee Name\r\n\r\n#XFLD: This is the Employee Id\r\nEMP_ID=C2FfkrcKtqOInjuoSIXqQA_Employee ID\r\n\r\n#XMSG: This is the Label to Show Account Name.\r\nACC_NAME=05R2b1qtgAR4+YH8t+lFvA_Account Name\r\n\r\n#XFLD: This is the Account Id\r\nACC_ID=SYdhEMqCqqLBnX3qwC31xw_Account ID\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=hnnJJeER0yqeCHzWFCEaZw_Error\r\n\r\n#XFLD: This is the Employee Responsible\r\nEMPLOYEE_RESPONSIBLE=eqkWNZxoxLDm5E+8wz6c4A_Employee Responsible\r\n\r\n#XFLD: This is the Accounts .\r\nACCOUNTS=PS0yCu+niUx2Fdw/hBIwNA_Accounts\r\n\r\n#XFLD: This is the sales organizations .\r\nLBL_ORG=Ow9VxwdC5Ym1lljAA3QvKg_Sales Organizations\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=pYtvJ4ZSam+GSLAKaXmGyA_Top {0} Opportunities\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=mmnODdEMOE0BebRUhGryzQ_All Opportunities\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=0dIlX1AeyBY8gZH0geGvhw_No Opportunity\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=/ui7YHIcJWEhmbkzmbn/8g_Exclude Lost\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=9ffbzmhfxDq5eBM+S6wIlQ_Exclude Won\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=QGarhO6tnfdslWXTo6R/7w_Display By Size\r\n\r\n#XFLD: This is the label indicating the y axis label for target by team.\r\nLBL_REVENUE=Fmys5aZI3rsI7tIxjTbKEw_Revenue\r\n\r\n#XFLD: This is the label indicating the target for target by team chart.\r\nLBL_TARGET=Q4OmnlEvGy6EB+eCZzXtXA_Target\r\n\r\n#XFLD: This is the label indicating the Expected for target by team chart.\r\nLBL_EXPECTED=z/2xXfSJMXS4belK2/BkTg_Expected\r\n\r\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\r\nLBL_SALESSTAGE=BkR0UCrmKl5/Ep20fhxdWw_Sales Stage\r\n\r\n#XFLD: This is the label indicating the organization name for those opportunities who are not maintaining organization.\r\nLBL_OTHERS=51/k/7hNOuVznfS206384Q_Others\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Opportunity related to organization.\r\nBTN_VIEW_DETAILS=FITwel2XaksbMXok8tgKPQ_View Details\r\n\r\n#XFLD: This is the label indicating the bar chart\'s measure with respect to a currency (parameter)\r\nLBL_REVENUE_BAR_CHART=2dpnrVVjB4PsvSMLRibKyg_Revenue ({0})\r\n',
	"cus/crm/ppm/mgr/i18n/i18n_es.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Supervisar pipeline de ventas\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=de\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Acierto de objetivo\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Finalizar sesi\\u00F3n\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Opciones\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=Acciones\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Gestionar opciones\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Objetivo de ventas\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Oportunidad\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Cerrar\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Gestionar opciones de objetivo de ventas\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Periodicidad del objetivo de ventas\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Objetivo de ventas del per\\u00EDodo actual\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Moneda\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=Intervalo de tiempo\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=De\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=Hasta\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Guardar\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Cancelar\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Gestionar opciones de oportunidad\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Valor del paso\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Fijar valores manualmente\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Valor m\\u00EDnimo de oportunidad\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Valor m\\u00E1ximo de oportunidad\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Guardar\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Reinicializar\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Exportar a Microsoft Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Compartir\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=Visualizar log de modificaciones\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Se perder\\u00E1n las modificaciones sin guardar. \\u00BFSeguro que desea continuar?\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=Las modificaciones guardadas\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=Error de actualizaci\\u00F3n\r\n\r\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\r\nBTN_RF_CANCEL=Cancelar\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=Visualizar log de modificaciones\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Modificaciones\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Valor nuevo\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Valor antiguo\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Rechazar\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Cerrar\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\r\nBTN_TBT_CLOSE=Cerrar\r\n\r\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Oportunidad\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Fecha de inicio\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Fecha de fin\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=Volumen de ventas esperado\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=No ponderado\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=Ponderado\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Relevante para la previsi\\u00F3n\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Posibilidad de \\u00E9xito (en %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=Fase de ventas\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Estado\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Cliente\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Contacto principal\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Empleado responsable\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=OK\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Cancelar\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\r\nLBL_OVERALL_TARGET=Objetivo global\r\n\r\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\r\nBTN_SELECT_SALESPIPELINE=Pipeline de ventas de equipo\r\n\r\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\r\nBTN_SELECT_TOP10OPPORTUNITIES=Principales 10 oportunidades\r\n\r\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\r\nBTN_SELECT_BARCHART=Objetivo por equipo\r\n\r\n#XMSG: This is the Label to Show Employee Name.\r\nEMP_NAME=Nombre de empleado\r\n\r\n#XFLD: This is the Employee Id\r\nEMP_ID=ID de empleado\r\n\r\n#XMSG: This is the Label to Show Account Name.\r\nACC_NAME=Nombre del cliente\r\n\r\n#XFLD: This is the Account Id\r\nACC_ID=ID de cliente\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Error\r\n\r\n#XFLD: This is the Employee Responsible\r\nEMPLOYEE_RESPONSIBLE=Empleados responsables\r\n\r\n#XFLD: This is the Accounts .\r\nACCOUNTS=Clientes\r\n\r\n#XFLD: This is the sales organizations .\r\nLBL_ORG=Organizaciones de ventas\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Las {0} oportunidades principales\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=Todas las oportunidades\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=No hay oportunidades disponibles\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Excluir las perdidas\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Excluir las ganadas\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Mostrar por tama\\u00F1o\r\n\r\n#XFLD: This is the label indicating the y axis label for target by team.\r\nLBL_REVENUE=Ingresos\r\n\r\n#XFLD: This is the label indicating the target for target by team chart.\r\nLBL_TARGET=Objetivo\r\n\r\n#XFLD: This is the label indicating the Expected for target by team chart.\r\nLBL_EXPECTED=Previsto\r\n\r\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\r\nLBL_SALESSTAGE=Fase de ventas\r\n\r\n#XFLD: This is the label indicating the organization name for those opportunities who are not maintaining organization.\r\nLBL_OTHERS=Otros\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Opportunity related to organization.\r\nBTN_VIEW_DETAILS=Visualizar detalles\r\n\r\n#XFLD: This is the label indicating the bar chart\'s measure with respect to a currency (parameter)\r\nLBL_REVENUE_BAR_CHART=Ingresos ({0})\r\n',
	"cus/crm/ppm/mgr/i18n/i18n_fr.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Suivi de la pipeline des ventes\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=/\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Atteinte des objectifs\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=D\\u00E9connexion\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Options\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=Actions\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=G\\u00E9rer options\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Objectif des ventes\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Opportunit\\u00E9\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Fermer\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=G\\u00E9rer options objectif des ventes\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Fr\\u00E9quence de l\'objectif des ventes\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Objectif des ventes pour la p\\u00E9riode actuelle\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Devise\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=P\\u00E9riode\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=du\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=au\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Sauvegarder\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Interrompre\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=G\\u00E9rer options d\'opportunit\\u00E9\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Valeur d\'\\u00E9tape\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=D\\u00E9finir valeurs manuellement\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Valeur minimale de l\'opportunit\\u00E9\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Valeur maximale de l\'opportunit\\u00E9\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Sauvegarder\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=R\\u00E9initialiser\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Export vers Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Partager\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=Afficher journal des modifications\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Toutes les modifications non sauvegard\\u00E9es seront perdues. Voulez-vous continuer ?\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=Modifications sauvegard\\u00E9es\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=Echec de la mise \\u00E0 jour\r\n\r\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\r\nBTN_RF_CANCEL=Interrompre\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=Afficher journal des modifications\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Modifications\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Nouvelle valeur\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Ancienne valeur\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Rejeter\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Fermer\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\r\nBTN_TBT_CLOSE=Fermer\r\n\r\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Opportunit\\u00E9\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Date de d\\u00E9but\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Date de fin\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=Volume d\'affaires escompt\\u00E9\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Non pond\\u00E9r\\u00E9\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=Pond\\u00E9r\\u00E9\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Pertinent pour les pr\\u00E9visions\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Chance de r\\u00E9ussite (en %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=\\u00C9tape de vente\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Statut\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Compte\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Contact principal\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Responsable\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=OK\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Interrompre\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\r\nLBL_OVERALL_TARGET=Objectif global\r\n\r\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\r\nBTN_SELECT_SALESPIPELINE=Pipeline des ventes de l\'\\u00E9quipe\r\n\r\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\r\nBTN_SELECT_TOP10OPPORTUNITIES=10 meilleures opportunit\\u00E9s\r\n\r\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\r\nBTN_SELECT_BARCHART=Objectif par \\u00E9quipe\r\n\r\n#XMSG: This is the Label to Show Employee Name.\r\nEMP_NAME=Nom du salari\\u00E9\r\n\r\n#XFLD: This is the Employee Id\r\nEMP_ID=ID du salari\\u00E9\r\n\r\n#XMSG: This is the Label to Show Account Name.\r\nACC_NAME=Intitul\\u00E9 de compte\r\n\r\n#XFLD: This is the Account Id\r\nACC_ID=ID de compte\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Erreur\r\n\r\n#XFLD: This is the Employee Responsible\r\nEMPLOYEE_RESPONSIBLE=Responsable\r\n\r\n#XFLD: This is the Accounts .\r\nACCOUNTS=Comptes\r\n\r\n#XFLD: This is the sales organizations .\r\nLBL_ORG=Organisations commerciales\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Les {0} meilleures opportunit\\u00E9s\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=Toutes les opportunit\\u00E9s\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=Aucune opportunit\\u00E9 disponible\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Exclure Perdues\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Exclure Gagn\\u00E9es\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Afficher par volume\r\n\r\n#XFLD: This is the label indicating the y axis label for target by team.\r\nLBL_REVENUE=Chiffre d\'affaires\r\n\r\n#XFLD: This is the label indicating the target for target by team chart.\r\nLBL_TARGET=Cible\r\n\r\n#XFLD: This is the label indicating the Expected for target by team chart.\r\nLBL_EXPECTED=Escompt\\u00E9\r\n\r\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\r\nLBL_SALESSTAGE=\\u00C9tape de vente\r\n\r\n#XFLD: This is the label indicating the organization name for those opportunities who are not maintaining organization.\r\nLBL_OTHERS=Autres\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Opportunity related to organization.\r\nBTN_VIEW_DETAILS=Afficher les d\\u00E9tails\r\n\r\n#XFLD: This is the label indicating the bar chart\'s measure with respect to a currency (parameter)\r\nLBL_REVENUE_BAR_CHART=Chiffre d\'\'affaires ({0})\r\n',
	"cus/crm/ppm/mgr/i18n/i18n_hr.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Prati pipeline prodaje\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=od\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Dostignu\\u0107e cilja\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Odjava\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Upravljaj postavama\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=Radnje\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Upravljaj postavama\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Cilj prodaje\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Prilika\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Zatvori\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Upravljaj postavama cilja prodaje\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Razdoblje cilja prodaje\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Cilj prodaje za teku\\u0107e razdoblje\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Valuta\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=Vremensko razdoblje\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=Od\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=Do\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Snimi\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Otka\\u017Ei\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Upravljaj postavama prilike\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Vrijednost koraka\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Ru\\u010Dno postavi vrijednosti\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Minimalna vrijednost prilike\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Maksimalna vrijednost prilike\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Snimi\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Ponovno postavi\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Eksportiraj u Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Otpusti\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=Prika\\u017Ei protokol promjene\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Nesnimljene promjene \\u0107e se izgubiti. \\u017Delite li zaista nastaviti?\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=A\\u017Euriranje uspje\\u0161no\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=A\\u017Euriranje nije uspjelo\r\n\r\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\r\nBTN_RF_OK=U redu\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\r\nBTN_RF_CANCEL=Otka\\u017Ei\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=Prika\\u017Ei protokol promjene\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Promjene\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Nova vrijednost\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Stara vrijednost\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Odbaci\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Zatvori\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\r\nBTN_TBT_CLOSE=Zatvori\r\n\r\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Prilika\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Po\\u010Detni datum\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Datum zavr\\u0161etka\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=O\\u010Dekivani promet\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Neponderirano\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=Ponderirano\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Relevantno za predvi\\u0111anje\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Vjerojatnost uspjeha (u %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=Faza prodaje\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Status\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Klijent\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Glavni kontakt\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Odgovorni zaposlenik\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=U redu\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Otka\\u017Ei\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\r\nLBL_OVERALL_TARGET=Ukupni cilj\r\n\r\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\r\nBTN_SELECT_SALESPIPELINE=Pipeline prodaje tima\r\n\r\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\r\nBTN_SELECT_TOP10OPPORTUNITIES=10 najboljih prilika\r\n\r\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\r\nBTN_SELECT_BARCHART=Cilj prema timu\r\n\r\n#XMSG: This is the Label to Show Employee Name.\r\nEMP_NAME=Ime zaposlenika\r\n\r\n#XFLD: This is the Employee Id\r\nEMP_ID=ID zaposlenika\r\n\r\n#XMSG: This is the Label to Show Account Name.\r\nACC_NAME=Naziv konta\r\n\r\n#XFLD: This is the Account Id\r\nACC_ID=ID konta\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Gre\\u0161ka\r\n\r\n#XFLD: This is the Employee Responsible\r\nEMPLOYEE_RESPONSIBLE=Odgovorni zaposlenik\r\n\r\n#XFLD: This is the Accounts .\r\nACCOUNTS=Konta\r\n\r\n#XFLD: This is the sales organizations .\r\nLBL_ORG=Prodajne organizacije\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Top {0} prilika\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=Sve prilike\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=Prilika nije raspolo\\u017Eiva\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Isklju\\u010Di izgubljeno\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Isklju\\u010Di dobiveno\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Prika\\u017Ei prema veli\\u010Dini\r\n\r\n#XFLD: This is the label indicating the y axis label for target by team.\r\nLBL_REVENUE=Promet\r\n\r\n#XFLD: This is the label indicating the target for target by team chart.\r\nLBL_TARGET=Cilj\r\n\r\n#XFLD: This is the label indicating the Expected for target by team chart.\r\nLBL_EXPECTED=O\\u010Dekivano\r\n\r\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\r\nLBL_SALESSTAGE=Faza prodaje\r\n\r\n#XFLD: This is the label indicating the organization name for those opportunities who are not maintaining organization.\r\nLBL_OTHERS=Ostali\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Opportunity related to organization.\r\nBTN_VIEW_DETAILS=Vidi detalje\r\n\r\n#XFLD: This is the label indicating the bar chart\'s measure with respect to a currency (parameter)\r\nLBL_REVENUE_BAR_CHART=Prihod ({0})\r\n',
	"cus/crm/ppm/mgr/i18n/i18n_hu.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Sales pipeline nyomon k\\u00F6vet\\u00E9se\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=-\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=C\\u00E9l el\\u00E9r\\u00E9se\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Kijelentkez\\u00E9s\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Be\\u00E1ll\\u00EDt\\u00E1sok\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=M\\u0171veletek\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Be\\u00E1ll\\u00EDt\\u00E1sok kezel\\u00E9se\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=\\u00C9rt\\u00E9kes\\u00EDt\\u00E9si c\\u00E9l\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Opportunity\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Bez\\u00E1r\\u00E1s\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=\\u00C9rt\\u00E9kes\\u00EDt\\u00E9si c\\u00E9l be\\u00E1ll\\u00EDt\\u00E1sainak kezel\\u00E9se\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=\\u00C9rt\\u00E9kes\\u00EDt\\u00E9si c\\u00E9l periodicit\\u00E1sa\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=\\u00C9rt\\u00E9kes\\u00EDt\\u00E9si c\\u00E9l az aktu\\u00E1lis peri\\u00F3dusban\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=P\\u00E9nznem\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=Id\\u0151intervallum\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=Kezd\\u00E9s\\:\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=A k\\u00F6vetkez\\u0151ig\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Ment\\u00E9s\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=M\\u00E9gse\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Opportunity-be\\u00E1ll\\u00EDt\\u00E1sok kezel\\u00E9se\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=L\\u00E9p\\u00E9s\\u00E9rt\\u00E9k\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=\\u00C9rt\\u00E9kek manu\\u00E1lis megad\\u00E1sa\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Opportunity minim\\u00E1lis \\u00E9rt\\u00E9ke\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Opportunity maxim\\u00E1lis \\u00E9rt\\u00E9ke\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Ment\\u00E9s\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Vissza\\u00E1ll\\u00EDt\\u00E1s\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Export\\u00E1l\\u00E1s Excelbe\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Megoszt\\u00E1s\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=M\\u00F3dos\\u00EDt\\u00E1snapl\\u00F3 megjelen\\u00EDt\\u00E9se\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Elv\\u00E9sz minden el nem mentett m\\u00F3dos\\u00EDt\\u00E1s. Val\\u00F3ban szeretn\\u00E9 folytatni?\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=M\\u00F3dos\\u00EDt\\u00E1sok elmentve\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=Aktualiz\\u00E1l\\u00E1s sikertelen\r\n\r\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\r\nBTN_RF_OK=Rendben\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\r\nBTN_RF_CANCEL=M\\u00E9gse\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=M\\u00F3dos\\u00EDt\\u00E1snapl\\u00F3 megjelen\\u00EDt\\u00E9se\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=M\\u00F3dos\\u00EDt\\u00E1sok\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=\\u00DAj \\u00E9rt\\u00E9k\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=R\\u00E9gi \\u00E9rt\\u00E9k\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Elvet\\u00E9s\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Bez\\u00E1r\\u00E1s\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\r\nBTN_TBT_CLOSE=Bez\\u00E1r\\u00E1s\r\n\r\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Opportunity\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Kezd\\u0151 d\\u00E1tum\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Befejez\\u00E9s d\\u00E1tuma\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=V\\u00E1rhat\\u00F3 forgalom\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Nem s\\u00FAlyozott\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=S\\u00FAlyozott\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Progn\\u00F3zisrelev\\u00E1ns\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Siker es\\u00E9lye (in %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=\\u00C9rt\\u00E9kes\\u00EDt\\u00E9si f\\u00E1zis\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=St\\u00E1tus\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Fi\\u00F3k\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=F\\u0151 t\\u00E1rgyal\\u00F3partner\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Illet\\u00E9kes dolgoz\\u00F3\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=Rendben\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=M\\u00E9gse\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\r\nLBL_OVERALL_TARGET=\\u00D6sszc\\u00E9l\r\n\r\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\r\nBTN_SELECT_SALESPIPELINE=Csoport sales pipeline-ja\r\n\r\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\r\nBTN_SELECT_TOP10OPPORTUNITIES=Top 10 opportunity\r\n\r\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\r\nBTN_SELECT_BARCHART=C\\u00E9l csoport szerint\r\n\r\n#XMSG: This is the Label to Show Employee Name.\r\nEMP_NAME=Dolgoz\\u00F3 neve\r\n\r\n#XFLD: This is the Employee Id\r\nEMP_ID=Dolgoz\\u00F3azonos\\u00EDt\\u00F3\r\n\r\n#XMSG: This is the Label to Show Account Name.\r\nACC_NAME=Fi\\u00F3k neve\r\n\r\n#XFLD: This is the Account Id\r\nACC_ID=\\u00DCgyf\\u00E9lazonos\\u00EDt\\u00F3\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Hiba\r\n\r\n#XFLD: This is the Employee Responsible\r\nEMPLOYEE_RESPONSIBLE=Illet\\u00E9kes dolgoz\\u00F3\r\n\r\n#XFLD: This is the Accounts .\r\nACCOUNTS=Fi\\u00F3kok\r\n\r\n#XFLD: This is the sales organizations .\r\nLBL_ORG=\\u00C9rt\\u00E9kes\\u00EDt\\u00E9si szervezetek\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Top {0} opportunity\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=\\u00D6sszes opportunity\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=Nincs el\\u00E9rhet\\u0151 opportunity\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Vesztes\\u00E9g kiz\\u00E1r\\u00E1sa\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Nyeres\\u00E9g kiz\\u00E1r\\u00E1sa\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Megjelen\\u00EDt\\u00E9s m\\u00E9ret szerint\r\n\r\n#XFLD: This is the label indicating the y axis label for target by team.\r\nLBL_REVENUE=\\u00C1rbev\\u00E9tel\r\n\r\n#XFLD: This is the label indicating the target for target by team chart.\r\nLBL_TARGET=C\\u00E9l\r\n\r\n#XFLD: This is the label indicating the Expected for target by team chart.\r\nLBL_EXPECTED=V\\u00E1rt\r\n\r\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\r\nLBL_SALESSTAGE=\\u00C9rt\\u00E9kes\\u00EDt\\u00E9si f\\u00E1zis\r\n\r\n#XFLD: This is the label indicating the organization name for those opportunities who are not maintaining organization.\r\nLBL_OTHERS=Egyebek\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Opportunity related to organization.\r\nBTN_VIEW_DETAILS=R\\u00E9szletek megtekint\\u00E9se\r\n\r\n#XFLD: This is the label indicating the bar chart\'s measure with respect to a currency (parameter)\r\nLBL_REVENUE_BAR_CHART=Bev\\u00E9tel ({0})\r\n',
	"cus/crm/ppm/mgr/i18n/i18n_it.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Monitora pipeline vendite\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=di\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Raggiungimento obiettivo\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Esegui logout\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Impostazioni\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=Azioni\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Gestisci impostazioni\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Obiettivo vendite\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Opportunit\\u00E0\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Chiudi\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Gestisci impostazioni obiettivi vendite\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Periodicit\\u00E0 dell\'obiettivo vendite\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Obiettivo vendite per periodo corrente\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Divisa\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=Periodo\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=Da\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=A\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Salva\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Annulla\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Gestisci impostazioni opportunit\\u00E0\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Valore fase\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Imposta valori manualmente\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Valore minimo dell\'opportunit\\u00E0\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Valore massimo dell\'opportunit\\u00E0\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Salva\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Resetta\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Esporta in Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Condividi\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=Visualizza registro modifiche\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Le modifiche non salvate andranno perse. Proseguire ugualmente?\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=Modifiche salvate\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=Aggiornamento non riuscito\r\n\r\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\r\nBTN_RF_CANCEL=Annulla\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=Visualizza registro modifiche\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Modifiche\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Nuovo valore\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Valore precedente\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Scarta\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Chiudi\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\r\nBTN_TBT_CLOSE=Chiudi\r\n\r\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Opportunit\\u00E0\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Data di inizio\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Data di fine\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=Fatturato previsto\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Non ponderato\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=Ponderato\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Rilevante per la previsione\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Possibilit\\u00E0 di riuscita (in %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=Livello vendite\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Stato\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Cliente\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Contatto principale\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Dipendente responsabile\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=OK\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Annulla\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\r\nLBL_OVERALL_TARGET=Obiettivo globale\r\n\r\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\r\nBTN_SELECT_SALESPIPELINE=Pipeline vendite del team\r\n\r\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\r\nBTN_SELECT_TOP10OPPORTUNITIES=Top 10 opportunit\\u00E0\r\n\r\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\r\nBTN_SELECT_BARCHART=Obiettivo in base a team\r\n\r\n#XMSG: This is the Label to Show Employee Name.\r\nEMP_NAME=Nome dipendente\\:\r\n\r\n#XFLD: This is the Employee Id\r\nEMP_ID=ID dipendente\r\n\r\n#XMSG: This is the Label to Show Account Name.\r\nACC_NAME=Nome cliente\r\n\r\n#XFLD: This is the Account Id\r\nACC_ID=ID cliente\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Errore\r\n\r\n#XFLD: This is the Employee Responsible\r\nEMPLOYEE_RESPONSIBLE=Dipendenti responsabili\r\n\r\n#XFLD: This is the Accounts .\r\nACCOUNTS=Clienti\r\n\r\n#XFLD: This is the sales organizations .\r\nLBL_ORG=Organizzazioni commerciali\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Prime {0} opportunit\\u00E0\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=Tutte le opportunit\\u00E0\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=Nessuna opportunit\\u00E0 disponibile\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Escludi opportunit\\u00E0 perse\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Escludi opportunit\\u00E0 vinte\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Visualizza per dimensione\r\n\r\n#XFLD: This is the label indicating the y axis label for target by team.\r\nLBL_REVENUE=Fatturato\r\n\r\n#XFLD: This is the label indicating the target for target by team chart.\r\nLBL_TARGET=Destinazione\r\n\r\n#XFLD: This is the label indicating the Expected for target by team chart.\r\nLBL_EXPECTED=Previsto\r\n\r\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\r\nLBL_SALESSTAGE=Livello vendite\r\n\r\n#XFLD: This is the label indicating the organization name for those opportunities who are not maintaining organization.\r\nLBL_OTHERS=Altri\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Opportunity related to organization.\r\nBTN_VIEW_DETAILS=Visualizza dettagli\r\n\r\n#XFLD: This is the label indicating the bar chart\'s measure with respect to a currency (parameter)\r\nLBL_REVENUE_BAR_CHART=Fatturato ({0})\r\n',
	"cus/crm/ppm/mgr/i18n/i18n_iw.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=\\u05E2\\u05E7\\u05D5\\u05D1 \\u05D0\\u05D7\\u05E8 \\u05E6\\u05D1\\u05E8 \\u05DE\\u05DB\\u05D9\\u05E8\\u05D5\\u05EA\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=\\u05DE\\u05EA\\u05D5\\u05DA\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=\\u05D4\\u05D9\\u05E9\\u05D2 \\u05D9\\u05E2\\u05D3\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=\\u05E6\\u05D0\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=\\u05D4\\u05D2\\u05D3\\u05E8\\u05D5\\u05EA\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=\\u05E4\\u05E2\\u05D5\\u05DC\\u05D5\\u05EA\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=\\u05E0\\u05D4\\u05DC \\u05D4\\u05D2\\u05D3\\u05E8\\u05D5\\u05EA\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=\\u05D9\\u05E2\\u05D3 \\u05DE\\u05DB\\u05D9\\u05E8\\u05D5\\u05EA\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=\\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=\\u05E1\\u05D2\\u05D5\\u05E8\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=\\u05E0\\u05D4\\u05DC \\u05D4\\u05D2\\u05D3\\u05E8\\u05D5\\u05EA \\u05D9\\u05E2\\u05D3 \\u05DE\\u05DB\\u05D9\\u05E8\\u05D5\\u05EA\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=\\u05EA\\u05E7\\u05D5\\u05E4\\u05EA\\u05D9\\u05D5\\u05EA \\u05E9\\u05DC \\u05D9\\u05E2\\u05D3 \\u05DE\\u05DB\\u05D9\\u05E8\\u05D5\\u05EA\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=\\u05D9\\u05E2\\u05D3 \\u05DE\\u05DB\\u05D9\\u05E8\\u05D5\\u05EA \\u05DC\\u05EA\\u05E7\\u05D5\\u05E4\\u05D4 \\u05E0\\u05D5\\u05DB\\u05D7\\u05D9\\u05EA\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=\\u05DE\\u05D8\\u05D1\\u05E2\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=\\u05DE\\u05E8\\u05D5\\u05D5\\u05D7 \\u05D6\\u05DE\\u05DF\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=\\u05DE-\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=\\u05E2\\u05D3\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=\\u05E9\\u05DE\\u05D5\\u05E8\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=\\u05D1\\u05D8\\u05DC\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=\\u05E0\\u05D4\\u05DC \\u05D4\\u05D2\\u05D3\\u05E8\\u05D5\\u05EA \\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=\\u05E2\\u05E8\\u05DA \\u05E9\\u05DC\\u05D1\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=\\u05D4\\u05D2\\u05D3\\u05E8 \\u05E2\\u05E8\\u05DB\\u05D9\\u05DD \\u05D1\\u05D0\\u05D5\\u05E4\\u05DF \\u05D9\\u05D3\\u05E0\\u05D9\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=\\u05E2\\u05E8\\u05DA \\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA \\u05DE\\u05D9\\u05E0\\u05D9\\u05DE\\u05DC\\u05D9\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=\\u05E2\\u05E8\\u05DA \\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA \\u05DE\\u05E7\\u05E1\\u05D9\\u05DE\\u05DC\\u05D9\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=\\u05E9\\u05DE\\u05D5\\u05E8\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=\\u05D0\\u05E4\\u05E1\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=\\u05D9\\u05E6\\u05D0 \\u05DC-Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=\\u05E9\\u05EA\\u05E3\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=\\u05D4\\u05E6\\u05D2 \\u05D9\\u05D5\\u05DE\\u05DF \\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD \\u05E9\\u05DC\\u05D0 \\u05E0\\u05E9\\u05DE\\u05E8\\u05D5 \\u05D9\\u05D0\\u05D1\\u05D3\\u05D5. \\u05D4\\u05D0\\u05DD \\u05D0\\u05EA\\u05D4 \\u05D1\\u05D8\\u05D5\\u05D7 \\u05E9\\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05D4\\u05DE\\u05E9\\u05D9\\u05DA?\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=\\u05D4\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD \\u05E0\\u05E9\\u05DE\\u05E8\\u05D5\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=\\u05E2\\u05D3\\u05DB\\u05D5\\u05DF \\u05E0\\u05DB\\u05E9\\u05DC\r\n\r\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\r\nBTN_RF_CANCEL=\\u05D1\\u05D8\\u05DC\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=\\u05D4\\u05E6\\u05D2 \\u05D9\\u05D5\\u05DE\\u05DF \\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=\\u05E2\\u05E8\\u05DA \\u05D7\\u05D3\\u05E9\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=\\u05E2\\u05E8\\u05DA \\u05D9\\u05E9\\u05DF\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=\\u05D4\\u05E1\\u05E8\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=\\u05E1\\u05D2\\u05D5\\u05E8\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\r\nBTN_TBT_CLOSE=\\u05E1\\u05D2\\u05D5\\u05E8\r\n\r\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=\\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05D4\\u05EA\\u05D7\\u05DC\\u05D4\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05E1\\u05D9\\u05D5\\u05DD\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=\\u05E0\\u05E4\\u05D7 \\u05DE\\u05DB\\u05D9\\u05E8\\u05D5\\u05EA \\u05E6\\u05E4\\u05D5\\u05D9\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=\\u05DC\\u05D0 \\u05DE\\u05E9\\u05D5\\u05E7\\u05DC\\u05DC\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=\\u05DE\\u05E9\\u05D5\\u05E7\\u05DC\\u05DC\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=\\u05E8\\u05DC\\u05D5\\u05D5\\u05E0\\u05D8\\u05D9 \\u05DC\\u05D7\\u05D9\\u05D6\\u05D5\\u05D9\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=\\u05E1\\u05D9\\u05DB\\u05D5\\u05D9 \\u05D4\\u05E6\\u05DC\\u05D7\\u05D4 (\\u05D1-%)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=\\u05E9\\u05DC\\u05D1 \\u05D1\\u05DE\\u05DB\\u05D9\\u05E8\\u05D5\\u05EA\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=\\u05E1\\u05D8\\u05D0\\u05D8\\u05D5\\u05E1\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=\\u05DC\\u05E7\\u05D5\\u05D7\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=\\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8 \\u05E8\\u05D0\\u05E9\\u05D9\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=\\u05E2\\u05D5\\u05D1\\u05D3 \\u05D0\\u05D7\\u05E8\\u05D0\\u05D9\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=OK\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=\\u05D1\\u05D8\\u05DC\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\r\nLBL_OVERALL_TARGET=\\u05D9\\u05E2\\u05D3 \\u05DB\\u05D5\\u05DC\\u05DC\r\n\r\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\r\nBTN_SELECT_SALESPIPELINE=\\u05E6\\u05D1\\u05E8 \\u05DE\\u05DB\\u05D9\\u05E8\\u05D5\\u05EA \\u05E9\\u05DC \\u05E6\\u05D5\\u05D5\\u05EA\r\n\r\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\r\nBTN_SELECT_TOP10OPPORTUNITIES=10 \\u05D4\\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05D9\\u05D5\\u05EA \\u05D4\\u05DE\\u05D5\\u05D1\\u05D9\\u05DC\\u05D5\\u05EA\r\n\r\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\r\nBTN_SELECT_BARCHART=\\u05D9\\u05E2\\u05D3 \\u05DC\\u05E4\\u05D9 \\u05E6\\u05D5\\u05D5\\u05EA\r\n\r\n#XMSG: This is the Label to Show Employee Name.\r\nEMP_NAME=\\u05E9\\u05DD \\u05E2\\u05D5\\u05D1\\u05D3\r\n\r\n#XFLD: This is the Employee Id\r\nEMP_ID=\\u05D6\\u05D9\\u05D4\\u05D5\\u05D9 \\u05E2\\u05D5\\u05D1\\u05D3\r\n\r\n#XMSG: This is the Label to Show Account Name.\r\nACC_NAME=\\u05E9\\u05DD \\u05DC\\u05E7\\u05D5\\u05D7\r\n\r\n#XFLD: This is the Account Id\r\nACC_ID=\\u05D6\\u05D9\\u05D4\\u05D5\\u05D9 \\u05DC\\u05E7\\u05D5\\u05D7\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=\\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\r\n\r\n#XFLD: This is the Employee Responsible\r\nEMPLOYEE_RESPONSIBLE=\\u05E2\\u05D5\\u05D1\\u05D3\\u05D9\\u05DD \\u05D0\\u05D7\\u05E8\\u05D0\\u05D9\\u05D9\\u05DD\r\n\r\n#XFLD: This is the Accounts .\r\nACCOUNTS=\\u05DC\\u05E7\\u05D5\\u05D7\\u05D5\\u05EA\r\n\r\n#XFLD: This is the sales organizations .\r\nLBL_ORG=\\u05D0\\u05E8\\u05D2\\u05D5\\u05E0\\u05D9 \\u05DE\\u05DB\\u05D9\\u05E8\\u05D5\\u05EA\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED={0} \\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05D9\\u05D5\\u05EA \\u05DE\\u05D5\\u05D1\\u05D9\\u05DC\\u05D5\\u05EA\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=\\u05DB\\u05DC \\u05D4\\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05D9\\u05D5\\u05EA\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=\\u05D0\\u05D9\\u05DF \\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA \\u05D6\\u05DE\\u05D9\\u05E0\\u05D4\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=\\u05D0\\u05DC \\u05EA\\u05DB\\u05DC\\u05D5\\u05DC \\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA \\u05E9\\u05D4\\u05D5\\u05D7\\u05DE\\u05E6\\u05D4\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=\\u05D0\\u05DC \\u05EA\\u05DB\\u05DC\\u05D5\\u05DC \\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA \\u05E9\\u05D4\\u05EA\\u05DE\\u05DE\\u05E9\\u05D4\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=\\u05D4\\u05E6\\u05D2 \\u05DC\\u05E4\\u05D9 \\u05D2\\u05D5\\u05D3\\u05DC\r\n\r\n#XFLD: This is the label indicating the y axis label for target by team.\r\nLBL_REVENUE=\\u05D4\\u05DB\\u05E0\\u05E1\\u05D4\r\n\r\n#XFLD: This is the label indicating the target for target by team chart.\r\nLBL_TARGET=\\u05D9\\u05E2\\u05D3\r\n\r\n#XFLD: This is the label indicating the Expected for target by team chart.\r\nLBL_EXPECTED=\\u05E6\\u05E4\\u05D5\\u05D9\r\n\r\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\r\nLBL_SALESSTAGE=\\u05E9\\u05DC\\u05D1 \\u05D1\\u05DE\\u05DB\\u05D9\\u05E8\\u05D5\\u05EA\r\n\r\n#XFLD: This is the label indicating the organization name for those opportunities who are not maintaining organization.\r\nLBL_OTHERS=\\u05D0\\u05D7\\u05E8\\u05D9\\u05DD\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Opportunity related to organization.\r\nBTN_VIEW_DETAILS=\\u05D4\\u05E6\\u05D2 \\u05E4\\u05E8\\u05D8\\u05D9\\u05DD\r\n\r\n#XFLD: This is the label indicating the bar chart\'s measure with respect to a currency (parameter)\r\nLBL_REVENUE_BAR_CHART=\\u05D4\\u05DB\\u05E0\\u05E1\\u05D4 ({0})\r\n',
	"cus/crm/ppm/mgr/i18n/i18n_ja.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=\\u8CA9\\u58F2\\u30D1\\u30A4\\u30D7\\u30E9\\u30A4\\u30F3\\u8FFD\\u8DE1\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=/\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=\\u76EE\\u6A19\\u9054\\u6210\\u5EA6\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=\\u30ED\\u30B0\\u30A2\\u30A6\\u30C8\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=\\u8A2D\\u5B9A\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=\\u30A2\\u30AF\\u30B7\\u30E7\\u30F3\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=\\u8A2D\\u5B9A\\u7BA1\\u7406\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=\\u8CA9\\u58F2\\u76EE\\u6A19\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=\\u6848\\u4EF6\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=\\u9589\\u3058\\u308B\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=\\u8CA9\\u58F2\\u76EE\\u6A19\\u8A2D\\u5B9A\\u7BA1\\u7406\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=\\u8CA9\\u58F2\\u76EE\\u6A19\\u5468\\u671F\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=\\u73FE\\u671F\\u9593\\u306E\\u8CA9\\u58F2\\u76EE\\u6A19\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=\\u901A\\u8CA8\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=\\u30BF\\u30A4\\u30E0\\u30B9\\u30D1\\u30F3\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=\\u958B\\u59CB\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=\\u7D42\\u4E86\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=\\u4FDD\\u5B58\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=\\u4E2D\\u6B62\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=\\u6848\\u4EF6\\u8A2D\\u5B9A\\u7BA1\\u7406\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=\\u30B9\\u30C6\\u30C3\\u30D7\\u5024\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=\\u5024\\u30DE\\u30CB\\u30E5\\u30A2\\u30EB\\u8A2D\\u5B9A\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=\\u6700\\u5C0F\\u6848\\u4EF6\\u91D1\\u984D\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=\\u6700\\u5927\\u6848\\u4EF6\\u91D1\\u984D\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=\\u4FDD\\u5B58\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=\\u30EA\\u30BB\\u30C3\\u30C8\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Exportto Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=\\u5171\\u6709\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=\\u5909\\u66F4\\u30ED\\u30B0\\u8868\\u793A\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=\\u672A\\u4FDD\\u5B58\\u306E\\u5909\\u66F4\\u306F\\u5931\\u308F\\u308C\\u307E\\u3059\\u3002\\u7D9A\\u884C\\u3057\\u307E\\u3059\\u304B\\u3002\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=\\u5909\\u66F4\\u304C\\u4FDD\\u5B58\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=\\u66F4\\u65B0\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n\r\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\r\nBTN_RF_CANCEL=\\u4E2D\\u6B62\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=\\u5909\\u66F4\\u30ED\\u30B0\\u8868\\u793A\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=\\u5909\\u66F4\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=\\u65B0\\u3057\\u3044\\u5024\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=\\u53E4\\u3044\\u5024\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=\\u7834\\u68C4\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=\\u9589\\u3058\\u308B\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\r\nBTN_TBT_CLOSE=\\u9589\\u3058\\u308B\r\n\r\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=\\u6848\\u4EF6\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=\\u958B\\u59CB\\u65E5\\u4ED8\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=\\u7D42\\u4E86\\u65E5\\u4ED8\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=\\u898B\\u8FBC\\u8CA9\\u58F2\\u984D\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=\\u52A0\\u91CD\\u306A\\u3057\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=\\u52A0\\u91CD\\u3042\\u308A\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=\\u4E88\\u6E2C\\u95A2\\u9023\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=\\u53D7\\u6CE8\\u898B\\u8FBC (%)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=\\u55B6\\u696D\\u30D5\\u30A7\\u30FC\\u30BA\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=\\u30B9\\u30C6\\u30FC\\u30BF\\u30B9\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=\\u9867\\u5BA2\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=\\u4E3B\\u8981\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=\\u7BA1\\u7406\\u8CAC\\u4EFB\\u8005\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=OK\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=\\u4E2D\\u6B62\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\r\nLBL_OVERALL_TARGET=\\u5168\\u4F53\\u76EE\\u6A19\r\n\r\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\r\nBTN_SELECT_SALESPIPELINE=\\u30D1\\u30A4\\u30D7\\u30E9\\u30A4\\u30F3\r\n\r\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\r\nBTN_SELECT_TOP10OPPORTUNITIES=\\u4E0A\\u4F4D 10 \\u6848\\u4EF6\r\n\r\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\r\nBTN_SELECT_BARCHART=\\u30C1\\u30FC\\u30E0\\u5225\\u76EE\\u6A19\r\n\r\n#XMSG: This is the Label to Show Employee Name.\r\nEMP_NAME=\\u5F93\\u696D\\u54E1\\u540D\r\n\r\n#XFLD: This is the Employee Id\r\nEMP_ID=\\u5F93\\u696D\\u54E1 ID\r\n\r\n#XMSG: This is the Label to Show Account Name.\r\nACC_NAME=\\u9867\\u5BA2\\u540D\r\n\r\n#XFLD: This is the Account Id\r\nACC_ID=\\u9867\\u5BA2 ID\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=\\u30A8\\u30E9\\u30FC\r\n\r\n#XFLD: This is the Employee Responsible\r\nEMPLOYEE_RESPONSIBLE=\\u7BA1\\u7406\\u8CAC\\u4EFB\\u8005\r\n\r\n#XFLD: This is the Accounts .\r\nACCOUNTS=\\u9867\\u5BA2\r\n\r\n#XFLD: This is the sales organizations .\r\nLBL_ORG=\\u8CA9\\u58F2\\u7D44\\u7E54\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=\\u4E0A\\u4F4D {0} \\u6848\\u4EF6\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=\\u3059\\u3079\\u3066\\u306E\\u6848\\u4EF6\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=\\u5229\\u7528\\u53EF\\u80FD\\u6848\\u4EF6\\u306A\\u3057\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=\\u5931\\u6CE8\\u9664\\u5916\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=\\u53D7\\u6CE8\\u9664\\u5916\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=\\u30B5\\u30A4\\u30BA\\u5225\\u8868\\u793A\r\n\r\n#XFLD: This is the label indicating the y axis label for target by team.\r\nLBL_REVENUE=\\u53CE\\u76CA\r\n\r\n#XFLD: This is the label indicating the target for target by team chart.\r\nLBL_TARGET=\\u76EE\\u6A19\r\n\r\n#XFLD: This is the label indicating the Expected for target by team chart.\r\nLBL_EXPECTED=\\u898B\\u8FBC\r\n\r\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\r\nLBL_SALESSTAGE=\\u55B6\\u696D\\u30D5\\u30A7\\u30FC\\u30BA\r\n\r\n#XFLD: This is the label indicating the organization name for those opportunities who are not maintaining organization.\r\nLBL_OTHERS=\\u305D\\u306E\\u4ED6\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Opportunity related to organization.\r\nBTN_VIEW_DETAILS=\\u8A73\\u7D30\\u8868\\u793A\r\n\r\n#XFLD: This is the label indicating the bar chart\'s measure with respect to a currency (parameter)\r\nLBL_REVENUE_BAR_CHART=\\u53CE\\u76CA ({0})\r\n',
	"cus/crm/ppm/mgr/i18n/i18n_no.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Spor salgspipeline\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=av\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=M\\u00E5loppfyllelse\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Logg av\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Innstillinger\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=Aktiviteter\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Administrer innstillinger\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Salgsm\\u00E5l\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Salgsmulighet\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Lukk\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Administrer salgsm\\u00E5lsinnstillinger\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Salgsm\\u00E5lsperiodisitet\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Salgsm\\u00E5l for aktuell periode\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Valuta\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=Tidsintervall\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=Fra\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=Til\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Lagre\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Avbryt\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Administrer salgsmulighetsinnstillinger\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Trinnverdi\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Oppgi verdier manuelt\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Minimumsverdi for salgsmulighet\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Maksimumsverdi for salgsmulighet\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Lagre\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Tilbakestill\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Eksporter til Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Del\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=Vis endringsprotokoll\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Du vil miste endringer som ikke er lagret. Er du sikker p\\u00E5 at du vil fortsette?\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=Endringer lagret\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=Oppdatering mislyktes\r\n\r\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\r\nBTN_RF_CANCEL=Avbryt\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=Vis endringsprotokoll\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Endringer\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Ny verdi\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Gammel verdi\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Forkast\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Lukk\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\r\nBTN_TBT_CLOSE=Avslutt\r\n\r\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Salgsmulighet\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Startdato\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Sluttdato\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=Forventet omsetning\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Uvektet\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=Vektet\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Relevant for prognose\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Sannsynlighet for suksess (i %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=Salgsfase\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Status\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Kunde\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Hovedkontakt\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Ansvarlig medarbeider\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=OK\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Avbryt\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\r\nLBL_OVERALL_TARGET=Samlet m\\u00E5l\r\n\r\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\r\nBTN_SELECT_SALESPIPELINE=Salgspipeline for team\r\n\r\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\r\nBTN_SELECT_TOP10OPPORTUNITIES=Topp-10-salgsmuligheter\r\n\r\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\r\nBTN_SELECT_BARCHART=M\\u00E5l etter team\r\n\r\n#XMSG: This is the Label to Show Employee Name.\r\nEMP_NAME=Medarbeidernavn\r\n\r\n#XFLD: This is the Employee Id\r\nEMP_ID=Medarbeider-ID\r\n\r\n#XMSG: This is the Label to Show Account Name.\r\nACC_NAME=Kundenavn\r\n\r\n#XFLD: This is the Account Id\r\nACC_ID=Kunde-ID\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Feil\r\n\r\n#XFLD: This is the Employee Responsible\r\nEMPLOYEE_RESPONSIBLE=Ansvarlige medarbeidere\r\n\r\n#XFLD: This is the Accounts .\r\nACCOUNTS=Kunder\r\n\r\n#XFLD: This is the sales organizations .\r\nLBL_ORG=Salgsorganisasjoner\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Topp {0} salgsmuligheter\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=Alle salgsmuligheter\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=Salgsmulighet ikke tilgjengelig\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Ekskluder tapt\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Ekskluder vunnet\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Vis etter st\\u00F8rrelse\r\n\r\n#XFLD: This is the label indicating the y axis label for target by team.\r\nLBL_REVENUE=Omsetning\r\n\r\n#XFLD: This is the label indicating the target for target by team chart.\r\nLBL_TARGET=M\\u00E5l\r\n\r\n#XFLD: This is the label indicating the Expected for target by team chart.\r\nLBL_EXPECTED=Forventet\r\n\r\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\r\nLBL_SALESSTAGE=Salgsfase\r\n\r\n#XFLD: This is the label indicating the organization name for those opportunities who are not maintaining organization.\r\nLBL_OTHERS=Andre\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Opportunity related to organization.\r\nBTN_VIEW_DETAILS=Vis detaljer\r\n\r\n#XFLD: This is the label indicating the bar chart\'s measure with respect to a currency (parameter)\r\nLBL_REVENUE_BAR_CHART=Inntekt ({0})\r\n',
	"cus/crm/ppm/mgr/i18n/i18n_pl.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=\\u015Aledzenie oczekiwanej sprzeda\\u017Cy\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=z\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Realizacja celu\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Wyloguj\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Ustawienia\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=Czynno\\u015Bci\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Zarz\\u0105dzanie ustawieniami\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Cel sprzeda\\u017Cy\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Szansa\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Zamknij\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Zarz\\u0105dzanie ustawieniami celu sprzeda\\u017Cy\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Okresowo\\u015B\\u0107 celu sprzeda\\u017Cy\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Cel sprzeda\\u017Cy dla bie\\u017C\\u0105cego okresu\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Waluta\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=Przedzia\\u0142 czasu\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=Od\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=Do\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Zapisz\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Anuluj\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Zarz\\u0105dzanie ustawieniami szansy\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Warto\\u015B\\u0107 kroku\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Ustaw warto\\u015Bci r\\u0119cznie\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Minimalna warto\\u015B\\u0107 szansy\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Maksymalna warto\\u015B\\u0107 szansy\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Zapisz\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Resetuj\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Eksportuj do Excela\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Udost\\u0119pnij\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=Wy\\u015Bwietl log zmian\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Niezapisane zmiany zostan\\u0105 utracone. Czy na pewno chcesz kontynuowa\\u0107?\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=Zapisano zmiany\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=Aktualizacja nie powiod\\u0142a si\\u0119\r\n\r\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\r\nBTN_RF_CANCEL=Anuluj\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=Wy\\u015Bwietl log zmian\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Zmiany\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Nowa warto\\u015B\\u0107\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Stara warto\\u015B\\u0107\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Odrzu\\u0107\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Zamknij\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\r\nBTN_TBT_CLOSE=Zamknij\r\n\r\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Szansa\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Data rozpocz\\u0119cia\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Data zako\\u0144czenia\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=Oczekiwany obr\\u00F3t\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Niewa\\u017Cone\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=Wa\\u017Cone\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Istotne dla prognozy\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Szansa na sukces (w %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=Faza sprzeda\\u017Cy\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Status\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Klient\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=G\\u0142\\u00F3wny kontakt\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Odpowiedzialny pracownik\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=OK\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Anuluj\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\r\nLBL_OVERALL_TARGET=Cel og\\u00F3lny\r\n\r\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\r\nBTN_SELECT_SALESPIPELINE=Oczekiwana sprzeda\\u017C zespo\\u0142u\r\n\r\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\r\nBTN_SELECT_TOP10OPPORTUNITIES=10 g\\u0142\\u00F3wnych szans\r\n\r\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\r\nBTN_SELECT_BARCHART=Cel wg zespo\\u0142u\r\n\r\n#XMSG: This is the Label to Show Employee Name.\r\nEMP_NAME=Nazwa pracownika\r\n\r\n#XFLD: This is the Employee Id\r\nEMP_ID=ID pracownika\r\n\r\n#XMSG: This is the Label to Show Account Name.\r\nACC_NAME=Nazwa klienta\r\n\r\n#XFLD: This is the Account Id\r\nACC_ID=ID klienta\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=B\\u0142\\u0105d\r\n\r\n#XFLD: This is the Employee Responsible\r\nEMPLOYEE_RESPONSIBLE=Odpowiedzialny pracownik\r\n\r\n#XFLD: This is the Accounts .\r\nACCOUNTS=Klienci\r\n\r\n#XFLD: This is the sales organizations .\r\nLBL_ORG=Dzia\\u0142y sprzeda\\u017Cy\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=G\\u0142\\u00F3wnych szans\\: {0}\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=Wszystkie szanse\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=Brak dost\\u0119pnych szans\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Wyklucz przegrane\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Wyklucz wygrane\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Wy\\u015Bwietl wed\\u0142ug rozmiaru\r\n\r\n#XFLD: This is the label indicating the y axis label for target by team.\r\nLBL_REVENUE=Przych\\u00F3d\r\n\r\n#XFLD: This is the label indicating the target for target by team chart.\r\nLBL_TARGET=Cel\r\n\r\n#XFLD: This is the label indicating the Expected for target by team chart.\r\nLBL_EXPECTED=Oczekiwane\r\n\r\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\r\nLBL_SALESSTAGE=Faza sprzeda\\u017Cy\r\n\r\n#XFLD: This is the label indicating the organization name for those opportunities who are not maintaining organization.\r\nLBL_OTHERS=Inne\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Opportunity related to organization.\r\nBTN_VIEW_DETAILS=Zobacz szczeg\\u00F3\\u0142y\r\n\r\n#XFLD: This is the label indicating the bar chart\'s measure with respect to a currency (parameter)\r\nLBL_REVENUE_BAR_CHART=Przych\\u00F3d ({0})\r\n',
	"cus/crm/ppm/mgr/i18n/i18n_pt.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Monitorar pipeline de vendas\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=de\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Alcance do objetivo\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Encerrar sess\\u00E3o\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Configura\\u00E7\\u00F5es\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=A\\u00E7\\u00F5es\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Administrar configura\\u00E7\\u00F5es\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Meta de vendas\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Oportunidade\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Fechar\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Administrar configura\\u00E7\\u00F5es da meta de vendas\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Periodicidade da meta de vendas\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Meta de vendas do per\\u00EDodo atual\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Moeda\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=Per\\u00EDodo\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=De\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=At\\u00E9\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Salvar\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Cancelar\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Administrar configura\\u00E7\\u00F5es da oportunidade\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Valor da etapa\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Definir valores manualmente\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Valor m\\u00EDnimo da oportunidade\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Valor m\\u00E1ximo da oportunidade\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Gravar\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Reinicializar\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Exportar para Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Compartilhar\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=Visualizar log de modifica\\u00E7\\u00F5es\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=As modifica\\u00E7\\u00F5es n\\u00E3o gravadas se perder\\u00E3o. Continuar?\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=As modifica\\u00E7\\u00F5es foram salvas\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=Atualiza\\u00E7\\u00E3o falhada\r\n\r\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\r\nBTN_RF_CANCEL=Cancelar\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=Visualizar log de modifica\\u00E7\\u00F5es\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Modifica\\u00E7\\u00F5es\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Valor novo\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Valor antigo\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Rejeitar\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Fechar\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\r\nBTN_TBT_CLOSE=Fechar\r\n\r\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Oportunidade\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Data de in\\u00EDcio\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Data de t\\u00E9rmino\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=Faturamento previsto\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=N\\u00E3o ponderado\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=Ponderado\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Relevante p/previs\\u00E3o\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Chance de sucesso (em %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=Fase de vendas\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Status\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Conta\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Contato principal\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Funcion\\u00E1rio respons\\u00E1vel\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=OK\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Cancelar\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\r\nLBL_OVERALL_TARGET=Meta global\r\n\r\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\r\nBTN_SELECT_SALESPIPELINE=Pipeline de vendas da equipe\r\n\r\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\r\nBTN_SELECT_TOP10OPPORTUNITIES=10 principais oportunidades\r\n\r\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\r\nBTN_SELECT_BARCHART=Meta por equipe\r\n\r\n#XMSG: This is the Label to Show Employee Name.\r\nEMP_NAME=Nome do funcion\\u00E1rio\r\n\r\n#XFLD: This is the Employee Id\r\nEMP_ID=ID do funcion\\u00E1rio\r\n\r\n#XMSG: This is the Label to Show Account Name.\r\nACC_NAME=Nome da conta\r\n\r\n#XFLD: This is the Account Id\r\nACC_ID=ID da conta\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Erro\r\n\r\n#XFLD: This is the Employee Responsible\r\nEMPLOYEE_RESPONSIBLE=Funcion\\u00E1rios respons\\u00E1veis\r\n\r\n#XFLD: This is the Accounts .\r\nACCOUNTS=Contas\r\n\r\n#XFLD: This is the sales organizations .\r\nLBL_ORG=Organiza\\u00E7\\u00F5es de vendas\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Top {0} oportunidades\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=Todas as oportunidades\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=Nenhuma oportunidade dispon\\u00EDvel\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Excluir perda\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Excluir ganho\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Exibir por tamanho\r\n\r\n#XFLD: This is the label indicating the y axis label for target by team.\r\nLBL_REVENUE=Receita\r\n\r\n#XFLD: This is the label indicating the target for target by team chart.\r\nLBL_TARGET=Meta\r\n\r\n#XFLD: This is the label indicating the Expected for target by team chart.\r\nLBL_EXPECTED=Previsto\r\n\r\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\r\nLBL_SALESSTAGE=Fase de vendas\r\n\r\n#XFLD: This is the label indicating the organization name for those opportunities who are not maintaining organization.\r\nLBL_OTHERS=Outros\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Opportunity related to organization.\r\nBTN_VIEW_DETAILS=Visualizar detalhes\r\n\r\n#XFLD: This is the label indicating the bar chart\'s measure with respect to a currency (parameter)\r\nLBL_REVENUE_BAR_CHART=Receita ({0})\r\n',
	"cus/crm/ppm/mgr/i18n/i18n_ro.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Urm\\u0103rire pipeline de v\\u00E2nz\\u0103ri\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=de\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Realizare \\u0163int\\u0103\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Deconectare\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Set\\u0103ri\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=Ac\\u0163iuni\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Gestionare set\\u0103ri\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=\\u0162int\\u0103 de v\\u00E2nz\\u0103ri\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Oportunitate\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=\\u00CEnchidere\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Gestionare set\\u0103ri \\u0163int\\u0103 v\\u00E2nz\\u0103ri\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Periodicitate \\u0163int\\u0103 v\\u00E2nz\\u0103ri\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=\\u0162int\\u0103 de v\\u00E2nz\\u0103ri pt.perioad\\u0103 curent\\u0103\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Moned\\u0103\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=Interval timp\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=De la\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=P\\u00E2n\\u0103 la\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Salvare\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Anulare\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Gestionare set\\u0103ri oportunitate\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Valoare etap\\u0103\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Setare manual\\u0103 valori\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Valoare oportunitate minim\\u0103\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Valoare oportunitate maxim\\u0103\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Salvare\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Resetare\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Export \\u00EEn Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Partajare\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=Afi\\u015Fare jurnal de modific\\u0103ri\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Orice modific\\u0103ri nesalvate vor fi pierdute. Sigur dori\\u0163i s\\u0103 continua\\u0163i?\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=Modific\\u0103ri salvate\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=Actualizare nereu\\u015Fit\\u0103\r\n\r\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\r\nBTN_RF_CANCEL=Anulare\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=Afi\\u015Fare jurnal de modific\\u0103ri\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Modific\\u0103ri\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Valoare nou\\u0103\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Valoare veche\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Respingere\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=\\u00CEnchidere\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\r\nBTN_TBT_CLOSE=\\u00CEnchidere\r\n\r\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Oportunitate\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Dat\\u0103 de \\u00EEnceput\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Dat\\u0103 de sf\\u00E2r\\u015Fit\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=Volum de v\\u00E2nz\\u0103ri prev\\u0103zut\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Neponderat\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=Ponderat\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Relevant pt.prognoz\\u0103\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=\\u015Eans\\u0103 de reu\\u015Fit\\u0103 (\\u00EEn %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=Etap\\u0103 de v\\u00E2nz\\u0103ri\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Stare\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Cont\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Persoan\\u0103 de contact principal\\u0103\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Angajat responsabil\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=OK\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Anulare\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\r\nLBL_OVERALL_TARGET=\\u0162int\\u0103 global\\u0103\r\n\r\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\r\nBTN_SELECT_SALESPIPELINE=Pipeline de v\\u00E2nz\\u0103ri echip\\u0103\r\n\r\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\r\nBTN_SELECT_TOP10OPPORTUNITIES=Top 10 oportunit\\u0103\\u0163i\r\n\r\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\r\nBTN_SELECT_BARCHART=\\u0162int\\u0103 dup\\u0103 echip\\u0103\r\n\r\n#XMSG: This is the Label to Show Employee Name.\r\nEMP_NAME=Nume angajat\r\n\r\n#XFLD: This is the Employee Id\r\nEMP_ID=ID angajat\r\n\r\n#XMSG: This is the Label to Show Account Name.\r\nACC_NAME=Nume de cont\r\n\r\n#XFLD: This is the Account Id\r\nACC_ID=ID cont\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Eroare\r\n\r\n#XFLD: This is the Employee Responsible\r\nEMPLOYEE_RESPONSIBLE=Angaja\\u0163i responsabili\r\n\r\n#XFLD: This is the Accounts .\r\nACCOUNTS=Conturi\r\n\r\n#XFLD: This is the sales organizations .\r\nLBL_ORG=Departamente de v\\u00E2nz\\u0103ri\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Top {0} oportunit\\u0103\\u0163i\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=Toate oportunit\\u0103\\u0163ile\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=Nicio oportunitate disponibil\\u0103\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Excludere pierderi\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Excludere c\\u00E2\\u015Ftiguri\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Afi\\u015Fare dup\\u0103 m\\u0103rime\r\n\r\n#XFLD: This is the label indicating the y axis label for target by team.\r\nLBL_REVENUE=Venit\r\n\r\n#XFLD: This is the label indicating the target for target by team chart.\r\nLBL_TARGET=\\u0162int\\u0103\r\n\r\n#XFLD: This is the label indicating the Expected for target by team chart.\r\nLBL_EXPECTED=Prev\\u0103zut\r\n\r\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\r\nLBL_SALESSTAGE=Etap\\u0103 de v\\u00E2nz\\u0103ri\r\n\r\n#XFLD: This is the label indicating the organization name for those opportunities who are not maintaining organization.\r\nLBL_OTHERS=Altele\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Opportunity related to organization.\r\nBTN_VIEW_DETAILS=Afi\\u015Fare detalii\r\n\r\n#XFLD: This is the label indicating the bar chart\'s measure with respect to a currency (parameter)\r\nLBL_REVENUE_BAR_CHART=Venit ({0})\r\n',
	"cus/crm/ppm/mgr/i18n/i18n_ru.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=\\u041E\\u0442\\u0441\\u043B\\u0435\\u0436\\u0438\\u0432\\u0430\\u043D\\u0438\\u0435 \\u043F\\u0430\\u0439\\u043F\\u043B\\u0430\\u0439\\u043D\\u0430 \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=\\u0438\\u0437\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=\\u0414\\u043E\\u0441\\u0442\\u0438\\u0436\\u0435\\u043D\\u0438\\u0435 \\u0446\\u0435\\u043B\\u0438\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=\\u0412\\u044B\\u0439\\u0442\\u0438\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=\\u041D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=\\u041E\\u043F\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=\\u0423\\u043F\\u0440\\u0430\\u0432\\u043B\\u0435\\u043D\\u0438\\u0435 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0430\\u043C\\u0438\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=\\u0426\\u0435\\u043B\\u044C \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=\\u0412\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u044C\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=\\u0417\\u0430\\u043A\\u0440\\u044B\\u0442\\u044C\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=\\u0423\\u043F\\u0440\\u0430\\u0432\\u043B\\u0435\\u043D\\u0438\\u0435 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0430\\u043C\\u0438 \\u0446\\u0435\\u043B\\u0438 \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=\\u041F\\u0435\\u0440\\u0438\\u043E\\u0434\\u0438\\u0447\\u043D\\u043E\\u0441\\u0442\\u044C \\u0446\\u0435\\u043B\\u0438 \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=\\u0426\\u0435\\u043B\\u044C \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436 \\u043D\\u0430 \\u0442\\u0435\\u043A\\u0443\\u0449\\u0438\\u0439 \\u043F\\u0435\\u0440\\u0438\\u043E\\u0434\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=\\u0412\\u0430\\u043B\\u044E\\u0442\\u0430\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=\\u0412\\u0440\\u0435\\u043C\\u0435\\u043D\\u043D\\u043E\\u0439 \\u0438\\u043D\\u0442\\u0435\\u0440\\u0432\\u0430\\u043B\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=\\u0421\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=\\u041F\\u043E\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=\\u0421\\u043E\\u0445\\u0440\\u0430\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=\\u0423\\u043F\\u0440\\u0430\\u0432\\u043B\\u0435\\u043D\\u0438\\u0435 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0430\\u043C\\u0438 \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=\\u0417\\u043D\\u0430\\u0447\\u0435\\u043D\\u0438\\u0435 \\u0448\\u0430\\u0433\\u0430\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=\\u0423\\u0441\\u0442\\u0430\\u043D\\u043E\\u0432\\u0438\\u0442\\u044C \\u0437\\u043D\\u0430\\u0447\\u0435\\u043D\\u0438\\u044F \\u0432\\u0440\\u0443\\u0447\\u043D\\u0443\\u044E\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=\\u041C\\u0438\\u043D\\u0438\\u043C\\u0430\\u043B\\u044C\\u043D\\u043E\\u0435 \\u0437\\u043D\\u0430\\u0447\\u0435\\u043D\\u0438\\u0435 \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=\\u041C\\u0430\\u043A\\u0441\\u0438\\u043C\\u0430\\u043B\\u044C\\u043D\\u043E\\u0435 \\u0437\\u043D\\u0430\\u0447\\u0435\\u043D\\u0438\\u0435 \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=\\u0421\\u043E\\u0445\\u0440\\u0430\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=\\u0421\\u0431\\u0440\\u043E\\u0441\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=\\u042D\\u043A\\u0441\\u043F\\u043E\\u0440\\u0442 \\u0432 Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=\\u041F\\u043E\\u0434\\u0435\\u043B\\u0438\\u0442\\u044C\\u0441\\u044F\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=\\u041F\\u0440\\u043E\\u0441\\u043C\\u043E\\u0442\\u0440 \\u0436\\u0443\\u0440\\u043D\\u0430\\u043B\\u0430 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u0439\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=\\u0412\\u0441\\u0435 \\u043D\\u0435\\u0441\\u043E\\u0445\\u0440\\u0430\\u043D\\u0435\\u043D\\u043D\\u044B\\u0435 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F \\u0431\\u0443\\u0434\\u0443\\u0442 \\u043F\\u043E\\u0442\\u0435\\u0440\\u044F\\u043D\\u044B. \\u041F\\u0440\\u043E\\u0434\\u043E\\u043B\\u0436\\u0438\\u0442\\u044C?\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=\\u0418\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F \\u0441\\u043E\\u0445\\u0440\\u0430\\u043D\\u0435\\u043D\\u044B\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=\\u0421\\u0431\\u043E\\u0439 \\u043E\\u0431\\u043D\\u043E\\u0432\\u043B\\u0435\\u043D\\u0438\\u044F\r\n\r\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\r\nBTN_RF_OK=\\u041E\\u041A\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\r\nBTN_RF_CANCEL=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=\\u041F\\u0440\\u043E\\u0441\\u043C\\u043E\\u0442\\u0440 \\u0436\\u0443\\u0440\\u043D\\u0430\\u043B\\u0430 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u0439\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=\\u0418\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=\\u041D\\u043E\\u0432\\u043E\\u0435 \\u0437\\u043D\\u0430\\u0447\\u0435\\u043D\\u0438\\u0435\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=\\u0421\\u0442\\u0430\\u0440\\u043E\\u0435 \\u0437\\u043D\\u0430\\u0447\\u0435\\u043D\\u0438\\u0435\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=\\u041E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=\\u0417\\u0430\\u043A\\u0440\\u044B\\u0442\\u044C\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\r\nBTN_TBT_CLOSE=\\u0417\\u0430\\u043A\\u0440\\u044B\\u0442\\u044C\r\n\r\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=\\u0412\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u044C\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=\\u0414\\u0430\\u0442\\u0430 \\u043D\\u0430\\u0447\\u0430\\u043B\\u0430\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=\\u0414\\u0430\\u0442\\u0430 \\u043E\\u043A\\u043E\\u043D\\u0447\\u0430\\u043D\\u0438\\u044F\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=\\u041E\\u0436\\u0438\\u0434\\u0430\\u0435\\u043C\\u044B\\u0439 \\u043E\\u0431\\u043E\\u0440\\u043E\\u0442\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=\\u041D\\u0435 \\u0432\\u0437\\u0432\\u0435\\u0448\\u0435\\u043D\\u043E\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=\\u0412\\u0437\\u0432\\u0435\\u0448\\u0435\\u043D\\u043E\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=\\u0420\\u0435\\u043B\\u0435\\u0432\\u0430\\u043D\\u0442\\u043D\\u043E \\u0434\\u043B\\u044F \\u043F\\u0440\\u043E\\u0433\\u043D\\u043E\\u0437\\u0430\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=\\u0412\\u0435\\u0440\\u043E\\u044F\\u0442\\u043D\\u043E\\u0441\\u0442\\u044C \\u0443\\u0441\\u043F\\u0435\\u0445\\u0430 (\\u0432 %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=\\u0424\\u0430\\u0437\\u0430 \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=\\u0421\\u0442\\u0430\\u0442\\u0443\\u0441\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=\\u041A\\u043B\\u0438\\u0435\\u043D\\u0442\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=\\u041E\\u0441\\u043D\\u043E\\u0432\\u043D\\u043E\\u0439 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=\\u041E\\u0442\\u0432\\u0435\\u0442\\u0441\\u0442\\u0432\\u0435\\u043D\\u043D\\u044B\\u0439 \\u0441\\u043E\\u0442\\u0440\\u0443\\u0434\\u043D\\u0438\\u043A\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=\\u041E\\u041A\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\r\nLBL_OVERALL_TARGET=\\u041E\\u0431\\u0449\\u0430\\u044F \\u0446\\u0435\\u043B\\u044C\r\n\r\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\r\nBTN_SELECT_SALESPIPELINE=\\u041F\\u0430\\u0439\\u043F\\u043B\\u0430\\u0439\\u043D \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436 \\u0433\\u0440\\u0443\\u043F\\u043F\\u044B\r\n\r\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\r\nBTN_SELECT_TOP10OPPORTUNITIES=\\u0412\\u0435\\u0434\\u0443\\u0449\\u0438\\u0435 10 \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0435\\u0439\r\n\r\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\r\nBTN_SELECT_BARCHART=\\u0426\\u0435\\u043B\\u044C \\u043F\\u043E \\u0433\\u0440\\u0443\\u043F\\u043F\\u0435\r\n\r\n#XMSG: This is the Label to Show Employee Name.\r\nEMP_NAME=\\u0418\\u043C\\u044F \\u0441\\u043E\\u0442\\u0440\\u0443\\u0434\\u043D\\u0438\\u043A\\u0430\r\n\r\n#XFLD: This is the Employee Id\r\nEMP_ID=\\u0418\\u0434. \\u0441\\u043E\\u0442\\u0440\\u0443\\u0434\\u043D\\u0438\\u043A\\u0430\r\n\r\n#XMSG: This is the Label to Show Account Name.\r\nACC_NAME=\\u0418\\u043C\\u044F \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0430\r\n\r\n#XFLD: This is the Account Id\r\nACC_ID=\\u0418\\u0434. \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0430\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=\\u041E\\u0448\\u0438\\u0431\\u043A\\u0430\r\n\r\n#XFLD: This is the Employee Responsible\r\nEMPLOYEE_RESPONSIBLE=\\u041E\\u0442\\u0432\\u0435\\u0442\\u0441\\u0442\\u0432\\u0435\\u043D\\u043D\\u044B\\u0435 \\u0441\\u043E\\u0442\\u0440\\u0443\\u0434\\u043D\\u0438\\u043A\\u0438\r\n\r\n#XFLD: This is the Accounts .\r\nACCOUNTS=\\u041A\\u043B\\u0438\\u0435\\u043D\\u0442\\u044B\r\n\r\n#XFLD: This is the sales organizations .\r\nLBL_ORG=\\u0421\\u0431\\u044B\\u0442\\u043E\\u0432\\u044B\\u0435 \\u043E\\u0440\\u0433\\u0430\\u043D\\u0438\\u0437\\u0430\\u0446\\u0438\\u0438\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=\\u041F\\u0435\\u0440\\u0432\\u044B\\u0435 \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438 ({0})\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=\\u0412\\u0441\\u0435 \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=\\u0412\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438 \\u043D\\u0435\\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=\\u0418\\u0441\\u043A\\u043B\\u044E\\u0447\\u0438\\u0442\\u044C \\u0443\\u043F\\u0443\\u0449\\u0435\\u043D\\u043D\\u044B\\u0435\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=\\u0418\\u0441\\u043A\\u043B\\u044E\\u0447\\u0438\\u0442\\u044C \\u0440\\u0435\\u0430\\u043B\\u0438\\u0437\\u043E\\u0432\\u0430\\u043D\\u043D\\u044B\\u0435\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=\\u041F\\u0440\\u043E\\u0441\\u043C\\u043E\\u0442\\u0440 \\u043F\\u043E \\u0440\\u0430\\u0437\\u043C\\u0435\\u0440\\u0443\r\n\r\n#XFLD: This is the label indicating the y axis label for target by team.\r\nLBL_REVENUE=\\u0412\\u044B\\u0440\\u0443\\u0447\\u043A\\u0430\r\n\r\n#XFLD: This is the label indicating the target for target by team chart.\r\nLBL_TARGET=\\u0426\\u0435\\u043B\\u0435\\u0432\\u043E\\u0439\r\n\r\n#XFLD: This is the label indicating the Expected for target by team chart.\r\nLBL_EXPECTED=\\u041E\\u0436\\u0438\\u0434\\u0430\\u0435\\u0442\\u0441\\u044F\r\n\r\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\r\nLBL_SALESSTAGE=\\u0424\\u0430\\u0437\\u0430 \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\r\n\r\n#XFLD: This is the label indicating the organization name for those opportunities who are not maintaining organization.\r\nLBL_OTHERS=\\u041F\\u0440\\u043E\\u0447\\u0438\\u0435\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Opportunity related to organization.\r\nBTN_VIEW_DETAILS=\\u041F\\u0440\\u043E\\u0441\\u043C\\u043E\\u0442\\u0440\\u0435\\u0442\\u044C \\u043F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u044B\\u0435 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0435\r\n\r\n#XFLD: This is the label indicating the bar chart\'s measure with respect to a currency (parameter)\r\nLBL_REVENUE_BAR_CHART=\\u0412\\u044B\\u0440\\u0443\\u0447\\u043A\\u0430 ({0})\r\n',
	"cus/crm/ppm/mgr/i18n/i18n_sh.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Prati cevovod prodaje\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=od\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Postizanje cilja\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Odjavi se\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Pode\\u0161avanja\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=Radnje\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Upravljaj pode\\u0161avanjima\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Cilj prodaje\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Prilika\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Zatvori\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Upravljaj pode\\u0161avanjima cilja prodaje\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Periodi\\u010Dnost cilja prodaje\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Cilj prodaje za teku\\u0107i period\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Valuta\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=Vremenski period\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=Od\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=Do\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Sa\\u010Duvaj\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Odustani\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Upravljaj pode\\u0161avanjima prilike\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Vrednost koraka\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Postavi vrednosti ru\\u010Dno\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Minimalna vrednost prilike\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Maksimalna vrednost prilike\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Sa\\u010Duvaj\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Ponovo postavi\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Izvoz u Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Podeli\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=Prika\\u017Ei protokol promena\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Sve nesa\\u010Duvane promene \\u0107e biti izgubljene. Da li sigurno \\u017Eelite da nastavite?\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=Promene sa\\u010Duvane\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=A\\u017Euriranje nije uspelo\r\n\r\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\r\nBTN_RF_CANCEL=Odustani\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=Prika\\u017Ei protokol promena\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Promene\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Nova vrednost\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Stara vrednost\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Odbaci\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Zatvori\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\r\nBTN_TBT_CLOSE=Zatvori\r\n\r\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Prilika\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Datum po\\u010Detka\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Datum zavr\\u0161etka\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=O\\u010Dekivani obim prodaje\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Nije ponderisano\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=Ponderisano\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Relevantno za predvi\\u0111anje\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Mogu\\u0107nost uspeha (u %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=Faza prodaje\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Status\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Ra\\u010Dun\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Glavni kontakt\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Odgovorni zaposleni\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=OK\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Odustani\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\r\nLBL_OVERALL_TARGET=Ukupni cilj\r\n\r\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\r\nBTN_SELECT_SALESPIPELINE=Cevovod prodaje tima\r\n\r\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\r\nBTN_SELECT_TOP10OPPORTUNITIES=Prvih 10 prilika\r\n\r\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\r\nBTN_SELECT_BARCHART=Cilj po timu\r\n\r\n#XMSG: This is the Label to Show Employee Name.\r\nEMP_NAME=Ime zaposlenog\r\n\r\n#XFLD: This is the Employee Id\r\nEMP_ID=ID zaposlenog\r\n\r\n#XMSG: This is the Label to Show Account Name.\r\nACC_NAME=Ime klijenta\r\n\r\n#XFLD: This is the Account Id\r\nACC_ID=ID ra\\u010Duna\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Gre\\u0161ka\r\n\r\n#XFLD: This is the Employee Responsible\r\nEMPLOYEE_RESPONSIBLE=Odgovorni zaposleni\r\n\r\n#XFLD: This is the Accounts .\r\nACCOUNTS=Ra\\u010Duni\r\n\r\n#XFLD: This is the sales organizations .\r\nLBL_ORG=Organizacije prodaje\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Prvih {0} prilika\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=Sve prilike\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=Prilika nije dostupna\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Isklju\\u010Di izgubljeno\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Isklju\\u010Di realizovano\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Prika\\u017Ei po veli\\u010Dini\r\n\r\n#XFLD: This is the label indicating the y axis label for target by team.\r\nLBL_REVENUE=Prihod\r\n\r\n#XFLD: This is the label indicating the target for target by team chart.\r\nLBL_TARGET=Cilj\r\n\r\n#XFLD: This is the label indicating the Expected for target by team chart.\r\nLBL_EXPECTED=O\\u010Dekivano\r\n\r\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\r\nLBL_SALESSTAGE=Faza prodaje\r\n\r\n#XFLD: This is the label indicating the organization name for those opportunities who are not maintaining organization.\r\nLBL_OTHERS=Drugi\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Opportunity related to organization.\r\nBTN_VIEW_DETAILS=Prika\\u017Ei detalje\r\n\r\n#XFLD: This is the label indicating the bar chart\'s measure with respect to a currency (parameter)\r\nLBL_REVENUE_BAR_CHART=Prihod ({0})\r\n',
	"cus/crm/ppm/mgr/i18n/i18n_sk.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Sledovanie pipeline predaja\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=z\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Dosiahnutie cie\\u013Ea\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Odhl\\u00E1si\\u0165 sa\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Nastavenia\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=Akcie\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Spravova\\u0165 nastavenia\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Cie\\u013E predaja\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Pr\\u00EDle\\u017Eitos\\u0165\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Zatvori\\u0165\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Spravova\\u0165 nastavenia cie\\u013Ea predaja\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Periodicita cie\\u013Ea predaja\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Cie\\u013E predaja pre aktu\\u00E1lne obdobie\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Mena\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=\\u010Casov\\u00FD interval\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=Od\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=Do\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Ulo\\u017Ei\\u0165\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Zru\\u0161i\\u0165\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Spravova\\u0165 nastavenia pr\\u00EDle\\u017Eitost\\u00ED\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Hodnota kroku\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Nastavi\\u0165 hodnoty manu\\u00E1lne\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Minim\\u00E1lna hodnota pr\\u00EDle\\u017Eitosti\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Maxim\\u00E1lna hodnota pr\\u00EDle\\u017Eitosti\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Ulo\\u017Ei\\u0165\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Obnovi\\u0165\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Export do Excelu\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Zdie\\u013Ea\\u0165\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=Zobrazi\\u0165 protokol zmien\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=V\\u0161etky neulo\\u017Een\\u00E9 zmeny sa stratia. Naozaj chcete pokra\\u010Dova\\u0165?\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=Zmeny ulo\\u017Een\\u00E9\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=Aktualiz\\u00E1cia sa nepodarila\r\n\r\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\r\nBTN_RF_CANCEL=Zru\\u0161i\\u0165\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=Zobrazi\\u0165 protokol zmien\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Zmeny\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Nov\\u00E1 hodnota\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Star\\u00E1 hodnota\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Zahodi\\u0165\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Zatvori\\u0165\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\r\nBTN_TBT_CLOSE=Zatvori\\u0165\r\n\r\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Pr\\u00EDle\\u017Eitos\\u0165\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Po\\u010Diato\\u010Dn\\u00FD d\\u00E1tum\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Koncov\\u00FD d\\u00E1tum\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=O\\u010Dak\\u00E1van\\u00FD objem predaja\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Nev\\u00E1\\u017Een\\u00E9\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=V\\u00E1\\u017Een\\u00E9\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Relevantn\\u00E9 pre progn\\u00F3zu\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Pravdepodobnos\\u0165 \\u00FAspechu (v %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=F\\u00E1za predaja\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Stav\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Z\\u00E1kazn\\u00EDk\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Hlavn\\u00FD kontakt\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Zodpovedn\\u00FD zamestnanec\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=OK\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Zru\\u0161i\\u0165\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\r\nLBL_OVERALL_TARGET=Celkov\\u00FD cie\\u013E\r\n\r\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\r\nBTN_SELECT_SALESPIPELINE=Pipeline predaja t\\u00EDmu\r\n\r\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\r\nBTN_SELECT_TOP10OPPORTUNITIES=Top 10 pr\\u00EDle\\u017Eitost\\u00ED\r\n\r\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\r\nBTN_SELECT_BARCHART=Cie\\u013E pod\\u013Ea t\\u00EDmu\r\n\r\n#XMSG: This is the Label to Show Employee Name.\r\nEMP_NAME=Meno zamestnanca\r\n\r\n#XFLD: This is the Employee Id\r\nEMP_ID=ID zamestnanca\r\n\r\n#XMSG: This is the Label to Show Account Name.\r\nACC_NAME=N\\u00E1zov z\\u00E1kazn\\u00EDka\r\n\r\n#XFLD: This is the Account Id\r\nACC_ID=ID z\\u00E1kazn\\u00EDka\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Chyba\r\n\r\n#XFLD: This is the Employee Responsible\r\nEMPLOYEE_RESPONSIBLE=Zodpovedn\\u00ED zamestnanci\r\n\r\n#XFLD: This is the Accounts .\r\nACCOUNTS=Z\\u00E1kazn\\u00EDci\r\n\r\n#XFLD: This is the sales organizations .\r\nLBL_ORG=Predajn\\u00E9 organiz\\u00E1cie\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Top {0} pr\\u00EDle\\u017Eitost\\u00ED\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=V\\u0161etky pr\\u00EDle\\u017Eitosti\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=\\u017Diadna pr\\u00EDle\\u017Eitos\\u0165 nie je k dispoz\\u00EDcii\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Vyl\\u00FA\\u010Di\\u0165 straten\\u00E9\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Vyl\\u00FA\\u010Di\\u0165 z\\u00EDskan\\u00E9\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Zobrazi\\u0165 pod\\u013Ea ve\\u013Ekosti\r\n\r\n#XFLD: This is the label indicating the y axis label for target by team.\r\nLBL_REVENUE=V\\u00FDnos\r\n\r\n#XFLD: This is the label indicating the target for target by team chart.\r\nLBL_TARGET=Cie\\u013E\r\n\r\n#XFLD: This is the label indicating the Expected for target by team chart.\r\nLBL_EXPECTED=O\\u010Dak\\u00E1van\\u00E9\r\n\r\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\r\nLBL_SALESSTAGE=F\\u00E1za predaja\r\n\r\n#XFLD: This is the label indicating the organization name for those opportunities who are not maintaining organization.\r\nLBL_OTHERS=In\\u00E9\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Opportunity related to organization.\r\nBTN_VIEW_DETAILS=Zobrazi\\u0165 detaily\r\n\r\n#XFLD: This is the label indicating the bar chart\'s measure with respect to a currency (parameter)\r\nLBL_REVENUE_BAR_CHART=V\\u00FDnos ({0})\r\n',
	"cus/crm/ppm/mgr/i18n/i18n_sl.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Sledenje prodajnemu procesu\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=od\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Ciljni dose\\u017Eek\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Odjava\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Nastavitve\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=Akcije\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Upravljanje nastavitev\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Cilj prodaje\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Prilo\\u017Enost\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Zapiranje\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Upravljanje nastavitev ciljev prodaje\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Periodi\\u010Dnost ciljev prodaje\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Cilj prodaje za teko\\u010De obdobje\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Valuta\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=\\u010Casovni interval\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=Od\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=Do\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Shranjevanje\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Prekinitev\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Upravljanje nastavitev prilo\\u017Enosti\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Vrednost koraka\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Ro\\u010Dna nastavitev vrednosti\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Minimalna vrednost prilo\\u017Enosti\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Maksimalna vrednost prilo\\u017Enosti\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Shranjevanje\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Ponastavitev\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Izvoz v Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Deli\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=Pogled zapisnika spremembe\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Vse neshranjene spremembe bodo izgubljene. \\u017Delite res nadaljevati?\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=Spremembe so shranjene\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=A\\u017Euriranje ni uspelo\r\n\r\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\r\nBTN_RF_CANCEL=Prekinitev\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=Pogled zapisnika spremembe\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Spremembe\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Nova vrednost\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Stara vrednost\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Opustitev\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Zapiranje\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\r\nBTN_TBT_CLOSE=Zapiranje\r\n\r\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Prilo\\u017Enost\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Datum za\\u010Detka\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Datum konca\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=Pri\\u010Dakovan promet\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Neponderirano\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=Ponderirano\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Relevantno za napoved\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Mo\\u017Enost uspeha (v %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=Faza prodaje\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Status\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Stranka\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Glavna kontaktna oseba\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Odgovorni zaposleni\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=OK\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Prekinitev\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\r\nLBL_OVERALL_TARGET=Splo\\u0161ni cilj\r\n\r\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\r\nBTN_SELECT_SALESPIPELINE=Pipeline prodaje tima\r\n\r\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\r\nBTN_SELECT_TOP10OPPORTUNITIES=Najbolj\\u0161ih 10 prilo\\u017Enosti\r\n\r\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\r\nBTN_SELECT_BARCHART=Cilj po timu\r\n\r\n#XMSG: This is the Label to Show Employee Name.\r\nEMP_NAME=Ime zaposlenega\r\n\r\n#XFLD: This is the Employee Id\r\nEMP_ID=ID zaposlenega\r\n\r\n#XMSG: This is the Label to Show Account Name.\r\nACC_NAME=Ime stranke\r\n\r\n#XFLD: This is the Account Id\r\nACC_ID=ID stranke\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Napaka\r\n\r\n#XFLD: This is the Employee Responsible\r\nEMPLOYEE_RESPONSIBLE=Odgovorni zaposleni\r\n\r\n#XFLD: This is the Accounts .\r\nACCOUNTS=Stranke\r\n\r\n#XFLD: This is the sales organizations .\r\nLBL_ORG=Prodajne organizacije\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Najbolj\\u0161ih {0} prilo\\u017Enosti\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=Vse prilo\\u017Enosti\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=Prilo\\u017Enosti niso na voljo\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Izklju\\u010Di izgubljeno\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Izklju\\u010Di dobljeno\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Prikaz po velikosti\r\n\r\n#XFLD: This is the label indicating the y axis label for target by team.\r\nLBL_REVENUE=Promet\r\n\r\n#XFLD: This is the label indicating the target for target by team chart.\r\nLBL_TARGET=Cilj\r\n\r\n#XFLD: This is the label indicating the Expected for target by team chart.\r\nLBL_EXPECTED=Pri\\u010Dakovano\r\n\r\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\r\nLBL_SALESSTAGE=Faza prodaje\r\n\r\n#XFLD: This is the label indicating the organization name for those opportunities who are not maintaining organization.\r\nLBL_OTHERS=Drugo\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Opportunity related to organization.\r\nBTN_VIEW_DETAILS=Prikaz detajlov\r\n\r\n#XFLD: This is the label indicating the bar chart\'s measure with respect to a currency (parameter)\r\nLBL_REVENUE_BAR_CHART=Prihodek ({0})\r\n',
	"cus/crm/ppm/mgr/i18n/i18n_tr.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Sat\\u0131\\u015F kanal\\u0131n\\u0131 izle\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=/\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Hedef ba\\u015Far\\u0131s\\u0131\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Oturumu kapat\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Ayarlar\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=\\u0130\\u015Flemler\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Ayarlar\\u0131 y\\u00F6net\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Sat\\u0131\\u015F hedefi\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=F\\u0131rsat\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Kapat\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Sat\\u0131\\u015F hedefi ayarlar\\u0131n\\u0131 y\\u00F6net\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Sat\\u0131\\u015F hedefi d\\u00F6nemselli\\u011Fi\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Ge\\u00E7erli d\\u00F6nem i\\u00E7in sat\\u0131\\u015F hedefi\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Para birimi\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=Zaman aral\\u0131\\u011F\\u0131\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=Ba\\u015Flang\\u0131\\u00E7\\:\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=Biti\\u015F\\:\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Kaydet\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=\\u0130ptal\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=F\\u0131rsat ayarlar\\u0131n\\u0131 y\\u00F6net\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Ad\\u0131m de\\u011Feri\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=De\\u011Ferleri man\\u00FCel olarak belirle\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Asgari f\\u0131rsat de\\u011Feri\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Azami f\\u0131rsat de\\u011Feri\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Kaydet\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=S\\u0131f\\u0131rla\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Excel\'e aktar\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Payla\\u015F\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=De\\u011Fi\\u015Fiklik g\\u00FCnl\\u00FC\\u011F\\u00FCn\\u00FC g\\u00F6r\\u00FCnt\\u00FCle\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Kaydedilmeyen de\\u011Fi\\u015Fiklikler kaybolacak. Devam etmek istedi\\u011Finizden emin misiniz?\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=De\\u011Fi\\u015Fiklikler kaydedildi\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=G\\u00FCncelleme ba\\u015Far\\u0131s\\u0131z\r\n\r\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\r\nBTN_RF_OK=Tamam\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\r\nBTN_RF_CANCEL=\\u0130ptal\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=De\\u011Fi\\u015Fiklik g\\u00FCnl\\u00FC\\u011F\\u00FCn\\u00FC g\\u00F6r\\u00FCnt\\u00FCle\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=De\\u011Fi\\u015Fiklikler\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Yeni de\\u011Fer\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Eski de\\u011Fer\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Yoksay\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Kapat\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\r\nBTN_TBT_CLOSE=Kapat\r\n\r\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=F\\u0131rsat\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Ba\\u015Flang\\u0131\\u00E7 tarihi\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Biti\\u015F tarihi\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=Beklenen sat\\u0131\\u015F has\\u0131lat\\u0131\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=A\\u011F\\u0131rl\\u0131kl\\u0131 de\\u011Fil\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=A\\u011F\\u0131rl\\u0131kl\\u0131\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Tahmin i\\u00E7in ili\\u015Fkili\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Ba\\u015Far\\u0131 \\u015Fans\\u0131 (% olarak)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=Sat\\u0131\\u015F a\\u015Famas\\u0131\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Durum\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=M\\u00FC\\u015Fteri\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Ana ilgili ki\\u015Fi\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Sorumlu \\u00E7al\\u0131\\u015Fan\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=Tamam\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=\\u0130ptal\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\r\nLBL_OVERALL_TARGET=Genel hedef\r\n\r\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\r\nBTN_SELECT_SALESPIPELINE=Ekibin sat\\u0131\\u015F kanal\\u0131\r\n\r\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\r\nBTN_SELECT_TOP10OPPORTUNITIES=\\u0130lk 10 f\\u0131rsat\r\n\r\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\r\nBTN_SELECT_BARCHART=Ekibe g\\u00F6re hedef\r\n\r\n#XMSG: This is the Label to Show Employee Name.\r\nEMP_NAME=\\u00C7al\\u0131\\u015Fan ad\\u0131\r\n\r\n#XFLD: This is the Employee Id\r\nEMP_ID=\\u00C7al\\u0131\\u015Fan tan\\u0131t\\u0131c\\u0131s\\u0131\r\n\r\n#XMSG: This is the Label to Show Account Name.\r\nACC_NAME=M\\u00FC\\u015Fteri ad\\u0131\r\n\r\n#XFLD: This is the Account Id\r\nACC_ID=M\\u00FC\\u015Fteri tan\\u0131t\\u0131c\\u0131s\\u0131\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Hata\r\n\r\n#XFLD: This is the Employee Responsible\r\nEMPLOYEE_RESPONSIBLE=Sorumlu \\u00E7al\\u0131\\u015Fanlar\r\n\r\n#XFLD: This is the Accounts .\r\nACCOUNTS=M\\u00FC\\u015Fteriler\r\n\r\n#XFLD: This is the sales organizations .\r\nLBL_ORG=Sat\\u0131\\u015F organizasyonlar\\u0131\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=\\u0130lk {0} f\\u0131rsatlar\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=T\\u00FCm f\\u0131rsatlar\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=F\\u0131rsat mevcut de\\u011Fil\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Kaybedileni hari\\u00E7 tut\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Kazan\\u0131lan\\u0131 hari\\u00E7 tut\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Boyuta g\\u00F6re g\\u00F6r\\u00FCnt\\u00FCle\r\n\r\n#XFLD: This is the label indicating the y axis label for target by team.\r\nLBL_REVENUE=Gelir\r\n\r\n#XFLD: This is the label indicating the target for target by team chart.\r\nLBL_TARGET=Hedef\r\n\r\n#XFLD: This is the label indicating the Expected for target by team chart.\r\nLBL_EXPECTED=Beklenen\r\n\r\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\r\nLBL_SALESSTAGE=Sat\\u0131\\u015F a\\u015Famas\\u0131\r\n\r\n#XFLD: This is the label indicating the organization name for those opportunities who are not maintaining organization.\r\nLBL_OTHERS=Di\\u011Ferleri\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Opportunity related to organization.\r\nBTN_VIEW_DETAILS=Ayr\\u0131nt\\u0131lar\\u0131 g\\u00F6r\\u00FCnt\\u00FCle\r\n\r\n#XFLD: This is the label indicating the bar chart\'s measure with respect to a currency (parameter)\r\nLBL_REVENUE_BAR_CHART=Gelir ({0})\r\n',
	"cus/crm/ppm/mgr/i18n/i18n_zh_CN.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=\\u8DDF\\u8E2A\\u9500\\u552E\\u7BA1\\u9053\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=/\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=\\u76EE\\u6807\\u4E1A\\u7EE9\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=\\u767B\\u51FA\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=\\u8BBE\\u7F6E\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=\\u64CD\\u4F5C\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=\\u7BA1\\u7406\\u8BBE\\u7F6E\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=\\u9500\\u552E\\u76EE\\u6807\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=\\u673A\\u4F1A\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=\\u5173\\u95ED\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=\\u7BA1\\u7406\\u9500\\u552E\\u76EE\\u6807\\u8BBE\\u7F6E\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=\\u9500\\u552E\\u76EE\\u6807\\u5468\\u671F\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=\\u5F53\\u524D\\u671F\\u95F4\\u7684\\u9500\\u552E\\u76EE\\u6807\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=\\u8D27\\u5E01\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=\\u65F6\\u95F4\\u8303\\u56F4\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=\\u4ECE\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=\\u81F3\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=\\u4FDD\\u5B58\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=\\u53D6\\u6D88\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=\\u7BA1\\u7406\\u673A\\u4F1A\\u8BBE\\u7F6E\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=\\u589E\\u91CF\\u503C\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=\\u624B\\u52A8\\u8BBE\\u7F6E\\u503C\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=\\u6700\\u5C0F\\u673A\\u4F1A\\u503C\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=\\u6700\\u5927\\u673A\\u4F1A\\u503C\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=\\u4FDD\\u5B58\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=\\u91CD\\u7F6E\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=\\u5BFC\\u51FA\\u4E3A Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=\\u5171\\u4EAB\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=\\u67E5\\u770B\\u53D8\\u66F4\\u65E5\\u5FD7\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=\\u6240\\u6709\\u672A\\u4FDD\\u5B58\\u7684\\u66F4\\u6539\\u5C06\\u4E22\\u5931\\u3002\\u662F\\u5426\\u786E\\u5B9A\\u7EE7\\u7EED\\uFF1F\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=\\u66F4\\u6539\\u5DF2\\u4FDD\\u5B58\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=\\u66F4\\u65B0\\u5931\\u8D25\r\n\r\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\r\nBTN_RF_OK=\\u786E\\u5B9A\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\r\nBTN_RF_CANCEL=\\u53D6\\u6D88\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=\\u67E5\\u770B\\u53D8\\u66F4\\u65E5\\u5FD7\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=\\u66F4\\u6539\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=\\u65B0\\u503C\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=\\u65E7\\u503C\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=\\u653E\\u5F03\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=\\u5173\\u95ED\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\r\nBTN_TBT_CLOSE=\\u5173\\u95ED\r\n\r\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=\\u673A\\u4F1A\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=\\u5F00\\u59CB\\u65E5\\u671F\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=\\u7ED3\\u675F\\u65E5\\u671F\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=\\u9884\\u671F\\u9500\\u552E\\u989D\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=\\u672A\\u52A0\\u6743\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=\\u5DF2\\u52A0\\u6743\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=\\u9884\\u6D4B\\u76F8\\u5173\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=\\u6210\\u529F\\u51E0\\u7387 (%)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=\\u9500\\u552E\\u9636\\u6BB5\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=\\u72B6\\u6001\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=\\u5BA2\\u6237\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=\\u4E3B\\u8981\\u8054\\u7CFB\\u4EBA\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=\\u8D1F\\u8D23\\u4EBA\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=\\u786E\\u5B9A\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=\\u53D6\\u6D88\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\r\nLBL_OVERALL_TARGET=\\u603B\\u4F53\\u76EE\\u6807\r\n\r\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\r\nBTN_SELECT_SALESPIPELINE=\\u56E2\\u961F\\u7684\\u9500\\u552E\\u7BA1\\u9053\r\n\r\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\r\nBTN_SELECT_TOP10OPPORTUNITIES=\\u524D 10 \\u4E2A\\u673A\\u4F1A\r\n\r\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\r\nBTN_SELECT_BARCHART=\\u76EE\\u6807\\uFF08\\u6309\\u56E2\\u961F\\uFF09\r\n\r\n#XMSG: This is the Label to Show Employee Name.\r\nEMP_NAME=\\u5458\\u5DE5\\u59D3\\u540D\r\n\r\n#XFLD: This is the Employee Id\r\nEMP_ID=\\u5458\\u5DE5\\u6807\\u8BC6\r\n\r\n#XMSG: This is the Label to Show Account Name.\r\nACC_NAME=\\u5BA2\\u6237\\u540D\\u79F0\r\n\r\n#XFLD: This is the Account Id\r\nACC_ID=\\u5BA2\\u6237\\u6807\\u8BC6\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=\\u9519\\u8BEF\r\n\r\n#XFLD: This is the Employee Responsible\r\nEMPLOYEE_RESPONSIBLE=\\u8D1F\\u8D23\\u5458\\u5DE5\r\n\r\n#XFLD: This is the Accounts .\r\nACCOUNTS=\\u5BA2\\u6237\r\n\r\n#XFLD: This is the sales organizations .\r\nLBL_ORG=\\u9500\\u552E\\u7EC4\\u7EC7\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=\\u524D {0} \\u4E2A\\u673A\\u4F1A\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=\\u5168\\u90E8\\u673A\\u4F1A\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=\\u65E0\\u53EF\\u7528\\u673A\\u4F1A\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=\\u6392\\u9664\\u5DF2\\u5931\\u53BB\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=\\u6392\\u9664\\u5DF2\\u8D62\\u5F97\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=\\u6309\\u5927\\u5C0F\\u663E\\u793A\r\n\r\n#XFLD: This is the label indicating the y axis label for target by team.\r\nLBL_REVENUE=\\u6536\\u5165\r\n\r\n#XFLD: This is the label indicating the target for target by team chart.\r\nLBL_TARGET=\\u76EE\\u6807\r\n\r\n#XFLD: This is the label indicating the Expected for target by team chart.\r\nLBL_EXPECTED=\\u9884\\u671F\r\n\r\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\r\nLBL_SALESSTAGE=\\u9500\\u552E\\u9636\\u6BB5\r\n\r\n#XFLD: This is the label indicating the organization name for those opportunities who are not maintaining organization.\r\nLBL_OTHERS=\\u5176\\u4ED6\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Opportunity related to organization.\r\nBTN_VIEW_DETAILS=\\u67E5\\u770B\\u8BE6\\u7EC6\\u4FE1\\u606F\r\n\r\n#XFLD: This is the label indicating the bar chart\'s measure with respect to a currency (parameter)\r\nLBL_REVENUE_BAR_CHART=\\u6536\\u5165 ({0})\r\n',
	"cus/crm/ppm/mgr/i18n/i18n_zh_CN_.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=\\u8DDF\\u8E2A\\u9500\\u552E\\u7BA1\\u9053\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=/\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=\\u76EE\\u6807\\u4E1A\\u7EE9\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=\\u767B\\u51FA\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=\\u7BA1\\u7406\\u8BBE\\u7F6E\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=\\u64CD\\u4F5C\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=\\u7BA1\\u7406\\u8BBE\\u7F6E\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=\\u9500\\u552E\\u76EE\\u6807\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=\\u673A\\u4F1A\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=\\u5173\\u95ED\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=\\u7BA1\\u7406\\u9500\\u552E\\u76EE\\u6807\\u8BBE\\u7F6E\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=\\u9500\\u552E\\u76EE\\u6807\\u671F\\u95F4\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=\\u5F53\\u524D\\u671F\\u95F4\\u7684\\u9500\\u552E\\u76EE\\u6807\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=\\u8D27\\u5E01\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=\\u65F6\\u95F4\\u8303\\u56F4\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=\\u4ECE\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=\\u81F3\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=\\u4FDD\\u5B58\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=\\u53D6\\u6D88\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=\\u7BA1\\u7406\\u673A\\u4F1A\\u8BBE\\u7F6E\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=\\u589E\\u91CF\\u503C\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=\\u624B\\u52A8\\u8BBE\\u7F6E\\u503C\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=\\u6700\\u5C0F\\u673A\\u4F1A\\u503C\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=\\u6700\\u5927\\u673A\\u4F1A\\u503C\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=\\u4FDD\\u5B58\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=\\u91CD\\u7F6E\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=\\u5BFC\\u51FA\\u4E3A Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=\\u5171\\u4EAB\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=\\u67E5\\u770B\\u53D8\\u66F4\\u65E5\\u5FD7\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=\\u6240\\u6709\\u672A\\u4FDD\\u5B58\\u7684\\u66F4\\u6539\\u5C06\\u4E22\\u5931\\u3002\\u662F\\u5426\\u786E\\u5B9A\\u7EE7\\u7EED\\uFF1F\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=\\u66F4\\u65B0\\u6210\\u529F\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=\\u66F4\\u65B0\\u5931\\u8D25\r\n\r\n#XBUT: This is the button\'s text indicating the success action of refreshing the main screen.\r\nBTN_RF_OK=\\u786E\\u5B9A\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of refreshing the main screen.\r\nBTN_RF_CANCEL=\\u53D6\\u6D88\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=\\u67E5\\u770B\\u53D8\\u66F4\\u65E5\\u5FD7\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=\\u66F4\\u6539\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=\\u65B0\\u503C\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=\\u65E7\\u503C\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=\\u653E\\u5F03\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=\\u5173\\u95ED\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Target by team bar pop over.\r\nBTN_TBT_CLOSE=\\u5173\\u95ED\r\n\r\n#XFLD: This is the label of the Pop over control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=\\u673A\\u4F1A\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=\\u5F00\\u59CB\\u65E5\\u671F\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=\\u7ED3\\u675F\\u65E5\\u671F\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=\\u9884\\u671F\\u9500\\u552E\\u989D\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=\\u672A\\u52A0\\u6743\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=\\u5DF2\\u52A0\\u6743\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=\\u9884\\u6D4B\\u76F8\\u5173\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=\\u6210\\u529F\\u51E0\\u7387 (%)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=\\u9500\\u552E\\u9636\\u6BB5\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=\\u72B6\\u6001\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=\\u5BA2\\u6237\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=\\u4E3B\\u8981\\u8054\\u7CFB\\u4EBA\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=\\u8D1F\\u8D23\\u4EBA\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=\\u786E\\u5B9A\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=\\u53D6\\u6D88\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating overall target the Sales Representatives have achieved.\r\nLBL_OVERALL_TARGET=\\u603B\\u4F53\\u76EE\\u6807\r\n\r\n#XBUT: This is the button\'s text to select the Sales Pipeline as CHART selector.\r\nBTN_SELECT_SALESPIPELINE=\\u56E2\\u961F\\u7684\\u9500\\u552E\\u7BA1\\u9053\r\n\r\n#XBUT: This is the button\'s text to select the Top 10 Opportunities as CHART selector.\r\nBTN_SELECT_TOP10OPPORTUNITIES=\\u524D 10 \\u4E2A\\u673A\\u4F1A\r\n\r\n#XBUT: This is the button\'s text to select the Bar CHART as selector.\r\nBTN_SELECT_BARCHART=\\u76EE\\u6807\\uFF08\\u6309\\u56E2\\u961F\\uFF09\r\n\r\n#XMSG: This is the Label to Show Employee Name.\r\nEMP_NAME=\\u5458\\u5DE5\\u59D3\\u540D\r\n\r\n#XFLD: This is the Employee Id\r\nEMP_ID=\\u5458\\u5DE5\\u6807\\u8BC6\r\n\r\n#XMSG: This is the Label to Show Account Name.\r\nACC_NAME=\\u5BA2\\u6237\\u540D\\u79F0\r\n\r\n#XFLD: This is the Account Id\r\nACC_ID=\\u5BA2\\u6237\\u6807\\u8BC6\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=\\u9519\\u8BEF\r\n\r\n#XFLD: This is the Employee Responsible\r\nEMPLOYEE_RESPONSIBLE=\\u8D1F\\u8D23\\u4EBA\r\n\r\n#XFLD: This is the Accounts .\r\nACCOUNTS=\\u5BA2\\u6237\r\n\r\n#XFLD: This is the sales organizations .\r\nLBL_ORG=\\u9500\\u552E\\u7EC4\\u7EC7\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=\\u524D {0} \\u4E2A\\u673A\\u4F1A\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=\\u5168\\u90E8\\u673A\\u4F1A\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=\\u65E0\\u53EF\\u7528\\u673A\\u4F1A\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=\\u6392\\u9664\\u5DF2\\u5931\\u53BB\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=\\u6392\\u9664\\u5DF2\\u8D62\\u5F97\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=\\u6309\\u5927\\u5C0F\\u663E\\u793A\r\n\r\n#XFLD: This is the label indicating the y axis label for target by team.\r\nLBL_REVENUE=\\u6536\\u5165\r\n\r\n#XFLD: This is the label indicating the target for target by team chart.\r\nLBL_TARGET=\\u76EE\\u6807\r\n\r\n#XFLD: This is the label indicating the Expected for target by team chart.\r\nLBL_EXPECTED=\\u9884\\u671F\r\n\r\n#XFLD: This is the label indicating the Sales Stage for target by team chart pop over.\r\nLBL_SALESSTAGE=\\u9500\\u552E\\u9636\\u6BB5\r\n\r\n',
	"cus/crm/ppm/mgr/util/formatter.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.ppm.mgr.util.formatter");
jQuery.sap.require("sap.ui.core.format.NumberFormat");
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");

cus.crm.ppm.mgr.util.formatter = {
	// Formatters
	toBoolean : function(i) {
		if (i > 0)
			return true;
		else
			return false;
	},

	setDLFormatter : function(a) {
		return [ [ sap.ca.ui.charts.DefaultFormatterFunction.SHORTNUMBER ] ];
	},

	setYAFormatter : function(a) {
		return sap.ca.ui.charts.DefaultFormatterFunction.SHORTNUMBER;
	},

	// Formatting to display and reverse the numbers
	displayNumbers : function(i) {
		var locale = new sap.ui.core.Locale(sap.ui.getCore().getConfiguration()
				.getLanguage());
		var convNF = sap.ui.core.format.NumberFormat.getIntegerInstance({
			groupingEnabled : true
		}, locale);
		var numVal = convNF.format(i);
		return numVal;
	},

	// Formatting to display mobile view numbers
	displayTargetNumbers : function(i) {
		var numVal = sap.ca.ui.model.format.AmountFormat.FormatAmountShort(i);
		return numVal;
	},

	reverseNumbers : function(i) {
		var langu = sap.ui.getCore().getConfiguration().getLanguage();
		var numVal = null;
		if (langu == "fr" || langu == "ru")
			numVal = parseInt(i.replace(/[^0-9\.]+/g, ""));
		else {
			var locale = new sap.ui.core.Locale(langu);
			var convNF = sap.ui.core.format.NumberFormat.getIntegerInstance({
				groupingEnabled : true
			}, locale);
			numVal = convNF.parse(i);
		}
		return numVal;
	},

	// Formatting to display and reverse the dates
	displayDates : function(i) {
		var locale = new sap.ui.core.Locale(sap.ui.getCore().getConfiguration()
				.getLanguage());
		var convDF = sap.ui.core.format.DateFormat.getInstance({
			style : "long"
		}, locale);
		var dateVal = convDF.format(i);
		return dateVal;
	},

	convToSixZeros : function(i) {
		var locTime = i.getTime();
		var offSet = i.getTimezoneOffset() * 60000;
		var utcDate = new Date(locTime + offSet);
		return utcDate;
	},

	convFromSixZeros : function(i) {
		var utcTime = i.getTime();
		var offSet = i.getTimezoneOffset() * 60000;
		var locDate = new Date(utcTime - offSet);
		return locDate;
	},
};
},
	"cus/crm/ppm/mgr/view/Opportunity.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<Popover xmlns:core="sap.ui.core" xmlns="sap.m" xmlns:layout="sap.ui.layout"\n\tid="po" contentHeight="500px" contentWidth="300px" showHeader="true"\n\tplacement="Auto">\n\t<customHeader>\n\t\t<Bar id="poBar">\n\t\t\t<contentRight>\n\t\t\t\t<Button id="upBtn" icon="sap-icon://up" press="moveUp"\n\t\t\t\t\tvisible="false" />\n\t\t\t\t<Button id="downBtn" icon="sap-icon://down" press="moveDown"\n\t\t\t\t\tvisible="false" />\n\t\t\t</contentRight>\n\t\t\t<contentMiddle>\n\t\t\t\t<Label id="oppDetails" text="{i18n>LBL_OPPORT_DETAILS}" />\n\t\t\t</contentMiddle>\n\t\t</Bar>\n\t</customHeader>\n\n\t<content>\n\t\t<Page id="poPage" showHeader="false">\n\t\t\t<content>\n\t\t\t\t<!-- Add fields to the start of the Opportunity popover -->\n\t\t\t\t<core:ExtensionPoint name="extOpportunityPopover"></core:ExtensionPoint>\n\n\t\t\t\t<layout:VerticalLayout id="popoverVBox">\n\t\t\t\t\t<layout:content>\n\t\t\t\t\t\t<!-- Opportunity ID -->\n\t\t\t\t\t\t<Label id="OppId" design="Bold" />\n\t\t\t\t\t\t<!-- Opportunity Description - Link -->\n\t\t\t\t\t\t<Link id="OppDescription" wrapping="true" press="toOppApp" />\n\n\t\t\t\t\t\t<!-- Account Name -->\n\t\t\t\t\t\t<!-- <Text id="accountName"></Text> -->\n\n\t\t\t\t\t\t<!-- Prospect/Account -->\n\t\t\t\t\t\t<Label text="{i18n>LBL_OD_ACCPROSPECT}" design="Bold" />\n\t\t\t\t\t\t<Link id="accName" wrapping="true" press="toAccountApp" />\n\t\t\t\t\t\t<!-- Main Contact of Account -->\n\t\t\t\t\t\t<layout:VerticalLayout id="mainContact"\n\t\t\t\t\t\t\tvisible="false" class="inputControl1">\n\t\t\t\t\t\t\t<layout:content>\n\t\t\t\t\t\t\t\t<Label text="{i18n>LBL_OD_MAINCONTACT}" design="Bold" />\n\t\t\t\t\t\t\t\t<Link id="mainContactName" wrapping="true" press="toContactApp" />\n\t\t\t\t\t\t\t\t<Link id="mcEmail" visible="false" press="pressLinkToEmailOrCall" />\n\t\t\t\t\t\t\t\t<Link id="mcPhone" visible="false" press="pressLinkToEmailOrCall" />\n\t\t\t\t\t\t\t</layout:content>\n\t\t\t\t\t\t</layout:VerticalLayout>\n\n\t\t\t\t\t\t<!-- Employee Responsible of Opportunity -->\n\t\t\t\t\t\t<layout:VerticalLayout id="empResp" visible="false"\n\t\t\t\t\t\t\tclass="inputControl1">\n\t\t\t\t\t\t\t<layout:content>\n\t\t\t\t\t\t\t\t<Label text="{i18n>LBL_OD_EMPLRESP}" design="Bold" />\n\t\t\t\t\t\t\t\t<Text id="empRespName" />\n\t\t\t\t\t\t\t\t<Link id="empRespEmail" visible="false" press="pressLinkToEmailOrCall" />\n\t\t\t\t\t\t\t\t<Link id="empRespPhone" visible="false" press="pressLinkToEmailOrCall" />\n\t\t\t\t\t\t\t</layout:content>\n\t\t\t\t\t\t</layout:VerticalLayout>\n\n\t\t\t\t\t\t<!-- Start Date & Closing Date -->\n\t\t\t\t\t\t<Label text="{i18n>LBL_OD_STARTDATE}" design="Bold" class="inputControl1" />\n\t\t\t\t\t\t<Input id="d1" width="250px" enabled="false" class="inputControl"\n\t\t\t\t\t\t\tchange="checkChange" />\n\t\t\t\t\t\t<Label text="{i18n>LBL_OD_ENDDATE}" design="Bold" />\n\t\t\t\t\t\t<Input id="d2" width="250px" enabled="false" class="inputControl"\n\t\t\t\t\t\t\tchange="checkChange2" />\n\n\n\t\t\t\t\t\t<!-- Expected Revenue & Weighted Revenue -->\n\t\t\t\t\t\t<Label id="lbRevHeader" class="inputControl1"\n\t\t\t\t\t\t\ttext="{i18n>LBL_OD_EXPECTEDREVENUEHEADER}" design="Bold" />\n\t\t\t\t\t\t<Label id="lblExpRev" text="{i18n>LBL_OD_EXPECTEDREVENUE}"\n\t\t\t\t\t\t\tlabelFor="currText" />\n\t\t\t\t\t\t<Input id="expRevId" change="lookForChange" width="250px"\n\t\t\t\t\t\t\tenabled="false" class="inputControl" />\n\n\t\t\t\t\t\t<Label id="lblWgtRev" text="{i18n>LBL_OD_WEIGHTEDREVENUE}" />\n\t\t\t\t\t\t<Input id="wgtRevId" width="250px" enabled="false" class="inputControl" />\n\n\t\t\t\t\t\t<!-- Forecast Relevance -->\n\t\t\t\t\t\t<layout:HorizontalLayout>\n\t\t\t\t\t\t\t<layout:content>\n\t\t\t\t\t\t\t\t<Label text="{i18n>LBL_OD_FORECASTRELEVANCE}" class="switchLbl"\n\t\t\t\t\t\t\t\t\tdesign="Bold" />\n\t\t\t\t\t\t\t\t<Switch enabled="false" id="forecastId" />\n\t\t\t\t\t\t\t</layout:content>\n\t\t\t\t\t\t</layout:HorizontalLayout>\n\n\t\t\t\t\t\t<!-- Chance of Success -->\n\t\t\t\t\t\t<Label text="{i18n>LBL_OD_CHANCEOFSUCCESS}" design="Bold" />\n\t\t\t\t\t\t<Input id="chanceOfSucc" enabled="false" width="250px"\n\t\t\t\t\t\t\tclass="inputControl" />\n\n\t\t\t\t\t\t<!-- Sales Stage DDLB -->\n\t\t\t\t\t\t<Label text="{i18n>LBL_OD_SALESSTAGE}" design="Bold" />\n\t\t\t\t\t\t<Input id="salesStage" enabled="false" width="250px" />\n\n\t\t\t\t\t\t<!-- Status DDLB -->\n\t\t\t\t\t\t<Label text="{i18n>LBL_OD_STATUS}" design="Bold" />\n\t\t\t\t\t\t<Input id="status" enabled="false" width="250px" />\n\t\t\t\t\t</layout:content>\n\t\t\t\t</layout:VerticalLayout>\n\t\t\t\t<!-- Add fields to the end of the Opportunity popover -->\n\t\t\t\t<core:ExtensionPoint name="extOpportunityPopoverEnd"></core:ExtensionPoint>\n\t\t\t</content>\n\t\t</Page>\n\t</content>\n\n\t<footer>\n\t\t<Bar>\n\t\t\t<contentRight>\n\t\t\t\t<Button text="{i18n>BTN_CL_CLOSE}" press="closePopover" />\n\t\t\t</contentRight>\n\t\t</Bar>\n\t</footer>\n</Popover>',
	"cus/crm/ppm/mgr/view/S1.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("sap.ca.ui.message.message");

sap.ca.scfld.md.controller.BaseFullscreenController
		.extend(
				"cus.crm.ppm.mgr.view.S1",
				{
					// Controller Methods - onInit
					onInit : function() {
						sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit
								.call(this);
						this._initControllerVariables();
						var oDevice = sap.ui.Device, oBrowser = oDevice.browser;
						// WAVE 4 EHANCEMENT
						if (this.getServiceVersion() == 1
								&& this.getServiceSchemaVersion() >= 2) {
							var oChartChange = this.getView().byId("sSP2");
							var oItem = new sap.ui.core.ListItem("liBarChart",
									{
										key : "BarChart",
										text : this.oBundle
												.getText("BTN_SELECT_BARCHART")
									});
							oChartChange.addItem(oItem);
							if (this._bIsRTL && !oDevice.system.phone)
								this.getView().byId("fvbChart")._oChartPopover
										.attachAfterOpen(jQuery.proxy(
												this._checkForPopoverArrow,
												this));
						}

						this.loaddata();
						if (oBrowser.BROWSER.INTERNET_EXPLORER == oBrowser.name
								&& oBrowser.version < 10) {
							var oSliderLayout = this.getView().byId(
									"opportunitySlider");
							oSliderLayout.removeStyleClass("alignRight");
							oSliderLayout.addStyleClass("alignRightIE9");
						}
						this._initializeAllControllerFragments();
						sap.ui.getCore().byId("dlSalesPeriodSet")
								.addStyleClass("sapcrmMDialogCont");
						sap.ui.getCore().byId("poPage").addStyleClass(
								"sapUiStdPage");
						this.byId("page").addStyleClass("sapUiStdPage");
						this.byId("objectStatus").addStyleClass("boldText");

						// Changes for no text selection on controls
						this.disableTextSelection();
						window.addEventListener("orientationchange",
								function() {
									if (sap.ui.getCore().byId("po").isOpen())
										sap.ui.getCore().byId("po").close();

								}, false);
						this.filteredOpportunities = this.Opportunities
								.slice(0);
						this.OpportunitiesAll_chart = this.Opportunities
								.slice(0);
					},

					// Introduced this method to work with UI5 1.22.0 onwards
					_initControllerVariables : function() {
						this.oBundle = this.oApplicationFacade
								.getResourceBundle();
						this.oDataModel = this.oApplicationFacade
								.getODataModel();
						this._iServiceSchemaVersion = this
								._getServiceSchemaVersion(this.oDataModel,
										"Opportunity");
						this._iServiceVersion = this._getServiceVersion(
								this.oDataModel, "Opportunity");
						// Changes for Bar Graph
						this.data = {
							results : []
						};
						this.filteredData = {
							results : []
						};
						this.graphDataToShow = {
							results : []
						};
						this.oApplicationFacade.oApplicationImplementation.oCurController.FullCtrl = this;
						this.viewType = {};
						this.ptGroup = {};
						this.ptGroup_chart = {};
						this.filteredOpportunities = false;
						this.OpportunitiesAll_chart = false;
						this.reRenderTopNSlider = true;
						this._bIsRTL = sap.ui.getCore().getConfiguration()
								.getRTL();
					},

					// Controller Methods - onBeforeRendering
					onBeforeRendering : function() {
						this.defineButtons();
						this.calculateProgress();
					},

					disableTextSelection : function() {
						// View Controls
						this.getView().byId('page').allowTextSelection(false);
						this.getView().byId('objectHeader').allowTextSelection(
								false);
						// Opportunity Popover Details
						sap.ui.getCore().byId('po').allowTextSelection(false);
						// Settings Dialog
						sap.ui.getCore().byId('dlAppSettings')
								.allowTextSelection(false);
						// Salse Target Dialog
						sap.ui.getCore().byId('dlSalesPeriodSet')
								.allowTextSelection(false);
						// TOP N Slider
						sap.ui.getCore().byId('popup')
								.allowTextSelection(false);
					},

					// Controller Methods - onExit
					onExit : function() {
						this._destroyAllControllerFragments();
						if (this._bIsRTL && !sap.ui.Device.system.phone)
							this.getView().byId("fvbChart")._oChartPopover
									.detachAfterOpen(jQuery.proxy(
											this._checkForPopoverArrow, this));
						// May work in Main.controller.js
						if (sap.ui.getCore().byId("liBarChart"))
							sap.ui.getCore().byId("liBarChart").destroy();
					},

					getServiceVersion : function() {
						return this._iServiceVersion;
					},

					getServiceSchemaVersion : function() {
						return this._iServiceSchemaVersion;
					},

					_getEntityAnnotation : function(oModel, sAnnotationName,
							sEntityName) {
						// retrieve the metadata of the passed OData model
						var oModelMetadata = oModel.getServiceMetadata();
						// check for proper metadata structure
						if (oModelMetadata
								&& oModelMetadata.dataServices
								&& oModelMetadata.dataServices.schema
								&& oModelMetadata.dataServices.schema.length > 0
								&& oModelMetadata.dataServices.schema[0].entityType) {
							var aEntityTypes = oModelMetadata.dataServices.schema[0].entityType;
							for ( var i = -1, oCurEntity; oCurEntity = aEntityTypes[++i];)
								if (sEntityName === oCurEntity.name
										&& oCurEntity.extensions)
									for ( var j = -1, oCurExtn; oCurExtn = oCurEntity.extensions[++j];)
										if (oCurExtn.name === sAnnotationName)
											return oCurExtn.value;
						}
						return null;
					},

					_getServiceSchemaVersion : function(oModel, sEntityName) {
						var version = this._getEntityAnnotation(oModel,
								"service-schema-version", sEntityName);
						// defaults to initial service schema version (1)
						return (version != null) ? parseInt(version) : 1;
					},

					_getServiceVersion : function(oModel, sEntityName) {
						var version = this._getEntityAnnotation(oModel,
								"service-version", sEntityName);
						// defaults to initial service version (1)
						return (version != null) ? parseInt(version) : 1;
					},

					/*
					 * FIORI WAVE 2 - Branch : Rel - 1.0 START of INITAL
					 * DEVELOPMENT for TrackSalesPipeline
					 */

					defineButtons : function() {
						var oAppSettings = new sap.m.Button("acButAppS", {
							press : jQuery.proxy(this.selectActSetting, this),
							icon : "sap-icon://settings",
							text : this.oBundle.getText("BTN_APPSETTINGS"),
						});
						if (sap.ui.version < "1.19.0") {
							var oSettingsButton = null;
							var oFB = this.getView().byId("masterFooter");
							oFB.destroyContentLeft();
							oSettingsButton = sap.ushell.services.AppConfiguration
									.getSettingsControl();
							oSettingsButton.setText("").setWidth("");
							oSettingsButton.setMenuItems([ oAppSettings ]);
							oFB.addContentLeft(oSettingsButton);
						} else {
							// API change that is used in UI5 1.19.0 onwards
							sap.ushell.services.AppConfiguration
									.addApplicationSettingsButtons([ oAppSettings ]);
						}
					},

					// Error Handling method for All oData calls
					showErrorMsg : function(oError, isRead) {
						var errorDetails = null, msgShown = null;
						if (oError.response) {
							errorDetails = jQuery
									.parseJSON(oError.response.body).error;
							msgShown = errorDetails.message.value;
						} else
							msgShown = oError.message;
						sap.ca.ui.message.showMessageBox({
							type : sap.ca.ui.message.Type.ERROR,
							message : msgShown
						});
					},

					// READ all the Services using BATCH - App Settings,
					// Periodicity Texts, Time Intervals, Year Ranges,
					// Currencies
					batchRead : function() {
						var that = this;
						var oModel = this.oDataModel;
						var aReadOp = [
								oModel.createBatchOperation(
										"SalesPipelineSettings", "GET"),
								oModel.createBatchOperation("PeriodicityTexts",
										"GET"),
								oModel.createBatchOperation("TimeIntervals",
										"GET"),
								oModel
										.createBatchOperation("YearRanges",
												"GET"),
								oModel
										.createBatchOperation("Currencies",
												"GET"),
								oModel.createBatchOperation("Opportunities",
										"GET"),
								oModel.createBatchOperation("UserStatusCodes",
										"GET") ];

						// Applicable from WAVE 4 onwards
						if (this.getServiceVersion() == 1
								&& this.getServiceSchemaVersion() >= 2) {
							aReadOp.push(oModel.createBatchOperation(
									"OrganizationSalesTargets", "GET"));
							aReadOp.push(oModel.createBatchOperation(
									"SalesStages", "GET"));
						}
						oModel.addBatchReadOperations(aReadOp);
						oModel.setHeaders({
							"X-REQUESTED-WITH" : "XMLHttpRequest"
						});
						var fnSuccess = function(odata, response) {
							var batchResults = odata.__batchResponses;
							for ( var btIdx = 0; btIdx < batchResults.length; btIdx++) {
								if (parseInt(batchResults[btIdx].statusCode) !== 200) {
									that
											.showErrorMsg(batchResults[btIdx],
													true);
									break;
								}
								var currentData = batchResults[btIdx].data.results;
								var jModel = new sap.ui.model.json.JSONModel();
								switch (btIdx) {
								case 0:
									currentData[0].STP2 = currentData[0].SalesTargetPeriodicity;
									jModel.setData(currentData[0]);
									that.getView().setModel(jModel,
											"SalesPipelineSetting");
									that.SalesPipelineSetting = currentData[0];
									that.copysetting("SettingsForDisplay");
									var oChartSim = that.getView().byId(
											"chart_sim");
									oChartSim
											.setMaxBubbleValue(currentData[0].OpportunityMaxValue);
									oChartSim
											.setMinBubbleValue(currentData[0].OpportunityMinValue);
									oChartSim
											.setBubbleStepValue(currentData[0].OpportunityStepValue);
									break;
								case 1:
									jModel.setData(currentData);
									that.getView().setModel(jModel,
											"PeriodicityTexts");
									break;
								case 2:
									var TimeIntervalsTemp = currentData;
									var TimeIntervalsData = TimeIntervalsTemp;
									if (TimeIntervalsTemp.length > 100) {
										TimeIntervalsData = [];
										var r = 0;
										for ( var l = 0; l < TimeIntervalsTemp.length; l += 2) {
											TimeIntervalsData[r] = TimeIntervalsTemp[l];
											r++;
										}
										TimeIntervalsData[r] = TimeIntervalsTemp[TimeIntervalsTemp.length - 1];
									}
									jModel.setData(TimeIntervalsData);
									that.getView().setModel(jModel,
											"TimeIntervals");
									var labelsTexts = [];
									var labelsValues = [];
									var TimeIntervals = that.getView()
											.getModel("TimeIntervals").oData;

									var sliderValues = {
										"value" : "",
										"value2" : ""
									};
									var oChartSim = that.getView().byId(
											"chart_sim");
									var salesSettings = that.getView()
											.getModel('SalesPipelineSetting').oData;

									var peroidcity = salesSettings.SalesTargetPeriodicity;
									if (TimeIntervals.length == 1) {
										sliderValues.value = 0;
										sliderValues.value2 = TimeIntervals.length - 1;
										if (sliderValues.value2 == 0) {
											sliderValues.value2 = 1;
											TimeIntervals
													.push(TimeIntervals[0]);
											jModel.setData(TimeIntervals);
											that.getView().setModel(jModel,
													"TimeIntervals");
										}
										var jMod2 = new sap.ui.model.json.JSONModel(
												sliderValues);
										that.getView().setModel(jMod2,
												"sliderValue");

										for ( var i = 0, j = TimeIntervals.length; i < j; i++) {
											labelsTexts[i] = TimeIntervals[i].Label;
											labelsValues[i] = TimeIntervals[i].TimeFrom;
										}
										oChartSim.setXStart(labelsValues[0]);
										oChartSim
												.setXEnd(TimeIntervals[TimeIntervals.length - 1].TimeTo);
									} else {
										var currentDate = new Date(), j = 0;
										currentDate.setHours(0);
										currentDate.setMinutes(0);
										currentDate.setSeconds(0);
										currentDate.setMilliseconds(0);
										currentDate = cus.crm.ppm.mgr.util.formatter
												.convFromSixZeros(currentDate);
										if (TimeIntervalsTemp.length > 100) {
											for (; j < TimeIntervalsTemp.length - 1; j++) {
												if ((currentDate >= TimeIntervalsTemp[j].TimeFrom)
														&& (currentDate <= TimeIntervalsTemp[j].TimeTo)) {
													break;
												}
											}
											j = parseInt(j / 2);
										} else {
											for (; j < TimeIntervals.length - 1; j++) {
												if ((currentDate >= TimeIntervals[j].TimeFrom)
														&& (currentDate <= TimeIntervals[j].TimeTo)) {
													break;
												}
											}
										}
										if (j == TimeIntervals.length - 1) {
											if (currentDate.getFullYear() < new Date(
													TimeIntervals[1].TimeFrom)
													.getFullYear()) {
												j = 0;
											}
											if (currentDate.getFullYear() > new Date(
													TimeIntervals[1].TimeFrom)
													.getFullYear()) {
												switch (peroidcity) {
												case "1":
													j = TimeIntervals.length - 5;
													break;
												case "2":
													j = TimeIntervals.length - 4;
													break;
												case "3":
													j = TimeIntervals.length - 2;
													break;
												case "4":
													j = TimeIntervals.length - 2;
													break;
												}
											}
										}

										sliderValues.value = j;
										switch (peroidcity) {
										case "1":
											sliderValues.value2 = j + 4;
											break;
										case "2":
											sliderValues.value2 = j + 3;
											break;
										case "3":
											sliderValues.value2 = j + 1;
											break;
										case "4":
											sliderValues.value2 = j + 1;
											break;
										}
										if (sliderValues.value2 >= TimeIntervals.length) {
											sliderValues.value2 = TimeIntervals.length - 1;
											switch (peroidcity) {
											case "1":
												sliderValues.value = TimeIntervals.length - 5;
												break;
											case "2":
												sliderValues.value = TimeIntervals.length - 4;
												break;
											case "3":
												sliderValues.value = TimeIntervals.length - 2;
												break;
											case "4":
												sliderValues.value = TimeIntervals.length - 2;
												break;
											}
										}
										if (sliderValues.value2 == sliderValues.value) {
											sliderValues.value2 = sliderValues.value + 1;
											TimeIntervals
													.push(TimeIntervals[sliderValues.value]);
											jModel.setData(TimeIntervals);
											that.getView().setModel(jModel,
													"TimeIntervals");
										}
										for ( var i = sliderValues.value; i <= sliderValues.value2; i++) {
											labelsTexts[i - sliderValues.value] = TimeIntervals[i].Label;
											labelsValues[i - sliderValues.value] = TimeIntervals[i].TimeFrom;
											if (i == sliderValues.value)
												oChartSim
														.setXStart(TimeIntervals[i].TimeFrom);
											if (i == sliderValues.value2)
												oChartSim
														.setXEnd(TimeIntervals[i].TimeTo);
										}
									}

									that.getView().setModel(
											new sap.ui.model.json.JSONModel(
													sliderValues),
											"sliderValues");
									that.getView().byId("name").setValue(
											sliderValues.value);
									that.getView().byId("name").setValue2(
											sliderValues.value2);

									that.getView().setModel(
											new sap.ui.model.json.JSONModel(
													labelsValues),
											"xLabelValues");

									that
											.getView()
											.setModel(
													new sap.ui.model.json.JSONModel(
															labelsTexts),
													"xLabelTexts");
									break;
								case 3:
									jModel.setData(currentData);
									that.getView().setModel(jModel,
											"YearRanges");
									break;
								case 4:
									jModel.setData(currentData);
									that.getView().setModel(jModel,
											"CurrencyList");
									break;
								case 5:
									jModel.setData(currentData);
									that.getView().setModel(jModel,
											"Opportunities");
									that.Opportunities = currentData;
									// that.copyOpportunities("OpportunitiesOld");
									break;
								case 6:
									for ( var i = 0; i < currentData.length; i++) {
										var item = currentData[i];
										if (!that.ptGroup[item.ProcessType]) {
											that.ptGroup[item.ProcessType] = new Object(
													{
														"StatusProfile" : "",
														"StatusCodes" : [],
														"BusinessTxn" : [],
													});
											that.ptGroup[item.ProcessType].StatusProfile = item.StatusProfile;
										}
										that.ptGroup[item.ProcessType].StatusCodes
												.push(item.StatusCode);
										that.ptGroup[item.ProcessType].BusinessTxn
												.push(item.BusinessTcode);
									}
									break;
								case 7:
									jModel.setData(currentData);
									that.getView().setModel(jModel,
											"OrganizationSalesTargets");
									that.OrganizationSalesTargets = currentData;
									// that.copyOpportunities("OpportunitiesOld");
									break;
								case 8:
									for ( var i = 0; i < currentData.length; i++) {
										var item = currentData[i];
										if (!that.ptGroup_chart[item.ProcessType]) {
											that.ptGroup_chart[item.ProcessType] = new Object(
													{
														"ProcessType" : "",
														"SalesStage" : []
													});
											that.ptGroup_chart[item.ProcessType].ProcessType = item.ProcessType;
										}
										that.ptGroup_chart[item.ProcessType].SalesStage
												.push(item);
									}
									break;
								}
							}
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						oModel.refreshSecurityToken();
						oModel.submitBatch(fnSuccess, fnError, false);
					},

					// Load all application-specific Data
					loaddata : function() {
						// this.LoadSalesPipelineSettings(false);
						// this.LoadPeriodicityTexts(false);
						// this.LoadTimeIntervals(false);
						// this.LoadYearRanges(false);
						// this.LoadCurrencyList(false);
						// this.LoadOpportunities(false);
						this.batchRead();
						this.LoadFacetFilter();
						this.setMinMax();

						var yValues = null, yTexts = null;
						if (sap.ui.Device.system.phone) {
							yValues = new sap.ui.model.json.JSONModel([ 0, 50,
									100 ]);
							yTexts = new sap.ui.model.json.JSONModel([ "0%",
									"50%", "100%" ]);
						} else {
							var aValues = [ 0, 20, 40, 60, 80, 100 ];
							var aTexts = [ "0%", "20%", "40%", "60%", "80%",
									"100%" ];
							yValues = new sap.ui.model.json.JSONModel(aValues);
							yTexts = new sap.ui.model.json.JSONModel(aTexts);
						}
						this.getView().setModel(yValues, "yLabelValues");
						this.getView().setModel(yTexts, "yLabelTexts");
					},

					// Copy application settings data for the user
					copysetting : function(modelname) {
						var settings = new Object({});
						settings = this.getView().getModel(
								"SalesPipelineSetting").oData;
						var jModel = new sap.ui.model.json.JSONModel(settings);
						if (modelname == "SettingsForDisplay")
							jModel
									.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);

						this.getView().setModel(jModel, modelname);
					},

					// Single Service READ - Application Settings
					LoadSalesPipelineSettings : function(bSync) {
						var that = this;
						this.SalesPipelineSetting = false;
						var fnSuccess = function(odata, response) {
							odata.results[0].STP2 = that.viewType;
							var jModel = new sap.ui.model.json.JSONModel(
									odata.results[0]);

							that.getView().setModel(jModel,
									"SalesPipelineSetting");
							that.SalesPipelineSetting = odata.results[0];
							that.copysetting("SettingsForDisplay");
							var oChartSim = that.getView().byId("chart_sim");

							oChartSim
									.setMaxBubbleValue(odata.results[0].OpportunityMaxValue);

							oChartSim
									.setMinBubbleValue(odata.results[0].OpportunityMinValue);
							oChartSim
									.setBubbleStepValue(odata.results[0].OpportunityStepValue);
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						this.oDataModel.read("SalesPipelineSettings", null,
								null, bSync, fnSuccess, fnError);
					},

					// Single Service READ - Opportunities
					LoadOpportunities : function(bSync) {
						var that = this;
						this.Opportunities = false;
						var fnSuccess = function(odata, response) {
							var jModel = new sap.ui.model.json.JSONModel(
									odata.results);
							that.getView().setModel(jModel, "Opportunities");
							that.Opportunities = odata.results;
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						this.oDataModel.read("Opportunities", null, null,
								bSync, fnSuccess, fnError);
					},

					// Single Service READ - Time Intervals
					LoadTimeIntervals : function(bSync, peroidcity) {
						var that = this;
						this.TimeIntervals = false;
						var filter = null;
						if (peroidcity) {
							filter = [];
							filter[0] = "$filter=PeriodicityType eq '"
									+ peroidcity + "'";
						}
						var fnSuccess = function(odata, response) {
							var TimeIntervalsTemp = odata.results;
							var TimeIntervalsData = TimeIntervalsTemp;
							if (TimeIntervalsTemp.length > 100) {
								TimeIntervalsData = [];
								var r = 0;
								for ( var l = 0; l < TimeIntervalsTemp.length; l = l + 2) {
									TimeIntervalsData[r] = TimeIntervalsTemp[l];
									r++;
								}
								TimeIntervalsData[r] = TimeIntervalsTemp[TimeIntervalsTemp.length - 1];
							}
							var jModel = new sap.ui.model.json.JSONModel(
									TimeIntervalsData);
							that.getView().setModel(jModel, "TimeIntervals");
							var labelsTexts = [];
							var labelsValues = [];

							var TimeIntervals = that.getView().getModel(
									"TimeIntervals").oData;

							var sliderValues = {
								"value" : "",
								"value2" : ""
							};
							var oChartSim = that.getView().byId("chart_sim");
							if (TimeIntervals.length == 1) {
								sliderValues.value = 0;
								sliderValues.value2 = TimeIntervals.length - 1;
								if (sliderValues.value2 == 0) {
									sliderValues.value2 = 1;
									TimeIntervals.push(TimeIntervals[0]);
									jModel.setData(TimeIntervals);
									that.getView().setModel(jModel,
											"TimeIntervals");
								}
								var jMod2 = new sap.ui.model.json.JSONModel(
										sliderValues);
								that.getView().setModel(jMod2, "sliderValue");

								for ( var i = 0, j = TimeIntervals.length; i < j; i++) {
									labelsTexts[i] = TimeIntervals[i].Label;
									labelsValues[i] = TimeIntervals[i].TimeFrom;
								}
								oChartSim.setXStart(labelsValues[0]);
								oChartSim
										.setXEnd(TimeIntervals[TimeIntervals.length - 1].TimeTo);
							} else {
								var currentDate = new Date(), j = 0;
								currentDate.setHours(0);
								currentDate.setMinutes(0);
								currentDate.setSeconds(0);
								currentDate.setMilliseconds(0);
								currentDate = cus.crm.ppm.mgr.util.formatter
										.convFromSixZeros(currentDate);
								if (TimeIntervalsTemp.length > 100) {
									for (; j < TimeIntervalsTemp.length - 1; j++) {
										if ((currentDate >= TimeIntervalsTemp[j].TimeFrom)
												&& (currentDate <= TimeIntervalsTemp[j].TimeTo)) {
											break;
										}
									}
									j = parseInt(j / 2);
								} else {
									for (; j < TimeIntervals.length - 1; j++) {
										if ((currentDate >= TimeIntervals[j].TimeFrom)
												&& (currentDate <= TimeIntervals[j].TimeTo)) {
											break;
										}
									}
								}
								if (j == TimeIntervals.length - 1) {
									if (currentDate.getFullYear() < new Date(
											TimeIntervals[1].TimeFrom)
											.getFullYear()) {
										j = 0;
									}
									if (currentDate.getFullYear() > new Date(
											TimeIntervals[1].TimeFrom)
											.getFullYear()) {
										switch (peroidcity) {
										case "1":
											j = TimeIntervals.length - 5;
											break;
										case "2":
											j = TimeIntervals.length - 4;
											break;
										case "3":
											j = TimeIntervals.length - 2;
											break;
										case "4":
											j = TimeIntervals.length - 2;
											break;
										}
									}
								}

								sliderValues.value = j;
								switch (peroidcity) {
								case "1":
									sliderValues.value2 = j + 4;
									break;
								case "2":
									sliderValues.value2 = j + 3;
									break;
								case "3":
									sliderValues.value2 = j + 1;
									break;
								case "4":
									sliderValues.value2 = j + 1;
									break;
								}
								if (sliderValues.value2 >= TimeIntervals.length) {
									sliderValues.value2 = TimeIntervals.length - 1;
									switch (peroidcity) {
									case "1":
										sliderValues.value = TimeIntervals.length - 5;
										break;
									case "2":
										sliderValues.value = TimeIntervals.length - 4;
										break;
									case "3":
										sliderValues.value = TimeIntervals.length - 2;
										break;
									case "4":
										sliderValues.value = TimeIntervals.length - 2;
										break;
									}
								}
								if (sliderValues.value2 == sliderValues.value) {
									sliderValues.value2 = sliderValues.value + 1;
									TimeIntervals
											.push(TimeIntervals[sliderValues.value]);
									jModel.setData(TimeIntervals);
									that.getView().setModel(jModel,
											"TimeIntervals");
								}
								for ( var i = sliderValues.value; i <= sliderValues.value2; i++) {
									labelsTexts[i - sliderValues.value] = TimeIntervals[i].Label;
									labelsValues[i - sliderValues.value] = TimeIntervals[i].TimeFrom;
									if (i == sliderValues.value)
										oChartSim
												.setXStart(TimeIntervals[i].TimeFrom);
									if (i == sliderValues.value2)
										oChartSim
												.setXEnd(TimeIntervals[i].TimeTo);
								}
							}

							jModel = new sap.ui.model.json.JSONModel(
									sliderValues);
							that.getView().setModel(jModel, "sliderValues");

							that.getView().byId("name").setValue(
									sliderValues.value);
							that.getView().byId("name").setValue2(
									sliderValues.value2);

							jModel = new sap.ui.model.json.JSONModel(
									labelsValues);
							that.getView().setModel(jModel, "xLabelValues");

							jModel = new sap.ui.model.json.JSONModel(
									labelsTexts);
							that.getView().setModel(jModel, "xLabelTexts");
							that.TimeIntervals = true;
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						this.oDataModel.read("TimeIntervals", null, filter,
								bSync, fnSuccess, fnError);

					},

					// Single Service READ - Periodicity Texts
					LoadPeriodicityTexts : function(bSync) {
						var that = this;
						var fnSuccess = function(odata, response) {
							var jModel = new sap.ui.model.json.JSONModel(
									odata.results);
							that.getView().setModel(jModel, "PeriodicityTexts");
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						this.oDataModel.read("PeriodicityTexts", null, null,
								bSync, fnSuccess, fnError);
					},

					// Single Service READ - Year Ranges
					LoadYearRanges : function(bSync) {
						var that = this;
						var fnSuccess = function(odata, response) {
							var jModel = new sap.ui.model.json.JSONModel(
									odata.results);
							that.getView().setModel(jModel, "YearRanges");
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						this.oDataModel.read("YearRanges", null, null, true,
								fnSuccess, fnError);
					},

					// Single Service READ - Currencies
					LoadCurrencyList : function(bSync) {
						var that = this;
						var fnSuccess = function(odata, response) {
							var jModel = new sap.ui.model.json.JSONModel(
									odata.results);
							that.getView().setModel(jModel, "CurrencyList");
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						this.oDataModel.read("Currencies", null, null, true,
								fnSuccess, fnError);
					},

					// GENERIC FILTER initialization that can be used by
					// Customer when adding data to NEW FACET FILTER
					_initValuesToFacetFilter : function(aFilteredArr, iIndex,
							Opportunities, sId, sName) {
						var oCurrObject = new Object(), bNewArrValue = true;
						for ( var j = -1, oFilteredObj; oFilteredObj = aFilteredArr[++j];)
							if (oFilteredObj.Id == Opportunities[iIndex][sId]) {
								oFilteredObj.Opportunities
										.push(Opportunities[iIndex]);
								bNewArrValue = false;
								break;
							}
						if (bNewArrValue) {
							oCurrObject.Name = Opportunities[iIndex][sName];
							if (oCurrObject.Name == "")
								oCurrObject.Name = this.oBundle
										.getText("LBL_OTHERS");
							oCurrObject.Id = Opportunities[iIndex][sId];
							oCurrObject.Opportunities = [];
							oCurrObject.Opportunities
									.push(Opportunities[iIndex]);
							aFilteredArr.push(oCurrObject);
						}
					},

					// BIND the FACET FILTER DATA generically
					_bindFacetFilterData : function(oFacetFilterData,
							oControllerObj, sModelName, sKey, fnClose) {
						var jModel = new sap.ui.model.json.JSONModel(
								oFacetFilterData);
						// "{/name}", "/values", "{Name}", "{Id}",
						oControllerObj = new sap.m.FacetFilterList({
							title : "{" + sModelName + ">/name}",
							key : sKey,
							items : {
								path : sModelName + ">/values",
								template : new sap.m.FacetFilterItem({
									text : "{" + sModelName + ">Name}",
									key : "{" + sModelName + ">Id}"
								})
							}
						});
						oControllerObj.setModel(jModel, sModelName);
						this.byId("facetFilter").addList(oControllerObj);
						oControllerObj.attachListClose(jQuery.proxy(fnClose,
								this));
					},

					LoadFacetFilter : function() {
						this.byId("facetFilter").removeAllLists();
						// var Opportunities = this.Opportunities;
						var Opportunities = this.getView().getModel(
								"Opportunities").getData();
						this.OpportunitiesAllForFacetFilter = Opportunities;

						// Load INITAL set of Facet Filters
						// a. Employees Responsible
						var EmployeeResponsiblesData = [], AccountsData = [], OrgData = [];
						for ( var i = 0; i < Opportunities.length; i++)
							this._initValuesToFacetFilter(
									EmployeeResponsiblesData, i, Opportunities,
									"EmployeeID", "EmployeeName");
						var DataEmployeeResponsible = {
							name : this.oBundle.getText("EMPLOYEE_RESPONSIBLE"),
							values : EmployeeResponsiblesData
						};
						this._bindFacetFilterData(DataEmployeeResponsible,
								this.oFacetListEmployeeResponsibles, "EmpResp",
								"emp_responsible", this.closeListEmployees);

						// var oModelEmployeeResponsibles = new
						// sap.ui.model.json.JSONModel(
						// DataEmployeeResponsible);
						// this.oFacetListEmployeeResponsibles = new
						// sap.m.FacetFilterList(
						// {
						// title : "{EmpReponsible>/name}",
						// key : "emp_responsible",
						// items : {
						// path : "EmpResp>/values",
						// template : new sap.m.FacetFilterItem({
						// text : "{EmpResp>Name}",
						// key : "{EmpResp>Id}"
						// })
						// }
						// });
						// this.oFacetListEmployeeResponsibles.setModel(
						// oModelEmployeeResponsibles, "EmpResp");
						// this.byId("facetFilter").addList(
						// this.oFacetListEmployeeResponsibles);
						// this.oFacetListEmployeeResponsibles
						// .attachListClose(jQuery.proxy(
						// this.closeListEmployees, this));

						// Load INITAL set of Facet Filters
						// b. Accounts
						for ( var i = 0; i < Opportunities.length; i++)
							this._initValuesToFacetFilter(AccountsData, i,
									Opportunities, "AccountID", "AccountName");
						var DataAccounts = {
							name : this.oBundle.getText("ACCOUNTS"),
							values : AccountsData
						};
						this._bindFacetFilterData(DataAccounts,
								this.oFacetListAccounts, "OppAccount",
								"accounts", this.closeListAccounts);

						// Load INITAL set of Facet Filters
						// c. Sales Organizations
						// WAVE 4 ENHANCEMENT
						var DataORG = {};
						if (this.getServiceVersion() == 1
								&& this.getServiceSchemaVersion() >= 2) {
							for ( var i = 0; i < Opportunities.length; i++)
								this._initValuesToFacetFilter(OrgData, i,
										Opportunities, "SalesOrganizationUnit",
										"SalesOrganizationUnitText");
							DataORG = {
								name : this.oBundle.getText("LBL_ORG"),
								values : OrgData
							};
							this._bindFacetFilterData(DataORG,
									this.oFacetListORG, "OppOrgData", "org",
									this.closeListORG);
						}

						// WAVE 3 ENHANCEMENT
						/**
						 * @ControllerHook Provision for Additional Facet
						 *                 Filters. If required, additional
						 *                 filters can be added to perform
						 *                 analysis on the Manager's Sales
						 *                 Pipeline. This is called when you
						 *                 select the Facet Filter button on the
						 *                 top-right.
						 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookAddFacetFilter
						 * @return {void}
						 */
						if (this.extHookAddFacetFilter)
							this.extHookAddFacetFilter();
					},

					// RESET the selected Filters from the existing
					// FILTER CRITERIA
					resetFunc : function(oEvent) {
						var oFF = this.byId("facetFilter");
						var aFFLists = oFF.getLists();
						for ( var i = 0; i < aFFLists.length; i++) {
							var aItems = aFFLists[i].getItems();
							for ( var j = 0; j < aItems.length; j++) {
								aItems[j].setSelected(false);
							}
							aFFLists[i].getBinding("items").filter([]);
						}
						var OpportunitiesAll = this.OpportunitiesAllForFacetFilter;
						this.filteredOpportunities = OpportunitiesAll;
						this.showTopNOpp();
						this.calculateProgress();
					},

					// Display the default set of VIEWS shown by SAP
					chartChange : function(e) {
						var key = undefined;
						if (e && e.getParameter
								&& e.getParameter('selectedItem'))
							key = e.getParameter('selectedItem').getKey();
						else
							key = this.getView().byId('sSP2').getSelectedKey();

						switch (key) {
						case "SalesPipeline":
						case "Top10Opportunities":
							this.byId("filterButton").setEnabled(true);
							this.showBubbleChart(e);
							if (key == "SalesPipeline")
								this.filteredOpportunities = this.Opportunities;
							this.showTopNOpp();
							// Already calculated in showTopNOpp
							// this.LoadFacetFilter();
							this.calculateProgress();
							break;
						case "BarChart":
							// WAVE 4 ENHANCEMENT
							// Will only execute if ListItem with key BarChart
							// is added to sSP2
							this.reRenderTopNSlider = false;
							this.byId("filterButton").setEnabled(false);
							this.showBarChart(e);
							this.resetFunc(e);
							this.getView().byId("FilterPanel")
									.setVisible(false);
							break;
						}

						// WAVE 3 ENHANCEMENT
						/**
						 * @ControllerHook Provision for Additional Views. If
						 *                 required, additional Views can be
						 *                 added to display the direct results
						 *                 of the Sales Pipeline when the view
						 *                 is selected. This is called when you
						 *                 select a value from the drop-down
						 *                 list for VIEWS.
						 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookAddViews
						 * @return {void}
						 */
						if (this.extHookAddViews)
							this.extHookAddViews();
					},

					// DISPLAY/HIDE the Facet Filters that can be used by the
					// SALES MANAGER to perform further analysis
					toggleButtons : function(e) {
						var filterPanel = this.getView().byId("FilterPanel");
						if (filterPanel.getVisible())
							filterPanel.setVisible(false);
						else
							filterPanel.setVisible(true);
					},

					// Filter based on EMPLOYEES RESPONSIBLE when the selected
					// Popover is closed
					closeListEmployees : function(oEvent) {
						// var OpportunitiesAll = that.Opportunities;
						var oFF = this.byId("facetFilter");
						var aFFLists = oFF.getLists();
						for ( var i = 0; i < aFFLists.length; i++) {
							if (aFFLists[i].getKey() == "emp_responsible")
								continue;
							var aItems = aFFLists[i].getItems();
							for ( var j = 0; j < aItems.length; j++) {
								aItems[j].setSelected(false);
							}
							aFFLists[i].getBinding("items").filter([]);

						}
						oFF.rerender();
						var OpportunitiesAll = this.OpportunitiesAllForFacetFilter;
						var selItemsLength = oEvent
								.getParameter("selectedItems").length;
						if (selItemsLength == 0) {
							var jModelAll = new sap.ui.model.json.JSONModel(
									OpportunitiesAll);
							this.getView().setModel(jModelAll, "Opportunities");
							this.filteredOpportunities = OpportunitiesAll;
							this.showTopNOpp();
							this.calculateProgress();
							return;
						}
						var Ids = [];
						for ( var i = 0; i < selItemsLength; i++)
							Ids[i] = oEvent.getParameter("selectedItems")[i]
									.getKey();
						var Opportunities = [];
						var data = oEvent.getSource().getModel("EmpResp").oData.values;
						// data = this.oFacetListEmployeeResponsibles
						// .getModel("EmpResp").oData.values;
						for ( var i = 0; i < Ids.length; i++) {
							for ( var j = 0; j < data.length; j++)
								if (Ids[i] == data[j].Id) {
									for ( var r = 0; r < data[j].Opportunities.length; r++)
										Opportunities
												.push(data[j].Opportunities[r]);

								}
						}

						this.filteredOpportunities = Opportunities;
						this.showTopNOpp();
						this.calculateProgress();
					},

					// Filter based on ACCOUNTS when the selected Popover is
					// closed
					closeListAccounts : function(oEvent) {
						// var OpportunitiesAll = that.Opportunities;
						var oFF = this.byId("facetFilter");
						var aFFLists = oFF.getLists();
						for ( var i = 0; i < aFFLists.length; i++) {
							if (aFFLists[i].getKey() == "accounts")
								continue;
							var aItems = aFFLists[i].getItems();
							for ( var j = 0; j < aItems.length; j++) {
								aItems[j].setSelected(false);
							}
							aFFLists[i].getBinding("items").filter([]);

						}
						oFF.rerender();
						var OpportunitiesAll = this.OpportunitiesAllForFacetFilter;
						var selItemsLength = oEvent
								.getParameter("selectedItems").length;
						if (selItemsLength == 0) {
							var jModelAll = new sap.ui.model.json.JSONModel(
									OpportunitiesAll);
							this.getView().setModel(jModelAll, "Opportunities");
							this.filteredOpportunities = OpportunitiesAll;
							this.showTopNOpp();
							this.calculateProgress();
							return;
						}
						var Ids = [];
						for ( var i = 0; i < selItemsLength; i++)
							Ids[i] = oEvent.getParameter("selectedItems")[i]
									.getKey();
						var Opportunities = [];
						var data = oEvent.getSource().getModel("OppAccount").oData.values;
						// data =
						// this.oFacetListAccounts.getModel().oData.values;
						for ( var i = 0; i < Ids.length; i++) {
							for ( var j = 0; j < data.length; j++)
								if (Ids[i] == data[j].Id) {
									for ( var r = 0; r < data[j].Opportunities.length; r++)
										Opportunities
												.push(data[j].Opportunities[r]);

								}
						}
						this.filteredOpportunities = Opportunities;
						this.showTopNOpp();
						this.calculateProgress();
					},

					_getBTCode : function(oOpport) {
						var oProcType = undefined, sBusinessTxn = "";
						for ( var pt in this.ptGroup)
							if (pt == oOpport.ProcessType) {
								oProcType = this.ptGroup[pt];
								break;
							}

						if (oProcType != undefined
								&& oOpport.UserStatusCode != undefined)
							for ( var j = 0; j < oProcType.StatusCodes.length; j++)
								if (oProcType.StatusCodes[j] == oOpport.UserStatusCode) {
									sBusinessTxn = oProcType.BusinessTxn[j];
									break;
								}
						return sBusinessTxn;
					},

					_getSalesStage : function(oOpport) {
						var oProcType = undefined, sStageDescription = "";
						for ( var pt in this.ptGroup_chart)
							if (pt == oOpport.ProcessType) {
								oProcType = this.ptGroup_chart[pt];
								break;
							}

						if (oProcType != undefined
								&& oOpport.SalesStageCode != undefined)
							for ( var j = 0; j < oProcType.SalesStage.length; j++)
								if (oProcType.SalesStage[j].SalesStageCode == oOpport.SalesStageCode) {
									sStageDescription = oProcType.SalesStage[j].SalesStageDescription;
									break;
								}
						return sStageDescription;
					},

					// Progress Achievement for the Sales Manager
					calculateProgress : function() {
						var SalesSettings = this.getView().getModel(
								"SalesPipelineSetting").oData;
						var SalesPeriodBegin = SalesSettings.StartOfPeriod;
						var SalesPeriodEnd = SalesSettings.EndOfPeriod;
						var oppModel = this.getView().getModel("Opportunities");
						if (oppModel != undefined) {
							var Opportunites = oppModel.oData;
							var Percentage = 0.0, Text = null, TotalActualRevenue = 0.0;
							for ( var i = 0; i < Opportunites.length; i++) {
								var isAtrue = Opportunites[i].ClosingDate >= SalesPeriodBegin;
								var isBtrue = Opportunites[i].ClosingDate <= SalesPeriodEnd;
								var isCtrue = true;
								var bTCode = this._getBTCode(Opportunites[i]);
								if (bTCode == 'LOST')
									isCtrue = false;
								if (isAtrue && isBtrue && isCtrue)
									TotalActualRevenue += ((Opportunites[i].ExpectedSalesVolume * Opportunites[i].ChanceOfSuccess) / 100);
							}

							var Pg = this.getView().byId("pg");
							var Lb = this.getView().byId("objectStatus");
							if (SalesSettings.SalesTarget > 0)
								Percentage = (TotalActualRevenue / SalesSettings.SalesTarget) * 100;
							Percentage = Math.round(Percentage);
							var utilForm = cus.crm.ppm.mgr.util.formatter;
							var valueA = 0, valueB = 0;
							if (sap.ui.Device.system.phone == true) {
								valueA = utilForm.displayTargetNumbers(Math
										.ceil(TotalActualRevenue));
								valueB = utilForm.displayTargetNumbers(Math
										.ceil(SalesSettings.SalesTarget));
							} else {
								valueA = utilForm.displayNumbers(Math
										.ceil(TotalActualRevenue));
								valueB = utilForm.displayNumbers(Math
										.ceil(SalesSettings.SalesTarget));
							}
							Text = valueA + " "
									+ this.oBundle.getText("LBL_OF") + " "
									+ valueB;
							if (Percentage >= 100)
								Pg.setPercentValue(100);
							else
								Pg.setPercentValue(Percentage);

							Pg.setDisplayValue(Percentage + "%");
							Lb.setText(Text + " (" + SalesSettings.CurrencyCode
									+ ")");
						}
					},

					// START OF DIALOGS for APP Settings
					selectActSetting : function(oEvent) {
						this.copysetting("SettingsForSave");
						var oSettingsSave = this.getView().getModel(
								"SettingsForSave"), oNewObj = {};
						oNewObj["SalesTarget"] = oSettingsSave.oData.SalesTarget;
						oNewObj["CurrencyCode"] = oSettingsSave.oData.CurrencyCode;
						oNewObj["SalesTargetPeriodicity"] = oSettingsSave.oData.SalesTargetPeriodicity;
						oNewObj["TimeFrom"] = oSettingsSave.oData.TimeFrom;
						oNewObj["TimeTo"] = oSettingsSave.oData.TimeTo;
						this.oSalesSettings = oNewObj;
						if (this.oFragmentList.salesPeriodSettings)
							this.oFragmentList.salesPeriodSettings.setModel(
									oSettingsSave, "SettingsForSave");
						this.oFragmentList.appSettings.open();
					},

					selectDlgSetting : function(oEvent) {
						this.oFragmentList.appSettings.close();
						var listSett = this.oFragmentList.appSettings
								.getContent()[0];
						if (listSett.getItems()[0].isSelected())
							this.oFragmentList.salesPeriodSettings.open();
						listSett.getSelectedItem().setSelected(false);
					},

					closeAppSettDialog : function(oEvent) {
						this.oFragmentList.appSettings.close();
					},

					navBack : function(oEvent) {
						var oSettingsSave = this.getView().getModel(
								"SettingsForSave").oData;
						oSettingsSave["SalesTarget"] = this.oSalesSettings.SalesTarget;
						oSettingsSave["CurrencyCode"] = this.oSalesSettings.CurrencyCode;
						oSettingsSave["SalesTargetPeriodicity"] = this.oSalesSettings.SalesTargetPeriodicity;
						oSettingsSave["TimeFrom"] = this.oSalesSettings.TimeFrom;
						oSettingsSave["TimeTo"] = this.oSalesSettings.TimeTo;
						sap.ui.getCore().byId("sliSaTa").setSelected(false);
						// if (sap.ui.getCore().byId("SPnavBack") ==
						// oEvent.oSource) {
						this.oFragmentList.salesPeriodSettings.close();
						this.oFragmentList.appSettings.open();
						// }
					},

					// Setting the Minimum & Maximum Opportunity Value to impose
					// UI restrictions so that it does not become unusable to
					// the Sales Manager
					setMinMax : function() {
						if (this.getView().getModel("Opportunities") != undefined) {
							var Opportunities = this.getView().getModel(
									"Opportunities").oData;
							var expRevOpp = [];
							for ( var i = 0; i < Opportunities.length; i++)
								expRevOpp
										.push(parseFloat(Opportunities[i].ExpectedSalesVolume));

							expRevOpp.sort(function(a, b) {
								return a - b;
							});

							var chart = this.byId("chart_sim");
							chart
									.setMaxBubbleValue(3 * expRevOpp[expRevOpp.length - 1]);
							chart.setMinBubbleValue(0.25 * expRevOpp[0]);
						}
					},

					// Save Application Settings for Sales Manager
					saveAppSetChange : function(oEvent) {
						var that = this, oControl = oEvent.getSource();
						this.reRenderTopNSlider = true;
						var oEntry = this.getView().getModel("SettingsForSave").oData;
						var utilForm = cus.crm.ppm.mgr.util.formatter;
						if (oControl == sap.ui.getCore().byId("spButSave")) {
							oEntry.TimeFrom = new Date(oEntry.TimeFrom);
							oEntry.TimeTo = new Date(oEntry.TimeTo);
							this.viewType = oEntry.STP2;
							delete oEntry.STP2;
							var valST = sap.ui.getCore().byId("iST").getValue();
							oEntry.SalesTarget = utilForm.reverseNumbers(valST)
									+ ".0";
							var oParams = {};
							oParams.bMerge = false;
							oParams.fnSuccess = function() {

								if (sap.ui.getCore().byId("spButSave") == oControl)
									that.oFragmentList.salesPeriodSettings
											.close();

								sap.ca.ui.message.showMessageToast(that.oBundle
										.getText("LBL_SUCCESSUPDATE"));
								that.LoadSalesPipelineSettings(false);
								that.LoadOpportunities(false);
								that.setMinMax();
								that.LoadTimeIntervals(false, that.viewType);
								if (that.getServiceVersion() == 1
										&& that.getServiceSchemaVersion() >= 2)
									that.LoadOrgData(false);
								that.chartChange();
								that.calculateProgress();
							};
							oParams.fnError = function() {
								var errMsg = that.oBundle
										.getText("LBL_FAILEDUPDATE");
								// show the erorr message in a MessageBox
								sap.ca.ui.message.showMessageBox({
									type : sap.ca.ui.message.Type.ERROR,
									message : errMsg
								});
							};
							var updateUrl = "/SalesPipelineSettings('"
									+ oEntry.UserName + "')";

							this.oDataModel.update(updateUrl, oEntry, oParams);
							this.LoadFacetFilter();
						} else {
							oEntry["SalesTarget"] = this.oSalesSettings.SalesTarget;
							oEntry["CurrencyCode"] = this.oSalesSettings.CurrencyCode;
							oEntry["SalesTargetPeriodicity"] = this.oSalesSettings.SalesTargetPeriodicity;
							oEntry["TimeFrom"] = this.oSalesSettings.TimeFrom;
							oEntry["TimeTo"] = this.oSalesSettings.TimeTo;
							this.oFragmentList.salesPeriodSettings.close();
						}
					},

					// Cancel of SAVE in Application Settings of Sales Manager
					cancelAppSetChange : function(oEvent) {
						var oSettingsSave = this.getView().getModel(
								"SettingsForSave").oData;
						oSettingsSave["SalesTarget"] = this.oSalesSettings.SalesTarget;
						oSettingsSave["CurrencyCode"] = this.oSalesSettings.CurrencyCode;
						oSettingsSave["SalesTargetPeriodicity"] = this.oSalesSettings.SalesTargetPeriodicity;
						oSettingsSave["TimeFrom"] = this.oSalesSettings.TimeFrom;
						oSettingsSave["TimeTo"] = this.oSalesSettings.TimeTo;
						if (sap.ui.getCore().byId("spButCancel") == oEvent
								.getSource())
							this.oFragmentList.salesPeriodSettings.close();
					},

					/*
					 * settCheck : function(oEvent) { var that = this; var
					 * settingVal = that.oFragmentList.salesPeriodSettings
					 * .getModel("SettingsForSave").oData; var utilForm =
					 * cus.crm.ppm.mgr.util.formatter; var dateFromVal = new
					 * Date(settingVal.TimeFrom .getFullYear(), 0, 1); var
					 * dateToVal = new Date(settingVal.TimeTo .getFullYear(),
					 * 11, 31); dateToVal =
					 * utilForm.convFromSixZeros(dateToVal); dateFromVal =
					 * utilForm.convFromSixZeros(dateFromVal); if
					 * (String(dateFromVal) != String(settingVal.TimeFrom))
					 * settingVal.TimeFrom = dateFromVal; if (String(dateToVal) !=
					 * String(settingVal.TimeTo)) settingVal.TimeTo = dateToVal;
					 * that.oFragmentList.salesPeriodSettings.getModel(
					 * "SettingsForSave").setData(settingVal); },
					 */

					TimespanChange : function(oEvent) {
						var selUiFrom = sap.ui.getCore().byId("sFrom");
						var selUiTo = sap.ui.getCore().byId("sTo");
						var timeToItems = [], timeFromItems = [];
						for ( var i = -1, c; c = selUiTo.getItems()[++i];) {
							var pVal = parseInt(c.getText());
							timeToItems.push(new Object({
								"dispText" : pVal ? pVal : c.getText(),
								"key" : c.getKey()
							}));
						}
						for ( var i = -1, c; c = selUiFrom.getItems()[++i];) {
							var pVal = parseInt(c.getText());
							timeFromItems.push(new Object({
								"dispText" : pVal ? pVal : c.getText(),
								"key" : c.getKey()
							}));
						}
						var selDispText = oEvent.getParameter("selectedItem")
								.getText();
						selDispText = parseInt(selDispText) ? parseInt(selDispText)
								: selDispText;
						if (selUiFrom == oEvent.getSource()) {
							for ( var i = 0; i < timeFromItems.length; i++)
								if (selDispText == timeFromItems[i]["dispText"])
									break;
							var otherText = selUiTo.getSelectedItem().getText();
							var selObj = new Object(
									{
										"key" : selUiTo.getSelectedKey(),
										"dispText" : parseInt(otherText) ? parseInt(otherText)
												: otherText
									});
							if (!(selDispText <= selObj["dispText"]))
								selUiTo.setSelectedKey(timeToItems[i]["key"]);
						} else {
							for ( var i = 0; i < timeToItems.length; i++)
								if (selDispText == timeToItems[i]["dispText"])
									break;
							var otherText = selUiFrom.getSelectedItem()
									.getText();
							var selObj = new Object(
									{
										"key" : selUiFrom.getSelectedKey(),
										"dispText" : parseInt(otherText) ? parseInt(otherText)
												: otherText
									});
							if (!(selObj["dispText"] <= selDispText))
								selUiFrom
										.setSelectedKey(timeFromItems[i]["key"]);
						}
					},
					// END OF DIALOGS for APP Settings

					// DUAL SLIDER Control
					dualsliderchange : function() {
						var chart = this.getView().byId("chart_sim");
						var value = arguments[0].getParameter("value");
						var value2 = arguments[0].getParameter("value2");
						var units = this.byId("name").getUnits();
						var timeinterval = this.getView().getModel(
								"TimeIntervals");
						var labelsTexts = [];
						var labelsValues = [];

						for ( var i = value; i <= value2; i++) {
							labelsTexts[i - value] = units[i].getValue();
							labelsValues[i - value] = units[i].getKey();

							if (i == value)
								chart.setXStart(units[i].getKey());
							if (i == value2)
								chart.setXEnd(timeinterval.oData[i].TimeTo);
						}
						chart.setXLabelTexts(labelsTexts);
						chart.setXLabelValues(labelsValues);
					},

					// Change the x-AXIS ticks when changing the view in
					// BUBBLE CHART
					onPeriodicityChange : function(oEvent) {
						this.LoadTimeIntervals(true, oEvent.getSource()
								.getSelectedKey());
						this.reRenderTopNSlider = true;
					},

					// START of OPPORTUNITY POPOVER
					bubbleclick : function(oEvent) {
						var that = this;
						if (!this.oFragmentList.Opportunity) {
							this.oFragmentList.Opportunity = new sap.ui.xmlfragment(
									'cus.crm.ppm.mgr.view.Opportunity', this);
							this.oFragmentList.Opportunity.setModel(this
									.getView().getModel("i18n"), "i18n");
						}

						var ec = this.oFragmentList.Opportunity;
						ec.close();
						var oModel = this.oDataModel;
						oModel.setCountSupported(false);
						var opp = this.getView().getModel("Opportunities").oData;
						this.guidVal = oEvent.getParameter('item').key;
						var pType = undefined, pCurrCode = undefined, oppSalesTeam = undefined;
						// BY Default, turn the layout visibility off for Main
						// Contact, Employee Responsible
						sap.ui.getCore().byId("mainContact").setVisible(false);
						sap.ui.getCore().byId("empResp").setVisible(false);
						var selOpp = undefined, pEmpRespName = undefined, pContactname = undefined;
						var pAccountName = undefined, pOppId = undefined, pOppDescription = undefined;
						var pSalesStage = undefined, pStatus = undefined;

						for ( var i = 0; i < opp.length; i++) {
							if (opp[i].Guid === this.guidVal) {
								selOpp = opp[i];
								pType = selOpp.ProcessType;
								pCurrCode = selOpp.CurrencyCode;
								pEmpRespName = selOpp.EmployeeName;
								pContactname = selOpp.ContactPersonName;
								this.pContactId = selOpp.ContactPersonID;
								pAccountName = selOpp.AccountName;
								this.pAccountId = selOpp.AccountID;
								pOppId = selOpp.Id;
								pOppDescription = selOpp.Description;
								pSalesStage = selOpp.SalesStageCode;
								pStatus = selOpp.UserStatusText;

								break;

							}
						}

						sap.ui.getCore().byId("OppId").setText(pOppId);
						sap.ui.getCore().byId("status").setValue(pStatus);
						sap.ui.getCore().byId("OppDescription").setText(
								pOppDescription);

						// Currency text
						var currCode = " (" + pCurrCode + ")";
						var LBexpRev = sap.ui.getCore().byId("lblExpRev");
						var LBwgtRev = sap.ui.getCore().byId("lblWgtRev");
						LBexpRev.setText(this.oBundle
								.getText("LBL_OD_EXPECTEDREVENUE")
								+ currCode);
						LBwgtRev.setText(this.oBundle
								.getText("LBL_OD_WEIGHTEDREVENUE")
								+ currCode);

						// drop down for sales stages
						var oppRead = [
								oModel
										.createBatchOperation(
												"SalesStages?$filter="
														+ jQuery.sap
																.encodeURL("ProcessType eq '"
																		+ pType
																		+ "'"),
												"GET"),
								oModel
										.createBatchOperation(
												"Opportunities(guid'"
														+ this.guidVal
														+ "')?$expand=SalesTeam",
												"GET") ];
						oModel.addBatchReadOperations(oppRead);
						oModel.setHeaders({
							"X-REQUESTED-WITH" : "XMLHttpRequest"
						});
						var stagesData = null;
						var fnS2 = function(odata, response) {
							var batchResults = odata.__batchResponses;
							for ( var i = 0; i < batchResults.length; i++) {
								if (parseInt(batchResults[i].statusCode) !== 200) {
									// var errMsg = that.oBundle
									// .getText("LBL_FAILEDREAD");
									// sap.ca.ui.message.showMessageBox({
									// type : sap.ca.ui.message.Type.ERROR,
									// message : errMsg
									// });
									that.showErrorMsg(batchResults[i], true);
									break;
								} else
									switch (i) {
									case 0:
										stagesData = {
											stageValues : batchResults[i].data.results

										};
										break;
									case 1:
										oppSalesTeam = batchResults[i].data.SalesTeam.results;
										break;
									}
							}
						};
						var fnE2 = function(oerror) {
							that.showErrorMsg(oerror, true);
						};
						oModel.submitBatch(fnS2, fnE2, false);

						var utilForm = cus.crm.ppm.mgr.util.formatter;
						sap.ui.getCore().byId("salesStage").setValue("");
						// switch value for forecast relevance
						for ( var i = 0; i < stagesData.stageValues.length; i++) {
							if (pSalesStage == stagesData.stageValues[i].SalesStageCode) {
								sap.ui
										.getCore()
										.byId("salesStage")
										.setValue(
												stagesData.stageValues[i].SalesStageDescription);
								break;
							}
						}

						if (selOpp.ForecastRelevance == "X")
							sap.ui.getCore().byId("forecastId").setState(true);
						else if (selOpp.ForecastRelevance == "")
							sap.ui.getCore().byId("forecastId").setState(false);

						// Chance of Success
						var x = parseFloat(selOpp.ChanceOfSuccess) + "%";
						sap.ui.getCore().byId("chanceOfSucc").setValue(x);
						// Start date

						var d1 = new Date(selOpp.StartDate.toDateString());
						sap.ui.getCore().byId("d1").setValue(
								utilForm.displayDates(d1));

						// End date
						var d2 = new Date(selOpp.ClosingDate.toDateString());
						sap.ui.getCore().byId("d2").setValue(
								utilForm.displayDates(d2));

						// Expected Revenue
						var expRev = sap.ui.getCore().byId("expRevId");
						expRev.setValue(utilForm
								.displayNumbers(selOpp.ExpectedSalesVolume));

						// calculating weighted revenue
						var wtRevVal = (selOpp.ExpectedSalesVolume * selOpp.ChanceOfSuccess) / 100;
						sap.ui.getCore().byId("wgtRevId").setValue(
								utilForm.displayNumbers(wtRevVal));

						// sales team data
						var aEmployeeIds = [ "empResp", "empRespName",
								"empRespEmail", "empRespPhone" ];
						var aMainContactIds = [ "mainContact",
								"mainContactName", "mcEmail", "mcPhone" ];
						// If valid names, only then show the name of Employee
						// Responsible & set phone, email visibility off by
						// default
						if (pEmpRespName != "") {
							for ( var i = -1, oEmpControl; oEmpControl = sap.ui
									.getCore().byId(aEmployeeIds[++i]);)
								switch (aEmployeeIds[i]) {
								case "empResp":
								case "empRespName":
									oEmpControl.setVisible(true);
									if (aEmployeeIds[i] === "empRespName")
										oEmpControl.setText(pEmpRespName);
									break;
								case "empRespEmail":
								case "empRespPhone":
									oEmpControl.setVisible(false);
									break;
								}
						}
						// If valid names, only then show the name of Main
						// Contact & set phone, email visibility off by default
						if (pContactname != "") {
							for ( var i = -1, oEmpControl; oEmpControl = sap.ui
									.getCore().byId(aMainContactIds[++i]);)
								switch (aMainContactIds[i]) {
								case "mainContact":
								case "mainContactName":
									oEmpControl.setVisible(true);
									if (aMainContactIds[i] === "mainContactName")
										oEmpControl.setText(pContactname);
									break;
								case "mcEmail":
								case "mcPhone":
									oEmpControl.setVisible(false);
									break;
								}
						}
						// sales team data
						if (oppSalesTeam != undefined) {
							for ( var i = -1, oSalesMember; oSalesMember = oppSalesTeam[++i];) {
								var oSMEmail = null, oSMPhone = null, iPartnerID = parseInt(oSalesMember.PartnerFuntionCode);
								switch (iPartnerID) {
								case 14:
									oSMEmail = sap.ui.getCore().byId(
											aEmployeeIds[2]);
									oSMPhone = sap.ui.getCore().byId(
											aEmployeeIds[3]);
									break;
								case 15:
									oSMEmail = sap.ui.getCore().byId(
											aMainContactIds[2]);
									oSMPhone = sap.ui.getCore().byId(
											aMainContactIds[3]);
									break;
								default:
									break;
								}
								if (iPartnerID == 14 || iPartnerID == 15) {
									if (oSalesMember.Email
											&& oSalesMember.Email != "")
										oSMEmail.setVisible(true).setText(
												oSalesMember.Email);
									if (oSalesMember.Telephone
											&& oSalesMember.Telephone != "")
										oSMPhone.setVisible(true).setText(
												oSalesMember.Telephone);
								}
							}
						}

						sap.ui.getCore().byId("accName").setText(pAccountName);
						this.selectedbubble = oEvent.getParameter('item').key;
						if (sap.ui.Device.system.phone == false) {
							var titleOpp = sap.ui.getCore().byId("poBar");
							this.overlappingBubbles = oEvent
									.getParameter('item').overlappedbubbles;
							if (this.overlappingBubbles.length > 1) {
								sap.ui.getCore().byId("upBtn").setVisible(true);
								sap.ui.getCore().byId("downBtn").setVisible(
										true);
								titleOpp.addContentLeft(sap.ui.getCore().byId(
										"oppDetails"));
								titleOpp.removeAllContentMiddle();

							} else {
								sap.ui.getCore().byId("upBtn")
										.setVisible(false);
								sap.ui.getCore().byId("downBtn").setVisible(
										false);
								titleOpp.addContentMiddle(sap.ui.getCore()
										.byId("oppDetails"));
								titleOpp.removeAllContentLeft();

							}
						} else {
							sap.ui.getCore().byId("upBtn").setVisible(true);
							sap.ui.getCore().byId("downBtn").setVisible(true);
						}

						// WAVE 3 ENHANCEMENT
						/**
						 * @ControllerHook Provision for Additional Fields in
						 *                 the Opportunity Popover. If you want
						 *                 to see the additional fields
						 *                 directly, this method enables you to
						 *                 set the data to those additional
						 *                 fields. This is called when you
						 *                 select the bubble in the Sales
						 *                 Pipeline.
						 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookOpportunityPopover
						 * @return {void}
						 */
						if (this.extHookOpportunityPopover)
							this.extHookOpportunityPopover();
						ec.openBy(oEvent.getParameter('item').selected);
					},

					closePopover : function() {
						sap.ui.getCore().byId("po").close();
					},

					moveUp : function() {
						var value = this.byId("name").getValue();
						var value2 = this.byId("name").getValue2();
						var units = this.byId("name").getUnits();
						var FilteredOpportunites = [], labelsTexts = [], labelsValues = [];
						var startDate = undefined, endDate = undefined, index = undefined;

						if (sap.ui.Device.system.phone == true) {
							var timeinterval = this.getView().getModel(
									"TimeIntervals");
							var Opportunites = this.getView().getModel(
									"Opportunities").oData;

							for ( var i = value; i <= value2; i++) {
								labelsTexts[i - value] = units[i].getValue();
								labelsValues[i - value] = units[i].getKey();

								if (i == value)
									startDate = units[i].getKey();
								if (i == value2)
									endDate = timeinterval.oData[i].TimeTo;
							}

							for ( var i = 0; i < Opportunites.length; i++)
								if ((Opportunites[i].ClosingDate >= startDate)
										&& (Opportunites[i].ClosingDate <= endDate))
									FilteredOpportunites.push(Opportunites[i]);

							for ( var i = 0; i < FilteredOpportunites.length; i++)
								if (FilteredOpportunites[i].Guid === this.selectedbubble) {
									index = i + 1;
									if (index >= FilteredOpportunites.length)
										index = 0;
								}
							var chart = this.byId("chart_sim");
							// this.closePopover();
							chart
									.setSelection(FilteredOpportunites[index].Guid);
						} else {
							for ( var i = 0; i < this.overlappingBubbles.length; i++)
								if (this.overlappingBubbles[i].id === this.selectedbubble) {
									index = i + 1;
									if (index >= this.overlappingBubbles.length)
										index = 0;
								}
							var chart = this.byId("chart_sim");
							// this.closePopover();
							chart
									.setSelection(this.overlappingBubbles[index].id);
						}
					},

					moveDown : function() {
						var Opportunites = this.getView().getModel(
								"Opportunities").oData;
						var that = this;
						var value = this.byId("name").getValue();
						var value2 = this.byId("name").getValue2();
						var units = this.byId("name").getUnits();
						var FilteredOpportunites = [], labelsTexts = [], labelsValues = [];
						var startDate = undefined, endDate = undefined, index = undefined;
						var timeinterval = this.getView().getModel(
								"TimeIntervals");
						if (sap.ui.Device.system.phone == true) {
							for ( var i = value; i <= value2; i++) {
								labelsTexts[i - value] = units[i].getValue();
								labelsValues[i - value] = units[i].getKey();

								if (i == value)
									startDate = units[i].getKey();
								if (i == value2)
									endDate = timeinterval.oData[i].TimeTo;
							}

							for ( var i = 0; i < Opportunites.length; i++)
								if ((Opportunites[i].ClosingDate >= startDate)
										&& (Opportunites[i].ClosingDate <= endDate))
									FilteredOpportunites.push(Opportunites[i]);

							for ( var i = 0; i < FilteredOpportunites.length; i++)
								if (FilteredOpportunites[i].Guid === that.selectedbubble) {
									index = i - 1;
									if (index < 0)
										index = FilteredOpportunites.length - 1;
								}
							var chart = this.byId("chart_sim");
							// this.closePopover();
							chart
									.setSelection(FilteredOpportunites[index].Guid);
						} else {
							for ( var i = 0; i < that.overlappingBubbles.length; i++)
								if (that.overlappingBubbles[i].id === that.selectedbubble) {
									index = i - 1;
									if (index < 0)
										index = that.overlappingBubbles.length - 1;
								}
							var chart = this.byId("chart_sim");
							// this.closePopover();
							chart
									.setSelection(that.overlappingBubbles[index].id);
						}
					},
					// END OF Opportunity POPOVER

					// CROSS-APP Navigation to other Fiori Applications -
					// (1) Accounts
					toAccountApp : function() {
						var fgetService = sap.ushell && sap.ushell.Container
								&& sap.ushell.Container.getService;
						var oCrossAppNavigator = fgetService
								&& fgetService("CrossApplicationNavigation");
						var sAccParam = isNaN(parseInt(this.pAccountId)) ? this.pAccountId
								: parseInt(this.pAccountId).toString();
						var toMyAccountsApp = oCrossAppNavigator
								&& oCrossAppNavigator.hrefForExternal({
									target : {
										semanticObject : "Account",
										action : "MyAccounts"
									},
									appSpecificRoute : [
											"&",
											"detail",
											"AccountCollection('" + sAccParam
													+ "')" ].join("/"),
								// params : {
								// accountID : sAccParam
								// }
								}) || "";
						this.closePopover();
						window.location = toMyAccountsApp;
					},

					// CROSS-APP Navigation to other Fiori Applications -
					// (2) Opportunities
					toOppApp : function() {
						var fgetService = sap.ushell && sap.ushell.Container
								&& sap.ushell.Container.getService;
						var oCrossAppNavigator = fgetService
								&& fgetService("CrossApplicationNavigation");

						var toOppApp = oCrossAppNavigator
								&& oCrossAppNavigator.hrefForExternal({
									target : {
										semanticObject : "Opportunity",
										action : "manageOpportunity"
									},
									params : {
										guid : this.guidVal
									}
								}) || "";

						this.closePopover();
						window.location = toOppApp;

					},

					// CROSS-APP Navigation to other Fiori Applications -
					// (3) Contacts
					toContactApp : function() {
						var fgetService = sap.ushell && sap.ushell.Container
								&& sap.ushell.Container.getService;
						var oCrossAppNavigator = fgetService
								&& fgetService("CrossApplicationNavigation");
						var sAccParam = isNaN(parseInt(this.pAccountId)) ? this.pAccountId
								: parseInt(this.pAccountId).toString();
						var sConParam = isNaN(parseInt(this.pContactId)) ? this.pContactId
								: parseInt(this.pContactId).toString();
						var toContactApp = oCrossAppNavigator
								&& oCrossAppNavigator.hrefForExternal({
									target : {
										semanticObject : "ContactPerson",
										action : "MyContacts"
									},
									params : {
										accountID : sAccParam,
										contactID : sConParam,
									}
								}) || "";

						this.closePopover();
						window.location = toContactApp;
					},

					/*
					 * FIORI WAVE 2 - Branch : Rel - 1.0 END of INITAL
					 * DEVELOPMENT for TrackSalesPipeline
					 */

					/*
					 * FIORI WAVE 3 - Branch : Rel - 1.1 START of ENHANCEMENTS
					 * for TrackSalesPipeline
					 */

					// EXTENSION POINT to provide additional Facet Filters
					/*
					 * @ControllerHook Provision for Additional Facet Filters.
					 * Additional filters can be added if required to perform
					 * analysis on the Manager's Sales Pipeline. This is called
					 * when the Facet Filter button on the top-right is
					 * selected. The hook must be documented like: @callback
					 * sap.ca.scfld.md.controller.BaseFullscreenController~extHookAddFacetFilter
					 */
					// extHookAddFacetFilter : function() {
					//
					// },
					// EXTENSION POINT to provide additional views created by
					// CUSTOMER and view the user-chosen view provided by
					// CUSTOMER
					/*
					 * @ControllerHook Provision for Additional Views.
					 * Additional Views can be added if required to see the
					 * direct results of the Sales Pipeline when the view is
					 * selected. This is called when the drop-down list for
					 * VIEWS is selected and a value from it is chosen. The hook
					 * must be documented like: @callback
					 * sap.ca.scfld.md.controller.BaseFullscreenController~extHookAddViews
					 * @param {void} @return {void}
					 */
					// extHookAddViews : function() {
					//
					// },
					// EXTENSION method to show ADDITIONAL fields in the
					// Opportunity Popover when a BUBBLE is selected
					/*
					 * @ControllerHook Provision for Additional Fields in the
					 * Opportunity Popover. If required to see the additional
					 * fields directly, this methods enables you to set the data
					 * to those additional fields. This is called when the
					 * bubble in the Sales Pipeline is selected. The hook must
					 * be documented like: @callback
					 * sap.ca.scfld.md.controller.BaseFullscreenController~extHookOpportunityPopover
					 * @param {void} @return {void}
					 */
					// extHookOpportunityPopover : function() {
					//
					// },
					/*
					 * FIORI WAVE 3 - Branch : Rel - 1.1 END of ENHANCEMENTS for
					 * TrackSalesPipeline
					 */

					/*
					 * FIORI WAVE 4 - Branch : Rel - 1.2 START of ENHANCEMENTS
					 * for TrackSalesPipeline
					 */

					// Filter based on SALES ORG when the selected popover is
					// selected
					closeListORG : function(oEvent) {
						// var OpportunitiesAll = that.Opportunities;
						var oFF = this.byId("facetFilter");
						var aFFLists = oFF.getLists();
						for ( var i = 0; i < aFFLists.length; i++) {
							if (aFFLists[i].getKey() == "org")
								continue;
							var aItems = aFFLists[i].getItems();
							for ( var j = 0; j < aItems.length; j++) {
								aItems[j].setSelected(false);
							}
							aFFLists[i].getBinding("items").filter([]);

						}
						oFF.rerender();
						var OpportunitiesAll = this.OpportunitiesAllForFacetFilter;
						var selItemsLength = oEvent
								.getParameter("selectedItems").length;
						if (selItemsLength == 0) {
							var jModelAll = new sap.ui.model.json.JSONModel(
									OpportunitiesAll);
							this.getView().setModel(jModelAll, "Opportunities");
							this.filteredOpportunities = OpportunitiesAll;
							this.showTopNOpp();
							this.calculateProgress();
							return;
						}
						var Ids = [];
						for ( var i = 0; i < selItemsLength; i++)
							Ids[i] = oEvent.getParameter("selectedItems")[i]
									.getKey();
						var Opportunities = [];
						var data = oEvent.getSource().getModel("OppOrgData").oData.values;
						// data = this.oFacetListORG.getModel().oData.values;
						for ( var i = 0; i < Ids.length; i++) {
							for ( var j = 0; j < data.length; j++) {
								if (Ids[i] == data[j].Id) {
									for ( var r = 0; r < data[j].Opportunities.length; r++) {
										Opportunities
												.push(data[j].Opportunities[r]);
									}
								}
							}
						}
						this.filteredOpportunities = Opportunities;
						this.showTopNOpp();
						this.calculateProgress();
					},

					// Display the BUBBLE CHART which shows the Opportunities of
					// Sales Representatives under him/her over the CURRENT time
					// frame
					showBubbleChart : function(oEvent) {
						this.getView().byId("barChartPanel").setVisible(false);
						this.getView().byId("sSP1").setVisible(true);
						this.getView().byId("chart_sim").setVisible(true);
						this.getView().byId("name").setVisible(true);
						this.getView().byId("opportunitySlider").setVisible(
								true);
					},

					// Display the BAR CHART which shows aggregation of
					// Opportunities measuring both Total & Weighted
					// Revenue based on Sales Organization
					showBarChart : function(oEvent) {
						this.chart = this.getView().byId("fvbChart");
						var that = this;
						if (sap.ui.Device.orientation.landscape)
							that.chart.setHeight(0.6 * window.innerHeight
									+ "px");
						$(window)
								.on(
										"orientationchange",
										function(event) {
											if (event.orientation == "landscape") {
												that.chart.setHeight(0.6
														* window.innerHeight
														+ "px");
											} else if (event.orientation == "portrait") {
												that.chart.setHeight("100%");
											}
										});
						this.getView().byId("sSP1").setVisible(false);
						// var ssp2 = this.getView().byId("sSP2");
						// ssp2.setVisible(false);
						this.getView().byId("chart_sim").setVisible(false);
						this.getView().byId("name").setVisible(false);
						this.getView().byId("barChartPanel").setVisible(true);
						this.getView().byId("opportunitySlider").setVisible(
								false);

						var opp = this.OpportunitiesAll_chart;
						for ( var oppIndx = 0; oppIndx < opp.length; oppIndx++)
							this.data.results[oppIndx] = opp[oppIndx];
						this.chart.setShowPopover(false);
						this.chart.setModel(this.formatOdata(),
								"opportunityGraph");
						// this.oApplicationFacade.oApplicationImplementation.oCurController.FullCtrl
						// = this;
						var flatdataset = new sap.viz.ui5.data.FlattenedDataset();
						var dimension = new sap.viz.ui5.data.DimensionDefinition(
								{
									axis : 1,
									name : this.oBundle
											.getText("OPPORTUNITY_ITEM"),
									value : '{opportunityGraph>SalesOrganizationUnitText}'
								});
						var measures1 = new sap.viz.ui5.data.MeasureDefinition(
								{
									name : this.oBundle.getText("LBL_TARGET"),
									value : '{opportunityGraph>SalesTarget}'
								});

						var measures2 = new sap.viz.ui5.data.MeasureDefinition(
								{
									name : this.oBundle
											.getText("LBL_OD_WEIGHTEDREVENUE"),
									value : '{opportunityGraph>WeightedRevenue}'
								});

						var measures3 = new sap.viz.ui5.data.MeasureDefinition(
								{
									name : this.oBundle.getText("LBL_EXPECTED"),
									value : '{opportunityGraph>ExpectedSalesVolume}'
								});

						// Set the Data set
						flatdataset.addDimension(dimension);
						flatdataset.addMeasure(measures1);
						flatdataset.addMeasure(measures2);
						flatdataset.addMeasure(measures3);
						flatdataset.bindData({
							path : "opportunityGraph>/results"
						});
						this.chart.setDataset(flatdataset);
						/*
						 * sap.viz.format.FormatManager .formatFunc({ format :
						 * function(v, p) { if (p == "0") { var cd =
						 * that.getView().getModel(
						 * 'SalesPipelineSetting').oData.CurrencyCode; v =
						 * sap.ca.ui.model.format.AmountFormat
						 * .FormatAmountShort(v, cd, 2); return v; } else return
						 * v; } });
						 */
						var cc = that.getView()
								.getModel('SalesPipelineSetting').oData.CurrencyCode;
						var oCa = {
							dataLabel : {
								visible : true,
								position : "inside"
							},
							interaction : {
								supportLassoEvent : false,
								selectability : {
									mode : "single"
								},
							},
							xAxis : {
								title : {
									visible : true,
									text : this.oBundle.getText("LBL_ORG")
								}
							},
							yAxis : {
								title : {
									visible : true,
									text : this.oBundle.getText(
											"LBL_REVENUE_BAR_CHART", [ cc ])
								}
							},
						};
						this.chart.setAdvancedChartSettings(oCa);
					},

					// Formation of dataset that is to render the chart as
					// viewed by the END USER
					_filterOpportunitiesBasedOnOrg : function(OrgData, iIndex,
							Opportunities) {
						var oCurrOrg = new Object(), bIsNewOrg = true;
						for ( var w = -1, oSelOrg; oSelOrg = OrgData[++w];)
							if (oSelOrg.Id == Opportunities[iIndex].SalesOrganizationUnit) {
								oSelOrg.ExpectedSalesVolume += parseFloat(Opportunities[iIndex]["ExpectedSalesVolume"]);
								oSelOrg.WeightedRevenue += parseFloat(Opportunities[iIndex]["ExpectedSalesVolume"])
										* (parseFloat(Opportunities[iIndex]["ChanceOfSuccess"]) / 100);
								Opportunities[iIndex].SalesStageDescription = this
										._getSalesStage(Opportunities[iIndex]);
								oSelOrg.Opportunities
										.push(Opportunities[iIndex]);
								bIsNewOrg = false;
								break;
							}
						if (bIsNewOrg) {
							oCurrOrg.ExpectedSalesVolume = parseFloat(Opportunities[iIndex]["ExpectedSalesVolume"]);
							oCurrOrg.WeightedRevenue = parseFloat(Opportunities[iIndex]["ExpectedSalesVolume"])
									* (parseFloat(Opportunities[iIndex]["ChanceOfSuccess"]) / 100);
							if (Opportunities[iIndex].SalesOrganizationUnitText == "")
								Opportunities[iIndex].SalesOrganizationUnitText = this.oBundle
										.getText("LBL_OTHERS");
							oCurrOrg.SalesOrganizationUnitText = Opportunities[iIndex].SalesOrganizationUnitText;
							oCurrOrg.Id = Opportunities[iIndex].SalesOrganizationUnit;
							oCurrOrg.Opportunities = [];
							Opportunities[iIndex].SalesStageDescription = this
									._getSalesStage(Opportunities[iIndex]);
							oCurrOrg.Opportunities.push(Opportunities[iIndex]);
							OrgData.push(oCurrOrg);
						}
					},

					_initSalesTargetToJsonData : function(aListOrgs, OrgData) {
						for ( var j = -1, cc; cc = OrgData[++j];) {
							cc.WeightedRevenue = parseFloat(cc.WeightedRevenue
									.toFixed(2));
							cc.ExpectedSalesVolume = parseFloat(cc.ExpectedSalesVolume
									.toFixed(2));
							if (cc.Id == "" || cc.SalesTarget <= 0)
								cc.SalesTarget = "";
							else {
								for ( var i = -1, dd; dd = aListOrgs[++i];)
									if (cc.Id == dd.SalesOrganizationUnit) {
										cc.SalesTarget = parseFloat(dd.Revenue);
										break;
									}
							}
						}
					},

					formatOdata : function() {
						var OrgData = [];
						for ( var i = 0; i < this.Opportunities.length; i++)
							this._filterOpportunitiesBasedOnOrg(OrgData, i,
									this.Opportunities);
						this._initSalesTargetToJsonData(
								this.OrganizationSalesTargets, OrgData);
						this.graphDataToShow = {
							results : OrgData
						};
						var Model = new sap.ui.model.json.JSONModel(
								this.graphDataToShow);
						Model
								.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
						return Model;
					},

					// Display the list of Opportunities under the SALES ORG
					// when the user clicks on any column in the BAR CHART
					onSelectDataPoint : function(oEvent) {
						if (oEvent.getParameter("srcEvent").sId == "deselectData")
							return;
						var oEPPopover = oEvent.getParameter('popover'), oSI = oEvent
								.getParameter('selectedItem');
						oEPPopover.setPlacement(sap.m.PlacementType.Auto)
								.getContent()[0].getParent().addStyleClass(
								'overflowx');
						oEPPopover.removeAllContent();
						var aListItemsPO = [], oLIinP = undefined, sSelColumn = Object
								.keys(oSI.data)[1];
						var sLblTarget = this.oBundle.getText("LBL_TARGET"), sLblWR = this.oBundle
								.getText("LBL_OD_WEIGHTEDREVENUE"), sLblER = this.oBundle
								.getText("LBL_EXPECTED"), sLblClose = this.oBundle
								.getText("BTN_TBT_CLOSE"), sDimension = this.oBundle
								.getText("OPPORTUNITY_ITEM");

						var ModelForPopOver = new sap.ui.model.json.JSONModel();
						var popOverHeader = undefined;
						var cd = this.getView()
								.getModel('SalesPipelineSetting').oData.CurrencyCode;
						if (sSelColumn == sLblWR || sSelColumn == sLblER) {
							popOverHeader = this.oBundle
									.getText("LBL_ALLTO_SELECTED");
							for ( var i = -1, oCurGR; oCurGR = this.graphDataToShow.results[++i];)
								if (oCurGR["SalesOrganizationUnitText"] == oSI.data[sDimension]) {
									for ( var j = -1, oCurOpp; oCurOpp = oCurGR.Opportunities[++j];) {
										var oCurrentItem = {};
										oCurrentItem["title"] = oCurOpp["Description"];
										oCurrentItem["value"] = oCurOpp["SalesStageDescription"];
										if (sSelColumn == sLblWR) {
											var fESV = parseFloat(oCurOpp["ExpectedSalesVolume"]);
											var fCOS = parseFloat(oCurOpp["ChanceOfSuccess"]) / 100;
											oCurrentItem["Revenue"] = sap.ca.ui.model.format.AmountFormat
													.FormatAmountShortWithCurrency(
															fESV * fCOS, cd, 2);
										} else
											oCurrentItem["Revenue"] = sap.ca.ui.model.format.AmountFormat
													.FormatAmountShortWithCurrency(
															parseFloat(oCurOpp["ExpectedSalesVolume"]),
															cd, 2);
										oCurrentItem["guId"] = oCurOpp["Guid"];
										oCurrentItem["opportunityId"] = oCurOpp["Id"];
										aListItemsPO.push(oCurrentItem);
									}
									break;
								}

							ModelForPopOver.setData({
								results : aListItemsPO
							});
							ModelForPopOver
									.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
							oLIinP = new sap.m.List(
									{
										mode : sap.m.ListMode.SingleSelectMaster,
										select : jQuery.proxy(
												this.selectOppNav, this,
												aListItemsPO),
										items : {
											path : "popoverGraph>/results",
											template : new sap.m.ObjectListItem(
													{
														title : "{popoverGraph>title}",
														firstStatus : new sap.m.ObjectStatus(
																{
																	text : "{popoverGraph>Revenue}",
																}),
														secondStatus : new sap.m.ObjectStatus(
																{
																	text : "{popoverGraph>value}",
																}),
														attributes : [
																new sap.m.ObjectAttribute(
																		{
																			text : sSelColumn == sLblWR ? sLblWR
																					: sLblER
																		}),
																new sap.m.ObjectAttribute(
																		{
																			text : this.oBundle
																					.getText("LBL_SALESSTAGE")
																		}) ]
													})
										}
									});
						} else if (sSelColumn == sLblTarget) {
							popOverHeader = this.oBundle
									.getText("SALESTARGET_ITEM");
							aListItemsPO
									.push({
										"SalesTarget" : sap.ca.ui.model.format.AmountFormat
												.FormatAmountShortWithCurrency(
														oSI.data[sSelColumn],
														cd, 2)
									});
							ModelForPopOver.setData({
								results : aListItemsPO
							});
							oLIinP = new sap.m.List(
									{
										mode : sap.m.ListMode.SingleSelectMaster,
										items : {
											path : "popoverGraph>/results",
											template : new sap.m.ObjectListItem(
													{
														firstStatus : new sap.m.ObjectStatus(
																{
																	text : "{popoverGraph>SalesTarget}",
																}),
														attributes : [ new sap.m.ObjectAttribute(
																{
																	text : popOverHeader
																}) ]
													})
										}
									});
						}

						var oHeader = new sap.m.Bar({
							contentMiddle : [ new sap.m.Label({
								text : popOverHeader
							}) ]
						});
						var oFooter = new sap.m.Bar({
							contentLeft : [ new sap.m.Button(
									{
										text : this.oBundle
												.getText("BTN_VIEW_DETAILS"),
										press : jQuery.proxy(
												this.enablePopoverFooter, this,
												oSI.data[sDimension])
									}) ],
							contentRight : [ new sap.m.Button({
								text : sLblClose,
								press : jQuery.proxy(this.enablePopoverFooter,
										this, oSI.data[sDimension])
							// function(oEvent) {
							// sap.ui.getCore().byId(sIdPopover)
							// .close();
							// this.getParent().getParent().close();
							// }
							}) ]
						});

						this.chart.setPopoverFooter(oFooter);
						oEPPopover.setCustomHeader(oHeader);
						oLIinP.setModel(ModelForPopOver, "popoverGraph");
						oEPPopover.addContent(oLIinP);
						// oEvent.oSource._invalidatePopover();
						// oEvent.getParameter('popover').getContent()[0].addStyleClass('overflowx');
						var idPopContent = [ oEPPopover.getId(), "popover",
								"cont" ].join("-");
						$("#" + idPopContent).css("overflow-y", 'auto');
						oEPPopover.openBy(oEvent.getParameter('srcEvent')
								.getParameter('data')[0].target);
					},

					enablePopoverFooter : function(sSelOpp, oEvent) {
						oEvent.getSource().getParent().getParent().close();
						if (oEvent.getSource().sParentAggregationName == "contentLeft") {
							this.showBubbleChart(oEvent);
							this.getView().byId("sSP2").setSelectedKey(
									"SalesPipeline");
							this.byId("filterButton").setEnabled(true);
							this.getView().byId("FilterPanel").setVisible(true);
							var oFF = this.byId("facetFilter");
							for ( var i = -1, oCurFF; oCurFF = oFF.getLists()[++i];) {
								if (oCurFF.getKey() == "org") {
									for ( var j = -1, oCurListFF; oCurListFF = oCurFF
											.getItems()[++j];)
										if (oCurListFF.getText() == sSelOpp) {
											oCurListFF.setSelected(true);
											break;
										}
									break;
								} else {
									for ( var j = -1, oCurListFF; oCurListFF = oCurFF
											.getItems()[++j];)
										oCurListFF.setSelected(false);
									oCurFF.getBinding('items').filter([]);
								}
							}
							oFF.rerender();
							for ( var i = -1, oCurGR; oCurGR = this.graphDataToShow.results[++i];)
								if (oCurGR["SalesOrganizationUnitText"] == sSelOpp)
									this.filteredOpportunities = oCurGR.Opportunities;
							this.showTopNOpp();
							var jModel = new sap.ui.model.json.JSONModel(
									this.filteredOpportunities);
							this.getView().setModel(jModel, "Opportunities");
							this.calculateProgress();
						}
					},

					selectOppNav : function(listArr, oEvent) {
						var selectedItemContextPath = oEvent.getParameter(
								'listItem').getBindingContext('popoverGraph').sPath;
						var resArray = selectedItemContextPath.split("/");
						var listArrIndex = resArray[resArray.length - 1];
						var selectedItem = listArr[listArrIndex];
						this.guidVal = selectedItem["guId"];
						this.toOppApp();
						this.popover.close();
					},

					renderTopNSlider : function(oEvent) {
						if (!this.oFragmentList.topNSlider) {
							this.oFragmentList.topNSlider = new sap.ui.xmlfragment(
									'cus.crm.ppm.mgr.view.opportunitySlider',
									this);
							this.oFragmentList.topNSlider.setModel(this
									.getView().getModel("i18n"), "i18n");
						}
						this.oFragmentList.topNSlider
								.openBy(oEvent.getSource());
					},

					_setTopNSliderLabel : function(maxValue, value) {
						var core = sap.ui.getCore();
						if (value == undefined)
							value = maxValue;
						if (maxValue > 0) {
							core.byId('opportunitySlider').setEnabled(true)
									.setMin(1).setMax(maxValue).setValue(value);
							if (maxValue > 1) {
								core.byId('exLostCheck').setEnabled(true);
								core.byId('exWonCheck').setEnabled(true);
							}
							if (maxValue > value) {
								var noOfTopOppText = this.oBundle.getText(
										"LBL_NOOFTO_SELECTED", value);
								core.byId('sliderLabel')
										.setText(noOfTopOppText);
							} else {
								var allOppText = this.oBundle
										.getText("LBL_ALLTO_SELECTED");
								core.byId('sliderLabel').setText(allOppText);
							}
						} else {
							core.byId('opportunitySlider').setMin(0).setMax(0)
									.setValue(0).setEnabled(false);
							var noOppText = this.oBundle
									.getText("LBL_NOTO_SELECTED");
							core.byId('sliderLabel').setText(noOppText);
							if (!(core.byId('exLostCheck').getSelected() || core
									.byId('exWonCheck').getSelected())) {
								core.byId('exLostCheck').setEnabled(false);
								core.byId('exWonCheck').setEnabled(false);
							}
						}
					},

					_isFilteredStatus : function(opportunity) {
						var excludeLost = sap.ui.getCore().byId('exLostCheck')
								.getSelected();
						var excludeWon = sap.ui.getCore().byId('exWonCheck')
								.getSelected();
						if (excludeLost == true || excludeWon == true) {
							var bTCode = this._getBTCode(opportunity);
							if (excludeLost == true && bTCode == "LOST")
								return true;
							if (excludeWon == true && bTCode == "WINN")
								return true;
						}
						return false;
					},

					_getCurrFilteredOpp : function(localOpportunity) {
						var dateSlider = this.getView().byId("chart_sim");
						var dateSliderStartDate = dateSlider._xAxis.xStart;
						var dateSliderEndDate = dateSlider._xAxis.xEnd;
						localOpportunity.sort(function(a, b) {
							return b.ExpectedSalesVolume
									- a.ExpectedSalesVolume;
						});
						var length = localOpportunity.length;
						for ( var i = 0; i < length; i++) {
							var currOppEndDate = localOpportunity[i].ClosingDate;
							if (!((dateSliderStartDate <= currOppEndDate) && (currOppEndDate <= dateSliderEndDate))) {
								localOpportunity.splice(i, 1);
								i--;
								length--;
								continue;
							}
							if (this._isFilteredStatus(localOpportunity[i])) {
								localOpportunity.splice(i, 1);
								i--;
								length--;
							}
						}
						return localOpportunity;
					},

					_getTopNOpp : function(isSliding, isSelected) {
						var isTopTen = false;
						var slider = sap.ui.getCore().byId('opportunitySlider');
						var sliderVal = sap.ui.getCore().byId(
								'opportunitySlider').getValue();
						var sliderMax = sap.ui.getCore().byId(
								'opportunitySlider').getMax();
						if (this.getView().byId('sSP2').getSelectedItem()
								.getKey() == "Top10Opportunities")
							isTopTen = true;

						var localOpportunity = this
								._getCurrFilteredOpp(this.OpportunitiesAll_chart
										.slice(0));
						var noOfFilteredOpp = localOpportunity.length;
						if (isTopTen) {
							if (sliderVal >= 10)
								sliderVal = 10;
							if (noOfFilteredOpp > 10)
								noOfFilteredOpp = 10;
							if (slider.getMax() == sliderVal)
								sliderVal = noOfFilteredOpp;
							this
									._setTopNSliderLabel(noOfFilteredOpp,
											sliderVal);
							localOpportunity = localOpportunity.slice(0,
									sliderVal);
						} else if ((sliderVal == sliderMax)
								|| (sliderVal >= noOfFilteredOpp)
								|| (noOfFilteredOpp == sliderVal)
								|| (sliderVal == 0))
							this._setTopNSliderLabel(noOfFilteredOpp);
						else {
							this
									._setTopNSliderLabel(noOfFilteredOpp,
											sliderVal);
							localOpportunity = localOpportunity.slice(0,
									sliderVal);
						}
						return localOpportunity;
					},

					showTopNOpp : function(oEvent) {
						var isSliding = false, isSelected = false, bIsSalesPeriodSeen = true;
						if (oEvent != undefined) {
							var oControl = oEvent.getSource();
							if (oContrl.sId == "opportunitySlider")
								isSliding = true;
							if (oControl.sId == 'exLostCheck'
									|| oEvent.getSource().sId == 'exWonCheck')
								isSelected = true;
							var oSettings = this.getView().getModel(
									"SalesPipelineSetting").oData, oSlider = this
									.getView().byId("name");
							var dSOP = oSettings.StartOfPeriod, dEOP = oSettings.EndOfPeriod;
							var dSS = oSlider.getUnits()[oSlider.getValue()]
									.getKey(), dSE = oSlider.getUnits()[oSlider
									.getValue2()].getKey();
							if (dSOP >= dSE || dEOP <= dSS)
								bIsSalesPeriodSeen = false;
						}
						var localOpportunity = this._getTopNOpp(isSliding,
								isSelected);
						var jModelForTopOpportunities = new sap.ui.model.json.JSONModel(
								localOpportunity);
						this.getView().setModel(jModelForTopOpportunities,
								"Opportunities");
						// this.copyOpportunities("OpportunitiesOld");
						// if ((isSliding || isSelected) && bIsSalesPeriodSeen)
						this.calculateProgress();
						this.LoadFacetFilter();
					},

					LoadOrgData : function(bSync) {
						var that = this;
						var fnSuccess = function(odata, response) {
							var jModel = new sap.ui.model.json.JSONModel(
									odata.results);
							that.getView().setModel(jModel,
									"OrganizationSalesTargets");
							that.OrganizationSalesTargets = odata.results;
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						this.oDataModel.read("OrganizationSalesTargets", null,
								null, bSync, fnSuccess, fnError);
					},

					_initializeAllControllerFragments : function() {
						var i18nModel = this.getView().getModel("i18n");
						// Making it work with the latest UI5 1.22.0 onwards
						this.oFragmentList = {};
						if (!this.oFragmentList.Opportunity) {
							this.oFragmentList.Opportunity = new sap.ui.xmlfragment(
									'cus.crm.ppm.mgr.view.Opportunity', this);
							this.oFragmentList.Opportunity.setModel(i18nModel,
									"i18n");
						}
						if (!this.oFragmentList.topNSlider) {
							this.oFragmentList.topNSlider = new sap.ui.xmlfragment(
									'cus.crm.ppm.mgr.view.opportunitySlider',
									this);
							this.oFragmentList.topNSlider.setModel(i18nModel,
									"i18n");
						}
						if (!this.oFragmentList.salesPeriodSettings) {
							this.oFragmentList.salesPeriodSettings = new sap.ui.xmlfragment(
									'cus.crm.ppm.mgr.view.salesPeriodSettings',
									this);
							this.oFragmentList.salesPeriodSettings.setModel(
									i18nModel, "i18n");
							this.oFragmentList.salesPeriodSettings
									.setModel(this.getView().getModel(
											"PeriodicityTexts"),
											"PeriodicityTexts");
							this.oFragmentList.salesPeriodSettings.setModel(
									this.getView().getModel("CurrencyList"),
									"CurrencyList");
							this.oFragmentList.salesPeriodSettings.setModel(
									this.getView().getModel("YearRanges"),
									"YearRanges");
							if (sap.ui.Device.system.desktop
									|| sap.ui.Device.system.tablet)
								this.oFragmentList.salesPeriodSettings
										.setContentWidth("30em");
						}
						if (!this.oFragmentList.appSettings) {
							this.oFragmentList.appSettings = new sap.ui.xmlfragment(
									'cus.crm.ppm.mgr.view.appSettings', this);
							this.oFragmentList.appSettings.setModel(i18nModel,
									"i18n");
							if (sap.ui.Device.system.desktop
									|| sap.ui.Device.system.tablet) {
								this.oFragmentList.appSettings
										.setContentWidth("30em");
							}
						}
					},

					_destroyAllControllerFragments : function() {
						if (this.oFragmentList)
							for ( var sFragment in this.oFragmentList)
								this.oFragmentList[sFragment].destroy();
						// Making it work with the latest UI5 1.22.0 onwards
						this.oFragmentList = null;
					},

					pressLinkToEmailOrCall : function(oEvent) {
						var oCore = sap.ui.getCore(), aId = [ "mcEmail",
								"empRespEmail", "mcPhone", "empRespPhone" ], oSrc = oEvent
								.getSource();
						switch (oSrc) {
						case oCore.byId(aId[0]):
						case oCore.byId(aId[1]):
							sap.m.URLHelper.triggerEmail(oSrc.getText());
							break;
						case oCore.byId(aId[2]):
						case oCore.byId(aId[3]):
							sap.m.URLHelper.triggerTel(oSrc.getText());
							break;
						}
					},

					_checkForPopoverArrow : function(oEvent) {
						var oEPPopover = oEvent.getSource(), sIdArrow = [
								oEPPopover.getId(), "popover", "arrow" ]
								.join("-"), oDivElem = $("#" + sIdArrow);
						// This check is used only for RTL scenarios where
						// the arrow is placed wrongly by Chart Popover
						if (oDivElem.hasClass("sapMPopoverArrRight"))
							oDivElem.removeClass("sapMPopoverArrRight")
									.addClass("sapMPopoverArrLeft");
						else if (oDivElem.hasClass("sapMPopoverArrLeft"))
							oDivElem.removeClass("sapMPopoverArrLeft")
									.addClass("sapMPopoverArrRight");
					}
				/*
				 * FIORI WAVE 4 - Branch : Rel - 1.2 END of ENHANCEMENTS for
				 * TrackSalesPipeline
				 */
				});
},
	"cus/crm/ppm/mgr/view/S1.view.xml":'<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core" xmlns="sap.m"\n\txmlns:layout="sap.ui.layout" xmlns:viz="sap.viz.ui5" xmlns:crm="sap.crm"\n\txmlns:charts="sap.ca.ui.charts" xmlns:crmchart="sap.crm.ca"\n\tcontrollerName="cus.crm.ppm.mgr.view.S1">\n\t<Page id="page">\n\t\t<customHeader>\n\t\t\t<Bar>\n\t\t\t\t<contentLeft>\n\t\t\t\t\t<Button id="navBack" icon="sap-icon://nav-back" press="_navBack"></Button>\n\t\t\t\t</contentLeft>\n\t\t\t\t<contentMiddle>\n\t\t\t\t\t<Label text="{i18n>FULLSCREEN_TITLE}"></Label>\n\t\t\t\t</contentMiddle>\n\t\t\t\t<contentRight>\n\t\t\t\t\t<Button icon="sap-icon://filter" id="filterButton" press="toggleButtons"></Button>\n\t\t\t\t</contentRight>\n\t\t\t</Bar>\n\t\t</customHeader>\n\t\t<content>\n\n\t\t\t<!-- Replace with required full screen control -->\n\n\t\t\t<layout:HorizontalLayout id="FilterPanel"\n\t\t\t\tvisible="false" class="selectionLayout facetLayout">\n\t\t\t\t<layout:content>\n\t\t\t\t\t<layout:VerticalLayout width="100%">\n\t\t\t\t\t\t<layout:content>\n\t\t\t\t\t\t\t<FacetFilter id="facetFilter" reset="resetFunc">\n\t\t\t\t\t\t\t</FacetFilter>\n\t\t\t\t\t\t</layout:content>\n\t\t\t\t\t</layout:VerticalLayout>\n\t\t\t\t</layout:content>\n\t\t\t</layout:HorizontalLayout>\n\n\n\t\t\t<layout:HorizontalLayout>\n\t\t\t\t<layout:content>\n\n\t\t\t\t\t<layout:VerticalLayout class="showMiddle">\n\t\t\t\t\t\t<layout:content>\n\t\t\t\t\t\t\t<ObjectHeader id="objectHeader" title="{i18n>LBL_OVERALL_TARGET}">\n\t\t\t\t\t\t\t</ObjectHeader>\n\t\t\t\t\t\t</layout:content>\n\t\t\t\t\t</layout:VerticalLayout>\n\n\t\t\t\t\t<layout:VerticalLayout class="showMiddleProgressIndicator">\n\t\t\t\t\t\t<layout:content>\n\t\t\t\t\t\t\t<Text id="objectStatus" width="100%" textAlign="Right"\n\t\t\t\t\t\t\t\tdesign="Bold"></Text>\n\t\t\t\t\t\t\t<ProgressIndicator width="100%" height="1.7rem"\n\t\t\t\t\t\t\t\tid="pg" showValue="true"></ProgressIndicator>\n\t\t\t\t\t\t</layout:content>\n\t\t\t\t\t</layout:VerticalLayout>\n\t\t\t\t</layout:content>\n\t\t\t</layout:HorizontalLayout>\n\n\n\t\t\t<layout:HorizontalLayout class="selectionLayout"\n\t\t\t\tallowWrapping="true">\n\t\t\t\t<layout:content>\n\t\t\t\t\t<layout:HorizontalLayout class="alignLeft">\n\t\t\t\t\t\t<Select id="sSP1" items="{PeriodicityTexts>/}" selectedKey="{SalesPipelineSetting>/STP2}"\n\t\t\t\t\t\t\tchange="onPeriodicityChange">\n\t\t\t\t\t\t\t<items>\n\t\t\t\t\t\t\t\t<core:Item key="{PeriodicityTexts>ID}" text="{PeriodicityTexts>Description}"></core:Item>\n\t\t\t\t\t\t\t</items>\n\t\t\t\t\t\t</Select>\n\t\t\t\t\t\t<Select id="sSP2" class="dropdown" change="chartChange"\n\t\t\t\t\t\t\tselectedKey="SalesPipeline">\n\t\t\t\t\t\t\t<items>\n\t\t\t\t\t\t\t\t<!-- Add different view options to the drop down list to filter the \n\t\t\t\t\t\t\t\t\tOpportunity pipeline -->\n\t\t\t\t\t\t\t\t<core:ExtensionPoint name="extDropDown"></core:ExtensionPoint>\n\t\t\t\t\t\t\t\t<core:ListItem text="{i18n>BTN_SELECT_SALESPIPELINE}"\n\t\t\t\t\t\t\t\t\tkey="SalesPipeline"></core:ListItem>\n\t\t\t\t\t\t\t\t<core:ListItem text="{i18n>BTN_SELECT_TOP10OPPORTUNITIES}"\n\t\t\t\t\t\t\t\t\tkey="Top10Opportunities"></core:ListItem>\n\t\t\t\t\t\t\t\t<!-- <core:ListItem text="{i18n>BTN_SELECT_BARCHART}" key="BarChart"></core:ListItem> -->\n\t\t\t\t\t\t\t</items>\n\t\t\t\t\t\t</Select>\n\t\t\t\t\t</layout:HorizontalLayout>\n\t\t\t\t\t<layout:HorizontalLayout id="opportunitySlider"\n\t\t\t\t\t\tclass="alignRight">\n\t\t\t\t\t\t<layout:content>\n\t\t\t\t\t\t\t<Button id="butDisplayBySize" text="{i18n>BTN_OPEN_OPPORTUNITY_SLIDER}"\n\t\t\t\t\t\t\t\twidth="9.25rem" press="renderTopNSlider" icon="sap-icon://slim-arrow-down"\n\t\t\t\t\t\t\t\ttype="Emphasized" iconFirst="false">\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t</layout:content>\n\t\t\t\t\t</layout:HorizontalLayout>\n\t\t\t\t</layout:content>\n\t\t\t</layout:HorizontalLayout>\n\n\n\t\t\t<crm:BubbleChart id="chart_sim" items="{Opportunities>/}"\n\t\t\t\txStart="{SettingsForDisplay>/TimeFrom}" xEnd="{SettingsForDisplay>/TimeTo}"\n\t\t\t\txFStart="{SettingsForDisplay>/StartOfPeriod}" xFEnd="{SettingsForDisplay>/EndOfPeriod}"\n\t\t\t\txLabelTexts="{xLabelTexts>/}" xLabelValues="{xLabelValues>/}"\n\t\t\t\tyStart="0" yEnd="100" yFStart="0" yFEnd="100" yLabelTexts="{yLabelTexts>/}"\n\t\t\t\tyLabelValues="{yLabelValues>/}" readonly="true" click="bubbleclick">\n\t\t\t\t<crm:items>\n\t\t\t\t\t<crm:Bubble key="{Opportunities>Guid}" x="{Opportunities>ClosingDate}"\n\t\t\t\t\t\ty="{Opportunities>ChanceOfSuccess}" z="{Opportunities>ExpectedSalesVolume}"\n\t\t\t\t\t\tdescription="{Opportunities>Description}">\n\t\t\t\t\t</crm:Bubble>\n\t\t\t\t</crm:items>\n\t\t\t</crm:BubbleChart>\n\n\t\t\t<crm:MDualSlider units="{TimeIntervals>/}" id="name"\n\t\t\t\twidth="100%" step="1" value="{sliderValues>/value}" value2="{sliderValues>/value2}"\n\t\t\t\tchange="dualsliderchange">\n\t\t\t\t<crm:units>\n\t\t\t\t\t<crm:MDualSliderLabel key="{TimeIntervals>TimeFrom}"\n\t\t\t\t\t\tvalue="{TimeIntervals>Label}"></crm:MDualSliderLabel>\n\t\t\t\t</crm:units>\n\t\t\t</crm:MDualSlider>\n\t\t\t<Panel id="barChartPanel" visible="false">\n\t\t\t\t<charts:Chart ChartSelectionMode="Single" chartType="Column"\n\t\t\t\t\tid="fvbChart" showLegend="true" showTitle="false" selectDataPoint="onSelectDataPoint"\n\t\t\t\t\tdataLabelFormatter="{parts:[\'SalesPipelineSetting>/STP2\'], formatter: \'cus.crm.ppm.mgr.util.formatter.setDLFormatter\' }"\n\t\t\t\t\tyAxisLabelFormatter="{parts:[\'SalesPipelineSetting>/STP2\'], formatter: \'cus.crm.ppm.mgr.util.formatter.setYAFormatter\' }" />\n\t\t\t</Panel>\n\t\t</content>\n\t\t<footer>\n\t\t\t<Bar id="masterFooter" translucent="true"></Bar>\n\t\t</footer>\n\t</Page>\n</core:View>',
	"cus/crm/ppm/mgr/view/appSettings.fragment.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<Dialog xmlns:core="sap.ui.core" xmlns="sap.m" id="dlAppSettings"\r\n\ttitle="{i18n>APPSETTINGS_TITLE}">\r\n\t<content>\r\n\t\t<List id="mplSettings" showNoData="false" select="selectDlgSetting"\r\n\t\t\tmode="SingleSelectMaster">\r\n\t\t\t<items>\r\n\t\t\t\t<StandardListItem id="sliSaTa" icon="sap-icon://sales-order-item"\r\n\t\t\t\t\ttitle="{i18n>SALESTARGET_ITEM}" type="Navigation"></StandardListItem>\r\n\t\t\t</items>\r\n\t\t</List>\r\n\t</content>\r\n\t<beginButton>\r\n\t\t<Button id="asButClose" text="{i18n>BTN_CLOSE_APPSETT}" press="closeAppSettDialog"></Button>\r\n\t</beginButton>\r\n</Dialog> ',
	"cus/crm/ppm/mgr/view/opportunitySlider.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<Popover xmlns:core="sap.ui.core" xmlns="sap.m" xmlns:layout="sap.ui.layout"\n\tid="popup" placement="Bottom" showHeader="False" bounce="true"\n\tcontentWidth="400px">\n\t<content width="100%">\n\t\t<Panel>\n\t\t\t<content>\n\t\t\t\t<Label id="sliderLabel" text="{i18n>LBL_ALLTO_SELECTED}"\n\t\t\t\t\ttextAlign="Center" design="Bold"></Label>\n\t\t\t\t<Slider id="opportunitySlider" liveChange="showTopNOpp"></Slider>\n\t\t\t</content>\n\t\t\t<content>\n\t\t\t\t<CheckBox text="{i18n>LBL_CBX_EXCLUDE_LOST}" id="exLostCheck"\n\t\t\t\t\tselect="showTopNOpp"></CheckBox>\n\t\t\t\t<CheckBox text="{i18n>LBL_CBX_EXCLUDE_WON}" id="exWonCheck"\n\t\t\t\t\tselect="showTopNOpp"></CheckBox>\n\t\t\t</content>\n\t\t</Panel>\n\t</content>\n</Popover>',
	"cus/crm/ppm/mgr/view/salesPeriodSettings.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<Dialog xmlns:core="sap.ui.core" xmlns="sap.m" xmlns:layout="sap.ui.layout"\n\tid="dlSalesPeriodSet" showHeader="true">\n\t<customHeader>\n\t\t<Bar>\n\t\t\t<contentLeft>\n\t\t\t\t<Button id="SPnavBack" icon="sap-icon://nav-back" press="navBack"></Button>\n\t\t\t</contentLeft>\n\t\t\t<contentMiddle>\n\t\t\t\t<Label id="titleSP" class="hTitleEN" text="{i18n>AS_SALESTARGET_TITLE}"\n\t\t\t\t\ttextAlign="Center"></Label>\n\t\t\t</contentMiddle>\n\t\t</Bar>\n\t</customHeader>\n\t<content>\n\n\t\t<layout:VerticalLayout id="spVBox" class="settingPad">\n\t\t\t<layout:content>\n\n\t\t\t\t<Label id="lbSP" text="{i18n>LBL_ST_SALESPERIOD}" labelFor="sSP"\n\t\t\t\t\tdesign="Bold"></Label>\n\t\t\t\t<Select id="sSP" items="{PeriodicityTexts>/}"\n\t\t\t\t\tselectedKey="{SettingsForSave>/SalesTargetPeriodicity}">\n\t\t\t\t\t<items>\n\t\t\t\t\t\t<core:Item key="{PeriodicityTexts>ID}" text="{PeriodicityTexts>Description}"></core:Item>\n\t\t\t\t\t</items>\n\t\t\t\t</Select>\n\t\t\t\t<Label id="lbST" text="{i18n>LBL_ST_SALESTARGET}" labelFor="iST"\n\t\t\t\t\tdesign="Bold"></Label>\n\t\t\t\t<Input id="iST"\n\t\t\t\t\tvalue="{path:\'SettingsForSave>/SalesTarget\', formatter:\'cus.crm.ppm.mgr.util.formatter.displayNumbers\'}"></Input>\n\t\t\t\t<Label id="lbCur" text="{i18n>LBL_ST_CURRENCY}" labelFor="sCur"\n\t\t\t\t\tdesign="Bold"></Label>\n\t\t\t\t<Select id="sCur" items="{CurrencyList>/}" selectedKey="{SettingsForSave>/CurrencyCode}">\n\t\t\t\t\t<items>\n\t\t\t\t\t\t<core:Item key="{CurrencyList>CurrencyKey}" text="{CurrencyList>CurrencyKey}"></core:Item>\n\t\t\t\t\t</items>\n\t\t\t\t</Select>\n\t\t\t\t<Label id="lbTiS" text="{i18n>LBL_ST_TIMESPAN}" design="Bold"></Label>\n\t\t\t\t<Label id="lbFrom" text="{i18n>LBL_ST_TIMEFROM}"></Label>\n\t\t\t\t<Select id="sFrom" items="{YearRanges>/}" change="TimespanChange"\n\t\t\t\t\tselectedKey="{SettingsForSave>/TimeFrom}">\n\t\t\t\t\t<items>\n\t\t\t\t\t\t<core:Item key="{YearRanges>TargetStartDate}" text="{YearRanges>TargetYear}"></core:Item>\n\t\t\t\t\t</items>\n\t\t\t\t</Select>\n\t\t\t\t<Label id="lbTo" text="{i18n>LBL_ST_TIMETO}"></Label>\n\t\t\t\t<Select id="sTo" items="{YearRanges>/}" change="TimespanChange"\n\t\t\t\t\tselectedKey="{SettingsForSave>/TimeTo}">\n\t\t\t\t\t<items>\n\t\t\t\t\t\t<core:Item key="{YearRanges>TargetEndDate}" text="{YearRanges>TargetYear}"></core:Item>\n\t\t\t\t\t</items>\n\t\t\t\t</Select>\n\t\t\t</layout:content>\n\t\t</layout:VerticalLayout>\n\t</content>\n\t<beginButton>\n\t\t<Button id="spButSave" text="{i18n>BTN_AS_SAVEAPPSETT}" press="saveAppSetChange"></Button>\n\t</beginButton>\n\t<endButton>\n\t\t<Button id="spButCancel" text="{i18n>BTN_AS_CANCELAPPSETT}"\n\t\t\tpress="saveAppSetChange"></Button>\n\t</endButton>\n</Dialog> ',
	"sap/crm/Bubble.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.crm.Bubble");
sap.ui.core.Element.extend("sap.crm.Bubble", {
	metadata : {
		properties : {
			"key" : {
				type : "any",
				defaultValue : null
			},
			"x" : {
				type : "any",
				defaultValue : null
			},
			"y" : {
				type : "any",
				defaultValue : 0.0
			},
			"z" : {
				type : "any",
				defaultValue : 0.0
			},
			"description" : {
				type : "string",
				defaultValue : ""
			}
		}
	}
});
},
	"sap/crm/BubbleChart.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// Bubble Item

jQuery.sap.declare("sap.crm.BubbleChart");
jQuery.sap.require("sap.m.library");
jQuery.sap.require("sap.ui.core.Control");

// Bubble Chart
sap.ui.core.Control
		.extend(
				"sap.crm.BubbleChart",
				{

					// the control API:
					metadata : {

						// ---- object ----
						publicMethods : [
						// methods
						"stepUp", "stepDown" ],

						properties : {
							"xStart" : {
								type : "any",
								defaultValue : null
							},

							"xEnd" : {
								type : "any",
								defaultValue : null
							},

							"xFStart" : {
								type : "any",
								defaultValue : null
							},

							"xFEnd" : {
								type : "any",
								defaultValue : null
							},

							"xLabelTexts" : {
								type : "any",
								defaultValue : []
							},

							"xLabelValues" : {
								type : "any",
								defaultValue : []
							},

							"yFStart" : {
								type : "any",
								defaultValue : null
							},
							"yFEnd" : {
								type : "any",
								defaultValue : null
							},

							"yStart" : {
								type : "any",
								defaultValue : null
							},
							"yEnd" : {
								type : "any",
								defaultValue : null
							},

							"yLabelTexts" : {
								type : "any",
								defaultValue : []
							},

							"yLabelValues" : {
								type : "any",
								defaultValue : []
							},

							"maxBubbleValue" : {
								type : "any",
								defaultValue : 1
							},

							"minBubbleValue" : {
								type : "any",
								defaultValue : 0
							},

							"bubbleStepValue" : {
								type : "any",
								defaultValue : 1
							},

							"visible" : {
								type : "boolean",
								defaultValue : true
							},

							"readonly" : {
								type : "boolean",
								defaultValue : false
							}

						},
						aggregations : {
							"items" : {
								type : "sap.crm.Bubble",
								multiple : true,
								singularName : "item"
							},
							defaultAggregation : "items",
						},
						events : {
							"change" : {},
							"liveChange" : {},
							"click" : {}
						}
					},

					_initVariable : function() {
						this._firstTime = false;
						this._handleRsize = 15;
						this._outerbubbleRsize = 0.3;
						this._outerbubble;
						this._handle;
						this._originalbubble;
						this._selectedbubble;
						this._overLappingBubbles;
						this._ghostline;
						this._skip = false;
						this._margin = {
							top : 40,
							right : 0,
							bottom : 40,
							left : 50
						};
						this.leftPadding = 38;
						this._containerWidth = 600;
						this._containerHeight = 0.5 * window.innerHeight;
						this._data = [];
						this._widthchartarea;
						this._heightchartarea;
						this._vis;
						this._xScale;
						this._yScale;
						this._rScale;
						this._bubbleMinRsize = 25;
						this._bubbleMaxRsize = 400;
						this._bubbleMinValue = 0;
						this._bubbleMaxValue = 1;
						this._bubbleStepValue = 0.01;
						this.xLabelHeight = 0.8;
						this._xAxis = {
							xStart : 0,
							xEnd : 0,
							xLabelTexts : [],
							xLabelValues : [],
							xSegStart : 0,
							xSegEnd : 0

						};

						this._yAxis = {
							yStart : 0,
							yEnd : 0,
							yLabelTexts : [],
							yLabelValues : [],
							ySegStart : 0,
							ySegEnd : 0

						};
						this._popover = null;

						this._readOnly = this.getReadonly();
					},

					redraw : function(xAxis, yAxis) {

						this._xAxis = xAxis;
						this._yAxis = yAxis;
						this._unregisterListener();
						this._bubbleMaxValue = this.getMaxBubbleValue();
						this._bubbleMinValue = this.getMinBubbleValue();
						this._bubbleStepValue = this.getBubbleStepValue();
						this._readOnly = this.getReadonly();
						this._redraw();
						this._registerListener();
					},

					_redraw : function() {

						var _chartControl = this;
						var arc;
						var aItems = this.getItems();
						var minCX, maxCY, minCY, maxCX;

						this._containerWidth = jQuery.sap.byId(this.sId)
								.width();
						/*
						 * this._containerHeight = screen.availHeight;
						 * this._containerHeight = 480;
						 */
						this._containerHeight = 0.5 * window.innerHeight;
						this._widthchartarea = this._containerWidth
								- this._margin.right - this._margin.left - 40;
						this._heightchartarea = this._containerHeight
								- this._margin.top - this._margin.bottom;

						var myheightchartarea = this._heightchartarea;
						var mywidthchartarea = this._widthchartarea;

						var Tooltip_Width = 160;
						var Tooltip_Height = 140;
						var ToolTip_BgColor = "#000005";
						var ToolTipText_Color = "#ffffff";
						var ToolTipText_FontSize = "12px";

						minCX = this._margin.left + this.leftPadding;
						maxCX = minCX + this._widthchartarea;
						minCY = this._margin.top;
						maxCY = minCY + this._heightchartarea;

						if (this._vis)
							this._vis.remove();
						if (this._svg)
							this._svg.remove();

						// $("#" + this.getId()).click(click_bubble);
						if ((this._containerWidth <= 0)
								|| (this._containerHeight <= 0))
							return;

						this._svg = d3.select("#" + this.getId()).append("svg")
								.attr("class", "svg").attr("height",
										this._containerHeight).attr("width",
										this._containerWidth);

						this._vis = this._svg.append("g");

						this._xScale = d3.time.scale().domain(
								[ this._xAxis.xStart, this._xAxis.xEnd ])
								.range([ 0, this._widthchartarea ]);
						// Switch between WAVE 3 & WAVE 4
						this._bubbleMaxRsize = (cal_x(this._xAxis.xSegEnd) - cal_x(this._xAxis.xSegStart));
						// this._bubbleMaxRsize = this._containerHeight;

						this._yScale = d3.scale.linear().domain(
								[ this._yAxis.yStart, this._yAxis.yEnd ])
								.range([ this._heightchartarea, 0 ]);
						this._data = [];
						for ( var i = 0; i < aItems.length; i++) {
							var oEntry = {};
							for ( var j in aItems[i].mProperties) {
								oEntry[j] = aItems[i].mProperties[j];
							}
							if ((this._xAxis.xStart <= new Date(oEntry.x))
									&& (this._xAxis.xEnd >= new Date(oEntry.x)))
								this._data.push(oEntry);
						}

						this._rScale = d3.scale.linear().domain(
								[ this._bubbleMinValue, this._bubbleMaxValue ])
								.range(
										[ this._bubbleMinRsize,
												this._bubbleMaxRsize ]);

						function make_y_axis() {

							return (d3.svg.axis().scale(_chartControl._yScale)
									.orient("left").tickValues(
											_chartControl._yAxis.yLabelValues)
									.tickPadding(16).tickFormat(function(d, i) {
								return (_chartControl._yAxis.yLabelTexts[i]);
							}));

						}

						function cal_x(x) {
							return _chartControl._xScale(x)
									+ (_chartControl._margin.left)
									+ (_chartControl.leftPadding);
						}

						function cal_y(y) {
							return ((_chartControl._margin.top) + (_chartControl
									._yScale(y)));
						}

						function cal_inv_x(x) {
							var value = (_chartControl._xScale.invert(x
									- (_chartControl._margin.left)
									- (_chartControl.leftPadding)));
							var rem = value.getTime() % 86400000;
							value = value - rem;
							var rem = Math.round(rem / 86400000) * 86400000;
							value = value + rem;
							return new Date(value);

						}

						function cal_inv_y(y) {
							var value = (_chartControl._yScale.invert(y
									- (_chartControl._margin.top)));
							var rem = value % 1;
							value = value - rem;
							var rem = Math.round(rem / 1) * 1;
							value = value + rem;
							return value;

						}
						function cal_outer_bubble_r(r) {
							return (r * _chartControl._outerbubbleRsize);
							// return r;
						}
						function cal_r(r) {
							return _chartControl._rScale(r);
						}

						function cal_inv_r(r) {
							/*
							 * var value = _chartControl._rScale.invert(r); var
							 * rem = value % _chartControl._bubbleStepValue;
							 * value = value - rem; var rem = Math.round(rem /
							 * _chartControl._bubbleStepValue)
							 * _chartControl._bubbleStepValue; value = value +
							 * rem; return value;
							 */
							var value = _chartControl._rScale.invert(r);
							return Math.round(value);
						}

						// y axis

						this._vis
								.append("g")
								.attr("class", "grid")
								.attr("height", "5")
								.attr(
										"transform",
										("translate("
												+ (this._margin.left + this.leftPadding)
												+ "," + this._margin.top + ")"))
								.call(
										make_y_axis().tickSize(
												-this._widthchartarea, 0, 1))
								.attr("pointer-events", "none");

						var yAxisText = this.getModel("i18n").getProperty(
								"LBL_OD_CHANCEOFSUCCESS"), that = this, bIsRTL = sap.ui
								.getCore().getConfiguration().getRTL(), oBrowser = sap.ui.Device.browser;
						if (bIsRTL
								&& oBrowser.name !== oBrowser.BROWSER.INTERNET_EXPLORER) {
							var aTextElems = this._vis.selectAll("text")[0];
							for ( var ii = 0, jj = aTextElems.length; ii < jj; ii++)
								aTextElems[ii].setAttribute("text-anchor",
										"start");
						}

						$(window).on("orientationchange", function(event) {
							if (this.flg != event.orientation) {
								if (event.orientation == "landscape") {
									that.xLabelHeight = 0.92;
								} else if (event.orientation == "portrait") {
									that.xLabelHeight = 0.8;
								}
							}
							this.flg = event.orientation;
						});

						this._vis.append("text").attr("class", "y label").attr(
								"y", 16).attr(
								"x",
								-(window.innerHeight - that.xLabelHeight
										* window.innerHeight)).style(
								"font-size", "0.75rem").attr("dy", ".75em")
								.attr("text-anchor", "end").attr("transform",
										"rotate(-90)").text(yAxisText);
						var oYLabel = 0;
						if (sap.ui.Device.system.phone)
							oYLabel = this._vis.selectAll("text")[0][3];
						else
							oYLabel = this._vis.selectAll("text")[0][6];
						// var iYLblLength = oYLabel.textLength.baseVal.value;
						var iYLblLength = oYLabel.getComputedTextLength();
						var iSetVal = (iYLblLength - this._containerHeight) / 2;
						if (bIsRTL) {
							if (oBrowser.name === oBrowser.BROWSER.INTERNET_EXPLORER) {
								oYLabel.setAttribute('text-anchor', "start");
								iYLblLength = oYLabel.getComputedTextLength();
								iSetVal = (iYLblLength - this._containerHeight) / 2;
							}
							oYLabel.setAttribute('x', iSetVal - iYLblLength);
						} else
							oYLabel.setAttribute('x', iSetVal);
						var arrLV = this._xAxis.xLabelValues[""] ? this._xAxis.xLabelValues[""]
								: this._xAxis.xLabelValues;
						// x axis
						this._vis
								.append("g")
								.attr("height", "5")
								.attr("class", "x axis")
								.attr(
										"transform",
										("translate("
												+ (this._margin.left + this.leftPadding)
												+ ","
												+ (this._heightchartarea + this._margin.top) + ")"))
								.call(
										d3.svg
												.axis()
												.scale(this._xScale)
												.orient("bottom")
												.tickValues(arrLV)
												.tickPadding(16)
												.tickFormat(
														function(d, i) {
															/*
															 * if
															 * (_chartControl._xAxis.xLabelTexts.length >
															 * 12) if (i % 4 ==
															 * 0) return
															 * (_chartControl._xAxis.xLabelTexts[i]);
															 * else return "";
															 * else
															 */
															var arrLT = _chartControl._xAxis.xLabelTexts[""] ? _chartControl._xAxis.xLabelTexts[""]
																	: _chartControl._xAxis.xLabelTexts;
															if (i > 0) {
																var objText;
																if (sap.ui.Device.system.phone) {
																	objText = d3
																			.selectAll('.tick')[0][3];
																} else {
																	objText = d3
																			.selectAll('.tick')[0][6];
																}
																var length = sap.ui.version < "1.25" ? objText.parentNode.childNodes[1].textLength.baseVal.value
																		: objText.childNodes[1].textLength.baseVal.value;
																length = length + 10;
																var maxLbl = Math
																		.floor(_chartControl._widthchartarea
																				/ length);
																var skipCount = Math
																		.ceil(arrLT.length
																				/ maxLbl);

																if (arrLT.length > maxLbl) {
																	if (i
																			% skipCount == 0)
																		return (arrLT[i]);
																	else
																		return "";
																} else {
																	return (arrLT[i]);
																}
															} else {
																return (arrLT[i]);
															}
														})).attr(
										"pointer-events", "none");
						if (this._xAxis.xSegStart >= this._xAxis.xStart)
							this._vis.append("line").attr("x1",
									cal_x(this._xAxis.xSegStart)).attr("y1",
									this._margin.top).attr("x2",
									cal_x(this._xAxis.xSegStart)).attr("y2",
									this._margin.top + this._heightchartarea)
									.style("stroke", "rgba(63,183,227,1)")
									.attr("stroke-width", "1").attr(
											"pointer-events", "none").attr(
											"stroke-dasharray", ("4,2"));
						;

						if (this._xAxis.xSegEnd <= this._xAxis.xEnd)
							this._vis.append("line").attr("x1",
									cal_x(this._xAxis.xSegEnd)).attr("y1",
									this._margin.top).attr("x2",
									cal_x(this._xAxis.xSegEnd)).attr("y2",
									this._margin.top + this._heightchartarea)
									.style("stroke", "rgba(63,183,227,1)")
									.attr("stroke-width", "1").attr(
											"pointer-events", "none").attr(
											"stroke-dasharray", ("4,2"));
						;

						/* bubbles */

						/* bubbles and Text grouping */

						var elem = this._vis.selectAll("g bubbles").data(
								this._data);

						var elemEnter = elem.enter().append("g");
						// var elemEnter = elem.enter().append("g").attr(
						// "transform",
						// function(d) {
						// return "transform(" + cal_x(d.x) + ","
						// + cal_y(d.y) + ")";
						// });

						/* Bubbles Creation */

						elemEnter.append("circle").data(this._data).attr(
								"class", "circle").attr("id", function(d) {
							return (d.key);
						}).attr("class", "bubbles").attr("cx", function(d) {
							return cal_x(d.x);
						}).attr("cy", function(d) {
							return cal_y(d.y);
						}).attr("r", function(d) {
							return cal_r(d.z);
						}).style("fill", "rgba(92,186,230,0.75)").style(
								"stroke", "rgba(92,186,230,1)").style(
								"stroke-width", "1").on("click", clickbubble);

						/* Text Creation */
						if (oBrowser.name == oBrowser.BROWSER.INTERNET_EXPLORER) {

							elemEnter
									.append("text")
									.attr("id", (function(d) {
										return (d.key + "text");
									}))
									.attr("dx", function(d) {
										return cal_x(d.x) - cal_r(0.5 * (d.z));
									})
									.attr("dy", function(d) {
										return (cal_y(d.y));
									})
									.attr("x", "3")
									.attr("text-anchor", "start")
									.style("font-size", "12px")
									.text(function(d) {

									})
									.each(
											function(d) {

												var svgNS = "http://"
														+ "www.w3.org/2000/svg";

												// var text = "asdf
												// qwerty_zxcv*upio_pkmpm&zxcvv
												// qwerty";
												var text = d.description, iCutIndex = 0, words = [], sCopy = text;
												while (sCopy.search(/\W|\s|_/i) != -1) {
													iCutIndex = sCopy
															.search(/\W|\s|_/i) + 1;
													words.push(sCopy.substring(
															0, iCutIndex));
													sCopy = sCopy
															.substring(iCutIndex);
												}
												words.push(sCopy);
												// var words = text.split(' ');
												var text_element = document
														.getElementById(d.key
																+ "text");
												var tspan_element = document
														.createElementNS(svgNS,
																"tspan");
												// Create first tspan element
												var text_node = document
														.createTextNode(words[0]);
												// Create text in tspan element

												tspan_element
														.appendChild(text_node);
												// Add tspan element to DOM
												text_element
														.appendChild(tspan_element);

												for ( var i = 1; i < words.length; i++) {
													var len = tspan_element.firstChild.data.length;
													// Find number of letters in
													// string
													tspan_element.firstChild.data += words[i];
													// Add next word

													if (tspan_element
															.getComputedTextLength() > (cal_r(d.z) * Math
															.sqrt(2))) {
														tspan_element.firstChild.data = tspan_element.firstChild.data
																.slice(0, len);
														// Remove added word

														var tspan_element = document
																.createElementNS(
																		svgNS,
																		"tspan");
														// Create new tspan
														// element
														tspan_element
																.setAttributeNS(
																		null,
																		"x",
																		(cal_x(d.x) - cal_r(0.5 * (d.z))) + 2);
														tspan_element
																.setAttributeNS(
																		null,
																		"dy",
																		18);
														text_node = document
																.createTextNode(words[i]);
														tspan_element
																.appendChild(text_node);
														text_element
																.appendChild(tspan_element);

													}

												}
												for ( var j = 1; j < words.length; j++) {
													if (text_element.getBBox().height
															* Math.sqrt(2) > (cal_r(d.z) * Math
															.sqrt(2))) {
														var lastChild = text_element.lastChild;
														text_element
																.removeChild(lastChild);

													}
												}

											});
						}

						else {
							elemEnter.append("foreignObject").attr('width',
									function(d) {
										return (Math.sqrt(2) * cal_r(d.z));
									}).attr('height', function(d) {
								return (Math.sqrt(2) * cal_r(d.z));
							}).attr(
									"x",
									function(d) {
										return (cal_x(d.x) - (cal_r(d.z) / Math
												.sqrt(2)));
									}).attr(
									"y",
									function(d) {
										return (cal_y(d.y) - (cal_r(d.z) / Math
												.sqrt(2)));
									}).style("pointer-events", "none").append(
									"xhtml:div").attr("class", "circleText")
									.style("pointer-events", "none").style(
											"position", "inherit").style(
											"height",
											function(d) {
												return (Math.sqrt(2)
														* cal_r(d.z) + "px");
											}).style(
											"width",
											function(d) {
												return (Math.sqrt(2)
														* cal_r(d.z) + "px");
											}).text(function(d) {
										return d.description;
									});

						}

						// Tooltip
						var tooltip = this._vis.append("g").style("display",
								"none");

						var tooltipcontent = tooltip.append("rect").attr(
								"fill", ToolTip_BgColor).attr("width",
								Tooltip_Width).attr("height", Tooltip_Height)
								.style("opacity", 0.5);
						var expectedRevenue = this.getModel("i18n")
								.getProperty("LBL_OD_EXPECTEDREVENUEHEADER");
						var bIsRTL = sap.ui.getCore().getConfiguration()
								.getRTL(), sAnchorVal = "left", iXoffset = bIsRTL ? Tooltip_Width - 5
								: 5;
						tooltip.append("text").attr("x", iXoffset)
								.attr("y", 20).attr("text-anchor", sAnchorVal)
								.attr("font-size", ToolTipText_FontSize).attr(
										"font-weight", "bold").attr("fill",
										ToolTipText_Color)
								.text(expectedRevenue);
						var closingDate = this.getModel("i18n").getProperty(
								"LBL_OD_ENDDATE");

						tooltip.append("text").attr("x", iXoffset)
								.attr("y", 60).attr("text-anchor", sAnchorVal)
								.attr("font-size", ToolTipText_FontSize).attr(
										"font-weight", "bold").attr("fill",
										ToolTipText_Color).text(closingDate);

						tooltip.append("text").attr("x", iXoffset).attr("y",
								100).attr("text-anchor", sAnchorVal).attr(
								"font-size", ToolTipText_FontSize).attr(
								"font-weight", "bold").attr("fill",
								ToolTipText_Color).text(yAxisText);

						var t1 = tooltip.append("text").attr("x", iXoffset)
								.attr("y", 40).attr("text-anchor", sAnchorVal)
								.attr("font-size", ToolTipText_FontSize).attr(
										"font-weight", "bold").attr("fill",
										ToolTipText_Color);
						var t2 = tooltip.append("text").attr("x", iXoffset)
								.attr("y", 80).attr("text-anchor", sAnchorVal)
								.attr("font-size", ToolTipText_FontSize).attr(
										"font-weight", "bold").attr("fill",
										ToolTipText_Color);

						var t3 = tooltip.append("text").attr("x", iXoffset)
								.attr("y", 120).attr("text-anchor", sAnchorVal)
								.attr("font-size", ToolTipText_FontSize).attr(
										"font-weight", "bold").attr("fill",
										ToolTipText_Color);

						function display_tooltip(display) {
							if (!display)
								tooltip.style("display", "none");
							else
								/* tooltip.style("display", "inherit"); */
								tooltip.style("display", "inline");
						}

						function move_tooltip() {

							if (_chartControl._selectedbubble.cy.baseVal.value <= Tooltip_Height / 2
									&& _chartControl._selectedbubble.cx.baseVal.value >= mywidthchartarea) {

								var xpos = _chartControl._selectedbubble.cx.baseVal.value
										- _chartControl._selectedbubble.r.baseVal.value
										- cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value)
										- Tooltip_Width - 10;
								var ypos = _chartControl._selectedbubble.cy.baseVal.value
										- (Tooltip_Height / 4);

								tooltip.selectAll('path').remove();
								var x = Tooltip_Width + 10;
								var y = Tooltip_Height / 4;

								var toolArrow = tooltip.append('path').style(
										"fill", ToolTip_BgColor).style(
										"opacity", 0.5).attr(
										'd',
										function(d) {

											return 'M ' + x + ' ' + y
													+ ' l -10 -10 l  0 20 z';

											'M  0 0 l -4 -4 l 8 0 z'
										});

							}

							else if (_chartControl._selectedbubble.cy.baseVal.value >= myheightchartarea
									&& _chartControl._selectedbubble.cx.baseVal.value >= mywidthchartarea) {
								var xpos = _chartControl._selectedbubble.cx.baseVal.value
										- _chartControl._selectedbubble.r.baseVal.value
										- cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value)
										- Tooltip_Width - 10;
								var ypos = _chartControl._selectedbubble.cy.baseVal.value
										- (Tooltip_Height);

								tooltip.selectAll('path').remove();
								var x = Tooltip_Width + 10;
								var y = Tooltip_Height - 10;

								var toolArrow = tooltip.append('path').style(
										"fill", ToolTip_BgColor).style(
										"opacity", 0.5).attr(
										'd',
										function(d) {

											return 'M ' + x + ' ' + y
													+ ' l -10 -10 l  0 20 z';

											'M  0 0 l -4 -4 l 8 0 z'
										});

							}

							else if (_chartControl._selectedbubble.cy.baseVal.value >= myheightchartarea) {
								var xpos = _chartControl._selectedbubble.cx.baseVal.value
										- (Tooltip_Width / 2);
								var ypos = _chartControl._selectedbubble.cy.baseVal.value
										- _chartControl._selectedbubble.r.baseVal.value
										- cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value)
										- (Tooltip_Height) - 10;
								tooltip.selectAll('path').remove();
								var x = Tooltip_Width / 2, y = Tooltip_Height + 10;
								var toolArrow = tooltip.append('path').style(
										"fill", ToolTip_BgColor).style(
										"opacity", 0.5).attr(
										'd',
										function(d) {

											return 'M ' + x + ' ' + y
													+ 'l -10 -10 l 20 0 z';

										});
							}

							else if (_chartControl._selectedbubble.cy.baseVal.value <= Tooltip_Height / 2) {

								var xpos = _chartControl._selectedbubble.cx.baseVal.value
										- (Tooltip_Width / 2);
								var ypos = _chartControl._selectedbubble.cy.baseVal.value
										+ _chartControl._selectedbubble.r.baseVal.value
										+ cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value)
										+ (Tooltip_Height / 5);
								tooltip.selectAll('path').remove();
								var x = Tooltip_Width / 2, y = -10;
								var toolArrow = tooltip.append('path').style(
										"fill", ToolTip_BgColor).style(
										"opacity", 0.5).attr(
										'd',
										function(d) {

											return 'M ' + x + ' ' + y
													+ 'l 10 10 l -20 0 z';

										});

							}

							else if (_chartControl._selectedbubble.cx.baseVal.value >= mywidthchartarea
									- Tooltip_Width * 2) {

								var xpos = _chartControl._selectedbubble.cx.baseVal.value
										- _chartControl._selectedbubble.r.baseVal.value
										- cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value)
										- Tooltip_Width - 10;
								var ypos = _chartControl._selectedbubble.cy.baseVal.value
										- (Tooltip_Height / 2);

								tooltip.selectAll('path').remove();
								var x = Tooltip_Width + 10;
								var y = Tooltip_Height / 2;

								var toolArrow = tooltip.append('path').style(
										"fill", ToolTip_BgColor).style(
										"opacity", 0.5).attr(
										'd',
										function(d) {

											return 'M ' + x + ' ' + y
													+ ' l -10 -10 l  0 20 z';

											'M  0 0 l -4 -4 l 8 0 z'
										});

							} else {

								var xpos = _chartControl._selectedbubble.cx.baseVal.value
										+ _chartControl._selectedbubble.r.baseVal.value
										+ cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value)
										+ 10;
								var ypos = _chartControl._selectedbubble.cy.baseVal.value

										- (Tooltip_Height / 2);

								tooltip.selectAll('path').remove();
								var x = -10;
								var y = Tooltip_Height / 2;
								var toolArrow = tooltip.append('path').style(
										"fill", ToolTip_BgColor).style(
										"opacity", 0.5).attr(
										'd',
										function(d) {

											return 'M ' + x + ' ' + y
													+ ' l 10 10 l 0 -20 z';
										});
							}

							tooltip.attr("transform", "translate(" + xpos + ","
									+ ypos + ")")
							t1
									.text(cal_inv_r(_chartControl._selectedbubble.r.baseVal.value));
							t2
									.text(sap.ui.core.format.DateFormat
											.getDateInstance({
												style : "medium"
											})
											.format(
													cal_inv_x(_chartControl._selectedbubble.cx.baseVal.value)));
							t3
									.text(cal_inv_y(_chartControl._selectedbubble.cy.baseVal.value)
											+ "%")
						}

						// Action sheet

						function clickbubble() {

							if (_chartControl._selectedbubble) {
								if (_chartControl._outerbubble) {
									d3.select(_chartControl._outerbubble[0][0])
											.remove();
								}
								if (_chartControl._handle) {
									d3.select(_chartControl._handle[0][0])
											.remove();
								}

								d3.select(_chartControl._selectedbubble).style(
										"stroke-width", "1").style("fill",
										"rgba(92,186,230,0.8)").style("stroke",
										"	rgba(92,186,230,1)").call(
										d3.behavior.drag()
												.on("dragstart", null).on(
														"drag", null).on(
														"dragend", null)).on(
										"touchstart", null).on("touchmove",
										null).on("touchend", null);

							}

							_chartControl._selectedbubble = this;
							_chartControl._overLappingBubbles = overlapping_bubbles();

							arc = d3.svg
									.arc()
									.innerRadius(
											_chartControl._selectedbubble.r.baseVal.value)
									.outerRadius(
											_chartControl._selectedbubble.r.baseVal.value
													+ cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value))
									.startAngle(0).endAngle(360);

							var transform = "translate("
									+ _chartControl._selectedbubble.cx.baseVal.value
									+ ","
									+ _chartControl._selectedbubble.cy.baseVal.value
									+ ")";

							_chartControl._outerbubble = _chartControl._vis
									.append("path").attr("d", arc).attr(
											"transform", transform).style(
											"fill", "rgba(255,255,255,0.9)")
									.style("stroke", "rgba(0,143,211,0.5)")
									.style("stroke-width", "1").on("click",
											click_circle);

							if (_chartControl._readOnly == false) {
								_chartControl._handle = _chartControl._vis
										.append("circle")
										.attr("id", "drag_cicle2")
										.attr("class", "bubbles")
										.attr(
												"cy",
												_chartControl._selectedbubble.cy.baseVal.value
														+ _chartControl._selectedbubble.r.baseVal.value
														+ cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value))
										.attr(
												"cx",
												_chartControl._selectedbubble.cx.baseVal.value)
										.attr("r", _chartControl._handleRsize)
										.style("fill", "rgba(151,156,163,0.8)")
										.style("stroke", "rgba(151,156,163,1)")
										.style("stroke-width", "1").call(
												d3.behavior.drag().on(
														"dragstart",
														resize_start).on(
														"drag", resize).on(
														"dragend", resize_end))
										.on("touchstart", resize_start).on(
												"touchmove", resize).on(
												"touchend", resize_end);
							}

							_chartControl._selectedbubble.parentNode.parentNode
									.appendChild(_chartControl._selectedbubble.parentNode);

							d3.select(_chartControl._selectedbubble).style(
									"fill", "rgba(0,143,211,0.8)").style(
									"stroke", "rgba(153,209,1,1)").style(
									"stroke-width", "1").style(
									"stroke-dasharray", ("1,1"));

							if (_chartControl._readOnly == false) {
								d3.select(_chartControl._selectedbubble).call(
										d3.behavior.drag().on("dragstart",
												move_start).on("drag", move)
												.on("dragend", move_end)).on(
										"touchstart", move_start).on(
										"touchmove", move).on("touchend",
										move_end);
							} else {
								_chartControl._skip = true;
							}

							var _chartNew = _chartControl;
							var f2 = function() {
								// _chartControl = _chartNew;
								_chartNew
										.fireClick({
											item : {
												key : _chartNew._selectedbubble.__data__.key,
												description : _chartNew._selectedbubble.__data__.description,
												x : cal_inv_x(_chartNew._selectedbubble.cx.baseVal.value),
												y : cal_inv_y(_chartNew._selectedbubble.cy.baseVal.value),
												z : cal_inv_r(_chartNew._selectedbubble.r.baseVal.value),
												selected : _chartNew._selectedbubble,
												handle : _chartNew._handle,
												overlappedbubbles : _chartNew._overLappingBubbles
											}
										});
							};

							if (!(_chartControl._skip)) {

								if (!(document.getElementById("Infopopup"))) {

									function closei() {
										_chartControl.oPopover.close();
									}

									_chartControl.oPopover = new sap.m.ActionSheet(
											{
												placement : sap.m.PlacementType.Auto,
												showHeader : false,
												offsetX : 25,
												offsetY : 10,
												id : "Infopopup",
												enableScrolling : false,
												afterOpen : function() {
													window.setTimeout(closei,
															5000);

												},

												buttons : [ new sap.m.Button({
													icon : "sap-icon://hint",
													press : f2
												})

												],
											});
								}
								_chartControl.oPopover
										.openBy(document
												.getElementById(_chartControl._selectedbubble.__data__.key));
								_chartControl.oPopover._parent

								.addStyleClass("cusCrmSalesPipelineSimAS");

							} else {
								_chartControl._skip = false;
								_chartControl
										.fireClick({
											item : {
												key : _chartControl._selectedbubble.__data__.key,
												description : _chartControl._selectedbubble.__data__.description,
												x : cal_inv_x(_chartControl._selectedbubble.cx.baseVal.value),
												y : cal_inv_y(_chartControl._selectedbubble.cy.baseVal.value),
												z : cal_inv_r(_chartControl._selectedbubble.r.baseVal.value),
												selected : _chartControl._selectedbubble,
												handle : _chartControl._handle,
												overlappedbubbles : _chartControl._overLappingBubbles
											}
										});
							}

						}

						function overlapping_bubbles() {

							var xCo_sel = _chartControl._selectedbubble.cx.baseVal.value;
							var yCo_sel = _chartControl._selectedbubble.cy.baseVal.value;
							var r = _chartControl._selectedbubble.r.baseVal.value;
							var xCo;
							var yCo;
							var overlappingBubbles = [];

							for ( var i = 0; i < _chartControl._data.length; i++) {
								xCo = cal_x(_chartControl._data[i].x);
								yCo = cal_y(_chartControl._data[i].y);
								if (Math.pow((xCo - xCo_sel), 2)
										+ Math.pow((yCo - yCo_sel), 2) <= Math
										.pow(r, 2)) {
									overlappingBubbles
											.push(document
													.getElementById(_chartControl._data[i].key));
								}
								xCo = null;
								yCo = null;
							}
							return overlappingBubbles;
						}

						function click_circle() {

							var coord = d3.mouse(_chartControl._selectedbubble);
							var origin = {
								x : _chartControl._selectedbubble.cx.baseVal.value,
								y : _chartControl._selectedbubble.cy.baseVal.value
							};
							var i_point = {
								x : coord[0],
								y : coord[1]
							};
							var des = findHandleCoordinate(
									origin,
									i_point,
									_chartControl._selectedbubble.r.baseVal.value
											+ cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value));
							_chartControl._handle[0][0].cy.baseVal.value = des.y;
							_chartControl._handle[0][0].cx.baseVal.value = des.x;

							function findHandleCoordinate(origin, ipoint, r) {
								var res = {};

								var interVal = (ipoint.y - origin.y)
										/ (ipoint.x - origin.x);

								var angle = Math.atan(interVal);

								var factor = 1;

								if ((ipoint.x - origin.x) < 0) {
									factor = -1;
								}

								res.x = origin.x + r * Math.cos(angle) * factor;
								res.y = origin.y + r * Math.sin(angle) * factor;

								return res;

							}

						}

						function resize_start() {

							var arc = d3.svg
									.arc()
									.innerRadius(0)
									.outerRadius(
											_chartControl._selectedbubble.r.baseVal.value)
									.startAngle(0).endAngle(360);

							var transform = "translate("
									+ _chartControl._selectedbubble.cx.baseVal.value
									+ ","
									+ _chartControl._selectedbubble.cy.baseVal.value
									+ ")";

							_chartControl._originalbubble = _chartControl._vis
									.append("path").attr("d", arc).attr(
											"transform", transform).style(
											"stroke", "green").style("fill",
											"rgba(0,143,211,0.15)").style(
											"stroke-width", "1").style(
											"stroke-dasharray", ("3, 3")).attr(
											"pointer-events", "none");

						}

						function resize_end() {

							d3.select(_chartControl._originalbubble[0][0])
									.remove();
							display_tooltip(false);
							_chartControl
									.fireChange({
										item : {
											key : _chartControl._selectedbubble.__data__.key,
											description : _chartControl._selectedbubble.__data__.description,
											x : cal_inv_x(_chartControl._selectedbubble.cx.baseVal.value),
											y : cal_inv_y(_chartControl._selectedbubble.cy.baseVal.value),
											z : cal_inv_r(_chartControl._selectedbubble.r.baseVal.value)
										}
									});
						}

						function resize() {

							var coord = [];
							var coord_touch = [];
							if (d3.event.type == "drag") {
								coord = d3.mouse(this);
							}

							if (d3.event.type == "touchmove") {
								coord_touch = d3.touches(this);
								coord[0] = coord_touch[0][0];
								coord[1] = coord_touch[0][1];
							}

							var dx = _chartControl._selectedbubble.cx.baseVal.value
									- coord[0];
							var dy = _chartControl._selectedbubble.cy.baseVal.value
									- coord[1];
							var d = (dx * dx) + (dy * dy);
							var r = Math.sqrt(d);
							var innerR = r
									- cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value);
							if (innerR < _chartControl._bubbleMinRsize
									|| innerR > _chartControl._bubbleMaxRsize)
								return;
							_chartControl._handle[0][0].cy.baseVal.value = coord[1];
							_chartControl._handle[0][0].cx.baseVal.value = coord[0];

							_chartControl._selectedbubble.r.baseVal.value = r
									- cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value);
							arc
									.innerRadius(
											_chartControl._selectedbubble.r.baseVal.value)
									.outerRadius(
											_chartControl._selectedbubble.r.baseVal.value
													+ cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value));
							_chartControl._outerbubble.attr("d", arc);
							if (oBrowser.name !== oBrowser.BROWSER.INTERNET_EXPLORER) {
								d3
										.select(
												_chartControl._selectedbubble.nextElementSibling)
										.attr(
												"x",
												(_chartControl._selectedbubble.cx.baseVal.value - (_chartControl._selectedbubble.r.baseVal.value / Math
														.sqrt(2))))
										.attr(
												"y",
												(_chartControl._selectedbubble.cy.baseVal.value - (_chartControl._selectedbubble.r.baseVal.value / Math
														.sqrt(2))))
										.attr(
												'width',
												(_chartControl._selectedbubble.r.baseVal.value * Math
														.sqrt(2)))
										.attr(
												'height',
												(_chartControl._selectedbubble.r.baseVal.value * Math
														.sqrt(2)));

								/* add this code in function resize() */

								$(
										_chartControl._selectedbubble.nextElementSibling.childNodes)
										.css(
												"height",
												(_chartControl._selectedbubble.r.baseVal.value * Math
														.sqrt(2)))

										.css(
												"width",
												(_chartControl._selectedbubble.r.baseVal.value * Math
														.sqrt(2)));
							}
							display_tooltip(true);
							move_tooltip();

						}

						function move_start() {
							var arc = d3.svg
									.arc()
									.innerRadius(
											_chartControl._selectedbubble.r.baseVal.value)
									.outerRadius(
											_chartControl._selectedbubble.r.baseVal.value)
									.startAngle(0).endAngle(360);

							var transform = "translate("
									+ _chartControl._selectedbubble.cx.baseVal.value
									+ ","
									+ _chartControl._selectedbubble.cy.baseVal.value
									+ ")";

							_chartControl._originalbubble = _chartControl._vis
									.append("path").attr("d", arc).attr(
											"transform", transform).style(
											"stroke", "green").style("fill",
											"rgba(255,255,255,0.1)").style(
											"stroke-width", "1").style(
											"stroke-dasharray", ("3, 3")).attr(
											"pointer-events", "none");

							_chartControl._ghostline = _chartControl._vis
									.append("line")
									.attr(
											"x1",
											_chartControl._selectedbubble.cx.baseVal.value)
									.attr(
											"y1",
											_chartControl._selectedbubble.cy.baseVal.value)
									.attr(
											"x2",
											_chartControl._selectedbubble.cx.baseVal.value)
									.attr(
											"y2",
											_chartControl._selectedbubble.cy.baseVal.value)
									.style("stroke", "green").style(
											"stroke-width", "1").style(
											"stroke-dasharray", ("3, 3")).attr(
											"pointer-events", "none");
							display_tooltip(true);
							move_tooltip();

						}

						function move_end() {
							d3.select(_chartControl._originalbubble[0][0])
									.remove();
							d3.select(_chartControl._ghostline[0][0]).remove();
							_chartControl
									.fireChange({
										item : {
											key : _chartControl._selectedbubble.__data__.key,
											description : _chartControl._selectedbubble.__data__.description,
											x : cal_inv_x(_chartControl._selectedbubble.cx.baseVal.value),
											y : cal_inv_y(_chartControl._selectedbubble.cy.baseVal.value),
											z : cal_inv_r(_chartControl._selectedbubble.r.baseVal.value)
										}
									});
							display_tooltip(false);

						}

						function move() {

							var coord = [];
							var coord_touch = [];

							if (d3.event.type == "drag") {
								coord = d3.mouse(this);
							}
							if (d3.event.type == "touchmove") {
								coord_touch = d3.touches(this);
								coord[0] = coord_touch[0][0];
								coord[1] = coord_touch[0][1];
							}
							if (coord[0] < minCX || coord[0] > maxCX
									|| coord[1] < minCY || coord[1] > maxCY)
								return;
							if (oBrowser.name !== oBrowser.BROWSER.INTERNET_EXPLORER) {

								d3
										.select(
												_chartControl._selectedbubble.nextElementSibling)
										.attr(
												"x",
												(coord[0] - (_chartControl._selectedbubble.r.baseVal.value / Math
														.sqrt(2))))
										.attr(
												"y",
												(coord[1] - (_chartControl._selectedbubble.r.baseVal.value / Math
														.sqrt(2))));
							}

							this.cx.baseVal.value = coord[0];
							this.cy.baseVal.value = coord[1];
							_chartControl._outerbubble.attr("transform",
									"translate(" + this.cx.baseVal.value + ","
											+ this.cy.baseVal.value + ")");
							_chartControl._handle[0][0].cy.baseVal.value = this.cy.baseVal.value
									+ this.r.baseVal.value
									+ cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value);
							_chartControl._handle[0][0].cx.baseVal.value = this.cx.baseVal.value;
							d3.select(_chartControl._ghostline[0][0]).attr(
									"x2", coord[0]).attr("y2", coord[1]);
							move_tooltip();

						}

					},

					onAfterRendering : function() {

						var xAxis = {
							xStart : this.getXStart(),
							xEnd : this.getXEnd(),
							xLabelTexts : this.getXLabelTexts(),
							xLabelValues : this.getXLabelValues(),
							xSegStart : this.getXFStart(),
							xSegEnd : this.getXFEnd()

						};

						var yAxis = {
							yStart : parseInt(this.getYStart()),
							yEnd : parseInt(this.getYEnd()),
							yLabelTexts : this.getYLabelTexts(),
							yLabelValues : this.getYLabelValues(),
							ySegStart : parseInt(this.getYFStart()),
							ySegEnd : parseInt(this.getYFEnd())

						};
						this.redraw(xAxis, yAxis);
						var controllerInfo = sap.ca.scfld.md.app.Application
								.getImpl();
						if (controllerInfo.oCurController.FullCtrl.reRenderTopNSlider) {
							controllerInfo.oCurController.FullCtrl
									.showTopNOpp();
							this._unregisterListener();
							this._redraw();
							this._registerListener();
							controllerInfo.oCurController.FullCtrl.reRenderTopNSlider = false;
						}
					},

					setSelection : function(key) {
						this._skip = true;
						document.getElementById(key).__onclick(this._skip);

					}
				});

jQuery.sap.require("sap.ui.core.EnabledPropagator");
sap.ui.core.EnabledPropagator.apply(sap.crm.BubbleChart.prototype, [ true ]);

sap.crm.BubbleChart.M_EVENTS = {
	'change' : 'change',
	'liveChange' : 'liveChange'
};

sap.crm.BubbleChart.prototype.init = function() {
	this._initVariable();

	// device.resize.attachHandler(this.onresize, this);
};

sap.crm.BubbleChart.prototype._unregisterListener = function() {
	if (this._sResizeListenerId) {
		sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
		delete this._sResizeListenerId;
	}
};
sap.crm.BubbleChart.prototype._registerListener = function() {
	this._sResizeListenerId = sap.ui.core.ResizeHandler.register(this
			.getDomRef(), jQuery.proxy(this.onresize, this));
};

sap.crm.BubbleChart.prototype.onresize = function(o) {
	this._unregisterListener();
	this._redraw();
	this._registerListener();
};
},
	"sap/crm/BubbleChartRenderer.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/* Renderer */

jQuery.sap.declare("sap.crm.BubbleChartRenderer");

sap.crm.BubbleChartRenderer = {};

// the part creating the HTML:
// static function
sap.crm.BubbleChartRenderer.render = function(oRm, oControl) {
	// so
	// use the given
	// "oControl" instance
	// instead of "this" in
	// the renderer function
	if (!oControl.getVisible())
		return;

	oRm.write("<div");
	oRm.writeControlData(oControl); // writes the Control ID
	// and enables event
	// handling - important!
	oRm.addClass("bubble"); // add a CSS class for styles
	// common to all control instances
	oRm.writeClasses(); // this call writes the above class
	// plus enables support for
	// Square.addStyleClass(...)
	oRm.write(">");
	oRm.write("</div>");
};
},
	"sap/crm/MDualSlider.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// Provides control sap.m.Slider.
jQuery.sap.declare("sap.crm.MDualSlider");
jQuery.sap.require("sap.m.library");
jQuery.sap.require("sap.ui.core.Control");

sap.ui.core.Control.extend("sap.crm.MDualSlider", {
	metadata : {

		// ---- object ----
		publicMethods : [
		// methods
		"stepUp", "stepDown" ],

		// ---- control specific ----
		library : "sap.m",
		properties : {
			"width" : {
				type : "sap.ui.core.CSSSize",
				group : "Appearance",
				defaultValue : '100%'
			},
			"enabled" : {
				type : "boolean",
				group : "Behavior",
				defaultValue : true
			},
			"visible" : {
				type : "boolean",
				group : "Appearance",
				defaultValue : true
			},
			"name" : {
				type : "string",
				group : "Misc",
				defaultValue : null
			},
			"value" : {
				type : "float",
				group : "Data",
				defaultValue : 0
			},
			"value2" : {
				type : "float",
				group : "Data",
				defaultValue : 1
			}
		},
		aggregations : {
			units : {
				type : "sap.crm.MDualSliderLabel",
				multiple : true,
				singularName : "unit"
			}
		},
		events : {
			"change" : {},
			"liveChange" : {}
		}
	}
});

sap.crm.MDualSlider._bIsRTL = sap.ui.getCore().getConfiguration().getRTL();
sap.crm.MDualSlider.M_EVENTS = {
	'change' : 'change',
	'liveChange' : 'liveChange'
};

// Start of sap\m\Slider.js
jQuery.sap.require("sap.ui.core.EnabledPropagator");
sap.ui.core.EnabledPropagator.apply(sap.crm.MDualSlider.prototype, [ true ]);

/* =========================================================== */
/* begin: lifecycle methods */
/* =========================================================== */

/**
 * Required adaptations before rendering.
 * 
 * @private
 */
sap.crm.MDualSlider.prototype.onBeforeRendering = function() {
	var fMin = 0, units = this.getUnits(), fMax = units.length - 1;
	var fStep = 1, bMinbiggerThanMax = false, bError = false;

	/*
	 * functional dependencies:
	 * 
	 * min -> max max -> min
	 * 
	 * max, min -> step max, min, step -> value
	 * 
	 */
	// if the minimum is lower than or equal to the maximum, log a warning
	if (fMin >= fMax) {
		bMinbiggerThanMax = true;
		bError = true;
		jQuery.sap.log.warning("Warning: " + "Property wrong min: " + fMin
				+ " >= max: " + fMax + " on ", this);
	}
	// if the step is negative or 0, set to 1 and log a warning
	if (fStep <= 0) {
		jQuery.sap.log.warning("Warning: "
				+ "The step could not be negative on ", this);
		fStep = 1;
		// update the step to 1 and suppress re-rendering
		this.setProperty("step", fStep, true);
	}
	// the step can't be bigger than slider range, log a warning
	if (fStep > (fMax - fMin) && !bMinbiggerThanMax) {
		bError = true;
		jQuery.sap.log.warning("Warning: " + "Property wrong step: " + fStep
				+ " > max: " + fMax + " - " + "min: " + fMin + " on ", this);
	}
	// update the value only if there aren't errors
	if (!bError) {
		var iLeftIndex = this.getValue(), iRightIndex = this.getValue2();
		this.setValue(iLeftIndex).setValue2(iRightIndex);
		// get updated values
		iLeftIndex = this.getValue();
		iRightIndex = this.getValue2();
		var iWidth = iRightIndex - iLeftIndex, fRTL = this
				._getPercentFromValue(iRightIndex);
		this._fValue = this._getPercentFromValue(iLeftIndex);
		this._fValue2 = this._getPercentFromValue(iRightIndex);
		this._fWidth = this._getPercentFromValue(iWidth);
		fRTL = iRightIndex == fMax ? 100 - (fRTL + 1) : 100 - (fRTL + 3);
		this._fValueText = this._getPercentFromValue(iLeftIndex) - 1;
		this._fValue2Text = fRTL;
	}
	// flags
	this._bDisabled = !this.getEnabled();
};

/**
 * Required adaptations after rendering.
 * 
 * @private
 */
sap.crm.MDualSlider.prototype.onAfterRendering = function() {
	// slider control container jQuery reference
	this._$SliderContainer = this.$();
	// slider jQuery reference
	this._$Slider = this._$SliderContainer.children(".sapcrmMsli");
	// progress indicator
	this._$ProgressIndicator = this._$Slider.children(".sapcrmMsliProgress");
	// handle jQuery reference
	this._$Handle = this._$Slider.children(".sapcrmMsliHandle");
	// handle for the left handle
	this._$Lhandle = this._$Handle.first();
	// handle for the right handle
	this._$Rhandle = this._$Handle.last();
	// after all calculations, makes the control visible
	this._$SliderContainer.css("visibility", "");
};

/* =========================================================== */
/* end: lifecycle methods */
/* =========================================================== */

/* =========================================================== */
/* begin: event handlers */
/* =========================================================== */

/**
 * Handle the touch start event happening on the slider.
 * 
 * @param {jQuery.EventObject}
 *            oEvent The event object
 * @private
 */
sap.crm.MDualSlider.prototype.ontouchstart = function(oEvent) {
	var $Target = jQuery(oEvent.target), fMin = 0, fMax = this.getUnits().length - 1;
	oEvent.originalEvent._sapui_handledByControl = true;
	if (oEvent.targetTouches.length > 1 || this._bDisabled) {
		// suppress multiTouch events
		return;
	}

	// update the slider measures, those values may change in orientation
	// change
	this._recalculateStyles();
	this._fDiffX = this._fSliderPaddingLeft;
	// initialization
	if ($Target.attr("id") == "left") {
		this._fStartValue = this.getValue();
		this._handle_hold = "left";
		this._$Lhandle.css("background-color", "rgba(0, 124, 192, 0.3)");
		this._$Lhandle.css("border", "0.125rem solid #007cc0");
	} else if ($Target.attr("id") == "right") {
		this._fStartValue = this.getValue2();
		this._handle_hold = "right";
		this._$Rhandle.css("background-color", "rgba(0, 124, 192, 0.3)");
		this._$Rhandle.css("border", "0.125rem solid #007cc0");
	} else if ($Target.attr("id") == "mSlider_bar") {
		this._handle_hold = "bar";
		this._$Lhandle.css("background-color", "rgba(0, 124, 192, 0.3)");
		this._$Lhandle.css("border", "0.125rem solid #007cc0");
		this._$Rhandle.css("background-color", "rgba(0, 124, 192, 0.3)");
		this._$Rhandle.css("border", "0.125rem solid #007cc0");
		var fInteractionVal = (oEvent.targetTouches[0].pageX - this._fDiffX - this._fSliderOffsetLeft)
				/ this._fSliderWidth;
		this.fNewValue_start = fMin + (fInteractionVal * (fMax - fMin));
		if (this._bIsRTL)
			this.fNewValue_start = this
					._convertValueToRTL(this.fNewValue_start);
	}
	this.fireLiveChange({
		value : this.getValue(),
		value2 : this.getValue2()
	});
};

/**
 * Handle the touch move event on the slider.
 * 
 * @param {jQuery.EventObject}
 *            oEvent The event object
 * @private
 */
sap.crm.MDualSlider.prototype.ontouchmove = function(oEvent) {
	if (this._bDisabled) {
		return;
	}
	var fMin = 0, fMax = this.getUnits().length - 1, fInteractionVal = (oEvent.targetTouches[0].pageX
			- this._fDiffX - this._fSliderOffsetLeft)
			/ this._fSliderWidth;
	var fNewValue = fMin + (fInteractionVal * (fMax - fMin));
	if (this._bIsRTL)
		fNewValue = this._convertValueToRTL(fNewValue);

	if (this._handle_hold == "left") {
		// validate, update the the slider value and the UI
		this.setValue(fNewValue);
	} else if (this._handle_hold == "right") {
		// validate, update the the slider value and the UI
		this.setValue2(fNewValue);
	} else if (this._handle_hold == "bar") {
		var fBarInteractionVal = (oEvent.targetTouches[0].pageX - this._fDiffX - this._fSliderOffsetLeft)
				/ this._fSliderWidth;
		this.fNewValue_end = fMin + (fBarInteractionVal * (fMax - fMin));
		if (this._bIsRTL)
			this.fNewValue_end = this._convertValueToRTL(this.fNewValue_end);

		var iLeftIndex = this.getValue(), iRightIndex = this.getValue2(), fDelta = this.fNewValue_end
				- this.fNewValue_start, fStep = 1;
		var iNewVal = iLeftIndex + fDelta, fModStepVal = Math.abs(iNewVal
				% fStep), iNewVal2 = iRightIndex + fDelta, fModStepVal2 = Math
				.abs(iNewVal2 % fStep);
		if (fModStepVal * 2 >= fStep) {
			iNewVal += (fStep - fModStepVal);
			iNewVal2 += (fStep - fModStepVal2);
		} else {
			iNewVal -= fModStepVal;
			iNewVal2 -= fModStepVal2;
		}
		if (iLeftIndex != fMin || iNewVal > iLeftIndex) {
			if (iRightIndex != fMax || iNewVal2 < iRightIndex)
				this.setValue(iNewVal).setValue2(iNewVal2);
		}
		if (iLeftIndex !== iNewVal)
			this.fNewValue_start = this.fNewValue_end;
	}
	this.fireLiveChange({
		value : this.getValue(),
		value2 : this.getValue2()
	});
};

/**
 * Handle the touch end event on the slider.
 * 
 * @private
 */
sap.crm.MDualSlider.prototype.ontouchend = function(oEvent) {
	if (this._handle_hold == "left") {
		this._$Lhandle.css("background-color", "");
		this._$Lhandle.css("border", "");
	} else if (this._handle_hold == "right") {
		this._$Rhandle.css("background-color", "");
		this._$Rhandle.css("border", "");
	} else if (this._handle_hold == "bar") {
		this._$Lhandle.css("background-color", "");
		this._$Lhandle.css("border", "");
		this._$Rhandle.css("background-color", "");
		this._$Rhandle.css("border", "");
	}
	if (this._bDisabled) {
		return;
	}

	// remove active state
	if (this._fStartValue !== this.getValue()) {
		// if the value if not the same
		this.fireChange({
			value : this.getValue(),
			value2 : this.getValue2()
		});
	}
	// remove unused properties
	delete this._fDiffX;
	delete this._fStartValue;
	this._handle_hold = null;
	var controllerInfo = sap.ca.scfld.md.app.Application.getImpl();
	controllerInfo.oCurController.FullCtrl.reRenderTopNSlider = true;
};

/**
 * Handle the touch cancel event on the slider.
 * 
 * @private
 */
sap.crm.MDualSlider.prototype.ontouchcancel = sap.crm.MDualSlider.prototype.ontouchend;

/* ============================================================ */
/* end: event handlers */
/* ============================================================ */

/* =========================================================== */
/* begin: internal methods */
/* =========================================================== */

/**
 * Recalculate styles.
 * 
 * @private
 */
sap.crm.MDualSlider.prototype._recalculateStyles = function() {
	// slider width
	this._fSliderWidth = this._$SliderContainer.width();
	// slider padding left
	this._fSliderPaddingLeft = parseFloat(this._$SliderContainer
			.css("padding-left"));
	// slider offset left
	this._fSliderOffsetLeft = this._$SliderContainer.offset().left;
	// handle width
	this._fHandleWidth = this._$Handle.width();
};

/**
 * Calculate percentage.
 * 
 * @param {float}
 *            fValue the value from the slider
 * @private
 * @returns {float} percent
 */
sap.crm.MDualSlider.prototype._getPercentFromValue = function(fValue) {
	var fMin = 0, fMax = this.getUnits().length - 1;
	return ((fValue - fMin) / (fMax - fMin)) * 100;
};

sap.crm.MDualSlider.prototype._convertValueToRTL = function(fNewValue) {
	var fMin = 0, fMax = this.getUnits().length - 1;
	return fMax - (fMin + fNewValue);
};

sap.crm.MDualSlider.prototype._validateN = function(n) {
	var sTypeofN = typeof n;
	if (sTypeofN === "undefined")
		return 1; // default n = 1
	else if (sTypeofN !== "number") {
		jQuery.sap.log.warning('Warning: n needs to be a number', this);
		return 0;
	} else if (Math.floor(n) === n && isFinite(n)) {
		return n;
	} else {
		jQuery.sap.log
				.warning('Warning: n needs to be a finite interger', this);
		return 0;
	}
};

sap.crm.MDualSlider.prototype._setValue = function(fNewValue) {
	var fMin = 0, units = this.getUnits(), fMax = units.length - 1, fStep = 1, iLeftIndex = this
			.getValue(), iRightIndex = this.getValue2(), fModStepVal = Math
			.abs(fNewValue % fStep), fNewPercent;

	// validate the new value before arithmetic calculations
	if (typeof fNewValue !== "number" || !isFinite(fNewValue)) {
		jQuery.sap.log.error("Error:",
				'"fNewValue" needs to be a finite number of', this);
		return this;
	}

	// round the value to the nearest step
	if (fModStepVal * 2 >= fStep)
		fNewValue += (fStep - fModStepVal);
	else
		fNewValue -= fModStepVal;

	// validate that the value is between maximum and minimum
	fNewValue = fNewValue > fMax ? fMax : fNewValue < fMin ? fMin : fNewValue;
	if (this._handle_hold !== "bar" && this._handle_hold != undefined) {
		if (fNewValue >= iRightIndex) {
			fNewValue = iRightIndex - 1;
			// return;
		}
	}

	// Floating-point in JavaScript are IEEE 64 bit values and has some problems
	// with big decimals.
	// Round the final value to 5 digits after the decimal point.
	fNewValue = Number(fNewValue.toFixed(5));
	if (fNewValue == iRightIndex && this._handle_hold !== "bar")
		return this;
	// update the value and suppress re-rendering
	this.setProperty("value", fNewValue, true);
	this._sValueText = " ";
	this._sValueText = units[fNewValue].getValue();

	// if the value is the same, suppress DOM modifications and event fire
	if (iLeftIndex === this.getValue())
		return this;

	if (this._$SliderContainer) {
		// after re-rendering
		iLeftIndex = this.getValue();
		fNewPercent = this._getPercentFromValue(fNewValue);
		var iWidth = iRightIndex - iLeftIndex, fLeftPercent = this
				._getPercentFromValue(iLeftIndex), sLeft = this._bIsRTL ? "right"
				: "left";
		this._fWidth = this._getPercentFromValue(iWidth);
		this._$ProgressIndicator[0].style.width = this._fWidth + "%";
		this._$ProgressIndicator[0].style[sLeft] = fLeftPercent + "%";
		$("#left_text").css("margin-" + sLeft, fLeftPercent + "%");
		$("#left_text").text(this._sValueText);
		// update the handle position & text
		this._$Handle[0].style[sLeft] = fNewPercent + "%";
		this._$Handle[0].title = this._sValueText;
	}
	return this;
};

sap.crm.MDualSlider.prototype._setValue2 = function(fNewValue) {
	var fMin = 0, units = this.getUnits(), fMax = units.length - 1, fStep = 1, iLeftIndex = this
			.getValue(), iRightIndex = this.getValue2(), fModStepVal = Math
			.abs(fNewValue % fStep), fNewPercent;

	// validate the new value before arithmetic calculations
	if (typeof fNewValue !== "number" || !isFinite(fNewValue)) {
		jQuery.sap.log.error("Error:",
				'"fNewValue" needs to be a finite number of', this);
		return this;
	}

	// round the value to the nearest step
	if (fModStepVal * 2 >= fStep)
		fNewValue += (fStep - fModStepVal);
	else
		fNewValue -= fModStepVal;

	// validate that the value is between maximum and minimum
	fNewValue = fNewValue > fMax ? fMax : fNewValue < fMin ? fMin : fNewValue;
	if ((this._handle_hold !== "bar") && (this._handle_hold != undefined)) {
		if (fNewValue <= iLeftIndex) {
			fNewValue = iLeftIndex + 1;
			return;
		}
	}

	// Floating-point in JavaScript are IEEE 64 bit values and has some problems
	// with big decimals.
	// Round the final value to 5 digits after the decimal point.
	fNewValue = Number(fNewValue.toFixed(5));
	if (fNewValue == iLeftIndex)
		return this;
	// update the value and suppress re-rendering
	this.setProperty("value2", fNewValue, true);
	this._sValue2Text = " ";
	this._sValue2Text = units[fNewValue].getValue();

	// if the value is the same, suppress DOM modifications and event fire
	if (iRightIndex === this.getValue2())
		return this;

	if (this._$SliderContainer) {
		// after re-rendering
		iRightIndex = this.getValue2();
		fNewPercent = this._getPercentFromValue(fNewValue);
		var iWidth = iRightIndex - iLeftIndex, fRightPercent = this
				._getPercentFromValue(iRightIndex), sLeft, sRight;
		if (this._bIsRTL) {
			sLeft = "right";
			sRight = "left";
		} else {
			sLeft = "left";
			sRight = "right";
		}
		this._fWidth = this._getPercentFromValue(iWidth);
		this._$ProgressIndicator[0].style.width = this._fWidth + "%";
		this._$ProgressIndicator[0].style[sRight] = fRightPercent + "%";
			fRightPercent = fNewValue == fMax ? 100 - (fRightPercent + 1)
					: 100 - (fRightPercent + 3);
		$("#right_text").css("margin-" + sRight, fRightPercent + "%");
		$("#right_text").text(this._sValue2Text);
		// update the handle position
		this._$Handle[1].style[sLeft] = fNewPercent + "%";
		this._$Handle[1].title = this._sValue2Text;
	}
	return this;
};

/* =========================================================== */
/* end: internal methods */
/* =========================================================== */

/* =========================================================== */
/* begin: API method */
/* =========================================================== */

sap.crm.MDualSlider.prototype.stepUp = function(n) {
	return this.setValue(this.getValue() + (this._validateN(n) * 1));
};

sap.crm.MDualSlider.prototype.stepDown = function(n) {
	return this.setValue(this.getValue() - (this._validateN(n) * 1));
};

sap.crm.MDualSlider.prototype.setValue = function(fNewValue) {
	/*
	 * The first time when setValue() method is called, other properties may be
	 * outdated, because the invocation order is not always the same.
	 * 
	 * Overwriting this prototype method with an instance method after the first
	 * call, will ensure correct calculations.
	 * 
	 */
	this.setValue = this._setValue;

	// update the value and suppress re-rendering
	return this.setProperty("value", fNewValue, true);
};

sap.crm.MDualSlider.prototype.setValue2 = function(fNewValue) {
	/*
	 * The first time when setValue() method is called, other properties may be
	 * outdated, because the invocation order is not always the same.
	 * 
	 * Overwriting this prototype method with an instance method after the first
	 * call, will ensure correct calculations.
	 * 
	 */
	this.setValue2 = this._setValue2;

	// update the value and suppress re-rendering
	return this.setProperty("value2", fNewValue, true);
};

/* =========================================================== */
/* end: API method */
/* =========================================================== */

/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
},
	"sap/crm/MDualSliderLabel.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.crm.MDualSliderLabel");

sap.ui.core.Element.extend("sap.crm.MDualSliderLabel", {
	metadata : {
		properties : {
			"key" : {
				type : "any",
				defaultValue : null
			},
			"value" : {
				type : "string",
				defaultValue : null
			}
		}
	}
});
},
	"sap/crm/MDualSliderRenderer.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.crm.MDualSliderRenderer");

/**
 * @class Slider renderer.
 * @static
 */
sap.crm.MDualSliderRenderer = {};

/**
 * Renders the HTML for the given control, using the provided
 * {@link sap.ui.core.RenderManager}.
 * 
 * @param {sap.ui.core.RenderManager}
 *            oRm the RenderManager that can be used for writing to the render
 *            output buffer
 * @param {sap.ui.core.Control}
 *            oSlider an object representation of the slider that should be
 *            rendered
 */
sap.crm.MDualSliderRenderer.render = function(oRm, oSlider) {
	var bIsEnabled = oSlider.getEnabled(), sTooltip = oSlider
			.getTooltip_AsString(), sLeftStr, sRightStr;
	if (typeof oSlider._bIsRTL === "undefined")
		oSlider._bIsRTL = sap.ui.getCore().getConfiguration().getRTL();
	if (oSlider._bIsRTL) {
		sLeftStr = "right";
		sRightStr = "left";
	} else {
		sLeftStr = "left";
		sRightStr = "right";
	}
	// avoid render when not visible
	if (!oSlider.getVisible()) {
		return;
	}

	oRm.write("<div").addClass("sapcrmMsliCont");
	if (!bIsEnabled) {
		oRm.addClass("sapcrmMSliContDisabled");
	}

	oRm.addStyle("width", oSlider.getWidth()).addStyle("visibility", "hidden")
			.writeClasses().writeStyles().writeControlData(oSlider);
	if (sTooltip) {
		oRm.writeAttributeEscaped("title", sTooltip);
	}

	oRm.write("><div").addClass("sapcrmMsli");
	if (!bIsEnabled) {
		oRm.addClass("sapcrmMSliDisabled");
	}
	oRm.writeClasses().writeStyles().write("><div id='mSlider_bar'").addClass(
			"sapcrmMsliProgress").addStyle("width", oSlider._fWidth + "%")
			.addStyle(sLeftStr, oSlider._fValue + "%").addStyle(sRightStr,
					oSlider._fValue2 + "%").writeClasses().writeStyles().write(
					"></div>");

	// start render left slider handle
	oRm.write("<span id='left'").addClass("sapcrmMsliHandle").addStyle(
			sLeftStr, oSlider._fValue + "%").writeClasses().writeStyles()
			.writeAttributeEscaped("title", oSlider._sValueText);
	if (bIsEnabled) {
		oRm.writeAttribute("tabIndex", "0");
	}
	oRm.write("><span").addClass("sapcrmMsliHandleInner").writeClasses().write(
			"></span></span>").write("<div id='left_text'").addClass(
			"sliderText").addStyle("float", sLeftStr).addStyle(
			"margin-" + sLeftStr, oSlider._fValueText + "%").addStyle("bottom",
			"-2.5rem").writeClasses().writeStyles().write(">").writeEscaped(
			oSlider._sValueText).write("</div>");

	// FIXME: start render right slider handle
	oRm.write("<span id='right'").addClass("sapcrmMsliHandle").addStyle(
			sLeftStr, oSlider._fValue2 + "%").writeClasses().writeStyles()
			.writeAttributeEscaped("title", oSlider._sValue2Text);
	if (bIsEnabled) {
		oRm.writeAttribute("tabIndex", "0");
	}
	oRm.write("><span").addClass("sapcrmMsliHandleInner").writeClasses().write(
			"></span></span>").write("<div id='right_text'").addClass(
			"sliderText").addStyle("float", sRightStr).addStyle(
			"margin-" + sRightStr, oSlider._fValue2Text + "%").addStyle(
			"bottom", "-2.5rem").writeClasses().writeStyles().write(">")
			.writeEscaped(oSlider._sValue2Text).write("</div></div></div>");
};
}
}});
