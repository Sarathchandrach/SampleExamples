jQuery.sap.registerPreloadedModules({
"name":"hcm/emp/myleaverequests/Component-preload",
"version":"2.0",
"modules":{
	"hcm/emp/myleaverequests/Component.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.myleaverequests.Component");
jQuery.sap.require("hcm.emp.myleaverequests.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

sap.ca.scfld.md.ComponentBase.extend("hcm.emp.myleaverequests.Component", {

	metadata : sap.ca.scfld.md.ComponentBase.createMetaData("MD", {
		"name" : "My Leave Requests",
		"version" : "1.4.5",
		"library" : "hcm.emp.myleaverequests",
		"includes" : [],
			"dependencies" : {
			"libs" : ["sap.m", "sap.me"],
		"components" : []
		},
		"config" : {
            "titleResource": "app.Identity",
            "resourceBundle": "i18n/i18n.properties",
            "icon": "sap-icon://Fiori2/F0394",
            "favIcon": "./resources/sap/ca/ui/themes/base/img/favicon/My_Leave_Requests.ico",
            "homeScreenIconPhone": "./resources/sap/ca/ui/themes/base/img/launchicon/My_Leave_Requests/57_iPhone_Desktop_Launch.png",
            "homeScreenIconPhone@2": "./resources/sap/ca/ui/themes/base/img/launchicon/My_Leave_Requests/114_iPhone-Retina_Web_Clip.png",
            "homeScreenIconTablet": "./resources/sap/ca/ui/themes/base/img/launchicon/My_Leave_Requests/72_iPad_Desktop_Launch.png",
            "homeScreenIconTablet@2": "./resources/sap/ca/ui/themes/base/img/launchicon/My_Leave_Requests/144_iPad_Retina_Web_Clip.png"
		},
		
		viewPath : "hcm.emp.myleaverequests.view",
	
		masterPageRoutes : {
			"master" : {
				"pattern" : "history",
				"view" : "S3"				
			}
		},
		
		detailPageRoutes :{
			// fill the routes to your detail pages in here. The application will navigate from the master
			// page to route
			// "detail" leading to detail screen S3.
			// If this is not desired please define your own route "detail"
			"detail" : {
					"pattern" : "detail/{contextPath}",
					"view" : "S6B"
			}
		},
		
		fullScreenPageRoutes : {
			// fill the routes to your full screen pages in here.
				"home" : {
					"pattern" : "",
					"view" : "S1"
				},
				"change" : {
					"pattern" : "change/{requestID}",
					"view" : "S1"
				},
				"entitlements" : {
					"pattern" : "entitlements",
					"view" : "S2"
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
			viewName : "hcm.emp.myleaverequests.Main",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : oViewData
		});
	}

});
},
	"hcm/emp/myleaverequests/Configuration.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */

jQuery.sap.declare("hcm.emp.myleaverequests.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ca.scfld.md.ConfigurationBase.extend("hcm.emp.myleaverequests.Configuration", {

    oServiceParams: {
        serviceList: [
            {
                name: "LEAVEREQUEST",
                masterCollection: "LeaveRequestCollection",
                serviceUrl:  URI("/sap/opu/odata/GBHCM/LEAVEREQUEST;v=2/").directory(),
                isDefault: true,
                mockedDataSource: "/hcm.emp.myleaverequests/model/metadata.xml"
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
	}

});

},
	"hcm/emp/myleaverequests/Main.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("hcm.emp.myleaverequests.utils.DataManager");

sap.ui.controller("hcm.emp.myleaverequests.Main", {

	onInit : function() {
		
        jQuery.sap.require("sap.ca.scfld.md.Startup");				
		sap.ca.scfld.md.Startup.init('hcm.emp.myleaverequests', this);

	}	
	
});
},
	"hcm/emp/myleaverequests/Main.view.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<core:View id="main" xmlns:core="sap.ui.core" xmlns="sap.m" xmlns:sap.ui.core.mvc="sap.ui.core.mvc" controllerName="hcm.emp.myleaverequests.Main"  displayBlock="true" height="100%">\r\n    <Shell id="shell" title="{i18n>app.Identity}">\r\n            <NavContainer id="fioriContent">\r\n            </NavContainer>\r\n    </Shell>\r\n</core:View>',
	"hcm/emp/myleaverequests/i18n/i18n.properties":'# Texts for the leave request create app\n# __ldi.translation.uuid=d6ae9e60-31b0-11e3-aa6e-0800200c9a66\n# GUID was created with http://www.famkruithof.net/uuid/uuidgen\n# Note: This file was created according to the conventions that can be found at \n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\n\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=My Leave Requests\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=My Leave Requests\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=Request Leave\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=Change Leave Request\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=Entitlements\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=History\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=Leave Details\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=Leave Requests\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=Leave Request\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=Category\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=Available\n\n#XTIT: Used\nLR_BALANCE_USED=Used\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=Requested\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=Entitlements\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=Entitlement\n\n#XTIT: Send leave request\nLR_TITLE_SEND=Send Leave Request\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=Withdraw Leave Request\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=Entitlements \n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=History\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=Create Leave Request\n\n#XBUT\nLR_SHOW_HIST=History\n\n#XBUT\nLR_CREATE_LEAVE=Request Leave\n\n#XBUT: text for "send leave request" button\nLR_SEND=Send\n\n#XBUT: text for ok button \nLR_OK=OK\n\n#XBUT: text for reset button \nLR_RESET=Reset\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=Cancel\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=Change\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=Withdraw\n\n#XSEL\nLR_UPDATED=Updated \n\n#XFLD\nLR_NOTE=Note\n\n#XFLD\nLR_CUSTOM1=Custom Field 1\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=used\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=available\n\n#XFLD\nLR_LOWERCASE_DAYS=days\n\n#XFLD\nLR_LOWERCASE_DAY=day\n\n#XFLD\nLR_LOWERCASE_HOURS=hours\n\n#XFLD\nLR_LOWERCASE_HOUR=hour\n\n#XFLD\nLR_UP_TO=Valid Upto\n\n#XFLD\nLR_FROM=From\n\n#XFLD\nLR_TO=To\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=-\n\n#XTIT: title of error dialog\nLR_PROBLEM=A problem occurred\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=Confirmation\n\n#YMSG\nLR_CONFIRMATIONMSG=Do you want to send this leave request to {0}?\n\n#YMSG\nLR_WITHDRAWNMSG=Do you want to withdraw this leave request?\n\n#XFLD\nLR_DAYS=days\n\n#XFLD\nLR_DAY=day\n\n#XFLD\nLR_HOURS=hours\n\n#XFLD\nLR_HOUR=hour\n\n#XFLD\nLR_REQUEST=Requested\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=Today\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=Selected Day(s)\n\n#YMSG: processing\nLR_PROCESSING=Processing...\n\n#YMSG\nLR_SUBMITDONE=Your leave request was sent to {0}\n\n#YMSG\nLR_WITHDRAWDONE=Your leave request was withdrawn\n\n#YMSG\nLR_AX_MODEL_NOT_REG=A technical problem has occurred\\n\\nError Details:\\nInternal error; model not registered\n\n#YMSG\nLR_AX_PARSE_ERR=A technical problem has occurred\\n\\nError Details:\\nProtocol error; could not parse HTTP response\n\n#YMSG\nLR_DD_NO_APPROVER=A technical problem has occurred\\n\\nError Details:\\nProtocol error; approver name missing in response\n\n#YMSG\nLR_DD_NO_CFG=A technical problem has occurred\\n\\nError Details:\\nProtocol error; configuration missing in response\n\n#YMSG\nLR_DD_NO_BALANCES=A technical problem has occurred\\n\\nError Details:\\nProtocol error; balances missing in response\n\n#YMSG\nLR_DD_PARSE_ERR=A technical problem has occurred\\n\\nError Details:\\nProtocol error; could not parse response\n\n#YMSG\nLR_DD_COMM_ERR=A problem has occurred with your connection\n\n#YMSG\nLR_DD_GENERIC_ERR=An error has occurred\n\n#YMSG\nLR_CT_PARSE_ERR=A technical problem has occurred\\n\\nError Details:\\nProtocol error; Could not parse response\n\n#XFLD\nLR_S1_PENDING:Pending\n\n#YMSG\nLR_UNKNOWN=Unknown\n\n#XSEL: (legend)\nLR_NONWORKING=Non-Working Day\n\n#XSEL: (legend)\nLR_APPROVELEAVE=Approved\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=Rejected \n\n#XSEL: (legend)\nLR_APPROVEPENDING=Approval Pending\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=Public Holiday\n\n#XSEL: (legend)\nLR_WORKINGDAY=Working Day\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=Cancellation Requested\n\n#XTIT\nLR_DELETION_REQ=Cancellation Request\n\n#XTIT\nLR_CHANGE_REQ=Change Request\n\n#XTIT\nLR_CHANGE_PENDING=Change Pending\n\n#XTIT\nLR_CANCEL_PENDING=Cancellation Pending\n\n#XTIT\nLR_CHANGE_DONE=Change Approved\n\n#XTIT\nLR_CANCEL_DONE=Cancellation Approved\n\n#XTIT\nLR_OLD_VERSION=Original\n\n#XTIT\nLR_NEW_VERSION=Changed\n',
	"hcm/emp/myleaverequests/i18n/i18n_ar.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n#XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=\\u0637\\u0644\\u0628\\u0627\\u062A \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629 \\u0627\\u0644\\u062E\\u0627\\u0635\\u0629 \\u0628\\u064A\r\n\r\n#XTIT: title of the home view\r\nLR_TITLE_HOME_VIEW=\\u0637\\u0644\\u0628\\u0627\\u062A \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629 \\u0627\\u0644\\u062E\\u0627\\u0635\\u0629 \\u0628\\u064A\r\n\r\n#XTIT: title of the leave create view\r\nLR_TITLE_CREATE_VIEW=\\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\r\n\r\n#XTIT: title of the leave change view\r\nLR_TITLE_CHANGE_VIEW=\\u062A\\u063A\\u064A\\u064A\\u0631 \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\r\n\r\n#XTIT: title of the Entitlements view\r\nLR_TITLE_BALANCE_VIEW=\\u0627\\u0644\\u062D\\u0642\\u0648\\u0642\r\n\r\n#XTIT: title of the leave History view\r\nLR_TITLE_HISTORY_VIEW=\\u0627\\u0644\\u0633\\u062C\\u0644\r\n\r\n#XTIT: title of the leave details view\r\nLR_TITLE_DETAILS_VIEW=\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\r\n\r\n#XTIT: title of the leave requests\r\nLR_TITLE_LEAVE_REQUESTS=\\u0637\\u0644\\u0628\\u0627\\u062A \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\r\n\r\n#XTIT: title of the leave request\r\nLR_TITLE_LEAVE_REQUEST=\\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\r\n\r\n#XTIT: deductible\r\nLR_BALANCE_DEDUCTIBLE=\\u0627\\u0644\\u0641\\u0626\\u0629\r\n\r\n#XTIT: Balance\r\nLR_BALANCE_BALANCE=\\u0645\\u062A\\u0648\\u0641\\u0631\r\n\r\n#XTIT: Requested\r\nLR_BALANCE_REQUESTED=\\u0645\\u0637\\u0644\\u0648\\u0628\r\n\r\n#XTIT: Quota\r\nLR_BALANCE_QUOTA=\\u0627\\u0644\\u062D\\u0642\\u0648\\u0642\r\n\r\n#XTIT: Entitlement\r\nLR_ENTITLEMENT_QUOTA=\\u0627\\u0644\\u062D\\u0642\r\n\r\n#XTIT: Send leave request\r\nLR_TITLE_SEND=\\u0625\\u0631\\u0633\\u0627\\u0644 \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\r\n\r\n#XTIT: Cancel leave request\r\nLR_TITLE_WITHDRAW=\\u0633\\u062D\\u0628 \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_BALANCE_TILE=\\u0627\\u0644\\u062D\\u0642\\u0648\\u0642\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_HISTORY_TILE=\\u0627\\u0644\\u0633\\u062C\\u0644\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_CREATE_LEAVE_TILE=\\u0625\\u0646\\u0634\\u0627\\u0621 \\u0637\\u0644\\u0628 \\u0625\\u062C\\u0627\\u0632\\u0629\r\n\r\n#XBUT\r\nLR_SHOW_HIST=\\u0627\\u0644\\u0633\\u062C\\u0644\r\n\r\n#XBUT\r\nLR_CREATE_LEAVE=\\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\r\n\r\n#XBUT: text for "send leave request" button\r\nLR_SEND=\\u0625\\u0631\\u0633\\u0627\\u0644\r\n\r\n#XBUT: text for ok button \r\nLR_OK=\\u0645\\u0648\\u0627\\u0641\\u0642\r\n\r\n#XBUT: text for reset button \r\nLR_RESET=\\u0625\\u0639\\u0627\\u062F\\u0629 \\u062A\\u0639\\u064A\\u064A\\u0646\r\n\r\n#XBUT: text for cancel button e.g. on the day range picker screen\r\nLR_CANCEL=\\u0625\\u0644\\u063A\\u0627\\u0621\r\n\r\n#XBUT: text for change button on the Leave Overview details screen\r\nLR_CHANGE=\\u062A\\u063A\\u064A\\u064A\\u0631\r\n\r\n#XBUT: text for cancel button on the Leave Overview details screen\r\nLR_WITHDRAW=\\u0633\\u062D\\u0628\r\n\r\n#XSEL\r\nLR_UPDATED=\\u062A\\u0645 \\u062A\\u062D\\u062F\\u064A\\u062B\\u0647\r\n\r\n#XFLD\r\nLR_NOTE=\\u0645\\u0644\\u0627\\u062D\\u0638\\u0629\r\n\r\n#XFLD\r\nLR_CUSTOM1=\\u062D\\u0642\\u0644 \\u0645\\u062E\\u0635\\u0635 1\r\n\r\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\r\nLR_BOOKED=\\u0645\\u0633\\u062A\\u062E\\u062F\\u064E\\u0645\r\n\r\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\r\nLR_REMAINING=\\u0645\\u062A\\u0648\\u0641\\u0631\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAYS=\\u0623\\u064A\\u0627\\u0645\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAY=\\u064A\\u0648\\u0645\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOURS=\\u0633\\u0627\\u0639\\u0627\\u062A\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOUR=\\u0633\\u0627\\u0639\\u0629\r\n\r\n#XFLD\r\nLR_UP_TO=\\u0635\\u0627\\u0644\\u062D \\u062D\\u062A\\u0649\r\n\r\n#XFLD\r\nLR_FROM=\\u0645\\u0646\r\n\r\n#XFLD\r\nLR_TO=\\u0625\\u0644\\u0649\r\n\r\n#XFLD: Hyphen for Date Formatting\r\nLR_HYPHEN=-\r\n\r\n#XTIT: title of error dialog\r\nLR_PROBLEM=\\u062D\\u062F\\u062B\\u062A \\u0645\\u0634\\u0643\\u0644\\u0629\r\n\r\n#XTIT: title of confirmation dialog\r\nLR_CONFIRMATION=\\u062A\\u0623\\u0643\\u064A\\u062F\r\n\r\n#YMSG\r\nLR_CONFIRMATIONMSG=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0625\\u0631\\u0633\\u0627\\u0644 \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629 \\u0647\\u0630\\u0627 \\u0625\\u0644\\u0649 {0}\\u061F\r\n\r\n#YMSG\r\nLR_WITHDRAWNMSG=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0633\\u062D\\u0628 \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629 \\u0647\\u0630\\u0627\\u061F\r\n\r\n#XFLD\r\nLR_DAYS=\\u0623\\u064A\\u0627\\u0645\r\n\r\n#XFLD\r\nLR_DAY=\\u0627\\u0644\\u064A\\u0648\\u0645\r\n\r\n#XFLD\r\nLR_HOURS=\\u0633\\u0627\\u0639\\u0627\\u062A\r\n\r\n#XFLD\r\nLR_HOUR=\\u0633\\u0627\\u0639\\u0629\r\n\r\n#XFLD\r\nLR_REQUEST=\\u0645\\u0637\\u0644\\u0648\\u0628\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_TODAY=\\u0627\\u0644\\u064A\\u0648\\u0645\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_SELECTED=\\u064A\\u0648\\u0645 (\\u0623\\u064A\\u0627\\u0645) \\u0645\\u062D\\u062F\\u062F\r\n\r\n#YMSG: processing\r\nLR_PROCESSING=\\u062C\\u0627\\u0631\\u064D \\u0627\\u0644\\u0645\\u0639\\u0627\\u0644\\u062C\\u0629...\r\n\r\n#YMSG\r\nLR_SUBMITDONE=\\u062A\\u0645 \\u0625\\u0631\\u0633\\u0627\\u0644 \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629 \\u0627\\u0644\\u062E\\u0627\\u0635 \\u0628\\u0643 \\u0625\\u0644\\u0649 {0}\r\n\r\n#YMSG\r\nLR_WITHDRAWDONE=\\u062A\\u0645 \\u0633\\u062D\\u0628 \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629 \\u0627\\u0644\\u062E\\u0627\\u0635 \\u0628\\u0643\r\n\r\n#YMSG\r\nLR_AX_MODEL_NOT_REG=\\u062D\\u062F\\u062B\\u062A \\u0645\\u0634\\u0643\\u0644\\u0629 \\u062A\\u0642\\u0646\\u064A\\u0629\\n\\n\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u062E\\u0637\\u0623\\:\\n\\u062E\\u0637\\u0623 \\u062F\\u0627\\u062E\\u0644\\u064A\\u061B \\u0644\\u0645 \\u064A\\u062A\\u0645 \\u062A\\u0633\\u062C\\u064A\\u0644 \\u0627\\u0644\\u0646\\u0645\\u0648\\u0630\\u062C\r\n\r\n#YMSG\r\nLR_AX_PARSE_ERR=\\u062D\\u062F\\u062B\\u062A \\u0645\\u0634\\u0643\\u0644\\u0629 \\u062A\\u0642\\u0646\\u064A\\u0629\\n\\n\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u062E\\u0637\\u0623\\:\\n\\u062E\\u0637\\u0623 \\u0641\\u064A \\u0627\\u0644\\u0628\\u0631\\u0648\\u062A\\u0648\\u0643\\u0648\\u0644\\u061B \\u062A\\u0639\\u0630\\u0631 \\u062A\\u062D\\u0644\\u064A\\u0644 \\u0627\\u0633\\u062A\\u062C\\u0627\\u0628\\u0629 HTTP\r\n\r\n#YMSG\r\nLR_DD_NO_APPROVER=\\u062D\\u062F\\u062B\\u062A \\u0645\\u0634\\u0643\\u0644\\u0629 \\u062A\\u0642\\u0646\\u064A\\u0629\\n\\n\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u062E\\u0637\\u0623\\:\\n\\u062E\\u0637\\u0623 \\u0641\\u064A \\u0627\\u0644\\u0628\\u0631\\u0648\\u062A\\u0648\\u0643\\u0648\\u0644\\u061B \\u0627\\u0633\\u0645 \\u0627\\u0644\\u0645\\u0639\\u062A\\u0645\\u0650\\u062F \\u0645\\u0641\\u0642\\u0648\\u062F \\u0641\\u064A \\u0627\\u0644\\u0627\\u0633\\u062A\\u062C\\u0627\\u0628\\u0629\r\n\r\n#YMSG\r\nLR_DD_NO_CFG=\\u062D\\u062F\\u062B\\u062A \\u0645\\u0634\\u0643\\u0644\\u0629 \\u062A\\u0642\\u0646\\u064A\\u0629\\n\\n\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u062E\\u0637\\u0623\\:\\n\\u062E\\u0637\\u0623 \\u0641\\u064A \\u0627\\u0644\\u0628\\u0631\\u0648\\u062A\\u0648\\u0643\\u0648\\u0644\\u061B \\u0627\\u0644\\u062A\\u0643\\u0648\\u064A\\u0646 \\u0645\\u0641\\u0642\\u0648\\u062F \\u0641\\u064A \\u0627\\u0644\\u0627\\u0633\\u062A\\u062C\\u0627\\u0628\\u0629\r\n\r\n#YMSG\r\nLR_DD_NO_BALANCES=\\u062D\\u062F\\u062B\\u062A \\u0645\\u0634\\u0643\\u0644\\u0629 \\u062A\\u0642\\u0646\\u064A\\u0629\\n\\n\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u062E\\u0637\\u0623\\:\\n\\u062E\\u0637\\u0623 \\u0641\\u064A \\u0627\\u0644\\u0628\\u0631\\u0648\\u062A\\u0648\\u0643\\u0648\\u0644\\u061B \\u0627\\u0644\\u0623\\u0631\\u0635\\u062F\\u0629 \\u0645\\u0641\\u0642\\u0648\\u062F\\u0629 \\u0641\\u064A \\u0627\\u0644\\u0627\\u0633\\u062A\\u062C\\u0627\\u0628\\u0629\r\n\r\n#YMSG\r\nLR_DD_PARSE_ERR=\\u062D\\u062F\\u062B\\u062A \\u0645\\u0634\\u0643\\u0644\\u0629 \\u062A\\u0642\\u0646\\u064A\\u0629\\n\\n\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u062E\\u0637\\u0623\\:\\n\\u062E\\u0637\\u0623 \\u0641\\u064A \\u0627\\u0644\\u0628\\u0631\\u0648\\u062A\\u0648\\u0643\\u0648\\u0644\\u061B \\u062A\\u0639\\u0630\\u0631 \\u062A\\u062D\\u0644\\u064A\\u0644 \\u0627\\u0644\\u0627\\u0633\\u062A\\u062C\\u0627\\u0628\\u0629\r\n\r\n#YMSG\r\nLR_DD_COMM_ERR=\\u062D\\u062F\\u062B\\u062A \\u0645\\u0634\\u0643\\u0644\\u0629 \\u0641\\u064A \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644\r\n\r\n#YMSG\r\nLR_DD_GENERIC_ERR=\\u062D\\u062F\\u062B \\u062E\\u0637\\u0623\r\n\r\n#YMSG\r\nLR_CT_PARSE_ERR=\\u062D\\u062F\\u062B\\u062A \\u0645\\u0634\\u0643\\u0644\\u0629 \\u062A\\u0642\\u0646\\u064A\\u0629\\n\\n\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u062E\\u0637\\u0623\\:\\n\\u062E\\u0637\\u0623 \\u0641\\u064A \\u0627\\u0644\\u0628\\u0631\\u0648\\u062A\\u0648\\u0643\\u0648\\u0644\\u061B \\u062A\\u0639\\u0630\\u0631 \\u062A\\u062D\\u0644\\u064A\\u0644 \\u0627\\u0644\\u0627\\u0633\\u062A\\u062C\\u0627\\u0628\\u0629\r\n\r\n#XFLD\r\nLR_S1_PENDING=\\u0645\\u0639\\u0644\\u0642\r\n\r\n#YMSG\r\nLR_UNKNOWN=\\u063A\\u064A\\u0631 \\u0645\\u0639\\u0631\\u0648\\u0641\r\n\r\n#XSEL: (legend)\r\nLR_NONWORKING=\\u0639\\u0637\\u0644\\u0629\r\n\r\n#XSEL: (legend)\r\nLR_APPROVELEAVE=\\u0645\\u0639\\u062A\\u0645\\u064E\\u062F\r\n\r\n#XSEL: (legend)\r\nLR_REJECTEDLEAVE=\\u0645\\u0631\\u0641\\u0648\\u0636\r\n\r\n#XSEL: (legend)\r\nLR_APPROVEPENDING=\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0645\\u0639\\u0644\\u0642\r\n\r\n#XSEL: (legend)\r\nLR_PUBLICHOLIDAY=\\u0639\\u0637\\u0644\\u0629 \\u0631\\u0633\\u0645\\u064A\\u0629\r\n\r\n#XSEL: (legend)\r\nLR_WORKINGDAY=\\u064A\\u0648\\u0645 \\u0639\\u0645\\u0644\r\n\r\n#XSEL: (legend)\r\nLR_DELETIONREQUESTED=\\u0645\\u0637\\u0644\\u0648\\u0628 \\u0627\\u0644\\u0625\\u0644\\u063A\\u0627\\u0621\r\n\r\n#XTIT\r\nLR_DELETION_REQ=\\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u0644\\u063A\\u0627\\u0621\r\n\r\n#XTIT\r\nLR_CHANGE_REQ=\\u0637\\u0644\\u0628 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\r\n\r\n#XTIT\r\nLR_CHANGE_PENDING=\\u062A\\u063A\\u064A\\u064A\\u0631 \\u0645\\u0639\\u0644\\u0642\r\n\r\n#XTIT\r\nLR_CANCEL_PENDING=\\u0625\\u0644\\u063A\\u0627\\u0621 \\u0645\\u0639\\u0644\\u0642\r\n\r\n#XTIT\r\nLR_CHANGE_DONE=\\u062A\\u0645 \\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\r\n\r\n#XTIT\r\nLR_CANCEL_DONE=\\u062A\\u0645 \\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0627\\u0644\\u0625\\u0644\\u063A\\u0627\\u0621\r\n\r\n#XTIT\r\nLR_OLD_VERSION=\\u0627\\u0644\\u0623\\u0635\\u0644\\u064A\r\n\r\n#XTIT\r\nLR_NEW_VERSION=\\u062A\\u0645 \\u062A\\u063A\\u064A\\u064A\\u0631\\u0647\r\n',
	"hcm/emp/myleaverequests/i18n/i18n_cs.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n#XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=Moje \\u017E\\u00E1dosti o dovolenou\r\n\r\n#XTIT: title of the home view\r\nLR_TITLE_HOME_VIEW=Moje \\u017E\\u00E1dosti o dovolenou\r\n\r\n#XTIT: title of the leave create view\r\nLR_TITLE_CREATE_VIEW=\\u017D\\u00E1dost o dovolenou\r\n\r\n#XTIT: title of the leave change view\r\nLR_TITLE_CHANGE_VIEW=Zm\\u011Bna \\u017E\\u00E1dosti o dovolenou\r\n\r\n#XTIT: title of the Entitlements view\r\nLR_TITLE_BALANCE_VIEW=N\\u00E1roky\r\n\r\n#XTIT: title of the leave History view\r\nLR_TITLE_HISTORY_VIEW=Historie\r\n\r\n#XTIT: title of the leave details view\r\nLR_TITLE_DETAILS_VIEW=Detaily dovolen\\u00E9\r\n\r\n#XTIT: title of the leave requests\r\nLR_TITLE_LEAVE_REQUESTS=\\u017D\\u00E1dosti o dovolenou\r\n\r\n#XTIT: title of the leave request\r\nLR_TITLE_LEAVE_REQUEST=\\u017D\\u00E1dost o dovolenou\r\n\r\n#XTIT: deductible\r\nLR_BALANCE_DEDUCTIBLE=Kategorie\r\n\r\n#XTIT: Balance\r\nLR_BALANCE_BALANCE=K dispozici\r\n\r\n#XTIT: Requested\r\nLR_BALANCE_REQUESTED=Po\\u017Eadov\\u00E1no\r\n\r\n#XTIT: Quota\r\nLR_BALANCE_QUOTA=N\\u00E1roky\r\n\r\n#XTIT: Entitlement\r\nLR_ENTITLEMENT_QUOTA=N\\u00E1rok\r\n\r\n#XTIT: Send leave request\r\nLR_TITLE_SEND=Odeslat \\u017E\\u00E1dost o dovolenou\r\n\r\n#XTIT: Cancel leave request\r\nLR_TITLE_WITHDRAW=Zru\\u0161en\\u00ED \\u017E\\u00E1dosti o dovolenou\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_BALANCE_TILE=N\\u00E1roky\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_HISTORY_TILE=Historie\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_CREATE_LEAVE_TILE=Vytvo\\u0159it \\u017E\\u00E1dost o dovolenou\r\n\r\n#XBUT\r\nLR_SHOW_HIST=Historie\r\n\r\n#XBUT\r\nLR_CREATE_LEAVE=\\u017D\\u00E1dost o dovolenou\r\n\r\n#XBUT: text for "send leave request" button\r\nLR_SEND=Odeslat\r\n\r\n#XBUT: text for ok button \r\nLR_OK=OK\r\n\r\n#XBUT: text for reset button \r\nLR_RESET=Reset\r\n\r\n#XBUT: text for cancel button e.g. on the day range picker screen\r\nLR_CANCEL=Zru\\u0161it\r\n\r\n#XBUT: text for change button on the Leave Overview details screen\r\nLR_CHANGE=Zm\\u011Bnit\r\n\r\n#XBUT: text for cancel button on the Leave Overview details screen\r\nLR_WITHDRAW=Zru\\u0161it\r\n\r\n#XSEL\r\nLR_UPDATED=Aktualizov\\u00E1no\r\n\r\n#XFLD\r\nLR_NOTE=Pozn\\u00E1mka\r\n\r\n#XFLD\r\nLR_CUSTOM1=U\\u017Eivatelsk\\u00E9 pole 1\r\n\r\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\r\nLR_BOOKED=vyu\\u017Eito\r\n\r\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\r\nLR_REMAINING=k dispozici\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAYS=dny\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAY=den\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOURS=Hodiny\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOUR=Hodina\r\n\r\n#XFLD\r\nLR_UP_TO=Plat\\u00ED do\r\n\r\n#XFLD\r\nLR_FROM=Od\r\n\r\n#XFLD\r\nLR_TO=Do\r\n\r\n#XFLD: Hyphen for Date Formatting\r\nLR_HYPHEN=-\r\n\r\n#XTIT: title of error dialog\r\nLR_PROBLEM=Do\\u0161lo k probl\\u00E9mu\r\n\r\n#XTIT: title of confirmation dialog\r\nLR_CONFIRMATION=Potvrzen\\u00ED\r\n\r\n#YMSG\r\nLR_CONFIRMATIONMSG=Odeslat tuto \\u017E\\u00E1dost o dovolenou na {0}?\r\n\r\n#YMSG\r\nLR_WITHDRAWNMSG=Chcete \\u017E\\u00E1dost o dovolenou zru\\u0161it?\r\n\r\n#XFLD\r\nLR_DAYS=Dny\r\n\r\n#XFLD\r\nLR_DAY=Den\r\n\r\n#XFLD\r\nLR_HOURS=Hodiny\r\n\r\n#XFLD\r\nLR_HOUR=Hodina\r\n\r\n#XFLD\r\nLR_REQUEST=Po\\u017Eadov\\u00E1no\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_TODAY=Dnes\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_SELECTED=Vybran\\u00E9 dny\r\n\r\n#YMSG: processing\r\nLR_PROCESSING=Prob\\u00EDh\\u00E1 zpracov\\u00E1n\\u00ED...\r\n\r\n#YMSG\r\nLR_SUBMITDONE=Va\\u0161e \\u017E\\u00E1dost o dovolenou byla odesl\\u00E1na na {0}\r\n\r\n#YMSG\r\nLR_WITHDRAWDONE=Va\\u0161e \\u017E\\u00E1dost o dovolenou byla zru\\u0161ena\r\n\r\n#YMSG\r\nLR_AX_MODEL_NOT_REG=Do\\u0161lo k technick\\u00E9 chyb\\u011B\\n\\nDetaily chyby\\:\\nIntern\\u00ED chyba; model nen\\u00ED registrov\\u00E1n\r\n\r\n#YMSG\r\nLR_AX_PARSE_ERR=Do\\u0161lo k technick\\u00E9 chyb\\u011B\\n\\nDetaily chyby\\:\\nChyba protokolu; nepoda\\u0159ilo se analyzovat odezvu HTTP\r\n\r\n#YMSG\r\nLR_DD_NO_APPROVER=Do\\u0161lo k technick\\u00E9 chyb\\u011B\\n\\nDetaily chyby\\:\\nChyba protokolu; v odezv\\u011B chyb\\u00ED jm\\u00E9no schvalovatele\r\n\r\n#YMSG\r\nLR_DD_NO_CFG=Do\\u0161lo k technick\\u00E9 chyb\\u011B\\n\\nDetaily chyby\\:\\nChyba protokolu; v odezv\\u011B chyb\\u00ED konfigurace\r\n\r\n#YMSG\r\nLR_DD_NO_BALANCES=Do\\u0161lo k technick\\u00E9 chyb\\u011B\\n\\nDetaily chyby\\:\\nChyba protokolu; v odezv\\u011B chyb\\u011Bj\\u00ED z\\u016Fstatky\r\n\r\n#YMSG\r\nLR_DD_PARSE_ERR=Do\\u0161lo k technick\\u00E9 chyb\\u011B\\n\\nDetaily chyby\\:\\nChyba protokolu; nepoda\\u0159ilo se analyzovat odezvu\r\n\r\n#YMSG\r\nLR_DD_COMM_ERR=Do\\u0161lo k probl\\u00E9mu s va\\u0161\\u00EDm p\\u0159ipojen\\u00EDm\r\n\r\n#YMSG\r\nLR_DD_GENERIC_ERR=Do\\u0161lo k chyb\\u011B\r\n\r\n#YMSG\r\nLR_CT_PARSE_ERR=Do\\u0161lo k technick\\u00E9 chyb\\u011B\\n\\nDetaily chyby\\:\\nChyba protokolu; nepoda\\u0159ilo se analyzovat odezvu\r\n\r\n#XFLD\r\nLR_S1_PENDING=Nevy\\u0159\\u00EDzeno\r\n\r\n#YMSG\r\nLR_UNKNOWN=Nezn\\u00E1m.\r\n\r\n#XSEL: (legend)\r\nLR_NONWORKING=Nepracovn\\u00ED den\r\n\r\n#XSEL: (legend)\r\nLR_APPROVELEAVE=Schv\\u00E1leno\r\n\r\n#XSEL: (legend)\r\nLR_REJECTEDLEAVE=Zam\\u00EDtnuto\r\n\r\n#XSEL: (legend)\r\nLR_APPROVEPENDING=Nevy\\u0159\\u00EDzen\\u00E9 schv\\u00E1len\\u00ED\r\n\r\n#XSEL: (legend)\r\nLR_PUBLICHOLIDAY=Sv\\u00E1tek\r\n\r\n#XSEL: (legend)\r\nLR_WORKINGDAY=Pracovn\\u00ED den\r\n\r\n#XSEL: (legend)\r\nLR_DELETIONREQUESTED=Po\\u017Eadov\\u00E1no zru\\u0161en\\u00ED\r\n\r\n#XTIT\r\nLR_DELETION_REQ=\\u017D\\u00E1dost o zru\\u0161en\\u00ED\r\n\r\n#XTIT\r\nLR_CHANGE_REQ=\\u017D\\u00E1dost o zm\\u011Bnu\r\n\r\n#XTIT\r\nLR_CHANGE_PENDING=Nevy\\u0159\\u00EDzen\\u00E1 zm\\u011Bna\r\n\r\n#XTIT\r\nLR_CANCEL_PENDING=Nevy\\u0159\\u00EDzen\\u00E9 zru\\u0161en\\u00ED\r\n\r\n#XTIT\r\nLR_CHANGE_DONE=Zm\\u011Bna schv\\u00E1lena\r\n\r\n#XTIT\r\nLR_CANCEL_DONE=Schv\\u00E1len\\u00E9 zru\\u0161en\\u00ED\r\n\r\n#XTIT\r\nLR_OLD_VERSION=Origin\\u00E1l\r\n\r\n#XTIT\r\nLR_NEW_VERSION=Zm\\u011Bn\\u011Bno\r\n',
	"hcm/emp/myleaverequests/i18n/i18n_de.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n#XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=Meine Abwesenheitsantr\\u00E4ge\r\n\r\n#XTIT: title of the home view\r\nLR_TITLE_HOME_VIEW=Meine Abwesenheitsantr\\u00E4ge\r\n\r\n#XTIT: title of the leave create view\r\nLR_TITLE_CREATE_VIEW=Abwesenheit beantragen\r\n\r\n#XTIT: title of the leave change view\r\nLR_TITLE_CHANGE_VIEW=Abwesenheitsantrag \\u00E4ndern\r\n\r\n#XTIT: title of the Entitlements view\r\nLR_TITLE_BALANCE_VIEW=Anspr\\u00FCche\r\n\r\n#XTIT: title of the leave History view\r\nLR_TITLE_HISTORY_VIEW=Historie\r\n\r\n#XTIT: title of the leave details view\r\nLR_TITLE_DETAILS_VIEW=Abwesenheitsdetails\r\n\r\n#XTIT: title of the leave requests\r\nLR_TITLE_LEAVE_REQUESTS=Abwesenheitsantr\\u00E4ge\r\n\r\n#XTIT: title of the leave request\r\nLR_TITLE_LEAVE_REQUEST=Abwesenheitsantrag\r\n\r\n#XTIT: deductible\r\nLR_BALANCE_DEDUCTIBLE=Kategorie\r\n\r\n#XTIT: Balance\r\nLR_BALANCE_BALANCE=Verf\\u00FCgbar\r\n\r\n#XTIT: Requested\r\nLR_BALANCE_REQUESTED=Beantragt\r\n\r\n#XTIT: Quota\r\nLR_BALANCE_QUOTA=Anspr\\u00FCche\r\n\r\n#XTIT: Entitlement\r\nLR_ENTITLEMENT_QUOTA=Anspruch\r\n\r\n#XTIT: Send leave request\r\nLR_TITLE_SEND=Abwesenheitsantrag senden\r\n\r\n#XTIT: Cancel leave request\r\nLR_TITLE_WITHDRAW=Abwesenheitsantrag stornieren\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_BALANCE_TILE=Anspr\\u00FCche\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_HISTORY_TILE=Historie\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_CREATE_LEAVE_TILE=Abwesenheitsantrag anlegen\r\n\r\n#XBUT\r\nLR_SHOW_HIST=Historie\r\n\r\n#XBUT\r\nLR_CREATE_LEAVE=Abwesenheit beantragen\r\n\r\n#XBUT: text for "send leave request" button\r\nLR_SEND=Senden\r\n\r\n#XBUT: text for ok button \r\nLR_OK=OK\r\n\r\n#XBUT: text for reset button \r\nLR_RESET=Zur\\u00FCcksetzen\r\n\r\n#XBUT: text for cancel button e.g. on the day range picker screen\r\nLR_CANCEL=Abbrechen\r\n\r\n#XBUT: text for change button on the Leave Overview details screen\r\nLR_CHANGE=\\u00C4ndern\r\n\r\n#XBUT: text for cancel button on the Leave Overview details screen\r\nLR_WITHDRAW=Stornieren\r\n\r\n#XSEL\r\nLR_UPDATED=Aktualisiert\r\n\r\n#XFLD\r\nLR_NOTE=Notiz\r\n\r\n#XFLD\r\nLR_CUSTOM1=Benutzerdefiniertes Feld 1\r\n\r\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\r\nLR_BOOKED=verbraucht\r\n\r\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\r\nLR_REMAINING=verf\\u00FCgbar\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAYS=Tage\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAY=Tag\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOURS=Stunden\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOUR=Stunde\r\n\r\n#XFLD\r\nLR_UP_TO=G\\u00FCltig bis\r\n\r\n#XFLD\r\nLR_FROM=Von\r\n\r\n#XFLD\r\nLR_TO=Bis\r\n\r\n#XFLD: Hyphen for Date Formatting\r\nLR_HYPHEN=-\r\n\r\n#XTIT: title of error dialog\r\nLR_PROBLEM=Fehler aufgetreten\r\n\r\n#XTIT: title of confirmation dialog\r\nLR_CONFIRMATION=Best\\u00E4tigung\r\n\r\n#YMSG\r\nLR_CONFIRMATIONMSG=Abwesenheitsantrag an {0} senden?\r\n\r\n#YMSG\r\nLR_WITHDRAWNMSG=M\\u00F6chten Sie diesen Abwesenheitsantrag stornieren?\r\n\r\n#XFLD\r\nLR_DAYS=Tage\r\n\r\n#XFLD\r\nLR_DAY=Tag\r\n\r\n#XFLD\r\nLR_HOURS=Stunden\r\n\r\n#XFLD\r\nLR_HOUR=Stunde\r\n\r\n#XFLD\r\nLR_REQUEST=Beantragt\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_TODAY=Heute\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_SELECTED=Ausgew\\u00E4hlte Tage\r\n\r\n#YMSG: processing\r\nLR_PROCESSING=Verarbeitung l\\u00E4uft ...\r\n\r\n#YMSG\r\nLR_SUBMITDONE=Ihr Abwesenheitsantrag wurde an {0} gesendet\r\n\r\n#YMSG\r\nLR_WITHDRAWDONE=Ihr Abwesenheitsantrag wurde storniert\r\n\r\n#YMSG\r\nLR_AX_MODEL_NOT_REG=Technisches Problem\\n\\nFehlerdetails\\:\\nInterner Fehler, Modell nicht registriert\r\n\r\n#YMSG\r\nLR_AX_PARSE_ERR=Technisches Problem\\n\\nFehlerdetails\\:\\nProtokollfehler, HTTP-Antwort kann nicht analysiert werden\r\n\r\n#YMSG\r\nLR_DD_NO_APPROVER=Technisches Problem\\n\\nFehlerdetails\\:\\nProtokollfehler, Genehmigender fehlt in Antwort\r\n\r\n#YMSG\r\nLR_DD_NO_CFG=Technisches Problem\\n\\nFehlerdetails\\:\\nProtokollfehler, Konfiguration fehlt in Antwort\r\n\r\n#YMSG\r\nLR_DD_NO_BALANCES=Technisches Problem\\n\\nFehlerdetails\\:\\nProtokollfehler, Salden fehlen in Antwort\r\n\r\n#YMSG\r\nLR_DD_PARSE_ERR=Technisches Problem\\n\\nFehlerdetails\\:\\nProtokollfehler, Antwort kann nicht analysiert werden\r\n\r\n#YMSG\r\nLR_DD_COMM_ERR=Verbindungsfehler\r\n\r\n#YMSG\r\nLR_DD_GENERIC_ERR=Fehler aufgetreten\r\n\r\n#YMSG\r\nLR_CT_PARSE_ERR=Technisches Problem\\n\\nFehlerdetails\\:\\nProtokollfehler, Antwort kann nicht analysiert werden\r\n\r\n#XFLD\r\nLR_S1_PENDING=Ausstehend\r\n\r\n#YMSG\r\nLR_UNKNOWN=Unbekannt\r\n\r\n#XSEL: (legend)\r\nLR_NONWORKING=Kein Arbeitstag\r\n\r\n#XSEL: (legend)\r\nLR_APPROVELEAVE=Genehmigt\r\n\r\n#XSEL: (legend)\r\nLR_REJECTEDLEAVE=Abgelehnt\r\n\r\n#XSEL: (legend)\r\nLR_APPROVEPENDING=Genehmigung ausstehend\r\n\r\n#XSEL: (legend)\r\nLR_PUBLICHOLIDAY=Feiertag\r\n\r\n#XSEL: (legend)\r\nLR_WORKINGDAY=Arbeitstag\r\n\r\n#XSEL: (legend)\r\nLR_DELETIONREQUESTED=Stornierung beantragt\r\n\r\n#XTIT\r\nLR_DELETION_REQ=Stornierungsantrag\r\n\r\n#XTIT\r\nLR_CHANGE_REQ=Antrag \\u00E4ndern\r\n\r\n#XTIT\r\nLR_CHANGE_PENDING=\\u00C4nderung ausstehend\r\n\r\n#XTIT\r\nLR_CANCEL_PENDING=Stornierung ausstehend\r\n\r\n#XTIT\r\nLR_CHANGE_DONE=Genehmigte Antr\\u00E4ge \\u00E4ndern\r\n\r\n#XTIT\r\nLR_CANCEL_DONE=Genehmigte Antr\\u00E4ge ablehnen\r\n\r\n#XTIT\r\nLR_OLD_VERSION=Original\r\n\r\n#XTIT\r\nLR_NEW_VERSION=Ge\\u00E4ndert\r\n',
	"hcm/emp/myleaverequests/i18n/i18n_en.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n#XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=My Leave Requests\r\n\r\n#XTIT: title of the home view\r\nLR_TITLE_HOME_VIEW=My Leave Requests\r\n\r\n#XTIT: title of the leave create view\r\nLR_TITLE_CREATE_VIEW=Request Leave\r\n\r\n#XTIT: title of the leave change view\r\nLR_TITLE_CHANGE_VIEW=Change Leave Request\r\n\r\n#XTIT: title of the Entitlements view\r\nLR_TITLE_BALANCE_VIEW=Entitlements\r\n\r\n#XTIT: title of the leave History view\r\nLR_TITLE_HISTORY_VIEW=History\r\n\r\n#XTIT: title of the leave details view\r\nLR_TITLE_DETAILS_VIEW=Leave Details\r\n\r\n#XTIT: title of the leave requests\r\nLR_TITLE_LEAVE_REQUESTS=Leave Requests\r\n\r\n#XTIT: title of the leave request\r\nLR_TITLE_LEAVE_REQUEST=Leave Request\r\n\r\n#XTIT: deductible\r\nLR_BALANCE_DEDUCTIBLE=Category\r\n\r\n#XTIT: Balance\r\nLR_BALANCE_BALANCE=Available\r\n\r\n#XTIT: Requested\r\nLR_BALANCE_REQUESTED=Requested\r\n\r\n#XTIT: Quota\r\nLR_BALANCE_QUOTA=Entitlements\r\n\r\n#XTIT: Entitlement\r\nLR_ENTITLEMENT_QUOTA=Entitlement\r\n\r\n#XTIT: Send leave request\r\nLR_TITLE_SEND=Send Leave Request\r\n\r\n#XTIT: Cancel leave request\r\nLR_TITLE_WITHDRAW=Withdraw Leave Request\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_BALANCE_TILE=Entitlements\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_HISTORY_TILE=History\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_CREATE_LEAVE_TILE=Create Leave Request\r\n\r\n#XBUT\r\nLR_SHOW_HIST=History\r\n\r\n#XBUT\r\nLR_CREATE_LEAVE=Request Leave\r\n\r\n#XBUT: text for "send leave request" button\r\nLR_SEND=Send\r\n\r\n#XBUT: text for ok button \r\nLR_OK=OK\r\n\r\n#XBUT: text for reset button \r\nLR_RESET=Reset\r\n\r\n#XBUT: text for cancel button e.g. on the day range picker screen\r\nLR_CANCEL=Cancel\r\n\r\n#XBUT: text for change button on the Leave Overview details screen\r\nLR_CHANGE=Change\r\n\r\n#XBUT: text for cancel button on the Leave Overview details screen\r\nLR_WITHDRAW=Withdraw\r\n\r\n#XSEL\r\nLR_UPDATED=Updated\r\n\r\n#XFLD\r\nLR_NOTE=Note\r\n\r\n#XFLD\r\nLR_CUSTOM1=Custom Field 1\r\n\r\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\r\nLR_BOOKED=used\r\n\r\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\r\nLR_REMAINING=available\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAYS=days\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAY=day\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOURS=Hours\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOUR=Hour\r\n\r\n#XFLD\r\nLR_UP_TO=Valid Until\r\n\r\n#XFLD\r\nLR_FROM=From\r\n\r\n#XFLD\r\nLR_TO=To\r\n\r\n#XFLD: Hyphen for Date Formatting\r\nLR_HYPHEN=-\r\n\r\n#XTIT: title of error dialog\r\nLR_PROBLEM=A Problem Occurred\r\n\r\n#XTIT: title of confirmation dialog\r\nLR_CONFIRMATION=Confirmation\r\n\r\n#YMSG\r\nLR_CONFIRMATIONMSG=Send this leave request to {0}?\r\n\r\n#YMSG\r\nLR_WITHDRAWNMSG=Do you want to withdraw this leave request?\r\n\r\n#XFLD\r\nLR_DAYS=Days\r\n\r\n#XFLD\r\nLR_DAY=Day\r\n\r\n#XFLD\r\nLR_HOURS=Hours\r\n\r\n#XFLD\r\nLR_HOUR=Hour\r\n\r\n#XFLD\r\nLR_REQUEST=Requested\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_TODAY=Today\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_SELECTED=Selected Day(s)\r\n\r\n#YMSG: processing\r\nLR_PROCESSING=Processing...\r\n\r\n#YMSG\r\nLR_SUBMITDONE=Your leave request was sent to {0}\r\n\r\n#YMSG\r\nLR_WITHDRAWDONE=Your leave request was withdrawn\r\n\r\n#YMSG\r\nLR_AX_MODEL_NOT_REG=A technical problem has occurred\\n\\nError Details\\:\\nInternal error; model not registered\r\n\r\n#YMSG\r\nLR_AX_PARSE_ERR=A technical problem has occurred\\n\\nError Details\\:\\nProtocol error; could not parse HTTP response\r\n\r\n#YMSG\r\nLR_DD_NO_APPROVER=A technical problem has occurred\\n\\nError Details\\:\\nProtocol error; approver name missing in response\r\n\r\n#YMSG\r\nLR_DD_NO_CFG=A technical problem has occurred\\n\\nError Details\\:\\nProtocol error; configuration missing in response\r\n\r\n#YMSG\r\nLR_DD_NO_BALANCES=A technical problem has occurred\\n\\nError Details\\:\\nProtocol error; balances missing in response\r\n\r\n#YMSG\r\nLR_DD_PARSE_ERR=A technical problem has occurred\\n\\nError Details\\:\\nProtocol error; could not parse response\r\n\r\n#YMSG\r\nLR_DD_COMM_ERR=A problem has occurred with your connection\r\n\r\n#YMSG\r\nLR_DD_GENERIC_ERR=An error has occurred\r\n\r\n#YMSG\r\nLR_CT_PARSE_ERR=A technical problem has occurred\\n\\nError Details\\:\\nProtocol error; could not parse response\r\n\r\n#XFLD\r\nLR_S1_PENDING=Pending\r\n\r\n#YMSG\r\nLR_UNKNOWN=Unknown\r\n\r\n#XSEL: (legend)\r\nLR_NONWORKING=Non-Workday\r\n\r\n#XSEL: (legend)\r\nLR_APPROVELEAVE=Approved\r\n\r\n#XSEL: (legend)\r\nLR_REJECTEDLEAVE=Rejected\r\n\r\n#XSEL: (legend)\r\nLR_APPROVEPENDING=Approval Pending\r\n\r\n#XSEL: (legend)\r\nLR_PUBLICHOLIDAY=Public Holiday\r\n\r\n#XSEL: (legend)\r\nLR_WORKINGDAY=Workday\r\n\r\n#XSEL: (legend)\r\nLR_DELETIONREQUESTED=Cancellation Requested\r\n\r\n#XTIT\r\nLR_DELETION_REQ=Cancellation Request\r\n\r\n#XTIT\r\nLR_CHANGE_REQ=Change Request\r\n\r\n#XTIT\r\nLR_CHANGE_PENDING=Change Pending\r\n\r\n#XTIT\r\nLR_CANCEL_PENDING=Cancellation Pending\r\n\r\n#XTIT\r\nLR_CHANGE_DONE=Change Approved\r\n\r\n#XTIT\r\nLR_CANCEL_DONE=Cancellation Approved\r\n\r\n#XTIT\r\nLR_OLD_VERSION=Original\r\n\r\n#XTIT\r\nLR_NEW_VERSION=Changed\r\n',
	"hcm/emp/myleaverequests/i18n/i18n_en_US.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n#XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=My Leave Requests\r\n\r\n#XTIT: title of the home view\r\nLR_TITLE_HOME_VIEW=My Leave Requests\r\n\r\n#XTIT: title of the leave create view\r\nLR_TITLE_CREATE_VIEW=Request Leave\r\n\r\n#XTIT: title of the leave change view\r\nLR_TITLE_CHANGE_VIEW=Change Leave Request\r\n\r\n#XTIT: title of the Entitlements view\r\nLR_TITLE_BALANCE_VIEW=Entitlements\r\n\r\n#XTIT: title of the leave History view\r\nLR_TITLE_HISTORY_VIEW=History\r\n\r\n#XTIT: title of the leave details view\r\nLR_TITLE_DETAILS_VIEW=Leave Details\r\n\r\n#XTIT: title of the leave requests\r\nLR_TITLE_LEAVE_REQUESTS=Leave Requests\r\n\r\n#XTIT: title of the leave request\r\nLR_TITLE_LEAVE_REQUEST=Leave Request\r\n\r\n#XTIT: deductible\r\nLR_BALANCE_DEDUCTIBLE=Category\r\n\r\n#XTIT: Balance\r\nLR_BALANCE_BALANCE=Available\r\n\r\n#XTIT: Requested\r\nLR_BALANCE_REQUESTED=Requested\r\n\r\n#XTIT: Quota\r\nLR_BALANCE_QUOTA=Entitlements\r\n\r\n#XTIT: Entitlement\r\nLR_ENTITLEMENT_QUOTA=Entitlement\r\n\r\n#XTIT: Send leave request\r\nLR_TITLE_SEND=Send Leave Request\r\n\r\n#XTIT: Cancel leave request\r\nLR_TITLE_WITHDRAW=Withdraw Leave Request\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_BALANCE_TILE=Entitlements \r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_HISTORY_TILE=History\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_CREATE_LEAVE_TILE=Create Leave Request\r\n\r\n#XBUT\r\nLR_SHOW_HIST=History\r\n\r\n#XBUT\r\nLR_CREATE_LEAVE=Request Leave\r\n\r\n#XBUT: text for "send leave request" button\r\nLR_SEND=Send\r\n\r\n#XBUT: text for ok button \r\nLR_OK=OK\r\n\r\n#XBUT: text for reset button \r\nLR_RESET=Reset\r\n\r\n#XBUT: text for cancel button e.g. on the day range picker screen\r\nLR_CANCEL=Cancel\r\n\r\n#XBUT: text for change button on the Leave Overview details screen\r\nLR_CHANGE=Change\r\n\r\n#XBUT: text for cancel button on the Leave Overview details screen\r\nLR_WITHDRAW=Withdraw\r\n\r\n#XSEL\r\nLR_UPDATED=Updated \r\n\r\n#XFLD\r\nLR_NOTE=Note\r\n\r\n#XFLD\r\nLR_CUSTOM1=Custom Field 1\r\n\r\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\r\nLR_BOOKED=used\r\n\r\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\r\nLR_REMAINING=available\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAYS=days\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAY=day\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOURS=hours\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOUR=hour\r\n\r\n#XFLD\r\nLR_UP_TO=Valid Upto\r\n\r\n#XFLD\r\nLR_FROM=From\r\n\r\n#XFLD\r\nLR_TO=To\r\n\r\n#XFLD: Hyphen for Date Formatting\r\nLR_HYPHEN=-\r\n\r\n#XTIT: title of error dialog\r\nLR_PROBLEM=A problem occurred\r\n\r\n#XTIT: title of confirmation dialog\r\nLR_CONFIRMATION=Confirmation\r\n\r\n#YMSG\r\nLR_CONFIRMATIONMSG=Do you want to send this leave request to {0}?\r\n\r\n#YMSG\r\nLR_WITHDRAWNMSG=Do you want to withdraw this leave request?\r\n\r\n#XFLD\r\nLR_DAYS=days\r\n\r\n#XFLD\r\nLR_DAY=day\r\n\r\n#XFLD\r\nLR_HOURS=hours\r\n\r\n#XFLD\r\nLR_HOUR=hour\r\n\r\n#XFLD\r\nLR_REQUEST=Requested\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_TODAY=Today\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_SELECTED=Selected Day(s)\r\n\r\n#YMSG: processing\r\nLR_PROCESSING=Processing...\r\n\r\n#YMSG\r\nLR_SUBMITDONE=Your leave request was sent to {0}\r\n\r\n#YMSG\r\nLR_WITHDRAWDONE=Your leave request was withdrawn\r\n\r\n#YMSG\r\nLR_AX_MODEL_NOT_REG=A technical problem has occurred\\n\\nError Details:\\nInternal error; model not registered\r\n\r\n#YMSG\r\nLR_AX_PARSE_ERR=A technical problem has occurred\\n\\nError Details:\\nProtocol error; could not parse HTTP response\r\n\r\n#YMSG\r\nLR_DD_NO_APPROVER=A technical problem has occurred\\n\\nError Details:\\nProtocol error; approver name missing in response\r\n\r\n#YMSG\r\nLR_DD_NO_CFG=A technical problem has occurred\\n\\nError Details:\\nProtocol error; configuration missing in response\r\n\r\n#YMSG\r\nLR_DD_NO_BALANCES=A technical problem has occurred\\n\\nError Details:\\nProtocol error; balances missing in response\r\n\r\n#YMSG\r\nLR_DD_PARSE_ERR=A technical problem has occurred\\n\\nError Details:\\nProtocol error; could not parse response\r\n\r\n#YMSG\r\nLR_DD_COMM_ERR=A problem has occurred with your connection\r\n\r\n#YMSG\r\nLR_DD_GENERIC_ERR=An error has occurred\r\n\r\n#YMSG\r\nLR_CT_PARSE_ERR=A technical problem has occurred\\n\\nError Details:\\nProtocol error; Could not parse response\r\n\r\n#XFLD\r\nLR_S1_PENDING:Pending\r\n\r\n#YMSG\r\nLR_UNKNOWN=Unknown\r\n\r\n#XSEL: (legend)\r\nLR_NONWORKING=Non-Working Day\r\n\r\n#XSEL: (legend)\r\nLR_APPROVELEAVE=Approved \r\n\r\n#XSEL: (legend)\r\nLR_REJECTEDLEAVE=Rejected \r\n\r\n#XSEL: (legend)\r\nLR_APPROVEPENDING=Approval Pending\r\n\r\n#XSEL: (legend)\r\nLR_PUBLICHOLIDAY=Public Holiday\r\n\r\n#XSEL: (legend)\r\nLR_WORKINGDAY=Working Day\r\n\r\n#XSEL: (legend)\r\nLR_DELETIONREQUESTED=Cancellation Requested\r\n\r\n#XTIT\r\nLR_DELETION_REQ=Cancellation Request\r\n\r\n#XTIT\r\nLR_CHANGE_REQ=Change Request\r\n\r\n#XTIT\r\nLR_CHANGE_PENDING=Change Pending\r\n\r\n#XTIT\r\nLR_CANCEL_PENDING=Cancellation Pending\r\n\r\n#XTIT\r\nLR_CHANGE_DONE=Change Approved\r\n\r\n#XTIT\r\nLR_CANCEL_DONE=Cancellation Approved\r\n\r\n#XTIT\r\nLR_OLD_VERSION=Original\r\n\r\n#XTIT\r\nLR_NEW_VERSION=Changed\r\n',
	"hcm/emp/myleaverequests/i18n/i18n_en_US_sappsd.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n#XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=[[[\\u039C\\u0177 \\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u015F]]]\r\n\r\n#XTIT: title of the home view\r\nLR_TITLE_HOME_VIEW=[[[\\u039C\\u0177 \\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u015F]]]\r\n\r\n#XTIT: title of the leave create view\r\nLR_TITLE_CREATE_VIEW=[[[\\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u013B\\u0113\\u0105\\u028B\\u0113]]]\r\n\r\n#XTIT: title of the leave change view\r\nLR_TITLE_CHANGE_VIEW=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113 \\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163]]]\r\n\r\n#XTIT: title of the Entitlements view\r\nLR_TITLE_BALANCE_VIEW=[[[\\u0114\\u014B\\u0163\\u012F\\u0163\\u013A\\u0113\\u0271\\u0113\\u014B\\u0163\\u015F]]]\r\n\r\n#XTIT: title of the leave History view\r\nLR_TITLE_HISTORY_VIEW=[[[\\u0124\\u012F\\u015F\\u0163\\u014F\\u0157\\u0177]]]\r\n\r\n#XTIT: title of the leave details view\r\nLR_TITLE_DETAILS_VIEW=[[[\\u013B\\u0113\\u0105\\u028B\\u0113 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F]]]\r\n\r\n#XTIT: title of the leave requests\r\nLR_TITLE_LEAVE_REQUESTS=[[[\\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u015F]]]\r\n\r\n#XTIT: title of the leave request\r\nLR_TITLE_LEAVE_REQUEST=[[[\\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163]]]\r\n\r\n#XTIT: deductible\r\nLR_BALANCE_DEDUCTIBLE=[[[\\u0108\\u0105\\u0163\\u0113\\u011F\\u014F\\u0157\\u0177]]]\r\n\r\n#XTIT: Balance\r\nLR_BALANCE_BALANCE=[[[\\u1000\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113]]]\r\n\r\n#XTIT: Requested\r\nLR_BALANCE_REQUESTED=[[[\\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u0113\\u018C]]]\r\n\r\n#XTIT: Quota\r\nLR_BALANCE_QUOTA=[[[\\u0114\\u014B\\u0163\\u012F\\u0163\\u013A\\u0113\\u0271\\u0113\\u014B\\u0163\\u015F]]]\r\n\r\n#XTIT: Entitlement\r\nLR_ENTITLEMENT_QUOTA=[[[\\u0114\\u014B\\u0163\\u012F\\u0163\\u013A\\u0113\\u0271\\u0113\\u014B\\u0163]]]\r\n\r\n#XTIT: Send leave request\r\nLR_TITLE_SEND=[[[\\u015C\\u0113\\u014B\\u018C \\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163]]]\r\n\r\n#XTIT: Cancel leave request\r\nLR_TITLE_WITHDRAW=[[[\\u0174\\u012F\\u0163\\u0125\\u018C\\u0157\\u0105\\u0175 \\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163]]]\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_BALANCE_TILE=[[[\\u0114\\u014B\\u0163\\u012F\\u0163\\u013A\\u0113\\u0271\\u0113\\u014B\\u0163\\u015F ]]]\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_HISTORY_TILE=[[[\\u0124\\u012F\\u015F\\u0163\\u014F\\u0157\\u0177]]]\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_CREATE_LEAVE_TILE=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113 \\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163]]]\r\n\r\n#XBUT\r\nLR_SHOW_HIST=[[[\\u0124\\u012F\\u015F\\u0163\\u014F\\u0157\\u0177]]]\r\n\r\n#XBUT\r\nLR_CREATE_LEAVE=[[[\\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u013B\\u0113\\u0105\\u028B\\u0113]]]\r\n\r\n#XBUT: text for "send leave request" button\r\nLR_SEND=[[[\\u015C\\u0113\\u014B\\u018C]]]\r\n\r\n#XBUT: text for ok button \r\nLR_OK=[[[\\u014E\\u0136]]]\r\n\r\n#XBUT: text for reset button \r\nLR_RESET=[[[\\u0158\\u0113\\u015F\\u0113\\u0163]]]\r\n\r\n#XBUT: text for cancel button e.g. on the day range picker screen\r\nLR_CANCEL=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A]]]\r\n\r\n#XBUT: text for change button on the Leave Overview details screen\r\nLR_CHANGE=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113]]]\r\n\r\n#XBUT: text for cancel button on the Leave Overview details screen\r\nLR_WITHDRAW=[[[\\u0174\\u012F\\u0163\\u0125\\u018C\\u0157\\u0105\\u0175]]]\r\n\r\n#XSEL\r\nLR_UPDATED=[[[\\u016E\\u03C1\\u018C\\u0105\\u0163\\u0113\\u018C ]]]\r\n\r\n#XFLD\r\nLR_NOTE=[[[\\u0143\\u014F\\u0163\\u0113]]]\r\n\r\n#XFLD\r\nLR_CUSTOM1=[[[\\u0108\\u0171\\u015F\\u0163\\u014F\\u0271 \\u0191\\u012F\\u0113\\u013A\\u018C 1]]]\r\n\r\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\r\nLR_BOOKED=[[[\\u0171\\u015F\\u0113\\u018C]]]\r\n\r\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\r\nLR_REMAINING=[[[\\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113]]]\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAYS=[[[\\u018C\\u0105\\u0177\\u015F]]]\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAY=[[[\\u018C\\u0105\\u0177]]]\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOURS=[[[\\u0125\\u014F\\u0171\\u0157\\u015F]]]\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOUR=[[[\\u0125\\u014F\\u0171\\u0157]]]\r\n\r\n#XFLD\r\nLR_UP_TO=[[[\\u01B2\\u0105\\u013A\\u012F\\u018C \\u016E\\u03C1\\u0163\\u014F]]]\r\n\r\n#XFLD\r\nLR_FROM=[[[\\u0191\\u0157\\u014F\\u0271]]]\r\n\r\n#XFLD\r\nLR_TO=[[[\\u0162\\u014F]]]\r\n\r\n#XFLD: Hyphen for Date Formatting\r\nLR_HYPHEN=[[[-]]]\r\n\r\n#XTIT: title of error dialog\r\nLR_PROBLEM=[[[\\u1000 \\u03C1\\u0157\\u014F\\u0183\\u013A\\u0113\\u0271 \\u014F\\u010B\\u010B\\u0171\\u0157\\u0157\\u0113\\u018C]]]\r\n\r\n#XTIT: title of confirmation dialog\r\nLR_CONFIRMATION=[[[\\u0108\\u014F\\u014B\\u0192\\u012F\\u0157\\u0271\\u0105\\u0163\\u012F\\u014F\\u014B]]]\r\n\r\n#YMSG\r\nLR_CONFIRMATIONMSG=[[[\\u010E\\u014F \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u015F\\u0113\\u014B\\u018C \\u0163\\u0125\\u012F\\u015F \\u013A\\u0113\\u0105\\u028B\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u0163\\u014F {0}?]]]\r\n\r\n#YMSG\r\nLR_WITHDRAWNMSG=[[[\\u010E\\u014F \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u0175\\u012F\\u0163\\u0125\\u018C\\u0157\\u0105\\u0175 \\u0163\\u0125\\u012F\\u015F \\u013A\\u0113\\u0105\\u028B\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163?]]]\r\n\r\n#XFLD\r\nLR_DAYS=[[[\\u018C\\u0105\\u0177\\u015F]]]\r\n\r\n#XFLD\r\nLR_DAY=[[[\\u018C\\u0105\\u0177]]]\r\n\r\n#XFLD\r\nLR_HOURS=[[[\\u0125\\u014F\\u0171\\u0157\\u015F]]]\r\n\r\n#XFLD\r\nLR_HOUR=[[[\\u0125\\u014F\\u0171\\u0157]]]\r\n\r\n#XFLD\r\nLR_REQUEST=[[[\\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u0113\\u018C]]]\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_TODAY=[[[\\u0162\\u014F\\u018C\\u0105\\u0177]]]\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_SELECTED=[[[\\u015C\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C \\u010E\\u0105\\u0177(\\u015F)]]]\r\n\r\n#YMSG: processing\r\nLR_PROCESSING=[[[\\u01A4\\u0157\\u014F\\u010B\\u0113\\u015F\\u015F\\u012F\\u014B\\u011F...]]]\r\n\r\n#YMSG\r\nLR_SUBMITDONE=[[[\\u0176\\u014F\\u0171\\u0157 \\u013A\\u0113\\u0105\\u028B\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u0175\\u0105\\u015F \\u015F\\u0113\\u014B\\u0163 \\u0163\\u014F ]]]{0}\r\n\r\n#YMSG\r\nLR_WITHDRAWDONE=[[[\\u0176\\u014F\\u0171\\u0157 \\u013A\\u0113\\u0105\\u028B\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u0175\\u0105\\u015F \\u0175\\u012F\\u0163\\u0125\\u018C\\u0157\\u0105\\u0175\\u014B]]]\r\n\r\n#YMSG\r\nLR_AX_MODEL_NOT_REG=[[[\\u1000 \\u0163\\u0113\\u010B\\u0125\\u014B\\u012F\\u010B\\u0105\\u013A \\u03C1\\u0157\\u014F\\u0183\\u013A\\u0113\\u0271 \\u0125\\u0105\\u015F \\u014F\\u010B\\u010B\\u0171\\u0157\\u0157\\u0113\\u018C\\n\\n\\u0114\\u0157\\u0157\\u014F\\u0157 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F\\:\\n\\u012C\\u014B\\u0163\\u0113\\u0157\\u014B\\u0105\\u013A \\u0113\\u0157\\u0157\\u014F\\u0157; \\u0271\\u014F\\u018C\\u0113\\u013A \\u014B\\u014F\\u0163 \\u0157\\u0113\\u011F\\u012F\\u015F\\u0163\\u0113\\u0157\\u0113\\u018C]]]\r\n\r\n#YMSG\r\nLR_AX_PARSE_ERR=[[[\\u1000 \\u0163\\u0113\\u010B\\u0125\\u014B\\u012F\\u010B\\u0105\\u013A \\u03C1\\u0157\\u014F\\u0183\\u013A\\u0113\\u0271 \\u0125\\u0105\\u015F \\u014F\\u010B\\u010B\\u0171\\u0157\\u0157\\u0113\\u018C\\n\\n\\u0114\\u0157\\u0157\\u014F\\u0157 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F\\:\\n\\u01A4\\u0157\\u014F\\u0163\\u014F\\u010B\\u014F\\u013A \\u0113\\u0157\\u0157\\u014F\\u0157; \\u010B\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u03C1\\u0105\\u0157\\u015F\\u0113 \\u0124\\u0162\\u0162\\u01A4 \\u0157\\u0113\\u015F\\u03C1\\u014F\\u014B\\u015F\\u0113]]]\r\n\r\n#YMSG\r\nLR_DD_NO_APPROVER=[[[\\u1000 \\u0163\\u0113\\u010B\\u0125\\u014B\\u012F\\u010B\\u0105\\u013A \\u03C1\\u0157\\u014F\\u0183\\u013A\\u0113\\u0271 \\u0125\\u0105\\u015F \\u014F\\u010B\\u010B\\u0171\\u0157\\u0157\\u0113\\u018C\\n\\n\\u0114\\u0157\\u0157\\u014F\\u0157 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F\\:\\n\\u01A4\\u0157\\u014F\\u0163\\u014F\\u010B\\u014F\\u013A \\u0113\\u0157\\u0157\\u014F\\u0157; \\u0105\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u0157 \\u014B\\u0105\\u0271\\u0113 \\u0271\\u012F\\u015F\\u015F\\u012F\\u014B\\u011F \\u012F\\u014B \\u0157\\u0113\\u015F\\u03C1\\u014F\\u014B\\u015F\\u0113]]]\r\n\r\n#YMSG\r\nLR_DD_NO_CFG=[[[\\u1000 \\u0163\\u0113\\u010B\\u0125\\u014B\\u012F\\u010B\\u0105\\u013A \\u03C1\\u0157\\u014F\\u0183\\u013A\\u0113\\u0271 \\u0125\\u0105\\u015F \\u014F\\u010B\\u010B\\u0171\\u0157\\u0157\\u0113\\u018C\\n\\n\\u0114\\u0157\\u0157\\u014F\\u0157 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F\\:\\n\\u01A4\\u0157\\u014F\\u0163\\u014F\\u010B\\u014F\\u013A \\u0113\\u0157\\u0157\\u014F\\u0157; \\u010B\\u014F\\u014B\\u0192\\u012F\\u011F\\u0171\\u0157\\u0105\\u0163\\u012F\\u014F\\u014B \\u0271\\u012F\\u015F\\u015F\\u012F\\u014B\\u011F \\u012F\\u014B \\u0157\\u0113\\u015F\\u03C1\\u014F\\u014B\\u015F\\u0113]]]\r\n\r\n#YMSG\r\nLR_DD_NO_BALANCES=[[[\\u1000 \\u0163\\u0113\\u010B\\u0125\\u014B\\u012F\\u010B\\u0105\\u013A \\u03C1\\u0157\\u014F\\u0183\\u013A\\u0113\\u0271 \\u0125\\u0105\\u015F \\u014F\\u010B\\u010B\\u0171\\u0157\\u0157\\u0113\\u018C\\n\\n\\u0114\\u0157\\u0157\\u014F\\u0157 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F\\:\\n\\u01A4\\u0157\\u014F\\u0163\\u014F\\u010B\\u014F\\u013A \\u0113\\u0157\\u0157\\u014F\\u0157; \\u0183\\u0105\\u013A\\u0105\\u014B\\u010B\\u0113\\u015F \\u0271\\u012F\\u015F\\u015F\\u012F\\u014B\\u011F \\u012F\\u014B \\u0157\\u0113\\u015F\\u03C1\\u014F\\u014B\\u015F\\u0113]]]\r\n\r\n#YMSG\r\nLR_DD_PARSE_ERR=[[[\\u1000 \\u0163\\u0113\\u010B\\u0125\\u014B\\u012F\\u010B\\u0105\\u013A \\u03C1\\u0157\\u014F\\u0183\\u013A\\u0113\\u0271 \\u0125\\u0105\\u015F \\u014F\\u010B\\u010B\\u0171\\u0157\\u0157\\u0113\\u018C\\n\\n\\u0114\\u0157\\u0157\\u014F\\u0157 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F\\:\\n\\u01A4\\u0157\\u014F\\u0163\\u014F\\u010B\\u014F\\u013A \\u0113\\u0157\\u0157\\u014F\\u0157; \\u010B\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u03C1\\u0105\\u0157\\u015F\\u0113 \\u0157\\u0113\\u015F\\u03C1\\u014F\\u014B\\u015F\\u0113]]]\r\n\r\n#YMSG\r\nLR_DD_COMM_ERR=[[[\\u1000 \\u03C1\\u0157\\u014F\\u0183\\u013A\\u0113\\u0271 \\u0125\\u0105\\u015F \\u014F\\u010B\\u010B\\u0171\\u0157\\u0157\\u0113\\u018C \\u0175\\u012F\\u0163\\u0125 \\u0177\\u014F\\u0171\\u0157 \\u010B\\u014F\\u014B\\u014B\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B]]]\r\n\r\n#YMSG\r\nLR_DD_GENERIC_ERR=[[[\\u1000\\u014B \\u0113\\u0157\\u0157\\u014F\\u0157 \\u0125\\u0105\\u015F \\u014F\\u010B\\u010B\\u0171\\u0157\\u0157\\u0113\\u018C]]]\r\n\r\n#YMSG\r\nLR_CT_PARSE_ERR=[[[\\u1000 \\u0163\\u0113\\u010B\\u0125\\u014B\\u012F\\u010B\\u0105\\u013A \\u03C1\\u0157\\u014F\\u0183\\u013A\\u0113\\u0271 \\u0125\\u0105\\u015F \\u014F\\u010B\\u010B\\u0171\\u0157\\u0157\\u0113\\u018C\\n\\n\\u0114\\u0157\\u0157\\u014F\\u0157 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F\\:\\n\\u01A4\\u0157\\u014F\\u0163\\u014F\\u010B\\u014F\\u013A \\u0113\\u0157\\u0157\\u014F\\u0157; \\u0108\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u03C1\\u0105\\u0157\\u015F\\u0113 \\u0157\\u0113\\u015F\\u03C1\\u014F\\u014B\\u015F\\u0113]]]\r\n\r\n#XFLD\r\nLR_S1_PENDING=[[[\\u01A4\\u0113\\u014B\\u018C\\u012F\\u014B\\u011F]]]\r\n\r\n#YMSG\r\nLR_UNKNOWN=[[[\\u016E\\u014B\\u0137\\u014B\\u014F\\u0175\\u014B]]]\r\n\r\n#XSEL: (legend)\r\nLR_NONWORKING=[[[\\u0143\\u014F\\u014B-\\u0174\\u014F\\u0157\\u0137\\u012F\\u014B\\u011F \\u010E\\u0105\\u0177]]]\r\n\r\n#XSEL: (legend)\r\nLR_APPROVELEAVE=[[[\\u1000\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u018C]]]\r\n\r\n#XSEL: (legend)\r\nLR_REJECTEDLEAVE=[[[\\u0158\\u0113\\u0135\\u0113\\u010B\\u0163\\u0113\\u018C ]]]\r\n\r\n#XSEL: (legend)\r\nLR_APPROVEPENDING=[[[\\u1000\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0105\\u013A \\u01A4\\u0113\\u014B\\u018C\\u012F\\u014B\\u011F]]]\r\n\r\n#XSEL: (legend)\r\nLR_PUBLICHOLIDAY=[[[\\u01A4\\u0171\\u0183\\u013A\\u012F\\u010B \\u0124\\u014F\\u013A\\u012F\\u018C\\u0105\\u0177]]]\r\n\r\n#XSEL: (legend)\r\nLR_WORKINGDAY=[[[\\u0174\\u014F\\u0157\\u0137\\u012F\\u014B\\u011F \\u010E\\u0105\\u0177]]]\r\n\r\n#XSEL: (legend)\r\nLR_DELETIONREQUESTED=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u013A\\u0105\\u0163\\u012F\\u014F\\u014B \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u0113\\u018C]]]\r\n\r\n#XTIT\r\nLR_DELETION_REQ=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u013A\\u0105\\u0163\\u012F\\u014F\\u014B \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163]]]\r\n\r\n#XTIT\r\nLR_CHANGE_REQ=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163]]]\r\n\r\n#XTIT\r\nLR_CHANGE_PENDING=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113 \\u01A4\\u0113\\u014B\\u018C\\u012F\\u014B\\u011F]]]\r\n\r\n#XTIT\r\nLR_CANCEL_PENDING=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u013A\\u0105\\u0163\\u012F\\u014F\\u014B \\u01A4\\u0113\\u014B\\u018C\\u012F\\u014B\\u011F]]]\r\n\r\n#XTIT\r\nLR_CHANGE_DONE=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113 \\u1000\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u018C]]]\r\n\r\n#XTIT\r\nLR_CANCEL_DONE=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u013A\\u0105\\u0163\\u012F\\u014F\\u014B \\u1000\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u018C]]]\r\n\r\n#XTIT\r\nLR_OLD_VERSION=[[[\\u014E\\u0157\\u012F\\u011F\\u012F\\u014B\\u0105\\u013A]]]\r\n\r\n#XTIT\r\nLR_NEW_VERSION=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113\\u018C]]]\r\n',
	"hcm/emp/myleaverequests/i18n/i18n_en_US_saptrc.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n#XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=Dn66f+SLP/sX3JFLUrZVSA_My Leave Requests\r\n\r\n#XTIT: title of the home view\r\nLR_TITLE_HOME_VIEW=p8/2VlCZVGi58tIhmRQX0A_My Leave Requests\r\n\r\n#XTIT: title of the leave create view\r\nLR_TITLE_CREATE_VIEW=GtMzGnNREDOzyr9J5hlGdA_Request Leave\r\n\r\n#XTIT: title of the leave change view\r\nLR_TITLE_CHANGE_VIEW=LOOk2eSidFOH5KlW5ZHbCg_Change Leave Request\r\n\r\n#XTIT: title of the Entitlements view\r\nLR_TITLE_BALANCE_VIEW=1Qt6ySmoyU7hk1YVls8YOg_Entitlements\r\n\r\n#XTIT: title of the leave History view\r\nLR_TITLE_HISTORY_VIEW=W5dpk2KGHSmi7BjPl5gHig_History\r\n\r\n#XTIT: title of the leave details view\r\nLR_TITLE_DETAILS_VIEW=u/CC4B43ua+EWehqJIqqlA_Leave Details\r\n\r\n#XTIT: title of the leave requests\r\nLR_TITLE_LEAVE_REQUESTS=FW6dawe9AcPfqxSr0a3c9w_Leave Requests\r\n\r\n#XTIT: title of the leave request\r\nLR_TITLE_LEAVE_REQUEST=W3h4GDmfvui4HDcnwNhocw_Leave Request\r\n\r\n#XTIT: deductible\r\nLR_BALANCE_DEDUCTIBLE=EAa3fs3NCfygIcE701KWIw_Category\r\n\r\n#XTIT: Balance\r\nLR_BALANCE_BALANCE=yiBap2wKQgurExDxf9bnNg_Available\r\n\r\n#XTIT: Requested\r\nLR_BALANCE_REQUESTED=NHQQnXSYyHMiN+wW/I8DLg_Requested\r\n\r\n#XTIT: Quota\r\nLR_BALANCE_QUOTA=C1TObtyQ3HwSpV/M2eyLvA_Entitlements\r\n\r\n#XTIT: Entitlement\r\nLR_ENTITLEMENT_QUOTA=A7sYLGTNqxIWOxcNwGfI4w_Entitlement\r\n\r\n#XTIT: Send leave request\r\nLR_TITLE_SEND=AmFG8/piAOtah1jeFStdpQ_Send Leave Request\r\n\r\n#XTIT: Cancel leave request\r\nLR_TITLE_WITHDRAW=MkQkeMnfffXdMy0QJsZN+A_Withdraw Leave Request\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_BALANCE_TILE=ve2/yJ0PXTL4y/vGOQo5CA_Entitlements \r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_HISTORY_TILE=Yrm2PASETHKO123vyA0k8A_History\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_CREATE_LEAVE_TILE=Q6ZDgggDjw6cW6ljO4AP/g_Create Leave Request\r\n\r\n#XBUT\r\nLR_SHOW_HIST=tSGM/4+QLYF/ZO5Spd5BWg_History\r\n\r\n#XBUT\r\nLR_CREATE_LEAVE=HIE0xzZEybUdFdr6YwcWmw_Request Leave\r\n\r\n#XBUT: text for "send leave request" button\r\nLR_SEND=SJfoE0I293Y8/m62TheioQ_Send\r\n\r\n#XBUT: text for ok button \r\nLR_OK=OmV9P8PwoGYHDPYmlrTV6w_OK\r\n\r\n#XBUT: text for reset button \r\nLR_RESET=6FaOmquvSxaoMWGK9t1iRw_Reset\r\n\r\n#XBUT: text for cancel button e.g. on the day range picker screen\r\nLR_CANCEL=z0V4+waWBnRuhrB38vptCQ_Cancel\r\n\r\n#XBUT: text for change button on the Leave Overview details screen\r\nLR_CHANGE=YejEN1y6jyHoNLIJyfZqtQ_Change\r\n\r\n#XBUT: text for cancel button on the Leave Overview details screen\r\nLR_WITHDRAW=hDFB9u9TwUc/creu8FJn3Q_Withdraw\r\n\r\n#XSEL\r\nLR_UPDATED=LUAwDyZs+lJYlg1UvcR7nw_Updated \r\n\r\n#XFLD\r\nLR_NOTE=CNFBbcUR0d59feqb8t75Ow_Note\r\n\r\n#XFLD\r\nLR_CUSTOM1=2N4bCPdd9ELFnTMAfhQpdA_Custom Field 1\r\n\r\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\r\nLR_BOOKED=xZR31BkEDWBsStjSVaUfFQ_used\r\n\r\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\r\nLR_REMAINING=VcNRmhDGjMaOu3u92/zOdg_available\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAYS=GnZfnnFxKMOSsASgHg9+Mg_days\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAY=EkO6CKpVVm6EHLMWvrymrw_day\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOURS=/kGQeajELrY4JLZoVFVsHw_hours\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOUR=YTBXNrVvV/O8miENHeShyg_hour\r\n\r\n#XFLD\r\nLR_UP_TO=v2eNLzIhrQVerTXvAftI3A_Valid Upto\r\n\r\n#XFLD\r\nLR_FROM=7UFvh8fmppeWTooeyME1Aw_From\r\n\r\n#XFLD\r\nLR_TO=ONqNYBTOe6wbeEKQxi9tDA_To\r\n\r\n#XFLD: Hyphen for Date Formatting\r\nLR_HYPHEN=W1gYYECz5y1sN1xfjTo3bQ_-\r\n\r\n#XTIT: title of error dialog\r\nLR_PROBLEM=JPf8/zEAcgHln7tukuUpwQ_A problem occurred\r\n\r\n#XTIT: title of confirmation dialog\r\nLR_CONFIRMATION=r7quBg2ux9b6LcaSApvLFQ_Confirmation\r\n\r\n#YMSG\r\nLR_CONFIRMATIONMSG=UOFzs0X/1naxFIM5vI+Azw_Do you want to send this leave request to {0}?\r\n\r\n#YMSG\r\nLR_WITHDRAWNMSG=DwtLlJi0rT3uhthjK4WkwQ_Do you want to withdraw this leave request?\r\n\r\n#XFLD\r\nLR_DAYS=Azqt0+aevGW24i2XslhbsQ_days\r\n\r\n#XFLD\r\nLR_DAY=3eleuqXpQLUBgsRZHgUAyQ_day\r\n\r\n#XFLD\r\nLR_HOURS=6cGNkOD1L6f4gxuO+DONKg_hours\r\n\r\n#XFLD\r\nLR_HOUR=Mcg4K9FbDrr0Q8R3qONwKQ_hour\r\n\r\n#XFLD\r\nLR_REQUEST=5Qb/8aVQcO342yxiQ+pUeQ_Requested\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_TODAY=cIbYFwCaFpm4q7SeR+jxbA_Today\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_SELECTED=qMFjF8t3UoA2cblEMlBhhA_Selected Day(s)\r\n\r\n#YMSG: processing\r\nLR_PROCESSING=1ccI/W1JfzD8S0DRhYA4dA_Processing...\r\n\r\n#YMSG\r\nLR_SUBMITDONE=MRnnH/qQF2FodmbxMjJ66w_Your leave request was sent to {0}\r\n\r\n#YMSG\r\nLR_WITHDRAWDONE=8atjqZcYwuJDSeftaYXwcw_Your leave request was withdrawn\r\n\r\n#YMSG\r\nLR_AX_MODEL_NOT_REG=RtYBEnO3N3InFYYkI6ge2A_A technical problem has occurred\\n\\nError Details\\:\\nInternal error; model not registered\r\n\r\n#YMSG\r\nLR_AX_PARSE_ERR=W+j3Toj8p7ADKp7iEmTc0Q_A technical problem has occurred\\n\\nError Details\\:\\nProtocol error; could not parse HTTP response\r\n\r\n#YMSG\r\nLR_DD_NO_APPROVER=3DPUdt5ez+pBps8eMmpiKQ_A technical problem has occurred\\n\\nError Details\\:\\nProtocol error; approver name missing in response\r\n\r\n#YMSG\r\nLR_DD_NO_CFG=O6ZBimLLoB9mDqbiT9t5eg_A technical problem has occurred\\n\\nError Details\\:\\nProtocol error; configuration missing in response\r\n\r\n#YMSG\r\nLR_DD_NO_BALANCES=YWFgm9ebjIOsxJnnX/CNXQ_A technical problem has occurred\\n\\nError Details\\:\\nProtocol error; balances missing in response\r\n\r\n#YMSG\r\nLR_DD_PARSE_ERR=IJ15OZYDXK85MVSODP+VQQ_A technical problem has occurred\\n\\nError Details\\:\\nProtocol error; could not parse response\r\n\r\n#YMSG\r\nLR_DD_COMM_ERR=+5Gc9Lyp5NiKAicbdoXy7Q_A problem has occurred with your connection\r\n\r\n#YMSG\r\nLR_DD_GENERIC_ERR=mb4iYPlH2gI8WNI58Vkzqg_An error has occurred\r\n\r\n#YMSG\r\nLR_CT_PARSE_ERR=9+PD6l5K/znrYWlrYI+DRA_A technical problem has occurred\\n\\nError Details\\:\\nProtocol error; Could not parse response\r\n\r\n#XFLD\r\nLR_S1_PENDING=4dLoayKce0R/UOmlZ++RqQ_Pending\r\n\r\n#YMSG\r\nLR_UNKNOWN=txRJWIQBspguwWwu4+j8Dw_Unknown\r\n\r\n#XSEL: (legend)\r\nLR_NONWORKING=jC07AKhzAfLBYYU4PEnQlA_Non-Working Day\r\n\r\n#XSEL: (legend)\r\nLR_APPROVELEAVE=YLlPIqJvb+maDbianScKVg_Approved\r\n\r\n#XSEL: (legend)\r\nLR_REJECTEDLEAVE=JypTzdOAAoE8Ghtr9WT/gg_Rejected \r\n\r\n#XSEL: (legend)\r\nLR_APPROVEPENDING=HGqX6vRJRPY7SAg1kou42A_Approval Pending\r\n\r\n#XSEL: (legend)\r\nLR_PUBLICHOLIDAY=wG/W5iLbpWJRFaxS8HlADw_Public Holiday\r\n\r\n#XSEL: (legend)\r\nLR_WORKINGDAY=6sfTlRtb7/JN3c7XuNNFow_Working Day\r\n\r\n#XSEL: (legend)\r\nLR_DELETIONREQUESTED=Cdkqc1mJpgQeSIdcqgjkXA_Cancellation Requested\r\n\r\n#XTIT\r\nLR_DELETION_REQ=+tctnn6KnO63IY29b7F8oA_Cancellation Request\r\n\r\n#XTIT\r\nLR_CHANGE_REQ=cjglN2lY1TRyD/9KGJd2Ug_Change Request\r\n\r\n#XTIT\r\nLR_CHANGE_PENDING=qNpk5AoS6ddmwDuca60ADA_Change Pending\r\n\r\n#XTIT\r\nLR_CANCEL_PENDING=msJZ5669twLIZKQZXPvSag_Cancellation Pending\r\n\r\n#XTIT\r\nLR_CHANGE_DONE=TPCvaiehXbOfVlbGBz6O7A_Change Approved\r\n\r\n#XTIT\r\nLR_CANCEL_DONE=XxBKhmNAYozzYZxA7MsLpA_Cancellation Approved\r\n\r\n#XTIT\r\nLR_OLD_VERSION=5YCaUogmIeXmSaR7R5O5rg_Original\r\n\r\n#XTIT\r\nLR_NEW_VERSION=959j4fjSrt1f09P06TRYjw_Changed\r\n',
	"hcm/emp/myleaverequests/i18n/i18n_es.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n#XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=Solicitud de ausencia\r\n\r\n#XTIT: title of the home view\r\nLR_TITLE_HOME_VIEW=Solicitud de ausencia\r\n\r\n#XTIT: title of the leave create view\r\nLR_TITLE_CREATE_VIEW=Solicitar ausencia\r\n\r\n#XTIT: title of the leave change view\r\nLR_TITLE_CHANGE_VIEW=Modificar solicitud de ausencia\r\n\r\n#XTIT: title of the Entitlements view\r\nLR_TITLE_BALANCE_VIEW=Derechos\r\n\r\n#XTIT: title of the leave History view\r\nLR_TITLE_HISTORY_VIEW=Historial\r\n\r\n#XTIT: title of the leave details view\r\nLR_TITLE_DETAILS_VIEW=Detalles de la ausencia\r\n\r\n#XTIT: title of the leave requests\r\nLR_TITLE_LEAVE_REQUESTS=Solicitudes de ausencia\r\n\r\n#XTIT: title of the leave request\r\nLR_TITLE_LEAVE_REQUEST=Solicitud de ausencia\r\n\r\n#XTIT: deductible\r\nLR_BALANCE_DEDUCTIBLE=Categor\\u00EDa\r\n\r\n#XTIT: Balance\r\nLR_BALANCE_BALANCE=Disponible\r\n\r\n#XTIT: Requested\r\nLR_BALANCE_REQUESTED=Solicitada\r\n\r\n#XTIT: Quota\r\nLR_BALANCE_QUOTA=Derechos\r\n\r\n#XTIT: Entitlement\r\nLR_ENTITLEMENT_QUOTA=Derecho\r\n\r\n#XTIT: Send leave request\r\nLR_TITLE_SEND=Enviar solicitud de ausencia\r\n\r\n#XTIT: Cancel leave request\r\nLR_TITLE_WITHDRAW=Anular solicitud de ausencia\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_BALANCE_TILE=Derechos\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_HISTORY_TILE=Historial\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_CREATE_LEAVE_TILE=Crear solicitud de ausencia\r\n\r\n#XBUT\r\nLR_SHOW_HIST=Historial\r\n\r\n#XBUT\r\nLR_CREATE_LEAVE=Solicitar ausencia\r\n\r\n#XBUT: text for "send leave request" button\r\nLR_SEND=Enviar\r\n\r\n#XBUT: text for ok button \r\nLR_OK=OK\r\n\r\n#XBUT: text for reset button \r\nLR_RESET=Reinicializar\r\n\r\n#XBUT: text for cancel button e.g. on the day range picker screen\r\nLR_CANCEL=Cancelar\r\n\r\n#XBUT: text for change button on the Leave Overview details screen\r\nLR_CHANGE=Cambiar\r\n\r\n#XBUT: text for cancel button on the Leave Overview details screen\r\nLR_WITHDRAW=Anular\r\n\r\n#XSEL\r\nLR_UPDATED=Actualizada\r\n\r\n#XFLD\r\nLR_NOTE=Nota\r\n\r\n#XFLD\r\nLR_CUSTOM1=Campo personalizado 1\r\n\r\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\r\nLR_BOOKED=utilizados\r\n\r\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\r\nLR_REMAINING=disponibles\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAYS=d\\u00EDas\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAY=d\\u00EDa\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOURS=horas\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOUR=Hora\r\n\r\n#XFLD\r\nLR_UP_TO=V\\u00E1lido hasta\r\n\r\n#XFLD\r\nLR_FROM=De\r\n\r\n#XFLD\r\nLR_TO=A\r\n\r\n#XFLD: Hyphen for Date Formatting\r\nLR_HYPHEN=-\r\n\r\n#XTIT: title of error dialog\r\nLR_PROBLEM=Se ha producido un problema\r\n\r\n#XTIT: title of confirmation dialog\r\nLR_CONFIRMATION=Confirmaci\\u00F3n\r\n\r\n#YMSG\r\nLR_CONFIRMATIONMSG=\\u00BFEnviar esta solicitud de ausencia a {0}?\r\n\r\n#YMSG\r\nLR_WITHDRAWNMSG=\\u00BFDesea anular esta solicitud de ausencia?\r\n\r\n#XFLD\r\nLR_DAYS=D\\u00EDas\r\n\r\n#XFLD\r\nLR_DAY=D\\u00EDa\r\n\r\n#XFLD\r\nLR_HOURS=horas\r\n\r\n#XFLD\r\nLR_HOUR=Hora\r\n\r\n#XFLD\r\nLR_REQUEST=Solicitada\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_TODAY=Hoy\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_SELECTED=D\\u00EDa(s) seleccionado(s)\r\n\r\n#YMSG: processing\r\nLR_PROCESSING=Procesando...\r\n\r\n#YMSG\r\nLR_SUBMITDONE=Su solicitud de ausencia se ha enviado a {0}\r\n\r\n#YMSG\r\nLR_WITHDRAWDONE=Se ha anulado su solicitud de ausencia\r\n\r\n#YMSG\r\nLR_AX_MODEL_NOT_REG=Ha ocurrido un problema t\\u00E9cnico\\n\\nDetalles del error\\:\\nError interno; modelo no registrado\r\n\r\n#YMSG\r\nLR_AX_PARSE_ERR=Ha ocurrido un problema t\\u00E9cnico\\n\\nDetalles del error\\:\\nError de protocolo; no se ha podido analizar sint\\u00E1cticamente la respuesta HTTP\r\n\r\n#YMSG\r\nLR_DD_NO_APPROVER=Ha ocurrido un problema t\\u00E9cnico\\n\\nDetalles del error\\:\\nError de protocolo; falta el nombre del autorizador en la respuesta\r\n\r\n#YMSG\r\nLR_DD_NO_CFG=Ha ocurrido un problema t\\u00E9cnico\\n\\nDetalles del error\\:\\nError de protocolo; falta configuraci\\u00F3n en la respuesta\r\n\r\n#YMSG\r\nLR_DD_NO_BALANCES=Ha ocurrido un problema t\\u00E9cnico\\n\\nDetalles del error\\:\\nError de protocolo; faltan saldos en la respuesta\r\n\r\n#YMSG\r\nLR_DD_PARSE_ERR=Ha ocurrido un problema t\\u00E9cnico\\n\\nDetalles del error\\:\\nError de protocolo; no se ha podido analizar sint\\u00E1cticamente la respuesta \r\n\r\n#YMSG\r\nLR_DD_COMM_ERR=Ha ocurrido un problema con su conexi\\u00F3n\r\n\r\n#YMSG\r\nLR_DD_GENERIC_ERR=Se ha producido un error\r\n\r\n#YMSG\r\nLR_CT_PARSE_ERR=Ha ocurrido un problema t\\u00E9cnico\\n\\nDetalles del error\\:\\nError de protocolo; no se ha podido analizar sint\\u00E1cticamente la respuesta \r\n\r\n#XFLD\r\nLR_S1_PENDING=Pendiente\r\n\r\n#YMSG\r\nLR_UNKNOWN=Desconocido\r\n\r\n#XSEL: (legend)\r\nLR_NONWORKING=D\\u00EDa no laborable\r\n\r\n#XSEL: (legend)\r\nLR_APPROVELEAVE=Aprobadas\r\n\r\n#XSEL: (legend)\r\nLR_REJECTEDLEAVE=Rechazadas\r\n\r\n#XSEL: (legend)\r\nLR_APPROVEPENDING=Pendientes de aprobaci\\u00F3n\r\n\r\n#XSEL: (legend)\r\nLR_PUBLICHOLIDAY=D\\u00EDa festivo\r\n\r\n#XSEL: (legend)\r\nLR_WORKINGDAY=D\\u00EDa laborable\r\n\r\n#XSEL: (legend)\r\nLR_DELETIONREQUESTED=Cancelaci\\u00F3n solicitada\r\n\r\n#XTIT\r\nLR_DELETION_REQ=Solicitud de cancelaci\\u00F3n\r\n\r\n#XTIT\r\nLR_CHANGE_REQ=Solicitud de modificaci\\u00F3n\r\n\r\n#XTIT\r\nLR_CHANGE_PENDING=Modificaci\\u00F3n pendiente\r\n\r\n#XTIT\r\nLR_CANCEL_PENDING=Cancelaci\\u00F3n pendiente\r\n\r\n#XTIT\r\nLR_CHANGE_DONE=Modificaci\\u00F3n aprobada\r\n\r\n#XTIT\r\nLR_CANCEL_DONE=Cancelaci\\u00F3n aprobada\r\n\r\n#XTIT\r\nLR_OLD_VERSION=Original\r\n\r\n#XTIT\r\nLR_NEW_VERSION=Modificados\r\n',
	"hcm/emp/myleaverequests/i18n/i18n_fr.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n#XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=Mes demandes de cong\\u00E9\r\n\r\n#XTIT: title of the home view\r\nLR_TITLE_HOME_VIEW=Mes demandes de cong\\u00E9\r\n\r\n#XTIT: title of the leave create view\r\nLR_TITLE_CREATE_VIEW=Demander cong\\u00E9\r\n\r\n#XTIT: title of the leave change view\r\nLR_TITLE_CHANGE_VIEW=Modifier demande de cong\\u00E9\r\n\r\n#XTIT: title of the Entitlements view\r\nLR_TITLE_BALANCE_VIEW=Droits\r\n\r\n#XTIT: title of the leave History view\r\nLR_TITLE_HISTORY_VIEW=Historique\r\n\r\n#XTIT: title of the leave details view\r\nLR_TITLE_DETAILS_VIEW=D\\u00E9tails du cong\\u00E9\r\n\r\n#XTIT: title of the leave requests\r\nLR_TITLE_LEAVE_REQUESTS=Demandes de cong\\u00E9s\r\n\r\n#XTIT: title of the leave request\r\nLR_TITLE_LEAVE_REQUEST=Demande de cong\\u00E9\r\n\r\n#XTIT: deductible\r\nLR_BALANCE_DEDUCTIBLE=Cat\\u00E9gorie\r\n\r\n#XTIT: Balance\r\nLR_BALANCE_BALANCE=Disponible\r\n\r\n#XTIT: Requested\r\nLR_BALANCE_REQUESTED=Demand\\u00E9\r\n\r\n#XTIT: Quota\r\nLR_BALANCE_QUOTA=Droits\r\n\r\n#XTIT: Entitlement\r\nLR_ENTITLEMENT_QUOTA=Droit\r\n\r\n#XTIT: Send leave request\r\nLR_TITLE_SEND=Envoyer demande de cong\\u00E9\r\n\r\n#XTIT: Cancel leave request\r\nLR_TITLE_WITHDRAW=Retirer demande de cong\\u00E9\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_BALANCE_TILE=Droits\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_HISTORY_TILE=Historique\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_CREATE_LEAVE_TILE=Cr\\u00E9er demande de cong\\u00E9\r\n\r\n#XBUT\r\nLR_SHOW_HIST=Historique\r\n\r\n#XBUT\r\nLR_CREATE_LEAVE=Demander cong\\u00E9\r\n\r\n#XBUT: text for "send leave request" button\r\nLR_SEND=Envoyer\r\n\r\n#XBUT: text for ok button \r\nLR_OK=OK\r\n\r\n#XBUT: text for reset button \r\nLR_RESET=R\\u00E9initialiser\r\n\r\n#XBUT: text for cancel button e.g. on the day range picker screen\r\nLR_CANCEL=Interrompre\r\n\r\n#XBUT: text for change button on the Leave Overview details screen\r\nLR_CHANGE=Modifier\r\n\r\n#XBUT: text for cancel button on the Leave Overview details screen\r\nLR_WITHDRAW=Retirer\r\n\r\n#XSEL\r\nLR_UPDATED=Mise \\u00E0 jour effectu\\u00E9e\r\n\r\n#XFLD\r\nLR_NOTE=Note\r\n\r\n#XFLD\r\nLR_CUSTOM1=Zone personnalisable 1\r\n\r\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\r\nLR_BOOKED=utilis\\u00E9(s)\r\n\r\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\r\nLR_REMAINING=disponible(s)\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAYS=jours\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAY=jour\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOURS=Heures\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOUR=Heure\r\n\r\n#XFLD\r\nLR_UP_TO=Fin de validit\\u00E9\r\n\r\n#XFLD\r\nLR_FROM=du\r\n\r\n#XFLD\r\nLR_TO=au\r\n\r\n#XFLD: Hyphen for Date Formatting\r\nLR_HYPHEN=/\r\n\r\n#XTIT: title of error dialog\r\nLR_PROBLEM=Un probl\\u00E8me s\'est produit.\r\n\r\n#XTIT: title of confirmation dialog\r\nLR_CONFIRMATION=Confirmation\r\n\r\n#YMSG\r\nLR_CONFIRMATIONMSG=Envoyer cette demande de cong\\u00E9 \\u00E0 {0}\\u00A0?\r\n\r\n#YMSG\r\nLR_WITHDRAWNMSG=Souhaitez-vous retirer cette demande de cong\\u00E9 ?\r\n\r\n#XFLD\r\nLR_DAYS=Jours\r\n\r\n#XFLD\r\nLR_DAY=Jour\r\n\r\n#XFLD\r\nLR_HOURS=Heures\r\n\r\n#XFLD\r\nLR_HOUR=Heure\r\n\r\n#XFLD\r\nLR_REQUEST=Demand\\u00E9\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_TODAY=Aujourd\'hui\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_SELECTED=Jour(s) s\\u00E9lectionn\\u00E9(s)\r\n\r\n#YMSG: processing\r\nLR_PROCESSING=En cours de traitement...\r\n\r\n#YMSG\r\nLR_SUBMITDONE=Votre demande de cong\\u00E9 a \\u00E9t\\u00E9 envoy\\u00E9e \\u00E0 {0}.\r\n\r\n#YMSG\r\nLR_WITHDRAWDONE=Votre demande de cong\\u00E9 a \\u00E9t\\u00E9 retir\\u00E9e.\r\n\r\n#YMSG\r\nLR_AX_MODEL_NOT_REG=Un probl\\u00E8me technique est survenu.\\n\\nD\\u00E9tails de l\'erreur\\u00A0\\:\\nerreur interne, mod\\u00E8le non enregistr\\u00E9.\r\n\r\n#YMSG\r\nLR_AX_PARSE_ERR=Un probl\\u00E8me technique est survenu.\\n\\nD\\u00E9tails de l\'erreur\\u00A0\\:\\nerreur de protocole, impossible d\'analyser la r\\u00E9ponse HTTP.\r\n\r\n#YMSG\r\nLR_DD_NO_APPROVER=Un probl\\u00E8me technique est survenu.\\n\\nD\\u00E9tails de l\'erreur\\u00A0\\:\\nerreur de protocole, le nom de l\'approbateur ne figure pas dans la r\\u00E9ponse.\r\n\r\n#YMSG\r\nLR_DD_NO_CFG=Un probl\\u00E8me technique est survenu.\\n\\nD\\u00E9tails de l\'erreur\\u00A0\\:\\nerreur de protocole, la configuration ne figure pas dans la r\\u00E9ponse.\r\n\r\n#YMSG\r\nLR_DD_NO_BALANCES=Un probl\\u00E8me technique est survenu.\\n\\nD\\u00E9tails de l\'erreur\\u00A0\\:\\nerreur de protocole, les soldes ne figurent pas dans la r\\u00E9ponse.\r\n\r\n#YMSG\r\nLR_DD_PARSE_ERR=Un probl\\u00E8me technique est survenu.\\n\\nD\\u00E9tails de l\'erreur\\u00A0\\:\\nerreur de protocole, impossible d\'analyser la r\\u00E9ponse.\r\n\r\n#YMSG\r\nLR_DD_COMM_ERR=Un probl\\u00E8me de connexion s\'est produit.\r\n\r\n#YMSG\r\nLR_DD_GENERIC_ERR=Une erreur s\'est produite.\r\n\r\n#YMSG\r\nLR_CT_PARSE_ERR=Un probl\\u00E8me technique est survenu.\\n\\nD\\u00E9tails de l\'erreur\\u00A0\\:\\nerreur de protocole, impossible d\'analyser la r\\u00E9ponse.\r\n\r\n#XFLD\r\nLR_S1_PENDING=En attente\r\n\r\n#YMSG\r\nLR_UNKNOWN=Inconnu\r\n\r\n#XSEL: (legend)\r\nLR_NONWORKING=Jour non ouvrable\r\n\r\n#XSEL: (legend)\r\nLR_APPROVELEAVE=Approuv\\u00E9\r\n\r\n#XSEL: (legend)\r\nLR_REJECTEDLEAVE=Refus\\u00E9\r\n\r\n#XSEL: (legend)\r\nLR_APPROVEPENDING=Approbation en attente\r\n\r\n#XSEL: (legend)\r\nLR_PUBLICHOLIDAY=Jour f\\u00E9ri\\u00E9\r\n\r\n#XSEL: (legend)\r\nLR_WORKINGDAY=Jour ouvr\\u00E9\r\n\r\n#XSEL: (legend)\r\nLR_DELETIONREQUESTED=Annulation demand\\u00E9e\r\n\r\n#XTIT\r\nLR_DELETION_REQ=Demande d\'annulation\r\n\r\n#XTIT\r\nLR_CHANGE_REQ=Demande de modification\r\n\r\n#XTIT\r\nLR_CHANGE_PENDING=Modification en attente\r\n\r\n#XTIT\r\nLR_CANCEL_PENDING=Annulation en attente\r\n\r\n#XTIT\r\nLR_CHANGE_DONE=Modification approuv\\u00E9e\r\n\r\n#XTIT\r\nLR_CANCEL_DONE=Annulation approuv\\u00E9e\r\n\r\n#XTIT\r\nLR_OLD_VERSION=Original\r\n\r\n#XTIT\r\nLR_NEW_VERSION=Modifi\\u00E9\r\n',
	"hcm/emp/myleaverequests/i18n/i18n_hu.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n#XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=Saj\\u00E1t t\\u00E1voll\\u00E9tk\\u00E9relmek\r\n\r\n#XTIT: title of the home view\r\nLR_TITLE_HOME_VIEW=Saj\\u00E1t t\\u00E1voll\\u00E9tk\\u00E9relmek\r\n\r\n#XTIT: title of the leave create view\r\nLR_TITLE_CREATE_VIEW=T\\u00E1voll\\u00E9t k\\u00E9r\\u00E9se\r\n\r\n#XTIT: title of the leave change view\r\nLR_TITLE_CHANGE_VIEW=T\\u00E1voll\\u00E9tk\\u00E9relem m\\u00F3dos\\u00EDt\\u00E1sa\r\n\r\n#XTIT: title of the Entitlements view\r\nLR_TITLE_BALANCE_VIEW=Ig\\u00E9nyek\r\n\r\n#XTIT: title of the leave History view\r\nLR_TITLE_HISTORY_VIEW=T\\u00F6rt\\u00E9net\r\n\r\n#XTIT: title of the leave details view\r\nLR_TITLE_DETAILS_VIEW=T\\u00E1voll\\u00E9t r\\u00E9szletei\r\n\r\n#XTIT: title of the leave requests\r\nLR_TITLE_LEAVE_REQUESTS=T\\u00E1voll\\u00E9tk\\u00E9relmek\r\n\r\n#XTIT: title of the leave request\r\nLR_TITLE_LEAVE_REQUEST=T\\u00E1voll\\u00E9tk\\u00E9relem\r\n\r\n#XTIT: deductible\r\nLR_BALANCE_DEDUCTIBLE=Kateg\\u00F3ria\r\n\r\n#XTIT: Balance\r\nLR_BALANCE_BALANCE=Rendelkez\\u00E9sre \\u00E1ll\r\n\r\n#XTIT: Requested\r\nLR_BALANCE_REQUESTED=Ig\\u00E9nyelt\r\n\r\n#XTIT: Quota\r\nLR_BALANCE_QUOTA=Ig\\u00E9nyek\r\n\r\n#XTIT: Entitlement\r\nLR_ENTITLEMENT_QUOTA=Ig\\u00E9ny\r\n\r\n#XTIT: Send leave request\r\nLR_TITLE_SEND=T\\u00E1voll\\u00E9tk\\u00E9relem k\\u00FCld\\u00E9se\r\n\r\n#XTIT: Cancel leave request\r\nLR_TITLE_WITHDRAW=T\\u00E1voll\\u00E9tk\\u00E9relem visszavon\\u00E1sa\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_BALANCE_TILE=Ig\\u00E9nyek\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_HISTORY_TILE=T\\u00F6rt\\u00E9net\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_CREATE_LEAVE_TILE=T\\u00E1voll\\u00E9tk\\u00E9relem l\\u00E9trehoz\\u00E1sa\r\n\r\n#XBUT\r\nLR_SHOW_HIST=T\\u00F6rt\\u00E9net\r\n\r\n#XBUT\r\nLR_CREATE_LEAVE=T\\u00E1voll\\u00E9t k\\u00E9r\\u00E9se\r\n\r\n#XBUT: text for "send leave request" button\r\nLR_SEND=K\\u00FCld\\u00E9s\r\n\r\n#XBUT: text for ok button \r\nLR_OK=OK\r\n\r\n#XBUT: text for reset button \r\nLR_RESET=Vissza\\u00E1ll\\u00EDt\\u00E1s\r\n\r\n#XBUT: text for cancel button e.g. on the day range picker screen\r\nLR_CANCEL=M\\u00E9gse\r\n\r\n#XBUT: text for change button on the Leave Overview details screen\r\nLR_CHANGE=M\\u00F3dos\\u00EDt\\u00E1s\r\n\r\n#XBUT: text for cancel button on the Leave Overview details screen\r\nLR_WITHDRAW=Visszavon\\u00E1s\r\n\r\n#XSEL\r\nLR_UPDATED=Aktualiz\\u00E1lva\r\n\r\n#XFLD\r\nLR_NOTE=Megjegyz\\u00E9s\r\n\r\n#XFLD\r\nLR_CUSTOM1=1. egy\\u00E9ni mez\\u0151\r\n\r\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\r\nLR_BOOKED=felhaszn\\u00E1lva\r\n\r\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\r\nLR_REMAINING=\\u00E1ll rendelkez\\u00E9sre\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAYS=napok\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAY=nap\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOURS=\\u00D3r\\u00E1k\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOUR=\\u00D3ra\r\n\r\n#XFLD\r\nLR_UP_TO=\\u00C9rv\\u00E9nyes eddig\\:\r\n\r\n#XFLD\r\nLR_FROM=Kezd\\u00E9s\\:\r\n\r\n#XFLD\r\nLR_TO=V\\u00E9ge\\:\r\n\r\n#XFLD: Hyphen for Date Formatting\r\nLR_HYPHEN=-\r\n\r\n#XTIT: title of error dialog\r\nLR_PROBLEM=Hiba t\\u00F6rt\\u00E9nt\r\n\r\n#XTIT: title of confirmation dialog\r\nLR_CONFIRMATION=Meger\\u0151s\\u00EDt\\u00E9s\r\n\r\n#YMSG\r\nLR_CONFIRMATIONMSG=Elk\\u00FCldi ezt a t\\u00E1voll\\u00E9tk\\u00E9relmet a k\\u00F6vetkez\\u0151nek\\: {0}?\r\n\r\n#YMSG\r\nLR_WITHDRAWNMSG=Visszavonja ezt a t\\u00E1voll\\u00E9tk\\u00E9relmet?\r\n\r\n#XFLD\r\nLR_DAYS=Napok\r\n\r\n#XFLD\r\nLR_DAY=Nap\r\n\r\n#XFLD\r\nLR_HOURS=\\u00D3r\\u00E1k\r\n\r\n#XFLD\r\nLR_HOUR=\\u00D3ra\r\n\r\n#XFLD\r\nLR_REQUEST=Ig\\u00E9nyelt\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_TODAY=Ma\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_SELECTED=Kiv\\u00E1lasztott napok\r\n\r\n#YMSG: processing\r\nLR_PROCESSING=Feldolgoz\\u00E1s...\r\n\r\n#YMSG\r\nLR_SUBMITDONE=T\\u00E1voll\\u00E9tk\\u00E9relme el lett k\\u00FCldve\\: {0}\r\n\r\n#YMSG\r\nLR_WITHDRAWDONE=T\\u00E1voll\\u00E9tk\\u00E9relme visszavonva\r\n\r\n#YMSG\r\nLR_AX_MODEL_NOT_REG=M\\u0171szaki hiba t\\u00F6rt\\u00E9nt\\n\\nHiba r\\u00E9szletei\\:\\nBels\\u0151 hiba; a modell nincs regisztr\\u00E1lva\r\n\r\n#YMSG\r\nLR_AX_PARSE_ERR=M\\u0171szaki hiba t\\u00F6rt\\u00E9nt\\n\\nHiba r\\u00E9szletei\\:\\nProtokollhiba; nem siker\\u00FClt a HTTP-v\\u00E1lasz elemz\\u00E9se\r\n\r\n#YMSG\r\nLR_DD_NO_APPROVER=M\\u0171szaki hiba t\\u00F6rt\\u00E9nt\\n\\nHiba r\\u00E9szletei\\:\\nProtokollhiba; a v\\u00E1lasz nem tartalmazza az enged\\u00E9lyez\\u0151 nev\\u00E9t\r\n\r\n#YMSG\r\nLR_DD_NO_CFG=M\\u0171szaki hiba t\\u00F6rt\\u00E9nt\\n\\nHiba r\\u00E9szletei\\:\\nProtokollhiba; a v\\u00E1lasz nem tartalmazza a konfigur\\u00E1ci\\u00F3t\r\n\r\n#YMSG\r\nLR_DD_NO_BALANCES=M\\u0171szaki hiba t\\u00F6rt\\u00E9nt\\n\\nHiba r\\u00E9szletei\\:\\nProtokollhiba; a v\\u00E1lasz nem tartalmazza az egyenlegeket\r\n\r\n#YMSG\r\nLR_DD_PARSE_ERR=M\\u0171szaki hiba t\\u00F6rt\\u00E9nt\\n\\nHiba r\\u00E9szletei\\:\\nProtokollhiba; nem siker\\u00FClt a v\\u00E1lasz elemz\\u00E9se\r\n\r\n#YMSG\r\nLR_DD_COMM_ERR=Probl\\u00E9ma volt a kapcsolattal\r\n\r\n#YMSG\r\nLR_DD_GENERIC_ERR=Hiba t\\u00F6rt\\u00E9nt\r\n\r\n#YMSG\r\nLR_CT_PARSE_ERR=M\\u0171szaki hiba t\\u00F6rt\\u00E9nt\\n\\nHiba r\\u00E9szletei\\:\\nProtokollhiba; nem siker\\u00FClt a v\\u00E1lasz elemz\\u00E9se\r\n\r\n#XFLD\r\nLR_S1_PENDING=F\\u00FCgg\\u0151ben\r\n\r\n#YMSG\r\nLR_UNKNOWN=Ismeretlen\r\n\r\n#XSEL: (legend)\r\nLR_NONWORKING=Nem munkanap\r\n\r\n#XSEL: (legend)\r\nLR_APPROVELEAVE=Enged\\u00E9lyezve\r\n\r\n#XSEL: (legend)\r\nLR_REJECTEDLEAVE=Elutas\\u00EDtva\r\n\r\n#XSEL: (legend)\r\nLR_APPROVEPENDING=Enged\\u00E9lyez\\u00E9s f\\u00FCgg\\u0151ben\r\n\r\n#XSEL: (legend)\r\nLR_PUBLICHOLIDAY=\\u00DCnnepnap\r\n\r\n#XSEL: (legend)\r\nLR_WORKINGDAY=Munkanap\r\n\r\n#XSEL: (legend)\r\nLR_DELETIONREQUESTED=Visszavon\\u00E1st k\\u00E9rt\r\n\r\n#XTIT\r\nLR_DELETION_REQ=Visszavon\\u00E1si k\\u00E9relem\r\n\r\n#XTIT\r\nLR_CHANGE_REQ=K\\u00E9relem m\\u00F3dos\\u00EDt\\u00E1sa\r\n\r\n#XTIT\r\nLR_CHANGE_PENDING=M\\u00F3dos\\u00EDt\\u00E1s f\\u00FCgg\\u0151ben\r\n\r\n#XTIT\r\nLR_CANCEL_PENDING=Visszavon\\u00E1s f\\u00FCgg\\u0151ben\r\n\r\n#XTIT\r\nLR_CHANGE_DONE=M\\u00F3dos\\u00EDt\\u00E1s enged\\u00E9lyezve\r\n\r\n#XTIT\r\nLR_CANCEL_DONE=Visszavon\\u00E1s enged\\u00E9lyezve\r\n\r\n#XTIT\r\nLR_OLD_VERSION=Eredeti\r\n\r\n#XTIT\r\nLR_NEW_VERSION=M\\u00F3dos\\u00EDtott\r\n',
	"hcm/emp/myleaverequests/i18n/i18n_it.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n#XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=Le mie richieste di ferie\r\n\r\n#XTIT: title of the home view\r\nLR_TITLE_HOME_VIEW=Le mie richieste di ferie\r\n\r\n#XTIT: title of the leave create view\r\nLR_TITLE_CREATE_VIEW=Richiedi ferie\r\n\r\n#XTIT: title of the leave change view\r\nLR_TITLE_CHANGE_VIEW=Modifica richiesta di ferie\r\n\r\n#XTIT: title of the Entitlements view\r\nLR_TITLE_BALANCE_VIEW=Diritti\r\n\r\n#XTIT: title of the leave History view\r\nLR_TITLE_HISTORY_VIEW=Storico\r\n\r\n#XTIT: title of the leave details view\r\nLR_TITLE_DETAILS_VIEW=Dettagli ferie\r\n\r\n#XTIT: title of the leave requests\r\nLR_TITLE_LEAVE_REQUESTS=Richieste di ferie\r\n\r\n#XTIT: title of the leave request\r\nLR_TITLE_LEAVE_REQUEST=Richiesta di ferie\r\n\r\n#XTIT: deductible\r\nLR_BALANCE_DEDUCTIBLE=Categoria\r\n\r\n#XTIT: Balance\r\nLR_BALANCE_BALANCE=Disponibile\r\n\r\n#XTIT: Requested\r\nLR_BALANCE_REQUESTED=Richiesto\r\n\r\n#XTIT: Quota\r\nLR_BALANCE_QUOTA=Diritti\r\n\r\n#XTIT: Entitlement\r\nLR_ENTITLEMENT_QUOTA=Diritto\r\n\r\n#XTIT: Send leave request\r\nLR_TITLE_SEND=Invia richiesta di ferie\r\n\r\n#XTIT: Cancel leave request\r\nLR_TITLE_WITHDRAW=Ritira richiesta di ferie\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_BALANCE_TILE=Diritti\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_HISTORY_TILE=Storico\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_CREATE_LEAVE_TILE=Crea richiesta di ferie\r\n\r\n#XBUT\r\nLR_SHOW_HIST=Storico\r\n\r\n#XBUT\r\nLR_CREATE_LEAVE=Richiedi ferie\r\n\r\n#XBUT: text for "send leave request" button\r\nLR_SEND=Invia\r\n\r\n#XBUT: text for ok button \r\nLR_OK=OK\r\n\r\n#XBUT: text for reset button \r\nLR_RESET=Resetta\r\n\r\n#XBUT: text for cancel button e.g. on the day range picker screen\r\nLR_CANCEL=Annulla\r\n\r\n#XBUT: text for change button on the Leave Overview details screen\r\nLR_CHANGE=Modifica\r\n\r\n#XBUT: text for cancel button on the Leave Overview details screen\r\nLR_WITHDRAW=Ritira\r\n\r\n#XSEL\r\nLR_UPDATED=Aggiornato\r\n\r\n#XFLD\r\nLR_NOTE=Nota\r\n\r\n#XFLD\r\nLR_CUSTOM1=Campo personalizzato 1\r\n\r\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\r\nLR_BOOKED=usufruiti\r\n\r\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\r\nLR_REMAINING=disponibili\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAYS=Giorni\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAY=Giorno\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOURS=Ore\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOUR=Ora\r\n\r\n#XFLD\r\nLR_UP_TO=Valido fino al\r\n\r\n#XFLD\r\nLR_FROM=Da\r\n\r\n#XFLD\r\nLR_TO=A\r\n\r\n#XFLD: Hyphen for Date Formatting\r\nLR_HYPHEN=-\r\n\r\n#XTIT: title of error dialog\r\nLR_PROBLEM=Rilevato un problema\r\n\r\n#XTIT: title of confirmation dialog\r\nLR_CONFIRMATION=Conferma\r\n\r\n#YMSG\r\nLR_CONFIRMATIONMSG=Inviare questa richiesta di ferie a {0}?\r\n\r\n#YMSG\r\nLR_WITHDRAWNMSG=Ritirare questa richiesta di ferie?\r\n\r\n#XFLD\r\nLR_DAYS=Giorni\r\n\r\n#XFLD\r\nLR_DAY=Giorno\r\n\r\n#XFLD\r\nLR_HOURS=Ore\r\n\r\n#XFLD\r\nLR_HOUR=Ora\r\n\r\n#XFLD\r\nLR_REQUEST=Richiesto\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_TODAY=Oggi\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_SELECTED=Giorni selezionati\r\n\r\n#YMSG: processing\r\nLR_PROCESSING=In elaborazione...\r\n\r\n#YMSG\r\nLR_SUBMITDONE=La richiesta di ferie \\u00E8 stata inviata a {0}\r\n\r\n#YMSG\r\nLR_WITHDRAWDONE=La tua richiesta di ferie \\u00E8 stata ritirata\r\n\r\n#YMSG\r\nLR_AX_MODEL_NOT_REG=Si \\u00E8 verificato un problema tecnico\\n\\nDettagli dell\'errore\\:\\nErrore interno; modello non registrato\r\n\r\n#YMSG\r\nLR_AX_PARSE_ERR=Si \\u00E8 verificato un problema tecnico\\n\\nDettagli dell\'errore\\:\\nErrore di protocollo; impossibile analisi sintattica della risposta HTTP\r\n\r\n#YMSG\r\nLR_DD_NO_APPROVER=Si \\u00E8 verificato un problema tecnico\\n\\nDettagli dell\'errore\\:\\nErrore di protocollo; nome approvatore mancante nella risposta\r\n\r\n#YMSG\r\nLR_DD_NO_CFG=Si \\u00E8 verificato un problema tecnico\\n\\nDettagli dell\'errore\\:\\nErrore di protocollo; configurazione mancante nella risposta\r\n\r\n#YMSG\r\nLR_DD_NO_BALANCES=Si \\u00E8 verificato un problema tecnico\\n\\nDettagli dell\'errore\\:\\nErrore di protocollo; saldi mancanti nella risposta\r\n\r\n#YMSG\r\nLR_DD_PARSE_ERR=Si \\u00E8 verificato un problema tecnico\\n\\nDettagli dell\'errore\\:\\nErrore di protocollo; impossibile analisi sintattica della risposta\r\n\r\n#YMSG\r\nLR_DD_COMM_ERR=Problema rilevato nella connessione\r\n\r\n#YMSG\r\nLR_DD_GENERIC_ERR=Si \\u00E8 verificato un errore\r\n\r\n#YMSG\r\nLR_CT_PARSE_ERR=Si \\u00E8 verificato un problema tecnico\\n\\nDettagli dell\'errore\\:\\nErrore di protocollo; impossibile analisi sintattica della risposta\r\n\r\n#XFLD\r\nLR_S1_PENDING=In sospeso\r\n\r\n#YMSG\r\nLR_UNKNOWN=Sconosciuto\r\n\r\n#XSEL: (legend)\r\nLR_NONWORKING=Giorno non lavorativo\r\n\r\n#XSEL: (legend)\r\nLR_APPROVELEAVE=Approvato\r\n\r\n#XSEL: (legend)\r\nLR_REJECTEDLEAVE=Rifiutato\r\n\r\n#XSEL: (legend)\r\nLR_APPROVEPENDING=In attesa di approvazione\r\n\r\n#XSEL: (legend)\r\nLR_PUBLICHOLIDAY=Giorno festivo\r\n\r\n#XSEL: (legend)\r\nLR_WORKINGDAY=Giorno lavorativo\r\n\r\n#XSEL: (legend)\r\nLR_DELETIONREQUESTED=Annullamento richiesto\r\n\r\n#XTIT\r\nLR_DELETION_REQ=Richiesta di annullamento\r\n\r\n#XTIT\r\nLR_CHANGE_REQ=Modifica la richiesta\r\n\r\n#XTIT\r\nLR_CHANGE_PENDING=Modifica in sospeso\r\n\r\n#XTIT\r\nLR_CANCEL_PENDING=Annullamento in sospeso\r\n\r\n#XTIT\r\nLR_CHANGE_DONE=Modifica approvata\r\n\r\n#XTIT\r\nLR_CANCEL_DONE=Annullamento approvato\r\n\r\n#XTIT\r\nLR_OLD_VERSION=Originale\r\n\r\n#XTIT\r\nLR_NEW_VERSION=Modificato\r\n',
	"hcm/emp/myleaverequests/i18n/i18n_iw.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n#XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=\\u05D1\\u05E7\\u05E9\\u05D5\\u05EA \\u05D4\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05E9\\u05DC\\u05D9\r\n\r\n#XTIT: title of the home view\r\nLR_TITLE_HOME_VIEW=\\u05D1\\u05E7\\u05E9\\u05D5\\u05EA \\u05D4\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05E9\\u05DC\\u05D9\r\n\r\n#XTIT: title of the leave create view\r\nLR_TITLE_CREATE_VIEW=\\u05D1\\u05E7\\u05E9 \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\r\n\r\n#XTIT: title of the leave change view\r\nLR_TITLE_CHANGE_VIEW=\\u05E9\\u05E0\\u05D4 \\u05D1\\u05E7\\u05E9\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\r\n\r\n#XTIT: title of the Entitlements view\r\nLR_TITLE_BALANCE_VIEW=\\u05D6\\u05DB\\u05D0\\u05D5\\u05D9\\u05D5\\u05EA\r\n\r\n#XTIT: title of the leave History view\r\nLR_TITLE_HISTORY_VIEW=\\u05D4\\u05D9\\u05E1\\u05D8\\u05D5\\u05E8\\u05D9\\u05D4\r\n\r\n#XTIT: title of the leave details view\r\nLR_TITLE_DETAILS_VIEW=\\u05E4\\u05E8\\u05D8\\u05D9 \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\r\n\r\n#XTIT: title of the leave requests\r\nLR_TITLE_LEAVE_REQUESTS=\\u05D1\\u05E7\\u05E9\\u05D5\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\r\n\r\n#XTIT: title of the leave request\r\nLR_TITLE_LEAVE_REQUEST=\\u05D1\\u05E7\\u05E9\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\r\n\r\n#XTIT: deductible\r\nLR_BALANCE_DEDUCTIBLE=\\u05E7\\u05D8\\u05D2\\u05D5\\u05E8\\u05D9\\u05D4\r\n\r\n#XTIT: Balance\r\nLR_BALANCE_BALANCE=\\u05D6\\u05DE\\u05D9\\u05DF\r\n\r\n#XTIT: Requested\r\nLR_BALANCE_REQUESTED=\\u05DE\\u05D1\\u05D5\\u05E7\\u05E9\r\n\r\n#XTIT: Quota\r\nLR_BALANCE_QUOTA=\\u05D6\\u05DB\\u05D0\\u05D5\\u05D9\\u05D5\\u05EA\r\n\r\n#XTIT: Entitlement\r\nLR_ENTITLEMENT_QUOTA=\\u05D6\\u05DB\\u05D0\\u05D5\\u05EA\r\n\r\n#XTIT: Send leave request\r\nLR_TITLE_SEND=\\u05E9\\u05DC\\u05D7 \\u05D1\\u05E7\\u05E9\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\r\n\r\n#XTIT: Cancel leave request\r\nLR_TITLE_WITHDRAW=\\u05D4\\u05E1\\u05E8 \\u05D1\\u05E7\\u05E9\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_BALANCE_TILE=\\u05D6\\u05DB\\u05D0\\u05D5\\u05D9\\u05D5\\u05EA\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_HISTORY_TILE=\\u05D4\\u05D9\\u05E1\\u05D8\\u05D5\\u05E8\\u05D9\\u05D4\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_CREATE_LEAVE_TILE=\\u05E6\\u05D5\\u05E8 \\u05D1\\u05E7\\u05E9\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\r\n\r\n#XBUT\r\nLR_SHOW_HIST=\\u05D4\\u05D9\\u05E1\\u05D8\\u05D5\\u05E8\\u05D9\\u05D4\r\n\r\n#XBUT\r\nLR_CREATE_LEAVE=\\u05D1\\u05E7\\u05E9 \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\r\n\r\n#XBUT: text for "send leave request" button\r\nLR_SEND=\\u05E9\\u05DC\\u05D7\r\n\r\n#XBUT: text for ok button \r\nLR_OK=OK\r\n\r\n#XBUT: text for reset button \r\nLR_RESET=\\u05D0\\u05E4\\u05E1\r\n\r\n#XBUT: text for cancel button e.g. on the day range picker screen\r\nLR_CANCEL=\\u05D1\\u05D8\\u05DC\r\n\r\n#XBUT: text for change button on the Leave Overview details screen\r\nLR_CHANGE=\\u05E9\\u05E0\\u05D4\r\n\r\n#XBUT: text for cancel button on the Leave Overview details screen\r\nLR_WITHDRAW=\\u05D4\\u05E1\\u05E8\r\n\r\n#XSEL\r\nLR_UPDATED=\\u05E2\\u05D5\\u05D3\\u05DB\\u05DF\r\n\r\n#XFLD\r\nLR_NOTE=\\u05D4\\u05E2\\u05E8\\u05D4\r\n\r\n#XFLD\r\nLR_CUSTOM1=\\u05E9\\u05D3\\u05D4 \\u05DE\\u05D5\\u05EA\\u05D0\\u05DD \\u05D0\\u05D9\\u05E9\\u05D9\\u05EA 1\r\n\r\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\r\nLR_BOOKED=\\u05E0\\u05D5\\u05E6\\u05DC\\u05D5\r\n\r\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\r\nLR_REMAINING=\\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAYS=\\u05D9\\u05DE\\u05D9\\u05DD\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAY=\\u05D9\\u05D5\\u05DD\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOURS=\\u05E9\\u05E2\\u05D5\\u05EA\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOUR=\\u05E9\\u05E2\\u05D4\r\n\r\n#XFLD\r\nLR_UP_TO=\\u05D1\\u05EA\\u05D5\\u05E7\\u05E3 \\u05E2\\u05D3\r\n\r\n#XFLD\r\nLR_FROM=\\u05DE-\r\n\r\n#XFLD\r\nLR_TO=\\u05E2\\u05D3\r\n\r\n#XFLD: Hyphen for Date Formatting\r\nLR_HYPHEN=-\r\n\r\n#XTIT: title of error dialog\r\nLR_PROBLEM=\\u05D0\\u05D9\\u05E8\\u05E2\\u05D4 \\u05D1\\u05E2\\u05D9\\u05D4\r\n\r\n#XTIT: title of confirmation dialog\r\nLR_CONFIRMATION=\\u05D0\\u05D9\\u05E9\\u05D5\\u05E8\r\n\r\n#YMSG\r\nLR_CONFIRMATIONMSG=\\u05D4\\u05D0\\u05DD \\u05DC\\u05E9\\u05DC\\u05D5\\u05D7 \\u05D0\\u05EA \\u05D1\\u05E7\\u05E9\\u05EA \\u05D4\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05D4\\u05D6\\u05D5 \\u05D0\\u05DC {0}?\r\n\r\n#YMSG\r\nLR_WITHDRAWNMSG=\\u05D4\\u05D0\\u05DD \\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05D4\\u05E1\\u05D9\\u05E8 \\u05D1\\u05E7\\u05E9\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05D6\\u05D5?\r\n\r\n#XFLD\r\nLR_DAYS=\\u05D9\\u05DE\\u05D9\\u05DD\r\n\r\n#XFLD\r\nLR_DAY=\\u05D9\\u05D5\\u05DD\r\n\r\n#XFLD\r\nLR_HOURS=\\u05E9\\u05E2\\u05D5\\u05EA\r\n\r\n#XFLD\r\nLR_HOUR=\\u05E9\\u05E2\\u05D4\r\n\r\n#XFLD\r\nLR_REQUEST=\\u05DE\\u05D1\\u05D5\\u05E7\\u05E9\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_TODAY=\\u05D4\\u05D9\\u05D5\\u05DD\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_SELECTED=\\u05D9\\u05DE\\u05D9\\u05DD \\u05E9\\u05E0\\u05D1\\u05D7\\u05E8\\u05D5\r\n\r\n#YMSG: processing\r\nLR_PROCESSING=\\u05DE\\u05E2\\u05D1\\u05D3...\r\n\r\n#YMSG\r\nLR_SUBMITDONE=\\u05D1\\u05E7\\u05E9\\u05EA \\u05D4\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05E9\\u05DC\\u05DA \\u05E0\\u05E9\\u05DC\\u05D7\\u05D4 \\u05D0\\u05DC {0}\r\n\r\n#YMSG\r\nLR_WITHDRAWDONE=\\u05D1\\u05E7\\u05E9\\u05EA \\u05D4\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05E9\\u05DC\\u05DA \\u05D4\\u05D5\\u05E1\\u05E8\\u05D4\r\n\r\n#YMSG\r\nLR_AX_MODEL_NOT_REG=\\u05D0\\u05D9\\u05E8\\u05E2\\u05D4 \\u05D1\\u05E2\\u05D9\\u05D4 \\u05D8\\u05DB\\u05E0\\u05D9\\u05EA\\n\\n\\u05E4\\u05E8\\u05D8\\u05D9 \\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\\:\\n\\u05E9\\u05D2\\u05D9\\u05D0\\u05D4 \\u05E4\\u05E0\\u05D9\\u05DE\\u05D9\\u05EA; \\u05D3\\u05D2\\u05DD \\u05DC\\u05D0 \\u05E0\\u05E8\\u05E9\\u05DD\r\n\r\n#YMSG\r\nLR_AX_PARSE_ERR=\\u05D0\\u05D9\\u05E8\\u05E2\\u05D4 \\u05D1\\u05E2\\u05D9\\u05D4 \\u05D8\\u05DB\\u05E0\\u05D9\\u05EA\\n\\n\\u05E4\\u05E8\\u05D8\\u05D9 \\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\\:\\n\\u05E9\\u05D2\\u05D9\\u05D0\\u05EA \\u05E4\\u05E8\\u05D5\\u05D8\\u05D5\\u05E7\\u05D5\\u05DC; \\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05D4\\u05D9\\u05D4 \\u05DC\\u05E0\\u05EA\\u05D7 \\u05EA\\u05D2\\u05D5\\u05D1\\u05EA HTTP\r\n\r\n#YMSG\r\nLR_DD_NO_APPROVER=\\u05D0\\u05D9\\u05E8\\u05E2\\u05D4 \\u05D1\\u05E2\\u05D9\\u05D4 \\u05D8\\u05DB\\u05E0\\u05D9\\u05EA\\n\\n\\u05E4\\u05E8\\u05D8\\u05D9 \\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\\:\\n\\u05E9\\u05D2\\u05D9\\u05D0\\u05EA \\u05E4\\u05E8\\u05D5\\u05D8\\u05D5\\u05E7\\u05D5\\u05DC; \\u05E9\\u05DD \\u05D4\\u05DE\\u05D0\\u05E9\\u05E8 \\u05D7\\u05E1\\u05E8 \\u05D1\\u05EA\\u05D2\\u05D5\\u05D1\\u05D4\r\n\r\n#YMSG\r\nLR_DD_NO_CFG=\\u05D0\\u05D9\\u05E8\\u05E2\\u05D4 \\u05D1\\u05E2\\u05D9\\u05D4 \\u05D8\\u05DB\\u05E0\\u05D9\\u05EA\\n\\n\\u05E4\\u05E8\\u05D8\\u05D9 \\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\\:\\n\\u05E9\\u05D2\\u05D9\\u05D0\\u05EA \\u05E4\\u05E8\\u05D5\\u05D8\\u05D5\\u05E7\\u05D5\\u05DC; \\u05EA\\u05E6\\u05D5\\u05E8\\u05D4 \\u05D7\\u05E1\\u05E8\\u05D4 \\u05D1\\u05EA\\u05D2\\u05D5\\u05D1\\u05D4\r\n\r\n#YMSG\r\nLR_DD_NO_BALANCES=\\u05D0\\u05D9\\u05E8\\u05E2\\u05D4 \\u05D1\\u05E2\\u05D9\\u05D4 \\u05D8\\u05DB\\u05E0\\u05D9\\u05EA\\n\\n\\u05E4\\u05E8\\u05D8\\u05D9 \\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\\:\\n\\u05E9\\u05D2\\u05D9\\u05D0\\u05EA \\u05E4\\u05E8\\u05D5\\u05D8\\u05D5\\u05E7\\u05D5\\u05DC; \\u05D9\\u05EA\\u05E8\\u05D5\\u05EA \\u05D7\\u05E1\\u05E8\\u05D5\\u05EA \\u05D1\\u05EA\\u05D2\\u05D5\\u05D1\\u05D4\r\n\r\n#YMSG\r\nLR_DD_PARSE_ERR=\\u05D0\\u05D9\\u05E8\\u05E2\\u05D4 \\u05D1\\u05E2\\u05D9\\u05D4 \\u05D8\\u05DB\\u05E0\\u05D9\\u05EA\\n\\n\\u05E4\\u05E8\\u05D8\\u05D9 \\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\\:\\n\\u05E9\\u05D2\\u05D9\\u05D0\\u05EA \\u05E4\\u05E8\\u05D5\\u05D8\\u05D5\\u05E7\\u05D5\\u05DC; \\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05D4\\u05D9\\u05D4 \\u05DC\\u05E0\\u05EA\\u05D7 \\u05EA\\u05D2\\u05D5\\u05D1\\u05D4\r\n\r\n#YMSG\r\nLR_DD_COMM_ERR=\\u05D0\\u05D9\\u05E8\\u05E2\\u05D4 \\u05D1\\u05E2\\u05D9\\u05D4 \\u05E2\\u05DD \\u05D4\\u05D7\\u05D9\\u05D1\\u05D5\\u05E8 \\u05E9\\u05DC\\u05DA\r\n\r\n#YMSG\r\nLR_DD_GENERIC_ERR=\\u05D0\\u05D9\\u05E8\\u05E2\\u05D4 \\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\r\n\r\n#YMSG\r\nLR_CT_PARSE_ERR=\\u05D0\\u05D9\\u05E8\\u05E2\\u05D4 \\u05D1\\u05E2\\u05D9\\u05D4 \\u05D8\\u05DB\\u05E0\\u05D9\\u05EA\\n\\n\\u05E4\\u05E8\\u05D8\\u05D9 \\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\\:\\n\\u05E9\\u05D2\\u05D9\\u05D0\\u05EA \\u05E4\\u05E8\\u05D5\\u05D8\\u05D5\\u05E7\\u05D5\\u05DC; \\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05D4\\u05D9\\u05D4 \\u05DC\\u05E0\\u05EA\\u05D7 \\u05EA\\u05D2\\u05D5\\u05D1\\u05D4\r\n\r\n#XFLD\r\nLR_S1_PENDING=\\u05D1\\u05D4\\u05DE\\u05EA\\u05E0\\u05D4\r\n\r\n#YMSG\r\nLR_UNKNOWN=\\u05DC\\u05D0 \\u05D9\\u05D3\\u05D5\\u05E2\r\n\r\n#XSEL: (legend)\r\nLR_NONWORKING=\\u05DC\\u05D0 \\u05D9\\u05D5\\u05DD \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4\r\n\r\n#XSEL: (legend)\r\nLR_APPROVELEAVE=\\u05D0\\u05D5\\u05E9\\u05E8\r\n\r\n#XSEL: (legend)\r\nLR_REJECTEDLEAVE=\\u05E0\\u05D3\\u05D7\\u05D4\r\n\r\n#XSEL: (legend)\r\nLR_APPROVEPENDING=\\u05D0\\u05D9\\u05E9\\u05D5\\u05E8 \\u05D1\\u05D4\\u05DE\\u05EA\\u05E0\\u05D4\r\n\r\n#XSEL: (legend)\r\nLR_PUBLICHOLIDAY=\\u05D7\\u05D2 \\u05E8\\u05E9\\u05DE\\u05D9\r\n\r\n#XSEL: (legend)\r\nLR_WORKINGDAY=\\u05D9\\u05D5\\u05DD \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4\r\n\r\n#XSEL: (legend)\r\nLR_DELETIONREQUESTED=\\u05D4\\u05D5\\u05D2\\u05E9\\u05D4 \\u05D1\\u05E7\\u05E9\\u05D4 \\u05DC\\u05D1\\u05D9\\u05D8\\u05D5\\u05DC\r\n\r\n#XTIT\r\nLR_DELETION_REQ=\\u05D1\\u05E7\\u05E9\\u05EA \\u05D1\\u05D9\\u05D8\\u05D5\\u05DC\r\n\r\n#XTIT\r\nLR_CHANGE_REQ=\\u05E9\\u05E0\\u05D4 \\u05D1\\u05E7\\u05E9\\u05D4\r\n\r\n#XTIT\r\nLR_CHANGE_PENDING=\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9 \\u05D1\\u05D4\\u05DE\\u05EA\\u05E0\\u05D4\r\n\r\n#XTIT\r\nLR_CANCEL_PENDING=\\u05D1\\u05D9\\u05D8\\u05D5\\u05DC \\u05D1\\u05D4\\u05DE\\u05EA\\u05E0\\u05D4\r\n\r\n#XTIT\r\nLR_CHANGE_DONE=\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9 \\u05D0\\u05D5\\u05E9\\u05E8\r\n\r\n#XTIT\r\nLR_CANCEL_DONE=\\u05D1\\u05D9\\u05D8\\u05D5\\u05DC \\u05D0\\u05D5\\u05E9\\u05E8\r\n\r\n#XTIT\r\nLR_OLD_VERSION=\\u05DE\\u05E7\\u05D5\\u05E8\\u05D9\r\n\r\n#XTIT\r\nLR_NEW_VERSION=\\u05E9\\u05D5\\u05E0\\u05D4\r\n',
	"hcm/emp/myleaverequests/i18n/i18n_ja.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n#XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=\\u4F11\\u6687\\u7533\\u8ACB\r\n\r\n#XTIT: title of the home view\r\nLR_TITLE_HOME_VIEW=\\u4F11\\u6687\\u7533\\u8ACB\r\n\r\n#XTIT: title of the leave create view\r\nLR_TITLE_CREATE_VIEW=\\u4F11\\u6687\\u7533\\u8ACB\r\n\r\n#XTIT: title of the leave change view\r\nLR_TITLE_CHANGE_VIEW=\\u4F11\\u6687\\u7533\\u8ACB\\u5909\\u66F4\r\n\r\n#XTIT: title of the Entitlements view\r\nLR_TITLE_BALANCE_VIEW=\\u4F11\\u6687\\u4ED8\\u4E0E\r\n\r\n#XTIT: title of the leave History view\r\nLR_TITLE_HISTORY_VIEW=\\u5C65\\u6B74\r\n\r\n#XTIT: title of the leave details view\r\nLR_TITLE_DETAILS_VIEW=\\u4F11\\u6687\\u8A73\\u7D30\r\n\r\n#XTIT: title of the leave requests\r\nLR_TITLE_LEAVE_REQUESTS=\\u4F11\\u6687\\u7533\\u8ACB\r\n\r\n#XTIT: title of the leave request\r\nLR_TITLE_LEAVE_REQUEST=\\u4F11\\u6687\\u7533\\u8ACB\r\n\r\n#XTIT: deductible\r\nLR_BALANCE_DEDUCTIBLE=\\u30AB\\u30C6\\u30B4\\u30EA\r\n\r\n#XTIT: Balance\r\nLR_BALANCE_BALANCE=\\u5229\\u7528\\u53EF\\u80FD\r\n\r\n#XTIT: Requested\r\nLR_BALANCE_REQUESTED=\\u7533\\u8ACB\\u6E08\r\n\r\n#XTIT: Quota\r\nLR_BALANCE_QUOTA=\\u4F11\\u6687\\u4ED8\\u4E0E\r\n\r\n#XTIT: Entitlement\r\nLR_ENTITLEMENT_QUOTA=\\u4F11\\u6687\\u4ED8\\u4E0E\r\n\r\n#XTIT: Send leave request\r\nLR_TITLE_SEND=\\u4F11\\u6687\\u7533\\u8ACB\\u9001\\u4FE1\r\n\r\n#XTIT: Cancel leave request\r\nLR_TITLE_WITHDRAW=\\u4F11\\u6687\\u7533\\u8ACB\\u53D6\\u6D88\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_BALANCE_TILE=\\u4F11\\u6687\\u4ED8\\u4E0E\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_HISTORY_TILE=\\u5C65\\u6B74\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_CREATE_LEAVE_TILE=\\u4F11\\u6687\\u7533\\u8ACB\\u767B\\u9332\r\n\r\n#XBUT\r\nLR_SHOW_HIST=\\u5C65\\u6B74\r\n\r\n#XBUT\r\nLR_CREATE_LEAVE=\\u4F11\\u6687\\u7533\\u8ACB\r\n\r\n#XBUT: text for "send leave request" button\r\nLR_SEND=\\u9001\\u4FE1\r\n\r\n#XBUT: text for ok button \r\nLR_OK=OK\r\n\r\n#XBUT: text for reset button \r\nLR_RESET=\\u30EA\\u30BB\\u30C3\\u30C8\r\n\r\n#XBUT: text for cancel button e.g. on the day range picker screen\r\nLR_CANCEL=\\u4E2D\\u6B62\r\n\r\n#XBUT: text for change button on the Leave Overview details screen\r\nLR_CHANGE=\\u5909\\u66F4\r\n\r\n#XBUT: text for cancel button on the Leave Overview details screen\r\nLR_WITHDRAW=\\u53D6\\u6D88\r\n\r\n#XSEL\r\nLR_UPDATED=\\u66F4\\u65B0\\u6E08\r\n\r\n#XFLD\r\nLR_NOTE=\\u30E1\\u30E2\r\n\r\n#XFLD\r\nLR_CUSTOM1=\\u30E6\\u30FC\\u30B6\\u5B9A\\u7FA9\\u9805\\u76EE 1\r\n\r\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\r\nLR_BOOKED=\\u6D88\\u5316\\u6E08\r\n\r\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\r\nLR_REMAINING=\\u5229\\u7528\\u53EF\\u80FD\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAYS=\\u65E5\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAY=\\u65E5\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOURS=\\u6642\\u9593\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOUR=\\u6642\\u9593\r\n\r\n#XFLD\r\nLR_UP_TO=\\u6709\\u52B9\\u671F\\u9650\r\n\r\n#XFLD\r\nLR_FROM=\\u958B\\u59CB\r\n\r\n#XFLD\r\nLR_TO=\\u7D42\\u4E86\r\n\r\n#XFLD: Hyphen for Date Formatting\r\nLR_HYPHEN=-\r\n\r\n#XTIT: title of error dialog\r\nLR_PROBLEM=\\u554F\\u984C\\u304C\\u767A\\u751F\\u3057\\u307E\\u3057\\u305F\r\n\r\n#XTIT: title of confirmation dialog\r\nLR_CONFIRMATION=\\u78BA\\u8A8D\r\n\r\n#YMSG\r\nLR_CONFIRMATIONMSG=\\u3053\\u306E\\u4F11\\u6687\\u7533\\u8ACB\\u3092 {0} \\u306B\\u9001\\u4FE1\\u3057\\u307E\\u3059\\u304B\\u3002\r\n\r\n#YMSG\r\nLR_WITHDRAWNMSG=\\u3053\\u306E\\u4F11\\u6687\\u7533\\u8ACB\\u3092\\u53D6\\u308A\\u6D88\\u3057\\u307E\\u3059\\u304B\\u3002\r\n\r\n#XFLD\r\nLR_DAYS=\\u65E5\r\n\r\n#XFLD\r\nLR_DAY=\\u65E5\r\n\r\n#XFLD\r\nLR_HOURS=\\u6642\\u9593\r\n\r\n#XFLD\r\nLR_HOUR=\\u6642\\u9593\r\n\r\n#XFLD\r\nLR_REQUEST=\\u7533\\u8ACB\\u6E08\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_TODAY=\\u672C\\u65E5\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_SELECTED=\\u9078\\u629E\\u65E5\r\n\r\n#YMSG: processing\r\nLR_PROCESSING=\\u51E6\\u7406\\u4E2D...\r\n\r\n#YMSG\r\nLR_SUBMITDONE=\\u4F11\\u6687\\u7533\\u8ACB\\u304C {0} \\u306B\\u9001\\u4FE1\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n#YMSG\r\nLR_WITHDRAWDONE=\\u4F11\\u6687\\u7533\\u8ACB\\u304C\\u53D6\\u308A\\u6D88\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n#YMSG\r\nLR_AX_MODEL_NOT_REG=\\u6280\\u8853\\u7684\\u306A\\u554F\\u984C\\u304C\\u767A\\u751F\\u3057\\u307E\\u3057\\u305F\\n\\n\\u30A8\\u30E9\\u30FC\\u8A73\\u7D30\\: \\n\\u5185\\u90E8\\u30A8\\u30E9\\u30FC\\: \\u30E2\\u30C7\\u30EB\\u304C\\u767B\\u9332\\u3055\\u308C\\u3066\\u3044\\u307E\\u305B\\u3093\r\n\r\n#YMSG\r\nLR_AX_PARSE_ERR=\\u6280\\u8853\\u7684\\u306A\\u554F\\u984C\\u304C\\u767A\\u751F\\u3057\\u307E\\u3057\\u305F\\n\\n\\u30A8\\u30E9\\u30FC\\u8A73\\u7D30\\: \\n\\u30D7\\u30ED\\u30C8\\u30B3\\u30EB\\u30A8\\u30E9\\u30FC\\: HTTP \\u5FDC\\u7B54\\u3092\\u30D1\\u30FC\\u30B9\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n\r\n#YMSG\r\nLR_DD_NO_APPROVER=\\u6280\\u8853\\u7684\\u306A\\u554F\\u984C\\u304C\\u767A\\u751F\\u3057\\u307E\\u3057\\u305F\\n\\n\\u30A8\\u30E9\\u30FC\\u8A73\\u7D30\\: \\n\\u30D7\\u30ED\\u30C8\\u30B3\\u30EB\\u30A8\\u30E9\\u30FC\\: \\u5FDC\\u7B54\\u306B\\u627F\\u8A8D\\u8005\\u540D\\u304C\\u542B\\u307E\\u308C\\u3066\\u3044\\u307E\\u305B\\u3093\r\n\r\n#YMSG\r\nLR_DD_NO_CFG=\\u6280\\u8853\\u7684\\u306A\\u554F\\u984C\\u304C\\u767A\\u751F\\u3057\\u307E\\u3057\\u305F\\n\\n\\u30A8\\u30E9\\u30FC\\u8A73\\u7D30\\: \\n\\u30D7\\u30ED\\u30C8\\u30B3\\u30EB\\u30A8\\u30E9\\u30FC\\: \\u5FDC\\u7B54\\u306B\\u8A2D\\u5B9A\\u304C\\u542B\\u307E\\u308C\\u3066\\u3044\\u307E\\u305B\\u3093\r\n\r\n#YMSG\r\nLR_DD_NO_BALANCES=\\u6280\\u8853\\u7684\\u306A\\u554F\\u984C\\u304C\\u767A\\u751F\\u3057\\u307E\\u3057\\u305F\\n\\n\\u30A8\\u30E9\\u30FC\\u8A73\\u7D30\\: \\n\\u30D7\\u30ED\\u30C8\\u30B3\\u30EB\\u30A8\\u30E9\\u30FC\\: \\u5FDC\\u7B54\\u306B\\u30D0\\u30E9\\u30F3\\u30B9\\u304C\\u542B\\u307E\\u308C\\u3066\\u3044\\u307E\\u305B\\u3093\r\n\r\n#YMSG\r\nLR_DD_PARSE_ERR=\\u6280\\u8853\\u7684\\u306A\\u554F\\u984C\\u304C\\u767A\\u751F\\u3057\\u307E\\u3057\\u305F\\n\\n\\u30A8\\u30E9\\u30FC\\u8A73\\u7D30\\: \\n\\u30D7\\u30ED\\u30C8\\u30B3\\u30EB\\u30A8\\u30E9\\u30FC\\: \\u5FDC\\u7B54\\u3092\\u30D1\\u30FC\\u30B9\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n\r\n#YMSG\r\nLR_DD_COMM_ERR=\\u63A5\\u7D9A\\u6642\\u306B\\u554F\\u984C\\u304C\\u767A\\u751F\\u3057\\u307E\\u3057\\u305F\r\n\r\n#YMSG\r\nLR_DD_GENERIC_ERR=\\u30A8\\u30E9\\u30FC\\u304C\\u767A\\u751F\\u3057\\u307E\\u3057\\u305F\r\n\r\n#YMSG\r\nLR_CT_PARSE_ERR=\\u6280\\u8853\\u7684\\u306A\\u554F\\u984C\\u304C\\u767A\\u751F\\u3057\\u307E\\u3057\\u305F\\n\\n\\u30A8\\u30E9\\u30FC\\u8A73\\u7D30\\: \\n\\u30D7\\u30ED\\u30C8\\u30B3\\u30EB\\u30A8\\u30E9\\u30FC\\: \\u5FDC\\u7B54\\u3092\\u30D1\\u30FC\\u30B9\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n\r\n#XFLD\r\nLR_S1_PENDING=\\u4FDD\\u7559\r\n\r\n#YMSG\r\nLR_UNKNOWN=\\u672A\\u5B9A\\u7FA9\r\n\r\n#XSEL: (legend)\r\nLR_NONWORKING=\\u975E\\u7A3C\\u50CD\\u65E5\r\n\r\n#XSEL: (legend)\r\nLR_APPROVELEAVE=\\u627F\\u8A8D\\u6E08\r\n\r\n#XSEL: (legend)\r\nLR_REJECTEDLEAVE=\\u5374\\u4E0B\\u6E08\r\n\r\n#XSEL: (legend)\r\nLR_APPROVEPENDING=\\u627F\\u8A8D\\u4FDD\\u7559\r\n\r\n#XSEL: (legend)\r\nLR_PUBLICHOLIDAY=\\u795D\\u65E5\r\n\r\n#XSEL: (legend)\r\nLR_WORKINGDAY=\\u7A3C\\u50CD\\u65E5\r\n\r\n#XSEL: (legend)\r\nLR_DELETIONREQUESTED=\\u53D6\\u6D88\\u4F9D\\u983C\\u6E08\r\n\r\n#XTIT\r\nLR_DELETION_REQ=\\u53D6\\u6D88\\u4F9D\\u983C\r\n\r\n#XTIT\r\nLR_CHANGE_REQ=\\u7533\\u8ACB\\u5909\\u66F4\r\n\r\n#XTIT\r\nLR_CHANGE_PENDING=\\u5909\\u66F4\\u4FDD\\u7559\r\n\r\n#XTIT\r\nLR_CANCEL_PENDING=\\u53D6\\u6D88\\u4FDD\\u7559\r\n\r\n#XTIT\r\nLR_CHANGE_DONE=\\u5909\\u66F4\\u627F\\u8A8D\\u6E08\r\n\r\n#XTIT\r\nLR_CANCEL_DONE=\\u53D6\\u6D88\\u627F\\u8A8D\\u6E08\r\n\r\n#XTIT\r\nLR_OLD_VERSION=\\u5909\\u66F4\\u524D\r\n\r\n#XTIT\r\nLR_NEW_VERSION=\\u5909\\u66F4\\u5F8C\r\n',
	"hcm/emp/myleaverequests/i18n/i18n_no.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n#XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=Mine frav\\u00E6rss\\u00F8knader\r\n\r\n#XTIT: title of the home view\r\nLR_TITLE_HOME_VIEW=Mine frav\\u00E6rss\\u00F8knader\r\n\r\n#XTIT: title of the leave create view\r\nLR_TITLE_CREATE_VIEW=S\\u00F8k om frav\\u00E6r\r\n\r\n#XTIT: title of the leave change view\r\nLR_TITLE_CHANGE_VIEW=Endre frav\\u00E6rss\\u00F8knad\r\n\r\n#XTIT: title of the Entitlements view\r\nLR_TITLE_BALANCE_VIEW=Krav\r\n\r\n#XTIT: title of the leave History view\r\nLR_TITLE_HISTORY_VIEW=Historikk\r\n\r\n#XTIT: title of the leave details view\r\nLR_TITLE_DETAILS_VIEW=Frav\\u00E6rsdetaljer\r\n\r\n#XTIT: title of the leave requests\r\nLR_TITLE_LEAVE_REQUESTS=Frav\\u00E6rss\\u00F8knader\r\n\r\n#XTIT: title of the leave request\r\nLR_TITLE_LEAVE_REQUEST=Frav\\u00E6rss\\u00F8knad\r\n\r\n#XTIT: deductible\r\nLR_BALANCE_DEDUCTIBLE=Kategori\r\n\r\n#XTIT: Balance\r\nLR_BALANCE_BALANCE=Tilgjengelig\r\n\r\n#XTIT: Requested\r\nLR_BALANCE_REQUESTED=S\\u00F8kt om\r\n\r\n#XTIT: Quota\r\nLR_BALANCE_QUOTA=Krav\r\n\r\n#XTIT: Entitlement\r\nLR_ENTITLEMENT_QUOTA=Krav\r\n\r\n#XTIT: Send leave request\r\nLR_TITLE_SEND=Send frav\\u00E6rss\\u00F8knad\r\n\r\n#XTIT: Cancel leave request\r\nLR_TITLE_WITHDRAW=Annuller frav\\u00E6rss\\u00F8knad\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_BALANCE_TILE=Krav\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_HISTORY_TILE=Historikk\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_CREATE_LEAVE_TILE=Opprett frav\\u00E6rss\\u00F8knad\r\n\r\n#XBUT\r\nLR_SHOW_HIST=Historikk\r\n\r\n#XBUT\r\nLR_CREATE_LEAVE=S\\u00F8k om frav\\u00E6r\r\n\r\n#XBUT: text for "send leave request" button\r\nLR_SEND=Send\r\n\r\n#XBUT: text for ok button \r\nLR_OK=OK\r\n\r\n#XBUT: text for reset button \r\nLR_RESET=Tilbakestill\r\n\r\n#XBUT: text for cancel button e.g. on the day range picker screen\r\nLR_CANCEL=Avbryt\r\n\r\n#XBUT: text for change button on the Leave Overview details screen\r\nLR_CHANGE=Endre\r\n\r\n#XBUT: text for cancel button on the Leave Overview details screen\r\nLR_WITHDRAW=Annuller\r\n\r\n#XSEL\r\nLR_UPDATED=Oppdatert\r\n\r\n#XFLD\r\nLR_NOTE=Merknad\r\n\r\n#XFLD\r\nLR_CUSTOM1=Brukerdefinert felt 1\r\n\r\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\r\nLR_BOOKED=brukt\r\n\r\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\r\nLR_REMAINING=tilgjengelig\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAYS=dager\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAY=dag\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOURS=timer\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOUR=time\r\n\r\n#XFLD\r\nLR_UP_TO=Gyldig til\r\n\r\n#XFLD\r\nLR_FROM=Fra\r\n\r\n#XFLD\r\nLR_TO=Til\r\n\r\n#XFLD: Hyphen for Date Formatting\r\nLR_HYPHEN=-\r\n\r\n#XTIT: title of error dialog\r\nLR_PROBLEM=Feil har oppst\\u00E5tt\r\n\r\n#XTIT: title of confirmation dialog\r\nLR_CONFIRMATION=Bekreftelse\r\n\r\n#YMSG\r\nLR_CONFIRMATIONMSG=Sende denne frav\\u00E6rss\\u00F8knaden til {0}?\r\n\r\n#YMSG\r\nLR_WITHDRAWNMSG=Vil du annullere denne frav\\u00E6rss\\u00F8knaden?\r\n\r\n#XFLD\r\nLR_DAYS=Dager\r\n\r\n#XFLD\r\nLR_DAY=Dag\r\n\r\n#XFLD\r\nLR_HOURS=Timer\r\n\r\n#XFLD\r\nLR_HOUR=Time\r\n\r\n#XFLD\r\nLR_REQUEST=S\\u00F8kt om\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_TODAY=I dag\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_SELECTED=Valgte dager\r\n\r\n#YMSG: processing\r\nLR_PROCESSING=Behandler ...\r\n\r\n#YMSG\r\nLR_SUBMITDONE=Frav\\u00E6rss\\u00F8knaden er sendt til {0}\r\n\r\n#YMSG\r\nLR_WITHDRAWDONE=Frav\\u00E6rss\\u00F8knaden din er annullert\r\n\r\n#YMSG\r\nLR_AX_MODEL_NOT_REG=Et teknisk problem har oppst\\u00E5tt\\n\\nFeildetaljer\\:\\nIntern feil, modell er ikke registrert\r\n\r\n#YMSG\r\nLR_AX_PARSE_ERR=Et teknisk problem har oppst\\u00E5tt\\n\\nFeildetaljer\\:\\nProtokollfeil, kan ikke analysere HTTP-svar\r\n\r\n#YMSG\r\nLR_DD_NO_APPROVER=Et teknisk problem har oppst\\u00E5tt\\n\\nFeildetaljer\\:\\nProtokollfeil, godkjennernavn mangler i svar\r\n\r\n#YMSG\r\nLR_DD_NO_CFG=Et teknisk problem har oppst\\u00E5tt\\n\\nFeildetaljer\\:\\nProtokollfeil, konfigurasjon mangler i svar\r\n\r\n#YMSG\r\nLR_DD_NO_BALANCES=Et teknisk problem har oppst\\u00E5tt\\n\\nFeildetaljer\\:\\nProtokollfeil, saldoer mangler i svar\r\n\r\n#YMSG\r\nLR_DD_PARSE_ERR=Et teknisk problem har oppst\\u00E5tt\\n\\nFeildetaljer\\:\\nProtokollfeil, kan ikke analysere svar\r\n\r\n#YMSG\r\nLR_DD_COMM_ERR=Forbindelsesfeil\r\n\r\n#YMSG\r\nLR_DD_GENERIC_ERR=Det har oppst\\u00E5tt en feil\r\n\r\n#YMSG\r\nLR_CT_PARSE_ERR=Et teknisk problem har oppst\\u00E5tt\\n\\nFeildetaljer\\:\\nProtokollfeil, kan ikke analysere svar\r\n\r\n#XFLD\r\nLR_S1_PENDING=Venter\r\n\r\n#YMSG\r\nLR_UNKNOWN=Ukjent\r\n\r\n#XSEL: (legend)\r\nLR_NONWORKING=Ikke-arbeidsdag\r\n\r\n#XSEL: (legend)\r\nLR_APPROVELEAVE=Godkjent\r\n\r\n#XSEL: (legend)\r\nLR_REJECTEDLEAVE=Avvist\r\n\r\n#XSEL: (legend)\r\nLR_APPROVEPENDING=Venter p\\u00E5 godkjenning\r\n\r\n#XSEL: (legend)\r\nLR_PUBLICHOLIDAY=Helgedag\r\n\r\n#XSEL: (legend)\r\nLR_WORKINGDAY=Arbeidsdag\r\n\r\n#XSEL: (legend)\r\nLR_DELETIONREQUESTED=Annullering \\u00F8nsket\r\n\r\n#XTIT\r\nLR_DELETION_REQ=Annulleringsforesp\\u00F8rsel\r\n\r\n#XTIT\r\nLR_CHANGE_REQ=Endringsforesp\\u00F8rsel\r\n\r\n#XTIT\r\nLR_CHANGE_PENDING=Venter p\\u00E5 endring\r\n\r\n#XTIT\r\nLR_CANCEL_PENDING=Venter p\\u00E5 annullering\r\n\r\n#XTIT\r\nLR_CHANGE_DONE=Endring godkjent\r\n\r\n#XTIT\r\nLR_CANCEL_DONE=Annullering godkjent\r\n\r\n#XTIT\r\nLR_OLD_VERSION=Original\r\n\r\n#XTIT\r\nLR_NEW_VERSION=Endret\r\n',
	"hcm/emp/myleaverequests/i18n/i18n_pl.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n#XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=Moje wnioski urlopowe\r\n\r\n#XTIT: title of the home view\r\nLR_TITLE_HOME_VIEW=Moje wnioski urlopowe\r\n\r\n#XTIT: title of the leave create view\r\nLR_TITLE_CREATE_VIEW=Wniosek o urlop\r\n\r\n#XTIT: title of the leave change view\r\nLR_TITLE_CHANGE_VIEW=Zmiana wniosku urlopowego\r\n\r\n#XTIT: title of the Entitlements view\r\nLR_TITLE_BALANCE_VIEW=Uprawnienia\r\n\r\n#XTIT: title of the leave History view\r\nLR_TITLE_HISTORY_VIEW=Historia\r\n\r\n#XTIT: title of the leave details view\r\nLR_TITLE_DETAILS_VIEW=Szczeg\\u00F3\\u0142y urlopu\r\n\r\n#XTIT: title of the leave requests\r\nLR_TITLE_LEAVE_REQUESTS=Wnioski urlopowe\r\n\r\n#XTIT: title of the leave request\r\nLR_TITLE_LEAVE_REQUEST=Wniosek urlopowy\r\n\r\n#XTIT: deductible\r\nLR_BALANCE_DEDUCTIBLE=Kategoria\r\n\r\n#XTIT: Balance\r\nLR_BALANCE_BALANCE=Dost\\u0119pne\r\n\r\n#XTIT: Requested\r\nLR_BALANCE_REQUESTED=Wniosek z\\u0142o\\u017Cono\r\n\r\n#XTIT: Quota\r\nLR_BALANCE_QUOTA=Uprawnienia\r\n\r\n#XTIT: Entitlement\r\nLR_ENTITLEMENT_QUOTA=Uprawnienie\r\n\r\n#XTIT: Send leave request\r\nLR_TITLE_SEND=Wy\\u015Blij wniosek urlopowy\r\n\r\n#XTIT: Cancel leave request\r\nLR_TITLE_WITHDRAW=Wycofaj wniosek urlopowy\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_BALANCE_TILE=Uprawnienia\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_HISTORY_TILE=Historia\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_CREATE_LEAVE_TILE=Nowy wniosek urlopowy\r\n\r\n#XBUT\r\nLR_SHOW_HIST=Historia\r\n\r\n#XBUT\r\nLR_CREATE_LEAVE=Wniosek o urlop\r\n\r\n#XBUT: text for "send leave request" button\r\nLR_SEND=Wy\\u015Blij\r\n\r\n#XBUT: text for ok button \r\nLR_OK=OK\r\n\r\n#XBUT: text for reset button \r\nLR_RESET=Resetuj\r\n\r\n#XBUT: text for cancel button e.g. on the day range picker screen\r\nLR_CANCEL=Anuluj\r\n\r\n#XBUT: text for change button on the Leave Overview details screen\r\nLR_CHANGE=Zmie\\u0144\r\n\r\n#XBUT: text for cancel button on the Leave Overview details screen\r\nLR_WITHDRAW=Wycofaj\r\n\r\n#XSEL\r\nLR_UPDATED=Zaktualizowane\r\n\r\n#XFLD\r\nLR_NOTE=Notatka\r\n\r\n#XFLD\r\nLR_CUSTOM1=Pole u\\u017Cytkownika 1\r\n\r\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\r\nLR_BOOKED=wykorzystanych\r\n\r\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\r\nLR_REMAINING=dost\\u0119pnych\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAYS=dni\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAY=dzie\\u0144\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOURS=Godziny\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOUR=Godzina\r\n\r\n#XFLD\r\nLR_UP_TO=Wa\\u017Cne do\r\n\r\n#XFLD\r\nLR_FROM=Od\r\n\r\n#XFLD\r\nLR_TO=Do\r\n\r\n#XFLD: Hyphen for Date Formatting\r\nLR_HYPHEN=-\r\n\r\n#XTIT: title of error dialog\r\nLR_PROBLEM=Wyst\\u0105pi\\u0142 problem\r\n\r\n#XTIT: title of confirmation dialog\r\nLR_CONFIRMATION=Potwierdzenie\r\n\r\n#YMSG\r\nLR_CONFIRMATIONMSG=Wys\\u0142a\\u0107 ten wniosek urlopowy do {0}?\r\n\r\n#YMSG\r\nLR_WITHDRAWNMSG=Czy chcesz wycofa\\u0107 ten wniosek urlopowy?\r\n\r\n#XFLD\r\nLR_DAYS=Dni\r\n\r\n#XFLD\r\nLR_DAY=Dzie\\u0144\r\n\r\n#XFLD\r\nLR_HOURS=Godziny\r\n\r\n#XFLD\r\nLR_HOUR=Godzina\r\n\r\n#XFLD\r\nLR_REQUEST=Wniosek z\\u0142o\\u017Cono\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_TODAY=Dzisiaj\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_SELECTED=Wybrane dni\r\n\r\n#YMSG: processing\r\nLR_PROCESSING=Przetwarzanie...\r\n\r\n#YMSG\r\nLR_SUBMITDONE=Wys\\u0142ano wniosek urlopowy do {0}\r\n\r\n#YMSG\r\nLR_WITHDRAWDONE=Wycofano wniosek urlopowy\r\n\r\n#YMSG\r\nLR_AX_MODEL_NOT_REG=Wyst\\u0105pi\\u0142 b\\u0142\\u0105d techniczny\\n\\nSzczeg\\u00F3\\u0142y b\\u0142\\u0119du\\:\\nB\\u0142\\u0105d wewn\\u0119trzny; nie zarejestrowano modelu\r\n\r\n#YMSG\r\nLR_AX_PARSE_ERR=Wyst\\u0105pi\\u0142 b\\u0142\\u0105d techniczny\\n\\nSzczeg\\u00F3\\u0142y b\\u0142\\u0119du\\:\\nB\\u0142\\u0105d protoko\\u0142u; nie mo\\u017Cna by\\u0142o przeanalizowa\\u0107 sk\\u0142adni odpowiedzi HTTP\r\n\r\n#YMSG\r\nLR_DD_NO_APPROVER=Wyst\\u0105pi\\u0142 b\\u0142\\u0105d techniczny\\n\\nSzczeg\\u00F3\\u0142y b\\u0142\\u0119du\\:\\nB\\u0142\\u0105d protoko\\u0142u; brak nazwiska osoby zatwierdzaj\\u0105cej w odpowiedzi\r\n\r\n#YMSG\r\nLR_DD_NO_CFG=Wyst\\u0105pi\\u0142 b\\u0142\\u0105d techniczny\\n\\nSzczeg\\u00F3\\u0142y b\\u0142\\u0119du\\:\\nB\\u0142\\u0105d protoko\\u0142u; brak nazwy konfiguracji w odpowiedzi\r\n\r\n#YMSG\r\nLR_DD_NO_BALANCES=Wyst\\u0105pi\\u0142 b\\u0142\\u0105d techniczny\\n\\nSzczeg\\u00F3\\u0142y b\\u0142\\u0119du\\:\\nB\\u0142\\u0105d protoko\\u0142u; brak sald w odpowiedzi\r\n\r\n#YMSG\r\nLR_DD_PARSE_ERR=Wyst\\u0105pi\\u0142 b\\u0142\\u0105d techniczny\\n\\nSzczeg\\u00F3\\u0142y b\\u0142\\u0119du\\:\\nB\\u0142\\u0105d protoko\\u0142u; nie mo\\u017Cna by\\u0142o przeanalizowa\\u0107 sk\\u0142adni odpowiedzi\r\n\r\n#YMSG\r\nLR_DD_COMM_ERR=Wyst\\u0105pi\\u0142 b\\u0142\\u0105d po\\u0142\\u0105czenia\r\n\r\n#YMSG\r\nLR_DD_GENERIC_ERR=Wyst\\u0105pi\\u0142 b\\u0142\\u0105d\r\n\r\n#YMSG\r\nLR_CT_PARSE_ERR=Wyst\\u0105pi\\u0142 b\\u0142\\u0105d techniczny\\n\\nSzczeg\\u00F3\\u0142y b\\u0142\\u0119du\\:\\nB\\u0142\\u0105d protoko\\u0142u; nie mo\\u017Cna by\\u0142o przeanalizowa\\u0107 sk\\u0142adni odpowiedzi\r\n\r\n#XFLD\r\nLR_S1_PENDING=Oczekuje\r\n\r\n#YMSG\r\nLR_UNKNOWN=Nieznane\r\n\r\n#XSEL: (legend)\r\nLR_NONWORKING=Dzie\\u0144 wolny od pracy\r\n\r\n#XSEL: (legend)\r\nLR_APPROVELEAVE=Zatwierdzone\r\n\r\n#XSEL: (legend)\r\nLR_REJECTEDLEAVE=Odrzucone\r\n\r\n#XSEL: (legend)\r\nLR_APPROVEPENDING=Oczekuje na zatwierdzenie\r\n\r\n#XSEL: (legend)\r\nLR_PUBLICHOLIDAY=Dzie\\u0144 \\u015Bwi\\u0105teczny\r\n\r\n#XSEL: (legend)\r\nLR_WORKINGDAY=Dzie\\u0144 roboczy\r\n\r\n#XSEL: (legend)\r\nLR_DELETIONREQUESTED=Za\\u017C\\u0105dano anulowania\r\n\r\n#XTIT\r\nLR_DELETION_REQ=\\u017B\\u0105danie anulowania\r\n\r\n#XTIT\r\nLR_CHANGE_REQ=\\u017B\\u0105danie zmiany\r\n\r\n#XTIT\r\nLR_CHANGE_PENDING=Zmiana oczekuje\r\n\r\n#XTIT\r\nLR_CANCEL_PENDING=Anulowanie oczekuje\r\n\r\n#XTIT\r\nLR_CHANGE_DONE=Zatwierdzono zmian\\u0119\r\n\r\n#XTIT\r\nLR_CANCEL_DONE=Zatwierdzono anulowanie\r\n\r\n#XTIT\r\nLR_OLD_VERSION=Orygina\\u0142\r\n\r\n#XTIT\r\nLR_NEW_VERSION=Zmienione\r\n',
	"hcm/emp/myleaverequests/i18n/i18n_pt.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n#XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=Minhas solicita\\u00E7\\u00F5es de aus\\u00EAncia\r\n\r\n#XTIT: title of the home view\r\nLR_TITLE_HOME_VIEW=Minhas solicita\\u00E7\\u00F5es de aus\\u00EAncia\r\n\r\n#XTIT: title of the leave create view\r\nLR_TITLE_CREATE_VIEW=Solicitar aus\\u00EAncia\r\n\r\n#XTIT: title of the leave change view\r\nLR_TITLE_CHANGE_VIEW=Modificar solicita\\u00E7\\u00E3o de aus\\u00EAncia\r\n\r\n#XTIT: title of the Entitlements view\r\nLR_TITLE_BALANCE_VIEW=Direitos\r\n\r\n#XTIT: title of the leave History view\r\nLR_TITLE_HISTORY_VIEW=Hist\\u00F3rico\r\n\r\n#XTIT: title of the leave details view\r\nLR_TITLE_DETAILS_VIEW=Detalhes de aus\\u00EAncia\r\n\r\n#XTIT: title of the leave requests\r\nLR_TITLE_LEAVE_REQUESTS=Solicita\\u00E7\\u00F5es aus\\u00EAncia\r\n\r\n#XTIT: title of the leave request\r\nLR_TITLE_LEAVE_REQUEST=Solicita\\u00E7\\u00E3o de aus\\u00EAncia\r\n\r\n#XTIT: deductible\r\nLR_BALANCE_DEDUCTIBLE=Categoria\r\n\r\n#XTIT: Balance\r\nLR_BALANCE_BALANCE=Dispon\\u00EDvel\r\n\r\n#XTIT: Requested\r\nLR_BALANCE_REQUESTED=Solicitado\r\n\r\n#XTIT: Quota\r\nLR_BALANCE_QUOTA=Direitos\r\n\r\n#XTIT: Entitlement\r\nLR_ENTITLEMENT_QUOTA=Direito\r\n\r\n#XTIT: Send leave request\r\nLR_TITLE_SEND=Enviar solicita\\u00E7\\u00E3o de aus\\u00EAncia\r\n\r\n#XTIT: Cancel leave request\r\nLR_TITLE_WITHDRAW=Cancelar solicita\\u00E7\\u00E3o de aus\\u00EAncia\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_BALANCE_TILE=Direitos\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_HISTORY_TILE=Hist\\u00F3rico\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_CREATE_LEAVE_TILE=Criar solicita\\u00E7\\u00E3o de aus\\u00EAncia\r\n\r\n#XBUT\r\nLR_SHOW_HIST=Hist\\u00F3rico\r\n\r\n#XBUT\r\nLR_CREATE_LEAVE=Solicitar aus\\u00EAncia\r\n\r\n#XBUT: text for "send leave request" button\r\nLR_SEND=Enviar\r\n\r\n#XBUT: text for ok button \r\nLR_OK=OK\r\n\r\n#XBUT: text for reset button \r\nLR_RESET=Reinicializar\r\n\r\n#XBUT: text for cancel button e.g. on the day range picker screen\r\nLR_CANCEL=Anular\r\n\r\n#XBUT: text for change button on the Leave Overview details screen\r\nLR_CHANGE=Modificar\r\n\r\n#XBUT: text for cancel button on the Leave Overview details screen\r\nLR_WITHDRAW=Cancelar\r\n\r\n#XSEL\r\nLR_UPDATED=Atualizado\r\n\r\n#XFLD\r\nLR_NOTE=Nota\r\n\r\n#XFLD\r\nLR_CUSTOM1=Campo personalizado 1\r\n\r\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\r\nLR_BOOKED=gozado(s)\r\n\r\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\r\nLR_REMAINING=dispon\\u00EDveis\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAYS=dias\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAY=dia\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOURS=Horas\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOUR=Hora\r\n\r\n#XFLD\r\nLR_UP_TO=V\\u00E1lido at\\u00E9\r\n\r\n#XFLD\r\nLR_FROM=De\r\n\r\n#XFLD\r\nLR_TO=At\\u00E9\r\n\r\n#XFLD: Hyphen for Date Formatting\r\nLR_HYPHEN=-\r\n\r\n#XTIT: title of error dialog\r\nLR_PROBLEM=Ocorreu um problema\r\n\r\n#XTIT: title of confirmation dialog\r\nLR_CONFIRMATION=Confirma\\u00E7\\u00E3o\r\n\r\n#YMSG\r\nLR_CONFIRMATIONMSG=Enviar essa solicita\\u00E7\\u00E3o de aus\\u00EAncia para {0}?\r\n\r\n#YMSG\r\nLR_WITHDRAWNMSG=Cancelar essa solicita\\u00E7\\u00E3o de aus\\u00EAncia?\r\n\r\n#XFLD\r\nLR_DAYS=Dias\r\n\r\n#XFLD\r\nLR_DAY=Dia\r\n\r\n#XFLD\r\nLR_HOURS=Horas\r\n\r\n#XFLD\r\nLR_HOUR=Hora\r\n\r\n#XFLD\r\nLR_REQUEST=Solicitado\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_TODAY=Hoje\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_SELECTED=Dia(s) selecionado(s)\r\n\r\n#YMSG: processing\r\nLR_PROCESSING=Processando...\r\n\r\n#YMSG\r\nLR_SUBMITDONE=Sua solicita\\u00E7\\u00E3o de aus\\u00EAncia foi enviada para {0}\r\n\r\n#YMSG\r\nLR_WITHDRAWDONE=Sua solicita\\u00E7\\u00E3o de aus\\u00EAncia foi cancelada\r\n\r\n#YMSG\r\nLR_AX_MODEL_NOT_REG=Ocorreu um problema t\\u00E9cnico\\n\\nDetalhes do erro\\:\\nErro interno; modelo n\\u00E3o registrado\r\n\r\n#YMSG\r\nLR_AX_PARSE_ERR=Ocorreu um problema t\\u00E9cnico\\n\\nDetalhes do erro\\:\\nErro de protocolo; n\\u00E3o foi poss\\u00EDvel analisar resposta HTTP\r\n\r\n#YMSG\r\nLR_DD_NO_APPROVER=Ocorreu um problema t\\u00E9cnico\\n\\nDetalhes do erro\\:\\nErro de protocolo; falta nome do autorizador na resposta\r\n\r\n#YMSG\r\nLR_DD_NO_CFG=Ocorreu um problema t\\u00E9cnico\\n\\nDetalhes do erro\\:\\nErro de protocolo; falta configura\\u00E7\\u00E3o na resposta\r\n\r\n#YMSG\r\nLR_DD_NO_BALANCES=Ocorreu um problema t\\u00E9cnico\\n\\nDetalhes do erro\\:\\nErro de protocolo; faltam saldos na resposta\r\n\r\n#YMSG\r\nLR_DD_PARSE_ERR=Ocorreu um problema t\\u00E9cnico\\n\\nDetalhes do erro\\:\\nErro de protocolo; n\\u00E3o foi poss\\u00EDvel analisar resposta\r\n\r\n#YMSG\r\nLR_DD_COMM_ERR=Ocorreu um problema com sua conex\\u00E3o\r\n\r\n#YMSG\r\nLR_DD_GENERIC_ERR=Ocorreu um erro\r\n\r\n#YMSG\r\nLR_CT_PARSE_ERR=Ocorreu um problema t\\u00E9cnico\\n\\nDetalhes do erro\\:\\nErro de protocolo; n\\u00E3o foi poss\\u00EDvel analisar resposta\r\n\r\n#XFLD\r\nLR_S1_PENDING=Pendente\r\n\r\n#YMSG\r\nLR_UNKNOWN=Desconhecidos\r\n\r\n#XSEL: (legend)\r\nLR_NONWORKING=Dia n\\u00E3o trabalhado\r\n\r\n#XSEL: (legend)\r\nLR_APPROVELEAVE=Autorizadas\r\n\r\n#XSEL: (legend)\r\nLR_REJECTEDLEAVE=Rejeitadas\r\n\r\n#XSEL: (legend)\r\nLR_APPROVEPENDING=Aprova\\u00E7\\u00E3o pendente\r\n\r\n#XSEL: (legend)\r\nLR_PUBLICHOLIDAY=Feriado\r\n\r\n#XSEL: (legend)\r\nLR_WORKINGDAY=Dia de trabalho\r\n\r\n#XSEL: (legend)\r\nLR_DELETIONREQUESTED=Cancelamento solicitado\r\n\r\n#XTIT\r\nLR_DELETION_REQ=Solicita\\u00E7\\u00E3o de cancelamento\r\n\r\n#XTIT\r\nLR_CHANGE_REQ=Modificar solicita\\u00E7\\u00E3o\r\n\r\n#XTIT\r\nLR_CHANGE_PENDING=Modificar pendente\r\n\r\n#XTIT\r\nLR_CANCEL_PENDING=Cancelamento pendente\r\n\r\n#XTIT\r\nLR_CHANGE_DONE=Modifica\\u00E7\\u00E3o aprovada\r\n\r\n#XTIT\r\nLR_CANCEL_DONE=Cancelamento aprovado\r\n\r\n#XTIT\r\nLR_OLD_VERSION=Original\r\n\r\n#XTIT\r\nLR_NEW_VERSION=Modificado\r\n',
	"hcm/emp/myleaverequests/i18n/i18n_ru.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n#XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=\\u041C\\u043E\\u0438 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0438 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\r\n\r\n#XTIT: title of the home view\r\nLR_TITLE_HOME_VIEW=\\u041C\\u043E\\u0438 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0438 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\r\n\r\n#XTIT: title of the leave create view\r\nLR_TITLE_CREATE_VIEW=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0441\\u0438\\u0442\\u044C \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\r\n\r\n#XTIT: title of the leave change view\r\nLR_TITLE_CHANGE_VIEW=\\u0418\\u0437\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C \\u0437\\u0430\\u044F\\u0432\\u043A\\u0443\r\n\r\n#XTIT: title of the Entitlements view\r\nLR_TITLE_BALANCE_VIEW=\\u041F\\u0440\\u0430\\u0432\\u0430\r\n\r\n#XTIT: title of the leave History view\r\nLR_TITLE_HISTORY_VIEW=\\u0418\\u0441\\u0442\\u043E\\u0440\\u0438\\u044F\r\n\r\n#XTIT: title of the leave details view\r\nLR_TITLE_DETAILS_VIEW=\\u041E\\u0442\\u043F\\u0443\\u0441\\u043A \\u043F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u043E\r\n\r\n#XTIT: title of the leave requests\r\nLR_TITLE_LEAVE_REQUESTS=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0438 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\r\n\r\n#XTIT: title of the leave request\r\nLR_TITLE_LEAVE_REQUEST=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\r\n\r\n#XTIT: deductible\r\nLR_BALANCE_DEDUCTIBLE=\\u041A\\u0430\\u0442\\u0435\\u0433\\u043E\\u0440\\u0438\\u044F\r\n\r\n#XTIT: Balance\r\nLR_BALANCE_BALANCE=\\u0414\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u043E\r\n\r\n#XTIT: Requested\r\nLR_BALANCE_REQUESTED=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0448\\u0435\\u043D\\u043E\r\n\r\n#XTIT: Quota\r\nLR_BALANCE_QUOTA=\\u041F\\u0440\\u0430\\u0432\\u0430\r\n\r\n#XTIT: Entitlement\r\nLR_ENTITLEMENT_QUOTA=\\u041F\\u0440\\u0430\\u0432\\u043E\r\n\r\n#XTIT: Send leave request\r\nLR_TITLE_SEND=\\u041E\\u0442\\u043F\\u0440\\u0430\\u0432\\u0438\\u0442\\u044C \\u0437\\u0430\\u044F\\u0432\\u043A\\u0443 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\r\n\r\n#XTIT: Cancel leave request\r\nLR_TITLE_WITHDRAW=\\u041E\\u0442\\u043E\\u0437\\u0432\\u0430\\u0442\\u044C \\u0437\\u0430\\u044F\\u0432\\u043A\\u0443\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_BALANCE_TILE=\\u041F\\u0440\\u0430\\u0432\\u0430\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_HISTORY_TILE=\\u0418\\u0441\\u0442\\u043E\\u0440\\u0438\\u044F\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_CREATE_LEAVE_TILE=\\u0421\\u043E\\u0437\\u0434\\u0430\\u0442\\u044C \\u0437\\u0430\\u044F\\u0432\\u043A\\u0443 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\r\n\r\n#XBUT\r\nLR_SHOW_HIST=\\u0418\\u0441\\u0442\\u043E\\u0440\\u0438\\u044F\r\n\r\n#XBUT\r\nLR_CREATE_LEAVE=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0441 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\\u0430\r\n\r\n#XBUT: text for "send leave request" button\r\nLR_SEND=\\u041E\\u0442\\u043F\\u0440\\u0430\\u0432\\u0438\\u0442\\u044C\r\n\r\n#XBUT: text for ok button \r\nLR_OK=\\u041E\\u041A\r\n\r\n#XBUT: text for reset button \r\nLR_RESET=\\u0421\\u0431\\u0440\\u043E\\u0441\r\n\r\n#XBUT: text for cancel button e.g. on the day range picker screen\r\nLR_CANCEL=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XBUT: text for change button on the Leave Overview details screen\r\nLR_CHANGE=\\u0418\\u0437\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XBUT: text for cancel button on the Leave Overview details screen\r\nLR_WITHDRAW=\\u041E\\u0442\\u043E\\u0437\\u0432\\u0430\\u0442\\u044C\r\n\r\n#XSEL\r\nLR_UPDATED=\\u041E\\u0431\\u043D\\u043E\\u0432\\u043B\\u0435\\u043D\\u043E\r\n\r\n#XFLD\r\nLR_NOTE=\\u041F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u0435\r\n\r\n#XFLD\r\nLR_CUSTOM1=\\u041F\\u043E\\u043B\\u0435 \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0430 1\r\n\r\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\r\nLR_BOOKED=\\u0438\\u0441\\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u043D\\u043E\r\n\r\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\r\nLR_REMAINING=\\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u043E\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAYS=\\u0434\\u043D.\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAY=\\u0434\\u0435\\u043D\\u044C\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOURS=\\u0447.\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOUR=\\u0447\\u0430\\u0441\r\n\r\n#XFLD\r\nLR_UP_TO=\\u0414\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u043E \\u043F\\u043E\r\n\r\n#XFLD\r\nLR_FROM=\\u0421\r\n\r\n#XFLD\r\nLR_TO=\\u041F\\u043E\r\n\r\n#XFLD: Hyphen for Date Formatting\r\nLR_HYPHEN=-\r\n\r\n#XTIT: title of error dialog\r\nLR_PROBLEM=\\u0412\\u043E\\u0437\\u043D\\u0438\\u043A\\u043B\\u0430 \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\u0430\r\n\r\n#XTIT: title of confirmation dialog\r\nLR_CONFIRMATION=\\u041F\\u043E\\u0434\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435\r\n\r\n#YMSG\r\nLR_CONFIRMATIONMSG=\\u041E\\u0442\\u043F\\u0440\\u0430\\u0432\\u0438\\u0442\\u044C \\u0437\\u0430\\u044F\\u0432\\u043A\\u0443 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A \\u0432 \\u0430\\u0434\\u0440\\u0435\\u0441 {0}?\r\n\r\n#YMSG\r\nLR_WITHDRAWNMSG=\\u041E\\u0442\\u043E\\u0437\\u0432\\u0430\\u0442\\u044C \\u044D\\u0442\\u0443 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0443 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A?\r\n\r\n#XFLD\r\nLR_DAYS=\\u0414\\u043D\\u0438\r\n\r\n#XFLD\r\nLR_DAY=\\u0434\\u0435\\u043D\\u044C\r\n\r\n#XFLD\r\nLR_HOURS=\\u0427\\u0430\\u0441\\u044B\r\n\r\n#XFLD\r\nLR_HOUR=\\u0427\\u0430\\u0441\r\n\r\n#XFLD\r\nLR_REQUEST=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0448\\u0435\\u043D\\u043E\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_TODAY=\\u0421\\u0435\\u0433\\u043E\\u0434\\u043D\\u044F\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_SELECTED=\\u0412\\u044B\\u0431\\u0440\\u0430\\u043D\\u043D\\u044B\\u0439 \\u0434\\u0435\\u043D\\u044C(\\u0434\\u043D\\u0438)\r\n\r\n#YMSG: processing\r\nLR_PROCESSING=\\u041E\\u0431\\u0440\\u0430\\u0431\\u043E\\u0442\\u043A\\u0430...\r\n\r\n#YMSG\r\nLR_SUBMITDONE=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A \\u043E\\u0442\\u043F\\u0440\\u0430\\u0432\\u043B\\u0435\\u043D\\u0430 {0}\r\n\r\n#YMSG\r\nLR_WITHDRAWDONE=\\u0412\\u0430\\u0448\\u0430 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0430 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A \\u043E\\u0442\\u043E\\u0437\\u0432\\u0430\\u043D\\u0430\r\n\r\n#YMSG\r\nLR_AX_MODEL_NOT_REG=\\u0412\\u043E\\u0437\\u043D\\u0438\\u043A\\u043B\\u0430 \\u0442\\u0435\\u0445\\u043D\\u0438\\u0447\\u0435\\u0441\\u043A\\u0430\\u044F \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\u0430\\n\\n\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u043E\\u0441\\u0442\\u0438\\:\\n\\u0412\\u043D\\u0443\\u0442\\u0440\\u0435\\u043D\\u043D\\u044F\\u044F \\u043E\\u0448\\u0438\\u0431\\u043A\\u0430, \\u043C\\u043E\\u0434\\u0435\\u043B\\u044C \\u043D\\u0435 \\u0437\\u0430\\u0440\\u0435\\u0433\\u0438\\u0441\\u0442\\u0440\\u0438\\u0440\\u043E\\u0432\\u0430\\u043D\\u0430\r\n\r\n#YMSG\r\nLR_AX_PARSE_ERR=\\u0412\\u043E\\u0437\\u043D\\u0438\\u043A\\u043B\\u0430 \\u0442\\u0435\\u0445\\u043D\\u0438\\u0447\\u0435\\u0441\\u043A\\u0430\\u044F \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\u0430\\n\\n\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u043E\\u0441\\u0442\\u0438\\:\\n\\u041E\\u0448\\u0438\\u0431\\u043A\\u0430 \\u043F\\u0440\\u043E\\u0442\\u043E\\u043A\\u043E\\u043B\\u0430, \\u043D\\u0435\\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E \\u043F\\u0440\\u043E\\u0430\\u043D\\u0430\\u043B\\u0438\\u0437\\u0438\\u0440\\u043E\\u0432\\u0430\\u0442\\u044C \\u043E\\u0442\\u0432\\u0435\\u0442 HTTP\r\n\r\n#YMSG\r\nLR_DD_NO_APPROVER=\\u0412\\u043E\\u0437\\u043D\\u0438\\u043A\\u043B\\u0430 \\u0442\\u0435\\u0445\\u043D\\u0438\\u0447\\u0435\\u0441\\u043A\\u0430\\u044F \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\u0430\\n\\n\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u043E\\u0441\\u0442\\u0438\\:\\n\\u041E\\u0448\\u0438\\u0431\\u043A\\u0430 \\u043F\\u0440\\u043E\\u0442\\u043E\\u043A\\u043E\\u043B\\u0430, \\u0432 \\u043E\\u0442\\u0432\\u0435\\u0442\\u0435 \\u043D\\u0435\\u0442 \\u0438\\u043C\\u0435\\u043D\\u0438 \\u0443\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0430\\u044E\\u0449\\u0435\\u0433\\u043E\r\n\r\n#YMSG\r\nLR_DD_NO_CFG=\\u0412\\u043E\\u0437\\u043D\\u0438\\u043A\\u043B\\u0430 \\u0442\\u0435\\u0445\\u043D\\u0438\\u0447\\u0435\\u0441\\u043A\\u0430\\u044F \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\u0430\\n\\n\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u043E\\u0441\\u0442\\u0438\\:\\n\\u041E\\u0448\\u0438\\u0431\\u043A\\u0430 \\u043F\\u0440\\u043E\\u0442\\u043E\\u043A\\u043E\\u043B\\u0430, \\u0432 \\u043E\\u0442\\u0432\\u0435\\u0442\\u0435 \\u043D\\u0435\\u0442 \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u0438\r\n\r\n#YMSG\r\nLR_DD_NO_BALANCES=\\u0412\\u043E\\u0437\\u043D\\u0438\\u043A\\u043B\\u0430 \\u0442\\u0435\\u0445\\u043D\\u0438\\u0447\\u0435\\u0441\\u043A\\u0430\\u044F \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\u0430\\n\\n\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u043E\\u0441\\u0442\\u0438\\:\\n\\u041E\\u0448\\u0438\\u0431\\u043A\\u0430 \\u043F\\u0440\\u043E\\u0442\\u043E\\u043A\\u043E\\u043B\\u0430, \\u0432 \\u043E\\u0442\\u0432\\u0435\\u0442\\u0435 \\u043D\\u0435\\u0442 \\u043E\\u0441\\u0442\\u0430\\u0442\\u043A\\u043E\\u0432\r\n\r\n#YMSG\r\nLR_DD_PARSE_ERR=\\u0412\\u043E\\u0437\\u043D\\u0438\\u043A\\u043B\\u0430 \\u0442\\u0435\\u0445\\u043D\\u0438\\u0447\\u0435\\u0441\\u043A\\u0430\\u044F \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\u0430\\n\\n\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u043E\\u0441\\u0442\\u0438\\:\\n\\u041E\\u0448\\u0438\\u0431\\u043A\\u0430 \\u043F\\u0440\\u043E\\u0442\\u043E\\u043A\\u043E\\u043B\\u0430, \\u043D\\u0435\\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E \\u043F\\u0440\\u043E\\u0430\\u043D\\u0430\\u043B\\u0438\\u0437\\u0438\\u0440\\u043E\\u0432\\u0430\\u0442\\u044C \\u043E\\u0442\\u0432\\u0435\\u0442\r\n\r\n#YMSG\r\nLR_DD_COMM_ERR=\\u0412\\u043E\\u0437\\u043D\\u0438\\u043A\\u043B\\u0430 \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\u0430 \\u0441 \\u0441\\u043E\\u0435\\u0434\\u0438\\u043D\\u0435\\u043D\\u0438\\u0435\\u043C\r\n\r\n#YMSG\r\nLR_DD_GENERIC_ERR=\\u0412\\u043E\\u0437\\u043D\\u0438\\u043A\\u043B\\u0430 \\u043E\\u0448\\u0438\\u0431\\u043A\\u0430\r\n\r\n#YMSG\r\nLR_CT_PARSE_ERR=\\u0412\\u043E\\u0437\\u043D\\u0438\\u043A\\u043B\\u0430 \\u0442\\u0435\\u0445\\u043D\\u0438\\u0447\\u0435\\u0441\\u043A\\u0430\\u044F \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\u0430\\n\\n\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u043E\\u0441\\u0442\\u0438\\:\\n\\u041E\\u0448\\u0438\\u0431\\u043A\\u0430 \\u043F\\u0440\\u043E\\u0442\\u043E\\u043A\\u043E\\u043B\\u0430, \\u043D\\u0435\\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E \\u043F\\u0440\\u043E\\u0430\\u043D\\u0430\\u043B\\u0438\\u0437\\u0438\\u0440\\u043E\\u0432\\u0430\\u0442\\u044C \\u043E\\u0442\\u0432\\u0435\\u0442\r\n\r\n#XFLD\r\nLR_S1_PENDING=\\u041D\\u0435\\u0437\\u0430\\u043A\\u043E\\u043D\\u0447\\u0435\\u043D\\u043D\\u044B\\u0439\r\n\r\n#YMSG\r\nLR_UNKNOWN=\\u041D\\u0435\\u0438\\u0437\\u0432\\u0435\\u0441\\u0442\\u043D\\u043E\r\n\r\n#XSEL: (legend)\r\nLR_NONWORKING=\\u041D\\u0435\\u0440\\u0430\\u0431\\u043E\\u0447\\u0438\\u0439 \\u0434\\u0435\\u043D\\u044C\r\n\r\n#XSEL: (legend)\r\nLR_APPROVELEAVE=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u043E\r\n\r\n#XSEL: (legend)\r\nLR_REJECTEDLEAVE=\\u041E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0435\\u043D\\u043E\r\n\r\n#XSEL: (legend)\r\nLR_APPROVEPENDING=\\u041E\\u0436\\u0438\\u0434\\u0430\\u0435\\u0442 \\u0443\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u044F\r\n\r\n#XSEL: (legend)\r\nLR_PUBLICHOLIDAY=\\u041F\\u0440\\u0430\\u0437\\u0434\\u043D\\u0438\\u0447\\u043D\\u044B\\u0439 \\u0434\\u0435\\u043D\\u044C\r\n\r\n#XSEL: (legend)\r\nLR_WORKINGDAY=\\u0420\\u0430\\u0431\\u043E\\u0447\\u0438\\u0439 \\u0434\\u0435\\u043D\\u044C\r\n\r\n#XSEL: (legend)\r\nLR_DELETIONREQUESTED=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0441 \\u043D\\u0430 \\u043E\\u0442\\u043C\\u0435\\u043D\\u0443\r\n\r\n#XTIT\r\nLR_DELETION_REQ=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0441 \\u043D\\u0430 \\u043E\\u0442\\u043C\\u0435\\u043D\\u0443\r\n\r\n#XTIT\r\nLR_CHANGE_REQ=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0441 \\u043D\\u0430 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u0435\r\n\r\n#XTIT\r\nLR_CHANGE_PENDING=\\u0418\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u0435 \\u0432 \\u043E\\u0436\\u0438\\u0434\\u0430\\u043D\\u0438\\u0438\r\n\r\n#XTIT\r\nLR_CANCEL_PENDING=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0430 \\u0432 \\u043E\\u0436\\u0438\\u0434\\u0430\\u043D\\u0438\\u0438\r\n\r\n#XTIT\r\nLR_CHANGE_DONE=\\u0418\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u0435 \\u0443\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u043E\r\n\r\n#XTIT\r\nLR_CANCEL_DONE=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0430 \\u0443\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0430\r\n\r\n#XTIT\r\nLR_OLD_VERSION=\\u041E\\u0440\\u0438\\u0433\\u0438\\u043D\\u0430\\u043B\r\n\r\n#XTIT\r\nLR_NEW_VERSION=\\u0418\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u043E\r\n',
	"hcm/emp/myleaverequests/i18n/i18n_tr.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n#XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=\\u0130zin taleplerim\r\n\r\n#XTIT: title of the home view\r\nLR_TITLE_HOME_VIEW=\\u0130zin taleplerim\r\n\r\n#XTIT: title of the leave create view\r\nLR_TITLE_CREATE_VIEW=\\u0130zin talep et\r\n\r\n#XTIT: title of the leave change view\r\nLR_TITLE_CHANGE_VIEW=\\u0130zin talebini de\\u011Fi\\u015Ftir\r\n\r\n#XTIT: title of the Entitlements view\r\nLR_TITLE_BALANCE_VIEW=Haklar\r\n\r\n#XTIT: title of the leave History view\r\nLR_TITLE_HISTORY_VIEW=Ge\\u00E7mi\\u015F\r\n\r\n#XTIT: title of the leave details view\r\nLR_TITLE_DETAILS_VIEW=\\u0130zin ayr\\u0131nt\\u0131lar\\u0131\r\n\r\n#XTIT: title of the leave requests\r\nLR_TITLE_LEAVE_REQUESTS=\\u0130zin talepleri\r\n\r\n#XTIT: title of the leave request\r\nLR_TITLE_LEAVE_REQUEST=\\u0130zin talebi\r\n\r\n#XTIT: deductible\r\nLR_BALANCE_DEDUCTIBLE=Kategori\r\n\r\n#XTIT: Balance\r\nLR_BALANCE_BALANCE=Kullan\\u0131labilir\r\n\r\n#XTIT: Requested\r\nLR_BALANCE_REQUESTED=Talep edilen\r\n\r\n#XTIT: Quota\r\nLR_BALANCE_QUOTA=Haklar\r\n\r\n#XTIT: Entitlement\r\nLR_ENTITLEMENT_QUOTA=Hak\r\n\r\n#XTIT: Send leave request\r\nLR_TITLE_SEND=\\u0130zin talebini g\\u00F6nder\r\n\r\n#XTIT: Cancel leave request\r\nLR_TITLE_WITHDRAW=\\u0130zin talebini geri al\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_BALANCE_TILE=Haklar\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_HISTORY_TILE=Ge\\u00E7mi\\u015F\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_CREATE_LEAVE_TILE=\\u0130zin talebi olu\\u015Ftur\r\n\r\n#XBUT\r\nLR_SHOW_HIST=Ge\\u00E7mi\\u015F\r\n\r\n#XBUT\r\nLR_CREATE_LEAVE=\\u0130zin talep et\r\n\r\n#XBUT: text for "send leave request" button\r\nLR_SEND=G\\u00F6nder\r\n\r\n#XBUT: text for ok button \r\nLR_OK=Tamam\r\n\r\n#XBUT: text for reset button \r\nLR_RESET=S\\u0131f\\u0131rla\r\n\r\n#XBUT: text for cancel button e.g. on the day range picker screen\r\nLR_CANCEL=\\u0130ptal\r\n\r\n#XBUT: text for change button on the Leave Overview details screen\r\nLR_CHANGE=De\\u011Fi\\u015Ftir\r\n\r\n#XBUT: text for cancel button on the Leave Overview details screen\r\nLR_WITHDRAW=Geri al\r\n\r\n#XSEL\r\nLR_UPDATED=G\\u00FCncellendi\r\n\r\n#XFLD\r\nLR_NOTE=Not\r\n\r\n#XFLD\r\nLR_CUSTOM1=\\u00D6zel alan 1\r\n\r\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\r\nLR_BOOKED=kullan\\u0131lan\r\n\r\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\r\nLR_REMAINING=kullan\\u0131labilir\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAYS=g\\u00FCn\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAY=g\\u00FCn\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOURS=Saat\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOUR=Saat\r\n\r\n#XFLD\r\nLR_UP_TO=Ge\\u00E7erlilik biti\\u015Fi\r\n\r\n#XFLD\r\nLR_FROM=Ba\\u015Flang\\u0131\\u00E7\r\n\r\n#XFLD\r\nLR_TO=Biti\\u015F\r\n\r\n#XFLD: Hyphen for Date Formatting\r\nLR_HYPHEN=-\r\n\r\n#XTIT: title of error dialog\r\nLR_PROBLEM=Problem olu\\u015Ftu\r\n\r\n#XTIT: title of confirmation dialog\r\nLR_CONFIRMATION=Teyit\r\n\r\n#YMSG\r\nLR_CONFIRMATIONMSG=\\u0130zin talebi \\u015Funa g\\u00F6nderilsin mi\\: {0} ?\r\n\r\n#YMSG\r\nLR_WITHDRAWNMSG=Bu izin talebini geri almak istiyor musunuz?\r\n\r\n#XFLD\r\nLR_DAYS=G\\u00FCn\r\n\r\n#XFLD\r\nLR_DAY=G\\u00FCn\r\n\r\n#XFLD\r\nLR_HOURS=Saat\r\n\r\n#XFLD\r\nLR_HOUR=Saat\r\n\r\n#XFLD\r\nLR_REQUEST=Talep edilen\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_TODAY=Bug\\u00FCn\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_SELECTED=Se\\u00E7ilen g\\u00FCn(ler)\r\n\r\n#YMSG: processing\r\nLR_PROCESSING=\\u0130\\u015Fleniyor...\r\n\r\n#YMSG\r\nLR_SUBMITDONE=\\u0130zin talebiniz \\u015Funa g\\u00F6nderildi\\: {0}\r\n\r\n#YMSG\r\nLR_WITHDRAWDONE=\\u0130zin talebiniz geri al\\u0131nd\\u0131\r\n\r\n#YMSG\r\nLR_AX_MODEL_NOT_REG=Teknik problem ortaya \\u00E7\\u0131kt\\u0131\\n\\nHata ayr\\u0131nt\\u0131lar\\u0131\\:\\nDahili hata; model kaydedilmedi\r\n\r\n#YMSG\r\nLR_AX_PARSE_ERR=Teknik problem ortaya \\u00E7\\u0131kt\\u0131\\n\\nHata ayr\\u0131nt\\u0131lar\\u0131\\:\\nG\\u00FCnl\\u00FCk hatas\\u0131; HTTP cevab\\u0131 ayr\\u0131\\u015Ft\\u0131r\\u0131lamad\\u0131\r\n\r\n#YMSG\r\nLR_DD_NO_APPROVER=Teknik problem ortaya \\u00E7\\u0131kt\\u0131\\n\\nHata ayr\\u0131nt\\u0131lar\\u0131\\:\\nG\\u00FCnl\\u00FCk hatas\\u0131; cevapta onaylayan ad\\u0131 eksik\r\n\r\n#YMSG\r\nLR_DD_NO_CFG=Teknik problem ortaya \\u00E7\\u0131kt\\u0131\\n\\nHata ayr\\u0131nt\\u0131lar\\u0131\\:\\nG\\u00FCnl\\u00FCk hatas\\u0131; konfig\\u00FCrasyon cevapta eksik\r\n\r\n#YMSG\r\nLR_DD_NO_BALANCES=Teknik problem ortaya \\u00E7\\u0131kt\\u0131\\n\\nHata ayr\\u0131nt\\u0131lar\\u0131\\:\\nG\\u00FCnl\\u00FCk hatas\\u0131; cevapta bakiyeler eksik\r\n\r\n#YMSG\r\nLR_DD_PARSE_ERR=Teknik problem ortaya \\u00E7\\u0131kt\\u0131\\n\\nHata ayr\\u0131nt\\u0131lar\\u0131\\:\\nG\\u00FCnl\\u00FCk hatas\\u0131; cevap ayr\\u0131\\u015Ft\\u0131r\\u0131lamad\\u0131\r\n\r\n#YMSG\r\nLR_DD_COMM_ERR=Ba\\u011Flant\\u0131n\\u0131zla problem ortaya \\u00E7\\u0131kt\\u0131\r\n\r\n#YMSG\r\nLR_DD_GENERIC_ERR=Hata ortaya \\u00E7\\u0131kt\\u0131\r\n\r\n#YMSG\r\nLR_CT_PARSE_ERR=Teknik problem ortaya \\u00E7\\u0131kt\\u0131\\n\\nHata ayr\\u0131nt\\u0131lar\\u0131\\:\\nG\\u00FCnl\\u00FCk hatas\\u0131; cevap ayr\\u0131\\u015Ft\\u0131r\\u0131lamad\\u0131\r\n\r\n#XFLD\r\nLR_S1_PENDING=Beklemede\r\n\r\n#YMSG\r\nLR_UNKNOWN=Bilinmiyor\r\n\r\n#XSEL: (legend)\r\nLR_NONWORKING=\\u0130\\u015Fg\\u00FCn\\u00FC de\\u011Fil\r\n\r\n#XSEL: (legend)\r\nLR_APPROVELEAVE=Onaylanan\r\n\r\n#XSEL: (legend)\r\nLR_REJECTEDLEAVE=Reddedildi\r\n\r\n#XSEL: (legend)\r\nLR_APPROVEPENDING=Onay beklemede\r\n\r\n#XSEL: (legend)\r\nLR_PUBLICHOLIDAY=Resmi tatil\r\n\r\n#XSEL: (legend)\r\nLR_WORKINGDAY=\\u0130\\u015Fg\\u00FCn\\u00FC\r\n\r\n#XSEL: (legend)\r\nLR_DELETIONREQUESTED=\\u0130ptal talep edildi\r\n\r\n#XTIT\r\nLR_DELETION_REQ=\\u0130ptal talebi\r\n\r\n#XTIT\r\nLR_CHANGE_REQ=De\\u011Fi\\u015Fiklik talebi\r\n\r\n#XTIT\r\nLR_CHANGE_PENDING=De\\u011Fi\\u015Fiklik beklemede\r\n\r\n#XTIT\r\nLR_CANCEL_PENDING=\\u0130ptal beklemede\r\n\r\n#XTIT\r\nLR_CHANGE_DONE=De\\u011Fi\\u015Fiklik onayland\\u0131\r\n\r\n#XTIT\r\nLR_CANCEL_DONE=\\u0130ptal onayland\\u0131\r\n\r\n#XTIT\r\nLR_OLD_VERSION=Orijinal\r\n\r\n#XTIT\r\nLR_NEW_VERSION=De\\u011Fi\\u015Ftirildi\r\n',
	"hcm/emp/myleaverequests/i18n/i18n_zh_CN.properties":'# GUID was created with http://www.famkruithof.net/uuid/uuidgen\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n\r\n#XTIT: Application name (shown in browser header bar or as browser tab title)\r\napp.Identity=\\u6211\\u7684\\u4F11\\u5047\\u7533\\u8BF7\r\n\r\n#XTIT: title of the home view\r\nLR_TITLE_HOME_VIEW=\\u6211\\u7684\\u4F11\\u5047\\u7533\\u8BF7\r\n\r\n#XTIT: title of the leave create view\r\nLR_TITLE_CREATE_VIEW=\\u7533\\u8BF7\\u4F11\\u5047\r\n\r\n#XTIT: title of the leave change view\r\nLR_TITLE_CHANGE_VIEW=\\u66F4\\u6539\\u4F11\\u5047\\u7533\\u8BF7\r\n\r\n#XTIT: title of the Entitlements view\r\nLR_TITLE_BALANCE_VIEW=\\u5E94\\u5F97\\u4F11\\u5047\r\n\r\n#XTIT: title of the leave History view\r\nLR_TITLE_HISTORY_VIEW=\\u5386\\u53F2\\u8BB0\\u5F55\r\n\r\n#XTIT: title of the leave details view\r\nLR_TITLE_DETAILS_VIEW=\\u4F11\\u5047\\u8BE6\\u7EC6\\u4FE1\\u606F\r\n\r\n#XTIT: title of the leave requests\r\nLR_TITLE_LEAVE_REQUESTS=\\u4F11\\u5047\\u7533\\u8BF7\r\n\r\n#XTIT: title of the leave request\r\nLR_TITLE_LEAVE_REQUEST=\\u4F11\\u5047\\u7533\\u8BF7\r\n\r\n#XTIT: deductible\r\nLR_BALANCE_DEDUCTIBLE=\\u7C7B\\u522B\r\n\r\n#XTIT: Balance\r\nLR_BALANCE_BALANCE=\\u53EF\\u7528\r\n\r\n#XTIT: Requested\r\nLR_BALANCE_REQUESTED=\\u5DF2\\u7533\\u8BF7\r\n\r\n#XTIT: Quota\r\nLR_BALANCE_QUOTA=\\u5E94\\u5F97\\u4F11\\u5047\r\n\r\n#XTIT: Entitlement\r\nLR_ENTITLEMENT_QUOTA=\\u5E94\\u5F97\r\n\r\n#XTIT: Send leave request\r\nLR_TITLE_SEND=\\u53D1\\u9001\\u4F11\\u5047\\u7533\\u8BF7\r\n\r\n#XTIT: Cancel leave request\r\nLR_TITLE_WITHDRAW=\\u64A4\\u9500\\u4F11\\u5047\\u7533\\u8BF7\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_BALANCE_TILE=\\u5E94\\u5F97\\u4F11\\u5047\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_HISTORY_TILE=\\u5386\\u53F2\\u8BB0\\u5F55\r\n\r\n#XTIT: ATTENTION Tile text line break after 12 characters!\r\nLR_CREATE_LEAVE_TILE=\\u521B\\u5EFA\\u4F11\\u5047\\u7533\\u8BF7\r\n\r\n#XBUT\r\nLR_SHOW_HIST=\\u5386\\u53F2\\u8BB0\\u5F55\r\n\r\n#XBUT\r\nLR_CREATE_LEAVE=\\u7533\\u8BF7\\u4F11\\u5047\r\n\r\n#XBUT: text for "send leave request" button\r\nLR_SEND=\\u53D1\\u9001\r\n\r\n#XBUT: text for ok button \r\nLR_OK=\\u786E\\u5B9A\r\n\r\n#XBUT: text for reset button \r\nLR_RESET=\\u91CD\\u7F6E\r\n\r\n#XBUT: text for cancel button e.g. on the day range picker screen\r\nLR_CANCEL=\\u53D6\\u6D88\r\n\r\n#XBUT: text for change button on the Leave Overview details screen\r\nLR_CHANGE=\\u66F4\\u6539\r\n\r\n#XBUT: text for cancel button on the Leave Overview details screen\r\nLR_WITHDRAW=\\u64A4\\u9500\r\n\r\n#XSEL\r\nLR_UPDATED=\\u66F4\\u65B0\\u4E8E\r\n\r\n#XFLD\r\nLR_NOTE=\\u6CE8\\u91CA\r\n\r\n#XFLD\r\nLR_CUSTOM1=\\u81EA\\u5B9A\\u4E49\\u5B57\\u6BB5 1\r\n\r\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\r\nLR_BOOKED=\\u5DF2\\u7528\r\n\r\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\r\nLR_REMAINING=\\u53EF\\u7528\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAYS=\\u5929\r\n\r\n#XFLD\r\nLR_LOWERCASE_DAY=\\u5929\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOURS=\\u5C0F\\u65F6\r\n\r\n#XFLD\r\nLR_LOWERCASE_HOUR=\\u5C0F\\u65F6\r\n\r\n#XFLD\r\nLR_UP_TO=\\u6709\\u6548\\u671F\\u81F3\r\n\r\n#XFLD\r\nLR_FROM=\\u81EA\r\n\r\n#XFLD\r\nLR_TO=\\u81F3\r\n\r\n#XFLD: Hyphen for Date Formatting\r\nLR_HYPHEN=-\r\n\r\n#XTIT: title of error dialog\r\nLR_PROBLEM=\\u51FA\\u73B0\\u95EE\\u9898\r\n\r\n#XTIT: title of confirmation dialog\r\nLR_CONFIRMATION=\\u786E\\u8BA4\r\n\r\n#YMSG\r\nLR_CONFIRMATIONMSG=\\u662F\\u5426\\u5C06\\u6B64\\u4F11\\u5047\\u7533\\u8BF7\\u53D1\\u9001\\u7ED9 {0}\\uFF1F\r\n\r\n#YMSG\r\nLR_WITHDRAWNMSG=\\u662F\\u5426\\u8981\\u64A4\\u9500\\u6B64\\u4F11\\u5047\\u7533\\u8BF7\\uFF1F\r\n\r\n#XFLD\r\nLR_DAYS=\\u5929\r\n\r\n#XFLD\r\nLR_DAY=\\u5929\r\n\r\n#XFLD\r\nLR_HOURS=\\u5C0F\\u65F6\r\n\r\n#XFLD\r\nLR_HOUR=\\u5C0F\\u65F6\r\n\r\n#XFLD\r\nLR_REQUEST=\\u5DF2\\u7533\\u8BF7\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_TODAY=\\u4ECA\\u5929\r\n\r\n#XSEL: day type (legend)\r\nLR_DTYPE_SELECTED=\\u9009\\u5B9A\\u7684\\u65E5\\u671F\r\n\r\n#YMSG: processing\r\nLR_PROCESSING=\\u6B63\\u5728\\u5904\\u7406...\r\n\r\n#YMSG\r\nLR_SUBMITDONE=\\u5DF2\\u5C06\\u60A8\\u7684\\u4F11\\u5047\\u7533\\u8BF7\\u53D1\\u9001\\u7ED9 {0}\r\n\r\n#YMSG\r\nLR_WITHDRAWDONE=\\u5DF2\\u64A4\\u9500\\u60A8\\u7684\\u4F11\\u5047\\u7533\\u8BF7\r\n\r\n#YMSG\r\nLR_AX_MODEL_NOT_REG=\\u51FA\\u73B0\\u6280\\u672F\\u95EE\\u9898\\n\\n\\u9519\\u8BEF\\u8BE6\\u7EC6\\u4FE1\\u606F\\uFF1A\\n\\u5185\\u90E8\\u9519\\u8BEF\\uFF1B\\u672A\\u6CE8\\u518C\\u6A21\\u578B\r\n\r\n#YMSG\r\nLR_AX_PARSE_ERR=\\u51FA\\u73B0\\u6280\\u672F\\u95EE\\u9898\\n\\n\\u9519\\u8BEF\\u8BE6\\u7EC6\\u4FE1\\u606F\\uFF1A\\n\\u534F\\u8BAE\\u9519\\u8BEF\\uFF1B\\u65E0\\u6CD5\\u89E3\\u6790 HTTP \\u54CD\\u5E94\r\n\r\n#YMSG\r\nLR_DD_NO_APPROVER=\\u51FA\\u73B0\\u6280\\u672F\\u95EE\\u9898\\n\\n\\u9519\\u8BEF\\u8BE6\\u7EC6\\u4FE1\\u606F\\uFF1A\\n\\u534F\\u8BAE\\u9519\\u8BEF\\uFF1B\\u54CD\\u5E94\\u4E2D\\u7F3A\\u5C11\\u5BA1\\u6279\\u4EBA\\u59D3\\u540D\r\n\r\n#YMSG\r\nLR_DD_NO_CFG=\\u51FA\\u73B0\\u6280\\u672F\\u95EE\\u9898\\n\\n\\u9519\\u8BEF\\u8BE6\\u7EC6\\u4FE1\\u606F\\uFF1A\\n\\u534F\\u8BAE\\u9519\\u8BEF\\uFF1B\\u54CD\\u5E94\\u4E2D\\u7F3A\\u5C11\\u914D\\u7F6E\r\n\r\n#YMSG\r\nLR_DD_NO_BALANCES=\\u51FA\\u73B0\\u6280\\u672F\\u95EE\\u9898\\n\\n\\u9519\\u8BEF\\u8BE6\\u7EC6\\u4FE1\\u606F\\uFF1A\\n\\u534F\\u8BAE\\u9519\\u8BEF\\uFF1B\\u54CD\\u5E94\\u4E2D\\u7F3A\\u5C11\\u5269\\u4F59\\u4F11\\u5047\r\n\r\n#YMSG\r\nLR_DD_PARSE_ERR=\\u51FA\\u73B0\\u6280\\u672F\\u95EE\\u9898\\n\\n\\u9519\\u8BEF\\u8BE6\\u7EC6\\u4FE1\\u606F\\uFF1A\\n\\u534F\\u8BAE\\u9519\\u8BEF\\uFF1B\\u65E0\\u6CD5\\u89E3\\u6790\\u54CD\\u5E94\r\n\r\n#YMSG\r\nLR_DD_COMM_ERR=\\u8FDE\\u63A5\\u51FA\\u73B0\\u95EE\\u9898\r\n\r\n#YMSG\r\nLR_DD_GENERIC_ERR=\\u51FA\\u9519\r\n\r\n#YMSG\r\nLR_CT_PARSE_ERR=\\u51FA\\u73B0\\u6280\\u672F\\u95EE\\u9898\\n\\n\\u9519\\u8BEF\\u8BE6\\u7EC6\\u4FE1\\u606F\\uFF1A\\n\\u534F\\u8BAE\\u9519\\u8BEF\\uFF1B\\u65E0\\u6CD5\\u89E3\\u6790\\u54CD\\u5E94\r\n\r\n#XFLD\r\nLR_S1_PENDING=\\u672A\\u51B3\r\n\r\n#YMSG\r\nLR_UNKNOWN=\\u672A\\u77E5\r\n\r\n#XSEL: (legend)\r\nLR_NONWORKING=\\u975E\\u5DE5\\u4F5C\\u65E5\r\n\r\n#XSEL: (legend)\r\nLR_APPROVELEAVE=\\u5DF2\\u6279\\u51C6\r\n\r\n#XSEL: (legend)\r\nLR_REJECTEDLEAVE=\\u5DF2\\u62D2\\u7EDD\r\n\r\n#XSEL: (legend)\r\nLR_APPROVEPENDING=\\u5F85\\u5BA1\\u6279\r\n\r\n#XSEL: (legend)\r\nLR_PUBLICHOLIDAY=\\u6CD5\\u5B9A\\u5047\\u65E5\r\n\r\n#XSEL: (legend)\r\nLR_WORKINGDAY=\\u5DE5\\u4F5C\\u65E5\r\n\r\n#XSEL: (legend)\r\nLR_DELETIONREQUESTED=\\u5DF2\\u7533\\u8BF7\\u53D6\\u6D88\r\n\r\n#XTIT\r\nLR_DELETION_REQ=\\u53D6\\u6D88\\u7533\\u8BF7\r\n\r\n#XTIT\r\nLR_CHANGE_REQ=\\u53D8\\u66F4\\u7533\\u8BF7\r\n\r\n#XTIT\r\nLR_CHANGE_PENDING=\\u5F85\\u66F4\\u6539\r\n\r\n#XTIT\r\nLR_CANCEL_PENDING=\\u5F85\\u53D6\\u6D88\r\n\r\n#XTIT\r\nLR_CHANGE_DONE=\\u53D8\\u66F4\\u5DF2\\u6279\\u51C6\r\n\r\n#XTIT\r\nLR_CANCEL_DONE=\\u53D6\\u6D88\\u5DF2\\u6279\\u51C6\r\n\r\n#XTIT\r\nLR_OLD_VERSION=\\u539F\\u59CB\r\n\r\n#XTIT\r\nLR_NEW_VERSION=\\u5DF2\\u66F4\\u6539\r\n',
	"hcm/emp/myleaverequests/utils/CalendarTools.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("hcm.emp.myleaverequests.utils.DataManager");

jQuery.sap.declare("hcm.emp.myleaverequests.utils.CalendarTools");

hcm.emp.myleaverequests.utils.CalendarTools = (function() {

	var _resourceBundle = null;

	return {

		// The oCache object holds one attribute for each month that has already been read
		// This attribute holds an Object with one array of days for each of the supported day type based on LR status (SENT, POSTED, APPROVED) 
		// plus one array for the day types derived from the workschedule (WEEKEND, PHOLIDAY)
		oCache : {},

		init : function(oresourceBundle) {
			_resourceBundle = oresourceBundle;
		},

		clearCache : function() {

			hcm.emp.myleaverequests.utils.CalendarTools.oCache = {};
		},

		getDayLabelsForMonth : function(oDate, successCallback, errorCallback) {
			// this method reads the leave requests and work schedules for the month oDate is within and also for the previous and next month.
			// the results are evaluated (leave requests with status SENT, POSTED, APPROVED are considered; workschedules with status 1 
			// (WEEKEND) and 2 (PHOLIDAY) are considered)
			// the results are returned and stored in oCache for later use

			// returns day labels for the complete oDate's month

			// successCallback(oDayLabels, oUserData)
			// oDayLabels example:
			//	{
			//		"PHOLIDAY": ["2013-04-30T22:00:00.000Z",
			//			"2013-05-08T22:00:00.000Z",
			//			"2013-05-18T22:00:00.000Z",
			//			"2013-05-19T22:00:00.000Z"],
			//		"SENT": ["2013-05-01T22:00:00.000Z",
			//			"2013-05-06T22:00:00.000Z",
			//			"2013-05-13T22:00:00.000Z",
			//			"2013-05-14T22:00:00.000Z",
			//			"2013-05-15T22:00:00.000Z",
			//			"2013-05-16T22:00:00.000Z",
			//			"2013-05-20T22:00:00.000Z",
			//			"2013-05-21T22:00:00.000Z",
			//			"2013-05-22T22:00:00.000Z",
			//			"2013-05-23T22:00:00.000Z",
			//			"2013-05-25T22:00:00.000Z",
			//			"2013-05-26T22:00:00.000Z"],
			//		"WEEKEND": ["2013-05-03T22:00:00.000Z",
			//			"2013-05-04T22:00:00.000Z",
			//			"2013-05-10T22:00:00.000Z",
			//			"2013-05-11T22:00:00.000Z",
			//			"2013-05-17T22:00:00.000Z",
			//			"2013-05-24T22:00:00.000Z",
			//			"2013-05-25T22:00:00.000Z"],
			//		"POSTED": ["2013-05-28T22:00:00.000Z",
			//			"2013-05-29T22:00:00.000Z"]
			//	}

			// errorCallback(aErrorMessages, oUserData)

			// check if requested results are already in the cache
			var oRequestedMonthStartDate = hcm.emp.myleaverequests.utils.CalendarTools.calcMonthStartDate(oDate); // use the 1st day of the month as key
			var oNextMonthStartDate = hcm.emp.myleaverequests.utils.CalendarTools.calcNextMonthStartDate(oRequestedMonthStartDate);
			var oPreviousMonthStartDate = hcm.emp.myleaverequests.utils.CalendarTools.calcPreviousMonthStartDate(oRequestedMonthStartDate);
	
			// check if work schedule results are already in the cache for 3 months
			var oCachedResult = hcm.emp.myleaverequests.utils.CalendarTools.oCache[oRequestedMonthStartDate];
			var oCachedResultPrevious = hcm.emp.myleaverequests.utils.CalendarTools.oCache[oPreviousMonthStartDate];
			var oCachedResultNext =hcm.emp.myleaverequests.utils.CalendarTools.oCache[oNextMonthStartDate];
			
			var oStartDate = oPreviousMonthStartDate;
			var oEndDate = oNextMonthStartDate;
			
			//return only if all 3 months work schedules exist
			if (!((oCachedResult == undefined)|| (oCachedResultPrevious == undefined)||( oCachedResultNext == undefined))) {
				successCallback(oCachedResult);
				return;
			}			
			
			//this is for the initial call
			if(oCachedResult == undefined){
				oEndDate = hcm.emp.myleaverequests.utils.CalendarTools.approximateMonthEndDate(oNextMonthStartDate);
			}
			//if previous month doesn't exist
			else if(oCachedResultPrevious == undefined){
				oEndDate = hcm.emp.myleaverequests.utils.CalendarTools.approximateMonthEndDate(oPreviousMonthStartDate);
				oStartDate = new Date(oPreviousMonthStartDate.getFullYear(), oPreviousMonthStartDate.getMonth() - 2, 1);
				oNextMonthStartDate = oPreviousMonthStartDate;
				oPreviousMonthStartDate = oStartDate;
				oRequestedMonthStartDate = new Date(oStartDate.getFullYear(), oStartDate.getMonth() + 1, 1);
			}
			//if next month doesn't exist
			else if(oCachedResultNext == undefined){
				oStartDate = oNextMonthStartDate;
				oEndDate = new Date(oStartDate.getFullYear(), oStartDate.getMonth() + 2, 1);
				oPreviousMonthStartDate = oStartDate;
				oNextMonthStartDate = oEndDate;
				oEndDate = hcm.emp.myleaverequests.utils.CalendarTools.approximateMonthEndDate(oEndDate);
				oRequestedMonthStartDate = new Date(oStartDate.getFullYear(), oStartDate.getMonth() + 1, 1);
			}
			
			var _aLeaveRequests = null;
			var _aWorkSchedules = null;
			var _alreadyFailed = false;

			var fnSuccessCalback = successCallback;
			var fnErrorCallback = errorCallback;

			hcm.emp.myleaverequests.utils.DataManager.getLeaveRequestsForTimePeriod(oStartDate, oEndDate, function(
					aLeaveRequests) {
				if (_alreadyFailed) {
					return;
				}
				_aLeaveRequests = aLeaveRequests;
				if (_aWorkSchedules != null) {
					hcm.emp.myleaverequests.utils.CalendarTools._finish(oStartDate, oEndDate, oRequestedMonthStartDate,
							oPreviousMonthStartDate, oNextMonthStartDate, _aLeaveRequests, _aWorkSchedules, fnSuccessCalback,
							fnErrorCallback);
				}
			}, function(aErrorMessages) {
				if (_alreadyFailed) {
					return;
				}
				_alreadyFailed = true;
				errorCallback(aErrorMessages);
			});

			hcm.emp.myleaverequests.utils.DataManager.getWorkSchedulesForTimePeriod(oStartDate, oEndDate, function(
					aWorkSchedules) {
				if (_alreadyFailed) {
					return;
				}
				_aWorkSchedules = aWorkSchedules;
				if (_aLeaveRequests != null) {
					hcm.emp.myleaverequests.utils.CalendarTools._finish(oStartDate, oEndDate, oRequestedMonthStartDate,
							oPreviousMonthStartDate, oNextMonthStartDate, _aLeaveRequests, _aWorkSchedules, fnSuccessCalback,
							fnErrorCallback);
				}
			}, function(aErrorMessages) {
				if (_alreadyFailed) {
					return;
				}
				_alreadyFailed = true;
				errorCallback(aErrorMessages);
			});
		},

		_calcDayLabelsForMonth : function(_aLeaveRequests, _aWorkSchedules, oMonthStartDate, iDayOffset) {
			// This method checks for every day of the moth the Work Schedules staus and the status of leave requests for that day.
			// It returns an object containing one array of date objects for each of the following categories
			// APPROVED, SENT, POSTED, WEEKEND, PHOLIDAY
			// This information is used in S4 to set the colors of the days in the calendar control
			var oResult = {};
			var iMonthDayCount = hcm.emp.myleaverequests.utils.CalendarTools.calcMonthDayCount(oMonthStartDate);
			for ( var iDay = 0; iDay < iMonthDayCount; iDay++) {
				var oDayDate = new Date(oMonthStartDate.getFullYear(), oMonthStartDate.getMonth(), iDay + 1);
				var bLeaveFound = false;
				for ( var iLeave = 0; iLeave < _aLeaveRequests.length; iLeave++) {
					if (_aLeaveRequests[iLeave].StatusCode
							&& (_aLeaveRequests[iLeave].StatusCode == "SENT" || _aLeaveRequests[iLeave].StatusCode == "POSTED" 
								|| _aLeaveRequests[iLeave].StatusCode == "APPROVED" || _aLeaveRequests[iLeave].StatusCode == "REJECTED")) {
						var oStart = hcm.emp.myleaverequests.utils.Formatters.getDate(_aLeaveRequests[iLeave].StartDate);
						var oEnd = hcm.emp.myleaverequests.utils.Formatters.getDate(_aLeaveRequests[iLeave].EndDate);
						oStart = new Date(oStart.getUTCFullYear(), oStart.getUTCMonth(), oStart.getUTCDate(),0,0,0);
						oEnd = new Date(oEnd.getUTCFullYear(), oEnd.getUTCMonth(), oEnd.getUTCDate(),0,0,0);
						if (hcm.emp.myleaverequests.utils.CalendarTools.dayRangeMatch(oDayDate, oStart, oEnd)) {
							if (!oResult[_aLeaveRequests[iLeave].StatusCode]) {
								oResult[_aLeaveRequests[iLeave].StatusCode] = [oDayDate];
							} else {
								oResult[_aLeaveRequests[iLeave].StatusCode].push(oDayDate);
							}
							bLeaveFound = true;
						}
					}
				}
				if (!bLeaveFound && _aWorkSchedules.length > 0 && _aWorkSchedules[0].StatusValues.length > iDayOffset + iDay) {
					if (_aWorkSchedules[0].StatusValues[iDayOffset + iDay] == '2') {
						if (!oResult["WEEKEND"]) {
							oResult["WEEKEND"] = [oDayDate];
						} else {
							oResult["WEEKEND"].push(oDayDate);
						}
					} else if (_aWorkSchedules[0].StatusValues[iDayOffset + iDay] == '1') {
						if (!oResult["PHOLIDAY"]) {
							oResult["PHOLIDAY"] = [oDayDate];
						} else {
							oResult["PHOLIDAY"].push(oDayDate);
						}
					} else if (_aWorkSchedules[0].StatusValues[iDayOffset + iDay] == '0') {
						if (!oResult["WORKDAY"]) {
							oResult["WORKDAY"] = [oDayDate];
						} else {
							oResult["WORKDAY"].push(oDayDate);
						}
					}
				}
			}
			return oResult;
		},

		_finish : function(oStartDate, oEndDate, oRequestedMonthStartDate, oPreviousMonthStartDate, oNextMonthStartDate,
				_aLeaveRequests, _aWorkSchedules, successCallback, errorCallback) {

			var oDayLabels;

			try {
				var iDayOffset = 0;

				if (oStartDate < oRequestedMonthStartDate) {
					hcm.emp.myleaverequests.utils.CalendarTools.oCache[oPreviousMonthStartDate] = this._calcDayLabelsForMonth(
							_aLeaveRequests, _aWorkSchedules, oPreviousMonthStartDate, 0);
					iDayOffset += hcm.emp.myleaverequests.utils.CalendarTools.calcMonthDayCount(oPreviousMonthStartDate);
				}
				
				oDayLabels = hcm.emp.myleaverequests.utils.CalendarTools.oCache[oRequestedMonthStartDate] = this
						._calcDayLabelsForMonth(_aLeaveRequests, _aWorkSchedules, oRequestedMonthStartDate, iDayOffset);
				iDayOffset += hcm.emp.myleaverequests.utils.CalendarTools.calcMonthDayCount(oRequestedMonthStartDate);

				var oRequestedEndDate = hcm.emp.myleaverequests.utils.CalendarTools
						.approximateMonthEndDate(oRequestedMonthStartDate);
				if (oEndDate > oRequestedEndDate) {
					hcm.emp.myleaverequests.utils.CalendarTools.oCache[oNextMonthStartDate] = this._calcDayLabelsForMonth(
							_aLeaveRequests, _aWorkSchedules, oNextMonthStartDate, iDayOffset);
				}
				
				
				//include all three months
				
				var oDayLabelsPrev = hcm.emp.myleaverequests.utils.CalendarTools.oCache[oPreviousMonthStartDate] ;
				var oDayLabelsNext = hcm.emp.myleaverequests.utils.CalendarTools.oCache[oNextMonthStartDate] ;
				
				var statusList = ["SENT", "APPROVED", "POSTED", "REJECTED", "WEEKEND" , "PHOLIDAY", "WORKDAY" ];
				
				for(var i=0;i<statusList.length;i++){		
					if(!oDayLabels[statusList[i]]){
						oDayLabels[statusList[i]]=[];
					}
					if(oDayLabelsPrev[statusList[i]]){
						for(var j=0;j<oDayLabelsPrev[statusList[i]].length;j++){
							oDayLabels[statusList[i]].push(oDayLabelsPrev[statusList[i]][j]);
						};
					};
					if(oDayLabelsNext[statusList[i]]){
						if(oDayLabelsNext[statusList[i]]){
							for(var k=0;k<oDayLabelsNext[statusList[i]].length;k++){
								oDayLabels[statusList[i]].push(oDayLabelsNext[statusList[i]][k]);
							};
						}
					};
				};			
				
				
			} catch (e) {
				errorCallback([_resourceBundle.getText("LR_CT_PARSE_ERR") + " (CalendarTools.getDayLabelsForMonth)"]);
				return;
			}

			successCallback(oDayLabels);
		},

		calcMonthStartDate : function(oDate) {

			var oMonthStartDate = new Date(oDate.getFullYear(), oDate.getMonth(), 1, 0, 0, 0);
			oMonthStartDate.setMilliseconds(0);
			return oMonthStartDate;
		},

		approximateMonthEndDate : function(oDate) {

			var oEndDate = new Date(oDate.getFullYear(), oDate.getMonth(), 1, 0, 0, 0);
			oEndDate.setDate(oEndDate.getDate() + 31); // a little more does not affect calculations in this scenario
			return oEndDate;
		},

		calcNextMonthStartDate : function(oDate) {

			return new Date(oDate.getFullYear(), oDate.getMonth() + 1, 1);
		},

		calcPreviousMonthStartDate : function(oDate) {

			return new Date(oDate.getFullYear(), oDate.getMonth() - 1, 1);
		},

		calcMonthDayCount : function(oDate) {
			// calculates the number of days of the month containing oDate
			var days = 32 - new Date(oDate.getFullYear(), oDate.getMonth(), 32).getDate();
			if(days < 32 && days >28)
				return days;
			else{
				jQuery.sap.log.warning("Failed to calculate number of days in utils.CalendarTools.calcMonthDayCount with input"+oDate.toString());
				throw "error in calculating number of days in a month.\nFunction:utils.CalendarTools.calcMonthDayCount\nInput: "+oDate.toString()+"\nOutput:"+days;
			}
		},

		dayRangeMatch : function(oDayDate, oStartDate, oEndDate) {

			// is the day described with oDayDate within the range?
			// we calculate with days, therefore we remove the time components, and rely on the fact, that oDayDate does not have one
			var oFixedStart = new Date(oStartDate.getFullYear(), oStartDate.getMonth(), oStartDate.getDate()); // remove time component
			var oFixedEnd = new Date(oEndDate.getFullYear(), oEndDate.getMonth(), oEndDate.getDate()); // remove time component
			if (oFixedStart <= oDayDate && oFixedEnd >= oDayDate) // overlap?
				return true;
			return false;
		}

	};

}());
},
	"hcm/emp/myleaverequests/utils/DataManager.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("hcm.emp.myleaverequests.utils.Formatters");

jQuery.sap.declare("hcm.emp.myleaverequests.utils.DataManager");

hcm.emp.myleaverequests.utils.DataManager = (function() {

	// NOTE: CODE CLEANUP & REFACTORING YET TO COMPLETE 

	var _modelBase = null;
	var _resourceBundle = null;
	var _cachedModelObj = {};
	_cachedModelObj.exist = true;

	return {

		init : function(oDataModel, oresourceBundle) {
			_modelBase = oDataModel;
			_modelBase.setCountSupported(false);
			_resourceBundle = oresourceBundle;
		},

		getBaseODataModel : function() {
			return _modelBase;
		},	
		
		
		setCachedModelObjProp: function(propName, propObj) {
			_cachedModelObj[propName] = propObj;
		},

		getCachedModelObjProp : function(propName) {
			return _cachedModelObj[propName];
		},


		getApprover : function(successCallback, errorCallback) {

			var sPath = "ApproverCollection";
			var arrParams = ["$select=ApproverEmployeeName"];

			this._getOData(sPath, null, arrParams, function(objResponse) {
				var sApproverName = undefined;
				try {
					var oResult = objResponse.results;
					if (oResult instanceof Array) {
						for ( var i = 0; i < oResult.length; i++) {
							sApproverName = oResult[i].ApproverEmployeeName;
						};
					}
					if (sApproverName == undefined) {
						errorCallback([_resourceBundle.getText("LR_DD_NO_APPROVER") + " (DataManager.getApprover)"]);
						return;
					}
				} catch (e) {
					errorCallback([_resourceBundle.getText("LR_DD_PARSE_ERR") + " (DataManager.getApprover)"]);
					return;
				}
				successCallback(sApproverName);
			}, function(objResponse) {
				errorCallback(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse));
			});

		},

		getConfiguration : function() {
			
			var deferredDefaultType = $.Deferred();
			
			var sPath = "ConfigurationCollection";
			var arrParams = ['$select=DefaultAbsenceTypeCode'];

			
			if(!_cachedModelObj.DefaultAbsenceTypeCode){
				this._getOData(sPath, null, arrParams, function(objResponse) {
					var oConfiguration = undefined;
					try {
						var oResult = objResponse.results;
						if (oResult instanceof Array) {
							oConfiguration = oResult[0];
						}					
						if (oConfiguration == undefined) {
							deferredDefaultType.reject(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse));
							return;
						}
					} catch (e) {
						deferredDefaultType.reject(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(e));
						return;
					}
					_cachedModelObj.DefaultAbsenceTypeCode = oConfiguration;			
					//successCallback(oConfiguration);
					deferredDefaultType.resolve(oConfiguration);
					
				}, function(objResponse) {
					deferredDefaultType.reject(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse));
				});
		}else{
			deferredDefaultType.resolve(_cachedModelObj.DefaultAbsenceTypeCode);
		}			
			return deferredDefaultType.promise();
		},

		getAbsenceTypeCollection : function() {
			
			var deferredAbsTypeColl = $.Deferred();
			
			var sPath = "AbsenceTypeCollection";

			var oParams = ['$select=AbsenceTypeName,AbsenceTypeCode,AllowedDurationPartialDayInd,AllowedDurationMultipleDayInd'];
			
			if(!_cachedModelObj.AbsenceTypeCollection){
			
				this._getOData(sPath, null, oParams, function(objResponse) {
					
					_cachedModelObj.AbsenceTypeCollection = objResponse.results;					
					//successCallback(objResponse.results);
					deferredAbsTypeColl.resolve(objResponse.results);
					
				}, function(objResponse) {
					deferredAbsTypeColl.reject(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse));
				});
				
			}else{
				deferredAbsTypeColl.resolve(_cachedModelObj.AbsenceTypeCollection);
			}
			return deferredAbsTypeColl.promise();
			
		},

		getBalancesForAbsenceType : function(sAbsenceTypeCode, successCallback, errorCallback) {

			var sDate = hcm.emp.myleaverequests.utils.Formatters.DATE_YYYYMMdd(new Date()) + 'T00%3A00%3A00';
			var sPath = "AbsenceTypeCollection(EmployeeID='',StartDate=datetime'" + sDate + "',AbsenceTypeCode='" + sAbsenceTypeCode + "')/absenceTypeTimeAccount";

			var arrParams = ["$select=BalancePlannedQuantity,BalanceAvailableQuantity,BalanceUsedQuantity,TimeUnitName,TimeAccountTypeName"];

			this._getOData(
							sPath,
							null,
							arrParams,
							function(objResponse) {
								var sBalancePlanned, sBalanceAvailable, sTimeUnitNamePlanned = _resourceBundle.getText("LR_DAYS"), sTimeUnitNameAvailable = _resourceBundle
										.getText("LR_DAYS"), sTimeAccountTypeName = undefined,sBalanceTotalUsedQuantity;
								try {
									// var oResult = JSON.parse(sResponse).d.results;
									var oResult = objResponse.results;
									var iBalancePlanned = 0, iBalanceAvailable = 0, iBalanceUsed = 0;
									if (oResult instanceof Array) {
										for ( var i = 0; i < oResult.length; i++) {
											iBalancePlanned += oResult[i].BalancePlannedQuantity * 1;
											iBalanceAvailable += oResult[i].BalanceAvailableQuantity * 1;
											iBalanceUsed += oResult[i].BalanceUsedQuantity * 1;
											sTimeUnitNamePlanned = oResult[i].TimeUnitName;
											sTimeUnitNameAvailable = oResult[i].TimeUnitName;
											sTimeAccountTypeName = oResult[i].TimeAccountTypeName;
										}
										//TODO: 
										/*
										 * if (oUserData.iBalanceRoundToDigits) { iBalanceAvailable = Math.round(iBalanceAvailable *
										 * Math.pow(10, oUserData.iBalanceRoundToDigits)) / Math.pow(10, oUserData.iBalanceRoundToDigits); }
										 */
									}
									sBalancePlanned = hcm.emp.myleaverequests.utils.Formatters.BALANCE(iBalancePlanned + "");
									sBalanceAvailable = hcm.emp.myleaverequests.utils.Formatters.BALANCE(iBalanceAvailable + "");
									var sBalanceUsed; // additional property, can be used in App Designer as a so far not used one
									sBalanceUsed = hcm.emp.myleaverequests.utils.Formatters.BALANCE(iBalanceUsed + "");
									
									sBalanceTotalUsedQuantity = hcm.emp.myleaverequests.utils.Formatters.BALANCE(parseFloat(iBalanceUsed) + parseFloat(iBalancePlanned) + "");
									
								} catch (e) {
									errorCallback([_resourceBundle.getText("LR_DD_PARSE_ERR") + " (DataManager.getBalancesForAbsenceType)"]);
									return;
								}
								successCallback(sBalancePlanned, sTimeUnitNamePlanned, sBalanceAvailable, sTimeUnitNameAvailable,
										sTimeAccountTypeName, sBalanceUsed, sBalanceTotalUsedQuantity);
							}, function(objResponse) {
								errorCallback(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse));
							});
		},

		getPendingLeaves : function(successCallback, errorCallback) {

			this.getConsolidatedLeaveRequests(function(sPendingLeaves) {
				var aLeaveRequests = sPendingLeaves.LeaveRequestCollection;
				var iPendingLeaves = 0;
				for ( var i = 0; i < aLeaveRequests.length; i++) {
					if (aLeaveRequests[i].StatusCode == "SENT") {
						iPendingLeaves++;
					} else if (aLeaveRequests[i].aRelatedRequests != undefined && aLeaveRequests[i].aRelatedRequests.length > 0) {
						if (aLeaveRequests[i].aRelatedRequests[0].StatusCode == "SENT") {
							iPendingLeaves++;
						}
					}
				}
				successCallback(iPendingLeaves + "");
			}, errorCallback);
		},

		getConsolidatedLeaveRequests : function(successCallback, errorCallback) {

			var sPath = "LeaveRequestCollection";

			var oParams = ['$select=EmployeeID,RequestID,ChangeStateID,LeaveKey,ActionCode,StatusCode,StatusName,AbsenceTypeCode,AbsenceTypeName,StartDate,StartTime,EndDate,EndTime,WorkingHoursDuration,WorkingDaysDuration,Notes,ActionDeleteInd,ActionModifyInd,LeaveRequestType'];

			// var _today = new Date();
			// var sRelativeUrl = "LeaveRequestCollection?$filter=StartDate gt datetime'1950-01-01T00:00:00' and EndDate eq
			// datetime'"
			// + (_today.getFullYear() + 3).toString()
			// +
			// "-01-01T00:00:00'&$select=EmployeeID,RequestID,ChangeStateID,LeaveKey,ActionCode,StatusCode,StatusName,AbsenceTypeCode,AbsenceTypeName,StartDate,StartTime,EndDate,EndTime,WorkingHoursDuration,WorkingDaysDuration,Notes,ActionDeleteInd,ActionModifyInd,LeaveRequestType";

			this._getOData(sPath, null, oParams, function(objResponse) {
				var aLeaveRequests = [];
				try {
					// var oResult = this.getLeaveRequestCollectionDataFromXml(this.parseXml(sResponse));

					var oResult = objResponse.results;
					if (!oResult instanceof Array) {
						errorCallback([_resourceBundle.getText("LR_DD_NO_CFG") + " (DataManager.getConsolidatedLeaveRequests)"]);
						return;
					}
					var oRelatedRequestsByLeaveKey = {}; // object of arrays
					for ( var i = 0; i < oResult.length; i++) {
						if ((oResult[i].LeaveRequestType == "2" || oResult[i].LeaveRequestType == "3") && oResult[i].LeaveKey) {
							if (!oRelatedRequestsByLeaveKey[oResult[i].LeaveKey]) {
								oRelatedRequestsByLeaveKey[oResult[i].LeaveKey] = [];
							}
							oRelatedRequestsByLeaveKey[oResult[i].LeaveKey].push(oResult[i]);
						}
					}
					for ( var i = 0; i < oResult.length; i++) {
						if (oResult[i].LeaveRequestType != "2" && oResult[i].LeaveRequestType != "3") {
							if (oResult[i].LeaveKey && oRelatedRequestsByLeaveKey[oResult[i].LeaveKey]) {
								oResult[i].aRelatedRequests = oRelatedRequestsByLeaveKey[oResult[i].LeaveKey];
								for ( var j = 0; j < oResult[i].aRelatedRequests.length; j++) {
								      oResult[i].Notes =oResult[i].aRelatedRequests[j].Notes + oResult[i].Notes;
								}
							}
							aLeaveRequests.push(oResult[i]);
						}
					}
				} catch (e) {
					errorCallback([_resourceBundle.getText("LR_DD_PARSE_ERR") + " (DataManager.getConsolidatedLeaveRequests)"]);
					return;
				}
				successCallback({
					LeaveRequestCollection : aLeaveRequests
				});
			}, function(objResponse) {
				errorCallback(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse));
			});
		},

		getTimeAccountCollection : function(successCallback, errorCallback) {

			var sPath = "TimeAccountCollection";
			this._getOData(sPath, null, null, function(objResponse) {
				var aTimeAccounts = [];
				try {
					// var oResult = this.getTimeAccountCollectionDataFromXml(this.parseXml(sResponse));
					var oResult = objResponse.results;
					if (!oResult instanceof Array) {
						errorCallback([_resourceBundle.getText("LR_DD_NO_CFG") + " (DataManager.getTimeAccountCollection)"]);
						return;
					}
					for ( var i = 0; i < oResult.length; i++) {
						delete oResult[i]['__metadata'];
						aTimeAccounts.push(oResult[i]);
					}
				} catch (e) {
					errorCallback([_resourceBundle.getText("LR_DD_PARSE_ERR") + " (DataManager.getTimeAccountCollection)"]);
					return;
				}
				successCallback({
					TimeAccountCollection : aTimeAccounts
				});
			}, function(objResponse) {
				errorCallback(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse));
			});
		},

		submitLeaveRequest : function(sStartDate, sStartTime, sEndDate, sEndTime, sAbsenceTypeCode, sNotes,
				bProcessCheckOnlyInd, successCallback, errorCallback) {

			// oResult example:
			// {
			// "EmployeeID": "14000002",
			// "RequestID": "B3D85951A07B020FE10000000A42D033",
			// "ChangeStateID": "0000000001",
			// "LeaveKey": "",
			// "ActionCode": 0,
			// "ProcessCheckOnlyInd": true,
			// "StatusCode": "SENT",
			// "StatusName": "Sent",
			// "AbsenceTypeCode": "0100",
			// "AbsenceTypeName": "Vacation",
			// "StartDate": Date,
			// "StartTime": "PT00H00M00S",
			// "EndDate": Date,
			// "EndTime": "PT00H00M00S",
			// "WorkingHoursDuration": "7.20",
			// "WorkingDaysDuration": "1.00",
			// "ApproverEmployeeID": "14000002",
			// "ApproverEmployeeName": "John Doe",
			// "Notes": " 02.04.2013 16:05:38 (CET) John Doe \r\n test notice \r\n",
			// "ActionDeleteInd": true,
			// "ActionModifyInd": true,
			// "LastChangeDate": Date,
			// "LastChangeTime": "PT16H05M38S",
			// "LastChangeEmployeeName": "",
			// "SequenceID": 0,
			// "LeaveRequestType": 1,
			// "FirstSubmissionDate": Date,
			// "FirstSubmissionTime": "PT16H05M38S"
			// }

			var sBody = {};

			sBody.StartDate = sStartDate;
			sBody.StartTime = sStartTime;
			sBody.Notes = sNotes;
			sBody.ProcessCheckOnlyInd = (bProcessCheckOnlyInd ? true : false);
			sBody.AbsenceTypeCode = sAbsenceTypeCode;
			sBody.EndDate = sEndDate;
			sBody.EndTime = sEndTime;

			this._postOData("LeaveRequestCollection", sBody, function(objResponseData, objResponse) {
				var objMsg = "";
				if(objResponse.headers["sap-message"]){
					objMsg = JSON.parse(objResponse.headers["sap-message"]);
				}
				
				successCallback(objResponseData, objMsg);
			}, function(objResponseData) {
				errorCallback(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponseData));
			});
		},

		changeLeaveRequest : function(sEmployeeId, sRequestId, sChangeStateId, sLeaveKey, sStartDate, sStartTime, sEndDate,
				sEndTime, sAbsenceTypeCode, sNotes, bProcessCheckOnlyInd, successCallback, errorCallback) {

			// oResult example:
			// {
			// "EmployeeID": "14000002",
			// "RequestID": "B3D85951A07B020FE10000000A42D033",
			// "ChangeStateID": "0000000001",
			// "LeaveKey": "",
			// "ActionCode": 0,
			// "ProcessCheckOnlyInd": true,
			// "StatusCode": "SENT",
			// "StatusName": "Sent",
			// "AbsenceTypeCode": "0100",
			// "AbsenceTypeName": "Vacation",
			// "StartDate": Date,
			// "StartTime": "PT00H00M00S",
			// "EndDate": Date,
			// "EndTime": "PT00H00M00S",
			// "WorkingHoursDuration": "7.20",
			// "WorkingDaysDuration": "1.00",
			// "ApproverEmployeeID": "14000002",
			// "ApproverEmployeeName": "John Doe",
			// "Notes": " 02.04.2013 16:05:38 (CET) John Doe \r\n test notice \r\n",
			// "ActionDeleteInd": true,
			// "ActionModifyInd": true,
			// "LastChangeDate": Date,
			// "LastChangeTime": "PT16H05M38S",
			// "LastChangeEmployeeName": "",
			// "SequenceID": 0,
			// "LeaveRequestType": 1,
			// "FirstSubmissionDate": Date,
			// "FirstSubmissionTime": "PT16H05M38S"
			// }

			var sBody = {};
			sBody.ActionCode = 02;
			sBody.EmployeeID = sEmployeeId;
			sBody.RequestID = sRequestId;
			sBody.ChangeStateID = sChangeStateId;
			sBody.LeaveKey = sLeaveKey;
			sBody.StartDate = sStartDate;
			sBody.StartTime = sStartTime;
			sBody.Notes = sNotes;
			sBody.ProcessCheckOnlyInd = (bProcessCheckOnlyInd ? true : false);
			sBody.AbsenceTypeCode = sAbsenceTypeCode;
			sBody.EndDate = sEndDate;
			sBody.EndTime = sEndTime;

			this._postOData("LeaveRequestCollection", sBody, function(objResponseData, objResponse) {
				var objMsg = "";
				if(objResponse.headers["sap-message"]){
					objMsg = JSON.parse(objResponse.headers["sap-message"]);
				}
				successCallback(objResponseData, objMsg);
			}, function(objResponseData) {
				errorCallback(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponseData));
			});
		},

		withdrawLeaveRequest : function(sStatusCode, sEmployeeId, sRequestId, sChangeStateId, sLeaveKey, successCallback,
				errorCallback) {

			if (this.isRecallableLeaveRequest(sStatusCode, sLeaveKey)) {
				this.recallLeaveRequest(sEmployeeId, sRequestId, sChangeStateId, sLeaveKey, successCallback, errorCallback);
			} else {
				this.createDeleteLeaveRequest(sEmployeeId, sRequestId, sChangeStateId, sLeaveKey, successCallback,
						errorCallback);
			}
		},

		getLeaveRequestsForTimePeriod : function(oStartDate, oEndDate, successCallback, errorCallback) {

			// aLeaveRequests example:
			// [{
			// "StatusCode": "REJECTED",
			// "StatusName": "Abgelehnt",
			// "AbsenceTypeCode": "0148",
			// "AbsenceTypeName": "Krankheit",
			// "StartDate": Date,
			// "StartTime": "PT00H00M00S",
			// "EndDate": Date,
			// "EndTime": "PT00H00M00S",
			// },
			// {
			// "StatusCode": "REJECTED",
			// "StatusName": "Abgelehnt",
			// "AbsenceTypeCode": "0148",
			// "AbsenceTypeName": "Krankheit",
			// "StartDate": Date,
			// "StartTime": "PT00H00M00S",
			// "EndDate": Date,
			// "EndTime": "PT00H00M00S",
			// }]

			// GET
			// /sap/opu/odata/GBHCM/LEAVEREQUEST;v=2/LeaveRequestCollection?$format=json&$filter=StartDate%20eq%20datetime'2013-01-01T00%3A00%3A00'
			// HTTP/1.1

			var sStartDate = hcm.emp.myleaverequests.utils.Formatters.DATE_YYYYMMdd(oStartDate) + 'T00:00:00';
			var sEndDate = hcm.emp.myleaverequests.utils.Formatters.DATE_YYYYMMdd(oEndDate) + 'T00:00:00';
			var sPath = "LeaveRequestCollection";

			var arrParams = ["$filter=StartDate eq datetime'" + sStartDate + "' and EndDate eq datetime'" + sEndDate + "'",
					"$select=StatusCode,StatusName,AbsenceTypeCode,AbsenceTypeName,StartDate,StartTime,EndDate,EndTime"];

			this._getOData(sPath, null, arrParams, function(objResponse) {
				var aLeaveRequests = [];
				try {
					var oResult = objResponse.results;

					if (oResult instanceof Array) {
						for ( var i = 0; i < oResult.length; i++) {
							var oRequest = new Object();
							oRequest.StatusCode = oResult[i].StatusCode;
							oRequest.StatusName = oResult[i].StatusName;
							oRequest.AbsenceTypeCode = oResult[i].AbsenceTypeCode;
							oRequest.AbsenceTypeName = oResult[i].AbsenceTypeName;
							oRequest.StartDate = oResult[i].StartDate;
							oRequest.StartTime = oResult[i].StartTime;
							oRequest.EndDate = oResult[i].EndDate;
							oRequest.EndTime = oResult[i].EndTime;
							aLeaveRequests.push(oRequest);
						}
					}
				} catch (e) {
					errorCallback([_resourceBundle.getText("LR_DD_PARSE_ERR") + " (DataManager.getLeaveRequestsForTimePeriod)"]);
					return;
				}
				successCallback(aLeaveRequests);
			}, function(objResponse) {
				errorCallback(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse));
			});
		},

		getWorkSchedulesForTimePeriod : function(oStartDate, oEndDate, successCallback, errorCallback) {

			// aWorkSchedules example:
			// [{
			// "StartDate": Date,
			// "EndDate": Date,
			// "StatusValues": "222000000220200222200000",
			// },
			// {
			// "StartDate": Date,
			// "EndDate": Date,
			// "StatusValues": "222000000220200222200000",
			// }]

			// GET
			// /sap/opu/odata/GBHCM/LEAVEREQUEST;v=2/WorkScheduleCollection?$format=json&$filter=StartDate%20eq%20datetime'2013-3-1T00%3A00'and%20EndDate%20eq%20datetime'2013-5-31T00%3A00'
			// HTTP/1.1

			var sStartDate = hcm.emp.myleaverequests.utils.Formatters.DATE_YYYYMMdd(oStartDate) + 'T00:00:00';
			var sEndDate = hcm.emp.myleaverequests.utils.Formatters.DATE_YYYYMMdd(oEndDate) + 'T00:00:00';
			var sPath = "WorkScheduleCollection";

			var arrParams = ["$filter=StartDate eq datetime'" + sStartDate + "' and EndDate eq datetime'" + sEndDate + "'", "$select=StartDate,EndDate,StatusValues"];

			this._getOData(sPath, null, arrParams, function(objResponse) {
				var aWorkSchedules = [];
				try {
					// var oResult = this.getWorkScheduleCollectionDataFromXml(this.parseXml(sResponse));
					var oResult = objResponse.results;
					if (oResult instanceof Array) {
						for ( var i = 0; i < oResult.length; i++) {
							var oSchedule = new Object();
							oSchedule.StartDate = oResult[i].StartDate;
							oSchedule.EndDate = oResult[i].EndDate;
							oSchedule.StatusValues = oResult[i].StatusValues;
							aWorkSchedules.push(oSchedule);
						}
					}
				} catch (e) {
					errorCallback([_resourceBundle.getText("LR_DD_PARSE_ERR") + " (DataManager.getWorkSchedulesForTimePeriod)"]);
					return;
				}
				successCallback(aWorkSchedules);
			}, function(objResponse) {
				errorCallback(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse));
			});
		},

		// =======
		// private
		// =======

		isRecallableLeaveRequest : function(sStatusCode, sLeaveKey) {
			if (sStatusCode == "CREATED")
				return true;
			if (!sLeaveKey)
				return true;
			for ( var i = 0; i < sLeaveKey.length; i++) {
				var c = sLeaveKey.charAt(i);
				if (c != " " && c != "\t" && c != "\v" && c != "\r" && c != "\n" && c != "0")
					return false;
			}
			return true;
		},

		createDeleteLeaveRequest : function(sEmployeeId, sRequestId, sChangeStateId, sLeaveKey, successCallback,
				errorCallback) {

			var sBody = {};
			sBody.ActionCode = 03;
			sBody.EmployeeID = sEmployeeId;
			sBody.RequestID = sRequestId;
			sBody.ChangeStateID = sChangeStateId;
			sBody.LeaveKey = sLeaveKey;
			sBody.ProcessCheckOnlyInd = false;

			this._postOData("LeaveRequestCollection", sBody, function(objResponseData, objResponse) {
				var objMsg = "";
				if(objResponse.headers["sap-message"]){
					objMsg = JSON.parse(objResponse.headers["sap-message"]);
				}
				successCallback(objResponseData, objMsg);
			}, function(objResponseData) {
				errorCallback(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponseData));
			});
		},

		recallLeaveRequest : function(sEmployeeId, sRequestId, sChangeStateId, sLeaveKey, successCallback, errorCallback) {

			this._deleteOData("LeaveRequestCollection(EmployeeID='" + sEmployeeId + "',RequestID='" + sRequestId + "',ChangeStateID='" + sChangeStateId + "',LeaveKey='" + sLeaveKey + "')", function(objResponse) {
				successCallback(objResponse);
			}, function(objResponse) {
				errorCallback(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse));
			});
		},

		parseErrorMessages : function(objResponse) {

			if (objResponse.response.body && objResponse.response) {
				var dynamicSort = function(property) {
					var sortOrder = 1;
					if(property[0] === "-") {
						sortOrder = -1;
						property = property.substr(1);
					}
					return function (a,b) {
						var result;
						if(a[property] < b[property]){
							result =-1;
						}else if(a[property] > b[property]){
							result=1;
						}else{
							result=0;
						}
						return result * sortOrder;
					};
				};
				try {
					var oResponse = JSON.parse(objResponse.response.body);
					if (oResponse.error && oResponse.error.message && oResponse.error.message.value) {
						var result = [];
						result.push(oResponse.error.message.value);
						if (oResponse.error.innererror && oResponse.error.innererror.errordetails
								&& oResponse.error.innererror.errordetails instanceof Array) {
							oResponse.error.innererror.errordetails.sort(dynamicSort("severity"));
							for ( var i = 0; i < oResponse.error.innererror.errordetails.length; i++) {
								if (oResponse.error.innererror.errordetails[i].message) {
									var message = oResponse.error.innererror.errordetails[i].message;
									/*if (oResponse.error.innererror.errordetails[i].code) {
										message += " [" + oResponse.error.innererror.errordetails[i].code + "]";
									}*/
									if (oResponse.error.innererror.errordetails[i].severity) {
										message += " (" + oResponse.error.innererror.errordetails[i].severity + ")";
									}
									result.push(message);
								};
							};
						}
						return result;
					};
				} catch (e) {
					// NOP
				};
			} else {
				return [_resourceBundle.getText("LR_DD_COMM_ERR") + objResponse.message];
			};
		},

		getXmlNodeValue : function(oNode) {

			try {
				if (oNode.childNodes.length != 1)
					return null;
				switch (oNode.childNodes[0].nodeType) {
					case 3 :
						return oNode.childNodes[0].data;
				}
			} catch (e) {
				return null;
			};
		},

		getDateFromString : function(sValue) {

			// creates a date from yyyy-mm-ddTHH:MM:SS without timezone shift
			if (sValue.length != 19)
				return null;
			if (sValue.charAt(4) != '-' || sValue.charAt(7) != '-' || sValue.charAt(10) != 'T' || sValue.charAt(13) != ':' || sValue.charAt(16) != ':')
				return null;
			var year = sValue.substring(0, 4) * 1;
			var month = sValue.substring(5, 7) * 1;
			var day = sValue.substring(8, 10) * 1;
			var hour = sValue.substring(11, 13) * 1;
			var minute = sValue.substring(14, 16) * 1;
			var second = sValue.substring(17, 19) * 1;
			return new Date(year, month - 1, day, hour, minute, second);
		},

		populateLeaveRequest : function(leaveRequestProperties) {

			var oLeaveRequest = {};
			for ( var leaveRequestPropertyIdx = 0; leaveRequestPropertyIdx < leaveRequestProperties.length; leaveRequestPropertyIdx++) {
				var value = hcm.emp.myleaverequests.utils.DataManager.getXmlNodeValue(leaveRequestProperties[leaveRequestPropertyIdx]);
				if (value) {
					switch (leaveRequestProperties[leaveRequestPropertyIdx].localName) {
						case "ActionCode" :
						case "LeaveRequestType" :
						case "SequenceID" :
							oLeaveRequest[leaveRequestProperties[leaveRequestPropertyIdx].localName] = value * 1;
							break;
						case "ActionDeleteInd" :
						case "ActionModifyInd" :
						case "ProcessCheckOnlyInd" :
							oLeaveRequest[leaveRequestProperties[leaveRequestPropertyIdx].localName] = value == "true";
							break;
						case "EndDate" :
						case "FirstSubmissionDate" :
						case "LastChangeDate" :
						case "StartDate" :
							oLeaveRequest[leaveRequestProperties[leaveRequestPropertyIdx].localName] = hcm.emp.myleaverequests.utils.DataManager.getDateFromString(value);
							break;
						default :
							oLeaveRequest[leaveRequestProperties[leaveRequestPropertyIdx].localName] = value;
					}
				}
			}
			return oLeaveRequest;
		},

		populateTimeAccount : function(timeAccountProperties) {

			var oLeaveRequest = {};
			for ( var timeAccountPropertyIdx = 0; timeAccountPropertyIdx < timeAccountProperties.length; timeAccountPropertyIdx++) {
				var value = hcm.emp.myleaverequests.utils.DataManager.getXmlNodeValue(timeAccountProperties[timeAccountPropertyIdx]);
				if (value) {
					switch (timeAccountProperties[timeAccountPropertyIdx].localName) {
						case "DeductionStartDate" :
						case "DeductionEndDate" :
							oLeaveRequest[timeAccountProperties[timeAccountPropertyIdx].localName] = hcm.emp.myleaverequests.utils.DataManager.getDateFromString(value);
							break;
						default :
							oLeaveRequest[timeAccountProperties[timeAccountPropertyIdx].localName] = value;
					}
				}
			}
			return oLeaveRequest;
		},

		_getOData : function(sPath, oContext, oUrlParams, successCallback, errorCallback) {

			_modelBase.read(sPath, oContext, oUrlParams, true, function(response) {
				successCallback(response);
			}, function(response) {
				errorCallback(response);
			});

		},

		_postOData : function(sPath, sBody, successCallback, errorCallback) {
			_modelBase.create(sPath, sBody, null, successCallback, errorCallback);
		},

		_deleteOData : function(sPath, successCallback, errorCallback) {

			var oParameters = {};
			oParameters.fnSuccess = successCallback;
			oParameters.fnError = errorCallback;
			_modelBase.remove(sPath, oParameters);
		}

	};

}());
},
	"hcm/emp/myleaverequests/utils/Formatters.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");

jQuery.sap.declare("hcm.emp.myleaverequests.utils.Formatters");

hcm.emp.myleaverequests.utils.Formatters = (function() {

	return {

		init : function(resourseBundle) {

			this.resourceBundle = resourseBundle;
		},

		getDate : function(oValue) {

			var oDate;

			if (oValue instanceof Date) {
				oDate = oValue;
			} else {
				if (typeof oValue != 'string' && !(oValue instanceof String))
					return null;
				if (oValue.length < 8)
					return null;
				if (oValue.substring(0, 6) != "/Date("
						|| oValue.substring(oValue.length - 2, oValue.length) != ")/") {
					return null;
				}
				var dateValue = oValue.substring(6, 6 + oValue.length - 8);
				oDate = new Date();
				oDate.setTime(dateValue * 1);
			}

			return oDate;
		},

		stripDecimals : function(sNumber) {

			while (sNumber.length > 0 && sNumber.charAt(0) == "0") {
				sNumber = sNumber.substring(1, 1 + sNumber.length - 1);
			}

			var pos = sNumber.indexOf(".");
			if (pos < 0) {
				if (sNumber.length < 1)
					return "0";
				return sNumber;
			}

			while (sNumber.charAt(sNumber.length - 1) == "0") {
				sNumber = sNumber.substring(0, sNumber.length - 1);
			}
			if (sNumber.charAt(sNumber.length - 1) == ".") {
				sNumber = sNumber.substring(0, sNumber.length - 1);
			}

			if (sNumber.length < 1)
				return "0";

			if (sNumber.length > 0 && sNumber.charAt(0) == ".") {
				return "0" + sNumber;
			}

			return sNumber;
		},

		adjustSeparator : function(number) {

			try {
				if (!isNaN(parseFloat(number)) && isFinite(number)) {
					var numberFormatter = sap.ca.ui.model.format.NumberFormat
							.getInstance();
					if(number.indexOf(".")>0)//truncating decimals only if they exist
					numberFormatter.oFormatOptions.decimals=2;
					return numberFormatter.format(number);
				}
			} catch (e) {
			}
			return "";
		},

		// format date MMMyyyy
		DATE_ODATA_MMMyyyy : function(oValue) {

			var oDate = hcm.emp.myleaverequests.utils.Formatters
					.getDate(oValue);

			if (oDate != null) {
				var oDateFormat = sap.ca.ui.model.format.DateFormat
						.getInstance({
							pattern : "MMM yyyy"
						});

				return oDateFormat.format(oDate,true);
			} else {
				return null;
			}
		},

		// format date EEEdMMMyyyy
		DATE_ODATA_EEEdMMMyyyy : function(oValue, sStyle) {

			var oDate = hcm.emp.myleaverequests.utils.Formatters
					.getDate(oValue);

			if (oDate != null) {
				if (sStyle) {
					var oDateFormat = sap.ca.ui.model.format.DateFormat
							.getInstance({
								style : sStyle
							});
					return oDateFormat.format(oDate,true);
				} else {
					if (jQuery.device.is.phone === true) {
						var oDateFormat = sap.ca.ui.model.format.DateFormat
								.getInstance({
									style : "medium"
								});
						return oDateFormat.format(oDate,true);
					} else {
						var oDateFormat = sap.ca.ui.model.format.DateFormat
								.getInstance({
									style : "medium"
								});
						return oDateFormat.format(oDate,true);
					}
					;
				}
				;
			} else {
				return null;
			}
		},


		// format date EEEdMMMyyyy
		DATE_ODATA_EEEdMMMyyyyLong : function(oValue, sStyle) {

			var oDate = hcm.emp.myleaverequests.utils.Formatters
					.getDate(oValue);

			if (oDate != null) {
				if (sStyle) {
					var oDateFormat = sap.ca.ui.model.format.DateFormat
							.getInstance({
								style : sStyle
							});
					return oDateFormat.format(oDate,true);
				} else {
					if (jQuery.device.is.phone === true) {
						var oDateFormat = sap.ca.ui.model.format.DateFormat
								.getInstance({
									style : "long"
								});
						return oDateFormat.format(oDate,true);
					} else {
						var oDateFormat = sap.ca.ui.model.format.DateFormat
								.getInstance({
									style : "full"
								});
						return oDateFormat.format(oDate,true);
					}
					;
				}
				;
			} else {
				return null;
			}
		},
		
		// format date ddMMMyyyy
		DATE_ODATA_ddMMMyyyy : function(oValue) {
			var oDate = hcm.emp.myleaverequests.utils.Formatters
					.getDate(oValue);

			if (oDate != null) {
				var oDateFormat = sap.ca.ui.model.format.DateFormat
						.getInstance({
							pattern : "dd.MM.yyyy"
						});
				return oDateFormat.format(oDate,true);
			} else {
				return null;
			}
		},

		// format date YYYYMMdd
		DATE_YYYYMMdd : function(oDate) {

			if (oDate == undefined)
				return "";

			var oDateFormat = sap.ca.ui.model.format.DateFormat.getInstance({
				pattern : "YYYY-MM-dd"
			});

			return oDateFormat.format(oDate);
		},

		BALANCE : function(oValue) {

			if (oValue == undefined)
				return "";

			if (typeof oValue != 'string' && !(oValue instanceof String))
				return "";

			return hcm.emp.myleaverequests.utils.Formatters
					.adjustSeparator(hcm.emp.myleaverequests.utils.Formatters
							.stripDecimals(oValue));
		},
		
		//return duration Hours in 00:00 format 
        DURATION_FORMAT : function(sHours)
        {
            if(sHours.indexOf(".")>-1){
             var duration = sHours.split(".");
             var hours = duration[0].toString();
             if(parseInt(duration[1])<10) duration[1]=parseInt(duration[1])*10;
             var minutes = (parseInt(duration[1])*60)/100 ;
             minutes = Math.round(minutes);
             minutes = minutes.toString();
         if (minutes<10)minutes = "0"+minutes;
         return hours+":"+minutes;
           }else
         return sHours+":00";
               
        },
        
		// return duration days or hours depending on input
		DURATION : function(sDays, sHours) {

			if (sDays == undefined || sHours == undefined)
				return "";

			sDays = hcm.emp.myleaverequests.utils.Formatters
					.stripDecimals(sDays);

			var pos = sDays.indexOf(".");
			if (pos < 0)
				return hcm.emp.myleaverequests.utils.Formatters
						.adjustSeparator(sDays);

			return hcm.emp.myleaverequests.utils.Formatters.DURATION_FORMAT(hcm.emp.myleaverequests.utils.Formatters.stripDecimals(sHours));
		},

		// determine duration unit based on leave time range
		DURATION_UNIT : function(sDays, sHours) {

			if (sDays == undefined || sHours == undefined)
				return "";

			sDays = hcm.emp.myleaverequests.utils.Formatters
					.stripDecimals(sDays);

			var pos = sDays.indexOf(".");
			if (pos < 0)
				return (sDays * 1 != 1) ? hcm.emp.myleaverequests.utils.Formatters.resourceBundle
						.getText("LR_DAYS")
						: hcm.emp.myleaverequests.utils.Formatters.resourceBundle
								.getText("LR_DAY");

			return (sHours * 1 != 1) ? hcm.emp.myleaverequests.utils.Formatters.resourceBundle
					.getText("LR_HOURS")
					: hcm.emp.myleaverequests.utils.Formatters.resourceBundle.getText("LR_HOUR");
		},

		// check leave time range whether below 1 day
		isHalfDayLeave : function(sDays) {

			if (sDays == undefined)
				return false;

			sDays = hcm.emp.myleaverequests.utils.Formatters
					.stripDecimals(sDays);

			var pos = sDays.indexOf(".");
			if (pos < 0)
				return false;

			return true;
		},

		// time formatter
		TIME_hhmm : function(oValue) {

			if (oValue == undefined)
				return "";

			var oDate;

			if (oValue instanceof Date) {
				oDate = oValue;
			} else if (oValue.ms) {
				var hours = (oValue.ms / (3600 * 1000)) | 0;
				var minutes = ((oValue.ms - (hours * 3600 * 1000)) / (60 * 1000)) | 0;
				var seconds = ((oValue.ms - (hours * 3600 * 1000) - (minutes * 60 * 1000)) / 1000) | 0;
				oDate = new Date();
				oDate.setHours(hours, minutes, seconds, 0);
			} else {
				if (typeof oValue != 'string' && !(oValue instanceof String))
					return "";
				if (oValue.length != 11)
					return "";
				if (oValue.substring(0, 2) != "PT"
						|| oValue.substring(4, 5) != "H"
						|| oValue.substring(7, 8) != "M"
						|| oValue.substring(10, 11) != "S") {
					return "";
				}
				var hours = oValue.substring(2, 4) * 1;
				var minutes = oValue.substring(5, 7) * 1;
				var seconds = oValue.substring(8, 10) * 1;
				oDate = new Date();
				oDate.setHours(hours, minutes, seconds, 0);
			}

			var oDateFormat = sap.ca.ui.model.format.DateFormat
					.getTimeInstance({
						style : "short"
					});
			var sTime = oDateFormat.format(oDate);
			var aTimeSegments = sTime.split(":");
			var sAmPm = "";
			var lastSeg = aTimeSegments[aTimeSegments.length - 1];

			// chop off seconds
			// check for am/pm at the end
			if (isNaN(lastSeg)) {
				var aAmPm = lastSeg.split(" ");
				// result array can only have 2 entries
				aTimeSegments[aTimeSegments.length - 1] = aAmPm[0];
				sAmPm = " " + aAmPm[1];
			}
			return (aTimeSegments[0] + ":" + aTimeSegments[1] + sAmPm);

		},

		// format date and time in format EEEdMMMyyyy
		FORMAT_DATETIME : function(sPrefix, oValue) {

			return sPrefix
					+ " "
					+ hcm.emp.myleaverequests.utils.Formatters
							.DATE_ODATA_EEEdMMMyyyy(oValue);
		},

		// history view date and label formatters: related dates are the ones
		// from an original leave request
		// where a change request has been submitted

		// header label indicating cancel or change request pending
		FORMATTER_INTRO : function(aRelatedRequests) {
			if (!aRelatedRequests || aRelatedRequests.length < 1) {
				return "";
			}
			var sLeaveRequestType = aRelatedRequests[0].LeaveRequestType;
			var sStatusCode = aRelatedRequests[0].StatusCode;
			if (sLeaveRequestType == "2") {
				if (sStatusCode == "SENT") {
					return hcm.emp.myleaverequests.utils.Formatters.resourceBundle
							.getText("LR_CHANGE_PENDING");
				}
				if (sStatusCode == "APPROVED") {
					return hcm.emp.myleaverequests.utils.Formatters.resourceBundle
							.getText("LR_CHANGE_DONE");
				}
			}
			if (sLeaveRequestType == "3") {
				if (sStatusCode == "SENT") {
					return hcm.emp.myleaverequests.utils.Formatters.resourceBundle
							.getText("LR_CANCEL_PENDING");
				}
				if (sStatusCode == "APPROVED") {
					return hcm.emp.myleaverequests.utils.Formatters.resourceBundle
							.getText("LR_CANCEL_DONE");
				}
			}
			return "";
		},

		// format end date
		FORMAT_ENDDATE : function(sHyphen, sWorkingDaysDuration, sStartTime,
				sEndDate, sEndTime) {
			try {
				if (sHyphen && sWorkingDaysDuration && sStartTime && sEndDate
						&& sEndTime) {
					if (hcm.emp.myleaverequests.utils.Formatters
							.isHalfDayLeave(sWorkingDaysDuration)) {
						return hcm.emp.myleaverequests.utils.Formatters
								.TIME_hhmm(sStartTime)
								+ " "
								+ sHyphen
								+ " "
								+ hcm.emp.myleaverequests.utils.Formatters
										.TIME_hhmm(sEndTime);
					} else if (sWorkingDaysDuration * 1 != 1) {
						return sHyphen
								+ " "
								+ hcm.emp.myleaverequests.utils.Formatters
										.DATE_ODATA_EEEdMMMyyyy(sEndDate);
					}
				}
			} catch (e) {
				// ignore
			}
			return "";
		},

		
	// format end date
		FORMAT_ENDDATE_LONG : function(sHyphen, sWorkingDaysDuration, sStartTime,
				sEndDate, sEndTime) {
			try {
				if (sHyphen && sWorkingDaysDuration && sStartTime && sEndDate
						&& sEndTime) {
					if (hcm.emp.myleaverequests.utils.Formatters
							.isHalfDayLeave(sWorkingDaysDuration)) {
						return hcm.emp.myleaverequests.utils.Formatters
								.TIME_hhmm(sStartTime)
								+ " "
								+ sHyphen
								+ " "
								+ hcm.emp.myleaverequests.utils.Formatters
										.TIME_hhmm(sEndTime);
					} else if (sWorkingDaysDuration * 1 != 1) {
						return sHyphen
								+ " "
								+ hcm.emp.myleaverequests.utils.Formatters
										.DATE_ODATA_EEEdMMMyyyyLong(sEndDate);
					}
				}
			} catch (e) {
				// ignore
			}
			return "";
		},

		// visibility setter for original/changed date range labels
		SET_RELATED_VISIBILITY : function(aRelatedRequests) {
			return aRelatedRequests != undefined && aRelatedRequests.length > 0
					&& aRelatedRequests[0].LeaveRequestType == "2";
		},

		SET_RELATED_START_DATE_VISIBILITY : function(aRelatedRequests) {
			return aRelatedRequests != undefined && aRelatedRequests.length > 0
					&& aRelatedRequests[0].LeaveRequestType == "2"
					&& aRelatedRequests[0].StartDate != undefined;
		},

		// format related start date
		FORMAT_RELATED_START_DATE : function(aRelatedRequests) {
			if (aRelatedRequests != undefined && aRelatedRequests.length > 0
					&& aRelatedRequests[0].LeaveRequestType == "2"
					&& aRelatedRequests[0].StartDate != undefined) {
				try {
					return hcm.emp.myleaverequests.utils.Formatters
							.DATE_ODATA_EEEdMMMyyyy(aRelatedRequests[0].StartDate);
				} catch (e) {
				}
			}
			return "";
		},

		FORMAT_RELATED_START_DATE_LONG : function(aRelatedRequests) {
			if (aRelatedRequests != undefined && aRelatedRequests.length > 0
					&& aRelatedRequests[0].LeaveRequestType == "2"
					&& aRelatedRequests[0].StartDate != undefined) {
				try {
					return hcm.emp.myleaverequests.utils.Formatters
							.DATE_ODATA_EEEdMMMyyyyLong(aRelatedRequests[0].StartDate);
				} catch (e) {
				}
			}
			return "";
		},
		
		// set related end date from change request visible if available
		SET_RELATED_END_DATE_VISIBILITY : function(aRelatedRequests) {
			return aRelatedRequests != undefined
					&& aRelatedRequests.length > 0
					&& aRelatedRequests[0].LeaveRequestType == "2"
					&& aRelatedRequests[0].WorkingDaysDuration != undefined
					&& aRelatedRequests[0].StartDate != undefined
					&& aRelatedRequests[0].EndDate != undefined
					&& !aRelatedRequests[0].EndTime != undefined
					&& (hcm.emp.myleaverequests.utils.Formatters
							.isHalfDayLeave(aRelatedRequests[0].WorkingDaysDuration) || aRelatedRequests[0].WorkingDaysDuration * 1 != 1);
		},

		// format related end date
		FORMAT_RELATED_END_DATE : function(sHyphen, aRelatedRequests) {
			if (aRelatedRequests != undefined && aRelatedRequests.length > 0
					&& aRelatedRequests[0].LeaveRequestType == "2"
					&& aRelatedRequests[0].WorkingDaysDuration != undefined
					&& aRelatedRequests[0].StartDate != undefined
					&& aRelatedRequests[0].EndDate != undefined
					&& !aRelatedRequests[0].EndTime != undefined) {
				try {
					if (hcm.emp.myleaverequests.utils.Formatters
							.isHalfDayLeave(aRelatedRequests[0].WorkingDaysDuration)) {
						return hcm.emp.myleaverequests.utils.Formatters
								.TIME_hhmm(aRelatedRequests[0].StartTime)
								+ " "
								+ sHyphen
								+ " "
								+ hcm.emp.myleaverequests.utils.Formatters
										.TIME_hhmm(aRelatedRequests[0].EndTime);
					}
					if (aRelatedRequests[0].WorkingDaysDuration * 1 != 1) {
						return sHyphen
								+ " "
								+ hcm.emp.myleaverequests.utils.Formatters
										.DATE_ODATA_EEEdMMMyyyy(aRelatedRequests[0].EndDate);
					}
				} catch (e) {
				}
			}
			return "";
		},
		
		FORMAT_RELATED_END_DATE_LONG : function(sHyphen, aRelatedRequests) {
			if (aRelatedRequests != undefined && aRelatedRequests.length > 0
					&& aRelatedRequests[0].LeaveRequestType == "2"
					&& aRelatedRequests[0].WorkingDaysDuration != undefined
					&& aRelatedRequests[0].StartDate != undefined
					&& aRelatedRequests[0].EndDate != undefined
					&& !aRelatedRequests[0].EndTime != undefined) {
				try {
					if (hcm.emp.myleaverequests.utils.Formatters
							.isHalfDayLeave(aRelatedRequests[0].WorkingDaysDuration)) {
						return hcm.emp.myleaverequests.utils.Formatters
								.TIME_hhmm(aRelatedRequests[0].StartTime)
								+ " "
								+ sHyphen
								+ " "
								+ hcm.emp.myleaverequests.utils.Formatters
										.TIME_hhmm(aRelatedRequests[0].EndTime);
					}
					if (aRelatedRequests[0].WorkingDaysDuration * 1 != 1) {
						return sHyphen
								+ " "
								+ hcm.emp.myleaverequests.utils.Formatters
										.DATE_ODATA_EEEdMMMyyyyLong(aRelatedRequests[0].EndDate);
					}
				} catch (e) {
				}
			}
			return "";
		},

		State : function(status) {
			status = status.toLowerCase();
			switch (status) {
			case "sent":
				return null;
				break;
			case "posted":
				return "Success";
				break;
			case "approved":
				return "Success";
				break;
			case "rejected":
				return "Error";
				break;
			default:
				return null;
			}
			;

		},
		
		/**
		 * Adds BalanceUsedQuantity, BalanceApprovedQuantity & BalanceRequestedQuantity
		 * @param {String} BalanceUsedQuantity
		 * @param {String} BalanceApprovedQuantity
		 * @param {String} BalanceRequestedQuantity
		 * @return {String} totalUsed
		 */
		calculateUsed : function(BalanceUsedQuantity, BalanceApprovedQuantity,BalanceRequestedQuantity){
			var sBalanceTotalUsedQuantity = parseFloat(BalanceUsedQuantity) + parseFloat(BalanceApprovedQuantity) + parseFloat(BalanceRequestedQuantity);
			sBalanceTotalUsedQuantity = hcm.emp.myleaverequests.utils.Formatters.BALANCE(sBalanceTotalUsedQuantity.toString());
			return sBalanceTotalUsedQuantity;
		}

	};

}());

},
	"hcm/emp/myleaverequests/utils/UIHelper.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.ui.dialog.factory");

jQuery.sap.declare("hcm.emp.myleaverequests.utils.UIHelper");

hcm.emp.myleaverequests.utils.UIHelper = (function() {

	var _cntrlrInst = null;
	var _objLeaveRequestCollection = null;
	var _isLeaveCollCached = false;
	var _isWithDrawn = [];
	var _isChangeAction = false;

	
	return {

		setControllerInstance : function(oControllerInst) {
			_cntrlrInst = oControllerInst;
		},

		getControllerInstance : function() {
			return _cntrlrInst;
		},
		setRoutingProperty : function(objLeaveRequestCollection) {
			if(!!objLeaveRequestCollection){
				for ( var oItemIndex = 0; oItemIndex < objLeaveRequestCollection.length; oItemIndex++) {
					var oLeaveKey = objLeaveRequestCollection[oItemIndex].LeaveKey;
					var oRequestID = objLeaveRequestCollection[oItemIndex].RequestID;
					if(oRequestID!==""){
						objLeaveRequestCollection[oItemIndex]._navProperty = oRequestID;
					}else{
						objLeaveRequestCollection[oItemIndex]._navProperty = oLeaveKey;
					}
				}
			}
			_objLeaveRequestCollection = objLeaveRequestCollection;
		},

		getRoutingProperty : function() {
			return _objLeaveRequestCollection;
		},
		setIsLeaveCollCached : function(isLeaveCollCached) {
			_isLeaveCollCached = isLeaveCollCached;
		},

		getIsLeaveCollCached : function() {
			return _isLeaveCollCached;
		},
		
		setIsWithDrawn : function(id) {
			_isWithDrawn.push(id);
		},

		getIsWithDrawn : function(id) {
			if(jQuery.inArray(id,_isWithDrawn) >= 0)
			return true;
			else return false;
		},
		
		setIsChangeAction : function(oStatus) {
			_isChangeAction = oStatus;
		},

		getIsChangeAction : function() {
			return _isChangeAction;
		},
		
		errorDialog : function(messages) {

			var _errorTxt = "";
			var _firstMsgTxtLine = "";
			var _detailmsg = "";
			var oSettings = "";

			if (typeof messages === "string") {
				oSettings = {
					message : messages,
					type : sap.ca.ui.message.Type.ERROR
				};
			} else if (messages instanceof Array) {

				for ( var i = 0; i < messages.length; i++) {
					_errorTxt = "";
					if (typeof messages[i] === "string") {
						_errorTxt = messages[i];
					} else if (typeof messages[i] === "object") {
						_errorTxt = messages[i].value;
					}
					if (i == 0) {
						_firstMsgTxtLine = _errorTxt;
					} else {
						_detailmsg = _detailmsg + _errorTxt + "\n";
					}
				}

				if (_detailmsg == "") { // do not show any details if none are there
					oSettings = {
						message : _firstMsgTxtLine,
						type : sap.ca.ui.message.Type.ERROR
					};
				} else {
					oSettings = {
						message : _firstMsgTxtLine,
						details : _detailmsg,
						type : sap.ca.ui.message.Type.ERROR
					};
				}

			}
			sap.ca.ui.message.showMessageBox(oSettings);
		}

	};

}());
},
	"hcm/emp/myleaverequests/view/S1.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("hcm.emp.myleaverequests.utils.Formatters");
jQuery.sap.require("hcm.emp.myleaverequests.utils.UIHelper");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("hcm.emp.myleaverequests.utils.DataManager");
jQuery.sap.require("hcm.emp.myleaverequests.utils.CalendarTools");
jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.require("sap.ca.ui.dialog.Dialog");
jQuery.sap.require("sap.m.MessageToast");
jQuery.support.useFlexBoxPolyfill = false;

sap.ca.scfld.md.controller.BaseFullscreenController.extend("hcm.emp.myleaverequests.view.S1", {


	extHookChangeFooterButtons: null,
	extHookRouteMatchedHome : null,
	extHookRouteMatchedChange : null,	
	extHookClearData : null,		
	extHookInitCalendar : null,	
	extHookTapOnDate : null,
	extHookSetHighlightedDays : null,
	extHookDeviceDependantLayout : null,
	extHookSubmit : null,
	extHookOnSubmitLRCfail : null,
	extHookOnSubmitLRCsuccess : null,	
	extHookCallDialog : null,
	


	onInit : function() {

		sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit.call(this);

		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();

		hcm.emp.myleaverequests.utils.DataManager.init(this.oDataModel, this.resourceBundle);
		hcm.emp.myleaverequests.utils.Formatters.init(this.resourceBundle);
		hcm.emp.myleaverequests.utils.CalendarTools.init(this.resourceBundle);

		this.oDataModel = hcm.emp.myleaverequests.utils.DataManager.getBaseODataModel();

		this.oRouter.attachRouteMatched(this._handleRouteMatched, this);

		this._buildHeaderFooter();

		this._initCntrls();
		sap.ui.getCore().getEventBus().subscribe("hcm.emp.myleaverequests.LeaveCollection", "refresh", this._onLeaveCollRefresh, this);
	},

	_initCntrls : function() {

		this.changeMode = false; // true: S4 is called by history view for existing lr
		this.oChangeModeData = {}; // container for LR data coming from history view in change mode
		this.selRange = {}; // Object holding the selected dates of the calendar control
		this.selRange.start = null; // earliest selected date or singel selected date
		this.selRange.end = null; // latest selected date or null for single days
		this.aLeaveTypes = []; // array of absence types for current user
		this.leaveType = {}; // currently selected absence type

		this.iPendingRequestCount = 0;

		// ----variables used during onSend:
		this.bSubmitOK = null; // true when the submit simulation was successful
		this.bApproverOK = null; // true when the approving manager could be determined
		this.oSubmitResult = {};
		this.sApprover = ""; // Approving manager - used in confirmation popup
		this.bSimulation = true; // used in oData call for submit of lr - true: just check user entry false: do posting
		this._isLocalReset = false;

		// ------- convenience variables for screen elements
		this.oBusy = null;
		this.formContainer = this.byId("LRS4_FRM_CNT_BALANCES");
		this.timeInputElem = this.byId("LRS4_FELEM_TIMEINPUT");
		this.balanceElem = this.byId("LRS4_FELEM_BALANCES");
		this.noteElem = this.byId("LRS4_FELEM_NOTE");
		this.timeFrom = this.byId("LRS4_DAT_STARTTIME");
		this.timeTo = this.byId("LRS4_DAT_ENDTIME");
		this.legend = this.byId("LRS4_LEGEND");
		this.remainingVacation = this.byId("LRS4_TXT_REMAINING_DAYS");
		this.bookedVacation = this.byId("LRS4_TXT_BOOKED_DAYS");
		this.note = this.byId("LRS4_TXA_NOTE");
		this.cale = this.byId("LRS4_DAT_CALENDAR");
		this.slctLvType = this.byId("SLCT_LEAVETYPE");

		this.calSelResetData = [];
		
		//TODO:
		this._initCalendar(); // set up layout + fill calendar with events
		this._deviceDependantLayout();
		
		/*this is not necessary as of now
		 *Here the time pattern used for display in the timeInput control is determined
		if (this.timeFrom && this.timeTo) {
			this._setInputTimePattern();
		}*/
	},
	
	_onLeaveCollRefresh : function(){
		hcm.emp.myleaverequests.utils.CalendarTools.clearCache();
	},
	
	onAfterRendering : function(){
			var that= this;		
			$(window).on("orientationchange",function(event){
				//passing the type orientation to decide number of months to be displayed
				that._orientationDependancies(event.orientation);
			});
			//to align the text and total days available to right
			this.byId('LRS4_TXT_REMAININGDAY').onAfterRendering = function () {
					jQuery(this.getDomRef()).css({
						'text-align': 'right'			/*for IE and web kit browsers*/
						});
				};
			//to enhance the font of days used/available
			this.byId('LRS4_TXT_REMAINING_DAYS').onAfterRendering = function () {
					jQuery(this.getDomRef()).css({'font-size': '1.5rem', 'font-weight':'700'});
				};
			this.byId('LRS4_TXT_BOOKED_DAYS').onAfterRendering = function () {
					jQuery(this.getDomRef()).css({'font-size': '1.5rem', 'font-weight':'700'});
				};
	},


	_buildHeaderFooter : function() {
		var _this = this;
		this.objHeaderFooterOptions = {
			sI18NFullscreenTitle : "",
			oEditBtn : {
				sId : "LRS4_BTN_SEND",
				sI18nBtnTxt : "LR_SEND",
				onBtnPressed : function(evt) {
					_this.onSendClick(evt);
				}
			},
			buttonList : [{
				sId : "LRS4_BTN_CANCEL",
				sI18nBtnTxt : "LR_RESET",
				onBtnPressed : function(evt) {
					_this.onCancelClick(evt);
				}
			}, {
				sId : "LRS4_BTN_ENTITLEMENT",
				sI18nBtnTxt : "LR_BALANCE_TILE",
				onBtnPressed : function(evt) {
					_this.onEntitlementClick(evt);
				}
			}, {
				sId : "LRS4_BTN_HISTORY",
				sI18nBtnTxt : "LR_HISTORY_TILE",
				onBtnPressed : function(evt) {
					_this.onHistoryClick(evt);
				}
			}]
		};
		
		/**
         * @ControllerHook Modify the footer buttons
         * This hook method can be used to add and change buttons for the detail view footer
         * It is called when the decision options for the detail item are fetched successfully
         * @callback hcm.emp.myleaverequests.view.S1~extHookChangeFooterButtons
         * @param {object} Header Footer Object
         * @return {object} Header Footer Object
         */
		if (this.extHookChangeFooterButtons) {
			this.objHeaderFooterOptions = this.extHookChangeFooterButtons(this.objHeaderFooterOptions);
    	}
	},

	_handleRouteMatched : function(evt) {

		//sap.ca.ui.utils.busydialog.requireBusyDialog();
		
		var _this = this;

		if (evt.getParameter("name") === "home") {

			hcm.emp.myleaverequests.utils.DataManager.init(this.oDataModel, this.resourceBundle);
			this.objHeaderFooterOptions.sI18NFullscreenTitle = "LR_CREATE_LEAVE_TILE";
			this.setHeaderFooterOptions(this.objHeaderFooterOptions);
			hcm.emp.myleaverequests.utils.UIHelper.setControllerInstance(this);
			this.oChangeModeData = {};
			this.changeMode = false;

			this._clearData();
			hcm.emp.myleaverequests.utils.CalendarTools.clearCache();

			var combinedPromise = $.when(hcm.emp.myleaverequests.utils.DataManager.getConfiguration(), hcm.emp.myleaverequests.utils.DataManager.getAbsenceTypeCollection());
			
			combinedPromise.done(function(defaultType,leaveTypeColl){			
				
				// make sure that the leave type collection is available.
				_this.aLeaveTypes = leaveTypeColl;
				
				var objAbsenceTypes =  {};
				objAbsenceTypes.AbsenceTypeCollection = _this.aLeaveTypes;
				
				_this.slctLvType.setModel(new sap.ui.model.json.JSONModel(objAbsenceTypes));

				_this.slctLvType.bindItems({
					path : "/AbsenceTypeCollection",
					template : new sap.ui.core.Item({
						key : "{AbsenceTypeCode}",
						text : "{AbsenceTypeName}"
					})
				});

				if (_this.aLeaveTypes.length > 0) {
					//var abscenceCode = _this.aLeaveTypes[0].AbsenceTypeCode;
					//_this._setUpLeaveTypeData(abscenceCode);					
					_this._setUpLeaveTypeData(defaultType.DefaultAbsenceTypeCode);
				}				
				
			});

			combinedPromise.fail(function(error){
				hcm.emp.myleaverequests.utils.UIHelper.errorDialog(error);
			});

			
			_this._setHighlightedDays(_this.cale.getCurrentDate());

			if (_this.cale && _this.cale.getSelectedDates().length === 0) {
				_this.setBtnEnabled("LRS4_BTN_SEND", false);
			} else {
				_this.setBtnEnabled("LRS4_BTN_SEND", true);
			}
			
			
			/**
       * @ControllerHook Extend load behavior of home view
       * This hook method can be used to add UI or business logic 
       * It is called when the routeMatched event name match with home
       * @callback hcm.emp.myleaverequests.view.S1~extHookRouteMatchedHome
       */
			if(this.extHookRouteMatchedHome) {
				this.extHookRouteMatchedHome();
	  	}
			
		} else if (evt.getParameter("name") === "change") {

			
			hcm.emp.myleaverequests.utils.DataManager.init(this.oDataModel, this.resourceBundle);
			this.objHeaderFooterOptions.sI18NFullscreenTitle = "LR_TITLE_CHANGE_VIEW";
			this.setHeaderFooterOptions(this.objHeaderFooterOptions);
			hcm.emp.myleaverequests.utils.UIHelper.setControllerInstance(this);
			this.oChangeModeData = {};
			this.changeMode = true;
			this._clearData();

			var currntRequestId = evt.getParameters().arguments.requestID;

			var curntLeaveRequest = null, i;
			
			var consolidatedLeaveRequestcollection = hcm.emp.myleaverequests.utils.DataManager.getCachedModelObjProp("ConsolidatedLeaveRequests");
			
				if (consolidatedLeaveRequestcollection) {
					for ( i = 0; i < consolidatedLeaveRequestcollection.length; i++) {
						if (consolidatedLeaveRequestcollection[i].RequestID == currntRequestId) {
							curntLeaveRequest = consolidatedLeaveRequestcollection[i];
						}
					}
					
					//requestID is null
					if(curntLeaveRequest==null){
						for (i = 0; i < consolidatedLeaveRequestcollection.length; i++) {
							if (consolidatedLeaveRequestcollection[i].LeaveKey == currntRequestId) {
								curntLeaveRequest = consolidatedLeaveRequestcollection[i];
							}
						}
					}
				}

				if (!curntLeaveRequest) {
					/*hcm.emp.myleaverequests.utils.UIHelper.errorDialog([this.resourceBundle.getText("LR_DD_GENERIC_ERR"), 
					                                                    "hcm.emp.myleaverequests.view.S1",
					                                                    "_handleRouteMatched",
					                                                    "curntLeaveRequest is null"]);*/
					jQuery.sap.log.warning("curntLeaveRequest is null","_handleRouteMatched","hcm.emp.myleaverequests.view.S1");
					this.oRouter.navTo("home", {},true);
				}else{ 
				var startDate_UTC = hcm.emp.myleaverequests.utils.Formatters.getDate(curntLeaveRequest.StartDate);
				var endDate_UTC = hcm.emp.myleaverequests.utils.Formatters.getDate(curntLeaveRequest.EndDate);
				startDate_UTC = new Date(startDate_UTC.getUTCFullYear(), startDate_UTC.getUTCMonth(), startDate_UTC.getUTCDate(),0,0,0);
				endDate_UTC = new Date(endDate_UTC.getUTCFullYear(), endDate_UTC.getUTCMonth(), endDate_UTC.getUTCDate(),0,0,0);
				_this.oChangeModeData.requestId = curntLeaveRequest.RequestID;
				_this.oChangeModeData.leaveTypeCode = curntLeaveRequest.AbsenceTypeCode;
				_this.oChangeModeData.startDate = startDate_UTC.toString();
				_this.oChangeModeData.endDate = endDate_UTC.toString();
				_this.oChangeModeData.requestID = curntLeaveRequest.RequestID;
				_this.oChangeModeData.noteTxt = curntLeaveRequest.Notes;
				_this.oChangeModeData.startTime = curntLeaveRequest.StartTime;
				_this.oChangeModeData.endTime = curntLeaveRequest.EndTime;
				_this.oChangeModeData.employeeID = curntLeaveRequest.EmployeeID;
				_this.oChangeModeData.changeStateID = curntLeaveRequest.ChangeStateID;
				_this.oChangeModeData.leaveKey = curntLeaveRequest.LeaveKey;
				_this.oChangeModeData.evtType = _this._getCaleEvtTypeForStatus(curntLeaveRequest.StatusCode);

				_this._setUpLeaveTypeData(_this.oChangeModeData.leaveTypeCode);
				_this._copyChangeModeData();
				//disable time inputs if the leaveRange > 1
				if(_this.cale.getSelectedDates().length > 1){
					if (this.timeFrom) {
						this.timeFrom.setValue("");
						this.timeFrom.setEnabled(false);
					}
					if (this.timeTo) {
						this.timeTo.setValue("");
						this.timeTo.setEnabled(false);
					}
				}
				// send button should be disabled if no date is selected
				if (_this.cale && _this.cale.getSelectedDates().length === 0) {
					_this.setBtnEnabled("LRS4_BTN_SEND", false);
				} else {
					_this.setBtnEnabled("LRS4_BTN_SEND", true);
				}
				}
				//sap.ca.ui.utils.busydialog.releaseBusyDialog();
				
				
				/**
	       * @ControllerHook Extend load behavior of change view
	       * This hook method can be used to add UI or business logic 
	       * It is called when the routeMatched event name match with change
	       * @callback hcm.emp.myleaverequests.view.S1~extHookRouteMatchedChange
	       */
				if(this.extHookRouteMatchedChange) {
					this.extHookRouteMatchedChange();
		  	}
		}

	},

	_copyChangeModeData : function() {
		// In change mode the data to be displayed is not entered by the user instead it
		// comes from the LR selected in the history view - This method fills the data coming
		// from the history view into the screen elements of S4
		var _oStartTime = null;
		var _oEndTime = null;
		var _HH = 0;
		var _MM = 0;

		// set Start and End date for calendar
		if (this.oChangeModeData === {}) {
			return;
		}

		this.selRange.start = this.oChangeModeData.startDate;
		this.selRange.end = this.oChangeModeData.endDate;
		if (this.selRange.start === this.selRange.end) {
			this.selRange.end = null;
			if (this.cale) {
				this.cale.toggleDatesSelection([this.selRange.start], true);
			};
		} else {
			if (this.cale) {
				this.cale.toggleDatesRangeSelection(this.selRange.start, this.selRange.end, true);
			};
		}
		if (this.cale) {
			this.cale.setCurrentDate(this.selRange.start);
			
			this._setHighlightedDays(this.cale.getCurrentDate());
			
		};

		// set simple ones
		this.requestID = this.oChangeModeData.requestID;
		if (this.note) { // App Designer specific: in case note field was removed
			//remove previous note if exists
			if(!!this.byId("LRS4_NOTE") && this.byId("LRS4_NOTE").getContent().length > 2) 
				this.byId("LRS4_NOTE").removeContent(1);
			
			//adding note text only if exists
			if(!!this.oChangeModeData.noteTxt && this.oChangeModeData.noteTxt !== "" ){
				var noteText = new sap.m.Text({
					width : "100%",
					wrapping : true,
					layoutData: new sap.ui.layout.ResponsiveFlowLayoutData ({weight: 8})
				});
				noteText.setText(this.oChangeModeData.noteTxt);
				this.byId("LRS4_NOTE").insertContent(noteText,1);
			}
			
		}

		// set start and end Time
		if (typeof this.oChangeModeData.startTime === "string") {
			if (this.timeFrom) {
				if(this.oChangeModeData.startTime === "PT00H00M00S"){
					this.timeFrom.setValue("");
				}else{
					this.timeFrom.setValue(this.oChangeModeData.startTime.substring(2, 4) + ":" + this.oChangeModeData.startTime.substring(5, 7));
				}
			}
			if (this.timeTo) {
				if(this.oChangeModeData.endTime === "PT00H00M00S"){
					this.timeTo.setValue("");
					}else{
						this.timeTo.setValue(this.oChangeModeData.endTime.substring(2, 4) + ":"+ this.oChangeModeData.endTime.substring(5, 7));
					}
			}
		} else {
			_oStartTime = new Date(this.oChangeModeData.startTime.ms);
			_HH = _oStartTime.getUTCHours();
			_MM = _oStartTime.getUTCMinutes();
			_HH = (_HH < 10 ? "0" : "") + _HH;
			_MM = (_MM < 10 ? "0" : "") + _MM;
			if (this.timeFrom) {
				this.timeFrom.setValue(_HH + ":" + _MM);
			}

			_oEndTime = new Date(this.oChangeModeData.endTime.ms);
			_HH = _oEndTime.getUTCHours();
			_MM = _oEndTime.getUTCMinutes();
			_HH = (_HH < 10 ? "0" : "") + _HH;
			_MM = (_MM < 10 ? "0" : "") + _MM;
			if (this.timeTo) {
				this.timeTo.setValue(_HH + ":" + _MM);
			}
			// this.timeFrom = _oStartTime.getHours().toString() + ":" + _oStartTime.getMinutes();
		}
		//if (this.send) {
		if (this.cale & this.cale.getSelectedDates().length === 0) {
			//this.send.setEnabled(false);
			this.setBtnEnabled("LRS4_BTN_SEND", false);
		} else {
			//this.send.setEnabled(true);
			this.setBtnEnabled("LRS4_BTN_SEND", true);
		};
		//};
	},

	_setInputTimePattern : function() {
		var oTime = new Date();
		var sPattern = "";
		oTime.setHours(23, 30, 59);
		var sTime = hcm.emp.myleaverequests.utils.Formatters.TIME_hhmm(oTime);
		if (sTime !== "") {
			var aTimeSegments = sTime.split(":");
			var sHours = "";
			sHours = aTimeSegments[0];
			if (isNaN(sHours)) {
				// in Chinese the am/pm indicator is at the beginning
				sPattern = "a hh:mm";
			} else if (parseInt(sHours) === 23) {
				// use 24 hour pattern - no seconds
				sPattern = "HH:mm";
			} else if (parseInt(sHours) === 11) {
				if (isNaN(aTimeSegments[aTimeSegments.length - 1])) {
					// use 12 hours pattern with am/pm - no seconds
					sPattern = "hh:mm a";
				} else {
					// use 12 hours pattern - no seconds
					sPattern = "hh:mm";
				};
			}
		};
		if (sPattern !== "") {
			this.timeFrom.setDisplayFormat(sPattern);
			this.timeTo.setDisplayFormat(sPattern);
		};
	},

	_clearData : function() {
		// All screen elements that can be changed by a user are set back to their initial values
		// This refresh is done when the screen is started (onNavigateTo) and when a new LR has
		// successfully been submitted (onSubmitLRCsuccess) and when changing/creating a LR is
		// aborted with the cancel button (onCancel)
		// This method does NO refresh of the ajax buffer or the calendarTool buffer
		this._clearDateSel();
		
		if(this._isLocalReset){			
			for (var i = 0; i < this.calSelResetData.length; i++) {
				this.cale.toggleDatesType(this.calSelResetData[i].calEvt, this.calSelResetData[i].evtType, false);
	  	}		
			this.calSelResetData=[];
		}
		
		this.oChangeModeData = {};
		if (this.cale) {
			this.cale.setCurrentDate(new Date());
		};
		if (this.note) { // App Designer specific: in case note field was removed
			this.note.setValue("");
			//remove previous note if exists
			if(!!this.byId("LRS4_NOTE") && this.byId("LRS4_NOTE").getContent().length > 2) 
				this.byId("LRS4_NOTE").removeContent(1);
		}
		if (this.timeFrom) {
			this.timeFrom.setValue("");
			this.timeFrom.rerender();//workaround since setValue won't remove HTML content in the input box in Mobile devices
			this.timeFrom.setEnabled(true);
		};
		if (this.timeTo) {
			this.timeTo.setValue("");
			this.timeTo.rerender();//workaround since setValue won't remove HTML content in the input box in Mobile devices
			this.timeTo.setEnabled(true);
		};
		//if (this.send) {
		//this.send.setEnabled(false);
		this.setBtnEnabled("LRS4_BTN_SEND", false);
		//};
		if (this.byId("LRS4_LBL_TITLE")) {
			this.byId("LRS4_LBL_TITLE").setText(this.resourceBundle.getText("LR_TITLE_CREATE_VIEW"));
		};

		// set leave type to default absence type + get balances for absence type
		if (this.aLeaveTypes.length > 0 && this.changeMode==false && this._isLocalReset== true) {

			
			var defaultLeaveObj = hcm.emp.myleaverequests.utils.DataManager.getCachedModelObjProp("DefaultAbsenceTypeCode");
			this.slctLvType.setSelectedKey(defaultLeaveObj.DefaultAbsenceTypeCode);
			this._setUpLeaveTypeData(defaultLeaveObj.DefaultAbsenceTypeCode);
			// The selection inthe drop down list needs also to be reset to the default value but
			// setting the selected item programatically in sap.m.list does not work once the selection
			// was done by a real tap event...
			// Therefore then list content is destroyed and rebuild here which also resets the selection.
			// The tap handler will then set the selection to the default value (first list item)
		}

		
		this._isLocalReset = false;
		
		/**
     * @ControllerHook Extend behavior of clearing of data
     * This hook method can be used to add UI or business logic 
     * It is called when the clearData method executes
     * @callback hcm.emp.myleaverequests.view.S1~extHookClearData
     */
		if(this.extHookClearData) {
			this.extHookClearData();
  	};
		
	},

	_clearDateSel : function() {
		// remove all selected days from the calendar control and from selRange
		if (this.cale) {
			this.cale.unselectAllDates();
		};
		this.selRange.end = null;
		this.selRange.start = null;
		//if (this.send) {
		//this.send.setEnabled(false);
		this.setBtnEnabled("LRS4_BTN_SEND", false);
		//}
	},

	_initCalendar : function() {
		// Here the initial setup for the calendar and the calendar legend is done
		// this setting is refined depending on the used device and device orientation
		// in deviceDependantLayout() and leaveTypeDependantSettings()
		if (this.cale) {
			this.cale.setSwipeToNavigate(true);
			// handler for paging in calendar
			this.cale.attachChangeCurrentDate(this._onChangeCurrentDate, this);
			// handler for date selection
			this.cale.attachTapOnDate(this._onTapOnDate, this);
			// disable swipe range selection -> we do the range selection using 'tap'
			this.cale.setEnableMultiselection(false);
			// setup display for moth
			this.cale.setWeeksPerRow(1);

		};

		// create legend
		if (this.legend) {
			this.legend.setLegendForNormal(this.resourceBundle.getText("LR_WORKINGDAY"));
			this.legend.setLegendForType00(this.resourceBundle.getText("LR_NONWORKING"));
			this.legend.setLegendForType01(this.resourceBundle.getText("LR_APPROVELEAVE"));
			this.legend.setLegendForType04(this.resourceBundle.getText("LR_APPROVEPENDING"));
			this.legend.setLegendForType06(this.resourceBundle.getText("LR_PUBLICHOLIDAY"));
			this.legend.setLegendForType07(this.resourceBundle.getText("LR_REJECTEDLEAVE"));
			this.legend.setLegendForToday(this.resourceBundle.getText("LR_DTYPE_TODAY"));
			this.legend.setLegendForSelected(this.resourceBundle.getText("LR_DTYPE_SELECTED"));
		};
		
		
		/**
     * @ControllerHook Extend behavior of initializing calendar
     * This hook method can be used to add UI or business logic 
     * It is called when the initCalendar method executes
     * @callback hcm.emp.myleaverequests.view.S1~extHookInitCalendar
     */
		if(this.extHookInitCalendar) {
			this.extHookInitCalendar();
  	};
		
	},

	//TODO Orientation
	registerForOrientationChange : function(oApp) {
		// called by Main.controller.js during init
		// registration is only done on tablets
		if (jQuery.device.is.tablet) {
			this.parentApp = oApp;
			oApp.attachOrientationChange(jQuery.proxy(this._onOrientationChanged, this));
		}
	},

	_onOrientationChanged : function() {
		// the dynamic layout for orientation changes is done in leaveTypeDependantSettings
		this._leaveTypeDependantSettings(this.leaveType);
	},

	_onTapOnDate : function(evt) {
		// tap handler for calendar control
		// Depending on the AllowedDurationMultipleDayInd the selection of a single day or a range of days is allowed
		// selecting a singel day: tap on a day
		// deselecting a sngle day: select a different day or tap again on a selected day
		// selecting a range of days: tap on one day to select it then tap an a different day to select both
		// days and all days between them
		// deselecting a range: tapping an a day while a range of days is selected deselects the range and the tapped
		// day becomes selected
		var _aSelction;

		if (this.cale) {
			_aSelction = this.cale.getSelectedDates();
		}

		if (this.leaveType.AllowedDurationMultipleDayInd === false) {
			// there are Absence Types where partial days AND multiple days are allowed
			// || this.leaveType.AllowedDurationPartialDayInd === true) {
			// only one day may be selected at a time
			// no special treatment needed

		} else if (this.leaveType.AllowedDurationMultipleDayInd) {
			// Ranges and single days are allowed
			if (_aSelction.length === 0 || evt.mParameters.didSelect === false) {
				// ************** a selection was removed *****************
				if (this.selRange.start !== null && this.selRange.end !== null) {
					// a selected range was deselected -> the new selection replaces the old}
					this._clearDateSel();
					if (evt.getParameters().date !== "") {
						this.selRange.start = evt.getParameters().date;
						if (this.cale) {
							this.cale.toggleDatesSelection([this.selRange.start], true);
						}
					}
				} else if (this.selRange.start !== null && this.selRange.end === null) {
					// A single field was deselected -> remove selection
					this._clearDateSel();
				}

			}
			// // ************** something was selected *****************
			else if (this.selRange.start === null) {
				// start date of range selected
				this.selRange.start = evt.getParameters().date;
			} else if (this.selRange.end === null) {
				// end date of range selected
				this.selRange.end = evt.getParameters().date;
				if (this.cale) {
					this.cale.toggleDatesRangeSelection(this.selRange.start, this.selRange.end, true);
				}
			} else {
				this.selRange.start = evt.getParameters().date;
				this.selRange.end = null;
				// this.selRange.lastTap = null;
				if (this.cale) {
					this.cale.toggleDatesSelection([this.selRange.start], true);
				}
			}
		}

		// if partial days AND multiple days are allowed the time input fields shall only be open
		// for input if a single day is selected
		if (this.leaveType.AllowedDurationMultipleDayInd === true && this.timeFrom && this.timeTo) {
			_aSelction = this.cale.getSelectedDates();
			if (_aSelction.length > 1) {
				this.timeFrom.setValue("");
				this.timeTo.setValue("");
				this.timeFrom.setEnabled(false);
				this.timeTo.setEnabled(false);
			} else {
				this.timeFrom.setEnabled(true);
				this.timeTo.setEnabled(true);
			}

		}

		if (this.cale && this.cale.getSelectedDates().length === 0) {
			this.setBtnEnabled("LRS4_BTN_SEND", false);
		} else {
			this.setBtnEnabled("LRS4_BTN_SEND", true);
		};

		
		/**
     * @ControllerHook Extend behavior of tap on Date
     * This hook method can be used to add UI or business logic 
     * It is called when the onTapOnDate method executes
     * @callback hcm.emp.myleaverequests.view.S1~extHookTapOnDate
     */
		if(this.extHookTapOnDate) {
			this.extHookTapOnDate();
  	};
		
	},

	_setHighlightedDays : function(strDate) {
		// This method triggers the reading of the calendar events from the backend for the
		// currently displayed month as well as the previous and next month.
		// Buffering of the calendar events is done in calendarTools.js
		var _oDate;
		//incorporating framework change
		try {
			_oDate = sap.me.Calendar.parseDate(strDate);
			} catch (e) {
				_oDate = new Date(strDate);
			}
		//sap.ca.ui.utils.busydialog.requireBusyDialog();
		hcm.emp.myleaverequests.utils.CalendarTools.getDayLabelsForMonth(_oDate, this._getCalLabelsOK,
				this._getCalLabelsError);
		// do calendar coloring for last month
		
		/*var _oDatePrevious = {};
		if (_oDate.getMonth() === 0) {
			_oDatePrevious = new Date(_oDate.getFullYear() - 1, 11, 1);
		} else {
			_oDatePrevious = new Date(_oDate.getFullYear(), _oDate.getMonth() - 1, 1);
		}
		//sap.ca.ui.utils.busydialog.requireBusyDialog();
		hcm.emp.myleaverequests.utils.CalendarTools.getDayLabelsForMonth(_oDatePrevious, this._getCalLabelsOK,
				this._getCalLabelsError);*/
		// do calendar coloring for next month
		
		/*var _oDateNext = {};
		if (_oDate.getMonth() === 11) {
			_oDateNext = new Date(_oDate.getFullYear() + 1, 0, 1);
		} else {
			_oDateNext = new Date(_oDate.getFullYear(), _oDate.getMonth() + 1, 1);
		}
		//sap.ca.ui.utils.busydialog.requireBusyDialog();
		hcm.emp.myleaverequests.utils.CalendarTools.getDayLabelsForMonth(_oDateNext, this._getCalLabelsOK,
				this._getCalLabelsError);*/
		
		
		/**
     * @ControllerHook Extend behavior of highlighted days
     * This hook method can be used to add UI or business logic 
     * It is called when the setHighlightedDays method executes
     * @callback hcm.emp.myleaverequests.view.S1~extHookSetHighlightedDays
     */
		if(this.extHookSetHighlightedDays ) {
			this.extHookSetHighlightedDays();
  	};
		
		
	},

	_getCalLabelsOK : function(oCalEvents) {

		var _this = hcm.emp.myleaverequests.utils.UIHelper.getControllerInstance();
		/*
		 maps the back end status to the corresponding sap.me.calendar event type
		 sap.me.CalendarEventType.Type00 Type00 (non-working day)
		 sap.me.CalendarEventType.Type10 Type10 (working day) ONLY Available after 1.22.x hence we have check
		 sap.me.CalendarEventType.Type01 Type01 (Booked/Approved)
		 sap.me.CalendarEventType.Type04 Type04 (open request / manager action needed)
		 sap.me.CalendarEventType.Type06 Type06 (public holiday)
		 sap.me.CalendarEventType.Type07 Type07 (deletion requested / your action needed/ Rejected)
		 Precedences(low---high) : REJECTED< SENT< (APPROVED|POSTED)
		 It means if you have two leave requests on same day, Approved will more precedence than rejected one.
		 WEEKEND , WORKDAY, PHOLIDAY, (all LEAVE TYPES) are independent. 
		 Hence toggling is needed only b/w leave types
		 */
		if (!!oCalEvents.REJECTED && oCalEvents["REJECTED"].length > 0) {
			_this.cale.toggleDatesType(oCalEvents["REJECTED"], sap.me.CalendarEventType.Type07, true);
			_this.cale.toggleDatesType(oCalEvents["REJECTED"], sap.me.CalendarEventType.Type04, false);
			_this.cale.toggleDatesType(oCalEvents["REJECTED"], sap.me.CalendarEventType.Type01, false);
		}
		if (!!oCalEvents.SENT && oCalEvents["SENT"].length > 0) {
			_this.cale.toggleDatesType(oCalEvents["SENT"], sap.me.CalendarEventType.Type07, false);
			_this.cale.toggleDatesType(oCalEvents["SENT"], sap.me.CalendarEventType.Type04, true);
			_this.cale.toggleDatesType(oCalEvents["SENT"], sap.me.CalendarEventType.Type01, false);
		}
		if (!!oCalEvents.APPROVED && oCalEvents["APPROVED"].length > 0) {
			_this.cale.toggleDatesType(oCalEvents["APPROVED"], sap.me.CalendarEventType.Type07, false);
			_this.cale.toggleDatesType(oCalEvents["APPROVED"], sap.me.CalendarEventType.Type04, false);
			_this.cale.toggleDatesType(oCalEvents["APPROVED"], sap.me.CalendarEventType.Type01, true);
		}
		if (!!oCalEvents.POSTED && oCalEvents["POSTED"].length > 0) {
			_this.cale.toggleDatesType(oCalEvents["POSTED"], sap.me.CalendarEventType.Type07, false);
			_this.cale.toggleDatesType(oCalEvents["POSTED"], sap.me.CalendarEventType.Type04, false);
			_this.cale.toggleDatesType(oCalEvents["POSTED"], sap.me.CalendarEventType.Type01, true);
		}
		if (!!oCalEvents.WEEKEND && oCalEvents["WEEKEND"].length > 0) {
			_this.cale.toggleDatesType(oCalEvents["WEEKEND"], sap.me.CalendarEventType.Type00, true);
		} 
		if (!!oCalEvents.PHOLIDAY && oCalEvents["PHOLIDAY"].length > 0) {
			_this.cale.toggleDatesType(oCalEvents["PHOLIDAY"], sap.me.CalendarEventType.Type06, true);
		}
		if(!!oCalEvents.WORKDAY && oCalEvents["WORKDAY"].length > 0) {
			if(!!sap.me.CalendarEventType.Type10){
				_this.cale.toggleDatesType(oCalEvents["WORKDAY"], sap.me.CalendarEventType.Type10, true);
			}else {
				_this.cale.toggleDatesType(oCalEvents["WORKDAY"], "", true);
			}	
		}
	},

	_getCaleEvtTypeForStatus : function(sStatus) {
		// maps the back end status to the corresponding sap.me.calendar event type
		// sap.me.CalendarEventType.Type00 Type 00 (non-working day (e.g.
		// sap.me.CalendarEventType.Type01 Type 01 (nonattendance / submitted day)
		// sap.me.CalendarEventType.Type04 Type 04 (open request / manager action needed)
		// sap.me.CalendarEventType.Type06 Type 06 (public holiday)
		// sap.me.CalendarEventType.Type07 Type 07 (deletion requested / your action needed/ Rejected)
		if (sStatus === "WEEKEND") {
			return sap.me.CalendarEventType.Type00;
		} else if (sStatus === "PHOLIDAY") {
			return sap.me.CalendarEventType.Type06;
		} else if (sStatus === "SENT") {
			return sap.me.CalendarEventType.Type04;
		} else if (sStatus === "POSTED" || sStatus === "APPROVED") {
			return sap.me.CalendarEventType.Type01;
		}	else if (sStatus === "REJECTED") {
		  return sap.me.CalendarEventType.Type07;
		} else if (sStatus === "WORKDAY") {
			if(!!sap.me.CalendarEventType.Type10)
            return sap.me.CalendarEventType.Type10;
			else return "";
		} else {
			return "";
		}
	},

	_getCalLabelsError : function(objResponse) {
		//sap.ca.ui.utils.busydialog.releaseBusyDialog();
		hcm.emp.myleaverequests.utils.UIHelper.errorDialog(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse));
	},

	_onChangeCurrentDate : function(evt) {
		if (this.cale) {
			this._setHighlightedDays(evt.mParameters.currentDate);
		};
	},

	_getStartEndDate : function(aStringDates) {
		var _oDates = [];
		var _oDatesSorted = [];
		var oResponse = {};
		for ( var i = 0; i < aStringDates.length; i++) {
			_oDates[i] = new Date(aStringDates[i]);
		}

		if (_oDates.length === 0) {
			oResponse.startDate = {};
			oResponse.endDate = {};
		} else if (_oDates.length === 1) {
			oResponse.startDate = _oDates[0];
			oResponse.endDate = _oDates[0];
		} else {
			_oDatesSorted = _oDates.sort(function(date1, date2) {
				if (date1 < date2)
					return -1;
				if (date1 > date2)
					return 1;
				return 0;
			});
			oResponse.startDate = _oDatesSorted[0];
			oResponse.endDate = _oDatesSorted[_oDatesSorted.length - 1];
		};

		return oResponse;
	},

	_getLeaveTypesFromModel : function() {
		// This method reads the absence types from the model and fills the information in aLeaveTypes.
		// THis method was done to handle the slightly different formats in which the absence type information
		// is stored in the model -> it can be a single records or an array depending on if mock data or oData data is used
		var _aLeaveTypes = new Array();
		for (var x in this.oDataModel.oData) {
			if (x.substring(0, 21) === "AbsenceTypeCollection") {
				if (this.oDataModel.oData[x] instanceof Array) {
					for ( var i = 0; i < this.oDataModel.oData[x].length; i++) {
						_aLeaveTypes.push(this.oDataModel.oData[x][i]);
					}
				} else {
					_aLeaveTypes.push(this.oDataModel.oData[x]);
				}
			}
		}
		return _aLeaveTypes;
	},

	_setUpLeaveTypeData : function(absenceTypeCode) {
		// When the absence types are read for the first time the user has not yet
		// selected one absence type from the list. Therefore the absence type are
		// initially done for the first absence type of the list.
		if (this.slctLvType) {
			this.slctLvType.setSelectedKey(absenceTypeCode);
		}
		this.leaveType = this._readWithKey(this.aLeaveTypes, "AbsenceTypeCode", absenceTypeCode);
		//if defaultLeave Type is not fount in employee's leave types throw error! can't proceed.
		if(this.leaveType === null){
			hcm.emp.myleaverequests.utils.UIHelper.errorDialog(this.resourceBundle.getText("LR_DD_GENERIC_ERR"));
			jQuery.sap.log.warning("couldn't find defaultLeaveType","_setUpLeaveTypeData","hcm.emp.myleaverequests.view.S1");
		}
		this._leaveTypeDependantSettings(this.leaveType);
		this.getBalancesForAbsenceType(absenceTypeCode);
		this.selectorInititDone = true;
	},

	_readWithKey : function(aList, strKeyName, keyValue) {
		// searches an arry for a given key/value pair and returns the first matching entry
		// used to search the array of absence types
		for ( var i = 0; i < aList.length; i++) {
			if (aList[i][strKeyName] === keyValue) {
				return aList[i];
			}
		}
		return null;
	},

	_getBalancesBusyOn : function() {
		// Removes the "used days" and "remaining days" screen elements and replaces
		// them with busy indicators while the information is read asynchronously from the back end
		//Removal and addition is not optimal so visibilities are changed!		
			this.bookedVacation.setVisible(false);
			this.byId("LRS1_BUSY_BOOKEDDAYS").setVisible(true);
			this.remainingVacation.setVisible(false);
			this.byId("LRS1_BUSY_REMAININGDAYS").setVisible(true);
	},

	_getBalancesBusyOff : function() {
		// Removes the busy indicators and replaces them with the "used days" and "remaining days"
		// screen elements as soon as the asynchronous calls to get the information are finished
		//Removal and addition is not optimal so visibilities are changed!
		this.bookedVacation.setVisible(true);
		this.byId("LRS1_BUSY_BOOKEDDAYS").setVisible(false);
		this.remainingVacation.setVisible(true);
		this.byId("LRS1_BUSY_REMAININGDAYS").setVisible(false);
	},
	
	_leaveTypeDependantSettings : function(lt) {
		/* Time input visibility is controlled based leaveType selected */
		if (lt.AllowedDurationPartialDayInd) {
			if (this.timeInputElem) {
				this.timeInputElem.setVisible(true);
			};
		} else {
			if (this.timeInputElem) {
				this.timeInputElem.setVisible(false);
			};
		}
	},
	
	_orientationDependancies : function(currentMode){
		/*Months to be visible and layoutData is decided based on device type and orientation*/
		if (jQuery.device.is.phone === true) {
				if (this.cale) {
					this.cale.setMonthsToDisplay(1);
					this.cale.setMonthsPerRow(1);
				};	
		} else {
				if (currentMode == "portrait") {
					if (this.byId("LRS4_FRM_CNT_CALENDAR")) {
						this.byId("LRS4_FRM_CNT_CALENDAR").getLayoutData().setWeight(5);
					};
					if (this.cale) {
						this.cale.setMonthsToDisplay(1);
						this.cale.setMonthsPerRow(1);
					};
					if (this.formContainer) {
						this.formContainer.getLayoutData().setWeight(5);
					};
				} else if (currentMode == "landscape") {
					if (this.byId("LRS4_FRM_CNT_CALENDAR")) {
						this.byId("LRS4_FRM_CNT_CALENDAR").getLayoutData().setWeight(6);
					};
					if (this.cale) {
						this.cale.setMonthsToDisplay(2);
						this.cale.setMonthsPerRow(2);
					};
					if (this.formContainer) {
						this.formContainer.getLayoutData().setWeight(3);
					};
				}
		}
	},

	_deviceDependantLayout : function() {
		// This method defines the screen layout depending on the used device.
		// The only mechanism used here to rearrange the screen elements is the line-break
		// function of the sap.ui.commons.form.Form control.
		// The initial screen layout as defined in the html view is used for phones

		// ******************** valid for all devices - start ********************
		if (this.byId("LRS4_FLX_TOP")) {
			this.byId("LRS4_FLX_TOP").addStyleClass("s4leaveTypeSelectorFlx");
		}
		if (this.byId("LRS4_TXT_BOOKEDDAYS")) {
			this.byId("LRS4_TXT_BOOKEDDAYS").addStyleClass("s4BalancesFlxLeft");
		}
		if (this.byId("LRS4_TXT_REMAININGDAY")) {
			this.byId("LRS4_TXT_REMAININGDAY").addStyleClass("s4BalancesFlxRight");
		}
		if (this.byId("LRS4_FLX_ENDTIME")) {
			this.byId("LRS4_FLX_ENDTIME").addStyleClass("s4TimeInputFlx");
			this.byId("LRS4_FLX_ENDTIME").addStyleClass("s4TimeInputFlxEnd");
		}
		if (this.byId("LRS4_FLX_STARTTIME")) {
			this.byId("LRS4_FLX_STARTTIME").addStyleClass("s4TimeInputFlxStart");
			this.byId("LRS4_FLX_STARTTIME").addStyleClass("s4TimeInputFlx");
		}
		// ******************** valid for all devices - end ********************

		if (jQuery.device.is.phone) {
			// ******************** PHONE start ********************
			if (this.byId("LRS4_LEGEND")) {
				this.byId("LRS4_LEGEND").setExpandable(true);
				this.byId("LRS4_LEGEND").setExpanded(false);
			}
			if (this.timeInputElem) {
				this.timeInputElem.getLayoutData().setLinebreak(true);
			}

			if (this.formContainer) {
				this.formContainer.getLayoutData().setLinebreak(true);
				this.formContainer.getLayoutData().setWeight(3);
			}

			// ******************** PHONE end ********************
		} else {
			// ******************** TABLET / PC start *******************
			// scrolling is only needed for phone - disabled on other devices
			if (this.byId("S4")) {
				this.byId("S4").setEnableScrolling(false);
			}
			// Calendar - default full day? - Cale takes up complete 1st row
			if (this.byId("LRS4_FRM_CNT_CALENDAR")) {
				this.byId("LRS4_FRM_CNT_CALENDAR").getLayoutData().setWeight(6);
			}
			if (this.cale) {
				this.cale.setMonthsToDisplay(2);
				this.cale.setMonthsPerRow(2);
			}

			if (this.formContainer) {
				this.formContainer.getLayoutData().setLinebreak(false);
				this.formContainer.getLayoutData().setWeight(3);
			}
			// Balances
			if (this.balanceElem) {
				this.balanceElem.getLayoutData().setLinebreak(false);
			}

			// Time Input
			// - default full day? - Time Input should not be shown
			if (this.timeInputElem) {
				this.timeInputElem.getLayoutData().setLinebreak(true);
				this.timeInputElem.setVisible(false);
			}

			// Note
			if (this.noteElem) {
				this.noteElem.getLayoutData().setLinebreak(true);
			}

			// Legend
			if (this.byId("LRS4_LEGEND")) {
				this.byId("LRS4_LEGEND").setExpandable(true);
				this.byId("LRS4_LEGEND").setExpanded(true);
			}
			if (this.byId("LRS4_FRM_CNT_LEGEND")) {
				this.byId("LRS4_FRM_CNT_LEGEND").getLayoutData().setLinebreak(true);
				this.byId("LRS4_FRM_CNT_LEGEND").getLayoutData().setWeight(9);
			}
			// ******************** TABLET / PC end ********************
		}
		
		
		/**
     * @ControllerHook Extend behavior of device Dependant Layout
     * This hook method can be used to add UI or business logic 
     * It is called when the deviceDependantLayout method executes
     * @callback hcm.emp.myleaverequests.view.S1~extHookDeviceDependantLayout
     */
		if(this.extHookDeviceDependantLayout) {
			this.extHookDeviceDependantLayout();
		}
		
	},

	_getDaysOfRange : function(startDate, endDate) {
		var _startDate = null;
		var _endDate = null;
		var aDaysOfRange = [];

		if (startDate instanceof Date) {
			_startDate = new Date(startDate.getUTCFullYear(),startDate.getUTCMonth(),startDate.getUTCDate());
		} else if (typeof startDate === "string") {
			_startDate = new Date(startDate);
			_startDate = new Date(_startDate.getUTCFullYear(),_startDate.getUTCMonth(),_startDate.getUTCDate());
		}

		if (endDate instanceof Date) {
			_endDate = new Date(endDate.getUTCFullYear(),endDate.getUTCMonth(),endDate.getUTCDate());
		} else if (typeof endDate === "string") {
			_endDate = new Date(endDate);
			_endDate = new Date(_endDate.getUTCFullYear(),_endDate.getUTCMonth(),_endDate.getUTCDate());
		}

		if (_endDate === null) {
			return [_startDate.toDateString()];
		} else {
			while (_startDate <= _endDate) {
				// add day to result array
				aDaysOfRange.push(_startDate.toDateString());
				// proceed to the next day
				_startDate.setTime(_startDate.getTime() + 86400000);
			}
			return aDaysOfRange;
		}
	},

	onSend : function() {
		this.submit(true);
	},

	submit : function(isSimulation) {
		// This method is called when the "send" button is tapped after entering a new leave request
		// or changing an existing one.
		// The method is called two times during one "submit" event. The first time it is called by the
		// tap event handler of the submit button. This call is done with parameter isSimulation=true. This
		// parameter is passed on to the backend where the data is checked. If the check has a positive result
		// a confirmation popup with a summary of the lr data is show. When the user confirmr this popup this function
		// is called the second time this time not in simulate mode

		var sStartDate, sStartTime, sEndDate, sEndTime;
		// reset globals
		this.bApproverOK = null;
		this.bSubmitOK = null;
		this.oSubmitResult = {};
		this.bSimulation = isSimulation;

		if (this.cale) {
			var _oStartEndDates = this._getStartEndDate(this.cale.getSelectedDates());
			// collect data for submit
			if (this.timeFrom && this.timeTo && this.leaveType.AllowedDurationPartialDayInd) {
				sStartDate = hcm.emp.myleaverequests.utils.Formatters.DATE_YYYYMMdd(_oStartEndDates.startDate) + 'T00:00:00';
				if(this.timeFrom.getValue() === ""){
					sStartTime = 'PT00H00M00S';
				}else{
					sStartTime = "PT"+ this.timeFrom.getValue().substring(0, 2) + "H" + this.timeFrom.getValue().substring(3, 5) + "M00S";
				}
				sEndDate = hcm.emp.myleaverequests.utils.Formatters.DATE_YYYYMMdd(_oStartEndDates.endDate) + 'T00:00:00';
				if(this.timeTo.getValue() === ""){
					sEndTime = 'PT00H00M00S';
				}else{
					sEndTime = "PT"+ this.timeTo.getValue().substring(0, 2) + "H" + this.timeTo.getValue().substring(3, 5) + "M00S";
				}
			} else {
				sStartDate = hcm.emp.myleaverequests.utils.Formatters.DATE_YYYYMMdd(_oStartEndDates.startDate) + 'T00:00:00';
				sStartTime = 'PT00H00M00S';
				sEndDate = hcm.emp.myleaverequests.utils.Formatters.DATE_YYYYMMdd(_oStartEndDates.endDate) + 'T00:00:00';
				sEndTime = 'PT00H00M00S';
			}
			// submit leave request
			if (!this.oBusy) {
				this.oBusy = new sap.m.BusyDialog();
			}
			this.oBusy.open();
			var notes = "";
			if (this.note) { // App Designer specific: in case note field was removed
				notes = this.note.getValue();
			}
			if (this.changeMode) {
				// if an existing LR is changed additional data is needed to identify the lr to be changed
				hcm.emp.myleaverequests.utils.DataManager.changeLeaveRequest(this.oChangeModeData.employeeID,
						this.oChangeModeData.requestID, this.oChangeModeData.changeStateID, this.oChangeModeData.leaveKey,
						sStartDate, sStartTime, sEndDate, sEndTime, this.leaveType.AbsenceTypeCode, notes, isSimulation,
						this.onSubmitLRCsuccess, this.onSubmitLRCfail);

			} else {
				hcm.emp.myleaverequests.utils.DataManager.submitLeaveRequest(sStartDate, sStartTime, sEndDate, sEndTime,
						this.leaveType.AbsenceTypeCode, notes, isSimulation, this.onSubmitLRCsuccess, this.onSubmitLRCfail);
			}
		
		};
		
		
		/**
     * @ControllerHook Extend behavior of submit
     * This hook method can be used to add UI or business logic 
     * It is called when the submit method executes
     * @callback hcm.emp.myleaverequests.view.S1~extHookSubmit
     */
		if(this.extHookSubmit) {
			this.extHookSubmit();
		};
		
	},

	onSubmitLRCfail : function(aErrorMessages) {
		var _this = hcm.emp.myleaverequests.utils.UIHelper.getControllerInstance();
		_this.evalSubmitResult("submitLRC", false, {});
		_this.oBusy.close();
		
		/**
     * @ControllerHook Extend behavior of request submit failure
     * This hook method can be used to add UI or business logic 
     * It is called when the submit method executes
     * @callback hcm.emp.myleaverequests.view.S1~extHookOnSubmitLRCfail
     * @param {object} ErrorMessages Object
     * @return {object} ErrorMessages Object
     */
		if(this.extHookOnSubmitLRCfail) {
			aErrorMessages = this.extHookOnSubmitLRCfail(aErrorMessages);
		};
		
		hcm.emp.myleaverequests.utils.UIHelper.errorDialog(aErrorMessages);
	},

	onSubmitLRCsuccess : function(oResult, oMsgHeader) {
		var _this = hcm.emp.myleaverequests.utils.UIHelper.getControllerInstance();
		
		
		/**
     * @ControllerHook Extend behavior of request submit failure
     * This hook method can be used to add UI or business logic 
     * It is called when the submit method executes
     * @callback hcm.emp.myleaverequests.view.S1~extHookOnSubmitLRCsuccess
     * @param {object} oResult Object
     * @param {object} oMsgHeader Object
     * @return {object} Object with oResult and oMsgHeader
     */
		if(this.extHookOnSubmitLRCsuccess) {
			var extResult = this.extHookOnSubmitLRCsuccess(oResult, oMsgHeader);
			oResult = extResult.oResult;			
			oMsgHeader = extResult.oMsgHeader;
		};
		
		_this.oLRSuccessResult = oResult;	
		// get approver for confirmation dialog
		if (_this.bSimulation) {
			
			if(oMsgHeader.severity){
			// show the warning message in a MessageBox
			 if(oMsgHeader.severity=="warning")	{
				 //inject the method into the native prototype for those browsers which don't support trim()
				 if(typeof String.prototype.trim !== 'function') {
					  String.prototype.trim = function() {
					    return this.replace(/^\s+|\s+$/g, ''); 
					  };
					}
				 var detailsMsg = "";
				 oMsgHeader.details.forEach(function(entry) {
					 detailsMsg += decodeURI(entry.message).trim() + '\r\n';
				 });
				 
			   sap.ca.ui.message.showMessageBox({
			       type: sap.ca.ui.message.Type.WARNING,
			       message: decodeURI(oMsgHeader.message).trim(),
			       details: detailsMsg
			   }, 
			   _this._fetchApprover(oResult));
			 }else{
				_this._fetchApprover(oResult);
			 }
			}else{
				_this._fetchApprover(oResult);
			}			
			
		}else{
			
				//hcm.emp.myleaverequests.utils.Ajax.clearCache();
				//hcm.emp.myleaverequests.utils.CalendarTools.clearCache();

				// just for change mode - remove old day markings
				if (_this.cale && _this.changeMode) {
					_this.cale.toggleDatesType(_this
							._getDaysOfRange(_this.oChangeModeData.startDate, _this.oChangeModeData.endDate),
							_this.oChangeModeData.evtType, false);
				}

				sap.m.MessageToast.show(_this.resourceBundle.getText("LR_SUBMITDONE", [_this.sApprover]), {
					// duration : 3000,
					width : "15em"
				// my : "center center",
				// at : "center center",
				// offset : "0 0",
				// collision : "fit fit",
				// onClose : null,
				// autoClose : true,
				// animationTimingFunction : "ease",
				// animationDuration : 1000
				});

				if (_this.changeMode === true) {
					//TODO: back to history
					//var oBus = sap.ui.getCore().getEventBus();
					//oBus.publish("nav", "back");
				}
				// else {
				//_this._clearData();
				//if (_this.cale) {
				//	_this._setHighlightedDays(_this.cale.getCurrentDate());
				//};
				
				_this._clearData();
			 	_this._setUpLeaveTypeData(_this.slctLvType.getSelectedKey());
			 	_this.note.setValue("");
				if (_this.cale) {
					_this.cale.unselectAllDates();
				 
					 var daysOfRange = _this._getDaysOfRange(_this.oLRSuccessResult.StartDate, _this.oLRSuccessResult.EndDate);
					//Updating the Calendar Cache
					 for(var i=0;i<daysOfRange.length;i++){
						 var currDate = new Date(daysOfRange[i]);
						 //get the first day of month and its cache data
						 var firstDayOfMonth = new Date(currDate.getFullYear(),currDate.getMonth(),1);
						 var CalCache = hcm.emp.myleaverequests.utils.CalendarTools.oCache;
						 //check if cache exists for that month
						 if(CalCache.hasOwnProperty(firstDayOfMonth.toString())){
							 var currObj = CalCache[firstDayOfMonth];
							 //find the date in all the other arrays and remove it
							 for (var key in currObj) {
								 if (currObj.hasOwnProperty(key)) {
									 if(currObj[key].length > 0)
									 {
										 for(var j=0;j<currObj[key].length;j++){
											 //direct comparison would lead to erraneous output
											 //hence convert both to dates and then to sting and then compare
											 if((new Date(currObj[key][j])).toString() == (new Date(currDate)).toString()){
												 //delete currObj[key][j]; // DON'T USE because it sets it to undefined
												 currObj[key].splice(j,1);
												 //delete the array if its empty || else it creates trouble in label painting
												 if(currObj[key].length < 1){
													 delete currObj[key];//use delete here, because key is not integer/index
												 }
												 break;
											 }
										 }
									 }
								 }
							 }
							 //push to Approval pending i.e., SENT array
							 //if array exists already
							 if(currObj.hasOwnProperty("SENT"))
								 currObj["SENT"].push(daysOfRange[i]);
							 //else create the array and push
							 else{
								 currObj.SENT = new Array(daysOfRange[i]);
							 }
						 }
					 }
					_this.cale.toggleDatesType(daysOfRange, sap.me.CalendarEventType.Type06, false);
					_this.cale.toggleDatesType(daysOfRange, sap.me.CalendarEventType.Type01, false);
					_this.cale.toggleDatesType(daysOfRange, sap.me.CalendarEventType.Type07, false);
					if(!!sap.me.CalendarEventType.Type10){
						_this.cale.toggleDatesType(daysOfRange, sap.me.CalendarEventType.Type10, false);
					}
					_this.cale.toggleDatesType(daysOfRange,	sap.me.CalendarEventType.Type04, true);
					
				}
		}
		
		_this.oBusy.close();	

	},
	
	_fetchApprover : function(oLRResult){
		var _this = hcm.emp.myleaverequests.utils.UIHelper.getControllerInstance();
		var _oResult = {};
		if(oLRResult.ApproverEmployeeName!=""){
			//reset to selected item. issue with binding trigger. need to check.
			_this.slctLvType.setSelectedKey(_this.leaveType.AbsenceTypeCode);
			
			_oResult.sApprover = _this.sApprover = oLRResult.ApproverEmployeeName;
			_this.evalSubmitResult("getApprover", true, _oResult);
			_this.evalSubmitResult("submitLRC", true, _this.oLRSuccessResult);
			
		}else{
			hcm.emp.myleaverequests.utils.DataManager.getApprover(function(sApprover) {			
				//reset to selected item. issue with binding trigger. need to check.
				_this.slctLvType.setSelectedKey(_this.leaveType.AbsenceTypeCode);
				
				_oResult.sApprover = _this.sApprover = sApprover;
				_this.evalSubmitResult("getApprover", true, _oResult);
				_this.evalSubmitResult("submitLRC", true, _this.oLRSuccessResult);
			
			}, function() {
				_oResult.sApprover = _this.resourceBundle.getText("LR_UNKNOWN");
				_this.evalSubmitResult("getApprover", false, _oResult);
			}, this);
		}

	},

	evalSubmitResult : function(sCaller, bSuccess, oResult) {
		// evaluate the results of two asynchronous calls (submit leave request and get approver) to decide when the
		// confirmation popup can be shown
		var _this = hcm.emp.myleaverequests.utils.UIHelper.getControllerInstance();
		if (sCaller === "submitLRC") {
			_this.bSubmitOK = bSuccess;
			_this.oSubmitResult = oResult;
		}
		if (sCaller === "getApprover") {
			_this.bApproverOK = bSuccess;
			_this.sApprover = oResult.sApprover;
		}
		if (_this.bSubmitOK === false) {
			if (_this.oBusy) {
				_this.oBusy.close();
			}
			// errors are already shown by the caller
		} else if (_this.bSubmitOK === true) {
			if (_this.bApproverOK === false) {
				if (_this.oBusy) {
					_this.oBusy.close();
				}
				_this.callDialog(_this.oSubmitResult, _this.sApprover);
			} else if (_this.bApproverOK === true) {
				if (_this.oBusy) {
					_this.oBusy.close();
				}
				_this.callDialog(_this.oSubmitResult, _this.sApprover);
			}
		}
	},

	callDialog : function(oSimResponse, sApprover) {
		// here the confirmation dialog is created which is shown when the "send" button is clicked
		// The generic Dialog popup sap.ca.common.uilib.dialog.dialog is reused.
		var _this = hcm.emp.myleaverequests.utils.UIHelper.getControllerInstance();

		var _from;
		var _to;

		if (jQuery.sap.getUriParameters().get("responderOn")) {
			if (_this.selRange.start === null) {
				try {
					_this.selRange.start = sap.me.Calendar.parseDate(_this.cale.getSelectedDates()[0]);
				} catch (e) {
					_this.selRange.start = new Date(_this.cale.getSelectedDates()[0]);
				}
			}
			_from = _this.selRange.start;
			if(_this.selRange.end === null){
				_to = _this.selRange.start;
			}else{
				_to = _this.selRange.end;
			}
		}else {
			if (_this.leaveType.AllowedDurationPartialDayInd) {
				_from = hcm.emp.myleaverequests.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(oSimResponse.StartDate, "medium");
				_to = hcm.emp.myleaverequests.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(oSimResponse.EndDate, "medium");
				_from += " " + hcm.emp.myleaverequests.utils.Formatters.TIME_hhmm(oSimResponse.StartTime);
				_to += " " + hcm.emp.myleaverequests.utils.Formatters.TIME_hhmm(oSimResponse.EndTime);
			} else {
				_from = hcm.emp.myleaverequests.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(oSimResponse.StartDate);
				_to = hcm.emp.myleaverequests.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(oSimResponse.EndDate);
			}
		}

		var oSettings = {
			question : this.resourceBundle.getText("LR_CONFIRMATIONMSG", [sApprover]),
			additionalInformation : [
					{
						label : _this.resourceBundle.getText("LR_BALANCE_DEDUCTIBLE"),
						text : this.leaveType.AbsenceTypeName
					},
					{
						label : _this.resourceBundle.getText("LR_FROM"),
						text : _from
					},
					{
						label : _this.resourceBundle.getText("LR_TO"),
						text : _to
					},
					{
						label : _this.resourceBundle.getText("LR_REQUEST"),
						text : hcm.emp.myleaverequests.utils.Formatters.DURATION(oSimResponse.WorkingDaysDuration,
								oSimResponse.WorkingHoursDuration)
								+ " "
								+ hcm.emp.myleaverequests.utils.Formatters.DURATION_UNIT(oSimResponse.WorkingDaysDuration,
										oSimResponse.WorkingHoursDuration)
					}],
			showNote : false,
			title : _this.resourceBundle.getText("LR_TITLE_SEND"),
			confirmButtonLabel : _this.resourceBundle.getText("LR_OK")
		};
		
		
		/**
     * @ControllerHook Modify the Dialog Content
     * This hook method can be used to modify the dialog content
     * It is called when the leave was submitted and oData response was received
     * @callback hcm.emp.myleaverequests.view.S1~extHookCallDialog
     * @param {object} Settings Object
     * @return {object} Settings Object
     */
		if(this.extHookCallDialog) {
			oSettings = this.extHookCallDialog(oSettings);
		};

		sap.ca.ui.dialog.factory.confirm(oSettings, function(response) {
			if (response.isConfirmed == true) {
				_this.submit(false);
			}
		});
	},

	onSelectionChange : function(evt) {
		var selectdItem = evt.getParameter("selectedItem");
		var absenceTypeCode = selectdItem.getProperty("key");
		this._setUpLeaveTypeData(absenceTypeCode);
	},

	getBalancesForAbsenceType : function(sAbsenceTypeCode) {
		// Here the balances for the currently displayed absence type are read (currently we display
		// "BalancePlannedQuantity"
		// and "BalanceUsedQuantity").
		// When the balances for an absence type are read for the first time the data will come from the backend. If the
		// same
		// absence type is selected again later on the balances will be read from a buffer in utils.Ajax. This cache is
		// cleared
		// after a LR is created, changed or withdrawn (look for hcm.emp.myleaverequests.utils.Ajax.clearCache())
		if (sAbsenceTypeCode == undefined || sAbsenceTypeCode.length < 1)
			return;

		if (this.bookedVacation) {
			this.bookedVacation.setNumber("-");
		};
		if (this.remainingVacation) {
			this.remainingVacation.setNumber("-");
		};
		this._getBalancesBusyOn();

		var _this = this;

		//sap.ca.ui.utils.busydialog.requireBusyDialog();
		hcm.emp.myleaverequests.utils.DataManager.getBalancesForAbsenceType(sAbsenceTypeCode, function(sBalancePlanned,
				sTimeUnitNamePlanned, sBalanceAvailable, sTimeUnitNameAvailable, sTimeAccountTypeName, sBalanceUsed, sBalanceTotalUsedQuantity) {
			
			// Success handler for DataManager.getBalancesForAbsenceType
			_this._getBalancesBusyOff();
			// create json model to bind the values to the s4 screen elements
			var json = {
				BalancePlannedQuantity : sBalancePlanned,
				BalanceAvailableQuantity : sBalanceAvailable,
				BalanceUsedQuantity : sBalanceUsed,
				BalanceTotalUsedQuantity : sBalanceTotalUsedQuantity, 
				TimeUnitName : sTimeUnitNameAvailable
			};
			var oModel = new sap.ui.model.json.JSONModel(json);
			_this.getView().setModel(oModel, "TimeAccount");
			oModel.createBindingContext("/", function(oContext) {
				_this.getView().setBindingContext(oContext, "TimeAccount");
			});

			//sap.ca.ui.utils.busydialog.releaseBusyDialog();
			
		}, function(aErrorMessages) {
			// Error handler for DataManager.getBalancesForAbsenceType
			//sap.ca.ui.utils.busydialog.releaseBusyDialog();
			
			_this._getBalancesBusyOff();
			if (_this.bookedVacation) {
				_this.bookedVacation.setNumber("-");
			}
			_this.bookedVacation.setNumberUnit("-");
			if (_this.remainingVacation) {
				_this.remainingVacation.setNumber("-");
			}
			_this.remainingVacation.setNumberUnit("-");
			hcm.emp.myleaverequests.utils.UIHelper.errorDialog(aErrorMessages);
		}, this);
	},

	onTimeChange : function() {
		// set default value of the endTime picker based on the startTime
		var _endTime = this.byId("LRS4_DAT_ENDTIME").getValue();
		var _startTime = this.byId("LRS4_DAT_STARTTIME").getValue();

		if (this.byId("LRS4_DAT_ENDTIME") && _endTime === "" && _startTime !== "") {
			this.byId("LRS4_DAT_ENDTIME").setValue(_startTime);
		}
		if (this.byId("LRS4_DAT_STARTTIME") && _endTime !== "" && _startTime === "") {
			this.byId("LRS4_DAT_STARTTIME").setValue(_endTime);
		}

	},

	onSendClick : function() {
		this.submit(true);
	},

	onCancelClick : function() {
		if(!this.changeMode){
			this._isLocalReset = true;
			this._clearData();		
			hcm.emp.myleaverequests.utils.CalendarTools.clearCache();
			this._setHighlightedDays(this.cale.getCurrentDate());		
		}else{
			this.oRouter.navTo("master");
		}
	},

	onEntitlementClick : function() {
		this.oRouter.navTo("entitlements", {});
	},

	onHistoryClick : function() {
		this.oRouter.navTo("master", {});
	}

});

},
	"hcm/emp/myleaverequests/view/S1.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<!-- Copyright (C) 2009-2013 SAP AG or an SAP affiliate company. All rights reserved -->\n<sap.ui.core:View id="S1" xmlns="sap.m"\n    xmlns:sap.ui.layout.form="sap.ui.layout.form" xmlns:sap.ui.layout="sap.ui.layout"\n    xmlns:sap.me="sap.me" xmlns:sap.ui.core="sap.ui.core"\n    controllerName="hcm.emp.myleaverequests.view.S1">\n\n\t<Page id="S1_page" title="{i18n>LR_TITLE_HOME_VIEW}">\n\t\t<content>\n\t\t\t<sap.ui.layout:Grid id="LRS4_FLX_TOP" width="auto" defaultIndent="L4 M3"\n\t\t\t\tdefaultSpan="L4 M6 S12" class="s4leaveTypeSelectorFlx">\n\t\t\t\t<sap.ui.layout:content>\n\t\t\t\t\t<Select id="SLCT_LEAVETYPE" change="onSelectionChange"\n\t\t\t\t\t\twidth="100%">\t\t\t\t\t\t\n\t\t\t\t\t</Select>\n\t\t\t\t</sap.ui.layout:content>\n\t\t\t</sap.ui.layout:Grid>\n\n\t\t\t<sap.ui.layout:Grid defaultSpan="L12 M12 S12"\n\t\t\t\twidth="auto">\n\t\t\t\t<sap.ui.layout:content>\n\t\t\t\t\t<sap.ui.layout.form:Form id="LRS4_FRM_MAIN"\n\t\t\t\t\t\tminWidth="1024" maxContainerCols="2">\n\t\t\t\t\t\t<sap.ui.layout.form:layout>\n\t\t\t\t\t\t\t<sap.ui.layout.form:ResponsiveGridLayout\n\t\t\t\t\t\t\t\tlabelSpanL="3" labelSpanM="3" emptySpanL="4" emptySpanM="4"\n\t\t\t\t\t\t\t\tcolumnsL="1" columnsM="1" />\n\t\t\t\t\t\t</sap.ui.layout.form:layout>\n\n\t\t\t\t\t\t<sap.ui.layout.form:formContainers>\n\t\t\t\t\t\t\t<sap.ui.layout.form:FormContainer\n\t\t\t\t\t\t\t\tid="LRS4_FRM_CNT_CALENDAR">\n\t\t\t\t\t\t\t\t<sap.ui.layout.form:layoutData>\n\n\t\t\t\t\t\t\t\t\t<sap.ui.layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\tweight="6" linebreak="true"></sap.ui.layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t</sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t<sap.ui.layout.form:formElements>\n\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:FormElement\n\t\t\t\t\t\t\t\t\t\tid="LRS4_FELEM_CALENDAR">\n\t\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:ResponsiveFlowLayoutData></sap.ui.layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:fields>\n\t\t\t\t\t\t\t\t\t\t\t<sap.me:Calendar id="LRS4_DAT_CALENDAR"\n\t\t\t\t\t\t\t\t\t\t\t\tclass="s4Calendar"></sap.me:Calendar>\n\t\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:fields>\n\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:FormElement>\n\t\t\t\t\t\t\t\t</sap.ui.layout.form:formElements>\n\t\t\t\t\t\t\t</sap.ui.layout.form:FormContainer>\n\t\t\t\t\t\t\t<sap.ui.layout.form:FormContainer\n\t\t\t\t\t\t\t\tid="LRS4_FRM_CNT_BALANCES">\n\t\t\t\t\t\t\t\t<sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t<sap.ui.layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\tweight="3"></sap.ui.layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t</sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t<sap.ui.layout.form:formElements>\n\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:FormElement\n\t\t\t\t\t\t\t\t\t\tid="LRS4_FELEM_BALANCES">\n\t\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:ResponsiveFlowLayoutData></sap.ui.layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:fields>\n\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:Grid width="100%"\n\t\t\t\t\t\t\t\t\t\t\t\tdefaultSpan="L6 M6 S6">\n\t\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:content>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:VerticalLayout id="LRS4_TXT_BOOKEDDAYS"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tclass="s4BalancesFlxLeft" width="100%">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<BusyIndicator id="LRS1_BUSY_BOOKEDDAYS" size= "1em" visible ="true"></BusyIndicator>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<ObjectNumber id="LRS4_TXT_BOOKED_DAYS"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tclass="s4BALANCEOBJECT" number="{TimeAccount>BalanceTotalUsedQuantity}"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tunit="{TimeAccount>TimeUnitName}" visible="false">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<FlexItemData growFactor="1"></FlexItemData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</ObjectNumber>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<ObjectStatus id="LRS4_TXT_BOOKED" text="{i18n>LR_BOOKED}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<FlexItemData growFactor="1"></FlexItemData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</ObjectStatus>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:VerticalLayout>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:VerticalLayout id="LRS4_TXT_REMAININGDAY"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tclass="s4BalancesFlxRight" width="100%">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<BusyIndicator id="LRS1_BUSY_REMAININGDAYS" size= "1em" visible ="true"></BusyIndicator>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<ObjectNumber id="LRS4_TXT_REMAINING_DAYS"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tclass="s4BALANCEOBJECT" number="{TimeAccount>BalanceAvailableQuantity}"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tunit="{TimeAccount>TimeUnitName}" visible="false">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<FlexItemData growFactor="1"></FlexItemData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</ObjectNumber>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<ObjectStatus id="LRS4_TXT_REMAINING" text="{i18n>LR_REMAINING}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<FlexItemData growFactor="1"></FlexItemData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</ObjectStatus>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:VerticalLayout>\n\t\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:content>\n\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:Grid>\n\t\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:fields>\n\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:FormElement>\n\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:FormElement\n\t\t\t\t\t\t\t\t\t\tid="LRS4_FELEM_TIMEINPUT" visible="false">\n\t\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"></sap.ui.layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:fields>\n\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:Grid width="100%"\n\t\t\t\t\t\t\t\t\t\t\t\tdefaultSpan="L6 M6 S6">\n\t\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:content>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:VerticalLayout\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tclass="s4TimeInputFlxStart s4TimeInputFlx" width="100%">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label id="LRS4_LBL_STARTTIME" text="{i18n>LR_FROM}"></Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<DateTimeInput id="LRS4_DAT_STARTTIME"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tchange="onTimeChange" type="Time"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvalueFormat="HH:mm"></DateTimeInput>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:VerticalLayout>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:VerticalLayout\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tclass="s4TimeInputFlx s4TimeInputFlxEnd" width="100%">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label id="LRS4_LBL_ENDTIME" text="{i18n>LR_TO}"></Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<DateTimeInput id="LRS4_DAT_ENDTIME" change="onTimeChange"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttype="Time" valueFormat="HH:mm"></DateTimeInput>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:VerticalLayout>\n\t\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:content>\n\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:Grid>\n\t\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:fields>\n\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:FormElement>\n\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:FormElement\n\t\t\t\t\t\t\t\t\t\tid="LRS4_FELEM_NOTE">\n\t\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"></sap.ui.layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:fields>\n\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:Grid id="LRS4_NOTE" width="100%"\n\t\t\t\t\t\t\t\t\t\t\t\tdefaultSpan="L12 M12 S12">\n\t\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:content>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<Label id="LRS4_LBL_NOTE" text="{i18n>LR_NOTE}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"></sap.ui.layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<TextArea id="LRS4_TXA_NOTE" class="s4Notes "\n\t\t\t\t\t\t\t\t\t\t\t\t\t\twidth="100%" height="6rem" wrapping="None">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="8" linebreak="true"></sap.ui.layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</TextArea>\n\t\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:content>\n\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:Grid>\n\t\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:fields>\n\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:FormElement>\n\t\t\t\t\t\t\t\t\t<!-- extension point for additional fields -->\n\t\t\t\t\t\t\t\t\t<sap.ui.core:ExtensionPoint name="extS1Field"></sap.ui.core:ExtensionPoint>\n\t\t\t\t\t\t\t\t</sap.ui.layout.form:formElements>\n\t\t\t\t\t\t\t</sap.ui.layout.form:FormContainer>\n\t\t\t\t\t\t\t<sap.ui.layout.form:FormContainer\n\t\t\t\t\t\t\t\tid="LRS4_FRM_CNT_LEGEND">\n\t\t\t\t\t\t\t\t<sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t<sap.ui.layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\tweight="9" linebreak="true"></sap.ui.layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t</sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t<sap.ui.layout.form:formElements>\n\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:FormElement\n\t\t\t\t\t\t\t\t\t\tid="LRS4_FELEM_LEGEND">\n\t\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"></sap.ui.layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:fields>\n\t\t\t\t\t\t\t\t\t\t\t<sap.me:CalendarLegend id="LRS4_LEGEND"\n\t\t\t\t\t\t\t\t\t\t\t\tclass="s4LEGEND" legendWidth="18em">\n\t\t\t\t\t\t\t\t\t\t\t\t<sap.me:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="LRS4_LYO_LEGEND" minWidth="30" weight="15"></sap.ui.layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</sap.me:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t</sap.me:CalendarLegend>\n\t\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:fields>\n\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:FormElement>\n\t\t\t\t\t\t\t\t</sap.ui.layout.form:formElements>\n\t\t\t\t\t\t\t</sap.ui.layout.form:FormContainer>\n\t\t\t\t\t\t</sap.ui.layout.form:formContainers>\n\t\t\t\t\t\t<sap.ui.layout.form:layout>\n\t\t\t\t\t\t\t<sap.ui.layout.form:ResponsiveLayout\n\t\t\t\t\t\t\t\tid="LRS4_FRM_MAIN_LAYOUT"></sap.ui.layout.form:ResponsiveLayout>\n\t\t\t\t\t\t</sap.ui.layout.form:layout>\n\t\t\t\t\t</sap.ui.layout.form:Form>\n\t\t\t\t</sap.ui.layout:content>\n\t\t\t</sap.ui.layout:Grid>\n\t\t</content>\n\t</Page>\n</sap.ui.core:View>',
	"hcm/emp/myleaverequests/view/S2.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("hcm.emp.myleaverequests.utils.Formatters");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("hcm.emp.myleaverequests.view.S2", {

	extHookChangeFooterButtons: null,	
	extHookTimeAccountCollection : null,
	
	onInit : function() {

		sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit.call(this);

		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();

		this.entitlementTableCntrl = this.byId("entitlemntTble");		
		this.templateCntrl = this.byId("LRS2_LISTITEM");

		this.oRouter.attachRouteMatched(this._handleRouteMatched, this);

		hcm.emp.myleaverequests.utils.DataManager.init(this.oDataModel, this.resourceBundle);
		hcm.emp.myleaverequests.utils.Formatters.init(this.resourceBundle);
	},
	
	_handleRouteMatched : function(){
		sap.ca.ui.utils.busydialog.requireBusyDialog();		
		var _this = this;		
		hcm.emp.myleaverequests.utils.DataManager.getTimeAccountCollection(function(response) {			
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
			
			/**
	     * @ControllerHook Modify the TimeAccountCollection response
	     * This hook method can be used to modify the TimeAccountCollection
	     * It is called when the method getTimeAccountCollection in DataManager executes
	     * @callback hcm.emp.myleaverequests.view.S2~extHookTimeAccountCollection
	     * @param {object} TimeAccountCollection Object
	     * @return {object} TimeAccountCollection Object
	     */
			if(this.extHookTimeAccountCollection) {
				response = this.extHookTimeAccountCollection(response);
			};
			
		  _this.entitlementTableCntrl.setModel(new sap.ui.model.json.JSONModel(response));		   
		  _this.entitlementTableCntrl.bindItems("/TimeAccountCollection", _this.templateCntrl);
		}, function(objResponse) {
				sap.ca.ui.utils.busydialog.releaseBusyDialog();
				hcm.emp.myleaverequests.utils.UIHelper.errorDialog(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse));
		});
	},

	getHeaderFooterOptions : function() {
		var objHdrFtr = {
			sI18NFullscreenTitle : "LR_TITLE_BALANCE_VIEW",
			onBack: jQuery.proxy(function() {
				//Check if a navigation to master is the previous entry in the history
				var sDir = sap.ui.core.routing.History.getInstance().getDirection(this.oRouter.getURL("home"));
				if (sDir === "Backwards") {
					window.history.go(-1);
				} else {
					//we came from somewhere else - create the master view
					this.oRouter.navTo("home");
				}
			}, this)
		};
		/**
         * @ControllerHook Modify the footer buttons
         * This hook method can be used to add and change buttons for the detail view footer
         * It is called when the decision options for the detail item are fetched successfully
         * @callback hcm.emp.myleaverequests.view.S2~extHookChangeFooterButtons
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
	"hcm/emp/myleaverequests/view/S2.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View id="S2" xmlns:core="sap.ui.core"\n    xmlns="sap.m" xmlns:sap.ui.layout="sap.ui.layout" controllerName="hcm.emp.myleaverequests.view.S2">\n\n   <Page id="S2_page" >\n        <content>\n            <Table id="entitlemntTble" items="{TimeAccountCollection}">\n                <ColumnListItem id="LRS2_LISTITEM">\n                        <cells>\n                              <sap.ui.layout:VerticalLayout width="100%">\n                                \n                                    <ObjectIdentifier id="LRS2_LIST_ITEM_ACCOUNT" title="{TimeAccountTypeName}" badgeNotes="false" badgePeople="false" badgeAttachments="false"></ObjectIdentifier>\n                                        <sap.ui.layout:HorizontalLayout id="LRS2_HBOX1">\n                                       \n                                            <ObjectIdentifier text="{i18n>LR_UP_TO}" hAlign="Left" badgeNotes="false" badgePeople="false" badgeAttachments="false"></ObjectIdentifier>\n                                            <Label width="1em"></Label>\n                                            <ObjectIdentifier id="LRS2_LIST_ITEM_END_DATE" hAlign="Center" text="{path:\'DeductionEndDate\', formatter:\'hcm.emp.myleaverequests.utils.Formatters.DATE_ODATA_EEEdMMMyyyy\'}" badgeNotes="false" badgePeople="false" badgeAttachments="false"></ObjectIdentifier>\n                                        \n                                        </sap.ui.layout:HorizontalLayout>\n                              </sap.ui.layout:VerticalLayout>\n                            <ObjectNumber number="{path:\'BalanceAvailableQuantity\', formatter:\'hcm.emp.myleaverequests.utils.Formatters.BALANCE\'}" numberUnit="{TimeUnitName}"></ObjectNumber>\n                            <ObjectNumber number="{parts: [{path:\'BalanceUsedQuantity\'},{path: \'BalanceApprovedQuantity\'},{path: \'BalanceRequestedQuantity\'}], formatter:\'hcm.emp.myleaverequests.utils.Formatters.calculateUsed\'}" numberUnit="{TimeUnitName}"></ObjectNumber>\n                            <ObjectNumber number="{path:\'BalanceEntitlementQuantity\', formatter:\'hcm.emp.myleaverequests.utils.Formatters.BALANCE\'}" numberUnit="{TimeUnitName}"></ObjectNumber>\n                            <!-- extension point for additional Column Item -->\n                            <core:ExtensionPoint name="extS2ColItem"></core:ExtensionPoint>\n                        </cells>\n                </ColumnListItem>               \n                <columns>\n                    <Column width="19em">\n                        <header>\n                            <Label text="{i18n>LR_BALANCE_DEDUCTIBLE}"></Label>\n                        </header>\n                    </Column>\n                    <Column hAlign="Right" minScreenWidth="small" demandPopin="true">\n                        <header>\n                            <Label text="{i18n>LR_BALANCE_BALANCE}"></Label>\n                        </header>\n                    </Column>\n                    <Column hAlign="Right" minScreenWidth="small" demandPopin="true">\n                        <header>\n                            <Label text="{i18n>LR_BALANCE_USED}"></Label>\n                        </header>\n                    </Column>\n                    <Column hAlign="Right" minScreenWidth="small" demandPopin="true">\n                        <header>\n                            <Label text="{i18n>LR_ENTITLEMENT_QUOTA}"></Label>\n                        </header>\n                    </Column>\n                    <!-- extension point for additional Column Header -->\n                    <core:ExtensionPoint name="extS2ColHeader"></core:ExtensionPoint>\n                </columns>\n            </Table>\n        </content>\n    </Page>\n</core:View>',
	"hcm/emp/myleaverequests/view/S3.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
jQuery.sap.require("hcm.emp.myleaverequests.utils.Formatters");
jQuery.sap.require("hcm.emp.myleaverequests.utils.UIHelper");
jQuery.sap.require("sap.m.ObjectAttribute");

sap.ca.scfld.md.controller.ScfldMasterController.extend("hcm.emp.myleaverequests.view.S3", {

	extHookChangeFooterButtons: null,
	extHookLeaveRequestCollection : null,
	extHookItemTemplate : null,
	
	onInit : function() {
		sap.ca.scfld.md.controller.ScfldMasterController.prototype.onInit.call(this);

		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();

		hcm.emp.myleaverequests.utils.DataManager.init(this.oDataModel, this.resourceBundle);
		hcm.emp.myleaverequests.utils.Formatters.init(this.resourceBundle);
		
		this.oRouter.attachRouteMatched(this._handleRouteMatched, this);

		this.masterListCntrl = this.oView.byId("list");
		this.objLeaveRequestCollection = null;
		
		this.oBus = sap.ui.getCore().getEventBus();
		this.oBus.subscribe("hcm.emp.myleaverequests.LeaveCollection", "refresh", this._initData, this);
		this.onDataLoaded();
		this._fnRefreshCompleted = null;
		this._isLocalRouting = false;
		this._isInitialized = false;
		this._isMasterRefresh = false;
		this._searchField = "";
	},

	/**
     * @public [onDataLoaded On master list loaded]
     */
    onDataLoaded: function() {
    	var that = this;
        if (that.getList().getItems().length < 1) {
            if (!sap.ui.Device.system.phone) {
            	 that.showEmptyView();
            }
           
        }
    },


	getHeaderFooterOptions : function() {
		var _this = this;
		var objHdrFtr = {
			sI18NMasterTitle : "LR_TITLE_LEAVE_REQUESTS",
			onRefresh : function(searchField, fnRefreshCompleted){
				_this._fnRefreshCompleted = fnRefreshCompleted;
				_this._searchField = searchField;
				_this._isMasterRefresh = true;
				_this._initData();
			}
		};

		/**
         * @ControllerHook Modify the footer buttons
         * This hook method can be used to add and change buttons for the detail view footer
         * It is called when the decision options for the detail item are fetched successfully
         * @callback hcm.emp.myleaverequests.view.S3~extHookChangeFooterButtons
         * @param {object} Header Footer Object
         * @return {object} Header Footer Object
         */
    	
    	if (this.extHookChangeFooterButtons) {
    		objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
    	};
    	return objHdrFtr;
	},
	
	
	_handleRouteMatched : function(oEvent) {

		// to use cached data for local routing
		if (oEvent.getParameter("name") === "master" && ((this._isLocalRouting == false) || hcm.emp.myleaverequests.utils.UIHelper.getIsChangeAction())) {
			hcm.emp.myleaverequests.utils.UIHelper.setIsChangeAction(false);
			//clear searchField
			if(!!this._oControlStore & !!this._oControlStore.oMasterSearchField && !!this._oControlStore.oMasterSearchField.clear){
				this._oControlStore.oMasterSearchField.clear();
			}
			this._initData();
		}
		
		//reset flag
		if(oEvent.getParameter("name") === "master" && this._isLocalRouting === true){
			this._isLocalRouting = false;
		}
		
	},
		
	_initData : function(){		
		var _this = this;
		sap.ca.ui.utils.busydialog.requireBusyDialog();
		hcm.emp.myleaverequests.utils.DataManager.init(this.oDataModel, this.resourceBundle);
		  
		  // creation of a local JSON model is required because the leave request collection in the OData model contains
			// all leave requests including change requests. In the list view, only the original requests shall be shown.
			// Change requests to the original requests shall be only reflected by adding an additional info field like e.g.
			// 'Change Pending'
			// Solution: Function getConsolidatedLeaveRequests operates on all leave requests and creates a new collection
			// result only
			// containing the original requests which have a relation to the change request leave key
		if(!hcm.emp.myleaverequests.utils.UIHelper.getIsLeaveCollCached()){
			hcm.emp.myleaverequests.utils.DataManager.getConsolidatedLeaveRequests(function(objResponse) {
				
				_this.objLeaveRequestCollection = objResponse.LeaveRequestCollection;
				
				/**
		     * @ControllerHook Modify the LeaveRequestCollection response
		     * This hook method can be used to modify the LeaveRequestCollection
		     * It is called when the method LeaveRequestCollection in DataManager executes
		     * @callback hcm.emp.myleaverequests.view.S3~extHookLeaveRequestCollection
		     * @param {object} LeaveRequestCollection Object
		     * @return {object} LeaveRequestCollection Object
		     */
				if(_this.extHookLeaveRequestCollection) {
					_this.objLeaveRequestCollection = _this.extHookLeaveRequestCollection(_this.objLeaveRequestCollection);
				};
				
				hcm.emp.myleaverequests.utils.DataManager.setCachedModelObjProp("ConsolidatedLeaveRequests",_this.objLeaveRequestCollection);
				hcm.emp.myleaverequests.utils.UIHelper.setIsLeaveCollCached(false);
				_this.setMasterListItems();
				if(_this._searchField!="")
				{
				_this.applySearchPattern(_this._searchField);
				}
			}, function(objResponse) {

				hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse);
			});
		}
		else{
			_this.objLeaveRequestCollection=hcm.emp.myleaverequests.utils.DataManager.getCachedModelObjProp("ConsolidatedLeaveRequests");
			hcm.emp.myleaverequests.utils.UIHelper.setIsLeaveCollCached(false);
			_this.setMasterListItems();
		}
	},
	
	//@overriding since we are using LeaveKey/RequestId as contextPath
	getDetailNavigationParameters : function(oListItem) {
		var navProperty = "";
		if(!!oListItem){
		var parameters = oListItem.getBindingContext(this.sModelName).getPath().substr(1).split("/");
		if((parameters.length > 1) && (this.objLeaveRequestCollection.length > parameters[1])){
			navProperty = this.objLeaveRequestCollection[parameters[1]]._navProperty;
		}
		return {
			contextPath : encodeURIComponent(navProperty)
		};
		}
	},
	
	setMasterListItems : function(){
		var _this = this;
		try{
			if (_this.objLeaveRequestCollection) {
				hcm.emp.myleaverequests.utils.UIHelper.setRoutingProperty(_this.objLeaveRequestCollection);
				_this.objLeaveRequestCollection=hcm.emp.myleaverequests.utils.UIHelper.getRoutingProperty();				
				var oModel = new sap.ui.model.json.JSONModel({ "LeaveRequestCollection" : _this.objLeaveRequestCollection});
				_this.oView.setModel(oModel);
				//_this._isLocalRouting = true;
				
				var itemTemplate = new sap.m.ObjectListItem(
            {
              type : "{device>/listItemType}",
               title : "{AbsenceTypeName}",
                 number : "{parts:[{path:'WorkingDaysDuration'},{path:'WorkingHoursDuration'}], formatter:'hcm.emp.myleaverequests.utils.Formatters.DURATION'}",
                 numberUnit :"{parts:[{path:'WorkingDaysDuration'},{path:'WorkingHoursDuration'}], formatter:'hcm.emp.myleaverequests.utils.Formatters.DURATION_UNIT'}",
                 attributes : [
                                 new sap.m.ObjectAttribute(
                                               {			text : "{path:'StartDate', formatter:'hcm.emp.myleaverequests.utils.Formatters.DATE_ODATA_EEEdMMMyyyy'}"
                                               }),
                                 new sap.m.ObjectAttribute(
                                               {
                                                      text : "{parts:[{path:'i18n>LR_HYPHEN'},{path:'WorkingDaysDuration'},{path:'StartTime'},{path:'EndDate'},{path:'EndTime'}], formatter: 'hcm.emp.myleaverequests.utils.Formatters.FORMAT_ENDDATE'}"
                                               }) ],
                 firstStatus :  new sap.m.ObjectStatus({
                	 text : "{StatusName}",
              		 state : "{path:'StatusCode', formatter:'hcm.emp.myleaverequests.utils.Formatters.State'}"	 
                 }), 
                 secondStatus : new sap.m.ObjectStatus({
                		 state : "Error",
                		 text : "{path:'aRelatedRequests', formatter:'hcm.emp.myleaverequests.utils.Formatters.FORMATTER_INTRO'}"	 
                 }),
                 press : jQuery.proxy(_this._handleItemPress,_this)
        });
				
				
				/**
		     * @ControllerHook Modify the item template for list
		     * This hook method can be used to modify the itemTemplate
		     * It is called when the method setMasterListItems executes
		     * @callback hcm.emp.myleaverequests.view.S3~extHookItemTemplate
		     * @param {object} itemTemplate Object
		     * @return {object} itemTemplate Object
		     */
				if(this.extHookItemTemplate) {
					itemTemplate = this.extHookItemTemplate(itemTemplate);
				};
							
				
				_this.masterListCntrl.bindItems({
					path : "/LeaveRequestCollection",
					template : itemTemplate
				});
				if(_this._fnRefreshCompleted)
				{
					_this._fnRefreshCompleted();
				}
				//sap.ca.ui.utils.busydialog.releaseBusyDialog();
			 }	
			}
			
			catch(err)
			{
				jQuery.sap.log.warning(err);

			}
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
			if(!jQuery.device.is.phone && !_this._isInitialized){
				_this.registerMasterListBind(_this.masterListCntrl);						
				_this._isInitialized = true;
			}
			if(!jQuery.device.is.phone){
				_this.setLeadSelection();
			}
			
	},
	

	// event handler for setting the lead selection in the history overview list. Initially the first entry is
	// preselected.
	// also called when in history details a leave was withdrawn
	setLeadSelection : function() {
		var oItems = this.masterListCntrl.getItems();
		var oIndex = null, searchKey = null;
		var completeURL =  window.location.hash.split('detail');
		if(completeURL[1]!== undefined){
			completeURL= completeURL[1].split('/');
		}
		if(completeURL[1]!== undefined){
			searchKey = decodeURIComponent(completeURL[1]);
			searchKey = decodeURIComponent (searchKey);
		}
		if((searchKey !== null && searchKey !== "")&& (this.objLeaveRequestCollection)){
			for ( var i = 0; i < this.objLeaveRequestCollection.length; i++) {
				if (this.objLeaveRequestCollection[i]._navProperty === searchKey) {
					oIndex = i;
					break;
				}
			}
			if(oIndex === null){
				if(hcm.emp.myleaverequests.utils.UIHelper.getIsWithDrawn(searchKey) && (oItems.length > 0)){
					this.setListItem(oItems[0]);
			}else{
					this.showEmptyView();
				}
	
			}else{
				if(oItems.length > oIndex){
				   this.setListItem(oItems[oIndex]);
				}
			}

		}else {
			oIndex = 0;
			if(oItems.length > 0){
				this.setListItem(oItems[oIndex]);
			}
		}		
	},
	
	
  setListItem : function(oItem) {
	  if(this._isMasterRefresh){
		  this._isMasterRefresh = false;
		  this.setLeadSelection();
	  }else{
		  if (oItem !== undefined) {
			  oItem.setSelected(true);
			  this.oRouter.navTo("detail",this.getDetailNavigationParameters(oItem),!jQuery.device.is.phone);
		  } 
		  this._isLocalRouting = true;    
	  }
  },
	

});
},
	"hcm/emp/myleaverequests/view/S3.view.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<sap.ui.core:View id="S3" controllerName="hcm.emp.myleaverequests.view.S3"\r\n    xmlns="sap.m"\r\n    xmlns:sap.ui.core="sap.ui.core" >\r\n    <Page>\r\n        <content>\r\n            <List id="list" mode="{device>/listMode}" select="_handleSelect">\r\n                 \r\n            </List>\r\n        </content>\r\n \r\n    </Page>\r\n</sap.ui.core:View>',
	"hcm/emp/myleaverequests/view/S6B.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("hcm.emp.myleaverequests.utils.Formatters");
jQuery.sap.require("hcm.emp.myleaverequests.utils.UIHelper");
jQuery.sap.require("hcm.emp.myleaverequests.utils.DataManager");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ca.ui.dialog.factory");

sap.ca.scfld.md.controller.BaseDetailController
		.extend(
				"hcm.emp.myleaverequests.view.S6B",
				{

					extHookChangeFooterButtons: null,
					extHookWithdrawDialogContent : null,
					extHookDetailView : null,
					
					onInit : function() {

						sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);

						this.resourceBundle = this.oApplicationFacade.getResourceBundle();
						this.oDataModel = this.oApplicationFacade.getODataModel();

						hcm.emp.myleaverequests.utils.DataManager.init(this.oDataModel, this.resourceBundle);
						hcm.emp.myleaverequests.utils.Formatters.init(this.resourceBundle);

						this._buildHeaderFooter();
						
						this.oRouter.attachRouteMatched(this._handleRouteMatched, this);
					},

					_handleRouteMatched : function(oEvent) {

						if (oEvent.getParameter("name") === "detail") {
							
							hcm.emp.myleaverequests.utils.DataManager.init(this.oDataModel, this.resourceBundle);
							
							//TODO: 
							oEvent.getParameter("arguments").contextPath = decodeURIComponent(oEvent.getParameter("arguments").contextPath);
							
							var _this = this;
						
							var contextPath = decodeURIComponent(oEvent.getParameter("arguments").contextPath);
							var indexVal = null;
							var  consolidatedLeaveRequestcollection=null;
							var setDetails = function (){
								hcm.emp.myleaverequests.utils.UIHelper.setRoutingProperty(consolidatedLeaveRequestcollection);
								consolidatedLeaveRequestcollection=hcm.emp.myleaverequests.utils.UIHelper.getRoutingProperty();				
								
								if (consolidatedLeaveRequestcollection !== null) {
									for ( var i = 0; i < consolidatedLeaveRequestcollection.length; i++) {
											if (consolidatedLeaveRequestcollection[i]._navProperty === contextPath) {
												indexVal = i;
												break;
											}
										}
								}
								var curntLeaveRequest = consolidatedLeaveRequestcollection[indexVal];									
																
								if(curntLeaveRequest){
								_this.currntObj = curntLeaveRequest;
																
								var cntrlObjectHeader = _this.byId("LRS6B_HEADER");
								var cntrlNotesTab = _this.byId("LRS6B_ICNTABBAR");
								
								var lblOrigDate = _this.byId("LRS6B_LBL_ORIGINAL_DATE");
								var hdrStartDate = _this.byId("LRS6B_HEADER_START_DATE");
								var hdrEndDate = _this.byId("LRS6B_HEADER_END_DATE");
								var lblChngedDate = _this.byId("LRS6B_LBL_CHANGED_DATE");
								var hdrNewStartDate = _this.byId("LRS6B_NEW_HEADER_START_DATE");
								var hdrNewEndDate = _this.byId("LRS6B_NEW_HEADER_END_DATE");
								var hdrStatus = _this.byId("LRS6B_HEADER_STATUS");
								var hdrStatus2 = _this.byId("LRS6B_HEADER_STATUS2");
								
								var cntrlNotesText = _this.byId("LRS6B_NOTESTEXT");
								
								if (_this.currntObj.Notes === "") {
									cntrlNotesTab.setVisible(false);
								} else {
									cntrlNotesTab.setVisible(true);
								}
								
								cntrlObjectHeader.setTitle(curntLeaveRequest.AbsenceTypeName);
								cntrlObjectHeader.setNumber(hcm.emp.myleaverequests.utils.Formatters.DURATION(curntLeaveRequest.WorkingDaysDuration,curntLeaveRequest.WorkingHoursDuration));
								cntrlObjectHeader.setNumberUnit(hcm.emp.myleaverequests.utils.Formatters.DURATION_UNIT(curntLeaveRequest.WorkingDaysDuration,curntLeaveRequest.WorkingHoursDuration));
								
								lblOrigDate.setVisible(hcm.emp.myleaverequests.utils.Formatters.SET_RELATED_VISIBILITY(curntLeaveRequest.aRelatedRequests));
								hdrStartDate.setText(hcm.emp.myleaverequests.utils.Formatters.DATE_ODATA_EEEdMMMyyyyLong(curntLeaveRequest.StartDate));
								hdrEndDate.setText(hcm.emp.myleaverequests.utils.Formatters.FORMAT_ENDDATE_LONG(_this.resourceBundle.getText("LR_HYPHEN"),
										curntLeaveRequest.WorkingDaysDuration,curntLeaveRequest.StartTime,curntLeaveRequest.EndDate,curntLeaveRequest.EndTime));
								lblChngedDate.setVisible(hcm.emp.myleaverequests.utils.Formatters.SET_RELATED_VISIBILITY(curntLeaveRequest.aRelatedRequests));
								hdrNewStartDate.setVisible(hcm.emp.myleaverequests.utils.Formatters.SET_RELATED_START_DATE_VISIBILITY(curntLeaveRequest.aRelatedRequests));
								hdrNewStartDate.setText(hcm.emp.myleaverequests.utils.Formatters.FORMAT_RELATED_START_DATE_LONG(curntLeaveRequest.aRelatedRequests));
								hdrNewEndDate.setVisible(hcm.emp.myleaverequests.utils.Formatters.SET_RELATED_END_DATE_VISIBILITY(curntLeaveRequest.aRelatedRequests));
								hdrNewEndDate.setText(hcm.emp.myleaverequests.utils.Formatters.FORMAT_RELATED_END_DATE_LONG(_this.resourceBundle.getText("LR_HYPHEN"), curntLeaveRequest.aRelatedRequests));
								hdrStatus.setText(curntLeaveRequest.StatusName);
								hdrStatus.setState(hcm.emp.myleaverequests.utils.Formatters.State(curntLeaveRequest.StatusCode));
								hdrStatus2.setText(hcm.emp.myleaverequests.utils.Formatters.FORMATTER_INTRO(curntLeaveRequest.aRelatedRequests));
								hdrStatus2.setState("Error");
								cntrlNotesText.setText(curntLeaveRequest.Notes);

								_this._initState();
								}
							};
							consolidatedLeaveRequestcollection = hcm.emp.myleaverequests.utils.DataManager.getCachedModelObjProp("ConsolidatedLeaveRequests");
							if(consolidatedLeaveRequestcollection === undefined){
								hcm.emp.myleaverequests.utils.DataManager.getConsolidatedLeaveRequests(function(objResponse) {
									
									consolidatedLeaveRequestcollection = objResponse.LeaveRequestCollection;
									hcm.emp.myleaverequests.utils.DataManager.setCachedModelObjProp("ConsolidatedLeaveRequests",consolidatedLeaveRequestcollection);
									setDetails();
									hcm.emp.myleaverequests.utils.UIHelper.setIsLeaveCollCached(true);
								}, function(objResponse) {
									hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse);
								});
							}
							else{
								setDetails();
							}
							
							  /**
						    * @ControllerHook Modify the loaded view
						    * This hook method can be used to add or change UI and business logic
						    * It is called when the route match to detail
						    * @callback hcm.emp.myleaverequests.view.S6B~extHookDetailView
						    */
							if(this.extHookDetailView) {
									this.extHookDetailView();
						    }
						
								//sap.ca.ui.utils.busydialog.releaseBusyDialog();
						}
						
					},

					/*	
			     * override BaseMasterController method in order to decode the JSONModel based contextPath
			     * Crossroads.js does not allow slashes in the navigation hash, JSON contextPath contains
			     */
			    /*resolveHash : function(oEvent){
			      return URI.decode(oEvent.getParameter("arguments").contextPath);
			    },*/
					
					_buildHeaderFooter : function(){
						
						var _this = this;						
						//workaround for scaffolding API
						var objOptionsHeaderFooter = {
								sI18NDetailTitle : "LR_TITLE_LEAVE_REQUEST",
								buttonList : [{
									sId : "LRS6B_BTN_CHANGE",
									sI18nBtnTxt : "LR_CHANGE",
									onBtnPressed : function(evt) {
										_this.onChange(evt);
									}
								}, {
									sId : "LRS6B_BTN_WITDHDRAW",
									sI18nBtnTxt : "LR_WITHDRAW",
									onBtnPressed : function(evt) {
										_this.onWithdraw(evt);
									}
								}],
		            oAddBookmarkSettings: {
		                title: _this.resourceBundle.getText("LR_TITLE_DETAILS_VIEW"),
		                icon: "sap-icon://Fiori2/F0394"
		            }
						};
						
						/**
				    * @ControllerHook Modify the footer buttons
				    * This hook method can be used to add and change buttons for the detail view footer
				    * It is called when the decision options for the detail item are fetched successfully
				    * @callback hcm.emp.myleaverequests.view.S6B~extHookChangeFooterButtons
				    * @param {object} Header Footer Object
				    * @return {object} Header Footer Object
				    */
						if(this.extHookChangeFooterButtons) {
							objOptionsHeaderFooter = this.extHookChangeFooterButtons(objOptionsHeaderFooter);
				    }
						
						this.setHeaderFooterOptions(objOptionsHeaderFooter);
					},
					
					_isChangeRequest : function(aRelatedRequests) {
						return aRelatedRequests != undefined && aRelatedRequests.length > 0
								&& aRelatedRequests[0].LeaveRequestType == "2";
					},

					_hasNewEndDate : function(aRelatedRequests) {
						return this._isChangeRequest(aRelatedRequests) && this._hasEndDate(aRelatedRequests[0].WorkingDaysDuration);
					},

					_hasEndDate : function(sWorkingDaysDuration) {
						return sWorkingDaysDuration != undefined
								&& (hcm.emp.myleaverequests.utils.Formatters.isHalfDayLeave(sWorkingDaysDuration) || sWorkingDaysDuration * 1 != 1);
					},

					_initState : function() {

						var btnChngeAttr = false;

						if (!this.currntObj.RelatedRequests || this.currntObj.RelatedRequests.length < 1) {
							btnChngeAttr = this.currntObj.ActionModifyInd;
						} else if (this.currntObj.RelatedRequests) {
							if (this.currntObj.RelatedRequests[0].LeaveRequestType == "2") {
								btnChngeAttr = this.currntObj.RelatedRequests[0].ActionModifyInd;
							}
						}

						this.setBtnEnabled("LRS6B_BTN_CHANGE", btnChngeAttr);

						var btnWtDrwAttr = false;

						if (!this.currntObj.RelatedRequests || this.currntObj.RelatedRequests.length < 1) {
							btnWtDrwAttr = this.currntObj.ActionDeleteInd || this.currntObj.StatusCode == "CREATED";
						}

						this.setBtnEnabled("LRS6B_BTN_WITDHDRAW", btnWtDrwAttr);

					},

					// event handler for change button
					onChange : function() {

						var reqId = this.currntObj.RequestID;
						
						hcm.emp.myleaverequests.utils.UIHelper.setIsChangeAction(true);

						if(reqId===""){
							reqId = this.currntObj.LeaveKey;
						}
						
						if (reqId !== "") {
							this.oRouter.navTo("change", {
								requestID : reqId
							});
						}else{
							/*hcm.emp.myleaverequests.utils.UIHelper.errorDialog([this.resourceBundle.getText("LR_DD_GENERIC_ERR"), 
							                                                    "hcm.emp.myleaverequests.view.S6B",
							                                                    "_handleRouteMatched",
							                                                    "curntLeaveRequest is null"]);*/
							jQuery.sap.log.warning("curntLeaveRequest is null","_handleRouteMatched","hcm.emp.myleaverequests.view.S6B");
						}

					},

					// event handler for withdraw button
					onWithdraw : function() {

						var _this = this;

						this.oHeader = this.byId("LRS6B_HEADER");

						var _from;
						var _to;
						var _fromTime = this.currntObj.StartTime;
						var _toTime = this.currntObj.EndTime;
						var _startDate = this.currntObj.StartDate;
						var _endDate = this.currntObj.EndDate;
						var _absenceType = this.currntObj.AbsenceTypeName;

						if (_fromTime === "PT00H00M00S" && _toTime === "PT00H00M00S") {
							_from = hcm.emp.myleaverequests.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(_startDate);
							_to = hcm.emp.myleaverequests.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(_endDate);
						} else {
							_from = hcm.emp.myleaverequests.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(_startDate, "medium");
							_to = hcm.emp.myleaverequests.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(_endDate, "medium");
							_from += " " + hcm.emp.myleaverequests.utils.Formatters.TIME_hhmm(_fromTime);
							_to += " " + hcm.emp.myleaverequests.utils.Formatters.TIME_hhmm(_toTime);
						}

						var sNumberAndUnit = null;
						if(this.oHeader){
							sNumberAndUnit = this.oHeader.getNumber() + "  " + this.oHeader.getNumberUnit();
						}else{
							sNumberAndUnit = "-";
						}

						var oSettings = {
							question : this.resourceBundle.getText("LR_WITHDRAWNMSG"),
							additionalInformation : [{
								label : this.resourceBundle.getText("LR_BALANCE_DEDUCTIBLE"),
								text : _absenceType
							}, {
								label : this.resourceBundle.getText("LR_FROM"),
								text : _from
							}, {
								label : this.resourceBundle.getText("LR_TO"),
								text : _to
							}, {
								label : this.resourceBundle.getText("LR_REQUEST"),
								text : sNumberAndUnit
							}],
							showNote : false,
							title : this.resourceBundle.getText("LR_TITLE_WITHDRAW"),
							confirmButtonLabel : this.resourceBundle.getText("LR_OK")
						};

						
							/**
					    * @ControllerHook Modify the content of withdraw dialog
					    * This hook method can be used to add and change content of withdraw dialog
					    * It is called when the onWithdraw method gets executed
					    * @callback hcm.emp.myleaverequests.view.S6B~extHookWithdrawDialogContent
					    * @param {object} oSettings Object
					    * @return {object} oSettings Object
					    */
							if(this.extHookWithdrawDialogContent) {
								oSettings = this.extHookWithdrawDialogContent(oSettings);
					    }
					
						
						sap.ca.ui.dialog.factory.confirm(oSettings, function(response) {
							if (response.isConfirmed == true) {
								_this.withdraw();
							}
						});

					},

					// withdraw leave request
					withdraw : function() {
						var _this = this;

						//sap.ca.ui.utils.busydialog.requireBusyDialog();
						
						var sStatusCode = this.currntObj.StatusCode;
						var sEmployeeID = this.currntObj.EmployeeID;
						var sRequestId = this.currntObj.RequestID;
						var sChangeStateID = this.currntObj.ChangeStateID;
						var sLeaveKey = this.currntObj.LeaveKey;

						hcm.emp.myleaverequests.utils.DataManager.withdrawLeaveRequest(sStatusCode, sEmployeeID, sRequestId,
								sChangeStateID, sLeaveKey, function(response) {
							   // sap.ca.ui.utils.busydialog.releaseBusyDialog();
									
									sap.ui.getCore().getEventBus().publish("hcm.emp.myleaverequests.LeaveCollection", "refresh");
									hcm.emp.myleaverequests.utils.UIHelper.setIsWithDrawn(_this.currntObj._navProperty);
									sap.m.MessageToast.show(_this.resourceBundle.getText("LR_WITHDRAWDONE"));
								}, function(errorMsgs) {
									//sap.ca.ui.utils.busydialog.releaseBusyDialog();
									hcm.emp.myleaverequests.utils.UIHelper.errorDialog(errorMsgs);
								}, this);

					},

				});
},
	"hcm/emp/myleaverequests/view/S6B.view.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<sap.ui.core:View id="S6B" controllerName="hcm.emp.myleaverequests.view.S6B"\r\n    xmlns="sap.m"\r\n    xmlns:sap.ui.layout.form="sap.ui.layout.form"\r\n    xmlns:sap.ui.layout="sap.ui.layout"\r\n    xmlns:sap.ui.core="sap.ui.core" >\r\n    <Page class="sapUiFioriObjectPage">\r\n        <content>\r\n            <ObjectHeader id="LRS6B_HEADER" introActive="true" titleActive="false" iconActive="false">\r\n                <attributes>\r\n                    <ObjectAttribute id="LRS6B_LBL_ORIGINAL_DATE" text="{i18n>LR_OLD_VERSION}" active="false"></ObjectAttribute>\r\n                    <ObjectAttribute id="LRS6B_HEADER_START_DATE" active="false"></ObjectAttribute>\r\n                    <ObjectAttribute id="LRS6B_HEADER_END_DATE" active="false"></ObjectAttribute>\r\n                    <ObjectAttribute id="LRS6B_LBL_CHANGED_DATE" text="{i18n>LR_NEW_VERSION}" active="false"></ObjectAttribute>\r\n                    <ObjectAttribute id="LRS6B_NEW_HEADER_START_DATE" active="false"></ObjectAttribute>\r\n                   <ObjectAttribute id="LRS6B_NEW_HEADER_END_DATE" active="false"></ObjectAttribute>\r\n                </attributes>\r\n                <firstStatus>\r\n                    <ObjectStatus id="LRS6B_HEADER_STATUS"></ObjectStatus>\r\n                </firstStatus>\r\n                <secondStatus>\r\n                    <ObjectStatus id="LRS6B_HEADER_STATUS2"></ObjectStatus>\r\n                </secondStatus>\r\n                <!-- extension point for additional Header Field-->\r\n                <sap.ui.core:ExtensionPoint name="extS6BHeaderField"></sap.ui.core:ExtensionPoint>\r\n            </ObjectHeader>\r\n            <IconTabBar id="LRS6B_ICNTABBAR" visible="false">\r\n                <items>\r\n                    <IconTabFilter id="LRS6B_NOTESICNTAB" icon="sap-icon://notes">\r\n                        <content>\r\n                            <Text id="LRS6B_NOTESTEXT"/>\r\n                        </content>\r\n                    </IconTabFilter>                    \r\n                    <!-- extension point for additional Icon Tab Filter-->\r\n                    <sap.ui.core:ExtensionPoint name="extS6BIconTab"></sap.ui.core:ExtensionPoint>\r\n                </items>\r\n            </IconTabBar>            \r\n        </content>\r\n    </Page>\r\n</sap.ui.core:View>'
}});
