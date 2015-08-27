jQuery.sap.registerPreloadedModules({
"name":"hcm/mgr/approve/timesheet/Component-preload",
"version":"2.0",
"modules":{
	"hcm/mgr/approve/timesheet/Component.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mgr.approve.timesheet.Component");
jQuery.sap.require("hcm.mgr.approve.timesheet.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

// new Component
sap.ca.scfld.md.ComponentBase
	.extend(
		"hcm.mgr.approve.timesheet.Component", {

			metadata: sap.ca.scfld.md.ComponentBase.createMetaData("MD", {
				"name": "Approve Timesheets", //F0398
				"version": "1.4.1",
				"library": "hcm.mgr.approve.timesheet",
				"includes": [],
				"dependencies": {
					"libs": ["sap.m", "sap.me"],
					"components": []
				},
				"config": {
					"titleResource": "TSA_APP_TITLE",
					"resourceBundle": "i18n/i18n.properties",
					"icon": "sap-icon://entry-request",
					"favIcon": "./resources/sap/ca/ui/themes/base/img/favicon/Approve_Timesheets.ico",
					"homeScreenIconPhone": "./resources/sap/ca/ui/themes/base/img/launchicon/Approve_Timesheets/57_iPhone_Desktop_Launch.png",
					"homeScreenIconPhone@2": "./resources/sap/ca/ui/themes/base/img/launchicon/Approve_Timesheets/114_iPhone-Retina_Web_Clip.png",
					"homeScreenIconTablet": "./resources/sap/ca/ui/themes/base/img/launchicon/Approve_Timesheets/72_iPad_Desktop_Launch.png",
					"homeScreenIconTablet@2": "./resources/sap/ca/ui/themes/base/img/launchicon/Approve_Timesheets/144_iPad_Retina_Web_Clip.png"
				},

				// Navigation related properties
				masterPageRoutes: {
					"master": {
						"pattern": "",
						"view": "hcm.mgr.approve.timesheet.view.S2"
					}
				},
				detailPageRoutes: {
					"detail": {
						"pattern": "detail/{contextPath}",
						"view": "hcm.mgr.approve.timesheet.view.S3"
					},
					"noData": {
						"pattern": "noData",
						"viewPath": "sap.ca.scfld.md.view",
						"view": "empty"
					}
				}
			}),

			/**
			 * Initialize the application
			 *
			 * @returns {sap.ui.core.Control} the content
			 */
			createContent: function() {
				var oViewData = {
					component: this
				};

				return sap.ui.view({
					viewName: "hcm.mgr.approve.timesheet.Main",
					type: sap.ui.core.mvc.ViewType.XML,
					viewData: oViewData
				});
			},


		});
},
	"hcm/mgr/approve/timesheet/Configuration.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mgr.approve.timesheet.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ca.scfld.md.ConfigurationBase.extend("hcm.mgr.approve.timesheet.Configuration", {

    oServiceParams: {
        serviceList: [{
            name: "SRA010_TIMESHEET_APPROVAL_SRV",
            masterCollection: "Time_Pending",
            serviceUrl: "/sap/opu/odata/sap/SRA010_TIMESHEET_APPROVAL_SRV/",
            isDefault: true,
            mockedDataSource: "/hcm.mgr.approve.timesheet/model/metadata.xml"
        }]
    },

    getServiceParams: function() {
        return this.oServiceParams;
    },

    /**
     * @inherit
     */
    getServiceList: function() {
        return this.oServiceParams.serviceList;
    },

    getMasterKeyAttributes: function() {
        return ["Id"];
    }

});
},
	"hcm/mgr/approve/timesheet/Main.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("hcm.mgr.approve.timesheet.Main", {

	onInit: function() {
		jQuery.sap.require("sap.ca.scfld.md.Startup");
		sap.ca.scfld.md.Startup.init('hcm.mgr.approve.timesheet', this);
	}
});
},
	"hcm/mgr/approve/timesheet/Main.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n\txmlns:core="sap.ui.core"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns="sap.m"\n\tcontrollerName="hcm.mgr.approve.timesheet.Main"\n\tdisplayBlock="true"\n\theight="100%">\n\t<NavContainer\n\t\tid="fioriContent"\n\t\tshowHeader="false">\n\t</NavContainer>\n</core:View>',
	"hcm/mgr/approve/timesheet/i18n/i18n.properties":'# Timesheet Approval Property file\n# __ldi.translation.uuid=630B3C60-31B1-11E3-AA6E-0800200C9A66\n#XTIT,30: Application name\nAPP_TITLE=TIMESHEET APPROVAL\n#XTIT,30:  Application name\nTSA_APP_TITLE=Approve Timesheets\n#XTIT,30:  Application name\nMASTER_TITLE=Timesheets ({0})\n#XTIT,30:  Application name\nTSA_APP=Timesheet\n#XTIT,30: detail panel text\nDETAIL_TITLE=Timesheet\n#XBUT,9: Button Approve\nTSA_APPROVE=Approve\n#XBUT,8: Button to Navigate back&nbsp;\\\\\\&nbsp;\nTSA_BACK=Back\n#XFLD: Week for which the timesheet is entered\nTSA_WEEK=Week\n#XFLD: No hours entered by the employee\nTSA_HOUR=Hour\n#XFLD: for\nTSA_FOR=for\n#XBUT:Button to Send after the Timesheet is approved &nbsp;\\\\\\&nbsp;\nTSA_SUBMIT=SEND\n#YMSG: Message for list service error\nLIST_SERVICE_ERR_MESSAGE=Could not obtain the list of timesheet entries\n#YMSG: Message for Successful updation\nCATS_SUCCESS_MESSAGE= Timesheet entries updated\n \n#YMSG: Title for service error\nSERVICE_ERR_TITLE=Timesheet Approval\n#XFLD: Link for manager to see employee notes\nSHOW_NOTE=Show Notes\n\n#XFLD: Link for manager to hide employee notes\nHIDE_NOTE=Hide Notes\n\n#XTIT: Title for employee notes\nEMP_NOTE=Employee Notes\n\n#XFLD: Column header for employee notes\nTSA_EMP_NOTE=Employee Notes\n\n#XFLD: Column header for employee notes\nTSA_COST_ASSGNT=Cost Assignment\n\n#XFLD: Column header for activity\nTSA_ACTIVITY=Activity\n\n#XFLD: Column header for time\nTSA_TIME=Time\n\n#XFLD: Column header for date\nTSA_DATE=Date\n\n#XFLD: Column header for activity\nTSA_REJECTION_REASON=Rejection Reason\n\n#XTIT: Title for list of rejection reasons\nTSA_TIT_REJECTION_REASON=Rejection Reason\n\n#XTIT: Field to Specify the Total hours\nTSA_TARGET=Target\n\n#XTIT: Message for submit confirmation\nTSA_CONF=Submit your approval decision?\n\n#XTIT: title for submit confirmation\nTSA_CONF_HEADER=Confirmation\n\n#XBUT: button to confirm submit\nTSA_ACCEPT=OK\n\n#XBUT: Cancel button for Rejection Reason\nTSA_CANCEL=Cancel\n\n#XLNK: link to show for employee and week\nTSA_SHOW=Show\n\n#XLNK: link to hide for employee and week\nTSA_HIDE=Hide\n\n#XFLD: Weeks for which the timesheet is more than one week for employee\nTSA_WEEKS=Weeks\n\n#XFLD: Overtime for Timesheet entered for a employee.\nTSA_OVERTIME=Overtime\n\n#XFLD: Regular time for Timesheet entered for a employee.\nTSA_REGULARTIME=Regular time\n\n#XFLD: Recorded Time for employee.\nTSA_RECORDED=Recorded\n\n#XFLD: Completed percentage for employee Timesheet.\nTSA_COMPLETED=Completed\n\n#XFLD: Hour in short form.\nTSA_HOUR_SHORT=h\n\n#XFLD: Minutes in short form.\nTSA_MIN_SHORT=m\n\n#XFLD: Notes for time entry.\nTSA_NOTE=Note\n\n#XFLD: Wage Type for time entry.\nTSA_WAGE_TYPE=Wage Type\n\n#XFLD: Activity Type for time entry.\nTSA_ACTIVITY_TYPE=Activity Type\n\n#XFLD: Starttime  for time entry.\nTSA_START_TIME=Start Time\n\n#XFLD: Endtime  for time entry.\nTSA_END_TIME=End Time\n\n#XFLD: People for time entry Cost Assignment.\nTSA_PEOPLE=People\n\n#XFLD: Actual hours  for time entry.\nTSA_ACTUAL_HOURS=Actual Hours\n\n#XFLD: Planned hours for time entry .\nTSA_PLANNED_HOURS=Planned hours\n\n#XTIT: Details  for time entry notes.\nTSA_DETAILS=Details\n\n#XBUT\t: Close button for notes.\nTSA_CLOSE=Close\n\n#XFLD: No data available\nTSA_NO_DATA=No Data\n\n# YMSG: Loading\nLOADING=Loading...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=No items are currently available',
	"hcm/mgr/approve/timesheet/i18n/i18n_ar.properties":'#XTIT,30: Application name\r\nAPP_TITLE=\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0633\\u062C\\u0644\\u0627\\u062A \\u0627\\u0644\\u062D\\u0636\\u0648\\u0631\r\n#XTIT,30:  Application name\r\nTSA_APP_TITLE=\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0633\\u062C\\u0644\\u0627\\u062A \\u0627\\u0644\\u062D\\u0636\\u0648\\u0631\r\n#XTIT,30:  Application name\r\nMASTER_TITLE=\\u0635\\u0641\\u062D\\u0627\\u062A \\u0627\\u0644\\u062D\\u0636\\u0648\\u0631 ({0})\r\n#XTIT,30:  Application name\r\nTSA_APP=\\u0633\\u062C\\u0644 \\u0627\\u0644\\u062D\\u0636\\u0648\\u0631\r\n#XTIT,30: detail panel text\r\nDETAIL_TITLE=\\u0633\\u062C\\u0644 \\u0627\\u0644\\u062D\\u0636\\u0648\\u0631\r\n#XBUT,9: Button Approve\r\nTSA_APPROVE=\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F\r\n#XBUT,8: Button to Navigate back&nbsp;\\\\\\&nbsp;\r\nTSA_BACK=\\u0627\\u0644\\u062E\\u0644\\u0641\r\n#XFLD: Week for which the timesheet is entered\r\nTSA_WEEK=\\u0627\\u0644\\u0623\\u0633\\u0628\\u0648\\u0639\r\n#XFLD: No hours entered by the employee\r\nTSA_HOUR=\\u0633\\u0627\\u0639\\u0629\r\n#XFLD: for\r\nTSA_FOR=\\u0644\\u0640\r\n#XBUT:Button to Send after the Timesheet is approved &nbsp;\\\\\\&nbsp;\r\nTSA_SUBMIT=\\u0625\\u0631\\u0633\\u0627\\u0644\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=\\u062A\\u0639\\u0630\\u0631 \\u0627\\u0644\\u062D\\u0635\\u0648\\u0644 \\u0639\\u0644\\u0649 \\u0642\\u0627\\u0626\\u0645\\u0629 \\u0628\\u0625\\u062F\\u062E\\u0627\\u0644\\u0627\\u062A \\u0633\\u062C\\u0644 \\u0627\\u0644\\u062D\\u0636\\u0648\\u0631\r\n#YMSG: Message for Successful updation\r\nCATS_SUCCESS_MESSAGE=\\u062A\\u0645 \\u062A\\u062D\\u062F\\u064A\\u062B \\u0625\\u062F\\u062E\\u0627\\u0644\\u0627\\u062A \\u0633\\u062C\\u0644 \\u0627\\u0644\\u062D\\u0636\\u0648\\u0631\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0633\\u062C\\u0644 \\u0627\\u0644\\u062D\\u0636\\u0648\\u0631\r\n#XFLD: Link for manager to see employee notes\r\nSHOW_NOTE=\\u0625\\u0638\\u0647\\u0627\\u0631 \\u0627\\u0644\\u0645\\u0644\\u0627\\u062D\\u0638\\u0627\\u062A\r\n\r\n#XFLD: Link for manager to hide employee notes\r\nHIDE_NOTE=\\u0625\\u062E\\u0641\\u0627\\u0621 \\u0627\\u0644\\u0645\\u0644\\u0627\\u062D\\u0638\\u0627\\u062A\r\n\r\n#XTIT: Title for employee notes\r\nEMP_NOTE=\\u0645\\u0644\\u0627\\u062D\\u0638\\u0627\\u062A \\u0627\\u0644\\u0645\\u0648\\u0638\\u0641\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_EMP_NOTE=\\u0645\\u0644\\u0627\\u062D\\u0638\\u0627\\u062A \\u0627\\u0644\\u0645\\u0648\\u0638\\u0641\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_COST_ASSGNT=\\u062A\\u0639\\u064A\\u064A\\u0646 \\u0627\\u0644\\u062A\\u0643\\u0644\\u0641\\u0629\r\n\r\n#XFLD: Column header for activity\r\nTSA_ACTIVITY=\\u0627\\u0644\\u0646\\u0634\\u0627\\u0637\r\n\r\n#XFLD: Column header for time\r\nTSA_TIME=\\u0627\\u0644\\u0648\\u0642\\u062A\r\n\r\n#XFLD: Column header for date\r\nTSA_DATE=\\u0627\\u0644\\u062A\\u0627\\u0631\\u064A\\u062E\r\n\r\n#XFLD: Column header for activity\r\nTSA_REJECTION_REASON=\\u0633\\u0628\\u0628 \\u0627\\u0644\\u0631\\u0641\\u0636\r\n\r\n#XTIT: Title for list of rejection reasons\r\nTSA_TIT_REJECTION_REASON=\\u0633\\u0628\\u0628 \\u0627\\u0644\\u0631\\u0641\\u0636\r\n\r\n#XTIT: Field to Specify the Total hours\r\nTSA_TARGET=\\u0627\\u0644\\u0647\\u062F\\u0641\r\n\r\n#XTIT: Message for submit confirmation\r\nTSA_CONF=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0625\\u0631\\u0633\\u0627\\u0644 \\u0642\\u0631\\u0627\\u0631 \\u0627\\u0644\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F\\u061F\r\n\r\n#XTIT: title for submit confirmation\r\nTSA_CONF_HEADER=\\u062A\\u0623\\u0643\\u064A\\u062F\r\n\r\n#XBUT: button to confirm submit\r\nTSA_ACCEPT=\\u0645\\u0648\\u0627\\u0641\\u0642\r\n\r\n#XBUT: Cancel button for Rejection Reason\r\nTSA_CANCEL=\\u0625\\u0644\\u063A\\u0627\\u0621\r\n\r\n#XLNK: link to show for employee and week\r\nTSA_SHOW=\\u0625\\u0638\\u0647\\u0627\\u0631\r\n\r\n#XLNK: link to hide for employee and week\r\nTSA_HIDE=\\u0625\\u062E\\u0641\\u0627\\u0621\r\n\r\n#XFLD: Weeks for which the timesheet is more than one week for employee\r\nTSA_WEEKS=\\u0627\\u0644\\u0623\\u0633\\u0627\\u0628\\u064A\\u0639\r\n\r\n#XFLD: Overtime for Timesheet entered for a employee.\r\nTSA_OVERTIME=\\u0627\\u0644\\u0648\\u0642\\u062A \\u0627\\u0644\\u0625\\u0636\\u0627\\u0641\\u064A\r\n\r\n#XFLD: Regular time for Timesheet entered for a employee.\r\nTSA_REGULARTIME=\\u0648\\u0642\\u062A \\u0627\\u0644\\u0639\\u0645\\u0644 \\u0627\\u0644\\u0639\\u0627\\u062F\\u064A\r\n\r\n#XFLD: Recorded Time for employee.\r\nTSA_RECORDED=\\u0645\\u0633\\u062C\\u064E\\u0644\r\n\r\n#XFLD: Completed percentage for employee Timesheet.\r\nTSA_COMPLETED=\\u0645\\u0643\\u062A\\u0645\\u0644\r\n\r\n#XFLD: Hour in short form.\r\nTSA_HOUR_SHORT=\\u0633\r\n\r\n#XFLD: Minutes in short form.\r\nTSA_MIN_SHORT=\\u062F\r\n\r\n#XFLD: Notes for time entry.\r\nTSA_NOTE=\\u0645\\u0644\\u0627\\u062D\\u0638\\u0629\r\n\r\n#XFLD: Wage Type for time entry.\r\nTSA_WAGE_TYPE=\\u0646\\u0648\\u0639 \\u0627\\u0644\\u0623\\u062C\\u0631\r\n\r\n#XFLD: Activity Type for time entry.\r\nTSA_ACTIVITY_TYPE=\\u0646\\u0648\\u0639 \\u0627\\u0644\\u0646\\u0634\\u0627\\u0637\r\n\r\n#XFLD: Starttime  for time entry.\r\nTSA_START_TIME=\\u0648\\u0642\\u062A \\u0627\\u0644\\u0628\\u062F\\u0627\\u064A\\u0629\r\n\r\n#XFLD: Endtime  for time entry.\r\nTSA_END_TIME=\\u0648\\u0642\\u062A \\u0627\\u0644\\u0627\\u0646\\u062A\\u0647\\u0627\\u0621\r\n\r\n#XFLD: People for time entry Cost Assignment.\r\nTSA_PEOPLE=\\u0623\\u0634\\u062E\\u0627\\u0635\r\n\r\n#XFLD: Actual hours  for time entry.\r\nTSA_ACTUAL_HOURS=\\u0627\\u0644\\u0633\\u0627\\u0639\\u0627\\u062A \\u0627\\u0644\\u0641\\u0639\\u0644\\u064A\\u0629\r\n\r\n#XFLD: Planned hours for time entry .\r\nTSA_PLANNED_HOURS=\\u0627\\u0644\\u0633\\u0627\\u0639\\u0627\\u062A \\u0627\\u0644\\u0645\\u062E\\u0637\\u0637\\u0629\r\n\r\n#XTIT: Details  for time entry notes.\r\nTSA_DETAILS=\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644\r\n\r\n#XBUT\t: Close button for notes.\r\nTSA_CLOSE=\\u0625\\u063A\\u0644\\u0627\\u0642\r\n\r\n#XFLD: No data available\r\nTSA_NO_DATA=\\u0644\\u0627 \\u062A\\u0648\\u062C\\u062F \\u0628\\u064A\\u0627\\u0646\\u0627\\u062A\r\n\r\n# YMSG: Loading\r\nLOADING=\\u062C\\u0627\\u0631\\u064D \\u0627\\u0644\\u062A\\u062D\\u0645\\u064A\\u0644...\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=\\u0644\\u0627 \\u062A\\u062A\\u0648\\u0641\\u0631 \\u0623\\u064A \\u0639\\u0646\\u0627\\u0635\\u0631 \\u062D\\u0627\\u0644\\u064A\\u064B\\u0627\r\n',
	"hcm/mgr/approve/timesheet/i18n/i18n_cs.properties":'#XTIT,30: Application name\r\nAPP_TITLE=Schvalov\\u00E1n\\u00ED evidence \\u010Dasu\r\n#XTIT,30:  Application name\r\nTSA_APP_TITLE=Schvalov\\u00E1n\\u00ED evidence \\u010Dasu\r\n#XTIT,30:  Application name\r\nMASTER_TITLE=Pracovn\\u00ED v\\u00FDkazy ({0})\r\n#XTIT,30:  Application name\r\nTSA_APP=Evidence \\u010Dasu\r\n#XTIT,30: detail panel text\r\nDETAIL_TITLE=Evidence \\u010Dasu\r\n#XBUT,9: Button Approve\r\nTSA_APPROVE=Schv\\u00E1lit\r\n#XBUT,8: Button to Navigate back&nbsp;\\\\\\&nbsp;\r\nTSA_BACK=Zp\\u011Bt\r\n#XFLD: Week for which the timesheet is entered\r\nTSA_WEEK=T\\u00FDden\r\n#XFLD: No hours entered by the employee\r\nTSA_HOUR=Hodina\r\n#XFLD: for\r\nTSA_FOR=pro\r\n#XBUT:Button to Send after the Timesheet is approved &nbsp;\\\\\\&nbsp;\r\nTSA_SUBMIT=Odeslat\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=Nelze z\\u00EDskat seznam z\\u00E1znam\\u016F evidence \\u010Dasu\r\n#YMSG: Message for Successful updation\r\nCATS_SUCCESS_MESSAGE=Polo\\u017Eky evidence \\u010Dasu aktualizov\\u00E1ny\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=Schvalov\\u00E1n\\u00ED evidence \\u010Dasu\r\n#XFLD: Link for manager to see employee notes\r\nSHOW_NOTE=Zobrazit pozn\\u00E1mky\r\n\r\n#XFLD: Link for manager to hide employee notes\r\nHIDE_NOTE=Skr\\u00FDt pozn\\u00E1mky\r\n\r\n#XTIT: Title for employee notes\r\nEMP_NOTE=Zam\\u011Bstnanec - pozn\\u00E1mka\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_EMP_NOTE=Zam\\u011Bstnanec - pozn\\u00E1mka\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_COST_ASSGNT=P\\u0159i\\u0159azen\\u00ED n\\u00E1klad\\u016F\r\n\r\n#XFLD: Column header for activity\r\nTSA_ACTIVITY=\\u010Cinnost\r\n\r\n#XFLD: Column header for time\r\nTSA_TIME=Doba\r\n\r\n#XFLD: Column header for date\r\nTSA_DATE=Datum\r\n\r\n#XFLD: Column header for activity\r\nTSA_REJECTION_REASON=D\\u016Fvod zam\\u00EDtnut\\u00ED\r\n\r\n#XTIT: Title for list of rejection reasons\r\nTSA_TIT_REJECTION_REASON=D\\u016Fvod zam\\u00EDtnut\\u00ED\r\n\r\n#XTIT: Field to Specify the Total hours\r\nTSA_TARGET=C\\u00EDl\r\n\r\n#XTIT: Message for submit confirmation\r\nTSA_CONF=Odeslat va\\u0161e rozhodnut\\u00ED o schv\\u00E1len\\u00ED?\r\n\r\n#XTIT: title for submit confirmation\r\nTSA_CONF_HEADER=Potvrzen\\u00ED\r\n\r\n#XBUT: button to confirm submit\r\nTSA_ACCEPT=OK\r\n\r\n#XBUT: Cancel button for Rejection Reason\r\nTSA_CANCEL=Zru\\u0161it\r\n\r\n#XLNK: link to show for employee and week\r\nTSA_SHOW=Zobrazit\r\n\r\n#XLNK: link to hide for employee and week\r\nTSA_HIDE=Potla\\u010Dit\r\n\r\n#XFLD: Weeks for which the timesheet is more than one week for employee\r\nTSA_WEEKS=T\\u00FDdny\r\n\r\n#XFLD: Overtime for Timesheet entered for a employee.\r\nTSA_OVERTIME=P\\u0159es\\u010Das\r\n\r\n#XFLD: Regular time for Timesheet entered for a employee.\r\nTSA_REGULARTIME=Pravideln\\u00FD \\u010Das\r\n\r\n#XFLD: Recorded Time for employee.\r\nTSA_RECORDED=Zaznamen\\u00E1no\r\n\r\n#XFLD: Completed percentage for employee Timesheet.\r\nTSA_COMPLETED=Dokon\\u010Deno\r\n\r\n#XFLD: Hour in short form.\r\nTSA_HOUR_SHORT=h\r\n\r\n#XFLD: Minutes in short form.\r\nTSA_MIN_SHORT=m\r\n\r\n#XFLD: Notes for time entry.\r\nTSA_NOTE=Pozn\\u00E1mka\r\n\r\n#XFLD: Wage Type for time entry.\r\nTSA_WAGE_TYPE=Typ mzdy\r\n\r\n#XFLD: Activity Type for time entry.\r\nTSA_ACTIVITY_TYPE=Typ \\u010Dinnosti\r\n\r\n#XFLD: Starttime  for time entry.\r\nTSA_START_TIME=Po\\u010D\\u00E1te\\u010Dn\\u00ED \\u010Das\r\n\r\n#XFLD: Endtime  for time entry.\r\nTSA_END_TIME=\\u010Cas ukon\\u010Den\\u00ED\r\n\r\n#XFLD: People for time entry Cost Assignment.\r\nTSA_PEOPLE=Lid\\u00E9\r\n\r\n#XFLD: Actual hours  for time entry.\r\nTSA_ACTUAL_HOURS=Skute\\u010Dn\\u00E9 hodiny\r\n\r\n#XFLD: Planned hours for time entry .\r\nTSA_PLANNED_HOURS=Pl\\u00E1novan\\u00E9 hodiny\r\n\r\n#XTIT: Details  for time entry notes.\r\nTSA_DETAILS=Detaily\r\n\r\n#XBUT\t: Close button for notes.\r\nTSA_CLOSE=Zav\\u0159\\u00EDt\r\n\r\n#XFLD: No data available\r\nTSA_NO_DATA=\\u017D\\u00E1dn\\u00E1 data\r\n\r\n# YMSG: Loading\r\nLOADING=Zav\\u00E1d\\u00ED se...\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=V sou\\u010Dasn\\u00E9 dob\\u011B nejsou k dispozici \\u017E\\u00E1dn\\u00E9 polo\\u017Eky\r\n',
	"hcm/mgr/approve/timesheet/i18n/i18n_de.properties":'#XTIT,30: Application name\r\nAPP_TITLE=Erfasste Zeiten genehmigen\r\n#XTIT,30:  Application name\r\nTSA_APP_TITLE=Erfasste Zeiten genehmigen\r\n#XTIT,30:  Application name\r\nMASTER_TITLE=Arbeitszeitbl\\u00E4tter ({0})\r\n#XTIT,30:  Application name\r\nTSA_APP=Arbeitszeitblatt\r\n#XTIT,30: detail panel text\r\nDETAIL_TITLE=Arbeitszeitblatt\r\n#XBUT,9: Button Approve\r\nTSA_APPROVE=Genehm.\r\n#XBUT,8: Button to Navigate back&nbsp;\\\\\\&nbsp;\r\nTSA_BACK=Zur\\u00FCck\r\n#XFLD: Week for which the timesheet is entered\r\nTSA_WEEK=Woche\r\n#XFLD: No hours entered by the employee\r\nTSA_HOUR=Stunde\r\n#XFLD: for\r\nTSA_FOR=F\\u00FCr\r\n#XBUT:Button to Send after the Timesheet is approved &nbsp;\\\\\\&nbsp;\r\nTSA_SUBMIT=Senden\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=Zeiteintr\\u00E4ge k\\u00F6nnen nicht abgerufen werden\r\n#YMSG: Message for Successful updation\r\nCATS_SUCCESS_MESSAGE=Zeiteintr\\u00E4ge aktualisiert\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=Genehmigung von Zeiteintrag\r\n#XFLD: Link for manager to see employee notes\r\nSHOW_NOTE=Notizen anzeigen\r\n\r\n#XFLD: Link for manager to hide employee notes\r\nHIDE_NOTE=Notizen ausblenden\r\n\r\n#XTIT: Title for employee notes\r\nEMP_NOTE=Mitarbeiternotizen\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_EMP_NOTE=Mitarbeiternotizen\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_COST_ASSGNT=Kostenzuordnung\r\n\r\n#XFLD: Column header for activity\r\nTSA_ACTIVITY=T\\u00E4tigkeit\r\n\r\n#XFLD: Column header for time\r\nTSA_TIME=Zeit\r\n\r\n#XFLD: Column header for date\r\nTSA_DATE=Datum\r\n\r\n#XFLD: Column header for activity\r\nTSA_REJECTION_REASON=Ablehnungsgrund\r\n\r\n#XTIT: Title for list of rejection reasons\r\nTSA_TIT_REJECTION_REASON=Ablehnungsgrund\r\n\r\n#XTIT: Field to Specify the Total hours\r\nTSA_TARGET=Ziel\r\n\r\n#XTIT: Message for submit confirmation\r\nTSA_CONF=Entscheidung senden?\r\n\r\n#XTIT: title for submit confirmation\r\nTSA_CONF_HEADER=Best\\u00E4tigung\r\n\r\n#XBUT: button to confirm submit\r\nTSA_ACCEPT=OK\r\n\r\n#XBUT: Cancel button for Rejection Reason\r\nTSA_CANCEL=Abbrechen\r\n\r\n#XLNK: link to show for employee and week\r\nTSA_SHOW=Einblenden\r\n\r\n#XLNK: link to hide for employee and week\r\nTSA_HIDE=Ausblenden\r\n\r\n#XFLD: Weeks for which the timesheet is more than one week for employee\r\nTSA_WEEKS=Wochen\r\n\r\n#XFLD: Overtime for Timesheet entered for a employee.\r\nTSA_OVERTIME=Mehrarbeit\r\n\r\n#XFLD: Regular time for Timesheet entered for a employee.\r\nTSA_REGULARTIME=Regul\\u00E4re Arbeitszeit\r\n\r\n#XFLD: Recorded Time for employee.\r\nTSA_RECORDED=Erfasst\r\n\r\n#XFLD: Completed percentage for employee Timesheet.\r\nTSA_COMPLETED=Abgeschlossen\r\n\r\n#XFLD: Hour in short form.\r\nTSA_HOUR_SHORT=Std.\r\n\r\n#XFLD: Minutes in short form.\r\nTSA_MIN_SHORT=Min.\r\n\r\n#XFLD: Notes for time entry.\r\nTSA_NOTE=Notiz\r\n\r\n#XFLD: Wage Type for time entry.\r\nTSA_WAGE_TYPE=Lohnart\r\n\r\n#XFLD: Activity Type for time entry.\r\nTSA_ACTIVITY_TYPE=Aktivit\\u00E4tstyp\r\n\r\n#XFLD: Starttime  for time entry.\r\nTSA_START_TIME=Start (Zeit)\r\n\r\n#XFLD: Endtime  for time entry.\r\nTSA_END_TIME=Ende (Zeit)\r\n\r\n#XFLD: People for time entry Cost Assignment.\r\nTSA_PEOPLE=Personen\r\n\r\n#XFLD: Actual hours  for time entry.\r\nTSA_ACTUAL_HOURS=Tats\\u00E4chliche Arbeitszeit\r\n\r\n#XFLD: Planned hours for time entry .\r\nTSA_PLANNED_HOURS=Geplante Arbeitszeit\r\n\r\n#XTIT: Details  for time entry notes.\r\nTSA_DETAILS=Details\r\n\r\n#XBUT\t: Close button for notes.\r\nTSA_CLOSE=Schlie\\u00DFen\r\n\r\n#XFLD: No data available\r\nTSA_NO_DATA=Keine Daten\r\n\r\n# YMSG: Loading\r\nLOADING=Laden ...\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=Keine Positionen verf\\u00FCgbar\r\n',
	"hcm/mgr/approve/timesheet/i18n/i18n_en.properties":'#XTIT,30: Application name\r\nAPP_TITLE=Approve Timesheets\r\n#XTIT,30:  Application name\r\nTSA_APP_TITLE=Approve Timesheets\r\n#XTIT,30:  Application name\r\nMASTER_TITLE=Timesheets ({0})\r\n#XTIT,30:  Application name\r\nTSA_APP=Timesheet\r\n#XTIT,30: detail panel text\r\nDETAIL_TITLE=Timesheet\r\n#XBUT,9: Button Approve\r\nTSA_APPROVE=Approve\r\n#XBUT,8: Button to Navigate back&nbsp;\\\\\\&nbsp;\r\nTSA_BACK=Back\r\n#XFLD: Week for which the timesheet is entered\r\nTSA_WEEK=Week\r\n#XFLD: No hours entered by the employee\r\nTSA_HOUR=Hour\r\n#XFLD: for\r\nTSA_FOR=For\r\n#XBUT:Button to Send after the Timesheet is approved &nbsp;\\\\\\&nbsp;\r\nTSA_SUBMIT=Send\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=Could not obtain the list of timesheet entries\r\n#YMSG: Message for Successful updation\r\nCATS_SUCCESS_MESSAGE=Timesheet entries updated\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=Timesheet Approval\r\n#XFLD: Link for manager to see employee notes\r\nSHOW_NOTE=Show Notes\r\n\r\n#XFLD: Link for manager to hide employee notes\r\nHIDE_NOTE=Hide Notes\r\n\r\n#XTIT: Title for employee notes\r\nEMP_NOTE=Employee Notes\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_EMP_NOTE=Employee Notes\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_COST_ASSGNT=Cost Assignment\r\n\r\n#XFLD: Column header for activity\r\nTSA_ACTIVITY=Activity\r\n\r\n#XFLD: Column header for time\r\nTSA_TIME=Time\r\n\r\n#XFLD: Column header for date\r\nTSA_DATE=Date\r\n\r\n#XFLD: Column header for activity\r\nTSA_REJECTION_REASON=Rejection Reason\r\n\r\n#XTIT: Title for list of rejection reasons\r\nTSA_TIT_REJECTION_REASON=Rejection Reason\r\n\r\n#XTIT: Field to Specify the Total hours\r\nTSA_TARGET=Target\r\n\r\n#XTIT: Message for submit confirmation\r\nTSA_CONF=Submit your approval decision?\r\n\r\n#XTIT: title for submit confirmation\r\nTSA_CONF_HEADER=Confirmation\r\n\r\n#XBUT: button to confirm submit\r\nTSA_ACCEPT=OK\r\n\r\n#XBUT: Cancel button for Rejection Reason\r\nTSA_CANCEL=Cancel\r\n\r\n#XLNK: link to show for employee and week\r\nTSA_SHOW=Show\r\n\r\n#XLNK: link to hide for employee and week\r\nTSA_HIDE=Hide\r\n\r\n#XFLD: Weeks for which the timesheet is more than one week for employee\r\nTSA_WEEKS=Weeks\r\n\r\n#XFLD: Overtime for Timesheet entered for a employee.\r\nTSA_OVERTIME=Overtime\r\n\r\n#XFLD: Regular time for Timesheet entered for a employee.\r\nTSA_REGULARTIME=Regular Time\r\n\r\n#XFLD: Recorded Time for employee.\r\nTSA_RECORDED=Recorded\r\n\r\n#XFLD: Completed percentage for employee Timesheet.\r\nTSA_COMPLETED=Completed\r\n\r\n#XFLD: Hour in short form.\r\nTSA_HOUR_SHORT=h\r\n\r\n#XFLD: Minutes in short form.\r\nTSA_MIN_SHORT=m\r\n\r\n#XFLD: Notes for time entry.\r\nTSA_NOTE=Note\r\n\r\n#XFLD: Wage Type for time entry.\r\nTSA_WAGE_TYPE=Wage Type\r\n\r\n#XFLD: Activity Type for time entry.\r\nTSA_ACTIVITY_TYPE=Activity Type\r\n\r\n#XFLD: Starttime  for time entry.\r\nTSA_START_TIME=Start Time\r\n\r\n#XFLD: Endtime  for time entry.\r\nTSA_END_TIME=End Time\r\n\r\n#XFLD: People for time entry Cost Assignment.\r\nTSA_PEOPLE=People\r\n\r\n#XFLD: Actual hours  for time entry.\r\nTSA_ACTUAL_HOURS=Actual Hours\r\n\r\n#XFLD: Planned hours for time entry .\r\nTSA_PLANNED_HOURS=Planned Hours\r\n\r\n#XTIT: Details  for time entry notes.\r\nTSA_DETAILS=Details\r\n\r\n#XBUT\t: Close button for notes.\r\nTSA_CLOSE=Close\r\n\r\n#XFLD: No data available\r\nTSA_NO_DATA=No Data\r\n\r\n# YMSG: Loading\r\nLOADING=Loading...\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=No items are currently available\r\n',
	"hcm/mgr/approve/timesheet/i18n/i18n_en_US_sappsd.properties":'#XTIT,30: Application name\r\nAPP_TITLE=[[[\\u0162\\u012C\\u039C\\u0114\\u015C\\u0124\\u0114\\u0114\\u0162 \\u1000\\u01A4\\u01A4\\u0158\\u014E\\u01B2\\u1000\\u013B]]]\r\n#XTIT,30:  Application name\r\nTSA_APP_TITLE=[[[\\u1000\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113 \\u0162\\u012F\\u0271\\u0113\\u015F\\u0125\\u0113\\u0113\\u0163\\u015F]]]\r\n#XTIT,30:  Application name\r\nMASTER_TITLE=[[[\\u0162\\u012F\\u0271\\u0113\\u015F\\u0125\\u0113\\u0113\\u0163\\u015F ({0})]]]\r\n#XTIT,30:  Application name\r\nTSA_APP=[[[\\u0162\\u012F\\u0271\\u0113\\u015F\\u0125\\u0113\\u0113\\u0163]]]\r\n#XTIT,30: detail panel text\r\nDETAIL_TITLE=[[[\\u0162\\u012F\\u0271\\u0113\\u015F\\u0125\\u0113\\u0113\\u0163]]]\r\n#XBUT,9: Button Approve\r\nTSA_APPROVE=[[[\\u1000\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113]]]\r\n#XBUT,8: Button to Navigate back&nbsp;\\\\\\&nbsp;\r\nTSA_BACK=[[[\\u0181\\u0105\\u010B\\u0137]]]\r\n#XFLD: Week for which the timesheet is entered\r\nTSA_WEEK=[[[\\u0174\\u0113\\u0113\\u0137]]]\r\n#XFLD: No hours entered by the employee\r\nTSA_HOUR=[[[\\u0124\\u014F\\u0171\\u0157]]]\r\n#XFLD: for\r\nTSA_FOR=[[[\\u0192\\u014F\\u0157]]]\r\n#XBUT:Button to Send after the Timesheet is approved &nbsp;\\\\\\&nbsp;\r\nTSA_SUBMIT=[[[\\u015C\\u0114\\u0143\\u010E]]]\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=[[[\\u0108\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u014F\\u0183\\u0163\\u0105\\u012F\\u014B \\u0163\\u0125\\u0113 \\u013A\\u012F\\u015F\\u0163 \\u014F\\u0192 \\u0163\\u012F\\u0271\\u0113\\u015F\\u0125\\u0113\\u0113\\u0163 \\u0113\\u014B\\u0163\\u0157\\u012F\\u0113\\u015F]]]\r\n#YMSG: Message for Successful updation\r\nCATS_SUCCESS_MESSAGE=[[[\\u0162\\u012F\\u0271\\u0113\\u015F\\u0125\\u0113\\u0113\\u0163 \\u0113\\u014B\\u0163\\u0157\\u012F\\u0113\\u015F \\u0171\\u03C1\\u018C\\u0105\\u0163\\u0113\\u018C]]]\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=[[[\\u0162\\u012F\\u0271\\u0113\\u015F\\u0125\\u0113\\u0113\\u0163 \\u1000\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0105\\u013A]]]\r\n#XFLD: Link for manager to see employee notes\r\nSHOW_NOTE=[[[\\u015C\\u0125\\u014F\\u0175 \\u0143\\u014F\\u0163\\u0113\\u015F]]]\r\n\r\n#XFLD: Link for manager to hide employee notes\r\nHIDE_NOTE=[[[\\u0124\\u012F\\u018C\\u0113 \\u0143\\u014F\\u0163\\u0113\\u015F]]]\r\n\r\n#XTIT: Title for employee notes\r\nEMP_NOTE=[[[\\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113 \\u0143\\u014F\\u0163\\u0113\\u015F]]]\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_EMP_NOTE=[[[\\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113 \\u0143\\u014F\\u0163\\u0113\\u015F]]]\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_COST_ASSGNT=[[[\\u0108\\u014F\\u015F\\u0163 \\u1000\\u015F\\u015F\\u012F\\u011F\\u014B\\u0271\\u0113\\u014B\\u0163]]]\r\n\r\n#XFLD: Column header for activity\r\nTSA_ACTIVITY=[[[\\u1000\\u010B\\u0163\\u012F\\u028B\\u012F\\u0163\\u0177]]]\r\n\r\n#XFLD: Column header for time\r\nTSA_TIME=[[[\\u0162\\u012F\\u0271\\u0113]]]\r\n\r\n#XFLD: Column header for date\r\nTSA_DATE=[[[\\u010E\\u0105\\u0163\\u0113]]]\r\n\r\n#XFLD: Column header for activity\r\nTSA_REJECTION_REASON=[[[\\u0158\\u0113\\u0135\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B \\u0158\\u0113\\u0105\\u015F\\u014F\\u014B]]]\r\n\r\n#XTIT: Title for list of rejection reasons\r\nTSA_TIT_REJECTION_REASON=[[[\\u0158\\u0113\\u0135\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B \\u0158\\u0113\\u0105\\u015F\\u014F\\u014B]]]\r\n\r\n#XTIT: Field to Specify the Total hours\r\nTSA_TARGET=[[[\\u0162\\u0105\\u0157\\u011F\\u0113\\u0163]]]\r\n\r\n#XTIT: Message for submit confirmation\r\nTSA_CONF=[[[\\u015C\\u0171\\u0183\\u0271\\u012F\\u0163 \\u0177\\u014F\\u0171\\u0157 \\u0105\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0105\\u013A \\u018C\\u0113\\u010B\\u012F\\u015F\\u012F\\u014F\\u014B?]]]\r\n\r\n#XTIT: title for submit confirmation\r\nTSA_CONF_HEADER=[[[\\u0108\\u014F\\u014B\\u0192\\u012F\\u0157\\u0271\\u0105\\u0163\\u012F\\u014F\\u014B]]]\r\n\r\n#XBUT: button to confirm submit\r\nTSA_ACCEPT=[[[\\u014E\\u0136]]]\r\n\r\n#XBUT: Cancel button for Rejection Reason\r\nTSA_CANCEL=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A]]]\r\n\r\n#XLNK: link to show for employee and week\r\nTSA_SHOW=[[[\\u015C\\u0125\\u014F\\u0175]]]\r\n\r\n#XLNK: link to hide for employee and week\r\nTSA_HIDE=[[[\\u0124\\u012F\\u018C\\u0113]]]\r\n\r\n#XFLD: Weeks for which the timesheet is more than one week for employee\r\nTSA_WEEKS=[[[\\u0174\\u0113\\u0113\\u0137\\u015F]]]\r\n\r\n#XFLD: Overtime for Timesheet entered for a employee.\r\nTSA_OVERTIME=[[[\\u014E\\u028B\\u0113\\u0157\\u0163\\u012F\\u0271\\u0113]]]\r\n\r\n#XFLD: Regular time for Timesheet entered for a employee.\r\nTSA_REGULARTIME=[[[\\u0158\\u0113\\u011F\\u0171\\u013A\\u0105\\u0157 \\u0163\\u012F\\u0271\\u0113]]]\r\n\r\n#XFLD: Recorded Time for employee.\r\nTSA_RECORDED=[[[\\u0158\\u0113\\u010B\\u014F\\u0157\\u018C\\u0113\\u018C]]]\r\n\r\n#XFLD: Completed percentage for employee Timesheet.\r\nTSA_COMPLETED=[[[\\u0108\\u014F\\u0271\\u03C1\\u013A\\u0113\\u0163\\u0113\\u018C]]]\r\n\r\n#XFLD: Hour in short form.\r\nTSA_HOUR_SHORT=[[[\\u0125]]]\r\n\r\n#XFLD: Minutes in short form.\r\nTSA_MIN_SHORT=[[[\\u0271]]]\r\n\r\n#XFLD: Notes for time entry.\r\nTSA_NOTE=[[[\\u0143\\u014F\\u0163\\u0113]]]\r\n\r\n#XFLD: Wage Type for time entry.\r\nTSA_WAGE_TYPE=[[[\\u0174\\u0105\\u011F\\u0113 \\u0162\\u0177\\u03C1\\u0113]]]\r\n\r\n#XFLD: Activity Type for time entry.\r\nTSA_ACTIVITY_TYPE=[[[\\u1000\\u010B\\u0163\\u012F\\u028B\\u012F\\u0163\\u0177 \\u0162\\u0177\\u03C1\\u0113]]]\r\n\r\n#XFLD: Starttime  for time entry.\r\nTSA_START_TIME=[[[\\u015C\\u0163\\u0105\\u0157\\u0163 \\u0162\\u012F\\u0271\\u0113]]]\r\n\r\n#XFLD: Endtime  for time entry.\r\nTSA_END_TIME=[[[\\u0114\\u014B\\u018C \\u0162\\u012F\\u0271\\u0113]]]\r\n\r\n#XFLD: People for time entry Cost Assignment.\r\nTSA_PEOPLE=[[[\\u01A4\\u0113\\u014F\\u03C1\\u013A\\u0113]]]\r\n\r\n#XFLD: Actual hours  for time entry.\r\nTSA_ACTUAL_HOURS=[[[\\u1000\\u010B\\u0163\\u0171\\u0105\\u013A \\u0124\\u014F\\u0171\\u0157\\u015F]]]\r\n\r\n#XFLD: Planned hours for time entry .\r\nTSA_PLANNED_HOURS=[[[\\u01A4\\u013A\\u0105\\u014B\\u014B\\u0113\\u018C \\u0125\\u014F\\u0171\\u0157\\u015F]]]\r\n\r\n#XTIT: Details  for time entry notes.\r\nTSA_DETAILS=[[[\\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F]]]\r\n\r\n#XBUT\t: Close button for notes.\r\nTSA_CLOSE=[[[\\u0108\\u013A\\u014F\\u015F\\u0113]]]\r\n\r\n#XFLD: No data available\r\nTSA_NO_DATA=[[[\\u0143\\u014F \\u010E\\u0105\\u0163\\u0105]]]\r\n\r\n# YMSG: Loading\r\nLOADING=[[[\\u013B\\u014F\\u0105\\u018C\\u012F\\u014B\\u011F...]]]\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=[[[\\u0143\\u014F \\u012F\\u0163\\u0113\\u0271\\u015F \\u0105\\u0157\\u0113 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163\\u013A\\u0177 \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113]]]\r\n',
	"hcm/mgr/approve/timesheet/i18n/i18n_en_US_saptrc.properties":'#XTIT,30: Application name\r\nAPP_TITLE=G6MrztACmEEamookG690Qg_TIMESHEET APPROVAL\r\n#XTIT,30:  Application name\r\nTSA_APP_TITLE=e8dzkP3KK3rCqts9WmFmSQ_Approve Timesheets\r\n#XTIT,30:  Application name\r\nMASTER_TITLE=NhkpGSSRNhVgjpPQKHkgJg_Timesheets ({0})\r\n#XTIT,30:  Application name\r\nTSA_APP=MdDXOVTbEes4g/atYpgOxw_Timesheet\r\n#XTIT,30: detail panel text\r\nDETAIL_TITLE=HhqMEmQL51zT428HTiw22Q_Timesheet\r\n#XBUT,9: Button Approve\r\nTSA_APPROVE=YujXc17L4bX1Av0aEywPBw_Approve\r\n#XBUT,8: Button to Navigate back&nbsp;\\\\\\&nbsp;\r\nTSA_BACK=Z5SUHcjaIswGUB15Mo6lJQ_Back\r\n#XFLD: Week for which the timesheet is entered\r\nTSA_WEEK=er0FLGwQ9VzEXOxppui+Gg_Week\r\n#XFLD: No hours entered by the employee\r\nTSA_HOUR=pHEfAZzPvkg0MgFryMc/vg_Hour\r\n#XFLD: for\r\nTSA_FOR=nLIYjPg9Pl2wsBPgS3N6+Q_for\r\n#XBUT:Button to Send after the Timesheet is approved &nbsp;\\\\\\&nbsp;\r\nTSA_SUBMIT=qgcQhHffeQsyehJg9po/MA_SEND\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=G6kJdFgT/r196oCrEXhMeg_Could not obtain the list of timesheet entries\r\n#YMSG: Message for Successful updation\r\nCATS_SUCCESS_MESSAGE=z9z32ipf2XFUdgyyKSTqiw_Timesheet entries updated\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=E1SAyLtg70/ussgRxZc0vQ_Timesheet Approval\r\n#XFLD: Link for manager to see employee notes\r\nSHOW_NOTE=UHEp96ozmpBZ47nGXVjSbQ_Show Notes\r\n\r\n#XFLD: Link for manager to hide employee notes\r\nHIDE_NOTE=eoku7djlFnUO9lazrBp0bQ_Hide Notes\r\n\r\n#XTIT: Title for employee notes\r\nEMP_NOTE=5PEF2PNRiowB65Mwc3Yhkg_Employee Notes\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_EMP_NOTE=o8DV3TJSENUuEzUeavhkmw_Employee Notes\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_COST_ASSGNT=vYtuHv754yuv/TXWUz1fMA_Cost Assignment\r\n\r\n#XFLD: Column header for activity\r\nTSA_ACTIVITY=799fAltP39U3uGF5GIRZtg_Activity\r\n\r\n#XFLD: Column header for time\r\nTSA_TIME=I8jaDaQuPc/b6W6eCXNbxg_Time\r\n\r\n#XFLD: Column header for date\r\nTSA_DATE=vuDOuWVnpciGpZU9YIeudQ_Date\r\n\r\n#XFLD: Column header for activity\r\nTSA_REJECTION_REASON=VpqH6w12d1F1WoTruGLq8g_Rejection Reason\r\n\r\n#XTIT: Title for list of rejection reasons\r\nTSA_TIT_REJECTION_REASON=UzHwMdCzoepEmtql4Yn95g_Rejection Reason\r\n\r\n#XTIT: Field to Specify the Total hours\r\nTSA_TARGET=aVAJlyFP51ytths5WPnfkQ_Target\r\n\r\n#XTIT: Message for submit confirmation\r\nTSA_CONF=M8OH7PgfOPG6BDyxsvY5IA_Submit your approval decision?\r\n\r\n#XTIT: title for submit confirmation\r\nTSA_CONF_HEADER=ZEPsIR6gW6EGVC0lFUrZ8w_Confirmation\r\n\r\n#XBUT: button to confirm submit\r\nTSA_ACCEPT=R3XjnNlzmW4kVrayMjKPOQ_OK\r\n\r\n#XBUT: Cancel button for Rejection Reason\r\nTSA_CANCEL=+Tn8Hk2MuNcN1wmZy7Eqmw_Cancel\r\n\r\n#XLNK: link to show for employee and week\r\nTSA_SHOW=JVtROfYO1BhmqGmjnLX6oQ_Show\r\n\r\n#XLNK: link to hide for employee and week\r\nTSA_HIDE=Xl/wSVr0C9ESATTLiiaq3Q_Hide\r\n\r\n#XFLD: Weeks for which the timesheet is more than one week for employee\r\nTSA_WEEKS=VLf3iPK0k9T6QNkp3VQKkw_Weeks\r\n\r\n#XFLD: Overtime for Timesheet entered for a employee.\r\nTSA_OVERTIME=UDTbWfVnU/RzFk9Yu96hrg_Overtime\r\n\r\n#XFLD: Regular time for Timesheet entered for a employee.\r\nTSA_REGULARTIME=mZhvQ8E5kgYXM/+msx7fJA_Regular time\r\n\r\n#XFLD: Recorded Time for employee.\r\nTSA_RECORDED=FdAg2nSSsDWlda/GswD9hg_Recorded\r\n\r\n#XFLD: Completed percentage for employee Timesheet.\r\nTSA_COMPLETED=4ii9yfX/zFt6YyW9UkzaJg_Completed\r\n\r\n#XFLD: Hour in short form.\r\nTSA_HOUR_SHORT=27GCGnGG8aOdBTxCCGP4bQ_h\r\n\r\n#XFLD: Minutes in short form.\r\nTSA_MIN_SHORT=cblxor7StaFM9hEj3P5bAg_m\r\n\r\n#XFLD: Notes for time entry.\r\nTSA_NOTE=7p+ukdyHYjyEMatyNMHPPg_Note\r\n\r\n#XFLD: Wage Type for time entry.\r\nTSA_WAGE_TYPE=SuQfcehBHTCPbtMZL4191A_Wage Type\r\n\r\n#XFLD: Activity Type for time entry.\r\nTSA_ACTIVITY_TYPE=aYn2cjKmQXUIGxg7E363rQ_Activity Type\r\n\r\n#XFLD: Starttime  for time entry.\r\nTSA_START_TIME=nW9cukgwRzyQUA5vK/B+iQ_Start Time\r\n\r\n#XFLD: Endtime  for time entry.\r\nTSA_END_TIME=usgyIoD1VpaF6d+AR9RITA_End Time\r\n\r\n#XFLD: People for time entry Cost Assignment.\r\nTSA_PEOPLE=U/Me9R+0vJS64ulcqE7s4g_People\r\n\r\n#XFLD: Actual hours  for time entry.\r\nTSA_ACTUAL_HOURS=b256L30nfUk+7jOzL1Oe9Q_Actual Hours\r\n\r\n#XFLD: Planned hours for time entry .\r\nTSA_PLANNED_HOURS=PRjQArMCYMmXbCCW46ABKg_Planned hours\r\n\r\n#XTIT: Details  for time entry notes.\r\nTSA_DETAILS=H041xZUJbxNaeexDlmIbIw_Details\r\n\r\n#XBUT\t: Close button for notes.\r\nTSA_CLOSE=c7HD6D3wKG1WoqpPBlqfZw_Close\r\n\r\n#XFLD: No data available\r\nTSA_NO_DATA=9aWaDYR8hVjz13Pysf9B4w_No Data\r\n\r\n# YMSG: Loading\r\nLOADING=QziafOEmHFmHwruus/SvfA_Loading...\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=UBM5zeg38HUbgDAixShylQ_No items are currently available\r\n',
	"hcm/mgr/approve/timesheet/i18n/i18n_es.properties":'#XTIT,30: Application name\r\nAPP_TITLE=Aprobaci\\u00F3n registros tiempos\r\n#XTIT,30:  Application name\r\nTSA_APP_TITLE=Aprobaci\\u00F3n registros tiempos\r\n#XTIT,30:  Application name\r\nMASTER_TITLE=Registros de tiempos ({0})\r\n#XTIT,30:  Application name\r\nTSA_APP=Registro de tiempos\r\n#XTIT,30: detail panel text\r\nDETAIL_TITLE=Registro de tiempos\r\n#XBUT,9: Button Approve\r\nTSA_APPROVE=Aprobar\r\n#XBUT,8: Button to Navigate back&nbsp;\\\\\\&nbsp;\r\nTSA_BACK=Atr\\u00E1s\r\n#XFLD: Week for which the timesheet is entered\r\nTSA_WEEK=Semana\r\n#XFLD: No hours entered by the employee\r\nTSA_HOUR=Hora\r\n#XFLD: for\r\nTSA_FOR=Para\r\n#XBUT:Button to Send after the Timesheet is approved &nbsp;\\\\\\&nbsp;\r\nTSA_SUBMIT=Enviar\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=No se ha podido obtener la lista de entradas del registro de tiempos\r\n#YMSG: Message for Successful updation\r\nCATS_SUCCESS_MESSAGE=Entradas del registro de tiempos actualizadas\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=Aprobaci\\u00F3n del registro de tiempos\r\n#XFLD: Link for manager to see employee notes\r\nSHOW_NOTE=Visualizar notas\r\n\r\n#XFLD: Link for manager to hide employee notes\r\nHIDE_NOTE=Suprimir notas\r\n\r\n#XTIT: Title for employee notes\r\nEMP_NOTE=Notas de empleado\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_EMP_NOTE=Notas de empleado\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_COST_ASSGNT=Asignaci\\u00F3n de costes\r\n\r\n#XFLD: Column header for activity\r\nTSA_ACTIVITY=Actividad\r\n\r\n#XFLD: Column header for time\r\nTSA_TIME=Tiempo\r\n\r\n#XFLD: Column header for date\r\nTSA_DATE=Fecha\r\n\r\n#XFLD: Column header for activity\r\nTSA_REJECTION_REASON=Motivo de rechazo\r\n\r\n#XTIT: Title for list of rejection reasons\r\nTSA_TIT_REJECTION_REASON=Motivo de rechazo\r\n\r\n#XTIT: Field to Specify the Total hours\r\nTSA_TARGET=Objetivo\r\n\r\n#XTIT: Message for submit confirmation\r\nTSA_CONF=\\u00BFEnviar su decisi\\u00F3n de aprobaci\\u00F3n?\r\n\r\n#XTIT: title for submit confirmation\r\nTSA_CONF_HEADER=Confirmaci\\u00F3n\r\n\r\n#XBUT: button to confirm submit\r\nTSA_ACCEPT=OK\r\n\r\n#XBUT: Cancel button for Rejection Reason\r\nTSA_CANCEL=Cancelar\r\n\r\n#XLNK: link to show for employee and week\r\nTSA_SHOW=Visualizar\r\n\r\n#XLNK: link to hide for employee and week\r\nTSA_HIDE=Suprimir\r\n\r\n#XFLD: Weeks for which the timesheet is more than one week for employee\r\nTSA_WEEKS=Semanas\r\n\r\n#XFLD: Overtime for Timesheet entered for a employee.\r\nTSA_OVERTIME=Horas extras\r\n\r\n#XFLD: Regular time for Timesheet entered for a employee.\r\nTSA_REGULARTIME=Hora normal\r\n\r\n#XFLD: Recorded Time for employee.\r\nTSA_RECORDED=Grabado\r\n\r\n#XFLD: Completed percentage for employee Timesheet.\r\nTSA_COMPLETED=Finalizado\r\n\r\n#XFLD: Hour in short form.\r\nTSA_HOUR_SHORT=h\r\n\r\n#XFLD: Minutes in short form.\r\nTSA_MIN_SHORT=m\r\n\r\n#XFLD: Notes for time entry.\r\nTSA_NOTE=Nota\r\n\r\n#XFLD: Wage Type for time entry.\r\nTSA_WAGE_TYPE=Clase de salario\r\n\r\n#XFLD: Activity Type for time entry.\r\nTSA_ACTIVITY_TYPE=Clase de actividad\r\n\r\n#XFLD: Starttime  for time entry.\r\nTSA_START_TIME=Hora de inicio\r\n\r\n#XFLD: Endtime  for time entry.\r\nTSA_END_TIME=Hora de fin\r\n\r\n#XFLD: People for time entry Cost Assignment.\r\nTSA_PEOPLE=Contactos\r\n\r\n#XFLD: Actual hours  for time entry.\r\nTSA_ACTUAL_HOURS=Horas reales\r\n\r\n#XFLD: Planned hours for time entry .\r\nTSA_PLANNED_HOURS=Horas planificadas\r\n\r\n#XTIT: Details  for time entry notes.\r\nTSA_DETAILS=Detalles\r\n\r\n#XBUT\t: Close button for notes.\r\nTSA_CLOSE=Cerrar\r\n\r\n#XFLD: No data available\r\nTSA_NO_DATA=Sin datos\r\n\r\n# YMSG: Loading\r\nLOADING=Cargando...\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=Actualmente no hay posiciones disponibles\r\n',
	"hcm/mgr/approve/timesheet/i18n/i18n_fr.properties":'#XTIT,30: Application name\r\nAPP_TITLE=Approb. feuilles saisie temps\r\n#XTIT,30:  Application name\r\nTSA_APP_TITLE=Approb. feuilles saisie temps\r\n#XTIT,30:  Application name\r\nMASTER_TITLE=Feuilles de saisie des temps ({0})\r\n#XTIT,30:  Application name\r\nTSA_APP=Feuille de saisie des temps\r\n#XTIT,30: detail panel text\r\nDETAIL_TITLE=Feuille de saisie des temps\r\n#XBUT,9: Button Approve\r\nTSA_APPROVE=Approuv.\r\n#XBUT,8: Button to Navigate back&nbsp;\\\\\\&nbsp;\r\nTSA_BACK=Retour\r\n#XFLD: Week for which the timesheet is entered\r\nTSA_WEEK=Semaine\r\n#XFLD: No hours entered by the employee\r\nTSA_HOUR=Heure\r\n#XFLD: for\r\nTSA_FOR=Pour\r\n#XBUT:Button to Send after the Timesheet is approved &nbsp;\\\\\\&nbsp;\r\nTSA_SUBMIT=Envoyer\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=Impossible d\'acc\\u00E9der \\u00E0 la liste des entr\\u00E9es de la feuille de saisie des temps\r\n#YMSG: Message for Successful updation\r\nCATS_SUCCESS_MESSAGE=Entr\\u00E9es de la feuille de saisie des temps mises \\u00E0 jour\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=Approbation de feuilles de saisie des temps\r\n#XFLD: Link for manager to see employee notes\r\nSHOW_NOTE=Afficher notes\r\n\r\n#XFLD: Link for manager to hide employee notes\r\nHIDE_NOTE=Masquer notes\r\n\r\n#XTIT: Title for employee notes\r\nEMP_NOTE=Notes du salari\\u00E9\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_EMP_NOTE=Notes du salari\\u00E9\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_COST_ASSGNT=Affectation des co\\u00FBts\r\n\r\n#XFLD: Column header for activity\r\nTSA_ACTIVITY=Activit\\u00E9\r\n\r\n#XFLD: Column header for time\r\nTSA_TIME=Heure\r\n\r\n#XFLD: Column header for date\r\nTSA_DATE=Date\r\n\r\n#XFLD: Column header for activity\r\nTSA_REJECTION_REASON=Motif de refus\r\n\r\n#XTIT: Title for list of rejection reasons\r\nTSA_TIT_REJECTION_REASON=Motif de refus\r\n\r\n#XTIT: Field to Specify the Total hours\r\nTSA_TARGET=Cible\r\n\r\n#XTIT: Message for submit confirmation\r\nTSA_CONF=Envoyer votre d\\u00E9cision d\'approbation ?\r\n\r\n#XTIT: title for submit confirmation\r\nTSA_CONF_HEADER=Confirmation\r\n\r\n#XBUT: button to confirm submit\r\nTSA_ACCEPT=OK\r\n\r\n#XBUT: Cancel button for Rejection Reason\r\nTSA_CANCEL=Interrompre\r\n\r\n#XLNK: link to show for employee and week\r\nTSA_SHOW=Afficher\r\n\r\n#XLNK: link to hide for employee and week\r\nTSA_HIDE=Masquer\r\n\r\n#XFLD: Weeks for which the timesheet is more than one week for employee\r\nTSA_WEEKS=Semaines\r\n\r\n#XFLD: Overtime for Timesheet entered for a employee.\r\nTSA_OVERTIME=Heures suppl\\u00E9mentaires\r\n\r\n#XFLD: Regular time for Timesheet entered for a employee.\r\nTSA_REGULARTIME=Horaire normal\r\n\r\n#XFLD: Recorded Time for employee.\r\nTSA_RECORDED=Enregistr\\u00E9\r\n\r\n#XFLD: Completed percentage for employee Timesheet.\r\nTSA_COMPLETED=Cl\\u00F4tur\\u00E9\r\n\r\n#XFLD: Hour in short form.\r\nTSA_HOUR_SHORT=h\r\n\r\n#XFLD: Minutes in short form.\r\nTSA_MIN_SHORT=m\r\n\r\n#XFLD: Notes for time entry.\r\nTSA_NOTE=Note\r\n\r\n#XFLD: Wage Type for time entry.\r\nTSA_WAGE_TYPE=Rubrique\r\n\r\n#XFLD: Activity Type for time entry.\r\nTSA_ACTIVITY_TYPE=Type d\'activit\\u00E9\r\n\r\n#XFLD: Starttime  for time entry.\r\nTSA_START_TIME=Heure de d\\u00E9but\r\n\r\n#XFLD: Endtime  for time entry.\r\nTSA_END_TIME=Heure de fin\r\n\r\n#XFLD: People for time entry Cost Assignment.\r\nTSA_PEOPLE=Personnes\r\n\r\n#XFLD: Actual hours  for time entry.\r\nTSA_ACTUAL_HOURS=Heures r\\u00E9elles\r\n\r\n#XFLD: Planned hours for time entry .\r\nTSA_PLANNED_HOURS=Heures th\\u00E9oriques\r\n\r\n#XTIT: Details  for time entry notes.\r\nTSA_DETAILS=D\\u00E9tails\r\n\r\n#XBUT\t: Close button for notes.\r\nTSA_CLOSE=Fermer\r\n\r\n#XFLD: No data available\r\nTSA_NO_DATA=Aucune donn\\u00E9e\r\n\r\n# YMSG: Loading\r\nLOADING=Chargement...\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=Aucun poste disponible actuellement\r\n',
	"hcm/mgr/approve/timesheet/i18n/i18n_hu.properties":'#XTIT,30: Application name\r\nAPP_TITLE=Id\\u0151adatlapok enged\\u00E9lyez\\u00E9se\r\n#XTIT,30:  Application name\r\nTSA_APP_TITLE=Id\\u0151adatlapok enged\\u00E9lyez\\u00E9se\r\n#XTIT,30:  Application name\r\nMASTER_TITLE=Id\\u0151adatlapok ({0})\r\n#XTIT,30:  Application name\r\nTSA_APP=Id\\u0151adatlap\r\n#XTIT,30: detail panel text\r\nDETAIL_TITLE=Id\\u0151adatlap\r\n#XBUT,9: Button Approve\r\nTSA_APPROVE=Enged.\r\n#XBUT,8: Button to Navigate back&nbsp;\\\\\\&nbsp;\r\nTSA_BACK=Vissza\r\n#XFLD: Week for which the timesheet is entered\r\nTSA_WEEK=H\\u00E9t\r\n#XFLD: No hours entered by the employee\r\nTSA_HOUR=\\u00D3ra\r\n#XFLD: for\r\nTSA_FOR=R\\u00E9sz\\u00E9re\\:\r\n#XBUT:Button to Send after the Timesheet is approved &nbsp;\\\\\\&nbsp;\r\nTSA_SUBMIT=K\\u00FCld\\u00E9s\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=Nem siker\\u00FClt lek\\u00E9rni az id\\u0151adatlap-bejegyz\\u00E9sek list\\u00E1j\\u00E1t\r\n#YMSG: Message for Successful updation\r\nCATS_SUCCESS_MESSAGE=Id\\u0151adatlap-bejegyz\\u00E9sek aktualiz\\u00E1lva\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=Id\\u0151adatlap enged\\u00E9lyez\\u00E9se\r\n#XFLD: Link for manager to see employee notes\r\nSHOW_NOTE=Megjegyz\\u00E9sek megjelen\\u00EDt\\u00E9se\r\n\r\n#XFLD: Link for manager to hide employee notes\r\nHIDE_NOTE=Megjegyz\\u00E9sek elrejt\\u00E9se\r\n\r\n#XTIT: Title for employee notes\r\nEMP_NOTE=Dolgoz\\u00F3i megjegyz\\u00E9sek\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_EMP_NOTE=Dolgoz\\u00F3i megjegyz\\u00E9sek\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_COST_ASSGNT=K\\u00F6lts\\u00E9g-hozz\\u00E1rendel\\u00E9s\r\n\r\n#XFLD: Column header for activity\r\nTSA_ACTIVITY=Tev\\u00E9kenys\\u00E9g\r\n\r\n#XFLD: Column header for time\r\nTSA_TIME=Id\\u0151pont\r\n\r\n#XFLD: Column header for date\r\nTSA_DATE=D\\u00E1tum\r\n\r\n#XFLD: Column header for activity\r\nTSA_REJECTION_REASON=Elutas\\u00EDt\\u00E1s indoka\r\n\r\n#XTIT: Title for list of rejection reasons\r\nTSA_TIT_REJECTION_REASON=Elutas\\u00EDt\\u00E1s indoka\r\n\r\n#XTIT: Field to Specify the Total hours\r\nTSA_TARGET=C\\u00E9l\r\n\r\n#XTIT: Message for submit confirmation\r\nTSA_CONF=Elk\\u00FCldi az enged\\u00E9lyez\\u00E9si d\\u00F6nt\\u00E9st?\r\n\r\n#XTIT: title for submit confirmation\r\nTSA_CONF_HEADER=Meger\\u0151s\\u00EDt\\u00E9s\r\n\r\n#XBUT: button to confirm submit\r\nTSA_ACCEPT=OK\r\n\r\n#XBUT: Cancel button for Rejection Reason\r\nTSA_CANCEL=M\\u00E9gse\r\n\r\n#XLNK: link to show for employee and week\r\nTSA_SHOW=Megjelen\\u00EDt\\u00E9s\r\n\r\n#XLNK: link to hide for employee and week\r\nTSA_HIDE=Elrejt\\u00E9s\r\n\r\n#XFLD: Weeks for which the timesheet is more than one week for employee\r\nTSA_WEEKS=H\\u00E9t\r\n\r\n#XFLD: Overtime for Timesheet entered for a employee.\r\nTSA_OVERTIME=T\\u00FAl\\u00F3ra\r\n\r\n#XFLD: Regular time for Timesheet entered for a employee.\r\nTSA_REGULARTIME=Rendes munkaid\\u0151\r\n\r\n#XFLD: Recorded Time for employee.\r\nTSA_RECORDED=R\\u00F6gz\\u00EDtett\r\n\r\n#XFLD: Completed percentage for employee Timesheet.\r\nTSA_COMPLETED=Befejezve\r\n\r\n#XFLD: Hour in short form.\r\nTSA_HOUR_SHORT=\\u00F3\r\n\r\n#XFLD: Minutes in short form.\r\nTSA_MIN_SHORT=p\r\n\r\n#XFLD: Notes for time entry.\r\nTSA_NOTE=Megjegyz\\u00E9s\r\n\r\n#XFLD: Wage Type for time entry.\r\nTSA_WAGE_TYPE=B\\u00E9rfajta\r\n\r\n#XFLD: Activity Type for time entry.\r\nTSA_ACTIVITY_TYPE=Tev\\u00E9kenys\\u00E9g t\\u00EDpusa\r\n\r\n#XFLD: Starttime  for time entry.\r\nTSA_START_TIME=Kezd\\u00E9s id\\u0151pontja\r\n\r\n#XFLD: Endtime  for time entry.\r\nTSA_END_TIME=Befejez\\u00E9s id\\u0151pontja\r\n\r\n#XFLD: People for time entry Cost Assignment.\r\nTSA_PEOPLE=Szem\\u00E9ly\r\n\r\n#XFLD: Actual hours  for time entry.\r\nTSA_ACTUAL_HOURS=T\\u00E9nyleges \\u00F3r\\u00E1k\r\n\r\n#XFLD: Planned hours for time entry .\r\nTSA_PLANNED_HOURS=Tervezett \\u00F3r\\u00E1k\r\n\r\n#XTIT: Details  for time entry notes.\r\nTSA_DETAILS=R\\u00E9szletek\r\n\r\n#XBUT\t: Close button for notes.\r\nTSA_CLOSE=Bez\\u00E1r\\u00E1s\r\n\r\n#XFLD: No data available\r\nTSA_NO_DATA=Nincs adat\r\n\r\n# YMSG: Loading\r\nLOADING=Bet\\u00F6lt\\u00E9s...\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=Jelenleg nem \\u00E1ll rendelkez\\u00E9sre t\\u00E9tel\r\n',
	"hcm/mgr/approve/timesheet/i18n/i18n_it.properties":'#XTIT,30: Application name\r\nAPP_TITLE=Approva il mio timesheet\r\n#XTIT,30:  Application name\r\nTSA_APP_TITLE=Approva il mio timesheet\r\n#XTIT,30:  Application name\r\nMASTER_TITLE=Timesheets ({0})\r\n#XTIT,30:  Application name\r\nTSA_APP=Timesheet\r\n#XTIT,30: detail panel text\r\nDETAIL_TITLE=Timesheet\r\n#XBUT,9: Button Approve\r\nTSA_APPROVE=Approva\r\n#XBUT,8: Button to Navigate back&nbsp;\\\\\\&nbsp;\r\nTSA_BACK=Indietro\r\n#XFLD: Week for which the timesheet is entered\r\nTSA_WEEK=Settimana\r\n#XFLD: No hours entered by the employee\r\nTSA_HOUR=Ora\r\n#XFLD: for\r\nTSA_FOR=Per\r\n#XBUT:Button to Send after the Timesheet is approved &nbsp;\\\\\\&nbsp;\r\nTSA_SUBMIT=Invia\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=Impossibile ottenere la lista di inserimenti timesheet\r\n#YMSG: Message for Successful updation\r\nCATS_SUCCESS_MESSAGE=Inserimenti timesheet aggiornati\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=Approvazione del timesheet\r\n#XFLD: Link for manager to see employee notes\r\nSHOW_NOTE=Visualizza note\r\n\r\n#XFLD: Link for manager to hide employee notes\r\nHIDE_NOTE=Nascondi note\r\n\r\n#XTIT: Title for employee notes\r\nEMP_NOTE=Note del dipendente\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_EMP_NOTE=Note del dipendente\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_COST_ASSGNT=Attribuzione costi\r\n\r\n#XFLD: Column header for activity\r\nTSA_ACTIVITY=Attivit\\u00E0\r\n\r\n#XFLD: Column header for time\r\nTSA_TIME=Ora\r\n\r\n#XFLD: Column header for date\r\nTSA_DATE=Data\r\n\r\n#XFLD: Column header for activity\r\nTSA_REJECTION_REASON=Motivo rifiuto\r\n\r\n#XTIT: Title for list of rejection reasons\r\nTSA_TIT_REJECTION_REASON=Motivo rifiuto\r\n\r\n#XTIT: Field to Specify the Total hours\r\nTSA_TARGET=Obiettivo\r\n\r\n#XTIT: Message for submit confirmation\r\nTSA_CONF=Inviare la decisione per l\'approvazione?\r\n\r\n#XTIT: title for submit confirmation\r\nTSA_CONF_HEADER=Conferma\r\n\r\n#XBUT: button to confirm submit\r\nTSA_ACCEPT=OK\r\n\r\n#XBUT: Cancel button for Rejection Reason\r\nTSA_CANCEL=Annulla\r\n\r\n#XLNK: link to show for employee and week\r\nTSA_SHOW=Visualizza\r\n\r\n#XLNK: link to hide for employee and week\r\nTSA_HIDE=Nascondi\r\n\r\n#XFLD: Weeks for which the timesheet is more than one week for employee\r\nTSA_WEEKS=Settimane\r\n\r\n#XFLD: Overtime for Timesheet entered for a employee.\r\nTSA_OVERTIME=Straordinario\r\n\r\n#XFLD: Regular time for Timesheet entered for a employee.\r\nTSA_REGULARTIME=Orario regolare\r\n\r\n#XFLD: Recorded Time for employee.\r\nTSA_RECORDED=Registrato\r\n\r\n#XFLD: Completed percentage for employee Timesheet.\r\nTSA_COMPLETED=Completato\r\n\r\n#XFLD: Hour in short form.\r\nTSA_HOUR_SHORT=h\r\n\r\n#XFLD: Minutes in short form.\r\nTSA_MIN_SHORT=m\r\n\r\n#XFLD: Notes for time entry.\r\nTSA_NOTE=Nota\r\n\r\n#XFLD: Wage Type for time entry.\r\nTSA_WAGE_TYPE=Voce retributiva\r\n\r\n#XFLD: Activity Type for time entry.\r\nTSA_ACTIVITY_TYPE=Tipo di attivit\\u00E0\r\n\r\n#XFLD: Starttime  for time entry.\r\nTSA_START_TIME=Ora di inizio\r\n\r\n#XFLD: Endtime  for time entry.\r\nTSA_END_TIME=Ora di fine\r\n\r\n#XFLD: People for time entry Cost Assignment.\r\nTSA_PEOPLE=Persone\r\n\r\n#XFLD: Actual hours  for time entry.\r\nTSA_ACTUAL_HOURS=Ore effettive\r\n\r\n#XFLD: Planned hours for time entry .\r\nTSA_PLANNED_HOURS=Ore pianificate\r\n\r\n#XTIT: Details  for time entry notes.\r\nTSA_DETAILS=Dettagli\r\n\r\n#XBUT\t: Close button for notes.\r\nTSA_CLOSE=Chiudi\r\n\r\n#XFLD: No data available\r\nTSA_NO_DATA=Nessun dato\r\n\r\n# YMSG: Loading\r\nLOADING=In caricamento...\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=Nessuna posizione attualmente disponibile\r\n',
	"hcm/mgr/approve/timesheet/i18n/i18n_iw.properties":'#XTIT,30: Application name\r\nAPP_TITLE=\\u05D0\\u05E9\\u05E8 \\u05D2\\u05D9\\u05DC\\u05D9\\u05D5\\u05E0\\u05D5\\u05EA \\u05E9\\u05E2\\u05D5\\u05EA\r\n#XTIT,30:  Application name\r\nTSA_APP_TITLE=\\u05D0\\u05E9\\u05E8 \\u05D2\\u05D9\\u05DC\\u05D9\\u05D5\\u05E0\\u05D5\\u05EA \\u05E9\\u05E2\\u05D5\\u05EA\r\n#XTIT,30:  Application name\r\nMASTER_TITLE=\\u05D2\\u05D9\\u05DC\\u05D9\\u05D5\\u05E0\\u05D5\\u05EA \\u05E9\\u05E2\\u05D5\\u05EA ({0})\r\n#XTIT,30:  Application name\r\nTSA_APP=\\u05D2\\u05D9\\u05DC\\u05D9\\u05D5\\u05DF \\u05E9\\u05E2\\u05D5\\u05EA\r\n#XTIT,30: detail panel text\r\nDETAIL_TITLE=\\u05D2\\u05D9\\u05DC\\u05D9\\u05D5\\u05DF \\u05E9\\u05E2\\u05D5\\u05EA\r\n#XBUT,9: Button Approve\r\nTSA_APPROVE=\\u05D0\\u05E9\\u05E8\r\n#XBUT,8: Button to Navigate back&nbsp;\\\\\\&nbsp;\r\nTSA_BACK=\\u05D7\\u05D6\\u05D5\\u05E8\r\n#XFLD: Week for which the timesheet is entered\r\nTSA_WEEK=\\u05E9\\u05D1\\u05D5\\u05E2\r\n#XFLD: No hours entered by the employee\r\nTSA_HOUR=\\u05E9\\u05E2\\u05D4\r\n#XFLD: for\r\nTSA_FOR=\\u05E2\\u05D1\\u05D5\\u05E8\r\n#XBUT:Button to Send after the Timesheet is approved &nbsp;\\\\\\&nbsp;\r\nTSA_SUBMIT=\\u05E9\\u05DC\\u05D7\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=\\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05D4\\u05D9\\u05D4 \\u05DC\\u05D4\\u05E9\\u05D9\\u05D2 \\u05D0\\u05EA \\u05E8\\u05E9\\u05D9\\u05DE\\u05EA \\u05D4\\u05D4\\u05D6\\u05E0\\u05D5\\u05EA \\u05E9\\u05DC \\u05D2\\u05D9\\u05DC\\u05D9\\u05D5\\u05DF \\u05D4\\u05E9\\u05E2\\u05D5\\u05EA\r\n#YMSG: Message for Successful updation\r\nCATS_SUCCESS_MESSAGE=\\u05D4\\u05D4\\u05D6\\u05E0\\u05D5\\u05EA \\u05E9\\u05DC \\u05D2\\u05D9\\u05DC\\u05D9\\u05D5\\u05DF \\u05D4\\u05E9\\u05E2\\u05D5\\u05EA \\u05E2\\u05D5\\u05D3\\u05DB\\u05E0\\u05D5\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=\\u05D0\\u05D9\\u05E9\\u05D5\\u05E8 \\u05D2\\u05D9\\u05DC\\u05D9\\u05D5\\u05DF \\u05E9\\u05E2\\u05D5\\u05EA\r\n#XFLD: Link for manager to see employee notes\r\nSHOW_NOTE=\\u05D4\\u05E6\\u05D2 \\u05D4\\u05E2\\u05E8\\u05D5\\u05EA\r\n\r\n#XFLD: Link for manager to hide employee notes\r\nHIDE_NOTE=\\u05D4\\u05E1\\u05EA\\u05E8 \\u05D4\\u05E2\\u05E8\\u05D5\\u05EA\r\n\r\n#XTIT: Title for employee notes\r\nEMP_NOTE=\\u05D4\\u05E2\\u05E8\\u05D5\\u05EA \\u05E9\\u05DC \\u05E2\\u05D5\\u05D1\\u05D3\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_EMP_NOTE=\\u05D4\\u05E2\\u05E8\\u05D5\\u05EA \\u05E9\\u05DC \\u05E2\\u05D5\\u05D1\\u05D3\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_COST_ASSGNT=\\u05D4\\u05E7\\u05E6\\u05D0\\u05EA \\u05E2\\u05DC\\u05D5\\u05D9\\u05D5\\u05EA\r\n\r\n#XFLD: Column header for activity\r\nTSA_ACTIVITY=\\u05E4\\u05E2\\u05D9\\u05DC\\u05D5\\u05EA\r\n\r\n#XFLD: Column header for time\r\nTSA_TIME=\\u05E9\\u05E2\\u05D4\r\n\r\n#XFLD: Column header for date\r\nTSA_DATE=\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA\r\n\r\n#XFLD: Column header for activity\r\nTSA_REJECTION_REASON=\\u05E1\\u05D9\\u05D1\\u05D4 \\u05DC\\u05D3\\u05D7\\u05D9\\u05D9\\u05D4\r\n\r\n#XTIT: Title for list of rejection reasons\r\nTSA_TIT_REJECTION_REASON=\\u05E1\\u05D9\\u05D1\\u05D4 \\u05DC\\u05D3\\u05D7\\u05D9\\u05D9\\u05D4\r\n\r\n#XTIT: Field to Specify the Total hours\r\nTSA_TARGET=\\u05D9\\u05E2\\u05D3\r\n\r\n#XTIT: Message for submit confirmation\r\nTSA_CONF=\\u05D4\\u05D0\\u05DD \\u05DC\\u05D4\\u05D2\\u05D9\\u05E9 \\u05D0\\u05EA \\u05D4\\u05D7\\u05DC\\u05D8\\u05EA \\u05D4\\u05D0\\u05D9\\u05E9\\u05D5\\u05E8 \\u05E9\\u05DC\\u05DA?\r\n\r\n#XTIT: title for submit confirmation\r\nTSA_CONF_HEADER=\\u05D0\\u05D9\\u05E9\\u05D5\\u05E8\r\n\r\n#XBUT: button to confirm submit\r\nTSA_ACCEPT=OK\r\n\r\n#XBUT: Cancel button for Rejection Reason\r\nTSA_CANCEL=\\u05D1\\u05D8\\u05DC\r\n\r\n#XLNK: link to show for employee and week\r\nTSA_SHOW=\\u05D4\\u05E6\\u05D2\r\n\r\n#XLNK: link to hide for employee and week\r\nTSA_HIDE=\\u05D4\\u05E1\\u05EA\\u05E8\r\n\r\n#XFLD: Weeks for which the timesheet is more than one week for employee\r\nTSA_WEEKS=\\u05E9\\u05D1\\u05D5\\u05E2\\u05D5\\u05EA\r\n\r\n#XFLD: Overtime for Timesheet entered for a employee.\r\nTSA_OVERTIME=\\u05E9\\u05E2\\u05D5\\u05EA \\u05E0\\u05D5\\u05E1\\u05E4\\u05D5\\u05EA\r\n\r\n#XFLD: Regular time for Timesheet entered for a employee.\r\nTSA_REGULARTIME=\\u05E9\\u05E2\\u05D5\\u05EA \\u05E8\\u05D2\\u05D9\\u05DC\\u05D5\\u05EA\r\n\r\n#XFLD: Recorded Time for employee.\r\nTSA_RECORDED=\\u05E0\\u05E8\\u05E9\\u05DE\\u05D5\r\n\r\n#XFLD: Completed percentage for employee Timesheet.\r\nTSA_COMPLETED=\\u05D4\\u05D5\\u05E9\\u05DC\\u05DD\r\n\r\n#XFLD: Hour in short form.\r\nTSA_HOUR_SHORT=\\u05E9\r\n\r\n#XFLD: Minutes in short form.\r\nTSA_MIN_SHORT=\\u05D3\r\n\r\n#XFLD: Notes for time entry.\r\nTSA_NOTE=\\u05D4\\u05E2\\u05E8\\u05D4\r\n\r\n#XFLD: Wage Type for time entry.\r\nTSA_WAGE_TYPE=\\u05E8\\u05DB\\u05D9\\u05D1 \\u05E9\\u05DB\\u05E8\r\n\r\n#XFLD: Activity Type for time entry.\r\nTSA_ACTIVITY_TYPE=\\u05E1\\u05D5\\u05D2 \\u05E4\\u05E2\\u05D9\\u05DC\\u05D5\\u05EA\r\n\r\n#XFLD: Starttime  for time entry.\r\nTSA_START_TIME=\\u05E9\\u05E2\\u05EA \\u05D4\\u05EA\\u05D7\\u05DC\\u05D4\r\n\r\n#XFLD: Endtime  for time entry.\r\nTSA_END_TIME=\\u05E9\\u05E2\\u05EA \\u05E1\\u05D9\\u05D5\\u05DD\r\n\r\n#XFLD: People for time entry Cost Assignment.\r\nTSA_PEOPLE=\\u05D0\\u05E0\\u05E9\\u05D9\\u05DD\r\n\r\n#XFLD: Actual hours  for time entry.\r\nTSA_ACTUAL_HOURS=\\u05E9\\u05E2\\u05D5\\u05EA \\u05D1\\u05E4\\u05D5\\u05E2\\u05DC\r\n\r\n#XFLD: Planned hours for time entry .\r\nTSA_PLANNED_HOURS=\\u05E9\\u05E2\\u05D5\\u05EA \\u05DE\\u05EA\\u05D5\\u05DB\\u05E0\\u05E0\\u05D5\\u05EA\r\n\r\n#XTIT: Details  for time entry notes.\r\nTSA_DETAILS=\\u05E4\\u05E8\\u05D8\\u05D9\\u05DD\r\n\r\n#XBUT\t: Close button for notes.\r\nTSA_CLOSE=\\u05E1\\u05D2\\u05D5\\u05E8\r\n\r\n#XFLD: No data available\r\nTSA_NO_DATA=\\u05D0\\u05D9\\u05DF \\u05E0\\u05EA\\u05D5\\u05E0\\u05D9\\u05DD\r\n\r\n# YMSG: Loading\r\nLOADING=\\u05D8\\u05D5\\u05E2\\u05DF...\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=\\u05D0\\u05D9\\u05DF \\u05DB\\u05E8\\u05D2\\u05E2 \\u05E4\\u05E8\\u05D9\\u05D8\\u05D9\\u05DD \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD\r\n',
	"hcm/mgr/approve/timesheet/i18n/i18n_ja.properties":'#XTIT,30: Application name\r\nAPP_TITLE=\\u30BF\\u30A4\\u30E0\\u30B7\\u30FC\\u30C8\\u627F\\u8A8D\r\n#XTIT,30:  Application name\r\nTSA_APP_TITLE=\\u30BF\\u30A4\\u30E0\\u30B7\\u30FC\\u30C8\\u627F\\u8A8D\r\n#XTIT,30:  Application name\r\nMASTER_TITLE=\\u30BF\\u30A4\\u30E0\\u30B7\\u30FC\\u30C8 ({0})\r\n#XTIT,30:  Application name\r\nTSA_APP=\\u30BF\\u30A4\\u30E0\\u30B7\\u30FC\\u30C8\r\n#XTIT,30: detail panel text\r\nDETAIL_TITLE=\\u30BF\\u30A4\\u30E0\\u30B7\\u30FC\\u30C8\r\n#XBUT,9: Button Approve\r\nTSA_APPROVE=\\u627F\\u8A8D\r\n#XBUT,8: Button to Navigate back&nbsp;\\\\\\&nbsp;\r\nTSA_BACK=\\u524D\\u753B\\u9762\r\n#XFLD: Week for which the timesheet is entered\r\nTSA_WEEK=\\u9031\r\n#XFLD: No hours entered by the employee\r\nTSA_HOUR=\\u6642\\u9593\r\n#XFLD: for\r\nTSA_FOR=\\u5BFE\\u8C61\r\n#XBUT:Button to Send after the Timesheet is approved &nbsp;\\\\\\&nbsp;\r\nTSA_SUBMIT=\\u9001\\u4FE1\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=\\u30BF\\u30A4\\u30E0\\u30B7\\u30FC\\u30C8\\u30A8\\u30F3\\u30C8\\u30EA\\u306E\\u4E00\\u89A7\\u3092\\u53D6\\u5F97\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n#YMSG: Message for Successful updation\r\nCATS_SUCCESS_MESSAGE=\\u30BF\\u30A4\\u30E0\\u30B7\\u30FC\\u30C8\\u30A8\\u30F3\\u30C8\\u30EA\\u304C\\u66F4\\u65B0\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=\\u30BF\\u30A4\\u30E0\\u30B7\\u30FC\\u30C8\\u627F\\u8A8D\r\n#XFLD: Link for manager to see employee notes\r\nSHOW_NOTE=\\u30E1\\u30E2\\u8868\\u793A\r\n\r\n#XFLD: Link for manager to hide employee notes\r\nHIDE_NOTE=\\u30E1\\u30E2\\u975E\\u8868\\u793A\r\n\r\n#XTIT: Title for employee notes\r\nEMP_NOTE=\\u5F93\\u696D\\u54E1\\u30E1\\u30E2\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_EMP_NOTE=\\u5F93\\u696D\\u54E1\\u30E1\\u30E2\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_COST_ASSGNT=\\u539F\\u4FA1\\u8CA0\\u62C5\\u914D\\u5206\r\n\r\n#XFLD: Column header for activity\r\nTSA_ACTIVITY=\\u6D3B\\u52D5\r\n\r\n#XFLD: Column header for time\r\nTSA_TIME=\\u6642\\u9593\r\n\r\n#XFLD: Column header for date\r\nTSA_DATE=\\u65E5\\u4ED8\r\n\r\n#XFLD: Column header for activity\r\nTSA_REJECTION_REASON=\\u5374\\u4E0B\\u7406\\u7531\r\n\r\n#XTIT: Title for list of rejection reasons\r\nTSA_TIT_REJECTION_REASON=\\u5374\\u4E0B\\u7406\\u7531\r\n\r\n#XTIT: Field to Specify the Total hours\r\nTSA_TARGET=\\u30BF\\u30FC\\u30B2\\u30C3\\u30C8\r\n\r\n#XTIT: Message for submit confirmation\r\nTSA_CONF=\\u627F\\u8A8D\\u6C7A\\u5B9A\\u3092\\u9001\\u4FE1\\u3057\\u307E\\u3059\\u304B\\u3002\r\n\r\n#XTIT: title for submit confirmation\r\nTSA_CONF_HEADER=\\u78BA\\u8A8D\r\n\r\n#XBUT: button to confirm submit\r\nTSA_ACCEPT=OK\r\n\r\n#XBUT: Cancel button for Rejection Reason\r\nTSA_CANCEL=\\u4E2D\\u6B62\r\n\r\n#XLNK: link to show for employee and week\r\nTSA_SHOW=\\u8868\\u793A\r\n\r\n#XLNK: link to hide for employee and week\r\nTSA_HIDE=\\u975E\\u8868\\u793A\r\n\r\n#XFLD: Weeks for which the timesheet is more than one week for employee\r\nTSA_WEEKS=\\u9031\r\n\r\n#XFLD: Overtime for Timesheet entered for a employee.\r\nTSA_OVERTIME=\\u6642\\u9593\\u5916\\u52B4\\u50CD\r\n\r\n#XFLD: Regular time for Timesheet entered for a employee.\r\nTSA_REGULARTIME=\\u898F\\u5B9A\\u6642\\u9593\r\n\r\n#XFLD: Recorded Time for employee.\r\nTSA_RECORDED=\\u8A18\\u9332\r\n\r\n#XFLD: Completed percentage for employee Timesheet.\r\nTSA_COMPLETED=\\u7D42\\u4E86\r\n\r\n#XFLD: Hour in short form.\r\nTSA_HOUR_SHORT=\\u6642\\u9593\r\n\r\n#XFLD: Minutes in short form.\r\nTSA_MIN_SHORT=\\u5206\r\n\r\n#XFLD: Notes for time entry.\r\nTSA_NOTE=\\u30E1\\u30E2\r\n\r\n#XFLD: Wage Type for time entry.\r\nTSA_WAGE_TYPE=\\u30A6\\u30A7\\u30A4\\u30B8\\u30BF\\u30A4\\u30D7\r\n\r\n#XFLD: Activity Type for time entry.\r\nTSA_ACTIVITY_TYPE=\\u6D3B\\u52D5\\u30BF\\u30A4\\u30D7\r\n\r\n#XFLD: Starttime  for time entry.\r\nTSA_START_TIME=\\u958B\\u59CB\\u6642\\u523B\r\n\r\n#XFLD: Endtime  for time entry.\r\nTSA_END_TIME=\\u7D42\\u4E86\\u6642\\u523B\r\n\r\n#XFLD: People for time entry Cost Assignment.\r\nTSA_PEOPLE=\\u30E6\\u30FC\\u30B6\r\n\r\n#XFLD: Actual hours  for time entry.\r\nTSA_ACTUAL_HOURS=\\u5B9F\\u7E3E\\u6642\\u9593\r\n\r\n#XFLD: Planned hours for time entry .\r\nTSA_PLANNED_HOURS=\\u4E88\\u5B9A\\u6642\\u9593\r\n\r\n#XTIT: Details  for time entry notes.\r\nTSA_DETAILS=\\u8A73\\u7D30\r\n\r\n#XBUT\t: Close button for notes.\r\nTSA_CLOSE=\\u9589\\u3058\\u308B\r\n\r\n#XFLD: No data available\r\nTSA_NO_DATA=\\u30C7\\u30FC\\u30BF\\u306A\\u3057\r\n\r\n# YMSG: Loading\r\nLOADING=\\u30ED\\u30FC\\u30C9\\u4E2D...\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=\\u73FE\\u5728\\u5229\\u7528\\u3067\\u304D\\u308B\\u30A2\\u30A4\\u30C6\\u30E0\\u306F\\u3042\\u308A\\u307E\\u305B\\u3093\r\n',
	"hcm/mgr/approve/timesheet/i18n/i18n_no.properties":'#XTIT,30: Application name\r\nAPP_TITLE=Godkjenn tidsregistreringer\r\n#XTIT,30:  Application name\r\nTSA_APP_TITLE=Godkjenn tidsregistreringer\r\n#XTIT,30:  Application name\r\nMASTER_TITLE=Tidsregistreringer ({0})\r\n#XTIT,30:  Application name\r\nTSA_APP=Tidsregistrering\r\n#XTIT,30: detail panel text\r\nDETAIL_TITLE=Tidsregistrering\r\n#XBUT,9: Button Approve\r\nTSA_APPROVE=Godkjenn\r\n#XBUT,8: Button to Navigate back&nbsp;\\\\\\&nbsp;\r\nTSA_BACK=Tilbake\r\n#XFLD: Week for which the timesheet is entered\r\nTSA_WEEK=Uke\r\n#XFLD: No hours entered by the employee\r\nTSA_HOUR=Time\r\n#XFLD: for\r\nTSA_FOR=For\r\n#XBUT:Button to Send after the Timesheet is approved &nbsp;\\\\\\&nbsp;\r\nTSA_SUBMIT=Send\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=Kan ikke hente liste over tidsregistringer\r\n#YMSG: Message for Successful updation\r\nCATS_SUCCESS_MESSAGE=Tidsregistringer oppdatert\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=Tidsreg.godkjenning\r\n#XFLD: Link for manager to see employee notes\r\nSHOW_NOTE=Vis merknader\r\n\r\n#XFLD: Link for manager to hide employee notes\r\nHIDE_NOTE=Skjul merknader\r\n\r\n#XTIT: Title for employee notes\r\nEMP_NOTE=Medarbeidermerknader\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_EMP_NOTE=Medarbeidermerknader\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_COST_ASSGNT=Kostnadstilordning\r\n\r\n#XFLD: Column header for activity\r\nTSA_ACTIVITY=Aktivitet\r\n\r\n#XFLD: Column header for time\r\nTSA_TIME=Klokkeslett\r\n\r\n#XFLD: Column header for date\r\nTSA_DATE=Dato\r\n\r\n#XFLD: Column header for activity\r\nTSA_REJECTION_REASON=Avvisningsgrunn\r\n\r\n#XTIT: Title for list of rejection reasons\r\nTSA_TIT_REJECTION_REASON=Avvisningsgrunn\r\n\r\n#XTIT: Field to Specify the Total hours\r\nTSA_TARGET=M\\u00E5l\r\n\r\n#XTIT: Message for submit confirmation\r\nTSA_CONF=Vil du sende godkjenningsbeslutning?\r\n\r\n#XTIT: title for submit confirmation\r\nTSA_CONF_HEADER=Bekreftelse\r\n\r\n#XBUT: button to confirm submit\r\nTSA_ACCEPT=OK\r\n\r\n#XBUT: Cancel button for Rejection Reason\r\nTSA_CANCEL=Avbryt\r\n\r\n#XLNK: link to show for employee and week\r\nTSA_SHOW=Vis\r\n\r\n#XLNK: link to hide for employee and week\r\nTSA_HIDE=Skjul\r\n\r\n#XFLD: Weeks for which the timesheet is more than one week for employee\r\nTSA_WEEKS=Uker\r\n\r\n#XFLD: Overtime for Timesheet entered for a employee.\r\nTSA_OVERTIME=Overtid\r\n\r\n#XFLD: Regular time for Timesheet entered for a employee.\r\nTSA_REGULARTIME=Vanlig arbeidstid\r\n\r\n#XFLD: Recorded Time for employee.\r\nTSA_RECORDED=Registrert\r\n\r\n#XFLD: Completed percentage for employee Timesheet.\r\nTSA_COMPLETED=Fullf\\u00F8rt\r\n\r\n#XFLD: Hour in short form.\r\nTSA_HOUR_SHORT=h\r\n\r\n#XFLD: Minutes in short form.\r\nTSA_MIN_SHORT=m\r\n\r\n#XFLD: Notes for time entry.\r\nTSA_NOTE=Merknad\r\n\r\n#XFLD: Wage Type for time entry.\r\nTSA_WAGE_TYPE=L\\u00F8nnart\r\n\r\n#XFLD: Activity Type for time entry.\r\nTSA_ACTIVITY_TYPE=Aktivitetstype\r\n\r\n#XFLD: Starttime  for time entry.\r\nTSA_START_TIME=Starttidspunkt\r\n\r\n#XFLD: Endtime  for time entry.\r\nTSA_END_TIME=Sluttidspunkt\r\n\r\n#XFLD: People for time entry Cost Assignment.\r\nTSA_PEOPLE=Personer\r\n\r\n#XFLD: Actual hours  for time entry.\r\nTSA_ACTUAL_HOURS=Faktiske timer\r\n\r\n#XFLD: Planned hours for time entry .\r\nTSA_PLANNED_HOURS=Planlagte timer\r\n\r\n#XTIT: Details  for time entry notes.\r\nTSA_DETAILS=Detaljer\r\n\r\n#XBUT\t: Close button for notes.\r\nTSA_CLOSE=Lukk\r\n\r\n#XFLD: No data available\r\nTSA_NO_DATA=Ingen data\r\n\r\n# YMSG: Loading\r\nLOADING=Laster ...\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=Ingen posisjoner er for \\u00F8yeblikket tilgjengelige\r\n',
	"hcm/mgr/approve/timesheet/i18n/i18n_pl.properties":'#XTIT,30: Application name\r\nAPP_TITLE=Zatwierdzanie czas\\u00F3w\r\n#XTIT,30:  Application name\r\nTSA_APP_TITLE=Zatwierdzanie czas\\u00F3w\r\n#XTIT,30:  Application name\r\nMASTER_TITLE=Ark. czasu pracy ({0})\r\n#XTIT,30:  Application name\r\nTSA_APP=Rejestracja czasu\r\n#XTIT,30: detail panel text\r\nDETAIL_TITLE=Rejestracja czasu\r\n#XBUT,9: Button Approve\r\nTSA_APPROVE=Zatw.\r\n#XBUT,8: Button to Navigate back&nbsp;\\\\\\&nbsp;\r\nTSA_BACK=Wr\\u00F3\\u0107\r\n#XFLD: Week for which the timesheet is entered\r\nTSA_WEEK=Tydzie\\u0144\r\n#XFLD: No hours entered by the employee\r\nTSA_HOUR=Godzina\r\n#XFLD: for\r\nTSA_FOR=Dla\r\n#XBUT:Button to Send after the Timesheet is approved &nbsp;\\\\\\&nbsp;\r\nTSA_SUBMIT=Wy\\u015Blij\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=Nie mo\\u017Cna uzyska\\u0107 listy wpis\\u00F3w rejestracji czasu\r\n#YMSG: Message for Successful updation\r\nCATS_SUCCESS_MESSAGE=Zaktualizowano wpisy rejestracji czasu\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=Zatwierdzanie zarejestrowanych czas\\u00F3w\r\n#XFLD: Link for manager to see employee notes\r\nSHOW_NOTE=Wy\\u015Bwietl notatki\r\n\r\n#XFLD: Link for manager to hide employee notes\r\nHIDE_NOTE=Ukryj notatki\r\n\r\n#XTIT: Title for employee notes\r\nEMP_NOTE=Notatki pracownika\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_EMP_NOTE=Notatki pracownika\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_COST_ASSGNT=Przypisanie koszt\\u00F3w\r\n\r\n#XFLD: Column header for activity\r\nTSA_ACTIVITY=Dzia\\u0142anie\r\n\r\n#XFLD: Column header for time\r\nTSA_TIME=Czas\r\n\r\n#XFLD: Column header for date\r\nTSA_DATE=Data\r\n\r\n#XFLD: Column header for activity\r\nTSA_REJECTION_REASON=Pow\\u00F3d odrzucenia\r\n\r\n#XTIT: Title for list of rejection reasons\r\nTSA_TIT_REJECTION_REASON=Pow\\u00F3d odrzucenia\r\n\r\n#XTIT: Field to Specify the Total hours\r\nTSA_TARGET=Cel\r\n\r\n#XTIT: Message for submit confirmation\r\nTSA_CONF=Przes\\u0142a\\u0107 decyzj\\u0119 o zatwierdzeniu?\r\n\r\n#XTIT: title for submit confirmation\r\nTSA_CONF_HEADER=Potwierdzenie\r\n\r\n#XBUT: button to confirm submit\r\nTSA_ACCEPT=OK\r\n\r\n#XBUT: Cancel button for Rejection Reason\r\nTSA_CANCEL=Anuluj\r\n\r\n#XLNK: link to show for employee and week\r\nTSA_SHOW=Wy\\u015Bwietl\r\n\r\n#XLNK: link to hide for employee and week\r\nTSA_HIDE=Ukryj\r\n\r\n#XFLD: Weeks for which the timesheet is more than one week for employee\r\nTSA_WEEKS=Tygodnie\r\n\r\n#XFLD: Overtime for Timesheet entered for a employee.\r\nTSA_OVERTIME=Nadgodziny\r\n\r\n#XFLD: Regular time for Timesheet entered for a employee.\r\nTSA_REGULARTIME=Zwyk\\u0142y czas\r\n\r\n#XFLD: Recorded Time for employee.\r\nTSA_RECORDED=Zarejestrowany\r\n\r\n#XFLD: Completed percentage for employee Timesheet.\r\nTSA_COMPLETED=Uko\\u0144czono\r\n\r\n#XFLD: Hour in short form.\r\nTSA_HOUR_SHORT=godz.\r\n\r\n#XFLD: Minutes in short form.\r\nTSA_MIN_SHORT=min\r\n\r\n#XFLD: Notes for time entry.\r\nTSA_NOTE=Notatka\r\n\r\n#XFLD: Wage Type for time entry.\r\nTSA_WAGE_TYPE=Sk\\u0142adnik wynagrodzenia\r\n\r\n#XFLD: Activity Type for time entry.\r\nTSA_ACTIVITY_TYPE=Typ dzia\\u0142ania\r\n\r\n#XFLD: Starttime  for time entry.\r\nTSA_START_TIME=Czas rozpocz\\u0119cia\r\n\r\n#XFLD: Endtime  for time entry.\r\nTSA_END_TIME=Czas zako\\u0144czenia\r\n\r\n#XFLD: People for time entry Cost Assignment.\r\nTSA_PEOPLE=Osoby\r\n\r\n#XFLD: Actual hours  for time entry.\r\nTSA_ACTUAL_HOURS=Rzeczywiste godziny\r\n\r\n#XFLD: Planned hours for time entry .\r\nTSA_PLANNED_HOURS=Planowane godziny\r\n\r\n#XTIT: Details  for time entry notes.\r\nTSA_DETAILS=Szczeg\\u00F3\\u0142y\r\n\r\n#XBUT\t: Close button for notes.\r\nTSA_CLOSE=Zamknij\r\n\r\n#XFLD: No data available\r\nTSA_NO_DATA=Brak danych\r\n\r\n# YMSG: Loading\r\nLOADING=Wczytywanie...\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=Obecnie brak dost\\u0119pnych pozycji\r\n',
	"hcm/mgr/approve/timesheet/i18n/i18n_pt.properties":'#XTIT,30: Application name\r\nAPP_TITLE=Aprovar folhas de horas\r\n#XTIT,30:  Application name\r\nTSA_APP_TITLE=Aprovar folhas de horas\r\n#XTIT,30:  Application name\r\nMASTER_TITLE=Folhas de horas ({0})\r\n#XTIT,30:  Application name\r\nTSA_APP=Folha de horas de trabalho\r\n#XTIT,30: detail panel text\r\nDETAIL_TITLE=Folha de horas de trabalho\r\n#XBUT,9: Button Approve\r\nTSA_APPROVE=Aprovar\r\n#XBUT,8: Button to Navigate back&nbsp;\\\\\\&nbsp;\r\nTSA_BACK=Voltar\r\n#XFLD: Week for which the timesheet is entered\r\nTSA_WEEK=Semana\r\n#XFLD: No hours entered by the employee\r\nTSA_HOUR=Hora\r\n#XFLD: for\r\nTSA_FOR=Para\r\n#XBUT:Button to Send after the Timesheet is approved &nbsp;\\\\\\&nbsp;\r\nTSA_SUBMIT=Enviar\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=N\\u00E3o foi poss\\u00EDvel obter lista de entradas de folhas de horas\r\n#YMSG: Message for Successful updation\r\nCATS_SUCCESS_MESSAGE=Entradas de folhas de horas atualizadas\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=Aprova\\u00E7\\u00E3o da folha de horas\r\n#XFLD: Link for manager to see employee notes\r\nSHOW_NOTE=Exibir notas\r\n\r\n#XFLD: Link for manager to hide employee notes\r\nHIDE_NOTE=Ocultar notas\r\n\r\n#XTIT: Title for employee notes\r\nEMP_NOTE=Notas do funcion\\u00E1rio\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_EMP_NOTE=Notas do funcion\\u00E1rio\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_COST_ASSGNT=Atribui\\u00E7\\u00E3o de custos\r\n\r\n#XFLD: Column header for activity\r\nTSA_ACTIVITY=Atividade\r\n\r\n#XFLD: Column header for time\r\nTSA_TIME=Hor\\u00E1rio\r\n\r\n#XFLD: Column header for date\r\nTSA_DATE=Data\r\n\r\n#XFLD: Column header for activity\r\nTSA_REJECTION_REASON=Motivo de rejei\\u00E7\\u00E3o\r\n\r\n#XTIT: Title for list of rejection reasons\r\nTSA_TIT_REJECTION_REASON=Motivo de rejei\\u00E7\\u00E3o\r\n\r\n#XTIT: Field to Specify the Total hours\r\nTSA_TARGET=Destino\r\n\r\n#XTIT: Message for submit confirmation\r\nTSA_CONF=Enviar sua decis\\u00E3o de aprova\\u00E7\\u00E3o?\r\n\r\n#XTIT: title for submit confirmation\r\nTSA_CONF_HEADER=Confirma\\u00E7\\u00E3o\r\n\r\n#XBUT: button to confirm submit\r\nTSA_ACCEPT=OK\r\n\r\n#XBUT: Cancel button for Rejection Reason\r\nTSA_CANCEL=Anular\r\n\r\n#XLNK: link to show for employee and week\r\nTSA_SHOW=Exibir\r\n\r\n#XLNK: link to hide for employee and week\r\nTSA_HIDE=Ocultar\r\n\r\n#XFLD: Weeks for which the timesheet is more than one week for employee\r\nTSA_WEEKS=Semanas\r\n\r\n#XFLD: Overtime for Timesheet entered for a employee.\r\nTSA_OVERTIME=Horas extras\r\n\r\n#XFLD: Regular time for Timesheet entered for a employee.\r\nTSA_REGULARTIME=Hora regular\r\n\r\n#XFLD: Recorded Time for employee.\r\nTSA_RECORDED=Registrado\r\n\r\n#XFLD: Completed percentage for employee Timesheet.\r\nTSA_COMPLETED=Conclu\\u00EDdo\r\n\r\n#XFLD: Hour in short form.\r\nTSA_HOUR_SHORT=h\r\n\r\n#XFLD: Minutes in short form.\r\nTSA_MIN_SHORT=m\r\n\r\n#XFLD: Notes for time entry.\r\nTSA_NOTE=Nota\r\n\r\n#XFLD: Wage Type for time entry.\r\nTSA_WAGE_TYPE=Tipo de sal\\u00E1rio\r\n\r\n#XFLD: Activity Type for time entry.\r\nTSA_ACTIVITY_TYPE=Tipo de atividade\r\n\r\n#XFLD: Starttime  for time entry.\r\nTSA_START_TIME=Hora de in\\u00EDcio\r\n\r\n#XFLD: Endtime  for time entry.\r\nTSA_END_TIME=Hora de fim\r\n\r\n#XFLD: People for time entry Cost Assignment.\r\nTSA_PEOPLE=Pessoas\r\n\r\n#XFLD: Actual hours  for time entry.\r\nTSA_ACTUAL_HOURS=Horas reais\r\n\r\n#XFLD: Planned hours for time entry .\r\nTSA_PLANNED_HOURS=Horas planejadas\r\n\r\n#XTIT: Details  for time entry notes.\r\nTSA_DETAILS=Detalhes\r\n\r\n#XBUT\t: Close button for notes.\r\nTSA_CLOSE=Fechar\r\n\r\n#XFLD: No data available\r\nTSA_NO_DATA=Nenhum dado\r\n\r\n# YMSG: Loading\r\nLOADING=Carregando...\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=Nenhum item atualmente dispon\\u00EDvel\r\n',
	"hcm/mgr/approve/timesheet/i18n/i18n_ru.properties":'#XTIT,30: Application name\r\nAPP_TITLE=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435 \\u0442\\u0430\\u0431\\u0435\\u043B\\u0435\\u0439\r\n#XTIT,30:  Application name\r\nTSA_APP_TITLE=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435 \\u0442\\u0430\\u0431\\u0435\\u043B\\u0435\\u0439\r\n#XTIT,30:  Application name\r\nMASTER_TITLE=\\u0422\\u0430\\u0431\\u0435\\u043B\\u0438 ({0})\r\n#XTIT,30:  Application name\r\nTSA_APP=\\u0422\\u0430\\u0431\\u0435\\u043B\\u044C\r\n#XTIT,30: detail panel text\r\nDETAIL_TITLE=\\u0422\\u0430\\u0431\\u0435\\u043B\\u044C\r\n#XBUT,9: Button Approve\r\nTSA_APPROVE=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0434\\u0438\\u0442\\u044C\r\n#XBUT,8: Button to Navigate back&nbsp;\\\\\\&nbsp;\r\nTSA_BACK=\\u041D\\u0430\\u0437\\u0430\\u0434\r\n#XFLD: Week for which the timesheet is entered\r\nTSA_WEEK=\\u041D\\u0435\\u0434\\u0435\\u043B\\u044F\r\n#XFLD: No hours entered by the employee\r\nTSA_HOUR=\\u0427\\u0430\\u0441\r\n#XFLD: for\r\nTSA_FOR=\\u0414\\u043B\\u044F\r\n#XBUT:Button to Send after the Timesheet is approved &nbsp;\\\\\\&nbsp;\r\nTSA_SUBMIT=\\u041E\\u0442\\u043F\\u0440\\u0430\\u0432\\u0438\\u0442\\u044C\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u043F\\u043E\\u043B\\u0443\\u0447\\u0438\\u0442\\u044C \\u0441\\u043F\\u0438\\u0441\\u043E\\u043A \\u0437\\u0430\\u043F\\u0438\\u0441\\u0435\\u0439 \\u0442\\u0430\\u0431\\u0435\\u043B\\u044F\r\n#YMSG: Message for Successful updation\r\nCATS_SUCCESS_MESSAGE=\\u0417\\u0430\\u043F\\u0438\\u0441\\u0438 \\u0442\\u0430\\u0431\\u0435\\u043B\\u044F \\u043E\\u0431\\u043D\\u043E\\u0432\\u043B\\u0435\\u043D\\u044B\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435 \\u0442\\u0430\\u0431\\u0435\\u043B\\u044F\r\n#XFLD: Link for manager to see employee notes\r\nSHOW_NOTE=\\u041F\\u043E\\u043A\\u0430\\u0437\\u0430\\u0442\\u044C \\u043F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u044F\r\n\r\n#XFLD: Link for manager to hide employee notes\r\nHIDE_NOTE=\\u0421\\u043A\\u0440\\u044B\\u0442\\u044C \\u043F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u044F\r\n\r\n#XTIT: Title for employee notes\r\nEMP_NOTE=\\u041F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u044F \\u0434\\u043B\\u044F \\u0441\\u043E\\u0442\\u0440\\u0443\\u0434\\u043D\\u0438\\u043A\\u0430\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_EMP_NOTE=\\u041F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u044F \\u0434\\u043B\\u044F \\u0441\\u043E\\u0442\\u0440\\u0443\\u0434\\u043D\\u0438\\u043A\\u0430\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_COST_ASSGNT=\\u041F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0435\\u043D\\u0438\\u0435 \\u0437\\u0430\\u0442\\u0440\\u0430\\u0442\r\n\r\n#XFLD: Column header for activity\r\nTSA_ACTIVITY=\\u041E\\u043F\\u0435\\u0440\\u0430\\u0446\\u0438\\u044F\r\n\r\n#XFLD: Column header for time\r\nTSA_TIME=\\u0412\\u0440\\u0435\\u043C\\u044F\r\n\r\n#XFLD: Column header for date\r\nTSA_DATE=\\u0414\\u0430\\u0442\\u0430\r\n\r\n#XFLD: Column header for activity\r\nTSA_REJECTION_REASON=\\u041F\\u0440\\u0438\\u0447\\u0438\\u043D\\u0430 \\u043E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0435\\u043D\\u0438\\u044F\r\n\r\n#XTIT: Title for list of rejection reasons\r\nTSA_TIT_REJECTION_REASON=\\u041F\\u0440\\u0438\\u0447\\u0438\\u043D\\u0430 \\u043E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0435\\u043D\\u0438\\u044F\r\n\r\n#XTIT: Field to Specify the Total hours\r\nTSA_TARGET=\\u0426\\u0435\\u043B\\u044C\r\n\r\n#XTIT: Message for submit confirmation\r\nTSA_CONF=\\u041E\\u0442\\u043F\\u0440\\u0430\\u0432\\u0438\\u0442\\u044C \\u0440\\u0435\\u0448\\u0435\\u043D\\u0438\\u0435 \\u043F\\u043E \\u0443\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u044E?\r\n\r\n#XTIT: title for submit confirmation\r\nTSA_CONF_HEADER=\\u041F\\u043E\\u0434\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435\r\n\r\n#XBUT: button to confirm submit\r\nTSA_ACCEPT=\\u041E\\u041A\r\n\r\n#XBUT: Cancel button for Rejection Reason\r\nTSA_CANCEL=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XLNK: link to show for employee and week\r\nTSA_SHOW=\\u041F\\u043E\\u043A\\u0430\\u0437\\u0430\\u0442\\u044C\r\n\r\n#XLNK: link to hide for employee and week\r\nTSA_HIDE=\\u0421\\u043A\\u0440\\u044B\\u0442\\u044C\r\n\r\n#XFLD: Weeks for which the timesheet is more than one week for employee\r\nTSA_WEEKS=\\u041D\\u0435\\u0434\\u0435\\u043B\\u0438\r\n\r\n#XFLD: Overtime for Timesheet entered for a employee.\r\nTSA_OVERTIME=\\u0421\\u0432\\u0435\\u0440\\u0445\\u0443\\u0440\\u043E\\u0447\\u043D\\u044B\\u0435\r\n\r\n#XFLD: Regular time for Timesheet entered for a employee.\r\nTSA_REGULARTIME=\\u0420\\u0435\\u0433\\u0443\\u043B\\u044F\\u0440\\u043D\\u043E\\u0435 \\u0440\\u0430\\u0431\\u043E\\u0447\\u0435\\u0435 \\u0432\\u0440\\u0435\\u043C\\u044F\r\n\r\n#XFLD: Recorded Time for employee.\r\nTSA_RECORDED=\\u0417\\u0430\\u043F\\u0438\\u0441\\u0430\\u043D\\u043E\r\n\r\n#XFLD: Completed percentage for employee Timesheet.\r\nTSA_COMPLETED=\\u0412\\u044B\\u043F\\u043E\\u043B\\u043D\\u0435\\u043D\\u043E\r\n\r\n#XFLD: Hour in short form.\r\nTSA_HOUR_SHORT=\\u0447\r\n\r\n#XFLD: Minutes in short form.\r\nTSA_MIN_SHORT=\\u043C\r\n\r\n#XFLD: Notes for time entry.\r\nTSA_NOTE=\\u041F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u0435\r\n\r\n#XFLD: Wage Type for time entry.\r\nTSA_WAGE_TYPE=\\u0412\\u0438\\u0434 \\u043E\\u043F\\u043B\\u0430\\u0442\\u044B\r\n\r\n#XFLD: Activity Type for time entry.\r\nTSA_ACTIVITY_TYPE=\\u0422\\u0438\\u043F \\u0434\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u044F\r\n\r\n#XFLD: Starttime  for time entry.\r\nTSA_START_TIME=\\u0412\\u0440\\u0435\\u043C\\u044F \\u043D\\u0430\\u0447\\u0430\\u043B\\u0430\r\n\r\n#XFLD: Endtime  for time entry.\r\nTSA_END_TIME=\\u0412\\u0440\\u0435\\u043C\\u044F \\u043E\\u043A\\u043E\\u043D\\u0447\\u0430\\u043D\\u0438\\u044F\r\n\r\n#XFLD: People for time entry Cost Assignment.\r\nTSA_PEOPLE=\\u041B\\u044E\\u0434\\u0438\r\n\r\n#XFLD: Actual hours  for time entry.\r\nTSA_ACTUAL_HOURS=\\u0427\\u0430\\u0441\\u044B \\u0444\\u0430\\u043A\\u0442\r\n\r\n#XFLD: Planned hours for time entry .\r\nTSA_PLANNED_HOURS=\\u0427\\u0430\\u0441\\u044B \\u043F\\u043B\\u0430\\u043D\r\n\r\n#XTIT: Details  for time entry notes.\r\nTSA_DETAILS=\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u043E\r\n\r\n#XBUT\t: Close button for notes.\r\nTSA_CLOSE=\\u0417\\u0430\\u043A\\u0440\\u044B\\u0442\\u044C\r\n\r\n#XFLD: No data available\r\nTSA_NO_DATA=\\u041D\\u0435\\u0442 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0445\r\n\r\n# YMSG: Loading\r\nLOADING=\\u0417\\u0430\\u0433\\u0440\\u0443\\u0437\\u043A\\u0430...\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=\\u0412 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0439 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442 \\u043D\\u0435\\u0442 \\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\\u0445 \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u0439\r\n',
	"hcm/mgr/approve/timesheet/i18n/i18n_tr.properties":'#XTIT,30: Application name\r\nAPP_TITLE=Zaman \\u00E7izelgelerini onayla\r\n#XTIT,30:  Application name\r\nTSA_APP_TITLE=Zaman \\u00E7izelgelerini onayla\r\n#XTIT,30:  Application name\r\nMASTER_TITLE=Zaman \\u00E7izelgeleri ({0})\r\n#XTIT,30:  Application name\r\nTSA_APP=Zaman \\u00E7izelgesi\r\n#XTIT,30: detail panel text\r\nDETAIL_TITLE=Zaman \\u00E7izelgesi\r\n#XBUT,9: Button Approve\r\nTSA_APPROVE=Onayla\r\n#XBUT,8: Button to Navigate back&nbsp;\\\\\\&nbsp;\r\nTSA_BACK=Geriye\r\n#XFLD: Week for which the timesheet is entered\r\nTSA_WEEK=Hafta\r\n#XFLD: No hours entered by the employee\r\nTSA_HOUR=Saat\r\n#XFLD: for\r\nTSA_FOR=\\u015Eunun i\\u00E7in\\:\r\n#XBUT:Button to Send after the Timesheet is approved &nbsp;\\\\\\&nbsp;\r\nTSA_SUBMIT=G\\u00F6nder\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=Zaman \\u00E7izelgesi giri\\u015Flerinin listesi al\\u0131namad\\u0131\r\n#YMSG: Message for Successful updation\r\nCATS_SUCCESS_MESSAGE=Zaman \\u00E7izelgesi giri\\u015Fleri g\\u00FCncellendi\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=Zaman \\u00E7izelgesi onay\\u0131\r\n#XFLD: Link for manager to see employee notes\r\nSHOW_NOTE=Notlar\\u0131 g\\u00F6ster\r\n\r\n#XFLD: Link for manager to hide employee notes\r\nHIDE_NOTE=Notlar\\u0131 gizle\r\n\r\n#XTIT: Title for employee notes\r\nEMP_NOTE=\\u00C7al\\u0131\\u015Fan notlar\\u0131\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_EMP_NOTE=\\u00C7al\\u0131\\u015Fan notlar\\u0131\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_COST_ASSGNT=Masraf tayini\r\n\r\n#XFLD: Column header for activity\r\nTSA_ACTIVITY=Aktivite\r\n\r\n#XFLD: Column header for time\r\nTSA_TIME=Saat\r\n\r\n#XFLD: Column header for date\r\nTSA_DATE=Tarih\r\n\r\n#XFLD: Column header for activity\r\nTSA_REJECTION_REASON=Ret nedeni\r\n\r\n#XTIT: Title for list of rejection reasons\r\nTSA_TIT_REJECTION_REASON=Ret nedeni\r\n\r\n#XTIT: Field to Specify the Total hours\r\nTSA_TARGET=Hedef\r\n\r\n#XTIT: Message for submit confirmation\r\nTSA_CONF=Onay karar\\u0131n\\u0131z g\\u00F6nderilsin mi?\r\n\r\n#XTIT: title for submit confirmation\r\nTSA_CONF_HEADER=Teyit\r\n\r\n#XBUT: button to confirm submit\r\nTSA_ACCEPT=Tamam\r\n\r\n#XBUT: Cancel button for Rejection Reason\r\nTSA_CANCEL=\\u0130ptal\r\n\r\n#XLNK: link to show for employee and week\r\nTSA_SHOW=G\\u00F6ster\r\n\r\n#XLNK: link to hide for employee and week\r\nTSA_HIDE=Gizle\r\n\r\n#XFLD: Weeks for which the timesheet is more than one week for employee\r\nTSA_WEEKS=Hafta\r\n\r\n#XFLD: Overtime for Timesheet entered for a employee.\r\nTSA_OVERTIME=Fazla mesai\r\n\r\n#XFLD: Regular time for Timesheet entered for a employee.\r\nTSA_REGULARTIME=D\\u00FCzenli \\u00E7al\\u0131\\u015Fma saati\r\n\r\n#XFLD: Recorded Time for employee.\r\nTSA_RECORDED=Kaydedildi\r\n\r\n#XFLD: Completed percentage for employee Timesheet.\r\nTSA_COMPLETED=Tamamland\\u0131\r\n\r\n#XFLD: Hour in short form.\r\nTSA_HOUR_SHORT=s\r\n\r\n#XFLD: Minutes in short form.\r\nTSA_MIN_SHORT=d\r\n\r\n#XFLD: Notes for time entry.\r\nTSA_NOTE=Not\r\n\r\n#XFLD: Wage Type for time entry.\r\nTSA_WAGE_TYPE=\\u00DCcret t\\u00FCr\\u00FC\r\n\r\n#XFLD: Activity Type for time entry.\r\nTSA_ACTIVITY_TYPE=Aktivite t\\u00FCr\\u00FC\r\n\r\n#XFLD: Starttime  for time entry.\r\nTSA_START_TIME=Ba\\u015Flang\\u0131\\u00E7 saati\r\n\r\n#XFLD: Endtime  for time entry.\r\nTSA_END_TIME=Biti\\u015F saati\r\n\r\n#XFLD: People for time entry Cost Assignment.\r\nTSA_PEOPLE=Ki\\u015Filer\r\n\r\n#XFLD: Actual hours  for time entry.\r\nTSA_ACTUAL_HOURS=Fiili saatler\r\n\r\n#XFLD: Planned hours for time entry .\r\nTSA_PLANNED_HOURS=Planlanan saatler\r\n\r\n#XTIT: Details  for time entry notes.\r\nTSA_DETAILS=Ayr\\u0131nt\\u0131lar\r\n\r\n#XBUT\t: Close button for notes.\r\nTSA_CLOSE=Kapat\r\n\r\n#XFLD: No data available\r\nTSA_NO_DATA=Veri yok\r\n\r\n# YMSG: Loading\r\nLOADING=Y\\u00FCkleniyor...\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=\\u015Eu anda kalem yok\r\n',
	"hcm/mgr/approve/timesheet/i18n/i18n_zh_CN.properties":'#XTIT,30: Application name\r\nAPP_TITLE=\\u5BA1\\u6279\\u5DE5\\u65F6\\u8868\r\n#XTIT,30:  Application name\r\nTSA_APP_TITLE=\\u5BA1\\u6279\\u5DE5\\u65F6\\u8868\r\n#XTIT,30:  Application name\r\nMASTER_TITLE=\\u5DE5\\u65F6\\u8868 ({0})\r\n#XTIT,30:  Application name\r\nTSA_APP=\\u5DE5\\u65F6\\u8868\r\n#XTIT,30: detail panel text\r\nDETAIL_TITLE=\\u5DE5\\u65F6\\u8868\r\n#XBUT,9: Button Approve\r\nTSA_APPROVE=\\u6279\\u51C6\r\n#XBUT,8: Button to Navigate back&nbsp;\\\\\\&nbsp;\r\nTSA_BACK=\\u8FD4\\u56DE\r\n#XFLD: Week for which the timesheet is entered\r\nTSA_WEEK=\\u5468\r\n#XFLD: No hours entered by the employee\r\nTSA_HOUR=\\u5C0F\\u65F6\r\n#XFLD: for\r\nTSA_FOR=\\u5BF9\r\n#XBUT:Button to Send after the Timesheet is approved &nbsp;\\\\\\&nbsp;\r\nTSA_SUBMIT=\\u53D1\\u9001\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=\\u65E0\\u6CD5\\u83B7\\u53D6\\u5DE5\\u65F6\\u8868\\u6761\\u76EE\\u5217\\u8868\r\n#YMSG: Message for Successful updation\r\nCATS_SUCCESS_MESSAGE=\\u5DE5\\u65F6\\u8868\\u6761\\u76EE\\u5DF2\\u66F4\\u65B0\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=\\u5DE5\\u65F6\\u8868\\u5BA1\\u6279\r\n#XFLD: Link for manager to see employee notes\r\nSHOW_NOTE=\\u663E\\u793A\\u6CE8\\u91CA\r\n\r\n#XFLD: Link for manager to hide employee notes\r\nHIDE_NOTE=\\u9690\\u85CF\\u6CE8\\u91CA\r\n\r\n#XTIT: Title for employee notes\r\nEMP_NOTE=\\u5458\\u5DE5\\u6CE8\\u91CA\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_EMP_NOTE=\\u5458\\u5DE5\\u6CE8\\u91CA\r\n\r\n#XFLD: Column header for employee notes\r\nTSA_COST_ASSGNT=\\u6210\\u672C\\u5206\\u914D\r\n\r\n#XFLD: Column header for activity\r\nTSA_ACTIVITY=\\u6D3B\\u52A8\r\n\r\n#XFLD: Column header for time\r\nTSA_TIME=\\u65F6\\u95F4\r\n\r\n#XFLD: Column header for date\r\nTSA_DATE=\\u65E5\\u671F\r\n\r\n#XFLD: Column header for activity\r\nTSA_REJECTION_REASON=\\u62D2\\u7EDD\\u539F\\u56E0\r\n\r\n#XTIT: Title for list of rejection reasons\r\nTSA_TIT_REJECTION_REASON=\\u62D2\\u7EDD\\u539F\\u56E0\r\n\r\n#XTIT: Field to Specify the Total hours\r\nTSA_TARGET=\\u76EE\\u6807\r\n\r\n#XTIT: Message for submit confirmation\r\nTSA_CONF=\\u662F\\u5426\\u63D0\\u4EA4\\u60A8\\u7684\\u5BA1\\u6279\\u51B3\\u7B56\\uFF1F\r\n\r\n#XTIT: title for submit confirmation\r\nTSA_CONF_HEADER=\\u786E\\u8BA4\r\n\r\n#XBUT: button to confirm submit\r\nTSA_ACCEPT=\\u786E\\u5B9A\r\n\r\n#XBUT: Cancel button for Rejection Reason\r\nTSA_CANCEL=\\u53D6\\u6D88\r\n\r\n#XLNK: link to show for employee and week\r\nTSA_SHOW=\\u663E\\u793A\r\n\r\n#XLNK: link to hide for employee and week\r\nTSA_HIDE=\\u9690\\u85CF\r\n\r\n#XFLD: Weeks for which the timesheet is more than one week for employee\r\nTSA_WEEKS=\\u661F\\u671F\r\n\r\n#XFLD: Overtime for Timesheet entered for a employee.\r\nTSA_OVERTIME=\\u52A0\\u73ED\r\n\r\n#XFLD: Regular time for Timesheet entered for a employee.\r\nTSA_REGULARTIME=\\u6B63\\u5E38\\u65F6\\u95F4\r\n\r\n#XFLD: Recorded Time for employee.\r\nTSA_RECORDED=\\u5DF2\\u8BB0\\u5F55\r\n\r\n#XFLD: Completed percentage for employee Timesheet.\r\nTSA_COMPLETED=\\u5DF2\\u5B8C\\u6210\r\n\r\n#XFLD: Hour in short form.\r\nTSA_HOUR_SHORT=\\u5C0F\\u65F6\r\n\r\n#XFLD: Minutes in short form.\r\nTSA_MIN_SHORT=\\u5206\r\n\r\n#XFLD: Notes for time entry.\r\nTSA_NOTE=\\u6CE8\\u91CA\r\n\r\n#XFLD: Wage Type for time entry.\r\nTSA_WAGE_TYPE=\\u5DE5\\u8D44\\u9879\r\n\r\n#XFLD: Activity Type for time entry.\r\nTSA_ACTIVITY_TYPE=\\u6D3B\\u52A8\\u7C7B\\u578B\r\n\r\n#XFLD: Starttime  for time entry.\r\nTSA_START_TIME=\\u5F00\\u59CB\\u65F6\\u95F4\r\n\r\n#XFLD: Endtime  for time entry.\r\nTSA_END_TIME=\\u7ED3\\u675F\\u65F6\\u95F4\r\n\r\n#XFLD: People for time entry Cost Assignment.\r\nTSA_PEOPLE=\\u4EBA\\u5458\r\n\r\n#XFLD: Actual hours  for time entry.\r\nTSA_ACTUAL_HOURS=\\u5B9E\\u9645\\u5C0F\\u65F6\\u6570\r\n\r\n#XFLD: Planned hours for time entry .\r\nTSA_PLANNED_HOURS=\\u8BA1\\u5212\\u5C0F\\u65F6\\u6570\r\n\r\n#XTIT: Details  for time entry notes.\r\nTSA_DETAILS=\\u8BE6\\u7EC6\\u4FE1\\u606F\r\n\r\n#XBUT\t: Close button for notes.\r\nTSA_CLOSE=\\u5173\\u95ED\r\n\r\n#XFLD: No data available\r\nTSA_NO_DATA=\\u65E0\\u6570\\u636E\r\n\r\n# YMSG: Loading\r\nLOADING=\\u52A0\\u8F7D\\u4E2D...\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=\\u5F53\\u524D\\u65E0\\u53EF\\u7528\\u9879\\u76EE\r\n',
	"hcm/mgr/approve/timesheet/utility/Parser.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mgr.approve.timesheet.utility.Parser");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");

