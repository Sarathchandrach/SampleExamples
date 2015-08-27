jQuery.sap.registerPreloadedModules({
"name":"cus/crm/salespipeline/sim/Component-preload",
"version":"2.0",
"modules":{
	"cus/crm/salespipeline/sim/Component.js":function(){/*
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
},
	"cus/crm/salespipeline/sim/Configuration.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.salespipeline.sim.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ui.getCore().loadLibrary("sap.viz");
// jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("cus.crm.salespipeline.sim.controls.Bubble",".css"),"sap-ui-theme-sap.crm.sps");
jQuery.sap.require("cus.crm.salespipeline.sim.controls.Bubble");
jQuery.sap.require("cus.crm.salespipeline.sim.controls.BubbleChart");
jQuery.sap.require("cus.crm.salespipeline.sim.controls.BubbleChartRenderer");
jQuery.sap.require("cus.crm.salespipeline.sim.controls.MDualSlider");
jQuery.sap.require("cus.crm.salespipeline.sim.controls.MDualSliderLabel");
jQuery.sap.require("cus.crm.salespipeline.sim.controls.MDualSliderRenderer");
jQuery.sap.require("cus.crm.salespipeline.sim.controls.DateInput");
jQuery.sap.require("cus.crm.salespipeline.sim.controls.DateInputRenderer");

sap.ca.scfld.md.ConfigurationBase
		.extend(
				"cus.crm.salespipeline.sim.Configuration",
				{
					oServiceParams : {
						serviceList : [ {
							name : "CRM_SALESPIPELINE_SALESREP",
							masterCollection : "Opportunities",
							serviceUrl : "/sap/opu/odata/sap/CRM_SALESPIPELINE_SALESREP/",
							isDefault : true,
							mockedDataSource : "/cus.crm.salespipeline.sim/model/metadata.xml"
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
	"cus/crm/salespipeline/sim/Main.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("cus.crm.salespipeline.sim.Main", {
	onInit : function() {
		jQuery.sap.require("cus.crm.salespipeline.sim.util.formatter");
		jQuery.sap.require("sap.ca.scfld.md.Startup");
		sap.ca.scfld.md.Startup.init('cus.crm.salespipeline.sim', this);
	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources
	 * and finalize activities.
	 * 
	 * @memberOf MainXML
	 */
	onExit : function() {
		// exit cleanup code here
		if (document.getElementById("Infopopup")){
			var oInfo = document.getElementById("Infopopup");
			if(sap.ui.Device.browser.name == sap.ui.Device.browser.BROWSER.INTERNET_EXPLORER)
				oInfo.parentNode.removeChild(oInfo);
			else
				oInfo.remove();
		}
		if (sap.ui.getCore().byId("Infopopup"))
			sap.ui.getCore().byId("Infopopup").destroy();
		if (document.getElementById("acButAppS")){
			var oButton = document.getElementById("acButAppS");
			if(sap.ui.Device.browser.name == sap.ui.Device.browser.BROWSER.INTERNET_EXPLORER)
				oButton.parentNode.removeChild(oButton);
			else
				oButton.remove();
		}
		if (sap.ui.getCore().byId("acButAppS"))
			sap.ui.getCore().byId("acButAppS").destroy();
	}
});
},
	"cus/crm/salespipeline/sim/Main.view.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<core:View xmlns:core="sap.ui.core" xmlns="sap.m"\r\n\tcontrollerName="cus.crm.salespipeline.sim.Main" displayBlock="true"\r\n\theight="100%">\r\n\t<App id="fioriContent" class="cusCrmSalesPipelineSim" showHeader="false">\r\n\t</App>\r\n</core:View>',
	"cus/crm/salespipeline/sim/i18n/i18n.properties":'# Simulate Sales Pipeline\n# __ldi.translation.uuid=fedc81f0-170b-11e3-8ffd-0800200c9a66\n# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\n\n# Note: This file was created according to the conventions that can be found at \n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\n\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\nFULLSCREEN_TITLE=Sales Pipeline Simulator\n\n#XFLD: This is the label for the Target value achieved text\nLBL_OF=of\n\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\nERROR_MSG=Error\n\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\nLBL_TARGET_ACHIEVEMENT=Target Achievement\n\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\nBTN_RESET=Reset\n\n#XBUT: This is the button\'s text indicating the option for the user the logout.\nBTN_LOGOUT=Logout\n\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\nBTN_APPSETTINGS=App Settings\n\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\nBTN_ACTIONLIST=Actions\n\n#XTIT: This is the title message of the application settings dialog.\nAPPSETTINGS_TITLE=App Settings\n\n#XLST: This is the list item\'s text present in application settings dialog.\nSALESTARGET_ITEM=Sales Target\n\n#XLST: This is the list item\'s text present in application settings dialog.\nOPPORTUNITY_ITEM=Opportunity\n\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\nBTN_CLOSE_APPSETT=Close\n\n#XTIT: This is the title message of the Sales Target Settings dialog.\nAS_SALESTARGET_TITLE=Sales Target Details\n\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\nLBL_ST_SALESPERIOD=Sales Target Periodicity\n\n#XFLD: This is the label indicating the target amount for the current sales period.\nLBL_ST_SALESTARGET=Sales Target for Current Period\n\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\nLBL_ST_CURRENCY=Currency\n\n#XFLD: This is the label indicating the sales period\'s timespan.\nLBL_ST_TIMESPAN=Timespan\n\n#XFLD: This is the label indicating the start of the Sales Period.\nLBL_ST_TIMEFROM=From\n\n#XFLD: This is the label indicating the end of the Sales Period.\nLBL_ST_TIMETO=To\n\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\nBTN_AS_SAVEAPPSETT=Save\n\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\nBTN_AS_CANCELAPPSETT=Cancel\n\n#XTIT: This is the title message of the Opportunity Settings dialog.\nAS_OPPORTUNITY_TITLE=Opportunity Details\n\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\nLBL_OP_STEPVALUE=Step Value\n\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\nLBL_OP_SETVALUES=Set Values Manually\n\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\nLBL_OP_MINVALUE=Minimum Opportunity Value\n\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\nLBL_OP_MAXVALUE=Maximum Opportunity Value\n\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\nBTN_SAVE_OPPORT=Save\n\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\nBTN_REFRESH_APP=Refresh\n\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\nBTN_EXPORTEXCL=Export to Excel\n\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\nBTN_SHARETO=Share\n\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\nBTN_SHOW_CHANGELOG=Changes\n\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\nLBL_CONFIRM_REFRESH=Several changes have been made. Are you sure you want to Refresh?\n\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\nLBL_NOCHANGELOG=No changes have been made!\n\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\nLBL_SUCCESSUPDATE=Update Successful!\n\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\nLBL_OPPSTEPZERO=Opportunity Step Value cannot be zero!\n\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\nLBL_FAILEDUPDATE=Update Failed!\n\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\nLBL_FAILEDREAD=Read Failed!\n\n#XTIT: This is the title message of the Reset Dialog to reset the application.\nRESET_TITLE=Confirmation\n\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\nBTN_RF_OK=OK\n\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\nBTN_RF_CANCEL=Cancel\n\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\nCHANGELOG_TITLE=Change Log\n\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\nLBL_CL_CHANGES=Changes\n\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\nLBL_CL_NEWVALUE=New Value\n\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\nLBL_CL_OLDVALUE=Old Value\n\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\nBTN_CL_DISCARD=Discard\n\n#XBUT: This is the button\'s text to discard selected changes from the change log.\nBTN_CL_DISCARDSEL=Discard Selected\n\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\nBTN_CL_CLOSE=Close\n\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \nLBL_OPPORT_DETAILS=Opportunity\n\n#XFLD: This is the label indicating the start date of the opportunity selected.\nLBL_OD_STARTDATE=Start Date\n\n#XFLD: This is the label indicating the end date of the opportunity selected.\nLBL_OD_ENDDATE=End Date\n\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\nLBL_OD_EXPECTEDREVENUEHEADER=Expected Sales Volume\n\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\nLBL_OD_EXPECTEDREVENUE=Unweighted\n\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\nLBL_OD_WEIGHTEDREVENUE=Weighted\n\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\nLBL_OD_FORECASTRELEVANCE=Relevant for Forecast\n\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\nLBL_OD_CHANCEOFSUCCESS=Chance of Success (in %)\n\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\nLBL_OD_SALESSTAGE=Sales Stage\n\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\nLBL_OD_STATUS=Status\n\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\nLBL_OD_ACCPROSPECT=Account\n\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\nLBL_OD_MAINCONTACT=Main Contact\n\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\nLBL_OD_EMPLRESP=Employee Responsible\n\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\nBTN_OD_OK=OK\n\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\nBTN_OD_CANCEL=Cancel\n\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \nLBL_VAL_MSG=Enter only numbers\n\n#YMSG: This is the error message when a user enters a chance of success value less than zero\nLBL_VAL_MINCHANCE=Chance of success set to zero\n\n#YMSG: This is the validation message that is displayed when a user enters greater. \nLBL_VAL_MAXCHANCE=Chance of success set to hundred\n\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\nLBL_VAL_MAXEXPREV=Enter a value that is not greater than three times the volume of your largest opportunity\n\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\nLBL_VAL_MINEXPREV = Enter a value that is not less than one-fourth the volume of your smallest opportunity\n\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\nLBL_ONE_CURR=1 Opportunity not displayed.\n\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\nLBL_MULTI_CURR={0} Opportunities not displayed.\n\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\nLBL_MAINTAIN_CURR=Maintain conversion rate for {0}.\n\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\nLBL_ENDDATE_ERROR=End date can not be less than Start date.\n\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\nLBL_STARTDATE_ERROR=Start date can not be greater than End date.\n\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\nLBL_ENDDATE_ERROR_LOPP= Following Opportunities have End Date Error \n\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\nLBL_NOOFTO_SELECTED = Top {0} Opportunities\n\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\nLBL_ALLTO_SELECTED = All Opportunities\n\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\nLBL_NOTO_SELECTED = No Opportunity\n\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\nLBL_CBX_EXCLUDE_LOST= Exclude Lost\n\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\nLBL_CBX_EXCLUDE_WON=Exclude Won\n\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\nBTN_OPEN_OPPORTUNITY_SLIDER=Display by Size',
	"cus/crm/salespipeline/sim/i18n/i18n_ar.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=\\u0645\\u062D\\u0627\\u0643\\u0627\\u0629 \\u062E\\u0637\\u0629 \\u0627\\u0644\\u0645\\u0628\\u064A\\u0639\\u0627\\u062A\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=\\u0645\\u0646\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=\\u062E\\u0637\\u0623\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=\\u0625\\u0646\\u062C\\u0627\\u0632 \\u0627\\u0644\\u0647\\u062F\\u0641\r\n\r\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\r\nBTN_RESET=\\u0625\\u0639\\u0627\\u062F\\u0629 \\u062A\\u0639\\u064A\\u064A\\u0646\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=\\u062A\\u0633\\u062C\\u064A\\u0644 \\u062E\\u0631\\u0648\\u062C\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=\\u0625\\u0639\\u062F\\u0627\\u062F\\u0627\\u062A\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=\\u0627\\u0644\\u0625\\u062C\\u0631\\u0627\\u0621\\u0627\\u062A\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=\\u0625\\u062F\\u0627\\u0631\\u0629 \\u0627\\u0644\\u0625\\u0639\\u062F\\u0627\\u062F\\u0627\\u062A\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=\\u0647\\u062F\\u0641 \\u0627\\u0644\\u0645\\u0628\\u064A\\u0639\\u0627\\u062A\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=\\u0627\\u0644\\u0641\\u0631\\u0635\\u0629 \\u0627\\u0644\\u0628\\u064A\\u0639\\u064A\\u0629\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=\\u0625\\u063A\\u0644\\u0627\\u0642\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=\\u0625\\u062F\\u0627\\u0631\\u0629 \\u0625\\u0639\\u062F\\u0627\\u062F\\u0627\\u062A \\u0647\\u062F\\u0641 \\u0627\\u0644\\u0645\\u0628\\u064A\\u0639\\u0627\\u062A\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=\\u0627\\u0644\\u0641\\u0627\\u0635\\u0644 \\u0627\\u0644\\u062F\\u0648\\u0631\\u064A \\u0644\\u0647\\u062F\\u0641 \\u0627\\u0644\\u0645\\u0628\\u064A\\u0639\\u0627\\u062A\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=\\u0647\\u062F\\u0641 \\u0627\\u0644\\u0645\\u0628\\u064A\\u0639\\u0627\\u062A \\u0644\\u0644\\u0641\\u062A\\u0631\\u0629 \\u0627\\u0644\\u062D\\u0627\\u0644\\u064A\\u0629\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=\\u0627\\u0644\\u0639\\u0645\\u0644\\u0629\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=\\u0627\\u0644\\u0641\\u062A\\u0631\\u0629 \\u0627\\u0644\\u0632\\u0645\\u0646\\u064A\\u0629\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=\\u0645\\u0646\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=\\u0625\\u0644\\u0649\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=\\u062D\\u0641\\u0638\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=\\u0625\\u0644\\u063A\\u0627\\u0621\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=\\u0625\\u062F\\u0627\\u0631\\u0629 \\u0625\\u0639\\u062F\\u0627\\u062F\\u0627\\u062A \\u0627\\u0644\\u0641\\u0631\\u0635\\u0629 \\u0627\\u0644\\u0628\\u064A\\u0639\\u064A\\u0629\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=\\u0642\\u064A\\u0645\\u0629 \\u0627\\u0644\\u062E\\u0637\\u0648\\u0629\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=\\u062A\\u0639\\u064A\\u064A\\u0646 \\u0627\\u0644\\u0642\\u064A\\u0645 \\u064A\\u062F\\u0648\\u064A\\u064B\\u0627\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=\\u0623\\u062F\\u0646\\u0649 \\u0642\\u064A\\u0645\\u0629 \\u0644\\u0644\\u0641\\u0631\\u0635\\u0629 \\u0627\\u0644\\u0628\\u064A\\u0639\\u064A\\u0629\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=\\u0623\\u0642\\u0635\\u0649 \\u0642\\u064A\\u0645\\u0629 \\u0644\\u0644\\u0641\\u0631\\u0635\\u0629 \\u0627\\u0644\\u0628\\u064A\\u0639\\u064A\\u0629\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=\\u062D\\u0641\\u0638\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=\\u0625\\u0639\\u0627\\u062F\\u0629 \\u062A\\u0639\\u064A\\u064A\\u0646\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=\\u062A\\u0635\\u062F\\u064A\\u0631 \\u0625\\u0644\\u0649 Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=\\u0645\\u0634\\u0627\\u0631\\u0643\\u0629\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=\\u0639\\u0631\\u0636 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\\u0627\\u062A\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=\\u0633\\u064A\\u062A\\u0645 \\u0641\\u0642\\u062F \\u0623\\u064A \\u0628\\u064A\\u0627\\u0646\\u0627\\u062A \\u063A\\u064A\\u0631 \\u0645\\u062D\\u0641\\u0648\\u0638\\u0629. \\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0628\\u0627\\u0644\\u062A\\u0623\\u0643\\u064A\\u062F \\u0627\\u0644\\u0645\\u062A\\u0627\\u0628\\u0639\\u0629\\u061F\r\n\r\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\r\nLBL_NOCHANGELOG=\\u0644\\u0627 \\u062A\\u0648\\u062C\\u062F \\u062A\\u063A\\u064A\\u064A\\u0631\\u0627\\u062A \\u0644\\u0639\\u0631\\u0636\\u0647\\u0627\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=\\u062A\\u0645 \\u062D\\u0641\\u0638 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\\u0627\\u062A\r\n\r\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\r\nLBL_OPPSTEPZERO=\\u0623\\u062F\\u062E\\u0644 \\u0642\\u064A\\u0645\\u0629 \\u062E\\u0637\\u0648\\u0629 \\u0623\\u0643\\u0628\\u0631 \\u0645\\u0646 \\u0635\\u0641\\u0631\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=\\u0641\\u0634\\u0644 \\u0627\\u0644\\u062A\\u062D\\u062F\\u064A\\u062B\r\n\r\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\r\nLBL_FAILEDREAD=\\u062D\\u062F\\u062B \\u062E\\u0637\\u0623 \\u0623\\u062B\\u0646\\u0627\\u0621 \\u0642\\u0631\\u0627\\u0621\\u0629 \\u0627\\u0644\\u0628\\u064A\\u0627\\u0646\\u0627\\u062A\r\n\r\n#XTIT: This is the title message of the Reset Dialog to reset the application.\r\nRESET_TITLE=\\u062A\\u063A\\u064A\\u064A\\u0631\\u0627\\u062A \\u063A\\u064A\\u0631 \\u0645\\u062D\\u0641\\u0648\\u0638\\u0629\r\n\r\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\r\nBTN_RF_OK=\\u0645\\u0648\\u0627\\u0641\\u0642\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\r\nBTN_RF_CANCEL=\\u0625\\u0644\\u063A\\u0627\\u0621\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=\\u0639\\u0631\\u0636 \\u0633\\u062C\\u0644 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=\\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\\u0627\\u062A\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=\\u0642\\u064A\\u0645\\u0629 \\u062C\\u062F\\u064A\\u062F\\u0629\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=\\u0642\\u064A\\u0645\\u0629 \\u0642\\u062F\\u064A\\u0645\\u0629\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=\\u062A\\u062C\\u0627\\u0647\\u0644\r\n\r\n#XBUT: This is the button\'s text to discard selected changes from the change log.\r\nBTN_CL_DISCARDSEL=\\u062A\\u062C\\u0627\\u0647\\u0644\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=\\u0625\\u063A\\u0644\\u0627\\u0642\r\n\r\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=\\u062A\\u062D\\u0631\\u064A\\u0631 \\u0627\\u0644\\u0641\\u0631\\u0635\\u0629 \\u0627\\u0644\\u0628\\u064A\\u0639\\u064A\\u0629\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0628\\u062F\\u0627\\u064A\\u0629\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0627\\u0646\\u062A\\u0647\\u0627\\u0621\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=\\u062D\\u062C\\u0645 \\u0627\\u0644\\u0645\\u0628\\u064A\\u0639\\u0627\\u062A \\u0627\\u0644\\u0645\\u062A\\u0648\\u0642\\u0639\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=\\u063A\\u064A\\u0631 \\u0645\\u0631\\u062C\\u062D\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=\\u0645\\u0631\\u062C\\u062D\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=\\u0630\\u0648 \\u0635\\u0644\\u0629 \\u0628\\u0627\\u0644\\u062A\\u0648\\u0642\\u0639\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=\\u0646\\u0633\\u0628\\u0629 \\u0641\\u0631\\u0635 \\u0627\\u0644\\u0646\\u062C\\u0627\\u062D\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=\\u0645\\u0631\\u062D\\u0644\\u0629 \\u0627\\u0644\\u0645\\u0628\\u064A\\u0639\\u0627\\u062A\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=\\u0627\\u0644\\u062D\\u0627\\u0644\\u0629\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=\\u0627\\u0644\\u0639\\u0645\\u064A\\u0644\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=\\u062C\\u0647\\u0629 \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644 \\u0627\\u0644\\u0631\\u0626\\u064A\\u0633\\u064A\\u0629\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=\\u0627\\u0644\\u0645\\u0648\\u0638\\u0641 \\u0627\\u0644\\u0645\\u0633\\u0624\\u0648\\u0644\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=\\u062A\\u0642\\u062F\\u064A\\u0645\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=\\u0625\\u0644\\u063A\\u0627\\u0621\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \r\nLBL_VAL_MSG=\\u0623\\u062F\\u062E\\u0644 \\u0623\\u0631\\u0642\\u0627\\u0645\\u064B\\u0627 \\u0641\\u0642\\u0637\r\n\r\n#YMSG: This is the error message when a user enters a chance of success value less than zero\r\nLBL_VAL_MINCHANCE=\\u062A\\u0645 \\u062A\\u0639\\u064A\\u064A\\u0646 \\u0641\\u0631\\u0635\\u0629 \\u0627\\u0644\\u0646\\u062C\\u0627\\u062D \\u0625\\u0644\\u0649 \\u0635\\u0641\\u0631\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters greater. \r\nLBL_VAL_MAXCHANCE=\\u062A\\u0645 \\u062A\\u0639\\u064A\\u064A\\u0646 \\u0641\\u0631\\u0635\\u0629 \\u0627\\u0644\\u0646\\u062C\\u0627\\u062D \\u0625\\u0644\\u0649 100\r\n\r\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\r\nLBL_VAL_MAXEXPREV=\\u064A\\u062C\\u0628 \\u0623\\u0646 \\u062A\\u0643\\u0648\\u0646 \\u0627\\u0644\\u0642\\u064A\\u0645\\u0629 \\u0623\\u0642\\u0644 \\u062B\\u0644\\u0627\\u062B \\u0645\\u0631\\u0627\\u062A \\u0645\\u0646 \\u0623\\u0643\\u0628\\u0631 \\u0641\\u0631\\u0635\\u0629 \\u0628\\u064A\\u0639\\u064A\\u0629\r\n\r\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\r\nLBL_VAL_MINEXPREV=\\u064A\\u062C\\u0628 \\u0623\\u0646 \\u062A\\u0643\\u0648\\u0646 \\u0627\\u0644\\u0642\\u064A\\u0645\\u0629 \\u0623\\u0643\\u0628\\u0631 \\u0645\\u0646 \\u0631\\u0628\\u0639 \\u0623\\u0642\\u0644 \\u0641\\u0631\\u0635\\u0629 \\u0628\\u064A\\u0639\\u064A\\u0629\r\n\r\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_ONE_CURR=\\u0641\\u0631\\u0635\\u0629 \\u0628\\u064A\\u0639\\u064A\\u0629 \\u0648\\u0627\\u062D\\u062F\\u0629 \\u063A\\u064A\\u0631 \\u0645\\u0639\\u0631\\u0648\\u0636\\u0629\r\n\r\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_MULTI_CURR={0} \\u0645\\u0646 \\u0627\\u0644\\u0641\\u0631\\u0635 \\u0627\\u0644\\u0628\\u064A\\u0639\\u064A\\u0629 \\u0644\\u0645 \\u064A\\u062A\\u0645 \\u0639\\u0631\\u0636\\u0647\\u0627.\r\n\r\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\r\nLBL_MAINTAIN_CURR=\\u0642\\u0645 \\u0628\\u0635\\u064A\\u0627\\u0646\\u0629 \\u0646\\u0633\\u0628\\u0629 \\u062A\\u062D\\u0648\\u064A\\u0644 {0}.\r\n\r\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\r\nLBL_ENDDATE_ERROR=\\u0623\\u062F\\u062E\\u0644 \\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0646\\u062A\\u0647\\u0627\\u0621 \\u064A\\u0642\\u0639 \\u0628\\u0639\\u062F \\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0628\\u062F\\u0627\\u064A\\u0629\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\r\nLBL_STARTDATE_ERROR=\\u0623\\u062F\\u062E\\u0644 \\u062A\\u0627\\u0631\\u064A\\u062E \\u0628\\u062F\\u0627\\u064A\\u0629 \\u064A\\u0642\\u0639 \\u0642\\u0628\\u0644 \\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0627\\u0646\\u062A\\u0647\\u0627\\u0621\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\r\nLBL_ENDDATE_ERROR_LOPP=\\u064A\\u0642\\u0639 \\u062A\\u0627\\u0631\\u064A\\u062E \\u0628\\u062F\\u0627\\u064A\\u0629 \\u0627\\u0644\\u0641\\u0631\\u0635 \\u0627\\u0644\\u0628\\u064A\\u0639\\u064A\\u0629 \\u0627\\u0644\\u062A\\u0627\\u0644\\u064A\\u0629 \\u0628\\u0639\\u062F \\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0627\\u0646\\u062A\\u0647\\u0627\\u0621\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=\\u0623\\u0639\\u0644\\u0649 {0} \\u0645\\u0646 \\u0627\\u0644\\u0641\\u0631\\u0635 \\u0627\\u0644\\u0628\\u064A\\u0639\\u064A\\u0629\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=\\u0643\\u0644 \\u0627\\u0644\\u0641\\u0631\\u0635 \\u0627\\u0644\\u0628\\u064A\\u0639\\u064A\\u0629\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=\\u0644\\u0627 \\u062A\\u062A\\u0648\\u0641\\u0631 \\u0623\\u064A \\u0641\\u0631\\u0635\\u0629 \\u0628\\u064A\\u0639\\u064A\\u0629\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=\\u0627\\u0633\\u062A\\u062B\\u0646\\u0627\\u0621 \\u0627\\u0644\\u062E\\u0633\\u0627\\u0626\\u0631\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=\\u0627\\u0633\\u062A\\u062B\\u0646\\u0627\\u0621 \\u0627\\u0644\\u0645\\u0643\\u0627\\u0633\\u0628\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=\\u0639\\u0631\\u0636 \\u062D\\u0633\\u0628 \\u0627\\u0644\\u062D\\u062C\\u0645\r\n',
	"cus/crm/salespipeline/sim/i18n/i18n_bg.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=\\u0421\\u0438\\u043C\\u0443\\u043B\\u0438\\u0440\\u0430\\u043D\\u0435 \\u043D\\u0430 Pipeline \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\\u0431\\u0438\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=\\u043E\\u0442\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=\\u0413\\u0440\\u0435\\u0448\\u043A\\u0430\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=\\u041F\\u043E\\u0441\\u0442\\u0438\\u0433\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0446\\u0435\\u043B\r\n\r\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\r\nBTN_RESET=\\u041F\\u043E\\u0432\\u0442\\u043E\\u0440\\u043D\\u043E \\u0437\\u0430\\u0434\\u0430\\u0432\\u0430\\u043D\\u0435\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=\\u0418\\u0437\\u0445\\u043E\\u0434\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=\\u041D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=\\u0414\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u044F\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=\\u0423\\u043F\\u0440\\u0430\\u0432\\u043B\\u0435\\u043D\\u0438\\u0435 \\u043D\\u0430 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=\\u0426\\u0435\\u043B \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\\u0431\\u0438\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=\\u0412\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=\\u0417\\u0430\\u0442\\u0432\\u0430\\u0440\\u044F\\u043D\\u0435\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=\\u0423\\u043F\\u0440\\u0430\\u0432\\u043B\\u0435\\u043D\\u0438\\u0435 \\u043D\\u0430 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438 \\u0437\\u0430 \\u0446\\u0435\\u043B \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\\u0431\\u0438\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=\\u041F\\u0435\\u0440\\u0438\\u043E\\u0434\\u0438\\u0447\\u043D\\u043E\\u0441\\u0442 \\u043D\\u0430 \\u0446\\u0435\\u043B \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\\u0431\\u0438\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=\\u0426\\u0435\\u043B \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\\u0431\\u0438 \\u0437\\u0430 \\u0442\\u0435\\u043A\\u0443\\u0449 \\u043F\\u0435\\u0440\\u0438\\u043E\\u0434\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=\\u0412\\u0430\\u043B\\u0443\\u0442\\u0430\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=\\u0412\\u0440\\u0435\\u043C\\u0435\\u0432\\u0438 \\u0438\\u043D\\u0442\\u0435\\u0440\\u0432\\u0430\\u043B\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=\\u041E\\u0442\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=\\u0414\\u043E\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=\\u0417\\u0430\\u043F\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=\\u041E\\u0442\\u043A\\u0430\\u0437\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=\\u0423\\u043F\\u0440\\u0430\\u0432\\u043B\\u0435\\u043D\\u0438\\u0435 \\u043D\\u0430 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438 \\u0437\\u0430 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=\\u0421\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442 \\u043D\\u0430 \\u0441\\u0442\\u044A\\u043F\\u043A\\u0430\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=\\u0420\\u044A\\u0447\\u043D\\u043E \\u0437\\u0430\\u0434\\u0430\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0441\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442\\u0438\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=\\u041C\\u0438\\u043D\\u0438\\u043C\\u0430\\u043B\\u043D\\u0430 \\u0441\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442 \\u043D\\u0430 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=\\u041C\\u0430\\u043A\\u0441\\u0438\\u043C\\u0430\\u043B\\u043D\\u0430 \\u0441\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442 \\u043D\\u0430 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=\\u0417\\u0430\\u043F\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=\\u041F\\u043E\\u0432\\u0442\\u043E\\u0440\\u043D\\u043E \\u0437\\u0430\\u0434\\u0430\\u0432\\u0430\\u043D\\u0435\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=\\u0415\\u043A\\u0441\\u043F\\u043E\\u0440\\u0442 \\u0432 Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=\\u0421\\u043F\\u043E\\u0434\\u0435\\u043B\\u044F\\u043D\\u0435\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=\\u041F\\u0440\\u0435\\u0433\\u043B\\u0435\\u0434 \\u043D\\u0430 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=\\u041D\\u0435\\u0437\\u0430\\u043F\\u0430\\u0437\\u0435\\u043D\\u0438\\u0442\\u0435 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438 \\u0449\\u0435 \\u0431\\u044A\\u0434\\u0430\\u0442 \\u0438\\u0437\\u0433\\u0443\\u0431\\u0435\\u043D\\u0438. \\u0421\\u0438\\u0433\\u0443\\u0440\\u043D\\u0438 \\u043B\\u0438 \\u0441\\u0442\\u0435, \\u0447\\u0435 \\u0436\\u0435\\u043B\\u0430\\u0435\\u0442\\u0435 \\u0434\\u0430 \\u043F\\u0440\\u043E\\u0434\\u044A\\u043B\\u0436\\u0438\\u0442\\u0435?\r\n\r\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\r\nLBL_NOCHANGELOG=\\u041D\\u044F\\u043C\\u0430 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438 \\u0437\\u0430 \\u043F\\u043E\\u043A\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=\\u041F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438\\u0442\\u0435 \\u0441\\u0430 \\u0437\\u0430\\u043F\\u0430\\u0437\\u0435\\u043D\\u0438\r\n\r\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\r\nLBL_OPPSTEPZERO=\\u0412\\u044A\\u0432\\u0435\\u0434\\u0435\\u0442\\u0435 \\u0441\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442 \\u043D\\u0430 \\u0441\\u0442\\u044A\\u043F\\u043A\\u0430 \\u043F\\u043E-\\u0433\\u043E\\u043B\\u044F\\u043C\\u0430 \\u043E\\u0442 \\u043D\\u0443\\u043B\\u0430\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=\\u041D\\u0435\\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u0430 \\u0430\\u043A\\u0442\\u0443\\u0430\\u043B\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F\r\n\r\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\r\nLBL_FAILEDREAD=\\u0413\\u0440\\u0435\\u0448\\u043A\\u0430 \\u043F\\u0440\\u0438 \\u0447\\u0435\\u0442\\u0435\\u043D\\u0435 \\u043D\\u0430 \\u0434\\u0430\\u043D\\u043D\\u0438\r\n\r\n#XTIT: This is the title message of the Reset Dialog to reset the application.\r\nRESET_TITLE=\\u041D\\u0435\\u0437\\u0430\\u043F\\u0430\\u0437\\u0435\\u043D\\u0438 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438\r\n\r\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\r\nBTN_RF_CANCEL=\\u041E\\u0442\\u043A\\u0430\\u0437\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=\\u041F\\u0440\\u0435\\u0433\\u043B\\u0435\\u0434 \\u043D\\u0430 \\u0436\\u0443\\u0440\\u043D\\u0430\\u043B \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=\\u041F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=\\u041D\\u043E\\u0432\\u0430 \\u0441\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=\\u0421\\u0442\\u0430\\u0440\\u0430 \\u0441\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=\\u041E\\u0442\\u0445\\u0432\\u044A\\u0440\\u043B\\u044F\\u043D\\u0435\r\n\r\n#XBUT: This is the button\'s text to discard selected changes from the change log.\r\nBTN_CL_DISCARDSEL=\\u041E\\u0442\\u0445\\u0432\\u044A\\u0440\\u043B\\u044F\\u043D\\u0435\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=\\u0417\\u0430\\u0442\\u0432\\u0430\\u0440\\u044F\\u043D\\u0435\r\n\r\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=\\u0420\\u0435\\u0434\\u0430\\u043A\\u0442\\u0438\\u0440\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=\\u041D\\u0430\\u0447\\u0430\\u043B\\u043D\\u0430 \\u0434\\u0430\\u0442\\u0430\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=\\u041A\\u0440\\u0430\\u0439\\u043D\\u0430 \\u0434\\u0430\\u0442\\u0430\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=\\u041E\\u0447\\u0430\\u043A\\u0432\\u0430\\u043D \\u043E\\u0431\\u0435\\u043C \\u043D\\u0430 \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\\u0431\\u0438\\u0442\\u0435\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=\\u041D\\u0435\\u043F\\u0440\\u0435\\u0442\\u0435\\u0433\\u043B\\u0435\\u043D\\u0438\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=\\u041F\\u0440\\u0435\\u0442\\u0435\\u0433\\u043B\\u0435\\u043D\\u0438\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=\\u0420\\u0435\\u043B\\u0435\\u0432\\u0430\\u043D\\u0442\\u0435\\u043D \\u0437\\u0430 \\u043F\\u0440\\u043E\\u0433\\u043D\\u043E\\u0437\\u0430\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=\\u0428\\u0430\\u043D\\u0441 \\u0437\\u0430 \\u0443\\u0441\\u043F\\u0435\\u0445 (\\u0432 %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=\\u0415\\u0442\\u0430\\u043F \\u043D\\u0430 \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\\u0431\\u0438\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=\\u0421\\u0442\\u0430\\u0442\\u0443\\u0441\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=\\u0421\\u043C\\u0435\\u0442\\u043A\\u0430\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=\\u041E\\u0441\\u043D\\u043E\\u0432\\u0435\\u043D \\u0434\\u043E\\u0433\\u043E\\u0432\\u043E\\u0440\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=\\u041E\\u0442\\u0433\\u043E\\u0432\\u043E\\u0440\\u0435\\u043D \\u0441\\u043B\\u0443\\u0436\\u0438\\u0442\\u0435\\u043B\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=\\u0418\\u0437\\u043F\\u0440\\u0430\\u0449\\u0430\\u043D\\u0435\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=\\u041E\\u0442\\u043A\\u0430\\u0437\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \r\nLBL_VAL_MSG=\\u0412\\u044A\\u0432\\u0435\\u0434\\u0435\\u0442\\u0435 \\u0441\\u0430\\u043C\\u043E \\u0447\\u0438\\u0441\\u043B\\u0430\r\n\r\n#YMSG: This is the error message when a user enters a chance of success value less than zero\r\nLBL_VAL_MINCHANCE=\\u0428\\u0430\\u043D\\u0441\\u044A\\u0442 \\u0437\\u0430 \\u0443\\u0441\\u043F\\u0435\\u0445 \\u0435 \\u0437\\u0430\\u0434\\u0430\\u0434\\u0435\\u043D \\u043D\\u0430 \\u043D\\u0443\\u043B\\u0430\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters greater. \r\nLBL_VAL_MAXCHANCE=\\u0428\\u0430\\u043D\\u0441\\u044A\\u0442 \\u0437\\u0430 \\u0443\\u0441\\u043F\\u0435\\u0445 \\u0435 \\u0437\\u0430\\u0434\\u0430\\u0434\\u0435\\u043D \\u043D\\u0430 100\r\n\r\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\r\nLBL_VAL_MAXEXPREV=\\u0421\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442\\u0442\\u0430 \\u0442\\u0440\\u044F\\u0431\\u0432\\u0430 \\u0434\\u0430 \\u0435 \\u043F\\u043E-\\u043C\\u0430\\u043B\\u043A\\u043E \\u043E\\u0442 \\u0442\\u0440\\u0438 \\u043F\\u044A\\u0442\\u0438 \\u043D\\u0430\\u0439-\\u0433\\u043E\\u043B\\u044F\\u043C\\u0430\\u0442\\u0430 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\r\n\r\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\r\nLBL_VAL_MINEXPREV=\\u0421\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442\\u0442\\u0430 \\u0442\\u0440\\u044F\\u0431\\u0432\\u0430 \\u0434\\u0430 \\u0435 \\u043F\\u043E-\\u0433\\u043E\\u043B\\u044F\\u043C\\u0430 \\u043E\\u0442 \\u0447\\u0435\\u0442\\u0432\\u044A\\u0440\\u0442 \\u043E\\u0442 \\u043D\\u0430\\u0439-\\u043C\\u0430\\u043B\\u043A\\u0430\\u0442\\u0430 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\r\n\r\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_ONE_CURR=1 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442 \\u043D\\u0435 \\u0435 \\u043F\\u043E\\u043A\\u0430\\u0437\\u0430\\u043D\\u0430\r\n\r\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_MULTI_CURR={0} \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438 \\u0441\\u0430 \\u043F\\u043E\\u043A\\u0430\\u0437\\u0430\\u043D\\u0438.\r\n\r\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\r\nLBL_MAINTAIN_CURR=\\u041F\\u043E\\u0434\\u0434\\u044A\\u0440\\u0436\\u0430\\u043D\\u0435 \\u043A\\u043E\\u0435\\u0444\\u0438\\u0446\\u0438\\u0435\\u043D\\u0442 \\u043D\\u0430 \\u043F\\u0440\\u0435\\u043E\\u0431\\u0440\\u0430\\u0437\\u0443\\u0432\\u0430\\u043D\\u0435 \\u0437\\u0430 {0}.\r\n\r\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\r\nLBL_ENDDATE_ERROR=\\u0412\\u044A\\u0432\\u0435\\u0434\\u0435\\u0442\\u0435 \\u043A\\u0440\\u0430\\u0439\\u043D\\u0430 \\u0434\\u0430\\u0442\\u0430, \\u043A\\u043E\\u044F\\u0442\\u043E \\u0435 \\u0441\\u043B\\u0435\\u0434 \\u043D\\u0430\\u0447\\u0430\\u043B\\u043D\\u0430\\u0442\\u0430 \\u0434\\u0430\\u0442\\u0430\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\r\nLBL_STARTDATE_ERROR=\\u0412\\u044A\\u0432\\u0435\\u0434\\u0435\\u0442\\u0435 \\u043D\\u0430\\u0447\\u0430\\u043B\\u043D\\u0430 \\u0434\\u0430\\u0442\\u0430, \\u043A\\u043E\\u044F\\u0442\\u043E \\u0435 \\u043F\\u043E-\\u0440\\u0430\\u043D\\u043E \\u043E\\u0442 \\u043A\\u0440\\u0430\\u0439\\u043D\\u0430\\u0442\\u0430 \\u0434\\u0430\\u0442\\u0430\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\r\nLBL_ENDDATE_ERROR_LOPP=\\u0421\\u043B\\u0435\\u0434\\u043D\\u0438\\u0442\\u0435 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438 \\u0438\\u043C\\u0430\\u0442 \\u043D\\u0430\\u0447\\u0430\\u043B\\u043D\\u0430 \\u0434\\u0430\\u0442\\u0430 \\u043F\\u043E-\\u043A\\u044A\\u0441\\u043D\\u043E \\u043E\\u0442 \\u043A\\u0440\\u0430\\u0439\\u043D\\u0430\\u0442\\u0430 \\u0434\\u0430\\u0442\\u0430\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=\\u0412\\u043E\\u0434\\u0435\\u0449\\u0438 {0} \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=\\u0412\\u0441\\u0438\\u0447\\u043A\\u0438 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=\\u041D\\u044F\\u043C\\u0430 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=\\u0418\\u0437\\u043A\\u043B\\u044E\\u0447\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0438\\u0437\\u0433\\u0443\\u0431\\u0435\\u043D\\u0438\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=\\u0418\\u0437\\u043A\\u043B\\u044E\\u0447\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0441\\u043F\\u0435\\u0447\\u0435\\u043B\\u0435\\u043D\\u0438\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=\\u041F\\u043E\\u043A\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435 \\u043F\\u043E \\u0440\\u0430\\u0437\\u043C\\u0435\\u0440\r\n',
	"cus/crm/salespipeline/sim/i18n/i18n_cs.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Simulovat pipeline prodeje\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=z\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Chyba\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Dosa\\u017Een\\u00ED c\\u00EDle\r\n\r\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\r\nBTN_RESET=Reset\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Odhl\\u00E1sit se\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Nastaven\\u00ED\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=\\u010Cinnosti\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Nastaven\\u00ED spr\\u00E1vy\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=C\\u00EDl prodeje\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=P\\u0159\\u00EDle\\u017Eitost\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Zav\\u0159\\u00EDt\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Spr\\u00E1va nastaven\\u00ED c\\u00EDle prodeje\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Periodicita c\\u00EDle prodeje\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=C\\u00EDl prodeje pro aktu\\u00E1ln\\u00ED obdob\\u00ED\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=M\\u011Bna\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=\\u010Casov\\u00FD interval\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=Od\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=Do\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Ulo\\u017Eit\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Zru\\u0161it\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Spr\\u00E1va nastaven\\u00ED p\\u0159\\u00EDle\\u017Eitost\\u00ED\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Hodnota kroku\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Nastavit hodnoty manu\\u00E1ln\\u011B\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Minim\\u00E1ln\\u00ED hodnota p\\u0159\\u00EDle\\u017Eitosti\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Maxim\\u00E1ln\\u00ED hodnota p\\u0159\\u00EDle\\u017Eitosti\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Ulo\\u017Eit\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Reset\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Export pro Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Sd\\u00EDlet\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=Zobrazit zm\\u011Bny\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=V\\u0161echny neulo\\u017Een\\u00E9 zm\\u011Bny budou ztraceny. Opravdu chcete pokra\\u010Dovat?\r\n\r\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\r\nLBL_NOCHANGELOG=\\u017D\\u00E1dn\\u00E9 zm\\u011Bny k zobrazen\\u00ED\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=Zm\\u011Bny ulo\\u017Eeny\r\n\r\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\r\nLBL_OPPSTEPZERO=Zadejte hodnotu kroku v\\u011Bt\\u0161\\u00ED ne\\u017E nula\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=Aktualizace se nezda\\u0159ila\r\n\r\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\r\nLBL_FAILEDREAD=Chyba p\\u0159i \\u010Dten\\u00ED dat\r\n\r\n#XTIT: This is the title message of the Reset Dialog to reset the application.\r\nRESET_TITLE=Neulo\\u017Een\\u00E9 zm\\u011Bny\r\n\r\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\r\nBTN_RF_CANCEL=Zru\\u0161it\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=Zobrazit protokol zm\\u011Bn\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Zm\\u011Bny\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Nov\\u00E1 hodnota\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Star\\u00E1 hodnota\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Zam\\u00EDtnout\r\n\r\n#XBUT: This is the button\'s text to discard selected changes from the change log.\r\nBTN_CL_DISCARDSEL=Zam\\u00EDtnout\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Zav\\u0159\\u00EDt\r\n\r\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Upravit p\\u0159\\u00EDle\\u017Eitost\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Datum zah\\u00E1jen\\u00ED\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Koncov\\u00E9 datum\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=O\\u010Dek\\u00E1van\\u00FD objem prodeje\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Nev\\u00E1\\u017Een\\u00E9\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=V\\u00E1\\u017Een\\u00E9\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Relevantn\\u00ED pro progn\\u00F3zu\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=\\u0160ance \\u00FAsp\\u011Bchu (v %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=F\\u00E1ze prodeje\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Stav\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Z\\u00E1kazn\\u00EDk\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Hlavn\\u00ED kontakt\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Odpov\\u011Bdn\\u00FD zam\\u011Bstnanec\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=Odeslat\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Zru\\u0161it\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \r\nLBL_VAL_MSG=Zadejte pouze \\u010D\\u00EDsla\r\n\r\n#YMSG: This is the error message when a user enters a chance of success value less than zero\r\nLBL_VAL_MINCHANCE=\\u0160ance na \\u00FAsp\\u011Bch nastavena na nulu\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters greater. \r\nLBL_VAL_MAXCHANCE=\\u0160ance na \\u00FAsp\\u011Bch nastavena na 100\r\n\r\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\r\nLBL_VAL_MAXEXPREV=Hodnota mus\\u00ED b\\u00FDt men\\u0161\\u00ED ne\\u017E t\\u0159ikr\\u00E1t nejv\\u011Bt\\u0161\\u00ED p\\u0159\\u00EDle\\u017Eitost\r\n\r\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\r\nLBL_VAL_MINEXPREV=Hodnota mus\\u00ED b\\u00FDt v\\u011Bt\\u0161\\u00ED ne\\u017E \\u010Dtvrtina nejmen\\u0161\\u00ED p\\u0159\\u00EDle\\u017Eitosti\r\n\r\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_ONE_CURR=1 p\\u0159\\u00EDle\\u017Eitost nen\\u00ED zobrazena\r\n\r\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_MULTI_CURR={0} p\\u0159\\u00EDle\\u017Eitost\\u00ED nebylo zobrazeno.\r\n\r\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\r\nLBL_MAINTAIN_CURR=Prove\\u010Fte \\u00FAdr\\u017Ebu kurzu p\\u0159epo\\u010Dtu pro {0}.\r\n\r\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\r\nLBL_ENDDATE_ERROR=Zadejte koncov\\u00E9 datum, kter\\u00E9 le\\u017E\\u00ED po po\\u010D\\u00E1te\\u010Dn\\u00EDm datu\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\r\nLBL_STARTDATE_ERROR=Zadejte po\\u010D\\u00E1te\\u010Dn\\u00ED datum, kter\\u00E9 je d\\u0159\\u00EDv\\u011Bj\\u0161\\u00ED ne\\u017E koncov\\u00E9 datum\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\r\nLBL_ENDDATE_ERROR_LOPP=N\\u00E1sleduj\\u00EDc\\u00ED p\\u0159\\u00EDle\\u017Eitosti maj\\u00ED po\\u010D\\u00E1te\\u010Dn\\u00ED datum pozd\\u011Bj\\u0161\\u00ED ne\\u017E koncov\\u00E9 datum\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Prvn\\u00EDch {0} p\\u0159\\u00EDle\\u017Eitost\\u00ED\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=V\\u0161echny p\\u0159\\u00EDle\\u017Eitosti\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=Nen\\u00ED k dispozici \\u017E\\u00E1dn\\u00E1 p\\u0159\\u00EDle\\u017Eitost\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Vylou\\u010Dit ztracen\\u00E9\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Vylou\\u010Dit z\\u00EDskan\\u00E9\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Zobrazit podle velikosti\r\n',
	"cus/crm/salespipeline/sim/i18n/i18n_de.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Sales Pipeline simulieren\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=von\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Fehler\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Zielerreichung\r\n\r\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\r\nBTN_RESET=Zur\\u00FCcksetzen\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Abmelden\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Einstellungen\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=Aktionen\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Einstellungen verwalten\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Verkaufsziel\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Opportunity\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Schlie\\u00DFen\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Verkaufszieleinstellungen verwalten\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Verkaufszielperiodizit\\u00E4t\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Verkaufsziel im aktuellen Zeitraum\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=W\\u00E4hrung\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=Zeitraum\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=Von\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=Bis\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Sichern\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Abbrechen\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Opportunity-Einstellungen verwalten\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Schrittwert\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Werte manuell eingeben\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Minimalwert der Opportunity\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Maximalwert der Opportunity\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Sichern\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Zur\\u00FCcksetzen\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=In Excel exportieren\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Teilen\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=\\u00C4nderungen anzeigen\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Ungesicherte \\u00C4nderungen gehen verloren. M\\u00F6chten Sie wirklich fortfahren?\r\n\r\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\r\nLBL_NOCHANGELOG=Keine \\u00C4nderungen vorhanden\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=\\u00C4nderungen wurden gesichert\r\n\r\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\r\nLBL_OPPSTEPZERO=Schrittwert gr\\u00F6\\u00DFer als null eingeben\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=Update fehlgeschlagen\r\n\r\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\r\nLBL_FAILEDREAD=Fehler beim Lesen der Daten\r\n\r\n#XTIT: This is the title message of the Reset Dialog to reset the application.\r\nRESET_TITLE=Ungesicherte \\u00C4nderungen\r\n\r\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\r\nBTN_RF_CANCEL=Abbrechen\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=\\u00C4nderungsprotokoll anzeigen\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=\\u00C4nderungen\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Neuer Wert\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Alter Wert\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Verwerfen\r\n\r\n#XBUT: This is the button\'s text to discard selected changes from the change log.\r\nBTN_CL_DISCARDSEL=Verwerfen\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Schlie\\u00DFen\r\n\r\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Opportunity bearbeiten\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Startdatum\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Enddatum\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=Erwarteter Umsatz\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Ungewichtet\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=Gewichtet\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Prognoserelevant\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Erfolgschance (in %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=Verkaufsphase\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Status\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Account\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Hauptansprechpartner\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Zust\\u00E4ndiger Mitarbeiter\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=\\u00DCbernehmen\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Abbrechen\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \r\nLBL_VAL_MSG=Nur Zahlen eingeben\r\n\r\n#YMSG: This is the error message when a user enters a chance of success value less than zero\r\nLBL_VAL_MINCHANCE=Erfolgschance auf 0 gesetzt\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters greater. \r\nLBL_VAL_MAXCHANCE=Erfolgschance auf 100 gesetzt\r\n\r\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\r\nLBL_VAL_MAXEXPREV=Wert muss kleiner als dreimal die gr\\u00F6\\u00DFte Opportunity sein\r\n\r\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\r\nLBL_VAL_MINEXPREV=Wert muss gr\\u00F6\\u00DFer als ein Viertel der kleinsten Opportunity sein\r\n\r\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_ONE_CURR=1 Opportunity wird nicht angezeigt\r\n\r\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_MULTI_CURR={0} Opportunitys werden nicht angezeigt\r\n\r\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\r\nLBL_MAINTAIN_CURR=Verwalten Sie den Umrechnungskurs f\\u00FCr {0}\r\n\r\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\r\nLBL_ENDDATE_ERROR=Geben Sie ein Enddatum ein, das nach dem Beginndatum liegt\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\r\nLBL_STARTDATE_ERROR=Geben Sie ein Beginndatum ein, das vor dem Enddatum liegt\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\r\nLBL_ENDDATE_ERROR_LOPP=Folgende Opportunitys haben ein sp\\u00E4teres Startdatum als das Enddatum\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Top-{0}-Opportunitys\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=Alle Opportunitys\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=Keine Opportunity verf\\u00FCgbar\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Verlust ausschlie\\u00DFen\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Gewinn ausschlie\\u00DFen\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Nach Gr\\u00F6\\u00DFe anzeigen\r\n',
	"cus/crm/salespipeline/sim/i18n/i18n_en.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Simulate Sales Pipeline\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=of\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Error\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Target Achievement\r\n\r\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\r\nBTN_RESET=Reset\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Log Out\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Settings\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=Actions\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Manage Settings\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Sales Target\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Opportunity\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Close\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Manage Sales Target Settings\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Sales Target Periodicity\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Sales Target for Current Period\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Currency\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=Time Span\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=From\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=To\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Save\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Cancel\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Manage Opportunity Settings\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Step Value\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Set Values Manually\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Minimum Opportunity Value\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Maximum Opportunity Value\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Save\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Reset\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Export to Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Share\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=View Changes\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Any unsaved changes will be lost. Are you sure you want to continue?\r\n\r\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\r\nLBL_NOCHANGELOG=No changes to display\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=Changes saved\r\n\r\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\r\nLBL_OPPSTEPZERO=Enter a step value greater than zero\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=Update failed\r\n\r\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\r\nLBL_FAILEDREAD=Error while reading data\r\n\r\n#XTIT: This is the title message of the Reset Dialog to reset the application.\r\nRESET_TITLE=Unsaved Changes\r\n\r\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\r\nBTN_RF_CANCEL=Cancel\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=View Change Log\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Changes\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=New Value\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Old Value\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Discard\r\n\r\n#XBUT: This is the button\'s text to discard selected changes from the change log.\r\nBTN_CL_DISCARDSEL=Discard\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Close\r\n\r\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Edit Opportunity\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Start Date\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=End Date\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=Expected Sales Volume\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Unweighted\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=Weighted\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Relevant for Forecast\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Chance of Success (in %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=Sales Stage\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Status\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Account\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Main Contact\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Employee Responsible\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=Submit\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Cancel\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \r\nLBL_VAL_MSG=Enter numbers only\r\n\r\n#YMSG: This is the error message when a user enters a chance of success value less than zero\r\nLBL_VAL_MINCHANCE=Chance of success set to zero\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters greater. \r\nLBL_VAL_MAXCHANCE=Chance of success set to 100\r\n\r\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\r\nLBL_VAL_MAXEXPREV=Value must be less than three times the largest opportunity\r\n\r\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\r\nLBL_VAL_MINEXPREV=Value must be greater than a quarter of the smallest opportunity\r\n\r\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_ONE_CURR=1 opportunity not displayed\r\n\r\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_MULTI_CURR={0} opportunities not displayed.\r\n\r\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\r\nLBL_MAINTAIN_CURR=Maintain conversion rate for {0}.\r\n\r\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\r\nLBL_ENDDATE_ERROR=Enter an end date that is after the start date\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\r\nLBL_STARTDATE_ERROR=Enter a start date that is earlier than the end date\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\r\nLBL_ENDDATE_ERROR_LOPP=The following opportunities have a start date later than the end date\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Top {0} Opportunities\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=All Opportunities\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=No Opportunity Available\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Exclude Lost\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Exclude Won\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Display by Size\r\n',
	"cus/crm/salespipeline/sim/i18n/i18n_en_US_sappsd.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=[[[\\u015C\\u0105\\u013A\\u0113\\u015F \\u01A4\\u012F\\u03C1\\u0113\\u013A\\u012F\\u014B\\u0113 \\u015C\\u012F\\u0271\\u0171\\u013A\\u0105\\u0163\\u014F\\u0157]]]\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=[[[\\u014F\\u0192]]]\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=[[[\\u0114\\u0157\\u0157\\u014F\\u0157]]]\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=[[[\\u0162\\u0105\\u0157\\u011F\\u0113\\u0163 \\u0100\\u010B\\u0125\\u012F\\u0113\\u028B\\u0113\\u0271\\u0113\\u014B\\u0163]]]\r\n\r\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\r\nBTN_RESET=[[[\\u0158\\u0113\\u015F\\u0113\\u0163]]]\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=[[[\\u013B\\u014F\\u011F\\u014F\\u0171\\u0163]]]\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=[[[\\u0100\\u03C1\\u03C1 \\u015C\\u0113\\u0163\\u0163\\u012F\\u014B\\u011F\\u015F]]]\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=[[[\\u0100\\u010B\\u0163\\u012F\\u014F\\u014B\\u015F]]]\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=[[[\\u0100\\u03C1\\u03C1 \\u015C\\u0113\\u0163\\u0163\\u012F\\u014B\\u011F\\u015F]]]\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=[[[\\u015C\\u0105\\u013A\\u0113\\u015F \\u0162\\u0105\\u0157\\u011F\\u0113\\u0163]]]\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=[[[\\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u0177]]]\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=[[[\\u0108\\u013A\\u014F\\u015F\\u0113]]]\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=[[[\\u015C\\u0105\\u013A\\u0113\\u015F \\u0162\\u0105\\u0157\\u011F\\u0113\\u0163 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F]]]\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=[[[\\u015C\\u0105\\u013A\\u0113\\u015F \\u0162\\u0105\\u0157\\u011F\\u0113\\u0163 \\u01A4\\u0113\\u0157\\u012F\\u014F\\u018C\\u012F\\u010B\\u012F\\u0163\\u0177]]]\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=[[[\\u015C\\u0105\\u013A\\u0113\\u015F \\u0162\\u0105\\u0157\\u011F\\u0113\\u0163 \\u0192\\u014F\\u0157 \\u0108\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163 \\u01A4\\u0113\\u0157\\u012F\\u014F\\u018C]]]\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=[[[\\u0108\\u0171\\u0157\\u0157\\u0113\\u014B\\u010B\\u0177]]]\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=[[[\\u0162\\u012F\\u0271\\u0113\\u015F\\u03C1\\u0105\\u014B]]]\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=[[[\\u0191\\u0157\\u014F\\u0271]]]\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=[[[\\u0162\\u014F]]]\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=[[[\\u015C\\u0105\\u028B\\u0113]]]\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A]]]\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=[[[\\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u0177 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F]]]\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=[[[\\u015C\\u0163\\u0113\\u03C1 \\u01B2\\u0105\\u013A\\u0171\\u0113]]]\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=[[[\\u015C\\u0113\\u0163 \\u01B2\\u0105\\u013A\\u0171\\u0113\\u015F \\u039C\\u0105\\u014B\\u0171\\u0105\\u013A\\u013A\\u0177]]]\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=[[[\\u039C\\u012F\\u014B\\u012F\\u0271\\u0171\\u0271 \\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u0177 \\u01B2\\u0105\\u013A\\u0171\\u0113]]]\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=[[[\\u039C\\u0105\\u03C7\\u012F\\u0271\\u0171\\u0271 \\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u0177 \\u01B2\\u0105\\u013A\\u0171\\u0113]]]\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=[[[\\u015C\\u0105\\u028B\\u0113]]]\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=[[[\\u0158\\u0113\\u0192\\u0157\\u0113\\u015F\\u0125]]]\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=[[[\\u0114\\u03C7\\u03C1\\u014F\\u0157\\u0163 \\u0163\\u014F \\u0114\\u03C7\\u010B\\u0113\\u013A]]]\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=[[[\\u015C\\u0125\\u0105\\u0157\\u0113]]]\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F]]]\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=[[[\\u015C\\u0113\\u028B\\u0113\\u0157\\u0105\\u013A \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F \\u0125\\u0105\\u028B\\u0113 \\u0183\\u0113\\u0113\\u014B \\u0271\\u0105\\u018C\\u0113. \\u0100\\u0157\\u0113 \\u0177\\u014F\\u0171 \\u015F\\u0171\\u0157\\u0113 \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u0158\\u0113\\u0192\\u0157\\u0113\\u015F\\u0125?]]]\r\n\r\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\r\nLBL_NOCHANGELOG=[[[\\u0143\\u014F \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F \\u0125\\u0105\\u028B\\u0113 \\u0183\\u0113\\u0113\\u014B \\u0271\\u0105\\u018C\\u0113\\!]]]\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=[[[\\u016E\\u03C1\\u018C\\u0105\\u0163\\u0113 \\u015C\\u0171\\u010B\\u010B\\u0113\\u015F\\u015F\\u0192\\u0171\\u013A\\!]]]\r\n\r\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\r\nLBL_OPPSTEPZERO=[[[\\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u0177 \\u015C\\u0163\\u0113\\u03C1 \\u01B2\\u0105\\u013A\\u0171\\u0113 \\u010B\\u0105\\u014B\\u014B\\u014F\\u0163 \\u0183\\u0113 \\u017E\\u0113\\u0157\\u014F\\!]]]\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=[[[\\u016E\\u03C1\\u018C\\u0105\\u0163\\u0113 \\u0191\\u0105\\u012F\\u013A\\u0113\\u018C\\!]]]\r\n\r\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\r\nLBL_FAILEDREAD=[[[\\u0158\\u0113\\u0105\\u018C \\u0191\\u0105\\u012F\\u013A\\u0113\\u018C\\!]]]\r\n\r\n#XTIT: This is the title message of the Reset Dialog to reset the application.\r\nRESET_TITLE=[[[\\u0108\\u014F\\u014B\\u0192\\u012F\\u0157\\u0271\\u0105\\u0163\\u012F\\u014F\\u014B]]]\r\n\r\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\r\nBTN_RF_OK=[[[\\u014E\\u0136]]]\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\r\nBTN_RF_CANCEL=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A]]]\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113 \\u013B\\u014F\\u011F]]]\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F]]]\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=[[[\\u0143\\u0113\\u0175 \\u01B2\\u0105\\u013A\\u0171\\u0113]]]\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=[[[\\u014E\\u013A\\u018C \\u01B2\\u0105\\u013A\\u0171\\u0113]]]\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=[[[\\u010E\\u012F\\u015F\\u010B\\u0105\\u0157\\u018C]]]\r\n\r\n#XBUT: This is the button\'s text to discard selected changes from the change log.\r\nBTN_CL_DISCARDSEL=[[[\\u010E\\u012F\\u015F\\u010B\\u0105\\u0157\\u018C \\u015C\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C]]]\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=[[[\\u0108\\u013A\\u014F\\u015F\\u0113]]]\r\n\r\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=[[[\\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u0177]]]\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=[[[\\u015C\\u0163\\u0105\\u0157\\u0163 \\u010E\\u0105\\u0163\\u0113]]]\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=[[[\\u0114\\u014B\\u018C \\u010E\\u0105\\u0163\\u0113]]]\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=[[[\\u0114\\u03C7\\u03C1\\u0113\\u010B\\u0163\\u0113\\u018C \\u015C\\u0105\\u013A\\u0113\\u015F \\u01B2\\u014F\\u013A\\u0171\\u0271\\u0113]]]\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=[[[\\u016E\\u014B\\u0175\\u0113\\u012F\\u011F\\u0125\\u0163\\u0113\\u018C]]]\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=[[[\\u0174\\u0113\\u012F\\u011F\\u0125\\u0163\\u0113\\u018C]]]\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=[[[\\u0158\\u0113\\u013A\\u0113\\u028B\\u0105\\u014B\\u0163 \\u0192\\u014F\\u0157 \\u0191\\u014F\\u0157\\u0113\\u010B\\u0105\\u015F\\u0163]]]\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=[[[\\u0108\\u0125\\u0105\\u014B\\u010B\\u0113 \\u014F\\u0192 \\u015C\\u0171\\u010B\\u010B\\u0113\\u015F\\u015F (\\u012F\\u014B %)]]]\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=[[[\\u015C\\u0105\\u013A\\u0113\\u015F \\u015C\\u0163\\u0105\\u011F\\u0113]]]\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=[[[\\u015C\\u0163\\u0105\\u0163\\u0171\\u015F]]]\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=[[[\\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163]]]\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=[[[\\u039C\\u0105\\u012F\\u014B \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163]]]\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=[[[\\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113 \\u0158\\u0113\\u015F\\u03C1\\u014F\\u014B\\u015F\\u012F\\u0183\\u013A\\u0113]]]\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=[[[\\u014E\\u0136]]]\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A]]]\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \r\nLBL_VAL_MSG=[[[\\u0114\\u014B\\u0163\\u0113\\u0157 \\u014F\\u014B\\u013A\\u0177 \\u014B\\u0171\\u0271\\u0183\\u0113\\u0157\\u015F]]]\r\n\r\n#YMSG: This is the error message when a user enters a chance of success value less than zero\r\nLBL_VAL_MINCHANCE=[[[\\u0108\\u0125\\u0105\\u014B\\u010B\\u0113 \\u014F\\u0192 \\u015F\\u0171\\u010B\\u010B\\u0113\\u015F\\u015F \\u015F\\u0113\\u0163 \\u0163\\u014F \\u017E\\u0113\\u0157\\u014F]]]\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters greater. \r\nLBL_VAL_MAXCHANCE=[[[\\u0108\\u0125\\u0105\\u014B\\u010B\\u0113 \\u014F\\u0192 \\u015F\\u0171\\u010B\\u010B\\u0113\\u015F\\u015F \\u015F\\u0113\\u0163 \\u0163\\u014F \\u0125\\u0171\\u014B\\u018C\\u0157\\u0113\\u018C]]]\r\n\r\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\r\nLBL_VAL_MAXEXPREV=[[[\\u0114\\u014B\\u0163\\u0113\\u0157 \\u0105 \\u028B\\u0105\\u013A\\u0171\\u0113 \\u0163\\u0125\\u0105\\u0163 \\u012F\\u015F \\u014B\\u014F\\u0163 \\u011F\\u0157\\u0113\\u0105\\u0163\\u0113\\u0157 \\u0163\\u0125\\u0105\\u014B \\u0163\\u0125\\u0157\\u0113\\u0113 \\u0163\\u012F\\u0271\\u0113\\u015F \\u0163\\u0125\\u0113 \\u028B\\u014F\\u013A\\u0171\\u0271\\u0113 \\u014F\\u0192 \\u0177\\u014F\\u0171\\u0157 \\u013A\\u0105\\u0157\\u011F\\u0113\\u015F\\u0163 \\u014F\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u0177]]]\r\n\r\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\r\nLBL_VAL_MINEXPREV=[[[\\u0114\\u014B\\u0163\\u0113\\u0157 \\u0105 \\u028B\\u0105\\u013A\\u0171\\u0113 \\u0163\\u0125\\u0105\\u0163 \\u012F\\u015F \\u014B\\u014F\\u0163 \\u013A\\u0113\\u015F\\u015F \\u0163\\u0125\\u0105\\u014B \\u014F\\u014B\\u0113-\\u0192\\u014F\\u0171\\u0157\\u0163\\u0125 \\u0163\\u0125\\u0113 \\u028B\\u014F\\u013A\\u0171\\u0271\\u0113 \\u014F\\u0192 \\u0177\\u014F\\u0171\\u0157 \\u015F\\u0271\\u0105\\u013A\\u013A\\u0113\\u015F\\u0163 \\u014F\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u0177]]]\r\n\r\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_ONE_CURR=[[[1 \\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u0177 \\u014B\\u014F\\u0163 \\u018C\\u012F\\u015F\\u03C1\\u013A\\u0105\\u0177\\u0113\\u018C.]]]\r\n\r\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_MULTI_CURR={0}[[[ \\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u012F\\u0113\\u015F \\u014B\\u014F\\u0163 \\u018C\\u012F\\u015F\\u03C1\\u013A\\u0105\\u0177\\u0113\\u018C.]]]\r\n\r\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\r\nLBL_MAINTAIN_CURR=[[[\\u039C\\u0105\\u012F\\u014B\\u0163\\u0105\\u012F\\u014B \\u010B\\u014F\\u014B\\u028B\\u0113\\u0157\\u015F\\u012F\\u014F\\u014B \\u0157\\u0105\\u0163\\u0113 \\u0192\\u014F\\u0157 {0}.]]]\r\n\r\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\r\nLBL_ENDDATE_ERROR=[[[\\u0114\\u014B\\u018C \\u018C\\u0105\\u0163\\u0113 \\u010B\\u0105\\u014B \\u014B\\u014F\\u0163 \\u0183\\u0113 \\u013A\\u0113\\u015F\\u015F \\u0163\\u0125\\u0105\\u014B \\u015C\\u0163\\u0105\\u0157\\u0163 \\u018C\\u0105\\u0163\\u0113.]]]\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\r\nLBL_STARTDATE_ERROR=[[[\\u015C\\u0163\\u0105\\u0157\\u0163 \\u018C\\u0105\\u0163\\u0113 \\u010B\\u0105\\u014B \\u014B\\u014F\\u0163 \\u0183\\u0113 \\u011F\\u0157\\u0113\\u0105\\u0163\\u0113\\u0157 \\u0163\\u0125\\u0105\\u014B \\u0114\\u014B\\u018C \\u018C\\u0105\\u0163\\u0113.]]]\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\r\nLBL_ENDDATE_ERROR_LOPP=[[[\\u0191\\u014F\\u013A\\u013A\\u014F\\u0175\\u012F\\u014B\\u011F \\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u012F\\u0113\\u015F \\u0125\\u0105\\u028B\\u0113 \\u0114\\u014B\\u018C \\u010E\\u0105\\u0163\\u0113 \\u0114\\u0157\\u0157\\u014F\\u0157 ]]]\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=[[[\\u0162\\u014F\\u03C1 {0} \\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u012F\\u0113\\u015F]]]\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=[[[\\u0100\\u013A\\u013A \\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u012F\\u0113\\u015F]]]\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=[[[\\u0143\\u014F \\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u0177]]]\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=[[[\\u0114\\u03C7\\u010B\\u013A\\u0171\\u018C\\u0113 \\u013B\\u014F\\u015F\\u0163]]]\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=[[[\\u0114\\u03C7\\u010B\\u013A\\u0171\\u018C\\u0113 \\u0174\\u014F\\u014B]]]\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=[[[\\u010E\\u012F\\u015F\\u03C1\\u013A\\u0105\\u0177 \\u0183\\u0177 \\u015C\\u012F\\u017E\\u0113]]]\r\n',
	"cus/crm/salespipeline/sim/i18n/i18n_en_US_saptrc.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=wFdzJuIK4IBpcLcwZ4hHAA_Sales Pipeline Simulator\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=WNKvAKoQKqkFAZ8hNPW4aQ_of\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=T5kJJ0OfEWayihuMJK0q4g_Error\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=5u7wXVH1BtbRHdi/QWjmzQ_Target Achievement\r\n\r\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\r\nBTN_RESET=tHh+n9NjGCusxsoAWHVHbw_Reset\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=ixKbUi1zuQgRAefSVGwHGw_Logout\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=uEjg7he2apDTwmG30sGSrg_App Settings\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=z9Z4rvvLSuTAtH9q6ZQ+Jw_Actions\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Dx8kTItbdW52ZO4uJRg+mQ_App Settings\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=+WtuVpsyW1q+PffMaRzM4w_Sales Target\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=qNuoap8r2tB/TFAvxncW4Q_Opportunity\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=FuE4AFSGFDMlum+JWWhMlg_Close\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=hgk4N0R2xR5NgFn3YcXM/g_Sales Target Details\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=GF6TF0HW2SQyOzoq3A9/lg_Sales Target Periodicity\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=jQcoBFolwTuqsU/LxLZmLw_Sales Target for Current Period\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=UU1CJifLIUja2D2GgK7Ftg_Currency\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=hJlsKOuYdkgCfpbdy1Gxmg_Timespan\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=nhpH+unlgX80DNEVncgTSQ_From\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=5FR+OCvV73KuWilm0LDafQ_To\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=8DsJy/X/Wk7/G8LAw14Fhw_Save\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=vOg3eOTrkm19G3SrVS4PYA_Cancel\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Bi3mEIiqwYpER/Z8DKtHpA_Opportunity Details\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=kVOOVopeKh/wjUBicn5NGQ_Step Value\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=kTykYq7OAUU1z7MZxNzMMA_Set Values Manually\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=yI/tvVcRUdc3wfzqFVQWqg_Minimum Opportunity Value\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=JRJB1rh8Emc2V6n7E8TWHQ_Maximum Opportunity Value\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Q44aXZGqUHUtvSpKDsa3mg_Save\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=/zvgvMFFlc1YsujpSBQDUQ_Refresh\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=fsAlGztE72ENYAzmhdvXLw_Export to Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=+gBuWt2Kg8toivw4t10s3w_Share\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=TTR8PIQ6+NqTQ+U1BbJw+Q_Changes\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=3ZG1Jkk0p81DfxPNL4AplQ_Several changes have been made. Are you sure you want to Refresh?\r\n\r\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\r\nLBL_NOCHANGELOG=QND2PhlbeAAXhhsfaRLiPA_No changes have been made\\!\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=qdFiyd0zMBppyxRt7HYgSw_Update Successful\\!\r\n\r\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\r\nLBL_OPPSTEPZERO=c/2i/rV0UcICMjwslVkCrg_Opportunity Step Value cannot be zero\\!\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=50A008SLyies4zIWDbPGvg_Update Failed\\!\r\n\r\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\r\nLBL_FAILEDREAD=uON9Yaa6Xjjmoa5r4nwCMw_Read Failed\\!\r\n\r\n#XTIT: This is the title message of the Reset Dialog to reset the application.\r\nRESET_TITLE=HUj8hzewrym96cPPC+/4Rw_Confirmation\r\n\r\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\r\nBTN_RF_OK=8d0IwjsgucWgVpE8vorCNQ_OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\r\nBTN_RF_CANCEL=RfkVyPxn1uOn/mXmcBVI1g_Cancel\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=N7dFy03+hrS6Y6Kyxgjh5w_Change Log\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=VjNyiznSv3a+LMstM65Rsw_Changes\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=6I+X9Uv0IKV/kVkCGtWyGQ_New Value\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=VdJJX3lh87jK8mhU8Rz4Bg_Old Value\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=kg/6+ezpiXsrP6sCISs16Q_Discard\r\n\r\n#XBUT: This is the button\'s text to discard selected changes from the change log.\r\nBTN_CL_DISCARDSEL=aN25OuZ9JLDwiJ3nqEt2MA_Discard Selected\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=yq4e2qaV71fqXT8AiXGndg_Close\r\n\r\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=CYBaNHUQRJIllpSzVvw9Nw_Opportunity\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=oWRmZRK2RfDt/A9CO/oSeQ_Start Date\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=uPH9rmaS9qVI+UFkNWTMUQ_End Date\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=/zItO4++9i57HvAyfE7pvQ_Expected Sales Volume\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=UjEy7TAeXAvmwQ6ZBZFOzg_Unweighted\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=ZBRzaS8uY03wz+wMiUN0qQ_Weighted\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=hrCf39tQQZuxYDo/gz7eWQ_Relevant for Forecast\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=367IzVbOWZP1qgjCFs1Gcw_Chance of Success (in %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=4tYChvKthKrsuLd+PWEX9w_Sales Stage\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=jzh+qEY0eHbOV6BksSa1Tw_Status\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=6pG8WUcpiE4nSCueVvi+Tw_Account\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=TwnaFXmXSKzr04UQKmy9nw_Main Contact\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=I3ZAzS4H2fm16y5JtNNuWg_Employee Responsible\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=Me9ruUrgpuZQxfy7v9P1Og_OK\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=W46ob6fYWkiuLG6S3pmtww_Cancel\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \r\nLBL_VAL_MSG=ZwleIBO0kqNCojMko9r4hg_Enter only numbers\r\n\r\n#YMSG: This is the error message when a user enters a chance of success value less than zero\r\nLBL_VAL_MINCHANCE=dDEYln6j8d6EyXcX3DGtyg_Chance of success set to zero\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters greater. \r\nLBL_VAL_MAXCHANCE=mjJ6EpGdy2q0TSsk+6+I+g_Chance of success set to hundred\r\n\r\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\r\nLBL_VAL_MAXEXPREV=aSHyzEcZQLCn4cMa7zwFDg_Enter a value that is not greater than three times the volume of your largest opportunity\r\n\r\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\r\nLBL_VAL_MINEXPREV=+7DPylaC2EQkzRCZZXJV0g_Enter a value that is not less than one-fourth the volume of your smallest opportunity\r\n\r\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_ONE_CURR=XmjNBByipKbyGQL2kEmDXQ_1 Opportunity not displayed.\r\n\r\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_MULTI_CURR=C7XH+K5ID/JbPxuseAPRdg_{0} Opportunities not displayed.\r\n\r\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\r\nLBL_MAINTAIN_CURR=qubGfWUUWXRqXKdzxS7sDQ_Maintain conversion rate for {0}.\r\n\r\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\r\nLBL_ENDDATE_ERROR=Qj19cjLghXJtlIK7axd//w_End date can not be less than Start date.\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\r\nLBL_STARTDATE_ERROR=hbq55+VprVg8fcukvi/ASg_Start date can not be greater than End date.\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\r\nLBL_ENDDATE_ERROR_LOPP=4qC2+cYmEYy7USX4aMzp+w_Following Opportunities have End Date Error \r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=m8jf4/eC9FNWFH5L1rn69w_Top {0} Opportunities\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=Fxndv0OnHQVKqHaul4VM5g_All Opportunities\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=iLvWOph6XbafG37tStgapA_No Opportunity\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=LE/0Mllc1I5ciqM8dhYNHA_Exclude Lost\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=57oRlGiHJAkGXUVQYJ1i/w_Exclude Won\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=DmDr1dOU/c6q5KwwlqaVtg_Display by Size\r\n',
	"cus/crm/salespipeline/sim/i18n/i18n_es.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Simular pipeline de ventas\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=de\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Error\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Acierto de objetivo\r\n\r\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\r\nBTN_RESET=Reinicializar\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Finalizar sesi\\u00F3n\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Opciones\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=Acciones\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Gestionar opciones\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Objetivo de ventas\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Oportunidad\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Cerrar\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Gestionar opciones de objetivo de ventas\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Periodicidad del objetivo de ventas\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Objetivo de ventas del per\\u00EDodo actual\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Moneda\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=Intervalo de tiempo\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=De\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=Hasta\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Guardar\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Cancelar\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Gestionar opciones de oportunidad\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Valor del paso\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Fijar valores manualmente\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Valor m\\u00EDnimo de oportunidad\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Valor m\\u00E1ximo de oportunidad\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Guardar\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Reinicializar\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Exportar a Microsoft Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Compartir\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=Visualizar modificaciones\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Se perder\\u00E1n las modificaciones sin guardar. \\u00BFSeguro que desea continuar?\r\n\r\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\r\nLBL_NOCHANGELOG=Sin modificaciones a visualizar\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=Las modificaciones se han guardado\r\n\r\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\r\nLBL_OPPSTEPZERO=Introducir un valor incremental superior a cero\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=Error de actualizaci\\u00F3n\r\n\r\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\r\nLBL_FAILEDREAD=Error al leer datos\r\n\r\n#XTIT: This is the title message of the Reset Dialog to reset the application.\r\nRESET_TITLE=Modificaciones no guardadas\r\n\r\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\r\nBTN_RF_CANCEL=Cancelar\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=Visualizar log de modificaciones\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Modificaciones\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Valor nuevo\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Valor antiguo\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Rechazar\r\n\r\n#XBUT: This is the button\'s text to discard selected changes from the change log.\r\nBTN_CL_DISCARDSEL=Rechazar\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Cerrar\r\n\r\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Editar oportunidad\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Fecha de inicio\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Fecha de fin\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=Volumen de ventas esperado\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=No ponderado\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=Ponderado\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Relevante para la previsi\\u00F3n\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Posibilidad de \\u00E9xito (en %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=Fase de ventas\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Estado\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Cliente\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Contacto principal\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Empleado responsable\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=Enviar\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Cancelar\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \r\nLBL_VAL_MSG=Introduzca solo n\\u00FAmeros\r\n\r\n#YMSG: This is the error message when a user enters a chance of success value less than zero\r\nLBL_VAL_MINCHANCE=Posibilidad de \\u00E9xito fijada en 0\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters greater. \r\nLBL_VAL_MAXCHANCE=Posibilidad de \\u00E9xito fijada en 100\r\n\r\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\r\nLBL_VAL_MAXEXPREV=El valor no puede ser superior a tres veces el volumen de su mayor oportunidad\r\n\r\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\r\nLBL_VAL_MINEXPREV=El valor no puede ser inferior a una cuarta parte del volumen de su menor oportunidad\r\n\r\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_ONE_CURR=1 oportunidad no mostrada\r\n\r\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_MULTI_CURR={0} oportunidades no mostradas.\r\n\r\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\r\nLBL_MAINTAIN_CURR=Actualizar la tasa de conversi\\u00F3n para {0}.\r\n\r\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\r\nLBL_ENDDATE_ERROR=Introduzca una fecha de fin que sea posterior a la fecha de inicio\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\r\nLBL_STARTDATE_ERROR=Introduzca una fecha de inicio que sea anterior a la fecha de fin\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\r\nLBL_ENDDATE_ERROR_LOPP=Las oportunidades siguientes tienen una fecha de inicio posterior a la fecha de fin\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Las {0} oportunidades principales\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=Todas las oportunidades\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=No hay oportunidades disponibles\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Excluir las perdidas\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Excluir las ganadas\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Mostrar por tama\\u00F1o\r\n',
	"cus/crm/salespipeline/sim/i18n/i18n_fr.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Simulation de pipeline des ventes\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=/\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Erreur\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Atteinte des objectifs\r\n\r\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\r\nBTN_RESET=R\\u00E9initialiser\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=D\\u00E9connexion\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Options\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=Actions\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=G\\u00E9rer options\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Objectif des ventes\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Opportunit\\u00E9\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Fermer\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=G\\u00E9rer options objectif des ventes\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Fr\\u00E9quence de l\'objectif des ventes\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Objectif des ventes pour la p\\u00E9riode actuelle\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Devise\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=P\\u00E9riode\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=du\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=au\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Sauvegarder\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Interrompre\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=G\\u00E9rer options d\'opportunit\\u00E9\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Valeur d\'\\u00E9tape\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=D\\u00E9finir valeurs manuellement\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Valeur minimale de l\'opportunit\\u00E9\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Valeur maximale de l\'opportunit\\u00E9\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Sauvegarder\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=R\\u00E9initialiser\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Export vers Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Partager\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=Afficher mod.\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Toutes les modifications non sauvegard\\u00E9es seront perdues. Voulez-vous continuer ?\r\n\r\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\r\nLBL_NOCHANGELOG=Aucune modification \\u00E0 afficher\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=Modifications sauvegard\\u00E9es\r\n\r\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\r\nLBL_OPPSTEPZERO=Saisissez une valeur d\'\\u00E9tape sup\\u00E9rieure \\u00E0 z\\u00E9ro.\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=Echec de la mise \\u00E0 jour\r\n\r\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\r\nLBL_FAILEDREAD=Erreur lors de la lecture des donn\\u00E9es\r\n\r\n#XTIT: This is the title message of the Reset Dialog to reset the application.\r\nRESET_TITLE=Modifications non sauvegard\\u00E9es\r\n\r\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\r\nBTN_RF_CANCEL=Interrompre\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=Afficher journal des modifications\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Modifications\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Nouvelle valeur\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Ancienne valeur\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Rejeter\r\n\r\n#XBUT: This is the button\'s text to discard selected changes from the change log.\r\nBTN_CL_DISCARDSEL=Rejeter\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Fermer\r\n\r\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Modifier l\\u2019opportunit\\u00E9\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Date de d\\u00E9but\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Date de fin\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=Volume d\'affaires escompt\\u00E9\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Non pond\\u00E9r\\u00E9\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=Pond\\u00E9r\\u00E9\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Pertinent pour les pr\\u00E9visions\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Chance de r\\u00E9ussite (en %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=\\u00C9tape de vente\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Statut\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Compte\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Contact principal\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Responsable\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=Envoyer\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Interrompre\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \r\nLBL_VAL_MSG=Saisir nombres uniquement\r\n\r\n#YMSG: This is the error message when a user enters a chance of success value less than zero\r\nLBL_VAL_MINCHANCE=Chance de r\\u00E9ussite d\\u00E9finie sur z\\u00E9ro\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters greater. \r\nLBL_VAL_MAXCHANCE=Chance de r\\u00E9ussite d\\u00E9finie sur 100\r\n\r\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\r\nLBL_VAL_MAXEXPREV=La valeur doit \\u00EAtre inf\\u00E9rieure \\u00E0 trois fois l\'opportunit\\u00E9 la plus importante.\r\n\r\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\r\nLBL_VAL_MINEXPREV=La valeur doit \\u00EAtre sup\\u00E9rieure \\u00E0 un quart de l\'opportunit\\u00E9 la moins importante.\r\n\r\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_ONE_CURR=1 opportunit\\u00E9 n\'est pas affich\\u00E9e\r\n\r\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_MULTI_CURR={0} opportunit\\u00E9s non affich\\u00E9es.\r\n\r\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\r\nLBL_MAINTAIN_CURR=G\\u00E9rez le taux de conversion pour {0}.\r\n\r\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\r\nLBL_ENDDATE_ERROR=Entrez une date de fin post\\u00E9rieure \\u00E0 la date de d\\u00E9but.\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\r\nLBL_STARTDATE_ERROR=Entrez une date de d\\u00E9but ant\\u00E9rieure \\u00E0 la date de fin.\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\r\nLBL_ENDDATE_ERROR_LOPP=Les opportunit\\u00E9s suivantes ont une date de d\\u00E9but ult\\u00E9rieure \\u00E0 la date de fin.\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Les {0} meilleures opportunit\\u00E9s\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=Toutes les opportunit\\u00E9s\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=Aucune opportunit\\u00E9 disponible\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Exclure Perdues\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Exclure Gagn\\u00E9es\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Afficher par taille\r\n',
	"cus/crm/salespipeline/sim/i18n/i18n_hr.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Simuliraj pipeline prodaje\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=od\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Gre\\u0161ka\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Dostignu\\u0107e cilja\r\n\r\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\r\nBTN_RESET=Ponovno postavi\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Odjava\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Postave\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=Radnje\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Upravljaj postavama\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Cilj prodaje\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Prilika\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Zatvori\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Upravljaj postavama cilja prodaje\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Periodi\\u010Dnost cilja prodaje\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Cilj prodaje za teku\\u0107e razdoblje\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Valuta\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=Vremensko razdoblje\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=Od\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=Do\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Snimi\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Otka\\u017Ei\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Upravljaj postavama prilike\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Vrijednost koraka\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Ru\\u010Dno postavi vrijednosti\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Minimalna vrijednost prilike\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Maksimalna vrijednost prilike\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Snimi\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Ponovno postavi\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Eksportiraj u Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Otpusti\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=Prika\\u017Ei promjene\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Nesnimljene promjene \\u0107e se izgubiti. \\u017Delite li zaista nastaviti?\r\n\r\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\r\nLBL_NOCHANGELOG=Nema promjena za prikaz\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=Promjene su snimljene\r\n\r\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\r\nLBL_OPPSTEPZERO=Unesite vrijednost koraka ve\\u0107u od nule\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=A\\u017Euriranje nije uspjelo\r\n\r\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\r\nLBL_FAILEDREAD=Gre\\u0161ka tijekom \\u010Ditanja podataka\r\n\r\n#XTIT: This is the title message of the Reset Dialog to reset the application.\r\nRESET_TITLE=Nesnimljene promjene\r\n\r\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\r\nBTN_RF_OK=U redu\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\r\nBTN_RF_CANCEL=Otka\\u017Ei\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=Prika\\u017Ei protokol promjene\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Promjene\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Nova vrijednost\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Stara vrijednost\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Odbaci\r\n\r\n#XBUT: This is the button\'s text to discard selected changes from the change log.\r\nBTN_CL_DISCARDSEL=Odbaci\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Zatvori\r\n\r\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Uredi priliku\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Po\\u010Detni datum\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Datum zavr\\u0161etka\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=O\\u010Dekivani promet\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Neponderirano\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=Ponderirano\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Relevantno za predvi\\u0111anje\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Vjerojatnost uspjeha (u %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=Faza prodaje\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Status\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Klijent\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Glavni kontakt\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Odgovorni zaposlenik\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=Podnesi\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Otka\\u017Ei\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \r\nLBL_VAL_MSG=Unesite samo brojeve\r\n\r\n#YMSG: This is the error message when a user enters a chance of success value less than zero\r\nLBL_VAL_MINCHANCE=Vjerojatnost uspjeha postavljena na nulu\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters greater. \r\nLBL_VAL_MAXCHANCE=Vjerojatnost uspjeha postavljena na 100\r\n\r\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\r\nLBL_VAL_MAXEXPREV=Vrijednost mora biti manja od trostruke najve\\u0107e prilike\r\n\r\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\r\nLBL_VAL_MINEXPREV=Vrijednost mora biti ve\\u0107a od \\u010Detvrtine najmanje prilike\r\n\r\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_ONE_CURR=1 prilika nije prikazana\r\n\r\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_MULTI_CURR={0} prilika nije prikazano.\r\n\r\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\r\nLBL_MAINTAIN_CURR=Odr\\u017Eavaj stupanj konverzije za {0}.\r\n\r\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\r\nLBL_ENDDATE_ERROR=Unesite zavr\\u0161ni datum koji je poslije po\\u010Detnog datuma\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\r\nLBL_STARTDATE_ERROR=Unesite po\\u010Detni datum koji je prije zavr\\u0161nog datuma\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\r\nLBL_ENDDATE_ERROR_LOPP=Sljede\\u0107e prilike imaju po\\u010Detni datum poslije zavr\\u0161nog datuma\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Top {0} prilika\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=Sve prilike\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=Prilika nije raspolo\\u017Eiva\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Isklju\\u010Di izgubljeno\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Isklju\\u010Di dobiveno\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Prika\\u017Ei prema veli\\u010Dini\r\n',
	"cus/crm/salespipeline/sim/i18n/i18n_hu.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Sales Pipeline szimul\\u00E1ci\\u00F3ja\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=-\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Hiba\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=C\\u00E9l el\\u00E9r\\u00E9se\r\n\r\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\r\nBTN_RESET=Vissza\\u00E1ll\\u00EDt\\u00E1s\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Kijelentkez\\u00E9s\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Be\\u00E1ll\\u00EDt\\u00E1sok\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=M\\u0171veletek\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Be\\u00E1ll\\u00EDt\\u00E1sok kezel\\u00E9se\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=\\u00C9rt\\u00E9kes\\u00EDt\\u00E9si c\\u00E9l\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Opportunity\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Bez\\u00E1r\\u00E1s\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=\\u00C9rt\\u00E9kes\\u00EDt\\u00E9si c\\u00E9l be\\u00E1ll\\u00EDt\\u00E1sainak kezel\\u00E9se\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=\\u00C9rt\\u00E9kes\\u00EDt\\u00E9si c\\u00E9l periodicit\\u00E1sa\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=\\u00C9rt\\u00E9kes\\u00EDt\\u00E9si c\\u00E9l az aktu\\u00E1lis peri\\u00F3dusban\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=P\\u00E9nznem\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=Id\\u0151intervallum\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=Kezd\\u00E9s\\:\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=A k\\u00F6vetkez\\u0151ig\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Ment\\u00E9s\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=M\\u00E9gse\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Opportunity-be\\u00E1ll\\u00EDt\\u00E1sok kezel\\u00E9se\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=L\\u00E9p\\u00E9s\\u00E9rt\\u00E9k\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=\\u00C9rt\\u00E9kek manu\\u00E1lis megad\\u00E1sa\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Opportunity minim\\u00E1lis \\u00E9rt\\u00E9ke\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Opportunity maxim\\u00E1lis \\u00E9rt\\u00E9ke\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Ment\\u00E9s\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Vissza\\u00E1ll\\u00EDt\\u00E1s\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Export\\u00E1l\\u00E1s Excelbe\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Megoszt\\u00E1s\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=M\\u00F3dos\\u00EDt\\u00E1sok megjelen\\u00EDt\\u00E9se\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Elv\\u00E9sz minden el nem mentett m\\u00F3dos\\u00EDt\\u00E1s. Val\\u00F3ban szeretn\\u00E9 folytatni?\r\n\r\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\r\nLBL_NOCHANGELOG=Nincs megjelen\\u00EDtend\\u0151 m\\u00F3dos\\u00EDt\\u00E1s\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=M\\u00F3dos\\u00EDt\\u00E1sok elmentve\r\n\r\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\r\nLBL_OPPSTEPZERO=Adjon meg null\\u00E1n\\u00E1l nagyobb l\\u00E9p\\u00E9s\\u00E9rt\\u00E9ket\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=Aktualiz\\u00E1l\\u00E1s sikertelen\r\n\r\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\r\nLBL_FAILEDREAD=Hiba az adatok olvas\\u00E1sa k\\u00F6zben\r\n\r\n#XTIT: This is the title message of the Reset Dialog to reset the application.\r\nRESET_TITLE=Nem mentett m\\u00F3dos\\u00EDt\\u00E1sok\r\n\r\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\r\nBTN_RF_OK=Rendben\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\r\nBTN_RF_CANCEL=M\\u00E9gse\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=M\\u00F3dos\\u00EDt\\u00E1snapl\\u00F3 megjelen\\u00EDt\\u00E9se\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=M\\u00F3dos\\u00EDt\\u00E1sok\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=\\u00DAj \\u00E9rt\\u00E9k\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=R\\u00E9gi \\u00E9rt\\u00E9k\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Elvet\\u00E9s\r\n\r\n#XBUT: This is the button\'s text to discard selected changes from the change log.\r\nBTN_CL_DISCARDSEL=Elvet\\u00E9s\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Bez\\u00E1r\\u00E1s\r\n\r\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Opportunity feldolgoz\\u00E1sa\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Kezd\\u0151 d\\u00E1tum\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Befejez\\u00E9s d\\u00E1tuma\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=V\\u00E1rhat\\u00F3 forgalom\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Nem s\\u00FAlyozott\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=S\\u00FAlyozott\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Progn\\u00F3zisrelev\\u00E1ns\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Siker es\\u00E9lye (in %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=\\u00C9rt\\u00E9kes\\u00EDt\\u00E9si f\\u00E1zis\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=St\\u00E1tus\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=\\u00DCgyf\\u00E9l\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=F\\u0151 t\\u00E1rgyal\\u00F3partner\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Illet\\u00E9kes dolgoz\\u00F3\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=Elk\\u00FCld\\u00E9s\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Megszak\\u00EDt\\u00E1s\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \r\nLBL_VAL_MSG=Csak sz\\u00E1mok adhat\\u00F3k meg\r\n\r\n#YMSG: This is the error message when a user enters a chance of success value less than zero\r\nLBL_VAL_MINCHANCE=A siker es\\u00E9lye null\\u00E1ra van \\u00E1ll\\u00EDtva\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters greater. \r\nLBL_VAL_MAXCHANCE=A siker es\\u00E9lye 100-ra van \\u00E1ll\\u00EDtva\r\n\r\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\r\nLBL_VAL_MAXEXPREV=Az \\u00E9rt\\u00E9knek kisebbnek kell lennie, mint a legnagyobb opportunity h\\u00E1romszorosa\r\n\r\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\r\nLBL_VAL_MINEXPREV=Az \\u00E9rt\\u00E9knek nagyobbnak kell lennie, mint a legkisebb opportunity negyede\r\n\r\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_ONE_CURR=1 opportunity nincs megjelen\\u00EDtve\r\n\r\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_MULTI_CURR={0} opportunity nincs megjelen\\u00EDtve\r\n\r\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\r\nLBL_MAINTAIN_CURR={0} konverzi\\u00F3s r\\u00E1t\\u00E1j\\u00E1nak karbantart\\u00E1sa\r\n\r\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\r\nLBL_ENDDATE_ERROR=A kezd\\u0151 d\\u00E1tumn\\u00E1l k\\u00E9s\\u0151bbi z\\u00E1r\\u00F3 d\\u00E1tumot adjon meg\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\r\nLBL_STARTDATE_ERROR=A z\\u00E1r\\u00F3 d\\u00E1tumn\\u00E1l kor\\u00E1bbi kezd\\u0151 d\\u00E1tumot adjon meg\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\r\nLBL_ENDDATE_ERROR_LOPP=A k\\u00F6vetkez\\u0151 opportunityk kezd\\u0151 d\\u00E1tuma a z\\u00E1r\\u00F3 d\\u00E1tum ut\\u00E1n van\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Top {0} opportunity\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=\\u00D6sszes opportunity\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=Nincs el\\u00E9rhet\\u0151 opportunity\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Vesztes\\u00E9g kiz\\u00E1r\\u00E1sa\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Nyeres\\u00E9g kiz\\u00E1r\\u00E1sa\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Megjelen\\u00EDt\\u00E9s m\\u00E9ret szerint\r\n',
	"cus/crm/salespipeline/sim/i18n/i18n_it.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Simula pipeline vendite\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=di\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Errore\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Raggiungimento obiettivo\r\n\r\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\r\nBTN_RESET=Resetta\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Esegui logout\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Impostazioni\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=Azioni\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Gestisci impostazioni\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Obiettivo vendite\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Opportunit\\u00E0\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Chiudi\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Gestisci impostazioni obiettivi vendite\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Periodicit\\u00E0 dell\'obiettivo vendite\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Obiettivo vendite per periodo corrente\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Divisa\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=Periodo\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=Da\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=A\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Salva\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Annulla\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Gestisci impostazioni opportunit\\u00E0\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Valore fase\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Imposta valori manualmente\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Valore minimo dell\'opportunit\\u00E0\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Valore massimo dell\'opportunit\\u00E0\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Salva\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Resetta\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Esporta in Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Condividi\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=Visualizza modifiche\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Le modifiche non salvate andranno perse. Proseguire ugualmente?\r\n\r\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\r\nLBL_NOCHANGELOG=Nessuna modifica da visualizzare\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=Modifiche salvate\r\n\r\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\r\nLBL_OPPSTEPZERO=Inserisci un valore fase maggiore di zero\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=Aggiornamento non riuscito\r\n\r\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\r\nLBL_FAILEDREAD=Errore nella lettura dei dati\r\n\r\n#XTIT: This is the title message of the Reset Dialog to reset the application.\r\nRESET_TITLE=Modifiche non salvate\r\n\r\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\r\nBTN_RF_CANCEL=Annulla\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=Visualizza registro modifiche\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Modifiche\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Nuovo valore\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Valore precedente\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Scarta\r\n\r\n#XBUT: This is the button\'s text to discard selected changes from the change log.\r\nBTN_CL_DISCARDSEL=Scarta\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Chiudi\r\n\r\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Elabora opportunit\\u00E0\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Data di inizio\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Data di fine\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=Fatturato previsto\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Non ponderato\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=Ponderato\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Rilevante per la previsione\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Possibilit\\u00E0 di riuscita (in %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=Livello vendite\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Stato\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Cliente\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Contatto principale\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Dipendente responsabile\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=Invia\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Annulla\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \r\nLBL_VAL_MSG=Inserisci solo numeri\r\n\r\n#YMSG: This is the error message when a user enters a chance of success value less than zero\r\nLBL_VAL_MINCHANCE=Possibilit\\u00E0 di riuscita impostata su zero\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters greater. \r\nLBL_VAL_MAXCHANCE=Possibilit\\u00E0 di riuscita impostata su 100\r\n\r\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\r\nLBL_VAL_MAXEXPREV=Il valore deve essere inferiore al triplo dell\'opportunit\\u00E0 massima\r\n\r\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\r\nLBL_VAL_MINEXPREV=Il valore deve essere superiore a un quarto dell\'opportunit\\u00E0 minima\r\n\r\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_ONE_CURR=1 opportunit\\u00E0 non visualizzata\r\n\r\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_MULTI_CURR={0} opportunit\\u00E0 non visualizzate.\r\n\r\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\r\nLBL_MAINTAIN_CURR=Gestisci tasso di conversione per {0}.\r\n\r\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\r\nLBL_ENDDATE_ERROR=Inserisci una data di fine successiva alla data di inizio\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\r\nLBL_STARTDATE_ERROR=Inserisci una data di inizio che preceda la data di fine\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\r\nLBL_ENDDATE_ERROR_LOPP=Le seguenti opportunit\\u00E0 hanno una data di inizio posteriore alla data di fine\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Opportunit\\u00E0 {0} principali\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=Tutte le opportunit\\u00E0\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=Nessuna opportunit\\u00E0 disponibile\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Escludi opportunit\\u00E0 perse\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Escludi opportunit\\u00E0 vinte\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Visualizza per dimensione\r\n',
	"cus/crm/salespipeline/sim/i18n/i18n_iw.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=\\u05D1\\u05E6\\u05E2 \\u05D4\\u05D3\\u05DE\\u05D9\\u05D4 \\u05E9\\u05DC \\u05E6\\u05D1\\u05E8 \\u05DE\\u05DB\\u05D9\\u05E8\\u05D5\\u05EA\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=\\u05DE\\u05EA\\u05D5\\u05DA\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=\\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=\\u05D4\\u05D9\\u05E9\\u05D2 \\u05D9\\u05E2\\u05D3\r\n\r\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\r\nBTN_RESET=\\u05D0\\u05E4\\u05E1\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=\\u05E6\\u05D0\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=\\u05D4\\u05D2\\u05D3\\u05E8\\u05D5\\u05EA\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=\\u05E4\\u05E2\\u05D5\\u05DC\\u05D5\\u05EA\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=\\u05E0\\u05D4\\u05DC \\u05D4\\u05D2\\u05D3\\u05E8\\u05D5\\u05EA\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=\\u05D9\\u05E2\\u05D3 \\u05DE\\u05DB\\u05D9\\u05E8\\u05D5\\u05EA\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=\\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=\\u05E1\\u05D2\\u05D5\\u05E8\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=\\u05E0\\u05D4\\u05DC \\u05D4\\u05D2\\u05D3\\u05E8\\u05D5\\u05EA \\u05D9\\u05E2\\u05D3 \\u05DE\\u05DB\\u05D9\\u05E8\\u05D5\\u05EA\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=\\u05EA\\u05E7\\u05D5\\u05E4\\u05EA\\u05D9\\u05D5\\u05EA \\u05E9\\u05DC \\u05D9\\u05E2\\u05D3 \\u05DE\\u05DB\\u05D9\\u05E8\\u05D5\\u05EA\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=\\u05D9\\u05E2\\u05D3 \\u05DE\\u05DB\\u05D9\\u05E8\\u05D5\\u05EA \\u05DC\\u05EA\\u05E7\\u05D5\\u05E4\\u05D4 \\u05E0\\u05D5\\u05DB\\u05D7\\u05D9\\u05EA\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=\\u05DE\\u05D8\\u05D1\\u05E2\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=\\u05DE\\u05E8\\u05D5\\u05D5\\u05D7 \\u05D6\\u05DE\\u05DF\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=\\u05DE-\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=\\u05E2\\u05D3\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=\\u05E9\\u05DE\\u05D5\\u05E8\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=\\u05D1\\u05D8\\u05DC\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=\\u05E0\\u05D4\\u05DC \\u05D4\\u05D2\\u05D3\\u05E8\\u05D5\\u05EA \\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=\\u05E2\\u05E8\\u05DA \\u05E9\\u05DC\\u05D1\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=\\u05D4\\u05D2\\u05D3\\u05E8 \\u05E2\\u05E8\\u05DB\\u05D9\\u05DD \\u05D1\\u05D0\\u05D5\\u05E4\\u05DF \\u05D9\\u05D3\\u05E0\\u05D9\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=\\u05E2\\u05E8\\u05DA \\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA \\u05DE\\u05D9\\u05E0\\u05D9\\u05DE\\u05DC\\u05D9\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=\\u05E2\\u05E8\\u05DA \\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA \\u05DE\\u05E7\\u05E1\\u05D9\\u05DE\\u05DC\\u05D9\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=\\u05E9\\u05DE\\u05D5\\u05E8\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=\\u05D0\\u05E4\\u05E1\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=\\u05D9\\u05E6\\u05D0 \\u05DC-Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=\\u05E9\\u05EA\\u05E3\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=\\u05D4\\u05E6\\u05D2 \\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD \\u05E9\\u05DC\\u05D0 \\u05E0\\u05E9\\u05DE\\u05E8\\u05D5 \\u05D9\\u05D0\\u05D1\\u05D3\\u05D5. \\u05D4\\u05D0\\u05DD \\u05D0\\u05EA\\u05D4 \\u05D1\\u05D8\\u05D5\\u05D7 \\u05E9\\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05D4\\u05DE\\u05E9\\u05D9\\u05DA?\r\n\r\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\r\nLBL_NOCHANGELOG=\\u05D0\\u05D9\\u05DF \\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD \\u05DC\\u05D4\\u05E6\\u05D2\\u05D4\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=\\u05D4\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD \\u05E0\\u05E9\\u05DE\\u05E8\\u05D5\r\n\r\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\r\nLBL_OPPSTEPZERO=\\u05D4\\u05D6\\u05DF \\u05E2\\u05E8\\u05DA \\u05E9\\u05DC\\u05D1 \\u05D2\\u05D3\\u05D5\\u05DC \\u05DE\\u05D0\\u05E4\\u05E1\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=\\u05E2\\u05D3\\u05DB\\u05D5\\u05DF \\u05E0\\u05DB\\u05E9\\u05DC\r\n\r\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\r\nLBL_FAILEDREAD=\\u05E9\\u05D2\\u05D9\\u05D0\\u05D4 \\u05D1\\u05D6\\u05DE\\u05DF \\u05E7\\u05E8\\u05D9\\u05D0\\u05EA \\u05E0\\u05EA\\u05D5\\u05E0\\u05D9\\u05DD\r\n\r\n#XTIT: This is the title message of the Reset Dialog to reset the application.\r\nRESET_TITLE=\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD \\u05E9\\u05DC\\u05D0 \\u05E0\\u05E9\\u05DE\\u05E8\\u05D5\r\n\r\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\r\nBTN_RF_CANCEL=\\u05D1\\u05D8\\u05DC\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=\\u05D4\\u05E6\\u05D2 \\u05D9\\u05D5\\u05DE\\u05DF \\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=\\u05E2\\u05E8\\u05DA \\u05D7\\u05D3\\u05E9\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=\\u05E2\\u05E8\\u05DA \\u05D9\\u05E9\\u05DF\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=\\u05D4\\u05E1\\u05E8\r\n\r\n#XBUT: This is the button\'s text to discard selected changes from the change log.\r\nBTN_CL_DISCARDSEL=\\u05D4\\u05E1\\u05E8\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=\\u05E1\\u05D2\\u05D5\\u05E8\r\n\r\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=\\u05E2\\u05E8\\u05D5\\u05DA \\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05D4\\u05EA\\u05D7\\u05DC\\u05D4\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05E1\\u05D9\\u05D5\\u05DD\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=\\u05E0\\u05E4\\u05D7 \\u05DE\\u05DB\\u05D9\\u05E8\\u05D5\\u05EA \\u05E6\\u05E4\\u05D5\\u05D9\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=\\u05DC\\u05D0 \\u05DE\\u05E9\\u05D5\\u05E7\\u05DC\\u05DC\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=\\u05DE\\u05E9\\u05D5\\u05E7\\u05DC\\u05DC\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=\\u05E8\\u05DC\\u05D5\\u05D5\\u05E0\\u05D8\\u05D9 \\u05DC\\u05D7\\u05D9\\u05D6\\u05D5\\u05D9\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=\\u05E1\\u05D9\\u05DB\\u05D5\\u05D9 \\u05D4\\u05E6\\u05DC\\u05D7\\u05D4 (\\u05D1-%)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=\\u05E9\\u05DC\\u05D1 \\u05D1\\u05DE\\u05DB\\u05D9\\u05E8\\u05D5\\u05EA\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=\\u05E1\\u05D8\\u05D0\\u05D8\\u05D5\\u05E1\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=\\u05DC\\u05E7\\u05D5\\u05D7\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=\\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8 \\u05E8\\u05D0\\u05E9\\u05D9\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=\\u05E2\\u05D5\\u05D1\\u05D3 \\u05D0\\u05D7\\u05E8\\u05D0\\u05D9\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=\\u05D4\\u05D2\\u05E9\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=\\u05D1\\u05D8\\u05DC\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \r\nLBL_VAL_MSG=\\u05D4\\u05D6\\u05DF \\u05DE\\u05E1\\u05E4\\u05E8\\u05D9\\u05DD \\u05D1\\u05DC\\u05D1\\u05D3\r\n\r\n#YMSG: This is the error message when a user enters a chance of success value less than zero\r\nLBL_VAL_MINCHANCE=\\u05E1\\u05D9\\u05DB\\u05D5\\u05D9 \\u05D4\\u05D4\\u05E6\\u05DC\\u05D7\\u05D4 \\u05D4\\u05D5\\u05D2\\u05D3\\u05E8 \\u05DB\\u05D0\\u05E4\\u05E1\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters greater. \r\nLBL_VAL_MAXCHANCE=\\u05E1\\u05D9\\u05DB\\u05D5\\u05D9 \\u05D4\\u05D4\\u05E6\\u05DC\\u05D7\\u05D4 \\u05D4\\u05D5\\u05D2\\u05D3\\u05E8 \\u05DB-100\r\n\r\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\r\nLBL_VAL_MAXEXPREV=\\u05D4\\u05E2\\u05E8\\u05DA \\u05D7\\u05D9\\u05D9\\u05D1 \\u05DC\\u05D4\\u05D9\\u05D5\\u05EA \\u05E7\\u05D8\\u05DF \\u05DE\\u05E2\\u05E8\\u05DA \\u05DE\\u05E9\\u05D5\\u05DC\\u05E9 \\u05E9\\u05DC \\u05D4\\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA \\u05D4\\u05D2\\u05D1\\u05D5\\u05D4\\u05D4 \\u05D1\\u05D9\\u05D5\\u05EA\\u05E8\r\n\r\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\r\nLBL_VAL_MINEXPREV=\\u05D4\\u05E2\\u05E8\\u05DA \\u05D7\\u05D9\\u05D9\\u05D1 \\u05DC\\u05D4\\u05D9\\u05D5\\u05EA \\u05D2\\u05D3\\u05D5\\u05DC \\u05DE\\u05E8\\u05D1\\u05E2 \\u05E9\\u05DC \\u05D4\\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA \\u05D4\\u05E7\\u05D8\\u05E0\\u05D4 \\u05D1\\u05D9\\u05D5\\u05EA\\u05E8\r\n\r\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_ONE_CURR=\\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA \\u05D0\\u05D7\\u05EA \\u05DC\\u05D0 \\u05DE\\u05D5\\u05E6\\u05D2\\u05EA\r\n\r\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_MULTI_CURR={0} \\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05D9\\u05D5\\u05EA \\u05DC\\u05D0 \\u05DE\\u05D5\\u05E6\\u05D2\\u05D5\\u05EA.\r\n\r\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\r\nLBL_MAINTAIN_CURR=\\u05EA\\u05D7\\u05D6\\u05E7 \\u05E9\\u05D9\\u05E2\\u05D5\\u05E8 \\u05D4\\u05DE\\u05E8\\u05D4 \\u05E2\\u05D1\\u05D5\\u05E8 {0}.\r\n\r\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\r\nLBL_ENDDATE_ERROR=\\u05D4\\u05D6\\u05DF \\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05E1\\u05D9\\u05D5\\u05DD \\u05E9\\u05D7\\u05DC \\u05DC\\u05D0\\u05D7\\u05E8 \\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05D4\\u05D4\\u05EA\\u05D7\\u05DC\\u05D4\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\r\nLBL_STARTDATE_ERROR=\\u05D4\\u05D6\\u05DF \\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05D4\\u05EA\\u05D7\\u05DC\\u05D4 \\u05E9\\u05D7\\u05DC \\u05DC\\u05E4\\u05E0\\u05D9 \\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05D4\\u05E1\\u05D9\\u05D5\\u05DD\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\r\nLBL_ENDDATE_ERROR_LOPP=\\u05DC\\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05D9\\u05D5\\u05EA \\u05D4\\u05D1\\u05D0\\u05D5\\u05EA \\u05D9\\u05E9 \\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05D4\\u05EA\\u05D7\\u05DC\\u05D4 \\u05E9\\u05D7\\u05DC \\u05DC\\u05D0\\u05D7\\u05E8 \\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05D4\\u05E1\\u05D9\\u05D5\\u05DD\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED={0} \\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05D9\\u05D5\\u05EA \\u05DE\\u05D5\\u05D1\\u05D9\\u05DC\\u05D5\\u05EA\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=\\u05DB\\u05DC \\u05D4\\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05D9\\u05D5\\u05EA\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=\\u05D0\\u05D9\\u05DF \\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA \\u05D6\\u05DE\\u05D9\\u05E0\\u05D4\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=\\u05D0\\u05DC \\u05EA\\u05DB\\u05DC\\u05D5\\u05DC \\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA \\u05E9\\u05D4\\u05D5\\u05D7\\u05DE\\u05E6\\u05D4\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=\\u05D0\\u05DC \\u05EA\\u05DB\\u05DC\\u05D5\\u05DC \\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA \\u05E9\\u05D4\\u05EA\\u05DE\\u05DE\\u05E9\\u05D4\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=\\u05D4\\u05E6\\u05D2 \\u05DC\\u05E4\\u05D9 \\u05D2\\u05D5\\u05D3\\u05DC\r\n',
	"cus/crm/salespipeline/sim/i18n/i18n_ja.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=\\u8CA9\\u58F2\\u30D1\\u30A4\\u30D7\\u30E9\\u30A4\\u30F3\\u306E\\u30B7\\u30DF\\u30E5\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=/\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=\\u30A8\\u30E9\\u30FC\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=\\u76EE\\u6A19\\u9054\\u6210\\u5EA6\r\n\r\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\r\nBTN_RESET=\\u30EA\\u30BB\\u30C3\\u30C8\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=\\u30ED\\u30B0\\u30A2\\u30A6\\u30C8\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=\\u8A2D\\u5B9A\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=\\u30A2\\u30AF\\u30B7\\u30E7\\u30F3\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=\\u8A2D\\u5B9A\\u7BA1\\u7406\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=\\u8CA9\\u58F2\\u76EE\\u6A19\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=\\u6848\\u4EF6\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=\\u9589\\u3058\\u308B\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=\\u8CA9\\u58F2\\u76EE\\u6A19\\u8A2D\\u5B9A\\u7BA1\\u7406\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=\\u8CA9\\u58F2\\u76EE\\u6A19\\u5468\\u671F\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=\\u73FE\\u671F\\u9593\\u306E\\u8CA9\\u58F2\\u76EE\\u6A19\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=\\u901A\\u8CA8\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=\\u30BF\\u30A4\\u30E0\\u30B9\\u30D1\\u30F3\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=\\u958B\\u59CB\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=\\u7D42\\u4E86\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=\\u4FDD\\u5B58\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=\\u4E2D\\u6B62\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=\\u6848\\u4EF6\\u8A2D\\u5B9A\\u7BA1\\u7406\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=\\u30B9\\u30C6\\u30C3\\u30D7\\u5024\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=\\u5024\\u30DE\\u30CB\\u30E5\\u30A2\\u30EB\\u8A2D\\u5B9A\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=\\u6700\\u5C0F\\u6848\\u4EF6\\u91D1\\u984D\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=\\u6700\\u5927\\u6848\\u4EF6\\u91D1\\u984D\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=\\u4FDD\\u5B58\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=\\u30EA\\u30BB\\u30C3\\u30C8\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Exportto Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=\\u5171\\u6709\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=\\u5909\\u66F4\\u8868\\u793A\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=\\u672A\\u4FDD\\u5B58\\u306E\\u5909\\u66F4\\u306F\\u5931\\u308F\\u308C\\u307E\\u3059\\u3002\\u7D9A\\u884C\\u3057\\u307E\\u3059\\u304B\\u3002\r\n\r\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\r\nLBL_NOCHANGELOG=\\u8868\\u793A\\u3059\\u308B\\u5909\\u66F4\\u306F\\u3042\\u308A\\u307E\\u305B\\u3093\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=\\u5909\\u66F4\\u304C\\u4FDD\\u5B58\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\r\nLBL_OPPSTEPZERO=\\u30B9\\u30C6\\u30C3\\u30D7\\u5024\\u306B\\u306F\\u30BC\\u30ED\\u3088\\u308A\\u5927\\u304D\\u3044\\u5024\\u3092\\u5165\\u529B\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=\\u66F4\\u65B0\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n\r\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\r\nLBL_FAILEDREAD=\\u30C7\\u30FC\\u30BF\\u8AAD\\u8FBC\\u4E2D\\u306B\\u30A8\\u30E9\\u30FC\\u304C\\u767A\\u751F\\u3057\\u307E\\u3057\\u305F\r\n\r\n#XTIT: This is the title message of the Reset Dialog to reset the application.\r\nRESET_TITLE=\\u672A\\u4FDD\\u5B58\\u306E\\u5909\\u66F4\r\n\r\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\r\nBTN_RF_CANCEL=\\u4E2D\\u6B62\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=\\u5909\\u66F4\\u30ED\\u30B0\\u8868\\u793A\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=\\u5909\\u66F4\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=\\u65B0\\u3057\\u3044\\u5024\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=\\u53E4\\u3044\\u5024\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=\\u7834\\u68C4\r\n\r\n#XBUT: This is the button\'s text to discard selected changes from the change log.\r\nBTN_CL_DISCARDSEL=\\u7834\\u68C4\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=\\u9589\\u3058\\u308B\r\n\r\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=\\u6848\\u4EF6\\u7DE8\\u96C6\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=\\u958B\\u59CB\\u65E5\\u4ED8\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=\\u7D42\\u4E86\\u65E5\\u4ED8\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=\\u898B\\u8FBC\\u8CA9\\u58F2\\u984D\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=\\u52A0\\u91CD\\u306A\\u3057\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=\\u52A0\\u91CD\\u3042\\u308A\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=\\u4E88\\u6E2C\\u95A2\\u9023\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=\\u53D7\\u6CE8\\u898B\\u8FBC (%)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=\\u55B6\\u696D\\u30D5\\u30A7\\u30FC\\u30BA\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=\\u30B9\\u30C6\\u30FC\\u30BF\\u30B9\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=\\u30A2\\u30AB\\u30A6\\u30F3\\u30C8\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=\\u4E3B\\u8981\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=\\u7BA1\\u7406\\u8CAC\\u4EFB\\u8005\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=\\u9001\\u4FE1\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=\\u4E2D\\u6B62\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \r\nLBL_VAL_MSG=\\u6570\\u5B57\\u306E\\u307F\\u3092\\u5165\\u529B\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\r\n\r\n#YMSG: This is the error message when a user enters a chance of success value less than zero\r\nLBL_VAL_MINCHANCE=\\u53D7\\u6CE8\\u898B\\u8FBC\\u304C 0 \\u306B\\u8A2D\\u5B9A\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters greater. \r\nLBL_VAL_MAXCHANCE=\\u53D7\\u6CE8\\u898B\\u8FBC\\u304C 100 \\u306B\\u8A2D\\u5B9A\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\r\nLBL_VAL_MAXEXPREV=\\u91D1\\u984D\\u306F\\u3001\\u6700\\u5927\\u6848\\u4EF6\\u306E 3 \\u500D\\u672A\\u6E80\\u306E\\u91D1\\u984D\\u3067\\u306A\\u3051\\u308C\\u3070\\u306A\\u308A\\u307E\\u305B\\u3093\r\n\r\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\r\nLBL_VAL_MINEXPREV=\\u91D1\\u984D\\u306F\\u3001\\u6700\\u5C0F\\u6848\\u4EF6\\u306E 4 \\u5206\\u306E 1 \\u3092\\u8D85\\u3048\\u308B\\u91D1\\u984D\\u3067\\u306A\\u3051\\u308C\\u3070\\u306A\\u308A\\u307E\\u305B\\u3093\r\n\r\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_ONE_CURR=1 \\u3064\\u306E\\u6848\\u4EF6\\u304C\\u8868\\u793A\\u3055\\u308C\\u307E\\u305B\\u3093\r\n\r\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_MULTI_CURR={0} \\u6848\\u4EF6\\u304C\\u8868\\u793A\\u3055\\u308C\\u307E\\u305B\\u3093\\u3002\r\n\r\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\r\nLBL_MAINTAIN_CURR={0} \\u306E\\u901A\\u8CA8\\u63DB\\u7B97\\u30EC\\u30FC\\u30C8\\u3092\\u66F4\\u65B0\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\r\n\r\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\r\nLBL_ENDDATE_ERROR=\\u958B\\u59CB\\u65E5\\u4ED8\\u3088\\u308A\\u5F8C\\u306E\\u7D42\\u4E86\\u65E5\\u4ED8\\u3092\\u5165\\u529B\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\r\nLBL_STARTDATE_ERROR=\\u7D42\\u4E86\\u65E5\\u4ED8\\u3088\\u308A\\u524D\\u306E\\u958B\\u59CB\\u65E5\\u4ED8\\u3092\\u5165\\u529B\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\r\nLBL_ENDDATE_ERROR_LOPP=\\u4EE5\\u4E0B\\u306E\\u6848\\u4EF6\\u306E\\u958B\\u59CB\\u65E5\\u4ED8\\u304C\\u7D42\\u4E86\\u65E5\\u4ED8\\u3088\\u308A\\u3082\\u5F8C\\u3067\\u3059\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=\\u4E0A\\u4F4D {0} \\u6848\\u4EF6\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=\\u3059\\u3079\\u3066\\u306E\\u6848\\u4EF6\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=\\u5229\\u7528\\u53EF\\u80FD\\u6848\\u4EF6\\u306A\\u3057\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=\\u5931\\u6CE8\\u9664\\u5916\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=\\u53D7\\u6CE8\\u9664\\u5916\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=\\u30B5\\u30A4\\u30BA\\u5225\\u8868\\u793A\r\n',
	"cus/crm/salespipeline/sim/i18n/i18n_no.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Simuler salgspipeline\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=av\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Feil\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=M\\u00E5loppfyllelse\r\n\r\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\r\nBTN_RESET=Tilbakestill\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Logg av\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Innstillinger\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=Aktiviteter\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Administrer innstillinger\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Salgsm\\u00E5l\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Salgsmulighet\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Lukk\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Administrer salgsm\\u00E5lsinnstillinger\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Salgsm\\u00E5lsperiodisitet\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Salgsm\\u00E5l for aktuell periode\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Valuta\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=Tidsintervall\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=Fra\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=Til\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Lagre\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Avbryt\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Administrer salgsmulighetsinnstillinger\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Trinnverdi\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Oppgi verdier manuelt\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Minimumsverdi for salgsmulighet\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Maksimumsverdi for salgsmulighet\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Lagre\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Tilbakestill\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Eksporter til Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Del\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=Vis endringer\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Du vil miste endringer som ikke er lagret. Er du sikker p\\u00E5 at du vil fortsette?\r\n\r\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\r\nLBL_NOCHANGELOG=Det finnes ingen endringer\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=Endringer lagret\r\n\r\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\r\nLBL_OPPSTEPZERO=Oppgi en trinnverdi st\\u00F8rre enn null\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=Oppdatering mislyktes\r\n\r\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\r\nLBL_FAILEDREAD=Feil ved lesing av data\r\n\r\n#XTIT: This is the title message of the Reset Dialog to reset the application.\r\nRESET_TITLE=Ulagrede endringer\r\n\r\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\r\nBTN_RF_CANCEL=Avbryt\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=Vis endringsprotokoll\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Endringer\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Ny verdi\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Gammel verdi\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Forkast\r\n\r\n#XBUT: This is the button\'s text to discard selected changes from the change log.\r\nBTN_CL_DISCARDSEL=Forkast\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Lukk\r\n\r\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Rediger salgsmulighet\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Startdato\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Sluttdato\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=Forventet omsetning\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Uvektet\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=Vektet\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Relevant for prognose\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Sannsynlighet for suksess (i %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=Salgsfase\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Status\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Kunde\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Hovedkontakt\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Ansvarlig medarbeider\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=Overf\\u00F8r\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Avbryt\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \r\nLBL_VAL_MSG=Oppgi bare tall\r\n\r\n#YMSG: This is the error message when a user enters a chance of success value less than zero\r\nLBL_VAL_MINCHANCE=Sannsynlighet for suksess satt til null\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters greater. \r\nLBL_VAL_MAXCHANCE=Sannsynlighet for suksess satt til 100\r\n\r\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\r\nLBL_VAL_MAXEXPREV=Verdi m\\u00E5 v\\u00E6re mindre enn tre ganger den st\\u00F8rste salgsmuligheten\r\n\r\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\r\nLBL_VAL_MINEXPREV=Verdi m\\u00E5 v\\u00E6re st\\u00F8rre enn en fjerdedel av den minste salgsmuligheten\r\n\r\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_ONE_CURR=1 salgsmulighet ikke vist\r\n\r\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_MULTI_CURR={0} salgsmuligheter vises ikke.\r\n\r\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\r\nLBL_MAINTAIN_CURR=Vedlikehold konverteringsrate for {0}.\r\n\r\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\r\nLBL_ENDDATE_ERROR=Oppgi en sluttdato som kommer etter startdatoen\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\r\nLBL_STARTDATE_ERROR=Oppgi en startdato som ligger f\\u00F8r sluttdatoen\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\r\nLBL_ENDDATE_ERROR_LOPP=F\\u00F8lgende salgsmuligheter har en startdato som ligger etter sluttdatoen\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Topp {0} salgsmuligheter\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=Alle salgsmuligheter\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=Salgsmulighet ikke tilgjengelig\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Ekskluder tapt\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Ekskluder vunnet\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Vis etter st\\u00F8rrelse\r\n',
	"cus/crm/salespipeline/sim/i18n/i18n_pl.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Symulacja oczekiwanej sprzeda\\u017Cy\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=z\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=B\\u0142\\u0105d\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Realizacja celu\r\n\r\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\r\nBTN_RESET=Resetuj\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Wyloguj\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Ustawienia\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=Czynno\\u015Bci\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Zarz\\u0105dzanie ustawieniami\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Cel sprzeda\\u017Cy\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Szansa\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Zamknij\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Zarz\\u0105dzanie ustawieniami celu sprzeda\\u017Cy\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Okresowo\\u015B\\u0107 celu sprzeda\\u017Cy\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Cel sprzeda\\u017Cy dla bie\\u017C\\u0105cego okresu\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Waluta\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=Przedzia\\u0142 czasu\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=Od\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=Do\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Zapisz\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Anuluj\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Zarz\\u0105dzanie ustawieniami szansy\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Warto\\u015B\\u0107 kroku\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Ustaw warto\\u015Bci r\\u0119cznie\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Minimalna warto\\u015B\\u0107 szansy\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Maksymalna warto\\u015B\\u0107 szansy\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Zapisz\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Resetuj\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Eksportuj do Excela\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Udost\\u0119pnij\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=Wy\\u015Bwietl zmiany\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Niezapisane zmiany zostan\\u0105 utracone. Czy na pewno chcesz kontynuowa\\u0107?\r\n\r\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\r\nLBL_NOCHANGELOG=Brak zmian do wy\\u015Bwietlenia\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=Zapisano zmiany\r\n\r\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\r\nLBL_OPPSTEPZERO=Wpisz warto\\u015B\\u0107 kroku wi\\u0119ksz\\u0105 ni\\u017C zero\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=Aktualizacja nie powiod\\u0142a si\\u0119\r\n\r\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\r\nLBL_FAILEDREAD=B\\u0142\\u0105d odczytu danych\r\n\r\n#XTIT: This is the title message of the Reset Dialog to reset the application.\r\nRESET_TITLE=Niezapisane zmiany\r\n\r\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\r\nBTN_RF_CANCEL=Anuluj\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=Wy\\u015Bwietl log zmian\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Zmiany\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Nowa warto\\u015B\\u0107\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Stara warto\\u015B\\u0107\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Odrzu\\u0107\r\n\r\n#XBUT: This is the button\'s text to discard selected changes from the change log.\r\nBTN_CL_DISCARDSEL=Odrzu\\u0107\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Zamknij\r\n\r\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Edytuj szans\\u0119\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Data rozpocz\\u0119cia\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Data zako\\u0144czenia\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=Oczekiwany obr\\u00F3t\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Niewa\\u017Cone\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=Wa\\u017Cone\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Istotne dla prognozy\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Szansa na sukces (w %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=Faza sprzeda\\u017Cy\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Status\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Klient\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=G\\u0142\\u00F3wny kontakt\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Odpowiedzialny pracownik\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=Wy\\u015Blij\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Anuluj\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \r\nLBL_VAL_MSG=Wpisz tylko liczby\r\n\r\n#YMSG: This is the error message when a user enters a chance of success value less than zero\r\nLBL_VAL_MINCHANCE=Szans\\u0119 na sukces ustawiono na zero\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters greater. \r\nLBL_VAL_MAXCHANCE=Szans\\u0119 na sukces ustawiono na 100\r\n\r\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\r\nLBL_VAL_MAXEXPREV=Warto\\u015B\\u0107 musi by\\u0107 mniejsza ni\\u017C trzykrotno\\u015B\\u0107 najwi\\u0119kszej szansy\r\n\r\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\r\nLBL_VAL_MINEXPREV=Warto\\u015B\\u0107 musi by\\u0107 wi\\u0119ksza ni\\u017C czwarta cz\\u0119\\u015B\\u0107 najmniejszej szansy\r\n\r\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_ONE_CURR=Nie wy\\u015Bwietlono 1 szansy\r\n\r\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_MULTI_CURR=Liczba niewy\\u015Bwietlonych szans\\: {0}.\r\n\r\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\r\nLBL_MAINTAIN_CURR=Opracuj wsp\\u00F3\\u0142czynnik konwersji dla {0}.\r\n\r\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\r\nLBL_ENDDATE_ERROR=Wprowad\\u017A dat\\u0119 ko\\u0144cow\\u0105 p\\u00F3\\u017Aniejsz\\u0105 ni\\u017C dat\\u0119 pocz\\u0105tkow\\u0105\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\r\nLBL_STARTDATE_ERROR=Wprowad\\u017A dat\\u0119 pocz\\u0105tkow\\u0105 wcze\\u015Bniejsz\\u0105 ni\\u017C dat\\u0119 ko\\u0144cow\\u0105\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\r\nLBL_ENDDATE_ERROR_LOPP=Nast\\u0119puj\\u0105ce szanse maj\\u0105 dat\\u0119 pocz\\u0105tkow\\u0105 p\\u00F3\\u017Aniejsz\\u0105 od daty ko\\u0144cowej\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=G\\u0142\\u00F3wnych szans\\: {0}\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=Wszystkie szanse\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=Brak dost\\u0119pnych szans\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Wyklucz przegrane\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Wyklucz wygrane\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Wy\\u015Bwietl wed\\u0142ug rozmiaru\r\n',
	"cus/crm/salespipeline/sim/i18n/i18n_pt.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Simular pipeline de vendas\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=de\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Erro\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Alcance do objetivo\r\n\r\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\r\nBTN_RESET=Reinicializar\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Enc.sess\\u00E3o\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Configura\\u00E7\\u00F5es\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=A\\u00E7\\u00F5es\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Administrar configura\\u00E7\\u00F5es\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Meta de vendas\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Oportunidade\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Fechar\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Administrar configura\\u00E7\\u00F5es da meta de vendas\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Periodicidade da meta de vendas\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Meta de vendas do per\\u00EDodo atual\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Moeda\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=Per\\u00EDodo\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=De\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=At\\u00E9\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Gravar\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Cancelar\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Administrar configura\\u00E7\\u00F5es da oportunidade\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Valor da etapa\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Definir valores manualmente\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Valor m\\u00EDnimo da oportunidade\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Valor m\\u00E1ximo da oportunidade\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Gravar\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Reinicializar\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Export.p/Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Compartilhar\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=Vis.modifs.\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=As modifica\\u00E7\\u00F5es n\\u00E3o gravadas se perder\\u00E3o. Continuar?\r\n\r\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\r\nLBL_NOCHANGELOG=Nenhuma modifica\\u00E7\\u00E3o a exibir\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=As modifica\\u00E7\\u00F5es foram gravadas\r\n\r\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\r\nLBL_OPPSTEPZERO=Insira um valor de etapa superior a zero\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=Atualiza\\u00E7\\u00E3o falhada\r\n\r\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\r\nLBL_FAILEDREAD=Erro ao ler dados\r\n\r\n#XTIT: This is the title message of the Reset Dialog to reset the application.\r\nRESET_TITLE=Modifica\\u00E7\\u00F5es n\\u00E3o gravadas\r\n\r\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\r\nBTN_RF_CANCEL=Cancelar\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=Visualizar log de modifica\\u00E7\\u00F5es\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Modifica\\u00E7\\u00F5es\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Novo valor\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Valor antigo\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Rejeitar\r\n\r\n#XBUT: This is the button\'s text to discard selected changes from the change log.\r\nBTN_CL_DISCARDSEL=Rejeitar\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Fechar\r\n\r\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Editar oportunidade\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Data de in\\u00EDcio\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Data final\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=Faturamento previsto\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=N\\u00E3o ponderado\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=Ponderado\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Relevante para previs\\u00E3o\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Chance de sucesso (em %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=Fase de vendas\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Status\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Conta\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Contato principal\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Funcion\\u00E1rio respons\\u00E1vel\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=Enviar\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Cancelar\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \r\nLBL_VAL_MSG=Inserir s\\u00F3 n\\u00FAmeros\r\n\r\n#YMSG: This is the error message when a user enters a chance of success value less than zero\r\nLBL_VAL_MINCHANCE=Probabilidade de sucesso definida como 0\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters greater. \r\nLBL_VAL_MAXCHANCE=Probabilidade de sucesso definida como 100\r\n\r\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\r\nLBL_VAL_MAXEXPREV=O valor n\\u00E3o pode ser superior a tr\\u00EAs vezes o volume da maior oportunidade\r\n\r\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\r\nLBL_VAL_MINEXPREV=O valor deve ser superior a um quarto do volume da menor oportunidade\r\n\r\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_ONE_CURR=1 oportunidade n\\u00E3o exibida\r\n\r\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_MULTI_CURR={0} oportunidades n\\u00E3o exibidas.\r\n\r\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\r\nLBL_MAINTAIN_CURR=Atualizar taxa de convers\\u00E3o para {0}.\r\n\r\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\r\nLBL_ENDDATE_ERROR=Inserir uma data final posterior \\u00E0 data de in\\u00EDcio\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\r\nLBL_STARTDATE_ERROR=Inserir uma data de in\\u00EDcio anterior \\u00E0 data final\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\r\nLBL_ENDDATE_ERROR_LOPP=As oportunidades a seguir possuem uma data de in\\u00EDcio posterior \\u00E0 data final\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Top {0} oportunidades\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=Todas as oportunidades\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=Nenhuma oportunidade dispon\\u00EDvel\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Excluir perda\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Excluir ganho\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Exibir por tamanho\r\n',
	"cus/crm/salespipeline/sim/i18n/i18n_ro.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Simulare pipeline de v\\u00E2nz\\u0103ri\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=de\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Eroare\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Realizare \\u0163int\\u0103\r\n\r\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\r\nBTN_RESET=Resetare\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Deconectare\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Set\\u0103ri\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=Ac\\u0163iuni\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Gestionare set\\u0103ri\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=\\u0162int\\u0103 de v\\u00E2nz\\u0103ri\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Oportunitate\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=\\u00CEnchidere\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Gestionare set\\u0103ri \\u0163int\\u0103 v\\u00E2nz\\u0103ri\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Periodicitate \\u0163int\\u0103 v\\u00E2nz\\u0103ri\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=\\u0162int\\u0103 de v\\u00E2nz\\u0103ri pt.perioad\\u0103 curent\\u0103\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Moned\\u0103\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=Interval timp\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=De la\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=P\\u00E2n\\u0103 la\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Salvare\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Anulare\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Gestionare set\\u0103ri oportunitate\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Valoare etap\\u0103\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Setare manual\\u0103 valori\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Valoare oportunitate minim\\u0103\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Valoare oportunitate maxim\\u0103\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Salvare\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Resetare\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Export \\u00EEn Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Partajare\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=Afi\\u015Fare modific\\u0103ri\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Orice modific\\u0103ri nesalvate vor fi pierdute. Sigur dori\\u0163i s\\u0103 continua\\u0163i?\r\n\r\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\r\nLBL_NOCHANGELOG=F\\u0103r\\u0103 modific\\u0103ri de afi\\u015Fat\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=Modific\\u0103rile salvate\r\n\r\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\r\nLBL_OPPSTEPZERO=Introduce\\u0163i o valoare de etap\\u0103 mai mare dec\\u00E2t zero\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=Actualizare nereu\\u015Fit\\u0103\r\n\r\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\r\nLBL_FAILEDREAD=Eroare la citire date\r\n\r\n#XTIT: This is the title message of the Reset Dialog to reset the application.\r\nRESET_TITLE=Modific\\u0103ri nesalvate\r\n\r\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\r\nBTN_RF_CANCEL=Anulare\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=Afi\\u015Fare jurnal de modific\\u0103ri\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Modific\\u0103ri\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Valoare nou\\u0103\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Valoare veche\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Respingere\r\n\r\n#XBUT: This is the button\'s text to discard selected changes from the change log.\r\nBTN_CL_DISCARDSEL=Respingere\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=\\u00CEnchidere\r\n\r\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Editare oportunitate\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Dat\\u0103 de \\u00EEnceput\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Dat\\u0103 de sf\\u00E2r\\u015Fit\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=Volum de v\\u00E2nz\\u0103ri prev\\u0103zut\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Neponderat\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=Ponderat\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Relevant pt.prognoz\\u0103\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=\\u015Eans\\u0103 de reu\\u015Fit\\u0103 (\\u00EEn %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=Etap\\u0103 de v\\u00E2nz\\u0103ri\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Stare\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Cont\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Persoan\\u0103 de contact principal\\u0103\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Angajat responsabil\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=Transmitere\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Anulare\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \r\nLBL_VAL_MSG=Introduce\\u0163i doar numere\r\n\r\n#YMSG: This is the error message when a user enters a chance of success value less than zero\r\nLBL_VAL_MINCHANCE=\\u015Eans\\u0103 de reu\\u015Fit\\u0103 setat\\u0103 la zero\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters greater. \r\nLBL_VAL_MAXCHANCE=\\u015Eans\\u0103 de reu\\u015Fit\\u0103 setat\\u0103 la 100\r\n\r\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\r\nLBL_VAL_MAXEXPREV=Valoarea trebuie s\\u0103 fie mai mic\\u0103 de trei ori cea mai mare oportunitate\r\n\r\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\r\nLBL_VAL_MINEXPREV=Valoarea trebuie s\\u0103 fie mai mare de un sfert din cea mai mic\\u0103 oportunitate\r\n\r\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_ONE_CURR=1 oportunitate neafi\\u015Fat\\u0103\r\n\r\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_MULTI_CURR={0} oportunit\\u0103\\u0163i neafi\\u015Fate.\r\n\r\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\r\nLBL_MAINTAIN_CURR=\\u00CEntre\\u0163inere rat\\u0103 de conversie pt. {0}.\r\n\r\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\r\nLBL_ENDDATE_ERROR=Introduce\\u0163i o dat\\u0103 de sf\\u00E2r\\u015Fit care s\\u0103 fie dup\\u0103 data de \\u00EEnceput\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\r\nLBL_STARTDATE_ERROR=Introduce\\u0163i o dat\\u0103 de \\u00EEnceput care s\\u0103 fie \\u00EEnainte de data de sf\\u00E2r\\u015Fit\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\r\nLBL_ENDDATE_ERROR_LOPP=Urm\\u0103toarele oportunit\\u0103\\u0163i au o dat\\u0103 de \\u00EEnceput dup\\u0103 data de sf\\u00E2r\\u015Fit\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Top {0} oportunit\\u0103\\u0163i\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=Toate oportunit\\u0103\\u0163ile\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=Nicio oportunitate disponibil\\u0103\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Excludere pierderi\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Excludere c\\u00E2\\u015Ftiguri\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Afi\\u015Fare dup\\u0103 m\\u0103rime\r\n',
	"cus/crm/salespipeline/sim/i18n/i18n_ru.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=\\u041C\\u043E\\u0434\\u0435\\u043B\\u0438\\u0440\\u043E\\u0432\\u0430\\u043D\\u0438\\u0435 \\u043F\\u0430\\u0439\\u043F\\u043B\\u0430\\u0439\\u043D\\u0430 \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=/\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=\\u041E\\u0448\\u0438\\u0431\\u043A\\u0430\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=\\u0414\\u043E\\u0441\\u0442\\u0438\\u0436\\u0435\\u043D\\u0438\\u0435 \\u0446\\u0435\\u043B\\u0438\r\n\r\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\r\nBTN_RESET=\\u0421\\u0431\\u0440\\u043E\\u0441\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=\\u0412\\u044B\\u0439\\u0442\\u0438\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=\\u041D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=\\u041E\\u043F\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=\\u0423\\u043F\\u0440\\u0430\\u0432\\u043B\\u0435\\u043D\\u0438\\u0435 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0430\\u043C\\u0438\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=\\u0426\\u0435\\u043B\\u044C \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=\\u0412\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u044C\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=\\u0417\\u0430\\u043A\\u0440\\u044B\\u0442\\u044C\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=\\u0423\\u043F\\u0440\\u0430\\u0432\\u043B\\u0435\\u043D\\u0438\\u0435 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0430\\u043C\\u0438 \\u0446\\u0435\\u043B\\u0438 \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=\\u041F\\u0435\\u0440\\u0438\\u043E\\u0434\\u0438\\u0447\\u043D\\u043E\\u0441\\u0442\\u044C \\u0446\\u0435\\u043B\\u0438 \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=\\u0426\\u0435\\u043B\\u044C \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436 \\u043D\\u0430 \\u0442\\u0435\\u043A\\u0443\\u0449\\u0438\\u0439 \\u043F\\u0435\\u0440\\u0438\\u043E\\u0434\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=\\u0412\\u0430\\u043B\\u044E\\u0442\\u0430\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=\\u0412\\u0440\\u0435\\u043C\\u0435\\u043D\\u043D\\u043E\\u0439 \\u0438\\u043D\\u0442\\u0435\\u0440\\u0432\\u0430\\u043B\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=\\u0421\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=\\u041F\\u043E\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=\\u0421\\u043E\\u0445\\u0440\\u0430\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=\\u0423\\u043F\\u0440\\u0430\\u0432\\u043B\\u0435\\u043D\\u0438\\u0435 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0430\\u043C\\u0438 \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=\\u0417\\u043D\\u0430\\u0447\\u0435\\u043D\\u0438\\u0435 \\u0448\\u0430\\u0433\\u0430\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=\\u0423\\u0441\\u0442\\u0430\\u043D\\u043E\\u0432\\u0438\\u0442\\u044C \\u0437\\u043D\\u0430\\u0447\\u0435\\u043D\\u0438\\u044F \\u0432\\u0440\\u0443\\u0447\\u043D\\u0443\\u044E\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=\\u041C\\u0438\\u043D\\u0438\\u043C\\u0430\\u043B\\u044C\\u043D\\u043E\\u0435 \\u0437\\u043D\\u0430\\u0447\\u0435\\u043D\\u0438\\u0435 \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=\\u041C\\u0430\\u043A\\u0441\\u0438\\u043C\\u0430\\u043B\\u044C\\u043D\\u043E\\u0435 \\u0437\\u043D\\u0430\\u0447\\u0435\\u043D\\u0438\\u0435 \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=\\u0421\\u043E\\u0445\\u0440\\u0430\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=\\u0421\\u0431\\u0440\\u043E\\u0441\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=\\u042D\\u043A\\u0441\\u043F. \\u0432 Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=\\u041F\\u043E\\u0434\\u0435\\u043B\\u0438\\u0442\\u044C\\u0441\\u044F\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=\\u041F\\u0440\\u043E\\u0441\\u043C. \\u0438\\u0437\\u043C.\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=\\u0412\\u0441\\u0435 \\u043D\\u0435\\u0441\\u043E\\u0445\\u0440\\u0430\\u043D\\u0435\\u043D\\u043D\\u044B\\u0435 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F \\u0431\\u0443\\u0434\\u0443\\u0442 \\u043F\\u043E\\u0442\\u0435\\u0440\\u044F\\u043D\\u044B. \\u041F\\u0440\\u043E\\u0434\\u043E\\u043B\\u0436\\u0438\\u0442\\u044C?\r\n\r\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\r\nLBL_NOCHANGELOG=\\u041D\\u0435\\u0442 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u0439 \\u0434\\u043B\\u044F \\u043F\\u0440\\u043E\\u0441\\u043C\\u043E\\u0442\\u0440\\u0430\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=\\u0418\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F \\u0441\\u043E\\u0445\\u0440\\u0430\\u043D\\u0435\\u043D\\u044B\r\n\r\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\r\nLBL_OPPSTEPZERO=\\u0412\\u0432\\u0435\\u0434\\u0438\\u0442\\u0435 \\u0437\\u043D\\u0430\\u0447\\u0435\\u043D\\u0438\\u0435 \\u0448\\u0430\\u0433\\u0430 \\u0431\\u043E\\u043B\\u044C\\u0448\\u0435 \\u043D\\u0443\\u043B\\u044F\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=\\u0421\\u0431\\u043E\\u0439 \\u043E\\u0431\\u043D\\u043E\\u0432\\u043B\\u0435\\u043D\\u0438\\u044F\r\n\r\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\r\nLBL_FAILEDREAD=\\u041E\\u0448\\u0438\\u0431\\u043A\\u0430 \\u043F\\u0440\\u0438 \\u0441\\u0447\\u0438\\u0442\\u044B\\u0432\\u0430\\u043D\\u0438\\u0438 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0445\r\n\r\n#XTIT: This is the title message of the Reset Dialog to reset the application.\r\nRESET_TITLE=\\u041D\\u0435\\u0441\\u043E\\u0445\\u0440\\u0430\\u043D\\u0435\\u043D\\u043D\\u044B\\u0435 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F\r\n\r\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\r\nBTN_RF_OK=\\u041E\\u041A\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\r\nBTN_RF_CANCEL=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=\\u041F\\u0440\\u043E\\u0441\\u043C\\u043E\\u0442\\u0440 \\u0436\\u0443\\u0440\\u043D\\u0430\\u043B\\u0430 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u0439\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=\\u0418\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=\\u041D\\u043E\\u0432\\u043E\\u0435 \\u0437\\u043D\\u0430\\u0447\\u0435\\u043D\\u0438\\u0435\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=\\u0421\\u0442\\u0430\\u0440\\u043E\\u0435 \\u0437\\u043D\\u0430\\u0447\\u0435\\u043D\\u0438\\u0435\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=\\u041E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XBUT: This is the button\'s text to discard selected changes from the change log.\r\nBTN_CL_DISCARDSEL=\\u041E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=\\u0417\\u0430\\u043A\\u0440\\u044B\\u0442\\u044C\r\n\r\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=\\u041E\\u0431\\u0440\\u0430\\u0431\\u043E\\u0442\\u0430\\u0442\\u044C \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u044C\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=\\u041D\\u0430\\u0447\\u0430\\u043B\\u044C\\u043D\\u0430\\u044F \\u0434\\u0430\\u0442\\u0430\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=\\u0414\\u0430\\u0442\\u0430 \\u043E\\u043A\\u043E\\u043D\\u0447\\u0430\\u043D\\u0438\\u044F\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=\\u041E\\u0436\\u0438\\u0434\\u0430\\u0435\\u043C\\u044B\\u0439 \\u043E\\u0431\\u043E\\u0440\\u043E\\u0442\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=\\u041D\\u0435\\u0432\\u0437\\u0432\\u0435\\u0448\\u0435\\u043D\\u043D\\u044B\\u0439\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=\\u0412\\u0437\\u0432\\u0435\\u0448\\u0435\\u043D\\u043D\\u044B\\u0439\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=\\u0420\\u0435\\u043B\\u0435\\u0432\\u0430\\u043D\\u0442\\u043D\\u043E \\u0434\\u043B\\u044F \\u043F\\u0440\\u043E\\u0433\\u043D\\u043E\\u0437\\u0430\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=\\u0412\\u0435\\u0440\\u043E\\u044F\\u0442\\u043D\\u043E\\u0441\\u0442\\u044C \\u0443\\u0441\\u043F\\u0435\\u0445\\u0430 (\\u0432 %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=\\u0424\\u0430\\u0437\\u0430 \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=\\u0421\\u0442\\u0430\\u0442\\u0443\\u0441\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=\\u041A\\u043B\\u0438\\u0435\\u043D\\u0442\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=\\u041E\\u0441\\u043D\\u043E\\u0432\\u043D\\u043E\\u0439 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=\\u041E\\u0442\\u0432\\u0435\\u0442\\u0441\\u0442\\u0432\\u0435\\u043D\\u043D\\u044B\\u0439 \\u0441\\u043E\\u0442\\u0440\\u0443\\u0434\\u043D\\u0438\\u043A\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=\\u041E\\u0442\\u043F\\u0440\\u0430\\u0432\\u0438\\u0442\\u044C\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \r\nLBL_VAL_MSG=\\u0412\\u0432\\u043E\\u0434\\u0438\\u0442\\u0435 \\u0442\\u043E\\u043B\\u044C\\u043A\\u043E \\u0447\\u0438\\u0441\\u043B\\u0430\r\n\r\n#YMSG: This is the error message when a user enters a chance of success value less than zero\r\nLBL_VAL_MINCHANCE=\\u0412\\u0435\\u0440\\u043E\\u044F\\u0442\\u043D\\u043E\\u0441\\u0442\\u044C \\u0443\\u0441\\u043F\\u0435\\u0445\\u0430 \\u0443\\u0441\\u0442\\u0430\\u043D\\u043E\\u0432\\u043B\\u0435\\u043D\\u0430 \\u043D\\u0430 \\u043D\\u043E\\u043B\\u044C\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters greater. \r\nLBL_VAL_MAXCHANCE=\\u0412\\u0435\\u0440\\u043E\\u044F\\u0442\\u043D\\u043E\\u0441\\u0442\\u044C \\u0443\\u0441\\u043F\\u0435\\u0445\\u0430 \\u0443\\u0441\\u0442\\u0430\\u043D\\u043E\\u0432\\u043B\\u0435\\u043D\\u0430 \\u043D\\u0430 100\r\n\r\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\r\nLBL_VAL_MAXEXPREV=\\u0417\\u043D\\u0430\\u0447\\u0435\\u043D\\u0438\\u0435 \\u0434\\u043E\\u043B\\u0436\\u043D\\u043E \\u0431\\u044B\\u0442\\u044C \\u043C\\u0435\\u043D\\u044C\\u0448\\u0435 \\u0442\\u0440\\u043E\\u0435\\u043A\\u0440\\u0430\\u0442\\u043D\\u043E\\u0439 \\u043D\\u0430\\u0438\\u0431\\u043E\\u043B\\u044C\\u0448\\u0435\\u0439 \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438\r\n\r\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\r\nLBL_VAL_MINEXPREV=\\u0417\\u043D\\u0430\\u0447\\u0435\\u043D\\u0438\\u0435 \\u0434\\u043E\\u043B\\u0436\\u043D\\u043E \\u0431\\u044B\\u0442\\u044C \\u0431\\u043E\\u043B\\u044C\\u0448\\u0435 \\u0447\\u0435\\u0442\\u0432\\u0435\\u0440\\u0442\\u0438 \\u043D\\u0430\\u0438\\u043C\\u0435\\u043D\\u044C\\u0448\\u0435\\u0439 \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438\r\n\r\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_ONE_CURR=1 \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u044C \\u043D\\u0435 \\u043E\\u0442\\u043E\\u0431\\u0440\\u0430\\u0436\\u0430\\u0435\\u0442\\u0441\\u044F\r\n\r\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_MULTI_CURR=\\u041D\\u0435 \\u043E\\u0442\\u0440\\u0430\\u0436\\u0430\\u044E\\u0442\\u0441\\u044F \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438\\: {0} \r\n\r\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\r\nLBL_MAINTAIN_CURR=\\u0412\\u0435\\u0434\\u0435\\u043D\\u0438\\u0435 \\u0434\\u043E\\u043B\\u0438 \\u043F\\u0440\\u0435\\u043E\\u0431\\u0440\\u0430\\u0437\\u043E\\u0432\\u0430\\u043D\\u0438\\u044F \\u0434\\u043B\\u044F {0}.\r\n\r\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\r\nLBL_ENDDATE_ERROR=\\u0412\\u0432\\u0435\\u0434\\u0438\\u0442\\u0435 \\u043A\\u043E\\u043D\\u0435\\u0447\\u043D\\u0443\\u044E \\u0434\\u0430\\u0442\\u0443, \\u0441\\u043B\\u0435\\u0434\\u0443\\u044E\\u0449\\u0443\\u044E \\u043F\\u043E\\u0441\\u043B\\u0435 \\u043D\\u0430\\u0447\\u0430\\u043B\\u044C\\u043D\\u043E\\u0439 \\u0434\\u0430\\u0442\\u044B\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\r\nLBL_STARTDATE_ERROR=\\u0414\\u0430\\u0442\\u0430 \\u043D\\u0430\\u0447\\u0430\\u043B\\u0430 \\u0434\\u043E\\u043B\\u0436\\u043D\\u0430 \\u0431\\u044B\\u0442\\u044C \\u0440\\u0430\\u043D\\u044C\\u0448\\u0435 \\u0434\\u0430\\u0442\\u044B \\u043E\\u043A\\u043E\\u043D\\u0447\\u0430\\u043D\\u0438\\u044F\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\r\nLBL_ENDDATE_ERROR_LOPP=\\u0414\\u0430\\u0442\\u0430 \\u043D\\u0430\\u0447\\u0430\\u043B\\u0430 \\u0441\\u043B\\u0435\\u0434\\u0443\\u044E\\u0449\\u0438\\u0445 \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0435\\u0439 \\u043F\\u043E\\u0437\\u0436\\u0435 \\u0434\\u0430\\u0442\\u044B \\u043E\\u043A\\u043E\\u043D\\u0447\\u0430\\u043D\\u0438\\u044F\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=\\u041F\\u0435\\u0440\\u0432\\u044B\\u0435 \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438 ({0})\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=\\u0412\\u0441\\u0435 \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=\\u0412\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438 \\u043D\\u0435\\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=\\u0418\\u0441\\u043A\\u043B\\u044E\\u0447\\u0438\\u0442\\u044C \\u0443\\u043F\\u0443\\u0449\\u0435\\u043D\\u043D\\u044B\\u0435\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=\\u0418\\u0441\\u043A\\u043B\\u044E\\u0447\\u0438\\u0442\\u044C \\u0440\\u0435\\u0430\\u043B\\u0438\\u0437\\u043E\\u0432\\u0430\\u043D\\u043D\\u044B\\u0435\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=\\u041F\\u0440\\u043E\\u0441\\u043C. \\u043F\\u043E \\u0440\\u0430\\u0437\\u043C.\r\n',
	"cus/crm/salespipeline/sim/i18n/i18n_sh.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Simuliraj cevovod prodaje\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=od\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Gre\\u0161ka\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Postizanje cilja\r\n\r\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\r\nBTN_RESET=Ponovo postavi\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Odjavi se\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Pode\\u0161avanja\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=Radnje\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Upravljaj pode\\u0161avanjima\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Cilj prodaje\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Prilika\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Zatvori\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Upravljaj pode\\u0161avanjima cilja prodaje\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Periodi\\u010Dnost cilja prodaje\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Cilj prodaje za teku\\u0107i period\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Valuta\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=Vremenski period\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=Od\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=Do\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Sa\\u010Duvaj\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Odustani\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Upravljaj pode\\u0161avanjima prilike\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Vrednost koraka\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Postavi vrednosti ru\\u010Dno\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Minimalna vrednost prilike\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Maksimalna vrednost prilike\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Sa\\u010Duvaj\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Ponovo postavi\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Izvoz u Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Podeli\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=Prika\\u017Ei promene\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Sve nesa\\u010Duvane promene \\u0107e biti izgubljene. Da li sigurno \\u017Eelite da nastavite?\r\n\r\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\r\nLBL_NOCHANGELOG=Nema promena za prikaz\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=Promene sa\\u010Duvane\r\n\r\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\r\nLBL_OPPSTEPZERO=Unesite vrednost koraka ve\\u0107u od nule\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=A\\u017Euriranje nije uspelo\r\n\r\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\r\nLBL_FAILEDREAD=Gre\\u0161ka pri \\u010Ditanju podataka\r\n\r\n#XTIT: This is the title message of the Reset Dialog to reset the application.\r\nRESET_TITLE=Nesa\\u010Duvane promene\r\n\r\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\r\nBTN_RF_CANCEL=Odustani\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=Prika\\u017Ei protokol promena\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Promene\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Nova vrednost\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Stara vrednost\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Odbaci\r\n\r\n#XBUT: This is the button\'s text to discard selected changes from the change log.\r\nBTN_CL_DISCARDSEL=Odbaci\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Zatvori\r\n\r\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Uredi priliku\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Datum po\\u010Detka\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Datum zavr\\u0161etka\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=O\\u010Dekivani obim prodaje\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Nije ponderisano\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=Ponderisano\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Relevantno za predvi\\u0111anje\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Mogu\\u0107nost uspeha (u %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=Faza prodaje\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Status\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Ra\\u010Dun\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Glavni kontakt\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Odgovorni zaposleni\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=Podnesi\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Odustani\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \r\nLBL_VAL_MSG=Unesite samo brojeve\r\n\r\n#YMSG: This is the error message when a user enters a chance of success value less than zero\r\nLBL_VAL_MINCHANCE=Mogu\\u0107nost uspeha postavljena na nulu\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters greater. \r\nLBL_VAL_MAXCHANCE=Mogu\\u0107nost uspeha postavljena na 100\r\n\r\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\r\nLBL_VAL_MAXEXPREV=Vrednost mora biti manja od trostruke vrednosti najve\\u0107e prilike\r\n\r\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\r\nLBL_VAL_MINEXPREV=Vrednost mora biti ve\\u0107a od \\u010Detvrtine od najmanje prilike\r\n\r\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_ONE_CURR=1 prilika nije prikazana\r\n\r\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_MULTI_CURR={0} prilika nije prikazano.\r\n\r\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\r\nLBL_MAINTAIN_CURR=Odr\\u017Eavaj stopu konverzije za {0}.\r\n\r\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\r\nLBL_ENDDATE_ERROR=Unesite datum zavr\\u0161etka koji je posle datuma po\\u010Detka\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\r\nLBL_STARTDATE_ERROR=Unesite datum po\\u010Detka koji je raniji od datuma zavr\\u0161etka\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\r\nLBL_ENDDATE_ERROR_LOPP=Slede\\u0107e prilike imaju datum po\\u010Detka koji je kasniji od datuma zavr\\u0161etka\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Prvih {0} prilika\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=Sve prilike\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=Prilika nije dostupna\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Isklju\\u010Di izgubljeno\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Isklju\\u010Di realizovano\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Prika\\u017Ei po veli\\u010Dini\r\n',
	"cus/crm/salespipeline/sim/i18n/i18n_sk.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Simulova\\u0165 pipeline predaja\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=z\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Chyba\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Dosiahnutie cie\\u013Ea\r\n\r\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\r\nBTN_RESET=Obnovi\\u0165\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Odhl\\u00E1si\\u0165 sa\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Nastavenia\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=Akcie\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Spravova\\u0165 nastavenia\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Cie\\u013E predaja\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Pr\\u00EDle\\u017Eitos\\u0165\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Zatvori\\u0165\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Spravova\\u0165 nastavenia cie\\u013Ea predaja\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Periodicita cie\\u013Ea predaja\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Cie\\u013E predaja pre aktu\\u00E1lne obdobie\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Mena\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=\\u010Casov\\u00FD interval\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=Od\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=Do\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Ulo\\u017Ei\\u0165\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Zru\\u0161i\\u0165\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Spravova\\u0165 nastavenia pr\\u00EDle\\u017Eitost\\u00ED\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Hodnota kroku\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Nastavi\\u0165 hodnoty manu\\u00E1lne\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Minim\\u00E1lna hodnota pr\\u00EDle\\u017Eitosti\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Maxim\\u00E1lna hodnota pr\\u00EDle\\u017Eitosti\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Ulo\\u017Ei\\u0165\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Obnovi\\u0165\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Export do Excelu\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Zdie\\u013Ea\\u0165\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=Zobrazi\\u0165 zmeny\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=V\\u0161etky neulo\\u017Een\\u00E9 zmeny sa stratia. Naozaj chcete pokra\\u010Dova\\u0165?\r\n\r\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\r\nLBL_NOCHANGELOG=\\u017Diadne zmeny na ulo\\u017Eenie\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=Zmeny ulo\\u017Een\\u00E9\r\n\r\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\r\nLBL_OPPSTEPZERO=Zadajte hodnotu kroku vy\\u0161\\u0161iu ako nula\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=Aktualiz\\u00E1cia sa nepodarila\r\n\r\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\r\nLBL_FAILEDREAD=Pri \\u010D\\u00EDtan\\u00ED d\\u00E1t sa vyskytla chyba\r\n\r\n#XTIT: This is the title message of the Reset Dialog to reset the application.\r\nRESET_TITLE=Neulo\\u017Een\\u00E9 zmeny\r\n\r\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\r\nBTN_RF_CANCEL=Zru\\u0161i\\u0165\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=Zobrazi\\u0165 protokol zmien\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Zmeny\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Nov\\u00E1 hodnota\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Star\\u00E1 hodnota\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Zahodi\\u0165\r\n\r\n#XBUT: This is the button\'s text to discard selected changes from the change log.\r\nBTN_CL_DISCARDSEL=Zahodi\\u0165\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Zatvori\\u0165\r\n\r\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Upravi\\u0165 pr\\u00EDle\\u017Eitos\\u0165\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Po\\u010Diato\\u010Dn\\u00FD d\\u00E1tum\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Koncov\\u00FD d\\u00E1tum\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=O\\u010Dak\\u00E1van\\u00FD objem predaja\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Nev\\u00E1\\u017Een\\u00E9\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=V\\u00E1\\u017Een\\u00E9\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Relevantn\\u00E9 pre progn\\u00F3zu\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Pravdepodobnos\\u0165 \\u00FAspechu (v %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=F\\u00E1za predaja\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Stav\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Z\\u00E1kazn\\u00EDk\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Hlavn\\u00FD kontakt\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Zodpovedn\\u00FD zamestnanec\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=Odosla\\u0165\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Zru\\u0161i\\u0165\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \r\nLBL_VAL_MSG=Zadajte len \\u010D\\u00EDsla\r\n\r\n#YMSG: This is the error message when a user enters a chance of success value less than zero\r\nLBL_VAL_MINCHANCE=Pravdepodobnos\\u0165 \\u00FAspechu nastavi\\u0165 na nulu\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters greater. \r\nLBL_VAL_MAXCHANCE=Pravdepodobnos\\u0165 \\u00FAspechu nastavi\\u0165 na 100\r\n\r\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\r\nLBL_VAL_MAXEXPREV=Hodnota mus\\u00ED by\\u0165 men\\u0161ia ako trikr\\u00E1t najv\\u00E4\\u010D\\u0161ia pr\\u00EDle\\u017Eitos\\u0165\r\n\r\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\r\nLBL_VAL_MINEXPREV=Hodnota mus\\u00ED by\\u0165 v\\u00E4\\u010D\\u0161ia ako \\u0161tvrtina najmen\\u0161ej pr\\u00EDle\\u017Eitosti\r\n\r\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_ONE_CURR=1 pr\\u00EDle\\u017Eitos\\u0165 nie je zobrazen\\u00E1\r\n\r\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_MULTI_CURR={0} pr\\u00EDle\\u017Eitost\\u00ED sa nezobrailo.\r\n\r\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\r\nLBL_MAINTAIN_CURR=Vykonajte \\u00FAdr\\u017Ebu prepo\\u010D\\u00EDtavacieho kurzu pre {0}.\r\n\r\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\r\nLBL_ENDDATE_ERROR=Zadajte koncov\\u00FD d\\u00E1tum neskor\\u0161\\u00ED ako po\\u010Diato\\u010Dn\\u00FD d\\u00E1tum\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\r\nLBL_STARTDATE_ERROR=Zadajte po\\u010Diato\\u010Dn\\u00FD d\\u00E1tum skor\\u0161\\u00ED ako koncov\\u00FD d\\u00E1tum\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\r\nLBL_ENDDATE_ERROR_LOPP=Nasleduj\\u00FAce pr\\u00EDle\\u017Eitosti maj\\u00FA po\\u010Diato\\u010Dn\\u00FD d\\u00E1tum neskor\\u0161\\u00ED ako koncov\\u00FD d\\u00E1tum\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Top {0} pr\\u00EDle\\u017Eitost\\u00ED\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=V\\u0161etky pr\\u00EDle\\u017Eitosti\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=\\u017Diadna pr\\u00EDle\\u017Eitos\\u0165 nie je k dispoz\\u00EDcii\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Vyl\\u00FA\\u010Di\\u0165 straten\\u00E9\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Vyl\\u00FA\\u010Di\\u0165 z\\u00EDskan\\u00E9\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Zobrazi\\u0165 pod\\u013Ea ve\\u013Ekosti\r\n',
	"cus/crm/salespipeline/sim/i18n/i18n_sl.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Simulacija prodajnega procesa\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=od\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Napaka\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Ciljni dose\\u017Eek\r\n\r\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\r\nBTN_RESET=Ponastavitev\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Odjava\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Nastavitve\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=Akcije\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Upravljanje nastavitev\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Cilj prodaje\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=Prilo\\u017Enost\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Zapiranje\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Upravljanje nastavitev ciljev prodaje\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Periodi\\u010Dnost ciljev prodaje\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Cilj prodaje za teko\\u010De obdobje\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Valuta\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=\\u010Casovni interval\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=Od\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=Do\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Shranjevanje\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=Prekinitev\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=Upravljanje nastavitev prilo\\u017Enosti\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Vrednost koraka\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=Ro\\u010Dna nastavitev vrednosti\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Minimalna vrednost prilo\\u017Enosti\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Maksimalna vrednost prilo\\u017Enosti\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Shranjevanje\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=Ponastavitev\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Izvoz v Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Deli\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=Pogled sprememb\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Vse neshranjene spremembe bodo izgubljene. \\u017Delite res nadaljevati?\r\n\r\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\r\nLBL_NOCHANGELOG=Ni sprememb za prikaz\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=Spremembe so shranjene\r\n\r\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\r\nLBL_OPPSTEPZERO=Vnesite vrednost koraka, ve\\u010Djo od ni\\u010D\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=A\\u017Euriranje ni uspelo\r\n\r\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\r\nLBL_FAILEDREAD=Napaka pri branju podatkov\r\n\r\n#XTIT: This is the title message of the Reset Dialog to reset the application.\r\nRESET_TITLE=Neshranjene spremembe\r\n\r\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\r\nBTN_RF_OK=OK\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\r\nBTN_RF_CANCEL=Prekinitev\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=Pogled zapisnika spremembe\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=Spremembe\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Nova vrednost\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Stara vrednost\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Opustitev\r\n\r\n#XBUT: This is the button\'s text to discard selected changes from the change log.\r\nBTN_CL_DISCARDSEL=Opustitev\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Zapiranje\r\n\r\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=Urejanje prilo\\u017Enosti\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Datum za\\u010Detka\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Datum konca\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=Pri\\u010Dakovan promet\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=Neponderirano\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=Ponderirano\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Relevantno za napoved\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Mo\\u017Enost uspeha (v %)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=Faza prodaje\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Status\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=Stranka\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Glavna kontaktna oseba\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Odgovorni zaposleni\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=Po\\u0161iljanje\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=Prekinitev\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \r\nLBL_VAL_MSG=Vnos samo \\u0161tevilk\r\n\r\n#YMSG: This is the error message when a user enters a chance of success value less than zero\r\nLBL_VAL_MINCHANCE=Mo\\u017Enost uspeha nastavljena na ni\\u010D\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters greater. \r\nLBL_VAL_MAXCHANCE=Mo\\u017Enost uspeha nastavljena na 100\r\n\r\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\r\nLBL_VAL_MAXEXPREV=Vrednost mora biti manj\\u0161a kot trikratnik najve\\u010Dje prilo\\u017Enosti\r\n\r\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\r\nLBL_VAL_MINEXPREV=Vrednost mora biti ve\\u010Dja kot \\u010Detrtina najmanj\\u0161e prilo\\u017Enosti\r\n\r\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_ONE_CURR=1 prilo\\u017Enost ni prikazana\r\n\r\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_MULTI_CURR={0} prilo\\u017Enosti ni prikazanih.\r\n\r\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\r\nLBL_MAINTAIN_CURR=Vzdr\\u017Eujte stopnjo pretvorbe za {0}.\r\n\r\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\r\nLBL_ENDDATE_ERROR=Vnesite datum konca, ki je za datumom za\\u010Detka\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\r\nLBL_STARTDATE_ERROR=Vnesite datum za\\u010Detka, ki je pred datumom konca\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\r\nLBL_ENDDATE_ERROR_LOPP=Naslednje prilo\\u017Enosti imajo datum za\\u010Detka za datumom konca\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=Najbolj\\u0161ih {0} prilo\\u017Enosti\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=Vse prilo\\u017Enosti\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=Prilo\\u017Enosti niso na voljo\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Izklju\\u010Di izgubljeno\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Izklju\\u010Di dobljeno\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Prikaz po velikosti\r\n',
	"cus/crm/salespipeline/sim/i18n/i18n_tr.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=Sat\\u0131\\u015F kanal\\u0131n\\u0131 sim\\u00FCle et\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=/\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=Hata\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=Hedef ba\\u015Far\\u0131s\\u0131\r\n\r\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\r\nBTN_RESET=S\\u0131f\\u0131rla\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=Oturumu kapat\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=Ayarlar\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=\\u0130\\u015Flemler\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=Ayarlar\\u0131 y\\u00F6net\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=Sat\\u0131\\u015F hedefi\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=F\\u0131rsat\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=Kapat\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=Sat\\u0131\\u015F hedefi ayarlar\\u0131n\\u0131 y\\u00F6net\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=Sat\\u0131\\u015F hedefi d\\u00F6nemselli\\u011Fi\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=Ge\\u00E7erli d\\u00F6nem i\\u00E7in sat\\u0131\\u015F hedefi\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=Para birimi\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=Zaman aral\\u0131\\u011F\\u0131\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=Ba\\u015Flang\\u0131\\u00E7\\:\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=Biti\\u015F\\:\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=Kaydet\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=\\u0130ptal\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=F\\u0131rsat ayarlar\\u0131n\\u0131 y\\u00F6net\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=Ad\\u0131m de\\u011Feri\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=De\\u011Ferleri man\\u00FCel olarak belirle\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=Asgari f\\u0131rsat de\\u011Feri\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=Azami f\\u0131rsat de\\u011Feri\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=Kaydet\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=S\\u0131f\\u0131rla\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=Excel\'e aktar\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=Payla\\u015F\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=De\\u011Fi\\u015Fiklikleri g\\u00F6r\\u00FCnt\\u00FCle\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=Kaydedilmeyen de\\u011Fi\\u015Fiklikler kaybolacak. Devam etmek istedi\\u011Finizden emin misiniz?\r\n\r\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\r\nLBL_NOCHANGELOG=G\\u00F6r\\u00FCnt\\u00FClenecek de\\u011Fi\\u015Fiklik yok\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=De\\u011Fi\\u015Fiklikler kaydedildi\r\n\r\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\r\nLBL_OPPSTEPZERO=S\\u0131f\\u0131rdan b\\u00FCy\\u00FCk ad\\u0131m de\\u011Feri girin\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=G\\u00FCncelleme ba\\u015Far\\u0131s\\u0131z\r\n\r\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\r\nLBL_FAILEDREAD=Veriler okunurken hata\r\n\r\n#XTIT: This is the title message of the Reset Dialog to reset the application.\r\nRESET_TITLE=Kaydedilmeyen de\\u011Fi\\u015Fiklikler\r\n\r\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\r\nBTN_RF_OK=Tamam\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\r\nBTN_RF_CANCEL=\\u0130ptal\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=De\\u011Fi\\u015Fiklik g\\u00FCnl\\u00FC\\u011F\\u00FCn\\u00FC g\\u00F6r\\u00FCnt\\u00FCle\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=De\\u011Fi\\u015Fiklikler\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=Yeni de\\u011Fer\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=Eski de\\u011Fer\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=Yoksay\r\n\r\n#XBUT: This is the button\'s text to discard selected changes from the change log.\r\nBTN_CL_DISCARDSEL=Yoksay\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=Kapat\r\n\r\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=F\\u0131rsat\\u0131 d\\u00FCzenle\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=Ba\\u015Flang\\u0131\\u00E7 tarihi\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=Biti\\u015F tarihi\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=Beklenen sat\\u0131\\u015F has\\u0131lat\\u0131\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=A\\u011F\\u0131rl\\u0131kl\\u0131 de\\u011Fil\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=A\\u011F\\u0131rl\\u0131kl\\u0131\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=Tahmin i\\u00E7in ili\\u015Fkili\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=Ba\\u015Far\\u0131 \\u015Fans\\u0131 (% olarak)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=Sat\\u0131\\u015F a\\u015Famas\\u0131\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=Durum\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=M\\u00FC\\u015Fteri\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=Ana ilgili ki\\u015Fi\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=Sorumlu \\u00E7al\\u0131\\u015Fan\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=G\\u00F6nder\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=\\u0130ptal\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \r\nLBL_VAL_MSG=Yaln\\u0131zca say\\u0131 girin\r\n\r\n#YMSG: This is the error message when a user enters a chance of success value less than zero\r\nLBL_VAL_MINCHANCE=Ba\\u015Far\\u0131 \\u015Fans\\u0131 s\\u0131f\\u0131r olarak belirlendi\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters greater. \r\nLBL_VAL_MAXCHANCE=Ba\\u015Far\\u0131 \\u015Fans\\u0131 100 olarak belirlendi\r\n\r\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\r\nLBL_VAL_MAXEXPREV=De\\u011Fer en b\\u00FCy\\u00FCk f\\u0131rsattan \\u00FC\\u00E7 kez daha k\\u00FC\\u00E7\\u00FCk olmal\\u0131\r\n\r\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\r\nLBL_VAL_MINEXPREV=De\\u011Fer en k\\u00FC\\u00E7\\u00FCk f\\u0131rsat\\u0131n \\u00E7eyre\\u011Finden daha b\\u00FCy\\u00FCk olmal\\u0131\r\n\r\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_ONE_CURR=1 f\\u0131rsat g\\u00F6r\\u00FCnt\\u00FClenmedi\r\n\r\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_MULTI_CURR={0} f\\u0131rsat g\\u00F6r\\u00FCnt\\u00FClenmedi.\r\n\r\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\r\nLBL_MAINTAIN_CURR={0} i\\u00E7in d\\u00F6n\\u00FC\\u015Ft\\u00FCrme oran\\u0131 bak\\u0131m\\u0131n\\u0131 yap\\u0131n.\r\n\r\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\r\nLBL_ENDDATE_ERROR=Ba\\u015Flang\\u0131\\u00E7 tarihinden sonra biti\\u015F tarihi girin\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\r\nLBL_STARTDATE_ERROR=Biti\\u015F tarihine g\\u00F6re daha erken ba\\u015Flang\\u0131\\u00E7 tarihi girin\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\r\nLBL_ENDDATE_ERROR_LOPP=A\\u015Fa\\u011F\\u0131daki f\\u0131rsatlar biti\\u015F tarihinden daha sonraki ba\\u015Flang\\u0131\\u00E7 tarihine sahip\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=\\u0130lk {0} f\\u0131rsatlar\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=T\\u00FCm f\\u0131rsatlar\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=F\\u0131rsat mevcut de\\u011Fil\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=Kaybedileni hari\\u00E7 tut\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=Kazan\\u0131lan\\u0131 hari\\u00E7 tut\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=Boyuta g\\u00F6re g\\u00F6r\\u00FCnt\\u00FCle\r\n',
	"cus/crm/salespipeline/sim/i18n/i18n_zh_CN.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\r\nFULLSCREEN_TITLE=\\u6A21\\u62DF\\u9500\\u552E\\u7BA1\\u9053\r\n\r\n#XFLD: This is the label for the Target value achieved text\r\nLBL_OF=/\r\n\r\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\r\nERROR_MSG=\\u9519\\u8BEF\r\n\r\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\r\nLBL_TARGET_ACHIEVEMENT=\\u76EE\\u6807\\u4E1A\\u7EE9\r\n\r\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\r\nBTN_RESET=\\u91CD\\u7F6E\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user the logout.\r\nBTN_LOGOUT=\\u767B\\u51FA\r\n\r\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\r\nBTN_APPSETTINGS=\\u8BBE\\u7F6E\r\n\r\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\r\nBTN_ACTIONLIST=\\u64CD\\u4F5C\r\n\r\n#XTIT: This is the title message of the application settings dialog.\r\nAPPSETTINGS_TITLE=\\u7BA1\\u7406\\u8BBE\\u7F6E\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nSALESTARGET_ITEM=\\u9500\\u552E\\u76EE\\u6807\r\n\r\n#XLST: This is the list item\'s text present in application settings dialog.\r\nOPPORTUNITY_ITEM=\\u673A\\u4F1A\r\n\r\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\r\nBTN_CLOSE_APPSETT=\\u5173\\u95ED\r\n\r\n#XTIT: This is the title message of the Sales Target Settings dialog.\r\nAS_SALESTARGET_TITLE=\\u7BA1\\u7406\\u9500\\u552E\\u76EE\\u6807\\u8BBE\\u7F6E\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\r\nLBL_ST_SALESPERIOD=\\u9500\\u552E\\u76EE\\u6807\\u5468\\u671F\r\n\r\n#XFLD: This is the label indicating the target amount for the current sales period.\r\nLBL_ST_SALESTARGET=\\u5F53\\u524D\\u671F\\u95F4\\u7684\\u9500\\u552E\\u76EE\\u6807\r\n\r\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\r\nLBL_ST_CURRENCY=\\u8D27\\u5E01\r\n\r\n#XFLD: This is the label indicating the sales period\'s timespan.\r\nLBL_ST_TIMESPAN=\\u65F6\\u95F4\\u8303\\u56F4\r\n\r\n#XFLD: This is the label indicating the start of the Sales Period.\r\nLBL_ST_TIMEFROM=\\u4ECE\r\n\r\n#XFLD: This is the label indicating the end of the Sales Period.\r\nLBL_ST_TIMETO=\\u81F3\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\r\nBTN_AS_SAVEAPPSETT=\\u4FDD\\u5B58\r\n\r\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\r\nBTN_AS_CANCELAPPSETT=\\u53D6\\u6D88\r\n\r\n#XTIT: This is the title message of the Opportunity Settings dialog.\r\nAS_OPPORTUNITY_TITLE=\\u7BA1\\u7406\\u673A\\u4F1A\\u8BBE\\u7F6E\r\n\r\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\r\nLBL_OP_STEPVALUE=\\u589E\\u91CF\\u503C\r\n\r\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\r\nLBL_OP_SETVALUES=\\u624B\\u52A8\\u8BBE\\u7F6E\\u503C\r\n\r\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MINVALUE=\\u6700\\u5C0F\\u673A\\u4F1A\\u503C\r\n\r\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\r\nLBL_OP_MAXVALUE=\\u6700\\u5927\\u673A\\u4F1A\\u503C\r\n\r\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\r\nBTN_SAVE_OPPORT=\\u4FDD\\u5B58\r\n\r\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\r\nBTN_REFRESH_APP=\\u91CD\\u7F6E\r\n\r\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\r\nBTN_EXPORTEXCL=\\u5BFC\\u51FA\\u4E3A Excel\r\n\r\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\r\nBTN_SHARETO=\\u5171\\u4EAB\r\n\r\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\r\nBTN_SHOW_CHANGELOG=\\u67E5\\u770B\\u53D8\\u66F4\r\n\r\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\r\nLBL_CONFIRM_REFRESH=\\u6240\\u6709\\u672A\\u4FDD\\u5B58\\u7684\\u66F4\\u6539\\u5C06\\u4E22\\u5931\\u3002\\u662F\\u5426\\u786E\\u5B9A\\u7EE7\\u7EED\\uFF1F\r\n\r\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\r\nLBL_NOCHANGELOG=\\u6CA1\\u6709\\u53EF\\u663E\\u793A\\u7684\\u66F4\\u6539\r\n\r\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\r\nLBL_SUCCESSUPDATE=\\u66F4\\u6539\\u5DF2\\u4FDD\\u5B58\r\n\r\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\r\nLBL_OPPSTEPZERO=\\u8F93\\u5165\\u5927\\u4E8E\\u96F6\\u7684\\u589E\\u91CF\\u503C\r\n\r\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\r\nLBL_FAILEDUPDATE=\\u66F4\\u65B0\\u5931\\u8D25\r\n\r\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\r\nLBL_FAILEDREAD=\\u8BFB\\u53D6\\u6570\\u636E\\u65F6\\u51FA\\u9519\r\n\r\n#XTIT: This is the title message of the Reset Dialog to reset the application.\r\nRESET_TITLE=\\u672A\\u4FDD\\u5B58\\u7684\\u66F4\\u6539\r\n\r\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\r\nBTN_RF_OK=\\u786E\\u5B9A\r\n\r\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\r\nBTN_RF_CANCEL=\\u53D6\\u6D88\r\n\r\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\r\nCHANGELOG_TITLE=\\u67E5\\u770B\\u53D8\\u66F4\\u65E5\\u5FD7\r\n\r\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\r\nLBL_CL_CHANGES=\\u66F4\\u6539\r\n\r\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\r\nLBL_CL_NEWVALUE=\\u65B0\\u503C\r\n\r\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\r\nLBL_CL_OLDVALUE=\\u65E7\\u503C\r\n\r\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\r\nBTN_CL_DISCARD=\\u653E\\u5F03\r\n\r\n#XBUT: This is the button\'s text to discard selected changes from the change log.\r\nBTN_CL_DISCARDSEL=\\u653E\\u5F03\r\n\r\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\r\nBTN_CL_CLOSE=\\u5173\\u95ED\r\n\r\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \r\nLBL_OPPORT_DETAILS=\\u7F16\\u8F91\\u673A\\u4F1A\r\n\r\n#XFLD: This is the label indicating the start date of the opportunity selected.\r\nLBL_OD_STARTDATE=\\u5F00\\u59CB\\u65E5\\u671F\r\n\r\n#XFLD: This is the label indicating the end date of the opportunity selected.\r\nLBL_OD_ENDDATE=\\u7ED3\\u675F\\u65E5\\u671F\r\n\r\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUEHEADER=\\u9884\\u671F\\u9500\\u552E\\u989D\r\n\r\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\r\nLBL_OD_EXPECTEDREVENUE=\\u672A\\u52A0\\u6743\r\n\r\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\r\nLBL_OD_WEIGHTEDREVENUE=\\u5DF2\\u52A0\\u6743\r\n\r\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\r\nLBL_OD_FORECASTRELEVANCE=\\u9884\\u6D4B\\u76F8\\u5173\r\n\r\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\r\nLBL_OD_CHANCEOFSUCCESS=\\u6210\\u529F\\u51E0\\u7387 (%)\r\n\r\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\r\nLBL_OD_SALESSTAGE=\\u9500\\u552E\\u9636\\u6BB5\r\n\r\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\r\nLBL_OD_STATUS=\\u72B6\\u6001\r\n\r\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\r\nLBL_OD_ACCPROSPECT=\\u5BA2\\u6237\r\n\r\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\r\nLBL_OD_MAINCONTACT=\\u4E3B\\u8981\\u8054\\u7CFB\\u4EBA\r\n\r\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\r\nLBL_OD_EMPLRESP=\\u8D1F\\u8D23\\u4EBA\r\n\r\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\r\nBTN_OD_OK=\\u63D0\\u4EA4\r\n\r\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\r\nBTN_OD_CANCEL=\\u53D6\\u6D88\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \r\nLBL_VAL_MSG=\\u53EA\\u80FD\\u8F93\\u5165\\u6570\\u5B57\r\n\r\n#YMSG: This is the error message when a user enters a chance of success value less than zero\r\nLBL_VAL_MINCHANCE=\\u6210\\u529F\\u51E0\\u7387\\u5DF2\\u8BBE\\u7F6E\\u4E3A\\u96F6\r\n\r\n#YMSG: This is the validation message that is displayed when a user enters greater. \r\nLBL_VAL_MAXCHANCE=\\u6210\\u529F\\u51E0\\u7387\\u5DF2\\u8BBE\\u7F6E\\u4E3A 100\r\n\r\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\r\nLBL_VAL_MAXEXPREV=\\u503C\\u5FC5\\u987B\\u5C0F\\u4E8E\\u6700\\u5927\\u673A\\u4F1A\\u503C\\u7684\\u4E09\\u500D\r\n\r\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\r\nLBL_VAL_MINEXPREV=\\u503C\\u5FC5\\u987B\\u5927\\u4E8E\\u6700\\u5C0F\\u673A\\u4F1A\\u503C\\u7684\\u56DB\\u5206\\u4E4B\\u4E00\r\n\r\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_ONE_CURR=1 \\u4E2A\\u673A\\u4F1A\\u672A\\u663E\\u793A\r\n\r\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\r\nLBL_MULTI_CURR={0} \\u4E2A\\u673A\\u4F1A\\u672A\\u663E\\u793A\\u3002\r\n\r\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\r\nLBL_MAINTAIN_CURR=\\u7EF4\\u62A4 {0} \\u7684\\u8F6C\\u6362\\u7387\\u3002\r\n\r\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\r\nLBL_ENDDATE_ERROR=\\u8F93\\u5165\\u665A\\u4E8E\\u5F00\\u59CB\\u65E5\\u671F\\u7684\\u7ED3\\u675F\\u65E5\\u671F\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\r\nLBL_STARTDATE_ERROR=\\u8F93\\u5165\\u65E9\\u4E8E\\u7ED3\\u675F\\u65E5\\u671F\\u7684\\u5F00\\u59CB\\u65E5\\u671F\r\n\r\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\r\nLBL_ENDDATE_ERROR_LOPP=\\u4EE5\\u4E0B\\u673A\\u4F1A\\u7684\\u5F00\\u59CB\\u65E5\\u671F\\u665A\\u4E8E\\u7ED3\\u675F\\u65E5\\u671F\r\n\r\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\r\nLBL_NOOFTO_SELECTED=\\u524D {0} \\u4E2A\\u673A\\u4F1A\r\n\r\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\r\nLBL_ALLTO_SELECTED=\\u5168\\u90E8\\u673A\\u4F1A\r\n\r\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\r\nLBL_NOTO_SELECTED=\\u65E0\\u53EF\\u7528\\u673A\\u4F1A\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\r\nLBL_CBX_EXCLUDE_LOST=\\u6392\\u9664\\u5DF2\\u5931\\u53BB\r\n\r\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\r\nLBL_CBX_EXCLUDE_WON=\\u6392\\u9664\\u5DF2\\u8D62\\u5F97\r\n\r\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\r\nBTN_OPEN_OPPORTUNITY_SLIDER=\\u6309\\u5927\\u5C0F\\u663E\\u793A\r\n',
	"cus/crm/salespipeline/sim/i18n/i18n_zh_CN_.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\n\n# Note: This file was created according to the conventions that can be found at \n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\n\n#XTIT: This is the title message of the main screen of the Sales Pipeline Simulator app.\nFULLSCREEN_TITLE=\\u6A21\\u62DF\\u9500\\u552E\\u7BA1\\u9053\n\n#XFLD: This is the label for the Target value achieved text\nLBL_OF=/\n\n#XTIT: This is the title message of the dialog shown to the Sales Representative in the event an error occurs.\nERROR_MSG=\\u9519\\u8BEF\n\n#XFLD: This is the label for the Progress Indicator control indicating how much target the Sales Representative has achieved.\nLBL_TARGET_ACHIEVEMENT=\\u76EE\\u6807\\u4E1A\\u7EE9\n\n#XBUT: This is the button\'s text to reset the Sales Pipeline Simulator app. Any changes made will be discarded.\nBTN_RESET=\\u91CD\\u7F6E\n\n#XBUT: This is the button\'s text indicating the option for the user the logout.\nBTN_LOGOUT=\\u767B\\u51FA\n\n#XBUT: This is the button\'s text indicating the option to view/modify the application settings.\nBTN_APPSETTINGS=\\u8BBE\\u7F6E\n\n#XBUT: This is the button\'s text indicating to perform further set of Actions.\nBTN_ACTIONLIST=\\u64CD\\u4F5C\n\n#XTIT: This is the title message of the application settings dialog.\nAPPSETTINGS_TITLE=\\u7BA1\\u7406\\u8BBE\\u7F6E\n\n#XLST: This is the list item\'s text present in application settings dialog.\nSALESTARGET_ITEM=\\u9500\\u552E\\u76EE\\u6807\n\n#XLST: This is the list item\'s text present in application settings dialog.\nOPPORTUNITY_ITEM=\\u673A\\u4F1A\n\n#XBUT: This is the button\'s text indicating the option to dismiss the application settings dialog.\nBTN_CLOSE_APPSETT=\\u5173\\u95ED\n\n#XTIT: This is the title message of the Sales Target Settings dialog.\nAS_SALESTARGET_TITLE=\\u7BA1\\u7406\\u9500\\u552E\\u76EE\\u6807\\u8BBE\\u7F6E\n\n#XFLD: This is the label for the Select control indicating the possible choices of Sales Period to choose from.\nLBL_ST_SALESPERIOD=\\u9500\\u552E\\u76EE\\u6807\\u5468\\u671F\n\n#XFLD: This is the label indicating the target amount for the current sales period.\nLBL_ST_SALESTARGET=\\u5F53\\u524D\\u671F\\u95F4\\u7684\\u9500\\u552E\\u76EE\\u6807\n\n#XFLD: This is the label for the Select control indicating the possible choices of Currency to choose from.\nLBL_ST_CURRENCY=\\u8D27\\u5E01\n\n#XFLD: This is the label indicating the sales period\'s timespan.\nLBL_ST_TIMESPAN=\\u65F6\\u95F4\\u8303\\u56F4\n\n#XFLD: This is the label indicating the start of the Sales Period.\nLBL_ST_TIMEFROM=\\u4ECE\n\n#XFLD: This is the label indicating the end of the Sales Period.\nLBL_ST_TIMETO=\\u81F3\n\n#XBUT: This is the button\'s text indicating the option for the user to save the application settings if a change was made.\nBTN_AS_SAVEAPPSETT=\\u4FDD\\u5B58\n\n#XBUT: This is the button\'s text indicating the option for the user to dismiss the application settings and also any changes made.\nBTN_AS_CANCELAPPSETT=\\u53D6\\u6D88\n\n#XTIT: This is the title message of the Opportunity Settings dialog.\nAS_OPPORTUNITY_TITLE=\\u7BA1\\u7406\\u673A\\u4F1A\\u8BBE\\u7F6E\n\n#XFLD: This is the label indicating the step value size by which the oppportunity\'s expected revenue can be modified.\nLBL_OP_STEPVALUE=\\u589E\\u91CF\\u503C\n\n#XFLD: This is the label for the Switch control to enable the users modify the extreme values (min, max) of expected revenue or use from the existing set of opportunities.\nLBL_OP_SETVALUES=\\u624B\\u52A8\\u8BBE\\u7F6E\\u503C\n\n#XFLD: This is the label indicating the minimum value that an opportunity\'s expected revenue can be modified up to.\nLBL_OP_MINVALUE=\\u6700\\u5C0F\\u673A\\u4F1A\\u503C\n\n#XFLD: This is the label indicating the maximum value that an opportunity\'s expected revenue can be modified up to.\nLBL_OP_MAXVALUE=\\u6700\\u5927\\u673A\\u4F1A\\u503C\n\n#XBUT: This is the button\'s text indicating the option to save any/all changes made to the representative\'s set of opportunities.\nBTN_SAVE_OPPORT=\\u4FDD\\u5B58\n\n#XBUT: This is the button\'s text indicating to refresh the main screen of the application.\nBTN_REFRESH_APP=\\u91CD\\u7F6E\n\n#XBUT: This is the button\'s text indicating the option to export the representative\'s opportunities to a local excel file.\nBTN_EXPORTEXCL=\\u5BFC\\u51FA\\u4E3A Excel\n\n#XBUT: This is the button\'s text indicating the option to share the application to various social platforms.\nBTN_SHARETO=\\u5171\\u4EAB\n\n#XBUT: This is the button\'s text indicating the option to view all changes made to the representative\'s set of opportunities.\nBTN_SHOW_CHANGELOG=\\u67E5\\u770B\\u53D8\\u66F4\n\n#YMSG: This is the confirmation message when the representative has chosen the option to Refresh.\nLBL_CONFIRM_REFRESH=\\u6240\\u6709\\u672A\\u4FDD\\u5B58\\u7684\\u66F4\\u6539\\u5C06\\u4E22\\u5931\\u3002\\u662F\\u5426\\u786E\\u5B9A\\u7EE7\\u7EED\\uFF1F\n\n#YMSG: This is the alert message show to the representative when the representative chooses to view the change log and no change is present.\nLBL_NOCHANGELOG=\\u6CA1\\u6709\\u53EF\\u663E\\u793A\\u7684\\u66F4\\u6539\n\n#YMSG: This is the success message shown to the representative when an update to the back end is successful.\nLBL_SUCCESSUPDATE=\\u66F4\\u6539\\u5DF2\\u4FDD\\u5B58\n\n#YMSG: This is an alert message shown to the representative if the opportunity step value is set to zero.\nLBL_OPPSTEPZERO=\\u8F93\\u5165\\u5927\\u4E8E\\u96F6\\u7684\\u589E\\u91CF\\u503C\n\n#YMSG: This is the failure message shown to the representative when an update to the back end is unsuccessful.\nLBL_FAILEDUPDATE=\\u66F4\\u65B0\\u5931\\u8D25\n\n#YMSG: This is the failure message shown to the representative when reading data from the back end is unsuccessful.\nLBL_FAILEDREAD=\\u8BFB\\u53D6\\u6570\\u636E\\u65F6\\u51FA\\u9519\n\n#XTIT: This is the title message of the Reset Dialog to reset the application.\nRESET_TITLE=\\u672A\\u4FDD\\u5B58\\u7684\\u66F4\\u6539\n\n#XBUT: This is the button\'s text indicating the success action of resetting the main screen.\nBTN_RF_OK=\\u786E\\u5B9A\n\n#XBUT: This is the button\'s text indicating the dismissal action of resetting the main screen.\nBTN_RF_CANCEL=\\u53D6\\u6D88\n\n#XTIT: This is the title message of the Change Log dialog in which any opportunities that have been changed are shown.\nCHANGELOG_TITLE=\\u67E5\\u770B\\u53D8\\u66F4\\u65E5\\u5FD7\n\n#XFLD: This is the label indicating which attribute of the Opportunity has been changed by the representative.\nLBL_CL_CHANGES=\\u66F4\\u6539\n\n#XFLD: This is the label indicating which new value of the attribute that has been changed by the representative.\nLBL_CL_NEWVALUE=\\u65B0\\u503C\n\n#XFLD: This is the label indicating which old value of the attribute that has been changed by the representative.\nLBL_CL_OLDVALUE=\\u65E7\\u503C\n\n#XBUT: This is the button\'s text indicating the number of changes made by the representative to be discarded.\nBTN_CL_DISCARD=\\u653E\\u5F03\n\n#XBUT: This is the button\'s text to discard selected changes from the change log.\nBTN_CL_DISCARDSEL=\\u653E\\u5F03\n\n#XBUT: This is the button\'s text indication the option to dismiss the Change Log dialog.\nBTN_CL_CLOSE=\\u5173\\u95ED\n\n#XFLD: This is the label of the Popover control\'s Header indicating the details of an opportunity. \nLBL_OPPORT_DETAILS=\\u7F16\\u8F91\\u673A\\u4F1A\n\n#XFLD: This is the label indicating the start date of the opportunity selected.\nLBL_OD_STARTDATE=\\u5F00\\u59CB\\u65E5\\u671F\n\n#XFLD: This is the label indicating the end date of the opportunity selected.\nLBL_OD_ENDDATE=\\u7ED3\\u675F\\u65E5\\u671F\n\n#XFLD: This is the label indicating the expected revenue header of the opportunity selected.\nLBL_OD_EXPECTEDREVENUEHEADER=\\u9884\\u671F\\u9500\\u552E\\u989D\n\n#XFLD: This is the label indicating the expected revenue of the opportunity selected.\nLBL_OD_EXPECTEDREVENUE=\\u672A\\u52A0\\u6743\n\n#XFLD: This is the label indicating the weighted revenue of the opportunity selected.\nLBL_OD_WEIGHTEDREVENUE=\\u5DF2\\u52A0\\u6743\n\n#XFLD: This is the label indicating whether the opportunity is relevant for forecast or not.\nLBL_OD_FORECASTRELEVANCE=\\u9884\\u6D4B\\u76F8\\u5173\n\n#XFLD: This is the label indicating the chance of success of the opportunity selected.\nLBL_OD_CHANCEOFSUCCESS=\\u6210\\u529F\\u51E0\\u7387 (%)\n\n#XFLD: This is the label indicating the possible list of Sales Stages based on the Process Type of the opportunity selected.\nLBL_OD_SALESSTAGE=\\u9500\\u552E\\u9636\\u6BB5\n\n#XFLD: This is the label indicating the possible list of the Status based on the Process Type of the opportunity selected.\nLBL_OD_STATUS=\\u72B6\\u6001\n\n#XFLD: This is the label indicating who the prospect/account of the opportunity selected is.\nLBL_OD_ACCPROSPECT=\\u5BA2\\u6237\n\n#XFLD: This is the label indicating the main contact of the prospect/account of the opportunity selected.\nLBL_OD_MAINCONTACT=\\u4E3B\\u8981\\u8054\\u7CFB\\u4EBA\n\n#XFLD: This is the label indicating the employee responsible for the opportunity selected.\nLBL_OD_EMPLRESP=\\u8D1F\\u8D23\\u4EBA\n\n#XBUT: This is the button\'s text to confirm the changes made to the opportunity selected, if any made and add them to the change log.\nBTN_OD_OK=\\u63D0\\u4EA4\n\n#XBUT: This is the button\'s text to dismiss the changes made to the opportunity selected, if any made.\nBTN_OD_CANCEL=\\u53D6\\u6D88\n\n#YMSG: This is the validation message that is displayed when a user enters non-numeric input. \nLBL_VAL_MSG=\\u53EA\\u80FD\\u8F93\\u5165\\u6570\\u5B57\n\n#YMSG: This is the error message when a user enters a chance of success value less than zero\nLBL_VAL_MINCHANCE=\\u6210\\u529F\\u51E0\\u7387\\u5DF2\\u8BBE\\u7F6E\\u4E3A\\u96F6\n\n#YMSG: This is the validation message that is displayed when a user enters greater. \nLBL_VAL_MAXCHANCE=\\u6210\\u529F\\u51E0\\u7387\\u5DF2\\u8BBE\\u7F6E\\u4E3A 100\n\n#YMSG: This is the error message when a user enters an expected volume greater than three times that of the largest opportunity\nLBL_VAL_MAXEXPREV=\\u503C\\u5FC5\\u987B\\u5C0F\\u4E8E\\u6700\\u5927\\u673A\\u4F1A\\u503C\\u7684\\u4E09\\u500D\n\n#YMSG: This is the error message when a user enters less than one fourth the value of the smallest opportunity\nLBL_VAL_MINEXPREV=\\u503C\\u5FC5\\u987B\\u5927\\u4E8E\\u6700\\u5C0F\\u673A\\u4F1A\\u503C\\u7684\\u56DB\\u5206\\u4E4B\\u4E00\n\n#YMSG: This is an alert message when the user retrieves an opportunity from the backend for which the conversion rate is not maintained.\nLBL_ONE_CURR=1 \\u4E2A\\u673A\\u4F1A\\u672A\\u663E\\u793A\n\n#YMSG: This is an alert message when the user retrieves more than 1 opportunity from the backend for which the conversion rate is not maintained.\nLBL_MULTI_CURR={0} \\u4E2A\\u673A\\u4F1A\\u672A\\u663E\\u793A\\u3002\n\n#YMSG: This is an alert message telling the user to maintain conversion rate for single currency/multiple currencies.\nLBL_MAINTAIN_CURR=\\u7EF4\\u62A4 {0} \\u7684\\u8F6C\\u6362\\u7387\\u3002\n\n#YMSG: This is an alert message telling the user that End date should not be less than Start date.\nLBL_ENDDATE_ERROR=\\u8F93\\u5165\\u665A\\u4E8E\\u5F00\\u59CB\\u65E5\\u671F\\u7684\\u7ED3\\u675F\\u65E5\\u671F\n\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date.\nLBL_STARTDATE_ERROR=\\u8F93\\u5165\\u65E9\\u4E8E\\u7ED3\\u675F\\u65E5\\u671F\\u7684\\u5F00\\u59CB\\u65E5\\u671F\n\n#YMSG: This is an alert message telling the user that Start date should not be greater than End date for the following list of opportunities.\nLBL_ENDDATE_ERROR_LOPP=\\u4EE5\\u4E0B\\u673A\\u4F1A\\u7684\\u5F00\\u59CB\\u65E5\\u671F\\u665A\\u4E8E\\u7ED3\\u675F\\u65E5\\u671F\n\n#XFLD: This is the Title for showing no of Top Opportunity selected in Top Opportunity Slider.\n\n#XFLD: This is the Title for showing All Opportunity selected in Top Opportunity Slider.\nLBL_ALLTO_SELECTED=\\u5168\\u90E8\\u673A\\u4F1A\n\n#XFLD: This is the Title for showing No Opportunity available in Top Opportunity Slider.\nLBL_NOTO_SELECTED=\\u65E0\\u53EF\\u7528\\u673A\\u4F1A\n\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status.\nLBL_CBX_EXCLUDE_LOST=\\u6392\\u9664\\u5DF2\\u5931\\u53BB\n\n#XFLD: This is the label of checkbox for Excluding opportunity with lost status\nLBL_CBX_EXCLUDE_WON=\\u6392\\u9664\\u5DF2\\u8D62\\u5F97\n\n#XBUT: This is the Button\'s text indicating user to open Top Opportunity Slider.\nBTN_OPEN_OPPORTUNITY_SLIDER=\\u6309\\u5927\\u5C0F\\u663E\\u793A\n',
	"cus/crm/salespipeline/sim/util/formatter.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.salespipeline.sim.util.formatter");
jQuery.sap.require("sap.ui.core.format.NumberFormat");
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");

cus.crm.salespipeline.sim.util.formatter = {
	// Formatters
	toBoolean : function(i) {
		if (i > 0)
			return true;
		else
			return false;
	},

	// Formatting to display and reverse the numbers
	displayNumbers : function(i) {
		var locale = new sap.ui.core.Locale(sap.ui.getCore().getConfiguration()
				.getLanguage());
		var convNF = sap.ui.core.format.NumberFormat.getIntegerInstance({
			groupingEnabled : true
		}, locale);
		// var convNF =
		// sap.ca.ui.model.format.AmountFormat.getInstance({decimals: 0});
		var numVal = convNF.format(i);
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
		// var convNF =
		// sap.ca.ui.model.format.AmountFormat.getInstance({decimals: 0});
		// var numVal = convNF.parse(i);
		return numVal;
	},

	displayNumbersShort : function(i) {
		var numVal = null;
		/*if (jQuery.device.is.phone || jQuery.device.is.iphone
				|| jQuery.device.is.android_phone)*/
		if(sap.ui.Device.system.phone)
			numVal = sap.ca.ui.model.format.AmountFormat.FormatAmountShort(i);
		else {
			var locale = new sap.ui.core.Locale(sap.ui.getCore()
					.getConfiguration().getLanguage());
			var convNF = sap.ui.core.format.NumberFormat.getIntegerInstance({
				groupingEnabled : true
			}, locale);
			numVal = convNF.format(i);
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

	reverseDates : function(i) {
		var locale = new sap.ui.core.Locale(sap.ui.getCore().getConfiguration()
				.getLanguage());
		var convDF = sap.ui.core.format.DateFormat.getInstance({
			style : "long"
		}, locale);
		var dateVal = convDF.parse(i);
		return dateVal;
	},

	// Formatting dates in ChangeLog
	dispCLDate : function(i) {
		var locale = new sap.ui.core.Locale(sap.ui.getCore().getConfiguration()
				.getLanguage());
		var convDF = sap.ui.core.format.DateFormat.getInstance({
			style : "medium"
		}, locale);
		var dateVal = convDF.format(i);
		return dateVal;
	},

	revCLDate : function(i) {
		var locale = new sap.ui.core.Locale(sap.ui.getCore().getConfiguration()
				.getLanguage());
		var convDF = sap.ui.core.format.DateFormat.getInstance({
			style : "medium"
		}, locale);
		var dateVal = convDF.parse(i);
		dateVal = this.convFromSixZeros(dateVal);
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
	"cus/crm/salespipeline/sim/view/S1.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ui.core.format.NumberFormat");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseMasterController");
jQuery.sap.require("sap.ca.ui.message.message");

sap.ca.scfld.md.controller.BaseFullscreenController
		.extend(
				"cus.crm.salespipeline.sim.view.S1",
				{
					// Controller Methods - onInit
					onInit : function() {
						sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit
								.call(this);
						this._initControllerVariables();
						this.loadData();
						this._initializeAllControllerFragments();
						var ftCL = this.getView().byId("butChangelog");
						var ftSV = this.getView().byId("butSave");
						var ftRT = this.getView().byId("butReset");
						if (sap.ui.Device.system.phone) {
							ftCL.setIcon("sap-icon://activities");
							ftSV.setIcon("sap-icon://save");
							ftRT.setIcon("sap-icon://undo");
						} else {
							ftCL.setText(this.oBundle
									.getText("BTN_SHOW_CHANGELOG"));
							ftSV.setText(this.oBundle
									.getText("BTN_SAVE_OPPORT"));
							ftRT.setText(this.oBundle.getText("BTN_RESET"));
						}
						if (sap.ui.Device.browser.BROWSER.INTERNET_EXPLORER == sap.ui.Device.browser.name
								&& sap.ui.Device.browser.version < 10) {
							var oSliderLayout = this.getView().byId(
									"hlOppSlider");
							oSliderLayout.removeStyleClass("alignRight");
							oSliderLayout.addStyleClass("alignRightIE9");
						}
						sap.ui.getCore().byId("poPage").addStyleClass(
								"sapUiStdPage");
						this.getView().byId("page").addStyleClass(
								"sapUiStdPage");
						// Changes for no text selection on controls
						this.disableTextSelection();
						window.addEventListener("orientationchange",
								function() {
									if (sap.ui.getCore().byId("po").isOpen())
										sap.ui.getCore().byId("po").close();

								}, false);
					},

					_initControllerVariables : function() {
						this.oDataModel = this.oApplicationFacade
								.getODataModel();
						this.oBundle = this.oApplicationFacade
								.getResourceBundle();
						this.oApplicationFacade.oApplicationImplementation.oCurController.FullCtrl = this;
						this.aChangeablePropsTexts = [
								{
									"property" : "StartDate",
									"displayText" : this.oBundle
											.getText("LBL_OD_STARTDATE")
								},
								{
									"property" : "ClosingDate",
									"displayText" : this.oBundle
											.getText("LBL_OD_ENDDATE")
								},
								{
									"property" : "ExpectedSalesVolume",
									"displayText" : this.oBundle
											.getText("LBL_OD_EXPECTEDREVENUEHEADER")
								},
								{
									"property" : "ForecastRelevance",
									"displayText" : this.oBundle
											.getText("LBL_OD_FORECASTRELEVANCE")
								},
								{
									"property" : "SalesStageCode",
									"displayText" : this.oBundle
											.getText("LBL_OD_SALESSTAGE")
								},
								{
									"property" : "ChanceOfSuccess",
									"displayText" : this.oBundle
											.getText("LBL_OD_CHANCEOFSUCCESS")
								},
								{
									"property" : "UserStatusCode",
									"displayText" : this.oBundle
											.getText("LBL_OD_STATUS")
								} ];

						this._iServiceSchemaVersion = this
								._getServiceSchemaVersion(this.oDataModel,
										"Opportunity");
						this._iServiceVersion = this._getServiceVersion(
								this.oDataModel, "Opportunity");
						this.viewType = {};
						this.iChangeStartDate = 0;
						this.iChangeEndDate = 0;
						this.arrStatusPros = [];
						this.arrStagesPros = [];
						this.ptGroup = {};
						this.reRenderTopNSlider = true;
						this.oNavParams = {
							"toOppApp" : "",
							"toContactApp" : "",
							"toAccountApp" : "",
							"telCall" : "",
							"sendMail" : ""
						};
						this.iChangeCOS = 0;
						this.iChangeExpRev = 0;
						this.oFragmentList = {};
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
						// Change Log Dialog
						sap.ui.getCore().byId('changeLogDialog')
								.allowTextSelection(false);
						// TOP N Slider
						sap.ui.getCore().byId('popup')
								.allowTextSelection(false);
					},

					// Controller Methods - onExit
					onExit : function() {
						if (this.getView().byId("acButAppS") != undefined)
							this.getView().byId("acButAppS").destroy();
						this._destroyAllControllerFragments();
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
					 * DEVELOPMENT for SimulateSalesPipeline
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
							var msgClassNo = errorDetails.code.split("/");
							if (msgClassNo.length == 2)
								msgShown = errorDetails.message.value;
							else {
								if (isRead)
									msgShown = this.oBundle
											.getText("LBL_FAILEDREAD");
								else
									msgShown = this.oBundle
											.getText("LBL_FAILEDUPDATE");
							}
						} else
							msgShown = oError.message;

						var msg = errorDetails.message.value;
						sap.ca.ui.message.showMessageBox({
							type : sap.ca.ui.message.Type.ERROR,
							message : msgShown,
							details : msg
						});
					},

					// Formatting to display and reverse the changable
					// properties in Change Log
					formatChangeLog : function(name, input, key) {
						var utilForm = cus.crm.salespipeline.sim.util.formatter;
						switch (name) {
						case "StartDate":
							return utilForm.dispCLDate(input);
						case "ClosingDate":
							return utilForm.dispCLDate(input);
						case "ExpectedSalesVolume":
							return utilForm.displayNumbers(input);
						case "ForecastRelevance":
							if (input)
								return true;
							else
								return false;
						case "ChanceOfSuccess":
							return parseFloat(input) + "%";
						case "SalesStageCode":
							for ( var i = 0; i < this.arrStagesPros.length; i++)
								if (this.arrStagesPros[i].guidVal == key) {
									var aStages = this.arrStagesPros[i].Stages;
									for ( var k = 0; k < aStages.length; k++)
										if (input == aStages[k].SalesStageCode) {
											return aStages[k].SalesStageDescription;
											break;
										}
									break;
								}
						case "UserStatusCode":
							for ( var i = 0; i < this.arrStatusPros.length; i++)
								if (this.arrStatusPros[i].HeaderGuid == key) {
									var aStatuses = this.arrStatusPros[i].Statuses;
									for ( var k = 0; k < aStatuses.length; k++)
										if (input == aStatuses[k].UserStatusCode) {
											return aStatuses[k].UserStatusText;
											break;
										}
									break;
								}
						default:
							return input;
						}
					},

					unformatChangeLog : function(name, input, key) {
						var utilForm = cus.crm.salespipeline.sim.util.formatter;
						switch (name) {
						case "StartDate":
							return utilForm.revCLDate(input);
						case "ClosingDate":
							return utilForm.revCLDate(input);
						case "ExpectedSalesVolume":
							return utilForm.reverseNumbers(input);
						case "ForecastRelevance":
							if (input)
								return 'X';
							else
								return ' ';
						case "SalesStageCode":
							for ( var i = 0; i < this.arrStagesPros.length; i++)
								if (this.arrStagesPros[i].guidVal == key) {
									var aStages = this.arrStagesPros[i].Stages;
									for ( var k = 0; k < aStages.length; k++)
										if (input == aStages[k].SalesStageDescription) {
											return aStages[k].SalesStageCode;
											break;
										}
									break;
								}
						case "UserStatusCode":
							for ( var i = 0; i < this.arrStatusPros.length; i++)
								if (this.arrStatusPros[i].HeaderGuid == key) {
									var aStatuses = this.arrStatusPros[i].Statuses;
									for ( var k = 0; k < aStatuses.length; k++)
										if (input == aStatuses[k].UserStatusText) {
											return aStatuses[k].UserStatusCode;
											break;
										}
									break;
								}
						case "ChanceOfSuccess":
							var output = input.split("%");
							return output[0];
						}
					},

					// READ all the Services using BATCH - App Settings,
					// Periodicity Texts, Time Intervals, Year Ranges,
					// Currencies
					batchRead : function() {
						var that = this;
						var aReadOp = [
								this.oDataModel.createBatchOperation(
										"SalesPipelineSettings", "GET"),
								this.oDataModel.createBatchOperation(
										"PeriodicityTexts", "GET"),
								this.oDataModel.createBatchOperation(
										"TimeIntervals", "GET"),
								this.oDataModel.createBatchOperation(
										"YearRanges", "GET"),
								this.oDataModel.createBatchOperation(
										"Currencies", "GET"),
								this.oDataModel.createBatchOperation(
										"Opportunities", "GET"),
								this.oDataModel.createBatchOperation(
										"UserStatusCodes", "GET"),
								this.oDataModel.createBatchOperation(
										"SalesStages", "GET") ];
						this.oDataModel.addBatchReadOperations(aReadOp);
						this.oDataModel.setHeaders({
							"X-REQUESTED-WITH" : "XMLHttpRequest"
						});
						var fnSuccess = function(oData, oResponses) {
							var batchResults = oData.__batchResponses;
							// TODO: Change For Loop to Best Practice
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
									that.oAppSettings = currentData[0];
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
										for ( var l = 0, m = TimeIntervalsTemp.length; l < m; l += 2) {
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
										currentDate = cus.crm.salespipeline.sim.util.formatter
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
									var resultList = currentData;
									var appCurr = that.getView().getModel(
											"SalesPipelineSetting").oData.CurrencyCode;
									var maintCurrList = [];
									var iIgnoreOpp = 0;
									for ( var i = 0; i < resultList.length; i++)
										if (resultList[i].CurrencyCode != appCurr) {
											var bCheck = false;
											for ( var j = 0; j < maintCurrList.length; j++)
												if (maintCurrList[j] == resultList[i].CurrencyCode) {
													bCheck = true;
													break;
												}
											if (!bCheck)
												maintCurrList
														.push(resultList[i].CurrencyCode);
											iIgnoreOpp++;
											resultList.splice(i--, 1);
										}
									var msgA = null, msgB = null, msgValue = "";
									var i18nRB = that.oBundle;
									if (maintCurrList.length == 1) {
										if (iIgnoreOpp == 1)
											msgA = i18nRB
													.getText("LBL_ONE_CURR");
										else
											msgA = i18nRB.getText(
													"LBL_MULTI_CURR",
													iIgnoreOpp);
										msgValue += maintCurrList[0];
										msgB = i18nRB.getText(
												"LBL_MAINTAIN_CURR", msgValue);
									} else if (maintCurrList.length > 1) {
										msgA = i18nRB.getText("LBL_MULTI_CURR",
												iIgnoreOpp);
										var ctMinusOne = maintCurrList.length - 1;
										for ( var i = 0; i < ctMinusOne; i++)
											msgValue += maintCurrList[i] + ", ";
										msgValue += maintCurrList[ctMinusOne];
										msgB = i18nRB.getText(
												"LBL_MAINTAIN_CURR", msgValue);
									}
									if (maintCurrList.length > 0)
										/*
										 * sap.m.MessageToast.show(msgA + " " +
										 * msgB, { duration : 10000 });
										 */
										sap.ca.ui.message.showMessageBox({
											type : sap.ca.ui.message.Type.INFO,
											message : msgA + " " + msgB
										});
									jModel.setData(resultList);
									that.getView().setModel(jModel,
											"Opportunities");
									that.Opportunities = resultList;
									that.initChangedata();
									that.copyOpportunities("OpportunitiesOld");
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
												.push(item.BusinessTransactionCode);
									}
									break;
								}
							}
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						this.oDataModel.refreshSecurityToken();
						this.oDataModel.submitBatch(fnSuccess, fnError, false);
					},

					// Initialize the Change Log
					initChangedata : function() {
						this.changeData = {
							"discardcount" : 0,
							"changescount" : 0,
							"opportunity" : []
						};
						this.changeDataOld = {
							"discardcount" : 0,
							"changescount" : 0,
							"opportunity" : []
						};
						this.changelogModel = new sap.ui.model.json.JSONModel(
								this.changeData);
						if (!this.oFragmentList.changeLogDialog) {
							this.oFragmentList.changeLogDialog = new sap.ui.xmlfragment(
									'cus.crm.salespipeline.sim.view.changeLogDialog',
									this);
							this.oFragmentList.changeLogDialog.setModel(this
									.getView().getModel("i18n"), "i18n");
							if (sap.ui.Device.system.desktop
									|| sap.ui.Device.system.tablet)
								this.oFragmentList.changeLogDialog
										.setContentWidth("30em");
							if (sap.ui.version > "1.21.0") {
								var oCLDFL = this.oFragmentList.changeLogDialog
										.getContent()[0].getFooter()
										.getContentLeft();
								for ( var i = -1, oButton; oButton = oCLDFL[++i];)
									oButton.setWidth("32%");
							}
						}
						this.oFragmentList.changeLogDialog.setModel(
								this.changelogModel, "changeModel1");
						this.getView().setModel(this.changelogModel,
								"changeModel1");
					},

					// Updated the Change Log
					updateChangedData : function(key, index) {
						var oDataOpp = this.getView().getModel("Opportunities").oData;
						if (arguments.length == 1) {
							for ( var i = 0; i < oDataOpp.length; i++)
								if (oDataOpp[index].key == key)
									index = i;
						}
						var newopp = oDataOpp[index];
						var oldopp = {};
						var allOldOpp = this.getView().getModel(
								"OpportunitiesOld").oData;// newopp.AccountID
						for ( var obj in allOldOpp)
							if (allOldOpp[obj].Id == newopp.Id)
								oldopp = allOldOpp[obj];

						var opportunityObject = {
							"items" : [],
							"Name" : newopp.Description,
							"key" : newopp.Guid,
						// "oldStartDate" : oldopp.StartDate,
						// "oldEndDate" : oldopp.ClosingDate
						};
						var oEntry = {};
						var bIsOpportunityChanged = false;
						for ( var i = -1, oCP; oCP = this.aChangeablePropsTexts[++i];) {
							// To tackle null object
							bIsOpportunityChanged = false;
							if (newopp[oCP.property] == null
									|| oldopp[oCP.property] == null) {
								if (newopp[oCP.property] != oldopp[oCP.property])
									bIsOpportunityChanged = true;
							} else {
								if (oCP.property == "ExpectedSalesVolume") {
									newopp[oCP.property] = Math.round(
											newopp[oCP.property]).toFixed(2);
									oldopp[oCP.property] = Math.round(
											oldopp[oCP.property]).toFixed(2);
								}
								if (newopp[oCP.property].valueOf() != oldopp[oCP.property]
										.valueOf())
									bIsOpportunityChanged = true;
							}
							if (bIsOpportunityChanged) {
								switch (oCP.property) {
								case "ClosingDate":
									oEntry = {
										"checked" : false,
										"text" : oCP.property,
										"propertyText" : oCP.displayText,
										"OldValue" : this.formatChangeLog(
												oCP.property,
												oldopp[oCP.property],
												opportunityObject.key),
										"NewValue" : this.formatChangeLog(
												oCP.property,
												newopp[oCP.property],
												opportunityObject.key),
										"StartDate" : this.formatChangeLog(
												oCP.property,
												oldopp["StartDate"],
												opportunityObject.oldStartDate),
									};
									for ( var z = -1, oCurChangedProperty; oCurChangedProperty = opportunityObject.items[++z];)
										if (oCurChangedProperty.text == "StartDate") {
											oEntry.StartDate = oCurChangedProperty.NewValue;
											break;
										}
									break;
								default:
									oEntry = {
										"checked" : false,
										"text" : oCP.property,
										"propertyText" : oCP.displayText,
										"OldValue" : this.formatChangeLog(
												oCP.property,
												oldopp[oCP.property],
												opportunityObject.key),
										"NewValue" : this.formatChangeLog(
												oCP.property,
												newopp[oCP.property],
												opportunityObject.key)
									};
									break;
								}
								opportunityObject.items.push(oEntry);
							}
						}
						var bIsOppPresentInChangeLog = false;
						for ( var i = -1, oChangedOpp; oChangedOpp = this.changeData.opportunity[++i];)
							if (oChangedOpp.key == opportunityObject.key
									&& opportunityObject.items.length != 0) {
								if (opportunityObject.items.length > 0) {
									bIsOppPresentInChangeLog = true;
									this.changeData.changescount += opportunityObject.items.length
											- oChangedOpp.items.length;
									this.changeData.opportunity.splice(i, 1,
											opportunityObject);
								} else {
									this.changeData.changescount -= oChangedOpp.items.length;
									this.changeData.opportunity.splice(i, 1);
								}
								break;
							}

						if (!bIsOppPresentInChangeLog
								&& opportunityObject.items.length != 0) {
							this.changeData.opportunity.push(opportunityObject);
							this.changeData.changescount += opportunityObject.items.length;
						}
						this.getView().getModel("changeModel1").refresh();
						this.oFragmentList.changeLogDialog.getModel(
								"changeModel1").refresh();
					},

					// Load all application-specific Data
					loadData : function() {
						// this.LoadSalesPipelineSettings(false);
						// this.LoadPeriodicityTexts(false);
						// this.LoadTimeIntervals(false);
						// this.LoadYearRanges(false);
						// this.LoadCurrencyList(false);
						// this.LoadOpportunities(false);
						this.batchRead();
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
						var jMod = new sap.ui.model.json.JSONModel(settings);
						if (modelname == "SettingsForDisplay")
							jMod
									.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
						this.getView().setModel(jMod, modelname);
					},

					copyOpportunities : function(modelname) {
						/* Make copy from Odata for changes */
						var Opportunities = [];
						var oppModel = this.getView().getModel("Opportunities");
						if (oppModel != undefined) {
							jQuery.extend(true, Opportunities, oppModel.oData);
							var jMod = new sap.ui.model.json.JSONModel(
									Opportunities);
							this.getView().setModel(jMod, modelname);
						}
					},

					// Single Service READ - Application Settings
					LoadSalesPipelineSettings : function(bSync) {
						var that = this;
						this.oAppSettings = false;
						var fnSuccess = function(oData, oResponse) {
							oData.results[0].STP2 = that.viewType;
							var jMod = new sap.ui.model.json.JSONModel(
									oData.results[0]);
							that.getView().setModel(jMod,
									"SalesPipelineSetting");
							that.oAppSettings = oData.results[0];
							that.copysetting("SettingsForDisplay");
							var oChartSim = that.getView().byId("chart_sim");
							oChartSim
									.setMaxBubbleValue(oData.results[0].OpportunityMaxValue);
							oChartSim
									.setMinBubbleValue(oData.results[0].OpportunityMinValue);
							oChartSim
									.setBubbleStepValue(oData.results[0].OpportunityStepValue);
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
						that.Opportunities = false;
						var fnSuccess = function(oData, oResponse) {
							var resultList = oData.results;
							var appCurr = that.getView().getModel(
									"SalesPipelineSetting").oData.CurrencyCode;
							var maintCurrList = [];
							var iIgnoreOpp = 0;
							for ( var i = 0; i < resultList.length; i++)
								if (resultList[i].CurrencyCode != appCurr) {
									var bCheck = false;
									for ( var j = 0; j < maintCurrList.length; j++)
										if (maintCurrList[j] == resultList[i].CurrencyCode) {
											bCheck = true;
											break;
										}
									if (!bCheck)
										maintCurrList
												.push(resultList[i].CurrencyCode);
									iIgnoreOpp++;
									resultList.splice(i--, 1);
								}
							var msgA = null, msgB = null, msgValue = "", i18nRB = that.oBundle;
							if (maintCurrList.length == 1) {
								if (iIgnoreOpp == 1)
									msgA = i18nRB.getText("LBL_ONE_CURR");
								else
									msgA = i18nRB.getText("LBL_MULTI_CURR",
											iIgnoreOpp);
								msgValue += maintCurrList[0];
								msgB = i18nRB.getText("LBL_MAINTAIN_CURR",
										msgValue);
							} else if (maintCurrList.length > 1) {
								msgA = i18nRB.getText("LBL_MULTI_CURR",
										iIgnoreOpp);
								var ctMinusOne = maintCurrList.length - 1;
								for ( var i = 0; i < ctMinusOne; i++)
									msgValue += maintCurrList[i] + ", ";
								msgValue += maintCurrList[ctMinusOne];
								msgB = i18nRB.getText("LBL_MAINTAIN_CURR",
										msgValue);
							}
							if (maintCurrList.length > 0)
								/*
								 * sap.m.MessageToast.show(msgA + " " + msgB, {
								 * duration : 10000 });
								 */
								sap.ca.ui.message.showMessageBox({
									type : sap.ca.ui.message.Type.INFO,
									message : msgA + " " + msgB
								});
							var jMod = new sap.ui.model.json.JSONModel(
									resultList);
							that.getView().setModel(jMod, "Opportunities");
							that.Opportunities = resultList;
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						that.oDataModel.read("Opportunities", null, null,
								bSync, fnSuccess, fnError);
						that.initChangedata();
						that.copyOpportunities("OpportunitiesOld");
					},

					// Single Service READ - Time Intervals
					LoadTimeIntervals : function(bSync, peroidcity) {
						var that = this;
						var filter = null;
						if (peroidcity) {
							filter = [];
							filter[0] = "$filter=PeriodicityType eq '"
									+ peroidcity + "'";
						}
						var fnSuccess = function(oData, oResponse) {
							var TimeIntervalsTemp = oData.results;
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
							var jMod = new sap.ui.model.json.JSONModel(
									TimeIntervalsData);
							that.getView().setModel(jMod, "TimeIntervals");
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
									jMod.setData(TimeIntervals);
									that.getView().setModel(jMod,
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
								currentDate = cus.crm.salespipeline.sim.util.formatter
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
									jMod.setData(TimeIntervals);
									that.getView().setModel(jMod,
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

							that.getView().byId("name").setValue(
									sliderValues.value);
							that.getView().byId("name").setValue2(
									sliderValues.value2);
							jMod = new sap.ui.model.json.JSONModel(labelsValues);
							that.getView().setModel(jMod, "xLabelValues");
							jMod = new sap.ui.model.json.JSONModel(labelsTexts);
							that.getView().setModel(jMod, "xLabelTexts");
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						that.oDataModel.read("TimeIntervals", null, filter,
								bSync, fnSuccess, fnError);
					},

					// Single Service READ - Periodicity Texts
					LoadPeriodicityTexts : function(bSync) {
						var that = this;
						var fnSuccess = function(oData, oResponse) {
							var jMod = new sap.ui.model.json.JSONModel(
									oData.results);
							that.getView().setModel(jMod, "PeriodicityTexts");
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						that.oDataModel.read("PeriodicityTexts", null, null,
								bSync, fnSuccess, fnError);
					},

					// Single Service READ - Year Ranges
					LoadYearRanges : function(bSync) {
						var that = this;
						var fnSuccess = function(oData, oReponse) {
							var jMod = new sap.ui.model.json.JSONModel(
									oData.results);
							that.getView().setModel(jMod, "YearRanges");
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						that.oDataModel.read("YearRanges", null, null, true,
								fnSuccess, fnError);
					},

					// Single Service READ - Currencies
					LoadCurrencyList : function(bSync) {
						var that = this;
						var fnSuccess = function(oData, oResponse) {
							var jMod = new sap.ui.model.json.JSONModel(
									oData.results);
							that.getView().setModel(jMod, "CurrencyList");
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						that.oDataModel.read("Currencies", null, null, true,
								fnSuccess, fnError);
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

					// Progress Achievement for the Sales Representative
					calculateProgress : function() {
						var SalesSettings = this.getView().getModel(
								"SalesPipelineSetting").oData;
						var SalesPeriodBegin = SalesSettings.StartOfPeriod;
						var SalesPeriodEnd = SalesSettings.EndOfPeriod;
						var oppModel = this.getView().getModel("Opportunities");
						if (oppModel != undefined) {
							var Opportunites = oppModel.oData;
							var Percentage = 0.0;
							var Text = null;
							var utilForm = cus.crm.salespipeline.sim.util.formatter;
							var TotalActualRevenue = 0.0;
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
							Lb.addStyleClass("progressBarText");
							if (SalesSettings.SalesTarget > 0)
								Percentage = (TotalActualRevenue / SalesSettings.SalesTarget) * 100;
							Percentage = Math.round(Percentage);

							var valueA = utilForm.displayNumbersShort(Math
									.ceil(TotalActualRevenue));
							var valueB = utilForm.displayNumbersShort(Math
									.ceil(SalesSettings.SalesTarget));
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

					// START OF Footer Actions in Main View
					showSettings : function(oEvent) {
						if (!this.oFragmentList.settingsDialog) {
							this.oFragmentList.settingsDialog = new sap.ui.xmlfragment(
									"cus.crm.salespipeline.sim.view.settingsDialog",
									this);
							this.oFragmentList.settingsDialog.setModel(this
									.getView().getModel("i18n"), "i18n");
						}
						this.getView().byId("actSettings").openBy(
								oEvent.getSource());
					},

					showChangeLog : function(oEvent) {
						if (!this.oFragmentList.changeLogDialog) {
							this.oFragmentList.changeLogDialog = new sap.ui.xmlfragment(
									'cus.crm.salespipeline.sim.view.changeLogDialog',
									this);
							this.oFragmentList.changeLogDialog.setModel(this
									.getView().getModel("i18n"), "i18n");
							this.oFragmentList.changeLogDialog.setModel(this
									.getView().getModel("changeModel1"),
									"changeModel1");
						}

						// this.setDiscardButton();
						// this.setSelectAllCheckbox();
						this.setDiscardButton(this.changeData.discardcount);
						this.setSelectAllCheckbox(this.changeData.discardcount,
								this.changeData.changescount);
						/* if (this.changeData.changescount > 0) */
						/* this.getView().byId("changeLogDialog").open(); */
						this.oFragmentList.changeLogDialog.open();
						/*
						 * else sap.m.MessageToast.show(this.oBundle
						 * .getText("LBL_NOCHANGELOG"));
						 */
					},
					// END OF Footer Actions in Main View

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
						if (this.oFragmentList.SalesTargetDialog)
							this.oFragmentList.SalesTargetDialog.setModel(
									oSettingsSave, "SettingsForSave");
						this.oFragmentList.settingsDialog.open();
					},

					selectDlgSetting : function(oEvent) {
						this.oFragmentList.settingsDialog.close();
						var listSett = this.oFragmentList.settingsDialog
								.getContent()[0];
						if (listSett.getItems()[0].isSelected())
							this.oFragmentList.SalesTargetDialog.open();
						/*
						 * else if (listSett.getItems()[1].isSelected())
						 * this.getView().byId("dlOpportunitySet").open();
						 */
						listSett.getSelectedItem().setSelected(false);
					},

					closeAppSettDialog : function(oEvent) {
						this.oFragmentList.settingsDialog.close();
					},

					resetAllOpp : function(oEvent) {
						if (!this.oFragmentList.resetDialog) {
							this.oFragmentList.resetDialog = new sap.ui.xmlfragment(
									"cus.crm.salespipeline.sim.view.resetDialog",
									this);
							this.oFragmentList.resetDialog.setModel(this
									.getView().getModel("i18n"), "i18n");
							if (sap.ui.Device.system.desktop
									|| sap.ui.Device.system.tablet)
								this.oFragmentList.resetDialog
										.setContentWidth("30em");
						}
						this.isNavButtonClicked = !(this.getView().byId(
								"butReset") == oEvent.getSource());
						if (this.getView().byId("butSave").getVisible()) {
							this.oFragmentList.resetDialog.open();
							// Reset Dialog -- Disable text selection
							sap.ui.getCore().byId('RefreshDialog')
									.allowTextSelection(false);
						} else
							this._navBack();

					},

					// START OF DIALOG for Refresh
					refreshDlg : function(oEvent) {
						this.oFragmentList.resetDialog.close();
						if (sap.ui.getCore().byId("rfButOK") == oEvent
								.getSource()) {
							if (this.oNavParams.toOppApp != "")
								window.location = this.oNavParams.toOppApp;
							else if (this.oNavParams.toContactApp != "")
								window.location = this.oNavParams.toContactApp;
							else if (this.oNavParams.toAccountApp != "")
								window.location = this.oNavParams.toAccountApp;
							else if (this.oNavParams.telCall != "")
								sap.m.URLHelper
										.triggerTel(this.oNavParams.telCall);
							else if (this.oNavParams.sendMail != "")
								sap.m.URLHelper
										.triggerMail(this.oNavParams.sendMail);
							else if (!this.isNavButtonClicked) {
								// this.loadData();
								// this.calculateProgress();
								// this.initChangedata();
								this.LoadOpportunities(false);
								this.getView().getModel("Opportunities")
										.refresh();
								this.setMinMax();
								this.resetChangeLog();
								this.showTopNOpp();
							} else
								this._navBack();
						}
						this.oNavParams = {
							"toOppApp" : "",
							"toContactApp" : "",
							"toAccountApp" : "",
							"telCall" : "",
							"sendMail" : "",
						};
					},
					// END OF DIALOG for Refresh

					navBack : function(oEvent) {
						var oSettingsSave = this.getView().getModel(
								"SettingsForSave").oData;
						oSettingsSave["SalesTarget"] = this.oSalesSettings.SalesTarget;
						oSettingsSave["CurrencyCode"] = this.oSalesSettings.CurrencyCode;
						oSettingsSave["SalesTargetPeriodicity"] = this.oSalesSettings.SalesTargetPeriodicity;
						oSettingsSave["TimeFrom"] = this.oSalesSettings.TimeFrom;
						oSettingsSave["TimeTo"] = this.oSalesSettings.TimeTo;
						// if (sap.ui.getCore().byId("SPnavBack") ==
						// oEvent.oSource) {
						this.oFragmentList.SalesTargetDialog.close();
						this.oFragmentList.settingsDialog.open();
						// }
					},

					// Change in the YEARS of Timespan in Application Settings
					// of Sales Representative
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

					// Setting the Minimum & Maximum Opportunity Value to impose
					// UI restrictions so that it does not become unusable to
					// the Sales Representative
					setMinMax : function() {
						var oppModel = this.getView().getModel("Opportunities");
						if (oppModel != undefined) {
							var Opportunities = oppModel.oData;
							var expRevOpp = [];
							for ( var i = 0; i < Opportunities.length; i++)
								expRevOpp
										.push(parseFloat(Opportunities[i].ExpectedSalesVolume));

							expRevOpp.sort(function(a, b) {
								return a - b;
							});

							var chart = this.getView().byId("chart_sim");
							this.minOpp = 0.25 * expRevOpp[0];
							this.maxOpp = 3 * expRevOpp[Opportunities.length - 1];
							chart.setMinBubbleValue(this.minOpp);
							chart.setMaxBubbleValue(this.maxOpp);
						}
					},

					// Check the value entered in Input controls and reformat
					// them to the logon language of the Sales Representative
					checkValue : function(oEvent) {
						var oControl = oEvent.getSource(), utilForm = cus.crm.salespipeline.sim.util.formatter;
						var parsedNum = utilForm.reverseNumbers(oControl
								.getValue());
						oControl.setValue(utilForm.displayNumbers(parsedNum));
					},

					// Save Application Settings for Sales Representative
					saveAppSetChange : function(oEvent) {
						var that = this, oControl = oEvent.getSource();
						this.reRenderTopNSlider = true;
						var utilForm = cus.crm.salespipeline.sim.util.formatter;
						var oEntry = this.getView().getModel("SettingsForSave").oData;
						if (oControl == sap.ui.getCore().byId("spButSave")) {
							oEntry.TimeFrom = new Date(oEntry.TimeFrom);
							/*
							 * switch (dtType) { case "string": oEntry.TimeFrom =
							 * new Date(oEntry.TimeFrom); break; case "object":
							 * dateFrom = oEntry.TimeFrom.getFullYear();
							 * oEntry.TimeFrom = new Date(dateFrom, 0, 1);
							 * oEntry.TimeFrom = utilForm
							 * .convFromSixZeros(oEntry.TimeFrom); break;
							 * default: break; }
							 */
							oEntry.TimeTo = new Date(oEntry.TimeTo);
							/*
							 * switch (dtType) { case "string": oEntry.TimeTo =
							 * new Date(oEntry.TimeTo); break; case "object":
							 * dateTo = oEntry.TimeTo.getFullYear();
							 * oEntry.TimeTo = new Date(dateTo, 11, 31);
							 * oEntry.TimeTo = utilForm
							 * .convFromSixZeros(oEntry.TimeTo); break; default:
							 * break; }
							 */
							this.viewType = oEntry.STP2;
							delete oEntry.STP2;
							// var valST =
							// that.getView().byId("iST").getValue();
							var valST = sap.ui.getCore().byId("iST").getValue();
							oEntry.SalesTarget = utilForm.reverseNumbers(valST)
									+ ".0";

							var oParams = {};
							oParams.bMerge = false;
							oParams.fnSuccess = function() {
								if (sap.ui.getCore().byId("spButSave") == oControl)
									that.oFragmentList.SalesTargetDialog
											.close();
								/*
								 * sap.m.MessageToast.show(that.oBundle
								 * .getText("LBL_SUCCESSUPDATE"));
								 */
								sap.ca.ui.message.showMessageToast(that.oBundle
										.getText("LBL_SUCCESSUPDATE"));
								that.LoadSalesPipelineSettings(false);
								that.LoadOpportunities(false);
								that.setMinMax();
								that.LoadTimeIntervals(false, that.viewType);
								that.calculateProgress();
							};
							oParams.fnError = function(oError) {
								that.showErrorMsg(oError, false);
							};
							var updateUrl = "/SalesPipelineSettings('"
									+ oEntry.UserName + "')";
							this.oDataModel.update(updateUrl, oEntry, oParams);
						} else {
							oEntry["SalesTarget"] = this.oSalesSettings.SalesTarget;
							oEntry["CurrencyCode"] = this.oSalesSettings.CurrencyCode;
							oEntry["SalesTargetPeriodicity"] = this.oSalesSettings.SalesTargetPeriodicity;
							oEntry["TimeFrom"] = this.oSalesSettings.TimeFrom;
							oEntry["TimeTo"] = this.oSalesSettings.TimeTo;
							this.oFragmentList.SalesTargetDialog.close();
						}
					},

					// Cancel of SAVE in Application Settings of Sales
					// Representative
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
							this.oFragmentList.SalesTargetDialog.close();
					},

					/*
					 * settCheck : function(oEvent) { var settingModel =
					 * this.getView().getModel( "SettingsForSave"); var
					 * settingVal = settingModel.oData; var utilForm =
					 * cus.crm.salespipeline.sim.util.formatter; var dateFromVal =
					 * new Date(settingVal.TimeFrom .getFullYear(), 0, 1); var
					 * dateToVal = new Date(settingVal.TimeTo .getFullYear(),
					 * 11, 31); dateToVal =
					 * utilForm.convFromSixZeros(dateToVal); dateFromVal =
					 * utilForm.convFromSixZeros(dateFromVal); if
					 * (String(dateFromVal) != String(settingVal.TimeFrom))
					 * settingVal.TimeFrom = dateFromVal;
					 * 
					 * if (String(dateToVal) != String(settingVal.TimeTo))
					 * settingVal.TimeTo = dateToVal;
					 * settingModel.setData(settingVal); },
					 */
					// END OF DIALOGS for APP Settings
					// START OF DIALOG for Change Log
					onDiscardAllChecked : function(oEvent) {
						this.changeData.discardcount = 0;
						for ( var i = -1, oChangedOpp; oChangedOpp = this.changeData.opportunity[++i];)
							for ( var j = -1, oCurItem; oCurItem = oChangedOpp.items[++j];) {
								oCurItem.checked = oEvent
										.getParameter('selected');
								if (oCurItem.checked)
									this.changeData.discardcount += 1;
							}
						this.setDiscardButton(this.changeData.discardcount);
						this.getView().getModel("changeModel1").refresh();
						this.oFragmentList.changeLogDialog.getModel(
								"changeModel1").refresh();
						this.getView().getModel("Opportunities").refresh();
					},

					onDiscardChecked : function(oEvent) {
						if (oEvent.getParameter('selected'))
							this.changeData.discardcount += 1;
						else
							this.changeData.discardcount -= 1;
						this.setDiscardButton(this.changeData.discardcount);
						this.setSelectAllCheckbox(this.changeData.discardcount,
								this.changeData.changescount);
						this.getView().getModel("changeModel1").refresh();
						this.oFragmentList.changeLogDialog.getModel(
								"changeModel1").refresh();
					},

					setDiscardButton : function(iDiscardCount) {
						var sDiscardText = this.oBundle
								.getText("BTN_CL_DISCARD"), sSaveText = this.oBundle
								.getText("BTN_SAVE_OPPORT");
						var btnDiscard = sap.ui.getCore().byId("discardBtn"), btnSave = sap.ui
								.getCore().byId("saveBtn");
						if (iDiscardCount > 0) {
							sDiscardText = this.oBundle
									.getText("BTN_CL_DISCARDSEL")
									+ " (" + iDiscardCount + ")";
							sSaveText += " (" + iDiscardCount + ")";
							btnDiscard.setEnabled(true);
							btnSave.setEnabled(true);
						} else {
							btnDiscard.setEnabled(false);
							btnSave.setEnabled(false);
						}
						btnDiscard.setText(sDiscardText);
						btnSave.setText(sSaveText);
					},

					setSelectAllCheckbox : function(iDiscardCount, iChangeCount) {
						// var changeList = this.getView().byId("cbAllChanges");
						var changeList = sap.ui.getCore().byId("cbAllChanges");
						if (iChangeCount == 0) {
							changeList.setEnabled(false);
							changeList.setSelected(false);
							return;
						} else
							changeList.setEnabled(true);

						if (iDiscardCount < iChangeCount)
							changeList.setSelected(false);
						else
							changeList.setSelected(true);
					},

					resetChangeLog : function() {
						for ( var i = this.changeData.opportunity.length - 1; i >= 0; i--)
							this.changeData.opportunity.splice(i, 1);
						this.changeData.changescount = 0;
						this.changeData.discardcount = 0;
						this.setDiscardButton(this.changeData.discardcount);
						this.setSelectAllCheckbox(this.changeData.discardcount,
								this.changeData.changescount);
						this.getView().getModel("changeModel1").refresh();
						this.oFragmentList.changeLogDialog.getModel(
								"changeModel1").refresh();
						this.getView().getModel("Opportunities").refresh();
					},

					resetChangeLog2 : function() {
						for ( var i = this.changeData.opportunity.length - 1; i >= 0; i--) {
							for ( var j = this.changeData.opportunity[i].items.length - 1; j >= 0; j--)
								if (this.changeData.opportunity[i].items[j].checked == true)
									this.changeData.opportunity[i].items
											.splice(j, 1);

							if (this.changeData.opportunity[i].items.length == 0)
								this.changeData.opportunity.splice(i, 1);
						}

						/*
						 * if (this.getView().byId("cbAllChanges").getSelected() ==
						 * true) this.getView().byId("changeLogDialog").close();
						 */
						if (sap.ui.getCore().byId("cbAllChanges").getSelected() == true)
							this.oFragmentList.changeLogDialog.close();

						this.changeData.changescount -= this.changeData.discardcount;
						this.changeData.discardcount = 0;
						this.setDiscardButton(this.changeData.discardcount);
						this.setSelectAllCheckbox(this.changeData.discardcount,
								this.changeData.changescount);
						this.getView().getModel("changeModel1").refresh();
						this.oFragmentList.changeLogDialog.getModel(
								"changeModel1").refresh();
						this.getView().getModel("Opportunities").refresh();
					},

					onDiscard : function() {
						var originalData = this.getView().getModel(
								"Opportunities").oData;
						for ( var i = -1, oCurrentOpp; oCurrentOpp = this.changeData.opportunity[++i];) {
							for ( var j = oCurrentOpp.items.length, oCurOppItem; oCurOppItem = oCurrentOpp.items[--j];)
								if (oCurOppItem.checked == true) {
									for ( var k = -1, oOriginalOpp; oOriginalOpp = originalData[++k];)
										if (oOriginalOpp.Guid == oCurrentOpp.key)
											oOriginalOpp[oCurOppItem.text] = this
													.unformatChangeLog(
															oCurOppItem.text,
															oCurOppItem.OldValue,
															oCurrentOpp.key);
									oCurrentOpp.items.splice(j, 1);
								}
							if (oCurrentOpp.items.length == 0)
								this.changeData.opportunity.splice(i, 1);
						}

						if (sap.ui.getCore().byId("cbAllChanges").getSelected() == true)
							sap.ui.getCore().byId("changeLogDialog").close();

						this.changeData.changescount -= this.changeData.discardcount;
						this.changeData.discardcount = 0;
						// this.setDiscardButton();
						// this.setSelectAllCheckbox();
						this.setDiscardButton(this.changeData.discardcount);
						this.setSelectAllCheckbox(this.changeData.discardcount,
								this.changeData.changescount);
						this.getView().getModel("changeModel1").refresh();
						this.oFragmentList.changeLogDialog.getModel(
								"changeModel1").refresh();
						this.getView().getModel("Opportunities").refresh();
						this.calculateProgress();
					},

					// Dialog Box Cancel Button
					onClose : function() {
						for ( var i = 0; i < this.changeData.opportunity.length; i++)
							for ( var j = 0; j < this.changeData.opportunity[i].items.length; j++)
								this.changeData.opportunity[i].items[j].checked = false;
						this.changeData.discardcount = 0;
						this.setDiscardButton(this.changeData.discardcount);
						/*
						 * this.getView().byId("cbAllChanges").setSelected(false);
						 * this.getView().byId("changeLogDialog").close();
						 */
						sap.ui.getCore().byId("cbAllChanges")
								.setSelected(false);
						this.oFragmentList.changeLogDialog.close();

						this.getView().getModel("changeModel1").refresh();
						this.oFragmentList.changeLogDialog.getModel(
								"changeModel1").refresh();
					},
					// END OF DIALOG for Change Log

					// DUAL SLIDER Control
					dualsliderchange : function() {
						var chart = this.getView().byId("chart_sim");
						var value = arguments[0].getParameter("value");
						var value2 = arguments[0].getParameter("value2");
						var units = this.getView().byId("name").getUnits();
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

					onPeriodicityChange : function(oEvent) {
						this.LoadTimeIntervals(true, oEvent.getSource()
								.getSelectedKey());
						this.reRenderTopNSlider = true;
					},
					bubblechange : function(oEvent) {
						var Opportunites = this.getView().getModel(
								"Opportunities").oData;

						for ( var i = 0; i < Opportunites.length; i++)
							if (Opportunites[i].Guid == oEvent
									.getParameter('item')['key']) {
								if (oEvent.getParameter('item')['z']) {
									Opportunites[i].ExpectedSalesVolume = oEvent
											.getParameter('item')['z'];
								} else {
									Opportunites[i].ChanceOfSuccess = oEvent
											.getParameter('item')['y'];
									Opportunites[i].ClosingDate = oEvent
											.getParameter('item')['x'];
								}
								this.updateChangedData(oEvent
										.getParameter('item')['key'], i);
							}
						var jMod = new sap.ui.model.json.JSONModel(Opportunites);
						this.getView().setModel(jMod, "Opportunities");
						this.calculateProgress();
					},

					// Opportunity Click
					bubbleclick : function(oEvent) {
						this.iChangeStartDate = 0;
						this.iChangeEndDate = 0;

						// var ec = this.getView().byId("po");
						var ec = this.oFragmentList.opportunityPopover;
						ec.close();
						var oModel = this.oDataModel;
						oModel.setCountSupported(false);
						var opp = this.getView().getModel("Opportunities").oData;
						this.guidVal = oEvent.getParameter('item').key;
						var that = this;
						var pType, pStageCode, pForecast, pSuccess, pStatusCode, pCurrCode, pAccountName;
						var pExpRev, oppSalesTeam, pOppId, pOppDescription, pEmpRespName, pContactname, pContactId;

						// that.getView().byId("mainContact").setVisible(false);
						// that.getView().byId("empResp").setVisible(false);
						sap.ui.getCore().byId("mainContact").setVisible(false);
						sap.ui.getCore().byId("empResp").setVisible(false);

						var Actualopp = this.getView().getModel(
								"OpportunitiesOld").oData;

						for ( var i = 0; i < opp.length; i++) {
							if (Actualopp[i].Guid === this.guidVal) {
								this.actualStartDate = Actualopp[i].StartDate;
								this.actualEndDate = Actualopp[i].ClosingDate;
								this.actualExpRevval = Actualopp[i].ExpectedSalesVolume;
							}
							if (opp[i].Guid === this.guidVal) {
								this.selOpp = opp[i];
								pStatusCode = this.selOpp.UserStatusCode;
								pStageCode = this.selOpp.SalesStageCode;
								pType = this.selOpp.ProcessType;
								pCurrCode = this.selOpp.CurrencyCode;
								pEmpRespName = this.selOpp.EmployeeName;
								pContactname = this.selOpp.ContactPersonName;
								pContactId = this.selOpp.ContactPersonID;
								pAccountName = this.selOpp.AccountName;
								this.pAccountId = this.selOpp.AccountID;
								this.pContactId = this.selOpp.ContactPersonID;
								pOppId = this.selOpp.Id;
								pOppDescription = this.selOpp.Description;
								break;
							}
						}

						// that.getView().byId("OppId").setText(pOppId);
						// that.getView().byId("OppDescription").setText(
						// pOppDescription);
						sap.ui.getCore().byId("OppId").setText(pOppId);
						sap.ui.getCore().byId("OppDescription").setText(
								pOppDescription);

						// Currency text
						var currCode = " (" + pCurrCode + ")";
						// var LBexpRev = that.getView().byId("lblExpRev");
						// var LBwgtRev = that.getView().byId("lblWgtRev");
						var LBexpRev = sap.ui.getCore().byId("lblExpRev");
						var LBwgtRev = sap.ui.getCore().byId("lblWgtRev");
						LBexpRev.setText(this.oBundle
								.getText("LBL_OD_EXPECTEDREVENUE")
								+ currCode);
						LBwgtRev.setText(this.oBundle
								.getText("LBL_OD_WEIGHTEDREVENUE")
								+ currCode);

						var oppRead = [
								oModel
										.createBatchOperation(
												"OpportunityStatuses?$filter="
														+ jQuery.sap
																.encodeURL("HeaderGuid eq guid'"
																		+ this.guidVal
																		+ "'"),
												"GET"),
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
						this.selOpp.StatusEmpty = true;
						this.selOpp.SalesStageEmpty = true;
						var fnS2 = function(odata, response) {
							var batchResults = odata.__batchResponses;
							for ( var i = 0; i < batchResults.length; i++) {
								if (parseInt(batchResults[i].statusCode) !== 200) {
									that.showErrorMsg(batchResults[i], true);
									break;
								} else
									switch (i) {
									case 0:
										var statusModel = new sap.ui.model.json.JSONModel(
												batchResults[i].data.results);
										// var statuses1 = that.getView().byId(
										// "status1");
										var statuses1 = sap.ui.getCore().byId(
												"status1");
										statuses1.setModel(statusModel,
												"StatusMgt");
										var objStatusProfile = null, bCheck = false;
										for ( var j = -1, oCurStatus; oCurStatus = that.arrStatusPros[++j];)
											if (batchResults[i].data.results[0].HeaderGuid == oCurStatus.HeaderGuid) {
												bCheck = true;
												break;
											}
										if (!bCheck) {
											objStatusProfile = new Object(
													{
														"HeaderGuid" : batchResults[i].data.results[0].HeaderGuid,
														"StatusProfile" : batchResults[i].data.results[0].StatusProfile,
														"Statuses" : batchResults[i].data.results
													});
											that.arrStatusPros
													.push(objStatusProfile);
										}
										var aItemList = null;
										for ( var j = -1; aItemList = statuses1
												.getItems()[++j];)
											if (aItemList.getKey() == pStatusCode) {
												that.selOpp.StatusEmpty = false;
												break;
											}
										if (that.selOpp.StatusEmpty)
											statuses1.setSelectedItem(statuses1
													.getItems()[0]);
										else
											statuses1
													.setSelectedItem(aItemList);
										// NOT WORKING several times
										// statuses1.setSelectedKey(pStatusCode);

										break;
									case 1:
										var StagesModel = new sap.ui.model.json.JSONModel(
												batchResults[i].data.results);
										// var stages = that.getView().byId(
										// "salesStage1");
										var stages = sap.ui.getCore().byId(
												"salesStage1");
										stages
												.setModel(StagesModel,
														"SalesOpp");
										var objStagesProfile = null, bCheck = false;
										for ( var j = -1, oCurStage; oCurStage = that.arrStagesPros[++j];)
											if (that.guidVal == oCurStage.guidVal) {
												bCheck = true;
												break;
											}
										if (!bCheck) {
											objStagesProfile = new Object(
													{
														"guidVal" : that.guidVal,
														"ProcessType" : batchResults[i].data.results[0].ProcessType,
														"Stages" : batchResults[i].data.results
													});
											that.arrStagesPros
													.push(objStagesProfile);
										}
										var aItemList = null;
										for ( var j = -1; aItemList = stages
												.getItems()[++j];)
											if (aItemList.getKey() == pStageCode) {
												that.selOpp.SalesStageEmpty = false;
												break;
											}
										if (that.selOpp.SalesStageEmpty)
											stages.setSelectedItem(stages
													.getItems()[0]);
										else
											stages.setSelectedItem(aItemList);
										// NOT WORKING several times
										// stages.setSelectedKey(pStageCode);
										break;
									case 2:
										oppSalesTeam = batchResults[i].data.SalesTeam.results;
										break;
									}
							}
						};
						var fnE2 = function(oError) {
							that.showErrorMsg(oError, true);
						};
						oModel.submitBatch(fnS2, fnE2, false);

						var utilForm = cus.crm.salespipeline.sim.util.formatter;
						// switch value for forecast relevance
						// if (this.selOpp.ForecastRelevance == "X")
						// that.getView().byId("forecastId").setState(true);
						// else if (this.selOpp.ForecastRelevance == "")
						// that.getView().byId("forecastId").setState(false);
						if (this.selOpp.ForecastRelevance == "X")
							sap.ui.getCore().byId("forecastId").setState(true);
						else if (this.selOpp.ForecastRelevance == "")
							sap.ui.getCore().byId("forecastId").setState(false);

						// Chance of Success
						var x = parseFloat(this.selOpp.ChanceOfSuccess) + "%";
						// that.getView().byId("chanceOfSucc").setValue(x);
						sap.ui.getCore().byId("chanceOfSucc").setValue(x);

						// Start date
						var d1 = new Date(this.selOpp.StartDate.toDateString());
						// that.getView().byId("d1").setValue(
						// utilForm.displayDates(d1));
						// that.getView().byId("calStart").setCurrentDate(
						// d1.toDateString());
						sap.ui.getCore().byId("d1").setValue(
								utilForm.displayDates(d1));
						sap.ui.getCore().byId("calStart").setCurrentDate(
								d1.toDateString());

						// End date
						var d2 = new Date(this.selOpp.ClosingDate
								.toDateString());
						// that.getView().byId("d2").setValue(
						// utilForm.displayDates(d2));
						// that.getView().byId("calEnd").setCurrentDate(
						// d2.toDateString());
						sap.ui.getCore().byId("d2").setValue(
								utilForm.displayDates(d2));
						sap.ui.getCore().byId("calEnd").setCurrentDate(
								d2.toDateString());

						// Expected Revenue
						// var expRev = that.getView().byId("expRevId");
						var expRev = sap.ui.getCore().byId("expRevId");
						expRev.setValue(utilForm.displayNumbers(Math
								.round(this.selOpp.ExpectedSalesVolume)));

						// Weighted revenue
						var wtRevVal = (this.selOpp.ExpectedSalesVolume * this.selOpp.ChanceOfSuccess) / 100;
						// that.getView().byId("wgtRevId").setValue(
						// utilForm.displayNumbers(wtRevVal));
						sap.ui.getCore().byId("wgtRevId").setValue(
								utilForm.displayNumbers(wtRevVal));

						// Sales Team data
						if (oppSalesTeam != undefined) {
							for ( var i = -1, oCurST; oCurST = oppSalesTeam[++i];) {
								switch (parseInt(oCurST.PartnerFuntionCode)) {
								case 14:
									sap.ui.getCore().byId("empResp")
											.setVisible(true);
									sap.ui.getCore().byId("empRespName")
											.setText(oCurST.PartnerName);
									if (oCurST.Email != undefined
											&& oCurST.Email != "") {
										var oEREmail = sap.ui.getCore().byId(
												"empRespEmail");
										oEREmail.setVisible(true);
										oEREmail.setText(oCurST.Email);
									}
									if (oCurST.Telephone != undefined
											&& oCurST.Telephone != "") {
										var oERPhone = sap.ui.getCore().byId(
												"empRespPhone");
										oERPhone.setVisible(true);
										oERPhone.setText(oCurST.Telephone);
									}
									break;
								case 15:
									sap.ui.getCore().byId("mainContact")
											.setVisible(true);
									sap.ui.getCore().byId("mainContactName")
											.setText(oCurST.PartnerName);
									if (oCurST.Email != undefined
											&& oCurST.Email != "") {
										var oMCEmail = sap.ui.getCore().byId(
												"mcEmail");
										oMCEmail.setVisible(true);
										oMCEmail.setText(oCurST.Email);
									}
									if (oCurST.Telephone != undefined
											&& oCurST.Telephone != "") {
										var oMCPhone = sap.ui.getCore().byId(
												"mcPhone");
										oMCPhone.setVisible(true);
										oMCPhone.setText(oCurST.Telephone);
									}
									break;
								default:
									break;
								}
							}
						}

						// that.getView().byId("accName").setText(pAccountName);
						sap.ui.getCore().byId("accName").setText(pAccountName);
						that.selectedbubble = oEvent.getParameter('item').key;
						if (sap.ui.Device.system.phone) {
							// that.getView().byId("upBtn").setVisible(true);
							// that.getView().byId("downBtn").setVisible(true);
							sap.ui.getCore().byId("upBtn").setVisible(true);
							sap.ui.getCore().byId("downBtn").setVisible(true);
						} else {
							that.overlappingBubbles = oEvent
									.getParameter('item').overlappedbubbles;
							var titleOpp = sap.ui.getCore().byId("poBar");
							if (that.overlappingBubbles.length > 1) {
								// that.getView().byId("upBtn").setVisible(true);
								// that.getView().byId("downBtn").setVisible(true);
								// titleOpp.addContentLeft(that.getView().byId(
								// "oppDetails"));
								sap.ui.getCore().byId("upBtn").setVisible(true);
								sap.ui.getCore().byId("downBtn").setVisible(
										true);
								titleOpp.addContentLeft(sap.ui.getCore().byId(
										"oppDetails"));
								titleOpp.removeAllContentMiddle();
							} else {
								// that.getView().byId("upBtn").setVisible(false);
								// that.getView().byId("downBtn")
								// .setVisible(false);
								// titleOpp.addContentMiddle(that.getView().byId(
								// "oppDetails"));
								sap.ui.getCore().byId("upBtn")
										.setVisible(false);
								sap.ui.getCore().byId("downBtn").setVisible(
										false);
								titleOpp.addContentMiddle(sap.ui.getCore()
										.byId("oppDetails"));
								titleOpp.removeAllContentLeft();
							}
						}

						/**
						 * @ControllerHook Provision for Additional Fields in
						 *                 the Opportunity Popover. If you need
						 *                 to display the additional fields
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

					cancelChangeOpp : function() {
						// this.getView().byId("po").close();
						this.oFragmentList.opportunityPopover.close();
					},

					moveUp : function() {
						var that = this;
						var nameVal = this.getView().byId("name");
						var value = nameVal.getValue();
						var value2 = nameVal.getValue2();
						var units = nameVal.getUnits();
						var FilteredOpportunites = [];
						var labelsTexts = [];
						var labelsValues = [];
						var startDate = null;
						var endDate = null;
						var chart = this.getView().byId("chart_sim");
						var index = 0;
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
										&& (Opportunites[i].ClosingDate <= endDate)) {
									FilteredOpportunites.push(Opportunites[i]);
								}

							for ( var i = 0; i < FilteredOpportunites.length; i++)
								if (FilteredOpportunites[i].Guid === that.selectedbubble) {
									index = i + 1;
									if (index >= FilteredOpportunites.length)
										index = 0;
								}
							chart
									.setSelection(FilteredOpportunites[index].Guid);
						} else {
							for ( var i = 0; i < that.overlappingBubbles.length; i++)
								if (that.overlappingBubbles[i].id === that.selectedbubble) {
									index = i + 1;
									if (index >= that.overlappingBubbles.length)
										index = 0;
								}
							chart
									.setSelection(that.overlappingBubbles[index].id);
						}
					},

					moveDown : function() {
						var that = this;
						var value = this.getView().byId("name").getValue();
						var value2 = this.getView().byId("name").getValue2();
						var units = this.getView().byId("name").getUnits();
						var FilteredOpportunites = [];
						var labelsTexts = [];
						var labelsValues = [];
						var startDate = null;
						var endDate = null;

						var timeinterval = this.getView().getModel(
								"TimeIntervals");
						var Opportunites = this.getView().getModel(
								"Opportunities").oData;
						var chart = this.getView().byId("chart_sim");
						var index = 0;
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
										&& (Opportunites[i].ClosingDate <= endDate)) {
									FilteredOpportunites.push(Opportunites[i]);
								}
							for ( var i = 0; i < FilteredOpportunites.length; i++)
								if (FilteredOpportunites[i].Guid === that.selectedbubble) {
									index = i - 1;
									if (index < 0)
										index = FilteredOpportunites.length - 1;
								}

							chart
									.setSelection(FilteredOpportunites[index].Guid);
						} else {
							for ( var i = 0; i < that.overlappingBubbles.length; i++)
								if (that.overlappingBubbles[i].id === that.selectedbubble) {
									index = i - 1;
									if (index < 0)
										index = that.overlappingBubbles.length - 1;
								}
							chart
									.setSelection(that.overlappingBubbles[index].id);
						}
					},

					// Apply all changes made in the Opportunity Popover to the
					// bubble and register the changes in Change Log
					submitChangeOpp : function(oEvent) {
						var Opportunites = this.getView().getModel(
								"Opportunities").oData;
						// var pExpRev = that.getView().byId("expRevId")
						// .getValue();

						var pExpRev = sap.ui.getCore().byId("expRevId")
								.getValue();
						for ( var i = 0; i < Opportunites.length; i++) {
							if (Opportunites[i].Guid == this.guidVal) {
								if (this.iChangeStartDate == 1)
									Opportunites[i].StartDate = this.currStartDate;
								if (this.iChangeEndDate == 1)
									Opportunites[i].ClosingDate = this.currEndDate;
								if (this.iChangeCOS == 0) {
									Opportunites[i].ChanceOfSuccess = parseFloat(this
											.unformatChangeLog(
													"ChanceOfSuccess",
													// that.getView().byId(
													// "chanceOfSucc")
													// .getValue()));
													sap.ui.getCore().byId(
															"chanceOfSucc")
															.getValue()));
								}
								if (this.compose(pExpRev) != this.actualExpRevval
										&& this.iChangeExpRev == 0) {
									if (isNaN(this.compose(pExpRev)))
										Opportunites[i].ExpectedSalesVolume = this.actualExpRevval;
									else
										Opportunites[i].ExpectedSalesVolume = this
												.compose(pExpRev);
								} else
									this.selOpp.ExpectedSalesVolume = this.actualExpRevval;

								if (!this.selOpp.SalesStageEmpty)
									Opportunites[i].SalesStageCode = sap.ui
											.getCore().byId("salesStage1")
											.getSelectedKey();

								if (!this.selOpp.StatusEmpty)
									Opportunites[i].UserStatusCode = sap.ui
											.getCore().byId("status1")
											.getSelectedKey();

								if (sap.ui.getCore().byId("forecastId")
										.getState())
									Opportunites[i].ForecastRelevance = "X";
								else
									Opportunites[i].ForecastRelevance = "";

								this.updateChangedData(this.guidVal, i);
								// this.getView().byId("po").close();
								this.oFragmentList.opportunityPopover.close();
								this.getView().getModel("Opportunities")
										.refresh();
								this.calculateProgress();
							}
						}

					},

					// Save all the changed Opportunities using BATCH operation
					// and commit them to the CRM backend
					saveAllOpp : function() {
						var that = this, isDateValid = true, endDateErrorOpportunities = [], item = {};
						var fnSuccess = function(oResponses) {
							sap.ca.ui.message.showMessageToast(that.oBundle
									.getText("LBL_SUCCESSUPDATE"));

							that.LoadOpportunities(false);
							that.getView().getModel("Opportunities").refresh();
							that.setMinMax();
							that.resetChangeLog();
							that.showTopNOpp();
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, false);
						};
						for ( var i = 0; i < this.changeData.opportunity.length; i++) {
							// isDateValid = true;
							var oppCount = 0;
							var oEntry = new Object({
								"Guid" : "",
							});
							for ( var j = 0; j < this.changeData.opportunity[i].items.length; j++) {
								var changedData = this.changeData.opportunity[i].items[j];
								if ("UserStatusCode" == this.changeData.opportunity[i].items[j].text) {
									var oStatusEntry = new Object({
										"HeaderGuid" : "",
										"StatusProfile" : "",
										"UserStatusCode" : ""
									});
									oStatusEntry.HeaderGuid = this.changeData.opportunity[i].key;
									for ( var k = 0; k < that.arrStatusPros.length; k++)
										if (that.arrStatusPros[k].HeaderGuid == oStatusEntry.HeaderGuid) {
											oStatusEntry.StatusProfile = that.arrStatusPros[k].StatusProfile;
											break;
										}
									oStatusEntry.UserStatusCode = this
											.unformatChangeLog(
													changedData.text,
													changedData.NewValue,
													oStatusEntry.HeaderGuid);

									var statusUpdateUrl = "/OpportunityStatuses(StatusProfile='"
											+ oStatusEntry.StatusProfile
											+ "',UserStatusCode='"
											+ oStatusEntry.UserStatusCode
											+ "',HeaderGuid=guid'"
											+ oStatusEntry.HeaderGuid + "')";
									this.oDataModel
											.addBatchChangeOperations([ this.oDataModel
													.createBatchOperation(
															statusUpdateUrl,
															"MERGE",
															oStatusEntry, null) ]);
									continue;
								} else if (oppCount == 0) {
									oEntry.Guid = this.changeData.opportunity[i].key;
									oppCount++;
								}
								switch (this.changeData.opportunity[i].items[j].text) {
								case "ChanceOfSuccess":
									oEntry.ChanceOfSuccess = this
											.unformatChangeLog(
													changedData.text,
													changedData.NewValue);
									break;
								case "ClosingDate":
									if (typeof changedData.NewValue === "string") {
										var newEndDate = this
												.unformatChangeLog(
														"ClosingDate",
														changedData.NewValue,
														this.changeData.opportunity[i].key);
										var oldStartDate = this
												.unformatChangeLog(
														"ClosingDate",
														changedData.StartDate,
														this.changeData.opportunity[i].key);
										if (newEndDate < oldStartDate) {
											isDateValid = false;
											item = {};
											item["opportunityName"] = this.changeData.opportunity[i].Name;
											item["opportunityKey"] = this.changeData.opportunity[i].key;

											endDateErrorOpportunities
													.push(item);
										} else {
											oEntry.ClosingDate = this
													.unformatChangeLog(
															changedData.text,
															changedData.NewValue);
										}
									}
									break;
								case "StartDate":
									if (typeof changedData.NewValue === "string") {
										oEntry.StartDate = this
												.unformatChangeLog(
														changedData.text,
														changedData.NewValue);
									}
									break;
								case "ExpectedSalesVolume":
									oEntry.ExpectedSalesVolume = this
											.unformatChangeLog(
													changedData.text,
													changedData.NewValue)
											+ ".0";
									oEntry.CurrencyCode = this.getView()
											.getModel("SalesPipelineSetting").oData.CurrencyCode;
									break;
								case "ForecastRelevance":
									oEntry.ForecastRelevance = this
											.unformatChangeLog(
													changedData.text,
													changedData.NewValue);
									break;
								case "SalesStageCode":
									oEntry.SalesStageCode = this
											.unformatChangeLog(
													changedData.text,
													changedData.NewValue,
													oEntry.Guid);
									break;
								}
								changedData = null;
							}

							if (isDateValid)
								if (oEntry.Guid != "") {
									var updateUrl = "/Opportunities(guid'"
											+ oEntry.Guid + "')";
									this.oDataModel
											.addBatchChangeOperations([ this.oDataModel
													.createBatchOperation(
															updateUrl, "MERGE",
															oEntry, null) ]);
								}
						}

						if (isDateValid) {
							this.oDataModel.setHeaders({
								"X-REQUESTED-WITH" : "XMLHttpRequest"
							});
							this.oDataModel.submitBatch(fnSuccess, fnError,
									false);
						} else {
							var errorMessage = this.oBundle
									.getText("LBL_ENDDATE_ERROR_LOPP")
									+ ": \n\n";
							for ( var i = 0; i < endDateErrorOpportunities.length; i++)
								errorMessage += endDateErrorOpportunities[i].opportunityName
										+ "\n";

							sap.ca.ui.message.showMessageBox({
								type : sap.ca.ui.message.Type.WARNING,
								message : errorMessage
							});
						}
					},

					changeLogSave : function() {
						var that = this, isDateValid = true, endDateErrorOpportunities = [], item = {};
						var fnSuccess = function(oResponses) {
							sap.ca.ui.message.showMessageToast(that.oBundle
									.getText("LBL_SUCCESSUPDATE"));
							// that.getView().getModel("Opportunities").refresh();
							that.setMinMax();
							that.resetChangeLog2();
							that.showTopNOpp();
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, false);
						};
						for ( var i = 0; i < this.changeData.opportunity.length; i++) {
							var oppCount = 0;
							var oEntry = new Object({
								"Guid" : "",
							});
							for ( var j = 0; j < this.changeData.opportunity[i].items.length; j++) {
								if (this.changeData.opportunity[i].items[j].checked == true) {
									var changedData = this.changeData.opportunity[i].items[j];
									if ("UserStatusCode" == this.changeData.opportunity[i].items[j].text) {
										var oStatusEntry = new Object({
											"HeaderGuid" : "",
											"StatusProfile" : "",
											"UserStatusCode" : ""
										});
										oStatusEntry.HeaderGuid = this.changeData.opportunity[i].key;
										for ( var k = 0; k < that.arrStatusPros.length; k++)
											if (that.arrStatusPros[k].HeaderGuid == oStatusEntry.HeaderGuid) {
												oStatusEntry.StatusProfile = that.arrStatusPros[k].StatusProfile;
												break;
											}
										oStatusEntry.UserStatusCode = this
												.unformatChangeLog(
														changedData.text,
														changedData.NewValue,
														oStatusEntry.HeaderGuid);

										var statusUpdateUrl = "/OpportunityStatuses(StatusProfile='"
												+ oStatusEntry.StatusProfile
												+ "',UserStatusCode='"
												+ oStatusEntry.UserStatusCode
												+ "',HeaderGuid=guid'"
												+ oStatusEntry.HeaderGuid
												+ "')";
										this.oDataModel
												.addBatchChangeOperations([ this.oDataModel
														.createBatchOperation(
																statusUpdateUrl,
																"MERGE",
																oStatusEntry,
																null) ]);
										continue;
									} else if (oppCount == 0) {
										oEntry.Guid = this.changeData.opportunity[i].key;
										oppCount++;
									}
									switch (this.changeData.opportunity[i].items[j].text) {
									case "ChanceOfSuccess":
										oEntry.ChanceOfSuccess = this
												.unformatChangeLog(
														changedData.text,
														changedData.NewValue);
										break;
									case "ClosingDate":
										if (typeof changedData.NewValue === "string") {
											var newEndDate = this
													.unformatChangeLog(
															"ClosingDate",
															changedData.NewValue,
															this.changeData.opportunity[i].key);
											var oldStartDate = this
													.unformatChangeLog(
															"ClosingDate",
															changedData.StartDate,
															this.changeData.opportunity[i].key);
											if (newEndDate < oldStartDate) {
												isDateValid = false;
												item = {};
												item["opportunityName"] = this.changeData.opportunity[i].Name;
												item["opportunityKey"] = this.changeData.opportunity[i].key;
												endDateErrorOpportunities
														.push(item);
											} else {
												oEntry.ClosingDate = this
														.unformatChangeLog(
																changedData.text,
																changedData.NewValue);
											}
										}
										break;
									case "StartDate":
										if (typeof changedData.NewValue === "string") {
											oEntry.StartDate = this
													.unformatChangeLog(
															changedData.text,
															changedData.NewValue);
										}
										break;
									case "ExpectedSalesVolume":
										oEntry.ExpectedSalesVolume = this
												.unformatChangeLog(
														changedData.text,
														changedData.NewValue)
												+ ".0";
										oEntry.CurrencyCode = this.getView()
												.getModel(
														"SalesPipelineSetting").oData.CurrencyCode;
										break;
									case "ForecastRelevance":
										oEntry.ForecastRelevance = this
												.unformatChangeLog(
														changedData.text,
														changedData.NewValue);
										break;
									case "SalesStageCode":
										oEntry.SalesStageCode = this
												.unformatChangeLog(
														changedData.text,
														changedData.NewValue,
														oEntry.Guid);
										break;
									}
									changedData = null;
								}
							}
							if (isDateValid)
								if (oEntry.Guid != "") {
									var updateUrl = "/Opportunities(guid'"
											+ oEntry.Guid + "')";
									this.oDataModel
											.addBatchChangeOperations([ this.oDataModel
													.createBatchOperation(
															updateUrl, "MERGE",
															oEntry, null) ]);
								}
						}
						if (isDateValid) {
							this.oDataModel.setHeaders({
								"X-REQUESTED-WITH" : "XMLHttpRequest"
							});
							this.oDataModel.submitBatch(fnSuccess, fnError,
									false);
						} else {
							var errorMessage = this.oBundle
									.getText("LBL_ENDDATE_ERROR_LOPP")
									+ ": \n\n";
							for ( var i = 0; i < endDateErrorOpportunities.length; i++)
								errorMessage += endDateErrorOpportunities[i].opportunityName
										+ "\n";

							sap.ca.ui.message.showMessageBox({
								type : sap.ca.ui.message.Type.WARNING,
								message : errorMessage
							});
						}
					},

					// Start Date & End Date Validation in the Opportunity
					// Popover
					checkStartDate : function(oEvent) {
						var that = this;
						var paramDate = oEvent.getParameters(), oControl = oEvent
								.getSource();
						var utilForm = cus.crm.salespipeline.sim.util.formatter;
						var pInitialStartDate = this.selOpp.StartDate;

						if (paramDate.newValue != undefined) {
							var parsedDate = new Date(paramDate.newValue);

							if (parsedDate.toDateString() == "Invalid Date") {
								oControl.setValue(utilForm
										.displayDates(this.selOpp.StartDate));
								this.currStartDate = this.selOpp.StartDate;
							} else {
								var endDate = new Date(sap.ui.getCore().byId(
										'd2').getValue());
								var comparableStartDate = new Date(parsedDate);

								if (endDate < comparableStartDate) {
									sap.ui.getCore().byId('d1').setValue(
											pInitialStartDate);
									/*
									 * sap.m.MessageToast.show(that.oBundle
									 * .getText("LBL_ENDDATE_ERROR"), { duration :
									 * 10000
									 * 
									 * });
									 */
									sap.ca.ui.message.showMessageBox({
										type : sap.ca.ui.message.Type.WARNING,
										message : that.oBundle
												.getText("LBL_STARTDATE_ERROR")
									});
									oControl.setValue(utilForm
											.displayDates(pInitialStartDate));
									this.currStartDate = utilForm
											.convFromSixZeros(pInitialStartDate);
								} else {
									parsedDate = utilForm
											.convFromSixZeros(parsedDate);
									oControl.setValue(utilForm
											.displayDates(parsedDate));
									this.currStartDate = parsedDate;
								}
							}
						} else {
							var endDate = new Date(sap.ui.getCore().byId('d2')
									.getValue());
							var comparableStartDate = new Date(paramDate);

							if (endDate < comparableStartDate) {
								sap.ui.getCore().byId('d1').setValue(
										pInitialStartDate);
								/*
								 * sap.m.MessageToast.show(that.oBundle
								 * .getText("LBL_ENDDATE_ERROR"), { duration :
								 * 10000 });
								 */
								sap.ca.ui.message.showMessageBox({
									type : sap.ca.ui.message.Type.WARNING,
									message : that.oBundle
											.getText("LBL_STARTDATE_ERROR")
								});
								oControl.setValue(utilForm
										.displayDates(pInitialStartDate));
								this.currStartDate = utilForm
										.convFromSixZeros(pInitialStartDate);
							} else {
								paramDate = utilForm
										.convFromSixZeros(paramDate);
								oControl.setValue(utilForm
										.displayDates(paramDate));
								this.currStartDate = paramDate;
							}
						}

						if (this.currStartDate.toDateString() == this.actualStartDate
								.toDateString()) {
							this.iChangeStartDate = 0;
							this.selOpp.StartDate = this.actualStartDate;
						} else if (this.currStartDate.toDateString() == this.selOpp.StartDate
								.toDateString())
							this.iChangeStartDate = 0;
						else
							this.iChangeStartDate = 1;
					},

					checkEndDate : function(oEvent) {
						var that = this, oControl = oEvent.getSource();
						var paramDate = oEvent.getParameters();
						var pInitialEndDate = this.selOpp.ClosingDate;
						var utilForm = cus.crm.salespipeline.sim.util.formatter;
						if (paramDate.newValue != undefined) {
							var parsedDate = new Date(paramDate.newValue);
							if (parsedDate.toDateString() == "Invalid Date") {
								oControl.setValue(utilForm
										.displayDates(this.selOpp.EndDate));
								this.currEndDate = this.selOpp.EndDate;
							} else {

								var startDate = new Date(sap.ui.getCore().byId(
										'd1').getValue());
								var comparableEndDate = new Date(parsedDate);

								if (startDate > comparableEndDate) {
									sap.ui.getCore().byId('d2').setValue(
											pInitialEndDate);
									/*
									 * sap.m.MessageToast.show(that.oBundle
									 * .getText("LBL_STARTDATE_ERROR"), {
									 * duration : 10000 });
									 */
									sap.ca.ui.message.showMessageBox({
										type : sap.ca.ui.message.Type.WARNING,
										message : that.oBundle
												.getText("LBL_ENDDATE_ERROR")
									});
									oControl.setValue(utilForm
											.displayDates(pInitialEndDate));
									this.currEndDate = utilForm
											.convFromSixZeros(pInitialEndDate);
								} else {

									parsedDate = utilForm
											.convFromSixZeros(parsedDate);
									oControl.setValue(utilForm
											.displayDates(parsedDate));
									this.currEndDate = parsedDate;
								}

							}
						} else {

							var startDate = new Date(sap.ui.getCore()
									.byId('d1').getValue());
							var comparableEndDate = new Date(paramDate);

							if (startDate > comparableEndDate) {
								sap.ui.getCore().byId('d2').setValue(
										pInitialEndDate);
								/*
								 * sap.m.MessageToast.show(that.oBundle
								 * .getText("LBL_STARTDATE_ERROR"), { duration :
								 * 10000 });
								 */
								sap.ca.ui.message.showMessageBox({
									type : sap.ca.ui.message.Type.WARNING,
									message : that.oBundle
											.getText("LBL_ENDDATE_ERROR")
								});
								oControl.setValue(utilForm
										.displayDates(pInitialEndDate));
								this.currEndDate = utilForm
										.convFromSixZeros(pInitialEndDate);
							} else {

								paramDate = utilForm
										.convFromSixZeros(paramDate);
								oControl.setValue(utilForm
										.displayDates(paramDate));
								this.currEndDate = paramDate;
							}

						}

						if (this.currEndDate.toDateString() == this.actualEndDate
								.toDateString()) {
							this.iChangeEndDate = 0;
							this.selOpp.ClosingDate = this.actualEndDate;
						} else if (this.currEndDate.toDateString() == this.selOpp.ClosingDate
								.toDateString())
							this.iChangeEndDate = 0;
						else
							this.iChangeEndDate = 1;
					},

					showDD : function(oEvent) {
						// if (oEvent.oSource == this.getView().byId("d1")) {
						// this.getView().byId("calStart").setVisible(true);
						// } else if (oEvent.oSource ==
						// this.getView().byId("d2")) {
						// this.getView().byId("calEnd").setVisible(true);
						// }
						var oCalendar = null, oControl = oEvent.getSource();
						if (oControl == sap.ui.getCore().byId("d1"))
							oCalendar = sap.ui.getCore().byId("calStart");
						else if (oControl == sap.ui.getCore().byId("d2"))
							oCalendar = sap.ui.getCore().byId("calEnd");

						if (oCalendar.getVisible())
							oCalendar.setVisible(false);
						else
							oCalendar.setVisible(true);
					},

					closeOpport : function(oEvent) {
						// this.getView().byId("calStart").setVisible(false);
						// this.getView().byId("calEnd").setVisible(false);
						sap.ui.getCore().byId("calStart").setVisible(false);
						sap.ui.getCore().byId("calEnd").setVisible(false);
					},

					// Change Start & End Date in the Opportunity Popover
					changeStartDate : function(oEvent) {
						var oControl = oEvent.getSource();
						if (oControl.getSelectedDates().length == 1) {
							oControl
									.setCurrentDate(oControl.getSelectedDates()[0]);
							var changedDate = new Date(oControl
									.getCurrentDate());
							// this.getView().byId("d1").setValue(this.displayDates(changedDate));
							// this.getView().byId("d1").fireChange(changedDate);
							sap.ui.getCore().byId("d1").fireChange(changedDate);
						}
						oControl.setVisible(false);
					},

					changeEndDate : function(oEvent) {
						var oControl = oEvent.getSource();
						if (oControl.getSelectedDates().length == 1) {
							oControl
									.setCurrentDate(oControl.getSelectedDates()[0]);
							var changedDate = new Date(oControl
									.getCurrentDate());
							// this.getView().byId("d2").setValue(this.displayDates(changedDate));
							// this.getView().byId("d2").fireChange(changedDate);
							sap.ui.getCore().byId("d2").fireChange(changedDate);
						}
						oControl.setVisible(false);
					},

					// Check & Change Unweighted Expected Sales Volume in the
					// Opportunity Popover
					changeExpectedSV : function(oEvent) {
						var oControl = oEvent.getSource(), utilForm = cus.crm.salespipeline.sim.util.formatter;
						var parsedNum = utilForm.reverseNumbers(oControl
								.getValue());

						if (isNaN(parsedNum))
							/*
							 * sap.m.MessageToast.show(this.oBundle
							 * .getText("LBL_VAL_MSG"));
							 */
							sap.ca.ui.message.showMessageBox({
								type : sap.ca.ui.message.Type.WARNING,
								message : this.oBundle.getText("LBL_VAL_MSG")
							});
						else {
							if (parsedNum < this.minOpp) {
								oControl.setValue(utilForm
										.displayNumbers(this.minOpp));
								/*
								 * sap.m.MessageToast.show(this.oBundle
								 * .getText("LBL_VAL_MINEXPREV"), { duration :
								 * 15000 });
								 */
								sap.ca.ui.message.showMessageBox({
									type : sap.ca.ui.message.Type.WARNING,
									message : this.oBundle
											.getText("LBL_VAL_MINEXPREV")
								});
							} else if (parsedNum > this.maxOpp) {
								oControl.setValue(utilForm
										.displayNumbers(this.maxOpp));
								/*
								 * sap.m.MessageToast.show(this.oBundle
								 * .getText("LBL_VAL_MAXEXPREV"), { duration :
								 * 15000 });
								 */
								sap.ca.ui.message.showMessageBox({
									type : sap.ca.ui.message.Type.WARNING,
									message : this.oBundle
											.getText("LBL_VAL_MAXEXPREV")
								});
							} else
								oControl.setValue(utilForm
										.displayNumbers(parsedNum));
						}
					},

					// Check & Change Chance of Success in the Opportunity
					// Popover
					changeCOS : function(oEvent) {
						var oControl = oEvent.getSource(), successNum = oControl
								.getValue();
						var numbers = "^[0-9]+$";
						var numbers2 = "(\[0-9]{1,3})\%";

						if (isNaN(successNum))
							if (parseFloat(successNum) < 0) {
								oControl.setValue("0");
								/*
								 * sap.m.MessageToast.show(this.oBundle
								 * .getText("LBL_VAL_MINCHANCE"));
								 */
								sap.ca.ui.message.showMessageBox({
									type : sap.ca.ui.message.Type.INFO,
									message : this.oBundle
											.getText("LBL_VAL_MINCHANCE")
								});

							}
						if (parseFloat(successNum) > 100) {
							oControl.setValue("100");
							/*
							 * sap.m.MessageToast.show(this.oBundle
							 * .getText("LBL_VAL_MAXCHANCE"));
							 */
							sap.ca.ui.message.showMessageBox({
								type : sap.ca.ui.message.Type.INFO,
								message : this.oBundle
										.getText("LBL_VAL_MAXCHANCE")
							});
						}

						var successNum = oControl.getValue();
						if (successNum.match(numbers)
								|| successNum.match(numbers2))
							this.iChangeCOS = 0;
						else {
							this.iChangeCOS = 1;
							/*
							 * sap.m.MessageToast.show(this.oBundle
							 * .getText("LBL_VAL_MSG"));
							 */
							sap.ca.ui.message.showMessageBox({
								type : sap.ca.ui.message.Type.WARNING,
								message : this.oBundle.getText("LBL_VAL_MSG")
							});
						}
					},

					// Change Sales Stage in the Opportunity Popover and set the
					// Chance of Success if any pre-set value is available
					changeSalesStage : function(oEvent) {
						var selectedStage = oEvent.getParameter('selectedItem')
								.getKey();
						var salesStages = sap.ui.getCore().byId("salesStage1")
								.getModel("SalesOpp").oData;
						for ( var i = 0; i < salesStages.length; i++)
							if (salesStages[i].SalesStageCode == selectedStage) {
								sap.ui
										.getCore()
										.byId("chanceOfSucc")
										.setValue(
												parseFloat(salesStages[i].ChanceOfSuccess)
														+ "%");
								break;
							}
					},

					compose : function(i) {
						var utilForm = cus.crm.salespipeline.sim.util.formatter;
						var composedNum = utilForm.reverseNumbers(i);
						// var dispNum = numFormat.format(composedNum);
						return composedNum + ".00";
					},

					// CROSS-APP Navigation to other Fiori Applications -
					// (1) Accounts
					toAccountApp : function() {
						var fgetService = sap.ushell && sap.ushell.Container
								&& sap.ushell.Container.getService;
						var oCrossAppNavigator = fgetService
								&& fgetService("CrossApplicationNavigation");
						var sAccParam = isNaN(parseInt(this.pAccountId)) ? this.pAccountId
								: parseInt(this.pAccountId).toString();
						var sAccountApp = oCrossAppNavigator
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

						this.cancelChangeOpp();
						if (!this.getView().byId("butSave").getVisible())
							window.location = sAccountApp;
						else {
							this.oNavParams.toAccountApp = sAccountApp;
							this.oFragmentList.resetDialog.open();
						}
					},

					// CROSS-APP Navigation to other Fiori Applications -
					// (2) Opportunities
					toOppApp : function() {
						var fgetService = sap.ushell && sap.ushell.Container
								&& sap.ushell.Container.getService;
						var oCrossAppNavigator = fgetService
								&& fgetService("CrossApplicationNavigation");
						var sOppApp = oCrossAppNavigator
								&& oCrossAppNavigator.hrefForExternal({
									target : {
										semanticObject : "Opportunity",
										action : "manageOpportunity"
									},
									params : {
										guid : this.guidVal
									}
								}) || "";
						this.cancelChangeOpp();
						if (!this.getView().byId("butSave").getVisible())
							window.location = sOppApp;
						else {
							this.oNavParams.toOppApp = sOppApp;
							this.oFragmentList.resetDialog.open();
						}
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
						var sContactApp = oCrossAppNavigator
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

						this.cancelChangeOpp();
						if (!this.getView().byId("butSave").getVisible())
							window.location = sContactApp;
						else {
							this.oNavParams.toContactApp = sContactApp;
							this.oFragmentList.resetDialog.open();
						}
					},

					/*
					 * FIORI WAVE 2 - Branch : Rel - 1.0 END of INITAL
					 * DEVELOPMENT for SimulateSalesPipeline
					 */

					/*
					 * FIORI WAVE 3 - Branch : Rel - 1.1 START of ENHANCEMENTS
					 * for SimulateSalesPipeline
					 */
					/*
					 * @ControllerHook Provision for Additional Fields in the
					 * Opportunity Popover. If required to see the additional
					 * fields directly, this methods enables you to set the data
					 * to those additional fields. This is called when the
					 * bubble in the Sales Pipeline is selected. The hook must
					 * be documented like: @callback
					 * sap.ca.scfld.md.controller.BaseFullscreenController~extHookOpportunityPopover
					 * @return {void}
					 */
					// extHookOpportunityPopover : function() {
					//
					// },
					/*
					 * FIORI WAVE 3 - Branch : Rel - 1.1 END of ENHANCEMENTS for
					 * SimulateSalesPipeline
					 */

					/*
					 * FIORI WAVE 4 - Branch : Rel - 1.2 START of ENHANCEMENTS
					 * for SimulateSalesPipeline
					 */

					renderTopNSlider : function(oEvent) {
						if (!this.oFragmentList.TopNSlider) {
							this.oFragmentList.TopNSlider = new sap.ui.xmlfragment(
									'cus.crm.salespipeline.sim.view.opportunitySlider',
									this);
							this.oFragmentList.TopNSlider.setModel(this
									.getView().getModel("i18n"), "i18n");
						}
						this.oFragmentList.TopNSlider
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
							if (excludeLost == true) {
								if (bTCode == "LOST") {
									return true;
								}
							}
							if (excludeWon == true) {
								if (bTCode == "WINN") {
									return true;
								}
							}
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
						var slider = sap.ui.getCore().byId('opportunitySlider');
						var sliderVal = sap.ui.getCore().byId(
								'opportunitySlider').getValue();
						var localOpportunity = this
								._getCurrFilteredOpp(this.Opportunities
										.slice(0));
						var noOfFilteredOpp = localOpportunity.length;
						if ((sliderVal >= noOfFilteredOpp)
								|| (slider.getMax() == sliderVal)
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
							if (oControl.sId == "opportunitySlider")
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
						this.copyOpportunities("OpportunitiesOld");
						if ((isSliding || isSelected) && bIsSalesPeriodSeen)
							this.calculateProgress();
					},

					_initializeAllControllerFragments : function() {
						var i18nModel = this.getView().getModel("i18n");
						// Making it work with the latest UI5 1.22.0 onwards
						// this.oFragmentList = {};
						if (!this.oFragmentList.TopNSlider) {
							this.oFragmentList.TopNSlider = new sap.ui.xmlfragment(
									'cus.crm.salespipeline.sim.view.opportunitySlider',
									this);
							this.oFragmentList.TopNSlider.setModel(i18nModel,
									"i18n");
						}
						if (!this.oFragmentList.SalesTargetDialog) {
							this.oFragmentList.SalesTargetDialog = new sap.ui.xmlfragment(
									"cus.crm.salespipeline.sim.view.SalesTargetDialog",
									this);
							this.oFragmentList.SalesTargetDialog.setModel(
									i18nModel, "i18n");
							this.oFragmentList.SalesTargetDialog.setModel(this
									.getView().getModel("PeriodicityTexts"),
									"PeriodicityTexts");
							this.oFragmentList.SalesTargetDialog.setModel(this
									.getView().getModel("CurrencyList"),
									"CurrencyList");
							this.oFragmentList.SalesTargetDialog.setModel(this
									.getView().getModel("YearRanges"),
									"YearRanges");
							if (sap.ui.Device.system.desktop
									|| sap.ui.Device.system.tablet)
								this.oFragmentList.SalesTargetDialog
										.setContentWidth("30em");
						}
						if (!this.oFragmentList.opportunityPopover) {
							this.oFragmentList.opportunityPopover = new sap.ui.xmlfragment(
									"cus.crm.salespipeline.sim.view.opportunityPopover",
									this);
							this.oFragmentList.opportunityPopover.setModel(
									i18nModel, "i18n");
							this.oFragmentList.opportunityPopover
									.setModel(this.getView().getModel(
											"SalesOpp"), "SalesOpp");
							this.oFragmentList.opportunityPopover.setModel(this
									.getView().getModel("StatusMgt"),
									"StatusMgt");
						}
						if (!this.oFragmentList.settingsDialog) {
							this.oFragmentList.settingsDialog = new sap.ui.xmlfragment(
									"cus.crm.salespipeline.sim.view.settingsDialog",
									this);
							this.oFragmentList.settingsDialog.setModel(
									i18nModel, "i18n");
							if (sap.ui.Device.system.desktop
									|| sap.ui.Device.system.tablet)
								this.oFragmentList.settingsDialog
										.setContentWidth("30em");
						}
						if (!this.oFragmentList.resetDialog) {
							this.oFragmentList.resetDialog = new sap.ui.xmlfragment(
									"cus.crm.salespipeline.sim.view.resetDialog",
									this);
							this.oFragmentList.resetDialog.setModel(i18nModel,
									"i18n");
							if (sap.ui.Device.system.desktop
									|| sap.ui.Device.system.tablet)
								this.oFragmentList.resetDialog
										.setContentWidth("30em");
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
							if (!this.getView().byId("butSave").getVisible())
								sap.m.URLHelper.triggerEmail(oSrc.getText());
							else
								this.oNavParams.sendMail = oSrc.getText();
							break;
						case oCore.byId(aId[2]):
						case oCore.byId(aId[3]):
							if (!this.getView().byId("butSave").getVisible())
								sap.m.URLHelper.triggerTel(oSrc.getText());
							else
								this.oNavParams.telCall = oSrc.getText();
							break;
						}
					}

				/*
				 * FIORI WAVE 4 - Branch : Rel - 1.2 END of ENHANCEMENTS for
				 * SimulateSalesPipeline
				 */
				});

},
	"cus/crm/salespipeline/sim/view/S1.view.xml":'<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core" xmlns="sap.m" xmlns:crm="sap.crm"\n\txmlns:layout="sap.ui.layout" xmlns:me="sap.me"\n\tcontrollerName="cus.crm.salespipeline.sim.view.S1">\n\n\t<Page id="page" title="{i18n>FULLSCREEN_TITLE}" navButtonPress="resetAllOpp"\n\t\tshowNavButton="true">\n\t\t<content>\n\t\t\t<!-- Replace with required full screen control -->\n\n\t\t\t<!-- <FlexBox justifyContent="Start" alignItems="Center" direction="Row"> \n\t\t\t\t<items> <Label id="lb" text="{i18n>LBL_TARGET_ACHIEVEMENT}" labelFor="pg" \n\t\t\t\ttextAlign="Left" design="Bold"></Label> <ProgressIndicator id="pg" barColor="POSITIVE" \n\t\t\t\ttextAlign="right" showValue="true"></ProgressIndicator> </items> </FlexBox> -->\n\n\t\t\t<!-- <HBox justifyContent="Center"> <VBox width="50%" justifyContent="Center"> \n\t\t\t\t<ObjectHeader title="{i18n>LBL_TARGET_ACHIEVEMENT}" id="objectHeader" textAlign="Left"> \n\t\t\t\t</ObjectHeader> </VBox> <VBox width="50%"> <Label design="Bold" id="objectStatus" \n\t\t\t\t/> <ProgressIndicator id="pg" width="100%" showValue="true" /> </VBox> </HBox> -->\n\n\n\t\t\t<!-- <HBox> <VBox width="80%" class="showMiddle"> <ObjectHeader id="objectHeader" \n\t\t\t\ttitle="{i18n>LBL_TARGET_ACHIEVEMENT}"> </ObjectHeader> </VBox> <VBox width="20%" \n\t\t\t\tclass="showMiddleProgressIndicator"> <Text id="objectStatus" width="100%" \n\t\t\t\ttextAlign="Right"></Text> <ProgressIndicator width="100%" height="1.7rem" \n\t\t\t\tid="pg" showValue="true"></ProgressIndicator> </VBox> </HBox> -->\n\n\n\t\t\t<layout:HorizontalLayout>\n\t\t\t\t<layout:content>\n\n\t\t\t\t\t<layout:VerticalLayout class="showMiddle">\n\t\t\t\t\t\t<ObjectHeader id="objectHeader" title="{i18n>LBL_TARGET_ACHIEVEMENT}">\n\t\t\t\t\t\t</ObjectHeader>\n\t\t\t\t\t</layout:VerticalLayout>\n\n\t\t\t\t\t<layout:VerticalLayout class="showMiddleProgressIndicator">\n\t\t\t\t\t\t<Text id="objectStatus" width="100%" textAlign="Right"></Text>\n\t\t\t\t\t\t<ProgressIndicator width="100%" height="1.7rem"\n\t\t\t\t\t\t\tid="pg" showValue="true"></ProgressIndicator>\n\t\t\t\t\t</layout:VerticalLayout>\n\n\t\t\t\t</layout:content>\n\n\t\t\t</layout:HorizontalLayout>\n\n\t\t\t<layout:HorizontalLayout class="selectionLayout"\n\t\t\t\tallowWrapping="true">\n\t\t\t\t<layout:content>\n\t\t\t\t\t<layout:HorizontalLayout class="alignLeft">\n\t\t\t\t\t\t<Select id="sSP1" items="{PeriodicityTexts>/}" selectedKey="{SalesPipelineSetting>/STP2}"\n\t\t\t\t\t\t\tchange="onPeriodicityChange">\n\t\t\t\t\t\t\t<items>\n\t\t\t\t\t\t\t\t<core:Item key="{PeriodicityTexts>ID}" text="{PeriodicityTexts>Description}"></core:Item>\n\t\t\t\t\t\t\t</items>\n\t\t\t\t\t\t</Select>\n\t\t\t\t\t</layout:HorizontalLayout>\n\t\t\t\t\t<layout:HorizontalLayout id="hlOppSlider"\n\t\t\t\t\t\tclass="alignRight">\n\t\t\t\t\t\t<layout:content>\n\t\t\t\t\t\t\t<Button text="{i18n>BTN_OPEN_OPPORTUNITY_SLIDER}" width="9.25rem" press="renderTopNSlider"\n\t\t\t\t\t\t\t\ticon="sap-icon://slim-arrow-down" type="Emphasized" iconFirst="false">\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t</layout:content>\n\t\t\t\t\t</layout:HorizontalLayout>\n\t\t\t\t</layout:content>\n\t\t\t</layout:HorizontalLayout>\n\n\t\t\t<crm:BubbleChart id="chart_sim" items="{Opportunities>/}"\n\t\t\t\txStart="{SettingsForDisplay>/TimeFrom}" xEnd="{SettingsForDisplay>/TimeTo}"\n\t\t\t\txFStart="{SettingsForDisplay>/StartOfPeriod}" xFEnd="{SettingsForDisplay>/EndOfPeriod}"\n\t\t\t\txLabelTexts="{xLabelTexts>/}" xLabelValues="{xLabelValues>/}"\n\t\t\t\tyStart="0" yEnd="100" yFStart="0" yFEnd="100" yLabelTexts="{yLabelTexts>/}"\n\t\t\t\tyLabelValues="{yLabelValues>/}" change="bubblechange" liveChange="bubblechange"\n\t\t\t\tclick="bubbleclick">\n\t\t\t\t<crm:items>\n\t\t\t\t\t<crm:Bubble key="{Opportunities>Guid}" x="{Opportunities>ClosingDate}"\n\t\t\t\t\t\ty="{Opportunities>ChanceOfSuccess}" z="{Opportunities>ExpectedSalesVolume}"\n\t\t\t\t\t\tdescription="{Opportunities>Description}">\n\t\t\t\t\t</crm:Bubble>\n\t\t\t\t</crm:items>\n\t\t\t</crm:BubbleChart>\n\n\t\t\t<crm:MDualSlider units="{TimeIntervals>/}" id="name"\n\t\t\t\twidth="100%" step="1" value="{sliderValues>/value}" value2="{sliderValues>/value2}"\n\t\t\t\tchange="dualsliderchange">\n\t\t\t\t<crm:units>\n\t\t\t\t\t<crm:MDualSliderLabel key="{TimeIntervals>TimeFrom}"\n\t\t\t\t\t\tvalue="{TimeIntervals>Label}"></crm:MDualSliderLabel>\n\t\t\t\t</crm:units>\n\t\t\t</crm:MDualSlider>\n\n\t\t</content>\n\n\t\t<footer>\n\t\t\t<Bar id="masterFooter">\n\t\t\t\t<!-- <contentLeft> <Button id="butSettings" icon="sap-icon://action-settings" \n\t\t\t\t\tpress="showSettings"></Button> <ActionSheet id="actSettings" showCancelButton="false" \n\t\t\t\t\tplacement="Top"> <buttons> <Button id="acButAppS" text="{i18n>BTN_APPSETTINGS}" \n\t\t\t\t\ticon="sap-icon://settings" press="selectActSetting"></Button> </buttons> \n\t\t\t\t\t</ActionSheet> <ActionSheet id="actActions" showCancelButton="false" placement="Top"> \n\t\t\t\t\t<buttons> <Button id="acButRefresh" text="{i18n>BTN_REFRESH_APP}" icon="sap-icon://refresh" \n\t\t\t\t\tpress="selectAction"></Button> <Button id="acButExport" text="{i18n>BTN_EXPORTEXCL}" \n\t\t\t\t\ticon="sap-icon://excel-attachment"></Button> <Button id="acButShar" text="{i18n>BTN_SHARETO}" \n\t\t\t\t\ticon="sap-icon://share-2"></Button> <Button id="acButChangelog" text="{i18n>BTN_SHOW_CHANGELOG}" \n\t\t\t\t\ticon="sap-icon://activities" press="selectAction"></Button> </buttons> </ActionSheet> \n\t\t\t\t\t</contentLeft> -->\n\t\t\t\t<contentRight>\n\t\t\t\t\t<Button id="butChangelog" press="showChangeLog"\n\t\t\t\t\t\tvisible="{path:\'changeModel1>/changescount\',formatter:\'cus.crm.salespipeline.sim.util.formatter.toBoolean\'}"></Button>\n\t\t\t\t\t<!-- icon="sap-icon://activities" -->\n\t\t\t\t\t<Button id="butSave" press="saveAllOpp" type="Accept"\n\t\t\t\t\t\tvisible="{path:\'changeModel1>/changescount\', formatter:\'cus.crm.salespipeline.sim.util.formatter.toBoolean\'}"></Button>\n\t\t\t\t\t<Button id="butReset" press="resetAllOpp" type="Reject"\n\t\t\t\t\t\tvisible="{path:\'changeModel1>/changescount\', formatter:\'cus.crm.salespipeline.sim.util.formatter.toBoolean\'}"></Button>\n\t\t\t\t</contentRight>\n\t\t\t</Bar>\n\t\t</footer>\n\t</Page>\n</core:View>',
	"cus/crm/salespipeline/sim/view/SalesTargetDialog.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<!-- Sales Target Settings -->\n<Dialog xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:layout="sap.ui.layout"\n\tid="dlSalesPeriodSet" showHeader="true">\n\t<customHeader>\n\t\t<Bar>\n\t\t\t<contentLeft>\n\t\t\t\t<Button id="SPnavBack" icon="sap-icon://nav-back" press="navBack"></Button>\n\t\t\t</contentLeft>\n\t\t\t<contentMiddle>\n\t\t\t\t<Label id="titleSP" text="{i18n>AS_SALESTARGET_TITLE}"\n\t\t\t\t\ttextAlign="Center"></Label>\n\t\t\t</contentMiddle>\n\t\t</Bar>\n\t</customHeader>\n\t<content>\n\t\t<layout:VerticalLayout id="spVBox" class="settingPad">\n\t\t\t<layout:content>\n\t\t\t\t<Label id="lbSP" text="{i18n>LBL_ST_SALESPERIOD}" labelFor="sSP"\n\t\t\t\t\tdesign="Bold"></Label>\n\t\t\t\t<Select id="sSP" class="inputControl" items="{PeriodicityTexts>/}"\n\t\t\t\t\tselectedKey="{SettingsForSave>/SalesTargetPeriodicity}">\n\t\t\t\t\t<items>\n\t\t\t\t\t\t<core:Item key="{PeriodicityTexts>ID}" text="{PeriodicityTexts>Description}"></core:Item>\n\t\t\t\t\t</items>\n\t\t\t\t</Select>\n\t\t\t\t<Label id="lbST" text="{i18n>LBL_ST_SALESTARGET}" labelFor="iST"\n\t\t\t\t\tdesign="Bold"></Label>\n\t\t\t\t<Input id="iST" class="inputControl" change="checkValue"\n\t\t\t\t\tvalue="{path:\'SettingsForSave>/SalesTarget\',formatter:\'cus.crm.salespipeline.sim.util.formatter.displayNumbers\'}"></Input>\n\t\t\t\t<Label id="lbCur" text="{i18n>LBL_ST_CURRENCY}" labelFor="sCur"\n\t\t\t\t\tdesign="Bold"></Label>\n\t\t\t\t<Select id="sCur" class="inputControl" items="{CurrencyList>/}"\n\t\t\t\t\tselectedKey="{SettingsForSave>/CurrencyCode}">\n\t\t\t\t\t<items>\n\t\t\t\t\t\t<core:Item key="{CurrencyList>CurrencyKey}" text="{CurrencyList>CurrencyKey}"></core:Item>\n\t\t\t\t\t</items>\n\t\t\t\t</Select>\n\t\t\t\t<Label id="lbTiS" class="inputControl" text="{i18n>LBL_ST_TIMESPAN}"\n\t\t\t\t\tdesign="Bold"></Label>\n\t\t\t\t<Label id="lbFrom" text="{i18n>LBL_ST_TIMEFROM}"></Label>\n\t\t\t\t<Select id="sFrom" class="inputControl" change="TimespanChange"\n\t\t\t\t\titems="{YearRanges>/}" selectedKey="{SettingsForSave>/TimeFrom}">\n\t\t\t\t\t<items>\n\t\t\t\t\t\t<core:Item key="{YearRanges>TargetStartDate}" text="{YearRanges>TargetYear}"></core:Item>\n\t\t\t\t\t</items>\n\t\t\t\t</Select>\n\t\t\t\t<Label id="lbTo" text="{i18n>LBL_ST_TIMETO}"></Label>\n\t\t\t\t<Select id="sTo" class="inputControl" change="TimespanChange"\n\t\t\t\t\titems="{YearRanges>/}" selectedKey="{SettingsForSave>/TimeTo}">\n\t\t\t\t\t<items>\n\t\t\t\t\t\t<core:Item key="{YearRanges>TargetEndDate}" text="{YearRanges>TargetYear}"></core:Item>\n\t\t\t\t\t</items>\n\t\t\t\t</Select>\n\t\t\t</layout:content>\n\t\t</layout:VerticalLayout>\n\t</content>\n\t<beginButton>\n\t\t<Button id="spButSave" text="{i18n>BTN_AS_SAVEAPPSETT}" press="saveAppSetChange"></Button>\n\t</beginButton>\n\t<endButton>\n\t\t<Button id="spButCancel" text="{i18n>BTN_AS_CANCELAPPSETT}"\n\t\t\tpress="saveAppSetChange"></Button>\n\t</endButton>\n</Dialog>',
	"cus/crm/salespipeline/sim/view/changeLogDialog.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<!-- Change Log Dialog -->\n<Dialog xmlns="sap.m" xmlns:l="sap.ui.layout" xmlns:ui="sap.ca.ui"\n\ttitle="{i18n>CHANGELOG_TITLE}" class="dialogBox" id="changeLogDialog"\n\tcontentHeight="28.125rem">\n\t<content>\n\t\t<Page showHeader="false">\n\t\t\t<content>\n\t\t\t\t<!-- headerDesign="Plain" -->\n\t\t\t\t<Table id="changeLogHeader" mode="None" showSeparators="None">\n\t\t\t\t\t<columns>\n\t\t\t\t\t\t<Column></Column>\n\t\t\t\t\t\t<Column></Column>\n\t\t\t\t\t\t<Column></Column>\n\t\t\t\t\t\t<Column></Column>\n\t\t\t\t\t</columns>\n\t\t\t\t\t<items>\n\t\t\t\t\t\t<ColumnListItem>\n\t\t\t\t\t\t\t<CheckBox select="onDiscardAllChecked" id="cbAllChanges"></CheckBox>\n\t\t\t\t\t\t\t<Label text="{i18n>LBL_CL_CHANGES}" design="Bold" class="tabelCell"></Label>\n\t\t\t\t\t\t\t<Label text="{i18n>LBL_CL_OLDVALUE}" design="Bold" class="tabelCell"></Label>\n\t\t\t\t\t\t\t<Label text="{i18n>LBL_CL_NEWVALUE}" design="Bold" class="tabelCell"></Label>\n\t\t\t\t\t\t</ColumnListItem>\n\t\t\t\t\t</items>\n\t\t\t\t</Table>\n\n\t\t\t\t<l:VerticalLayout content="{changeModel1>/opportunity}"\n\t\t\t\t\twidth="100%">\n\t\t\t\t\t<l:content>\n\t\t\t\t\t\t<!-- headerDesign="Plain" -->\n\t\t\t\t\t\t<Table mode="None" headerText="{changeModel1>Name}" items="{changeModel1>items}">\n\t\t\t\t\t\t\t<columns>\n\t\t\t\t\t\t\t\t<Column></Column>\n\t\t\t\t\t\t\t\t<Column></Column>\n\t\t\t\t\t\t\t\t<Column></Column>\n\t\t\t\t\t\t\t\t<Column></Column>\n\t\t\t\t\t\t\t</columns>\n\t\t\t\t\t\t\t<items>\n\t\t\t\t\t\t\t\t<ColumnListItem>\n\t\t\t\t\t\t\t\t\t<CheckBox select="onDiscardChecked" selected="{changeModel1>checked}"></CheckBox>\n\t\t\t\t\t\t\t\t\t<Label text="{changeModel1>propertyText}" class="tabelCell"></Label>\n\t\t\t\t\t\t\t\t\t<Label text="{changeModel1>OldValue}" class="tabelCell"></Label>\n\t\t\t\t\t\t\t\t\t<Label text="{changeModel1>NewValue}" class="tabelCell"></Label>\n\t\t\t\t\t\t\t\t</ColumnListItem>\n\t\t\t\t\t\t\t</items>\n\t\t\t\t\t\t</Table>\n\t\t\t\t\t</l:content>\n\t\t\t\t</l:VerticalLayout>\n\t\t\t</content>\n\t\t\t<footer>\n\t\t\t\t<Bar>\n\t\t\t\t\t<contentLeft>\n\t\t\t\t\t\t<Button id="saveBtn" text="{i18n>BTN_SAVE_OPPORT}" type="Accept"\n\t\t\t\t\t\t\tpress="changeLogSave" width="33.33%"></Button>\n\t\t\t\t\t\t<Button id="discardBtn" text="{i18n>BTN_CL_DISCARD}" type="Reject"\n\t\t\t\t\t\t\tpress="onDiscard" width="33.33%"></Button>\n\t\t\t\t\t\t<Button text="{i18n>BTN_CL_CLOSE}" press="onClose" width="33.34%"></Button>\n\t\t\t\t\t</contentLeft>\n\t\t\t\t\t<!-- <contentMiddle> <Button id="discardBtn" text="{i18n>BTN_CL_DISCARD}" \n\t\t\t\t\t\ttype="Reject" press="onDiscard" width="33.33%"></Button> </contentMiddle> \n\t\t\t\t\t\t<contentRight> <Button text="{i18n>BTN_CL_CLOSE}" press="onClose" width="33.34%"></Button> \n\t\t\t\t\t\t</contentRight> -->\n\t\t\t\t</Bar>\n\t\t\t</footer>\n\t\t</Page>\n\t</content>\n</Dialog>',
	"cus/crm/salespipeline/sim/view/opportunityPopover.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<!-- Opportunity Popover Control -->\n<Popover xmlns="sap.m" xmlns:crm="sap.crm" xmlns:me="sap.me" xmlns:layout="sap.ui.layout"\n\txmlns:core="sap.ui.core" id="po" contentHeight="31.25rem" contentWidth="18.75rem"\n\tshowHeader="true" modal="false" placement="Auto" afterClose="closeOpport">\n\t<customHeader>\n\t\t<Bar id="poBar">\n\t\t\t<contentRight>\n\t\t\t\t<Button id="upBtn" icon="sap-icon://up" press="moveUp"\n\t\t\t\t\tvisible="false"></Button>\n\t\t\t\t<Button id="downBtn" icon="sap-icon://down" press="moveDown"\n\t\t\t\t\tvisible="false"></Button>\n\t\t\t</contentRight>\n\t\t\t<contentMiddle>\n\t\t\t\t<Label id="oppDetails" text="{i18n>LBL_OPPORT_DETAILS}"></Label>\n\t\t\t</contentMiddle>\n\t\t</Bar>\n\t</customHeader>\n\n\t<content>\n\t\t<Page id="poPage" showHeader="false">\n\t\t\t<content>\n\t\t\t\t<!-- Add fields to the start of the Opportunity popover -->\n\t\t\t\t<core:ExtensionPoint name="extOpportunityPopover"></core:ExtensionPoint>\n\t\t\t\t<!-- <ScrollContainer vertical="true" visible="true"> <content> -->\n\t\t\t\t<layout:VerticalLayout id="popoverVBox">\n\t\t\t\t\t<layout:content>\n\n\t\t\t\t\t\t<!-- Opportunity ID -->\n\t\t\t\t\t\t<Label id="OppId" design="Bold"></Label>\n\t\t\t\t\t\t<!-- Opportunity Description - Link -->\n\t\t\t\t\t\t<Link id="OppDescription" wrapping="true" press="toOppApp"></Link>\n\t\t\t\t\t\t<!-- Prospect/Account -->\n\t\t\t\t\t\t<Label text="{i18n>LBL_OD_ACCPROSPECT}" design="Bold"></Label>\n\t\t\t\t\t\t<Link id="accName" wrapping="true" press="toAccountApp"></Link>\n\n\t\t\t\t\t\t<!-- Main Contact of Account -->\n\t\t\t\t\t\t<layout:VerticalLayout id="mainContact"\n\t\t\t\t\t\t\tvisible="false" class="inputControl1">\n\t\t\t\t\t\t\t<layout:content>\n\n\t\t\t\t\t\t\t\t<Label text="{i18n>LBL_OD_MAINCONTACT}" design="Bold"></Label>\n\t\t\t\t\t\t\t\t<Link id="mainContactName" wrapping="true" press="toContactApp"></Link>\n\t\t\t\t\t\t\t\t<Link id="mcEmail" visible="false" press="pressLinkToEmailOrCall"></Link>\n\t\t\t\t\t\t\t\t<Link id="mcPhone" visible="false" press="pressLinkToEmailOrCall"></Link>\n\t\t\t\t\t\t\t</layout:content>\n\t\t\t\t\t\t</layout:VerticalLayout>\n\t\t\t\t\t\t<!-- Employee Responsible of Opportunity -->\n\n\t\t\t\t\t\t<layout:VerticalLayout id="empResp" visible="false"\n\t\t\t\t\t\t\tclass="inputControl1">\n\t\t\t\t\t\t\t<layout:content>\n\n\t\t\t\t\t\t\t\t<Label text="{i18n>LBL_OD_EMPLRESP}" design="Bold"></Label>\n\t\t\t\t\t\t\t\t<Text id="empRespName"></Text>\n\t\t\t\t\t\t\t\t<Link id="empRespEmail" visible="false" press="pressLinkToEmailOrCall"></Link>\n\t\t\t\t\t\t\t\t<Link id="empRespPhone" visible="false" press="pressLinkToEmailOrCall"></Link>\n\t\t\t\t\t\t\t</layout:content>\n\t\t\t\t\t\t</layout:VerticalLayout>\n\n\t\t\t\t\t\t<!-- Start Date & Closing Date -->\n\t\t\t\t\t\t<Label text="{i18n>LBL_OD_STARTDATE}" design="Bold" class="inputControl1">\n\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t<crm:DateInput id="d1" showValueHelp="true"\n\t\t\t\t\t\t\tvalueHelpRequest="showDD" change="checkStartDate"></crm:DateInput>\n\t\t\t\t\t\t<me:Calendar id="calStart" visible="false" tapOnDate="changeStartDate"\n\t\t\t\t\t\t\tdesign="Approval"></me:Calendar>\n\t\t\t\t\t\t<Label text="{i18n>LBL_OD_ENDDATE}" design="Bold"></Label>\n\t\t\t\t\t\t<crm:DateInput id="d2" showValueHelp="true"\n\t\t\t\t\t\t\tvalueHelpRequest="showDD" change="checkEndDate"></crm:DateInput>\n\t\t\t\t\t\t<me:Calendar id="calEnd" visible="false" tapOnDate="changeEndDate"\n\t\t\t\t\t\t\tdesign="Approval"></me:Calendar>\n\n\t\t\t\t\t\t<!-- Expected Revenue & Weighted Revenue -->\n\t\t\t\t\t\t<Label id="lbRevHeader" class="inputControl1"\n\t\t\t\t\t\t\ttext="{i18n>LBL_OD_EXPECTEDREVENUEHEADER}" design="Bold"></Label>\n\n\t\t\t\t\t\t<Label id="lblExpRev" text="{i18n>LBL_OD_EXPECTEDREVENUE}"\n\t\t\t\t\t\t\tlabelFor="currText"></Label>\n\t\t\t\t\t\t<Input id="expRevId" change="changeExpectedSV" width="15.625rem"\n\t\t\t\t\t\t\tclass="inputControl"></Input>\n\n\t\t\t\t\t\t<Label id="lblWgtRev" text="{i18n>LBL_OD_WEIGHTEDREVENUE}"></Label>\n\t\t\t\t\t\t<Input id="wgtRevId" width="15.625rem" enabled="false"\n\t\t\t\t\t\t\tclass="inputControl"></Input>\n\n\t\t\t\t\t\t<!-- Forecast Relevance -->\n\t\t\t\t\t\t<layout:HorizontalLayout>\n\t\t\t\t\t\t\t<layout:content>\n\t\t\t\t\t\t\t\t<Label text="{i18n>LBL_OD_FORECASTRELEVANCE}" class="switchLbl"\n\t\t\t\t\t\t\t\t\tdesign="Bold"></Label>\n\t\t\t\t\t\t\t\t<Switch id="forecastId"></Switch>\n\t\t\t\t\t\t\t</layout:content>\n\t\t\t\t\t\t</layout:HorizontalLayout>\n\n\t\t\t\t\t\t<!-- Chance of Success -->\n\t\t\t\t\t\t<Label text="{i18n>LBL_OD_CHANCEOFSUCCESS}" design="Bold"></Label>\n\t\t\t\t\t\t<!-- <Slider id="slider1"></Slider> -->\n\t\t\t\t\t\t<Input id="chanceOfSucc" width="15.625rem" change="changeCOS"\n\t\t\t\t\t\t\tclass="inputControl"></Input>\n\n\t\t\t\t\t\t<!-- Sales Stage DDLB -->\n\t\t\t\t\t\t<Label text="{i18n>LBL_OD_SALESSTAGE}" design="Bold"></Label>\n\t\t\t\t\t\t<Select width="15.625rem" id="salesStage1" items="{SalesOpp>/}"\n\t\t\t\t\t\t\tclass="inputControl" change="changeSalesStage">\n\t\t\t\t\t\t\t<items>\n\t\t\t\t\t\t\t\t<core:Item text="{SalesOpp>SalesStageDescription}"\n\t\t\t\t\t\t\t\t\tkey="{SalesOpp>SalesStageCode}"></core:Item>\n\t\t\t\t\t\t\t</items>\n\t\t\t\t\t\t</Select>\n\n\t\t\t\t\t\t<!-- Status DDLB -->\n\t\t\t\t\t\t<Label text="{i18n>LBL_OD_STATUS}" design="Bold"></Label>\n\t\t\t\t\t\t<Select width="15.625rem" id="status1" items="{StatusMgt>/}"\n\t\t\t\t\t\t\tclass="inputControl">\n\t\t\t\t\t\t\t<items>\n\t\t\t\t\t\t\t\t<core:Item text="{StatusMgt>UserStatusText}" key="{StatusMgt>UserStatusCode}"></core:Item>\n\t\t\t\t\t\t\t</items>\n\t\t\t\t\t\t</Select>\n\t\t\t\t\t</layout:content>\n\t\t\t\t</layout:VerticalLayout>\n\t\t\t\t<!-- </content> </ScrollContainer> -->\n\t\t\t\t<!-- Add fields to the end of the Opportunity popover -->\n\t\t\t\t<core:ExtensionPoint name="extOpportunityPopoverEnd"></core:ExtensionPoint>\n\n\t\t\t</content>\n\t\t</Page>\n\n\t</content>\n\n\t<footer>\n\t\t<Bar>\n\t\t\t<contentMiddle>\n\t\t\t\t<Button text="{i18n>BTN_RF_OK}" press="submitChangeOpp"></Button>\n\t\t\t\t<Button text="{i18n>BTN_OD_CANCEL}" press="cancelChangeOpp"></Button>\n\t\t\t</contentMiddle>\n\t\t</Bar>\n\t</footer>\n</Popover>\n',
	"cus/crm/salespipeline/sim/view/opportunitySlider.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<Popover xmlns:core="sap.ui.core" xmlns="sap.m" xmlns:layout="sap.ui.layout"\n\tid="popup" placement="Bottom" showHeader="False" bounce="true"\n\tcontentWidth="25rem">\n\t<content width="100%">\n\t\t<Panel>\n\t\t\t<content>\n\t\t\t\t<Label id="sliderLabel" text="{i18n>LBL_ALLTO_SELECTED}"\n\t\t\t\t\ttextAlign="Center" design="Bold"></Label>\n\t\t\t\t<Slider id="opportunitySlider" liveChange="showTopNOpp"></Slider>\n\t\t\t</content>\n\t\t\t<content>\n\t\t\t\t<CheckBox text="{i18n>LBL_CBX_EXCLUDE_LOST}" id="exLostCheck"\n\t\t\t\t\tselect="showTopNOpp"></CheckBox>\n\t\t\t\t<CheckBox text="{i18n>LBL_CBX_EXCLUDE_WON}" id="exWonCheck"\n\t\t\t\t\tselect="showTopNOpp"></CheckBox>\n\t\t\t</content>\n\t\t</Panel>\n\t</content>\n</Popover>',
	"cus/crm/salespipeline/sim/view/resetDialog.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<!-- Reset DIALOG -->\n<Dialog xmlns="sap.m" xmlns:layout="sap.ui.layout" class="dialogBox"\n\tid="RefreshDialog" title="{i18n>RESET_TITLE}">\n\t<content>\n\t\t<layout:VerticalLayout class="settingPad">\n\t\t\t<layout:content>\n\t\t\t\t<Text id="resetText" text="{i18n>LBL_CONFIRM_REFRESH}"></Text>\n\t\t\t</layout:content>\n\t\t</layout:VerticalLayout>\n\t\t<!-- <VBox class="settingPad"> <items> <Text id="resetText" text="{i18n>LBL_CONFIRM_REFRESH}"></Text> \n\t\t\t</items> </VBox> -->\n\t</content>\n\t<beginButton>\n\t\t<Button id="rfButOK" text="{i18n>BTN_RF_OK}" press="refreshDlg"></Button>\n\t</beginButton>\n\t<endButton>\n\t\t<Button id="rfButCancel" text="{i18n>BTN_RF_CANCEL}" press="refreshDlg"></Button>\n\t</endButton>\n</Dialog>',
	"cus/crm/salespipeline/sim/view/settingsDialog.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<!-- App Settings Dialog -->\n<Dialog xmlns="sap.m" id="dlAppSettings" title="{i18n>APPSETTINGS_TITLE}">\n\t<content>\n\t\t<List id="mplSettings" class="settingPad" showNoData="false"\n\t\t\tselect="selectDlgSetting" mode="SingleSelectMaster">\n\t\t\t<items>\n\t\t\t\t<StandardListItem id="sliSaTa" icon="sap-icon://sales-order-item"\n\t\t\t\t\ttitle="{i18n>SALESTARGET_ITEM}" type="Navigation"></StandardListItem>\n\t\t\t\t<!-- <StandardListItem id="sliOppo" icon="sap-icon://opportunity" title="{i18n>OPPORTUNITY_ITEM}" \n\t\t\t\t\ttype="Navigation"></StandardListItem> -->\n\t\t\t</items>\n\t\t</List>\n\t</content>\n\t<beginButton>\n\t\t<Button id="asButClose" text="{i18n>BTN_CLOSE_APPSETT}" press="closeAppSettDialog"></Button>\n\t</beginButton>\n</Dialog>\n<!-- Opportunity Settings Dialog -->\n\t<!-- <Dialog id="dlOpportunitySet" showHeader="true" beforeOpen="settCheck">\n\t\t<customHeader>\n\t\t\t<Bar>\n\t\t\t\t<contentMiddle>\n\t\t\t\t\t<Label id="titleOP" class="hTitleEN" text="{i18n>AS_OPPORTUNITY_TITLE}"\n\t\t\t\t\t\ttextAlign="Center"></Label>\n\t\t\t\t</contentMiddle>\n\t\t\t\t<contentLeft>\n\t\t\t\t\t<Button id="OPnavBack" icon="sap-icon://nav-back" press="navBack"></Button>\n\t\t\t\t</contentLeft>\n\t\t\t</Bar>\n\t\t</customHeader>\n\t\t<content>\n\t\t\t<VBox id="opVBox" class="settingPad">\n\t\t\t\t<items>\n\t\t\t\t\t<Label id="lbStep" text="{i18n>LBL_OP_STEPVALUE}" labelFor="iStepOpp"\n\t\t\t\t\t\tdesign="Bold"></Label>\n\t\t\t\t\t<Input id="iStepOpp" class="inputControl" change="checkValue"\n\t\t\t\t\t\tvalue="{path:\'SettingsForSave>/OpportunityStepValue\',formatter:\'cus.crm.salespipeline.sim.util.formatter.displayNumbers\'}"></Input>\n\t\t\t\t\t<HBox direction="Row" justifyContent="SpaceBetween"> <items> <Label \n\t\t\t\t\t\tid="lbSw" textAlign="Left" text="{i18n>LBL_OP_SETVALUES}" labelFor="swOp" \n\t\t\t\t\t\tdesign="Bold" class="switchLbl"></Label> <Switch id="swOpp" type="Default" \n\t\t\t\t\t\tstate="{SettingsForSave>/SetValuesManually}"></Switch> </items> </HBox>\n\t\t\t\t\t<Label id="lbMinOpp" text="{i18n>LBL_OP_MINVALUE}" labelFor="iMinOpp" \n\t\t\t\t\t\ttextAlign="Left" design="Bold" visible="{SettingsForSave>/SetValuesManually}"></Label> \n\t\t\t\t\t\t<Input id="iMinOpp" class="inputControl" value="{path:\'SettingsForSave>/OpportunityMinValue\',formatter:\'.displayNumbers\'}" \n\t\t\t\t\t\tvisible="{SettingsForSave>/SetValuesManually}"></Input> <Label id="lbMaxOpp" \n\t\t\t\t\t\ttext="{i18n>LBL_OP_MAXVALUE}" labelFor="iMaxOpp" textAlign="Left" design="Bold" \n\t\t\t\t\t\tvisible="{SettingsForSave>/SetValuesManually}"></Label> <Input id="iMaxOpp" \n\t\t\t\t\t\tclass="inputControl" value="{path:\'SettingsForSave>/OpportunityMaxValue\',formatter:\'.displayNumbers\'}" \n\t\t\t\t\t\tvisible="{SettingsForSave>/SetValuesManually}"></Input>\n\t\t\t\t</items>\n\t\t\t</VBox>\n\t\t</content>\n\t\t<beginButton>\n\t\t\t<Button id="opButSave" text="{i18n>BTN_AS_SAVEAPPSETT}" press="saveAppSetChange"></Button>\n\t\t</beginButton>\n\t\t<endButton>\n\t\t\t<Button id="opButCancel" text="{i18n>BTN_AS_CANCELAPPSETT}"\n\t\t\t\tpress="cancelAppSetChange"></Button>\n\t\t</endButton>\n\t</Dialog> -->',
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
								.getRTL(), sAnchorVal = oBrowser.name === oBrowser.BROWSER.INTERNET_EXPLORER ? "end"
								: "start", iXoffset = bIsRTL ? Tooltip_Width - 5
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

							if (_chartControl._selectedbubble.cx.baseVal.value
									- _chartControl._selectedbubble.r.baseVal.value
									- cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value) >= Tooltip_Width
									&& _chartControl._selectedbubble.cy.baseVal.value <= Tooltip_Height / 2) {

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

							else if (_chartControl._selectedbubble.cx.baseVal.value
									- _chartControl._selectedbubble.r.baseVal.value
									- cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value) >= Tooltip_Width
									&& _chartControl._selectedbubble.cy.baseVal.value >= myheightchartarea)

							{

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

										});

							}

							else if (_chartControl._selectedbubble.cx.baseVal.value
									- _chartControl._selectedbubble.r.baseVal.value
									- cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value) >= Tooltip_Width)

							{

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

							}

							else if (_chartControl._selectedbubble.cy.baseVal.value
									- _chartControl._selectedbubble.r.baseVal.value
									- cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value) >= Tooltip_Height)

							{
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

							else if (myheightchartarea
									- (_chartControl._selectedbubble.cy.baseVal.value
											+ _chartControl._selectedbubble.r.baseVal.value + cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value)) >= Tooltip_Height) {

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

							else {

								var xpos = _chartControl._selectedbubble.cx.baseVal.value
										+ _chartControl._selectedbubble.r.baseVal.value
										+ cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value)
										+ 10;
								var ypos = _chartControl._selectedbubble.cy.baseVal.value

										- (Tooltip_Height / 2);

								tooltip.selectAll('path').remove();
								var x = -10;
								var y = Tooltip_Height / 2;
								if (_chartControl._selectedbubble.cy.baseVal.value <= Tooltip_Height / 2) {
									var ypos = _chartControl._selectedbubble.cy.baseVal.value

											- (Tooltip_Height / 4);
									var x = -10;
									var y = Tooltip_Height / 4;

								}

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
											/*
											 * x :
											 * cal_inv_x(_chartControl._selectedbubble.cx.baseVal.value),
											 * y :
											 * cal_inv_y(_chartControl._selectedbubble.cy.baseVal.value),
											 */
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
										// z :
										// cal_inv_r(_chartControl._selectedbubble.r.baseVal.value)
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
							if (oBrowser.name != oBrowser.BROWSER.INTERNET_EXPLORER) {

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
	"sap/crm/DateInput.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.crm.DateInput");
jQuery.sap.require("sap.m.library");
jQuery.sap.require("sap.m.Input");
sap.m.Input.extend("sap.crm.DateInput", {});
sap.crm.DateInput.prototype._getValueHelpIcon = function() {
	var t = this;
	if (!this._oValueHelpIcon) {
		var u = sap.ui.core.IconPool.getIconURI("appointment-2");
		this._oValueHelpIcon = sap.ui.core.IconPool.createControlByURI({
			id : this.getId() + "__vhi",
			src : u
		});
		this._oValueHelpIcon.addStyleClass("sapMInputValHelpInner");
		this._oValueHelpIcon.attachPress(function(e) {
			t.fireValueHelpRequest();
		});
	}
	return this._oValueHelpIcon;
};


},
	"sap/crm/DateInputRenderer.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// Input Renderer

/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.require("sap.ui.core.Renderer");
jQuery.sap.require("sap.m.InputRenderer");
jQuery.sap.declare("sap.crm.DateInputRenderer");
sap.crm.DateInputRenderer = sap.ui.core.Renderer.extend(sap.m.InputRenderer);
sap.crm.DateInputRenderer.writeInnerContent = function(r, c) {
	if (c.getShowValueHelp() && c.getEnabled()) {
		r.write('<div class="sapMInputValHelp">');
		r.renderControl(c._getValueHelpIcon());
		r.write("</div>");
	}
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
 * (c) Copyright 2009-2014 SAP AG. All rights reserved
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
