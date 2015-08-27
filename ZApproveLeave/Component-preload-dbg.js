jQuery.sap.registerPreloadedModules({
"name":"hcm/mgr/approve/leaverequests/Component-preload",
"version":"2.0",
"modules":{
	"hcm/mgr/approve/leaverequests/Component.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// define a root UIComponent which exposes the main view
jQuery.sap.declare("hcm.mgr.approve.leaverequests.Component");
jQuery.sap.require("hcm.mgr.approve.leaverequests.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

// new Component
sap.ca.scfld.md.ComponentBase
	.extend(
		"hcm.mgr.approve.leaverequests.Component", {

			metadata: sap.ca.scfld.md.ComponentBase.createMetaData("MD", {
				"name": "Approve Leave Requests", //F0399
				"version": "1.4.1",
				"library": "hcm.mgr.approve.leaverequests",
				"includes": [],
				"dependencies": {
					"libs": ["sap.m", "sap.me"],
					"components": []
				},
				"config": {
					"titleResource": "app.Identity",
					"resourceBundle": "i18n/i18n.properties",
					"icon": "sap-icon://card",
					"favIcon": "./resources/sap/ca/ui/themes/base/img/favicon/Approve_Leave_Requests.ico",
					"homeScreenIconPhone": "./resources/sap/ca/ui/themes/base/img/launchicon/Approve_Leave_Requests/57_iPhone_Desktop_Launch.png",
					"homeScreenIconPhone@2": "./resources/sap/ca/ui/themes/base/img/launchicon/Approve_Leave_Requests/114_iPhone-Retina_Web_Clip.png",
					"homeScreenIconTablet": "./resources/sap/ca/ui/themes/base/img/launchicon/Approve_Leave_Requests/72_iPad_Desktop_Launch.png",
					"homeScreenIconTablet@2": "./resources/sap/ca/ui/themes/base/img/launchicon/Approve_Leave_Requests/144_iPad_Retina_Web_Clip.png"
				},

				// Navigation related properties
				masterPageRoutes: {
					"master": {
						"pattern": ":scenarioId:",
						"view": "hcm.mgr.approve.leaverequests.view.S2"
					}
				},
				detailPageRoutes: {
					"detail": {
						"pattern": "detail/{contextPath}",
						"view": "hcm.mgr.approve.leaverequests.view.S3"
					},
					"calendar": {
						"pattern": "calendar/{SAP__Origin}/{RequestId}/{StartDate}",
						"view": "hcm.mgr.approve.leaverequests.view.S4"
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
				},
					oView = sap.ui.view({
						viewName: "hcm.mgr.approve.leaverequests.Main",
						type: sap.ui.core.mvc.ViewType.XML,
						viewData: oViewData
					}),
					sPrefix = oView.getId() + "--",
					oEventBus = sap.ui.getCore().getEventBus();

				this.oEventBus = {
					publish: function(channelId, eventId, data) {
						channelId = sPrefix + channelId;
						oEventBus.publish(channelId, eventId, data);
					},
					subscribe: function(channelId, eventId, data, oListener) {
						channelId = sPrefix + channelId;
						oEventBus.subscribe(channelId, eventId, data, oListener);
					},
					unsubscribe: function(channelId, eventId, data, oListener) {
						channelId = sPrefix + channelId;
						oEventBus.unsubscribe(channelId, eventId, data, oListener);
					}
				};
				
				return oView;
			}

		});
},
	"hcm/mgr/approve/leaverequests/Configuration.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mgr.approve.leaverequests.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ca.scfld.md.ConfigurationBase.extend("hcm.mgr.approve.leaverequests.Configuration", {

    oServiceParams: {
        serviceList: [{
            name: "LEAVEAPPROVAL",
            masterCollection: "LeaveRequestCollection",
            serviceUrl: "/sap/opu/odata/GBHCM/LEAVEAPPROVAL;mo/",
            isDefault: true,
            mockedDataSource: "/hcm.mgr.approve.leaverequests/model/metadata.xml"
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
        return ["RequestId"];
    },

    setApplicationFacade: function(oApplicationFacade) {
        hcm.mgr.approve.leaverequests.Configuration.oApplicationFacade = oApplicationFacade;
    }
});
},
	"hcm/mgr/approve/leaverequests/Main.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("hcm.mgr.approve.leaverequests.Main", {

	onInit: function() {
		jQuery.sap.require("sap.ca.scfld.md.Startup");
		sap.ca.scfld.md.Startup.init("hcm.mgr.approve.leaverequests", this);
	}
});
},
	"hcm/mgr/approve/leaverequests/Main.view.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<core:View\r\n\txmlns:core="sap.ui.core"\r\n\txmlns="sap.m"\r\n\tcontrollerName="hcm.mgr.approve.leaverequests.Main"\r\n\tdisplayBlock="true"\r\n\theight="100%">\r\n\t<NavContainer\r\n\t\tid="fioriContent"\r\n\t\tshowHeader="false">\r\n\t</NavContainer>\r\n</core:View>',
	"hcm/mgr/approve/leaverequests/i18n/i18n.properties":'# Texts for the leaverequest approval app\r\n# __ldi.translation.uuid=4c3033c0-3a57-11e3-aa6e-0800200c9a66\r\n# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Days=days\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Day_Singular=day\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Hours=hours\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Hour_Singular=hour\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Value_Days={0} days\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Value_Day_Singular={0} day\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Value_Hours={0} hours\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Value_Hour_Singular={0} hour\r\n\r\n# XFLD: Current Balance of the leave quote on Detail Screen\r\nview.AddInfo.CurrentBalance=Available Balance\r\n\r\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\r\nview.AddInfo.Requested=Requested\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPl={0} Overlaps\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\r\nutil.Conversions.OverlapSing={0} Overlap\r\n\r\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\r\nview.Detail.Request=Requested\r\n\r\n# YMSG: Alert message that current balance of leave request may not be accurate.\r\nview.AddInfo.AlertMessageBalanceNotAccurate=This person has recently submitted other leave requests. The balance may not be accurate.\r\n\r\n# XSEL: status of Leave Request: approved\r\nview.Calendar.LegendApproved=Approved Leave\r\n\r\n# XSEL: status of Leave Request: working day\r\nview.Calendar.LegendWorkingDay=Workday\r\n\r\n# XSEL: status of Leave Request: Open Request\r\nview.Calendar.LegendPending=Pending Approval\r\n\r\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\r\nview.Calendar.LegendDayOff=Non-Workday\r\n\r\n# XSEL: status of Leave Request: Public Holiday\r\nview.Calendar.LegendHoliday=Public Holiday\r\n\r\n# XSEL: status of Leave Request: Today\r\nview.Calendar.LegendToday=Today\r\n\r\n# XSEL: status of Leave Request:  deletion requested (i.e. cancellation of approved leave request has been requested)\r\nview.Calendar.LegendDeletionRequested=Cancellation Requested\r\n\r\n# YMSG: Toast message that approval of leave request was successful\r\nview.Toast.YMSG_LRA_Approved=Leave request was approved\r\n\r\n# YMSG: Toast message that reject of leave request was successful\r\nview.Toast.YMSG_LRA_Declined=Leave request was rejected\r\n\r\n# XTIT: Leave Request Details\r\nview.Detail.title=Leave Request\r\n\r\n# XTIT: Leave Request Details - Calendar\r\nview.Calendar.title=Calendar\r\n\r\n# XTIT: Leave Type\r\nview.AddInfo.LeaveType=Leave Type\r\n\r\n# XTIT: Personel Number\r\nview.Header.EmployeeID=Employee ID {0}\r\n\r\n# XTIT: Header text of Master List\r\nview.Master.title=Leave Requests ({0})\r\n\r\n# XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=Approve Leave Requests\r\n\r\n\r\n# XTIT: Title of Email to Employee on Business Card\r\nview.BusinessCard.Employee.Subject=Your Leave Request of Type {0}\r\n\r\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\r\nshell.Identity=Approve Leave Requests\r\n\r\n# YMSG\r\ndialog.question.approve=Approve the leave request submitted by {0}?\r\n\r\n# YMSG\r\ndialog.question.reject=Reject the leave request submitted by {0}?\r\n\r\n# YMSG\r\ndialog.question.approvecancel=Approve the cancellation submitted by {0}?\r\n\r\n# YMSG\r\ndialog.question.rejectcancel=Reject the cancellation submitted by {0}?\r\n\r\n# YMSG\r\ndialog.success.approvecancel=Cancellation was approved \r\n\r\n# YMSG\r\ndialog.success.rejectcancel=Cancellation was rejected\r\n\r\n# YMSG\r\ndialog.success.approve=Leave request was approved \r\n\r\n# YMSG\r\ndialog.success.reject=Leave request was rejected\r\n\r\n# YMSG: link to overlap calendar (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPlLink=Show Overlaps\r\n\r\n# YMSG: link to overlap calendar (e.g.  1 overlap, Singular)\r\nutil.Conversions.OverlapSingLink=Show Overlap\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.Header.CancellationStatus=Cancellation Requested\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.List.CancellationStatus=Cancelled\r\n\r\n#XBUT: Button for Approve action\r\nXBUT_APPROVE=Approve\r\n\r\n#XBUT: Button for Reject action\r\nXBUT_REJECT=Reject\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_APPROVAL=Approve\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_REJECT=Reject\r\n\r\n# YMSG: Loading\r\nLOADING=Loading...\r\n\r\n# XTIT: Leave Request Details\r\nDETAIL_TITLE=Leave Request\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=No items are currently available',
	"hcm/mgr/approve/leaverequests/i18n/i18n_ar.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Days=\\u0623\\u064A\\u0627\\u0645\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Day_Singular=\\u0627\\u0644\\u064A\\u0648\\u0645\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Hours=\\u0633\\u0627\\u0639\\u0627\\u062A\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Hour_Singular=\\u0633\\u0627\\u0639\\u0629\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Value_Days={0} \\u0645\\u0646 \\u0627\\u0644\\u0623\\u064A\\u0627\\u0645\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Value_Day_Singular={0} \\u064A\\u0648\\u0645\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Value_Hours={0} \\u0633\\u0627\\u0639\\u0629/\\u0633\\u0627\\u0639\\u0627\\u062A\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Value_Hour_Singular={0} \\u0633\\u0627\\u0639\\u0629\r\n\r\n# XFLD: Current Balance of the leave quote on Detail Screen\r\nview.AddInfo.CurrentBalance=\\u0627\\u0644\\u0631\\u0635\\u064A\\u062F \\u0627\\u0644\\u0645\\u062A\\u0648\\u0641\\u0631\r\n\r\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\r\nview.AddInfo.Requested=\\u0645\\u0637\\u0644\\u0648\\u0628\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPl={0} \\u0645\\u0646 \\u0627\\u0644\\u062A\\u062F\\u0627\\u062E\\u0644\\u0627\\u062A\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\r\nutil.Conversions.OverlapSing={0} \\u0645\\u0646 \\u0627\\u0644\\u062A\\u062F\\u0627\\u062E\\u0644\\u0627\\u062A\r\n\r\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\r\nview.Detail.Request=\\u0645\\u0637\\u0644\\u0648\\u0628\r\n\r\n# YMSG: Alert message that current balance of leave request may not be accurate.\r\nview.AddInfo.AlertMessageBalanceNotAccurate=\\u0642\\u0627\\u0645 \\u0647\\u0630\\u0627 \\u0627\\u0644\\u0634\\u062E\\u0635 \\u0645\\u0624\\u062E\\u0631\\u064B\\u0627 \\u0628\\u062A\\u0642\\u062F\\u064A\\u0645 \\u0637\\u0644\\u0628\\u0627\\u062A \\u0625\\u062C\\u0627\\u0632\\u0629 \\u0623\\u062E\\u0631\\u0649. \\u0642\\u062F \\u0644\\u0627 \\u064A\\u0643\\u0648\\u0646 \\u0627\\u0644\\u0631\\u0635\\u064A\\u062F \\u062F\\u0642\\u064A\\u0642\\u064B\\u0627.\r\n\r\n# XSEL: status of Leave Request: approved\r\nview.Calendar.LegendApproved=\\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629 \\u0627\\u0644\\u0645\\u0639\\u062A\\u0645\\u062F\\u0629\r\n\r\n# XSEL: status of Leave Request: working day\r\nview.Calendar.LegendWorkingDay=\\u064A\\u0648\\u0645 \\u0639\\u0645\\u0644\r\n\r\n# XSEL: status of Leave Request: Open Request\r\nview.Calendar.LegendPending=\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0645\\u0639\\u0644\\u0642\r\n\r\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\r\nview.Calendar.LegendDayOff=\\u0639\\u0637\\u0644\\u0629\r\n\r\n# XSEL: status of Leave Request: Public Holiday\r\nview.Calendar.LegendHoliday=\\u0639\\u0637\\u0644\\u0629 \\u0631\\u0633\\u0645\\u064A\\u0629\r\n\r\n# XSEL: status of Leave Request: Today\r\nview.Calendar.LegendToday=\\u0627\\u0644\\u064A\\u0648\\u0645\r\n\r\n# XSEL: status of Leave Request:  deletion requested (i.e. cancellation of approved leave request has been requested)\r\nview.Calendar.LegendDeletionRequested=\\u0645\\u0637\\u0644\\u0648\\u0628 \\u0627\\u0644\\u0625\\u0644\\u063A\\u0627\\u0621\r\n\r\n# YMSG: Toast message that approval of leave request was successful\r\nview.Toast.YMSG_LRA_Approved=\\u062A\\u0645 \\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\r\n\r\n# YMSG: Toast message that reject of leave request was successful\r\nview.Toast.YMSG_LRA_Declined=\\u062A\\u0645 \\u0631\\u0641\\u0636 \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\r\n\r\n# XTIT: Leave Request Details\r\nview.Detail.title=\\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\r\n\r\n# XTIT: Leave Request Details - Calendar\r\nview.Calendar.title=\\u0627\\u0644\\u062A\\u0642\\u0648\\u064A\\u0645\r\n\r\n# XTIT: Leave Type\r\nview.AddInfo.LeaveType=\\u0646\\u0648\\u0639 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\r\n\r\n# XTIT: Personel Number\r\nview.Header.EmployeeID=\\u0645\\u0639\\u0631\\u0641 \\u0627\\u0644\\u0645\\u0648\\u0638\\u0641 {0}\r\n\r\n# XTIT: Header text of Master List\r\nview.Master.title=\\u0637\\u0644\\u0628\\u0627\\u062A \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629 ({0})\r\n\r\n# XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0637\\u0644\\u0628\\u0627\\u062A \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\r\n\r\n\r\n# XTIT: Title of Email to Employee on Business Card\r\nview.BusinessCard.Employee.Subject=\\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629 \\u0627\\u0644\\u062E\\u0627\\u0635 \\u0628\\u0643\\: {0}\r\n\r\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\r\nshell.Identity=\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0637\\u0644\\u0628\\u0627\\u062A \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\r\n\r\n# YMSG\r\ndialog.question.approve=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629 \\u0627\\u0644\\u0645\\u0642\\u062F\\u0645 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629 {0}\\u061F\r\n\r\n# YMSG\r\ndialog.question.reject=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0631\\u0641\\u0636 \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629 \\u0627\\u0644\\u0645\\u0642\\u062F\\u0645 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629 {0}\\u061F\r\n\r\n# YMSG\r\ndialog.question.approvecancel=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0627\\u0644\\u0625\\u0644\\u063A\\u0627\\u0621 \\u0627\\u0644\\u0645\\u0642\\u062F\\u0645 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629 {0}\\u061F\r\n\r\n# YMSG\r\ndialog.question.rejectcancel=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0631\\u0641\\u0636 \\u0627\\u0644\\u0625\\u0644\\u063A\\u0627\\u0621 \\u0627\\u0644\\u0645\\u0642\\u062F\\u0645 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629 {0}\\u061F\r\n\r\n# YMSG\r\ndialog.success.approvecancel=\\u062A\\u0645 \\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0627\\u0644\\u0625\\u0644\\u063A\\u0627\\u0621\r\n\r\n# YMSG\r\ndialog.success.rejectcancel=\\u062A\\u0645 \\u0631\\u0641\\u0636 \\u0627\\u0644\\u0625\\u0644\\u063A\\u0627\\u0621\r\n\r\n# YMSG\r\ndialog.success.approve=\\u062A\\u0645 \\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\r\n\r\n# YMSG\r\ndialog.success.reject=\\u062A\\u0645 \\u0631\\u0641\\u0636 \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\r\n\r\n# YMSG: link to overlap calendar (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPlLink=\\u0625\\u0638\\u0647\\u0627\\u0631 \\u0627\\u0644\\u062A\\u062F\\u0627\\u062E\\u0644\\u0627\\u062A\r\n\r\n# YMSG: link to overlap calendar (e.g.  1 overlap, Singular)\r\nutil.Conversions.OverlapSingLink=\\u0625\\u0638\\u0647\\u0627\\u0631 \\u0627\\u0644\\u062A\\u062F\\u0627\\u062E\\u0644\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.Header.CancellationStatus=\\u0645\\u0637\\u0644\\u0648\\u0628 \\u0627\\u0644\\u0625\\u0644\\u063A\\u0627\\u0621\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.List.CancellationStatus=\\u062A\\u0645 \\u0627\\u0644\\u0625\\u0644\\u063A\\u0627\\u0621\r\n\r\n#XBUT: Button for Approve action\r\nXBUT_APPROVE=\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F\r\n\r\n#XBUT: Button for Reject action\r\nXBUT_REJECT=\\u0631\\u0641\\u0636\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_APPROVAL=\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_REJECT=\\u0631\\u0641\\u0636\r\n\r\n# YMSG: Loading\r\nLOADING=\\u062C\\u0627\\u0631\\u064D \\u0627\\u0644\\u062A\\u062D\\u0645\\u064A\\u0644...\r\n\r\n# XTIT: Leave Request Details\r\nDETAIL_TITLE=\\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=\\u0644\\u0627 \\u062A\\u062A\\u0648\\u0641\\u0631 \\u0623\\u064A \\u0639\\u0646\\u0627\\u0635\\u0631 \\u062D\\u0627\\u0644\\u064A\\u064B\\u0627\r\n',
	"hcm/mgr/approve/leaverequests/i18n/i18n_cs.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Days=Dny\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Day_Singular=Den\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Hours=Hodiny\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Hour_Singular=Hodina\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Value_Days={0} dn\\u00ED\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Value_Day_Singular={0} den\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Value_Hours={0} hodin\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Value_Hour_Singular={0} hodina\r\n\r\n# XFLD: Current Balance of the leave quote on Detail Screen\r\nview.AddInfo.CurrentBalance=Dostupn\\u00FD z\\u016Fstatek\r\n\r\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\r\nview.AddInfo.Requested=Po\\u017Eadov\\u00E1no\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPl={0} p\\u0159ekr\\u00FDv\\u00E1n\\u00ED\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\r\nutil.Conversions.OverlapSing={0} p\\u0159ekr\\u00FDv\\u00E1n\\u00ED\r\n\r\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\r\nview.Detail.Request=Po\\u017Eadov\\u00E1no\r\n\r\n# YMSG: Alert message that current balance of leave request may not be accurate.\r\nview.AddInfo.AlertMessageBalanceNotAccurate=Tato osoba ned\\u00E1vno podala dal\\u0161\\u00ED \\u017E\\u00E1dosti o dovolenou. Z\\u016Fstatek nemus\\u00ED b\\u00FDt p\\u0159esn\\u00FD.\r\n\r\n# XSEL: status of Leave Request: approved\r\nview.Calendar.LegendApproved=Schv\\u00E1len\\u00E1 dovolen\\u00E1\r\n\r\n# XSEL: status of Leave Request: working day\r\nview.Calendar.LegendWorkingDay=Pracovn\\u00ED den\r\n\r\n# XSEL: status of Leave Request: Open Request\r\nview.Calendar.LegendPending=\\u010Cek\\u00E1 na schv\\u00E1len\\u00ED\r\n\r\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\r\nview.Calendar.LegendDayOff=Nepracovn\\u00ED den\r\n\r\n# XSEL: status of Leave Request: Public Holiday\r\nview.Calendar.LegendHoliday=Sv\\u00E1tek\r\n\r\n# XSEL: status of Leave Request: Today\r\nview.Calendar.LegendToday=Dnes\r\n\r\n# XSEL: status of Leave Request:  deletion requested (i.e. cancellation of approved leave request has been requested)\r\nview.Calendar.LegendDeletionRequested=Po\\u017Eadov\\u00E1no zru\\u0161en\\u00ED\r\n\r\n# YMSG: Toast message that approval of leave request was successful\r\nview.Toast.YMSG_LRA_Approved=\\u0179\\u00E1dost o dovolenou byla schv\\u00E1lena\r\n\r\n# YMSG: Toast message that reject of leave request was successful\r\nview.Toast.YMSG_LRA_Declined=\\u0179\\u00E1dost o dovolenou byla zam\\u00EDtnuta\r\n\r\n# XTIT: Leave Request Details\r\nview.Detail.title=\\u017D\\u00E1dost o dovolenou\r\n\r\n# XTIT: Leave Request Details - Calendar\r\nview.Calendar.title=Kalend\\u00E1\\u0159\r\n\r\n# XTIT: Leave Type\r\nview.AddInfo.LeaveType=Typ dovolen\\u00E9\r\n\r\n# XTIT: Personel Number\r\nview.Header.EmployeeID=ID zam\\u011Bstnance {0}\r\n\r\n# XTIT: Header text of Master List\r\nview.Master.title=\\u017D\\u00E1dosti o dovolenou ({0})\r\n\r\n# XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=Schvalov\\u00E1n\\u00ED \\u017E\\u00E1dost\\u00ED o dovolenou\r\n\r\n\r\n# XTIT: Title of Email to Employee on Business Card\r\nview.BusinessCard.Employee.Subject=Va\\u0161e \\u017E\\u00E1dost o dovolenou\\: {0}\r\n\r\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\r\nshell.Identity=Schvalov\\u00E1n\\u00ED \\u017E\\u00E1dost\\u00ED o dovolenou\r\n\r\n# YMSG\r\ndialog.question.approve=Schv\\u00E1lit \\u017E\\u00E1dost o dovolenou, kterou podal(a) {0}?\r\n\r\n# YMSG\r\ndialog.question.reject=Zam\\u00EDtnout \\u017E\\u00E1dost o dovolenou, kterou podal(a) {0}?\r\n\r\n# YMSG\r\ndialog.question.approvecancel=Schv\\u00E1lit storno, kter\\u00E9 podal(a) {0}?\r\n\r\n# YMSG\r\ndialog.question.rejectcancel=Zam\\u00EDtnout storno, kter\\u00E9 podal(a) {0}?\r\n\r\n# YMSG\r\ndialog.success.approvecancel=Zru\\u0161en\\u00ED bylo schv\\u00E1leno\r\n\r\n# YMSG\r\ndialog.success.rejectcancel=Zru\\u0161en\\u00ED bylo zam\\u00EDtnuto\r\n\r\n# YMSG\r\ndialog.success.approve=\\u0179\\u00E1dost o dovolenou byla schv\\u00E1lena\r\n\r\n# YMSG\r\ndialog.success.reject=\\u0179\\u00E1dost o dovolenou byla zam\\u00EDtnuta\r\n\r\n# YMSG: link to overlap calendar (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPlLink=Zobrazit p\\u0159ekryt\\u00ED\r\n\r\n# YMSG: link to overlap calendar (e.g.  1 overlap, Singular)\r\nutil.Conversions.OverlapSingLink=Zobrazit p\\u0159ekryt\\u00ED\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.Header.CancellationStatus=Po\\u017Eadov\\u00E1no zru\\u0161en\\u00ED\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.List.CancellationStatus=Zru\\u0161eno\r\n\r\n#XBUT: Button for Approve action\r\nXBUT_APPROVE=Schv\\u00E1lit\r\n\r\n#XBUT: Button for Reject action\r\nXBUT_REJECT=Zam\\u00EDtnout\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_APPROVAL=Schv\\u00E1lit\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_REJECT=Zam\\u00EDtnout\r\n\r\n# YMSG: Loading\r\nLOADING=Zav\\u00E1d\\u00ED se...\r\n\r\n# XTIT: Leave Request Details\r\nDETAIL_TITLE=\\u017D\\u00E1dost o dovolenou\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=V sou\\u010Dasn\\u00E9 dob\\u011B nejsou k dispozici \\u017E\\u00E1dn\\u00E9 polo\\u017Eky\r\n',
	"hcm/mgr/approve/leaverequests/i18n/i18n_de.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Days=Tage\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Day_Singular=Tag\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Hours=Stunden\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Hour_Singular=Stunde\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Value_Days={0} Tage\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Value_Day_Singular={0} Tag\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Value_Hours={0} Stunden\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Value_Hour_Singular={0} Stunde\r\n\r\n# XFLD: Current Balance of the leave quote on Detail Screen\r\nview.AddInfo.CurrentBalance=Verf\\u00FCgbar\r\n\r\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\r\nview.AddInfo.Requested=Beantragt\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPl={0} \\u00DCberschneidungen\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\r\nutil.Conversions.OverlapSing={0} \\u00DCberschneidung\r\n\r\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\r\nview.Detail.Request=Beantragt\r\n\r\n# YMSG: Alert message that current balance of leave request may not be accurate.\r\nview.AddInfo.AlertMessageBalanceNotAccurate=Es wurden weitere Abwesenheitsantr\\u00E4ge eingereicht. Der verf\\u00FCgbare Anspruch kann ungenau sein.\r\n\r\n# XSEL: status of Leave Request: approved\r\nview.Calendar.LegendApproved=Genehmigt\r\n\r\n# XSEL: status of Leave Request: working day\r\nview.Calendar.LegendWorkingDay=Arbeitstag\r\n\r\n# XSEL: status of Leave Request: Open Request\r\nview.Calendar.LegendPending=Genehmigung ausstehend\r\n\r\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\r\nview.Calendar.LegendDayOff=Kein Arbeitstag\r\n\r\n# XSEL: status of Leave Request: Public Holiday\r\nview.Calendar.LegendHoliday=Feiertag\r\n\r\n# XSEL: status of Leave Request: Today\r\nview.Calendar.LegendToday=Heute\r\n\r\n# XSEL: status of Leave Request:  deletion requested (i.e. cancellation of approved leave request has been requested)\r\nview.Calendar.LegendDeletionRequested=Stornierung beantragt\r\n\r\n# YMSG: Toast message that approval of leave request was successful\r\nview.Toast.YMSG_LRA_Approved=Abwesenheitsantrag genehmigt\r\n\r\n# YMSG: Toast message that reject of leave request was successful\r\nview.Toast.YMSG_LRA_Declined=Abwesenheitsantrag abgelehnt\r\n\r\n# XTIT: Leave Request Details\r\nview.Detail.title=Abwesenheitsantrag\r\n\r\n# XTIT: Leave Request Details - Calendar\r\nview.Calendar.title=Kalender\r\n\r\n# XTIT: Leave Type\r\nview.AddInfo.LeaveType=Abwesenheitsart\r\n\r\n# XTIT: Personel Number\r\nview.Header.EmployeeID=Mitarbeiter-ID {0}\r\n\r\n# XTIT: Header text of Master List\r\nview.Master.title=Antr\\u00E4ge ({0})\r\n\r\n# XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=Abwesenheitsantr\\u00E4ge genehmigen\r\n\r\n\r\n# XTIT: Title of Email to Employee on Business Card\r\nview.BusinessCard.Employee.Subject=Ihr Abwesenheitsantrag\\: {0}\r\n\r\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\r\nshell.Identity=Abwesenheitsantr\\u00E4ge genehmigen\r\n\r\n# YMSG\r\ndialog.question.approve=Abwesenheitsantrag von {0} genehmigen?\r\n\r\n# YMSG\r\ndialog.question.reject=Abwesenheitsantrag von {0} ablehnen?\r\n\r\n# YMSG\r\ndialog.question.approvecancel=Stornierung von {0} genehmigen?\r\n\r\n# YMSG\r\ndialog.question.rejectcancel=Stornierung von {0} ablehnen?\r\n\r\n# YMSG\r\ndialog.success.approvecancel=Stornierung genehmigt\r\n\r\n# YMSG\r\ndialog.success.rejectcancel=Stornierung abgelehnt\r\n\r\n# YMSG\r\ndialog.success.approve=Abwesenheitsantrag genehmigt\r\n\r\n# YMSG\r\ndialog.success.reject=Abwesenheitsantrag abgelehnt\r\n\r\n# YMSG: link to overlap calendar (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPlLink=\\u00DCberschneidungen anzeigen\r\n\r\n# YMSG: link to overlap calendar (e.g.  1 overlap, Singular)\r\nutil.Conversions.OverlapSingLink=\\u00DCberschneidung anzeigen\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.Header.CancellationStatus=Stornierung beantragt\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.List.CancellationStatus=Abgebrochen\r\n\r\n#XBUT: Button for Approve action\r\nXBUT_APPROVE=Genehmigen\r\n\r\n#XBUT: Button for Reject action\r\nXBUT_REJECT=Ablehnen\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_APPROVAL=Genehmigen\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_REJECT=Ablehnen\r\n\r\n# YMSG: Loading\r\nLOADING=Laden ...\r\n\r\n# XTIT: Leave Request Details\r\nDETAIL_TITLE=Abwesenheitsantrag\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=Keine Positionen verf\\u00FCgbar\r\n',
	"hcm/mgr/approve/leaverequests/i18n/i18n_en.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Days=Days\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Day_Singular=Day\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Hours=Hours\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Hour_Singular=Hour\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Value_Days={0} days\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Value_Day_Singular={0} day\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Value_Hours={0} hours\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Value_Hour_Singular={0} hour\r\n\r\n# XFLD: Current Balance of the leave quote on Detail Screen\r\nview.AddInfo.CurrentBalance=Available Balance\r\n\r\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\r\nview.AddInfo.Requested=Requested\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPl={0} Overlaps\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\r\nutil.Conversions.OverlapSing={0} Overlap\r\n\r\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\r\nview.Detail.Request=Requested\r\n\r\n# YMSG: Alert message that current balance of leave request may not be accurate.\r\nview.AddInfo.AlertMessageBalanceNotAccurate=This person has recently submitted other leave requests. The balance may not be accurate.\r\n\r\n# XSEL: status of Leave Request: approved\r\nview.Calendar.LegendApproved=Approved Leave\r\n\r\n# XSEL: status of Leave Request: working day\r\nview.Calendar.LegendWorkingDay=Workday\r\n\r\n# XSEL: status of Leave Request: Open Request\r\nview.Calendar.LegendPending=Pending Approval\r\n\r\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\r\nview.Calendar.LegendDayOff=Non-Workday\r\n\r\n# XSEL: status of Leave Request: Public Holiday\r\nview.Calendar.LegendHoliday=Public Holiday\r\n\r\n# XSEL: status of Leave Request: Today\r\nview.Calendar.LegendToday=Today\r\n\r\n# XSEL: status of Leave Request:  deletion requested (i.e. cancellation of approved leave request has been requested)\r\nview.Calendar.LegendDeletionRequested=Cancellation Requested\r\n\r\n# YMSG: Toast message that approval of leave request was successful\r\nview.Toast.YMSG_LRA_Approved=Leave request was approved\r\n\r\n# YMSG: Toast message that reject of leave request was successful\r\nview.Toast.YMSG_LRA_Declined=Leave request was rejected\r\n\r\n# XTIT: Leave Request Details\r\nview.Detail.title=Leave Request\r\n\r\n# XTIT: Leave Request Details - Calendar\r\nview.Calendar.title=Calendar\r\n\r\n# XTIT: Leave Type\r\nview.AddInfo.LeaveType=Leave Type\r\n\r\n# XTIT: Personel Number\r\nview.Header.EmployeeID=Employee ID {0}\r\n\r\n# XTIT: Header text of Master List\r\nview.Master.title=Leave Requests ({0})\r\n\r\n# XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=Approve Leave Requests\r\n\r\n\r\n# XTIT: Title of Email to Employee on Business Card\r\nview.BusinessCard.Employee.Subject=Your Request for Leave\\: {0}\r\n\r\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\r\nshell.Identity=Approve Leave Requests\r\n\r\n# YMSG\r\ndialog.question.approve=Approve the leave request submitted by {0}?\r\n\r\n# YMSG\r\ndialog.question.reject=Reject the leave request submitted by {0}?\r\n\r\n# YMSG\r\ndialog.question.approvecancel=Approve the cancellation submitted by {0}?\r\n\r\n# YMSG\r\ndialog.question.rejectcancel=Reject the cancellation submitted by {0}?\r\n\r\n# YMSG\r\ndialog.success.approvecancel=Cancellation was approved\r\n\r\n# YMSG\r\ndialog.success.rejectcancel=Cancellation was rejected\r\n\r\n# YMSG\r\ndialog.success.approve=Leave request was approved\r\n\r\n# YMSG\r\ndialog.success.reject=Leave request was rejected\r\n\r\n# YMSG: link to overlap calendar (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPlLink=Show Overlaps\r\n\r\n# YMSG: link to overlap calendar (e.g.  1 overlap, Singular)\r\nutil.Conversions.OverlapSingLink=Show Overlap\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.Header.CancellationStatus=Cancellation Requested\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.List.CancellationStatus=Cancelled\r\n\r\n#XBUT: Button for Approve action\r\nXBUT_APPROVE=Approve\r\n\r\n#XBUT: Button for Reject action\r\nXBUT_REJECT=Reject\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_APPROVAL=Approve\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_REJECT=Reject\r\n\r\n# YMSG: Loading\r\nLOADING=Loading...\r\n\r\n# XTIT: Leave Request Details\r\nDETAIL_TITLE=Leave Request\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=No items are currently available\r\n',
	"hcm/mgr/approve/leaverequests/i18n/i18n_en_US_sappsd.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Days=[[[\\u018C\\u0105\\u0177\\u015F]]]\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Day_Singular=[[[\\u018C\\u0105\\u0177]]]\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Hours=[[[\\u0125\\u014F\\u0171\\u0157\\u015F]]]\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Hour_Singular=[[[\\u0125\\u014F\\u0171\\u0157]]]\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Value_Days={0}[[[ \\u018C\\u0105\\u0177\\u015F]]]\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Value_Day_Singular={0}[[[ \\u018C\\u0105\\u0177]]]\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Value_Hours={0}[[[ \\u0125\\u014F\\u0171\\u0157\\u015F]]]\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Value_Hour_Singular={0}[[[ \\u0125\\u014F\\u0171\\u0157]]]\r\n\r\n# XFLD: Current Balance of the leave quote on Detail Screen\r\nview.AddInfo.CurrentBalance=[[[\\u1000\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113 \\u0181\\u0105\\u013A\\u0105\\u014B\\u010B\\u0113]]]\r\n\r\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\r\nview.AddInfo.Requested=[[[\\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u0113\\u018C]]]\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPl={0}[[[ \\u014E\\u028B\\u0113\\u0157\\u013A\\u0105\\u03C1\\u015F]]]\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\r\nutil.Conversions.OverlapSing={0}[[[ \\u014E\\u028B\\u0113\\u0157\\u013A\\u0105\\u03C1]]]\r\n\r\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\r\nview.Detail.Request=[[[\\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u0113\\u018C]]]\r\n\r\n# YMSG: Alert message that current balance of leave request may not be accurate.\r\nview.AddInfo.AlertMessageBalanceNotAccurate=[[[\\u0162\\u0125\\u012F\\u015F \\u03C1\\u0113\\u0157\\u015F\\u014F\\u014B \\u0125\\u0105\\u015F \\u0157\\u0113\\u010B\\u0113\\u014B\\u0163\\u013A\\u0177 \\u015F\\u0171\\u0183\\u0271\\u012F\\u0163\\u0163\\u0113\\u018C \\u014F\\u0163\\u0125\\u0113\\u0157 \\u013A\\u0113\\u0105\\u028B\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u015F. \\u0162\\u0125\\u0113 \\u0183\\u0105\\u013A\\u0105\\u014B\\u010B\\u0113 \\u0271\\u0105\\u0177 \\u014B\\u014F\\u0163 \\u0183\\u0113 \\u0105\\u010B\\u010B\\u0171\\u0157\\u0105\\u0163\\u0113.]]]\r\n\r\n# XSEL: status of Leave Request: approved\r\nview.Calendar.LegendApproved=[[[\\u1000\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u018C \\u013B\\u0113\\u0105\\u028B\\u0113]]]\r\n\r\n# XSEL: status of Leave Request: working day\r\nview.Calendar.LegendWorkingDay=[[[\\u0174\\u014F\\u0157\\u0137\\u018C\\u0105\\u0177]]]\r\n\r\n# XSEL: status of Leave Request: Open Request\r\nview.Calendar.LegendPending=[[[\\u01A4\\u0113\\u014B\\u018C\\u012F\\u014B\\u011F \\u1000\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0105\\u013A]]]\r\n\r\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\r\nview.Calendar.LegendDayOff=[[[\\u0143\\u014F\\u014B-\\u0174\\u014F\\u0157\\u0137\\u018C\\u0105\\u0177]]]\r\n\r\n# XSEL: status of Leave Request: Public Holiday\r\nview.Calendar.LegendHoliday=[[[\\u01A4\\u0171\\u0183\\u013A\\u012F\\u010B \\u0124\\u014F\\u013A\\u012F\\u018C\\u0105\\u0177]]]\r\n\r\n# XSEL: status of Leave Request: Today\r\nview.Calendar.LegendToday=[[[\\u0162\\u014F\\u018C\\u0105\\u0177]]]\r\n\r\n# XSEL: status of Leave Request:  deletion requested (i.e. cancellation of approved leave request has been requested)\r\nview.Calendar.LegendDeletionRequested=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u013A\\u0105\\u0163\\u012F\\u014F\\u014B \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u0113\\u018C]]]\r\n\r\n# YMSG: Toast message that approval of leave request was successful\r\nview.Toast.YMSG_LRA_Approved=[[[\\u013B\\u0113\\u0105\\u028B\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u0175\\u0105\\u015F \\u0105\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u018C]]]\r\n\r\n# YMSG: Toast message that reject of leave request was successful\r\nview.Toast.YMSG_LRA_Declined=[[[\\u013B\\u0113\\u0105\\u028B\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u0175\\u0105\\u015F \\u0157\\u0113\\u0135\\u0113\\u010B\\u0163\\u0113\\u018C]]]\r\n\r\n# XTIT: Leave Request Details\r\nview.Detail.title=[[[\\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163]]]\r\n\r\n# XTIT: Leave Request Details - Calendar\r\nview.Calendar.title=[[[\\u0108\\u0105\\u013A\\u0113\\u014B\\u018C\\u0105\\u0157]]]\r\n\r\n# XTIT: Leave Type\r\nview.AddInfo.LeaveType=[[[\\u013B\\u0113\\u0105\\u028B\\u0113 \\u0162\\u0177\\u03C1\\u0113]]]\r\n\r\n# XTIT: Personel Number\r\nview.Header.EmployeeID=[[[\\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113 \\u012C\\u010E ]]]{0}\r\n\r\n# XTIT: Header text of Master List\r\nview.Master.title=[[[\\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u015F ({0})]]]\r\n\r\n# XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=[[[\\u1000\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113 \\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u015F]]]\r\n\r\n\r\n# XTIT: Title of Email to Employee on Business Card\r\nview.BusinessCard.Employee.Subject=[[[\\u0176\\u014F\\u0171\\u0157 \\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u014F\\u0192 \\u0162\\u0177\\u03C1\\u0113 ]]]{0}\r\n\r\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\r\nshell.Identity=[[[\\u1000\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113 \\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u015F]]]\r\n\r\n# YMSG\r\ndialog.question.approve=[[[\\u1000\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113 \\u0163\\u0125\\u0113 \\u013A\\u0113\\u0105\\u028B\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u015F\\u0171\\u0183\\u0271\\u012F\\u0163\\u0163\\u0113\\u018C \\u0183\\u0177 {0}?]]]\r\n\r\n# YMSG\r\ndialog.question.reject=[[[\\u0158\\u0113\\u0135\\u0113\\u010B\\u0163 \\u0163\\u0125\\u0113 \\u013A\\u0113\\u0105\\u028B\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u015F\\u0171\\u0183\\u0271\\u012F\\u0163\\u0163\\u0113\\u018C \\u0183\\u0177 {0}?]]]\r\n\r\n# YMSG\r\ndialog.question.approvecancel=[[[\\u1000\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113 \\u0163\\u0125\\u0113 \\u010B\\u0105\\u014B\\u010B\\u0113\\u013A\\u013A\\u0105\\u0163\\u012F\\u014F\\u014B \\u015F\\u0171\\u0183\\u0271\\u012F\\u0163\\u0163\\u0113\\u018C \\u0183\\u0177 {0}?]]]\r\n\r\n# YMSG\r\ndialog.question.rejectcancel=[[[\\u0158\\u0113\\u0135\\u0113\\u010B\\u0163 \\u0163\\u0125\\u0113 \\u010B\\u0105\\u014B\\u010B\\u0113\\u013A\\u013A\\u0105\\u0163\\u012F\\u014F\\u014B \\u015F\\u0171\\u0183\\u0271\\u012F\\u0163\\u0163\\u0113\\u018C \\u0183\\u0177 {0}?]]]\r\n\r\n# YMSG\r\ndialog.success.approvecancel=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u013A\\u0105\\u0163\\u012F\\u014F\\u014B \\u0175\\u0105\\u015F \\u0105\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u018C ]]]\r\n\r\n# YMSG\r\ndialog.success.rejectcancel=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u013A\\u0105\\u0163\\u012F\\u014F\\u014B \\u0175\\u0105\\u015F \\u0157\\u0113\\u0135\\u0113\\u010B\\u0163\\u0113\\u018C]]]\r\n\r\n# YMSG\r\ndialog.success.approve=[[[\\u013B\\u0113\\u0105\\u028B\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u0175\\u0105\\u015F \\u0105\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u018C ]]]\r\n\r\n# YMSG\r\ndialog.success.reject=[[[\\u013B\\u0113\\u0105\\u028B\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u0175\\u0105\\u015F \\u0157\\u0113\\u0135\\u0113\\u010B\\u0163\\u0113\\u018C]]]\r\n\r\n# YMSG: link to overlap calendar (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPlLink=[[[\\u015C\\u0125\\u014F\\u0175 \\u014E\\u028B\\u0113\\u0157\\u013A\\u0105\\u03C1\\u015F]]]\r\n\r\n# YMSG: link to overlap calendar (e.g.  1 overlap, Singular)\r\nutil.Conversions.OverlapSingLink=[[[\\u015C\\u0125\\u014F\\u0175 \\u014E\\u028B\\u0113\\u0157\\u013A\\u0105\\u03C1]]]\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.Header.CancellationStatus=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u013A\\u0105\\u0163\\u012F\\u014F\\u014B \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u0113\\u018C]]]\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.List.CancellationStatus=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u013A\\u0113\\u018C]]]\r\n\r\n#XBUT: Button for Approve action\r\nXBUT_APPROVE=[[[\\u1000\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113]]]\r\n\r\n#XBUT: Button for Reject action\r\nXBUT_REJECT=[[[\\u0158\\u0113\\u0135\\u0113\\u010B\\u0163]]]\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_APPROVAL=[[[\\u1000\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113]]]\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_REJECT=[[[\\u0158\\u0113\\u0135\\u0113\\u010B\\u0163]]]\r\n\r\n# YMSG: Loading\r\nLOADING=[[[\\u013B\\u014F\\u0105\\u018C\\u012F\\u014B\\u011F...]]]\r\n\r\n# XTIT: Leave Request Details\r\nDETAIL_TITLE=[[[\\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163]]]\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=[[[\\u0143\\u014F \\u012F\\u0163\\u0113\\u0271\\u015F \\u0105\\u0157\\u0113 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163\\u013A\\u0177 \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113]]]\r\n',
	"hcm/mgr/approve/leaverequests/i18n/i18n_en_US_saptrc.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Days=XocyAgYy/2eXIFv6LaaMOA_days\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Day_Singular=5XmOYKmsM7rFkq0RhyDt2Q_day\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Hours=/T6hftwjlfF3wNvDzoM9Pg_hours\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Hour_Singular=d1YbhZSCEyfyHqxeoPhPRA_hour\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Value_Days=klVkZag2ipSlVKggk2q3+A_{0} days\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Value_Day_Singular=k96mzo1s7cX7pMeKSpyT+g_{0} day\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Value_Hours=db4ptSg3Zs8Jz4GD1qJcKw_{0} hours\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Value_Hour_Singular=J71SzrJ/tuS3SVbOeDwNBA_{0} hour\r\n\r\n# XFLD: Current Balance of the leave quote on Detail Screen\r\nview.AddInfo.CurrentBalance=lkb8xrRXlB7Ru3dj3C3XrA_Available Balance\r\n\r\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\r\nview.AddInfo.Requested=ZwmvLZvOrHVsFS00EMAeFQ_Requested\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPl=6co/Vf0f6BLZ7XVuLVNdNA_{0} Overlaps\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\r\nutil.Conversions.OverlapSing=DVIPpimsN+jYnvg+hBM/+A_{0} Overlap\r\n\r\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\r\nview.Detail.Request=R69eDi0no17FZjoTi8t+dA_Requested\r\n\r\n# YMSG: Alert message that current balance of leave request may not be accurate.\r\nview.AddInfo.AlertMessageBalanceNotAccurate=BmpkT1VCSRo/BbxjFlxzdg_This person has recently submitted other leave requests. The balance may not be accurate.\r\n\r\n# XSEL: status of Leave Request: approved\r\nview.Calendar.LegendApproved=TmWHRLEEC23zpXlzFvPw4g_Approved Leave\r\n\r\n# XSEL: status of Leave Request: working day\r\nview.Calendar.LegendWorkingDay=Aj6ReDbQydWfuOxXKKgScw_Workday\r\n\r\n# XSEL: status of Leave Request: Open Request\r\nview.Calendar.LegendPending=5wFu0D70a9yzp8IQkpXZZw_Pending Approval\r\n\r\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\r\nview.Calendar.LegendDayOff=/iN/z7aWKOgf8JsUhx0dGg_Non-Workday\r\n\r\n# XSEL: status of Leave Request: Public Holiday\r\nview.Calendar.LegendHoliday=VOvLpVmftlNQsYb/CCe9cg_Public Holiday\r\n\r\n# XSEL: status of Leave Request: Today\r\nview.Calendar.LegendToday=OI5aWYX+DlRwpcrKzvMO1g_Today\r\n\r\n# XSEL: status of Leave Request:  deletion requested (i.e. cancellation of approved leave request has been requested)\r\nview.Calendar.LegendDeletionRequested=98A+TR+gNdZvSlVsoit1lA_Cancellation Requested\r\n\r\n# YMSG: Toast message that approval of leave request was successful\r\nview.Toast.YMSG_LRA_Approved=rgM5o/JhkFMLi+WTj10vfw_Leave request was approved\r\n\r\n# YMSG: Toast message that reject of leave request was successful\r\nview.Toast.YMSG_LRA_Declined=HcmSRNLWgAVztRFRH+deSA_Leave request was rejected\r\n\r\n# XTIT: Leave Request Details\r\nview.Detail.title=jKe2Y0XCEqdm8h4FFD9djQ_Leave Request\r\n\r\n# XTIT: Leave Request Details - Calendar\r\nview.Calendar.title=07wcl4JmFR7XfSIUNlWIvw_Calendar\r\n\r\n# XTIT: Leave Type\r\nview.AddInfo.LeaveType=CkG338VOYTpmrR1E0LK3Sg_Leave Type\r\n\r\n# XTIT: Personel Number\r\nview.Header.EmployeeID=+cQ1sFp3AoCfqNdM14D2RQ_Employee ID {0}\r\n\r\n# XTIT: Header text of Master List\r\nview.Master.title=YFYxkffctxnjvwAriVfCBA_Leave Requests ({0})\r\n\r\n# XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=RtV0BvRIKIxHwYFaJtYVpw_Approve Leave Requests\r\n\r\n\r\n# XTIT: Title of Email to Employee on Business Card\r\nview.BusinessCard.Employee.Subject=EXssIiuzXyiX3ica0xLFYA_Your Leave Request of Type {0}\r\n\r\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\r\nshell.Identity=ezYfdfVmTXrAI7sNGEfgrw_Approve Leave Requests\r\n\r\n# YMSG\r\ndialog.question.approve=PZCBq9vRdNUw2q1UsDPXKA_Approve the leave request submitted by {0}?\r\n\r\n# YMSG\r\ndialog.question.reject=TgMD1C79zBgKZPfHJ2F1MQ_Reject the leave request submitted by {0}?\r\n\r\n# YMSG\r\ndialog.question.approvecancel=j0yle0Q4AJBBCi4QLGxkjA_Approve the cancellation submitted by {0}?\r\n\r\n# YMSG\r\ndialog.question.rejectcancel=tp+bxzwY/wXUgbM0dV2v1w_Reject the cancellation submitted by {0}?\r\n\r\n# YMSG\r\ndialog.success.approvecancel=Zh/j0mQMDidyeDirzOnFUQ_Cancellation was approved \r\n\r\n# YMSG\r\ndialog.success.rejectcancel=rpqFily41tmPtHEClq3xxA_Cancellation was rejected\r\n\r\n# YMSG\r\ndialog.success.approve=8IJcxYxPBeAqRtYGhf4YyQ_Leave request was approved \r\n\r\n# YMSG\r\ndialog.success.reject=wHIGzmyyrGDfJRe8WSfDDw_Leave request was rejected\r\n\r\n# YMSG: link to overlap calendar (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPlLink=+m2hyzNp9vro72c7607ncQ_Show Overlaps\r\n\r\n# YMSG: link to overlap calendar (e.g.  1 overlap, Singular)\r\nutil.Conversions.OverlapSingLink=dWNhKg0SbuJ240/ZArUedg_Show Overlap\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.Header.CancellationStatus=ftlkPd/wymxx0BQmwTyyvQ_Cancellation Requested\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.List.CancellationStatus=Y2YKVMictd/HJlfWVk9l7A_Cancelled\r\n\r\n#XBUT: Button for Approve action\r\nXBUT_APPROVE=/HR9sXoEUDQnM9OGydE8+A_Approve\r\n\r\n#XBUT: Button for Reject action\r\nXBUT_REJECT=PitsjU2YVn6e/SQhhl3Cxw_Reject\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_APPROVAL=kWBmugvBKTWhcRb5VZAe+g_Approve\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_REJECT=9ONyEqsNZNHzLEhYiYb2Jg_Reject\r\n\r\n# YMSG: Loading\r\nLOADING=MhGW46bkOVQ8OCb6zMBKJw_Loading...\r\n\r\n# XTIT: Leave Request Details\r\nDETAIL_TITLE=o5F2CFOTGMYq3EIMGDKwIg_Leave Request\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=wII9UfK8oCRmP3S7xsyj8A_No items are currently available\r\n',
	"hcm/mgr/approve/leaverequests/i18n/i18n_es.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Days=D\\u00EDas\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Day_Singular=D\\u00EDa\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Hours=Horas\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Hour_Singular=Hora\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Value_Days={0}  d\\u00EDas\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Value_Day_Singular={0} d\\u00EDa\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Value_Hours={0} horas\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Value_Hour_Singular={0} hora\r\n\r\n# XFLD: Current Balance of the leave quote on Detail Screen\r\nview.AddInfo.CurrentBalance=Saldo disponible\r\n\r\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\r\nview.AddInfo.Requested=Solicitados\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPl={0} Solapamientos\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\r\nutil.Conversions.OverlapSing={0} Solapamiento\r\n\r\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\r\nview.Detail.Request=Solicitados\r\n\r\n# YMSG: Alert message that current balance of leave request may not be accurate.\r\nview.AddInfo.AlertMessageBalanceNotAccurate=Esta persona ha enviado recientemente otras solicitudes de ausencia. El saldo no ser\\u00E1 exacto.\r\n\r\n# XSEL: status of Leave Request: approved\r\nview.Calendar.LegendApproved=Ausencia aprobada\r\n\r\n# XSEL: status of Leave Request: working day\r\nview.Calendar.LegendWorkingDay=D\\u00EDa laborable\r\n\r\n# XSEL: status of Leave Request: Open Request\r\nview.Calendar.LegendPending=Pendiente de aprobaci\\u00F3n\r\n\r\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\r\nview.Calendar.LegendDayOff=D\\u00EDa no laborable\r\n\r\n# XSEL: status of Leave Request: Public Holiday\r\nview.Calendar.LegendHoliday=D\\u00EDa festivo\r\n\r\n# XSEL: status of Leave Request: Today\r\nview.Calendar.LegendToday=Hoy\r\n\r\n# XSEL: status of Leave Request:  deletion requested (i.e. cancellation of approved leave request has been requested)\r\nview.Calendar.LegendDeletionRequested=Cancelaci\\u00F3n solicitada\r\n\r\n# YMSG: Toast message that approval of leave request was successful\r\nview.Toast.YMSG_LRA_Approved=Solicitud de ausencia aprobada\r\n\r\n# YMSG: Toast message that reject of leave request was successful\r\nview.Toast.YMSG_LRA_Declined=Solicitud de ausencia rechazada\r\n\r\n# XTIT: Leave Request Details\r\nview.Detail.title=Solicitud de ausencia\r\n\r\n# XTIT: Leave Request Details - Calendar\r\nview.Calendar.title=Calendario\r\n\r\n# XTIT: Leave Type\r\nview.AddInfo.LeaveType=Tipo de ausencia\r\n\r\n# XTIT: Personel Number\r\nview.Header.EmployeeID=ID de empleado {0}\r\n\r\n# XTIT: Header text of Master List\r\nview.Master.title=Solicitudes de ausencia({0})\r\n\r\n# XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=Aprobaci\\u00F3n de solicitudes de ausencia\r\n\r\n\r\n# XTIT: Title of Email to Employee on Business Card\r\nview.BusinessCard.Employee.Subject=Su solicitud para ausentarse\\: {0}\r\n\r\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\r\nshell.Identity=Aprobaci\\u00F3n de solicitudes de ausencia\r\n\r\n# YMSG\r\ndialog.question.approve=\\u00BFAprobar la solicitud de ausencia enviada por {0}?\r\n\r\n# YMSG\r\ndialog.question.reject=\\u00BFRechazar la solicitud de ausencia enviada por {0}?\r\n\r\n# YMSG\r\ndialog.question.approvecancel=\\u00BFAprobar la cancelaci\\u00F3n enviada por {0}?\r\n\r\n# YMSG\r\ndialog.question.rejectcancel=\\u00BFRechazar la cancelaci\\u00F3n enviada por {0}?\r\n\r\n# YMSG\r\ndialog.success.approvecancel=Cancelaci\\u00F3n aprobada\r\n\r\n# YMSG\r\ndialog.success.rejectcancel=Cancelaci\\u00F3n rechazada\r\n\r\n# YMSG\r\ndialog.success.approve=Solicitud de ausencia aprobada\r\n\r\n# YMSG\r\ndialog.success.reject=Solicitud de ausencia rechazada\r\n\r\n# YMSG: link to overlap calendar (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPlLink=Mostrar solapamientos\r\n\r\n# YMSG: link to overlap calendar (e.g.  1 overlap, Singular)\r\nutil.Conversions.OverlapSingLink=Mostrar solapamiento\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.Header.CancellationStatus=Cancelaci\\u00F3n solicitada\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.List.CancellationStatus=Cancelada\r\n\r\n#XBUT: Button for Approve action\r\nXBUT_APPROVE=Aprobar\r\n\r\n#XBUT: Button for Reject action\r\nXBUT_REJECT=Rechazar\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_APPROVAL=Aprobar\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_REJECT=Rechazar\r\n\r\n# YMSG: Loading\r\nLOADING=Cargando...\r\n\r\n# XTIT: Leave Request Details\r\nDETAIL_TITLE=Solicitud de ausencia\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=Actualmente no hay posiciones disponibles\r\n',
	"hcm/mgr/approve/leaverequests/i18n/i18n_fr.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Days=Jours\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Day_Singular=Jour\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Hours=Heures\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Hour_Singular=Heure\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Value_Days={0} jours\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Value_Day_Singular={0} jour\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Value_Hours={0} heures\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Value_Hour_Singular={0} heure\r\n\r\n# XFLD: Current Balance of the leave quote on Detail Screen\r\nview.AddInfo.CurrentBalance=Solde disponible\r\n\r\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\r\nview.AddInfo.Requested=Demand\\u00E9s\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPl={0} chevauchements\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\r\nutil.Conversions.OverlapSing={0} chevauchement\r\n\r\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\r\nview.Detail.Request=Demand\\u00E9s\r\n\r\n# YMSG: Alert message that current balance of leave request may not be accurate.\r\nview.AddInfo.AlertMessageBalanceNotAccurate=Cette personne a envoy\\u00E9 d\'autres demandes de cong\\u00E9s r\\u00E9cemment. Le solde n\'est peut-\\u00EAtre pas correct.\r\n\r\n# XSEL: status of Leave Request: approved\r\nview.Calendar.LegendApproved=Cong\\u00E9 approuv\\u00E9\r\n\r\n# XSEL: status of Leave Request: working day\r\nview.Calendar.LegendWorkingDay=Jour ouvr\\u00E9\r\n\r\n# XSEL: status of Leave Request: Open Request\r\nview.Calendar.LegendPending=Approbation en attente\r\n\r\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\r\nview.Calendar.LegendDayOff=Jour non ouvrable\r\n\r\n# XSEL: status of Leave Request: Public Holiday\r\nview.Calendar.LegendHoliday=Jour f\\u00E9ri\\u00E9\r\n\r\n# XSEL: status of Leave Request: Today\r\nview.Calendar.LegendToday=Aujourd\'hui\r\n\r\n# XSEL: status of Leave Request:  deletion requested (i.e. cancellation of approved leave request has been requested)\r\nview.Calendar.LegendDeletionRequested=Annulation demand\\u00E9e\r\n\r\n# YMSG: Toast message that approval of leave request was successful\r\nview.Toast.YMSG_LRA_Approved=Demande de cong\\u00E9 approuv\\u00E9e\r\n\r\n# YMSG: Toast message that reject of leave request was successful\r\nview.Toast.YMSG_LRA_Declined=Demande de cong\\u00E9 refus\\u00E9e\r\n\r\n# XTIT: Leave Request Details\r\nview.Detail.title=Demande de cong\\u00E9\r\n\r\n# XTIT: Leave Request Details - Calendar\r\nview.Calendar.title=Calendrier\r\n\r\n# XTIT: Leave Type\r\nview.AddInfo.LeaveType=Type de cong\\u00E9\r\n\r\n# XTIT: Personel Number\r\nview.Header.EmployeeID=Matricule {0}\r\n\r\n# XTIT: Header text of Master List\r\nview.Master.title=Demandes de cong\\u00E9s ({0})\r\n\r\n# XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=Approbation de demandes de cong\\u00E9s\r\n\r\n\r\n# XTIT: Title of Email to Employee on Business Card\r\nview.BusinessCard.Employee.Subject=Votre demande de cong\\u00E9\\u00A0\\: {0}\r\n\r\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\r\nshell.Identity=Approbation de demandes de cong\\u00E9s\r\n\r\n# YMSG\r\ndialog.question.approve=Approuver la demande de cong\\u00E9 envoy\\u00E9e par {0}\\u00A0?\r\n\r\n# YMSG\r\ndialog.question.reject=Refuser la demande de cong\\u00E9 envoy\\u00E9e par {0}\\u00A0?\r\n\r\n# YMSG\r\ndialog.question.approvecancel=Approuver l\'\'annulation envoy\\u00E9e par {0}\\u00A0?\r\n\r\n# YMSG\r\ndialog.question.rejectcancel=Refuser l\'\'annulation envoy\\u00E9e par {0}\\u00A0?\r\n\r\n# YMSG\r\ndialog.success.approvecancel=Annulation approuv\\u00E9e\r\n\r\n# YMSG\r\ndialog.success.rejectcancel=Annulation refus\\u00E9e\r\n\r\n# YMSG\r\ndialog.success.approve=Demande de cong\\u00E9 approuv\\u00E9e\r\n\r\n# YMSG\r\ndialog.success.reject=Demande de cong\\u00E9 refus\\u00E9e\r\n\r\n# YMSG: link to overlap calendar (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPlLink=Afficher chevauchements\r\n\r\n# YMSG: link to overlap calendar (e.g.  1 overlap, Singular)\r\nutil.Conversions.OverlapSingLink=Afficher chevauchement\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.Header.CancellationStatus=Annulation demand\\u00E9e\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.List.CancellationStatus=Annul\\u00E9e\r\n\r\n#XBUT: Button for Approve action\r\nXBUT_APPROVE=Approuver\r\n\r\n#XBUT: Button for Reject action\r\nXBUT_REJECT=Refuser\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_APPROVAL=Approuver\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_REJECT=Refuser\r\n\r\n# YMSG: Loading\r\nLOADING=Chargement...\r\n\r\n# XTIT: Leave Request Details\r\nDETAIL_TITLE=Demande de cong\\u00E9\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=Aucun poste disponible actuellement\r\n',
	"hcm/mgr/approve/leaverequests/i18n/i18n_hu.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Days=Napok\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Day_Singular=Nap\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Hours=\\u00D3r\\u00E1k\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Hour_Singular=\\u00D3ra\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Value_Days={0} nap\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Value_Day_Singular={0} nap\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Value_Hours={0} \\u00F3ra\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Value_Hour_Singular={0} \\u00F3ra\r\n\r\n# XFLD: Current Balance of the leave quote on Detail Screen\r\nview.AddInfo.CurrentBalance=Rendelkez\\u00E9sre \\u00E1ll\\u00F3\r\n\r\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\r\nview.AddInfo.Requested=Ig\\u00E9nyelt\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPl={0} \\u00E1tfed\\u00E9s\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\r\nutil.Conversions.OverlapSing={0} \\u00E1tfed\\u00E9s\r\n\r\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\r\nview.Detail.Request=Ig\\u00E9nyelt\r\n\r\n# YMSG: Alert message that current balance of leave request may not be accurate.\r\nview.AddInfo.AlertMessageBalanceNotAccurate=Ez a szem\\u00E9ly nemr\\u00E9g m\\u00E1s t\\u00E1voll\\u00E9tk\\u00E9relmeket is k\\u00FCld\\u00F6tt. Lehet, hogy az egyenleg nem pontos.\r\n\r\n# XSEL: status of Leave Request: approved\r\nview.Calendar.LegendApproved=Enged\\u00E9lyezett t\\u00E1voll\\u00E9t\r\n\r\n# XSEL: status of Leave Request: working day\r\nview.Calendar.LegendWorkingDay=Munkanap\r\n\r\n# XSEL: status of Leave Request: Open Request\r\nview.Calendar.LegendPending=F\\u00FCgg\\u0151ben l\\u00E9v\\u0151 enged\\u00E9lyez\\u00E9s\r\n\r\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\r\nview.Calendar.LegendDayOff=Nem munkanap\r\n\r\n# XSEL: status of Leave Request: Public Holiday\r\nview.Calendar.LegendHoliday=\\u00DCnnepnap\r\n\r\n# XSEL: status of Leave Request: Today\r\nview.Calendar.LegendToday=Ma\r\n\r\n# XSEL: status of Leave Request:  deletion requested (i.e. cancellation of approved leave request has been requested)\r\nview.Calendar.LegendDeletionRequested=Visszavon\\u00E1st k\\u00E9rt\r\n\r\n# YMSG: Toast message that approval of leave request was successful\r\nview.Toast.YMSG_LRA_Approved=T\\u00E1voll\\u00E9tk\\u00E9relem enged\\u00E9lyezve\r\n\r\n# YMSG: Toast message that reject of leave request was successful\r\nview.Toast.YMSG_LRA_Declined=T\\u00E1voll\\u00E9tk\\u00E9relem elutas\\u00EDtva\r\n\r\n# XTIT: Leave Request Details\r\nview.Detail.title=T\\u00E1voll\\u00E9tk\\u00E9relem\r\n\r\n# XTIT: Leave Request Details - Calendar\r\nview.Calendar.title=Napt\\u00E1r\r\n\r\n# XTIT: Leave Type\r\nview.AddInfo.LeaveType=T\\u00E1voll\\u00E9tfajta\r\n\r\n# XTIT: Personel Number\r\nview.Header.EmployeeID=Dolgoz\\u00F3 azonos\\u00EDt\\u00F3ja\\: {0}\r\n\r\n# XTIT: Header text of Master List\r\nview.Master.title=T\\u00E1voll\\u00E9tk\\u00E9relmek ({0})\r\n\r\n# XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=T\\u00E1voll\\u00E9tk\\u00E9relmek enged\\u00E9lyez\\u00E9se\r\n\r\n\r\n# XTIT: Title of Email to Employee on Business Card\r\nview.BusinessCard.Employee.Subject=Az \\u00D6n t\\u00E1voll\\u00E9ti k\\u00E9relme\\: {0}\r\n\r\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\r\nshell.Identity=T\\u00E1voll\\u00E9tk\\u00E9relmek enged\\u00E9lyez\\u00E9se\r\n\r\n# YMSG\r\ndialog.question.approve=Enged\\u00E9lyezi a k\\u00F6vetkez\\u0151 \\u00E1ltal bek\\u00FCld\\u00F6tt t\\u00E1voll\\u00E9tk\\u00E9relmet\\: {0}?\r\n\r\n# YMSG\r\ndialog.question.reject=Elutas\\u00EDtja a k\\u00F6vetkez\\u0151 \\u00E1ltal bek\\u00FCld\\u00F6tt t\\u00E1voll\\u00E9tk\\u00E9relmet\\: {0}?\r\n\r\n# YMSG\r\ndialog.question.approvecancel=Enged\\u00E9lyezi a k\\u00F6vetkez\\u0151 \\u00E1ltal bek\\u00FCld\\u00F6tt visszavon\\u00E1st\\: {0}?\r\n\r\n# YMSG\r\ndialog.question.rejectcancel=Elutas\\u00EDtja a k\\u00F6vetkez\\u0151 \\u00E1ltal bek\\u00FCld\\u00F6tt visszavon\\u00E1st\\: {0}?\r\n\r\n# YMSG\r\ndialog.success.approvecancel=Visszavon\\u00E1s enged\\u00E9lyezve\r\n\r\n# YMSG\r\ndialog.success.rejectcancel=Visszavon\\u00E1s elutas\\u00EDtva\r\n\r\n# YMSG\r\ndialog.success.approve=T\\u00E1voll\\u00E9tk\\u00E9relem enged\\u00E9lyezve\r\n\r\n# YMSG\r\ndialog.success.reject=T\\u00E1voll\\u00E9tk\\u00E9relem elutas\\u00EDtva\r\n\r\n# YMSG: link to overlap calendar (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPlLink=\\u00C1tfed\\u00E9sek megjelen\\u00EDt\\u00E9se\r\n\r\n# YMSG: link to overlap calendar (e.g.  1 overlap, Singular)\r\nutil.Conversions.OverlapSingLink=\\u00C1tfed\\u00E9s megjelen\\u00EDt\\u00E9se\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.Header.CancellationStatus=Visszavon\\u00E1st k\\u00E9rt\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.List.CancellationStatus=Megszak\\u00EDtva\r\n\r\n#XBUT: Button for Approve action\r\nXBUT_APPROVE=Enged\\u00E9lyez\\u00E9s\r\n\r\n#XBUT: Button for Reject action\r\nXBUT_REJECT=Elutas\\u00EDt\\u00E1s\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_APPROVAL=Enged\\u00E9lyez\\u00E9s\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_REJECT=Elutas\\u00EDt\\u00E1s\r\n\r\n# YMSG: Loading\r\nLOADING=Bet\\u00F6lt\\u00E9s...\r\n\r\n# XTIT: Leave Request Details\r\nDETAIL_TITLE=T\\u00E1voll\\u00E9tk\\u00E9relem\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=Jelenleg nem \\u00E1ll rendelkez\\u00E9sre t\\u00E9tel\r\n',
	"hcm/mgr/approve/leaverequests/i18n/i18n_it.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Days=Giorni\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Day_Singular=Giorno\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Hours=Ore\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Hour_Singular=Ora\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Value_Days={0} giorni\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Value_Day_Singular={0} giorno\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Value_Hours={0} ore\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Value_Hour_Singular={0} ora\r\n\r\n# XFLD: Current Balance of the leave quote on Detail Screen\r\nview.AddInfo.CurrentBalance=Saldo disponibile\r\n\r\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\r\nview.AddInfo.Requested=Richiesto\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPl={0} sovrapposizioni\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\r\nutil.Conversions.OverlapSing={0} sovrapposizione\r\n\r\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\r\nview.Detail.Request=Richiesto\r\n\r\n# YMSG: Alert message that current balance of leave request may not be accurate.\r\nview.AddInfo.AlertMessageBalanceNotAccurate=Questa persona ha inviato recentemente altre richieste di ferie. Il saldo potrebbe non corrispondere.\r\n\r\n# XSEL: status of Leave Request: approved\r\nview.Calendar.LegendApproved=Ferie approvate\r\n\r\n# XSEL: status of Leave Request: working day\r\nview.Calendar.LegendWorkingDay=Giorno lavorativo\r\n\r\n# XSEL: status of Leave Request: Open Request\r\nview.Calendar.LegendPending=In attesa di approvazione\r\n\r\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\r\nview.Calendar.LegendDayOff=Giorno non lavorativo\r\n\r\n# XSEL: status of Leave Request: Public Holiday\r\nview.Calendar.LegendHoliday=Giorno festivo\r\n\r\n# XSEL: status of Leave Request: Today\r\nview.Calendar.LegendToday=Oggi\r\n\r\n# XSEL: status of Leave Request:  deletion requested (i.e. cancellation of approved leave request has been requested)\r\nview.Calendar.LegendDeletionRequested=Annullamento richiesto\r\n\r\n# YMSG: Toast message that approval of leave request was successful\r\nview.Toast.YMSG_LRA_Approved=Richiesta di ferie approvata\r\n\r\n# YMSG: Toast message that reject of leave request was successful\r\nview.Toast.YMSG_LRA_Declined=Richiesta di ferie rifiutata\r\n\r\n# XTIT: Leave Request Details\r\nview.Detail.title=Richiesta di ferie\r\n\r\n# XTIT: Leave Request Details - Calendar\r\nview.Calendar.title=Calendario\r\n\r\n# XTIT: Leave Type\r\nview.AddInfo.LeaveType=Tipo di ferie\r\n\r\n# XTIT: Personel Number\r\nview.Header.EmployeeID=ID dipendente {0}\r\n\r\n# XTIT: Header text of Master List\r\nview.Master.title=Richieste di ferie ({0})\r\n\r\n# XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=Approva richieste di ferie\r\n\r\n\r\n# XTIT: Title of Email to Employee on Business Card\r\nview.BusinessCard.Employee.Subject=La tua richiesta di ferie\\: {0}\r\n\r\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\r\nshell.Identity=Approva richieste di ferie\r\n\r\n# YMSG\r\ndialog.question.approve=Approvare la richiesta di ferie inviata da {0}?\r\n\r\n# YMSG\r\ndialog.question.reject=Rifiutare la richiesta di ferie inviata da {0}?\r\n\r\n# YMSG\r\ndialog.question.approvecancel=Approvare l\'\'annullamento inviato da {0}?\r\n\r\n# YMSG\r\ndialog.question.rejectcancel=Rifiutare l\'\'annullamento inviato da {0}?\r\n\r\n# YMSG\r\ndialog.success.approvecancel=Annullamento approvato\r\n\r\n# YMSG\r\ndialog.success.rejectcancel=Annullamento rifiutato\r\n\r\n# YMSG\r\ndialog.success.approve=Richiesta di ferie approvata\r\n\r\n# YMSG\r\ndialog.success.reject=Richiesta di ferie rifiutata\r\n\r\n# YMSG: link to overlap calendar (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPlLink=Visualizza sovrapposizioni\r\n\r\n# YMSG: link to overlap calendar (e.g.  1 overlap, Singular)\r\nutil.Conversions.OverlapSingLink=Visualizza sovrapposizione\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.Header.CancellationStatus=Annullamento richiesto\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.List.CancellationStatus=Annullato\r\n\r\n#XBUT: Button for Approve action\r\nXBUT_APPROVE=Approva\r\n\r\n#XBUT: Button for Reject action\r\nXBUT_REJECT=Rifiuta\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_APPROVAL=Approva\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_REJECT=Rifiuta\r\n\r\n# YMSG: Loading\r\nLOADING=In caricamento...\r\n\r\n# XTIT: Leave Request Details\r\nDETAIL_TITLE=Richiesta di ferie\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=Nessuna posizione attualmente disponibile\r\n',
	"hcm/mgr/approve/leaverequests/i18n/i18n_iw.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Days=\\u05D9\\u05DE\\u05D9\\u05DD\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Day_Singular=\\u05D9\\u05D5\\u05DD\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Hours=\\u05E9\\u05E2\\u05D5\\u05EA\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Hour_Singular=\\u05E9\\u05E2\\u05D4\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Value_Days={0} \\u05D9\\u05DE\\u05D9\\u05DD\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Value_Day_Singular={0} \\u05D9\\u05D5\\u05DD\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Value_Hours={0} \\u05E9\\u05E2\\u05D5\\u05EA\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Value_Hour_Singular={0} \\u05E9\\u05E2\\u05D4\r\n\r\n# XFLD: Current Balance of the leave quote on Detail Screen\r\nview.AddInfo.CurrentBalance=\\u05D9\\u05EA\\u05E8\\u05D4 \\u05D6\\u05DE\\u05D9\\u05E0\\u05D4\r\n\r\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\r\nview.AddInfo.Requested=\\u05DE\\u05D1\\u05D5\\u05E7\\u05E9\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPl={0} \\u05D7\\u05E4\\u05D9\\u05E4\\u05D5\\u05EA\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\r\nutil.Conversions.OverlapSing={0} \\u05D7\\u05E4\\u05D9\\u05E4\\u05D4\r\n\r\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\r\nview.Detail.Request=\\u05DE\\u05D1\\u05D5\\u05E7\\u05E9\r\n\r\n# YMSG: Alert message that current balance of leave request may not be accurate.\r\nview.AddInfo.AlertMessageBalanceNotAccurate=\\u05E2\\u05D5\\u05D1\\u05D3 \\u05D6\\u05D4 \\u05D4\\u05D2\\u05D9\\u05E9 \\u05DC\\u05D0\\u05D7\\u05E8\\u05D5\\u05E0\\u05D4 \\u05D1\\u05E7\\u05E9\\u05D5\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05D0\\u05D7\\u05E8\\u05D5\\u05EA. \\u05D9\\u05D9\\u05EA\\u05DB\\u05DF \\u05E9\\u05D4\\u05D9\\u05EA\\u05E8\\u05D4 \\u05DC\\u05D0 \\u05EA\\u05D4\\u05D9\\u05D4 \\u05DE\\u05D3\\u05D5\\u05D9\\u05E7\\u05EA.\r\n\r\n# XSEL: status of Leave Request: approved\r\nview.Calendar.LegendApproved=\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05DE\\u05D0\\u05D5\\u05E9\\u05E8\\u05EA\r\n\r\n# XSEL: status of Leave Request: working day\r\nview.Calendar.LegendWorkingDay=\\u05D9\\u05D5\\u05DD \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4\r\n\r\n# XSEL: status of Leave Request: Open Request\r\nview.Calendar.LegendPending=\\u05DE\\u05DE\\u05EA\\u05D9\\u05DF \\u05DC\\u05D0\\u05D9\\u05E9\\u05D5\\u05E8\r\n\r\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\r\nview.Calendar.LegendDayOff=\\u05DC\\u05D0 \\u05D9\\u05D5\\u05DD \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4\r\n\r\n# XSEL: status of Leave Request: Public Holiday\r\nview.Calendar.LegendHoliday=\\u05D7\\u05D2 \\u05E8\\u05E9\\u05DE\\u05D9\r\n\r\n# XSEL: status of Leave Request: Today\r\nview.Calendar.LegendToday=\\u05D4\\u05D9\\u05D5\\u05DD\r\n\r\n# XSEL: status of Leave Request:  deletion requested (i.e. cancellation of approved leave request has been requested)\r\nview.Calendar.LegendDeletionRequested=\\u05D4\\u05D5\\u05D2\\u05E9\\u05D4 \\u05D1\\u05E7\\u05E9\\u05D4 \\u05DC\\u05D1\\u05D9\\u05D8\\u05D5\\u05DC\r\n\r\n# YMSG: Toast message that approval of leave request was successful\r\nview.Toast.YMSG_LRA_Approved=\\u05D1\\u05E7\\u05E9\\u05EA \\u05D4\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05D0\\u05D5\\u05E9\\u05E8\\u05D4\r\n\r\n# YMSG: Toast message that reject of leave request was successful\r\nview.Toast.YMSG_LRA_Declined=\\u05D1\\u05E7\\u05E9\\u05EA \\u05D4\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05E0\\u05D3\\u05D7\\u05EA\\u05D4\r\n\r\n# XTIT: Leave Request Details\r\nview.Detail.title=\\u05D1\\u05E7\\u05E9\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\r\n\r\n# XTIT: Leave Request Details - Calendar\r\nview.Calendar.title=\\u05DC\\u05D5\\u05D7 \\u05E9\\u05E0\\u05D4\r\n\r\n# XTIT: Leave Type\r\nview.AddInfo.LeaveType=\\u05E1\\u05D5\\u05D2 \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\r\n\r\n# XTIT: Personel Number\r\nview.Header.EmployeeID=\\u05D6\\u05D9\\u05D4\\u05D5\\u05D9 \\u05E2\\u05D5\\u05D1\\u05D3 {0}\r\n\r\n# XTIT: Header text of Master List\r\nview.Master.title=\\u05D1\\u05E7\\u05E9\\u05D5\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 ({0})\r\n\r\n# XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=\\u05D0\\u05E9\\u05E8 \\u05D1\\u05E7\\u05E9\\u05D5\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\r\n\r\n\r\n# XTIT: Title of Email to Employee on Business Card\r\nview.BusinessCard.Employee.Subject=\\u05D4\\u05D1\\u05E7\\u05E9\\u05D4 \\u05E9\\u05DC\\u05DA \\u05DC\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\\: {0}\r\n\r\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\r\nshell.Identity=\\u05D0\\u05E9\\u05E8 \\u05D1\\u05E7\\u05E9\\u05D5\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\r\n\r\n# YMSG\r\ndialog.question.approve=\\u05D4\\u05D0\\u05DD \\u05DC\\u05D0\\u05E9\\u05E8 \\u05D0\\u05EA \\u05D1\\u05E7\\u05E9\\u05EA \\u05D4\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05E9\\u05D4\\u05D5\\u05D2\\u05E9\\u05D4 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 {0}?\r\n\r\n# YMSG\r\ndialog.question.reject=\\u05D4\\u05D0\\u05DD \\u05DC\\u05D3\\u05D7\\u05D5\\u05EA \\u05D0\\u05EA \\u05D1\\u05E7\\u05E9\\u05EA \\u05D4\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05E9\\u05D4\\u05D5\\u05D2\\u05E9\\u05D4 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 {0}?\r\n\r\n# YMSG\r\ndialog.question.approvecancel=\\u05D4\\u05D0\\u05DD \\u05DC\\u05D0\\u05E9\\u05E8 \\u05D0\\u05EA \\u05D4\\u05D1\\u05D9\\u05D8\\u05D5\\u05DC \\u05E9\\u05D4\\u05D5\\u05D2\\u05E9 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 {0}?\r\n\r\n# YMSG\r\ndialog.question.rejectcancel=\\u05D4\\u05D0\\u05DD \\u05DC\\u05D3\\u05D7\\u05D5\\u05EA \\u05D0\\u05EA \\u05D4\\u05D1\\u05D9\\u05D8\\u05D5\\u05DC \\u05E9\\u05D4\\u05D5\\u05D2\\u05E9 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 {0}?\r\n\r\n# YMSG\r\ndialog.success.approvecancel=\\u05D4\\u05D1\\u05D9\\u05D8\\u05D5\\u05DC \\u05D0\\u05D5\\u05E9\\u05E8\r\n\r\n# YMSG\r\ndialog.success.rejectcancel=\\u05D4\\u05D1\\u05D9\\u05D8\\u05D5\\u05DC \\u05E0\\u05D3\\u05D7\\u05D4\r\n\r\n# YMSG\r\ndialog.success.approve=\\u05D1\\u05E7\\u05E9\\u05EA \\u05D4\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05D0\\u05D5\\u05E9\\u05E8\\u05D4\r\n\r\n# YMSG\r\ndialog.success.reject=\\u05D1\\u05E7\\u05E9\\u05EA \\u05D4\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05E0\\u05D3\\u05D7\\u05EA\\u05D4\r\n\r\n# YMSG: link to overlap calendar (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPlLink=\\u05D4\\u05E6\\u05D2 \\u05D7\\u05E4\\u05D9\\u05E4\\u05D5\\u05EA\r\n\r\n# YMSG: link to overlap calendar (e.g.  1 overlap, Singular)\r\nutil.Conversions.OverlapSingLink=\\u05D4\\u05E6\\u05D2 \\u05D7\\u05E4\\u05D9\\u05E4\\u05D4\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.Header.CancellationStatus=\\u05D4\\u05D5\\u05D2\\u05E9\\u05D4 \\u05D1\\u05E7\\u05E9\\u05D4 \\u05DC\\u05D1\\u05D9\\u05D8\\u05D5\\u05DC\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.List.CancellationStatus=\\u05DE\\u05D1\\u05D5\\u05D8\\u05DC\r\n\r\n#XBUT: Button for Approve action\r\nXBUT_APPROVE=\\u05D0\\u05E9\\u05E8\r\n\r\n#XBUT: Button for Reject action\r\nXBUT_REJECT=\\u05D3\\u05D7\\u05D4\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_APPROVAL=\\u05D0\\u05E9\\u05E8\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_REJECT=\\u05D3\\u05D7\\u05D4\r\n\r\n# YMSG: Loading\r\nLOADING=\\u05D8\\u05D5\\u05E2\\u05DF...\r\n\r\n# XTIT: Leave Request Details\r\nDETAIL_TITLE=\\u05D1\\u05E7\\u05E9\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=\\u05D0\\u05D9\\u05DF \\u05DB\\u05E8\\u05D2\\u05E2 \\u05E4\\u05E8\\u05D9\\u05D8\\u05D9\\u05DD \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD\r\n',
	"hcm/mgr/approve/leaverequests/i18n/i18n_ja.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Days=\\u65E5\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Day_Singular=\\u65E5\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Hours=\\u6642\\u9593\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Hour_Singular=\\u6642\\u9593\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Value_Days={0} \\u65E5\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Value_Day_Singular={0} \\u65E5\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Value_Hours={0} \\u6642\\u9593\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Value_Hour_Singular={0} \\u6642\\u9593\r\n\r\n# XFLD: Current Balance of the leave quote on Detail Screen\r\nview.AddInfo.CurrentBalance=\\u4F11\\u6687\\u6B8B\\u65E5\\u6570\r\n\r\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\r\nview.AddInfo.Requested=\\u7533\\u8ACB\\u6E08\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPl={0} \\u4EF6\\u306E\\u91CD\\u8907\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\r\nutil.Conversions.OverlapSing={0} \\u4EF6\\u306E\\u91CD\\u8907\r\n\r\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\r\nview.Detail.Request=\\u7533\\u8ACB\\u6E08\r\n\r\n# YMSG: Alert message that current balance of leave request may not be accurate.\r\nview.AddInfo.AlertMessageBalanceNotAccurate=\\u3053\\u306E\\u5F93\\u696D\\u54E1\\u306B\\u3088\\u3063\\u3066\\u6700\\u8FD1\\u9001\\u4FE1\\u3055\\u308C\\u305F\\u5225\\u306E\\u4F11\\u6687\\u7533\\u8ACB\\u304C\\u3042\\u308A\\u307E\\u3059\\u3002\\u30BF\\u30A4\\u30E0\\u30D0\\u30E9\\u30F3\\u30B9\\u304C\\u6B63\\u78BA\\u3067\\u306F\\u306A\\u3044\\u53EF\\u80FD\\u6027\\u304C\\u3042\\u308A\\u307E\\u3059\\u3002\r\n\r\n# XSEL: status of Leave Request: approved\r\nview.Calendar.LegendApproved=\\u627F\\u8A8D\\u6E08\\u306E\\u4F11\\u6687\r\n\r\n# XSEL: status of Leave Request: working day\r\nview.Calendar.LegendWorkingDay=\\u7A3C\\u50CD\\u65E5\r\n\r\n# XSEL: status of Leave Request: Open Request\r\nview.Calendar.LegendPending=\\u4FDD\\u7559\\u4E2D\\u306E\\u627F\\u8A8D\r\n\r\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\r\nview.Calendar.LegendDayOff=\\u975E\\u7A3C\\u50CD\\u65E5\r\n\r\n# XSEL: status of Leave Request: Public Holiday\r\nview.Calendar.LegendHoliday=\\u795D\\u65E5\r\n\r\n# XSEL: status of Leave Request: Today\r\nview.Calendar.LegendToday=\\u672C\\u65E5\r\n\r\n# XSEL: status of Leave Request:  deletion requested (i.e. cancellation of approved leave request has been requested)\r\nview.Calendar.LegendDeletionRequested=\\u53D6\\u6D88\\u4F9D\\u983C\\u6E08\r\n\r\n# YMSG: Toast message that approval of leave request was successful\r\nview.Toast.YMSG_LRA_Approved=\\u4F11\\u6687\\u7533\\u8ACB\\u304C\\u627F\\u8A8D\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n# YMSG: Toast message that reject of leave request was successful\r\nview.Toast.YMSG_LRA_Declined=\\u4F11\\u6687\\u7533\\u8ACB\\u304C\\u5374\\u4E0B\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n# XTIT: Leave Request Details\r\nview.Detail.title=\\u4F11\\u6687\\u7533\\u8ACB\r\n\r\n# XTIT: Leave Request Details - Calendar\r\nview.Calendar.title=\\u30AB\\u30EC\\u30F3\\u30C0\r\n\r\n# XTIT: Leave Type\r\nview.AddInfo.LeaveType=\\u4F11\\u6687\\u30BF\\u30A4\\u30D7\r\n\r\n# XTIT: Personel Number\r\nview.Header.EmployeeID=\\u5F93\\u696D\\u54E1 ID {0}\r\n\r\n# XTIT: Header text of Master List\r\nview.Master.title=\\u4F11\\u6687\\u7533\\u8ACB ({0})\r\n\r\n# XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=\\u4F11\\u6687\\u7533\\u8ACB\\u627F\\u8A8D\r\n\r\n\r\n# XTIT: Title of Email to Employee on Business Card\r\nview.BusinessCard.Employee.Subject=\\u4F11\\u6687\\u7533\\u8ACB\\u306E\\u30BF\\u30A4\\u30D7\\:  {0}\r\n\r\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\r\nshell.Identity=\\u4F11\\u6687\\u7533\\u8ACB\\u627F\\u8A8D\r\n\r\n# YMSG\r\ndialog.question.approve={0} \\u304B\\u3089\\u9001\\u4FE1\\u3055\\u308C\\u305F\\u4F11\\u6687\\u7533\\u8ACB\\u3092\\u627F\\u8A8D\\u3057\\u307E\\u3059\\u304B\\u3002\r\n\r\n# YMSG\r\ndialog.question.reject={0} \\u304B\\u3089\\u9001\\u4FE1\\u3055\\u308C\\u305F\\u4F11\\u6687\\u7533\\u8ACB\\u3092\\u5374\\u4E0B\\u3057\\u307E\\u3059\\u304B\\u3002\r\n\r\n# YMSG\r\ndialog.question.approvecancel={0} \\u304B\\u3089\\u9001\\u4FE1\\u3055\\u308C\\u305F\\u53D6\\u6D88\\u3092\\u627F\\u8A8D\\u3057\\u307E\\u3059\\u304B\\u3002\r\n\r\n# YMSG\r\ndialog.question.rejectcancel={0} \\u304B\\u3089\\u9001\\u4FE1\\u3055\\u308C\\u305F\\u53D6\\u6D88\\u3092\\u5374\\u4E0B\\u3057\\u307E\\u3059\\u304B\\u3002\r\n\r\n# YMSG\r\ndialog.success.approvecancel=\\u53D6\\u6D88\\u304C\\u627F\\u8A8D\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n# YMSG\r\ndialog.success.rejectcancel=\\u53D6\\u6D88\\u304C\\u5374\\u4E0B\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n# YMSG\r\ndialog.success.approve=\\u4F11\\u6687\\u7533\\u8ACB\\u304C\\u627F\\u8A8D\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n# YMSG\r\ndialog.success.reject=\\u4F11\\u6687\\u7533\\u8ACB\\u304C\\u5374\\u4E0B\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n# YMSG: link to overlap calendar (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPlLink=\\u91CD\\u8907\\u8868\\u793A\r\n\r\n# YMSG: link to overlap calendar (e.g.  1 overlap, Singular)\r\nutil.Conversions.OverlapSingLink=\\u91CD\\u8907\\u8868\\u793A\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.Header.CancellationStatus=\\u53D6\\u6D88\\u4F9D\\u983C\\u6E08\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.List.CancellationStatus=\\u53D6\\u6D88\\u6E08\r\n\r\n#XBUT: Button for Approve action\r\nXBUT_APPROVE=\\u627F\\u8A8D\r\n\r\n#XBUT: Button for Reject action\r\nXBUT_REJECT=\\u5374\\u4E0B\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_APPROVAL=\\u627F\\u8A8D\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_REJECT=\\u5374\\u4E0B\r\n\r\n# YMSG: Loading\r\nLOADING=\\u30ED\\u30FC\\u30C9\\u4E2D...\r\n\r\n# XTIT: Leave Request Details\r\nDETAIL_TITLE=\\u4F11\\u6687\\u7533\\u8ACB\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=\\u73FE\\u5728\\u5229\\u7528\\u3067\\u304D\\u308B\\u30A2\\u30A4\\u30C6\\u30E0\\u306F\\u3042\\u308A\\u307E\\u305B\\u3093\r\n',
	"hcm/mgr/approve/leaverequests/i18n/i18n_no.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Days=Dager\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Day_Singular=Dag\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Hours=Timer\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Hour_Singular=Time\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Value_Days={0} dager\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Value_Day_Singular={0} dag\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Value_Hours={0} timer\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Value_Hour_Singular={0} time\r\n\r\n# XFLD: Current Balance of the leave quote on Detail Screen\r\nview.AddInfo.CurrentBalance=Tilgjengelig feriesaldo\r\n\r\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\r\nview.AddInfo.Requested=\\u00D8nsket\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPl={0} Overlapper\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\r\nutil.Conversions.OverlapSing={0} Overlapping\r\n\r\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\r\nview.Detail.Request=\\u00D8nsket\r\n\r\n# YMSG: Alert message that current balance of leave request may not be accurate.\r\nview.AddInfo.AlertMessageBalanceNotAccurate=Denne personen har nylig levert inn andre frav\\u00E6rss\\u00F8knader. Tilgjengelig saldo kan v\\u00E6re feil.\r\n\r\n# XSEL: status of Leave Request: approved\r\nview.Calendar.LegendApproved=Godkjent frav\\u00E6r\r\n\r\n# XSEL: status of Leave Request: working day\r\nview.Calendar.LegendWorkingDay=Arbeidsdag\r\n\r\n# XSEL: status of Leave Request: Open Request\r\nview.Calendar.LegendPending=Venter p\\u00E5 godkjenning\r\n\r\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\r\nview.Calendar.LegendDayOff=Ikke-arbeidsdag\r\n\r\n# XSEL: status of Leave Request: Public Holiday\r\nview.Calendar.LegendHoliday=Helgedag\r\n\r\n# XSEL: status of Leave Request: Today\r\nview.Calendar.LegendToday=I dag\r\n\r\n# XSEL: status of Leave Request:  deletion requested (i.e. cancellation of approved leave request has been requested)\r\nview.Calendar.LegendDeletionRequested=Annullering \\u00F8nsket\r\n\r\n# YMSG: Toast message that approval of leave request was successful\r\nview.Toast.YMSG_LRA_Approved=Frav\\u00E6rss\\u00F8knad godkjent\r\n\r\n# YMSG: Toast message that reject of leave request was successful\r\nview.Toast.YMSG_LRA_Declined=Frav\\u00E6rss\\u00F8knad avvist\r\n\r\n# XTIT: Leave Request Details\r\nview.Detail.title=Frav\\u00E6rss\\u00F8knad\r\n\r\n# XTIT: Leave Request Details - Calendar\r\nview.Calendar.title=Kalender\r\n\r\n# XTIT: Leave Type\r\nview.AddInfo.LeaveType=Frav\\u00E6rstype\r\n\r\n# XTIT: Personel Number\r\nview.Header.EmployeeID=Medarbeider-ID {0}\r\n\r\n# XTIT: Header text of Master List\r\nview.Master.title=Frav\\u00E6rss\\u00F8knader ({0})\r\n\r\n# XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=Godkjenn frav\\u00E6rss\\u00F8knader\r\n\r\n\r\n# XTIT: Title of Email to Employee on Business Card\r\nview.BusinessCard.Employee.Subject=Din s\\u00F8knad om frav\\u00E6r\\: {0}\r\n\r\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\r\nshell.Identity=Godkjenn frav\\u00E6rss\\u00F8knader\r\n\r\n# YMSG\r\ndialog.question.approve=Godkjenne frav\\u00E6rss\\u00F8knaden fra {0}?\r\n\r\n# YMSG\r\ndialog.question.reject=Avvise frav\\u00E6rss\\u00F8knaden fra {0}?\r\n\r\n# YMSG\r\ndialog.question.approvecancel=Godkjenne annulleringen fra {0}?\r\n\r\n# YMSG\r\ndialog.question.rejectcancel=Avvise annulleringen fra {0}?\r\n\r\n# YMSG\r\ndialog.success.approvecancel=Annullering godkjent\r\n\r\n# YMSG\r\ndialog.success.rejectcancel=Annullering avvist\r\n\r\n# YMSG\r\ndialog.success.approve=Frav\\u00E6rss\\u00F8knad godkjent\r\n\r\n# YMSG\r\ndialog.success.reject=Frav\\u00E6rss\\u00F8knad avvist\r\n\r\n# YMSG: link to overlap calendar (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPlLink=Vis overlappinger\r\n\r\n# YMSG: link to overlap calendar (e.g.  1 overlap, Singular)\r\nutil.Conversions.OverlapSingLink=Vis overlapping\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.Header.CancellationStatus=Annullering \\u00F8nsket\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.List.CancellationStatus=Annullert\r\n\r\n#XBUT: Button for Approve action\r\nXBUT_APPROVE=Godkjenn\r\n\r\n#XBUT: Button for Reject action\r\nXBUT_REJECT=Avvis\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_APPROVAL=Godkjenn\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_REJECT=Avvis\r\n\r\n# YMSG: Loading\r\nLOADING=Laster ...\r\n\r\n# XTIT: Leave Request Details\r\nDETAIL_TITLE=Frav\\u00E6rss\\u00F8knad\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=Ingen posisjoner er for \\u00F8yeblikket tilgjengelige\r\n',
	"hcm/mgr/approve/leaverequests/i18n/i18n_pl.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Days=Dni\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Day_Singular=Dzie\\u0144\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Hours=Godz.\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Hour_Singular=Godzina\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Value_Days={0} dni\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Value_Day_Singular={0} dzie\\u0144\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Value_Hours={0} godz.\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Value_Hour_Singular={0} godz.\r\n\r\n# XFLD: Current Balance of the leave quote on Detail Screen\r\nview.AddInfo.CurrentBalance=Dost\\u0119pne saldo\r\n\r\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\r\nview.AddInfo.Requested=Wniosek z\\u0142o\\u017Cono\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPl=Liczba pokry\\u0107\\: {0}\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\r\nutil.Conversions.OverlapSing={0} pokrycie\r\n\r\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\r\nview.Detail.Request=Wniosek z\\u0142o\\u017Cono\r\n\r\n# YMSG: Alert message that current balance of leave request may not be accurate.\r\nview.AddInfo.AlertMessageBalanceNotAccurate=Ta osoba przes\\u0142a\\u0142a ostatnio inne wnioski urlopowe. Saldo mo\\u017Ce nie by\\u0107 dok\\u0142adne.\r\n\r\n# XSEL: status of Leave Request: approved\r\nview.Calendar.LegendApproved=Zatwierdzony urlop\r\n\r\n# XSEL: status of Leave Request: working day\r\nview.Calendar.LegendWorkingDay=Dzie\\u0144 roboczy\r\n\r\n# XSEL: status of Leave Request: Open Request\r\nview.Calendar.LegendPending=Oczekuje na zatwierdzenie\r\n\r\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\r\nview.Calendar.LegendDayOff=Dzie\\u0144 wolny od pracy\r\n\r\n# XSEL: status of Leave Request: Public Holiday\r\nview.Calendar.LegendHoliday=Dzie\\u0144 \\u015Bwi\\u0105teczny\r\n\r\n# XSEL: status of Leave Request: Today\r\nview.Calendar.LegendToday=Dzisiaj\r\n\r\n# XSEL: status of Leave Request:  deletion requested (i.e. cancellation of approved leave request has been requested)\r\nview.Calendar.LegendDeletionRequested=Za\\u017C\\u0105dano anulowania\r\n\r\n# YMSG: Toast message that approval of leave request was successful\r\nview.Toast.YMSG_LRA_Approved=Zatwierdzono wniosek urlopowy\r\n\r\n# YMSG: Toast message that reject of leave request was successful\r\nview.Toast.YMSG_LRA_Declined=Odrzucono wniosek urlopwoy\r\n\r\n# XTIT: Leave Request Details\r\nview.Detail.title=Wniosek urlopowy\r\n\r\n# XTIT: Leave Request Details - Calendar\r\nview.Calendar.title=Kalendarz\r\n\r\n# XTIT: Leave Type\r\nview.AddInfo.LeaveType=Typ urlopu\r\n\r\n# XTIT: Personel Number\r\nview.Header.EmployeeID=ID pracownika {0}\r\n\r\n# XTIT: Header text of Master List\r\nview.Master.title=Wnioski urlopowe ({0})\r\n\r\n# XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=Zatwierd\\u017A wnioski urlopowe\r\n\r\n\r\n# XTIT: Title of Email to Employee on Business Card\r\nview.BusinessCard.Employee.Subject=Wniosek urlopowy\\: {0}\r\n\r\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\r\nshell.Identity=Zatwierd\\u017A wnioski urlopowe\r\n\r\n# YMSG\r\ndialog.question.approve=Zatwierdzi\\u0107 wniosek urlopowy przes\\u0142any przez {0}?\r\n\r\n# YMSG\r\ndialog.question.reject=Odrzuci\\u0107 wniosek urlopowy przes\\u0142any przez {0}?\r\n\r\n# YMSG\r\ndialog.question.approvecancel=Zatwierdzi\\u0107 anulacj\\u0119 przes\\u0142an\\u0105 przez {0}?\r\n\r\n# YMSG\r\ndialog.question.rejectcancel=Odrzuci\\u0107 anulacj\\u0119 przes\\u0142an\\u0105 przez {0}?\r\n\r\n# YMSG\r\ndialog.success.approvecancel=Zatwierdzono anulowanie\r\n\r\n# YMSG\r\ndialog.success.rejectcancel=Odrzucono anulowanie\r\n\r\n# YMSG\r\ndialog.success.approve=Zatwierdzono wniosek urlopowy\r\n\r\n# YMSG\r\ndialog.success.reject=Odrzucono wniosek urlopwoy\r\n\r\n# YMSG: link to overlap calendar (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPlLink=Poka\\u017C pokrycia\r\n\r\n# YMSG: link to overlap calendar (e.g.  1 overlap, Singular)\r\nutil.Conversions.OverlapSingLink=Poka\\u017C pokrycie\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.Header.CancellationStatus=Za\\u017C\\u0105dano anulowania\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.List.CancellationStatus=Anulowany\r\n\r\n#XBUT: Button for Approve action\r\nXBUT_APPROVE=Zatwierd\\u017A\r\n\r\n#XBUT: Button for Reject action\r\nXBUT_REJECT=Odrzu\\u0107\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_APPROVAL=Zatwierdzanie\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_REJECT=Odrzucanie\r\n\r\n# YMSG: Loading\r\nLOADING=Wczytywanie...\r\n\r\n# XTIT: Leave Request Details\r\nDETAIL_TITLE=Wniosek urlopowy\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=Obecnie brak dost\\u0119pnych pozycji\r\n',
	"hcm/mgr/approve/leaverequests/i18n/i18n_pt.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Days=Dias\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Day_Singular=Dia\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Hours=Horas\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Hour_Singular=Hora\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Value_Days={0} dias\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Value_Day_Singular={0} dia\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Value_Hours={0} horas\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Value_Hour_Singular={0} hora\r\n\r\n# XFLD: Current Balance of the leave quote on Detail Screen\r\nview.AddInfo.CurrentBalance=Saldo dispon\\u00EDvel\r\n\r\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\r\nview.AddInfo.Requested=Solicitado\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPl={0} sobreposi\\u00E7\\u00F5es\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\r\nutil.Conversions.OverlapSing={0} sobreposi\\u00E7\\u00E3o\r\n\r\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\r\nview.Detail.Request=Solicitado\r\n\r\n# YMSG: Alert message that current balance of leave request may not be accurate.\r\nview.AddInfo.AlertMessageBalanceNotAccurate=Essa pessoa enviou recentemente outras solicita\\u00E7\\u00F5es de aus\\u00EAncia. O saldo pode n\\u00E3o estar correto.\r\n\r\n# XSEL: status of Leave Request: approved\r\nview.Calendar.LegendApproved=Aprovada\r\n\r\n# XSEL: status of Leave Request: working day\r\nview.Calendar.LegendWorkingDay=Dia de trabalho\r\n\r\n# XSEL: status of Leave Request: Open Request\r\nview.Calendar.LegendPending=Aprova\\u00E7\\u00E3o pendente\r\n\r\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\r\nview.Calendar.LegendDayOff=Dia n\\u00E3o trabalhado\r\n\r\n# XSEL: status of Leave Request: Public Holiday\r\nview.Calendar.LegendHoliday=Feriado\r\n\r\n# XSEL: status of Leave Request: Today\r\nview.Calendar.LegendToday=Hoje\r\n\r\n# XSEL: status of Leave Request:  deletion requested (i.e. cancellation of approved leave request has been requested)\r\nview.Calendar.LegendDeletionRequested=Cancelamento solicitado\r\n\r\n# YMSG: Toast message that approval of leave request was successful\r\nview.Toast.YMSG_LRA_Approved=Solicita\\u00E7\\u00E3o de aus\\u00EAncia aprovada\r\n\r\n# YMSG: Toast message that reject of leave request was successful\r\nview.Toast.YMSG_LRA_Declined=Solicita\\u00E7\\u00E3o de aus\\u00EAncia rejeitada\r\n\r\n# XTIT: Leave Request Details\r\nview.Detail.title=Solicita\\u00E7\\u00E3o de aus\\u00EAncia\r\n\r\n# XTIT: Leave Request Details - Calendar\r\nview.Calendar.title=Calend\\u00E1rio\r\n\r\n# XTIT: Leave Type\r\nview.AddInfo.LeaveType=Tipo de aus\\u00EAncia\r\n\r\n# XTIT: Personel Number\r\nview.Header.EmployeeID=ID do empregado {0}\r\n\r\n# XTIT: Header text of Master List\r\nview.Master.title=Solicita\\u00E7\\u00F5es de aus\\u00EAncia ({0})\r\n\r\n# XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=Aprovar solicita\\u00E7\\u00F5es de aus\\u00EAncia\r\n\r\n\r\n# XTIT: Title of Email to Employee on Business Card\r\nview.BusinessCard.Employee.Subject=Sua solicita\\u00E7\\u00E3o de aus\\u00EAncia\\: {0}\r\n\r\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\r\nshell.Identity=Aprovar solicita\\u00E7\\u00F5es de aus\\u00EAncia\r\n\r\n# YMSG\r\ndialog.question.approve=Aprovar a solicita\\u00E7\\u00E3o de aus\\u00EAncia enviada por {0}?\r\n\r\n# YMSG\r\ndialog.question.reject=Rejeitar a solicita\\u00E7\\u00E3o de aus\\u00EAncia enviada por {0}?\r\n\r\n# YMSG\r\ndialog.question.approvecancel=Aprovar o cancelamento enviado por {0}?\r\n\r\n# YMSG\r\ndialog.question.rejectcancel=Rejeitar o cancelamento enviado por {0}?\r\n\r\n# YMSG\r\ndialog.success.approvecancel=Cancelamento aprovado\r\n\r\n# YMSG\r\ndialog.success.rejectcancel=Cancelamento rejeitado\r\n\r\n# YMSG\r\ndialog.success.approve=Solicita\\u00E7\\u00E3o de aus\\u00EAncia aprovada\r\n\r\n# YMSG\r\ndialog.success.reject=Solicita\\u00E7\\u00E3o de aus\\u00EAncia rejeitada\r\n\r\n# YMSG: link to overlap calendar (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPlLink=Exibir sobreposi\\u00E7\\u00F5es\r\n\r\n# YMSG: link to overlap calendar (e.g.  1 overlap, Singular)\r\nutil.Conversions.OverlapSingLink=Exibir sobreposi\\u00E7\\u00E3o\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.Header.CancellationStatus=Cancelamento solicitado\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.List.CancellationStatus=Cancelado\r\n\r\n#XBUT: Button for Approve action\r\nXBUT_APPROVE=Aprovar\r\n\r\n#XBUT: Button for Reject action\r\nXBUT_REJECT=Rejeitar\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_APPROVAL=Aprovar\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_REJECT=Rejeitar\r\n\r\n# YMSG: Loading\r\nLOADING=Carregando...\r\n\r\n# XTIT: Leave Request Details\r\nDETAIL_TITLE=Solicita\\u00E7\\u00E3o de aus\\u00EAncia\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=Nenhum item atualmente dispon\\u00EDvel\r\n',
	"hcm/mgr/approve/leaverequests/i18n/i18n_ru.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Days=\\u0434\\u043D.\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Day_Singular=\\u0414\\u0435\\u043D\\u044C\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Hours=\\u0427\\u0430\\u0441\\u044B\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Hour_Singular=\\u0427\\u0430\\u0441\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Value_Days={0} \\u0434\\u043D.\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Value_Day_Singular={0} \\u0434\\u0435\\u043D\\u044C\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Value_Hours={0} \\u0447.\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Value_Hour_Singular={0} \\u0447\\u0430\\u0441\r\n\r\n# XFLD: Current Balance of the leave quote on Detail Screen\r\nview.AddInfo.CurrentBalance=\\u0414\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\\u0439 \\u043E\\u0441\\u0442\\u0430\\u0442\\u043E\\u043A\r\n\r\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\r\nview.AddInfo.Requested=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0448\\u0435\\u043D\\u043E\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPl=\\u041A\\u043E\\u043D\\u0444\\u043B\\u0438\\u043A\\u0442\\u044B\\: {0}\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\r\nutil.Conversions.OverlapSing={0} \\u043A\\u043E\\u043D\\u0444\\u043B\\u0438\\u043A\\u0442\r\n\r\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\r\nview.Detail.Request=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0448\\u0435\\u043D\\u043E\r\n\r\n# YMSG: Alert message that current balance of leave request may not be accurate.\r\nview.AddInfo.AlertMessageBalanceNotAccurate=\\u042D\\u0442\\u043E\\u0442 \\u0441\\u043E\\u0442\\u0440\\u0443\\u0434\\u043D\\u0438\\u043A \\u043D\\u0435\\u0434\\u0430\\u0432\\u043D\\u043E \\u043F\\u043E\\u0434\\u0430\\u0432\\u0430\\u043B \\u0434\\u0440\\u0443\\u0433\\u0438\\u0435 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0438 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A. \\u041E\\u0441\\u0442\\u0430\\u0442\\u043E\\u043A \\u0434\\u043D\\u0435\\u0439 \\u043C\\u043E\\u0436\\u0435\\u0442 \\u0431\\u044B\\u0442\\u044C \\u043D\\u0435\\u0442\\u043E\\u0447\\u0435\\u043D.\r\n\r\n# XSEL: status of Leave Request: approved\r\nview.Calendar.LegendApproved=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u043D\\u044B\\u0439 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\r\n\r\n# XSEL: status of Leave Request: working day\r\nview.Calendar.LegendWorkingDay=\\u0420\\u0430\\u0431\\u043E\\u0447\\u0438\\u0439 \\u0434\\u0435\\u043D\\u044C\r\n\r\n# XSEL: status of Leave Request: Open Request\r\nview.Calendar.LegendPending=\\u041E\\u0436\\u0438\\u0434\\u0430\\u0435\\u0442 \\u0443\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u044F\r\n\r\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\r\nview.Calendar.LegendDayOff=\\u041D\\u0435\\u0440\\u0430\\u0431\\u043E\\u0447\\u0438\\u0439 \\u0434\\u0435\\u043D\\u044C\r\n\r\n# XSEL: status of Leave Request: Public Holiday\r\nview.Calendar.LegendHoliday=\\u041F\\u0440\\u0430\\u0437\\u0434\\u043D\\u0438\\u0447\\u043D\\u044B\\u0439 \\u0434\\u0435\\u043D\\u044C\r\n\r\n# XSEL: status of Leave Request: Today\r\nview.Calendar.LegendToday=\\u0421\\u0435\\u0433\\u043E\\u0434\\u043D\\u044F\r\n\r\n# XSEL: status of Leave Request:  deletion requested (i.e. cancellation of approved leave request has been requested)\r\nview.Calendar.LegendDeletionRequested=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0448\\u0435\\u043D\\u0430 \\u043E\\u0442\\u043C\\u0435\\u043D\\u0430\r\n\r\n# YMSG: Toast message that approval of leave request was successful\r\nview.Toast.YMSG_LRA_Approved=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A \\u0443\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0430\r\n\r\n# YMSG: Toast message that reject of leave request was successful\r\nview.Toast.YMSG_LRA_Declined=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A \\u043E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0435\\u043D\\u0430\r\n\r\n# XTIT: Leave Request Details\r\nview.Detail.title=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\r\n\r\n# XTIT: Leave Request Details - Calendar\r\nview.Calendar.title=\\u041A\\u0430\\u043B\\u0435\\u043D\\u0434\\u0430\\u0440\\u044C\r\n\r\n# XTIT: Leave Type\r\nview.AddInfo.LeaveType=\\u0422\\u0438\\u043F \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\\u0430\r\n\r\n# XTIT: Personel Number\r\nview.Header.EmployeeID=ID \\u0441\\u043E\\u0442\\u0440\\u0443\\u0434\\u043D\\u0438\\u043A\\u0430\\: {0}\r\n\r\n# XTIT: Header text of Master List\r\nview.Master.title=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0438 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A ({0})\r\n\r\n# XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435 \\u0437\\u0430\\u044F\\u0432\\u043E\\u043A \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\r\n\r\n\r\n# XTIT: Title of Email to Employee on Business Card\r\nview.BusinessCard.Employee.Subject=\\u0412\\u0430\\u0448\\u0430 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0430 \\u043D\\u0430 \\u043E\\u0442\\u0441\\u0443\\u0442\\u0441\\u0442\\u0432\\u0438\\u0435\\: {0}\r\n\r\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\r\nshell.Identity=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435 \\u0437\\u0430\\u044F\\u0432\\u043E\\u043A \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\r\n\r\n# YMSG\r\ndialog.question.approve=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0434\\u0438\\u0442\\u044C \\u0437\\u0430\\u044F\\u0432\\u043A\\u0443 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A, \\u043F\\u043E\\u043B\\u0443\\u0447\\u0435\\u043D\\u043D\\u0443\\u044E \\u043E\\u0442 {0}?\r\n\r\n# YMSG\r\ndialog.question.reject=\\u041E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0438\\u0442\\u044C \\u0437\\u0430\\u044F\\u0432\\u043A\\u0443 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A, \\u043F\\u043E\\u043B\\u0443\\u0447\\u0435\\u043D\\u043D\\u0443\\u044E \\u043E\\u0442 {0}?\r\n\r\n# YMSG\r\ndialog.question.approvecancel=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0434\\u0438\\u0442\\u044C \\u043E\\u0442\\u043C\\u0435\\u043D\\u0443, \\u043F\\u043E\\u043B\\u0443\\u0447\\u0435\\u043D\\u043D\\u0443\\u044E \\u043E\\u0442 {0}?\r\n\r\n# YMSG\r\ndialog.question.rejectcancel=\\u041E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0438\\u0442\\u044C \\u043E\\u0442\\u043C\\u0435\\u043D\\u0443, \\u043F\\u043E\\u043B\\u0443\\u0447\\u0435\\u043D\\u043D\\u0443\\u044E \\u043E\\u0442 {0}?\r\n\r\n# YMSG\r\ndialog.success.approvecancel=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0430 \\u0443\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0430\r\n\r\n# YMSG\r\ndialog.success.rejectcancel=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0430 \\u043E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0435\\u043D\\u0430\r\n\r\n# YMSG\r\ndialog.success.approve=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A \\u0443\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0430\r\n\r\n# YMSG\r\ndialog.success.reject=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A \\u043E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0435\\u043D\\u0430\r\n\r\n# YMSG: link to overlap calendar (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPlLink=\\u041F\\u043E\\u043A\\u0430\\u0437\\u0430\\u0442\\u044C \\u043F\\u0435\\u0440\\u0435\\u0441\\u0435\\u0447\\u0435\\u043D\\u0438\\u044F\r\n\r\n# YMSG: link to overlap calendar (e.g.  1 overlap, Singular)\r\nutil.Conversions.OverlapSingLink=\\u041F\\u043E\\u043A\\u0430\\u0437\\u0430\\u0442\\u044C \\u043F\\u0435\\u0440\\u0435\\u0441\\u0435\\u0447\\u0435\\u043D\\u0438\\u0435\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.Header.CancellationStatus=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0448\\u0435\\u043D\\u0430 \\u043E\\u0442\\u043C\\u0435\\u043D\\u0430\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.List.CancellationStatus=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0435\\u043D\\u043E\r\n\r\n#XBUT: Button for Approve action\r\nXBUT_APPROVE=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0434\\u0438\\u0442\\u044C\r\n\r\n#XBUT: Button for Reject action\r\nXBUT_REJECT=\\u041E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_APPROVAL=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0434\\u0438\\u0442\\u044C\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_REJECT=\\u041E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0438\\u0442\\u044C\r\n\r\n# YMSG: Loading\r\nLOADING=\\u0417\\u0430\\u0433\\u0440\\u0443\\u0437\\u043A\\u0430...\r\n\r\n# XTIT: Leave Request Details\r\nDETAIL_TITLE=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=\\u0412 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0439 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442 \\u043D\\u0435\\u0442 \\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\\u0445 \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u0439\r\n',
	"hcm/mgr/approve/leaverequests/i18n/i18n_tr.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Days=G\\u00FCn\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Day_Singular=G\\u00FCn\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Hours=Saat\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Hour_Singular=Saat\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Value_Days={0} g\\u00FCn\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Value_Day_Singular={0} g\\u00FCn\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Value_Hours={0} saat\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Value_Hour_Singular={0} saat\r\n\r\n# XFLD: Current Balance of the leave quote on Detail Screen\r\nview.AddInfo.CurrentBalance=Kullan\\u0131labilir bakiye\r\n\r\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\r\nview.AddInfo.Requested=Talep edilen\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPl={0} \\u00C7ak\\u0131\\u015Fmalar\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\r\nutil.Conversions.OverlapSing={0} \\u00C7ak\\u0131\\u015Fma\r\n\r\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\r\nview.Detail.Request=Talep edilen\r\n\r\n# YMSG: Alert message that current balance of leave request may not be accurate.\r\nview.AddInfo.AlertMessageBalanceNotAccurate=Bu ki\\u015Fi daha \\u00F6nce ba\\u015Fka izin talepleri g\\u00F6nderdi. Bakiye do\\u011Fru olmayabilir.\r\n\r\n# XSEL: status of Leave Request: approved\r\nview.Calendar.LegendApproved=Onaylanan izin\r\n\r\n# XSEL: status of Leave Request: working day\r\nview.Calendar.LegendWorkingDay=\\u0130\\u015Fg\\u00FCn\\u00FC\r\n\r\n# XSEL: status of Leave Request: Open Request\r\nview.Calendar.LegendPending=Onay beklemede\r\n\r\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\r\nview.Calendar.LegendDayOff=\\u0130\\u015Fg\\u00FCn\\u00FC de\\u011Fil\r\n\r\n# XSEL: status of Leave Request: Public Holiday\r\nview.Calendar.LegendHoliday=Resmi tatil\r\n\r\n# XSEL: status of Leave Request: Today\r\nview.Calendar.LegendToday=Bug\\u00FCn\r\n\r\n# XSEL: status of Leave Request:  deletion requested (i.e. cancellation of approved leave request has been requested)\r\nview.Calendar.LegendDeletionRequested=\\u0130ptal talep edildi\r\n\r\n# YMSG: Toast message that approval of leave request was successful\r\nview.Toast.YMSG_LRA_Approved=\\u0130zin talebi onayland\\u0131\r\n\r\n# YMSG: Toast message that reject of leave request was successful\r\nview.Toast.YMSG_LRA_Declined=\\u0130zin talebi reddedildi\r\n\r\n# XTIT: Leave Request Details\r\nview.Detail.title=\\u0130zin talebi\r\n\r\n# XTIT: Leave Request Details - Calendar\r\nview.Calendar.title=Takvim\r\n\r\n# XTIT: Leave Type\r\nview.AddInfo.LeaveType=\\u0130zin t\\u00FCr\\u00FC\r\n\r\n# XTIT: Personel Number\r\nview.Header.EmployeeID=\\u00C7al\\u0131\\u015Fan tan\\u0131t\\u0131c\\u0131s\\u0131 {0}\r\n\r\n# XTIT: Header text of Master List\r\nview.Master.title=\\u0130zin talepleri ({0})\r\n\r\n# XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=\\u0130zin taleplerini onayla\r\n\r\n\r\n# XTIT: Title of Email to Employee on Business Card\r\nview.BusinessCard.Employee.Subject=\\u0130zin talebiniz\\: {0}\r\n\r\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\r\nshell.Identity=\\u0130zin taleplerini onayla\r\n\r\n# YMSG\r\ndialog.question.approve={0} taraf\\u0131ndan g\\u00F6nderilen izin talebi onaylans\\u0131n m\\u0131?\r\n\r\n# YMSG\r\ndialog.question.reject={0} taraf\\u0131ndan g\\u00F6nderilen izin talebi reddedilsin mi?\r\n\r\n# YMSG\r\ndialog.question.approvecancel={0} taraf\\u0131ndan g\\u00F6nderilen iptal onaylans\\u0131n m\\u0131?\r\n\r\n# YMSG\r\ndialog.question.rejectcancel={0} taraf\\u0131ndan g\\u00F6nderilen iptal reddedilsin mi?\r\n\r\n# YMSG\r\ndialog.success.approvecancel=\\u0130ptal onayland\\u0131\r\n\r\n# YMSG\r\ndialog.success.rejectcancel=\\u0130ptal reddedildi\r\n\r\n# YMSG\r\ndialog.success.approve=\\u0130zin talebi onayland\\u0131\r\n\r\n# YMSG\r\ndialog.success.reject=\\u0130zin talebi reddedildi\r\n\r\n# YMSG: link to overlap calendar (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPlLink=\\u00C7ak\\u0131\\u015Fmalar\\u0131 g\\u00F6ster\r\n\r\n# YMSG: link to overlap calendar (e.g.  1 overlap, Singular)\r\nutil.Conversions.OverlapSingLink=\\u00C7ak\\u0131\\u015Fmay\\u0131 g\\u00F6ster\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.Header.CancellationStatus=\\u0130ptal talep edildi\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.List.CancellationStatus=\\u0130ptal edildi\r\n\r\n#XBUT: Button for Approve action\r\nXBUT_APPROVE=Onayla\r\n\r\n#XBUT: Button for Reject action\r\nXBUT_REJECT=Reddet\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_APPROVAL=Onayla\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_REJECT=Reddet\r\n\r\n# YMSG: Loading\r\nLOADING=Y\\u00FCkleniyor...\r\n\r\n# XTIT: Leave Request Details\r\nDETAIL_TITLE=\\u0130zin talebi\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=\\u015Eu anda kalem yok\r\n',
	"hcm/mgr/approve/leaverequests/i18n/i18n_zh_CN.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Days=\\u5929\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Day_Singular=\\u5929\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Hours=\\u5C0F\\u65F6\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Hour_Singular=\\u5C0F\\u65F6\r\n\r\n# XFLD: number of absence days requested (e.g. two days)\r\nutil.Conversions.Value_Days={0} \\u5929\r\n\r\n# XFLD: number of absence days requested (singular)\r\nutil.Conversions.Value_Day_Singular={0} \\u5929\r\n\r\n# XFLD: number of absence hours requested (e.g. two hours)\r\nutil.Conversions.Value_Hours={0} \\u5C0F\\u65F6\r\n\r\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\r\nutil.Conversions.Value_Hour_Singular={0} \\u5C0F\\u65F6\r\n\r\n# XFLD: Current Balance of the leave quote on Detail Screen\r\nview.AddInfo.CurrentBalance=\\u53EF\\u7528\\u5269\\u4F59\\u4F11\\u5047\r\n\r\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\r\nview.AddInfo.Requested=\\u5DF2\\u7533\\u8BF7\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPl={0} \\u5904\\u91CD\\u53E0\r\n\r\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\r\nutil.Conversions.OverlapSing={0} \\u5904\\u91CD\\u53E0\r\n\r\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\r\nview.Detail.Request=\\u5DF2\\u7533\\u8BF7\r\n\r\n# YMSG: Alert message that current balance of leave request may not be accurate.\r\nview.AddInfo.AlertMessageBalanceNotAccurate=\\u6B64\\u4EBA\\u6700\\u8FD1\\u63D0\\u4EA4\\u8FC7\\u5176\\u4ED6\\u4F11\\u5047\\u7533\\u8BF7\\u3002\\u5269\\u4F59\\u4F11\\u5047\\u53EF\\u80FD\\u4E0D\\u51C6\\u786E\\u3002\r\n\r\n# XSEL: status of Leave Request: approved\r\nview.Calendar.LegendApproved=\\u5DF2\\u6279\\u51C6\\u4F11\\u5047\r\n\r\n# XSEL: status of Leave Request: working day\r\nview.Calendar.LegendWorkingDay=\\u5DE5\\u4F5C\\u65E5\r\n\r\n# XSEL: status of Leave Request: Open Request\r\nview.Calendar.LegendPending=\\u5F85\\u5BA1\\u6279\r\n\r\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\r\nview.Calendar.LegendDayOff=\\u975E\\u5DE5\\u4F5C\\u65E5\r\n\r\n# XSEL: status of Leave Request: Public Holiday\r\nview.Calendar.LegendHoliday=\\u516C\\u5171\\u5047\\u65E5\r\n\r\n# XSEL: status of Leave Request: Today\r\nview.Calendar.LegendToday=\\u4ECA\\u5929\r\n\r\n# XSEL: status of Leave Request:  deletion requested (i.e. cancellation of approved leave request has been requested)\r\nview.Calendar.LegendDeletionRequested=\\u5DF2\\u7533\\u8BF7\\u53D6\\u6D88\r\n\r\n# YMSG: Toast message that approval of leave request was successful\r\nview.Toast.YMSG_LRA_Approved=\\u5DF2\\u6279\\u51C6\\u4F11\\u5047\\u7533\\u8BF7\r\n\r\n# YMSG: Toast message that reject of leave request was successful\r\nview.Toast.YMSG_LRA_Declined=\\u5DF2\\u62D2\\u7EDD\\u4F11\\u5047\\u7533\\u8BF7\r\n\r\n# XTIT: Leave Request Details\r\nview.Detail.title=\\u4F11\\u5047\\u7533\\u8BF7\r\n\r\n# XTIT: Leave Request Details - Calendar\r\nview.Calendar.title=\\u65E5\\u5386\r\n\r\n# XTIT: Leave Type\r\nview.AddInfo.LeaveType=\\u4F11\\u5047\\u7C7B\\u578B\r\n\r\n# XTIT: Personel Number\r\nview.Header.EmployeeID=\\u5458\\u5DE5\\u6807\\u8BC6 {0}\r\n\r\n# XTIT: Header text of Master List\r\nview.Master.title=\\u4F11\\u5047\\u7533\\u8BF7 ({0})\r\n\r\n# XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=\\u5BA1\\u6279\\u4F11\\u5047\\u7533\\u8BF7\r\n\r\n\r\n# XTIT: Title of Email to Employee on Business Card\r\nview.BusinessCard.Employee.Subject=\\u60A8\\u7684\\u4F11\\u5047\\u7533\\u8BF7\\uFF1A{0}\r\n\r\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\r\nshell.Identity=\\u5BA1\\u6279\\u4F11\\u5047\\u7533\\u8BF7\r\n\r\n# YMSG\r\ndialog.question.approve=\\u662F\\u5426\\u6279\\u51C6 {0} \\u63D0\\u4EA4\\u7684\\u4F11\\u5047\\u7533\\u8BF7\\uFF1F\r\n\r\n# YMSG\r\ndialog.question.reject=\\u662F\\u5426\\u62D2\\u7EDD {0} \\u63D0\\u4EA4\\u7684\\u4F11\\u5047\\u7533\\u8BF7\\uFF1F\r\n\r\n# YMSG\r\ndialog.question.approvecancel=\\u662F\\u5426\\u6279\\u51C6 {0} \\u63D0\\u4EA4\\u7684\\u53D6\\u6D88\\u8BF7\\u6C42\\uFF1F\r\n\r\n# YMSG\r\ndialog.question.rejectcancel=\\u662F\\u5426\\u62D2\\u7EDD {0} \\u63D0\\u4EA4\\u7684\\u53D6\\u6D88\\u8BF7\\u6C42\\uFF1F\r\n\r\n# YMSG\r\ndialog.success.approvecancel=\\u5DF2\\u6279\\u51C6\\u53D6\\u6D88\r\n\r\n# YMSG\r\ndialog.success.rejectcancel=\\u5DF2\\u62D2\\u7EDD\\u53D6\\u6D88\r\n\r\n# YMSG\r\ndialog.success.approve=\\u5DF2\\u6279\\u51C6\\u4F11\\u5047\\u7533\\u8BF7\r\n\r\n# YMSG\r\ndialog.success.reject=\\u5DF2\\u62D2\\u7EDD\\u4F11\\u5047\\u7533\\u8BF7\r\n\r\n# YMSG: link to overlap calendar (e.g.  3 overlaps, Plural)\r\nutil.Conversions.OverlapsPlLink=\\u663E\\u793A\\u91CD\\u53E0\r\n\r\n# YMSG: link to overlap calendar (e.g.  1 overlap, Singular)\r\nutil.Conversions.OverlapSingLink=\\u663E\\u793A\\u91CD\\u53E0\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.Header.CancellationStatus=\\u5DF2\\u7533\\u8BF7\\u53D6\\u6D88\r\n\r\n# XFLD: Status: Cancellation of a Leave Request requested \r\nview.List.CancellationStatus=\\u5DF2\\u53D6\\u6D88\r\n\r\n#XBUT: Button for Approve action\r\nXBUT_APPROVE=\\u6279\\u51C6\r\n\r\n#XBUT: Button for Reject action\r\nXBUT_REJECT=\\u62D2\\u7EDD\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_APPROVAL=\\u6279\\u51C6\r\n\r\n#XTIT: Title of the confirmation dialog while executing an action\r\nXTIT_REJECT=\\u62D2\\u7EDD\r\n\r\n# YMSG: Loading\r\nLOADING=\\u52A0\\u8F7D\\u4E2D...\r\n\r\n# XTIT: Leave Request Details\r\nDETAIL_TITLE=\\u4F11\\u5047\\u7533\\u8BF7\r\n\r\n# YMSG: No items are currently available\r\nNO_ITEMS_AVAILABLE=\\u5F53\\u524D\\u65E0\\u53EF\\u7528\\u9879\\u76EE\r\n',
	"hcm/mgr/approve/leaverequests/util/CalendarServices.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mgr.approve.leaverequests.util.CalendarServices");