hcm.mgr.approve.timesheet.utility.Parser = (function() {
	if (!this.oApplication) {
		this.oApplication = sap.ca.scfld.md.app.Application.getImpl();
	}
	var oBundle = this.oApplication.getResourceBundle();
	var _objTimePendingCacheData = null;
	var _cntrlrInst = null;
	return {
		
		setCachedData : function(oData){
			_objTimePendingCacheData = oData;
		},
		getCachedData : function(oData){
			return _objTimePendingCacheData;
		},
		setControllerInstance : function(oControllerInst) {
			_cntrlrInst = oControllerInst;
		},

		getControllerInstance : function() {
			return _cntrlrInst;
		},
		EmployeeData: function(modelData) {
			var timeEntry = modelData;

			var Employee = [];

			if (timeEntry.length > 0) {

				var emp = {
					"EmpName": timeEntry[0].Empname,
					"Pernr": timeEntry[0].Pernr,
					"Posname": timeEntry[0].Posname,
					"Completion": "",
					"NumberState": "",// added as part of ux requirement to set the number state
					"Weeks": [{
						"Weeknr": timeEntry[0].Weeknr,
						"Weekstart": timeEntry[0].Weekstart,
						"Weekend": timeEntry[0].Weekend,
						"Plannedhours": timeEntry[0].Plannedhours,
						"Actualhours": timeEntry[0].Actualhours,
						"Percentage": "",
						"Overtime": "",
						"Days": [{
							"Workdate": timeEntry[0].Workdate,

							"Conr": timeEntry[0].Conr,
							"Cotype": timeEntry[0].Cotype,
							"Codesc": timeEntry[0].Codesc,
							"Counter": timeEntry[0].Counter,
							"Catstype": timeEntry[0].Catstype,
							"Catsdesc": timeEntry[0].Catsdesc,
							"CatsText": timeEntry[0].CatsText,
							"Actualhours": timeEntry[0].Actualhours,
							"Plannedhours": timeEntry[0].Plannedhours,
							"TimeText":timeEntry[0].Awart,
							/*"TimeText": this.getTimeText(
								timeEntry[0].Actualhours,
								timeEntry[0].Plannedhours), */
							"Status": "A",
							"Lstar":timeEntry[0].Lstar,
							"Lgart":timeEntry[0].Lgart,
							"RejectionReason": "",
							"RejectionReasonText": "",
						}],
					}]

				};

				Employee.push(emp);

				for (var idx = 1; idx < timeEntry.length; idx++) {
					for (var i in Employee) {
						if (Employee[i].Pernr === timeEntry[idx].Pernr) {
							var Week = Employee[i].Weeks;
							for (var j in Week) {
								if (Week[j].Weeknr === timeEntry[idx].Weeknr) {
									var Day = Employee[i].Weeks[j].Days;
									var actual = parseFloat(Employee[i].Weeks[j].Actualhours) + parseFloat(timeEntry[idx].Actualhours);
									var planned = parseFloat(Employee[i].Weeks[j].Plannedhours) + parseFloat(timeEntry[idx].Plannedhours);
									Employee[i].Weeks[j].Actualhours = actual;
									Employee[i].Weeks[j].Plannedhours = planned;

									if (Day.length === 0) {
										Employee[i].Weeks[j].Actualhours = 0;
										Employee[i].Weeks[j].Plannedhours = 0;
									}
									var day = {};
									day.Workdate = timeEntry[idx].Workdate;

									day.Conr = timeEntry[idx].Conr;
									day.Cotype = timeEntry[idx].Cotype;
									day.Codesc = timeEntry[idx].Codesc;
									day.Counter = timeEntry[idx].Counter;
									day.Catstype = timeEntry[idx].Catstype;
									day.Catsdesc = timeEntry[idx].Catsdesc;
									day.CatsText = timeEntry[idx].CatsText;
									day.Actualhours = timeEntry[idx].Actualhours;
									day.Plannedhours = timeEntry[idx].Plannedhours;
									day.TimeText = timeEntry[idx].Awart;
									day.Lstar = timeEntry[idx].Lstar;
									day.Lgart = timeEntry[idx].Lgart;
									/*"TimeText": this.getTimeText(
									timeEntry[0].Actualhours,
									timeEntry[0].Plannedhours), */
									day.Status = "A";
									day.RejectionReason = "";
									day.RejectionReasonText = "";
									Employee[i].Weeks[j].Days.push(day);
									break;

								} else {
									var flag = 0;
									for (var k in Week){
										if (Week[k].Weeknr === timeEntry[idx].Weeknr){
											flag = 1;
										}
									}
									if (flag === 0) {
										var week = {};
										week.Weeknr = timeEntry[idx].Weeknr;
										week.Weekstart = timeEntry[idx].Weekstart;
										week.Weekend = timeEntry[idx].Weekend;
										week.Plannedhours = timeEntry[idx].Plannedhours;
										week.Actualhours = timeEntry[idx].Actualhours;
										week.Weekstart = timeEntry[idx].Weekstart;
										week.Percentage = "";
										week.Overtime = "";
										var day = {};
										day.Workdate = timeEntry[idx].Workdate;
										//Note 2027185: Missing cotype and codesc
										day.Cotype = timeEntry[idx].Cotype;
										day.Codesc = timeEntry[idx].Codesc;
										//Note 2027185:end Missing cotype and codesc
										day.Catstype = timeEntry[idx].Catstype;
										day.Catsdesc = timeEntry[idx].Catsdesc;
										day.CatsText = timeEntry[idx].CatsText;
										day.Counter = timeEntry[idx].Counter;
										day.Actualhours = timeEntry[idx].Actualhours;
										day.Plannedhours = timeEntry[idx].Plannedhours;
										day.TimeText = timeEntry[idx].Awart;
										day.Lstar = timeEntry[idx].Lstar;
										day.Lgart = timeEntry[idx].Lgart;
										/*"TimeText": this.getTimeText(
										timeEntry[0].Actualhours,
										timeEntry[0].Plannedhours), */
										day.Status = "A";
										day.RejectionReason = "";
										day.RejectionReasonText = "";
										week.Days = [];
										week.Days.push(day);
										Employee[i].Weeks.push(week);
									}
								}
							}
						} else {
							var flag = 0;
							for (var index in Employee) {
								if (Employee[index].Pernr === timeEntry[idx].Pernr)
									flag = 1;
							}
							if (flag === 0) {
								var emp = {
									"EmpName": timeEntry[idx].Empname,
									"Pernr": timeEntry[idx].Pernr,
									"Posname": timeEntry[idx].Posname,
									"Completion": "",
									"Weeks": [{
										"Weeknr": timeEntry[idx].Weeknr,
										"Weekstart": timeEntry[idx].Weekstart,
										"Weekend": timeEntry[idx].Weekend,
										"Actualhours": timeEntry[idx].Actualhours,
										"Plannedhours": timeEntry[idx].Plannedhours,
										"Percentage": "",
										"Overtime": "",
										"Days": [{
											"Workdate": timeEntry[idx].Workdate,

											"Conr": timeEntry[idx].Conr,
											"Cotype": timeEntry[idx].Cotype,
											"Codesc": timeEntry[idx].Codesc,
											"Counter": timeEntry[idx].Counter,
											"Catstype": timeEntry[idx].Catstype,
											"Catsdesc": timeEntry[idx].Catsdesc,
											"CatsText": timeEntry[idx].CatsText,
											"Actualhours": timeEntry[idx].Actualhours,
											"Plannedhours": timeEntry[idx].Plannedhours,
											"TimeText":timeEntry[idx].Awart,
											"Lstar":timeEntry[idx].Lstar,
											"Lgart":timeEntry[idx].Lgart,
											/*"TimeText": this.getTimeText(
												timeEntry[0].Actualhours,
												timeEntry[0].Plannedhours), */
											"Status": "A",
											"RejectionReason": "",
											"RejectionReasonText": "",
										}]
									}]
								};

								Employee.push(emp);
							}
						}

					}
				}
			}

			for (var id in Employee) {
				var complete = 0;
				var percent = 0;
				var EmpOvertime = 0;
				var oModelData = Employee[id].Weeks;
				for (var i in oModelData) {
					percent = (parseFloat(oModelData[i].Actualhours) / parseFloat(oModelData[i].Plannedhours)) * 100;
					var OT = parseFloat(oModelData[i].Actualhours) - parseFloat(oModelData[i].Plannedhours);

					if (percent > 100)
						percent = 100;
					complete = percent + complete;
					if (OT > 0) {
						EmpOvertime = EmpOvertime + OT;
						Employee[id].Weeks[i].Overtime = this
							.overtimeFormatter(OT) + " " + oBundle.getText("TSA_OVERTIME");
					} else {
						Employee[id].Weeks[i].Overtime = "";
					}
					Employee[id].Weeks[i].Percentage = parseInt(percent, 0) + "%";
					Employee[id].Weeks[i].DayVisible = false;
					Employee[id].Weeks[i].DayVisibleText = oBundle
						.getText("TSA_SHOW");
				}
				if (EmpOvertime > 0) {
					Employee[id].Overtime = this.overtimeFormatter(EmpOvertime) + " " + oBundle.getText("TSA_OVERTIME");
				} else {
					Employee[id].Overtime = "";
				}
				Employee[id].Completion = parseInt(complete / Employee[id].Weeks.length, 0) + "%";
				// set the number state based on the value 'number' - added as part of ux design review
				Employee[id].NumberState= (Employee[id].Completion === "100%")?sap.ui.core.ValueState.Success:sap.ui.core.ValueState.Error; 

				var weeksText = oBundle.getText("TSA_WEEK");
				if (Employee[id].Weeks.length > 1) {
					weeksText = oBundle.getText("TSA_WEEKS");
				}
				Employee[id].No_Week = Employee[id].Weeks.length + " " + weeksText;
			}

			return Employee;
		},

		CostAssignmentData: function(modelData) {
			var timeEntry = modelData;
			// var Employee = [];
			var CA = [];

			if (timeEntry.length > 0) {

				var ca = {
					"Conr": timeEntry[0].Conr,
					"Cotype": timeEntry[0].Cotype,
					"Codesc": timeEntry[0].Codesc,
					"No_People": "",
					"Peoples": [{
						"EmpName": timeEntry[0].Empname,
						"Pernr": timeEntry[0].Pernr,
						"Posname": timeEntry[0].Posname,
						"Actualhours": timeEntry[0].Actualhours,
						"Plannedhours": timeEntry[0].Plannedhours,
						"Completion": "",
						"Overtime": "",
						"Days": [{
							"Workdate": timeEntry[0].Workdate,

							"Catstype": timeEntry[0].Catstype,
							"Catsdesc": timeEntry[0].Catsdesc,
							"CatsText": timeEntry[0].CatsText,
							"Counter": timeEntry[0].Counter,
							"Actualhours": timeEntry[0].Actualhours,
							"Plannedhours": timeEntry[0].Plannedhours,
							"TimeText":timeEntry[0].Awart,
							"Lstar":timeEntry[0].Lstar,
							"Lgart":timeEntry[0].Lgart,
							/*"TimeText": this.getTimeText(
								timeEntry[0].Actualhours,
								timeEntry[0].Plannedhours), */
							"Status": "A",
							"RejectionReason": "",
							"RejectionReasonText": "",
						}]
					}]

				};

				CA.push(ca);

				for (var idx = 1; idx < timeEntry.length; idx++) {
					for (var i in CA) {
						if (CA[i].Conr === timeEntry[idx].Conr) {
							var People = CA[i].Peoples;
							for (var j in People) {
								if (People[j].Pernr === timeEntry[idx].Pernr) {
									var Day = CA[i].Peoples[j].Days;
									if (Day.length === 0 || Day === undefined) {
										CA[i].Peoples[j].Actualhours = 0;
										CA[i].Peoples[j].Plannedhours = 0;
									}

									var actual = parseFloat(CA[i].Peoples[j].Actualhours) + parseFloat(timeEntry[idx].Actualhours);
									var planned = parseFloat(CA[i].Peoples[j].Plannedhours) + parseFloat(timeEntry[idx].Plannedhours);
									CA[i].Peoples[j].Actualhours = actual;
									CA[i].Peoples[j].Plannedhours = planned;
									var day = {};
									day.Workdate = timeEntry[idx].Workdate;

									day.Conr = timeEntry[idx].Conr; // changes
									// by Pankaj
									// for
									// receiver
									// issue
									day.Cotype = timeEntry[idx].Cotype;
									day.Codesc = timeEntry[idx].Codesc;
									day.Catstype = timeEntry[idx].Catstype;
									day.Catsdesc = timeEntry[idx].Catsdesc;
									day.CatsText = timeEntry[idx].CatsText;
									day.Counter = timeEntry[idx].Counter;
									day.Actualhours = timeEntry[idx].Actualhours;
									day.Plannedhours = timeEntry[idx].Plannedhours;
									day.TimeText = timeEntry[idx].Awart;
									day.Lstar = timeEntry[idx].Lstar;
									day.Lgart = timeEntry[idx].Lgart;
										/*"TimeText": this.getTimeText(
											timeEntry[0].Actualhours,
											timeEntry[0].Plannedhours), */
									day.Status = "A";
									day.RejectionReason = "";
									day.RejectionReasonText = "";
									CA[i].Peoples[j].Days.push(day);
									break;

								} else {
									var flag = 0;
									for (var k in People){
										if (People[k].Pernr === timeEntry[idx].Pernr){
											flag = 1;
										}
									}
									if (flag === 0) {
										var people = {};
										people.EmpName = timeEntry[idx].Empname;
										people.Pernr = timeEntry[idx].Pernr;
										people.Posname = timeEntry[idx].Posname;
										people.Actualhours = timeEntry[idx].Actualhours;
										people.Plannedhours = timeEntry[idx].Plannedhours;
										people.Completion = "";
										people.Overtime = "";
										var day = {};
										day.Workdate = timeEntry[idx].Workdate;

										day.Conr = timeEntry[idx].Conr; // changes
										// by
										// Pankaj
										// for
										// receiver
										// issue
										day.Cotype = timeEntry[idx].Cotype;
										day.Codesc = timeEntry[idx].Codesc;
										day.Catstype = timeEntry[idx].Catstype;
										day.Catsdesc = timeEntry[idx].Catsdesc;
										day.CatsText = timeEntry[idx].CatsText;
										day.Counter = timeEntry[idx].Counter;
										day.Actualhours = timeEntry[idx].Actualhours;
										day.Plannedhours = timeEntry[idx].Plannedhours;
										day.TimeText = timeEntry[idx].Awart;
										day.Lstar = timeEntry[idx].Lstar;
										day.Lgart = timeEntry[idx].Lgart;
										/*"TimeText": this.getTimeText(
										timeEntry[0].Actualhours,
										timeEntry[0].Plannedhours), */
										day.Status = "A";
										day.RejectionReason = "";
										day.RejectionReasonText = "";
										people.Days = [];
										people.Days.push(day);
										CA[i].Peoples.push(people);
									}
								}
							}
						} else {
							var flag = 0;
							for (var index in CA) {
								if (CA[index].Conr === timeEntry[idx].Conr){
									flag = 1;
								}
							}
							if (flag === 0) {
								var ca = {
									"Conr": timeEntry[idx].Conr,
									"Cotype": timeEntry[idx].Cotype,
									"Codesc": timeEntry[idx].Codesc,
									"No_People": "",
									"Peoples": [{
										"EmpName": timeEntry[idx].Empname,
										"Pernr": timeEntry[idx].Pernr,
										"Posname": timeEntry[idx].Posname,
										"Actualhours": timeEntry[idx].Actualhours,
										"Plannedhours": timeEntry[idx].Plannedhours,
										"Completion": "",
										"Overtime": "",
										"Days": [{
											"Workdate": timeEntry[idx].Workdate,

											"Catstype": timeEntry[idx].Catstype,
											"Catsdesc": timeEntry[idx].Catsdesc,
											"CatsText": timeEntry[idx].CatsText,
											"Counter": timeEntry[idx].Counter,
											"Actualhours": timeEntry[idx].Actualhours,
											"Plannedhours": timeEntry[idx].Plannedhours,
											"TimeText":timeEntry[idx].Awart,
											"Lstar":timeEntry[idx].Lstar,
											"Lgart":timeEntry[idx].Lgart,
											/*"TimeText": this.getTimeText(
												timeEntry[0].Actualhours,
												timeEntry[0].Plannedhours), */
											"Status": "A",
											"RejectionReason": "",
											"RejectionReasonText": "",
										}]
									}]

								};
								CA.push(ca);
							}
						}

					}
				}
			}

			for (var id in CA) {
				var complete = 0;
				var percent = 0;
				var ProjOvertime = 0;
				var oModelData = CA[id].Peoples;
				for (var i in oModelData) {
					percent = (parseFloat(oModelData[i].Actualhours) / parseFloat(oModelData[i].Plannedhours)) * 100;
					var OT = parseFloat(oModelData[i].Actualhours) - parseFloat(oModelData[i].Plannedhours);
					if (percent > 100)
						percent = 100;
					complete = percent + complete;
					if (OT > 0) {
						ProjOvertime = ProjOvertime + OT;
						CA[id].Peoples[i].Overtime = this.overtimeFormatter(OT) + " " + oBundle.getText("TSA_OVERTIME");
					} else {
						CA[id].Peoples[i].Overtime = "";
					}

					CA[id].Peoples[i].Completion = parseInt(percent, 0) + "%";
					CA[id].Peoples[i].DayVisible = false;
					CA[id].Peoples[i].DayVisibleText = oBundle
						.getText("TSA_SHOW");
				}
				if (ProjOvertime > 0) {
					CA[id].Overtime = this.overtimeFormatter(ProjOvertime) + " " + oBundle.getText("TSA_OVERTIME");
				} else {
					CA[id].Overtime = "";
				}
				// CA[id].Completion = parseInt(complete /
				// CA[id].Peoples.length) + "%";
				CA[id].No_People = CA[id].Peoples.length;
			}

			return CA;

		},
	/*	getTimeText: function(actual, planned) {
			var time = parseFloat(actual) - parseFloat(planned);
			var timeText = "";
			if (time > 0) {
				timeText = oBundle.getText("TSA_OVERTIME");
			} else {
				timeText = oBundle.getText("TSA_REGULARTIME");
			}
			return timeText;
		}, */
		overtimeFormatter: function(c) {
			var hours = parseInt(c, 0);
			var minutes = (c - hours) * 60;
			var h = oBundle.getText("TSA_HOUR_SHORT");
			var m = oBundle.getText("TSA_MIN_SHORT");
			return (hours + h + " " + minutes + m);
		},
		parseDateWeek : function(start, end) {
			var formatedDate = sap.ca.ui.model.format.DateFormat.getDateInstance({pattern : "YYYYMMdd"});
			return formatedDate.parse(start).toDateString().substring(4, 16)+ " - "+ formatedDate.parse(end).toDateString().substring(4, 16);

		},
		parseTimeDisplay : function(data) {
			if (data != undefined && data !== "") {
				var hours = parseInt(data);
				var minutes = parseInt((data - hours) * 60);
				var hour = oBundle.getText("TSA_HOUR_SHORT");
				var min = oBundle.getText("TSA_MIN_SHORT");
				return hours + hour + " " + minutes + min;
			} else
				return "";

		},
		parseDateDay : function(data) {
			if (data !== undefined && data !== null) {
				var formattedData = sap.ui.core.format.DateFormat.getDateInstance({
							pattern : "YYYYMMdd"
						});
				return formattedData.parse(data).toDateString();
			}
		},
		projectCode : function(Cotype, Codesc) {
			return Cotype + " - " + Codesc;
		},
		projectTitle : function(cotype, codesc) {
			return cotype + ':' + codesc;
		},
		statusToBoolean : function(status) {
			return status == "A" ? true : false;
		},
		parseOverTime : function(data) {
			if (data !== null && data.length !== 0) {
				var values = data.split(" ");
				var min = oBundle.getText("TSA_MIN_SHORT");
				return values[0] + " " + parseInt(values[1]) + min + " "
						+ values[2];
			} else {
				return data;
			}
		}
	};
}());
},
	"hcm/mgr/approve/timesheet/view/S2.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseMasterController");
