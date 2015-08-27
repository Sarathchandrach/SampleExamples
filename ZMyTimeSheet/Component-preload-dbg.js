jQuery.sap.registerPreloadedModules({
"name":"hcm/emp/mytimesheet/Component-preload",
"version":"2.0",
"modules":{
	"hcm/emp/mytimesheet/Component.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.mytimesheet.Component");
jQuery.sap.require("hcm.emp.mytimesheet.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

// new Component
sap.ca.scfld.md.ComponentBase
		.extend(
				"hcm.emp.mytimesheet.Component",
				{

					metadata : sap.ca.scfld.md.ComponentBase
							.createMetaData(
									'FS',
									{
										"name" : "My Timesheet", //F0397
										"version" : "1.4.4",
										"library" : "hcm.emp.mytimesheet",
										"includes" : [],
										"dependencies" : {
											"libs" : [ "sap.m", "sap.me" ],
											"components" : []
										},
										"config" : {
											"titleResource" : "TIMESHEET_TITLE",
											"resourceBundle" : "i18n/i18n.properties",
											"icon" : "sap-icon://Fiori2/F0397",
											"favIcon" : "./resources/sap/ca/ui/themes/base/img/favicon/My_Timesheet.ico",
											"homeScreenIconPhone" : "./resources/sap/ca/ui/themes/base/img/launchicon/My_Timesheet/57_iPhone_Desktop_Launch.png",
											"homeScreenIconPhone@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/My_Timesheet/114_iPhone-Retina_Web_Clip.png",
											"homeScreenIconTablet" : "./resources/sap/ca/ui/themes/base/img/launchicon/My_Timesheet/72_iPad_Desktop_Launch.png",
											"homeScreenIconTablet@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/My_Timesheet/144_iPad_Retina_Web_Clip.png"
										},
										viewPath : "hcm.emp.mytimesheet.view",
										fullScreenPageRoutes : {
											// fill the routes to your full screen pages in here.
											"S2" : {
												"pattern" : "",
												"view" : "S2"
											},
											//toggle comments for new and old scenario

											/*                				"WeekEntry": {
											 "pattern": "detail/{context}", 
											 "view": "WeekEntry"
											 }, */

											"S3" : {
												"pattern" : "detail/{context}",
												"view" : "S3"
											},
											"S31" : {
												"pattern" : "subdetail",
												"view" : "S31"
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
							viewName : "hcm.emp.mytimesheet.Main",
							type : sap.ui.core.mvc.ViewType.XML,
							viewData : oViewData
						});
					},
					eventbus : sap.ui.getCore().getEventBus()
				});
},
	"hcm/emp/mytimesheet/Configuration.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.mytimesheet.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ca.scfld.md.ConfigurationBase.extend("hcm.emp.mytimesheet.Configuration", {
    oServiceParams: {
        serviceList: [   
            {
                name: "SRA002_TIMESHEET_SRV",
                masterCollection: "WorkListCollection",
                serviceUrl: "/sap/opu/odata/sap/SRA002_TIMESHEET_SRV/",
                isDefault: true,
                mockedDataSource: "/hcm.emp.mytimesheet/model/metadata.xml"
            }
        ]
    },
	getServiceParams: function () {
		return this.oServiceParams;
	},
	/**
	 * @inherit
	 */
	getServiceList: function () {
		return this.oServiceParams.serviceList;
	},

	getMasterKeyAttributes: function () {
		return ["Id"];
	},

});

},
	"hcm/emp/mytimesheet/Main.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("hcm.emp.mytimesheet.Main", {

	onInit : function() {
        jQuery.sap.require("sap.ca.scfld.md.Startup");				
		sap.ca.scfld.md.Startup.init('hcm.emp.mytimesheet', this);
		
		var effectiveUrl = jQuery.sap.getModulePath("hcm.emp.mytimesheet") + "/" + "css/style.css";

		jQuery.sap.includeStyleSheet(effectiveUrl, "notes_css");


	},
	
	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * 
	 * @memberOf MainXML
	 */
	onExit : function() {
		//exit cleanup code here
	}
		
});
},
	"hcm/emp/mytimesheet/Main.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core"\n\txmlns="sap.m" controllerName="hcm.emp.mytimesheet.Main" displayBlock="true" height="100%">                         \n\t<App  id="fioriContent" showHeader="false">                                                              \t\n\t</App >                                                                                                  \t\n</core:View>',
	"hcm/emp/mytimesheet/i18n/i18n.properties":'# HcmTimeSheetManage\n# __ldi.translation.uuid=7BD49A70-31B1-11E3-AA6E-0800200C9A66\n\n#XFLD: label for from time\nFROM=from\n\n#XFLD: label for to time\nTO=to\n\n#XBUT: Button to cancel\nCANCEL=Cancel\n\n#XBUT: Button to close popover\nCLOSE=Close\n\n#XBUT: Button to accept\nOK=OK\n\n#XBUT: Button to Save Draft\nSAVE_DRAFT=Save Draft\n\n# XTIT: \nTIMESHEET_TITLE=My Timesheet\n\n# XTIT: \nTIMESHEET=Time Sheet Entries\n\n# XTIT: \nWEEKENTRY_TITLE=Manual Entry\n\n#XBUT: Button for quick entry\nQUICK_FILL=Quick Entry\n\n# XFLD: Apply to\nENTRY_VIEW_APPLY_TO=Apply To\n\n# XTIT: \nTIMESHEET_DETAILS_TITLE=Details\n\n# XTIT: Title for create entry view\nTIMESHEET_CREATE_ENTRY_TITLE=Create Time Entry\n\n# XTIT: Title for create entry view with multiple days selected\nTIMESHEET_CREATE_ENTRIES_TITLE=Create Entry for {0} days\n\n# XTIT: Title for Entry Details\nENTRY_DETAILS=Entry Details\n\n# XTIT: Title for edit entry view for a particular date ({0} = date)\nTIMESHEET_EDIT_ENTRY_TITLE=Entry Details for {0}\n\n# XTIT: Title for create entry view for a particular date ({0} = date)\nTIMESHEET_NEW_ENTRY_TITLE=Create Entry for {0}\n\n# XTIT: Month short header\nMONTH_0=Jan\n# XTIT: Month short header\nMONTH_1=Feb\n# XTIT: Month short header\nMONTH_2=Mar\n# XTIT: Month short header\nMONTH_3=Apr\n# XTIT: Month short header\nMONTH_4=May\n# XTIT: Month short header\nMONTH_5=Jun\n# XTIT: Month short header\nMONTH_6=Jul\n# XTIT: Month short header\nMONTH_7=Aug\n# XTIT: Month short header\nMONTH_8=Sep\n# XTIT: Month short header\nMONTH_9=Oct\n# XTIT: Month short header\nMONTH_10=Nov\n# XTIT: Month short header\nMONTH_11=Dec\n\n# XTIT: Month title for calendar\nMONTH_FULL_0=January\n# XTIT: Month title for calendar\nMONTH_FULL_1=February\n# XTIT: Month title for calendar\nMONTH_FULL_2=March\n# XTIT: Month title for calendar\nMONTH_FULL_3=April\n# XTIT: Month title for calendar\nMONTH_FULL_4=May\n# XTIT: Month title for calendar\nMONTH_FULL_5=June\n# XTIT: Month title for calendar\nMONTH_FULL_6=July\n# XTIT: Month title for calendar\nMONTH_FULL_7=August\n# XTIT: Month title for calendar\nMONTH_FULL_8=September\n# XTIT: Month title for calendar\nMONTH_FULL_9=October\n# XTIT: Month title for calendar\nMONTH_FULL_10=November\n# XTIT: Month title for calendar\nMONTH_FULL_11=December\n\n# XTIT: Legend missing day\nMISSING_DAY=Your Action Needed\n# XTIT: Legend filled day\nFILLED_DAY=Done\n# XTIT: Legend filled in process, manager action needed\nFILLED_MANAGER=Approver Action Needed\n# XFLD: Rejected by manager - this appears on the legend\nREJECTED=Rejected\n# XFLD: Legend future working day\nWORKING_DAY=Workday\n# XFLD: Legend non-working day\nNON_WORKING_DAY=Non-working day\n\n# XMSG: Footer information about missing hours\nTOTAL_MISSING=Total Missing Hours: {0}\n\n#XFLD:\nMONTH_YEAR={0} {1} ({2} hours)\n\n#XBUT: Button\nSAVE=Save\n\n#XBUT: Button \nSUBMIT=Submit\n\n#XBUT: Button for quick entry\nSMART_FILL=Auto Entry\n\n# XMSG\nFILL_ALL=Enter {0} hours for:\n\n#XFLD\nNO_TASK_TYPE=No Task Type\n\n#XFLD\nMISSING_DAYS=Missing Days:{0}\n\n#XBUT: Button\nHOME=Home\n\n#XTIT: confirmation header\nCONFIRMATION=Confirmation\n\n#XTIT: deletion confirmation header\nDELETE_CONFIRMATION=Confirm Deletion\n\n#XTIT: submission confirmation header\nSUBMISSION_CONFIRMATION=Confirm Submission\n\n#XTIT: Draft submission confirmation header\nDRAFT_CONFIRMATION=Confirm Draft\n\n#XFLD: label for Deletion summary in Dialog\nDELETE_CONFIRMATION_SUMMARY=Summary of time entries selected for Deletion\n\n#XFLD: label for Submission summary in Dialog\nSUBMISSION_CONFIRMATION_SUMMARY=Summary of time entries selected for Submission\n\n#XFLD: label for Draft Submission summary in Dialog\nDRAFT_CONFIRMATION_SUMMARY=Summary of time entries selected\n\n#XFLD: label for Number of entries in Dialog\nDELETE_CONFIRMATION_SUMMARY_ENTRIES=Number of Entries\n\n#XFLD: label for Number of hours in Dialog\nDELETE_CONFIRMATION_SUMMARY_HOURS=Number of Hours\n\n#XBUT: Confirm Button\nCONFIRM=Confirm\n\n#XMSG: Summary for confirmation - these are two dates\nSUMMARY={0} - {1}\n\n#XFLD: Week \nWEEK=Week\n\n#XFLD:\nMEET_TARGET_HOURS=Apply hours to:\n\n#XBUT\nTHIS_WEEK=Current Week ({0} hours)\n\n#XBUT\nALL_MISSING=All Missing Time ({0} hours)\n\n#XBUT: Delete Button Text\nDELETE=Delete\n\n#XBUT: Add Button Text for Weekly Entry nav button\nNAV_ADD=Add Entry\n\n#XFLD: label for duration\nDURATION=Duration\n\n#XFLD: label for total duration\nTOTAL_DURATION=Total Duration\n\n#XFLD: label for status\nSTATUS=Status\n\n#XFLD: label for start time\nSTART_TIME=Start Time\n\n#XFLD: label for end Time\nEND_TIME=End Time\n\n#XFLD: label for note\nNOTE=Note\n\n#XFLD: label for Add New week entry\nADD_NEW=New Entry\n\n#XBUT: Done button\nDONE=Done\n\n# XTIT: Recently Used\nRECENTLY_USED=Suggestions\n\n# XTIT: Manual Input Add\nMANUAL_INPUT_ADD=Manual\n\n# XTIT: Manual Input Edit\nMANUAL_INPUT_EDIT=Edit Entry\n\n# XTIT: Cost Assignment\nCOST_ASSIGNMENT=Time Assignment\n\n#XFLD: Tap to Load More\nTAP_TO_LOAD_MORE=Load More\n\n#XFLD: Tap to Load More Loading\nTAP_TO_LOAD_MORE_LOADING=Loading...\n\n#XFLD: Continue Search on Server\nCONTINUE_SEARCH_ON_SERVER=Continue Search on Server...\n\n#XFLD: Continue Search on Server Loading\nCONTINUE_SEARCH_ON_SERVER_LOADING=Loading...\n\n#XFLD: BLANK\nEMPTY=Empty\n\n#XFLD: None\nNONE=None\n\n# XTIT: Select\nSELECT=Select {0}\n\n# XTIT: Placeholder for Cost Assignment Picker indicating Select action\nSELECT_PLACEHOLDER=Select\n\n#XFLD: Placeholder for cost assignment type search\nSEARCH=Search...\n\n#XFLD: short label for hours\nHOURS_LABEL=h\n\n#XFLD: short label for minutes\nMINUTES_LABEL=m\n\n#XFLD: full label for hours \nHOURS_LABEL_FULL=hours\n\n#XFLD: full label for minutes\nMINUTES_LABEL_FULL=minutes\n\n#XFLD: label for date. When localizing do not change the MMM DD or YYYY, just the order of them\nDATE_LOCALE=MMM DD, YYYY\n\n\n#XBUT:\nDETAIL=Detail\n\n\n#XFLD: label for Settings title\nSETTINGS_TITLE=Settings\n#XFLD: label for Settings data entry profile\nSETTINGS_DATA_ENTRY_PROFILE=Data Entry Profile\n#XFLD: label for Settings pre-fill label\nSETTINGS_PREFILL_LAST_WEEK=Auto Suggest\n\n# XMSG: \nCONFIRM_LEAVE_PAGE=Any unsaved data will be discarded. Are you sure you want to proceed?\n# XTIT: \nUNSAVED_CHANGES=Unsaved Changes\n\n#XMSG: toast message for successful submit\nSUBMIT_SUCCESS=Request Submitted\n\n#XMSG: toast message for successful draft submit\nDRAFT_SUCCESS=Draft Saved Successfully\n\n#XBUT:\nHELP=Help\n\n#XMSG: confirmation message for week entry\nTOTAL_BOOKED={0}/{1} hours entered for this week.\n\n#XMSG: help text for pre-fill option\nHELP_PREFILL=Turn ON Pre-Fill to quickly populate hours for the week based on your last successful entry.\n\n#XMSG: error pop-up message text\nERROR_SUBMIT_AUTO_ENTRY=Submit failed. Review error details.\n\n#XMSG: error pop-up message text\nERROR_SUBMIT=Some entries are incorrect. Review error details and correct entries.\n\n#XMSG: error pop-up message text\nSUBMIT_HEADER_TEXT=Time entry for {0} and {1} more day(s)\n\n# XTIT: Title for create entry view\nTIMESHEET_EDIT_ENTRY_TITLE_SCREEN=Edit Time Entry\n\n#XMSG: Header in edit screen for single date\nSUBMIT_HEADER_TEXT_SINGLE=Time entry for {0}\n\n# XFLD: Concatenate hours and minutes full\nFULL_CONCATENATE_HOURSMIN={0}hours {1}minutes\n\n# XFLD: Concatenate hours and minutes full\nSHORT_CONCATENATE_HOURSMIN={0}h {1}m\n\n#XBUT: Button to reset\nRESET=Reset\n\n#XBUT: Button to create\nCREATE=Create',
	"hcm/emp/mytimesheet/i18n/i18n_ar.properties":'\r\n#XFLD: label for from time\r\nFROM=\\u0645\\u0646\r\n\r\n#XFLD: label for to time\r\nTO=\\u0625\\u0644\\u0649\r\n\r\n#XBUT: Button to cancel\r\nCANCEL=\\u0625\\u0644\\u063A\\u0627\\u0621\r\n\r\n#XBUT: Button to close popover\r\nCLOSE=\\u0625\\u063A\\u0644\\u0627\\u0642\r\n\r\n#XBUT: Button to accept\r\nOK=\\u0645\\u0648\\u0627\\u0641\\u0642\r\n\r\n#XBUT: Button to Save Draft\r\nSAVE_DRAFT=\\u062D\\u0641\\u0638 \\u0627\\u0644\\u0645\\u0633\\u0648\\u062F\\u0629\r\n\r\n# XTIT: \r\nTIMESHEET_TITLE=\\u0633\\u062C\\u0644 \\u0627\\u0644\\u062D\\u0636\\u0648\\u0631 \\u0627\\u0644\\u062E\\u0627\\u0635 \\u0628\\u064A\r\n\r\n# XTIT: \r\nTIMESHEET=\\u0625\\u062F\\u062E\\u0627\\u0644\\u0627\\u062A \\u0633\\u062C\\u0644 \\u0627\\u0644\\u062D\\u0636\\u0648\\u0631\r\n\r\n# XTIT: \r\nWEEKENTRY_TITLE=\\u0625\\u062F\\u062E\\u0627\\u0644 \\u064A\\u062F\\u0648\\u064A\r\n\r\n#XBUT: Button for quick entry\r\nQUICK_FILL=\\u0625\\u062F\\u062E\\u0627\\u0644 \\u0633\\u0631\\u064A\\u0639\r\n\r\n# XFLD: Apply to\r\nENTRY_VIEW_APPLY_TO=\\u062A\\u0637\\u0628\\u064A\\u0642 \\u0639\\u0644\\u0649\r\n\r\n# XTIT: \r\nTIMESHEET_DETAILS_TITLE=\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_CREATE_ENTRY_TITLE=\\u0625\\u0646\\u0634\\u0627\\u0621 \\u0625\\u062F\\u062E\\u0627\\u0644 \\u0648\\u0642\\u062A\r\n\r\n# XTIT: Title for create entry view with multiple days selected\r\nTIMESHEET_CREATE_ENTRIES_TITLE=\\u0625\\u0646\\u0634\\u0627\\u0621 \\u0625\\u062F\\u062E\\u0627\\u0644 \\u0644\\u0639\\u062F\\u062F {0} \\u0645\\u0646 \\u0627\\u0644\\u0623\\u064A\\u0627\\u0645\r\n\r\n# XTIT: Title for Entry Details\r\nENTRY_DETAILS=\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u0625\\u062F\\u062E\\u0627\\u0644\r\n\r\n# XTIT: Title for edit entry view for a particular date ({0} = date)\r\nTIMESHEET_EDIT_ENTRY_TITLE=\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u0625\\u062F\\u062E\\u0627\\u0644 \\u0644\\u0639\\u062F\\u062F {0}\r\n\r\n# XTIT: Title for create entry view for a particular date ({0} = date)\r\nTIMESHEET_NEW_ENTRY_TITLE=\\u0625\\u0646\\u0634\\u0627\\u0621 \\u0625\\u062F\\u062E\\u0627\\u0644 \\u0644\\u0639\\u062F\\u062F {0}\r\n\r\n# XTIT: Month short header\r\nMONTH_0=\\u064A\\u0646\\u0627\\u064A\\u0631\r\n# XTIT: Month short header\r\nMONTH_1=\\u0641\\u0628\\u0631\\u0627\\u064A\\u0631\r\n# XTIT: Month short header\r\nMONTH_2=\\u0645\\u0627\\u0631\\u0633\r\n# XTIT: Month short header\r\nMONTH_3=\\u0623\\u0628\\u0631\\u064A\\u0644\r\n# XTIT: Month short header\r\nMONTH_4=\\u0645\\u0627\\u064A\\u0648\r\n# XTIT: Month short header\r\nMONTH_5=\\u064A\\u0648\\u0646\\u064A\\u0648\r\n# XTIT: Month short header\r\nMONTH_6=\\u064A\\u0648\\u0644\\u064A\\u0648\r\n# XTIT: Month short header\r\nMONTH_7=\\u0623\\u063A\\u0633\\u0637\\u0633\r\n# XTIT: Month short header\r\nMONTH_8=\\u0633\\u0628\\u062A\\u0645\\u0628\\u0631\r\n# XTIT: Month short header\r\nMONTH_9=\\u0623\\u0643\\u062A\\u0648\\u0628\\u0631\r\n# XTIT: Month short header\r\nMONTH_10=\\u0646\\u0648\\u0641\\u0645\\u0628\\u0631\r\n# XTIT: Month short header\r\nMONTH_11=\\u062F\\u064A\\u0633\\u0645\\u0628\\u0631\r\n\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_0=\\u064A\\u0646\\u0627\\u064A\\u0631\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_1=\\u0641\\u0628\\u0631\\u0627\\u064A\\u0631\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_2=\\u0645\\u0627\\u0631\\u0633\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_3=\\u0623\\u0628\\u0631\\u064A\\u0644\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_4=\\u0645\\u0627\\u064A\\u0648\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_5=\\u064A\\u0648\\u0646\\u064A\\u0648\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_6=\\u064A\\u0648\\u0644\\u064A\\u0648\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_7=\\u0623\\u063A\\u0633\\u0637\\u0633\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_8=\\u0633\\u0628\\u062A\\u0645\\u0628\\u0631\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_9=\\u0623\\u0643\\u062A\\u0648\\u0628\\u0631\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_10=\\u0646\\u0648\\u0641\\u0645\\u0628\\u0631\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_11=\\u062F\\u064A\\u0633\\u0645\\u0628\\u0631\r\n\r\n# XTIT: Legend missing day\r\nMISSING_DAY=\\u0627\\u0644\\u0625\\u062C\\u0631\\u0627\\u0621 \\u0645\\u0637\\u0644\\u0648\\u0628\r\n# XTIT: Legend filled day\r\nFILLED_DAY=\\u062A\\u0645\r\n# XTIT: Legend filled in process, manager action needed\r\nFILLED_MANAGER=\\u0625\\u062C\\u0631\\u0627\\u0621 \\u0627\\u0644\\u0645\\u0639\\u062A\\u0645\\u0650\\u062F \\u0645\\u0637\\u0644\\u0648\\u0628\r\n# XFLD: Rejected by manager - this appears on the legend\r\nREJECTED=\\u0645\\u0631\\u0641\\u0648\\u0636\r\n# XFLD: Legend future working day\r\nWORKING_DAY=\\u064A\\u0648\\u0645 \\u0639\\u0645\\u0644\r\n# XFLD: Legend non-working day\r\nNON_WORKING_DAY=\\u064A\\u0648\\u0645 \\u0639\\u0637\\u0644\\u0629\r\n\r\n# XMSG: Footer information about missing hours\r\nTOTAL_MISSING=\\u0625\\u062C\\u0645\\u0627\\u0644\\u064A \\u0627\\u0644\\u0633\\u0627\\u0639\\u0627\\u062A \\u0627\\u0644\\u0645\\u0641\\u0642\\u0648\\u062F\\u0629\\: {0}\r\n\r\n#XFLD:\r\nMONTH_YEAR={0} {1} ({2} \\u0645\\u0646 \\u0627\\u0644\\u0633\\u0627\\u0639\\u0627\\u062A)\r\n\r\n#XBUT: Button\r\nSAVE=\\u062D\\u0641\\u0638\r\n\r\n#XBUT: Button \r\nSUBMIT=\\u0625\\u0631\\u0633\\u0627\\u0644\r\n\r\n#XBUT: Button for quick entry\r\nSMART_FILL=\\u0625\\u062F\\u062E\\u0627\\u0644 \\u062A\\u0644\\u0642\\u0627\\u0626\\u064A\r\n\r\n# XMSG\r\nFILL_ALL=\\u0623\\u062F\\u062E\\u0644 {0} \\u0645\\u0646 \\u0627\\u0644\\u0633\\u0627\\u0639\\u0627\\u062A \\u0644\\u0640\\:\r\n\r\n#XFLD\r\nNO_TASK_TYPE=\\u0628\\u062F\\u0648\\u0646 \\u0646\\u0648\\u0639 \\u0645\\u0647\\u0645\\u0629\r\n\r\n#XFLD\r\nMISSING_DAYS=\\u0627\\u0644\\u0623\\u064A\\u0627\\u0645 \\u0627\\u0644\\u0645\\u0641\\u0642\\u0648\\u062F\\u0629\\:{0}\r\n\r\n#XBUT: Button\r\nHOME=\\u0627\\u0644\\u0635\\u0641\\u062D\\u0629 \\u0627\\u0644\\u0631\\u0626\\u064A\\u0633\\u064A\\u0629\r\n\r\n#XTIT: confirmation header\r\nCONFIRMATION=\\u062A\\u0623\\u0643\\u064A\\u062F\r\n\r\n#XTIT: deletion confirmation header\r\nDELETE_CONFIRMATION=\\u062A\\u0623\\u0643\\u064A\\u062F \\u0627\\u0644\\u062D\\u0630\\u0641\r\n\r\n#XTIT: submission confirmation header\r\nSUBMISSION_CONFIRMATION=\\u062A\\u0623\\u0643\\u064A\\u062F \\u0627\\u0644\\u0625\\u0631\\u0633\\u0627\\u0644\r\n\r\n#XTIT: Draft submission confirmation header\r\nDRAFT_CONFIRMATION=\\u062A\\u0623\\u0643\\u064A\\u062F \\u0627\\u0644\\u0645\\u0633\\u0648\\u062F\\u0629\r\n\r\n#XFLD: label for Deletion summary in Dialog\r\nDELETE_CONFIRMATION_SUMMARY=\\u0645\\u0644\\u062E\\u0635 \\u0625\\u062F\\u062E\\u0627\\u0644\\u0627\\u062A \\u0627\\u0644\\u0648\\u0642\\u062A \\u0627\\u0644\\u0645\\u062D\\u062F\\u062F\\u0629 \\u0644\\u0644\\u062D\\u0630\\u0641\r\n\r\n#XFLD: label for Submission summary in Dialog\r\nSUBMISSION_CONFIRMATION_SUMMARY=\\u0645\\u0644\\u062E\\u0635 \\u0625\\u062F\\u062E\\u0627\\u0644\\u0627\\u062A \\u0627\\u0644\\u0648\\u0642\\u062A \\u0627\\u0644\\u0645\\u062D\\u062F\\u062F\\u0629 \\u0644\\u0644\\u0625\\u0631\\u0633\\u0627\\u0644\r\n\r\n#XFLD: label for Draft Submission summary in Dialog\r\nDRAFT_CONFIRMATION_SUMMARY=\\u0645\\u0644\\u062E\\u0635 \\u0625\\u062F\\u062E\\u0627\\u0644\\u0627\\u062A \\u0627\\u0644\\u0648\\u0642\\u062A \\u0627\\u0644\\u0645\\u062D\\u062F\\u062F\\u0629\r\n\r\n#XFLD: label for Number of entries in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_ENTRIES=\\u0639\\u062F\\u062F \\u0627\\u0644\\u0625\\u062F\\u062E\\u0627\\u0644\\u0627\\u062A\r\n\r\n#XFLD: label for Number of hours in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_HOURS=\\u0639\\u062F\\u062F \\u0627\\u0644\\u0633\\u0627\\u0639\\u0627\\u062A\r\n\r\n#XBUT: Confirm Button\r\nCONFIRM=\\u062A\\u0623\\u0643\\u064A\\u062F\r\n\r\n#XMSG: Summary for confirmation - these are two dates\r\nSUMMARY={0} - {1}\r\n\r\n#XFLD: Week \r\nWEEK=\\u0627\\u0644\\u0623\\u0633\\u0628\\u0648\\u0639\r\n\r\n#XFLD:\r\nMEET_TARGET_HOURS=\\u062A\\u0637\\u0628\\u064A\\u0642 \\u0627\\u0644\\u0633\\u0627\\u0639\\u0627\\u062A \\u0639\\u0644\\u0649\\:\r\n\r\n#XBUT\r\nTHIS_WEEK=\\u0627\\u0644\\u0623\\u0633\\u0628\\u0648\\u0639 \\u0627\\u0644\\u062D\\u0627\\u0644\\u064A ({0} \\u0645\\u0646 \\u0627\\u0644\\u0633\\u0627\\u0639\\u0627\\u062A)\r\n\r\n#XBUT\r\nALL_MISSING=\\u0627\\u0644\\u0648\\u0642\\u062A \\u0627\\u0644\\u0645\\u0641\\u0642\\u0648\\u062F \\u0628\\u0627\\u0644\\u0643\\u0627\\u0645\\u0644 ({0} \\u0645\\u0646 \\u0627\\u0644\\u0633\\u0627\\u0639\\u0627\\u062A)\r\n\r\n#XBUT: Delete Button Text\r\nDELETE=\\u062D\\u0630\\u0641\r\n\r\n#XBUT: Add Button Text for Weekly Entry nav button\r\nNAV_ADD=\\u0625\\u0636\\u0627\\u0641\\u0629 \\u0625\\u062F\\u062E\\u0627\\u0644\r\n\r\n#XFLD: label for duration\r\nDURATION=\\u0627\\u0644\\u0645\\u062F\\u0629\r\n\r\n#XFLD: label for total duration\r\nTOTAL_DURATION=\\u0625\\u062C\\u0645\\u0627\\u0644\\u064A \\u0627\\u0644\\u0645\\u062F\\u0629\r\n\r\n#XFLD: label for status\r\nSTATUS=\\u0627\\u0644\\u062D\\u0627\\u0644\\u0629\r\n\r\n#XFLD: label for start time\r\nSTART_TIME=\\u0648\\u0642\\u062A \\u0627\\u0644\\u0628\\u062F\\u0627\\u064A\\u0629\r\n\r\n#XFLD: label for end Time\r\nEND_TIME=\\u0648\\u0642\\u062A \\u0627\\u0644\\u0627\\u0646\\u062A\\u0647\\u0627\\u0621\r\n\r\n#XFLD: label for note\r\nNOTE=\\u0645\\u0644\\u0627\\u062D\\u0638\\u0629\r\n\r\n#XFLD: label for Add New week entry\r\nADD_NEW=\\u0625\\u062F\\u062E\\u0627\\u0644 \\u062C\\u062F\\u064A\\u062F\r\n\r\n#XBUT: Done button\r\nDONE=\\u062A\\u0645\r\n\r\n# XTIT: Recently Used\r\nRECENTLY_USED=\\u0627\\u0644\\u0627\\u0642\\u062A\\u0631\\u0627\\u062D\\u0627\\u062A\r\n\r\n# XTIT: Manual Input Add\r\nMANUAL_INPUT_ADD=\\u064A\\u062F\\u0648\\u064A\r\n\r\n# XTIT: Manual Input Edit\r\nMANUAL_INPUT_EDIT=\\u062A\\u062D\\u0631\\u064A\\u0631 \\u0627\\u0644\\u0625\\u062F\\u062E\\u0627\\u0644\r\n\r\n# XTIT: Cost Assignment\r\nCOST_ASSIGNMENT=\\u062A\\u0639\\u064A\\u064A\\u0646 \\u0627\\u0644\\u0648\\u0642\\u062A\r\n\r\n#XFLD: Tap to Load More\r\nTAP_TO_LOAD_MORE=\\u062A\\u062D\\u0645\\u064A\\u0644 \\u0627\\u0644\\u0645\\u0632\\u064A\\u062F\r\n\r\n#XFLD: Tap to Load More Loading\r\nTAP_TO_LOAD_MORE_LOADING=\\u062C\\u0627\\u0631\\u064D \\u0627\\u0644\\u062A\\u062D\\u0645\\u064A\\u0644...\r\n\r\n#XFLD: Continue Search on Server\r\nCONTINUE_SEARCH_ON_SERVER=\\u0645\\u062A\\u0627\\u0628\\u0639\\u0629 \\u0627\\u0644\\u0628\\u062D\\u062B \\u0641\\u064A \\u0627\\u0644\\u062E\\u0627\\u062F\\u0645...\r\n\r\n#XFLD: Continue Search on Server Loading\r\nCONTINUE_SEARCH_ON_SERVER_LOADING=\\u062C\\u0627\\u0631\\u064D \\u0627\\u0644\\u062A\\u062D\\u0645\\u064A\\u0644...\r\n\r\n#XFLD: BLANK\r\nEMPTY=\\u0641\\u0627\\u0631\\u063A\r\n\r\n#XFLD: None\r\nNONE=\\u0644\\u0627 \\u0634\\u064A\\u0621\r\n\r\n# XTIT: Select\r\nSELECT=\\u062D\\u062F\\u062F {0}\r\n\r\n# XTIT: Placeholder for Cost Assignment Picker indicating Select action\r\nSELECT_PLACEHOLDER=\\u062A\\u062D\\u062F\\u064A\\u062F\r\n\r\n#XFLD: Placeholder for cost assignment type search\r\nSEARCH=\\u062C\\u0627\\u0631\\u064D \\u0627\\u0644\\u0628\\u062D\\u062B...\r\n\r\n#XFLD: short label for hours\r\nHOURS_LABEL=\\u0633\r\n\r\n#XFLD: short label for minutes\r\nMINUTES_LABEL=\\u062F\r\n\r\n#XFLD: full label for hours \r\nHOURS_LABEL_FULL=\\u0633\\u0627\\u0639\\u0627\\u062A\r\n\r\n#XFLD: full label for minutes\r\nMINUTES_LABEL_FULL=\\u062F\\u0642\\u0627\\u0626\\u0642\r\n\r\n#XFLD: label for date. When localizing do not change the MMM DD or YYYY, just the order of them\r\nDATE_LOCALE=MMM DD, YYYY\r\n\r\n\r\n#XBUT:\r\nDETAIL=\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644\r\n\r\n\r\n#XFLD: label for Settings title\r\nSETTINGS_TITLE=\\u0625\\u0639\\u062F\\u0627\\u062F\\u0627\\u062A\r\n#XFLD: label for Settings data entry profile\r\nSETTINGS_DATA_ENTRY_PROFILE=\\u0645\\u0644\\u0641 \\u062A\\u0639\\u0631\\u064A\\u0641 \\u0625\\u062F\\u062E\\u0627\\u0644 \\u0627\\u0644\\u0628\\u064A\\u0627\\u0646\\u0627\\u062A\r\n#XFLD: label for Settings pre-fill label\r\nSETTINGS_PREFILL_LAST_WEEK=\\u0627\\u0642\\u062A\\u0631\\u0627\\u062D \\u062A\\u0644\\u0642\\u0627\\u0626\\u064A\r\n\r\n# XMSG: \r\nCONFIRM_LEAVE_PAGE=\\u0633\\u0648\\u0641 \\u064A\\u062A\\u0645 \\u062A\\u062C\\u0627\\u0647\\u0644 \\u0623\\u064A\\u0629 \\u0628\\u064A\\u0627\\u0646\\u0627\\u062A \\u0644\\u0645 \\u064A\\u062A\\u0645 \\u062D\\u0641\\u0638\\u0647\\u0627. \\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0627\\u0644\\u0645\\u062A\\u0627\\u0628\\u0639\\u0629 \\u0628\\u0627\\u0644\\u062A\\u0623\\u0643\\u064A\\u062F\\u061F\r\n# XTIT: \r\nUNSAVED_CHANGES=\\u062A\\u063A\\u064A\\u064A\\u0631\\u0627\\u062A \\u063A\\u064A\\u0631 \\u0645\\u062D\\u0641\\u0648\\u0638\\u0629\r\n\r\n#XMSG: toast message for successful submit\r\nSUBMIT_SUCCESS=\\u062A\\u0645 \\u0625\\u0631\\u0633\\u0627\\u0644 \\u0627\\u0644\\u0637\\u0644\\u0628\r\n\r\n#XMSG: toast message for successful draft submit\r\nDRAFT_SUCCESS=\\u062A\\u0645 \\u062D\\u0641\\u0638 \\u0627\\u0644\\u0645\\u0633\\u0648\\u062F\\u0629 \\u0628\\u0646\\u062C\\u0627\\u062D\r\n\r\n#XBUT:\r\nHELP=\\u0645\\u0633\\u0627\\u0639\\u062F\\u0629\r\n\r\n#XMSG: confirmation message for week entry\r\nTOTAL_BOOKED=\\u062A\\u0645 \\u0625\\u062F\\u062E\\u0627\\u0644 {0}/{1} \\u0645\\u0646 \\u0627\\u0644\\u0633\\u0627\\u0639\\u0627\\u062A \\u0644\\u0647\\u0630\\u0627 \\u0627\\u0644\\u0623\\u0633\\u0628\\u0648\\u0639.\r\n\r\n#XMSG: help text for pre-fill option\r\nHELP_PREFILL=\\u062A\\u0634\\u063A\\u064A\\u0644 \\u0645\\u064A\\u0632\\u0629 \\u0627\\u0644\\u0645\\u0644\\u0621 \\u0627\\u0644\\u0645\\u0633\\u0628\\u0642 \\u0644\\u062A\\u0648\\u0632\\u064A\\u0639 \\u0633\\u0627\\u0639\\u0627\\u062A \\u0627\\u0644\\u0623\\u0633\\u0628\\u0648\\u0639 \\u0628\\u0633\\u0631\\u0639\\u0629 \\u0627\\u0633\\u062A\\u0646\\u0627\\u062F\\u064B\\u0627 \\u0625\\u0644\\u0649 \\u0622\\u062E\\u0631 \\u0625\\u062F\\u062E\\u0627\\u0644 \\u0646\\u0627\\u062C\\u062D\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT_AUTO_ENTRY=\\u0641\\u0634\\u0644 \\u0627\\u0644\\u0625\\u0631\\u0633\\u0627\\u0644\\u061B \\u0631\\u0627\\u062C\\u0639 \\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u062E\\u0637\\u0623 \\u0648\\u062D\\u0627\\u0648\\u0644 \\u0645\\u0631\\u0629 \\u0623\\u062E\\u0631\\u0649\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT=\\u0628\\u0639\\u0636 \\u0627\\u0644\\u0625\\u062F\\u062E\\u0627\\u0644\\u0627\\u062A \\u063A\\u064A\\u0631 \\u0635\\u062D\\u064A\\u062D\\u0629. \\u0628\\u0631\\u062C\\u0627\\u0621 \\u0645\\u0631\\u0627\\u062C\\u0639\\u0629 \\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u062E\\u0637\\u0623 \\u0648\\u0627\\u0644\\u0645\\u062D\\u0627\\u0648\\u0644\\u0629 \\u0645\\u0631\\u0629 \\u0623\\u062E\\u0631\\u0649.\r\n\r\n#XMSG: error pop-up message text\r\nSUBMIT_HEADER_TEXT=\\u0625\\u062F\\u062E\\u0627\\u0644 \\u0627\\u0644\\u0648\\u0642\\u062A \\u0644\\u0639\\u062F\\u062F {0} \\u0648{1} \\u0645\\u0646 \\u0627\\u0644\\u0623\\u064A\\u0627\\u0645 \\u0627\\u0644\\u0623\\u062E\\u0631\\u0649\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_EDIT_ENTRY_TITLE_SCREEN=\\u062A\\u062D\\u0631\\u064A\\u0631 \\u0625\\u062F\\u062E\\u0627\\u0644 \\u0627\\u0644\\u0648\\u0642\\u062A\r\n\r\n#XMSG: Header in edit screen for single date\r\nSUBMIT_HEADER_TEXT_SINGLE=\\u0625\\u062F\\u062E\\u0627\\u0644 \\u0627\\u0644\\u0648\\u0642\\u062A \\u0644\\u0639\\u062F\\u062F {0}\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nFULL_CONCATENATE_HOURSMIN={0} \\u0645\\u0646 \\u0627\\u0644\\u0633\\u0627\\u0639\\u0627\\u062A {1} \\u0645\\u0646 \\u0627\\u0644\\u062F\\u0642\\u0627\\u0626\\u0642\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nSHORT_CONCATENATE_HOURSMIN={0} \\u0633{1} \\u062F\r\n\r\n#XBUT: Button to reset\r\nRESET=\\u0625\\u0639\\u0627\\u062F\\u0629 \\u062A\\u0639\\u064A\\u064A\\u0646\r\n\r\n#XBUT: Button to create\r\nCREATE=\\u0625\\u0646\\u0634\\u0627\\u0621\r\n',
	"hcm/emp/mytimesheet/i18n/i18n_cs.properties":'\r\n#XFLD: label for from time\r\nFROM=Od\r\n\r\n#XFLD: label for to time\r\nTO=Do\r\n\r\n#XBUT: Button to cancel\r\nCANCEL=Zru\\u0161it\r\n\r\n#XBUT: Button to close popover\r\nCLOSE=Zav\\u0159\\u00EDt\r\n\r\n#XBUT: Button to accept\r\nOK=OK\r\n\r\n#XBUT: Button to Save Draft\r\nSAVE_DRAFT=Ulo\\u017Eit n\\u00E1vrh\r\n\r\n# XTIT: \r\nTIMESHEET_TITLE=Moje evidence \\u010Dasu\r\n\r\n# XTIT: \r\nTIMESHEET=Z\\u00E1znamy evidence \\u010Dasu\r\n\r\n# XTIT: \r\nWEEKENTRY_TITLE=Manu\\u00E1ln\\u00ED z\\u00E1znam\r\n\r\n#XBUT: Button for quick entry\r\nQUICK_FILL=Rychl\\u00FD z\\u00E1znam\r\n\r\n# XFLD: Apply to\r\nENTRY_VIEW_APPLY_TO=Pou\\u017E\\u00EDt na\r\n\r\n# XTIT: \r\nTIMESHEET_DETAILS_TITLE=Detaily\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_CREATE_ENTRY_TITLE=Vytvo\\u0159it \\u010Dasov\\u00FD z\\u00E1znam\r\n\r\n# XTIT: Title for create entry view with multiple days selected\r\nTIMESHEET_CREATE_ENTRIES_TITLE=Vytvo\\u0159it z\\u00E1znam pro {0} dn\\u00ED\r\n\r\n# XTIT: Title for Entry Details\r\nENTRY_DETAILS=Detaily z\\u00E1znamu\r\n\r\n# XTIT: Title for edit entry view for a particular date ({0} = date)\r\nTIMESHEET_EDIT_ENTRY_TITLE=Detaily z\\u00E1znamu pro {0}\r\n\r\n# XTIT: Title for create entry view for a particular date ({0} = date)\r\nTIMESHEET_NEW_ENTRY_TITLE=Vytvo\\u0159it z\\u00E1znam pro {0}\r\n\r\n# XTIT: Month short header\r\nMONTH_0=Led.\r\n# XTIT: Month short header\r\nMONTH_1=\\u00DAnor\r\n# XTIT: Month short header\r\nMONTH_2=B\\u0159ez.\r\n# XTIT: Month short header\r\nMONTH_3=Dub.\r\n# XTIT: Month short header\r\nMONTH_4=Kv\\u011Bt.\r\n# XTIT: Month short header\r\nMONTH_5=\\u010Cerven\r\n# XTIT: Month short header\r\nMONTH_6=\\u010Cerc.\r\n# XTIT: Month short header\r\nMONTH_7=Srp.\r\n# XTIT: Month short header\r\nMONTH_8=Z\\u00E1\\u0159\\u00ED\r\n# XTIT: Month short header\r\nMONTH_9=\\u0158\\u00EDj.\r\n# XTIT: Month short header\r\nMONTH_10=Lis.\r\n# XTIT: Month short header\r\nMONTH_11=Pros.\r\n\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_0=Leden\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_1=\\u00DAnor\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_2=B\\u0159ezen\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_3=Duben\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_4=Kv\\u011Bten\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_5=\\u010Cerven\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_6=\\u010Cervenec\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_7=Srpen\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_8=Z\\u00E1\\u0159\\u00ED\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_9=\\u0158\\u00EDjen\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_10=Listopad\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_11=Prosinec\r\n\r\n# XTIT: Legend missing day\r\nMISSING_DAY=Je vy\\u017Eadov\\u00E1na va\\u0161e akce\r\n# XTIT: Legend filled day\r\nFILLED_DAY=Hotovo\r\n# XTIT: Legend filled in process, manager action needed\r\nFILLED_MANAGER=Je po\\u017Eadov\\u00E1na akce schvalovatele\r\n# XFLD: Rejected by manager - this appears on the legend\r\nREJECTED=Zam\\u00EDtnuto\r\n# XFLD: Legend future working day\r\nWORKING_DAY=Pracovn\\u00ED den\r\n# XFLD: Legend non-working day\r\nNON_WORKING_DAY=Nepracovn\\u00ED den\r\n\r\n# XMSG: Footer information about missing hours\r\nTOTAL_MISSING=Celkem chyb\\u00ED hodin\\: {0}\r\n\r\n#XFLD:\r\nMONTH_YEAR={0} {1} ({2} hodin)\r\n\r\n#XBUT: Button\r\nSAVE=Ulo\\u017Eit\r\n\r\n#XBUT: Button \r\nSUBMIT=Odeslat\r\n\r\n#XBUT: Button for quick entry\r\nSMART_FILL=Automatick\\u00FD z\\u00E1znam\r\n\r\n# XMSG\r\nFILL_ALL=Zadat {0} hodin pro\\:\r\n\r\n#XFLD\r\nNO_TASK_TYPE=\\u017D\\u00E1dn\\u00FD typ \\u00FAlohy\r\n\r\n#XFLD\r\nMISSING_DAYS=Chyb\\u00ED dn\\u00ED\\: {0}\r\n\r\n#XBUT: Button\r\nHOME=Dom\\u016F\r\n\r\n#XTIT: confirmation header\r\nCONFIRMATION=Potvrzen\\u00ED\r\n\r\n#XTIT: deletion confirmation header\r\nDELETE_CONFIRMATION=Potvrdit odstran\\u011Bn\\u00ED\r\n\r\n#XTIT: submission confirmation header\r\nSUBMISSION_CONFIRMATION=Potvrdit odesl\\u00E1n\\u00ED\r\n\r\n#XTIT: Draft submission confirmation header\r\nDRAFT_CONFIRMATION=Potvrdit n\\u00E1vrh\r\n\r\n#XFLD: label for Deletion summary in Dialog\r\nDELETE_CONFIRMATION_SUMMARY=Souhrn \\u010Dasov\\u00FDch z\\u00E1znam\\u016F k vymaz\\u00E1n\\u00ED\r\n\r\n#XFLD: label for Submission summary in Dialog\r\nSUBMISSION_CONFIRMATION_SUMMARY=Souhrn \\u010Dasov\\u00FDch z\\u00E1znam\\u016F vybran\\u00FDch k odesl\\u00E1n\\u00ED\r\n\r\n#XFLD: label for Draft Submission summary in Dialog\r\nDRAFT_CONFIRMATION_SUMMARY=Souhrn vybran\\u00FDch \\u010Dasov\\u00FDch z\\u00E1znam\\u016F\r\n\r\n#XFLD: label for Number of entries in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_ENTRIES=Po\\u010Det z\\u00E1znam\\u016F\r\n\r\n#XFLD: label for Number of hours in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_HOURS=Po\\u010Det hodin\r\n\r\n#XBUT: Confirm Button\r\nCONFIRM=Potvrzen\\u00ED\r\n\r\n#XMSG: Summary for confirmation - these are two dates\r\nSUMMARY={0} - {1}\r\n\r\n#XFLD: Week \r\nWEEK=T\\u00FDden\r\n\r\n#XFLD:\r\nMEET_TARGET_HOURS=Pou\\u017E\\u00EDt hodiny na\\:\r\n\r\n#XBUT\r\nTHIS_WEEK=Aktu\\u00E1ln\\u00ED t\\u00FDden ({0} hodin)\r\n\r\n#XBUT\r\nALL_MISSING=Ve\\u0161ker\\u00FD chyb\\u011Bj\\u00EDc\\u00ED \\u010Das ({0} hodin)\r\n\r\n#XBUT: Delete Button Text\r\nDELETE=Smazat\r\n\r\n#XBUT: Add Button Text for Weekly Entry nav button\r\nNAV_ADD=P\\u0159idat z\\u00E1znam\r\n\r\n#XFLD: label for duration\r\nDURATION=Trv\\u00E1n\\u00ED\r\n\r\n#XFLD: label for total duration\r\nTOTAL_DURATION=Celkov\\u00E9 trv\\u00E1n\\u00ED\r\n\r\n#XFLD: label for status\r\nSTATUS=Stav\r\n\r\n#XFLD: label for start time\r\nSTART_TIME=Po\\u010D\\u00E1te\\u010Dn\\u00ED \\u010Das\r\n\r\n#XFLD: label for end Time\r\nEND_TIME=Koncov\\u00FD \\u010Das\r\n\r\n#XFLD: label for note\r\nNOTE=Pozn\\u00E1mka\r\n\r\n#XFLD: label for Add New week entry\r\nADD_NEW=Nov\\u00FD z\\u00E1znam\r\n\r\n#XBUT: Done button\r\nDONE=Hotovo\r\n\r\n# XTIT: Recently Used\r\nRECENTLY_USED=N\\u00E1vrhy\r\n\r\n# XTIT: Manual Input Add\r\nMANUAL_INPUT_ADD=Manu\\u00E1ln\\u011B\r\n\r\n# XTIT: Manual Input Edit\r\nMANUAL_INPUT_EDIT=Upravit z\\u00E1znam\r\n\r\n# XTIT: Cost Assignment\r\nCOST_ASSIGNMENT=P\\u0159i\\u0159azen\\u00ED \\u010Dasu\r\n\r\n#XFLD: Tap to Load More\r\nTAP_TO_LOAD_MORE=Zav\\u00E9st v\\u00EDce\r\n\r\n#XFLD: Tap to Load More Loading\r\nTAP_TO_LOAD_MORE_LOADING=Zav\\u00E1d\\u00ED se...\r\n\r\n#XFLD: Continue Search on Server\r\nCONTINUE_SEARCH_ON_SERVER=Pokra\\u010Dovat v hled\\u00E1n\\u00ED na serveru...\r\n\r\n#XFLD: Continue Search on Server Loading\r\nCONTINUE_SEARCH_ON_SERVER_LOADING=Zav\\u00E1d\\u00ED se...\r\n\r\n#XFLD: BLANK\r\nEMPTY=Pr\\u00E1zdn.\r\n\r\n#XFLD: None\r\nNONE=Nic\r\n\r\n# XTIT: Select\r\nSELECT=Vybrat {0}\r\n\r\n# XTIT: Placeholder for Cost Assignment Picker indicating Select action\r\nSELECT_PLACEHOLDER=Vybrat\r\n\r\n#XFLD: Placeholder for cost assignment type search\r\nSEARCH=Hled\\u00E1n\\u00ED...\r\n\r\n#XFLD: short label for hours\r\nHOURS_LABEL=h\r\n\r\n#XFLD: short label for minutes\r\nMINUTES_LABEL=m\r\n\r\n#XFLD: full label for hours \r\nHOURS_LABEL_FULL=Hodiny\r\n\r\n#XFLD: full label for minutes\r\nMINUTES_LABEL_FULL=Minuty\r\n\r\n#XFLD: label for date. When localizing do not change the MMM DD or YYYY, just the order of them\r\nDATE_LOCALE=MMM DD, RRRR\r\n\r\n\r\n#XBUT:\r\nDETAIL=Detaily\r\n\r\n\r\n#XFLD: label for Settings title\r\nSETTINGS_TITLE=Nastaven\\u00ED\r\n#XFLD: label for Settings data entry profile\r\nSETTINGS_DATA_ENTRY_PROFILE=Profil datov\\u00E9ho z\\u00E1znamu\r\n#XFLD: label for Settings pre-fill label\r\nSETTINGS_PREFILL_LAST_WEEK=Automatick\\u00FD n\\u00E1vrh\r\n\r\n# XMSG: \r\nCONFIRM_LEAVE_PAGE=V\\u0161echna neulo\\u017Een\\u00E1 data budou zru\\u0161ena. Chcete pokra\\u010Dovat?\r\n# XTIT: \r\nUNSAVED_CHANGES=Neulo\\u017Een\\u00E9 zm\\u011Bny\r\n\r\n#XMSG: toast message for successful submit\r\nSUBMIT_SUCCESS=Po\\u017Eadavek byl odesl\\u00E1n\r\n\r\n#XMSG: toast message for successful draft submit\r\nDRAFT_SUCCESS=N\\u00E1vrh byl \\u00FAsp\\u011B\\u0161n\\u011B ulo\\u017Een\r\n\r\n#XBUT:\r\nHELP=N\\u00E1pov\\u011Bda\r\n\r\n#XMSG: confirmation message for week entry\r\nTOTAL_BOOKED={0}/{1} hodin zad\\u00E1no pro tento t\\u00FDden.\r\n\r\n#XMSG: help text for pre-fill option\r\nHELP_PREFILL=Zapn\\u011Bte p\\u0159edvypln\\u011Bn\\u00ED, aby se rychle doplnily hodiny pro t\\u00FDden na z\\u00E1klad\\u011B posledn\\u00EDho \\u00FAsp\\u011B\\u0161n\\u00E9ho z\\u00E1znamu\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT_AUTO_ENTRY=Odesl\\u00E1n\\u00ED se nezda\\u0159ilo; zkontrolujte detaily chyby a zkuste to znovu\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT=N\\u011Bkter\\u00E9 z\\u00E1znamy jsou nespr\\u00E1vn\\u00E9. Pod\\u00EDvejte se na detaily chyb a zkuste to znovu.\r\n\r\n#XMSG: error pop-up message text\r\nSUBMIT_HEADER_TEXT=Evidence \\u010Dasu pro {0} a {1} dal\\u0161\\u00EDch dn\\u00ED\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_EDIT_ENTRY_TITLE_SCREEN=Upravit \\u010Dasov\\u00FD z\\u00E1znam\r\n\r\n#XMSG: Header in edit screen for single date\r\nSUBMIT_HEADER_TEXT_SINGLE=\\u010Casov\\u00FD z\\u00E1znam pro {0}\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nFULL_CONCATENATE_HOURSMIN={0} hodin {1} minut\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nSHORT_CONCATENATE_HOURSMIN={0} hod. {1} min.\r\n\r\n#XBUT: Button to reset\r\nRESET=Resetovat\r\n\r\n#XBUT: Button to create\r\nCREATE=Vytvo\\u0159it\r\n',
	"hcm/emp/mytimesheet/i18n/i18n_de.properties":'\r\n#XFLD: label for from time\r\nFROM=Von\r\n\r\n#XFLD: label for to time\r\nTO=Bis\r\n\r\n#XBUT: Button to cancel\r\nCANCEL=Abbrechen\r\n\r\n#XBUT: Button to close popover\r\nCLOSE=Schlie\\u00DFen\r\n\r\n#XBUT: Button to accept\r\nOK=OK\r\n\r\n#XBUT: Button to Save Draft\r\nSAVE_DRAFT=Entwurf sichern\r\n\r\n# XTIT: \r\nTIMESHEET_TITLE=Zeiterfassung\r\n\r\n# XTIT: \r\nTIMESHEET=Arbeitszeiteintr\\u00E4ge\r\n\r\n# XTIT: \r\nWEEKENTRY_TITLE=Manuelle Erfassung\r\n\r\n#XBUT: Button for quick entry\r\nQUICK_FILL=Schnellerfassung\r\n\r\n# XFLD: Apply to\r\nENTRY_VIEW_APPLY_TO=Anwenden auf\r\n\r\n# XTIT: \r\nTIMESHEET_DETAILS_TITLE=Details\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_CREATE_ENTRY_TITLE=Zeiteintrag anlegen\r\n\r\n# XTIT: Title for create entry view with multiple days selected\r\nTIMESHEET_CREATE_ENTRIES_TITLE=Zeit f\\u00FCr {0} Tage erfassen\r\n\r\n# XTIT: Title for Entry Details\r\nENTRY_DETAILS=Details zum Eintrag\r\n\r\n# XTIT: Title for edit entry view for a particular date ({0} = date)\r\nTIMESHEET_EDIT_ENTRY_TITLE=Zeiterfassung \\u2013 Details f\\u00FCr {0}\r\n\r\n# XTIT: Title for create entry view for a particular date ({0} = date)\r\nTIMESHEET_NEW_ENTRY_TITLE=Zeit f\\u00FCr {0} erfassen\r\n\r\n# XTIT: Month short header\r\nMONTH_0=Jan.\r\n# XTIT: Month short header\r\nMONTH_1=Feb.\r\n# XTIT: Month short header\r\nMONTH_2=M\\u00E4rz\r\n# XTIT: Month short header\r\nMONTH_3=Apr.\r\n# XTIT: Month short header\r\nMONTH_4=Mai\r\n# XTIT: Month short header\r\nMONTH_5=Juni\r\n# XTIT: Month short header\r\nMONTH_6=Juli\r\n# XTIT: Month short header\r\nMONTH_7=Aug.\r\n# XTIT: Month short header\r\nMONTH_8=Sep.\r\n# XTIT: Month short header\r\nMONTH_9=Okt.\r\n# XTIT: Month short header\r\nMONTH_10=Nov.\r\n# XTIT: Month short header\r\nMONTH_11=Dez.\r\n\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_0=Januar\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_1=Februar\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_2=M\\u00E4rz\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_3=April\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_4=Mai\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_5=Juni\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_6=Juli\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_7=August\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_8=September\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_9=Oktober\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_10=November\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_11=Dezember\r\n\r\n# XTIT: Legend missing day\r\nMISSING_DAY=Zu erfassen\r\n# XTIT: Legend filled day\r\nFILLED_DAY=Fertig\r\n# XTIT: Legend filled in process, manager action needed\r\nFILLED_MANAGER=Genehmigung ausstehend\r\n# XFLD: Rejected by manager - this appears on the legend\r\nREJECTED=Abgelehnt\r\n# XFLD: Legend future working day\r\nWORKING_DAY=Arbeitstag\r\n# XFLD: Legend non-working day\r\nNON_WORKING_DAY=Arbeitsfreier Tag\r\n\r\n# XMSG: Footer information about missing hours\r\nTOTAL_MISSING=Insgesamt fehlende Stunden\\: {0}\r\n\r\n#XFLD:\r\nMONTH_YEAR={0} {1} ({2} Stunden)\r\n\r\n#XBUT: Button\r\nSAVE=Sichern\r\n\r\n#XBUT: Button \r\nSUBMIT=Senden\r\n\r\n#XBUT: Button for quick entry\r\nSMART_FILL=Automatische Erfassung\r\n\r\n# XMSG\r\nFILL_ALL={0} Stunden erfassen f\\u00FCr\\:\r\n\r\n#XFLD\r\nNO_TASK_TYPE=Kein Aufgabentyp\r\n\r\n#XFLD\r\nMISSING_DAYS=Fehlende Tage\\:{0}\r\n\r\n#XBUT: Button\r\nHOME=Start\r\n\r\n#XTIT: confirmation header\r\nCONFIRMATION=Best\\u00E4tigung\r\n\r\n#XTIT: deletion confirmation header\r\nDELETE_CONFIRMATION=L\\u00F6schen best\\u00E4tigen\r\n\r\n#XTIT: submission confirmation header\r\nSUBMISSION_CONFIRMATION=Senden best\\u00E4tigen\r\n\r\n#XTIT: Draft submission confirmation header\r\nDRAFT_CONFIRMATION=Entwurf best\\u00E4tigen\r\n\r\n#XFLD: label for Deletion summary in Dialog\r\nDELETE_CONFIRMATION_SUMMARY=\\u00DCbersicht \\u00FCber zum L\\u00F6schen ausgew\\u00E4hlte Zeiteintr\\u00E4ge\r\n\r\n#XFLD: label for Submission summary in Dialog\r\nSUBMISSION_CONFIRMATION_SUMMARY=\\u00DCbersicht \\u00FCber zum Senden ausgew\\u00E4hlte Zeiteintr\\u00E4ge\r\n\r\n#XFLD: label for Draft Submission summary in Dialog\r\nDRAFT_CONFIRMATION_SUMMARY=\\u00DCbersicht \\u00FCber ausgew\\u00E4hlte Zeiteintr\\u00E4ge\r\n\r\n#XFLD: label for Number of entries in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_ENTRIES=Anzahl der Eintr\\u00E4ge\r\n\r\n#XFLD: label for Number of hours in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_HOURS=Stundenanzahl\r\n\r\n#XBUT: Confirm Button\r\nCONFIRM=Best\\u00E4tigen\r\n\r\n#XMSG: Summary for confirmation - these are two dates\r\nSUMMARY={0} - {1}\r\n\r\n#XFLD: Week \r\nWEEK=Woche\r\n\r\n#XFLD:\r\nMEET_TARGET_HOURS=Stunden anwenden auf\\:\r\n\r\n#XBUT\r\nTHIS_WEEK=Aktuelle Woche ({0} Stunden)\r\n\r\n#XBUT\r\nALL_MISSING=Alle fehlenden Zeiten ({0} Stunden)\r\n\r\n#XBUT: Delete Button Text\r\nDELETE=L\\u00F6schen\r\n\r\n#XBUT: Add Button Text for Weekly Entry nav button\r\nNAV_ADD=Eintrag hinzuf\\u00FCgen\r\n\r\n#XFLD: label for duration\r\nDURATION=Dauer\r\n\r\n#XFLD: label for total duration\r\nTOTAL_DURATION=Gesamtdauer\r\n\r\n#XFLD: label for status\r\nSTATUS=Status\r\n\r\n#XFLD: label for start time\r\nSTART_TIME=Start (Zeit)\r\n\r\n#XFLD: label for end Time\r\nEND_TIME=Ende (Zeit)\r\n\r\n#XFLD: label for note\r\nNOTE=Notiz\r\n\r\n#XFLD: label for Add New week entry\r\nADD_NEW=Neuer Eintrag\r\n\r\n#XBUT: Done button\r\nDONE=Fertig\r\n\r\n# XTIT: Recently Used\r\nRECENTLY_USED=Vorschl\\u00E4ge\r\n\r\n# XTIT: Manual Input Add\r\nMANUAL_INPUT_ADD=Manuell\r\n\r\n# XTIT: Manual Input Edit\r\nMANUAL_INPUT_EDIT=Eintrag bearbeiten\r\n\r\n# XTIT: Cost Assignment\r\nCOST_ASSIGNMENT=Zeitzuordnung\r\n\r\n#XFLD: Tap to Load More\r\nTAP_TO_LOAD_MORE=Weitere laden\r\n\r\n#XFLD: Tap to Load More Loading\r\nTAP_TO_LOAD_MORE_LOADING=Laden ...\r\n\r\n#XFLD: Continue Search on Server\r\nCONTINUE_SEARCH_ON_SERVER=Suche auf Server fortsetzen ...\r\n\r\n#XFLD: Continue Search on Server Loading\r\nCONTINUE_SEARCH_ON_SERVER_LOADING=Laden ...\r\n\r\n#XFLD: BLANK\r\nEMPTY=Leer\r\n\r\n#XFLD: None\r\nNONE=Kein(e)\r\n\r\n# XTIT: Select\r\nSELECT={0} ausw\\u00E4hlen\r\n\r\n# XTIT: Placeholder for Cost Assignment Picker indicating Select action\r\nSELECT_PLACEHOLDER=Ausw\\u00E4hlen\r\n\r\n#XFLD: Placeholder for cost assignment type search\r\nSEARCH=Suchen ...\r\n\r\n#XFLD: short label for hours\r\nHOURS_LABEL=Std.\r\n\r\n#XFLD: short label for minutes\r\nMINUTES_LABEL=Min.\r\n\r\n#XFLD: full label for hours \r\nHOURS_LABEL_FULL=Stunden\r\n\r\n#XFLD: full label for minutes\r\nMINUTES_LABEL_FULL=Minuten\r\n\r\n#XFLD: label for date. When localizing do not change the MMM DD or YYYY, just the order of them\r\nDATE_LOCALE=DD. MMM YYYY\r\n\r\n\r\n#XBUT:\r\nDETAIL=Details\r\n\r\n\r\n#XFLD: label for Settings title\r\nSETTINGS_TITLE=Einstellungen\r\n#XFLD: label for Settings data entry profile\r\nSETTINGS_DATA_ENTRY_PROFILE=Erfassungsprofil\r\n#XFLD: label for Settings pre-fill label\r\nSETTINGS_PREFILL_LAST_WEEK=Vorbelegen\r\n\r\n# XMSG: \r\nCONFIRM_LEAVE_PAGE=Ungesicherte Daten gehen verloren. M\\u00F6chten Sie fortfahren?\r\n# XTIT: \r\nUNSAVED_CHANGES=Ungesicherte \\u00C4nderungen\r\n\r\n#XMSG: toast message for successful submit\r\nSUBMIT_SUCCESS=Anfrage eingereicht\r\n\r\n#XMSG: toast message for successful draft submit\r\nDRAFT_SUCCESS=Entwurf erfolgreich gesichert\r\n\r\n#XBUT:\r\nHELP=Hilfe\r\n\r\n#XMSG: confirmation message for week entry\r\nTOTAL_BOOKED={0}/{1} Stunden f\\u00FCr diese Woche erfasst.\r\n\r\n#XMSG: help text for pre-fill option\r\nHELP_PREFILL=Vorbelegung einschalten, um Zeiten basierend auf Ihren letzten Eintr\\u00E4gen vorzuschlagen\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT_AUTO_ENTRY=Senden fehlgeschlagen. Pr\\u00FCfen Sie die Fehlerdetails und versuchen Sie es erneut.\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT=Einige Eintr\\u00E4ge sind falsch. Pr\\u00FCfen Sie die Fehlerdetails und versuchen Sie es erneut.\r\n\r\n#XMSG: error pop-up message text\r\nSUBMIT_HEADER_TEXT=Zeiteintrag f\\u00FCr {0} und {1} weiteren Tag/weitere Tage\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_EDIT_ENTRY_TITLE_SCREEN=Zeiteintrag bearbeiten\r\n\r\n#XMSG: Header in edit screen for single date\r\nSUBMIT_HEADER_TEXT_SINGLE=Zeiteintrag f\\u00FCr {0}\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nFULL_CONCATENATE_HOURSMIN={0} Stunden {1} Minuten\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nSHORT_CONCATENATE_HOURSMIN={0} Std. {1} Min.\r\n\r\n#XBUT: Button to reset\r\nRESET=Zur\\u00FCcksetzen\r\n\r\n#XBUT: Button to create\r\nCREATE=Anlegen\r\n',
	"hcm/emp/mytimesheet/i18n/i18n_en.properties":'\r\n#XFLD: label for from time\r\nFROM=From\r\n\r\n#XFLD: label for to time\r\nTO=To\r\n\r\n#XBUT: Button to cancel\r\nCANCEL=Cancel\r\n\r\n#XBUT: Button to close popover\r\nCLOSE=Close\r\n\r\n#XBUT: Button to accept\r\nOK=OK\r\n\r\n#XBUT: Button to Save Draft\r\nSAVE_DRAFT=Save Draft\r\n\r\n# XTIT: \r\nTIMESHEET_TITLE=My Timesheet\r\n\r\n# XTIT: \r\nTIMESHEET=Time Sheet Entries\r\n\r\n# XTIT: \r\nWEEKENTRY_TITLE=Manual Entry\r\n\r\n#XBUT: Button for quick entry\r\nQUICK_FILL=Quick Entry\r\n\r\n# XFLD: Apply to\r\nENTRY_VIEW_APPLY_TO=Apply To\r\n\r\n# XTIT: \r\nTIMESHEET_DETAILS_TITLE=Details\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_CREATE_ENTRY_TITLE=Create Time Entry\r\n\r\n# XTIT: Title for create entry view with multiple days selected\r\nTIMESHEET_CREATE_ENTRIES_TITLE=Create entry for {0} days\r\n\r\n# XTIT: Title for Entry Details\r\nENTRY_DETAILS=Entry Details\r\n\r\n# XTIT: Title for edit entry view for a particular date ({0} = date)\r\nTIMESHEET_EDIT_ENTRY_TITLE=Entry details for {0}\r\n\r\n# XTIT: Title for create entry view for a particular date ({0} = date)\r\nTIMESHEET_NEW_ENTRY_TITLE=Create entry for {0}\r\n\r\n# XTIT: Month short header\r\nMONTH_0=Jan.\r\n# XTIT: Month short header\r\nMONTH_1=Feb.\r\n# XTIT: Month short header\r\nMONTH_2=Mar.\r\n# XTIT: Month short header\r\nMONTH_3=Apr.\r\n# XTIT: Month short header\r\nMONTH_4=May\r\n# XTIT: Month short header\r\nMONTH_5=June\r\n# XTIT: Month short header\r\nMONTH_6=July\r\n# XTIT: Month short header\r\nMONTH_7=Aug.\r\n# XTIT: Month short header\r\nMONTH_8=Sep.\r\n# XTIT: Month short header\r\nMONTH_9=Oct.\r\n# XTIT: Month short header\r\nMONTH_10=Nov.\r\n# XTIT: Month short header\r\nMONTH_11=Dec.\r\n\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_0=January\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_1=February\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_2=March\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_3=April\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_4=May\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_5=June\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_6=July\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_7=August\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_8=September\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_9=October\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_10=November\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_11=December\r\n\r\n# XTIT: Legend missing day\r\nMISSING_DAY=Your Action Needed\r\n# XTIT: Legend filled day\r\nFILLED_DAY=Done\r\n# XTIT: Legend filled in process, manager action needed\r\nFILLED_MANAGER=Approver Action Needed\r\n# XFLD: Rejected by manager - this appears on the legend\r\nREJECTED=Rejected\r\n# XFLD: Legend future working day\r\nWORKING_DAY=Workday\r\n# XFLD: Legend non-working day\r\nNON_WORKING_DAY=Non-working Day\r\n\r\n# XMSG: Footer information about missing hours\r\nTOTAL_MISSING=Total Missing Hours\\: {0}\r\n\r\n#XFLD:\r\nMONTH_YEAR={0} {1} ({2} hours)\r\n\r\n#XBUT: Button\r\nSAVE=Save\r\n\r\n#XBUT: Button \r\nSUBMIT=Submit\r\n\r\n#XBUT: Button for quick entry\r\nSMART_FILL=Auto Entry\r\n\r\n# XMSG\r\nFILL_ALL=Enter {0} hours for\\:\r\n\r\n#XFLD\r\nNO_TASK_TYPE=No Task Type\r\n\r\n#XFLD\r\nMISSING_DAYS=Missing Days\\:{0}\r\n\r\n#XBUT: Button\r\nHOME=Home\r\n\r\n#XTIT: confirmation header\r\nCONFIRMATION=Confirmation\r\n\r\n#XTIT: deletion confirmation header\r\nDELETE_CONFIRMATION=Confirm Deletion\r\n\r\n#XTIT: submission confirmation header\r\nSUBMISSION_CONFIRMATION=Confirm Submission\r\n\r\n#XTIT: Draft submission confirmation header\r\nDRAFT_CONFIRMATION=Confirm Draft\r\n\r\n#XFLD: label for Deletion summary in Dialog\r\nDELETE_CONFIRMATION_SUMMARY=Summary of Time Entries Selected for Deletion\r\n\r\n#XFLD: label for Submission summary in Dialog\r\nSUBMISSION_CONFIRMATION_SUMMARY=Summary of Time Entries Selected for Submission\r\n\r\n#XFLD: label for Draft Submission summary in Dialog\r\nDRAFT_CONFIRMATION_SUMMARY=Summary of Time Entries Selected\r\n\r\n#XFLD: label for Number of entries in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_ENTRIES=Number of Entries\r\n\r\n#XFLD: label for Number of hours in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_HOURS=Number of Hours\r\n\r\n#XBUT: Confirm Button\r\nCONFIRM=Confirm\r\n\r\n#XMSG: Summary for confirmation - these are two dates\r\nSUMMARY={0} - {1}\r\n\r\n#XFLD: Week \r\nWEEK=Week\r\n\r\n#XFLD:\r\nMEET_TARGET_HOURS=Apply Hours To\\:\r\n\r\n#XBUT\r\nTHIS_WEEK=Current Week ({0} Hours)\r\n\r\n#XBUT\r\nALL_MISSING=All Missing Time ({0} Hours)\r\n\r\n#XBUT: Delete Button Text\r\nDELETE=Delete\r\n\r\n#XBUT: Add Button Text for Weekly Entry nav button\r\nNAV_ADD=Add Entry\r\n\r\n#XFLD: label for duration\r\nDURATION=Duration\r\n\r\n#XFLD: label for total duration\r\nTOTAL_DURATION=Total Duration\r\n\r\n#XFLD: label for status\r\nSTATUS=Status\r\n\r\n#XFLD: label for start time\r\nSTART_TIME=Start Time\r\n\r\n#XFLD: label for end Time\r\nEND_TIME=End Time\r\n\r\n#XFLD: label for note\r\nNOTE=Note\r\n\r\n#XFLD: label for Add New week entry\r\nADD_NEW=New Entry\r\n\r\n#XBUT: Done button\r\nDONE=Done\r\n\r\n# XTIT: Recently Used\r\nRECENTLY_USED=Suggestions\r\n\r\n# XTIT: Manual Input Add\r\nMANUAL_INPUT_ADD=Manual\r\n\r\n# XTIT: Manual Input Edit\r\nMANUAL_INPUT_EDIT=Edit Entry\r\n\r\n# XTIT: Cost Assignment\r\nCOST_ASSIGNMENT=Time Assignment\r\n\r\n#XFLD: Tap to Load More\r\nTAP_TO_LOAD_MORE=Load More\r\n\r\n#XFLD: Tap to Load More Loading\r\nTAP_TO_LOAD_MORE_LOADING=Loading...\r\n\r\n#XFLD: Continue Search on Server\r\nCONTINUE_SEARCH_ON_SERVER=Continue Search on Server...\r\n\r\n#XFLD: Continue Search on Server Loading\r\nCONTINUE_SEARCH_ON_SERVER_LOADING=Loading...\r\n\r\n#XFLD: BLANK\r\nEMPTY=Empty\r\n\r\n#XFLD: None\r\nNONE=None\r\n\r\n# XTIT: Select\r\nSELECT=Select {0}\r\n\r\n# XTIT: Placeholder for Cost Assignment Picker indicating Select action\r\nSELECT_PLACEHOLDER=Select\r\n\r\n#XFLD: Placeholder for cost assignment type search\r\nSEARCH=Searching...\r\n\r\n#XFLD: short label for hours\r\nHOURS_LABEL=h\r\n\r\n#XFLD: short label for minutes\r\nMINUTES_LABEL=m\r\n\r\n#XFLD: full label for hours \r\nHOURS_LABEL_FULL=Hours\r\n\r\n#XFLD: full label for minutes\r\nMINUTES_LABEL_FULL=Minutes\r\n\r\n#XFLD: label for date. When localizing do not change the MMM DD or YYYY, just the order of them\r\nDATE_LOCALE=MMM DD, YYYY\r\n\r\n\r\n#XBUT:\r\nDETAIL=Details\r\n\r\n\r\n#XFLD: label for Settings title\r\nSETTINGS_TITLE=Settings\r\n#XFLD: label for Settings data entry profile\r\nSETTINGS_DATA_ENTRY_PROFILE=Data Entry Profile\r\n#XFLD: label for Settings pre-fill label\r\nSETTINGS_PREFILL_LAST_WEEK=Auto Suggest\r\n\r\n# XMSG: \r\nCONFIRM_LEAVE_PAGE=Any unsaved data will be discarded. Are you sure you want to proceed?\r\n# XTIT: \r\nUNSAVED_CHANGES=Unsaved Changes\r\n\r\n#XMSG: toast message for successful submit\r\nSUBMIT_SUCCESS=Request Submitted\r\n\r\n#XMSG: toast message for successful draft submit\r\nDRAFT_SUCCESS=Draft saved successfully\r\n\r\n#XBUT:\r\nHELP=Help\r\n\r\n#XMSG: confirmation message for week entry\r\nTOTAL_BOOKED={0}/{1} hours entered for this week.\r\n\r\n#XMSG: help text for pre-fill option\r\nHELP_PREFILL=Turn on Pre-Fill to quickly populate hours for the week based on your last successful entry\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT_AUTO_ENTRY=Submit failed; review error details and try again\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT=Some entries are incorrect. Review error details and try again.\r\n\r\n#XMSG: error pop-up message text\r\nSUBMIT_HEADER_TEXT=Time entry for {0} and {1} more day(s)\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_EDIT_ENTRY_TITLE_SCREEN=Edit Time Entry\r\n\r\n#XMSG: Header in edit screen for single date\r\nSUBMIT_HEADER_TEXT_SINGLE=Time entry for {0}\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nFULL_CONCATENATE_HOURSMIN={0} hours {1} minutes\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nSHORT_CONCATENATE_HOURSMIN={0} h {1} m\r\n\r\n#XBUT: Button to reset\r\nRESET=Reset\r\n\r\n#XBUT: Button to create\r\nCREATE=Create\r\n',
	"hcm/emp/mytimesheet/i18n/i18n_en_US_sappsd.properties":'\r\n#XFLD: label for from time\r\nFROM=[[[\\u0192\\u0157\\u014F\\u0271]]]\r\n\r\n#XFLD: label for to time\r\nTO=[[[\\u0163\\u014F]]]\r\n\r\n#XBUT: Button to cancel\r\nCANCEL=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A]]]\r\n\r\n#XBUT: Button to close popover\r\nCLOSE=[[[\\u0108\\u013A\\u014F\\u015F\\u0113]]]\r\n\r\n#XBUT: Button to accept\r\nOK=[[[\\u014E\\u0136]]]\r\n\r\n#XBUT: Button to Save Draft\r\nSAVE_DRAFT=[[[\\u015C\\u0105\\u028B\\u0113 \\u010E\\u0157\\u0105\\u0192\\u0163]]]\r\n\r\n# XTIT: \r\nTIMESHEET_TITLE=[[[\\u039C\\u0177 \\u0162\\u012F\\u0271\\u0113\\u015F\\u0125\\u0113\\u0113\\u0163]]]\r\n\r\n# XTIT: \r\nTIMESHEET=[[[\\u0162\\u012F\\u0271\\u0113 \\u015C\\u0125\\u0113\\u0113\\u0163 \\u0114\\u014B\\u0163\\u0157\\u012F\\u0113\\u015F]]]\r\n\r\n# XTIT: \r\nWEEKENTRY_TITLE=[[[\\u039C\\u0105\\u014B\\u0171\\u0105\\u013A \\u0114\\u014B\\u0163\\u0157\\u0177]]]\r\n\r\n#XBUT: Button for quick entry\r\nQUICK_FILL=[[[\\u01EC\\u0171\\u012F\\u010B\\u0137 \\u0114\\u014B\\u0163\\u0157\\u0177]]]\r\n\r\n# XFLD: Apply to\r\nENTRY_VIEW_APPLY_TO=[[[\\u1000\\u03C1\\u03C1\\u013A\\u0177 \\u0162\\u014F]]]\r\n\r\n# XTIT: \r\nTIMESHEET_DETAILS_TITLE=[[[\\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F]]]\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_CREATE_ENTRY_TITLE=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113 \\u0162\\u012F\\u0271\\u0113 \\u0114\\u014B\\u0163\\u0157\\u0177]]]\r\n\r\n# XTIT: Title for create entry view with multiple days selected\r\nTIMESHEET_CREATE_ENTRIES_TITLE=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113 \\u0114\\u014B\\u0163\\u0157\\u0177 \\u0192\\u014F\\u0157 {0} \\u018C\\u0105\\u0177\\u015F]]]\r\n\r\n# XTIT: Title for Entry Details\r\nENTRY_DETAILS=[[[\\u0114\\u014B\\u0163\\u0157\\u0177 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F]]]\r\n\r\n# XTIT: Title for edit entry view for a particular date ({0} = date)\r\nTIMESHEET_EDIT_ENTRY_TITLE=[[[\\u0114\\u014B\\u0163\\u0157\\u0177 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F \\u0192\\u014F\\u0157 ]]]{0}\r\n\r\n# XTIT: Title for create entry view for a particular date ({0} = date)\r\nTIMESHEET_NEW_ENTRY_TITLE=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113 \\u0114\\u014B\\u0163\\u0157\\u0177 \\u0192\\u014F\\u0157 ]]]{0}\r\n\r\n# XTIT: Month short header\r\nMONTH_0=[[[\\u0134\\u0105\\u014B]]]\r\n# XTIT: Month short header\r\nMONTH_1=[[[\\u0191\\u0113\\u0183]]]\r\n# XTIT: Month short header\r\nMONTH_2=[[[\\u039C\\u0105\\u0157]]]\r\n# XTIT: Month short header\r\nMONTH_3=[[[\\u1000\\u03C1\\u0157]]]\r\n# XTIT: Month short header\r\nMONTH_4=[[[\\u039C\\u0105\\u0177]]]\r\n# XTIT: Month short header\r\nMONTH_5=[[[\\u0134\\u0171\\u014B]]]\r\n# XTIT: Month short header\r\nMONTH_6=[[[\\u0134\\u0171\\u013A]]]\r\n# XTIT: Month short header\r\nMONTH_7=[[[\\u1000\\u0171\\u011F]]]\r\n# XTIT: Month short header\r\nMONTH_8=[[[\\u015C\\u0113\\u03C1]]]\r\n# XTIT: Month short header\r\nMONTH_9=[[[\\u014E\\u010B\\u0163]]]\r\n# XTIT: Month short header\r\nMONTH_10=[[[\\u0143\\u014F\\u028B]]]\r\n# XTIT: Month short header\r\nMONTH_11=[[[\\u010E\\u0113\\u010B]]]\r\n\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_0=[[[\\u0134\\u0105\\u014B\\u0171\\u0105\\u0157\\u0177]]]\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_1=[[[\\u0191\\u0113\\u0183\\u0157\\u0171\\u0105\\u0157\\u0177]]]\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_2=[[[\\u039C\\u0105\\u0157\\u010B\\u0125]]]\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_3=[[[\\u1000\\u03C1\\u0157\\u012F\\u013A]]]\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_4=[[[\\u039C\\u0105\\u0177]]]\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_5=[[[\\u0134\\u0171\\u014B\\u0113]]]\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_6=[[[\\u0134\\u0171\\u013A\\u0177]]]\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_7=[[[\\u1000\\u0171\\u011F\\u0171\\u015F\\u0163]]]\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_8=[[[\\u015C\\u0113\\u03C1\\u0163\\u0113\\u0271\\u0183\\u0113\\u0157]]]\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_9=[[[\\u014E\\u010B\\u0163\\u014F\\u0183\\u0113\\u0157]]]\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_10=[[[\\u0143\\u014F\\u028B\\u0113\\u0271\\u0183\\u0113\\u0157]]]\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_11=[[[\\u010E\\u0113\\u010B\\u0113\\u0271\\u0183\\u0113\\u0157]]]\r\n\r\n# XTIT: Legend missing day\r\nMISSING_DAY=[[[\\u0176\\u014F\\u0171\\u0157 \\u1000\\u010B\\u0163\\u012F\\u014F\\u014B \\u0143\\u0113\\u0113\\u018C\\u0113\\u018C]]]\r\n# XTIT: Legend filled day\r\nFILLED_DAY=[[[\\u010E\\u014F\\u014B\\u0113]]]\r\n# XTIT: Legend filled in process, manager action needed\r\nFILLED_MANAGER=[[[\\u1000\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u0157 \\u1000\\u010B\\u0163\\u012F\\u014F\\u014B \\u0143\\u0113\\u0113\\u018C\\u0113\\u018C]]]\r\n# XFLD: Rejected by manager - this appears on the legend\r\nREJECTED=[[[\\u0158\\u0113\\u0135\\u0113\\u010B\\u0163\\u0113\\u018C]]]\r\n# XFLD: Legend future working day\r\nWORKING_DAY=[[[\\u0174\\u014F\\u0157\\u0137\\u018C\\u0105\\u0177]]]\r\n# XFLD: Legend non-working day\r\nNON_WORKING_DAY=[[[\\u0143\\u014F\\u014B-\\u0175\\u014F\\u0157\\u0137\\u012F\\u014B\\u011F \\u018C\\u0105\\u0177]]]\r\n\r\n# XMSG: Footer information about missing hours\r\nTOTAL_MISSING=[[[\\u0162\\u014F\\u0163\\u0105\\u013A \\u039C\\u012F\\u015F\\u015F\\u012F\\u014B\\u011F \\u0124\\u014F\\u0171\\u0157\\u015F\\: ]]]{0}\r\n\r\n#XFLD:\r\nMONTH_YEAR={0}[[[ {1} ({2} \\u0125\\u014F\\u0171\\u0157\\u015F)]]]\r\n\r\n#XBUT: Button\r\nSAVE=[[[\\u015C\\u0105\\u028B\\u0113]]]\r\n\r\n#XBUT: Button \r\nSUBMIT=[[[\\u015C\\u0171\\u0183\\u0271\\u012F\\u0163]]]\r\n\r\n#XBUT: Button for quick entry\r\nSMART_FILL=[[[\\u1000\\u0171\\u0163\\u014F \\u0114\\u014B\\u0163\\u0157\\u0177]]]\r\n\r\n# XMSG\r\nFILL_ALL=[[[\\u0114\\u014B\\u0163\\u0113\\u0157 {0} \\u0125\\u014F\\u0171\\u0157\\u015F \\u0192\\u014F\\u0157\\:]]]\r\n\r\n#XFLD\r\nNO_TASK_TYPE=[[[\\u0143\\u014F \\u0162\\u0105\\u015F\\u0137 \\u0162\\u0177\\u03C1\\u0113]]]\r\n\r\n#XFLD\r\nMISSING_DAYS=[[[\\u039C\\u012F\\u015F\\u015F\\u012F\\u014B\\u011F \\u010E\\u0105\\u0177\\u015F\\:]]]{0}\r\n\r\n#XBUT: Button\r\nHOME=[[[\\u0124\\u014F\\u0271\\u0113]]]\r\n\r\n#XTIT: confirmation header\r\nCONFIRMATION=[[[\\u0108\\u014F\\u014B\\u0192\\u012F\\u0157\\u0271\\u0105\\u0163\\u012F\\u014F\\u014B]]]\r\n\r\n#XTIT: deletion confirmation header\r\nDELETE_CONFIRMATION=[[[\\u0108\\u014F\\u014B\\u0192\\u012F\\u0157\\u0271 \\u010E\\u0113\\u013A\\u0113\\u0163\\u012F\\u014F\\u014B]]]\r\n\r\n#XTIT: submission confirmation header\r\nSUBMISSION_CONFIRMATION=[[[\\u0108\\u014F\\u014B\\u0192\\u012F\\u0157\\u0271 \\u015C\\u0171\\u0183\\u0271\\u012F\\u015F\\u015F\\u012F\\u014F\\u014B]]]\r\n\r\n#XTIT: Draft submission confirmation header\r\nDRAFT_CONFIRMATION=[[[\\u0108\\u014F\\u014B\\u0192\\u012F\\u0157\\u0271 \\u010E\\u0157\\u0105\\u0192\\u0163]]]\r\n\r\n#XFLD: label for Deletion summary in Dialog\r\nDELETE_CONFIRMATION_SUMMARY=[[[\\u015C\\u0171\\u0271\\u0271\\u0105\\u0157\\u0177 \\u014F\\u0192 \\u0163\\u012F\\u0271\\u0113 \\u0113\\u014B\\u0163\\u0157\\u012F\\u0113\\u015F \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C \\u0192\\u014F\\u0157 \\u010E\\u0113\\u013A\\u0113\\u0163\\u012F\\u014F\\u014B]]]\r\n\r\n#XFLD: label for Submission summary in Dialog\r\nSUBMISSION_CONFIRMATION_SUMMARY=[[[\\u015C\\u0171\\u0271\\u0271\\u0105\\u0157\\u0177 \\u014F\\u0192 \\u0163\\u012F\\u0271\\u0113 \\u0113\\u014B\\u0163\\u0157\\u012F\\u0113\\u015F \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C \\u0192\\u014F\\u0157 \\u015C\\u0171\\u0183\\u0271\\u012F\\u015F\\u015F\\u012F\\u014F\\u014B]]]\r\n\r\n#XFLD: label for Draft Submission summary in Dialog\r\nDRAFT_CONFIRMATION_SUMMARY=[[[\\u015C\\u0171\\u0271\\u0271\\u0105\\u0157\\u0177 \\u014F\\u0192 \\u0163\\u012F\\u0271\\u0113 \\u0113\\u014B\\u0163\\u0157\\u012F\\u0113\\u015F \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C]]]\r\n\r\n#XFLD: label for Number of entries in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_ENTRIES=[[[\\u0143\\u0171\\u0271\\u0183\\u0113\\u0157 \\u014F\\u0192 \\u0114\\u014B\\u0163\\u0157\\u012F\\u0113\\u015F]]]\r\n\r\n#XFLD: label for Number of hours in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_HOURS=[[[\\u0143\\u0171\\u0271\\u0183\\u0113\\u0157 \\u014F\\u0192 \\u0124\\u014F\\u0171\\u0157\\u015F]]]\r\n\r\n#XBUT: Confirm Button\r\nCONFIRM=[[[\\u0108\\u014F\\u014B\\u0192\\u012F\\u0157\\u0271]]]\r\n\r\n#XMSG: Summary for confirmation - these are two dates\r\nSUMMARY={0}[[[ - ]]]{1}\r\n\r\n#XFLD: Week \r\nWEEK=[[[\\u0174\\u0113\\u0113\\u0137]]]\r\n\r\n#XFLD:\r\nMEET_TARGET_HOURS=[[[\\u1000\\u03C1\\u03C1\\u013A\\u0177 \\u0125\\u014F\\u0171\\u0157\\u015F \\u0163\\u014F\\:]]]\r\n\r\n#XBUT\r\nTHIS_WEEK=[[[\\u0108\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163 \\u0174\\u0113\\u0113\\u0137 ({0} \\u0125\\u014F\\u0171\\u0157\\u015F)]]]\r\n\r\n#XBUT\r\nALL_MISSING=[[[\\u1000\\u013A\\u013A \\u039C\\u012F\\u015F\\u015F\\u012F\\u014B\\u011F \\u0162\\u012F\\u0271\\u0113 ({0} \\u0125\\u014F\\u0171\\u0157\\u015F)]]]\r\n\r\n#XBUT: Delete Button Text\r\nDELETE=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113]]]\r\n\r\n#XBUT: Add Button Text for Weekly Entry nav button\r\nNAV_ADD=[[[\\u1000\\u018C\\u018C \\u0114\\u014B\\u0163\\u0157\\u0177]]]\r\n\r\n#XFLD: label for duration\r\nDURATION=[[[\\u010E\\u0171\\u0157\\u0105\\u0163\\u012F\\u014F\\u014B]]]\r\n\r\n#XFLD: label for total duration\r\nTOTAL_DURATION=[[[\\u0162\\u014F\\u0163\\u0105\\u013A \\u010E\\u0171\\u0157\\u0105\\u0163\\u012F\\u014F\\u014B]]]\r\n\r\n#XFLD: label for status\r\nSTATUS=[[[\\u015C\\u0163\\u0105\\u0163\\u0171\\u015F]]]\r\n\r\n#XFLD: label for start time\r\nSTART_TIME=[[[\\u015C\\u0163\\u0105\\u0157\\u0163 \\u0162\\u012F\\u0271\\u0113]]]\r\n\r\n#XFLD: label for end Time\r\nEND_TIME=[[[\\u0114\\u014B\\u018C \\u0162\\u012F\\u0271\\u0113]]]\r\n\r\n#XFLD: label for note\r\nNOTE=[[[\\u0143\\u014F\\u0163\\u0113]]]\r\n\r\n#XFLD: label for Add New week entry\r\nADD_NEW=[[[\\u0143\\u0113\\u0175 \\u0114\\u014B\\u0163\\u0157\\u0177]]]\r\n\r\n#XBUT: Done button\r\nDONE=[[[\\u010E\\u014F\\u014B\\u0113]]]\r\n\r\n# XTIT: Recently Used\r\nRECENTLY_USED=[[[\\u015C\\u0171\\u011F\\u011F\\u0113\\u015F\\u0163\\u012F\\u014F\\u014B\\u015F]]]\r\n\r\n# XTIT: Manual Input Add\r\nMANUAL_INPUT_ADD=[[[\\u039C\\u0105\\u014B\\u0171\\u0105\\u013A]]]\r\n\r\n# XTIT: Manual Input Edit\r\nMANUAL_INPUT_EDIT=[[[\\u0114\\u018C\\u012F\\u0163 \\u0114\\u014B\\u0163\\u0157\\u0177]]]\r\n\r\n# XTIT: Cost Assignment\r\nCOST_ASSIGNMENT=[[[\\u0162\\u012F\\u0271\\u0113 \\u1000\\u015F\\u015F\\u012F\\u011F\\u014B\\u0271\\u0113\\u014B\\u0163]]]\r\n\r\n#XFLD: Tap to Load More\r\nTAP_TO_LOAD_MORE=[[[\\u013B\\u014F\\u0105\\u018C \\u039C\\u014F\\u0157\\u0113]]]\r\n\r\n#XFLD: Tap to Load More Loading\r\nTAP_TO_LOAD_MORE_LOADING=[[[\\u013B\\u014F\\u0105\\u018C\\u012F\\u014B\\u011F...]]]\r\n\r\n#XFLD: Continue Search on Server\r\nCONTINUE_SEARCH_ON_SERVER=[[[\\u0108\\u014F\\u014B\\u0163\\u012F\\u014B\\u0171\\u0113 \\u015C\\u0113\\u0105\\u0157\\u010B\\u0125 \\u014F\\u014B \\u015C\\u0113\\u0157\\u028B\\u0113\\u0157...]]]\r\n\r\n#XFLD: Continue Search on Server Loading\r\nCONTINUE_SEARCH_ON_SERVER_LOADING=[[[\\u013B\\u014F\\u0105\\u018C\\u012F\\u014B\\u011F...]]]\r\n\r\n#XFLD: BLANK\r\nEMPTY=[[[\\u0114\\u0271\\u03C1\\u0163\\u0177]]]\r\n\r\n#XFLD: None\r\nNONE=[[[\\u0143\\u014F\\u014B\\u0113]]]\r\n\r\n# XTIT: Select\r\nSELECT=[[[\\u015C\\u0113\\u013A\\u0113\\u010B\\u0163 ]]]{0}\r\n\r\n# XTIT: Placeholder for Cost Assignment Picker indicating Select action\r\nSELECT_PLACEHOLDER=[[[\\u015C\\u0113\\u013A\\u0113\\u010B\\u0163]]]\r\n\r\n#XFLD: Placeholder for cost assignment type search\r\nSEARCH=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125...]]]\r\n\r\n#XFLD: short label for hours\r\nHOURS_LABEL=[[[\\u0125]]]\r\n\r\n#XFLD: short label for minutes\r\nMINUTES_LABEL=[[[\\u0271]]]\r\n\r\n#XFLD: full label for hours \r\nHOURS_LABEL_FULL=[[[\\u0125\\u014F\\u0171\\u0157\\u015F]]]\r\n\r\n#XFLD: full label for minutes\r\nMINUTES_LABEL_FULL=[[[\\u0271\\u012F\\u014B\\u0171\\u0163\\u0113\\u015F]]]\r\n\r\n#XFLD: label for date. When localizing do not change the MMM DD or YYYY, just the order of them\r\nDATE_LOCALE=[[[\\u039C\\u039C\\u039C \\u010E\\u010E, \\u0176\\u0176\\u0176\\u0176]]]\r\n\r\n\r\n#XBUT:\r\nDETAIL=[[[\\u010E\\u0113\\u0163\\u0105\\u012F\\u013A]]]\r\n\r\n\r\n#XFLD: label for Settings title\r\nSETTINGS_TITLE=[[[\\u015C\\u0113\\u0163\\u0163\\u012F\\u014B\\u011F\\u015F]]]\r\n#XFLD: label for Settings data entry profile\r\nSETTINGS_DATA_ENTRY_PROFILE=[[[\\u010E\\u0105\\u0163\\u0105 \\u0114\\u014B\\u0163\\u0157\\u0177 \\u01A4\\u0157\\u014F\\u0192\\u012F\\u013A\\u0113]]]\r\n#XFLD: label for Settings pre-fill label\r\nSETTINGS_PREFILL_LAST_WEEK=[[[\\u1000\\u0171\\u0163\\u014F \\u015C\\u0171\\u011F\\u011F\\u0113\\u015F\\u0163]]]\r\n\r\n# XMSG: \r\nCONFIRM_LEAVE_PAGE=[[[\\u1000\\u014B\\u0177 \\u0171\\u014B\\u015F\\u0105\\u028B\\u0113\\u018C \\u018C\\u0105\\u0163\\u0105 \\u0175\\u012F\\u013A\\u013A \\u0183\\u0113 \\u018C\\u012F\\u015F\\u010B\\u0105\\u0157\\u018C\\u0113\\u018C. \\u1000\\u0157\\u0113 \\u0177\\u014F\\u0171 \\u015F\\u0171\\u0157\\u0113 \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u03C1\\u0157\\u014F\\u010B\\u0113\\u0113\\u018C?]]]\r\n# XTIT: \r\nUNSAVED_CHANGES=[[[\\u016E\\u014B\\u015F\\u0105\\u028B\\u0113\\u018C \\u0108\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F]]]\r\n\r\n#XMSG: toast message for successful submit\r\nSUBMIT_SUCCESS=[[[\\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u015C\\u0171\\u0183\\u0271\\u012F\\u0163\\u0163\\u0113\\u018C]]]\r\n\r\n#XMSG: toast message for successful draft submit\r\nDRAFT_SUCCESS=[[[\\u010E\\u0157\\u0105\\u0192\\u0163 \\u015C\\u0105\\u028B\\u0113\\u018C \\u015C\\u0171\\u010B\\u010B\\u0113\\u015F\\u015F\\u0192\\u0171\\u013A\\u013A\\u0177]]]\r\n\r\n#XBUT:\r\nHELP=[[[\\u0124\\u0113\\u013A\\u03C1]]]\r\n\r\n#XMSG: confirmation message for week entry\r\nTOTAL_BOOKED={0}[[[/{1} \\u0125\\u014F\\u0171\\u0157\\u015F \\u0113\\u014B\\u0163\\u0113\\u0157\\u0113\\u018C \\u0192\\u014F\\u0157 \\u0163\\u0125\\u012F\\u015F \\u0175\\u0113\\u0113\\u0137.]]]\r\n\r\n#XMSG: help text for pre-fill option\r\nHELP_PREFILL=[[[\\u0162\\u0171\\u0157\\u014B \\u014E\\u0143 \\u01A4\\u0157\\u0113-\\u0191\\u012F\\u013A\\u013A \\u0163\\u014F \\u01A3\\u0171\\u012F\\u010B\\u0137\\u013A\\u0177 \\u03C1\\u014F\\u03C1\\u0171\\u013A\\u0105\\u0163\\u0113 \\u0125\\u014F\\u0171\\u0157\\u015F \\u0192\\u014F\\u0157 \\u0163\\u0125\\u0113 \\u0175\\u0113\\u0113\\u0137 \\u0183\\u0105\\u015F\\u0113\\u018C \\u014F\\u014B \\u0177\\u014F\\u0171\\u0157 \\u013A\\u0105\\u015F\\u0163 \\u015F\\u0171\\u010B\\u010B\\u0113\\u015F\\u015F\\u0192\\u0171\\u013A \\u0113\\u014B\\u0163\\u0157\\u0177.]]]\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT_AUTO_ENTRY=[[[\\u015C\\u0171\\u0183\\u0271\\u012F\\u0163 \\u0192\\u0105\\u012F\\u013A\\u0113\\u018C. \\u0158\\u0113\\u028B\\u012F\\u0113\\u0175 \\u0113\\u0157\\u0157\\u014F\\u0157 \\u018C\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F.]]]\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT=[[[\\u015C\\u014F\\u0271\\u0113 \\u0113\\u014B\\u0163\\u0157\\u012F\\u0113\\u015F \\u0105\\u0157\\u0113 \\u012F\\u014B\\u010B\\u014F\\u0157\\u0157\\u0113\\u010B\\u0163. \\u0158\\u0113\\u028B\\u012F\\u0113\\u0175 \\u0113\\u0157\\u0157\\u014F\\u0157 \\u018C\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F \\u0105\\u014B\\u018C \\u010B\\u014F\\u0157\\u0157\\u0113\\u010B\\u0163 \\u0113\\u014B\\u0163\\u0157\\u012F\\u0113\\u015F.]]]\r\n\r\n#XMSG: error pop-up message text\r\nSUBMIT_HEADER_TEXT=[[[\\u0162\\u012F\\u0271\\u0113 \\u0113\\u014B\\u0163\\u0157\\u0177 \\u0192\\u014F\\u0157 {0} \\u0105\\u014B\\u018C {1} \\u0271\\u014F\\u0157\\u0113 \\u018C\\u0105\\u0177(\\u015F)]]]\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_EDIT_ENTRY_TITLE_SCREEN=[[[\\u0114\\u018C\\u012F\\u0163 \\u0162\\u012F\\u0271\\u0113 \\u0114\\u014B\\u0163\\u0157\\u0177]]]\r\n\r\n#XMSG: Header in edit screen for single date\r\nSUBMIT_HEADER_TEXT_SINGLE=[[[\\u0162\\u012F\\u0271\\u0113 \\u0113\\u014B\\u0163\\u0157\\u0177 \\u0192\\u014F\\u0157 ]]]{0}\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nFULL_CONCATENATE_HOURSMIN={0}[[[\\u0125\\u014F\\u0171\\u0157\\u015F {1}\\u0271\\u012F\\u014B\\u0171\\u0163\\u0113\\u015F]]]\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nSHORT_CONCATENATE_HOURSMIN={0}[[[\\u0125 {1}\\u0271]]]\r\n\r\n#XBUT: Button to reset\r\nRESET=[[[\\u0158\\u0113\\u015F\\u0113\\u0163]]]\r\n\r\n#XBUT: Button to create\r\nCREATE=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113]]]\r\n',
	"hcm/emp/mytimesheet/i18n/i18n_en_US_saptrc.properties":'\r\n#XFLD: label for from time\r\nFROM=GYrPRY1ANhUieSYOT4f+aA_from\r\n\r\n#XFLD: label for to time\r\nTO=P0APeM4yGQkceNyNhp+Lbg_to\r\n\r\n#XBUT: Button to cancel\r\nCANCEL=pxvphTWUwN5aC+KcB6e2eg_Cancel\r\n\r\n#XBUT: Button to close popover\r\nCLOSE=L4gPGlrYDwZrZ4PG0qaxuQ_Close\r\n\r\n#XBUT: Button to accept\r\nOK=kXpdgg1vRBfUlqleF7hKiA_OK\r\n\r\n#XBUT: Button to Save Draft\r\nSAVE_DRAFT=qcDQMA7UUJx4XDmk5ZkMoA_Save Draft\r\n\r\n# XTIT: \r\nTIMESHEET_TITLE=H+sf8w5D6uFBlx6ob0CjHg_My Timesheet\r\n\r\n# XTIT: \r\nTIMESHEET=P4ctvdwpeKXoD46Vcxgb0Q_Time Sheet Entries\r\n\r\n# XTIT: \r\nWEEKENTRY_TITLE=IckXG3L9T4ZeWG1wr/MnHw_Manual Entry\r\n\r\n#XBUT: Button for quick entry\r\nQUICK_FILL=gX8spvgxSE+JGU637o6vFg_Quick Entry\r\n\r\n# XFLD: Apply to\r\nENTRY_VIEW_APPLY_TO=VrmhjH7849I8NV79Yv+67w_Apply To\r\n\r\n# XTIT: \r\nTIMESHEET_DETAILS_TITLE=orZcA82ezA5Qy1Tp8CU/hg_Details\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_CREATE_ENTRY_TITLE=oPqC/Dm2R3Di+LoCQ7RO/Q_Create Time Entry\r\n\r\n# XTIT: Title for create entry view with multiple days selected\r\nTIMESHEET_CREATE_ENTRIES_TITLE=QU0ucmkF1TJQhbdjY5scfw_Create Entry for {0} days\r\n\r\n# XTIT: Title for Entry Details\r\nENTRY_DETAILS=ETuJtqEXid6LmuJeY7MIJw_Entry Details\r\n\r\n# XTIT: Title for edit entry view for a particular date ({0} = date)\r\nTIMESHEET_EDIT_ENTRY_TITLE=mE1HoMt5thjDSe1Zi+AmAw_Entry Details for {0}\r\n\r\n# XTIT: Title for create entry view for a particular date ({0} = date)\r\nTIMESHEET_NEW_ENTRY_TITLE=DzxNhJZf8KqJXeZpd5MnjA_Create Entry for {0}\r\n\r\n# XTIT: Month short header\r\nMONTH_0=JNw9FR0Hx1wC+fbskrkebw_Jan\r\n# XTIT: Month short header\r\nMONTH_1=3kmfVhDF/dqIkeKGxUTFhg_Feb\r\n# XTIT: Month short header\r\nMONTH_2=0drknCbY79oEMhHMg8v1NQ_Mar\r\n# XTIT: Month short header\r\nMONTH_3=3H96enTtiFjr5qEvDncKQQ_Apr\r\n# XTIT: Month short header\r\nMONTH_4=T3i1bAMinznnIJKA1/T0lA_May\r\n# XTIT: Month short header\r\nMONTH_5=dmz/UsjAayXRZZWzT/9AUg_Jun\r\n# XTIT: Month short header\r\nMONTH_6=ao1JImQkqX35gm3FugojVA_Jul\r\n# XTIT: Month short header\r\nMONTH_7=fAHAuFoWgn7d6vkJ7T+Uww_Aug\r\n# XTIT: Month short header\r\nMONTH_8=b6yQNMk6fzXHEbZ1HrbpZw_Sep\r\n# XTIT: Month short header\r\nMONTH_9=atBbDsbOWtorMWVCSkC5DA_Oct\r\n# XTIT: Month short header\r\nMONTH_10=GGr8OoQmcmosekEfiCrHNw_Nov\r\n# XTIT: Month short header\r\nMONTH_11=L/dsxrSB62w9vmlw/l3vdw_Dec\r\n\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_0=onf91nZvEn+8IcOyCWWaxw_January\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_1=d5eoy3P3LO4oEEyYoIWweg_February\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_2=zVl5DC/MhumM3VYOnnCURQ_March\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_3=r/puw482eZW4ZQ5ffXxvjg_April\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_4=mOW3a/6YQw4gb5HBmlZ6mA_May\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_5=vropV+8R3S3i2Yejpb5yEA_June\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_6=FiA5J396idhGWCd5UE+dMw_July\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_7=jnqPOBB6vsFPu80UQa7WwQ_August\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_8=6PeHsYYPqFOb2M9mUoBOvg_September\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_9=zrEEbpMRRoROLOBf95JVpQ_October\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_10=73Mld+z84HXPd5me9sWKqQ_November\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_11=auwfOqiXFH8/Kng5KOg/Xg_December\r\n\r\n# XTIT: Legend missing day\r\nMISSING_DAY=+ARb7A6IRGPGXhXk3JRUJQ_Your Action Needed\r\n# XTIT: Legend filled day\r\nFILLED_DAY=I5JKdM7/SwR94NZlXiN9AA_Done\r\n# XTIT: Legend filled in process, manager action needed\r\nFILLED_MANAGER=JAW+DJVaDxR3hzJ6KHWsug_Approver Action Needed\r\n# XFLD: Rejected by manager - this appears on the legend\r\nREJECTED=PmjZicpRAm9fK/cLmupvmw_Rejected\r\n# XFLD: Legend future working day\r\nWORKING_DAY=so/6GSPgDu6kch1IKdZeXw_Workday\r\n# XFLD: Legend non-working day\r\nNON_WORKING_DAY=arrnauSNEcKefCE8Mjnj0w_Non-working day\r\n\r\n# XMSG: Footer information about missing hours\r\nTOTAL_MISSING=8SefB9kNZf79ry5of7WW3g_Total Missing Hours\\: {0}\r\n\r\n#XFLD:\r\nMONTH_YEAR=53UcLJLqeZq+waSH3YJtxg_{0} {1} ({2} hours)\r\n\r\n#XBUT: Button\r\nSAVE=CGiPONN4EUzAPgEMUkYz1A_Save\r\n\r\n#XBUT: Button \r\nSUBMIT=rHpKdvcokyFtbks+6anYuw_Submit\r\n\r\n#XBUT: Button for quick entry\r\nSMART_FILL=JNihS5ptB+HH1AEo+xkKQw_Auto Entry\r\n\r\n# XMSG\r\nFILL_ALL=SslZQ9IMmhj7/aZ6sMJZ6A_Enter {0} hours for\\:\r\n\r\n#XFLD\r\nNO_TASK_TYPE=Vq0FeSmnmuKqiCZvSWMV3A_No Task Type\r\n\r\n#XFLD\r\nMISSING_DAYS=E63fOLLIWwzsZwH5/VkJfg_Missing Days\\:{0}\r\n\r\n#XBUT: Button\r\nHOME=RVwoSUfl1drW16He5TEfFQ_Home\r\n\r\n#XTIT: confirmation header\r\nCONFIRMATION=OULMJ+YmTR46gfVeo09J+g_Confirmation\r\n\r\n#XTIT: deletion confirmation header\r\nDELETE_CONFIRMATION=paHPLLKmY4HolnWQXtRI6w_Confirm Deletion\r\n\r\n#XTIT: submission confirmation header\r\nSUBMISSION_CONFIRMATION=HBVC9rEFBU9dJmVG1OR/6w_Confirm Submission\r\n\r\n#XTIT: Draft submission confirmation header\r\nDRAFT_CONFIRMATION=pRvHLybY1V0WUdl00ihOGQ_Confirm Draft\r\n\r\n#XFLD: label for Deletion summary in Dialog\r\nDELETE_CONFIRMATION_SUMMARY=NTupOjX8uFYe/gHXkkhfOg_Summary of time entries selected for Deletion\r\n\r\n#XFLD: label for Submission summary in Dialog\r\nSUBMISSION_CONFIRMATION_SUMMARY=LFQsrh/uXQZEiuo43vdTRA_Summary of time entries selected for Submission\r\n\r\n#XFLD: label for Draft Submission summary in Dialog\r\nDRAFT_CONFIRMATION_SUMMARY=7rRY56U1DIG5gRIAcYuY/w_Summary of time entries selected\r\n\r\n#XFLD: label for Number of entries in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_ENTRIES=ZQMyr2Ns7pdPsKK66QJOLw_Number of Entries\r\n\r\n#XFLD: label for Number of hours in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_HOURS=9BHDv1GHzPRgG85Ek2fZFg_Number of Hours\r\n\r\n#XBUT: Confirm Button\r\nCONFIRM=lgd+EFJuPKsRv6TIVd0AUg_Confirm\r\n\r\n#XMSG: Summary for confirmation - these are two dates\r\nSUMMARY=UTUfBQatg73jpm14aHqXSg_{0} - {1}\r\n\r\n#XFLD: Week \r\nWEEK=EixxaRHkqyQ5bVL1cya89g_Week\r\n\r\n#XFLD:\r\nMEET_TARGET_HOURS=/2YJAhuHPb6XTyh083iWfA_Apply hours to\\:\r\n\r\n#XBUT\r\nTHIS_WEEK=X2NHfkC9s69ig8cLEZ9z4w_Current Week ({0} hours)\r\n\r\n#XBUT\r\nALL_MISSING=bQAlCHiLkSgCHDnJIXFujQ_All Missing Time ({0} hours)\r\n\r\n#XBUT: Delete Button Text\r\nDELETE=adFXr7h+Q2fIQKx0yv+HLA_Delete\r\n\r\n#XBUT: Add Button Text for Weekly Entry nav button\r\nNAV_ADD=2Ay5CKxTzet9VRQNa6lN8Q_Add Entry\r\n\r\n#XFLD: label for duration\r\nDURATION=1quAQfFYtK5sZFTROMqFLQ_Duration\r\n\r\n#XFLD: label for total duration\r\nTOTAL_DURATION=g4su7VLb5aHSsr4QSceysQ_Total Duration\r\n\r\n#XFLD: label for status\r\nSTATUS=qQQnmGGrrTKMQzVZVH9kgA_Status\r\n\r\n#XFLD: label for start time\r\nSTART_TIME=KAo7QYtLiPbzGDhMmlHb3Q_Start Time\r\n\r\n#XFLD: label for end Time\r\nEND_TIME=kBhAB6C0OI/V9/qe/2Qt1A_End Time\r\n\r\n#XFLD: label for note\r\nNOTE=eW+xuRgwDqFbljHKwJUm9A_Note\r\n\r\n#XFLD: label for Add New week entry\r\nADD_NEW=d/X+vTaPu3z1Y4/szRTetg_New Entry\r\n\r\n#XBUT: Done button\r\nDONE=6xyrMOz520xVKwnf0GLBnw_Done\r\n\r\n# XTIT: Recently Used\r\nRECENTLY_USED=3rNsvy8AuEhPGPKqicICXA_Suggestions\r\n\r\n# XTIT: Manual Input Add\r\nMANUAL_INPUT_ADD=aw0Tg+yd+XPKFzjoqOrDdw_Manual\r\n\r\n# XTIT: Manual Input Edit\r\nMANUAL_INPUT_EDIT=m3L1z78GXDFlEFJTOfUaMg_Edit Entry\r\n\r\n# XTIT: Cost Assignment\r\nCOST_ASSIGNMENT=+1QDW0ZmuBUiIDHSqKRnfg_Time Assignment\r\n\r\n#XFLD: Tap to Load More\r\nTAP_TO_LOAD_MORE=/uT/Shzv5HYWz8ejOWBiOg_Load More\r\n\r\n#XFLD: Tap to Load More Loading\r\nTAP_TO_LOAD_MORE_LOADING=I3CGSflSrj9jc5duxC5u8Q_Loading...\r\n\r\n#XFLD: Continue Search on Server\r\nCONTINUE_SEARCH_ON_SERVER=LwQ3CT8fFGd7n26SN5PZKQ_Continue Search on Server...\r\n\r\n#XFLD: Continue Search on Server Loading\r\nCONTINUE_SEARCH_ON_SERVER_LOADING=CpdAXaZxiT43zFwihLQuag_Loading...\r\n\r\n#XFLD: BLANK\r\nEMPTY=OcyXJgQ9H4Rzt9237pFB+Q_Empty\r\n\r\n#XFLD: None\r\nNONE=KEpWO+z5JPSMf/6YYZRkTw_None\r\n\r\n# XTIT: Select\r\nSELECT=O1LcyzZpuG8QvGhG+2U/9A_Select {0}\r\n\r\n# XTIT: Placeholder for Cost Assignment Picker indicating Select action\r\nSELECT_PLACEHOLDER=E7dKEiLTnuI5Dw/2PfN2Yg_Select\r\n\r\n#XFLD: Placeholder for cost assignment type search\r\nSEARCH=OCQw/+E1UhD6IAbruKFOxA_Search...\r\n\r\n#XFLD: short label for hours\r\nHOURS_LABEL=lCyoxQxlmgS23HacaAwyxg_h\r\n\r\n#XFLD: short label for minutes\r\nMINUTES_LABEL=wCLsPRXhCf6nVUjZgpGVZQ_m\r\n\r\n#XFLD: full label for hours \r\nHOURS_LABEL_FULL=HQUch4K0fEZJWPVlozmqtw_hours\r\n\r\n#XFLD: full label for minutes\r\nMINUTES_LABEL_FULL=F4MyLaLFo0Lw9hZgYTaM1w_minutes\r\n\r\n#XFLD: label for date. When localizing do not change the MMM DD or YYYY, just the order of them\r\nDATE_LOCALE=dx/FoDpCPMezzuZWfgV85Q_MMM DD, YYYY\r\n\r\n\r\n#XBUT:\r\nDETAIL=TduTrVAUIhuUAfoB0o4YCA_Detail\r\n\r\n\r\n#XFLD: label for Settings title\r\nSETTINGS_TITLE=4C7zMIa2eWgNYjWDmf6prg_Settings\r\n#XFLD: label for Settings data entry profile\r\nSETTINGS_DATA_ENTRY_PROFILE=tKPChJS51lLzFuxE3yv91w_Data Entry Profile\r\n#XFLD: label for Settings pre-fill label\r\nSETTINGS_PREFILL_LAST_WEEK=3BePTJQnoYNNVEqXg1TZuw_Auto Suggest\r\n\r\n# XMSG: \r\nCONFIRM_LEAVE_PAGE=M+r0kT+/hHNfPMPq2P0VDA_Any unsaved data will be discarded. Are you sure you want to proceed?\r\n# XTIT: \r\nUNSAVED_CHANGES=XLIReP6p63Bg+WZ6tpiyOg_Unsaved Changes\r\n\r\n#XMSG: toast message for successful submit\r\nSUBMIT_SUCCESS=0ErZOS93pk9h9h8QF60chw_Request Submitted\r\n\r\n#XMSG: toast message for successful draft submit\r\nDRAFT_SUCCESS=peU8f4fAnmjyH2Mn5qBp3A_Draft Saved Successfully\r\n\r\n#XBUT:\r\nHELP=gDxUw4EWuIWdNNDq9OxIoQ_Help\r\n\r\n#XMSG: confirmation message for week entry\r\nTOTAL_BOOKED=Burpo3Asn1G5Sg/KhK/kBw_{0}/{1} hours entered for this week.\r\n\r\n#XMSG: help text for pre-fill option\r\nHELP_PREFILL=3AZvWIhz0VVs2Kfs7D+CWQ_Turn ON Pre-Fill to quickly populate hours for the week based on your last successful entry.\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT_AUTO_ENTRY=aOQ4wlZa2bzYW134++Q0LQ_Submit failed. Review error details.\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT=A51EVRD+xgkLPGAshAgsEw_Some entries are incorrect. Review error details and correct entries.\r\n\r\n#XMSG: error pop-up message text\r\nSUBMIT_HEADER_TEXT=RLhlc1MZSaG998e1GDTFtw_Time entry for {0} and {1} more day(s)\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_EDIT_ENTRY_TITLE_SCREEN=zTXGky9Yfq9odnDxHtauxQ_Edit Time Entry\r\n\r\n#XMSG: Header in edit screen for single date\r\nSUBMIT_HEADER_TEXT_SINGLE=rAKdxFmkJpoX1HRx4pr1+g_Time entry for {0}\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nFULL_CONCATENATE_HOURSMIN=nZDZOkINcjkbZo2FODowRQ_{0}hours {1}minutes\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nSHORT_CONCATENATE_HOURSMIN=S1N8+GURanC4ffIef/tQyA_{0}h {1}m\r\n\r\n#XBUT: Button to reset\r\nRESET=hoKJvV/PRYVIYrPvXDA6Cw_Reset\r\n\r\n#XBUT: Button to create\r\nCREATE=hLLIaopmPNFEL+xb3xvEBw_Create\r\n',
	"hcm/emp/mytimesheet/i18n/i18n_es.properties":'\r\n#XFLD: label for from time\r\nFROM=De\r\n\r\n#XFLD: label for to time\r\nTO=A\r\n\r\n#XBUT: Button to cancel\r\nCANCEL=Cancelar\r\n\r\n#XBUT: Button to close popover\r\nCLOSE=Cerrar\r\n\r\n#XBUT: Button to accept\r\nOK=OK\r\n\r\n#XBUT: Button to Save Draft\r\nSAVE_DRAFT=Guardar borrador\r\n\r\n# XTIT: \r\nTIMESHEET_TITLE=Registro de tiempos\r\n\r\n# XTIT: \r\nTIMESHEET=Entradas en registro de tiempos\r\n\r\n# XTIT: \r\nWEEKENTRY_TITLE=Entrada manual\r\n\r\n#XBUT: Button for quick entry\r\nQUICK_FILL=Entrada r\\u00E1pida\r\n\r\n# XFLD: Apply to\r\nENTRY_VIEW_APPLY_TO=Aplicar a\r\n\r\n# XTIT: \r\nTIMESHEET_DETAILS_TITLE=Detalles\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_CREATE_ENTRY_TITLE=Crear valor para fecha\r\n\r\n# XTIT: Title for create entry view with multiple days selected\r\nTIMESHEET_CREATE_ENTRIES_TITLE=Crear entrada para {0} d\\u00EDas\r\n\r\n# XTIT: Title for Entry Details\r\nENTRY_DETAILS=Detalles de entrada\r\n\r\n# XTIT: Title for edit entry view for a particular date ({0} = date)\r\nTIMESHEET_EDIT_ENTRY_TITLE=Detalles de entrada para {0}\r\n\r\n# XTIT: Title for create entry view for a particular date ({0} = date)\r\nTIMESHEET_NEW_ENTRY_TITLE=Crear entrada para {0}\r\n\r\n# XTIT: Month short header\r\nMONTH_0=Ene.\r\n# XTIT: Month short header\r\nMONTH_1=Feb.\r\n# XTIT: Month short header\r\nMONTH_2=Mar.\r\n# XTIT: Month short header\r\nMONTH_3=Abr.\r\n# XTIT: Month short header\r\nMONTH_4=May.\r\n# XTIT: Month short header\r\nMONTH_5=Junio\r\n# XTIT: Month short header\r\nMONTH_6=Julio\r\n# XTIT: Month short header\r\nMONTH_7=Ago.\r\n# XTIT: Month short header\r\nMONTH_8=Sep.\r\n# XTIT: Month short header\r\nMONTH_9=Oct.\r\n# XTIT: Month short header\r\nMONTH_10=Nov.\r\n# XTIT: Month short header\r\nMONTH_11=Dic.\r\n\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_0=Enero\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_1=Febrero\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_2=Marzo\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_3=Abril\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_4=Mayo\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_5=Junio\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_6=Julio\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_7=Agosto\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_8=Septiembre\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_9=Octubre\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_10=Noviembre\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_11=Diciembre\r\n\r\n# XTIT: Legend missing day\r\nMISSING_DAY=Su acci\\u00F3n es necesaria\r\n# XTIT: Legend filled day\r\nFILLED_DAY=Finalizar\r\n# XTIT: Legend filled in process, manager action needed\r\nFILLED_MANAGER=Es necesaria la acci\\u00F3n del autorizador\r\n# XFLD: Rejected by manager - this appears on the legend\r\nREJECTED=Rechazadas\r\n# XFLD: Legend future working day\r\nWORKING_DAY=D\\u00EDa laborable\r\n# XFLD: Legend non-working day\r\nNON_WORKING_DAY=D\\u00EDa no laborable\r\n\r\n# XMSG: Footer information about missing hours\r\nTOTAL_MISSING=Total de horas que faltan\\: {0}\r\n\r\n#XFLD:\r\nMONTH_YEAR={0} {1} ({2} horas)\r\n\r\n#XBUT: Button\r\nSAVE=Grabar\r\n\r\n#XBUT: Button \r\nSUBMIT=Enviar\r\n\r\n#XBUT: Button for quick entry\r\nSMART_FILL=Auto entrada\r\n\r\n# XMSG\r\nFILL_ALL=Introducir {0} horas para\\:\r\n\r\n#XFLD\r\nNO_TASK_TYPE=No hay tipo de tarea\r\n\r\n#XFLD\r\nMISSING_DAYS=D\\u00EDas que faltan\\:{0}\r\n\r\n#XBUT: Button\r\nHOME=P\\u00E1gina principal\r\n\r\n#XTIT: confirmation header\r\nCONFIRMATION=Confirmaci\\u00F3n\r\n\r\n#XTIT: deletion confirmation header\r\nDELETE_CONFIRMATION=Confirmar borrado\r\n\r\n#XTIT: submission confirmation header\r\nSUBMISSION_CONFIRMATION=Confirmar env\\u00EDo\r\n\r\n#XTIT: Draft submission confirmation header\r\nDRAFT_CONFIRMATION=Confirmar borrador\r\n\r\n#XFLD: label for Deletion summary in Dialog\r\nDELETE_CONFIRMATION_SUMMARY=Total de valores para fecha seleccionados para borrado\r\n\r\n#XFLD: label for Submission summary in Dialog\r\nSUBMISSION_CONFIRMATION_SUMMARY=Total de valores para fecha seleccionados para gastos\r\n\r\n#XFLD: label for Draft Submission summary in Dialog\r\nDRAFT_CONFIRMATION_SUMMARY=Resumen de entradas de tiempos seleccionadas\r\n\r\n#XFLD: label for Number of entries in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_ENTRIES=Cantidad de entradas\r\n\r\n#XFLD: label for Number of hours in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_HOURS=Cantidad de horas\r\n\r\n#XBUT: Confirm Button\r\nCONFIRM=Confirmar\r\n\r\n#XMSG: Summary for confirmation - these are two dates\r\nSUMMARY={0} - {1}\r\n\r\n#XFLD: Week \r\nWEEK=semana\r\n\r\n#XFLD:\r\nMEET_TARGET_HOURS=Aplicar horas a\\:\r\n\r\n#XBUT\r\nTHIS_WEEK=Semana actual ({0} horas)\r\n\r\n#XBUT\r\nALL_MISSING=Tiempo que falta en total ({0} horas)\r\n\r\n#XBUT: Delete Button Text\r\nDELETE=Borrar\r\n\r\n#XBUT: Add Button Text for Weekly Entry nav button\r\nNAV_ADD=A\\u00F1adir entrada\r\n\r\n#XFLD: label for duration\r\nDURATION=Duraci\\u00F3n\r\n\r\n#XFLD: label for total duration\r\nTOTAL_DURATION=Duraci\\u00F3n total\r\n\r\n#XFLD: label for status\r\nSTATUS=Estado\r\n\r\n#XFLD: label for start time\r\nSTART_TIME=Hora de inicio\r\n\r\n#XFLD: label for end Time\r\nEND_TIME=Hora de fin\r\n\r\n#XFLD: label for note\r\nNOTE=Nota\r\n\r\n#XFLD: label for Add New week entry\r\nADD_NEW=Entrada nueva\r\n\r\n#XBUT: Done button\r\nDONE=Finalizar\r\n\r\n# XTIT: Recently Used\r\nRECENTLY_USED=Sugerencias\r\n\r\n# XTIT: Manual Input Add\r\nMANUAL_INPUT_ADD=Manual\r\n\r\n# XTIT: Manual Input Edit\r\nMANUAL_INPUT_EDIT=Editar entrada\r\n\r\n# XTIT: Cost Assignment\r\nCOST_ASSIGNMENT=Asignaci\\u00F3n de tiempo\r\n\r\n#XFLD: Tap to Load More\r\nTAP_TO_LOAD_MORE=Cargar m\\u00E1s\r\n\r\n#XFLD: Tap to Load More Loading\r\nTAP_TO_LOAD_MORE_LOADING=Cargando...\r\n\r\n#XFLD: Continue Search on Server\r\nCONTINUE_SEARCH_ON_SERVER=Continuar la b\\u00FAsqueda en el servidor...\r\n\r\n#XFLD: Continue Search on Server Loading\r\nCONTINUE_SEARCH_ON_SERVER_LOADING=Cargando...\r\n\r\n#XFLD: BLANK\r\nEMPTY=Vac\\u00EDo\r\n\r\n#XFLD: None\r\nNONE=Ninguno\r\n\r\n# XTIT: Select\r\nSELECT=Seleccionar {0}\r\n\r\n# XTIT: Placeholder for Cost Assignment Picker indicating Select action\r\nSELECT_PLACEHOLDER=Seleccionar\r\n\r\n#XFLD: Placeholder for cost assignment type search\r\nSEARCH=Buscando...\r\n\r\n#XFLD: short label for hours\r\nHOURS_LABEL=h\r\n\r\n#XFLD: short label for minutes\r\nMINUTES_LABEL=m\r\n\r\n#XFLD: full label for hours \r\nHOURS_LABEL_FULL=horas\r\n\r\n#XFLD: full label for minutes\r\nMINUTES_LABEL_FULL=Minutos\r\n\r\n#XFLD: label for date. When localizing do not change the MMM DD or YYYY, just the order of them\r\nDATE_LOCALE=DD MMM, YYYY\r\n\r\n\r\n#XBUT:\r\nDETAIL=Detalles\r\n\r\n\r\n#XFLD: label for Settings title\r\nSETTINGS_TITLE=Opciones\r\n#XFLD: label for Settings data entry profile\r\nSETTINGS_DATA_ENTRY_PROFILE=Perfil de entrada de datos\r\n#XFLD: label for Settings pre-fill label\r\nSETTINGS_PREFILL_LAST_WEEK=Propuesta autom\\u00E1tica\r\n\r\n# XMSG: \r\nCONFIRM_LEAVE_PAGE=Todos los datos no grabados se descartar\\u00E1n. \\u00BFDesea continuar?\r\n# XTIT: \r\nUNSAVED_CHANGES=Modificaciones no grabadas\r\n\r\n#XMSG: toast message for successful submit\r\nSUBMIT_SUCCESS=Solicitud enviada\r\n\r\n#XMSG: toast message for successful draft submit\r\nDRAFT_SUCCESS=Borrador guardado correctamente\r\n\r\n#XBUT:\r\nHELP=Ayuda\r\n\r\n#XMSG: confirmation message for week entry\r\nTOTAL_BOOKED={0}/{1} horas introducidas para esta semana.\r\n\r\n#XMSG: help text for pre-fill option\r\nHELP_PREFILL=Active la opci\\u00F3n de prerrelleno para completar r\\u00E1pidamente las horas para la semana en funci\\u00F3n de la \\u00FAltima entrada que haya realizado correctamente.\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT_AUTO_ENTRY=Error de env\\u00EDo; revise los detalles de error e int\\u00E9ntelo de nuevo.\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT=Algunas entradas son incorrectas. Revise los detalles del error e int\\u00E9ntelo de nuevo.\r\n\r\n#XMSG: error pop-up message text\r\nSUBMIT_HEADER_TEXT=Entrada de tiempo para {0} y {1} d\\u00EDa(s) de m\\u00E1s\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_EDIT_ENTRY_TITLE_SCREEN=Editar entrada de tiempo\r\n\r\n#XMSG: Header in edit screen for single date\r\nSUBMIT_HEADER_TEXT_SINGLE=Entrada de tiempo para {0}\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nFULL_CONCATENATE_HOURSMIN={0} horas {1} minutos\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nSHORT_CONCATENATE_HOURSMIN={0} h {1} m\r\n\r\n#XBUT: Button to reset\r\nRESET=Reinicializar\r\n\r\n#XBUT: Button to create\r\nCREATE=Crear\r\n',
	"hcm/emp/mytimesheet/i18n/i18n_fr.properties":'\r\n#XFLD: label for from time\r\nFROM=de\r\n\r\n#XFLD: label for to time\r\nTO=\\u00E0\r\n\r\n#XBUT: Button to cancel\r\nCANCEL=Interrompre\r\n\r\n#XBUT: Button to close popover\r\nCLOSE=Fermer\r\n\r\n#XBUT: Button to accept\r\nOK=OK\r\n\r\n#XBUT: Button to Save Draft\r\nSAVE_DRAFT=Sauv. vers. pr\\u00E9l.\r\n\r\n# XTIT: \r\nTIMESHEET_TITLE=Ma feuille de saisie des temps\r\n\r\n# XTIT: \r\nTIMESHEET=Entr\\u00E9es sur la feuille de saisie des temps\r\n\r\n# XTIT: \r\nWEEKENTRY_TITLE=Entr\\u00E9e manuelle\r\n\r\n#XBUT: Button for quick entry\r\nQUICK_FILL=Saisie rapide\r\n\r\n# XFLD: Apply to\r\nENTRY_VIEW_APPLY_TO=Appliquer \\u00E0\r\n\r\n# XTIT: \r\nTIMESHEET_DETAILS_TITLE=D\\u00E9tails\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_CREATE_ENTRY_TITLE=Cr\\u00E9er saisie des temps\r\n\r\n# XTIT: Title for create entry view with multiple days selected\r\nTIMESHEET_CREATE_ENTRIES_TITLE=Cr\\u00E9er entr\\u00E9e pour {0} jours\r\n\r\n# XTIT: Title for Entry Details\r\nENTRY_DETAILS=D\\u00E9tails de la saisie\r\n\r\n# XTIT: Title for edit entry view for a particular date ({0} = date)\r\nTIMESHEET_EDIT_ENTRY_TITLE=D\\u00E9tails d\'\'entr\\u00E9e pour {0}\r\n\r\n# XTIT: Title for create entry view for a particular date ({0} = date)\r\nTIMESHEET_NEW_ENTRY_TITLE=Cr\\u00E9er entr\\u00E9e pour {0}\r\n\r\n# XTIT: Month short header\r\nMONTH_0=Jan.\r\n# XTIT: Month short header\r\nMONTH_1=F\\u00E9v.\r\n# XTIT: Month short header\r\nMONTH_2=Mar.\r\n# XTIT: Month short header\r\nMONTH_3=Avr.\r\n# XTIT: Month short header\r\nMONTH_4=Mai\r\n# XTIT: Month short header\r\nMONTH_5=Juin\r\n# XTIT: Month short header\r\nMONTH_6=Juil\r\n# XTIT: Month short header\r\nMONTH_7=Ao\\u00FBt\r\n# XTIT: Month short header\r\nMONTH_8=Sep.\r\n# XTIT: Month short header\r\nMONTH_9=Oct.\r\n# XTIT: Month short header\r\nMONTH_10=Nov.\r\n# XTIT: Month short header\r\nMONTH_11=D\\u00E9c.\r\n\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_0=Janvier\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_1=F\\u00E9vrier\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_2=Mars\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_3=Avril\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_4=Mai\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_5=Juin\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_6=Juillet\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_7=Ao\\u00FBt\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_8=Septembre\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_9=Octobre\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_10=Novembre\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_11=D\\u00E9cembre\r\n\r\n# XTIT: Legend missing day\r\nMISSING_DAY=Action requise de votre part\r\n# XTIT: Legend filled day\r\nFILLED_DAY=Termin\\u00E9\r\n# XTIT: Legend filled in process, manager action needed\r\nFILLED_MANAGER=Action de l\'approbateur requise\r\n# XFLD: Rejected by manager - this appears on the legend\r\nREJECTED=Refus\\u00E9\r\n# XFLD: Legend future working day\r\nWORKING_DAY=Jour ouvr\\u00E9\r\n# XFLD: Legend non-working day\r\nNON_WORKING_DAY=Jour ch\\u00F4m\\u00E9\r\n\r\n# XMSG: Footer information about missing hours\r\nTOTAL_MISSING=Heures manquantes au total\\u00A0\\: {0}\r\n\r\n#XFLD:\r\nMONTH_YEAR={0} {1} ({2} heures)\r\n\r\n#XBUT: Button\r\nSAVE=Sauvegarder\r\n\r\n#XBUT: Button \r\nSUBMIT=Envoyer\r\n\r\n#XBUT: Button for quick entry\r\nSMART_FILL=Entr\\u00E9e automatique\r\n\r\n# XMSG\r\nFILL_ALL=Saisir {0} heures pour\\u00A0\\:\r\n\r\n#XFLD\r\nNO_TASK_TYPE=Aucun type de t\\u00E2che\r\n\r\n#XFLD\r\nMISSING_DAYS=Jours manquants\\u00A0\\: {0}\r\n\r\n#XBUT: Button\r\nHOME=Page d\'accueil\r\n\r\n#XTIT: confirmation header\r\nCONFIRMATION=Confirmation\r\n\r\n#XTIT: deletion confirmation header\r\nDELETE_CONFIRMATION=Confirmer la suppression\r\n\r\n#XTIT: submission confirmation header\r\nSUBMISSION_CONFIRMATION=Confirmer l\'envoi\r\n\r\n#XTIT: Draft submission confirmation header\r\nDRAFT_CONFIRMATION=Confirmer version pr\\u00E9liminaire\r\n\r\n#XFLD: label for Deletion summary in Dialog\r\nDELETE_CONFIRMATION_SUMMARY=Synth\\u00E8se des saisies des temps marqu\\u00E9es pour suppression\r\n\r\n#XFLD: label for Submission summary in Dialog\r\nSUBMISSION_CONFIRMATION_SUMMARY=Synth\\u00E8se des saisies des temps marqu\\u00E9es pour envoi\r\n\r\n#XFLD: label for Draft Submission summary in Dialog\r\nDRAFT_CONFIRMATION_SUMMARY=R\\u00E9sum\\u00E9 des saisies des temps s\\u00E9lectionn\\u00E9es\r\n\r\n#XFLD: label for Number of entries in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_ENTRIES=Nombre de saisies\r\n\r\n#XFLD: label for Number of hours in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_HOURS=Nombre d\'heures\r\n\r\n#XBUT: Confirm Button\r\nCONFIRM=Confirmer\r\n\r\n#XMSG: Summary for confirmation - these are two dates\r\nSUMMARY={0} - {1}\r\n\r\n#XFLD: Week \r\nWEEK=Semaine\r\n\r\n#XFLD:\r\nMEET_TARGET_HOURS=Appliquer heures \\u00E0 \\:\r\n\r\n#XBUT\r\nTHIS_WEEK=Semaine en cours ({0} heures)\r\n\r\n#XBUT\r\nALL_MISSING=Temps manquant au total ({0} heures)\r\n\r\n#XBUT: Delete Button Text\r\nDELETE=Supprimer\r\n\r\n#XBUT: Add Button Text for Weekly Entry nav button\r\nNAV_ADD=Ajouter entr\\u00E9e\r\n\r\n#XFLD: label for duration\r\nDURATION=Dur\\u00E9e\r\n\r\n#XFLD: label for total duration\r\nTOTAL_DURATION=Dur\\u00E9e totale\r\n\r\n#XFLD: label for status\r\nSTATUS=Statut\r\n\r\n#XFLD: label for start time\r\nSTART_TIME=Heure de d\\u00E9but\r\n\r\n#XFLD: label for end Time\r\nEND_TIME=Heure de fin\r\n\r\n#XFLD: label for note\r\nNOTE=Note\r\n\r\n#XFLD: label for Add New week entry\r\nADD_NEW=Nouvelle entr\\u00E9e\r\n\r\n#XBUT: Done button\r\nDONE=Termin\\u00E9\r\n\r\n# XTIT: Recently Used\r\nRECENTLY_USED=Suggestions\r\n\r\n# XTIT: Manual Input Add\r\nMANUAL_INPUT_ADD=Manuellement\r\n\r\n# XTIT: Manual Input Edit\r\nMANUAL_INPUT_EDIT=Traiter entr\\u00E9e\r\n\r\n# XTIT: Cost Assignment\r\nCOST_ASSIGNMENT=Affectation temps\r\n\r\n#XFLD: Tap to Load More\r\nTAP_TO_LOAD_MORE=Charger plus\r\n\r\n#XFLD: Tap to Load More Loading\r\nTAP_TO_LOAD_MORE_LOADING=Chargement...\r\n\r\n#XFLD: Continue Search on Server\r\nCONTINUE_SEARCH_ON_SERVER=Continuer la recherche sur le serveur...\r\n\r\n#XFLD: Continue Search on Server Loading\r\nCONTINUE_SEARCH_ON_SERVER_LOADING=Chargement...\r\n\r\n#XFLD: BLANK\r\nEMPTY=Vide\r\n\r\n#XFLD: None\r\nNONE=N\\u00E9ant\r\n\r\n# XTIT: Select\r\nSELECT=S\\u00E9lectionner {0}\r\n\r\n# XTIT: Placeholder for Cost Assignment Picker indicating Select action\r\nSELECT_PLACEHOLDER=S\\u00E9lectionner\r\n\r\n#XFLD: Placeholder for cost assignment type search\r\nSEARCH=Recherche...\r\n\r\n#XFLD: short label for hours\r\nHOURS_LABEL=h\r\n\r\n#XFLD: short label for minutes\r\nMINUTES_LABEL=m\r\n\r\n#XFLD: full label for hours \r\nHOURS_LABEL_FULL=Heures\r\n\r\n#XFLD: full label for minutes\r\nMINUTES_LABEL_FULL=Minutes\r\n\r\n#XFLD: label for date. When localizing do not change the MMM DD or YYYY, just the order of them\r\nDATE_LOCALE=DD MMM YYYY\r\n\r\n\r\n#XBUT:\r\nDETAIL=D\\u00E9tails\r\n\r\n\r\n#XFLD: label for Settings title\r\nSETTINGS_TITLE=Options\r\n#XFLD: label for Settings data entry profile\r\nSETTINGS_DATA_ENTRY_PROFILE=Profil de saisie de donn\\u00E9es\r\n#XFLD: label for Settings pre-fill label\r\nSETTINGS_PREFILL_LAST_WEEK=Proposition automatique\r\n\r\n# XMSG: \r\nCONFIRM_LEAVE_PAGE=Toutes les donn\\u00E9es non sauvegard\\u00E9es seront perdues. Voulez-vous continuer ?\r\n# XTIT: \r\nUNSAVED_CHANGES=Modifications non sauvegard\\u00E9es\r\n\r\n#XMSG: toast message for successful submit\r\nSUBMIT_SUCCESS=Demande envoy\\u00E9e\r\n\r\n#XMSG: toast message for successful draft submit\r\nDRAFT_SUCCESS=Version pr\\u00E9liminaire correctement sauvegard\\u00E9e\r\n\r\n#XBUT:\r\nHELP=Aide\r\n\r\n#XMSG: confirmation message for week entry\r\nTOTAL_BOOKED={0}/{1} heures saisies pour cette semaine\r\n\r\n#XMSG: help text for pre-fill option\r\nHELP_PREFILL=Activez le pr\\u00E9-remplissage pour renseigner rapidement les heures de la semaine bas\\u00E9es sur votre derni\\u00E8re entr\\u00E9e correcte.\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT_AUTO_ENTRY=\\u00C9chec de l\'envoi. R\\u00E9visez les d\\u00E9tails de l\'erreur et r\\u00E9essayez.\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT=Certaines entr\\u00E9es sont incorrectes. R\\u00E9visez les d\\u00E9tails de l\'erreur et r\\u00E9essayez.\r\n\r\n#XMSG: error pop-up message text\r\nSUBMIT_HEADER_TEXT=Saisie des temps pour {0} et {1} jour(s) de plus\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_EDIT_ENTRY_TITLE_SCREEN=Modifier saisie des temps\r\n\r\n#XMSG: Header in edit screen for single date\r\nSUBMIT_HEADER_TEXT_SINGLE=Cr\\u00E9er saisie des temps pour {0}\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nFULL_CONCATENATE_HOURSMIN={0} heures {1} minutes\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nSHORT_CONCATENATE_HOURSMIN={0} h {1} m\r\n\r\n#XBUT: Button to reset\r\nRESET=R\\u00E9initialiser\r\n\r\n#XBUT: Button to create\r\nCREATE=Cr\\u00E9er\r\n',
	"hcm/emp/mytimesheet/i18n/i18n_hu.properties":'\r\n#XFLD: label for from time\r\nFROM=Kezd\\u00E9s\r\n\r\n#XFLD: label for to time\r\nTO=V\\u00E9ge\r\n\r\n#XBUT: Button to cancel\r\nCANCEL=M\\u00E9gse\r\n\r\n#XBUT: Button to close popover\r\nCLOSE=Bez\\u00E1r\\u00E1s\r\n\r\n#XBUT: Button to accept\r\nOK=OK\r\n\r\n#XBUT: Button to Save Draft\r\nSAVE_DRAFT=Tervezet ment\\u00E9se\r\n\r\n# XTIT: \r\nTIMESHEET_TITLE=Saj\\u00E1t id\\u0151adatlap\r\n\r\n# XTIT: \r\nTIMESHEET=Id\\u0151adatlap-bejegyz\\u00E9sek\r\n\r\n# XTIT: \r\nWEEKENTRY_TITLE=K\\u00E9zi bejegyz\\u00E9s\r\n\r\n#XBUT: Button for quick entry\r\nQUICK_FILL=Gyors bejegyz\\u00E9s\r\n\r\n# XFLD: Apply to\r\nENTRY_VIEW_APPLY_TO=Alkalmaz\\u00E1s\r\n\r\n# XTIT: \r\nTIMESHEET_DETAILS_TITLE=R\\u00E9szletek\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_CREATE_ENTRY_TITLE=Id\\u0151bejegyz\\u00E9s l\\u00E9trehoz\\u00E1sa\r\n\r\n# XTIT: Title for create entry view with multiple days selected\r\nTIMESHEET_CREATE_ENTRIES_TITLE=Bejegyz\\u00E9s l\\u00E9trehoz\\u00E1sa {0} naphoz\r\n\r\n# XTIT: Title for Entry Details\r\nENTRY_DETAILS=Bejegyz\\u00E9s r\\u00E9szletei\r\n\r\n# XTIT: Title for edit entry view for a particular date ({0} = date)\r\nTIMESHEET_EDIT_ENTRY_TITLE=Bejegyz\\u00E9s r\\u00E9szletei - {0}\r\n\r\n# XTIT: Title for create entry view for a particular date ({0} = date)\r\nTIMESHEET_NEW_ENTRY_TITLE=Bejegyz\\u00E9s l\\u00E9trehoz\\u00E1sa - {0}\r\n\r\n# XTIT: Month short header\r\nMONTH_0=Jan.\r\n# XTIT: Month short header\r\nMONTH_1=Febr.\r\n# XTIT: Month short header\r\nMONTH_2=M\\u00E1rc.\r\n# XTIT: Month short header\r\nMONTH_3=\\u00C1pr.\r\n# XTIT: Month short header\r\nMONTH_4=M\\u00E1j.\r\n# XTIT: Month short header\r\nMONTH_5=J\\u00FAn.\r\n# XTIT: Month short header\r\nMONTH_6=J\\u00FAl.\r\n# XTIT: Month short header\r\nMONTH_7=Aug.\r\n# XTIT: Month short header\r\nMONTH_8=Szept.\r\n# XTIT: Month short header\r\nMONTH_9=Okt.\r\n# XTIT: Month short header\r\nMONTH_10=Nov.\r\n# XTIT: Month short header\r\nMONTH_11=Dec.\r\n\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_0=Janu\\u00E1r\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_1=Febru\\u00E1r\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_2=M\\u00E1rcius\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_3=\\u00C1prilis\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_4=M\\u00E1jus\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_5=J\\u00FAnius\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_6=J\\u00FAlius\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_7=Augusztus\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_8=Szeptember\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_9=Okt\\u00F3ber\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_10=November\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_11=December\r\n\r\n# XTIT: Legend missing day\r\nMISSING_DAY=M\\u0171veletet kell v\\u00E9grehajtania\r\n# XTIT: Legend filled day\r\nFILLED_DAY=K\\u00E9sz\r\n# XTIT: Legend filled in process, manager action needed\r\nFILLED_MANAGER=Enged\\u00E9lyez\\u0151i m\\u0171velet kell\r\n# XFLD: Rejected by manager - this appears on the legend\r\nREJECTED=Elutas\\u00EDtva\r\n# XFLD: Legend future working day\r\nWORKING_DAY=Munkanap\r\n# XFLD: Legend non-working day\r\nNON_WORKING_DAY=Nem munkanap\r\n\r\n# XMSG: Footer information about missing hours\r\nTOTAL_MISSING=\\u00D6sszes hi\\u00E1nyz\\u00F3 \\u00F3ra\\: {0}\r\n\r\n#XFLD:\r\nMONTH_YEAR={0} {1} ({2} \\u00F3ra)\r\n\r\n#XBUT: Button\r\nSAVE=Ment\\u00E9s\r\n\r\n#XBUT: Button \r\nSUBMIT=Elk\\u00FCld\\u00E9s\r\n\r\n#XBUT: Button for quick entry\r\nSMART_FILL=Automatikus bejegyz\\u00E9s\r\n\r\n# XMSG\r\nFILL_ALL={0} \\u00F3ra megad\\u00E1sa a k\\u00F6vetkez\\u0151h\\u00F6z\\:\r\n\r\n#XFLD\r\nNO_TASK_TYPE=Nincs feladatt\\u00EDpus\r\n\r\n#XFLD\r\nMISSING_DAYS=Hi\\u00E1nyz\\u00F3 napok\\: {0}\r\n\r\n#XBUT: Button\r\nHOME=Kezd\\u0151 oldal\r\n\r\n#XTIT: confirmation header\r\nCONFIRMATION=Visszaigazol\\u00E1s\r\n\r\n#XTIT: deletion confirmation header\r\nDELETE_CONFIRMATION=T\\u00F6rl\\u00E9s meger\\u0151s\\u00EDt\\u00E9se\r\n\r\n#XTIT: submission confirmation header\r\nSUBMISSION_CONFIRMATION=K\\u00FCld\\u00E9s meger\\u0151s\\u00EDt\\u00E9se\r\n\r\n#XTIT: Draft submission confirmation header\r\nDRAFT_CONFIRMATION=Tervezet meger\\u0151s\\u00EDt\\u00E9se\r\n\r\n#XFLD: label for Deletion summary in Dialog\r\nDELETE_CONFIRMATION_SUMMARY=T\\u00F6rl\\u00E9sre kiv\\u00E1lasztott id\\u0151bejegyz\\u00E9sek \\u00F6sszegz\\u00E9se\r\n\r\n#XFLD: label for Submission summary in Dialog\r\nSUBMISSION_CONFIRMATION_SUMMARY=K\\u00FCld\\u00E9sre kiv\\u00E1lasztott id\\u0151bejegyz\\u00E9sek \\u00F6sszegz\\u00E9se\r\n\r\n#XFLD: label for Draft Submission summary in Dialog\r\nDRAFT_CONFIRMATION_SUMMARY=A kiv\\u00E1lasztott id\\u0151bejegyz\\u00E9sek \\u00F6sszegz\\u00E9se\r\n\r\n#XFLD: label for Number of entries in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_ENTRIES=Bejegyz\\u00E9sek sz\\u00E1ma\r\n\r\n#XFLD: label for Number of hours in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_HOURS=\\u00D3r\\u00E1k sz\\u00E1ma\r\n\r\n#XBUT: Confirm Button\r\nCONFIRM=Meger\\u0151s\\u00EDt\\u00E9s\r\n\r\n#XMSG: Summary for confirmation - these are two dates\r\nSUMMARY={0} - {1}\r\n\r\n#XFLD: Week \r\nWEEK=H\\u00E9t\r\n\r\n#XFLD:\r\nMEET_TARGET_HOURS=\\u00D3r\\u00E1k alkalmaz\\u00E1sa\\:\r\n\r\n#XBUT\r\nTHIS_WEEK=Aktu\\u00E1lis h\\u00E9t ({0} \\u00F3ra)\r\n\r\n#XBUT\r\nALL_MISSING=\\u00D6sszes hi\\u00E1nyz\\u00F3 id\\u0151 ({0} \\u00F3ra)\r\n\r\n#XBUT: Delete Button Text\r\nDELETE=T\\u00F6rl\\u00E9s\r\n\r\n#XBUT: Add Button Text for Weekly Entry nav button\r\nNAV_ADD=Bejegyz\\u00E9s hozz\\u00E1ad\\u00E1sa\r\n\r\n#XFLD: label for duration\r\nDURATION=Id\\u0151tartam\r\n\r\n#XFLD: label for total duration\r\nTOTAL_DURATION=\\u00D6sszid\\u0151tartam\r\n\r\n#XFLD: label for status\r\nSTATUS=St\\u00E1tus\r\n\r\n#XFLD: label for start time\r\nSTART_TIME=Kezd\\u00E9s id\\u0151pontja\r\n\r\n#XFLD: label for end Time\r\nEND_TIME=Befejez\\u00E9s id\\u0151pontja\r\n\r\n#XFLD: label for note\r\nNOTE=Megjegyz\\u00E9s\r\n\r\n#XFLD: label for Add New week entry\r\nADD_NEW=\\u00DAj bejegyz\\u00E9s\r\n\r\n#XBUT: Done button\r\nDONE=K\\u00E9sz\r\n\r\n# XTIT: Recently Used\r\nRECENTLY_USED=Javaslatok\r\n\r\n# XTIT: Manual Input Add\r\nMANUAL_INPUT_ADD=Manu\\u00E1lis\r\n\r\n# XTIT: Manual Input Edit\r\nMANUAL_INPUT_EDIT=Bejegyz\\u00E9s feldolgoz\\u00E1sa\r\n\r\n# XTIT: Cost Assignment\r\nCOST_ASSIGNMENT=Id\\u0151-hozz\\u00E1rendel\\u00E9s\r\n\r\n#XFLD: Tap to Load More\r\nTAP_TO_LOAD_MORE=T\\u00F6bb bet\\u00F6lt\\u00E9se\r\n\r\n#XFLD: Tap to Load More Loading\r\nTAP_TO_LOAD_MORE_LOADING=Bet\\u00F6lt\\u00E9s...\r\n\r\n#XFLD: Continue Search on Server\r\nCONTINUE_SEARCH_ON_SERVER=Keres\\u00E9s folytat\\u00E1sa a szerveren...\r\n\r\n#XFLD: Continue Search on Server Loading\r\nCONTINUE_SEARCH_ON_SERVER_LOADING=Bet\\u00F6lt\\u00E9s...\r\n\r\n#XFLD: BLANK\r\nEMPTY=\\u00DCres\r\n\r\n#XFLD: None\r\nNONE=Nincs\r\n\r\n# XTIT: Select\r\nSELECT={0} kiv\\u00E1laszt\\u00E1sa\r\n\r\n# XTIT: Placeholder for Cost Assignment Picker indicating Select action\r\nSELECT_PLACEHOLDER=Kiv\\u00E1laszt\\u00E1s\r\n\r\n#XFLD: Placeholder for cost assignment type search\r\nSEARCH=Keres\\u00E9s...\r\n\r\n#XFLD: short label for hours\r\nHOURS_LABEL=\\u00F3\r\n\r\n#XFLD: short label for minutes\r\nMINUTES_LABEL=p\r\n\r\n#XFLD: full label for hours \r\nHOURS_LABEL_FULL=\\u00D3ra\r\n\r\n#XFLD: full label for minutes\r\nMINUTES_LABEL_FULL=Perc\r\n\r\n#XFLD: label for date. When localizing do not change the MMM DD or YYYY, just the order of them\r\nDATE_LOCALE=YYYY. MMM DD.\r\n\r\n\r\n#XBUT:\r\nDETAIL=R\\u00E9szletek\r\n\r\n\r\n#XFLD: label for Settings title\r\nSETTINGS_TITLE=Be\\u00E1ll\\u00EDt\\u00E1sok\r\n#XFLD: label for Settings data entry profile\r\nSETTINGS_DATA_ENTRY_PROFILE=Adatbejegyz\\u00E9si profil\r\n#XFLD: label for Settings pre-fill label\r\nSETTINGS_PREFILL_LAST_WEEK=Automatikus javaslat\r\n\r\n# XMSG: \r\nCONFIRM_LEAVE_PAGE=A nem mentett adatok el lesznek vetve. Biztosan folytatja?\r\n# XTIT: \r\nUNSAVED_CHANGES=Nem mentett m\\u00F3dos\\u00EDt\\u00E1sok\r\n\r\n#XMSG: toast message for successful submit\r\nSUBMIT_SUCCESS=K\\u00E9r\\u00E9s elk\\u00FCldve\r\n\r\n#XMSG: toast message for successful draft submit\r\nDRAFT_SUCCESS=A tervezet sikeresen elmentve\r\n\r\n#XBUT:\r\nHELP=Seg\\u00EDts\\u00E9g\r\n\r\n#XMSG: confirmation message for week entry\r\nTOTAL_BOOKED={0}/{1} \\u00F3ra lett be\\u00EDrva erre a h\\u00E9tre.\r\n\r\n#XMSG: help text for pre-fill option\r\nHELP_PREFILL=Az el\\u0151re be\\u00E1ll\\u00EDt\\u00E1s bekapcsol\\u00E1s\\u00E1val gyorsan felt\\u00F6ltheti a h\\u00E9t \\u00F3r\\u00E1it a legut\\u00F3bbi sikeres bejegyz\\u00E9s alapj\\u00E1n\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT_AUTO_ENTRY=A k\\u00FCld\\u00E9s nem siker\\u00FClt. Tekintse \\u00E1t a hiba r\\u00E9szleteit, majd pr\\u00F3b\\u00E1lja \\u00FAjra.\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT=N\\u00E9h\\u00E1ny bejegyz\\u00E9s helytelen. Tekintse \\u00E1t a hiba r\\u00E9szleteit, majd pr\\u00F3b\\u00E1lja \\u00FAjra.\r\n\r\n#XMSG: error pop-up message text\r\nSUBMIT_HEADER_TEXT=Id\\u0151bejegyz\\u00E9s a k\\u00F6vetkez\\u0151h\\u00F6z\\: {0} \\u00E9s {1} tov\\u00E1bbi nap\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_EDIT_ENTRY_TITLE_SCREEN=Id\\u0151bejegyz\\u00E9s feldolgoz\\u00E1sa\r\n\r\n#XMSG: Header in edit screen for single date\r\nSUBMIT_HEADER_TEXT_SINGLE=Id\\u0151bejegyz\\u00E9s - {0}\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nFULL_CONCATENATE_HOURSMIN={0} \\u00F3ra {1} perc\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nSHORT_CONCATENATE_HOURSMIN={0} \\u00F3 {1} p\r\n\r\n#XBUT: Button to reset\r\nRESET=Vissza\\u00E1ll\\u00EDt\\u00E1s\r\n\r\n#XBUT: Button to create\r\nCREATE=L\\u00E9trehoz\\u00E1s\r\n',
	"hcm/emp/mytimesheet/i18n/i18n_it.properties":'\r\n#XFLD: label for from time\r\nFROM=Da\r\n\r\n#XFLD: label for to time\r\nTO=A\r\n\r\n#XBUT: Button to cancel\r\nCANCEL=Annulla\r\n\r\n#XBUT: Button to close popover\r\nCLOSE=Chiudi\r\n\r\n#XBUT: Button to accept\r\nOK=OK\r\n\r\n#XBUT: Button to Save Draft\r\nSAVE_DRAFT=Salva bozza\r\n\r\n# XTIT: \r\nTIMESHEET_TITLE=Il mio timesheet\r\n\r\n# XTIT: \r\nTIMESHEET=Inserimenti timesheet\r\n\r\n# XTIT: \r\nWEEKENTRY_TITLE=Inserimento manuale\r\n\r\n#XBUT: Button for quick entry\r\nQUICK_FILL=Acquisizione rapida\r\n\r\n# XFLD: Apply to\r\nENTRY_VIEW_APPLY_TO=Applica a\r\n\r\n# XTIT: \r\nTIMESHEET_DETAILS_TITLE=Dettagli\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_CREATE_ENTRY_TITLE=Crea inserimento orari\r\n\r\n# XTIT: Title for create entry view with multiple days selected\r\nTIMESHEET_CREATE_ENTRIES_TITLE=Crea inserimento per {0} giorni\r\n\r\n# XTIT: Title for Entry Details\r\nENTRY_DETAILS=Dettagli inserimento\r\n\r\n# XTIT: Title for edit entry view for a particular date ({0} = date)\r\nTIMESHEET_EDIT_ENTRY_TITLE=Dettagli inserimento per {0}\r\n\r\n# XTIT: Title for create entry view for a particular date ({0} = date)\r\nTIMESHEET_NEW_ENTRY_TITLE=Crea inserimento per {0}\r\n\r\n# XTIT: Month short header\r\nMONTH_0=Gen.\r\n# XTIT: Month short header\r\nMONTH_1=Feb.\r\n# XTIT: Month short header\r\nMONTH_2=Mar.\r\n# XTIT: Month short header\r\nMONTH_3=Apr.\r\n# XTIT: Month short header\r\nMONTH_4=Mag.\r\n# XTIT: Month short header\r\nMONTH_5=Giu.\r\n# XTIT: Month short header\r\nMONTH_6=Lug.\r\n# XTIT: Month short header\r\nMONTH_7=Ago.\r\n# XTIT: Month short header\r\nMONTH_8=Set.\r\n# XTIT: Month short header\r\nMONTH_9=Ott.\r\n# XTIT: Month short header\r\nMONTH_10=Nov.\r\n# XTIT: Month short header\r\nMONTH_11=Dic.\r\n\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_0=Gennaio\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_1=Febbraio\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_2=Marzo\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_3=Aprile\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_4=Maggio\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_5=Giugno\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_6=Luglio\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_7=Agosto\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_8=Settembre\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_9=Ottobre\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_10=Novembre\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_11=Dicembre\r\n\r\n# XTIT: Legend missing day\r\nMISSING_DAY=Azione necessaria\r\n# XTIT: Legend filled day\r\nFILLED_DAY=Fatto\r\n# XTIT: Legend filled in process, manager action needed\r\nFILLED_MANAGER=Approvazione in sospeso\r\n# XFLD: Rejected by manager - this appears on the legend\r\nREJECTED=Rifiutato\r\n# XFLD: Legend future working day\r\nWORKING_DAY=Giorno lavorativo\r\n# XFLD: Legend non-working day\r\nNON_WORKING_DAY=Giorno non lavorativo\r\n\r\n# XMSG: Footer information about missing hours\r\nTOTAL_MISSING=Totale ore mancanti\\: {0}\r\n\r\n#XFLD:\r\nMONTH_YEAR={0} {1} ({2} ore)\r\n\r\n#XBUT: Button\r\nSAVE=Salva\r\n\r\n#XBUT: Button \r\nSUBMIT=Invia\r\n\r\n#XBUT: Button for quick entry\r\nSMART_FILL=Inserimento automatico\r\n\r\n# XMSG\r\nFILL_ALL=Inserisci {0} ore per\\:\r\n\r\n#XFLD\r\nNO_TASK_TYPE=Nessun tipo di task\r\n\r\n#XFLD\r\nMISSING_DAYS=Giorni mancanti\\: {0}\r\n\r\n#XBUT: Button\r\nHOME=Pagina iniziale\r\n\r\n#XTIT: confirmation header\r\nCONFIRMATION=Conferma\r\n\r\n#XTIT: deletion confirmation header\r\nDELETE_CONFIRMATION=Conferma eliminazione\r\n\r\n#XTIT: submission confirmation header\r\nSUBMISSION_CONFIRMATION=Conferma invio\r\n\r\n#XTIT: Draft submission confirmation header\r\nDRAFT_CONFIRMATION=Conferma bozza\r\n\r\n#XFLD: label for Deletion summary in Dialog\r\nDELETE_CONFIRMATION_SUMMARY=Riepilogo di inserimenti orari selezionato per eliminazione\r\n\r\n#XFLD: label for Submission summary in Dialog\r\nSUBMISSION_CONFIRMATION_SUMMARY=Riepilogo di inserimenti orari selezionato per invio\r\n\r\n#XFLD: label for Draft Submission summary in Dialog\r\nDRAFT_CONFIRMATION_SUMMARY=Riepilogo di inserimenti orari selezionato\r\n\r\n#XFLD: label for Number of entries in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_ENTRIES=Numero di inserimenti\r\n\r\n#XFLD: label for Number of hours in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_HOURS=Numero di ore\r\n\r\n#XBUT: Confirm Button\r\nCONFIRM=Conferma\r\n\r\n#XMSG: Summary for confirmation - these are two dates\r\nSUMMARY={0} - {1}\r\n\r\n#XFLD: Week \r\nWEEK=Settimana\r\n\r\n#XFLD:\r\nMEET_TARGET_HOURS=Applica ore a\\:\r\n\r\n#XBUT\r\nTHIS_WEEK=Settimana corrente ({0} ore)\r\n\r\n#XBUT\r\nALL_MISSING=Tutti gli orari mancanti ({0} ore)\r\n\r\n#XBUT: Delete Button Text\r\nDELETE=Elimina\r\n\r\n#XBUT: Add Button Text for Weekly Entry nav button\r\nNAV_ADD=Aggiungi inserimento\r\n\r\n#XFLD: label for duration\r\nDURATION=Durata\r\n\r\n#XFLD: label for total duration\r\nTOTAL_DURATION=Durata totale\r\n\r\n#XFLD: label for status\r\nSTATUS=Stato\r\n\r\n#XFLD: label for start time\r\nSTART_TIME=Ora di inizio\r\n\r\n#XFLD: label for end Time\r\nEND_TIME=Ora di fine\r\n\r\n#XFLD: label for note\r\nNOTE=Nota\r\n\r\n#XFLD: label for Add New week entry\r\nADD_NEW=Nuovo inserimento\r\n\r\n#XBUT: Done button\r\nDONE=Fatto\r\n\r\n# XTIT: Recently Used\r\nRECENTLY_USED=Suggerimenti\r\n\r\n# XTIT: Manual Input Add\r\nMANUAL_INPUT_ADD=Manuale\r\n\r\n# XTIT: Manual Input Edit\r\nMANUAL_INPUT_EDIT=Elabora inserimento\r\n\r\n# XTIT: Cost Assignment\r\nCOST_ASSIGNMENT=Assegnazione orari\r\n\r\n#XFLD: Tap to Load More\r\nTAP_TO_LOAD_MORE=Carica altro\r\n\r\n#XFLD: Tap to Load More Loading\r\nTAP_TO_LOAD_MORE_LOADING=In caricamento...\r\n\r\n#XFLD: Continue Search on Server\r\nCONTINUE_SEARCH_ON_SERVER=Continua ricerca sul server...\r\n\r\n#XFLD: Continue Search on Server Loading\r\nCONTINUE_SEARCH_ON_SERVER_LOADING=In caricamento...\r\n\r\n#XFLD: BLANK\r\nEMPTY=Vuoto\r\n\r\n#XFLD: None\r\nNONE=Nessuno\r\n\r\n# XTIT: Select\r\nSELECT=Seleziona {0}\r\n\r\n# XTIT: Placeholder for Cost Assignment Picker indicating Select action\r\nSELECT_PLACEHOLDER=Seleziona\r\n\r\n#XFLD: Placeholder for cost assignment type search\r\nSEARCH=Ricerca in corso...\r\n\r\n#XFLD: short label for hours\r\nHOURS_LABEL=h\r\n\r\n#XFLD: short label for minutes\r\nMINUTES_LABEL=m\r\n\r\n#XFLD: full label for hours \r\nHOURS_LABEL_FULL=Ore\r\n\r\n#XFLD: full label for minutes\r\nMINUTES_LABEL_FULL=Minuti\r\n\r\n#XFLD: label for date. When localizing do not change the MMM DD or YYYY, just the order of them\r\nDATE_LOCALE=DD MMM, YYYY\r\n\r\n\r\n#XBUT:\r\nDETAIL=Dettagli\r\n\r\n\r\n#XFLD: label for Settings title\r\nSETTINGS_TITLE=Impostazioni\r\n#XFLD: label for Settings data entry profile\r\nSETTINGS_DATA_ENTRY_PROFILE=Profilo di acquisizione\r\n#XFLD: label for Settings pre-fill label\r\nSETTINGS_PREFILL_LAST_WEEK=Proposta automatica\r\n\r\n# XMSG: \r\nCONFIRM_LEAVE_PAGE=I dati non salvati andranno persi. Continuare?\r\n# XTIT: \r\nUNSAVED_CHANGES=Modifiche non salvate\r\n\r\n#XMSG: toast message for successful submit\r\nSUBMIT_SUCCESS=Richiesta inviata\r\n\r\n#XMSG: toast message for successful draft submit\r\nDRAFT_SUCCESS=Bozza salvata correttamente\r\n\r\n#XBUT:\r\nHELP=Help\r\n\r\n#XMSG: confirmation message for week entry\r\nTOTAL_BOOKED={0}/{1} ore inserite per questa settimana.\r\n\r\n#XMSG: help text for pre-fill option\r\nHELP_PREFILL=Attiva Precompila per acquisire rapidamente ore della settimana in base all\'ultimo inserimento effettuato\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT_AUTO_ENTRY=Invio non riuscito; rivedi i dettagli dell\'errore e riprova\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT=Alcuni inserimenti sono errati. Rivedi i dettagli dell\'errore e riprova.\r\n\r\n#XMSG: error pop-up message text\r\nSUBMIT_HEADER_TEXT=Inserimento orari per {0} e {1} pi\\u00F9 giorni\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_EDIT_ENTRY_TITLE_SCREEN=Elabora inserimento orari\r\n\r\n#XMSG: Header in edit screen for single date\r\nSUBMIT_HEADER_TEXT_SINGLE=Inserimento orari per {0}\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nFULL_CONCATENATE_HOURSMIN={0} ore {1} minuti\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nSHORT_CONCATENATE_HOURSMIN={0} h {1} m\r\n\r\n#XBUT: Button to reset\r\nRESET=Resetta\r\n\r\n#XBUT: Button to create\r\nCREATE=Crea\r\n',
	"hcm/emp/mytimesheet/i18n/i18n_iw.properties":'\r\n#XFLD: label for from time\r\nFROM=\\u05DE-\r\n\r\n#XFLD: label for to time\r\nTO=\\u05E2\\u05D3\r\n\r\n#XBUT: Button to cancel\r\nCANCEL=\\u05D1\\u05D8\\u05DC\r\n\r\n#XBUT: Button to close popover\r\nCLOSE=\\u05E1\\u05D2\\u05D5\\u05E8\r\n\r\n#XBUT: Button to accept\r\nOK=OK\r\n\r\n#XBUT: Button to Save Draft\r\nSAVE_DRAFT=\\u05E9\\u05DE\\u05D5\\u05E8 \\u05D8\\u05D9\\u05D5\\u05D8\\u05D4\r\n\r\n# XTIT: \r\nTIMESHEET_TITLE=\\u05D2\\u05D9\\u05DC\\u05D9\\u05D5\\u05DF \\u05D4\\u05E9\\u05E2\\u05D5\\u05EA \\u05E9\\u05DC\\u05D9\r\n\r\n# XTIT: \r\nTIMESHEET=\\u05D4\\u05D6\\u05E0\\u05D5\\u05EA \\u05D1\\u05D2\\u05D9\\u05DC\\u05D9\\u05D5\\u05DF \\u05E9\\u05E2\\u05D5\\u05EA\r\n\r\n# XTIT: \r\nWEEKENTRY_TITLE=\\u05D4\\u05D6\\u05E0\\u05D4 \\u05D9\\u05D3\\u05E0\\u05D9\\u05EA\r\n\r\n#XBUT: Button for quick entry\r\nQUICK_FILL=\\u05D4\\u05D6\\u05E0\\u05D4 \\u05DE\\u05D4\\u05D9\\u05E8\\u05D4\r\n\r\n# XFLD: Apply to\r\nENTRY_VIEW_APPLY_TO=\\u05D4\\u05D7\\u05DC \\u05E2\\u05DC\r\n\r\n# XTIT: \r\nTIMESHEET_DETAILS_TITLE=\\u05E4\\u05E8\\u05D8\\u05D9\\u05DD\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_CREATE_ENTRY_TITLE=\\u05E6\\u05D5\\u05E8 \\u05E8\\u05D9\\u05E9\\u05D5\\u05DD \\u05E9\\u05E2\\u05D5\\u05EA \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4\r\n\r\n# XTIT: Title for create entry view with multiple days selected\r\nTIMESHEET_CREATE_ENTRIES_TITLE=\\u05E6\\u05D5\\u05E8 \\u05D4\\u05D6\\u05E0\\u05D4 \\u05E2\\u05D1\\u05D5\\u05E8 {0} \\u05D9\\u05DE\\u05D9\\u05DD\r\n\r\n# XTIT: Title for Entry Details\r\nENTRY_DETAILS=\\u05E4\\u05E8\\u05D8\\u05D9 \\u05D4\\u05D6\\u05E0\\u05D4\r\n\r\n# XTIT: Title for edit entry view for a particular date ({0} = date)\r\nTIMESHEET_EDIT_ENTRY_TITLE=\\u05E4\\u05E8\\u05D8\\u05D9 \\u05D4\\u05D6\\u05E0\\u05D4 \\u05E2\\u05D1\\u05D5\\u05E8 {0}\r\n\r\n# XTIT: Title for create entry view for a particular date ({0} = date)\r\nTIMESHEET_NEW_ENTRY_TITLE=\\u05E6\\u05D5\\u05E8 \\u05D4\\u05D6\\u05E0\\u05D4 \\u05E2\\u05D1\\u05D5\\u05E8 {0}\r\n\r\n# XTIT: Month short header\r\nMONTH_0=\\u05D9\\u05E0\\u05D5.\r\n# XTIT: Month short header\r\nMONTH_1=\\u05E4\\u05D1\\u05E8.\r\n# XTIT: Month short header\r\nMONTH_2=\\u05DE\\u05E8\\u05E5\r\n# XTIT: Month short header\r\nMONTH_3=\\u05D0\\u05E4\\u05E8.\r\n# XTIT: Month short header\r\nMONTH_4=\\u05DE\\u05D0\\u05D9\r\n# XTIT: Month short header\r\nMONTH_5=\\u05D9\\u05D5\\u05E0\\u05D9\r\n# XTIT: Month short header\r\nMONTH_6=\\u05D9\\u05D5\\u05DC\\u05D9\r\n# XTIT: Month short header\r\nMONTH_7=\\u05D0\\u05D5\\u05D2.\r\n# XTIT: Month short header\r\nMONTH_8=\\u05E1\\u05E4\\u05D8.\r\n# XTIT: Month short header\r\nMONTH_9=\\u05D0\\u05D5\\u05E7.\r\n# XTIT: Month short header\r\nMONTH_10=\\u05E0\\u05D5\\u05D1.\r\n# XTIT: Month short header\r\nMONTH_11=\\u05D3\\u05E6\\u05DE.\r\n\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_0=\\u05D9\\u05E0\\u05D5\\u05D0\\u05E8\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_1=\\u05E4\\u05D1\\u05E8\\u05D5\\u05D0\\u05E8\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_2=\\u05DE\\u05E8\\u05E5\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_3=\\u05D0\\u05E4\\u05E8\\u05D9\\u05DC\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_4=\\u05DE\\u05D0\\u05D9\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_5=\\u05D9\\u05D5\\u05E0\\u05D9\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_6=\\u05D9\\u05D5\\u05DC\\u05D9\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_7=\\u05D0\\u05D5\\u05D2\\u05D5\\u05E1\\u05D8\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_8=\\u05E1\\u05E4\\u05D8\\u05DE\\u05D1\\u05E8\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_9=\\u05D0\\u05D5\\u05E7\\u05D8\\u05D5\\u05D1\\u05E8\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_10=\\u05E0\\u05D5\\u05D1\\u05DE\\u05D1\\u05E8\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_11=\\u05D3\\u05E6\\u05DE\\u05D1\\u05E8\r\n\r\n# XTIT: Legend missing day\r\nMISSING_DAY=\\u05E0\\u05D3\\u05E8\\u05E9\\u05EA \\u05E4\\u05E2\\u05D9\\u05DC\\u05D5\\u05EA \\u05DE\\u05E6\\u05D3\\u05DA\r\n# XTIT: Legend filled day\r\nFILLED_DAY=\\u05D1\\u05D5\\u05E6\\u05E2\r\n# XTIT: Legend filled in process, manager action needed\r\nFILLED_MANAGER=\\u05E0\\u05D3\\u05E8\\u05E9\\u05EA \\u05E4\\u05E2\\u05D9\\u05DC\\u05D5\\u05EA \\u05DE\\u05E6\\u05D3 \\u05D4\\u05DE\\u05D0\\u05E9\\u05E8\r\n# XFLD: Rejected by manager - this appears on the legend\r\nREJECTED=\\u05E0\\u05D3\\u05D7\\u05D4\r\n# XFLD: Legend future working day\r\nWORKING_DAY=\\u05D9\\u05D5\\u05DD \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4\r\n# XFLD: Legend non-working day\r\nNON_WORKING_DAY=\\u05D9\\u05D5\\u05DD \\u05E9\\u05D0\\u05D9\\u05E0\\u05D5 \\u05D9\\u05D5\\u05DD \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4\r\n\r\n# XMSG: Footer information about missing hours\r\nTOTAL_MISSING=\\u05E1\\u05D4"\\u05DB \\u05E9\\u05E2\\u05D5\\u05EA \\u05D7\\u05E1\\u05E8\\u05D5\\u05EA\\: {0}\r\n\r\n#XFLD:\r\nMONTH_YEAR={0} {1} ({2} \\u05E9\\u05E2\\u05D5\\u05EA)\r\n\r\n#XBUT: Button\r\nSAVE=\\u05E9\\u05DE\\u05D5\\u05E8\r\n\r\n#XBUT: Button \r\nSUBMIT=\\u05D4\\u05D2\\u05E9\r\n\r\n#XBUT: Button for quick entry\r\nSMART_FILL=\\u05D4\\u05D6\\u05E0\\u05D4 \\u05D0\\u05D5\\u05D8\\u05D5\\u05DE\\u05D8\\u05D9\\u05EA\r\n\r\n# XMSG\r\nFILL_ALL=\\u05D4\\u05D6\\u05DF {0} \\u05E9\\u05E2\\u05D5\\u05EA \\u05E2\\u05D1\\u05D5\\u05E8\\:\r\n\r\n#XFLD\r\nNO_TASK_TYPE=\\u05D0\\u05D9\\u05DF \\u05E1\\u05D5\\u05D2 \\u05DE\\u05E9\\u05D9\\u05DE\\u05D4\r\n\r\n#XFLD\r\nMISSING_DAYS=\\u05D9\\u05DE\\u05D9\\u05DD \\u05D7\\u05E1\\u05E8\\u05D9\\u05DD\\:{0}\r\n\r\n#XBUT: Button\r\nHOME=\\u05D3\\u05E3 \\u05D4\\u05D1\\u05D9\\u05EA\r\n\r\n#XTIT: confirmation header\r\nCONFIRMATION=\\u05D0\\u05D9\\u05E9\\u05D5\\u05E8\r\n\r\n#XTIT: deletion confirmation header\r\nDELETE_CONFIRMATION=\\u05D0\\u05E9\\u05E8 \\u05DE\\u05D7\\u05D9\\u05E7\\u05D4\r\n\r\n#XTIT: submission confirmation header\r\nSUBMISSION_CONFIRMATION=\\u05D0\\u05E9\\u05E8 \\u05D4\\u05D2\\u05E9\\u05D4\r\n\r\n#XTIT: Draft submission confirmation header\r\nDRAFT_CONFIRMATION=\\u05D0\\u05E9\\u05E8 \\u05D8\\u05D9\\u05D5\\u05D8\\u05D4\r\n\r\n#XFLD: label for Deletion summary in Dialog\r\nDELETE_CONFIRMATION_SUMMARY=\\u05E1\\u05D9\\u05DB\\u05D5\\u05DD \\u05E9\\u05DC \\u05E8\\u05D9\\u05E9\\u05D5\\u05DE\\u05D9 \\u05E9\\u05E2\\u05D5\\u05EA \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4 \\u05E9\\u05E0\\u05D1\\u05D7\\u05E8\\u05D5 \\u05DC\\u05DE\\u05D7\\u05D9\\u05E7\\u05D4\r\n\r\n#XFLD: label for Submission summary in Dialog\r\nSUBMISSION_CONFIRMATION_SUMMARY=\\u05E1\\u05D9\\u05DB\\u05D5\\u05DD \\u05E9\\u05DC \\u05E8\\u05D9\\u05E9\\u05D5\\u05DE\\u05D9 \\u05E9\\u05E2\\u05D5\\u05EA \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4 \\u05E9\\u05E0\\u05D1\\u05D7\\u05E8\\u05D5 \\u05DC\\u05D4\\u05D2\\u05E9\\u05D4\r\n\r\n#XFLD: label for Draft Submission summary in Dialog\r\nDRAFT_CONFIRMATION_SUMMARY=\\u05E1\\u05D9\\u05DB\\u05D5\\u05DD \\u05E9\\u05DC \\u05E8\\u05D9\\u05E9\\u05D5\\u05DE\\u05D9 \\u05E9\\u05E2\\u05D5\\u05EA \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4 \\u05E9\\u05E0\\u05D1\\u05D7\\u05E8\\u05D5\r\n\r\n#XFLD: label for Number of entries in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_ENTRIES=\\u05DE\\u05E1\\u05E4\\u05E8 \\u05D4\\u05D6\\u05E0\\u05D5\\u05EA\r\n\r\n#XFLD: label for Number of hours in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_HOURS=\\u05DE\\u05E1\\u05E4\\u05E8 \\u05E9\\u05E2\\u05D5\\u05EA\r\n\r\n#XBUT: Confirm Button\r\nCONFIRM=\\u05D0\\u05E9\\u05E8\r\n\r\n#XMSG: Summary for confirmation - these are two dates\r\nSUMMARY={0} - {1}\r\n\r\n#XFLD: Week \r\nWEEK=\\u05E9\\u05D1\\u05D5\\u05E2\r\n\r\n#XFLD:\r\nMEET_TARGET_HOURS=\\u05D4\\u05D7\\u05DC \\u05E9\\u05E2\\u05D5\\u05EA \\u05E2\\u05DC\\:\r\n\r\n#XBUT\r\nTHIS_WEEK=\\u05E9\\u05D1\\u05D5\\u05E2 \\u05E0\\u05D5\\u05DB\\u05D7\\u05D9 ({0} \\u05E9\\u05E2\\u05D5\\u05EA)\r\n\r\n#XBUT\r\nALL_MISSING=\\u05DB\\u05DC \\u05D4\\u05D6\\u05DE\\u05DF \\u05D4\\u05D7\\u05E1\\u05E8 ({0} \\u05E9\\u05E2\\u05D5\\u05EA)\r\n\r\n#XBUT: Delete Button Text\r\nDELETE=\\u05DE\\u05D7\\u05E7\r\n\r\n#XBUT: Add Button Text for Weekly Entry nav button\r\nNAV_ADD=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05D4\\u05D6\\u05E0\\u05D4\r\n\r\n#XFLD: label for duration\r\nDURATION=\\u05DE\\u05E9\\u05DA \\u05D6\\u05DE\\u05DF\r\n\r\n#XFLD: label for total duration\r\nTOTAL_DURATION=\\u05DE\\u05E9\\u05DA \\u05D6\\u05DE\\u05DF \\u05DB\\u05D5\\u05DC\\u05DC\r\n\r\n#XFLD: label for status\r\nSTATUS=\\u05E1\\u05D8\\u05D0\\u05D8\\u05D5\\u05E1\r\n\r\n#XFLD: label for start time\r\nSTART_TIME=\\u05E9\\u05E2\\u05EA \\u05D4\\u05EA\\u05D7\\u05DC\\u05D4\r\n\r\n#XFLD: label for end Time\r\nEND_TIME=\\u05E9\\u05E2\\u05EA \\u05E1\\u05D9\\u05D5\\u05DD\r\n\r\n#XFLD: label for note\r\nNOTE=\\u05D4\\u05E2\\u05E8\\u05D4\r\n\r\n#XFLD: label for Add New week entry\r\nADD_NEW=\\u05D4\\u05D6\\u05E0\\u05D4 \\u05D7\\u05D3\\u05E9\\u05D4\r\n\r\n#XBUT: Done button\r\nDONE=\\u05D1\\u05D5\\u05E6\\u05E2\r\n\r\n# XTIT: Recently Used\r\nRECENTLY_USED=\\u05D4\\u05E6\\u05E2\\u05D5\\u05EA\r\n\r\n# XTIT: Manual Input Add\r\nMANUAL_INPUT_ADD=\\u05D9\\u05D3\\u05E0\\u05D9\r\n\r\n# XTIT: Manual Input Edit\r\nMANUAL_INPUT_EDIT=\\u05E2\\u05E8\\u05D5\\u05DA \\u05D4\\u05D6\\u05E0\\u05D4\r\n\r\n# XTIT: Cost Assignment\r\nCOST_ASSIGNMENT=\\u05D4\\u05E7\\u05E6\\u05D0\\u05EA \\u05E9\\u05E2\\u05D4\r\n\r\n#XFLD: Tap to Load More\r\nTAP_TO_LOAD_MORE=\\u05D8\\u05E2\\u05DF \\u05E2\\u05D5\\u05D3\r\n\r\n#XFLD: Tap to Load More Loading\r\nTAP_TO_LOAD_MORE_LOADING=\\u05D8\\u05D5\\u05E2\\u05DF...\r\n\r\n#XFLD: Continue Search on Server\r\nCONTINUE_SEARCH_ON_SERVER=\\u05D4\\u05DE\\u05E9\\u05DA \\u05D7\\u05D9\\u05E4\\u05D5\\u05E9 \\u05D1\\u05E9\\u05E8\\u05EA...\r\n\r\n#XFLD: Continue Search on Server Loading\r\nCONTINUE_SEARCH_ON_SERVER_LOADING=\\u05D8\\u05D5\\u05E2\\u05DF...\r\n\r\n#XFLD: BLANK\r\nEMPTY=\\u05E8\\u05D9\\u05E7\r\n\r\n#XFLD: None\r\nNONE=\\u05DC\\u05DC\\u05D0\r\n\r\n# XTIT: Select\r\nSELECT=\\u05D1\\u05D7\\u05E8 {0}\r\n\r\n# XTIT: Placeholder for Cost Assignment Picker indicating Select action\r\nSELECT_PLACEHOLDER=\\u05D1\\u05D7\\u05E8\r\n\r\n#XFLD: Placeholder for cost assignment type search\r\nSEARCH=\\u05DE\\u05D7\\u05E4\\u05E9...\r\n\r\n#XFLD: short label for hours\r\nHOURS_LABEL=\\u05E9\r\n\r\n#XFLD: short label for minutes\r\nMINUTES_LABEL=\\u05D3\r\n\r\n#XFLD: full label for hours \r\nHOURS_LABEL_FULL=\\u05E9\\u05E2\\u05D5\\u05EA\r\n\r\n#XFLD: full label for minutes\r\nMINUTES_LABEL_FULL=\\u05D3\\u05E7\\u05D5\\u05EA\r\n\r\n#XFLD: label for date. When localizing do not change the MMM DD or YYYY, just the order of them\r\nDATE_LOCALE=DD MMM, YYYY\r\n\r\n\r\n#XBUT:\r\nDETAIL=\\u05E4\\u05E8\\u05D8\\u05D9\\u05DD\r\n\r\n\r\n#XFLD: label for Settings title\r\nSETTINGS_TITLE=\\u05D4\\u05D2\\u05D3\\u05E8\\u05D5\\u05EA\r\n#XFLD: label for Settings data entry profile\r\nSETTINGS_DATA_ENTRY_PROFILE=\\u05E4\\u05E8\\u05D5\\u05E4\\u05D9\\u05DC \\u05D4\\u05D6\\u05E0\\u05EA \\u05E0\\u05EA\\u05D5\\u05E0\\u05D9\\u05DD\r\n#XFLD: label for Settings pre-fill label\r\nSETTINGS_PREFILL_LAST_WEEK=\\u05D4\\u05E6\\u05E2\\u05D4 \\u05D0\\u05D5\\u05D8\\u05D5\\u05DE\\u05D8\\u05D9\\u05EA\r\n\r\n# XMSG: \r\nCONFIRM_LEAVE_PAGE=\\u05E0\\u05EA\\u05D5\\u05E0\\u05D9\\u05DD \\u05E9\\u05DC\\u05D0 \\u05D9\\u05D9\\u05E9\\u05DE\\u05E8\\u05D5 \\u05D9\\u05D5\\u05E1\\u05E8\\u05D5. \\u05D4\\u05D0\\u05DD \\u05D0\\u05EA\\u05D4 \\u05D1\\u05D8\\u05D5\\u05D7 \\u05E9\\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05D4\\u05DE\\u05E9\\u05D9\\u05DA?\r\n# XTIT: \r\nUNSAVED_CHANGES=\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD \\u05E9\\u05DC\\u05D0 \\u05E0\\u05E9\\u05DE\\u05E8\\u05D5\r\n\r\n#XMSG: toast message for successful submit\r\nSUBMIT_SUCCESS=\\u05D4\\u05D1\\u05E7\\u05E9\\u05D4 \\u05D4\\u05D5\\u05D2\\u05E9\\u05D4\r\n\r\n#XMSG: toast message for successful draft submit\r\nDRAFT_SUCCESS=\\u05D4\\u05D8\\u05D9\\u05D5\\u05D8\\u05D4 \\u05E0\\u05E9\\u05DE\\u05E8\\u05D4 \\u05D1\\u05D4\\u05E6\\u05DC\\u05D7\\u05D4\r\n\r\n#XBUT:\r\nHELP=\\u05E2\\u05D6\\u05E8\\u05D4\r\n\r\n#XMSG: confirmation message for week entry\r\nTOTAL_BOOKED={0}/{1} \\u05E9\\u05E2\\u05D5\\u05EA \\u05D4\\u05D5\\u05D6\\u05E0\\u05D5 \\u05E2\\u05D1\\u05D5\\u05E8 \\u05E9\\u05D1\\u05D5\\u05E2 \\u05D6\\u05D4.\r\n\r\n#XMSG: help text for pre-fill option\r\nHELP_PREFILL=\\u05D4\\u05E4\\u05E2\\u05DC \\u05DE\\u05D9\\u05DC\\u05D5\\u05D9 \\u05DE\\u05E8\\u05D0\\u05E9 \\u05DB\\u05D3\\u05D9 \\u05DC\\u05D4\\u05D6\\u05D9\\u05DF \\u05D1\\u05DE\\u05D4\\u05D9\\u05E8\\u05D5\\u05EA \\u05E9\\u05E2\\u05D5\\u05EA \\u05E2\\u05D1\\u05D5\\u05E8 \\u05D4\\u05E9\\u05D1\\u05D5\\u05E2 \\u05E2\\u05DC \\u05D1\\u05E1\\u05D9\\u05E1 \\u05D4\\u05D4\\u05D6\\u05E0\\u05D4 \\u05D4\\u05DE\\u05D5\\u05E6\\u05DC\\u05D7\\u05EA \\u05D4\\u05D0\\u05D7\\u05E8\\u05D5\\u05E0\\u05D4 \\u05E9\\u05DC\\u05DA\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT_AUTO_ENTRY=\\u05D4\\u05D4\\u05D2\\u05E9\\u05D4 \\u05E0\\u05DB\\u05E9\\u05DC\\u05D4; \\u05E2\\u05D9\\u05D9\\u05DF \\u05D1\\u05E4\\u05E8\\u05D8\\u05D9 \\u05D4\\u05E9\\u05D2\\u05D9\\u05D0\\u05D4 \\u05D5\\u05E0\\u05E1\\u05D4 \\u05E9\\u05D5\\u05D1\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT=\\u05D7\\u05DC\\u05E7 \\u05DE\\u05D4\\u05D4\\u05D6\\u05E0\\u05D5\\u05EA \\u05E9\\u05D2\\u05D5\\u05D9\\u05D5\\u05EA. \\u05E2\\u05D9\\u05D9\\u05DF \\u05D1\\u05E4\\u05E8\\u05D8\\u05D9 \\u05D4\\u05E9\\u05D2\\u05D9\\u05D0\\u05D4 \\u05D5\\u05E0\\u05E1\\u05D4 \\u05E9\\u05D5\\u05D1.\r\n\r\n#XMSG: error pop-up message text\r\nSUBMIT_HEADER_TEXT=\\u05D4\\u05D6\\u05E0\\u05EA \\u05E9\\u05E2\\u05D5\\u05EA \\u05E2\\u05D1\\u05D5\\u05E8 {0} \\u05D5-{1} \\u05D9\\u05DE\\u05D9\\u05DD \\u05E0\\u05D5\\u05E1\\u05E4\\u05D9\\u05DD\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_EDIT_ENTRY_TITLE_SCREEN=\\u05E2\\u05E8\\u05D5\\u05DA \\u05E8\\u05D9\\u05E9\\u05D5\\u05DD \\u05E9\\u05E2\\u05D5\\u05EA \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4\r\n\r\n#XMSG: Header in edit screen for single date\r\nSUBMIT_HEADER_TEXT_SINGLE=\\u05E8\\u05D9\\u05E9\\u05D5\\u05DD \\u05E9\\u05E2\\u05D5\\u05EA \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4 \\u05E2\\u05D1\\u05D5\\u05E8 {0}\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nFULL_CONCATENATE_HOURSMIN={0} \\u05E9\\u05E2\\u05D5\\u05EA {1} \\u05D3\\u05E7\\u05D5\\u05EA\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nSHORT_CONCATENATE_HOURSMIN={0} \\u05E9\\u05E2\\u05D5\\u05EA {1} \\u05D3\\u05E7\\u05D5\\u05EA\r\n\r\n#XBUT: Button to reset\r\nRESET=\\u05D0\\u05E4\\u05E1\r\n\r\n#XBUT: Button to create\r\nCREATE=\\u05E6\\u05D5\\u05E8\r\n',
	"hcm/emp/mytimesheet/i18n/i18n_ja.properties":'\r\n#XFLD: label for from time\r\nFROM=\\u958B\\u59CB\r\n\r\n#XFLD: label for to time\r\nTO=\\u7D42\\u4E86\r\n\r\n#XBUT: Button to cancel\r\nCANCEL=\\u4E2D\\u6B62\r\n\r\n#XBUT: Button to close popover\r\nCLOSE=\\u9589\\u3058\\u308B\r\n\r\n#XBUT: Button to accept\r\nOK=OK\r\n\r\n#XBUT: Button to Save Draft\r\nSAVE_DRAFT=\\u30C9\\u30E9\\u30D5\\u30C8\\u4FDD\\u5B58\r\n\r\n# XTIT: \r\nTIMESHEET_TITLE=\\u30BF\\u30A4\\u30E0\\u30B7\\u30FC\\u30C8\r\n\r\n# XTIT: \r\nTIMESHEET=\\u30BF\\u30A4\\u30E0\\u30B7\\u30FC\\u30C8\\u30A8\\u30F3\\u30C8\\u30EA\r\n\r\n# XTIT: \r\nWEEKENTRY_TITLE=\\u30DE\\u30CB\\u30E5\\u30A2\\u30EB\\u5165\\u529B\r\n\r\n#XBUT: Button for quick entry\r\nQUICK_FILL=\\u7C21\\u6613\\u5165\\u529B\r\n\r\n# XFLD: Apply to\r\nENTRY_VIEW_APPLY_TO=\\u9069\\u7528\\u5148\r\n\r\n# XTIT: \r\nTIMESHEET_DETAILS_TITLE=\\u8A73\\u7D30\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_CREATE_ENTRY_TITLE=\\u6642\\u9593\\u5165\\u529B\\u767B\\u9332\r\n\r\n# XTIT: Title for create entry view with multiple days selected\r\nTIMESHEET_CREATE_ENTRIES_TITLE={0} \\u65E5\\u9593\\u306E\\u5165\\u529B\\u767B\\u9332\r\n\r\n# XTIT: Title for Entry Details\r\nENTRY_DETAILS=\\u5165\\u529B\\u8A73\\u7D30\r\n\r\n# XTIT: Title for edit entry view for a particular date ({0} = date)\r\nTIMESHEET_EDIT_ENTRY_TITLE={0} \\u306E\\u5165\\u529B\\u8A73\\u7D30\r\n\r\n# XTIT: Title for create entry view for a particular date ({0} = date)\r\nTIMESHEET_NEW_ENTRY_TITLE={0} \\u306E\\u5165\\u529B\\u767B\\u9332\r\n\r\n# XTIT: Month short header\r\nMONTH_0=1 \\u6708\r\n# XTIT: Month short header\r\nMONTH_1=2 \\u6708\r\n# XTIT: Month short header\r\nMONTH_2=3 \\u6708\r\n# XTIT: Month short header\r\nMONTH_3=4 \\u6708\r\n# XTIT: Month short header\r\nMONTH_4=5 \\u6708\r\n# XTIT: Month short header\r\nMONTH_5=6 \\u6708\r\n# XTIT: Month short header\r\nMONTH_6=7 \\u6708\r\n# XTIT: Month short header\r\nMONTH_7=8 \\u6708\r\n# XTIT: Month short header\r\nMONTH_8=9 \\u6708\r\n# XTIT: Month short header\r\nMONTH_9=10 \\u6708\r\n# XTIT: Month short header\r\nMONTH_10=11 \\u6708\r\n# XTIT: Month short header\r\nMONTH_11=12 \\u6708\r\n\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_0=1 \\u6708\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_1=2 \\u6708\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_2=3 \\u6708\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_3=4 \\u6708\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_4=5 \\u6708\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_5=6 \\u6708\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_6=7 \\u6708\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_7=8 \\u6708\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_8=9 \\u6708\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_9=10 \\u6708\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_10=11 \\u6708\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_11=12 \\u6708\r\n\r\n# XTIT: Legend missing day\r\nMISSING_DAY=\\u30E6\\u30FC\\u30B6\\u30A2\\u30AF\\u30B7\\u30E7\\u30F3\\u5FC5\\u9808\r\n# XTIT: Legend filled day\r\nFILLED_DAY=\\u5B8C\\u4E86\r\n# XTIT: Legend filled in process, manager action needed\r\nFILLED_MANAGER=\\u627F\\u8A8D\\u8005\\u30A2\\u30AF\\u30B7\\u30E7\\u30F3\\u5FC5\\u9808\r\n# XFLD: Rejected by manager - this appears on the legend\r\nREJECTED=\\u5374\\u4E0B\\u6E08\r\n# XFLD: Legend future working day\r\nWORKING_DAY=\\u7A3C\\u50CD\\u65E5\r\n# XFLD: Legend non-working day\r\nNON_WORKING_DAY=\\u4F11\\u65E5\r\n\r\n# XMSG: Footer information about missing hours\r\nTOTAL_MISSING=\\u5408\\u8A08\\u4E0D\\u8DB3\\u6642\\u9593\\u6570\\:  {0}\r\n\r\n#XFLD:\r\nMONTH_YEAR={0} {1} ({2} \\u6642\\u9593)\r\n\r\n#XBUT: Button\r\nSAVE=\\u4FDD\\u5B58\r\n\r\n#XBUT: Button \r\nSUBMIT=\\u9001\\u4FE1\r\n\r\n#XBUT: Button for quick entry\r\nSMART_FILL=\\u81EA\\u52D5\\u5165\\u529B\r\n\r\n# XMSG\r\nFILL_ALL={0} \\u6642\\u9593\\u3092\\u5165\\u529B\\: \r\n\r\n#XFLD\r\nNO_TASK_TYPE=\\u30BF\\u30B9\\u30AF\\u30BF\\u30A4\\u30D7\\u306A\\u3057\r\n\r\n#XFLD\r\nMISSING_DAYS=\\u4E0D\\u8DB3\\u65E5\\u6570\\: {0}\r\n\r\n#XBUT: Button\r\nHOME=\\u30DB\\u30FC\\u30E0\r\n\r\n#XTIT: confirmation header\r\nCONFIRMATION=\\u78BA\\u8A8D\r\n\r\n#XTIT: deletion confirmation header\r\nDELETE_CONFIRMATION=\\u524A\\u9664\\u306E\\u78BA\\u8A8D\r\n\r\n#XTIT: submission confirmation header\r\nSUBMISSION_CONFIRMATION=\\u9001\\u4FE1\\u78BA\\u8A8D\r\n\r\n#XTIT: Draft submission confirmation header\r\nDRAFT_CONFIRMATION=\\u30C9\\u30E9\\u30D5\\u30C8\\u78BA\\u8A8D\r\n\r\n#XFLD: label for Deletion summary in Dialog\r\nDELETE_CONFIRMATION_SUMMARY=\\u524A\\u9664\\u5BFE\\u8C61\\u3068\\u3057\\u3066\\u9078\\u629E\\u3055\\u308C\\u305F\\u6642\\u9593\\u5165\\u529B\\u306E\\u30B5\\u30DE\\u30EA\r\n\r\n#XFLD: label for Submission summary in Dialog\r\nSUBMISSION_CONFIRMATION_SUMMARY=\\u9001\\u4FE1\\u5BFE\\u8C61\\u3068\\u3057\\u3066\\u9078\\u629E\\u3055\\u308C\\u305F\\u6642\\u9593\\u5165\\u529B\\u306E\\u30B5\\u30DE\\u30EA\r\n\r\n#XFLD: label for Draft Submission summary in Dialog\r\nDRAFT_CONFIRMATION_SUMMARY=\\u9078\\u629E\\u3055\\u308C\\u305F\\u6642\\u9593\\u5165\\u529B\\u306E\\u30B5\\u30DE\\u30EA\r\n\r\n#XFLD: label for Number of entries in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_ENTRIES=\\u30A8\\u30F3\\u30C8\\u30EA\\u6570\r\n\r\n#XFLD: label for Number of hours in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_HOURS=\\u6642\\u9593\\u6570\r\n\r\n#XBUT: Confirm Button\r\nCONFIRM=\\u78BA\\u8A8D\r\n\r\n#XMSG: Summary for confirmation - these are two dates\r\nSUMMARY={0} - {1}\r\n\r\n#XFLD: Week \r\nWEEK=\\u9031\r\n\r\n#XFLD:\r\nMEET_TARGET_HOURS=\\u6642\\u9593\\u9069\\u7528\\u5148\\:\r\n\r\n#XBUT\r\nTHIS_WEEK=\\u73FE\\u5728\\u306E\\u9031 ({0} \\u6642\\u9593)\r\n\r\n#XBUT\r\nALL_MISSING=\\u5168\\u4E0D\\u8DB3\\u6642\\u9593 ({0} \\u6642\\u9593)\r\n\r\n#XBUT: Delete Button Text\r\nDELETE=\\u524A\\u9664\r\n\r\n#XBUT: Add Button Text for Weekly Entry nav button\r\nNAV_ADD=\\u5165\\u529B\\u8FFD\\u52A0\r\n\r\n#XFLD: label for duration\r\nDURATION=\\u6642\\u9593\r\n\r\n#XFLD: label for total duration\r\nTOTAL_DURATION=\\u5408\\u8A08\\u671F\\u9593\r\n\r\n#XFLD: label for status\r\nSTATUS=\\u30B9\\u30C6\\u30FC\\u30BF\\u30B9\r\n\r\n#XFLD: label for start time\r\nSTART_TIME=\\u958B\\u59CB\\u6642\\u523B\r\n\r\n#XFLD: label for end Time\r\nEND_TIME=\\u7D42\\u4E86\\u6642\\u523B\r\n\r\n#XFLD: label for note\r\nNOTE=\\u30E1\\u30E2\r\n\r\n#XFLD: label for Add New week entry\r\nADD_NEW=\\u65B0\\u898F\\u5165\\u529B\r\n\r\n#XBUT: Done button\r\nDONE=\\u5B8C\\u4E86\r\n\r\n# XTIT: Recently Used\r\nRECENTLY_USED=\\u63D0\\u6848\r\n\r\n# XTIT: Manual Input Add\r\nMANUAL_INPUT_ADD=\\u30DE\\u30CB\\u30E5\\u30A2\\u30EB\r\n\r\n# XTIT: Manual Input Edit\r\nMANUAL_INPUT_EDIT=\\u5165\\u529B\\u306E\\u7DE8\\u96C6\r\n\r\n# XTIT: Cost Assignment\r\nCOST_ASSIGNMENT=\\u6642\\u9593\\u5272\\u5F53\r\n\r\n#XFLD: Tap to Load More\r\nTAP_TO_LOAD_MORE=\\u8FFD\\u52A0\\u30ED\\u30FC\\u30C9\r\n\r\n#XFLD: Tap to Load More Loading\r\nTAP_TO_LOAD_MORE_LOADING=\\u30ED\\u30FC\\u30C9\\u4E2D...\r\n\r\n#XFLD: Continue Search on Server\r\nCONTINUE_SEARCH_ON_SERVER=\\u30B5\\u30FC\\u30D0\\u3067\\u306E\\u691C\\u7D22\\u3092\\u7D9A\\u884C...\r\n\r\n#XFLD: Continue Search on Server Loading\r\nCONTINUE_SEARCH_ON_SERVER_LOADING=\\u30ED\\u30FC\\u30C9\\u4E2D...\r\n\r\n#XFLD: BLANK\r\nEMPTY=\\u7A7A\\u767D\r\n\r\n#XFLD: None\r\nNONE=\\u306A\\u3057\r\n\r\n# XTIT: Select\r\nSELECT={0} \\u306E\\u9078\\u629E\r\n\r\n# XTIT: Placeholder for Cost Assignment Picker indicating Select action\r\nSELECT_PLACEHOLDER=\\u9078\\u629E\r\n\r\n#XFLD: Placeholder for cost assignment type search\r\nSEARCH=\\u691C\\u7D22\\u4E2D...\r\n\r\n#XFLD: short label for hours\r\nHOURS_LABEL=\\u6642\\u9593\r\n\r\n#XFLD: short label for minutes\r\nMINUTES_LABEL=\\u5206\r\n\r\n#XFLD: full label for hours \r\nHOURS_LABEL_FULL=\\u6642\\u9593\r\n\r\n#XFLD: full label for minutes\r\nMINUTES_LABEL_FULL=\\u5206\r\n\r\n#XFLD: label for date. When localizing do not change the MMM DD or YYYY, just the order of them\r\nDATE_LOCALE=YYYY/MM/DD\r\n\r\n\r\n#XBUT:\r\nDETAIL=\\u8A73\\u7D30\r\n\r\n\r\n#XFLD: label for Settings title\r\nSETTINGS_TITLE=\\u8A2D\\u5B9A\r\n#XFLD: label for Settings data entry profile\r\nSETTINGS_DATA_ENTRY_PROFILE=\\u30C7\\u30FC\\u30BF\\u5165\\u529B\\u30D7\\u30ED\\u30D5\\u30A1\\u30A4\\u30EB\r\n#XFLD: label for Settings pre-fill label\r\nSETTINGS_PREFILL_LAST_WEEK=\\u81EA\\u52D5\\u5019\\u88DC\\u63D0\\u6848\r\n\r\n# XMSG: \r\nCONFIRM_LEAVE_PAGE=\\u672A\\u4FDD\\u5B58\\u306E\\u30C7\\u30FC\\u30BF\\u306F\\u3059\\u3079\\u3066\\u7834\\u68C4\\u3055\\u308C\\u307E\\u3059\\u3002\\u7D9A\\u884C\\u3057\\u307E\\u3059\\u304B\\u3002\r\n# XTIT: \r\nUNSAVED_CHANGES=\\u672A\\u4FDD\\u5B58\\u5909\\u66F4\r\n\r\n#XMSG: toast message for successful submit\r\nSUBMIT_SUCCESS=\\u7533\\u8ACB\\u304C\\u9001\\u4FE1\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n#XMSG: toast message for successful draft submit\r\nDRAFT_SUCCESS=\\u30C9\\u30E9\\u30D5\\u30C8\\u304C\\u4FDD\\u5B58\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n#XBUT:\r\nHELP=\\u30D8\\u30EB\\u30D7\r\n\r\n#XMSG: confirmation message for week entry\r\nTOTAL_BOOKED=\\u4ECA\\u9031\\u306B\\u3064\\u3044\\u3066 {0}/{1} \\u6642\\u9593\\u304C\\u5165\\u529B\\u3055\\u308C\\u307E\\u3057\\u305F\\u3002\r\n\r\n#XMSG: help text for pre-fill option\r\nHELP_PREFILL=\\u524D\\u56DE\\u6B63\\u5E38\\u306B\\u5B8C\\u4E86\\u3057\\u305F\\u5165\\u529B\\u306B\\u57FA\\u3065\\u304D\\u3001\\u9031\\u306B\\u5BFE\\u3057\\u3066\\u6642\\u9593\\u3092\\u8FC5\\u901F\\u306B\\u5165\\u529B\\u3059\\u308B\\u306B\\u306F\\u4E8B\\u524D\\u5165\\u529B\\u3092\\u30AA\\u30F3\\u306B\\u3057\\u307E\\u3059\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT_AUTO_ENTRY=\\u9001\\u4FE1\\u306B\\u5931\\u6557\\u3057\\u307E\\u3057\\u305F\\u3002\\u30A8\\u30E9\\u30FC\\u8A73\\u7D30\\u3092\\u78BA\\u8A8D\\u3057\\u3066\\u518D\\u8A66\\u884C\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT=\\u4E00\\u90E8\\u306E\\u5165\\u529B\\u304C\\u4E0D\\u9069\\u5207\\u3067\\u3059\\u3002\\u30A8\\u30E9\\u30FC\\u8A73\\u7D30\\u3092\\u78BA\\u8A8D\\u3057\\u3066\\u518D\\u8A66\\u884C\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\r\n\r\n#XMSG: error pop-up message text\r\nSUBMIT_HEADER_TEXT={0} \\u65E5\\u9593\\u3068\\u3055\\u3089\\u306B {1} \\u65E5\\u9593\\u306E\\u6642\\u9593\\u5165\\u529B\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_EDIT_ENTRY_TITLE_SCREEN=\\u6642\\u9593\\u5165\\u529B\\u7DE8\\u96C6\r\n\r\n#XMSG: Header in edit screen for single date\r\nSUBMIT_HEADER_TEXT_SINGLE={0} \\u306E\\u6642\\u9593\\u5165\\u529B\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nFULL_CONCATENATE_HOURSMIN={0} \\u6642\\u9593 {1} \\u5206\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nSHORT_CONCATENATE_HOURSMIN={0} h {1} m\r\n\r\n#XBUT: Button to reset\r\nRESET=\\u30EA\\u30BB\\u30C3\\u30C8\r\n\r\n#XBUT: Button to create\r\nCREATE=\\u767B\\u9332\r\n',
	"hcm/emp/mytimesheet/i18n/i18n_no.properties":'\r\n#XFLD: label for from time\r\nFROM=Fra\r\n\r\n#XFLD: label for to time\r\nTO=Til\r\n\r\n#XBUT: Button to cancel\r\nCANCEL=Avbryt\r\n\r\n#XBUT: Button to close popover\r\nCLOSE=Lukk\r\n\r\n#XBUT: Button to accept\r\nOK=OK\r\n\r\n#XBUT: Button to Save Draft\r\nSAVE_DRAFT=Lagre utkast\r\n\r\n# XTIT: \r\nTIMESHEET_TITLE=Min tidsregistrering\r\n\r\n# XTIT: \r\nTIMESHEET=Tidsreg.poster\r\n\r\n# XTIT: \r\nWEEKENTRY_TITLE=Manuell registrering\r\n\r\n#XBUT: Button for quick entry\r\nQUICK_FILL=Hurtigregistrering\r\n\r\n# XFLD: Apply to\r\nENTRY_VIEW_APPLY_TO=Bruk p\\u00E5\r\n\r\n# XTIT: \r\nTIMESHEET_DETAILS_TITLE=Detaljer\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_CREATE_ENTRY_TITLE=Opprett tidsregistrering\r\n\r\n# XTIT: Title for create entry view with multiple days selected\r\nTIMESHEET_CREATE_ENTRIES_TITLE=Registrer timer for {0} dager\r\n\r\n# XTIT: Title for Entry Details\r\nENTRY_DETAILS=Postdetaljer\r\n\r\n# XTIT: Title for edit entry view for a particular date ({0} = date)\r\nTIMESHEET_EDIT_ENTRY_TITLE=Registreringsdetaljer for {0}\r\n\r\n# XTIT: Title for create entry view for a particular date ({0} = date)\r\nTIMESHEET_NEW_ENTRY_TITLE=Registrer timer for {0}\r\n\r\n# XTIT: Month short header\r\nMONTH_0=Jan.\r\n# XTIT: Month short header\r\nMONTH_1=Feb.\r\n# XTIT: Month short header\r\nMONTH_2=Mars\r\n# XTIT: Month short header\r\nMONTH_3=Apr.\r\n# XTIT: Month short header\r\nMONTH_4=Mai\r\n# XTIT: Month short header\r\nMONTH_5=Juni\r\n# XTIT: Month short header\r\nMONTH_6=Juli\r\n# XTIT: Month short header\r\nMONTH_7=Aug.\r\n# XTIT: Month short header\r\nMONTH_8=Sep.\r\n# XTIT: Month short header\r\nMONTH_9=Okt.\r\n# XTIT: Month short header\r\nMONTH_10=Nov.\r\n# XTIT: Month short header\r\nMONTH_11=Des.\r\n\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_0=Januar\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_1=Februar\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_2=Mars\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_3=April\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_4=Mai\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_5=Juni\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_6=Juli\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_7=August\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_8=September\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_9=Oktober\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_10=November\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_11=Desember\r\n\r\n# XTIT: Legend missing day\r\nMISSING_DAY=M\\u00E5 registreres\r\n# XTIT: Legend filled day\r\nFILLED_DAY=Utf\\u00F8rt\r\n# XTIT: Legend filled in process, manager action needed\r\nFILLED_MANAGER=Venter p\\u00E5 godkjenning\r\n# XFLD: Rejected by manager - this appears on the legend\r\nREJECTED=Avvist\r\n# XFLD: Legend future working day\r\nWORKING_DAY=Arbeidsdag\r\n# XFLD: Legend non-working day\r\nNON_WORKING_DAY=Fridag\r\n\r\n# XMSG: Footer information about missing hours\r\nTOTAL_MISSING=Totalt antall manglende timer\\: {0}\r\n\r\n#XFLD:\r\nMONTH_YEAR={0} {1} ({2} timer)\r\n\r\n#XBUT: Button\r\nSAVE=Lagre\r\n\r\n#XBUT: Button \r\nSUBMIT=Send\r\n\r\n#XBUT: Button for quick entry\r\nSMART_FILL=Automatisk registrering\r\n\r\n# XMSG\r\nFILL_ALL=Registrer {0} timer for\\:\r\n\r\n#XFLD\r\nNO_TASK_TYPE=Ingen oppgavetype\r\n\r\n#XFLD\r\nMISSING_DAYS=Manglende dager\\:{0}\r\n\r\n#XBUT: Button\r\nHOME=Startside\r\n\r\n#XTIT: confirmation header\r\nCONFIRMATION=Bekreftelse\r\n\r\n#XTIT: deletion confirmation header\r\nDELETE_CONFIRMATION=Bekreft sletting\r\n\r\n#XTIT: submission confirmation header\r\nSUBMISSION_CONFIRMATION=Bekreft sending\r\n\r\n#XTIT: Draft submission confirmation header\r\nDRAFT_CONFIRMATION=Bekreft utkast\r\n\r\n#XFLD: label for Deletion summary in Dialog\r\nDELETE_CONFIRMATION_SUMMARY=Oversikt over tidsdataregistreringer valgt for sletting\r\n\r\n#XFLD: label for Submission summary in Dialog\r\nSUBMISSION_CONFIRMATION_SUMMARY=Oversikt over tidsdataregistreringer valgt for sending\r\n\r\n#XFLD: label for Draft Submission summary in Dialog\r\nDRAFT_CONFIRMATION_SUMMARY=Oversikt over valgte tidsdataregistreringer\r\n\r\n#XFLD: label for Number of entries in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_ENTRIES=Antall poster\r\n\r\n#XFLD: label for Number of hours in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_HOURS=Antall timer\r\n\r\n#XBUT: Confirm Button\r\nCONFIRM=Bekreft\r\n\r\n#XMSG: Summary for confirmation - these are two dates\r\nSUMMARY={0} - {1}\r\n\r\n#XFLD: Week \r\nWEEK=Uke\r\n\r\n#XFLD:\r\nMEET_TARGET_HOURS=Bruk timer p\\u00E5\\:\r\n\r\n#XBUT\r\nTHIS_WEEK=Innev\\u00E6rende uke ({0} timer)\r\n\r\n#XBUT\r\nALL_MISSING=All manglende tid ({0} timer)\r\n\r\n#XBUT: Delete Button Text\r\nDELETE=Slett\r\n\r\n#XBUT: Add Button Text for Weekly Entry nav button\r\nNAV_ADD=Tilf\\u00F8y post\r\n\r\n#XFLD: label for duration\r\nDURATION=Varighet\r\n\r\n#XFLD: label for total duration\r\nTOTAL_DURATION=Samlet varighet\r\n\r\n#XFLD: label for status\r\nSTATUS=Status\r\n\r\n#XFLD: label for start time\r\nSTART_TIME=Starttidspunkt\r\n\r\n#XFLD: label for end Time\r\nEND_TIME=Sluttidspunkt\r\n\r\n#XFLD: label for note\r\nNOTE=Merknad\r\n\r\n#XFLD: label for Add New week entry\r\nADD_NEW=Ny post\r\n\r\n#XBUT: Done button\r\nDONE=Utf\\u00F8rt\r\n\r\n# XTIT: Recently Used\r\nRECENTLY_USED=Forslag\r\n\r\n# XTIT: Manual Input Add\r\nMANUAL_INPUT_ADD=Manuell\r\n\r\n# XTIT: Manual Input Edit\r\nMANUAL_INPUT_EDIT=Rediger post\r\n\r\n# XTIT: Cost Assignment\r\nCOST_ASSIGNMENT=Tidstilordning\r\n\r\n#XFLD: Tap to Load More\r\nTAP_TO_LOAD_MORE=Last flere\r\n\r\n#XFLD: Tap to Load More Loading\r\nTAP_TO_LOAD_MORE_LOADING=Laster ...\r\n\r\n#XFLD: Continue Search on Server\r\nCONTINUE_SEARCH_ON_SERVER=Fortsett s\\u00F8k p\\u00E5 server...\r\n\r\n#XFLD: Continue Search on Server Loading\r\nCONTINUE_SEARCH_ON_SERVER_LOADING=Laster ...\r\n\r\n#XFLD: BLANK\r\nEMPTY=Tom\r\n\r\n#XFLD: None\r\nNONE=Ingen\r\n\r\n# XTIT: Select\r\nSELECT=Velg {0}\r\n\r\n# XTIT: Placeholder for Cost Assignment Picker indicating Select action\r\nSELECT_PLACEHOLDER=Velg\r\n\r\n#XFLD: Placeholder for cost assignment type search\r\nSEARCH=S\\u00F8ker...\r\n\r\n#XFLD: short label for hours\r\nHOURS_LABEL=h\r\n\r\n#XFLD: short label for minutes\r\nMINUTES_LABEL=m\r\n\r\n#XFLD: full label for hours \r\nHOURS_LABEL_FULL=Timer\r\n\r\n#XFLD: full label for minutes\r\nMINUTES_LABEL_FULL=Minutter\r\n\r\n#XFLD: label for date. When localizing do not change the MMM DD or YYYY, just the order of them\r\nDATE_LOCALE=DD MMM, YYYY\r\n\r\n\r\n#XBUT:\r\nDETAIL=Detaljer\r\n\r\n\r\n#XFLD: label for Settings title\r\nSETTINGS_TITLE=Innstillinger\r\n#XFLD: label for Settings data entry profile\r\nSETTINGS_DATA_ENTRY_PROFILE=Registreringsprofil\r\n#XFLD: label for Settings pre-fill label\r\nSETTINGS_PREFILL_LAST_WEEK=Forh\\u00E5ndsdef.\r\n\r\n# XMSG: \r\nCONFIRM_LEAVE_PAGE=Du vil miste data som ikke er lagret. Er du sikker p\\u00E5 at du vil fortsette?\r\n# XTIT: \r\nUNSAVED_CHANGES=Ulagrede endringer\r\n\r\n#XMSG: toast message for successful submit\r\nSUBMIT_SUCCESS=Foresp\\u00F8rsel sendt\r\n\r\n#XMSG: toast message for successful draft submit\r\nDRAFT_SUCCESS=Utkast er lagret\r\n\r\n#XBUT:\r\nHELP=Hjelp\r\n\r\n#XMSG: confirmation message for week entry\r\nTOTAL_BOOKED={0}/{1} timer registrert for denne uken.\r\n\r\n#XMSG: help text for pre-fill option\r\nHELP_PREFILL=Sl\\u00E5 p\\u00E5 forh\\u00E5ndsdefinisjon for hurtig utfylling av timer for uken basert p\\u00E5 siste utf\\u00F8rte registrering\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT_AUTO_ENTRY=Sending mislyktes. Kontroller feildetaljer og pr\\u00F8v p\\u00E5 nytt.\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT=Noen poster er feil. Kontroller feildetaljer og pr\\u00F8v p\\u00E5 nytt.\r\n\r\n#XMSG: error pop-up message text\r\nSUBMIT_HEADER_TEXT=Tidsregistrering for {0} og {1} flere dag(er)\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_EDIT_ENTRY_TITLE_SCREEN=Rediger tidsregistrering\r\n\r\n#XMSG: Header in edit screen for single date\r\nSUBMIT_HEADER_TEXT_SINGLE=Tidsregistrering for {0}\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nFULL_CONCATENATE_HOURSMIN={0} timer {1} minutter\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nSHORT_CONCATENATE_HOURSMIN={0} h {1} m\r\n\r\n#XBUT: Button to reset\r\nRESET=Tilbakestill\r\n\r\n#XBUT: Button to create\r\nCREATE=Opprett\r\n',
	"hcm/emp/mytimesheet/i18n/i18n_pl.properties":'\r\n#XFLD: label for from time\r\nFROM=Od\r\n\r\n#XFLD: label for to time\r\nTO=Do\r\n\r\n#XBUT: Button to cancel\r\nCANCEL=Anuluj\r\n\r\n#XBUT: Button to close popover\r\nCLOSE=Zamknij\r\n\r\n#XBUT: Button to accept\r\nOK=OK\r\n\r\n#XBUT: Button to Save Draft\r\nSAVE_DRAFT=Zapisz wersj\\u0119 robocz\\u0105\r\n\r\n# XTIT: \r\nTIMESHEET_TITLE=Rejestracja czasu\r\n\r\n# XTIT: \r\nTIMESHEET=Wpisy arkusza czasu pracy\r\n\r\n# XTIT: \r\nWEEKENTRY_TITLE=Wpis r\\u0119czny\r\n\r\n#XBUT: Button for quick entry\r\nQUICK_FILL=Szybki wpis\r\n\r\n# XFLD: Apply to\r\nENTRY_VIEW_APPLY_TO=Zastosuj do\r\n\r\n# XTIT: \r\nTIMESHEET_DETAILS_TITLE=Szczeg\\u00F3\\u0142y\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_CREATE_ENTRY_TITLE=Utw\\u00F3rz wpis daty\r\n\r\n# XTIT: Title for create entry view with multiple days selected\r\nTIMESHEET_CREATE_ENTRIES_TITLE=Utw\\u00F3rz wpis dla {0} dni\r\n\r\n# XTIT: Title for Entry Details\r\nENTRY_DETAILS=Szczeg\\u00F3\\u0142y wpisu\r\n\r\n# XTIT: Title for edit entry view for a particular date ({0} = date)\r\nTIMESHEET_EDIT_ENTRY_TITLE=Szczeg\\u00F3\\u0142y wpisu dla {0}\r\n\r\n# XTIT: Title for create entry view for a particular date ({0} = date)\r\nTIMESHEET_NEW_ENTRY_TITLE=Utw\\u00F3rz wpis dla {0}\r\n\r\n# XTIT: Month short header\r\nMONTH_0=Sty.\r\n# XTIT: Month short header\r\nMONTH_1=Luty\r\n# XTIT: Month short header\r\nMONTH_2=Mar.\r\n# XTIT: Month short header\r\nMONTH_3=Kwi.\r\n# XTIT: Month short header\r\nMONTH_4=Maj\r\n# XTIT: Month short header\r\nMONTH_5=Cze.\r\n# XTIT: Month short header\r\nMONTH_6=Lip.\r\n# XTIT: Month short header\r\nMONTH_7=Sierpie\\u0144\r\n# XTIT: Month short header\r\nMONTH_8=Wrz.\r\n# XTIT: Month short header\r\nMONTH_9=Pa\\u017A.\r\n# XTIT: Month short header\r\nMONTH_10=Lis.\r\n# XTIT: Month short header\r\nMONTH_11=Gru.\r\n\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_0=Stycze\\u0144\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_1=Luty\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_2=Marzec\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_3=Kwiecie\\u0144\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_4=Maj\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_5=Czerwiec\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_6=Lipiec\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_7=Sierpie\\u0144\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_8=Wrzesie\\u0144\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_9=Pa\\u017Adziernik\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_10=Listopad\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_11=Grudzie\\u0144\r\n\r\n# XTIT: Legend missing day\r\nMISSING_DAY=Wymagana czynno\\u015B\\u0107 u\\u017Cytkownika\r\n# XTIT: Legend filled day\r\nFILLED_DAY=Gotowe\r\n# XTIT: Legend filled in process, manager action needed\r\nFILLED_MANAGER=Wymagana czynno\\u015B\\u0107 zatwierdzaj\\u0105cego\r\n# XFLD: Rejected by manager - this appears on the legend\r\nREJECTED=Odrzucone\r\n# XFLD: Legend future working day\r\nWORKING_DAY=Dzie\\u0144 roboczy\r\n# XFLD: Legend non-working day\r\nNON_WORKING_DAY=Dzie\\u0144 wolny\r\n\r\n# XMSG: Footer information about missing hours\r\nTOTAL_MISSING=Suma brakuj\\u0105cych godzin\\: {0}\r\n\r\n#XFLD:\r\nMONTH_YEAR={0} {1} ({2} godz.)\r\n\r\n#XBUT: Button\r\nSAVE=Zapisz\r\n\r\n#XBUT: Button \r\nSUBMIT=Przeka\\u017C\r\n\r\n#XBUT: Button for quick entry\r\nSMART_FILL=Wpis automatyczny\r\n\r\n# XMSG\r\nFILL_ALL=Wpisz {0} godz. dla\\:\r\n\r\n#XFLD\r\nNO_TASK_TYPE=Bez typu zadania\r\n\r\n#XFLD\r\nMISSING_DAYS=Brakuj\\u0105ce dni\\:{0}\r\n\r\n#XBUT: Button\r\nHOME=Strona g\\u0142\\u00F3wna\r\n\r\n#XTIT: confirmation header\r\nCONFIRMATION=Potwierdzenie\r\n\r\n#XTIT: deletion confirmation header\r\nDELETE_CONFIRMATION=Potwierd\\u017A usuwanie\r\n\r\n#XTIT: submission confirmation header\r\nSUBMISSION_CONFIRMATION=Potwierd\\u017A przesy\\u0142anie\r\n\r\n#XTIT: Draft submission confirmation header\r\nDRAFT_CONFIRMATION=Potwierd\\u017A projekt\r\n\r\n#XFLD: label for Deletion summary in Dialog\r\nDELETE_CONFIRMATION_SUMMARY=Podsumowanie wpis\\u00F3w czasu wybranych dla usuwania\r\n\r\n#XFLD: label for Submission summary in Dialog\r\nSUBMISSION_CONFIRMATION_SUMMARY=Podsumowanie wpis\\u00F3w czasu wybranych dla przesy\\u0142ania\r\n\r\n#XFLD: label for Draft Submission summary in Dialog\r\nDRAFT_CONFIRMATION_SUMMARY=Podsumowanie wybranych wpis\\u00F3w daty\r\n\r\n#XFLD: label for Number of entries in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_ENTRIES=Liczba wpis\\u00F3w\r\n\r\n#XFLD: label for Number of hours in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_HOURS=Liczba godzin\r\n\r\n#XBUT: Confirm Button\r\nCONFIRM=Potwierd\\u017A\r\n\r\n#XMSG: Summary for confirmation - these are two dates\r\nSUMMARY={0} - {1}\r\n\r\n#XFLD: Week \r\nWEEK=Tydzie\\u0144\r\n\r\n#XFLD:\r\nMEET_TARGET_HOURS=Zastosuj godziny do\\:\r\n\r\n#XBUT\r\nTHIS_WEEK=Bie\\u017C\\u0105cy tydzie\\u0144 ({0} godz.)\r\n\r\n#XBUT\r\nALL_MISSING=\\u0141\\u0105czny brakuj\\u0105cy czas({0} godz.)\r\n\r\n#XBUT: Delete Button Text\r\nDELETE=Usu\\u0144\r\n\r\n#XBUT: Add Button Text for Weekly Entry nav button\r\nNAV_ADD=Dodaj wpis\r\n\r\n#XFLD: label for duration\r\nDURATION=Czas trwania\r\n\r\n#XFLD: label for total duration\r\nTOTAL_DURATION=\\u0141\\u0105czny czas trwania\r\n\r\n#XFLD: label for status\r\nSTATUS=Status\r\n\r\n#XFLD: label for start time\r\nSTART_TIME=Czas rozpocz\\u0119cia\r\n\r\n#XFLD: label for end Time\r\nEND_TIME=Czas zako\\u0144czenia\r\n\r\n#XFLD: label for note\r\nNOTE=Notatka\r\n\r\n#XFLD: label for Add New week entry\r\nADD_NEW=Nowy wpis\r\n\r\n#XBUT: Done button\r\nDONE=Gotowe\r\n\r\n# XTIT: Recently Used\r\nRECENTLY_USED=Propozycje\r\n\r\n# XTIT: Manual Input Add\r\nMANUAL_INPUT_ADD=R\\u0119czny\r\n\r\n# XTIT: Manual Input Edit\r\nMANUAL_INPUT_EDIT=Edytuj wpis\r\n\r\n# XTIT: Cost Assignment\r\nCOST_ASSIGNMENT=Przypisanie czasu\r\n\r\n#XFLD: Tap to Load More\r\nTAP_TO_LOAD_MORE=Wczytaj wi\\u0119cej\r\n\r\n#XFLD: Tap to Load More Loading\r\nTAP_TO_LOAD_MORE_LOADING=Wczytywanie...\r\n\r\n#XFLD: Continue Search on Server\r\nCONTINUE_SEARCH_ON_SERVER=Kontynuuj szukanie na serwerze...\r\n\r\n#XFLD: Continue Search on Server Loading\r\nCONTINUE_SEARCH_ON_SERVER_LOADING=Wczytywanie...\r\n\r\n#XFLD: BLANK\r\nEMPTY=Puste\r\n\r\n#XFLD: None\r\nNONE=Brak\r\n\r\n# XTIT: Select\r\nSELECT=Wybierz {0}\r\n\r\n# XTIT: Placeholder for Cost Assignment Picker indicating Select action\r\nSELECT_PLACEHOLDER=Wybierz\r\n\r\n#XFLD: Placeholder for cost assignment type search\r\nSEARCH=Wyszukiwanie...\r\n\r\n#XFLD: short label for hours\r\nHOURS_LABEL=godz.\r\n\r\n#XFLD: short label for minutes\r\nMINUTES_LABEL=min\r\n\r\n#XFLD: full label for hours \r\nHOURS_LABEL_FULL=Godziny\r\n\r\n#XFLD: full label for minutes\r\nMINUTES_LABEL_FULL=Minuty\r\n\r\n#XFLD: label for date. When localizing do not change the MMM DD or YYYY, just the order of them\r\nDATE_LOCALE=DD MMM YYYY\r\n\r\n\r\n#XBUT:\r\nDETAIL=Szczeg\\u00F3\\u0142y\r\n\r\n\r\n#XFLD: label for Settings title\r\nSETTINGS_TITLE=Ustawienia\r\n#XFLD: label for Settings data entry profile\r\nSETTINGS_DATA_ENTRY_PROFILE=Profil wprowadzania danych\r\n#XFLD: label for Settings pre-fill label\r\nSETTINGS_PREFILL_LAST_WEEK=Automatyczna propozycja\r\n\r\n# XMSG: \r\nCONFIRM_LEAVE_PAGE=Wszystkie niezapisane dane zostan\\u0105 odrzucone. Czy na pewno chcesz kontynuowa\\u0107?\r\n# XTIT: \r\nUNSAVED_CHANGES=Niezapisane zmiany\r\n\r\n#XMSG: toast message for successful submit\r\nSUBMIT_SUCCESS=Zapytanie przes\\u0142ane\r\n\r\n#XMSG: toast message for successful draft submit\r\nDRAFT_SUCCESS=Pomy\\u015Blnie zapisano projekt\r\n\r\n#XBUT:\r\nHELP=Pomoc\r\n\r\n#XMSG: confirmation message for week entry\r\nTOTAL_BOOKED={0}/Wprowadzono {1} godz. dla tego tygodnia.\r\n\r\n#XMSG: help text for pre-fill option\r\nHELP_PREFILL=W\\u0142\\u0105cz wst\\u0119pne wype\\u0142nianie, aby szybko wype\\u0142ni\\u0107 godziny dla tygodnia w oparciu o ostatni pomy\\u015Blny wpis\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT_AUTO_ENTRY=Przesy\\u0142anie nie powiod\\u0142o si\\u0119; sprawd\\u017A szczeg\\u00F3\\u0142y b\\u0142\\u0119du i spr\\u00F3buj ponownie\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT=Niekt\\u00F3re wpisy s\\u0105 nieprawid\\u0142owe. Sprawd\\u017A szczeg\\u00F3\\u0142y b\\u0142\\u0119d\\u00F3w i spr\\u00F3buj ponownie.\r\n\r\n#XMSG: error pop-up message text\r\nSUBMIT_HEADER_TEXT=Wpis daty dla {0} i {1} dni wi\\u0119cej\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_EDIT_ENTRY_TITLE_SCREEN=Edytuj wpis daty\r\n\r\n#XMSG: Header in edit screen for single date\r\nSUBMIT_HEADER_TEXT_SINGLE=Wpis daty dla {0}\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nFULL_CONCATENATE_HOURSMIN={0} godz. {1} min\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nSHORT_CONCATENATE_HOURSMIN={0} godz. {1} min\r\n\r\n#XBUT: Button to reset\r\nRESET=Resetuj\r\n\r\n#XBUT: Button to create\r\nCREATE=Utw\\u00F3rz\r\n',
	"hcm/emp/mytimesheet/i18n/i18n_pt.properties":'\r\n#XFLD: label for from time\r\nFROM=De\r\n\r\n#XFLD: label for to time\r\nTO=At\\u00E9\r\n\r\n#XBUT: Button to cancel\r\nCANCEL=Cancelar\r\n\r\n#XBUT: Button to close popover\r\nCLOSE=Fechar\r\n\r\n#XBUT: Button to accept\r\nOK=OK\r\n\r\n#XBUT: Button to Save Draft\r\nSAVE_DRAFT=Gravar esbo\\u00E7o\r\n\r\n# XTIT: \r\nTIMESHEET_TITLE=Minha folha de horas\r\n\r\n# XTIT: \r\nTIMESHEET=Entradas da folha de horas\r\n\r\n# XTIT: \r\nWEEKENTRY_TITLE=Entrada manual\r\n\r\n#XBUT: Button for quick entry\r\nQUICK_FILL=Entrada r\\u00E1pida\r\n\r\n# XFLD: Apply to\r\nENTRY_VIEW_APPLY_TO=Aplicar a\r\n\r\n# XTIT: \r\nTIMESHEET_DETAILS_TITLE=Detalhes\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_CREATE_ENTRY_TITLE=Criar registro de tempos\r\n\r\n# XTIT: Title for create entry view with multiple days selected\r\nTIMESHEET_CREATE_ENTRIES_TITLE=Criar entrada para {0} dias\r\n\r\n# XTIT: Title for Entry Details\r\nENTRY_DETAILS=Detalhes da entrada\r\n\r\n# XTIT: Title for edit entry view for a particular date ({0} = date)\r\nTIMESHEET_EDIT_ENTRY_TITLE=Detalhes de entrada para {0}\r\n\r\n# XTIT: Title for create entry view for a particular date ({0} = date)\r\nTIMESHEET_NEW_ENTRY_TITLE=Criar entrada para {0}\r\n\r\n# XTIT: Month short header\r\nMONTH_0=Jan.\r\n# XTIT: Month short header\r\nMONTH_1=Fev.\r\n# XTIT: Month short header\r\nMONTH_2=Mar.\r\n# XTIT: Month short header\r\nMONTH_3=Abr.\r\n# XTIT: Month short header\r\nMONTH_4=Maio\r\n# XTIT: Month short header\r\nMONTH_5=Junho\r\n# XTIT: Month short header\r\nMONTH_6=Julho\r\n# XTIT: Month short header\r\nMONTH_7=Ago.\r\n# XTIT: Month short header\r\nMONTH_8=Set.\r\n# XTIT: Month short header\r\nMONTH_9=Out.\r\n# XTIT: Month short header\r\nMONTH_10=Nov.\r\n# XTIT: Month short header\r\nMONTH_11=Dez.\r\n\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_0=Janeiro\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_1=Fevereiro\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_2=Mar\\u00E7o\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_3=Abril\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_4=Maio\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_5=Junho\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_6=Julho\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_7=Agosto\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_8=Setembro\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_9=Outubro\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_10=Novembro\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_11=Dezembro\r\n\r\n# XTIT: Legend missing day\r\nMISSING_DAY=Sua a\\u00E7\\u00E3o necess\\u00E1ria\r\n# XTIT: Legend filled day\r\nFILLED_DAY=Conclu\\u00EDdo\r\n# XTIT: Legend filled in process, manager action needed\r\nFILLED_MANAGER=Aprova\\u00E7\\u00E3o necess\\u00E1ria\r\n# XFLD: Rejected by manager - this appears on the legend\r\nREJECTED=Rejeitadas\r\n# XFLD: Legend future working day\r\nWORKING_DAY=Dia de trabalho\r\n# XFLD: Legend non-working day\r\nNON_WORKING_DAY=Dia livre\r\n\r\n# XMSG: Footer information about missing hours\r\nTOTAL_MISSING=Total de horas em falta\\: {0}\r\n\r\n#XFLD:\r\nMONTH_YEAR={0} {1} ({2} horas)\r\n\r\n#XBUT: Button\r\nSAVE=Gravar\r\n\r\n#XBUT: Button \r\nSUBMIT=Enviar\r\n\r\n#XBUT: Button for quick entry\r\nSMART_FILL=Entrada autom.\r\n\r\n# XMSG\r\nFILL_ALL=Inserir {0} horas para\\:\r\n\r\n#XFLD\r\nNO_TASK_TYPE=Nenhum tipo de tarefa\r\n\r\n#XFLD\r\nMISSING_DAYS=Dias em falta\\: {0}\r\n\r\n#XBUT: Button\r\nHOME=In\\u00EDcio\r\n\r\n#XTIT: confirmation header\r\nCONFIRMATION=Confirma\\u00E7\\u00E3o\r\n\r\n#XTIT: deletion confirmation header\r\nDELETE_CONFIRMATION=Confirmar exclus\\u00E3o\r\n\r\n#XTIT: submission confirmation header\r\nSUBMISSION_CONFIRMATION=Confirmar envio\r\n\r\n#XTIT: Draft submission confirmation header\r\nDRAFT_CONFIRMATION=Confirmar esbo\\u00E7o\r\n\r\n#XFLD: label for Deletion summary in Dialog\r\nDELETE_CONFIRMATION_SUMMARY=Resumo de entradas de tempos selecionado para exclus\\u00E3o\r\n\r\n#XFLD: label for Submission summary in Dialog\r\nSUBMISSION_CONFIRMATION_SUMMARY=Resumo de entradas de tempos selecionado para envio\r\n\r\n#XFLD: label for Draft Submission summary in Dialog\r\nDRAFT_CONFIRMATION_SUMMARY=Resumo de entradas de horas selecionadas\r\n\r\n#XFLD: label for Number of entries in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_ENTRIES=N\\u00BA de entradas\r\n\r\n#XFLD: label for Number of hours in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_HOURS=N\\u00FAmero de horas\r\n\r\n#XBUT: Confirm Button\r\nCONFIRM=Confirmar\r\n\r\n#XMSG: Summary for confirmation - these are two dates\r\nSUMMARY={0} - {1}\r\n\r\n#XFLD: Week \r\nWEEK=Semana\r\n\r\n#XFLD:\r\nMEET_TARGET_HOURS=Aplicar horas a\\:\r\n\r\n#XBUT\r\nTHIS_WEEK=Semana atual ({0} horas)\r\n\r\n#XBUT\r\nALL_MISSING=Todas as horas em falta ({0} horas)\r\n\r\n#XBUT: Delete Button Text\r\nDELETE=Excluir\r\n\r\n#XBUT: Add Button Text for Weekly Entry nav button\r\nNAV_ADD=Inserir entr.\r\n\r\n#XFLD: label for duration\r\nDURATION=Dura\\u00E7\\u00E3o\r\n\r\n#XFLD: label for total duration\r\nTOTAL_DURATION=Dura\\u00E7\\u00E3o total\r\n\r\n#XFLD: label for status\r\nSTATUS=Status\r\n\r\n#XFLD: label for start time\r\nSTART_TIME=Hora de in\\u00EDcio\r\n\r\n#XFLD: label for end Time\r\nEND_TIME=Hora de fim\r\n\r\n#XFLD: label for note\r\nNOTE=Nota\r\n\r\n#XFLD: label for Add New week entry\r\nADD_NEW=Nova entrada\r\n\r\n#XBUT: Done button\r\nDONE=Conclu\\u00EDdo\r\n\r\n# XTIT: Recently Used\r\nRECENTLY_USED=Sugest\\u00F5es\r\n\r\n# XTIT: Manual Input Add\r\nMANUAL_INPUT_ADD=Manual\r\n\r\n# XTIT: Manual Input Edit\r\nMANUAL_INPUT_EDIT=Processar entrada\r\n\r\n# XTIT: Cost Assignment\r\nCOST_ASSIGNMENT=Atribui\\u00E7\\u00E3o de tempo\r\n\r\n#XFLD: Tap to Load More\r\nTAP_TO_LOAD_MORE=Carregar mais\r\n\r\n#XFLD: Tap to Load More Loading\r\nTAP_TO_LOAD_MORE_LOADING=Carregando...\r\n\r\n#XFLD: Continue Search on Server\r\nCONTINUE_SEARCH_ON_SERVER=Continuar procura no servidor...\r\n\r\n#XFLD: Continue Search on Server Loading\r\nCONTINUE_SEARCH_ON_SERVER_LOADING=Carregando...\r\n\r\n#XFLD: BLANK\r\nEMPTY=Vazio\r\n\r\n#XFLD: None\r\nNONE=Nenhum\r\n\r\n# XTIT: Select\r\nSELECT=Selecionar {0}\r\n\r\n# XTIT: Placeholder for Cost Assignment Picker indicating Select action\r\nSELECT_PLACEHOLDER=Selecionar\r\n\r\n#XFLD: Placeholder for cost assignment type search\r\nSEARCH=Procurando...\r\n\r\n#XFLD: short label for hours\r\nHOURS_LABEL=h\r\n\r\n#XFLD: short label for minutes\r\nMINUTES_LABEL=m\r\n\r\n#XFLD: full label for hours \r\nHOURS_LABEL_FULL=Horas\r\n\r\n#XFLD: full label for minutes\r\nMINUTES_LABEL_FULL=Minutos\r\n\r\n#XFLD: label for date. When localizing do not change the MMM DD or YYYY, just the order of them\r\nDATE_LOCALE=MMM DD, AAAA\r\n\r\n\r\n#XBUT:\r\nDETAIL=Detalhes\r\n\r\n\r\n#XFLD: label for Settings title\r\nSETTINGS_TITLE=Configura\\u00E7\\u00F5es\r\n#XFLD: label for Settings data entry profile\r\nSETTINGS_DATA_ENTRY_PROFILE=Perfil de entrada de dados\r\n#XFLD: label for Settings pre-fill label\r\nSETTINGS_PREFILL_LAST_WEEK=Predefinir\r\n\r\n# XMSG: \r\nCONFIRM_LEAVE_PAGE=Todo dado n\\u00E3o gravado ser\\u00E1 rejeitado. Continuar?\r\n# XTIT: \r\nUNSAVED_CHANGES=Modifica\\u00E7\\u00F5es n\\u00E3o gravadas\r\n\r\n#XMSG: toast message for successful submit\r\nSUBMIT_SUCCESS=Solicita\\u00E7\\u00E3o enviada\r\n\r\n#XMSG: toast message for successful draft submit\r\nDRAFT_SUCCESS=Esbo\\u00E7o gravado com \\u00EAxito\r\n\r\n#XBUT:\r\nHELP=Ajuda\r\n\r\n#XMSG: confirmation message for week entry\r\nTOTAL_BOOKED={0}/{1} horas inseridas para essa semana.\r\n\r\n#XMSG: help text for pre-fill option\r\nHELP_PREFILL=Ativar predefini\\u00E7\\u00E3o para preencher rapidamente horas para semana com base em sua \\u00FAltima entrada correta\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT_AUTO_ENTRY=Erro ao enviar; verificar detalhes do erro e tentar novamente\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT=Algumas entradas est\\u00E3o incorretas. Verificar detalhes de erro e tentar novamente.\r\n\r\n#XMSG: error pop-up message text\r\nSUBMIT_HEADER_TEXT=Entrada de tempos para {0} e {1} mais dia(s)\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_EDIT_ENTRY_TITLE_SCREEN=Editar registro de tempos\r\n\r\n#XMSG: Header in edit screen for single date\r\nSUBMIT_HEADER_TEXT_SINGLE=Entrada de tempo para {0}\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nFULL_CONCATENATE_HOURSMIN={0} horas e {1} minutos\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nSHORT_CONCATENATE_HOURSMIN={0} h {1} m\r\n\r\n#XBUT: Button to reset\r\nRESET=Reinicializar\r\n\r\n#XBUT: Button to create\r\nCREATE=Criar\r\n',
	"hcm/emp/mytimesheet/i18n/i18n_ru.properties":'\r\n#XFLD: label for from time\r\nFROM=\\u0421\r\n\r\n#XFLD: label for to time\r\nTO=\\u041F\\u043E\r\n\r\n#XBUT: Button to cancel\r\nCANCEL=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XBUT: Button to close popover\r\nCLOSE=\\u0417\\u0430\\u043A\\u0440\\u044B\\u0442\\u044C\r\n\r\n#XBUT: Button to accept\r\nOK=\\u041E\\u041A\r\n\r\n#XBUT: Button to Save Draft\r\nSAVE_DRAFT=\\u0421\\u043E\\u0445\\u0440. \\u0447\\u0435\\u0440\\u043D\\u043E\\u0432\\u0438\\u043A\r\n\r\n# XTIT: \r\nTIMESHEET_TITLE=\\u041C\\u043E\\u0439 \\u0442\\u0430\\u0431\\u0435\\u043B\\u044C\r\n\r\n# XTIT: \r\nTIMESHEET=\\u0417\\u0430\\u043F\\u0438\\u0441\\u0438 \\u0432 \\u0442\\u0430\\u0431\\u0435\\u043B\\u0435\r\n\r\n# XTIT: \r\nWEEKENTRY_TITLE=\\u0420\\u0443\\u0447\\u043D\\u043E\\u0439 \\u0432\\u0432\\u043E\\u0434\r\n\r\n#XBUT: Button for quick entry\r\nQUICK_FILL=\\u0411\\u044B\\u0441\\u0442\\u0440\\u044B\\u0439 \\u0432\\u0432\\u043E\\u0434\r\n\r\n# XFLD: Apply to\r\nENTRY_VIEW_APPLY_TO=\\u041F\\u0440\\u0438\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C \\u043A\r\n\r\n# XTIT: \r\nTIMESHEET_DETAILS_TITLE=\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u043E\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_CREATE_ENTRY_TITLE=\\u0421\\u043E\\u0437\\u0434\\u0430\\u0442\\u044C \\u0437\\u0430\\u043F\\u0438\\u0441\\u044C \\u0432\\u0440\\u0435\\u043C\\u0435\\u043D\\u0438\r\n\r\n# XTIT: Title for create entry view with multiple days selected\r\nTIMESHEET_CREATE_ENTRIES_TITLE=\\u0421\\u043E\\u0437\\u0434\\u0430\\u0442\\u044C \\u0437\\u0430\\u043F\\u0438\\u0441\\u044C \\u0434\\u043B\\u044F {0} \\u0434\\u043D.\r\n\r\n# XTIT: Title for Entry Details\r\nENTRY_DETAILS=\\u0417\\u0430\\u043F\\u0438\\u0441\\u044C \\u043F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u043E\r\n\r\n# XTIT: Title for edit entry view for a particular date ({0} = date)\r\nTIMESHEET_EDIT_ENTRY_TITLE=\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u043E\\u0441\\u0442\\u0438 \\u0437\\u0430\\u043F\\u0438\\u0441\\u0438 \\u0434\\u043B\\u044F {0}\r\n\r\n# XTIT: Title for create entry view for a particular date ({0} = date)\r\nTIMESHEET_NEW_ENTRY_TITLE=\\u0421\\u043E\\u0437\\u0434\\u0430\\u0442\\u044C \\u0437\\u0430\\u043F\\u0438\\u0441\\u044C \\u0434\\u043B\\u044F {0}\r\n\r\n# XTIT: Month short header\r\nMONTH_0=\\u042F\\u043D\\u0432\\u0430\\u0440\\u044C\r\n# XTIT: Month short header\r\nMONTH_1=\\u0424\\u0435\\u0432\\u0440\\u0430\\u043B\\u044C\r\n# XTIT: Month short header\r\nMONTH_2=\\u041C\\u0430\\u0440\\u0442\r\n# XTIT: Month short header\r\nMONTH_3=\\u0410\\u043F\\u0440\\u0435\\u043B\\u044C\r\n# XTIT: Month short header\r\nMONTH_4=\\u041C\\u0430\\u0439\r\n# XTIT: Month short header\r\nMONTH_5=\\u0418\\u044E\\u043D\\u044C\r\n# XTIT: Month short header\r\nMONTH_6=\\u0418\\u044E\\u043B\\u044C\r\n# XTIT: Month short header\r\nMONTH_7=\\u0410\\u0432\\u0433\\u0443\\u0441\\u0442\r\n# XTIT: Month short header\r\nMONTH_8=\\u0421\\u0435\\u043D\\u0442\\u044F\\u0431\\u0440\\u044C\r\n# XTIT: Month short header\r\nMONTH_9=\\u041E\\u043A\\u0442\\u044F\\u0431\\u0440\\u044C\r\n# XTIT: Month short header\r\nMONTH_10=\\u041D\\u043E\\u044F\r\n# XTIT: Month short header\r\nMONTH_11=\\u0414\\u0435\\u043A\r\n\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_0=\\u042F\\u043D\\u0432\\u0430\\u0440\\u044C\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_1=\\u0424\\u0435\\u0432\\u0440\\u0430\\u043B\\u044C\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_2=\\u041C\\u0430\\u0440\\u0442\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_3=\\u0410\\u043F\\u0440\\u0435\\u043B\\u044C\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_4=\\u041C\\u0430\\u0439\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_5=\\u0418\\u044E\\u043D\\u044C\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_6=\\u0418\\u044E\\u043B\\u044C\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_7=\\u0410\\u0432\\u0433\\u0443\\u0441\\u0442\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_8=\\u0421\\u0435\\u043D\\u0442\\u044F\\u0431\\u0440\\u044C\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_9=\\u041E\\u043A\\u0442\\u044F\\u0431\\u0440\\u044C\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_10=\\u041D\\u043E\\u044F\\u0431\\u0440\\u044C\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_11=\\u0414\\u0435\\u043A\\u0430\\u0431\\u0440\\u044C\r\n\r\n# XTIT: Legend missing day\r\nMISSING_DAY=\\u0422\\u0440\\u0435\\u0431\\u0443\\u0435\\u0442\\u0441\\u044F \\u0432\\u0430\\u0448\\u0435 \\u0434\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u0435\r\n# XTIT: Legend filled day\r\nFILLED_DAY=\\u0413\\u043E\\u0442\\u043E\\u0432\\u043E\r\n# XTIT: Legend filled in process, manager action needed\r\nFILLED_MANAGER=\\u0422\\u0440\\u0435\\u0431\\u0443\\u0435\\u0442\\u0441\\u044F \\u0434\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u0435 \\u0443\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0430\\u044E\\u0449\\u0435\\u0433\\u043E\r\n# XFLD: Rejected by manager - this appears on the legend\r\nREJECTED=\\u041E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0435\\u043D\\u043E\r\n# XFLD: Legend future working day\r\nWORKING_DAY=\\u0420\\u0430\\u0431\\u043E\\u0447\\u0438\\u0439 \\u0434\\u0435\\u043D\\u044C\r\n# XFLD: Legend non-working day\r\nNON_WORKING_DAY=\\u041D\\u0435\\u0440\\u0430\\u0431\\u043E\\u0447\\u0438\\u0439 \\u0434\\u0435\\u043D\\u044C\r\n\r\n# XMSG: Footer information about missing hours\r\nTOTAL_MISSING=\\u041E\\u0431\\u0449\\u0435\\u0435 \\u043A\\u043E\\u043B\\u0438\\u0447\\u0435\\u0441\\u0442\\u0432\\u043E \\u0447\\u0430\\u0441\\u043E\\u0432 \\u043E\\u0442\\u0441\\u0443\\u0442\\u0441\\u0442\\u0432\\u0438\\u044F\\: {0}\r\n\r\n#XFLD:\r\nMONTH_YEAR={0} {1} ({2} \\u0447)\r\n\r\n#XBUT: Button\r\nSAVE=\\u0421\\u043E\\u0445\\u0440\\u0430\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XBUT: Button \r\nSUBMIT=\\u041E\\u0442\\u043F\\u0440\\u0430\\u0432\\u0438\\u0442\\u044C\r\n\r\n#XBUT: Button for quick entry\r\nSMART_FILL=\\u0410\\u0432\\u0442\\u043E\\u0432\\u0432\\u043E\\u0434\r\n\r\n# XMSG\r\nFILL_ALL=\\u0412\\u0432\\u0435\\u0441\\u0442\\u0438 {0} \\u0447 \\u0434\\u043B\\u044F\\:\r\n\r\n#XFLD\r\nNO_TASK_TYPE=\\u041D\\u0435\\u0442 \\u0442\\u0438\\u043F\\u0430 \\u0437\\u0430\\u0434\\u0430\\u0447\r\n\r\n#XFLD\r\nMISSING_DAYS=\\u0414\\u043D\\u0438 \\u043E\\u0442\\u0441\\u0443\\u0442\\u0441\\u0442\\u0432\\u0438\\u044F\\:{0}\r\n\r\n#XBUT: Button\r\nHOME=Home\r\n\r\n#XTIT: confirmation header\r\nCONFIRMATION=\\u041F\\u043E\\u0434\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435\r\n\r\n#XTIT: deletion confirmation header\r\nDELETE_CONFIRMATION=\\u041F\\u043E\\u0434\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435 \\u0443\\u0434\\u0430\\u043B\\u0435\\u043D\\u0438\\u044F\r\n\r\n#XTIT: submission confirmation header\r\nSUBMISSION_CONFIRMATION=\\u041F\\u043E\\u0434\\u0442\\u0432\\u0435\\u0440\\u0434\\u0438\\u0442\\u044C \\u043E\\u0442\\u043F\\u0440\\u0430\\u0432\\u043A\\u0443\r\n\r\n#XTIT: Draft submission confirmation header\r\nDRAFT_CONFIRMATION=\\u041F\\u043E\\u0434\\u0442\\u0432\\u0435\\u0440\\u0434\\u0438\\u0442\\u044C \\u0447\\u0435\\u0440\\u043D\\u043E\\u0432\\u0438\\u043A\r\n\r\n#XFLD: label for Deletion summary in Dialog\r\nDELETE_CONFIRMATION_SUMMARY=\\u041E\\u0431\\u0437\\u043E\\u0440 \\u0432\\u044B\\u0431\\u0440\\u0430\\u043D\\u043D\\u044B\\u0445 \\u0437\\u0430\\u043F\\u0438\\u0441\\u0435\\u0439 \\u0432\\u0440\\u0435\\u043C\\u0435\\u043D\\u0438 \\u0434\\u043B\\u044F \\u0443\\u0434\\u0430\\u043B\\u0435\\u043D\\u0438\\u044F\r\n\r\n#XFLD: label for Submission summary in Dialog\r\nSUBMISSION_CONFIRMATION_SUMMARY=\\u041E\\u0431\\u0437\\u043E\\u0440 \\u0432\\u044B\\u0431\\u0440\\u0430\\u043D\\u043D\\u044B\\u0445 \\u0437\\u0430\\u043F\\u0438\\u0441\\u0435\\u0439 \\u0432\\u0440\\u0435\\u043C\\u0435\\u043D\\u0438 \\u0434\\u043B\\u044F \\u043E\\u0442\\u043F\\u0440\\u0430\\u0432\\u043A\\u0438\r\n\r\n#XFLD: label for Draft Submission summary in Dialog\r\nDRAFT_CONFIRMATION_SUMMARY=\\u041E\\u0431\\u0437\\u043E\\u0440 \\u0432\\u044B\\u0431\\u0440\\u0430\\u043D\\u043D\\u044B\\u0445 \\u0437\\u0430\\u043F\\u0438\\u0441\\u0435\\u0439 \\u0432\\u0440\\u0435\\u043C\\u0435\\u043D\\u0438\r\n\r\n#XFLD: label for Number of entries in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_ENTRIES=\\u041A\\u043E\\u043B\\u0438\\u0447\\u0435\\u0441\\u0442\\u0432\\u043E \\u0437\\u0430\\u043F\\u0438\\u0441\\u0435\\u0439\r\n\r\n#XFLD: label for Number of hours in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_HOURS=\\u041A\\u043E\\u043B\\u0438\\u0447\\u0435\\u0441\\u0442\\u0432\\u043E \\u0447\\u0430\\u0441\\u043E\\u0432\r\n\r\n#XBUT: Confirm Button\r\nCONFIRM=\\u041F\\u043E\\u0434\\u0442\\u0432\\u0435\\u0440\\u0434\\u0438\\u0442\\u044C\r\n\r\n#XMSG: Summary for confirmation - these are two dates\r\nSUMMARY={0} - {1}\r\n\r\n#XFLD: Week \r\nWEEK=\\u041D\\u0435\\u0434\\u0435\\u043B\\u044F\r\n\r\n#XFLD:\r\nMEET_TARGET_HOURS=\\u041F\\u0440\\u0438\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C \\u0447\\u0430\\u0441\\u044B \\u043A\\:\r\n\r\n#XBUT\r\nTHIS_WEEK=\\u0422\\u0435\\u043A\\u0443\\u0449\\u0430\\u044F \\u043D\\u0435\\u0434\\u0435\\u043B\\u044F ({0} \\u0447)\r\n\r\n#XBUT\r\nALL_MISSING=\\u0412\\u0441\\u0435 \\u0432\\u0440\\u0435\\u043C\\u044F \\u043E\\u0442\\u0441\\u0443\\u0442\\u0441\\u0442\\u0432\\u0438\\u044F ({0} \\u0447)\r\n\r\n#XBUT: Delete Button Text\r\nDELETE=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C\r\n\r\n#XBUT: Add Button Text for Weekly Entry nav button\r\nNAV_ADD=\\u0414\\u043E\\u0431\\u0430\\u0432. \\u0437\\u0430\\u043F\\u0438\\u0441\\u044C\r\n\r\n#XFLD: label for duration\r\nDURATION=\\u0414\\u043B\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u043E\\u0441\\u0442\\u044C\r\n\r\n#XFLD: label for total duration\r\nTOTAL_DURATION=\\u041E\\u0431\\u0449\\u0430\\u044F \\u043F\\u0440\\u043E\\u0434\\u043E\\u043B\\u0436\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u043E\\u0441\\u0442\\u044C\r\n\r\n#XFLD: label for status\r\nSTATUS=\\u0421\\u0442\\u0430\\u0442\\u0443\\u0441\r\n\r\n#XFLD: label for start time\r\nSTART_TIME=\\u0412\\u0440\\u0435\\u043C\\u044F \\u043D\\u0430\\u0447\\u0430\\u043B\\u0430\r\n\r\n#XFLD: label for end Time\r\nEND_TIME=\\u0412\\u0440\\u0435\\u043C\\u044F \\u0437\\u0430\\u0432\\u0435\\u0440\\u0448\\u0435\\u043D\\u0438\\u044F\r\n\r\n#XFLD: label for note\r\nNOTE=\\u041F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u0435\r\n\r\n#XFLD: label for Add New week entry\r\nADD_NEW=\\u041D\\u043E\\u0432\\u0430\\u044F \\u0437\\u0430\\u043F\\u0438\\u0441\\u044C\r\n\r\n#XBUT: Done button\r\nDONE=\\u0413\\u043E\\u0442\\u043E\\u0432\\u043E\r\n\r\n# XTIT: Recently Used\r\nRECENTLY_USED=\\u041F\\u0440\\u0435\\u0434\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F\r\n\r\n# XTIT: Manual Input Add\r\nMANUAL_INPUT_ADD=\\u0412\\u0440\\u0443\\u0447\\u043D\\u0443\\u044E\r\n\r\n# XTIT: Manual Input Edit\r\nMANUAL_INPUT_EDIT=\\u041E\\u0431\\u0440\\u0430\\u0431\\u043E\\u0442\\u0430\\u0442\\u044C \\u0437\\u0430\\u043F\\u0438\\u0441\\u044C\r\n\r\n# XTIT: Cost Assignment\r\nCOST_ASSIGNMENT=\\u041F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0435\\u043D\\u0438\\u0435 \\u0432\\u0440\\u0435\\u043C\\u0435\\u043D\\u0438\r\n\r\n#XFLD: Tap to Load More\r\nTAP_TO_LOAD_MORE=\\u0417\\u0430\\u0433\\u0440\\u0443\\u0437\\u0438\\u0442\\u044C \\u0435\\u0449\\u0435\r\n\r\n#XFLD: Tap to Load More Loading\r\nTAP_TO_LOAD_MORE_LOADING=\\u0417\\u0430\\u0433\\u0440\\u0443\\u0437\\u043A\\u0430...\r\n\r\n#XFLD: Continue Search on Server\r\nCONTINUE_SEARCH_ON_SERVER=\\u041F\\u0440\\u043E\\u0434\\u043E\\u043B\\u0436\\u0438\\u0442\\u044C \\u043F\\u043E\\u0438\\u0441\\u043A \\u043D\\u0430 \\u0441\\u0435\\u0440\\u0432\\u0435\\u0440\\u0435...\r\n\r\n#XFLD: Continue Search on Server Loading\r\nCONTINUE_SEARCH_ON_SERVER_LOADING=\\u0417\\u0430\\u0433\\u0440\\u0443\\u0437\\u043A\\u0430...\r\n\r\n#XFLD: BLANK\r\nEMPTY=\\u041F\\u0443\\u0441\\u0442\\u043E\r\n\r\n#XFLD: None\r\nNONE=\\u041D\\u0435\\u0442\r\n\r\n# XTIT: Select\r\nSELECT=\\u0412\\u044B\\u0431\\u0440\\u0430\\u0442\\u044C {0}\r\n\r\n# XTIT: Placeholder for Cost Assignment Picker indicating Select action\r\nSELECT_PLACEHOLDER=\\u0412\\u044B\\u0431\\u0440\\u0430\\u0442\\u044C\r\n\r\n#XFLD: Placeholder for cost assignment type search\r\nSEARCH=\\u041F\\u043E\\u0438\\u0441\\u043A...\r\n\r\n#XFLD: short label for hours\r\nHOURS_LABEL=\\u0447\r\n\r\n#XFLD: short label for minutes\r\nMINUTES_LABEL=\\u043C\\u0438\\u043D\r\n\r\n#XFLD: full label for hours \r\nHOURS_LABEL_FULL=\\u0427\\u0430\\u0441\\u044B\r\n\r\n#XFLD: full label for minutes\r\nMINUTES_LABEL_FULL=\\u041C\\u0438\\u043D\\u0443\\u0442\\u044B\r\n\r\n#XFLD: label for date. When localizing do not change the MMM DD or YYYY, just the order of them\r\nDATE_LOCALE=DD MMM YYYY\r\n\r\n\r\n#XBUT:\r\nDETAIL=\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u043E\r\n\r\n\r\n#XFLD: label for Settings title\r\nSETTINGS_TITLE=\\u041D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438\r\n#XFLD: label for Settings data entry profile\r\nSETTINGS_DATA_ENTRY_PROFILE=\\u041F\\u0440\\u043E\\u0444\\u0438\\u043B\\u044C \\u0437\\u0430\\u043F\\u0438\\u0441\\u0438\r\n#XFLD: label for Settings pre-fill label\r\nSETTINGS_PREFILL_LAST_WEEK=\\u0410\\u0432\\u0442\\u043E\\u043F\\u0440\\u0435\\u0434\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0435\r\n\r\n# XMSG: \r\nCONFIRM_LEAVE_PAGE=\\u0412\\u0441\\u0435 \\u043D\\u0435\\u0441\\u043E\\u0445\\u0440\\u0430\\u043D\\u0435\\u043D\\u043D\\u044B\\u0435 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0435 \\u0431\\u0443\\u0434\\u0443\\u0442 \\u043F\\u043E\\u0442\\u0435\\u0440\\u044F\\u043D\\u044B. \\u041F\\u0440\\u043E\\u0434\\u043E\\u043B\\u0436\\u0438\\u0442\\u044C?\r\n# XTIT: \r\nUNSAVED_CHANGES=\\u041D\\u0435\\u0441\\u043E\\u0445\\u0440\\u0430\\u043D\\u0435\\u043D\\u043D\\u044B\\u0435 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F\r\n\r\n#XMSG: toast message for successful submit\r\nSUBMIT_SUCCESS=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u043F\\u043E\\u0434\\u0430\\u043D\\u0430\r\n\r\n#XMSG: toast message for successful draft submit\r\nDRAFT_SUCCESS=\\u0427\\u0435\\u0440\\u043D\\u043E\\u0432\\u0438\\u043A \\u0441\\u043E\\u0445\\u0440\\u0430\\u043D\\u0435\\u043D\r\n\r\n#XBUT:\r\nHELP=\\u0421\\u043F\\u0440\\u0430\\u0432\\u043A\\u0430\r\n\r\n#XMSG: confirmation message for week entry\r\nTOTAL_BOOKED={0}/{1} \\u0447 \\u0432\\u0432\\u0435\\u0434\\u0435\\u043D\\u043E \\u0434\\u043B\\u044F \\u044D\\u0442\\u043E\\u0439 \\u043D\\u0435\\u0434\\u0435\\u043B\\u0438.\r\n\r\n#XMSG: help text for pre-fill option\r\nHELP_PREFILL=\\u0412\\u043A\\u043B\\u044E\\u0447\\u0438\\u0442\\u044C \\u0410\\u0432\\u0442\\u043E\\u0437\\u0430\\u043F\\u043E\\u043B\\u043D\\u0435\\u043D\\u0438\\u0435 \\u0434\\u043B\\u044F \\u0431\\u044B\\u0441\\u0442\\u0440\\u043E\\u0433\\u043E \\u0437\\u0430\\u043F\\u043E\\u043B\\u043D\\u0435\\u043D\\u0438\\u044F \\u0447\\u0430\\u0441\\u043E\\u0432 \\u0434\\u043B\\u044F \\u043D\\u0435\\u0434\\u0435\\u043B\\u0438 \\u043D\\u0430 \\u043E\\u0441\\u043D\\u043E\\u0432\\u0435 \\u043F\\u043E\\u0441\\u043B\\u0435\\u0434\\u043D\\u0438\\u0445 \\u0437\\u0430\\u043F\\u0438\\u0441\\u0435\\u0439\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT_AUTO_ENTRY=\\u041F\\u0435\\u0440\\u0435\\u0434\\u0430\\u0447\\u0430 \\u043D\\u0435 \\u0432\\u044B\\u043F\\u043E\\u043B\\u043D\\u0435\\u043D\\u0430; \\u0438\\u0437\\u0443\\u0447\\u0438\\u0442\\u0435 \\u0441\\u0432\\u0435\\u0434\\u0435\\u043D\\u0438\\u044F \\u043E\\u0431 \\u043E\\u0448\\u0438\\u0431\\u043A\\u0435 \\u0438 \\u043F\\u043E\\u0432\\u0442\\u043E\\u0440\\u0438\\u0442\\u0435 \\u043F\\u043E\\u043F\\u044B\\u0442\\u043A\\u0443\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT=\\u041D\\u0435\\u043A\\u043E\\u0442\\u043E\\u0440\\u044B\\u0435 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0435 \\u043D\\u0435\\u043A\\u043E\\u0440\\u0440\\u0435\\u043A\\u0442\\u043D\\u044B. \\u0418\\u0437\\u0443\\u0447\\u0438\\u0442\\u0435 \\u0441\\u0432\\u0435\\u0434\\u0435\\u043D\\u0438\\u044F \\u043E\\u0431 \\u043E\\u0448\\u0438\\u0431\\u043A\\u0435 \\u0438 \\u043F\\u043E\\u0432\\u0442\\u043E\\u0440\\u0438\\u0442\\u0435 \\u043F\\u043E\\u043F\\u044B\\u0442\\u043A\\u0443.\r\n\r\n#XMSG: error pop-up message text\r\nSUBMIT_HEADER_TEXT=\\u0417\\u0430\\u043F\\u0438\\u0441\\u044C \\u0432\\u0440\\u0435\\u043C\\u0435\\u043D\\u0438 \\u0434\\u043B\\u044F {0} \\u043F\\u043B\\u044E\\u0441 {1} \\u0434\\u043D.\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_EDIT_ENTRY_TITLE_SCREEN=\\u041E\\u0431\\u0440\\u0430\\u0431\\u043E\\u0442\\u0430\\u0442\\u044C \\u0437\\u0430\\u043F\\u0438\\u0441\\u0438 \\u0432\\u0440\\u0435\\u043C\\u0435\\u043D\\u0438\r\n\r\n#XMSG: Header in edit screen for single date\r\nSUBMIT_HEADER_TEXT_SINGLE=\\u0417\\u0430\\u043F\\u0438\\u0441\\u044C \\u0432\\u0440\\u0435\\u043C\\u0435\\u043D\\u0438 \\u0434\\u043B\\u044F {0}\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nFULL_CONCATENATE_HOURSMIN={0} \\u0447 {1} \\u043C\\u0438\\u043D.\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nSHORT_CONCATENATE_HOURSMIN={0} \\u0447 {1} \\u043C\\u0438\\u043D.\r\n\r\n#XBUT: Button to reset\r\nRESET=\\u0421\\u0431\\u0440\\u043E\\u0441\r\n\r\n#XBUT: Button to create\r\nCREATE=\\u0421\\u043E\\u0437\\u0434\\u0430\\u0442\\u044C\r\n',
	"hcm/emp/mytimesheet/i18n/i18n_tr.properties":'\r\n#XFLD: label for from time\r\nFROM=Ba\\u015Flang\\u0131\\u00E7\\:\r\n\r\n#XFLD: label for to time\r\nTO=Biti\\u015F\\:\r\n\r\n#XBUT: Button to cancel\r\nCANCEL=\\u0130ptal\r\n\r\n#XBUT: Button to close popover\r\nCLOSE=Kapat\r\n\r\n#XBUT: Button to accept\r\nOK=Tamam\r\n\r\n#XBUT: Button to Save Draft\r\nSAVE_DRAFT=Tasla\\u011F\\u0131 kaydet\r\n\r\n# XTIT: \r\nTIMESHEET_TITLE=Zaman \\u00E7izelgem\r\n\r\n# XTIT: \r\nTIMESHEET=Zaman \\u00E7izelgesi giri\\u015Fleri\r\n\r\n# XTIT: \r\nWEEKENTRY_TITLE=Man\\u00FCel giri\\u015F\r\n\r\n#XBUT: Button for quick entry\r\nQUICK_FILL=H\\u0131zl\\u0131 giri\\u015F\r\n\r\n# XFLD: Apply to\r\nENTRY_VIEW_APPLY_TO=Uygula\\:\r\n\r\n# XTIT: \r\nTIMESHEET_DETAILS_TITLE=Ayr\\u0131nt\\u0131lar\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_CREATE_ENTRY_TITLE=Zaman giri\\u015Fi olu\\u015Ftur\r\n\r\n# XTIT: Title for create entry view with multiple days selected\r\nTIMESHEET_CREATE_ENTRIES_TITLE={0} g\\u00FCn i\\u00E7in giri\\u015F olu\\u015Ftur\r\n\r\n# XTIT: Title for Entry Details\r\nENTRY_DETAILS=Giri\\u015F ayr\\u0131nt\\u0131lar\\u0131\r\n\r\n# XTIT: Title for edit entry view for a particular date ({0} = date)\r\nTIMESHEET_EDIT_ENTRY_TITLE={0} i\\u00E7in giri\\u015F ayr\\u0131nt\\u0131lar\\u0131\r\n\r\n# XTIT: Title for create entry view for a particular date ({0} = date)\r\nTIMESHEET_NEW_ENTRY_TITLE={0} i\\u00E7in giri\\u015F olu\\u015Ftur\r\n\r\n# XTIT: Month short header\r\nMONTH_0=Oca.\r\n# XTIT: Month short header\r\nMONTH_1=\\u015Eub.\r\n# XTIT: Month short header\r\nMONTH_2=Mar.\r\n# XTIT: Month short header\r\nMONTH_3=Nis.\r\n# XTIT: Month short header\r\nMONTH_4=May.\r\n# XTIT: Month short header\r\nMONTH_5=Haz.\r\n# XTIT: Month short header\r\nMONTH_6=Tem.\r\n# XTIT: Month short header\r\nMONTH_7=A\\u011Fu.\r\n# XTIT: Month short header\r\nMONTH_8=Eyl.\r\n# XTIT: Month short header\r\nMONTH_9=Eki.\r\n# XTIT: Month short header\r\nMONTH_10=Kas.\r\n# XTIT: Month short header\r\nMONTH_11=Ara.\r\n\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_0=Ocak\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_1=\\u015Eubat\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_2=Mart\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_3=Nisan\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_4=May\\u0131s\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_5=Haziran\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_6=Temmuz\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_7=A\\u011Fustos\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_8=Eyl\\u00FCl\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_9=Ekim\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_10=Kas\\u0131m\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_11=Aral\\u0131k\r\n\r\n# XTIT: Legend missing day\r\nMISSING_DAY=\\u0130\\u015Fleminiz gerekli\r\n# XTIT: Legend filled day\r\nFILLED_DAY=Bitti\r\n# XTIT: Legend filled in process, manager action needed\r\nFILLED_MANAGER=Onaylayan i\\u015Flemi gerekli\r\n# XFLD: Rejected by manager - this appears on the legend\r\nREJECTED=Reddedildi\r\n# XFLD: Legend future working day\r\nWORKING_DAY=\\u0130\\u015Fg\\u00FCn\\u00FC\r\n# XFLD: Legend non-working day\r\nNON_WORKING_DAY=\\u00C7al\\u0131\\u015F\\u0131lmayan g\\u00FCn\r\n\r\n# XMSG: Footer information about missing hours\r\nTOTAL_MISSING=Toplam eksik saat\\: {0}\r\n\r\n#XFLD:\r\nMONTH_YEAR={0} {1} ({2} saat)\r\n\r\n#XBUT: Button\r\nSAVE=Kaydet\r\n\r\n#XBUT: Button \r\nSUBMIT=G\\u00F6nder\r\n\r\n#XBUT: Button for quick entry\r\nSMART_FILL=Otomatik giri\\u015F\r\n\r\n# XMSG\r\nFILL_ALL=\\u015Eunun i\\u00E7in {0} saat gir\\:\r\n\r\n#XFLD\r\nNO_TASK_TYPE=G\\u00F6rev t\\u00FCr\\u00FC yok\r\n\r\n#XFLD\r\nMISSING_DAYS=Eksik g\\u00FCnler\\: {0}\r\n\r\n#XBUT: Button\r\nHOME=Ana sayfa\r\n\r\n#XTIT: confirmation header\r\nCONFIRMATION=Teyit\r\n\r\n#XTIT: deletion confirmation header\r\nDELETE_CONFIRMATION=Silmeyi teyit et\r\n\r\n#XTIT: submission confirmation header\r\nSUBMISSION_CONFIRMATION=G\\u00F6ndermeyi teyit et\r\n\r\n#XTIT: Draft submission confirmation header\r\nDRAFT_CONFIRMATION=Tasla\\u011F\\u0131 teyit et\r\n\r\n#XFLD: label for Deletion summary in Dialog\r\nDELETE_CONFIRMATION_SUMMARY=Silme i\\u00E7in se\\u00E7ilen zaman giri\\u015Flerinin \\u00F6zeti\r\n\r\n#XFLD: label for Submission summary in Dialog\r\nSUBMISSION_CONFIRMATION_SUMMARY=G\\u00F6nderme i\\u00E7in se\\u00E7ilen zaman giri\\u015Flerinin \\u00F6zeti\r\n\r\n#XFLD: label for Draft Submission summary in Dialog\r\nDRAFT_CONFIRMATION_SUMMARY=Se\\u00E7ilen zaman giri\\u015Flerin \\u00F6zeti\r\n\r\n#XFLD: label for Number of entries in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_ENTRIES=Giri\\u015F say\\u0131s\\u0131\r\n\r\n#XFLD: label for Number of hours in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_HOURS=Saat say\\u0131s\\u0131\r\n\r\n#XBUT: Confirm Button\r\nCONFIRM=Teyit et\r\n\r\n#XMSG: Summary for confirmation - these are two dates\r\nSUMMARY={0} - {1}\r\n\r\n#XFLD: Week \r\nWEEK=Hafta\r\n\r\n#XFLD:\r\nMEET_TARGET_HOURS=Saatleri uygula\\:\r\n\r\n#XBUT\r\nTHIS_WEEK=Ge\\u00E7erli hafta ({0} saat)\r\n\r\n#XBUT\r\nALL_MISSING=T\\u00FCm eksik zamanlar ({0} saat)\r\n\r\n#XBUT: Delete Button Text\r\nDELETE=Sil\r\n\r\n#XBUT: Add Button Text for Weekly Entry nav button\r\nNAV_ADD=Giri\\u015F ekle\r\n\r\n#XFLD: label for duration\r\nDURATION=S\\u00FCre\r\n\r\n#XFLD: label for total duration\r\nTOTAL_DURATION=Toplam s\\u00FCre\r\n\r\n#XFLD: label for status\r\nSTATUS=Durum\r\n\r\n#XFLD: label for start time\r\nSTART_TIME=Ba\\u015Flang\\u0131\\u00E7 saati\r\n\r\n#XFLD: label for end Time\r\nEND_TIME=Biti\\u015F saati\r\n\r\n#XFLD: label for note\r\nNOTE=Not\r\n\r\n#XFLD: label for Add New week entry\r\nADD_NEW=Yeni giri\\u015F\r\n\r\n#XBUT: Done button\r\nDONE=Bitti\r\n\r\n# XTIT: Recently Used\r\nRECENTLY_USED=\\u00D6neriler\r\n\r\n# XTIT: Manual Input Add\r\nMANUAL_INPUT_ADD=Man\\u00FCel\r\n\r\n# XTIT: Manual Input Edit\r\nMANUAL_INPUT_EDIT=Giri\\u015Fi d\\u00FCzenle\r\n\r\n# XTIT: Cost Assignment\r\nCOST_ASSIGNMENT=Zaman tayini\r\n\r\n#XFLD: Tap to Load More\r\nTAP_TO_LOAD_MORE=Daha fazla y\\u00FCkle\r\n\r\n#XFLD: Tap to Load More Loading\r\nTAP_TO_LOAD_MORE_LOADING=Y\\u00FCkleniyor...\r\n\r\n#XFLD: Continue Search on Server\r\nCONTINUE_SEARCH_ON_SERVER=Sunucuda aramaya devam et...\r\n\r\n#XFLD: Continue Search on Server Loading\r\nCONTINUE_SEARCH_ON_SERVER_LOADING=Y\\u00FCkleniyor...\r\n\r\n#XFLD: BLANK\r\nEMPTY=Bo\\u015F\r\n\r\n#XFLD: None\r\nNONE=Hi\\u00E7biri\r\n\r\n# XTIT: Select\r\nSELECT={0} se\\u00E7\r\n\r\n# XTIT: Placeholder for Cost Assignment Picker indicating Select action\r\nSELECT_PLACEHOLDER=Se\\u00E7\r\n\r\n#XFLD: Placeholder for cost assignment type search\r\nSEARCH=Aran\\u0131yor...\r\n\r\n#XFLD: short label for hours\r\nHOURS_LABEL=s\r\n\r\n#XFLD: short label for minutes\r\nMINUTES_LABEL=d\r\n\r\n#XFLD: full label for hours \r\nHOURS_LABEL_FULL=Saat\r\n\r\n#XFLD: full label for minutes\r\nMINUTES_LABEL_FULL=Dakika\r\n\r\n#XFLD: label for date. When localizing do not change the MMM DD or YYYY, just the order of them\r\nDATE_LOCALE=AAA GG, YYYY\r\n\r\n\r\n#XBUT:\r\nDETAIL=Ayr\\u0131nt\\u0131lar\r\n\r\n\r\n#XFLD: label for Settings title\r\nSETTINGS_TITLE=Ayarlar\r\n#XFLD: label for Settings data entry profile\r\nSETTINGS_DATA_ENTRY_PROFILE=Veri giri\\u015Fi profili\r\n#XFLD: label for Settings pre-fill label\r\nSETTINGS_PREFILL_LAST_WEEK=Otomatik \\u00F6ner\r\n\r\n# XMSG: \r\nCONFIRM_LEAVE_PAGE=Kaydedilmeyen veriler at\\u0131lacak. Devam etmek istedi\\u011Finizden emin misiniz?\r\n# XTIT: \r\nUNSAVED_CHANGES=Kaydedilmeyen de\\u011Fi\\u015Fiklikler\r\n\r\n#XMSG: toast message for successful submit\r\nSUBMIT_SUCCESS=G\\u00F6nderilen talep\r\n\r\n#XMSG: toast message for successful draft submit\r\nDRAFT_SUCCESS=Taslak ba\\u015Far\\u0131yla kaydedildi\r\n\r\n#XBUT:\r\nHELP=Yard\\u0131m\r\n\r\n#XMSG: confirmation message for week entry\r\nTOTAL_BOOKED=Bu hafta i\\u00E7in {0}/{1} saat girildi.\r\n\r\n#XMSG: help text for pre-fill option\r\nHELP_PREFILL=Son ba\\u015Far\\u0131l\\u0131 giri\\u015Finizi temel alarak hafta i\\u00E7in saatleri h\\u0131zla doldurmak amac\\u0131yla \\u00F6n de\\u011Ferleri y\\u00FCklemeyi etkinle\\u015Ftirin\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT_AUTO_ENTRY=G\\u00F6nderme ba\\u015Far\\u0131s\\u0131z oldu; hata ayr\\u0131nt\\u0131lar\\u0131n\\u0131 g\\u00F6zden ge\\u00E7irin ve yeniden deneyin\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT=Baz\\u0131 giri\\u015Fler do\\u011Fru de\\u011Fil. Hata ayr\\u0131nt\\u0131lar\\u0131n\\u0131 ge\\u00E7irin ve yeniden deneyin.\r\n\r\n#XMSG: error pop-up message text\r\nSUBMIT_HEADER_TEXT={0} ve fazladan {1} g\\u00FCn i\\u00E7in zaman giri\\u015Fi\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_EDIT_ENTRY_TITLE_SCREEN=Zaman giri\\u015Fini d\\u00FCzenle\r\n\r\n#XMSG: Header in edit screen for single date\r\nSUBMIT_HEADER_TEXT_SINGLE={0} i\\u00E7in zaman giri\\u015Fi\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nFULL_CONCATENATE_HOURSMIN={0} saat {1} dakika\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nSHORT_CONCATENATE_HOURSMIN={0} s {1} d\r\n\r\n#XBUT: Button to reset\r\nRESET=S\\u0131f\\u0131rla\r\n\r\n#XBUT: Button to create\r\nCREATE=Olu\\u015Ftur\r\n',
	"hcm/emp/mytimesheet/i18n/i18n_zh_CN.properties":'\r\n#XFLD: label for from time\r\nFROM=\\u81EA\r\n\r\n#XFLD: label for to time\r\nTO=\\u81F3\r\n\r\n#XBUT: Button to cancel\r\nCANCEL=\\u53D6\\u6D88\r\n\r\n#XBUT: Button to close popover\r\nCLOSE=\\u5173\\u95ED\r\n\r\n#XBUT: Button to accept\r\nOK=\\u786E\\u5B9A\r\n\r\n#XBUT: Button to Save Draft\r\nSAVE_DRAFT=\\u4FDD\\u5B58\\u8349\\u7A3F\r\n\r\n# XTIT: \r\nTIMESHEET_TITLE=\\u6211\\u7684\\u5DE5\\u65F6\\u8868\r\n\r\n# XTIT: \r\nTIMESHEET=\\u5DE5\\u65F6\\u8868\\u6761\\u76EE\r\n\r\n# XTIT: \r\nWEEKENTRY_TITLE=\\u624B\\u52A8\\u8F93\\u5165\r\n\r\n#XBUT: Button for quick entry\r\nQUICK_FILL=\\u5FEB\\u6377\\u8F93\\u5165\r\n\r\n# XFLD: Apply to\r\nENTRY_VIEW_APPLY_TO=\\u5E94\\u7528\\u4E8E\r\n\r\n# XTIT: \r\nTIMESHEET_DETAILS_TITLE=\\u8BE6\\u7EC6\\u4FE1\\u606F\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_CREATE_ENTRY_TITLE=\\u521B\\u5EFA\\u65F6\\u95F4\\u6761\\u76EE\r\n\r\n# XTIT: Title for create entry view with multiple days selected\r\nTIMESHEET_CREATE_ENTRIES_TITLE=\\u9488\\u5BF9 {0} \\u5929\\u521B\\u5EFA\\u6761\\u76EE\r\n\r\n# XTIT: Title for Entry Details\r\nENTRY_DETAILS=\\u6761\\u76EE\\u8BE6\\u7EC6\\u4FE1\\u606F\r\n\r\n# XTIT: Title for edit entry view for a particular date ({0} = date)\r\nTIMESHEET_EDIT_ENTRY_TITLE={0} \\u7684\\u6761\\u76EE\\u8BE6\\u7EC6\\u4FE1\\u606F\r\n\r\n# XTIT: Title for create entry view for a particular date ({0} = date)\r\nTIMESHEET_NEW_ENTRY_TITLE=\\u9488\\u5BF9 {0} \\u521B\\u5EFA\\u6761\\u76EE\r\n\r\n# XTIT: Month short header\r\nMONTH_0=01\r\n# XTIT: Month short header\r\nMONTH_1=02\r\n# XTIT: Month short header\r\nMONTH_2=03\r\n# XTIT: Month short header\r\nMONTH_3=04\r\n# XTIT: Month short header\r\nMONTH_4=05\r\n# XTIT: Month short header\r\nMONTH_5=06\r\n# XTIT: Month short header\r\nMONTH_6=07\r\n# XTIT: Month short header\r\nMONTH_7=08\r\n# XTIT: Month short header\r\nMONTH_8=09\r\n# XTIT: Month short header\r\nMONTH_9=10\r\n# XTIT: Month short header\r\nMONTH_10=11\r\n# XTIT: Month short header\r\nMONTH_11=12\r\n\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_0=1 \\u6708\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_1=2 \\u6708\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_2=3 \\u6708\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_3=4 \\u6708\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_4=5 \\u6708\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_5=6 \\u6708\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_6=7 \\u6708\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_7=8 \\u6708\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_8=9 \\u6708\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_9=10 \\u6708\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_10=11 \\u6708\r\n# XTIT: Month title for calendar\r\nMONTH_FULL_11=12 \\u6708\r\n\r\n# XTIT: Legend missing day\r\nMISSING_DAY=\\u9700\\u8981\\u7528\\u6237\\u64CD\\u4F5C\r\n# XTIT: Legend filled day\r\nFILLED_DAY=\\u5B8C\\u6210\r\n# XTIT: Legend filled in process, manager action needed\r\nFILLED_MANAGER=\\u9700\\u8981\\u5BA1\\u6279\\u4EBA\\u64CD\\u4F5C\r\n# XFLD: Rejected by manager - this appears on the legend\r\nREJECTED=\\u5DF2\\u62D2\\u7EDD\r\n# XFLD: Legend future working day\r\nWORKING_DAY=\\u5DE5\\u4F5C\\u65E5\r\n# XFLD: Legend non-working day\r\nNON_WORKING_DAY=\\u975E\\u5DE5\\u4F5C\\u65E5\r\n\r\n# XMSG: Footer information about missing hours\r\nTOTAL_MISSING=\\u7F3A\\u5C11\\u65F6\\u6570\\u603B\\u8BA1\\uFF1A{0}\r\n\r\n#XFLD:\r\nMONTH_YEAR={0} {1}\\uFF08{2} \\u5C0F\\u65F6\\uFF09\r\n\r\n#XBUT: Button\r\nSAVE=\\u4FDD\\u5B58\r\n\r\n#XBUT: Button \r\nSUBMIT=\\u63D0\\u4EA4\r\n\r\n#XBUT: Button for quick entry\r\nSMART_FILL=\\u81EA\\u52A8\\u8F93\\u5165\r\n\r\n# XMSG\r\nFILL_ALL=\\u4E3A\\u4EE5\\u4E0B\\u9879\\u8F93\\u5165 {0} \\u5C0F\\u65F6\\uFF1A\r\n\r\n#XFLD\r\nNO_TASK_TYPE=\\u65E0\\u4EFB\\u52A1\\u7C7B\\u578B\r\n\r\n#XFLD\r\nMISSING_DAYS=\\u7F3A\\u5C11\\u5929\\u6570\\uFF1A{0}\r\n\r\n#XBUT: Button\r\nHOME=\\u4E3B\\u5C4F\\u5E55\r\n\r\n#XTIT: confirmation header\r\nCONFIRMATION=\\u786E\\u8BA4\r\n\r\n#XTIT: deletion confirmation header\r\nDELETE_CONFIRMATION=\\u786E\\u8BA4\\u5220\\u9664\r\n\r\n#XTIT: submission confirmation header\r\nSUBMISSION_CONFIRMATION=\\u786E\\u8BA4\\u63D0\\u4EA4\r\n\r\n#XTIT: Draft submission confirmation header\r\nDRAFT_CONFIRMATION=\\u786E\\u8BA4\\u8349\\u7A3F\r\n\r\n#XFLD: label for Deletion summary in Dialog\r\nDELETE_CONFIRMATION_SUMMARY=\\u5F85\\u5220\\u9664\\u7684\\u9009\\u4E2D\\u65F6\\u95F4\\u6761\\u76EE\\u6C47\\u603B\r\n\r\n#XFLD: label for Submission summary in Dialog\r\nSUBMISSION_CONFIRMATION_SUMMARY=\\u5F85\\u63D0\\u4EA4\\u7684\\u9009\\u4E2D\\u65F6\\u95F4\\u6761\\u76EE\\u6C47\\u603B\r\n\r\n#XFLD: label for Draft Submission summary in Dialog\r\nDRAFT_CONFIRMATION_SUMMARY=\\u6240\\u9009\\u65F6\\u95F4\\u6761\\u76EE\\u6C47\\u603B\r\n\r\n#XFLD: label for Number of entries in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_ENTRIES=\\u6761\\u76EE\\u6570\r\n\r\n#XFLD: label for Number of hours in Dialog\r\nDELETE_CONFIRMATION_SUMMARY_HOURS=\\u5C0F\\u65F6\\u6570\r\n\r\n#XBUT: Confirm Button\r\nCONFIRM=\\u786E\\u8BA4\r\n\r\n#XMSG: Summary for confirmation - these are two dates\r\nSUMMARY={0} - {1}\r\n\r\n#XFLD: Week \r\nWEEK=\\u5468\r\n\r\n#XFLD:\r\nMEET_TARGET_HOURS=\\u5C06\\u5C0F\\u65F6\\u6570\\u5E94\\u7528\\u4E8E\\uFF1A\r\n\r\n#XBUT\r\nTHIS_WEEK=\\u5F53\\u524D\\u661F\\u671F\\uFF08{0} \\u5C0F\\u65F6\\uFF09\r\n\r\n#XBUT\r\nALL_MISSING=\\u7F3A\\u5C11\\u65F6\\u95F4\\u603B\\u8BA1\\uFF08{0} \\u5C0F\\u65F6\\uFF09\r\n\r\n#XBUT: Delete Button Text\r\nDELETE=\\u5220\\u9664\r\n\r\n#XBUT: Add Button Text for Weekly Entry nav button\r\nNAV_ADD=\\u6DFB\\u52A0\\u6761\\u76EE\r\n\r\n#XFLD: label for duration\r\nDURATION=\\u6301\\u7EED\\u65F6\\u95F4\r\n\r\n#XFLD: label for total duration\r\nTOTAL_DURATION=\\u603B\\u6301\\u7EED\\u65F6\\u95F4\r\n\r\n#XFLD: label for status\r\nSTATUS=\\u72B6\\u6001\r\n\r\n#XFLD: label for start time\r\nSTART_TIME=\\u5F00\\u59CB\\u65F6\\u95F4\r\n\r\n#XFLD: label for end Time\r\nEND_TIME=\\u7ED3\\u675F\\u65F6\\u95F4\r\n\r\n#XFLD: label for note\r\nNOTE=\\u6CE8\\u91CA\r\n\r\n#XFLD: label for Add New week entry\r\nADD_NEW=\\u65B0\\u5EFA\\u6761\\u76EE\r\n\r\n#XBUT: Done button\r\nDONE=\\u5B8C\\u6210\r\n\r\n# XTIT: Recently Used\r\nRECENTLY_USED=\\u5EFA\\u8BAE\r\n\r\n# XTIT: Manual Input Add\r\nMANUAL_INPUT_ADD=\\u624B\\u52A8\r\n\r\n# XTIT: Manual Input Edit\r\nMANUAL_INPUT_EDIT=\\u7F16\\u8F91\\u6761\\u76EE\r\n\r\n# XTIT: Cost Assignment\r\nCOST_ASSIGNMENT=\\u65F6\\u95F4\\u5206\\u914D\r\n\r\n#XFLD: Tap to Load More\r\nTAP_TO_LOAD_MORE=\\u52A0\\u8F7D\\u66F4\\u591A\r\n\r\n#XFLD: Tap to Load More Loading\r\nTAP_TO_LOAD_MORE_LOADING=\\u6B63\\u5728\\u52A0\\u8F7D...\r\n\r\n#XFLD: Continue Search on Server\r\nCONTINUE_SEARCH_ON_SERVER=\\u7EE7\\u7EED\\u5728\\u670D\\u52A1\\u5668\\u4E0A\\u641C\\u7D22...\r\n\r\n#XFLD: Continue Search on Server Loading\r\nCONTINUE_SEARCH_ON_SERVER_LOADING=\\u6B63\\u5728\\u52A0\\u8F7D...\r\n\r\n#XFLD: BLANK\r\nEMPTY=\\u7A7A\r\n\r\n#XFLD: None\r\nNONE=\\u65E0\r\n\r\n# XTIT: Select\r\nSELECT=\\u9009\\u62E9 {0}\r\n\r\n# XTIT: Placeholder for Cost Assignment Picker indicating Select action\r\nSELECT_PLACEHOLDER=\\u9009\\u62E9\r\n\r\n#XFLD: Placeholder for cost assignment type search\r\nSEARCH=\\u6B63\\u5728\\u641C\\u7D22...\r\n\r\n#XFLD: short label for hours\r\nHOURS_LABEL=\\u5C0F\\u65F6\r\n\r\n#XFLD: short label for minutes\r\nMINUTES_LABEL=\\u5206\r\n\r\n#XFLD: full label for hours \r\nHOURS_LABEL_FULL=\\u5C0F\\u65F6\r\n\r\n#XFLD: full label for minutes\r\nMINUTES_LABEL_FULL=\\u5206\r\n\r\n#XFLD: label for date. When localizing do not change the MMM DD or YYYY, just the order of them\r\nDATE_LOCALE=YYYY, MMM DD\r\n\r\n\r\n#XBUT:\r\nDETAIL=\\u8BE6\\u7EC6\\u4FE1\\u606F\r\n\r\n\r\n#XFLD: label for Settings title\r\nSETTINGS_TITLE=\\u8BBE\\u7F6E\r\n#XFLD: label for Settings data entry profile\r\nSETTINGS_DATA_ENTRY_PROFILE=\\u6570\\u636E\\u8F93\\u5165\\u53C2\\u6570\\u6587\\u4EF6\r\n#XFLD: label for Settings pre-fill label\r\nSETTINGS_PREFILL_LAST_WEEK=\\u81EA\\u52A8\\u5EFA\\u8BAE\r\n\r\n# XMSG: \r\nCONFIRM_LEAVE_PAGE=\\u6240\\u6709\\u672A\\u4FDD\\u5B58\\u7684\\u6570\\u636E\\u90FD\\u5C06\\u653E\\u5F03\\u3002\\u662F\\u5426\\u786E\\u5B9A\\u7EE7\\u7EED\\uFF1F\r\n# XTIT: \r\nUNSAVED_CHANGES=\\u672A\\u4FDD\\u5B58\\u7684\\u66F4\\u6539\r\n\r\n#XMSG: toast message for successful submit\r\nSUBMIT_SUCCESS=\\u5DF2\\u63D0\\u4EA4\\u7533\\u8BF7\r\n\r\n#XMSG: toast message for successful draft submit\r\nDRAFT_SUCCESS=\\u5DF2\\u6210\\u529F\\u4FDD\\u5B58\\u8349\\u7A3F\r\n\r\n#XBUT:\r\nHELP=\\u5E2E\\u52A9\r\n\r\n#XMSG: confirmation message for week entry\r\nTOTAL_BOOKED=\\u5DF2\\u4E3A\\u6B64\\u661F\\u671F\\u8F93\\u5165 {0}/{1} \\u5C0F\\u65F6\\u3002\r\n\r\n#XMSG: help text for pre-fill option\r\nHELP_PREFILL=\\u6253\\u5F00\\u9884\\u586B\\u5145\\u529F\\u80FD\\uFF0C\\u57FA\\u4E8E\\u60A8\\u6700\\u540E\\u6210\\u529F\\u8F93\\u5165\\u7684\\u5185\\u5BB9\\u5FEB\\u901F\\u586B\\u5145\\u8BE5\\u5468\\u7684\\u5C0F\\u65F6\\u6570\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT_AUTO_ENTRY=\\u63D0\\u4EA4\\u5931\\u8D25\\uFF1B\\u8BF7\\u68C0\\u67E5\\u9519\\u8BEF\\u8BE6\\u7EC6\\u4FE1\\u606F\\u5E76\\u91CD\\u8BD5\r\n\r\n#XMSG: error pop-up message text\r\nERROR_SUBMIT=\\u67D0\\u4E9B\\u6761\\u76EE\\u4E0D\\u6B63\\u786E\\u3002\\u8BF7\\u68C0\\u67E5\\u9519\\u8BEF\\u8BE6\\u7EC6\\u4FE1\\u606F\\u5E76\\u91CD\\u8BD5\\u3002\r\n\r\n#XMSG: error pop-up message text\r\nSUBMIT_HEADER_TEXT={0} \\u548C {1} \\u5929\\u7684\\u65F6\\u95F4\\u6761\\u76EE\r\n\r\n# XTIT: Title for create entry view\r\nTIMESHEET_EDIT_ENTRY_TITLE_SCREEN=\\u7F16\\u8F91\\u65F6\\u95F4\\u6761\\u76EE\r\n\r\n#XMSG: Header in edit screen for single date\r\nSUBMIT_HEADER_TEXT_SINGLE={0} \\u7684\\u65F6\\u95F4\\u6761\\u76EE\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nFULL_CONCATENATE_HOURSMIN={0} \\u5C0F\\u65F6 {1} \\u5206\r\n\r\n# XFLD: Concatenate hours and minutes full\r\nSHORT_CONCATENATE_HOURSMIN={0} h {1} m\r\n\r\n#XBUT: Button to reset\r\nRESET=\\u91CD\\u7F6E\r\n\r\n#XBUT: Button to create\r\nCREATE=\\u521B\\u5EFA\r\n',
	"hcm/emp/mytimesheet/model/TimeEntry.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.mytimesheet.model.TimeEntry");

hcm.emp.mytimesheet.model.TimeEntry = function(time, childName, suggestion, bExisting) {
	this.time = time;
	this.hours = Math.floor(time);
	this.minutes = Math.round((time - Math.floor(time)) * 60);
	this.suggestion = suggestion===undefined ? false : suggestion;
	this.newEntry = !bExisting;
	this.mainItem = null;
	this.subItems = childName;
	this.notes = null;
	this.startTime = "";
	this.endTime = "";
	this.counter = "";
	this.hasNotes = false;
	this.showTime = bExisting;
	this.showError = false;
	this.error = "";
	this.status = "";
	//Introducing statusId for Status color in WeekEntry View
	this.statusId = "";
};

hcm.emp.mytimesheet.model.TimeEntry.prototype.setStartEndTimes = function(
		date, entries, missingTime, workingDay) {
	var lastUndeletedIndex = entries.length-1;
	while(lastUndeletedIndex>=0 && entries[entries.length-1].deleted) {
		lastUndeletedIndex--;
	}
	var startTime = this.createTime(date, lastUndeletedIndex>=0 ?
			entries[lastUndeletedIndex].endTime :
			workingDay.startTime);
	var lunchStart = this.createTime(date, workingDay ? workingDay.lunchStart : "000000");
	var lunchEnd = this.createTime(date, workingDay ? workingDay.lunchEnd : "000000");
	if(startTime.getTime()===lunchStart.getTime()) {
		// the lunch break is before the start time
		startTime.setTime(startTime.getTime() + lunchEnd.getTime()-lunchStart.getTime());
	}
	var endTime = new Date(startTime.getTime() + missingTime*3600000);
	if(startTime.getTime() < lunchStart.getTime()) {
		endTime.setTime(endTime.getTime() + lunchEnd.getTime()-lunchStart.getTime());
	}
	this.startTime = (startTime.getHours()+100).toString().substring(1, 3) + (startTime.getMinutes()+100).toString().substring(1, 3) + "00";
	this.endTime = (endTime.getHours()+100).toString().substring(1, 3) + (endTime.getMinutes()+100).toString().substring(1, 3) + "00";
};

hcm.emp.mytimesheet.model.TimeEntry.prototype.createTime = function(
		date, timeStr) {
	var time = new Date(date.getTime());
	time.setHours(parseInt(timeStr.substring(0, 2), 10), parseInt(timeStr.substring(2, 4), 10));
	return time;
};

hcm.emp.mytimesheet.model.TimeEntry.prototype.setData = function(
		data) {
	if (data.FieldName === "TIME") {
		this.recordNumber = data.RecordNumber;
		this.time = parseFloat(data.FieldValue.trim());
		this.hours = Math.floor(this.time);
		this.minutes = Math
				.round((this.time - this.hours) * 60);
		this.startTime = data.StartTime;
		this.endTime = data.EndTime;
	} else if (data.FieldName === "NOTES") {
		this.notes = data.FieldValueText;
		if (this.notes && this.notes.length > 0) {
			this.hasNotes = true;
		}
	} else if (data.FieldName === "STARTTIME") {
		this.startTime = data.FieldValueText;
	} else if (data.FieldName === "ENDTIME") {
		this.endTime = data.FieldValueText;
	} else if (data.FieldName === "COUNTER") {
		this.counter = data.FieldValueText;
	} else if (data.FieldName === "REASON") {
		this.rejectionReason = data.FieldValueText;
	} else if (data.FieldName === "STATUS") {
		this.status = data.FieldValueText;
		this.statusId = data.FieldValue;
	} else if (data.Level === "0") {// this is the Bold item
		this.mainItem = data.FieldValueText;
		this.mainCode = data.FieldValue;
		this.mainName = data.FieldName;
	} else {
		if (this.subItems) {
			this.subItems += ", " + data.FieldValueText;
			this.childItems.push(data.FieldValueText);
			this.childCodes.push(data.FieldValue);
			this.childNames.push(data.FieldName);
		} else {
			this.subItems = data.FieldValueText;
			this.childItems = [ data.FieldValueText ];
			this.childCodes = [ data.FieldValue ];
			this.childNames = [ data.FieldName ];
		}
	}
};


},
	"hcm/emp/mytimesheet/utils/ConnectionHelper.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.mytimesheet.utils.ConnectionHelper");
jQuery.sap.require("sap.ui.model.odata.datajs");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("hcm.emp.mytimesheet.utils.PerfUtils");
jQuery.sap.require("sap.ui.base.EventProvider");
jQuery.sap.require("hcm.emp.mytimesheet.utils.InitialConfigHelper");
jQuery.sap.require("sap.ca.ui.utils.busydialog");


// code form descriptor.js has been put here as this is not available in wave 2

sap.ui.base.EventProvider
		.extend(
				"hcm.emp.mytimesheet.Service",
				{
					metadata : {
						publicMethods : [ "getModel", "getGeneralParameters",
								"getSpendingDataByHierarhyNodesAndPeriod",
								"getGenericLineItemsByHierNodesAndPeriod",
								"getTrendDataByHierarchyNodes", "setBundle" ]
					},
					constructor : function() {
						this._nCounter = 0;
						//this._busyDialog = new sap.m.BusyDialog();
					},

					_initialize : function(appController) {
						if (!this.oApplication) {
							this.oApplication = appController.oApplicationFacade.oApplicationImplementation;
							this.oConfiguration = new hcm.emp.mytimesheet.utils.InitialConfigHelper();
							this.oConnectionManager = appController.oApplication
									.getConnectionManager();
						}

						if (!this.oBundle) {
							// this.setBundle(this.oApplication.getResourceBundle());
							this.oBundle = appController.oApplicationFacade.oApplicationImplementation.getResourceBundle();
						}
						this.oConfiguration.setResourceBundle(this.oBundle);
						//var serviceName = this.oConfiguration.getServiceList()[0].name;
						//this.oDataModel = this.oConnectionManager.modelList[serviceName];
						this.oDataModel = this.oConnectionManager.getModel();
						this.oDataModel
								.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
					},

					processError : function(oError) {
						var message = "";
						var messageDetails = "";
						if (oError.response) {
							// initially take status text as a general message
							message = oError.response.statusText;
							var body = oError.response.body;
							// look for message title in
							// message":{"lang":"en","value":"User SEQUEIRAC
							// does not exist in this period"} format
							var indexValue = body.indexOf("value");
							var indexValueEnd = body.substring(indexValue)
									.indexOf("}");
							if (indexValueEnd > -1) {
								message = body.substring(indexValue + 8,
										indexValue + indexValueEnd - 1);
							}
							// look for message details in
							// "errordetails":[{"code":"5A/359","message":"User
							// SEQUEIRAC does not exist in this
							// period","propertyref":"","severity":"error"}]}
							// format
							var indexErr = body.indexOf("errordetails");
							var indexStart = body.substring(indexErr).indexOf(
									"message");
							var indexEnd = body
									.substring(indexErr + indexStart).indexOf(
											",");
							if (indexEnd > -1) {
								messageDetails = body.substring(indexErr
										+ indexStart + 10, indexErr
										+ indexStart + indexEnd - 1);
							}
						}
												
						var oMessage = {
								message : message,
								details : messageDetails,
								type : sap.ca.ui.message.Type.ERROR
							};
							
							
							  sap.ca.ui.message.showMessageBox({
			                       type: oMessage.type,
			                       message: oMessage.message,
			                       details: oMessage.details
			                   });
						
						
						
						
					},

					getWorkDays : function(appController,begda, endda, fSuccess) {
						this.showBusy();
						var self = this;
						if (jQuery.sap.getUriParameters().get("responderOn")) {
							var jsonModel = new sap.ui.model.json.JSONModel();
							jsonModel.loadData("resources/model/workdays.json",
									{}, false);
							var items = jsonModel.getData();
							var newItems = [];
							// we only want to have fake data for the dates in
							// the request
							for ( var i = 0; i < items.length; i++) {
								if (items[i].date >= begda
										&& items[i].date <= endda) {
									newItems.push(items[i]);
								}
							}
							fSuccess(newItems);
							self.hideBusy();
						}

						else {
							this._initialize(appController);

							jQuery.sap.measure
									.start(hcm.emp.mytimesheet.utils.PerfUtils
											.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_WORK_DAYS));
							this.oDataModel
									.read(
											"/WorkCalendars",
											null,
											[ "$filter=StartDate eq '" + begda
													+ "' and EndDate eq '"
													+ endda + "'" ],
											true,
											function(oData, oResponse) {

												// mainModel.oHeaders =
												// oResponse.headers["x-csrf-token"];
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_WORK_DAYS));
												fSuccess(oData.results);
												self.hideBusy();
											},
											function(oError) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_PROJECT_SUMMARY));
												self.hideBusy(true);
												self.processError(oError);
											});
						}
					},
					// method not called
/*					getProjectSummary : function(begda, endda, fSuccess) {
						this.showBusy();
						var self = this;
						if (jQuery.sap.getUriParameters().get("responderOn")) {
							var jsonModel = new sap.ui.model.json.JSONModel();
							jsonModel.loadData(
									"resources/model/projectsummary.json", {},
									false);
							fSuccess(jsonModel.getData());
							self.hideBusy();
						}

						else {
							this._initialize(appController);
							jQuery.sap.measure
									.start(hcm.emp.mytimesheet.utils.PerfUtils
											.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_PROJECT_SUMMARY));
							this.oDataModel
									.read(
											"/ProjectSummaries",
											null,
											[ "$filter=StartDate eq '" + begda
													+ "' and EndDate eq '"
													+ endda + "'" ],
											true,
											function(oData) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_PROJECT_SUMMARY));
												fSuccess(oData.results);
												self.hideBusy();
											},
											function(oError) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_PROJECT_SUMMARY));
												self.hideBusy(true);
												self.processError(oError);
											});
						}
					},*/

					getWorkListCollection : function(appController,begda, endda, fSuccess) {
						this.showBusy();
						var self = this;
						if (jQuery.sap.getUriParameters().get("responderOn")) {
							var jsonModel = new sap.ui.model.json.JSONModel();
							jsonModel.loadData("resources/model/worklist.json",
									{}, false);
							var items = jsonModel.getData();
							var newItems = [];
							// we only want to have fake data for the dates in
							// the request
							for ( var i = 0; i < items.length; i++) {
								if (items[i].WorkDate >= begda
										&& items[i].WorkDate <= endda) {
									newItems.push(items[i]);
								}
							}
							fSuccess(newItems);
							self.hideBusy();
						} else {
							this._initialize(appController);
							jQuery.sap.measure
									.start(hcm.emp.mytimesheet.utils.PerfUtils
											.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_PROJECT_SUMMARY));
							this.oDataModel
									.read(
											"/TimeDataList",
											null,
											[ "$filter=StartDate eq '" + begda
													+ "' and EndDate eq '"
													+ endda + "'" ],
											true,
											function(oData) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_WORKLIST_COLLECTION));
												for(var i=0;i<oData.results.length;i++){
													oData.results[i].Level=oData.results[i].Level.toString().trim();
												}
												fSuccess(oData.results);
												self.hideBusy();

											},
											function(oError) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_WORKLIST_COLLECTION));
												self.hideBusy(true);
												self.processError(oError);
											});
						}
					},

					getCostAssignmentWorkListCollection : function(appController,  begDa, endDa, fSuccess) {
						this.showBusy();
						var self = this;
						if (jQuery.sap.getUriParameters().get("responderOn")) {
							var jsonModel = new sap.ui.model.json.JSONModel();
							jsonModel
									.loadData(
											"resources/model/CostAssignmentWorkList.json",
											{}, false);
							fSuccess(jsonModel.getData());
							self.hideBusy();
						} else {
							this._initialize(appController);
							jQuery.sap.measure
									.start(hcm.emp.mytimesheet.utils.PerfUtils
											.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_PROJECT_SUMMARY));
							this.oDataModel
									.read(
											"/WorkListCollection",
											null,
											[ "$filter=StartDate eq '" + begDa + "' and EndDate eq '"
												+ endDa + "'" ],
											true,
											function(oData) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_COST_ASSIGNMENT_WORKLIST_COLLECTION));
												for(var i=0;i<oData.results.length;i++){
													oData.results[i].Level=oData.results[i].Level.toString().trim();
												}
												fSuccess(oData.results);
												self.hideBusy();
											},
											function(oError) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_COST_ASSIGNMENT_WORKLIST_COLLECTION));
												self.hideBusy(true);
												self.processError(oError);
											});
						}
					},

					getCostAssignmentWorkListTypeCollection : function(appController,fSuccess) {
						this.showBusy();
						var self = this;
						if (jQuery.sap.getUriParameters().get("responderOn")) {
							var jsonModel = new sap.ui.model.json.JSONModel();
							jsonModel
									.loadData(
											"resources/model/CostAssignmentWorkListType.json",
											{}, false);
							fSuccess(jsonModel.getData());
							self.hideBusy();
						} else {
							this._initialize(appController);
							jQuery.sap.measure
									.start(hcm.emp.mytimesheet.utils.PerfUtils
											.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_PROJECT_SUMMARY));
							this.oDataModel
									.read(
											"/ProfileFields",
											null,
											[],
											true,
											function(oData) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_COST_ASSIGNMENT_WORKLIST_TYPE_COLLECTION));
												fSuccess(oData.results);
												self.hideBusy();
											},
											function(oError) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_COST_ASSIGNMENT_WORKLIST_TYPE_COLLECTION));
												self.hideBusy(true);
												self.processError(oError);
											});
						}
					},

					getCostAssignmentTypeListCollection : function(fieldName,
							top, skip, searchString, fieldRelated, begDa, endDa, fSuccess) {
						this.showBusy();
						var self = this;
						if (jQuery.sap.getUriParameters().get("responderOn")) {
							var jsonModel = new sap.ui.model.json.JSONModel();
							jsonModel
									.loadData(
											"resources/model/CostAssignmentTypeList.json",
											{}, false);
							fSuccess(jsonModel.getData());
							self.hideBusy();
						} else {
							var queryString = [ "$filter=FieldName eq '"
									+ fieldName + "'" ];
							queryString[0] += " and StartDate eq '" + encodeURIComponent(begDa) + "'"+" and EndDate eq '" + encodeURIComponent(endDa) + "' ";//adding begin and end dates to the filter
							
							if (searchString) {
								queryString[0] += "and substringof('"
										+ encodeURIComponent(searchString)
										+ "',FieldValue)";
							}
							//NOTE related input help
							if(fieldRelated){
                                queryString[0] += "and FieldRelated eq '" + encodeURIComponent(fieldRelated) + "'";
                        }
							//End of NOTE related input help
							queryString[0] += "&$top=" + top + "&$skip=" + skip;
							this._initialize();

							jQuery.sap.measure
									.start(hcm.emp.mytimesheet.utils.PerfUtils
											.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_WORK_DAYS));
							this.oDataModel
									.read(
											"/ValueHelpList",
											null,
											queryString,
											true,
											function(oData) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_COST_ASSIGNMENT_TYPE_LIST_COLLECTION));
												fSuccess(oData.results);
												self.hideBusy();
											},
											function(oError) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_COST_ASSIGNMENT_TYPE_LIST_COLLECTION));
												self.hideBusy(true);
												self.processError(oError);
											});
						}
					},

					getInitialInfos : function(appController,begda, endda, fSuccess) {
						if (jQuery.sap.getUriParameters().get("responderOn")) {
							var jsonModel = new sap.ui.model.json.JSONModel();
							jsonModel.loadData(
									"resources/model/InitialInfos.json", {},
									false);
							fSuccess(jsonModel.getData());
						}

						else {
							this._initialize(appController);
							var self = this;
							jQuery.sap.measure
									.start(hcm.emp.mytimesheet.utils.PerfUtils
											.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_WORK_DAYS));
							this.oDataModel
									.read(
											"/InitialInfos",
											null,
											[ "$filter=StartDate eq '" + begda
													+ "' and EndDate eq '"
													+ endda + "'" ],
											false,
											function(oData) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_INITIAL_INFOS));
												var data = oData.results[0];
												if (data) {
													
													var initialInfoModel = new sap.ui.model.json.JSONModel(
															{
																newItemCount : self.oBundle.getText(
																		'MISSING_DAYS', [ 0 ]),
																//itemCount : missingDays,
																showBusyIndicator : false,
																modellingName:"initialInfoModel"
															});

													initialInfoModel
															.setProperty(
																	"/quickEntryCounter",
																	data.Counter);// the
																					// quick
																					// entry
																					// counter
																					// is
													// needed when we submit the
													// quick entry
													initialInfoModel
															.setProperty(
																	"/startDate",
																	data.StartDate);
													initialInfoModel
															.setProperty(
																	"/endDate",
																	data.EndDate);
													initialInfoModel
															.setProperty(
																	"/clockEntry",
																	data.ClockEntry == "TRUE");
													initialInfoModel							//Note 1959135: Quantity input field
															.setProperty(
																	"/decimalTimeEntry", true);
													initialInfoModel
															.setProperty(
																	"/allowNonWorkingDays",
																	data.AllowNonWorkingDays == "TRUE");
													initialInfoModel
															.setProperty(
																	"/itemCount",
																	parseInt(data.MissingDays
																			.trim()));
													initialInfoModel
															.setProperty(
																	"/allHours",
																	parseFloat(data.AllHours
																			.trim()));
													initialInfoModel
															.setProperty(
																	"/weekHours",
																	parseFloat(data.WeekHours
																			.trim()));
													initialInfoModel
															.setProperty(
																	"/monthHours",
																	parseFloat(data.MonthHours
																			.trim()));
													//Adding Release Allowed property to the initial info Model
													initialInfoModel
													.setProperty(
															"/releaseAllowed",
															data.ReleaseAllowed == "TRUE");
													
													//NOTE Adding Release Future property to the initial info Model
													initialInfoModel
													.setProperty(
															"/releaseFuture",
															data.ReleaseFuture == "TRUE");
													
													appController.oApplication.setModel(initialInfoModel,"timesheet_initialInfo");
													
												}
												for(var i=0;i<oData.results.length;i++){
													oData.results[i].Level=oData.results[i].Level.toString().trim();
												}
												fSuccess(oData.results);
											},
											function(oError) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_INITIAL_INFOS));
												self.processError(oError);
											});
						}
					},

					submitQuickEntry : function(appController,begda, endda, fnSuccess,
							fnFailure) {

						
						this._initialize(appController);
						var mainModel = appController.oApplication.getModel("timesheet_initialInfo");
						var data = {};
						data.EndDate = endda;
						data.StartDate = begda;
						data.Counter = mainModel.getData().quickEntryCounter;
						if (jQuery.sap.getUriParameters().get("responderOn")) {
							fnSuccess();
							return;// no posting with mock data
						}
						this.showBusy();
						var self = this;
						var oModel = this.oDataModel;
						
						 	oModel.refreshSecurityToken(
										function(oData, oResponse) {
											oModel.oHeaders = {
														"x-csrf-token" : oResponse.headers["x-csrf-token"],
														"Accept" : "application/json"
													};
													jQuery.sap.measure.start(hcm.emp.mytimesheet.utils.PerfUtils.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_SUBMIT_QUICK_ENTRY));
											oModel.create(
															"/InitialInfos",
															data,
															null,
															function(oData,
																	oResponse) {
																jQuery.sap.measure
																		.end(hcm.emp.mytimesheet.utils.PerfUtils
																				.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_SUBMIT_QUICK_ENTRY));
																fnSuccess();
																self._initialize();
																self
																		.hideBusy(true);
																sap.m.MessageToast
																		.show(self.oConfiguration
																				.getText("SUBMIT_SUCCESS"));
															},
															function(oError) {
																jQuery.sap.measure
																		.end(hcm.emp.mytimesheet.utils.PerfUtils
																				.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_SUBMIT_QUICK_ENTRY));
																self
																		.hideBusy(true);
																var messageDetails = "";
																if (oError.response) {
																	var body = oError.response.body;
																	var indexErr = body
																			.indexOf("errordetails");
																	var msgs = body
																			.substring(
																					indexErr)
																			.split(
																					"message");
																	for ( var i = 1; i < msgs.length; i++) {
																		var msg = msgs[i];
																		var indexEnd = msg
																				.indexOf(",");
																		if (indexEnd > -1) {
																			messageDetails = messageDetails
																					+ msg
																							.substring(
																									3,
																									indexEnd - 1)
																					+ '\r\n';
																		}
																	}
																}
																/*var bundle = self.oDescriptor
																		.getBundle();*/
																self._initialize(appController);
																var bundle = self.oBundle;
																var oMessage = {
																	message : self.oConfiguration
																			.getText("ERROR_SUBMIT_AUTO_ENTRY"),
																	details : messageDetails,
																	type : sap.ca.ui.message.Type.ERROR
																};
																
																
																  sap.ca.ui.message.showMessageBox({
												                       type: oMessage.type,
												                       message: oMessage.message,
												                       details: oMessage.details
												                   });

																fnFailure();
															});

										}, function(oError) {
											self.hideBusy(true);
											self.processError(oError);
											fnFailure();
										}, true);

					},
					checkSubmittedTime : function(appController,timeEntryCreated,
							timeEntryUpdated, timeEntryDeleted, fnSuccess,
							fnFailure) {
						this.showBusy();
						
						this._initialize(appController);
						var self = this;

						var arrEntry1 = timeEntryCreated
								.concat(timeEntryUpdated);
						var finalEntry = arrEntry1.concat(timeEntryDeleted);
						
						var mainModel = this.oDataModel;
						// keep posts with errors
						this.errors = [];
						this.responseData = [];
							
							mainModel
								.refreshSecurityToken(
										function(oData, oResponse) {
											var str = JSON.stringify(finalEntry);
											var str1 = {
													"checkTimeString":str
													};
											
											mainModel.create("/CheckTimeEntries",str1,null,function(){
												
												fnSuccess();
												self.hideBusy(true);
												
											},function(oData) {
												
												

												   
												if(oData.response){
													
													var message = oData.message;
													  			
													// parse error from response
													var body = oData.response.body;
													var jsonData = JSON.parse(body);
													var jsonDataLength=(jsonData.error.innererror.errordetails.length-1);//last error msg is meaningless for the end user and henced removed
													var errcode="";
													for(var i = 0; i<jsonDataLength;i++){//checking for multiple errors
													
														message=jsonData.error.innererror.errordetails[i].message;
														errcode=jsonData.error.innererror.errordetails[i].code;
													self.errors.push({
														
														code : errcode,
														message : message
													});	
													}
												}

											// after submit release busy icon and call fail functions
												if(oData.response){
											self.hideBusy(true);
											if (self.errors.length > 0) {
												var messageList = "";
												for ( var i = 0; i < self.errors.length; i++) {
													messageList = messageList + self.errors[i].code + ": " + self.errors[i].message + '\r\n';
												}
												var oMessage = {
														message : self.oConfiguration
																.getText("ERROR_SUBMIT"),
														details : messageList,
														type : sap.ca.ui.message.Type.ERROR
													};
													
													sap.ca.ui.message.showMessageBox({
									                       type: oMessage.type,
									                       message: oMessage.message,
									                       details: oMessage.details
									                   });
												fnFailure(self.errors, self.responseData);
											}
												}
										},true);
										
										}, function(oError) {
											//error function for mainModel.refreshSecurityToken
											self.hideBusy(true);
										}, true);

					},

					submitTimeEntry : function(appController,timeEntryCreated,
							timeEntryUpdated, timeEntryDeleted, fnSuccess,
							fnFailure) {
						this.showBusy();
						
						this._initialize(appController);
						var self = this;

						var arrEntry1 = timeEntryCreated
								.concat(timeEntryUpdated);
						var finalEntry = arrEntry1.concat(timeEntryDeleted);
						
						var mainModel = this.oDataModel;
						// keep posts with errors
						this.errors = [];
						this.responseData = [];
							
							mainModel
								.refreshSecurityToken(
										function(oData, oResponse) {
											for ( var i = 0; i < finalEntry.length; i++) {
												self.data = finalEntry[i];
												var batch = mainModel
														.createBatchOperation(
																"/TimeEntries",
																"POST",
																self.data);
												var batchchanges = [];
												batchchanges.push(batch);
												mainModel
														.addBatchChangeOperations(batchchanges);
											}

											mainModel
													.submitBatch(
															function(oData,
																	oResponse,
																	aErrorResponses) {
																for ( var i = 0; i < oData.__batchResponses.length; i++) {

																	if (oData.__batchResponses[i].response) {

																		var message = oData.__batchResponses[i].message;
																		var status;
																		status = oData.__batchResponses[i].response.statusText;
																		// parse
																		// error
																		// from
																		// response
																		var body = oData.__batchResponses[i].response.body;
																		var indexErr = body
																				.indexOf("errordetails");
																		if (indexErr > -1) {
																			var indexMsg = body
																					.substring(
																							indexErr)
																					.indexOf(
																							"message");
																			var indexEnd = body
																					.substring(
																							indexErr
																									+ indexMsg)
																					.indexOf(
																							",");
																			if (indexEnd > -1) {
																				message = body
																						.substring(
																								indexErr
																										+ indexMsg
																										+ 10,
																								indexErr
																										+ indexMsg
																										+ indexEnd
																										- 1);
																			}
																		}

																		self.errors
																				.push({
																					counter : finalEntry[i].Counter,
																					workdate : finalEntry[i].TimeEntryDataFields.WORKDATE,
																					time : finalEntry[i].TimeEntryDataFields.CATSHOURS,
																					message : message
																				});

																	} else if (oData.__batchResponses[i].__changeResponses) {
																		self.responseData
																				.push(oData.__batchResponses[i].__changeResponses[0].data);
																	}

																}

																// after submit release busy icon and call success/fail functions
																self.hideBusy(true);
																
																self._initialize();

																var bundle = self.oBundle;
																if (self.errors.length > 0) {
																	var messageList = "";
																	for ( var i = 0; i < self.errors.length; i++) {
																		var date_str = self.errors[i].workdate;
																		var y = parseInt(
																				date_str
																						.substr(
																								0,
																								4),
																				10);
																		var m = parseInt(
																				date_str
																						.substr(
																								4,
																								2),
																				10) - 1;
																		var d = parseInt(
																				date_str
																						.substr(
																								6,
																								2),
																				10);

																		var dateError = sap.ui.core.format.DateFormat
																				.getDateInstance(
																						{
																							style : "short"
																						})
																				.format(
																						new Date(
																								y,
																								m,
																								d,
																								0,
																								0,
																								0,
																								0));

																		messageList = messageList
																				+ dateError
																				+ ": "
																				+ self.errors[i].message
																				+ '\r\n';
																	}
																	var oMessage = {
																		message : self.oConfiguration
																				.getText("ERROR_SUBMIT"),
																		details : messageList,
																		type : sap.ca.ui.message.Type.ERROR
																	};
																	
																	sap.ca.ui.message.showMessageBox({
													                       type: oMessage.type,
													                       message: oMessage.message,
													                       details: oMessage.details
													                   });

																	fnFailure(
																			self.errors,
																			self.responseData);
																} else {
																	fnSuccess();
																}

															},
															function(oError) {
																//error function for mainModel.submitBatch
																self
																		.hideBusy(true);

															});

										}, function(oError) {
											//error function for mainModel.refreshSecurityToken
											self.hideBusy(true);
										}, true);

					},

					showBusy : function() {
						this._nCounter++;
						if (this._nCounter == 1) {
							//this._busyDialog.open();
						sap.ca.ui.utils.busydialog.requireBusyDialog();

						}
					},

					hideBusy : function(forceHide) {
						if(this._nCounter==0)
							return;
						this._nCounter = forceHide ? 0 : Math.max(0,
								this._nCounter - 1);
						if (this._nCounter > 0) {
							return;
						}
						sap.ca.ui.utils.busydialog.releaseBusyDialog();

						//this._busyDialog.close();
					},

				});

},
	"hcm/emp/mytimesheet/utils/HelperMethod.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */

},
	"hcm/emp/mytimesheet/utils/InitialConfigHelper.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.mytimesheet.utils.InitialConfigHelper");
jQuery.sap.require("hcm.emp.mytimesheet.utils.ConnectionHelper");

hcm.emp.mytimesheet.Configuration.extend("hcm.emp.mytimesheet.utils.InitialConfigHelper", {
			
		getText : function(sKey, aParams) {
			return this.oBundle.getText(sKey, aParams);
		},
		
		getClockEntry : function() {
			return this.initialInfoModel.getData().clockEntry;
		},
		
/*Note 1959135: Quantity input field*/
		getDecimalTimeEntry : function() {
			return this.initialInfoModel.getData().decimalTimeEntry;
		},

		getAllowNonWorkingDays : function() {
			return this.initialInfoModel.getData().allowNonWorkingDays;
		},

		getQuickEntryCounter : function() {
			return this.initialInfoModel.getData().quickEntryCounter;
		},

		getStartDate : function() {
			return this.initialInfoModel.getData().startDate;
		},

		getEndDate : function() {
			return this.initialInfoModel.getData().endDate;
		},
		setInitialInfoModel: function(initialInfoModel){
			this.initialInfoModel = initialInfoModel;
		},
		setResourceBundle: function(resourceBundle){
			this.oBundle = resourceBundle;
		}
	
});

},
	"hcm/emp/mytimesheet/utils/PerfUtils.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.mytimesheet.utils.PerfUtils");

hcm.emp.mytimesheet.utils.PerfUtils = {
		
	TIMESHEET_MAIN_LOAD : "hcm.emp.mytimesheet.TIMESHEET_MAIN_LOAD",
	TIMESHEET_MAIN_QUICK_ENTRY_SUBMIT : "hcm.emp.mytimesheet.TIMESHEET_MAIN_QUICK_ENTRY_SUBMIT",
	TIMESHEET_SETTINGS_INIT : "hcm.emp.mytimesheet.TIMESHEET_SETTINGS_INIT",
	WEEK_ENTRY_LOAD : "hcm.emp.mytimesheet.WEEK_ENTRY_LOAD",
	EDIT_ENTRY_LOAD : "hcm.emp.mytimesheet.EDIT_ENTRY_LOAD",
	COST_ASSIGNMENT_LOAD : "hcm.emp.mytimesheet.COST_ASSIGNMENT_LOAD",
	COST_ASSIGNMENT_SEARCH_LOAD : "hcm.emp.mytimesheet.COST_ASSIGNMENT_SEARCH_LOAD",
	WEEK_ENTRY_SUBMIT : "hcm.emp.mytimesheet.WEEK_ENTRY_SUBMIT",
	SERVICE_GET_WORK_DAYS : "hcm.emp.mytimesheet.SERVICE_GET_WORK_DAYS",
	SERVICE_GET_PROJECT_SUMMARY : "hcm.emp.mytimesheet.SERVICE_GET_PROJECT_SUMMARY",
	SERVICE_GET_WORKLIST_COLLECTION : "hcm.emp.mytimesheet.SERVICE_GET_WORKLIST_COLLECTION",
	SERVICE_GET_COST_ASSIGNMENT_WORKLIST_COLLECTION : "hcm.emp.mytimesheet.SERVICE_GET_COST_ASSIGNMENT_WORKLIST_COLLECTION",
	SERVICE_GET_COST_ASSIGNMENT_WORKLIST_TYPE_COLLECTION : "hcm.emp.mytimesheet.SERVICE_GET_COST_ASSIGNMENT_WORKLIST_TYPE_COLLECTION",
	SERVICE_GET_COST_ASSIGNMENT_TYPE_LIST_COLLECTION : "hcm.emp.mytimesheet.SERVICE_GET_COST_ASSIGNMENT_TYPE_LIST_COLLECTION",
	SERVICE_GET_INITIAL_INFOS : "hcm.emp.mytimesheet.SERVICE_GET_INITIAL_INFOS",
	SERVICE_GET_TIME_ENTRY : "hcm.emp.mytimesheet.SERVICE_GET_TIME_ENTRY",
	SERVICE_GET_PROJECTS : "hcm.emp.mytimesheet.SERVICE_GET_PROJECTS",
	SERVICE_GET_TASK_TYPES : "hcm.emp.mytimesheet.SERVICE_GET_TASK_TYPES",
	SERVICE_SUBMIT_QUICK_ENTRY : "hcm.emp.mytimesheet.SERVICE_SUBMIT_QUICK_ENTRY",
	SERVICE_GET_SETTINGS : "hcm.emp.mytimesheet.SERVICE_GET_SETTINGS",
	SERVICE_SET_SETTINGS : "hcm.emp.mytimesheet.SERVICE_SET_SETTINGS",
	HELP_INIT : "hcm.emp.mytimesheet.HELP_INIT",
	_mCounter : {},
	getMeasurements : function() {
		var aMeasures = jQuery.sap.measure.getAllMeasurements();
		var aOutputs = [];
		for ( var i in aMeasures) {
			var oMeasure = aMeasures[i];
			if (oMeasure.id.indexOf("sap.hcm.timesheet") === 0) {
				var oOutput = {
					"id" : oMeasure.id,
					"info" : (oMeasure.info ? oMeasure.info : ''),
					"start" : oMeasure.start.toString(),
					"end" : oMeasure.end.toString(),
					"time" : oMeasure.time,
					"duration" : oMeasure.duration
				};
				aOutputs.push(oOutput);
			}
		}
		var sOutput = JSON.stringify(aOutputs);
		return sOutput;
	},
	getStartId : function(id) {
		if (hcm.emp.mytimesheet.utils.PerfUtils._mCounter[id] === undefined) {
			hcm.emp.mytimesheet.utils.PerfUtils._mCounter[id] = -1;
		}
		hcm.emp.mytimesheet.utils.PerfUtils._mCounter[id]++;
		return id + " ("
				+ hcm.emp.mytimesheet.utils.PerfUtils._mCounter[id] + ")";
	},
	getEndId : function(id) {
		if (hcm.emp.mytimesheet.utils.PerfUtils._mCounter[id] === undefined) {
			hcm.emp.mytimesheet.utils.PerfUtils._mCounter[id] = 0;
		}
		return id + " ("
				+ hcm.emp.mytimesheet.utils.PerfUtils._mCounter[id] + ")";
	},
	start : function(id, subId) {
		if (subId) {
			id += "_" + subId;
		}
		jQuery.sap.measure.start(hcm.emp.mytimesheet.utils.PerfUtils
				.getStartId(id));
	},
	end : function(id, subId) {
		if (subId) {
			id += "_" + subId;
		}
		jQuery.sap.measure.end(hcm.emp.mytimesheet.utils.PerfUtils
				.getEndId(id));
	}

};

},
	"hcm/emp/mytimesheet/view/S2.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("hcm.emp.mytimesheet.model.TimeEntry");
jQuery.sap.require("hcm.emp.mytimesheet.utils.ConnectionHelper");
jQuery.sap.require("hcm.emp.mytimesheet.utils.InitialConfigHelper");

sap.ca.scfld.md.controller.BaseFullscreenController
		.extend(
				"hcm.emp.mytimesheet.view.S2",
				{
	
//					Controller Hook method definitions
					extHookCalendarMonthChange: null,
					extHookGetUserInfo: null,
					extHookGetTimeSheetCalendar: null,
					extHookUpdateData: null,
					
					
					onInit : function() {
						// execute the onInit for the base class
						// BaseDetailController
						sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit
								.call(this);

						this.oApplication = this.oApplicationFacade.oApplicationImplementation;
						//this.oConfiguration = this.oApplication.oConfiguration;
						this.oConfiguration = new hcm.emp.mytimesheet.utils.InitialConfigHelper();
						
						this.oConnectionManager = this.oApplication.oConnectionManager;
						this.oBundle = this.oApplicationFacade.getResourceBundle();
						this.oConfiguration.setResourceBundle(this.oBundle);
						// Listener for navigation 37
						this.isRoot = true;
						var self = this;
						//var view = this.getView();
						this.oRouter
								.attachRouteMatched(
										function(oEvent) {
											if (oEvent.getParameter("name") === "S2") {
												this.isRoot = false;
												
												self.refreshPage();
												var calendar = self.byId("calendar");
												calendar.unselectAllDates();
												/*if(this.oApplication.getModel("TSM_WEEKLY")){
													var startDay=this.oApplication.getModel("TSM_WEEKLY").getData().start;
													var selectedDate=sap.ui.core.format.DateFormat.getDateInstance({style:"short"}).parse(startDay);
													this.oModel.setProperty("/month", selectedDate.getMonth());
													this.oModel.setProperty("/year", selectedDate.getFullYear());
													this.updateData(selectedDate.getMonth());
													calendar.setCurrentDate(selectedDate);
												}*/

											}
											//self.refreshPage();
										}, this);

						this.oModel = new sap.ui.model.json.JSONModel();
						var now = new Date();
						this.oModel.setData({
							quickEntryAllowed : true,
							year : now.getFullYear(),
							month : now.getMonth(),
							allAllowed : true,
							weekAllowed : true,
							monthAllowed : true
						});
						//For legends to work for first time 
						//this.updateData(this.oModel.getData().month);
						
						if (!this.oService) {
							this.oService = new hcm.emp.mytimesheet.Service();
						}

						
						//code copied from copmpoenent.js since it changed 
/*						sap.ui.core.UIComponent.prototype.init.apply(this,
								arguments); // calls createContent (among others)

						this.getRouter().attachRouteMatched(
								this._handleRouteMatched);

						// this component should automatically initialize the router!
						this.getRouter().initialize();*/

						//code copied from init of Descriptor.js of wave1 application

/*						var oDataServiceURI = "/sap/opu/odata/sap/SRA002_TIMESHEET_SRV/";
						if (window.location.href.indexOf("local") > -1) {
							//oDataServiceURI = "proxy/http/ldcigm6.wdf.sap.corp:50033/sap/opu/odata/sap/SRA002_TIMESHEET_SRV/";
							oDataServiceURI = "/sap/opu/odata/sap/SRA002_TIMESHEET_SRV/?sap-server=gm6-http";
						}

						var mainModel = new sap.ui.model.odata.ODataModel(
								oDataServiceURI, true);
						mainModel
								.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
						var missingDays = 0;*/
						
						
						/*var initialInfoModel = new sap.ui.model.json.JSONModel(
								{
									//newItemCount : this.getText('MISSING_DAYS', [ 0 ]),
									itemCount : missingDays,
									//applicationIcon : this.oHomeIcon['phone'],
									showBusyIndicator : false
								});*/

						/*sap.ui.getCore().setModel(initialInfoModel,
								"timesheet_initialInfo");*/
		
					},

					onCalendarMonthChange : function(oEvent) {
						var date = new Date(oEvent.getParameters().currentDate);
						this.oModel.setProperty("/month", date.getMonth());
						this.oModel.setProperty("/year", date.getFullYear());
						this.updateData(date.getMonth());

						/**
					     * @ControllerHook Extend behavior of Calendar Month Change
					     * This hook method can be used to add UI or business logic 
					     * It is called when the CalendarMonthChange method executes
					     * @callback hcm.emp.mytimesheet.view.S2~extHookCalendarMonthChange
					     */
							if(this.extHookCalendarMonthChange) {
								this.extHookCalendarMonthChange();
					  	};
					},

					refreshPage : function() {
						this.updateData(this.oModel.getData().month);
						this.getUserInfo();
					},

					getUserInfo : function() {
						var oModel = this.oModel;
						var mainItem = null;
						var subItems = null;
						var date = new Date();
						var month = this.oModel.getData().month;
						var year = this.oModel.getData().year;
						var startDate = new Date(year, month, 1);
						var self = this;

						var ofuncSuccess = function(data) {
							
							var initialInfoData= data[0];
							
							if(initialInfoData){

							if (data[0]) {
								oModel.setProperty("/quickEntryAllowed",
										data[0].Counter != null
												&& data[0].Counter.length > 0);

							}


							for ( var i = 0; i < data.length; i++) {
								if (data[i].FieldName == "TIME") {
								} else if (data[i].Level.trim() == "0") {// this is
									// the Bold
									// item
									mainItem = data[i].FieldValueText;
								} else {
									if (subItems) {
										subItems += ", "
												+ data[i].FieldValueText;
									} else {
										subItems = data[i].FieldValueText;
									}
								}
							}

							oModel.setProperty("/mainItem", mainItem);
							oModel.setProperty("/subItems", subItems);
							
							var InitalInfoModel = self.oApplication.getModel("timesheet_initialInfo");
							self.oConfiguration.setInitialInfoModel(InitalInfoModel);
							self.monitorPageRefreshEnded();
							}
						};

						if (!this.oService) {
							this.oService = new hcm.emp.mytimesheet.Service();
						}

						this.oService.getInitialInfos(this,this
								.getDateStr(startDate), this.getDateStr(date),
								ofuncSuccess);

						/**
					     * @ControllerHook Extend behavior of get user info
					     * This hook method can be used to add UI or business logic 
					     * It is called when the getUserInfo method executes
					     * @callback hcm.emp.mytimesheet.view.S2~extHookGetUserInfo
					     */
							if(this.extHookGetUserInfo) {
								this.extHookGetUserInfo();
					  	};

					},

					onWeeklyEntry : function(oEvent) {

						if (sap.ui.getCore().isLocked()) {
							return;
						}
						// logic is move form this view to week entry view
						// to accommodate the new navigation logic
						var dateStr = oEvent.getParameter("date");
						var date = new Date();
						date = date + "";
						var datastr = date.substring(0, 15);
						// get first day of week from calendar
						var calendar = this.byId("calendar");

						if (jQuery.sap.getUriParameters().get("old")) {
							this.oRouter.navTo("WeekEntry", {
								context : dateStr + 'offset'
										+ calendar.getFirstDayOffset()
							},true);

						}else{
						
		
						this.oRouter.navTo("S3", {
							context : dateStr + 'offset'
									+ calendar.getFirstDayOffset()
						},true);

						}
					},

					getTimeSheetCalendar : function(data) {
						// analyze data
						var calendar = this.byId("calendar");
						calendar.removeTypesOfAllDates();

						var now = new Date();
						var grey = [];
						var red = [];
						var green = [];
						var yellow = [];
						var rejected = [];
						var futureWorkDays = [];

						// get first day of the week
						var firstDayOff = -1;
						if (data.length > 0) {
							var firstDay = data[0].FirstDayOfWeek;
							if (firstDay == null) {
								firstDayOff = -1;
							} else if (firstDay == "MONDAY") {
								firstDayOff = 1;
							} else if (firstDay == "TUESDAY") {
								firstDayOff = 2;
							} else if (firstDay == "WEDNESDAY") {
								firstDayOff = 3;
							} else if (firstDay == "THURSDAY") {
								firstDayOff = 4;
							} else if (firstDay == "FRIDAY") {
								firstDayOff = 5;
							} else if (firstDay == "SATURDAY") {
								firstDayOff = 6;
							} else if (firstDay == "SUNDAY") {
								firstDayOff = 0;
							}
						}

						// set in calendar only if get meaningful value from
						// service
						if (firstDayOff > 0) {
							calendar.setFirstDayOffset(firstDayOff);
						}

						for ( var i = 0; i < data.length; i++) {
							var dateToWork = data[i].Date;
							var workingDay = data[i].WorkingDay == "TRUE";
							var status = data[i].Status;
							var date = new Date(parseInt(dateToWork.substring(
									0, 4), 10), parseInt(dateToWork.substring(
									4, 6), 10) - 1, parseInt(dateToWork
									.substring(6, 8), 10));
							if (!workingDay) {
								// add to holidays to grey out
								grey.push(date);
							}
							if(status == "NONE"){
								//do nothing
							}
							if (status == "YACTION" && workingDay) {
								// fill red only if earlier then today
								if (now.getTime() > date.getTime()) {
									red.push(date);
								}
								else{
                                    futureWorkDays.push(date);
								}
							}
							if (status == "MACTION" && workingDay) {
								// add missing days as green with yellow
								yellow.push(date);
							}
							if (status == "DONE" && workingDay) {
								// add filled days as green
								green.push(date);
							}
							if (status == "REJECTED") {
								rejected.push(date);
							}

						}
						calendar.toggleDatesType(yellow,
								sap.me.CalendarEventType.Type04, true);
						calendar.toggleDatesType(green,
								sap.me.CalendarEventType.Type01, true);
						calendar.toggleDatesType(grey,
								sap.me.CalendarEventType.Type00, true);
						calendar.toggleDatesType(red,
								sap.me.CalendarEventType.Type07, true);
						calendar.toggleDatesType(rejected,
								sap.me.CalendarEventType.Type06, true);
						calendar.toggleDatesType(futureWorkDays, 
								sap.me.CalendarEventType.Type10, true);
						
						var oLegendControl = this.byId("LEGEND");
						oLegendControl
								.setLegendForType01(green.length > 0 ? this.oConfiguration
										.getText("FILLED_DAY")
										: null);
						oLegendControl
								.setLegendForType04(yellow.length > 0 ? this.oConfiguration
										.getText("FILLED_MANAGER")
										: null);
						oLegendControl
								.setLegendForType07(red.length > 0 ? this.oConfiguration
										.getText("MISSING_DAY")
										: null);
						oLegendControl
								.setLegendForType06(rejected.length > 0 ? this.oConfiguration
										.getText("REJECTED")
										: null);
						oLegendControl
                        		.setLegendForNormal(futureWorkDays.length > 0 ? this.oConfiguration  
                                      .getText("WORKING_DAY")
                                      : null);
						oLegendControl
								.setLegendForType00(grey.length > 0 ? this.oConfiguration
										.getText("NON_WORKING_DAY")
										: null);


						this.oModel.setProperty("/filledDayVisible",
								green.length > 0);
						this.oModel.setProperty("/approvalVisible",
								yellow.length > 0);
						this.oModel.setProperty("/missingDayVisible",
								red.length > 0);
						this.oModel.setProperty("/rejectedVisible",
								rejected.length > 0);
						this.monitorPageRefreshEnded();

						/**
					     * @ControllerHook Extend behavior of  get TimeSheet Calendar
					     * This hook method can be used to add UI or business logic 
					     * It is called when the getTimeSheetCalendar method executes
					     * @callback hcm.emp.mytimesheet.view.S2~extHookGetTimeSheetCalendar
					     */
							if(this.extHookGetTimeSheetCalendar) {
								this.extHookGetTimeSheetCalendar();
					  	};

					},
					parseDateYYYYMMdd : function(dateString) {
						var dateParse = sap.ui.core.format.DateFormat
								.getDateInstance({
									pattern : "YYYYMMdd"
								});

						var selectedDate = new Date(dateString);

						return dateParse.format(selectedDate);
					},
					updateData : function(month) {
						// define date range to retrieve data
						var prevMonth = new Date();
						prevMonth.setDate(1);
						prevMonth.setYear(this.oModel.getData().year);
						prevMonth.setMonth(month);
						prevMonth.setDate(0); // To go to last day of previous
						// month
						var lastDayOfPrevMonth = prevMonth.getDate();
						var startDate = new Date();
						startDate.setYear(this.oModel.getData().year);
						startDate.setMonth(month);
						startDate.setDate(1);
						var firstDayOfWeek = startDate.getDay();
						var startDay = lastDayOfPrevMonth
								- (firstDayOfWeek - 1);
						if (startDay != 1) {
							prevMonth.setDate(startDay);
							startDate = prevMonth;
						}

						// end date in calendar - first try 5 weeks from start
						// date, then check if
						// one more week is needed
						var endDate = new Date();
						endDate.setFullYear(startDate.getFullYear());
						endDate.setMonth(startDate.getMonth());
						endDate.setDate(startDate.getDate() + 34);
						var lastDayHelp = new Date();
						lastDayHelp.setFullYear(endDate.getFullYear());
						month++;
						lastDayHelp.setMonth(month);
						lastDayHelp.setDate(0);
						if (endDate.getTime() < lastDayHelp.getTime()) {
							// add one more week
							endDate.setDate(endDate.getDate() + 7);
						}
						var self = this;
						if (!this.oService) {
							this.oService = new hcm.emp.mytimesheet.Service();
						}
						this.oService.getWorkDays(this,""
								+ this.getDateStr(startDate), ""
								+ this.getDateStr(endDate), function(data) {
							self.getTimeSheetCalendar(data);
							self.getTimeSheetCalendar(data);
						});
						/**
					     * @ControllerHook Extend behavior of Update Data
					     * This hook method can be used to add UI or business logic 
					     * It is called when the UpdateData method executes
					     * @callback hcm.emp.mytimesheet.view.S2~extHookUpdateData
					     */
							if(this.extHookUpdateData) {
								this.extHookUpdateData();
					  	};
					},
					monitorPageRefreshEnded : function() {
						var ownPointer = this;
/*						if (typeof self != 'undefined') {
							ownPointer = self;
						} else {
							ownPointer = this;
						}*/
						if ("pageRefreshPartOneEnded" in ownPointer) {

							delete ownPointer.pageRefreshPartOneEnded;
						} else {
							ownPointer.pageRefreshPartOneEnded = true;
						}
					},
					getDateStr : function(date) {
						return "" + date.getFullYear()
								+ ("" + (date.getMonth() + 101)).substring(1)
								+ ("" + (date.getDate() + 100)).substring(1);
					},
					setPostObject : function(Counter, TimeEntryOperation,
							WORKDATE, CATSAMOUNT, Name, Code, notes, startTime,
							endTime, subItems, childCodes, childNames) {
						var timeEntryUpdated = {
							Counter : Counter, 
							TimeEntryOperation : TimeEntryOperation,
							TimeEntryDataFields : {
								WORKDATE : WORKDATE,
								CATSAMOUNT : "" + CATSAMOUNT,
								BEGUZ : startTime,
								ENDUZ : endTime
							},

						};
 
						// always send as blank						
						//timeEntryUpdated.TimeEntryRelease = " ";

						/*
						 * if(this.releaseAllowed){
						 * timeEntryUpdated.TimeEntryRelease = " "; }else{
						 * timeEntryUpdated.TimeEntryRelease = "X"; }
						 */

						if(this.checkFieldName(Name) === true){
							timeEntryUpdated.TimeEntryDataFields[Name] = Code;
						}

						if (subItems && subItems !== "") {
							for ( var i = 0; i < childNames.length; i++) {
								if(this.checkFieldName(childNames[i]) === true){
									timeEntryUpdated.TimeEntryDataFields[childNames[i]] = childCodes[i];
								}
							}
						}
						if (notes && notes !== "") {
							timeEntryUpdated.TimeEntryDataFields.LONGTEXT_DATA = notes;
							timeEntryUpdated.TimeEntryDataFields.LONGTEXT = "X";

						}

						return timeEntryUpdated;
					},
					//Note 1959135: Check for special fieldnames
					checkFieldName : function(fieldName){
					    var checkString = new String(fieldName);
					    if(checkString.match("DISPTEXT")){
					                    return false;
					    }
					    if(checkString.match("CPR_OBJTEXT")){
					                    return false;
					    }
					    if(checkString.match("CPR_TEXT")){
					                    return false;
					    }
					    return true;
					},
					/**
					 * @override
					 * 
					 * @param sFilterPattern
					 * @returns {*}
					 */
					applySearchPattern : function(sFilterPattern) {

						sFilterPattern = sFilterPattern.toLowerCase();

						if (this.getList()) {
							var aListItems = this.getList().getItems();
							var bVisibility;

							var iCount = 0;
							for ( var i = 0; i < aListItems.length; i++) {
								bVisibility = this
										.applySearchPatternToListItem(
												aListItems[i], sFilterPattern);
								aListItems[i].setVisible(bVisibility);
								if (bVisibility) {
									iCount++;
								}
							}
							// TODO
							// todo: this.setListCount(iCount);
						}
					},
								
					onQuickEntryWithvalueHelp : function() {
                        var self = this;
                        self.getWorkListCollection();
                        var mainModel = self.oApplication.getModel(
                                      "timesheet_initialInfo");
                        if (mainModel.getData().allHours) {
                               this.oModel.setProperty("/allAllowed", true);
                               this.oModel.setProperty("/all", this.oBundle
                                             .getText("ALL_MISSING", [ mainModel
                                                          .getData().allHours ]));
                        } else {
                               this.oModel.setProperty("/allAllowed", false);
                        }
                        if (mainModel.getData().weekHours) {
                               this.oModel.setProperty("/weekAllowed", true);
                               this.oModel.setProperty("/week", this.oBundle
                                             .getText("THIS_WEEK",
                                                          [ mainModel.getData().weekHours ]));
                        } else {
                               this.oModel.setProperty("/weekAllowed", false);
                        }
                        if (mainModel.getData().monthHours) {
                               var month = this.oModel.getData().month;
                               var year = this.oModel.getData().year;
                               this.oModel.setProperty("/monthAllowed", true);
                               this.oModel.setProperty("/month_year", this.oBundle
                                            .getText("MONTH_YEAR").replace(
                                                          "{0}",
                                                           this.oBundle.getText("MONTH_FULL_"
                                                                        + month)).replace("{1}",
                                                          year).replace("{2}",
                                                           mainModel.getData().monthHours));
                        } else {
                               this.oModel.setProperty("/monthAllowed", false);
                        }
                        this.oHelp = new sap.m.Input(
                                      {
                                             type : sap.m.InputType.Text,
                                             placeholder : self.oBundle
                                                          .getText('SELECT_PLACEHOLDER')
                                                          + " "
                                                          + self.oBundle
                                                                        .getText('RECENTLY_USED'),
                                             showSuggestion : true,
                                             suggestionItems : {
                                                    path : "/projects",
                                                    template : new sap.ui.core.Item({
                                                          text : "{name}"
                                                    })
                                             },
                                             showValueHelp : true,
                                             suggestionItemSelected : function(oEvent) {
                                                    self.leftButton.setProperty('enabled',
                                                                 true);
                                             },
                                             liveChange : function(oEvent) {
                                                    var inputValue = oEvent.oSource
                                                                 ._getInputValue();
                                                    var flag = false;
                                                    if (inputValue == "")
                                                          self.leftButton.setProperty(
                                                                        "enabled", false);
                                                    var suggestedItems = this.getModel()
                                                                 .getData().projects;
                                                    suggestedItems.forEach(function(item) {
                                                          if (item.name == inputValue)
                                                                 flag = true;
                                                    });
                                                    if (flag)
                                                          self.leftButton.setProperty(
                                                                        "enabled", true);
                                                    else
                                                          self.leftButton.setProperty(
                                                                        "enabled", false);
                                             },
                                             valueHelpRequest : function(oEvent) {
                                            	 	var handleClose;
                                                    handleClose = jQuery
                                                                 .proxy(
                                                                               function(oEvent) {
                                                                                      var oSelectedItem = oEvent
                                                                                                    .getParameter("selectedItem");
                                                                                      if (oSelectedItem) {
                                                                                             self.oHelp
                                                                                                           .setValue(oSelectedItem
                                                                                                                        .getTitle() + ", " + oSelectedItem
                                                                                                                        .getDescription());
                                                                                             self.leftButton
                                                                                                           .setProperty(
                                                                                                                        'enabled',
                                                                                                                        true); // changes
                                                                                             for(var index =0;index < self.workList.length; index++){
																									if(oSelectedItem.getTitle() == self.workList[index].name){
																										self.selectedWorklist = self.workList[index];
																										break;
																									}
																								}
                                                                                      }
                                                                                      oEvent
                                                                                                    .getSource()
                                                                                                    .getBinding(
                                                                                                                 "items")
                                                                                                    .filter([]);
                                                                               }, this);
                                                    if (!this._valueHelpSelectDialog) {
                                                          this._valueHelpSelectDialog = new sap.m.SelectDialog(
                                                                        {
                                                                               title : self.oBundle
                                                                                             .getText('COST_ASSIGNMENT'),
                                                                               items : {
                                                                                      path : "/projects",
                                                                                      template : new sap.m.StandardListItem(
                                                                                                    {
                                                                                                           title : "{name}",
                                                                                                           description : "{others}",
                                                                                                           adaptTitleSize : false,
                                                                                                           active : true
                                                                                                    })
                                                                               },
                                                                               search : function(
                                                                                             oEvent) {
                                                                                      var sValue = oEvent
                                                                                                    .getParameter("value");
                                                                                      var oFilter = new sap.ui.model.Filter(
                                                                                                    "name",
                                                                                                    sap.ui.model.FilterOperator.Contains,
                                                                                                    sValue);
                                                                                      oEvent
                                                                                                    .getSource()
                                                                                                    .getBinding(
                                                                                                                 "items")
                                                                                                    .filter(
                                                                                                                 [ oFilter ]);
                                                                               },
                                                                               confirm : handleClose,
                                                                               cancel : handleClose
                                                                        });
                                                          this._valueHelpSelectDialog
                                                                        .setModel(this.getModel());
                                                    }
                                                    this._valueHelpSelectDialog.open();
                                             }
                                      });
                        this.label1 = new sap.m.Label({
                               text : self.oBundle.getText('COST_ASSIGNMENT'),
                               required : true
                        });
                        this.label2 = new sap.m.Label({
                               text : self.oBundle.getText('ENTRY_VIEW_APPLY_TO')
                        });
                        this.oSelect = new sap.m.Select({
                               width : "100%"
                        });
                        var selectWeek = new sap.ui.core.Item({
                               text : this.oModel.getProperty("/week"),
                               key : "week"
                        });
                        var selectMonth = new sap.ui.core.Item({
                               text : this.oModel.getProperty("/month_year"),
                               key : "month"
                        });
                        var selectAll = new sap.ui.core.Item({
                               text : this.oModel.getProperty("/all"),
                               key : "all"
                        });
                        if (this.oModel.getProperty("/week"))
                               this.oSelect.addItem(selectWeek);
                        if (this.oModel.getProperty("/month_year"))
                               this.oSelect.addItem(selectMonth);
                        if (this.oModel.getProperty("/all"))
                               this.oSelect.addItem(selectAll);
                        this.leftButton = new sap.m.Button(
                                      {
                                             text : self.oBundle.getText('SUBMIT'),
                                             enabled : false,
                                             press : jQuery
                                                          .proxy(
                                                                        function() {
                                                                            //   sap.ui.getCore().lock();
                                                                              
                                                                               var selectedKey = this.oSelect
                                                                                             .getSelectedKey(); // changes
                                                                               //var startDate = null, endDate = null;
                                                                               var cur_date = new Date();
                                                                               var operation = null;
                                                                               if (selectedKey == "week") {
                                                                            	   operation = "W";
                                                                                     /* var date = new Date();
                                                                                      startDate = new Date(
                                                                                                    date
                                                                                                                 .getFullYear(),
                                                                                                    date
                                                                                                                 .getMonth(),
                                                                                                    date
                                                                                                                 .getDate()
                                                                                                                 - date
                                                                                                                               .getDay());
                                                                                      endDate = new Date();
                                                                                      startDate = self
                                                                                                    .getDateStr(startDate);
                                                                                      endDate = self
                                                                                                    .getDateStr(endDate);*/
                                                                            	   
                                                                               } else if (selectedKey == "month") {
                                                                            	   operation = "M";
                                                                            	   /*
                                                                                      var month = self.oModel
                                                                                                    .getData().month;
                                                                                      var year = self.oModel
                                                                                                    .getData().year;
                                                                                      startDate = new Date(
                                                                                                    year,
                                                                                                    month, 1);
                                                                                      endDate = new Date(
                                                                                                    year,
                                                                                                    month + 1,
                                                                                                    0);
                                                                                      var date1 = new Date();
                                                                                      var m = date1
                                                                                                    .getMonth();
                                                                                      if (month >= m) {
                                                                                             var year = date1
                                                                                                           .getFullYear();
                                                                                             if (year >= year) {
                                                                                                    startDate = new Date(
                                                                                                                 date1
                                                                                                                               .getFullYear(),
                                                                                                                 m,
                                                                                                                 1);
                                                                                                    endDate = date1;
                                                                                             }
                                                                                      }
                                                                                      startDate = self
                                                                                                    .getDateStr(startDate);
                                                                                      endDate = self
                                                                                                    .getDateStr(endDate);
                                                                               */} else if (selectedKey == "all") {
                                                                            	   operation="A";
                                                                            	   /*
                                                                                      var mainModel = self.oApplication
                                                                                                    .getModel(
                                                                                                                 "timesheet_initialInfo");
                                                                                      startDate = mainModel
                                                                                                    .getData().startDate;
                                                                                      endDate = mainModel
                                                                                                    .getData().endDate;
                                                                               */}
                                                                               


                                           									// lock UI until submit is done
                                           									// to prevent double click
                                           									// sap.ui.getCore().lock();

                                           									jQuery.sap.measure
                                           											.start(hcm.emp.mytimesheet.utils.PerfUtils
                                           													.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));

                                           									var batchCreate = [];
                                           									
                                           											batchCreate
                                           													.push(self
                                           															.setPostObject(
                                           																	"",
                                           																	operation,
                                           																	self.parseDateYYYYMMdd(cur_date.toDateString()),
                                           																	"",
                                           																	self.selectedWorklist.fieldName,
                                           																	self.selectedWorklist.fieldValue,
                                           																	"",
                                           																	"",
                                           																	"",
                                           																	self.selectedWorklist.childs,
                                           																	"",
                                           																	""));

                                           									
                                           									if (batchCreate.length === 0) {
                                           										// if there is nothing to
                                           										// submit, just act like a
                                           										// cancel
                                           										sap.ui.getCore().lock();
                                           									//	confirmationDialog.close();       not used in this controller
                                           										setTimeout(function() {
                                           											// sap.ui.getCore().unlock();
                                           										}, 500);
                                           									} else {
                                           										// only submit if there is
                                           										// something to submit,
                                           										// otherwise SAP UI5 does
                                           										// not give a response
                                           										self.oService
                                           												.submitTimeEntry(
                                           														self,
                                           														batchCreate,
                                           														[],
                                           														[],
                                           														function() {
                                           															// sap.ui.getCore().unlock();
                                           															jQuery.sap.measure
                                           																	.end(hcm.emp.mytimesheet.utils.PerfUtils
                                           																			.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));
                                           															var InitalInfoModel = self.oApplication
                                           															.getModel("timesheet_initialInfo");
                                           													var releaseAllowed = InitalInfoModel.getData().releaseAllowed;

                                           													var toastMsg;
                                           													if (releaseAllowed) {
                                           														toastMsg = self.oBundle
                                           																.getText('DRAFT_SUCCESS');	
                                           													} else {
                                           														toastMsg = self.oBundle.getText('SUBMIT_SUCCESS');
                                           													}
                                           															sap.m.MessageToast
                                           																	.show(toastMsg);//changed toast text
                                           															// sap.ui.getCore().lock();
                                           															/*setTimeout(
                                           																	function() {

                                           																		var calendar = self
                                           																				.byId("weeklyCalendar");
                                           																		var selectedDates = calendar
                                           																				.getSelectedDates();
                                           																		var dateStr;
                                           																		dateStr = selectedDates[0];

                                           																		var selectedDate = dateStr
                                           																				+ 'offset'
                                           																				+ calendar
                                           																						.getFirstDayOffset();

                                           																		self.oRouter
                                           																				.navTo(
                                           																						"S3",
                                           																						{
                                           																							context : selectedDate
                                           																						},true);

                                           																	},
                                           																	500);*/

                                           														},
                                           														function(
                                           																errs,
                                           																response) {
                                           															// sap.ui.getCore().unlock();
                                           															jQuery.sap.measure
                                           																	.end(hcm.emp.mytimesheet.utils.PerfUtils
                                           																			.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));
                                           															// some
                                           															// error
                                           															// messages
                                           															// to
                                           															// display
                                           															self.errors = errs;

                                           														});
                                           									}

                                           								//NOTE end of submit time entry code
                                                                               
                                                                               
                                                                             /*  jQuery.sap.measure
                                                                                             .start(hcm.emp.mytimesheet.utils.PerfUtils
                                                                                                           .getStartId(hcm.emp.mytimesheet.utils.PerfUtils.TIMESHEET_MAIN_QUICK_ENTRY_SUBMIT));
                                                                             
                                                                               
                                                                                 this.oService = new hcm.emp.mytimesheet.Service();
                                                                               this.oService
                                                                                             .submitQuickEntry(
                                                                                            		 		self,
                                                                                                           startDate,
                                                                                                           endDate,
                                                                                                           function() {
                                                                                                                 self
                                                                                                                               .refreshPage();
                                                                                                                 self.dialog
                                                                                                                               .close();
                                                                                                                 jQuery.sap.measure
                                                                                                                               .end(hcm.emp.mytimesheet.utils.PerfUtils
                                                                                                                                             .getEndId(hcm.emp.mytimesheet.utils.PerfUtils.TIMESHEET_MAIN_QUICK_ENTRY_SUBMIT));
                                                                                                                 setTimeout(
                                                                                                                               function() {
                                                                                                                                      sap.ui
                                                                                                                                                    .getCore()
                                                                                                                                                    .unlock();
                                                                                                                               },
                                                                                                                               500);
                                                                                                           },
                                                                                                           function() {
                                                                                                                 jQuery.sap.measure
                                                                                                                               .end(hcm.emp.mytimesheet.utils.PerfUtils
                                                                                                                                             .getEndId(hcm.emp.mytimesheet.utils.PerfUtils.TIMESHEET_MAIN_QUICK_ENTRY_SUBMIT));
                                                                                                                 self.dialog
                                                                                                                               .close();
                                                                                                                 setTimeout(
                                                                                                                               function() {
                                                                                                                                      sap.ui
                                                                                                                                                    .getCore()
                                                                                                                                                    .unlock();
                                                                                                                               },
                                                                                                                               500);
                                                                                                           });*/
                                                                        }, this)
                                      });
                        var rightButton = new sap.m.Button({
                               text : self.oBundle.getText('CANCEL'),
                               tap : jQuery.proxy(function() {
                                      this.dialog.close();
                               }, this)
                        });
                        var oSimpleForm = new sap.ui.layout.form.SimpleForm();
                        oSimpleForm.addContent(this.label1);
                        oSimpleForm.setModel(self.oModel);
                        oSimpleForm.addContent(this.oHelp);
                        oSimpleForm.addContent(this.label2);
                        oSimpleForm.addContent(this.oSelect);
                        this.dialog = new sap.m.Dialog({
                               contentHeight : "470px",
                               content : [ oSimpleForm ],
                               title : self.oBundle.getText('QUICK_FILL'),
                               afterOpen : function(oEvent) {
                                      jQuery.sap.log
                                                    .info("dialog is opened properly");
                               },
                               afterClose : function(oEvent) {
                                      jQuery.sap.log
                                                    .info("dialog is closed properly");
                               },
                               beginButton : this.leftButton,
                               endButton : rightButton
                        });
                        this.dialog.open();
                 },




					// to get f4 help for suggested entries code copied from s31
					// conteollr.js
					getWorkListCollection : function(oselectedItem) {

					this.workList = [];
					this.workListType = [];
					var self = this;
					var d = new Date();//Note: get the current date as begDa and endDa
					var dd = ('0' + d.getDate()).slice(-2).toString();
					var mm = ('0' + (d.getMonth() + 1)).slice(-2).toString();
					var yyyy = d.getFullYear();
					self.searchField_begDa=self.searchField_endDa=yyyy+mm+dd;

					this.oService
							.getCostAssignmentWorkListCollection(self,self.searchField_begDa,self.searchField_endDa,function(
									data) {
								// Create new worklist items for every item
								// with
								// Level 0
								var workListCounter = 0;
								for ( var i = 0; i < data.length; i++) {
									if (data[i].Level.trim() === "0") {
										self.workList[workListCounter] = {
											name : data[i].FieldValueText,
											childs : [],
											fieldName : data[i].FieldName,
											fieldValue : data[i].FieldValue,
											recordNumber : data[i].RecordNumber
										};
										workListCounter++;
									}
								}

								// Add other items with non Level 0
								// FieldText
								// into the
								// previously created Level 0 item.
								for ( var i = 0; i < data.length; i++) {
									if (data[i].Level.trim() !== "0") {
										for ( var j = 0; j < self.workList.length; j++) {
											if (self.workList[j].recordNumber === data[i].RecordNumber)
												self.workList[j].childs
														.push({
															name : data[i].FieldValueText,
															fieldName : data[i].FieldName,
															fieldValue : data[i].FieldValue
														});
										}
									}
								}

								// Add the recently used list to the
								// worklist
/*
 * for ( var i = 0; i < self.recentlyUsedCostAssignmentList.length; i++) {
 * self.workList .push(self.recentlyUsedCostAssignmentList[i]); }
 */

								// Populate the HTML view model with the
								// data
								var projects = [];
								for ( var i = 0; i < self.workList.length; i++) {
									var currentChildItems = [];
									var currentChildNames = [];
									var currentChildCodes = [];
									for ( var j = 0; j < self.workList[i].childs.length; j++) {
										currentChildItems
												.push(self.workList[i].childs[j].name);
										currentChildNames
												.push(self.workList[i].childs[j].fieldName);
										currentChildCodes
												.push(self.workList[i].childs[j].fieldValue);
									}
									projects
											.push({
												name : self.workList[i].name,
												others : currentChildItems
														.join(", "),
												childs : self.workList[i].childs,
												fieldName : self.workList[i].fieldName,
												fieldValue : self.workList[i].fieldValue
											});
									// Check if the current cost assignment
									// type
									// matches
									// something on the recently used list
									if ("selectedMainItem" in self
											&& self.selectedMainItem) {
										if (self.workList[i].name === self.selectedMainItem
												&& self.workList[i].fieldName === self.selectedMainName
												&& self.workList[i].fieldValue === self.selectedMainCode) {
											if ("selectedChildItems" in self) {
												var childItems = [];
												var childNames = [];
												var childCodes = [];
												for ( var j = 0; j < self.selectedChildItems.length; j++) {
													childItems
															.push(self.selectedChildItems[j]);
													childNames
															.push(self.selectedChildNames[j]);
													childCodes
															.push(self.selectedChildCodes[j]);
												}
												if ($(currentChildItems)
														.not(childItems).length == 0
														&& $(childItems)
																.not(
																		currentChildItems).length == 0) {
													if ($(currentChildNames)
															.not(childNames).length == 0
															&& $(childNames)
																	.not(
																			currentChildNames).length == 0) {
														if ($(
																currentChildCodes)
																.not(
																		childCodes).length == 0
																&& $(
																		childCodes)
																		.not(
																				currentChildCodes).length == 0) {
															self.previouslySelectedIndex = i;
														}
													}
												}
											} else {
												if (currentChildItems.length === 0) {
													// Match found in
													// recently used
													// list
													// since subItems is
													// empty
													self.previouslySelectedIndex = i;
												}
											}
										}
									}
								}


								self.workList = projects;


								self.oModel.setProperty("/projects",
										self.workList);
								// self.oModel.setData(localdata);
								// self.getWorkListTypeCollection();
							// }),
														
					});

					},

					getHeaderFooterOptions : function() {
                        var that = this;
                        return {
                        	sI18NFullscreenTitle : "TIMESHEET_TITLE",
                        	
                        	oEditBtn : 
                                                      
                                                      {
                                                         sId: "SMART_ENTRY",
                                                         sI18nBtnTxt : "QUICK_FILL",
                                                         onBtnPressed : function(evt){
                                                                that.onQuickEntryWithvalueHelp(evt);
                                                         }
                                                      }
                        };
                             


				},
				});

},
	"hcm/emp/mytimesheet/view/S2.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core" xmlns="sap.m" xmlns:me="sap.me"\n\tcontrollerName="hcm.emp.mytimesheet.view.S2">\n\t<Page id="page" title="{i18n>TIMESHEET_TITLE}">\n\t\t<content>\n\t\t\t<me:Calendar id="calendar" monthsPerRow="1"\n\t\t\t\tswipeToNavigate="true" design="Approval" tapOnDate="onWeeklyEntry"\n\t\t\t\tchangeCurrentDate="onCalendarMonthChange">\n\t\t\t</me:Calendar>\n\t\t\t<me:CalendarLegend id="LEGEND" design="Approval"\n\t\t\t\tlegendfortype01="{i18n>FILLED_DAY}" legendfortype07="{i18n>MISSING_DAY}"\n\t\t\t\tlegendfortype06="{i18n>MISSING_DAY}" legendfortype04="{i18n>REJECTED}">\n\t\t\t</me:CalendarLegend>\n\t\t</content>\n\t</Page>\n</core:View>',
	"hcm/emp/mytimesheet/view/S3.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("hcm.emp.mytimesheet.model.TimeEntry");
jQuery.sap.require("hcm.emp.mytimesheet.utils.ConnectionHelper");
jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.require("sap.ca.ui.dialog.Dialog");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("hcm.emp.mytimesheet.utils.InitialConfigHelper");
jQuery.sap.require("sap.ca.ui.model.type.Number");//Note dot-comma issue

sap.ca.scfld.md.controller.BaseFullscreenController
		.extend(
				"hcm.emp.mytimesheet.view.S3",
				{
					//Controller Hook method definitions
					extHookReleaseEntriesSummary: null,
					extHookOnSubmit: null,
					extHookOnItemSelect: null,
					extHookUpdateData: null,
					extHookGetTimeSheetCalendar: null,
					extHookLoadList: null,
					extHookUpdatePageData: null,
					
					onInit : function() {
						// code in the constructor in wave 1 below

						// execute the onInit for the base class
						// BaseFullscreenController
						sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit.call(this);

						// Get connection manager/resource bundle
						
						//ApplicationFacade
						this.oApplication = this.oApplicationFacade.oApplicationImplementation;
						//this.oConfiguration = this.oApplication.oConfiguration;
						this.oConfiguration = new hcm.emp.mytimesheet.utils.InitialConfigHelper();
						this.oConnectionManager = this.oApplication
								.oConnectionManager;
						this.oBundle = this.oApplicationFacade.oApplicationImplementation.getResourceBundle();
						this.oConfiguration.setResourceBundle(this.oBundle);
						var self = this;
						var oModel = new sap.ui.model.json.JSONModel({
							phone : jQuery.device.is.phone
						});
						//sap.ui.getCore().setModel(oModel, "TSM_WEEKLY");
						//Application Facade changes
						this.oApplication.setModel(oModel, "TSM_WEEKLY");
						
						if (!this.oService) {
							this.oService = new hcm.emp.mytimesheet.Service();
						}
						

						
						// already existing code in init method

						// jQuery.sap.measure.start(hcm.emp.mytimesheet.utils.PerfUtils.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_LOAD));
						var self = this;
						var oModel = this.oApplication.getModel("TSM_WEEKLY");

						this.oRouter.attachRouteMatched(function(oEvent) {

							if (oEvent.getParameter("name") === "S3") {

																
								var context = oEvent.getParameter("arguments").context;
								/*var offSet = parseInt(context[context.indexOf("offset") + 6], 10);*///Note
								var firstDayOffSet = parseInt(context[context.indexOf("offset") + 6], 10);
								var dateStr = context.replace("offset", "");
								dateStr = dateStr.slice(0, -1);

								var date = new Date(dateStr);

								var startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - self.getActualOffset(firstDayOffSet,date.getDay()));
								var endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 6);

								// logic brought from main screen
								var opayLoad = {
									// main : self,
									startDate : self.getDateStr(startDate),
									endDate : self.getDateStr(endDate),
									month : date.getMonth(),
									date : date,
									dateStr : dateStr,
									year : date.getFullYear(),
								// week : date.getWeek()
								};
								var localEventdata = opayLoad;

								/*
								 * oModel.setProperty("/main", localEventdata.main);
								 */
								self.oApplication.getModel('TSM_WEEKLY').setProperty("/firstDayOffset",firstDayOffSet);//Note
								oModel.setProperty("/showSubmit", false);
								oModel.setProperty("/selected", localEventdata.dateStr);
								oModel.setProperty("/year", localEventdata.year);
								oModel.setProperty("/week", localEventdata.week);
								oModel.setProperty("/start", localEventdata.startDate);
								oModel.setProperty("/end", localEventdata.endDate);
								self.lastSelected = localEventdata.dateStr;
								self.lastYear = localEventdata.year;
								self.lastWeek = localEventdata.week;
								self.lastStartDate = localEventdata.startDate;
								self.lastEndDate = localEventdata.endDate;

								var InitalInfoModel = self.oApplication.getModel(
								"timesheet_initialInfo");
	
								//when called form a book mark model is not initialized yet
								if(!InitalInfoModel){
									self.oService.getInitialInfos(self,self
											.getDateStr(startDate), self.getDateStr(date),
											function(){
												var InitalInfoModel = self.oApplication.getModel(
												"timesheet_initialInfo");
												var releaseAllowed = InitalInfoModel.getData().releaseAllowed;
												var releaseFuture = InitalInfoModel.getData().releaseFuture;
												self.checkboxList = [];
												oModel.setProperty("/releaseAllowed", releaseAllowed);
												oModel.setProperty("/releaseFuture", releaseFuture);
												self.setBtnEnabled("SUBMIT_BTN", false);
												
												//Note 1959135: decimal time entry field
												var decimalTimeEntry = InitalInfoModel.getData().decimalTimeEntry;
												oModel.setProperty("/decimalTimeEntry", decimalTimeEntry);
												
												self.clockEntry = InitalInfoModel.getData().clockEntry;
												oModel.setProperty("/clockEntry", self.clockEntry);
												self.oConfiguration.setInitialInfoModel(InitalInfoModel);
									});
								}else{
																		
									var releaseAllowed = InitalInfoModel.getData().releaseAllowed;
									var releaseFuture = InitalInfoModel.getData().releaseFuture;
									self.checkboxList = [];
									oModel.setProperty("/releaseAllowed", releaseAllowed);
									oModel.setProperty("/releaseFuture", releaseFuture);
									self.setBtnEnabled("SUBMIT_BTN", false);
									
									//Note 1959135: decimal time entry field
									var decimalTimeEntry = InitalInfoModel.getData().decimalTimeEntry;
									oModel.setProperty("/decimalTimeEntry", decimalTimeEntry);
									
									self.clockEntry = InitalInfoModel.getData().clockEntry;
									oModel.setProperty("/clockEntry", self.clockEntry);
									self.oConfiguration.setInitialInfoModel(InitalInfoModel);
									
								}																			
								
								self.updateData();
								self.getView().setModel(oModel);
//								self.loadListWithoModel();
								self.checkSubmit();
								self.onAfterRendering();
															
								
								//Reseting the Delete Button text when navigation back to this screen and disbaling the button
								self.setBtnText("deleteBtn", self.oApplicationFacade.getResourceBundle().getText("DELETE"));
								self.setBtnEnabled("deleteBtn", false);
								//Resetting the Submit Button
								if(self.oApplication.getModel("timesheet_initialInfo").getData().releaseAllowed){
									self.setBtnText("SUBMIT_BTN", self	.oApplicationFacade.getResourceBundle().getText("SUBMIT"));
									self.setBtnEnabled("SUBMIT_BTN", false);
								}
								this.checkboxList = [];
									
							}

						});
						

						this.getView().addEventDelegate({
							// TODO on before has been changed from wave1
							onBeforeShow : function(oEvent) {
							
							}
						});

						// trick needed to show back button in ipad mode
						var oPage = this.byId("WEEKLY_PAGE");
						oPage.addEventDelegate({
							onAfterRendering : function() {
								// TODO
								// oPage._navBtn.removeStyleClass("sapMSplitAppHiddenChild");
							}
						});

						if (!jQuery.device.is.phone) {
							var footer = this.byId("WEEKLY_FOOTER");
							// footer.insertContentRight(this.byId("SUBMIT_BTN"), 0);
							// footer.removeAllContentMiddle();
						}
						if (jQuery.device.is.tablet && jQuery.device.is.portrait) {
							this.byId("WEEKLY_PAGE").addStyleClass("sapTSM-TabletPortrait");
						} else {
							this.byId("WEEKLY_PAGE").removeStyleClass("sapTSM-TabletPortrait");
						}

						// new model for data excahnge with s31
						var S31modelexch = new sap.ui.model.json.JSONModel();
						this.oApplication.setModel(S31modelexch, "S31modelexch");

					},
					getActualOffset: function(firstDayOffset,currentDay){
						var constantOffset=7;
						if(firstDayOffset>currentDay)
						{
							return currentDay+constantOffset-firstDayOffset;
						}
						else
						{
							return currentDay-firstDayOffset;
						}
					},

					/*getDateStr : function(date) {
						return "" + date.getFullYear() + ("" + (date.getMonth() + 101)).substring(1)
								+ ("" + (date.getDate() + 100)).substring(1);
					},*/ //Repeated function
 
					parseDateYYYYMMdd : function(dateString) {
						var dateParse = sap.ui.core.format.DateFormat.getDateInstance({
							pattern : "YYYYMMdd"
						});
						return dateParse.parse(dateString);
					},
					parseDateddMMYYYY : function(dateString) {
						var dateParse = sap.ui.core.format.DateFormat.getDateInstance({
							pattern : "dd-MM-YYYY"
						});
						return dateParse.parse(dateString);
					},
					formatDateYYYYMMdd : function(oDate) {
						if (typeof oDate === "string") {
							oDate = new Date(oDate);
						}

						var dateParse = sap.ui.core.format.DateFormat.getDateInstance({
							pattern : "YYYYMMdd"
						});
						return dateParse.format(oDate);
					},

					onAfterRendering : function() {
						var self = this;
						/*setTimeout(function() {
							self.scrollerResize();
						}, 200);*/
					},
					/*getDateStr : function(date) {
						return "" + date.getFullYear()
								+ ("" + (date.getMonth() + 101)).substring(1)
								+ ("" + (date.getDate() + 100)).substring(1);
					},*/ //Repeated function

					checkCanLeave : function(callback, prevent) {
						var allSuggestions = true;
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						var days = oModel.getData().days;
						//Check whether anything is checked or not 
						var oTableRef = this.byId("ENTRY_LIST_CONTENTS");
						var selectedItems = [];
						selectedItems = oTableRef.getSelectedItems();
						//if (oModel.getData().showSubmit && !allSuggestions) {
						//Note 1994402: comment forre moving warning message
						/*if(selectedItems.length != 0){
							// if some selections is enabled we need to warn the user that there
							// are unsaved changes							
							
							var oSettings = {
									question : this.oBundle.getText('CONFIRM_LEAVE_PAGE'),
									additionalInformation : [],
									showNote : false,
									title : this.oConfiguration.getText("UNSAVED_CHANGES"),
									confirmButtonLabel : this.oBundle.getText("OK")
								};

								var _this = this;
								sap.ca.ui.dialog.factory.confirm(oSettings, function(response) {
									if (response.isConfirmed == true) {
										
										_this.setBtnText("deleteBtn", _this.oApplicationFacade.getResourceBundle().getText("DELETE"));
										
										//_this._submit();
										sap.ui.getCore().lock();
										callback();
										setTimeout(function() {
											sap.ui.getCore().unlock();
										}, 500);
									}
									else {
										sap.ui.getCore().lock();
										prevent();
										setTimeout(function() {
											sap.ui.getCore().unlock();
										}, 500);
									} 
									
								}); 
							
							
						} else {
							sap.ui.getCore().lock();
							callback();
							setTimeout(function() {
								sap.ui.getCore().unlock();
							}, 500);
						}*/
						sap.ui.getCore().lock();
						callback();
						setTimeout(function() {
							sap.ui.getCore().unlock();
						}, 500);
					},

					/*getDateStr : function(date1) {
						return "" + date1.getFullYear() + ("" + (date1.getMonth() + 101)).substring(1)
								+ ("" + (date1.getDate() + 100)).substring(1);
					},*/ ////Repeated function

					getPostData : function(day, entry) {
						var post = {};

						post.day = day;
						post.entry = entry;

						return post;

					},
					
					//Calculation for Release Entries
					releaseEntriesSummary : function(bUpdatePageData){
						
						var oTableRef = this.byId("ENTRY_LIST_CONTENTS");
						var selectedItems = [];
						selectedItems = oTableRef.getSelectedItems();
						// Deleted Hours Summary
						var deletedHours = 0;
						var deletedMinutes = 0;
						var deletedTime = 0;
						//var numberOfItemsGettingReleased;
						var numberOfItemsSelectedForSubmittion;//NOTE added count for submitting drafts
						var dayIndex;
						var entryIndex;
						var entry;
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						var oPageData = oModel.getData();
						var releaseFutureDates = oModel.getProperty("/releaseFuture");//NOTE future dates
						var cur_date;
						var sel_date;
						//numberOfItemsGettingReleased = selectedItems.length;
						numberOfItemsSelectedForSubmittion = 0;
						for ( var i = 0; i < selectedItems.length; i++) {
							dayIndex = selectedItems[i].data().day;
							entryIndex = selectedItems[i].data().entry;
							entry = oPageData.days[dayIndex].entries[entryIndex];
							sel_date = oPageData.days[dayIndex].date;
							cur_date=new Date();
							// when new entry line has been selected
							if(!entry){
								continue;
							}
							//[i].entries[j].status == "Draft saved"
							//updating the pagedata with Boolean Release Allowed as true 
							if(bUpdatePageData){
								this.updatePageData(false, dayIndex, entry,true);	
							}
							if(!releaseFutureDates && (sel_date>cur_date)){
								//Do nothing if the dates are in the future
							}
							else if(entry.statusId == 'MSAVE'){
							jQuery.sap.log.info("Hours : " + entry.hours);
							deletedHours += entry.hours;
							deletedMinutes += entry.minutes;
							deletedTime += entry.time;
							deletedTime = parseFloat(deletedTime.toFixed(2));
							jQuery.sap.log.info("Minutes : " + entry.minutes);
							jQuery.sap.log.info("Decimal Time : " + entry.time);
							numberOfItemsSelectedForSubmittion++;//count for submitted entries
							}
							else if(entry.statusId == "REJECTED"){
								deletedHours += entry.hours;
								deletedMinutes += entry.minutes;
								deletedTime += entry.time;
								deletedTime = parseFloat(deletedTime.toFixed(2));
								numberOfItemsSelectedForSubmittion++;//count for submitted entries
							}
							/*else{
								numberOfItemsGettingReleased--;
							}*/
							if (deletedMinutes > 59) {
								deletedMinutes -= 60;
								deletedHours++;
							}
						}
						var releaseData = [];
						if(this.isClockEntry())
						{
							deletedTime = deletedHours;
							deletedTime+=(deletedMinutes/60);//Note: display total decimal time
							deletedTime = parseFloat(deletedTime.toFixed(2));
						}
						
						releaseData.push(numberOfItemsSelectedForSubmittion);
						releaseData.push(deletedHours);
						releaseData.push(deletedMinutes);
						releaseData.push(deletedTime);//Note: display total decimal time
						return releaseData;

						/**
					     * @ControllerHook Extend behavior of Release Entries Summary
					     * This hook method can be used to add UI or business logic 
					     * It is called when the ReleaseEntriesSummary method executes
					     * @callback hcm.emp.mytimesheet.view.S3~extHookReleaseEntriesSummary
					     */
							if(this.extHookReleaseEntriesSummary) {
								this.extHookReleaseEntriesSummary();
					  	};
					},

					onSubmit : function() {
						
						var releaseData = [];
						var oSettings = null;
						releaseData = this.releaseEntriesSummary(true);
						
						/*Note:display total decimal time*/
                        if(!this.clockEntry)
                        {
                        	var txt_tot_duration = this.oBundle.getText('TOTAL_DURATION');//NOTE CODE ADDED TO COMPENSATE FOR MISSING TEXT IN i18 file...Replace this as soon as the translations have come
                            if(txt_tot_duration.indexOf('_')!=(-1)){
                            	txt_tot_duration = "Total Duration";
                            }
                        	oSettings = {
                               question : this.oBundle.getText('SUBMISSION_CONFIRMATION_SUMMARY'),
                               //additionalInformation : [],
                               additionalInformation : [
                                                                               {
                                                                                      label : this.oBundle.getText('DELETE_CONFIRMATION_SUMMARY_ENTRIES'),
                                                                                      text : releaseData[0].toString()
                                                                               },
                                                                               {
                                                                                      label : txt_tot_duration ,
                                                                                      text : sap.ca.ui.model.format.NumberFormat.getInstance({style:'standard'}).format(releaseData[3].toString())//Note: dot-comma issue
                                                                               }],
                               showNote : false,
                               title : this.oConfiguration.getText("SUBMISSION_CONFIRMATION"),
                               confirmButtonLabel : this.oBundle.getText("OK")
                        };
                        }
                        else
                        {
                        oSettings = {
                               question : this.oBundle.getText('SUBMISSION_CONFIRMATION_SUMMARY'),
                               //additionalInformation : [],
                               additionalInformation : [
                                                                               {
                                                                                      label : this.oBundle.getText('DELETE_CONFIRMATION_SUMMARY_ENTRIES'),
                                                                                      text : releaseData[0].toString()
                                                                               },
                                                                               {
                                                                                      label : this.oBundle.getText('DELETE_CONFIRMATION_SUMMARY_HOURS'),
                                                                                      text : this.oBundle.getText('FULL_CONCATENATE_HOURSMIN',[releaseData[1],releaseData[2]])
                                                                               }],
                               showNote : false,
                               title : this.oConfiguration.getText("SUBMISSION_CONFIRMATION"),
                               confirmButtonLabel : this.oBundle.getText("OK")
                        };
                        }
                        /*Note: End display total decimal time*/


						var _this = this;
						sap.ca.ui.dialog.factory.confirm(oSettings, function(response) {
							if (response.isConfirmed == true) {
								_this._submit();
							}
						});

						/**
					     * @ControllerHook Extend behavior of On Submit
					     * This hook method can be used to add UI or business logic 
					     * It is called when the OnSubmit method executes
					     * @callback hcm.emp.mytimesheet.view.S3~extHookOnSubmit
					     */
							if(this.extHookOnSubmit) {
								this.extHookOnSubmit();
					  	};
					},

					_submit : function(numberOfEntries, deletedHours, deletedMinutes) {

						// var eventSubmit = true ;
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						var newDays = oModel.getData().days;
						this.errors = null;

						var createdDays = [];
						var updatedDays = [];
						var deletedDays = [];
						var draftedDays = [];

						for ( var i = 0; i < newDays.length; i++) {

							for ( var j = 0; j < newDays[i].entries.length; j++) {

								if ((newDays[i].entries[j].counter === null || newDays[i].entries[j].counter === "")
										&& !(newDays[i].entries[j].deleted) && newDays[i].entries[j].mainItem !== null) {

									createdDays.push(this.getPostData(newDays[i].dateStr, newDays[i].entries[j]));
								}

								if (newDays[i].entries[j].deleted
										&& (newDays[i].entries[j].counter !== "" || newDays[i].entries[j].counter === null)) {
									deletedDays.push(this.getPostData(newDays[i].dateStr, newDays[i].entries[j]));
								} else {
									if (this.oldDays[i]) {
										for ( var k = 0; k < this.oldDays[i].entries.length; k++) {
											if (newDays[i].entries[j].counter === this.oldDays[i].entries[k].counter
													&& newDays[i].entries[j].counter !== "") {

												var item1 = newDays[i].entries[j];
												var item2 = this.oldDays[i].entries[k];

												if (item1.time !== item2.time || item1.notes !== item2.notes
														|| item1.mainItem !== item2.mainItem || item1.subItems !== item2.subItems
														|| item1.hours !== item2.hours || item1.minutes !== item2.minutes
														|| item1.startTime !== item2.startTime || item1.endTime !== item2.endTime) {

													if (!newDays[i].entries[j].deleted) {

														updatedDays.push(this.getPostData(newDays[i].dateStr, newDays[i].entries[j]));

													}
												}
											}
										}
									}
								}
								if (newDays[i].entries[j].statusId == "MSAVE" && newDays[i].entries[j].bToBeReleased){
									draftedDays.push(this.getPostData(newDays[i].dateStr,

									newDays[i].entries[j]));

									// add the drafted entries to updated entries

									updatedDays.push(this.getPostData(newDays[i].dateStr,

									newDays[i].entries[j]));

									}


							}
						}

						var self = this;
						var confirmationDialog = null;
								

						confirmationDialog = new sap.m.Dialog({

							title : this.oConfiguration.getText("DELETE_CONFIRMATION"),
							leftButton : new sap.m.Button({
								text : this.oBundle.getText("OK"),
								press : function() {

									confirmationDialog.close();

								}
							}),
							rightButton : new sap.m.Button({
								text : this.oConfiguration.getText("CANCEL"),
								press : function() {
									//eventSubmit = false;
									sap.ui.getCore().lock();
									confirmationDialog.close();
									setTimeout(function() {
										sap.ui.getCore().unlock();
									}, 500);
								}
							}),
						});

						// lock UI until submit is done to prevent double click
						sap.ui.getCore().lock();

						jQuery.sap.measure.start(hcm.emp.mytimesheet.utils.PerfUtils
								.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));

						var batchUpdate = [];
						var batchCreate = [];
						var batchDelete = [];

						if (createdDays.length !== 0) {

							for (i = 0; i < createdDays.length; i++) {
								createdDays[i].entry = this.replaceSpecialChar(createdDays[i].entry); 			//Note 1994402: Replacing Special Character

								batchCreate.push(self.setPostObject(createdDays[i].entry.counter, "C", createdDays[i].day,
										createdDays[i].entry.time, createdDays[i].entry.mainName, createdDays[i].entry.mainCode,
										createdDays[i].entry.notes, createdDays[i].entry.startTime, createdDays[i].entry.endTime,
										createdDays[i].entry.subItems, createdDays[i].entry.childCodes, createdDays[i].entry.childNames));

							};
						}

						if (updatedDays.length !== 0) {

							for (i = 0; i < updatedDays.length; i++) {
								updatedDays[i].entry = this.replaceSpecialChar(updatedDays[i].entry); 			//Note 1994402: Replacing Special Character

								batchUpdate.push(self.setPostObject(updatedDays[i].entry.counter, "U", updatedDays[i].day,
										updatedDays[i].entry.time, updatedDays[i].entry.mainName, updatedDays[i].entry.mainCode,
										updatedDays[i].entry.notes, updatedDays[i].entry.startTime, updatedDays[i].entry.endTime,
										updatedDays[i].entry.subItems, updatedDays[i].entry.childCodes, updatedDays[i].entry.childNames));
							}
						}

						if (deletedDays.length !== 0) {

							for (i = 0; i < deletedDays.length; i++) {
								deletedDays[i].entry = this.replaceSpecialChar(deletedDays[i].entry); 			//Note 1994402: Replacing Special Character

								batchDelete.push(self.setPostObject(deletedDays[i].entry.counter, "D", deletedDays[i].day,
										deletedDays[i].entry.time, deletedDays[i].entry.mainName, deletedDays[i].entry.mainCode,
										deletedDays[i].entry.notes, deletedDays[i].entry.startTime, deletedDays[i].entry.endTime,
										deletedDays[i].entry.subItems, deletedDays[i].entry.childCodes, deletedDays[i].entry.childNames));

							}
						}

						if (batchCreate.length === 0 && batchUpdate.length === 0 && batchDelete.length === 0) {
							// if there is nothing to submit, just act like a cancel
							sap.ui.getCore().lock();
							confirmationDialog.close();
							setTimeout(function() {
								sap.ui.getCore().unlock();
							}, 500);
						} else {
							// only submit if there is something to submit, otherwise SAP UI5 does not give a response
							self.oService.submitTimeEntry(self,batchCreate, batchUpdate, batchDelete, function() {
								sap.ui.getCore().unlock();
								jQuery.sap.measure.end(hcm.emp.mytimesheet.utils.PerfUtils
										.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));
								sap.m.MessageToast.show(self.oConfiguration.getText("SUBMIT_SUCCESS"));
								sap.ui.getCore().lock();
								setTimeout(function() {
									// success refresh week entry page
									if (!self.errors) {
										self.updateData();
									}
									sap.ui.getCore().unlock();
								}, 500);
							}, function(errs, response) {
								sap.ui.getCore().unlock();
								jQuery.sap.measure.end(hcm.emp.mytimesheet.utils.PerfUtils
										.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));
								// some error messages to display
								self.errors = errs;
								self.displayInlineMessages(errs, response);
								self.updateData();
							});
						}

						// confirmationDialog.addContent(oDialogForm);
						var list_items = [];
						var list_item_entry = null;
						var days = oModel.getData().days;
						for (i = 0; i < days.length; i++) {

							for ( var j = 0; j < days[i].entries.length; j++) {

								list_item_entry = days[i].entries[j];
								// skip if deleted
								if (!list_item_entry.deleted) {

									if (list_item_entry.subItems === null) {
										list_item_entry.subItems = "";
									}
									// add to list if there were no such entry and it is not "New
									// Entry"
									// and list_item does not have this element yet
									if (list_item_entry.mainItem) {
										var alreadyThere = false;
										var index = -1;
										for ( var k = 0; k < list_items.length; k++) {
											if (list_items[k].subItems === null) {
												list_items[k].subItems = "";
											}
											if (list_items[k].mainItem === list_item_entry.mainItem) {
												alreadyThere = true;
												index = k;
											}
										}
										if (!alreadyThere) {
											list_items.push({
												mainItem : list_item_entry.mainItem,
												subItems : list_item_entry.subItems,
												time : list_item_entry.time,
												hours : parseFloat(list_item_entry.hours),
												minutes : parseFloat(list_item_entry.minutes)
											});
										} else {
											// add time
											list_items[index].time += list_item_entry.time;
											list_items[index].hours += parseFloat(list_item_entry.hours);
											list_items[index].minutes += parseFloat(list_item_entry.minutes);
											if (list_items[index].minutes > 59) {
												list_items[index].minutes -= 60;
												list_items[index].hours++;
											}
										}
									}
								}
							}
						}
						var targetHours = 0;
						for ( var day = 0; day < days.length; day++) {
							targetHours = targetHours + days[day].targetHours;
						}
					},

					setPostObject : function(Counter, TimeEntryOperation, WORKDATE, CATSAMOUNT, Name, Code, notes, startTime,
							endTime, subItems, childCodes, childNames) {
						var timeEntryUpdated = {
							Counter : Counter,
							TimeEntryOperation : TimeEntryOperation,
							TimeEntryDataFields : {
								WORKDATE : WORKDATE,
								CATSAMOUNT : "" + CATSAMOUNT,
								BEGUZ : startTime,
								ENDUZ : endTime
							}
						};
						
						// always setting to X for second screen
						if(TimeEntryOperation !="D")
						timeEntryUpdated.TimeEntryRelease = "X";

						if(this.checkFieldName(Name) === true){					//Note 1959135: Added additional check
							timeEntryUpdated.TimeEntryDataFields[Name] = Code;
						}
						
						if (subItems && subItems !== "") {
							for ( var i = 0; i < childNames.length; i++) {
								if(this.checkFieldName(childNames[i]) === true){			//Note 1959135: Added additional check
									timeEntryUpdated.TimeEntryDataFields[childNames[i]] = childCodes[i];
								}
							}
						}
						if (notes && notes !== "") {
							timeEntryUpdated.TimeEntryDataFields.LONGTEXT_DATA = notes;
							timeEntryUpdated.TimeEntryDataFields.LONGTEXT = "X";
						}

						return timeEntryUpdated;
					},
					
					//Note 1959135: Check for special fieldnames
					checkFieldName : function(fieldName){
					    var checkString = new String(fieldName);
					    if(checkString.match("DISPTEXT")){
					                    return false;
					    }
					    if(checkString.match("CPR_OBJTEXT")){
					                    return false;
					    }
					    if(checkString.match("CPR_TEXT")){
					                    return false;
					    }
					    return true;
					},

					//Note 1994402: Replaceing special charater '/' with '-'
					replaceAllOccurances : function(iString){
						if(typeof iString=="undefined"){
							return;
						}
						var vSearch = '/';
						var vReplace = '-';
						while( iString.indexOf(vSearch) > -1){
							iString = iString.replace(vSearch, vReplace);
						}
						return iString;
					},
					replaceSpecialChar : function(entry){
						if(typeof entry.mainName != "undefined"){
							entry.mainName = this.replaceAllOccurances(entry.mainName);
						}
						if(typeof entry.subItems != "undefined"){
							entry.subItems = this.replaceAllOccurances(entry.subItems);
						}
						if(typeof entry.childNames != "undefined"){
							for(var i = 0; i < entry.childNames.length ; i++){
								entry.childNames[i] = this.replaceAllOccurances(entry.childNames[i]);
							}
						}
						
						return entry;
					},
					
					// function called on browser event click of an entry in the
					// list
					onItemSelectGotoEdit : function(oEvent) {
						var item = oEvent.getSource();
						var tableref = item.getParent();
							if (item instanceof sap.m.ColumnListItem) {
								var customData = item.getCustomData();
								var dayIndex = 0, entryIndex = 0;		
								for(var i = 0; i < customData.length; i++) {
									if(customData[i].getKey()==="day") {
										dayIndex = customData[i].getValue();
									} else if(customData[i].getKey()==="entry") {
										entryIndex = customData[i].getValue();
									}
								}
								var oModel = this.oApplication.getModel("TSM_WEEKLY");
								
								this.oApplication.getModel('S31modelexch').setProperty('/recentlyUsedSelected',false);
								this.oApplication.getModel('S31modelexch').setProperty('/manualEntrySelected',true);
								
								
								var oPageData = oModel.getData();

								var oViewData = {
							       entry: oPageData.days[dayIndex].entries[entryIndex],
							       pageData: oPageData,
							       dayIndex: dayIndex,
							       entryIndex: entryIndex
							   };
								
								this.oApplication.getModel('S31modelexch').setProperty('/editeddata',oViewData);
								this.oApplication.getModel('S31modelexch').setProperty('/editentryview',true);
								this.oApplication.getModel('S31modelexch').setProperty('/viewDataS3',oViewData);
								var selctedDate = (new Date(item.data().selectedDate.substr(0,4),
										parseInt(item.data().selectedDate.substr(4,2),10) - 1,
										item.data().selectedDate.substr(6,2)) + "").substr(0,15);
																
								var dateParse = sap.ui.core.format.DateFormat.getDateInstance({
									pattern : "YYYYMMdd"
								});
								var selctedDate = dateParse.parse(item.data().selectedDate);
																
								this.oApplication.getModel('S31modelexch').setProperty('/selectedDates', [selctedDate]);
															
								this.oRouter.navTo("S31",{},true);
							}
						},

					onItemSelect : function(oEvent) {
					  this.selectDateOnAllCheckBoxSelection(oEvent.getSource(), oEvent.mParameters.listItem);
						this.manageChecklist(oEvent.getSource().getItems(), "", "", "");
						
						
						if (oEvent.getSource().getSelectedItems().length === 0) {
							this.setBtnText("deleteBtn", this.oApplicationFacade.getResourceBundle().getText("DELETE"));
							this.setBtnEnabled("deleteBtn", false);
							//Submit Button text manipulate based on selection
							if(this.oApplication.getModel("timesheet_initialInfo").getData().releaseAllowed){
								this.setBtnText("SUBMIT_BTN", this.oApplicationFacade.getResourceBundle().getText("SUBMIT"));
								this.setBtnEnabled("SUBMIT_BTN", false);
							}
						} else {
							//Release Summmary Information call and text update
							if(this.oApplication.getModel("timesheet_initialInfo").getData().releaseAllowed){
								var releaseSummaryInfo = this.releaseEntriesSummary(false);
								
								if(releaseSummaryInfo[0] == 0 ){
									this.setBtnText("SUBMIT_BTN", this.oApplicationFacade.getResourceBundle().getText("SUBMIT"));
									this.setBtnEnabled("SUBMIT_BTN", false);	
								}else{
									this.setBtnText("SUBMIT_BTN", this.oApplicationFacade.getResourceBundle().getText("SUBMIT")+ '('
											+ releaseSummaryInfo[0] + ')');
									this.setBtnEnabled("SUBMIT_BTN", true);
								}
								
							}
							
							
							var selList = oEvent.getSource().getSelectedItems();
							var actualCount = 0;
							for(var i=0;i<selList.length;i++){
								if(selList[i].mAggregations.cells[0].mProperties.text != this.oApplicationFacade.getResourceBundle().getText("ADD_NEW")){
								actualCount++;	
							  }
							}							
							
							
							if(actualCount == 0){
							this.setBtnText("deleteBtn", this.oApplicationFacade.getResourceBundle().getText("DELETE"));
							this.setBtnEnabled("deleteBtn", false);
							}else{
								this.setBtnText("deleteBtn", this.oApplicationFacade.getResourceBundle().getText("DELETE") + '('
										+ actualCount + ')');
								this.setBtnEnabled("deleteBtn", true);
							}
						}
						/**
					     * @ControllerHook Extend behavior of On Item Select
					     * This hook method can be used to add UI or business logic 
					     * It is called when the OnItemSelect method executes
					     * @callback hcm.emp.mytimesheet.view.S3~extHookOnItemSelect
					     */
							if(this.extHookOnItemSelect) {
								this.extHookOnItemSelect();
					  	};

					},

						onSelect : function(oEvent) {
						var selectedDate = new Date(oEvent.getParameter("date"));
						var didSelect = oEvent.getParameter("didSelect");
						this.selectDate(selectedDate, didSelect);
					},

					selectDate : function(selectedDate, fromClick) {
						var dateStr = null;
						if (selectedDate instanceof Date) {
							dateStr = this.formatDateYYYYMMdd(selectedDate);
						} else {
							dateStr = selectedDate;
							selectedDate = new Date(parseInt(dateStr.substring(0, 4), 10), parseInt(dateStr.substring(4, 6), 10) - 1,
									parseInt(dateStr.substring(6, 8), 10));
						}
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						oModel.setProperty("/selected", dateStr);
						var self = this;
						var valuesPresent = false;
						var indexValue;
						if (this.entryListContents) {
							var items = this.entryListContents.getItems();
							var dateArray = [selectedDate];
							valuesPresent = this.manageSelection(items, selectedDate, fromClick);
							
							var selList = this.byId("ENTRY_LIST_CONTENTS").getSelectedItems();
							var actualCount = 0;
							for(var i=0;i<selList.length;i++){
								if(selList[i].mAggregations.cells[0].mProperties.text != this.oApplicationFacade.getResourceBundle().getText("ADD_NEW")){
								actualCount++;	
							  }
							}
							
							if(actualCount == 0 ){
								this.setBtnText("deleteBtn", this.oApplicationFacade.getResourceBundle().getText("DELETE"));
								this.setBtnEnabled("deleteBtn", false);	
							}else{
								this.setBtnText("deleteBtn", this.oApplicationFacade.getResourceBundle().getText("DELETE") + '('
										+ actualCount + ')');
								this.setBtnEnabled("deleteBtn", true);
							}
							
							//Release Summmary Information call and text update
							if(this.oApplication.getModel("timesheet_initialInfo").getData().releaseAllowed){
								var releaseSummaryInfo = this.releaseEntriesSummary(false);
								if(releaseSummaryInfo[0] == 0 ){
									this.setBtnText("SUBMIT_BTN", this.oApplicationFacade.getResourceBundle().getText("SUBMIT"));
									this.setBtnEnabled("SUBMIT_BTN", false);	
								}else{
									this.setBtnText("SUBMIT_BTN", this.oApplicationFacade.getResourceBundle().getText("SUBMIT")+ '('
											+ releaseSummaryInfo[0] + ')');
									this.setBtnEnabled("SUBMIT_BTN", true);
								}
							}
							if (valuesPresent) {
								return;
							}
							//deleteButton Text
							
							
							// the date is not in the list, so this must be a non-working day
							if (this.oConfiguration.getAllowNonWorkingDays()) {
								var oPageData = oModel.getData();
								var oDayData = {
									date : selectedDate,
									dateStr : dateStr,
									dateFormatted : this.convertDateFormat(selectedDate),
									targetHours : 0,
									entries : []
								};
								var newEntry = new hcm.emp.mytimesheet.model.TimeEntry(0, this.oBundle.getText("ADD_NEW"));
								oDayData.entries.push(newEntry);
								oPageData.days.push(oDayData);
								// order list of days by date
								function compareDays(a, b) {
									if (parseInt(a.dateStr) > parseInt(b.dateStr)) {
										return 1;
									} else {
										return -1;
									}
								}
								oPageData.days.sort(compareDays);
								this.loadListWithoModel();
								for (i = 0; i < items.length; i++) {
									if (items[i] instanceof sap.m.GroupHeaderListItem
											&& items[i].getTitle() === this.convertDateFormat(selectedDate)) {
										items[i].setSelected(true);
										setTimeout(function() {
											self.jumpToIndex(i);
										}, 100);
										return;
									}
								}
							}
						}
					},

					// this method checks to see if there is a new entry for this day displayed. If not, it will add it as
					// overtime
					checkOvertime : function(date) {
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						var days = oModel.getData().days;
						for ( var i = 0; i < days.length; i++) {
							if (days[i].date.getTime() === date.getTime()) {
								// we have found the right day
								if (days[i].entries.length > 0 && days[i].entries[days[i].entries.length - 1].newEntry) {
									// the last entry is already a new entry, so no need to add anything
									return false;
								}
								// add a new entry
								var newEntry = new hcm.emp.mytimesheet.model.TimeEntry(0, this.oBundle.getText("ADD_NEW"));
								if (this.oConfiguration.getClockEntry()) {
									newEntry.setStartEndTimes(date, days[i].entries, 0, days[i].workingDay);
								}
								days[i].entries.push(newEntry);
								this.loadListWithoModel();
								return true;
							}
						}
						return false;
					},

					// update list Data with in-line messages
					displayInlineMessages : function(errors, responseData) {
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						var days = oModel.getData().days;
						for ( var i = 0; i < days.length; i++) {
							for ( var j = 0; j < days[i].entries.length; j++) {
								var bFoundError = false;
								for ( var k = 0; k < errors.length; k++) {
									if (days[i].entries[j].counter === errors[k].counter && days[i].dateStr === errors[k].workdate
											&& days[i].entries[j].time === parseFloat(errors[k].time)) {
										days[i].entries[j].showError = true;
										days[i].entries[j].error = errors[k].message;
										bFoundError = true;
										break;
									}
								}
								if (!bFoundError) {
									for (k = 0; k < responseData.length; k++) {
										if (days[i].entries[j].counter === ""
												&& days[i].dateStr === responseData[k].TimeEntryDataFields.WORKDATE
												&& days[i].entries[j].time === parseFloat(responseData[k].TimeEntryDataFields.CATSAMOUNT)) {
											// there previously was no counter, but now this has been accepted, add one
											days[i].entries[j].counter = responseData[k].Counter;
										}
									}
								}
							}
						}
						this.oldDays = jQuery.extend(true, {}, days);
						oModel.setProperty("/showSubmit", false);
						oModel.setProperty("/days", days);
						this.loadListWithoModel();
					},

					// update calendar Data
					updateData : function() {
						// clean calendar
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						oModel.setProperty("/red", "");
						oModel.setProperty("/green", "");
						oModel.setProperty("/grey", "");
						oModel.setProperty("/yellow", "");
						oModel.setProperty("/rejected", "");

						var weeklyCalendar = this.byId("WEEKLY_CALENDAR");
						weeklyCalendar.removeTypesOfAllDates();
						weeklyCalendar.unselectAllDates();
						oModel.setProperty("/activities", null);
						oModel.setProperty("/workingDayList", null);

						var self = this;

						// update calendar
						this.oService.getWorkDays(this,oModel.getData().start, oModel.getData().end, function(data) {
							self.getTimeSheetCalendar(data);
							if (oModel.getData().activities) {
								self.setWeeklyData(oModel.getData().activities);
							}
							self.monitorPageRefreshEnded();
						});

						// update list
						this.oService.getWorkListCollection(this,oModel.getData().start, oModel.getData().end, function(data) {
							oModel.setProperty("/activities", data);
							if (oModel.getData().workingDayList) {
								self.setWeeklyData(data);
							}
							self.monitorPageRefreshEnded();
						});
						//Reseting Delete button on Submit and delete
						self.setBtnText("deleteBtn", self.oApplicationFacade.getResourceBundle().getText("DELETE"));
						self.setBtnEnabled("deleteBtn", false);
						
						//Resetting the Submit Button
						if(self.oApplication.getModel("timesheet_initialInfo").getData().releaseAllowed){
							self.setBtnText("SUBMIT_BTN", this.oApplicationFacade.getResourceBundle().getText("SUBMIT"));
							self.setBtnEnabled("SUBMIT_BTN", false);
						}
						/**
					     * @ControllerHook Extend behavior of Update Data
					     * This hook method can be used to add UI or business logic 
					     * It is called when the UpdateData method executes
					     * @callback hcm.emp.mytimesheet.view.S3~extHookUpdateData
					     */
							if(this.extHookUpdateData) {
								this.extHookUpdateData();
					  	};
						
					},

					monitorPageRefreshEnded : function() {
						var ownPointer = this;
						/*if (typeof self !== 'undefined') {
							ownPointer = self;
						} else {
							ownPointer = this;
						}*/
						if ("pageRefreshPartOneEnded" in ownPointer) {
							jQuery.sap.measure.end(hcm.emp.mytimesheet.utils.PerfUtils
									.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_LOAD));
							delete ownPointer.pageRefreshPartOneEnded;
						} else {
							ownPointer.pageRefreshPartOneEnded = true;
						}
					},

					getTimeSheetCalendar : function(data) {

						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						var now = new Date(), grey = [], red = [], green = [], yellow = [], rejected = [], currentSelectedDay = oModel
								.getData().selected, firstWorkingDay = null, missingdays = [], hasSelectedDay = false;

						var workingDayList = [];
						oModel.setProperty("/workingDayList", workingDayList);

						// get first day of the week
						var firstDayOff = -1;
						if (data.length > 0) {
							var firstDay = data[0].FirstDayOfWeek;
							if (firstDay === null) {
								firstDayOff = -1;
							} else if (firstDay === "MONDAY") {
								firstDayOff = 1;
							} else if (firstDay === "TUESDAY") {
								firstDayOff = 2;
							} else if (firstDay === "WEDNESDAY") {
								firstDayOff = 3;
							} else if (firstDay === "THURSDAY") {
								firstDayOff = 4;
							} else if (firstDay === "FRIDAY") {
								firstDayOff = 5;
							} else if (firstDay === "SATURDAY") {
								firstDayOff = 6;
							} else if (firstDay === "SUNDAY") {
								firstDayOff = 0;
							}
						}

						for ( var i = 0; i < data.length; i++) {
							var dateToWork = data[i].Date;
							var workingDay = data[i].WorkingDay === "TRUE";
							var date = new Date(parseInt(dateToWork.substring(0, 4), 10),
									parseInt(dateToWork.substring(4, 6), 10) - 1, parseInt(dateToWork.substring(6, 8), 10));
							workingDayList.push({
								date : dateToWork,
								workingDay : workingDay,
								targetHours : parseFloat(data[i].TargetHours.trim()),
								startTime : data[i].StartTime,
								endTime : data[i].EndTime,
								lunchStart : data[i].BreakStart,
								lunchEnd : data[i].BreakEnd
							});

							var status = data[i].Status;

							if (!workingDay) {
								// add to holidays to grey out
								grey.push(date);
							} else {
								if (!firstWorkingDay) {
									firstWorkingDay = dateToWork;
								}
								if (!hasSelectedDay && currentSelectedDay === dateToWork) {
									hasSelectedDay = true;
								}
								if (status === "YACTION") {
									// add missing days as red
									missingdays.push(data[i].Date);
									// fill red only if earlier then today
									if (now.getTime() > date.getTime()) {
										red.push(date);
									}
								} else if (status === "MACTION") {
									// add missing days as green with yellow
									yellow.push(date);
								} else if (status === "REJECTED") {
									// add rejected days
									rejected.push(date);
								} else if (status === "DONE") {
									// add filled days as green
									green.push(date);
								}
							}

						}


						var weeklyCal = this.byId("WEEKLY_CALENDAR");
						// set in calendar only if get meaningful value from service
						if (firstDayOff > 0) {
							weeklyCal.setFirstDayOffset(firstDayOff);
						}

						weeklyCal.toggleDatesType(yellow, sap.me.CalendarEventType.Type04, true);
						weeklyCal.toggleDatesType(green, sap.me.CalendarEventType.Type01, true);
						weeklyCal.toggleDatesType(grey, sap.me.CalendarEventType.Type00, true);
						weeklyCal.toggleDatesType(red, sap.me.CalendarEventType.Type07, true);
						weeklyCal.toggleDatesType(rejected, sap.me.CalendarEventType.Type06, true);

						// TODO
						// set array of legend to global model
						var aLegend = {
							'yellow' : yellow,
							'green' : green,
							'grey' : grey,
							'red' : red,
							'rejected' : rejected
						};
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						oModel.setProperty("/legendforS31", aLegend);
						/**
					     * @ControllerHook Extend behavior of  get TimeSheet Calendar
					     * This hook method can be used to add UI or business logic 
					     * It is called when the getTimeSheetCalendar method executes
					     * @callback hcm.emp.mytimesheet.view.S3~extHookGetTimeSheetCalendar
					     */
							if(this.extHookGetTimeSheetCalendar) {
								this.extHookGetTimeSheetCalendar();
					  	};

					},

					// new mothod add ofr create scenario
					onAddNewEntry : function(oEvent) {

						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						oModel.setProperty('/recentlyUsedSelected', true);
						oModel.setProperty('/manualEntrySelected', false);
						this.oApplication.getModel('S31modelexch').setProperty('/recentlyUsedSelected', true);
						this.oApplication.getModel('S31modelexch').setProperty('/manualEntrySelected', false);

						var oPageData = oModel.getData();
						var entry = new hcm.emp.mytimesheet.model.TimeEntry(0, this.oBundle.getText("ADD_NEW"));
						if (this.byId("WEEKLY_CALENDAR").getSelectedDates().length > 0) {
							entry.selectedDate = this.byId("WEEKLY_CALENDAR").getSelectedDates()[0];
						}

						var oViewData = {
							entry : entry,
							dayIndex : -1,
							entryIndex : -1,
							pageData : oPageData
						};

						this.oApplication.getModel('S31modelexch').setProperty('/recentlyUsedSelected', true);
						this.oApplication.getModel('S31modelexch').setProperty('/manualEntrySelected', false);
						this.oApplication.getModel('S31modelexch').setProperty('/viewDataS3', oViewData);
																							
						var selectedDatesFromCalendar = this.byId('WEEKLY_CALENDAR').getSelectedDates();
						
						if(this.byId('ENTRY_LIST_CONTENTS').getSelectedItems()){
							for(var i=0; i < this.byId('ENTRY_LIST_CONTENTS').getSelectedItems().length ;i++){
							var selectedItem = 	this.byId('ENTRY_LIST_CONTENTS').getSelectedItems()[i];
							var refToNewEntryType = selectedItem.getType();
								if(refToNewEntryType == 'Inactive'){
									var datefromNewEntry = selectedItem.data().selectedDate;
									var dateParse = sap.ui.core.format.DateFormat.getDateInstance({
										pattern : "YYYYMMdd"
									});
									var selctedDate = dateParse.parse(datefromNewEntry);
									if(selectedDatesFromCalendar.indexOf(selctedDate) == -1){
										selectedDatesFromCalendar.push(selctedDate);
									}
								}
							}
						}
						
						this.oApplication.getModel('S31modelexch').setProperty('/selectedDates',selectedDatesFromCalendar);
														
						this.oRouter.navTo("S31",{},true);

					},

					createPageforS31 : function(pageId) {
						var self = this;
						var s31Controller = sap.ui.controller('hcm.emp.mytimesheet.view.S31');
						var navContainerRef = this.navContainerRef;
						var createPage = new sap.m.Page(pageId, {
							// showNavButton:true,
							showHeader : false,
							enablScrolling : false,
							navButtonTap : function() {
								navContainerRef.back();
								navContainerRef.removePage(navContainerRef.getPages()[1]);
							},

							footer : {
								contentRight : [new sap.m.Button({
									text : self.oBundle.getText('SUBMIT'),
									press : [s31Controller.updatePageData, s31Controller]
								}), new sap.m.Button({
									text : this.oBundle.getText('CANCEL'),
									press : function() {
										navContainerRef.back();
										navContainerRef.removePage(navContainerRef.getPages()[1]);
									}
								})]
							}
						});
						return createPage;

					},

					onCalendarWeekChange : function(oEv) {
						
											
						var self = this, oDate = new Date(oEv.getParameter("currentDate"));
						var oModel = this.oApplication.getModel("TSM_WEEKLY");

						this.checkCanLeave(function() {
							oModel.setProperty("/start", self.formatDateYYYYMMdd(oDate));
							oDate.setDate(oDate.getDate() + 6);
							oModel.setProperty("/end", self.formatDateYYYYMMdd(oDate));
							self.lastSelected = oModel.getData().selected;
							self.lastYear = oModel.getData().year;
							self.lastWeek = oModel.getData().week;
							self.lastStartDate = oModel.getData().start;
							self.lastEndDate = oModel.getData().end;
							oModel.setProperty("/showSubmit", false);// when we change week,
							// we need to reset the
							// submit button
							self.updateData();
						}, function() {

							var reverseStart = oModel.getData().start;
							var date = new Date(parseInt(reverseStart.substring(0, 4), 10),
									parseInt(reverseStart.substring(4, 6), 10) - 1, parseInt(reverseStart.substring(6, 8), 10));
							self.byId("WEEKLY_CALENDAR").setCurrentDate(date.toDateString());
							oModel.setProperty("/year", self.lastYear);
							oModel.setProperty("/week", self.lastWeek);

						});
					},

					onNavButton : function() {
						// alert("2: to be handled for wave2");
						this.oRouter.navTo("S2", {
							context : {}
						},true);

					},

					getDateStr : function(date) {
						return "" + date.getFullYear() + ("" + (date.getMonth() + 101)).substring(1)
								+ ("" + (date.getDate() + 100)).substring(1);
					},

					setWeeklyData : function(data) {
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						// initial submit button status
						oModel.setProperty("/showSubmit", false);

						var oPageData = {
							days : []
						};

						var lastRecordNumber = null;
						var lastDate = null;
						var oEntryData = {};
						var oDayData = null;
						var workingDayList = oModel.getData().workingDayList;
						for ( var i = 0; i < data.length; i++) {
							if (lastDate === null || data[i].WorkDate !== lastDate) {
								lastDate = data[i].WorkDate;
								var date = new Date(parseInt(data[i].WorkDate.substring(0, 4), 10), parseInt(data[i].WorkDate
										.substring(4, 6), 10) - 1, parseInt(data[i].WorkDate.substring(6, 8), 10));
								oDayData = {
									date : date,
									dateStr : data[i].WorkDate,
									dateFormatted : this.convertDateFormat(date),
									targetHours : this.getTargetHours(data[i].WorkDate, workingDayList),
									entries : [],
									workingDay : this.getWorkingDay(data[i].WorkDate, workingDayList)
								}; 
								oPageData.days.push(oDayData);
								lastRecordNumber = null;
							}
							if (lastRecordNumber === null || data[i].RecordNumber !== lastRecordNumber) {
								lastRecordNumber = data[i].RecordNumber;
								oEntryData = new hcm.emp.mytimesheet.model.TimeEntry(0, "", data[i].Suggested === "TRUE", true);
								// if there were suggested items enable submit button
								if (oEntryData.suggestion) {
									oModel.setProperty("/showSubmit", true);
								}
								oDayData.entries.push(oEntryData);
							}
							oEntryData.setData(data[i]);
						}

						// order list of days by date
						function compareDays(a, b) {
							if (parseInt(a.dateStr) > parseInt(b.dateStr)) {
								return 1;
							} else {
								return -1;
							}
						}
						oPageData.days.sort(compareDays);

						for (i = 0; i < workingDayList.length; i++) {
							if (workingDayList[i].workingDay) {
								var bHasEntries = false;
								var insertPosition = oPageData.days.length;
								for ( var j = 0; j < oPageData.days.length; j++) {
									if (workingDayList[i].date === oPageData.days[j].dateStr) {
										bHasEntries = true;
										break;
									}
									if (workingDayList[i].date < oPageData.days[j].dateStr) {
										insertPosition = j;
										break;
									}
								}
								if (!bHasEntries) {
									// this is a working day which is not in the list, so we
									// need to add a blank entry
									var date = new Date(parseInt(workingDayList[i].date.substring(0, 4), 10), parseInt(
											workingDayList[i].date.substring(4, 6), 10) - 1, parseInt(workingDayList[i].date.substring(6, 8),
											10));
									oDayData = {
										date : date,
										dateStr : workingDayList[i].date,
										dateFormatted : this.convertDateFormat(date),
										targetHours : this.getTargetHours(workingDayList[i].date, workingDayList),
										workingDay : workingDayList[i],
										entries : []
									};
									oPageData.days.splice(insertPosition, 0, oDayData);
								}
								// check the hours against target and insert new entry template
								// for missing hours
								for ( var day = 0; day < oPageData.days.length; day++) {
									var hours = 0;
									for ( var j = 0; j < oPageData.days[day].entries.length; j++) {
										hours += oPageData.days[day].entries[j].time;
									}
									if (hours < workingDayList[i].targetHours) {
										var missingTime = workingDayList[i].targetHours - hours;
										var newEntry = new hcm.emp.mytimesheet.model.TimeEntry(missingTime, this.oBundle.getText("ADD_NEW"));
										if (this.oConfiguration.getClockEntry()) {
											newEntry.setStartEndTimes(oDayData.date, oPageData.days[day].entries, missingTime,
													workingDayList[i]);
										}
										oPageData.days[day].entries.push(newEntry);
									}
								}

							}
						}
						// check the hours against target and insert new entry template
						// for missing hours
						var selectedDate = null;
						for ( var day = 0; day < oPageData.days.length; day++) {
							this.checkHours(oPageData, day);
							if (selectedDate == null) {
								for ( var i = 0; i < oPageData.days[day].entries.length; i++) {
									if (oPageData.days[day].entries[i].newEntry) {
										selectedDate = oPageData.days[day].date;
									}
								}
							}
						}

						this.oldDays = jQuery.extend(true, {}, oPageData.days);
						oModel.setProperty("/days", oPageData.days);

						this.loadListWithoPageData(oPageData);
						
						
					},

					checkHours : function(pageData, dayIndex) {
						// we now need to work out if we need a new entry line or not
						var totalHours = 0;
						var newEntryIndex = -1;
						for ( var i = 0; i < pageData.days[dayIndex].entries.length; i++) {
							if (pageData.days[dayIndex].entries[i].newEntry) {
								newEntryIndex = i;
							} else if (!pageData.days[dayIndex].entries[i].deleted) {
								totalHours += pageData.days[dayIndex].entries[i].time;
							}
						}
						var entriesUpdated = false;
						var missingTime = pageData.days[dayIndex].targetHours - totalHours;

						var undeletedEntries = pageData.days[dayIndex].entries.length;
						for (i = 0; i < pageData.days[dayIndex].entries.length; i++) {
							if (pageData.days[dayIndex].entries[i].deleted) {
								undeletedEntries--;
							}
						}

						// if there were no target hours and it's a working day and there is no entry, we need to add a new entry
						// template
						if (missingTime > 0 || (pageData.days[dayIndex].targetHours === 0 && undeletedEntries === 0)) {
							// new entry line is needed
							if (newEntryIndex >= 0) {
								pageData.days[dayIndex].entries[newEntryIndex].time = missingTime;
								pageData.days[dayIndex].entries[newEntryIndex].hours = Math.floor(missingTime);
								pageData.days[dayIndex].entries[newEntryIndex].minutes = Math.round((missingTime - Math
										.floor(missingTime)) * 60);
							} else {
								// there was no new entry previously, but we need one
								var newEntry = new hcm.emp.mytimesheet.model.TimeEntry(missingTime, this.oBundle.getText("ADD_NEW"));
								pageData.days[dayIndex].entries.push();
								entriesUpdated = true;
								if (this.oConfiguration.getClockEntry()) {
									newEntry.setStartEndTimes(pageData.days[dayIndex].date, pageData.days[dayIndex].entries, missingTime,
											pageData.days[dayIndex].workingDay);
								}
								pageData.days[dayIndex].entries.push(newEntry);
							}
						} else {/*
										 * // commented as new line is always needed // new entry line not needed for ( var i = 0; i <
										 * pageData.days[dayIndex].entries.length; i++) { if (pageData.days[dayIndex].entries[i].newEntry) { //
										 * if there is a new entry, remove it as we have now put the // common item there //TODO changing as
										 * new entries are required //pageData.days[dayIndex].entries.splice(i, 1);
										 * pageData.days[dayIndex].entries.push(newEntry); entriesUpdated = true; } }
										 */
						}
						return entriesUpdated;
					},

					getWorkingDay : function(date, workingDayList) {
						if (workingDayList) {
							for ( var i = 0; i < workingDayList.length; i++) {
								if (workingDayList[i].date == date) {
									return workingDayList[i];
								}
							}
						}
						return null;
					},

					getTargetHours : function(date, workingDayList) {
						var workingDay = this.getWorkingDay(date, workingDayList);
						if (workingDay) {
							return workingDay.targetHours;
						}
						return 0;
					},

					checkSubmit : function(oldDays, missingDays) {
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						if (oldDays == undefined) {
							oldDays = this.oldDays;
						}
						if (missingDays == undefined) {
							missingDays = oModel.getData().days;
						}
						if (missingDays == undefined || oldDays == undefined) {
							return;
						}

						for ( var i = 0; i < missingDays.length; i++) {

							for ( var j = 0; j < missingDays[i].entries.length; j++) {
								if (oldDays[i] && j < oldDays[i].entries.length) {
									var item1 = oldDays[i].entries[j];
									var item2 = missingDays[i].entries[j];

									if (item2.deleted || item2.counter == null || item2.suggestion || item1.mainItem != item2.mainItem
											|| item1.subItems != item2.subItems || item1.notes != item2.notes || item1.hours != item2.hours
											|| item1.minutes != item2.minutes || item1.startTime != item2.startTime
											|| item1.endTime != item2.endTime) {
										oModel.setProperty("/showSubmit", true);
										return;

									}
								} else {
									oModel.setProperty("/showSubmit", true);
									return;
								}
							}
						}

						oModel.setProperty("/showSubmit", false);
					},

					convertDateFormat : function(date) {
						return sap.ui.core.format.DateFormat.getDateInstance({
							style : "medium"
						}).format(date);
					},

					YYYYMMDDtoDate : function(date_str) {
						// check
						if (date_str == undefined)
							date_str = "";

						var y = parseInt(date_str.substr(0, 4), 10);
						var m = parseInt(date_str.substr(4, 2), 10) - 1;
						var d = parseInt(date_str.substr(6, 2), 10);

						return new Date(y, m, d, 0, 0, 0, 0);
					},

					jumpListToYYYYMMDD : function(date_str, item) {
						try {
							var oModel = this.oApplication.getModel("TSM_WEEKLY");
							var days = oModel.getData().days;

							var selected_date = this.convertDateFormat(this.YYYYMMDDtoDate(oModel.getData().selected));

							for ( var i = 0; i < days.length; i++) {
								var oDay = days[i];

								if (selected_date != this.convertDateFormat(oDay.date))
									continue;
								var items = this.entryListContents.getItems();
								for ( var j = 0; j < items.length; j++) {
									if (items[j] instanceof sap.m.GroupHeaderListItem) {
										if (items[j].getTitle() == this.convertDateFormat(/*selectedDate*/selected_date)) {
										}
									}
								}
							}
						} catch (e) {
						}
					},


					loadListWithoModel : function() {
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						this.loadListWithoPageData(oModel.getData());
					},

					loadListWithoPageData : function(oPageData) {
						if (oPageData.days == null) {
							return;
						}

						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						var selected_date = this.convertDateFormat(this.YYYYMMDDtoDate(oModel.getData().selected));
						for ( var i = 0; i < oPageData.days.length; i++) {
							var oDay = oPageData.days[i];
							oDay.selected = (selected_date == oDay.dateFormatted);
						}
						this.loadList(oPageData.days);
					},

					listSmartClick : function(oItem, clickFunc) {
						var downFunc = function(oEvent) {
							oEvent.currentTarget.downed_y = oEvent.pageY;
						};

						var upFunc = function(oEvent) {
							// hack fix to stop dialog event pass throughs
							// if(oApp.dialogIsVisible()) return;

							if (Math.abs(oEvent.currentTarget.downed_y - oEvent.pageY) < 40)
								clickFunc(oEvent);
						};

						oItem.attachBrowserEvent("mousedown", downFunc);
						oItem.attachBrowserEvent("mouseup", upFunc);
						oItem.attachBrowserEvent("touchstart", downFunc);
						oItem.attachBrowserEvent("touchend", upFunc);
					},


					// crtl+shift+f makes this function hard to read
					loadList : function(list_data) {
						// grab the entry list contents vbox for populating
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						var days = oModel.getData().days;
						var self = this;
						this.entryListContents = this.byId("ENTRY_LIST_CONTENTS");
						this.entryListContents.destroyItems();

						for ( var i = 0; i < days.length; i++) {
							// var sheaderData = (!days[i].entries[0].mainItem)? " (No Data)": "";
							// create and prepare a day entry
							var oWeekEntryDayHeader = new sap.m.GroupHeaderListItem({
								title : this.convertDateFormat(days[i].date)
							// + sheaderData
							});
							
							
							oWeekEntryDayHeader.addCustomData(new sap.ui.core.CustomData({
								key : "day",
								value : days[i].date
							}));
							
							this.entryListContents.addItem(oWeekEntryDayHeader);

							// Commenting the No Data Header
							/*
							 * var oSingleListEntry = new sap.m.GroupHeaderListItem({title : "No Data "});
							 * 
							 * (!days[i].entries[0].mainItem)? this.entryListContents.addItem(oSingleListEntry): "";
							 */

							// set whether this day is selected or not
							oWeekEntryDayHeader.setSelected(days[i].selected);

							// TODO added for new entries always
							if (!days[i].entries[days[i].entries.length]) {
								if (days[i].entries[days[i].entries.length - 1]) {
									if (days[i].entries[days[i].entries.length - 1].newEntry) {

									}
									// Changed New Entry to false
									else {
										days[i].entries.push({
											newEntry : true
										});
									}
								}
							}

							// load the items for this day entry
							for ( var j = 0; j < days[i].entries.length; j++) {
								var list_item_entry = days[i].entries[j];

								if (list_item_entry.deleted) {
									continue;
								}
								var oSingleListEntry = new sap.m.ColumnListItem({
									type : "Inactive",
									tap : function(oEvent) {
										self.onItemSelectGotoEdit(oEvent);
									}
								});
								oSingleListEntry.addCustomData(new sap.ui.core.CustomData({
									key : "day",
									value : i
								}));
								oSingleListEntry.addCustomData(new sap.ui.core.CustomData({
									key : "entry",
									value : j
								}));
								oSingleListEntry.addCustomData(new sap.ui.core.CustomData({
									key : "dateformated",
									value : days[i].dateFormatted
								}));
								oSingleListEntry.addCustomData(new sap.ui.core.CustomData({
									key : "selectedDate",
									value : days[i].dateStr
								}));

								if (list_item_entry.newEntry) {
									// Removing adding of New Cell for New entry as it is not required for new Mockup
									oSingleListEntry.addCell(new sap.m.Label({
										text : this.oBundle.getText("ADD_NEW")
									}));
									// var cell = new sap.ui.layout.VerticalLayout();
									// cell.addContent(new sap.m.ObjectStatus());
									oSingleListEntry.addCell(new sap.m.Label());
									//two Extra labels 
									oSingleListEntry.addCell(new sap.m.Label());
									oSingleListEntry.addCell(new sap.m.Label());
									oSingleListEntry.addCell(new sap.m.ObjectStatus());
								} else {
									var oObject = new sap.m.ObjectIdentifier({
										title : list_item_entry.mainItem,
										text : list_item_entry.subItems,
										badgeNotes : list_item_entry.hasNotes
									});
									if (list_item_entry.showError || list_item_entry.rejectionReason) {
										var cell = new sap.ui.layout.VerticalLayout();
										cell.addContent(oObject);

										if (list_item_entry.showError) {
											cell.addContent(new sap.m.ObjectStatus({
												text : list_item_entry.error,
												state : sap.ui.core.ValueState.Error
											}));
										} else {
											cell.addContent(new sap.m.ObjectStatus({
												text : list_item_entry.rejectionReason,
												state : sap.ui.core.ValueState.Error
											}));
										}										
										oSingleListEntry.addCell(cell);
									} else {
										oSingleListEntry.addCell(oObject);
									}
									var hrsMinText = list_item_entry.hours + this.oBundle.getText("HOURS_LABEL") + " "
											+ list_item_entry.minutes + this.oBundle.getText("MINUTES_LABEL");
									//Datetime
									var timeParser = sap.ca.ui.model.format.DateFormat.getTimeInstance({pattern : "HHmmss"});
									var timeFormatter = sap.ca.ui.model.format.DateFormat.getTimeInstance({style:"medium"});
									var startTimeFormatted ;
									var endTimeFormatted;
									if(this.clockEntry){
										startTimeFormatted = timeParser.parse(list_item_entry.startTime);
										oSingleListEntry.addCell(new sap.m.Label({text:timeFormatter.format(startTimeFormatted)}));
										endTimeFormatted = timeParser.parse(list_item_entry.endTime);
										oSingleListEntry.addCell(new sap.m.Label({text:timeFormatter.format(endTimeFormatted)}));
									}
									else{
										oSingleListEntry.addCell(new sap.m.Label());
										oSingleListEntry.addCell(new sap.m.Label());
									}
									
									//Note 1959135: Display decimal time format or HH:MM time format
									var InitalInfoModel = self.oApplication.getModel("timesheet_initialInfo");
									var decimalTimeEntry = InitalInfoModel.getData().decimalTimeEntry;
									
									if(decimalTimeEntry){
										oSingleListEntry.addCell(new sap.m.Label({
											text : sap.ca.ui.model.format.NumberFormat.getInstance({style:'standard'}).format(list_item_entry.time),//dot-comma issue
											visible : list_item_entry.showTime
										}));										
									}else{
										oSingleListEntry.addCell(new sap.m.Label({
											text : hrsMinText,
											visible : list_item_entry.showTime
										}));
									}
									
									// Adding the status in the table
									var stateOfStatus;
									if (list_item_entry.statusId == "REJECTED" || list_item_entry.statusId == "MSAVE") { //Note:save should also be in red color	
										stateOfStatus = sap.ui.core.ValueState.Error;
									} else {
										stateOfStatus = sap.ui.core.ValueState.Success;
									}
									oSingleListEntry.setType("Navigation");
									oSingleListEntry.addCell(new sap.m.ObjectStatus({
										text : list_item_entry.status,
										state : stateOfStatus
									}));
								}
								// TODO Check

								this.entryListContents.addItem(oSingleListEntry);
								/*
								 * if(list_item_entry.mainItem){ this.entryListContents.addItem(oSingleListEntry); }else{
								 *  };
								 */

							}
						}
						if (jQuery.device.is.phone) {
							this.byId("WEEKLY_PAGE").setTitle(
									this.oBundle.getText("SUMMARY", [
											this.convertDateFormat(this.parseDateYYYYMMdd(oModel.getData().start)),
											this.convertDateFormat(this.parseDateYYYYMMdd(oModel.getData().end))]));
						}
						if (jQuery.device.is.phone || jQuery.device.is.tablet) {
							var oSwipeContent = new sap.m.Button({
								text : this.oBundle.getText("DELETE"),
								type : "Reject"
							});
							var self = this;
							oSwipeContent.attachPress(function() {
								var oData = oModel.getData();
								oData.days[self.dayIndex].entries[self.entryIndex].deleted = true;
								self.checkHours(oData, self.dayIndex);
								self.loadListWithoModel();
								self.checkSubmit();
							});
							this.byId("ENTRY_LIST_CONTENTS").setSwipeContent(oSwipeContent);
						}

						// this sets the size of the status bar to fill the height of the whole row
						setTimeout(function() {
							$(".sapTSM-WPEntryColor").each(function(index, value) {
								var $value = $(this);
								var height = $value.parent().parent().height();
								$value.height(height);
							});
						}, 500);
						/**
					     * @ControllerHook Extend behavior of Load List
					     * This hook method can be used to add UI or business logic 
					     * It is called when the LoadList method executes
					     * @callback hcm.emp.mytimesheet.view.S3~extHookLoadList
					     */
							if(this.extHookLoadList) {
								this.extHookLoadList();
					  	};
					},

					// end of changed to load list for multiple edits

					// TODO code added for delete functionailty
					onDelete : function(oEvent) {
						var oTableRef = this.byId("ENTRY_LIST_CONTENTS");
						var selectedItems = [];
						selectedItems = oTableRef.getSelectedItems();
						// Deleted Hours Summary
						var deletedHours = 0;
						var deletedMinutes = 0;
						var deletedTime = 0;
						var numberOfItemsGettingDeleted;
						var dayIndex;
						var entryIndex;
						var entry;
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						var oPageData = oModel.getData();
						var oSettings = null;
						numberOfItemsGettingDeleted = selectedItems.length;
						for ( var i = 0; i < selectedItems.length; i++) {
							dayIndex = selectedItems[i].data().day;
							entryIndex = selectedItems[i].data().entry;
							entry = oPageData.days[dayIndex].entries[entryIndex];
							this.updatePageData(true, dayIndex, entry,false);
							if(entry.subItems != this.oApplicationFacade.getResourceBundle().getText("ADD_NEW")){
							jQuery.sap.log.info("Hours : " + entry.hours);
							deletedHours += entry.hours;
							deletedMinutes += entry.minutes;
							jQuery.sap.log.info("Minutes : " + entry.minutes);
							deletedTime += entry.time;
							deletedTime = parseFloat(deletedTime.toFixed(2));
							jQuery.sap.log.info("Duration : " + entry.time);
							}else{
								numberOfItemsGettingDeleted--;
							}
							/*
							 * if(entry.newEntry == true){ numberOfItemsGettingDeleted--; }
							 */
							if (deletedMinutes > 59) {
								deletedMinutes -= 60;
								deletedHours++;
							}
						}
						if(this.isClockEntry()){

						oSettings = {
							question : this.oBundle.getText('DELETE_CONFIRMATION_SUMMARY'),
							additionalInformation : [
									{
										label : this.oBundle.getText('DELETE_CONFIRMATION_SUMMARY_ENTRIES'),
										text : numberOfItemsGettingDeleted.toString()
									},
									{
										label : this.oBundle.getText('DELETE_CONFIRMATION_SUMMARY_HOURS'),
										text : this.oBundle.getText('FULL_CONCATENATE_HOURSMIN',[deletedHours,deletedMinutes])
									}],
							showNote : false,
							title : this.oConfiguration.getText("DELETE_CONFIRMATION"),
							confirmButtonLabel : this.oBundle.getText("OK")
						};
						}
						else{
							var txt_tot_duration = this.oBundle.getText('TOTAL_DURATION');//NOTE CODE ADDED TO COMPENSATE FOR MISSING TEXT IN i18 file...Replace this as soon as the translations have come
                            if(txt_tot_duration.indexOf('_')!=(-1)){
                            	txt_tot_duration = "Total Duration";
                            }
							oSettings = {
							question : this.oBundle.getText('DELETE_CONFIRMATION_SUMMARY'),
							additionalInformation : [
									{
										label : this.oBundle.getText('DELETE_CONFIRMATION_SUMMARY_ENTRIES'),
										text : numberOfItemsGettingDeleted.toString()
									},
									{
										label : txt_tot_duration,
										text : sap.ca.ui.model.format.NumberFormat.getInstance({style:'standard'}).format(deletedTime.toString())
									}],
							showNote : false,
							title : this.oConfiguration.getText("DELETE_CONFIRMATION"),
							confirmButtonLabel : this.oBundle.getText("OK")
						};
						}

						var _this = this;
						sap.ca.ui.dialog.factory.confirm(oSettings, function(response) {
							if (response.isConfirmed == true) {
								_this._submit(selectedItems.length, deletedHours, deletedMinutes);
							}
						});

						// this.loadListWithoModel();
						// this.getView().setModel(oModel);

						// Loading list after data for all the selected entries is updated

					},

					isClockEntry : function() {
						return this.oConfiguration.getClockEntry();
					},

					updatePageData : function(bDeleted, dayIndex, entry,bToBeReleased) {
						//return when new entry has been selectd and sent for submitting
						//
						if(!entry){
							return;
						}
						
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						var pageData_update = oModel.getData();
						this.entry = entry;
						this.dayIndex = dayIndex;
						if (bDeleted) {
							this.entry.deleted = true;
						}
						if(bToBeReleased){
							this.entry.bToBeReleased = true;
						}

						// Prepare entry
						this.entry.newEntry = false;
						this.entry.showTime = true;
						if (!this.isClockEntry()) {
							this.entry.hours = parseInt(this.entry.hours, 10);
							this.entry.minutes = parseInt(this.entry.minutes, 10);
						} else {
						//	var startTime = this.byId("startTime").getDateValue(), endTime = this.byId("endTime").getDateValue();

							this.entry.startTime = entry.startTime;
							this.entry.endTime = entry.endTime;

						//	var durationInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
/*
							var iStart = startTime.getHours() * 60 + startTime.getMinutes();
							var iEnd = endTime.getHours() * 60 + endTime.getMinutes();
							var iLunchStart = parseInt(this.workingDay.lunchStart.substring(0, 2), 10) * 60
									+ parseInt(this.workingDay.lunchStart.substring(2, 4), 10);
							var iLunchEnd = parseInt(this.workingDay.lunchEnd.substring(0, 2), 10) * 60
									+ parseInt(this.workingDay.lunchEnd.substring(2, 4), 10);

							if (iStart < iLunchStart && iEnd > iLunchEnd) {
								// deduct lunch time from duration
								durationInMinutes -= (iLunchEnd - iLunchStart);
							}
							if (durationInMinutes < 0) {
								durationInMinutes += (24 * 60);
							}*/
							this.entry.hours = entry.hours;
							this.entry.minutes = entry.minutes;
							this.entry.time = entry.time;
						}
						

						this.entry.hasNotes = (this.entry.notes && this.entry.notes.length > 0) ? true : false;

						if (this.dayIndex < 0) {
							// this is a multi-day entry
							var calendar = this.byId("weeklyCalendar");
							var selectedDates = calendar.getSelectedDates();
							for ( var i = 0; i < selectedDates.length; i++) {
								var entries = this.getDateEntries(selectedDates[i]);
								entries.push(jQuery.extend(true, {}, this.entry));
								for ( var k = 0; k < entries.length; k++) {
									if (entries[k].newEntry) {
										// if there is a new entry, remove it as we have now put the common item there
										entries.splice(k, 1);
									}
								}
							}
						} else {
							pageData_update.days[this.dayIndex].entries[this.entryIndex] = this.entry;

							// we now need to work out if we need a new entry line or not
							var totalHours = 0;
							var newEntryIndex = -1;
							for ( var i = 0; i < pageData_update.days[this.dayIndex].entries.length; i++) {
								if (pageData_update.days[this.dayIndex].entries[i].newEntry) {
									newEntryIndex = i;
								} else {
									totalHours += pageData_update.days[this.dayIndex].entries[i].time;
								}
							}
							var missingTime = pageData_update.days[this.dayIndex].targetHours - totalHours;
							if (missingTime > 0) {
								// new entry line is needed
								if (newEntryIndex >= 0) {
									pageData_update.days[this.dayIndex].entries[newEntryIndex].time = missingTime;
									pageData_update.days[this.dayIndex].entries[newEntryIndex].hours = Math.floor(missingTime);
									pageData_update.days[this.dayIndex].entries[newEntryIndex].time = Math.round((missingTime - Math
											.floor(missingTime)) * 60);
								} else {
									// there was no new entry previously, but we need one
									var newEntry = new hcm.emp.mytimesheet.model.TimeEntry(missingTime, this.oBundle.getText("ADD_NEW"));
									if (this.isClockEntry()) {
										newEntry.setStartEndTimes(pageData_update.days[this.dayIndex].date,
												pageData_update.days[this.dayIndex].entries, missingTime, this.workingDay);
									}
									pageData_update.days[this.dayIndex].entries.push(newEntry);
								}
							} else {
								// new entry line not needed
								for ( var i = 0; i < pageData_update.days[this.dayIndex].entries.length; i++) {
									if (pageData_update.days[this.dayIndex].entries[i].newEntry) {
										// if there is a new entry, remove it as we have now put the common item there
										pageData_update.days[this.dayIndex].entries.splice(i, 1);
									}
								}
							}
						}

						// calling check Select Entries to form the necessary checks
						this.checkSelectedEntry({
							pageData : pageData_update,
							dayIndex : this.dayIndex
						});
						/**
					     * @ControllerHook Extend behavior of Update Page Data
					     * This hook method can be used to add UI or business logic 
					     * It is called when the UpdatePageData method executes
					     * @callback hcm.emp.mytimesheet.view.S3~extHookUpdatePageData
					     */
							if(this.extHookUpdatePageData) {
								this.extHookUpdatePageData();
					  	};
					},

					// Function similar to fromPopOver Which will do the necessary checks
					checkSelectedEntry : function(oData) {
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						var localEventdata;
						localEventdata = oData;
						if (localEventdata.dayIndex !== undefined) {
							if (localEventdata.dayIndex >= 0) {
								this.checkHours(localEventdata.pageData, localEventdata.dayIndex);
								//TODO: chk this
								//this.selectDate(localEventdata.pageData.days[localEventdata.dayIndex].date);
							} else {
								// if we returned to this page from using the plus, then we need to check hours for all days
								for ( var i = 0; i < localEventdata.pageData.days.length; i++) {
									this.checkHours(localEventdata.pageData, i);
								}
							}
							this.checkSubmit(this.oldDays, localEventdata.pageData.days);
							/*
							 * this.loadListWithoModel(); this.getView().setModel(oModel);
							 */
						}
					},

					manageChecklist : function(objectlistItems, objectItem, operation) {
						var indexValue;

						if (null !== objectlistItems && "" !== objectlistItems) {
							for ( var it = 0; it < objectlistItems.length; it++) {
								if (objectlistItems[it] instanceof sap.m.GroupHeaderListItem) {
									if (!objectlistItems[it].getSelected()) {
										if ((indexValue = jQuery.inArray(objectlistItems[it], this.checkboxList)) !== -1) {
											this.checkboxList.splice(indexValue, 1);
										}
									} else {
										if ((indexValue = jQuery.inArray(objectlistItems[it], this.checkboxList)) === -1) {
											this.checkboxList.push(objectlistItems[it]);
										}
									}
								}
							}

						} else {
							if (operation === "pop") {
								if ((indexValue = jQuery.inArray(objectItem, this.checkboxList)) !== -1) {
									this.checkboxList.splice(indexValue, 1);
								}
							}
							if (operation === "push") {
								if ((indexValue = jQuery.inArray(objectItem, this.checkboxList)) === -1) {
									this.checkboxList.push(objectItem);
								}
							}
						}
					},

					manageSelection : function(listItems, dateRefernce, fromClick) {
						var valuesPresent = false;
						// var groupNameFlag=[].concat(dateRefernces);
						var indexValue;

						for ( var i = 0; i < listItems.length; i++) {
							if (listItems[i].mAggregations.customData.length === 4) {
								if (listItems[i].mAggregations.customData[2].mProperties.value === this.convertDateFormat(dateRefernce)) {
									if (listItems[i].getSelected() && !fromClick) {
										listItems[i].setSelected(false);
										this.manageChecklist(null, listItems[i], "pop");
									} else if ((!listItems[i].getSelected() && fromClick)){
										listItems[i].setSelected(true);
										this.manageChecklist(null, listItems[i], "push");
										// if((indexValue=jQuery.inArray(dateRefernce,groupNameFlag))!==-1){
										// groupNameFlag.slice(indexValue,1);
										// }
									}
									if (fromClick) {
										// if the user clicked to select this date, we see if we should add an entry for overtime.
										// if it was from a navigation, we don't do anything
										this.checkOvertime(dateRefernce);
									}
								}
							}
						}

						valuesPresent = true;


						return valuesPresent;
					},

	selectDateOnAllCheckBoxSelection : function(tblCntrl, curntListItem) {
						
						var listItems = tblCntrl.getItems();
						var selItems = tblCntrl.getSelectedItems();
						var curntSelIndex = tblCntrl.indexOfItem(curntListItem);
						var headerIndexes = [];
						var currentHeaderIndex = null;
						for ( var i = 0; i < listItems.length; i++) {
							if (listItems[i] instanceof sap.m.GroupHeaderListItem) {
								headerIndexes.push(i);
								jQuery.sap.log.info(i + "Items is a header" + listItems[i].getTitle());
							} else if (listItems[i] instanceof sap.m.ColumnListItem) {
								jQuery.sap.log.info(i + "Items is a list items");
							}
							
							if(curntSelIndex === i){
								currentHeaderIndex = headerIndexes.length-1;
							}
						}
						//var k = 0;
						var noOfHeaders = headerIndexes.length;
						jQuery.sap.log.info("Number of Header :" + noOfHeaders);
						var startIndex=null;
						var endIndex=null;
						startIndex = headerIndexes[currentHeaderIndex] + 1;
						if(startIndex===undefined){
							startIndex = headerIndexes[currentHeaderIndex];
						}
						endIndex = headerIndexes[currentHeaderIndex + 1];
						if(endIndex===undefined){
							endIndex = headerIndexes[currentHeaderIndex];
						}
						var isPeerUnchkd = false;
						var selectedDates = [];
						var unSelectedDates = [];
						if(endIndex<startIndex){							
							for ( var j = startIndex; j < listItems.length; j++) {
								if (!listItems[j].getSelected()) {
									isPeerUnchkd = true;
								}			
							}
							
						}else{
							for ( var j = startIndex; j < endIndex; j++) {
								if (!listItems[j].getSelected()) {
									isPeerUnchkd = true;
								} 			
							}
						}
						
						var dateFormatter = sap.ca.ui.model.format.DateFormat.getInstance();
						
						if(!curntSelIndex==0){
							var selDate = dateFormatter.convertToDate(this._getHeaderDate(listItems[headerIndexes[currentHeaderIndex]]));
							if (!isPeerUnchkd) {
								selectedDates.push(selDate);
							}else{
								unSelectedDates.push(selDate);
							}
							}
						else{
							// select all case
							if (tblCntrl._selectAllCheckBox.getSelected()) {
								for ( var i = 0; i < headerIndexes.length; i++) {
									var crntDate = dateFormatter.convertToDate(this._getHeaderDate(listItems[headerIndexes[i]]));
									selectedDates.push(crntDate);
								}
							}else{
								for ( var i = 0; i < headerIndexes.length; i++) {
									var crntDate = dateFormatter.convertToDate(this._getHeaderDate(listItems[headerIndexes[i]]));
									unSelectedDates.push(crntDate);
								}
							}
						}
						
						// unselect all case
						// selectAllCheckBox in table should be expose public api
						if(curntSelIndex==1 && !tblCntrl._selectAllCheckBox.getSelected() && selItems.length == 0){
							for ( var i = 0; i < headerIndexes.length; i++) {
								var curntDate = dateFormatter.convertToDate(this._getHeaderDate(listItems[headerIndexes[i]]));
								unSelectedDates.push(curntDate);
							}
						}
						
						this.byId("WEEKLY_CALENDAR").toggleDatesSelection(selectedDates, true);
						this.byId("WEEKLY_CALENDAR").toggleDatesSelection(unSelectedDates, false);
						selectedDates = [];
						unSelectedDates =[];
					},
					
					_getHeaderDate : function(headerItem){
						var customData = headerItem.getCustomData();
						for(var i = 0; i < customData.length; i++) {
							if(customData[i].getKey()==="day") {
								return customData[i].getValue();
							}
						}						
					},


					unselectTopDates : function(groupNames) {
						this.byId("WEEKLY_CALENDAR").toggleDatesSelection(groupNames, false);
					},

					
					getHeaderFooterOptions : function() {

						var that = this;
						return {
							sI18NFullscreenTitle : "TIMESHEET_TITLE",

							oEditBtn : {
								id : "QUICK_FILL_BTN",
								sI18nBtnTxt : "CREATE",
								onBtnPressed : function(evt) {
									that.onAddNewEntry(evt);
								}
							},

							buttonList : [

							{
								sId : "deleteBtn",
								sI18nBtnTxt : "DELETE",
								onBtnPressed : function(evt) {
									// that.onQuickEntry(evt);
									that.onDelete(evt);
								}
							}, {
								sId : "SUBMIT_BTN",
								sI18nBtnTxt : "SUBMIT",
								onBtnPressed : function(evt) {
									// that.onQuickEntry(evt);
									that.onSubmit(evt);
								}
							}],
													
							  onBack: jQuery.proxy(function() {	
					                var sDir = sap.ui.core.routing.History.getInstance().getDirection(""); // dummy call
					                if (sDir && sDir !== "Unknown") {	
					                    window.history.go(-1);	
					                } else {	
					                    this.oRouter.navTo("S2", {}, true);	
					                }	
							}, this)
					        
							
						};

					}

				});
},
	"hcm/emp/mytimesheet/view/S3.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View controllerName="hcm.emp.mytimesheet.view.S3" xmlns="sap.m"\n\txmlns:me="sap.me" xmlns:core="sap.ui.core">\n\t<Page id="WEEKLY_PAGE" title="{i18n>WEEKENTRY_TITLE}"\n\t\tenableScrolling="true" >\n\t<!-- \t showNavButton="true" navButtonTap="onNavButton"> -->\n\t\t<content>\n\t\t\t<me:Calendar id="WEEKLY_CALENDAR" swipeToNavigate="true"\n\t\t\t\tdesign="Approval" singleRow="true" hideNavControls="false"\n\t\t\t\t currentDate="{ path: \'/start\', formatter:\'.parseDateYYYYMMdd\' }"\n\t\t\t\ttapOnDate="onSelect" enableMultiselection=\'true\' changeCurrentDate="onCalendarWeekChange">\n\t\t\t</me:Calendar>\n\n\t\t\t<!-- <ScrollContainer vertical="true" width="100%" id="ENTRY_LIST"> -->\n\n\t\t\t\t<Table id="ENTRY_LIST_CONTENTS" mode="MultiSelect" \n\t\t\t\t\tselect="onItemSelect">\n\t\t\t\t\t<columns>\n\t\t\t\t\t\t\n\t\t\t\t\t\t<Column hAlign="Left">\n\t\t\t\t\t\t\t<header>\n\t\t\t\t\t\t\t\t<Label design="Bold" text="{i18n>COST_ASSIGNMENT}">\n\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t</header>\n\t\t\t\t\t\t</Column>\n\n\t\t\t\t\t\t<Column   hAlign="Center" demandPopin="true" minScreenWidth="340px" visible="{/clockEntry}"\n\t\t\t\t\t\t\tpopinDisplay="Inline">\n\t\t\t\t\t\t\t<header>\n\t\t\t\t\t\t\t\t<Label design="Bold" text="{i18n>START_TIME}">\n\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t</header>\n\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t\n\t\t\t\t\t\t<Column hAlign="Center" demandPopin="true" minScreenWidth="340px" visible="{/clockEntry}"\n\t\t\t\t\t\t\tpopinDisplay="Inline">\n\t\t\t\t\t\t\t<header>\n\t\t\t\t\t\t\t\t<Label design="Bold" text="{i18n>END_TIME}">\n\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t</header>\n\t\t\t\t\t\t</Column>\n\n\t\t\t\t\t\t<Column hAlign="Center" demandPopin="true" minScreenWidth="340px"\n\t\t\t\t\t\t\tpopinDisplay="Inline">\n\t\t\t\t\t\t\t<header>\n\t\t\t\t\t\t\t\t<Label design="Bold" text="{i18n>DURATION}">\n\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t</header>\n\t\t\t\t\t\t</Column>\n\n\n\t\t\t\t\t\t<Column hAlign="Right" minScreenWidth="Tablet" demandPopin="true"\n\t\t\t\t\t\t\tpopinDisplay="Inline">\n\t\t\t\t\t\t\t<header>\n\t\t\t\t\t\t\t\t<Label text="{i18n>STATUS}" design="Bold">\n\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t</header>\n\t\t\t\t\t\t</Column>\n\t\t\t\t\t<!-- extension point for additional column -->\t\n        \t\t <core:ExtensionPoint name="extS3Column"></core:ExtensionPoint>\n\t\t\t\t\t</columns>\n\t\t\t\t</Table>\n\n\t\t\t<!-- </ScrollContainer> -->\n\n\t\t</content>\n\n\t</Page>\n</core:View>\n',
	"hcm/emp/mytimesheet/view/S31.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("sap.ui.model.odata.datajs");
jQuery.sap.require("hcm.emp.mytimesheet.utils.PerfUtils");
jQuery.sap.require("hcm.emp.mytimesheet.utils.ConnectionHelper");
jQuery.sap.require("sap.ca.ui.model.type.Number");//Note: dot-comma issue

sap.ca.scfld.md.controller.BaseFullscreenController
		.extend(
				"hcm.emp.mytimesheet.view.S31",
				{
//					Controller Hook method definitions
					extHookOnSuggestedInputHelp: null,
					extHookOnInputHelp:null,
					extHookUpdateData: null,

					RESULTS_TOP : 30,
					MODEL_SIZE_LIMIT : 1000,
					gv_fieldRelated : "",
					searchField_begDa : "",
					searchField_endDa : "",
					//NOTE Date Formatter
					/*parseDateYYYYMMdd : function(dateString) {
						var dateParse = sap.ui.core.format.DateFormat.getDateInstance({
							pattern : "YYYYMMdd"
						});
						return dateParse.parse(dateString);
					},*///END NOTE Date Formatter					//Repeated function
					//NOTE lunch time validator
					validateLunchBreak : function() {
						if(this.isClockEntry()) {
							if(this.entry) {
								// for clock entry employees, a task cannot start or end during the lunch break, otherwise it will be rejected
								
						
								
								if(this.entry.startTime>=this.entry.selectedDate[0].lunchStart && 
										this.entry.startTime<=this.entry.selectedDate[0].lunchEnd) {
									this.entry.startTime = this.entry.selectedDate[0].lunchEnd;
							    	this.byId("startTime").setValue(this.entry.startTime);
									
								}
								if(this.entry.endTime>=this.entry.selectedDate[0].lunchStart && 
										this.entry.endTime<=this.entry.selectedDate[0].lunchEnd) {
									this.entry.endTime = this.entry.selectedDate[0].lunchStart;
									this.byId("endTime").setValue(this.entry.endTime);
									
								}
							}
							
							if(this.entry.startTime===this.entry.endTime) {
								this.setBtnEnabled('SUBMIT_BTN', false);// disable submit if start and end time are the same
								return false;
							}
						}
						return true;
					},
					//End of NOTE lunch time validator
					//deep copy of objects
					clone : function(obj) {
					    // Handle the 3 simple types, and null or undefined
					    if (null === obj || "object" !== typeof obj) {return obj;}

					     // Handle Object
					    if (obj instanceof Object) {
					        var copy = {};
					        var attr=null;
					        for (attr in obj) {
					            if (obj.hasOwnProperty(attr)){ 
					            	copy[attr] = this.clone(obj[attr]);
					            }
					        }
					        return copy;
					    }

					    throw new Error("Unable to copy obj! Its type isn't supported.");
					},
					onInit : function() {

						jQuery.sap.measure
								.start(hcm.emp.mytimesheet.utils.PerfUtils
										.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.COST_ASSIGNMENT_SEARCH_LOAD));

						this._initialize();
						this.oModel = new sap.ui.model.json.JSONModel();
						this.oModel.setSizeLimit(this.MODEL_SIZE_LIMIT);
						this.top = this.RESULTS_TOP;
						this.localSkip = 0;
						this.remoteSkip = 0;
						this.pagingEnabled = false;
						this.localTypeList = [];
						this.remoteTypeList = [];
						this.resultsTotalCount = 0;
						this.remoteSearchPhrase = "";
						this.continueSearchOnServerActive = false;
						this.noneText = "(" + this.oBundle.getText("None")+ ")";

						this.typeListControl = this
								.byId("COST_ASSIGNMENT_TYPE_LIST");

						var self = this;
						this.scrollContainer = this
								.byId("COST_ASSIGNMENT_TYPE_SCROLL_CONTAINER");
						
						/*
						 * this.scrollContainer.addEventDelegate({
						 * onAfterRendering : function() {
						 * self.scrollerResize(); } });
						 */

						// added for dynamic f4 help
						this.recentlyUsedCostAssignmentList = [];

						// Getting the initial info model to get CLOCK_ENTRY
						// value
						var InitalInfoModel = self.oApplication
								.getModel("timesheet_initialInfo");
						var clockEntry = InitalInfoModel.getData().clockEntry;

						/*
						 * Note 1959135: Changes for visibility of clockEntry
						 * and decimalTimeEntry display
						 */
						this.oModel.setProperty("/clockEntry", false);
						this.oModel.setProperty("/decimalTimeEntryVisible",
								false);
						this.oModel.setProperty("/durationVisible", false);

						if (clockEntry) {
							this.oModel.setProperty("/clockEntry", true);
						} else {
							var decimalTimeEntry = InitalInfoModel.getData().decimalTimeEntry;
							if (decimalTimeEntry) {
								this.oModel.setProperty(
										"/decimalTimeEntryVisible", true);
							} else {
								this.oModel.setProperty("/durationVisible",
										true);
							}
						}
						/*
						 * this.oModel.setProperty("/clockEntry",clockEntry);
						 * this.oModel.setProperty("/durationVisible",!clockEntry);
						 */

						this
								.getView()
								.addEventDelegate(
										{
											onBeforeShow : function(oEvent) {
												self.firstRemoteSearch = true;

												// Check
												self.overrideNavController = self.oService;
												self.insidePopover = false;
												if (oEvent.data.overrideNavController)
													{self.overrideNavController = oEvent.data.overrideNavController;}
												if (oEvent.data.insidePopover)
													{self.insidePopover = oEvent.data.insidePopover;}

												self.oModel
														.setProperty(
																"pageTitle",
																oEvent.data.costAssignmentType);
												self.fieldName = oEvent.data.costAssignmentFieldName;
												if (oEvent.data.costAssignmentFieldValue) {
													self.fieldValue = oEvent.data.costAssignmentFieldValue;
													self.fieldValueText = oEvent.data.costAssignmentFieldValueText;
												} else {
													self.fieldValue = "";
													self.fieldValueText = "";
												}
												self.localTypeList = [];
												self.remoteTypeList = [];
												self.gv_fieldRelated = oEvent.data.costAssignmentFieldRelated; //NOTE
												self.getWorkListCollection();//Note 
												// self.getTypeListCollection();
												// self.getView().setModel(self.oModel);

												setTimeout(function() {
													self.scrollerResize();
												}, 100);
												self.initialiseView();	//Note 1959135: Reload the view
											}
										});

						$(window).resize(function() {
							self.scrollerResize();
						});

						self.recentlyUsedList = self
								.byId("COST_ASSIGNMENT_RECENTLY_USED_LIST");

						//self.getWorkListCollection();                  Note 1994402

						// set select suggested entry text
						self.oModel.setProperty("/sel_sugg_txt", self.oBundle
								.getText('SELECT_PLACEHOLDER')+ " " + self.oBundle.getText('RECENTLY_USED'));

						self.getView().setModel(self.oModel);

						var dynamictypes = new sap.ui.model.json.JSONModel();

						self.getView()
								.setModel(dynamictypes, 'fordynamictypes');

						this.viewDatafromS3 = this.oApplication.getModel(
								'S31modelexch').getData().viewDataS3;

						self.entry = (this.viewDatafromS3 && this.viewDatafromS3.entry) || {};

						// copied from editentry controller for intialising
						// duration

						this.getView().setModel(
								new sap.ui.model.json.JSONModel(self.entry),
								"entry");

						this.workListTypeNew = [];

						// code copied from cost assignment controller

						// Process data from weekentry / editentry
						// self.originalFromId = self.fromId;

						if ("mainItem" in self.entry) {
							self.selectedMainItem = self.entry.mainItem;
							self.selectedMainName = self.entry.mainName;
							self.selectedMainCode = self.entry.mainCode;
							if ("childItems" in self.entry) {
								self.selectedChildItems = self.entry.childItems;
								self.selectedChildNames = self.entry.childNames;
								self.selectedChildCodes = self.entry.childCodes;
							}
							/*
							 * var manualButton = self
							 * .byId("MANUAL_COST_ASSIGNMENT_SEGMENTED_BUTTON");
							 */
							if (self.selectedMainItem) {
								self.editCostAssignment = true;
								/*
								 * manualButton.setText(self.oBundle
								 * .getText("MANUAL_INPUT_EDIT"));
								 */
							} else {
								self.editCostAssignment = false;
								/*
								 * manualButton.setText(self.oBundle
								 * .getText("MANUAL_INPUT_ADD"));
								 */
							}
						}

						self.childItemsInitialized = false;

						this.entry = this.prepareModelData(jQuery.extend(
								new hcm.emp.mytimesheet.model.TimeEntry(), {
									newEntry : true
								}));

						/*this.oRouter.attachRouteMatched(function(oEvent) {
							if (oEvent.getParameter("name") === "S31") {

							}
						});*/

						this.editdatafroms3 = this.oApplication.getModel(
								'S31modelexch').getData().editeddata;

					},

					_initialize : function() {
						if (!this.oApplication) {

							this.oApplication = this.oApplicationFacade.oApplicationImplementation;
							this.oConfiguration = this.oApplication.oConfiguration;
							this.oConfiguration = new hcm.emp.mytimesheet.utils.InitialConfigHelper();
							this.oConfiguration
									.setInitialInfoModel(this.oApplication
											.getModel("timesheet_initialInfo"));
							this.oConnectionManager = this.oApplication.oConnectionManager;
							this.oBundle = this.oApplicationFacade.oApplicationImplementation
									.getResourceBundle();
							this.oConfiguration.setResourceBundle(this.oBundle);
							this.oService = new hcm.emp.mytimesheet.Service();

						}

					},

					/**
					 * Similar to onAfterRendering, but this hook is invoked
					 * before the controller's View is re-rendered (NOT before
					 * the first rendering! onInit() is used for that one!).
					 * 
					 * @memberOf test_mytimesheet.test
					 */

					//Note 1959135: New method for initializing the view
					initialiseView : function() {

						// to set text for the page
						var HFoption = this.getHeaderFooterOptions();
						this.dateTimeModified = false;
						if (this.oApplication.getModel('S31modelexch')
								.getData().recentlyUsedSelected) {
							HFoption.sI18NFullscreenTitle = this.oApplicationFacade
									.getResourceBundle().getText(
											"TIMESHEET_CREATE_ENTRY_TITLE");
						} else {
							HFoption.sI18NFullscreenTitle = this.oApplicationFacade
									.getResourceBundle()
									.getText(
											"TIMESHEET_EDIT_ENTRY_TITLE_SCREEN");
						}

						this.setHeaderFooterOptions(HFoption);

						// clear value of suggested values
						this.byId('COST_ASSIGNMENT_RECENTLY_USED_LIST')
								.setValue("");

						// data from prev view data of calnedar set here
						var weeklyCal = this.byId("weeklyCalendar");
						weeklyCal.setEnableMultiselection(true);

						// set selected dates from previous screen
						weeklyCal.unselectAllDates();
						weeklyCal.toggleDatesSelection(
								this.oApplication.getModel('S31modelexch')
										.getData().selectedDates, true);
						weeklyCal.setFirstDayOffset(this.oApplication.getModel('TSM_WEEKLY').getProperty("/firstDayOffset"));//Note
						// set title

						if (weeklyCal.getSelectedDates().length > 1) {
							this
									.byId('createformtitle')
									.setTitle(
											this.oBundle
													.getText(
															'SUBMIT_HEADER_TEXT',
															[		this.getDateinCurrentLanguage( weeklyCal.getSelectedDates()[0] ),	//Note 1959135
																	weeklyCal.getSelectedDates().length - 1 ] ));
							
						} else if (weeklyCal.getSelectedDates().length === 1) {
							this
									.byId('createformtitle')
									.setTitle(
											this.oBundle
													.getText(
															'SUBMIT_HEADER_TEXT_SINGLE',
															[ this.getDateinCurrentLanguage( weeklyCal.getSelectedDates()[0] ) ]));		//Note 1959135
							
						} else if (weeklyCal.getSelectedDates().length === 0) {
							this.byId('createformtitle').setTitle(
									this.oBundle.getText('ENTRY_DETAILS'));
							this.setBtnEnabled('SUBMIT_BTN', false);
						}

						var legendArray = this.viewDatafromS3.pageData.legendforS31;
						weeklyCal.toggleDatesType(legendArray['yellow'],
								sap.me.CalendarEventType.Type04, true);
						weeklyCal.toggleDatesType(legendArray['green'],
								sap.me.CalendarEventType.Type01, true);
						weeklyCal.toggleDatesType(legendArray['grey'],
								sap.me.CalendarEventType.Type00, true);
						weeklyCal.toggleDatesType(legendArray['red'],
								sap.me.CalendarEventType.Type07, true);
						weeklyCal.toggleDatesType(legendArray['rejected'],
								sap.me.CalendarEventType.Type06, true);

						var dateString = this.viewDatafromS3.pageData.start;
						var dateParse = sap.ui.core.format.DateFormat
								.getDateInstance({
									pattern : "YYYYMMdd"
								});
						var startDateS31 = dateParse.parse(dateString);
						weeklyCal.setCurrentDate(startDateS31);

						// set duration
						this.viewDatafromS3 = this.oApplication.getModel(
								'S31modelexch').getData().viewDataS3;

						this.entry = this.viewDatafromS3 && this.viewDatafromS3.entry || {};
								this.entry.time=sap.ca.ui.model.format.NumberFormat.getInstance({style:'standard'}).format(this.entry.time);//Note: dot-comma issue
						this.getView().setModel(
								new sap.ui.model.json.JSONModel(this.entry),
								"entry");

						// set value help
						var recentlyUsedSelected = this.oApplication.getModel(
								'S31modelexch').getData().recentlyUsedSelected;
						if (recentlyUsedSelected) {
							this.onRecentUsedSelect();
						}
						var manualEntrySelected = this.oApplication.getModel(
								'S31modelexch').getData().manualEntrySelected;
						if (manualEntrySelected) {

							this.onManualEntrySelect();
							var editdatafroms3 = this.oApplication.getModel(
									'S31modelexch').getData().editeddata;

							var worklisttype = this.getView().getModel(
									'fordynamictypes').getData().types;

							if (worklisttype) {
								var k;
								for ( k = 0; k < worklisttype.length; k++) {
									worklisttype[k].value = '';
									worklisttype[k].valueStateText = '';
								}

								// when only main item exists

								if (editdatafroms3.entry.childItems) {
									var i;
									for ( i = 0; i < worklisttype.length; i++) {

										if (worklisttype[i].fieldName === editdatafroms3.entry.mainName) {
											worklisttype[i].value = editdatafroms3.entry.mainItem+ ' ('+
													 editdatafroms3.entry.mainCode+
													 ')';
											worklisttype[i].valueStateText = editdatafroms3.entry.mainCode;
											continue;
										}

										var code = editdatafroms3.entry.childCodes[editdatafroms3.entry.childNames
												.indexOf(worklisttype[i].fieldName)];
										var item = editdatafroms3.entry.childItems[editdatafroms3.entry.childNames
												.indexOf(worklisttype[i].fieldName)];
										if (code) {
											worklisttype[i].value = item + ' ('+ code + ')';
										}
										if (item) {
											worklisttype[i].valueStateText = code;
										}

									}
								} else {

									for ( i = 0; i < worklisttype.length; i++) {

										if (worklisttype[i].fieldName === editdatafroms3.entry.mainName) {
											worklisttype[i].value = editdatafroms3.entry.mainItem+
													 ' ('+
													 editdatafroms3.entry.mainCode+
													 ')';
											worklisttype[i].valueStateText = editdatafroms3.entry.mainCode;
											break;
										}
									}
								}
								this.getView().getModel('fordynamictypes')
										.setProperty('/types', worklisttype);
								this.getView().setModel(
										this.getView().getModel(
												'fordynamictypes'),
										'fordynamictypes');
								weeklyCal.setEnableMultiselection(false);

							}

							// disable calendar in edit mode
							var days = [ "Sun", "Mon", "Tue", "Wed", "Thu",
									"Fri", "Sat" ];
							var selectedDay = weeklyCal.getSelectedDates()
									.toString().substr(0, 3);
							var disableDates = [];
							for ( var key in days) {
								if (!(selectedDay === days[key]))
									disableDates.push(key);
							}
							var disable = selectedDay ? disableDates : null;
							weeklyCal.setDisabledWeekDays(disable);

						} else {
							// enable all week days
							weeklyCal.setDisabledWeekDays(null);
						}
						this.getView().getModel('fordynamictypes').setProperty(
								"/recentlyUsedSelected", recentlyUsedSelected);
						this.getView().getModel('fordynamictypes').setProperty(
								"/manualEntrySelected", manualEntrySelected);

						// to set the new entry list for edit mode the second
						// tims screen is rendered
						self.manualEntrySelected = this.oApplication.getModel(
								'S31modelexch').getData().manualEntrySelected;
						if (self.manualEntrySelected) {
							editdatafroms3 = this.oApplication.getModel(
									'S31modelexch').getData().editeddata;

							if (!self.workListTypeNew) {
								self.workListTypeNew = [];
							}
							if (editdatafroms3 && editdatafroms3.entry && editdatafroms3.entry.childItems) {

								for ( i = 0; i < editdatafroms3.entry.childItems.length; i++) {
									// if(self.workListTypeNew){

									self.workListTypeNew
											.push({
												name : editdatafroms3.entry.childItems[i],
												fieldName : editdatafroms3.entry.childNames[i],
												fieldValue : editdatafroms3.entry.childCodes[i]
											});

									// }

								}
							}

						}
						else{
							this.onRecentUsedSelect();
						}
						this.validateSaveBtnVisibility();
						//NOTE checking for edit/new entry
						if(editdatafroms3){
							this.edit_entry=true;
							this.edit_entry_data = this.clone(editdatafroms3);
						}
						else{
							this.edit_entry=false;
						}
					},
					validate:function(){
						this.dateTimeModified=true;
						this.validateSaveBtnVisibility();
					},
					check_for_changed_data: function(){
						var calendar = this.byId("weeklyCalendar");
						var selectedDates = calendar.getSelectedDates();
						var duration=null;
						if(this.isClockEntry()){
								var startTime=this.byId('startTime').getValue();
								var endTime=this.byId('endTime').getValue();
								
							}
							else{
								duration=this.byId('decimalTimeEntryValue').getValue();
							}
						var note_text = this.byId('S31TextArea').getValue();
						var suggested_cost_assignment_data = this.byId('COST_ASSIGNMENT_RECENTLY_USED_LIST').getValue();
						

						
						if(this.edit_entry){
							//for edit entry check for any changed data
							var edit_entry_data = this.edit_entry_data;//has the original data
							var new_selectedDates=this.getDateStr(new Date(selectedDates[0]));
							var original_date = edit_entry_data.pageData.days[edit_entry_data.dayIndex].dateStr;
							var original_notes = edit_entry_data.entry.notes;
							var original_main_name = edit_entry_data.entry.mainName;
							var original_main_code = edit_entry_data.entry.mainCode;
							var accounting_infos = this.getView().getModel('fordynamictypes').getData().types;//current values
							var itemName;
							var itemCode;
							var selected_accounting_info;
							var startString,endString;
							var index,index2;
							//checking for any change in the time entered
							if(this.isClockEntry()){
								var original_start_time=edit_entry_data.entry.startTime;
								var original_end_time=edit_entry_data.entry.endTime;
								if(original_start_time!==startTime || original_end_time!==endTime)
									return true;
							}
							else{
								var original_duration = edit_entry_data.entry.time;
								if(original_duration!==duration)
								return true;
							}
							
								//checking if there is any change in the accounting infos
								for(index = 0; index < accounting_infos.length; index++){
									
									itemName = accounting_infos[index].fieldName;
									//comparing the main item to check for any change
									if(itemName === original_main_name){
										selected_accounting_info = accounting_infos[index].value;
										startString = accounting_infos[index].value.indexOf('(');
										endString = accounting_infos[index].value.indexOf(')');
										itemCode = accounting_infos[index].value.substring(startString+1,endString);
										if(itemCode !== original_main_code){
											return true;
										}
									}
									//checking the child items for any change
									for(index2=0;edit_entry_data.entry.childItems && edit_entry_data.entry.childItems[index2]; index2++){
										if(edit_entry_data.entry.childNames[index2]=== itemName){
											selected_accounting_info = accounting_infos[index].value;
											startString = accounting_infos[index].value.indexOf('(');
											endString = accounting_infos[index].value.indexOf(')');
											itemCode = accounting_infos[index].value.substring(startString+1,endString);
											if(edit_entry_data.entry.childCodes[index2]!==itemCode){
												return true;
											}
										}
									}
								}
							
							if(selectedDates.length>1 || original_date!==new_selectedDates || original_notes!==note_text){
								return true;
							}
								//Incase no items have changed
								return false;
							}	
						else{
							//for new entries check for any data entered
							var manual_cost_assignment_data=false;
						
							var typesArray = this.getView().getModel('fordynamictypes').getData().types;
							if (typesArray) {
								for ( var i = 0; i < typesArray.length; i++)
									if (typesArray[i].value.trim())
										manual_cost_assignment_data = true;
							}
							//checking if any of the fields have some value or not
							if(this.isClockEntry()){
							if(selectedDates.length!==0 || startTime!=="" || endTime!=="" || suggested_cost_assignment_data!=="" || manual_cost_assignment_data)
							return true;
							}
							else{
								if(selectedDates.length!==0 || (duration!=="0" && duration!=="") || suggested_cost_assignment_data!=="" || manual_cost_assignment_data)
							return true;
							}
							return false;
						}
					},
					onBeforeRendering : function() {
						this.initialiseView();				//Note 1959135
					},
					
					// DATA/MODEL HANDLING
					prepareModelData : function(data) {
						var hours, minutes;

						// remove new entry text from structure
						if (!data.mainItem) {
							data.subItems = "";
						}

						// Add missing fields with useful defaults
						if (data.hours === undefined || data.hours === "") {
							hours = parseInt(this.getTargetHours(), 10);
							data.hours = hours;
						}
						if (data.minutes === undefined || data.minutes === "") {
							minutes = parseInt(
									(this.getTargetHours() % 1) * 60, 10);
							data.minutes = minutes;
						}

						// TODO: Use default start/end time when available
						/*if (this.isClockEntry() && (!data.startTime || data.startTime === "000000")) {
							// data.startTime = this.workingDay.startTime;
						}*/
						/*if (this.isClockEntry() && (!data.endTime || data.endTime === "000000")) {
							// data.endTime = this.workingDay.endTime;
						}*/

						return data;
					},
					
					//Note 1959135: Date Language Translation
					getDateinCurrentLanguage: function(dateSelected){
						var tempModel = new sap.ui.model.json.JSONModel();
						var odataq = {	dateValue: new Date(dateSelected) };
						
						tempModel.setData(odataq);
						var tempTextView = new sap.m.Text({ text:{path:"/dateValue", 
															type:new sap.ui.model.type.Date({style:"full"})}}).setModel(tempModel);
						return tempTextView.getText();
					},
					
					onTapOnDate : function(oEvent) {
						this.validateSaveBtnVisibility(oEvent);
						var dateSelected = oEvent.getSource()
								.getSelectedDates();
						var numberOfDatesSelected = dateSelected.length;
						if (numberOfDatesSelected > 1) {

							this
									.byId('createformtitle')
									.setTitle(
											this.oBundle
													.getText(
															'SUBMIT_HEADER_TEXT',
															[
																	this.getDateinCurrentLanguage(dateSelected[0]),				//Note 1959135
																	numberOfDatesSelected - 1 ]));
						} else if (numberOfDatesSelected === 1) {
							this.byId('createformtitle').setTitle(
									this.oBundle.getText(
											'SUBMIT_HEADER_TEXT_SINGLE',[ this.getDateinCurrentLanguage(dateSelected[0]) ]));	//Note 1959135
							
						} else if (numberOfDatesSelected === 0) {
							this.byId('createformtitle').setTitle(
									this.oBundle.getText('ENTRY_DETAILS'));
						}

					},
					validateSaveBtnVisibility : function(oEvent) {
						var timeFlag = false;
						//checking the type of time entry and setting the flag true only for valid times
						if(this.isClockEntry()){
							var startTime = this.byId('startTime').getValue();
							var endTime = this.byId('endTime').getValue();
							if(((startTime && endTime) && startTime !== endTime)){
								timeFlag=true;
							}
							else{
								timeFlag = false;
							}
								
						}
						else{
							//condition for decimal inputs
							var decimalTimeEntryValue = this.byId(
								'decimalTimeEntryValue').getValue();
							if((decimalTimeEntryValue!=="0") && decimalTimeEntryValue!==''){
								//if condition checks if any value has been entered for the decimal input control
								if(this._isValidDecimalNumber(decimalTimeEntryValue)){
									timeFlag=true;
								}
								else{
									timeFlag = false;
								}
								
							}
							else{
								timeFlag = false;
							}
						}
						var selectedDate = this.byId('weeklyCalendar')
								.getSelectedDates().length;
						//var dateTimeValue = this.byId('DateTimeInputValue')
						//		.getValue();
						
						

						var flag = false;
						if (this.recentlyUsedButtonSelected) {
							flag = this.byId(
									'COST_ASSIGNMENT_RECENTLY_USED_LIST')
									.getValue() ? true : false;
						} else {
							flag = false;
							var typesArray = this.getView().getModel(
									'fordynamictypes').getData().types;
							if (typesArray) {
								for ( var i = 0; i < typesArray.length; i++){
									if (typesArray[i].value.trim() || typesArray[i].valueStateText.trim())
									{
										flag = true;
										break;
									}
								}
							}

						}

				// Note 1959135: added decimalTimeEntryValue field for button enable check
						if (flag && selectedDate && timeFlag) {					
							this.setBtnEnabled('SUBMIT_BTN', true);
						} else {
							this.setBtnEnabled('SUBMIT_BTN', false);
						}
					},
					/*validateSaveBtnVisibility : function(oEvent) {
						
						var selectedDate = this.byId('weeklyCalendar')
								.getSelectedDates().length;
						var dateTimeValue = this.byId('DateTimeInputValue')
								.getValue();
						var startTime = this.byId('startTime').getValue();
						var endTime = this.byId('endTime').getValue();
						var decimalTimeEntryValue = this.byId(
								'decimalTimeEntryValue').getValue(); 	// Note 1959135

						var flag = false;
						if (this.recentlyUsedButtonSelected) {
							flag = this.byId(
									'COST_ASSIGNMENT_RECENTLY_USED_LIST')
									.getValue() ? true : false;
						} else {
							flag = false;
							var typesArray = this.getView().getModel(
									'fordynamictypes').getData().types;
							if (typesArray) {
								for ( var i = 0; i < typesArray.length; i++)
									if (typesArray[i].value.trim())
										flag = true;
							}

						}

				// Note 1959135: added decimalTimeEntryValue field for button enable check
						if (flag
								&& selectedDate
								&& ( (dateTimeValue != "00:00" && dateTimeValue != "0:0" && dateTimeValue) || 
									 ((startTime && endTime) && startTime != endTime) || 						//Note 1959135
									 (decimalTimeEntryValue!="0") ||
									 (this._isValidDecimalNumber(decimalTimeEntryValue)) ) ) {					//Note 1959135
							this.setBtnEnabled('SUBMIT_BTN', true);
						} else {
							this.setBtnEnabled('SUBMIT_BTN', false);
						}
					},*/

					suggestionHelpChange : function(oEvent) {
						oEvent.getSource().setValue("");
						this.validateSaveBtnVisibility(oEvent);
					},

					onSuggestedItemSelection : function(oEvent) {
						this.validateSaveBtnVisibility(oEvent);
					},
					onManualItemSelection : function(oEvent) {
						this.validateSaveBtnVisibility(oEvent);
						
					},

					manualHelpChange : function(oEvent) {
						oEvent.getSource().setValueStateText(
								oEvent.getSource().getValue());
						this.validateSaveBtnVisibility(oEvent);
					},

					onDurationValueChange : function(oEvent) {
						this.validateSaveBtnVisibility(oEvent);
					},

					// Note 1959135: decimalTimeEntry Validation
					onDecimalTimeValueChange : function(oEvent) {
						this.dateTimeModified=true;
						// this.validateSaveBtnVisibility(oEvent);
						var decimalTimeEntryValue = this.byId(
								'decimalTimeEntryValue').getValue();
						if (this._isValidDecimalNumber(decimalTimeEntryValue))
							this.validateSaveBtnVisibility(oEvent);//NOTE if input is a decimal number then it should call the validate save button
							//this.setBtnEnabled('SUBMIT_BTN', true);
						else
							this.setBtnEnabled('SUBMIT_BTN', false);
					},

					// Note 1959135: decimalTimeEntry Validation
					_isValidDecimalNumber : function(number) {
						var numberString = number.toString();
						var decimalIndex = numberString.indexOf(".");
						/*Note: dot-comma issue*/
						var commaIndex=numberString.indexOf(",");
						if(decimalIndex>0&&commaIndex>0)return false;//to make sure that user has entered either dot/comma but not both
						var seperatorIndex = decimalIndex;
						if(seperatorIndex<0)
						{
							seperatorIndex =numberString.indexOf(",");
						}
						var strCheck = "0123456789";
						var integerPart;
						var fractionalPart;
						var index=0;
						var hasValue = false;
						if (seperatorIndex === -1) {
							integerPart = numberString;
							fractionalPart = "";
						} else {
							integerPart = numberString.slice(0, seperatorIndex);
							fractionalPart = numberString.slice(
									seperatorIndex + 1, numberString.length);
						}
						/*Note: End dot-comma issue*/
						if (integerPart.length > 5)
							return false;
						for (index = 0; index < integerPart.length; index++) {
							if (integerPart[index] === "0") {
								// Do Nothing
							} else if (strCheck.indexOf(integerPart[index]) === -1)
								return false;
							else
								hasValue = true;
						}
						/*if (parseInt(integerPart) > 23) // Check for twenty four
														// hours
							return false;
*///Note: customer wants to enter any number of hours.So restriction removed
						if (fractionalPart.length > 2)
							return false;
						for (index = 0; index < fractionalPart.length; index++) {
							if (fractionalPart[index] === "0") {
								// Do Nothing
							} else if (strCheck.indexOf(fractionalPart[index]) === -1)
								return false;
							else
								hasValue = true;
						}
						if (hasValue === false)
							return false;

						return true;
					},

					scrollerResize : function() {
						try {
							var costAssignmentTypeSearchPage = this
									.byId("COST_ASSIGNMENT_TYPE_SEARCH_PAGE");
							var $CostAssignmentTypeSearchPage = costAssignmentTypeSearchPage
									.$();
							var $CostAssignmentTypeVSearchField = this.byId(
									"COST_ASSIGNMENT_TYPE_SEARCH_FIELD").$();
							var $CostAssignmentTypeScrollContainer = this.byId(
									"COST_ASSIGNMENT_TYPE_SCROLL_CONTAINER")
									.$();

							var costAssignmentTypeSearchPageHeight = $CostAssignmentTypeSearchPage
									.parent().height();
							var costAssignmentTypeSearchPageHeaderHeight = costAssignmentTypeSearchPage.mAggregations.internalHeader
									.$().height();
							var costAssignmentTypeVSearchFieldHeight = $CostAssignmentTypeVSearchField.height();

							// Skip resize if height is zero, which happens
							// sometimes and cause a
							// blank screen
							if (costAssignmentTypeSearchPageHeight > 0) {
								$CostAssignmentTypeScrollContainer
										.height(costAssignmentTypeSearchPageHeight - costAssignmentTypeSearchPageHeaderHeight - costAssignmentTypeVSearchFieldHeight);
							}
						} catch (e) {
						}
						// this.byId("COST_ASSIGNMENT_TYPE_SEARCH_PAGE").destroyFooter();
					},

					onNavButton : function() {/*
												 * this.cleanUpOnBack(); if
												 * (this.fieldValue) {
												 * this.overrideNavController
												 * .navigateBack(
												 * "CostAssignment", {
												 * costAssignmentReturnType : {
												 * fieldValueText :
												 * this.fieldValueText,
												 * fieldValue : this.fieldValue }
												 * }); } else {
												 * this.overrideNavController.navigateBack(
												 * "CostAssignment", {
												 * costAssignmentReturnType : ""
												 * }); }
												 */

						var calendar = this.byId("weeklyCalendar");
						var selectedDates = calendar.getSelectedDates();
						var selectedDate;
						if(selectedDates.length>0)
						{
						var dateStr=selectedDates[0];
						//this.oApplication.getModel("S31modelexch").getData().viewDataS3.pageData.start
						
						selectedDate = dateStr + 'offset'+ calendar.getFirstDayOffset();
						}
						else{//Note
							// when there are no selected dates then pass the first date of the selected week
							var startDay=this.oApplication.getModel("S31modelexch").getData().viewDataS3.pageData.start;
							selectedDate=sap.ui.core.format.DateFormat.getDateInstance({style:"short"}).parse(startDay);
							selectedDate=selectedDate.toDateString()+ 'offset'+calendar.getFirstDayOffset();
						}
						
							//checking for changes
							if(this.check_for_changed_data()){
							var oSettings = {
									question : this.oBundle.getText("CONFIRM_LEAVE_PAGE"),
									showNote : false,
									title : this.oBundle.getText("UNSAVED_CHANGES"),
									confirmButtonLabel : this.oBundle.getText("OK")
								};
								var self=this;
									sap.ca.ui.dialog.factory
											.confirm(
												oSettings,
												function(response) {
													if (response.isConfirmed === true) {
														self.oRouter.navTo("S3", {
															context : selectedDate
													},true);
													}
													
												});
							}
							else{
							
									//navigate to S3
									this.oRouter.navTo("S3",{
										context : selectedDate
									},true);
							}

					},

					/*cleanUpOnBack : function() {
						this.localSkip = 0;
						this.remoteSkip = 0;
						this.pagingEnabled = false;
						this.localTypeList = [];
						this.remoteTypeList = [];
						this.resultsTotalCount = 0;
						this.remoteSearchPhrase = "";
						this.searchPhrase = "";
						this.oModel.setProperty("typeList", []);
						this.clearSearchField();
						this.continueSearchOnServerActive = false;
					},		*/										//Repeated  functiom

					getTypeListCollection : function(oselectedItem) {

						var self = this;
						var skip = 0;
						var selectedFieldName = (oselectedItem && oselectedItem.fieldName);
						if (this.remoteSearchPhrase) {
							skip = this.remoteSkip;
						} else {
							skip = this.localSkip;
						}
						//NOTE related input help
						var lc_separator = ";;";
						var lv_search_str = "";
						var length=this.getView().getModel('fordynamictypes').getData().types.length;
						for(var i=0;i<length;i++)
							{
							var fieldValue=this.getView().getModel('fordynamictypes').getData().types[i].valueStateText;
							var fieldName=this.getView().getModel('fordynamictypes').getData().types[i].fieldName;
							if(fieldValue.length!==0 && fieldName!==selectedFieldName)
								{
								
								var lv_search_str_temp = fieldName + "=" + fieldValue;
								if(lv_search_str)
								lv_search_str+=lc_separator + lv_search_str_temp;
								else
								lv_search_str+=lv_search_str_temp;
								}
							}
						this.gv_fieldRelated=lv_search_str;
						
						//End of NOTE related input help
						
						// Check //Temporary field set to check Odata
						// this.fieldName= "RKOSTL";
						//NOTE getting the begining and end dates
						var calendarRef = this.byId('weeklyCalendar');
						var selectedDates = calendarRef.getSelectedDates();
						if(selectedDates[0]){
						var len=selectedDates.length;
						this.searchField_begDa=this.parseDateYYYYMMdd(selectedDates[0]);
						this.searchField_endDa=this.parseDateYYYYMMdd(selectedDates[len-1]);
						}
						else
						{
							var oModel = this.oApplication.getModel("TSM_WEEKLY");
							var workingDates=oModel.getData().workingDayList;
							 len=workingDates.length;
							this.searchField_begDa=workingDates[0].date;
							this.searchField_endDa=workingDates[len-1].date;
						}
						//End of NOTE
						this.oService
								.getCostAssignmentTypeListCollection(
										(selectedFieldName || this.fieldName),
										// 'RKOSTL
										this.top,
										skip,
										this.remoteSearchPhrase,
										this.gv_fieldRelated, //NOTE
										this.searchField_begDa,
										this.searchField_endDa,
										function(data) {
											self.remoteSearchActive = false;
											var typeList = [];
											// typeList =
											// self.oModel.getData()[(oselectedItem
											// && oselectedItem.fieldName)];
											if (self.remoteSearch()) {
												//self.typeBinding.filter([]);					//Note 1959135
												//NOTE Removing remoteTypeList
												//typeList = self.remoteTypeList;
												typeList = self.localTypeList;
												self.remoteSearchActive = true;
												self.lastRemoteSearchPhrase = self.remoteSearchPhrase;
											} else {
												typeList = self.localTypeList;
											}
											//NOTE NONE text issue
											// Add a "None" item to the list for
											// user to unselect
											// any type
											if (data.length > 0 && typeList.length === 0) {
												
												  typeList .push({ fieldValueId :
												  self.noneText, fieldValue :
												  self.noneText, fieldId : ""
												  });
												 
											}
											
											
											var flag;
											for ( var i = 0; i < data.length; i++) {
												//Checking for duplicate values
												flag=1;
												for(var j=0;j<typeList.length;j++){
													var vCheckFieldId = "(" + data[i].FieldId + ")";											//Note 1994402: Duplicate entry in search help
													if(typeList[j].fieldValue===data[i].FieldValue && typeList[j].fieldId===vCheckFieldId){
														flag=0;
														break;
													}
												}
												if(flag===1){
												typeList
														.push({
															fieldValue : data[i].FieldValue,
															fieldId : "("+
																	 data[i].FieldId+
																	 ")",
															fieldValueId : data[i].FieldValue+
																	 " ("+
																	 data[i].FieldId+
																	 ")"
														});
											}
											}
											
											function dynamicSort(property) {
												var sortOrder = 1;
												if(property[0] === "-") {
													sortOrder = -1;
													property = property.substr(1);
												}
												return function (a,b) {
													var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
													return result * sortOrder;
												};
											}
												typeList.sort(dynamicSort("fieldId"));
											// Check
											// self.oModel.setProperty("/typeList",
											self.oModel
													.setProperty("/"+ (oselectedItem && oselectedItem.fieldName),
															typeList);
											self.selectCostObject();
											self.oModel.updateBindings();
											if (self.remoteSearch()) {
												self.remoteResultsLength = data.length;
												self
														.checkRemotePaging(self.remoteResultsLength);
											} else {
												self.localResultsLength = data.length;
												self
														.checkLocalPaging(
																self.localResultsLength,
																oselectedItem && oselectedItem.fieldName);
											}
											jQuery.sap.measure
													.end(hcm.emp.mytimesheet.utils.PerfUtils
															.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.COST_ASSIGNMENT_SEARCH_LOAD));
										});
					},

					selectCostObject : function() {
						/* Do Nothing... */
					},

					remoteSearch : function() {
						if ("remoteSearchPhrase" in self) {
							if (self.remoteSearchPhrase) {
								return self.remoteSearchPhrase;
							}
						} else if ("remoteSearchPhrase" in this) {
							if (this.remoteSearchPhrase) {
								return this.remoteSearchPhrase;
							}
						}
						return false;
					},

					checkLocalPaging : function(recordCount, selectedFieldName) {
						//this.typeListControl = this.listOfManualItems[selectedFieldName];
						var typeListArray = this.typeListControl //this.listOfManualItems[selectedFieldName]
								.getItems();
						var typeListArrayLength = typeListArray.length;

						if (typeListArrayLength === 0 || typeListArrayLength >= this.MODEL_SIZE_LIMIT) {
							return;
						}

						if (typeListArray) {
							if (typeListArray[typeListArrayLength - 1]
									.getTitle() === this.oBundle
									.getText("TAP_TO_LOAD_MORE_LOADING")) {
								this.typeListControl
										.removeItem(typeListArray[typeListArrayLength - 1]);
							}
						}
						//NOTE Removing load more after number of hits < 30
						if (recordCount < this.top) {
							
							if (typeListArray[typeListArrayLength - 1].getTitle() === this.oBundle.getText("TAP_TO_LOAD_MORE") || 
									  typeListArray[typeListArrayLength - 1].getTitle() === this.oBundle.getText("CONTINUE_SEARCH_ON_SERVER"))
							{
							  this.typeListControl
							  .removeItem(typeListArray[typeListArrayLength -
							  1]); }
							//END of NOTE Removing load more after number of hits < 30
						} else if (recordCount >= this.top) {
							// If tap to load more item is found in the list, do
							// nothing.
							if (typeListArray[typeListArrayLength - 1]
									.getTitle() === this.oBundle
									.getText("TAP_TO_LOAD_MORE")) {
								return;
							} else {
								// If continue search on server item is found in
								// the list, replace
								// with tap to load more item, else, add the tap
								// to load more item
								// to the list.
								if (typeListArray[typeListArrayLength - 1]
										.getTitle() === this.oBundle
										.getText("CONTINUE_SEARCH_ON_SERVER")) {
									typeListArray[typeListArrayLength - 1]
											.setTitle(this.oBundle
													.getText("TAP_TO_LOAD_MORE"));
								} else {

									this.loadMoreItem = new sap.m.StandardListItem(
											{
												title : this.oBundle
														.getText("TAP_TO_LOAD_MORE"),
												active : true
											});

									this.typeListControl
											.addItem(this.loadMoreItem);
								}
							}
						}
					},

					checkRemotePaging : function(recordCount) {
						if (recordCount >= this.top ||
								 !this.remoteSearchActive ||
								 this.lastRemoteSearchPhrase !== this.remoteSearchPhrase) {
							var typeListArray = this.typeListControl.getItems();
							var typeListArrayLength = typeListArray.length;

							// Add continue search on server item if there is
							// nothing in the list.
							if (typeListArrayLength === 0 ||
									 typeListArrayLength >= this.MODEL_SIZE_LIMIT) {
								this.noneTextItem = new sap.m.StandardListItem(
										{
											title : this.noneText,
											active : true
											});

										this.typeListControl.insertItem(this.noneTextItem,0);
								this.addContinueSearchItem(this.oBundle
										.getText("CONTINUE_SEARCH_ON_SERVER"));
								
								return;
							}
						
								
							// If continue search on server item is found in the
							// list, do nothing.
							if (typeListArray[typeListArrayLength - 1]
									.getTitle() === this.oBundle
									.getText("CONTINUE_SEARCH_ON_SERVER")) {
								return;
							} else {
								// If tap to load more item is found in the
								// list, replace with
								// continue search on server item, else add the
								// continue search on
								// server item.
								if (typeListArray[typeListArrayLength - 1]
										.getTitle() === this.oBundle
										.getText("TAP_TO_LOAD_MORE")) {
									typeListArray[typeListArrayLength - 1]
											.setTitle(this.oBundle
													.getText("CONTINUE_SEARCH_ON_SERVER"));
								} else {
									this
											.addContinueSearchItem(this.oBundle
													.getText("CONTINUE_SEARCH_ON_SERVER"));
								}
							}
						}
						//NOTE Removing continue load on server if number of hits less than top
						else{
							typeListArray = this.typeListControl.getItems();
							typeListArrayLength = typeListArray.length;
							if (typeListArray[typeListArrayLength - 1].getTitle() === this.oBundle.getText("CONTINUE_SEARCH_ON_SERVER") && recordCount < this.top) {
							  this.typeListControl.removeItem(typeListArray[typeListArrayLength - 1]); }
						}
						//End of NOTE Removing continue load on server if number of hits less than top
					},

					addContinueSearchItem : function(title) {

						this.continueSearchItem = new sap.m.StandardListItem({
							title : this.oBundle
									.getText("CONTINUE_SEARCH_ON_SERVER"),
							active : true
						});

						this.typeListControl.addItem(this.continueSearchItem);

						// Merge the 2 columns in the column list item directly
						// in the HTML so
						// that the continue search on server words don't wrap
						// in a single column.
						this.continueSearchItem
								.addEventDelegate(
										{
											onAfterRendering : function(oEvent) {
												$(
														this.continueSearchItem
																.$().context.firstChild)
														.attr("colspan", "2");
											}
										}, this);
					},

					tapToLoadMore : function(selectedItem) {
						/*this.loadMoreItem.setTitle(this.oBundle
								.getText("TAP_TO_LOAD_MORE_LOADING"));*/
						this.localSkip += this.top;
						this.getTypeListCollection(selectedItem);
					},

					continueSearchOnServer : function(selectedItem) {
						/*this.continueSearchItem
								&& this.continueSearchItem
										.setTitle(this.oBundle
												.getText("CONTINUE_SEARCH_ON_SERVER_LOADING"));*/
						this.remoteSearchPhrase = this.searchPhrase;

						if (this.firstRemoteSearch) {
							this.firstRemoteSearch = false;
							this.continueSearchOnServerActive = true;
						} else {
							this.remoteSkip += this.top;
						}

						this.getTypeListCollection(selectedItem);
						return this.remoteSearchPhrase; //NOTE Search Help Disappearing Issue
					},

					refineSearchResult : function() {
						this.typeBinding = this.typeListControl
								.getBinding("items");
						var filters = [];
						if (this.searchPhrase) {
							filters.push(new sap.ui.model.Filter(
									"fieldValueId",
									sap.ui.model.FilterOperator.Contains,
									this.searchPhrase));
							filters.push(new sap.ui.model.Filter(
									"fieldValueId",
									sap.ui.model.FilterOperator.Contains,
									this.noneText));
						}
						this.typeBinding.filter(filters);
					},

					onLiveChange : function(oEvent) {

						var sValue = oEvent.getParameter("value");
						var oFilters = [];
						oFilters.push(new sap.ui.model.Filter("fieldValueId",
								sap.ui.model.FilterOperator.Contains, sValue));
						oEvent.getSource().getBinding("items").filter(oFilters);
						if (oEvent.getSource().getBinding("items").filter(
								oFilters).getLength() < 1) {
							oEvent.getSource().setNoDataText();
						}

						this.searchPhrase = oEvent.getParameter("value");
						this.searchField = oEvent.getSource();
						if (this.searchPhrase) {
							//if (!this.continueSearchOnServerActive) {
								this.refineSearchResult();//refreshes the filter->adds NONE text and the current search string
							//}
							if (this.searchPhrase !== this.remoteSearchPhrase) {
								this.resetRemoteSearch();
							}
							this.remoteSearchPhrase = this.searchPhrase;
							this.checkRemotePaging(this.remoteResultsLength);
							this.selectCostObject();
						} else {
							// User has deleted all search phrase, revert to
							// local model
							this.refineSearchResult();
							this.remoteSearchPhrase = "";
							this.oModel.setProperty("typeList",
									this.localTypeList);
							this.remoteSearchActive = false;
							this.checkLocalPaging(this.localResultsLength);
							this.resetRemoteSearch();
						}
					},

					resetRemoteSearch : function() {
						this.firstRemoteSearch = true;
						this.remoteSkip = 0;
						this.remoteTypeList = [];
						this.continueSearchOnServerActive = false;
						this.remoteSearchPhrase = "";
						this.remoteSearchActive = false;
					},

					onSelectType : function(oEvent) {
						// Check if it is the load more or continue to server
						// button
						var itemTitle = oEvent.mParameters.listItem.getTitle();
						var itemText = oEvent.mParameters.listItem.getText();
						if (itemTitle === this.oBundle
								.getText("TAP_TO_LOAD_MORE")) {
							this.tapToLoadMore();
							return;
						} else if (itemTitle === this.oBundle
								.getText("CONTINUE_SEARCH_ON_SERVER")) {
							this.continueSearchOnServer();
							return;
						}

						// If it is not one of those buttons, send the cost
						// assignment type back to the previous view
						var fieldValueText = itemTitle;
						var fieldValue = itemText
								.substr(1, itemText.length - 2);
						this.cleanUpOnBack();
						if (fieldValueText === this.noneText) {
							this.overrideNavController.navigateBack(
									"CostAssignment", {
										costAssignmentReturnType : ""
									});
						} else {
							this.cleanUpOnBack();
							this.overrideNavController.navigateBack(
									"CostAssignment", {
										costAssignmentReturnType : {
											fieldValueText : fieldValueText,
											fieldValue : fieldValue
										}
									});
						}
						this.clearSearchField();
					},

					clearSearchField : function() {
						if ("searchField" in this) {
							this.searchField.setValue("");
							this.typeBinding.filter([]);
						}
					},

					onSuggestedInputHelp : function(oEvent) {
						var self = this;

						/*
						 * 1) select dialog with list binding and static
						 * parameters
						 */

						var selectedLItem = {};
						selectedLItem.fieldName = oEvent.getSource().getModel()
								.getProperty(
										'fieldName',
										arguments[0].getSource()
												.getBindingContext());
						selectedLItem.name = oEvent.getSource().getParent()
								.getLabel().getText();
						var DialogHeader = oEvent.getSource().getPlaceholder();
						var oSelectDialog1 = new sap.m.SelectDialog({
							title : DialogHeader,
							// noDataText :
							// this.oBundle.getText('TAP_TO_LOAD_MORE_LOADING'),
							search : this.onLiveChange,
							liveChange : this.onLiveChange

						});

						var itemTemplate = new sap.m.StandardListItem({
							title : "{name}",
							description : "{others}",
							active : true
						});
						// selectedLItem.fieldName = "";
						// self.getTypeListCollection(selectedLItem);
						// self.getWorkListCollection(selectedLItem);

						// set model & bind Aggregation
						oSelectDialog1.setModel(self.oModel);
						oSelectDialog1.bindAggregation("items", "/projects",

						itemTemplate);

						oSelectDialog1.open();

						var input = arguments[0].getSource();
						self = this;
						// attach close listener
						oSelectDialog1
								.attachConfirm(function(evt) {

									var selectedItem = evt
											.getParameter("selectedItem");
									if (selectedItem) {
										self.selectedIndex = evt
												.getParameter("selectedItem")
												.getParent()
												.indexOfItem(
														evt
																.getParameter("selectedItem"));
										if (selectedItem.getDescription()) {
											input.setValue(selectedItem
													.getTitle() +
													 ", " +
													 selectedItem
															.getDescription());
										} else {
											input.setValue(selectedItem
													.getTitle());
										}
										self.validateSaveBtnVisibility(evt);
									}

									oSelectDialog1.destroy();
									oSelectDialog1 = null;
								});
						/**
					     * @ControllerHook Extend behavior of On Suggested Input Help
					     * This hook method can be used to add UI or business logic 
					     * It is called when the OnSuggestedInputHelp method executes
					     * @callback hcm.emp.mytimesheet.view.S31~extHookOnSuggestedInputHelp
					     */
							if(this.extHookOnSuggestedInputHelp) {
								this.extHookOnSuggestedInputHelp();
					  	}
					},
					//listOfManualItems : {},
					onInputHelp : function() {
						var self = this;

						/*
						 * 1) select dialog with list binding and static
						 * parameters
						 */

						var selectedLItem = {};
						selectedLItem.fieldName = arguments[0].getSource()
								.getModel().getProperty(
										'fieldName',
										arguments[0].getSource()
												.getBindingContext());
						selectedLItem.name = arguments[0].getSource()
								.getValueStateText();
						selectedLItem.fieldName = arguments[0].getSource()
								.getName();

						var SelectTile = arguments[0].getSource().getParent()
								.getLabel().getText();

						var oSelectDialog1 = new sap.m.SelectDialog({
							title : SelectTile,
							/*noDataText : this.oBundle
									.getText('TAP_TO_LOAD_MORE_LOADING'),*/
							search : [ this.onLiveChange, this ],
							liveChange : [ this.onLiveChange, this ]
						});

						var itemTemplate = new sap.m.StandardListItem({
							title : "{fieldValue}",
							description : "{fieldId}",
							active : true
						});

						//self.listOfManualItems[selectedLItem.fieldName] = oSelectDialog1;
						self.typeListControl = oSelectDialog1;
						self.getTypeListCollection(selectedLItem);

						// set model & bind Aggregation
						oSelectDialog1.setModel(self.oModel);

						oSelectDialog1.bindAggregation("items", "/" +
								 selectedLItem.fieldName, itemTemplate);

						oSelectDialog1.open();

						var input = arguments[0].getSource();

						// attach close listener
						oSelectDialog1
								.attachConfirm(function(evt) {
									var selectedItemEvent = evt
											.getParameter("selectedItem");
									if (selectedItemEvent) {
										self.selectedIndex = evt
												.getParameter("selectedItem")
												.getParent()
												.indexOfItem(
														evt
																.getParameter("selectedItem"));

										// when clciked on load more

										if (selectedItemEvent.getTitle() === self.oBundle
												.getText("TAP_TO_LOAD_MORE")) {
											self.tapToLoadMore(selectedLItem);
											oSelectDialog1.open();
											return;
										} else if (selectedItemEvent.getTitle() === self.oBundle
												.getText("CONTINUE_SEARCH_ON_SERVER")) {
											//NOTE Search Help disappearing problem
											var searchtxt = self.continueSearchOnServer(selectedLItem);
											oSelectDialog1.open(searchtxt);
											//End NOTE Search Help disappearing problem
											return;
										}
										//NOTE  NONE Issue
										else if(selectedItemEvent.getTitle() === "(None)")
										{
											input.setValue("");
                                            input.setValueStateText("");
										}
										else{
											//End of NOTE  NONE Issue
										input.setValue(selectedItemEvent
												.getTitle()+
												 " "+
												 selectedItemEvent
														.getDescription());
										input
												.setValueStateText(selectedItemEvent
														.getDescription()
														.replace('(', "")
														.replace(")", ""));
										}
										/*
										 * var fieldId =
										 * evt.getParameter("selectedItem").getModel().getProperty('fieldId',evt.getParameter("selectedItem").getBindingContext());
										 * var fieldValue =
										 * evt.getParameter("selectedItem").getModel().getProperty('fieldValue',evt.getParameter("selectedItem").getBindingContext());
										 * var fieldValueId =
										 * evt.getParameter("selectedItem").getModel().getProperty('fieldValueId',evt.getParameter("selectedItem").getBindingContext());
										 * var fieldName = input.getName(); var
										 * name = input.getPlaceholder();
										 * self.workListTypeNew.push({
										 * name:fieldName, fieldName:fieldName,
										 * fieldValue:selectedItem.getDescription().replace('(',"").replace(")","")
										 * 
										 * }); input.data({ 'key':fieldName,
										 * 'value':selectedItem.getDescription().replace('(',"").replace(")","")
										 * });
										 */
										self.validateSaveBtnVisibility(evt);

									}
									oSelectDialog1.destroy();

									oSelectDialog1 = null;
									self.localTypeList = [];				//Note 1959135
									self.remoteTypeList = [];
									self.resetRemoteSearch();
									self.top = self.RESULTS_TOP;					
									self.remoteSkip = 0;
									self.localSkip = 0;
								});

						oSelectDialog1.attachCancel(function(evt) {
							oSelectDialog1 = null;
							self.localTypeList = [];						//Note 1959135
							self.remoteTypeList = [];
							self.resetRemoteSearch();
							self.top = self.RESULTS_TOP;					
							self.remoteSkip = 0;
							self.localSkip = 0;


						});
						/**
					     * @ControllerHook Extend behavior of On Input Help
					     * This hook method can be used to add UI or business logic 
					     * It is called when the OnInputHelp method executes
					     * @callback hcm.emp.mytimesheet.view.S31~extHookOnInputHelp
					     */
							if(this.extHookOnInputHelp) {
								this.extHookOnInputHelp();
					  	}

					},
					/*initializeChildItems : function() {
						this.entry.childItems = [];
						this.entry.childNames = [];
						this.entry.childCodes = [];
					},	*/	//Repeated function
					
					// method added for f4 help
					getWorkListCollection : function(oselectedItem) {
						this.getWorkListTypeCollection();
						this.workList = [];
						this.workListType = [];
						var self = this;
						//NOTE getting the begining and end dates
						
							var oModel = this.oApplication.getModel("TSM_WEEKLY");
							var workingDates=oModel.getData().workingDayList;
							var len=workingDates.length;
							this.searchField_begDa=workingDates[0].date;
							this.searchField_endDa=workingDates[len-1].date;
						
						//End of NOTE
						this.oService
								.getCostAssignmentWorkListCollection(
										this,
										this.searchField_begDa,
										this.searchField_endDa,
										function(data) {
											// Create new worklist items for
											// every item
											// with
											// Level 0
											var workListCounter = 0;
											for ( var i = 0; i < data.length; i++) {
												if (data[i].Level.trim() === "0") {
													self.workList[workListCounter] = {
														name : data[i].FieldValueText,
														childs : [],
														fieldName : data[i].FieldName,
														fieldValue : data[i].FieldValue,
														recordNumber : data[i].RecordNumber
													};
													workListCounter++;
												}
											}

											// Add other items with non Level 0
											// FieldText
											// into the
											// previously created Level 0 item.
											for ( i = 0; i < data.length; i++) {
												if (data[i].Level.trim() !== "0") {
													for ( var j = 0; j < self.workList.length; j++) {
														if (self.workList[j].recordNumber === data[i].RecordNumber)
															self.workList[j].childs
																	.push({
																		name : data[i].FieldValueText,
																		fieldName : data[i].FieldName,
																		fieldValue : data[i].FieldValue
																	});
													}
												}
											}

											// Add the recently used list to the
											// worklist
											for ( i = 0; i < self.recentlyUsedCostAssignmentList.length; i++) {
												self.workList
														.push(self.recentlyUsedCostAssignmentList[i]);
											}

											// Populate the HTML view model with
											// the
											// data
											var projects = [];
											for (  i = 0; i < self.workList.length; i++) {
												var currentChildItems = [];
												var currentChildNames = [];
												var currentChildCodes = [];
												for (  j = 0; j < self.workList[i].childs.length; j++) {
													currentChildItems
															.push(self.workList[i].childs[j].name);
													currentChildNames
															.push(self.workList[i].childs[j].fieldName);
													currentChildCodes
															.push(self.workList[i].childs[j].fieldValue);
												}
												projects
														.push({
															name : self.workList[i].name,
															others : currentChildItems
																	.join(", "),
															childs : self.workList[i].childs,
															fieldName : self.workList[i].fieldName,
															fieldValue : self.workList[i].fieldValue,
															fieldValueId : self.workList[i].name +
																	 currentChildItems
																			.join(", ")
														});
												// Check if the current cost
												// assignment
												// type
												// matches
												// something on the recently
												// used list
												if ("selectedMainItem" in self && self.selectedMainItem) {
													if (self.workList[i].name === self.selectedMainItem &&
															 self.workList[i].fieldName === self.selectedMainName &&
															 self.workList[i].fieldValue === self.selectedMainCode) {
														if ("selectedChildItems" in self) {
															var childItems = [];
															var childNames = [];
															var childCodes = [];
															for ( j = 0; j < self.selectedChildItems.length; j++) {
																childItems
																		.push(self.selectedChildItems[j]);
																childNames
																		.push(self.selectedChildNames[j]);
																childCodes
																		.push(self.selectedChildCodes[j]);
															}
															if ($(
																	currentChildItems)
																	.not(
																			childItems).length === 0 &&
																	 $(
																			childItems)
																			.not(
																					currentChildItems).length === 0) {
																if ($(
																		currentChildNames)
																		.not(
																				childNames).length === 0 &&
																		 $(
																				childNames)
																				.not(
																						currentChildNames).length === 0) {
																	if ($(
																			currentChildCodes)
																			.not(
																					childCodes).length === 0 &&
																			 $(
																					childCodes)
																					.not(
																							currentChildCodes).length === 0) {
																		self.previouslySelectedIndex = i;
																	}
																}
															}
														} else {
															if (currentChildItems.length === 0) {
																// Match found
																// in
																// recently used
																// list
																// since
																// subItems is
																// empty
																self.previouslySelectedIndex = i;
															}
														}
													}
												}
											}

											// If selected cost assignment is
											// not in the
											// recently
											// used list, add it
											if (!("previouslySelectedIndex" in self) &&
													 "selectedMainItem" in self &&
													 self.selectedMainItem) {

												var newCostAssignmentType = self
														.createNewCostAssignmentType(
																self.selectedMainItem,
																self.selectedMainName,
																self.selectedMainCode,
																self.selectedChildItems,
																self.selectedChildNames,
																self.selectedChildCodes);

												projects
														.push(newCostAssignmentType);
												self.recentlyUsedCostAssignmentList
														.push(newCostAssignmentType);

												self.previouslySelectedIndex = self.selectedIndex = projects.length - 1;
											}

											self.workList = projects;
											var localdata = {
												projects : self.workList
											};

											self.oModel.setProperty(
													"/projects", self.workList);
											// self.oModel.setData(localdata);
											//self.getWorkListTypeCollection();
										});
					},

					valueHelpDataForamtter : function(fieldName, fieldValue) {
						if (fieldName) {
							return fieldName + " (" + fieldValue + ")";

						}
					},

					durationDateForamtter : function(h, m) {
						return h + ":" + m;
					},

					getWorkListTypeCollection : function() {
						this.workListType = [];
						var self = this;

						this.oService
								.getCostAssignmentWorkListTypeCollection(
										this,
										function(data) {

											var editdatafroms3 = {};
											// this logic will be excuted the
											// first time the view is called

											var manualEntrySelected = self.oApplication
													.getModel('S31modelexch')
													.getData().manualEntrySelected;
											if (manualEntrySelected) {
												editdatafroms3 = self.oApplication
														.getModel(
																'S31modelexch')
														.getData().editeddata;

												if (!self.workListTypeNew) {
													self.workListTypeNew = [];
												}
												if (editdatafroms3) {
													if (editdatafroms3.entry.childItems) {
														for ( var i = 0; i < editdatafroms3.entry.childItems.length; i++) {
															self.workListTypeNew
																	.push({
																		name : editdatafroms3.entry.childItems[i],
																		fieldName : editdatafroms3.entry.childNames[i],
																		fieldValue : editdatafroms3.entry.childCodes[i]
																	});
														}
													}
												}

												self.validateSaveBtnVisibility();
											}

											for (  i = 0; i < data.length; i++) {
												var name = data[i].FieldText;
												var fieldName = data[i].FieldName;
												var selectedName = self.NON_BREAKING_SPACE;
												var fieldValue = "";
												var readOnly = data[i].READONLY;			//Note: Addition of ReadOnly field
												if (self.editCostAssignment) {
													if (self.selectedMainName === fieldName) {
														fieldValue = self.selectedMainCode;
														selectedName = self.selectedMainItem;
													} else {
														if ("selectedChildItems" in self) {
															for ( var j = 0; j < self.selectedChildNames.length; j++) {
																if (self.selectedChildNames[j] === fieldName) {
																	fieldValue = self.selectedChildCodes[j];
																	selectedName = self.selectedChildItems[j];
																}
															}
														}
													}
												}
												/*name = self.oBundle
														.getText("SELECT_PLACEHOLDER")
														+ " " + name;*/			//Select keyword not required
												var valurforEntry = "";
												var valurforStateText = "";
												if (editdatafroms3 &&
														editdatafroms3.entry) {
													if (editdatafroms3.entry.childItems) {
														var code = editdatafroms3.entry.childCodes[editdatafroms3.entry.childNames
																.indexOf(fieldName)];
														var item = editdatafroms3.entry.childItems[editdatafroms3.entry.childNames
																.indexOf(fieldName)];
														if (code) {
															valurforEntry = item +
																	 ' (' +
																	 code +
																	 ')';
														}
														if (item) {
															valurforStateText = code;
														}

														if (!valurforEntry) {
															if (fieldName === editdatafroms3.entry.mainName) {
																valurforEntry = editdatafroms3.entry.mainItem +
																		 ' (' +
																		 editdatafroms3.entry.mainCode +
																		 ')';
																valurforStateText = editdatafroms3.entry.mainCode;
															}
														}

													} else {
														// miancode to be
														// handled
														if (fieldName === editdatafroms3.entry.mainName) {
															valurforEntry = editdatafroms3.entry.mainItem +
																	 ' (' +
																	 editdatafroms3.entry.mainCode +
																	 ')';
															valurforStateText = editdatafroms3.entry.mainCode;
														}
													}
												}

												self.workListType
														.push({
															name : name,
															selectedName : selectedName,
															fieldName : fieldName,
															listType : "Active",
															labelVisible : true,
															typeVisible : true,
															fieldValue : fieldValue,
															value : valurforEntry,
															valueStateText : valurforStateText,
															READONLY : readOnly.toLowerCase()==="true"? false:true	//Note: Addition of ReadOnly Field
														});

											}				
											self.getView().getModel(
													'fordynamictypes')
													.setProperty("/types",
															self.workListType);
											// Selected the appropriate item in
											// the list that
											// was
											// previously selected
											if ("previouslySelectedIndex" in self) {
												// it is possible that this list
												// doesn't exist
												// anymore by this time
												try {
													self.recentlyUsedList.mAggregations.items[self.previouslySelectedIndex]
															.setSelected(true);
												} catch (e) {
												}
												self.oModel.setProperty(
														"/doneButtonEnabled",
														true);
												self.recentlyUsedButtonDoneEnabled = true;
											}

											jQuery.sap.measure
													.end(hcm.emp.mytimesheet.utils.PerfUtils
															.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.COST_ASSIGNMENT_LOAD));
										});

					},
					createNewCostAssignmentType : function(mainItem, mainName,
							mainCode, childItems, childNames, childCodes) {
						var childList = [];
						var tempChildItems = [];
						if (typeof childItems !== 'undefined') {
							for ( var i = 0; i < childItems.length; i++) {
								childList.push({
									name : childItems[i],
									fieldName : childNames[i],
									fieldValue : childCodes[i]
								});
								tempChildItems.push(childItems[i]);
							}
							
						}
						return {
							name : mainItem,
							others : tempChildItems.join(", "),
							childs : childList,
							fieldName : mainName,
							fieldValue : mainCode
						};
					},
					onRecentUsedSelect : function() {
						this.recentlyUsedButtonSelected = true;
						this.setBtnEnabled('SUBMIT_BTN', false);
						this.byId("COST_ASSIGNMENT_RECENTLY_USED_LIST_ELEMENT")
								.setVisible(true);
						this.byId("COST_ASSIGNMENT_MANUAL_INPUT_LIST")
								.setVisible(false);

						// reset the types set for manual entry
						var typesArray = this.getView().getModel(
								'fordynamictypes').getData().types;
						if (typesArray) {
							for ( var i = 0; i < typesArray.length; i++) {
								typesArray[i].value = "";
							}

							this
									.getView()
									.getModel('fordynamictypes')
									.setProperty('/fordynamictypes', typesArray);
						}
					},

					onManualEntrySelect : function() {
						this.recentlyUsedButtonSelected = false;
						this.byId("COST_ASSIGNMENT_MANUAL_INPUT_LIST")
								.setVisible(true);
						// this.byId("COST_ASSIGNMENT_RECENTLY_USED_LIST").setVisible(false);
						this.byId("COST_ASSIGNMENT_RECENTLY_USED_LIST_ELEMENT")
								.setVisible(false);

						// reset data of the form
						this.byId('COST_ASSIGNMENT_RECENTLY_USED_LIST')
								.setValue('');
					},

					onDone : function() {
						// clean in-line error message for the entry
						this.entry.showError = false;
						this.entry.error = "";

						this.cleanUpOnBack();
						this.resetMainAndChildItems();
						var mainItemFound = true;
						this.entry.notes = this.byId('S31TextArea').getValue();
						// When user press done, check if user is in recent /
						// add list and
						// process
						// data accordingly.
						if (this.recentlyUsedButtonSelected) {
							this.entry.mainItem = this.workList[this.selectedIndex].name;
							this.entry.mainName = this.workList[this.selectedIndex].fieldName;
							this.entry.mainCode = this.workList[this.selectedIndex].fieldValue;
							if (this.workList[this.selectedIndex].others) {
								this.initializeChildItems();
								this.entry.subItems = this.workList[this.selectedIndex].others;

								for ( var i = 0; i < this.workList[this.selectedIndex].childs.length; i++) {
									this.entry.childItems
											.push(this.workList[this.selectedIndex].childs[i].name);
									this.entry.childNames
											.push(this.workList[this.selectedIndex].childs[i].fieldName);
									this.entry.childCodes
											.push(this.workList[this.selectedIndex].childs[i].fieldValue);
								}
							}
						} else {
							mainItemFound = false;
							/*
							 * for ( var i = 0; i < this.workListTypeNew.length;
							 * i++) { if (!mainItemFound) { this.entry.mainItem =
							 * this.workListTypeNew[i].name; this.entry.mainName =
							 * this.workListTypeNew[i].fieldName;
							 * this.entry.mainCode =
							 * this.workListTypeNew[i].fieldValue; mainItemFound =
							 * true; } else { if (!this.entry.childItems) {
							 * this.initializeChildItems();
							 * this.childItemsInitialized = true; }
							 * this.entry.childItems.push(this.workListTypeNew[i].name);
							 * this.entry.childNames
							 * .push(this.workListTypeNew[i].fieldName);
							 * this.entry.childCodes
							 * .push(this.workListTypeNew[i].fieldValue); } }
							 * 
							 */

							// logic fetching data directly from input fields
							var inputList = this.byId(
									'COST_ASSIGNMENT_MANUAL_INPUT_LIST')
									.getFormElements();
							for ( var j = 0; j < inputList.length; j++) {
								/*
								 * var key =
								 * inputList[j].getFields()[0].data('key'); var
								 * value =
								 * inputList[j].getFields()[0].data('value');
								 */
								var key = inputList[j].getFields()[0].getName();
								var value = inputList[j].getFields()[0]
										.getValue() &&
										 inputList[j].getFields()[0]
												.getValueStateText();
								if (!value) {
									value = inputList[j].getFields()[0]
											.getValue();
								}
								if (value) {
									if (!mainItemFound) {
										this.entry.mainItem = key;
										this.entry.mainName = key;
										this.entry.mainCode = value;
										mainItemFound = true;
									} else {
										if (!this.entry.childItems) {
											this.initializeChildItems();
											this.childItemsInitialized = true;
										}
										this.entry.childItems.push(key);
										this.entry.childNames.push(key);
										this.entry.childCodes.push(value);
									}
								}
							}

							if ("childItems" in this.entry) {
								if (this.entry.childItems.length > 1) {
									this.entry.subItems = this.entry.childItems
											.join(", ");
								} else if (this.entry.childItems.length === 1) {
									this.entry.subItems = this.entry.childItems[0];
								}
							}
						}

						// Do something only if a mainItem exist.
						if (mainItemFound) {
							this.setEntryChanged();
							this.onSubmit();
						} else {
							this.initializeChildItems();
						}
					},

					onSubmit : function() {
						// clean in-line error message for the entry
						this.entry.showError = false;
						this.entry.error = "";
						this.entry.rejectionReason = undefined;

						// return original data with the new/edited entry
						this.updatePageData();


					},

					updatePageData : function(bDeleted) {
						if (bDeleted) {
							this.entry.deleted = true;
						}

						// Prepare entry
						this.entry.newEntry = false;
						this.entry.showTime = true;
						//NOTE lunch time
						var calendarRef = this.byId('weeklyCalendar');
						var selectedDates = calendarRef.getSelectedDates();
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						var workingDates=oModel.getData().workingDayList;
						var selDatesObj=new Array(),c=0;
						//End of NOTE
			//Note 1959135: Added an additional check for decimalTimeEntry field
						if ((this.isDecimalTimeEntry()) &&
								 (!this.isClockEntry())) {
							/*Note: dot-comma issue*/
							//this.entry.time = this.byId("decimalTimeEntryValue").getValue();
							var lv_Duration=this.byId("decimalTimeEntryValue").getValue();
							if(lv_Duration.indexOf(",")>0) lv_Duration=lv_Duration.replace(",",".");
							this.entry.time =lv_Duration;
							/*Note: end dot-comma issue*/
						} else {
							if (!this.isClockEntry()) {
								var dateTimevalue = this.byId(
										"DateTimeInputValue").getValue();
								this.entry.hours = dateTimevalue.split(':')[0];
								this.entry.minutes = dateTimevalue.split(':')[1];
								this.entry.time = parseFloat(this.entry.hours) +
										 parseFloat(this.entry.minutes) / 60;
								//Note 1959135: rounding off to two decimals
								this.entry.time = this.entry.time.toFixed(2); 

							} else {
								//NOTE Updating entry.selected date
								
								for(var i=0;i<selectedDates.length;i++)
								{
									
									var datStr = this.parseDateYYYYMMdd(selectedDates[i]);
								    
								    $.each(workingDates,function(key,value){
								       
								       if(value.date===datStr)
								       {
								          selDatesObj[c++]=value;
								         } 
								    });
								    
								    
								}
								this.entry.selectedDate=selDatesObj;
								//END of NOTE
								var startTime = this.byId("startTime")
										.getDateValue(), endTime = this.byId(
										"endTime").getDateValue();

								this.entry.startTime = this
										.convertTime(startTime);
								this.entry.endTime = this.convertTime(endTime);

								var durationInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

								this.entry.hours = parseInt(
										(durationInMinutes / 60), 10);
								this.entry.minutes = durationInMinutes % 60;
								//Note 1959135: Let the backend calculate the time
								this.entry.time = "0.0"; 
							}
						}
						this.entry.hasNotes = (this.entry.notes && this.entry.notes.length > 0) ? true
								: false;

						this.submitToOdata();
						/**

					     * @ControllerHook Extend behavior of Update Data
					     * This hook method can be used to add UI or business logic 
					     * It is called when the UpdateData method executes
					     * @callback hcm.emp.mytimesheet.view.S31~extHookUpdateData
					     */
							if(this.extHookUpdateData) {
								this.extHookUpdateData();
					  	}

					},
					convertTime : function(date) {
						var timeFormat = sap.ui.core.format.DateFormat
								.getTimeInstance({
									pattern : "HHmmss"
								});
						return timeFormat.format(date);
					},

					 formatAMPM: function(date) {
					  var hours = date.getHours();
					  var minutes = date.getMinutes();
					  var ampm = hours >= 12 ? 'PM' : 'AM';
					  hours = hours % 12;
					  hours = hours ? hours : 12; // the hour '0' should be '12'
					  minutes = minutes < 10 ? '0'+minutes : minutes;
					  var strTime = hours + ':' + minutes + ' ' + ampm;
					  return strTime;
					},

					submitToOdata : function() {
						this.validateLunchBreak();//NOTE Checking if the input times are between the lunch hour
						var self = this;
						var calendarRef = this.byId('weeklyCalendar');
						var selectedDates = calendarRef.getSelectedDates();
						this.errors = null;
						var summaryText = new sap.m.Text({
							text : this.byId('createformtitle').getTitle()
						});
						self = this;
						var confirmationDialog = null;
						var i = 0;

						// Adding Dialog Factoy instead of Dialog
						// Calculation of Number of Hours to be displayed in the
						// Confirmation Dialog
						var hours;
						var minutes;
						var noOfSelection = selectedDates.length;
						if (!this.isClockEntry()) {
							var dateTimevalue = this.byId("DateTimeInputValue")
									.getValue();
							hours = dateTimevalue.split(':')[0];
							
							minutes = dateTimevalue.split(':')[1];
							hours = hours * noOfSelection;
							minutes = minutes * noOfSelection;
							if (minutes > 59) {
								minutes = minutes % 60;
								hours += Math.round(minutes / 60);
							}
						} else {
							var startTime = this.byId("startTime")
							.getDateValue(), endTime = this.byId(
							"endTime").getDateValue();
					var durationInMinutes = (endTime.getTime() - startTime
							.getTime()) / (1000 * 60);
					durationInMinutes = durationInMinutes * noOfSelection;
							//lunch calc
					var iStart = startTime.getHours()*60 + startTime.getMinutes();
					var iEnd = endTime.getHours()*60 + endTime.getMinutes();
					for( i=0;i<this.entry.selectedDate.length;i++){
					var iLunchStart = parseInt(this.entry.selectedDate[i].lunchStart.substring(0, 2), 10) * 60 + 
						parseInt(this.entry.selectedDate[i].lunchStart.substring(2, 4), 10);
					var iLunchEnd = parseInt(this.entry.selectedDate[i].lunchEnd.substring(0, 2), 10) * 60 + 
						parseInt(this.entry.selectedDate[i].lunchEnd.substring(2, 4), 10);
					
					/*var iLunchStart=720;
					var iLunchEnd=780;*/
					if(iStart<iLunchStart && iEnd>iLunchEnd) {
						// deduct lunch time from duration
						durationInMinutes-=(iLunchEnd - iLunchStart);
					}
					if(durationInMinutes<0) {
						durationInMinutes+=(24*60);
							}
					}//end of for loop
							//end of lunch calc
					hours = parseInt((durationInMinutes / 60), 10);
					minutes = durationInMinutes % 60;

					/*hours = hours * noOfSelection;
					minutes = minutes * noOfSelection;*/
					if (minutes > 59) {
						minutes = minutes % 60;
						hours += Math.round(minutes / 60);
					}
					}

						// Note 1959135
						var summaryHoursText;
						if (this.isDecimalTimeEntry() && !this.isClockEntry()) {
							/*Note: dot-coma issue*/
							var decimalTimeEntryValue=this.getView().byId('decimalTimeEntryValue').getValue();
							if(decimalTimeEntryValue.indexOf(",")>-1) decimalTimeEntryValue=decimalTimeEntryValue.replace(",",".");
							//decimalTimeEntryValue = parseFloat(decimalTimeEntryValue) * noOfSelection;
							//showing duration for only one day
							decimalTimeEntryValue = parseFloat(decimalTimeEntryValue);
							decimalTimeEntryValue = decimalTimeEntryValue.toFixed(2);
							var formattedDecimal=sap.ca.ui.model.format.NumberFormat.getInstance({style:'standard'}).format(decimalTimeEntryValue);
							summaryHoursText = formattedDecimal;
							/*Note: End dot-coma issue*/
						} else {
							summaryHoursText = this.oBundle.getText(
									'FULL_CONCATENATE_HOURSMIN', [ hours,
											minutes ]);
						}
						var InitalInfoModel = this.oApplication
						.getModel("timesheet_initialInfo");
				var releaseAllowed = InitalInfoModel.getData().releaseAllowed;

				var popupHeader;
				var popupTitle;
				if (releaseAllowed) {
					popupHeader = this.oBundle
							.getText('DRAFT_CONFIRMATION_SUMMARY');
					popupTitle = this.oConfiguration
							.getText("DRAFT_CONFIRMATION");		
				} else {
					popupHeader = this.oBundle.getText('SUBMISSION_CONFIRMATION_SUMMARY');
					popupTitle = this.oConfiguration.getText("SUBMISSION_CONFIRMATION");
				}
				var summaryDurationText="";
				var start_time=null;
				var end_time=null;
				if(this.isClockEntry())
				{
					if(this.byId("startTime").getDisplayFormat() === "hh:mm a" || this.byId("startTime").getDisplayFormat() === "h:mm a"){
						start_time=this.formatAMPM(startTime);
						end_time=this.formatAMPM(endTime);
					}
					else{
						start_time= startTime.getHours() + ":" + startTime.getMinutes();
						end_time = endTime.getHours() + ":" + endTime.getMinutes();
					}
					var oSettings = {
					question : popupHeader,
					// question :
					// this.byId('createformtitle').getTitle(),
					// additionalInformation : [],
					additionalInformation : [
							{
								label : this.oBundle
										.getText('DELETE_CONFIRMATION_SUMMARY_ENTRIES'),
								text : selectedDates.length.toString()
							},
							{
								label : this.oBundle
										.getText('START_TIME'),
								text : start_time
							
							},
							{
								label : this.oBundle
										.getText('END_TIME'),
								text : end_time
							} ],
					showNote : false,
					title : popupTitle,
					confirmButtonLabel : this.oBundle.getText("OK")
				};
				
				}
				else{
					
					 oSettings = {
					question : popupHeader,
					// question :
					// this.byId('createformtitle').getTitle(),
					// additionalInformation : [],
					additionalInformation : [
							{
								label : this.oBundle
										.getText('DELETE_CONFIRMATION_SUMMARY_ENTRIES'),
								text : selectedDates.length.toString()
							},
							{
								label : this.oBundle
										.getText('DURATION'),
								text : summaryHoursText
							// this.oBundle.getText('FULL_CONCATENATE_HOURSMIN',[hours,minutes])
							} ],
					showNote : false,
					title : popupTitle,
					confirmButtonLabel : this.oBundle.getText("OK")
				};
				}
				//Introducing Check  Time Entry


				// lock UI until submit is done
				// to prevent double click
				// sap.ui.getCore().lock();

				jQuery.sap.measure
						.start(hcm.emp.mytimesheet.utils.PerfUtils
								.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));

				var batchCreate = [];
				var operation = (self.oApplication
						.getModel(
								'S31modelexch')
						.getData().manualEntrySelected) ? "U"
						: "C";
				if (selectedDates.length !== 0) {

					for (i = 0; i < selectedDates.length; i++) {
						self.entry = this.replaceSpecialChar(self.entry); 			//Note 1994402: Replacing Special Character

						batchCreate
								.push(self
										.setPostObject(
												self.entry.counter,
												operation,
												self
														.parseDateYYYYMMdd(selectedDates[i]),
												self.entry.time,
												self.entry.mainName,
												self.entry.mainCode,
												self.entry.notes,
												self.entry.startTime,
												self.entry.endTime,
												self.entry.subItems,
												self.entry.childCodes,
												self.entry.childNames));

					}

				}

				if (batchCreate.length === 0) {
					// if there is nothing to
					// submit, just act like a
					// cancel
					sap.ui.getCore().lock();
					confirmationDialog.close();
					setTimeout(function() {
						// sap.ui.getCore().unlock();
					}, 500);
				} else {
					// only submit if there is
					// something to submit,
					// otherwise SAP UI5 does
					// not give a response
					self.oService
							.checkSubmittedTime(
									self,
									batchCreate,
									[],
									[],
									function() {
										jQuery.sap.measure
										.end(hcm.emp.mytimesheet.utils.PerfUtils
												.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));
										
										sap.ca.ui.dialog.factory
										.confirm(
												oSettings,
												function(response) {
													if (response.isConfirmed === true) {

														// lock UI until submit is done
														// to prevent double click
														// sap.ui.getCore().lock();

														jQuery.sap.measure
																.start(hcm.emp.mytimesheet.utils.PerfUtils
																		.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));

														var batchCreate = [];
														var operation = (self.oApplication
																.getModel(
																		'S31modelexch')
																.getData().manualEntrySelected) ? "U"
																: "C";
														if (selectedDates.length !== 0) {

															for (i = 0; i < selectedDates.length; i++) {

																batchCreate
																		.push(self
																				.setPostObject(
																						self.entry.counter,
																						operation,
																						self
																								.parseDateYYYYMMdd(selectedDates[i]),
																						self.entry.time,
																						self.entry.mainName,
																						self.entry.mainCode,
																						self.entry.notes,
																						self.entry.startTime,
																						self.entry.endTime,
																						self.entry.subItems,
																						self.entry.childCodes,
																						self.entry.childNames));

															}

														}

														if (batchCreate.length === 0) {
															// if there is nothing to
															// submit, just act like a
															// cancel
															sap.ui.getCore().lock();
															confirmationDialog.close();
															setTimeout(function() {
																// sap.ui.getCore().unlock();
															}, 500);
														} else {
															// only submit if there is
															// something to submit,
															// otherwise SAP UI5 does
															// not give a response
															self.oService
																	.submitTimeEntry(
																			self,
																			batchCreate,
																			[],
																			[],
																			function() {
																				// sap.ui.getCore().unlock();
																				jQuery.sap.measure
																						.end(hcm.emp.mytimesheet.utils.PerfUtils
																								.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));
																				var InitalInfoModel = self.oApplication
																				.getModel("timesheet_initialInfo");
																		var releaseAllowed = InitalInfoModel.getData().releaseAllowed;

																		var toastMsg;
																		if (releaseAllowed) {
																			toastMsg = self.oBundle
																					.getText('DRAFT_SUCCESS');	
																		} else {
																			toastMsg = self.oBundle.getText('SUBMIT_SUCCESS');
																		}
																				sap.m.MessageToast
																						.show(toastMsg);//changed toast text
																				// sap.ui.getCore().lock();
																				setTimeout(
																						function() {

																							var calendar = self
																									.byId("weeklyCalendar");
																							var selectedDates = calendar
																									.getSelectedDates();
																							var dateStr;
																							dateStr = selectedDates[0];

																							var selectedDate = dateStr+
																									 'offset'+
																									 calendar
																											.getFirstDayOffset();

																							self.oRouter
																									.navTo(
																											"S3",
																											{
																												context : selectedDate
																											});

																						},
																						500);

																			},
																			function(
																					errs,
																					response) {
																				// sap.ui.getCore().unlock();
																				jQuery.sap.measure
																						.end(hcm.emp.mytimesheet.utils.PerfUtils
																								.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));
																				// some
																				// error
																				// messages
																				// to
																				// display
																				self.errors = errs;

																			});
														}

													}
												});

									},
									function(
											errs,
											response) {
										// sap.ui.getCore().unlock();
										jQuery.sap.measure
												.end(hcm.emp.mytimesheet.utils.PerfUtils
														.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));
										// some
										// error
										// messages
										// to
										// display
										self.errors = errs;



									});
					//NOTE End of Check Time Entries
					/*//NOTE: NORMAL EXECUTION FLOW WITHOUT CHECKTIME
					jQuery.sap.measure
					.end(hcm.emp.mytimesheet.utils.PerfUtils
							.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));
					
					sap.ca.ui.dialog.factory
					.confirm(
							oSettings,
							function(response) {
								if (response.isConfirmed == true) {

									// lock UI until submit is done
									// to prevent double click
									// sap.ui.getCore().lock();

									jQuery.sap.measure
											.start(hcm.emp.mytimesheet.utils.PerfUtils
													.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));

									var batchCreate = [];
									var operation = (self.oApplication
											.getModel(
													'S31modelexch')
											.getData().manualEntrySelected) ? "U"
											: "C";
									if (selectedDates.length !== 0) {

										for (i = 0; i < selectedDates.length; i++) {

											batchCreate
													.push(self
															.setPostObject(
																	self.entry.counter,
																	operation,
																	self
																			.parseDateYYYYMMdd(selectedDates[i]),
																	self.entry.time,
																	self.entry.mainName,
																	self.entry.mainCode,
																	self.entry.notes,
																	self.entry.startTime,
																	self.entry.endTime,
																	self.entry.subItems,
																	self.entry.childCodes,
																	self.entry.childNames));

										}
										;

									}

									if (batchCreate.length === 0) {
										// if there is nothing to
										// submit, just act like a
										// cancel
										sap.ui.getCore().lock();
										confirmationDialog.close();
										setTimeout(function() {
											// sap.ui.getCore().unlock();
										}, 500);
									} else {
										// only submit if there is
										// something to submit,
										// otherwise SAP UI5 does
										// not give a response
										self.oService
												.submitTimeEntry(
														self,
														batchCreate,
														[],
														[],
														function() {
															// sap.ui.getCore().unlock();
															jQuery.sap.measure
																	.end(hcm.emp.mytimesheet.utils.PerfUtils
																			.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));
															var InitalInfoModel = self.oApplication
															.getModel("timesheet_initialInfo");
													var releaseAllowed = InitalInfoModel.getData().releaseAllowed;

													var toastMsg;
													if (releaseAllowed) {
														toastMsg = self.oBundle
																.getText('DRAFT_SUCCESS');	
													} else {
														toastMsg = self.oBundle.getText('SUBMIT_SUCCESS');
													}
															sap.m.MessageToast
																	.show(toastMsg);//changed toast text
															// sap.ui.getCore().lock();
															setTimeout(
																	function() {

																		var calendar = self
																				.byId("weeklyCalendar");
																		var selectedDates = calendar
																				.getSelectedDates();
																		var dateStr;
																		dateStr = selectedDates[0];

																		var selectedDate = dateStr
																				+ 'offset'
																				+ calendar
																						.getFirstDayOffset();

																		self.oRouter
																				.navTo(
																						"S3",
																						{
																							context : selectedDate
																						},true);

																	},
																	500);

														},
														function(
																errs,
																response) {
															// sap.ui.getCore().unlock();
															jQuery.sap.measure
																	.end(hcm.emp.mytimesheet.utils.PerfUtils
																			.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));
															// some
															// error
															// messages
															// to
															// display
															self.errors = errs;

														});
									}

								}
							});


							//Note: end removal of check time entry odata call
							*/
					

				
				}
				
				
				
					},

					//Note 1994402: Replaceing special charater '/' with '-'
					replaceAllOccurances : function(iString){
						if(typeof iString==="undefined"){
							return;
						}
						var vSearch = '/';
						var vReplace = '-';
						while( iString.indexOf(vSearch) > -1){
							iString = iString.replace(vSearch, vReplace);
						}
						return iString;
					},
					replaceSpecialChar : function(entry){
						if(typeof entry.mainName !== "undefined"){
							entry.mainName = this.replaceAllOccurances(entry.mainName);
						}
						if(typeof entry.subItems !== "undefined"){
							entry.subItems = this.replaceAllOccurances(entry.subItems);
						}
						if(typeof entry.childNames !== "undefined"){
							for(var i = 0; i < entry.childNames.length ; i++){
								entry.childNames[i] = this.replaceAllOccurances(entry.childNames[i]);
							}
						}
						
						return entry;
					},

					getDateStr : function(date1) {
						return "" + date1.getFullYear()+
								 ("" + (date1.getMonth() + 101)).substring(1)+
								 ("" + (date1.getDate() + 100)).substring(1);
					},

					getPostData : function(day, entry) {
						var post = {};
						post.day = day;
						post.entry = entry;
						return post;
					},

					setPostObject : function(Counter, TimeEntryOperation,
							WORKDATE, CATSAMOUNT, Name, Code, notes, startTime,
							endTime, subItems, childCodes, childNames) {
						var timeEntryUpdated = {
							Counter : Counter,
							TimeEntryOperation : TimeEntryOperation,
							TimeEntryDataFields : {
								WORKDATE : WORKDATE,
								CATSAMOUNT : "" + CATSAMOUNT,
								BEGUZ : startTime,
								ENDUZ : endTime
							}

						};

						// always send as blank						
						timeEntryUpdated.TimeEntryRelease = " ";

						/*
						 * if(this.releaseAllowed){
						 * timeEntryUpdated.TimeEntryRelease = " "; }else{
						 * timeEntryUpdated.TimeEntryRelease = "X"; }
						 */

						if(this.checkFieldName(Name) === true){
							timeEntryUpdated.TimeEntryDataFields[Name] = Code;
						}

						if (subItems && subItems !== "") {
							for ( var i = 0; i < childNames.length; i++) {
								if(this.checkFieldName(childNames[i]) === true){
									timeEntryUpdated.TimeEntryDataFields[childNames[i]] = childCodes[i];
								}
							}
						}
						if (notes && notes !== "") {
							timeEntryUpdated.TimeEntryDataFields.LONGTEXT_DATA = notes;
							timeEntryUpdated.TimeEntryDataFields.LONGTEXT = "X";

						}

						return timeEntryUpdated;
					},
					
					//Note 1959135: Check for special fieldnames
					checkFieldName : function(fieldName){
					    var checkString = new String(fieldName);
					    if(checkString.match("DISPTEXT")){
					                    return false;
					    }
					    if(checkString.match("CPR_OBJTEXT")){
					                    return false;
					    }
					    if(checkString.match("CPR_TEXT")){
					                    return false;
					    }
					    return true;
					},

					parseDateYYYYMMdd : function(dateString) {
						var dateParse = sap.ui.core.format.DateFormat
								.getDateInstance({
									pattern : "YYYYMMdd"
								});

						var selectedDate = new Date(dateString);

						return dateParse.format(selectedDate);
					},

					onReset : function(oEvent) {
						// reset calendar
						var calendarRef = this.byId('weeklyCalendar');
						var selectedDates = calendarRef.getSelectedDates();
						calendarRef.toggleDatesSelection(selectedDates);

						//NOTE reset selectedDates titlebar
						this.byId('createformtitle').setTitle(
									this.oBundle.getText('ENTRY_DETAILS'));
						
						// reset duration
						this.byId('DateTimeInputValue').setValue('now');

						// Note 1959135: reset decimalTimeEntry
						if(this.isDecimalTimeEntry()){
						this.byId('decimalTimeEntryValue').setValue('');
						}
						// reset start and end time
						if(this.isClockEntry()){
						this.byId('startTime').setValue('');
						this.byId('endTime').setValue('');
						}
						// reset text area
						this.byId('S31TextArea').setValue('');

						// reset suugest value input
						this.byId('COST_ASSIGNMENT_RECENTLY_USED_LIST')
								.setValue('');

						// reset manual value input
						var typesArray = this.getView().getModel(
								'fordynamictypes').getData().types;
						if (typesArray) {
							for ( var i = 0; i < typesArray.length; i++) {
								typesArray[i].value = "";
							}
							this
									.getView()
									.getModel('fordynamictypes')
									.setProperty('/fordynamictypes', typesArray);
						}
						this.validateSaveBtnVisibility(oEvent);
					},

					isClockEntry : function() {
						return this.oConfiguration.getClockEntry();
					},

					// Note 1959135
					isDecimalTimeEntry : function() {
						return this.oConfiguration.getDecimalTimeEntry();
					},

					setEntryChanged : function() {
						this.entry.suggestion = false;
						this.entry.showTime = true;
					},

					resetMainAndChildItems : function() {
						if ("mainItem" in this.entry) {
							this.deleteMainItem();
						}
						if ("subItems" in this.entry) {
							this.deleteSubItems();
						}
					},

					deleteMainItem : function() {
						delete this.entry.mainItem;
						delete this.entry.mainName;
						delete this.entry.mainCode;
					},

					deleteSubItems : function() {
						delete this.entry.subItems;
						delete this.entry.childItems;
						delete this.entry.childNames;
						delete this.entry.childCodes;
					},

					initializeChildItems : function() {
						this.entry.childItems = [];
						this.entry.childNames = [];
						this.entry.childCodes = [];
					},

					cleanUpOnBack : function() {
						if ("previouslySelectedIndex" in this) {
							delete this.previouslySelectedIndex;
						}
						if ("selectedMainItem" in this) {
							delete this.selectedMainItem;
							delete this.selectedMainName;
							delete this.selectedMainCode;
						}
						if ("selectedChildItems" in this) {
							delete this.selectedChildItems;
							delete this.selectedChildNames;
							delete this.selectedChildCodes;
						}
						// this.unselecteAllRecentlyUsedListItems();
						this.recentlyUsedButtonDoneEnabled = false;
					},

					getHeaderFooterOptions : function() {

						this._initialize();

						var InitalInfoModel = this.oApplication
								.getModel("timesheet_initialInfo");
						var releaseAllowed = InitalInfoModel.getData().releaseAllowed;

						var submitButtonText;
						if (releaseAllowed) {
							submitButtonText = this.oApplicationFacade
									.getResourceBundle().getText("SAVE_DRAFT");
						} else {
							submitButtonText = this.oApplicationFacade
									.getResourceBundle().getText("SUBMIT");
						}
						var screenTitleText;
						if (this.oApplicationFacade.oApplicationImplementation
								.getModel('S31modelexch').getData().recentlyUsedSelected) {
							screenTitleText = this.oApplicationFacade
									.getResourceBundle().getText(
											"TIMESHEET_CREATE_ENTRY_TITLE");
						} else {
							screenTitleText = this.oApplicationFacade
									.getResourceBundle()
									.getText(
											"TIMESHEET_EDIT_ENTRY_TITLE_SCREEN");
						}

						var valueforbutton = {
							sId : "SUBMIT_BTN",
							sI18nBtnTxt : submitButtonText,
							onBtnPressed : function(evt) {
								that.onDone(evt);
							}
						};

						var that = this;
						return {
							sI18NFullscreenTitle : screenTitleText,

							oEditBtn : valueforbutton,

							buttonList : [

							{
								sId : "cancelBtn",
								sI18nBtnTxt : "RESET",
								onBtnPressed : function(evt) {
									// that.onCancel(evt);
									that.onReset(evt);
								}
							} ],
							onBack: jQuery.proxy(function() { //Note: overriding the back function
				                	this.onNavButton();
						}, this)
				        
						};

					}, 

					/**
					 * Called when the View has been rendered (so its HTML is
					 * part of the document). Post-rendering manipulations of
					 * the HTML could be done here. This hook is the same one
					 * that SAPUI5 controls get after being rendered.
					 * 
					 * @memberOf test_mytimesheet.test
					 */
					// onAfterRendering: function() {
					//
					// },
					/**
					 * Called when the Controller is destroyed. Use this one to
					 * free resources and finalize activities.
					 * 
					 * @memberOf test_mytimesheet.test
					 */
					onExit : function() {
						self.workListTypeNew = [];
						/*
						 * this.byId('COST_ASSIGNMENT_RECENTLY_USED_LIST').destroy();
						 * this.byId('COST_ASSIGNMENT_MANUAL_INPUT_LIST').destroy();
						 */
					}
				});

},
	"hcm/emp/mytimesheet/view/S31.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core" xmlns="sap.m" xmlns:me="sap.me"\n\txmlns:mvc="sap.ui.core.mvc" xmlns:form="sap.ui.layout.form"\n\txmlns:layout="sap.ui.layout" controllerName="hcm.emp.mytimesheet.view.S31">\n\t<Page id="page" title="{i18n>MANUAL_INPUT_EDIT}" showNavButton="true"\n\t\tnavButtonTap="onNavButton" enableScrolling="true">\n\t\t<content>\n\t\t\t<me:Calendar id="weeklyCalendar" singleRow="true"\n\t\t\t\tweeksPerRrow="1" design="Approval" enableMultiselection="true"\n\t\t\t\ttapOnDate="onTapOnDate" changeRange="onChangeRange" hideNavControls="true"\n\t\t\t\t>\n\t\t\t</me:Calendar>\n\t\t\t\n\t\t\t<form:Form id=\'createformtitle\' title="{i18n>ENTRY_DETAILS}">\n\n\t\t\t\t<form:layout>\n\t\t\t\t\t<form:ResponsiveGridLayout labelSpanL="3"\n\t\t\t\t\t\tlabelSpanM="3" emptySpanL="4" emptySpanM="2" columnsL="1"\n\t\t\t\t\t\tcolumnsM="1">\n\t\t\t\t\t</form:ResponsiveGridLayout>\n\t\t\t\t</form:layout> \n\t\t\t\t\n\t\t\t\t<form:formContainers>\n\t\t\t\t\t<form:FormContainer expandable="true">\n\n\t\t\t\t\t\t<form:formElements>\n<!-- Note 1959135: Added decimalTimeEntry input field -->\n\t\t\t\t\t\t\t<form:FormElement visible="{/decimalTimeEntryVisible}">\n\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t<Label id="decimalInputLbl" class="entryDetaillabel" required=\'true\' text="{i18n>DURATION}">\n\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t<Input id="decimalTimeEntryValue" value="{entry>/time}" change="onDecimalTimeValueChange">\n\n\t\t\t\t\t\t\t\t\t</Input>\n\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<form:FormElement visible="{/durationVisible}">\n\n\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t<Label id="hourInputLbl" class="entryDetaillabel" required=\'true\' text="{i18n>DURATION}">\n\n\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t<DateTimeInput id = "DateTimeInputValue" type="Time" displayFormat="H\'h\' m\'m\'"\n\t\t\t\t\t\t\t\t\t\tvalueFormat="HH:mm" change="onDurationValueChange"\n\t\t\t\t\t\t\t\t\t\tvalue="{parts: [{path: \'entry>/hours\'},{path: \'entry>/minutes\'}], formatter:\'.durationDateForamtter\'}">\n\n\t\t\t\t\t\t\t\t\t</DateTimeInput>\n\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t<form:FormElement visible="{/clockEntry}">\n\n\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t<Label id="startTimeLbl" class="entryDetaillabel" required=\'true\' text="{i18n>FROM}" visible="{/clockEntry}">\n\n\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t<DateTimeInput id="startTime" type="Time"\n\t\t\t\t\t\t\t\t\t\tvalueFormat="HHmmss"  value="{entry>/startTime}"\n\t\t\t\t\t\t\t\t\t\tchange="validate">\n\t\t\t\t\t\t\t\t\t</DateTimeInput>\n\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t</form:FormElement>\n\n\t\t\t\t\t\t\t<form:FormElement visible="{/clockEntry}">\n\n\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t<Label id="endTimeLbl" class="entryDetaillabel" required=\'true\' text="{i18n>TO}" >\n\n\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t<DateTimeInput id="endTime" type="Time"\n\t\t\t\t\t\t\t\t\t\tvalueFormat="HHmmss"  value="{entry>/endTime}"\n\t\t\t\t\t\t\t\t\t\tchange="validate">\n\n\t\t\t\t\t\t\t\t\t</DateTimeInput>\n\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t<form:FormElement >\n\n\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t<Label text="{i18n>NOTE}" class="entryDetaillabel">\n\n\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t<TextArea id =\'S31TextArea\' value="{entry>/notes}">\n\n\t\t\t\t\t\t\t\t\t</TextArea>\n\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t<form:FormElement>\n\n\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t<Label text="{i18n>COST_ASSIGNMENT}"  required=\'true\' class="entryDetaillabel">\n\n\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t<RadioButton id="Recent" text="{i18n>RECENTLY_USED}"\n\t\t\t\t\t\t\t\t\t\tgroupName="Cost_Assignment" selected="{fordynamictypes>/recentlyUsedSelected}"\n\t\t\t\t\t\t\t\t\t\tselect=\'onRecentUsedSelect\'>\n\n\t\t\t\t\t\t\t\t\t</RadioButton>\n\t\t\t\t\t\t\t\t\t<RadioButton id="Manual" text="{i18n>MANUAL_INPUT_ADD}"\n\t\t\t\t\t\t\t\t\t\tgroupName="Cost_Assignment" selected="{fordynamictypes>/manualEntrySelected}"\n\t\t\t\t\t\t\t\t\t\tselect=\'onManualEntrySelect\'>\n\n\t\t\t\t\t\t\t\t\t</RadioButton>\n\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<form:FormElement id = "COST_ASSIGNMENT_RECENTLY_USED_LIST_ELEMENT">\n\n\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t<Label>\n\n\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t<Input id="COST_ASSIGNMENT_RECENTLY_USED_LIST"\n\t\t\t\t\t\t\t\t\t\tshowSuggestion="true"\n\t\t\t\t\t\t\t\t\t\tshowValueHelp="true" valueHelpRequest=\'onSuggestedInputHelp\'\n\t\t\t\t\t\t\t\t\t\tsuggestionItemSelected=\'onSuggestedItemSelection\'\n\t\t\t\t\t\t\t\t\t\tliveChange=\'suggestionHelpChange\'\n\t\t\t\t\t\t\t\t\t\tplaceholder="{/sel_sugg_txt}">\n\n\t\t\t\t\t\t\t\t\t</Input>\n\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\t<!-- extension point for additional Form Element -->\t\n        \t\t <core:ExtensionPoint name="extS31FormElement"></core:ExtensionPoint>\n\t\t\t\t\t\t</form:formElements>\n\t\t\t\t\t</form:FormContainer>\n\n\t\t\t\t\t<form:FormContainer expandable="true"\n\t\t\t\t\t\tid="COST_ASSIGNMENT_MANUAL_INPUT_LIST" formElements="{fordynamictypes>/types}">\n\t\t\t\t\t\t<form:FormElement>\n\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t<Label class="entryDetaillabel" text="{fordynamictypes>name}">\n\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t<Input showValueHelp="true"\n\t\t\t\t\t\t\t\t\tname="{fordynamictypes>fieldName}"\n\t\t\t\t\t\t\t\t\tvalueStateText="{fordynamictypes>valueStateText}"\n\t\t\t\t\t\t\t\t\tvalueHelpRequest="onInputHelp"\n\t\t\t\t\t\t\t\t\tliveChange=\'manualHelpChange\'\n\t\t\t\t\t\t\t\t\tsuggestionItemSelected=\'onManualItemSelection\'\n\t\t\t\t\t\t\t\t\tvalue="{fordynamictypes>value}"\n\t\t\t\t\t\t\t\t\tenabled="{fordynamictypes>READONLY}"> <!-- Note: Addition of readOnly property-->\n\t\t\t\t\t\t\t\t</Input>\n\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t</form:FormContainer>\n\n\n\t\t\t\t</form:formContainers>\n              \n\t\t\t</form:Form>\n\n\t\t</content>\n\t</Page>\n</core:View>\n'
}});