jQuery.sap.require("hcm.mgr.approve.leaverequests.util.Conversions");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");

hcm.mgr.approve.leaverequests.util.CalendarServices = (function() {

    "use strict";
    var oCurrRequestParam = {}, oCalData = {}, oAppModel = null, sCalStartDate = null,
        oCalModel = new sap.ui.model.json.JSONModel(oCalData);
    oCurrRequestParam.RequestID = "4711";
    oCurrRequestParam.ReqOrigin = "";
    oCurrRequestParam.StartDate = "1970-01-01T00:00:00";
    oCurrRequestParam.EndDate = "1970-01-01T00:00:00";

    return {

        checkLoadRequired: function(oReqStartDate, oReqEndDate) {

            var oReqStartMS = oReqStartDate.getTime(),
                oReqEndMS = oReqEndDate.getTime(),
                calData = oCalModel.getData(),
                oDateFormat = sap.ca.ui.model.format.DateFormat.getDateTimeInstance({
                    pattern: "yyyy-MM-dd'T'HH:mm:ss"
                }),
                oDataStart = calData[oCurrRequestParam.RequestID].range.StartDate,
                oDataEnd = calData[oCurrRequestParam.RequestID].range.EndDate,
                oDataStartMS = oDateFormat.parse(oDataStart).getTime(),
                oDataEndMS = oDateFormat.parse(oDataEnd).getTime(),
                oDataStatus = {};
            oDataStatus.bLoadReq = false;
            oDataStatus.bLoadBefore = false;
            oDataStatus.StartDate = oDataStart;
            oDataStatus.EndDate = oDataEnd;

            if (!calData[oCurrRequestParam.RequestID]) {
                // ideally does not happen
                return;
            }
            // evaluate cases
            if (oReqStartMS > oDataStartMS && oReqEndMS < oDataEndMS) {
                oDataStatus.bLoadReq = false;
                oDataStatus.bLoadBefore = false;
            } else if (oReqEndMS > oDataEndMS) {
                oDataStatus.bLoadReq = true;
                oDataStatus.bLoadBefore = false;
            } else if (oReqStartMS < oDataStartMS) {
                oDataStatus.bLoadReq = true;
                oDataStatus.bLoadBefore = true;
            } else {
                oDataStatus.bLoadReq = false;
                oDataStatus.bLoadBefore = false;
            }

            return oDataStatus;
        },

        getTimeframe: function(oValue, bExtendBefore) {
            var oDateRange = {},
                oStartDate = new Date(),
                oEndDate = new Date(),
                oDateFormat = sap.ca.ui.model.format.DateFormat.getDateTimeInstance({
                    pattern: "yyyy-MM-dd'T'HH:mm:ss"
                }),
                oDate,
                oMS,
                oStartMS,
                oEndMS;

            oDateRange.StartDate = "1970-01-01T00:00:00";
            oDateRange.EndDate = "1970-01-01T00:00:00";

            if (oValue instanceof Date) {
                oDate = oValue;
            } else if (typeof oValue === "string") {
                oDate = oDateFormat.parse(oValue);
            } else {
                return;
            }

            // correction for timezone
            oMS = oDate.getTime();

            if (bExtendBefore === null) {
                // subtract 1 week for start / add 3 weeks for end
                oMS = oDate.getTime();
                oStartMS = oMS - (7 * 24 * 60 * 60 * 1000); // +
                // oTimezoneOffset;
                oEndMS = oMS + (21 * 24 * 60 * 60 * 1000); // +
                // oTimezoneOffset;
                oStartDate.setTime(oStartMS);
                oEndDate.setTime(oEndMS);

                oDateRange.StartDate = oDateFormat.format(oStartDate, false);
                oDateRange.EndDate = oDateFormat.format(oEndDate, false);
            } else if (bExtendBefore === false) {
                // add another 2 weeks to the existing data in the future -
                // timezone offset missing

                oDateRange.StartDate = oValue;

                oMS = oDate.getTime();
                oEndMS = oMS + (14 * 24 * 60 * 60 * 1000);
                oEndDate.setTime(oEndMS);
                oDateRange.EndDate = oDateFormat.format(oEndDate, false);

            } else if (bExtendBefore === true) {
                // add another 2 weeks to the existing data in the past-
                // timezone offset missing

                oDateRange.EndDate = oValue;

                oMS = oDate.getTime();
                oStartMS = oMS - (14 * 24 * 60 * 60 * 1000);
                oStartDate.setTime(oStartMS);
                oDateRange.StartDate = oDateFormat.format(oStartDate, false);
            }

            return oDateRange;

        },

        readCalData: function(sRequestID, oDate, bExtendBefore, sOrigin) {

            // para1: sRequestID (if provided: 'no extend' case
            // para2: sDate (only considered if 'no extend' case)
            // para3: bBefore: 'extend' case - direction considered for calc of
            // new daterange
            var sCalUrl, oThisDateRange, checkCalData, sOriginInfix, thisCalData, collection, calData, sRefDate;
            var oRequestedData = null;

            if (bExtendBefore === null) {
                // calendar should exchange its data (new leadselection in
                // list)
                oCurrRequestParam.RequestID = sRequestID;
                oCurrRequestParam.ReqOrigin = sOrigin;
                oThisDateRange = this.getTimeframe(oDate, null);

                oCurrRequestParam.RequestID = sRequestID;
                oCurrRequestParam.StartDate = oThisDateRange.StartDate;
                oCurrRequestParam.EndDate = oThisDateRange.EndDate;

                // check if data (requestID) is already available:
                checkCalData = oCalModel.getData();
                if (!checkCalData[oCurrRequestParam.RequestID]) {

                    sOriginInfix = oCurrRequestParam.ReqOrigin ? "',SAP__Origin='" + oCurrRequestParam.ReqOrigin : "";
                    sCalUrl = "/TeamCalendarHeaderCollection(StartDate=datetime'" + oCurrRequestParam.StartDate + "',EndDate=datetime'" + oCurrRequestParam.EndDate + "',RequestID='" + oCurrRequestParam.RequestID + sOriginInfix + "',FilterLeaves=false)";

                    if (oAppModel) {
                        oAppModel.read(sCalUrl, undefined, ["$expand=TeamCalendar"], false,
                            function(oData) {
                                oRequestedData = oData;
                            });
                    }

                    // create CalData
                    thisCalData = oCalModel.getData();
                    thisCalData[oCurrRequestParam.RequestID] = {};
                    thisCalData[oCurrRequestParam.RequestID].range = {};
                    thisCalData[oCurrRequestParam.RequestID].range.StartDate = oCurrRequestParam.StartDate;
                    thisCalData[oCurrRequestParam.RequestID].range.EndDate = oCurrRequestParam.EndDate;
                    thisCalData[oCurrRequestParam.RequestID].events = [];

                    if (oRequestedData) {
                        collection = oRequestedData.TeamCalendar.results;

                        thisCalData[oCurrRequestParam.RequestID].events = collection;

                        oCalModel.setData(thisCalData);
                    } else {
                        return;
                    }

                }
            } else {
                // read in the past or in the future and extend existing model
                // check existing range from model
                calData = oCalModel.getData();
                if (calData[oCurrRequestParam.RequestID]) {

                    if (bExtendBefore) {
                        sRefDate = calData[oCurrRequestParam.RequestID].range.StartDate;
                        // calculate new dates and set to the model
                        oThisDateRange = this.getTimeframe(sRefDate,
                            bExtendBefore);
                        calData[oCurrRequestParam.RequestID].range.StartDate = oThisDateRange.StartDate;

                    } else {
                        sRefDate = calData[oCurrRequestParam.RequestID].range.EndDate;
                        // calculate new dates and set to the model
                        oThisDateRange = this.getTimeframe(sRefDate,
                            bExtendBefore);
                        calData[oCurrRequestParam.RequestID].range.EndDate = oThisDateRange.EndDate;
                    }

                    oCurrRequestParam.StartDate = oThisDateRange.StartDate;
                    oCurrRequestParam.EndDate = oThisDateRange.EndDate;

                }

                sOriginInfix = oCurrRequestParam.ReqOrigin ? "',SAP__Origin='" + oCurrRequestParam.ReqOrigin : "";
                sCalUrl = "/TeamCalendarHeaderCollection(StartDate=datetime'" + oCurrRequestParam.StartDate + "',EndDate=datetime'" + oCurrRequestParam.EndDate + "',RequestID='" + oCurrRequestParam.RequestID + sOriginInfix + "',FilterLeaves=false)";

                if (oAppModel) {
                    oAppModel.read(sCalUrl, undefined, ["$expand=TeamCalendar"], false,
                        function(oData) {
                            oRequestedData = oData;
                        });
                }

                if (oRequestedData) {
                    collection = oRequestedData.TeamCalendar.results;
                    for (var i = 0; i < collection.length; i++) {
                        calData[oCurrRequestParam.RequestID].events.push(collection[i]);
                    }
                    oCalModel.setData(calData);
                } else {
                    return;
                }
            }

        },

        setAppModel: function(model) {
            if (model) {
                oAppModel = model;
            }
        },

        getAppModel: function() {
            return oAppModel;
        },

        getLeadRequestID: function() {
            return oCurrRequestParam.RequestID;
        },

        getCalModel: function() {
            return oCalModel;
        },

        clearCalData: function() {
            // clear calendar buffer (necessary because calendar entries
            // become outdated after approval/decline...)
            // create CalData
            var initCalData = {};

            oCalModel.setData(initCalData);
        },

        setCalStartDate: function(oDate) {
            var oDateFormat = sap.ca.ui.model.format.DateFormat.getDateTimeInstance({
                pattern: "yyyy-MM-dd'T'HH:mm:ss"
            });
            sCalStartDate = oDateFormat.format(oDate, false);
        },

        getCalStartDate: function() {
            return sCalStartDate;
        },

        setDateType: function(oValue) {

            var oDate = null;
            var oDateFormat = sap.ca.ui.model.format.DateFormat.getDateTimeInstance({
                pattern: "yyyy-MM-dd'T'HH:mm:ss"
            });

            if (oValue instanceof Date) {
                oDate = hcm.mgr.approve.leaverequests.util.Conversions.revertTimezoneOffset(oValue);
            } else if (typeof oValue === "string") {
                // expects  mockdata(json) with format "2013-07-15T00:00:00"
                oDate = oDateFormat.parse(oValue);
            }

            return oDate;

        }


    };

}());
},
	"hcm/mgr/approve/leaverequests/util/Conversions.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mgr.approve.leaverequests.util.Conversions");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("hcm.mgr.approve.leaverequests.util.NumberFormatter");