jQuery.sap.require("hcm.mgr.approve.timesheet.utility.Parser");
jQuery.sap.require("sap.ca.ui.utils.busydialog");
jQuery.sap.require("sap.ca.ui.message.message");

sap.ca.scfld.md.controller.BaseMasterController
		.extend(
				"hcm.mgr.approve.timesheet.view.S2",
				{
					//Controller Hook method definitions
					extHookDisplayEmployeeList: null,
					extHookDisplayCostAssignmentList: null,

					onInit : function() {
						// execute the onInit for the base class
						// BaseDetailController
						sap.ca.scfld.md.controller.BaseMasterController.prototype.onInit
								.call(this);

						this.oBundle = this.oApplicationFacade
								.getResourceBundle();
						this.oDataModel = this.oApplicationFacade
								.getODataModel();

						this.readEmployeeListData(true);
						this.selection = "";
						var self = this;
						this.oRouter
								.attachRouteMatched(
										function(oEvent) {
											if (oEvent.getParameter("name") === "masterDetail") {
												if (oEvent
														.getParameter("arguments").contextPath === undefined) {
													if (this.selection == "Employee") {
														self
																.readEmployeeListData(false);
													} else if (this.selection == "CA") {
														self
																.readCostAssisgnmentListData(false);
													}
												}
											}
										}, this);
					},

					/*
					 * override BaseMasterController method in order to decode
					 * the JSONModel based contextPath Crossroads.js does not
					 * allow slashes in the navigation hash, JSON contextPath
					 * contains
					 */
					resolveHash : function(oEvent) {
						return decodeURIComponent(oEvent
								.getParameter("arguments").contextPath);
					},
					/**
					 * @public [setListItem select first row]
					 * @param {[type]}
					 *            oItem
					 */
					setListItem : function(oItem) {
						this.selection = oItem
								.getBindingContext(this.modelName).getPath()
								.split("/")[1];
						this.index = oItem.getBindingContext(this.modelName)
								.getPath().split("/")[2];
						if (oItem !== undefined) {
							oItem.setSelected(true);
							this.oRouter.navTo("detail", {
								contextPath : encodeURIComponent(oItem
										.getBindingContext(this.sModelName)
										.getPath())
							}, !jQuery.device.is.phone);
						}
					},
					/**
					 * @override
					 * 
					 * @param oItem
					 * @param sFilterPattern
					 * @returns {*}
					 */
					applySearchPatternToListItem : function(oItem,
							sFilterPattern) {

						if (sFilterPattern.substring(0, 1) === "#") {
							var sTail = sFilterPattern.substr(1);
							var sDescr = oItem.getBindingContext().getProperty(
									"Name").toLowerCase();
							return sDescr.indexOf(sTail) === 0;
						} else {
							if (sFilterPattern === "") {
								return true;
							}

							var sPath = oItem.getBindingContext().sPath
									.split("/")[1];
							if (sPath == "Employee")
								var oIteshellata = oItem.getBindingContext()
										.getModel().getData().Employee;
							else
								var oIteshellata = oItem.getBindingContext()
										.getModel().getData().CA;

							for ( var sKey in oIteshellata) {
								var sValue = oIteshellata[sKey];
								if (typeof sValue == "string") {
									if (sValue.toLowerCase().indexOf(
											sFilterPattern) != -1) {
										return true;
									}
								}
							}
							// if nothing found in unformatted data, check UI
							// elements
							if ((oItem.getIntro() && oItem.getIntro()
									.toLowerCase().indexOf(sFilterPattern) != -1)
									|| (oItem.getTitle() && oItem.getTitle()
											.toLowerCase().indexOf(
													sFilterPattern) != -1)
									|| (oItem.getNumber() && oItem.getNumber()
											.toLowerCase().indexOf(
													sFilterPattern) != -1)
									|| (oItem.getNumberUnit() && oItem
											.getNumberUnit().toLowerCase()
											.indexOf(sFilterPattern) != -1)
									|| (oItem.getFirstStatus() && oItem
											.getFirstStatus().getText()
											.toLowerCase().indexOf(
													sFilterPattern) != -1)
									|| (oItem.getSecondStatus() && oItem
											.getSecondStatus().getText()
											.toLowerCase().indexOf(
													sFilterPattern) != -1)) {
								return true;
							}
							// last source is attribute array
							var aAttributes = oItem.getAttributes();
							for ( var j = 0; j < aAttributes.length; j++) {
								if (aAttributes[j].getText().toLowerCase()
										.indexOf(sFilterPattern) != -1) {
									return true;
								}
							}
							return false;
						}

					},
					/**
					 * @public [getHeaderFooterOptions Define header & footer
					 *         options]
					 */
					getHeaderFooterOptions : function() {
						var that = this;
						return {
							sI18NMasterTitle : "MASTER_TITLE",
							onRefresh : function(sSearchFieldContent,
									fRefreshCompleted) {
								// start asynchronous refresh
								var successCallback = function(oData, oResponse) {
									hcm.mgr.approve.timesheet.utility.Parser
									.setCachedData(oData);
									if (fRefreshCompleted) {
										fRefreshCompleted();
									}
									if (that.selection === "Employee" || that.selection=="")
										that.displayEmployeeList(oData, false);
									else
										that.displayCostAssignmentList(oData,
												false);
								};
								/*
								 * failure handler
								 */
								var onRequestFailed = function(oError) {
									sap.ca.ui.message.showMessageBox({
										type : sap.ca.ui.message.Type.ERROR,
										message : oError.message,
										details : oError.response.body
									});
								};
								that.oDataModel.read("Time_Pending", null,
										null, false, successCallback, jQuery
												.proxy(onRequestFailed, this));

								// return -1 to indicate that scaffolding should
								// not go on with the refresh
								return -1;
							},
							oGroupOptions : {
								aGroupItems : [ {
									text : "{i18n>TSA_PEOPLE}",
									key : "PEOPLE"
								}, {
									text : "{i18n>TSA_COST_ASSGNT}",
									key : "Cost Assignment"
								} ],
								onGroupSelected : function(sKey) {
									if (sKey == "PEOPLE") {
										that.readEmployeeListData(true);
									} else {
										that.readCostAssisgnmentListData(true);

									}
								}
							},

						};
					},
					/**
					 * @private [readEmployeeListData to fetch the odata]
					 * @param indicator
					 *            -true select first item in the list,false
					 *            select indexed value
					 */
					readEmployeeListData : function(indicator) {
						sap.ca.ui.utils.busydialog.requireBusyDialog();
						/*
						 * success handler,parse the odata and restructure into
						 * employee model
						 */
						var onRequestSuccess = function(oData, oResponse) {
							hcm.mgr.approve.timesheet.utility.Parser
							.setCachedData(oData);
							this.displayEmployeeList(oData, indicator);
							sap.ca.ui.utils.busydialog.releaseBusyDialog();

						};
						/*
						 * failure handler
						 */
						var onRequestFailed = function(oError) {
							sap.ca.ui.message.showMessageBox({
								type : sap.ca.ui.message.Type.ERROR,
								message : oError.message,
								details : oError.response.body
							});
						};
						this.oDataModel.read("Time_Pending", null, null, true,
								jQuery.proxy(onRequestSuccess, this), jQuery
										.proxy(onRequestFailed, this));
					},
					/**
					 * @private [displayEmployeeList restructure into employee
					 *          model and bind the model to master list]
					 * @param oData
					 *            -data to be parsed indicator -true select
					 *            first item in the list,false select indexed
					 *            value
					 */
					displayEmployeeList : function(oData, indicator) {
						var oList=this.getList();
						oList.destroyItems();
						var modelData = oData.results;

						var Employee = hcm.mgr.approve.timesheet.utility.Parser
								.EmployeeData(modelData);
						var length = Employee.length;
						this.oApplicationFacade.oApplicationImplementation.oMHFHelper
								.setMasterTitle(this, length);

						if (length > 0) {
							var timeModelData = new Object();
							timeModelData.Employee = Employee;
							timeModelData.PeopleVisible = true;
							timeModelData.CostVisible = false;
							var timeJsonModel = new sap.ui.model.json.JSONModel();

							timeJsonModel.setData(timeModelData);
							oList.setModel(timeJsonModel);
							oList
									.bindAggregation(
											"items",
											{

												path : "/Employee",

												template : new sap.m.ObjectListItem(
														{
															type : "Active",
															title : "{EmpName}",
															number : "{Completion}",
															numberUnit : "{i18n>TSA_COMPLETED}",
															numberState : "{NumberState}",
															attributes : [
																	new sap.m.ObjectAttribute(
																			{
																				text : "{Posname}"
																			}),
																	new sap.m.ObjectAttribute(
																			{
																				text : "{No_Week}"
																			}) ],
															press : jQuery
																	.proxy(
																			this._handleItemPress,
																			this)
														})
											});

							var oList = this.getList();
							this.registerMasterListBind(oList);
							if (indicator)
								this.selectInitialEmployeeItem();
							else
								this.selectIndexedValue();

						} else {
							this.noDataRouting();
						}
						/**
					     * @ControllerHook Extend behavior of Display Employee List
					     * This hook method can be used to add UI or business logic 
					     * It is called when the displayEmployeeList method executes
					     * @callback hcm.mgr.approve.timesheet.view.S2~extHookDisplayEmployeeList
					     */
							if(this.extHookDisplayEmployeeList) {
								this.extHookDisplayEmployeeList();
					  	};
					},
					/**
					 * @private [selectIndexedValue check index and set the
					 *          corresponding item in the master list]
					 */
					selectIndexedValue : function() {
						if (!jQuery.device.is.phone) {
							var oIndexedItem = this
									.retrieveIndexedItem(this.index);
							if (oIndexedItem) {
								this.setListItem(oIndexedItem);
							} else {
								this.conditionalSelection();
							}
						}
					},
					/**
					 * @private [retrieveIndexedItem return indexed item from
					 *          the master list]
					 * @param index -
					 *            index of item
					 * @return oIndexedItem - item from list at specific index
					 */
					retrieveIndexedItem : function(index) {
						var oList = this.getView().byId("list");
						var oIndexedItem = oList.getItems()[index];
						return oIndexedItem;
					},
					/**
					 * @private [conditionalSelection selection of item based on
					 *          item for employee and cost assignment model]
					 */
					conditionalSelection : function() {
						var oList = this.getView().byId("list");
						var length = oList.getItems().length;

						if (length == 1) {
							var oIndexedItem = this.retrieveIndexedItem(0);
							this.setListItem(oIndexedItem);

						} else if (length > 1) {
							var oIndexedItem = this
									.retrieveIndexedItem(this.index - 1);
							this.setListItem(oIndexedItem);
						} else {
							this.noDataRouting();
						}
					},
					/**
					 * @private [noDataRouting route to no data view in case the
					 *          list has no records]
					 */
					noDataRouting : function() {
						// route to no data route
						var oList = this.getList();
						oList.removeAllItems();
						oList.setShowNoData(true);
						oList.setNoDataText(this.oBundle
								.getText("NO_ITEMS_AVAILABLE"));
						this.oApplicationFacade.oApplicationImplementation.oMHFHelper
								.setMasterTitle(this, 0);
						if (!sap.ui.Device.system.phone) {
							this.navToEmptyView();
						}
					},
					/**
					 * @private [selectInitialEmployeeItem select first element
					 *          in the employee list]
					 */
					selectInitialEmployeeItem : function() {
						if (!jQuery.device.is.phone) {
							var oList = this.getList();
							var oFirstItem = oList.getItems()[0];
							if (oFirstItem !== undefined)
								this.setListItem(oFirstItem);
						}

					},
					/**
					 * @private [selectInitialCostItem select first element in
					 *          the cost assignment list]
					 */
					selectInitialCostItem : function() {
						if (!jQuery.device.is.phone) {
							var oList = this.getList();
							var oFirstItem = oList.getItems()[0];
							if (oFirstItem !== undefined)
								this.setListItem(oFirstItem);
						}
					},
					/**
					 * @private [readCostAssisgnmentListData to fetch the odata]
					 * @param indicator
					 *            -true select first item in the list,false
					 *            select indexed value
					 */
					readCostAssisgnmentListData : function(indicator) {
						sap.ca.ui.utils.busydialog.requireBusyDialog();
						/*
						 * success handler,parse the odata and restructure into
						 * cost assignment model
						 */
						var onRequestSuccess = function(oData, oResponse) {
							hcm.mgr.approve.timesheet.utility.Parser
							.setCachedData(oData);
							this.displayCostAssignmentList(oData, indicator);
							sap.ca.ui.utils.busydialog.releaseBusyDialog();
						};
						/*
						 * failure handler
						 */
						var onRequestFailed = function(oError) {
							sap.ca.ui.message.showMessageBox({
								type : sap.ca.ui.message.Type.ERROR,
								message : oError.message,
								details : oError.response.body
							});
						};
						this.oDataModel.read("Time_Pending", null, null, true,
								jQuery.proxy(onRequestSuccess, this), jQuery
										.proxy(onRequestFailed, this));

					},
					/**
					 * @private [displayCostAssignmentList restructure into cost
					 *          assignment model and bind the model to master
					 *          list]
					 * @param oData -
					 *            data to be parsed and displayed in master list
					 *            indicator -true select first item in the
					 *            list,false select indexed value
					 */
					displayCostAssignmentList : function(oData, indicator) {
						var oList=this.getList();
						oList.destroyItems();
						var modelData = oData.results;

						var CostAssignment = hcm.mgr.approve.timesheet.utility.Parser
								.CostAssignmentData(modelData);
						if (CostAssignment.length > 0) {
							var timeModelData = new Object();
							timeModelData.CA = CostAssignment;
							timeModelData.CostVisible = true;
							timeModelData.PeopleVisible = false;
							var timeJsonModel = new sap.ui.model.json.JSONModel();
							timeJsonModel.setData(timeModelData);
							oList.setModel(timeJsonModel);

							this.oApplicationFacade.oApplicationImplementation.oMHFHelper
									.setMasterTitle(this, CostAssignment.length);

							oList
									.bindAggregation(
											"items",
											{

												path : "/CA",

												template : new sap.m.ObjectListItem(
														{
															type : "Active",
															title : "{Cotype}:{Codesc}",
															number : "{No_People}",
															numberUnit : "{i18n>TSA_PEOPLE}",
															press : jQuery
																	.proxy(
																			this._handleItemPress,
																			this)
														})
											});

							var oList = this.getList();
							this.registerMasterListBind(oList);
							if (indicator)
								this.selectInitialCostItem();
							else
								this.selectIndexedValue();
						} else {
							this.noDataRouting();

						}
						/**
					     * @ControllerHook Extend behavior of Display Cost Assignment List
					     * This hook method can be used to add UI or business logic 
					     * It is called when the displayCostAssignmentList method executes
					     * @callback hcm.mgr.approve.timesheet.view.S2~extHookDisplayCostAssignmentList
					     */
							if(this.extHookDisplayCostAssignmentList) {
								this.extHookDisplayCostAssignmentList();
					  	};

					},
					/**
					 * @private [_submit handler for list row swipe for
					 *          approval]
					 * @param oEvent -
					 *            event handler
					 */
					_submit : function(oEvent) {
						var olist = this.getView().byId("list");
						var swipeItem = olist.getSwipedItem();
						var str = "cats='";

						var data = swipeItem.getBindingContext().getModel();
						var path = swipeItem.getBindingContext().getPath();
						olist.swipeOut();
						var data_all = data.getProperty(path);

						var selection = path.split("/")[1];
						var selectedData;
						var Pernr;
						if (selection == "Employee")
							selectedData = data_all.Weeks;
						else
							selectedData = data_all.Peoples;

						// check the selection and call respective functions
						for ( var g = 0; g < selectedData.length; g++) {

							if (selection == "Employee")
								Pernr = data_all.Pernr;
							else
								Pernr = selectedData[g].Pernr;

							var f = selectedData[g].Days;
							for ( var j = 0; j < f.length; j++) {

								str += Pernr + "," + f[j].Counter + ","
										+ f[j].Status + ","
										+ f[j].RejectionReason + "/";
							}

							str += "'";

							// prepare for the post call
							var collection = "Cats_Action?" + str;

							var onRequestSuccess = function(oData, oResponse) {
								/*var n2 = path.split("/")[2];
								var nmod = this.getView().getModel();
								var nm = nmod.getData();
								if (nm) {
									if (selection == "Employee")
										nm.Employee.splice(n2, 1);
									else
										nm.CA.splice(n2, 1);

									nmod.setData(nm);
									sap.ca.ui.message
											.showMessageToast(this.oBundle
													.getText("CATS_SUCCESS_MESSAGE"));

									this.getView().setModel(nmod);

								}*/
								sap.ca.ui.message.showMessageToast(this.oBundle
										.getText("CATS_SUCCESS_MESSAGE"));
								if (selection == "Employee")
									this.readEmployeeListData(false);
								else if (selection == "CA")
									this.readCostAssisgnmentListData(false);
							};

							var onRequestFailed = function(oError) {
								sap.ca.ui.message.showMessageBox({
									type : sap.ca.ui.message.Type.ERROR,
									message : oError.message,
									details : oError.response.body
								});
							};

							// make post service call
							this.oDataModel.create(collection, null, null,
									jQuery.proxy(onRequestSuccess, this),
									jQuery.proxy(onRequestFailed, this));

						}
						;
					}
				});
},
	"hcm/mgr/approve/timesheet/view/S2.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\tcontrollerName="hcm.mgr.approve.timesheet.view.S2">\n\t<Page id="page">\n\t\t<content>\n\t\t\t<List\n\t\t\t\tid="list"\n\t\t\t\tshowNoData="false"\n\t\t\t\tmode="{device>/listMode}"\n\t\t\t\tselect="_handleSelect"\n\t\t\t\tSwipeDirection="Both">\n\t\t\t\t<swipeContent>\n\t\t\t\t\t<Button\n\t\t\t\t\t\ttext="{i18n>TSA_APPROVE}"\n\t\t\t\t\t\ttype="Accept"\n\t\t\t\t\t\ttap="_submit"></Button>\n\t\t\t\t</swipeContent>\n\t\t\t</List>\n\t\t</content>\n\t</Page>\n</core:View>',
	"hcm/mgr/approve/timesheet/view/S3.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("hcm.mgr.approve.timesheet.utility.Parser");
