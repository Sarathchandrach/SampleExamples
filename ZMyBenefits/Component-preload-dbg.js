jQuery.sap.registerPreloadedModules({
"name":"hcm/emp/mybenefits/Component-preload",
"version":"2.0",
"modules":{
	"hcm/emp/mybenefits/Component.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// define a root UIComponent which exposes the main view
jQuery.sap.declare("hcm.emp.mybenefits.Component");
jQuery.sap.require("hcm.emp.mybenefits.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase"); // new Component

sap.ca.scfld.md.ComponentBase.extend("hcm.emp.mybenefits.Component", {
	metadata: sap.ca.scfld.md.ComponentBase.createMetaData("MD", {
		"name": "Master Detail Sample",
		"version": "1.4.3",
		"library": "hcm.emp.mybenefits",
		"includes": [],
		"dependencies": {
			"libs": ["sap.m", "sap.me"],
			"components": []
		},
		"config": {
			"resourceBundle": "i18n/i18n.properties",
			"titleResource": "MB_APP_TITLE",
			"icon": "sap-icon://family-care", //Fiori2/F0396
			"favIcon": "./resources/sap/ca/ui/themes/base/img/favicon/My_Benefits.ico",
			"homeScreenIconPhone": "./resources/sap/ca/ui/themes/base/img/launchicon/My_Benefits/57_iPhone_Desktop_Launch.png",
			"homeScreenIconPhone@2": "./resources/sap/ca/ui/themes/base/img/launchicon/My_Benefits/114_iPhone-Retina_Web_Clip.png",
			"homeScreenIconTablet": "./resources/sap/ca/ui/themes/base/img/launchicon/My_Benefits/72_iPad_Desktop_Launch.png",
			"homeScreenIconTablet@2": "./resources/sap/ca/ui/themes/base/img/launchicon/My_Benefits/144_iPad_Retina_Web_Clip.png"
		},

		// Navigation related properties
		masterPageRoutes: {
			"master": {
				"pattern": "",
				"view": "hcm.emp.mybenefits.view.S2"
			}
		},
		detailPageRoutes: {
			"Health": {
				"pattern": "Health/{contextPath}",
				"view": "hcm.emp.mybenefits.view.S3"
			},
			"Insurance": {
				"pattern": "Insurance/{contextPath}",
				"view": "hcm.emp.mybenefits.view.S4"
			},
			"Savings": {
				"pattern": "Savings/{contextPath}",
				"view": "hcm.emp.mybenefits.view.S5"
			},
			"FSA": {
				"pattern": "FSA/{contextPath}",
				"view": "hcm.emp.mybenefits.view.S6"
			},
			"Miscellaneous": {
				"pattern": "Miscellaneous/{contextPath}",
				"view": "hcm.emp.mybenefits.view.S7"
			},
			"Unenrolled": {
				"pattern": "Unenrolled/{contextPath}",
				"view": "hcm.emp.mybenefits.view.S8"
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
			viewName: "hcm.emp.mybenefits.Main",
			type: sap.ui.core.mvc.ViewType.XML,
			viewData: oViewData
		});
	}
});

},
	"hcm/emp/mybenefits/Configuration.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.mybenefits.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ca.scfld.md.ConfigurationBase.extend("hcm.emp.mybenefits.Configuration", {

    oServiceParams: {
        serviceList: [{
            name: "SRA007_BENEFITS_SRV",
            masterCollection: "Benefits",
            serviceUrl: "/sap/opu/odata/sap/SRA007_BENEFITS_SRV/",
            isDefault: true,
            mockedDataSource: "/hcm.emp.mybenefits/model/metadata.xml"
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
	"hcm/emp/mybenefits/Main.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("hcm.emp.mybenefits.Main", {

	onInit: function() {
		jQuery.sap.require("sap.ca.scfld.md.Startup");
		sap.ca.scfld.md.Startup.init("hcm.emp.mybenefits", this);
		jQuery.sap.require("hcm.emp.mybenefits.util.DataManager");
	}
});
},
	"hcm/emp/mybenefits/Main.view.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<core:View\r\n\txmlns:core="sap.ui.core"\r\n\txmlns="sap.m"\r\n\tcontrollerName="hcm.emp.mybenefits.Main"\r\n\tdisplayBlock="true"\r\n\theight="100%">\r\n\t<NavContainer\r\n\t\tid="fioriContent"\r\n\t\tshowHeader="false">\r\n\t</NavContainer>\r\n</core:View>',
	"hcm/emp/mybenefits/i18n/i18n.properties":'# MyBenefits Property file\n# __ldi.translation.uuid=14671840-31B1-11E3-AA6E-0800200C9A66\n\n#XTIT: Application name\nMB_APP_TITLE=My Benefits\n\n# XFLD: Number of pending benefit plans\nPENDING_COUNT={0} Pending\n\n#XTIT,20: Title for benefits list\nMB_MASTER_TITLE=Benefits ({0})\n\n#XTIT,30: Title for benefit details\nMB_APP_DETAIL_TITLE=Benefit\n\n#XTIT,8: Selection date for displaying the benefit plans that the user is enrolled in \nMB_FOOTER_DATE_TEXT=As of\n\n#XTIT,20: Selection for fetching unenrolled data \nMB_SHOW_DETAILS=Show Details...\n\n# XFLD,20: Default Placeholder for the search field in Home View\nMB_SEARCH_PLACEHOLDER=Search...\n\n#XBUT: Display the confirmation statement for the selection date in another window\nMB_CONFIRMATION=View Summary\n\n#XBUT,8: Button to open menu  \nMB_OPEN=Open\n\n#XLST,35: List header to categorize all health-related benefits\nMB_LIST_HEADER_HEALTH=Health\n\n#XLST,35: List header to categorize all life insurance-related benefits\nMB_LIST_HEADER_INSURANCE=Life Insurance\n\n#XLST,35: List header to categorize all savings-related benefits\nMB_LIST_HEADER_SAVINGS=Savings\n\n#XLST,35: List header to categorize all FSA-related benefits\nMB_LIST_HEADER_FSA=Flexible Spending Accounts\n\n#XLST,35: List header to categorize all stock-related benefits\nMB_LIST_HEADER_STOCK=Stock\n\n#XLST,35: List header to categorize all miscellaneous benefits\nMB_LIST_HEADER_MISC=Miscellaneous\n\n#XLST,35: List header to categorize all benefits that the user is eligible for, but not enrolled in\nMB_LIST_HEADER_UNENROLLED = Not Enrolled\n\n#XLST,35: List header to categorize all pending benefits\nMB_LIST_HEADER_PENDING=Pending\n\n#XTIT,20: Title in details view to show information on the benefit plan\nMB_INFORMATION=Information\n\n#XTIT,20: Title in details view to show links to benefit plan documents\nMB_DOCUMENTS=Documents\n\n#XTIT,20: List of dependents who are covered under the benefit plan  \nMB_DEPENDENTS=Dependents\n\n#XTIT,20: List of individuals, organizations, or trust funds that will be eligible to receive benefits of an insurance or retirement plan\nMB_BENEFICIARIES=Beneficiaries\n\n#XTIT,20: List of investments done under the benefit plan  \nMB_INVESTMENTS=Investments\n\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan\nMB_PRIMARY=Primary\n\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan if the primary beneficiaries are deceased\nMB_CONTINGENT=Contingent\n\n#XFLD: No data available\nMB_NO_DATA=No data available\n\n#XFLD: No benefits data available\nMB_NO_BENEFITS=No benefits\n\n#XFLD: No unenrolled plans\nMB_NO_UNENROLLED_PLAN=No Unenrolled Plans\n\n#XFLD: Plan name\nMB_PLAN=Plan\n\n#XFLD: Type of plan\nMB_PLAN_TYPE=Plan Type\n\n#XFLD: Status of plan\nMB_STATUS=Status\n\n#XFLD,35: submit evidence of insurance before specified date \nMB_LABEL_EVIDENCE_INSURABILITY=Submit Evidence of Insurability Before\n\n#XFLD,35: Number assigned to plan\nMB_PLAN_NUMBER=Plan Number\n\n#XFLD,35: Number assigned to plan\nMB_GROUP_NUMBER=Group Number\n\n#XFLD,35: payroll frequency\nMB_PAYROLL_FREQUENCY=Payroll Frequency\n\n#XFLD,35: Cost type\nMB_EMP_PRE_TAX_COST=Employee Pre-Tax Cost\n\n#XFLD,35: Employee bonus pre tax cost type\nMB_EMP_BONUS_PRE_TAX_COST=Employee Bonus Pre-Tax Cost\n\n#XFLD,35: Cost type\nMB_EMP_POST_TAX_COST=Employee Post-Tax Cost\n\n#XFLD,35: Employee bonus post tax cost type\nMB_EMP_BONUS_POST_TAX_COST=Employee Bonus Post-Tax Cost\n\n#XFLD,35: Cost type\nMB_EMP_ADDITIONAL_POST_TAX_COST=Employee Additional Post-Tax Cost\n\n#XFLD,35: Imputed Income\nMB_Imputed_Income=Imputed Income\n\n#XFLD,35: Employer cost type or reimbursement type\nMB_CREDITS=Credits\n\n#XFLD,35: Employer cost type\nMB_EMPLOYER_COSTS=Employer Cost\n\n#XFLD: Option for plan\nMB_PLAN_OPTION=Plan Option\n\n#XFLD: Plan year\nMB_PLAN_YEAR=Plan Year\n\n#XFLD,30: Contribution per payroll period\nMB_CONTRIBUTION_PER_PAY_PERIOD=Contribution\n\n#XFLD,35: Cost type\nMB_REGULAR_PRE_TAX_CONTRIBUTION=Regular Pre-Tax Contribution\n\n#XFLD,35: Cost type\nMB_REGULAR_POST_TAX_CONTRIBUTION=Regular Post-Tax Contribution\n\n#XFLD,35: Cost type\nMB_BONUS_PRE_TAX_CONTRIBUTION=Bonus Pre-Tax Contribution\n\n#XFLD,35: Cost type\nMB_BONUS_POST_TAX_CONTRIBUTION=Bonus Post-Tax Contribution\n\n#XFLD,35: Cost type\nMB_CALCULATED_CREDIT=Calculated Credits\n\n#XFLD: Period in which the user is enrolled in the benefit plan\nMB_PARTICIPATION_PERIOD=Participation Period\n\n#XFLD,65: Roll over pre-tax to post-tax when pre-tax limit is reached\nMB_MESSAGE_PRE_TAX_TO_POST_TAX=Roll over to post-tax when pre-tax limit is reached\n\n#XFLD,65: Post-tax contributions start immediately\nMB_START_POST_TAX_CONTRIBUTIONS=Start post-tax contributions immediately\n\n#YMSG: Message for list service error\nLIST_SERVICE_ERR_MESSAGE=Could not obtain the list of benefits\n\n#YMSG: Message for detail service error\nDETAIL_SERVICE_ERR_MESSAGE=Could not obtain the benefit detail\n\n#YMSG: Message for count service error\nCOUNT_SERVICE_ERR_MESSAGE=Could not obtain benefits count summary\n\n#YMSG: Title for service error\nSERVICE_ERR_TITLE=My Benefits\n',
	"hcm/emp/mybenefits/i18n/i18n_ar.properties":'\r\n#XTIT: Application name\r\nMB_APP_TITLE=\\u0627\\u0644\\u0645\\u0632\\u0627\\u064A\\u0627\r\n\r\n# XFLD: Number of pending benefit plans\r\nPENDING_COUNT={0} \\u0645\\u0639\\u0644\\u0642\r\n\r\n#XTIT,20: Title for benefits list\r\nMB_MASTER_TITLE=\\u0627\\u0644\\u0645\\u0632\\u0627\\u064A\\u0627 ({0})\r\n\r\n#XTIT,30: Title for benefit details\r\nMB_APP_DETAIL_TITLE=\\u0627\\u0644\\u0645\\u064A\\u0632\\u0629\r\n\r\n#XTIT,8: Selection date for displaying the benefit plans that the user is enrolled in \r\nMB_FOOTER_DATE_TEXT=\\u0628\\u062F\\u0621\\u064B\\u0627 \\u0645\\u0646\r\n\r\n#XTIT,20: Selection for fetching unenrolled data \r\nMB_SHOW_DETAILS=\\u0639\\u0631\\u0636 \\u0627\\u0644\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644\r\n\r\n# XFLD,20: Default Placeholder for the search field in Home View\r\nMB_SEARCH_PLACEHOLDER=\\u062C\\u0627\\u0631\\u064D \\u0627\\u0644\\u0628\\u062D\\u062B...\r\n\r\n#XBUT: Display the confirmation statement for the selection date in another window\r\nMB_CONFIRMATION=\\u0639\\u0631\\u0636 \\u0627\\u0644\\u0645\\u0644\\u062E\\u0635\r\n\r\n#XBUT,8: Button to open menu  \r\nMB_OPEN=\\u0641\\u062A\\u062D\r\n\r\n#XLST,35: List header to categorize all health-related benefits\r\nMB_LIST_HEADER_HEALTH=\\u0627\\u0644\\u0635\\u062D\\u0629\r\n\r\n#XLST,35: List header to categorize all life insurance-related benefits\r\nMB_LIST_HEADER_INSURANCE=\\u0627\\u0644\\u062A\\u0623\\u0645\\u064A\\u0646 \\u0639\\u0644\\u0649 \\u0627\\u0644\\u062D\\u064A\\u0627\\u0629\r\n\r\n#XLST,35: List header to categorize all savings-related benefits\r\nMB_LIST_HEADER_SAVINGS=\\u0627\\u0644\\u062A\\u0648\\u0641\\u064A\\u0631\r\n\r\n#XLST,35: List header to categorize all FSA-related benefits\r\nMB_LIST_HEADER_FSA=\\u062D\\u0633\\u0627\\u0628\\u0627\\u062A \\u0627\\u0644\\u0625\\u0646\\u0641\\u0627\\u0642 \\u0627\\u0644\\u0645\\u0631\\u0646\\u0629\r\n\r\n#XLST,35: List header to categorize all stock-related benefits\r\nMB_LIST_HEADER_STOCK=\\u0623\\u0633\\u0647\\u0645\r\n\r\n#XLST,35: List header to categorize all miscellaneous benefits\r\nMB_LIST_HEADER_MISC=\\u0645\\u062A\\u0646\\u0648\\u0639\\u0629\r\n\r\n#XLST,35: List header to categorize all benefits that the user is eligible for, but not enrolled in\r\nMB_LIST_HEADER_UNENROLLED=\\u063A\\u064A\\u0631 \\u0645\\u0633\\u062C\\u0644\\u0629\r\n\r\n#XLST,35: List header to categorize all pending benefits\r\nMB_LIST_HEADER_PENDING=\\u0645\\u0639\\u0644\\u0642\\u0629\r\n\r\n#XTIT,20: Title in details view to show information on the benefit plan\r\nMB_INFORMATION=\\u0645\\u0639\\u0644\\u0648\\u0645\\u0627\\u062A\r\n\r\n#XTIT,20: Title in details view to show links to benefit plan documents\r\nMB_DOCUMENTS=\\u0645\\u0633\\u062A\\u0646\\u062F\\u0627\\u062A\r\n\r\n#XTIT,20: List of dependents who are covered under the benefit plan  \r\nMB_DEPENDENTS=\\u0627\\u0644\\u0645\\u0639\\u0627\\u0644\\u0648\\u0646\r\n\r\n#XTIT,20: List of individuals, organizations, or trust funds that will be eligible to receive benefits of an insurance or retirement plan\r\nMB_BENEFICIARIES=\\u0627\\u0644\\u0645\\u0633\\u062A\\u0641\\u064A\\u062F\\u0648\\u0646\r\n\r\n#XTIT,20: List of investments done under the benefit plan  \r\nMB_INVESTMENTS=\\u0627\\u0644\\u0627\\u0633\\u062A\\u062B\\u0645\\u0627\\u0631\\u0627\\u062A\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan\r\nMB_PRIMARY=\\u0623\\u0633\\u0627\\u0633\\u064A\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan if the primary beneficiaries are deceased\r\nMB_CONTINGENT=\\u0645\\u0624\\u0642\\u062A\r\n\r\n#XFLD: No data available\r\nMB_NO_DATA=\\u0644\\u0627 \\u062A\\u062A\\u0648\\u0641\\u0631 \\u0628\\u064A\\u0627\\u0646\\u0627\\u062A\r\n\r\n#XFLD: No benefits data available\r\nMB_NO_BENEFITS=\\u0644\\u0627 \\u062A\\u0648\\u062C\\u062F \\u0645\\u0632\\u0627\\u064A\\u0627\r\n\r\n#XFLD: No unenrolled plans\r\nMB_NO_UNENROLLED_PLAN=\\u0644\\u0627 \\u062A\\u0648\\u062C\\u062F \\u062E\\u0637\\u0637 \\u063A\\u064A\\u0631 \\u0645\\u0633\\u062C\\u0644\\u0629\r\n\r\n#XFLD: Plan name\r\nMB_PLAN=\\u0627\\u0644\\u062E\\u0637\\u0629\r\n\r\n#XFLD: Type of plan\r\nMB_PLAN_TYPE=\\u0646\\u0648\\u0639 \\u0627\\u0644\\u062E\\u0637\\u0629\r\n\r\n#XFLD: Status of plan\r\nMB_STATUS=\\u0627\\u0644\\u062D\\u0627\\u0644\\u0629\r\n\r\n#XFLD,35: submit evidence of insurance before specified date \r\nMB_LABEL_EVIDENCE_INSURABILITY=\\u062A\\u0642\\u062F\\u064A\\u0645 \\u062F\\u0644\\u064A\\u0644 \\u0623\\u0647\\u0644\\u064A\\u0629 \\u0627\\u0644\\u062A\\u0623\\u0645\\u064A\\u0646 \\u0642\\u0628\\u0644\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_PLAN_NUMBER=\\u0631\\u0642\\u0645 \\u0627\\u0644\\u062E\\u0637\\u0629\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_GROUP_NUMBER=\\u0631\\u0642\\u0645 \\u0627\\u0644\\u0645\\u062C\\u0645\\u0648\\u0639\\u0629\r\n\r\n#XFLD,35: payroll frequency\r\nMB_PAYROLL_FREQUENCY=\\u062A\\u0643\\u0631\\u0627\\u0631 \\u062F\\u0641\\u0639 \\u0627\\u0644\\u0631\\u0648\\u0627\\u062A\\u0628\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_PRE_TAX_COST=\\u062A\\u0643\\u0644\\u0641\\u0629 \\u0645\\u0627 \\u0642\\u0628\\u0644 \\u0627\\u0644\\u0636\\u0631\\u064A\\u0628\\u0629 \\u0644\\u0644\\u0645\\u0648\\u0638\\u0641\r\n\r\n#XFLD,35: Employee bonus pre tax cost type\r\nMB_EMP_BONUS_PRE_TAX_COST=\\u062A\\u0643\\u0644\\u0641\\u0629 \\u0645\\u0627 \\u0642\\u0628\\u0644 \\u0636\\u0631\\u064A\\u0628\\u0629 \\u0627\\u0644\\u0645\\u0643\\u0627\\u0641\\u0623\\u0629 \\u0644\\u0644\\u0645\\u0648\\u0638\\u0641\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_POST_TAX_COST=\\u062A\\u0643\\u0644\\u0641\\u0629 \\u0645\\u0627 \\u0628\\u0639\\u062F \\u0627\\u0644\\u0636\\u0631\\u064A\\u0628\\u0629 \\u0644\\u0644\\u0645\\u0648\\u0638\\u0641\r\n\r\n#XFLD,35: Employee bonus post tax cost type\r\nMB_EMP_BONUS_POST_TAX_COST=\\u062A\\u0643\\u0644\\u0641\\u0629 \\u0645\\u0627 \\u0628\\u0639\\u062F \\u0636\\u0631\\u064A\\u0628\\u0629 \\u0627\\u0644\\u0645\\u0643\\u0627\\u0641\\u0623\\u0629 \\u0644\\u0644\\u0645\\u0648\\u0638\\u0641\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_ADDITIONAL_POST_TAX_COST=\\u062A\\u0643\\u0644\\u0641\\u0629 \\u0645\\u0627 \\u0628\\u0639\\u062F \\u0636\\u0631\\u064A\\u0628\\u0629 \\u0625\\u0636\\u0627\\u0641\\u064A\\u0629 \\u0644\\u0644\\u0645\\u0648\\u0638\\u0641\r\n\r\n#XFLD,35: Imputed Income\r\nMB_Imputed_Income=\\u0627\\u0644\\u062F\\u062E\\u0644 \\u0627\\u0644\\u0645\\u0641\\u062A\\u0631\\u0636\r\n\r\n#XFLD,35: Employer cost type or reimbursement type\r\nMB_CREDITS=\\u0627\\u0644\\u0642\\u064A\\u0645 \\u0627\\u0644\\u062F\\u0627\\u0626\\u0646\\u0629\r\n\r\n#XFLD,35: Employer cost type\r\nMB_EMPLOYER_COSTS=\\u062A\\u0643\\u0644\\u0641\\u0629 \\u0635\\u0627\\u062D\\u0628 \\u0627\\u0644\\u0639\\u0645\\u0644\r\n\r\n#XFLD: Option for plan\r\nMB_PLAN_OPTION=\\u062E\\u064A\\u0627\\u0631 \\u0627\\u0644\\u062E\\u0637\\u0629\r\n\r\n#XFLD: Plan year\r\nMB_PLAN_YEAR=\\u0633\\u0646\\u0629 \\u0627\\u0644\\u062E\\u0637\\u0629\r\n\r\n#XFLD,30: Contribution per payroll period\r\nMB_CONTRIBUTION_PER_PAY_PERIOD=\\u0627\\u0644\\u0645\\u0633\\u0627\\u0647\\u0645\\u0629\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_PRE_TAX_CONTRIBUTION=\\u0645\\u0633\\u0627\\u0647\\u0645\\u0629 \\u0645\\u0627 \\u0642\\u0628\\u0644 \\u0627\\u0644\\u0636\\u0631\\u064A\\u0628\\u0629 \\u0627\\u0644\\u0645\\u0646\\u062A\\u0638\\u0645\\u0629\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_POST_TAX_CONTRIBUTION=\\u0645\\u0633\\u0627\\u0647\\u0645\\u0629 \\u0645\\u0627 \\u0628\\u0639\\u062F \\u0627\\u0644\\u0636\\u0631\\u064A\\u0628\\u0629 \\u0627\\u0644\\u0645\\u0646\\u062A\\u0638\\u0645\\u0629\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_PRE_TAX_CONTRIBUTION=\\u0645\\u0633\\u0627\\u0647\\u0645\\u0629 \\u0645\\u0627 \\u0642\\u0628\\u0644 \\u0636\\u0631\\u064A\\u0628\\u0629 \\u0627\\u0644\\u0645\\u0643\\u0627\\u0641\\u0623\\u0629\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_POST_TAX_CONTRIBUTION=\\u0645\\u0633\\u0627\\u0647\\u0645\\u0629 \\u0645\\u0627 \\u0628\\u0639\\u062F \\u0636\\u0631\\u064A\\u0628\\u0629 \\u0627\\u0644\\u0645\\u0643\\u0627\\u0641\\u0623\\u0629\r\n\r\n#XFLD,35: Cost type\r\nMB_CALCULATED_CREDIT=\\u0627\\u0644\\u0642\\u064A\\u0645 \\u0627\\u0644\\u062F\\u0627\\u0626\\u0646\\u0629 \\u0627\\u0644\\u0645\\u062D\\u062A\\u0633\\u0628\\u0629\r\n\r\n#XFLD: Period in which the user is enrolled in the benefit plan\r\nMB_PARTICIPATION_PERIOD=\\u0641\\u062A\\u0631\\u0629 \\u0627\\u0644\\u0645\\u0634\\u0627\\u0631\\u0643\\u0629\r\n\r\n#XFLD,65: Roll over pre-tax to post-tax when pre-tax limit is reached\r\nMB_MESSAGE_PRE_TAX_TO_POST_TAX=\\u0645\\u062F \\u0623\\u062C\\u0644 \\u062D\\u062F \\u0645\\u0627 \\u0628\\u0639\\u062F \\u0627\\u0644\\u0636\\u0631\\u064A\\u0628\\u0629 \\u0639\\u0646\\u062F \\u0628\\u0644\\u0648\\u063A \\u062D\\u062F \\u0645\\u0627 \\u0642\\u0628\\u0644 \\u0627\\u0644\\u0636\\u0631\\u064A\\u0628\\u0629\r\n\r\n#XFLD,65: Post-tax contributions start immediately\r\nMB_START_POST_TAX_CONTRIBUTIONS=\\u0628\\u062F\\u0621 \\u0645\\u0633\\u0627\\u0647\\u0645\\u0627\\u062A \\u0645\\u0627 \\u0628\\u0639\\u062F \\u0627\\u0644\\u0636\\u0631\\u064A\\u0628\\u0629 \\u0641\\u064A \\u0627\\u0644\\u062D\\u0627\\u0644\r\n\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=\\u062A\\u0639\\u0630\\u0631 \\u0627\\u0644\\u062D\\u0635\\u0648\\u0644 \\u0639\\u0644\\u0649 \\u0642\\u0627\\u0626\\u0645\\u0629 \\u0627\\u0644\\u0645\\u0632\\u0627\\u064A\\u0627\r\n\r\n#YMSG: Message for detail service error\r\nDETAIL_SERVICE_ERR_MESSAGE=\\u062A\\u0639\\u0630\\u0631 \\u0627\\u0644\\u062D\\u0635\\u0648\\u0644 \\u0639\\u0644\\u0649 \\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u0645\\u0632\\u0627\\u064A\\u0627\r\n\r\n#YMSG: Message for count service error\r\nCOUNT_SERVICE_ERR_MESSAGE=\\u062A\\u0639\\u0630\\u0631 \\u0627\\u0644\\u062D\\u0635\\u0648\\u0644 \\u0639\\u0644\\u0649 \\u0645\\u0644\\u062E\\u0635 \\u0639\\u062F\\u062F \\u0627\\u0644\\u0645\\u0632\\u0627\\u064A\\u0627\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=\\u0627\\u0644\\u0645\\u0632\\u0627\\u064A\\u0627\r\n',
	"hcm/emp/mybenefits/i18n/i18n_cs.properties":'\r\n#XTIT: Application name\r\nMB_APP_TITLE=Moje v\\u00FDhody\r\n\r\n# XFLD: Number of pending benefit plans\r\nPENDING_COUNT={0} nevy\\u0159\\u00EDzeno\r\n\r\n#XTIT,20: Title for benefits list\r\nMB_MASTER_TITLE=V\\u00FDhody ({0})\r\n\r\n#XTIT,30: Title for benefit details\r\nMB_APP_DETAIL_TITLE=V\\u00FDhoda\r\n\r\n#XTIT,8: Selection date for displaying the benefit plans that the user is enrolled in \r\nMB_FOOTER_DATE_TEXT=K\r\n\r\n#XTIT,20: Selection for fetching unenrolled data \r\nMB_SHOW_DETAILS=Zobrazit detaily\r\n\r\n# XFLD,20: Default Placeholder for the search field in Home View\r\nMB_SEARCH_PLACEHOLDER=Hled\\u00E1n\\u00ED...\r\n\r\n#XBUT: Display the confirmation statement for the selection date in another window\r\nMB_CONFIRMATION=Zobrazit souhrn\r\n\r\n#XBUT,8: Button to open menu  \r\nMB_OPEN=Otev\\u0159eno\r\n\r\n#XLST,35: List header to categorize all health-related benefits\r\nMB_LIST_HEADER_HEALTH=Zdrav\\u00ED\r\n\r\n#XLST,35: List header to categorize all life insurance-related benefits\r\nMB_LIST_HEADER_INSURANCE=\\u017Divotn\\u00ED poji\\u0161t\\u011Bn\\u00ED\r\n\r\n#XLST,35: List header to categorize all savings-related benefits\r\nMB_LIST_HEADER_SAVINGS=\\u00DAspory\r\n\r\n#XLST,35: List header to categorize all FSA-related benefits\r\nMB_LIST_HEADER_FSA=Pl\\u00E1n zabezpe\\u010Den\\u00ED\r\n\r\n#XLST,35: List header to categorize all stock-related benefits\r\nMB_LIST_HEADER_STOCK=Z\\u00E1soby\r\n\r\n#XLST,35: List header to categorize all miscellaneous benefits\r\nMB_LIST_HEADER_MISC=R\\u016Fzn\\u00E9\r\n\r\n#XLST,35: List header to categorize all benefits that the user is eligible for, but not enrolled in\r\nMB_LIST_HEADER_UNENROLLED=Nep\\u0159ihl\\u00E1\\u0161en(a)\r\n\r\n#XLST,35: List header to categorize all pending benefits\r\nMB_LIST_HEADER_PENDING=\\u010Cek\\u00E1 na vy\\u0159\\u00EDzen\\u00ED\r\n\r\n#XTIT,20: Title in details view to show information on the benefit plan\r\nMB_INFORMATION=Informace\r\n\r\n#XTIT,20: Title in details view to show links to benefit plan documents\r\nMB_DOCUMENTS=Dokumenty\r\n\r\n#XTIT,20: List of dependents who are covered under the benefit plan  \r\nMB_DEPENDENTS=Z\\u00E1vislosti\r\n\r\n#XTIT,20: List of individuals, organizations, or trust funds that will be eligible to receive benefits of an insurance or retirement plan\r\nMB_BENEFICIARIES=Beneficienti\r\n\r\n#XTIT,20: List of investments done under the benefit plan  \r\nMB_INVESTMENTS=Investice\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan\r\nMB_PRIMARY=Prim\\u00E1rn\\u00ED\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan if the primary beneficiaries are deceased\r\nMB_CONTINGENT=P\\u0159\\u00EDpadn\\u00ED p\\u0159\\u00EDjemci\r\n\r\n#XFLD: No data available\r\nMB_NO_DATA=Nejsou k dispozici \\u017E\\u00E1dn\\u00E1 data\r\n\r\n#XFLD: No benefits data available\r\nMB_NO_BENEFITS=\\u017D\\u00E1dn\\u00E9 v\\u00FDhody\r\n\r\n#XFLD: No unenrolled plans\r\nMB_NO_UNENROLLED_PLAN=\\u017D\\u00E1dn\\u00E9 nep\\u0159ihl\\u00E1\\u0161en\\u00E9 pl\\u00E1ny\r\n\r\n#XFLD: Plan name\r\nMB_PLAN=Pl\\u00E1n\r\n\r\n#XFLD: Type of plan\r\nMB_PLAN_TYPE=Typ pl\\u00E1nu\r\n\r\n#XFLD: Status of plan\r\nMB_STATUS=Stav\r\n\r\n#XFLD,35: submit evidence of insurance before specified date \r\nMB_LABEL_EVIDENCE_INSURABILITY=Odeslat doklad o pojistitelnosti p\\u0159ed\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_PLAN_NUMBER=\\u010C\\u00EDslo pl\\u00E1nu\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_GROUP_NUMBER=\\u010C\\u00EDslo skupiny\r\n\r\n#XFLD,35: payroll frequency\r\nMB_PAYROLL_FREQUENCY=Frekvence z\\u00FA\\u010Dtov\\u00E1n\\u00ED\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_PRE_TAX_COST=N\\u00E1klady zam\\u011Bstnance p\\u0159ed zdan\\u011Bn\\u00EDm\r\n\r\n#XFLD,35: Employee bonus pre tax cost type\r\nMB_EMP_BONUS_PRE_TAX_COST=Bonus zam\\u011Bstnance p\\u0159ed zdan\\u011Bn\\u00EDm\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_POST_TAX_COST=N\\u00E1klady zam\\u011Bstnance po zdan\\u011Bn\\u00ED\r\n\r\n#XFLD,35: Employee bonus post tax cost type\r\nMB_EMP_BONUS_POST_TAX_COST=Bonus zam\\u011Bstnance po zdan\\u011Bn\\u00ED\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_ADDITIONAL_POST_TAX_COST=Dodat. n\\u00E1kl. zam\\u011Bstnance po zdan\\u011Bn\\u00ED\r\n\r\n#XFLD,35: Imputed Income\r\nMB_Imputed_Income=Pen\\u011B\\u017En\\u00ED v\\u00FDhoda\r\n\r\n#XFLD,35: Employer cost type or reimbursement type\r\nMB_CREDITS=Kredity\r\n\r\n#XFLD,35: Employer cost type\r\nMB_EMPLOYER_COSTS=N\\u00E1klady zam\\u011Bstnavatele\r\n\r\n#XFLD: Option for plan\r\nMB_PLAN_OPTION=Mo\\u017Enost pl\\u00E1nu\r\n\r\n#XFLD: Plan year\r\nMB_PLAN_YEAR=Rok pl\\u00E1nu\r\n\r\n#XFLD,30: Contribution per payroll period\r\nMB_CONTRIBUTION_PER_PAY_PERIOD=P\\u0159\\u00EDsp\\u011Bvek\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_PRE_TAX_CONTRIBUTION=Pravideln\\u00FD p\\u0159\\u00EDsp\\u011Bvek p\\u0159ed zdan\\u011Bn\\u00EDm\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_POST_TAX_CONTRIBUTION=Pravideln\\u00FD p\\u0159\\u00EDsp\\u011Bvek po zdan\\u011Bn\\u00ED\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_PRE_TAX_CONTRIBUTION=Bonusov\\u00FD p\\u0159\\u00EDsp\\u011Bvek p\\u0159ed zdan\\u011Bn\\u00EDm\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_POST_TAX_CONTRIBUTION=Bonusov\\u00FD p\\u0159\\u00EDsp\\u011Bvek po zdan\\u011Bn\\u00ED\r\n\r\n#XFLD,35: Cost type\r\nMB_CALCULATED_CREDIT=Vypo\\u010Dten\\u00E9 pohled\\u00E1vky\r\n\r\n#XFLD: Period in which the user is enrolled in the benefit plan\r\nMB_PARTICIPATION_PERIOD=Obdob\\u00ED \\u00FA\\u010Dasti\r\n\r\n#XFLD,65: Roll over pre-tax to post-tax when pre-tax limit is reached\r\nMB_MESSAGE_PRE_TAX_TO_POST_TAX=P\\u0159ev\\u00E9st po zdan\\u011Bn\\u00ED, kdy\\u017E je dosa\\u017Een limit p\\u0159ed zdan\\u011Bn\\u00EDm\r\n\r\n#XFLD,65: Post-tax contributions start immediately\r\nMB_START_POST_TAX_CONTRIBUTIONS=Zah\\u00E1jit p\\u0159\\u00EDsp\\u011Bvky po zdan\\u011Bn\\u00ED ihnet\r\n\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=Nelze z\\u00EDskat seznam v\\u00FDhod\r\n\r\n#YMSG: Message for detail service error\r\nDETAIL_SERVICE_ERR_MESSAGE=Nelze z\\u00EDskat detaily v\\u00FDhod\r\n\r\n#YMSG: Message for count service error\r\nCOUNT_SERVICE_ERR_MESSAGE=Nelze z\\u00EDskat souhrnn v\\u00FDhod\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=Moje v\\u00FDhody\r\n',
	"hcm/emp/mybenefits/i18n/i18n_de.properties":'\r\n#XTIT: Application name\r\nMB_APP_TITLE=Meine Arbeitgeberleistungen\r\n\r\n# XFLD: Number of pending benefit plans\r\nPENDING_COUNT={0} ausstehend\r\n\r\n#XTIT,20: Title for benefits list\r\nMB_MASTER_TITLE=Arbeitgeberleistungen ({0})\r\n\r\n#XTIT,30: Title for benefit details\r\nMB_APP_DETAIL_TITLE=Leistung\r\n\r\n#XTIT,8: Selection date for displaying the benefit plans that the user is enrolled in \r\nMB_FOOTER_DATE_TEXT=Ab\r\n\r\n#XTIT,20: Selection for fetching unenrolled data \r\nMB_SHOW_DETAILS=Details anzeigen\r\n\r\n# XFLD,20: Default Placeholder for the search field in Home View\r\nMB_SEARCH_PLACEHOLDER=Suchen ...\r\n\r\n#XBUT: Display the confirmation statement for the selection date in another window\r\nMB_CONFIRMATION=\\u00DCbersicht\r\n\r\n#XBUT,8: Button to open menu  \r\nMB_OPEN=\\u00D6ffnen\r\n\r\n#XLST,35: List header to categorize all health-related benefits\r\nMB_LIST_HEADER_HEALTH=Gesundheit\r\n\r\n#XLST,35: List header to categorize all life insurance-related benefits\r\nMB_LIST_HEADER_INSURANCE=Lebensversicherung\r\n\r\n#XLST,35: List header to categorize all savings-related benefits\r\nMB_LIST_HEADER_SAVINGS=Verm\\u00F6gensbildung\r\n\r\n#XLST,35: List header to categorize all FSA-related benefits\r\nMB_LIST_HEADER_FSA=Vorsorgepl\\u00E4ne\r\n\r\n#XLST,35: List header to categorize all stock-related benefits\r\nMB_LIST_HEADER_STOCK=Bestand\r\n\r\n#XLST,35: List header to categorize all miscellaneous benefits\r\nMB_LIST_HEADER_MISC=Verschiedenes\r\n\r\n#XLST,35: List header to categorize all benefits that the user is eligible for, but not enrolled in\r\nMB_LIST_HEADER_UNENROLLED=Nicht beansprucht\r\n\r\n#XLST,35: List header to categorize all pending benefits\r\nMB_LIST_HEADER_PENDING=Ausstehend\r\n\r\n#XTIT,20: Title in details view to show information on the benefit plan\r\nMB_INFORMATION=Informationen\r\n\r\n#XTIT,20: Title in details view to show links to benefit plan documents\r\nMB_DOCUMENTS=Dokumente\r\n\r\n#XTIT,20: List of dependents who are covered under the benefit plan  \r\nMB_DEPENDENTS=Mitversicherte\r\n\r\n#XTIT,20: List of individuals, organizations, or trust funds that will be eligible to receive benefits of an insurance or retirement plan\r\nMB_BENEFICIARIES=Beg\\u00FCnstigte\r\n\r\n#XTIT,20: List of investments done under the benefit plan  \r\nMB_INVESTMENTS=Investitionen\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan\r\nMB_PRIMARY=Prim\\u00E4rbeg\\u00FCnstigt\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan if the primary beneficiaries are deceased\r\nMB_CONTINGENT=Ersatzbeg\\u00FCnstigt\r\n\r\n#XFLD: No data available\r\nMB_NO_DATA=Keine Daten vorhanden\r\n\r\n#XFLD: No benefits data available\r\nMB_NO_BENEFITS=Keine Leistungen\r\n\r\n#XFLD: No unenrolled plans\r\nMB_NO_UNENROLLED_PLAN=Alle Pl\\u00E4ne beansprucht\r\n\r\n#XFLD: Plan name\r\nMB_PLAN=Plan\r\n\r\n#XFLD: Type of plan\r\nMB_PLAN_TYPE=Planart\r\n\r\n#XFLD: Status of plan\r\nMB_STATUS=Status\r\n\r\n#XFLD,35: submit evidence of insurance before specified date \r\nMB_LABEL_EVIDENCE_INSURABILITY=Nachweis der Versicherungsf\\u00E4higkeit einreichen bis\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_PLAN_NUMBER=Plannummer\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_GROUP_NUMBER=Gruppennummer\r\n\r\n#XFLD,35: payroll frequency\r\nMB_PAYROLL_FREQUENCY=H\\u00E4ufigkeit der Entgeltabrechnung\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_PRE_TAX_COST=Arbeitnehmeraufwand - Vorsteuer\r\n\r\n#XFLD,35: Employee bonus pre tax cost type\r\nMB_EMP_BONUS_PRE_TAX_COST=Arbeitnehmerbonus - Vorsteuer\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_POST_TAX_COST=Arbeitnehmeraufwand - Nachsteuer\r\n\r\n#XFLD,35: Employee bonus post tax cost type\r\nMB_EMP_BONUS_POST_TAX_COST=Arbeitnehmerbonus - Nachsteuer\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_ADDITIONAL_POST_TAX_COST=Zus\\u00E4tzl. AN-Aufwand - Nachsteuer\r\n\r\n#XFLD,35: Imputed Income\r\nMB_Imputed_Income=Geldwerter Vorteil\r\n\r\n#XFLD,35: Employer cost type or reimbursement type\r\nMB_CREDITS=Zusch\\u00FCsse\r\n\r\n#XFLD,35: Employer cost type\r\nMB_EMPLOYER_COSTS=Arbeitgeberaufwand\r\n\r\n#XFLD: Option for plan\r\nMB_PLAN_OPTION=Planoption\r\n\r\n#XFLD: Plan year\r\nMB_PLAN_YEAR=Planjahr\r\n\r\n#XFLD,30: Contribution per payroll period\r\nMB_CONTRIBUTION_PER_PAY_PERIOD=Beitrag\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_PRE_TAX_CONTRIBUTION=Beitrag - Vorsteuer regul\\u00E4r\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_POST_TAX_CONTRIBUTION=Beitrag - Nachsteuer regul\\u00E4r\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_PRE_TAX_CONTRIBUTION=Beitrag - Vorsteuer Bonus\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_POST_TAX_CONTRIBUTION=Beitrag - Nachsteuer Bonus\r\n\r\n#XFLD,35: Cost type\r\nMB_CALCULATED_CREDIT=Berechnete Zusch\\u00FCsse\r\n\r\n#XFLD: Period in which the user is enrolled in the benefit plan\r\nMB_PARTICIPATION_PERIOD=Beteiligungszeitraum\r\n\r\n#XFLD,65: Roll over pre-tax to post-tax when pre-tax limit is reached\r\nMB_MESSAGE_PRE_TAX_TO_POST_TAX=In Nachsteuer prolongieren, wenn Vorsteuerlimit erreicht\r\n\r\n#XFLD,65: Post-tax contributions start immediately\r\nMB_START_POST_TAX_CONTRIBUTIONS=Nachsteuerbeitr\\u00E4ge ab sofort f\\u00E4llig\r\n\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=Leistungsliste kann nicht abgerufen werden\r\n\r\n#YMSG: Message for detail service error\r\nDETAIL_SERVICE_ERR_MESSAGE=Leistungsdetails k\\u00F6nnen nicht abgerufen werden\r\n\r\n#YMSG: Message for count service error\r\nCOUNT_SERVICE_ERR_MESSAGE=Leistungs\\u00FCbersicht kann nicht abgerufen werden\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=Meine Arbeitgeberleistungen\r\n',
	"hcm/emp/mybenefits/i18n/i18n_en.properties":'\r\n#XTIT: Application name\r\nMB_APP_TITLE=My Benefits\r\n\r\n# XFLD: Number of pending benefit plans\r\nPENDING_COUNT={0} Pending\r\n\r\n#XTIT,20: Title for benefits list\r\nMB_MASTER_TITLE=Benefits ({0})\r\n\r\n#XTIT,30: Title for benefit details\r\nMB_APP_DETAIL_TITLE=Benefit\r\n\r\n#XTIT,8: Selection date for displaying the benefit plans that the user is enrolled in \r\nMB_FOOTER_DATE_TEXT=As Of\r\n\r\n#XTIT,20: Selection for fetching unenrolled data \r\nMB_SHOW_DETAILS=Show Details\r\n\r\n# XFLD,20: Default Placeholder for the search field in Home View\r\nMB_SEARCH_PLACEHOLDER=Searching...\r\n\r\n#XBUT: Display the confirmation statement for the selection date in another window\r\nMB_CONFIRMATION=View Summary\r\n\r\n#XBUT,8: Button to open menu  \r\nMB_OPEN=Open\r\n\r\n#XLST,35: List header to categorize all health-related benefits\r\nMB_LIST_HEADER_HEALTH=Health\r\n\r\n#XLST,35: List header to categorize all life insurance-related benefits\r\nMB_LIST_HEADER_INSURANCE=Life Insurance\r\n\r\n#XLST,35: List header to categorize all savings-related benefits\r\nMB_LIST_HEADER_SAVINGS=Savings\r\n\r\n#XLST,35: List header to categorize all FSA-related benefits\r\nMB_LIST_HEADER_FSA=Flexible Spending Accounts\r\n\r\n#XLST,35: List header to categorize all stock-related benefits\r\nMB_LIST_HEADER_STOCK=Stock\r\n\r\n#XLST,35: List header to categorize all miscellaneous benefits\r\nMB_LIST_HEADER_MISC=Miscellaneous\r\n\r\n#XLST,35: List header to categorize all benefits that the user is eligible for, but not enrolled in\r\nMB_LIST_HEADER_UNENROLLED=Not Enrolled\r\n\r\n#XLST,35: List header to categorize all pending benefits\r\nMB_LIST_HEADER_PENDING=Pending\r\n\r\n#XTIT,20: Title in details view to show information on the benefit plan\r\nMB_INFORMATION=Information\r\n\r\n#XTIT,20: Title in details view to show links to benefit plan documents\r\nMB_DOCUMENTS=Documents\r\n\r\n#XTIT,20: List of dependents who are covered under the benefit plan  \r\nMB_DEPENDENTS=Dependents\r\n\r\n#XTIT,20: List of individuals, organizations, or trust funds that will be eligible to receive benefits of an insurance or retirement plan\r\nMB_BENEFICIARIES=Beneficiaries\r\n\r\n#XTIT,20: List of investments done under the benefit plan  \r\nMB_INVESTMENTS=Investments\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan\r\nMB_PRIMARY=Primary\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan if the primary beneficiaries are deceased\r\nMB_CONTINGENT=Contingent\r\n\r\n#XFLD: No data available\r\nMB_NO_DATA=No Data Available\r\n\r\n#XFLD: No benefits data available\r\nMB_NO_BENEFITS=No Benefits\r\n\r\n#XFLD: No unenrolled plans\r\nMB_NO_UNENROLLED_PLAN=No Unenrolled Plans\r\n\r\n#XFLD: Plan name\r\nMB_PLAN=Plan\r\n\r\n#XFLD: Type of plan\r\nMB_PLAN_TYPE=Plan Type\r\n\r\n#XFLD: Status of plan\r\nMB_STATUS=Status\r\n\r\n#XFLD,35: submit evidence of insurance before specified date \r\nMB_LABEL_EVIDENCE_INSURABILITY=Submit Evidence of Insurability Before\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_PLAN_NUMBER=Plan Number\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_GROUP_NUMBER=Group Number\r\n\r\n#XFLD,35: payroll frequency\r\nMB_PAYROLL_FREQUENCY=Payroll Frequency\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_PRE_TAX_COST=Employee Pre-Tax Cost\r\n\r\n#XFLD,35: Employee bonus pre tax cost type\r\nMB_EMP_BONUS_PRE_TAX_COST=Employee Bonus Pre-Tax Cost\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_POST_TAX_COST=Employee Post-Tax Cost\r\n\r\n#XFLD,35: Employee bonus post tax cost type\r\nMB_EMP_BONUS_POST_TAX_COST=Employee Bonus Post-Tax Cost\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_ADDITIONAL_POST_TAX_COST=Employee Additional Post-Tax Cost\r\n\r\n#XFLD,35: Imputed Income\r\nMB_Imputed_Income=Imputed Income\r\n\r\n#XFLD,35: Employer cost type or reimbursement type\r\nMB_CREDITS=Credits\r\n\r\n#XFLD,35: Employer cost type\r\nMB_EMPLOYER_COSTS=Employer Cost\r\n\r\n#XFLD: Option for plan\r\nMB_PLAN_OPTION=Plan Option\r\n\r\n#XFLD: Plan year\r\nMB_PLAN_YEAR=Plan Year\r\n\r\n#XFLD,30: Contribution per payroll period\r\nMB_CONTRIBUTION_PER_PAY_PERIOD=Contribution\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_PRE_TAX_CONTRIBUTION=Regular Pre-Tax Contribution\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_POST_TAX_CONTRIBUTION=Regular Post-Tax Contribution\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_PRE_TAX_CONTRIBUTION=Bonus Pre-Tax Contribution\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_POST_TAX_CONTRIBUTION=Bonus Post-Tax Contribution\r\n\r\n#XFLD,35: Cost type\r\nMB_CALCULATED_CREDIT=Calculated Credits\r\n\r\n#XFLD: Period in which the user is enrolled in the benefit plan\r\nMB_PARTICIPATION_PERIOD=Participation Period\r\n\r\n#XFLD,65: Roll over pre-tax to post-tax when pre-tax limit is reached\r\nMB_MESSAGE_PRE_TAX_TO_POST_TAX=Roll Over to Post-Tax When Pre-Tax Limit Is Reached\r\n\r\n#XFLD,65: Post-tax contributions start immediately\r\nMB_START_POST_TAX_CONTRIBUTIONS=Start Post-Tax Contributions Immediately\r\n\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=Could not obtain the list of benefits\r\n\r\n#YMSG: Message for detail service error\r\nDETAIL_SERVICE_ERR_MESSAGE=Could not obtain the benefit detail\r\n\r\n#YMSG: Message for count service error\r\nCOUNT_SERVICE_ERR_MESSAGE=Could not obtain benefits count summary\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=My Benefits\r\n',
	"hcm/emp/mybenefits/i18n/i18n_en_US_sappsd.properties":'\r\n#XTIT: Application name\r\nMB_APP_TITLE=[[[\\u039C\\u0177 \\u0181\\u0113\\u014B\\u0113\\u0192\\u012F\\u0163\\u015F]]]\r\n\r\n# XFLD: Number of pending benefit plans\r\nPENDING_COUNT={0}[[[ \\u01A4\\u0113\\u014B\\u018C\\u012F\\u014B\\u011F]]]\r\n\r\n#XTIT,20: Title for benefits list\r\nMB_MASTER_TITLE=[[[\\u0181\\u0113\\u014B\\u0113\\u0192\\u012F\\u0163\\u015F ({0})]]]\r\n\r\n#XTIT,30: Title for benefit details\r\nMB_APP_DETAIL_TITLE=[[[\\u0181\\u0113\\u014B\\u0113\\u0192\\u012F\\u0163]]]\r\n\r\n#XTIT,8: Selection date for displaying the benefit plans that the user is enrolled in \r\nMB_FOOTER_DATE_TEXT=[[[\\u1000\\u015F \\u014F\\u0192]]]\r\n\r\n#XTIT,20: Selection for fetching unenrolled data \r\nMB_SHOW_DETAILS=[[[\\u015C\\u0125\\u014F\\u0175 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F...]]]\r\n\r\n# XFLD,20: Default Placeholder for the search field in Home View\r\nMB_SEARCH_PLACEHOLDER=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125...]]]\r\n\r\n#XBUT: Display the confirmation statement for the selection date in another window\r\nMB_CONFIRMATION=[[[\\u01B2\\u012F\\u0113\\u0175 \\u015C\\u0171\\u0271\\u0271\\u0105\\u0157\\u0177]]]\r\n\r\n#XBUT,8: Button to open menu  \r\nMB_OPEN=[[[\\u014E\\u03C1\\u0113\\u014B]]]\r\n\r\n#XLST,35: List header to categorize all health-related benefits\r\nMB_LIST_HEADER_HEALTH=[[[\\u0124\\u0113\\u0105\\u013A\\u0163\\u0125]]]\r\n\r\n#XLST,35: List header to categorize all life insurance-related benefits\r\nMB_LIST_HEADER_INSURANCE=[[[\\u013B\\u012F\\u0192\\u0113 \\u012C\\u014B\\u015F\\u0171\\u0157\\u0105\\u014B\\u010B\\u0113]]]\r\n\r\n#XLST,35: List header to categorize all savings-related benefits\r\nMB_LIST_HEADER_SAVINGS=[[[\\u015C\\u0105\\u028B\\u012F\\u014B\\u011F\\u015F]]]\r\n\r\n#XLST,35: List header to categorize all FSA-related benefits\r\nMB_LIST_HEADER_FSA=[[[\\u0191\\u013A\\u0113\\u03C7\\u012F\\u0183\\u013A\\u0113 \\u015C\\u03C1\\u0113\\u014B\\u018C\\u012F\\u014B\\u011F \\u1000\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163\\u015F]]]\r\n\r\n#XLST,35: List header to categorize all stock-related benefits\r\nMB_LIST_HEADER_STOCK=[[[\\u015C\\u0163\\u014F\\u010B\\u0137]]]\r\n\r\n#XLST,35: List header to categorize all miscellaneous benefits\r\nMB_LIST_HEADER_MISC=[[[\\u039C\\u012F\\u015F\\u010B\\u0113\\u013A\\u013A\\u0105\\u014B\\u0113\\u014F\\u0171\\u015F]]]\r\n\r\n#XLST,35: List header to categorize all benefits that the user is eligible for, but not enrolled in\r\nMB_LIST_HEADER_UNENROLLED=[[[\\u0143\\u014F\\u0163 \\u0114\\u014B\\u0157\\u014F\\u013A\\u013A\\u0113\\u018C]]]\r\n\r\n#XLST,35: List header to categorize all pending benefits\r\nMB_LIST_HEADER_PENDING=[[[\\u01A4\\u0113\\u014B\\u018C\\u012F\\u014B\\u011F]]]\r\n\r\n#XTIT,20: Title in details view to show information on the benefit plan\r\nMB_INFORMATION=[[[\\u012C\\u014B\\u0192\\u014F\\u0157\\u0271\\u0105\\u0163\\u012F\\u014F\\u014B]]]\r\n\r\n#XTIT,20: Title in details view to show links to benefit plan documents\r\nMB_DOCUMENTS=[[[\\u010E\\u014F\\u010B\\u0171\\u0271\\u0113\\u014B\\u0163\\u015F]]]\r\n\r\n#XTIT,20: List of dependents who are covered under the benefit plan  \r\nMB_DEPENDENTS=[[[\\u010E\\u0113\\u03C1\\u0113\\u014B\\u018C\\u0113\\u014B\\u0163\\u015F]]]\r\n\r\n#XTIT,20: List of individuals, organizations, or trust funds that will be eligible to receive benefits of an insurance or retirement plan\r\nMB_BENEFICIARIES=[[[\\u0181\\u0113\\u014B\\u0113\\u0192\\u012F\\u010B\\u012F\\u0105\\u0157\\u012F\\u0113\\u015F]]]\r\n\r\n#XTIT,20: List of investments done under the benefit plan  \r\nMB_INVESTMENTS=[[[\\u012C\\u014B\\u028B\\u0113\\u015F\\u0163\\u0271\\u0113\\u014B\\u0163\\u015F]]]\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan\r\nMB_PRIMARY=[[[\\u01A4\\u0157\\u012F\\u0271\\u0105\\u0157\\u0177]]]\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan if the primary beneficiaries are deceased\r\nMB_CONTINGENT=[[[\\u0108\\u014F\\u014B\\u0163\\u012F\\u014B\\u011F\\u0113\\u014B\\u0163]]]\r\n\r\n#XFLD: No data available\r\nMB_NO_DATA=[[[\\u0143\\u014F \\u018C\\u0105\\u0163\\u0105 \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113]]]\r\n\r\n#XFLD: No benefits data available\r\nMB_NO_BENEFITS=[[[\\u0143\\u014F \\u0183\\u0113\\u014B\\u0113\\u0192\\u012F\\u0163\\u015F]]]\r\n\r\n#XFLD: No unenrolled plans\r\nMB_NO_UNENROLLED_PLAN=[[[\\u0143\\u014F \\u016E\\u014B\\u0113\\u014B\\u0157\\u014F\\u013A\\u013A\\u0113\\u018C \\u01A4\\u013A\\u0105\\u014B\\u015F]]]\r\n\r\n#XFLD: Plan name\r\nMB_PLAN=[[[\\u01A4\\u013A\\u0105\\u014B]]]\r\n\r\n#XFLD: Type of plan\r\nMB_PLAN_TYPE=[[[\\u01A4\\u013A\\u0105\\u014B \\u0162\\u0177\\u03C1\\u0113]]]\r\n\r\n#XFLD: Status of plan\r\nMB_STATUS=[[[\\u015C\\u0163\\u0105\\u0163\\u0171\\u015F]]]\r\n\r\n#XFLD,35: submit evidence of insurance before specified date \r\nMB_LABEL_EVIDENCE_INSURABILITY=[[[\\u015C\\u0171\\u0183\\u0271\\u012F\\u0163 \\u0114\\u028B\\u012F\\u018C\\u0113\\u014B\\u010B\\u0113 \\u014F\\u0192 \\u012C\\u014B\\u015F\\u0171\\u0157\\u0105\\u0183\\u012F\\u013A\\u012F\\u0163\\u0177 \\u0181\\u0113\\u0192\\u014F\\u0157\\u0113]]]\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_PLAN_NUMBER=[[[\\u01A4\\u013A\\u0105\\u014B \\u0143\\u0171\\u0271\\u0183\\u0113\\u0157]]]\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_GROUP_NUMBER=[[[\\u0122\\u0157\\u014F\\u0171\\u03C1 \\u0143\\u0171\\u0271\\u0183\\u0113\\u0157]]]\r\n\r\n#XFLD,35: payroll frequency\r\nMB_PAYROLL_FREQUENCY=[[[\\u01A4\\u0105\\u0177\\u0157\\u014F\\u013A\\u013A \\u0191\\u0157\\u0113\\u01A3\\u0171\\u0113\\u014B\\u010B\\u0177]]]\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_PRE_TAX_COST=[[[\\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113 \\u01A4\\u0157\\u0113-\\u0162\\u0105\\u03C7 \\u0108\\u014F\\u015F\\u0163]]]\r\n\r\n#XFLD,35: Employee bonus pre tax cost type\r\nMB_EMP_BONUS_PRE_TAX_COST=[[[\\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113 \\u0181\\u014F\\u014B\\u0171\\u015F \\u01A4\\u0157\\u0113-\\u0162\\u0105\\u03C7 \\u0108\\u014F\\u015F\\u0163]]]\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_POST_TAX_COST=[[[\\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113 \\u01A4\\u014F\\u015F\\u0163-\\u0162\\u0105\\u03C7 \\u0108\\u014F\\u015F\\u0163]]]\r\n\r\n#XFLD,35: Employee bonus post tax cost type\r\nMB_EMP_BONUS_POST_TAX_COST=[[[\\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113 \\u0181\\u014F\\u014B\\u0171\\u015F \\u01A4\\u014F\\u015F\\u0163-\\u0162\\u0105\\u03C7 \\u0108\\u014F\\u015F\\u0163]]]\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_ADDITIONAL_POST_TAX_COST=[[[\\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113 \\u1000\\u018C\\u018C\\u012F\\u0163\\u012F\\u014F\\u014B\\u0105\\u013A \\u01A4\\u014F\\u015F\\u0163-\\u0162\\u0105\\u03C7 \\u0108\\u014F\\u015F\\u0163]]]\r\n\r\n#XFLD,35: Imputed Income\r\nMB_Imputed_Income=[[[\\u012C\\u0271\\u03C1\\u0171\\u0163\\u0113\\u018C \\u012C\\u014B\\u010B\\u014F\\u0271\\u0113]]]\r\n\r\n#XFLD,35: Employer cost type or reimbursement type\r\nMB_CREDITS=[[[\\u0108\\u0157\\u0113\\u018C\\u012F\\u0163\\u015F]]]\r\n\r\n#XFLD,35: Employer cost type\r\nMB_EMPLOYER_COSTS=[[[\\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0157 \\u0108\\u014F\\u015F\\u0163]]]\r\n\r\n#XFLD: Option for plan\r\nMB_PLAN_OPTION=[[[\\u01A4\\u013A\\u0105\\u014B \\u014E\\u03C1\\u0163\\u012F\\u014F\\u014B]]]\r\n\r\n#XFLD: Plan year\r\nMB_PLAN_YEAR=[[[\\u01A4\\u013A\\u0105\\u014B \\u0176\\u0113\\u0105\\u0157]]]\r\n\r\n#XFLD,30: Contribution per payroll period\r\nMB_CONTRIBUTION_PER_PAY_PERIOD=[[[\\u0108\\u014F\\u014B\\u0163\\u0157\\u012F\\u0183\\u0171\\u0163\\u012F\\u014F\\u014B]]]\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_PRE_TAX_CONTRIBUTION=[[[\\u0158\\u0113\\u011F\\u0171\\u013A\\u0105\\u0157 \\u01A4\\u0157\\u0113-\\u0162\\u0105\\u03C7 \\u0108\\u014F\\u014B\\u0163\\u0157\\u012F\\u0183\\u0171\\u0163\\u012F\\u014F\\u014B]]]\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_POST_TAX_CONTRIBUTION=[[[\\u0158\\u0113\\u011F\\u0171\\u013A\\u0105\\u0157 \\u01A4\\u014F\\u015F\\u0163-\\u0162\\u0105\\u03C7 \\u0108\\u014F\\u014B\\u0163\\u0157\\u012F\\u0183\\u0171\\u0163\\u012F\\u014F\\u014B]]]\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_PRE_TAX_CONTRIBUTION=[[[\\u0181\\u014F\\u014B\\u0171\\u015F \\u01A4\\u0157\\u0113-\\u0162\\u0105\\u03C7 \\u0108\\u014F\\u014B\\u0163\\u0157\\u012F\\u0183\\u0171\\u0163\\u012F\\u014F\\u014B]]]\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_POST_TAX_CONTRIBUTION=[[[\\u0181\\u014F\\u014B\\u0171\\u015F \\u01A4\\u014F\\u015F\\u0163-\\u0162\\u0105\\u03C7 \\u0108\\u014F\\u014B\\u0163\\u0157\\u012F\\u0183\\u0171\\u0163\\u012F\\u014F\\u014B]]]\r\n\r\n#XFLD,35: Cost type\r\nMB_CALCULATED_CREDIT=[[[\\u0108\\u0105\\u013A\\u010B\\u0171\\u013A\\u0105\\u0163\\u0113\\u018C \\u0108\\u0157\\u0113\\u018C\\u012F\\u0163\\u015F]]]\r\n\r\n#XFLD: Period in which the user is enrolled in the benefit plan\r\nMB_PARTICIPATION_PERIOD=[[[\\u01A4\\u0105\\u0157\\u0163\\u012F\\u010B\\u012F\\u03C1\\u0105\\u0163\\u012F\\u014F\\u014B \\u01A4\\u0113\\u0157\\u012F\\u014F\\u018C]]]\r\n\r\n#XFLD,65: Roll over pre-tax to post-tax when pre-tax limit is reached\r\nMB_MESSAGE_PRE_TAX_TO_POST_TAX=[[[\\u0158\\u014F\\u013A\\u013A \\u014F\\u028B\\u0113\\u0157 \\u0163\\u014F \\u03C1\\u014F\\u015F\\u0163-\\u0163\\u0105\\u03C7 \\u0175\\u0125\\u0113\\u014B \\u03C1\\u0157\\u0113-\\u0163\\u0105\\u03C7 \\u013A\\u012F\\u0271\\u012F\\u0163 \\u012F\\u015F \\u0157\\u0113\\u0105\\u010B\\u0125\\u0113\\u018C]]]\r\n\r\n#XFLD,65: Post-tax contributions start immediately\r\nMB_START_POST_TAX_CONTRIBUTIONS=[[[\\u015C\\u0163\\u0105\\u0157\\u0163 \\u03C1\\u014F\\u015F\\u0163-\\u0163\\u0105\\u03C7 \\u010B\\u014F\\u014B\\u0163\\u0157\\u012F\\u0183\\u0171\\u0163\\u012F\\u014F\\u014B\\u015F \\u012F\\u0271\\u0271\\u0113\\u018C\\u012F\\u0105\\u0163\\u0113\\u013A\\u0177]]]\r\n\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=[[[\\u0108\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u014F\\u0183\\u0163\\u0105\\u012F\\u014B \\u0163\\u0125\\u0113 \\u013A\\u012F\\u015F\\u0163 \\u014F\\u0192 \\u0183\\u0113\\u014B\\u0113\\u0192\\u012F\\u0163\\u015F]]]\r\n\r\n#YMSG: Message for detail service error\r\nDETAIL_SERVICE_ERR_MESSAGE=[[[\\u0108\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u014F\\u0183\\u0163\\u0105\\u012F\\u014B \\u0163\\u0125\\u0113 \\u0183\\u0113\\u014B\\u0113\\u0192\\u012F\\u0163 \\u018C\\u0113\\u0163\\u0105\\u012F\\u013A]]]\r\n\r\n#YMSG: Message for count service error\r\nCOUNT_SERVICE_ERR_MESSAGE=[[[\\u0108\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u014F\\u0183\\u0163\\u0105\\u012F\\u014B \\u0183\\u0113\\u014B\\u0113\\u0192\\u012F\\u0163\\u015F \\u010B\\u014F\\u0171\\u014B\\u0163 \\u015F\\u0171\\u0271\\u0271\\u0105\\u0157\\u0177]]]\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=[[[\\u039C\\u0177 \\u0181\\u0113\\u014B\\u0113\\u0192\\u012F\\u0163\\u015F]]]\r\n',
	"hcm/emp/mybenefits/i18n/i18n_en_US_saptrc.properties":'\r\n#XTIT: Application name\r\nMB_APP_TITLE=m0DekUhIbNdpTI2CwPe+qA_My Benefits\r\n\r\n# XFLD: Number of pending benefit plans\r\nPENDING_COUNT=CSI4tVXf8bRRuqh3i6zAKg_{0} Pending\r\n\r\n#XTIT,20: Title for benefits list\r\nMB_MASTER_TITLE=GDTixL1sZethYwLzB1AZEg_Benefits ({0})\r\n\r\n#XTIT,30: Title for benefit details\r\nMB_APP_DETAIL_TITLE=ahNOpZ/h4C4PxOeove75Yw_Benefit\r\n\r\n#XTIT,8: Selection date for displaying the benefit plans that the user is enrolled in \r\nMB_FOOTER_DATE_TEXT=7BXAWWvvrgncH9f90lSDOQ_As of\r\n\r\n#XTIT,20: Selection for fetching unenrolled data \r\nMB_SHOW_DETAILS=RumGkyXOwXsDRmQxHyBpHg_Show Details...\r\n\r\n# XFLD,20: Default Placeholder for the search field in Home View\r\nMB_SEARCH_PLACEHOLDER=WPy/RWWTJhbjObYN8IlXCQ_Search...\r\n\r\n#XBUT: Display the confirmation statement for the selection date in another window\r\nMB_CONFIRMATION=UqqYBSx4bwFs8ii9k3TnHw_View Summary\r\n\r\n#XBUT,8: Button to open menu  \r\nMB_OPEN=BC7CoFu47z8OxkBSRpi1jw_Open\r\n\r\n#XLST,35: List header to categorize all health-related benefits\r\nMB_LIST_HEADER_HEALTH=LCdnrWr4Jja6hI2TMM3DXQ_Health\r\n\r\n#XLST,35: List header to categorize all life insurance-related benefits\r\nMB_LIST_HEADER_INSURANCE=U4gclXbuFGfZ67qvtRNhLg_Life Insurance\r\n\r\n#XLST,35: List header to categorize all savings-related benefits\r\nMB_LIST_HEADER_SAVINGS=8ZSSyvw3c64jhwya0BAEkA_Savings\r\n\r\n#XLST,35: List header to categorize all FSA-related benefits\r\nMB_LIST_HEADER_FSA=fet2606RGwy1Go4djsTtog_Flexible Spending Accounts\r\n\r\n#XLST,35: List header to categorize all stock-related benefits\r\nMB_LIST_HEADER_STOCK=GPuaSh49jhhbPLCQmhd90w_Stock\r\n\r\n#XLST,35: List header to categorize all miscellaneous benefits\r\nMB_LIST_HEADER_MISC=c0hZzC6pM1GCb8A17I/PDA_Miscellaneous\r\n\r\n#XLST,35: List header to categorize all benefits that the user is eligible for, but not enrolled in\r\nMB_LIST_HEADER_UNENROLLED=2RLyTvh1Arns2fxXzqX2Lg_Not Enrolled\r\n\r\n#XLST,35: List header to categorize all pending benefits\r\nMB_LIST_HEADER_PENDING=0qxQX1Uh7nh6/7H0KPPipQ_Pending\r\n\r\n#XTIT,20: Title in details view to show information on the benefit plan\r\nMB_INFORMATION=SiB/rYeCrzv8uZcSWpBYpA_Information\r\n\r\n#XTIT,20: Title in details view to show links to benefit plan documents\r\nMB_DOCUMENTS=YrYKSEKMe8rjU1alKitfiw_Documents\r\n\r\n#XTIT,20: List of dependents who are covered under the benefit plan  \r\nMB_DEPENDENTS=hKmiFHcSk5UW2szBRRwVxQ_Dependents\r\n\r\n#XTIT,20: List of individuals, organizations, or trust funds that will be eligible to receive benefits of an insurance or retirement plan\r\nMB_BENEFICIARIES=O0HY1URLiZe5VtXwe5bD/Q_Beneficiaries\r\n\r\n#XTIT,20: List of investments done under the benefit plan  \r\nMB_INVESTMENTS=6Yifi+LTYAQQ0Bx1gp/7qQ_Investments\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan\r\nMB_PRIMARY=rJO1Puja7tJdizrYuP3iAg_Primary\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan if the primary beneficiaries are deceased\r\nMB_CONTINGENT=1jpQVkrXfTMG4CCdS9Mh+w_Contingent\r\n\r\n#XFLD: No data available\r\nMB_NO_DATA=sVZSbbOWyECupXol+Ksn+Q_No data available\r\n\r\n#XFLD: No benefits data available\r\nMB_NO_BENEFITS=0KxBgNZAky+T1ixYmzo37g_No benefits\r\n\r\n#XFLD: No unenrolled plans\r\nMB_NO_UNENROLLED_PLAN=WXOXIZQRj2bkGrvFH8FiPA_No Unenrolled Plans\r\n\r\n#XFLD: Plan name\r\nMB_PLAN=/C0IvOe6+TIjDZI3S2XhTg_Plan\r\n\r\n#XFLD: Type of plan\r\nMB_PLAN_TYPE=urMPw5QW+ecADia3kez6eA_Plan Type\r\n\r\n#XFLD: Status of plan\r\nMB_STATUS=6oi7vbBkOIieE/DKduu14A_Status\r\n\r\n#XFLD,35: submit evidence of insurance before specified date \r\nMB_LABEL_EVIDENCE_INSURABILITY=ZLL2lnTZiI9anpsuor8HPw_Submit Evidence of Insurability Before\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_PLAN_NUMBER=zWlHW74eoEwC7xRaam1Nxg_Plan Number\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_GROUP_NUMBER=CGHaXprJLggU2623bDUyng_Group Number\r\n\r\n#XFLD,35: payroll frequency\r\nMB_PAYROLL_FREQUENCY=uVBVoB/k0fjTLF0NcsUm1w_Payroll Frequency\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_PRE_TAX_COST=ADeniwNQLKeIhf/Tb+R7lQ_Employee Pre-Tax Cost\r\n\r\n#XFLD,35: Employee bonus pre tax cost type\r\nMB_EMP_BONUS_PRE_TAX_COST=WkvdExDVxUIofyV8LUztxQ_Employee Bonus Pre-Tax Cost\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_POST_TAX_COST=bR+ujrXvwpdGwoKQGR8X9A_Employee Post-Tax Cost\r\n\r\n#XFLD,35: Employee bonus post tax cost type\r\nMB_EMP_BONUS_POST_TAX_COST=5M0PhpOJGUTCAvmlKJJQCA_Employee Bonus Post-Tax Cost\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_ADDITIONAL_POST_TAX_COST=SAxDb5Jb8whMq6RAzUWzQg_Employee Additional Post-Tax Cost\r\n\r\n#XFLD,35: Imputed Income\r\nMB_Imputed_Income=h3r8Qe1RzmPihHTNzBe8KQ_Imputed Income\r\n\r\n#XFLD,35: Employer cost type or reimbursement type\r\nMB_CREDITS=KTd7sEzxRC12ObNKuoDSKA_Credits\r\n\r\n#XFLD,35: Employer cost type\r\nMB_EMPLOYER_COSTS=qjJJk5OrbyyoubaJoSzQtg_Employer Cost\r\n\r\n#XFLD: Option for plan\r\nMB_PLAN_OPTION=y7s86wjTqV6WIsNO0c/pYg_Plan Option\r\n\r\n#XFLD: Plan year\r\nMB_PLAN_YEAR=mFD6attjIc+T/XtYqNIrRQ_Plan Year\r\n\r\n#XFLD,30: Contribution per payroll period\r\nMB_CONTRIBUTION_PER_PAY_PERIOD=s8jmZIU/Qk70Rcs50tOpTQ_Contribution\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_PRE_TAX_CONTRIBUTION=yjc4TYPhbHcVhhle7+RB8w_Regular Pre-Tax Contribution\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_POST_TAX_CONTRIBUTION=oJgqMrMizxtMr/YUGfCHFQ_Regular Post-Tax Contribution\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_PRE_TAX_CONTRIBUTION=IhTnngxa6NdTVYSmJ6jD4A_Bonus Pre-Tax Contribution\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_POST_TAX_CONTRIBUTION=oKgYON9XGC1hrWjEngG7ow_Bonus Post-Tax Contribution\r\n\r\n#XFLD,35: Cost type\r\nMB_CALCULATED_CREDIT=71kGYFW/i5fwjWsiUIoX4Q_Calculated Credits\r\n\r\n#XFLD: Period in which the user is enrolled in the benefit plan\r\nMB_PARTICIPATION_PERIOD=Eke4zU9LbSLat9zMov3FTA_Participation Period\r\n\r\n#XFLD,65: Roll over pre-tax to post-tax when pre-tax limit is reached\r\nMB_MESSAGE_PRE_TAX_TO_POST_TAX=tPKF7bRIAdMS9VwjIkKNXg_Roll over to post-tax when pre-tax limit is reached\r\n\r\n#XFLD,65: Post-tax contributions start immediately\r\nMB_START_POST_TAX_CONTRIBUTIONS=4Ze6M8czj8g85sYRtINVcw_Start post-tax contributions immediately\r\n\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=79vQbz7ac+pUHwi7EIr91w_Could not obtain the list of benefits\r\n\r\n#YMSG: Message for detail service error\r\nDETAIL_SERVICE_ERR_MESSAGE=K51jPZSXtWOULKcrTjiESQ_Could not obtain the benefit detail\r\n\r\n#YMSG: Message for count service error\r\nCOUNT_SERVICE_ERR_MESSAGE=ALWXvOan5UXO+C5xyzyzJg_Could not obtain benefits count summary\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=RYLupwVFcDSbvkA6XMCrXA_My Benefits\r\n',
	"hcm/emp/mybenefits/i18n/i18n_es.properties":'\r\n#XTIT: Application name\r\nMB_APP_TITLE=Mis beneficios\r\n\r\n# XFLD: Number of pending benefit plans\r\nPENDING_COUNT={0} pendientes\r\n\r\n#XTIT,20: Title for benefits list\r\nMB_MASTER_TITLE=Beneficios ({0})\r\n\r\n#XTIT,30: Title for benefit details\r\nMB_APP_DETAIL_TITLE=Beneficio\r\n\r\n#XTIT,8: Selection date for displaying the benefit plans that the user is enrolled in \r\nMB_FOOTER_DATE_TEXT=Desde el\r\n\r\n#XTIT,20: Selection for fetching unenrolled data \r\nMB_SHOW_DETAILS=Visualizar detalles\r\n\r\n# XFLD,20: Default Placeholder for the search field in Home View\r\nMB_SEARCH_PLACEHOLDER=Buscando...\r\n\r\n#XBUT: Display the confirmation statement for the selection date in another window\r\nMB_CONFIRMATION=Resumen de vista\r\n\r\n#XBUT,8: Button to open menu  \r\nMB_OPEN=Abiertos\r\n\r\n#XLST,35: List header to categorize all health-related benefits\r\nMB_LIST_HEADER_HEALTH=Salud\r\n\r\n#XLST,35: List header to categorize all life insurance-related benefits\r\nMB_LIST_HEADER_INSURANCE=Seguro de vida\r\n\r\n#XLST,35: List header to categorize all savings-related benefits\r\nMB_LIST_HEADER_SAVINGS=Ahorros\r\n\r\n#XLST,35: List header to categorize all FSA-related benefits\r\nMB_LIST_HEADER_FSA=Cuenta de ahorros flexibles\r\n\r\n#XLST,35: List header to categorize all stock-related benefits\r\nMB_LIST_HEADER_STOCK=Stock\r\n\r\n#XLST,35: List header to categorize all miscellaneous benefits\r\nMB_LIST_HEADER_MISC=Otros\r\n\r\n#XLST,35: List header to categorize all benefits that the user is eligible for, but not enrolled in\r\nMB_LIST_HEADER_UNENROLLED=No inscrito\r\n\r\n#XLST,35: List header to categorize all pending benefits\r\nMB_LIST_HEADER_PENDING=Pendiente\r\n\r\n#XTIT,20: Title in details view to show information on the benefit plan\r\nMB_INFORMATION=Informaci\\u00F3n\r\n\r\n#XTIT,20: Title in details view to show links to benefit plan documents\r\nMB_DOCUMENTS=Documentos\r\n\r\n#XTIT,20: List of dependents who are covered under the benefit plan  \r\nMB_DEPENDENTS=Dependientes\r\n\r\n#XTIT,20: List of individuals, organizations, or trust funds that will be eligible to receive benefits of an insurance or retirement plan\r\nMB_BENEFICIARIES=Beneficiarios\r\n\r\n#XTIT,20: List of investments done under the benefit plan  \r\nMB_INVESTMENTS=Inversiones\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan\r\nMB_PRIMARY=Primario\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan if the primary beneficiaries are deceased\r\nMB_CONTINGENT=Beneficiario sustitutorio\r\n\r\n#XFLD: No data available\r\nMB_NO_DATA=No existen datos\r\n\r\n#XFLD: No benefits data available\r\nMB_NO_BENEFITS=No hay beneficios\r\n\r\n#XFLD: No unenrolled plans\r\nMB_NO_UNENROLLED_PLAN=Sin planes no inscritos\r\n\r\n#XFLD: Plan name\r\nMB_PLAN=Plan\r\n\r\n#XFLD: Type of plan\r\nMB_PLAN_TYPE=Tipo de plan\r\n\r\n#XFLD: Status of plan\r\nMB_STATUS=Estado\r\n\r\n#XFLD,35: submit evidence of insurance before specified date \r\nMB_LABEL_EVIDENCE_INSURABILITY=Enviar prueba de asegurabilidad antes del\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_PLAN_NUMBER=N\\u00FAmero de plan\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_GROUP_NUMBER=N\\u00FAmero de grupo\r\n\r\n#XFLD,35: payroll frequency\r\nMB_PAYROLL_FREQUENCY=Frecuencia de n\\u00F3mina\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_PRE_TAX_COST=Coste por empleado sin impuestos\r\n\r\n#XFLD,35: Employee bonus pre tax cost type\r\nMB_EMP_BONUS_PRE_TAX_COST=Coste bonif.empleado sin impuestos\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_POST_TAX_COST=Coste por empleado imptos aplicados\r\n\r\n#XFLD,35: Employee bonus post tax cost type\r\nMB_EMP_BONUS_POST_TAX_COST=Coste bonif.empleado impuestos apl.\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_ADDITIONAL_POST_TAX_COST=Coste bonif.empleado impuestos apl.\r\n\r\n#XFLD,35: Imputed Income\r\nMB_Imputed_Income=Beneficio en valor monetario\r\n\r\n#XFLD,35: Employer cost type or reimbursement type\r\nMB_CREDITS=Cr\\u00E9ditos\r\n\r\n#XFLD,35: Employer cost type\r\nMB_EMPLOYER_COSTS=Coste del empresario\r\n\r\n#XFLD: Option for plan\r\nMB_PLAN_OPTION=Opci\\u00F3n de plan\r\n\r\n#XFLD: Plan year\r\nMB_PLAN_YEAR=A\\u00F1o de plan\r\n\r\n#XFLD,30: Contribution per payroll period\r\nMB_CONTRIBUTION_PER_PAY_PERIOD=Contribuci\\u00F3n\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_PRE_TAX_CONTRIBUTION=Contribuci\\u00F3n regular sin impuestos\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_POST_TAX_CONTRIBUTION=Contribuci\\u00F3n regular impuestos apl.\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_PRE_TAX_CONTRIBUTION=Contribuci\\u00F3n bonif.sin impuestos\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_POST_TAX_CONTRIBUTION=Contribuci\\u00F3n bonif.impuestos aplic.\r\n\r\n#XFLD,35: Cost type\r\nMB_CALCULATED_CREDIT=Cr\\u00E9ditos calculados\r\n\r\n#XFLD: Period in which the user is enrolled in the benefit plan\r\nMB_PARTICIPATION_PERIOD=Per\\u00EDodo de participaci\\u00F3n\r\n\r\n#XFLD,65: Roll over pre-tax to post-tax when pre-tax limit is reached\r\nMB_MESSAGE_PRE_TAX_TO_POST_TAX=Prorrogar a aplicac.impot.cuando se alcance el l\\u00EDmite sin impto.\r\n\r\n#XFLD,65: Post-tax contributions start immediately\r\nMB_START_POST_TAX_CONTRIBUTIONS=Iniciar inmediatamente las contribuciones con impuestos aplicados\r\n\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=No se ha podido obtener la lista de beneficios\r\n\r\n#YMSG: Message for detail service error\r\nDETAIL_SERVICE_ERR_MESSAGE=No se ha podido obtener el detalle de beneficio\r\n\r\n#YMSG: Message for count service error\r\nCOUNT_SERVICE_ERR_MESSAGE=No se ha podido obtener recuento total de beneficios\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=Mis beneficios\r\n',
	"hcm/emp/mybenefits/i18n/i18n_fr.properties":'\r\n#XTIT: Application name\r\nMB_APP_TITLE=Mes avantages\r\n\r\n# XFLD: Number of pending benefit plans\r\nPENDING_COUNT={0} en attente\r\n\r\n#XTIT,20: Title for benefits list\r\nMB_MASTER_TITLE=Prestations ({0})\r\n\r\n#XTIT,30: Title for benefit details\r\nMB_APP_DETAIL_TITLE=Avantage\r\n\r\n#XTIT,8: Selection date for displaying the benefit plans that the user is enrolled in \r\nMB_FOOTER_DATE_TEXT=Du\r\n\r\n#XTIT,20: Selection for fetching unenrolled data \r\nMB_SHOW_DETAILS=Afficher les d\\u00E9tails\r\n\r\n# XFLD,20: Default Placeholder for the search field in Home View\r\nMB_SEARCH_PLACEHOLDER=Recherche...\r\n\r\n#XBUT: Display the confirmation statement for the selection date in another window\r\nMB_CONFIRMATION=Afficher synth\\u00E8se\r\n\r\n#XBUT,8: Button to open menu  \r\nMB_OPEN=Ouvrir\r\n\r\n#XLST,35: List header to categorize all health-related benefits\r\nMB_LIST_HEADER_HEALTH=Sant\\u00E9\r\n\r\n#XLST,35: List header to categorize all life insurance-related benefits\r\nMB_LIST_HEADER_INSURANCE=Assurance vie\r\n\r\n#XLST,35: List header to categorize all savings-related benefits\r\nMB_LIST_HEADER_SAVINGS=Economies\r\n\r\n#XLST,35: List header to categorize all FSA-related benefits\r\nMB_LIST_HEADER_FSA=Comptes de frais variables\r\n\r\n#XLST,35: List header to categorize all stock-related benefits\r\nMB_LIST_HEADER_STOCK=Stock\r\n\r\n#XLST,35: List header to categorize all miscellaneous benefits\r\nMB_LIST_HEADER_MISC=Divers\r\n\r\n#XLST,35: List header to categorize all benefits that the user is eligible for, but not enrolled in\r\nMB_LIST_HEADER_UNENROLLED=Non affili\\u00E9\r\n\r\n#XLST,35: List header to categorize all pending benefits\r\nMB_LIST_HEADER_PENDING=En attente\r\n\r\n#XTIT,20: Title in details view to show information on the benefit plan\r\nMB_INFORMATION=Informations\r\n\r\n#XTIT,20: Title in details view to show links to benefit plan documents\r\nMB_DOCUMENTS=Documents\r\n\r\n#XTIT,20: List of dependents who are covered under the benefit plan  \r\nMB_DEPENDENTS=Personnes \\u00E0 charge\r\n\r\n#XTIT,20: List of individuals, organizations, or trust funds that will be eligible to receive benefits of an insurance or retirement plan\r\nMB_BENEFICIARIES=B\\u00E9n\\u00E9ficiaires\r\n\r\n#XTIT,20: List of investments done under the benefit plan  \r\nMB_INVESTMENTS=Placements\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan\r\nMB_PRIMARY=Principal\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan if the primary beneficiaries are deceased\r\nMB_CONTINGENT=Subsidiaire\r\n\r\n#XFLD: No data available\r\nMB_NO_DATA=Aucune donn\\u00E9e disponible\r\n\r\n#XFLD: No benefits data available\r\nMB_NO_BENEFITS=Aucun avantage\r\n\r\n#XFLD: No unenrolled plans\r\nMB_NO_UNENROLLED_PLAN=Aucun r\\u00E9gime non affili\\u00E9\r\n\r\n#XFLD: Plan name\r\nMB_PLAN=R\\u00E9gime\r\n\r\n#XFLD: Type of plan\r\nMB_PLAN_TYPE=Type  de r\\u00E9gime\r\n\r\n#XFLD: Status of plan\r\nMB_STATUS=Statut\r\n\r\n#XFLD,35: submit evidence of insurance before specified date \r\nMB_LABEL_EVIDENCE_INSURABILITY=Envoyer preuve d\'assurabilit\\u00E9 avant le\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_PLAN_NUMBER=Num\\u00E9ro de r\\u00E9gime\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_GROUP_NUMBER=Num\\u00E9ro de groupe\r\n\r\n#XFLD,35: payroll frequency\r\nMB_PAYROLL_FREQUENCY=Fr\\u00E9quence de paie\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_PRE_TAX_COST=Co\\u00FBt salari\\u00E9 avant imp\\u00F4ts\r\n\r\n#XFLD,35: Employee bonus pre tax cost type\r\nMB_EMP_BONUS_PRE_TAX_COST=Co\\u00FBt prime salari\\u00E9 avant imp\\u00F4ts\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_POST_TAX_COST=Co\\u00FBt salari\\u00E9 apr\\u00E8s imp\\u00F4ts\r\n\r\n#XFLD,35: Employee bonus post tax cost type\r\nMB_EMP_BONUS_POST_TAX_COST=Co\\u00FBt prime salari\\u00E9 apr\\u00E8s imp\\u00F4ts\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_ADDITIONAL_POST_TAX_COST=Co\\u00FBt salari\\u00E9 apr\\u00E8s imp\\u00F4ts suppl\\u00E9m.\r\n\r\n#XFLD,35: Imputed Income\r\nMB_Imputed_Income=Avantages en nature\r\n\r\n#XFLD,35: Employer cost type or reimbursement type\r\nMB_CREDITS=Cr\\u00E9dits\r\n\r\n#XFLD,35: Employer cost type\r\nMB_EMPLOYER_COSTS=Charges patronales\r\n\r\n#XFLD: Option for plan\r\nMB_PLAN_OPTION=Option du r\\u00E9gime\r\n\r\n#XFLD: Plan year\r\nMB_PLAN_YEAR=Ann\\u00E9e du r\\u00E9gime\r\n\r\n#XFLD,30: Contribution per payroll period\r\nMB_CONTRIBUTION_PER_PAY_PERIOD=Cotisation\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_PRE_TAX_CONTRIBUTION=Cotisation r\\u00E9guli\\u00E8re avant imp\\u00F4ts\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_POST_TAX_CONTRIBUTION=Cotisation r\\u00E9guli\\u00E8re apr\\u00E8s imp\\u00F4ts\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_PRE_TAX_CONTRIBUTION=Cotisation prime avant imp\\u00F4ts\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_POST_TAX_CONTRIBUTION=Cotisation prime apr\\u00E8s imp\\u00F4ts\r\n\r\n#XFLD,35: Cost type\r\nMB_CALCULATED_CREDIT=Cr\\u00E9dits calcul\\u00E9s\r\n\r\n#XFLD: Period in which the user is enrolled in the benefit plan\r\nMB_PARTICIPATION_PERIOD=P\\u00E9riode d\'affiliation\r\n\r\n#XFLD,65: Roll over pre-tax to post-tax when pre-tax limit is reached\r\nMB_MESSAGE_PRE_TAX_TO_POST_TAX=D\\u00E8s que limite "avant imp\\u00F4ts" atteinte, passage \\u00E0 "apr\\u00E8s imp\\u00F4ts"\r\n\r\n#XFLD,65: Post-tax contributions start immediately\r\nMB_START_POST_TAX_CONTRIBUTIONS=Lancer cotisations "apr\\u00E8s imp\\u00F4ts" imm\\u00E9diatement\r\n\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=Impossible d\'acc\\u00E9der \\u00E0 la liste des avantages\r\n\r\n#YMSG: Message for detail service error\r\nDETAIL_SERVICE_ERR_MESSAGE=Impossible d\'acc\\u00E9der aux d\\u00E9tails des avantages\r\n\r\n#YMSG: Message for count service error\r\nCOUNT_SERVICE_ERR_MESSAGE=Impossible d\'acc\\u00E9der \\u00E0 la synth\\u00E8se des avantages\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=Mes avantages\r\n',
	"hcm/emp/mybenefits/i18n/i18n_hu.properties":'\r\n#XTIT: Application name\r\nMB_APP_TITLE=Saj\\u00E1t juttat\\u00E1sok\r\n\r\n# XFLD: Number of pending benefit plans\r\nPENDING_COUNT={0} f\\u00FCgg\\u0151ben\r\n\r\n#XTIT,20: Title for benefits list\r\nMB_MASTER_TITLE=Juttat\\u00E1sok ({0})\r\n\r\n#XTIT,30: Title for benefit details\r\nMB_APP_DETAIL_TITLE=Juttat\\u00E1s\r\n\r\n#XTIT,8: Selection date for displaying the benefit plans that the user is enrolled in \r\nMB_FOOTER_DATE_TEXT=Ez \\u00F3ta\\:\r\n\r\n#XTIT,20: Selection for fetching unenrolled data \r\nMB_SHOW_DETAILS=R\\u00E9szletek megjel.\r\n\r\n# XFLD,20: Default Placeholder for the search field in Home View\r\nMB_SEARCH_PLACEHOLDER=Keres\\u00E9s...\r\n\r\n#XBUT: Display the confirmation statement for the selection date in another window\r\nMB_CONFIRMATION=\\u00C1ttekint\\u00E9s\r\n\r\n#XBUT,8: Button to open menu  \r\nMB_OPEN=Megnyit\r\n\r\n#XLST,35: List header to categorize all health-related benefits\r\nMB_LIST_HEADER_HEALTH=Eg\\u00E9szs\\u00E9g\r\n\r\n#XLST,35: List header to categorize all life insurance-related benefits\r\nMB_LIST_HEADER_INSURANCE=\\u00C9letbiztos\\u00EDt\\u00E1s\r\n\r\n#XLST,35: List header to categorize all savings-related benefits\r\nMB_LIST_HEADER_SAVINGS=Megtakar\\u00EDt\\u00E1sok\r\n\r\n#XLST,35: List header to categorize all FSA-related benefits\r\nMB_LIST_HEADER_FSA=El\\u0151takar\\u00E9koss\\u00E1g-terv\r\n\r\n#XLST,35: List header to categorize all stock-related benefits\r\nMB_LIST_HEADER_STOCK=R\\u00E9szv\\u00E9ny\r\n\r\n#XLST,35: List header to categorize all miscellaneous benefits\r\nMB_LIST_HEADER_MISC=Vegyes\r\n\r\n#XLST,35: List header to categorize all benefits that the user is eligible for, but not enrolled in\r\nMB_LIST_HEADER_UNENROLLED=Nincs ig\\u00E9nyelve\r\n\r\n#XLST,35: List header to categorize all pending benefits\r\nMB_LIST_HEADER_PENDING=F\\u00FCgg\\u0151ben\r\n\r\n#XTIT,20: Title in details view to show information on the benefit plan\r\nMB_INFORMATION=Inform\\u00E1ci\\u00F3k\r\n\r\n#XTIT,20: Title in details view to show links to benefit plan documents\r\nMB_DOCUMENTS=Dokumentumok\r\n\r\n#XTIT,20: List of dependents who are covered under the benefit plan  \r\nMB_DEPENDENTS=Eltartottak\r\n\r\n#XTIT,20: List of individuals, organizations, or trust funds that will be eligible to receive benefits of an insurance or retirement plan\r\nMB_BENEFICIARIES=Kedvezm\\u00E9nyezettek\r\n\r\n#XTIT,20: List of investments done under the benefit plan  \r\nMB_INVESTMENTS=Befektet\\u00E9sek\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan\r\nMB_PRIMARY=Els\\u0151dleges kedvezm\\u00E9nyezett\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan if the primary beneficiaries are deceased\r\nMB_CONTINGENT=P\\u00F3tkedvezm\\u00E9nyezett\r\n\r\n#XFLD: No data available\r\nMB_NO_DATA=Nem \\u00E1ll rendelkez\\u00E9sre adat\r\n\r\n#XFLD: No benefits data available\r\nMB_NO_BENEFITS=Nincsenek juttat\\u00E1sok\r\n\r\n#XFLD: No unenrolled plans\r\nMB_NO_UNENROLLED_PLAN=Nincs nem ig\\u00E9nyelt terv\r\n\r\n#XFLD: Plan name\r\nMB_PLAN=Terv\r\n\r\n#XFLD: Type of plan\r\nMB_PLAN_TYPE=Tervt\\u00EDpus\r\n\r\n#XFLD: Status of plan\r\nMB_STATUS=St\\u00E1tus\r\n\r\n#XFLD,35: submit evidence of insurance before specified date \r\nMB_LABEL_EVIDENCE_INSURABILITY=Biztos\\u00EDthat\\u00F3s\\u00E1gi bizony\\u00EDt\\u00E9k elk\\u00FCld\\u00E9se ez el\\u0151tt\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_PLAN_NUMBER=Terv sz\\u00E1ma\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_GROUP_NUMBER=Csoport sz\\u00E1ma\r\n\r\n#XFLD,35: payroll frequency\r\nMB_PAYROLL_FREQUENCY=B\\u00E9rsz\\u00E1mfejt\\u00E9s gyakoris\\u00E1ga\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_PRE_TAX_COST=Dolgoz\\u00F3 ad\\u00F3z\\u00E1s el\\u0151tti \\u00F6sszege\r\n\r\n#XFLD,35: Employee bonus pre tax cost type\r\nMB_EMP_BONUS_PRE_TAX_COST=Dolgoz\\u00F3i b\\u00F3nusz ad\\u00F3z\\u00E1s el\\u0151tti \\u00F6ssz.\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_POST_TAX_COST=Dolgoz\\u00F3 ad\\u00F3z\\u00E1s ut\\u00E1ni \\u00F6sszege\r\n\r\n#XFLD,35: Employee bonus post tax cost type\r\nMB_EMP_BONUS_POST_TAX_COST=Dolgoz\\u00F3i b\\u00F3nusz ad\\u00F3z\\u00E1s ut\\u00E1ni \\u00F6ssz.\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_ADDITIONAL_POST_TAX_COST=Dolgoz\\u00F3 tov\\u00E1bbi ad\\u00F3z\\u00E1s ut\\u00E1ni \\u00F6ssz.\r\n\r\n#XFLD,35: Imputed Income\r\nMB_Imputed_Income=P\\u00E9nz\\u00E9rt\\u00E9k\\u0171 juttat\\u00E1s\r\n\r\n#XFLD,35: Employer cost type or reimbursement type\r\nMB_CREDITS=Hozz\\u00E1j\\u00E1rul\\u00E1sok\r\n\r\n#XFLD,35: Employer cost type\r\nMB_EMPLOYER_COSTS=Munkaad\\u00F3i k\\u00F6lts\\u00E9g\r\n\r\n#XFLD: Option for plan\r\nMB_PLAN_OPTION=Tervopci\\u00F3\r\n\r\n#XFLD: Plan year\r\nMB_PLAN_YEAR=Terv\\u00E9v\r\n\r\n#XFLD,30: Contribution per payroll period\r\nMB_CONTRIBUTION_PER_PAY_PERIOD=Hozz\\u00E1j\\u00E1rul\\u00E1s\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_PRE_TAX_CONTRIBUTION=Rendes ad\\u00F3z\\u00E1s el\\u0151tti hozz\\u00E1j\\u00E1rul\\u00E1s\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_POST_TAX_CONTRIBUTION=Rendes ad\\u00F3z\\u00E1s ut\\u00E1ni hozz\\u00E1j\\u00E1rul\\u00E1s\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_PRE_TAX_CONTRIBUTION=B\\u00F3nusz ad\\u00F3z\\u00E1s el\\u0151tti hozz\\u00E1j\\u00E1rul\\u00E1s\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_POST_TAX_CONTRIBUTION=B\\u00F3nusz ad\\u00F3z\\u00E1s ut\\u00E1ni hozz\\u00E1j\\u00E1rul\\u00E1s\r\n\r\n#XFLD,35: Cost type\r\nMB_CALCULATED_CREDIT=Kisz\\u00E1m\\u00EDtott hozz\\u00E1j\\u00E1rul\\u00E1sok\r\n\r\n#XFLD: Period in which the user is enrolled in the benefit plan\r\nMB_PARTICIPATION_PERIOD=R\\u00E9szv\\u00E9teli peri\\u00F3dus\r\n\r\n#XFLD,65: Roll over pre-tax to post-tax when pre-tax limit is reached\r\nMB_MESSAGE_PRE_TAX_TO_POST_TAX=Prolong\\u00E1l\\u00E1s ad\\u00F3z\\u00E1s ut\\u00E1nra, ha el\\u00E9rt\\u00E9k az ad\\u00F3z\\u00E1s el\\u0151tti limitet\r\n\r\n#XFLD,65: Post-tax contributions start immediately\r\nMB_START_POST_TAX_CONTRIBUTIONS=Ad\\u00F3z\\u00E1s el\\u0151tti hozz\\u00E1j\\u00E1rul\\u00E1sok ind\\u00EDt\\u00E1sa azonnal\r\n\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=Nem siker\\u00FClt lek\\u00E9rni a juttat\\u00E1sok list\\u00E1j\\u00E1t\r\n\r\n#YMSG: Message for detail service error\r\nDETAIL_SERVICE_ERR_MESSAGE=Nem siker\\u00FClt lek\\u00E9rni a juttat\\u00E1s r\\u00E9szleteit\r\n\r\n#YMSG: Message for count service error\r\nCOUNT_SERVICE_ERR_MESSAGE=Nem siker\\u00FClt lek\\u00E9rni a juttat\\u00E1sok sz\\u00E1m\\u00E1nak \\u00F6sszegz\\u00E9s\\u00E9t\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=Saj\\u00E1t juttat\\u00E1sok\r\n',
	"hcm/emp/mybenefits/i18n/i18n_it.properties":'\r\n#XTIT: Application name\r\nMB_APP_TITLE=I miei benefit\r\n\r\n# XFLD: Number of pending benefit plans\r\nPENDING_COUNT={0} in sospeso\r\n\r\n#XTIT,20: Title for benefits list\r\nMB_MASTER_TITLE=Benefits ({0})\r\n\r\n#XTIT,30: Title for benefit details\r\nMB_APP_DETAIL_TITLE=Benefit\r\n\r\n#XTIT,8: Selection date for displaying the benefit plans that the user is enrolled in \r\nMB_FOOTER_DATE_TEXT=Dal\r\n\r\n#XTIT,20: Selection for fetching unenrolled data \r\nMB_SHOW_DETAILS=Visualizza dettagli\r\n\r\n# XFLD,20: Default Placeholder for the search field in Home View\r\nMB_SEARCH_PLACEHOLDER=Ricerca in corso...\r\n\r\n#XBUT: Display the confirmation statement for the selection date in another window\r\nMB_CONFIRMATION=Visualizza riepilogo\r\n\r\n#XBUT,8: Button to open menu  \r\nMB_OPEN=Apri\r\n\r\n#XLST,35: List header to categorize all health-related benefits\r\nMB_LIST_HEADER_HEALTH=Sanit\\u00E0\r\n\r\n#XLST,35: List header to categorize all life insurance-related benefits\r\nMB_LIST_HEADER_INSURANCE=Assicurazione sulla vita\r\n\r\n#XLST,35: List header to categorize all savings-related benefits\r\nMB_LIST_HEADER_SAVINGS=Risparmio\r\n\r\n#XLST,35: List header to categorize all FSA-related benefits\r\nMB_LIST_HEADER_FSA=Conti di risparmio\r\n\r\n#XLST,35: List header to categorize all stock-related benefits\r\nMB_LIST_HEADER_STOCK=Stock\r\n\r\n#XLST,35: List header to categorize all miscellaneous benefits\r\nMB_LIST_HEADER_MISC=Varie\r\n\r\n#XLST,35: List header to categorize all benefits that the user is eligible for, but not enrolled in\r\nMB_LIST_HEADER_UNENROLLED=Non iscritto\r\n\r\n#XLST,35: List header to categorize all pending benefits\r\nMB_LIST_HEADER_PENDING=In sospeso\r\n\r\n#XTIT,20: Title in details view to show information on the benefit plan\r\nMB_INFORMATION=Informazioni\r\n\r\n#XTIT,20: Title in details view to show links to benefit plan documents\r\nMB_DOCUMENTS=Documenti\r\n\r\n#XTIT,20: List of dependents who are covered under the benefit plan  \r\nMB_DEPENDENTS=Dipendenti\r\n\r\n#XTIT,20: List of individuals, organizations, or trust funds that will be eligible to receive benefits of an insurance or retirement plan\r\nMB_BENEFICIARIES=Beneficiari\r\n\r\n#XTIT,20: List of investments done under the benefit plan  \r\nMB_INVESTMENTS=Investimenti\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan\r\nMB_PRIMARY=Primario\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan if the primary beneficiaries are deceased\r\nMB_CONTINGENT=Contingente\r\n\r\n#XFLD: No data available\r\nMB_NO_DATA=Nessun dato disponibile\r\n\r\n#XFLD: No benefits data available\r\nMB_NO_BENEFITS=Nessun benefit\r\n\r\n#XFLD: No unenrolled plans\r\nMB_NO_UNENROLLED_PLAN=Nessun piano non iscritto\r\n\r\n#XFLD: Plan name\r\nMB_PLAN=Piano\r\n\r\n#XFLD: Type of plan\r\nMB_PLAN_TYPE=Tipo di piano\r\n\r\n#XFLD: Status of plan\r\nMB_STATUS=Stato\r\n\r\n#XFLD,35: submit evidence of insurance before specified date \r\nMB_LABEL_EVIDENCE_INSURABILITY=Invia prima certificato di assicurabilit\\u00E0\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_PLAN_NUMBER=Numero del piano\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_GROUP_NUMBER=N. gruppo\r\n\r\n#XFLD,35: payroll frequency\r\nMB_PAYROLL_FREQUENCY=Frequenza di calcolo retribuzione\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_PRE_TAX_COST=Costi dipendente - lordo imposte\r\n\r\n#XFLD,35: Employee bonus pre tax cost type\r\nMB_EMP_BONUS_PRE_TAX_COST=Bonus dipendente - lordo imposte\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_POST_TAX_COST=Costi dipendente - netto imposte\r\n\r\n#XFLD,35: Employee bonus post tax cost type\r\nMB_EMP_BONUS_POST_TAX_COST=Bonus dipendente - netto imposte\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_ADDITIONAL_POST_TAX_COST=Costi dip. suppl. - netto imposte\r\n\r\n#XFLD,35: Imputed Income\r\nMB_Imputed_Income=Beneficio economico\r\n\r\n#XFLD,35: Employer cost type or reimbursement type\r\nMB_CREDITS=Crediti\r\n\r\n#XFLD,35: Employer cost type\r\nMB_EMPLOYER_COSTS=Costi del datore di lavoro\r\n\r\n#XFLD: Option for plan\r\nMB_PLAN_OPTION=Opzione piano\r\n\r\n#XFLD: Plan year\r\nMB_PLAN_YEAR=Anno del piano\r\n\r\n#XFLD,30: Contribution per payroll period\r\nMB_CONTRIBUTION_PER_PAY_PERIOD=Contributo\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_PRE_TAX_CONTRIBUTION=Contributo regolare - lordo imposte\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_POST_TAX_CONTRIBUTION=Contributo regolare - netto imposte\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_PRE_TAX_CONTRIBUTION=Contributo bonus - lordo imposte\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_POST_TAX_CONTRIBUTION=Contributo bonus - netto imposte\r\n\r\n#XFLD,35: Cost type\r\nMB_CALCULATED_CREDIT=Crediti calcolati\r\n\r\n#XFLD: Period in which the user is enrolled in the benefit plan\r\nMB_PARTICIPATION_PERIOD=Periodo di partecipazione\r\n\r\n#XFLD,65: Roll over pre-tax to post-tax when pre-tax limit is reached\r\nMB_MESSAGE_PRE_TAX_TO_POST_TAX=Proroga a netto imposte una volta raggiunto limite lordo imposte\r\n\r\n#XFLD,65: Post-tax contributions start immediately\r\nMB_START_POST_TAX_CONTRIBUTIONS=Inizia immediatamente contributi al netto delle imposte\r\n\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=Impossibile ottenere la lista di benefit\r\n\r\n#YMSG: Message for detail service error\r\nDETAIL_SERVICE_ERR_MESSAGE=Impossibile ottenere i dettagli sui benefit\r\n\r\n#YMSG: Message for count service error\r\nCOUNT_SERVICE_ERR_MESSAGE=Impossibile ottenere il riepilogo dei benefit\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=I miei benefit\r\n',
	"hcm/emp/mybenefits/i18n/i18n_iw.properties":'\r\n#XTIT: Application name\r\nMB_APP_TITLE=\\u05D4\\u05D4\\u05D8\\u05D1\\u05D5\\u05EA \\u05E9\\u05DC\\u05D9\r\n\r\n# XFLD: Number of pending benefit plans\r\nPENDING_COUNT={0} \\u05D1\\u05D4\\u05DE\\u05EA\\u05E0\\u05D4\r\n\r\n#XTIT,20: Title for benefits list\r\nMB_MASTER_TITLE=\\u05D4\\u05D8\\u05D1\\u05D5\\u05EA ({0})\r\n\r\n#XTIT,30: Title for benefit details\r\nMB_APP_DETAIL_TITLE=\\u05D4\\u05D8\\u05D1\\u05D4\r\n\r\n#XTIT,8: Selection date for displaying the benefit plans that the user is enrolled in \r\nMB_FOOTER_DATE_TEXT=\\u05D4\\u05D7\\u05DC \\u05DE-\r\n\r\n#XTIT,20: Selection for fetching unenrolled data \r\nMB_SHOW_DETAILS=\\u05D4\\u05E6\\u05D2 \\u05E4\\u05E8\\u05D8\\u05D9\\u05DD\r\n\r\n# XFLD,20: Default Placeholder for the search field in Home View\r\nMB_SEARCH_PLACEHOLDER=\\u05DE\\u05D7\\u05E4\\u05E9...\r\n\r\n#XBUT: Display the confirmation statement for the selection date in another window\r\nMB_CONFIRMATION=\\u05D4\\u05E6\\u05D2 \\u05E1\\u05D9\\u05DB\\u05D5\\u05DD\r\n\r\n#XBUT,8: Button to open menu  \r\nMB_OPEN=\\u05E4\\u05EA\\u05D7\r\n\r\n#XLST,35: List header to categorize all health-related benefits\r\nMB_LIST_HEADER_HEALTH=\\u05D1\\u05E8\\u05D9\\u05D0\\u05D5\\u05EA\r\n\r\n#XLST,35: List header to categorize all life insurance-related benefits\r\nMB_LIST_HEADER_INSURANCE=\\u05D1\\u05D9\\u05D8\\u05D5\\u05D7 \\u05D7\\u05D9\\u05D9\\u05DD\r\n\r\n#XLST,35: List header to categorize all savings-related benefits\r\nMB_LIST_HEADER_SAVINGS=\\u05D7\\u05E1\\u05DB\\u05D5\\u05E0\\u05D5\\u05EA\r\n\r\n#XLST,35: List header to categorize all FSA-related benefits\r\nMB_LIST_HEADER_FSA=\\u05D7\\u05E9\\u05D1\\u05D5\\u05E0\\u05D5\\u05EA \\u05D4\\u05D5\\u05E6\\u05D0\\u05D5\\u05EA \\u05D2\\u05DE\\u05D9\\u05E9\\u05D9\\u05DD\r\n\r\n#XLST,35: List header to categorize all stock-related benefits\r\nMB_LIST_HEADER_STOCK=\\u05DE\\u05DC\\u05D0\\u05D9\r\n\r\n#XLST,35: List header to categorize all miscellaneous benefits\r\nMB_LIST_HEADER_MISC=\\u05E9\\u05D5\\u05E0\\u05D5\\u05EA\r\n\r\n#XLST,35: List header to categorize all benefits that the user is eligible for, but not enrolled in\r\nMB_LIST_HEADER_UNENROLLED=\\u05DC\\u05D0 \\u05E8\\u05E9\\u05D5\\u05DD\r\n\r\n#XLST,35: List header to categorize all pending benefits\r\nMB_LIST_HEADER_PENDING=\\u05D1\\u05D4\\u05DE\\u05EA\\u05E0\\u05D4\r\n\r\n#XTIT,20: Title in details view to show information on the benefit plan\r\nMB_INFORMATION=\\u05DE\\u05D9\\u05D3\\u05E2\r\n\r\n#XTIT,20: Title in details view to show links to benefit plan documents\r\nMB_DOCUMENTS=\\u05DE\\u05E1\\u05DE\\u05DB\\u05D9\\u05DD\r\n\r\n#XTIT,20: List of dependents who are covered under the benefit plan  \r\nMB_DEPENDENTS=\\u05E0\\u05EA\\u05DE\\u05DB\\u05D9\\u05DD\r\n\r\n#XTIT,20: List of individuals, organizations, or trust funds that will be eligible to receive benefits of an insurance or retirement plan\r\nMB_BENEFICIARIES=\\u05DE\\u05D5\\u05D8\\u05D1\\u05D9\\u05DD\r\n\r\n#XTIT,20: List of investments done under the benefit plan  \r\nMB_INVESTMENTS=\\u05D4\\u05E9\\u05E7\\u05E2\\u05D5\\u05EA\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan\r\nMB_PRIMARY=\\u05E8\\u05D0\\u05E9\\u05D9\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan if the primary beneficiaries are deceased\r\nMB_CONTINGENT=\\u05DE\\u05D5\\u05EA\\u05E0\\u05D4\r\n\r\n#XFLD: No data available\r\nMB_NO_DATA=\\u05D0\\u05D9\\u05DF \\u05E0\\u05EA\\u05D5\\u05E0\\u05D9\\u05DD \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD\r\n\r\n#XFLD: No benefits data available\r\nMB_NO_BENEFITS=\\u05D0\\u05D9\\u05DF \\u05D4\\u05D8\\u05D1\\u05D5\\u05EA\r\n\r\n#XFLD: No unenrolled plans\r\nMB_NO_UNENROLLED_PLAN=\\u05D0\\u05D9\\u05DF \\u05EA\\u05D5\\u05DB\\u05E0\\u05D9\\u05D5\\u05EA \\u05E9\\u05D1\\u05D5\\u05D8\\u05DC \\u05E8\\u05D9\\u05E9\\u05D5\\u05DE\\u05DF\r\n\r\n#XFLD: Plan name\r\nMB_PLAN=\\u05EA\\u05D5\\u05DB\\u05E0\\u05D9\\u05EA\r\n\r\n#XFLD: Type of plan\r\nMB_PLAN_TYPE=\\u05E1\\u05D5\\u05D2 \\u05EA\\u05D5\\u05DB\\u05E0\\u05D9\\u05EA\r\n\r\n#XFLD: Status of plan\r\nMB_STATUS=\\u05E1\\u05D8\\u05D0\\u05D8\\u05D5\\u05E1\r\n\r\n#XFLD,35: submit evidence of insurance before specified date \r\nMB_LABEL_EVIDENCE_INSURABILITY=\\u05D4\\u05D2\\u05E9 \\u05D4\\u05D5\\u05DB\\u05D7\\u05D4 \\u05DC\\u05E0\\u05D9\\u05EA\\u05E0\\u05D5\\u05EA \\u05DC\\u05D1\\u05D9\\u05D8\\u05D5\\u05D7 \\u05DC\\u05E4\\u05E0\\u05D9\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_PLAN_NUMBER=\\u05DE\\u05E1\\u05E4\\u05E8 \\u05EA\\u05D5\\u05DB\\u05E0\\u05D9\\u05EA\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_GROUP_NUMBER=\\u05DE\\u05E1\\u05E4\\u05E8 \\u05E7\\u05D1\\u05D5\\u05E6\\u05D4\r\n\r\n#XFLD,35: payroll frequency\r\nMB_PAYROLL_FREQUENCY=\\u05EA\\u05D3\\u05D9\\u05E8\\u05D5\\u05EA \\u05DE\\u05E9\\u05DB\\u05D5\\u05E8\\u05EA\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_PRE_TAX_COST=\\u05E2\\u05DC\\u05D5\\u05EA \\u05DC\\u05E4\\u05E0\\u05D9 \\u05DE\\u05E1 \\u05E9\\u05DC \\u05E2\\u05D5\\u05D1\\u05D3\r\n\r\n#XFLD,35: Employee bonus pre tax cost type\r\nMB_EMP_BONUS_PRE_TAX_COST=\\u05E2\\u05DC\\u05D5\\u05EA \\u05D1\\u05D5\\u05E0\\u05D5\\u05E1 \\u05DC\\u05E4\\u05E0\\u05D9 \\u05DE\\u05E1 \\u05E9\\u05DC \\u05E2\\u05D5\\u05D1\\u05D3\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_POST_TAX_COST=\\u05E2\\u05DC\\u05D5\\u05EA \\u05D0\\u05D7\\u05E8\\u05D9 \\u05DE\\u05E1 \\u05E9\\u05DC \\u05E2\\u05D5\\u05D1\\u05D3\r\n\r\n#XFLD,35: Employee bonus post tax cost type\r\nMB_EMP_BONUS_POST_TAX_COST=\\u05E2\\u05DC\\u05D5\\u05EA \\u05D1\\u05D5\\u05E0\\u05D5\\u05E1 \\u05D0\\u05D7\\u05E8\\u05D9 \\u05DE\\u05E1 \\u05E9\\u05DC \\u05E2\\u05D5\\u05D1\\u05D3\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_ADDITIONAL_POST_TAX_COST=\\u05E2\\u05DC\\u05D5\\u05EA \\u05E0\\u05D5\\u05E1\\u05E4\\u05EA \\u05D0\\u05D7\\u05E8\\u05D9 \\u05DE\\u05E1 \\u05E9\\u05DC \\u05E2\\u05D5\\u05D1\\u05D3\r\n\r\n#XFLD,35: Imputed Income\r\nMB_Imputed_Income=\\u05D4\\u05DB\\u05E0\\u05E1\\u05D4 \\u05E9\\u05E0\\u05D6\\u05E7\\u05E4\\u05D4\r\n\r\n#XFLD,35: Employer cost type or reimbursement type\r\nMB_CREDITS=\\u05E0\\u05E7\\u05D5\\u05D3\\u05D5\\u05EA \\u05D6\\u05DB\\u05D5\\u05EA\r\n\r\n#XFLD,35: Employer cost type\r\nMB_EMPLOYER_COSTS=\\u05E2\\u05DC\\u05D5\\u05EA \\u05D4\\u05DE\\u05E2\\u05E1\\u05D9\\u05E7\r\n\r\n#XFLD: Option for plan\r\nMB_PLAN_OPTION=\\u05D0\\u05E4\\u05E9\\u05E8\\u05D5\\u05EA \\u05EA\\u05D5\\u05DB\\u05E0\\u05D9\\u05EA\r\n\r\n#XFLD: Plan year\r\nMB_PLAN_YEAR=\\u05E9\\u05E0\\u05EA \\u05EA\\u05D5\\u05DB\\u05E0\\u05D9\\u05EA\r\n\r\n#XFLD,30: Contribution per payroll period\r\nMB_CONTRIBUTION_PER_PAY_PERIOD=\\u05D4\\u05E4\\u05E8\\u05E9\\u05D4\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_PRE_TAX_CONTRIBUTION=\\u05D4\\u05E4\\u05E8\\u05E9\\u05D4 \\u05E8\\u05D2\\u05D9\\u05DC\\u05D4 \\u05DC\\u05E4\\u05E0\\u05D9 \\u05DE\\u05E1\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_POST_TAX_CONTRIBUTION=\\u05D4\\u05E4\\u05E8\\u05E9\\u05D4 \\u05E8\\u05D2\\u05D9\\u05DC\\u05D4 \\u05D0\\u05D7\\u05E8\\u05D9 \\u05DE\\u05E1\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_PRE_TAX_CONTRIBUTION=\\u05D4\\u05E4\\u05E8\\u05E9\\u05EA \\u05D1\\u05D5\\u05E0\\u05D5\\u05E1 \\u05DC\\u05E4\\u05E0\\u05D9 \\u05DE\\u05E1\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_POST_TAX_CONTRIBUTION=\\u05D4\\u05E4\\u05E8\\u05E9\\u05EA \\u05D1\\u05D5\\u05E0\\u05D5\\u05E1 \\u05D0\\u05D7\\u05E8\\u05D9 \\u05DE\\u05E1\r\n\r\n#XFLD,35: Cost type\r\nMB_CALCULATED_CREDIT=\\u05E0\\u05E7\\u05D5\\u05D3\\u05D5\\u05EA \\u05D6\\u05DB\\u05D5\\u05EA \\u05E9\\u05D7\\u05D5\\u05E9\\u05D1\\u05D5\r\n\r\n#XFLD: Period in which the user is enrolled in the benefit plan\r\nMB_PARTICIPATION_PERIOD=\\u05EA\\u05E7\\u05D5\\u05E4\\u05EA \\u05D4\\u05E9\\u05EA\\u05EA\\u05E4\\u05D5\\u05EA\r\n\r\n#XFLD,65: Roll over pre-tax to post-tax when pre-tax limit is reached\r\nMB_MESSAGE_PRE_TAX_TO_POST_TAX=\\u05E2\\u05D1\\u05D5\\u05E8 \\u05DC\\u05DE\\u05E6\\u05D1 \\u05D0\\u05D7\\u05E8\\u05D9 \\u05DE\\u05E1 \\u05DB\\u05D0\\u05E9\\u05E8 \\u05DE\\u05D2\\u05D9\\u05E2\\u05D9\\u05DD \\u05DC\\u05D2\\u05D1\\u05D5\\u05DC \\u05E9\\u05DC \\u05DE\\u05E6\\u05D1 \\u05DC\\u05E4\\u05E0\\u05D9 \\u05DE\\u05E1\r\n\r\n#XFLD,65: Post-tax contributions start immediately\r\nMB_START_POST_TAX_CONTRIBUTIONS=\\u05D4\\u05EA\\u05D7\\u05DC \\u05D4\\u05E4\\u05E8\\u05E9\\u05D5\\u05EA \\u05DC\\u05D0\\u05D7\\u05E8 \\u05DE\\u05E1 \\u05D1\\u05D0\\u05D5\\u05E4\\u05DF \\u05DE\\u05D9\\u05D9\\u05D3\\u05D9\r\n\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=\\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05D4\\u05D9\\u05D4 \\u05DC\\u05D4\\u05E9\\u05D9\\u05D2 \\u05D0\\u05EA \\u05E8\\u05E9\\u05D9\\u05DE\\u05EA \\u05D4\\u05D4\\u05D8\\u05D1\\u05D5\\u05EA\r\n\r\n#YMSG: Message for detail service error\r\nDETAIL_SERVICE_ERR_MESSAGE=\\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05D4\\u05D9\\u05D4 \\u05DC\\u05D4\\u05E9\\u05D9\\u05D2 \\u05D0\\u05EA \\u05E4\\u05D9\\u05E8\\u05D5\\u05D8 \\u05D4\\u05D4\\u05D8\\u05D1\\u05D4\r\n\r\n#YMSG: Message for count service error\r\nCOUNT_SERVICE_ERR_MESSAGE=\\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05D4\\u05D9\\u05D4 \\u05DC\\u05D4\\u05E9\\u05D9\\u05D2 \\u05D0\\u05EA \\u05E1\\u05D9\\u05DB\\u05D5\\u05DD \\u05E1\\u05E4\\u05D9\\u05E8\\u05EA \\u05D4\\u05D4\\u05D8\\u05D1\\u05D5\\u05EA\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=\\u05D4\\u05D4\\u05D8\\u05D1\\u05D5\\u05EA \\u05E9\\u05DC\\u05D9\r\n',
	"hcm/emp/mybenefits/i18n/i18n_ja.properties":'\r\n#XTIT: Application name\r\nMB_APP_TITLE=\\u798F\\u5229\\u539A\\u751F\r\n\r\n# XFLD: Number of pending benefit plans\r\nPENDING_COUNT=\\u4FDD\\u7559 {0} \\u4EF6\r\n\r\n#XTIT,20: Title for benefits list\r\nMB_MASTER_TITLE=\\u798F\\u5229\\u539A\\u751F ({0})\r\n\r\n#XTIT,30: Title for benefit details\r\nMB_APP_DETAIL_TITLE=\\u798F\\u5229\\u539A\\u751F\r\n\r\n#XTIT,8: Selection date for displaying the benefit plans that the user is enrolled in \r\nMB_FOOTER_DATE_TEXT=\\u65E5\\u4ED8\\u6307\\u5B9A\r\n\r\n#XTIT,20: Selection for fetching unenrolled data \r\nMB_SHOW_DETAILS=\\u8A73\\u7D30\\u8868\\u793A\r\n\r\n# XFLD,20: Default Placeholder for the search field in Home View\r\nMB_SEARCH_PLACEHOLDER=\\u691C\\u7D22\\u4E2D...\r\n\r\n#XBUT: Display the confirmation statement for the selection date in another window\r\nMB_CONFIRMATION=\\u30B5\\u30DE\\u30EA\\u8868\\u793A\r\n\r\n#XBUT,8: Button to open menu  \r\nMB_OPEN=\\u958B\\u304F\r\n\r\n#XLST,35: List header to categorize all health-related benefits\r\nMB_LIST_HEADER_HEALTH=\\u5065\\u5EB7\\u7BA1\\u7406\r\n\r\n#XLST,35: List header to categorize all life insurance-related benefits\r\nMB_LIST_HEADER_INSURANCE=\\u751F\\u547D\\u4FDD\\u967A\r\n\r\n#XLST,35: List header to categorize all savings-related benefits\r\nMB_LIST_HEADER_SAVINGS=\\u8CAF\\u84C4\r\n\r\n#XLST,35: List header to categorize all FSA-related benefits\r\nMB_LIST_HEADER_FSA=\\u30D5\\u30EC\\u30AD\\u30B7\\u30D6\\u30EB\\u652F\\u6255\\u52D8\\u5B9A\r\n\r\n#XLST,35: List header to categorize all stock-related benefits\r\nMB_LIST_HEADER_STOCK=\\u682A\\u5F0F\r\n\r\n#XLST,35: List header to categorize all miscellaneous benefits\r\nMB_LIST_HEADER_MISC=\\u305D\\u306E\\u4ED6\r\n\r\n#XLST,35: List header to categorize all benefits that the user is eligible for, but not enrolled in\r\nMB_LIST_HEADER_UNENROLLED=\\u672A\\u52A0\\u5165\r\n\r\n#XLST,35: List header to categorize all pending benefits\r\nMB_LIST_HEADER_PENDING=\\u4FDD\\u7559\r\n\r\n#XTIT,20: Title in details view to show information on the benefit plan\r\nMB_INFORMATION=\\u60C5\\u5831\r\n\r\n#XTIT,20: Title in details view to show links to benefit plan documents\r\nMB_DOCUMENTS=\\u6587\\u66F8\r\n\r\n#XTIT,20: List of dependents who are covered under the benefit plan  \r\nMB_DEPENDENTS=\\u88AB\\u6276\\u990A\\u8005\r\n\r\n#XTIT,20: List of individuals, organizations, or trust funds that will be eligible to receive benefits of an insurance or retirement plan\r\nMB_BENEFICIARIES=\\u53D7\\u7D66\\u8005\r\n\r\n#XTIT,20: List of investments done under the benefit plan  \r\nMB_INVESTMENTS=\\u6295\\u8CC7\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan\r\nMB_PRIMARY=\\u7B2C\\u4E00\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan if the primary beneficiaries are deceased\r\nMB_CONTINGENT=\\u7B2C\\u4E8C\r\n\r\n#XFLD: No data available\r\nMB_NO_DATA=\\u5229\\u7528\\u53EF\\u80FD\\u30C7\\u30FC\\u30BF\\u306A\\u3057\r\n\r\n#XFLD: No benefits data available\r\nMB_NO_BENEFITS=\\u798F\\u5229\\u306A\\u3057\r\n\r\n#XFLD: No unenrolled plans\r\nMB_NO_UNENROLLED_PLAN=\\u672A\\u52A0\\u5165\\u30D7\\u30E9\\u30F3\\u306A\\u3057\r\n\r\n#XFLD: Plan name\r\nMB_PLAN=\\u30D7\\u30E9\\u30F3\r\n\r\n#XFLD: Type of plan\r\nMB_PLAN_TYPE=\\u30D7\\u30E9\\u30F3\\u30BF\\u30A4\\u30D7\r\n\r\n#XFLD: Status of plan\r\nMB_STATUS=\\u30B9\\u30C6\\u30FC\\u30BF\\u30B9\r\n\r\n#XFLD,35: submit evidence of insurance before specified date \r\nMB_LABEL_EVIDENCE_INSURABILITY=\\u6307\\u5B9A\\u65E5\\u4ED8\\u3088\\u308A\\u524D\\u306E\\u88AB\\u4FDD\\u967A\\u8005\\u306E\\u8A3C\\u660E\\u9001\\u4FE1\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_PLAN_NUMBER=\\u30D7\\u30E9\\u30F3\\u756A\\u53F7\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_GROUP_NUMBER=\\u30B0\\u30EB\\u30FC\\u30D7\\u756A\\u53F7\r\n\r\n#XFLD,35: payroll frequency\r\nMB_PAYROLL_FREQUENCY=\\u7D66\\u4E0E\\u8A08\\u7B97\\u983B\\u5EA6\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_PRE_TAX_COST=\\u5F93\\u696D\\u54E1\\u7A0E\\u5F15\\u304D\\u524D\\u30B3\\u30B9\\u30C8\r\n\r\n#XFLD,35: Employee bonus pre tax cost type\r\nMB_EMP_BONUS_PRE_TAX_COST=\\u5F93\\u696D\\u54E1\\u30DC\\u30FC\\u30CA\\u30B9\\u7A0E\\u5F15\\u304D\\u524D\\u30B3\\u30B9\\u30C8\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_POST_TAX_COST=\\u5F93\\u696D\\u54E1\\u7A0E\\u5F15\\u304D\\u5F8C\\u30B3\\u30B9\\u30C8\r\n\r\n#XFLD,35: Employee bonus post tax cost type\r\nMB_EMP_BONUS_POST_TAX_COST=\\u5F93\\u696D\\u54E1\\u30DC\\u30FC\\u30CA\\u30B9\\u7A0E\\u5F15\\u304D\\u5F8C\\u30B3\\u30B9\\u30C8\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_ADDITIONAL_POST_TAX_COST=\\u5F93\\u696D\\u54E1\\u8FFD\\u52A0\\u7A0E\\u5F15\\u304D\\u5F8C\\u30B3\\u30B9\\u30C8\r\n\r\n#XFLD,35: Imputed Income\r\nMB_Imputed_Income=\\u5E30\\u5C5E\\u6240\\u5F97\r\n\r\n#XFLD,35: Employer cost type or reimbursement type\r\nMB_CREDITS=\\u30AF\\u30EC\\u30B8\\u30C3\\u30C8\r\n\r\n#XFLD,35: Employer cost type\r\nMB_EMPLOYER_COSTS=\\u4F1A\\u793E\\u30B3\\u30B9\\u30C8\r\n\r\n#XFLD: Option for plan\r\nMB_PLAN_OPTION=\\u30D7\\u30E9\\u30F3\\u30AA\\u30D7\\u30B7\\u30E7\\u30F3\r\n\r\n#XFLD: Plan year\r\nMB_PLAN_YEAR=\\u30D7\\u30E9\\u30F3\\u5E74\\u5EA6\r\n\r\n#XFLD,30: Contribution per payroll period\r\nMB_CONTRIBUTION_PER_PAY_PERIOD=\\u8CA0\\u62C5\\u91D1\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_PRE_TAX_CONTRIBUTION=\\u901A\\u5E38\\u7A0E\\u5F15\\u304D\\u524D\\u8CA0\\u62C5\\u91D1\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_POST_TAX_CONTRIBUTION=\\u901A\\u5E38\\u7A0E\\u5F15\\u304D\\u5F8C\\u8CA0\\u62C5\\u91D1\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_PRE_TAX_CONTRIBUTION=\\u30DC\\u30FC\\u30CA\\u30B9\\u7A0E\\u5F15\\u304D\\u524D\\u8CA0\\u62C5\\u91D1\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_POST_TAX_CONTRIBUTION=\\u30DC\\u30FC\\u30CA\\u30B9\\u7A0E\\u5F15\\u304D\\u5F8C\\u8CA0\\u62C5\\u91D1\r\n\r\n#XFLD,35: Cost type\r\nMB_CALCULATED_CREDIT=\\u8A08\\u7B97\\u6E08\\u30AF\\u30EC\\u30B8\\u30C3\\u30C8\r\n\r\n#XFLD: Period in which the user is enrolled in the benefit plan\r\nMB_PARTICIPATION_PERIOD=\\u52A0\\u5165\\u671F\\u9593\r\n\r\n#XFLD,65: Roll over pre-tax to post-tax when pre-tax limit is reached\r\nMB_MESSAGE_PRE_TAX_TO_POST_TAX=\\u7A0E\\u5F15\\u304D\\u524D\\u9650\\u5EA6\\u306B\\u9054\\u3057\\u305F\\u969B\\u306F\\u7A0E\\u5F15\\u304D\\u5F8C\\u306B\\u30ED\\u30FC\\u30EB\\u30AA\\u30FC\\u30D0\\u30FC\r\n\r\n#XFLD,65: Post-tax contributions start immediately\r\nMB_START_POST_TAX_CONTRIBUTIONS=\\u7A0E\\u5F15\\u304D\\u5F8C\\u8CA0\\u62C5\\u91D1\\u306E\\u5373\\u6642\\u958B\\u59CB\r\n\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=\\u798F\\u5229\\u4E00\\u89A7\\u3092\\u53D6\\u5F97\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n\r\n#YMSG: Message for detail service error\r\nDETAIL_SERVICE_ERR_MESSAGE=\\u798F\\u5229\\u8A73\\u7D30\\u3092\\u53D6\\u5F97\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n\r\n#YMSG: Message for count service error\r\nCOUNT_SERVICE_ERR_MESSAGE=\\u798F\\u5229\\u30AB\\u30A6\\u30F3\\u30C8\\u30B5\\u30DE\\u30EA\\u3092\\u53D6\\u5F97\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=\\u798F\\u5229\\u539A\\u751F\r\n',
	"hcm/emp/mybenefits/i18n/i18n_no.properties":'\r\n#XTIT: Application name\r\nMB_APP_TITLE=Mine arbeidsgiverytelser\r\n\r\n# XFLD: Number of pending benefit plans\r\nPENDING_COUNT={0} Forest\\u00E5ende\r\n\r\n#XTIT,20: Title for benefits list\r\nMB_MASTER_TITLE=Arbeidsgiverytelser ({0})\r\n\r\n#XTIT,30: Title for benefit details\r\nMB_APP_DETAIL_TITLE=Arbeidsgiverytelse\r\n\r\n#XTIT,8: Selection date for displaying the benefit plans that the user is enrolled in \r\nMB_FOOTER_DATE_TEXT=FraOgMed\r\n\r\n#XTIT,20: Selection for fetching unenrolled data \r\nMB_SHOW_DETAILS=Vis detaljer\r\n\r\n# XFLD,20: Default Placeholder for the search field in Home View\r\nMB_SEARCH_PLACEHOLDER=S\\u00F8ker...\r\n\r\n#XBUT: Display the confirmation statement for the selection date in another window\r\nMB_CONFIRMATION=Oversikt\r\n\r\n#XBUT,8: Button to open menu  \r\nMB_OPEN=\\u00C5pen\r\n\r\n#XLST,35: List header to categorize all health-related benefits\r\nMB_LIST_HEADER_HEALTH=Helse\r\n\r\n#XLST,35: List header to categorize all life insurance-related benefits\r\nMB_LIST_HEADER_INSURANCE=Livsforsikring\r\n\r\n#XLST,35: List header to categorize all savings-related benefits\r\nMB_LIST_HEADER_SAVINGS=Bedriftssparing\r\n\r\n#XLST,35: List header to categorize all FSA-related benefits\r\nMB_LIST_HEADER_FSA=Spareavtalekontoer\r\n\r\n#XLST,35: List header to categorize all stock-related benefits\r\nMB_LIST_HEADER_STOCK=Aksje\r\n\r\n#XLST,35: List header to categorize all miscellaneous benefits\r\nMB_LIST_HEADER_MISC=Diverse\r\n\r\n#XLST,35: List header to categorize all benefits that the user is eligible for, but not enrolled in\r\nMB_LIST_HEADER_UNENROLLED=Ikke innmeldt\r\n\r\n#XLST,35: List header to categorize all pending benefits\r\nMB_LIST_HEADER_PENDING=Forest\\u00E5ende\r\n\r\n#XTIT,20: Title in details view to show information on the benefit plan\r\nMB_INFORMATION=Informasjon\r\n\r\n#XTIT,20: Title in details view to show links to benefit plan documents\r\nMB_DOCUMENTS=Dokumenter\r\n\r\n#XTIT,20: List of dependents who are covered under the benefit plan  \r\nMB_DEPENDENTS=Medforsikrede\r\n\r\n#XTIT,20: List of individuals, organizations, or trust funds that will be eligible to receive benefits of an insurance or retirement plan\r\nMB_BENEFICIARIES=Begunstigede\r\n\r\n#XTIT,20: List of investments done under the benefit plan  \r\nMB_INVESTMENTS=Investeringer\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan\r\nMB_PRIMARY=Prim\\u00E6r begunstiget\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan if the primary beneficiaries are deceased\r\nMB_CONTINGENT=Alternativ begunstiget\r\n\r\n#XFLD: No data available\r\nMB_NO_DATA=Ingen tilgjengelige data\r\n\r\n#XFLD: No benefits data available\r\nMB_NO_BENEFITS=Ingen arbeidsgiverytelser\r\n\r\n#XFLD: No unenrolled plans\r\nMB_NO_UNENROLLED_PLAN=Ingen ikke-innmeldte planer\r\n\r\n#XFLD: Plan name\r\nMB_PLAN=Plan\r\n\r\n#XFLD: Type of plan\r\nMB_PLAN_TYPE=Plantype\r\n\r\n#XFLD: Status of plan\r\nMB_STATUS=Status\r\n\r\n#XFLD,35: submit evidence of insurance before specified date \r\nMB_LABEL_EVIDENCE_INSURABILITY=Send bevis p\\u00E5 forsikringsmulighet f\\u00F8r\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_PLAN_NUMBER=Plannummer\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_GROUP_NUMBER=Gruppenummer\r\n\r\n#XFLD,35: payroll frequency\r\nMB_PAYROLL_FREQUENCY=L\\u00F8nnsavregningsfrekvens\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_PRE_TAX_COST=Arbeidstakerutgift - brutto\r\n\r\n#XFLD,35: Employee bonus pre tax cost type\r\nMB_EMP_BONUS_PRE_TAX_COST=Arbeidstakerbonus - brutto\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_POST_TAX_COST=Arbeidstakerutgift - netto\r\n\r\n#XFLD,35: Employee bonus post tax cost type\r\nMB_EMP_BONUS_POST_TAX_COST=Arbeidstakerbonus - netto\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_ADDITIONAL_POST_TAX_COST=Ytterl. arbeidstakerutgift - netto\r\n\r\n#XFLD,35: Imputed Income\r\nMB_Imputed_Income=Frynsegoder\r\n\r\n#XFLD,35: Employer cost type or reimbursement type\r\nMB_CREDITS=Tilskudd\r\n\r\n#XFLD,35: Employer cost type\r\nMB_EMPLOYER_COSTS=Arbeidsgiverkostnader\r\n\r\n#XFLD: Option for plan\r\nMB_PLAN_OPTION=Planalternativ\r\n\r\n#XFLD: Plan year\r\nMB_PLAN_YEAR=Plan\\u00E5r\r\n\r\n#XFLD,30: Contribution per payroll period\r\nMB_CONTRIBUTION_PER_PAY_PERIOD=Bidrag\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_PRE_TAX_CONTRIBUTION=Bidrag - brutto ordin\\u00E6rt\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_POST_TAX_CONTRIBUTION=Bidrag - netto ordin\\u00E6rt\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_PRE_TAX_CONTRIBUTION=Bidrag - brutto bonus\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_POST_TAX_CONTRIBUTION=Bidrag - netto bonus\r\n\r\n#XFLD,35: Cost type\r\nMB_CALCULATED_CREDIT=Beregnede tilskudd\r\n\r\n#XFLD: Period in which the user is enrolled in the benefit plan\r\nMB_PARTICIPATION_PERIOD=Deltakelsesperiode\r\n\r\n#XFLD,65: Roll over pre-tax to post-tax when pre-tax limit is reached\r\nMB_MESSAGE_PRE_TAX_TO_POST_TAX=Bytt til netto n\\u00E5r grensen for brutto er n\\u00E5dd\r\n\r\n#XFLD,65: Post-tax contributions start immediately\r\nMB_START_POST_TAX_CONTRIBUTIONS=Start netto bidrag direkte\r\n\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=Kan ikke hente liste over ytelser\r\n\r\n#YMSG: Message for detail service error\r\nDETAIL_SERVICE_ERR_MESSAGE=Kan ikke hente ytelsesdetaljer\r\n\r\n#YMSG: Message for count service error\r\nCOUNT_SERVICE_ERR_MESSAGE=Kan ikke hente ytelsesoversikt\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=Mine arbeidsgiverytelser\r\n',
	"hcm/emp/mybenefits/i18n/i18n_pl.properties":'\r\n#XTIT: Application name\r\nMB_APP_TITLE=Moje \\u015Bwiadczenia dodatkowe\r\n\r\n# XFLD: Number of pending benefit plans\r\nPENDING_COUNT=Oczekuje {0}\r\n\r\n#XTIT,20: Title for benefits list\r\nMB_MASTER_TITLE=\\u015Awiadczenia dodatkowe ({0})\r\n\r\n#XTIT,30: Title for benefit details\r\nMB_APP_DETAIL_TITLE=\\u015Awiadczenie dodatkowe\r\n\r\n#XTIT,8: Selection date for displaying the benefit plans that the user is enrolled in \r\nMB_FOOTER_DATE_TEXT=Na dzie\\u0144\r\n\r\n#XTIT,20: Selection for fetching unenrolled data \r\nMB_SHOW_DETAILS=Poka\\u017C szczeg\\u00F3\\u0142y\r\n\r\n# XFLD,20: Default Placeholder for the search field in Home View\r\nMB_SEARCH_PLACEHOLDER=Wyszukiwanie...\r\n\r\n#XBUT: Display the confirmation statement for the selection date in another window\r\nMB_CONFIRMATION=Poka\\u017C podsumowanie\r\n\r\n#XBUT,8: Button to open menu  \r\nMB_OPEN=Otw\\u00F3rz\r\n\r\n#XLST,35: List header to categorize all health-related benefits\r\nMB_LIST_HEADER_HEALTH=Zdrowie\r\n\r\n#XLST,35: List header to categorize all life insurance-related benefits\r\nMB_LIST_HEADER_INSURANCE=Ubezpieczenie na \\u017Cycie\r\n\r\n#XLST,35: List header to categorize all savings-related benefits\r\nMB_LIST_HEADER_SAVINGS=Oszcz\\u0119dno\\u015Bci\r\n\r\n#XLST,35: List header to categorize all FSA-related benefits\r\nMB_LIST_HEADER_FSA=Plan osz\\u0119dzania\r\n\r\n#XLST,35: List header to categorize all stock-related benefits\r\nMB_LIST_HEADER_STOCK=Akcje\r\n\r\n#XLST,35: List header to categorize all miscellaneous benefits\r\nMB_LIST_HEADER_MISC=R\\u00F3\\u017Cne\r\n\r\n#XLST,35: List header to categorize all benefits that the user is eligible for, but not enrolled in\r\nMB_LIST_HEADER_UNENROLLED=Niezarejestrowany\r\n\r\n#XLST,35: List header to categorize all pending benefits\r\nMB_LIST_HEADER_PENDING=Oczekuj\\u0105ce\r\n\r\n#XTIT,20: Title in details view to show information on the benefit plan\r\nMB_INFORMATION=Informacje\r\n\r\n#XTIT,20: Title in details view to show links to benefit plan documents\r\nMB_DOCUMENTS=Dokumenty\r\n\r\n#XTIT,20: List of dependents who are covered under the benefit plan  \r\nMB_DEPENDENTS=Osoby wsp\\u00F3\\u0142ubezp.\r\n\r\n#XTIT,20: List of individuals, organizations, or trust funds that will be eligible to receive benefits of an insurance or retirement plan\r\nMB_BENEFICIARIES=Beneficjenci\r\n\r\n#XTIT,20: List of investments done under the benefit plan  \r\nMB_INVESTMENTS=Inwestycje\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan\r\nMB_PRIMARY=G\\u0142\\u00F3wny beneficjent\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan if the primary beneficiaries are deceased\r\nMB_CONTINGENT=Beneficjent zast\\u0119pczy\r\n\r\n#XFLD: No data available\r\nMB_NO_DATA=Brak danych\r\n\r\n#XFLD: No benefits data available\r\nMB_NO_BENEFITS=Brak \\u015Bwiadcze\\u0144 dodatkowych\r\n\r\n#XFLD: No unenrolled plans\r\nMB_NO_UNENROLLED_PLAN=Brak niezarejestrowanych plan\\u00F3w\r\n\r\n#XFLD: Plan name\r\nMB_PLAN=Plan\r\n\r\n#XFLD: Type of plan\r\nMB_PLAN_TYPE=Typ planu\r\n\r\n#XFLD: Status of plan\r\nMB_STATUS=Status\r\n\r\n#XFLD,35: submit evidence of insurance before specified date \r\nMB_LABEL_EVIDENCE_INSURABILITY=Prze\\u015Blij dow\\u00F3d zdolno\\u015Bci ubezpieczeniowej przed\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_PLAN_NUMBER=Numer planu\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_GROUP_NUMBER=Numer grupy\r\n\r\n#XFLD,35: payroll frequency\r\nMB_PAYROLL_FREQUENCY=Cz\\u0119stotliwo\\u015B\\u0107 rozlicz. listy p\\u0142ac\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_PRE_TAX_COST=Koszt pracodawcy przed opodatk.\r\n\r\n#XFLD,35: Employee bonus pre tax cost type\r\nMB_EMP_BONUS_PRE_TAX_COST=Koszt prac. przed opodatk. - premia\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_POST_TAX_COST=Koszt pracodawcy po opodatkowaniu\r\n\r\n#XFLD,35: Employee bonus post tax cost type\r\nMB_EMP_BONUS_POST_TAX_COST=Koszt pracod. po opodatk. - premia\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_ADDITIONAL_POST_TAX_COST=Dodatk. koszty pracod. po opodatk.\r\n\r\n#XFLD,35: Imputed Income\r\nMB_Imputed_Income=Doch\\u00F3d kalkulacyjny\r\n\r\n#XFLD,35: Employer cost type or reimbursement type\r\nMB_CREDITS=Uznania\r\n\r\n#XFLD,35: Employer cost type\r\nMB_EMPLOYER_COSTS=Koszt pracodawcy\r\n\r\n#XFLD: Option for plan\r\nMB_PLAN_OPTION=Opcja planu\r\n\r\n#XFLD: Plan year\r\nMB_PLAN_YEAR=Rok planu\r\n\r\n#XFLD,30: Contribution per payroll period\r\nMB_CONTRIBUTION_PER_PAY_PERIOD=Sk\\u0142adka\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_PRE_TAX_CONTRIBUTION=Regularna sk\\u0142adka przed opodatkow.\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_POST_TAX_CONTRIBUTION=Regularna sk\\u0142adka po opodatkowaniu\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_PRE_TAX_CONTRIBUTION=Sk\\u0142adka przed opodatk. - premia\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_POST_TAX_CONTRIBUTION=Sk\\u0142adka po opodatkowaniu - premia\r\n\r\n#XFLD,35: Cost type\r\nMB_CALCULATED_CREDIT=Skalkulowane uznania\r\n\r\n#XFLD: Period in which the user is enrolled in the benefit plan\r\nMB_PARTICIPATION_PERIOD=Okres uczestnictwa\r\n\r\n#XFLD,65: Roll over pre-tax to post-tax when pre-tax limit is reached\r\nMB_MESSAGE_PRE_TAX_TO_POST_TAX=Aneksuj do po opodatkowaniu, gdy osi\\u0105gni\\u0119to limit przed opodatk.\r\n\r\n#XFLD,65: Post-tax contributions start immediately\r\nMB_START_POST_TAX_CONTRIBUTIONS=Rozpocznij sk\\u0142adki po opodatkowaniu natychmiast\r\n\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=Nie mo\\u017Cna by\\u0142o uzyska\\u0107 listy \\u015Bwiadcze\\u0144 dodatkowych\r\n\r\n#YMSG: Message for detail service error\r\nDETAIL_SERVICE_ERR_MESSAGE=Nie mo\\u017Cna by\\u0142o uzyska\\u0107 szczeg\\u00F3\\u0142\\u00F3w \\u015Bwiadczenia dodatkowego\r\n\r\n#YMSG: Message for count service error\r\nCOUNT_SERVICE_ERR_MESSAGE=Nie mo\\u017Cna by\\u0142o uzyska\\u0107 podsumowania liczby \\u015Bwiadcze\\u0144 dodatkowych\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=Moje \\u015Bwiadczenia dodatkowe\r\n',
	"hcm/emp/mybenefits/i18n/i18n_pt.properties":'\r\n#XTIT: Application name\r\nMB_APP_TITLE=Meus benef\\u00EDcios\r\n\r\n# XFLD: Number of pending benefit plans\r\nPENDING_COUNT={0} pendentes\r\n\r\n#XTIT,20: Title for benefits list\r\nMB_MASTER_TITLE=Benef\\u00EDcios ({0})\r\n\r\n#XTIT,30: Title for benefit details\r\nMB_APP_DETAIL_TITLE=Benef\\u00EDcio\r\n\r\n#XTIT,8: Selection date for displaying the benefit plans that the user is enrolled in \r\nMB_FOOTER_DATE_TEXT=De\r\n\r\n#XTIT,20: Selection for fetching unenrolled data \r\nMB_SHOW_DETAILS=Exibir detalhes\r\n\r\n# XFLD,20: Default Placeholder for the search field in Home View\r\nMB_SEARCH_PLACEHOLDER=Procurando...\r\n\r\n#XBUT: Display the confirmation statement for the selection date in another window\r\nMB_CONFIRMATION=Vis\\u00E3o geral\r\n\r\n#XBUT,8: Button to open menu  \r\nMB_OPEN=Pendente\r\n\r\n#XLST,35: List header to categorize all health-related benefits\r\nMB_LIST_HEADER_HEALTH=Sa\\u00FAde\r\n\r\n#XLST,35: List header to categorize all life insurance-related benefits\r\nMB_LIST_HEADER_INSURANCE=Seguro de vida\r\n\r\n#XLST,35: List header to categorize all savings-related benefits\r\nMB_LIST_HEADER_SAVINGS=Forma\\u00E7\\u00E3o de capital\r\n\r\n#XLST,35: List header to categorize all FSA-related benefits\r\nMB_LIST_HEADER_FSA=Conta poupan\\u00E7a-reforma\r\n\r\n#XLST,35: List header to categorize all stock-related benefits\r\nMB_LIST_HEADER_STOCK=Estoque\r\n\r\n#XLST,35: List header to categorize all miscellaneous benefits\r\nMB_LIST_HEADER_MISC=Diversos\r\n\r\n#XLST,35: List header to categorize all benefits that the user is eligible for, but not enrolled in\r\nMB_LIST_HEADER_UNENROLLED=N\\u00E3o inscrito\r\n\r\n#XLST,35: List header to categorize all pending benefits\r\nMB_LIST_HEADER_PENDING=Pendente\r\n\r\n#XTIT,20: Title in details view to show information on the benefit plan\r\nMB_INFORMATION=Informa\\u00E7\\u00E3o\r\n\r\n#XTIT,20: Title in details view to show links to benefit plan documents\r\nMB_DOCUMENTS=Documentos\r\n\r\n#XTIT,20: List of dependents who are covered under the benefit plan  \r\nMB_DEPENDENTS=Dependentes\r\n\r\n#XTIT,20: List of individuals, organizations, or trust funds that will be eligible to receive benefits of an insurance or retirement plan\r\nMB_BENEFICIARIES=Benefici\\u00E1rios\r\n\r\n#XTIT,20: List of investments done under the benefit plan  \r\nMB_INVESTMENTS=Investimentos\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan\r\nMB_PRIMARY=Prim\\u00E1rio\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan if the primary beneficiaries are deceased\r\nMB_CONTINGENT=Benefici\\u00E1rio substituto\r\n\r\n#XFLD: No data available\r\nMB_NO_DATA=Nenhum dado dispon\\u00EDvel\r\n\r\n#XFLD: No benefits data available\r\nMB_NO_BENEFITS=Nenhum benef\\u00EDcio\r\n\r\n#XFLD: No unenrolled plans\r\nMB_NO_UNENROLLED_PLAN=Nenhum plano n\\u00E3o inscrito\r\n\r\n#XFLD: Plan name\r\nMB_PLAN=Plano\r\n\r\n#XFLD: Type of plan\r\nMB_PLAN_TYPE=Tipo de plano\r\n\r\n#XFLD: Status of plan\r\nMB_STATUS=Status\r\n\r\n#XFLD,35: submit evidence of insurance before specified date \r\nMB_LABEL_EVIDENCE_INSURABILITY=Enviar comprovante de segurabilidade antes\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_PLAN_NUMBER=N\\u00BA do plano\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_GROUP_NUMBER=N\\u00BA de grupo\r\n\r\n#XFLD,35: payroll frequency\r\nMB_PAYROLL_FREQUENCY=Frequ\\u00EAncia de folha de pagamento\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_PRE_TAX_COST=Custos funcion\\u00E1rio - IVA suportado\r\n\r\n#XFLD,35: Employee bonus pre tax cost type\r\nMB_EMP_BONUS_PRE_TAX_COST=Custos funcion.- IVA suport.b\\u00F4nus\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_POST_TAX_COST=Custos funcion\\u00E1rio - imp.suplem.\r\n\r\n#XFLD,35: Employee bonus post tax cost type\r\nMB_EMP_BONUS_POST_TAX_COST=Csts.funcion\\u00E1rio - imp.suplem.b\\u00F4nus\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_ADDITIONAL_POST_TAX_COST=Csts.adic.funcion.- imposto supl.\r\n\r\n#XFLD,35: Imputed Income\r\nMB_Imputed_Income=Benef.corresp.em valor monet\\u00E1rio\r\n\r\n#XFLD,35: Employer cost type or reimbursement type\r\nMB_CREDITS=Cr\\u00E9ditos\r\n\r\n#XFLD,35: Employer cost type\r\nMB_EMPLOYER_COSTS=Custos do empregador\r\n\r\n#XFLD: Option for plan\r\nMB_PLAN_OPTION=Op\\u00E7\\u00E3o para plano\r\n\r\n#XFLD: Plan year\r\nMB_PLAN_YEAR=Ano do plano\r\n\r\n#XFLD,30: Contribution per payroll period\r\nMB_CONTRIBUTION_PER_PAY_PERIOD=Contribui\\u00E7\\u00E3o\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_PRE_TAX_CONTRIBUTION=Contribui\\u00E7\\u00E3o regular IVA suportado\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_POST_TAX_CONTRIBUTION=Contribui\\u00E7\\u00E3o regular imposto supl.\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_PRE_TAX_CONTRIBUTION=Contribui\\u00E7\\u00E3o IVA suportado b\\u00F4nus\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_POST_TAX_CONTRIBUTION=Contribui\\u00E7\\u00E3o imposto suplem.b\\u00F4nus\r\n\r\n#XFLD,35: Cost type\r\nMB_CALCULATED_CREDIT=Cr\\u00E9ditos calculados\r\n\r\n#XFLD: Period in which the user is enrolled in the benefit plan\r\nMB_PARTICIPATION_PERIOD=Per\\u00EDodo de participa\\u00E7\\u00E3o\r\n\r\n#XFLD,65: Roll over pre-tax to post-tax when pre-tax limit is reached\r\nMB_MESSAGE_PRE_TAX_TO_POST_TAX=Prorrogar p/imposto suplementar se limite IVA suport.for atingido\r\n\r\n#XFLD,65: Post-tax contributions start immediately\r\nMB_START_POST_TAX_CONTRIBUTIONS=Iniciar contribui\\u00E7\\u00F5es de imposto suplementar imediatamente\r\n\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=N\\u00E3o foi poss\\u00EDvel obter lista de benef\\u00EDcios\r\n\r\n#YMSG: Message for detail service error\r\nDETAIL_SERVICE_ERR_MESSAGE=N\\u00E3o foi poss\\u00EDvel obter detalhes do benef\\u00EDcio\r\n\r\n#YMSG: Message for count service error\r\nCOUNT_SERVICE_ERR_MESSAGE=N\\u00E3o foi poss\\u00EDvel obter resumo de benef\\u00EDcios\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=Meus benef\\u00EDcios\r\n',
	"hcm/emp/mybenefits/i18n/i18n_ru.properties":'\r\n#XTIT: Application name\r\nMB_APP_TITLE=\\u041C\\u043E\\u0438 \\u043B\\u044C\\u0433\\u043E\\u0442\\u044B\r\n\r\n# XFLD: Number of pending benefit plans\r\nPENDING_COUNT=\\u041E\\u0436\\u0438\\u0434\\u0430\\u0435\\u0442\\: {0} \r\n\r\n#XTIT,20: Title for benefits list\r\nMB_MASTER_TITLE=\\u041B\\u044C\\u0433\\u043E\\u0442\\u044B ({0})\r\n\r\n#XTIT,30: Title for benefit details\r\nMB_APP_DETAIL_TITLE=\\u041B\\u044C\\u0433\\u043E\\u0442\\u0430\r\n\r\n#XTIT,8: Selection date for displaying the benefit plans that the user is enrolled in \r\nMB_FOOTER_DATE_TEXT=\\u041D\\u0430 \\u0434\\u0430\\u0442\\u0443\r\n\r\n#XTIT,20: Selection for fetching unenrolled data \r\nMB_SHOW_DETAILS=\\u041F\\u043E\\u043A\\u0430\\u0437\\u0430\\u0442\\u044C \\u0434\\u0435\\u0442\\u0430\\u043B\\u0438\r\n\r\n# XFLD,20: Default Placeholder for the search field in Home View\r\nMB_SEARCH_PLACEHOLDER=\\u041F\\u043E\\u0438\\u0441\\u043A...\r\n\r\n#XBUT: Display the confirmation statement for the selection date in another window\r\nMB_CONFIRMATION=\\u0421\\u043C\\u043E\\u0442\\u0440\\u0435\\u0442\\u044C \\u043E\\u0431\\u0437\\u043E\\u0440\r\n\r\n#XBUT,8: Button to open menu  \r\nMB_OPEN=\\u041E\\u0442\\u043A\\u0440\\u044B\\u0442\\u043E\r\n\r\n#XLST,35: List header to categorize all health-related benefits\r\nMB_LIST_HEADER_HEALTH=\\u041C\\u0435\\u0434\\u0438\\u0446\\u0438\\u043D\\u0430\r\n\r\n#XLST,35: List header to categorize all life insurance-related benefits\r\nMB_LIST_HEADER_INSURANCE=\\u0421\\u0442\\u0440\\u0430\\u0445\\u043E\\u0432\\u0430\\u043D\\u0438\\u0435 \\u0436\\u0438\\u0437\\u043D\\u0438\r\n\r\n#XLST,35: List header to categorize all savings-related benefits\r\nMB_LIST_HEADER_SAVINGS=\\u0421\\u0431\\u0435\\u0440\\u0435\\u0436\\u0435\\u043D\\u0438\\u044F\r\n\r\n#XLST,35: List header to categorize all FSA-related benefits\r\nMB_LIST_HEADER_FSA=\\u0421\\u0447\\u0435\\u0442 \\u0434\\u043B\\u044F \\u043D\\u0435\\u043F\\u0440\\u0435\\u0434\\u0432\\u0438\\u0434\\u0435\\u043D\\u043D\\u044B\\u0445 \\u0440\\u0430\\u0441\\u0445\\u043E\\u0434\\u043E\\u0432\r\n\r\n#XLST,35: List header to categorize all stock-related benefits\r\nMB_LIST_HEADER_STOCK=\\u0410\\u043A\\u0446\\u0438\\u0438\r\n\r\n#XLST,35: List header to categorize all miscellaneous benefits\r\nMB_LIST_HEADER_MISC=\\u0420\\u0430\\u0437\\u043D\\u043E\\u0435\r\n\r\n#XLST,35: List header to categorize all benefits that the user is eligible for, but not enrolled in\r\nMB_LIST_HEADER_UNENROLLED=\\u041D\\u0435 \\u0440\\u0435\\u0430\\u043B\\u0438\\u0437\\u043E\\u0432\\u0430\\u043D\\u044B\r\n\r\n#XLST,35: List header to categorize all pending benefits\r\nMB_LIST_HEADER_PENDING=\\u0412 \\u043E\\u0436\\u0438\\u0434\\u0430\\u043D\\u0438\\u0438\r\n\r\n#XTIT,20: Title in details view to show information on the benefit plan\r\nMB_INFORMATION=\\u0418\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0438\\u044F\r\n\r\n#XTIT,20: Title in details view to show links to benefit plan documents\r\nMB_DOCUMENTS=\\u0414\\u043E\\u043A\\u0443\\u043C\\u0435\\u043D\\u0442\\u044B\r\n\r\n#XTIT,20: List of dependents who are covered under the benefit plan  \r\nMB_DEPENDENTS=\\u0417\\u0430\\u0432\\u0438\\u0441\\u0438\\u043C\\u044B\\u0435 \\u043E\\u0431\\u044A\\u0435\\u043A\\u0442\\u044B\r\n\r\n#XTIT,20: List of individuals, organizations, or trust funds that will be eligible to receive benefits of an insurance or retirement plan\r\nMB_BENEFICIARIES=\\u0411\\u0435\\u043D\\u0435\\u0444\\u0438\\u0446\\u0438\\u0430\\u0440\\u044B\r\n\r\n#XTIT,20: List of investments done under the benefit plan  \r\nMB_INVESTMENTS=\\u0418\\u043D\\u0432\\u0435\\u0441\\u0442\\u0438\\u0446\\u0438\\u0438\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan\r\nMB_PRIMARY=\\u041F\\u0435\\u0440\\u0432\\u0438\\u0447\\u043D\\u044B\\u0439\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan if the primary beneficiaries are deceased\r\nMB_CONTINGENT=\\u041F\\u043E\\u0441\\u043B\\u0435\\u0434\\u0443\\u044E\\u0449\\u0438\\u0439\r\n\r\n#XFLD: No data available\r\nMB_NO_DATA=\\u041D\\u0435\\u0442 \\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\\u0445 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0445\r\n\r\n#XFLD: No benefits data available\r\nMB_NO_BENEFITS=\\u041D\\u0435\\u0442 \\u043B\\u044C\\u0433\\u043E\\u0442\r\n\r\n#XFLD: No unenrolled plans\r\nMB_NO_UNENROLLED_PLAN=\\u041D\\u0435\\u0442 \\u043D\\u0435\\u043F\\u0440\\u0438\\u043C\\u0435\\u043D\\u0435\\u043D\\u043D\\u044B\\u0445 \\u043F\\u043B\\u0430\\u043D\\u043E\\u0432\r\n\r\n#XFLD: Plan name\r\nMB_PLAN=\\u041F\\u043B\\u0430\\u043D\r\n\r\n#XFLD: Type of plan\r\nMB_PLAN_TYPE=\\u0412\\u0438\\u0434 \\u043F\\u043B\\u0430\\u043D\\u0430\r\n\r\n#XFLD: Status of plan\r\nMB_STATUS=\\u0421\\u0442\\u0430\\u0442\\u0443\\u0441\r\n\r\n#XFLD,35: submit evidence of insurance before specified date \r\nMB_LABEL_EVIDENCE_INSURABILITY=\\u041F\\u0440\\u0435\\u0434\\u043E\\u0441\\u0442\\u0430\\u0432\\u0438\\u0442\\u044C \\u0434\\u043E\\u043A\\u0430\\u0437\\u0430\\u0442\\u0435\\u043B\\u044C\\u0441\\u0442\\u0432\\u043E \\u0441\\u0442\\u0440\\u0430\\u0445\\u043E\\u0432\\u043E\\u0439 \\u043F\\u0440\\u0438\\u0435\\u043C\\u043B\\u0435\\u043C\\u043E\\u0441\\u0442\\u0438 \\u0434\\u043E\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_PLAN_NUMBER=\\u041D\\u043E\\u043C\\u0435\\u0440 \\u043F\\u043B\\u0430\\u043D\\u0430\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_GROUP_NUMBER=\\u041D\\u043E\\u043C\\u0435\\u0440 \\u0433\\u0440\\u0443\\u043F\\u043F\\u044B\r\n\r\n#XFLD,35: payroll frequency\r\nMB_PAYROLL_FREQUENCY=\\u0427\\u0430\\u0441\\u0442\\u043E\\u0442\\u0430 \\u0432\\u044B\\u043F\\u043B\\u0430\\u0442\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_PRE_TAX_COST=\\u0420\\u0430\\u0441\\u0445\\u043E\\u0434\\u044B \\u0440\\u0430\\u0431\\u043E\\u0442\\u043D\\u0438\\u043A\\u0430 \\u0434\\u043E \\u0432\\u044B\\u0447\\u0435\\u0442\\u0430 \\u043D\\u0430\\u043B\\u043E\\u0433\\u043E\\u0432\r\n\r\n#XFLD,35: Employee bonus pre tax cost type\r\nMB_EMP_BONUS_PRE_TAX_COST=\\u0420\\u0430\\u0441\\u0445\\u043E\\u0434\\u044B \\u0440\\u0430\\u0431\\u043E\\u0442\\u043D\\u0438\\u043A\\u0430 \\u0434\\u043E \\u0432\\u044B\\u0447\\u0435\\u0442\\u0430 - \\u0431\\u043E\\u043D\\u0443\\u0441\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_POST_TAX_COST=\\u0420\\u0430\\u0441\\u0445\\u043E\\u0434\\u044B \\u0440\\u0430\\u0431\\u043E\\u0442. \\u043F\\u043E\\u0441\\u043B\\u0435 \\u0432\\u044B\\u0447\\u0435\\u0442\\u0430 \\u043D\\u0430\\u043B\\u043E\\u0433\\u043E\\u0432\r\n\r\n#XFLD,35: Employee bonus post tax cost type\r\nMB_EMP_BONUS_POST_TAX_COST=\\u0420\\u0430\\u0441\\u0445\\u043E\\u0434\\u044B \\u0440\\u0430\\u0431\\u043E\\u0442. \\u043F\\u043E\\u0441\\u043B\\u0435 \\u0432\\u044B\\u0447\\u0435\\u0442\\u0430 - \\u0431\\u043E\\u043D\\u0443\\u0441\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_ADDITIONAL_POST_TAX_COST=\\u0420\\u0430\\u0441\\u0445\\u043E\\u0434\\u044B \\u0440\\u0430\\u0431\\u043E\\u0442. \\u043F\\u043E\\u0441\\u043B\\u0435 \\u0432\\u044B\\u0447\\u0435\\u0442\\u0430 - \\u0434\\u043E\\u043F.\r\n\r\n#XFLD,35: Imputed Income\r\nMB_Imputed_Income=\\u0423\\u0441\\u043B\\u043E\\u0432\\u043D\\u043E \\u043D\\u0430\\u0447\\u0438\\u0441\\u043B\\u0435\\u043D\\u043D\\u044B\\u0439 \\u0434\\u043E\\u0445\\u043E\\u0434\r\n\r\n#XFLD,35: Employer cost type or reimbursement type\r\nMB_CREDITS=\\u041A\\u0440\\u0435\\u0434\\u0438\\u0442\\u044B\r\n\r\n#XFLD,35: Employer cost type\r\nMB_EMPLOYER_COSTS=\\u0420\\u0430\\u0441\\u0445\\u043E\\u0434\\u044B \\u0440\\u0430\\u0431\\u043E\\u0442\\u043E\\u0434\\u0430\\u0442\\u0435\\u043B\\u044F\r\n\r\n#XFLD: Option for plan\r\nMB_PLAN_OPTION=\\u041F\\u043B\\u0430\\u043D\\u043E\\u0432\\u0430\\u044F \\u043E\\u043F\\u0446\\u0438\\u044F\r\n\r\n#XFLD: Plan year\r\nMB_PLAN_YEAR=\\u041F\\u043B\\u0430\\u043D\\u043E\\u0432\\u044B\\u0439 \\u0433\\u043E\\u0434\r\n\r\n#XFLD,30: Contribution per payroll period\r\nMB_CONTRIBUTION_PER_PAY_PERIOD=\\u0412\\u0437\\u043D\\u043E\\u0441\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_PRE_TAX_CONTRIBUTION=\\u0420\\u0435\\u0433\\u0443\\u043B\\u044F\\u0440\\u043D\\u044B\\u0439 \\u0432\\u0437\\u043D\\u043E\\u0441 \\u0441 \\u043F\\u0440\\u0435\\u0434\\u0432. \\u043D\\u0430\\u043B\\u043E\\u0433\\u043E\\u043C\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_POST_TAX_CONTRIBUTION=\\u0420\\u0435\\u0433\\u0443\\u043B\\u044F\\u0440\\u043D\\u044B\\u0439 \\u0432\\u0437\\u043D\\u043E\\u0441 \\u0441 \\u043F\\u043E\\u0441\\u043B\\u0435\\u0434. \\u043D\\u0430\\u043B\\u043E\\u0433\\u043E\\u043C\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_PRE_TAX_CONTRIBUTION=\\u0412\\u0437\\u043D\\u043E\\u0441 \\u0441 \\u043F\\u0440\\u0435\\u0434\\u0432\\u0430\\u0440\\u0438\\u0442. \\u043D\\u0430\\u043B\\u043E\\u0433\\u043E\\u043C - \\u0431\\u043E\\u043D\\u0443\\u0441\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_POST_TAX_CONTRIBUTION=\\u0412\\u0437\\u043D\\u043E\\u0441 \\u0441 \\u043F\\u043E\\u0441\\u043B\\u0435\\u0434\\u0443\\u0449\\u0438\\u043C \\u043D\\u0430\\u043B\\u043E\\u0433\\u043E\\u043C - \\u0431\\u043E\\u043D\\u0443\\u0441\r\n\r\n#XFLD,35: Cost type\r\nMB_CALCULATED_CREDIT=\\u0420\\u0430\\u0441\\u0441\\u0447\\u0438\\u0442\\u0430\\u043D\\u043D\\u044B\\u0435 \\u043D\\u0430\\u0434\\u0431\\u0430\\u0432\\u043A\\u0438\r\n\r\n#XFLD: Period in which the user is enrolled in the benefit plan\r\nMB_PARTICIPATION_PERIOD=\\u041F\\u0435\\u0440\\u0438\\u043E\\u0434 \\u0443\\u0447\\u0430\\u0441\\u0442\\u0438\\u044F\r\n\r\n#XFLD,65: Roll over pre-tax to post-tax when pre-tax limit is reached\r\nMB_MESSAGE_PRE_TAX_TO_POST_TAX=\\u041F\\u0440\\u043E\\u043B\\u043E\\u043D\\u0433. \\u0432 \\u043F\\u043E\\u0441\\u043B\\u0435\\u0434. \\u043D\\u0430\\u043B\\u043E\\u0433, \\u0435\\u0441\\u043B\\u0438 \\u043B\\u0438\\u043C\\u0438\\u0442 \\u043F\\u0440\\u0435\\u0434\\u0432. \\u043D\\u0430\\u043B\\u043E\\u0433\\u0430 \\u0443\\u0436\\u0435 \\u0434\\u043E\\u0441\\u0442\\u0438\\u0433\\u043D\\u0443\\u0442\r\n\r\n#XFLD,65: Post-tax contributions start immediately\r\nMB_START_POST_TAX_CONTRIBUTIONS=\\u041D\\u0430\\u0447\\u0430\\u0442\\u044C \\u0432\\u0437\\u043D\\u043E\\u0441\\u044B \\u0441 \\u043F\\u043E\\u0441\\u043B\\u0435\\u0434\\u0443\\u044E\\u0449\\u0438\\u043C \\u043D\\u0430\\u043B\\u043E\\u0433\\u043E\\u043C \\u0441\\u0440\\u0430\\u0437\\u0443\r\n\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u043F\\u043E\\u043B\\u0443\\u0447\\u0438\\u0442\\u044C \\u0441\\u043F\\u0438\\u0441\\u043E\\u043A \\u043B\\u044C\\u0433\\u043E\\u0442\r\n\r\n#YMSG: Message for detail service error\r\nDETAIL_SERVICE_ERR_MESSAGE=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u043F\\u043E\\u043B\\u0443\\u0447\\u0438\\u0442\\u044C \\u0434\\u0435\\u0442\\u0430\\u043B\\u0438 \\u043B\\u044C\\u0433\\u043E\\u0442\\u044B\r\n\r\n#YMSG: Message for count service error\r\nCOUNT_SERVICE_ERR_MESSAGE=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u043F\\u043E\\u043B\\u0443\\u0447\\u0438\\u0442\\u044C \\u043E\\u0431\\u0437\\u043E\\u0440 \\u043F\\u043E \\u043B\\u044C\\u0433\\u043E\\u0442\\u0430\\u043C\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=\\u041C\\u043E\\u0438 \\u043B\\u044C\\u0433\\u043E\\u0442\\u044B\r\n',
	"hcm/emp/mybenefits/i18n/i18n_tr.properties":'\r\n#XTIT: Application name\r\nMB_APP_TITLE=Haklar\\u0131m\r\n\r\n# XFLD: Number of pending benefit plans\r\nPENDING_COUNT={0} Beklemede\r\n\r\n#XTIT,20: Title for benefits list\r\nMB_MASTER_TITLE=Haklar ({0})\r\n\r\n#XTIT,30: Title for benefit details\r\nMB_APP_DETAIL_TITLE=Hak\r\n\r\n#XTIT,8: Selection date for displaying the benefit plans that the user is enrolled in \r\nMB_FOOTER_DATE_TEXT=B\\u015Fl.\r\n\r\n#XTIT,20: Selection for fetching unenrolled data \r\nMB_SHOW_DETAILS=Ayr\\u0131nt\\u0131lar\\u0131 g\\u00F6ster\r\n\r\n# XFLD,20: Default Placeholder for the search field in Home View\r\nMB_SEARCH_PLACEHOLDER=Aran\\u0131yor...\r\n\r\n#XBUT: Display the confirmation statement for the selection date in another window\r\nMB_CONFIRMATION=Genel bak\\u0131\\u015F\\u0131 g\\u00F6r\\u00FCnt\\u00FCle\r\n\r\n#XBUT,8: Button to open menu  \r\nMB_OPEN=A\\u00E7\r\n\r\n#XLST,35: List header to categorize all health-related benefits\r\nMB_LIST_HEADER_HEALTH=Sa\\u011Fl\\u0131k\r\n\r\n#XLST,35: List header to categorize all life insurance-related benefits\r\nMB_LIST_HEADER_INSURANCE=Hayat sigortas\\u0131\r\n\r\n#XLST,35: List header to categorize all savings-related benefits\r\nMB_LIST_HEADER_SAVINGS=Tasarruf\r\n\r\n#XLST,35: List header to categorize all FSA-related benefits\r\nMB_LIST_HEADER_FSA=Esnek tasarruf hesaplar\\u0131\r\n\r\n#XLST,35: List header to categorize all stock-related benefits\r\nMB_LIST_HEADER_STOCK=Stok\r\n\r\n#XLST,35: List header to categorize all miscellaneous benefits\r\nMB_LIST_HEADER_MISC=\\u00C7e\\u015Fitli\r\n\r\n#XLST,35: List header to categorize all benefits that the user is eligible for, but not enrolled in\r\nMB_LIST_HEADER_UNENROLLED=Kaydedilmedi\r\n\r\n#XLST,35: List header to categorize all pending benefits\r\nMB_LIST_HEADER_PENDING=Beklemede\r\n\r\n#XTIT,20: Title in details view to show information on the benefit plan\r\nMB_INFORMATION=Bilgi\r\n\r\n#XTIT,20: Title in details view to show links to benefit plan documents\r\nMB_DOCUMENTS=Belgeler\r\n\r\n#XTIT,20: List of dependents who are covered under the benefit plan  \r\nMB_DEPENDENTS=M\\u015Ftrk.sigortal\\u0131lar\r\n\r\n#XTIT,20: List of individuals, organizations, or trust funds that will be eligible to receive benefits of an insurance or retirement plan\r\nMB_BENEFICIARIES=Lehdarlar\r\n\r\n#XTIT,20: List of investments done under the benefit plan  \r\nMB_INVESTMENTS=Yat\\u0131r\\u0131mlar\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan\r\nMB_PRIMARY=Birincil\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan if the primary beneficiaries are deceased\r\nMB_CONTINGENT=\\u0130kincil lehdar\r\n\r\n#XFLD: No data available\r\nMB_NO_DATA=Veri mevcut de\\u011Fil\r\n\r\n#XFLD: No benefits data available\r\nMB_NO_BENEFITS=Haklar yok\r\n\r\n#XFLD: No unenrolled plans\r\nMB_NO_UNENROLLED_PLAN=Kaydedilmeyen plan yok\r\n\r\n#XFLD: Plan name\r\nMB_PLAN=Plan\r\n\r\n#XFLD: Type of plan\r\nMB_PLAN_TYPE=Plan t\\u00FCr\\u00FC\r\n\r\n#XFLD: Status of plan\r\nMB_STATUS=Durum\r\n\r\n#XFLD,35: submit evidence of insurance before specified date \r\nMB_LABEL_EVIDENCE_INSURABILITY=Sigorta edilebilirlik delilini g\\u00F6nderme son tarihi\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_PLAN_NUMBER=Plan numaras\\u0131\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_GROUP_NUMBER=Grup numaras\\u0131\r\n\r\n#XFLD,35: payroll frequency\r\nMB_PAYROLL_FREQUENCY=Bordro s\\u0131kl\\u0131\\u011F\\u0131\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_PRE_TAX_COST=\\u00C7al\\u0131\\u015Fan vergi \\u00F6ncesi masraf\\u0131\r\n\r\n#XFLD,35: Employee bonus pre tax cost type\r\nMB_EMP_BONUS_PRE_TAX_COST=\\u00C7al\\u0131\\u015Fan primi vergi \\u00F6ncesi masraf\\u0131\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_POST_TAX_COST=\\u00C7al\\u0131\\u015Fan vergi sonras\\u0131 masraf\\u0131\r\n\r\n#XFLD,35: Employee bonus post tax cost type\r\nMB_EMP_BONUS_POST_TAX_COST=\\u00C7al\\u0131\\u015Fan primi vergi sonras\\u0131 masraf\\u0131\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_ADDITIONAL_POST_TAX_COST=\\u00C7al\\u0131\\u015Fan ek vergi sonras\\u0131 masraf\\u0131\r\n\r\n#XFLD,35: Imputed Income\r\nMB_Imputed_Income=Nakdi ek haklar\r\n\r\n#XFLD,35: Employer cost type or reimbursement type\r\nMB_CREDITS=Primler\r\n\r\n#XFLD,35: Employer cost type\r\nMB_EMPLOYER_COSTS=\\u0130\\u015Fveren masraf\\u0131\r\n\r\n#XFLD: Option for plan\r\nMB_PLAN_OPTION=Plan se\\u00E7ene\\u011Fi\r\n\r\n#XFLD: Plan year\r\nMB_PLAN_YEAR=Plan y\\u0131l\\u0131\r\n\r\n#XFLD,30: Contribution per payroll period\r\nMB_CONTRIBUTION_PER_PAY_PERIOD=Katk\\u0131\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_PRE_TAX_CONTRIBUTION=D\\u00FCzenli vergi \\u00F6ncesi katk\\u0131\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_POST_TAX_CONTRIBUTION=D\\u00FCzenli vergi sonras\\u0131 katk\\u0131\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_PRE_TAX_CONTRIBUTION=Prim - vergi \\u00F6ncesi katk\\u0131\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_POST_TAX_CONTRIBUTION=Prim - vergi sonras\\u0131 katk\\u0131\r\n\r\n#XFLD,35: Cost type\r\nMB_CALCULATED_CREDIT=Hesaplanan primler\r\n\r\n#XFLD: Period in which the user is enrolled in the benefit plan\r\nMB_PARTICIPATION_PERIOD=Kat\\u0131l\\u0131m d\\u00F6nemi\r\n\r\n#XFLD,65: Roll over pre-tax to post-tax when pre-tax limit is reached\r\nMB_MESSAGE_PRE_TAX_TO_POST_TAX=Vergi \\u00F6ncesi limitine ula\\u015F\\u0131ld\\u0131\\u011F\\u0131nda vergi sonras\\u0131na uzat\r\n\r\n#XFLD,65: Post-tax contributions start immediately\r\nMB_START_POST_TAX_CONTRIBUTIONS=Vergi sonras\\u0131 katk\\u0131lar\\u0131 hemen ba\\u015Flat\r\n\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=Haklar listesi al\\u0131namad\\u0131\r\n\r\n#YMSG: Message for detail service error\r\nDETAIL_SERVICE_ERR_MESSAGE=Hak ayr\\u0131nt\\u0131s\\u0131 al\\u0131namad\\u0131\r\n\r\n#YMSG: Message for count service error\r\nCOUNT_SERVICE_ERR_MESSAGE=Hak say\\u0131m \\u00F6zeti al\\u0131namad\\u0131\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=Haklar\\u0131m\r\n',
	"hcm/emp/mybenefits/i18n/i18n_zh_CN.properties":'\r\n#XTIT: Application name\r\nMB_APP_TITLE=\\u6211\\u7684\\u798F\\u5229\r\n\r\n# XFLD: Number of pending benefit plans\r\nPENDING_COUNT={0} \\u9879\\u5F85\\u5B9A\r\n\r\n#XTIT,20: Title for benefits list\r\nMB_MASTER_TITLE=\\u798F\\u5229 ({0})\r\n\r\n#XTIT,30: Title for benefit details\r\nMB_APP_DETAIL_TITLE=\\u798F\\u5229\r\n\r\n#XTIT,8: Selection date for displaying the benefit plans that the user is enrolled in \r\nMB_FOOTER_DATE_TEXT=\\u8D77\\u59CB\\u65E5\\u671F\r\n\r\n#XTIT,20: Selection for fetching unenrolled data \r\nMB_SHOW_DETAILS=\\u663E\\u793A\\u8BE6\\u7EC6\\u4FE1\\u606F\r\n\r\n# XFLD,20: Default Placeholder for the search field in Home View\r\nMB_SEARCH_PLACEHOLDER=\\u6B63\\u5728\\u641C\\u7D22...\r\n\r\n#XBUT: Display the confirmation statement for the selection date in another window\r\nMB_CONFIRMATION=\\u67E5\\u770B\\u6C47\\u603B\r\n\r\n#XBUT,8: Button to open menu  \r\nMB_OPEN=\\u6253\\u5F00\r\n\r\n#XLST,35: List header to categorize all health-related benefits\r\nMB_LIST_HEADER_HEALTH=\\u5065\\u5EB7\r\n\r\n#XLST,35: List header to categorize all life insurance-related benefits\r\nMB_LIST_HEADER_INSURANCE=\\u4EBA\\u5BFF\\u4FDD\\u9669\r\n\r\n#XLST,35: List header to categorize all savings-related benefits\r\nMB_LIST_HEADER_SAVINGS=\\u50A8\\u84C4\r\n\r\n#XLST,35: List header to categorize all FSA-related benefits\r\nMB_LIST_HEADER_FSA=\\u5F00\\u652F\\u8D26\\u6237\r\n\r\n#XLST,35: List header to categorize all stock-related benefits\r\nMB_LIST_HEADER_STOCK=\\u80A1\\u7968\r\n\r\n#XLST,35: List header to categorize all miscellaneous benefits\r\nMB_LIST_HEADER_MISC=\\u5176\\u4ED6\r\n\r\n#XLST,35: List header to categorize all benefits that the user is eligible for, but not enrolled in\r\nMB_LIST_HEADER_UNENROLLED=\\u672A\\u767B\\u8BB0\r\n\r\n#XLST,35: List header to categorize all pending benefits\r\nMB_LIST_HEADER_PENDING=\\u5F85\\u5B9A\r\n\r\n#XTIT,20: Title in details view to show information on the benefit plan\r\nMB_INFORMATION=\\u4FE1\\u606F\r\n\r\n#XTIT,20: Title in details view to show links to benefit plan documents\r\nMB_DOCUMENTS=\\u6587\\u6863\r\n\r\n#XTIT,20: List of dependents who are covered under the benefit plan  \r\nMB_DEPENDENTS=\\u53D7\\u76CA\\u4EBA\r\n\r\n#XTIT,20: List of individuals, organizations, or trust funds that will be eligible to receive benefits of an insurance or retirement plan\r\nMB_BENEFICIARIES=\\u53D7\\u76CA\\u4EBA\r\n\r\n#XTIT,20: List of investments done under the benefit plan  \r\nMB_INVESTMENTS=\\u6295\\u8D44\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan\r\nMB_PRIMARY=\\u9996\\u8981\\u53D7\\u76CA\\u4EBA\r\n\r\n#XFLD: An individual, organization, or trust fund that is entitled to receive benefits from an employee\'s insurance or retirement plan if the primary beneficiaries are deceased\r\nMB_CONTINGENT=\\u7B2C\\u4E8C\\u53D7\\u76CA\\u4EBA\r\n\r\n#XFLD: No data available\r\nMB_NO_DATA=\\u65E0\\u53EF\\u7528\\u6570\\u636E\r\n\r\n#XFLD: No benefits data available\r\nMB_NO_BENEFITS=\\u65E0\\u798F\\u5229\r\n\r\n#XFLD: No unenrolled plans\r\nMB_NO_UNENROLLED_PLAN=\\u6CA1\\u6709\\u672A\\u767B\\u8BB0\\u53C2\\u52A0\\u7684\\u8BA1\\u5212\r\n\r\n#XFLD: Plan name\r\nMB_PLAN=\\u8BA1\\u5212\r\n\r\n#XFLD: Type of plan\r\nMB_PLAN_TYPE=\\u8BA1\\u5212\\u7C7B\\u578B\r\n\r\n#XFLD: Status of plan\r\nMB_STATUS=\\u72B6\\u6001\r\n\r\n#XFLD,35: submit evidence of insurance before specified date \r\nMB_LABEL_EVIDENCE_INSURABILITY=\\u5728\\u6B64\\u65E5\\u671F\\u4E4B\\u524D\\u63D0\\u4EA4\\u53EF\\u4FDD\\u6027\\u8BC1\\u660E\\uFF1A\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_PLAN_NUMBER=\\u8BA1\\u5212\\u7F16\\u53F7\r\n\r\n#XFLD,35: Number assigned to plan\r\nMB_GROUP_NUMBER=\\u7EC4\\u7F16\\u53F7\r\n\r\n#XFLD,35: payroll frequency\r\nMB_PAYROLL_FREQUENCY=\\u5DE5\\u8D44\\u6838\\u7B97\\u9891\\u7387\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_PRE_TAX_COST=\\u5458\\u5DE5\\u7A0E\\u524D\\u6210\\u672C\r\n\r\n#XFLD,35: Employee bonus pre tax cost type\r\nMB_EMP_BONUS_PRE_TAX_COST=\\u5458\\u5DE5\\u5956\\u91D1\\u7A0E\\u524D\\u6210\\u672C\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_POST_TAX_COST=\\u5458\\u5DE5\\u7A0E\\u540E\\u6210\\u672C\r\n\r\n#XFLD,35: Employee bonus post tax cost type\r\nMB_EMP_BONUS_POST_TAX_COST=\\u5458\\u5DE5\\u5956\\u91D1\\u7A0E\\u540E\\u6210\\u672C\r\n\r\n#XFLD,35: Cost type\r\nMB_EMP_ADDITIONAL_POST_TAX_COST=\\u5458\\u5DE5\\u9644\\u52A0\\u7A0E\\u540E\\u6210\\u672C\r\n\r\n#XFLD,35: Imputed Income\r\nMB_Imputed_Income=\\u4F30\\u7B97\\u6536\\u5165\r\n\r\n#XFLD,35: Employer cost type or reimbursement type\r\nMB_CREDITS=\\u4FE1\\u8D37\\u503C\r\n\r\n#XFLD,35: Employer cost type\r\nMB_EMPLOYER_COSTS=\\u96C7\\u4E3B\\u6210\\u672C\r\n\r\n#XFLD: Option for plan\r\nMB_PLAN_OPTION=\\u8BA1\\u5212\\u9009\\u9879\r\n\r\n#XFLD: Plan year\r\nMB_PLAN_YEAR=\\u8BA1\\u5212\\u5E74\\u5EA6\r\n\r\n#XFLD,30: Contribution per payroll period\r\nMB_CONTRIBUTION_PER_PAY_PERIOD=\\u7F34\\u7EB3\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_PRE_TAX_CONTRIBUTION=\\u5B9A\\u671F\\u7A0E\\u524D\\u7F34\\u7EB3\r\n\r\n#XFLD,35: Cost type\r\nMB_REGULAR_POST_TAX_CONTRIBUTION=\\u5B9A\\u671F\\u7A0E\\u540E\\u7F34\\u7EB3\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_PRE_TAX_CONTRIBUTION=\\u5956\\u91D1\\u7A0E\\u524D\\u7F34\\u7EB3\r\n\r\n#XFLD,35: Cost type\r\nMB_BONUS_POST_TAX_CONTRIBUTION=\\u5956\\u91D1\\u7A0E\\u540E\\u7F34\\u7EB3\r\n\r\n#XFLD,35: Cost type\r\nMB_CALCULATED_CREDIT=\\u8BA1\\u7B97\\u51FA\\u7684\\u4FE1\\u8D37\\u503C\r\n\r\n#XFLD: Period in which the user is enrolled in the benefit plan\r\nMB_PARTICIPATION_PERIOD=\\u53C2\\u4E0E\\u671F\\u95F4\r\n\r\n#XFLD,65: Roll over pre-tax to post-tax when pre-tax limit is reached\r\nMB_MESSAGE_PRE_TAX_TO_POST_TAX=\\u5982\\u679C\\u8FBE\\u5230\\u7A0E\\u524D\\u9650\\u989D\\uFF0C\\u5219\\u5C55\\u671F\\u81F3\\u7A0E\\u540E\r\n\r\n#XFLD,65: Post-tax contributions start immediately\r\nMB_START_POST_TAX_CONTRIBUTIONS=\\u7ACB\\u5373\\u5F00\\u59CB\\u7A0E\\u540E\\u7F34\\u7EB3\r\n\r\n#YMSG: Message for list service error\r\nLIST_SERVICE_ERR_MESSAGE=\\u65E0\\u6CD5\\u83B7\\u53D6\\u798F\\u5229\\u6E05\\u5355\r\n\r\n#YMSG: Message for detail service error\r\nDETAIL_SERVICE_ERR_MESSAGE=\\u65E0\\u6CD5\\u83B7\\u53D6\\u798F\\u5229\\u8BE6\\u7EC6\\u4FE1\\u606F\r\n\r\n#YMSG: Message for count service error\r\nCOUNT_SERVICE_ERR_MESSAGE=\\u65E0\\u6CD5\\u83B7\\u53D6\\u798F\\u5229\\u8BA1\\u6570\\u6C47\\u603B\r\n\r\n#YMSG: Title for service error\r\nSERVICE_ERR_TITLE=\\u6211\\u7684\\u798F\\u5229\r\n',
	"hcm/emp/mybenefits/util/DataManager.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("hcm.emp.mybenefits.util.Formatter");

jQuery.sap.declare("hcm.emp.mybenefits.util.DataManager");

hcm.emp.mybenefits.util.DataManager = (function() {

	// NOTE: CODE CLEANUP & REFACTORING YET TO COMPLETE

	var _modelBase = null;
	var _resourceBundle = null;
	var _cachedModelObj = {};
	_cachedModelObj.exist = true;

	return {

		init : function(oDataModel, oresourceBundle) {
			_modelBase = oDataModel;
			_modelBase.setCountSupported(false);
			//TODO:optimize calls
			//_modelBase.setUseBatch(true);
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
		getMasterList: function(refreshFlag,dateChangeFlag,filter,successCallback, errorCallback) {
			var sPath = "Benefits";
			if(/*!_cachedModelObj.benefitsPlan||*/!_cachedModelObj.benefitsPlan.length||refreshFlag||dateChangeFlag){//after setting _cachedModelObj.benefitsPlan to {} (initially it'll be undefined) ,it becomes object and hence !_cachedModelObj.benefitsPlan will b false but .length parameter will give undefined as o/p(so it is added)
				this._getOData(sPath, null, filter,jQuery.proxy( function(objResponse) {
				/*	_cachedModelObj.benefitsPlan = objResponse.results;	*/		
					this.setCachedModelObjProp("benefitsPlan",objResponse.results);
					successCallback(objResponse.results);
				},this), function(objResponse) {
					errorCallback(objResponse);
				});
				
			}else{
				successCallback(_cachedModelObj.benefitsPlan.Benefits);
			}

		},
		
		getbothMasterList: function(filter,successCallback, errorCallback) {
			var sPath = "Benefits";
			this._getOData(sPath, null, filter, function(objResponse) {
					var enrldPlns=hcm.emp.mybenefits.util.DataManager.getCachedModelObjProp("benefitsPlan");
					$.merge(enrldPlns.Benefits,objResponse.results)
					successCallback(enrldPlns);
				}, function(objResponse) {
					errorCallback(objResponse);
				});
				
			},
		
		getHealthDependants :function(_this,curntBnftPlan,successCallback, errorCallback) {
			//this.oDataModel.read("Benefits", null, filter, true, jQuery.proxy(successCallback,this));
            var uri=curntBnftPlan.__metadata.id
			var sPath = uri.slice(uri.indexOf("/Benefits"),uri.length);
			var oParams = ['$expand=Dependants'];
			
				this._getOData(sPath, null, oParams, function(objResponse) {
					jQuery.proxy(successCallback(objResponse),_this);
					
				}, function(objResponse) {
					errorCallback(objResponse);
				});
				
		
		}, 
		
		getBeneficiaries :function(_this,curntBnftPlan,successCallback, errorCallback) {
			//this.oDataModel.read("Benefits", null, filter, true, jQuery.proxy(successCallback,this));
            var uri=curntBnftPlan.__metadata.id
			var sPath = uri.slice(uri.indexOf("/Benefits"),uri.length);
			var oParams = ['$expand=Beneficiary'];
			
				this._getOData(sPath, null, oParams, function(objResponse) {
					jQuery.proxy(successCallback(objResponse),_this);
					
				}, function(objResponse) {
					errorCallback(objResponse);
				});
				
		
		}, 
		
		 getInvestment:function(_this,curntBnftPlan,successCallback, errorCallback) {
				//this.oDataModel.read("Benefits", null, filter, true, jQuery.proxy(successCallback,this));
	            var uri=curntBnftPlan.__metadata.id
				var sPath = uri.slice(uri.indexOf("/Benefits"),uri.length);
				var oParams = ['$expand=Investment'];
				
					this._getOData(sPath, null, oParams, function(objResponse) {
						jQuery.proxy(successCallback(objResponse),_this);
						
					}, function(objResponse) {
						errorCallback(objResponse);
					});
					
			
			}, 
			getMasterListonDateChange: function(filter,successCallback, errorCallback) {
				var sPath = "Benefits";
				
					this._getOData(sPath, null, filter, function(objResponse) {	
						successCallback(objResponse.results);
					}, function(objResponse) {
						errorCallback(objResponse);
					});
					
				
			},
			parseErrorMessages : function(objResponse) {

				if (objResponse.response.body) {
					try {
						var oResponse = JSON.parse(objResponse.response.body);
						if (oResponse.error && oResponse.error.message && oResponse.error.message.value) {
							var result = [];
							result.push(oResponse.error.message.value);
							if (oResponse.error.innererror && oResponse.error.innererror.errordetails
									&& oResponse.error.innererror.errordetails instanceof Array) {
								for ( var i = 0; i < oResponse.error.innererror.errordetails.length; i++) {
									if (oResponse.error.innererror.errordetails[i].message) {
										var message = oResponse.error.innererror.errordetails[i].message;
										if (oResponse.error.innererror.errordetails[i].code) {
											message += " [" + oResponse.error.innererror.errordetails[i].code + "]";
										}
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
		
		_getOData : function(sPath, oContext, oUrlParams, successCallback, errorCallback) {

			_modelBase.read(sPath, oContext, oUrlParams, true, function(response) {
				successCallback(response);
			}, function(response) {
				errorCallback(response);
			});

		}
	};

}());
},
	"hcm/emp/mybenefits/util/Formatter.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
//declare namespace
jQuery.sap.declare("hcm.emp.mybenefits.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");

hcm.emp.mybenefits.util.Formatter = {

    mbPeriod: function(sText, sBeginDate, sEndDate) {
        return sText + ": " + hcm.emp.mybenefits.util.Formatter.DateFormatter(sBeginDate, "medium") + " - " + hcm.emp.mybenefits.util.Formatter.DateFormatter(sEndDate, "medium");
    },

    mbSubmitInsurabilityBefore: function(value) {
        return hcm.emp.mybenefits.util.Formatter.DateFormatter(value, "medium");
    },

    DateFormatter: function(formatdate, style) {

        var oFormatter = sap.ui.core.format.DateFormat.getDateInstance({
            style: style
        });
        var oFormatDate = new Date(formatdate);

        if (oFormatDate) {
            return oFormatter.format(oFormatDate);
        }
        return "";
    },

    formatterVisibleInsurability: function(insurabilityRequired, StatusText) {
        if (StatusText == "Pending" && insurabilityRequired === true)
            return true;
        else
            return false;

    },

    formatterVisibleCost: function(value) {
        if (value !== "0.0000" && value !== "0,0000" && value !== "" && value !== null)
            return true;
        else
            return false;
    },

    /**
     * formatter for display contact picture
     */
    displayContactPicture: function() {
        return jQuery.sap.getModulePath("hcm.emp.mybenefits") + "/img/" + "person_placeholder.png";
    },

    formatterVisible: function(Data) {
        if (Data !== "" && Data !== null)
            return true;

        else
            return false;
    },

    formatAmount: function(oValue, sCurrency) {
        var formatter = sap.ca.ui.model.format.AmountFormat.getInstance(sCurrency, {
            style: "standard",
            decimals: "2"
        });
        return formatter.format(oValue);
    },

    formatAmountWCurr: function(oValue, sCurrency) {
        var formattedVal = hcm.emp.mybenefits.util.Formatter.formatAmount(oValue, sCurrency);
        return formattedVal + " " + sCurrency;
    },

    formatContribution: function(oValue, sCurrency) {

        var taxValue = oValue;
        var Curr = sCurrency;
        var taxValueAmount, taxValues;
        if (!hcm.emp.mybenefits.util.Formatter.formatterVisible(oValue))
            return "";
        if (taxValue.indexOf("+") != -1) {
            taxValues = taxValue.split("+");
            taxValueAmount = taxValues[0].split(" ");
            if (sCurrency === null)
                Curr = taxValueAmount[1];
            if (taxValueAmount[0].indexOf("%") == -1 && taxValueAmount[0].indexOf("unit") == -1)
                taxValueAmount[0] = hcm.emp.mybenefits.util.Formatter.formatAmount(taxValueAmount[0], Curr);
        } else {
            if (taxValue.indexOf("%") != -1 && taxValue.indexOf("unit") != -1) {
                return hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(taxValue, Curr);
            } else {
                return taxValue;
            }
        }
        return hcm.emp.mybenefits.util.Formatter.concatenateData(taxValueAmount[0], Curr, taxValues[1], taxValues[2]);
    },

    concatenateData: function(amount, currency, percentage, unit) {
        var amountAppended = "";
        if (amount.length !== 0 && currency.length !== 0)
            amountAppended = amount + " " + currency;
        if (percentage.length !== 0)
            amountAppended += " +" + percentage;
        if (unit.length !== 0)
            amountAppended += "+" + unit;
        return amountAppended;
    },

    mbDependants: function(sName, sRelation) {
        return sName + " (" + sRelation + ")";
    },

 // Append % character
    AppendPercent: function(percentage) {
    	return percentage + " %";
    },
    mbPlanYear: function(sBeginDate, sEndDate) {
        return hcm.emp.mybenefits.util.Formatter.DateFormatter(sBeginDate, "medium") + " - " + hcm.emp.mybenefits.util.Formatter.DateFormatter(sEndDate, "medium");
    },

    formatFSAStatus: function(oValue) {
        if (oValue !== null) {
            var coverageValues = oValue.split(" ");
            var peryear;
            if (coverageValues[0] !== "" && coverageValues[0] !== "0.0000" && coverageValues[0] !== "0,0000" && coverageValues.length > 2) {
                peryear = coverageValues[2].charAt(0).toUpperCase() + coverageValues[2].slice(1);
                return peryear;
            } else
                return "";
        } else
            return "";
    }
};
},
	"hcm/emp/mybenefits/util/Utilities.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
//declare namespace
jQuery.sap.declare("hcm.emp.mybenefits.util.Utilities");

hcm.emp.mybenefits.util.Utilities = {

    formAttachments: function(oContext) {
        var attachments = [];
        var attachment = {};
        var attachmentsList = [];
        var attachmentJsonModel = new sap.ui.model.json.JSONModel();
        if (oContext.UrlPlan.length !== 0) {
            attachment.UrlPlanText = oContext.UrlPlanText;
            attachment.UrlPlan = oContext.UrlPlan;

            attachments.push(attachment);

        }
        if (oContext.UrlPlanType.length !== 0) {
            attachment.UrlPlanText = oContext.UrlPlanTypeText;
            attachment.UrlPlan = oContext.UrlPlanType;

            attachments.push(attachment);
        }

        attachmentsList.push(attachments);

        if (oContext.UrlPlan.length !== 0 || oContext.UrlPlanType.length !== 0) {
            attachmentJsonModel.setData(attachmentsList);
        }
        return attachmentJsonModel;
    }


};
},
	"hcm/emp/mybenefits/view/S2.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */






jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");

sap.ca.scfld.md.controller.ScfldMasterController.extend("hcm.emp.mybenefits.view.S2", {
/*	onBeforeShow:funcion(){
		
	},*/
	onInit: function() {
		// execute the onInit for the base class BaseDetailController
		sap.ca.scfld.md.controller.ScfldMasterController.prototype.onInit.call(this);

		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();

		hcm.emp.mybenefits.util.DataManager.init(this.oDataModel, this.resourceBundle);
		this.oRouter.attachRouteMatched(this._handleRouteMatched, this);

		this.masterListCntrl = this.byId("list");
		this.objBenfitsCollection = null;

		this._fnRefreshCompleted = null;
		this.dateChangeFlag=false;
		/* if (jQuery.device.is.phone) {
	            this.getView().addEventDelegate({onBeforeShow : jQuery.proxy(this.onBeforeShow , this)}, this);
	        }*/
		hcm.emp.mybenefits.util.DataManager.setCachedModelObjProp("benefitsPlan",{});
		this.byId("S2DatePicker").setDateValue(new Date()); //note ca.ui to m.datePicker
		
		this._initData();
		
		this._isLocalRouting = false;
		this._isInitialized = false;
		
		this.flag=true;//true for enrolled,false for unenrolled
		this.refreshFlag=false;
	},
	 /*onBeforeShow : function () {
		 this._initData();
	    },*/
	setLeadSelection : function() {
		var oItems = this.masterListCntrl.getItems();
	if(oItems.length<1){
		//this.getList().setNoDataText(this.resourceBundle.getText("NO_ITEMS_AVAILABLE")); // Note: improper display of no data text
		if (!sap.ui.Device.system.phone) {
			this.oRouter.navTo('noData', {
				viewTitle: 'MB_APP_DETAIL_TITLE',
				languageKey: sap.ui.getCore().getConfiguration().getLanguage()
			}, !jQuery.device.is.phone);
			
	       }
	}
	else{
   // this.setListItem(oItems[1]);
		var firstItem = this._oApplicationImplementation.getFirstListItem(this);
    if (firstItem) {
    	var item=firstItem.getAttributes()[0].getText();
    	if(item!="Show Details") //to ensure show details button is not selected by default when there are no enrolled plans
        this.setListItem(firstItem);
    	/*else
    	this.showEmptyView("MB_APP_DETAIL_TITLE","MB_NO_DATA");
*/    }
	}
},

	 _handleRouteMatched : function(oEvent) {

		// to use cached data for local routing
		if (oEvent.getParameter("name") === "master" && this._isLocalRouting == false) {
			this._initData();
		}

		//reset flag
		if(oEvent.getParameter("name") === "master" && this._isLocalRouting === true){
			this._isLocalRouting = false;
		}

	},
	_initData : function(){		
		var _this = this;
		hcm.emp.mybenefits.util.DataManager.init(this.oDataModel, this.resourceBundle);  

		if(!this.dateChangeFlag)
		{
		var d = new Date();
		var dd = ('0' + d.getDate()).slice(-2).toString();
		var mm = ('0' + (d.getMonth() + 1)).slice(-2).toString();
		var yyyy = d.getFullYear();
		
		this.todayDate = dd + "-" + mm + ", " + yyyy;
		this.date=d;
		
		// Fill date filter
		this.filterDate = dd + mm + yyyy;
		/*}*/}
		this.filter = [ "$filter=AsOn eq '" + this.filterDate + "' and Type eq 'Enrolled'" ];
		
		//get enrolled items
		hcm.emp.mybenefits.util.DataManager.getMasterList(this.refreshFlag,this.dateChangeFlag,this.filter,function(objResponse) {
			var tempRefresh=_this.refreshFlag;//holds status of refresh 
			_this.objBenfitsCollection = {"Benefits" : objResponse};
			hcm.emp.mybenefits.util.DataManager.setCachedModelObjProp("benefitsPlan",_this.objBenfitsCollection);
			
			try{
			if (_this.objBenfitsCollection/*.Benefits.length>0*/) {
				_this.masterListCntrl.setModel(new sap.ui.model.json.JSONModel(_this.objBenfitsCollection));//should have enrolled initially
            	
				_this._isLocalRouting = true;

				this.oSorter = new sap.ui.model.Sorter("StatusCode", false, function(oContext) {
					var skey = oContext.getProperty("StatusCode").trim();
					return skey;
				});
				if(_this.masterListCntrl.getItems().length>0)_this.masterListCntrl.removeAllItems();//clear the master list before binding new data
				_this.masterListCntrl.bindItems({
					path : "/Benefits",
					template :new sap.m.ObjectListItem({
						type:"{device/listItemType}",
						title:"{PlanTypeText}",
						attributes: [
						             new sap.m.ObjectAttribute({
						            	 text:"{PlanSubTypeText}"
						             }),
						             new sap.m.ObjectAttribute({
						            	 text:"{PlanOptionText}"
						             })],
						             firstStatus:
						            	 new sap.m.ObjectStatus ({
						            		 text:"{StatusText}",
						            		 state:"Error"
						            	 }),
						            	 press : jQuery.proxy(_this._handleItemPress,_this)
					}),
					sorter: this.oSorter
				});
				//avoids multiple group headers
				var iInsertIndexRem = 0;
				jQuery.each(_this.masterListCntrl.getItems(), function(i, oItem) {
					if (!(oItem.getBindingContext())) { // TODO: only a quick solution! Check for a better solution to
						// determine the item type
						_this.masterListCntrl.removeItem(i - iInsertIndexRem);
						iInsertIndexRem = iInsertIndexRem + 1;
					}
				});
				if(objResponse.length>=0||tempRefresh)
					{
				//add show details
		        var  LastItem=new sap.m.ObjectListItem({
					type:"{device/listItemType}",
					title:"",
					attributes: [
					             new sap.m.ObjectAttribute({
					            	 text:_this.resourceBundle.getText("MB_SHOW_DETAILS")
					             }),
					             new sap.m.ObjectAttribute({
					            	 text:""
					             })],
					             firstStatus:
					            	 new sap.m.ObjectStatus ({
					            		 text:"{StatusText}",
					            		 state:"Error"
					            	 })
				});
		        _this.masterListCntrl.addItem(LastItem);
				}
		        _this.originalaItems= _this.masterListCntrl.getItems();
				_this.handleSort();
				_this._bIsMasterRoute = true;
				//_this._selectDetail();
				/*var yyyymmddDate=_this.masterListCntrl.getInfoToolbar().getContent()[1]._toDateStringYYYYMMDD(new Date());
				_this.masterListCntrl.getInfoToolbar().getContent()[1].mProperties.value=yyyymmddDate.substr(6,2)+"-"+yyyymmddDate.substr(4,2)+"-"+yyyymmddDate.substr(0,4);*/
				var yyyymmddDate=_this.filterDate;
				_this.refreshHeaderFooterForEditToggle();
				//Note:2057772
				var formattedDate= yyyymmddDate.substr(2,2)+"-"+yyyymmddDate.substr(0,2)+"-"+yyyymmddDate.substr(4,4);
				//	_this.masterListCntrl.getInfoToolbar().getContent()[1].mProperties.value=formattedDate;
					_this.byId("S2DatePicker").setDateValue(new Date(formattedDate));
				//End Note:2057772
				if(_this._fnRefreshCompleted)
				{
					_this._fnRefreshCompleted();
					sap.ca.ui.utils.busydialog.releaseBusyDialog();
				}
			}
			
				
			}catch(err)
		    {
		    	jQuery.sap.log.warning(err);
				
		    }
	   
			if(!jQuery.device.is.phone && !_this._isInitialized){
				_this.registerMasterListBind(_this.masterListCntrl);						
				_this._isInitialized = true;
			}
			if(!jQuery.device.is.phone){
				if(tempRefresh /*&& _this.itemSelectedExists*/){
					for(var i=0;i<_this.masterListCntrl.getItems().length;i++)
						{
						var indepItem=_this.masterListCntrl.getItems()[i];
						if((indepItem.getBindingContext()))
						{
						var aItem=indepItem.getBindingContext();
						var key1=aItem.getProperty("PlanCategory");
						var key2=aItem.getProperty("PlanTypeKey");
						var key3=aItem.getProperty("PlanSubTypeKey");
						if(key1==_this.selectedItemKey1 && key2==_this.selectedItemKey2 && key3==_this.selectedItemKey3)
							{
							_this.setListItem(_this.masterListCntrl.getItems()[i]);
							break;
							}
						}
						
						}
					if(i==_this.masterListCntrl.getItems().length)_this.setLeadSelection();//if selected item not found in initial list select first item
					_this.refreshFlag=false;//refresh done 
				}
				else
					{
				_this.setLeadSelection();
					}
			}			
		}, function(objResponse) {
			hcm.emp.mybenefits.util.DataManager.parseErrorMessages(objResponse);
		});

	},

	/**
	 * [setListItem description]
	 * @param {[type]} oItem [description]
	 */
	setListItem: function(oItem) {
		
		var showDetailsItem=oItem.getAttributes()[0].getText();
		if(showDetailsItem=="Show Details"){
			oItem.setVisible(false);
			this.flag=false;
			/*this.refreshCall="both";*/
			this.filter=[ "$filter=AsOn eq '" + this.filterDate + "' and Type eq 'Unenrolled'" ];
			this.fetchUnEnrolled(this.filter);
		}
		if (undefined !== oItem.getBindingContext()) {
			var bindingContext = oItem.getBindingContext();
			var planCategory = bindingContext.getProperty("PlanCategory");
			var planType = bindingContext.getProperty("Type");
			var viewName = this._chooseView(planCategory, planType);

			oItem.setSelected(true);
			this.getList().setSelectedItem(oItem, true);
			
			this.oRouter.navTo(viewName, {
				contextPath: encodeURIComponent(bindingContext.sPath.substr(1))
			}, !jQuery.device.is.phone);
		}
		this._isLocalRouting = true;
		if(jQuery.device.is.phone){ //Note: removes the selections on going back to the master list on phone
			this.masterListCntrl.removeSelections();
		}//End Note
	},

	fetchUnEnrolled:function(filter){
		var _this = this;

		hcm.emp.mybenefits.util.DataManager.getbothMasterList(filter,function(objResponse) {
			_this.objBenfitsCollection = objResponse;
			try{
				if (_this.objBenfitsCollection) {
					_this.masterListCntrl.setModel(new sap.ui.model.json.JSONModel(_this.objBenfitsCollection));//should have enrolled initially
					var iInsertIndexRem = 0;
					jQuery.each(_this.masterListCntrl.getItems(), function(i, oItem) {
						if (!(oItem.getBindingContext())) { // TODO: only a quick solution! Check for a better solution to
							// determine the item type
							_this.masterListCntrl.removeItem(i - iInsertIndexRem);
							iInsertIndexRem = iInsertIndexRem + 1;
						}
					});
					_this.originalaItems= _this.masterListCntrl.getItems();
					_this.handleSort();
					_this._bIsMasterRoute = true;
					var yyyymmddDate=_this.filterDate;
					_this.refreshHeaderFooterForEditToggle();//handle the count in the header
					_this.masterListCntrl.getInfoToolbar().getContent()[1].mProperties.value=yyyymmddDate.substr(0,2)+"-"+yyyymmddDate.substr(2,2)+"-"+yyyymmddDate.substr(4,4);
					if(_this._fnRefreshCompleted)
					{
						_this._fnRefreshCompleted();
						sap.ca.ui.utils.busydialog.releaseBusyDialog();
					}
					
					}
				if(!jQuery.device.is.phone){
					_this.setLeadSelection();
					}
			}
			catch(err)
			{
				jQuery.sap.log.warning(err);

			}
		},function(objResponse) {
			hcm.emp.mybenefits.util.DataManager.parseErrorMessages(objResponse);
		});	
	},

	/**
	 * [_chooseView description]
	 * @param  {[type]} planCategory [description]
	 * @param  {[type]} planType     [description]
	 * @return {[type]}              [description]
	 */
	_chooseView: function(planCategory, planType) {
		var viewName = "";
		if (planType == "Enrolled" || planType == "Pending") {
			switch (planCategory) {
			case "A":
				viewName = "Health"; // "Health"
				break;
			case "B":
				viewName = "Insurance"; // "Insurance"
				break;
			case "C":
				viewName = "Savings"; // "Savings";
				break;
			case "D":
				viewName = "FSA"; // "FSA"
				break;
			case "E":
				viewName = "Miscellaneous"; // "Miscellaneous"
				break;
			case "F":
				viewName = "Savings"; // "Savings";
				break;
			}
		} else if (planType == "Unenrolled") {
			viewName = "Unenrolled"; // UnEnrolled
		}
		return viewName;
	},

	/**
	 * @override
	 *
	 * @param oItem
	 * @param sFilterPattern
	 * @returns {*}
	 */
	applySearchPatternToListItem: function(oItem, sFilterPattern) {

		if (undefined !== oItem.getBindingContext())
			if (sFilterPattern.substring(0, 1) === "#") {
				var sTail = sFilterPattern.substr(1),
				sDescr = oItem.getBindingContext().getProperty("Name").toLowerCase();
				return sDescr.indexOf(sTail) === 0;
			} else {

				if (sFilterPattern === "") {
					return true;
				}
				var oIteshellData = oItem.getBindingContext().getProperty("PlanTypeText");
				if(oIteshellData.toLowerCase().indexOf(sFilterPattern) != -1) {
					return true;
				}
				// if nothing found in unformatted data, check UI
				// elements
				return false;
			}
	},

	applySearchPattern : function(sFilterPattern) {
		var aListItems = this.originalaItems,
		matchingListItems=[],
		bVisibility,
		sFilterPattern = sFilterPattern.toLowerCase(),
		iCount = 0;
		if(sFilterPattern !== ""){
			for ( var i = 0; i < aListItems.length; i++) {
				bVisibility = this.applySearchPatternToListItem(aListItems[i], sFilterPattern);
				//aListItems[i].setVisible(bVisibility);
				if (bVisibility) {
					matchingListItems.push(aListItems[i]);
					iCount++;
				}
				
			}
			if(matchingListItems.length==0){
				if (!sap.ui.Device.system.phone) {
					this.oRouter.navTo('noData', {	
						viewTitle: 'MB_APP_DETAIL_TITLE',
						languageKey: sap.ui.getCore().getConfiguration().getLanguage()
					}, !jQuery.device.is.phone);
				 }				
			}
		}else{
			matchingListItems= this.originalaItems;//on cancel set it back to the prev list
			iCount = this.originalaItems.length;
		}

		
		this.handleSort(matchingListItems);
		this.masterListCntrl.removeSelections();
		if(this._fnRefreshCompleted)
		{
			this._fnRefreshCompleted();
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
		}
		return iCount;
	},
	
	/**
	 * [handleChange description]
	 * @param  {[type]} evt [description]
	 * @return {[type]}     [description]
	 */
	handleChange: function(evt) {

		// get selected date

	

		var oDate = evt.getParameters().newValue;
		
		
		// construct date in DDMMYYYY format
		var valueArray = oDate.split("-"),
		year = valueArray[2],
		month = valueArray[1],
		date = valueArray[0],
		
		_this=this;
		
		//check for invalid input in date field							Note:2057772
		oDate = date + month + year;
		if(Number(oDate).toString()==="NaN")
		{
			var d = new Date();
		var dd = ('0' + d.getDate()).slice(-2).toString();
		var mm = ('0' + (d.getMonth() + 1)).slice(-2).toString();
		var yyyy = d.getFullYear();
			oDate = dd + mm + yyyy;
		}
		_this.filterDate = oDate;
		_this.tempDate=oDate;
		//oDate = date + month + year;
		/*oBindingList = this.byId("list").getBinding("items");

		if (oBindingList) {
			// execute filtering for the list binding
			oBindingList.filter(new sap.ui.model.Filter("AsOn", sap.ui.model.FilterOperator.EQ, oDate));
			// preserving this below comment for reference in case the registerMastserListBind didnt work
			//oBindingList.attachChange(this.onDataLoaded, this);
			this.registerMasterListBind(this.getList());
		}*/

		//_this.filterDate = oDate;
		//end Note:2057772
		_this.dateChangeFlag=true;
		_this.flag=true;//on change of date only go for enrolled whose flag value is true
		if(_this._oControlStore.oMasterSearchField.getValue()){
			_this._oControlStore.oMasterSearchField.clear();
			}
		_this._initData();
		_this.dateChangeFlag=false;
		
	},


	handleSort: function(matchedItems) {

        var self = this,
            iInsertIndexRem = 0,
            oList = this.byId("list"),
            sSortParam = "StatusCode",
            bGrouping = true;

        // Remove the headers of the current grouping
        jQuery.each(oList.getItems(), function(i, oItem) {
            if (!(oItem.getBindingContext())) { // TODO: only a quick solution! Check for a better solution to
                // determine the item type
                oList.removeItem(i - iInsertIndexRem);
                iInsertIndexRem = iInsertIndexRem + 1;
            }
        });

        // sort the list items
        var aItems = oList.getItems();
        // check for the call coming from search if yes see the items which it has sent
        // i.e, matchedItems
        if(undefined!==matchedItems &&  null!== matchedItems){
             aItems=matchedItems;
          }
         else{
           // if the call hasn't come from the search then we need to take the original list
            aItems=this.originalaItems;
          }

        aItems.sort(function(a, b) {
			if(a.getBindingContext()){
				var valueA = a.getBindingContext().getProperty(sSortParam);
			}else{
				var valueA = null;
				//return -1;
			}
			if(b.getBindingContext()){
				var valueB = b.getBindingContext().getProperty(sSortParam);
			}else{
				var valueB = null;
				//return -1;
			}
			/*var valueA = a.getBindingContext().getProperty(sSortParam);
                  var valueB = b.getBindingContext().getProperty(sSortParam);*/
			return self.compareFunction(valueA, valueB);
		});

        // Remove all items from the current list
        oList.removeAllItems();

        // Add items in the right order and add grouping headers
        var iIndexAdd = 0;
        var iGroupingNumber = 0;
        var oGroupHeaderItem, sGroupValue;

        jQuery.each(aItems, function(i, oItem) {

        	if(oItem.getBindingContext()){
				var oCurrentValue = oItem.getBindingContext().getProperty("StatusCode");	
			}
			else if(oItem.getAttributes()[0].getText())
			{
				if(oItem.getAttributes()[0].getText()=="Show Details"){oCurrentValue = "2U";}
				
			}

            // Write a default text if no Grouping Value is available
            if (oCurrentValue === "") {
                oCurrentValue = "UnGrouped";
            }

            // Insert grouping header if requested
            if (bGrouping && ((i === 0) || oCurrentValue != sGroupValue)) {

                // Set the count value to the previous grouping header
                // --> this case only works if another grouping header follows
                if (i !== 0) {
                    oGroupHeaderItem.setCount(iGroupingNumber);
                }
                sGroupValue = oCurrentValue;
                oGroupHeaderItem = new sap.m.GroupHeaderListItem({
                    title: self.getGroupHeader(oCurrentValue), //sGroupValueText,
                    uppercase: false
                });
                oList.insertItem(oGroupHeaderItem, i + iIndexAdd);
                iIndexAdd = iIndexAdd + 1;
                iGroupingNumber = 0;
            }

            // Set the count to the last grouping header
            // --> relevant if it is the last or only grouping header in the list
            else if ((bGrouping) && ((i + 1) === aItems.length || ((i + 1) === aItems.length && i === 0))) {
                iGroupingNumber = iGroupingNumber+1;
                oGroupHeaderItem.setCount(iGroupingNumber);
            }

            //check for the last item it doesnt contain the count value so add the count 1 to it since it will
            // from zero
             if (!self.flag && (i + 1) === aItems.length){ //self.flag ensures that show details header do not get the count value
               if("" === oGroupHeaderItem.mProperties.count)
               iGroupingNumber = iGroupingNumber+1;
                oGroupHeaderItem.setCount(iGroupingNumber);
             
           }
            iGroupingNumber = iGroupingNumber + 1;
            oList.addItem(oItem);

        });
 },

	// Compare search values
	compareFunction: function(a, b) {

		if (b === null) {
			return -1;
		}
		if (a === null) {
			return 1;
		}
		if (typeof a === "string" && typeof b === "string") {
			return a.toLocaleUpperCase().localeCompare(b.toLocaleUpperCase());
		}
		if (a < b) {
			return -1;
		}
		if (a > b) {
			return 1;
		}
		return 0;
	},

	getGroupHeader: function(groupid) {

		var returnValue = "";
		switch (groupid) {
		case "0P":
			returnValue = this.resourceBundle.getText("MB_LIST_HEADER_PENDING");
			break;
		case "1A":
			returnValue = this.resourceBundle.getText("MB_LIST_HEADER_HEALTH");
			break;
		case "1B":
			returnValue = this.resourceBundle.getText("MB_LIST_HEADER_INSURANCE");
			break;
		case "1C":
			returnValue = this.resourceBundle.getText("MB_LIST_HEADER_SAVINGS");
			break;
		case "1D":
			returnValue = this.resourceBundle.getText("MB_LIST_HEADER_FSA");
			break;
		case "1E":
			returnValue = this.resourceBundle.getText("MB_LIST_HEADER_MISC");
			break;
		case "1F":
			returnValue = this.resourceBundle.getText("MB_LIST_HEADER_STOCK");
			break;
		case "2U":
			returnValue = this.resourceBundle.getText("MB_LIST_HEADER_UNENROLLED");
			break;
		}
		return returnValue;
	},


	getViewSummary: function() {

		var oView = this.getView(),
		// get selected date
		oDate = oView.byId('list').getInfoToolbar().getContent()[1].getValue(),
		// construct date in DDMMYYYY format
		valueArray = oDate.split("-"),
		year = valueArray[2],
		month = valueArray[1],
		date = valueArray[0],
		oDate = date + month + year;

		//Get connection manager/resource bundle
		//Note:2057772 removal of hardcoded url
		var pdfURL   = /*"/sap/opu/odata/sap/" 
			+ this.oApplicationFacade.oApplicationImplementation.oConfiguration.getServiceList()[0].name
			+ "/FileDataSet(FileKey='CONF_FORM',Date='" + oDate + "')/$value",*/ 							//remove hard coding
			this.oApplicationFacade.oApplicationImplementation.oConfiguration.getServiceList()[0].serviceUrl
			+ "FileDataSet(FileKey='CONF_FORM',Date='" + oDate + "')/$value",
			//end Note:2057772 
			query    = "?",
			amperSand = "&",
			sapserver = "",
			sapclient = "sap-client="+jQuery.sap.getUriParameters().get("sap-client");
		if(location.host.indexOf("localhost")!=-1)
		{
			sapserver="sap-server=gm6-http"+amperSand;
		}
		pdfURL += query+sapserver+sapclient;

		sap.m.URLHelper.redirect(pdfURL, true);
	},

	/**
	 * [getHeaderFooterOptions description]
	 * @return {[type]} [description]
	 */
	getHeaderFooterOptions: function() {

		var oList = this.byId("list");
		var count = oList.getItems().length;

		jQuery.each(oList.getItems(), function(i, oItem) {
			if (!(oItem.getBindingContext())) { // TODO: only a quick solution! Check for a better solution to
				count--;
			}
		});
		

		return {
			sI18NMasterTitle: this.resourceBundle.getText("MB_MASTER_TITLE", [count]),
			buttonList: [{
				sI18nBtnTxt: this.resourceBundle.getText("MB_CONFIRMATION"),
				onBtnPressed: jQuery.proxy(function(event) {
					this.getViewSummary(event);
				}, this)
			}, ],
			onRefresh: jQuery.proxy(function(searchField, fnRefreshCompleted){
				this.refreshFlag=true; 
				this.flag=true;
				this._fnRefreshCompleted = fnRefreshCompleted;
				
				hcm.emp.mybenefits.util.DataManager.setCachedModelObjProp("benefitsPlan",{});
				if(this.masterListCntrl.getSelectedItem()){
					var selectedItemB4Refresh=this.masterListCntrl.getSelectedItem().getBindingContext();
					this.selectedItemKey1=selectedItemB4Refresh.getProperty("PlanCategory");
					this.selectedItemKey2=selectedItemB4Refresh.getProperty("PlanTypeKey");
					this.selectedItemKey3=selectedItemB4Refresh.getProperty("PlanSubTypeKey");
				}
				if(searchField){//Note:Remove search field before refresh
				this._oControlStore.oMasterSearchField.clear();
				}//end note
				this._initData();
			}, this),
		};
	},

	/**
      * @public [isMainScreen describe whether this view is the main detail (S3) screen or a screen on deeper hierarchy level]


      *
      isMainScreen : function(){




              return true;
      } */

});

},
	"hcm/emp/mybenefits/view/S2.view.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<core:View\r\n\txmlns:core="sap.ui.core"\r\n\txmlns="sap.m"\r\n\txmlns:caui="sap.ca.ui"\r\n\tcontrollerName="hcm.emp.mybenefits.view.S2">\r\n\t<Page\r\n\t\tid="page"\r\n\t\ttitle="{i18n>MB_MASTER_TITLE}">\r\n\t\t<content>\r\n\t\t\t<List\r\n\t\t\t\tid="list"\r\n\t\t\t\tmode="SingleSelectMaster"\r\n                                includeItemInSelection = "true"\r\n                                select="_handleSelect" >\r\n\t\t\t\t<!-- <infoToolbar> <Toolbar visible="true" id="infoBarToolbar"> <content> \r\n\t\t\t\t\t<Label text="{i18n>MB_FOOTER_DATE_TEXT}" ></Label> <caui:DatePicker id="dueDateInput" \r\n\t\t\t\t\tvalueFormat="dd-MM, yyyy" change="handleChange"></caui:DatePicker> </content> \r\n\t\t\t\t\t</Toolbar> </infoToolbar> -->\r\n\t\t\t\t<infoToolbar>\r\n\t\t\t\t\t<Toolbar\r\n\t\t\t\t\t\tvisible="true"\r\n\t\t\t\t\t\tid="infoBarToolbar">\r\n\t\t\t\t\t\t<content>\r\n\t\t\t\t\t\t\t<Label text="{i18n>MB_FOOTER_DATE_TEXT}"></Label>\r\n\t\t\t\t\t\t\t<DatePicker\r\n\t\t\t\t\t\t\t\tid="S2DatePicker"\r\n\t\t\t\t\t\t\t\tdisplayFormat = "dd-MM-yyyy"\r\n\t\t\t\t\t\t\t\tvalueFormat = "dd-MM-yyyy"\r\n\t\t\t\t\t\t\t\tchange="handleChange" />\r\n\t\t\t\t\t\t</content>\r\n\t\t\t\t\t</Toolbar>\r\n\t\t\t\t</infoToolbar>\r\n\t\t\t</List>\r\n\t\t</content>\r\n\t\t<footer>\r\n\t\t\t<Bar\r\n\t\t\t\tid="footer"\r\n\t\t\t\ttranslucent="true"\r\n\t\t\t\tclass="benefitsMasterFooter">\r\n\t\t\t</Bar>\r\n\t\t</footer>\r\n\t</Page>\r\n</core:View>\r\n',
	"hcm/emp/mybenefits/view/S3.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("hcm.emp.mybenefits.util.Formatter");
jQuery.sap.require("hcm.emp.mybenefits.util.Utilities");
this.utilFormatter = hcm.emp.mybenefits.util.Formatter;
sap.ca.scfld.md.controller.BaseDetailController.extend("hcm.emp.mybenefits.view.S3", {

//	Controller Hook method definitions

//	This hook method can be used to initialize additional tabs of the icon tab filter from code.
//	It is called during S3 view initialization.  The controller extension should obtain   
//	references to the new icon tabs
	extHookInitAdditionalTabs: null,
	
//	This hook method can be used to add and change buttons for the detail view footer
//	It is called when the decision options for the detail item are fetched successfully
	extHookChangeFooterButtons: null,
	
    onInit: function() {
        // execute the onInit for the base class
        // BaseDetailController
        sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
        this.oDataModel = this.oApplicationFacade.getODataModel();
        this.resourceBundle = this.oApplicationFacade.getResourceBundle();
        hcm.emp.mybenefits.util.DataManager.init(this.oDataModel, this.resourceBundle);
        
        this.oRouter.attachRouteMatched(function(oEvent) {
            if (oEvent.getParameter("name") === "Health") {
            	hcm.emp.mybenefits.util.DataManager.init(this.oDataModel, this.resourceBundle);
            	
            	oEvent.getParameter("arguments").contextPath = decodeURIComponent(oEvent.getParameter("arguments").contextPath);
				
				var _this = this;
			
				var contextPath = decodeURIComponent(oEvent.getParameter("arguments").contextPath);
				var indexVal = contextPath.split("/")[1];
				
				var  benefitsPlancollection = hcm.emp.mybenefits.util.DataManager.getCachedModelObjProp("benefitsPlan");
            	
				_this.byId("TabContainer").setSelectedKey("Information");
				_this.byId("TabContainer").setExpanded(true);
				
				if (benefitsPlancollection) {
					
					var curntBnftPlan = benefitsPlancollection.Benefits[indexVal];	
					
					var objHeader= _this.byId("MB_HEALTH_HEADER");
					var formEvdncVisibility=_this.byId("MB_FORM_EVIDENCE_INSURABILITY");
					var sbmtLblValue=_this.byId("MB_LABEL_EVIDENCE_INSURABILITY_VALUE");
					
					var GrpNumVisibility=_this.byId("MB_FORM_GROUP_NUMBER");
					var payrlFreqVisiblty=_this.byId("MB_FORM_PAYROLL_FREQUENCY");
					
					var preTaxCostVisblty=_this.byId("MB_FORM_PRETAXCOST");
					var preTaxCostValue=_this.byId("MB_LABEL_PRETAXCOST_VALUE");
					
					var empBonsPreTaxCstVisblty=_this.byId("MB_FORM_EMP_BONUS_PRE_TAX_COST");
					var empBonsPreTaxCstVlu=_this.byId("MB_LABEL_EMP_BONUS_PRE_TAX_COST_VALUE");
					
					var postTaxCstVisblty=_this.byId("MB_FORM_POSTTAXCOST");
					var postTaxCostValue=_this.byId("MB_LABEL_POSTTAXCOST_VALUE");
					
					var empBonsPostTaxCstVisblty=_this.byId("MB_FORM_EMP_BONUS_POST_TAX_COST");
					var empBonsPostTaxCstVlu= _this.byId("MB_LABEL_EMP_BONUS_POST_TAX_COST_VALUE");
					
					var addtnlPstTaxVisblty= _this.byId("MB_FORM_ADDTNL_POSTTAXCOST");
					var addtnlPstTaxVlu= _this.byId("MB_LABEL_ADDTNL_POSTTAXCOST_VALUE");
					
					var imputedIncomeVisblty= _this.byId("MB_FORM_IMPUTED_INCOME");
					var imputedIncomeVlu= _this.byId("MB_LABEL_IMPUTED_INCOME_VALUE");
					
					var employerCstVisblty= _this.byId("MB_FORM_EMPLOYER_COSTS");
					var employerCstVlu= _this.byId("MB_LABEL_EMPLOYER_COSTS_VALUE");
								    							
					 objHeader.setTitle(curntBnftPlan.PlanTypeText);  objHeader.setNumber(curntBnftPlan.Coverage);
					 _this.byId("MB_PLAN_SUB_TYPE_TEXT").setText(curntBnftPlan.PlanSubTypeText);
					 
					 _this.byId("MB_PLAN_OPTION_TEXT").setText(curntBnftPlan.PlanOptionText);
					 _this.byId("MB_PLAN_PERIOD").setText(hcm.emp.mybenefits.util.Formatter.mbPeriod(_this.resourceBundle.getText("MB_PARTICIPATION_PERIOD"),curntBnftPlan.ParticipationBegin,curntBnftPlan.ParticipationEnd));
					 
					 formEvdncVisibility.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleInsurability(curntBnftPlan.InsurabilityRequired,curntBnftPlan.StatusText));
					 sbmtLblValue.setText(hcm.emp.mybenefits.util.Formatter.mbSubmitInsurabilityBefore(curntBnftPlan.InsurabilitySubDate));
					 
					 GrpNumVisibility.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisible(curntBnftPlan.PlanNo));
					 _this.byId("MB_LABEL_GROUP_NUMBER_VALUE").setText(curntBnftPlan.PlanNo);
					 
					 payrlFreqVisiblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisible(curntBnftPlan.ParticipationPeriod));
					 _this.byId("MB_LABEL_PAYROLL_FREQUENCY_VALUE").setText(curntBnftPlan.ParticipationPeriod);
					 
					 preTaxCostVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.EmpPreTaxCost));
					 preTaxCostValue.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.EmpPreTaxCost,curntBnftPlan.Currency));
					 
					 empBonsPreTaxCstVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.BonPreTaxCost));
					 empBonsPreTaxCstVlu.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.BonPreTaxCost,curntBnftPlan.Currency));
					 
					 postTaxCstVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.EmpPostTaxCost));
					 postTaxCostValue.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.EmpPostTaxCost,curntBnftPlan.Currency));
					 
					 empBonsPostTaxCstVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.BonPostTaxCost));
					 empBonsPostTaxCstVlu.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.BonPostTaxCost,curntBnftPlan.Currency));
					 
					 addtnlPstTaxVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.EmpAddPostTaxCost));
					 addtnlPstTaxVlu.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.EmpAddPostTaxCost,curntBnftPlan.Currency));
					 
					 imputedIncomeVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.ImputedIncome));
					 imputedIncomeVlu.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.ImputedIncome,curntBnftPlan.Currency));
					 
					 employerCstVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.EmployerCost));
					 employerCstVlu.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.EmployerCost,curntBnftPlan.Currency));
					 
					 
					 hcm.emp.mybenefits.util.DataManager.getHealthDependants(_this,curntBnftPlan,function(objResponse) {
						 var dependants= _this.byId("MB_LABEL_DEPENDANTS");
							_this.objBenfitsCollection = {"Dependants" : objResponse.Dependants.results};
							_this.oView.setModel(new sap.ui.model.json.JSONModel(_this.objBenfitsCollection));
							dependants.bindAggregation("items",{
								 path : "/Dependants",
								 template : new sap.m.FeedListItem({
									 iconActive: false,
									 icon:hcm.emp.mybenefits.util.Formatter.displayContactPicture("{DepName}"),
									 text:hcm.emp.mybenefits.util.Formatter.mbDependants("{DepName}","{Relation}")
									 
								 })
							 });
					 });
				}
                this._buildAttachments(curntBnftPlan);
                this._hideNoValueFields();
                
            }
            
        }, this);
        
        
        var oView = this.getView();
    //    var IconTabFilter = new sap.m.IconTabFilter
        this.oTabBar = oView.byId("TabContainer");
        /**
         * @ControllerHook Initialize the custom tabs
         * added by the extension application.
         * This hook method can be used to initialize additional tabs of the tab bar from code.
         * It is called during S3 view initialization.  The controller extension should obtain   
         * references to the new tabs, which can be used later in the configureAdditionalTabs 
         * hook method.
         * @callback hcm.emp.mybenefits.view.S3~extHookInitAdditionalTabs
         * @param {object} oTabBar - contains the tab bar object.
         * @return {void}
         */
        if (this.extHookInitAdditionalTabs) {
        	this.extHookInitAdditionalTabs(this.oTabBar);
        }
    },

    /**
     * handler for data visibility
     */
    _hideNoValueFields: function() {
        // No data check for information section
        var view = this;
        if (!(view.byId("MB_LABEL_EVIDENCE_INSURABILITY_VALUE").getVisible()) && !(view.byId("MB_LABEL_GROUP_NUMBER_VALUE").getVisible()) && !(view.byId("MB_LABEL_PAYROLL_FREQUENCY_VALUE").getVisible()) && !(view.byId("MB_LABEL_PRETAXCOST_VALUE").getVisible()) && !(view.byId("MB_LABEL_POSTTAXCOST_VALUE").getVisible()) && !(view.byId("MB_LABEL_ADDTNL_POSTTAXCOST_VALUE").getVisible()) && !(view.byId("MB_LABEL_IMPUTED_INCOME_VALUE").getVisible()) && !(view.byId("MB_LABEL_EMPLOYER_COSTS").getVisible())) {
            view.byId("MB_LABEL_NO_DATA").setVisible(true);
            view.byId("MB_FORM_NO_DATA").setVisible(true);
            view.byId("MB_LABEL_INFORMATION").destroyTitle();
        } else {
            view.byId("MB_LABEL_NO_DATA").setVisible(false);
            view.byId("MB_FORM_NO_DATA").setVisible(false);
            view.byId("MB_LABEL_INFORMATION").setTitle("");
        }
    },

    /**
     * [_buildAttachments handler for Attachment update]
     * @param  {[type]} oContext [description]
     * @return {[type]}          [description]
     */
    _buildAttachments: function(oContext) {
    	 var attachments = hcm.emp.mybenefits.util.Utilities.formAttachments(oContext),
             attachmenttab = this.byId("Attachment");
        this.getView().setModel(attachments, "attachmentsModel");
        if (attachments.getData().length >= 1) {
            attachmenttab.setCount(attachments.getData()[0].length);
            attachmenttab.setVisible(true);
        } else {
            attachmenttab.setCount(0);
            attachmenttab.setVisible(false);
        }
    },

    /**
     * [onSenderPress handler for opening Attachment link]
     * @param  {[type]} oEvent [description]
     * @return {[type]}        [description]
     */
    onSenderPress: function(oEvent) {
        var path = oEvent.oSource.oBindingContexts.attachmentsModel.getProperty().UrlPlan;
        sap.m.URLHelper.redirect(path, true);
    },

    getHeaderFooterOptions: function() {
    	
    	var objHdrFtr = {
            sI18NDetailTitle: this.resourceBundle.getText("MB_APP_DETAIL_TITLE"),
            oAddBookmarkSettings: {
                title: this.resourceBundle.getText("MB_APP_TITLE"),        
                icon:"sap-icon://family-care"
            }
    	};
    	/**
         * @ControllerHook Modify the footer buttons
         * This hook method can be used to add and change buttons for the detail view footer
         * It is called when the decision options for the detail item are fetched successfully
         * @callback hcm.emp.mybenefits.view.S3~extHookChangeFooterButtons
         * @param {object} objHdrFtr-Header Footer Object
         * @return {object} objHdrFtr-Header Footer Object
         */
    	
    	if (this.extHookChangeFooterButtons) {
    		objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
    	};
    	
        //Note:Back button issue
        /*,
               onBack: jQuery.proxy(function() {
                //Check if a navigation to master is the previous entry in the history
                var sDir = sap.ui.core.routing.History.getInstance().getDirection(this.oRouter.getURL("master"));
                if (sDir === "Backwards") {
                    window.history.go(-1);
                } else {
                    //we came from somewhere else - create the master view
                    this.oRouter.navTo("master");
                }
            }, this)*/
          //Note: End Back button issue
        
    	
        return objHdrFtr;
    }

});

},
	"hcm/emp/mybenefits/view/S3.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n       xmlns:core="sap.ui.core"\n       xmlns="sap.m"\n       xmlns:f="sap.ui.layout.form"\n       xmlns:l="sap.ui.layout"\n       xmlns:me="sap.me"\n       controllerName="hcm.emp.mybenefits.view.S3">\n       <Page title="{i18n>MB_APP_DETAIL_TITLE}">\n              <content>\n                     <ObjectHeader\n                           id="MB_HEALTH_HEADER">\n                           <attributes>\n                                  <ObjectAttribute\n                                         id="MB_PLAN_SUB_TYPE_TEXT"/>\n                                  <ObjectAttribute\n                                         id="MB_PLAN_OPTION_TEXT"/>\n                                  <ObjectAttribute\n                                         id="MB_PLAN_PERIOD"/>\n                           </attributes>\n                           <!-- extension point for additional fields in header -->\n                <core:ExtensionPoint name="extS3Header"></core:ExtensionPoint>\n                     </ObjectHeader>\n                     <IconTabBar\n                           expandable="true"\n                           id="TabContainer">\n                           <items>\n                                  <IconTabFilter\n                                         icon="sap-icon://hint"\n                                         iconColor="Default"\n                                         key="Information">\n                                         <content>\n                                                <VBox>\n                                                       <f:Form id="informationForm">\n                                                              <f:layout>\n                                                                     <f:ResponsiveLayout id="informationLayout" />\n                                                              </f:layout>\n                                                              <f:formContainers>\n                                                                     <f:FormContainer\n                                                                           id="MB_LABEL_INFORMATION"\n                                                                           title="{i18n>MB_INFORMATION}">\n                                                                           <f:layoutData>\n                                                                                  <l:ResponsiveFlowLayoutData\n                                                                                         linebreak="true"\n                                                                                         margin="false"></l:ResponsiveFlowLayoutData>\n                                                                           </f:layoutData>\n                                                                           <f:formElements>\n                                                                                  <f:FormElement\n                                                                                         id="MB_FORM_NO_DATA"\n                                                                                         visible="true">\n                                                                                         <f:layoutData>\n                                                                                                <l:ResponsiveFlowLayoutData\n                                                                                                       linebreak="true"\n                                                                                                       margin="false"></l:ResponsiveFlowLayoutData>\n                                                                                         </f:layoutData>\n                                                                                         <f:label>\n                                                                                                <Label\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_NO_DATA"\n                                                                                                       text="{i18n>MB_NO_DATA}">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     weight="3"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Label>\n                                                                                         </f:label>\n                                                                                         <f:fields>\n                                                                                                <Text\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_NO_DATA_DUMMY">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     weight="5"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Text>\n                                                                                         </f:fields>\n                                                                                  </f:FormElement>\n                                                                                  <f:FormElement\n                                                                                         id="MB_FORM_EVIDENCE_INSURABILITY">\n                                                                                         <f:layoutData>\n                                                                                                <l:ResponsiveFlowLayoutData\n                                                                                                       linebreak="true"\n                                                                                                       margin="false"></l:ResponsiveFlowLayoutData>\n                                                                                         </f:layoutData>\n                                                                                         <f:label>\n                                                                                                <Label\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_EVIDENCE_INSURABILITY"\n                                                                                                       text="{i18n>MB_LABEL_EVIDENCE_INSURABILITY}">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Label>\n                                                                                         </f:label>\n                                                                                         <f:fields>\n                                                                                                <Text\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_EVIDENCE_INSURABILITY_VALUE">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Text>\n                                                                                         </f:fields>\n                                                                                  </f:FormElement>\n                                                                                  <f:FormElement\n                                                                                         id="MB_FORM_GROUP_NUMBER">\n                                                                                         <f:layoutData>\n                                                                                                <l:ResponsiveFlowLayoutData\n                                                                                                       linebreak="true"\n                                                                                                       margin="false"></l:ResponsiveFlowLayoutData>\n                                                                                         </f:layoutData>\n                                                                                         <f:label>\n                                                                                                <Label\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_GROUP_NUMBER"\n                                                                                                       text="{i18n>MB_GROUP_NUMBER}">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Label>\n                                                                                         </f:label>\n                                                                                         <f:fields>\n                                                                                                <Text\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_GROUP_NUMBER_VALUE">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Text>\n                                                                                         </f:fields>\n                                                                                  </f:FormElement>\n                                                                                  <f:FormElement\n                                                                                         id="MB_FORM_PAYROLL_FREQUENCY">\n                                                                                         <f:layoutData>\n                                                                                                <l:ResponsiveFlowLayoutData\n                                                                                                       linebreak="true"\n                                                                                                       margin="false"></l:ResponsiveFlowLayoutData>\n                                                                                         </f:layoutData>\n                                                                                         <f:label>\n                                                                                                <Label\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_PAYROLL_FREQUENCY"\n                                                                                                       text="{i18n>MB_PAYROLL_FREQUENCY}">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Label>\n                                                                                         </f:label>\n                                                                                         <f:fields>\n                                                                                                <Text\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_PAYROLL_FREQUENCY_VALUE">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Text>\n                                                                                         </f:fields>\n                                                                                  </f:FormElement>\n                                                                                  <f:FormElement\n                                                                                         id="MB_FORM_PRETAXCOST">\n                                                                                         <f:layoutData>\n                                                                                                <l:ResponsiveFlowLayoutData\n                                                                                                       linebreak="true"\n                                                                                                       margin="false"></l:ResponsiveFlowLayoutData>\n                                                                                         </f:layoutData>\n                                                                                         <f:label>\n                                                                                                <Label\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_PRETAXCOST"\n                                                                                                       text="{i18n>MB_EMP_PRE_TAX_COST}">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Label>\n                                                                                         </f:label>\n                                                                                         <f:fields>\n                                                                                                <Text\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_PRETAXCOST_VALUE">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Text>\n                                                                                         </f:fields>\n                                                                                  </f:FormElement>\n                                                                                  <f:FormElement\n                                                                                         id="MB_FORM_EMP_BONUS_PRE_TAX_COST">\n                                                                                         <f:layoutData>\n                                                                                                <l:ResponsiveFlowLayoutData\n                                                                                                       linebreak="true"\n                                                                                                       margin="false"></l:ResponsiveFlowLayoutData>\n                                                                                         </f:layoutData>\n                                                                                         <f:label>\n                                                                                                <Label\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_EMP_BONUS_PRE_TAX_COST"\n                                                                                                       text="{i18n>MB_EMP_BONUS_PRE_TAX_COST}">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Label>\n                                                                                         </f:label>\n                                                                                         <f:fields>\n                                                                                                <Text\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_EMP_BONUS_PRE_TAX_COST_VALUE">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Text>\n                                                                                         </f:fields>\n                                                                                  </f:FormElement>\n                                                                                  <f:FormElement\n                                                                                         id="MB_FORM_POSTTAXCOST">\n                                                                                         <f:layoutData>\n                                                                                                <l:ResponsiveFlowLayoutData\n                                                                                                       linebreak="true"\n                                                                                                       margin="false"></l:ResponsiveFlowLayoutData>\n                                                                                         </f:layoutData>\n                                                                                         <f:label>\n                                                                                                <Label\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_POSTTAXCOST"\n                                                                                                       text="{i18n>MB_EMP_POST_TAX_COST}">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Label>\n                                                                                         </f:label>\n                                                                                         <f:fields>\n                                                                                                <Text\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_POSTTAXCOST_VALUE">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Text>\n                                                                                         </f:fields>\n                                                                                  </f:FormElement>\n                                                                                  <f:FormElement\n                                                                                         id="MB_FORM_EMP_BONUS_POST_TAX_COST">\n                                                                                         <f:layoutData>\n                                                                                                <l:ResponsiveFlowLayoutData\n                                                                                                       linebreak="true"\n                                                                                                       margin="false"></l:ResponsiveFlowLayoutData>\n                                                                                         </f:layoutData>\n                                                                                         <f:label>\n                                                                                                <Label\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_EMP_BONUS_POST_TAX_COST"\n                                                                                                       text="{i18n>MB_EMP_BONUS_POST_TAX_COST}">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Label>\n                                                                                         </f:label>\n                                                                                         <f:fields>\n                                                                                                <Text\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_EMP_BONUS_POST_TAX_COST_VALUE">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Text>\n                                                                                         </f:fields>\n                                                                                  </f:FormElement>\n                                                                                  <f:FormElement\n                                                                                         id="MB_FORM_ADDTNL_POSTTAXCOST">\n                                                                                         <f:layoutData>\n                                                                                                <l:ResponsiveFlowLayoutData\n                                                                                                       linebreak="true"\n                                                                                                       margin="false"></l:ResponsiveFlowLayoutData>\n                                                                                         </f:layoutData>\n                                                                                         <f:label>\n                                                                                                <Label\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_ADDTNL_POSTTAXCOST"\n                                                                                                       text="{i18n>MB_EMP_ADDITIONAL_POST_TAX_COST}">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Label>\n                                                                                         </f:label>\n                                                                                         <f:fields>\n                                                                                                <Text\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_ADDTNL_POSTTAXCOST_VALUE">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Text>\n                                                                                         </f:fields>\n                                                                                  </f:FormElement>\n                                                                                  <f:FormElement\n                                                                                         id="MB_FORM_IMPUTED_INCOME">\n                                                                                         <f:layoutData>\n                                                                                                <l:ResponsiveFlowLayoutData\n                                                                                                       linebreak="true"\n                                                                                                       margin="false"></l:ResponsiveFlowLayoutData>\n                                                                                         </f:layoutData>\n                                                                                         <f:label>\n                                                                                                <Label\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_IMPUTED_INCOME"\n                                                                                                       text="{i18n>MB_Imputed_Income}">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Label>\n                                                                                         </f:label>\n                                                                                         <f:fields>\n                                                                                                <Text\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_IMPUTED_INCOME_VALUE">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Text>\n                                                                                         </f:fields>\n                                                                                  </f:FormElement>\n                                                                                  <f:FormElement\n                                                                                         id="MB_FORM_EMPLOYER_COSTS">\n                                                                                         <f:layoutData>\n                                                                                                <l:ResponsiveFlowLayoutData\n                                                                                                       linebreak="true"\n                                                                                                       margin="false"></l:ResponsiveFlowLayoutData>\n                                                                                         </f:layoutData>\n                                                                                         <f:label>\n                                                                                                <Label\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_EMPLOYER_COSTS"\n                                                                                                       text="{i18n>MB_EMPLOYER_COSTS}">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Label>\n                                                                                         </f:label>\n                                                                                         <f:fields>\n                                                                                                <Text\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_EMPLOYER_COSTS_VALUE">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Text>\n                                                                                         </f:fields>\n                                                                                  </f:FormElement>\n                                                                           </f:formElements>\n                                                                     </f:FormContainer>\n                                                              </f:formContainers>\n                                                       </f:Form>\n                                                       <List\n                                                              visible="true"\n                                                              id="MB_LABEL_DEPENDANTS"\n                                                              headerDesign="Plain"\n                                                              showSeparators="None"\n                                                              noDataText="{i18n>MB_NO_DATA}"\n                                                              headerText="{i18n>MB_DEPENDENTS}"\n                                                              showNoData="true">\n                                                            \n                                                       </List>\n                                                </VBox>\n                                         </content>\n                                  </IconTabFilter>\n                                  <IconTabFilter\n                                         icon="sap-icon://attachment"\n                                         iconColor="Default"\n                                         key="Attachments"\n                                         id="Attachment">\n                                         <content>\n                                                <List\n                                                       id="MB_LABEL_DOCUMENT"\n                                                       showSeparators="Inner"\n                                                       noDataText="{i18n>MB_NO_DATA}"\n                                                       items="{attachmentsModel>/0}">\n                                                       <StandardListItem\n                                                              type="Active"\n                                                              icon="sap-icon://chain-link"\n                                                              title="{attachmentsModel>UrlPlanText}"\n                                                              press="onSenderPress"></StandardListItem>\n                                                </List>\n                                         </content>\n                                  \n                                  </IconTabFilter>\n                                         <!-- extension added to add icon tab filter --> \n                <core:ExtensionPoint name="extS3IconTabFilter"></core:ExtensionPoint>\n                           </items>\n                     </IconTabBar>\n              </content>\n       </Page>\n</core:View>\n\n',
	"hcm/emp/mybenefits/view/S4.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("hcm.emp.mybenefits.util.Formatter");
jQuery.sap.require("hcm.emp.mybenefits.util.Utilities");
this.utilFormatter = hcm.emp.mybenefits.util.Formatter;
sap.ca.scfld.md.controller.BaseDetailController.extend("hcm.emp.mybenefits.view.S4", {
	
//	Controller Hook method definitions

//	This hook method can be used to initialize additional tabs of the icon tab filter from code.
//	It is called during S4 view initialization.  The controller extension should obtain   
//	references to the new icon tabs
	extHookInitAdditionalTabs: null,
	
//	This hook method can be used to add and change buttons for the detail view footer
//	It is called when the decision options for the detail item are fetched successfully
	extHookChangeFooterButtons: null,
	
	onInit: function() {
		// execute the onInit for the base class
		// BaseDetailController
		sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
		this.oDataModel = this.oApplicationFacade.getODataModel();
		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		hcm.emp.mybenefits.util.DataManager.init(this.oDataModel, this.resourceBundle);

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "Insurance") {
				hcm.emp.mybenefits.util.DataManager.init(this.oDataModel, this.resourceBundle);

				oEvent.getParameter("arguments").contextPath = decodeURIComponent(oEvent.getParameter("arguments").contextPath);

				var _this = this;

				var contextPath = decodeURIComponent(oEvent.getParameter("arguments").contextPath);
				var indexVal = contextPath.split("/")[1];

				var  benefitsPlancollection = hcm.emp.mybenefits.util.DataManager.getCachedModelObjProp("benefitsPlan");

				_this.byId("TabContainer").setSelectedKey("Information");
				_this.byId("TabContainer").setExpanded(true);
				
				if (benefitsPlancollection) {

					var curntBnftPlan = benefitsPlancollection.Benefits[indexVal];	

					var objHeader= _this.byId("MB_INSURANCE_HEADER");
					var formEvdncVisibility=_this.byId("MB_FORM_EVIDENCE_INSURABILITY");
					var sbmtLblValue=_this.byId("MB_LABEL_EVIDENCE_INSURABILITY_VALUE");

					var FrmPlnNumVisblty=_this.byId("MB_FORM_PLAN_NUMBER");
					var payrlFreqVisiblty=_this.byId("MB_FORM_PAYROLL_FREQUENCY");

					var preTaxCostVisblty=_this.byId("MB_FORM_PRETAXCOST");
					var preTaxCostValue=_this.byId("MB_LABEL_PRETAXCOST_VALUE");

					var empBonsPreTaxCstVisblty=_this.byId("MB_FORM_EMP_BONUS_PRE_TAX_COST");
					var empBonsPreTaxCstVlu=_this.byId("MB_LABEL_EMP_BONUS_PRE_TAX_COST_VALUE");

					var postTaxCstVisblty=_this.byId("MB_FORM_POSTTAXCOST");
					var postTaxCostValue=_this.byId("MB_LABEL_POSTTAXCOST_VALUE");

					var empBonsPostTaxCstVisblty=_this.byId("MB_FORM_EMP_BONUS_POST_TAX_COST");
					var empBonsPostTaxCstVlu= _this.byId("MB_LABEL_EMP_BONUS_POST_TAX_COST_VALUE");

					var employerCstVisblty= _this.byId("MB_FORM_EMPLOYER_COSTS");
					var employerCstVlu= _this.byId("MB_LABEL_EMPLOYER_COSTS_VALUE");



					objHeader.setTitle(curntBnftPlan.PlanTypeText);  
					objHeader.setNumber(hcm.emp.mybenefits.util.Formatter.formatAmount(curntBnftPlan.Coverage,curntBnftPlan.Currency));
					objHeader.setNumberUnit(curntBnftPlan.Currency);

					_this.byId("MB_PLAN_SUB_TYPE_TEXT").setText(curntBnftPlan.PlanSubTypeText);
					_this.byId("MB_PLAN_OPTION_TEXT").setText(curntBnftPlan.PlanOptionText);
					_this.byId("MB_PLAN_PERIOD").setText(hcm.emp.mybenefits.util.Formatter.mbPeriod(_this.resourceBundle.getText("MB_PARTICIPATION_PERIOD"),curntBnftPlan.ParticipationBegin,curntBnftPlan.ParticipationEnd));

					formEvdncVisibility.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleInsurability(curntBnftPlan.InsurabilityRequired,curntBnftPlan.StatusText));
					sbmtLblValue.setText(hcm.emp.mybenefits.util.Formatter.mbSubmitInsurabilityBefore(curntBnftPlan.InsurabilitySubDate));

					FrmPlnNumVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisible(curntBnftPlan.PlanNo));
					_this.byId("MB_LABEL_PLAN_NUMBER_VALUE").setText(curntBnftPlan.PlanNo);

					payrlFreqVisiblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisible(curntBnftPlan.ParticipationPeriod));
					_this.byId("MB_LABEL_PAYROLL_FREQUENCY_VALUE").setText(curntBnftPlan.ParticipationPeriod);

					preTaxCostVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.EmpPreTaxCost));
					preTaxCostValue.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.EmpPreTaxCost,curntBnftPlan.Currency));

					empBonsPreTaxCstVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.BonPreTaxCost));
					empBonsPreTaxCstVlu.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.BonPreTaxCost,curntBnftPlan.Currency));

					postTaxCstVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.EmpPostTaxCost));
					postTaxCostValue.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.EmpPostTaxCost,curntBnftPlan.Currency));

					empBonsPostTaxCstVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.BonPostTaxCost));
					empBonsPostTaxCstVlu.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.BonPostTaxCost,curntBnftPlan.Currency));

					employerCstVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.EmployerCost));
					employerCstVlu.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.EmployerCost,curntBnftPlan.Currency));

					this._buildAttachments(curntBnftPlan/*this.oDataModel.oData[oEvent
	            .getParameter("arguments").contextPath]*/);


					hcm.emp.mybenefits.util.DataManager.getBeneficiaries(_this,curntBnftPlan,function(objResponse) {
						var beneficiaries= _this.byId("MB_LABEL_BENEFICIARIES");
						beneficiaries.setVisible( objResponse.BeneficiaryExists);
						_this.objBenfitsCollection = {"Beneficiary" : objResponse.Beneficiary.results};
						beneficiaries.setModel(new sap.ui.model.json.JSONModel(_this.objBenfitsCollection));
						beneficiaries.bindAggregation("items",{
							path : "/Beneficiary",
							template : new sap.m.FeedListItem({
								iconActive: false,
								icon:"{path:'BenName', formatter:'utilFormatter.displayContactPicture'}",
								sender:"{ContingentUI}",
								senderActive: false ,
								text:"{parts: [{path: 'BenName'}, {path: 'Relation'}], formatter:'utilFormatter.mbDependants'}",
								info:"{BenPctUI}"
							})
						});
					});
				}
			
				this._buildAttachments(curntBnftPlan);
				this._hideNoValueFields();

			}

		}, this);
		   var oView = this.getView();
		    //    var IconTabFilter = new sap.m.IconTabFilter
		        this.oTabBar = oView.byId("TabContainer");
		        /**
		         * @ControllerHook Initialize the custom tabs
		         * added by the extension application.
		         * This hook method can be used to initialize additional tabs of the tab bar from code.
		         * It is called during S4 view initialization.  The controller extension should obtain   
		         * references to the new tabs, which can be used later in the configureAdditionalTabs 
		         * hook method.
		         * @callback hcm.emp.mybenefits.view.S4~extHookInitAdditionalTabs
		         * @param {object} oTabBar - contains the tab bar object.
		         * @return {void}
		         */
		        if (this.extHookInitAdditionalTabs) {
		        	this.extHookInitAdditionalTabs(this.oTabBar);
		        }
},

    /**
     * handler for data loading
     */
    _hideNoValueFields: function() {
        // No data check for information section
        var view = this;
        if (!(view.byId("MB_LABEL_EVIDENCE_INSURABILITY_VALUE").getVisible()) && !(view.byId("MB_LABEL_PLAN_NUMBER_VALUE").getVisible()) && !(view.byId("MB_LABEL_PAYROLL_FREQUENCY_VALUE").getVisible()) && !(view.byId("MB_LABEL_PRETAXCOST_VALUE").getVisible()) && !(view.byId("MB_LABEL_POSTTAXCOST_VALUE").getVisible()) && !(view.byId("MB_LABEL_EMPLOYER_COSTS").getVisible())) {
            view.byId("MB_LABEL_NO_DATA").setVisible(true);
            view.byId("MB_FORM_NO_DATA").setVisible(true);
            view.byId("MB_LABEL_INFORMATION").destroyTitle();
        } else {
            view.byId("MB_LABEL_NO_DATA").setVisible(false);
            view.byId("MB_FORM_NO_DATA").setVisible(false);
            view.byId("MB_LABEL_INFORMATION").setTitle("");
        }
    },

    _buildAttachments: function(oContext) {
        var attachments = hcm.emp.mybenefits.util.Utilities.formAttachments(oContext),
            attachmenttab = this.byId("Attachment");
        this.getView().setModel(attachments, "attachmentsModel");
        if (attachments.getData().length >= 1) {
            attachmenttab.setCount(attachments.getData()[0].length);
            attachmenttab.setVisible(true);
        } else {
            attachmenttab.setCount(0);
            attachmenttab.setVisible(false);
        }
    },

    onSenderPress: function(oEvent) {
        var path = oEvent.oSource.oBindingContexts.attachmentsModel.getProperty().UrlPlan;
        sap.m.URLHelper.redirect(path, true);
    },

    getHeaderFooterOptions: function() {
    	var objHdrFtr = {
                sI18NDetailTitle: this.resourceBundle.getText("MB_APP_DETAIL_TITLE"),
                oAddBookmarkSettings: {
                    title: this.resourceBundle.getText("MB_APP_TITLE"),        
                    icon:"sap-icon://family-care"
                }
        	};
        	/**
             * @ControllerHook Modify the footer buttons
             * This hook method can be used to add and change buttons for the detail view footer
             * It is called when the decision options for the detail item are fetched successfully
             * @callback hcm.emp.mybenefits.view.S4~extHookChangeFooterButtons
             * @param {object} objHdrFtr-Header footer object
             * @return {object} objHdrFtr-Header footer object
             */
        	
        	if (this.extHookChangeFooterButtons) {
        		objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
        	};
        	
            //Note:Back button issue
            /*,
                   onBack: jQuery.proxy(function() {
                    //Check if a navigation to master is the previous entry in the history
                    var sDir = sap.ui.core.routing.History.getInstance().getDirection(this.oRouter.getURL("master"));
                    if (sDir === "Backwards") {
                        window.history.go(-1);
                    } else {
                        //we came from somewhere else - create the master view
                        this.oRouter.navTo("master");
                    }
                }, this)*/
              //Note: End Back button issue
            
        	
            return objHdrFtr;
        }


});

},
	"hcm/emp/mybenefits/view/S4.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n       xmlns:core="sap.ui.core"\n       xmlns="sap.m"\n       xmlns:f="sap.ui.layout.form"\n       xmlns:l="sap.ui.layout"\n       xmlns:me="sap.me"\n       controllerName="hcm.emp.mybenefits.view.S4">\n       <Page\n              title="{i18n>MB_APP_DETAIL_TITLE}"\n              id="MB_PAGE_INSURANCE">\n              <content>\n                     <ObjectHeader\n                           id="MB_INSURANCE_HEADER">\n                           <attributes>\n                                  <ObjectAttribute\n                                         id="MB_PLAN_SUB_TYPE_TEXT"/>\n                                  <ObjectAttribute\n                                         id="MB_PLAN_OPTION_TEXT"/>\n                                  <ObjectAttribute\n                                         id="MB_PLAN_PERIOD"/>\n                           </attributes>\n                           <!-- extension point for additional fields in header -->\n                <core:ExtensionPoint name="extS4Header"></core:ExtensionPoint>\n                     </ObjectHeader>\n                     <IconTabBar\n                           expandable="true"\n                           id="TabContainer">\n                           <items>\n                                  <IconTabFilter\n                                         icon="sap-icon://hint"\n                                         iconColor="Default"\n                                         key="Information">\n                                         <content>\n                                                <VBox>\n                                                       <f:Form id="informationForm">\n                                                              <f:layout>\n                                                                     <f:ResponsiveLayout id="informationLayout" />\n                                                              </f:layout>\n                                                              <f:formContainers>\n                                                                     <f:FormContainer\n                                                                           id="MB_LABEL_INFORMATION"\n                                                                           title="{i18n>MB_INFORMATION}">\n                                                                           <f:layoutData>\n                                                                                  <l:ResponsiveFlowLayoutData\n                                                                                         linebreak="true"\n                                                                                         data-margin="false"></l:ResponsiveFlowLayoutData>\n                                                                           </f:layoutData>\n                                                                           <f:formElements>\n                                                                                  <f:FormElement\n                                                                                         id="MB_FORM_NO_DATA"\n                                                                                         visible="true">\n                                                                                         <f:layoutData>\n                                                                                                <l:ResponsiveFlowLayoutData\n                                                                                                       linebreak="true"\n                                                                                                       data-margin="false"></l:ResponsiveFlowLayoutData>\n                                                                                         </f:layoutData>\n                                                                                         <f:label>\n                                                                                                <Label\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_NO_DATA"\n                                                                                                       text="{i18n>MB_NO_DATA}">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     data-weight="3"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Label>\n                                                                                         </f:label>\n                                                                                         <f:fields>\n                                                                                                <Text\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_NO_DATA_DUMMY">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     data-weight="5"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Text>\n                                                                                         </f:fields>\n                                                                                  </f:FormElement>\n                                                                                  <f:FormElement\n                                                                                         id="MB_FORM_EVIDENCE_INSURABILITY">\n                                                                                         <f:layoutData>\n                                                                                                <l:ResponsiveFlowLayoutData\n                                                                                                       linebreak="true"\n                                                                                                       data-margin="false"></l:ResponsiveFlowLayoutData>\n                                                                                         </f:layoutData>\n                                                                                         <f:label>\n                                                                                                <Label\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_EVIDENCE_INSURABILITY"\n                                                                                                       text="{i18n>MB_LABEL_EVIDENCE_INSURABILITY}">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     data-weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Label>\n                                                                                         </f:label>\n                                                                                         <f:fields>\n                                                                                                <Text\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_EVIDENCE_INSURABILITY_VALUE">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     data-weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Text>\n                                                                                         </f:fields>\n                                                                                  </f:FormElement>\n                                                                                  <f:FormElement\n                                                                                         id="MB_FORM_PLAN_NUMBER">\n                                                                                         <f:layoutData>\n                                                                                                <l:ResponsiveFlowLayoutData\n                                                                                                       linebreak="true"\n                                                                                                       data-margin="false"></l:ResponsiveFlowLayoutData>\n                                                                                         </f:layoutData>\n                                                                                         <f:label>\n                                                                                                <Label\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_PLAN_NUMBER"\n                                                                                                       text="{i18n>MB_PLAN_NUMBER}">\n                                                                                                       <layoutData>\n                                                                                                             <l:ResponsiveFlowLayoutData\n                                                                                                                     data-weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Label>\n                                                                                         </f:label>\n                                                                                         <f:fields>\n                                                                                                <Text\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_PLAN_NUMBER_VALUE">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     data-weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Text>\n                                                                                         </f:fields>\n                                                                                  </f:FormElement>\n                                                                                  <f:FormElement\n                                                                                         id="MB_FORM_PAYROLL_FREQUENCY">\n                                                                                         <f:layoutData>\n                                                                                                <l:ResponsiveFlowLayoutData\n                                                                                                       linebreak="true"\n                                                                                                       data-margin="false"></l:ResponsiveFlowLayoutData>\n                                                                                         </f:layoutData>\n                                                                                         <f:label>\n                                                                                                <Label\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_PAYROLL_FREQUENCY"\n                                                                                                       text="{i18n>MB_PAYROLL_FREQUENCY}">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     data-weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Label>\n                                                                                         </f:label>\n                                                                                         <f:fields>\n                                                                                                <Text\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_PAYROLL_FREQUENCY_VALUE">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     data-weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Text>\n                                                                                         </f:fields>\n                                                                                  </f:FormElement>\n                                                                                  <f:FormElement\n                                                                                         id="MB_FORM_PRETAXCOST">\n                                                                                         <f:layoutData>\n                                                                                                <l:ResponsiveFlowLayoutData\n                                                                                                       linebreak="true"\n                                                                                                       data-margin="false"></l:ResponsiveFlowLayoutData>\n                                                                                         </f:layoutData>\n                                                                                         <f:label>\n                                                                                                <Label\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_PRETAXCOST"\n                                                                                                       text="{i18n>MB_EMP_PRE_TAX_COST}">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     data-weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Label>\n                                                                                         </f:label>\n                                                                                         <f:fields>\n                                                                                                <Text\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_PRETAXCOST_VALUE">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     data-weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Text>\n                                                                                         </f:fields>\n                                                                                  </f:FormElement>\n                                                                                  <f:FormElement\n                                                                                         id="MB_FORM_EMP_BONUS_PRE_TAX_COST">\n                                                                                         <f:layoutData>\n                                                                                                <l:ResponsiveFlowLayoutData\n                                                                                                       linebreak="true"\n                                                                                                       data-margin="false"></l:ResponsiveFlowLayoutData>\n                                                                                         </f:layoutData>\n                                                                                         <f:label>\n                                                                                                <Label\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_EMP_BONUS_PRE_TAX_COST"\n                                                                                                       text="{i18n>MB_EMP_BONUS_PRE_TAX_COST}">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     data-weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Label>\n                                                                                         </f:label>\n                                                                                         <f:fields>\n                                                                                                <Text\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_EMP_BONUS_PRE_TAX_COST_VALUE">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     data-weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Text>\n                                                                                         </f:fields>\n                                                                                  </f:FormElement>\n                                                                                  <f:FormElement\n                                                                                         id="MB_FORM_POSTTAXCOST">\n                                                                                         <f:layoutData>\n                                                                                                <l:ResponsiveFlowLayoutData\n                                                                                                       linebreak="true"\n                                                                                                       data-margin="false"></l:ResponsiveFlowLayoutData>\n                                                                                         </f:layoutData>\n                                                                                         <f:label>\n                                                                                                <Label\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_POSTTAXCOST"\n                                                                                                       text="{i18n>MB_EMP_POST_TAX_COST}">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     data-weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Label>\n                                                                                         </f:label>\n                                                                                         <f:fields>\n                                                                                                <Text\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_POSTTAXCOST_VALUE">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     data-weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Text>\n                                                                                         </f:fields>\n                                                                                  </f:FormElement>\n                                                                                  <f:FormElement\n                                                                                         id="MB_FORM_EMP_BONUS_POST_TAX_COST">\n                                                                                         <f:layoutData>\n                                                                                                <l:ResponsiveFlowLayoutData\n                                                                                                       linebreak="true"\n                                                                                                       data-margin="false"></l:ResponsiveFlowLayoutData>\n                                                                                         </f:layoutData>\n                                                                                         <f:label>\n                                                                                                <Label\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_EMP_BONUS_POST_TAX_COST"\n                                                                                                       text="{i18n>MB_EMP_BONUS_POST_TAX_COST}">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     data-weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Label>\n                                                                                         </f:label>\n                                                                                         <f:fields>\n                                                                                                <Text\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_EMP_BONUS_POST_TAX_COST_VALUE">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     data-weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Text>\n                                                                                         </f:fields>\n                                                                                  </f:FormElement>\n                                                                                  <f:FormElement\n                                                                                         id="MB_FORM_EMPLOYER_COSTS">\n                                                                                         <f:layoutData>\n                                                                                                <l:ResponsiveFlowLayoutData\n                                                                                                       linebreak="true"\n                                                                                                       data-margin="false"></l:ResponsiveFlowLayoutData>\n                                                                                         </f:layoutData>\n                                                                                         <f:label>\n                                                                                                <Label\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_EMPLOYER_COSTS"\n                                                                                                       text="{i18n>MB_EMPLOYER_COSTS}">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     data-weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Label>\n                                                                                         </f:label>\n                                                                                         <f:fields>\n                                                                                                <Text\n                                                                                                       visible="true"\n                                                                                                       id="MB_LABEL_EMPLOYER_COSTS_VALUE">\n                                                                                                       <layoutData>\n                                                                                                              <l:ResponsiveFlowLayoutData\n                                                                                                                     data-weight="4"></l:ResponsiveFlowLayoutData>\n                                                                                                       </layoutData>\n                                                                                                </Text>\n                                                                                         </f:fields>\n                                                                                  </f:FormElement>\n                                                                           </f:formElements>\n                                                                     </f:FormContainer>\n                                                              </f:formContainers>\n                                                       </f:Form>\n                                                       <List\n                                                              visible="true"\n                                                              id="MB_LABEL_BENEFICIARIES"\n                                                              headerDesign="Plain"\n                                                              showSeparators="None"\n                                                              noDataText="{i18n>MB_NO_DATA}"\n                                                              headerText="{i18n>MB_BENEFICIARIES}"\n                                                              showNoData="true">\n                                                          \n                                                       </List>\n                                                </VBox>\n                                         </content>\n                                  </IconTabFilter>\n                                  <IconTabFilter\n                                         icon="sap-icon://attachment"\n                                         iconColor="Default"\n                                         key="Attachments"\n                                         id="Attachment">\n                                         <content>\n                                                <List\n                                                       id="MB_LABEL_DOCUMENT"\n                                                       showSeparators="Inner"\n                                                       noDataText="{i18n>MB_NO_DATA}"\n                                                       items="{attachmentsModel>/0}">\n                                                       <StandardListItem\n                                                              type="Active"\n                                                              icon="sap-icon://chain-link"\n                                                              title="{attachmentsModel>UrlPlanText}"\n                                                              press="onSenderPress"></StandardListItem>\n                                                </List>\n                                         </content>\n                                         </IconTabFilter>\n                                           <!-- extension added to add icon tab filter --> \n                <core:ExtensionPoint name="extS4IconTabFilter"></core:ExtensionPoint>\n                                  \n                           </items>\n                     </IconTabBar>\n              </content>\n       </Page>\n</core:View>',
	"hcm/emp/mybenefits/view/S5.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("hcm.emp.mybenefits.util.Formatter");
jQuery.sap.require("hcm.emp.mybenefits.util.Utilities");
this.utilFormatter = hcm.emp.mybenefits.util.Formatter;
sap.ca.scfld.md.controller.BaseDetailController.extend("hcm.emp.mybenefits.view.S5", {
	
//	Controller Hook method definitions

//	This hook method can be used to initialize additional tabs of the icon tab filter from code.
//	It is called during S5 view initialization.  The controller extension should obtain   
//	references to the new icon tabs
	extHookInitAdditionalTabs: null,
	
//	This hook method can be used to add and change buttons for the detail view footer
//	It is called when the decision options for the detail item are fetched successfully
	extHookChangeFooterButtons: null,
	
    onInit: function() {
    sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
    this.oDataModel = this.oApplicationFacade.getODataModel();
    this.resourceBundle = this.oApplicationFacade.getResourceBundle();
    hcm.emp.mybenefits.util.DataManager.init(this.oDataModel, this.resourceBundle);

    this.oRouter.attachRouteMatched(function(oEvent) {
        if (oEvent.getParameter("name") === "Savings") {
        	hcm.emp.mybenefits.util.DataManager.init(this.oDataModel, this.resourceBundle);
        	
        	oEvent.getParameter("arguments").contextPath = decodeURIComponent(oEvent.getParameter("arguments").contextPath);
    		
    		var _this = this;
    	
    		var contextPath = decodeURIComponent(oEvent.getParameter("arguments").contextPath);
    		var indexVal = contextPath.split("/")[1];
    		
    		var  benefitsPlancollection = hcm.emp.mybenefits.util.DataManager.getCachedModelObjProp("benefitsPlan");
    		
    		_this.byId("TabContainer").setSelectedKey("Information");
			_this.byId("TabContainer").setExpanded(true);
        	
    		if (benefitsPlancollection) {
    			
    			var curntBnftPlan = benefitsPlancollection.Benefits[indexVal];	
    			
    			var objHeader= _this.byId("MB_SAVINGS_HEADER");
    			
    			var FrmPlnNumVisblty=_this.byId("MB_FORM_PLAN_NUMBER");
    			var payrlFreqVisiblty=_this.byId("MB_FORM_PAYROLL_FREQUENCY");
    			
    			var reglrPreTaxVisblty=_this.byId("MB_FORM_REGULAR_PRE_TAX");
    			var reglrPreTaxVlu=_this.byId("MB_REGULAR_PRE_TAX_PERCENT");
    			
    			var reglrPstTaxVisblty=_this.byId("MB_FORM_REGULAR_POST_TAX");
    			var reglrPstTaxVlu=_this.byId("MB_REGULAR_POST_TAX_PERCENT");
    			
    			var bnsPreTaxCostVisblty=_this.byId("MB_FORM_BONUS_PRE_TAX");
    			var bnsPreTaxCostVlu=_this.byId("MB_BONUS_PRE_TAX_PERCENT");
    			
    			var bnsPstTaxCostVisblty=_this.byId("MB_FORM_BONUS_POST_TAX");
    			var bnsPstTaxCostVlu=_this.byId("MB_BONUS_POST_TAX_PERCENT");
    			  			
    			 objHeader.setTitle(curntBnftPlan.PlanTypeText);
    			 
    			 _this.byId("MB_PLAN_SUB_TYPE_TEXT").setText(curntBnftPlan.PlanSubTypeText);
    			 _this.byId("MB_PLAN_OPTION_TEXT").setText(curntBnftPlan.PlanOptionText);
    			 _this.byId("MB_PLAN_PERIOD").setText(hcm.emp.mybenefits.util.Formatter.mbPeriod(_this.resourceBundle.getText("MB_PARTICIPATION_PERIOD"),curntBnftPlan.ParticipationBegin,curntBnftPlan.ParticipationEnd));
    			    			 
    			 FrmPlnNumVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisible(curntBnftPlan.PlanNo));
    			 _this.byId("MB_LABEL_PLAN_NUMBER_VALUE").setText(curntBnftPlan.PlanNo);
    			 
    			 payrlFreqVisiblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisible(curntBnftPlan.ParticipationPeriod));
    			 _this.byId("MB_LABEL_PAYROLL_FREQUENCY_VALUE").setText(curntBnftPlan.ParticipationPeriod);
    			 
    			 reglrPreTaxVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.RegPreTaxCont));
    			 reglrPreTaxVlu.setText(hcm.emp.mybenefits.util.Formatter.formatContribution(curntBnftPlan.RegPreTaxCont,curntBnftPlan.Currency));  			 
    			 _this.byId("MB_FORM_REGULAR_PRE_TAX_DUMMY").setVisible(curntBnftPlan.TraPreToPost);
    			 
    			 reglrPstTaxVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.RegPostTaxCont));
    			 reglrPstTaxVlu.setText(hcm.emp.mybenefits.util.Formatter.formatContribution(curntBnftPlan.RegPostTaxCont,curntBnftPlan.Currency));
    			 _this.byId("MB_FORM_REGULAR_POST_TAX_DUMMY").setVisible(curntBnftPlan.StartPostTax_mmi);
    			 
    			 bnsPreTaxCostVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.BonPreTaxContr));
    			 bnsPreTaxCostVlu.setText(hcm.emp.mybenefits.util.Formatter.formatContribution(curntBnftPlan.BonPreTaxContr,curntBnftPlan.Currency));
    			 _this.byId("MB_FORM_BONUS_PRE_TAX_DUMMY").setVisible(curntBnftPlan.BonTraPreToPost);
    			 
    			 bnsPstTaxCostVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.BonPostTaxCont));
    			 bnsPstTaxCostVlu.setText(hcm.emp.mybenefits.util.Formatter.formatContribution(curntBnftPlan.BonPostTaxCont,curntBnftPlan.Currency));
    			 _this.byId("MB_FORM_BONUS_POST_TAX_DUMMY").setVisible(curntBnftPlan.StartBonPostTaximmi);
    			    				
    			 			
    			 hcm.emp.mybenefits.util.DataManager.getBeneficiaries(_this,curntBnftPlan,function(objResponse) {
    				 var beneficiaries= _this.byId("MB_LABEL_BENEFICIARIES");
    				 beneficiaries.setVisible( objResponse.BeneficiaryExists);
    					_this.objBenfitsCollection = {"Beneficiary" : objResponse.Beneficiary.results};
    					beneficiaries.setModel(new sap.ui.model.json.JSONModel(_this.objBenfitsCollection));
    					beneficiaries.bindAggregation("items",{
    						 path : "/Beneficiary",
    						 template : new sap.m.FeedListItem({
    							 iconActive: false,
    							 icon:"{path:'BenName', formatter:'utilFormatter.displayContactPicture'}",
    							 sender:"{ContingentUI}",
    							 senderActive: false ,
    							 text:"{parts: [{path: 'BenName'}, {path: 'Relation'}], formatter:'utilFormatter.mbDependants'}",
    							 info:"{BenPctUI}"
    						 })
    					 });
    			 });
    			 
    			 hcm.emp.mybenefits.util.DataManager.getInvestment(_this,curntBnftPlan,function(objResponse) {
    				 var investments= _this.byId("MB_LABEL_INVESTMENTS");
    				 investments.setVisible( objResponse.InvestmentExists);
    					_this.objBenfitsCollection = { "Investment": objResponse.Investment.results};
    					investments.setModel(new sap.ui.model.json.JSONModel(_this.objBenfitsCollection));
    					investments.bindAggregation("items",{
    						 path : "/Investment",
    						// visible:"{InvestmentExists}",
    						 template :  new sap.m.ColumnListItem({
    							 cells:[
    							        new sap.m.Text({text:"{InvName}"}),
    							        new sap.m.Text({text:"{parts:[{path:'InvPct'}], formatter:'utilFormatter.AppendPercent'}"}),
    							        new sap.m.Text({
    							        	 text:"{parts:[{path:'InvAmt'},{path:'Currency'}], formatter:'utilFormatter.formatAmount'}"
    							         })
    							        ]
    						 })
    					 });
    			 });
    			 

    			 
    	          _this._buildAttachments(curntBnftPlan);
    	          _this._hideNoValueFields();
    			 
    		}
         }
        
    }, this);
    var oView = this.getView();
    //    var IconTabFilter = new sap.m.IconTabFilter
        this.oTabBar = oView.byId("TabContainer");
        /**
         * @ControllerHook Initialize the custom tabs
         * added by the extension application.
         * This hook method can be used to initialize additional tabs of the tab bar from code.
         * It is called during S5 view initialization.  The controller extension should obtain   
         * references to the new tabs, which can be used later in the configureAdditionalTabs 
         * hook method.
         * @callback hcm.emp.mybenefits.view.S5~extHookInitAdditionalTabs
         * @param {object} oTabBar - contains the tab bar object.
         * @return {void}
         */
        if (this.extHookInitAdditionalTabs) {
        	this.extHookInitAdditionalTabs(this.oTabBar);
        }
    },

    /**
     * handler for data loading
     */
    _hideNoValueFields: function() {
        // No data check for information section
        var view = this;
        if (!(view.byId("MB_LABEL_PLAN_NUMBER_VALUE").getVisible()) && !(view.byId("MB_LABEL_PAYROLL_FREQUENCY_VALUE").getVisible()) && !(view.byId("MB_REGULAR_PRE_TAX_PERCENT").getVisible()) && !(view.byId("MB_REGULAR_POST_TAX_PERCENT").getVisible()) && !(view.byId("MB_BONUS_PRE_TAX_PERCENT").getVisible()) && !(view.byId("MB_BONUS_POST_TAX_PERCENT").getVisible()) && !(view.byId("MB_REGULAR_POST_TAX_TEXT").getVisible()) && !(view.byId("MB_BONUS_POST_TAX_TEXT").getVisible()) && !(view.byId("MB_REGULAR_PRE_TAX_TEXT").getVisible()) && !(view.byId("MB_BONUS_PRE_TAX_TEXT").getVisible())) {
            view.byId("MB_LABEL_NO_DATA").setVisible(true);
            view.byId("MB_FORM_NO_DATA").setVisible(true);
            view.byId("MB_LABEL_INFORMATION").destroyTitle();
        } else {
            view.byId("MB_LABEL_NO_DATA").setVisible(false);
            view.byId("MB_FORM_NO_DATA").setVisible(false);
            view.byId("MB_LABEL_INFORMATION").setTitle("");
        }
    },

    _buildAttachments: function(oContext) {
        var attachments = hcm.emp.mybenefits.util.Utilities.formAttachments(oContext),
            attachmenttab = this.byId("Attachment");
        this.getView().setModel(attachments, "attachmentsModel");
        if (attachments.getData().length >= 1) {
            attachmenttab.setCount(attachments.getData()[0].length);
            attachmenttab.setVisible(true);
        } else {
            attachmenttab.setCount(0);
            attachmenttab.setVisible(false);
        }
    },

    onSenderPress: function(oEvent) {
        var path = oEvent.oSource.oBindingContexts.attachmentsModel.getProperty().UrlPlan;
        sap.m.URLHelper.redirect(path, true);
    },

    getHeaderFooterOptions: function() {
    	
    	var objHdrFtr = {
            sI18NDetailTitle: this.resourceBundle.getText("MB_APP_DETAIL_TITLE"),
            oAddBookmarkSettings: {
                title: this.resourceBundle.getText("MB_APP_TITLE"),        
                icon:"sap-icon://family-care"
            }
    	};
    	/**
         * @ControllerHook Modify the footer buttons
         * This hook method can be used to add and change buttons for the detail view footer
         * It is called when the decision options for the detail item are fetched successfully
         * @callback hcm.emp.mybenefits.view.S5~extHookChangeFooterButtons
         * @param {object} objHdrFtr-Header Footer Object
         * @return {object} objHdrFtr-Header Footer Object
         */
    	
    	if (this.extHookChangeFooterButtons) {
    		objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
    	};
    	
        //Note:Back button issue
        /*,
               onBack: jQuery.proxy(function() {
                //Check if a navigation to master is the previous entry in the history
                var sDir = sap.ui.core.routing.History.getInstance().getDirection(this.oRouter.getURL("master"));
                if (sDir === "Backwards") {
                    window.history.go(-1);
                } else {
                    //we came from somewhere else - create the master view
                    this.oRouter.navTo("master");
                }
            }, this)*/
          //Note: End Back button issue
        
    	
        return objHdrFtr;
    }

});

},
	"hcm/emp/mybenefits/view/S5.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\txmlns:f="sap.ui.layout.form"\n\txmlns:l="sap.ui.layout"\n\txmlns:me="sap.me"\n\tcontrollerName="hcm.emp.mybenefits.view.S5">\n\t<Page\n\t\ttitle="{i18n>MB_APP_DETAIL_TITLE}"\n\t\tid="MB_PAGE_SAVINGS">\n\t\t<content>\n\t\t\t<ObjectHeader\n\t\t\t\tid="MB_SAVINGS_HEADER">\n\t\t\t\t<attributes>\n\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\tid="MB_PLAN_SUB_TYPE_TEXT"/>\n\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\tid="MB_PLAN_OPTION_TEXT" />\n\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\tid="MB_PLAN_PERIOD"/>\n\t\t\t\t</attributes>\n\t\t\t\t <!-- extension point for additional fields in header -->\n                <core:ExtensionPoint name="extS5Header"></core:ExtensionPoint>\n\t\t\t</ObjectHeader>\n\t\t\t<IconTabBar\n\t\t\t\texpandable="true"\n\t\t\t\tid="TabContainer">\n\t\t\t\t<items>\n\t\t\t\t\t<IconTabFilter\n\t\t\t\t\t\ticon="sap-icon://hint"\n\t\t\t\t\t\ticonColor="Default"\n\t\t\t\t\t\tkey="Information">\n\t\t\t\t\t\t<content>\n\t\t\t\t\t\t\t<VBox>\n\t\t\t\t\t\t\t\t<f:Form id="informationForm">\n\t\t\t\t\t\t\t\t\t<f:layout>\n\t\t\t\t\t\t\t\t\t\t<f:ResponsiveLayout id="informationLayout" />\n\t\t\t\t\t\t\t\t\t</f:layout>\n\t\t\t\t\t\t\t\t\t<f:formContainers>\n\t\t\t\t\t\t\t\t\t\t<f:FormContainer\n\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_INFORMATION"\n\t\t\t\t\t\t\t\t\t\t\ttitle="{i18n>MB_INFORMATION}">\n\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<f:formElements>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_NO_DATA"\n\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_NO_DATA"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_NO_DATA}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="3"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_NO_DATA_DUMMY">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="5"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_PLAN_NUMBER">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_PLAN_NUMBER"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_PLAN_NUMBER}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_PLAN_NUMBER_VALUE">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_PAYROLL_FREQUENCY">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_PAYROLL_FREQUENCY"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_PAYROLL_FREQUENCY}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_PAYROLL_FREQUENCY_VALUE">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_REGULAR_PRE_TAX">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_REGULAR_PRE_TAX"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_REGULAR_PRE_TAX_CONTRIBUTION}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_REGULAR_PRE_TAX_PERCENT">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_REGULAR_PRE_TAX_DUMMY">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_REGULAR_PRE_TAX_DUMMY">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_REGULAR_PRE_TAX_TEXT"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_MESSAGE_PRE_TAX_TO_POST_TAX}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_REGULAR_POST_TAX">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_REGULAR_POST_TAX"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_REGULAR_POST_TAX_CONTRIBUTION}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_REGULAR_POST_TAX_PERCENT">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_REGULAR_POST_TAX_DUMMY">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_REGULAR_POST_TAX_DUMMY">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_REGULAR_POST_TAX_TEXT"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_START_POST_TAX_CONTRIBUTIONS}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_BONUS_PRE_TAX">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_BONUS_PRE_TAX"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_BONUS_PRE_TAX_CONTRIBUTION}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_BONUS_PRE_TAX_PERCENT">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_BONUS_PRE_TAX_DUMMY">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_BONUS_PRE_TAX_DUMMY">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_BONUS_PRE_TAX_TEXT"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_MESSAGE_PRE_TAX_TO_POST_TAX}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_BONUS_POST_TAX">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_BONUS_POST_TAX"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_BONUS_POST_TAX_CONTRIBUTION}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_BONUS_POST_TAX_PERCENT">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_BONUS_POST_TAX_DUMMY">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_BONUS_POST_TAX_DUMMY">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_BONUS_POST_TAX_TEXT"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_START_POST_TAX_CONTRIBUTIONS}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t</f:formElements>\n\t\t\t\t\t\t\t\t\t\t</f:FormContainer>\n\t\t\t\t\t\t\t\t\t</f:formContainers>\n\t\t\t\t\t\t\t\t</f:Form>\n\t\t\t\t\t\t\t\t<List\n\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\tid="MB_LABEL_BENEFICIARIES"\n\t\t\t\t\t\t\t\t\theaderDesign="Plain"\n\t\t\t\t\t\t\t\t\tshowSeparators="None"\n\t\t\t\t\t\t\t\t\tnoDataText="{i18n>MB_NO_DATA}"\n\t\t\t\t\t\t\t\t\theaderText="{i18n>MB_BENEFICIARIES}"\n\t\t\t\t\t\t\t\t\tshowNoData="true">\n\t\t\t\t\t\t\t\t</List>\n\t\t\t\t\t\t\t\t<List\n\t\t\t\t\t\t\t\t\tid="MB_LABEL_INVESTMENTS"\n\t\t\t\t\t\t\t\t\theaderText="{i18n>MB_INVESTMENTS}"\n\t\t\t\t\t\t\t\t\tnoDataText="{i18n>MB_NO_DATA}">\n\t\t\t\t\t\t\t\t\t<columns>\n\t\t\t\t\t\t\t\t\t\t<Column\n\t\t\t\t\t\t\t\t\t\t\thAlign="Left"\n\t\t\t\t\t\t\t\t\t\t\tminScreenWidth="Tablet">\n\t\t\t\t\t\t\t\t\t\t\t<!-- <header> <Label text="{i18n>TYPE}"></Label> </header> -->\n\t\t\t\t\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t\t\t\t\t<Column\n\t\t\t\t\t\t\t\t\t\t\thAlign="Center"\n\t\t\t\t\t\t\t\t\t\t\tminScreenWidth="Tablet"\n\t\t\t\t\t\t\t\t\t\t\tdemandPopin="true">\n\t\t\t\t\t\t\t\t\t\t\t<!-- <header> <Label text="{i18n>DESCRIPTION}" /> </header> -->\n\t\t\t\t\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t\t\t\t\t<Column\n\t\t\t\t\t\t\t\t\t\t\thAlign="Right"\n\t\t\t\t\t\t\t\t\t\t\tminScreenWidth="Tablet"\n\t\t\t\t\t\t\t\t\t\t\tdemandPopin="true">\n\t\t\t\t\t\t\t\t\t\t\t<!-- <header> <Text text="{i18n>TRC_PERCENTAGE}" /> </header> -->\n\t\t\t\t\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t\t\t\t</columns>\n\t\t\t\t\t\t\t\t</List>\n\t\t\t\t\t\t\t</VBox>\n\t\t\t\t\t\t</content>\n\t\t\t\t\t</IconTabFilter>\n\t\t\t\t\t<IconTabFilter\n\t\t\t\t\t\ticon="sap-icon://attachment"\n\t\t\t\t\t\ticonColor="Default"\n\t\t\t\t\t\tkey="Attachments"\n\t\t\t\t\t\tid="Attachment">\n\t\t\t\t\t\t<content>\n\t\t\t\t\t\t\t<List\n\t\t\t\t\t\t\t\tid="MB_LABEL_DOCUMENT"\n\t\t\t\t\t\t\t\tshowSeparators="Inner"\n\t\t\t\t\t\t\t\tnoDataText="{i18n>MB_NO_DATA}"\n\t\t\t\t\t\t\t\titems="{attachmentsModel>/0}">\n\t\t\t\t\t\t\t\t<StandardListItem\n\t\t\t\t\t\t\t\t\ttype="Active"\n\t\t\t\t\t\t\t\t\ticon="sap-icon://chain-link"\n\t\t\t\t\t\t\t\t\ttitle="{attachmentsModel>UrlPlanText}"\n\t\t\t\t\t\t\t\t\tpress="onSenderPress"></StandardListItem>\n\t\t\t\t\t\t\t</List>\n\t\t\t\t\t\t</content>\n\t\t\t\t\t\t\t</IconTabFilter>\n\t\t\t\t\t\t  <!-- extension added to add icon tab filter --> \n                <core:ExtensionPoint name="extS5IconTabFilter"></core:ExtensionPoint>\n\t\t\t\t</items>\n\t\t\t</IconTabBar>\n\t\t</content>\n\t</Page>\n</core:View>\n',
	"hcm/emp/mybenefits/view/S6.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("hcm.emp.mybenefits.util.Formatter");
jQuery.sap.require("hcm.emp.mybenefits.util.Utilities");
this.utilFormatter = hcm.emp.mybenefits.util.Formatter;
sap.ca.scfld.md.controller.BaseDetailController.extend("hcm.emp.mybenefits.view.S6", {
//	Controller Hook method definitions

//	This hook method can be used to initialize additional tabs of the icon tab filter from code.
//	It is called during S6 view initialization.  The controller extension should obtain   
//	references to the new icon tabs
	extHookInitAdditionalTabs: null,
	
//	This hook method can be used to add and change buttons for the detail view footer
//	It is called when the decision options for the detail item are fetched successfully
	extHookChangeFooterButtons: null,

    onInit: function() {
    sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
    this.oDataModel = this.oApplicationFacade.getODataModel();
    this.resourceBundle = this.oApplicationFacade.getResourceBundle();
    hcm.emp.mybenefits.util.DataManager.init(this.oDataModel, this.resourceBundle);
    
    this.oRouter.attachRouteMatched(function(oEvent) {
        if (oEvent.getParameter("name") === "FSA") {
        	hcm.emp.mybenefits.util.DataManager.init(this.oDataModel, this.resourceBundle);
        	
        	oEvent.getParameter("arguments").contextPath = decodeURIComponent(oEvent.getParameter("arguments").contextPath);
			
			var _this = this;
		
			var contextPath = decodeURIComponent(oEvent.getParameter("arguments").contextPath);
			var indexVal = contextPath.split("/")[1];
			
			var  benefitsPlancollection = hcm.emp.mybenefits.util.DataManager.getCachedModelObjProp("benefitsPlan");
			
			_this.byId("TabContainer").setSelectedKey("Information");
			_this.byId("TabContainer").setExpanded(true);
        	
			if (benefitsPlancollection) {
				
				var curntBnftPlan = benefitsPlancollection.Benefits[indexVal];	
									
				var objHeader= _this.byId("MB_MISC_HEADER");
				var formEvdncVisibility=_this.byId("MB_FORM_EVIDENCE_INSURABILITY");
				var sbmtLblValue=_this.byId("MB_LABEL_EVIDENCE_INSURABILITY_VALUE");
				
				var FrmPlnNumVisblty=_this.byId("MB_FORM_PLAN_NUMBER");
				var payrlFreqVisiblty=_this.byId("MB_FORM_PAYROLL_FREQUENCY");
				
				var planOptVisblty=_this.byId("MB_FORM_PLAN_OPTION");
				var planOptVlu=_this.byId("MB_LABEL_PLAN_OPTION_VALUE");
				
				var planYrVisblty=_this.byId("MB_FORM_PLAN_YEAR");
				var planYrVlu=_this.byId("MB_LABEL_PLAN_YEAR_VALUE");
				
				var FrmContribution=_this.byId("MB_FORM_CONTRIBUTION");
				var FrmContributionVlu=_this.byId("MB_LABEL_CONTRIBUTION_VALUE");

					    							
				 objHeader.setTitle(curntBnftPlan.PlanTypeText);  
				 objHeader.setNumber(hcm.emp.mybenefits.util.Formatter.formatAmount(curntBnftPlan.Coverage,curntBnftPlan.Currency));
				 objHeader.setNumberUnit(curntBnftPlan.Currency);
				 
				 _this.byId("MB_PLAN_SUB_TYPE_TEXT").setText(curntBnftPlan.PlanSubTypeText);
				 _this.byId("MB_PLAN_OPTION_TEXT").setText(curntBnftPlan.PlanOptionText);
				 _this.byId("MB_PLAN_PERIOD").setText(hcm.emp.mybenefits.util.Formatter.mbPeriod(_this.resourceBundle.getText("MB_PARTICIPATION_PERIOD"),curntBnftPlan.ParticipationBegin,curntBnftPlan.ParticipationEnd));
				 _this.byId("MB_PLAN_FSA_STATUS").setText(hcm.emp.mybenefits.util.Formatter.formatFSAStatus(curntBnftPlan.Coverage));
				 
				 FrmPlnNumVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisible(curntBnftPlan.PlanNo));
				 _this.byId("MB_LABEL_PLAN_NUMBER_VALUE").setText(curntBnftPlan.PlanNo);
				 
				 payrlFreqVisiblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisible(curntBnftPlan.ParticipationPeriod));
				 _this.byId("MB_LABEL_PAYROLL_FREQUENCY_VALUE").setText(curntBnftPlan.ParticipationPeriod);
				
				 planOptVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisible(curntBnftPlan.PlanOptionText));
				 planOptVlu.setText(curntBnftPlan.PlanOptionText);
				 
				 planYrVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisible(curntBnftPlan.FsaPlanStart));
				 planYrVlu.setText(hcm.emp.mybenefits.util.Formatter.mbPlanYear(curntBnftPlan.FsaPlanStart,curntBnftPlan.FsaPlanEnd));
				 
				 FrmContribution.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.EmpPreTaxCost));
				 FrmContributionVlu.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.EmpPreTaxCost,curntBnftPlan.Currency));

				 this._buildAttachments(curntBnftPlan);
		         this._hideNoValueFields();
				 
			}
            
        }
        
    }, this);
    var oView = this.getView();
    //    var IconTabFilter = new sap.m.IconTabFilter
        this.oTabBar = oView.byId("TabContainer");
        /**
         * @ControllerHook Initialize the custom tabs
         * added by the extension application.
         * This hook method can be used to initialize additional tabs of the tab bar from code.
         * It is called during S6 view initialization.  The controller extension should obtain   
         * references to the new tabs, which can be used later in the configureAdditionalTabs 
         * hook method.
         * @callback hcm.emp.mybenefits.view.S6~extHookInitAdditionalTabs
         * @param {object} oTabBar - contains the tab bar object.
         * @return {void}
         */
        if (this.extHookInitAdditionalTabs) {
        	this.extHookInitAdditionalTabs(this.oTabBar);
        }
},


    /**
     * handler for data loading
     */
    _hideNoValueFields: function() {
        // No data check for information section
        var view = this;
        if (!(view.byId("MB_LABEL_PLAN_NUMBER_VALUE").getVisible()) && !(view.byId("MB_LABEL_PAYROLL_FREQUENCY_VALUE").getVisible()) && !(view.byId("MB_LABEL_PLAN_OPTION_VALUE").getVisible()) && !(view.byId("MB_LABEL_PLAN_YEAR_VALUE").getVisible()) && !(view.byId("MB_LABEL_CONTRIBUTION_VALUE"))) {
            view.byId("MB_LABEL_NO_DATA").setVisible(true);
            view.byId("MB_FORM_NO_DATA").setVisible(true);
            view.byId("MB_LABEL_INFORMATION").destroyTitle();
        } else {
            view.byId("MB_LABEL_NO_DATA").setVisible(false);
            view.byId("MB_FORM_NO_DATA").setVisible(false);
            view.byId("MB_LABEL_INFORMATION").setTitle("");
        }

    },

    _buildAttachments: function(oContext) {
        var attachments = hcm.emp.mybenefits.util.Utilities.formAttachments(oContext),
            attachmenttab = this.byId("Attachment");
        this.getView().setModel(attachments, "attachmentsModel");
        if (attachments.getData().length >= 1) {
            attachmenttab.setCount(attachments.getData()[0].length);
            attachmenttab.setVisible(true);
        } else {
            attachmenttab.setCount(0);
            attachmenttab.setVisible(false);
        }
    },

    onSenderPress: function(oEvent) {
        var path = oEvent.oSource.oBindingContexts.attachmentsModel.getProperty().UrlPlan;
        sap.m.URLHelper.redirect(path, true);
    },

    getHeaderFooterOptions: function() {
    	
    	var objHdrFtr = {
            sI18NDetailTitle: this.resourceBundle.getText("MB_APP_DETAIL_TITLE"),
            oAddBookmarkSettings: {
                title: this.resourceBundle.getText("MB_APP_TITLE"),        
                icon:"sap-icon://family-care"
            }
    	};
    	/**
         * @ControllerHook Modify the footer buttons
         * This hook method can be used to add and change buttons for the detail view footer
         * It is called when the decision options for the detail item are fetched successfully
         * @callback hcm.emp.mybenefits.view.S6~extHookChangeFooterButtons
         * @param {object} objHdrFtr-Header Footer Object
         * @return {object} objHdrFtr-Header Footer Object
         */
    	
    	if (this.extHookChangeFooterButtons) {
    		objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
    	};
    	
        //Note:Back button issue
        /*,
               onBack: jQuery.proxy(function() {
                //Check if a navigation to master is the previous entry in the history
                var sDir = sap.ui.core.routing.History.getInstance().getDirection(this.oRouter.getURL("master"));
                if (sDir === "Backwards") {
                    window.history.go(-1);
                } else {
                    //we came from somewhere else - create the master view
                    this.oRouter.navTo("master");
                }
            }, this)*/
          //Note: End Back button issue
        
    	
        return objHdrFtr;
    }
});

},
	"hcm/emp/mybenefits/view/S6.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\txmlns:f="sap.ui.layout.form"\n\txmlns:l="sap.ui.layout"\n\txmlns:me="sap.me"\n\tcontrollerName="hcm.emp.mybenefits.view.S6">\n\t<Page\n\t\ttitle="{i18n>MB_APP_DETAIL_TITLE}"\n\t\tid="MB_PAGE_FSA">\n\t\t<content>\n\t\t\t<ObjectHeader\n\t\t\t\tid="MB_MISC_HEADER">\n\t\t\t\t<attributes>\n\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\tid="MB_PLAN_SUB_TYPE_TEXT"\n\t\t\t\t\t\ttext="{PlanSubTypeText}" />\n\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\tid="MB_PLAN_OPTION_TEXT"\n\t\t\t\t\t\ttext="{PlanOptionText}" />\n\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\tid="MB_PLAN_PERIOD"\n\t\t\t\t\t\ttext="{parts:[{path:\'i18n>MB_PARTICIPATION_PERIOD\'}, {path:\'ParticipationBegin\'}, {path:\'ParticipationEnd\'}], formatter:\'utilFormatter.mbPeriod\'}" />\n\t\t\t\t</attributes>\n\t\t\t\t<firstStatus>\n\t\t\t\t\t<ObjectStatus\n\t\t\t\t\t\tid="MB_PLAN_FSA_STATUS"\n\t\t\t\t\t\t></ObjectStatus>\n\t\t\t\t</firstStatus>\n\t\t\t\t <!-- extension point for additional fields in header -->\n                <core:ExtensionPoint name="extS6Header"></core:ExtensionPoint>\n\t\t\t</ObjectHeader>\n\t\t\t<IconTabBar\n\t\t\t\texpandable="true"\n\t\t\t\tid="TabContainer">\n\t\t\t\t<items>\n\t\t\t\t\t<IconTabFilter\n\t\t\t\t\t\ticon="sap-icon://hint"\n\t\t\t\t\t\ticonColor="Default"\n\t\t\t\t\t\tkey="Information">\n\t\t\t\t\t\t<content>\n\t\t\t\t\t\t\t<VBox>\n\t\t\t\t\t\t\t\t<f:Form id="informationForm">\n\t\t\t\t\t\t\t\t\t<f:layout>\n\t\t\t\t\t\t\t\t\t\t<f:ResponsiveLayout id="informationLayout" />\n\t\t\t\t\t\t\t\t\t</f:layout>\n\t\t\t\t\t\t\t\t\t<f:formContainers>\n\t\t\t\t\t\t\t\t\t\t<f:FormContainer\n\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_INFORMATION"\n\t\t\t\t\t\t\t\t\t\t\ttitle="{i18n>MB_INFORMATION}">\n\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<f:formElements>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_NO_DATA"\n\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_NO_DATA"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_NO_DATA}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="3"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_NO_DATA_DUMMY">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="5"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_PLAN_NUMBER">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_PLAN_NUMBER"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_PLAN_NUMBER}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_PLAN_NUMBER_VALUE">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_PAYROLL_FREQUENCY">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_PAYROLL_FREQUENCY"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_PAYROLL_FREQUENCY}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_PAYROLL_FREQUENCY_VALUE">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_PLAN_OPTION">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_PLAN_OPTION"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_PLAN_OPTION}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_PLAN_OPTION_VALUE">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_PLAN_YEAR">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_PLAN_YEAR"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_PLAN_YEAR}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_PLAN_YEAR_VALUE">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_CONTRIBUTION">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_CONTRIBUTION"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_CONTRIBUTION_PER_PAY_PERIOD}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_CONTRIBUTION_VALUE">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t</f:formElements>\n\t\t\t\t\t\t\t\t\t\t</f:FormContainer>\n\t\t\t\t\t\t\t\t\t</f:formContainers>\n\t\t\t\t\t\t\t\t</f:Form>\n\t\t\t\t\t\t\t</VBox>\n\t\t\t\t\t\t</content>\n\t\t\t\t\t</IconTabFilter>\n\t\t\t\t\t<IconTabFilter\n\t\t\t\t\t\ticon="sap-icon://attachment"\n\t\t\t\t\t\ticonColor="Default"\n\t\t\t\t\t\tkey="Attachments"\n\t\t\t\t\t\tid="Attachment">\n\t\t\t\t\t\t<content>\n\t\t\t\t\t\t\t<List\n\t\t\t\t\t\t\t\tid="MB_LABEL_DOCUMENT"\n\t\t\t\t\t\t\t\tshowSeparators="Inner"\n\t\t\t\t\t\t\t\tnoDataText="{i18n>MB_NO_DATA}"\n\t\t\t\t\t\t\t\titems="{attachmentsModel>/0}">\n\t\t\t\t\t\t\t\t<StandardListItem\n\t\t\t\t\t\t\t\t\ttype="Active"\n\t\t\t\t\t\t\t\t\ticon="sap-icon://chain-link"\n\t\t\t\t\t\t\t\t\ttitle="{attachmentsModel>UrlPlanText}"\n\t\t\t\t\t\t\t\t\tpress="onSenderPress"></StandardListItem>\n\t\t\t\t\t\t\t</List>\n\t\t\t\t\t\t</content>\n\t\t\t\t\t\t\n\t\t\t\t\t</IconTabFilter>\n\t\t\t\t\t   <!-- extension added to add icon tab filter --> \n                <core:ExtensionPoint name="extS6IconTabFilter"></core:ExtensionPoint>\n\t\t\t\t</items>\n\t\t\t</IconTabBar>\n\t\t</content>\n\t</Page>\n</core:View>\n',
	"hcm/emp/mybenefits/view/S7.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("hcm.emp.mybenefits.util.Formatter");
jQuery.sap.require("hcm.emp.mybenefits.util.Utilities");
this.utilFormatter = hcm.emp.mybenefits.util.Formatter;
sap.ca.scfld.md.controller.BaseDetailController.extend("hcm.emp.mybenefits.view.S7", {
//	Controller Hook method definitions

//	This hook method can be used to initialize additional tabs of the icon tab filter from code.
//	It is called during S7 view initialization.  The controller extension should obtain   
//	references to the new icon tabs
	extHookInitAdditionalTabs: null,
	
//	This hook method can be used to add and change buttons for the detail view footer
//	It is called when the decision options for the detail item are fetched successfully
	extHookChangeFooterButtons: null,

	onInit: function() {
		sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
		this.oDataModel = this.oApplicationFacade.getODataModel();
		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		hcm.emp.mybenefits.util.DataManager.init(this.oDataModel, this.resourceBundle);

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "Miscellaneous") {
				hcm.emp.mybenefits.util.DataManager.init(this.oDataModel, this.resourceBundle);

				oEvent.getParameter("arguments").contextPath = decodeURIComponent(oEvent.getParameter("arguments").contextPath);

				var _this = this;

				var contextPath = decodeURIComponent(oEvent.getParameter("arguments").contextPath);
				var indexVal = contextPath.split("/")[1];

				var  benefitsPlancollection = hcm.emp.mybenefits.util.DataManager.getCachedModelObjProp("benefitsPlan");

				_this.byId("TabContainer").setSelectedKey("Information");
				_this.byId("TabContainer").setExpanded(true);
				
				if (benefitsPlancollection) {

					var curntBnftPlan = benefitsPlancollection.Benefits[indexVal];	

					var objHeader= _this.byId("MB_MISC_HEADER");

					var FrmPlnNumVisblty=_this.byId("MB_FORM_PLAN_NUMBER");
					var payrlFreqVisiblty=_this.byId("MB_FORM_PAYROLL_FREQUENCY");

					var preTaxCostVisblty=_this.byId("MB_FORM_PRETAXCOST");
					var preTaxCostValue=_this.byId("MB_LABEL_PRETAXCOST_VALUE");

					var postTaxCstVisblty=_this.byId("MB_FORM_POSTTAXCOST");
					var postTaxCostValue=_this.byId("MB_LABEL_POSTTAXCOST_VALUE");

					var addtnlPstTaxVisblty= _this.byId("MB_FORM_ADDTNL_POSTTAXCOST");
					var addtnlPstTaxVlu= _this.byId("MB_LABEL_ADDTNL_POSTTAXCOST_VALUE");

					var imputedIncomeVisblty= _this.byId("MB_FORM_IMPUTED_INCOME");
					var imputedIncomeVlu= _this.byId("MB_LABEL_IMPUTED_INCOME_VALUE");

					var employerCstVisblty= _this.byId("MB_FORM_EMPLOYER_COSTS");
					var employerCstVlu= _this.byId("MB_LABEL_EMPLOYER_COSTS_VALUE");

					var calculatdCrdtVisblty= _this.byId("MB_FORM_CALCULATED_CREDIT");
					var calculatdCrdtVlu= _this.byId("MB_LABEL_CALCULATED_CREDIT_VALUE");

					var reglrPreTaxVisblty=_this.byId("MB_FORM_REGULAR_PRE_TAX");
					var reglrPreTaxVlu=_this.byId("MB_REGULAR_PRE_TAX_PERCENT");

					var reglrPstTaxVisblty=_this.byId("MB_FORM_REGULAR_POST_TAX");
					var reglrPstTaxVlu=_this.byId("MB_REGULAR_POST_TAX_PERCENT");

					var bnsPreTaxCostVisblty=_this.byId("MB_FORM_BONUS_PRE_TAX");
					var bnsPreTaxCostVlu=_this.byId("MB_BONUS_PRE_TAX_PERCENT");

					var bnsPstTaxCostVisblty=_this.byId("MB_FORM_BONUS_POST_TAX");
					var bnsPstTaxCostVlu=_this.byId("MB_BONUS_POST_TAX_PERCENT");


					objHeader.setTitle(curntBnftPlan.PlanTypeText);  

					_this.byId("MB_PLAN_SUB_TYPE_TEXT").setText(curntBnftPlan.PlanSubTypeText);
					_this.byId("MB_PLAN_OPTION_TEXT").setText(curntBnftPlan.PlanOptionText);
					_this.byId("MB_PLAN_PERIOD").setText(hcm.emp.mybenefits.util.Formatter.mbPeriod(_this.resourceBundle.getText("MB_PARTICIPATION_PERIOD"),curntBnftPlan.ParticipationBegin,curntBnftPlan.ParticipationEnd));

					FrmPlnNumVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisible(curntBnftPlan.PlanNo));
					_this.byId("MB_LABEL_PLAN_NUMBER_VALUE").setText(curntBnftPlan.PlanNo);

					payrlFreqVisiblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisible(curntBnftPlan.ParticipationPeriod));
					_this.byId("MB_LABEL_PAYROLL_FREQUENCY_VALUE").setText(curntBnftPlan.ParticipationPeriod);

					preTaxCostVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.EmpPreTaxCost));
					preTaxCostValue.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.EmpPreTaxCost,curntBnftPlan.Currency));

					postTaxCstVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.EmpPostTaxCost));
					postTaxCostValue.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.EmpPostTaxCost,curntBnftPlan.Currency));

					addtnlPstTaxVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.EmpAddPostTaxCost));
					addtnlPstTaxVlu.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.EmpAddPostTaxCost,curntBnftPlan.Currency));

					imputedIncomeVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.ImputedIncome));
					imputedIncomeVlu.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.ImputedIncome,curntBnftPlan.Currency));

					employerCstVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.EmployerCost));
					employerCstVlu.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.EmployerCost,curntBnftPlan.Currency));

					calculatdCrdtVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.CalcCredit));
					calculatdCrdtVlu.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.CalcCredit,curntBnftPlan.Currency));

					reglrPreTaxVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.RegPreTaxCont));
					reglrPreTaxVlu.setText(hcm.emp.mybenefits.util.Formatter.formatContribution(curntBnftPlan.RegPreTaxCont,curntBnftPlan.Currency));  			 
					_this.byId("MB_FORM_REGULAR_PRE_TAX_DUMMY").setVisible(curntBnftPlan.TraPreToPost);

					reglrPstTaxVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.RegPostTaxCont));
					reglrPstTaxVlu.setText(hcm.emp.mybenefits.util.Formatter.formatContribution(curntBnftPlan.RegPostTaxCont,curntBnftPlan.Currency));
					_this.byId("MB_FORM_REGULAR_POST_TAX_DUMMY").setVisible(curntBnftPlan.StartPostTax_mmi);

					bnsPreTaxCostVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.BonPreTaxContr));
					bnsPreTaxCostVlu.setText(hcm.emp.mybenefits.util.Formatter.formatContribution(curntBnftPlan.BonPreTaxContr,curntBnftPlan.Currency));
					_this.byId("MB_FORM_BONUS_PRE_TAX_DUMMY").setVisible(curntBnftPlan.BonTraPreToPost);

					bnsPstTaxCostVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.BonPostTaxCont));
					bnsPstTaxCostVlu.setText(hcm.emp.mybenefits.util.Formatter.formatContribution(curntBnftPlan.BonPostTaxCont,curntBnftPlan.Currency));
					_this.byId("MB_FORM_BONUS_POST_TAX_DUMMY").setVisible(curntBnftPlan.StartBonPostTaximmi);


					
					 hcm.emp.mybenefits.util.DataManager.getHealthDependants(_this,curntBnftPlan,function(objResponse) {
					 var dependants= _this.byId("MB_LABEL_DEPENDANTS");
						_this.objBenfitsCollection = {"Dependants" :objResponse.results };
						dependants.setModel(new sap.ui.model.json.JSONModel(_this.objBenfitsCollection));
						dependants.bindAggregation("items",{
							path : "/Dependants",
							template : new sap.m.FeedListItem({
								iconActive: false,
								icon:"{path:'Dependants/results/DepName', formatter:'utilFormatter.displayContactPicture'}",
								text:"{parts: [{path: 'DepName'}, {path: 'Relation'}], formatter:'utilFormatter.mbDependants'}"

							})
						});
	    			 });


						 
	    			 hcm.emp.mybenefits.util.DataManager.getBeneficiaries(_this,curntBnftPlan,function(objResponse) {
	    				 var beneficiaries= _this.byId("MB_LABEL_BENEFICIARIES");
	    					_this.objBenfitsCollection = {"Beneficiary" : objResponse.Beneficiary.results};
	    					beneficiaries.setVisible( objResponse.BeneficiaryExists);
	    					beneficiaries.setModel(new sap.ui.model.json.JSONModel(_this.objBenfitsCollection));
	    					beneficiaries.bindAggregation("items",{
	    						 path : "/Beneficiary",
	    						 template : new sap.m.FeedListItem({
	    							 iconActive: false,
	    							 icon:"{path:'BenName', formatter:'utilFormatter.displayContactPicture'}",
	    							 sender:"{ContingentUI}",
	    							 senderActive: false ,
	    							 text:"{parts: [{path: 'BenName'}, {path: 'Relation'}], formatter:'utilFormatter.mbDependants'}",
	    							 info:"{BenPctUI}"
	    						 })
	    					 });
	    			 });

	    			 hcm.emp.mybenefits.util.DataManager.getInvestment(_this,curntBnftPlan,function(objResponse) {
	    				 var investments= _this.byId("MB_LABEL_INVESTMENTS");
	    					_this.objBenfitsCollection = { "Investment": objResponse.Investment.results};
	    					investments.setVisible( objResponse.InvestmentExists);
	    					investments.setModel(new sap.ui.model.json.JSONModel(_this.objBenfitsCollection));
	    					investments.bindAggregation("items",{
	    						 path : "/Investment",
	    						// visible:"{InvestmentExists}",
	    						 template :  new sap.m.ColumnListItem({
	    							 cells:[
	    							        new sap.m.Text({text:"{InvName}"}),
	    							        new sap.m.Text({text:"{parts:[{path:'InvPct'}], formatter:'utilFormatter.AppendPercent'}"}),
	    							        new sap.m.Text({
	    							        	 text:"{parts:[{path:'InvAmt'},{path:'Currency'}], formatter:'utilFormatter.formatAmount'}"
	    							         })
	    							        ]
	    						 })
	    					 });
	    			 });
	    			 _this._buildAttachments(curntBnftPlan);
						_this._hideNoValueFields();
				}
			}

		}, this);
        var oView = this.getView();
        //    var IconTabFilter = new sap.m.IconTabFilter
            this.oTabBar = oView.byId("TabContainer");
            /**
             * @ControllerHook Initialize the custom tabs
             * added by the extension application.
             * This hook method can be used to initialize additional tabs of the tab bar from code.
             * It is called during S7 view initialization.  The controller extension should obtain   
             * references to the new tabs, which can be used later in the configureAdditionalTabs 
             * hook method.
             * @callback hcm.emp.mybenefits.view.S7~extHookInitAdditionalTabs
             * @param {object} oTabBar - contains the tab bar object.
             * @return {void}
             */
            if (this.extHookInitAdditionalTabs) {
            	this.extHookInitAdditionalTabs(this.oTabBar);
            }
	},


	/**
	 * handler for data loading
	 */
	_hideNoValueFields: function() {
		// No data check for information section
		var view = this;
		if (!(view.byId("MB_LABEL_PLAN_NUMBER_VALUE").getVisible()) && !(view.byId("MB_LABEL_PAYROLL_FREQUENCY_VALUE").getVisible()) && !(view.byId("MB_REGULAR_PRE_TAX_PERCENT").getVisible()) && !(view.byId("MB_REGULAR_POST_TAX_PERCENT").getVisible()) && !(view.byId("MB_BONUS_PRE_TAX_PERCENT").getVisible()) && !(view.byId("MB_BONUS_POST_TAX_PERCENT").getVisible()) && !(view.byId("MB_REGULAR_POST_TAX_TEXT").getVisible()) && !(view.byId("MB_BONUS_POST_TAX_TEXT").getVisible()) && !(view.byId("MB_REGULAR_PRE_TAX_TEXT").getVisible()) && !(view.byId("MB_BONUS_PRE_TAX_TEXT").getVisible())) {
			view.byId("MB_LABEL_NO_DATA").setVisible(true);
			view.byId("MB_FORM_NO_DATA").setVisible(true);
			view.byId("MB_LABEL_INFORMATION").destroyTitle();
		} else {
			view.byId("MB_LABEL_NO_DATA").setVisible(false);
			view.byId("MB_FORM_NO_DATA").setVisible(false);
			view.byId("MB_LABEL_INFORMATION").setTitle("");
		}

	},

	_buildAttachments: function(oContext) {
		var attachments = hcm.emp.mybenefits.util.Utilities.formAttachments(oContext),
		attachmenttab = this.byId("Attachment");
		this.getView().setModel(attachments, "attachmentsModel");
		if (attachments.getData().length >= 1) {
			attachmenttab.setCount(attachments.getData()[0].length);
			attachmenttab.setVisible(true);
		} else {
			attachmenttab.setCount(0);
			attachmenttab.setVisible(false);
		}
	},

	onSenderPress: function(oEvent) {
		var path = oEvent.oSource.oBindingContexts.attachmentsModel.getProperty().UrlPlan;
		sap.m.URLHelper.redirect(path, true);
	},

	getHeaderFooterOptions: function() {
    	var objHdrFtr = {
                sI18NDetailTitle: this.resourceBundle.getText("MB_APP_DETAIL_TITLE"),
                oAddBookmarkSettings: {
                    title: this.resourceBundle.getText("MB_APP_TITLE"),        
                    icon:"sap-icon://family-care"
                }
        	};
        	/**
             * @ControllerHook Modify the footer buttons
             * This hook method can be used to add and change buttons for the detail view footer
             * It is called when the decision options for the detail item are fetched successfully
             * @callback hcm.emp.mybenefits.view.S7~extHookChangeFooterButtons
             * @param {object} objHdrFtr-Header Footer Object
             * @return {object} objHdrFtr-Header Footer Object
             */
        	
        	if (this.extHookChangeFooterButtons) {
        		objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
        	};
        	
            //Note:Back button issue
            /*,
                   onBack: jQuery.proxy(function() {
                    //Check if a navigation to master is the previous entry in the history
                    var sDir = sap.ui.core.routing.History.getInstance().getDirection(this.oRouter.getURL("master"));
                    if (sDir === "Backwards") {
                        window.history.go(-1);
                    } else {
                        //we came from somewhere else - create the master view
                        this.oRouter.navTo("master");
                    }
                }, this)*/
              //Note: End Back button issue
            
        	
            return objHdrFtr;
        }

});

},
	"hcm/emp/mybenefits/view/S7.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\txmlns:f="sap.ui.layout.form"\n\txmlns:l="sap.ui.layout"\n\txmlns:me="sap.me"\n\tcontrollerName="hcm.emp.mybenefits.view.S7">\n\t<Page\n\t\ttitle="{i18n>MB_APP_DETAIL_TITLE}"\n\t\tid="MB_PAGE_MISC">\n\t\t<content>\n\t\t\t<ObjectHeader\n\t\t\t\tid="MB_MISC_HEADER"\n\t\t\t\ttitle="{PlanTypeText}">\n\t\t\t\t<attributes>\n\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\tid="MB_PLAN_SUB_TYPE_TEXT"\n\t\t\t\t\t\ttext="{PlanSubTypeText}" />\n\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\tid="MB_PLAN_OPTION_TEXT"\n\t\t\t\t\t\ttext="{PlanOptionText}" />\n\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\tid="MB_PLAN_PERIOD"\n\t\t\t\t\t\ttext="{parts:[{path:\'i18n>MB_PARTICIPATION_PERIOD\'}, {path:\'ParticipationBegin\'}, {path:\'ParticipationEnd\'}], formatter:\'utilFormatter.mbPeriod\'}" />\n\t\t\t\t</attributes>\n\t\t\t\t <!-- extension point for additional fields in header -->\n                <core:ExtensionPoint name="extS7Header"></core:ExtensionPoint>\n\t\t\t</ObjectHeader>\n\t\t\t<IconTabBar\n\t\t\t\texpandable="true"\n\t\t\t\tid="TabContainer">\n\t\t\t\t<items>\n\t\t\t\t\t<IconTabFilter\n\t\t\t\t\t\ticon="sap-icon://hint"\n\t\t\t\t\t\ticonColor="Default"\n\t\t\t\t\t\tkey="Information">\n\t\t\t\t\t\t<content>\n\t\t\t\t\t\t\t<VBox>\n\t\t\t\t\t\t\t\t<f:Form id="informationForm">\n\t\t\t\t\t\t\t\t\t<f:layout>\n\t\t\t\t\t\t\t\t\t\t<f:ResponsiveLayout id="informationLayout" />\n\t\t\t\t\t\t\t\t\t</f:layout>\n\t\t\t\t\t\t\t\t\t<f:formContainers>\n\t\t\t\t\t\t\t\t\t\t<f:FormContainer\n\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_INFORMATION"\n\t\t\t\t\t\t\t\t\t\t\ttitle="{i18n>MB_INFORMATION}">\n\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<f:formElements>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_NO_DATA"\n\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_NO_DATA"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_NO_DATA}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="3"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_NO_DATA_DUMMY">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="5"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_PLAN_NUMBER">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_PLAN_NUMBER"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_PLAN_NUMBER}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_PLAN_NUMBER_VALUE">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_PAYROLL_FREQUENCY">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_PAYROLL_FREQUENCY"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_PAYROLL_FREQUENCY}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_PAYROLL_FREQUENCY_VALUE">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_PRETAXCOST">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_PRETAXCOST"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_EMP_PRE_TAX_COST}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_PRETAXCOST_VALUE">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_POSTTAXCOST">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_POSTTAXCOST"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_EMP_POST_TAX_COST}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_POSTTAXCOST_VALUE">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_ADDTNL_POSTTAXCOST">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_ADDTNL_POSTTAXCOST"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_EMP_ADDITIONAL_POST_TAX_COST}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_ADDTNL_POSTTAXCOST_VALUE">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_IMPUTED_INCOME">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_IMPUTED_INCOME"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_Imputed_Income}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_IMPUTED_INCOME_VALUE">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_EMPLOYER_COSTS">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_EMPLOYER_COSTS"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_EMPLOYER_COSTS}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_EMPLOYER_COSTS_VALUE">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_CALCULATED_CREDIT">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_CALCULATED_CREDIT"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_CALCULATED_CREDIT}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_LABEL_CALCULATED_CREDIT_VALUE">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_REGULAR_PRE_TAX">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_REGULAR_PRE_TAX"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_REGULAR_PRE_TAX_CONTRIBUTION}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_REGULAR_PRE_TAX_PERCENT">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_REGULAR_PRE_TAX_DUMMY">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_REGULAR_PRE_TAX_DUMMY">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_REGULAR_PRE_TAX_TEXT"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_MESSAGE_PRE_TAX_TO_POST_TAX}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_REGULAR_POST_TAX">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_REGULAR_POST_TAX"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_REGULAR_POST_TAX_CONTRIBUTION}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_REGULAR_POST_TAX_PERCENT">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_REGULAR_POST_TAX_DUMMY">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_REGULAR_POST_TAX_DUMMY">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_REGULAR_POST_TAX_TEXT"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_START_POST_TAX_CONTRIBUTIONS}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_BONUS_PRE_TAX">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_BONUS_PRE_TAX"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_BONUS_PRE_TAX_CONTRIBUTION}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_BONUS_PRE_TAX_PERCENT">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_BONUS_PRE_TAX_DUMMY">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_BONUS_PRE_TAX_DUMMY">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_BONUS_PRE_TAX_TEXT"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_MESSAGE_PRE_TAX_TO_POST_TAX}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_BONUS_POST_TAX">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_BONUS_POST_TAX"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_BONUS_POST_TAX_CONTRIBUTION}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_BONUS_POST_TAX_PERCENT">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t<f:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_FORM_BONUS_POST_TAX_DUMMY">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_BONUS_POST_TAX_DUMMY">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tid="MB_BONUS_POST_TAX_TEXT"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>MB_START_POST_TAX_CONTRIBUTIONS}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<l:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="4"></l:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</f:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t</f:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t</f:formElements>\n\t\t\t\t\t\t\t\t\t\t</f:FormContainer>\n\t\t\t\t\t\t\t\t\t</f:formContainers>\n\t\t\t\t\t\t\t\t</f:Form>\n\t\t\t\t\t\t\t\t<List\n\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\tid="MB_LABEL_DEPENDANTS"\n\t\t\t\t\t\t\t\t\theaderDesign="Plain"\n\t\t\t\t\t\t\t\t\tshowSeparators="None"\n\t\t\t\t\t\t\t\t\tnoDataText="{i18n>MB_NO_DATA}"\n\t\t\t\t\t\t\t\t\theaderText="{i18n>MB_DEPENDENTS}"\n\t\t\t\t\t\t\t\t\tshowNoData="true">\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t</List>\n\t\t\t\t\t\t\t\t<List\n\t\t\t\t\t\t\t\t\tvisible="true"\n\t\t\t\t\t\t\t\t\tid="MB_LABEL_BENEFICIARIES"\n\t\t\t\t\t\t\t\t\theaderDesign="Plain"\n\t\t\t\t\t\t\t\t\tshowSeparators="None"\n\t\t\t\t\t\t\t\t\tnoDataText="{i18n>MB_NO_DATA}"\n\t\t\t\t\t\t\t\t\theaderText="{i18n>MB_BENEFICIARIES}"\n\t\t\t\t\t\t\t\t\tshowNoData="true">\n\t\t\t\t\t\t\t\t</List>\n\t\t\t\t\t\t\t\t<List\n\t\t\t\t\t\t\t\t\tid="MB_LABEL_INVESTMENTS"\n\t\t\t\t\t\t\t\t\theaderText="{i18n>MB_INVESTMENTS}"\n\t\t\t\t\t\t\t\t\tnoDataText="{i18n>MB_NO_DATA}">\n\t\t\t\t\t\t\t\t\t<columns>\n\t\t\t\t\t\t\t\t\t<Column\n\t\t\t\t\t\t\t\t\t\t\thAlign="Left"\n\t\t\t\t\t\t\t\t\t\t\tminScreenWidth="Tablet">\n\t\t\t\t\t\t\t\t\t\t\t<!-- <header> <Label text="{i18n>TYPE}"></Label> </header> -->\n\t\t\t\t\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t\t\t\t\t<Column\n\t\t\t\t\t\t\t\t\t\t\thAlign="Center"\n\t\t\t\t\t\t\t\t\t\t\tminScreenWidth="Tablet"\n\t\t\t\t\t\t\t\t\t\t\tdemandPopin="true">\n\t\t\t\t\t\t\t\t\t\t\t<!-- <header> <Label text="{i18n>DESCRIPTION}" /> </header> -->\n\t\t\t\t\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t\t\t\t\t<Column\n\t\t\t\t\t\t\t\t\t\t\thAlign="Right"\n\t\t\t\t\t\t\t\t\t\t\tminScreenWidth="Tablet"\n\t\t\t\t\t\t\t\t\t\t\tdemandPopin="true">\n\t\t\t\t\t\t\t\t\t\t\t<!-- <header> <Text text="{i18n>TRC_PERCENTAGE}" /> </header> -->\n\t\t\t\t\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t\t\t\t</columns>\n\t\t\t\t\t\t\t\t</List>\n\t\t\t\t\t\t\t</VBox>\n\t\t\t\t\t\t</content>\n\t\t\t\t\t</IconTabFilter>\n\t\t\t\t\t<IconTabFilter\n\t\t\t\t\t\ticon="sap-icon://attachment"\n\t\t\t\t\t\ticonColor="Default"\n\t\t\t\t\t\tkey="Attachments"\n\t\t\t\t\t\tid="Attachment">\n\t\t\t\t\t\t<content>\n\t\t\t\t\t\t\t<List\n\t\t\t\t\t\t\t\tid="MB_LABEL_DOCUMENT"\n\t\t\t\t\t\t\t\tshowSeparators="Inner"\n\t\t\t\t\t\t\t\tnoDataText="{i18n>MB_NO_DATA}"\n\t\t\t\t\t\t\t\titems="{attachmentsModel>/0}">\n\t\t\t\t\t\t\t\t<StandardListItem\n\t\t\t\t\t\t\t\t\ttype="Active"\n\t\t\t\t\t\t\t\t\ticon="sap-icon://chain-link"\n\t\t\t\t\t\t\t\t\ttitle="{attachmentsModel>UrlPlanText}"\n\t\t\t\t\t\t\t\t\tpress="onSenderPress"></StandardListItem>\n\t\t\t\t\t\t\t</List>\n\t\t\t\t\t\t</content>\n\t\t\t\t\t\t\n\t\t\t\t\t</IconTabFilter>\n\t\t\t\t\t   <!-- extension added to add icon tab filter --> \n                <core:ExtensionPoint name="extS7IconTabFilter"></core:ExtensionPoint>\n\t\t\t\t</items>\n\t\t\t</IconTabBar>\n\t\t</content>\n\t</Page>\n</core:View>\n',
	"hcm/emp/mybenefits/view/S8.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("hcm.emp.mybenefits.util.Formatter");
jQuery.sap.require("hcm.emp.mybenefits.util.Utilities");
sap.ca.scfld.md.controller.BaseDetailController.extend("hcm.emp.mybenefits.view.S8", {
	

//	This hook method can be used to initialize additional tabs of the icon tab filter from code.
//	It is called during S8 view initialization.  The controller extension should obtain   
//	references to the new icon tabs
	extHookInitAdditionalTabs: null,
	
//	This hook method can be used to add and change buttons for the detail view footer
//	It is called when the decision options for the detail item are fetched successfully
	extHookChangeFooterButtons: null,


    onInit: function() {
        // execute the onInit for the base class
        // BaseDetailController
        sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
        this.oDataModel = this.oApplicationFacade.getODataModel();
        this.resourceBundle = this.oApplicationFacade.getResourceBundle();
        hcm.emp.mybenefits.util.DataManager.init(this.oDataModel, this.resourceBundle);
        
        this.oRouter.attachRouteMatched(function(oEvent) {
            if (oEvent.getParameter("name") === "Unenrolled") {
            	hcm.emp.mybenefits.util.DataManager.init(this.oDataModel, this.resourceBundle);
            	
            	oEvent.getParameter("arguments").contextPath = decodeURIComponent(oEvent.getParameter("arguments").contextPath);
				
				var _this = this;
			
				var contextPath = decodeURIComponent(oEvent.getParameter("arguments").contextPath);
				var indexVal = contextPath.split("/")[1];
				
				var  benefitsPlancollection = hcm.emp.mybenefits.util.DataManager.getCachedModelObjProp("benefitsPlan");
            	
				if (benefitsPlancollection) {
					
					var curntBnftPlan = benefitsPlancollection.Benefits[indexVal];	
					
					var objHeader= _this.byId("MB_UE_HEADER");
								    							
					 objHeader.setTitle(curntBnftPlan.PlanTypeText);
					 
					 _this.byId("MB_PLAN_SUB_TYPE_TEXT").setText(curntBnftPlan.PlanSubTypeText);					 
					 _this.byId("MB_PLAN_OPTION_TEXT").setText(curntBnftPlan.PlanOptionText);
				}
            }
            
        }, this);
        
        var oView = this.getView();
        //    var IconTabFilter = new sap.m.IconTabFilter
            this.oTabBar = oView.byId("TabContainer");
            /**
             * @ControllerHook Initialize the custom tabs
             * added by the extension application.
             * This hook method can be used to initialize additional tabs of the tab bar from code.
             * It is called during S8 view initialization.  The controller extension should obtain   
             * references to the new tabs, which can be used later in the configureAdditionalTabs 
             * hook method.
             * @callback hcm.emp.mybenefits.view.S8~extHookInitAdditionalTabs
             * @param {object} oTabBar - contains the tab bar object.
             * @return {void}
             */
            if (this.extHookInitAdditionalTabs) {
            	this.extHookInitAdditionalTabs(this.oTabBar);
            }
    },

    onSenderPress: function(oEvent) {
        var path = oEvent.oSource.oBindingContexts.attachmentsModel.getProperty().UrlPlan;
        sap.m.URLHelper.redirect(path, true);
    },

    getHeaderFooterOptions: function() {
    	var objHdrFtr = {
                sI18NDetailTitle: this.resourceBundle.getText("MB_APP_DETAIL_TITLE"),
                oAddBookmarkSettings: {
                    title: this.resourceBundle.getText("MB_APP_TITLE"),        
                    icon:"sap-icon://family-care"
                }
        	};
        	/**
             * @ControllerHook Modify the footer buttons
             * This hook method can be used to add and change buttons for the detail view footer
             * It is called when the decision options for the detail item are fetched successfully
             * @callback hcm.emp.mybenefits.view.S8~extHookChangeFooterButtons
             * @param {object} objHdrFtr-Header Footer Object
             * @return {object} objHdrFtr-Header Footer Object
             */
        	
        	if (this.extHookChangeFooterButtons) {
        		objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
        	};
        	
            //Note:Back button issue
            /*,
                   onBack: jQuery.proxy(function() {
                    //Check if a navigation to master is the previous entry in the history
                    var sDir = sap.ui.core.routing.History.getInstance().getDirection(this.oRouter.getURL("master"));
                    if (sDir === "Backwards") {
                        window.history.go(-1);
                    } else {
                        //we came from somewhere else - create the master view
                        this.oRouter.navTo("master");
                    }
                }, this)*/
              //Note: End Back button issue
            
        	
            return objHdrFtr;
        }

});

},
	"hcm/emp/mybenefits/view/S8.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\txmlns:f="sap.ui.layout.form"\n\txmlns:l="sap.ui.layout"\n\txmlns:me="sap.me"\n\tcontrollerName="hcm.emp.mybenefits.view.S8">\n\t<Page\n\t\ttitle="{i18n>MB_APP_DETAIL_TITLE}"\n\t\tid="MB_PAGE_UNENROLLED">\n\t\t<content>\n\t\t\t<ObjectHeader\n\t\t\t\tid="MB_UE_HEADER"\n\t\t\t\tnumber="{i18n>MB_LIST_HEADER_UNENROLLED}">\n\t\t\t\t<attributes>\n\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\tid="MB_PLAN_SUB_TYPE_TEXT"/>\n\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\tid="MB_PLAN_OPTION_TEXT"/>\n\t\t\t\t</attributes>\n\t\t\t\t <!-- extension point for additional fields in header -->\n                <core:ExtensionPoint name="extS8Header"></core:ExtensionPoint>\n\t\t\t</ObjectHeader>\n\t\t\t<IconTabBar\n\t\t\t\texpandable="true"\n\t\t\t\tid="TabContainer">\n\t\t\t\t<items>\n\t\t\t\t\t<IconTabFilter\n\t\t\t\t\t\ticon="sap-icon://attachment"\n\t\t\t\t\t\ticonColor="Default"\n\t\t\t\t\t\tkey="Attachments"\n\t\t\t\t\t\tid="Attachment">\n\t\t\t\t\t\t<content>\n\t\t\t\t\t\t\t<List\n\t\t\t\t\t\t\t\tid="MB_LABEL_DOCUMENT"\n\t\t\t\t\t\t\t\tshowSeparators="Inner"\n\t\t\t\t\t\t\t\tnoDataText="{i18n>MB_NO_DATA}"\n\t\t\t\t\t\t\t\titems="{attachmentsModel>/0}">\n\t\t\t\t\t\t\t\t<StandardListItem\n\t\t\t\t\t\t\t\t\ttype="Active"\n\t\t\t\t\t\t\t\t\ticon="sap-icon://chain-link"\n\t\t\t\t\t\t\t\t\ttitle="{attachmentsModel>UrlPlanText}"\n\t\t\t\t\t\t\t\t\tpress="onSenderPress"></StandardListItem>\n\t\t\t\t\t\t\t</List>\n\t\t\t\t\t\t</content>\t\t\n\t\t\t\t\t</IconTabFilter>\n\t\t\t\t    <!-- extension added to add icon tab filter --> \n                <core:ExtensionPoint name="extS8IconTabFilter"></core:ExtensionPoint>\n\t\t\t\t</items>\n\t\t\t</IconTabBar>\n\t\t</content>\n\t</Page>\n</core:View>\n'
}});