jQuery.sap.require("hcm.mgr.approve.leaverequests.Configuration");

hcm.mgr.approve.leaverequests.util.Conversions = (function() {

    "use strict";

    return {

        formatterAbsenceDuration: function(AbsenceDays, AbsenceHours,
            AllDayFlag) {

            var oAbsenceDays, oAbsenceHours, oDuration;

            if (!AbsenceDays || !AbsenceHours || AllDayFlag === null) {
                return "";
            }

            oAbsenceDays = AbsenceDays;
            oAbsenceHours = AbsenceHours;

            if (AllDayFlag) {
                oDuration = hcm.mgr.approve.leaverequests.util.NumberFormatter.formatNumberStripZeros(oAbsenceDays);
            } else {
                oDuration = hcm.mgr.approve.leaverequests.util.NumberFormatter.formatNumberStripZeros(oAbsenceHours);
            }
            return oDuration;
        },

        // convert the UTC Datestring to the local timezone

        formatterAbsenceDurationUnit: function(AbsenceDays, AbsenceHours,
            AllDayFlag) {
            var oAbsenceDays, oAbsenceHours, oDurationUnit, oBundle = hcm.mgr.approve.leaverequests.Configuration.oApplicationFacade.getResourceBundle();

            // if (!AbsenceDays || !AbsenceHours || !AllDayFlag) {
            if (!AbsenceDays || !AbsenceHours || AllDayFlag === null) {
                return "";
            }

            oAbsenceDays = AbsenceDays;
            oAbsenceHours = AbsenceHours;

            if (AllDayFlag) {
                if (oAbsenceDays == 1) {
                    oDurationUnit = oBundle.getText("util.Conversions.Day_Singular");
                } else {
                    oDurationUnit = oBundle.getText("util.Conversions.Days");
                }
            } else {
                if (oAbsenceHours == 1) {
                    oDurationUnit = oBundle.getText("util.Conversions.Hour_Singular");
                } else {
                    oDurationUnit = oBundle.getText("util.Conversions.Hours");
                }
            }
            return oDurationUnit;
        },

        formatterAbsenceDurationAndUnit: function(AbsenceDays, AbsenceHours,
            AllDayFlag) {
            var oAbsenceDays, oAbsenceHours, oDurationUnit, oBundle = hcm.mgr.approve.leaverequests.Configuration.oApplicationFacade.getResourceBundle();

            if (!AbsenceDays || !AbsenceHours || AllDayFlag === null) {
                return "";
            }

            oAbsenceDays = AbsenceDays;
            oAbsenceHours = AbsenceHours;
            if (AllDayFlag) {
                oAbsenceDays = hcm.mgr.approve.leaverequests.util.NumberFormatter.formatNumberStripZeros(oAbsenceDays);
                if (oAbsenceDays == 1) {
                    oDurationUnit = oBundle.getText("util.Conversions.Value_Day_Singular", [oAbsenceDays]);
                } else {
                    oDurationUnit = oBundle.getText("util.Conversions.Value_Days", [oAbsenceDays]);
                }
            } else {
                oAbsenceHours = hcm.mgr.approve.leaverequests.util.NumberFormatter.formatNumberStripZeros(oAbsenceHours);
                if (oAbsenceHours == 1) {
                    oDurationUnit = oBundle.getText("util.Conversions.Value_Hour_Singular", [oAbsenceHours]);
                } else {
                    oDurationUnit = oBundle.getText("util.Conversions.Value_Hours", [oAbsenceHours]);
                }
            }

            return oDurationUnit;
        },

        formatterListCancelStatus: function(sLeaveRequestType) {
            var returnValue = "",
                oBundle = hcm.mgr.approve.leaverequests.Configuration.oApplicationFacade.getResourceBundle();
            if (sLeaveRequestType == "3") {
                returnValue = oBundle.getText("view.List.CancellationStatus");
            }
            return returnValue;
        },

        formatterHeaderCancelStatus: function() {
        	//for unknown reasons previous code was not working when there was only one argument from the s4view
        	var returnValue = "";
        	if(arguments.length > 0){
        		var oBundle = hcm.mgr.approve.leaverequests.Configuration.oApplicationFacade.getResourceBundle();
        		if (arguments[0] == "3") {
        			return oBundle.getText("view.Header.CancellationStatus");
        		}
        	}
        	return returnValue;
        },

        formatterCurrentBalanceVisible: function(currentBalTimeUnitCode) {
            var returnValue = true;

            if (!currentBalTimeUnitCode) {
                returnValue = false;
            }
            // '000' is the initial value; only in this case do not show current
            // balance
            // Remark: Even sick leave (code '001') may require current balance
            if (currentBalTimeUnitCode == "000") {
                returnValue = false;
            }
            return returnValue;
        },

        formatterCurrentBalance: function(CurrentBalance,
            CurrentBalTimeUnitCode) {

            var oCurrentBalance = 0,
                oCurrentBalTimeUnitCode = 0,
                oResCurrentBalance = 0,
                oBundle = hcm.mgr.approve.leaverequests.Configuration.oApplicationFacade.getResourceBundle();

            if (!CurrentBalance || !CurrentBalTimeUnitCode) {
                return "";
            }

            oCurrentBalance = CurrentBalance;
            oCurrentBalTimeUnitCode = CurrentBalTimeUnitCode;

            oCurrentBalance = hcm.mgr.approve.leaverequests.util.NumberFormatter.formatNumberStripZeros(oCurrentBalance);
            // current balance unit = days
            if (oCurrentBalTimeUnitCode == "010") {
                if (oCurrentBalance == 1) {
                    oResCurrentBalance = oBundle.getText("util.Conversions.Value_Day_Singular", [oCurrentBalance]);
                } else {
                    oResCurrentBalance = oBundle.getText("util.Conversions.Value_Days", [oCurrentBalance]);
                }
            }
            // current balance unit = hours
            if (oCurrentBalTimeUnitCode == "001") {
                if (oCurrentBalance == 1) {
                    oResCurrentBalance = oBundle.getText("util.Conversions.Value_Hour_Singular", [oCurrentBalance]);
                } else {
                    oResCurrentBalance = oBundle.getText("util.Conversions.Value_Hours", [oCurrentBalance]);
                }
            }

            return oResCurrentBalance;
        },

        formatterEmployeeID: function(sEmployeeID) {
            if (!sEmployeeID) {
                return "";
            }
            return hcm.mgr.approve.leaverequests.Configuration.oApplicationFacade.getResourceBundle().getText("view.Header.EmployeeID", [sEmployeeID]);
        },

        formatterOverlapsVisible: function(sOverlaps) {
            var returnValue = true;
            if (!sOverlaps) {
                returnValue = false;
            }
            if (sOverlaps == 0) {
                returnValue = false;
            }
            return returnValue;
        },

        formatterOverlaps: function(sOverlaps) {
            var returnValue = "",
                oBundle = hcm.mgr.approve.leaverequests.Configuration.oApplicationFacade.getResourceBundle();

            if (sOverlaps == 1) {
                returnValue = oBundle.getText("util.Conversions.OverlapSing", [sOverlaps]);
            } else if (sOverlaps > 1) {
                returnValue = oBundle.getText("util.Conversions.OverlapsPl", [sOverlaps]);
            }
            return returnValue;
        },

        formatterOverlapLink: function(sOverlaps) {
            var returnValue = "",
                oBundle = hcm.mgr.approve.leaverequests.Configuration.oApplicationFacade.getResourceBundle();
            if (sOverlaps == 1) {
                returnValue = oBundle.getText("util.Conversions.OverlapSingLink", [sOverlaps]);
            } else if (sOverlaps > 1) {
                returnValue = oBundle.getText("util.Conversions.OverlapsPlLink");
            }
            return returnValue;
        },

        // formate the timestamp of the service to number of days
        formatterTimestampToDate: function(sTimestamp) {

            var dateShortFormatter, oDateCreatedOn;
            dateShortFormatter = sap.ca.ui.model.format.DateFormat.getInstance({
                style: "short"
            });

            if (!sTimestamp) {
                return "";
            }

            if (typeof sTimestamp === "string") {
                if (sTimestamp.indexOf("Date") >= 0) {
                    oDateCreatedOn = hcm.mgr.approve.leaverequests.util.Conversions.convertDateStringToDate(sTimestamp);
                } else {
                    oDateCreatedOn = hcm.mgr.approve.leaverequests.util.Conversions.convertTimestampToDate(sTimestamp);
                }
            } else {
                oDateCreatedOn = new Date(sTimestamp);
            }
            oDateCreatedOn = new Date(oDateCreatedOn.getUTCFullYear(),oDateCreatedOn.getUTCMonth(),oDateCreatedOn.getUTCDate());
            return dateShortFormatter.formatDaysAgo(oDateCreatedOn);
        },

        formatterAbsenceDays3: function(StartDate, StartTime, EndDate,
            EndTime, AllDayFlag) {
            // old interface: (sTimeRange, oContext)
            var oTimeRange, oStartDate, oEndDate, oStartTime, oEndTime, dateFormatter;
            dateFormatter = sap.ca.ui.model.format.DateFormat.getInstance({
                style: "full"
            });
            // bug in UI5: function is called several times - only the last time
            // all parameters are available!
            if (!StartDate || !StartTime || !EndDate || !EndTime || AllDayFlag === null) {
                return "";
            }

            oStartDate = dateFormatter.format(StartDate, true);
            oEndDate = dateFormatter.format(EndDate, true);
            oStartTime = hcm.mgr.approve.leaverequests.util.Conversions.formatterTime(StartTime);
            oEndTime = hcm.mgr.approve.leaverequests.util.Conversions.formatterTime(EndTime);

            if (oStartDate === oEndDate) {
                if (!AllDayFlag) {
                    if (oStartTime === oEndTime) {
                        oTimeRange = "";
                    } else {
                        oTimeRange = "   " + oStartTime + " - " + oEndTime;
                    }
                } else {
                    oTimeRange = "";
                }
                oTimeRange = oStartDate + oTimeRange;
            } else {
                oTimeRange = oStartDate + " - " + oEndDate;
            }
            return oTimeRange;
        },

        formatterAbsenceDays3Short: function(StartDate, PTStartTime, EndDate,
            PTEndTime, AllDayFlag) {
            // special formatter - converts into short date- the following
            // format:
            // date: Date(1358346063000)
            // time: PT08H00M00S

            // old interface: (sTimeRange, oContext)
            var oTimeRange, oStartDate, oEndDate, oStartTime, oEndTime, dateShortFormatter;
            dateShortFormatter = sap.ca.ui.model.format.DateFormat.getInstance({
                style: "short"
            });

            // bug in UI5: function is called several times - only the last time
            // all parameters are available!
            if (!StartDate || !PTStartTime || !EndDate || !PTEndTime) {
                return "";
            }

            oStartDate = dateShortFormatter.format(StartDate, true);
            oEndDate = dateShortFormatter.format(EndDate, true);
            oStartTime = hcm.mgr.approve.leaverequests.util.Conversions.formatterTime(PTStartTime);
            oEndTime = hcm.mgr.approve.leaverequests.util.Conversions.formatterTime(PTEndTime);

            if (oStartDate === oEndDate) {
                if (!AllDayFlag) {
                    if (oStartTime === oEndTime) {
                        oTimeRange = "";
                    } else {
                        oTimeRange = "   " + oStartTime + " - " + oEndTime;
                    }
                } else {
                    oTimeRange = "";
                }
                oTimeRange = oStartDate + oTimeRange;
            } else {
                oTimeRange = oStartDate + " - " + oEndDate;
            }
            return oTimeRange;
        },

        formatterDate1: function(oDate) {
            var oFormatter = sap.ca.ui.model.format.DateFormat.getDateInstance({
                pattern: "MMddYYYY"
            }),
                oCreationDate = new Date(oDate);

            if (oCreationDate) {
                return oFormatter.format(oCreationDate);
            }
            return "";
        },

        formatterDate2: function(oDate) {
            var oFormatter = sap.ca.ui.model.format.DateFormat.getDateInstance({
                pattern: "YYYY-MM-ddThh:mm"
            }),
                oCreationDate = new Date(oDate);

            if (oCreationDate) {
                return oFormatter.format(oCreationDate);
            }
            return "";
        },

        formatterTime: function(oTime) {
            // We put the times from the backend into today's date and then the
            // time is formatted.
            // Absence Start and End Time are shown as entered in backend,
            // without timezone
            var oDate = new Date(),
                HoursMs = oTime.ms / (3600 * 1000),
                Hours = Math.floor(HoursMs),
                MinutesMs = oTime.ms - (Hours * 3600 * 1000),
                Minutes = Math.floor(MinutesMs / (60 * 1000)),
                Seconds = 0,
                Millis = 0,
                sTime = sap.ca.ui.model.format.DateFormat.getTimeInstance({
                    style: "short"
                }).format(oDate, true),
                aTimeSegments = sTime.split(":"),
                sAmPm = "",
                lastSeg = aTimeSegments[aTimeSegments.length - 1],
                aAmPm = "";

            oDate.setHours(Hours, Minutes, Seconds, Millis);

            if (oDate) {
                // chop off seconds
                // check for am/pm 
                if (isNaN(lastSeg)) {
                    aAmPm = lastSeg.split(" ");
                    // result array can only have 2 entries
                    aTimeSegments[aTimeSegments.length - 1] = aAmPm[0];
                    sAmPm = " " + aAmPm[1];
                }
                return (aTimeSegments[0] + ":" + aTimeSegments[1] + sAmPm);
            }
        },

        formatterPT_Time: function(ptstring) {
            if (ptstring.substring(0, 2) !== "PT" || ptstring.substring(4, 5) !== "H" || ptstring.substring(7, 8) !== "M" || ptstring.substring(10, 11) !== "S") {
                return "";
            }

            var hoursMS = ptstring.substring(2, 4) * 60 * 60 * 1000,
                minutesMS = ptstring.substring(5, 7) * 60 * 1000,
                secondsMS = ptstring.substring(8, 10) * 1000,
                resultMS = hoursMS + minutesMS + secondsMS,
                oDate = new Date(),
                TimezoneOffset = oDate.getTimezoneOffset() * 60 * 1000,
                sTime = sap.ca.ui.model.format.DateFormat.getTimeInstance({
                    style: "short"
                }).format(oDate, true),
                aTimeSegments = sTime.split(":"),
                sAmPm = "",
                lastSeg = aTimeSegments[aTimeSegments.length - 1],
                aAmPm = "";
            oDate.setTime(resultMS + TimezoneOffset);
            if (oDate) {
                // chop off seconds
                // check for am/pm 
                if (isNaN(lastSeg)) {
                    aAmPm = lastSeg.split(" ");
                    // result array can only have 2 entries
                    aTimeSegments[aTimeSegments.length - 1] = aAmPm[0];
                    sAmPm = " " + aAmPm[1];
                }
                return (aTimeSegments[0] + ":" + aTimeSegments[1] + sAmPm);
            }
        },

        convertDateStringToDate: function(sDateString) {
            // convert the UTC Datestring to the local timezone
            var iStartIndex = sDateString.indexOf("("),
                iEndIndex = sDateString.indexOf(")"),
                sDate = sDateString.substring(iStartIndex + 1, iEndIndex),
                oDate = new Date();
            oDate.setTime(sDate);
            return oDate;
        },

        convertTimestampToDate: function(sTimestamp) {
            // convert the UTC Date to the local timezone
            var oDateCreatedOn = new Date(),
                oDate = null,
                oType = new sap.ui.model.type.Date({
                    source: {
                        pattern: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
                    },
                    pattern: "yyyy,MM,dd",
                    style: "medium"
                });
            oDateCreatedOn = oType.formatValue(sTimestamp, "string");

            oDate = new Date(oDateCreatedOn);
            return oDate;
        },

        convertUTCToLocalDate: function(oDate) {
            var oUtcDate = new Date();
            oUtcDate.setUTCDate(oDate.getDate());
            oUtcDate.setUTCFullYear(oDate.getFullYear());
            oUtcDate.setUTCHours(oDate.getHours());
            oUtcDate.setUTCMonth(oDate.getMonth());
            oUtcDate.setUTCMinutes(oDate.getMinutes());
            oUtcDate.setUTCSeconds(oDate.getSeconds());
            oUtcDate.setUTCMilliseconds(oDate.getMilliseconds());
            return oUtcDate;
        },

        convertLocalDateToUTC: function(oValue) {

            var oDate = null,
                oDateFormat = sap.ca.ui.model.format.DateFormat.getDateTimeInstance({
                    pattern: "yyyy-MM-dd'T'HH:mm:ss"
                });

            if (oValue instanceof Date) {
                oDate = hcm.mgr.approve.leaverequests.util.Conversions.revertTimezoneOffset(oValue);

            } else if (typeof oValue === "string") {
                //expects mockdata(json) with format "2013-07-15T00:00:00"
                oDate = oDateFormat.parse(oValue);
            }

            return oDate;

        },


        revertTimezoneOffset: function(oValue) {

            var oDate, UTCDate, oMS, oTimezoneOffset, returnValue;

            if (oValue instanceof Date) {
                oDate = oValue;
                // correction for timezone to be done for date format
                // assumption: system/UI5 already did already some conversion which is 
                // reverted here!
                oMS = oDate.getTime();
                oTimezoneOffset = oDate.getTimezoneOffset() * 60 * 1000;
                oMS = oMS + oTimezoneOffset;
                UTCDate = new Date(oMS);
                returnValue = UTCDate;
            } else {
                // no conversion for other types
                returnValue = oValue;
            }
            return returnValue;
        },

        formatterNotesVisible: function(sCount) {
            var bVisible = false;
            if (sCount) {
                bVisible = true;
            }
            return bVisible;
        },
        formatErrorDialog: function(oError){
			var message = "";
			var messageDetails = "";
			if (oError.response) {
				// initially take status text as a general message
				message = oError.response.statusText;
				var body = oError.response.body;
				var indexValue = body.indexOf("value");
				var indexValueEnd = body.substring(indexValue)
						.indexOf("}");
				if (indexValueEnd > -1) {
					message = body.substring(indexValue + 8,
							indexValue + indexValueEnd - 1);
				}
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
        }
    };

}());
},
	"hcm/mgr/approve/leaverequests/util/NumberFormatter.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mgr.approve.leaverequests.util.NumberFormatter");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");