jQuery.sap.require("sap.ca.ui.message.message");

sap.ca.scfld.md.controller.BaseDetailController
.extend(
		"hcm.mgr.approve.timesheet.view.S3",
		{
			//Controller Hook method definitions
			extHookShowWeekData: null,
			extHookShowPeopleData: null,
			onInit : function() {
				// execute the onInit for the base class
				// BaseDetailController
				sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit
				.call(this);

				this.oBundle = this.oApplicationFacade
				.getResourceBundle();
				this.oDataModel = this.oApplicationFacade
				.getODataModel();

				this.self = this;
				this.selection = "";
				this.busyDialog = new sap.m.BusyDialog({customIcon: sap.ca.ui.images.images.Flower});
				hcm.mgr.approve.timesheet.utility.Parser.setControllerInstance(this);
				this.oRouter
				.attachRouteMatched(

						function(oEvent) {

							if (oEvent.getParameter("name") === "detail") {

								this.busyDialog.open();
								var contextPath = decodeURIComponent(oEvent
										.getParameter("arguments").contextPath);
								this.selection = contextPath
								.split("/")[1];
								var val = contextPath
								.split("/")[2];
								var cachedOData = hcm.mgr.approve.timesheet.utility.Parser
								.getCachedData();
								var onRequestSuccess = function(
										oData, oResponse) {
									var that = hcm.mgr.approve.timesheet.utility.Parser.getControllerInstance();
									var obj = oData.results;
									var timeModelData = new Object();
									var Employee = "";
									var Cost = "";
									that.model = new sap.ui.model.json.JSONModel();

									if (that.selection === "Employee") {
										Employee = hcm.mgr.approve.timesheet.utility.Parser
										.EmployeeData(obj);
										that.busyDialog.close();
										timeModelData.Employee = Employee;
										timeModelData.Employee[val].CostVisible = false;
										timeModelData.Employee[val].PeopleVisible = true;
										that.model
										.setData(timeModelData.Employee[val]);

										that.getView().byId(
										"operations")
										.setVisible(
												true);
										that.getView().byId(
										"cost")
										.setVisible(
												false);
									} else {
										Cost = hcm.mgr.approve.timesheet.utility.Parser
										.CostAssignmentData(obj);
										that.busyDialog.close();
										timeModelData.CA = Cost;
										timeModelData.CA[val].CostVisible = true;
										timeModelData.CA[val].PeopleVisible = false;
										that.model
										.setData(timeModelData.CA[val]);

										that.getView().byId(
										"cost")
										.setVisible(
												true);
										that.getView().byId(
										"operations")
										.setVisible(
												false);
									}
									that.getView().setModel(
											that.model,
									"DetailModel");

								};
								var onRequestFailed = function(
										oError) {
									//Note: 2052226 (error modifcation)
									/*
									sap.ca.ui.message
									.showMessageBox({
										type : sap.ca.ui.message.Type.ERROR,
										message : oError.message,
										details : oError.response.body
									});

									 */
									this.processError(oError);
									//Note: end 2052226 (error modifcation)
								};

								if(cachedOData){
									onRequestSuccess(cachedOData,this);
								}
								else{
									this.oDataModel
									.read(
											"Time_Pending",
											null,
											null,
											true,
											jQuery
											.proxy(
													onRequestSuccess,
													this),
													jQuery
													.proxy(
															onRequestFailed,
															this));
								}
							}
						}, this);

				this.oNotesList = new sap.m.List({
					inset : true
				});

				var oNoteLayout = new sap.m.VBox({
					items : [ this.oNotesList ]
				});
				var closePopover = function(that) {
					this.oPopoverNotes.close();
				};
				this.oPopoverNotes = new sap.m.ResponsivePopover({
					placement : sap.m.PlacementType.Bottom,
					title : this.oBundle.getText("TSA_DETAILS"),
					showHeader : true,
					content : [ oNoteLayout ],
					beginButton : new sap.m.Button({
						text : this.oBundle.getText("TSA_ACCEPT"),
						press : jQuery.proxy(closePopover, this)
					})
				});

				this.fetchRejectionReasons();
			},
			/**
			 * @private [fetchRejectionReasons fetch the rejection
			 *          reasons for rejection a time record]
			 */
			fetchRejectionReasons : function() {
				var that = this;
				var onRequestSuccess = function(oData, oResponse) {
					that._setRejection(oData, oResponse);
				};

				var onRequestFailed = function(oError) {
					//Note:2052226 (error modifcation)
					/*  		
					sap.ca.ui.message.showMessageBox({
						type : sap.ca.ui.message.Type.ERROR,
						message : oError.message,
						details : oError.response.body
					});
					 */
					this.processError(oError);
					//Note: end 2052226 (error modifcation)
				};
				this.oDataModel.read("Rej_Reason", null, null, true,
						jQuery.proxy(onRequestSuccess, this), jQuery
						.proxy(onRequestFailed, this));

			},
			/**
			 * @private [_setRejection display list of rejection
			 *          reasons]
			 * @param {[type]}
			 *            data
			 */
			_setRejection : function(data) {
				var that = this;
				var handler = this.self;
				//var selectedtype = this.selection;

				this.oReasons = data;
				var ojson = new sap.ui.model.json.JSONModel(
						this.oReasons);
				var oTitle = this.oBundle
				.getText("TSA_TIT_REJECTION_REASON");

				this.oDialog = new sap.m.SelectDialog({
					title : oTitle
				});
				var oItemTemplate1 = new sap.m.StandardListItem({
					title : "{Text}",
					type : "Active",
				});
				// attach close listener
				this.oDialog.attachConfirm(function(evt) {
					var selectedItem = evt.getParameter("id");
					if (selectedItem) {
						//note: set the correct rejection list item index
						/*	var len = selectedItem.length;
								len = len - 1;
								var list_index = selectedItem.charAt(len);*/
						var listSPath = evt.getParameters().selectedContexts[0].sPath;
						var listSPathSplit=listSPath.split("/");
						var list_index = listSPathSplit[2];
						//end note: set the correct rejection list item index
											that._onTap(list_index, /*event*/evt);//Note:2052226 event didn't exist in firefox, whereas evt existed in chrome, IE and Firefox

					}
				});

				this.oDialog
				.attachCancel(function(evt) {

					var path = "";
					var data = "";
					var modelName = "";

					if (/*selectedtype*/this.selection === "Employee") {    //Note: 2030153 the current selected model is reflected in this.selection
						modelName = "WeekModel";
					} else {
						modelName = "PeopleModel";
					}
					path = handler.getView()
					.getModel(modelName).oData.selectedPath;
					data = handler.getView()
					.getModel(modelName).oData.Days[path];
					data.Status = "A";
					that.switched.setState(true);//The switch should be set back to approve when the rejection reason popup is cancelled
					/*if(that.status === "R"){
						that.switched.setState(true);
					}*/
					data.RejectionReason = "";
					data.RejectionReasonText = "";
					handler.getView().getModel(modelName)
					.getData().Days[path] = data;
				},this); 													//Note: 2030153 

				//Note: 2030153  adding search functionality for rejection reason pop-up
				this.oDialog                                               
				.attachSearch(function(evt){
					var sValue = evt.getParameter("value");
					var oFilter = new sap.ui.model.Filter("Text", sap.ui.model.FilterOperator.Contains, sValue);
					var oBinding = evt.getSource().getBinding("items");
					oBinding.filter([oFilter]);
				});	
				//Note: 2030153  end adding search functionality for rejection reason pop-up						

				this.oDialog.setModel(ojson);
				this.oDialog.bindAggregation("items", "/results",
						oItemTemplate1);
			},
			/**
			 * @private [_onTap set the rejection reason for rejecting a
			 *          time record]
			 * @param list_index -
			 *            index of the selected item, oEvent - event
			 *            object
			 */
			_onTap : function(list_index, oEvent) {
				var modelName = "";

				if (this.selection == "Employee") {
					modelName = "WeekModel";
				} else {
					modelName = "PeopleModel";
				}
				var path = this.getView().getModel(modelName).oData.selectedPath;
				var data = this.getView().getModel(modelName).oData.Days[path];

				var listData = this.oDialog.getModel().oData.results[list_index];
				data.RejectionReason = listData.Reason;
				data.RejectionReasonText = listData.Text;

				this.getView().getModel(modelName).oData.Days[path] = data;
			},
			/**
			 * @private [showWeekData to display time recording for a
			 *          week based on employee]
			 * @param oEvent -
			 *            event object
			 */
			showWeekData : function(oEvent) {
				var text_day_visible = oEvent.oSource.mProperties.text;
				var selectedWeekPath = oEvent.oSource.oPropagatedProperties.oBindingContexts.DetailModel.sPath;
				var hidingData = this.getView().oModels.DetailModel.oData.Weeks;
				var index = selectedWeekPath.substring("7");
				var selectedWeekData = hidingData[index];

				if (text_day_visible === this.oBundle
						.getText("TSA_HIDE")) {
					selectedWeekData.DayVisible = false;
					selectedWeekData.DayVisibleText = this.oBundle
					.getText("TSA_SHOW");
				} else if (text_day_visible === this.oBundle
						.getText("TSA_SHOW")) {
					selectedWeekData.DayVisible = true;
					selectedWeekData.DayVisibleText = this.oBundle
					.getText("TSA_HIDE");
				}
				var weekJsonModel = new sap.ui.model.json.JSONModel();
				var data = this.getView().getModel("DetailModel")
				.getData();
				data.selectedWeek = selectedWeekData;

				weekJsonModel.setData(data);
				//this.getView().setModel(weekJsonModel, "DetailModel");
				oEvent.oSource.oParent.setModel(weekJsonModel, "DetailModel");
				var weekJsonModel2 = new sap.ui.model.json.JSONModel();
				weekJsonModel2.setData(selectedWeekData);
				this.getView().setModel(weekJsonModel2, "WeekModel");//uncommented to make WeekModel available in the view level
				oEvent.oSource.oParent.setModel(weekJsonModel2, "WeekModel");
				/**
				 * @ControllerHook Extend behavior of Show Week Data
				 * This hook method can be used to add UI or business logic 
				 * It is called when the ShowWeekData method executes
				 * @callback hcm.mgr.approve.timesheet.view.S3~extHookShowWeekData
				 */
				if(this.extHookShowWeekData) {
					this.extHookShowWeekData();
				};
			},
			/**
			 * @private [showPeopleData to display time recording for a
			 *          week based on cost assignment]
			 * @param oEvent -
			 *            event object
			 */
			showPeopleData : function(oEvent) {
				var text_day_visible = oEvent.oSource.mProperties.text;
				var selectedWeekPath = oEvent.oSource.oPropagatedProperties.oBindingContexts.DetailModel.sPath;
				var hidingData = this.getView().oModels.DetailModel.oData.Peoples;
				var index = selectedWeekPath.substring("9");
				var selectedWeekData = hidingData[index];

				if (text_day_visible === this.oBundle
						.getText("TSA_HIDE")) {
					selectedWeekData.DayVisible = false;
					selectedWeekData.DayVisibleText = this.oBundle
					.getText("TSA_SHOW");
				} else if (text_day_visible === this.oBundle
						.getText("TSA_SHOW")) {

					selectedWeekData.DayVisible = true;
					selectedWeekData.DayVisibleText = this.oBundle
					.getText("TSA_HIDE");
				}
				var weekJsonModel = new sap.ui.model.json.JSONModel();
				var data = this.getView().getModel("DetailModel")
				.getData();

				data.selectedWeek = selectedWeekData;

				weekJsonModel.setData(data);
				//	this.getView().setModel(weekJsonModel, "DetailModel");
				oEvent.oSource.oParent.setModel(weekJsonModel, "DetailModel");
				var weekJsonModel2 = new sap.ui.model.json.JSONModel();
				weekJsonModel2.setData(selectedWeekData);
				this.getView().setModel(weekJsonModel2, "PeopleModel");//uncommented to make PeopleModel available in the view level
				oEvent.oSource.oParent.setModel(weekJsonModel2, "PeopleModel");
				/**
				 * @ControllerHook Extend behavior of Show People Data
				 * This hook method can be used to add UI or business logic 
				 * It is called when the extHookShowPeopleData method executes
				 * @callback hcm.mgr.approve.timesheet.view.S3~extHookShowPeopleData
				 */
				if(this.extHookShowPeopleData) {
					this.extHookShowPeopleData();
				};
			},
			/**
			 * @private [displayNotesEmployee to display notes popover
			 *          for an employee]
			 * @param oEvent -
			 *            event object
			 */
			displayNotesEmployee : function(oEvent) {
				var notes = [];
				var oItemTemplateNote = new sap.m.StandardListItem({
					title : "{title}",
					description : "{description}"
				});

				var data = this.getView().getModel("DetailModel")
				.getData();
				var path = oEvent.oSource.oPropagatedProperties.oBindingContexts.WeekModel.sPath;
				var day_idx = path.split("/")[2];
				var week_idx = oEvent.oSource.oPropagatedProperties.oBindingContexts.DetailModel.sPath
				.split("/")[2];

				var selectedDay = data.Weeks[week_idx].Days[day_idx];
				notes.push({
					"title" : this.oBundle.getText("TSA_COST_ASSGNT"),
					"description" : selectedDay.Cotype + "-"
					+ selectedDay.Codesc
				});
				/*notes
								.push({
									"title" : this.oBundle.getText("TSA_DATE"),
									"description" : hcm.mgr.approve.timesheet.utility.Parser
											.parseDateDay(selectedDay.Workdate)
								});

						notes
								.push({
									"title" : this.oBundle
											.getText("TSA_ACTUAL_HOURS"),
									"description" : hcm.mgr.approve.timesheet.utility.Parser
											.parseTimeDisplay(selectedDay.Actualhours)
								});*/
				if (selectedDay.CatsText !== "") {
					notes.push({
						"title" : this.oBundle.getText("TSA_NOTE"),
						"description" : selectedDay.CatsText
					});
				}

				if (selectedDay.RejectionReasonText !== "") {
					notes.push({
						"title" : this.oBundle
						.getText("TSA_REJECTION_REASON"),
						"description" : selectedDay.RejectionReasonText
					});
				}

				if (selectedDay.Lgart !== "") {
					notes.push({
						"title" : this.oBundle
						.getText("TSA_WAGE_TYPE"),
						"description" : selectedDay.Lgart
					});
				}

				if (selectedDay.Lstar !== "") {
					notes.push({
						"title" : this.oBundle
						.getText("TSA_ACTIVITY_TYPE"),
						"description" : selectedDay.Lstar
					});
				}

				var noteJsonModel = new sap.ui.model.json.JSONModel();
				data.EmployeeNotes = notes;
				noteJsonModel.setData(data);
				this.oNotesList.bindAggregation("items",
						"/EmployeeNotes", oItemTemplateNote);
				this.oNotesList.setModel(noteJsonModel);
				this.oPopoverNotes
				.setPlacement(sap.m.PlacementType.Left);
				this.oPopoverNotes.openBy(sap.ui.getCore().byId(
						oEvent.mParameters.id));

			},
			/**
			 * @private [displayNotesCost to display notes popover for
			 *          cost assignment view]
			 * @param oEvent -
			 *            event object
			 */
			displayNotesCost : function(oEvent) {
				var notes = [];
				var oItemTemplateNote = new sap.m.StandardListItem({
					title : "{title}",
					description : "{description}"
				});

				var data = this.getView().getModel("DetailModel")
				.getData();
				var path = oEvent.oSource.oPropagatedProperties.oBindingContexts.PeopleModel.sPath;
				var day_idx = path.split("/")[2];
				var week_idx = oEvent.oSource.oPropagatedProperties.oBindingContexts.DetailModel.sPath
				.split("/")[2];

				var selectedDay = data.Peoples[week_idx].Days[day_idx];
				notes.push({
					"title" : this.oBundle.getText("TSA_COST_ASSGNT"),
					"description" : data.Cotype + "-"
					+ data.Codesc
				});
				/*notes
								.push({
									"title" : this.oBundle.getText("TSA_DATE"),
									"description" : hcm.mgr.approve.timesheet.utility.Parser
											.parseDateDay(selectedDay.Workdate)
								});

						notes
								.push({
									"title" : this.oBundle
											.getText("TSA_ACTUAL_HOURS"),
									"description" : hcm.mgr.approve.timesheet.utility.Parser
											.parseTimeDisplay(selectedDay.Actualhours)
								});*/
				if (selectedDay.CatsText !== "") {
					notes.push({
						"title" : this.oBundle.getText("TSA_NOTE"),
						"description" : selectedDay.CatsText
					});
				}

				if (selectedDay.RejectionReasonText !== "") {
					notes.push({
						"title" : this.oBundle
						.getText("TSA_REJECTION_REASON"),
						"description" : selectedDay.RejectionReasonText
					});
				}
				if (selectedDay.Lgart !== "") {
					notes.push({
						"title" : this.oBundle
						.getText("TSA_WAGE_TYPE"),
						"description" : selectedDay.Lgart
					});
				}

				if (selectedDay.Lstar !== "") {
					notes.push({
						"title" : this.oBundle
						.getText("TSA_ACTIVITY_TYPE"),
						"description" : selectedDay.Lstar
					});
				}

				var noteJsonModel = new sap.ui.model.json.JSONModel();
				data.CostNotes = notes;
				noteJsonModel.setData(data);
				this.oNotesList.bindAggregation("items", "/CostNotes",
						oItemTemplateNote);
				this.oNotesList.setModel(noteJsonModel);
				this.oPopoverNotes
				.setPlacement(sap.m.PlacementType.Left);
				this.oPopoverNotes.openBy(sap.ui.getCore().byId(
						oEvent.mParameters.id));

			},
			/**
			 * @private [updateStatus change handler for switch in
			 *          employee detail]
			 * @param oEvent -
			 *            event object
			 */
			updateStatus : function(oEvent) {
				//Note: WeekModel update
				var selectedWeekPath = oEvent.oSource.oPropagatedProperties.oBindingContexts.DetailModel.sPath;
				var hidingData = this.getView().oModels.DetailModel.oData.Weeks;
				var index = selectedWeekPath.substring("7");
				var selectedWeekData = hidingData[index];
				var data1 = this.getView().getModel("DetailModel").getData();
				data1.selectedWeek = selectedWeekData;
				var weekJsonModel2 = new sap.ui.model.json.JSONModel();
				weekJsonModel2.setData(selectedWeekData);
				this.getView().setModel(weekJsonModel2, "WeekModel");//uncommented to make WeekModel available in the view level
				//Note: end WeekModel update
				var pathEmp = oEvent.oSource.oPropagatedProperties.oBindingContexts.WeekModel.sPath
				.split("/")[2];
				var data = oEvent.oSource.oPropagatedProperties.oBindingContexts.WeekModel.oModel.oData.Days[pathEmp];
				var currentStatus = data.Status;
				this.switched = oEvent.oSource;
				// set the rejection status to 'A' or 'R' based on the
				// current status value
				var newStatus = (currentStatus === "A") ? "R" : "A";
				this.status = currentStatus;
				data.Status = newStatus;
				var model = this.getView().getModel("WeekModel").oData;
				model.selectedPath = pathEmp;
				this.getView().getModel("WeekModel").oData = model;

				if (newStatus === "A") {
					data.RejectionReason = "";
					data.RejectionReasonText = "";
					oEvent.oSource.oPropagatedProperties.oBindingContexts.WeekModel.oModel.oData.Days[pathEmp] = data;
				} else {
					// open the rejection dialog
					this.oDialog.open();
				}
			},
			/**
			 * @private [updateStatus_CA change handler for switch in
			 *          cost assignment detail]
			 * @param oEvent -
			 *            event object
			 */
			updateStatus_CA : function(oEvent) {
				//Note: WeekModel update
				var selectedWeekPath = oEvent.oSource.oPropagatedProperties.oBindingContexts.DetailModel.sPath;
				var hidingData = this.getView().oModels.DetailModel.oData.Peoples;
				var index = selectedWeekPath.substring("9");
				var selectedWeekData = hidingData[index];
				var data1 = this.getView().getModel("DetailModel").getData();
				data1.selectedWeek = selectedWeekData;
				var weekJsonModel2 = new sap.ui.model.json.JSONModel();
				weekJsonModel2.setData(selectedWeekData);
				this.getView().setModel(weekJsonModel2, "PeopleModel");//uncommented to make PeopleModel available in the view level
				//Note: end WeekModel update
				var pathCA = oEvent.oSource.oPropagatedProperties.oBindingContexts.PeopleModel.sPath
				.split("/")[2];
				var data = oEvent.oSource.oPropagatedProperties.oBindingContexts.PeopleModel.oModel.oData.Days[pathCA];
				var currentStatus = data.Status;
				this.switched = oEvent.oSource;
				// set the rejection status to 'A' or 'R' based on the
				// current status value
				var newStatus = (currentStatus === "A") ? "R" : "A";
				this.status = currentStatus;
				data.Status = newStatus;
				var model = this.getView().getModel("PeopleModel").oData;
				model.selectedPath = pathCA;
				this.getView().getModel("PeopleModel").oData = model;

				if (newStatus === "A") {
					data.RejectionReason = "";
					data.RejectionReasonText = "";
					oEvent.oSource.oPropagatedProperties.oBindingContexts.WeekModel.oModel.oData.Days[pathCA] = data;
				} else {
					// open the rejection dialog
					this.oDialog.open();
				}
			},
			/**
			 * @public [getHeaderFooterOptions Define header & footer
			 *         options]
			 */
			getHeaderFooterOptions : function() {
				var that = this;
				return {
					sI18NDetailTitle : "TSA_APP",
					oEditBtn : {
						sI18nBtnTxt : "TSA_SUBMIT",
						onBtnPressed : function(evt) {
							that.openDialog(evt);
						}
					},
					oAddBookmarkSettings : {
						title : that.oBundle.getText("TSA_APP"),
						icon : "sap-icon://entry-request"
					},
					onBack : jQuery.proxy(function() {
						// Check if a navigation to master is the
						// previous entry in the history
						var sDir = sap.ui.core.routing.History
						.getInstance().getDirection(
								this.oRouter.getURL("master"));
						if (sDir === "Backwards") {
							window.history.go(-1);
						} else {
							// we came from somewhere else - create the
							// master view
							this.oRouter.navTo("master");
						}
					}, this)

				};
			},
			/**
			 * @private [openDialog confirmation dialog to approve the
			 *          time records]
			 * @param oEvent -
			 *            event object
			 */
			openDialog : function(event) {
				var that = this.self;

				var text_1 = this.oBundle.getText("TSA_CONF");
				var selectedtype = this.selection;
				// provide your callback function, so that you can get
				// informed if the enduser confirms or cancels the
				// dialog
				var fnClose = function(oResult) {
					if (oResult) {

						if (oResult.isConfirmed == true) {
							if (selectedtype === "Employee")
								that.peopleSubmit();
							else
								that.costSubmit();
						}
					}
				};

				// open the confirmation dialog
				sap.ca.ui.dialog.confirmation.open({
					question : text_1,
					title : this.oBundle.getText("TSA_CONF_HEADER"),
					confirmButtonLabel : this.oBundle
					.getText("TSA_ACCEPT")
				}, jQuery.proxy(fnClose, this));

			},
			/**
			 * @private [peopleSubmit approve the time records for
			 *          employee]
			 */
			peopleSubmit : function() {
				var str = "cats='";
				var sendData = this.getView().getModel("DetailModel").oData;

				for ( var i = 0; i < sendData.Weeks.length; i++) {
					var res = sendData.Weeks[i].Days;
					for ( var j = 0; j < res.length; j++) {
						str += sendData.Pernr + "," + res[j].Counter+ "," + res[j].Status + ","+ res[j].RejectionReason + "/";
					}
				}
				str += "'";
				var collection = "Cats_Action?" + str;

				/*
				 * success handler,navigate to master -reload the list
				 */
				var onRequestSuccess = function(oData, oResponse) {
					hcm.mgr.approve.timesheet.utility.Parser
					.setCachedData(oData);
					sap.ca.ui.message.showMessageToast(this.oBundle
							.getText("CATS_SUCCESS_MESSAGE"));
					this.self.oRouter.navTo("master");
				};
				/*
				 * failure handler
				 */
				var onRequestFailed = function(oError) {
					//Note:2052226 (error modifcation)
					/*
					sap.ca.ui.message.showMessageBox({
						type : sap.ca.ui.message.Type.ERROR,
						message : oError.message,
						details : oError.response.body
					});
					 */
					this.processError(oError);
					//Note: end 2052226 (error modifcation)
				};

				// make post service call
				this.oDataModel.create(collection, null, null, jQuery
						.proxy(onRequestSuccess, this), jQuery.proxy(
								onRequestFailed, this));

			},
			/**
			 * @private [costSubmit approve the time records for cost
			 *          assignment view]
			 */
			costSubmit : function() {

				var str = "cats='";
				var sendData = this.getView().getModel("DetailModel").oData;

				for ( var i = 0; i < sendData.Peoples.length; i++) {
					var res = sendData.Peoples[i].Days;
					for ( var j = 0; j < res.length; j++) {
						str += sendData.Peoples[i].Pernr + ","+ res[j].Counter + "," + res[j].Status+ "," + res[j].RejectionReason + "/";
					}
				}
				str += "'";
				var collection = "Cats_Action?" + str;

				/*
				 * success handler,navigate to master -reload the list
				 */
				var onRequestSuccess = function(oData, oResponse) {
					hcm.mgr.approve.timesheet.utility.Parser
					.setCachedData(null);
					sap.ca.ui.message.showMessageToast(this.oBundle
							.getText("CATS_SUCCESS_MESSAGE"));
					this.self.oRouter.navTo("master");
				};
				/*
				 * failure handler
				 */
				var onRequestFailed = function(oError) {
					//Note: 2052226 (error modifcation)
					/*
					sap.ca.ui.message.showMessageBox({
						type : sap.ca.ui.message.Type.ERROR,
						message : oError.message,
						details : oError.response.body
					});
					 */
					this.processError(oError);
					//Note: end 2052226 (error modifcation)
				};

				// make post service call
				this.oDataModel.create(collection, null, null, jQuery
						.proxy(onRequestSuccess, this), jQuery.proxy(
								onRequestFailed, this));
			},
			/**
			 * @public [isMainScreen describe whether this view is the main detail (S3) screen or a screen on deeper hierarchy level]
			 */
			isMainScreen : function(){
				return true;
			},

			//Processes the error    								Note: 2052226 (error modifcation)
			processError : function(oError) {

				var errorBody = jQuery.parseJSON(oError.valueOf().response.body);
				var errorValue = errorBody.error.message.value;
				var messageDetails = "";
				var innerError = errorBody.error.innererror;
				var length = innerError.errordetails.length;
				for(var i=0 ;i<length; i++){
					messageDetails = messageDetails + innerError.errordetails[i].message + "\n";
				}
				sap.ca.ui.message.showMessageBox({
					type : sap.ca.ui.message.Type.ERROR,
					message : errorValue,
					details : messageDetails
				});

			},
			//Note: end 2052226 (error modifcation)
		});
},
	"hcm/mgr/approve/timesheet/view/S3.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n    xmlns:core="sap.ui.core"\n    xmlns:layout="sap.ui.layout"\n    xmlns="sap.m"\n    controllerName="hcm.mgr.approve.timesheet.view.S3">\n    <Page title="{i18n>TSA_APP}" showNavButton="{device>/showNavButton}">\n        <content>\n            <ObjectHeader\n                title="{DetailModel>/EmpName}"\n                number="{DetailModel>/Completion}" numberUnit="{i18n>TSA_COMPLETED}"\n                visible="{DetailModel>/PeopleVisible}">\n                <attributes>\n                    <ObjectAttribute\n                        id="ATTR1"\n                        text="{DetailModel>/Posname}" />\n                </attributes>\n                <firstStatus>\n                    <ObjectStatus text="{path:\'DetailModel>Overtime\', formatter:\'hcm.mgr.approve.timesheet.utility.Parser.parseOverTime\'}"></ObjectStatus>\n                </firstStatus>\n                <!-- extension point for additional fields -->\n                <core:ExtensionPoint name="extS3Header"></core:ExtensionPoint>\n            </ObjectHeader>\n            <Table\n                headerDesign="Standard"\n                id="operations"\n                inset="true"\n                items="{DetailModel>/Weeks}"\n                growing="true"\n                growingThreshold="20"\n                growingScrollToLoad="true"\n                mode="None"\n                visible="false"\n                showNoData="false">\n                <columns>\n                    <Column\n                        hAlign="Left"\n                        width="200px"\n                        demandPopin="true">\n                        <header>\n                            <Label\n                                design="Bold"\n                                text="{i18n>TSA_WEEKS}" />\n                        </header>\n                    </Column>\n                    <Column\n                        hAlign="Left"\n                        minScreenWidth="2000px"\n                        demandPopin="true">\n                        <!-- <header> <Label design="Bold" /> </header> -->\n                    </Column>\n                    <Column\n                        hAlign="Left"\n                        minScreenWidth="Tablet"\n                        width="100px"\n                        demandPopin="true">\n                        <header>\n                            <Label\n                                design="Bold"\n                                text="{i18n>TSA_RECORDED}" />\n                        </header>\n                    </Column>\n                    <Column\n                        hAlign="Left"\n                        width="80px"\n                        minScreenWidth="Tablet"\n                        demandPopin="true">\n                        <header>\n                            <Label\n                                design="Bold"\n                                text="{i18n>TSA_COMPLETED}" />\n                        </header>\n                    </Column>\n                    <Column\n                        hAlign="Left"\n                        width="70px"\n                        minScreenWidth="Tablet"\n                        demandPopin="true">\n                    </Column>\n                </columns>\n                <items>\n                    <ColumnListItem type="Inactive">\n                        <cells>\n                            <layout:VerticalLayout\n                                id="TSA_LIST_WEEKENTRY_WeekNrCell"\n                                direction="Column">\n                                <layout:content>\n                                    <Text\n                                        id="TSA_TXT_WEEK"\n                                        text="{parts: [{path:\'i18n>TSA_WEEK\'},{path:\'DetailModel>Weeknr\'}]}"\n                                        maxLines="0"></Text>\n                                    <Text\n                                        text="{parts: [{path:\'DetailModel>Weekstart\'},{path:\'DetailModel>Weekend\'}], formatter:\'hcm.mgr.approve.timesheet.utility.Parser.parseDateWeek\'}"\n                                        maxLines="0"></Text>\n                                </layout:content>\n                            </layout:VerticalLayout>\n                            <layout:VerticalLayout\n                                id="TSA_LIST_WEEKENTRY_DaysCell"\n                                class="tsaList_RemovePadding"\n                                visible="{path:\'DetailModel>DayVisible\'}">\n                                <layout:content>\n                                    <layout:VerticalLayout content="{WeekModel>/Days}">\n                                        <layout:content>\n                                            <Table\n                                                id="TSA_LIST_DAYENTRY"\n                                                headerDesign="Standard"\n                                               \n                                                mode="None"\n                                                showNoData="false"\n                                                inset="true"\n                                                headerText="{path: \'WeekModel>Workdate\', formatter:\'hcm.mgr.approve.timesheet.utility.Parser.parseDateDay\'}">\n                                                <columns>\n                                                    <Column\n                                                        id="TSA_LIST_DAYENTRY_SwitchCol"\n                                                        width="100px"\n                                                        hAlign="Left"\n                                                        \n                                                        demandPopin="true"></Column>\n                                                    <Column\n                                                        id="TSA_LIST_DAYENTRY_DescCol"\n                                                        hAlign="Left"\n                                                        width="200px"\n                                                        minScreenWidth="Tablet"\n                                                        demandPopin="true"></Column>\n                                                    <Column\n                                                        id="TSA_LIST_DAYENTRY_TimeCol"\n                                                        width="100px"\n                                                        hAlign="Left"\n                                                        minScreenWidth="Tablet"\n                                                        demandPopin="true"></Column>\n                                                    <Column\n                                                        id="TSA_LIST_DAYENTRY_NotesCol"\n                                                        width="50px"\n                                                        hAlign="Left"\n                                                        \n                                                        demandPopin="true"></Column>\n                                                </columns>\n                                                <items>\n                                                    <ColumnListItem id="TSA_LIST_DAY_COL_LIST">\n                                                        <cells>\n                                                            <Switch\n                                                                id="TSA_LIST_DAYENTRY_SwitchCell"\n                                                                state="{path:\'WeekModel>Status\', formatter:\'hcm.mgr.approve.timesheet.utility.Parser.statusToBoolean\'}"\n                                                                type="AcceptReject"\n                                                                change="updateStatus"></Switch>\n                                                            <layout:VerticalLayout\n                                                                id="TSA_LIST_DAYENTRY_DescCell"\n                                                                direction="Column">\n                                                                <layout:content>\n                                                                    <Text\n                                                                        text="{parts:[{path:\'WeekModel>Cotype\'},{path:\'WeekModel>Codesc\'}], formatter:\'hcm.mgr.approve.timesheet.utility.Parser.projectCode\'}"\n                                                                        maxLines="0"></Text>\n                                                                    <Text\n                                                                        text="{path:\'WeekModel>TimeText\'}"\n                                                                        maxLines="0"></Text>\n                                                                </layout:content>\n                                                            </layout:VerticalLayout>\n                                                            <Text\n                                                                id="TSA_LIST_DAYENTRY_TimeCell"\n                                                                text="{path:\'WeekModel>Actualhours\', formatter:\'hcm.mgr.approve.timesheet.utility.Parser.parseTimeDisplay\'}"\n                                                                maxLines="0"></Text>\n                                                            <Button\n                                                                id="TSA_LIST_DAYENTRY_NotesCell"\n                                                                icon="sap-icon://notes"\n                                                                press="displayNotesEmployee"></Button>\n                                                        </cells>\n                                                    </ColumnListItem>\n                                                </items>\n                                            </Table>\n                                        </layout:content>\n                                    </layout:VerticalLayout>\n                                </layout:content>\n                            </layout:VerticalLayout>\n                            <layout:VerticalLayout\n                                id="TSA_LIST_WEEKENTRY_RecCell"\n                                direction="Column">\n                                <layout:content>\n                                    <Text\n                                        id="TSA_TXT_RECORDED"\n                                        text="{path:\'DetailModel>Actualhours\', formatter:\'hcm.mgr.approve.timesheet.utility.Parser.parseTimeDisplay\'}"\n                                        maxLines="0"></Text>\n                                    <Label\n                                        class="tsaOvertime"\n                                        text="{path:\'DetailModel>Overtime\', formatter:\'hcm.mgr.approve.timesheet.utility.Parser.parseOverTime\'}"></Label>\n                                </layout:content>\n                            </layout:VerticalLayout>\n                            <Text\n                                id="TSA_TXT_PERCENTAGE"\n                                text="{path:\'DetailModel>Percentage\'}"\n                                maxLines="0"></Text>\n                            <Link\n                                id="TSA_LIST_WEEKENTRY_VisibleTextCell"\n                                press="showWeekData"\n                                text="{path:\'DetailModel>DayVisibleText\'}"></Link>\n                        \n                        </cells>\n                    </ColumnListItem>\n                </items>\n                <!-- extension point for additional fields -->\n                 <core:ExtensionPoint name="extS3Table"></core:ExtensionPoint>\n            </Table>\n            <!--Cost Assignment -->\n            <ObjectHeader\n                title="{parts:[{path:\'DetailModel>/Cotype\'},{path:\'DetailModel>/Codesc\'}],formatter:\'hcm.mgr.approve.timesheet.utility.Parser.projectTitle\'}"\n                number="{DetailModel>/No_People}"\n                numberUnit="{i18n>TSA_PEOPLE}"\n                visible="{DetailModel>/CostVisible}">\n                <firstStatus>\n                    <ObjectStatus text="{path:\'DetailModel>Overtime\', formatter:\'hcm.mgr.approve.timesheet.utility.Parser.parseOverTime\'}"></ObjectStatus>\n                </firstStatus>\n                <!-- extension point for additional fields -->\n                <core:ExtensionPoint name="extS3CostHeader"></core:ExtensionPoint>\n            </ObjectHeader>\n            <Table\n                headerDesign="Standard"\n                id="cost"\n                inset="true"\n                items="{DetailModel>/Peoples}"\n                growing="true"\n                growingThreshold="20"\n                growingScrollToLoad="true"\n                mode="None"\n                visible="false"\n                showNoData="false">\n                <columns>\n                    <Column\n                        hAlign="Left"\n                        width="100px"\n                        demandPopin="true">\n                        <header>\n                            <Label\n                                design="Bold"\n                                text="{i18n>TSA_PEOPLE}" />\n                        </header>\n                    </Column>\n                    <Column\n                        hAlign="Left"\n                        minScreenWidth="2000px"\n                        demandPopin="true">\n                        <!-- <header> <Label design="Bold" /> </header> -->\n                    </Column>\n                    <Column\n                        hAlign="Left"\n                        minScreenWidth="Tablet"\n                        width="50px"\n                        demandPopin="true">\n                        <header>\n                            <Label\n                                design="Bold"\n                                text="{i18n>TSA_RECORDED}" />\n                        </header>\n                    </Column>\n                    <Column\n                        hAlign="Left"\n                        width="80px"\n                        minScreenWidth="Tablet"\n                        demandPopin="true">\n                    </Column>\n                </columns>\n                <items>\n                    <ColumnListItem type="Inactive">\n                        <cells>\n                            <layout:VerticalLayout\n                                id="TSA_LIST_PEOPLEENTRY_TitleCell"\n                                direction="Column">\n                                <layout:content>\n                                    <Text text="{path:\'DetailModel>EmpName\'}"></Text>\n                                    <Text text="{path:\'DetailModel>Posname\'}"></Text>\n                                </layout:content>\n                            </layout:VerticalLayout>\n                            <layout:VerticalLayout\n                                id="TSA_LIST_PEOPLEENTRY_DaysCell"\n                                class="tsaList_RemovePadding"\n                                visible="{path:\'DetailModel>DayVisible\'}">\n                                <layout:content>\n                                    <layout:VerticalLayout content="{PeopleModel>/Days}">\n                                        <layout:content>\n                                            <Table\n                                                id="TSA_CA_LIST_DAYENTRY"\n                                                headerDesign="Standard"\n                                               \n                                                mode="None"\n                                                showNoData="false"\n                                                inset="true"\n                                                headerText="{path: \'PeopleModel>Workdate\', formatter:\'hcm.mgr.approve.timesheet.utility.Parser.parseDateDay\'}">\n                                                <columns>\n                                                    <Column\n                                                        id="TSA_CA_LIST_DAYENTRY_SwitchCol"\n                                                        width="100px"\n                                                        hAlign="Left"\n                                                        demandPopin="true"></Column>\n                                                    <Column\n                                                        id="TSA_CA_LIST_DAYENTRY_DescCol"\n                                                        hAlign="Left"\n                                                        width="200px"\n                                                        minScreenWidth="Tablet"\n                                                        demandPopin="true"></Column>\n                                                    <Column\n                                                        id="TSA_CA_LIST_DAYENTRY_TimeCol"\n                                                        width="100px"\n                                                        hAlign="Left"\n                                                        minScreenWidth="Tablet"\n                                                        demandPopin="true"></Column>\n                                                    <Column\n                                                        id="TSA_CA_LIST_DAYENTRY_NotesCol"\n                                                        width="50px"\n                                                        hAlign="Left"\n                                                        demandPopin="true"></Column>\n                                                </columns>\n                                                <items>\n                                                    <ColumnListItem id="TSA_CA_LIST_DAY_COL_LIST">\n                                                        <cells>\n                                                            <Switch\n                                                                id="TSA_CA_LIST_DAYENTRY_SwitchCell"\n                                                                state="{path:\'PeopleModel>Status\', formatter:\'hcm.mgr.approve.timesheet.utility.Parser.statusToBoolean\'}"\n                                                                type="AcceptReject"\n                                                                change="updateStatus_CA"></Switch>\n                                                            <Text\n                                                                text="{path:\'PeopleModel>TimeText\'}"\n                                                                maxLines="0"></Text>\n                                                            <Text\n                                                                id="TSA_CA_LIST_DAYENTRY_TimeCell"\n                                                                text="{path:\'PeopleModel>Actualhours\', formatter:\'hcm.mgr.approve.timesheet.utility.Parser.parseTimeDisplay\'}"\n                                                                maxLines="0"></Text>\n                                                            <Button\n                                                                id="TSA_CA_LIST_DAYENTRY_NotesCell"\n                                                                icon="sap-icon://notes"\n                                                                press="displayNotesCost"></Button>\n                                                         \n                                                        </cells>\n                                                    </ColumnListItem>\n                                                </items>\n                                            </Table>\n                                        </layout:content>\n                                    </layout:VerticalLayout>\n                                </layout:content>\n                            </layout:VerticalLayout>\n                            <layout:VerticalLayout\n                                id="TSA_LIST_PEOPLEENTRY_RecCell"\n                                direction="Column">\n                                <layout:content>\n                                    <Text\n                                        text="{path:\'DetailModel>Actualhours\', formatter:\'hcm.mgr.approve.timesheet.utility.Parser.parseTimeDisplay\'}"\n                                        maxLines="0"></Text>\n                                    <Label\n                                        class="tsaOvertime"\n                                        text="{path:\'DetailModel>Overtime\', formatter:\'hcm.mgr.approve.timesheet.utility.Parser.parseOverTime\'}"></Label>\n                                </layout:content>\n                            </layout:VerticalLayout>\n                            <Link\n                                id="TSA_CA_LIST_WEEKENTRY_VisibleTextCell"\n                                press="showPeopleData"\n                                text="{path:\'DetailModel>DayVisibleText\'}"></Link>\n                        </cells>\n                    </ColumnListItem>\n                </items>\n                <!-- extension point for additional fields -->\n                <core:ExtensionPoint name="extS3TableCA"></core:ExtensionPoint>\n            </Table>\n        </content>\n        <footer>\n            <Bar>\n            </Bar>\n        </footer>\n    </Page>\n</core:View>'
}});
