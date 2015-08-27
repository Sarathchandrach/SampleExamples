jQuery.sap.registerPreloadedModules({
"name":"cus/crm/mytasks/Component-preload",
"version":"2.0",
"modules":{
	"cus/crm/mytasks/Component.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// define a root UIComponent which exposes the main view
jQuery.sap.declare("cus.crm.mytasks.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

// new Component - CRM My Tasks
sap.ca.scfld.md.ComponentBase.extend("cus.crm.mytasks.Component", {
	metadata : sap.ca.scfld.md.ComponentBase.createMetaData("FS", {
		"name" : "CRM My Tasks",
		"version" : "1.5.4",
		"library" : "cus.crm.mytasks",
		"includes" : [],
		"dependencies" : {
			"libs" : [ "sap.m", "sap.me", "sap.ca.ui" ],
			"components" : []
		},
		"config" : {
			resourceBundle : "i18n/i18n.properties",
			titleResource : "MASTER_TITLE",
			icon : "sap-icon://Fiori2/F0003",
			favIcon : "./resources/sap/ca/ui/themes/base/img/favicon/F0003_Manage_Tasks.ico",
			"homeScreenIconPhone" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0003_Manage_Tasks/57_iPhone_Desktop_Launch.png",
			"homeScreenIconPhone@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0003_Manage_Tasks/114_iPhone-Retina_Web_Clip.png",
			"homeScreenIconTablet" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0003_Manage_Tasks/72_iPad_Desktop_Launch.png",
			"homeScreenIconTablet@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0003_Manage_Tasks/144_iPad_Retina_Web_Clip.png",
			"startupImage320x460" : "./resources/sap/ca/ui/themes/base/img/splashscreen/startup-image-320x460.png",
			"startupImage640x920" : "./resources/sap/ca/ui/themes/base/img/splashscreen/startup-image-640x920.png",
			"startupImage640x1096" : "./resources/sap/ca/ui/themes/base/img/splashscreen/startup-image-640x1096.png",
			"startupImage768x1004" : "./resources/sap/ca/ui/themes/base/img/splashscreen/startup-image-768x1004.png",
			"startupImage748x1024" : "./resources/sap/ca/ui/themes/base/img/splashscreen/startup-image-748x1024.png",
			"startupImage1536x2008" : "./resources/sap/ca/ui/themes/base/img/splashscreen/startup-image-1536x2008.png",
			"startupImage1496x2048" : "./resources/sap/ca/ui/themes/base/img/splashscreen/startup-image-1496x2048.png",
		},
		"viewPath" : "cus.crm.mytasks.view",
		"fullScreenPageRoutes" : {
			// fill the routes to your full screen pages in here.
			"taskDetail" : {
				"pattern" : "taskDetail/{contextPath}",
				"view" : "S3"
			},
			"newTask" : {
				"pattern" : "newTask/{processType}",
				"view" : "S3"
			},
			"newTaskFromNote" : {
				"pattern" : "newTask/{processType}",
				"view" : "S3"
			},
			"newTaskWithAccount" : {
				"pattern" : "newTaskWithAccount/{processType}/{accountName}",
				"view" : "S3"
			},
			"taskOverview" : {
				"pattern" : "taskOverview/{contextPath}",
				"view" : "S4"
			},
			"taskList" : {
				"pattern" : "",
				"view" : "S2"
			}
		},
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
			viewName : "cus.crm.mytasks.Main",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : oViewData
		});
	},
});
},
	"cus/crm/mytasks/Configuration.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mytasks.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");
jQuery.sap.require("cus.crm.mytasks.util.AppConfig");
jQuery.sap.require("cus.crm.mytasks.util.Formatter");

sap.ca.scfld.md.ConfigurationBase.extend("cus.crm.mytasks.Configuration", {
	isInitialised : false,
	oServiceParams : {
		serviceList : [ {
			name : "CRM_TASK",
			masterCollection : "Tasks",
			serviceUrl : "/sap/opu/odata/sap/CRM_TASK/",
			isDefault : true,
			mockedDataSource : "/cus.crm.mytasks/model/metadata.xml"
		} ]
	},

	getServiceParams : function() {
		return this.oServiceParams;
	},
	
	/**
	 * @inherit
	 */

	getServiceList : function() {
		this.initMyTasksApp();
		return this.oServiceParams.serviceList;
	},

	getMasterKeyAttributes : function() {
		return [ "Id" ];
	},

	getExcludedQueryStringParameters : function() {
		return [ "sap-client", "sap-language" ];
	},

	injectResourceBundleToFormatter : function() {
		var oBundle = this.oApplicationFacade.getResourceBundle();
		cus.crm.mytasks.util.Formatter.oBundle = oBundle;
		cus.crm.mytasks.util.Util.logObjectToConsole(
				"Setting ResBundle to formatter: ", oBundle);
	},

	initMyTasksApp : function() {
		if (!this.isInitialised) {
			// cus.crm.mytasks.util.AppConfig.init();
			this.injectResourceBundleToFormatter();
			this.isInitialised = true;
		}
	}
});
},
	"cus/crm/mytasks/Main.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("cus.crm.mytasks.Main", {
	onInit : function() {
		jQuery.sap.require("sap.ca.scfld.md.Startup");
		jQuery.sap.require("sap.ca.ui.message.message");
		jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
		jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");
		jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
		jQuery.sap.require("sap.m.MessageBox");
		jQuery.sap.require("sap.ca.ui.FileUpload");
		jQuery.sap.require("cus.crm.mytasks.util.AppConfig");
		jQuery.sap.require("cus.crm.mytasks.util.AccountF4");
		jQuery.sap.require("cus.crm.mytasks.util.ContactF4");
		jQuery.sap.require("cus.crm.mytasks.util.EmployeeF4");
		jQuery.sap.require("cus.crm.mytasks.util.Formatter");
		jQuery.sap.require("cus.crm.mytasks.util.PriorityListUtil");
		jQuery.sap.require("cus.crm.mytasks.util.TechnicalInfoUtil");
		jQuery.sap.require("cus.crm.mytasks.util.Util");
		// WAVE 4 ENHANCEMENT
		jQuery.sap.require("cus.crm.mytasks.util.Schema");
		// WAVE 6 ENHANCEMENT
		jQuery.sap.require("cus.crm.mytasks.util.StatusListUtil");
		// WAVE 7 ENHANCEMENT
		jQuery.sap.require("cus.crm.mytasks.util.Attachments");
		jQuery.sap.require("cus.crm.mytasks.util.DocumentHistory");

		var effectiveUrl = jQuery.sap.getModulePath("cus.crm.mytasks")
				+ "/css/cus.crm.mytasks.css";
		jQuery.sap.includeStyleSheet(effectiveUrl, "mytasks_css");
		sap.ca.scfld.md.Startup.init('cus.crm.mytasks', this);
	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources
	 * and finalize activities.
	 * 
	 * @memberOf MainXML
	 */

	onExit : function() {
		// exit cleanup code here
		cus.crm.mytasks.util.Util.getCustomizingModel().setData({}, false);
	}
});
},
	"cus/crm/mytasks/Main.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core"\n\txmlns="sap.m" controllerName="cus.crm.mytasks.Main" displayBlock="true" height="100%">\n    <App id="fioriContent" showHeader="false">                                                              \t\n    </App>\n</core:View>',
	"cus/crm/mytasks/i18n/i18n.properties":'# FIORI_CRM_MyTasks\n# __ldi.translation.uuid=16595a60-108b-11e3-8ffd-0800200c9a66\n\n\n\n#_YMSG Message other than an instruction \n#_YINS Instruction for a user \n#_XTOL Explanatory text for an UI element, such as a tooltip \n#_XFLD Label for a component other than buttons and titles; sample components: column heading \n#_XBUT Button \n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \n#_XLST Item in an enumeration, such as a list or a drop-down list \n#_XTIT Title or caption \n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \n#_XLNK Hyperlink \n#_XGRP Group header or table section header \n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \n\n# XFLD: No Tasks found text\nSEARCH_LIST_NODATA_GENERIC=No results found\n\n## Task List \n############\n\n# XTIT: Shell title\nSHELL_TITLE=Tasks\n# XTIT: Task list title\nLIST_PAGE_TITLE=Tasks\n# XTIT: Task list title with number of tasks\nLIST_PAGE_TITLE_WITH_NUMBER=Open Tasks ({0})\n# XTIT: Task list title wname for the add button\nLIST_ADD=Add\n# XTIT: Application name\nMASTER_TITLE=My Tasks\n# XMSG: Busy text\nMASTER_BUSY_TEXT=Loading Tasks...\n# XMSG: Busy text\nMASTER_SEARCH_PLACEHOLDER=Search...\n# XTOL: Search tool tip \nMASTER_SEARCH_TOOLTIP=Search for Tasks\n#XTIT: This is the title for the Process Type section\nPROCESS_TYPE=Select Transaction Type\n\n\n\n#Filters\n\n# XBUT: Filter Button for showing all open tasks\nLIST_FILTER_ALL_OPEN=All Open\n# XBUT: Filter Button for showing all tasks that are due today\nLIST_FILTER_DUE_TODAY=Due Today\n# XBUT: Filter Button for showing all tasks that are due this week\nLIST_FILTER_DUE_THIS_WEEK=Due This Week\n# XBUT: Filter Button for showing all completed tasks\nLIST_FILTER_COMPLETED=Completed\n\n# Filter Bar \n\n# XTIT: filtered by completed \nLIST_FILTER_BAR_COMPLETED=Filtered by Completed Tasks\n# XTIT: filtered by due today\nLIST_FILTER_BAR_TODAY=Filtered by Tasks due Today\n# XTIT: filtered by due today\nLIST_FILTER_BAR_THIS_WEEK=Filtered by Tasks due this Week\n# XTIT: filtered by Account\nLIST_FILTER_BAR_ACCOUNT=Filtered by Account {0}\n\n# Filter Title\n\n# XTIT: filtered by completed \nLIST_FILTER_TITLE_COMPLETED=Completed Tasks ({0})\n# XTIT: filtered by due today\nLIST_FILTER_TITLE_TODAY=Tasks Due Today ({0})\n# XTIT: filtered by due today\nLIST_FILTER_TITLE_THIS_WEEK=Tasks Due This Week ({0})\n# XTIT: filtered by Account\nLIST_FILTER_TITLE_ACCOUNT=Filtered by Account {0} ({1})\n\n# XFLD: Due Date is shown like this in overview\nLIST_DUE_DATE_TODAY=Today\n# XFLD: Due Date is shown like this in overview\nLIST_DUE_DATE_TOMORROW=Tomorrow\n# XFLD: Due Date is shown like this in overview\nLIST_DUE_DATE_YESTERDAY=Yesterday\n# XFLD: Due Date is shown like this in overview\nLIST_DUE_DATE_IN_X_DAYS=In {0} days\n# XFLD: Due Date is shown like this in overview\nLIST_DUE_DATE_X_DAYS_AGO={0} days ago\n# XFLD: Only your tasks are displayed\nLIST_FILTERED_BY_MYITEMS=You are responsible for ({0}) out of ({1}) tasks. Only your tasks are displayed.\n# XTIT: Confirmation message to indicate that the task has been completed\nLIST_COMPLETE_CONFIRMATION=Task {0} has been set to Completed\n\n## Task Details \n###############\n\n# XTIT: task detail view name\nMC_DETAILS_TITLE=Task Details\n# XTIT: task detail title\nDETAILS_PAGE_TITLE=Tasks\n# XSEL: new task default text\nNEW_TASK_INPUT_PLACEHOLDER=New task...\n# XTIT: initial title of a tasks\nNEW_TASK_TITLE=Untitled\n# XTIT: page title of a newly created task\nNEW_TASK_PAGE_TITLE=New Task\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE=forwarded by {0}, {1}\n\n\n#Form\n\n# XFLD: Label in the form\nDETAILS_LABEL_TITLE=Title\n# XFLD: Label in the form\nDETAILS_LABEL_NOTE=Note\n# XFLD: Label in the form\nDETAILS_LABEL_DUE_DATE=Due Date\n# XFLD: Label in the form\nDETAILS_LABEL_ACCOUNT=Account\n# XFLD: Label in the form\nDETAILS_LABEL_CONTACT=Contact\n# XFLD: Label in the form\nDETAILS_LABEL_PRIVATE=Private\n# XFLD: Label in the form\nDETAILS_LABEL_PRIORITY=Priority\n# XFLD: Label in the form\nDETAILS_LABEL_STATUS=Status\n# XFLD: Label in the form\nDETAILS_LABEL_TYPE=Type\n\n#Buttons\n\n# XBUT: Button for deleting the task\nDETAILS_BUTTONS_DELETE=Delete Task\n# XBUT: Button for deleting the task\nDETAILS_FOOTER_BUTTON_DELETE=Delete\n# XBUT: Button for canceling the task\nDETAILS_BUTTONS_CANCEL=Cancel\n# XBUT: Button for creating a new task or saving the existing task\nDETAILS_BUTTONS_SAVE=Save\n# XBUT: Button for assigning the task to another person\nDETAILS_BUTTONS_ASSIGNTO=Assign To\n# XBUT: Button for follow up of given task\nDETAILS_BUTTONS_FOLLOWUP=Follow Up\n# XBUT: Button for follow up of given task\nDETAILS_BUTTONS_FOLLOWUP_TASK=Follow up Task\n# XBUT: Button for follow up of given task\nDETAILS_BUTTONS_FOLLOWUP_OPPT=Follow up Opportunity\n# XBUT: Button for follow up of given task\nDETAILS_BUTTONS_FOLLOWUP_APPT=Follow up Appointment\n\n#Message Box\n\n# XBUT: Title for the message box\nDETAILS_MESSAGEBOX_TITLE=Delete\n# YMSG: Text for the message box\nDETAILS_MESSAGEBOX_TEXT=Are you sure you want to delete this task?\n# XTIT: Confirmation message\nDETAILS_DELETE_CONFIRMATION=Task {0} deleted\n#XTIT: Warning message\nNAVBACK_WARNING_TITLE=Warning\n#YMSG: Text for the message box\nNAVBACK_WARNING_MESSAGE=Your entries will be lost. Are you sure you want to leave this page?\n\n#Value Help \n\n# XTIT: Title for Value Help Account\nDETAILS_VALUE_HELP_ACC_TITLE=Select Account\n# XTIT: Title for Value Help Contact\nDETAILS_VALUE_HELP_CON_TITLE=Select Contact\n# YMSG: Filtered by info bar text for contact search popup\nDETAILS_VALUE_HELP_FILTERED_BY=Filtered by\n# XTIT: Account VH item description: city, country\nDETAILS_VALUE_HELP_ACC_DESCR={0}, {1}\n# XTIT: Contact VH item description: account name, function\nDETAILS_VALUE_HELP_CON_DESCR={0}, {1}\n\n\n#Business card Account and Contact\n\n# XTIT: Title for business card Account\nDETAILS_BCARD_ACCOUNT=Account Overview\n# XTIT: Title for business card Contact\nDETAILS_BCARD_CONTACT=Contact Overview\n\n#Assign task to\n\n# XTIT: Title for the assign to dialog\nDETAILS_ASSIGNTO_TITLE=Assign To\n# XTIT: Title for the assign to dialog\nDETAILS_ASSIGNTO_TEXT=Assign Task To:\n# XTIT: Title for employee search\nDETAILS_ASSIGNTO_ASIGNEE=Select Task Assignee\n# XTIT: Confirmation message\nDETAILS_ASSIGNTO_CONFIRMATION=Task assigned to {0}\n# XBUT: Button on dialog: ok\nDIALOG_ASSIGNTO_BUTTON_OK=OK\n# XBUT: Button on dialog: cancel\nDIALOG_ASSIGNTO_BUTTON_CANCEL=Cancel\n\n# errors\n\n# YMSG: generic error\nGENERIC_ERROR=System is currently not available, please try again later or contact your system administrator\n# YMSG: error in date\nDETAILS_MESSAGETEXT_DATE=Date is not valid or not in the correct format. Use the input help to enter the date.\n# YMSG: error in account\nDETAILS_MESSAGETEXT_ACCOUNT=Use the input help to enter an account.\n# YMSG: error in contact\nDETAILS_MESSAGETEXT_CONTACT=Use the input help to enter a contact.\n# YMSG: title for the validation message box after save is clicked\nDETAILS_VALIDATION_TITLE=Use Input Help\n\n#XFLD,20: Loading text when loading/searching list\nLOADING_TEXT=Loading...\n\n# XTIT: Title for Follow up Dialog\nDETAILS_FOLLOWUP_TITLE=Follow up\n# XBUT: Button text for Follow up activities\nDETAILS_FOLLOWUP_BUTTON=Follow up\n# XTIT: Title for Confirmation Dialog to save task or not \nDETAILS_CONFIRM_TITLE=Confirmation\n# YMSG: Prompt use to save existing task or not\nDETAILS_FOLLOWUP_MESSAGE=Would you like to save the current task?\n# XBUT: Positive action to save the task and proceed with the follow up\nDETAILS_FOLLOWUP_YES=Yes\n# XBUT: Positive action to cancel the task and proceed with the follow up\nDETAILS_FOLLOWUP_NO=No\n# YMSG: No follow up transaction types available\n#FOLLOWUP_TYPES_NOT_PRESENT=No follow up types available\n# YMSG: No follow up transaction types available\n#FOLLOWUP_TYPES_NOT_PRESENT_TASK=Cannot proceed in creating a task since no follow up types are maintained\n# YMSG: No follow up transaction types available\n#FOLLOWUP_TYPES_NOT_PRESENT_OPPT=Cannot proceed in creating an opportunity since no follow up types are maintained\n# YMSG: No follow up transaction types available\n#FOLLOWUP_TYPES_NOT_PRESENT_APPT=Cannot proceed in creating an appointment since no follow up types are maintained\n# YMSG: Message shown to end user notifying that the follow up was successful\nFOLLOWUP_COMPLETED=Follow up successful!\n# YMSG: Message shown once the task is saved during a follow up scenario\nFOLLOWUP_TASK_SAVED=Follow up task saved!\n# YMSG: Message shown if a new or existing task is saved\nCURRENT_TASK_SAVED=Task saved!\n# YMSG: Error message shown to the end user telling that follow up activities cannot be done\nFOLLOWUP_ERROR_MSG=Either the current task {0} has errors or there are no follow up transaction types maintained in the Customizing\n\n#XFLD: Transaction Type of a given task\nS4_TASK_TYPE=Type: {0}\n#XFLD: Due Date of a given task\nS4_TASK_DUEDATE=Due Date: {0}\n#XFLD: Account of a given task\nS4_TASK_ACCOUNT=Account: {0}\n#XFLD: Contact of a given task\nS4_TASK_CONTACT=Contact: {0}\n#XFLD: Notes of a given task\nS4_TASK_NOTES=Notes\n#XFLD: Attachments of a given task\nS4_TASK_ATTACHMENTS=Attachments: {0}\n#XFLD: Transaction History of a given task\nS4_TASK_DOCHISTORY=Transaction History\n# XBUT: Button for follow up of given task to a task\nS4_BUTTONS_FOLLOWUPTOTASK=Task\n# XBUT: Button for follow up of given task to a opportunity\nS4_BUTTONS_FOLLOWUPTOOPPT=Opportunity\n# XBUT: Button for follow up of given task to an appointment\nS4_BUTTONS_FOLLOWUPTOAPPT=Appointment\n# XBUT: Button for editing the task\nS4_FOOTER_BUTTON_EDIT=Edit\n#XFLD: Column Label for the transaction ID of the document\nS4_DOCHISTORY_ID=Transaction ID\n#XFLD: Column Label for the transaction type of the document\nS4_DOCHISTORY_TTYPE=Transaction Type\n#XFLD: Column Label for the description of the document\nS4_DOCHISTORY_DESC=Description\n#XFLD: Column Label for the creation date of the document\nS4_DOCHISTORY_CREATEDDATE=Created On\n#XFLD: Column Label for the relation type to indicate whether current document precedes/succeeds\nS4_DOCHISTORY_RELTYPE=Relation Type\n#XFLD: Label to be shown if no transaction history is available\nS4_NO_DOCHISTORY=No Transactions available\n# YMSG: Message shown when renaming an attachment of a task is successful\nS3_RENAME_ATTACHMENT_SUCCESS=Attachment renamed successfully\n# YMSG: Message shown when renaming an attachment of a task fails\nS3_RENAME_ATTACHMENT_FAILED=Attachment could not be renamed\n# XBUT: Button for Displaying the Errors\nDETAILS_FOOTER_BUTTON_MESSAGE=Messages\n#XTIT: Title of the messages dialog listing the messages with count\nS4_MESSAGES_TITLE=Messages ({0})\n# YMSG: Message shown when when the user updates a task in its previous state\nS3_412_ERRORMSG=Data has been changed by another user. Click OK to fetch the latest \n#XTIT: Title of dialog indicating an error occurred\nS3_412_TITLE=Error\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\nS3_ACCOUNT_CONTACT_NOREL=You can only view business cards of contacts that have been assigned to this account\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\nS4_ACCOUNT_CONTACT_NOREL=You can only view business cards of contacts that have been assigned to this account',
	"cus/crm/mytasks/i18n/i18n_ar.properties":'\r\n\r\n\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n# XFLD: No Tasks found text\r\nSEARCH_LIST_NODATA_GENERIC=\\u0644\\u0645 \\u064A\\u062A\\u0645 \\u0627\\u0644\\u0639\\u062B\\u0648\\u0631 \\u0639\\u0644\\u0649 \\u0623\\u064A \\u0646\\u062A\\u0627\\u0626\\u062C\r\n\r\n## Task List \r\n############\r\n\r\n# XTIT: Shell title\r\nSHELL_TITLE=\\u0627\\u0644\\u0645\\u0647\\u0627\\u0645\r\n# XTIT: Task list title\r\nLIST_PAGE_TITLE=\\u0627\\u0644\\u0645\\u0647\\u0627\\u0645\r\n# XTIT: Task list title with number of tasks\r\nLIST_PAGE_TITLE_WITH_NUMBER=\\u0627\\u0644\\u0645\\u0647\\u0627\\u0645 \\u0627\\u0644\\u0645\\u0641\\u062A\\u0648\\u062D\\u0629 ({0})\r\n# XTIT: Task list title wname for the add button\r\nLIST_ADD=\\u0625\\u0636\\u0627\\u0641\\u0629\r\n# XTIT: Application name\r\nMASTER_TITLE=\\u0645\\u0647\\u0627\\u0645\\u064A\r\n# XMSG: Busy text\r\nMASTER_BUSY_TEXT=\\u062C\\u0627\\u0631\\u064D \\u062A\\u062D\\u0645\\u064A\\u0644 \\u0627\\u0644\\u0645\\u0647\\u0627\\u0645...\r\n# XMSG: Busy text\r\nMASTER_SEARCH_PLACEHOLDER=\\u0628\\u062D\\u062B...\r\n# XTOL: Search tool tip \r\nMASTER_SEARCH_TOOLTIP=\\u0628\\u062D\\u062B \\u0639\\u0646 \\u0627\\u0644\\u0645\\u0647\\u0627\\u0645\r\n#XTIT: This is the title for the Process Type section\r\nPROCESS_TYPE=\\u062A\\u062D\\u062F\\u064A\\u062F \\u0646\\u0648\\u0639 \\u0627\\u0644\\u0645\\u0639\\u0627\\u0645\\u0644\\u0629\r\n\r\n\r\n\r\n#Filters\r\n\r\n# XBUT: Filter Button for showing all open tasks\r\nLIST_FILTER_ALL_OPEN=\\u0643\\u0644 \\u0627\\u0644\\u0645\\u0641\\u062A\\u0648\\u062D\r\n# XBUT: Filter Button for showing all tasks that are due today\r\nLIST_FILTER_DUE_TODAY=\\u0627\\u0644\\u0645\\u0633\\u062A\\u062D\\u0642 \\u0627\\u0644\\u064A\\u0648\\u0645\r\n# XBUT: Filter Button for showing all tasks that are due this week\r\nLIST_FILTER_DUE_THIS_WEEK=\\u0627\\u0644\\u0645\\u0633\\u062A\\u062D\\u0642 \\u0647\\u0630\\u0627 \\u0627\\u0644\\u0623\\u0633\\u0628\\u0648\\u0639\r\n# XBUT: Filter Button for showing all completed tasks\r\nLIST_FILTER_COMPLETED=\\u0645\\u0643\\u062A\\u0645\\u0644\r\n\r\n# Filter Bar \r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_BAR_COMPLETED=\\u0645\\u0635\\u0641\\u0649 \\u062D\\u0633\\u0628 \\u0627\\u0644\\u0645\\u0647\\u0627\\u0645 \\u0627\\u0644\\u0645\\u0643\\u062A\\u0645\\u0644\\u0629\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_TODAY=\\u0645\\u0635\\u0641\\u0649 \\u062D\\u0633\\u0628 \\u0627\\u0644\\u0645\\u0647\\u0627\\u0645 \\u0627\\u0644\\u0645\\u0633\\u062A\\u062D\\u0642\\u0629 \\u0627\\u0644\\u064A\\u0648\\u0645\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_THIS_WEEK=\\u0645\\u0635\\u0641\\u0649 \\u062D\\u0633\\u0628 \\u0627\\u0644\\u0645\\u0647\\u0627\\u0645 \\u0627\\u0644\\u0645\\u0633\\u062A\\u062D\\u0642\\u0629 \\u0647\\u0630\\u0627 \\u0627\\u0644\\u0623\\u0633\\u0628\\u0648\\u0639\r\n# XTIT: filtered by Account\r\nLIST_FILTER_BAR_ACCOUNT=\\u062A\\u0645\\u062A \\u0627\\u0644\\u062A\\u0635\\u0641\\u064A\\u0629 \\u062D\\u0633\\u0628 \\u0627\\u0644\\u0639\\u0645\\u064A\\u0644 {0}\r\n\r\n# Filter Title\r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_TITLE_COMPLETED=\\u0627\\u0644\\u0645\\u0647\\u0627\\u0645 \\u0627\\u0644\\u0645\\u0643\\u062A\\u0645\\u0644\\u0629 ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_TODAY=\\u0627\\u0644\\u0645\\u0647\\u0627\\u0645 \\u0627\\u0644\\u0645\\u0633\\u062A\\u062D\\u0642\\u0629 \\u0627\\u0644\\u064A\\u0648\\u0645 ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_THIS_WEEK=\\u0627\\u0644\\u0645\\u0647\\u0627\\u0645 \\u0627\\u0644\\u0645\\u0633\\u062A\\u062D\\u0642\\u0629 \\u0647\\u0630\\u0627 \\u0627\\u0644\\u0623\\u0633\\u0628\\u0648\\u0639 ({0})\r\n# XTIT: filtered by Account\r\nLIST_FILTER_TITLE_ACCOUNT=\\u062A\\u0645\\u062A \\u0627\\u0644\\u062A\\u0635\\u0641\\u064A\\u0629 \\u062D\\u0633\\u0628 \\u0627\\u0644\\u0639\\u0645\\u064A\\u0644 {0} ({1})\r\n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TODAY=\\u0627\\u0644\\u064A\\u0648\\u0645\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TOMORROW=\\u063A\\u062F\\u064B\\u0627\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_YESTERDAY=\\u0623\\u0645\\u0633\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_IN_X_DAYS=\\u062E\\u0644\\u0627\\u0644 {0} \\u0645\\u0646 \\u0627\\u0644\\u0623\\u064A\\u0627\\u0645\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_X_DAYS_AGO=\\u0645\\u0646\\u0630 {0} \\u064A\\u0648\\u0645/\\u0623\\u064A\\u0627\\u0645\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=\\u0623\\u0646\\u062A \\u0645\\u0633\\u0624\\u0648\\u0644 \\u0639\\u0646 {0} \\u0645\\u0646 {1} \\u0645\\u0646 \\u0627\\u0644\\u0645\\u0647\\u0627\\u0645. \\u064A\\u062A\\u0645 \\u0639\\u0631\\u0636 \\u0627\\u0644\\u0645\\u0647\\u0627\\u0645 \\u0627\\u0644\\u062E\\u0627\\u0635\\u0629 \\u0628\\u0643 \\u0641\\u0642\\u0637.\r\n# XTIT: Confirmation message to indicate that the task has been completed\r\nLIST_COMPLETE_CONFIRMATION=\\u062A\\u0645 \\u062A\\u0639\\u064A\\u064A\\u0646 \\u0627\\u0644\\u0645\\u0647\\u0645\\u0629 {0} \\u0625\\u0644\\u0649 "\\u0645\\u0643\\u062A\\u0645\\u0644\\u0629"\r\n\r\n## Task Details \r\n###############\r\n\r\n# XTIT: task detail view name\r\nMC_DETAILS_TITLE=\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u0645\\u0647\\u0645\\u0629\r\n# XTIT: task detail title\r\nDETAILS_PAGE_TITLE=\\u0627\\u0644\\u0645\\u0647\\u0627\\u0645\r\n# XSEL: new task default text\r\nNEW_TASK_INPUT_PLACEHOLDER=\\u0645\\u0647\\u0645\\u0629 \\u062C\\u062F\\u064A\\u062F\\u0629\r\n# XTIT: initial title of a tasks\r\nNEW_TASK_TITLE=\\u0628\\u062F\\u0648\\u0646 \\u0639\\u0646\\u0648\\u0627\\u0646\r\n# XTIT: page title of a newly created task\r\nNEW_TASK_PAGE_TITLE=\\u0645\\u0647\\u0645\\u0629 \\u062C\\u062F\\u064A\\u062F\\u0629\r\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\r\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE=\\u062A\\u0645 \\u0627\\u0644\\u0625\\u0631\\u0633\\u0627\\u0644 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629 {0}\\u060C {1}\r\n\r\n\r\n#Form\r\n\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TITLE=\\u0627\\u0644\\u0639\\u0646\\u0648\\u0627\\u0646\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_NOTE=\\u0645\\u0644\\u0627\\u062D\\u0638\\u0629\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_DUE_DATE=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0627\\u0633\\u062A\\u062D\\u0642\\u0627\\u0642\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_ACCOUNT=\\u0627\\u0644\\u0639\\u0645\\u064A\\u0644\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_CONTACT=\\u062C\\u0647\\u0629 \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIVATE=\\u062E\\u0627\\u0635\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIORITY=\\u0627\\u0644\\u0623\\u0641\\u0636\\u0644\\u064A\\u0629\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_STATUS=\\u0627\\u0644\\u062D\\u0627\\u0644\\u0629\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TYPE=\\u0627\\u0644\\u0646\\u0648\\u0639\r\n\r\n#Buttons\r\n\r\n# XBUT: Button for deleting the task\r\nDETAILS_BUTTONS_DELETE=\\u062D\\u0630\\u0641 \\u0627\\u0644\\u0645\\u0647\\u0645\\u0629\r\n# XBUT: Button for deleting the task\r\nDETAILS_FOOTER_BUTTON_DELETE=\\u062D\\u0630\\u0641\r\n# XBUT: Button for canceling the task\r\nDETAILS_BUTTONS_CANCEL=\\u0625\\u0644\\u063A\\u0627\\u0621\r\n# XBUT: Button for creating a new task or saving the existing task\r\nDETAILS_BUTTONS_SAVE=\\u062D\\u0641\\u0638\r\n# XBUT: Button for assigning the task to another person\r\nDETAILS_BUTTONS_ASSIGNTO=\\u062A\\u0639\\u064A\\u064A\\u0646 \\u0625\\u0644\\u0649\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP=\\u0645\\u062A\\u0627\\u0628\\u0639\\u0629\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_TASK=\\u0645\\u062A\\u0627\\u0628\\u0639\\u0629 \\u0627\\u0644\\u0645\\u0647\\u0645\\u0629\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_OPPT=\\u0645\\u062A\\u0627\\u0628\\u0639\\u0629 \\u0627\\u0644\\u0641\\u0631\\u0635\\u0629 \\u0627\\u0644\\u0628\\u064A\\u0639\\u064A\\u0629\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_APPT=\\u0645\\u062A\\u0627\\u0628\\u0639\\u0629 \\u0627\\u0644\\u0645\\u0648\\u0639\\u062F\r\n\r\n#Message Box\r\n\r\n# XBUT: Title for the message box\r\nDETAILS_MESSAGEBOX_TITLE=\\u062D\\u0630\\u0641\r\n# YMSG: Text for the message box\r\nDETAILS_MESSAGEBOX_TEXT=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0628\\u0627\\u0644\\u062A\\u0623\\u0643\\u064A\\u062F \\u062D\\u0630\\u0641 \\u0647\\u0630\\u0647 \\u0627\\u0644\\u0645\\u0647\\u0645\\u0629\\u061F\r\n# XTIT: Confirmation message\r\nDETAILS_DELETE_CONFIRMATION=\\u062A\\u0645 \\u062D\\u0630\\u0641 \\u0627\\u0644\\u0645\\u0647\\u0645\\u0629 {0}\r\n#XTIT: Warning message\r\nNAVBACK_WARNING_TITLE=\\u062A\\u062D\\u0630\\u064A\\u0631\r\n#YMSG: Text for the message box\r\nNAVBACK_WARNING_MESSAGE=\\u0633\\u062A\\u0641\\u0642\\u062F \\u0625\\u062F\\u062E\\u0627\\u0644\\u0627\\u062A\\u0643\\u061B \\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0628\\u0627\\u0644\\u062A\\u0623\\u0643\\u064A\\u062F \\u0627\\u0644\\u062E\\u0631\\u0648\\u062C \\u0645\\u0646 \\u0647\\u0630\\u0647 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629\\u061F\r\n\r\n#Value Help \r\n\r\n# XTIT: Title for Value Help Account\r\nDETAILS_VALUE_HELP_ACC_TITLE=\\u062A\\u062D\\u062F\\u064A\\u062F \\u0639\\u0645\\u064A\\u0644\r\n# XTIT: Title for Value Help Contact\r\nDETAILS_VALUE_HELP_CON_TITLE=\\u062A\\u062D\\u062F\\u064A\\u062F \\u062C\\u0647\\u0629 \\u0627\\u062A\\u0635\\u0627\\u0644\r\n# YMSG: Filtered by info bar text for contact search popup\r\nDETAILS_VALUE_HELP_FILTERED_BY=\\u062A\\u0645\\u062A \\u0627\\u0644\\u062A\\u0635\\u0641\\u064A\\u0629 \\u062D\\u0633\\u0628\r\n# XTIT: Account VH item description: city, country\r\nDETAILS_VALUE_HELP_ACC_DESCR={0}, {1}\r\n# XTIT: Contact VH item description: account name, function\r\nDETAILS_VALUE_HELP_CON_DESCR={0}, {1}\r\n\r\n\r\n#Business card Account and Contact\r\n\r\n# XTIT: Title for business card Account\r\nDETAILS_BCARD_ACCOUNT=\\u0646\\u0638\\u0631\\u0629 \\u0639\\u0627\\u0645\\u0629 \\u0639\\u0644\\u0649 \\u0627\\u0644\\u0639\\u0645\\u064A\\u0644\r\n# XTIT: Title for business card Contact\r\nDETAILS_BCARD_CONTACT=\\u0646\\u0638\\u0631\\u0629 \\u0639\\u0627\\u0645\\u0629 \\u0639\\u0644\\u0649 \\u062C\\u0647\\u0627\\u062A \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644\r\n\r\n#Assign task to\r\n\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TITLE=\\u062A\\u0639\\u064A\\u064A\\u0646 \\u0625\\u0644\\u0649\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TEXT=\\u062A\\u0639\\u064A\\u064A\\u0646 \\u0627\\u0644\\u0645\\u0647\\u0645\\u0629 \\u0625\\u0644\\u0649\r\n# XTIT: Title for employee search\r\nDETAILS_ASSIGNTO_ASIGNEE=\\u062A\\u0639\\u064A\\u064A\\u0646 \\u0627\\u0644\\u0645\\u0647\\u0645\\u0629 \\u0625\\u0644\\u0649 \\u0627\\u0644\\u0645\\u0648\\u0638\\u0641\r\n# XTIT: Confirmation message\r\nDETAILS_ASSIGNTO_CONFIRMATION=\\u062A\\u0645 \\u062A\\u0639\\u064A\\u064A\\u0646 \\u0627\\u0644\\u0645\\u0647\\u0645\\u0629 \\u0625\\u0644\\u0649 {0}\r\n# XBUT: Button on dialog: ok\r\nDIALOG_ASSIGNTO_BUTTON_OK=\\u0645\\u0648\\u0627\\u0641\\u0642\r\n# XBUT: Button on dialog: cancel\r\nDIALOG_ASSIGNTO_BUTTON_CANCEL=\\u0625\\u0644\\u063A\\u0627\\u0621\r\n\r\n# errors\r\n\r\n# YMSG: generic error\r\nGENERIC_ERROR=\\u0627\\u0644\\u0646\\u0638\\u0627\\u0645 \\u063A\\u064A\\u0631 \\u0645\\u062A\\u0648\\u0641\\u0631 \\u062D\\u0627\\u0644\\u064A\\u064B\\u0627\\u061B \\u062D\\u0627\\u0648\\u0644 \\u0645\\u0631\\u0629 \\u0623\\u062E\\u0631\\u0649 \\u0644\\u0627\\u062D\\u0642\\u064B\\u0627 \\u0623\\u0648 \\u0627\\u062A\\u0635\\u0644 \\u0628\\u0645\\u0633\\u0624\\u0648\\u0644 \\u0627\\u0644\\u0646\\u0638\\u0627\\u0645 \\u0644\\u062F\\u064A\\u0643\r\n# YMSG: error in date\r\nDETAILS_MESSAGETEXT_DATE=\\u0627\\u0644\\u062A\\u0627\\u0631\\u064A\\u062E \\u063A\\u064A\\u0631 \\u0635\\u0627\\u0644\\u062D \\u0623\\u0648 \\u0623\\u0646\\u0647 \\u0644\\u064A\\u0633 \\u0628\\u0627\\u0644\\u062A\\u0646\\u0633\\u064A\\u0642 \\u0627\\u0644\\u0635\\u062D\\u064A\\u062D\\u061B \\u0627\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0645\\u0633\\u0627\\u0639\\u062F\\u0629 \\u0627\\u0644\\u0625\\u062F\\u062E\\u0627\\u0644 \\u0644\\u0625\\u062F\\u062E\\u0627\\u0644 \\u0627\\u0644\\u062A\\u0627\\u0631\\u064A\\u062E\r\n# YMSG: error in account\r\nDETAILS_MESSAGETEXT_ACCOUNT=\\u0627\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0645\\u0633\\u0627\\u0639\\u062F\\u0629 \\u0627\\u0644\\u0625\\u062F\\u062E\\u0627\\u0644 \\u0644\\u0625\\u062F\\u062E\\u0627\\u0644 \\u0639\\u0645\\u064A\\u0644\r\n# YMSG: error in contact\r\nDETAILS_MESSAGETEXT_CONTACT=\\u0627\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0645\\u0633\\u0627\\u0639\\u062F\\u0629 \\u0627\\u0644\\u0625\\u062F\\u062E\\u0627\\u0644 \\u0644\\u0625\\u062F\\u062E\\u0627\\u0644 \\u062C\\u0647\\u0629 \\u0627\\u062A\\u0635\\u0627\\u0644\r\n# YMSG: title for the validation message box after save is clicked\r\nDETAILS_VALIDATION_TITLE=\\u0627\\u0633\\u062A\\u062E\\u062F\\u0627\\u0645 \\u0645\\u0633\\u0627\\u0639\\u062F\\u0629 \\u0627\\u0644\\u0625\\u062F\\u062E\\u0627\\u0644\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=\\u062C\\u0627\\u0631\\u064D \\u0627\\u0644\\u062A\\u062D\\u0645\\u064A\\u0644...\r\n\r\n# XTIT: Title for Follow up Dialog\r\nDETAILS_FOLLOWUP_TITLE=\\u0645\\u062A\\u0627\\u0628\\u0639\\u0629\r\n# XBUT: Button text for Follow up activities\r\nDETAILS_FOLLOWUP_BUTTON=\\u0645\\u062A\\u0627\\u0628\\u0639\\u0629\r\n# XTIT: Title for Confirmation Dialog to save task or not \r\nDETAILS_CONFIRM_TITLE=\\u062A\\u0623\\u0643\\u064A\\u062F\r\n# YMSG: Prompt use to save existing task or not\r\nDETAILS_FOLLOWUP_MESSAGE=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u062D\\u0641\\u0638 \\u0627\\u0644\\u0645\\u0647\\u0645\\u0629 \\u0627\\u0644\\u062D\\u0627\\u0644\\u064A\\u0629\\u061F\r\n# XBUT: Positive action to save the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_YES=\\u0646\\u0639\\u0645\r\n# XBUT: Positive action to cancel the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_NO=\\u0644\\u0627\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT=No follow up types available\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_TASK=Cannot proceed in creating a task since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_OPPT=Cannot proceed in creating an opportunity since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_APPT=Cannot proceed in creating an appointment since no follow up types are maintained\r\n# YMSG: Message shown to end user notifying that the follow up was successful\r\nFOLLOWUP_COMPLETED=\\u062A\\u0645\\u062A \\u0627\\u0644\\u0645\\u062A\\u0627\\u0628\\u0639\\u0629 \\u0628\\u0646\\u062C\\u0627\\u062D\r\n# YMSG: Message shown once the task is saved during a follow up scenario\r\nFOLLOWUP_TASK_SAVED=\\u062A\\u0645 \\u062D\\u0641\\u0638 \\u0645\\u0647\\u0645\\u0629 \\u0627\\u0644\\u0645\\u062A\\u0627\\u0628\\u0639\\u0629\r\n# YMSG: Message shown if a new or existing task is saved\r\nCURRENT_TASK_SAVED=\\u062A\\u0645 \\u062D\\u0641\\u0638 \\u0627\\u0644\\u0645\\u0647\\u0645\\u0629\r\n# YMSG: Error message shown to the end user telling that follow up activities cannot be done\r\nFOLLOWUP_ERROR_MSG=\\u0627\\u0644\\u0645\\u0647\\u0645\\u0629 \\u0627\\u0644\\u062D\\u0627\\u0644\\u064A\\u0629 {0} \\u0628\\u0647\\u0627 \\u0623\\u062E\\u0637\\u0627\\u0621 \\u0623\\u0648 \\u0644\\u0645 \\u062A\\u062A\\u0645 \\u0635\\u064A\\u0627\\u0646\\u0629 \\u0623\\u064A \\u0623\\u0646\\u0648\\u0627\\u0639 \\u0645\\u0639\\u0627\\u0645\\u064E\\u0644\\u0627\\u062A \\u0644\\u0627\\u062D\\u0642\\u0629 \\u0641\\u064A \\u0627\\u0644\\u062A\\u062E\\u0635\\u064A\\u0635\r\n\r\n#XFLD: Transaction Type of a given task\r\nS4_TASK_TYPE=\\u0627\\u0644\\u0646\\u0648\\u0639\\: {0}\r\n#XFLD: Due Date of a given task\r\nS4_TASK_DUEDATE=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0627\\u0633\\u062A\\u062D\\u0642\\u0627\\u0642\\: {0}\r\n#XFLD: Account of a given task\r\nS4_TASK_ACCOUNT=\\u0627\\u0644\\u0639\\u0645\\u064A\\u0644\\: {0}\r\n#XFLD: Contact of a given task\r\nS4_TASK_CONTACT=\\u062C\\u0647\\u0629 \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644\\: {0}\r\n#XFLD: Notes of a given task\r\nS4_TASK_NOTES=\\u0645\\u0644\\u0627\\u062D\\u0638\\u0627\\u062A\r\n#XFLD: Attachments of a given task\r\nS4_TASK_ATTACHMENTS=\\u0627\\u0644\\u0645\\u064F\\u0631\\u0641\\u0642\\u0627\\u062A\\: {0}\r\n#XFLD: Transaction History of a given task\r\nS4_TASK_DOCHISTORY=\\u0633\\u062C\\u0644 \\u0627\\u0644\\u0645\\u0639\\u0627\\u0645\\u064E\\u0644\\u0627\\u062A\r\n# XBUT: Button for follow up of given task to a task\r\nS4_BUTTONS_FOLLOWUPTOTASK=\\u0627\\u0644\\u0645\\u0647\\u0645\\u0629\r\n# XBUT: Button for follow up of given task to a opportunity\r\nS4_BUTTONS_FOLLOWUPTOOPPT=\\u0627\\u0644\\u0641\\u0631\\u0635\\u0629 \\u0627\\u0644\\u0628\\u064A\\u0639\\u064A\\u0629\r\n# XBUT: Button for follow up of given task to an appointment\r\nS4_BUTTONS_FOLLOWUPTOAPPT=\\u0627\\u0644\\u0645\\u0648\\u0639\\u062F\r\n# XBUT: Button for editing the task\r\nS4_FOOTER_BUTTON_EDIT=\\u062A\\u062D\\u0631\\u064A\\u0631\r\n#XFLD: Column Label for the transaction ID of the document\r\nS4_DOCHISTORY_ID=\\u0645\\u0639\\u0631\\u0641 \\u0627\\u0644\\u0645\\u0639\\u0627\\u0645\\u0644\\u0629\r\n#XFLD: Column Label for the transaction type of the document\r\nS4_DOCHISTORY_TTYPE=\\u0646\\u0648\\u0639 \\u0627\\u0644\\u0645\\u0639\\u0627\\u0645\\u0644\\u0629\r\n#XFLD: Column Label for the description of the document\r\nS4_DOCHISTORY_DESC=\\u0627\\u0644\\u0648\\u0635\\u0641\r\n#XFLD: Column Label for the creation date of the document\r\nS4_DOCHISTORY_CREATEDDATE=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0625\\u0646\\u0634\\u0627\\u0621\r\n#XFLD: Column Label for the relation type to indicate whether current document precedes/succeeds\r\nS4_DOCHISTORY_RELTYPE=\\u0646\\u0648\\u0639 \\u0627\\u0644\\u0639\\u0644\\u0627\\u0642\\u0629\r\n#XFLD: Label to be shown if no transaction history is available\r\nS4_NO_DOCHISTORY=\\u0644\\u0627 \\u062A\\u062A\\u0648\\u0641\\u0631 \\u0623\\u064A\\u0629 \\u0645\\u0639\\u0627\\u0645\\u064E\\u0644\\u0627\\u062A\r\n# YMSG: Message shown when renaming an attachment of a task is successful\r\nS3_RENAME_ATTACHMENT_SUCCESS=\\u062A\\u0645\\u062A \\u0625\\u0639\\u0627\\u062F\\u0629 \\u062A\\u0633\\u0645\\u064A\\u0629 \\u0627\\u0644\\u0645\\u064F\\u0631\\u0641\\u0642 \\u0628\\u0646\\u062C\\u0627\\u062D\r\n# YMSG: Message shown when renaming an attachment of a task fails\r\nS3_RENAME_ATTACHMENT_FAILED=\\u062A\\u0639\\u0630\\u0631\\u062A \\u0625\\u0639\\u0627\\u062F\\u0629 \\u062A\\u0633\\u0645\\u064A\\u0629 \\u0627\\u0644\\u0645\\u064F\\u0631\\u0641\\u0642\r\n# XBUT: Button for Displaying the Errors\r\nDETAILS_FOOTER_BUTTON_MESSAGE=\\u0627\\u0644\\u0631\\u0633\\u0627\\u0626\\u0644\r\n#XTIT: Title of the messages dialog listing the messages with count\r\nS4_MESSAGES_TITLE=\\u0627\\u0644\\u0631\\u0633\\u0627\\u0626\\u0644 ({0})\r\n# YMSG: Message shown when when the user updates a task in its previous state\r\nS3_412_ERRORMSG=\\u062A\\u0645 \\u062A\\u063A\\u064A\\u064A\\u0631 \\u0627\\u0644\\u0628\\u064A\\u0627\\u0646\\u0627\\u062A \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629 \\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0622\\u062E\\u0631\\u061B \\u0627\\u0646\\u0642\\u0631 \\u0641\\u0648\\u0642 \\u0645\\u0648\\u0627\\u0641\\u0642 \\u0644\\u0627\\u0633\\u062A\\u062F\\u0639\\u0627\\u0621 \\u0622\\u062E\\u0631 \\u0625\\u0635\\u062F\\u0627\\u0631\r\n#XTIT: Title of dialog indicating an error occurred\r\nS3_412_TITLE=\\u062E\\u0637\\u0623\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS3_ACCOUNT_CONTACT_NOREL=\\u064A\\u0645\\u0643\\u0646\\u0643 \\u0641\\u0642\\u0637 \\u0639\\u0631\\u0636 \\u0628\\u0637\\u0627\\u0642\\u0627\\u062A \\u0639\\u0645\\u0644 \\u062C\\u0647\\u0627\\u062A \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644 \\u0627\\u0644\\u0645\\u0639\\u064A\\u0646\\u0629 \\u0625\\u0644\\u0649 \\u0647\\u0630\\u0627 \\u0627\\u0644\\u0639\\u0645\\u064A\\u0644\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS4_ACCOUNT_CONTACT_NOREL=\\u064A\\u0645\\u0643\\u0646\\u0643 \\u0641\\u0642\\u0637 \\u0639\\u0631\\u0636 \\u0628\\u0637\\u0627\\u0642\\u0627\\u062A \\u0639\\u0645\\u0644 \\u062C\\u0647\\u0627\\u062A \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644 \\u0627\\u0644\\u0645\\u0639\\u064A\\u0646\\u0629 \\u0625\\u0644\\u0649 \\u0647\\u0630\\u0627 \\u0627\\u0644\\u0639\\u0645\\u064A\\u0644\r\n',
	"cus/crm/mytasks/i18n/i18n_bg.properties":'\r\n\r\n\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n# XFLD: No Tasks found text\r\nSEARCH_LIST_NODATA_GENERIC=\\u041D\\u0435 \\u0441\\u0430 \\u043E\\u0442\\u043A\\u0440\\u0438\\u0442\\u0438 \\u0440\\u0435\\u0437\\u0443\\u043B\\u0442\\u0430\\u0442\\u0438\r\n\r\n## Task List \r\n############\r\n\r\n# XTIT: Shell title\r\nSHELL_TITLE=\\u0417\\u0430\\u0434\\u0430\\u0447\\u0438\r\n# XTIT: Task list title\r\nLIST_PAGE_TITLE=\\u0417\\u0430\\u0434\\u0430\\u0447\\u0438\r\n# XTIT: Task list title with number of tasks\r\nLIST_PAGE_TITLE_WITH_NUMBER=\\u041E\\u0442\\u0432\\u043E\\u0440\\u0435\\u043D\\u0438 \\u0437\\u0430\\u0434\\u0430\\u0447\\u0438 ({0})\r\n# XTIT: Task list title wname for the add button\r\nLIST_ADD=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435\r\n# XTIT: Application name\r\nMASTER_TITLE=\\u041C\\u043E\\u0438\\u0442\\u0435 \\u0437\\u0430\\u0434\\u0430\\u0447\\u0438\r\n# XMSG: Busy text\r\nMASTER_BUSY_TEXT=\\u0417\\u0430\\u0440\\u0435\\u0436\\u0434\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0437\\u0430\\u0434\\u0430\\u0447\\u0438...\r\n# XMSG: Busy text\r\nMASTER_SEARCH_PLACEHOLDER=\\u0422\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435...\r\n# XTOL: Search tool tip \r\nMASTER_SEARCH_TOOLTIP=\\u0422\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435 \\u043D\\u0430 \\u0437\\u0430\\u0434\\u0430\\u0447\\u0438\r\n#XTIT: This is the title for the Process Type section\r\nPROCESS_TYPE=\\u0418\\u0437\\u0431\\u043E\\u0440 \\u043D\\u0430 \\u0432\\u0438\\u0434 \\u0442\\u0440\\u0430\\u043D\\u0437\\u0430\\u043A\\u0446\\u0438\\u044F\r\n\r\n\r\n\r\n#Filters\r\n\r\n# XBUT: Filter Button for showing all open tasks\r\nLIST_FILTER_ALL_OPEN=\\u0412\\u0441\\u0438\\u0447\\u043A\\u0438 \\u043E\\u0442\\u0432\\u043E\\u0440\\u0435\\u043D\\u0438\r\n# XBUT: Filter Button for showing all tasks that are due today\r\nLIST_FILTER_DUE_TODAY=\\u0421\\u044A\\u0441 \\u0441\\u0440\\u043E\\u043A \\u0434\\u043D\\u0435\\u0441\r\n# XBUT: Filter Button for showing all tasks that are due this week\r\nLIST_FILTER_DUE_THIS_WEEK=\\u0421\\u044A\\u0441 \\u0441\\u0440\\u043E\\u043A \\u0442\\u0430\\u0437\\u0438 \\u0441\\u0435\\u0434\\u043C\\u0438\\u0446\\u0430\r\n# XBUT: Filter Button for showing all completed tasks\r\nLIST_FILTER_COMPLETED=\\u0417\\u0430\\u0432\\u044A\\u0440\\u0448\\u0435\\u043D\r\n\r\n# Filter Bar \r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_BAR_COMPLETED=\\u0424\\u0438\\u043B\\u0442\\u0440\\u0438\\u0440\\u0430\\u043D\\u0438 \\u043F\\u043E \\u0437\\u0430\\u0432\\u044A\\u0440\\u0448\\u0435\\u043D\\u0438 \\u0437\\u0430\\u0434\\u0430\\u0447\\u0438\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_TODAY=\\u0424\\u0438\\u043B\\u0442\\u0440\\u0438\\u0440\\u0430\\u043D\\u0438 \\u043F\\u043E \\u0437\\u0430\\u0434\\u0430\\u0447\\u0438 \\u0441\\u044A\\u0441 \\u0441\\u0440\\u043E\\u043A \\u0434\\u043D\\u0435\\u0441\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_THIS_WEEK=\\u0424\\u0438\\u043B\\u0442\\u0440\\u0438\\u0440\\u0430\\u043D\\u0438 \\u043F\\u043E \\u0437\\u0430\\u0434\\u0430\\u0447\\u0438 \\u0441\\u044A\\u0441 \\u0441\\u0440\\u043E\\u043A \\u0441\\u0435\\u0434\\u043C\\u0438\\u0446\\u0430\r\n# XTIT: filtered by Account\r\nLIST_FILTER_BAR_ACCOUNT=\\u0424\\u0438\\u043B\\u0442\\u0440\\u0438\\u0440\\u0430\\u043D \\u043F\\u043E \\u0441\\u043C\\u0435\\u0442\\u043A\\u0430 {0}\r\n\r\n# Filter Title\r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_TITLE_COMPLETED=\\u041F\\u0440\\u0438\\u043A\\u043B\\u044E\\u0447\\u0435\\u043D\\u0438 \\u0437\\u0430\\u0434\\u0430\\u0447\\u0438 ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_TODAY=\\u0417\\u0430\\u0434\\u0430\\u0447\\u0438 \\u0441 \\u043A\\u0440\\u0430\\u0435\\u043D \\u0441\\u0440\\u043E\\u043A \\u0434\\u043D\\u0435\\u0441 ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_THIS_WEEK=\\u0417\\u0430\\u0434\\u0430\\u0447\\u0438 \\u0441 \\u043A\\u0440\\u0430\\u0435\\u043D \\u0441\\u0440\\u043E\\u043A \\u0442\\u0430\\u0437\\u0438 \\u0441\\u0435\\u0434\\u043C\\u0438\\u0446\\u0430 ({0})\r\n# XTIT: filtered by Account\r\nLIST_FILTER_TITLE_ACCOUNT=\\u0424\\u0438\\u043B\\u0442\\u0440\\u0438\\u0440\\u0430\\u043D \\u043F\\u043E \\u0441\\u043C\\u0435\\u0442\\u043A\\u0430 {0} ({1})\r\n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TODAY=\\u0414\\u043D\\u0435\\u0441\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TOMORROW=\\u0423\\u0442\\u0440\\u0435\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_YESTERDAY=\\u0412\\u0447\\u0435\\u0440\\u0430\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_IN_X_DAYS=\\u0412 {0} \\u0434\\u043D\\u0438\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_X_DAYS_AGO=\\u043F\\u0440\\u0435\\u0434\\u0438 {0} \\u0434\\u043D\\u0438\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=\\u041E\\u0442\\u0433\\u043E\\u0432\\u043E\\u0440\\u043D\\u0438 \\u0441\\u0442\\u0435 \\u0437\\u0430 {0} \\u043E\\u0442 {1} \\u0437\\u0430\\u0434\\u0430\\u0447\\u0438. \\u0421\\u0430\\u043C\\u043E \\u0412\\u0430\\u0448\\u0438\\u0442\\u0435 \\u0437\\u0430\\u0434\\u0430\\u0447\\u0438 \\u0441\\u0430 \\u043F\\u043E\\u043A\\u0430\\u0437\\u0430\\u043D\\u0438.\r\n# XTIT: Confirmation message to indicate that the task has been completed\r\nLIST_COMPLETE_CONFIRMATION=\\u0417\\u0430\\u0434\\u0430\\u0447\\u0430 {0} \\u0435 \\u0437\\u0430\\u0434\\u0430\\u0434\\u0435\\u043D\\u0430 \\u043D\\u0430 \\u041F\\u0440\\u0438\\u043A\\u043B\\u044E\\u0447\\u0435\\u043D\\u0430\r\n\r\n## Task Details \r\n###############\r\n\r\n# XTIT: task detail view name\r\nMC_DETAILS_TITLE=\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438 \\u0437\\u0430 \\u0437\\u0430\\u0434\\u0430\\u0447\\u0430\r\n# XTIT: task detail title\r\nDETAILS_PAGE_TITLE=\\u0417\\u0430\\u0434\\u0430\\u0447\\u0438\r\n# XSEL: new task default text\r\nNEW_TASK_INPUT_PLACEHOLDER=\\u041D\\u043E\\u0432\\u0430 \\u0437\\u0430\\u0434\\u0430\\u0447\\u0430\r\n# XTIT: initial title of a tasks\r\nNEW_TASK_TITLE=\\u041D\\u0435\\u043E\\u0437\\u0430\\u0433\\u043B\\u0430\\u0432\\u0435\\u043D\r\n# XTIT: page title of a newly created task\r\nNEW_TASK_PAGE_TITLE=\\u041D\\u043E\\u0432\\u0430 \\u0437\\u0430\\u0434\\u0430\\u0447\\u0430\r\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\r\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE=\\u041F\\u0440\\u0435\\u0430\\u0434\\u0440\\u0435\\u0441\\u0438\\u0440\\u0430\\u043D \\u043E\\u0442 {0}, {1}\r\n\r\n\r\n#Form\r\n\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TITLE=\\u0417\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_NOTE=\\u0417\\u0430\\u0431\\u0435\\u043B\\u0435\\u0436\\u043A\\u0430\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_DUE_DATE=\\u041F\\u0430\\u0434\\u0435\\u0436\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_ACCOUNT=\\u0410\\u043A\\u0430\\u0443\\u043D\\u0442\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_CONTACT=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIVATE=\\u0427\\u0430\\u0441\\u0442\\u043D\\u043E\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIORITY=\\u041F\\u0440\\u0438\\u043E\\u0440\\u0438\\u0442\\u0435\\u0442\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_STATUS=\\u0421\\u0442\\u0430\\u0442\\u0443\\u0441\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TYPE=\\u0412\\u0438\\u0434\r\n\r\n#Buttons\r\n\r\n# XBUT: Button for deleting the task\r\nDETAILS_BUTTONS_DELETE=\\u0418\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0437\\u0430\\u0434\\u0430\\u0447\\u0430\r\n# XBUT: Button for deleting the task\r\nDETAILS_FOOTER_BUTTON_DELETE=\\u0418\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435\r\n# XBUT: Button for canceling the task\r\nDETAILS_BUTTONS_CANCEL=\\u041E\\u0442\\u043A\\u0430\\u0437\r\n# XBUT: Button for creating a new task or saving the existing task\r\nDETAILS_BUTTONS_SAVE=\\u0417\\u0430\\u043F\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435\r\n# XBUT: Button for assigning the task to another person\r\nDETAILS_BUTTONS_ASSIGNTO=\\u041F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u044F\\u0432\\u0430\\u043D\\u0435 \\u043A\\u044A\\u043C\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP=\\u041F\\u043E\\u0441\\u043B\\u0435\\u0434\\u0432\\u0430\\u0449\\u0430 \\u043E\\u0431\\u0440\\u0430\\u0431\\u043E\\u0442\\u043A\\u0430\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_TASK=\\u041F\\u043E\\u0441\\u043B\\u0435\\u0434\\u0432\\u0430\\u0449\\u0430 \\u0437\\u0430\\u0434\\u0430\\u0447\\u0430\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_OPPT=\\u041F\\u043E\\u0441\\u043B\\u0435\\u0434\\u0432\\u0430\\u0449\\u0430 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_APPT=\\u041F\\u043E\\u0441\\u043B\\u0435\\u0434\\u0432\\u0430\\u0449 \\u0441\\u0440\\u043E\\u043A\r\n\r\n#Message Box\r\n\r\n# XBUT: Title for the message box\r\nDETAILS_MESSAGEBOX_TITLE=\\u0418\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435\r\n# YMSG: Text for the message box\r\nDETAILS_MESSAGEBOX_TEXT=\\u0421\\u0438\\u0433\\u0443\\u0440\\u043D\\u0438 \\u043B\\u0438 \\u0441\\u0442\\u0435, \\u0447\\u0435 \\u0436\\u0435\\u043B\\u0430\\u0435\\u0442\\u0435 \\u0434\\u0430 \\u0438\\u0437\\u0442\\u0440\\u0438\\u0435\\u0442\\u0435 \\u0442\\u0430\\u0437\\u0438 \\u0437\\u0430\\u0434\\u0430\\u0447\\u0430?\r\n# XTIT: Confirmation message\r\nDETAILS_DELETE_CONFIRMATION=\\u0417\\u0430\\u0434\\u0430\\u0447\\u0430 {0} \\u0435 \\u0438\\u0437\\u0442\\u0440\\u0438\\u0442\\u0430\r\n#XTIT: Warning message\r\nNAVBACK_WARNING_TITLE=\\u041F\\u0440\\u0435\\u0434\\u0443\\u043F\\u0440\\u0435\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435\r\n#YMSG: Text for the message box\r\nNAVBACK_WARNING_MESSAGE=\\u0417\\u0430\\u043F\\u0438\\u0441\\u0438\\u0442\\u0435 \\u0432\\u0438 \\u0449\\u0435 \\u0431\\u044A\\u0434\\u0430\\u0442 \\u0438\\u0437\\u0442\\u0440\\u0438\\u0442\\u0438; \\u0441\\u0438\\u0433\\u0443\\u0440\\u043D\\u0438 \\u043B\\u0438 \\u0441\\u0442\\u0435, \\u0447\\u0435 \\u0436\\u0435\\u043B\\u0430\\u0435\\u0442\\u0435 \\u0434\\u0430 \\u043D\\u0430\\u043F\\u0443\\u0441\\u043D\\u0435\\u0442\\u0435 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\\u0442\\u0430?\r\n\r\n#Value Help \r\n\r\n# XTIT: Title for Value Help Account\r\nDETAILS_VALUE_HELP_ACC_TITLE=\\u0418\\u0437\\u0431\\u043E\\u0440 \\u043D\\u0430 \\u0430\\u043A\\u0430\\u0443\\u043D\\u0442\r\n# XTIT: Title for Value Help Contact\r\nDETAILS_VALUE_HELP_CON_TITLE=\\u0418\\u0437\\u0431\\u043E\\u0440 \\u043D\\u0430 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n# YMSG: Filtered by info bar text for contact search popup\r\nDETAILS_VALUE_HELP_FILTERED_BY=\\u0424\\u0438\\u043B\\u0442\\u0440\\u0438\\u0440\\u0430\\u043D\\u0438 \\u043F\\u043E\r\n# XTIT: Account VH item description: city, country\r\nDETAILS_VALUE_HELP_ACC_DESCR={0}, {1}\r\n# XTIT: Contact VH item description: account name, function\r\nDETAILS_VALUE_HELP_CON_DESCR={0}, {1}\r\n\r\n\r\n#Business card Account and Contact\r\n\r\n# XTIT: Title for business card Account\r\nDETAILS_BCARD_ACCOUNT=\\u041F\\u0440\\u0435\\u0433\\u043B\\u0435\\u0434 \\u043D\\u0430 \\u0430\\u043A\\u0430\\u0443\\u043D\\u0442\\u0438\r\n# XTIT: Title for business card Contact\r\nDETAILS_BCARD_CONTACT=\\u041F\\u0440\\u0435\\u0433\\u043B\\u0435\\u0434 \\u043D\\u0430 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438\r\n\r\n#Assign task to\r\n\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TITLE=\\u041F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u044F\\u0432\\u0430\\u043D\\u0435 \\u043A\\u044A\\u043C\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TEXT=\\u041F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u044F\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0437\\u0430\\u0434\\u0430\\u0447\\u0430 \\u043A\\u044A\\u043C\r\n# XTIT: Title for employee search\r\nDETAILS_ASSIGNTO_ASIGNEE=\\u041F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u044F\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0437\\u0430\\u0434\\u0430\\u0447\\u0430 \\u043A\\u044A\\u043C \\u0441\\u043B\\u0443\\u0436\\u0438\\u0442\\u0435\\u043B\r\n# XTIT: Confirmation message\r\nDETAILS_ASSIGNTO_CONFIRMATION=\\u0417\\u0430\\u0434\\u0430\\u0447\\u0430 \\u043F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0435\\u043D\\u0430 \\u043A\\u044A\\u043C {0}\r\n# XBUT: Button on dialog: ok\r\nDIALOG_ASSIGNTO_BUTTON_OK=OK\r\n# XBUT: Button on dialog: cancel\r\nDIALOG_ASSIGNTO_BUTTON_CANCEL=\\u041E\\u0442\\u043A\\u0430\\u0437\r\n\r\n# errors\r\n\r\n# YMSG: generic error\r\nGENERIC_ERROR=\\u0412 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442\\u0430 \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0430\\u0442\\u0430 \\u043D\\u0435 \\u0435 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0430; \\u043E\\u043F\\u0438\\u0442\\u0430\\u0439\\u0442\\u0435 \\u043E\\u0442\\u043D\\u043E\\u0432\\u043E \\u0438\\u043B\\u0438 \\u0441\\u0435 \\u0441\\u0432\\u044A\\u0440\\u0436\\u0435\\u0442\\u0435 \\u0441 \\u0432\\u0430\\u0448\\u0438\\u044F \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0435\\u043D \\u0430\\u0434\\u043C\\u0438\\u043D\\u0438\\u0441\\u0442\\u0440\\u0430\\u0442\\u043E\\u0440\r\n# YMSG: error in date\r\nDETAILS_MESSAGETEXT_DATE=\\u0414\\u0430\\u0442\\u0430\\u0442\\u0430 \\u0435 \\u043D\\u0435\\u0432\\u0430\\u043B\\u0438\\u0434\\u043D\\u0430 \\u0438\\u043B\\u0438 \\u0435 \\u0432 \\u0433\\u0440\\u0435\\u0448\\u0435\\u043D \\u0444\\u043E\\u0440\\u043C\\u0430\\u0442; \\u0438\\u0437\\u043F\\u043E\\u043B\\u0437\\u0432\\u0430\\u0439\\u0442\\u0435 \\u043F\\u043E\\u043C\\u043E\\u0449\\u0442\\u0430 \\u043F\\u0440\\u0438 \\u0432\\u044A\\u0432\\u0435\\u0436\\u0434\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0434\\u0430\\u043D\\u043D\\u0438, \\u0437\\u0430 \\u0434\\u0430 \\u044F \\u0432\\u044A\\u0432\\u0435\\u0434\\u0435\\u0442\\u0435\r\n# YMSG: error in account\r\nDETAILS_MESSAGETEXT_ACCOUNT=\\u0418\\u0437\\u043F\\u043E\\u043B\\u0437\\u0432\\u0430\\u0439\\u0442\\u0435 \\u043F\\u043E\\u043C\\u043E\\u0449\\u0442\\u0430 \\u043F\\u0440\\u0438 \\u0432\\u044A\\u0432\\u0435\\u0436\\u0434\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0434\\u0430\\u043D\\u043D\\u0438, \\u0437\\u0430 \\u0434\\u0430 \\u0432\\u044A\\u0432\\u0435\\u0434\\u0435\\u0442\\u0435 \\u0430\\u043A\\u0430\\u0443\\u043D\\u0442\r\n# YMSG: error in contact\r\nDETAILS_MESSAGETEXT_CONTACT=\\u0418\\u0437\\u043F\\u043E\\u043B\\u0437\\u0432\\u0430\\u0439\\u0442\\u0435 \\u043F\\u043E\\u043C\\u043E\\u0449\\u0442\\u0430 \\u043F\\u0440\\u0438 \\u0432\\u044A\\u0432\\u0435\\u0436\\u0434\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0434\\u0430\\u043D\\u043D\\u0438, \\u0437\\u0430 \\u0434\\u0430 \\u0432\\u044A\\u0432\\u0435\\u0434\\u0435\\u0442\\u0435 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n# YMSG: title for the validation message box after save is clicked\r\nDETAILS_VALIDATION_TITLE=\\u0418\\u0437\\u043F\\u043E\\u043B\\u0437\\u0432\\u0430\\u0439\\u0442\\u0435 \\u043F\\u043E\\u043C\\u043E\\u0449 \\u043F\\u0440\\u0438 \\u0432\\u044A\\u0432\\u0435\\u0436\\u0434\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0434\\u0430\\u043D\\u043D\\u0438\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=\\u0417\\u0430\\u0440\\u0435\\u0436\\u0434\\u0430\\u043D\\u0435...\r\n\r\n# XTIT: Title for Follow up Dialog\r\nDETAILS_FOLLOWUP_TITLE=\\u041F\\u043E\\u0441\\u043B\\u0435\\u0434\\u0432\\u0430\\u0449\\u0430 \\u0442\\u0440\\u0430\\u043D\\u0437\\u0430\\u043A\\u0446\\u0438\\u044F\r\n# XBUT: Button text for Follow up activities\r\nDETAILS_FOLLOWUP_BUTTON=\\u041F\\u043E\\u0441\\u043B\\u0435\\u0434\\u0432\\u0430\\u0449\\u0430 \\u0442\\u0440\\u0430\\u043D\\u0437\\u0430\\u043A\\u0446\\u0438\\u044F\r\n# XTIT: Title for Confirmation Dialog to save task or not \r\nDETAILS_CONFIRM_TITLE=\\u041F\\u043E\\u0442\\u0432\\u044A\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435\r\n# YMSG: Prompt use to save existing task or not\r\nDETAILS_FOLLOWUP_MESSAGE=\\u0416\\u0435\\u043B\\u0430\\u0435\\u0442\\u0435 \\u043B\\u0438 \\u0434\\u0430 \\u0437\\u0430\\u043F\\u0430\\u0437\\u0438\\u0442\\u0435 \\u0442\\u0435\\u043A\\u0443\\u0449\\u0430\\u0442\\u0430 \\u0437\\u0430\\u0434\\u0430\\u0447\\u0430?\r\n# XBUT: Positive action to save the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_YES=\\u0414\\u0430\r\n# XBUT: Positive action to cancel the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_NO=\\u041D\\u0435\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT=No follow up types available\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_TASK=Cannot proceed in creating a task since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_OPPT=Cannot proceed in creating an opportunity since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_APPT=Cannot proceed in creating an appointment since no follow up types are maintained\r\n# YMSG: Message shown to end user notifying that the follow up was successful\r\nFOLLOWUP_COMPLETED=\\u041F\\u043E\\u0441\\u043B\\u0435\\u0434\\u0432\\u0430\\u0449\\u0430\\u0442\\u0430 \\u0442\\u0440\\u0430\\u043D\\u0437\\u0430\\u043A\\u0446\\u0438\\u044F \\u0435 \\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u0430\r\n# YMSG: Message shown once the task is saved during a follow up scenario\r\nFOLLOWUP_TASK_SAVED=\\u041F\\u043E\\u0441\\u043B\\u0435\\u0434\\u0432\\u0430\\u0449\\u0430 \\u0437\\u0430\\u0434\\u0430\\u0447\\u0430 \\u0435 \\u0437\\u0430\\u043F\\u0430\\u0437\\u0435\\u043D\\u0430\r\n# YMSG: Message shown if a new or existing task is saved\r\nCURRENT_TASK_SAVED=\\u0417\\u0430\\u0434\\u0430\\u0447\\u0430\\u0442\\u0430 \\u0435 \\u0437\\u0430\\u043F\\u0430\\u0437\\u0435\\u043D\\u0430\r\n# YMSG: Error message shown to the end user telling that follow up activities cannot be done\r\nFOLLOWUP_ERROR_MSG=\\u0418\\u043B\\u0438 \\u0442\\u0435\\u043A\\u0443\\u0449\\u0430\\u0442\\u0430 \\u0437\\u0430\\u0434\\u0430\\u0447\\u0430 {0} \\u0435 \\u0441 \\u0433\\u0440\\u0435\\u0448\\u043A\\u0438 \\u0438\\u043B\\u0438 \\u043D\\u044F\\u043C\\u0430 \\u043F\\u043E\\u0441\\u043B\\u0435\\u0434\\u0432\\u0430\\u0449\\u0438 \\u0432\\u0438\\u0434\\u043E\\u0432\\u0435 \\u0442\\u0440\\u0430\\u043D\\u0437\\u0430\\u043A\\u0446\\u0438\\u0438 \\u043F\\u043E\\u0434\\u0434\\u044A\\u0440\\u0436\\u0430\\u043D\\u0438 \\u0432 \\u0418\\u043D\\u0434\\u0438\\u0432\\u0438\\u0434\\u0443\\u0430\\u043B\\u043D\\u0438 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438\r\n\r\n#XFLD: Transaction Type of a given task\r\nS4_TASK_TYPE=\\u0412\\u0438\\u0434\\: {0}\r\n#XFLD: Due Date of a given task\r\nS4_TASK_DUEDATE=\\u041A\\u0440\\u0430\\u0439\\u043D\\u0430 \\u0434\\u0430\\u0442\\u0430\\: {0}\r\n#XFLD: Account of a given task\r\nS4_TASK_ACCOUNT=\\u0421\\u043C\\u0435\\u0442\\u043A\\u0430\\: {0}\r\n#XFLD: Contact of a given task\r\nS4_TASK_CONTACT=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\: {0}\r\n#XFLD: Notes of a given task\r\nS4_TASK_NOTES=\\u0411\\u0435\\u043B\\u0435\\u0436\\u043A\\u0438\r\n#XFLD: Attachments of a given task\r\nS4_TASK_ATTACHMENTS=\\u041F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F\\: {0}\r\n#XFLD: Transaction History of a given task\r\nS4_TASK_DOCHISTORY=\\u0418\\u0441\\u0442\\u043E\\u0440\\u0438\\u044F \\u043D\\u0430 \\u0442\\u0440\\u0430\\u043D\\u0437\\u0430\\u043A\\u0446\\u0438\\u0438\r\n# XBUT: Button for follow up of given task to a task\r\nS4_BUTTONS_FOLLOWUPTOTASK=\\u0417\\u0430\\u0434\\u0430\\u0447\\u0430\r\n# XBUT: Button for follow up of given task to a opportunity\r\nS4_BUTTONS_FOLLOWUPTOOPPT=\\u0412\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\r\n# XBUT: Button for follow up of given task to an appointment\r\nS4_BUTTONS_FOLLOWUPTOAPPT=\\u0421\\u0440\\u043E\\u043A\r\n# XBUT: Button for editing the task\r\nS4_FOOTER_BUTTON_EDIT=\\u0420\\u0435\\u0434\\u0430\\u043A\\u0446\\u0438\\u044F\r\n#XFLD: Column Label for the transaction ID of the document\r\nS4_DOCHISTORY_ID=\\u0418\\u0414 \\u043D\\u0430 \\u0442\\u0440\\u0430\\u043D\\u0437\\u0430\\u043A\\u0446\\u0438\\u044F\r\n#XFLD: Column Label for the transaction type of the document\r\nS4_DOCHISTORY_TTYPE=\\u0412\\u0438\\u0434 \\u0442\\u0440\\u0430\\u043D\\u0437\\u0430\\u043A\\u0446\\u0438\\u044F\r\n#XFLD: Column Label for the description of the document\r\nS4_DOCHISTORY_DESC=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\r\n#XFLD: Column Label for the creation date of the document\r\nS4_DOCHISTORY_CREATEDDATE=\\u0421\\u044A\\u0437\\u0434\\u0430\\u0434\\u0435\\u043D \\u043D\\u0430\r\n#XFLD: Column Label for the relation type to indicate whether current document precedes/succeeds\r\nS4_DOCHISTORY_RELTYPE=\\u0412\\u0438\\u0434 \\u043E\\u0442\\u043D\\u043E\\u0448\\u0435\\u043D\\u0438\\u0435\r\n#XFLD: Label to be shown if no transaction history is available\r\nS4_NO_DOCHISTORY=\\u041D\\u044F\\u043C\\u0430 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u0442\\u0440\\u0430\\u043D\\u0437\\u0430\\u043A\\u0446\\u0438\\u0438\r\n# YMSG: Message shown when renaming an attachment of a task is successful\r\nS3_RENAME_ATTACHMENT_SUCCESS=\\u041F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0435\\u0442\\u043E \\u0435 \\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u043E \\u043F\\u0440\\u0435\\u0438\\u043C\\u0435\\u043D\\u0443\\u0432\\u0430\\u043D\\u043E\r\n# YMSG: Message shown when renaming an attachment of a task fails\r\nS3_RENAME_ATTACHMENT_FAILED=\\u041F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0435\\u0442\\u043E \\u043D\\u0435 \\u043C\\u043E\\u0436\\u0435 \\u0434\\u0430 \\u0431\\u044A\\u0434\\u0435 \\u043F\\u0440\\u0435\\u0438\\u043C\\u0435\\u043D\\u0443\\u0432\\u0430\\u043D\\u043E\r\n# XBUT: Button for Displaying the Errors\r\nDETAILS_FOOTER_BUTTON_MESSAGE=\\u0421\\u044A\\u043E\\u0431\\u0449\\u0435\\u043D\\u0438\\u044F\r\n#XTIT: Title of the messages dialog listing the messages with count\r\nS4_MESSAGES_TITLE=\\u0421\\u044A\\u043E\\u0431\\u0449\\u0435\\u043D\\u0438\\u044F ({0})\r\n# YMSG: Message shown when when the user updates a task in its previous state\r\nS3_412_ERRORMSG=\\u0414\\u0430\\u043D\\u043D\\u0438\\u0442\\u0435 \\u0441\\u0430 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438 \\u043E\\u0442 \\u0434\\u0440\\u0443\\u0433 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B; \\u043A\\u043B\\u0438\\u043A\\u043D\\u0435\\u0442\\u0435 OK \\u0437\\u0430 \\u043F\\u043E\\u0441\\u043B\\u0435\\u0434\\u043D\\u0430\\u0442\\u0430 \\u0432\\u0435\\u0440\\u0441\\u0438\\u044F\r\n#XTIT: Title of dialog indicating an error occurred\r\nS3_412_TITLE=\\u0413\\u0440\\u0435\\u0448\\u043A\\u0430\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS3_ACCOUNT_CONTACT_NOREL=\\u041C\\u043E\\u0436\\u0435\\u0442\\u0435 \\u0434\\u0430 \\u043F\\u0440\\u0435\\u0433\\u043B\\u0435\\u0436\\u0434\\u0430\\u0442\\u0435 \\u0432\\u0438\\u0437\\u0438\\u0442\\u043A\\u0438 \\u0441\\u0430\\u043C\\u043E \\u043D\\u0430 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438, \\u043A\\u043E\\u0438\\u0442\\u043E \\u0441\\u0430 \\u043F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u0435\\u043D\\u0438 \\u043A\\u044A\\u043C \\u0442\\u043E\\u0437\\u0438 \\u0430\\u043A\\u0430\\u0443\\u043D\\u0442\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS4_ACCOUNT_CONTACT_NOREL=\\u041C\\u043E\\u0436\\u0435\\u0442\\u0435 \\u0434\\u0430 \\u043F\\u0440\\u0435\\u0433\\u043B\\u0435\\u0436\\u0434\\u0430\\u0442\\u0435 \\u0432\\u0438\\u0437\\u0438\\u0442\\u043A\\u0438 \\u0441\\u0430\\u043C\\u043E \\u043D\\u0430 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438, \\u043A\\u043E\\u0438\\u0442\\u043E \\u0441\\u0430 \\u043F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u0435\\u043D\\u0438 \\u043A\\u044A\\u043C \\u0442\\u043E\\u0437\\u0438 \\u0430\\u043A\\u0430\\u0443\\u043D\\u0442\r\n',
	"cus/crm/mytasks/i18n/i18n_cs.properties":'\r\n\r\n\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n# XFLD: No Tasks found text\r\nSEARCH_LIST_NODATA_GENERIC=Nebyly nalezeny v\\u00FDsledky\r\n\r\n## Task List \r\n############\r\n\r\n# XTIT: Shell title\r\nSHELL_TITLE=\\u00DAlohy\r\n# XTIT: Task list title\r\nLIST_PAGE_TITLE=\\u00DAlohy\r\n# XTIT: Task list title with number of tasks\r\nLIST_PAGE_TITLE_WITH_NUMBER=Otev\\u0159en\\u00E9 \\u00FAlohy ({0})\r\n# XTIT: Task list title wname for the add button\r\nLIST_ADD=P\\u0159idat\r\n# XTIT: Application name\r\nMASTER_TITLE=Moje \\u00FAlohy\r\n# XMSG: Busy text\r\nMASTER_BUSY_TEXT=Na\\u010D\\u00EDt\\u00E1n\\u00ED \\u00FAloh...\r\n# XMSG: Busy text\r\nMASTER_SEARCH_PLACEHOLDER=Hled\\u00E1n\\u00ED...\r\n# XTOL: Search tool tip \r\nMASTER_SEARCH_TOOLTIP=Hledat \\u00FAlohy\r\n#XTIT: This is the title for the Process Type section\r\nPROCESS_TYPE=Vybrat typ transakce\r\n\r\n\r\n\r\n#Filters\r\n\r\n# XBUT: Filter Button for showing all open tasks\r\nLIST_FILTER_ALL_OPEN=V\\u0161e otev\\u0159en\\u00E9\r\n# XBUT: Filter Button for showing all tasks that are due today\r\nLIST_FILTER_DUE_TODAY=Term\\u00EDn dnes\r\n# XBUT: Filter Button for showing all tasks that are due this week\r\nLIST_FILTER_DUE_THIS_WEEK=Term\\u00EDn tento t\\u00FDden\r\n# XBUT: Filter Button for showing all completed tasks\r\nLIST_FILTER_COMPLETED=Dokon\\u010Deno\r\n\r\n# Filter Bar \r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_BAR_COMPLETED=Filtrov\\u00E1no podle dokon\\u010Den\\u00FDch \\u00FAloh\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_TODAY=Filtrov\\u00E1no podle \\u00FAloh s dne\\u0161n\\u00EDm term\\u00EDnem\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_THIS_WEEK=Filtrov\\u00E1no podle \\u00FAloh s term\\u00EDnem tento t\\u00FDden\r\n# XTIT: filtered by Account\r\nLIST_FILTER_BAR_ACCOUNT=Filtrov\\u00E1no podle z\\u00E1kazn\\u00EDka {0}\r\n\r\n# Filter Title\r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_TITLE_COMPLETED=Dokon\\u010Den\\u00E9 \\u00FAlohy ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_TODAY=\\u00DAlohy s dne\\u0161n\\u00EDm term\\u00EDnem ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_THIS_WEEK=\\u00DAlohy s term\\u00EDnem tento t\\u00FDden ({0})\r\n# XTIT: filtered by Account\r\nLIST_FILTER_TITLE_ACCOUNT=Filtrov\\u00E1no podle z\\u00E1kazn\\u00EDka {0} ({1})\r\n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TODAY=Dnes\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TOMORROW=Z\\u00EDtra\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_YESTERDAY=V\\u010Dera\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_IN_X_DAYS=Za {0} dn\\u00ED\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_X_DAYS_AGO=P\\u0159ed {0} dny\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Zodpov\\u00EDd\\u00E1te za {0} z {1} \\u00FAloh. Jsou zobrazeny pouze va\\u0161e \\u00FAlohy.\r\n# XTIT: Confirmation message to indicate that the task has been completed\r\nLIST_COMPLETE_CONFIRMATION=\\u00DAloha {0} byla nastavena jako dokon\\u010Den\\u00E1\r\n\r\n## Task Details \r\n###############\r\n\r\n# XTIT: task detail view name\r\nMC_DETAILS_TITLE=Detaily \\u00FAlohy\r\n# XTIT: task detail title\r\nDETAILS_PAGE_TITLE=\\u00DAlohy\r\n# XSEL: new task default text\r\nNEW_TASK_INPUT_PLACEHOLDER=Nov\\u00E1 \\u00FAloha\r\n# XTIT: initial title of a tasks\r\nNEW_TASK_TITLE=Bez n\\u00E1zvu\r\n# XTIT: page title of a newly created task\r\nNEW_TASK_PAGE_TITLE=Nov\\u00E1 \\u00FAloha\r\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\r\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE=P\\u0159edal {0}, {1}\r\n\r\n\r\n#Form\r\n\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TITLE=N\\u00E1zev\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_NOTE=Pozn\\u00E1mka\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_DUE_DATE=Term\\u00EDn spln\\u011Bn\\u00ED\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_ACCOUNT=Z\\u00E1kazn\\u00EDk\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_CONTACT=Kontakt\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIVATE=Soukrom\\u00E9\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIORITY=Priorita\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_STATUS=Status\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TYPE=Typ\r\n\r\n#Buttons\r\n\r\n# XBUT: Button for deleting the task\r\nDETAILS_BUTTONS_DELETE=Smazat \\u00FAlohu\r\n# XBUT: Button for deleting the task\r\nDETAILS_FOOTER_BUTTON_DELETE=Vymazat\r\n# XBUT: Button for canceling the task\r\nDETAILS_BUTTONS_CANCEL=Zru\\u0161it\r\n# XBUT: Button for creating a new task or saving the existing task\r\nDETAILS_BUTTONS_SAVE=Ulo\\u017Eit\r\n# XBUT: Button for assigning the task to another person\r\nDETAILS_BUTTONS_ASSIGNTO=P\\u0159i\\u0159adit k\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP=N\\u00E1sledn\\u00E1 \\u010Dinnost\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_TASK=N\\u00E1sledn\\u00E1 \\u00FAloha\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_OPPT=N\\u00E1sledn\\u00E1 p\\u0159\\u00EDle\\u017Eitost\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_APPT=N\\u00E1sledn\\u00E1 sch\\u016Fzka\r\n\r\n#Message Box\r\n\r\n# XBUT: Title for the message box\r\nDETAILS_MESSAGEBOX_TITLE=Smazat\r\n# YMSG: Text for the message box\r\nDETAILS_MESSAGEBOX_TEXT=Chcete tuto \\u00FAlohu opravdu vymazat?\r\n# XTIT: Confirmation message\r\nDETAILS_DELETE_CONFIRMATION=\\u00DAloha {0} vymaz\\u00E1na\r\n#XTIT: Warning message\r\nNAVBACK_WARNING_TITLE=Upozorn\\u011Bn\\u00ED\r\n#YMSG: Text for the message box\r\nNAVBACK_WARNING_MESSAGE=Va\\u0161e z\\u00E1znamy budou ztraceny; chcete tuto str\\u00E1nku ur\\u010Dit\\u011B opustit?\r\n\r\n#Value Help \r\n\r\n# XTIT: Title for Value Help Account\r\nDETAILS_VALUE_HELP_ACC_TITLE=Vybrat z\\u00E1kazn\\u00EDka\r\n# XTIT: Title for Value Help Contact\r\nDETAILS_VALUE_HELP_CON_TITLE=Vybrat kontakt\r\n# YMSG: Filtered by info bar text for contact search popup\r\nDETAILS_VALUE_HELP_FILTERED_BY=Filtr podle\r\n# XTIT: Account VH item description: city, country\r\nDETAILS_VALUE_HELP_ACC_DESCR={0}, {1}\r\n# XTIT: Contact VH item description: account name, function\r\nDETAILS_VALUE_HELP_CON_DESCR={0}, {1}\r\n\r\n\r\n#Business card Account and Contact\r\n\r\n# XTIT: Title for business card Account\r\nDETAILS_BCARD_ACCOUNT=P\\u0159ehled z\\u00E1kazn\\u00EDk\\u016F\r\n# XTIT: Title for business card Contact\r\nDETAILS_BCARD_CONTACT=P\\u0159ehled kontakt\\u016F\r\n\r\n#Assign task to\r\n\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TITLE=P\\u0159i\\u0159adit k\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TEXT=P\\u0159i\\u0159adit \\u00FAlohu k\r\n# XTIT: Title for employee search\r\nDETAILS_ASSIGNTO_ASIGNEE=P\\u0159i\\u0159adit \\u00FAlohu zam\\u011Bstnanci\r\n# XTIT: Confirmation message\r\nDETAILS_ASSIGNTO_CONFIRMATION=\\u00DAloha p\\u0159i\\u0159azena k {0}\r\n# XBUT: Button on dialog: ok\r\nDIALOG_ASSIGNTO_BUTTON_OK=OK\r\n# XBUT: Button on dialog: cancel\r\nDIALOG_ASSIGNTO_BUTTON_CANCEL=Zru\\u0161it\r\n\r\n# errors\r\n\r\n# YMSG: generic error\r\nGENERIC_ERROR=Syst\\u00E9m moment\\u00E1ln\\u011B nen\\u00ED dostupn\\u00FD. Zkuste to znovu pozd\\u011Bji nebo se obra\\u0165te na spr\\u00E1vce syst\\u00E9mu\r\n# YMSG: error in date\r\nDETAILS_MESSAGETEXT_DATE=Datum nen\\u00ED platn\\u00E9 nebo nen\\u00ED ve spr\\u00E1vn\\u00E9m form\\u00E1tu. Zadejte datum pomoc\\u00ED n\\u00E1pov\\u011Bdy zad\\u00E1v\\u00E1n\\u00ED.\r\n# YMSG: error in account\r\nDETAILS_MESSAGETEXT_ACCOUNT=Pou\\u017Eijte n\\u00E1pov\\u011Bdu zad\\u00E1v\\u00E1n\\u00ED k zad\\u00E1n\\u00ED z\\u00E1kazn\\u00EDka\r\n# YMSG: error in contact\r\nDETAILS_MESSAGETEXT_CONTACT=Pou\\u017Eijte n\\u00E1pov\\u011Bdu zad\\u00E1v\\u00E1n\\u00ED k zad\\u00E1n\\u00ED kontaktu\r\n# YMSG: title for the validation message box after save is clicked\r\nDETAILS_VALIDATION_TITLE=Pou\\u017Eijte n\\u00E1pov\\u011Bdu zad\\u00E1v\\u00E1n\\u00ED\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=Zav\\u00E1d\\u00ED se...\r\n\r\n# XTIT: Title for Follow up Dialog\r\nDETAILS_FOLLOWUP_TITLE=N\\u00E1sledn\\u00E1 \\u010Dinnost\r\n# XBUT: Button text for Follow up activities\r\nDETAILS_FOLLOWUP_BUTTON=N\\u00E1sledn\\u00E1 \\u010Dinnost\r\n# XTIT: Title for Confirmation Dialog to save task or not \r\nDETAILS_CONFIRM_TITLE=Potvrzen\\u00ED\r\n# YMSG: Prompt use to save existing task or not\r\nDETAILS_FOLLOWUP_MESSAGE=Chcete ulo\\u017Eit aktu\\u00E1ln\\u00ED \\u00FAlohu?\r\n# XBUT: Positive action to save the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_YES=Ano\r\n# XBUT: Positive action to cancel the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_NO=Ne\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT=No follow up types available\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_TASK=Cannot proceed in creating a task since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_OPPT=Cannot proceed in creating an opportunity since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_APPT=Cannot proceed in creating an appointment since no follow up types are maintained\r\n# YMSG: Message shown to end user notifying that the follow up was successful\r\nFOLLOWUP_COMPLETED=N\\u00E1sledn\\u00E1 \\u010Dinnost byla \\u00FAsp\\u011B\\u0161n\\u00E1\r\n# YMSG: Message shown once the task is saved during a follow up scenario\r\nFOLLOWUP_TASK_SAVED=N\\u00E1sledn\\u00E1 \\u00FAloha byla ulo\\u017Eena\r\n# YMSG: Message shown if a new or existing task is saved\r\nCURRENT_TASK_SAVED=\\u00DAloha byla ulo\\u017Eena\r\n# YMSG: Error message shown to the end user telling that follow up activities cannot be done\r\nFOLLOWUP_ERROR_MSG=Aktu\\u00E1ln\\u00ED \\u00FAloha {0} obsahuje chyby, nebo v customizingu (p\\u0159izp\\u016Fsoben\\u00ED) nejsou vedeny \\u017E\\u00E1dn\\u00E9 typy n\\u00E1sledn\\u00FDch transakc\\u00ED\r\n\r\n#XFLD: Transaction Type of a given task\r\nS4_TASK_TYPE=Typ\\: {0}\r\n#XFLD: Due Date of a given task\r\nS4_TASK_DUEDATE=Term\\u00EDn\\: {0}\r\n#XFLD: Account of a given task\r\nS4_TASK_ACCOUNT=Z\\u00E1kazn\\u00EDk\\: {0}\r\n#XFLD: Contact of a given task\r\nS4_TASK_CONTACT=Kontakt\\: {0}\r\n#XFLD: Notes of a given task\r\nS4_TASK_NOTES=Pozn\\u00E1mky\r\n#XFLD: Attachments of a given task\r\nS4_TASK_ATTACHMENTS=P\\u0159\\u00EDlohy\\: {0}\r\n#XFLD: Transaction History of a given task\r\nS4_TASK_DOCHISTORY=Historie transakc\\u00ED\r\n# XBUT: Button for follow up of given task to a task\r\nS4_BUTTONS_FOLLOWUPTOTASK=\\u00DAloha\r\n# XBUT: Button for follow up of given task to a opportunity\r\nS4_BUTTONS_FOLLOWUPTOOPPT=P\\u0159\\u00EDle\\u017Eitost\r\n# XBUT: Button for follow up of given task to an appointment\r\nS4_BUTTONS_FOLLOWUPTOAPPT=Sch\\u016Fzka\r\n# XBUT: Button for editing the task\r\nS4_FOOTER_BUTTON_EDIT=Upravit\r\n#XFLD: Column Label for the transaction ID of the document\r\nS4_DOCHISTORY_ID=ID transakce\r\n#XFLD: Column Label for the transaction type of the document\r\nS4_DOCHISTORY_TTYPE=Typ transakce\r\n#XFLD: Column Label for the description of the document\r\nS4_DOCHISTORY_DESC=Popis\r\n#XFLD: Column Label for the creation date of the document\r\nS4_DOCHISTORY_CREATEDDATE=Vytvo\\u0159eno dne\r\n#XFLD: Column Label for the relation type to indicate whether current document precedes/succeeds\r\nS4_DOCHISTORY_RELTYPE=Typ vztahu\r\n#XFLD: Label to be shown if no transaction history is available\r\nS4_NO_DOCHISTORY=Nejsou k dispozici \\u017E\\u00E1dn\\u00E9 transakce\r\n# YMSG: Message shown when renaming an attachment of a task is successful\r\nS3_RENAME_ATTACHMENT_SUCCESS=P\\u0159\\u00EDloha byla \\u00FAsp\\u011B\\u0161n\\u011B p\\u0159ejmenov\\u00E1na\r\n# YMSG: Message shown when renaming an attachment of a task fails\r\nS3_RENAME_ATTACHMENT_FAILED=Nepoda\\u0159ilo se p\\u0159ejmenovat p\\u0159\\u00EDlohu\r\n# XBUT: Button for Displaying the Errors\r\nDETAILS_FOOTER_BUTTON_MESSAGE=Zpr\\u00E1vy\r\n#XTIT: Title of the messages dialog listing the messages with count\r\nS4_MESSAGES_TITLE=Zpr\\u00E1vy ({0})\r\n# YMSG: Message shown when when the user updates a task in its previous state\r\nS3_412_ERRORMSG=Data zm\\u011Bnil jin\\u00FD u\\u017Eivatel; klikn\\u011Bte na OK, chcete-li z\\u00EDskat nejnov\\u011Bj\\u0161\\u00ED verzi\r\n#XTIT: Title of dialog indicating an error occurred\r\nS3_412_TITLE=Chyba\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS3_ACCOUNT_CONTACT_NOREL=M\\u016F\\u017Eete zobrazit pouze vizitky kontakt\\u016F, kter\\u00E9 byly p\\u0159i\\u0159azeny tomuto z\\u00E1kazn\\u00EDkovi\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS4_ACCOUNT_CONTACT_NOREL=M\\u016F\\u017Eete zobrazit pouze vizitky kontakt\\u016F, kter\\u00E9 byly p\\u0159i\\u0159azeny tomuto z\\u00E1kazn\\u00EDkovi\r\n',
	"cus/crm/mytasks/i18n/i18n_de.properties":'\r\n\r\n\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n# XFLD: No Tasks found text\r\nSEARCH_LIST_NODATA_GENERIC=Keine Ergebnisse gefunden\r\n\r\n## Task List \r\n############\r\n\r\n# XTIT: Shell title\r\nSHELL_TITLE=Aufgaben\r\n# XTIT: Task list title\r\nLIST_PAGE_TITLE=Aufgaben\r\n# XTIT: Task list title with number of tasks\r\nLIST_PAGE_TITLE_WITH_NUMBER=Offene Aufgaben ({0})\r\n# XTIT: Task list title wname for the add button\r\nLIST_ADD=Hinzuf\\u00FCgen\r\n# XTIT: Application name\r\nMASTER_TITLE=Meine Aufgaben\r\n# XMSG: Busy text\r\nMASTER_BUSY_TEXT=Aufgaben werden geladen...\r\n# XMSG: Busy text\r\nMASTER_SEARCH_PLACEHOLDER=Suchen...\r\n# XTOL: Search tool tip \r\nMASTER_SEARCH_TOOLTIP=Nach Aufgaben suchen\r\n#XTIT: This is the title for the Process Type section\r\nPROCESS_TYPE=Vorgangsart ausw\\u00E4hlen\r\n\r\n\r\n\r\n#Filters\r\n\r\n# XBUT: Filter Button for showing all open tasks\r\nLIST_FILTER_ALL_OPEN=Alle offenen\r\n# XBUT: Filter Button for showing all tasks that are due today\r\nLIST_FILTER_DUE_TODAY=Heute f\\u00E4llig\r\n# XBUT: Filter Button for showing all tasks that are due this week\r\nLIST_FILTER_DUE_THIS_WEEK=In dieser Woche f\\u00E4llig\r\n# XBUT: Filter Button for showing all completed tasks\r\nLIST_FILTER_COMPLETED=Abgeschlossen\r\n\r\n# Filter Bar \r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_BAR_COMPLETED=Nach abgeschlossenen Aufgaben gefiltert\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_TODAY=Nach heute f\\u00E4lligen Aufgaben gefiltert\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_THIS_WEEK=Nach in dieser Woche f\\u00E4lligen Aufgaben gefiltert\r\n# XTIT: filtered by Account\r\nLIST_FILTER_BAR_ACCOUNT=Gefiltert nach Account\\: {0}\r\n\r\n# Filter Title\r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_TITLE_COMPLETED=Abgeschlossene Aufgaben ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_TODAY=Heute f\\u00E4llige Aufgaben ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_THIS_WEEK=In dieser Woche f\\u00E4llige Aufgaben ({0})\r\n# XTIT: filtered by Account\r\nLIST_FILTER_TITLE_ACCOUNT=Gefiltert nach Account {0} ({1})\r\n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TODAY=Heute\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TOMORROW=Morgen\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_YESTERDAY=Gestern\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_IN_X_DAYS=In {0} Tagen\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_X_DAYS_AGO=Vor {0} Tagen\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Sie sind zust\\u00E4ndig f\\u00FCr {0} von {1} Aufgaben. Es werden nur Ihre Aufgaben angezeigt.\r\n# XTIT: Confirmation message to indicate that the task has been completed\r\nLIST_COMPLETE_CONFIRMATION=Aufgabe {0} wurde auf "Abgeschlossen" gesetzt\r\n\r\n## Task Details \r\n###############\r\n\r\n# XTIT: task detail view name\r\nMC_DETAILS_TITLE=Aufgabendetails\r\n# XTIT: task detail title\r\nDETAILS_PAGE_TITLE=Aufgaben\r\n# XSEL: new task default text\r\nNEW_TASK_INPUT_PLACEHOLDER=Neue Aufgabe\r\n# XTIT: initial title of a tasks\r\nNEW_TASK_TITLE=Ohne Titel\r\n# XTIT: page title of a newly created task\r\nNEW_TASK_PAGE_TITLE=Neue Aufgabe\r\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\r\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE=Weitergeleitet von {0}, {1}\r\n\r\n\r\n#Form\r\n\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TITLE=Titel\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_NOTE=Notiz\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_DUE_DATE=F\\u00E4lligkeitsdatum\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_ACCOUNT=Account\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_CONTACT=Ansprechpartner\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIVATE=Privat\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIORITY=Priorit\\u00E4t\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_STATUS=Status\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TYPE=Typ\r\n\r\n#Buttons\r\n\r\n# XBUT: Button for deleting the task\r\nDETAILS_BUTTONS_DELETE=Aufgabe l\\u00F6schen\r\n# XBUT: Button for deleting the task\r\nDETAILS_FOOTER_BUTTON_DELETE=L\\u00F6schen\r\n# XBUT: Button for canceling the task\r\nDETAILS_BUTTONS_CANCEL=Abbrechen\r\n# XBUT: Button for creating a new task or saving the existing task\r\nDETAILS_BUTTONS_SAVE=Sichern\r\n# XBUT: Button for assigning the task to another person\r\nDETAILS_BUTTONS_ASSIGNTO=Zuordnen zu\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP=Folgevorgang\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_TASK=Folgeaufgabe\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_OPPT=Folge-Opportunity\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_APPT=Folgetermin\r\n\r\n#Message Box\r\n\r\n# XBUT: Title for the message box\r\nDETAILS_MESSAGEBOX_TITLE=L\\u00F6schen\r\n# YMSG: Text for the message box\r\nDETAILS_MESSAGEBOX_TEXT=M\\u00F6chten Sie diese Aufgabe wirklich l\\u00F6schen?\r\n# XTIT: Confirmation message\r\nDETAILS_DELETE_CONFIRMATION=Aufgabe {0} gel\\u00F6scht\r\n#XTIT: Warning message\r\nNAVBACK_WARNING_TITLE=Warnung\r\n#YMSG: Text for the message box\r\nNAVBACK_WARNING_MESSAGE=Ihre Eingaben gehen verloren. M\\u00F6chten Sie diese Seite wirklich verlassen?\r\n\r\n#Value Help \r\n\r\n# XTIT: Title for Value Help Account\r\nDETAILS_VALUE_HELP_ACC_TITLE=Account ausw\\u00E4hlen\r\n# XTIT: Title for Value Help Contact\r\nDETAILS_VALUE_HELP_CON_TITLE=Ansprechpartner ausw\\u00E4hlen\r\n# YMSG: Filtered by info bar text for contact search popup\r\nDETAILS_VALUE_HELP_FILTERED_BY=Gefiltert nach\r\n# XTIT: Account VH item description: city, country\r\nDETAILS_VALUE_HELP_ACC_DESCR={0}, {1}\r\n# XTIT: Contact VH item description: account name, function\r\nDETAILS_VALUE_HELP_CON_DESCR={0}, {1}\r\n\r\n\r\n#Business card Account and Contact\r\n\r\n# XTIT: Title for business card Account\r\nDETAILS_BCARD_ACCOUNT=Account-\\u00DCbersicht\r\n# XTIT: Title for business card Contact\r\nDETAILS_BCARD_CONTACT=Ansprechpartner\\u00FCbersicht\r\n\r\n#Assign task to\r\n\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TITLE=Zuordnen zu\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TEXT=Aufgabe zuordnen zu\r\n# XTIT: Title for employee search\r\nDETAILS_ASSIGNTO_ASIGNEE=Aufgabe zu Mitarbeiter zuordnen\r\n# XTIT: Confirmation message\r\nDETAILS_ASSIGNTO_CONFIRMATION=Aufgabe zugeordnet zu {0}\r\n# XBUT: Button on dialog: ok\r\nDIALOG_ASSIGNTO_BUTTON_OK=OK\r\n# XBUT: Button on dialog: cancel\r\nDIALOG_ASSIGNTO_BUTTON_CANCEL=Abbrechen\r\n\r\n# errors\r\n\r\n# YMSG: generic error\r\nGENERIC_ERROR=System steht momentan nicht zur Verf\\u00FCgung. Versuchen Sie es sp\\u00E4ter erneut, oder wenden Sie sich an die Systemadministration.\r\n# YMSG: error in date\r\nDETAILS_MESSAGETEXT_DATE=Datum ist ung\\u00FCltig oder hat nicht das richtige Format. Verwenden Sie die Eingabehilfe, um das Datum einzugeben.\r\n# YMSG: error in account\r\nDETAILS_MESSAGETEXT_ACCOUNT=Verwenden Sie die Eingabehilfe, um einen Account einzugeben\r\n# YMSG: error in contact\r\nDETAILS_MESSAGETEXT_CONTACT=Verwenden Sie die Eingabehilfe, um einen Ansprechpartner einzugeben\r\n# YMSG: title for the validation message box after save is clicked\r\nDETAILS_VALIDATION_TITLE=Eingabehilfe verwenden\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=Ladevorgang l\\u00E4uft...\r\n\r\n# XTIT: Title for Follow up Dialog\r\nDETAILS_FOLLOWUP_TITLE=Folgevorgang\r\n# XBUT: Button text for Follow up activities\r\nDETAILS_FOLLOWUP_BUTTON=Folgevorgang\r\n# XTIT: Title for Confirmation Dialog to save task or not \r\nDETAILS_CONFIRM_TITLE=Best\\u00E4tigung\r\n# YMSG: Prompt use to save existing task or not\r\nDETAILS_FOLLOWUP_MESSAGE=M\\u00F6chten Sie die aktuelle Aufgabe sichern?\r\n# XBUT: Positive action to save the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_YES=Ja\r\n# XBUT: Positive action to cancel the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_NO=Nein\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT=No follow up types available\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_TASK=Cannot proceed in creating a task since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_OPPT=Cannot proceed in creating an opportunity since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_APPT=Cannot proceed in creating an appointment since no follow up types are maintained\r\n# YMSG: Message shown to end user notifying that the follow up was successful\r\nFOLLOWUP_COMPLETED=Die Folgevorgang war erfolgreich.\r\n# YMSG: Message shown once the task is saved during a follow up scenario\r\nFOLLOWUP_TASK_SAVED=Folgeaufgabe gesichert\r\n# YMSG: Message shown if a new or existing task is saved\r\nCURRENT_TASK_SAVED=Aufgabe gesichert\r\n# YMSG: Error message shown to the end user telling that follow up activities cannot be done\r\nFOLLOWUP_ERROR_MSG=Die aktuelle Aufgabe {0} ist fehlerhaft, oder im Customizing wurden keine Folgevorgangsarten gepflegt.\r\n\r\n#XFLD: Transaction Type of a given task\r\nS4_TASK_TYPE=Art\\: {0}\r\n#XFLD: Due Date of a given task\r\nS4_TASK_DUEDATE=F\\u00E4lligkeitsdatum\\: {0}\r\n#XFLD: Account of a given task\r\nS4_TASK_ACCOUNT=Account\\: {0}\r\n#XFLD: Contact of a given task\r\nS4_TASK_CONTACT=Ansprechpartner\\: {0}\r\n#XFLD: Notes of a given task\r\nS4_TASK_NOTES=Notizen\r\n#XFLD: Attachments of a given task\r\nS4_TASK_ATTACHMENTS=Anlagen\\: {0}\r\n#XFLD: Transaction History of a given task\r\nS4_TASK_DOCHISTORY=Vorgangshistorie\r\n# XBUT: Button for follow up of given task to a task\r\nS4_BUTTONS_FOLLOWUPTOTASK=Aufgabe\r\n# XBUT: Button for follow up of given task to a opportunity\r\nS4_BUTTONS_FOLLOWUPTOOPPT=Opportunity\r\n# XBUT: Button for follow up of given task to an appointment\r\nS4_BUTTONS_FOLLOWUPTOAPPT=Termin\r\n# XBUT: Button for editing the task\r\nS4_FOOTER_BUTTON_EDIT=Bearbeiten\r\n#XFLD: Column Label for the transaction ID of the document\r\nS4_DOCHISTORY_ID=Vorgangs-ID\r\n#XFLD: Column Label for the transaction type of the document\r\nS4_DOCHISTORY_TTYPE=Vorgangsart\r\n#XFLD: Column Label for the description of the document\r\nS4_DOCHISTORY_DESC=Beschreibung\r\n#XFLD: Column Label for the creation date of the document\r\nS4_DOCHISTORY_CREATEDDATE=Angelegt am\r\n#XFLD: Column Label for the relation type to indicate whether current document precedes/succeeds\r\nS4_DOCHISTORY_RELTYPE=Beziehungsart\r\n#XFLD: Label to be shown if no transaction history is available\r\nS4_NO_DOCHISTORY=Keine Vorg\\u00E4nge verf\\u00FCgbar\r\n# YMSG: Message shown when renaming an attachment of a task is successful\r\nS3_RENAME_ATTACHMENT_SUCCESS=Anlage erfolgreich umbenannt\r\n# YMSG: Message shown when renaming an attachment of a task fails\r\nS3_RENAME_ATTACHMENT_FAILED=Anlage konnte nicht umbenannt werden\r\n# XBUT: Button for Displaying the Errors\r\nDETAILS_FOOTER_BUTTON_MESSAGE=Nachrichten\r\n#XTIT: Title of the messages dialog listing the messages with count\r\nS4_MESSAGES_TITLE=Nachrichten ({0})\r\n# YMSG: Message shown when when the user updates a task in its previous state\r\nS3_412_ERRORMSG=Daten wurden von einem anderen Benutzer ge\\u00E4ndert; w\\u00E4hlen Sie \'OK\', um die neueste Version abzurufen\r\n#XTIT: Title of dialog indicating an error occurred\r\nS3_412_TITLE=Fehler\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS3_ACCOUNT_CONTACT_NOREL=Sie k\\u00F6nnen nur Visitenkarten von Ansprechpartnern ansehen, die diesem Account zugeordnet wurden\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS4_ACCOUNT_CONTACT_NOREL=Sie k\\u00F6nnen nur Visitenkarten von Ansprechpartnern ansehen, die diesem Account zugeordnet wurden\r\n',
	"cus/crm/mytasks/i18n/i18n_en.properties":'\r\n\r\n\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n# XFLD: No Tasks found text\r\nSEARCH_LIST_NODATA_GENERIC=No results found\r\n\r\n## Task List \r\n############\r\n\r\n# XTIT: Shell title\r\nSHELL_TITLE=Tasks\r\n# XTIT: Task list title\r\nLIST_PAGE_TITLE=Tasks\r\n# XTIT: Task list title with number of tasks\r\nLIST_PAGE_TITLE_WITH_NUMBER=Open Tasks ({0})\r\n# XTIT: Task list title wname for the add button\r\nLIST_ADD=Add\r\n# XTIT: Application name\r\nMASTER_TITLE=My Tasks\r\n# XMSG: Busy text\r\nMASTER_BUSY_TEXT=Loading tasks...\r\n# XMSG: Busy text\r\nMASTER_SEARCH_PLACEHOLDER=Search...\r\n# XTOL: Search tool tip \r\nMASTER_SEARCH_TOOLTIP=Search for Tasks\r\n#XTIT: This is the title for the Process Type section\r\nPROCESS_TYPE=Select Transaction Type\r\n\r\n\r\n\r\n#Filters\r\n\r\n# XBUT: Filter Button for showing all open tasks\r\nLIST_FILTER_ALL_OPEN=All Open\r\n# XBUT: Filter Button for showing all tasks that are due today\r\nLIST_FILTER_DUE_TODAY=Due Today\r\n# XBUT: Filter Button for showing all tasks that are due this week\r\nLIST_FILTER_DUE_THIS_WEEK=Due This Week\r\n# XBUT: Filter Button for showing all completed tasks\r\nLIST_FILTER_COMPLETED=Completed\r\n\r\n# Filter Bar \r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_BAR_COMPLETED=Filtered by Completed Tasks\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_TODAY=Filtered by Tasks Due Today\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_THIS_WEEK=Filtered by Tasks Due This Week\r\n# XTIT: filtered by Account\r\nLIST_FILTER_BAR_ACCOUNT=Filtered by Account {0}\r\n\r\n# Filter Title\r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_TITLE_COMPLETED=Completed Tasks ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_TODAY=Tasks Due Today ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_THIS_WEEK=Tasks Due This Week ({0})\r\n# XTIT: filtered by Account\r\nLIST_FILTER_TITLE_ACCOUNT=Filtered by Account {0} ({1})\r\n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TODAY=Today\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TOMORROW=Tomorrow\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_YESTERDAY=Yesterday\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_IN_X_DAYS=In {0} days\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_X_DAYS_AGO={0} days ago\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=You are responsible for {0} out of {1} tasks. Only your tasks are displayed.\r\n# XTIT: Confirmation message to indicate that the task has been completed\r\nLIST_COMPLETE_CONFIRMATION=Task {0} has been set to Completed\r\n\r\n## Task Details \r\n###############\r\n\r\n# XTIT: task detail view name\r\nMC_DETAILS_TITLE=Task Details\r\n# XTIT: task detail title\r\nDETAILS_PAGE_TITLE=Tasks\r\n# XSEL: new task default text\r\nNEW_TASK_INPUT_PLACEHOLDER=New task\r\n# XTIT: initial title of a tasks\r\nNEW_TASK_TITLE=Untitled\r\n# XTIT: page title of a newly created task\r\nNEW_TASK_PAGE_TITLE=New Task\r\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\r\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE=Forwarded by {0}, {1}\r\n\r\n\r\n#Form\r\n\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TITLE=Title\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_NOTE=Note\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_DUE_DATE=Due Date\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_ACCOUNT=Account\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_CONTACT=Contact\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIVATE=Private\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIORITY=Priority\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_STATUS=Status\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TYPE=Type\r\n\r\n#Buttons\r\n\r\n# XBUT: Button for deleting the task\r\nDETAILS_BUTTONS_DELETE=Delete Task\r\n# XBUT: Button for deleting the task\r\nDETAILS_FOOTER_BUTTON_DELETE=Delete\r\n# XBUT: Button for canceling the task\r\nDETAILS_BUTTONS_CANCEL=Cancel\r\n# XBUT: Button for creating a new task or saving the existing task\r\nDETAILS_BUTTONS_SAVE=Save\r\n# XBUT: Button for assigning the task to another person\r\nDETAILS_BUTTONS_ASSIGNTO=Assign to\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP=Follow Up\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_TASK=Follow Up Task\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_OPPT=Follow Up Opportunity\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_APPT=Follow Up Appointment\r\n\r\n#Message Box\r\n\r\n# XBUT: Title for the message box\r\nDETAILS_MESSAGEBOX_TITLE=Delete\r\n# YMSG: Text for the message box\r\nDETAILS_MESSAGEBOX_TEXT=Are you sure you want to delete this task?\r\n# XTIT: Confirmation message\r\nDETAILS_DELETE_CONFIRMATION=Task {0} deleted\r\n#XTIT: Warning message\r\nNAVBACK_WARNING_TITLE=Warning\r\n#YMSG: Text for the message box\r\nNAVBACK_WARNING_MESSAGE=Your entries will be lost; are you sure you want to leave this page?\r\n\r\n#Value Help \r\n\r\n# XTIT: Title for Value Help Account\r\nDETAILS_VALUE_HELP_ACC_TITLE=Select Account\r\n# XTIT: Title for Value Help Contact\r\nDETAILS_VALUE_HELP_CON_TITLE=Select Contact\r\n# YMSG: Filtered by info bar text for contact search popup\r\nDETAILS_VALUE_HELP_FILTERED_BY=Filtered By\r\n# XTIT: Account VH item description: city, country\r\nDETAILS_VALUE_HELP_ACC_DESCR={0}, {1}\r\n# XTIT: Contact VH item description: account name, function\r\nDETAILS_VALUE_HELP_CON_DESCR={0}, {1}\r\n\r\n\r\n#Business card Account and Contact\r\n\r\n# XTIT: Title for business card Account\r\nDETAILS_BCARD_ACCOUNT=Account Overview\r\n# XTIT: Title for business card Contact\r\nDETAILS_BCARD_CONTACT=Contact Overview\r\n\r\n#Assign task to\r\n\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TITLE=Assign to\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TEXT=Assign Task to\r\n# XTIT: Title for employee search\r\nDETAILS_ASSIGNTO_ASIGNEE=Assign Task to Employee\r\n# XTIT: Confirmation message\r\nDETAILS_ASSIGNTO_CONFIRMATION=Task assigned to {0}\r\n# XBUT: Button on dialog: ok\r\nDIALOG_ASSIGNTO_BUTTON_OK=OK\r\n# XBUT: Button on dialog: cancel\r\nDIALOG_ASSIGNTO_BUTTON_CANCEL=Cancel\r\n\r\n# errors\r\n\r\n# YMSG: generic error\r\nGENERIC_ERROR=System is currently not available; try again later or contact your system administrator\r\n# YMSG: error in date\r\nDETAILS_MESSAGETEXT_DATE=Date is not valid or not in the correct format; use the input help to enter the date\r\n# YMSG: error in account\r\nDETAILS_MESSAGETEXT_ACCOUNT=Use the input help to enter an account\r\n# YMSG: error in contact\r\nDETAILS_MESSAGETEXT_CONTACT=Use the input help to enter a contact\r\n# YMSG: title for the validation message box after save is clicked\r\nDETAILS_VALIDATION_TITLE=Use Input Help\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=Loading...\r\n\r\n# XTIT: Title for Follow up Dialog\r\nDETAILS_FOLLOWUP_TITLE=Follow Up\r\n# XBUT: Button text for Follow up activities\r\nDETAILS_FOLLOWUP_BUTTON=Follow Up\r\n# XTIT: Title for Confirmation Dialog to save task or not \r\nDETAILS_CONFIRM_TITLE=Confirmation\r\n# YMSG: Prompt use to save existing task or not\r\nDETAILS_FOLLOWUP_MESSAGE=Do you want to save the current task?\r\n# XBUT: Positive action to save the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_YES=Yes\r\n# XBUT: Positive action to cancel the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_NO=No\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT=No follow up types available\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_TASK=Cannot proceed in creating a task since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_OPPT=Cannot proceed in creating an opportunity since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_APPT=Cannot proceed in creating an appointment since no follow up types are maintained\r\n# YMSG: Message shown to end user notifying that the follow up was successful\r\nFOLLOWUP_COMPLETED=Follow up was successful\r\n# YMSG: Message shown once the task is saved during a follow up scenario\r\nFOLLOWUP_TASK_SAVED=Follow-up task saved\r\n# YMSG: Message shown if a new or existing task is saved\r\nCURRENT_TASK_SAVED=Task saved\r\n# YMSG: Error message shown to the end user telling that follow up activities cannot be done\r\nFOLLOWUP_ERROR_MSG=Either the current task {0} has errors or there are no follow up transaction types maintained in the Customizing\r\n\r\n#XFLD: Transaction Type of a given task\r\nS4_TASK_TYPE=Type\\: {0}\r\n#XFLD: Due Date of a given task\r\nS4_TASK_DUEDATE=Due Date\\: {0}\r\n#XFLD: Account of a given task\r\nS4_TASK_ACCOUNT=Account\\: {0}\r\n#XFLD: Contact of a given task\r\nS4_TASK_CONTACT=Contact\\: {0}\r\n#XFLD: Notes of a given task\r\nS4_TASK_NOTES=Notes\r\n#XFLD: Attachments of a given task\r\nS4_TASK_ATTACHMENTS=Attachments\\: {0}\r\n#XFLD: Transaction History of a given task\r\nS4_TASK_DOCHISTORY=Transaction History\r\n# XBUT: Button for follow up of given task to a task\r\nS4_BUTTONS_FOLLOWUPTOTASK=Task\r\n# XBUT: Button for follow up of given task to a opportunity\r\nS4_BUTTONS_FOLLOWUPTOOPPT=Opportunity\r\n# XBUT: Button for follow up of given task to an appointment\r\nS4_BUTTONS_FOLLOWUPTOAPPT=Appointment\r\n# XBUT: Button for editing the task\r\nS4_FOOTER_BUTTON_EDIT=Edit\r\n#XFLD: Column Label for the transaction ID of the document\r\nS4_DOCHISTORY_ID=Transaction ID\r\n#XFLD: Column Label for the transaction type of the document\r\nS4_DOCHISTORY_TTYPE=Transaction Type\r\n#XFLD: Column Label for the description of the document\r\nS4_DOCHISTORY_DESC=Description\r\n#XFLD: Column Label for the creation date of the document\r\nS4_DOCHISTORY_CREATEDDATE=Created on\r\n#XFLD: Column Label for the relation type to indicate whether current document precedes/succeeds\r\nS4_DOCHISTORY_RELTYPE=Relation Type\r\n#XFLD: Label to be shown if no transaction history is available\r\nS4_NO_DOCHISTORY=No Transactions available\r\n# YMSG: Message shown when renaming an attachment of a task is successful\r\nS3_RENAME_ATTACHMENT_SUCCESS=Attachment renamed successfully\r\n# YMSG: Message shown when renaming an attachment of a task fails\r\nS3_RENAME_ATTACHMENT_FAILED=Attachment could not be renamed\r\n# XBUT: Button for Displaying the Errors\r\nDETAILS_FOOTER_BUTTON_MESSAGE=Messages\r\n#XTIT: Title of the messages dialog listing the messages with count\r\nS4_MESSAGES_TITLE=Messages ({0})\r\n# YMSG: Message shown when when the user updates a task in its previous state\r\nS3_412_ERRORMSG=Data has been changed by another user; click OK for the latest version\r\n#XTIT: Title of dialog indicating an error occurred\r\nS3_412_TITLE=Error\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS3_ACCOUNT_CONTACT_NOREL=You can only view business cards of contacts that have been assigned to this account\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS4_ACCOUNT_CONTACT_NOREL=You can only view business cards of contacts that have been assigned to this account\r\n',
	"cus/crm/mytasks/i18n/i18n_en_US_sappsd.properties":'\r\n\r\n\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n# XFLD: No Tasks found text\r\nSEARCH_LIST_NODATA_GENERIC=[[[\\u0143\\u014F \\u0157\\u0113\\u015F\\u0171\\u013A\\u0163\\u015F \\u0192\\u014F\\u0171\\u014B\\u018C]]]\r\n\r\n## Task List \r\n############\r\n\r\n# XTIT: Shell title\r\nSHELL_TITLE=[[[\\u0162\\u0105\\u015F\\u0137\\u015F]]]\r\n# XTIT: Task list title\r\nLIST_PAGE_TITLE=[[[\\u0162\\u0105\\u015F\\u0137\\u015F]]]\r\n# XTIT: Task list title with number of tasks\r\nLIST_PAGE_TITLE_WITH_NUMBER=[[[\\u014E\\u03C1\\u0113\\u014B \\u0162\\u0105\\u015F\\u0137\\u015F ({0})]]]\r\n# XTIT: Task list title wname for the add button\r\nLIST_ADD=[[[\\u0100\\u018C\\u018C]]]\r\n# XTIT: Application name\r\nMASTER_TITLE=[[[\\u039C\\u0177 \\u0162\\u0105\\u015F\\u0137\\u015F]]]\r\n# XMSG: Busy text\r\nMASTER_BUSY_TEXT=[[[\\u013B\\u014F\\u0105\\u018C\\u012F\\u014B\\u011F \\u0162\\u0105\\u015F\\u0137\\u015F...]]]\r\n# XMSG: Busy text\r\nMASTER_SEARCH_PLACEHOLDER=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125...]]]\r\n# XTOL: Search tool tip \r\nMASTER_SEARCH_TOOLTIP=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125 \\u0192\\u014F\\u0157 \\u0162\\u0105\\u015F\\u0137\\u015F]]]\r\n#XTIT: This is the title for the Process Type section\r\nPROCESS_TYPE=[[[\\u015C\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0162\\u0157\\u0105\\u014B\\u015F\\u0105\\u010B\\u0163\\u012F\\u014F\\u014B \\u0162\\u0177\\u03C1\\u0113]]]\r\n\r\n\r\n\r\n#Filters\r\n\r\n# XBUT: Filter Button for showing all open tasks\r\nLIST_FILTER_ALL_OPEN=[[[\\u0100\\u013A\\u013A \\u014E\\u03C1\\u0113\\u014B]]]\r\n# XBUT: Filter Button for showing all tasks that are due today\r\nLIST_FILTER_DUE_TODAY=[[[\\u010E\\u0171\\u0113 \\u0162\\u014F\\u018C\\u0105\\u0177]]]\r\n# XBUT: Filter Button for showing all tasks that are due this week\r\nLIST_FILTER_DUE_THIS_WEEK=[[[\\u010E\\u0171\\u0113 \\u0162\\u0125\\u012F\\u015F \\u0174\\u0113\\u0113\\u0137]]]\r\n# XBUT: Filter Button for showing all completed tasks\r\nLIST_FILTER_COMPLETED=[[[\\u0108\\u014F\\u0271\\u03C1\\u013A\\u0113\\u0163\\u0113\\u018C]]]\r\n\r\n# Filter Bar \r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_BAR_COMPLETED=[[[\\u0191\\u012F\\u013A\\u0163\\u0113\\u0157\\u0113\\u018C \\u0183\\u0177 \\u0108\\u014F\\u0271\\u03C1\\u013A\\u0113\\u0163\\u0113\\u018C \\u0162\\u0105\\u015F\\u0137\\u015F]]]\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_TODAY=[[[\\u0191\\u012F\\u013A\\u0163\\u0113\\u0157\\u0113\\u018C \\u0183\\u0177 \\u0162\\u0105\\u015F\\u0137\\u015F \\u018C\\u0171\\u0113 \\u0162\\u014F\\u018C\\u0105\\u0177]]]\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_THIS_WEEK=[[[\\u0191\\u012F\\u013A\\u0163\\u0113\\u0157\\u0113\\u018C \\u0183\\u0177 \\u0162\\u0105\\u015F\\u0137\\u015F \\u018C\\u0171\\u0113 \\u0163\\u0125\\u012F\\u015F \\u0174\\u0113\\u0113\\u0137]]]\r\n# XTIT: filtered by Account\r\nLIST_FILTER_BAR_ACCOUNT=[[[\\u0191\\u012F\\u013A\\u0163\\u0113\\u0157\\u0113\\u018C \\u0183\\u0177 \\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163 ]]]{0}\r\n\r\n# Filter Title\r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_TITLE_COMPLETED=[[[\\u0108\\u014F\\u0271\\u03C1\\u013A\\u0113\\u0163\\u0113\\u018C \\u0162\\u0105\\u015F\\u0137\\u015F ({0})]]]\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_TODAY=[[[\\u0162\\u0105\\u015F\\u0137\\u015F \\u010E\\u0171\\u0113 \\u0162\\u014F\\u018C\\u0105\\u0177 ({0})]]]\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_THIS_WEEK=[[[\\u0162\\u0105\\u015F\\u0137\\u015F \\u010E\\u0171\\u0113 \\u0162\\u0125\\u012F\\u015F \\u0174\\u0113\\u0113\\u0137 ({0})]]]\r\n# XTIT: filtered by Account\r\nLIST_FILTER_TITLE_ACCOUNT=[[[\\u0191\\u012F\\u013A\\u0163\\u0113\\u0157\\u0113\\u018C \\u0183\\u0177 \\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163 {0} ({1})]]]\r\n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TODAY=[[[\\u0162\\u014F\\u018C\\u0105\\u0177]]]\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TOMORROW=[[[\\u0162\\u014F\\u0271\\u014F\\u0157\\u0157\\u014F\\u0175]]]\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_YESTERDAY=[[[\\u0176\\u0113\\u015F\\u0163\\u0113\\u0157\\u018C\\u0105\\u0177]]]\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_IN_X_DAYS=[[[\\u012C\\u014B {0} \\u018C\\u0105\\u0177\\u015F]]]\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_X_DAYS_AGO={0}[[[ \\u018C\\u0105\\u0177\\u015F \\u0105\\u011F\\u014F]]]\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=[[[\\u0176\\u014F\\u0171 \\u0105\\u0157\\u0113 \\u0157\\u0113\\u015F\\u03C1\\u014F\\u014B\\u015F\\u012F\\u0183\\u013A\\u0113 \\u0192\\u014F\\u0157 ({0}) \\u014F\\u0171\\u0163 \\u014F\\u0192 ({1}) \\u0163\\u0105\\u015F\\u0137\\u015F. \\u014E\\u014B\\u013A\\u0177 \\u0177\\u014F\\u0171\\u0157 \\u0163\\u0105\\u015F\\u0137\\u015F \\u0105\\u0157\\u0113 \\u018C\\u012F\\u015F\\u03C1\\u013A\\u0105\\u0177\\u0113\\u018C.]]]\r\n# XTIT: Confirmation message to indicate that the task has been completed\r\nLIST_COMPLETE_CONFIRMATION=[[[\\u0162\\u0105\\u015F\\u0137 {0} \\u0125\\u0105\\u015F \\u0183\\u0113\\u0113\\u014B \\u015F\\u0113\\u0163 \\u0163\\u014F \\u0108\\u014F\\u0271\\u03C1\\u013A\\u0113\\u0163\\u0113\\u018C]]]\r\n\r\n## Task Details \r\n###############\r\n\r\n# XTIT: task detail view name\r\nMC_DETAILS_TITLE=[[[\\u0162\\u0105\\u015F\\u0137 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F]]]\r\n# XTIT: task detail title\r\nDETAILS_PAGE_TITLE=[[[\\u0162\\u0105\\u015F\\u0137\\u015F]]]\r\n# XSEL: new task default text\r\nNEW_TASK_INPUT_PLACEHOLDER=[[[\\u0143\\u0113\\u0175 \\u0163\\u0105\\u015F\\u0137...]]]\r\n# XTIT: initial title of a tasks\r\nNEW_TASK_TITLE=[[[\\u016E\\u014B\\u0163\\u012F\\u0163\\u013A\\u0113\\u018C]]]\r\n# XTIT: page title of a newly created task\r\nNEW_TASK_PAGE_TITLE=[[[\\u0143\\u0113\\u0175 \\u0162\\u0105\\u015F\\u0137]]]\r\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\r\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE=[[[\\u0192\\u014F\\u0157\\u0175\\u0105\\u0157\\u018C\\u0113\\u018C \\u0183\\u0177 {0}, ]]]{1}\r\n\r\n\r\n#Form\r\n\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TITLE=[[[\\u0162\\u012F\\u0163\\u013A\\u0113]]]\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_NOTE=[[[\\u0143\\u014F\\u0163\\u0113]]]\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_DUE_DATE=[[[\\u010E\\u0171\\u0113 \\u010E\\u0105\\u0163\\u0113]]]\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_ACCOUNT=[[[\\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163]]]\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_CONTACT=[[[\\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163]]]\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIVATE=[[[\\u01A4\\u0157\\u012F\\u028B\\u0105\\u0163\\u0113]]]\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIORITY=[[[\\u01A4\\u0157\\u012F\\u014F\\u0157\\u012F\\u0163\\u0177]]]\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_STATUS=[[[\\u015C\\u0163\\u0105\\u0163\\u0171\\u015F]]]\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TYPE=[[[\\u0162\\u0177\\u03C1\\u0113]]]\r\n\r\n#Buttons\r\n\r\n# XBUT: Button for deleting the task\r\nDETAILS_BUTTONS_DELETE=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113 \\u0162\\u0105\\u015F\\u0137]]]\r\n# XBUT: Button for deleting the task\r\nDETAILS_FOOTER_BUTTON_DELETE=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113]]]\r\n# XBUT: Button for canceling the task\r\nDETAILS_BUTTONS_CANCEL=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A]]]\r\n# XBUT: Button for creating a new task or saving the existing task\r\nDETAILS_BUTTONS_SAVE=[[[\\u015C\\u0105\\u028B\\u0113]]]\r\n# XBUT: Button for assigning the task to another person\r\nDETAILS_BUTTONS_ASSIGNTO=[[[\\u0100\\u015F\\u015F\\u012F\\u011F\\u014B \\u0162\\u014F]]]\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP=[[[\\u0191\\u014F\\u013A\\u013A\\u014F\\u0175 \\u016E\\u03C1]]]\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_TASK=[[[\\u0191\\u014F\\u013A\\u013A\\u014F\\u0175 \\u0171\\u03C1 \\u0162\\u0105\\u015F\\u0137]]]\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_OPPT=[[[\\u0191\\u014F\\u013A\\u013A\\u014F\\u0175 \\u0171\\u03C1 \\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u0177]]]\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_APPT=[[[\\u0191\\u014F\\u013A\\u013A\\u014F\\u0175 \\u0171\\u03C1 \\u0100\\u03C1\\u03C1\\u014F\\u012F\\u014B\\u0163\\u0271\\u0113\\u014B\\u0163]]]\r\n\r\n#Message Box\r\n\r\n# XBUT: Title for the message box\r\nDETAILS_MESSAGEBOX_TITLE=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113]]]\r\n# YMSG: Text for the message box\r\nDETAILS_MESSAGEBOX_TEXT=[[[\\u0100\\u0157\\u0113 \\u0177\\u014F\\u0171 \\u015F\\u0171\\u0157\\u0113 \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113 \\u0163\\u0125\\u012F\\u015F \\u0163\\u0105\\u015F\\u0137?]]]\r\n# XTIT: Confirmation message\r\nDETAILS_DELETE_CONFIRMATION=[[[\\u0162\\u0105\\u015F\\u0137 {0} \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113\\u018C]]]\r\n#XTIT: Warning message\r\nNAVBACK_WARNING_TITLE=[[[\\u0174\\u0105\\u0157\\u014B\\u012F\\u014B\\u011F]]]\r\n#YMSG: Text for the message box\r\nNAVBACK_WARNING_MESSAGE=[[[\\u0176\\u014F\\u0171\\u0157 \\u0113\\u014B\\u0163\\u0157\\u012F\\u0113\\u015F \\u0175\\u012F\\u013A\\u013A \\u0183\\u0113 \\u013A\\u014F\\u015F\\u0163. \\u0100\\u0157\\u0113 \\u0177\\u014F\\u0171 \\u015F\\u0171\\u0157\\u0113 \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u013A\\u0113\\u0105\\u028B\\u0113 \\u0163\\u0125\\u012F\\u015F \\u03C1\\u0105\\u011F\\u0113?]]]\r\n\r\n#Value Help \r\n\r\n# XTIT: Title for Value Help Account\r\nDETAILS_VALUE_HELP_ACC_TITLE=[[[\\u015C\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163]]]\r\n# XTIT: Title for Value Help Contact\r\nDETAILS_VALUE_HELP_CON_TITLE=[[[\\u015C\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163]]]\r\n# YMSG: Filtered by info bar text for contact search popup\r\nDETAILS_VALUE_HELP_FILTERED_BY=[[[\\u0191\\u012F\\u013A\\u0163\\u0113\\u0157\\u0113\\u018C \\u0183\\u0177]]]\r\n# XTIT: Account VH item description: city, country\r\nDETAILS_VALUE_HELP_ACC_DESCR={0}[[[, ]]]{1}\r\n# XTIT: Contact VH item description: account name, function\r\nDETAILS_VALUE_HELP_CON_DESCR={0}[[[, ]]]{1}\r\n\r\n\r\n#Business card Account and Contact\r\n\r\n# XTIT: Title for business card Account\r\nDETAILS_BCARD_ACCOUNT=[[[\\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163 \\u014E\\u028B\\u0113\\u0157\\u028B\\u012F\\u0113\\u0175]]]\r\n# XTIT: Title for business card Contact\r\nDETAILS_BCARD_CONTACT=[[[\\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163 \\u014E\\u028B\\u0113\\u0157\\u028B\\u012F\\u0113\\u0175]]]\r\n\r\n#Assign task to\r\n\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TITLE=[[[\\u0100\\u015F\\u015F\\u012F\\u011F\\u014B \\u0162\\u014F]]]\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TEXT=[[[\\u0100\\u015F\\u015F\\u012F\\u011F\\u014B \\u0162\\u0105\\u015F\\u0137 \\u0162\\u014F\\:]]]\r\n# XTIT: Title for employee search\r\nDETAILS_ASSIGNTO_ASIGNEE=[[[\\u015C\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0162\\u0105\\u015F\\u0137 \\u0100\\u015F\\u015F\\u012F\\u011F\\u014B\\u0113\\u0113]]]\r\n# XTIT: Confirmation message\r\nDETAILS_ASSIGNTO_CONFIRMATION=[[[\\u0162\\u0105\\u015F\\u0137 \\u0105\\u015F\\u015F\\u012F\\u011F\\u014B\\u0113\\u018C \\u0163\\u014F ]]]{0}\r\n# XBUT: Button on dialog: ok\r\nDIALOG_ASSIGNTO_BUTTON_OK=[[[\\u014E\\u0136]]]\r\n# XBUT: Button on dialog: cancel\r\nDIALOG_ASSIGNTO_BUTTON_CANCEL=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A]]]\r\n\r\n# errors\r\n\r\n# YMSG: generic error\r\nGENERIC_ERROR=[[[\\u015C\\u0177\\u015F\\u0163\\u0113\\u0271 \\u012F\\u015F \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163\\u013A\\u0177 \\u014B\\u014F\\u0163 \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113, \\u03C1\\u013A\\u0113\\u0105\\u015F\\u0113 \\u0163\\u0157\\u0177 \\u0105\\u011F\\u0105\\u012F\\u014B \\u013A\\u0105\\u0163\\u0113\\u0157 \\u014F\\u0157 \\u010B\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163 \\u0177\\u014F\\u0171\\u0157 \\u015F\\u0177\\u015F\\u0163\\u0113\\u0271 \\u0105\\u018C\\u0271\\u012F\\u014B\\u012F\\u015F\\u0163\\u0157\\u0105\\u0163\\u014F\\u0157]]]\r\n# YMSG: error in date\r\nDETAILS_MESSAGETEXT_DATE=[[[\\u010E\\u0105\\u0163\\u0113 \\u012F\\u015F \\u014B\\u014F\\u0163 \\u028B\\u0105\\u013A\\u012F\\u018C \\u014F\\u0157 \\u014B\\u014F\\u0163 \\u012F\\u014B \\u0163\\u0125\\u0113 \\u010B\\u014F\\u0157\\u0157\\u0113\\u010B\\u0163 \\u0192\\u014F\\u0157\\u0271\\u0105\\u0163. \\u016E\\u015F\\u0113 \\u0163\\u0125\\u0113 \\u012F\\u014B\\u03C1\\u0171\\u0163 \\u0125\\u0113\\u013A\\u03C1 \\u0163\\u014F \\u0113\\u014B\\u0163\\u0113\\u0157 \\u0163\\u0125\\u0113 \\u018C\\u0105\\u0163\\u0113.]]]\r\n# YMSG: error in account\r\nDETAILS_MESSAGETEXT_ACCOUNT=[[[\\u016E\\u015F\\u0113 \\u0163\\u0125\\u0113 \\u012F\\u014B\\u03C1\\u0171\\u0163 \\u0125\\u0113\\u013A\\u03C1 \\u0163\\u014F \\u0113\\u014B\\u0163\\u0113\\u0157 \\u0105\\u014B \\u0105\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163.]]]\r\n# YMSG: error in contact\r\nDETAILS_MESSAGETEXT_CONTACT=[[[\\u016E\\u015F\\u0113 \\u0163\\u0125\\u0113 \\u012F\\u014B\\u03C1\\u0171\\u0163 \\u0125\\u0113\\u013A\\u03C1 \\u0163\\u014F \\u0113\\u014B\\u0163\\u0113\\u0157 \\u0105 \\u010B\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163.]]]\r\n# YMSG: title for the validation message box after save is clicked\r\nDETAILS_VALIDATION_TITLE=[[[\\u016E\\u015F\\u0113 \\u012C\\u014B\\u03C1\\u0171\\u0163 \\u0124\\u0113\\u013A\\u03C1]]]\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=[[[\\u013B\\u014F\\u0105\\u018C\\u012F\\u014B\\u011F...]]]\r\n\r\n# XTIT: Title for Follow up Dialog\r\nDETAILS_FOLLOWUP_TITLE=[[[\\u0191\\u014F\\u013A\\u013A\\u014F\\u0175 \\u0171\\u03C1]]]\r\n# XBUT: Button text for Follow up activities\r\nDETAILS_FOLLOWUP_BUTTON=[[[\\u0191\\u014F\\u013A\\u013A\\u014F\\u0175 \\u0171\\u03C1]]]\r\n# XTIT: Title for Confirmation Dialog to save task or not \r\nDETAILS_CONFIRM_TITLE=[[[\\u0108\\u014F\\u014B\\u0192\\u012F\\u0157\\u0271\\u0105\\u0163\\u012F\\u014F\\u014B]]]\r\n# YMSG: Prompt use to save existing task or not\r\nDETAILS_FOLLOWUP_MESSAGE=[[[\\u0174\\u014F\\u0171\\u013A\\u018C \\u0177\\u014F\\u0171 \\u013A\\u012F\\u0137\\u0113 \\u0163\\u014F \\u015F\\u0105\\u028B\\u0113 \\u0163\\u0125\\u0113 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163 \\u0163\\u0105\\u015F\\u0137?]]]\r\n# XBUT: Positive action to save the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_YES=[[[\\u0176\\u0113\\u015F]]]\r\n# XBUT: Positive action to cancel the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_NO=[[[\\u0143\\u014F]]]\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT=No follow up types available\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_TASK=Cannot proceed in creating a task since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_OPPT=Cannot proceed in creating an opportunity since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_APPT=Cannot proceed in creating an appointment since no follow up types are maintained\r\n# YMSG: Message shown to end user notifying that the follow up was successful\r\nFOLLOWUP_COMPLETED=[[[\\u0191\\u014F\\u013A\\u013A\\u014F\\u0175 \\u0171\\u03C1 \\u015F\\u0171\\u010B\\u010B\\u0113\\u015F\\u015F\\u0192\\u0171\\u013A\\!]]]\r\n# YMSG: Message shown once the task is saved during a follow up scenario\r\nFOLLOWUP_TASK_SAVED=[[[\\u0191\\u014F\\u013A\\u013A\\u014F\\u0175 \\u0171\\u03C1 \\u0163\\u0105\\u015F\\u0137 \\u015F\\u0105\\u028B\\u0113\\u018C\\!]]]\r\n# YMSG: Message shown if a new or existing task is saved\r\nCURRENT_TASK_SAVED=[[[\\u0162\\u0105\\u015F\\u0137 \\u015F\\u0105\\u028B\\u0113\\u018C\\!]]]\r\n# YMSG: Error message shown to the end user telling that follow up activities cannot be done\r\nFOLLOWUP_ERROR_MSG=[[[\\u0114\\u012F\\u0163\\u0125\\u0113\\u0157 \\u0163\\u0125\\u0113 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163 \\u0163\\u0105\\u015F\\u0137 {0} \\u0125\\u0105\\u015F \\u0113\\u0157\\u0157\\u014F\\u0157\\u015F \\u014F\\u0157 \\u0163\\u0125\\u0113\\u0157\\u0113 \\u0105\\u0157\\u0113 \\u014B\\u014F \\u0192\\u014F\\u013A\\u013A\\u014F\\u0175 \\u0171\\u03C1 \\u0163\\u0157\\u0105\\u014B\\u015F\\u0105\\u010B\\u0163\\u012F\\u014F\\u014B \\u0163\\u0177\\u03C1\\u0113\\u015F \\u0271\\u0105\\u012F\\u014B\\u0163\\u0105\\u012F\\u014B\\u0113\\u018C \\u012F\\u014B \\u0163\\u0125\\u0113 \\u0108\\u0171\\u015F\\u0163\\u014F\\u0271\\u012F\\u017E\\u012F\\u014B\\u011F]]]\r\n\r\n#XFLD: Transaction Type of a given task\r\nS4_TASK_TYPE=[[[\\u0162\\u0177\\u03C1\\u0113\\: ]]]{0}\r\n#XFLD: Due Date of a given task\r\nS4_TASK_DUEDATE=[[[\\u010E\\u0171\\u0113 \\u010E\\u0105\\u0163\\u0113\\: ]]]{0}\r\n#XFLD: Account of a given task\r\nS4_TASK_ACCOUNT=[[[\\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163\\: ]]]{0}\r\n#XFLD: Contact of a given task\r\nS4_TASK_CONTACT=[[[\\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163\\: ]]]{0}\r\n#XFLD: Notes of a given task\r\nS4_TASK_NOTES=[[[\\u0143\\u014F\\u0163\\u0113\\u015F]]]\r\n#XFLD: Attachments of a given task\r\nS4_TASK_ATTACHMENTS=[[[\\u0100\\u0163\\u0163\\u0105\\u010B\\u0125\\u0271\\u0113\\u014B\\u0163\\u015F\\: ]]]{0}\r\n#XFLD: Transaction History of a given task\r\nS4_TASK_DOCHISTORY=[[[\\u0162\\u0157\\u0105\\u014B\\u015F\\u0105\\u010B\\u0163\\u012F\\u014F\\u014B \\u0124\\u012F\\u015F\\u0163\\u014F\\u0157\\u0177]]]\r\n# XBUT: Button for follow up of given task to a task\r\nS4_BUTTONS_FOLLOWUPTOTASK=[[[\\u0162\\u0105\\u015F\\u0137]]]\r\n# XBUT: Button for follow up of given task to a opportunity\r\nS4_BUTTONS_FOLLOWUPTOOPPT=[[[\\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u0177]]]\r\n# XBUT: Button for follow up of given task to an appointment\r\nS4_BUTTONS_FOLLOWUPTOAPPT=[[[\\u0100\\u03C1\\u03C1\\u014F\\u012F\\u014B\\u0163\\u0271\\u0113\\u014B\\u0163]]]\r\n# XBUT: Button for editing the task\r\nS4_FOOTER_BUTTON_EDIT=[[[\\u0114\\u018C\\u012F\\u0163]]]\r\n#XFLD: Column Label for the transaction ID of the document\r\nS4_DOCHISTORY_ID=[[[\\u0162\\u0157\\u0105\\u014B\\u015F\\u0105\\u010B\\u0163\\u012F\\u014F\\u014B \\u012C\\u010E]]]\r\n#XFLD: Column Label for the transaction type of the document\r\nS4_DOCHISTORY_TTYPE=[[[\\u0162\\u0157\\u0105\\u014B\\u015F\\u0105\\u010B\\u0163\\u012F\\u014F\\u014B \\u0162\\u0177\\u03C1\\u0113]]]\r\n#XFLD: Column Label for the description of the document\r\nS4_DOCHISTORY_DESC=[[[\\u010E\\u0113\\u015F\\u010B\\u0157\\u012F\\u03C1\\u0163\\u012F\\u014F\\u014B]]]\r\n#XFLD: Column Label for the creation date of the document\r\nS4_DOCHISTORY_CREATEDDATE=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113\\u018C \\u014E\\u014B]]]\r\n#XFLD: Column Label for the relation type to indicate whether current document precedes/succeeds\r\nS4_DOCHISTORY_RELTYPE=[[[\\u0158\\u0113\\u013A\\u0105\\u0163\\u012F\\u014F\\u014B \\u0162\\u0177\\u03C1\\u0113]]]\r\n#XFLD: Label to be shown if no transaction history is available\r\nS4_NO_DOCHISTORY=[[[\\u0143\\u014F \\u0162\\u0157\\u0105\\u014B\\u015F\\u0105\\u010B\\u0163\\u012F\\u014F\\u014B\\u015F \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113]]]\r\n# YMSG: Message shown when renaming an attachment of a task is successful\r\nS3_RENAME_ATTACHMENT_SUCCESS=[[[\\u0100\\u0163\\u0163\\u0105\\u010B\\u0125\\u0271\\u0113\\u014B\\u0163 \\u0157\\u0113\\u014B\\u0105\\u0271\\u0113\\u018C \\u015F\\u0171\\u010B\\u010B\\u0113\\u015F\\u015F\\u0192\\u0171\\u013A\\u013A\\u0177]]]\r\n# YMSG: Message shown when renaming an attachment of a task fails\r\nS3_RENAME_ATTACHMENT_FAILED=[[[\\u0100\\u0163\\u0163\\u0105\\u010B\\u0125\\u0271\\u0113\\u014B\\u0163 \\u010B\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u0183\\u0113 \\u0157\\u0113\\u014B\\u0105\\u0271\\u0113\\u018C]]]\r\n# XBUT: Button for Displaying the Errors\r\nDETAILS_FOOTER_BUTTON_MESSAGE=[[[\\u039C\\u0113\\u015F\\u015F\\u0105\\u011F\\u0113\\u015F]]]\r\n#XTIT: Title of the messages dialog listing the messages with count\r\nS4_MESSAGES_TITLE=[[[\\u039C\\u0113\\u015F\\u015F\\u0105\\u011F\\u0113\\u015F ({0})]]]\r\n# YMSG: Message shown when when the user updates a task in its previous state\r\nS3_412_ERRORMSG=[[[\\u010E\\u0105\\u0163\\u0105 \\u0125\\u0105\\u015F \\u0183\\u0113\\u0113\\u014B \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u018C \\u0183\\u0177 \\u0105\\u014B\\u014F\\u0163\\u0125\\u0113\\u0157 \\u0171\\u015F\\u0113\\u0157. \\u0108\\u013A\\u012F\\u010B\\u0137 \\u014E\\u0136 \\u0163\\u014F \\u0192\\u0113\\u0163\\u010B\\u0125 \\u0163\\u0125\\u0113 \\u013A\\u0105\\u0163\\u0113\\u015F\\u0163 ]]]\r\n#XTIT: Title of dialog indicating an error occurred\r\nS3_412_TITLE=[[[\\u0114\\u0157\\u0157\\u014F\\u0157]]]\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS3_ACCOUNT_CONTACT_NOREL=[[[\\u0176\\u014F\\u0171 \\u010B\\u0105\\u014B \\u014F\\u014B\\u013A\\u0177 \\u028B\\u012F\\u0113\\u0175 \\u0183\\u0171\\u015F\\u012F\\u014B\\u0113\\u015F\\u015F \\u010B\\u0105\\u0157\\u018C\\u015F \\u014F\\u0192 \\u010B\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163\\u015F \\u0163\\u0125\\u0105\\u0163 \\u0125\\u0105\\u028B\\u0113 \\u0183\\u0113\\u0113\\u014B \\u0105\\u015F\\u015F\\u012F\\u011F\\u014B\\u0113\\u018C \\u0163\\u014F \\u0163\\u0125\\u012F\\u015F \\u0105\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163]]]\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS4_ACCOUNT_CONTACT_NOREL=[[[\\u0176\\u014F\\u0171 \\u010B\\u0105\\u014B \\u014F\\u014B\\u013A\\u0177 \\u028B\\u012F\\u0113\\u0175 \\u0183\\u0171\\u015F\\u012F\\u014B\\u0113\\u015F\\u015F \\u010B\\u0105\\u0157\\u018C\\u015F \\u014F\\u0192 \\u010B\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163\\u015F \\u0163\\u0125\\u0105\\u0163 \\u0125\\u0105\\u028B\\u0113 \\u0183\\u0113\\u0113\\u014B \\u0105\\u015F\\u015F\\u012F\\u011F\\u014B\\u0113\\u018C \\u0163\\u014F \\u0163\\u0125\\u012F\\u015F \\u0105\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163]]]\r\n',
	"cus/crm/mytasks/i18n/i18n_en_US_saptrc.properties":'\r\n\r\n\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n# XFLD: No Tasks found text\r\nSEARCH_LIST_NODATA_GENERIC=KrtN/fRSOVIDL4lyJhKcJQ_No results found\r\n\r\n## Task List \r\n############\r\n\r\n# XTIT: Shell title\r\nSHELL_TITLE=yqfYIJ5QkjfaMfnay6tshQ_Tasks\r\n# XTIT: Task list title\r\nLIST_PAGE_TITLE=sivivfJbrFV0Ner+ba4jOA_Tasks\r\n# XTIT: Task list title with number of tasks\r\nLIST_PAGE_TITLE_WITH_NUMBER=KPgDWqz+AfqsiuS1NF8wUA_Open Tasks ({0})\r\n# XTIT: Task list title wname for the add button\r\nLIST_ADD=1er9N4/c19tu67LWtQs9/g_Add\r\n# XTIT: Application name\r\nMASTER_TITLE=1oan7kDIHd+qnABYSw6OVg_My Tasks\r\n# XMSG: Busy text\r\nMASTER_BUSY_TEXT=jgYBYVRYeFCRgDmHbirqmQ_Loading Tasks...\r\n# XMSG: Busy text\r\nMASTER_SEARCH_PLACEHOLDER=KyRjAkVfuH2Xwa8vjdDBLg_Search...\r\n# XTOL: Search tool tip \r\nMASTER_SEARCH_TOOLTIP=IM0FfIAzNgf/JeYT0S4lkA_Search for Tasks\r\n#XTIT: This is the title for the Process Type section\r\nPROCESS_TYPE=GMZy53FS7qLVL0cCHJEkMQ_Select Transaction Type\r\n\r\n\r\n\r\n#Filters\r\n\r\n# XBUT: Filter Button for showing all open tasks\r\nLIST_FILTER_ALL_OPEN=7hGCoqx8x1dDDeE01IMAPg_All Open\r\n# XBUT: Filter Button for showing all tasks that are due today\r\nLIST_FILTER_DUE_TODAY=+mvErJt5jQF7HZC7Dv5RUA_Due Today\r\n# XBUT: Filter Button for showing all tasks that are due this week\r\nLIST_FILTER_DUE_THIS_WEEK=74chYbrZO2SjUKu3e/+K6A_Due This Week\r\n# XBUT: Filter Button for showing all completed tasks\r\nLIST_FILTER_COMPLETED=J2+lfFL+GPlJ6PH1/NFJhg_Completed\r\n\r\n# Filter Bar \r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_BAR_COMPLETED=+LwG+M1wBiOGYXs1H0sEzQ_Filtered by Completed Tasks\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_TODAY=VcIowh8aVAPOv8hAG8T/cA_Filtered by Tasks due Today\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_THIS_WEEK=GHt33ksqJ785sdkIUL8WnA_Filtered by Tasks due this Week\r\n# XTIT: filtered by Account\r\nLIST_FILTER_BAR_ACCOUNT=OxOW1AccOEyFAKPlsgFzmw_Filtered by Account {0}\r\n\r\n# Filter Title\r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_TITLE_COMPLETED=meVxDkj60JQh/GD629ANHg_Completed Tasks ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_TODAY=PSHIfaXoo7R+fn9Koe6nhA_Tasks Due Today ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_THIS_WEEK=gW2i9pZVvVeSbIgzhsJk9A_Tasks Due This Week ({0})\r\n# XTIT: filtered by Account\r\nLIST_FILTER_TITLE_ACCOUNT=W7hXSOWTQbhE79z25qctGg_Filtered by Account {0} ({1})\r\n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TODAY=imz5DpngCYZXVOUbVclThw_Today\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TOMORROW=70uiKNPGAyg/dXsomkq14g_Tomorrow\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_YESTERDAY=6UfI3G48BQ5ebLRlLVTJ3w_Yesterday\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_IN_X_DAYS=HTX1MUunPx28h1qUwslVvA_In {0} days\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_X_DAYS_AGO=QMEFwvWWi+ko5nIxOh0Gug_{0} days ago\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=isd6ukK1YkUBrKiqQ1lZQw_You are responsible for ({0}) out of ({1}) tasks. Only your tasks are displayed.\r\n# XTIT: Confirmation message to indicate that the task has been completed\r\nLIST_COMPLETE_CONFIRMATION=dXldlhb9JhU1VgQpwIYW/Q_Task {0} has been set to Completed\r\n\r\n## Task Details \r\n###############\r\n\r\n# XTIT: task detail view name\r\nMC_DETAILS_TITLE=zBxPcbeIpCrvTAXuqcmKNA_Task Details\r\n# XTIT: task detail title\r\nDETAILS_PAGE_TITLE=qgAkUJNeCCsMIdd1er5HRw_Tasks\r\n# XSEL: new task default text\r\nNEW_TASK_INPUT_PLACEHOLDER=aQjhYyhgSc5pFaAFlFw/rQ_New task...\r\n# XTIT: initial title of a tasks\r\nNEW_TASK_TITLE=0OguR+j8rhwRwdjkOmzngQ_Untitled\r\n# XTIT: page title of a newly created task\r\nNEW_TASK_PAGE_TITLE=DI2PWEnN6x+WBzC75Sb62g_New Task\r\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\r\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE=/S/RMu67Vxzbcl9v9AKI0A_forwarded by {0}, {1}\r\n\r\n\r\n#Form\r\n\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TITLE=5VyqFDrvaSSTbt6JK2u1TA_Title\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_NOTE=AWFXCTqD51CVWIsaF25l6Q_Note\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_DUE_DATE=typ4G0rEcMshXQ8tHYEqXw_Due Date\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_ACCOUNT=bI1C2pF0SEwUP8WlQRGcAQ_Account\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_CONTACT=yaiPEYvM3fk/C4hCbWYpyA_Contact\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIVATE=GbXL1N7JcPhr3eapb92ocw_Private\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIORITY=lDBuGFi++Mlco3oEjx6s6A_Priority\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_STATUS=k5LCC4ukUeccnS/fEesK5A_Status\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TYPE=AtVy2C27tpvhfXqkK1yCTg_Type\r\n\r\n#Buttons\r\n\r\n# XBUT: Button for deleting the task\r\nDETAILS_BUTTONS_DELETE=dkbgiGYMS7RPPl0FMSPQMQ_Delete Task\r\n# XBUT: Button for deleting the task\r\nDETAILS_FOOTER_BUTTON_DELETE=Fga4QNqmmCQxMdoMxet9LQ_Delete\r\n# XBUT: Button for canceling the task\r\nDETAILS_BUTTONS_CANCEL=TINVS0IKO0jqWT3eUuzXIA_Cancel\r\n# XBUT: Button for creating a new task or saving the existing task\r\nDETAILS_BUTTONS_SAVE=J+uL2WfBg8jQRjzAczPEdA_Save\r\n# XBUT: Button for assigning the task to another person\r\nDETAILS_BUTTONS_ASSIGNTO=ZthhNwcs0xM3ggOg1i4vYw_Assign To\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP=8rUpUfzjbeZZK9W8QnY41A_Follow Up\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_TASK=MFplcO4iUo4RR1B4OB6bhQ_Follow up Task\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_OPPT=Vx0y+PyDxzUDEOdedEOf6w_Follow up Opportunity\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_APPT=viPksqtqTZNzRrqxu2+WsQ_Follow up Appointment\r\n\r\n#Message Box\r\n\r\n# XBUT: Title for the message box\r\nDETAILS_MESSAGEBOX_TITLE=BD1s+uCbsuCzKJ5vNn56OQ_Delete\r\n# YMSG: Text for the message box\r\nDETAILS_MESSAGEBOX_TEXT=/b/TUfnmgboGHsiZBym/FQ_Are you sure you want to delete this task?\r\n# XTIT: Confirmation message\r\nDETAILS_DELETE_CONFIRMATION=0RD82ndIFV8ee0OKnthXgg_Task {0} deleted\r\n#XTIT: Warning message\r\nNAVBACK_WARNING_TITLE=th471cnUQkMw1qgPujre2Q_Warning\r\n#YMSG: Text for the message box\r\nNAVBACK_WARNING_MESSAGE=Fa1MJeEtFVR5Lb7y3tCeKg_Your entries will be lost. Are you sure you want to leave this page?\r\n\r\n#Value Help \r\n\r\n# XTIT: Title for Value Help Account\r\nDETAILS_VALUE_HELP_ACC_TITLE=mU5wGXAuCEbTgh59X/TvEw_Select Account\r\n# XTIT: Title for Value Help Contact\r\nDETAILS_VALUE_HELP_CON_TITLE=p2bqKis7XGNX0PXqW6Igkw_Select Contact\r\n# YMSG: Filtered by info bar text for contact search popup\r\nDETAILS_VALUE_HELP_FILTERED_BY=K0SiAbcC5xiCibPPGXHewg_Filtered by\r\n# XTIT: Account VH item description: city, country\r\nDETAILS_VALUE_HELP_ACC_DESCR=TwYefP9CHXJsmsIL3H9+AQ_{0}, {1}\r\n# XTIT: Contact VH item description: account name, function\r\nDETAILS_VALUE_HELP_CON_DESCR=ZGVdfkmv7AO+oUEtZxTOpA_{0}, {1}\r\n\r\n\r\n#Business card Account and Contact\r\n\r\n# XTIT: Title for business card Account\r\nDETAILS_BCARD_ACCOUNT=kseErMTMdUWeugvKFnuTFA_Account Overview\r\n# XTIT: Title for business card Contact\r\nDETAILS_BCARD_CONTACT=4vXXa1F9cEqHBT7R+ZNCxg_Contact Overview\r\n\r\n#Assign task to\r\n\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TITLE=YnAR1nO9nJj23CTcAtGluw_Assign To\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TEXT=J605Tf1ka2IxjJ+tZPA7tA_Assign Task To\\:\r\n# XTIT: Title for employee search\r\nDETAILS_ASSIGNTO_ASIGNEE=+ysWsdwRqyMc52V9JAioHg_Select Task Assignee\r\n# XTIT: Confirmation message\r\nDETAILS_ASSIGNTO_CONFIRMATION=F9eVJ0ockSP+1wk9H672WA_Task assigned to {0}\r\n# XBUT: Button on dialog: ok\r\nDIALOG_ASSIGNTO_BUTTON_OK=Y3dx2s2//QUsoklR33210g_OK\r\n# XBUT: Button on dialog: cancel\r\nDIALOG_ASSIGNTO_BUTTON_CANCEL=X0w6qViG0wER+ZreJiZofA_Cancel\r\n\r\n# errors\r\n\r\n# YMSG: generic error\r\nGENERIC_ERROR=QvjfuoiJSF67DDN9HsIQwQ_System is currently not available, please try again later or contact your system administrator\r\n# YMSG: error in date\r\nDETAILS_MESSAGETEXT_DATE=3sRmmTS6EU86r0KcaH8lsA_Date is not valid or not in the correct format. Use the input help to enter the date.\r\n# YMSG: error in account\r\nDETAILS_MESSAGETEXT_ACCOUNT=oURjeW3M4GwyTXeWyE7q2g_Use the input help to enter an account.\r\n# YMSG: error in contact\r\nDETAILS_MESSAGETEXT_CONTACT=fJSA5JMBHEUlOETY0zAf4A_Use the input help to enter a contact.\r\n# YMSG: title for the validation message box after save is clicked\r\nDETAILS_VALIDATION_TITLE=zYrPzdPDbYDw/drEPXcJbA_Use Input Help\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=Y5mW4l/2dL/c/Rn3LCGi3A_Loading...\r\n\r\n# XTIT: Title for Follow up Dialog\r\nDETAILS_FOLLOWUP_TITLE=5dE7xF8BL4lRek0pfc05uw_Follow up\r\n# XBUT: Button text for Follow up activities\r\nDETAILS_FOLLOWUP_BUTTON=uAX4lcy615mYV3JtSvnVig_Follow up\r\n# XTIT: Title for Confirmation Dialog to save task or not \r\nDETAILS_CONFIRM_TITLE=9M3AwdSfwdjYHhUBYKDSRA_Confirmation\r\n# YMSG: Prompt use to save existing task or not\r\nDETAILS_FOLLOWUP_MESSAGE=le3aHn2DDRVfQkvMREKlrA_Would you like to save the current task?\r\n# XBUT: Positive action to save the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_YES=pcq5Tjea6FOAAfwFxdMw5g_Yes\r\n# XBUT: Positive action to cancel the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_NO=x7WgIAy/MSEc0I7irOR+0A_No\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT=No follow up types available\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_TASK=Cannot proceed in creating a task since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_OPPT=Cannot proceed in creating an opportunity since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_APPT=Cannot proceed in creating an appointment since no follow up types are maintained\r\n# YMSG: Message shown to end user notifying that the follow up was successful\r\nFOLLOWUP_COMPLETED=RulTUiQVO4a0Wt+GyU8prQ_Follow up successful\\!\r\n# YMSG: Message shown once the task is saved during a follow up scenario\r\nFOLLOWUP_TASK_SAVED=NAnyni2lW7EJydVMbwJHjQ_Follow up task saved\\!\r\n# YMSG: Message shown if a new or existing task is saved\r\nCURRENT_TASK_SAVED=YA0NIOz/vm+w/6p/xO6x9w_Task saved\\!\r\n# YMSG: Error message shown to the end user telling that follow up activities cannot be done\r\nFOLLOWUP_ERROR_MSG=ens5B0qRVAOBmN1iztuz1g_Either the current task {0} has errors or there are no follow up transaction types maintained in the Customizing\r\n\r\n#XFLD: Transaction Type of a given task\r\nS4_TASK_TYPE=KrAj0HNJ6Myj0QbI18tKKw_Type\\: {0}\r\n#XFLD: Due Date of a given task\r\nS4_TASK_DUEDATE=aF5QPE6ZJnKRTg6LdmJpcA_Due Date\\: {0}\r\n#XFLD: Account of a given task\r\nS4_TASK_ACCOUNT=KI91qk8pQC4ORA0OTOvx1Q_Account\\: {0}\r\n#XFLD: Contact of a given task\r\nS4_TASK_CONTACT=aDa/elhz+qtMkEoPhig/Xw_Contact\\: {0}\r\n#XFLD: Notes of a given task\r\nS4_TASK_NOTES=z1NSUU3FqIFg/v1wcADCew_Notes\r\n#XFLD: Attachments of a given task\r\nS4_TASK_ATTACHMENTS=BE9C+2V+cLQCRTgoUtlj1Q_Attachments\\: {0}\r\n#XFLD: Transaction History of a given task\r\nS4_TASK_DOCHISTORY=A9kEVqP5BJAWIS7+ka8GOA_Transaction History\r\n# XBUT: Button for follow up of given task to a task\r\nS4_BUTTONS_FOLLOWUPTOTASK=yjlS1FmKHWwnYlxl0vT4ag_Task\r\n# XBUT: Button for follow up of given task to a opportunity\r\nS4_BUTTONS_FOLLOWUPTOOPPT=74XDxwKKmgW/j/ShsIfp7w_Opportunity\r\n# XBUT: Button for follow up of given task to an appointment\r\nS4_BUTTONS_FOLLOWUPTOAPPT=sN147tBEnLasIOwli1YAow_Appointment\r\n# XBUT: Button for editing the task\r\nS4_FOOTER_BUTTON_EDIT=c5JxghLgGrWCnHklbHVqSw_Edit\r\n#XFLD: Column Label for the transaction ID of the document\r\nS4_DOCHISTORY_ID=yGkri2fDmbDgB0BluZ9JRA_Transaction ID\r\n#XFLD: Column Label for the transaction type of the document\r\nS4_DOCHISTORY_TTYPE=JR8neCYf281tc7Y2cxzcxg_Transaction Type\r\n#XFLD: Column Label for the description of the document\r\nS4_DOCHISTORY_DESC=iV2eixLC5SJ9RXj5UZc3wQ_Description\r\n#XFLD: Column Label for the creation date of the document\r\nS4_DOCHISTORY_CREATEDDATE=Njs0c4KVVqBN4Nqf/Vjoog_Created On\r\n#XFLD: Column Label for the relation type to indicate whether current document precedes/succeeds\r\nS4_DOCHISTORY_RELTYPE=IxOoqiBW3Q6FYmYKWb1T3w_Relation Type\r\n#XFLD: Label to be shown if no transaction history is available\r\nS4_NO_DOCHISTORY=0UGNSm/Cs/FejBBlVN7IHA_No Transactions available\r\n# YMSG: Message shown when renaming an attachment of a task is successful\r\nS3_RENAME_ATTACHMENT_SUCCESS=IAwrkF3Qlsxg6XlJpheZ0g_Attachment renamed successfully\r\n# YMSG: Message shown when renaming an attachment of a task fails\r\nS3_RENAME_ATTACHMENT_FAILED=sNuNO2+dxst2MRlhDQau0g_Attachment could not be renamed\r\n# XBUT: Button for Displaying the Errors\r\nDETAILS_FOOTER_BUTTON_MESSAGE=8Dq61sB2vUkYsccfb4P1+g_Messages\r\n#XTIT: Title of the messages dialog listing the messages with count\r\nS4_MESSAGES_TITLE=BdOOwiLhWKhxkPspMMiOVA_Messages ({0})\r\n# YMSG: Message shown when when the user updates a task in its previous state\r\nS3_412_ERRORMSG=gwftuGdri1KnKi8uEle89A_Data has been changed by another user. Click OK to fetch the latest \r\n#XTIT: Title of dialog indicating an error occurred\r\nS3_412_TITLE=A5LzKBFxyRNAJV8EXZ1e6w_Error\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS3_ACCOUNT_CONTACT_NOREL=6trQ7qiNt/2kGhIAS2oODQ_You can only view business cards of contacts that have been assigned to this account\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS4_ACCOUNT_CONTACT_NOREL=Gybfn0TbyFpCRj/6vcVG2w_You can only view business cards of contacts that have been assigned to this account\r\n',
	"cus/crm/mytasks/i18n/i18n_es.properties":'\r\n\r\n\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n# XFLD: No Tasks found text\r\nSEARCH_LIST_NODATA_GENERIC=No existen resultados\r\n\r\n## Task List \r\n############\r\n\r\n# XTIT: Shell title\r\nSHELL_TITLE=Tareas\r\n# XTIT: Task list title\r\nLIST_PAGE_TITLE=Tareas\r\n# XTIT: Task list title with number of tasks\r\nLIST_PAGE_TITLE_WITH_NUMBER=Tareas pendientes ({0})\r\n# XTIT: Task list title wname for the add button\r\nLIST_ADD=A\\u00F1adir\r\n# XTIT: Application name\r\nMASTER_TITLE=Mis Tareas\r\n# XMSG: Busy text\r\nMASTER_BUSY_TEXT=Cargando tareas...\r\n# XMSG: Busy text\r\nMASTER_SEARCH_PLACEHOLDER=Buscar...\r\n# XTOL: Search tool tip \r\nMASTER_SEARCH_TOOLTIP=Buscar tareas\r\n#XTIT: This is the title for the Process Type section\r\nPROCESS_TYPE=Seleccionar tipo de transacci\\u00F3n\r\n\r\n\r\n\r\n#Filters\r\n\r\n# XBUT: Filter Button for showing all open tasks\r\nLIST_FILTER_ALL_OPEN=Todas abiertas\r\n# XBUT: Filter Button for showing all tasks that are due today\r\nLIST_FILTER_DUE_TODAY=Vencen hoy\r\n# XBUT: Filter Button for showing all tasks that are due this week\r\nLIST_FILTER_DUE_THIS_WEEK=Vencen esta semana\r\n# XBUT: Filter Button for showing all completed tasks\r\nLIST_FILTER_COMPLETED=Completadas\r\n\r\n# Filter Bar \r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_BAR_COMPLETED=Filtrado por tareas completadas\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_TODAY=Filtrado por tareas que vencen hoy\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_THIS_WEEK=Filtrado por tareas que vencen esta semana\r\n# XTIT: filtered by Account\r\nLIST_FILTER_BAR_ACCOUNT=Filtrado por cliente {0}\r\n\r\n# Filter Title\r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_TITLE_COMPLETED=Tareas completadas ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_TODAY=Tareas que vencen hoy ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_THIS_WEEK=Tareas que vencen esta semana ({0})\r\n# XTIT: filtered by Account\r\nLIST_FILTER_TITLE_ACCOUNT=Filtrado por cliente {0} ({1})\r\n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TODAY=Hoy\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TOMORROW=Ma\\u00F1ana\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_YESTERDAY=Ayer\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_IN_X_DAYS=En {0} d\\u00EDas\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_X_DAYS_AGO=Hace {0} d\\u00EDas\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Es responsable de {0} de {1} tareas. Solo se visualizar\\u00E1n sus tareas.\r\n# XTIT: Confirmation message to indicate that the task has been completed\r\nLIST_COMPLETE_CONFIRMATION=La tarea {0} se ha fijado en Completada\r\n\r\n## Task Details \r\n###############\r\n\r\n# XTIT: task detail view name\r\nMC_DETAILS_TITLE=Detalles de tarea\r\n# XTIT: task detail title\r\nDETAILS_PAGE_TITLE=Tareas\r\n# XSEL: new task default text\r\nNEW_TASK_INPUT_PLACEHOLDER=Nueva tarea\r\n# XTIT: initial title of a tasks\r\nNEW_TASK_TITLE=Sin t\\u00EDtulo\r\n# XTIT: page title of a newly created task\r\nNEW_TASK_PAGE_TITLE=Nueva tarea\r\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\r\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE=Transmitida por {0}, {1}\r\n\r\n\r\n#Form\r\n\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TITLE=T\\u00EDtulo\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_NOTE=Nota\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_DUE_DATE=Vencimiento\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_ACCOUNT=Cliente\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_CONTACT=Contacto\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIVATE=Privada\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIORITY=Prioridad\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_STATUS=Estado\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TYPE=Tipo\r\n\r\n#Buttons\r\n\r\n# XBUT: Button for deleting the task\r\nDETAILS_BUTTONS_DELETE=Borrar tarea\r\n# XBUT: Button for deleting the task\r\nDETAILS_FOOTER_BUTTON_DELETE=Borrar\r\n# XBUT: Button for canceling the task\r\nDETAILS_BUTTONS_CANCEL=Cancelar\r\n# XBUT: Button for creating a new task or saving the existing task\r\nDETAILS_BUTTONS_SAVE=Guardar\r\n# XBUT: Button for assigning the task to another person\r\nDETAILS_BUTTONS_ASSIGNTO=Asignar a\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP=Seguimiento\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_TASK=Tarea de seguimiento\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_OPPT=Oportunidad subsiguiente\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_APPT=Cita subsiguiente\r\n\r\n#Message Box\r\n\r\n# XBUT: Title for the message box\r\nDETAILS_MESSAGEBOX_TITLE=Borrar\r\n# YMSG: Text for the message box\r\nDETAILS_MESSAGEBOX_TEXT=\\u00BFSeguro que desea borrar esta tarea?\r\n# XTIT: Confirmation message\r\nDETAILS_DELETE_CONFIRMATION=Tarea {0} borrada\r\n#XTIT: Warning message\r\nNAVBACK_WARNING_TITLE=Advertencia\r\n#YMSG: Text for the message box\r\nNAVBACK_WARNING_MESSAGE=Se perder\\u00E1n sus entradas; \\u00BFest\\u00E1 seguro de que desea salir de esta p\\u00E1gina?\r\n\r\n#Value Help \r\n\r\n# XTIT: Title for Value Help Account\r\nDETAILS_VALUE_HELP_ACC_TITLE=Seleccionar cliente\r\n# XTIT: Title for Value Help Contact\r\nDETAILS_VALUE_HELP_CON_TITLE=Seleccionar contacto\r\n# YMSG: Filtered by info bar text for contact search popup\r\nDETAILS_VALUE_HELP_FILTERED_BY=Filtrado por\r\n# XTIT: Account VH item description: city, country\r\nDETAILS_VALUE_HELP_ACC_DESCR={0}, {1}\r\n# XTIT: Contact VH item description: account name, function\r\nDETAILS_VALUE_HELP_CON_DESCR={0}, {1}\r\n\r\n\r\n#Business card Account and Contact\r\n\r\n# XTIT: Title for business card Account\r\nDETAILS_BCARD_ACCOUNT=Resumen del cliente\r\n# XTIT: Title for business card Contact\r\nDETAILS_BCARD_CONTACT=Resumen del contacto\r\n\r\n#Assign task to\r\n\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TITLE=Asignar a\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TEXT=Asignar tarea a\r\n# XTIT: Title for employee search\r\nDETAILS_ASSIGNTO_ASIGNEE=Asignar tarea a empleado\r\n# XTIT: Confirmation message\r\nDETAILS_ASSIGNTO_CONFIRMATION=Tarea asignada a {0}\r\n# XBUT: Button on dialog: ok\r\nDIALOG_ASSIGNTO_BUTTON_OK=OK\r\n# XBUT: Button on dialog: cancel\r\nDIALOG_ASSIGNTO_BUTTON_CANCEL=Cancelar\r\n\r\n# errors\r\n\r\n# YMSG: generic error\r\nGENERIC_ERROR=El sistema no se encuentra disponible actualmente. Int\\u00E9ntelo de nuevo m\\u00E1s tarde o p\\u00F3ngase en contacto con el administrador del sistema\r\n# YMSG: error in date\r\nDETAILS_MESSAGETEXT_DATE=La fecha no es v\\u00E1lida o no tiene el formato correcto. Use la ayuda para entradas para introducir la fecha\r\n# YMSG: error in account\r\nDETAILS_MESSAGETEXT_ACCOUNT=Use la ayuda para entradas para introducir un cliente\r\n# YMSG: error in contact\r\nDETAILS_MESSAGETEXT_CONTACT=Use la ayuda para entradas para introducir un contacto\r\n# YMSG: title for the validation message box after save is clicked\r\nDETAILS_VALIDATION_TITLE=Use la ayuda para entradas\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=Cargando...\r\n\r\n# XTIT: Title for Follow up Dialog\r\nDETAILS_FOLLOWUP_TITLE=Seguimiento\r\n# XBUT: Button text for Follow up activities\r\nDETAILS_FOLLOWUP_BUTTON=Seguimiento\r\n# XTIT: Title for Confirmation Dialog to save task or not \r\nDETAILS_CONFIRM_TITLE=Confirmaci\\u00F3n\r\n# YMSG: Prompt use to save existing task or not\r\nDETAILS_FOLLOWUP_MESSAGE=\\u00BFDesea guardar la tarea actual?\r\n# XBUT: Positive action to save the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_YES=S\\u00ED\r\n# XBUT: Positive action to cancel the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_NO=No\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT=No follow up types available\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_TASK=Cannot proceed in creating a task since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_OPPT=Cannot proceed in creating an opportunity since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_APPT=Cannot proceed in creating an appointment since no follow up types are maintained\r\n# YMSG: Message shown to end user notifying that the follow up was successful\r\nFOLLOWUP_COMPLETED=Operaci\\u00F3n subsiguiente realizada correctamente\r\n# YMSG: Message shown once the task is saved during a follow up scenario\r\nFOLLOWUP_TASK_SAVED=Tarea de seguimiento guardada\r\n# YMSG: Message shown if a new or existing task is saved\r\nCURRENT_TASK_SAVED=Tarea grabada\r\n# YMSG: Error message shown to the end user telling that follow up activities cannot be done\r\nFOLLOWUP_ERROR_MSG=O bien la tarea actual {0} tiene errores o bien no hay tipos de transacciones de seguimiento actualizados en el Customizing\r\n\r\n#XFLD: Transaction Type of a given task\r\nS4_TASK_TYPE=Tipo\\: {0}\r\n#XFLD: Due Date of a given task\r\nS4_TASK_DUEDATE=Fecha de vencimiento\\: {0}\r\n#XFLD: Account of a given task\r\nS4_TASK_ACCOUNT=Cuenta\\: {0}\r\n#XFLD: Contact of a given task\r\nS4_TASK_CONTACT=Contacto\\: {0}\r\n#XFLD: Notes of a given task\r\nS4_TASK_NOTES=Notas\r\n#XFLD: Attachments of a given task\r\nS4_TASK_ATTACHMENTS=Anexos\\: {0}\r\n#XFLD: Transaction History of a given task\r\nS4_TASK_DOCHISTORY=Historial transacci\\u00F3n\r\n# XBUT: Button for follow up of given task to a task\r\nS4_BUTTONS_FOLLOWUPTOTASK=Tarea\r\n# XBUT: Button for follow up of given task to a opportunity\r\nS4_BUTTONS_FOLLOWUPTOOPPT=Oportunidad\r\n# XBUT: Button for follow up of given task to an appointment\r\nS4_BUTTONS_FOLLOWUPTOAPPT=Cita\r\n# XBUT: Button for editing the task\r\nS4_FOOTER_BUTTON_EDIT=Editar\r\n#XFLD: Column Label for the transaction ID of the document\r\nS4_DOCHISTORY_ID=ID de operaci\\u00F3n\r\n#XFLD: Column Label for the transaction type of the document\r\nS4_DOCHISTORY_TTYPE=Clase de operaci\\u00F3n\r\n#XFLD: Column Label for the description of the document\r\nS4_DOCHISTORY_DESC=Descripci\\u00F3n\r\n#XFLD: Column Label for the creation date of the document\r\nS4_DOCHISTORY_CREATEDDATE=Creado el\r\n#XFLD: Column Label for the relation type to indicate whether current document precedes/succeeds\r\nS4_DOCHISTORY_RELTYPE=Tipo de relaci\\u00F3n\r\n#XFLD: Label to be shown if no transaction history is available\r\nS4_NO_DOCHISTORY=Ninguna operaci\\u00F3n disponible\r\n# YMSG: Message shown when renaming an attachment of a task is successful\r\nS3_RENAME_ATTACHMENT_SUCCESS=Anexo renombrado correctamente\r\n# YMSG: Message shown when renaming an attachment of a task fails\r\nS3_RENAME_ATTACHMENT_FAILED=No se ha podido renombrar el anexo\r\n# XBUT: Button for Displaying the Errors\r\nDETAILS_FOOTER_BUTTON_MESSAGE=Mensajes\r\n#XTIT: Title of the messages dialog listing the messages with count\r\nS4_MESSAGES_TITLE=Mensajes ({0})\r\n# YMSG: Message shown when when the user updates a task in its previous state\r\nS3_412_ERRORMSG=Otro usuario ha modificado los datos; haga clic en OK para obtener la versi\\u00F3n m\\u00E1s reciente\r\n#XTIT: Title of dialog indicating an error occurred\r\nS3_412_TITLE=Error\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS3_ACCOUNT_CONTACT_NOREL=Solo puede ver las tarjetas de presentaci\\u00F3n de contactos asignados a este cliente.\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS4_ACCOUNT_CONTACT_NOREL=Solo puede ver las tarjetas de presentaci\\u00F3n de contactos asignados a este cliente.\r\n',
	"cus/crm/mytasks/i18n/i18n_fr.properties":'\r\n\r\n\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n# XFLD: No Tasks found text\r\nSEARCH_LIST_NODATA_GENERIC=Aucun r\\u00E9sultat trouv\\u00E9\r\n\r\n## Task List \r\n############\r\n\r\n# XTIT: Shell title\r\nSHELL_TITLE=T\\u00E2ches\r\n# XTIT: Task list title\r\nLIST_PAGE_TITLE=T\\u00E2ches\r\n# XTIT: Task list title with number of tasks\r\nLIST_PAGE_TITLE_WITH_NUMBER=T\\u00E2ches en cours ({0})\r\n# XTIT: Task list title wname for the add button\r\nLIST_ADD=Ajouter\r\n# XTIT: Application name\r\nMASTER_TITLE=Mes t\\u00E2ches\r\n# XMSG: Busy text\r\nMASTER_BUSY_TEXT=Chargement de t\\u00E2ches en cours...\r\n# XMSG: Busy text\r\nMASTER_SEARCH_PLACEHOLDER=Rechercher\r\n# XTOL: Search tool tip \r\nMASTER_SEARCH_TOOLTIP=Rechercher t\\u00E2ches\r\n#XTIT: This is the title for the Process Type section\r\nPROCESS_TYPE=S\\u00E9lectionner type de transaction\r\n\r\n\r\n\r\n#Filters\r\n\r\n# XBUT: Filter Button for showing all open tasks\r\nLIST_FILTER_ALL_OPEN=En cours (toutes)\r\n# XBUT: Filter Button for showing all tasks that are due today\r\nLIST_FILTER_DUE_TODAY=\\u00C9chues aujourd\'hui\r\n# XBUT: Filter Button for showing all tasks that are due this week\r\nLIST_FILTER_DUE_THIS_WEEK=\\u00C9chues cette semaine\r\n# XBUT: Filter Button for showing all completed tasks\r\nLIST_FILTER_COMPLETED=Cl\\u00F4tur\\u00E9es\r\n\r\n# Filter Bar \r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_BAR_COMPLETED=Filtr\\u00E9 par T\\u00E2ches termin\\u00E9es\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_TODAY=Filtr\\u00E9 par T\\u00E2ches \\u00E9chues aujourd\'hui\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_THIS_WEEK=Filtr\\u00E9 par T\\u00E2ches \\u00E9chues cette semaine\r\n# XTIT: filtered by Account\r\nLIST_FILTER_BAR_ACCOUNT=Filtr\\u00E9 par compte {0}\r\n\r\n# Filter Title\r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_TITLE_COMPLETED=T\\u00E2ches termin\\u00E9es ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_TODAY=T\\u00E2ches \\u00E9chues aujourd\'\'hui ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_THIS_WEEK=T\\u00E2ches \\u00E9chues cette semaine ({0})\r\n# XTIT: filtered by Account\r\nLIST_FILTER_TITLE_ACCOUNT=Filtr\\u00E9 par compte {0} ({1})\r\n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TODAY=Aujourd\'hui\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TOMORROW=Demain\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_YESTERDAY=Hier\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_IN_X_DAYS=Dans {0} jours\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_X_DAYS_AGO=Il y a {0} jours\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Vous avez la responsabilit\\u00E9 pour {0}\\u00A0/\\u00A0{1} t\\u00E2ches. Seules vos t\\u00E2ches s\'\'affichent.\r\n# XTIT: Confirmation message to indicate that the task has been completed\r\nLIST_COMPLETE_CONFIRMATION=La t\\u00E2che {0} a \\u00E9t\\u00E9 d\\u00E9finie sur Termin\\u00E9.\r\n\r\n## Task Details \r\n###############\r\n\r\n# XTIT: task detail view name\r\nMC_DETAILS_TITLE=D\\u00E9tails de la t\\u00E2che\r\n# XTIT: task detail title\r\nDETAILS_PAGE_TITLE=T\\u00E2ches\r\n# XSEL: new task default text\r\nNEW_TASK_INPUT_PLACEHOLDER=Nouvelle t\\u00E2che\r\n# XTIT: initial title of a tasks\r\nNEW_TASK_TITLE=Sans titre\r\n# XTIT: page title of a newly created task\r\nNEW_TASK_PAGE_TITLE=Nouvelle t\\u00E2che\r\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\r\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE=Transf\\u00E9r\\u00E9(e) par {0}, le {1}\r\n\r\n\r\n#Form\r\n\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TITLE=Titre\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_NOTE=Note\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_DUE_DATE=\\u00C9ch\\u00E9ance\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_ACCOUNT=Compte\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_CONTACT=Contact\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIVATE=Priv\\u00E9\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIORITY=Priorit\\u00E9\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_STATUS=Statut\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TYPE=Type\r\n\r\n#Buttons\r\n\r\n# XBUT: Button for deleting the task\r\nDETAILS_BUTTONS_DELETE=Supprimer t\\u00E2che\r\n# XBUT: Button for deleting the task\r\nDETAILS_FOOTER_BUTTON_DELETE=Supprimer\r\n# XBUT: Button for canceling the task\r\nDETAILS_BUTTONS_CANCEL=Interrompre\r\n# XBUT: Button for creating a new task or saving the existing task\r\nDETAILS_BUTTONS_SAVE=Sauvegarder\r\n# XBUT: Button for assigning the task to another person\r\nDETAILS_BUTTONS_ASSIGNTO=Affecter \\u00E0\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP=Effectuer le suivi\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_TASK=Effectuer le suivi de la t\\u00E2che\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_OPPT=Effectuer le suivi de l\'opportunit\\u00E9\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_APPT=Effectuer le suivi du rendez-vous\r\n\r\n#Message Box\r\n\r\n# XBUT: Title for the message box\r\nDETAILS_MESSAGEBOX_TITLE=Supprimer\r\n# YMSG: Text for the message box\r\nDETAILS_MESSAGEBOX_TEXT=Voulez-vous vraiment supprimer cette t\\u00E2che ?\r\n# XTIT: Confirmation message\r\nDETAILS_DELETE_CONFIRMATION=T\\u00E2che {0} supprim\\u00E9e\r\n#XTIT: Warning message\r\nNAVBACK_WARNING_TITLE=Avertissement\r\n#YMSG: Text for the message box\r\nNAVBACK_WARNING_MESSAGE=Vos entr\\u00E9es seront perdues. Voulez-vous vraiment quitter cette page ?\r\n\r\n#Value Help \r\n\r\n# XTIT: Title for Value Help Account\r\nDETAILS_VALUE_HELP_ACC_TITLE=S\\u00E9lectionner compte\r\n# XTIT: Title for Value Help Contact\r\nDETAILS_VALUE_HELP_CON_TITLE=S\\u00E9lectionner contact\r\n# YMSG: Filtered by info bar text for contact search popup\r\nDETAILS_VALUE_HELP_FILTERED_BY=Filtr\\u00E9 par\r\n# XTIT: Account VH item description: city, country\r\nDETAILS_VALUE_HELP_ACC_DESCR={0}, {1}\r\n# XTIT: Contact VH item description: account name, function\r\nDETAILS_VALUE_HELP_CON_DESCR={0}, {1}\r\n\r\n\r\n#Business card Account and Contact\r\n\r\n# XTIT: Title for business card Account\r\nDETAILS_BCARD_ACCOUNT=Synth\\u00E8se du compte\r\n# XTIT: Title for business card Contact\r\nDETAILS_BCARD_CONTACT=Synth\\u00E8se contact\r\n\r\n#Assign task to\r\n\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TITLE=Affecter \\u00E0\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TEXT=Affectation de t\\u00E2che \\u00E0\r\n# XTIT: Title for employee search\r\nDETAILS_ASSIGNTO_ASIGNEE=Afficher t\\u00E2che \\u00E0 salari\\u00E9\r\n# XTIT: Confirmation message\r\nDETAILS_ASSIGNTO_CONFIRMATION=T\\u00E2che affect\\u00E9e \\u00E0 {0}\r\n# XBUT: Button on dialog: ok\r\nDIALOG_ASSIGNTO_BUTTON_OK=OK\r\n# XBUT: Button on dialog: cancel\r\nDIALOG_ASSIGNTO_BUTTON_CANCEL=Interrompre\r\n\r\n# errors\r\n\r\n# YMSG: generic error\r\nGENERIC_ERROR=Syst\\u00E8me actuellement non disponible. R\\u00E9essayez plus tard ou contactez l\'administrateur syst\\u00E8me.\r\n# YMSG: error in date\r\nDETAILS_MESSAGETEXT_DATE=Date non valide ou pas au format correct. Utilisez l\'aide \\u00E0 la saisie pour saisir la date.\r\n# YMSG: error in account\r\nDETAILS_MESSAGETEXT_ACCOUNT=Utilisez l\'aide \\u00E0 la saisie pour saisir un compte.\r\n# YMSG: error in contact\r\nDETAILS_MESSAGETEXT_CONTACT=Utilisez l\'aide \\u00E0 la saisie pour saisir un contact.\r\n# YMSG: title for the validation message box after save is clicked\r\nDETAILS_VALIDATION_TITLE=Utilisez l\'aide \\u00E0 la saisie.\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=Chargement...\r\n\r\n# XTIT: Title for Follow up Dialog\r\nDETAILS_FOLLOWUP_TITLE=Activit\\u00E9 suivante\r\n# XBUT: Button text for Follow up activities\r\nDETAILS_FOLLOWUP_BUTTON=Activit\\u00E9 suivante\r\n# XTIT: Title for Confirmation Dialog to save task or not \r\nDETAILS_CONFIRM_TITLE=Confirmation\r\n# YMSG: Prompt use to save existing task or not\r\nDETAILS_FOLLOWUP_MESSAGE=Voulez-vous sauvegarder la t\\u00E2che en cours ?\r\n# XBUT: Positive action to save the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_YES=Oui\r\n# XBUT: Positive action to cancel the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_NO=Non\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT=No follow up types available\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_TASK=Cannot proceed in creating a task since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_OPPT=Cannot proceed in creating an opportunity since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_APPT=Cannot proceed in creating an appointment since no follow up types are maintained\r\n# YMSG: Message shown to end user notifying that the follow up was successful\r\nFOLLOWUP_COMPLETED=Suivi correctement termin\\u00E9\r\n# YMSG: Message shown once the task is saved during a follow up scenario\r\nFOLLOWUP_TASK_SAVED=T\\u00E2che suivante sauvegard\\u00E9e\r\n# YMSG: Message shown if a new or existing task is saved\r\nCURRENT_TASK_SAVED=T\\u00E2che sauvegard\\u00E9e\r\n# YMSG: Error message shown to the end user telling that follow up activities cannot be done\r\nFOLLOWUP_ERROR_MSG=Soit la t\\u00E2che actuelle {0} contient des erreurs ou aucun type d\'\'op\\u00E9ration suivante n\'\'est g\\u00E9r\\u00E9 dans le Customizing.\r\n\r\n#XFLD: Transaction Type of a given task\r\nS4_TASK_TYPE=Type\\u00A0\\: {0}\r\n#XFLD: Due Date of a given task\r\nS4_TASK_DUEDATE=Date d\'\'\\u00E9ch\\u00E9ance\\u00A0\\: {0}\r\n#XFLD: Account of a given task\r\nS4_TASK_ACCOUNT=Compte\\u00A0\\: {0}\r\n#XFLD: Contact of a given task\r\nS4_TASK_CONTACT=Contact\\u00A0\\: {0}\r\n#XFLD: Notes of a given task\r\nS4_TASK_NOTES=Notes\r\n#XFLD: Attachments of a given task\r\nS4_TASK_ATTACHMENTS=Pi\\u00E8ces jointes\\u00A0\\: {0}\r\n#XFLD: Transaction History of a given task\r\nS4_TASK_DOCHISTORY=Historique de la transaction\r\n# XBUT: Button for follow up of given task to a task\r\nS4_BUTTONS_FOLLOWUPTOTASK=T\\u00E2che\r\n# XBUT: Button for follow up of given task to a opportunity\r\nS4_BUTTONS_FOLLOWUPTOOPPT=Opportunit\\u00E9\r\n# XBUT: Button for follow up of given task to an appointment\r\nS4_BUTTONS_FOLLOWUPTOAPPT=Rendez-vous\r\n# XBUT: Button for editing the task\r\nS4_FOOTER_BUTTON_EDIT=Modifier\r\n#XFLD: Column Label for the transaction ID of the document\r\nS4_DOCHISTORY_ID=ID de transaction\r\n#XFLD: Column Label for the transaction type of the document\r\nS4_DOCHISTORY_TTYPE=Type de transaction\r\n#XFLD: Column Label for the description of the document\r\nS4_DOCHISTORY_DESC=Description\r\n#XFLD: Column Label for the creation date of the document\r\nS4_DOCHISTORY_CREATEDDATE=Date de cr\\u00E9ation\r\n#XFLD: Column Label for the relation type to indicate whether current document precedes/succeeds\r\nS4_DOCHISTORY_RELTYPE=Type de relation\r\n#XFLD: Label to be shown if no transaction history is available\r\nS4_NO_DOCHISTORY=Aucune transaction n\'est disponible.\r\n# YMSG: Message shown when renaming an attachment of a task is successful\r\nS3_RENAME_ATTACHMENT_SUCCESS=Pi\\u00E8ce jointe correctement renomm\\u00E9e\r\n# YMSG: Message shown when renaming an attachment of a task fails\r\nS3_RENAME_ATTACHMENT_FAILED=Impossible de renommer la pi\\u00E8ce jointe\r\n# XBUT: Button for Displaying the Errors\r\nDETAILS_FOOTER_BUTTON_MESSAGE=Messages\r\n#XTIT: Title of the messages dialog listing the messages with count\r\nS4_MESSAGES_TITLE=Messages ({0})\r\n# YMSG: Message shown when when the user updates a task in its previous state\r\nS3_412_ERRORMSG=Les donn\\u00E9es ont \\u00E9t\\u00E9 modifi\\u00E9es par un autre utilisateur. Cliquez sur OK pour obtenir la version la plus r\\u00E9cente.\r\n#XTIT: Title of dialog indicating an error occurred\r\nS3_412_TITLE=Erreur\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS3_ACCOUNT_CONTACT_NOREL=Vous pouvez uniquement afficher les cartes de visite des contacts affect\\u00E9s \\u00E0 ce compte.\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS4_ACCOUNT_CONTACT_NOREL=Vous pouvez uniquement afficher les cartes de visite des contacts affect\\u00E9s \\u00E0 ce compte.\r\n',
	"cus/crm/mytasks/i18n/i18n_hr.properties":'\r\n\r\n\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n# XFLD: No Tasks found text\r\nSEARCH_LIST_NODATA_GENERIC=Rezultati nisu na\\u0111eni\r\n\r\n## Task List \r\n############\r\n\r\n# XTIT: Shell title\r\nSHELL_TITLE=Zadaci\r\n# XTIT: Task list title\r\nLIST_PAGE_TITLE=Zadaci\r\n# XTIT: Task list title with number of tasks\r\nLIST_PAGE_TITLE_WITH_NUMBER=Otvoreni zadaci ({0})\r\n# XTIT: Task list title wname for the add button\r\nLIST_ADD=Dodaj\r\n# XTIT: Application name\r\nMASTER_TITLE=Moji zadaci\r\n# XMSG: Busy text\r\nMASTER_BUSY_TEXT=U\\u010Ditavanje zadataka...\r\n# XMSG: Busy text\r\nMASTER_SEARCH_PLACEHOLDER=Tra\\u017Eenje...\r\n# XTOL: Search tool tip \r\nMASTER_SEARCH_TOOLTIP=Tra\\u017Ei zadatke\r\n#XTIT: This is the title for the Process Type section\r\nPROCESS_TYPE=Odaberi tip transakcije\r\n\r\n\r\n\r\n#Filters\r\n\r\n# XBUT: Filter Button for showing all open tasks\r\nLIST_FILTER_ALL_OPEN=Sve otvoreno\r\n# XBUT: Filter Button for showing all tasks that are due today\r\nLIST_FILTER_DUE_TODAY=Dospijeva danas\r\n# XBUT: Filter Button for showing all tasks that are due this week\r\nLIST_FILTER_DUE_THIS_WEEK=Dospijeva ovaj tjedan\r\n# XBUT: Filter Button for showing all completed tasks\r\nLIST_FILTER_COMPLETED=Dovr\\u0161eno\r\n\r\n# Filter Bar \r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_BAR_COMPLETED=Filtrirano po dovr\\u0161enim zadacima\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_TODAY=Filtrirano po zadacima koji dospijevaju danas\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_THIS_WEEK=Filtrirano po zadacima koji dospijevaju ovaj tjedan\r\n# XTIT: filtered by Account\r\nLIST_FILTER_BAR_ACCOUNT=Filtrirano prema klijentu {0}\r\n\r\n# Filter Title\r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_TITLE_COMPLETED=Dovr\\u0161eni zadaci {0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_TODAY=Zadaci koji dospijevaju danas ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_THIS_WEEK=Zadaci koji dospijevaju ovaj tjedan ({0})\r\n# XTIT: filtered by Account\r\nLIST_FILTER_TITLE_ACCOUNT=Filtrirano prema klijentu {0} ({1})\r\n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TODAY=Danas\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TOMORROW=Sutra\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_YESTERDAY=Ju\\u010Der\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_IN_X_DAYS=Za {0} dana\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_X_DAYS_AGO=Prije {0} dana\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Odgovorni ste za {0} od {1} zadataka. Prikazani su samo va\\u0161i zadaci.\r\n# XTIT: Confirmation message to indicate that the task has been completed\r\nLIST_COMPLETE_CONFIRMATION=Zadatak {0} postavljen je na Dovr\\u0161eno\r\n\r\n## Task Details \r\n###############\r\n\r\n# XTIT: task detail view name\r\nMC_DETAILS_TITLE=Detalji zadatka\r\n# XTIT: task detail title\r\nDETAILS_PAGE_TITLE=Zadaci\r\n# XSEL: new task default text\r\nNEW_TASK_INPUT_PLACEHOLDER=Novi zadatak\r\n# XTIT: initial title of a tasks\r\nNEW_TASK_TITLE=Bez naslova\r\n# XTIT: page title of a newly created task\r\nNEW_TASK_PAGE_TITLE=Novi zadatak\r\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\r\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE=Proslijedio {0}, {1}\r\n\r\n\r\n#Form\r\n\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TITLE=Naslov\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_NOTE=Bilje\\u0161ka\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_DUE_DATE=Datum dospije\\u0107a\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_ACCOUNT=Klijent\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_CONTACT=Kontakt\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIVATE=Osobno\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIORITY=Prioritet\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_STATUS=Status\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TYPE=Tip\r\n\r\n#Buttons\r\n\r\n# XBUT: Button for deleting the task\r\nDETAILS_BUTTONS_DELETE=Izbri\\u0161i zadatak\r\n# XBUT: Button for deleting the task\r\nDETAILS_FOOTER_BUTTON_DELETE=Izbri\\u0161i\r\n# XBUT: Button for canceling the task\r\nDETAILS_BUTTONS_CANCEL=Otka\\u017Ei\r\n# XBUT: Button for creating a new task or saving the existing task\r\nDETAILS_BUTTONS_SAVE=Snimi\r\n# XBUT: Button for assigning the task to another person\r\nDETAILS_BUTTONS_ASSIGNTO=Dodijeli\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP=Sljede\\u0107a aktivnost\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_TASK=Sljede\\u0107i zadatak\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_OPPT=Sljede\\u0107a prilika\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_APPT=Sljede\\u0107i sastanak\r\n\r\n#Message Box\r\n\r\n# XBUT: Title for the message box\r\nDETAILS_MESSAGEBOX_TITLE=Izbri\\u0161i\r\n# YMSG: Text for the message box\r\nDETAILS_MESSAGEBOX_TEXT=\\u017Delite li zaista izbrisati ovaj zadatak?\r\n# XTIT: Confirmation message\r\nDETAILS_DELETE_CONFIRMATION=Zadatak {0} izbrisan\r\n#XTIT: Warning message\r\nNAVBACK_WARNING_TITLE=Upozorenje\r\n#YMSG: Text for the message box\r\nNAVBACK_WARNING_MESSAGE=Unosi \\u0107e se izgubiti; \\u017Eelite li zaista napustiti ovu stranicu?\r\n\r\n#Value Help \r\n\r\n# XTIT: Title for Value Help Account\r\nDETAILS_VALUE_HELP_ACC_TITLE=Odaberi klijenta\r\n# XTIT: Title for Value Help Contact\r\nDETAILS_VALUE_HELP_CON_TITLE=Odaberi kontakt\r\n# YMSG: Filtered by info bar text for contact search popup\r\nDETAILS_VALUE_HELP_FILTERED_BY=Filtrirano po\r\n# XTIT: Account VH item description: city, country\r\nDETAILS_VALUE_HELP_ACC_DESCR={0}, {1}\r\n# XTIT: Contact VH item description: account name, function\r\nDETAILS_VALUE_HELP_CON_DESCR={0}, {1}\r\n\r\n\r\n#Business card Account and Contact\r\n\r\n# XTIT: Title for business card Account\r\nDETAILS_BCARD_ACCOUNT=Pregled klijenta\r\n# XTIT: Title for business card Contact\r\nDETAILS_BCARD_CONTACT=Pregled kontakata\r\n\r\n#Assign task to\r\n\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TITLE=Dodijeli\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TEXT=Dodijeli zadatak\r\n# XTIT: Title for employee search\r\nDETAILS_ASSIGNTO_ASIGNEE=Dodijeli zadatak zaposleniku\r\n# XTIT: Confirmation message\r\nDETAILS_ASSIGNTO_CONFIRMATION=Zadatak dodijeljen {0}\r\n# XBUT: Button on dialog: ok\r\nDIALOG_ASSIGNTO_BUTTON_OK=U redu\r\n# XBUT: Button on dialog: cancel\r\nDIALOG_ASSIGNTO_BUTTON_CANCEL=Otka\\u017Ei\r\n\r\n# errors\r\n\r\n# YMSG: generic error\r\nGENERIC_ERROR=Sustav trenutno nije raspolo\\u017Eiv; poku\\u0161ajte ponovno kasnije ili kontaktirajte svog administratora sustava\r\n# YMSG: error in date\r\nDETAILS_MESSAGETEXT_DATE=Datum nije va\\u017Ee\\u0107i ili je neispravnog formata; za unos datuma koristite pomo\\u0107 unosa\r\n# YMSG: error in account\r\nDETAILS_MESSAGETEXT_ACCOUNT=Koristite pomo\\u0107 unosa za unos klijenta\r\n# YMSG: error in contact\r\nDETAILS_MESSAGETEXT_CONTACT=Koristite pomo\\u0107 unosa za unos kontakta\r\n# YMSG: title for the validation message box after save is clicked\r\nDETAILS_VALIDATION_TITLE=Koristi pomo\\u0107 unosa\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=U\\u010Ditavanje...\r\n\r\n# XTIT: Title for Follow up Dialog\r\nDETAILS_FOLLOWUP_TITLE=Sljede\\u0107a aktivnost\r\n# XBUT: Button text for Follow up activities\r\nDETAILS_FOLLOWUP_BUTTON=Sljede\\u0107a aktivnost\r\n# XTIT: Title for Confirmation Dialog to save task or not \r\nDETAILS_CONFIRM_TITLE=Potvrda\r\n# YMSG: Prompt use to save existing task or not\r\nDETAILS_FOLLOWUP_MESSAGE=\\u017Delite li snimiti trenutni zadatak?\r\n# XBUT: Positive action to save the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_YES=Da\r\n# XBUT: Positive action to cancel the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_NO=Ne\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT=No follow up types available\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_TASK=Cannot proceed in creating a task since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_OPPT=Cannot proceed in creating an opportunity since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_APPT=Cannot proceed in creating an appointment since no follow up types are maintained\r\n# YMSG: Message shown to end user notifying that the follow up was successful\r\nFOLLOWUP_COMPLETED=Sljede\\u0107a aktivnost uspje\\u0161na\r\n# YMSG: Message shown once the task is saved during a follow up scenario\r\nFOLLOWUP_TASK_SAVED=Sljede\\u0107i zadatak snimljen\r\n# YMSG: Message shown if a new or existing task is saved\r\nCURRENT_TASK_SAVED=Zadatak snimljen\r\n# YMSG: Error message shown to the end user telling that follow up activities cannot be done\r\nFOLLOWUP_ERROR_MSG=Trenutni zadatak {0} sadr\\u017Ei gre\\u0161ke ili se ne odr\\u017Eavaju tipovi naknadnih transakcija u prilagodbi\r\n\r\n#XFLD: Transaction Type of a given task\r\nS4_TASK_TYPE=Tip\\: {0}\r\n#XFLD: Due Date of a given task\r\nS4_TASK_DUEDATE=Datum dospije\\u0107a\\: {0}\r\n#XFLD: Account of a given task\r\nS4_TASK_ACCOUNT=Klijent\\: {0}\r\n#XFLD: Contact of a given task\r\nS4_TASK_CONTACT=Kontakt\\: {0}\r\n#XFLD: Notes of a given task\r\nS4_TASK_NOTES=Bilje\\u0161ke\r\n#XFLD: Attachments of a given task\r\nS4_TASK_ATTACHMENTS=Prilozi\\: {0}\r\n#XFLD: Transaction History of a given task\r\nS4_TASK_DOCHISTORY=Povijest transakcije\r\n# XBUT: Button for follow up of given task to a task\r\nS4_BUTTONS_FOLLOWUPTOTASK=Zadatak\r\n# XBUT: Button for follow up of given task to a opportunity\r\nS4_BUTTONS_FOLLOWUPTOOPPT=Prilika\r\n# XBUT: Button for follow up of given task to an appointment\r\nS4_BUTTONS_FOLLOWUPTOAPPT=Sastanak\r\n# XBUT: Button for editing the task\r\nS4_FOOTER_BUTTON_EDIT=Uredi\r\n#XFLD: Column Label for the transaction ID of the document\r\nS4_DOCHISTORY_ID=ID transakcije\r\n#XFLD: Column Label for the transaction type of the document\r\nS4_DOCHISTORY_TTYPE=Tip transakcije\r\n#XFLD: Column Label for the description of the document\r\nS4_DOCHISTORY_DESC=Opis\r\n#XFLD: Column Label for the creation date of the document\r\nS4_DOCHISTORY_CREATEDDATE=Datum kreiranja\r\n#XFLD: Column Label for the relation type to indicate whether current document precedes/succeeds\r\nS4_DOCHISTORY_RELTYPE=Tip odnosa\r\n#XFLD: Label to be shown if no transaction history is available\r\nS4_NO_DOCHISTORY=Transakcije nisu raspolo\\u017Eive\r\n# YMSG: Message shown when renaming an attachment of a task is successful\r\nS3_RENAME_ATTACHMENT_SUCCESS=Prilog uspje\\u0161no preimenovan\r\n# YMSG: Message shown when renaming an attachment of a task fails\r\nS3_RENAME_ATTACHMENT_FAILED=Prilog nije bilo mogu\\u0107e preimenovati\r\n# XBUT: Button for Displaying the Errors\r\nDETAILS_FOOTER_BUTTON_MESSAGE=Poruke\r\n#XTIT: Title of the messages dialog listing the messages with count\r\nS4_MESSAGES_TITLE=Poruke ({0})\r\n# YMSG: Message shown when when the user updates a task in its previous state\r\nS3_412_ERRORMSG=Podatke je promijenio drugi korisnik; pritisnite OK za najnoviju verziju\r\n#XTIT: Title of dialog indicating an error occurred\r\nS3_412_TITLE=Gre\\u0161ka\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS3_ACCOUNT_CONTACT_NOREL=Mo\\u017Eete pregledati samo posjetnice kontakata koji su dodijeljeni ovom klijentu\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS4_ACCOUNT_CONTACT_NOREL=Mo\\u017Eete pregledati samo posjetnice kontakata koji su dodijeljeni ovom klijentu\r\n',
	"cus/crm/mytasks/i18n/i18n_hu.properties":'\r\n\r\n\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n# XFLD: No Tasks found text\r\nSEARCH_LIST_NODATA_GENERIC=Nincs tal\\u00E1lat\r\n\r\n## Task List \r\n############\r\n\r\n# XTIT: Shell title\r\nSHELL_TITLE=Feladatok\r\n# XTIT: Task list title\r\nLIST_PAGE_TITLE=Feladatok\r\n# XTIT: Task list title with number of tasks\r\nLIST_PAGE_TITLE_WITH_NUMBER=Nyitott tennival\\u00F3k ({0})\r\n# XTIT: Task list title wname for the add button\r\nLIST_ADD=Hozz\\u00E1ad\\u00E1s\r\n# XTIT: Application name\r\nMASTER_TITLE=Saj\\u00E1t feladatok\r\n# XMSG: Busy text\r\nMASTER_BUSY_TEXT=Feladatok bet\\u00F6lt\\u00E9se...\r\n# XMSG: Busy text\r\nMASTER_SEARCH_PLACEHOLDER=Keres\\u00E9s...\r\n# XTOL: Search tool tip \r\nMASTER_SEARCH_TOOLTIP=Feladatok keres\\u00E9se\r\n#XTIT: This is the title for the Process Type section\r\nPROCESS_TYPE=Tranzakci\\u00F3fajta kiv\\u00E1laszt\\u00E1sa\r\n\r\n\r\n\r\n#Filters\r\n\r\n# XBUT: Filter Button for showing all open tasks\r\nLIST_FILTER_ALL_OPEN=\\u00D6sszes nyitott\r\n# XBUT: Filter Button for showing all tasks that are due today\r\nLIST_FILTER_DUE_TODAY=Ma esed\\u00E9kes\r\n# XBUT: Filter Button for showing all tasks that are due this week\r\nLIST_FILTER_DUE_THIS_WEEK=Ezen a h\\u00E9ten esed\\u00E9kes\r\n# XBUT: Filter Button for showing all completed tasks\r\nLIST_FILTER_COMPLETED=Befejez\\u0151d\\u00F6tt\r\n\r\n# Filter Bar \r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_BAR_COMPLETED=Sz\\u0171r\\u00E9s a lez\\u00E1rt feladatok szerint\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_TODAY=Sz\\u0171r\\u00E9s a ma esed\\u00E9kes feladatok szerint\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_THIS_WEEK=Sz\\u0171r\\u00E9s az ezen a h\\u00E9ten esed\\u00E9kes feladatok szerint\r\n# XTIT: filtered by Account\r\nLIST_FILTER_BAR_ACCOUNT=Sz\\u0171r\\u00E9s {0} sz\\u00E1mla szerint\r\n\r\n# Filter Title\r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_TITLE_COMPLETED=Elint\\u00E9zett tennival\\u00F3k ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_TODAY=Ma esed\\u00E9kes tennival\\u00F3k ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_THIS_WEEK=Ezen a h\\u00E9ten esed\\u00E9kes tennival\\u00F3k ({0})\r\n# XTIT: filtered by Account\r\nLIST_FILTER_TITLE_ACCOUNT=Sz\\u0171r\\u00E9s {0} ({1}) sz\\u00E1mla szerint\r\n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TODAY=Ma\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TOMORROW=Holnap\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_YESTERDAY=Tegnap\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_IN_X_DAYS={0} nap m\\u00FAlva\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_X_DAYS_AGO={0} napja\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=\\u00D6n felel\\u0151s {0} tennival\\u00F3\\u00E9rt {1} tennival\\u00F3b\\u00F3l. Csak a saj\\u00E1t tennival\\u00F3i jelennek meg.\r\n# XTIT: Confirmation message to indicate that the task has been completed\r\nLIST_COMPLETE_CONFIRMATION={0} feladat st\\u00E1tusa K\\u00E9szre \\u00E1ll\\u00EDtva\r\n\r\n## Task Details \r\n###############\r\n\r\n# XTIT: task detail view name\r\nMC_DETAILS_TITLE=Feladat r\\u00E9szletei\r\n# XTIT: task detail title\r\nDETAILS_PAGE_TITLE=Feladatok\r\n# XSEL: new task default text\r\nNEW_TASK_INPUT_PLACEHOLDER=\\u00DAj feladat\r\n# XTIT: initial title of a tasks\r\nNEW_TASK_TITLE=N\\u00E9vtelen\r\n# XTIT: page title of a newly created task\r\nNEW_TASK_PAGE_TITLE=\\u00DAj feladat\r\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\r\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE=Tov\\u00E1bb\\u00EDtotta {0}, {1}\r\n\r\n\r\n#Form\r\n\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TITLE=C\\u00EDm\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_NOTE=Megjegyz\\u00E9s\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_DUE_DATE=Esed\\u00E9kess\\u00E9g d\\u00E1tuma\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_ACCOUNT=\\u00DCgyf\\u00E9l\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_CONTACT=T\\u00E1rgyal\\u00F3partner\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIVATE=Priv\\u00E1t\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIORITY=Priorit\\u00E1s\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_STATUS=St\\u00E1tus\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TYPE=T\\u00EDpus\r\n\r\n#Buttons\r\n\r\n# XBUT: Button for deleting the task\r\nDETAILS_BUTTONS_DELETE=Feladat t\\u00F6rl\\u00E9se\r\n# XBUT: Button for deleting the task\r\nDETAILS_FOOTER_BUTTON_DELETE=T\\u00F6rl\\u00E9s\r\n# XBUT: Button for canceling the task\r\nDETAILS_BUTTONS_CANCEL=M\\u00E9gse\r\n# XBUT: Button for creating a new task or saving the existing task\r\nDETAILS_BUTTONS_SAVE=Ment\\u00E9s\r\n# XBUT: Button for assigning the task to another person\r\nDETAILS_BUTTONS_ASSIGNTO=Hozz\\u00E1rendel\\u00E9s a k\\u00F6vetkez\\u0151h\\u00F6z\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP=K\\u00F6vet\\u0151 m\\u0171velet\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_TASK=K\\u00F6vet\\u0151 m\\u0171velet\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_OPPT=K\\u00F6vet\\u0151 opportunity\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_APPT=K\\u00F6vet\\u0151 tal\\u00E1lkoz\\u00F3\r\n\r\n#Message Box\r\n\r\n# XBUT: Title for the message box\r\nDETAILS_MESSAGEBOX_TITLE=T\\u00F6rl\\u00E9s\r\n# YMSG: Text for the message box\r\nDETAILS_MESSAGEBOX_TEXT=Val\\u00F3ban szeretn\\u00E9 t\\u00F6r\\u00F6lni ezt a feladatot?\r\n# XTIT: Confirmation message\r\nDETAILS_DELETE_CONFIRMATION={0} tennival\\u00F3 t\\u00F6rl\\u0151d\\u00F6tt\r\n#XTIT: Warning message\r\nNAVBACK_WARNING_TITLE=Figyelmeztet\\u00E9s\r\n#YMSG: Text for the message box\r\nNAVBACK_WARNING_MESSAGE=A bejegyz\\u00E9sek el fognak veszni; val\\u00F3ban kil\\u00E9p err\\u0151l az oldalr\\u00F3l?\r\n\r\n#Value Help \r\n\r\n# XTIT: Title for Value Help Account\r\nDETAILS_VALUE_HELP_ACC_TITLE=Sz\\u00E1mla kiv\\u00E1laszt\\u00E1sa\r\n# XTIT: Title for Value Help Contact\r\nDETAILS_VALUE_HELP_CON_TITLE=T\\u00E1rgyal\\u00F3partner kiv\\u00E1laszt\\u00E1sa\r\n# YMSG: Filtered by info bar text for contact search popup\r\nDETAILS_VALUE_HELP_FILTERED_BY=Sz\\u0171r\\u00E9s a k\\u00F6vetkez\\u0151 szerint\\:\r\n# XTIT: Account VH item description: city, country\r\nDETAILS_VALUE_HELP_ACC_DESCR={0}, {1}\r\n# XTIT: Contact VH item description: account name, function\r\nDETAILS_VALUE_HELP_CON_DESCR={0}, {1}\r\n\r\n\r\n#Business card Account and Contact\r\n\r\n# XTIT: Title for business card Account\r\nDETAILS_BCARD_ACCOUNT=Fi\\u00F3k \\u00E1ttekint\\u00E9se\r\n# XTIT: Title for business card Contact\r\nDETAILS_BCARD_CONTACT=T\\u00E1rgyal\\u00F3partnerek \\u00E1ttekint\\u00E9se\r\n\r\n#Assign task to\r\n\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TITLE=Hozz\\u00E1rendel\\u00E9s a k\\u00F6vetkez\\u0151h\\u00F6z\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TEXT=Feladat hozz\\u00E1rendel\\u00E9se a k\\u00F6vetkez\\u0151h\\u00F6z\\:\r\n# XTIT: Title for employee search\r\nDETAILS_ASSIGNTO_ASIGNEE=Feladat hozz\\u00E1rendel\\u00E9se dolgoz\\u00F3hoz\r\n# XTIT: Confirmation message\r\nDETAILS_ASSIGNTO_CONFIRMATION=Tennival\\u00F3 hozz\\u00E1 van rendelve a k\\u00F6vetkez\\u0151h\\u00F6z\\: {0}\r\n# XBUT: Button on dialog: ok\r\nDIALOG_ASSIGNTO_BUTTON_OK=Rendben\r\n# XBUT: Button on dialog: cancel\r\nDIALOG_ASSIGNTO_BUTTON_CANCEL=M\\u00E9gse\r\n\r\n# errors\r\n\r\n# YMSG: generic error\r\nGENERIC_ERROR=A rendszer jelenleg nem \\u00E9rhet\\u0151 el. K\\u00E9s\\u0151bb pr\\u00F3b\\u00E1lja meg \\u00FAjra, vagy forduljon a rendszeradminisztr\\u00E1torhoz\r\n# YMSG: error in date\r\nDETAILS_MESSAGETEXT_DATE=A d\\u00E1tum nem \\u00E9rv\\u00E9nyes, vagy nem megfelel\\u0151 a form\\u00E1tuma; haszn\\u00E1lja a beviteli seg\\u00EDts\\u00E9get a d\\u00E1tum megad\\u00E1s\\u00E1hoz\r\n# YMSG: error in account\r\nDETAILS_MESSAGETEXT_ACCOUNT=Haszn\\u00E1lja a beviteli seg\\u00EDts\\u00E9get fi\\u00F3k megad\\u00E1s\\u00E1hoz\r\n# YMSG: error in contact\r\nDETAILS_MESSAGETEXT_CONTACT=Haszn\\u00E1lja a beviteli seg\\u00EDts\\u00E9get t\\u00E1rgyal\\u00F3partner megad\\u00E1s\\u00E1hoz\r\n# YMSG: title for the validation message box after save is clicked\r\nDETAILS_VALIDATION_TITLE=Haszn\\u00E1lja a beviteli seg\\u00EDts\\u00E9get\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=Bet\\u00F6lt\\u00E9s...\r\n\r\n# XTIT: Title for Follow up Dialog\r\nDETAILS_FOLLOWUP_TITLE=K\\u00F6vet\\u0151 m\\u0171velet\r\n# XBUT: Button text for Follow up activities\r\nDETAILS_FOLLOWUP_BUTTON=K\\u00F6vet\\u0151 m\\u0171velet\r\n# XTIT: Title for Confirmation Dialog to save task or not \r\nDETAILS_CONFIRM_TITLE=Visszaigazol\\u00E1s\r\n# YMSG: Prompt use to save existing task or not\r\nDETAILS_FOLLOWUP_MESSAGE=Elmenti a jelenlegi feladatot?\r\n# XBUT: Positive action to save the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_YES=Igen\r\n# XBUT: Positive action to cancel the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_NO=Nem\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT=No follow up types available\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_TASK=Cannot proceed in creating a task since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_OPPT=Cannot proceed in creating an opportunity since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_APPT=Cannot proceed in creating an appointment since no follow up types are maintained\r\n# YMSG: Message shown to end user notifying that the follow up was successful\r\nFOLLOWUP_COMPLETED=Sikeres k\\u00F6vet\\u0151 m\\u0171velet\r\n# YMSG: Message shown once the task is saved during a follow up scenario\r\nFOLLOWUP_TASK_SAVED=K\\u00F6vetkez\\u0151 feladat elmentve\r\n# YMSG: Message shown if a new or existing task is saved\r\nCURRENT_TASK_SAVED=Feladat elmentve\r\n# YMSG: Error message shown to the end user telling that follow up activities cannot be done\r\nFOLLOWUP_ERROR_MSG=Vagy a jelenlegi {0} feladat hib\\u00E1s, vagy nincs karbantartva a k\\u00F6vetkez\\u0151 tranzakci\\u00F3t\\u00EDpus a customizingban\r\n\r\n#XFLD: Transaction Type of a given task\r\nS4_TASK_TYPE=Fajta\\: {0}\r\n#XFLD: Due Date of a given task\r\nS4_TASK_DUEDATE=Esed\\u00E9kess\\u00E9gi d\\u00E1tum\\: {0}\r\n#XFLD: Account of a given task\r\nS4_TASK_ACCOUNT=Fi\\u00F3k\\: {0}\r\n#XFLD: Contact of a given task\r\nS4_TASK_CONTACT=Kapcsolattart\\u00F3\\: {0}\r\n#XFLD: Notes of a given task\r\nS4_TASK_NOTES=Megjegyz\\u00E9sek\r\n#XFLD: Attachments of a given task\r\nS4_TASK_ATTACHMENTS=Mell\\u00E9kletek\\: {0}\r\n#XFLD: Transaction History of a given task\r\nS4_TASK_DOCHISTORY=Tranzakci\\u00F3t\\u00F6rt\\u00E9net\r\n# XBUT: Button for follow up of given task to a task\r\nS4_BUTTONS_FOLLOWUPTOTASK=Feladat\r\n# XBUT: Button for follow up of given task to a opportunity\r\nS4_BUTTONS_FOLLOWUPTOOPPT=Opportunity\r\n# XBUT: Button for follow up of given task to an appointment\r\nS4_BUTTONS_FOLLOWUPTOAPPT=Tal\\u00E1lkoz\\u00F3\r\n# XBUT: Button for editing the task\r\nS4_FOOTER_BUTTON_EDIT=Feldolgoz\\u00E1s\r\n#XFLD: Column Label for the transaction ID of the document\r\nS4_DOCHISTORY_ID=Tranzakci\\u00F3azonos\\u00EDt\\u00F3\r\n#XFLD: Column Label for the transaction type of the document\r\nS4_DOCHISTORY_TTYPE=M\\u0171veletfajta\r\n#XFLD: Column Label for the description of the document\r\nS4_DOCHISTORY_DESC=Le\\u00EDr\\u00E1s\r\n#XFLD: Column Label for the creation date of the document\r\nS4_DOCHISTORY_CREATEDDATE=L\\u00E9trehoz\\u00E1s d\\u00E1tuma\r\n#XFLD: Column Label for the relation type to indicate whether current document precedes/succeeds\r\nS4_DOCHISTORY_RELTYPE=Kapcsolat fajt\\u00E1ja\r\n#XFLD: Label to be shown if no transaction history is available\r\nS4_NO_DOCHISTORY=Nem \\u00E9rhet\\u0151 el tranzakci\\u00F3\r\n# YMSG: Message shown when renaming an attachment of a task is successful\r\nS3_RENAME_ATTACHMENT_SUCCESS=A mell\\u00E9klet sikeresen \\u00E1tnevezve\r\n# YMSG: Message shown when renaming an attachment of a task fails\r\nS3_RENAME_ATTACHMENT_FAILED=A mell\\u00E9klet \\u00E1tnevez\\u00E9se nem siker\\u00FClt\r\n# XBUT: Button for Displaying the Errors\r\nDETAILS_FOOTER_BUTTON_MESSAGE=\\u00DCzenetek\r\n#XTIT: Title of the messages dialog listing the messages with count\r\nS4_MESSAGES_TITLE=\\u00DCzenetek ({0})\r\n# YMSG: Message shown when when the user updates a task in its previous state\r\nS3_412_ERRORMSG=Az adatokat egy m\\u00E1si felhaszn\\u00E1l\\u00F3 m\\u00F3dos\\u00EDtotta; a leg\\u00FAjabb verzi\\u00F3hoz kattintson az OK gombra\r\n#XTIT: Title of dialog indicating an error occurred\r\nS3_412_TITLE=Hiba\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS3_ACCOUNT_CONTACT_NOREL=Csak olyan t\\u00E1rgyal\\u00F3partnerek n\\u00E9vjegyk\\u00E1rty\\u00E1it l\\u00E1thatja, akik hozz\\u00E1 vannak rendelve ehhez a fi\\u00F3khoz\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS4_ACCOUNT_CONTACT_NOREL=Csak olyan t\\u00E1rgyal\\u00F3partnerek n\\u00E9vjegyk\\u00E1rty\\u00E1it l\\u00E1thatja, akik hozz\\u00E1 vannak rendelve ehhez a fi\\u00F3khoz\r\n',
	"cus/crm/mytasks/i18n/i18n_it.properties":'\r\n\r\n\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n# XFLD: No Tasks found text\r\nSEARCH_LIST_NODATA_GENERIC=Nessun risultato trovato\r\n\r\n## Task List \r\n############\r\n\r\n# XTIT: Shell title\r\nSHELL_TITLE=Tasks\r\n# XTIT: Task list title\r\nLIST_PAGE_TITLE=Tasks\r\n# XTIT: Task list title with number of tasks\r\nLIST_PAGE_TITLE_WITH_NUMBER=Task aperti ({0})\r\n# XTIT: Task list title wname for the add button\r\nLIST_ADD=Aggiungi\r\n# XTIT: Application name\r\nMASTER_TITLE=I miei task\r\n# XMSG: Busy text\r\nMASTER_BUSY_TEXT=Caricamento task in corso...\r\n# XMSG: Busy text\r\nMASTER_SEARCH_PLACEHOLDER=Cerca...\r\n# XTOL: Search tool tip \r\nMASTER_SEARCH_TOOLTIP=Cerca tasks\r\n#XTIT: This is the title for the Process Type section\r\nPROCESS_TYPE=Seleziona tipo di transazione\r\n\r\n\r\n\r\n#Filters\r\n\r\n# XBUT: Filter Button for showing all open tasks\r\nLIST_FILTER_ALL_OPEN=Tutti aperti\r\n# XBUT: Filter Button for showing all tasks that are due today\r\nLIST_FILTER_DUE_TODAY=In scadenza oggi\r\n# XBUT: Filter Button for showing all tasks that are due this week\r\nLIST_FILTER_DUE_THIS_WEEK=In scadenza questa settimana\r\n# XBUT: Filter Button for showing all completed tasks\r\nLIST_FILTER_COMPLETED=Completato\r\n\r\n# Filter Bar \r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_BAR_COMPLETED=Filtrato in base ai task completati\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_TODAY=Filtrato in base ai task in scadenza oggi\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_THIS_WEEK=Filtrato in base ai task in scadenza questa settimana\r\n# XTIT: filtered by Account\r\nLIST_FILTER_BAR_ACCOUNT=Filtrato in base a cliente {0}\r\n\r\n# Filter Title\r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_TITLE_COMPLETED=Task completati ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_TODAY=Task in scadenza oggi ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_THIS_WEEK=Task in scadenza questa settimana ({0})\r\n# XTIT: filtered by Account\r\nLIST_FILTER_TITLE_ACCOUNT=Filtrato in base a cliente {0} ({1})\r\n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TODAY=Oggi\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TOMORROW=Domani\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_YESTERDAY=Ieri\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_IN_X_DAYS=Tra {0} giorni\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_X_DAYS_AGO={0} giorni fa\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Sei responsabile di {0} task su un totale di {1}. Vengono visualizzati solo i tuoi task.\r\n# XTIT: Confirmation message to indicate that the task has been completed\r\nLIST_COMPLETE_CONFIRMATION=Il task {0} \\u00E8 stato impostato su Completato\r\n\r\n## Task Details \r\n###############\r\n\r\n# XTIT: task detail view name\r\nMC_DETAILS_TITLE=Dettagli task\r\n# XTIT: task detail title\r\nDETAILS_PAGE_TITLE=Tasks\r\n# XSEL: new task default text\r\nNEW_TASK_INPUT_PLACEHOLDER=Nuovo task\r\n# XTIT: initial title of a tasks\r\nNEW_TASK_TITLE=Senza titolo\r\n# XTIT: page title of a newly created task\r\nNEW_TASK_PAGE_TITLE=Nuovo task\r\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\r\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE=Inoltrato da {0}, {1}\r\n\r\n\r\n#Form\r\n\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TITLE=Titolo\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_NOTE=Nota\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_DUE_DATE=Data di scadenza\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_ACCOUNT=Cliente\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_CONTACT=Contatto\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIVATE=Privato\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIORITY=Priorit\\u00E0\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_STATUS=Stato\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TYPE=Tipo\r\n\r\n#Buttons\r\n\r\n# XBUT: Button for deleting the task\r\nDETAILS_BUTTONS_DELETE=Elimina task\r\n# XBUT: Button for deleting the task\r\nDETAILS_FOOTER_BUTTON_DELETE=Elimina\r\n# XBUT: Button for canceling the task\r\nDETAILS_BUTTONS_CANCEL=Annulla\r\n# XBUT: Button for creating a new task or saving the existing task\r\nDETAILS_BUTTONS_SAVE=Salva\r\n# XBUT: Button for assigning the task to another person\r\nDETAILS_BUTTONS_ASSIGNTO=Attribuisci a\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP=Task successivo\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_TASK=Task successivo\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_OPPT=Opportunit\\u00E0 successiva\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_APPT=Appuntamento successivo\r\n\r\n#Message Box\r\n\r\n# XBUT: Title for the message box\r\nDETAILS_MESSAGEBOX_TITLE=Elimina\r\n# YMSG: Text for the message box\r\nDETAILS_MESSAGEBOX_TEXT=Confermi l\'eliminazione del task?\r\n# XTIT: Confirmation message\r\nDETAILS_DELETE_CONFIRMATION=Task {0} eliminato\r\n#XTIT: Warning message\r\nNAVBACK_WARNING_TITLE=Avvertimento\r\n#YMSG: Text for the message box\r\nNAVBACK_WARNING_MESSAGE=I tuoi inserimenti andranno persi; confermi l\'uscita da questa pagina?\r\n\r\n#Value Help \r\n\r\n# XTIT: Title for Value Help Account\r\nDETAILS_VALUE_HELP_ACC_TITLE=Seleziona cliente\r\n# XTIT: Title for Value Help Contact\r\nDETAILS_VALUE_HELP_CON_TITLE=Seleziona contatto\r\n# YMSG: Filtered by info bar text for contact search popup\r\nDETAILS_VALUE_HELP_FILTERED_BY=Filtrato in base a\r\n# XTIT: Account VH item description: city, country\r\nDETAILS_VALUE_HELP_ACC_DESCR={0}, {1}\r\n# XTIT: Contact VH item description: account name, function\r\nDETAILS_VALUE_HELP_CON_DESCR={0}, {1}\r\n\r\n\r\n#Business card Account and Contact\r\n\r\n# XTIT: Title for business card Account\r\nDETAILS_BCARD_ACCOUNT=Riepilogo cliente\r\n# XTIT: Title for business card Contact\r\nDETAILS_BCARD_CONTACT=Riepilogo contatto\r\n\r\n#Assign task to\r\n\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TITLE=Attribuisci a\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TEXT=Attribuisci task a\\:\r\n# XTIT: Title for employee search\r\nDETAILS_ASSIGNTO_ASIGNEE=Assegna task al dipendente\r\n# XTIT: Confirmation message\r\nDETAILS_ASSIGNTO_CONFIRMATION=Task assegnato a {0}\r\n# XBUT: Button on dialog: ok\r\nDIALOG_ASSIGNTO_BUTTON_OK=OK\r\n# XBUT: Button on dialog: cancel\r\nDIALOG_ASSIGNTO_BUTTON_CANCEL=Annulla\r\n\r\n# errors\r\n\r\n# YMSG: generic error\r\nGENERIC_ERROR=Sistema attualmente non disponibile; riprova in seguito o contatta l\'amministratore di sistema\r\n# YMSG: error in date\r\nDETAILS_MESSAGETEXT_DATE=Data non valida o non nel formato corretto; utilizza l\'help valori per inserire la data\r\n# YMSG: error in account\r\nDETAILS_MESSAGETEXT_ACCOUNT=Utilizza l\'help valori per inserire un cliente\r\n# YMSG: error in contact\r\nDETAILS_MESSAGETEXT_CONTACT=Utilizza l\'help valori per inserire un contatto\r\n# YMSG: title for the validation message box after save is clicked\r\nDETAILS_VALIDATION_TITLE=Utilizza l\'help valori\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=In caricamento...\r\n\r\n# XTIT: Title for Follow up Dialog\r\nDETAILS_FOLLOWUP_TITLE=Task successivo\r\n# XBUT: Button text for Follow up activities\r\nDETAILS_FOLLOWUP_BUTTON=Task successivo\r\n# XTIT: Title for Confirmation Dialog to save task or not \r\nDETAILS_CONFIRM_TITLE=Conferma\r\n# YMSG: Prompt use to save existing task or not\r\nDETAILS_FOLLOWUP_MESSAGE=Salvare il task attuale?\r\n# XBUT: Positive action to save the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_YES=S\\u00EC\r\n# XBUT: Positive action to cancel the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_NO=No\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT=No follow up types available\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_TASK=Cannot proceed in creating a task since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_OPPT=Cannot proceed in creating an opportunity since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_APPT=Cannot proceed in creating an appointment since no follow up types are maintained\r\n# YMSG: Message shown to end user notifying that the follow up was successful\r\nFOLLOWUP_COMPLETED=Operazione successiva riuscita\r\n# YMSG: Message shown once the task is saved during a follow up scenario\r\nFOLLOWUP_TASK_SAVED=Task successivo salvato\r\n# YMSG: Message shown if a new or existing task is saved\r\nCURRENT_TASK_SAVED=Task salvato\r\n# YMSG: Error message shown to the end user telling that follow up activities cannot be done\r\nFOLLOWUP_ERROR_MSG=Il task attuale {0} presenta degli errori o nel customizing non sono aggiornati tipi di transazione successivi\r\n\r\n#XFLD: Transaction Type of a given task\r\nS4_TASK_TYPE=Tipo\\: {0}\r\n#XFLD: Due Date of a given task\r\nS4_TASK_DUEDATE=Scadenza\\: {0}\r\n#XFLD: Account of a given task\r\nS4_TASK_ACCOUNT=Cliente\\: {0}\r\n#XFLD: Contact of a given task\r\nS4_TASK_CONTACT=Contatto\\: {0}\r\n#XFLD: Notes of a given task\r\nS4_TASK_NOTES=Note\r\n#XFLD: Attachments of a given task\r\nS4_TASK_ATTACHMENTS=Allegati\\: {0}\r\n#XFLD: Transaction History of a given task\r\nS4_TASK_DOCHISTORY=Storico transazioni\r\n# XBUT: Button for follow up of given task to a task\r\nS4_BUTTONS_FOLLOWUPTOTASK=Task\r\n# XBUT: Button for follow up of given task to a opportunity\r\nS4_BUTTONS_FOLLOWUPTOOPPT=Opportunit\\u00E0\r\n# XBUT: Button for follow up of given task to an appointment\r\nS4_BUTTONS_FOLLOWUPTOAPPT=Appuntamento\r\n# XBUT: Button for editing the task\r\nS4_FOOTER_BUTTON_EDIT=Elabora\r\n#XFLD: Column Label for the transaction ID of the document\r\nS4_DOCHISTORY_ID=ID transazione\r\n#XFLD: Column Label for the transaction type of the document\r\nS4_DOCHISTORY_TTYPE=Tipo di transazione\r\n#XFLD: Column Label for the description of the document\r\nS4_DOCHISTORY_DESC=Descrizione\r\n#XFLD: Column Label for the creation date of the document\r\nS4_DOCHISTORY_CREATEDDATE=Data creazione\r\n#XFLD: Column Label for the relation type to indicate whether current document precedes/succeeds\r\nS4_DOCHISTORY_RELTYPE=Tipo di relazione\r\n#XFLD: Label to be shown if no transaction history is available\r\nS4_NO_DOCHISTORY=Nessuna transazione disponibile\r\n# YMSG: Message shown when renaming an attachment of a task is successful\r\nS3_RENAME_ATTACHMENT_SUCCESS=Allegato ridenominato correttamente\r\n# YMSG: Message shown when renaming an attachment of a task fails\r\nS3_RENAME_ATTACHMENT_FAILED=Allegato non ridenominato\r\n# XBUT: Button for Displaying the Errors\r\nDETAILS_FOOTER_BUTTON_MESSAGE=Messaggi\r\n#XTIT: Title of the messages dialog listing the messages with count\r\nS4_MESSAGES_TITLE=Messaggi ({0})\r\n# YMSG: Message shown when when the user updates a task in its previous state\r\nS3_412_ERRORMSG=Dati modificati da un altro utente; fai clic su OK per l\'ultima versione\r\n#XTIT: Title of dialog indicating an error occurred\r\nS3_412_TITLE=Errore\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS3_ACCOUNT_CONTACT_NOREL=Puoi visualizzare solo biglietti da visita di contatti attribuiti a questo cliente\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS4_ACCOUNT_CONTACT_NOREL=Puoi visualizzare solo biglietti da visita di contatti attribuiti a questo cliente\r\n',
	"cus/crm/mytasks/i18n/i18n_iw.properties":'\r\n\r\n\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n# XFLD: No Tasks found text\r\nSEARCH_LIST_NODATA_GENERIC=\\u05DC\\u05D0 \\u05E0\\u05DE\\u05E6\\u05D0\\u05D5 \\u05EA\\u05D5\\u05E6\\u05D0\\u05D5\\u05EA\r\n\r\n## Task List \r\n############\r\n\r\n# XTIT: Shell title\r\nSHELL_TITLE=\\u05DE\\u05E9\\u05D9\\u05DE\\u05D5\\u05EA\r\n# XTIT: Task list title\r\nLIST_PAGE_TITLE=\\u05DE\\u05E9\\u05D9\\u05DE\\u05D5\\u05EA\r\n# XTIT: Task list title with number of tasks\r\nLIST_PAGE_TITLE_WITH_NUMBER=\\u05DE\\u05E9\\u05D9\\u05DE\\u05D5\\u05EA \\u05E4\\u05EA\\u05D5\\u05D7\\u05D5\\u05EA ({0})\r\n# XTIT: Task list title wname for the add button\r\nLIST_ADD=\\u05D4\\u05D5\\u05E1\\u05E3\r\n# XTIT: Application name\r\nMASTER_TITLE=\\u05D4\\u05DE\\u05E9\\u05D9\\u05DE\\u05D5\\u05EA \\u05E9\\u05DC\\u05D9\r\n# XMSG: Busy text\r\nMASTER_BUSY_TEXT=\\u05D8\\u05D5\\u05E2\\u05DF \\u05DE\\u05E9\\u05D9\\u05DE\\u05D5\\u05EA...\r\n# XMSG: Busy text\r\nMASTER_SEARCH_PLACEHOLDER=\\u05D7\\u05E4\\u05E9...\r\n# XTOL: Search tool tip \r\nMASTER_SEARCH_TOOLTIP=\\u05D7\\u05E4\\u05E9 \\u05D0\\u05D7\\u05E8 \\u05DE\\u05E9\\u05D9\\u05DE\\u05D5\\u05EA\r\n#XTIT: This is the title for the Process Type section\r\nPROCESS_TYPE=\\u05D1\\u05D7\\u05E8 \\u05E1\\u05D5\\u05D2 \\u05EA\\u05E0\\u05D5\\u05E2\\u05D4\r\n\r\n\r\n\r\n#Filters\r\n\r\n# XBUT: Filter Button for showing all open tasks\r\nLIST_FILTER_ALL_OPEN=\\u05E4\\u05EA\\u05D5\\u05D7\\u05D5\\u05EA\r\n# XBUT: Filter Button for showing all tasks that are due today\r\nLIST_FILTER_DUE_TODAY=\\u05DC\\u05D1\\u05D9\\u05E6\\u05D5\\u05E2 \\u05D4\\u05D9\\u05D5\\u05DD\r\n# XBUT: Filter Button for showing all tasks that are due this week\r\nLIST_FILTER_DUE_THIS_WEEK=\\u05DC\\u05D1\\u05D9\\u05E6\\u05D5\\u05E2 \\u05D4\\u05E9\\u05D1\\u05D5\\u05E2\r\n# XBUT: Filter Button for showing all completed tasks\r\nLIST_FILTER_COMPLETED=\\u05D4\\u05D5\\u05E9\\u05DC\\u05DD\r\n\r\n# Filter Bar \r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_BAR_COMPLETED=\\u05E1\\u05D5\\u05E0\\u05DF \\u05DC\\u05E4\\u05D9 \\u05DE\\u05E9\\u05D9\\u05DE\\u05D5\\u05EA \\u05E9\\u05D4\\u05D5\\u05E9\\u05DC\\u05DE\\u05D5\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_TODAY=\\u05E1\\u05D5\\u05E0\\u05DF \\u05DC\\u05E4\\u05D9 \\u05DE\\u05E9\\u05D9\\u05DE\\u05D5\\u05EA \\u05DC\\u05D1\\u05D9\\u05E6\\u05D5\\u05E2 \\u05D4\\u05D9\\u05D5\\u05DD\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_THIS_WEEK=\\u05E1\\u05D5\\u05E0\\u05DF \\u05DC\\u05E4\\u05D9 \\u05DE\\u05E9\\u05D9\\u05DE\\u05D5\\u05EA \\u05DC\\u05D1\\u05D9\\u05E6\\u05D5\\u05E2 \\u05D4\\u05E9\\u05D1\\u05D5\\u05E2\r\n# XTIT: filtered by Account\r\nLIST_FILTER_BAR_ACCOUNT=\\u05DE\\u05E1\\u05D5\\u05E0\\u05DF \\u05DC\\u05E4\\u05D9 \\u05DC\\u05E7\\u05D5\\u05D7 {0}\r\n\r\n# Filter Title\r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_TITLE_COMPLETED=\\u05DE\\u05E9\\u05D9\\u05DE\\u05D5\\u05EA \\u05E9\\u05D4\\u05D5\\u05E9\\u05DC\\u05DE\\u05D5 ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_TODAY=\\u05DE\\u05E9\\u05D9\\u05DE\\u05D5\\u05EA \\u05DC\\u05D1\\u05D9\\u05E6\\u05D5\\u05E2 \\u05D4\\u05D9\\u05D5\\u05DD ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_THIS_WEEK=\\u05DE\\u05E9\\u05D9\\u05DE\\u05D5\\u05EA \\u05DC\\u05D1\\u05D9\\u05E6\\u05D5\\u05E2 \\u05D4\\u05E9\\u05D1\\u05D5\\u05E2 ({0})\r\n# XTIT: filtered by Account\r\nLIST_FILTER_TITLE_ACCOUNT=\\u05DE\\u05E1\\u05D5\\u05E0\\u05DF \\u05DC\\u05E4\\u05D9 \\u05DC\\u05E7\\u05D5\\u05D7 {0} ({1})\r\n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TODAY=\\u05D4\\u05D9\\u05D5\\u05DD\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TOMORROW=\\u05DE\\u05D7\\u05E8\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_YESTERDAY=\\u05D0\\u05EA\\u05DE\\u05D5\\u05DC\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_IN_X_DAYS=\\u05EA\\u05D5\\u05DA {0} \\u05D9\\u05DE\\u05D9\\u05DD\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_X_DAYS_AGO=\\u05DC\\u05E4\\u05E0\\u05D9 {0} \\u05D9\\u05DE\\u05D9\\u05DD\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=\\u05D0\\u05EA\\u05D4 \\u05D0\\u05D7\\u05E8\\u05D0\\u05D9 \\u05DC-{0} \\u05DE\\u05EA\\u05D5\\u05DA {1} \\u05DE\\u05E9\\u05D9\\u05DE\\u05D5\\u05EA. \\u05E8\\u05E7 \\u05D4\\u05DE\\u05E9\\u05D9\\u05DE\\u05D5\\u05EA \\u05E9\\u05DC\\u05DA \\u05DE\\u05D5\\u05E6\\u05D2\\u05D5\\u05EA.\r\n# XTIT: Confirmation message to indicate that the task has been completed\r\nLIST_COMPLETE_CONFIRMATION=\\u05DE\\u05E9\\u05D9\\u05DE\\u05D4 {0} \\u05E0\\u05E7\\u05D1\\u05E2\\u05D4 \\u05DB\'\'\\u05D4\\u05D5\\u05E9\\u05DC\\u05DE\\u05D4\'\'\r\n\r\n## Task Details \r\n###############\r\n\r\n# XTIT: task detail view name\r\nMC_DETAILS_TITLE=\\u05E4\\u05E8\\u05D8\\u05D9 \\u05DE\\u05E9\\u05D9\\u05DE\\u05D4\r\n# XTIT: task detail title\r\nDETAILS_PAGE_TITLE=\\u05DE\\u05E9\\u05D9\\u05DE\\u05D5\\u05EA\r\n# XSEL: new task default text\r\nNEW_TASK_INPUT_PLACEHOLDER=\\u05DE\\u05E9\\u05D9\\u05DE\\u05D4 \\u05D7\\u05D3\\u05E9\\u05D4\r\n# XTIT: initial title of a tasks\r\nNEW_TASK_TITLE=\\u05DC\\u05DC\\u05D0 \\u05DB\\u05D5\\u05EA\\u05E8\\u05EA\r\n# XTIT: page title of a newly created task\r\nNEW_TASK_PAGE_TITLE=\\u05DE\\u05E9\\u05D9\\u05DE\\u05D4 \\u05D7\\u05D3\\u05E9\\u05D4\r\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\r\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE=\\u05D4\\u05D5\\u05E2\\u05D1\\u05E8 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 {0}, {1}\r\n\r\n\r\n#Form\r\n\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TITLE=\\u05DB\\u05D5\\u05EA\\u05E8\\u05EA\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_NOTE=\\u05D4\\u05E2\\u05E8\\u05D4\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_DUE_DATE=\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05D9\\u05E2\\u05D3\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_ACCOUNT=\\u05DC\\u05E7\\u05D5\\u05D7\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_CONTACT=\\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIVATE=\\u05E4\\u05E8\\u05D8\\u05D9\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIORITY=\\u05E2\\u05D3\\u05D9\\u05E4\\u05D5\\u05EA\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_STATUS=\\u05E1\\u05D8\\u05D0\\u05D8\\u05D5\\u05E1\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TYPE=\\u05E1\\u05D5\\u05D2\r\n\r\n#Buttons\r\n\r\n# XBUT: Button for deleting the task\r\nDETAILS_BUTTONS_DELETE=\\u05DE\\u05D7\\u05E7 \\u05DE\\u05E9\\u05D9\\u05DE\\u05D4\r\n# XBUT: Button for deleting the task\r\nDETAILS_FOOTER_BUTTON_DELETE=\\u05DE\\u05D7\\u05E7\r\n# XBUT: Button for canceling the task\r\nDETAILS_BUTTONS_CANCEL=\\u05D1\\u05D8\\u05DC\r\n# XBUT: Button for creating a new task or saving the existing task\r\nDETAILS_BUTTONS_SAVE=\\u05E9\\u05DE\\u05D5\\u05E8\r\n# XBUT: Button for assigning the task to another person\r\nDETAILS_BUTTONS_ASSIGNTO=\\u05D4\\u05E7\\u05E6\\u05D4 \\u05D0\\u05DC\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP=\\u05DE\\u05E2\\u05E7\\u05D1\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_TASK=\\u05E2\\u05E7\\u05D5\\u05D1 \\u05D0\\u05D7\\u05E8 \\u05DE\\u05E9\\u05D9\\u05DE\\u05D4\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_OPPT=\\u05E2\\u05E7\\u05D5\\u05D1 \\u05D0\\u05D7\\u05E8 \\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_APPT=\\u05E2\\u05E7\\u05D5\\u05D1 \\u05D0\\u05D7\\u05E8 \\u05E4\\u05D2\\u05D9\\u05E9\\u05D4\r\n\r\n#Message Box\r\n\r\n# XBUT: Title for the message box\r\nDETAILS_MESSAGEBOX_TITLE=\\u05DE\\u05D7\\u05E7\r\n# YMSG: Text for the message box\r\nDETAILS_MESSAGEBOX_TEXT=\\u05D4\\u05D0\\u05DD \\u05DC\\u05DE\\u05D7\\u05D5\\u05E7 \\u05DE\\u05E9\\u05D9\\u05DE\\u05D4 \\u05D6\\u05D5?\r\n# XTIT: Confirmation message\r\nDETAILS_DELETE_CONFIRMATION=\\u05DE\\u05E9\\u05D9\\u05DE\\u05D4 {0} \\u05E0\\u05DE\\u05D7\\u05E7\\u05D4\r\n#XTIT: Warning message\r\nNAVBACK_WARNING_TITLE=\\u05D0\\u05D6\\u05D4\\u05E8\\u05D4\r\n#YMSG: Text for the message box\r\nNAVBACK_WARNING_MESSAGE=\\u05D4\\u05D4\\u05D6\\u05E0\\u05D5\\u05EA \\u05E9\\u05DC\\u05DA \\u05D9\\u05D9\\u05D0\\u05D1\\u05D3\\u05D5; \\u05D4\\u05D0\\u05DD \\u05D0\\u05EA\\u05D4 \\u05D1\\u05D8\\u05D5\\u05D7 \\u05E9\\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05E2\\u05D6\\u05D5\\u05D1 \\u05D3\\u05E3 \\u05D6\\u05D4?\r\n\r\n#Value Help \r\n\r\n# XTIT: Title for Value Help Account\r\nDETAILS_VALUE_HELP_ACC_TITLE=\\u05D1\\u05D7\\u05E8 \\u05DC\\u05E7\\u05D5\\u05D7\r\n# XTIT: Title for Value Help Contact\r\nDETAILS_VALUE_HELP_CON_TITLE=\\u05D1\\u05D7\\u05E8 \\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8\r\n# YMSG: Filtered by info bar text for contact search popup\r\nDETAILS_VALUE_HELP_FILTERED_BY=\\u05E1\\u05D5\\u05E0\\u05DF \\u05DC\\u05E4\\u05D9\r\n# XTIT: Account VH item description: city, country\r\nDETAILS_VALUE_HELP_ACC_DESCR={0}, {1}\r\n# XTIT: Contact VH item description: account name, function\r\nDETAILS_VALUE_HELP_CON_DESCR={0}, {1}\r\n\r\n\r\n#Business card Account and Contact\r\n\r\n# XTIT: Title for business card Account\r\nDETAILS_BCARD_ACCOUNT=\\u05E1\\u05E7\\u05D9\\u05E8\\u05EA \\u05DC\\u05E7\\u05D5\\u05D7\r\n# XTIT: Title for business card Contact\r\nDETAILS_BCARD_CONTACT=\\u05E1\\u05E7\\u05D9\\u05E8\\u05EA \\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8\r\n\r\n#Assign task to\r\n\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TITLE=\\u05D4\\u05E7\\u05E6\\u05D4 \\u05D0\\u05DC\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TEXT=\\u05D4\\u05E7\\u05E6\\u05D4 \\u05DE\\u05E9\\u05D9\\u05DE\\u05D4 \\u05D0\\u05DC\r\n# XTIT: Title for employee search\r\nDETAILS_ASSIGNTO_ASIGNEE=\\u05D4\\u05E7\\u05E6\\u05D4 \\u05DE\\u05E9\\u05D9\\u05DE\\u05D4 \\u05DC\\u05E2\\u05D5\\u05D1\\u05D3\r\n# XTIT: Confirmation message\r\nDETAILS_ASSIGNTO_CONFIRMATION=\\u05DE\\u05E9\\u05D9\\u05DE\\u05D4 \\u05DE\\u05D5\\u05E7\\u05E6\\u05D9\\u05EA \\u05DC-{0}\r\n# XBUT: Button on dialog: ok\r\nDIALOG_ASSIGNTO_BUTTON_OK=OK\r\n# XBUT: Button on dialog: cancel\r\nDIALOG_ASSIGNTO_BUTTON_CANCEL=\\u05D1\\u05D8\\u05DC\r\n\r\n# errors\r\n\r\n# YMSG: generic error\r\nGENERIC_ERROR=\\u05D4\\u05DE\\u05E2\\u05E8\\u05DB\\u05EA \\u05DC\\u05D0 \\u05D6\\u05DE\\u05D9\\u05E0\\u05D4 \\u05DB\\u05E8\\u05D2\\u05E2; \\u05E0\\u05E1\\u05D4 \\u05E9\\u05D5\\u05D1 \\u05DE\\u05D0\\u05D5\\u05D7\\u05E8 \\u05D9\\u05D5\\u05EA\\u05E8 \\u05D0\\u05D5 \\u05E6\\u05D5\\u05E8 \\u05E7\\u05E9\\u05E8 \\u05E2\\u05DD \\u05DE\\u05E0\\u05D4\\u05DC \\u05D4\\u05DE\\u05E2\\u05E8\\u05DB\\u05EA \\u05E9\\u05DC\\u05DA\r\n# YMSG: error in date\r\nDETAILS_MESSAGETEXT_DATE=\\u05D4\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05DC\\u05D0 \\u05EA\\u05E7\\u05E3 \\u05D0\\u05D5 \\u05E9\\u05D0\\u05D9\\u05E0\\u05D5 \\u05D1\\u05E4\\u05D5\\u05E8\\u05DE\\u05D8 \\u05D4\\u05E0\\u05DB\\u05D5\\u05DF; \\u05D4\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D1\\u05E2\\u05D6\\u05E8\\u05EA \\u05D4\\u05E7\\u05DC\\u05D8 \\u05DB\\u05D3\\u05D9 \\u05DC\\u05D4\\u05D6\\u05D9\\u05DF \\u05D0\\u05EA \\u05D4\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA\r\n# YMSG: error in account\r\nDETAILS_MESSAGETEXT_ACCOUNT=\\u05D4\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D1\\u05E2\\u05D6\\u05E8\\u05EA \\u05D4\\u05E7\\u05DC\\u05D8 \\u05DB\\u05D3\\u05D9 \\u05DC\\u05D4\\u05D6\\u05D9\\u05DF \\u05DC\\u05E7\\u05D5\\u05D7\r\n# YMSG: error in contact\r\nDETAILS_MESSAGETEXT_CONTACT=\\u05D4\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D1\\u05E2\\u05D6\\u05E8\\u05EA \\u05D4\\u05E7\\u05DC\\u05D8 \\u05DB\\u05D3\\u05D9 \\u05DC\\u05D4\\u05D6\\u05D9\\u05DF \\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8\r\n# YMSG: title for the validation message box after save is clicked\r\nDETAILS_VALIDATION_TITLE=\\u05D4\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D1\\u05E2\\u05D6\\u05E8\\u05EA \\u05E7\\u05DC\\u05D8\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=\\u05D8\\u05D5\\u05E2\\u05DF...\r\n\r\n# XTIT: Title for Follow up Dialog\r\nDETAILS_FOLLOWUP_TITLE=\\u05DE\\u05E2\\u05E7\\u05D1\r\n# XBUT: Button text for Follow up activities\r\nDETAILS_FOLLOWUP_BUTTON=\\u05DE\\u05E2\\u05E7\\u05D1\r\n# XTIT: Title for Confirmation Dialog to save task or not \r\nDETAILS_CONFIRM_TITLE=\\u05D0\\u05D9\\u05E9\\u05D5\\u05E8\r\n# YMSG: Prompt use to save existing task or not\r\nDETAILS_FOLLOWUP_MESSAGE=\\u05D4\\u05D0\\u05DD \\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05E9\\u05DE\\u05D5\\u05E8 \\u05D0\\u05EA \\u05D4\\u05DE\\u05E9\\u05D9\\u05DE\\u05D4 \\u05D4\\u05E0\\u05D5\\u05DB\\u05D7\\u05D9\\u05EA?\r\n# XBUT: Positive action to save the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_YES=\\u05DB\\u05DF\r\n# XBUT: Positive action to cancel the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_NO=\\u05DC\\u05D0\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT=No follow up types available\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_TASK=Cannot proceed in creating a task since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_OPPT=Cannot proceed in creating an opportunity since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_APPT=Cannot proceed in creating an appointment since no follow up types are maintained\r\n# YMSG: Message shown to end user notifying that the follow up was successful\r\nFOLLOWUP_COMPLETED=\\u05DE\\u05E2\\u05E7\\u05D1 \\u05D1\\u05D5\\u05E6\\u05E2 \\u05D1\\u05D4\\u05E6\\u05DC\\u05D7\\u05D4\r\n# YMSG: Message shown once the task is saved during a follow up scenario\r\nFOLLOWUP_TASK_SAVED=\\u05DE\\u05E9\\u05D9\\u05DE\\u05EA \\u05DE\\u05E2\\u05E7\\u05D1 \\u05E0\\u05E9\\u05DE\\u05E8\\u05D4\r\n# YMSG: Message shown if a new or existing task is saved\r\nCURRENT_TASK_SAVED=\\u05DE\\u05E9\\u05D9\\u05DE\\u05D4 \\u05E0\\u05E9\\u05DE\\u05E8\\u05D4\r\n# YMSG: Error message shown to the end user telling that follow up activities cannot be done\r\nFOLLOWUP_ERROR_MSG=\\u05D9\\u05D9\\u05EA\\u05DB\\u05DF \\u05DB\\u05D9 \\u05D1\\u05DE\\u05E9\\u05D9\\u05DE\\u05D4 \\u05D4\\u05E0\\u05D5\\u05DB\\u05D7\\u05D9\\u05EA {0} \\u05D9\\u05E9 \\u05E9\\u05D2\\u05D9\\u05D0\\u05EA \\u05D0\\u05D5 \\u05E9\\u05DC\\u05D0 \\u05EA\\u05D5\\u05D7\\u05D6\\u05E7\\u05D5 \\u05E1\\u05D5\\u05D2\\u05D9 \\u05EA\\u05E0\\u05D5\\u05E2\\u05D5\\u05EA \\u05DE\\u05E2\\u05E7\\u05D1 \\u05D1\\u05D4\\u05EA\\u05D0\\u05DE\\u05D4 \\u05D0\\u05D9\\u05E9\\u05D9\\u05EA\r\n\r\n#XFLD: Transaction Type of a given task\r\nS4_TASK_TYPE=\\u05E1\\u05D5\\u05D2\\: {0}\r\n#XFLD: Due Date of a given task\r\nS4_TASK_DUEDATE=\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05D9\\u05E2\\u05D3\\: {0}\r\n#XFLD: Account of a given task\r\nS4_TASK_ACCOUNT=\\u05DC\\u05E7\\u05D5\\u05D7\\: {0}\r\n#XFLD: Contact of a given task\r\nS4_TASK_CONTACT=\\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8\\: {0}\r\n#XFLD: Notes of a given task\r\nS4_TASK_NOTES=\\u05D4\\u05E2\\u05E8\\u05D5\\u05EA\r\n#XFLD: Attachments of a given task\r\nS4_TASK_ATTACHMENTS=\\u05E7\\u05D1\\u05E6\\u05D9\\u05DD \\u05DE\\u05E6\\u05D5\\u05E8\\u05E4\\u05D9\\u05DD {0}\r\n#XFLD: Transaction History of a given task\r\nS4_TASK_DOCHISTORY=\\u05D4\\u05D9\\u05E1\\u05D8\\u05D5\\u05E8\\u05D9\\u05D9\\u05EA \\u05EA\\u05E0\\u05D5\\u05E2\\u05D5\\u05EA\r\n# XBUT: Button for follow up of given task to a task\r\nS4_BUTTONS_FOLLOWUPTOTASK=\\u05DE\\u05E9\\u05D9\\u05DE\\u05D4\r\n# XBUT: Button for follow up of given task to a opportunity\r\nS4_BUTTONS_FOLLOWUPTOOPPT=\\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA\r\n# XBUT: Button for follow up of given task to an appointment\r\nS4_BUTTONS_FOLLOWUPTOAPPT=\\u05E4\\u05D2\\u05D9\\u05E9\\u05D4\r\n# XBUT: Button for editing the task\r\nS4_FOOTER_BUTTON_EDIT=\\u05E2\\u05E8\\u05D5\\u05DA\r\n#XFLD: Column Label for the transaction ID of the document\r\nS4_DOCHISTORY_ID=\\u05D6\\u05D9\\u05D4\\u05D5\\u05D9 \\u05EA\\u05E0\\u05D5\\u05E2\\u05D4\r\n#XFLD: Column Label for the transaction type of the document\r\nS4_DOCHISTORY_TTYPE=\\u05E1\\u05D5\\u05D2 \\u05EA\\u05E0\\u05D5\\u05E2\\u05D4\r\n#XFLD: Column Label for the description of the document\r\nS4_DOCHISTORY_DESC=\\u05EA\\u05D9\\u05D0\\u05D5\\u05E8\r\n#XFLD: Column Label for the creation date of the document\r\nS4_DOCHISTORY_CREATEDDATE=\\u05E0\\u05D5\\u05E6\\u05E8 \\u05D1\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA\r\n#XFLD: Column Label for the relation type to indicate whether current document precedes/succeeds\r\nS4_DOCHISTORY_RELTYPE=\\u05E1\\u05D5\\u05D2 \\u05E7\\u05E9\\u05E8\r\n#XFLD: Label to be shown if no transaction history is available\r\nS4_NO_DOCHISTORY=\\u05D0\\u05D9\\u05DF \\u05EA\\u05E0\\u05D5\\u05E2\\u05D5\\u05EA \\u05D6\\u05DE\\u05D9\\u05E0\\u05D5\\u05EA\r\n# YMSG: Message shown when renaming an attachment of a task is successful\r\nS3_RENAME_ATTACHMENT_SUCCESS=\\u05E9\\u05DD \\u05D4\\u05E7\\u05D5\\u05D1\\u05E5 \\u05D4\\u05DE\\u05E6\\u05D5\\u05E8\\u05E3 \\u05E9\\u05D5\\u05E0\\u05D4 \\u05D1\\u05D4\\u05E6\\u05DC\\u05D7\\u05D4\r\n# YMSG: Message shown when renaming an attachment of a task fails\r\nS3_RENAME_ATTACHMENT_FAILED=\\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05D4\\u05D9\\u05D4 \\u05DC\\u05E9\\u05E0\\u05D5\\u05EA \\u05D0\\u05EA \\u05E9\\u05DD \\u05D4\\u05E7\\u05D5\\u05D1\\u05E5 \\u05D4\\u05DE\\u05E6\\u05D5\\u05E8\\u05E3\r\n# XBUT: Button for Displaying the Errors\r\nDETAILS_FOOTER_BUTTON_MESSAGE=\\u05D4\\u05D5\\u05D3\\u05E2\\u05D5\\u05EA\r\n#XTIT: Title of the messages dialog listing the messages with count\r\nS4_MESSAGES_TITLE=\\u05D4\\u05D5\\u05D3\\u05E2\\u05D5\\u05EA ({0})\r\n# YMSG: Message shown when when the user updates a task in its previous state\r\nS3_412_ERRORMSG=\\u05D4\\u05E0\\u05EA\\u05D5\\u05E0\\u05D9\\u05DD \\u05E9\\u05D5\\u05E0\\u05D5 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D0\\u05D7\\u05E8; \\u05DC\\u05D7\\u05E5 OK \\u05D1\\u05E9\\u05D1\\u05D9\\u05DC \\u05D4\\u05D2\\u05E8\\u05E1\\u05D4 \\u05D4\\u05D0\\u05D7\\u05E8\\u05D5\\u05E0\\u05D4\r\n#XTIT: Title of dialog indicating an error occurred\r\nS3_412_TITLE=\\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS3_ACCOUNT_CONTACT_NOREL=\\u05D1\\u05D0\\u05E4\\u05E9\\u05E8\\u05D5\\u05EA\\u05DA \\u05E8\\u05E7 \\u05DC\\u05D4\\u05E6\\u05D9\\u05D2 \\u05DB\\u05E8\\u05D8\\u05D9\\u05E1\\u05D9 \\u05D1\\u05D9\\u05E7\\u05D5\\u05E8 \\u05E9\\u05DC \\u05D0\\u05E0\\u05E9\\u05D9 \\u05E7\\u05E9\\u05E8 \\u05E9\\u05D4\\u05D5\\u05E7\\u05E6\\u05D5 \\u05DC\\u05DC\\u05E7\\u05D5\\u05D7 \\u05D6\\u05D4\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS4_ACCOUNT_CONTACT_NOREL=\\u05D1\\u05D0\\u05E4\\u05E9\\u05E8\\u05D5\\u05EA\\u05DA \\u05E8\\u05E7 \\u05DC\\u05D4\\u05E6\\u05D9\\u05D2 \\u05DB\\u05E8\\u05D8\\u05D9\\u05E1\\u05D9 \\u05D1\\u05D9\\u05E7\\u05D5\\u05E8 \\u05E9\\u05DC \\u05D0\\u05E0\\u05E9\\u05D9 \\u05E7\\u05E9\\u05E8 \\u05E9\\u05D4\\u05D5\\u05E7\\u05E6\\u05D5 \\u05DC\\u05DC\\u05E7\\u05D5\\u05D7 \\u05D6\\u05D4\r\n',
	"cus/crm/mytasks/i18n/i18n_ja.properties":'\r\n\r\n\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n# XFLD: No Tasks found text\r\nSEARCH_LIST_NODATA_GENERIC=\\u7D50\\u679C\\u304C\\u898B\\u3064\\u304B\\u308A\\u307E\\u305B\\u3093\r\n\r\n## Task List \r\n############\r\n\r\n# XTIT: Shell title\r\nSHELL_TITLE=\\u30BF\\u30B9\\u30AF\r\n# XTIT: Task list title\r\nLIST_PAGE_TITLE=\\u30BF\\u30B9\\u30AF\r\n# XTIT: Task list title with number of tasks\r\nLIST_PAGE_TITLE_WITH_NUMBER=\\u672A\\u51E6\\u7406\\u30BF\\u30B9\\u30AF ({0})\r\n# XTIT: Task list title wname for the add button\r\nLIST_ADD=\\u8FFD\\u52A0\r\n# XTIT: Application name\r\nMASTER_TITLE=\\u30BF\\u30B9\\u30AF\r\n# XMSG: Busy text\r\nMASTER_BUSY_TEXT=\\u30BF\\u30B9\\u30AF\\u30ED\\u30FC\\u30C9\\u4E2D...\r\n# XMSG: Busy text\r\nMASTER_SEARCH_PLACEHOLDER=\\u691C\\u7D22...\r\n# XTOL: Search tool tip \r\nMASTER_SEARCH_TOOLTIP=\\u30BF\\u30B9\\u30AF\\u306E\\u691C\\u7D22\r\n#XTIT: This is the title for the Process Type section\r\nPROCESS_TYPE=\\u30C8\\u30E9\\u30F3\\u30B6\\u30AF\\u30B7\\u30E7\\u30F3\\u30BF\\u30A4\\u30D7\\u9078\\u629E\r\n\r\n\r\n\r\n#Filters\r\n\r\n# XBUT: Filter Button for showing all open tasks\r\nLIST_FILTER_ALL_OPEN=\\u5168\\u672A\\u51E6\\u7406\r\n# XBUT: Filter Button for showing all tasks that are due today\r\nLIST_FILTER_DUE_TODAY=\\u672C\\u65E5\\u671F\\u9650\r\n# XBUT: Filter Button for showing all tasks that are due this week\r\nLIST_FILTER_DUE_THIS_WEEK=\\u4ECA\\u9031\\u671F\\u9650\r\n# XBUT: Filter Button for showing all completed tasks\r\nLIST_FILTER_COMPLETED=\\u5B8C\\u4E86\r\n\r\n# Filter Bar \r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_BAR_COMPLETED=\\u5B8C\\u4E86\\u30BF\\u30B9\\u30AF\\u3067\\u30D5\\u30A3\\u30EB\\u30BF\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_TODAY=\\u672C\\u65E5\\u671F\\u9650\\u306E\\u30BF\\u30B9\\u30AF\\u3067\\u30D5\\u30A3\\u30EB\\u30BF\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_THIS_WEEK=\\u4ECA\\u9031\\u671F\\u9650\\u306E\\u30BF\\u30B9\\u30AF\\u3067\\u30D5\\u30A3\\u30EB\\u30BF\r\n# XTIT: filtered by Account\r\nLIST_FILTER_BAR_ACCOUNT=\\u9867\\u5BA2 {0} \\u3067\\u30D5\\u30A3\\u30EB\\u30BF\r\n\r\n# Filter Title\r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_TITLE_COMPLETED=\\u5B8C\\u4E86\\u30BF\\u30B9\\u30AF ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_TODAY=\\u672C\\u65E5\\u671F\\u9650\\u306E\\u30BF\\u30B9\\u30AF ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_THIS_WEEK=\\u4ECA\\u9031\\u671F\\u9650\\u306E\\u30BF\\u30B9\\u30AF ({0})\r\n# XTIT: filtered by Account\r\nLIST_FILTER_TITLE_ACCOUNT=\\u9867\\u5BA2 {0} ({1}) \\u3067\\u30D5\\u30A3\\u30EB\\u30BF\r\n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TODAY=\\u672C\\u65E5\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TOMORROW=\\u660E\\u65E5\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_YESTERDAY=\\u6628\\u65E5\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_IN_X_DAYS={0} \\u65E5\\u5F8C\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_X_DAYS_AGO={0} \\u65E5\\u524D\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS={0}/{1} \\u30BF\\u30B9\\u30AF\\u306E\\u8CAC\\u4EFB\\u8005\\u306B\\u306A\\u3063\\u3066\\u3044\\u307E\\u3059\\u3002 \\u81EA\\u5206\\u306E\\u30BF\\u30B9\\u30AF\\u306E\\u307F\\u304C\\u8868\\u793A\\u3055\\u308C\\u307E\\u3059\\u3002\r\n# XTIT: Confirmation message to indicate that the task has been completed\r\nLIST_COMPLETE_CONFIRMATION=\\u30BF\\u30B9\\u30AF {0} \\u304C\\u5B8C\\u4E86\\u306B\\u8A2D\\u5B9A\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n## Task Details \r\n###############\r\n\r\n# XTIT: task detail view name\r\nMC_DETAILS_TITLE=\\u30BF\\u30B9\\u30AF\\u8A73\\u7D30\r\n# XTIT: task detail title\r\nDETAILS_PAGE_TITLE=\\u30BF\\u30B9\\u30AF\r\n# XSEL: new task default text\r\nNEW_TASK_INPUT_PLACEHOLDER=\\u65B0\\u898F\\u30BF\\u30B9\\u30AF\r\n# XTIT: initial title of a tasks\r\nNEW_TASK_TITLE=\\u7121\\u984C\r\n# XTIT: page title of a newly created task\r\nNEW_TASK_PAGE_TITLE=\\u65B0\\u898F\\u30BF\\u30B9\\u30AF\r\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\r\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE={0} \\u306B\\u3088\\u3063\\u3066 {1} \\u306B\\u8EE2\\u9001\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n\r\n#Form\r\n\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TITLE=\\u30BF\\u30A4\\u30C8\\u30EB\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_NOTE=\\u30E1\\u30E2\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_DUE_DATE=\\u671F\\u65E5\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_ACCOUNT=\\u9867\\u5BA2\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_CONTACT=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIVATE=\\u975E\\u516C\\u958B\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIORITY=\\u512A\\u5148\\u5EA6\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_STATUS=\\u30B9\\u30C6\\u30FC\\u30BF\\u30B9\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TYPE=\\u30BF\\u30A4\\u30D7\r\n\r\n#Buttons\r\n\r\n# XBUT: Button for deleting the task\r\nDETAILS_BUTTONS_DELETE=\\u30BF\\u30B9\\u30AF\\u524A\\u9664\r\n# XBUT: Button for deleting the task\r\nDETAILS_FOOTER_BUTTON_DELETE=\\u524A\\u9664\r\n# XBUT: Button for canceling the task\r\nDETAILS_BUTTONS_CANCEL=\\u4E2D\\u6B62\r\n# XBUT: Button for creating a new task or saving the existing task\r\nDETAILS_BUTTONS_SAVE=\\u4FDD\\u5B58\r\n# XBUT: Button for assigning the task to another person\r\nDETAILS_BUTTONS_ASSIGNTO=\\u5272\\u5F53\\u5148\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP=\\u30D5\\u30A9\\u30ED\\u30FC\\u30A2\\u30C3\\u30D7\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_TASK=\\u30BF\\u30B9\\u30AF\\u30D5\\u30A9\\u30ED\\u30FC\\u30A2\\u30C3\\u30D7\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_OPPT=\\u6848\\u4EF6\\u30D5\\u30A9\\u30ED\\u30FC\\u30A2\\u30C3\\u30D7\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_APPT=\\u4E88\\u5B9A\\u30D5\\u30A9\\u30ED\\u30FC\\u30A2\\u30C3\\u30D7\r\n\r\n#Message Box\r\n\r\n# XBUT: Title for the message box\r\nDETAILS_MESSAGEBOX_TITLE=\\u524A\\u9664\r\n# YMSG: Text for the message box\r\nDETAILS_MESSAGEBOX_TEXT=\\u3053\\u306E\\u30BF\\u30B9\\u30AF\\u3092\\u524A\\u9664\\u3057\\u307E\\u3059\\u304B\\u3002\r\n# XTIT: Confirmation message\r\nDETAILS_DELETE_CONFIRMATION=\\u30BF\\u30B9\\u30AF {0} \\u304C\\u524A\\u9664\\u3055\\u308C\\u307E\\u3057\\u305F\r\n#XTIT: Warning message\r\nNAVBACK_WARNING_TITLE=\\u8B66\\u544A\r\n#YMSG: Text for the message box\r\nNAVBACK_WARNING_MESSAGE=\\u5165\\u529B\\u5185\\u5BB9\\u306F\\u5931\\u308F\\u308C\\u307E\\u3059\\u3002\\u3053\\u306E\\u30DA\\u30FC\\u30B8\\u304B\\u3089\\u79FB\\u52D5\\u3057\\u307E\\u3059\\u304B\\u3002\r\n\r\n#Value Help \r\n\r\n# XTIT: Title for Value Help Account\r\nDETAILS_VALUE_HELP_ACC_TITLE=\\u9867\\u5BA2\\u9078\\u629E\r\n# XTIT: Title for Value Help Contact\r\nDETAILS_VALUE_HELP_CON_TITLE=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\\u9078\\u629E\r\n# YMSG: Filtered by info bar text for contact search popup\r\nDETAILS_VALUE_HELP_FILTERED_BY=\\u30D5\\u30A3\\u30EB\\u30BF\\u57FA\\u6E96\r\n# XTIT: Account VH item description: city, country\r\nDETAILS_VALUE_HELP_ACC_DESCR={0}, {1}\r\n# XTIT: Contact VH item description: account name, function\r\nDETAILS_VALUE_HELP_CON_DESCR={0}, {1}\r\n\r\n\r\n#Business card Account and Contact\r\n\r\n# XTIT: Title for business card Account\r\nDETAILS_BCARD_ACCOUNT=\\u9867\\u5BA2\\u6982\\u8981\r\n# XTIT: Title for business card Contact\r\nDETAILS_BCARD_CONTACT=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\\u6982\\u8981\r\n\r\n#Assign task to\r\n\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TITLE=\\u5272\\u5F53\\u5148\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TEXT=\\u30BF\\u30B9\\u30AF\\u5272\\u5F53\\u5148\r\n# XTIT: Title for employee search\r\nDETAILS_ASSIGNTO_ASIGNEE=\\u30BF\\u30B9\\u30AF\\u5272\\u5F53\\u5148\\u5F93\\u696D\\u54E1\r\n# XTIT: Confirmation message\r\nDETAILS_ASSIGNTO_CONFIRMATION=\\u30BF\\u30B9\\u30AF\\u304C {0} \\u306B\\u5272\\u308A\\u5F53\\u3066\\u3089\\u308C\\u307E\\u3057\\u305F\r\n# XBUT: Button on dialog: ok\r\nDIALOG_ASSIGNTO_BUTTON_OK=OK\r\n# XBUT: Button on dialog: cancel\r\nDIALOG_ASSIGNTO_BUTTON_CANCEL=\\u4E2D\\u6B62\r\n\r\n# errors\r\n\r\n# YMSG: generic error\r\nGENERIC_ERROR=\\u30B7\\u30B9\\u30C6\\u30E0\\u306F\\u73FE\\u5728\\u5229\\u7528\\u3067\\u304D\\u307E\\u305B\\u3093\\u3002\\u5F8C\\u3067\\u518D\\u8A66\\u884C\\u3059\\u308B\\u304B\\u3001\\u30B7\\u30B9\\u30C6\\u30E0\\u7BA1\\u7406\\u8005\\u306B\\u9023\\u7D61\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\r\n# YMSG: error in date\r\nDETAILS_MESSAGETEXT_DATE=\\u65E5\\u4ED8\\u304C\\u6709\\u52B9\\u3067\\u306A\\u3044\\u304B\\u3001\\u66F8\\u5F0F\\u304C\\u4E0D\\u9069\\u5207\\u3067\\u3059\\u3002\\u5165\\u529B\\u30D8\\u30EB\\u30D7\\u3092\\u4F7F\\u7528\\u3057\\u3066\\u65E5\\u4ED8\\u3092\\u5165\\u529B\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\r\n# YMSG: error in account\r\nDETAILS_MESSAGETEXT_ACCOUNT=\\u5165\\u529B\\u30D8\\u30EB\\u30D7\\u3092\\u4F7F\\u7528\\u3057\\u3066\\u9867\\u5BA2\\u3092\\u5165\\u529B\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\r\n# YMSG: error in contact\r\nDETAILS_MESSAGETEXT_CONTACT=\\u5165\\u529B\\u30D8\\u30EB\\u30D7\\u3092\\u4F7F\\u7528\\u3057\\u3066\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\\u3092\\u5165\\u529B\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\r\n# YMSG: title for the validation message box after save is clicked\r\nDETAILS_VALIDATION_TITLE=\\u5165\\u529B\\u30D8\\u30EB\\u30D7\\u3092\\u4F7F\\u7528\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=\\u30ED\\u30FC\\u30C9\\u4E2D...\r\n\r\n# XTIT: Title for Follow up Dialog\r\nDETAILS_FOLLOWUP_TITLE=\\u30D5\\u30A9\\u30ED\\u30FC\\u30A2\\u30C3\\u30D7\r\n# XBUT: Button text for Follow up activities\r\nDETAILS_FOLLOWUP_BUTTON=\\u30D5\\u30A9\\u30ED\\u30FC\\u30A2\\u30C3\\u30D7\r\n# XTIT: Title for Confirmation Dialog to save task or not \r\nDETAILS_CONFIRM_TITLE=\\u78BA\\u8A8D\r\n# YMSG: Prompt use to save existing task or not\r\nDETAILS_FOLLOWUP_MESSAGE=\\u73FE\\u5728\\u306E\\u30BF\\u30B9\\u30AF\\u3092\\u4FDD\\u5B58\\u3057\\u307E\\u3059\\u304B\\u3002\r\n# XBUT: Positive action to save the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_YES=\\u306F\\u3044\r\n# XBUT: Positive action to cancel the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_NO=\\u3044\\u3044\\u3048\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT=No follow up types available\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_TASK=Cannot proceed in creating a task since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_OPPT=Cannot proceed in creating an opportunity since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_APPT=Cannot proceed in creating an appointment since no follow up types are maintained\r\n# YMSG: Message shown to end user notifying that the follow up was successful\r\nFOLLOWUP_COMPLETED=\\u30D5\\u30A9\\u30ED\\u30FC\\u30A2\\u30C3\\u30D7\\u304C\\u6B63\\u5E38\\u7D42\\u4E86\\u3057\\u307E\\u3057\\u305F\r\n# YMSG: Message shown once the task is saved during a follow up scenario\r\nFOLLOWUP_TASK_SAVED=\\u30D5\\u30A9\\u30ED\\u30FC\\u30A2\\u30C3\\u30D7\\u30BF\\u30B9\\u30AF\\u304C\\u4FDD\\u5B58\\u3055\\u308C\\u307E\\u3057\\u305F\r\n# YMSG: Message shown if a new or existing task is saved\r\nCURRENT_TASK_SAVED=\\u30BF\\u30B9\\u30AF\\u304C\\u4FDD\\u5B58\\u3055\\u308C\\u307E\\u3057\\u305F\r\n# YMSG: Error message shown to the end user telling that follow up activities cannot be done\r\nFOLLOWUP_ERROR_MSG=\\u73FE\\u5728\\u306E\\u30BF\\u30B9\\u30AF {0} \\u3067\\u30A8\\u30E9\\u30FC\\u304C\\u767A\\u751F\\u3057\\u3066\\u3044\\u308B\\u304B\\u3001\\u307E\\u305F\\u306F\\u30AB\\u30B9\\u30BF\\u30DE\\u30A4\\u30B8\\u30F3\\u30B0\\u3067\\u30D5\\u30A9\\u30ED\\u30FC\\u30A2\\u30C3\\u30D7\\u30C8\\u30E9\\u30F3\\u30B6\\u30AF\\u30B7\\u30E7\\u30F3\\u30BF\\u30A4\\u30D7\\u304C\\u66F4\\u65B0\\u3055\\u308C\\u3066\\u3044\\u307E\\u305B\\u3093\r\n\r\n#XFLD: Transaction Type of a given task\r\nS4_TASK_TYPE=\\u30BF\\u30A4\\u30D7\\: {0}\r\n#XFLD: Due Date of a given task\r\nS4_TASK_DUEDATE=\\u671F\\u65E5\\:  {0}\r\n#XFLD: Account of a given task\r\nS4_TASK_ACCOUNT=\\u9867\\u5BA2\\: {0}\r\n#XFLD: Contact of a given task\r\nS4_TASK_CONTACT=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\\: {0}\r\n#XFLD: Notes of a given task\r\nS4_TASK_NOTES=\\u30E1\\u30E2\r\n#XFLD: Attachments of a given task\r\nS4_TASK_ATTACHMENTS=\\u6DFB\\u4ED8\\u6587\\u66F8\\: {0}\r\n#XFLD: Transaction History of a given task\r\nS4_TASK_DOCHISTORY=\\u30C8\\u30E9\\u30F3\\u30B6\\u30AF\\u30B7\\u30E7\\u30F3\\u5C65\\u6B74\r\n# XBUT: Button for follow up of given task to a task\r\nS4_BUTTONS_FOLLOWUPTOTASK=\\u30BF\\u30B9\\u30AF\r\n# XBUT: Button for follow up of given task to a opportunity\r\nS4_BUTTONS_FOLLOWUPTOOPPT=\\u6848\\u4EF6\r\n# XBUT: Button for follow up of given task to an appointment\r\nS4_BUTTONS_FOLLOWUPTOAPPT=\\u4E88\\u7D04\r\n# XBUT: Button for editing the task\r\nS4_FOOTER_BUTTON_EDIT=\\u7DE8\\u96C6\r\n#XFLD: Column Label for the transaction ID of the document\r\nS4_DOCHISTORY_ID=\\u30C8\\u30E9\\u30F3\\u30B6\\u30AF\\u30B7\\u30E7\\u30F3 ID\r\n#XFLD: Column Label for the transaction type of the document\r\nS4_DOCHISTORY_TTYPE=\\u30C8\\u30E9\\u30F3\\u30B6\\u30AF\\u30B7\\u30E7\\u30F3\\u30BF\\u30A4\\u30D7\r\n#XFLD: Column Label for the description of the document\r\nS4_DOCHISTORY_DESC=\\u30C6\\u30AD\\u30B9\\u30C8\r\n#XFLD: Column Label for the creation date of the document\r\nS4_DOCHISTORY_CREATEDDATE=\\u767B\\u9332\\u65E5\\u4ED8\r\n#XFLD: Column Label for the relation type to indicate whether current document precedes/succeeds\r\nS4_DOCHISTORY_RELTYPE=\\u30EA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\\u30BF\\u30A4\\u30D7\r\n#XFLD: Label to be shown if no transaction history is available\r\nS4_NO_DOCHISTORY=\\u30C8\\u30E9\\u30F3\\u30B6\\u30AF\\u30B7\\u30E7\\u30F3\\u304C\\u3042\\u308A\\u307E\\u305B\\u3093\r\n# YMSG: Message shown when renaming an attachment of a task is successful\r\nS3_RENAME_ATTACHMENT_SUCCESS=\\u6DFB\\u4ED8\\u6587\\u66F8\\u306E\\u540D\\u79F0\\u304C\\u5909\\u66F4\\u3055\\u308C\\u307E\\u3057\\u305F\r\n# YMSG: Message shown when renaming an attachment of a task fails\r\nS3_RENAME_ATTACHMENT_FAILED=\\u6DFB\\u4ED8\\u6587\\u66F8\\u306E\\u540D\\u79F0\\u3092\\u5909\\u66F4\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n# XBUT: Button for Displaying the Errors\r\nDETAILS_FOOTER_BUTTON_MESSAGE=\\u30E1\\u30C3\\u30BB\\u30FC\\u30B8\r\n#XTIT: Title of the messages dialog listing the messages with count\r\nS4_MESSAGES_TITLE=\\u30E1\\u30C3\\u30BB\\u30FC\\u30B8 ({0})\r\n# YMSG: Message shown when when the user updates a task in its previous state\r\nS3_412_ERRORMSG=\\u30C7\\u30FC\\u30BF\\u306F\\u5225\\u306E\\u30E6\\u30FC\\u30B6\\u306B\\u3088\\u308A\\u5909\\u66F4\\u3055\\u308C\\u3066\\u3044\\u307E\\u3059\\u3002OK \\u3092\\u30AF\\u30EA\\u30C3\\u30AF\\u3057\\u3066\\u6700\\u65B0\\u30D0\\u30FC\\u30B8\\u30E7\\u30F3\\u3092\\u53D6\\u5F97\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\r\n#XTIT: Title of dialog indicating an error occurred\r\nS3_412_TITLE=\\u30A8\\u30E9\\u30FC\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS3_ACCOUNT_CONTACT_NOREL=\\u3053\\u306E\\u9867\\u5BA2\\u306B\\u5272\\u308A\\u5F53\\u3066\\u3089\\u308C\\u3066\\u3044\\u308B\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\\u306E\\u540D\\u523A\\u306E\\u307F\\u8868\\u793A\\u3059\\u308B\\u3053\\u3068\\u304C\\u3067\\u304D\\u307E\\u3059\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS4_ACCOUNT_CONTACT_NOREL=\\u3053\\u306E\\u9867\\u5BA2\\u306B\\u5272\\u308A\\u5F53\\u3066\\u3089\\u308C\\u3066\\u3044\\u308B\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\\u306E\\u540D\\u523A\\u306E\\u307F\\u8868\\u793A\\u3059\\u308B\\u3053\\u3068\\u304C\\u3067\\u304D\\u307E\\u3059\r\n',
	"cus/crm/mytasks/i18n/i18n_no.properties":'\r\n\r\n\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n# XFLD: No Tasks found text\r\nSEARCH_LIST_NODATA_GENERIC=Finner ingen resultater\r\n\r\n## Task List \r\n############\r\n\r\n# XTIT: Shell title\r\nSHELL_TITLE=Oppgaver\r\n# XTIT: Task list title\r\nLIST_PAGE_TITLE=Oppgaver\r\n# XTIT: Task list title with number of tasks\r\nLIST_PAGE_TITLE_WITH_NUMBER=\\u00C5pne oppgaver ({0})\r\n# XTIT: Task list title wname for the add button\r\nLIST_ADD=Tilf\\u00F8y\r\n# XTIT: Application name\r\nMASTER_TITLE=Mine oppgaver\r\n# XMSG: Busy text\r\nMASTER_BUSY_TEXT=Laster oppgaver ...\r\n# XMSG: Busy text\r\nMASTER_SEARCH_PLACEHOLDER=S\\u00F8k...\r\n# XTOL: Search tool tip \r\nMASTER_SEARCH_TOOLTIP=S\\u00F8k etter oppgaver\r\n#XTIT: This is the title for the Process Type section\r\nPROCESS_TYPE=Velg transaksjonstype\r\n\r\n\r\n\r\n#Filters\r\n\r\n# XBUT: Filter Button for showing all open tasks\r\nLIST_FILTER_ALL_OPEN=Alle \\u00E5pne\r\n# XBUT: Filter Button for showing all tasks that are due today\r\nLIST_FILTER_DUE_TODAY=Forfaller i dag\r\n# XBUT: Filter Button for showing all tasks that are due this week\r\nLIST_FILTER_DUE_THIS_WEEK=Forfaller denne uken\r\n# XBUT: Filter Button for showing all completed tasks\r\nLIST_FILTER_COMPLETED=Fullf\\u00F8rt\r\n\r\n# Filter Bar \r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_BAR_COMPLETED=Filtrert etter fullf\\u00F8rte oppgaver\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_TODAY=Filtrert etter oppgaver som forfaller i dag\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_THIS_WEEK=Filtrert etter oppgaver som forfaller denne uken\r\n# XTIT: filtered by Account\r\nLIST_FILTER_BAR_ACCOUNT=Filtrert etter kunde {0}\r\n\r\n# Filter Title\r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_TITLE_COMPLETED=Fullf\\u00F8rte oppgaver ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_TODAY=Oppgaver som forfaller i dag ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_THIS_WEEK=Oppgaver som forfaller denne uken ({0})\r\n# XTIT: filtered by Account\r\nLIST_FILTER_TITLE_ACCOUNT=Filtrert etter kunde {0} ({1})\r\n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TODAY=I dag\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TOMORROW=I morgen\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_YESTERDAY=I g\\u00E5r\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_IN_X_DAYS=Om {0} dager\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_X_DAYS_AGO={0} dager siden\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Du er ansvarlig for {0} av {1} oppgaver. Bare dine oppgaver vises.\r\n# XTIT: Confirmation message to indicate that the task has been completed\r\nLIST_COMPLETE_CONFIRMATION=Oppgave {0} er satt til Fullf\\u00F8rt\r\n\r\n## Task Details \r\n###############\r\n\r\n# XTIT: task detail view name\r\nMC_DETAILS_TITLE=Oppgavedetaljer\r\n# XTIT: task detail title\r\nDETAILS_PAGE_TITLE=Oppgaver\r\n# XSEL: new task default text\r\nNEW_TASK_INPUT_PLACEHOLDER=Ny oppgave\r\n# XTIT: initial title of a tasks\r\nNEW_TASK_TITLE=Uten tittel\r\n# XTIT: page title of a newly created task\r\nNEW_TASK_PAGE_TITLE=Ny oppgave\r\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\r\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE=Videresendt av {0}, {1}\r\n\r\n\r\n#Form\r\n\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TITLE=Tittel\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_NOTE=Merknad\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_DUE_DATE=Forfallsdato\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_ACCOUNT=Kunde\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_CONTACT=Kontakt\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIVATE=Privat\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIORITY=Prioritet\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_STATUS=Status\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TYPE=Type\r\n\r\n#Buttons\r\n\r\n# XBUT: Button for deleting the task\r\nDETAILS_BUTTONS_DELETE=Slett oppgave\r\n# XBUT: Button for deleting the task\r\nDETAILS_FOOTER_BUTTON_DELETE=Slett\r\n# XBUT: Button for canceling the task\r\nDETAILS_BUTTONS_CANCEL=Avbryt\r\n# XBUT: Button for creating a new task or saving the existing task\r\nDETAILS_BUTTONS_SAVE=Lagre\r\n# XBUT: Button for assigning the task to another person\r\nDETAILS_BUTTONS_ASSIGNTO=Tilordne til\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP=Oppf\\u00F8lgingsaktivitet\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_TASK=Oppf\\u00F8lgingsaktivitet - oppgave\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_OPPT=Oppf\\u00F8lgingsaktivitet - mulighet\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_APPT=Oppf\\u00F8lgingsaktivitet - avtale\r\n\r\n#Message Box\r\n\r\n# XBUT: Title for the message box\r\nDETAILS_MESSAGEBOX_TITLE=Slett\r\n# YMSG: Text for the message box\r\nDETAILS_MESSAGEBOX_TEXT=Er du sikker p\\u00E5 at du vil slette oppgaven?\r\n# XTIT: Confirmation message\r\nDETAILS_DELETE_CONFIRMATION=Oppgave {0} er slettet\r\n#XTIT: Warning message\r\nNAVBACK_WARNING_TITLE=Advarsel\r\n#YMSG: Text for the message box\r\nNAVBACK_WARNING_MESSAGE=Du vil miste inndataene - er du sikker p\\u00E5 at du vil forlate denne siden?\r\n\r\n#Value Help \r\n\r\n# XTIT: Title for Value Help Account\r\nDETAILS_VALUE_HELP_ACC_TITLE=Velg kunde\r\n# XTIT: Title for Value Help Contact\r\nDETAILS_VALUE_HELP_CON_TITLE=Velg kontakt\r\n# YMSG: Filtered by info bar text for contact search popup\r\nDETAILS_VALUE_HELP_FILTERED_BY=Filtrert etter\r\n# XTIT: Account VH item description: city, country\r\nDETAILS_VALUE_HELP_ACC_DESCR={0}, {1}\r\n# XTIT: Contact VH item description: account name, function\r\nDETAILS_VALUE_HELP_CON_DESCR={0}, {1}\r\n\r\n\r\n#Business card Account and Contact\r\n\r\n# XTIT: Title for business card Account\r\nDETAILS_BCARD_ACCOUNT=Kundeoversikt\r\n# XTIT: Title for business card Contact\r\nDETAILS_BCARD_CONTACT=Kontaktoversikt\r\n\r\n#Assign task to\r\n\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TITLE=Tilordne til\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TEXT=Tilordne oppgave til\r\n# XTIT: Title for employee search\r\nDETAILS_ASSIGNTO_ASIGNEE=Tilordne oppgave til medarbeider\r\n# XTIT: Confirmation message\r\nDETAILS_ASSIGNTO_CONFIRMATION=Oppgave tilordnet til {0}\r\n# XBUT: Button on dialog: ok\r\nDIALOG_ASSIGNTO_BUTTON_OK=OK\r\n# XBUT: Button on dialog: cancel\r\nDIALOG_ASSIGNTO_BUTTON_CANCEL=Avbryt\r\n\r\n# errors\r\n\r\n# YMSG: generic error\r\nGENERIC_ERROR=Systemet er ikke tilgjengelig for \\u00F8yeblikket. Pr\\u00F8v p\\u00E5 nytt senere eller kontakt systemadministrator.\r\n# YMSG: error in date\r\nDETAILS_MESSAGETEXT_DATE=Dato er ikke gyldig eller har ikke riktig format. Bruk mulige verdier for \\u00E5 oppgi datoen.\r\n# YMSG: error in account\r\nDETAILS_MESSAGETEXT_ACCOUNT=Bruk mulige verdier for \\u00E5 oppgi en kunde\r\n# YMSG: error in contact\r\nDETAILS_MESSAGETEXT_CONTACT=Bruk mulige verdier for \\u00E5 oppgi en kontakt\r\n# YMSG: title for the validation message box after save is clicked\r\nDETAILS_VALIDATION_TITLE=Bruk mulige verdier\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=Laster ...\r\n\r\n# XTIT: Title for Follow up Dialog\r\nDETAILS_FOLLOWUP_TITLE=Oppf\\u00F8lgingsaktivitet\r\n# XBUT: Button text for Follow up activities\r\nDETAILS_FOLLOWUP_BUTTON=Oppf\\u00F8lgingsaktivitet\r\n# XTIT: Title for Confirmation Dialog to save task or not \r\nDETAILS_CONFIRM_TITLE=Bekreftelse\r\n# YMSG: Prompt use to save existing task or not\r\nDETAILS_FOLLOWUP_MESSAGE=Vil du lagre aktuell oppgave?\r\n# XBUT: Positive action to save the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_YES=Ja\r\n# XBUT: Positive action to cancel the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_NO=Nei\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT=No follow up types available\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_TASK=Cannot proceed in creating a task since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_OPPT=Cannot proceed in creating an opportunity since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_APPT=Cannot proceed in creating an appointment since no follow up types are maintained\r\n# YMSG: Message shown to end user notifying that the follow up was successful\r\nFOLLOWUP_COMPLETED=Oppf\\u00F8lgingsaktivitet utf\\u00F8rt\r\n# YMSG: Message shown once the task is saved during a follow up scenario\r\nFOLLOWUP_TASK_SAVED=Oppf\\u00F8lgingsoppgave er lagret\r\n# YMSG: Message shown if a new or existing task is saved\r\nCURRENT_TASK_SAVED=Oppgave lagret\r\n# YMSG: Error message shown to the end user telling that follow up activities cannot be done\r\nFOLLOWUP_ERROR_MSG=Enten har den aktuelle oppgaven {0} feil, eller ingen p\\u00E5f\\u00F8lgende transaksjonstyper er vedlikeholdt i systemtilpasningen.\r\n\r\n#XFLD: Transaction Type of a given task\r\nS4_TASK_TYPE=Type\\: {0}\r\n#XFLD: Due Date of a given task\r\nS4_TASK_DUEDATE=Forfallsdato\\: {0}\r\n#XFLD: Account of a given task\r\nS4_TASK_ACCOUNT=Kunde\\: {0}\r\n#XFLD: Contact of a given task\r\nS4_TASK_CONTACT=Kontakt\\: {0}\r\n#XFLD: Notes of a given task\r\nS4_TASK_NOTES=Merknader\r\n#XFLD: Attachments of a given task\r\nS4_TASK_ATTACHMENTS=Vedlegg\\: {0}\r\n#XFLD: Transaction History of a given task\r\nS4_TASK_DOCHISTORY=Transaksjonshistorikk\r\n# XBUT: Button for follow up of given task to a task\r\nS4_BUTTONS_FOLLOWUPTOTASK=Oppgave\r\n# XBUT: Button for follow up of given task to a opportunity\r\nS4_BUTTONS_FOLLOWUPTOOPPT=Salgsmulighet\r\n# XBUT: Button for follow up of given task to an appointment\r\nS4_BUTTONS_FOLLOWUPTOAPPT=Avtale\r\n# XBUT: Button for editing the task\r\nS4_FOOTER_BUTTON_EDIT=Rediger\r\n#XFLD: Column Label for the transaction ID of the document\r\nS4_DOCHISTORY_ID=Transaksjons-ID\r\n#XFLD: Column Label for the transaction type of the document\r\nS4_DOCHISTORY_TTYPE=Transaksjonstype\r\n#XFLD: Column Label for the description of the document\r\nS4_DOCHISTORY_DESC=Beskrivelse\r\n#XFLD: Column Label for the creation date of the document\r\nS4_DOCHISTORY_CREATEDDATE=Opprettet den\r\n#XFLD: Column Label for the relation type to indicate whether current document precedes/succeeds\r\nS4_DOCHISTORY_RELTYPE=Relasjonstype\r\n#XFLD: Label to be shown if no transaction history is available\r\nS4_NO_DOCHISTORY=Ingen transaksjoner er tilgjengelige\r\n# YMSG: Message shown when renaming an attachment of a task is successful\r\nS3_RENAME_ATTACHMENT_SUCCESS=Du har endret navn p\\u00E5 vedlegget\r\n# YMSG: Message shown when renaming an attachment of a task fails\r\nS3_RENAME_ATTACHMENT_FAILED=Du kan ikke endre navn p\\u00E5 vedlegget\r\n# XBUT: Button for Displaying the Errors\r\nDETAILS_FOOTER_BUTTON_MESSAGE=Meldinger\r\n#XTIT: Title of the messages dialog listing the messages with count\r\nS4_MESSAGES_TITLE=Meldinger ({0})\r\n# YMSG: Message shown when when the user updates a task in its previous state\r\nS3_412_ERRORMSG=Data er endret av en annen bruker, klikk p\\u00E5 OK for siste versjon\r\n#XTIT: Title of dialog indicating an error occurred\r\nS3_412_TITLE=Feil\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS3_ACCOUNT_CONTACT_NOREL=Du kan bare vise visittkort for kontakter som er tilordnet til denne kunden\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS4_ACCOUNT_CONTACT_NOREL=Du kan bare vise visittkort for kontakter som er tilordnet til denne kunden\r\n',
	"cus/crm/mytasks/i18n/i18n_pl.properties":'\r\n\r\n\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n# XFLD: No Tasks found text\r\nSEARCH_LIST_NODATA_GENERIC=Nie znaleziono wynik\\u00F3w\r\n\r\n## Task List \r\n############\r\n\r\n# XTIT: Shell title\r\nSHELL_TITLE=Zadania\r\n# XTIT: Task list title\r\nLIST_PAGE_TITLE=Zadania\r\n# XTIT: Task list title with number of tasks\r\nLIST_PAGE_TITLE_WITH_NUMBER=Otwarte zadania ({0})\r\n# XTIT: Task list title wname for the add button\r\nLIST_ADD=Dodaj\r\n# XTIT: Application name\r\nMASTER_TITLE=Moje zadania\r\n# XMSG: Busy text\r\nMASTER_BUSY_TEXT=Wczytywanie zada\\u0144...\r\n# XMSG: Busy text\r\nMASTER_SEARCH_PLACEHOLDER=Szukaj...\r\n# XTOL: Search tool tip \r\nMASTER_SEARCH_TOOLTIP=Szukaj zada\\u0144\r\n#XTIT: This is the title for the Process Type section\r\nPROCESS_TYPE=Wybierz typ transakcji\r\n\r\n\r\n\r\n#Filters\r\n\r\n# XBUT: Filter Button for showing all open tasks\r\nLIST_FILTER_ALL_OPEN=Wszystkie otwarte\r\n# XBUT: Filter Button for showing all tasks that are due today\r\nLIST_FILTER_DUE_TODAY=Termin dzisiaj\r\n# XBUT: Filter Button for showing all tasks that are due this week\r\nLIST_FILTER_DUE_THIS_WEEK=Termin w tym tygodniu\r\n# XBUT: Filter Button for showing all completed tasks\r\nLIST_FILTER_COMPLETED=Zako\\u0144czone\r\n\r\n# Filter Bar \r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_BAR_COMPLETED=Filtrowanie wg zako\\u0144czonych zada\\u0144\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_TODAY=Filtrowanie wg zada\\u0144 z terminem dzisiaj\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_THIS_WEEK=Filtrowanie wg zada\\u0144 z terminem w tym tygodniu\r\n# XTIT: filtered by Account\r\nLIST_FILTER_BAR_ACCOUNT=Przefiltrowane wed\\u0142ug klienta {0}\r\n\r\n# Filter Title\r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_TITLE_COMPLETED=Zako\\u0144czone zadania ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_TODAY=Zadania z terminem na dzi\\u015B ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_THIS_WEEK=Zadania z terminem w tym tygodniu ({0})\r\n# XTIT: filtered by Account\r\nLIST_FILTER_TITLE_ACCOUNT=Przefiltrowane wed\\u0142ug klienta {0} ({1})\r\n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TODAY=Dzisiaj\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TOMORROW=Jutro\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_YESTERDAY=Wczoraj\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_IN_X_DAYS=Za {0} dni\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_X_DAYS_AGO={0} dni temu\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Jeste\\u015B odpowiedzialny za {0} z {1} zada\\u0144. Wy\\u015Bwietlane s\\u0105 tylko Twoje zadania.\r\n# XTIT: Confirmation message to indicate that the task has been completed\r\nLIST_COMPLETE_CONFIRMATION=Zadanie {0} zosta\\u0142o ustawione jako uko\\u0144czone\r\n\r\n## Task Details \r\n###############\r\n\r\n# XTIT: task detail view name\r\nMC_DETAILS_TITLE=Szczeg\\u00F3\\u0142y zadania\r\n# XTIT: task detail title\r\nDETAILS_PAGE_TITLE=Zadania\r\n# XSEL: new task default text\r\nNEW_TASK_INPUT_PLACEHOLDER=Nowe zadanie\r\n# XTIT: initial title of a tasks\r\nNEW_TASK_TITLE=Bez nazwy\r\n# XTIT: page title of a newly created task\r\nNEW_TASK_PAGE_TITLE=Nowe zadanie\r\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\r\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE=Przekazane przez {0}, {1}\r\n\r\n\r\n#Form\r\n\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TITLE=Tytu\\u0142\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_NOTE=Notatka\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_DUE_DATE=Termin\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_ACCOUNT=Klient\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_CONTACT=Kontakt\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIVATE=Prywatne\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIORITY=Priorytet\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_STATUS=Status\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TYPE=Rodzaj\r\n\r\n#Buttons\r\n\r\n# XBUT: Button for deleting the task\r\nDETAILS_BUTTONS_DELETE=Usu\\u0144 zadanie\r\n# XBUT: Button for deleting the task\r\nDETAILS_FOOTER_BUTTON_DELETE=Usu\\u0144\r\n# XBUT: Button for canceling the task\r\nDETAILS_BUTTONS_CANCEL=Anuluj\r\n# XBUT: Button for creating a new task or saving the existing task\r\nDETAILS_BUTTONS_SAVE=Zapisz\r\n# XBUT: Button for assigning the task to another person\r\nDETAILS_BUTTONS_ASSIGNTO=Przypisz do\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP=Kolejne dzia\\u0142anie\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_TASK=Kolejne zadanie\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_OPPT=Kolejna szansa\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_APPT=Kolejne spotkanie\r\n\r\n#Message Box\r\n\r\n# XBUT: Title for the message box\r\nDETAILS_MESSAGEBOX_TITLE=Usu\\u0144\r\n# YMSG: Text for the message box\r\nDETAILS_MESSAGEBOX_TEXT=Czy na pewno usun\\u0105\\u0107 to zadanie?\r\n# XTIT: Confirmation message\r\nDETAILS_DELETE_CONFIRMATION=Usuni\\u0119to zadanie {0}\r\n#XTIT: Warning message\r\nNAVBACK_WARNING_TITLE=Ostrze\\u017Cenie\r\n#YMSG: Text for the message box\r\nNAVBACK_WARNING_MESSAGE=Wpisy zostan\\u0105 utracone; czy na pewno chcesz opu\\u015Bci\\u0107 t\\u0119 stron\\u0119\r\n\r\n#Value Help \r\n\r\n# XTIT: Title for Value Help Account\r\nDETAILS_VALUE_HELP_ACC_TITLE=Wybierz klienta\r\n# XTIT: Title for Value Help Contact\r\nDETAILS_VALUE_HELP_CON_TITLE=Wybierz kontakt\r\n# YMSG: Filtered by info bar text for contact search popup\r\nDETAILS_VALUE_HELP_FILTERED_BY=Filtrowanie wed\\u0142ug\r\n# XTIT: Account VH item description: city, country\r\nDETAILS_VALUE_HELP_ACC_DESCR={0}, {1}\r\n# XTIT: Contact VH item description: account name, function\r\nDETAILS_VALUE_HELP_CON_DESCR={0}, {1}\r\n\r\n\r\n#Business card Account and Contact\r\n\r\n# XTIT: Title for business card Account\r\nDETAILS_BCARD_ACCOUNT=Przegl\\u0105d klienta\r\n# XTIT: Title for business card Contact\r\nDETAILS_BCARD_CONTACT=Przegl\\u0105d kontakt\\u00F3w\r\n\r\n#Assign task to\r\n\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TITLE=Przypisz do\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TEXT=Przypisanie zadania do\r\n# XTIT: Title for employee search\r\nDETAILS_ASSIGNTO_ASIGNEE=Przypisywanie zadania do pracownika\r\n# XTIT: Confirmation message\r\nDETAILS_ASSIGNTO_CONFIRMATION=Przypisano zadanie do {0}\r\n# XBUT: Button on dialog: ok\r\nDIALOG_ASSIGNTO_BUTTON_OK=OK\r\n# XBUT: Button on dialog: cancel\r\nDIALOG_ASSIGNTO_BUTTON_CANCEL=Anuluj\r\n\r\n# errors\r\n\r\n# YMSG: generic error\r\nGENERIC_ERROR=System jest obecnie niedost\\u0119pny; spr\\u00F3buj p\\u00F3\\u017Aniej lub skontaktuj si\\u0119 z administratorem systemu\r\n# YMSG: error in date\r\nDETAILS_MESSAGETEXT_DATE=Data jest nieprawid\\u0142owa lub ma nieprawid\\u0142owy format; u\\u017Cyj mo\\u017Cliwych wpis\\u00F3w, aby wprowadzi\\u0107 dat\\u0119\r\n# YMSG: error in account\r\nDETAILS_MESSAGETEXT_ACCOUNT=U\\u017Cyj mo\\u017Cliwych wpis\\u00F3w, aby wprowadzi\\u0107 klienta\r\n# YMSG: error in contact\r\nDETAILS_MESSAGETEXT_CONTACT=U\\u017Cyj mo\\u017Cliwych wpis\\u00F3w, aby wprowadzi\\u0107 kontakt\r\n# YMSG: title for the validation message box after save is clicked\r\nDETAILS_VALIDATION_TITLE=U\\u017Cyj mo\\u017Cliwych wpis\\u00F3w\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=Wczytywanie...\r\n\r\n# XTIT: Title for Follow up Dialog\r\nDETAILS_FOLLOWUP_TITLE=Kolejne dzia\\u0142anie\r\n# XBUT: Button text for Follow up activities\r\nDETAILS_FOLLOWUP_BUTTON=Kolejne dzia\\u0142anie\r\n# XTIT: Title for Confirmation Dialog to save task or not \r\nDETAILS_CONFIRM_TITLE=Potwierdzenie\r\n# YMSG: Prompt use to save existing task or not\r\nDETAILS_FOLLOWUP_MESSAGE=Czy chcesz zapisa\\u0107 bie\\u017C\\u0105ce zadanie?\r\n# XBUT: Positive action to save the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_YES=Tak\r\n# XBUT: Positive action to cancel the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_NO=Nie\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT=No follow up types available\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_TASK=Cannot proceed in creating a task since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_OPPT=Cannot proceed in creating an opportunity since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_APPT=Cannot proceed in creating an appointment since no follow up types are maintained\r\n# YMSG: Message shown to end user notifying that the follow up was successful\r\nFOLLOWUP_COMPLETED=Kolejne dzia\\u0142anie pomy\\u015Blne\r\n# YMSG: Message shown once the task is saved during a follow up scenario\r\nFOLLOWUP_TASK_SAVED=Zapisano kolejne zadanie\r\n# YMSG: Message shown if a new or existing task is saved\r\nCURRENT_TASK_SAVED=Zapisano zadanie\r\n# YMSG: Error message shown to the end user telling that follow up activities cannot be done\r\nFOLLOWUP_ERROR_MSG=Aktualne zadanie {0} zawiera b\\u0142\\u0119dy lub nie opracowano kolejnych typ\\u00F3w transakcji w konfiguracji\r\n\r\n#XFLD: Transaction Type of a given task\r\nS4_TASK_TYPE=Typ\\: {0}\r\n#XFLD: Due Date of a given task\r\nS4_TASK_DUEDATE=Termin\\: {0}\r\n#XFLD: Account of a given task\r\nS4_TASK_ACCOUNT=Klient\\: {0}\r\n#XFLD: Contact of a given task\r\nS4_TASK_CONTACT=Kontakt\\: {0}\r\n#XFLD: Notes of a given task\r\nS4_TASK_NOTES=Notatki\r\n#XFLD: Attachments of a given task\r\nS4_TASK_ATTACHMENTS=Za\\u0142\\u0105czniki\\: {0}\r\n#XFLD: Transaction History of a given task\r\nS4_TASK_DOCHISTORY=Historia operacji\r\n# XBUT: Button for follow up of given task to a task\r\nS4_BUTTONS_FOLLOWUPTOTASK=Zadanie\r\n# XBUT: Button for follow up of given task to a opportunity\r\nS4_BUTTONS_FOLLOWUPTOOPPT=Szansa\r\n# XBUT: Button for follow up of given task to an appointment\r\nS4_BUTTONS_FOLLOWUPTOAPPT=Spotkanie\r\n# XBUT: Button for editing the task\r\nS4_FOOTER_BUTTON_EDIT=Edytuj\r\n#XFLD: Column Label for the transaction ID of the document\r\nS4_DOCHISTORY_ID=ID transakcji\r\n#XFLD: Column Label for the transaction type of the document\r\nS4_DOCHISTORY_TTYPE=Rodzaj operacji\r\n#XFLD: Column Label for the description of the document\r\nS4_DOCHISTORY_DESC=Opis\r\n#XFLD: Column Label for the creation date of the document\r\nS4_DOCHISTORY_CREATEDDATE=Data utworzenia\r\n#XFLD: Column Label for the relation type to indicate whether current document precedes/succeeds\r\nS4_DOCHISTORY_RELTYPE=Typ relacji\r\n#XFLD: Label to be shown if no transaction history is available\r\nS4_NO_DOCHISTORY=Brak dost\\u0119pnych transakcji\r\n# YMSG: Message shown when renaming an attachment of a task is successful\r\nS3_RENAME_ATTACHMENT_SUCCESS=Pomy\\u015Blnie zmieniono nazw\\u0119 za\\u0142\\u0105cznika\r\n# YMSG: Message shown when renaming an attachment of a task fails\r\nS3_RENAME_ATTACHMENT_FAILED=Nie mo\\u017Cna by\\u0142o zmieni\\u0107 nazwy za\\u0142\\u0105cznika\r\n# XBUT: Button for Displaying the Errors\r\nDETAILS_FOOTER_BUTTON_MESSAGE=Komunikaty\r\n#XTIT: Title of the messages dialog listing the messages with count\r\nS4_MESSAGES_TITLE=Komunikaty ({0})\r\n# YMSG: Message shown when when the user updates a task in its previous state\r\nS3_412_ERRORMSG=Dane zosta\\u0142y zmienione przez innego u\\u017Cytkownika; kliknij OK, aby pobra\\u0107 ostatni\\u0105 wersj\\u0119\r\n#XTIT: Title of dialog indicating an error occurred\r\nS3_412_TITLE=B\\u0142\\u0105d\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS3_ACCOUNT_CONTACT_NOREL=Mo\\u017Cesz wy\\u015Bwietla\\u0107 wizyt\\u00F3wki wy\\u0142\\u0105cznie kontakt\\u00F3w przypisanych do tego klienta\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS4_ACCOUNT_CONTACT_NOREL=Mo\\u017Cesz wy\\u015Bwietla\\u0107 wizyt\\u00F3wki wy\\u0142\\u0105cznie kontakt\\u00F3w przypisanych do tego klienta\r\n',
	"cus/crm/mytasks/i18n/i18n_pt.properties":'\r\n\r\n\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n# XFLD: No Tasks found text\r\nSEARCH_LIST_NODATA_GENERIC=Nenhum resultado encontrado\r\n\r\n## Task List \r\n############\r\n\r\n# XTIT: Shell title\r\nSHELL_TITLE=Tarefas\r\n# XTIT: Task list title\r\nLIST_PAGE_TITLE=Tarefas\r\n# XTIT: Task list title with number of tasks\r\nLIST_PAGE_TITLE_WITH_NUMBER=Tarefas pendentes ({0})\r\n# XTIT: Task list title wname for the add button\r\nLIST_ADD=Adicionar\r\n# XTIT: Application name\r\nMASTER_TITLE=Minhas tarefas\r\n# XMSG: Busy text\r\nMASTER_BUSY_TEXT=Carregando tarefas...\r\n# XMSG: Busy text\r\nMASTER_SEARCH_PLACEHOLDER=Procurar...\r\n# XTOL: Search tool tip \r\nMASTER_SEARCH_TOOLTIP=Procurar por tarefas\r\n#XTIT: This is the title for the Process Type section\r\nPROCESS_TYPE=Selecionar tipo de transa\\u00E7\\u00E3o\r\n\r\n\r\n\r\n#Filters\r\n\r\n# XBUT: Filter Button for showing all open tasks\r\nLIST_FILTER_ALL_OPEN=Todas as pendentes\r\n# XBUT: Filter Button for showing all tasks that are due today\r\nLIST_FILTER_DUE_TODAY=Para hoje\r\n# XBUT: Filter Button for showing all tasks that are due this week\r\nLIST_FILTER_DUE_THIS_WEEK=P/essa semana\r\n# XBUT: Filter Button for showing all completed tasks\r\nLIST_FILTER_COMPLETED=Conclu\\u00EDdas\r\n\r\n# Filter Bar \r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_BAR_COMPLETED=Filtrado por tarefas conclu\\u00EDdas\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_TODAY=Filtrado por tarefas para hoje\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_THIS_WEEK=Filtrado por tarefas para essa semana\r\n# XTIT: filtered by Account\r\nLIST_FILTER_BAR_ACCOUNT=Filtrado por conta {0}\r\n\r\n# Filter Title\r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_TITLE_COMPLETED=Tarefas conclu\\u00EDdas ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_TODAY=Tarefas para hoje ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_THIS_WEEK=Tarefas para essa semana ({0})\r\n# XTIT: filtered by Account\r\nLIST_FILTER_TITLE_ACCOUNT=Filtrado por conta {0} ({1})\r\n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TODAY=Hoje\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TOMORROW=Amanh\\u00E3\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_YESTERDAY=Ontem\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_IN_X_DAYS=Em {0} dias\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_X_DAYS_AGO={0} dias atr\\u00E1s\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Voc\\u00EA \\u00E9 respons\\u00E1vel por {0} de {1} tarefas. Somente suas tarefas s\\u00E3o exibidas.\r\n# XTIT: Confirmation message to indicate that the task has been completed\r\nLIST_COMPLETE_CONFIRMATION=A tarefa {0} foi definida como conclu\\u00EDda\r\n\r\n## Task Details \r\n###############\r\n\r\n# XTIT: task detail view name\r\nMC_DETAILS_TITLE=Detalhes da tarefa\r\n# XTIT: task detail title\r\nDETAILS_PAGE_TITLE=Tarefas\r\n# XSEL: new task default text\r\nNEW_TASK_INPUT_PLACEHOLDER=Nova tarefa\r\n# XTIT: initial title of a tasks\r\nNEW_TASK_TITLE=Sem t\\u00EDtulo\r\n# XTIT: page title of a newly created task\r\nNEW_TASK_PAGE_TITLE=Nova tarefa\r\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\r\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE=Encaminhado por {0}, {1}\r\n\r\n\r\n#Form\r\n\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TITLE=T\\u00EDtulo\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_NOTE=Nota\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_DUE_DATE=Prazo\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_ACCOUNT=Conta\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_CONTACT=Contato\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIVATE=Privado\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIORITY=Prioridade\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_STATUS=Status\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TYPE=Tipo\r\n\r\n#Buttons\r\n\r\n# XBUT: Button for deleting the task\r\nDETAILS_BUTTONS_DELETE=Excl.tarefa\r\n# XBUT: Button for deleting the task\r\nDETAILS_FOOTER_BUTTON_DELETE=Eliminar\r\n# XBUT: Button for canceling the task\r\nDETAILS_BUTTONS_CANCEL=Cancelar\r\n# XBUT: Button for creating a new task or saving the existing task\r\nDETAILS_BUTTONS_SAVE=Gravar\r\n# XBUT: Button for assigning the task to another person\r\nDETAILS_BUTTONS_ASSIGNTO=Atribuir a\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP=Atividade subsequente\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_TASK=Tarefa subsequente\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_OPPT=Oportunidade subsequente\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_APPT=Compromisso subsequente\r\n\r\n#Message Box\r\n\r\n# XBUT: Title for the message box\r\nDETAILS_MESSAGEBOX_TITLE=Excluir\r\n# YMSG: Text for the message box\r\nDETAILS_MESSAGEBOX_TEXT=Excluir esta tarefa?\r\n# XTIT: Confirmation message\r\nDETAILS_DELETE_CONFIRMATION=Tarefa {0} exclu\\u00EDda\r\n#XTIT: Warning message\r\nNAVBACK_WARNING_TITLE=Advert\\u00EAncia\r\n#YMSG: Text for the message box\r\nNAVBACK_WARNING_MESSAGE=Suas entradas ser\\u00E3o perdidas; encerrar esta p\\u00E1gina?\r\n\r\n#Value Help \r\n\r\n# XTIT: Title for Value Help Account\r\nDETAILS_VALUE_HELP_ACC_TITLE=Selecionar conta\r\n# XTIT: Title for Value Help Contact\r\nDETAILS_VALUE_HELP_CON_TITLE=Selecionar contato\r\n# YMSG: Filtered by info bar text for contact search popup\r\nDETAILS_VALUE_HELP_FILTERED_BY=Filtrado por\r\n# XTIT: Account VH item description: city, country\r\nDETAILS_VALUE_HELP_ACC_DESCR={0}, {1}\r\n# XTIT: Contact VH item description: account name, function\r\nDETAILS_VALUE_HELP_CON_DESCR={0}, {1}\r\n\r\n\r\n#Business card Account and Contact\r\n\r\n# XTIT: Title for business card Account\r\nDETAILS_BCARD_ACCOUNT=S\\u00EDntese da conta\r\n# XTIT: Title for business card Contact\r\nDETAILS_BCARD_CONTACT=S\\u00EDntese de contatos\r\n\r\n#Assign task to\r\n\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TITLE=Encarregar a\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TEXT=Encarregar tarefa a\\:\r\n# XTIT: Title for employee search\r\nDETAILS_ASSIGNTO_ASIGNEE=Encarregar funcion\\u00E1rio de tarefa\r\n# XTIT: Confirmation message\r\nDETAILS_ASSIGNTO_CONFIRMATION={0} foi encarregado da tarefa\r\n# XBUT: Button on dialog: ok\r\nDIALOG_ASSIGNTO_BUTTON_OK=OK\r\n# XBUT: Button on dialog: cancel\r\nDIALOG_ASSIGNTO_BUTTON_CANCEL=Cancelar\r\n\r\n# errors\r\n\r\n# YMSG: generic error\r\nGENERIC_ERROR=Sistema atualmente n\\u00E3o dispon\\u00EDvel; tente novamente mais tarde ou contate o administrador do sistema.\r\n# YMSG: error in date\r\nDETAILS_MESSAGETEXT_DATE=Data inv\\u00E1lida ou formato incorreto; utilizar entradas poss\\u00EDveis para inserir a data.\r\n# YMSG: error in account\r\nDETAILS_MESSAGETEXT_ACCOUNT=Utilizar entradas poss\\u00EDveis para inserir uma conta\r\n# YMSG: error in contact\r\nDETAILS_MESSAGETEXT_CONTACT=Utilizar entradas poss\\u00EDveis para inserir um contato\r\n# YMSG: title for the validation message box after save is clicked\r\nDETAILS_VALIDATION_TITLE=Utilizar entradas poss\\u00EDveis\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=Carregando...\r\n\r\n# XTIT: Title for Follow up Dialog\r\nDETAILS_FOLLOWUP_TITLE=Atividade subsequente\r\n# XBUT: Button text for Follow up activities\r\nDETAILS_FOLLOWUP_BUTTON=Atividade subsequente\r\n# XTIT: Title for Confirmation Dialog to save task or not \r\nDETAILS_CONFIRM_TITLE=Confirma\\u00E7\\u00E3o\r\n# YMSG: Prompt use to save existing task or not\r\nDETAILS_FOLLOWUP_MESSAGE=Gravar a tarefa atual?\r\n# XBUT: Positive action to save the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_YES=Sim\r\n# XBUT: Positive action to cancel the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_NO=N\\u00E3o\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT=No follow up types available\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_TASK=Cannot proceed in creating a task since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_OPPT=Cannot proceed in creating an opportunity since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_APPT=Cannot proceed in creating an appointment since no follow up types are maintained\r\n# YMSG: Message shown to end user notifying that the follow up was successful\r\nFOLLOWUP_COMPLETED=Atividade subsequente realizada com \\u00EAxito\r\n# YMSG: Message shown once the task is saved during a follow up scenario\r\nFOLLOWUP_TASK_SAVED=Tarefa subsequente gravada\r\n# YMSG: Message shown if a new or existing task is saved\r\nCURRENT_TASK_SAVED=Tarefa gravada\r\n# YMSG: Error message shown to the end user telling that follow up activities cannot be done\r\nFOLLOWUP_ERROR_MSG=A tarefa atual {0} cont\\u00E9m erros ou n\\u00E3o h\\u00E1 tipos de transa\\u00E7\\u00E3o de atividade subsequente atualizados no customizing\r\n\r\n#XFLD: Transaction Type of a given task\r\nS4_TASK_TYPE=Tipo\\: {0}\r\n#XFLD: Due Date of a given task\r\nS4_TASK_DUEDATE=Prazo\\: {0}\r\n#XFLD: Account of a given task\r\nS4_TASK_ACCOUNT=Conta\\: {0}\r\n#XFLD: Contact of a given task\r\nS4_TASK_CONTACT=Contato\\: {0}\r\n#XFLD: Notes of a given task\r\nS4_TASK_NOTES=Notas\r\n#XFLD: Attachments of a given task\r\nS4_TASK_ATTACHMENTS=Anexos\\: {0}\r\n#XFLD: Transaction History of a given task\r\nS4_TASK_DOCHISTORY=Hist\\u00F3rico de transa\\u00E7\\u00F5es\r\n# XBUT: Button for follow up of given task to a task\r\nS4_BUTTONS_FOLLOWUPTOTASK=Tarefa\r\n# XBUT: Button for follow up of given task to a opportunity\r\nS4_BUTTONS_FOLLOWUPTOOPPT=Oportunidade\r\n# XBUT: Button for follow up of given task to an appointment\r\nS4_BUTTONS_FOLLOWUPTOAPPT=Compromisso\r\n# XBUT: Button for editing the task\r\nS4_FOOTER_BUTTON_EDIT=Editar\r\n#XFLD: Column Label for the transaction ID of the document\r\nS4_DOCHISTORY_ID=ID da transa\\u00E7\\u00E3o\r\n#XFLD: Column Label for the transaction type of the document\r\nS4_DOCHISTORY_TTYPE=Tipo de transa\\u00E7\\u00E3o\r\n#XFLD: Column Label for the description of the document\r\nS4_DOCHISTORY_DESC=Descri\\u00E7\\u00E3o\r\n#XFLD: Column Label for the creation date of the document\r\nS4_DOCHISTORY_CREATEDDATE=Criado em\r\n#XFLD: Column Label for the relation type to indicate whether current document precedes/succeeds\r\nS4_DOCHISTORY_RELTYPE=Tipo de rela\\u00E7\\u00E3o\r\n#XFLD: Label to be shown if no transaction history is available\r\nS4_NO_DOCHISTORY=Nenhuma transa\\u00E7\\u00E3o dispon\\u00EDvel\r\n# YMSG: Message shown when renaming an attachment of a task is successful\r\nS3_RENAME_ATTACHMENT_SUCCESS=Anexo renomeado com \\u00EAxito\r\n# YMSG: Message shown when renaming an attachment of a task fails\r\nS3_RENAME_ATTACHMENT_FAILED=N\\u00E3o foi poss\\u00EDvel renomear o anexo\r\n# XBUT: Button for Displaying the Errors\r\nDETAILS_FOOTER_BUTTON_MESSAGE=Mensagens\r\n#XTIT: Title of the messages dialog listing the messages with count\r\nS4_MESSAGES_TITLE=Mensagens ({0})\r\n# YMSG: Message shown when when the user updates a task in its previous state\r\nS3_412_ERRORMSG=Dados modificados por outro usu\\u00E1rio; clique OK para obter a vers\\u00E3o mais recente\r\n#XTIT: Title of dialog indicating an error occurred\r\nS3_412_TITLE=Erro\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS3_ACCOUNT_CONTACT_NOREL=S\\u00F3 \\u00E9 poss\\u00EDvel exibir cart\\u00F5es de visita de contatos atribu\\u00EDdos a essa conta\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS4_ACCOUNT_CONTACT_NOREL=S\\u00F3 \\u00E9 poss\\u00EDvel exibir cart\\u00F5es de visita de contatos atribu\\u00EDdos a essa conta\r\n',
	"cus/crm/mytasks/i18n/i18n_ro.properties":'\r\n\r\n\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n# XFLD: No Tasks found text\r\nSEARCH_LIST_NODATA_GENERIC=F\\u0103r\\u0103 rezultate g\\u0103site\r\n\r\n## Task List \r\n############\r\n\r\n# XTIT: Shell title\r\nSHELL_TITLE=Sarcini\r\n# XTIT: Task list title\r\nLIST_PAGE_TITLE=Sarcini\r\n# XTIT: Task list title with number of tasks\r\nLIST_PAGE_TITLE_WITH_NUMBER=Sarcini deschise ({0})\r\n# XTIT: Task list title wname for the add button\r\nLIST_ADD=Ad\\u0103ugare\r\n# XTIT: Application name\r\nMASTER_TITLE=Sarcinile mele\r\n# XMSG: Busy text\r\nMASTER_BUSY_TEXT=\\u00CEnc\\u0103rcare sarcini...\r\n# XMSG: Busy text\r\nMASTER_SEARCH_PLACEHOLDER=C\\u0103utare...\r\n# XTOL: Search tool tip \r\nMASTER_SEARCH_TOOLTIP=C\\u0103utare sarcini\r\n#XTIT: This is the title for the Process Type section\r\nPROCESS_TYPE=Selectare tip de opera\\u0163ie\r\n\r\n\r\n\r\n#Filters\r\n\r\n# XBUT: Filter Button for showing all open tasks\r\nLIST_FILTER_ALL_OPEN=Toate deschise\r\n# XBUT: Filter Button for showing all tasks that are due today\r\nLIST_FILTER_DUE_TODAY=Scadent ast\\u0103zi\r\n# XBUT: Filter Button for showing all tasks that are due this week\r\nLIST_FILTER_DUE_THIS_WEEK=Scadent s\\u0103pt\\u0103m\\u00E2na aceasta\r\n# XBUT: Filter Button for showing all completed tasks\r\nLIST_FILTER_COMPLETED=Terminat\r\n\r\n# Filter Bar \r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_BAR_COMPLETED=Filtrat dup\\u0103 sarcini terminate\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_TODAY=Filtrat dup\\u0103 sarcini scadente ast\\u0103zi\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_THIS_WEEK=Filtrat dup\\u0103 sarcini scadente s\\u0103pt\\u0103m\\u00E2na aceasta\r\n# XTIT: filtered by Account\r\nLIST_FILTER_BAR_ACCOUNT=Filtrat dup\\u0103 cont {0}\r\n\r\n# Filter Title\r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_TITLE_COMPLETED=Sarcini terminate ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_TODAY=Sarcini scadente ast\\u0103zi ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_THIS_WEEK=Sarcini scadente s\\u0103pt\\u0103m\\u00E2na aceasta ({0})\r\n# XTIT: filtered by Account\r\nLIST_FILTER_TITLE_ACCOUNT=Filtrat dup\\u0103 cont {0} ({1})\r\n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TODAY=Ast\\u0103zi\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TOMORROW=M\\u00E2ine\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_YESTERDAY=Ieri\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_IN_X_DAYS=\\u00CEn {0} zile\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_X_DAYS_AGO=\\u00CEn urm\\u0103 cu {0} zile\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Sunte\\u0163i responsabil pt. {0} din {1} sarcini. Doar sarcinile dvs. sunt afi\\u015Fate.\r\n# XTIT: Confirmation message to indicate that the task has been completed\r\nLIST_COMPLETE_CONFIRMATION=Sarcina {0} a fost setat\\u0103 la Terminat\r\n\r\n## Task Details \r\n###############\r\n\r\n# XTIT: task detail view name\r\nMC_DETAILS_TITLE=Detalii sarcin\\u0103\r\n# XTIT: task detail title\r\nDETAILS_PAGE_TITLE=Sarcini\r\n# XSEL: new task default text\r\nNEW_TASK_INPUT_PLACEHOLDER=Sarcin\\u0103 nou\\u0103\r\n# XTIT: initial title of a tasks\r\nNEW_TASK_TITLE=F\\u0103r\\u0103 titlu\r\n# XTIT: page title of a newly created task\r\nNEW_TASK_PAGE_TITLE=Sarcin\\u0103 nou\\u0103\r\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\r\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE=Redirec\\u0163ionat de {0}, {1}\r\n\r\n\r\n#Form\r\n\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TITLE=Titlu\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_NOTE=Not\\u0103\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_DUE_DATE=Dat\\u0103 scaden\\u0163\\u0103\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_ACCOUNT=Cont\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_CONTACT=Persoan\\u0103 de contact\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIVATE=Privat\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIORITY=Prioritate\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_STATUS=Stare\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TYPE=Tip\r\n\r\n#Buttons\r\n\r\n# XBUT: Button for deleting the task\r\nDETAILS_BUTTONS_DELETE=\\u015Etergere sarcin\\u0103\r\n# XBUT: Button for deleting the task\r\nDETAILS_FOOTER_BUTTON_DELETE=\\u015Etergere\r\n# XBUT: Button for canceling the task\r\nDETAILS_BUTTONS_CANCEL=Anulare\r\n# XBUT: Button for creating a new task or saving the existing task\r\nDETAILS_BUTTONS_SAVE=Salvare\r\n# XBUT: Button for assigning the task to another person\r\nDETAILS_BUTTONS_ASSIGNTO=Alocare la\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP=Opera\\u0163ie succesiv\\u0103\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_TASK=Sarcin\\u0103 succesiv\\u0103\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_OPPT=Oportunitate succesiv\\u0103\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_APPT=\\u00CEnt\\u00E2lnire fixat\\u0103 succesiv\\u0103\r\n\r\n#Message Box\r\n\r\n# XBUT: Title for the message box\r\nDETAILS_MESSAGEBOX_TITLE=\\u015Etergere\r\n# YMSG: Text for the message box\r\nDETAILS_MESSAGEBOX_TEXT=Sigur dori\\u0163i s\\u0103 \\u015Fterge\\u0163i aceast\\u0103 sarcin\\u0103?\r\n# XTIT: Confirmation message\r\nDETAILS_DELETE_CONFIRMATION=Sarcin\\u0103 {0} \\u015Ftears\\u0103\r\n#XTIT: Warning message\r\nNAVBACK_WARNING_TITLE=Avertizare\r\n#YMSG: Text for the message box\r\nNAVBACK_WARNING_MESSAGE=Intr\\u0103rile dvs.vor fi pierdute; sigur dori\\u0163i s\\u0103 p\\u0103r\\u0103si\\u0163i aceast\\u0103 pagin\\u0103?\r\n\r\n#Value Help \r\n\r\n# XTIT: Title for Value Help Account\r\nDETAILS_VALUE_HELP_ACC_TITLE=Selectare cont\r\n# XTIT: Title for Value Help Contact\r\nDETAILS_VALUE_HELP_CON_TITLE=Selectare persoan\\u0103 de contact\r\n# YMSG: Filtered by info bar text for contact search popup\r\nDETAILS_VALUE_HELP_FILTERED_BY=Filtrat dup\\u0103\r\n# XTIT: Account VH item description: city, country\r\nDETAILS_VALUE_HELP_ACC_DESCR={0}, {1}\r\n# XTIT: Contact VH item description: account name, function\r\nDETAILS_VALUE_HELP_CON_DESCR={0}, {1}\r\n\r\n\r\n#Business card Account and Contact\r\n\r\n# XTIT: Title for business card Account\r\nDETAILS_BCARD_ACCOUNT=Imagine general\\u0103 cont\r\n# XTIT: Title for business card Contact\r\nDETAILS_BCARD_CONTACT=Imagine general\\u0103 persoan\\u0103 de contact\r\n\r\n#Assign task to\r\n\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TITLE=Alocare la\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TEXT=Alocare sarcin\\u0103 la\r\n# XTIT: Title for employee search\r\nDETAILS_ASSIGNTO_ASIGNEE=Alocare sarcin\\u0103 la angajat\r\n# XTIT: Confirmation message\r\nDETAILS_ASSIGNTO_CONFIRMATION=Sarcin\\u0103 alocat\\u0103 la {0}\r\n# XBUT: Button on dialog: ok\r\nDIALOG_ASSIGNTO_BUTTON_OK=OK\r\n# XBUT: Button on dialog: cancel\r\nDIALOG_ASSIGNTO_BUTTON_CANCEL=Anulare\r\n\r\n# errors\r\n\r\n# YMSG: generic error\r\nGENERIC_ERROR=Sistemul nu este disponibil \\u00EEn prezent; \\u00EEncerca\\u0163i din nou mai t\\u00E2rziu sau contacta\\u0163i administratorul dvs.de sistem\r\n# YMSG: error in date\r\nDETAILS_MESSAGETEXT_DATE=Data nu este valabil\\u0103 sau nu este \\u00EEn formatul corect; utiliza\\u0163i ajutorul de intrare pt.a introduce data\r\n# YMSG: error in account\r\nDETAILS_MESSAGETEXT_ACCOUNT=Utiliza\\u0163i ajutorul de intrare pt.a introduce un cont\r\n# YMSG: error in contact\r\nDETAILS_MESSAGETEXT_CONTACT=Utiliza\\u0163i ajutorul de intrare pt.a introduce o persoan\\u0103 de contact\r\n# YMSG: title for the validation message box after save is clicked\r\nDETAILS_VALIDATION_TITLE=Utilizare ajutor de intrare\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=\\u00CEnc\\u0103rcare ...\r\n\r\n# XTIT: Title for Follow up Dialog\r\nDETAILS_FOLLOWUP_TITLE=Opera\\u0163ie succesiv\\u0103\r\n# XBUT: Button text for Follow up activities\r\nDETAILS_FOLLOWUP_BUTTON=Opera\\u0163ie succesiv\\u0103\r\n# XTIT: Title for Confirmation Dialog to save task or not \r\nDETAILS_CONFIRM_TITLE=Confirmare\r\n# YMSG: Prompt use to save existing task or not\r\nDETAILS_FOLLOWUP_MESSAGE=Dori\\u0163i s\\u0103 salva\\u0163i sarcina curent\\u0103?\r\n# XBUT: Positive action to save the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_YES=Da\r\n# XBUT: Positive action to cancel the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_NO=Nu\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT=No follow up types available\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_TASK=Cannot proceed in creating a task since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_OPPT=Cannot proceed in creating an opportunity since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_APPT=Cannot proceed in creating an appointment since no follow up types are maintained\r\n# YMSG: Message shown to end user notifying that the follow up was successful\r\nFOLLOWUP_COMPLETED=Opera\\u0163ia succesiv\\u0103 a fost reu\\u015Fit\\u0103\r\n# YMSG: Message shown once the task is saved during a follow up scenario\r\nFOLLOWUP_TASK_SAVED=Sarcin\\u0103 succesiv\\u0103 salvat\\u0103\r\n# YMSG: Message shown if a new or existing task is saved\r\nCURRENT_TASK_SAVED=Sarcin\\u0103 salvat\\u0103\r\n# YMSG: Error message shown to the end user telling that follow up activities cannot be done\r\nFOLLOWUP_ERROR_MSG=Sarcina curent\\u0103 {0} are erori sau nu exist\\u0103 tipuri de opera\\u0163ie succesiv\\u0103 \\u00EEntre\\u0163inute \\u00EEn customizare\r\n\r\n#XFLD: Transaction Type of a given task\r\nS4_TASK_TYPE=Tip\\: {0}\r\n#XFLD: Due Date of a given task\r\nS4_TASK_DUEDATE=Dat\\u0103 scaden\\u0163\\u0103\\: {0}\r\n#XFLD: Account of a given task\r\nS4_TASK_ACCOUNT=Cont\\: {0}\r\n#XFLD: Contact of a given task\r\nS4_TASK_CONTACT=Persoan\\u0103 de contact\\: {0}\r\n#XFLD: Notes of a given task\r\nS4_TASK_NOTES=Note\r\n#XFLD: Attachments of a given task\r\nS4_TASK_ATTACHMENTS=Anexe\\: {0}\r\n#XFLD: Transaction History of a given task\r\nS4_TASK_DOCHISTORY=Istoric de opera\\u0163ii\r\n# XBUT: Button for follow up of given task to a task\r\nS4_BUTTONS_FOLLOWUPTOTASK=Sarcin\\u0103\r\n# XBUT: Button for follow up of given task to a opportunity\r\nS4_BUTTONS_FOLLOWUPTOOPPT=Oportunitate\r\n# XBUT: Button for follow up of given task to an appointment\r\nS4_BUTTONS_FOLLOWUPTOAPPT=\\u00CEnt\\u00E2lnire fixat\\u0103\r\n# XBUT: Button for editing the task\r\nS4_FOOTER_BUTTON_EDIT=Editare\r\n#XFLD: Column Label for the transaction ID of the document\r\nS4_DOCHISTORY_ID=ID opera\\u0163ie\r\n#XFLD: Column Label for the transaction type of the document\r\nS4_DOCHISTORY_TTYPE=Tip opera\\u0163ie\r\n#XFLD: Column Label for the description of the document\r\nS4_DOCHISTORY_DESC=Descriere\r\n#XFLD: Column Label for the creation date of the document\r\nS4_DOCHISTORY_CREATEDDATE=Creat pe\r\n#XFLD: Column Label for the relation type to indicate whether current document precedes/succeeds\r\nS4_DOCHISTORY_RELTYPE=Tip de rela\\u0163ie\r\n#XFLD: Label to be shown if no transaction history is available\r\nS4_NO_DOCHISTORY=F\\u0103r\\u0103 opera\\u0163ii disponibile\r\n# YMSG: Message shown when renaming an attachment of a task is successful\r\nS3_RENAME_ATTACHMENT_SUCCESS=Anex\\u0103 redenumit\\u0103 cu succes\r\n# YMSG: Message shown when renaming an attachment of a task fails\r\nS3_RENAME_ATTACHMENT_FAILED=Anexa nu a putut fi redenumit\\u0103\r\n# XBUT: Button for Displaying the Errors\r\nDETAILS_FOOTER_BUTTON_MESSAGE=Mesaje\r\n#XTIT: Title of the messages dialog listing the messages with count\r\nS4_MESSAGES_TITLE=Mesaje ({0})\r\n# YMSG: Message shown when when the user updates a task in its previous state\r\nS3_412_ERRORMSG=Data a fost modificat\\u0103 de alt utilizator; click pe OK pt.ultima versiune\r\n#XTIT: Title of dialog indicating an error occurred\r\nS3_412_TITLE=Eroare\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS3_ACCOUNT_CONTACT_NOREL=Pute\\u0163i s\\u0103 vede\\u0163i doar c\\u0103r\\u0163ile de vizit\\u0103 pt.persoanele de contact care au fost alocate la acest cont\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS4_ACCOUNT_CONTACT_NOREL=Pute\\u0163i s\\u0103 vede\\u0163i doar c\\u0103r\\u0163ile de vizit\\u0103 pt.persoanele de contact care au fost alocate la acest cont\r\n',
	"cus/crm/mytasks/i18n/i18n_ru.properties":'\r\n\r\n\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n# XFLD: No Tasks found text\r\nSEARCH_LIST_NODATA_GENERIC=\\u041D\\u0435\\u0442 \\u0440\\u0435\\u0437\\u0443\\u043B\\u044C\\u0442\\u0430\\u0442\\u043E\\u0432\r\n\r\n## Task List \r\n############\r\n\r\n# XTIT: Shell title\r\nSHELL_TITLE=\\u0417\\u0430\\u0434\\u0430\\u0447\\u0438\r\n# XTIT: Task list title\r\nLIST_PAGE_TITLE=\\u0417\\u0430\\u0434\\u0430\\u0447\\u0438\r\n# XTIT: Task list title with number of tasks\r\nLIST_PAGE_TITLE_WITH_NUMBER=\\u041E\\u0442\\u043A\\u0440\\u044B\\u0442\\u044B\\u0435 \\u0437\\u0430\\u0434\\u0430\\u0447\\u0438 ({0})\r\n# XTIT: Task list title wname for the add button\r\nLIST_ADD=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C\r\n# XTIT: Application name\r\nMASTER_TITLE=\\u041C\\u043E\\u0438 \\u0437\\u0430\\u0434\\u0430\\u0447\\u0438\r\n# XMSG: Busy text\r\nMASTER_BUSY_TEXT=\\u0417\\u0430\\u0433\\u0440\\u0443\\u0437\\u043A\\u0430 \\u0437\\u0430\\u0434\\u0430\\u0447...\r\n# XMSG: Busy text\r\nMASTER_SEARCH_PLACEHOLDER=\\u041F\\u043E\\u0438\\u0441\\u043A...\r\n# XTOL: Search tool tip \r\nMASTER_SEARCH_TOOLTIP=\\u041F\\u043E\\u0438\\u0441\\u043A \\u0437\\u0430\\u0434\\u0430\\u0447\r\n#XTIT: This is the title for the Process Type section\r\nPROCESS_TYPE=\\u0412\\u044B\\u0431\\u043E\\u0440 \\u0442\\u0438\\u043F\\u0430 \\u0442\\u0440\\u0430\\u043D\\u0437\\u0430\\u043A\\u0446\\u0438\\u0438\r\n\r\n\r\n\r\n#Filters\r\n\r\n# XBUT: Filter Button for showing all open tasks\r\nLIST_FILTER_ALL_OPEN=\\u0412\\u0441\\u0435 \\u043E\\u0442\\u043A\\u0440\\u044B\\u0442\\u044B\\u0435\r\n# XBUT: Filter Button for showing all tasks that are due today\r\nLIST_FILTER_DUE_TODAY=\\u0412\\u044B\\u043F\\u043E\\u043B\\u043D\\u0438\\u0442\\u044C \\u0441\\u0435\\u0433\\u043E\\u0434\\u043D\\u044F\r\n# XBUT: Filter Button for showing all tasks that are due this week\r\nLIST_FILTER_DUE_THIS_WEEK=\\u0412\\u044B\\u043F\\u043E\\u043B\\u043D\\u0438\\u0442\\u044C \\u043D\\u0430 \\u044D\\u0442\\u043E\\u0439 \\u043D\\u0435\\u0434\\u0435\\u043B\\u0435\r\n# XBUT: Filter Button for showing all completed tasks\r\nLIST_FILTER_COMPLETED=\\u0412\\u044B\\u043F\\u043E\\u043B\\u043D\\u0435\\u043D\\u043E\r\n\r\n# Filter Bar \r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_BAR_COMPLETED=\\u041E\\u0442\\u0444\\u0438\\u043B\\u044C\\u0442\\u0440\\u043E\\u0432\\u0430\\u043D\\u043E \\u043F\\u043E \\u0437\\u0430\\u0432\\u0435\\u0440\\u0448\\u0435\\u043D\\u043D\\u044B\\u043C \\u0437\\u0430\\u0434\\u0430\\u0447\\u0430\\u043C\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_TODAY=\\u041E\\u0442\\u0444\\u0438\\u043B\\u044C\\u0442\\u0440\\u043E\\u0432\\u0430\\u043D\\u043E \\u043F\\u043E \\u0437\\u0430\\u0434\\u0430\\u0447\\u0430\\u043C \\u043D\\u0430 \\u0441\\u0435\\u0433\\u043E\\u0434\\u043D\\u044F\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_THIS_WEEK=\\u041E\\u0442\\u0444\\u0438\\u043B\\u044C\\u0442\\u0440\\u043E\\u0432\\u0430\\u043D\\u043E \\u043F\\u043E \\u0437\\u0430\\u0434\\u0430\\u0447\\u0430\\u043C \\u043D\\u0430 \\u044D\\u0442\\u0443 \\u043D\\u0435\\u0434\\u0435\\u043B\\u044E\r\n# XTIT: filtered by Account\r\nLIST_FILTER_BAR_ACCOUNT=\\u041E\\u0442\\u0444\\u0438\\u043B\\u044C\\u0442\\u0440\\u043E\\u0432\\u0430\\u043D\\u043E \\u043F\\u043E \\u0441\\u0447\\u0435\\u0442\\u0443 {0}\r\n\r\n# Filter Title\r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_TITLE_COMPLETED=\\u0417\\u0430\\u0432\\u0435\\u0440\\u0448\\u0435\\u043D\\u043D\\u044B\\u0435 \\u0437\\u0430\\u0434\\u0430\\u0447\\u0438 ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_TODAY=\\u0417\\u0430\\u0434\\u0430\\u0447\\u0438 \\u043A \\u0438\\u0441\\u043F\\u043E\\u043B\\u043D\\u0435\\u043D\\u0438\\u044E \\u0441\\u0435\\u0433\\u043E\\u0434\\u043D\\u044F ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_THIS_WEEK=\\u0417\\u0430\\u0434\\u0430\\u0447\\u0438 \\u043A \\u0438\\u0441\\u043F\\u043E\\u043B\\u043D\\u0435\\u043D\\u0438\\u044E \\u043D\\u0430 \\u044D\\u0442\\u043E\\u0439 \\u043D\\u0435\\u0434\\u0435\\u043B\\u0435 ({0})\r\n# XTIT: filtered by Account\r\nLIST_FILTER_TITLE_ACCOUNT=\\u041E\\u0442\\u0444\\u0438\\u043B\\u044C\\u0442\\u0440\\u043E\\u0432\\u0430\\u043D\\u043E \\u043F\\u043E \\u0441\\u0447\\u0435\\u0442\\u0443 {0} ({1})\r\n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TODAY=\\u0421\\u0435\\u0433\\u043E\\u0434\\u043D\\u044F\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TOMORROW=\\u0417\\u0430\\u0432\\u0442\\u0440\\u0430\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_YESTERDAY=\\u0412\\u0447\\u0435\\u0440\\u0430\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_IN_X_DAYS=\\u0427\\u0435\\u0440\\u0435\\u0437 {0} \\u0434\\u043D.\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_X_DAYS_AGO={0} \\u0434\\u043D. \\u043D\\u0430\\u0437\\u0430\\u0434\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=\\u0412\\u044B \\u043E\\u0442\\u0432\\u0435\\u0447\\u0430\\u0435\\u0442\\u0435 \\u0437\\u0430 {0} \\u0437\\u0430\\u0434. \\u0438\\u0437 {1}. \\u041E\\u0442\\u043E\\u0431\\u0440\\u0430\\u0436\\u0430\\u044E\\u0442\\u0441\\u044F \\u0442\\u043E\\u043B\\u044C\\u043A\\u043E \\u0432\\u0430\\u0448\\u0438 \\u0437\\u0430\\u0434\\u0430\\u0447\\u0438.\r\n# XTIT: Confirmation message to indicate that the task has been completed\r\nLIST_COMPLETE_CONFIRMATION=\\u0417\\u0430\\u0434\\u0430\\u0447\\u0430 {0} \\u0443\\u0441\\u0442\\u0430\\u043D\\u043E\\u0432\\u043B\\u0435\\u043D\\u0430 \\u043D\\u0430 "\\u0417\\u0430\\u0432\\u0435\\u0440\\u0448\\u0435\\u043D\\u043E"\r\n\r\n## Task Details \r\n###############\r\n\r\n# XTIT: task detail view name\r\nMC_DETAILS_TITLE=\\u0421\\u0432\\u0435\\u0434\\u0435\\u043D\\u0438\\u044F \\u043E \\u0437\\u0430\\u0434\\u0430\\u0447\\u0435\r\n# XTIT: task detail title\r\nDETAILS_PAGE_TITLE=\\u0417\\u0430\\u0434\\u0430\\u0447\\u0438\r\n# XSEL: new task default text\r\nNEW_TASK_INPUT_PLACEHOLDER=\\u041D\\u043E\\u0432\\u0430\\u044F \\u0437\\u0430\\u0434\\u0430\\u0447\\u0430\r\n# XTIT: initial title of a tasks\r\nNEW_TASK_TITLE=\\u0411\\u0435\\u0437 \\u043D\\u0430\\u0437\\u0432\\u0430\\u043D\\u0438\\u044F\r\n# XTIT: page title of a newly created task\r\nNEW_TASK_PAGE_TITLE=\\u041D\\u043E\\u0432\\u0430\\u044F \\u0437\\u0430\\u0434\\u0430\\u0447\\u0430\r\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\r\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE=\\u041F\\u0435\\u0440\\u0435\\u0430\\u0434\\u0440\\u0435\\u0441\\u043E\\u0432\\u0430\\u043D\\u043E {0}, {1}\r\n\r\n\r\n#Form\r\n\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TITLE=\\u041D\\u0430\\u0437\\u0432\\u0430\\u043D\\u0438\\u0435\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_NOTE=\\u041F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u0435\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_DUE_DATE=\\u0421\\u0440\\u043E\\u043A\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_ACCOUNT=\\u041A\\u043B\\u0438\\u0435\\u043D\\u0442\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_CONTACT=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIVATE=\\u041B\\u0438\\u0447\\u043D\\u044B\\u0439\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIORITY=\\u041F\\u0440\\u0438\\u043E\\u0440\\u0438\\u0442\\u0435\\u0442\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_STATUS=\\u0421\\u0442\\u0430\\u0442\\u0443\\u0441\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TYPE=\\u0412\\u0438\\u0434\r\n\r\n#Buttons\r\n\r\n# XBUT: Button for deleting the task\r\nDETAILS_BUTTONS_DELETE=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C \\u0437\\u0430\\u0434\\u0430\\u0447\\u0443\r\n# XBUT: Button for deleting the task\r\nDETAILS_FOOTER_BUTTON_DELETE=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C\r\n# XBUT: Button for canceling the task\r\nDETAILS_BUTTONS_CANCEL=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\r\n# XBUT: Button for creating a new task or saving the existing task\r\nDETAILS_BUTTONS_SAVE=\\u0421\\u043E\\u0445\\u0440\\u0430\\u043D\\u0438\\u0442\\u044C\r\n# XBUT: Button for assigning the task to another person\r\nDETAILS_BUTTONS_ASSIGNTO=\\u041F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0438\\u0442\\u044C\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP=\\u041F\\u043E\\u0441\\u043B\\u0435\\u0434\\u0443\\u044E\\u0449\\u0430\\u044F \\u043E\\u043F\\u0435\\u0440\\u0430\\u0446\\u0438\\u044F\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_TASK=\\u041F\\u043E\\u0441\\u043B\\u0435\\u0434\\u0443\\u044E\\u0449\\u0430\\u044F \\u0437\\u0430\\u0434\\u0430\\u0447\\u0430\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_OPPT=\\u041F\\u043E\\u0441\\u043B\\u0435\\u0434\\u0443\\u044E\\u0449\\u0430\\u044F \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u044C\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_APPT=\\u041F\\u043E\\u0441\\u043B\\u0435\\u0434\\u0443\\u044E\\u0449\\u0430\\u044F \\u0432\\u0441\\u0442\\u0440\\u0435\\u0447\\u0430\r\n\r\n#Message Box\r\n\r\n# XBUT: Title for the message box\r\nDETAILS_MESSAGEBOX_TITLE=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C\r\n# YMSG: Text for the message box\r\nDETAILS_MESSAGEBOX_TEXT=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C \\u0437\\u0430\\u0434\\u0430\\u0447\\u0443?\r\n# XTIT: Confirmation message\r\nDETAILS_DELETE_CONFIRMATION=\\u0417\\u0430\\u0434\\u0430\\u0447\\u0430 {0} \\u0443\\u0434\\u0430\\u043B\\u0435\\u043D\\u0430\r\n#XTIT: Warning message\r\nNAVBACK_WARNING_TITLE=\\u041F\\u0440\\u0435\\u0434\\u0443\\u043F\\u0440\\u0435\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435\r\n#YMSG: Text for the message box\r\nNAVBACK_WARNING_MESSAGE=\\u0412\\u0430\\u0448\\u0438 \\u0437\\u0430\\u043F\\u0438\\u0441\\u0438 \\u0431\\u0443\\u0434\\u0443\\u0442 \\u0443\\u0442\\u0435\\u0440\\u044F\\u043D\\u044B; \\u0437\\u0430\\u043A\\u0440\\u044B\\u0442\\u044C \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0443?\r\n\r\n#Value Help \r\n\r\n# XTIT: Title for Value Help Account\r\nDETAILS_VALUE_HELP_ACC_TITLE=\\u0412\\u044B\\u0431\\u0440\\u0430\\u0442\\u044C \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0430\r\n# XTIT: Title for Value Help Contact\r\nDETAILS_VALUE_HELP_CON_TITLE=\\u0412\\u044B\\u0431\\u0440\\u0430\\u0442\\u044C \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n# YMSG: Filtered by info bar text for contact search popup\r\nDETAILS_VALUE_HELP_FILTERED_BY=\\u041E\\u0442\\u0444\\u0438\\u043B\\u044C\\u0442\\u0440\\u043E\\u0432\\u0430\\u043D\\u043E \\u043F\\u043E\r\n# XTIT: Account VH item description: city, country\r\nDETAILS_VALUE_HELP_ACC_DESCR={0}, {1}\r\n# XTIT: Contact VH item description: account name, function\r\nDETAILS_VALUE_HELP_CON_DESCR={0}, {1}\r\n\r\n\r\n#Business card Account and Contact\r\n\r\n# XTIT: Title for business card Account\r\nDETAILS_BCARD_ACCOUNT=\\u041E\\u0431\\u0437\\u043E\\u0440 \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u043E\\u0432\r\n# XTIT: Title for business card Contact\r\nDETAILS_BCARD_CONTACT=\\u041E\\u0431\\u0437\\u043E\\u0440 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u043E\\u0432\r\n\r\n#Assign task to\r\n\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TITLE=\\u041F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0438\\u0442\\u044C\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TEXT=\\u041F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0438\\u0442\\u044C \\u0437\\u0430\\u0434\\u0430\\u0447\\u0443\r\n# XTIT: Title for employee search\r\nDETAILS_ASSIGNTO_ASIGNEE=\\u041F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0438\\u0442\\u044C \\u0437\\u0430\\u0434\\u0430\\u0447\\u0443 \\u0441\\u043E\\u0442\\u0440\\u0443\\u0434\\u043D\\u0438\\u043A\\u0443\r\n# XTIT: Confirmation message\r\nDETAILS_ASSIGNTO_CONFIRMATION=\\u0417\\u0430\\u0434\\u0430\\u0447\\u0430 \\u043F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0435\\u043D\\u0430 {0}\r\n# XBUT: Button on dialog: ok\r\nDIALOG_ASSIGNTO_BUTTON_OK=\\u041E\\u041A\r\n# XBUT: Button on dialog: cancel\r\nDIALOG_ASSIGNTO_BUTTON_CANCEL=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\r\n\r\n# errors\r\n\r\n# YMSG: generic error\r\nGENERIC_ERROR=\\u0421\\u0438\\u0441\\u0442\\u0435\\u043C\\u0430 \\u0441\\u0435\\u0439\\u0447\\u0430\\u0441 \\u043D\\u0435\\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u0430. \\u041F\\u043E\\u0432\\u0442\\u043E\\u0440\\u0438\\u0442\\u0435 \\u043F\\u043E\\u043F\\u044B\\u0442\\u043A\\u0443 \\u043F\\u043E\\u0437\\u0434\\u043D\\u0435\\u0435 \\u0438\\u043B\\u0438 \\u043E\\u0431\\u0440\\u0430\\u0442\\u0438\\u0442\\u0435\\u0441\\u044C \\u043A \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u043D\\u043E\\u043C\\u0443 \\u0430\\u0434\\u043C\\u0438\\u043D\\u0438\\u0441\\u0442\\u0440\\u0430\\u0442\\u043E\\u0440\\u0443.\r\n# YMSG: error in date\r\nDETAILS_MESSAGETEXT_DATE=\\u0414\\u0430\\u0442\\u0430 \\u043D\\u0435\\u0434\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u0430 \\u0438\\u043B\\u0438 \\u0438\\u043C\\u0435\\u0435\\u0442 \\u043D\\u0435\\u043A\\u043E\\u0440\\u0440\\u0435\\u043A\\u0442\\u043D\\u044B\\u0439 \\u0444\\u043E\\u0440\\u043C\\u0430\\u0442. \\u0418\\u0441\\u043F\\u043E\\u043B\\u044C\\u0437\\u0443\\u0439\\u0442\\u0435 \\u0441\\u043F\\u0440\\u0430\\u0432\\u043A\\u0443 \\u043F\\u043E \\u0432\\u0432\\u043E\\u0434\\u0443 \\u0434\\u043B\\u044F \\u0432\\u0432\\u043E\\u0434\\u0430 \\u0434\\u0430\\u0442\\u044B.\r\n# YMSG: error in account\r\nDETAILS_MESSAGETEXT_ACCOUNT=\\u0418\\u0441\\u043F\\u043E\\u043B\\u044C\\u0437\\u0443\\u0439\\u0442\\u0435 \\u0441\\u043F\\u0440\\u0430\\u0432\\u043A\\u0443 \\u043F\\u043E \\u0432\\u0432\\u043E\\u0434\\u0443 \\u0434\\u043B\\u044F \\u0432\\u0432\\u043E\\u0434\\u0430 \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0430\r\n# YMSG: error in contact\r\nDETAILS_MESSAGETEXT_CONTACT=\\u0418\\u0441\\u043F\\u043E\\u043B\\u044C\\u0437\\u0443\\u0439\\u0442\\u0435 \\u0441\\u043F\\u0440\\u0430\\u0432\\u043A\\u0443 \\u043F\\u043E \\u0432\\u0432\\u043E\\u0434\\u0443 \\u0434\\u043B\\u044F \\u0432\\u0432\\u043E\\u0434\\u0430 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u0430\r\n# YMSG: title for the validation message box after save is clicked\r\nDETAILS_VALIDATION_TITLE=\\u0418\\u0441\\u043F\\u043E\\u043B\\u044C\\u0437\\u0443\\u0439\\u0442\\u0435 \\u0441\\u043F\\u0440\\u0430\\u0432\\u043A\\u0443 \\u043F\\u043E \\u0432\\u0432\\u043E\\u0434\\u0443\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=\\u0417\\u0430\\u0433\\u0440\\u0443\\u0437\\u043A\\u0430...\r\n\r\n# XTIT: Title for Follow up Dialog\r\nDETAILS_FOLLOWUP_TITLE=\\u041F\\u043E\\u0441\\u043B\\u0435\\u0434\\u0443\\u044E\\u0449\\u0430\\u044F \\u043E\\u043F\\u0435\\u0440\\u0430\\u0446\\u0438\\u044F\r\n# XBUT: Button text for Follow up activities\r\nDETAILS_FOLLOWUP_BUTTON=\\u041F\\u043E\\u0441\\u043B\\u0435\\u0434\\u0443\\u044E\\u0449\\u0430\\u044F \\u043E\\u043F\\u0435\\u0440\\u0430\\u0446\\u0438\\u044F\r\n# XTIT: Title for Confirmation Dialog to save task or not \r\nDETAILS_CONFIRM_TITLE=\\u041F\\u043E\\u0434\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435\r\n# YMSG: Prompt use to save existing task or not\r\nDETAILS_FOLLOWUP_MESSAGE=\\u0421\\u043E\\u0445\\u0440\\u0430\\u043D\\u0438\\u0442\\u044C \\u0442\\u0435\\u043A\\u0443\\u0449\\u0443\\u044E \\u0437\\u0430\\u0434\\u0430\\u0447\\u0443?\r\n# XBUT: Positive action to save the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_YES=\\u0414\\u0430\r\n# XBUT: Positive action to cancel the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_NO=\\u041D\\u0435\\u0442\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT=No follow up types available\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_TASK=Cannot proceed in creating a task since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_OPPT=Cannot proceed in creating an opportunity since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_APPT=Cannot proceed in creating an appointment since no follow up types are maintained\r\n# YMSG: Message shown to end user notifying that the follow up was successful\r\nFOLLOWUP_COMPLETED=\\u041F\\u043E\\u0441\\u043B\\u0435\\u0434\\u0443\\u044E\\u0449\\u0430\\u044F \\u043E\\u043F\\u0435\\u0440\\u0430\\u0446\\u0438\\u044F \\u0432\\u044B\\u043F\\u043E\\u043B\\u043D\\u0435\\u043D\\u0430\r\n# YMSG: Message shown once the task is saved during a follow up scenario\r\nFOLLOWUP_TASK_SAVED=\\u041F\\u043E\\u0441\\u043B\\u0435\\u0434\\u0443\\u044E\\u0449\\u0430\\u044F \\u0437\\u0430\\u0434\\u0430\\u0447\\u0430 \\u0441\\u043E\\u0445\\u0440\\u0430\\u043D\\u0435\\u043D\\u0430\r\n# YMSG: Message shown if a new or existing task is saved\r\nCURRENT_TASK_SAVED=\\u0417\\u0430\\u0434\\u0430\\u0447\\u0430 \\u0441\\u043E\\u0445\\u0440\\u0430\\u043D\\u0435\\u043D\\u0430\r\n# YMSG: Error message shown to the end user telling that follow up activities cannot be done\r\nFOLLOWUP_ERROR_MSG=\\u0422\\u0435\\u043A\\u0443\\u0449\\u0430\\u044F \\u0437\\u0430\\u0434\\u0430\\u0447\\u0430 {0} \\u0441\\u043E\\u0434\\u0435\\u0440\\u0436\\u0438\\u0442 \\u043E\\u0448\\u0438\\u0431\\u043A\\u0438, \\u0438\\u043B\\u0438 \\u0432 \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044C\\u0441\\u043A\\u043E\\u0439 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0435 \\u043D\\u0435 \\u0432\\u044B\\u043F\\u043E\\u043B\\u043D\\u0435\\u043D\\u043E \\u0432\\u0435\\u0434\\u0435\\u043D\\u0438\\u0435 \\u0432\\u0438\\u0434\\u043E\\u0432 \\u043E\\u0442\\u0441\\u043B\\u0435\\u0436\\u0438\\u0432\\u0430\\u0435\\u043C\\u044B\\u0445 \\u043E\\u043F\\u0435\\u0440\\u0430\\u0446\\u0438\\u0439.\r\n\r\n#XFLD: Transaction Type of a given task\r\nS4_TASK_TYPE=\\u0422\\u0438\\u043F\\: {0}\r\n#XFLD: Due Date of a given task\r\nS4_TASK_DUEDATE=\\u0421\\u0440\\u043E\\u043A\\: {0}\r\n#XFLD: Account of a given task\r\nS4_TASK_ACCOUNT=\\u041A\\u043B\\u0438\\u0435\\u043D\\u0442\\: {0}\r\n#XFLD: Contact of a given task\r\nS4_TASK_CONTACT=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u043D\\u043E\\u0435 \\u043B\\u0438\\u0446\\u043E\\: {0}\r\n#XFLD: Notes of a given task\r\nS4_TASK_NOTES=\\u041F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u044F\r\n#XFLD: Attachments of a given task\r\nS4_TASK_ATTACHMENTS=\\u041F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F\\: {0}\r\n#XFLD: Transaction History of a given task\r\nS4_TASK_DOCHISTORY=\\u0418\\u0441\\u0442\\u043E\\u0440\\u0438\\u044F \\u0442\\u0440\\u0430\\u043D\\u0437\\u0430\\u043A\\u0446\\u0438\\u0439\r\n# XBUT: Button for follow up of given task to a task\r\nS4_BUTTONS_FOLLOWUPTOTASK=\\u0417\\u0430\\u0434\\u0430\\u0447\\u0430\r\n# XBUT: Button for follow up of given task to a opportunity\r\nS4_BUTTONS_FOLLOWUPTOOPPT=\\u0412\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u044C\r\n# XBUT: Button for follow up of given task to an appointment\r\nS4_BUTTONS_FOLLOWUPTOAPPT=\\u0412\\u0441\\u0442\\u0440\\u0435\\u0447\\u0430\r\n# XBUT: Button for editing the task\r\nS4_FOOTER_BUTTON_EDIT=\\u0420\\u0435\\u0434\\u0430\\u043A\\u0442\\u0438\\u0440\\u043E\\u0432\\u0430\\u0442\\u044C\r\n#XFLD: Column Label for the transaction ID of the document\r\nS4_DOCHISTORY_ID=\\u0418\\u0434. \\u043E\\u043F\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438\r\n#XFLD: Column Label for the transaction type of the document\r\nS4_DOCHISTORY_TTYPE=\\u0412\\u0438\\u0434 \\u043E\\u043F\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438\r\n#XFLD: Column Label for the description of the document\r\nS4_DOCHISTORY_DESC=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\r\n#XFLD: Column Label for the creation date of the document\r\nS4_DOCHISTORY_CREATEDDATE=\\u0414\\u0430\\u0442\\u0430 \\u0441\\u043E\\u0437\\u0434\\u0430\\u043D\\u0438\\u044F\r\n#XFLD: Column Label for the relation type to indicate whether current document precedes/succeeds\r\nS4_DOCHISTORY_RELTYPE=\\u0412\\u0438\\u0434 \\u043E\\u0442\\u043D\\u043E\\u0448\\u0435\\u043D\\u0438\\u044F\r\n#XFLD: Label to be shown if no transaction history is available\r\nS4_NO_DOCHISTORY=\\u041D\\u0435\\u0442 \\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\\u0445 \\u043E\\u043F\\u0435\\u0440\\u0430\\u0446\\u0438\\u0439\r\n# YMSG: Message shown when renaming an attachment of a task is successful\r\nS3_RENAME_ATTACHMENT_SUCCESS=\\u041F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0435 \\u043F\\u0435\\u0440\\u0435\\u0438\\u043C\\u0435\\u043D\\u043E\\u0432\\u0430\\u043D\\u043E\r\n# YMSG: Message shown when renaming an attachment of a task fails\r\nS3_RENAME_ATTACHMENT_FAILED=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u043F\\u0435\\u0440\\u0435\\u0438\\u043C\\u0435\\u043D\\u043E\\u0432\\u0430\\u0442\\u044C \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0435\r\n# XBUT: Button for Displaying the Errors\r\nDETAILS_FOOTER_BUTTON_MESSAGE=\\u0421\\u043E\\u043E\\u0431\\u0449\\u0435\\u043D\\u0438\\u044F\r\n#XTIT: Title of the messages dialog listing the messages with count\r\nS4_MESSAGES_TITLE=\\u0421\\u043E\\u043E\\u0431\\u0449\\u0435\\u043D\\u0438\\u044F ({0})\r\n# YMSG: Message shown when when the user updates a task in its previous state\r\nS3_412_ERRORMSG=\\u0414\\u0430\\u043D\\u043D\\u044B\\u0435 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u044B \\u0434\\u0440\\u0443\\u0433\\u0438\\u043C \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u0435\\u043C; \\u043D\\u0430\\u0436\\u043C\\u0438\\u0442\\u0435 \\u041E\\u041A \\u0434\\u043B\\u044F \\u043F\\u043E\\u043B\\u0443\\u0447\\u0435\\u043D\\u0438\\u044F \\u0430\\u043A\\u0442\\u0443\\u0430\\u043B\\u044C\\u043D\\u043E\\u0439 \\u0432\\u0435\\u0440\\u0441\\u0438\\u0438\r\n#XTIT: Title of dialog indicating an error occurred\r\nS3_412_TITLE=\\u041E\\u0448\\u0438\\u0431\\u043A\\u0430\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS3_ACCOUNT_CONTACT_NOREL=\\u0412\\u044B \\u043C\\u043E\\u0436\\u0435\\u0442\\u0435 \\u0442\\u043E\\u043B\\u044C\\u043A\\u043E \\u043F\\u0440\\u043E\\u0441\\u043C\\u0430\\u0442\\u0440\\u0438\\u0432\\u0430\\u0442\\u044C \\u0432\\u0438\\u0437\\u0438\\u0442\\u043D\\u044B\\u0435 \\u043A\\u0430\\u0440\\u0442\\u043E\\u0447\\u043A\\u0438 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u043E\\u0432, \\u043F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0435\\u043D\\u043D\\u044B\\u0435 \\u044D\\u0442\\u043E\\u043C\\u0443 \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0443\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS4_ACCOUNT_CONTACT_NOREL=\\u0412\\u044B \\u043C\\u043E\\u0436\\u0435\\u0442\\u0435 \\u0442\\u043E\\u043B\\u044C\\u043A\\u043E \\u043F\\u0440\\u043E\\u0441\\u043C\\u0430\\u0442\\u0440\\u0438\\u0432\\u0430\\u0442\\u044C \\u0432\\u0438\\u0437\\u0438\\u0442\\u043D\\u044B\\u0435 \\u043A\\u0430\\u0440\\u0442\\u043E\\u0447\\u043A\\u0438 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u043E\\u0432, \\u043F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0435\\u043D\\u043D\\u044B\\u0435 \\u044D\\u0442\\u043E\\u043C\\u0443 \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0443\r\n',
	"cus/crm/mytasks/i18n/i18n_sh.properties":'\r\n\r\n\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n# XFLD: No Tasks found text\r\nSEARCH_LIST_NODATA_GENERIC=Rezultati nisu na\\u0111eni\r\n\r\n## Task List \r\n############\r\n\r\n# XTIT: Shell title\r\nSHELL_TITLE=Zadaci\r\n# XTIT: Task list title\r\nLIST_PAGE_TITLE=Zadaci\r\n# XTIT: Task list title with number of tasks\r\nLIST_PAGE_TITLE_WITH_NUMBER=Otvorite zadatke ({0})\r\n# XTIT: Task list title wname for the add button\r\nLIST_ADD=Dodaj\r\n# XTIT: Application name\r\nMASTER_TITLE=Moji zadaci\r\n# XMSG: Busy text\r\nMASTER_BUSY_TEXT=U\\u010Ditavanje zadataka...\r\n# XMSG: Busy text\r\nMASTER_SEARCH_PLACEHOLDER=Tra\\u017Eenje...\r\n# XTOL: Search tool tip \r\nMASTER_SEARCH_TOOLTIP=Tra\\u017Ei zadatke\r\n#XTIT: This is the title for the Process Type section\r\nPROCESS_TYPE=Odaberi tip transakcije\r\n\r\n\r\n\r\n#Filters\r\n\r\n# XBUT: Filter Button for showing all open tasks\r\nLIST_FILTER_ALL_OPEN=Sve otvoreno\r\n# XBUT: Filter Button for showing all tasks that are due today\r\nLIST_FILTER_DUE_TODAY=Dospeva danas\r\n# XBUT: Filter Button for showing all tasks that are due this week\r\nLIST_FILTER_DUE_THIS_WEEK=Dospeva ove nedelje\r\n# XBUT: Filter Button for showing all completed tasks\r\nLIST_FILTER_COMPLETED=Zavr\\u0161eno\r\n\r\n# Filter Bar \r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_BAR_COMPLETED=Filtrirano po zavr\\u0161enim zadacima\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_TODAY=Filtrirano po zadacima koji dospevaju danas\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_THIS_WEEK=Filtrirano po zadacima koji dospevaju ove nedelje\r\n# XTIT: filtered by Account\r\nLIST_FILTER_BAR_ACCOUNT=Filtrirano po klijentu {0}\r\n\r\n# Filter Title\r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_TITLE_COMPLETED=Zavr\\u0161eni zadaci ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_TODAY=Zadaci koji dospevaju danas ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_THIS_WEEK=Zadaci koji dospevaju ove nedelje ({0})\r\n# XTIT: filtered by Account\r\nLIST_FILTER_TITLE_ACCOUNT=Filtrirano po klijentu {0} ({1})\r\n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TODAY=Danas\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TOMORROW=Sutra\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_YESTERDAY=Ju\\u010De\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_IN_X_DAYS=Za {0} dana\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_X_DAYS_AGO=Pre {0} dana\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Odgovorni ste za {0} od {1} zadataka. Prikazani su samo va\\u0161i zadaci.\r\n# XTIT: Confirmation message to indicate that the task has been completed\r\nLIST_COMPLETE_CONFIRMATION=Zadatak {0} je postavljen na Zavr\\u0161eno\r\n\r\n## Task Details \r\n###############\r\n\r\n# XTIT: task detail view name\r\nMC_DETAILS_TITLE=Detalji zavr\\u0161etka\r\n# XTIT: task detail title\r\nDETAILS_PAGE_TITLE=Zadaci\r\n# XSEL: new task default text\r\nNEW_TASK_INPUT_PLACEHOLDER=Novi zadatak\r\n# XTIT: initial title of a tasks\r\nNEW_TASK_TITLE=Nenaslovljeno\r\n# XTIT: page title of a newly created task\r\nNEW_TASK_PAGE_TITLE=Novi zadatak\r\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\r\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE=Prosledio {0}, {1}\r\n\r\n\r\n#Form\r\n\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TITLE=Naslov\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_NOTE=Bele\\u0161ka\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_DUE_DATE=Datum dospe\\u0107a\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_ACCOUNT=Ra\\u010Dun\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_CONTACT=Kontakt\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIVATE=Privatno\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIORITY=Prioritet\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_STATUS=Status\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TYPE=Tip\r\n\r\n#Buttons\r\n\r\n# XBUT: Button for deleting the task\r\nDETAILS_BUTTONS_DELETE=Izbri\\u0161i zadatak\r\n# XBUT: Button for deleting the task\r\nDETAILS_FOOTER_BUTTON_DELETE=Izbri\\u0161i\r\n# XBUT: Button for canceling the task\r\nDETAILS_BUTTONS_CANCEL=Odustani\r\n# XBUT: Button for creating a new task or saving the existing task\r\nDETAILS_BUTTONS_SAVE=Sa\\u010Duvaj\r\n# XBUT: Button for assigning the task to another person\r\nDETAILS_BUTTONS_ASSIGNTO=Dodeli\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP=Naredna aktivnost\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_TASK=Naredni zadatak\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_OPPT=Naredna prilika\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_APPT=Naredni sastanak\r\n\r\n#Message Box\r\n\r\n# XBUT: Title for the message box\r\nDETAILS_MESSAGEBOX_TITLE=Izbri\\u0161i\r\n# YMSG: Text for the message box\r\nDETAILS_MESSAGEBOX_TEXT=Da li sigurno \\u017Eelite da izbri\\u0161ete ovaj zadatak?\r\n# XTIT: Confirmation message\r\nDETAILS_DELETE_CONFIRMATION=Zadatak {0} izbrisan\r\n#XTIT: Warning message\r\nNAVBACK_WARNING_TITLE=Upozorenje\r\n#YMSG: Text for the message box\r\nNAVBACK_WARNING_MESSAGE=Va\\u0161i unosi \\u0107e biti izgubljeni; da li sigurno \\u017Eelite da napustite ovu stranicu?\r\n\r\n#Value Help \r\n\r\n# XTIT: Title for Value Help Account\r\nDETAILS_VALUE_HELP_ACC_TITLE=Odaberi klijenta\r\n# XTIT: Title for Value Help Contact\r\nDETAILS_VALUE_HELP_CON_TITLE=Odaberi kontakt\r\n# YMSG: Filtered by info bar text for contact search popup\r\nDETAILS_VALUE_HELP_FILTERED_BY=Filtrirano po\r\n# XTIT: Account VH item description: city, country\r\nDETAILS_VALUE_HELP_ACC_DESCR={0}, {1}\r\n# XTIT: Contact VH item description: account name, function\r\nDETAILS_VALUE_HELP_CON_DESCR={0}, {1}\r\n\r\n\r\n#Business card Account and Contact\r\n\r\n# XTIT: Title for business card Account\r\nDETAILS_BCARD_ACCOUNT=Pregled klijenta\r\n# XTIT: Title for business card Contact\r\nDETAILS_BCARD_CONTACT=Pregled kontakta\r\n\r\n#Assign task to\r\n\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TITLE=Dodeli\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TEXT=Dodeli zadatak\r\n# XTIT: Title for employee search\r\nDETAILS_ASSIGNTO_ASIGNEE=Dodeli zadatak zaposlenom\r\n# XTIT: Confirmation message\r\nDETAILS_ASSIGNTO_CONFIRMATION=Zadatak dodeljen {0}\r\n# XBUT: Button on dialog: ok\r\nDIALOG_ASSIGNTO_BUTTON_OK=OK\r\n# XBUT: Button on dialog: cancel\r\nDIALOG_ASSIGNTO_BUTTON_CANCEL=Odustani\r\n\r\n# errors\r\n\r\n# YMSG: generic error\r\nGENERIC_ERROR=Sistem trenutno nije dostupan; poku\\u0161ajte ponovno kasnije ili obavestite sistemskog administratora\r\n# YMSG: error in date\r\nDETAILS_MESSAGETEXT_DATE=Datum nije va\\u017Ee\\u0107i ili nije u ta\\u010Dnom formatu; koristite pomo\\u0107 pri unosu za unos datuma\r\n# YMSG: error in account\r\nDETAILS_MESSAGETEXT_ACCOUNT=Koristite pomo\\u0107 pri unosu za unos klijenta\r\n# YMSG: error in contact\r\nDETAILS_MESSAGETEXT_CONTACT=Koristite pomo\\u0107 pri unosu za unos kontakta\r\n# YMSG: title for the validation message box after save is clicked\r\nDETAILS_VALIDATION_TITLE=Koristi pomo\\u0107 pri unosu\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=U\\u010Ditavanje...\r\n\r\n# XTIT: Title for Follow up Dialog\r\nDETAILS_FOLLOWUP_TITLE=Naredna aktivnost\r\n# XBUT: Button text for Follow up activities\r\nDETAILS_FOLLOWUP_BUTTON=Naredna aktivnost\r\n# XTIT: Title for Confirmation Dialog to save task or not \r\nDETAILS_CONFIRM_TITLE=Potvrda\r\n# YMSG: Prompt use to save existing task or not\r\nDETAILS_FOLLOWUP_MESSAGE=Da li \\u017Eelite da sa\\u010Duvate trenutni zadatak?\r\n# XBUT: Positive action to save the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_YES=Da\r\n# XBUT: Positive action to cancel the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_NO=Ne\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT=No follow up types available\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_TASK=Cannot proceed in creating a task since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_OPPT=Cannot proceed in creating an opportunity since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_APPT=Cannot proceed in creating an appointment since no follow up types are maintained\r\n# YMSG: Message shown to end user notifying that the follow up was successful\r\nFOLLOWUP_COMPLETED=Naredna aktivnost je bila uspe\\u0161na\r\n# YMSG: Message shown once the task is saved during a follow up scenario\r\nFOLLOWUP_TASK_SAVED=Naredni zadatak sa\\u010Duvan\r\n# YMSG: Message shown if a new or existing task is saved\r\nCURRENT_TASK_SAVED=Zadatak sa\\u010Duvan\r\n# YMSG: Error message shown to the end user telling that follow up activities cannot be done\r\nFOLLOWUP_ERROR_MSG=Trenutni zadatak ili {0} ima gre\\u0161ke ili postoje propratni tipovi transakcija odr\\u017Eavani u Prilago\\u0111avanju\r\n\r\n#XFLD: Transaction Type of a given task\r\nS4_TASK_TYPE=Tip\\: {0}\r\n#XFLD: Due Date of a given task\r\nS4_TASK_DUEDATE=Datum dospe\\u0107a\\: {0}\r\n#XFLD: Account of a given task\r\nS4_TASK_ACCOUNT=Klijent\\: {0}\r\n#XFLD: Contact of a given task\r\nS4_TASK_CONTACT=Kontakt\\: {0}\r\n#XFLD: Notes of a given task\r\nS4_TASK_NOTES=Bele\\u0161ke\r\n#XFLD: Attachments of a given task\r\nS4_TASK_ATTACHMENTS=Dodaci\\: {0}\r\n#XFLD: Transaction History of a given task\r\nS4_TASK_DOCHISTORY=Istorija transakcije\r\n# XBUT: Button for follow up of given task to a task\r\nS4_BUTTONS_FOLLOWUPTOTASK=Zadatak\r\n# XBUT: Button for follow up of given task to a opportunity\r\nS4_BUTTONS_FOLLOWUPTOOPPT=Prilika\r\n# XBUT: Button for follow up of given task to an appointment\r\nS4_BUTTONS_FOLLOWUPTOAPPT=Sastanak\r\n# XBUT: Button for editing the task\r\nS4_FOOTER_BUTTON_EDIT=Uredi\r\n#XFLD: Column Label for the transaction ID of the document\r\nS4_DOCHISTORY_ID=ID transakcije\r\n#XFLD: Column Label for the transaction type of the document\r\nS4_DOCHISTORY_TTYPE=Tip transakcije\r\n#XFLD: Column Label for the description of the document\r\nS4_DOCHISTORY_DESC=Opis\r\n#XFLD: Column Label for the creation date of the document\r\nS4_DOCHISTORY_CREATEDDATE=Kreirano\r\n#XFLD: Column Label for the relation type to indicate whether current document precedes/succeeds\r\nS4_DOCHISTORY_RELTYPE=Tip odnosa\r\n#XFLD: Label to be shown if no transaction history is available\r\nS4_NO_DOCHISTORY=Transakcije nisu dostupne\r\n# YMSG: Message shown when renaming an attachment of a task is successful\r\nS3_RENAME_ATTACHMENT_SUCCESS=Dodatak je uspe\\u0161no preimenovan\r\n# YMSG: Message shown when renaming an attachment of a task fails\r\nS3_RENAME_ATTACHMENT_FAILED=Dodatak nije mogu\\u0107e preimenovati\r\n# XBUT: Button for Displaying the Errors\r\nDETAILS_FOOTER_BUTTON_MESSAGE=Poruke\r\n#XTIT: Title of the messages dialog listing the messages with count\r\nS4_MESSAGES_TITLE=Poruke ({0})\r\n# YMSG: Message shown when when the user updates a task in its previous state\r\nS3_412_ERRORMSG=Podatke je promenio drugi korisnik; kliknite na dugme OK za najnoviju verziju\r\n#XTIT: Title of dialog indicating an error occurred\r\nS3_412_TITLE=Gre\\u0161ka\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS3_ACCOUNT_CONTACT_NOREL=Mo\\u017Eete da pogledate samo vizitkarte kontakata koji su dodeljeni ovom klijentu\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS4_ACCOUNT_CONTACT_NOREL=Mo\\u017Eete da pogledate samo vizitkarte kontakata koji su dodeljeni ovom klijentu\r\n',
	"cus/crm/mytasks/i18n/i18n_sk.properties":'\r\n\r\n\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n# XFLD: No Tasks found text\r\nSEARCH_LIST_NODATA_GENERIC=Nen\\u00E1jden\\u00E9 \\u017Eiadne v\\u00FDsledky\r\n\r\n## Task List \r\n############\r\n\r\n# XTIT: Shell title\r\nSHELL_TITLE=\\u00DAlohy\r\n# XTIT: Task list title\r\nLIST_PAGE_TITLE=\\u00DAlohy\r\n# XTIT: Task list title with number of tasks\r\nLIST_PAGE_TITLE_WITH_NUMBER=Otvoren\\u00E9 \\u00FAlohy ({0})\r\n# XTIT: Task list title wname for the add button\r\nLIST_ADD=Prida\\u0165\r\n# XTIT: Application name\r\nMASTER_TITLE=Moje \\u00FAlohy\r\n# XMSG: Busy text\r\nMASTER_BUSY_TEXT=Na\\u010D\\u00EDtavaj\\u00FA sa \\u00FAlohy...\r\n# XMSG: Busy text\r\nMASTER_SEARCH_PLACEHOLDER=H\\u013Eada\\u0165...\r\n# XTOL: Search tool tip \r\nMASTER_SEARCH_TOOLTIP=H\\u013Eada\\u0165 \\u00FAlohy\r\n#XTIT: This is the title for the Process Type section\r\nPROCESS_TYPE=Vybra\\u0165 typ transakcie\r\n\r\n\r\n\r\n#Filters\r\n\r\n# XBUT: Filter Button for showing all open tasks\r\nLIST_FILTER_ALL_OPEN=V\\u0161etky otvoren\\u00E9\r\n# XBUT: Filter Button for showing all tasks that are due today\r\nLIST_FILTER_DUE_TODAY=Term\\u00EDn dnes\r\n# XBUT: Filter Button for showing all tasks that are due this week\r\nLIST_FILTER_DUE_THIS_WEEK=Term\\u00EDn tento t\\u00FD\\u017Ede\\u0148\r\n# XBUT: Filter Button for showing all completed tasks\r\nLIST_FILTER_COMPLETED=Dokon\\u010Den\\u00E9\r\n\r\n# Filter Bar \r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_BAR_COMPLETED=Filtrovan\\u00E9 pod\\u013Ea dokon\\u010Den\\u00FDch \\u00FAloh\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_TODAY=Filtrovan\\u00E9 pod\\u013Ea \\u00FAloh s dne\\u0161n\\u00FDm term\\u00EDnom\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_THIS_WEEK=Filtrovan\\u00E9 pod\\u013Ea \\u00FAloh s term\\u00EDnom tento t\\u00FD\\u017Ede\\u0148\r\n# XTIT: filtered by Account\r\nLIST_FILTER_BAR_ACCOUNT=Filtrovan\\u00E9 pod\\u013Ea z\\u00E1kazn\\u00EDka {0}\r\n\r\n# Filter Title\r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_TITLE_COMPLETED=Dokon\\u010Den\\u00E9 \\u00FAlohy ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_TODAY=\\u00DAlohy s dne\\u0161n\\u00FDm term\\u00EDnom  ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_THIS_WEEK=\\u00DAlohy s term\\u00EDnom tento t\\u00FD\\u017Ede\\u0148 ({0})\r\n# XTIT: filtered by Account\r\nLIST_FILTER_TITLE_ACCOUNT=Filtrovan\\u00E9 pod\\u013Ea z\\u00E1kazn\\u00EDka {0} ({1})\r\n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TODAY=Dnes\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TOMORROW=Zajtra\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_YESTERDAY=V\\u010Dera\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_IN_X_DAYS=O {0} dn\\u00ED\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_X_DAYS_AGO=Pred {0} d\\u0148ami\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Ste zodpovedn\\u00FD za {0} z {1} \\u00FAloh. Zobrazia sa len va\\u0161e \\u00FAlohy.\r\n# XTIT: Confirmation message to indicate that the task has been completed\r\nLIST_COMPLETE_CONFIRMATION=\\u00DAloha {0} bola nastaven\\u00E1 ako dokon\\u010Den\\u00E1\r\n\r\n## Task Details \r\n###############\r\n\r\n# XTIT: task detail view name\r\nMC_DETAILS_TITLE=Podrobnosti \\u00FAlohy\r\n# XTIT: task detail title\r\nDETAILS_PAGE_TITLE=\\u00DAlohy\r\n# XSEL: new task default text\r\nNEW_TASK_INPUT_PLACEHOLDER=Nov\\u00E1 \\u00FAloha\r\n# XTIT: initial title of a tasks\r\nNEW_TASK_TITLE=Bez n\\u00E1zvu\r\n# XTIT: page title of a newly created task\r\nNEW_TASK_PAGE_TITLE=Nov\\u00E1 \\u00FAloha\r\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\r\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE=Odovzdal {0}, {1}\r\n\r\n\r\n#Form\r\n\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TITLE=Oslovenie\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_NOTE=Pozn\\u00E1mka\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_DUE_DATE=Term\\u00EDn splnenia\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_ACCOUNT=Z\\u00E1kazn\\u00EDk\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_CONTACT=Kontakt\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIVATE=S\\u00FAkromn\\u00E9\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIORITY=Priorita\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_STATUS=Stav\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TYPE=Typ\r\n\r\n#Buttons\r\n\r\n# XBUT: Button for deleting the task\r\nDETAILS_BUTTONS_DELETE=Odstr\\u00E1ni\\u0165 \\u00FAlohu\r\n# XBUT: Button for deleting the task\r\nDETAILS_FOOTER_BUTTON_DELETE=Odstr\\u00E1ni\\u0165\r\n# XBUT: Button for canceling the task\r\nDETAILS_BUTTONS_CANCEL=Zru\\u0161i\\u0165\r\n# XBUT: Button for creating a new task or saving the existing task\r\nDETAILS_BUTTONS_SAVE=Ulo\\u017Ei\\u0165\r\n# XBUT: Button for assigning the task to another person\r\nDETAILS_BUTTONS_ASSIGNTO=Priradi\\u0165\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP=N\\u00E1sledn\\u00E1 oper\\u00E1cia\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_TASK=Sledova\\u0165 \\u00FAlohu\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_OPPT=Sledova\\u0165 pr\\u00EDle\\u017Eitos\\u0165\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_APPT=Sledova\\u0165 sch\\u00F4dzku\r\n\r\n#Message Box\r\n\r\n# XBUT: Title for the message box\r\nDETAILS_MESSAGEBOX_TITLE=Odstr\\u00E1ni\\u0165\r\n# YMSG: Text for the message box\r\nDETAILS_MESSAGEBOX_TEXT=Naozaj chcete t\\u00FAto \\u00FAlohu odstr\\u00E1ni\\u0165?\r\n# XTIT: Confirmation message\r\nDETAILS_DELETE_CONFIRMATION=\\u00DAloha {0} odstr\\u00E1nen\\u00E1\r\n#XTIT: Warning message\r\nNAVBACK_WARNING_TITLE=Upozornenie\r\n#YMSG: Text for the message box\r\nNAVBACK_WARNING_MESSAGE=Va\\u0161e z\\u00E1znamy sa stratia; naozaj chcete t\\u00FAto str\\u00E1nku opusti\\u0165?\r\n\r\n#Value Help \r\n\r\n# XTIT: Title for Value Help Account\r\nDETAILS_VALUE_HELP_ACC_TITLE=Vybra\\u0165 z\\u00E1kazn\\u00EDka\r\n# XTIT: Title for Value Help Contact\r\nDETAILS_VALUE_HELP_CON_TITLE=Vybra\\u0165 kontakt\r\n# YMSG: Filtered by info bar text for contact search popup\r\nDETAILS_VALUE_HELP_FILTERED_BY=Filtrovan\\u00E9 pod\\u013Ea\r\n# XTIT: Account VH item description: city, country\r\nDETAILS_VALUE_HELP_ACC_DESCR={0}, {1}\r\n# XTIT: Contact VH item description: account name, function\r\nDETAILS_VALUE_HELP_CON_DESCR={0}, {1}\r\n\r\n\r\n#Business card Account and Contact\r\n\r\n# XTIT: Title for business card Account\r\nDETAILS_BCARD_ACCOUNT=Preh\\u013Ead z\\u00E1kazn\\u00EDkov\r\n# XTIT: Title for business card Contact\r\nDETAILS_BCARD_CONTACT=Preh\\u013Ead kontaktov\r\n\r\n#Assign task to\r\n\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TITLE=Priradi\\u0165\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TEXT=Priradi\\u0165 \\u00FAlohu k\r\n# XTIT: Title for employee search\r\nDETAILS_ASSIGNTO_ASIGNEE=Priradi\\u0165 \\u00FAlohu zamestnancovi\r\n# XTIT: Confirmation message\r\nDETAILS_ASSIGNTO_CONFIRMATION=\\u00DAloha priraden\\u00E1 {0}\r\n# XBUT: Button on dialog: ok\r\nDIALOG_ASSIGNTO_BUTTON_OK=OK\r\n# XBUT: Button on dialog: cancel\r\nDIALOG_ASSIGNTO_BUTTON_CANCEL=Zru\\u0161i\\u0165\r\n\r\n# errors\r\n\r\n# YMSG: generic error\r\nGENERIC_ERROR=Syst\\u00E9m nie je moment\\u00E1lne dostupn\\u00FD. Sk\\u00FAste to znova nesk\\u00F4r alebo sa obr\\u00E1\\u0165te na spr\\u00E1vcu syst\\u00E9mu\r\n# YMSG: error in date\r\nDETAILS_MESSAGETEXT_DATE=D\\u00E1tum nie je platn\\u00FD alebo nie je v spr\\u00E1vnom form\\u00E1te; zadajte d\\u00E1tum pomocou n\\u00E1povede pre zad\\u00E1vanie\r\n# YMSG: error in account\r\nDETAILS_MESSAGETEXT_ACCOUNT=Zadajte z\\u00E1kazn\\u00EDka pomocou n\\u00E1povede pre zad\\u00E1vanie\r\n# YMSG: error in contact\r\nDETAILS_MESSAGETEXT_CONTACT=Zadajte kontakt pomocou n\\u00E1povede pre zad\\u00E1vanie\r\n# YMSG: title for the validation message box after save is clicked\r\nDETAILS_VALIDATION_TITLE=Pou\\u017Eite n\\u00E1pove\\u010F pre zad\\u00E1vanie\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=Na\\u010D\\u00EDtava sa...\r\n\r\n# XTIT: Title for Follow up Dialog\r\nDETAILS_FOLLOWUP_TITLE=N\\u00E1sledn\\u00E1 oper\\u00E1cia\r\n# XBUT: Button text for Follow up activities\r\nDETAILS_FOLLOWUP_BUTTON=N\\u00E1sledn\\u00E1 oper\\u00E1cia\r\n# XTIT: Title for Confirmation Dialog to save task or not \r\nDETAILS_CONFIRM_TITLE=Potvrdenie\r\n# YMSG: Prompt use to save existing task or not\r\nDETAILS_FOLLOWUP_MESSAGE=Chcete ulo\\u017Ei\\u0165 aktu\\u00E1lnu \\u00FAlohu?\r\n# XBUT: Positive action to save the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_YES=\\u00C1no\r\n# XBUT: Positive action to cancel the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_NO=Nie\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT=No follow up types available\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_TASK=Cannot proceed in creating a task since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_OPPT=Cannot proceed in creating an opportunity since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_APPT=Cannot proceed in creating an appointment since no follow up types are maintained\r\n# YMSG: Message shown to end user notifying that the follow up was successful\r\nFOLLOWUP_COMPLETED=Sledovanie bolo \\u00FAspe\\u0161n\\u00E9\r\n# YMSG: Message shown once the task is saved during a follow up scenario\r\nFOLLOWUP_TASK_SAVED=N\\u00E1sledn\\u00E1 \\u00FAloha bola ulo\\u017Een\\u00E1\r\n# YMSG: Message shown if a new or existing task is saved\r\nCURRENT_TASK_SAVED=\\u00DAloha ulo\\u017Een\\u00E1\r\n# YMSG: Error message shown to the end user telling that follow up activities cannot be done\r\nFOLLOWUP_ERROR_MSG=Aktu\\u00E1lna \\u00FAloha {0} obsahuje chyby alebo v customizingu nie s\\u00FA udr\\u017Eiavan\\u00E9 \\u017Eiadne typy n\\u00E1sledn\\u00FDch transakci\\u00ED.\r\n\r\n#XFLD: Transaction Type of a given task\r\nS4_TASK_TYPE=Typ\\: {0}\r\n#XFLD: Due Date of a given task\r\nS4_TASK_DUEDATE=Term\\u00EDn\\: {0}\r\n#XFLD: Account of a given task\r\nS4_TASK_ACCOUNT=Z\\u00E1kazn\\u00EDk\\: {0}\r\n#XFLD: Contact of a given task\r\nS4_TASK_CONTACT=Kontakt\\: {0}\r\n#XFLD: Notes of a given task\r\nS4_TASK_NOTES=Pozn\\u00E1mky\r\n#XFLD: Attachments of a given task\r\nS4_TASK_ATTACHMENTS=Pr\\u00EDlohy\\: {0}\r\n#XFLD: Transaction History of a given task\r\nS4_TASK_DOCHISTORY=Hist\\u00F3ria transakcie\r\n# XBUT: Button for follow up of given task to a task\r\nS4_BUTTONS_FOLLOWUPTOTASK=\\u00DAloha\r\n# XBUT: Button for follow up of given task to a opportunity\r\nS4_BUTTONS_FOLLOWUPTOOPPT=Pr\\u00EDle\\u017Eitos\\u0165\r\n# XBUT: Button for follow up of given task to an appointment\r\nS4_BUTTONS_FOLLOWUPTOAPPT=Sch\\u00F4dzka\r\n# XBUT: Button for editing the task\r\nS4_FOOTER_BUTTON_EDIT=Upravi\\u0165\r\n#XFLD: Column Label for the transaction ID of the document\r\nS4_DOCHISTORY_ID=ID transakcie\r\n#XFLD: Column Label for the transaction type of the document\r\nS4_DOCHISTORY_TTYPE=Typ transakcie\r\n#XFLD: Column Label for the description of the document\r\nS4_DOCHISTORY_DESC=Popis\r\n#XFLD: Column Label for the creation date of the document\r\nS4_DOCHISTORY_CREATEDDATE=Vytvoren\\u00E9 d\\u0148a\r\n#XFLD: Column Label for the relation type to indicate whether current document precedes/succeeds\r\nS4_DOCHISTORY_RELTYPE=Typ vz\\u0165ahu\r\n#XFLD: Label to be shown if no transaction history is available\r\nS4_NO_DOCHISTORY=Nie s\\u00FA k dispoz\\u00EDcii \\u017Eiadne transakcie\r\n# YMSG: Message shown when renaming an attachment of a task is successful\r\nS3_RENAME_ATTACHMENT_SUCCESS=Pr\\u00EDloha bola \\u00FAspe\\u0161ne premenovan\\u00E1\r\n# YMSG: Message shown when renaming an attachment of a task fails\r\nS3_RENAME_ATTACHMENT_FAILED=Pr\\u00EDloha sa nedala premenova\\u0165\r\n# XBUT: Button for Displaying the Errors\r\nDETAILS_FOOTER_BUTTON_MESSAGE=Spr\\u00E1vy\r\n#XTIT: Title of the messages dialog listing the messages with count\r\nS4_MESSAGES_TITLE=Spr\\u00E1vy ({0})\r\n# YMSG: Message shown when when the user updates a task in its previous state\r\nS3_412_ERRORMSG=D\\u00E1ta zmenil in\\u00FD pou\\u017E\\u00EDvate\\u013E. Kliknite na OK, ak chcete vyvola\\u0165 najnov\\u0161iu verziu.\r\n#XTIT: Title of dialog indicating an error occurred\r\nS3_412_TITLE=Chyba\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS3_ACCOUNT_CONTACT_NOREL=M\\u00F4\\u017Eete zobrazi\\u0165 len vizitky kontaktov, ktor\\u00E9 boli priraden\\u00E9 tomuto z\\u00E1kazn\\u00EDkovi\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS4_ACCOUNT_CONTACT_NOREL=M\\u00F4\\u017Eete zobrazi\\u0165 len vizitky kontaktov, ktor\\u00E9 boli priraden\\u00E9 tomuto z\\u00E1kazn\\u00EDkovi\r\n',
	"cus/crm/mytasks/i18n/i18n_sl.properties":'\r\n\r\n\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n# XFLD: No Tasks found text\r\nSEARCH_LIST_NODATA_GENERIC=Ni najdenih rezultatov\r\n\r\n## Task List \r\n############\r\n\r\n# XTIT: Shell title\r\nSHELL_TITLE=Naloge\r\n# XTIT: Task list title\r\nLIST_PAGE_TITLE=Naloge\r\n# XTIT: Task list title with number of tasks\r\nLIST_PAGE_TITLE_WITH_NUMBER=Odprte naloge ({0})\r\n# XTIT: Task list title wname for the add button\r\nLIST_ADD=Dodajanje\r\n# XTIT: Application name\r\nMASTER_TITLE=Moje naloge\r\n# XMSG: Busy text\r\nMASTER_BUSY_TEXT=Nalaganje nalog ...\r\n# XMSG: Busy text\r\nMASTER_SEARCH_PLACEHOLDER=Iskanje ...\r\n# XTOL: Search tool tip \r\nMASTER_SEARCH_TOOLTIP=Iskanje nalog\r\n#XTIT: This is the title for the Process Type section\r\nPROCESS_TYPE=Izberite tip transakcije\r\n\r\n\r\n\r\n#Filters\r\n\r\n# XBUT: Filter Button for showing all open tasks\r\nLIST_FILTER_ALL_OPEN=Vse odprto\r\n# XBUT: Filter Button for showing all tasks that are due today\r\nLIST_FILTER_DUE_TODAY=Zapade danes\r\n# XBUT: Filter Button for showing all tasks that are due this week\r\nLIST_FILTER_DUE_THIS_WEEK=Zapade ta teden\r\n# XBUT: Filter Button for showing all completed tasks\r\nLIST_FILTER_COMPLETED=Zaklju\\u010Deno\r\n\r\n# Filter Bar \r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_BAR_COMPLETED=Filtrirano po zaklju\\u010Denih nalogah\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_TODAY=Filtrirano po nalogah, ki zapadejo danes\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_THIS_WEEK=Filtrirano po nalogah, ki zapadejo ta teden\r\n# XTIT: filtered by Account\r\nLIST_FILTER_BAR_ACCOUNT=Filtrirano po ra\\u010Dunu {0}\r\n\r\n# Filter Title\r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_TITLE_COMPLETED=Zaklju\\u010Dene naloge ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_TODAY=Naloge, ki zapadejo danes ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_THIS_WEEK=Naloge, ki zapadejo ta teden ({0})\r\n# XTIT: filtered by Account\r\nLIST_FILTER_TITLE_ACCOUNT=Filtrirano po ra\\u010Dunu {0} ({1})\r\n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TODAY=Danes\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TOMORROW=Jutri\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_YESTERDAY=V\\u010Deraj\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_IN_X_DAYS=V {0} dneh\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_X_DAYS_AGO=Pred {0} dnemi\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Odgovorni ste za {0} od {1} nalog. Prikazane so samo va\\u0161e naloge.\r\n# XTIT: Confirmation message to indicate that the task has been completed\r\nLIST_COMPLETE_CONFIRMATION=Naloga {0} je bila nastavljena na Zaklju\\u010Deno\r\n\r\n## Task Details \r\n###############\r\n\r\n# XTIT: task detail view name\r\nMC_DETAILS_TITLE=Detajli opravila\r\n# XTIT: task detail title\r\nDETAILS_PAGE_TITLE=Naloge\r\n# XSEL: new task default text\r\nNEW_TASK_INPUT_PLACEHOLDER=Nova naloga\r\n# XTIT: initial title of a tasks\r\nNEW_TASK_TITLE=Neimenovano\r\n# XTIT: page title of a newly created task\r\nNEW_TASK_PAGE_TITLE=Nova naloga\r\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\r\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE=Posredoval {0}, dne {1}\r\n\r\n\r\n#Form\r\n\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TITLE=Naslov\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_NOTE=Opomba\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_DUE_DATE=Datum zapadlosti\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_ACCOUNT=Stranka\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_CONTACT=Kontakt\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIVATE=Privatno\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIORITY=Prioriteta\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_STATUS=Status\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TYPE=Tip\r\n\r\n#Buttons\r\n\r\n# XBUT: Button for deleting the task\r\nDETAILS_BUTTONS_DELETE=Brisanje naloge\r\n# XBUT: Button for deleting the task\r\nDETAILS_FOOTER_BUTTON_DELETE=Brisanje\r\n# XBUT: Button for canceling the task\r\nDETAILS_BUTTONS_CANCEL=Prekinitev\r\n# XBUT: Button for creating a new task or saving the existing task\r\nDETAILS_BUTTONS_SAVE=Shranjevanje\r\n# XBUT: Button for assigning the task to another person\r\nDETAILS_BUTTONS_ASSIGNTO=Dodelitev za\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP=Slede\\u010Da aktivnost\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_TASK=Slede\\u010Da naloga\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_OPPT=Slede\\u010Da prilo\\u017Enost\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_APPT=Slede\\u010Di termin\r\n\r\n#Message Box\r\n\r\n# XBUT: Title for the message box\r\nDETAILS_MESSAGEBOX_TITLE=Brisanje\r\n# YMSG: Text for the message box\r\nDETAILS_MESSAGEBOX_TEXT=Res \\u017Eelite izbrisati to nalogo?\r\n# XTIT: Confirmation message\r\nDETAILS_DELETE_CONFIRMATION=Naloga {0} izbrisana\r\n#XTIT: Warning message\r\nNAVBACK_WARNING_TITLE=Opozorilo\r\n#YMSG: Text for the message box\r\nNAVBACK_WARNING_MESSAGE=Va\\u0161i vnosi bodo izgubljeni; res \\u017Eelite zapustiti to stran?\r\n\r\n#Value Help \r\n\r\n# XTIT: Title for Value Help Account\r\nDETAILS_VALUE_HELP_ACC_TITLE=Izbira stranke\r\n# XTIT: Title for Value Help Contact\r\nDETAILS_VALUE_HELP_CON_TITLE=Izbira kontakta\r\n# YMSG: Filtered by info bar text for contact search popup\r\nDETAILS_VALUE_HELP_FILTERED_BY=Filtrirano po\r\n# XTIT: Account VH item description: city, country\r\nDETAILS_VALUE_HELP_ACC_DESCR={0}, {1}\r\n# XTIT: Contact VH item description: account name, function\r\nDETAILS_VALUE_HELP_CON_DESCR={0}, {1}\r\n\r\n\r\n#Business card Account and Contact\r\n\r\n# XTIT: Title for business card Account\r\nDETAILS_BCARD_ACCOUNT=Pregled stranke\r\n# XTIT: Title for business card Contact\r\nDETAILS_BCARD_CONTACT=Pregled kontakta\r\n\r\n#Assign task to\r\n\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TITLE=Dodelitev za\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TEXT=Dodelitev naloge za\r\n# XTIT: Title for employee search\r\nDETAILS_ASSIGNTO_ASIGNEE=Dodelitev naloge zaposlenemu\r\n# XTIT: Confirmation message\r\nDETAILS_ASSIGNTO_CONFIRMATION=Naloga dodeljena {0}\r\n# XBUT: Button on dialog: ok\r\nDIALOG_ASSIGNTO_BUTTON_OK=OK\r\n# XBUT: Button on dialog: cancel\r\nDIALOG_ASSIGNTO_BUTTON_CANCEL=Prekinitev\r\n\r\n# errors\r\n\r\n# YMSG: generic error\r\nGENERIC_ERROR=Sistem trenutno ni na voljo; poskusite pozneje ali pa se obrnite na svojega administratorja sistema\r\n# YMSG: error in date\r\nDETAILS_MESSAGETEXT_DATE=Datum ni veljaven ali ni v pravilni obliki; uporabite pomo\\u010D pri vnosu za vnos datuma\r\n# YMSG: error in account\r\nDETAILS_MESSAGETEXT_ACCOUNT=Uporabite pomo\\u010D pri vnosu za vnos stranke\r\n# YMSG: error in contact\r\nDETAILS_MESSAGETEXT_CONTACT=Uporabite pomo\\u010D pri vnosu za vnos kontakta\r\n# YMSG: title for the validation message box after save is clicked\r\nDETAILS_VALIDATION_TITLE=Uporabite pomo\\u010D pri vnosu\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=Nalaganje poteka ...\r\n\r\n# XTIT: Title for Follow up Dialog\r\nDETAILS_FOLLOWUP_TITLE=Slede\\u010Da aktivnost\r\n# XBUT: Button text for Follow up activities\r\nDETAILS_FOLLOWUP_BUTTON=Slede\\u010Da aktivnost\r\n# XTIT: Title for Confirmation Dialog to save task or not \r\nDETAILS_CONFIRM_TITLE=Potrditev\r\n# YMSG: Prompt use to save existing task or not\r\nDETAILS_FOLLOWUP_MESSAGE=\\u017Delite shraniti trenutno nalogo?\r\n# XBUT: Positive action to save the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_YES=Da\r\n# XBUT: Positive action to cancel the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_NO=Ne\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT=No follow up types available\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_TASK=Cannot proceed in creating a task since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_OPPT=Cannot proceed in creating an opportunity since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_APPT=Cannot proceed in creating an appointment since no follow up types are maintained\r\n# YMSG: Message shown to end user notifying that the follow up was successful\r\nFOLLOWUP_COMPLETED=Slede\\u010Da aktivnost je bila uspe\\u0161na\r\n# YMSG: Message shown once the task is saved during a follow up scenario\r\nFOLLOWUP_TASK_SAVED=Slede\\u010Da naloga shranjena\r\n# YMSG: Message shown if a new or existing task is saved\r\nCURRENT_TASK_SAVED=Naloga shranjena\r\n# YMSG: Error message shown to the end user telling that follow up activities cannot be done\r\nFOLLOWUP_ERROR_MSG=Trenutna naloga {0} ima napake ali pa v Customizingu ni vzdr\\u017Eevanih slede\\u010Dih tipov transakcije\r\n\r\n#XFLD: Transaction Type of a given task\r\nS4_TASK_TYPE=Tip\\: {0}\r\n#XFLD: Due Date of a given task\r\nS4_TASK_DUEDATE=Datum zapadlosti\\: {0}\r\n#XFLD: Account of a given task\r\nS4_TASK_ACCOUNT=Ra\\u010Dun\\: {0}\r\n#XFLD: Contact of a given task\r\nS4_TASK_CONTACT=Kontakt\\: {0}\r\n#XFLD: Notes of a given task\r\nS4_TASK_NOTES=Zabele\\u017Eke\r\n#XFLD: Attachments of a given task\r\nS4_TASK_ATTACHMENTS=Priloge\\: {0}\r\n#XFLD: Transaction History of a given task\r\nS4_TASK_DOCHISTORY=Zgodovina transakcije\r\n# XBUT: Button for follow up of given task to a task\r\nS4_BUTTONS_FOLLOWUPTOTASK=Naloga\r\n# XBUT: Button for follow up of given task to a opportunity\r\nS4_BUTTONS_FOLLOWUPTOOPPT=Prilo\\u017Enost\r\n# XBUT: Button for follow up of given task to an appointment\r\nS4_BUTTONS_FOLLOWUPTOAPPT=Termin\r\n# XBUT: Button for editing the task\r\nS4_FOOTER_BUTTON_EDIT=Obdelava\r\n#XFLD: Column Label for the transaction ID of the document\r\nS4_DOCHISTORY_ID=ID transakcije\r\n#XFLD: Column Label for the transaction type of the document\r\nS4_DOCHISTORY_TTYPE=Tip transakcije\r\n#XFLD: Column Label for the description of the document\r\nS4_DOCHISTORY_DESC=Opis\r\n#XFLD: Column Label for the creation date of the document\r\nS4_DOCHISTORY_CREATEDDATE=Kreirano dne\r\n#XFLD: Column Label for the relation type to indicate whether current document precedes/succeeds\r\nS4_DOCHISTORY_RELTYPE=Tip odnosa\r\n#XFLD: Label to be shown if no transaction history is available\r\nS4_NO_DOCHISTORY=Ni razpolo\\u017Eljivih transakcij\r\n# YMSG: Message shown when renaming an attachment of a task is successful\r\nS3_RENAME_ATTACHMENT_SUCCESS=Priloga uspe\\u0161no preimenovana\r\n# YMSG: Message shown when renaming an attachment of a task fails\r\nS3_RENAME_ATTACHMENT_FAILED=Priloge ni bilo mogo\\u010De preimenovati\r\n# XBUT: Button for Displaying the Errors\r\nDETAILS_FOOTER_BUTTON_MESSAGE=Sporo\\u010Dila\r\n#XTIT: Title of the messages dialog listing the messages with count\r\nS4_MESSAGES_TITLE=Sporo\\u010Dila ({0})\r\n# YMSG: Message shown when when the user updates a task in its previous state\r\nS3_412_ERRORMSG=Podatke je spremenil drug uporabnik; kliknite OK za najnovej\\u0161o verzijo\r\n#XTIT: Title of dialog indicating an error occurred\r\nS3_412_TITLE=Napaka\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS3_ACCOUNT_CONTACT_NOREL=Prika\\u017Eete lahko le vizitke kontaktnih oseb, ki so bile dodeljene tej stranki\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS4_ACCOUNT_CONTACT_NOREL=Prika\\u017Eete lahko le vizitke kontaktnih oseb, ki so bile dodeljene tej stranki\r\n',
	"cus/crm/mytasks/i18n/i18n_tr.properties":'\r\n\r\n\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n# XFLD: No Tasks found text\r\nSEARCH_LIST_NODATA_GENERIC=Sonu\\u00E7 bulunamad\\u0131\r\n\r\n## Task List \r\n############\r\n\r\n# XTIT: Shell title\r\nSHELL_TITLE=G\\u00F6revler\r\n# XTIT: Task list title\r\nLIST_PAGE_TITLE=G\\u00F6revler\r\n# XTIT: Task list title with number of tasks\r\nLIST_PAGE_TITLE_WITH_NUMBER=G\\u00F6revleri a\\u00E7 ({0})\r\n# XTIT: Task list title wname for the add button\r\nLIST_ADD=Ekle\r\n# XTIT: Application name\r\nMASTER_TITLE=G\\u00F6revlerim\r\n# XMSG: Busy text\r\nMASTER_BUSY_TEXT=G\\u00F6revler y\\u00FCkleniyor...\r\n# XMSG: Busy text\r\nMASTER_SEARCH_PLACEHOLDER=Ara...\r\n# XTOL: Search tool tip \r\nMASTER_SEARCH_TOOLTIP=G\\u00F6revleri ara\r\n#XTIT: This is the title for the Process Type section\r\nPROCESS_TYPE=\\u0130\\u015Flem t\\u00FCr\\u00FC se\\u00E7\r\n\r\n\r\n\r\n#Filters\r\n\r\n# XBUT: Filter Button for showing all open tasks\r\nLIST_FILTER_ALL_OPEN=T\\u00FCm\\u00FC a\\u00E7\\u0131k\r\n# XBUT: Filter Button for showing all tasks that are due today\r\nLIST_FILTER_DUE_TODAY=Bug\\u00FCn s\\u00FCresi doluyor\r\n# XBUT: Filter Button for showing all tasks that are due this week\r\nLIST_FILTER_DUE_THIS_WEEK=Bu hafta s\\u00FCresi doluyor\r\n# XBUT: Filter Button for showing all completed tasks\r\nLIST_FILTER_COMPLETED=Tamamland\\u0131\r\n\r\n# Filter Bar \r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_BAR_COMPLETED=Tamamlanan g\\u00F6revlere g\\u00F6re filtreleme\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_TODAY=Bug\\u00FCn s\\u00FCresi dolan g\\u00F6revlere g\\u00F6re filtreleme\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_THIS_WEEK=Bu hafta s\\u00FCresi dolan g\\u00F6revlere g\\u00F6re filtreleme\r\n# XTIT: filtered by Account\r\nLIST_FILTER_BAR_ACCOUNT={0} m\\u00FC\\u015Fterisine g\\u00F6re filtrelendi\r\n\r\n# Filter Title\r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_TITLE_COMPLETED=Tamamlanan g\\u00F6revler ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_TODAY=Bug\\u00FCn s\\u00FCresi dolan g\\u00F6revler ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_THIS_WEEK=Bu hafta s\\u00FCresi dolan g\\u00F6revler ({0})\r\n# XTIT: filtered by Account\r\nLIST_FILTER_TITLE_ACCOUNT={0} ({1}) m\\u00FC\\u015Fterisine g\\u00F6re filtrelendi\r\n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TODAY=Bug\\u00FCn\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TOMORROW=Yar\\u0131n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_YESTERDAY=D\\u00FCn\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_IN_X_DAYS={0} g\\u00FCn i\\u00E7inde\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_X_DAYS_AGO={0} g\\u00FCn \\u00F6nce\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS={0} / {1} g\\u00F6rev i\\u00E7in sorumlusunuz. Yaln\\u0131z g\\u00F6revleriniz g\\u00F6r\\u00FCnt\\u00FCleniyor.\r\n# XTIT: Confirmation message to indicate that the task has been completed\r\nLIST_COMPLETE_CONFIRMATION=G\\u00F6rev {0} Tamamland\\u0131 olarak belirlendi\r\n\r\n## Task Details \r\n###############\r\n\r\n# XTIT: task detail view name\r\nMC_DETAILS_TITLE=G\\u00F6rev ayr\\u0131nt\\u0131lar\\u0131\r\n# XTIT: task detail title\r\nDETAILS_PAGE_TITLE=G\\u00F6revler\r\n# XSEL: new task default text\r\nNEW_TASK_INPUT_PLACEHOLDER=Yeni g\\u00F6rev\r\n# XTIT: initial title of a tasks\r\nNEW_TASK_TITLE=Ba\\u015Fl\\u0131ks\\u0131z\r\n# XTIT: page title of a newly created task\r\nNEW_TASK_PAGE_TITLE=Yeni g\\u00F6rev\r\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\r\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE={0}, {1} taraf\\u0131ndan iletildi\r\n\r\n\r\n#Form\r\n\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TITLE=Ba\\u015Fl\\u0131k\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_NOTE=Not\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_DUE_DATE=Son tarih\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_ACCOUNT=M\\u00FC\\u015Fteri\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_CONTACT=\\u0130lgili ki\\u015Fi\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIVATE=Ki\\u015Fisel\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIORITY=\\u00D6ncelik\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_STATUS=Durum\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TYPE=T\\u00FCr\r\n\r\n#Buttons\r\n\r\n# XBUT: Button for deleting the task\r\nDETAILS_BUTTONS_DELETE=G\\u00F6revi sil\r\n# XBUT: Button for deleting the task\r\nDETAILS_FOOTER_BUTTON_DELETE=Sil\r\n# XBUT: Button for canceling the task\r\nDETAILS_BUTTONS_CANCEL=\\u0130ptal\r\n# XBUT: Button for creating a new task or saving the existing task\r\nDETAILS_BUTTONS_SAVE=Kaydet\r\n# XBUT: Button for assigning the task to another person\r\nDETAILS_BUTTONS_ASSIGNTO=\\u015Euna tayin et\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP=Sonraki i\\u015Flem\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_TASK=Sonraki g\\u00F6rev\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_OPPT=Sonraki f\\u0131rsat\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_APPT=Sonraki randevu\r\n\r\n#Message Box\r\n\r\n# XBUT: Title for the message box\r\nDETAILS_MESSAGEBOX_TITLE=Sil\r\n# YMSG: Text for the message box\r\nDETAILS_MESSAGEBOX_TEXT=Bu g\\u00F6revi silmek istedi\\u011Finizden emin misiniz?\r\n# XTIT: Confirmation message\r\nDETAILS_DELETE_CONFIRMATION=G\\u00F6rev {0} silindi\r\n#XTIT: Warning message\r\nNAVBACK_WARNING_TITLE=Uyar\\u0131\r\n#YMSG: Text for the message box\r\nNAVBACK_WARNING_MESSAGE=Giri\\u015Fleriniz kaybolacak; bu sayfadan \\u00E7\\u0131kmak istedi\\u011Finize emin misiniz?\r\n\r\n#Value Help \r\n\r\n# XTIT: Title for Value Help Account\r\nDETAILS_VALUE_HELP_ACC_TITLE=M\\u00FC\\u015Fteri se\\u00E7\r\n# XTIT: Title for Value Help Contact\r\nDETAILS_VALUE_HELP_CON_TITLE=\\u0130lgili ki\\u015Fi se\\u00E7\r\n# YMSG: Filtered by info bar text for contact search popup\r\nDETAILS_VALUE_HELP_FILTERED_BY=Filtreleme \\u00F6l\\u00E7\\u00FCt\\u00FC\r\n# XTIT: Account VH item description: city, country\r\nDETAILS_VALUE_HELP_ACC_DESCR={0}, {1}\r\n# XTIT: Contact VH item description: account name, function\r\nDETAILS_VALUE_HELP_CON_DESCR={0}, {1}\r\n\r\n\r\n#Business card Account and Contact\r\n\r\n# XTIT: Title for business card Account\r\nDETAILS_BCARD_ACCOUNT=M\\u00FC\\u015Fteriye genel bak\\u0131\\u015F\r\n# XTIT: Title for business card Contact\r\nDETAILS_BCARD_CONTACT=\\u0130lgili ki\\u015Fiye genel bak\\u0131\\u015F\r\n\r\n#Assign task to\r\n\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TITLE=\\u015Euna tayin et\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TEXT=G\\u00F6revi \\u015Furaya tayin et\r\n# XTIT: Title for employee search\r\nDETAILS_ASSIGNTO_ASIGNEE=G\\u00F6revi \\u00E7al\\u0131\\u015Fana tayin et\r\n# XTIT: Confirmation message\r\nDETAILS_ASSIGNTO_CONFIRMATION=G\\u00F6rev \\u015Funa tayin edildi\\: {0}\r\n# XBUT: Button on dialog: ok\r\nDIALOG_ASSIGNTO_BUTTON_OK=Tamam\r\n# XBUT: Button on dialog: cancel\r\nDIALOG_ASSIGNTO_BUTTON_CANCEL=\\u0130ptal\r\n\r\n# errors\r\n\r\n# YMSG: generic error\r\nGENERIC_ERROR=Sistem \\u015Fu anda kullan\\u0131labilir de\\u011Fil; daha sonra yeniden deneyin veya sistem y\\u00F6neticinize ba\\u015Fvurun.\r\n# YMSG: error in date\r\nDETAILS_MESSAGETEXT_DATE=Tarih ge\\u00E7erli de\\u011Fil veya do\\u011Fru bi\\u00E7imde de\\u011Fil; tarih girmek i\\u00E7in giri\\u015F yard\\u0131m\\u0131n\\u0131 kullan\\u0131n\r\n# YMSG: error in account\r\nDETAILS_MESSAGETEXT_ACCOUNT=M\\u00FC\\u015Fteri girmek i\\u00E7in giri\\u015F yard\\u0131m\\u0131n\\u0131 kullan\\u0131n\r\n# YMSG: error in contact\r\nDETAILS_MESSAGETEXT_CONTACT=\\u0130lgili ki\\u015Fi girmek i\\u00E7in giri\\u015F yard\\u0131m\\u0131n\\u0131 kullan\\u0131n\r\n# YMSG: title for the validation message box after save is clicked\r\nDETAILS_VALIDATION_TITLE=Giri\\u015F yard\\u0131m\\u0131n\\u0131 kullan\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=Y\\u00FCkleniyor...\r\n\r\n# XTIT: Title for Follow up Dialog\r\nDETAILS_FOLLOWUP_TITLE=Sonraki i\\u015Flem\r\n# XBUT: Button text for Follow up activities\r\nDETAILS_FOLLOWUP_BUTTON=Sonraki i\\u015Flem\r\n# XTIT: Title for Confirmation Dialog to save task or not \r\nDETAILS_CONFIRM_TITLE=Teyit\r\n# YMSG: Prompt use to save existing task or not\r\nDETAILS_FOLLOWUP_MESSAGE=Ge\\u00E7erli g\\u00F6revi kaydetmek istiyor musunuz?\r\n# XBUT: Positive action to save the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_YES=Evet\r\n# XBUT: Positive action to cancel the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_NO=Hay\\u0131r\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT=No follow up types available\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_TASK=Cannot proceed in creating a task since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_OPPT=Cannot proceed in creating an opportunity since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_APPT=Cannot proceed in creating an appointment since no follow up types are maintained\r\n# YMSG: Message shown to end user notifying that the follow up was successful\r\nFOLLOWUP_COMPLETED=Sonraki i\\u015Flem ba\\u015Far\\u0131l\\u0131 oldu\r\n# YMSG: Message shown once the task is saved during a follow up scenario\r\nFOLLOWUP_TASK_SAVED=Sonraki g\\u00F6rev kaydedildi\r\n# YMSG: Message shown if a new or existing task is saved\r\nCURRENT_TASK_SAVED=G\\u00F6rev kaydedildi\r\n# YMSG: Error message shown to the end user telling that follow up activities cannot be done\r\nFOLLOWUP_ERROR_MSG=Ge\\u00E7erli g\\u00F6rev {0} hatalara sahip veya uyarlamada bak\\u0131m\\u0131 yap\\u0131lan sonraki i\\u015Flem t\\u00FCrleri yok\r\n\r\n#XFLD: Transaction Type of a given task\r\nS4_TASK_TYPE=T\\u00FCr\\: {0}\r\n#XFLD: Due Date of a given task\r\nS4_TASK_DUEDATE=Son tarih\\: {0}\r\n#XFLD: Account of a given task\r\nS4_TASK_ACCOUNT=Hesap\\: {0}\r\n#XFLD: Contact of a given task\r\nS4_TASK_CONTACT=\\ ilgili ki\\u015Fi\\: {0}\r\n#XFLD: Notes of a given task\r\nS4_TASK_NOTES=Notlar\r\n#XFLD: Attachments of a given task\r\nS4_TASK_ATTACHMENTS=Ekler\\: {0}\r\n#XFLD: Transaction History of a given task\r\nS4_TASK_DOCHISTORY=\\u0130\\u015Flem ge\\u00E7mi\\u015Fi\r\n# XBUT: Button for follow up of given task to a task\r\nS4_BUTTONS_FOLLOWUPTOTASK=G\\u00F6rev\r\n# XBUT: Button for follow up of given task to a opportunity\r\nS4_BUTTONS_FOLLOWUPTOOPPT=F\\u0131rsat\r\n# XBUT: Button for follow up of given task to an appointment\r\nS4_BUTTONS_FOLLOWUPTOAPPT=Randevu\r\n# XBUT: Button for editing the task\r\nS4_FOOTER_BUTTON_EDIT=D\\u00FCzenle\r\n#XFLD: Column Label for the transaction ID of the document\r\nS4_DOCHISTORY_ID=\\u0130\\u015Flem tan\\u0131t\\u0131c\\u0131s\\u0131\r\n#XFLD: Column Label for the transaction type of the document\r\nS4_DOCHISTORY_TTYPE=\\u0130\\u015Flem t\\u00FCr\\u00FC\r\n#XFLD: Column Label for the description of the document\r\nS4_DOCHISTORY_DESC=Tan\\u0131m\r\n#XFLD: Column Label for the creation date of the document\r\nS4_DOCHISTORY_CREATEDDATE=Olu\\u015Fturma tarihi\r\n#XFLD: Column Label for the relation type to indicate whether current document precedes/succeeds\r\nS4_DOCHISTORY_RELTYPE=\\u0130li\\u015Fki t\\u00FCr\\u00FC\r\n#XFLD: Label to be shown if no transaction history is available\r\nS4_NO_DOCHISTORY=\\u0130\\u015Flem mevcut de\\u011Fil\r\n# YMSG: Message shown when renaming an attachment of a task is successful\r\nS3_RENAME_ATTACHMENT_SUCCESS=Ek ba\\u015Far\\u0131yla yeniden adland\\u0131r\\u0131ld\\u0131\r\n# YMSG: Message shown when renaming an attachment of a task fails\r\nS3_RENAME_ATTACHMENT_FAILED=Ek yeniden adland\\u0131r\\u0131lamad\\u0131\r\n# XBUT: Button for Displaying the Errors\r\nDETAILS_FOOTER_BUTTON_MESSAGE=\\u0130letiler\r\n#XTIT: Title of the messages dialog listing the messages with count\r\nS4_MESSAGES_TITLE=\\u0130letiler ({0})\r\n# YMSG: Message shown when when the user updates a task in its previous state\r\nS3_412_ERRORMSG=Veriler ba\\u015Fka bir kullan\\u0131c\\u0131 taraf\\u0131ndan de\\u011Fi\\u015Ftirildi; en son versiyon i\\u00E7in Tamam\'a t\\u0131klay\\u0131n\r\n#XTIT: Title of dialog indicating an error occurred\r\nS3_412_TITLE=Hata\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS3_ACCOUNT_CONTACT_NOREL=Yaln\\u0131z bu m\\u00FC\\u015Fteriye tayin etti\\u011Finiz ilgili ki\\u015Filerin kartvizitlerini g\\u00F6r\\u00FCnt\\u00FCleyebilirsiniz\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS4_ACCOUNT_CONTACT_NOREL=Yaln\\u0131z bu m\\u00FC\\u015Fteriye tayin etti\\u011Finiz ilgili ki\\u015Filerin kartvizitlerini g\\u00F6r\\u00FCnt\\u00FCleyebilirsiniz\r\n',
	"cus/crm/mytasks/i18n/i18n_zh_CN.properties":'\r\n\r\n\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n# XFLD: No Tasks found text\r\nSEARCH_LIST_NODATA_GENERIC=\\u672A\\u627E\\u5230\\u7ED3\\u679C\r\n\r\n## Task List \r\n############\r\n\r\n# XTIT: Shell title\r\nSHELL_TITLE=\\u4EFB\\u52A1\r\n# XTIT: Task list title\r\nLIST_PAGE_TITLE=\\u4EFB\\u52A1\r\n# XTIT: Task list title with number of tasks\r\nLIST_PAGE_TITLE_WITH_NUMBER=\\u672A\\u5904\\u7406\\u4EFB\\u52A1 ({0})\r\n# XTIT: Task list title wname for the add button\r\nLIST_ADD=\\u6DFB\\u52A0\r\n# XTIT: Application name\r\nMASTER_TITLE=\\u6211\\u7684\\u4EFB\\u52A1\r\n# XMSG: Busy text\r\nMASTER_BUSY_TEXT=\\u6B63\\u5728\\u52A0\\u8F7D\\u4EFB\\u52A1...\r\n# XMSG: Busy text\r\nMASTER_SEARCH_PLACEHOLDER=\\u641C\\u7D22...\r\n# XTOL: Search tool tip \r\nMASTER_SEARCH_TOOLTIP=\\u641C\\u7D22\\u4EFB\\u52A1\r\n#XTIT: This is the title for the Process Type section\r\nPROCESS_TYPE=\\u9009\\u62E9\\u4EA4\\u6613\\u7C7B\\u578B\r\n\r\n\r\n\r\n#Filters\r\n\r\n# XBUT: Filter Button for showing all open tasks\r\nLIST_FILTER_ALL_OPEN=\\u6240\\u6709\\u672A\\u5904\\u7406\r\n# XBUT: Filter Button for showing all tasks that are due today\r\nLIST_FILTER_DUE_TODAY=\\u4ECA\\u5929\\u5230\\u671F\r\n# XBUT: Filter Button for showing all tasks that are due this week\r\nLIST_FILTER_DUE_THIS_WEEK=\\u672C\\u5468\\u5230\\u671F\r\n# XBUT: Filter Button for showing all completed tasks\r\nLIST_FILTER_COMPLETED=\\u5DF2\\u5B8C\\u6210\r\n\r\n# Filter Bar \r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_BAR_COMPLETED=\\u6309\\u5DF2\\u5B8C\\u6210\\u4EFB\\u52A1\\u8FC7\\u6EE4\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_TODAY=\\u6309\\u4ECA\\u5929\\u5230\\u671F\\u7684\\u4EFB\\u52A1\\u8FC7\\u6EE4\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_THIS_WEEK=\\u6309\\u672C\\u5468\\u5230\\u671F\\u7684\\u4EFB\\u52A1\\u8FC7\\u6EE4\r\n# XTIT: filtered by Account\r\nLIST_FILTER_BAR_ACCOUNT=\\u6309\\u5BA2\\u6237 {0} \\u8FC7\\u6EE4\r\n\r\n# Filter Title\r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_TITLE_COMPLETED=\\u5DF2\\u5B8C\\u6210\\u7684\\u4EFB\\u52A1 ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_TODAY=\\u4ECA\\u5929\\u5230\\u671F\\u7684\\u4EFB\\u52A1 ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_THIS_WEEK=\\u672C\\u5468\\u5230\\u671F\\u7684\\u4EFB\\u52A1 ({0})\r\n# XTIT: filtered by Account\r\nLIST_FILTER_TITLE_ACCOUNT=\\u6309\\u5BA2\\u6237 {0} ({1}) \\u8FC7\\u6EE4\r\n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TODAY=\\u4ECA\\u5929\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TOMORROW=\\u660E\\u5929\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_YESTERDAY=\\u6628\\u5929\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_IN_X_DAYS={0} \\u5929\\u540E\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_X_DAYS_AGO={0} \\u5929\\u524D\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=\\u60A8\\u8D1F\\u8D23 {0} \\u9879\\u4EFB\\u52A1\\uFF08\\u5171 {1} \\u9879\\uFF09\\u3002 \\u4EC5\\u663E\\u793A\\u60A8\\u7684\\u4EFB\\u52A1\\u3002\r\n# XTIT: Confirmation message to indicate that the task has been completed\r\nLIST_COMPLETE_CONFIRMATION=\\u4EFB\\u52A1 {0} \\u5DF2\\u8BBE\\u7F6E\\u4E3A\\u201C\\u5DF2\\u5B8C\\u6210\\u201D\r\n\r\n## Task Details \r\n###############\r\n\r\n# XTIT: task detail view name\r\nMC_DETAILS_TITLE=\\u4EFB\\u52A1\\u8BE6\\u7EC6\\u4FE1\\u606F\r\n# XTIT: task detail title\r\nDETAILS_PAGE_TITLE=\\u4EFB\\u52A1\r\n# XSEL: new task default text\r\nNEW_TASK_INPUT_PLACEHOLDER=\\u65B0\\u5EFA\\u4EFB\\u52A1\r\n# XTIT: initial title of a tasks\r\nNEW_TASK_TITLE=\\u65E0\\u6807\\u9898\r\n# XTIT: page title of a newly created task\r\nNEW_TASK_PAGE_TITLE=\\u65B0\\u5EFA\\u4EFB\\u52A1\r\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\r\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE=\\u7531 {0} \\u4E8E {1} \\u8F6C\\u53D1\r\n\r\n\r\n#Form\r\n\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TITLE=\\u6807\\u9898\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_NOTE=\\u6CE8\\u91CA\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_DUE_DATE=\\u5230\\u671F\\u65E5\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_ACCOUNT=\\u5BA2\\u6237\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_CONTACT=\\u8054\\u7CFB\\u4EBA\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIVATE=\\u79C1\\u4EBA\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIORITY=\\u4F18\\u5148\\u7EA7\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_STATUS=\\u72B6\\u6001\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TYPE=\\u7C7B\\u578B\r\n\r\n#Buttons\r\n\r\n# XBUT: Button for deleting the task\r\nDETAILS_BUTTONS_DELETE=\\u5220\\u9664\\u4EFB\\u52A1\r\n# XBUT: Button for deleting the task\r\nDETAILS_FOOTER_BUTTON_DELETE=\\u5220\\u9664\r\n# XBUT: Button for canceling the task\r\nDETAILS_BUTTONS_CANCEL=\\u53D6\\u6D88\r\n# XBUT: Button for creating a new task or saving the existing task\r\nDETAILS_BUTTONS_SAVE=\\u4FDD\\u5B58\r\n# XBUT: Button for assigning the task to another person\r\nDETAILS_BUTTONS_ASSIGNTO=\\u5206\\u914D\\u5230\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP=\\u540E\\u7EED\\u64CD\\u4F5C\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_TASK=\\u8DDF\\u8FDB\\u4EFB\\u52A1\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_OPPT=\\u8DDF\\u8FDB\\u673A\\u4F1A\r\n# XBUT: Button for follow up of given task\r\nDETAILS_BUTTONS_FOLLOWUP_APPT=\\u8DDF\\u8FDB\\u9884\\u7EA6\r\n\r\n#Message Box\r\n\r\n# XBUT: Title for the message box\r\nDETAILS_MESSAGEBOX_TITLE=\\u5220\\u9664\r\n# YMSG: Text for the message box\r\nDETAILS_MESSAGEBOX_TEXT=\\u662F\\u5426\\u786E\\u5B9A\\u8981\\u5220\\u9664\\u6B64\\u4EFB\\u52A1\\uFF1F\r\n# XTIT: Confirmation message\r\nDETAILS_DELETE_CONFIRMATION=\\u5DF2\\u5220\\u9664\\u4EFB\\u52A1 {0}\r\n#XTIT: Warning message\r\nNAVBACK_WARNING_TITLE=\\u8B66\\u544A\r\n#YMSG: Text for the message box\r\nNAVBACK_WARNING_MESSAGE=\\u8F93\\u5165\\u5185\\u5BB9\\u5C06\\u4E22\\u5931\\uFF1B\\u662F\\u5426\\u786E\\u5B9A\\u8981\\u79BB\\u5F00\\u6B64\\u9875\\u9762\\uFF1F\r\n\r\n#Value Help \r\n\r\n# XTIT: Title for Value Help Account\r\nDETAILS_VALUE_HELP_ACC_TITLE=\\u9009\\u62E9\\u5BA2\\u6237\r\n# XTIT: Title for Value Help Contact\r\nDETAILS_VALUE_HELP_CON_TITLE=\\u9009\\u62E9\\u8054\\u7CFB\\u4EBA\r\n# YMSG: Filtered by info bar text for contact search popup\r\nDETAILS_VALUE_HELP_FILTERED_BY=\\u7B5B\\u9009\\u6761\\u4EF6\r\n# XTIT: Account VH item description: city, country\r\nDETAILS_VALUE_HELP_ACC_DESCR={0}\\uFF0C{1}\r\n# XTIT: Contact VH item description: account name, function\r\nDETAILS_VALUE_HELP_CON_DESCR={0}\\uFF0C{1}\r\n\r\n\r\n#Business card Account and Contact\r\n\r\n# XTIT: Title for business card Account\r\nDETAILS_BCARD_ACCOUNT=\\u5BA2\\u6237\\u6982\\u89C8\r\n# XTIT: Title for business card Contact\r\nDETAILS_BCARD_CONTACT=\\u8054\\u7CFB\\u4EBA\\u6982\\u89C8\r\n\r\n#Assign task to\r\n\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TITLE=\\u5206\\u914D\\u5230\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TEXT=\\u4EFB\\u52A1\\u63A5\\u6536\\u4EBA\\uFF1A\r\n# XTIT: Title for employee search\r\nDETAILS_ASSIGNTO_ASIGNEE=\\u5C06\\u4EFB\\u52A1\\u5206\\u914D\\u7ED9\\u5458\\u5DE5\r\n# XTIT: Confirmation message\r\nDETAILS_ASSIGNTO_CONFIRMATION=\\u4EFB\\u52A1\\u5DF2\\u5206\\u914D\\u5230 {0}\r\n# XBUT: Button on dialog: ok\r\nDIALOG_ASSIGNTO_BUTTON_OK=\\u786E\\u5B9A\r\n# XBUT: Button on dialog: cancel\r\nDIALOG_ASSIGNTO_BUTTON_CANCEL=\\u53D6\\u6D88\r\n\r\n# errors\r\n\r\n# YMSG: generic error\r\nGENERIC_ERROR=\\u7CFB\\u7EDF\\u5F53\\u524D\\u4E0D\\u53EF\\u7528\\uFF1B\\u8BF7\\u7A0D\\u540E\\u91CD\\u8BD5\\u6216\\u8054\\u7CFB\\u60A8\\u7684\\u7CFB\\u7EDF\\u7BA1\\u7406\\u5458\r\n# YMSG: error in date\r\nDETAILS_MESSAGETEXT_DATE=\\u65E5\\u671F\\u65E0\\u6548\\u6216\\u683C\\u5F0F\\u9519\\u8BEF\\uFF1B\\u8BF7\\u4F7F\\u7528\\u8F93\\u5165\\u5E2E\\u52A9\\u8F93\\u5165\\u65E5\\u671F\r\n# YMSG: error in account\r\nDETAILS_MESSAGETEXT_ACCOUNT=\\u4F7F\\u7528\\u8F93\\u5165\\u5E2E\\u52A9\\u8F93\\u5165\\u5BA2\\u6237\r\n# YMSG: error in contact\r\nDETAILS_MESSAGETEXT_CONTACT=\\u4F7F\\u7528\\u8F93\\u5165\\u5E2E\\u52A9\\u8F93\\u5165\\u8054\\u7CFB\\u4EBA\r\n# YMSG: title for the validation message box after save is clicked\r\nDETAILS_VALIDATION_TITLE=\\u4F7F\\u7528\\u8F93\\u5165\\u5E2E\\u52A9\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=\\u6B63\\u5728\\u52A0\\u8F7D...\r\n\r\n# XTIT: Title for Follow up Dialog\r\nDETAILS_FOLLOWUP_TITLE=\\u8DDF\\u8FDB\r\n# XBUT: Button text for Follow up activities\r\nDETAILS_FOLLOWUP_BUTTON=\\u8DDF\\u8FDB\r\n# XTIT: Title for Confirmation Dialog to save task or not \r\nDETAILS_CONFIRM_TITLE=\\u786E\\u8BA4\r\n# YMSG: Prompt use to save existing task or not\r\nDETAILS_FOLLOWUP_MESSAGE=\\u662F\\u5426\\u8981\\u4FDD\\u5B58\\u5F53\\u524D\\u4EFB\\u52A1\\uFF1F\r\n# XBUT: Positive action to save the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_YES=\\u662F\r\n# XBUT: Positive action to cancel the task and proceed with the follow up\r\nDETAILS_FOLLOWUP_NO=\\u5426\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT=No follow up types available\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_TASK=Cannot proceed in creating a task since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_OPPT=Cannot proceed in creating an opportunity since no follow up types are maintained\r\n# YMSG: No follow up transaction types available\r\n#FOLLOWUP_TYPES_NOT_PRESENT_APPT=Cannot proceed in creating an appointment since no follow up types are maintained\r\n# YMSG: Message shown to end user notifying that the follow up was successful\r\nFOLLOWUP_COMPLETED=\\u8DDF\\u8FDB\\u6210\\u529F\r\n# YMSG: Message shown once the task is saved during a follow up scenario\r\nFOLLOWUP_TASK_SAVED=\\u8DDF\\u8FDB\\u4EFB\\u52A1\\u5DF2\\u4FDD\\u5B58\r\n# YMSG: Message shown if a new or existing task is saved\r\nCURRENT_TASK_SAVED=\\u4EFB\\u52A1\\u5DF2\\u4FDD\\u5B58\r\n# YMSG: Error message shown to the end user telling that follow up activities cannot be done\r\nFOLLOWUP_ERROR_MSG=\\u5F53\\u524D\\u4EFB\\u52A1 {0} \\u5B58\\u5728\\u9519\\u8BEF\\u6216\\u672A\\u5728\\u5B9A\\u5236\\u4E2D\\u7EF4\\u62A4\\u8DDF\\u8FDB\\u4E8B\\u52A1\\u7C7B\\u578B\r\n\r\n#XFLD: Transaction Type of a given task\r\nS4_TASK_TYPE=\\u7C7B\\u578B\\uFF1A{0}\r\n#XFLD: Due Date of a given task\r\nS4_TASK_DUEDATE=\\u5230\\u671F\\u65E5\\u671F\\uFF1A{0}\r\n#XFLD: Account of a given task\r\nS4_TASK_ACCOUNT=\\u5BA2\\u6237\\uFF1A{0}\r\n#XFLD: Contact of a given task\r\nS4_TASK_CONTACT=\\u8054\\u7CFB\\u4EBA\\uFF1A{0}\r\n#XFLD: Notes of a given task\r\nS4_TASK_NOTES=\\u6CE8\\u91CA\r\n#XFLD: Attachments of a given task\r\nS4_TASK_ATTACHMENTS=\\u9644\\u4EF6\\uFF1A{0}\r\n#XFLD: Transaction History of a given task\r\nS4_TASK_DOCHISTORY=\\u4E8B\\u52A1\\u5386\\u53F2\\u8BB0\\u5F55\r\n# XBUT: Button for follow up of given task to a task\r\nS4_BUTTONS_FOLLOWUPTOTASK=\\u4EFB\\u52A1\r\n# XBUT: Button for follow up of given task to a opportunity\r\nS4_BUTTONS_FOLLOWUPTOOPPT=\\u673A\\u4F1A\r\n# XBUT: Button for follow up of given task to an appointment\r\nS4_BUTTONS_FOLLOWUPTOAPPT=\\u9884\\u7EA6\r\n# XBUT: Button for editing the task\r\nS4_FOOTER_BUTTON_EDIT=\\u7F16\\u8F91\r\n#XFLD: Column Label for the transaction ID of the document\r\nS4_DOCHISTORY_ID=\\u4EA4\\u6613\\u6807\\u8BC6\r\n#XFLD: Column Label for the transaction type of the document\r\nS4_DOCHISTORY_TTYPE=\\u4EA4\\u6613\\u7C7B\\u578B\r\n#XFLD: Column Label for the description of the document\r\nS4_DOCHISTORY_DESC=\\u63CF\\u8FF0\r\n#XFLD: Column Label for the creation date of the document\r\nS4_DOCHISTORY_CREATEDDATE=\\u521B\\u5EFA\\u65E5\\u671F\r\n#XFLD: Column Label for the relation type to indicate whether current document precedes/succeeds\r\nS4_DOCHISTORY_RELTYPE=\\u5173\\u7CFB\\u7C7B\\u578B\r\n#XFLD: Label to be shown if no transaction history is available\r\nS4_NO_DOCHISTORY=\\u65E0\\u53EF\\u7528\\u4EA4\\u6613\r\n# YMSG: Message shown when renaming an attachment of a task is successful\r\nS3_RENAME_ATTACHMENT_SUCCESS=\\u5DF2\\u6210\\u529F\\u91CD\\u547D\\u540D\\u9644\\u4EF6\r\n# YMSG: Message shown when renaming an attachment of a task fails\r\nS3_RENAME_ATTACHMENT_FAILED=\\u65E0\\u6CD5\\u91CD\\u547D\\u540D\\u9644\\u4EF6\r\n# XBUT: Button for Displaying the Errors\r\nDETAILS_FOOTER_BUTTON_MESSAGE=\\u6D88\\u606F\r\n#XTIT: Title of the messages dialog listing the messages with count\r\nS4_MESSAGES_TITLE=\\u6D88\\u606F ({0})\r\n# YMSG: Message shown when when the user updates a task in its previous state\r\nS3_412_ERRORMSG=\\u5176\\u4ED6\\u7528\\u6237\\u5DF2\\u66F4\\u6539\\u6570\\u636E\\uFF1B\\u8BF7\\u5355\\u51FB\\u201C\\u786E\\u5B9A\\u201D\\u83B7\\u53D6\\u6700\\u65B0\\u7248\\u672C\r\n#XTIT: Title of dialog indicating an error occurred\r\nS3_412_TITLE=\\u9519\\u8BEF\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS3_ACCOUNT_CONTACT_NOREL=\\u53EA\\u80FD\\u67E5\\u770B\\u5206\\u914D\\u7ED9\\u6B64\\u5BA2\\u6237\\u7684\\u8054\\u7CFB\\u4EBA\\u7684\\u540D\\u7247\r\n# YMSG: Message shown to user when viewing the contact information which has no relationship to associated account in the task\r\nS4_ACCOUNT_CONTACT_NOREL=\\u53EA\\u80FD\\u67E5\\u770B\\u5206\\u914D\\u7ED9\\u6B64\\u5BA2\\u6237\\u7684\\u8054\\u7CFB\\u4EBA\\u7684\\u540D\\u7247\r\n',
	"cus/crm/mytasks/i18n/i18n_zh_CN_.properties":'\r\n\r\n\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n# XFLD: No Tasks found text\r\nSEARCH_LIST_NODATA_GENERIC=\\u672A\\u627E\\u5230\\u7ED3\\u679C\r\n\r\n## Task List \r\n############\r\n\r\n# XTIT: Shell title\r\nSHELL_TITLE=\\u4EFB\\u52A1\r\n# XTIT: Task list title\r\nLIST_PAGE_TITLE=\\u4EFB\\u52A1\r\n# XTIT: Task list title with number of tasks\r\nLIST_PAGE_TITLE_WITH_NUMBER=\\u672A\\u5904\\u7406\\u4EFB\\u52A1 ({0})\r\n# XTIT: Task list title wname for the add button\r\nLIST_ADD=\\u6DFB\\u52A0\r\n# XTIT: Application name\r\nMASTER_TITLE=\\u6211\\u7684\\u4EFB\\u52A1\r\n# XMSG: Busy text\r\nMASTER_BUSY_TEXT=\\u6B63\\u5728\\u52A0\\u8F7D\\u4EFB\\u52A1...\r\n# XMSG: Busy text\r\nMASTER_SEARCH_PLACEHOLDER=\\u641C\\u7D22\r\n# XTOL: Search tool tip \r\nMASTER_SEARCH_TOOLTIP=\\u641C\\u7D22\\u4EFB\\u52A1\r\n#XTIT: This is the title for the Process Type section\r\nPROCESS_TYPE=\\u9009\\u62E9\\u4EA4\\u6613\\u7C7B\\u578B\r\n\r\n\r\n\r\n#Filters\r\n\r\n# XBUT: Filter Button for showing all open tasks\r\nLIST_FILTER_ALL_OPEN=\\u672A\\u5904\\u7406\r\n# XBUT: Filter Button for showing all tasks that are due today\r\nLIST_FILTER_DUE_TODAY=\\u4ECA\\u5929\\u5230\\u671F\r\n# XBUT: Filter Button for showing all tasks that are due this week\r\nLIST_FILTER_DUE_THIS_WEEK=\\u672C\\u5468\\u5230\\u671F\r\n# XBUT: Filter Button for showing all completed tasks\r\nLIST_FILTER_COMPLETED=\\u5DF2\\u5B8C\\u6210\r\n\r\n# Filter Bar \r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_BAR_COMPLETED=\\u6309\\u5DF2\\u5B8C\\u6210\\u4EFB\\u52A1\\u8FC7\\u6EE4\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_TODAY=\\u6309\\u4ECA\\u5929\\u5230\\u671F\\u7684\\u4EFB\\u52A1\\u8FC7\\u6EE4\r\n# XTIT: filtered by due today\r\nLIST_FILTER_BAR_THIS_WEEK=\\u6309\\u672C\\u5468\\u5230\\u671F\\u7684\\u4EFB\\u52A1\\u8FC7\\u6EE4\r\n# XTIT: filtered by Account\r\nLIST_FILTER_BAR_ACCOUNT=\\u6309\\u5BA2\\u6237 {0} \\u8FC7\\u6EE4\r\n\r\n# Filter Title\r\n\r\n# XTIT: filtered by completed \r\nLIST_FILTER_TITLE_COMPLETED=\\u5DF2\\u5B8C\\u6210\\u7684\\u4EFB\\u52A1 ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_TODAY=\\u4ECA\\u5929\\u5230\\u671F\\u7684\\u4EFB\\u52A1 ({0})\r\n# XTIT: filtered by due today\r\nLIST_FILTER_TITLE_THIS_WEEK=\\u672C\\u5468\\u5230\\u671F\\u7684\\u4EFB\\u52A1 ({0})\r\n# XTIT: filtered by Account\r\nLIST_FILTER_TITLE_ACCOUNT=\\u6309\\u5BA2\\u6237 {0} ({1}) \\u8FC7\\u6EE4\r\n\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TODAY=\\u4ECA\\u5929\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_TOMORROW=\\u660E\\u5929\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_YESTERDAY=\\u6628\\u5929\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_IN_X_DAYS={0} \\u5929\\u540E\r\n# XFLD: Due Date is shown like this in overview\r\nLIST_DUE_DATE_X_DAYS_AGO={0} \\u5929\\u524D\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=\\u60A8\\u8D1F\\u8D23 {0} \\u9879\\u4EFB\\u52A1\\uFF08\\u5171 {1} \\u9879\\uFF09\\u3002 \\u4EC5\\u663E\\u793A\\u60A8\\u7684\\u4EFB\\u52A1\\u3002\r\n# XTIT: Confirmation message\r\nLIST_COMPLETE_CONFIRMATION=\\u4EFB\\u52A1\\u5DF2\\u5B8C\\u6210\r\n\r\n## Task Details \r\n###############\r\n\r\n# XTIT: task detail view name\r\nMC_DETAILS_TITLE=\\u4EFB\\u52A1\\u8BE6\\u7EC6\\u4FE1\\u606F\r\n# XTIT: task detail title\r\nDETAILS_PAGE_TITLE=\\u4EFB\\u52A1\r\n# XSEL: new task default text\r\nNEW_TASK_INPUT_PLACEHOLDER=\\u65B0\\u5EFA\\u4EFB\\u52A1\r\n# XTIT: initial title of a tasks\r\nNEW_TASK_TITLE=\\u65E0\\u6807\\u9898\r\n# XTIT: page title of a newly created task\r\nNEW_TASK_PAGE_TITLE=\\u65B0\\u5EFA\\u4EFB\\u52A1\r\n# YMSG: forward by prefix for Note, 0 - name, 1 - date\r\nDETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE=\\u7531 {0} \\u4E8E {1} \\u8F6C\\u53D1\r\n\r\n\r\n#Form\r\n\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_TITLE=\\u6807\\u9898\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_NOTE=\\u6CE8\\u91CA\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_DUE_DATE=\\u5230\\u671F\\u65E5\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_ACCOUNT=\\u5BA2\\u6237\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_CONTACT=\\u8054\\u7CFB\\u4EBA\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIVATE=\\u79C1\\u4EBA\r\n# XFLD: Label in the form\r\nDETAILS_LABEL_PRIORITY=\\u4F18\\u5148\\u7EA7\r\n\r\n#Buttons\r\n\r\n# XBUT: Button for deleting the task\r\nDETAILS_BUTTONS_DELETE=\\u5220\\u9664\\u4EFB\\u52A1\r\n# XBUT: Button for canceling the task\r\nDETAILS_BUTTONS_CANCEL=\\u53D6\\u6D88\r\n# XBUT: Button for creating a new task or saving the existing task\r\nDETAILS_BUTTONS_SAVE=\\u4FDD\\u5B58\r\n# XBUT: Button for assigning the task to another person\r\nDETAILS_BUTTONS_ASSIGNTO=\\u5206\\u914D\\u5230\r\n\r\n#Message Box\r\n\r\n# XBUT: Title for the message box\r\nDETAILS_MESSAGEBOX_TITLE=\\u5220\\u9664\r\n# XBUT: Text for the message box\r\nDETAILS_MESSAGEBOX_TEXT=\\u662F\\u5426\\u5220\\u9664\\u4EFB\\u52A1\\uFF1F\r\n# XTIT: Confirmation message\r\nDETAILS_DELETE_CONFIRMATION=\\u5DF2\\u5220\\u9664\\u4EFB\\u52A1 {0}\r\n\r\n#Value Help \r\n\r\n# XTIT: Title for Value Help Account\r\nDETAILS_VALUE_HELP_ACC_TITLE=\\u9009\\u62E9\\u5BA2\\u6237\r\n# XTIT: Title for Value Help Contact\r\nDETAILS_VALUE_HELP_CON_TITLE=\\u9009\\u62E9\\u8054\\u7CFB\\u4EBA\r\n# YMSG: Filtered by info bar text for contact search popup\r\nDETAILS_VALUE_HELP_FILTERED_BY=\\u8FC7\\u6EE4\\u6761\\u4EF6\r\n# XTIT: Account VH item description: city, country\r\nDETAILS_VALUE_HELP_ACC_DESCR={0}\\uFF0C{1}\r\n# XTIT: Contact VH item description: account name, function\r\nDETAILS_VALUE_HELP_CON_DESCR={0}\\uFF0C{1}\r\n\r\n\r\n#Business card Account and Contact\r\n\r\n# XTIT: Title for business card Account\r\nDETAILS_BCARD_ACCOUNT=\\u5BA2\\u6237\\u6982\\u89C8\r\n# XTIT: Title for business card Contact\r\nDETAILS_BCARD_CONTACT=\\u8054\\u7CFB\\u4EBA\\u6982\\u89C8\r\n\r\n#Assign task to\r\n\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TITLE=\\u5206\\u914D\\u5230\r\n# XTIT: Title for the assign to dialog\r\nDETAILS_ASSIGNTO_TEXT=\\u5206\\u914D\\u4EFB\\u52A1\\u5230\\uFF1A\r\n# XTIT: Title for employee search\r\nDETAILS_ASSIGNTO_ASIGNEE=\\u5C06\\u4EFB\\u52A1\\u5206\\u914D\\u7ED9\\u5458\\u5DE5\r\n# XTIT: Confirmation message\r\nDETAILS_ASSIGNTO_CONFIRMATION=\\u4EFB\\u52A1\\u5DF2\\u5206\\u914D\\u5230 {0}\r\n# XBUT: Button on dialog: ok\r\nDIALOG_ASSIGNTO_BUTTON_OK=\\u786E\\u5B9A\r\n# XBUT: Button on dialog: cancel\r\nDIALOG_ASSIGNTO_BUTTON_CANCEL=\\u53D6\\u6D88\r\n\r\n# errors\r\n\r\n# YMSG: generic error\r\nGENERIC_ERROR=\\u7CFB\\u7EDF\\u5F53\\u524D\\u4E0D\\u53EF\\u7528\\u3002\\u8BF7\\u7A0D\\u540E\\u91CD\\u8BD5\\u6216\\u8054\\u7CFB\\u60A8\\u7684\\u7CFB\\u7EDF\\u7BA1\\u7406\\u5458\\u3002\r\n# YMSG: error in date\r\nDETAILS_MESSAGETEXT_DATE=\\u65E5\\u671F\\u65E0\\u6548\\u6216\\u683C\\u5F0F\\u9519\\u8BEF\\u3002\\u8BF7\\u4F7F\\u7528\\u8F93\\u5165\\u5E2E\\u52A9\\u8F93\\u5165\\u65E5\\u671F\\u3002\r\n# YMSG: error in account\r\nDETAILS_MESSAGETEXT_ACCOUNT=\\u4F7F\\u7528\\u8F93\\u5165\\u5E2E\\u52A9\\u8F93\\u5165\\u5BA2\\u6237\r\n# YMSG: error in contact\r\nDETAILS_MESSAGETEXT_CONTACT=\\u4F7F\\u7528\\u8F93\\u5165\\u5E2E\\u52A9\\u8F93\\u5165\\u8054\\u7CFB\\u4EBA\r\n# YMSG: title for the validation message box after save is clicked\r\nDETAILS_VALIDATION_TITLE=\\u4F7F\\u7528\\u8F93\\u5165\\u5E2E\\u52A9\r\n',
	"cus/crm/mytasks/util/AccountF4.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mytasks.util.AccountF4");
jQuery.sap.require("cus.crm.mytasks.util.Formatter");
jQuery.sap.require("cus.crm.mytasks.util.Util");
jQuery.sap.require("cus.crm.mytasks.util.Schema");

cus.crm.mytasks.util.AccountF4 = {
	create : function(oController) {
		var oCU = cus.crm.mytasks.util, oCUF = oCU.Formatter, oCUU = oCU.Util, oBundle = oCUF
				.getResourceBundle(), sTitAcc = oBundle
				.getText("DETAILS_VALUE_HELP_ACC_TITLE"), sNoAccounts = oBundle
				.getText("SEARCH_LIST_NODATA_GENERIC"), oAccountF4 = this
				.getValueHelp();
		var fnS = jQuery.proxy(this._searchOnAccounts, this, this
				.getFilterString()), fnLS = jQuery.proxy(
				this._liveSearchOnAccounts, this, this.getFilterString()), fnC = jQuery
				.proxy(this._confirmAccount, this, oController);
		oAccountF4.setTitle(sTitAcc);
		oAccountF4.setNoDataText(sNoAccounts);
		oAccountF4.setModel(oCUU.getSearchModel());
		oAccountF4.attachSearch(fnS);
		oAccountF4.attachLiveChange(fnLS);
		oAccountF4.attachConfirm(fnC);
		oCUU.logObjectToConsole("Account F4 search model: ", oAccountF4
				.getModel());
	},

	getId : function() {
		if (!this._accountID)
			this._accountID = "";
		return this._accountID;
	},

	setId : function(sValue) {
		this._accountID = sValue;
		return this;
	},

	getName : function() {
		if (!this._accountName)
			this._accountName = "";
		return this._accountName;
	},

	setName : function(sValue) {
		this._accountName = sValue;
		return this;
	},

	_getLIItem : function() {
		var sTitle = "{parts:[{path:'"
				+ this.getFilterString()
				+ "'}], formatter: 'cus.crm.mytasks.util.Formatter.getAccountF4Title'}", sDesc = "{parts:[{path:'MainAddress/city'}, {path:'MainAddress/country'}, {path:'accountID'}], formatter: 'cus.crm.mytasks.util.Formatter.getAccountF4Description'}";
		// title : "{fullName}",
		// title :"{parts:[{path:'fullName'}], formatter:
		// 'cus.crm.mytasks.util.Formatter.getAccountF4Title'}",
		// description : "{parts:['MainAddress/city',
		// 'MainAddress/country'], formatter:
		// 'cus.crm.mytasks.util.Formatter.getAccountF4Description'}",
		var oLI = new sap.m.StandardListItem({
			title : sTitle,
			description : sDesc,
			active : true
		});
		return oLI;
	},

	getListItemTemplate : function() {
		if (!this._oListItem)
			this._oListItem = this._getLIItem();
		return this._oListItem;
	},

	getValueHelp : function() {
		if (!this._oDialog)
			this._oDialog = new sap.m.SelectDialog();
		return this._oDialog;
	},

	triggerSearch : function(sValue) {
		// Get the binded items
		var aFilter = [], oAccF4 = this.getValueHelp(), itemsBinding = oAccF4
				.getBinding("items");
		if (sValue && sValue !== "")
			aFilter.push(new sap.ui.model.Filter(this.getFilterString(),
					sap.ui.model.FilterOperator.Contains, sValue));

		if (!itemsBinding) {
			var oLI = {
				path : "/AccountCollection",
				parameters : {
					expand : "MainAddress",
					select : "accountID," + this.getFilterString()
							+ ",MainAddress/city,MainAddress/country"
				},
				template : this.getListItemTemplate(),
				filters : aFilter
			};
			oAccF4.bindAggregation("items", oLI);
		} else {// just filter
			itemsBinding.aApplicationFilters = [];
			itemsBinding.filter(aFilter, sap.ui.model.FilterType.Application);
		}
	},

	_getFS : function() {
		var oCUS = cus.crm.mytasks.util.Schema;
		return oCUS._getPropertyInfoOfEntity("Account", "fullName") ? "fullName"
				: "name1";
	},

	getFilterString : function() {
		if (!this._sFilterString)
			this._sFilterString = this._getFS();
		return this._sFilterString;
	},

	_liveSearchOnAccounts : function(sAttr, oEvent) {
		jQuery.sap.log.debug("in do live search");
		var aFilter = [], sVal = oEvent.getParameter("value");
		if (sVal.length == 0 || (sVal && sVal.length > 3))
			this.__commonSearch(aFilter, oEvent.getParameter("itemsBinding"),
					sAttr, sVal);
	},

	_searchOnAccounts : function(sAttr, oEvent) {
		jQuery.sap.log.debug("in do search");
		var aFilter = [], sVal = oEvent.getParameter("value");
		this.__commonSearch(aFilter, oEvent.getParameter("itemsBinding"),
				sAttr, sVal);
	},

	__commonSearch : function(aFilter, itemsBinding, sAttr, sVal) {
		if (sVal && sVal !== "")
			aFilter.push(new sap.ui.model.Filter(sAttr,
					sap.ui.model.FilterOperator.Contains, sVal));
		if (!itemsBinding) {
			var oLI = {
				path : "/AccountCollection",
				parameters : {
					expand : "MainAddress",
					select : "accountID," + this.getFilterString()
							+ ",MainAddress/city,MainAddress/country"
				},
				template : this.getListItemTemplate(),
				filters : aFilter
			};
			this.getValueHelp().bindAggregation("items", oLI);
		} else {
			// clear application filters
			itemsBinding.aApplicationFilters = [];
			// and apply the filter to the bound items, and the Select
			// Dialog will update
			itemsBinding.filter(aFilter, sap.ui.model.FilterType.Application);
		}
	},

	_confirmAccount : function(oController, evt) {
		var oView = oController.getView(), selectedItem = evt
				.getParameter("selectedItem");
		if (selectedItem) {
			var oAccF4Val = selectedItem.getBindingContext().getObject();
			cus.crm.mytasks.util.Util.logObjectToConsole("Account Data: ",
					oAccF4Val);
			this.setId(oAccF4Val.accountID).setName(
					oAccF4Val[this.getFilterString()]);
			if (this.getName() === "")
				this.setName(oAccF4Val.accountID);
			oView.byId("accountInput").setValue(this.getName());
			jQuery.sap.log.debug("AccountId = " + this.getId());
			jQuery.sap.log.debug("AccountName = " + this.getName());
		}
	}
};
},
	"cus/crm/mytasks/util/AppConfig.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mytasks.util.AppConfig");
jQuery.sap.require("cus.crm.mytasks.util.Util");

cus.crm.mytasks.util.AppConfig = {
	oConfiguration : undefined,
	createConfigurationWithDefaults : function() {
		this.oConfiguration = {
			oUrlParams : {},
			oDataServiceUrl : undefined,
			oDataBaseUrl : "/sap/opu/odata/sap/CRM_TASK/",
			isMock : false,
			mockFile : "tasks_data",
			isUseProxy : false,
			isDebug : false,
		};
	},

	getConfiguration : function() {
		if (!this.oConfiguration)
			this.init();
		return this.oConfiguration;
	},

	init : function() {
		this.createConfigurationWithDefaults();
		// TODO: This piece of code is commented due to SECURITY RISKS; use only
		// in local sand box
		// this.oConfiguration.oUrlParams = this.extractUrlParams();
		this.mapUrlParamsToConfig();
		this.oConfiguration.oDataServiceUrl = this.buildODataUrl();
		cus.crm.mytasks.util.Util.logObjectToConsole("MyTasks Configuration: ",
				this.oConfiguration, "info");
	},

	buildODataUrl : function() {
		var oDataTarget;
		var oParams = this.oConfiguration.oUrlParams;
		// TODO This is not needed if all use proxy servlet when running locally
		if (this.oConfiguration.isUseProxy) {
			if (oParams["sap-server"])
				oDataTarget = "sap-server=" + oParams["sap-server"];
			else if (oParams["sap-host"])
				oDataTarget = "sap-host=" + oParams["sap-host"];
			else if (oParams["sap-host-http"])
				oDataTarget = "sap-host-http=" + oParams["sap-host-http"];
			else {
				// use proxy makes only sense if sap-host | sap-host-http |
				// sap-server is provided
				this.oConfiguration.isUseProxy = false;
				oDataTarget = "";
			}
		} else {
			if (oParams["sap-host"])
				oDataTarget = "https://" + oParams["sap-host"];
			else if (oParams["sap-host-http"] != null)
				oDataTarget = "http://" + oParams["sap-host-http"];
			else
				oDataTarget = "";
		}

		var url;
		if (this.oConfiguration.isUseProxy)
			url = this.oConfiguration.oDataBaseUrl + "?" + oDataTarget;
		else
			url = oDataTarget + this.oConfiguration.oDataBaseUrl;
		return url;
	},

	mapUrlParamsToConfig : function() {
		var oParams = this.oConfiguration.oUrlParams, oConfig = this.oConfiguration;
		oConfig.isMock = ("true" === oParams.demomode);
		oConfig.isUseProxy = ("true" === oParams.useproxy);
		oConfig.isDebug = ("true" === oParams.debugmode);
		// possibility to load specific data file
		if (oConfig.isMock && oParams.data)
			oConfig.isMock = oParams.data;
	},
// TODO: This piece of code is commented due to SECURITY RISKS; use only in
// local sand box
// extractUrlParams : function() {
// var oParams = {};
// oParams.hash = window.location.hash;
// if (oParams.hash.length > 0) {
// this.extractAndRemoveParam(oParams, "sap-server");
// this.extractAndRemoveParam(oParams, "sap-host");
// this.extractAndRemoveParam(oParams, "sap-host-http");
// this.extractAndRemoveParam(oParams, "useproxy");
// this.extractAndRemoveParam(oParams, "demomode");
// this.extractAndRemoveParam(oParams, "data");
// this.extractAndRemoveParam(oParams, "debugmode");
// if (oParams.hash.length == 1) {
// oParams.hash = '';
// } else {
// var pattern = new RegExp("#&");
// oParams.hash = oParams.hash.replace(pattern, "#");
// }
// cus.crm.mytasks.util.Util.logObjectToConsole("parsedURLParams: ",
// oParams);
// }
// window.location.hash = oParams.hash;
// return oParams;
// },
//
// extractAndRemoveParam : function(oParams, param) {
// // TODO : Why can't you use the UI5 hash utility for that ?
// // jQuery.sap.getUriParameters
// jQuery.sap.log.debug("param=" + param + "; hashBefore=" + oParams.hash);
// var flags = "i";
// var txtPattern = param + '=([^&]*)';
// var pattern = new RegExp(txtPattern, flags);
// var aResult = oParams.hash.match(pattern);
// if (aResult && aResult.length > 1) {
// oParams[param] = aResult[1];
// var pattern = new RegExp("&?" + txtPattern, flags);
// oParams.hash = oParams.hash.replace(pattern, "");
// jQuery.sap.log.debug("result=" + aResult[1] + "; hashAfter="
// + oParams.hash);
// } else {
// jQuery.sap.log.debug("param=" + param + "; not found");
// }
// },
};
},
	"cus/crm/mytasks/util/Attachments.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mytasks.util.Attachments");
jQuery.sap.require("cus.crm.mytasks.util.Formatter");
jQuery.sap.require("cus.crm.mytasks.util.Schema");

cus.crm.mytasks.util.Attachments = {
	NAVLINK : "Attachments",
	OverviewPage : {
		showOrHidePanel : function(oView) {
			var oFileUpload = oView.byId("attachmentOverview"), oFileUploadPanel = oView
					.byId("attachmentData"), oCUS = cus.crm.mytasks.util.Schema;
			if (oCUS.getServiceVersion() == 1
					&& oCUS.getServiceSchemaVersion() >= 4) {
				oFileUploadPanel.setVisible(true);
				if (sap.ui.version < "1.22") {
					oFileUpload.preventEdits(true);
					oFileUpload.setEditMode(false);
					oFileUpload.setShowAttachmentsLabelInEditMode(false);
				} // else if(sap.ui.version < "1.26"){
				else {
					oFileUpload.preventEdits(true);
					// oFileUpload._oToolbar.setVisible(false);
					oFileUpload.setDeleteEnabled(false);
					oFileUpload.setShowAttachmentsLabel(false);
				}
			} else
				oFileUploadPanel.setVisible(false);
		},

		bindData : function(oController, oParams) {
			var oTempState = {}, oView = oController.getView(), oModel = oView
					.getModel(), oCU = cus.crm.mytasks.util;
			var oFileUploadControl = oView.byId("attachmentOverview"), oRB = oCU.Formatter
					.getResourceBundle(), oAttachmentPanel = oView
					.byId("attachmentData"), oCUAtt = oCU.Attachments;
			if (oParams.bExpandCall) {
				oTempState.paths = oController.oOverviewTask[oCUAtt.NAVLINK]["__list"]
						|| [];
				oTempState.controlval = [];
				for ( var i = -1, sPath; sPath = oTempState.paths[++i];)
					oTempState.controlval.push(oCUAtt
							.buildFileDescriptorForObject(oModel.getObject('/'
									+ sPath)));
			} else {
				oTempState = oCUAtt._addDataToODataModel(oModel,
						oParams.curResults);
				// oController.oOverviewTask[oCUAtt.NAVLINK]["__list"] =
				// oTempState.paths;
			}
			oCUAtt._aPaths = oTempState.paths;
			oFileUploadControl.setModel(new sap.ui.model.json.JSONModel({
				Attachments : oTempState.controlval
			}));
			oAttachmentPanel.setHeaderText(oRB.getText("S4_TASK_ATTACHMENTS",
					[ oTempState.paths.length ]));
		}
	},
	EditPage : {
		showOrHidePanel : function(oView) {
			var oFileUpload = oView.byId("attachmentEdit"), oCU = cus.crm.mytasks.util, oFileUploadPanel = oView
					.byId("attachmentEditData"), oCUAtt = oCU.Attachments, oModel = oView
					.getModel(), oCUS = oCU.Schema, sPath = oView
					.getBindingContext().getPath();
			if (oCUS.getServiceVersion() == 1
					&& oCUS.getServiceSchemaVersion() >= 4) {
				if (sPath === "/new")
					oFileUploadPanel.setVisible(false);
				else {
					oFileUploadPanel.setVisible(true);
					// oFileUpload.preventEdits(true);
					if (sap.ui.version < "1.22") {
						oFileUpload.setEditMode(true);
						oFileUpload.setShowAttachmentsLabelInEditMode(false);
					} // else if(sap.ui.version < "1.26"){
					else {
						// oFileUpload._oToolbar.setVisible(false);
						oFileUpload.setDeleteEnabled(true);
						oFileUpload.setShowAttachmentsLabel(false);
					}
					oFileUpload.setUploadUrl([ oModel.sServiceUrl,
							sPath.substr(1), oCUAtt.NAVLINK ].join("/"));
					if (oFileUpload.getUploadEnabled()) {
						// Set XSRF token & base 64 encoding URL service for IE9
						oFileUpload.setXsrfToken(oCUAtt.getXSRFToken(oModel));
						oFileUpload.setEncodeUrl("/sap/bc/ui2/encode_file"
								+ (oModel.aUrlParams
										&& oModel.aUrlParams.length > 0 ? "?"
										+ oModel.aUrlParams.join("&") : ""));
					}
				}
			} else
				oFileUploadPanel.setVisible(false);
		},

		bindData : function(oController, oParamResults) {
			var oCU = cus.crm.mytasks.util, oView = oController.getView(), oModel = oView
					.getModel(), oFileUploadControl = oView
					.byId("attachmentEdit"), oRB = oCU.Formatter
					.getResourceBundle(), oAttachmentPanel = oView
					.byId("attachmentEditData"), oTempState = {
				Attachments : []
			}, oCUAtt = oCU.Attachments;
			for ( var i = -1, sPath; sPath = oCUAtt._aPaths[++i];)
				oTempState.Attachments.push(oCUAtt
						.buildFileDescriptorForObject(oModel.getObject('/'
								+ sPath)));
			oFileUploadControl.setModel(new sap.ui.model.json.JSONModel(
					oTempState));
			if (oTempState.Attachments.length == 0) {
				oAttachmentPanel.setHeaderText(oRB.getText(
						"S4_TASK_ATTACHMENTS", "0"));
			} else
				oAttachmentPanel.setHeaderText(oRB.getText(
						"S4_TASK_ATTACHMENTS", oTempState.Attachments.length));
			oFileUploadControl.setCustomHeader("slug",
					oController.oSavedTask.Guid.replace(/-/g, ''));
		},

		uploadFileToTask : function(oController, oCurrentAttachment) {
			if (oController instanceof sap.ca.scfld.md.controller.BaseFullscreenController) {
				var oCU = cus.crm.mytasks.util, oView = oController.getView(), oFileUpload = oView
						.byId("attachmentEdit"), oCUAtt = oCU.Attachments, oAttachmentPanel = oView
						.byId("attachmentEditData");
				oFileUpload.commitFileUpload(oCUAtt
						.buildFileDescriptorForObject(oCurrentAttachment,
								"POST"));
				var aAttachmentList = oFileUpload.getModel().getProperty(
						'/' + oCUAtt.NAVLINK);
				oAttachmentPanel.setHeaderText(oCU.Formatter
						.getResourceBundle().getText("S4_TASK_ATTACHMENTS",
								[ aAttachmentList.length ]));
			}
		},

		renameFileOfTask : function(oController, oParams) {
			if (oController instanceof sap.ca.scfld.md.controller.BaseFullscreenController) {
				var oModel = oController.getView().getModel();
				if (oParams) {
					oModel.setHeaders(oParams.headers);
					var fnSuccess = function(oData, oResponse) {
						this.getView().byId("attachmentEdit")
								.commitPendingRenames();
						var oRB = cus.crm.mytasks.util.Formatter
								.getResourceBundle();
						sap.m.MessageToast.show(oRB
								.getText("S3_RENAME_ATTACHMENT_SUCCESS"));
					}, fnError = function(oError) {
						this.getView().byId("attachmentEdit")
								.abandonPendingRenames();
						var oCU = cus.crm.mytasks.util, oObject = {
							msg : oCU.Formatter.getResourceBundle().getText(
									"S3_RENAME_ATTACHMENT_FAILED")
						};
						oCU.Util.onRequestFailed(oError,
								"Renaming of a file attachment FAILED!",
								oObject);
					};
					oModel.update(oParams.path, oParams.entry, null, jQuery
							.proxy(fnSuccess, oController), jQuery.proxy(
							fnError, oController), false);
				}
			}
		},

		deleteFileFromTask : function(oController, oCurrentAttachment) {
			if (oController instanceof sap.ca.scfld.md.controller.BaseFullscreenController) {
				var oModel = oController.getView().getModel(), sUrl = oCurrentAttachment.mediaURL;
				if (!sUrl)
					sUrl = oCurrentAttachment.url;
				var aDummy = sUrl.split("/"), sPathToDelete = [
						aDummy[aDummy.length - 2], aDummy[aDummy.length - 1] ]
						.join("/"), fnSuccess = function(oParams, oData,
						oResponse) {
					if (oParams) {
						var oCU = cus.crm.mytasks.util, oView = oParams.controller
								.getView(), oRB = oCU.Formatter
								.getResourceBundle(), oFileUpload = oView
								.byId("attachmentEdit");
						oFileUpload.removeFile(oParams.curAttachment.fileId);
						var aAttachmentList = oFileUpload.getModel()
								.getProperty('/' + oCU.Attachments.NAVLINK);
						oView.byId("attachmentEditData").setHeaderText(
								oRB.getText("S4_TASK_ATTACHMENTS",
										[ aAttachmentList.length ]));
					}
				}, fnError = function(oError) {
					cus.crm.mytasks.util.Util.onRequestFailed(oError,
							"DELETE Attachment FAILED!");
				};
				oModel.remove(sPathToDelete, null, jQuery.proxy(fnSuccess,
						this, {
							controller : oController,
							curAttachment : oCurrentAttachment
						}), fnError);
			}
		},
	},

	_aPaths : [],
	buildFileDescriptorForObject : function(oCurrentAttachment, sMethod) {
		var oCUF = cus.crm.mytasks.util.Formatter;
		var oObject = {
			name : oCurrentAttachment.Name,
			url : oCurrentAttachment.Url ? oCurrentAttachment.Url
					: oCUF
							.formatAttachmentURL(oCurrentAttachment.__metadata.media_src),
			// size : oCurrentAttachment.fileSize,
			uploadedDate : oCurrentAttachment.CreatedAt,
			contributor : oCurrentAttachment.CreatedBy,
			mimeType : oCurrentAttachment.MimeType,
			fileId : oCurrentAttachment.Documentid,
			fileExtension : oCUF.formatMimeType(oCurrentAttachment.MimeType),
			mediaURL : oCUF
					.formatAttachmentURL(oCurrentAttachment.__metadata.media_src),
			docClass : oCurrentAttachment.Documentclass,
			taskGuid : oCurrentAttachment.HeaderGuid
		}, aDummy = oObject.name.split(".");
		if (aDummy.length > 1) {
			var sDummy = aDummy.pop();
			oObject.fileExtension = /[a-z]/.test(sDummy) ? sDummy.toLowerCase()
					: sDummy.toUpperCase();
		}
		oObject.name = [ aDummy.join("."), oObject.fileExtension ].join(".");
		if (sMethod === "POST") {
			// convert JSON date format into JS date format
			oObject.uploadedDate = new Date(parseInt(oObject.uploadedDate
					.substr(6)));
			oObject.name = decodeURIComponent(oObject.name);
		}
		return oObject;
	},

	_addDataToODataModel : function(oModel, aAttachmentData) {
		var aDummy = undefined, sPath = undefined;
		var aAttachmentPaths = [], aReturnAttachmentList = [];
		for ( var i = -1, oCurObject; oCurObject = aAttachmentData[++i];) {
			aDummy = oCurObject.__metadata.id.split("/");
			sPath = aDummy[aDummy.length - 1];
			aAttachmentPaths.push(sPath);
			aReturnAttachmentList.push(cus.crm.mytasks.util.Attachments
					.buildFileDescriptorForObject(oCurObject));
			oModel.oData[sPath] = oCurObject;
		}
		return {
			paths : aAttachmentPaths,
			controlval : aReturnAttachmentList
		};
	},

	getXSRFToken : function(oModel) {
		var oCU = cus.crm.mytasks.util, sCsrfToken = "";
		if (!oModel)
			oModel = oCU.Schema.getModel() || oCU.Util.getMainModel();
		if (oModel.getSecurityToken)
			sCsrfToken = oModel.getSecurityToken();
		else {
			oModel.refreshSecurityToken();
			sCsrfToken = oModel.oServiceData.securityToken;
		}
		return sCsrfToken;
	},
};
},
	"cus/crm/mytasks/util/ContactF4.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mytasks.util.ContactF4");
jQuery.sap.require("cus.crm.mytasks.util.Formatter");
jQuery.sap.require("cus.crm.mytasks.util.Util");
// jQuery.sap.require("cus.crm.mytasks.util.Schema");

cus.crm.mytasks.util.ContactF4 = {
	create : function(oController) {
		var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCUF = oCU.Formatter, oBundle = oCUF
				.getResourceBundle(), sTitle = oBundle
				.getText("DETAILS_VALUE_HELP_CON_TITLE"), sNo = oBundle
				.getText("SEARCH_LIST_NODATA_GENERIC"), oConF4 = this
				.getValueHelp();
		jQuery.sap.log.debug("Contact F4 help title: " + sTitle);
		var fnS = jQuery.proxy(this._searchOnContacts, this, this
				.getFilterString()), fnLS = jQuery.proxy(
				this._liveSearchOnContacts, this, this.getFilterString()), fnC = jQuery
				.proxy(this._confirmContact, this, oController);
		oConF4.setTitle(sTitle);
		oConF4.setNoDataText(sNo);
		oConF4.setModel(oCUU.getSearchModel());
		oConF4.attachSearch(fnS);
		oConF4.attachLiveChange(fnLS);
		oConF4.attachConfirm(fnC);
		// TODO: find correct way to display InfoBar (no such method)
		oConF4._list.setInfoToolbar(this.getDialogInfoToolBar());
		// oContactF4._list.setInfoToolbar(oContactF4.myInfobar);
		// this.getListItemTemplate();
		// return oContactF4;
	},

	getId : function() {
		if (!this._contactID)
			this._contactID = "";
		return this._contactID;
	},

	setId : function(sValue) {
		this._contactID = sValue;
		return this;
	},

	getName : function() {
		if (!this._contactName)
			this._contactName = "";
		return this._contactName;
	},

	setName : function(sValue) {
		this._contactName = sValue;
		return this;
	},

	_getLIItem : function() {
		var oLITemplate = new sap.m.StandardListItem(
				{
					title : "{" + this.getFilterString() + "}",
					description : "{parts:['company', 'function'], formatter: 'cus.crm.mytasks.util.Formatter.getContactF4Description'}",
					active : true
				});

		return oLITemplate;
	},

	getListItemTemplate : function() {
		if (!this._oListItem)
			this._oListItem = this._getLIItem();
		return this._oListItem;
	},

	// _getFS : function() {
	// var oCUS = cus.crm.mytasks.util.Schema;
	// return oCUS._getEntityAnnotation(oCUS.getModel(),
	// "service-schema-version", "Account") ? "fullName" : "lastName";
	// },

	getFilterString : function() {
		if (!this._sFilterString)
			this._sFilterString = "fullName";
		return this._sFilterString;
	},

	getValueHelp : function() {
		if (!this._oDialog)
			this._oDialog = new sap.m.SelectDialog();
		return this._oDialog;
	},

	getDialogInfoToolBar : function() {
		if (!this._oInfoTB)
			this._oInfoTB = new sap.m.Toolbar({
				active : true,
				content : [ new sap.m.Label({
					text : ""
				}), new sap.m.ToolbarSpacer(), new sap.ui.core.Icon({
					src : "sap-icon://decline"
				}) ],
				press : jQuery.proxy(this._pressInfoToolbar, this)
			});
		return this._oInfoTB;
	},

	__setFilterText : function(oEvent) {
		var oDL = this.getValueHelp(), oDlItb = oDL._list.getInfoToolbar();
		if (oDL.data("accountid")) {
			var sFilterText = cus.crm.mytasks.util.Formatter
					.getResourceBundle().getText(
							"DETAILS_VALUE_HELP_FILTERED_BY")
					+ " " + oDL.data("accounttext");
			oDlItb.getContent()[0].setText(sFilterText);
			oDlItb.setVisible(true);
		} else {
			oDlItb.setVisible(false);
			// oDL.getModel().detachRequestCompleted(
			// jQuery.proxy(this._onRequestCompleted, this, oParams));
			// oDL.bRequestHandlerAttached = false;
		}
	},

	_onRequestCompleted : function(oParams, oEvent) {
		var fnTO = jQuery.proxy(this.__setFilterText, this);
		setTimeout(fnTO, 5);
	},

	triggerSearch : function(oParams) {
		cus.crm.mytasks.util.Util.logObjectToConsole(
				"Contact F4 Help sValue: ", oParams);
		var aFilter = [], oDL = this.getValueHelp(), itemsBinding = oDL
				.getBinding('items');
		// Add to Custom Data if accountid & contactid is there for a TASK
		if (oParams.accountid && oParams.accountid !== "") {
			oDL.data('accountid', oParams.accountid).data('accounttext',
					oParams.accounttext);
			aFilter.push(new sap.ui.model.Filter("accountID",
					sap.ui.model.FilterOperator.EQ, oParams.accountid));
		} else
			oDL.data('accountid', null).data('accounttext', null);
		if (oParams.contactid && oParams.contactid !== "")
			oDL.data('contactid', oParams.contactid);
		else
			oDL.data('contactid', null);
		if (oParams.searchvalue && oParams.searchvalue !== "")
			aFilter.push(new sap.ui.model.Filter(this.getFilterString(),
					sap.ui.model.FilterOperator.Contains, oParams.searchvalue));

		// for showing the filter bar at the appropriate moment - once
		// request has been serviced
		var fnRC = jQuery.proxy(this._onRequestCompleted, this, oParams);
		if (!oDL.bRequestHandlerAttached) {
			oDL.getModel().attachRequestCompleted(null, fnRC);
			oDL.bRequestHandlerAttached = true;
		}
		if (!itemsBinding) {
			// Needed for Texts & make text to display in info bar:
			jQuery.sap.log.debug("accountid filled for contact F4 help");
			var sPath = "/ContactCollection", oLI = {
				path : sPath,
				template : this.getListItemTemplate(),
				filters : aFilter
			};
			jQuery.sap.log.debug("Contact F4 Binding Path: " + sPath);
			oDL.bindAggregation("items", oLI);
		} else {
			// clearing aApplicationFilters
			itemsBinding.aApplicationFilters = [];
			itemsBinding.filter(aFilter, sap.ui.model.FilterType.Application);
		}
	},

	_searchOnContacts : function(sAttr, oEvent) {
		jQuery.sap.log.debug("in do search");
		var aFilter = [], sVal = oEvent.getParameter("value"), oDL = this
				.getValueHelp(), sAccountId = oDL && oDL.data ? oDL
				.data("accountid") : null;
		this.__commonSearch(aFilter, oEvent.getParameter("itemsBinding"),
				sAccountId, sAttr, sVal);
	},

	_liveSearchOnContacts : function(sAttr, oEvent) {
		jQuery.sap.log.debug("in do search");
		var aFilter = [], sVal = oEvent.getParameter("value"), oDL = this
				.getValueHelp(), sAccountId = oDL && oDL.data ? oDL
				.data("accountid") : null;
		if (sVal.length == 0 || (sVal && sVal.length > 3))
			this.__commonSearch(aFilter, oEvent.getParameter("itemsBinding"),
					sAccountId, sAttr, sVal);
	},

	__commonSearch : function(aFilter, itemsBinding, sAccountId, sAttr, sVal) {
		if (sAccountId)
			aFilter.push(new sap.ui.model.Filter("accountID",
					sap.ui.model.FilterOperator.EQ, sAccountId));
		if (sVal && sVal !== "")
			aFilter.push(new sap.ui.model.Filter(sAttr,
					sap.ui.model.FilterOperator.Contains, sVal));
		if (!itemsBinding) {
			var sPath = "/ContactCollection", oLI = {
				path : sPath,
				template : this.getListItemTemplate(),
				filters : aFilter
			};
			jQuery.sap.log.debug("Contact F4 Binding Path: " + sPath);
			this.getValueHelp().bindAggregation("items", oLI);
		} else {
			// and apply the filter to the bound items, and the Select
			// Dialog will update
			itemsBinding.aApplicationFilters = [];
			itemsBinding.filter(aFilter, sap.ui.model.FilterType.Application);
		}
	},

	_pressInfoToolbar : function(oEvent) {
		var oDialog = this.getValueHelp(), itemsBinding = oDialog
				.getBinding("items"), aFilter = [], sSearchField = oDialog._oDialog
				.getSubHeader().getContentMiddle()[0].getValue();
		oDialog._list.getInfoToolbar().setVisible(false);
		oDialog.data('accountid', null).data('accounttext', null);
		// update items collection -> that is switch
		// back to ContactCollection
		if (sSearchField && sSearchField !== "")
			aFilter.push(new sap.ui.model.Filter(this.getFilterString(),
					sap.ui.model.FilterOperator.Contains, sSearchField));
		if (!itemsBinding) {
			var sPath = "/ContactCollection", oLI = {
				path : sPath,
				template : this.getListItemTemplate(),
				filters : aFilter
			};
			jQuery.sap.log.debug("Contact F4 Binding Path: " + sPath);
			oDialog.bindAggregation("items", oLI);
		} else {
			itemsBinding.aApplicationFilters = [];
			itemsBinding.filter(aFilter, sap.ui.model.FilterType.Application);
		}
	},

	_confirmContact : function(oController, evt) {
		var oView = oController.getView(), selectedItem = evt
				.getParameter("selectedItem"), oCU = cus.crm.mytasks.util;
		if (selectedItem) {
			var oContact = selectedItem.getBindingContext().getObject();
			oCU.Util.logObjectToConsole("Contact Data: ", oContact);
			this.setId(oContact.contactID).setName(
					oContact[this.getFilterString()]);
			if (this.getName() === "")
				this.setName(oContact.contactID);
			oView.byId("contactInput").setValue(this.getName());
			jQuery.sap.log.debug("ContactId = " + this.getId());
			jQuery.sap.log.debug("ContactName = " + this.getName());
			this._setAccountIfNotSetAlready(oController, oContact);
		}
	},

	_setAccountIfNotSetAlready : function(oController, oContact) {
		if (oController instanceof sap.ca.scfld.md.controller.BaseFullscreenController) {
			var oCUA = cus.crm.mytasks.util.AccountF4, oAccInput = oController
					.getView().byId("accountInput");
			if (oAccInput.getValue() === "") {
				oCUA.setId(oContact.accountID).setName(oContact.company);
				if (oCUA.getName() === "")
					oCUA.setName(oContact.accountID);
				oAccInput.setValue(oCUA.getName());
				jQuery.sap.log.debug("AccountId = " + oCUA.getId());
				jQuery.sap.log.debug("AccountName = " + oCUA.getName());
			}
		}
	},
};
},
	"cus/crm/mytasks/util/DocumentHistory.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mytasks.util.DocumentHistory");

cus.crm.mytasks.util.DocumentHistory = {
	NAVLINK : "DocumentHistory",
	aRelatedDocTypes : [ {
		busType : "BUS2000125",
		bWithinApp : true,
		semanticObject : "Task",
		action : "manageTasks",
		appSpecificRoute : [ "&/taskOverview/Tasks(guid'", "')" ]
	}, {
		busType : "BUS2000126",
		bWithinApp : false,
		semanticObject : "Appointment",
		action : "myAppointments",
		appSpecificRoute : [ "&/appointment/" ]
	}, {
		busType : "BUS2000111",
		bWithinApp : false,
		semanticObject : "Opportunity",
		action : "manageOpportunity",
		appSpecificRoute : [ "&/display/Opportunities(guid'", "')" ]
	}, {
		busType : "BUS2000108",
		bWithinApp : false,
		semanticObject : "Lead",
		action : "manageLead",
		appSpecificRoute : [ "&/display/Leads(guid'", "')" ]
	} ],

	showOrHidePanel : function(oView) {
		if (oView) {
			var oCUS = cus.crm.mytasks.util.Schema, oDocHistoryPanel = oView
					.byId("transactionHistoryData");
			// TODO: Change service schema version to 4
			if (oCUS.getServiceVersion() == 1
					&& oCUS.getServiceSchemaVersion() >= 4){
				oDocHistoryPanel.setVisible(true);
				if(oDocHistoryPanel.setExpanded)
					oDocHistoryPanel.setExpanded(false);
			}
			else
				oDocHistoryPanel.setVisible(false);
		}
	},

	bindDataToTable : function(oController, oParams) {
		var oTempState = {}, oView = oController.getView(), oDocHistoryTable = oView
				.byId("tabDocHistory"), oModel = oView.getModel(), oCUDoc = cus.crm.mytasks.util.DocumentHistory;
		if (oParams.bExpandCall) {
			oTempState.paths = oController.oOverviewTask[oCUDoc.NAVLINK]["__list"]
					|| [];
			oTempState.controlval = [];
			for ( var i = -1, sPath; sPath = oTempState.paths[++i];)
				oTempState.controlval.push(oCUDoc.buildDocumentObject(oModel
						.getObject('/' + sPath)));
		} else
			oTempState = oCUDoc
					._addDataToODataModel(oModel, oParams.curResults);

		oDocHistoryTable.setModel(new sap.ui.model.json.JSONModel({
			transactions : oTempState.controlval
		}), "docHistory");
	},

	_addDataToODataModel : function(oModel, aTransactionHistoryData) {
		var aDummy = undefined, sPath = undefined;
		var aDocHistoryPaths = [], aReturnDocHistory = [];
		for ( var i = -1, oCurObject; oCurObject = aTransactionHistoryData[++i];) {
			aDummy = oCurObject.__metadata.id.split("/");
			sPath = aDummy[aDummy.length - 1];
			aDocHistoryPaths.push(sPath);
			aReturnDocHistory.push(cus.crm.mytasks.util.DocumentHistory
					.buildDocumentObject(oCurObject));
			oModel.oData[sPath] = oCurObject;
		}
		return {
			paths : aDocHistoryPaths,
			controlval : aReturnDocHistory
		};
	},

	addOrModifyDocumentType : function(oNewProperties) {
		var aDocTypes = cus.crm.mytasks.util.DocumentHistory.aRelatedDocTypes;
		if (oNewProperties && jQuery.type(oNewProperties) === "object") {
			// Remove invalid Properties from parameter passed
			for ( var sProp in oNewProperties)
				if (!aDocTypes[0][sProp])
					delete oNewProperties[sProp];
				else if (typeof aDocTypes[0][sProp] !== typeof oNewProperties[sProp])
					delete oNewProperties[sProp];
			if (oNewProperties["busType"]
					&& Object.keys(oNewProperties).length !== 0
					&& Object.keys(oNewProperties).length === Object
							.keys(aDocTypes[0])) {
				var iIndexOfDocType = -1;
				for ( var i = 0, j = aDocTypes.length; i < j; i++)
					if (aDocTypes[i]["busType"] === oNewProperties["busType"]) {
						iIndexOfDocType = i;
						break;
					}
				if (iIndexOfDocType > -1)
					aDocTypes[i] = oNewProperties;
				else
					aDocTypes.push(oNewProperties);
			} else
				for ( var i = 0, j = aDocTypes.length; i < j; i++)
					if (aDocTypes[i]["busType"] === oNewProperties["busType"]) {
						for ( var sProp in oNewProperties)
							aDocTypes[i][sProp] = oNewProperties[sProp];
						break;
					}
		}
	},

	buildDocumentObject : function(oDocument) {
		var oObjectToReturn = {
			CreatedAt : oDocument.CreatedAt,
			Description : oDocument.Description,
			Guid : oDocument.Guid,
			ObjectId : oDocument.ObjectId,
			ProcessType : oDocument.ProcessType,
			ProcessTypeDescription : oDocument.TransTypeDesc,
			RelType : oDocument.Relationship,
			navToURL : "",
			enableLink : false
		}, oCUDoc = cus.crm.mytasks.util.DocumentHistory;
		for ( var i = -1, oCurDocType; oCurDocType = oCUDoc.aRelatedDocTypes[++i];) {
			var sAppSpecificRoute = undefined, aTemp = [];
			if (oCurDocType["busType"] === oDocument.ObjectType) {
				oObjectToReturn.enableLink = true;
				oObjectToReturn.bWithinApp = oCurDocType.bWithinApp;
				if (oCurDocType.appSpecificRoute.length === 1)
					sAppSpecificRoute = oCurDocType.appSpecificRoute[0]
							+ oObjectToReturn.Guid;
				else {
					aTemp = oCurDocType.appSpecificRoute.slice(0);
					aTemp.splice(1, 0, oObjectToReturn.Guid);
					sAppSpecificRoute = aTemp.join("");
				}
				oObjectToReturn.navToURL = "#"
						+ [ oCurDocType.semanticObject, oCurDocType.action ]
								.join("-") + sAppSpecificRoute;
				break;
			}
		}
		return oObjectToReturn;
	},
};
},
	"cus/crm/mytasks/util/EmployeeF4.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mytasks.util.EmployeeF4");
jQuery.sap.require("cus.crm.mytasks.util.Util");
jQuery.sap.require("cus.crm.mytasks.util.AccountF4");
// jQuery.sap.require("cus.crm.mytasks.util.Schema");

cus.crm.mytasks.util.EmployeeF4 = {
	create : function(oController) {
		var oCU = cus.crm.mytasks.util, oCUF = oCU.Formatter, oCUU = oCU.Util, oBundle = oCUF
				.getResourceBundle(), sTitAcc = oBundle
				.getText("DETAILS_ASSIGNTO_ASIGNEE"), sNoEmps = oBundle
				.getText("SEARCH_LIST_NODATA_GENERIC"), oEmployeeF4 = this
				.getValueHelp(), fnS = jQuery.proxy(this._searchOnEmployees,
				this, this.getFilterString()), fnLS = jQuery.proxy(
				this._liveSearchOnEmployees, this, this.getFilterString()), fnC = jQuery
				.proxy(this._confirmEmployee, this, oController);
		oEmployeeF4.setTitle(sTitAcc);
		oEmployeeF4.setNoDataText(sNoEmps);
		oEmployeeF4.setModel(oCUU.getSearchModel());
		oEmployeeF4.attachSearch(fnS);
		oEmployeeF4.attachLiveChange(fnLS);
		oEmployeeF4.attachConfirm(fnC);
		oCUU.logObjectToConsole("Employee F4 search model: ", oEmployeeF4
				.getModel());
	},

	getId : function() {
		if (!this._employeeID)
			this._employeeID = "";
		return this._employeeID;
	},

	setId : function(sValue) {
		this._employeeID = sValue;
		return this;
	},

	getName : function() {
		if (!this._employeeName)
			this._employeeName = "";
		return this._employeeName;
	},

	setName : function(sValue) {
		this._employeeName = sValue;
		return this;
	},

	_getLIItem : function() {
		var oLITemplate = new sap.m.StandardListItem(
				{
					title : "{" + this.getFilterString() + "}",
					icon : "{path:'Photo', formatter:'cus.crm.mytasks.util.Formatter.photoUrlFormatter'}",
					description : "{Company/"
							+ cus.crm.mytasks.util.AccountF4.getFilterString()
							+ "}",
					// description : "{parts:['company', 'function'], formatter:
					// 'cus.crm.mytasks.util.Formatter.getContactF4Description'}",
					active : true
				});
		return oLITemplate;
	},

	getListItemTemplate : function() {
		if (!this._oListItem)
			this._oListItem = this._getLIItem();
		return this._oListItem;
	},

	// _getFS : function() {
	// var oCUS = cus.crm.mytasks.util.Schema;
	// return oCUS._getEntityAnnotation(oCUS.getModel(),
	// "service-schema-version", "Account") ? "fullName" : "lastName";
	// },

	getFilterString : function() {
		if (!this._sFilterString)
			this._sFilterString = "fullName";
		return this._sFilterString;
	},

	getValueHelp : function() {
		if (!this._oDialog)
			this._oDialog = new sap.m.SelectDialog();
		return this._oDialog;
	},

	triggerSearch : function(sValue) {
		// Get the binded items
		var aFilter = [], oEmpF4 = this.getValueHelp(), itemsBinding = oEmpF4
				.getBinding("items");
		if (sValue)
			aFilter.push(new sap.ui.model.Filter(this.getFilterString(),
					sap.ui.model.FilterOperator.Contains, sValue));

		if (!itemsBinding) {
			var oLI = {
				path : "/EmployeeCollection",
				parameters : {
					expand : 'Company,Photo',
					select : 'employeeID,firstName,lastName,fullName,Company/'
							+ cus.crm.mytasks.util.AccountF4.getFilterString()
							+ ',Company/accountID,Photo'
				},
				template : this.getListItemTemplate(),
				filters : aFilter
			};
			oEmpF4.bindAggregation("items", oLI);
		} else {// just filter
			itemsBinding.aApplicationFilters = [];
			itemsBinding.filter(aFilter, sap.ui.model.FilterType.Application);
		}
	},

	_liveSearchOnEmployees : function(sAttr, oEvent) {
		jQuery.sap.log.debug("in do live search");
		var aFilter = [], sVal = oEvent.getParameter("value");
		if (sVal.length == 0 || (sVal && sVal.length > 3))
			this.__commonSearch(aFilter, oEvent.getParameter("itemsBinding"),
					sAttr, sVal);
	},

	_searchOnEmployees : function(sAttr, oEvent) {
		jQuery.sap.log.debug("in do search");
		var aFilter = [], sVal = oEvent.getParameter("value");
		this.__commonSearch(aFilter, oEvent.getParameter("itemsBinding"),
				sAttr, sVal);
	},

	__commonSearch : function(aFilter, itemsBinding, sAttr, sVal) {
		if (sVal && sVal !== "")
			aFilter.push(new sap.ui.model.Filter(sAttr,
					sap.ui.model.FilterOperator.Contains, sVal));
		if (!itemsBinding) {
			var oLI = {
				path : "/EmployeeCollection",
				parameters : {
					expand : 'Company,Photo',
					select : 'employeeID,firstName,lastName,fullName,Company/'
							+ cus.crm.mytasks.util.AccountF4.getFilterString()
							+ ',Company/accountID,Photo'
				},
				template : this.getListItemTemplate(),
				filters : aFilter
			};
			this.getValueHelp().bindAggregation("items", oLI);
		} else {
			// clear application filters
			itemsBinding.aApplicationFilters = [];
			// and apply the filter to the bound items, and the Select
			// Dialog will update
			itemsBinding.filter(aFilter, sap.ui.model.FilterType.Application);
		}
	},

	_confirmEmployee : function(oController, evt) {
		var selectedItem = evt.getParameter("selectedItem");
		if (selectedItem) {
			var oEmpF4Val = selectedItem.getBindingContext().getObject();
			this.setId(oEmpF4Val.employeeID).setName(
					oEmpF4Val[this.getFilterString()]);
			oController._oDlAssignTask.getContent()[1].setValue(this.getName());
			jQuery.sap.log.debug("EmployeeId = " + this.getId());
			jQuery.sap.log.debug("EmployeeName = " + this.getName());
		}
	},
};
},
	"cus/crm/mytasks/util/Formatter.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mytasks.util.Formatter");
jQuery.sap.require("cus.crm.mytasks.util.Util");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
cus.crm.mytasks.util.Formatter = {
	I18N_MODEL_NAME : "cus.crm.mytasks.i18n",
	EDM_STRING : "Edm.String",
	EDM_GUID : "Edm.Guid",
	getResourceBundle : function() {
		if (!this.oBundle) {
			var oConfig = cus.crm.mytasks.util.AppConfig.getConfiguration();
			jQuery.sap.log
					.warning("Creating ResBundle for formatter on the fly, but it should have been injected beforehand!");
			if (oConfig.isDebug) {
				console.trace();
			}
			var i18n = sap.ui.getCore().getModel(
					cus.crm.mytasks.util.Formatter.I18N_MODEL_NAME);
			cus.crm.mytasks.util.Util.logObjectToConsole("i18n model", i18n);
			if (i18n) {
				this.oBundle = i18n.getResourceBundle();
			} else {
				jQuery.sap.require("jquery.sap.resources");
				this.oBundle = jQuery.sap.resources({
					url : "i18n/i18n.properties"
				});
			}
		}
		return this.oBundle;
	},

	showPriorityStatus : function(priority, completed) {
		var highestPrio = cus.crm.mytasks.util.PriorityListUtil
				.getHighestPrio();
		return ((highestPrio == priority) && !completed) ? "Warning" : "None";
	},

	getPriorityIcon : function(priority, completed) {
		var highestPrio = cus.crm.mytasks.util.PriorityListUtil
				.getHighestPrio();
		return ((highestPrio == priority) && !completed) ? "sap-icon://warning"
				: "";
	},

	showDueDateInDays : function(dueDate, completed) {
		if ((dueDate == null) || completed) {
			return "";
		}
		var oBundle = cus.crm.mytasks.util.Formatter.getResourceBundle();

		var oNow = cus.crm.mytasks.util.Formatter.getCurrentDate();
		var oThen = cus.crm.mytasks.util.Formatter.parseDate(dueDate);

		var daysDiff = cus.crm.mytasks.util.Formatter
				.getDiffInDays(oNow, oThen);

		var oResult;
		if (0 == daysDiff) {
			oResult = oBundle.getText("LIST_DUE_DATE_TODAY");
		} else if (1 == daysDiff) {
			oResult = oBundle.getText("LIST_DUE_DATE_TOMORROW");
		} else if (-1 == daysDiff) {
			oResult = oBundle.getText("LIST_DUE_DATE_YESTERDAY");
		} else if (daysDiff < 0) {
			oResult = oBundle
					.getText("LIST_DUE_DATE_X_DAYS_AGO", [ -daysDiff ]);
		} else if (daysDiff > 0) {
			oResult = oBundle.getText("LIST_DUE_DATE_IN_X_DAYS", [ daysDiff ]);
		} else {
			oResult = "";
		}
		return oResult;
	},

	showDueDateStatus : function(dueDate, completed) {
		var status;
		if ((dueDate == null) || completed) {
			status = "Success";
		} else {
			var oNow = cus.crm.mytasks.util.Formatter.getCurrentDate();
			var oThen = cus.crm.mytasks.util.Formatter.parseDate(dueDate);

			var daysDiff = cus.crm.mytasks.util.Formatter.getDiffInDays(oNow,
					oThen);

			status = daysDiff < 0 ? "Warning" : "None";
		}
		return status;
	},

	getCurrentDate : function() {
		var oCurrentDate = new Date();
		return oCurrentDate;
	},

	showTaskTitle : function(description, id) {
		var title;
		if (!id || ("" === id)) {
			var oBundle = cus.crm.mytasks.util.Formatter.getResourceBundle();
			title = oBundle.getText("NEW_TASK_PAGE_TITLE");
		} else {
			title = description;
		}
		return title;
	},

	getDateEndOfTheWeek : function() {
		var today = cus.crm.mytasks.util.Formatter.getCurrentDate();
		var diffToSun = (7 - today.getDay()) % 7;
		var endOfTheWeek = new Date(today);
		endOfTheWeek.setDate(today.getDate() + diffToSun);
		return endOfTheWeek;
	},

	parseDate : function(datestring) {
		if (datestring == null) {
			return null;
		}
		if (datestring instanceof Date) {
			return datestring;
		} else {
			var year = datestring.substring(0, 4);
			var month = datestring.substring(4, 6);
			var day = datestring.substring(6, 8);

			var oDueDate = new Date(year, month, day);
			return oDueDate;
		}
	},

	getPrivacyIcon : function(privacyFlag) {
		var icon = "";

		// if (privacyFlag) {
		// icon = "sap-icon://locked";
		// }
		return icon;
	},

	getDiffInDays : function(oDate1orig, oDate2orig) {
		if (!oDate1orig || !oDate2orig) {
			return undefined;
		}
		var oDate1 = new Date(oDate1orig.getTime());
		var oDate2 = new Date(oDate2orig.getTime());

		cus.crm.mytasks.util.Formatter.eraseTime(oDate1);
		cus.crm.mytasks.util.Formatter.eraseTime(oDate2);

		var daysDiff = Math.round((oDate2.getTime() - oDate1.getTime())
				/ (1000 * 60 * 60 * 24));

		return daysDiff;
	},

	eraseTime : function(oDate) {
		oDate.setHours(0);
		oDate.setMinutes(0);
		oDate.setSeconds(0);
		oDate.setMilliseconds(0);
	},

	listType : function(completed) {
		return completed ? sap.m.ListType.Inactive : sap.m.ListType.Navigation;
	},

	formatDate : function(date) {
		var sDate = "";
		if (date) {
			if (typeof date === "string") {
				if (date.substring(0, 6) === "/Date(") {
					// for mockmode
					date = date.replace("/Date(", "").replace(")/", "");
					date = parseInt(date); // number ms
					date = new Date(date);
				} else {
					// datepicker issue -> maybe remove when fixed
					// Wed Sep 18 2013 00:00:00 GMT+0200 (W. Europe Daylight
					// Time)
					date = new Date(date);
				}
			}
			if (typeof date === "object") {
				var dateFormatter = cus.crm.mytasks.util.Formatter
						.getDateFormatter();
				sDate = dateFormatter.format(date);
			}
		}
		return sDate;
	},

	parseLongDate : function(dateString) {
		var dateFormatter = cus.crm.mytasks.util.Formatter.getDateFormatter();
		var oDate;
		try {
			oDate = dateFormatter.parse(dateString);
		} catch (oError) {
			oDate = null;
		}
		return oDate;
	},

	getDateFormatter : function(dateString) {
		var dateFormatter = sap.ca.ui.model.format.DateFormat.getDateInstance({
			style : "long"
		});
		return dateFormatter;
	},

	logoUrlFormatter : function(oPhoto) {
		return oPhoto && oPhoto.__metadata && oPhoto.__metadata.media_src ? oPhoto.__metadata.media_src
				: "sap-icon://factory";
	},

	photoUrlFormatter : function(oPhoto) {
		return oPhoto && oPhoto.__metadata && oPhoto.__metadata.media_src ? oPhoto.__metadata.media_src
				: "sap-icon://person-placeholder";
	},

	showTitleInMainList : function(description, completed) {
		return completed ? "\u2714 " + description : description;
	},

	getContactF4Description : function(accountName, functionName) {
		var description = cus.crm.mytasks.util.Formatter
				.combine2AttributesIntoOneString(accountName, functionName,
						"DETAILS_VALUE_HELP_CON_DESCR");
		return description;
	},

	getAccountF4Descriptionold : function(city, country) {
		var description = cus.crm.mytasks.util.Formatter
				.combine2AttributesIntoOneString(city, country,
						"DETAILS_VALUE_HELP_ACC_DESCR");
		return description;
	},
	getAccountF4Description : function(city, country, accountID) {
		var sComboCityCountry = cus.crm.mytasks.util.Formatter
				.combine2AttributesIntoOneString(city, country,
						"DETAILS_VALUE_HELP_ACC_DESCR");
		return sComboCityCountry && sComboCityCountry != "" ? accountID
				&& accountID != "" ? accountID + " / " + sComboCityCountry
				: sComboCityCountry : accountID && accountID != "" ? accountID
				: "";
	},
	getAccountF4Title : function(fullName) {
		return fullName ? fullName : " ";
	},

	combine2AttributesIntoOneString : function(attr1, attr2, i18nTemplateKey) {
		var oBundle = cus.crm.mytasks.util.Formatter.getResourceBundle();
		var isAttr1 = attr1 && attr1.length > 0;
		var isAttr2 = attr2 && attr2.length > 0;
		return isAttr1 && isAttr2 ? oBundle.getText(i18nTemplateKey, [ attr1,
				attr2 ]) : isAttr1 ? attr1 : isAttr2 ? attr2 : "";
	},

	formatBusinessPartner : function(sName, sId) {
		return sName ? sName : sId;
	},

	showCurrentPriority : function(sPrioKey) {
		var oCUU = cus.crm.mytasks.util.Util, aPrioList = oCUU
				.getCustomizingModel().getProperty("/priolist");
		if (!Array.isArray(aPrioList))
			return "";
		else {
			var sTextToReturn = "";
			for ( var i = 0, j = aPrioList.length; i < j; i++)
				if (aPrioList[i]["Priority"] === sPrioKey) {
					sTextToReturn = aPrioList[i]["TxtLong"];
					break;
				}
			return sTextToReturn;
		}
	},

	showPrivacyFlag : function(bIsPrivate) {
		return bIsPrivate ? "sap-icon://private" : "";
	},

	formatOverviewField : function(sI18NText, oParamA, oParamB) {
		var oCUF = cus.crm.mytasks.util.Formatter, oDF = oCUF
				.getDateFormatter(), sTextToReturn = "", oRB = oCUF
				.getResourceBundle();
		switch (sI18NText) {
		case oRB.getText("S4_TASK_DUEDATE"):
			sTextToReturn = jQuery.type(oParamA) === "date" ? oRB.getText(
					"S4_TASK_DUEDATE", [ oDF.format(oParamA) ]) : "";
			break;
		default:
			sTextToReturn = oParamA && oParamA !== "" ? jQuery.sap
					.formatMessage(sI18NText, [ oParamA ]) : oParamB
					&& oParamB !== "" ? jQuery.sap.formatMessage(sI18NText,
					[ oParamB ]) : "";
			break;
		}
		return sTextToReturn;
	},

	formatAttachmentURL : function(sValue) {
		var oUriParams = jQuery.sap.getUriParameters(), sSapServer = oUriParams
				.get("sap-server"), sSapHost = oUriParams.get("sap-host"), sSapHostHttp = oUriParams
				.get("sap-host-http"), sSapClient = oUriParams
				.get("sap-client"), sCurrentProtocol = location.protocol
				.replace(':', '');

		var sReturnString = URI([ location.protocol, location.hostname ]
				.join("//")
				+ (location.port ? ':' + location.port : '')
				+ cus.crm.mytasks.util.Formatter.getRelativePathFromURL(sValue));
		if (sCurrentProtocol !== sReturnString.protocol())
			sReturnString.protocol(sCurrentProtocol);

		if (sSapServer)
			sReturnString.addSearch('sap-server', sSapServer);
		if (sSapHost)
			sReturnString.addSearch('sap-host', sSapHost);
		if (sSapHostHttp)
			sReturnString.addSearch('sap-host-http', sSapHostHttp);
		// if (sSapClient)
		// sReturnString.addSearch('sap-client', sSapClient);

		return sReturnString.toString();
	},

	getRelativePathFromURL : function(absoluteURL) {
		var url = document.createElement('a');
		url.href = absoluteURL;
		if (url.pathname.substring(0, 1) == "/")
			return url.pathname;
		else
			return "/" + url.pathname;
	},

	formatMimeType : function(sValue) {
		switch (sValue) {
		case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
			return 'pptx';
		case 'application/vnd.ms-powerpoint':
			return 'ppt';
		case 'application/vnd.openxmlformats-officedocument.presentationml.template':
			return 'potx';
		case 'application/msword':
			return 'doc';
		case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
			return 'docx';
		case 'application/vnd.openxmlformats-officedocument.wordprocessingml.template':
			return 'dotx';
		case 'text/csv':
			return 'csv';
		case 'application/vnd.ms-excel':
			return 'xls';
		case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
			return 'xlsx';
		case 'application/vnd.openxmlformats-officedocument.spreadsheetml.template':
			return 'xltx';
		case 'application/pdf':
			return 'pdf';
		case 'application/xhtml+xml':
			return 'xhtml';
		case 'application/zip':
			return 'zip';
		case 'application/gzip':
			return 'gzip';
		case 'video/avi':
			return 'avi';
		case 'video/mpeg':
			return 'mpeg';
		case 'video/mp4':
			return 'mp4';
		case 'text/html':
			return 'html';
		case 'text/plain':
			return 'txt';
		case 'text/xml':
			return 'xml';
		case 'image/gif':
			return 'gif';
		case 'image/jpeg':
			return 'jpg' || 'jpeg';
		case 'image/pjpeg':
			return 'pjpeg';
		case 'image/png':
			return 'png';
		case 'image/bmp':
			return 'bmp';
		case 'image/tiff':
			return 'tif' || 'tiff';
		case 'audio/mpeg3':
			return 'mp3';
		case 'audio/x-ms-wmv':
			return 'wmv';
		case 'application/octet-stream':
		default:
			return '';
		}
	},

};
},
	"cus/crm/mytasks/util/PriorityListUtil.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mytasks.util.PriorityListUtil");
jQuery.sap.require("cus.crm.mytasks.util.Util");
// jQuery.sap.require("jquery.sap.storage");

cus.crm.mytasks.util.PriorityListUtil = {

	getHighestPrio : function() {
		var oCUU = cus.crm.mytasks.util.Util, oCustomizingModel = oCUU
				.getCustomizingModel();
		var highestPrio = oCustomizingModel.getProperty("/highestPrio");
		return highestPrio;
	},

	getDefaultPrio : function() {
		var oCUU = cus.crm.mytasks.util.Util, oCustomizingModel = oCUU
				.getCustomizingModel();
		var defaultPrio = oCustomizingModel.getProperty("/defaultPrio");
		return defaultPrio;
	},

	parsePrioListOData : function(oData) {
		var oEmptyPrio = {};
		if (oData) {
			if (Array.isArray(oData.results))
				oEmptyPrio = jQuery.extend({}, oData.results[0], true);
			else
				oData.results = [];
		} else {
			oData = {};
			oData.results = [];
		}
		// '0' cannot be used as Priority code in
		// Customizing & this is what is used in WebUI
		oEmptyPrio.Priority = "0";
		oEmptyPrio.TxtLong = "";
		oEmptyPrio.IsDefault = false;
		oData.results.splice(0, 0, oEmptyPrio);

		// make sure customizing is accessible under path
		// /priolist and not /results
		var oCopyObject = {
			priolist : []
		};
		jQuery.extend(oCopyObject.priolist, oData.results, true);
		// merge data obtained from the BE into the customizing model
		var oCUU = cus.crm.mytasks.util.Util, oCustomizingModel = oCUU
				.getCustomizingModel();
		oCustomizingModel.setData(oCopyObject, true);
		// set default & highest priority
		this.setDefaultPrio(oCustomizingModel);
		this.setHighestPrio(oCustomizingModel);
		// return oCustomizingModel;
	},

	setDefaultPrio : function(oCustomizingModel) {
		var priolist = oCustomizingModel.getProperty("/priolist");
		var defaultPrio = this.parseDefaultPrio(priolist);
		oCustomizingModel.setProperty("/defaultPrio", defaultPrio);
	},

	parseDefaultPrio : function(priolist) {
		var defaultPrio = priolist[0].Priority;
		for ( var ii = 0; ii < priolist.length; ii++) {
			var prio = priolist[ii];
			if (prio.IsDefault === true || prio.IsDefault === "true") {
				defaultPrio = prio.Priority;
				break;
			}
		}
		return defaultPrio;
	},

	setHighestPrio : function(oCustomizingModel) {
		var priolist = oCustomizingModel.getProperty("/priolist");
		var defaultPrio = this.parseHighestPrio(priolist);
		oCustomizingModel.setProperty("/highestPrio", defaultPrio);
	},

	parseHighestPrio : function(priolist) {
		var highestPrio = undefined;
		for ( var ii = 1; ii < priolist.length; ii++) {
			var prio = priolist[ii];
			if (!highestPrio || highestPrio > prio.Priority) {
				highestPrio = prio.Priority;
			}
		}
		return highestPrio;
	},

	read : function(oView) {
		var oCUU = cus.crm.mytasks.util.Util, oCustomizingModel = oCUU
				.getCustomizingModel();
		if (oCustomizingModel.getProperty("/priolist") === undefined) {
			jQuery.sap.log.debug("Reading prio cust from BE");
			// call-backs
			var errorHandler = function(oError) {
				cus.crm.mytasks.util.Util.onRequestFailed(oError,
						"Operation failed: Read priority customizing. ");
			};
			var successHandler = function(oData) {
				var oCUU = cus.crm.mytasks.util.Util;
				oCUU.logObjectToConsole(
						"Operation successfull: Read priority customizing. ",
						oData);
				this.parsePrioListOData(oData);
				// this.cachePrioList(oCustomizingModel);
			};
			oView.getModel().callFunction("retrieveTaskPrioCustomizing", "GET",
					{}, null, jQuery.proxy(successHandler, this), errorHandler);
		}
		oCUU.bindCustomizingModel(oView);
	},
// cachePrioList : function(oCustomizingModel) {
// var oContainer = {};
// oContainer.timestamp = new Date().getTime();
// oContainer.priolist = oCustomizingModel.getProperty("/priolist");
// oContainer.highestPrio = oCustomizingModel.getProperty("/highestPrio");
// oContainer.defaultPrio = oCustomizingModel.getProperty("/defaultPrio");
//
// var cacheKey =
// cus.crm.mytasks.util.PriorityListUtil.CACHE_KEY_PREFIX_PRIO_LIST
// + cus.crm.mytasks.util.AppConfig.getConfiguration().oDataServiceUrl;
// var oCache = jQuery.sap.storage(jQuery.sap.storage.Type.local);
// oCache.put(cacheKey, oContainer);
// cus.crm.mytasks.util.Util.logObjectToConsole("Put to Cache. ", [
// cacheKey, oContainer ]);
// },
//
// getPrioListFromCacheObj : function(oContainer, oCustomizingModel) {
// oCustomizingModel.setProperty("/priolist", oContainer.priolist);
// oCustomizingModel.setProperty("/highestPrio", oContainer.highestPrio);
// oCustomizingModel.setProperty("/defaultPrio", oContainer.defaultPrio);
// }
};
},
	"cus/crm/mytasks/util/Schema.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mytasks.util.Schema");

cus.crm.mytasks.util.Schema = {
	_iServiceSchemaVersion : null,
	_iServiceVersion : null,
	_oModel : null,
	getServiceVersion : function() {
		return this._iServiceVersion;
	},

	getServiceSchemaVersion : function() {
		return this._iServiceSchemaVersion;
	},

	getModel : function() {
		return this._oModel;
	},

	_setModel : function(oModel) {
		this._oModel = oModel;
	},

	initServiceSchemaVersion : function(oModel, sEntityName) {
		this._setModel(oModel);
		var iVa = this._getEntityAnnotation(oModel, "service-schema-version",
				sEntityName);
		var iVb = this._getEntityAnnotation(oModel, "service-version",
				sEntityName);
		// defaults to initial service version (1)
		this._iServiceVersion = iVa != null ? parseInt(iVb) : 1;
		this._iServiceSchemaVersion = iVb != null ? parseInt(iVa) : 1;
	},

	_getEntityAnnotation : function(oModel, sAnnotationName, sEntityName) {
		// retrieve the metadata of the passed OData model
		var oMMd = oModel.getServiceMetadata();
		// check for proper metadata structure
		if (oMMd && oMMd.dataServices && oMMd.dataServices.schema
				&& oMMd.dataServices.schema.length > 0
				&& oMMd.dataServices.schema[0].entityType) {
			// determine the annotation by name using the first
			// annotated entity
			var aEntityTypes = oMMd.dataServices.schema[0].entityType;
			for ( var i = -1, oCurEntity; oCurEntity = aEntityTypes[++i];)
				if (sEntityName === oCurEntity.name && oCurEntity.extensions)
					for ( var j = -1, oCurExtn; oCurExtn = oCurEntity.extensions[++j];)
						if (oCurExtn.name === sAnnotationName)
							return oCurExtn.value;
		}
		return null;
	},

	_getPropertyInfoOfEntity : function(sEntityName, sPropertyName) {
		var oModel = this.getModel(), oMMd = oModel.getServiceMetadata();
		if (oMMd && oMMd.dataServices && oMMd.dataServices.schema
				&& oMMd.dataServices.schema.length > 0
				&& oMMd.dataServices.schema[0].entityType) {
			var aEntityTypes = oMMd.dataServices.schema[0].entityType;
			for ( var i = -1, oCurEntity; oCurEntity = aEntityTypes[++i];)
				if (sEntityName === oCurEntity.name && oCurEntity.property)
					for ( var j = -1, oCurProperty; oCurProperty = oCurEntity.property[++j];)
						if (oCurProperty.name === sPropertyName)
							return oCurProperty;
		}
		return null;
	},
};
},
	"cus/crm/mytasks/util/StatusListUtil.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mytasks.util.StatusListUtil");
jQuery.sap.require("cus.crm.mytasks.util.Util");

cus.crm.mytasks.util.StatusListUtil = {

	getStatusValues : function(oController, oTaskParams) {
		var oCUU = cus.crm.mytasks.util.Util;
		var fnSuccess = function(oData, oResponse) {
			var oCUU = cus.crm.mytasks.util.Util, oCM = oCUU
					.getCustomizingModel();
			oCUU.logObjectToConsole(
					"Operation successful: Read status customizing", oData);
			oCM.setProperty("/statList", oData.results);
			this.setInitialStatus(oCM);
			// oCM.oData.statList = oData.results;
			// oCM.refresh();
		}, fnErrorS2 = function(oError) {
			if (!this.oStatusDDLB)
				this.oStatusDDLB = {
					errorObj : null,
					bNotRetrieved : false
				};
			this.oStatusDDLB.errorObj = oError;
			this.oStatusDDLB.bNotRetrieved = true;
			// cus.crm.mytasks.util.Util.onRequestFailed(oError,
			// "Operation failed: Read status customizing.");
		}, fnErrorS3 = function(oError) {
			cus.crm.mytasks.util.Util.onRequestFailed(oError,
					"Operation failed: Read status customizing.");
		}, sSomeGuid = oTaskParams.guid === undefined ? "00000000-0000-0000-0000-000000000000"
				: oTaskParams.guid;
		this.readStatusForGivenTaskType(oController.getView().getModel(), {
			procType : oTaskParams.procType,
			guid : sSomeGuid
		}, jQuery.proxy(fnSuccess, this), oTaskParams.bIsNew ? jQuery.proxy(
				fnErrorS2, oController) : fnErrorS3);
		oCUU.bindCustomizingModel(oController.getView());
	},

	readStatusForGivenTaskType : function(oModel, oParams, fnSuccess, fnError) {
		jQuery.sap.log.debug("Reading status cust from BE");
		var oCUF = cus.crm.mytasks.util.Formatter, mParams = {
			Guid : oModel.formatValue(oParams.guid, oCUF.EDM_GUID),
			TransactionType : oModel.formatValue(oParams.procType,
					oCUF.EDM_STRING)
		};
		oModel.read("retrieveTaskStatus", null, mParams, false, fnSuccess,
				fnError);
		// oModel
		// .callFunction("retrieveTaskStatus", "GET", {
		// Guid : oParams.guid
		// || "00000000-0000-0000-0000-000000000000",
		// TransactionType : oParams.procType
		// }, null, jQuery.proxy(fnSuccess, this, oParams.procType),
		// fnError, true);
	},

	getInitialStatus : function() {
		var oCUU = cus.crm.mytasks.util.Util, oCustomizingModel = oCUU
				.getCustomizingModel();
		var oIS = {
			statID : oCustomizingModel.getProperty("/initialStatus"),
			statText : oCustomizingModel.getProperty("/initialStatusText")
		};
		return oIS;
	},

	setInitialStatus : function(oCustomizingModel) {
		var curStatList = oCustomizingModel.getProperty("/statList");
		var oIS = this.parseInitialStatus(curStatList);
		oCustomizingModel.setProperty("/initialStatus", oIS && oIS.statID);
		oCustomizingModel
				.setProperty("/initialStatusText", oIS && oIS.statText);
	},

	parseInitialStatus : function(aStatusValues) {
		var oIS = undefined;
		for ( var ii = 0, jj = aStatusValues.length; ii < jj; ii++) {
			var curStatus = aStatusValues[ii];
			if (curStatus.InitialStatus === true
					|| curStatus.InitialStatus === "true") {
				oIS = {
					statID : curStatus.StatusID,
					statText : curStatus.StatusTxt
				};
				break;
			}
		}
		return oIS;
	},

	setStatusValuesAgainstTransactionType : function(aMasterSet) {
		if (Array.isArray(aMasterSet) && aMasterSet.length > 0) {
			var oStatusValuesBasedOnTT = {}, oCustomizingModel = cus.crm.mytasks.util.Util
					.getCustomizingModel();
			if (aMasterSet[0]["TransactionType"]) {
				aMasterSet.sort(function(a, b) {
					if (a.TransactionType > b.TransactionType)
						return 1;
					else if (a.TransactionType < b.TransactionType)
						return -1;
					return 0;
				});
				for ( var i = 0, j = aMasterSet.length; i < j; i++) {
					var oStatus = aMasterSet[i];
					if (!oStatusValuesBasedOnTT[oStatus["TransactionType"]])
						oStatusValuesBasedOnTT[oStatus["TransactionType"]] = [ oStatus ];
					else
						oStatusValuesBasedOnTT[oStatus["TransactionType"]]
								.push(oStatus);
				}
				oCustomizingModel.setProperty("/masterStatusSet",
						oStatusValuesBasedOnTT);
			}
		}
	},

	bindStatusValuesToTask : function(oModel, oParams) {
		var oTempState = {}, oCU = cus.crm.mytasks.util, oCM = oCU.Util
				.getCustomizingModel();
		if (!oModel)
			oModel = oCU.Schema.getModel();
		if (oParams) {
			if (oParams.bExpandCall) {
				oTempState.paths = oParams.curResults || [];
				oTempState.controlval = [];
				for ( var i = -1, sPath; sPath = oTempState.paths[++i];)
					oTempState.controlval.push(oModel.getObject('/' + sPath));
			} else {
				oTempState.paths = [];
				oTempState.controlval = oParams.curResults || [];
				var aDummy = undefined, sPath = undefined;
				for ( var i = -1, oCurObject; oCurObject = oTempState.controlval[++i];) {
					aDummy = oCurObject.__metadata.id.split("/");
					sPath = aDummy[aDummy.length - 1];
					oTempState.paths.push(sPath);
				}
			}
			oCM.setProperty("/statList", oTempState.controlval);
		}
	},
};
},
	"cus/crm/mytasks/util/TechnicalInfoUtil.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mytasks.util.TechnicalInfoUtil");
jQuery.sap.require("cus.crm.mytasks.util.Util");

cus.crm.mytasks.util.TechnicalInfoUtil = {
	getEmployeeName : function() {
		var oCustomizingModel = cus.crm.mytasks.util.Util.getCustomizingModel();
		var employeeName = oCustomizingModel
				.getProperty("/techInfo/ResponsibleName");
		return employeeName;
	},

	isPrivacyAllowed : function(bIsDefaultTaskType) {
		var oCustomizingModel = cus.crm.mytasks.util.Util.getCustomizingModel();
		var privacyAllowed = bIsDefaultTaskType ? oCustomizingModel
				.getProperty("/techInfo/PrivateForDefaultTaskType")
				: oCustomizingModel.getProperty("/techInfo/PrivateAllowed");
		return privacyAllowed;
	},

	setPrivacyForSelectedTask : function(bPrivateAllowed) {
		var oCustomizingModel = cus.crm.mytasks.util.Util.getCustomizingModel();
		oCustomizingModel.setProperty("/techInfo/PrivateAllowed",
				bPrivateAllowed);
	},

	parseTechInfoOData : function(oData, response) {
		// make sure customizing is accessible under path
		// /techInfo and not /results
		var oCopyObject = {
			techInfo : {
				PrivateForDefaultTaskType : false
			}
		};
		jQuery.extend(oCopyObject.techInfo, oData.retrieveTaskTech, true);
		oCopyObject.techInfo.PrivateForDefaultTaskType = oCopyObject.techInfo.PrivateAllowed;
		delete oCopyObject.techInfo.PrivateAllowed;
		// merge data obtained from the BE into the customizing model
		var oCustomizingModel = cus.crm.mytasks.util.Util.getCustomizingModel();
		oCustomizingModel.setData(oCopyObject, true);
	},

	read : function(oView, fnSuccHandler) {
		var oCustomizingModel = cus.crm.mytasks.util.Util.getCustomizingModel();
		if (oCustomizingModel.getProperty("/techInfo") == undefined) {
			jQuery.sap.log.debug("Reading Tech Info from BE");
			// call-backs
			var errorHandler = function(oError) {
				cus.crm.mytasks.util.Util.onRequestFailed(oError,
						"Operation failed: Reading Task Tech Info. ");

			};
			var successHandler = function(oData, response) {
				cus.crm.mytasks.util.Util.logObjectToConsole(
						"Operation successfull: Reading Task Tech Info. ",
						oData);
				this.parseTechInfoOData(oData, response);
				if (fnSuccHandler)
					fnSuccHandler.call();
			};
			oView.getModel().callFunction("retrieveTaskTech", "GET", {}, null,
					jQuery.proxy(successHandler, this), errorHandler);
		}
		cus.crm.mytasks.util.Util.bindCustomizingModel(oView);
	}
};
},
	"cus/crm/mytasks/util/Util.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mytasks.util.Util");
jQuery.sap.require("cus.crm.mytasks.util.AppConfig");
jQuery.sap.require("cus.crm.mytasks.util.Formatter");
jQuery.sap.require("cus.crm.mytasks.util.TechnicalInfoUtil");
jQuery.sap.require("cus.crm.mytasks.util.PriorityListUtil");
jQuery.sap.require("cus.crm.mytasks.util.StatusListUtil");

cus.crm.mytasks.util.Util = {
	MAIN_MODEL_NAME : "cus.crm.mytasks",
	CUST_MODEL_NAME : "cus.crm.mytasks.customizing",
	isBusyDialog : false,
	busyDialogReleaseID : undefined,
	busyDialogOpenID : undefined,
	busyDialog : new sap.m.BusyDialog({
		customIcon : sap.ca.ui.images.images.Flower
	}),
	dummyString : "Operation successfull: Executing F4-Help(Account/Contact/Employee) oData service.",

	logObjectToConsole : function(message, oObject, severity) {
		var oConfig = cus.crm.mytasks.util.AppConfig.getConfiguration(), nameOfAHandyLogger = "console", debugLogger = window[nameOfAHandyLogger], isDebug = oConfig.isDebug;
		var loggerForObjects;
		if (isDebug && debugLogger) {
			loggerForObjects = debugLogger;
			if ("info" == severity)
				loggerForObjects.info(message, oObject);
			else if ("warning" == severity)
				loggerForObjects.warn(message, oObject);
			else if ("error" == severity)
				loggerForObjects.error(message, oObject);
			else
				loggerForObjects.log(message, oObject);

		} else {
			loggerForObjects = jQuery.sap.log;
			try {
				var messageToLog = message + JSON.stringify(oObject);
				if ("info" == severity)
					loggerForObjects.info(messageToLog);
				else if ("warning" == severity)
					loggerForObjects.warning(messageToLog);
				else if ("error" == severity)
					loggerForObjects.error(messageToLog);
				else
					loggerForObjects.debug(messageToLog);
			} catch (oError) {
				var sStr = "Error while writing object to log, run app with param 'debugmode=true' for console logging";
				loggerForObjects.debug(sStr, oError);
			}
		}
	},

	createEmptyTaskObject : function(oCUS, oParams) {
		var oCU = cus.crm.mytasks.util, oCUP = oCU.PriorityListUtil, defaultPrio = oCUP
				.getDefaultPrio(), oCUF = oCU.Formatter;
		var oTask = {
			"Id" : "",
			"Description" : oParams.desc ? oParams.desc : "",
			"Priority" : oParams.priority ? oParams.priority : defaultPrio,
			"Private" : false,
			"Completed" : false,
			"ContactId" : oParams.contactID ? oParams.contactID : "",
			"ContactName" : oParams.contactName ? oParams.contactName : "",
			"AccountId" : oParams.accountID ? oParams.accountID : "",
			"AccountName" : oParams.accountName ? oParams.accountName : "",
			"Note" : oParams.note ? oParams.note : "",
			"DueDate" : oCUF.getCurrentDate(),
			"ResponsibleId" : "",
			"ResponsibleName" : "",
		};
		// WAVE 4 ENHANCEMENT
		if (oCUS.getServiceVersion() == 1
				&& oCUS.getServiceSchemaVersion() >= 2) {
			if (oParams.procType && oParams.procType !== "noProcType")
				oTask.TransactionType = oParams.procType;
			if (oCUS.getServiceSchemaVersion() >= 3) {
				if (oParams.predecessorGUID)
					oTask.PredecessorGUID = oParams.predecessorGUID;
				if (oParams.ProcessTypeDescription)
					oTask.ProcessTypeDescription = oParams.ProcessTypeDescription;
				oTask.UserStatusCode = oCU.StatusListUtil.getInitialStatus().statID;
			} else if (oParams.predecessorID)
				oTask.PredecessorID = oParams.predecessorID;
		}
		oCUF.eraseTime(oTask.DueDate);
		this.setDefaultValues(oTask);
		this.logObjectToConsole("New Task: ", oTask);
		return oTask;
	},

	setDefaultValues : function(oTask) {
		// implement own defaulting here
	},

	assureDescription : function(oTask) {
		var descriptionIsEmpty = ("" === oTask.Description), oResourceBundle = cus.crm.mytasks.util.Formatter
				.getResourceBundle();
		if (descriptionIsEmpty)
			oTask.Description = oResourceBundle.getText("NEW_TASK_TITLE");
	},

	getMainModel : function() {
		var oMainModel = sap.ui.getCore().getModel(
				cus.crm.mytasks.util.Util.MAIN_MODEL_NAME);
		if (oMainModel == undefined) {
			oMainModel = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(oMainModel,
					cus.crm.mytasks.util.Util.MAIN_MODEL_NAME);
		}
		return oMainModel;
	},

	setMainModel : function(oModel) {
		sap.ui.getCore().setModel(oModel,
				cus.crm.mytasks.util.Util.MAIN_MODEL_NAME);
	},

	getCustomizingModel : function() {
		var oCore = sap.ui.getCore(), oCustomizingModel = oCore
				.getModel(cus.crm.mytasks.util.Util.CUST_MODEL_NAME);
		if (!oCustomizingModel) {
			oCustomizingModel = new sap.ui.model.json.JSONModel();
			oCore.setModel(oCustomizingModel,
					cus.crm.mytasks.util.Util.CUST_MODEL_NAME);
		}
		return oCustomizingModel;
	},

	bindCustomizingModel : function(oView) {
		if (!oView.getModel(cus.crm.mytasks.util.Util.CUST_MODEL_NAME)) {
			var oCustomizingModel = cus.crm.mytasks.util.Util
					.getCustomizingModel();
			oView.setModel(oCustomizingModel,
					cus.crm.mytasks.util.Util.CUST_MODEL_NAME);
		}
	},

	requestBusyDialog : function() {
		if (cus.crm.mytasks.util.Util.isBusyDialog
				|| cus.crm.mytasks.util.Util.busyDialogOpenID)
			jQuery.sap.log.debug("Busy Dialog already opened");
		else {
			jQuery.sap.log.debug("Busy Dialog open triggered");
			// do not open imediately
			cus.crm.mytasks.util.Util.busyDialogOpenID = jQuery.sap
					.delayedCall(750, this, function() {
						cus.crm.mytasks.util.Util.openBusyDialogDelayed();
					});
		}
		if (cus.crm.mytasks.util.Util.busyDialogReleaseID) {
			jQuery.sap
					.clearDelayedCall(cus.crm.mytasks.util.Util.busyDialogReleaseID);
			cus.crm.mytasks.util.Util.busyDialogReleaseID = undefined;
			jQuery.sap.log.debug("Release Busy Dialog canceled");
		}
	},

	releaseBusyDialog : function(force) {
		if (cus.crm.mytasks.util.Util.isBusyDialog
				&& !cus.crm.mytasks.util.Util.busyDialogReleaseID) {
			jQuery.sap.log.debug("Busy Dialog release triggered");
			// wait some time in case followup-actions request busy dialog
			// agaian, it should not disaapera and appear agaian, but just sty
			// there
			cus.crm.mytasks.util.Util.busyDialogReleaseID = jQuery.sap
					.delayedCall(250, this, function() {
						cus.crm.mytasks.util.Util.releaseBusyDialogDelayed();
					});

		} else
			jQuery.sap.log.debug("Busy Dialog already released");

		if (cus.crm.mytasks.util.Util.busyDialogOpenID) {
			jQuery.sap
					.clearDelayedCall(cus.crm.mytasks.util.Util.busyDialogOpenID);
			cus.crm.mytasks.util.Util.busyDialogOpenID = undefined;
			jQuery.sap.log.debug("Open Busy Dialog canceled");
		}
	},

	releaseBusyDialogDelayed : function() {
		cus.crm.mytasks.util.Util.isBusyDialog = false;
		cus.crm.mytasks.util.Util.busyDialogReleaseID = undefined;
		cus.crm.mytasks.util.Util.busyDialog.close();
		jQuery.sap.log.debug("Busy Dialog released");
	},

	openBusyDialogDelayed : function() {
		cus.crm.mytasks.util.Util.isBusyDialog = true;
		cus.crm.mytasks.util.Util.busyDialogOpenID = undefined;
		cus.crm.mytasks.util.Util.busyDialog.open();
		jQuery.sap.log.debug("Busy Dialog opened");
	},

	// keep an own search model for the search helps because of the count issue
	// and because to keep the app model separated -> refresh of bindings
	// same oData service of course
	getSearchModel : function() {
		if (!this.oSearchModel) {
			var oCU = cus.crm.mytasks.util, oAppInfo = oCU.AppConfig
					.getConfiguration();
			if (oAppInfo.isMock) {
				// mock mode / default mode
				this.oSearchModel = new sap.ui.model.json.JSONModel();
				this.oSearchModel.loadData(oAppInfo.mockModelPath, "", true);
			} else {
				this.oSearchModel = oCU.Schema.getModel()
						|| oCU.Util.getMainModel();
				// register success handler
				var fnReqCompleted = function(oEvent) {
					var oModel = oEvent.getSource(), oCUU = cus.crm.mytasks.util.Util;
					oCUU.releaseBusyDialog();
					oCUU.logObjectToConsole(oCUU.dummyString, oModel);
				}, fnReqSent = function(oEvent) {
					jQuery.sap.log.debug("Firing Search oData");
					cus.crm.mytasks.util.Util.requestBusyDialog();
				}, fnReqFailed = function(oEvent) {
					cus.crm.mytasks.util.Util.onRequestFailed(oEvent,
							oCUU.dummyString);
				};
				this.oSearchModel.attachRequestCompleted(
						jQuery.proxy(fnReqCompleted, this)).attachRequestSent(
						jQuery.proxy(fnReqSent, this)).attachRequestFailed(
						jQuery.proxy(fnReqFailed, this));
			}
		}
		return this.oSearchModel;
	},

	onRequestFailed : function(oError, message, oFollowup) {
		var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCUF = oCU.Formatter, oCUA = oCU.AppConfig, sDetails = undefined, sMessage = undefined, logMessage = undefined;
		if (message)
			logMessage = message;
		else
			logMessage = "oData request failed";
		oCUU.logObjectToConsole(logMessage, oError, "error");

		// prepare regex to parse message
		var pattern = '"message":{"lang":"[^"]+","value":"(.+?)"[},]', regEx = new RegExp(
				pattern);
		if (oError && oError.response && oError.response.body) {
			var oConfig = oCUA.getConfiguration();
			if (oConfig.isDebug)
				sDetails = oError.response.body;
			// example response
			// var oError = {
			// "error" : {
			// "code" : "CRM_TASK_ODATA/006",
			// "message" : {
			// "lang" : "de",
			// "value" : "Task cannot be set to completed. Contact your system
			// administrator."
			// },
			// "innererror" : {
			// "transactionid" : "524485850B83058CE10000000A4451B6",
			// "errordetails" : [
			// {
			// "code" : "CRM_TASK_ODATA/006",
			// "message" : "Task cannot be set to Completed. Contact your system
			// administrator.",
			// "propertyref" : "",
			// "severity" : "error"
			// }, {
			// "code" : "/IWBEP/CX_MGW_BUSI_EXCEPTION",
			// "message" : "",
			// "propertyref" : "",
			// "severity" : "error"
			// } ]
			// }
			// }
			// };

			// parse message from body
			var aResult = oError.response.body.match(regEx);
			if (Array.isArray(aResult))
				sMessage = aResult[1];
		}

		if (!sMessage)
			sMessage = oCUF.getResourceBundle().getText("GENERIC_ERROR");
		if (oFollowup && oFollowup.sv && oFollowup.sv === 1) {
			if (typeof oFollowup.ssv === "number" && oFollowup.ssv >= 3)
				sDetails = oFollowup.msg;
		} else if (oFollowup && oFollowup.msg) {
			sDetails = sMessage;
			sMessage = oFollowup.msg;
			if (sMessage === "")
				sMessage = oCUF.getResourceBundle
						.getText("S3_RENAME_ATTACHMENT_FAILED");
		}

		sap.ca.ui.message.showMessageBox({
			type : sap.ca.ui.message.Type.ERROR,
			message : sMessage,
			details : sDetails
		});
		cus.crm.mytasks.util.Util.releaseBusyDialog();
	},

	saveTaskAndUpdateTaskList : function(bIsNewTask, oTaskToSave, oView,
			fnSuccess, fnError, bAsync) {
		var oModel = oView.getModel(), sPath = "", sMethod = "";
		this.assureDescription(oTaskToSave);
		this._checkForMaxLength(oTaskToSave);
		sPath = bIsNewTask ? "/Tasks" : oView.getBindingContext().getPath();
		sMethod = bIsNewTask ? "POST" : "MERGE"; // || "PUT";
		oModel.addBatchChangeOperations([ oModel.createBatchOperation(sPath,
				sMethod, oTaskToSave) ]);
		oModel.submitBatch(fnSuccess, fnError, bAsync);
	},

	_checkForMaxLength : function(oTaskToSave) {
		var oCUS = cus.crm.mytasks.util.Schema, aPropNames = [ "AccountName",
				"ContactName", "ResponsibleName" ];

		// Ensure AccountName, ContactName & ResponsibleName don't exceed
		// maxLength
		for ( var i = -1, sPropName; sPropName = aPropNames[++i];)
			oTaskToSave[sPropName] = oTaskToSave[sPropName].substr(0, oCUS
					._getPropertyInfoOfEntity("Task", sPropName).maxLength);
	},

	_onDeleteTaskError : function(oError) {
		if (this.navFromAccounts || this.bIsBookmarkUsed) {
			var aDummy = sap.ushell.Container.getService("URLParsing").getHash(
					location).split("/"), oView = this.getView(), oContext = new sap.ui.model.Context(
					oView.getModel(), '/' + aDummy[aDummy.length - 1]);
			oView.setBindingContext(oContext);
		}
		cus.crm.mytasks.util.Util.onRequestFailed(oError,
				"Operation failed: Delete Task");
	},

	_onDeleteTaskSuccess : function(oTask, oData, oResponses, aErrorResponses) {
		var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCUF = oCU.Formatter;
		if (aErrorResponses && aErrorResponses.length > 0)
			this._checkFor412StatusCode(aErrorResponses[0],
					"Operation failed: Delete Task");
		else {
			oCUU.logObjectToConsole("Operation successful: Delete Task", oTask);
			var message = oCUF.getResourceBundle().getText(
					"DETAILS_DELETE_CONFIRMATION",
					[ "'" + oTask.Description + "'" ]);
			// Not using sap.ca.ui Toast since mOptions cannot be set plus
			// parameter set in sap.m Toast is set to true by default
			// sap.ca.ui.message.showMessageToast(message);
			sap.m.MessageToast.show(message, {
				closeOnBrowserNavigation : false
			});
			if (this.navFromAccounts) {
				this.navFromAccounts = false;
				sap.ui.getCore().getEventBus().publish("cus.crm.mytasks",
						"taskDeleted");
			}
			this._navBack();
			oCUU.releaseBusyDialog();
		}
	},

	deleteTaskAndUpdateTaskList : function(oTaskToDelete, oController) {
		var oView = oController.getView(), oModel = oView.getModel(), fnSuccess = jQuery
				.proxy(this._onDeleteTaskSuccess, oController, oTaskToDelete), fnError = jQuery
				.proxy(this._onDeleteTaskError, oController), sPath = oView
				.getBindingContext().getPath(), sMethod = "DELETE";
		oModel.addBatchChangeOperations([ oModel.createBatchOperation(sPath,
				sMethod, oTaskToDelete) ]);
		if (oController.navFromAccounts || oController.bIsBookmarkUsed)
			oView.unbindContext();
		oModel.submitBatch(fnSuccess, fnError, true);
	},

	getAllPrerequisites : function(oModel, aPathsToRead, oCallback) {
		var aReadOp = [], oCU = cus.crm.mytasks.util;
		if (!oModel)
			oModel = oCU.Util.getMainModel() || oCU.Schema.getModel();
		for ( var i = 0, j = aPathsToRead.length; i < j; i++)
			aReadOp.push(oModel.createBatchOperation(aPathsToRead[i], "GET"));
		if (aReadOp.length > 0) {
			oModel.addBatchReadOperations(aReadOp);
			oModel.submitBatch(oCallback.success, oCallback.error,
					oCallback.async);
		}
	},

	getDeferredObject : function(sContextPath, sNavLink) {
		var oObjectToReturn = null;
		if (sContextPath && sContextPath !== "" && sNavLink && sNavLink !== "") {
			var oCU = cus.crm.mytasks.util, oModel = oCU.Schema.getModel(), sRelativeUrl;
			switch (sNavLink) {
			case oCU.Attachments.NAVLINK:
			case oCU.DocumentHistory.NAVLINK:
			case "TaskStatuses":
			case "TaskLogSet":
				sRelativeUrl = [ oModel.sServiceUrl, sContextPath, sNavLink ]
						.join("/");
				oObjectToReturn = {
					"__deferred" : {
						"uri" : oCU.Formatter.formatAttachmentURL(sRelativeUrl)
					}
				};
				break;
			default:
				break;
			}
		}
		return oObjectToReturn;
	}
};
},
	"cus/crm/mytasks/view/ErrorMessageDialog.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<Dialog xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:l="sap.ui.layout"\n\ttitle="{i18n>S4_MESSAGES_TITLE}" stretch="{device>isPhone}">\n\t<content>\n\t\t<!-- <List items="{TaskLogs>/list}"> <items> <StandardListItem icon="{TaskLogs>Icon}" \n\t\t\ttitle="{TaskLogs>LogMessage}" /> </items> </List> -->\n\t\t<l:VerticalLayout width="100%" content="{TaskLogs>/list}">\n\t\t\t<l:content>\n\t\t\t\t<l:HorizontalLayout>\n\t\t\t\t\t<l:content>\n\t\t\t\t\t\t<core:Icon size="1.375rem" width="3rem" height="3rem"\n\t\t\t\t\t\t\tcolor="{TaskLogs>IconColor}" src="{TaskLogs>Icon}" allowWrapping="true" />\n\t\t\t\t\t\t<Text class="TaskErrorMsg" textAlign="Left" text="{TaskLogs>LogMessage}" />\n\t\t\t\t\t</l:content>\n\t\t\t\t</l:HorizontalLayout>\n\t\t\t</l:content>\n\t\t</l:VerticalLayout>\n\t</content>\n\t<endButton>\n\t\t<Button text="{i18n>OK}" press="closeErrorMsg" />\n\t</endButton>\n</Dialog>',
	"cus/crm/mytasks/view/FollowupDialog.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<SelectDialog xmlns="sap.m" xmlns:core="sap.ui.core"\n\ttitle="{i18n>PROCESS_TYPE}" noDataText="{i18n>SEARCH_LIST_NODATA_GENERIC}"\n\tmultiSelect="false" items="{FollowupTypes>/}" liveSearch="liveSearchFollowUpType"\n\tsearch="searchFollowUpType" confirm="selectFollowUpType" contentWidth="30rem">\n\t<StandardListItem title="{FollowupTypes>Description}"\n\t\tdescription="{FollowupTypes>ProcessTypeCode}">\n\t\t<customData>\n\t\t\t<core:CustomData key="PrivacyAllowed" value="{FollowupTypes>PrivateFlag}" />\n\t\t</customData>\n\t</StandardListItem>\n</SelectDialog>',
	"cus/crm/mytasks/view/ProcessTypeDialog.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<SelectDialog xmlns="sap.m" xmlns:core="sap.ui.core"\n\ttitle="{i18n>PROCESS_TYPE}" noDataText="{i18n>SEARCH_LIST_NODATA_GENERIC}"\n\tmultiSelect="" items="{json>/ProcessTypes}" search="searchProcess"\n\tconfirm="selectProcess">\n\t<StandardListItem title="{json>Description}"\n\t\tdescription="{json>ProcessTypeCode}">\n\t\t<customData>\n\t\t\t<core:CustomData key="ProcessTypeCode" value="{json>ProcessTypeCode}" />\n\t\t\t<core:CustomData key="ProcessTypeDescription" value="{json>Description}" />\n\t\t\t<core:CustomData key="PrivacyAllowed" value="{json>PrivateFlag}" />\n\t\t\t<core:CustomData key="Priority" value="{json>Priority}" />\n\t\t</customData>\n\t</StandardListItem>\n</SelectDialog>',
	"cus/crm/mytasks/view/S2.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// jQuery.sap.require("sap.ca.scfld.md.controller.BaseMasterController");
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");

// sap.ca.scfld.md.controller.BaseMasterController
sap.ca.scfld.md.controller.ScfldMasterController
		.extend(
				"cus.crm.mytasks.view.S2",
				{
					_sSearchPattern : "",
					aLastFilters : undefined,
					aLastSorters : undefined,
					_bIsRefreshRequested : false,
					_timestampCompletedTask : undefined,
					accountID : undefined,
					accountName : undefined,
					scrollTo : undefined,
					scrollToCounter : 0,
					scrollMax : false,
					SCROLL_TO_BOTTOM : -1,
					bIsFirstCallInTasksApp : false,
					oMHFOptions : {
						sI18NMasterTitle : "LIST_PAGE_TITLE_WITH_NUMBER"
					},
					oStatusDDLB : {
						bNotRetrieved : false,
						errorObj : null
					},

					// Controller Methods - onInit
					onInit : function() {
						jQuery.sap.log.debug("BEGINN onInit s2");
						// execute the onInit for the base class
						// ScfldMasterController
						sap.ca.scfld.md.controller.ScfldMasterController.prototype.onInit
								.call(this);

						var oControllers = new sap.ui.model.json.JSONModel({
							s2Controller : this,
							s3Controller : undefined,
							s4Controller : undefined
						});
						this.oApplicationFacade.setApplicationModel(
								"controllers", oControllers);
						var oCU = cus.crm.mytasks.util, oView = this.getView(), oModel = oView
								.getModel(), oCUS = oCU.Schema;
						if (!oCUS.getServiceVersion())
							oCUS.initServiceSchemaVersion(oModel, "Task");

						this._getTechAndPrioListInfo(oModel);
						// TODO: remove workarounds
						this.overrideDefineFooter();
						this.overrideCreateMasterPullToRefresh();
						this.overrideRefreshHandling();
						// Get accountID query parameter
						var myComponent = sap.ui
								.component(sap.ui.core.Component
										.getOwnerIdFor(oView)), fnResize = jQuery
								.proxy(function(evt) {
									cus.crm.mytasks.util.Util
											.logObjectToConsole(
													"Resize Event: ", evt);
									if (evt.size && evt.size.height != 0
											&& evt.size.width != 0)
										this.fixDisplayOfDirectInput();
								}, this), oParams = undefined;
						if (myComponent && myComponent.getComponentData())
							oParams = myComponent.getComponentData().startupParameters;
						this.oRouter.attachRouteMatched(jQuery.proxy(
								this.handleNavigationWithTaskList, this,
								oParams));
						this.resizeHandlerDeRegisterToken = sap.ui.core.ResizeHandler
								.register(this.getPage(), fnResize);
						this.bIsFirstCallInTasksApp = true;
						jQuery.sap.log.debug("END onInit s2");
					},

					handleNavigationWithTaskList : function(oParams, oEvent) {
						var sRouteName = oEvent.getParameter("name");
						switch (sRouteName) {
						case "taskList":
							if (oParams) {
								jQuery.sap.log
										.debug("startup parameters of CRM-MyTasks are "
												+ JSON.stringify(oParams));
								if (oParams.processType)
									this.processType = oParams.processType
											.toString();
								if (oParams.accountID)
									this.accountID = oParams.accountID
											.toString();
							}
							if (this.bIsFirstCallInTasksApp) {
								this.getView().getModel()
										.attachRequestCompleted(
												this._onRequestCompleted, this)
										.attachRequestSent(this._onRequestSent,
												this).attachRequestFailed(
												this._onRequestFailed, this);
								this
										.getList()
										.attachUpdateFinished(
												this._onListUpdateFinished,
												this)
										.attachUpdateStarted(
												this._onListUpdateStarted, this);
								this.setInitialFilters();
								this.bIsFirstCallInTasksApp = false;
							}
							break;
						case "fullScreen":
							this.getList().attachUpdateFinished(
									this.scrollToPositionAfterUpdate, this);
							break;
						}
					},

					// Controller Methods - onBeforeRendering
					onBeforeRendering : function() {

					},

					// Controller Methods - onAFterRendering
					onAfterRendering : function() {
						jQuery.sap.log.debug("on after render s2");
						this.scrollToPosition();
						cus.crm.mytasks.util.Util.releaseBusyDialog();
					},

					// Controller Methods - onExit
					onExit : function() {

					},

					/*
					 * FIORI WAVE 2 - Branch : Rel - 1.0 START of INITAL
					 * DEVELOPMENT for MyTasks
					 */
					// START of SCAFFOLDNG over-riding methods
					isBackendSearch : function() {
						return true;
					},

					getHeaderFooterOptions : function() {
						return this.oMHFOptions;
					},

					applyBackendSearchPattern : function(sFilterPattern,
							oBinding) {
						this._sSearchPattern = sFilterPattern;
						// filter considers search as well
						this.handleFilter();
					},

					/**
					 * Overrides the Scaffold code's createMasterPullToRefresh
					 * method. We use we have to move the pull to refresh from
					 * the page to the scrollcontainer
					 */
					overrideCreateMasterPullToRefresh : function() {
						var oMHFHelper = this.oApplicationFacade.oApplicationImplementation.oMHFHelper;
						this.superCreatePTR = oMHFHelper.createMasterPullToRefresh;
						oMHFHelper.createMasterPullToRefresh = jQuery.proxy(
								this.injectPTRToScrollContainer, oMHFHelper);
					},

					injectPTRToScrollContainer : function(oController, oPage) {
						var scollContainer = oController.byId("scroll");
						oController.superCreatePTR.call(this, oController,
								scollContainer);
					},

					/**
					 * In case of the refresh button is pressed, the scaffolding
					 * does not call the search logic of application, but simply
					 * refreshes the list, so that TOP parameter is reset.
					 */
					overrideRefreshHandling : function() {
						var oMHFHelper = this.oApplicationFacade.oApplicationImplementation.oMHFHelper;
						oMHFHelper.handleMasterSearch = jQuery.proxy(
								this.injectRefreshList, oMHFHelper);
					},

					injectRefreshList : function(oController, bIsRefresh) {
						// this refers to oMHFHelper.
						this.refreshList(oController, false);
					},

					/**
					 * Overrides the Scaffold code's defineFooter method. We use
					 * our own footer and just decorate it with the settings
					 * button.
					 */
					overrideDefineFooter : function() {
						var oMHFHelper = this.oApplicationFacade.oApplicationImplementation.oMHFHelper;
						oMHFHelper.defineFooter = jQuery.proxy(
								this.injectGenericSettingsButtonToMyTaskFooter,
								oMHFHelper);
					},

					/**
					 * @override Override default data loaded behaviour
					 */
					onDataLoaded : function() {
						jQuery.sap.log.debug("dataload");
						var aLM = [ "cus.crm.mytasks.customizing",
								"cus.crm.mytasks" ];
						for ( var i = -1, c; c = sap.ui.getCore().getModel(
								aLM[++i]);)
							cus.crm.mytasks.util.Util.logObjectToConsole(
									"Model with name '" + aLM[i] + "': ", c,
									"info");
					},

					injectGenericSettingsButtonToMyTaskFooter : function(
							oController, oPage) {
						// get my task footer and inject it
						// into the scaffolding
						var oBar = oController.byId("dummyFooter");
						oController._oControlStore.oButtonListHelper.oBar = oBar;

						// remember the already defined left content
						// and clean the bar, so that settings button is first
						// button, when added
						var oContentLeft = {};
						if (oBar) { // FIXME: quickfix
							oContentLeft = oBar.getContentLeft();
							oBar.removeAllContentLeft();
						}
						// let the scaffolding define the
						// settings button (this =
						// this.oApplicationFacade.oApplicationImplementation.oMHFHelper)
						this.defineSettingsButton(oController);
						// now add my task specific left content again
						for ( var ii = 0; ii < oContentLeft.length; ii++) {
							var oControl = oContentLeft[ii];
							if (this.oApplicationImplementation.bIsPhone)
								oBar.addContentRight(oControl);
							else
								oBar.addContentLeft(oControl);
						}

						// propagate the my task footer to the page
						if (oBar) { // FIXME: quickfix
							var oPage = oController.byId("page");
							oPage.setFooter(oBar);
						}
					},
					// END of SCAFFOLDNG over-riding methods

					_onListUpdateFinished : function(oEvent) {
						cus.crm.mytasks.util.Util.releaseBusyDialog();
						this.fixDisplayOfDirectInput();
					},

					_onListUpdateStarted : function(oEvent) {
						cus.crm.mytasks.util.Util.requestBusyDialog();
					},

					_onRequestCompleted : function(oEvent) {
						var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCUF = oCU.Formatter, oBundle = oCUF
								.getResourceBundle(), sLog = "Operation successful: Executing Task oData service.";
						oCUU.logObjectToConsole(sLog, oEvent.getSource());
						// refresh title
						var numberOfTasks = this.getList().getBinding('items')
								.getLength();
						jQuery.sap.log.debug("# objects=" + numberOfTasks);
						this.oApplicationFacade.oApplicationImplementation.oMHFHelper
								.setMasterTitle(this, numberOfTasks);
						if (this.accountID) {
							var bIsFromAccounts = cus.crm.myaccounts
									&& cus.crm.myaccounts.NavigationHelper
									&& cus.crm.myaccounts.NavigationHelper.qty;
							if (bIsFromAccounts
									&& cus.crm.myaccounts.NavigationHelper.qty > numberOfTasks) {
								var aParams = [ numberOfTasks,
										cus.crm.myaccounts.NavigationHelper.qty ], message = oBundle
										.getText("LIST_FILTERED_BY_MYITEMS",
												aParams);
								sap.m.MessageToast.show(message, {
									closeOnBrowserNavigation : false
								});
								// sap.ca.ui.message.showMessageToast(message);
								// Not needed again. Clear the variable
								cus.crm.myaccounts.NavigationHelper.qty = undefined;
							}
							var oTaskData = oEvent.getSource().oData, aTaskList = Object
									.getOwnPropertyNames(oTaskData);
							if (aTaskList && aTaskList.length > 0) {
								this.accountName = oTaskData[aTaskList[0]].AccountName;
								var oFL = this.getView().byId("filterLabel");
								oFL.setText(oBundle.getText(
										"LIST_FILTER_BAR_ACCOUNT",
										this.accountName));
							}
						}
						oCUU.releaseBusyDialog();
					},

					_onRequestSent : function(oEvent) {
						jQuery.sap.log.debug("Firing oData");
						cus.crm.mytasks.util.Util.requestBusyDialog();
					},

					_onRequestFailed : function(oEvent) {
						cus.crm.mytasks.util.Util
								.onRequestFailed(oEvent,
										"Operation failed: Executing Task oData service.");
					},

					setInitialFilters : function() {
						jQuery.sap.log.debug("setInitialFilters");
						var oSelect = this.getView().byId("filterSelect");
						oSelect.setSelectedKey(this.getDefaultFilterKey());
						this.applyDefaultFilter();
					},

					refreshTaskList : function() {
						var limit = this._timestampCompletedTask + 1500;
						var actualTime = new Date().getTime();
						if (limit > actualTime) {
							var delay = limit - actualTime;
							jQuery.sap.log.debug("Delay Refresh list by "
									+ delay + "ms: " + limit + " > "
									+ actualTime);
							jQuery.sap.delayedCall(delay, this,
									this.refreshTaskList);
						} else {
							jQuery.sap.log.debug("Execute Refresh list: "
									+ limit + " < " + actualTime);
							this.rememberScrollPosition();
							this.getList().attachUpdateFinished(
									this.scrollToPositionAfterUpdate, this);
							this.getView().getModel().refresh();
							this._bIsRefreshRequested = false;
						}
					},

					fixDisplayOfDirectInput : function() {
						var aXMLids = [ "scroll", "taskInput", "dummyFooter" ], aDIVs = [];
						for ( var i = -1, c; c = aXMLids[++i];)
							aDIVs.push(this.getJQueryElemtById(c));

						var iScrollTop = aDIVs[0].offset().top, iNewTaskHeight = aDIVs[1]
								.height(), iWindowHeight = $(window).height();
						var iFooterHeight = aDIVs[2] ? aDIVs[2].height() : 48;
						// add the footer
						var diff = iScrollTop + iFooterHeight;
						if (this.getView().byId(aXMLids[1]).getVisible())
							diff += iNewTaskHeight;

						var newHeight = iWindowHeight - diff;
						var values = [ iScrollTop, iNewTaskHeight,
								iFooterHeight, iWindowHeight ];
						jQuery.sap.log.debug("Values for calculating size: "
								+ values);

						this.getView().byId(aXMLids[0]).setHeight(
								(newHeight / 16) + "rem");
						jQuery.sap.log.debug("Setting new Scroll box height: "
								+ newHeight + "px");
					},

					getJQueryElemtById : function(id) {
						var oElement = this.getView().byId(id);
						if (!oElement)
							return undefined;
						var oId = oElement.sId;
						return $("#" + oId);
					},

					// START of SCROLL CONTAINER operations
					rememberScrollPosition : function(max) {
						this.resetScrolling();
						var oScrollDelegate = this.getView().byId("scroll")
								.getScrollDelegate();
						this.scrollTo = max ? oScrollDelegate.getMaxScrollTop()
								: oScrollDelegate.getScrollTop();
						this.scrollMax = max;
						jQuery.sap.log.debug("scroll position: "
								+ this.scrollTo);
					},

					scrollToPosition : function() {
						if ((this.scrollTo && this.scrollTo > 0)
								|| this.scrollMax) {
							jQuery.sap.log.debug("scrollTo=" + this.scrollTo
									+ "; scrollMax=" + this.scrollMax);
							this.ensureScrolling();
						}
					},

					scrollToPositionAfterUpdate : function() {
						if (sap.ui.Device.support.touch)
							this.byId("scroll").getContent()[0].hide();
						this.getList().detachUpdateFinished(
								this.scrollToPositionAfterUpdate, this);
						this.scrollToPosition();
					},

					ensureScrolling : function() {
						this.scrollToCounter++;
						var oScrollCon = this.getView().byId("scroll"), oScrollDelegate = oScrollCon
								.getScrollDelegate(), iMaxVal = oScrollDelegate
								.getMaxScrollTop();
						if (this.scrollMax && iMaxVal > this.scrollTo)
							this.scrollTo = iMaxVal;
						oScrollCon.scrollTo(0, this.scrollTo, 0);
						// this is ugly, there seems to be various timing issues
						// especially on iPad and iPhone. Scrolling my only work
						// if list is already rendered. So we just re-check
						// periodically if scrolling was applied
						var iOffset = oScrollDelegate.getScrollTop(), bIsScrollRequired = this.scrollTo
								&& iOffset != this.scrollTo, bIsMaxScrollCheck = this.scrollMax
								&& iMaxVal < 0, bIsNumberOfTriesExceeded = this.scrollToCounter < 20;
						(bIsMaxScrollCheck || bIsScrollRequired)
								&& bIsNumberOfTriesExceeded ? jQuery.sap
								.delayedCall(250, this, this.ensureScrolling)
								: this.resetScrolling();
					},

					resetScrolling : function() {
						this.scrollTo = undefined;
						this.scrollToCounter = 0;
						this.scrollMax = false;
					},
					// END of SCROLL CONTAINER operations

					// START of COMPLETION operation of TASK object
					markTaskCompleted : function(oEvent) {
						var oLI = oEvent.getParameter("listItem");
						var oCurrentTask = oLI.getBindingContext().getObject();
						if (oCurrentTask.Completed)
							cus.crm.mytasks.util.Util
									.logObjectToConsole(
											"Task is already completed: ",
											oCurrentTask);
						else {
							this._timestampCompletedTaskCompletedTask = new Date()
									.getTime();
							jQuery.sap.log.debug("completed pressed:"
									+ this._timestampCompletedTask);
							this._greyOutItem(oLI);
							this.rememberScrollPosition();
							this._completeSelectedTask(oCurrentTask, oLI);
							if (!this._bIsRefreshRequested) {
								this._bIsRefreshRequested = true;
								jQuery.sap.delayedCall(1500, this,
										this.refreshTaskList);
							}
						}
					},

					_completeSelectedTask : function(oTask, oLI) {
						var oCUU = cus.crm.mytasks.util.Util;
						oCUU.requestBusyDialog();
						oTask.Completed = true;
						oCUU.logObjectToConsole("Mark Task as completed: ",
								oTask);
						var fnSuccess = function(oTask, oData, oResponses,
								aErrorResponses) {
							var oCU = cus.crm.mytasks.util, oCUU = oCU.Util;
							if (aErrorResponses && aErrorResponses.length > 0)
								oCUU.onRequestFailed(aErrorResponses[0],
										"Operation failed: Delete Task");
							else {
								var oRB = oCU.Formatter.getResourceBundle(), sMsg = [
										"'", oTask.Description, "'" ].join(""), message = oRB
										.getText("LIST_COMPLETE_CONFIRMATION",
												[ sMsg ]);
								oCUU.logObjectToConsole(
										"Operation successful: Complete Task",
										oTask);
								sap.ca.ui.message.showMessageToast(message);
								oCUU.releaseBusyDialog();
							}
						}, fnError = function(oError) {
							cus.crm.mytasks.util.Util.onRequestFailed(oError,
									"Operation failed: Complete Task");
							this.getView().getModel().refresh();
						};
						oCUU.saveTaskAndUpdateTaskList(false, oTask, oLI,
								jQuery.proxy(fnSuccess, this, oTask), jQuery
										.proxy(fnError, this));
					},

					_greyOutItem : function(oItem) {
						var bgColor = sap.ui.core.theming.Parameters
								.get("sapUiExtraLightBG");
						oItem.$().css("background-color", bgColor);
						var txtColor = sap.ui.core.theming.Parameters
								.get("sapUiExtraLightText");
						oItem.$().find("span").css("color", txtColor);
						oItem.$().find("span").css("opacity", "0.8");
					},

					handleListItemPress : function(oEvent) {
						var oCUU = cus.crm.mytasks.util.Util, oList = oEvent
								.getSource(), oContext = oList
								.getBindingContext(), sPath = oContext
								.getPath(), oTaskPressed = oContext.getObject();
						oCUU.requestBusyDialog();
						if (oTaskPressed.Completed)
							oCUU.logObjectToConsole(
									"No nav to completed Task: ", oTaskPressed);
						else {
							this.rememberScrollPosition();
							oCUU.logObjectToConsole("Selected Task: ",
									oTaskPressed);
							this.oRouter.navTo("taskOverview", {
								contextPath : sPath.substr(1)
							});
							// this.oRouter.navTo("taskDetail", {
							// contextPath : sPath.substr(1)
							// });
						}
					},
					// END of COMPLETETION operation of TASK object

					quickCreateTask : function(oEvent) {
						var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCUS = oCU.Schema, oView = this
								.getView();
						oCUU.requestBusyDialog();
						oView.byId("taskInput").setEnabled(false);
						this.rememberScrollPosition(true);
						this.setPartialLoad(false);
						// No need to pass Process Type as a parameter
						var oTaskParams = {
							accountID : this.accountID,
							accountName : this.accountName,
							desc : oEvent.getParameter("newValue"),
						}, oTaskToCreate = oCUU.createEmptyTaskObject(oCUS,
								oTaskParams), oView = this.getView(), fnSuccess = function(
								oData, oResponse, aErrorResponses) {
							var oCUU = cus.crm.mytasks.util.Util;
							if (aErrorResponses && aErrorResponses.length > 0)
								oCUU.onRequestFailed(aErrorResponses[0],
										"Operation failed: Quick Create Task");
							else {
								oCUU
										.logObjectToConsole(
												"Operation successful: Quick Create Task",
												oData);
								oCUU.releaseBusyDialog();
							}
						}, fnError = function(oError) {
							cus.crm.mytasks.util.Util.onRequestFailed(oError,
									"Operation failed: Quick Create Task");
						};
						oView.byId("taskInput").setEnabled(false);
						this.getList().attachUpdateFinished(
								this.scrollToPositionAfterUpdate, this);
						oCUU.saveTaskAndUpdateTaskList(true, oTaskToCreate,
								oView, jQuery.proxy(fnSuccess, this), jQuery
										.proxy(fnError, this));
						oView.byId("taskInput").setEnabled(true).setValue("");
					},

					// START of FILTER operations on TASKS
					getDefaultFilterKey : function() {
						/**
						 * @ControllerHook Provision for getting the default
						 *                 filter key for TASKS. If an
						 *                 additional filter key is provided by
						 *                 the customer, tasks can be filtered
						 *                 by this new key when the end user
						 *                 selects one of these new types. This
						 *                 is called when the Filter key is
						 *                 changed by the user.
						 * @callback sap.ca.scfld.md.controller.BaseMasterController~extHookGetDefaultFilterKey
						 * @return {string}
						 */
						if (this.extHookGetDefaultFilterKey)
							return this.extHookGetDefaultFilterKey();
						else
							return "open";
					},

					applyDefaultFilter : function() {
						/**
						 * @ControllerHook Provision for applying the default
						 *                 filter for TASKS. Additional filter
						 *                 types can be added to tasks by the
						 *                 customer by providing their logic in
						 *                 the Hook implementation. Tasks can be
						 *                 filtered by this additional filter
						 *                 type when the end user selects one of
						 *                 these new types. This is called when
						 *                 the default filter type on TASKS is
						 *                 selected by the user.
						 * @callback sap.ca.scfld.md.controller.BaseMasterController~extHookApplyDefaultFilter
						 * @return {void}
						 */
						if (this.extHookApplyDefaultFilter)
							this.extHookApplyDefaultFilter();
						else
							this.filterTasksOpen();
					},

					createDefaultFilters : function() {
						var oDF = {
							SearchField : this._sSearchPattern.length > 0 ? new sap.ui.model.Filter(
									"Description",
									sap.ui.model.FilterOperator.EQ,
									this._sSearchPattern)
									: null,
							Account : this.accountID ? new sap.ui.model.Filter(
									"AccountId",
									sap.ui.model.FilterOperator.EQ,
									this.accountID) : null,
							MyTask : new sap.ui.model.Filter("MyTask",
									sap.ui.model.FilterOperator.EQ, true)
						}, aFilters = [];
						for ( var sProp in oDF)
							if (oDF[sProp])
								aFilters.push(oDF[sProp]);

						return aFilters;
					},

					handleFilter : function() {
						cus.crm.mytasks.util.Util.requestBusyDialog();
						// get selected key
						this.setPartialLoad(true);
						var select = this.getView().byId("filterSelect");
						var selectedFilterKey = select.getSelectedKey();
						jQuery.sap.log.debug("Selected Filter:"
								+ selectedFilterKey);
						this.resetScrolling();
						switch (selectedFilterKey) {
						case "open":
							jQuery.sap.log.debug("filter tasks open");
							this.filterTasksOpen();
							break;
						case "dueToday":
							jQuery.sap.log.debug("filter tasks due today");
							this.filterTasksToday();
							break;
						case "dueThisWeek":
							jQuery.sap.log.debug("filter tasks due this week");
							this.filterTasksThisWeek();
							break;
						case "completed":
							jQuery.sap.log.debug("filter tasks due this week");
							this.filterTasksCompleted();
							break;
						case this.getDefaultFilterKey():
							jQuery.sap.log.debug("default filter");
							this.applyDefaultFilter();
							break;
						default:
							jQuery.sap.log.debug("custom filter");
							/**
							 * @ControllerHook Provision for Additional Filters
							 *                 on TASKS. Additional filter types
							 *                 can be provided by customer and
							 *                 tasks can be filtered by these
							 *                 new types when the end user
							 *                 selects one of these new types.
							 *                 This is called when the Facet
							 *                 Filter button on the Footer bar
							 *                 is selected.
							 * @callback sap.ca.scfld.md.controller.BaseMasterController~extHookHandleCustomFilter
							 * @param {string}
							 *            sSelectedKey
							 * @return {void}
							 */
							if (this.extHookHandleCustomFilter)
								this
										.extHookHandleCustomFilter(selectedFilterKey);
							break;
						// this.handleCustomFilter(selectedFilterKey);
						}
					},

					filterTasksOpen : function() {
						var aSorters = [ new sap.ui.model.Sorter("CreatedAt") ];
						var aFilters = this.createDefaultFilters();
						aFilters.push(new sap.ui.model.Filter("Completed",
								sap.ui.model.FilterOperator.EQ, false));
						var ret = this.handleAccountNameForDefaultFilter();
						this.setUiMode(true, true, true, ret.title,
								ret.filterBarLabel, ret.aFilterBarLabelParams);
						this._applyFilters(aFilters, aSorters);
					},

					filterTasksCompleted : function() {
						// completed date is changedAt date for completed tasks
						// var oSorter = new sap.ui.model.Sorter("ChangedAt");
						var fnGroupping = function(oContext) {
							var oDateChangedAt = oContext
									.getProperty("ChangedAt");
							var groupHeader = cus.crm.mytasks.util.Formatter
									.formatDate(oDateChangedAt);
							return groupHeader;
						};
						var aSorters = [ new sap.ui.model.Sorter("ChangedAt",
								true, fnGroupping) ];
						var aFilters = this.createDefaultFilters();
						aFilters.push(new sap.ui.model.Filter("Completed",
								sap.ui.model.FilterOperator.EQ, true));
						this.setUiMode(false, false, false,
								"LIST_FILTER_TITLE_COMPLETED",
								"LIST_FILTER_BAR_COMPLETED");
						this._applyFilters(aFilters, aSorters);
					},

					filterTasksToday : function(evt) {
						var aSorters = [ new sap.ui.model.Sorter("DueDate") ];
						var aFilters = this.createDefaultFilters();
						aFilters.push(new sap.ui.model.Filter("Completed",
								sap.ui.model.FilterOperator.EQ, false));
						var today = cus.crm.mytasks.util.Formatter
								.getCurrentDate();
						today = this.setToEndOfDay(today);
						aFilters.push(new sap.ui.model.Filter("DueDate",
								sap.ui.model.FilterOperator.LE, today));
						this.setUiMode(true, false, false,
								"LIST_FILTER_TITLE_TODAY",
								"LIST_FILTER_BAR_TODAY");
						this._applyFilters(aFilters, aSorters);
					},

					filterTasksThisWeek : function(evt) {
						var aSorters = [ new sap.ui.model.Sorter("DueDate") ];
						var aFilters = this.createDefaultFilters();
						aFilters.push(new sap.ui.model.Filter("Completed",
								sap.ui.model.FilterOperator.EQ, false));
						var endOfTheWeek = cus.crm.mytasks.util.Formatter
								.getDateEndOfTheWeek();
						endOfTheWeek = this.setToEndOfDay(endOfTheWeek);
						aFilters.push(new sap.ui.model.Filter("DueDate",
								sap.ui.model.FilterOperator.LE, endOfTheWeek));
						this.setUiMode(true, false, false,
								"LIST_FILTER_TITLE_THIS_WEEK",
								"LIST_FILTER_BAR_THIS_WEEK");
						this._applyFilters(aFilters, aSorters);
					},

					_applyFilters : function(aFilters, aSorters) {
						cus.crm.mytasks.util.Util.logObjectToConsole(
								"Applying Filtering with Sorting: ", {
									filters : aFilters,
									sorters : aSorters
								});
						if (this._haveFiltersOrSortersChanged(aFilters,
								aSorters)) {
							this.setPartialLoad(true);
							this.resetScrolling();
							var oList = this.getList();
							if (!this.template)
								this.template = oList.getItems()[0].clone();

							var oTemplate = this.template.clone();
							jQuery.sap.log
									.debug("creating new binding for task list");
							oList.bindAggregation("items", {
								path : "/Tasks",
								template : oTemplate,
								sorter : aSorters,
								filters : aFilters,
							});
						} else {
							jQuery.sap.log
									.debug("refreshing existing task list");
							this.rememberScrollPosition();
							this.getList().attachUpdateFinished(
									this.scrollToPositionAfterUpdate, this);
							this.getView().getModel().refresh(true);
						}
					},

					handleAccountNameForDefaultFilter : function() {
						var ret = {
							title : "LIST_PAGE_TITLE_WITH_NUMBER",
							filterBarLabel : undefined,
							aFilterBarLabelParams : undefined,
						};
						if (this.accountID) {
							ret.filterBarLabel = "LIST_FILTER_BAR_ACCOUNT";
							if (this.accountName)
								ret.aFilterBarLabelParams = [ this.accountName ];
							else if (cus.crm.myaccounts
									&& cus.crm.myaccounts.NavigationHelper
									&& cus.crm.myaccounts.NavigationHelper.accountName) {
								this.accountName = cus.crm.myaccounts.NavigationHelper.accountName;
								ret.aFilterBarLabelParams = [ this.accountName ];
								cus.crm.myaccounts.NavigationHelper.accountName = undefined;
							} else
								// default
								ret.aFilterBarLabelParams = [ this.accountID ];
						}
						return ret;
					},

					_haveFiltersOrSortersChanged : function(aFilters, aSorters) {
						if (!aSorters)
							aSorters = [];
						if (!aFilters)
							aFilters = [];
						var bIsChanged;
						if (!this.aLastFilters || !this.aLastSorters) {
							jQuery.sap.log.debug("initial call");
							bIsChanged = true;
						} else
							bIsChanged = this._hasArrayChanged(
									this.aLastFilters, aFilters)
									|| this._hasArrayChanged(this.aLastSorters,
											aSorters);

						this.aLastFilters = aFilters;
						this.aLastSorters = aSorters;
						jQuery.sap.log.debug("filters- or sorters changed: "
								+ bIsChanged);
						return bIsChanged;
					},

					_hasArrayChanged : function(aLA, aA) {
						var bIsChanged = false;
						if (aLA.length != aA.length) {
							bIsChanged = true;
							cus.crm.mytasks.util.Util.logObjectToConsole(
									"Arrays have different size ", [ aLA, aA ]);
						} else
							for ( var ii = 0; ii < aA.length; ii++) {
								var oE = aA[ii], oLE = aLA[ii];
								if (JSON.stringify(oLE) != JSON.stringify(oE)) {
									bIsChanged = true;
									cus.crm.mytasks.util.Util
											.logObjectToConsole(
													"Array Elements are different",
													[ oLE, oE ]);
									break;
								}
							}
						if (!bIsChanged)
							cus.crm.mytasks.util.Util.logObjectToConsole(
									"Arrays aren't different", [ aLA, aA ]);
						return bIsChanged;
					},

					setUiMode : function(navToDetailEnabled,
							quickOrderEntryEnabled, forceDefaultState,
							masterTitle, filterBarLabel, aFilterBarLabelParams) {
						var oList = this.getList(), oView = this.getView(), oFilterBar = oView
								.byId("filterToolBar");
						if (navToDetailEnabled)
							oList.setMode(sap.m.ListMode.MultiSelect);
						else
							oList.setMode(sap.m.ListMode.None);
						oView.byId("taskInput").setVisible(
								quickOrderEntryEnabled);
						oView.byId("showEmptyTask").setVisible(
								quickOrderEntryEnabled);

						if (filterBarLabel) {
							jQuery.sap.log.debug("show filter");
							oFilterBar.setVisible(true);
							var oBundle = cus.crm.mytasks.util.Formatter
									.getResourceBundle();
							oView.byId("filterLabel").setText(
									oBundle.getText(filterBarLabel,
											aFilterBarLabelParams));
						} else {
							jQuery.sap.log.debug("hide filter");
							oFilterBar.setVisible(false);
						}
						if (forceDefaultState)
							oView.byId("filterSelect").setSelectedKey(
									this.getDefaultFilterKey());

						this.oMHFOptions.sI18NMasterTitle = masterTitle;
					},

					removeFilter : function(oEvent) {
						// var key = this.getView().byId("filterSelect")
						// .getSelectedKey();
						// var iIndexOfQ = location.hash.indexOf("?");
						// location.hash = location.hash.substr(0, iIndexOfQ);
						// if (key == this.getDefaultFilterKey()) {
						// remove filter action if we are already in open
						// task view, means to remove account filter as
						// well.
						this.accountID = undefined;
						this.accountName = undefined;
						this.resetScrolling();
						this.applyDefaultFilter();
					},
					// END of FILTER operations on TASKS

					setToEndOfDay : function(oDate) {
						oDate.setHours(23);
						oDate.setMinutes(59);
						return oDate;
					},

					showEmptyTask : function(evt) {
						// Applicable from WAVE 4 onwards
						var oCU = cus.crm.mytasks.util, oCUS = oCU.Schema, oCUT = oCU.TechnicalInfoUtil;
						if (oCUS.getServiceVersion() == 1
								&& oCUS.getServiceSchemaVersion() >= 2) {
							this.oActionSheet = sap.ui.xmlfragment(
									"cus.crm.mytasks.view.ProcessTypeDialog",
									this);
							this.oActionSheet.setModel(this.getView().getModel(
									"i18n"), "i18n");
							var data1 = null, jsonModel = new sap.ui.model.json.JSONModel(), oModel = this
									.getView().getModel(), fnSuccess = function(
									oData, resp) {
								data1 = {
									ProcessTypes : resp.data.results
								};
							}, fnError = function(oError) {
								cus.crm.mytasks.util.Util.onRequestFailed(
										oError,
										"Reading Transaction types failed");
							}, sPath = oCUS.getServiceSchemaVersion() >= 4 ? "TransactionTypes"
									: "TaskTransTypes";
							oModel.read(sPath, null, null, false, jQuery.proxy(
									fnSuccess, this), jQuery.proxy(fnError,
									this));

							if (data1.ProcessTypes.length == 1) {
								this.processType = data1.ProcessTypes[0].ProcessTypeCode;
								this.processTypeDesc = data1.ProcessTypes[0].Description;
								if (oCUS.getServiceSchemaVersion() >= 3)
									oCUT
											.setPrivacyForSelectedTask(data1.ProcessTypes[0].PrivateFlag);
								if (oCUS.getServiceSchemaVersion() >= 4)
									this.processTypePrio = data1.ProcessTypes[0].Priority;
								this.selectProcess();
							} else
								this.oActionSheet.open();

							jsonModel.setData(data1);
							this.oActionSheet.setModel(jsonModel, "json");
							this.oActionSheet._searchField
									.setPlaceholder(sap.ca.scfld.md.app.Application
											.getImpl().getResourceBundle()
											.getText("SEARCH"));
							this.oActionSheet._list
									.setGrowingScrollToLoad(true);
							this.oActionSheet._dialog
									.setVerticalScrolling(true);
						} else {
							if (!this.accountID)
								this.oRouter.navTo("newTask", {
									processType : "noProcType"
								});
							else
								this.oRouter.navTo("newTaskWithAccount", {
									processType : "noProcType",
									accountName : this.accountName
								});
						}
					},

					setPartialLoad : function(loadPartial) {
						var oList = this.getList();
						oList.setGrowing(loadPartial);
					},

					/*
					 * FIORI WAVE 2 - Branch : Rel - 1.0 END of INITAL
					 * DEVELOPMENT for MyTasks
					 */

					/*
					 * FIORI WAVE 4 - Branch : Rel - 1.2 START of ENHANCEMENTS
					 * for MyTasks
					 */

					// EXTENSION METHODS
					/*
					 * @ControllerHook Provision for Additional Filters on
					 * TASKS. Additional filter types can be provided by
					 * customer and Tasks can be filtered on these new types
					 * when the end user selects one of these new types. This is
					 * called when the Facet Filter button on the Footer bar is
					 * selected. The hook must be documented like: @callback
					 * sap.ca.scfld.md.controller.BaseMasterController~extHookHandleCustomFilter
					 * @param {string} sSelectedKey @return {void}
					 */
					// implement in case Ui-extension-Point
					// "extensionFilterOptions" is used
					// extHookHandleCustomFilter : function(sSelectedKey) {
					//						
					// },
					/*
					 * @ControllerHook Provision for getting the default filter
					 * key for TASKS. Additional filter key can be provided by
					 * customer and Tasks can be filtered on this new key when
					 * the end user selects one of these new types. This is
					 * called when the Filter key is changed by the user. The
					 * hook must be documented like: @callback
					 * sap.ca.scfld.md.controller.BaseMasterController~extHookGetDefaultFilterKey
					 * @return {string}
					 */
					// extHookGetDefaultFilterKey : function() {
					// return "";
					// },
					/*
					 * @ControllerHook Provision for applying the default filter
					 * for TASKS. Additional filter on TASKS can be done by the
					 * customer by providing their logic in the Hook
					 * implentation and tasks can be filtered on this filter
					 * type when the end user selects one of these new types.
					 * This is called when the default filter type on TASKS is
					 * selected by the user. The hook must be documented like:
					 * @callback
					 * sap.ca.scfld.md.controller.BaseMasterController~extHookApplyDefaultFilter
					 * @return {void}
					 */
					// extHookApplyDefaultFilter : function() {
					// },
					// Select process before create
					selectProcess : function(oEvent) {
						var oCU = cus.crm.mytasks.util, oCUS = oCU.Schema, oCUT = oCU.TechnicalInfoUtil, oCUU = oCU.Util;
						if (oEvent) {
							var selectedItem = oEvent
									.getParameter("selectedItem");
							if (selectedItem) {
								this.processType = selectedItem
										.data("ProcessTypeCode");
								this.processTypeDesc = selectedItem
										.data("ProcessTypeDescription");
								if (oCUS.getServiceVersion() == 1) {
									if(oCUS.getServiceSchemaVersion() >= 3)
										oCUT.setPrivacyForSelectedTask(selectedItem
												.data("PrivacyAllowed"));
									if (oCUS.getServiceSchemaVersion() >= 4)
										this.processTypePrio = selectedItem.data("Priority");
								}
										
							}
						}
						// Enable footer buttons in Set ListItem
						oCUU.requestBusyDialog();
						this.setPartialLoad(false);
						this.rememberScrollPosition(true);
						var bErrorShown = false;
						if (oCUS.getServiceVersion() == 1
								&& oCUS.getServiceSchemaVersion() == 3)
							bErrorShown = this._getStatusValues(oCU);
						if (!bErrorShown) {
							if (!this.accountID)
								this.oRouter.navTo("newTask", {
									processType : this.processType
								});
							else
								this.oRouter.navTo("newTaskWithAccount", {
									processType : this.processType,
									accountName : this.accountName
								});
							oCUU.releaseBusyDialog();
						}
					},

					// search in process type dialog
					searchProcess : function(oEvent) {
						var sValue = oEvent.getParameter("value"), itemsBinding = oEvent
								.getParameter("itemsBinding"), aFilter = [];
						if (sValue && sValue != "")
							aFilter.push(new sap.ui.model.Filter("Description",
									sap.ui.model.FilterOperator.Contains,
									sValue));
						itemsBinding.aApplicationFilters = [];
						itemsBinding.filter(aFilter,
								sap.ui.model.FilterType.Application);
					},

					/*
					 * FIORI WAVE 4 - Branch : Rel - 1.2 END of ENHANCEMENTS for
					 * MyTasks
					 */
					/*
					 * FIORI WAVE 5 - Branch : Rel - 1.3 END of ENHANCEMENTS for
					 * MyTasks
					 */
					/*
					 * FIORI WAVE 5 - Branch : Rel - 1.3 END of ENHANCEMENTS for
					 * MyTasks
					 */
					/*
					 * FIORI WAVE 6 - Branch : Rel - 1.4 END of ENHANCEMENTS for
					 * MyTasks
					 */
					_getStatusValues : function(oCU) {
						var oCUSL = oCU.StatusListUtil, oCUS = oCU.Schema, oCUU = oCU.Util, bReturn = false;
						if (oCUS.getServiceVersion() == 1
								&& oCUS.getServiceSchemaVersion() >= 3) {
							oCUSL.getStatusValues(this, {
								procType : this.processType,
								bIsNew : true
							});
							if (this.oStatusDDLB.bNotRetrieved) {
								oCUU
										.onRequestFailed(
												this.oStatusDDLB.errorObj,
												"Operation failed: Read status customizing.");
								this.oStatusDDLB.errorObj = null;
								this.oStatusDDLB.bNotRetrieved = false;
								bReturn = true;
							}
						}
						return bReturn;
					},

					_getTechAndPrioListInfo : function(oModel) {
						var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCUS = oCU.Schema;
						oCUU.requestBusyDialog();
						var fnSuccess = function(oData, oResponse,
								aErrorResponses) {
							var oCU = cus.crm.mytasks.util;
							if (aErrorResponses && aErrorResponses.length > 0)
								oCU.Util
										.onRequestFailed(aErrorResponses[0],
												"Operation failed: Priority list and Technical Information");
							else {
								for ( var i = -1, oCurrentData; oCurrentData = oData.__batchResponses[++i];)
									switch (i) {
									case 0:
										if (oCU.Schema.getServiceVersion() == 1
												&& oCU.Schema
														.getServiceSchemaVersion() >= 4)
											oCU.TechnicalInfoUtil
													.parseTechInfoOData({
														retrieveTaskTech : jQuery
																.extend(
																		{},
																		oCurrentData.data.results[0],
																		true)
													});
										else
											oCU.TechnicalInfoUtil
													.parseTechInfoOData(oCurrentData.data);
										break;
									case 1:
										oCU.PriorityListUtil
												.parsePrioListOData(oCurrentData.data);
										break;
									case 2:
										oCU.StatusListUtil
												.setStatusValuesAgainstTransactionType(jQuery
														.extend(
																[],
																oCurrentData.data.results,
																true));
										break;
									default:
										break;
									}
								oCU.Util.releaseBusyDialog();
							}
						}, fnError = function(oError) {
							cus.crm.mytasks.util.Util
									.onRequestFailed(oError,
											"Operation failed: Priority list and Technical Information");
						}, aPrerequisites = oCUS.getServiceVersion() == 1
								&& oCUS.getServiceSchemaVersion() >= 4 ? [
								"TechnicalDetails", "UserPriorities",
								"UserStatuses" ] : [ "retrieveTaskTech",
								"retrieveTaskPrioCustomizing" ];
						oCUU.getAllPrerequisites(oModel, aPrerequisites, {
							success : fnSuccess,
							error : fnError,
							async : false
						});
						oCUU.bindCustomizingModel(this.getView());
					}
				/*
				 * FIORI WAVE 6 - Branch : Rel - 1.4 END of ENHANCEMENTS for
				 * MyTasks
				 */
				/*
				 * FIORI WAVE 7 - Branch : Rel - 1.5 END of ENHANCEMENTS for
				 * MyTasks
				 */
				/*
				 * FIORI WAVE 7 - Branch : Rel - 1.5 END of ENHANCEMENTS for
				 * MyTasks
				 */
				});
},
	"cus/crm/mytasks/view/S2.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core" xmlns="sap.m"\n\txmlns:layout="sap.ui.layout" controllerName="cus.crm.mytasks.view.S2">\n\t<Page id="page" class="CRMMyTasksList" enableScrolling="false">\n\t\t<content>\n\t\t\t<ScrollContainer id="scroll" vertical="true"\n\t\t\t\thorizontal="false">\n\t\t\t\t<content>\n\t\t\t\t\t<List id="list" noDataText="{i18n>SEARCH_LIST_NODATA_GENERIC}"\n\t\t\t\t\t\tgrowing="true" growingScrollToLoad="true" mode="MultiSelect"\n\t\t\t\t\t\tselect="markTaskCompleted" growingThreshold="20">\n\t\t\t\t\t\t<infoToolbar>\n\t\t\t\t\t\t\t<Toolbar id="filterToolBar" visible="false">\n\t\t\t\t\t\t\t\t<content>\n\t\t\t\t\t\t\t\t\t<Label id="filterLabel" text="" />\n\t\t\t\t\t\t\t\t\t<ToolbarSpacer />\n\t\t\t\t\t\t\t\t\t<core:Icon src="sap-icon://decline" press="removeFilter" />\n\t\t\t\t\t\t\t\t</content>\n\t\t\t\t\t\t\t</Toolbar>\n\t\t\t\t\t\t</infoToolbar>\n\t\t\t\t\t\t<!-- Assign additional properties to a task object -->\n\t\t\t\t\t\t<core:ExtensionPoint name="extListItem">\n\t\t\t\t\t\t\t<ObjectListItem id="task"\n\t\t\t\t\t\t\t\ttype="{path: \'Completed\', formatter: \'cus.crm.mytasks.util.Formatter.listType\'}"\n\t\t\t\t\t\t\t\tselected="{Completed}" number=" " numberUnit="{UserStatustext}"\n\t\t\t\t\t\t\t\ttitle="{parts:[\'Description\', \'Completed\'], formatter: \'cus.crm.mytasks.util.Formatter.showTitleInMainList\'}"\n\t\t\t\t\t\t\t\tpress="handleListItemPress">\n\t\t\t\t\t\t\t\t<firstStatus>\n\t\t\t\t\t\t\t\t\t<ObjectStatus\n\t\t\t\t\t\t\t\t\t\tstate="{parts:[\'Priority\', \'Completed\'], formatter: \'cus.crm.mytasks.util.Formatter.showPriorityStatus\'}"\n\t\t\t\t\t\t\t\t\t\ticon="{parts:[\'Priority\', \'Completed\'], formatter: \'cus.crm.mytasks.util.Formatter.getPriorityIcon\'}" />\n\t\t\t\t\t\t\t\t</firstStatus>\n\t\t\t\t\t\t\t\t<secondStatus>\n\t\t\t\t\t\t\t\t\t<ObjectStatus\n\t\t\t\t\t\t\t\t\t\tstate="{parts:[\'DueDate\', \'Completed\'], formatter: \'cus.crm.mytasks.util.Formatter.showDueDateStatus\'}"\n\t\t\t\t\t\t\t\t\t\ttext="{parts:[\'DueDate\', \'Completed\'], formatter: \'cus.crm.mytasks.util.Formatter.showDueDateInDays\'}" />\n\t\t\t\t\t\t\t\t</secondStatus>\n\t\t\t\t\t\t\t\t<attributes>\n\t\t\t\t\t\t\t\t\t<ObjectAttribute text="{Note}" />\n\t\t\t\t\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\t\t\t\t\ttext="{parts:[\'AccountName\', \'AccountId\'], formatter: \'cus.crm.mytasks.util.Formatter.formatBusinessPartner\'}" />\n\t\t\t\t\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\t\t\t\t\ttext="{parts:[\'ContactName\', \'ContactId\'], formatter: \'cus.crm.mytasks.util.Formatter.formatBusinessPartner\'}" />\n\t\t\t\t\t\t\t\t</attributes>\n\t\t\t\t\t\t\t</ObjectListItem>\n\t\t\t\t\t\t</core:ExtensionPoint>\n\t\t\t\t\t</List>\n\t\t\t\t</content>\n\t\t\t</ScrollContainer>\n\t\t\t<Input id="taskInput" change="quickCreateTask"\n\t\t\t\tplaceholder="{i18n>NEW_TASK_INPUT_PLACEHOLDER}" class="stayAtTheBottom" />\n\t\t\t<!-- </items> </FlexBox> -->\n\t\t</content>\n\t\t<Bar id="dummyFooter">\n\t\t\t<contentLeft>\n\t\t\t\t<Select id="filterSelect" change="handleFilter" icon="sap-icon://filter"\n\t\t\t\t\ttype="IconOnly" autoAdjustWidth="true">\n\t\t\t\t\t<!-- Add additional filters to the task list -->\n\t\t\t\t\t<core:ExtensionPoint name="extFilterOptions">\n\t\t\t\t\t\t<core:Item key="open" text="{i18n>LIST_FILTER_ALL_OPEN}" />\n\t\t\t\t\t\t<core:Item key="dueToday" text="{i18n>LIST_FILTER_DUE_TODAY}" />\n\t\t\t\t\t\t<core:Item key="dueThisWeek" text="{i18n>LIST_FILTER_DUE_THIS_WEEK}" />\n\t\t\t\t\t\t<core:Item key="completed" text="{i18n>LIST_FILTER_COMPLETED}" />\n\t\t\t\t\t</core:ExtensionPoint>\n\t\t\t\t</Select>\n\t\t\t</contentLeft>\n\t\t\t<contentRight>\n\t\t\t\t<!-- Add additional buttons to the right of the footer -->\n\t\t\t\t<core:ExtensionPoint name="extS2Buttons">\n\t\t\t\t\t<Button id="showEmptyTask" press="showEmptyTask" icon="sap-icon://add"\n\t\t\t\t\t\ttype="Emphasized">\n\t\t\t\t\t</Button>\n\t\t\t\t</core:ExtensionPoint>\n\t\t\t</contentRight>\n\t\t</Bar>\n\t</Page>\n</core:View>',
	"cus/crm/mytasks/view/S3.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
// To circumvent check of scaffolding API from UI5 1.24 onwards
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");

sap.ca.scfld.md.controller.BaseFullscreenController
		.extend(
				"cus.crm.mytasks.view.S3",
				{
					enterDueDatePressed : false,
					createdfromNotes : false,
					createdfromAccounts : false,
					bIsBookmarkUsed : false,
					bIsFollowupFromTasks : false,
					bIsFollowupFromOthers : false,
					oStatusDDLB : {
						bNotRetrieved : false,
						errorObj : null,
					},

					// Controller Methods - onInit
					onInit : function() {
						// execute the onInit for the base class
						// BaseFullScreenController
						jQuery.sap.log.debug("begin on init s3");
						sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit
								.call(this);

						this._getApplicationModel().setProperty(
								"/s3Controller", this);
						var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCUC = oCU.ContactF4, oView = this
								.getView(), oCUE = oCU.EmployeeF4, oCUA = oCU.AccountF4, oStartupParams = undefined, oModel = oView
								.getModel();
						if (!oCU.Schema.getServiceVersion())
							oCU.Schema.initServiceSchemaVersion(oModel, "Task");

						this.oSavedTask = this.oNewTask = undefined;
						// Get accountID query parameter
						oCUA.create(this);
						oCUC.create(this);
						oCUE.create(this);
						var myComponent = sap.ui
								.component(sap.ui.core.Component
										.getOwnerIdFor(this.getView()));
						if (myComponent && myComponent.getComponentData())
							oStartupParams = myComponent.getComponentData().startupParameters;
						this.oRouter.attachRouteMatched(jQuery.proxy(
								this.handleNavigationWithTasks, this,
								oStartupParams));
						oCUU.logObjectToConsole("S3 View Model after init: ",
								oModel);
						var oEventDelegate = {
							onsapenter : this._onEnterPressed
						};
						// oView.byId("accountInput").addEventDelegate(
						// oEventDelegate, this);
						// oView.byId("contactInput").addEventDelegate(
						// oEventDelegate, this);
						oView.byId("dueDateInput").addEventDelegate(
								oEventDelegate, this);
						if (sap.ui.Device.system.phone)
							oView.byId("TxtTypeInput").removeStyleClass(
									"TaskTypePad").addStyleClass(
									"TaskTypePadMobile");
						jQuery.sap.log.debug("end on init s3");
					},

					// Controller Methods - onBeforeRendering
					onBeforeRendering : function() {
						jQuery.sap.log.debug("on before render s3");
						// TO get the Button List of SCAFFOLDING: If component
						// extended && over-ridden Master Header Footer, this
						// may break
						// this._oControlStore.oButtonListHelper.aButtons[1].oButton
						// .setType(sap.m.ButtonType.Reject);
					},

					// Controller Methods - onAfterRendering
					onAfterRendering : function(e) {
						jQuery.sap.log.debug("on after render s3");
						if (this.oStatusDDLB.bNotRetrieved) {
							cus.crm.mytasks.util.Util
									.onRequestFailed(this.oStatusDDLB.errorObj,
											"Operation failed: Read status customizing.");
							this.oStatusDDLB.errorObj = null;
							this.oStatusDDLB.bNotRetrieved = false;
						}
						// if (this.oSavedTask && this.oSavedTask.Completed)
						// this.oRouter.navTo("taskList");
					},

					// Controller Methods - onExit
					onExit : function() {
						var oCU = cus.crm.mytasks.util, aArrayVH = [
								oCU.AccountF4.getValueHelp(),
								oCU.ContactF4.getValueHelp(),
								oCU.EmployeeF4.getValueHelp() ];
						for ( var i = -1, oCurValueHelp; oCurValueHelp = aArrayVH[++i];)
							for ( var j in oCurValueHelp.mEventRegistry)
								delete oCurValueHelp.mEventRegistry[j];
					},

					/*
					 * FIORI WAVE 2 - Branch : Rel - 1.0 START of INITAL
					 * DEVELOPMENT for MyTasks
					 */
					handleNavigationWithTasks : function(oStartupParams, oEvent) {
						this.onBeforeRendering();
						jQuery.sap.log.debug("on route matched s3");
						var oCU = cus.crm.mytasks.util, oCUS = oCU.Schema, oCUU = oCU.Util, oView = this
								.getView(), oBundle = oCU.Formatter
								.getResourceBundle(), sRouteName = oEvent
								.getParameter("name"), oArgs = oEvent
								.getParameter("arguments"), oPrivateFlag = undefined;
						var note = undefined, oContext = undefined, accountId = undefined, accountName = undefined, oTaskParams = undefined;
						var aPrerequisitePaths = this
								._checkIfPrerequisitesExist();
						switch (sRouteName) {
						case "taskDetail":
							jQuery.sap.log
									.debug("S3 page called with task object");
							oContext = new sap.ui.model.Context(oView
									.getModel(), '/' + oArgs.contextPath);
							oView.setBindingContext(oContext);
							// Make sure the master is here
							this.oSavedTask = oContext.getObject();
							if (!this.oSavedTask) {
								jQuery.sap.log
										.debug("S3 page called via bookmark");
								this._getTaskHeaderInfo();
								// oView.getModel().read(oContext.getPath(),
								// null, null, false, fnSuccess, fnError);
								this.bIsBookmarkUsed = true;
								this.prepareNewTask(this.oSavedTask);
							}
							if (this.oSavedTask.Completed) {
								var sMsg = [ "'", "'" ]
										.join(this.oSavedTask.Description), messageToShow = oBundle
										.getText("LIST_COMPLETE_CONFIRMATION",
												[ sMsg ]);
								sap.m.MessageToast.show(messageToShow, {
									closeOnBrowserNavigation : false
								});
							}
							this.initializeDetailsPage(this.oSavedTask);
							oPrivateFlag = {
								curType : typeof this.oSavedTask.PrivateAllowed,
								curValue : this.oSavedTask.PrivateAllowed
							};
							this._setPrivacyForTask(oPrivateFlag, oCUS,
									oCU.TechnicalInfoUtil);
							if (oCUS.getServiceVersion() == 1
									&& oCUS.getServiceSchemaVersion() >= 4)
								oCU.Attachments.EditPage.bindData(this);
							// if (this.oSavedTask) {
							// this.initializeDetailsPage(this.oSavedTask);
							// jQuery.sap.log.debug("S3 page called with task
							// object");
							// } else {
							// jQuery.sap.log.debug("S3 page called via
							// bookmark");
							// this.navBack = true;
							// }
							break;
						case "newTask":
						case "newTaskFromNote":
						case "newTaskWithAccount":
							jQuery.sap.log
									.debug("S3 page called with empty object");
							oContext = new sap.ui.model.Context(oView
									.getModel(), '/new');
							oView.setBindingContext(oContext);
							// WAVE 7 ENHANCEMENT
							this._checkIfFollowupFromTasks();
							if (this.oParamsToPass) {
								// FOLLOWUP of TASK from TASKS app
								this.bIsFollowupFromTasks = true;
								oTaskParams = {
									accountID : this.oParamsToPass.AccountID,
									accountName : this.oParamsToPass.AccountName,
									contactID : this.oParamsToPass.ContactID,
									contactName : this.oParamsToPass.ContactName,
									desc : this.oParamsToPass.title,
									note : this.oParamsToPass.Note,
									// ID not needed, GUID more than enough
									predecessorID : this.oParamsToPass.taskId,
									predecessorGUID : this.oParamsToPass.taskGuid,
									priority : this.oParamsToPass.priority,
									procType : oArgs.processType,
									ProcessTypeDescription : this.oParamsToPass.ProcessTypeDescription
								};
								oPrivateFlag = {
									curType : typeof this.oParamsToPass.privateFlag,
									curValue : this.oParamsToPass.privateFlag
								};
								this._setPrivacyForTask(oPrivateFlag, oCUS,
										oCU.TechnicalInfoUtil);
							} else if (oStartupParams) {
								if (oStartupParams.createFromOppt
										&& oStartupParams.createFromOppt[0]) {
									// Create from Opportunity
									// this.createdfromOppt = true;
									this.bIsFollowupFromOthers = true;
									oTaskParams = {
										accountID : oStartupParams.AccountId
												&& oStartupParams.AccountId[0],
										// accountName :
										// oStartupParams.AccountName
										// && oStartupParams.AccountName[0],
										contactID : oStartupParams.ContactId
												&& oStartupParams.ContactId[0],
										// contactName :
										// oStartupParams.ContactName
										// && oStartupParams.ContactName[0],
										desc : oStartupParams.title
												&& oStartupParams.title[0],
										procType : oArgs.processType
									};
									this._getPrerequisiteInfoForNewTask(
											aPrerequisitePaths, oTaskParams);
									if (oCUS.getServiceVersion() == 1
											&& oCUS.getServiceSchemaVersion() >= 2) {
										if (oCUS.getServiceSchemaVersion() >= 3) {
											oTaskParams.predecessorGUID = oStartupParams.opportunityGuid
													&& oStartupParams.opportunityGuid[0];
											oPrivateFlag = {
												curType : typeof oTaskParams.privateFlag,
												curValue : oTaskParams.privateFlag
											};
											this._setPrivacyForTask(
													oPrivateFlag, oCUS,
													oCU.TechnicalInfoUtil);
										} else
											oTaskParams.predecessorID = oStartupParams.opportunityId
													&& oStartupParams.opportunityId[0];
									}
								} else if (oStartupParams.itemPaths
										&& cus.crm.notes
										&& cus.crm.notes.handler) {
									// Create from Notes
									this.createdfromNotes = true;
									oTaskParams = {
										accountID : accountId,
										accountName : accountName,
										note : (new cus.crm.notes.handler.ModelHandler())
												.getSectionsText(oStartupParams.itemPaths),
										procType : oArgs.processType
									};
									this._getPrerequisiteInfoForNewTask(
											aPrerequisitePaths, oTaskParams);
									if (oCUS.getServiceVersion() == 1
											&& oCUS.getServiceSchemaVersion() >= 3) {
										oPrivateFlag = {
											curType : typeof oTaskParams.privateFlag,
											curValue : oTaskParams.privateFlag
										};
										this._setPrivacyForTask(oPrivateFlag,
												oCUS, oCU.TechnicalInfoUtil);
									}
								} else if (oStartupParams.createFromAppt
										&& oStartupParams.createFromAppt[0]) {
									// Create from Appointment
									// this.createdFromAppt = true;
									this.bIsFollowupFromOthers = true;
									oTaskParams = {
										accountID : oStartupParams.AccountId
												&& oStartupParams.AccountId[0],
										// accountName :
										// oStartupParams.AccountName
										// && oStartupParams.AccountName[0],
										contactID : oStartupParams.ContactId
												&& oStartupParams.ContactId[0],
										// contactName :
										// oStartupParams.ContactName
										// && oStartupParams.ContactName[0],
										desc : oStartupParams.title
												&& oStartupParams.title[0],
										procType : oArgs.processType,
										predecessorGUID : oStartupParams.appointmentGuid
												&& oStartupParams.appointmentGuid[0],
									};
									this._getPrerequisiteInfoForNewTask(
											aPrerequisitePaths, oTaskParams);
									oPrivateFlag = {
										curType : typeof oTaskParams.privateFlag,
										curValue : oTaskParams.privateFlag
									};
									this._setPrivacyForTask(oPrivateFlag, oCUS,
											oCU.TechnicalInfoUtil);
								} else if (oStartupParams.createFromAccount
										&& oStartupParams.createFromAccount[0]) {
									this.createdfromAccounts = true;
									oTaskParams = {
										accountID : oStartupParams.accountID
												&& oStartupParams.accountID[0],
										// accountName :
										// oStartupParams.AccountName
										// && oStartupParams.AccountName[0],
										procType : oArgs.processType,
									};
									this._getPrerequisiteInfoForNewTask(
											aPrerequisitePaths, oTaskParams);
									oPrivateFlag = {
										curType : typeof oTaskParams.privateFlag,
										curValue : oTaskParams.privateFlag
									};
									this._setPrivacyForTask(oPrivateFlag, oCUS,
											oCU.TechnicalInfoUtil);
								} else if (oStartupParams.fromAccount
										&& oStartupParams.fromAccount[0]) {
									// FOLLOWUP of TASK from TASKS app with
									// param fromAccount
									this.bIsFollowupFromTasks = true;
									oTaskParams = this.oParamsToPass ? {
										accountID : this.oParamsToPass.AccountID,
										accountName : this.oParamsToPass.AccountName,
										contactID : this.oParamsToPass.ContactID,
										contactName : this.oParamsToPass.ContactName,
										desc : this.oParamsToPass.title,
										note : this.oParamsToPass.Note,
										// ID not needed, GUID sufficient
										predecessorID : this.oParamsToPass.taskId,
										predecessorGUID : this.oParamsToPass.taskGuid,
										priority : this.oParamsToPass.priority,
										procType : oArgs.processType,
										ProcessTypeDescription : this.oParamsToPass.ProcessTypeDescription
									}
											: {
												accountID : accountId,
												accountName : accountName,
												procType : oArgs.processType,
												ProcessTypeDescription : processTypeDescr,
												note : note
											};
									this._getPrerequisiteInfoForNewTask(
											aPrerequisitePaths, oTaskParams);
									oPrivateFlag = this.oParamsToPass ? {
										curType : typeof this.oParamsToPass.privateFlag,
										curValue : this.oParamsToPass.privateFlag
									}
											: {
												curType : typeof oTaskParams.privateFlag,
												curValue : oTaskParams.privateFlag
											};
									this._setPrivacyForTask(oPrivateFlag, oCUS,
											oCU.TechnicalInfoUtil);
								} else {
									// Create from Account
									oTaskParams = {
										accountID : oStartupParams.accountID
												&& oStartupParams.accountID[0],
										accountName : oArgs.accountName,
										procType : oArgs.processType,
										note : note
									};
								}
							} else {
								// NEW TASK from TASKS app
								var s2Controller = this._getApplicationModel()
										.getProperty("/s2Controller"), processTypeDescr = s2Controller
										&& s2Controller.processTypeDesc, processTypePrio = s2Controller
										&& s2Controller.processTypePrio;
								oTaskParams = {
									accountID : accountId,
									accountName : accountName,
									procType : oArgs.processType,
									ProcessTypeDescription : processTypeDescr,
									priority : processTypePrio,
									note : note
								};
								this._getPrerequisiteInfoForNewTask(
										aPrerequisitePaths, oTaskParams);
							}
							this.oNewTask = oCUU.createEmptyTaskObject(oCUS,
									oTaskParams);
							this.prepareNewTask(this.oNewTask);
							this.initializeDetailsPage(this.oNewTask);
							break;
						}
						oCUU.releaseBusyDialog();
					},

					_onEnterPressed : function(oEvent) {
						var oView = this.getView();
						if (oEvent.srcControl == oView.byId("accountInput"))
							this._onEnterPressedForAccount();
						else if (oEvent.srcControl == oView
								.byId("contactInput"))
							this._onEnterPressedForContact();
						else if (oEvent.srcControl == oView
								.byId("dueDateInput"))
							this._onEnterPressedForDueDate();
						else
							this._onEnterPressedForEmployee();
					},

					_setFullScreenTitle : function(oTask) {
						var title = cus.crm.mytasks.util.Formatter
								.showTaskTitle(oTask.Description, oTask.Id);
						this._oControlStore.oTitle.setText(title);
					},

					// TODO: Not yet covered!!
					onLifeChange : function(e) {
						var textarea = jQuery(e.getSource().$()).children(
								"textarea")[0];
						this.autoResize(textarea);
					},

					autoResize : function(textarea) {
						textarea.style.overflow = "auto";
						textarea.style.height = "100%";
						textarea.style.height = textarea.scrollHeight + 'px';
						textarea.style.overflow = "hidden";
					},
					// TODO: Not yet covered!!

					// START of operations on a TASK
					initializeDetailsPage : function(oTask) {
						var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oView = this
								.getView(), oCUA = oCU.AccountF4, oCUC = oCU.ContactF4;
						oCUU.logObjectToConsole("task: ", oTask);
						this._initHFOptions(oView.getBindingContext());
						this._setFullScreenTitle(oTask);
						oCUA.setId(oTask.AccountId).setName(
								oTask.AccountName ? oTask.AccountName
										: oTask.AccountId);
						oCUC.setId(oTask.ContactId).setName(
								oTask.ContactName ? oTask.ContactName
										: oTask.ContactId);
						if (this._getApplicationModel().getProperty(
								"/s4Controller")) {
							oView.byId("accountInput").setValue(oCUA.getName());
							oView.byId("contactInput").setValue(oCUC.getName());
						}
						// oCUE.setId(oTask.ResponsibleId).setName(oTask.ResponsibleName);
						// By default, style is medium, changing to long;
						var oDIF = oView.byId("dueDateInput");
						if (!oDIF._dateType)
							oDIF._dateType = new sap.ca.ui.model.type.Date({
								style : "long",
								UTC : false
							});
						// oDIF.fireChange(oTask.DueDate);
						// WAVE 6 ENHANCEMENT
						this.setBtnEnabled("assignTask", !oView.byId(
								"privateSwitch").getState());
						this._showOrHideStatusField([ "statSelect",
								"laStatSelect", "hboxStatus", ], oTask);
						this._showOrHideTransactionType([ "laTypeInput",
								"TxtTypeInput", "TxtTypeHBox" ]);
						// WAVE 7 ENHANCEMENT
						oCU.Attachments.EditPage.showOrHidePanel(oView);
					},

					_checkIfNewTask : function(oTask) {
						var idIsEmpty = (oTask.Id === "");
						cus.crm.mytasks.util.Util.logObjectToConsole(
								"task idIsEmpty=" + idIsEmpty + "; ", oTask);
						return idIsEmpty;
					},

					getTask : function() {
						var oCU = cus.crm.mytasks.util, oCUF = oCU.Formatter, oCUU = oCU.Util, oView = this
								.getView(), oCUS = oCU.Schema, oContext = oView
								.getBindingContext(), dSavedDate = undefined, oTask = null;
						if (oContext == "/new")
							oTask = jQuery.extend(this.oNewTask, {});
						else
							oTask = jQuery.extend(oContext.getObject(), {});
						oCUU.logObjectToConsole("oTask: ", oTask);
						dSavedDate = oTask.DueDate;

						oTask.Description = oView.byId("descInput").getValue();
						oTask.DueDate = oView.byId("dueDateInput").getValue();
						oTask.Priority = oView.byId("prioSelect")
								.getSelectedKey();
						oTask.Private = oView.byId("privateSwitch").getState();
						oTask.Note = oView.byId("noteTa").getValue();
						var oAccInfo = this.getCurrentAccount(), oConInfo = this
								.getCurrentContact();
						oTask.AccountId = oAccInfo.AccountId;
						oTask.AccountName = oAccInfo.AccountName;
						oTask.ContactId = oConInfo.ContactId;
						oTask.ContactName = oConInfo.ContactName;
						if (oCUS.getServiceVersion() == 1) {
							if (oCUS.getServiceSchemaVersion() >= 3)
								oTask.UserStatusCode = oView.byId("statSelect")
										.getSelectedKey();
							if (oCUS.getServiceSchemaVersion() >= 4
									&& oContext.getPath() !== "/new") {
								var aNavLinks = [ oCU.Attachments.NAVLINK,
										oCU.DocumentHistory.NAVLINK,
										"TaskLogSet", "TaskStatuses" ];
								for ( var i = 0, j = aNavLinks.length; i < j; i++)
									oTask[aNavLinks[i]] = oCUU
											.getDeferredObject(oContext
													.getPath().substr(1),
													aNavLinks[i]);
							}
						}

						// Needed because we use getValue() and not
						// getDateValue()
						if (typeof oTask.DueDate === "string"
								&& oTask.DueDate !== "") {
							var oTempDate = oCUF.parseLongDate(oTask.DueDate);
							oTask.DueDate = oTempDate ? oTempDate : dSavedDate;
						}

						if (oCUF.getDiffInDays(dSavedDate, oTask.DueDate) == 0)
							oTask.DueDate = dSavedDate;
						else if (oTask.DueDate === "")
							oTask.DueDate = null;

						/**
						 * @ControllerHook Provision for getting the additional
						 *                 fields to add to the Task object.
						 *                 Additional fields added to the Task
						 *                 Entity Type are got by this Hook
						 *                 method. This is called when the Task
						 *                 object is needed. The hook must be
						 *                 documented like:
						 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookGetCustomFields
						 * @param {object}
						 *            oTask
						 * @return {void}
						 */
						if (this.extHookGetCustomFields)
							this.extHookGetCustomFields(oTask);
						return oTask;
					},

					saveTask : function(oEvent) {
						var oSaveButton = oEvent.getSource(), oTaskToSave = this
								.getTask(), fnSuccess = function(oCO, oData,
								oResponse, aErrorResponses) {
							var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oRB = oCU.Formatter
									.getResourceBundle();
							oCO.curBtn.setEnabled(true);
							if (aErrorResponses && aErrorResponses.length > 0)
								this._checkFor412StatusCode(aErrorResponses[0],
										"Operation failed: Update Task");
							else {
								oCUU.logObjectToConsole(
										"Operation successful: Update Task",
										oCO.curTask);
								var sKey = oCO.isFollowupActivity ? "FOLLOWUP_TASK_SAVED"
										: "CURRENT_TASK_SAVED";
								var bINT = this._checkIfNewTask(oCO.curTask), oCurrentTask = !bINT ? oCO.curTask
										: oData.__batchResponses[0].__changeResponses[0].data;
								sap.m.MessageToast.show(oRB.getText(sKey), {
									closeOnBrowserNavigation : false
								});
								this._showOverviewOrGoBack(this.getView(), {
									bINT : bINT,
									curTask : oCurrentTask,
									scenario : "CLICKEDSAVE"
								});
								oCUU.releaseBusyDialog();
							}
						}, fnError = function(oBtn, oError) {
							cus.crm.mytasks.util.Util.onRequestFailed(oError,
									"Operation failed: Update Task");
							oBtn.setEnabled(true);
						}, oCurObject = {
							curTask : oTaskToSave,
							curBtn : oSaveButton,
							isFollowupActivity : this.bIsFollowupFromOthers
									|| this.bIsFollowupFromTasks ? true : false
						}, oUpdateParams = {
							success : fnSuccess,
							error : fnError,
							async : true
						};
						this._commonWayToSaveTask(oCurObject, oUpdateParams);
					},

					checkUIValues : function(oTask) {
						var oReturn = {}, oCUF = cus.crm.mytasks.util.Formatter;
						oReturn.hasErrors = false;
						oReturn.messages = new Array();

						var sDateFromUI = this.getView().byId("dueDateInput")
								.getValue(), oDateFromUI = oCUF
								.parseLongDate(sDateFromUI);
						if (!oDateFromUI && sDateFromUI !== "") {
							var messageDate = oCUF.getResourceBundle().getText(
									"DETAILS_MESSAGETEXT_DATE");
							oReturn.messages.push(messageDate);
							oReturn.hasErrors = true;
						}

						var currentAccount = this.getCurrentAccount().AccountName, accountOnUI = this
								.getView().byId("accountInput").getValue();
						if (currentAccount != accountOnUI) {
							var messageAccount = oCUF.getResourceBundle()
									.getText("DETAILS_MESSAGETEXT_ACCOUNT");
							oReturn.messages.push(messageAccount);
							oReturn.hasErrors = true;
						}

						var currentContact = this.getCurrentContact().ContactName, contactOnUI = this
								.getView().byId("contactInput").getValue();
						if (currentContact != contactOnUI) {
							var messageContact = oCUF.getResourceBundle()
									.getText("DETAILS_MESSAGETEXT_CONTACT");
							oReturn.messages.push(messageContact);
							oReturn.hasErrors = true;
						}

						/**
						 * @ControllerHook Provision for checking the values of
						 *                 the additional fields of the Task
						 *                 object. Formatting of the various
						 *                 fields added by the customer can be
						 *                 done here. This is called when
						 *                 checking the UI values of the Task
						 *                 object.
						 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookCheckUIValues
						 * @param {object}
						 *            oReturn
						 * @return {void}
						 */
						if (this.extHookCheckUIValues)
							this.extHookCheckUIValues(oReturn);
						return oReturn;
					},

					cancelTask : function(evt) {
						var oCUU = cus.crm.mytasks.util.Util, oView = this
								.getView();
						oCUU.requestBusyDialog();
						if (this.oSavedTask) {
							oView.byId("descInput").setValue(
									this.oSavedTask.Description);
							this.setFormattedDueDate(this.oSavedTask.DueDate);
							oView.byId("prioSelect").setSelectedKey(
									this.oSavedTask.Priority);
							oView.byId("privateSwitch").setState(
									this.oSavedTask.Private);
							oView.byId("accountInput").setValue(
									this.oSavedTask.AccountName);
							oView.byId("contactInput").setValue(
									this.oSavedTask.ContactName);
							oView.byId("noteTa").setValue(this.oSavedTask.Note);

							/**
							 * @ControllerHook Provision for negating the
							 *                 changes made to the additional
							 *                 fields of the Task object. Revert
							 *                 to the previous values in the
							 *                 custom fields when the Task is
							 *                 not meant to be saved. This is
							 *                 called when canceling changes
							 *                 made to an existing task.
							 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookCancelCustomFields
							 * @param {object}
							 *            oCancelTask
							 * @return {void}
							 */
							if (this.extHookCancelCustomFields)
								this.extHookCancelCustomFields(this.oSavedTask);
						}

						oCUU.logObjectToConsole("old task: ", this.oSavedTask);
						// WAVE 7 ENHANCEMENT
						this._showOverviewOrGoBack(oView, {
							bINT : this.oSavedTask ? false : true,
							curTask : this.oSavedTask || this.oNewTask,
							scenario : "CLICKEDCANCEL"
						});
						this.oSavedTask = this.oNewTask = undefined;
						oCUU.releaseBusyDialog();
					},

					prepareNewTask : function(oNewTask) {
						var oView = this.getView(), oCUS = cus.crm.mytasks.util.Schema;
						oView.byId("descInput").setValue(oNewTask.Description);
						this.setFormattedDueDate(oNewTask.DueDate);
						oView.byId("prioSelect").setSelectedKey(
								oNewTask.Priority);
						oView.byId("privateSwitch").setState(oNewTask.Private);
						oView.byId("accountInput").setValue(
								oNewTask.AccountName ? oNewTask.AccountName
										: oNewTask.AccountId);
						oView.byId("contactInput").setValue(
								oNewTask.ContactName ? oNewTask.ContactName
										: oNewTask.ContactId);
						oView.byId("noteTa").setValue(oNewTask.Note);
						if (oCUS.getServiceVersion() == 1
								&& oCUS.getServiceSchemaVersion() >= 3) {
							oView.byId("statSelect").setSelectedKey(
									oNewTask.UserStatusCode);
							oView.byId("TxtTypeInput").setText(
									oNewTask.ProcessTypeDescription);
						}

						/**
						 * @ControllerHook Provision for managing the additional
						 *                 fields to add to the Task object.
						 *                 Filter types can be provided by the
						 *                 customer and tasks can be filtered by
						 *                 these new types when the end user
						 *                 selects one of these new types. This
						 *                 is called when the Facet Filter
						 *                 button on the Footer bar is selected.
						 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookPrepareCustomFields
						 * @param {object}
						 *            oNewTask
						 * @return {void}
						 */
						if (this.extHookPrepareCustomFields)
							this.extHookPrepareCustomFields(oNewTask);
					},
					// END of operations on a TASK

					// START of methods modifying CONTACT details
					_onEnterPressedForContact : function() {
						var input = this.getView().byId("contactInput");
						this.onF4Contact({
							getSource : function() {
								return input;
							}
						});
					},

					onF4Contact : function(oEvent) {
						// To manage both Actual event & sapenter event
						var oInput = oEvent.getSource(), oAccInfo = this
								.getCurrentAccount(), oCUC = cus.crm.mytasks.util.ContactF4;
						oCUC.getValueHelp().open(oInput.getValue());
						oCUC.triggerSearch({
							accountid : oAccInfo.AccountId,
							accounttext : oAccInfo.AccountName,
							contactid : this.getCurrentContact().ContactId,
							searchvalue : oInput.getValue()
						});
					},

					getCurrentContact : function() {
						var oView = this.getView(), sConVH = oView.byId(
								"contactInput").getValue(), activeTask = oView
								.getBindingContext().getObject() ? oView
								.getBindingContext().getObject()
								: this.oNewTask, oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCUC = oCU.ContactF4;
						oCUU.logObjectToConsole("active task: ", activeTask);

						if (sConVH === "")
							oCUC.setId("").setName("");
						else if (this.__onlyOneContactSuggested) {
							var oSuggestedContact = jQuery.extend({},
									this.__onlyOneContactSuggested, true);
							// Check if toLocaleLowerCase is to be used or not
							if ((oSuggestedContact[oCUC.getFilterString()] || oSuggestedContact.contactID)
									.toLowerCase() === sConVH.toLowerCase()) {
								oCUC.setId(oSuggestedContact.contactID)
										.setName(
												oSuggestedContact[oCUC
														.getFilterString()]);
								if (oCUC.getName() === "")
									oCUC.setName(oSuggestedContact.contactID);
								oView.byId("contactInput").setValue(
										oCUC.getName());
								oCUC._setAccountIfNotSetAlready(this,
										oSuggestedContact);
							}
							this.__onlyOneContactSuggested = undefined;
						}
						return {
							ContactId : oCUC.getId(),
							ContactName : oCUC.getName()
						};
					},

					openBusinessCardContact : function(oData, oResponse) {
						var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCUF = oCU.Formatter;
						var oConDetails = {};
						oConDetails.title = oCUF.getResourceBundle().getText(
								"DETAILS_BCARD_CONTACT");
						oConDetails.name = oData.fullName;
						oConDetails.imgurl = oCUF
								.photoUrlFormatter(oData.Photo);
						oConDetails.department = oData.department;
						oConDetails.companyname = oData.company;
						if (oData.WorkAddress) {
							var oWA = oData.WorkAddress;
							oConDetails.companyaddress = oWA.address;
							oConDetails.contactemail = oWA.email;
							oConDetails.contactphone = oWA.phone;
							oConDetails.contactmobile = oWA.mobilePhone;
						}
						var oConLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
								oConDetails), oOpenBy = this.getView().byId(
								"showContact");
						oConLaunch.openBy(oOpenBy);
						oCUU.releaseBusyDialog();
					},
					// END of methods modifying CONTACT details

					// START of methods modifying ACCOUNT details
					_onEnterPressedForAccount : function() {
						var input = this.getView().byId("accountInput");
						this.onF4Account({
							getSource : function() {
								return input;
							}
						});
					},

					onF4Account : function(oEvent) {
						// To manage both Actual event & sapenter event
						var oInput = oEvent.getSource(), oCU = cus.crm.mytasks.util, oCUA = oCU.AccountF4;
						// Method Chaining allowed; see control API reference
						oCUA.getValueHelp().open(oInput.getValue());
						oCUA.triggerSearch(oInput.getValue());
					},

					getCurrentAccount : function() {
						var oView = this.getView(), activeTask = oView
								.getBindingContext().getObject() ? oView
								.getBindingContext().getObject()
								: this.oNewTask, sInputField = oView.byId(
								"accountInput").getValue(), oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCUA = oCU.AccountF4;
						oCUU.logObjectToConsole("active task: ", activeTask);

						if (sInputField === "")
							oCUA.setId("").setName("");
						else if (this.__onlyOneAccountSuggested) {
							var oSuggestedAccount = {
								id : this.__onlyOneAccountSuggested.accountID,
								name : this.__onlyOneAccountSuggested[oCUA
										.getFilterString()]
										|| this.__onlyOneAccountSuggested.accountID
							};
							// Check if toLocaleLowerCase is to be used or not
							if (oSuggestedAccount.name.toLowerCase() === sInputField
									.toLowerCase()) {
								oCUA.setId(oSuggestedAccount.id).setName(
										oSuggestedAccount.name);
								oView.byId("accountInput").setValue(
										oCUA.getName());
							}
							this.__onlyOneAccountSuggested = undefined;
						}
						return {
							AccountId : oCUA.getId(),
							AccountName : oCUA.getName()
						};
					},

					openBusinessCardCompany : function(oData, oResponse) {
						var oCU = cus.crm.mytasks.util, oView = this.getView(), sAccSchema = oCU.AccountF4
								.getFilterString(), oCUU = oCU.Util, oCUF = oCU.Formatter;
						oCUU.logObjectToConsole(
								"open Business card with this data: ", oData);
						var oAccDetails = {};
						oAccDetails.title = oCUF.getResourceBundle().getText(
								"DETAILS_BCARD_ACCOUNT");
						oAccDetails.imgurl = oCUF.logoUrlFormatter(oData.Logo);
						oAccDetails.companyname = oData[sAccSchema];
						if (oData.MainAddress) {
							var oMA = oData.MainAddress;
							oAccDetails.companyphone = oMA.phone;
							oAccDetails.companyaddress = oMA.address;
						}
						if (oData.MainContact) {
							var oMC = oData.MainContact, oMCA = oMC.WorkAddress;
							oAccDetails.maincontactname = oMC.fullName;
							if (oMCA) {
								oAccDetails.maincontactphone = oMCA.phone;
								oAccDetails.maincontactmobile = oMCA.mobilePhone;
								oAccDetails.maincontactemail = oMCA.email;
							}
						}
						var oAccLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
								oAccDetails), oOpenBy = oView
								.byId("showAccount");
						oAccLaunch.openBy(oOpenBy);
						oCUU.releaseBusyDialog();
					},
					// END of methods modifying ACCOUNT details

					// START of methods modifying EMPLOYEE details
					_onEnterPressedForEmployee : function() {
						var input = this._oDlAssignTask.getContent()[1];
						this.onF4Employee({
							getSource : function() {
								return input;
							}
						});
					},

					onF4Employee : function(oEvent) {
						// To manage both Actual event & sapenter event
						var oInput = oEvent.getSource(), oCUE = cus.crm.mytasks.util.EmployeeF4;
						oCUE.getValueHelp().open(oInput.getValue());
						oCUE.triggerSearch(oInput.getValue());
					},

					_confirmEmployeeFromValueHelp : function(oEvent) {
						var oEmpDL = this._oDlAssignTask, sEmpValue = oEmpDL
								.getContent()[1].getValue(), oCU = cus.crm.mytasks.util, oRB = oCU.Formatter
								.getResourceBundle(), oCUE = oCU.EmployeeF4;
						if (sEmpValue !== "")
							if (sEmpValue === oCUE.getName()) {
								oEmpDL.close();
								this.assignTaskToEmployee();
							} else
								sap.ca.ui.message.showMessageToast(oRB
										.getText("DETAILS_VALIDATION_TITLE"));
						else
							sap.ca.ui.message.showMessageToast(oRB
									.getText("DETAILS_VALIDATION_TITLE"));
						// var bIsEmployeeAssignable = this.isEmployeeChosen();
						// if (bIsEmployeeAssignable) {
						// this._oDlAssignTask.close();
						// this.assignTaskToEmployee();
						// } else
						// this.onF4Employee(this._oDlAssignTask.getContent()[1]);
					},

					selectAssignTask : function(oEvent) {
						// make sure that EmployeeName is known for forward by
						// text
						var oCU = cus.crm.mytasks.util, oCUT = oCU.TechnicalInfoUtil, oCUF = oCU.Formatter, oRB = oCUF
								.getResourceBundle();
						oCUT.read(this.getView());
						if (!this._oDlAssignTask) {
							this._oDlAssignTask = new sap.m.Dialog(
									{
										title : oRB
												.getText("DETAILS_ASSIGNTO_TITLE"),
										content : [
												new sap.m.Label(
														{
															text : oRB
																	.getText("DETAILS_ASSIGNTO_TEXT")
														}),
												new sap.m.Input(
														{
															showValueHelp : true,
															valueHelpRequest : jQuery
																	.proxy(
																			function(
																					oEvent) {
																				this
																						.onF4Employee(oEvent);
																			},
																			this)
														}) ],
										beginButton : new sap.m.Button(
												{
													text : oRB
															.getText("DIALOG_ASSIGNTO_BUTTON_OK"),
													press : jQuery
															.proxy(
																	this._confirmEmployeeFromValueHelp,
																	this)
												}),
										endButton : new sap.m.Button(
												{
													text : oRB
															.getText("DIALOG_ASSIGNTO_BUTTON_CANCEL"),
													press : jQuery
															.proxy(
																	function(
																			oEvent) {
																		this._oDlAssignTask
																				.getContent()[1]
																				.setValue("");
																		this._oDlAssignTask
																				.close();
																	}, this)
												})
									});
							this._oDlAssignTask.getContent()[1]
									.addEventDelegate({
										onsapenter : this._onEnterPressed
									}, this);
							this._oDlAssignTask
									.addStyleClass("sapUiPopupWithPadding");
						}
						this._oDlAssignTask.open();
					},

					assignTaskToEmployee : function() {
						var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCUE = oCU.EmployeeF4, oTaskToAssign = this
								.getTask(), oCUF = oCU.Formatter, oCUT = oCU.TechnicalInfoUtil, sFromEmployee = oCUT
								.getEmployeeName(), oDF = sap.ca.ui.model.format.DateFormat
								.getDateInstance({
									style : "medium"
								}), sForwardedDate = oDF.format(new Date());
						oCUU.requestBusyDialog();
						oTaskToAssign.ResponsibleId = oCUE.getId();
						// oTaskToAssign.ResponsibleName = oCUE.getName();
						var sNoteToPrefix = oCUF.getResourceBundle().getText(
								"DETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE",
								[ sFromEmployee, sForwardedDate ]), bIsNewTask = this
								._checkIfNewTask(oTaskToAssign), sPreviousNote = oTaskToAssign.Note;
						if (oTaskToAssign.Note !== "")
							oTaskToAssign.Note = [ oTaskToAssign.Note,
									sNoteToPrefix ].join("\n");
						else
							oTaskToAssign.Note = sNoteToPrefix;
						oCUU.logObjectToConsole("task to assign: ",
								oTaskToAssign);
						var fnSuccess = function(oCO, oData, oResponses,
								aErrorResponses) {
							var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oRB = oCU.Formatter
									.getResourceBundle(), oCUE = oCU.EmployeeF4;
							// When leaving assign employee dialog, reset
							// the input value
							this._oDlAssignTask.getContent()[1].setValue("");
							if (aErrorResponses && aErrorResponses.length > 0)
								this._checkFor412StatusCode(aErrorResponses[0],
										"Operation failed: Assign Task");
							else {
								oCUU.logObjectToConsole(
										"Operation successful: Assign Task",
										oCO.curTask);
								var sMsg = [ "'", "'" ].join(oCUE.getName()), message = oRB
										.getText(
												"DETAILS_ASSIGNTO_CONFIRMATION",
												[ sMsg ]);
								sap.m.MessageToast.show(message, {
									closeOnBrowserNavigation : false
								});
								var bINT = this._checkIfNewTask(oCO.curTask), oCurrentTask = !bINT ? oCO.curTask
										: oData.__batchResponses[0].__changeResponses[0].data;
								this._showOverviewOrGoBack(this.getView(), {
									bINT : bINT,
									curTask : oCurrentTask,
									scenario : "CLICKEDASSIGNTO"
								});
								oCUU.releaseBusyDialog();
							}
						}, fnError = function(oCO, oError) {
							var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCustomizingModel = oCUU
									.getCustomizingModel();
							oCUU.onRequestFailed(oError,
									"Operation failed: Assign Task");
							oCO.curTask.Note = oCO.prevNote;
							oCO.curTask.ResponsibleId = oCustomizingModel
									.getProperty("/techInfo/ResponsibleId");
							oCO.curTask.ResponsibleName = oCustomizingModel
									.getProperty("/techInfo/ResponsibleName");
						}, oCurObject = {
							curTask : oTaskToAssign,
							prevNote : sPreviousNote
						};
						oCUU.saveTaskAndUpdateTaskList(bIsNewTask,
								oCurObject.curTask, this.getView(), jQuery
										.proxy(fnSuccess, this, oCurObject),
								jQuery.proxy(fnError, this, oCurObject), true);
					},
					// END of methods modifying EMPLOYEE details

					// START of methods modifying DUEDATE of TASK
					_onEnterPressedForDueDate : function() {
						// var dueDateField =
						// this.getView().byId("dueDateInput");
						// oDateString = dueDateField.getValue();
						this.enterDueDatePressed = true;
					},

					formatDateManually : function(oEvent) {
						var oDate = undefined, dueDateField = this.getView()
								.byId("dueDateInput");
						oDate = dueDateField._validateDate(oEvent
								.getParameter("newValue"));
						if (oDate)
							this.setFormattedDueDate(oDate);
						else
						// dueDateField._calendarIconPress();
						if (this.enterDueDatePressed)
							this.enterDueDatePressed = false;
					},

					setFormattedDueDate : function(oDate) {
						var sFormattedDate = cus.crm.mytasks.util.Formatter
								.formatDate(oDate);
						this.getView().byId("dueDateInput").setDateValue(oDate)
								.setValue(sFormattedDate);// .setDateValue(oDate.toString());
					},
					// END of methods modifying DUEDATE of TASK

					// START of methods showing BUSINESS CARDS
					// a. ACCOUNT details
					onShowAccount : function(oEvent) {
						var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oAccountInfo = this
								.getCurrentAccount(), oBundle = oCU.Formatter
								.getResourceBundle(), sInputField = this
								.getView().byId("accountInput").getValue();
						if (oAccountInfo.AccountName !== sInputField) {
							sap.ca.ui.message.showMessageBox({
								type : sap.ca.ui.message.Type.WARNING,
								message : oBundle
										.getText("DETAILS_VALIDATION_TITLE"),
								details : oBundle
										.getText("DETAILS_MESSAGETEXT_ACCOUNT")
							});
						} else if (oAccountInfo.AccountId !== "") {
							oCUU.requestBusyDialog();
							var sPath = "/AccountCollection('"
									+ oAccountInfo.AccountId + "')", oParams = {
								"$expand" : ""
							}, fnError = function(oError) {
								cus.crm.mytasks.util.Util
										.onRequestFailed(oError,
												"Operation failed: Read data for business card. ");
							}, fnSuccess = function(oData, oResponse) {
								cus.crm.mytasks.util.Util
										.logObjectToConsole(
												"Operation successful: Read data for business card. ",
												oData);
								this.openBusinessCardCompany(oData, oResponse);
							}, oModel = this.getView().getModel();
							/**
							 * @ControllerHook Provision for getting the Account
							 *                 Photo of the Task object. An
							 *                 Overview of the account details
							 *                 are shown via a pop-over
							 *                 including the photo if enabled.
							 *                 This is called when the user
							 *                 clicks on the help icon beside
							 *                 the account field of the task
							 *                 object. The hook must be
							 *                 documented like:
							 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookGetS3AccountPhoto
							 * @return {boolean}
							 */
							oParams["$expand"] = this.extHookGetS3AccountPhoto ? this
									.extHookGetS3AccountPhoto() ? [
									"MainAddress", "MainContact/WorkAddress",
									"Logo" ].join(",") : [ "MainAddress",
									"MainContact/WorkAddress" ].join(",")
									: [ "MainAddress",
											"MainContact/WorkAddress", "Logo" ]
											.join(",");
							jQuery.sap.log.debug("oData request to be fired:"
									+ sPath);
							oModel.read(sPath, null, oParams, true, jQuery
									.proxy(fnSuccess, this), jQuery.proxy(
									fnError, this));
						}
					},

					// b. CONTACT details
					onShowContact : function(oEvent) {
						var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oBundle = oCU.Formatter
								.getResourceBundle(), oContactInfo = this
								.getCurrentContact(), oAccountInfo = this
								.getCurrentAccount(), sInputField = this
								.getView().byId("contactInput").getValue();
						if (oContactInfo.ContactName !== sInputField) {
							sap.ca.ui.message.showMessageBox({
								type : sap.ca.ui.message.Type.WARNING,
								message : oBundle
										.getText("DETAILS_VALIDATION_TITLE"),
								details : oBundle
										.getText("DETAILS_MESSAGETEXT_CONTACT")
							});
						} else if (oContactInfo.ContactId !== "") {
							oCUU.requestBusyDialog();
							var sPath = "/ContactCollection(contactID='"
									+ oContactInfo.ContactId + "',accountID='"
									+ oAccountInfo.AccountId + "')", oParams = {
								"$expand" : ""
							}, fnError = function(oError) {
								cus.crm.mytasks.util.Util
										.onRequestFailed(oError,
												"Operation failed: Read data for business card of Contact. ");
							}, fnSuccess = function(oData, oResponse) {
								var oCU = cus.crm.mytasks.util;
								oCU.Util
										.logObjectToConsole(
												"Operation successful: Read data for business card of Contact. ",
												oData);
								if (oData.accountID !== ""
										&& oData.contactID !== "")
									this.openBusinessCardContact(oData,
											oResponse);
								else {
									sap.m.MessageToast
											.show(oCU.Formatter
													.getResourceBundle()
													.getText(
															"S3_ACCOUNT_CONTACT_NOREL"));
									oCU.Util.releaseBusyDialog();
								}
							}, oModel = this.getView().getModel();
							/**
							 * @ControllerHook Provision for getting the Contact
							 *                 Photo of the Task object. Contact
							 *                 details are shown via a pop-over &
							 *                 additionally the photo of the
							 *                 contact. This is called when the
							 *                 user clicks on the help icon
							 *                 beside the contact field of the
							 *                 task object. The hook must be
							 *                 documented like:
							 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookGetS3ContactPhoto
							 * @return {boolean}
							 */
							oParams["$expand"] = this.extHookGetS3ContactPhoto ? this
									.extHookGetS3ContactPhoto() ? [
									"WorkAddress", "Photo" ].join(",")
									: "WorkAddress"
									: [ "WorkAddress", "Photo" ].join(",");
							jQuery.sap.log.debug("oData request to be fired:"
									+ sPath);
							oModel.read(sPath, null, oParams, true, jQuery
									.proxy(fnSuccess, this), jQuery.proxy(
									fnError, this));
						}
					},
					// END of methods showing BUSINESS CARDS

					/*
					 * FIORI WAVE 2 - Branch : Rel - 1.0 END of INITAL
					 * DEVELOPMENT for MyTasks
					 */

					/*
					 * FIORI WAVE 4 - Branch : Rel - 1.2 START of ENHANCEMENTS
					 * for MyTasks
					 */

					/*
					 * @ControllerHook Provision for getting the additional
					 * fields to add to the Task object. Additional fields added
					 * to the Task Entity Type are got by this Hook method. This
					 * is called when the Task object is needed. The hook must
					 * be documented like: @callback
					 * sap.ca.scfld.md.controller.BaseFullscreenController~extHookGetCustomFields
					 * @param {object} oTask @return {void}
					 */
					// extHookGetCustomFields:function(oTask) {
					//		
					// },
					/*
					 * @ControllerHook Provision for checking the values of the
					 * additional fields of the Task object. Formatting of the
					 * various fields added by the customer can be done here.
					 * This is called when the checking the UI values of the
					 * Task object. The hook must be documented like: @callback
					 * sap.ca.scfld.md.controller.BaseFullscreenController~extHookCheckUIValues
					 * @param {object} oReturn @return {void}
					 */
					// extHookCheckUIValues : function(oReturn) {
					//
					// },
					/*
					 * @ControllerHook Provision for negating the changes made
					 * to the additional fields of the Task object. Revert to
					 * the old values of the custom fields when the Task is not
					 * meant to be saved. This is called when the canceling
					 * changes made to the Task object. The hook must be
					 * documented like: @callback
					 * sap.ca.scfld.md.controller.BaseFullscreenController~extHookCancelCustomFields
					 * @param {object} oCancelTask @return {void}
					 */
					// extHookCancelCustomFields : function(oCancelTask) {
					//
					// },
					/*
					 * @ControllerHook Provision for mangaing the additional
					 * fields to add to the Task object. filter types can be
					 * provided by customer and Tasks can be filtered on these
					 * new types when the end user selects one of these new
					 * types. This is called when the Facet Filter button on the
					 * Footer bar is selected. The hook must be documented like:
					 * @callback
					 * sap.ca.scfld.md.controller.BaseFullscreenController~extHookPrepareCustomFields
					 * @param {object} oNewTask @return {void}
					 */
					// extHookPrepareCustomFields:function(oNewTask) {
					//		
					// },
					/*
					 * FIORI WAVE 4 - Branch : Rel - 1.2 END of ENHANCEMENTS for
					 * MyTasks
					 */
					/*
					 * FIORI WAVE 5 - Branch : Rel - 1.3 START of ENHANCEMENTS
					 * for MyTasks
					 */
					_navToOriginatingApp : function(oAdditionalParams) {
						if (oAdditionalParams) {
							var oCP = {
								contextPath : oAdditionalParams.sPath
							};
							switch (oAdditionalParams.sScenario) {
							case "CLICKEDASSIGNTO":
								if (this.bIsBookmarkUsed)
									// Bookmark should also nav back to previous
									// screen
									this.bIsBookmarkUsed = false;
								if (this.createdfromAccounts)
									this.createdfromAccounts = false;
								this._navBack();
								break;
							case "CLICKEDSAVE":
								if (this.bIsBookmarkUsed) {
									// Bookmark should also nav back to previous
									// screen
									this.bIsBookmarkUsed = false;
									this._navBack();
								} else if (this.createdfromAccounts) {
									this.createdfromAccounts = false;
									this._navBack();
								} else
									this.oRouter.navTo("taskOverview", oCP,
											true);
								break;
							case "CLICKEDCANCEL":
							default:
								if (oAdditionalParams.bIsNewTask) {
									if (this.createdfromNotes) {
										this.createdfromNotes = false;
										this._navBack();
									} else if (this.bIsFollowupFromTasks) {
										// WAVE 6 ENHANCEMENT
										if (this.bIsBookmarkUsed)
											this.bIsBookmarkUsed = false;
										this.bIsFollowupFromTasks = false;
										this.oParamsToPass = undefined;
										this._navBack();
									} else {
										// Bookmark should also nav back to
										// previous screen
										if (this.bIsBookmarkUsed)
											this.bIsBookmarkUsed = false;
										// WAVE 6 ENHANCEMENT
										if (this.bIsFollowupFromOthers)
											this.bIsFollowupFromOthers = false;
										this._navBack();
									}
								} else {
									if (this.bIsBookmarkUsed) {
										this.bIsBookmarkUsed = false;
										this._navBack();
									} else
										this.oRouter.navTo("taskOverview", oCP,
												true);
								}
								break;
							}
						}
					},
					/*
					 * FIORI WAVE 5 - Branch : Rel - 1.3 END of ENHANCEMENTS for
					 * MyTasks
					 */
					/*
					 * FIORI WAVE 6 - Branch : Rel - 1.4 START of ENHANCEMENTS
					 * for MyTasks
					 */
					_initHFOptions : function(oContext) {
						var oCancelOption = {
							sId : "cancelTask",
							sI18nBtnTxt : "DETAILS_BUTTONS_CANCEL",
							onBtnPressed : jQuery.proxy(this.cancelTask, this),
						}, oAssignOption = {
							sId : "assignTask",
							sI18nBtnTxt : "DETAILS_BUTTONS_ASSIGNTO",
							onBtnPressed : jQuery.proxy(this.selectAssignTask,
									this),
						};
						var oOptions = {
							// unfortunately the default action button, has
							// to be provided as 'oEditBtn', although its
							// the save in our case ...
							oEditBtn : {
								sId : "saveTask",
								sI18nBtnTxt : "DETAILS_BUTTONS_SAVE",
								onBtnPressed : jQuery
										.proxy(this.saveTask, this),
							},
							buttonList : [ oCancelOption, oAssignOption ],
							bSuppressBookmarkButton : true,
							sI18NFullscreenTitle : "NEW_TASK_PAGE_TITLE",
							onBack : jQuery.proxy(this.navBackEditOrCreate,
									this),
						}, oCUS = cus.crm.mytasks.util.Schema;
						// WAVE 6 ENHANCEMENT; check does not work for book
						// mark scenario if schema versions are not
						// initialized
						if (!oCUS.getServiceVersion())
							oCUS.initServiceSchemaVersion(this.getView()
									.getModel(), "Task");
						var sContext = oContext.getPath().search("Tasks") !== -1 ? "detail"
								: "new";
						/**
						 * @ControllerHook Provision for customizing the header
						 *                 footer options of the page when
						 *                 editing TASKS. In both the CREATE and
						 *                 EDIT scenarions, it can be used to
						 *                 display or hide various pushbuttons,
						 *                 and to create new pushbuttons. This
						 *                 is called when the user is creating a
						 *                 new Task or modifying an existing
						 *                 Task. Context is passed to see which
						 *                 pushbuttons can appear during both
						 *                 the CREATE and EDIT scenarios
						 * 
						 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookCustomizeS3HFOptions
						 * @param {object}
						 *            oOptions
						 * @param {string}
						 *            sContext
						 * @return {void}
						 */
						if (this.extHookCustomizeS3HFOptions)
							this
									.extHookCustomizeS3HFOptions(oOptions,
											sContext);
						this.setHeaderFooterOptions(oOptions);
					},

					_getApplicationModel : function() {
						var oAMcontrollers = this.oApplicationFacade
								.getApplicationModel("controllers");
						if (!oAMcontrollers) {
							var jModel = new sap.ui.model.json.JSONModel({
								s2Controller : undefined,
								s3Controller : this,
								// WAVE 7 ENHANCEMENT
								s4Controller : undefined,
							});
							this.oApplicationFacade.setApplicationModel(
									"controllers", jModel);
							oAMcontrollers = this.oApplicationFacade
									.getApplicationModel("controllers");
						}
						return oAMcontrollers;
					},

					_checkIfPrerequisitesExist : function() {
						var oCU = cus.crm.mytasks.util, oCustomizingModel = oCU.Util
								.getCustomizingModel(), aPaths = [];
						if (!oCustomizingModel.getProperty("/techInfo")
								&& !oCustomizingModel.getProperty("/prioList"))
							aPaths = oCU.Schema.getServiceVersion() == 1
									&& oCU.Schema.getServiceSchemaVersion() >= 4 ? [
									"TechnicalDetails", "UserPriorities" ]
									: [ "retrieveTaskTech",
											"retrieveTaskPrioCustomizing" ];
						else
							aPaths = [];
						return aPaths;
					},

					_setPrivacyForTask : function(oPE, oCUS, oCUT) {
						var sPE = undefined, oError = undefined, bPrivateEnabled = undefined;
						if (oPE.curType === "undefined")
							oCUT.setPrivacyForSelectedTask(false);
						else {
							try {
								sPE = Array.isArray(oPE.curValue) ? oPE.curValue[0]
										: oPE.curValue;
								bPrivateEnabled = jQuery.parseJSON(sPE);
							} catch (oException) {
								oError = oException;
							}
							if (typeof oError !== "undefined")
								oCUT.setPrivacyForSelectedTask(false);
							else if (typeof bPrivateEnabled === "boolean")
								oCUT.setPrivacyForSelectedTask(bPrivateEnabled);
							else
								oCUT.setPrivacyForSelectedTask(false);
						}
					},

					_showOrHideTransactionType : function(aStrIds) {
						var oCUS = cus.crm.mytasks.util.Schema, oView = this
								.getView();
						for ( var i = 0, j = aStrIds.length; i < j; i++)
							oView.byId(aStrIds[i]).setVisible(false);
						if (oCUS.getServiceVersion() == 1
								&& oCUS.getServiceSchemaVersion() >= 3)
							for ( var i = 0, j = aStrIds.length; i < j; i++)
								oView.byId(aStrIds[i]).setVisible(true);
					},

					_showOrHideStatusField : function(aStrIds, oTask) {
						var oCU = cus.crm.mytasks.util, oCUS = oCU.Schema, oView = this
								.getView(), oCUSL = oCU.StatusListUtil;
						for ( var i = 0, j = aStrIds.length; i < j; i++)
							oView.byId(aStrIds[i]).setVisible(false);
						if (oCUS.getServiceVersion() == 1) {
							var bIsNewTask = this._checkIfNewTask(oTask);
							if (oCUS.getServiceSchemaVersion() >= 4) {
								oCU.Util.bindCustomizingModel(oView);
								if (bIsNewTask) {
									var oCM = oCU.Util.getCustomizingModel(), aStatList = oCM
											.getProperty("/masterStatusSet/"
													+ oTask.TransactionType);
									oCM.setProperty("/statList", jQuery.extend(
											[], aStatList, true));
									oCUSL.setInitialStatus(oCM);
									oView.byId("statSelect").setSelectedKey(
											oCUSL.getInitialStatus().statID);
								} else
									oView.byId("statSelect").setSelectedKey(
											oTask.UserStatusCode);
							} else if (oCUS.getServiceSchemaVersion() >= 3) {
								var s2Controller = this._getApplicationModel()
										.getProperty("/s2Controller"), oParams = undefined, sKey = undefined;
								if (s2Controller
										&& s2Controller.oStatusDDLB
										&& !s2Controller.oStatusDDLB.bNotRetrieved) {
									// Navigated from TaskList screen
									oParams = {
										procType : oTask.TransactionType,
										guid : oTask.Guid,
										bIsNew : bIsNewTask
									};
									if (!oParams.bIsNew
											|| this.bIsFollowupFromTasks
											|| this.createdfromNotes) {
										oCUSL.getStatusValues(this, oParams);
										sKey = this.bIsFollowupFromTasks
												|| this.createdfromNotes ? oCUSL
												.getInitialStatus().statID
												: oTask.UserStatusCode;
										oView.byId("statSelect")
												.setSelectedKey(sKey);
									}
								} else {
									// Bookmark scenario
									oParams = {
										procType : oTask.TransactionType,
										guid : oTask.Guid,
										bIsNew : bIsNewTask
									};
									oCUSL.getStatusValues(this, oParams);
									sKey = oParams.bIsNew ? oCUSL
											.getInitialStatus().statID
											: oTask.UserStatusCode;
									oView.byId("statSelect").setSelectedKey(
											sKey);
									if (this.oStatusDDLB.bNotRetrieved) {
										oCU.Util
												.onRequestFailed(
														this.oStatusDDLB.errorObj,
														"Operation failed: Read status customizing.");
										this.oStatusDDLB.errorObj = null;
										this.oStatusDDLB.bNotRetrieved = false;
									}
								}
							}
							for ( var i = 0, j = aStrIds.length; i < j; i++)
								oView.byId(aStrIds[i]).setVisible(true);
						}
					},

					_commonWayToSaveTask : function(oCO, oUpdateParams) {
						var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCUF = oCU.Formatter;
						oCUU.requestBusyDialog();
						oCO.curBtn.setEnabled(false);
						oCUU.logObjectToConsole("task to save: ", oCO.curTask);
						var oReturn = this.checkUIValues(oCO.curTask), title = oCUF
								.getResourceBundle().getText(
										"DETAILS_VALIDATION_TITLE");

						if (oReturn.hasErrors) {
							// show messages
							sap.ca.ui.message.showMessageBox({
								type : sap.ca.ui.message.Type.ERROR,
								message : title,
								details : oReturn.messages.toString()
							});
							oCO.curBtn.setEnabled(true);
							oCUU.releaseBusyDialog();
						} else {
							var bIsNewTask = this._checkIfNewTask(oCO.curTask);
							jQuery.sap.log
									.debug("Assure description of Task if it a new task!");
							oCUU.saveTaskAndUpdateTaskList(bIsNewTask,
									oCO.curTask, this.getView(), jQuery.proxy(
											oUpdateParams.success, this, oCO),
									jQuery.proxy(oUpdateParams.error, this,
											oCO.curBtn), oUpdateParams.async);
						}
					},

					createFollowUpObject : function(oEvent) {
						var bIsTaskModified = !this
								._checkIfExistingTaskModified(this.oSavedTask), oBundle = cus.crm.mytasks.util.Formatter
								.getResourceBundle(), sBtnText = oEvent
								.getSource().getText();
						if (bIsTaskModified) {
							var sQuestion = oBundle
									.getText("DETAILS_FOLLOWUP_MESSAGE"), mOptions = {
								// icon : sap.m.MessageBox.Icon.WARNING,
								icon : sap.m.MessageBox.Icon.QUESTION,
								title : oBundle
										.getText("DETAILS_FOLLOWUP_TITLE"),
								actions : [ sap.m.MessageBox.Action.YES,
										sap.m.MessageBox.Action.NO,
										sap.m.MessageBox.Action.CANCEL ],
								onClose : jQuery.proxy(this._confirmOnFollowup,
										this, sBtnText)
							};
							sap.m.MessageBox.confirm(sQuestion, mOptions);
						} else
							this._confirmOnFollowup(sBtnText, undefined);
					},

					_confirmOnFollowup : function(sFollowupType, sAction) {
						var oCUU = cus.crm.mytasks.util.Util;
						oCUU.requestBusyDialog();
						// if task is modified; 3 options are provided otherwise
						// proceed with follow up
						if (sAction) {
							switch (sAction) {
							case sap.m.MessageBox.Action.YES:
								// SAVE current state of Task object
								var fnSuccess = function(oCO, oData, oResponse,
										aErrorResponses) {
									var oCU = cus.crm.mytasks.util, oCUU = oCU.Util;
									oCO.curBtn.setEnabled(true);
									if (aErrorResponses
											&& aErrorResponses.length > 0)
										oCUU
												.onRequestFailed(
														aErrorResponses[0],
														"Operation failed: Update Task");
									else {
										oCUU
												.logObjectToConsole(
														"Operation successful: Update Task",
														oCO.curTask);
										var oRB = oCU.Formatter
												.getResourceBundle(), sMsg = oRB
												.getText("CURRENT_TASK_SAVED");
										sap.m.MessageToast.show(sMsg, {
											closeOnBrowserNavigation : false
										});
										oCUU.releaseBusyDialog();
										this._performFollowUp(oCO);
									}
								}, fnError = function(oBtn, oError) {
									cus.crm.mytasks.util.Util.onRequestFailed(
											oError,
											"Operation failed: Update Task");
									oBtn.setEnabled(true);
								}, oCurObj = {
									curTask : this.getTask(),
									curBtn : this.getPage().getFooter()
											.getContentRight()[0],
									followupType : sFollowupType,
								}, oUpdateParams = {
									success : fnSuccess,
									error : fnError,
									async : false,
								};
								this._commonWayToSaveTask(oCurObj,
										oUpdateParams);
								break;
							case sap.m.MessageBox.Action.NO:
								// SAVE previous state of Task object
								this._performFollowUp({
									curTask : this.oSavedTask,
									followupType : sFollowupType
								});
								break;
							case sap.m.MessageBox.Action.CANCEL:
							default:
								// REMAIN in the same view
								oCUU.releaseBusyDialog();
								break;
							}
						} else
							this._performFollowUp({
								curTask : this.oSavedTask,
								followupType : sFollowupType
							});
					},

					_performFollowUp : function(oCO) {
						var sPath = undefined, oCU = cus.crm.mytasks.util, oCUF = oCU.Formatter, oBundle = oCUF
								.getResourceBundle(), aStrIds = [
								"DETAILS_BUTTONS_FOLLOWUP_TASK",
								"DETAILS_BUTTONS_FOLLOWUP_OPPT",
								"DETAILS_BUTTONS_FOLLOWUP_APPT" ], aChecks = [];
						for ( var i = 0; i < aStrIds.length; i++)
							aChecks.push(oBundle.getText(aStrIds[i]));
						switch (oCO.followupType) {
						case aChecks[0]:
							sPath = "TaskFollowupTransTypes";
							break;
						case aChecks[1]:
							sPath = "OpptFollowupTransTypes";
							break;
						case aChecks[2]:
							sPath = "AppFollowupTransTypes";
							break;
						}
						if (sPath) {
							// sPath += "?Guid=guid'" + oCO.curTask.Guid
							// + "'&TransactionType='"
							// + oCO.curTask.TransactionType + "'";
							var aTransactionTypes = undefined, oProcType = {
								key : "",
								value : "",
								privateEnabled : "",
							}, oView = this.getView(), oModel = oView
									.getModel(), fnSuccessFT = function(oData,
									oResponse) {
								aTransactionTypes = oData.results;
								cus.crm.mytasks.util.Util.releaseBusyDialog();
							}, fnErrorFT = function(oCurObject, oError) {
								var oCU = cus.crm.mytasks.util, oCUS = oCU.Schema, oRB = oCU.Formatter
										.getResourceBundle(), sMsg = [ "'", "'" ]
										.join(oCurObject.curTask.Description), oFollowup = {
									sv : oCUS.getServiceVersion(),
									ssv : oCUS.getServiceSchemaVersion(),
									msg : oRB.getText("FOLLOWUP_ERROR_MSG",
											[ sMsg ])
								};
								oCU.Util.onRequestFailed(oError,
										"Operation Failed: Read Transaction Types for '"
												+ oCurObject.followupType
												+ "'.", oFollowup);
							}, mParams = {
								Guid : oModel.formatValue(oCO.curTask.Guid,
										oCUF.EDM_GUID),
								TransactionType : oModel.formatValue(
										oCO.curTask.TransactionType,
										oCUF.EDM_STRING)
							};
							oModel.read(sPath, null, mParams, false, jQuery
									.proxy(fnSuccessFT, this), jQuery.proxy(
									fnErrorFT, this, oCO));
							// CallFunction is always asynchronous
							// oModel.callFunction(sPath, "GET",
							// {
							// Guid : oCO.curTask.Guid,
							// TransactionType : oCO.curTask.TransactionType
							// }, null, jQuery.proxy(fnSuccessFT,
							// this), jQuery.proxy(
							// fnErrorFT, this, sPT),
							// false);
							if (!this._oDlFollowupTT) {
								this._oDlFollowupTT = new sap.ui.xmlfragment(
										"cus.crm.mytasks.view.FollowupDialog",
										this);
								this._oDlFollowupTT.setModel(oView
										.getModel("i18n"), "i18n");
							}
							if (Array.isArray(aTransactionTypes))
								if (aTransactionTypes.length == 1) {
									oProcType.key = aTransactionTypes[0].ProcessTypeCode;
									oProcType.value = aTransactionTypes[0].Description;
									oProcType.privateEnabled = aTransactionTypes[0].PrivateFlag;
								} else {
									this._oDlFollowupTT.setModel(
											new sap.ui.model.json.JSONModel(
													aTransactionTypes),
											"FollowupTypes");
									this._oDlFollowupTT._sFollowupType = oCO.followupType;
									this._oDlFollowupTT.open();
								}
							if (oProcType.key !== "")
								this._onSelectedFollowUpType(oProcType, oCO);
						} else
							jQuery.sap.log
									.debug("## Incorrect way to perform a Follow up ##");
					},

					_checkIfExistingTaskModified : function(oTask) {
						var bReturn = true, oView = this.getView(), sDescription = oView
								.byId("descInput").getValue(), sDueDate = oView
								.byId("dueDateInput").getValue(), sPriority = oView
								.byId("prioSelect").getSelectedKey(), bPrivate = oView
								.byId("privateSwitch").getState(), sAccName = oView
								.byId("accountInput").getValue(), sConName = oView
								.byId("contactInput").getValue(), sNote = oView
								.byId("noteTa").getValue();
						var oCU = cus.crm.mytasks.util, oDF = oCU.Formatter
								.getDateFormatter(), oCUS = oCU.Schema, sStatus = undefined;
						bReturn = bReturn
								&& sDescription === oTask.Description
								&& sPriority === oTask.Priority
								&& bPrivate === oTask.Private
								&& sAccName === (oTask.AccountName ? oTask.AccountName
										: oTask.AccountId)
								&& sConName === (oTask.ContactName ? oTask.ContactName
										: oTask.ContactId)
								&& sNote === oTask.Note;
						if (oCUS.getServiceVersion() == 1
								&& oCUS.getServiceSchemaVersion() >= 3) {
							sStatus = oView.byId("statSelect").getSelectedKey();
							bReturn = bReturn
									&& sStatus === oTask.UserStatusCode;
						}
						// To care of Task objects that have null value
						bReturn = oTask.DueDate ? bReturn
								&& sDueDate === oDF.format(oTask.DueDate)
								: bReturn && "" === sDueDate;
						return bReturn;
					},

					navBackEditOrCreate : function(oEvent) {
						var bIsTaskModified = this.oSavedTask ? !this
								._checkIfExistingTaskModified(this.oSavedTask)
								: true, oRB = cus.crm.mytasks.util.Formatter
								.getResourceBundle(), sQuestion = oRB
								.getText("NAVBACK_WARNING_MESSAGE"), mOptions = {
							icon : sap.m.MessageBox.Icon.WARNING,
							title : oRB.getText("NAVBACK_WARNING_TITLE"),
							actions : [ sap.m.MessageBox.Action.OK,
									sap.m.MessageBox.Action.CANCEL ],
							onClose : jQuery.proxy(function(sAction) {
								if (sAction === sap.m.MessageBox.Action.OK)
									this.cancelTask();
								else
									jQuery.sap.log.debug("Nav Back cancelled");
							}, this)
						};
						if (bIsTaskModified)
							sap.m.MessageBox.confirm(sQuestion, mOptions);
						else
							this.cancelTask();
					},

					privatizeTask : function(oEvent) {
						this.setBtnEnabled("assignTask", !oEvent
								.getParameter("state"));
					},

					_getPrerequisiteInfoForNewTask : function(
							aPrerequisitePaths, oTaskParams) {
						var sFormattedString, sEncodedURL, oCU = cus.crm.mytasks.util, oModel = this
								.getView().getModel(), oCUF = oCU.Formatter, oCUS = oCU.Schema;
						if (oCUS.getServiceVersion() == 1)
							if (oCUS.getServiceSchemaVersion() >= 4) {
								if (typeof oTaskParams.ProcessTypeDescription === "undefined")
									aPrerequisitePaths.push("TransactionTypes");
								if (!oCU.Util.getCustomizingModel()
										.getProperty("/masterStatusSet"))
									aPrerequisitePaths.push("UserStatuses");
							} else if (oCUS.getServiceSchemaVersion() >= 3) {
								if (typeof oTaskParams.ProcessTypeDescription === "undefined")
									aPrerequisitePaths.push("TaskTransTypes");
							}

						if (oTaskParams.accountID)
							aPrerequisitePaths
									.push([ "AccountCollection(", ")" ]
											.join(oModel.formatValue(
													oTaskParams.accountID,
													oCUF.EDM_STRING)));
						if (oTaskParams.contactID) {
							sFormattedString = oModel.formatValue(
									oTaskParams.contactID, oCUF.EDM_STRING);
							sEncodedURL = jQuery.sap.encodeURL("contactID eq "
									+ sFormattedString);
							aPrerequisitePaths
									.push("ContactCollection?$filter="
											+ sEncodedURL);
						}
						var fnSucess = function(oTaskParams, oData, oResponse,
								aErrorResponses) {
							var oCU = cus.crm.mytasks.util;
							if (aErrorResponses && aErrorResponses.length > 0)
								oCU.Util.onRequesFailed(aErrorResponses[0],
										"Prerequisite Info READ Failed!");
							else {
								for ( var i = -1, oCurResponse; oCurResponse = oData.__batchResponses[++i];)
									switch (i) {
									case 0:
										oCU.TechnicalInfoUtil
												.parseTechInfoOData(oCurResponse.data);
										break;
									case 1:
										oCU.PriorityListUtil
												.parsePrioListOData(oCurResponse.data);
										break;
									case 2:
										for ( var j = -1, oTT; oTT = oCurResponse.data.results[++j];)
											if (oTT.ProcessTypeCode === oTaskParams.procType) {
												oTaskParams.ProcessTypeDescription = oTT.Description;
												oTaskParams.privateFlag = oTT.PrivateFlag;
												if (oCU.Schema
														.getServiceVersion() == 1
														&& oCU.Schema
																.getServiceSchemaVersion() >= 4)
													oTaskParams.priority = oTT.Priority;
												break;
											}
										oCU.TechnicalInfoUtil
												.setPrivacyForSelectedTask(oTaskParams.privateFlag);
										break;
									default:
										if (oCurResponse.data.__metadata)
											// Account Info
											oTaskParams.accountName = oCurResponse.data[oCU.AccountF4
													.getFilterString()] ? oCurResponse.data[oCU.AccountF4
													.getFilterString()]
													: oTaskParams.accountID;
										else {
											if (oCurResponse.data.results[0].__metadata.type
													.search("Contact") !== -1)
												// Contact Collection
												oTaskParams.contactName = oCurResponse.data.results[0][oCU.ContactF4
														.getFilterString()] ? oCurResponse.data.results[0][oCU.ContactF4
														.getFilterString()]
														: oTaskParams.contactID;
											else
												// UserStatuses in new task
												oCU.StatusListUtil
														.setStatusValuesAgainstTransactionType(jQuery
																.extend(
																		[],
																		oCurResponse.data.results,
																		true));
										}
										break;
									}
							}
						}, fnError = function(oError) {
							cus.crm.mytasks.util.Util.onRequesFailed(oError,
									"Prerequisite Info READ Failed!");
						};
						oCU.Util.getAllPrerequisites(oModel,
								aPrerequisitePaths, {
									success : jQuery.proxy(fnSucess, this,
											oTaskParams),
									error : fnError,
									async : false
								});
						oCU.Util.bindCustomizingModel(this.getView());
					},

					_getTaskHeaderInfo : function() {
						var oView = this.getView(), oCU = cus.crm.mytasks.util, aPrerequisitePaths = this
								._checkIfPrerequisitesExist(), oContext = oView
								.getBindingContext(), sPathToRead = oContext
								.getPath().substr(1);
						aPrerequisitePaths.splice(0, 0, sPathToRead);
						if (oCU.Schema.getServiceVersion() == 1
								&& oCU.Schema.getServiceSchemaVersion() >= 4
								&& !this.oSavedTask)
							aPrerequisitePaths.push([ sPathToRead,
									oCU.Attachments.NAVLINK ].join("/"), [
									sPathToRead, "TaskStatuses" ].join("/"));
						var fnSuccess = function(oData, oResponse,
								aErrorResponses) {
							var oCU = cus.crm.mytasks.util;
							if (aErrorResponses && aErrorResponses.length > 0)
								oCU.Util
										.onRequestFailed(aErrorResponses[0],
												"Prerequisites READ plus Bookmark READ failed!");
							else {
								var oView = this.getView(), oContext = oView
										.getBindingContext(), sKey = oContext
										.getPath().substr(1);
								for ( var i = -1, oCurResponse; oCurResponse = oData.__batchResponses[++i];)
									switch (i) {
									case 0:
										// TASK HEADER INFO
										oView.getModel().oData[sKey] = jQuery
												.extend({}, oCurResponse.data,
														true);
										this.oSavedTask = oContext.getObject();
										break;
									case 1:
										// Prerequisites have not been read
										if (oCU.Schema.getServiceVersion() == 1
												&& oCU.Schema
														.getServiceSchemaVersion() >= 4)
											oCU.TechnicalInfoUtil
													.parseTechInfoOData({
														retrieveTaskTech : jQuery
																.extend(
																		{},
																		oCurResponse.data.results[0],
																		true)
													});
										else
											oCU.TechnicalInfoUtil
													.parseTechInfoOData(oCurResponse.data);
										break;
									case 2:
										oCU.PriorityListUtil
												.parsePrioListOData(oCurResponse.data);
										break;
									case 3:
										// TASK Attachments
										oCU.Attachments._aPaths = oCU.Attachments
												._addDataToODataModel(
														oView.getModel(),
														oCurResponse.data.results)["paths"];
										break;
									case 4:
										// TASK Next Possible Statuses
										oCU.StatusListUtil
												.bindStatusValuesToTask(
														oContext.getModel(),
														{
															bExpandCall : false,
															curResults : oCurResponse.data.results
														});
										break;
									default:
										break;
									}
							}
						}, fnError = function(oError) {
							cus.crm.mytasks.util.Util
									.onRequestFailed(oError,
											"Prerequisites READ plus Bookmark READ failed!");
						};
						oCU.Util.getAllPrerequisites(oView.getModel(),
								aPrerequisitePaths, {
									success : jQuery.proxy(fnSuccess, this),
									error : fnError,
									async : false
								});
					},
					/*
					 * FIORI WAVE 6 - Branch : Rel - 1.4 END of ENHANCEMENTS for
					 * MyTasks
					 */
					/*
					 * FIORI WAVE 7 - Branch : Rel - 1.5 END of ENHANCEMENTS for
					 * MyTasks
					 */
					_checkIfFollowupFromTasks : function() {
						var oOverviewController = this._getApplicationModel()
								.getProperty("/s4Controller");
						if (oOverviewController
								&& oOverviewController.oParamsToPass) {
							this.oParamsToPass = jQuery.extend(
									oOverviewController.oParamsToPass, {});
							oOverviewController.oParamsToPass = undefined;
						}
					},

					_showOverviewOrGoBack : function(oView, oParams) {
						var sGuid = undefined, oCUF = cus.crm.mytasks.util.Formatter, oModel = oView
								.getModel();
						if (typeof oParams.curTask.Guid === "undefined"
								&& typeof oParams.curTask.PredecessorGUID !== "undefined")
							sGuid = oParams.curTask.PredecessorGUID;
						else
							sGuid = oParams.curTask.Guid;
						var oAdditionalParams = {
							sScenario : oParams.scenario,
							bIsNewTask : oParams.bINT,
							sPath : sGuid ? [ "Tasks(", ")" ].join(oModel
									.formatValue(sGuid, oCUF.EDM_GUID))
									: undefined
						};
						if (oParams.bINT
								&& (oParams.scenario === "CLICKEDSAVE" || oParams.scenario === "CLICKEDASSIGNTO"))
							oModel.oData[oAdditionalParams.sPath] = oParams.curTask;
						if (this.createdfromAccounts)
							sap.ui.getCore().getEventBus().publish(
									"cus.crm.mytasks", "taskCreated");
						this._navToOriginatingApp(oAdditionalParams);
					},

					// START OF TYPE-AHEAD OF VALUE HELPS
					// TYPE-AHEAD for the account field of a TASK
					liveChangeAccount : function(oEvent) {
						var oAccInput = oEvent.getSource(), sCurValue = oAccInput
								.getValue();
						oAccInput.removeAllSuggestionItems();
						if (oAccInput.setFilterSuggests)
							oAccInput.setFilterSuggests(false);
						var fnTimeoutToDelayKeyStroke = function(sCurValue) {
							var fnSuccess = function(oData, oResponse) {
								var oAccInput = this.getView().byId(
										"accountInput");
								for ( var i = 0; i < oData.results.length; i++) {
									var oAccountResult = oData.results[i], sAccountNameToDisplay = oAccountResult[cus.crm.mytasks.util.AccountF4
											.getFilterString()]
											|| oAccountResult.accountID, oCustomDataObject = {
										key : "taskAccount",
										value : oAccountResult
									}, oItemObject = {
										text : sAccountNameToDisplay,
										customData : new sap.ui.core.CustomData(
												oCustomDataObject)
									};
									oAccInput.setShowSuggestion(true);
									oAccInput
											.addSuggestionItem(new sap.ui.core.Item(
													oItemObject));
								}
								this.__onlyOneAccountSuggested = oData.results.length == 1 ? oData.results[0]
										: undefined;
							}, oModel = this.getView().getModel(), fnError = function(
									oError) {
								cus.crm.mytasks.util.Util
										.onRequestFailed(oError,
												"Read of Suggestion items for account failed");
							}, oCU = cus.crm.mytasks.util, sFilterStringFormat = [
									oModel.formatValue(sCurValue,
											oCU.Formatter.EDM_STRING),
									oCU.AccountF4.getFilterString() ].join(","), mParams = {
								"$top" : 10,
								"$filter" : [ "substringof(", ")" ]
										.join(sFilterStringFormat)
							};
							oModel.read("/AccountCollection", null, mParams,
									true, jQuery.proxy(fnSuccess, this),
									fnError);
						};

						var iDelay = sCurValue !== "" ? 500 : 0;
						clearTimeout(this._fnTimeOut);
						if (iDelay !== 0) {
							this._fnTimeOut = setTimeout(
									jQuery.proxy(fnTimeoutToDelayKeyStroke,
											this, sCurValue), iDelay);
						}
					},

					// Selected an account from the list of suggestion items
					// either through click/tap or keyboard
					suggestedAccountSelected : function(oEvent) {
						var oItem = oEvent.getParameter("selectedItem"), oAccountInfo = oItem
								.getCustomData()[0].getValue(), oCUA = cus.crm.mytasks.util.AccountF4, sAccountNameToSet = oAccountInfo[oCUA
								.getFilterString()]
								|| oAccountInfo.accountID;
						// Set AccountF4 util
						oCUA.setId(oAccountInfo.accountID).setName(
								sAccountNameToSet);
						// Set input field to match case letters of contact
						oEvent.getSource().setValue(sAccountNameToSet);
					},

					// TYPE-AHEAD for the contact field of a TASK
					liveChangeContact : function(oEvent) {
						var oConInput = oEvent.getSource(), sCurValue = oConInput
								.getValue();
						oConInput.removeAllSuggestionItems();
						if (oConInput.setFilterSuggests)
							oConInput.setFilterSuggests(false);
						var fnTimeoutToDelayKeyStroke = function(sCurValue) {
							var fnSuccess = function(oData, oResponse) {
								var oConInput = this.getView().byId(
										"contactInput");
								for ( var i = 0; i < oData.results.length; i++) {
									var oContactResult = oData.results[i], sContactNameToDisplay = oContactResult[cus.crm.mytasks.util.ContactF4
											.getFilterString()]
											|| oContactResult.contactID, oCustomDataObject = {
										key : "taskContact",
										value : oContactResult
									}, oItemObject = {
										text : sContactNameToDisplay,
										customData : new sap.ui.core.CustomData(
												oCustomDataObject)
									};
									oConInput.setShowSuggestion(true);
									oConInput
											.addSuggestionItem(new sap.ui.core.Item(
													oItemObject));
								}
								this.__onlyOneContactSuggested = oData.results.length == 1 ? oData.results[0]
										: undefined;
							}, fnError = function(oError) {
								cus.crm.mytasks.util.Util
										.onRequestFailed(oError,
												"Read of Suggestion items for contact failed");
							}, oCU = cus.crm.mytasks.util, oModel = this
									.getView().getModel(), sFilterStringFormat = [
									oModel.formatValue(sCurValue,
											oCU.Formatter.EDM_STRING),
									oCU.ContactF4.getFilterString() ].join(","), mParams = {
								"$top" : 10,
								"$filter" : [ "substringof(", ")" ]
										.join(sFilterStringFormat)
							};
							oModel.read("/ContactCollection", null, mParams,
									true, jQuery.proxy(fnSuccess, this),
									fnError);
						};

						var iDelay = sCurValue !== "" ? 500 : 0;
						clearTimeout(this._fnTimeOutC);
						if (iDelay !== 0) {
							this._fnTimeOutC = setTimeout(
									jQuery.proxy(fnTimeoutToDelayKeyStroke,
											this, sCurValue), iDelay);
						}
					},

					// Selected a contact from the list of suggestion items
					// either through click/tap or keyboard
					suggestedContactSelected : function(oEvent) {
						var oCUC = cus.crm.mytasks.util.ContactF4, oItem = oEvent
								.getParameter("selectedItem"), oContactInfo = oItem
								.getCustomData()[0].getValue(), sContactNameToSet = oContactInfo[oCUC
								.getFilterString()]
								|| oContactInfo.contactID;
						// Set ContactF4 util
						oCUC.setId(oContactInfo.contactID).setName(
								sContactNameToSet);
						// Set input field to match case letters of contact
						oEvent.getSource().setValue(sContactNameToSet);
						oCUC._setAccountIfNotSetAlready(this, oContactInfo);
					},
					// END OF TYPE-AHEAD OF VALUE HELPS

					// START OF ATTACHMENTS
					onUploadFile : function(oEvent) {
						var oAttachmentInfo = oEvent.getParameter("d");
						if (!oAttachmentInfo)
							oAttachmentInfo = oEvent.getParameters();
						cus.crm.mytasks.util.Attachments.EditPage
								.uploadFileToTask(this, oAttachmentInfo);
					},

					onRenameFile : function(oEvent) {
						var oAttachmentInfo = oEvent.getParameter("d");
						if (!oAttachmentInfo)
							oAttachmentInfo = oEvent.getParameters();
						var aDummy = (oAttachmentInfo.mediaURL || oAttachmentInfo.url)
								.split("/");
						// oParams2 can be used for TaskAttachmentSet entity
						var oParams2 = {
							path : aDummy[aDummy.length - 2],
							entry : {
								Name : oAttachmentInfo.newFilename
										+ oAttachmentInfo.parsedFileExtension,
								Documentid : oAttachmentInfo.fileId,
								Documentclass : oAttachmentInfo.docClass,
								HeaderGuid : oAttachmentInfo.taskGuid
							}
						};
						var sPathToUpdate = [ aDummy[aDummy.length - 2],
								aDummy[aDummy.length - 1] ].join("/"), oParams = {
							entry : {
								newfilename : oAttachmentInfo.newFilename
										+ oAttachmentInfo.parsedFileExtension,
								fileId : oAttachmentInfo.fileId,
								fileExtension : oAttachmentInfo.fileExtension
							},
							headers : {
								newfilename : oAttachmentInfo.newFilename
							},
							path : sPathToUpdate
						};
						cus.crm.mytasks.util.Attachments.EditPage
								.renameFileOfTask(this, oParams);
					},

					onDeleteFile : function(oEvent) {
						var oAttachmentInfo = oEvent.getParameter("d");
						if (!oAttachmentInfo)
							oAttachmentInfo = oEvent.getParameters();
						cus.crm.mytasks.util.Attachments.EditPage
								.deleteFileFromTask(this, oAttachmentInfo);
					},

					onFileUploadFailed : function(oEvent) {
						var sHighLevelMsg = oEvent.getParameter("exception").message;
						var oJQResponse = oEvent.getParameter("response")
								.response(), oErrorResponse = oJQResponse.jqXHR.responseJSON
								&& oJQResponse.jqXHR.responseJSON.error;
						sap.ca.ui.message.showMessageBox({
							type : sap.ca.ui.message.Type.ERROR,
							message : sHighLevelMsg,
							details : oErrorResponse
									&& oErrorResponse.message.value
						});
					},

					onBeforeFileUpload : function(oEvent) {
						var oAttachmentInfo = oEvent.getParameters(), sFilename = oAttachmentInfo.name, aDummy = sFilename
								.split(".");
						if (aDummy.length > 1
								&& aDummy[aDummy.length - 1] === "rar")
							this.getView().getModel().setHeaders({
								"Content-Type" : "application/x-rar-compressed"
							});
					},

					onSaveClicked : function(oEvent) {
						if (sap.ui.version < "1.21.1") {

						} else
							jQuery.sap.log
									.debug("## Event has been deprecated from UI5 1.21.1 onwards");
					},

					onCancelClicked : function(oEvent) {
						if (sap.ui.version < "1.21.1") {

						} else
							jQuery.sap.log
									.debug("## Event has been deprecated from UI5 1.21.1 onwards");
					},
					// END OF ATTACHMENTS

					_checkFor412StatusCode : function(oError, sLogMsg) {
						var oCU = cus.crm.mytasks.util, oBundle = oCU.Formatter
								.getResourceBundle();
						if (oError.response.statusCode === "412") {
							jQuery.sap.log.debug("412 error occurred during"
									+ sLogMsg);
							var fnClose = function(oAction) {
								var oCU = cus.crm.mytasks.util;
								oCU.Util.requestBusyDialog();
								this.oSavedTask = undefined;
								// this.oRouter.navTo("taskDetail", temp, true);
								this._getTaskHeaderInfo();
								this.prepareNewTask(this.oSavedTask);
								this.initializeDetailsPage(this.oSavedTask);
								var oPrivateFlag = {
									curType : typeof this.oSavedTask.PrivateAllowed,
									curValue : this.oSavedTask.PrivateAllowed
								};
								this._setPrivacyForTask(oPrivateFlag,
										oCU.Schema, oCU.TechnicalInfoUtil);
								oCU.Util.releaseBusyDialog();
							}, mOptions = {
								icon : sap.m.MessageBox.Icon.ERROR,
								title : oBundle.getText("S3_412_TITLE"),
								actions : [ sap.m.MessageBox.Action.OK ],
								onClose : jQuery.proxy(fnClose, this),
							};
							sap.m.MessageBox.show(oBundle
									.getText("S3_412_ERRORMSG"), mOptions);
							oCU.Util.releaseBusyDialog();
						} else
							oCU.Util.onRequestFailed(oError, sLogMsg);
					},
				/*
				 * FIORI WAVE 7 - Branch : Rel - 1.5 END of ENHANCEMENTS for
				 * MyTasks
				 */
				});
},
	"cus/crm/mytasks/view/S3.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc"\n\txmlns="sap.m" controllerName="cus.crm.mytasks.view.S3" xmlns:html="http://www.w3.org/1999/xhtml"\n\txmlns:form="sap.ui.layout.form" xmlns:caui="sap.ca.ui">\n\t<Page id="taskDetailsPage">\n\t\t<content>\n\t\t\t<form:SimpleForm id="s3form" editable="true"\n\t\t\t\tlayout="ResponsiveGridLayout" labelSpanL="3" labelSpanM="3"\n\t\t\t\temptySpanL="0" emptySpanM="0" columnsL="1" columnsM="1">\n\n\t\t\t\t<form:content>\n\t\t\t\t\t<!-- Add additional fields to the top of the Task form -->\n\t\t\t\t\t<core:ExtensionPoint name="extTaskDetailsTop" />\n\t\t\t\t\t<Label text="{i18n>DETAILS_LABEL_TYPE}" id="laTypeInput" />\n\t\t\t\t\t<Text text="{ProcessTypeDescription}" id="TxtTypeInput" class="TaskTypePad" />\n\t\t\t\t\t<HBox id="TxtTypeHBox" />\n\n\t\t\t\t\t<Label text="{i18n>DETAILS_LABEL_TITLE}" id="laDescInput" />\n\t\t\t\t\t<TextArea value="{Description}" id="descInput" rows="1" />\n\t\t\t\t\t<HBox />\n\n\t\t\t\t\t<Label text="{i18n>DETAILS_LABEL_DUE_DATE}" id="LaDueDateInput" />\n\t\t\t\t\t<caui:DatePicker id="dueDateInput"\n\t\t\t\t\t\tvalue="{path: \'DueDate\', formatter: \'cus.crm.mytasks.util.Formatter.formatDate\' }"\n\t\t\t\t\t\tchange="formatDateManually" />\n\t\t\t\t\t<HBox />\n\n\t\t\t\t\t<Label text="{i18n>DETAILS_LABEL_PRIORITY}" id="laPrioSelect" />\n\t\t\t\t\t<Select name="Priority" items="{cus.crm.mytasks.customizing>/priolist}"\n\t\t\t\t\t\tselectedKey="{Priority}" id="prioSelect">\n\t\t\t\t\t\t<core:Item text="{cus.crm.mytasks.customizing>TxtLong}"\n\t\t\t\t\t\t\tkey="{cus.crm.mytasks.customizing>Priority}" />\n\t\t\t\t\t</Select>\n\t\t\t\t\t<HBox />\n\n\t\t\t\t\t<Label text="{i18n>DETAILS_LABEL_STATUS}" id="laStatSelect" />\n\t\t\t\t\t<Select name="Status" items="{cus.crm.mytasks.customizing>/statList}"\n\t\t\t\t\t\tselectedKey="{UserStatusCode}" id="statSelect">\n\t\t\t\t\t\t<core:Item text="{cus.crm.mytasks.customizing>StatusTxt}"\n\t\t\t\t\t\t\tkey="{cus.crm.mytasks.customizing>StatusID}" />\n\t\t\t\t\t</Select>\n\t\t\t\t\t<HBox id="hboxStatus" />\n\n\t\t\t\t\t<Label text="{i18n>DETAILS_LABEL_PRIVATE}" id="laPrivateSwitch" />\n\t\t\t\t\t<Switch enabled="{cus.crm.mytasks.customizing>/techInfo/PrivateAllowed}"\n\t\t\t\t\t\tstate="{Private}" id="privateSwitch" change="privatizeTask" />\n\t\t\t\t\t<HBox />\n\n\t\t\t\t\t<Label text="{i18n>DETAILS_LABEL_ACCOUNT}" id="laAccountInput" />\n\t\t\t\t\t<Input type="Text" id="accountInput" showValueHelp="true"\n\t\t\t\t\t\tvalueHelpRequest="onF4Account" valueHelpOnly="false" liveChange="liveChangeAccount"\n\t\t\t\t\t\tsuggestionItemSelected="suggestedAccountSelected" value="{AccountName}" />\n\t\t\t\t\t<HBox>\n\t\t\t\t\t\t<items>\n\t\t\t\t\t\t\t<core:Icon id="showAccount" press="onShowAccount" src="sap-icon://sys-help" />\n\t\t\t\t\t\t</items>\n\t\t\t\t\t</HBox>\n\n\t\t\t\t\t<Label text="{i18n>DETAILS_LABEL_CONTACT}" id="laContactInput" />\n\t\t\t\t\t<Input type="Text" id="contactInput" showValueHelp="true"\n\t\t\t\t\t\tvalueHelpRequest="onF4Contact" valueHelpOnly="false" liveChange="liveChangeContact"\n\t\t\t\t\t\tsuggestionItemSelected="suggestedContactSelected" value="{ContactName}" />\n\t\t\t\t\t<HBox>\n\t\t\t\t\t\t<items>\n\t\t\t\t\t\t\t<core:Icon src="sap-icon://sys-help" id="showContact"\n\t\t\t\t\t\t\t\tpress="onShowContact" />\n\t\t\t\t\t\t</items>\n\t\t\t\t\t</HBox>\n\n\t\t\t\t\t<Label text="{i18n>DETAILS_LABEL_NOTE}" id="laNoteTa" />\n\t\t\t\t\t<TextArea value="{Note}" id="noteTa" rows="4" />\n\t\t\t\t\t<HBox />\n\t\t\t\t\t<!-- Add additional fields to the bottom of the Task form -->\n\t\t\t\t\t<core:ExtensionPoint name="extTaskDetailsBottom" />\n\t\t\t\t</form:content>\n\t\t\t</form:SimpleForm>\n\t\t\t<!-- Show additional info of task before the Attachments Panel -->\n\t\t\t<core:ExtensionPoint name="extS3BeforeAttachments" />\n\t\t\t<Panel id="attachmentEditData" expandable="true" expanded="true"\n\t\t\t\theaderText="{i18n>S4_TASK_ATTACHMENTS}">\n\t\t\t\t<content>\n\t\t\t\t\t<caui:FileUpload id="attachmentEdit" items="/Attachments"\n\t\t\t\t\t\tuploadUrl="" fileName="name" size="size" url="url" uploadedDate="uploadedDate"\n\t\t\t\t\t\tcontributor="contributor" mimeType="mimeType" uploadEnabled="true"\n\t\t\t\t\t\tfileId="fileId" useMultipart="false" acceptRequestHeader="application/json"\n\t\t\t\t\t\trenameEnabled="true" showNoData="true" useEditControls="true"\n\t\t\t\t\t\tfileUploadFailed="onFileUploadFailed" uploadFile="onUploadFile"\n\t\t\t\t\t\trenameFile="onRenameFile" deleteFile="onDeleteFile" saveClicked="onSaveClicked"\n\t\t\t\t\t\tcancelClicked="onCancelClicked" />\n\t\t\t\t</content>\n\t\t\t</Panel>\n\t\t\t<!-- Show additional info of task at the bottom of the page -->\n\t\t\t<core:ExtensionPoint name="extTaskDetailEnd" />\n\t\t</content>\n\t</Page>\n</core:View>',
	"cus/crm/mytasks/view/S4.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");

sap.ca.scfld.md.controller.BaseFullscreenController
		.extend(
				"cus.crm.mytasks.view.S4",
				{
					navFromAccounts : false,
					_sETag : "",
					// Controller Methods - onInit
					onInit : function() {
						// execute the onInit for the base class
						// BaseFullScreenController
						jQuery.sap.log.debug("begin on init s4");
						sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit
								.call(this);

						this._getApplicationModel().setProperty(
								"/s4Controller", this);
						var oCU = cus.crm.mytasks.util, oView = this.getView(), oModel = oView
								.getModel();
						if (!oCU.Schema.getServiceVersion())
							oCU.Schema.initServiceSchemaVersion(oModel, "Task");

						this._checkIfPrerequisitesExist(oView, oCU);
						var oStartupParams = undefined, myComponent = sap.ui
								.component(sap.ui.core.Component
										.getOwnerIdFor(this.getView()));
						if (myComponent && myComponent.getComponentData())
							oStartupParams = myComponent.getComponentData().startupParameters;
						this.oRouter.attachRouteMatched(jQuery.proxy(
								this.handleNavigationWithTaskOverview, this,
								oStartupParams));
						oCU.Util.logObjectToConsole(
								"S4 View Model after init: ", oModel);
						jQuery.sap.log.debug("end on init s4");
					},

					// Controller Methods - onBeforeRendering
					onBeforeRendering : function() {
						jQuery.sap.log.debug("on before render s4");
					},

					// Controller Methods - onAfterRendering
					onAfterRendering : function() {
						jQuery.sap.log.debug("on after render s4");
					},

					// Controller Methods - onExit
					onExit : function() {
						jQuery.sap.log.debug("on exit s4");
					},

					handleNavigationWithTaskOverview : function(oStartupParams,
							oEvent) {
						jQuery.sap.log.debug("on route matched s3");
						var oCU = cus.crm.mytasks.util, oContext = undefined, oView = this
								.getView(), oModel = oView.getModel(), oCUU = oCU.Util, sRouteName = oEvent
								.getParameter("name"), oCUS = oCU.Schema, oArgs = oEvent
								.getParameter("arguments");
						switch (sRouteName) {
						case "taskOverview":
							oContext = new sap.ui.model.Context(oModel, '/'
									+ oArgs.contextPath);
							oView.setBindingContext(oContext);
							this.oOverviewTask = oContext.getObject();
							if (oStartupParams && oStartupParams.fromAccount
									&& oStartupParams.fromAccount[0])
								this.navFromAccounts = true;
							if (!this.oOverviewTask) {
								jQuery.sap.log
										.debug("S4 page called via bookmark");
								this._getOverviewTask(false);
							} else {
								// TODO: Change schema version to 4
								if (oCUS.getServiceVersion() == 1
										&& oCUS.getServiceSchemaVersion() >= 4) {
									this._getRelatedInformationOfTask(oContext);
									this._sETag = this.oOverviewTask.Etag;
								}
								this.initializeOverviewPage(this.oOverviewTask);
							}
							break;
						default:
							break;
						}
						oCUU.releaseBusyDialog();
					},

					getHeaderFooterOptions : function() {
						var oMessageOption = {
							sId : "error",
							sI18nBtnTxt : "DETAILS_FOOTER_BUTTON_MESSAGE",
							onBtnPressed : jQuery.proxy(this.showTaskErrors,
									this),
						}, oDeleteOption = {
							sId : "deleteTask",
							sI18nBtnTxt : "DETAILS_FOOTER_BUTTON_DELETE",
							onBtnPressed : jQuery.proxy(this.confirmDeleteTask,
									this)
						}, oFollowupOption = {
							sId : "followupOptions",
							sI18nBtnTxt : "DETAILS_BUTTONS_FOLLOWUP",
							onBtnPressed : jQuery.proxy(
									this.openFollowupActivity, this),
						}, oCUS = cus.crm.mytasks.util.Schema, oOptions = {
							oEditBtn : {
								sId : "editTask",
								sI18nBtnTxt : "S4_FOOTER_BUTTON_EDIT",
								onBtnPressed : jQuery
										.proxy(this.editTask, this),
							},
							buttonList : [ oDeleteOption, oFollowupOption ],
							bSuppressBookmarkButton : true,
							onBack : jQuery.proxy(this.navBackOverview, this)
						// sI18NFullscreenTitle : "NEW_TASK_PAGE_TITLE",
						};
						if (!oCUS.getServiceVersion())
							oCUS.initServiceSchemaVersion(this.getView()
									.getModel(), "Task");
						if (oCUS.getServiceVersion() == 1
								&& oCUS.getServiceSchemaVersion() >= 4)
							oOptions.buttonList.splice(0, 0, oMessageOption);
						// TODO: Give extension point & Hook for extra header
						// footer options
						return oOptions;
					},

					_checkIfPrerequisitesExist : function(oView, oCU) {
						var oCustomizingModel = oCU.Util.getCustomizingModel(), fnSuccess = function(
								oData, oResponse, aErrorResponses) {
							var oCU = cus.crm.mytasks.util;
							if (aErrorResponses && aErrorResponses.length > 0)
								oCU.Util
										.onRequestFailed(aErrorResponses[0],
												"Operation failed: Priority list and Technical Information");
							else {
								for ( var i = -1, oCurrentData; oCurrentData = oData.__batchResponses[++i];)
									switch (i) {
									case 0:
										if (oCU.Schema.getServiceVersion() == 1
												&& oCU.Schema
														.getServiceSchemaVersion() >= 4)
											oCU.TechnicalInfoUtil
													.parseTechInfoOData({
														retrieveTaskTech : jQuery
																.extend(
																		{},
																		oCurrentData.data.results[0],
																		true)
													});
										else
											oCU.TechnicalInfoUtil
													.parseTechInfoOData(oCurrentData.data);
										break;
									case 1:
										oCU.PriorityListUtil
												.parsePrioListOData(oCurrentData.data);
										break;
									case 2:
										oCU.StatusListUtil
												.setStatusValuesAgainstTransactionType(jQuery
														.extend(
																[],
																oCurrentData.data.results,
																true));
										break;
									case 3:
										this._sETag = oCurrentData.data.Etag;
										break;
									default:
										break;
									}
								oCU.Util.releaseBusyDialog();
							}
						}, fnError = function(oError) {
							cus.crm.mytasks.util.Util
									.onRequestFailed(oError,
											"Operation failed: Priority list and Technical Information");
						}, aPrerequisites = [], aDummy = sap.ushell.Container
								.getService("URLParsing").getHash(location)
								.split("/");
						if (!oCustomizingModel.getProperty("/techInfo")
								&& !oCustomizingModel.getProperty("/prioList"))
							aPrerequisites = oCU.Schema.getServiceVersion() == 1
									&& oCU.Schema.getServiceSchemaVersion() >= 4 ? [
									"TechnicalDetails", "UserPriorities",
									"UserStatuses", aDummy[aDummy.length - 1] ]
									: [ "retrieveTaskTech",
											"retrieveTaskPrioCustomizing" ];

						oCU.Util.getAllPrerequisites(this.getView().getModel(),
								aPrerequisites, {
									success : jQuery.proxy(fnSuccess, this),
									error : fnError,
									async : false
								});
						oCU.Util.bindCustomizingModel(oView);
						// oCustomizingModel.refresh();
					},

					initializeOverviewPage : function(oTask) {
						var oCU = cus.crm.mytasks.util, oCUS = oCU.Schema, oView = this
								.getView();
						this._setFullScreenTitle(oTask);
						if (oTask.Note !== "") {
							oView.byId("notesS4").setVisible(true);
							oView.byId("notesS4").setValue(oTask.Note);
						} else
							oView.byId("notesS4").setVisible(false);
						oView.byId("osStatus").setVisible(false);
						oView.byId("oaTaskType").setVisible(false);
						oView.byId("attachmentData").setVisible(false);
						if (oCUS.getServiceVersion() == 1
								&& oCUS.getServiceSchemaVersion() >= 3) {
							oView.byId("osStatus").setVisible(true);
							oView.byId("oaTaskType").setVisible(true);
						}
						oCU.Attachments.OverviewPage.showOrHidePanel(oView);
						oCU.DocumentHistory.showOrHidePanel(oView);
					},

					navBackOverview : function(oEvent) {
						var s3Controller = this._getApplicationModel()
								.getProperty("/s3Controller");
						if (s3Controller && s3Controller.createdfromNotes) {
							s3Controller.createdfromNotes = false;
							this._navBack();
						} else if (s3Controller
								&& s3Controller.bIsFollowupFromTasks) {
							// WAVE 6 ENHANCEMENT
							if (this.bIsBookmarkUsed)
								this.bIsBookmarkUsed = false;
							if (this.navFromAccounts) {
								this.navFromAccounts = false;
								sap.ui.getCore().getEventBus().publish(
										"cus.crm.mytasks",
										"followUpTaskCreated");
							}
							s3Controller.bIsFollowupFromTasks = false;
							s3Controller.oParamsToPass = undefined;
							this._navBack();
						} else {
							// WAVE 6 ENHANCEMENT
							if (s3Controller
									&& s3Controller.bIsFollowupFromOthers)
								s3Controller.bIsFollowupFromOthers = false;
							if (this.navFromAccounts) {
								this.navFromAccounts = false;
								var oContext = {
									contextPath : this.getView()
											.getBindingContext().getPath()
								};
								sap.ui.getCore().getEventBus().publish(
										"cus.crm.mytasks", "taskChanged",
										oContext);
							}
							this._navBack();
						}
					},

					_setFullScreenTitle : function(oTask) {
						var title = cus.crm.mytasks.util.Formatter
								.showTaskTitle(oTask.Description, oTask.Id);
						this._oControlStore.oTitle.setText(title);
					},

					_getApplicationModel : function() {
						var oAMcontrollers = this.oApplicationFacade
								.getApplicationModel("controllers");
						if (!oAMcontrollers) {
							var jModel = new sap.ui.model.json.JSONModel({
								s2Controller : undefined,
								s3Controller : undefined,
								s4Controller : this,
							});
							this.oApplicationFacade.setApplicationModel(
									"controllers", jModel);
							oAMcontrollers = this.oApplicationFacade
									.getApplicationModel("controllers");
						}
						return oAMcontrollers;
					},

					_getRelatedInformationOfTask : function(oContext) {
						var oView = this.getView(), oModel = oContext ? oContext
								.getModel()
								: oView.getModel(), fnSuccess = function(
								oExtraObject, oData, oResponse, aErrorResponses) {
							if (aErrorResponses && aErrorResponses.length > 0)
								cus.crm.mytasks.util.Util
										.onRequestFailed(aErrorResponses[0],
												"Reading related information of tasks failed");
							else {
								var aNavLinks = oExtraObject.navlinks, oRelatedInfoOfTask = {};
								for ( var i = -1, oCurResponse; oCurResponse = oData.__batchResponses[++i];)
									oRelatedInfoOfTask[aNavLinks[i]] = oCurResponse.data.results;
								this
										._bindRelatedInformationOfTask(oRelatedInfoOfTask);

							}
						}, fnError = function(oError) {
							cus.crm.mytasks.util.Util
									.onRequestFailed(oError,
											"Reading related information of tasks failed");
						}, oCU = cus.crm.mytasks.util, aRelatedInfoPaths = [], aNavLinks = [
								oCU.Attachments.NAVLINK,
								oCU.DocumentHistory.NAVLINK, "TaskLogSet",
								"TaskStatuses" ];
						for ( var i = 0; i < aNavLinks.length; i++)
							if (aNavLinks[i])
								aRelatedInfoPaths.push([ oContext.getPath(),
										aNavLinks[i] ].join("/"));
						oView.byId("attachmentOverview").setBusy(true);
						oView.byId("tabDocHistory").setBusy(true);
						oCU.Util.getAllPrerequisites(oModel, aRelatedInfoPaths,
								{
									success : jQuery.proxy(fnSuccess, this, {
										navlinks : aNavLinks,
										paths : aRelatedInfoPaths
									}),
									error : fnError,
									basync : true
								});
					},

					_bindRelatedInformationOfTask : function(oFetchedData) {
						var oCU = cus.crm.mytasks.util, oParams = undefined, oView = this
								.getView(), oCUAtt = oCU.Attachments, oCUDoc = oCU.DocumentHistory;
						for ( var sProperty in oFetchedData) {
							oParams = {
								bExpandCall : false,
								curResults : oFetchedData[sProperty]
							};
							switch (sProperty) {
							case oCUAtt.NAVLINK:
								oView.byId("attachmentOverview").setBusy(false);
								oCUAtt.OverviewPage.bindData(this, oParams);
								break;
							case oCUDoc.NAVLINK:
								oView.byId("tabDocHistory").setBusy(false);
								oCUDoc.bindDataToTable(this, oParams);
								break;
							case "TaskLogSet":
								this.bindTaskErrors(oParams);
								break;
							case "TaskStatuses":
								oCU.StatusListUtil.bindStatusValuesToTask(this
										.getView().getModel(), oParams);
								break;
							default:
								oParams = {
									bExpandCall : false,
									curResults : oFetchedData[sProperty]
								};
								break;
							}
						}
					},

					editTask : function(oEvent) {
						var oCUU = cus.crm.mytasks.util.Util, oView = this
								.getView(), sPath = oView.getBindingContext()
								.getPath();
						oCUU.requestBusyDialog();
						this.oRouter.navTo("taskDetail", {
							contextPath : sPath.substr(1)
						}, true);
					},

					showAccountOverview : function(oEvent) {
						var oCUU = cus.crm.mytasks.util.Util, oView = this
								.getView(), oModel = oView.getModel(), oCurrentTask = oView
								.getBindingContext().getObject(), sPath = "/AccountCollection('"
								+ oCurrentTask.AccountId + "')", oParams = {
							"$expand" : ""
						}, fnError = function(oError) {
							cus.crm.mytasks.util.Util
									.onRequestFailed(oError,
											"Operation failed: Read data for business card. ");
						}, fnSuccess = function(oData, oResponse) {
							cus.crm.mytasks.util.Util
									.logObjectToConsole(
											"Operation successful: Read data for business card. ",
											oData);
							this.openBusinessCardCompany(oData, oResponse);
						};
						/**
						 * @ControllerHook Provision for getting the Account
						 *                 Photo of the Task object. An Overview
						 *                 of the account details are shown via
						 *                 a pop-over including the photo if
						 *                 enabled. This is called when the user
						 *                 clicks on the account attribute of
						 *                 the task object if available. The
						 *                 hook must be documented like:
						 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookGetS4AccountPhoto
						 * @return {boolean}
						 */
						oParams["$expand"] = this.extHookGetS4AccountPhoto ? this
								.extHookGetS4AccountPhoto() ? [ "MainAddress",
								"MainContact/WorkAddress", "Logo" ].join(",")
								: [ "MainAddress", "MainContact/WorkAddress" ]
										.join(",")
								: [ "MainAddress", "MainContact/WorkAddress",
										"Logo" ].join(",");
						jQuery.sap.log.debug("oData request to be fired:"
								+ sPath);
						oCUU.requestBusyDialog();
						oModel.read(sPath, null, oParams, true, jQuery.proxy(
								fnSuccess, this), jQuery.proxy(fnError, this));

					},

					openBusinessCardCompany : function(oData, oResponse) {
						var oCU = cus.crm.mytasks.util, oView = this.getView(), oCUU = oCU.Util, sAccSchema = oCU.AccountF4
								.getFilterString(), oCUF = oCU.Formatter;
						oCUU.logObjectToConsole(
								"open Business card with this data: ", oData);
						var oAccDetails = {}, fnCallbackNavParaComp = jQuery
								.proxy(
										function(oEvent) {
											var sKey = [ "'", "'" ]
													.join(oData.accountID);
											return {
												target : {
													semanticObject : "Account",
													action : [
															"MyAccounts&/detail/AccountCollection(",
															")" ].join(sKey)
												}
											};
										}, this);
						oAccDetails.title = oCUF.getResourceBundle().getText(
								"DETAILS_BCARD_ACCOUNT");
						oAccDetails.imgurl = oCUF.logoUrlFormatter(oData.Logo);
						oAccDetails.companyname = oData[sAccSchema];
						if (oData.MainAddress) {
							var oMA = oData.MainAddress;
							oAccDetails.companyphone = oMA.phone;
							oAccDetails.companyaddress = oMA.address;
						}
						if (oData.MainContact) {
							var oMC = oData.MainContact, oMCA = oMC.WorkAddress;
							oAccDetails.maincontactname = oMC.fullName;
							if (oMCA) {
								oAccDetails.maincontactphone = oMCA.phone;
								oAccDetails.maincontactmobile = oMCA.mobilePhone;
								oAccDetails.maincontactemail = oMCA.email;
							}
						}
						oAccDetails.beforeExtNav = fnCallbackNavParaComp;
						var oAccLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
								oAccDetails), oOpenBy = oView.byId("oaAccount");
						oAccLaunch.openBy(oOpenBy);
						oCUU.releaseBusyDialog();
					},

					showContactOverview : function(oEvent) {
						var oCUU = cus.crm.mytasks.util.Util, oView = this
								.getView(), oModel = oView.getModel(), oCurrentTask = oView
								.getBindingContext().getObject(), sPath = "/ContactCollection(contactID='"
								+ oCurrentTask.ContactId
								+ "',accountID='"
								+ oCurrentTask.AccountId + "')", oParams = {
							"$expand" : ""
						}, fnError = function(oError) {
							cus.crm.mytasks.util.Util
									.onRequestFailed(oError,
											"Operation failed: Read data for business card of Contact. ");
						}, fnSuccess = function(oData, oResponse) {
							var oCU = cus.crm.mytasks.util;
							oCU.Util
									.logObjectToConsole(
											"Operation successful: Read data for business card of Contact. ",
											oData);
							if (oData.accountID !== ""
									&& oData.contactID !== "")
								this.openBusinessCardContact(oData, oResponse);
							else {
								sap.m.MessageToast.show(oCU.Formatter
										.getResourceBundle().getText(
												"S4_ACCOUNT_CONTACT_NOREL"));
								oCU.Util.releaseBusyDialog();
							}
						};
						/**
						 * @ControllerHook Provision for getting the Contact
						 *                 Photo of the Task object. Contact
						 *                 details are shown via a pop-over &
						 *                 additionally the photo of the
						 *                 contact. This is called when the user
						 *                 clicks on the Contact attribute of
						 *                 the task object if available. The
						 *                 hook must be documented like:
						 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookGetS4ContactPhoto
						 * @return {boolean}
						 */
						oParams["$expand"] = this.extHookGetS4ContactPhoto ? this
								.extHookGetS4ContactPhoto() ? [ "WorkAddress",
								"Photo" ].join(",") : "WorkAddress"
								: [ "WorkAddress", "Photo" ].join(",");
						jQuery.sap.log.debug("oData request to be fired:"
								+ sPath);
						oCUU.requestBusyDialog();
						oModel.read(sPath, null, oParams, true, jQuery.proxy(
								fnSuccess, this), jQuery.proxy(fnError, this));
					},

					openBusinessCardContact : function(oData, oResponse) {
						var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCUF = oCU.Formatter;
						var oConDetails = {}, fnCallbackNavParaComp = jQuery
								.proxy(
										function(oEvent) {
											var sKey = [
													[ "accountID='", "'" ]
															.join(oData.accountID),
													[ "contactID='", "'" ]
															.join(oData.contactID) ]
													.join(",");
											return {
												target : {
													semanticObject : "ContactPerson",
													action : [
															"MyContacts&/display/ContactCollection(",
															")" ].join(sKey)
												}
											};
										}, this);
						oConDetails.title = oCUF.getResourceBundle().getText(
								"DETAILS_BCARD_CONTACT");
						oConDetails.name = oData.fullName;
						oConDetails.imgurl = oCUF
								.photoUrlFormatter(oData.Photo);
						oConDetails.department = oData.department;
						oConDetails.companyname = oData.company;
						if (oData.WorkAddress) {
							var oWA = oData.WorkAddress;
							oConDetails.companyaddress = oWA.address;
							oConDetails.contactemail = oWA.email;
							oConDetails.contactphone = oWA.phone;
							oConDetails.contactmobile = oWA.mobilePhone;
						}
						oConDetails.beforeExtNav = fnCallbackNavParaComp;
						var oConLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
								oConDetails), oOpenBy = this.getView().byId(
								"oaContact");
						oConLaunch.openBy(oOpenBy);
						oCUU.releaseBusyDialog();
					},

					confirmDeleteTask : function(oEvent) {
						var oResourceBundle = cus.crm.mytasks.util.Formatter
								.getResourceBundle();
						var fnConfirmDelete = jQuery.proxy(function(sAction) {
							if (sAction === sap.m.MessageBox.Action.OK)
								this.deleteTask(sAction);
							else
								jQuery.sap.log.debug("delete task: cancelled");
						}, this);
						var sQuestion = oResourceBundle
								.getText("DETAILS_MESSAGEBOX_TEXT"), mOptions = {
							icon : sap.m.MessageBox.Icon.QUESTION,
							title : oResourceBundle
									.getText("DETAILS_MESSAGEBOX_TITLE"),
							actions : [ sap.m.MessageBox.Action.OK,
									sap.m.MessageBox.Action.CANCEL ],
							onClose : fnConfirmDelete
						};
						sap.m.MessageBox.confirm(sQuestion, mOptions);
					},

					deleteTask : function(oAction) {
						var oCU = cus.crm.mytasks.util, oCUU = oCU.Util;
						oCUU.requestBusyDialog();
						var oContext = this.getView().getBindingContext(), taskToDelete = oContext
								.getObject();
						if (oCU.Schema.getServiceVersion() == 1
								&& oCU.Schema.getServiceSchemaVersion() >= 4) {
							var aNavLinks = [ oCU.Attachments.NAVLINK,
									oCU.DocumentHistory.NAVLINK, "TaskLogSet",
									"TaskStatuses" ];
							for ( var i = -1, sNavLink; sNavLink = aNavLinks[++i];)
								taskToDelete[sNavLink] = oCUU
										.getDeferredObject(oContext.getPath()
												.substr(1), sNavLink);
						}
						oCUU.logObjectToConsole("delete task: started",
								taskToDelete);
						oCUU.deleteTaskAndUpdateTaskList(taskToDelete, this);
					},

					openFollowupActivity : function(oEvent) {
						if (!this._oFollowupAS) {
							var oCU = cus.crm.mytasks.util, oBundle = oCU.Formatter
									.getResourceBundle(), aFollowupTexts = [
									"S4_BUTTONS_FOLLOWUPTOTASK",
									"S4_BUTTONS_FOLLOWUPTOOPPT",
									"S4_BUTTONS_FOLLOWUPTOAPPT" ], aButtons = [];
							/**
							 * @ControllerHook Provision for creating other
							 *                 follow-up documents from the
							 *                 current document or transaction.
							 *                 The follow-up pop-over displays
							 *                 the list of all possible
							 *                 follow-up documents that can be
							 *                 created. This is called when the
							 *                 user clicks on the Follow up
							 *                 pushbutton at footer of the
							 *                 Overview page. The hook must be
							 *                 documented like:
							 * 
							 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookAddAdditionalFollowupTypes
							 * @param {array}
							 *            aFollowupTexts Array of i18n resource
							 *            texts
							 * @return {void}
							 */
							if (this.extHookAddAdditionalFollowupTypes) {
								this
										.extHookAddAdditionalFollowupTypes(aFollowupTexts);
							}
							for ( var i = 0, j = aFollowupTexts.length; i < j; i++)
								aButtons.push(new sap.m.Button({
									text : oBundle.getText(aFollowupTexts[i]),
									press : jQuery.proxy(
											this.createFollowUpObject, this)
								}));
							this._oFollowupAS = new sap.m.ActionSheet({
								placement : sap.m.PlacementType.Top,
								buttons : aButtons
							});
						}
						this._oFollowupAS.openBy(oEvent.getSource());
					},

					createFollowUpObject : function(oEvent) {
						var oCU = cus.crm.mytasks.util, oCUF = oCU.Formatter, oView = this
								.getView(), oModel = oView.getModel(), sPath = undefined, sBtnText = oEvent
								.getSource().getText(), oCurObject = {
							curTask : oView.getBindingContext().getObject(),
							followupType : sBtnText
						}, oBundle = oCUF.getResourceBundle();
						oCU.Util.requestBusyDialog();
						switch (sBtnText) {
						case oBundle.getText("S4_BUTTONS_FOLLOWUPTOTASK"):
							sPath = "TaskFollowupTransTypes";
							break;
						case oBundle.getText("S4_BUTTONS_FOLLOWUPTOOPPT"):
							sPath = "OpptFollowupTransTypes";
							break;
						case oBundle.getText("S4_BUTTONS_FOLLOWUPTOAPPT"):
							sPath = "AppFollowupTransTypes";
							break;
						default:
							/**
							 * @ControllerHook Provision for implementing own
							 *                 logic to create a follow-up
							 *                 document or object. The list of
							 *                 follow-up transaction types, if
							 *                 more than one, are listed in a
							 *                 dialog. If there is just one
							 *                 transaction type, the user can be
							 *                 directed to the Fiori app that
							 *                 allows creation of such a
							 *                 document. This is called when the
							 *                 user selects the type of
							 *                 follow-up document that the user
							 *                 would like to create. The hook
							 *                 must be documented like:
							 * 
							 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookCreateFollowupObject
							 * @param {object}
							 *            oEvent Event triggered when selecting
							 *            the type of follow up object to create
							 * @return {void}
							 */
							if (this.extHookCreateFollowupObject)
								this.extHookCreateFollowupObject(oEvent);
							break;
						}
						if (sPath) {
							// sPath += "?Guid=guid'" + oCO.curTask.Guid
							// + "'&TransactionType='"
							// + oCO.curTask.TransactionType + "'";
							var aTransactionTypes = undefined, oProcType = {
								key : "",
								value : "",
								privateEnabled : "",
							}, fnSuccessFT = function(oData, oResponse) {
								aTransactionTypes = oData.results;
								cus.crm.mytasks.util.Util.releaseBusyDialog();
							}, fnErrorFT = function(oCurObject, oError) {
								var oCU = cus.crm.mytasks.util, oCUS = oCU.Schema, oRB = oCU.Formatter
										.getResourceBundle(), sMsg = [ "'",
										oCurObject.curTask.Description, "'" ]
										.join(""), oFollowup = {
									sv : oCUS.getServiceVersion(),
									ssv : oCUS.getServiceSchemaVersion(),
									msg : oRB.getText("FOLLOWUP_ERROR_MSG",
											[ sMsg ])
								};
								oCU.Util.onRequestFailed(oError,
										"Operation Failed: Read Transaction Types for '"
												+ oCurObject.followupType
												+ "'.", oFollowup);
							}, mParams = {
								Guid : oModel.formatValue(
										oCurObject.curTask.Guid, oCUF.EDM_GUID),
								TransactionType : oModel.formatValue(
										oCurObject.curTask.TransactionType,
										oCUF.EDM_STRING)
							};
							oModel.read(sPath, null, mParams, false, jQuery
									.proxy(fnSuccessFT, this), jQuery.proxy(
									fnErrorFT, this, oCurObject));
							// CallFunction is always asynchronous
							// oModel
							// .callFunction(
							// sPath,
							// "GET",
							// {
							// Guid : oCO.curTask.Guid,
							// TransactionType : oCO.curTask.TransactionType
							// }, null, jQuery.proxy(fnSuccessFT,
							// this), jQuery.proxy(
							// fnErrorFT, this, sPT),
							// false);
							if (!this._oDlFollowupTT) {
								this._oDlFollowupTT = new sap.ui.xmlfragment(
										"cus.crm.mytasks.view.FollowupDialog",
										this);
								this._oDlFollowupTT.setModel(oView
										.getModel("i18n"), "i18n");
							}
							if (Array.isArray(aTransactionTypes))
								if (aTransactionTypes.length == 1) {
									oProcType.key = aTransactionTypes[0].ProcessTypeCode;
									oProcType.value = aTransactionTypes[0].Description;
									oProcType.privateEnabled = aTransactionTypes[0].PrivateFlag;
								} else {
									this._oDlFollowupTT.setModel(
											new sap.ui.model.json.JSONModel(
													aTransactionTypes),
											"FollowupTypes");
									this._oDlFollowupTT._sFollowupType = oCurObject.followupType;
									this._oDlFollowupTT.open();
								}
							if (oProcType.key !== "")
								this._onSelectedFollowUpType(oProcType,
										oCurObject);
						} else
							jQuery.sap.log
									.debug("## Incorrect way to perform a Follow up ##");
					},

					liveSearchFollowUpType : function(oEvent) {
						var sVal = oEvent.getParameter("value");
						if (sVal.length == 0 || (sVal && sVal.length > 3))
							this._commonSearchForFollowUpType(sVal, [], oEvent
									.getParameter("itemsBinding"));
					},

					searchFollowUpType : function(oEvent) {
						var sVal = oEvent.getParameter("value");
						this._commonSearchForFollowUpType(sVal, [], oEvent
								.getParameter("itemsBinding"));
					},

					_commonSearchForFollowUpType : function(sVal, aFilter,
							itemsBinding) {
						if (sVal !== "")
							aFilter
									.push(new sap.ui.model.Filter(
											"Description",
											sap.ui.model.FilterOperator.Contains,
											sVal));
						itemsBinding.aApplicationFilters = [];
						itemsBinding.filter(aFilter,
								sap.ui.model.FilterType.Application);

					},

					selectFollowUpType : function(oEvent) {
						var oContext = this.getView().getBindingContext(), oCT = oContext
								.getObject(), oSI = oEvent
								.getParameter("selectedItem"), oCO = {
							curTask : oCT,
							followupType : oEvent.getSource()._sFollowupType
						}, oProcType = {
							key : oSI.getDescription(),
							value : oSI.getTitle(),
							privateEnabled : oSI.data("PrivacyAllowed")
						};
						this._onSelectedFollowUpType(oProcType, oCO);
					},

					_onSelectedFollowUpType : function(oProcType, oCO) {
						var oBundle = cus.crm.mytasks.util.Formatter
								.getResourceBundle(), oContext = this.getView()
								.getBindingContext(), aStrIds = [
								"S4_BUTTONS_FOLLOWUPTOTASK",
								"S4_BUTTONS_FOLLOWUPTOOPPT",
								"S4_BUTTONS_FOLLOWUPTOAPPT" ], aChecks = [];
						for ( var i = 0; i < aStrIds.length; i++)
							aChecks.push(oBundle.getText(aStrIds[i]));

						switch (oCO.followupType) {
						case aChecks[0]:
							this.oParamsToPass = {
								FUT : "X",
								AccountID : oCO.curTask.AccountId,
								AccountName : oCO.curTask.AccountName,
								Note : oCO.curTask.Note,
								ContactID : oCO.curTask.ContactId,
								ContactName : oCO.curTask.ContactName,
								priority : oCO.curTask.Priority,
								title : oCO.curTask.Description,
								taskId : oCO.curTask.Id,
								taskGuid : oCO.curTask.Guid,
								ProcessTypeDescription : oProcType.value,
								privateFlag : oProcType.privateEnabled,
							};

							// WAVE 7 ENHANCEMENT
							this.oRouter.navTo("newTask", {
								processType : oProcType.key
							});
							break;
						case aChecks[1]:
						case aChecks[2]:
							var sSemanticObject = undefined, sAction = undefined, sAppSpecificRoute = undefined, oParamsToPass = undefined;
							if (oCO.followupType === aChecks[1]) {
								sSemanticObject = "Opportunity";
								sAction = "manageOpportunity";
								sAppSpecificRoute = [ "&", "followupfromtask",
										oContext.getPath().substr(1),
										oProcType.key ].join("/");
								oParamsToPass = {
									FUO : "X",
									AccountID : oCO.curTask.AccountId,
									ContactID : oCO.curTask.ContactId,
									title : oCO.curTask.Description,
									taskId : oCO.curTask.Id,
									taskGuid : oCO.curTask.Guid,
								};
							} else {
								sSemanticObject = "Appointment";
								sAction = "myAppointments";
								sAppSpecificRoute = [
										"&",
										"newappointmentfromtask",
										(new Date()).toJSON().split("T")[0]
												.replace(/-/g, ""),
										oProcType.key ].join("/");
								oParamsToPass = {
									FUA : "X",
									AccountID : oCO.curTask.AccountId,
									ContactID : oCO.curTask.ContactId,
									title : oCO.curTask.Description,
									taskId : oCO.curTask.Id,
									taskGuid : oCO.curTask.Guid,
								};
							}
							var fGetService = sap
									&& sap.ushell
									&& sap.ushell.Container
									&& sap.ushell.Container.getService
									&& sap.ushell.Container
											.getService("CrossApplicationNavigation");
							var sLoc = fGetService.hrefForExternal({
								target : {
									semanticObject : sSemanticObject,
									action : sAction
								},
								params : oParamsToPass,
								appSpecificRoute : sAppSpecificRoute
							}) || "";
							window.location = sLoc;
							break;
						}
						// var message = oBundle.getText("FOLLOWUP_COMPLETED");
						// sap.m.MessageToast.show(message, {
						// closeOnBrowserNavigation : false
						// });
					},

					_getOverviewTask : function(bHasETagErrorOccurred) {
						var oCU = cus.crm.mytasks.util, fnBindingOverviewTask, oView = this
								.getView(), mParams, oContext = oView
								.getBindingContext();
						if (bHasETagErrorOccurred) {
							jQuery.sap.log
									.debug("S4 page called again due to ETag mismatch");
							oContext.getModel().deleteCreatedEntry(oContext);
							mParams = null;
							fnBindingOverviewTask = function(oContext) {
								if (oContext) {
									this.getView().bindElement(
											oContext.getPath());
									this.oOverviewTask = oContext.getObject();
									this
											.initializeOverviewPage(this.oOverviewTask);
								}
							};
						} else {
							jQuery.sap.log.debug("S4 page called via bookmark");
							// TODO: Provide hooks for additional oData calls
							if (oCU.Schema.getServiceVersion() == 1
									&& oCU.Schema.getServiceSchemaVersion() >= 4) {
								mParams = {
									expand : [ oCU.Attachments.NAVLINK,
											oCU.DocumentHistory.NAVLINK,
											"TaskLogSet", "TaskStatuses" ]
											.join(",")
								};
								oView.byId("attachmentOverview").setBusy(true);
								oView.byId("tabDocHistory").setBusy(true);
							} else
								mParams = null;
							fnBindingOverviewTask = function(oContext) {
								if (oContext) {
									var oCUAtt = oCU.Attachments, oCUS = oCU.Schema, oView = this
											.getView(), aNavLinks = [], aDummy = [], oParams = undefined, oCUDoc = oCU.DocumentHistory;
									oView.bindElement(oContext.getPath());
									this.oOverviewTask = oContext.getObject();
									if (oCUS.getServiceVersion() == 1
											&& oCUS.getServiceSchemaVersion() >= 4) {
										aNavLinks = [ oCU.Attachments.NAVLINK,
												oCU.DocumentHistory.NAVLINK,
												"TaskLogSet", "TaskStatuses" ];
										if (this.oOverviewTask.Etag !== this._sETag) {
											aDummy = this.oOverviewTask.__metadata.etag
													.split("'");
											if (aDummy.length > 1) {
												aDummy
														.splice(1, 1,
																this._sETag);
												this.oOverviewTask.Etag = this._sETag;
												this.oOverviewTask.__metadata.etag = aDummy
														.join("'");
											}
										}
										this._sETag = "";
									}
									for ( var i = 0; i < aNavLinks.length; i++) {
										oParams = {
											bExpandCall : true,
											curResults : this.oOverviewTask[aNavLinks[i]]["__list"]
										};
										switch (i) {
										case 0:
											oView.byId("attachmentOverview")
													.setBusy(false);
											oCUAtt.OverviewPage.bindData(this,
													oParams);
											break;
										case 1:
											oView.byId("tabDocHistory")
													.setBusy(false);
											oCUDoc.bindDataToTable(this,
													oParams);
											break;
										case 2:
											this.bindTaskErrors(oParams);
											break;
										case 3:
											oCU.StatusListUtil
													.bindStatusValuesToTask(
															oContext.getModel(),
															oParams);
											break;
										default:
											break;
										}
									}
									this.bIsBookmarkUsed = true;
									this
											.initializeOverviewPage(this.oOverviewTask);
								}
							};
						}
						oContext.getModel().createBindingContext(
								oContext.getPath(), null, mParams,
								jQuery.proxy(fnBindingOverviewTask, this),
								false);
					},

					_checkFor412StatusCode : function(oError, sLogMsg) {
						var oCU = cus.crm.mytasks.util, oBundle = oCU.Formatter
								.getResourceBundle();
						if (oError.response.statusCode === "412") {
							jQuery.sap.log.debug("412 error occurred during"
									+ sLogMsg);
							var fnClose = function(oAction) {
								jQuery.sap.log
										.debug("S4 page called again due to ETag mismatch");
								var oCUU = cus.crm.mytasks.util.Util;
								oCUU.requestBusyDialog();
								this.oOverviewTask = undefined;
								this._getOverviewTask(true);
								oCUU.releaseBusyDialog();
							}, mOptions = {
								icon : sap.m.MessageBox.Icon.ERROR,
								title : oBundle.getText("S3_412_TITLE"),
								actions : [ sap.m.MessageBox.Action.OK ],
								onClose : jQuery.proxy(fnClose, this),
							};
							sap.m.MessageBox.show(oBundle
									.getText("S3_412_ERRORMSG"), mOptions);
							oCU.Util.releaseBusyDialog();
						} else {
							if (this.navFromAccounts || this.bIsBookmarkUsed) {
								var aDummy = sap.ushell.Container.getService(
										"URLParsing").getHash(location).split(
										"/"), oView = this.getView(), oContext = new sap.ui.model.Context(
										oView.getModel(), '/'
												+ aDummy[aDummy.length - 1]);
								oView.setBindingContext(oContext);
							}
							oCU.Util.onRequestFailed(oError, sLogMsg);
						}
					},

					navToRelatedDocument : function(oEvent) {
						var bNavToWithinTasks = false, oDocHistoryTable = this
								.getView().byId("tabDocHistory"), sTransactionID = oEvent
								.getSource().getText(), aDummy = [], aTransactionData = oDocHistoryTable
								.getModel("docHistory").getProperty(
										"/transactions"), sLocation = "";
						for ( var i = -1, oCurDocument; oCurDocument = aTransactionData[++i];)
							if (oCurDocument.ObjectId === sTransactionID) {
								if (oCurDocument.bWithinApp)
									bNavToWithinTasks = true;
								sLocation = oCurDocument.navToURL;
								break;
							}
						if (bNavToWithinTasks) {
							aDummy = sLocation.split("/");
							this.oRouter.navTo(aDummy[1], {
								contextPath : aDummy[2]
							});
						} else
							window.location = sLocation;
					},

					// START of TASK ERRORS
					showTaskErrors : function(oEvent) {
						this._oDlTaskErrors.open();
					},

					closeErrorMsg : function(oEvent) {
						this._oDlTaskErrors.close();
					},

					_addTaskErrorObject : function(oTaskError) {
						var oObject = {};
						jQuery.extend(oObject, oTaskError, true);
						switch (oObject.LogType) {
						case "E":
							oObject.Icon = "sap-icon://error";
							oObject.IconColor = "red";
							break;
						case "W":
							oObject.Icon = "sap-icon://warning";
							oObject.IconColor = "orange";
							break;
						default:
							oObject.Icon = "sap-icon://hint";
							oObject.IconColor = "gray";
							break;
						}
						return oObject;
					},

					bindTaskErrors : function(oParams) {
						if (oParams) {
							var oTempState = {}, oModel = this.getView()
									.getModel();
							if (oParams.bExpandCall) {
								oTempState.paths = oParams.curResults || [];
								oTempState.controlval = [];
								for ( var i = -1, sPath; sPath = oTempState.paths[++i];)
									oTempState.controlval.push(this
											._addTaskErrorObject(oModel
													.getObject('/' + sPath)));
							} else {
								oTempState.paths = [];
								oTempState.controlval = [];
								var aDummy = undefined, sPath = undefined;
								for ( var i = -1, oCurObject; oCurObject = oParams.curResults[++i];) {
									aDummy = oCurObject.__metadata.id
											.split("/");
									oTempState.controlval.push(this
											._addTaskErrorObject(oCurObject));
									sPath = aDummy[aDummy.length - 1];
									oTempState.paths.push(sPath);
								}
							}
							var jsonModel = new sap.ui.model.json.JSONModel({
								list : oTempState.controlval
							}), sTitle = cus.crm.mytasks.util.Formatter
									.getResourceBundle().getText(
											"S4_MESSAGES_TITLE",
											[ oTempState.controlval.length ]);

							this.setBtnEnabled("error",
									!(oTempState.controlval.length === 0));
							if (!this._oDlTaskErrors) {
								// error Message
								this._oDlTaskErrors = new sap.ui.xmlfragment(
										"cus.crm.mytasks.view.ErrorMessageDialog",
										this);
								this._oDlTaskErrors.setModel(this.getView()
										.getModel("i18n"), "i18n");
								if (sap.ui.Device.system.desktop
										|| sap.ui.Device.system.tablet)
									this._oDlTaskErrors
											.setContentWidth("30rem");
							}
							this._oDlTaskErrors.setModel(jsonModel, "TaskLogs");
							this._oDlTaskErrors.setTitle(sTitle);
						}
					}
				// END of TASK ERRORS
				});
},
	"cus/crm/mytasks/view/S4.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc"\n\txmlns="sap.m" xmlns:caui="sap.ca.ui" controllerName="cus.crm.mytasks.view.S4"\n\txmlns:html="http://www.w3.org/1999/xhtml">\n\t<Page id="taskOverview" title="{Description}">\n\t\t<content>\n\t\t\t<!-- Provision to modify the task header information entirely -->\n\t\t\t<core:ExtensionPoint name="extTaskOverview">\n\t\t\t\t<ObjectHeader id="ohdetail" title="{Description}"\n\t\t\t\t\ttitleActive="false" icon="sap-icon://activity-2"\n\t\t\t\t\tnumberState="{parts:[\'DueDate\', \'Completed\'], formatter: \'cus.crm.mytasks.util.Formatter.showDueDateStatus\'}"\n\t\t\t\t\tnumber="{parts:[\'DueDate\', \'Completed\'], formatter: \'cus.crm.mytasks.util.Formatter.showDueDateInDays\'}">\n\t\t\t\t\t<statuses>\n\t\t\t\t\t\t<ObjectStatus id="osPrio"\n\t\t\t\t\t\t\ttext="{path:\'Priority\', formatter:\'cus.crm.mytasks.util.Formatter.showCurrentPriority\'}"\n\t\t\t\t\t\t\tstate="{parts:[\'Priority\', \'Completed\'], formatter: \'cus.crm.mytasks.util.Formatter.showPriorityStatus\'}" />\n\t\t\t\t\t\t<ObjectStatus id="osStatus" text="{UserStatustext}"\n\t\t\t\t\t\t\tstate="{parts:[\'DueDate\', \'Completed\'], formatter: \'cus.crm.mytasks.util.Formatter.showDueDateStatus\'}" />\n\t\t\t\t\t\t<ObjectStatus id="osPrivate"\n\t\t\t\t\t\t\ticon="{path:\'Private\', formatter: \'cus.crm.mytasks.util.Formatter.showPrivacyFlag\'}" />\n\t\t\t\t\t</statuses>\n\t\t\t\t\t<attributes>\n\t\t\t\t\t\t<ObjectAttribute id="oaTaskType" active="false"\n\t\t\t\t\t\t\ttext="{parts:[\'i18n>S4_TASK_TYPE\', \'ProcessTypeDescription\'], formatter: \'cus.crm.mytasks.util.Formatter.formatOverviewField\'}" />\n\t\t\t\t\t\t<ObjectAttribute id="oaDueDate" active="false"\n\t\t\t\t\t\t\ttext="{parts:[\'i18n>S4_TASK_DUEDATE\', \'DueDate\'], formatter: \'cus.crm.mytasks.util.Formatter.formatOverviewField\'}" />\n\t\t\t\t\t\t<ObjectAttribute id="oaAccount" active="true"\n\t\t\t\t\t\t\ttext="{parts:[\'i18n>S4_TASK_ACCOUNT\', \'AccountName\', \'AccountId\'], formatter: \'cus.crm.mytasks.util.Formatter.formatOverviewField\'}"\n\t\t\t\t\t\t\tpress="showAccountOverview" />\n\t\t\t\t\t\t<ObjectAttribute id="oaContact" active="true"\n\t\t\t\t\t\t\ttext="{parts:[\'i18n>S4_TASK_CONTACT\', \'ContactName\', \'ContactId\'], formatter: \'cus.crm.mytasks.util.Formatter.formatOverviewField\'}"\n\t\t\t\t\t\t\tpress="showContactOverview" />\n\t\t\t\t\t</attributes>\n\t\t\t\t</ObjectHeader>\n\t\t\t\t<Panel id="notesData" expandable="false" headerText="{i18n>S4_TASK_NOTES}">\n\t\t\t\t\t<content>\n\t\t\t\t\t\t<TextArea id="notesS4" rows="4" editable="false" value="{Note}"\n\t\t\t\t\t\t\twidth="100%" />\n\t\t\t\t\t</content>\n\t\t\t\t</Panel>\n\t\t\t</core:ExtensionPoint>\n\t\t\t<!-- Show additional info of task before the Attachments Panel -->\n\t\t\t<core:ExtensionPoint name="extBeforeAttachments" />\n\t\t\t<Panel id="attachmentData" expandable="true" expanded="false"\n\t\t\t\theaderText="{i18n>S4_TASK_ATTACHMENTS}">\n\t\t\t\t<content>\n\t\t\t\t\t<caui:FileUpload id="attachmentOverview" items="/Attachments"\n\t\t\t\t\t\tuploadUrl="" fileName="name" size="size" url="url" uploadedDate="uploadedDate"\n\t\t\t\t\t\tcontributor="contributor" mimeType="mimeType" uploadEnabled="false"\n\t\t\t\t\t\tfileId="fileId" useMultipart="false" acceptRequestHeader="application/json"\n\t\t\t\t\t\trenameEnabled="false" showNoData="true" useEditControls="false">\n\t\t\t\t\t</caui:FileUpload>\n\t\t\t\t</content>\n\t\t\t</Panel>\n\t\t\t<!-- Show additional info of task before the Document History Panel -->\n\t\t\t<core:ExtensionPoint name="extBeforeDocHistory" />\n\t\t\t<Panel id="transactionHistoryData" expandable="true" expanded="false"\n\t\t\t\theaderText="{i18n>S4_TASK_DOCHISTORY}">\n\t\t\t\t<content>\n\t\t\t\t\t<!-- Add user specific transaction history view for a given task -->\n\t\t\t\t\t<core:ExtensionPoint name="extDHExtraView" />\n\t\t\t\t\t<Table id="tabDocHistory" inset="false" items="{docHistory>/transactions}"\n\t\t\t\t\t\tnoDataText="{i18n>S4_NO_DOCHISTORY}" fixedLayout="false" growing="true"\n\t\t\t\t\t\tgrowingThreshold="10" growingScrollToLoad="false">\n\t\t\t\t\t\t<columns>\n\t\t\t\t\t\t\t<!-- Additional column labels to be displayed when the user view the \n\t\t\t\t\t\t\t\ttransaction history of a task -->\n\t\t\t\t\t\t\t<core:ExtensionPoint name="extDHLabelsStart" />\n\t\t\t\t\t\t\t<Column minScreenWidth="Tablet" demandPopin="true" hAlign="Center">\n\t\t\t\t\t\t\t\t<Text id="transColID" text="{i18n>S4_DOCHISTORY_ID}" />\n\t\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t\t<Column minScreenWidth="Tablet" demandPopin="true" hAlign="Center">\n\t\t\t\t\t\t\t\t<Text id="transColType" text="{i18n>S4_DOCHISTORY_TTYPE}" />\n\t\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t\t<Column minScreenWidth="Tablet" demandPopin="true" hAlign="Center">\n\t\t\t\t\t\t\t\t<Text id="transColDescription" text="{i18n>S4_DOCHISTORY_DESC}" />\n\t\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t\t<Column minScreenWidth="Tablet" demandPopin="true" hAlign="Center">\n\t\t\t\t\t\t\t\t<Text id="transColCreatedOn" text="{i18n>S4_DOCHISTORY_CREATEDDATE}" />\n\t\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t\t<Column minScreenWidth="Tablet" demandPopin="true" hAlign="Center">\n\t\t\t\t\t\t\t\t<Text id="transColRelationship" text="{i18n>S4_DOCHISTORY_RELTYPE}" />\n\t\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t\t<!-- Additional column labels to be displayed when the user view the \n\t\t\t\t\t\t\t\ttransaction history of a task -->\n\t\t\t\t\t\t\t<core:ExtensionPoint name="extDHLabelsEnd" />\n\t\t\t\t\t\t</columns>\n\t\t\t\t\t\t<items>\n\t\t\t\t\t\t\t<ColumnListItem>\n\t\t\t\t\t\t\t\t<cells>\n\t\t\t\t\t\t\t\t\t<!-- Additional column cells to be displayed when the user view \n\t\t\t\t\t\t\t\t\t\tthe transaction history of a task -->\n\t\t\t\t\t\t\t\t\t<core:ExtensionPoint name="extDHValuesStart" />\n\t\t\t\t\t\t\t\t\t<Link id="transID" text="{docHistory>ObjectId}" press="navToRelatedDocument"\n\t\t\t\t\t\t\t\t\t\tenabled="{docHistory>enableLink}" />\n\t\t\t\t\t\t\t\t\t<Text id="transType" text="{docHistory>ProcessTypeDescription}" />\n\t\t\t\t\t\t\t\t\t<Text id="transDescription" text="{docHistory>Description}" />\n\t\t\t\t\t\t\t\t\t<Text id="transCreatedOn"\n\t\t\t\t\t\t\t\t\t\ttext="{path: \'docHistory>CreatedAt\', type:\'sap.ca.ui.model.type.Date\', formatOptions:{style:\'medium\'}}" />\n\t\t\t\t\t\t\t\t\t<Text id="transRelationship" text="{docHistory>RelType}" />\n\t\t\t\t\t\t\t\t\t<!-- Additional column cells to be displayed when the user view \n\t\t\t\t\t\t\t\t\t\tthe transaction history of a task -->\n\t\t\t\t\t\t\t\t\t<core:ExtensionPoint name="extDHValuesEnd" />\n\t\t\t\t\t\t\t\t</cells>\n\t\t\t\t\t\t\t</ColumnListItem>\n\t\t\t\t\t\t</items>\n\t\t\t\t\t</Table>\n\t\t\t\t</content>\n\t\t\t</Panel>\n\t\t\t<!-- Show additional info of task at the bottom of the page -->\n\t\t\t<core:ExtensionPoint name="extTaskOverviewEnd" />\n\t\t</content>\n\t</Page>\n</core:View>'
}});