hcm.mgr.approve.leaverequests.util.NumberFormatter = (function() {
    "use strict";
    return {

        // strips unwanted leading or ending zeros
        formatNumberStripZeros: function(number) {

            var numberFormatter = sap.ca.ui.model.format.NumberFormat.getInstance();
            if (typeof number === "string") {
                return numberFormatter.format(Number(number));
            }
            return numberFormatter.format(number);
        }
    };
}());
},
	"hcm/mgr/approve/leaverequests/view/S2.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("hcm.mgr.approve.leaverequests.util.Conversions");
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
jQuery.sap.require("sap.ca.ui.message.message");

sap.ca.scfld.md.controller.ScfldMasterController.extend("hcm.mgr.approve.leaverequests.view.S2", {

	extHookChangeFooterButtons: null,
	
    onInit: function() {
        "use strict";
        this.resourceBundle = this.oApplicationFacade.getResourceBundle();
        this.oDataModel = this.oApplicationFacade.getODataModel();
        this._getData();
        this.registerMasterListBind(this.getList());

        var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
        var oComponent = sap.ui.component(sComponentId);
        oComponent.oEventBus.subscribe("hcm.mgr.approve.leaverequests", "leaveRequestApproveReject", this._handleApproveRejectCallBack, this);

        this.oRouter.attachRoutePatternMatched(function(oEvent) {
            if (oEvent.getParameter("name") === "detail") {
                var sBindingContextPath = this.getBindingContextPathFor(oEvent.getParameter("arguments"));
                var oItem = this.findItemByContextPath(sBindingContextPath);
                var oList = this.getList();
                var iIndex = oList.indexOfItem(oItem);
                var oNextItem = oList.getItems()[iIndex + 1];
                this._sNextDetailPath = oNextItem && oNextItem.getBindingContext(this.sModelName).getPath();
            }
        }, this);
    },

    /**
     * @public [onDataLoaded On master list loaded]
     */
    onDataLoaded: function() {
        if (this.getList().getItems().length < 1) {
            if (!sap.ui.Device.system.phone) {
                this.showEmptyView("DETAIL_TITLE", "NO_ITEMS_AVAILABLE");
            }
        }
    },

    /**
     * @private [_handleApproveRejectCallBack Callback handler on after approval/reject, to select next row in desktop/phone]
     */
    _handleApproveRejectCallBack: function(channelId, eventId, data) {
        "use strict";
        var oItem = this.findItemByContextPath(this._sNextDetailPath);
        if (oItem) {
            this.setListItem(oItem);
        } else {
            if (this.getList().getItems().length > 1) {
                this.selectFirstItem();
            } else {
                this.showEmptyView("DETAIL_TITLE", "NO_ITEMS_AVAILABLE");
            }
        }
    },

    /**
     * @private [_getData Get master data]
     */
    _getData: function() {
        "use strict";
        var oList = this.getList(),
            oSorter = new sap.ui.model.Sorter("ChangeDate", true),
            aFilters = [new sap.ui.model.Filter("FilterGetAllRequests", sap.ui.model.FilterOperator.EQ, 1), new sap.ui.model.Filter("TaskDefinitionID", sap.ui.model.FilterOperator.EQ, "")],
            oTemplate = oList.getItems()[0].clone();

        oList.bindItems("/LeaveRequestCollection", oTemplate, oSorter, aFilters);
    },

    /**
     * @public [getHeaderFooterOptions Define header & footer options]
     */
    getHeaderFooterOptions: function() {
        "use strict";
        var objHdrFtr = {
            sI18NMasterTitle: "view.Master.title"
        };
        
		/**
         * @ControllerHook Modify the footer buttons
         * This hook method can be used to add and change buttons for the detail view footer
         * It is called when the decision options for the detail item are fetched successfully
         * @callback hcm.mgr.approve.leaverequests.view.S2~extHookChangeFooterButtons
         * @param {object} Header Footer Object
         * @return {object} Header Footer Object
         */
    	
    	if (this.extHookChangeFooterButtons) {
    		objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
    	};
    	return objHdrFtr;
	
    },

    /**
     * @private [_handleListSwipe handler for list row swipe for approval]
     * @return {[type]}
     */
    _handleListSwipe: function() {
        "use strict";
        var oList = this.getList(),
            oSwipeListItem = oList.getSwipedItem(),
            oContext = oSwipeListItem.getBindingContext(),
            sOrigin = oContext.getProperty("SAP__Origin"),
            sRequestID = oContext.getProperty("RequestId"),
            iVersion = oContext.getProperty("Version"),
            sDecision = "PREPARE_APPROVE",
            sTextKey = "dialog.success.approve",
            oEntry = {};

        oList.swipeOut();
        oEntry.RequestId = sRequestID;
        oEntry.Version = iVersion;
        oEntry.Decision = sDecision;
        oEntry.SAP__Origin = sOrigin;
        oEntry.Comment = "";

        this.oDataModel.create("ApplyLeaveRequestDecision?SAP__Origin='" + sOrigin + "'&RequestId='" + sRequestID + "'&Version=" + iVersion + "&Comment=''" + "&Decision='" + sDecision + "'", oEntry, null, function() {
            sap.ca.ui.message.showMessageToast(this.resourceBundle.getText(sTextKey));
        }, jQuery.proxy(this._onRequestFailed, this));
    },

    /**
     * @private [_onRequestFailed handler for service request failure]
     * @param  {[type]} oError
     * @return {[type]}
     */
    _onRequestFailed: function(oError) {
        "use strict";
        sap.ca.ui.message.showMessageBox({
            type: sap.ca.ui.message.Type.ERROR,
            message: oError.message,
            details: oError.response.body
        });
    }
});
},
	"hcm/mgr/approve/leaverequests/view/S2.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\tcontrollerName="hcm.mgr.approve.leaverequests.view.S2">\n\t<Page\n\t\tid="page"\n\t\ttitle="{i18n>view.Master.title}">\n\t\t<content>\n\t\t\t<List\n\t\t\t\tid="list"\n\t\t\t\tmode="{device>/listMode}"\n\t\t\t\tselect="_handleSelect">\n\t\t\t\t<ObjectListItem\n\t\t\t\t\tid="MAIN_LIST_ITEM"\n\t\t\t\t\ttype="{device>/listItemType}"\n\t\t\t\t\tpress="_handleItemPress"\n\t\t\t\t\ttitle="{RequesterName}"\n\t\t\t\t\tnumber="{parts:[{path:\'AbsenceDays\'},{path:\'AbsenceHours\'},{path:\'AllDayFlag\'}], formatter:\'hcm.mgr.approve.leaverequests.util.Conversions.formatterAbsenceDuration\'}"\n\t\t\t\t\tnumberUnit="{parts:[{path:\'AbsenceDays\'},{path:\'AbsenceHours\'},{path:\'AllDayFlag\'}], formatter:\'hcm.mgr.approve.leaverequests.util.Conversions.formatterAbsenceDurationUnit\'}">\n\t\t\t\t\t<firstStatus>\n\t\t\t\t\t\t<ObjectStatus\n\t\t\t\t\t\t\ttext="{parts:[{path:\'ChangeDate\'}], formatter:\'hcm.mgr.approve.leaverequests.util.Conversions.formatterTimestampToDate\'}"></ObjectStatus>\n\t\t\t\t\t</firstStatus>\n\t\t\t\t\t<secondStatus>\n\t\t\t\t\t\t<ObjectStatus\n\t\t\t\t\t\t\tstate="Warning"\n\t\t\t\t\t\t\ttext="{parts:[{path:\'LeaveRequestType\'}], formatter:\'hcm.mgr.approve.leaverequests.util.Conversions.formatterListCancelStatus\'}"></ObjectStatus>\n\t\t\t\t\t</secondStatus>\n\t\t\t\t\t<attributes>\n\t\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\t\tid="ATTR1"\n\t\t\t\t\t\t\ttext="{LeaveTypeDesc}" />\n\t\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\t\tid="TimeframeList"\n\t\t\t\t\t\t\ttext="{parts:[{path:\'StartDate\'},{path:\'StartTime\'},{path:\'EndDate\'},{path:\'EndTime\'},{path:\'AllDayFlag\'}], formatter:\'hcm.mgr.approve.leaverequests.util.Conversions.formatterAbsenceDays3Short\'}" />\n\t\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\t\tid="ATTR2"\n\t\t\t\t\t\t\ttext="{parts:[{path:\'Overlaps\'}], formatter:\'hcm.mgr.approve.leaverequests.util.Conversions.formatterOverlaps\'}" />\n\t\t\t\t\t\t<!-- extension added to add fields in list item -->\t\n                \t\t<core:ExtensionPoint name="extS2ListItem"></core:ExtensionPoint>\n\t\t\t\t\t</attributes>\n\t\t\t\t</ObjectListItem>\n\t\t\t\t<swipeContent>\n\t\t\t\t\t<Button\n\t\t\t\t\t\ttext="{i18n>XBUT_APPROVE}"\n\t\t\t\t\t\ttype="Accept"\n\t\t\t\t\t\ttap="_handleListSwipe" />\n\t\t\t\t</swipeContent>\n\t\t\t</List>\n\t\t</content>\n\t\t<footer>\n\t\t\t<Bar id="footer"></Bar>\n\t\t</footer>\n\t</Page>\n</core:View>',
	"hcm/mgr/approve/leaverequests/view/S3.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.require("hcm.mgr.approve.leaverequests.util.Conversions");
jQuery.sap.require("sap.ca.ui.message.message");

sap.ca.scfld.md.controller.BaseDetailController.extend("hcm.mgr.approve.leaverequests.view.S3", {

	extHookChangeFooterButtons: null,
	
    onInit: function() {
        "use strict";
        this.resourceBundle = this.oApplicationFacade.getResourceBundle();
        this.oDataModel = this.oApplicationFacade.getODataModel();
        this.oView = this.getView();
        this.mailSubject = "";

        this.oRouter.attachRouteMatched(function(oEvent) {
            if (oEvent.getParameter("name") === "detail") {
                var sDetailTabContextPath = oEvent.getParameter("arguments").contextPath;
                sDetailTabContextPath = sDetailTabContextPath.replace("LeaveRequestCollection", "/LeaveRequestDetailsCollection");
                sDetailTabContextPath = sDetailTabContextPath.replace("')", "',CalculateOverlaps=1)");
                this.oView.bindElement(sDetailTabContextPath);
                if (this.oView.byId("LRAtc").getSelectedKey() !== "contentInfo") {
                    this.oView.byId("LRAtc").setSelectedKey("contentInfo");
                }
            }
        }, this);
    },

    /**
     * @public [getHeaderFooterOptions Define header & footer options]
     */
    getHeaderFooterOptions: function() {
        "use strict";
        var that = this;
        var objHdrFtr = {
            sI18NDetailTitle: "view.Detail.title",
            oPositiveAction: {
                sI18nBtnTxt: that.resourceBundle.getText("XBUT_APPROVE"),
                onBtnPressed: jQuery.proxy(that._handleApprove, that)
            },
            oNegativeAction: {
                sI18nBtnTxt: that.resourceBundle.getText("XBUT_REJECT"),
                onBtnPressed: jQuery.proxy(that._handleReject, that)
            },
            oAddBookmarkSettings: {
                title: that.resourceBundle.getText("view.Detail.title"),
                icon: "sap-icon://card"
            },
            onBack: jQuery.proxy(function() {
                //Check if a navigation to master is the previous entry in the history
                var sDir = sap.ui.core.routing.History.getInstance().getDirection(this.oRouter.getURL("master"));
                if (sDir === "Backwards") {
                    window.history.go(-1);
                } else {
                    //we came from somewhere else - create the master view
                    this.oRouter.navTo("master");
                }
            }, this)
        };
        /**
         * @ControllerHook Modify the footer buttons
         * This hook method can be used to add and change buttons for the detail view footer
         * It is called when the decision options for the detail item are fetched successfully
         * @callback hcm.mgr.approve.leaverequests.view.S3~extHookChangeFooterButtons
         * @param {object} Header Footer Object
         * @return {object} Header Footer Object
         */    	
        if (this.extHookChangeFooterButtons) {
        	objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
        };
    	return objHdrFtr;
    },

    /**
     * @private [_handleTabSelect handler for IconTabBar select]
     * // FIXME: The below is a workaround because the odata service doesnt handler /Notes but only $expand=Notes.
     * Whenever scaffolding triggers a model refresh, automatically /Notes on main model is triggered which fails.
     * Hence, a new JSON model for notes is created and assigned on notes tab click
     */
    _handleTabSelect: function(evt) {
        "use strict";
        var key, context, sDetailTabContextPath, fnSuccess;

        key = evt.getParameter("key");
        context = this.getView().getBindingContext();

        if (key === "contentNotes") {
            sDetailTabContextPath = "/LeaveRequestDetailsCollection(SAP__Origin='" + context.getProperty("SAP__Origin") + "',RequestId='" + context.getProperty("RequestId") + "',CalculateOverlaps=1)";
            fnSuccess = function(oData) {
                this.oModel2 = new sap.ui.model.json.JSONModel(oData);
                this.getView().setModel(this.oModel2, "notes");
            };
            this.oDataModel.read(sDetailTabContextPath, undefined, ["$expand=Notes"], false, jQuery.proxy(fnSuccess, this), jQuery.proxy(this.onRequestFailed, this));
        }
    },

    /**
     * @private [_handleApprove handler for approve action]
     */
    _handleApprove: function() {
        "use strict";
        var oDataObj = this.oView.getModel().getProperty(this.oView.getBindingContext().getPath()),
            bApprove = true,
            fnClose = function(oResult) {
                this._handleApproveRejectExecute(oResult, bApprove, oDataObj);
            },
            sUserName = this.oView.getBindingContext().getProperty("RequesterName"),
            sLeaveType = this.oView.getBindingContext().getProperty("LeaveTypeDesc"),
            sAbsenceDays = this.oView.getBindingContext().getProperty("AbsenceDays"),
            sAbsenceHours = this.oView.getBindingContext().getProperty("AbsenceHours"),
            sAllDayFlag = this.oView.getBindingContext().getProperty("AllDayFlag"),
            sLeaveRequestType = this.oView.getBindingContext().getProperty("LeaveRequestType"),
            sRequested = hcm.mgr.approve.leaverequests.util.Conversions.formatterAbsenceDurationAndUnit(sAbsenceDays, sAbsenceHours, sAllDayFlag),
            sApproveText = "";

        if (sLeaveRequestType === "3") {
            sApproveText = this.resourceBundle.getText("dialog.question.approvecancel", [sUserName]);
        } else {
            sApproveText = this.resourceBundle.getText("dialog.question.approve", [sUserName]);
        }

        sap.ca.ui.dialog.confirmation.open({
            question: sApproveText,
            showNote: true,
            additionalInformation: [{
                label: this.resourceBundle.getText("view.AddInfo.LeaveType"),
                text: sLeaveType
            }, {
                label: this.resourceBundle.getText("view.AddInfo.Requested"),
                text: sRequested
            }],
            title: this.resourceBundle.getText("XTIT_APPROVAL"),
            confirmButtonLabel: this.resourceBundle.getText("XBUT_APPROVE")
        }, jQuery.proxy(fnClose, this));
    },

    /**
     * @private [_handleReject handler for reject action]
     */
    _handleReject: function() {
        "use strict";
        var oDataObj = this.oView.getModel().getProperty(this.oView.getBindingContext().getPath()),
            bApprove = false,
            fnClose = function(oResult) {
                this._handleApproveRejectExecute(oResult, bApprove, oDataObj);
            },
            sUserName = this.oView.getBindingContext().getProperty("RequesterName"),
            sLeaveType = this.oView.getBindingContext().getProperty("LeaveTypeDesc"),
            sAbsenceDays = this.oView.getBindingContext().getProperty("AbsenceDays"),
            sAbsenceHours = this.oView.getBindingContext().getProperty("AbsenceHours"),
            sAllDayFlag = this.oView.getBindingContext().getProperty("AllDayFlag"),
            sLeaveRequestType = this.oView.getBindingContext().getProperty("LeaveRequestType"),
            sRequested = hcm.mgr.approve.leaverequests.util.Conversions.formatterAbsenceDurationAndUnit(sAbsenceDays, sAbsenceHours, sAllDayFlag),
            sRejectText = "";

        if (sLeaveRequestType === "3") {
            sRejectText = this.resourceBundle.getText("dialog.question.rejectcancel", [sUserName]);
        } else {
            sRejectText = this.resourceBundle.getText("dialog.question.reject", [sUserName]);
        }

        // open the confirmation dialog
        sap.ca.ui.dialog.confirmation.open({
            question: sRejectText,
            showNote: true,
            additionalInformation: [{
                label: this.resourceBundle.getText("view.AddInfo.LeaveType"),
                text: sLeaveType
            }, {
                label: this.resourceBundle.getText("view.AddInfo.Requested"),
                text: sRequested
            }],
            title: this.resourceBundle.getText("XTIT_REJECT"),
            confirmButtonLabel: this.resourceBundle.getText("XBUT_REJECT")
        }, jQuery.proxy(fnClose, this));
    },

    /**
     * @private [_handleApproveRejectExecute handler for executing the approval/reject to backend]
     */
    _handleApproveRejectExecute: function(oResult, bApprove, oDataObj) {
        "use strict";
        if (oResult.isConfirmed) {

            var oEntry = {}, sDecision, sURL;

            if (oResult.sNote) {
                oEntry.Comment = oResult.sNote;
            } else {
                oEntry.Comment = "";
            }

            oEntry.RequestId = oDataObj.RequestId;
            oEntry.Version = oDataObj.Version;

            if (bApprove) {
                sDecision = "PREPARE_APPROVE";
                this.sTextKey = "dialog.success.approve";
            } else {
                sDecision = "PREPARE_REJECT";
                this.sTextKey = "dialog.success.reject";
            }

            oEntry.Decision = sDecision;
            oEntry.SAP__Origin = oDataObj.SAP__Origin;

            sURL = "ApplyLeaveRequestDecision?SAP__Origin='" + oDataObj.SAP__Origin + "'&RequestId='" + oDataObj.RequestId + "'&Version=" + oDataObj.Version + "&Comment='" + oResult.sNote + "'&Decision='" + sDecision + "'";

            this.oDataModel.setRefreshAfterChange(false);
            this.oDataModel.create(sURL, oEntry, null, jQuery.proxy(this._handleApproveRejectSuccess, this), jQuery.proxy(this._handleApproveRejectFailure, this));
        }
    },

    _handleApproveRejectSuccess: function() {
        "use strict";
        var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.oView),
            oComponent = sap.ui.component(sComponentId);

        oComponent.oEventBus.publish("hcm.mgr.approve.leaverequests", "leaveRequestApproveReject");

        this.oDataModel.setRefreshAfterChange(true);
        this.oDataModel.refresh(true);

        sap.ca.ui.message.showMessageToast(this.resourceBundle.getText(this.sTextKey));
    },

    _handleApproveRejectFailure: function(oError) {
        "use strict";
        this.oDataModel.setRefreshAfterChange(true);
        if (this.oDataModel.hasPendingChanges()) {
            this.oDataModel.refresh(true);
        }

        hcm.mgr.approve.leaverequests.util.Conversions.formatErrorDialog(oError);
    },

    /**
     * @private [_handleOverlapTap handler for overlap link click]
     */
    _handleOverlapTap: function() {
        "use strict";
        this.oRouter.navTo("calendar", {
            from: "detail",
            SAP__Origin: this.oView.getBindingContext().getProperty("SAP__Origin"),
            RequestId: this.oView.getBindingContext().getProperty("RequestId"),
            StartDate: Date.parse(this.oView.getBindingContext().getProperty("StartDate"))
        });
    },

    /**
     * @private [_handleNamePress handler for manager name press]
     */
    _handleNamePress: function(oEvent) {
        "use strict";
        jQuery.proxy(this._handleEmployeeNameClick(oEvent), this);
    },

    /**
     * @private [_handleSenderPress handler for employee name press]
     */
    _handleSenderPress: function(oEvent) {
        "use strict";
        jQuery.proxy(this._handleEmployeeNameClick(oEvent), this);
    },

    /**
     * @private [_handleNamePress handler for opening employee business card]
     */
    _handleEmployeeNameClick: function(oEvent) {
        "use strict";
        this.oControl = oEvent.getParameters().domRef;
        var oContext = this.oView.getBindingContext(),
            userID = oContext.getProperty("RequesterNumber"),
            leaveTypeDesc = oContext.getProperty("LeaveTypeDesc"),
            startDate = oContext.getProperty("StartDate"),
            startTime = oContext.getProperty("StartTime"),
            endDate = oContext.getProperty("EndDate"),
            endTime = oContext.getProperty("EndTime"),
            allDayFlag = oContext.getProperty("AllDayFlag"),
            tFrame = hcm.mgr.approve.leaverequests.util.Conversions.formatterAbsenceDays3(startDate, startTime, endDate, endTime, allDayFlag),
            Subject = this.resourceBundle.getText("view.BusinessCard.Employee.Subject", [leaveTypeDesc]);
        try {
			//if call is from notes, fetch the Pernr of the commenter and not the Requester of the leave request
			if (oEvent.getSource().mProperties.hasOwnProperty("sender")) {
				var index = oEvent.getSource().oParent.indexOfItem(this
						.byId(oEvent.getSource().sId));
				userID = oEvent.getSource().oPropagatedProperties.oModels.notes.oData.Notes.results[index].PersonNr;
			}
		} catch (e) {
			jQuery.sap.log.warning("Couldn't find the Details of employee","_handleEmployeeNameClick","hcm.mgr.approve.leaverequests.view.S3");
		}
        this.mailSubject = Subject + " " + tFrame;
        this.oDataModel.read("EmployeeCollection", null, ["$filter=EmployeeNumber eq '" + userID + "'"], true,
            jQuery.proxy(this._onRequestSuccess, this),
            jQuery.proxy(this._onRequestFailed, this));
    },

    /**
     * @private [_onRequestFailed handler for service request failure]
     */
    _onRequestSuccess: function(oData) {
        "use strict";
        jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
        var data = oData.results[0],
            oEmpConfig = {
                title: "Employee",
                name: data.Name,
                department: data.Department,
                contactmobile: data.Mobile,
                contactphone: data.Phone,
                contactemail: data.Email,
                contactemailsubj: this.mailSubject,
                companyname: data.Company,
                companyaddress: data.Address
            },
            oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(oEmpConfig);

        oEmployeeLaunch.openBy(this.oControl);
    },

    /**
     * @private [_onRequestFailed handler for service request failure]
     */
    _onRequestFailed: function(oError) {
        "use strict";
        sap.ca.ui.message.showMessageBox({
            type: sap.ca.ui.message.Type.ERROR,
            message: oError.message,
            details: oError.response.body
        });
    },

    isMainScreen: function() {
        return true;
    }
});
},
	"hcm/mgr/approve/leaverequests/view/S3.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:form="sap.ui.layout.form"\n\txmlns:layout="sap.ui.layout"\n\tcontrollerName="hcm.mgr.approve.leaverequests.view.S3">\n\t<Page id="detailPage">\n\t\t<ObjectHeader\n\t\t\tid="DetailHeader"\n\t\t\tnumber="{parts:[{path:\'AbsenceDays\'},{path:\'AbsenceHours\'},{path:\'AllDayFlag\'}], formatter:\'hcm.mgr.approve.leaverequests.util.Conversions.formatterAbsenceDuration\'}"\n\t\t\tnumberUnit="{parts:[{path:\'AbsenceDays\'},{path:\'AbsenceHours\'},{path:\'AllDayFlag\'}], formatter:\'hcm.mgr.approve.leaverequests.util.Conversions.formatterAbsenceDurationUnit\'}"\n\t\t\ttitle="{RequesterName}"\n\t\t\ttitleActive="true"\n\t\t\ttitlePress="_handleNamePress">\n\t\t\t<statuses>\n\t\t\t\t<ObjectStatus\n\t\t\t\t\ttext="{parts:[{path:\'ChangeDate\'}], formatter:\'hcm.mgr.approve.leaverequests.util.Conversions.formatterTimestampToDate\'}"></ObjectStatus>\n\t\t\t\t<ObjectStatus\n\t\t\t\t\tstate="Warning"\n\t\t\t\t\ttext="{parts:[{path:\'LeaveRequestType\'},{path:\'RequesterName\'}], formatter:\'hcm.mgr.approve.leaverequests.util.Conversions.formatterHeaderCancelStatus\'}"></ObjectStatus>\n\t\t\t</statuses>\n\t\t\t<attributes>\n\t\t\t\t<ObjectAttribute\n\t\t\t\t\tid="RequesterNumber"\n\t\t\t\t\ttext="{parts:[{path:\'RequesterNumber\'}], formatter:\'hcm.mgr.approve.leaverequests.util.Conversions.formatterEmployeeID\'}"></ObjectAttribute>\n\t\t\t\t<ObjectAttribute\n\t\t\t\t\tid="LeaveTypeDesc"\n\t\t\t\t\ttext="{LeaveTypeDesc}"></ObjectAttribute>\n\t\t\t\t<ObjectAttribute\n\t\t\t\t\tid="Timeframe"\n\t\t\t\t\ttext="{parts:[{path:\'StartDate\'},{path:\'StartTime\'},{path:\'EndDate\'},{path:\'EndTime\'},{path:\'AllDayFlag\'}], formatter:\'hcm.mgr.approve.leaverequests.util.Conversions.formatterAbsenceDays3\'}"></ObjectAttribute>\n\t\t\t</attributes>\n\t\t\t<!-- extension point for additional fields in header -->\t\n        \t<core:ExtensionPoint name="extS3Header"></core:ExtensionPoint>\n\t\t</ObjectHeader>\n\t\t<IconTabBar\n\t\t\tid="LRAtc"\n\t\t\tselect="_handleTabSelect">\n\t\t\t<items>\n\t\t\t\t<IconTabFilter\n\t\t\t\t\ticon="sap-icon://hint"\n\t\t\t\t\ticonColor="Default"\n\t\t\t\t\tkey="contentInfo">\n\t\t\t\t\t<content>\n\t\t\t\t\t\t<form:Form id="myForm">\n\t\t\t\t\t\t\t<form:layout>\n\t\t\t\t\t\t\t\t<form:ResponsiveLayout id="informationLayout" />\n\t\t\t\t\t\t\t</form:layout>\n\t\t\t\t\t\t\t<form:formContainers>\n\t\t\t\t\t\t\t\t<form:FormContainer id="formContainer">\n\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t<form:formElements>\n\t\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t\t\tvisible="{parts:[{path:\'CurrentBalTimeUnitCode\'}], formatter:\'hcm.mgr.approve.leaverequests.util.Conversions.formatterCurrentBalanceVisible\'}">\n\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="CurrentBalanceLabel"\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.AddInfo.CurrentBalance}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="3"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmin-width="192">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="CurrentBalance"\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{parts:[{path:\'CurrentBalance\'},{path:\'CurrentBalTimeUnitCode\'}], formatter:\'hcm.mgr.approve.leaverequests.util.Conversions.formatterCurrentBalance\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="5">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\t\t\t<form:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="RequestedLabel"\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.AddInfo.Requested}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="3"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmin-width="192">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="Requested"\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{parts:[{path:\'AbsenceDays\'},{path:\'AbsenceHours\'},{path:\'AllDayFlag\'}], formatter:\'hcm.mgr.approve.leaverequests.util.Conversions.formatterAbsenceDurationAndUnit\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="5">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\t\t\t<form:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="LeaveType"\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.AddInfo.LeaveType}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="3"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmin-width="192">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="formLeaveTypeDesc"\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{LeaveTypeDesc}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="5">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t\t\tid="Overlaps"\n\t\t\t\t\t\t\t\t\t\t\tvisible="{parts:[{path:\'Overlaps\'}], formatter:\'hcm.mgr.approve.leaverequests.util.Conversions.formatterOverlapsVisible\'}">\n\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="OverlapListLabel"\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{parts:[{path:\'Overlaps\'}], formatter:\'hcm.mgr.approve.leaverequests.util.Conversions.formatterOverlaps\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="3"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmin-width="192">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="OverlapList"\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{OverlapList}"\n\t\t\t\t\t\t\t\t\t\t\t\t\tpress="_handleOverlapTap">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="5"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talign-items="End">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t\t\tvisible="{parts:[{path:\'Overlaps\'}], formatter:\'hcm.mgr.approve.leaverequests.util.Conversions.formatterOverlapsVisible\'}">\n\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label id="OverlapLinkLabel">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="3"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmin-width="192">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Link\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="OverlapLink"\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{parts:[{path:\'Overlaps\'}], formatter:\'hcm.mgr.approve.leaverequests.util.Conversions.formatterOverlapLink\'}"\n\t\t\t\t\t\t\t\t\t\t\t\t\tpress="_handleOverlapTap">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="5"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talign-items="End">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Link>\n\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\t\t</form:formElements>\n\t\t\t\t\t\t\t\t</form:FormContainer>\n\t\t\t\t\t\t\t</form:formContainers>\n\t\t\t\t\t\t</form:Form>\n\t\t\t\t\t</content>\n\t\t\t\t</IconTabFilter>\n\t\t\t\t<IconTabFilter\n\t\t\t\t\ticon="sap-icon://notes"\n\t\t\t\t\ticonColor="Default"\n\t\t\t\t\tcount="{NotesCounter}"\n\t\t\t\t\tkey="contentNotes"\n\t\t\t\t\tvisible="{parts:[{path:\'NotesCounter\'}], formatter:\'hcm.mgr.approve.leaverequests.util.Conversions.formatterNotesVisible\'}">\n\t\t\t\t\t<VBox\n\t\t\t\t\t\tid="NotesArea"\n\t\t\t\t\t\talignItems="Start">\n\t\t\t\t\t\t<List\n\t\t\t\t\t\t\tid="NotesList"\n\t\t\t\t\t\t\titems="{notes>/Notes/results}"\n\t\t\t\t\t\t\tinset="false"\n\t\t\t\t\t\t\tmode="SingleSelectMaster"\n\t\t\t\t\t\t\tshowSeparators="None"\n\t\t\t\t\t\t\theaderDesign="Plain">\n\t\t\t\t\t\t\t<FeedListItem\n\t\t\t\t\t\t\t\tid="feed"\n\t\t\t\t\t\t\t\tsender="{notes>Name}"\n\t\t\t\t\t\t\t\tsenderPress="_handleSenderPress"\n\t\t\t\t\t\t\t\ttext="{notes>NoticeText}"\n\t\t\t\t\t\t\t\ttimestamp="{parts:[{path:\'notes>ModTimestamp\'}], formatter:\'hcm.mgr.approve.leaverequests.util.hcm.mgr.approve.leaverequests.util.Conversions.formatterTimestampToDate\'}">\n\t\t\t\t\t\t\t</FeedListItem>\n\t\t\t\t\t\t</List>\n\t\t\t\t\t</VBox>\n\t\t\t\t</IconTabFilter>\n\t\t\t\t<!-- extension point for additional IconTabFilter -->\n\t\t\t\t<core:ExtensionPoint name="extS3Tab"/>\n\t\t\t</items>\n\t\t</IconTabBar>\n\t\t<footer>\n\t\t\t<Bar id="detailFooter">\n\t\t\t</Bar>\n\t\t</footer>\n\t</Page>\n</core:View>',
	"hcm/mgr/approve/leaverequests/view/S4.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("hcm.mgr.approve.leaverequests.util.CalendarServices");
jQuery.sap.require("hcm.mgr.approve.leaverequests.util.Conversions");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.dialog.factory");

sap.ca.scfld.md.controller.BaseDetailController.extend("hcm.mgr.approve.leaverequests.view.S4", {

	extHookChangeFooterButtons: null,
	
    onInit: function() {

        "use strict";
        this.oView = this.getView();
        this.resourceBundle = this.oApplicationFacade.getResourceBundle();
        this.oDataModel = this.oApplicationFacade.getODataModel();
        this.detailContextPath = "";

        this.oRouter.attachRouteMatched(function(oEvent) {

            if (oEvent.getParameter("name") === "calendar") {

                var sReqStartDate, sRequestId, sOrigin, oStartDate, contextPath;

                sRequestId = oEvent.getParameter("arguments").RequestId;
                sOrigin = oEvent.getParameter("arguments").SAP__Origin;
                contextPath = "/LeaveRequestDetailsCollection(SAP__Origin='" + sOrigin + "',RequestId='" + sRequestId + "',CalculateOverlaps=1)";
                
                this.detailContextPath = "LeaveRequestCollection(SAP__Origin='" + sOrigin + "',RequestId='" + sRequestId + "')";
                this.oView.bindElement(contextPath);

                sReqStartDate = new Date();
                sReqStartDate.setTime(oEvent.getParameter("arguments").StartDate);
                oStartDate = hcm.mgr.approve.leaverequests.util.CalendarServices.setDateType(sReqStartDate);
                hcm.mgr.approve.leaverequests.util.CalendarServices.setCalStartDate(oStartDate);

                //set model to the calendar
                if (!hcm.mgr.approve.leaverequests.util.CalendarServices.getAppModel()) {
                    hcm.mgr.approve.leaverequests.util.CalendarServices.setAppModel(this.oDataModel);
                }

                //clear calendar data - since every
                // refresh/approve/reject could outdate the data
                hcm.mgr.approve.leaverequests.util.CalendarServices.clearCalData();

                jQuery.sap.delayedCall(5, undefined, jQuery.proxy(function() {
                    hcm.mgr.approve.leaverequests.util.CalendarServices.readCalData(sRequestId, sReqStartDate, null, sOrigin);
                    //call controller to set context
                    this._onShow(sRequestId);
                }, this));

            }
        }, this);

        var oCalendar2 = this.byId("OverlapCalendar2"),
            oLegend = this.byId("CalenderLegend");
        if (oCalendar2) {
            oCalendar2.setModel(hcm.mgr.approve.leaverequests.util.CalendarServices.getCalModel());
        }

        if (jQuery.device.is.phone) {
            // default: 2 weeks
            oCalendar2.setWeeksPerRow(1);
        }

        if (oLegend) {
            oLegend.setLegendForNormal(this.resourceBundle.getText("view.Calendar.LegendWorkingDay"));
            oLegend.setLegendForType00(this.resourceBundle.getText("view.Calendar.LegendDayOff"));
            oLegend.setLegendForType01(this.resourceBundle.getText("view.Calendar.LegendApproved"));
            oLegend.setLegendForType04(this.resourceBundle.getText("view.Calendar.LegendPending"));
            oLegend.setLegendForType06(this.resourceBundle.getText("view.Calendar.LegendHoliday"));
            oLegend.setLegendForType07(this.resourceBundle.getText("view.Calendar.LegendDeletionRequested"));
            oLegend.setLegendForToday(this.resourceBundle.getText("view.Calendar.LegendToday"));
        }
    },

    /**
     * @private [_onShow handler for calendar display]
     * @param  {[type]} RequestID
     * @return {[type]}
     */
    _onShow: function(RequestID) {
        "use strict";
        var oCalendar2, sPath, eventTemplate;
        oCalendar2 = this.byId("OverlapCalendar2");

        if (oCalendar2) {
            // bind aggregation
            sPath = "/" + RequestID + "/events";
            eventTemplate = new sap.me.OverlapCalendarEvent({
                row: "{Order}",
                type: "{LegendType}",
                typeName: "{AbsenceType}",
                name: "{EmployeeName}"
            });

            eventTemplate.bindProperty("halfDay", {
                parts: [{
                    path: "AllDayFlag"
                }],
                formatter: function(bAllDayFlag) {
                    var bReturn = false;
                    if (!bAllDayFlag) {
                        bReturn = true;
                    }
                    return bReturn;
                }
            });

            // start date
            eventTemplate.bindProperty("startDay", {
                parts: [{
                    path: "StartDate"
                }],
                formatter: hcm.mgr.approve.leaverequests.util.Conversions.convertLocalDateToUTC
            });

            // end date
            eventTemplate.bindProperty("endDay", {
                parts: [{
                    path: "EndDate"
                }],
                formatter: hcm.mgr.approve.leaverequests.util.Conversions.convertLocalDateToUTC
            });

            oCalendar2.bindAggregation("calendarEvents", sPath, eventTemplate);
            oCalendar2.setStartDate(hcm.mgr.approve.leaverequests.util.CalendarServices.getCalStartDate());
        }
    },

    /**
     * @private [_onEndOfData End of Data handler]
     * @param  {[type]} oEvt
     * @return {[type]}
     */
    _onEndOfData: function(oEvt) {
        "use strict";
        // commented - loading is handled in onChangeDate
    },

    /**
     * @private [_onChangeDate change of date handler]
     * @param  {[type]} oEvt
     * @return {[type]}
     */
    _onChangeDate: function(oEvt) {
        "use strict";
        var oDataStatus, bParamBefore;
        oDataStatus = hcm.mgr.approve.leaverequests.util.CalendarServices.checkLoadRequired(oEvt.getParameter("firstDate"), oEvt.getParameter("endDate"));
        if (oDataStatus.bLoadReq) {
            bParamBefore = oDataStatus.bLoadBefore;
            jQuery.sap.delayedCall(5, undefined, function() {
                if (hcm.mgr.approve.leaverequests.util.CalendarServices.getLeadRequestID()) {
                    hcm.mgr.approve.leaverequests.util.CalendarServices.readCalData(null, null, bParamBefore, null);
                }
            });
        }
    },

    /**
     * @public [getHeaderFooterOptions Define header & footer options]
     */
    getHeaderFooterOptions: function() {
        "use strict";
        var objHdrFtr = {
            sI18NDetailTitle: "view.Detail.title",
            onBack: jQuery.proxy(function() {
                var sDir = sap.ui.core.routing.History.getInstance().getDirection(""); // dummy call to identify deep link situation
                if (sDir && sDir !== "Unknown") {
                    window.history.go(-1);
                } else {
                    this.oRouter.navTo("detail", {
                        from: "calendar",
                        contextPath: this.detailContextPath
                    }, true);
                }
            }, this)
        };
        /**
         * @ControllerHook Modify the footer buttons
         * This hook method can be used to add and change buttons for the detail view footer
         * It is called when the decision options for the detail item are fetched successfully
         * @callback hcm.mgr.approve.leaverequests.view.S4~extHookChangeFooterButtons
         * @param {object} Header Footer Object
         * @return {object} Header Footer Object
         */
    	
    	if (this.extHookChangeFooterButtons) {
    		objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
    	};
    	return objHdrFtr;
    }

});
},
	"hcm/mgr/approve/leaverequests/view/S4.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\txmlns:me="sap.me"\n\tcontrollerName="hcm.mgr.approve.leaverequests.view.S4">\n\t<Page id="overlapPage">\n\t\t<VBox id="overlapCalendar">\n\t\t\t<me:OverlapCalendar\n\t\t\t\tid="OverlapCalendar2"\n\t\t\t\tstartDate="2013-04-09T00:00:00"\n\t\t\t\tweeksPerRow="2"\n\t\t\t\tendOfData="_onEndOfData"\n\t\t\t\tchangeDate="_onChangeDate">\n\t\t\t</me:OverlapCalendar>\n\t\t\t<me:CalendarLegend\n\t\t\t\tid="CalenderLegend"\n\t\t\t\tlegendWidth="18em">\n\t\t\t</me:CalendarLegend>\n\t\t</VBox>\n\t</Page>\n</core:View>'
}});
