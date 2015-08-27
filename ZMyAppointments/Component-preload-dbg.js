jQuery.sap.registerPreloadedModules({
"name":"cus/crm/mycalendar/Component-preload",
"version":"2.0",
"modules":{
	"cus/crm/mycalendar/Component.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// define a root UIComponent which exposes the main view
jQuery.sap.declare("cus.crm.mycalendar.Component");

jQuery.sap.require("cus.crm.mycalendar.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

// UI5 Component
sap.ca.scfld.md.ComponentBase.extend("cus.crm.mycalendar.Component",	{
		metadata : sap.ca.scfld.md.ComponentBase.createMetaData("FS",	{
										"name" : "Customer CRM MyCalendar",
										"version" : "1.5.9",
										"library" : "cus.crm.mycalendar",
										"includes" : ["css/app.css"],  
										
										"dependencies" : {
											"libs" : ["sap.m", "sap.me"],
											"components" : []
										},
										
										"config" : {
											"resourceBundle" : "i18n/i18n.properties",
											"titleResource" : "view.Appointment.shelltitle",
											"icon" : "sap-icon://Fiori2/F0005",
											// splash screen images + favorite icons
											"favIcon" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/favicon/F0005_Appointments.ico",

											"homeScreenIconPhone" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0005_My Appointments/57_iPhone_Desktop_Launch.png",
											"homeScreenIconPhone@2" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0005_My Appointments/114_iPhone-Retina_Web_Clip.png",
											"homeScreenIconTablet" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0005_My Appointments/72_iPad_Desktop_Launch.png",
											"homeScreenIconTablet@2" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0005_My Appointments/144_iPad_Retina_Web_Clip.png",

											"startupImage320x460" : "resources/img/startupImages/320x460.png",
											"startupImage640x920" : "resources/img/startupImages/640x920.png",
											"startupImage640x1096" : "resources/img/startupImages/640x1096.png",
											"startupImage768x1004" : "resources/img/startupImages/1004x768.png",
											"startupImage748x1024" : "resources/img/startupImages/1024x748.png",
											"startupImage1536x2008" : "resources/img/startupImages/2008x1536.png",
											"startupImage1496x2048" : "resources/img/startupImages/2048x1496.png"
										},

										viewPath : "cus.crm.mycalendar.view",
										targetControl : "fioriContent",

										"fullScreenPageRoutes" : {
											"start" : {
												pattern : "",
												view : "AppointmentList",
												"viewLevel" : 1
											},
											"month" : {
												pattern : "month/{Date}",
												view : "AppointmentList",
												"viewLevel" : 1
											},
											"month_phone" : {
												pattern : "month_p/{Date}",
												view : "AppointmentList",
												"viewLevel" : 1
											},
											"week" : {
												pattern : "week/{Date}",
												view : "AppointmentList",
												"viewLevel" : 1
											},
											"month/account" : {
												pattern : "month/{Date}/account/{AccountID}",
												view : "AppointmentList",
												"viewLevel" : 1
											},
											"month_phone/account" : {
												pattern : "month_p/{Date}/account/{AccountID}",
												view : "AppointmentList",
												"viewLevel" : 1
											},
											"week/account" : {
												pattern : "week/{Date}/account/{AccountID}",
												view : "AppointmentList",
												"viewLevel" : 1
											},
											"appointment" : {
												pattern : "appointment/{AppointmentID}",
												view : "AppointmentDetail",
												"viewLevel" : 2
											},
											"editappointment" : {
												pattern : "editappointment/{AppointmentID}",
												view : "NewAppointment",
												"viewLevel" : 3
											},
											"followupappointment" : {
												pattern : "followupappointment/{processType}/{AppointmentGuid}/{privateFlag}",
												view : "NewAppointment",
												"viewLevel" : 3
											},
											"newappointment" : {
												pattern : "newappointment/{Date}/{processType}/{privateFlag}",
												view : "NewAppointment",
												"viewLevel" : 3
											},
											"followupappointmentfromtask" : {
												pattern : "newappointmentfromtask/{Date}/{processType}",
												view : "NewAppointment",
												"viewLevel" : 3
											},
											"newappointmentw3" : {
												pattern : "newappointment/{Date}",
												view : "NewAppointment",
												"viewLevel" : 3
											},
											"newappointmentfromoppt" : {
												pattern : "newappointmentfromoppt/{processType}",
												view : "NewAppointment",
												"viewLevel" : 3
											},
											"newappointmentfromnote" : {
												pattern : "newappointmentfromnote/{processType}",
												view : "NewAppointment",
												"viewLevel" : 3
											},
											"newappointmentfromaccount" : {
												pattern : "newappointmentfromaccount/{processType}/{accountContextPath}",
												view : "NewAppointment",
												"viewLevel" : 3
											},
											"catchall" : {
												pattern : ":all*:", // catchall
												view : "AppointmentList",
												"viewLevel" : 1
											}
										}

							}),

					createContent : function() {
			     	// This code is a temporary to call lessifier
						jQuery.sap.require("sap.ca.ui.utils.Lessifier");
						if (sap.ca.ui.utils.Lessifier) {
							sap.ca.ui.utils.Lessifier.lessifyCSS("cus.crm.mycalendar", "/css/appColors.css");
						}
            
						var oViewData = {
							component : this
						};

						this.oMainView = sap.ui.view({
							viewName : "cus.crm.mycalendar.view.Main",
							type : sap.ui.core.mvc.ViewType.XML,
							viewData : oViewData
						});

						this.oMainView.setModel(new sap.ui.model.json.JSONModel({
							apptListController : null,
							
						}),"controllers");
						// pass startup parameter for cross navigation to main view as JSONmodel
						var oModel = new sap.ui.model.json.JSONModel();
						
						var oComponentData = this.getComponentData();
						if (oComponentData) {
							jQuery.sap.log.info("app started with parameters " + JSON.stringify(oComponentData.startupParameters || {}));
							oModel.setData(this.createStartupParametersData(oComponentData.startupParameters || {}));
						}
						this.oMainView.setModel(oModel, "startupParameters");
		
						return this.oMainView;
					},

					createStartupParametersData : function(oComponentData) {
						// convert the raw componentData into a model that is consumed by the UI
						var aParameters = [];
						if (oComponentData) {
							for ( var sKey in oComponentData) {
								aParameters.push({
									key : sKey,
									value : oComponentData[sKey].toString()
								});
							}
						}
						return {
							"parameters" : aParameters
						};
					}

					
				});

},
	"cus/crm/mycalendar/Configuration.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mycalendar.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");
//
sap.ca.scfld.md.ConfigurationBase.extend("cus.crm.mycalendar.Configuration", {

	oServiceParams : {
		serviceList : [ {
			name : "CRM_APPOINTMENT_SRV",
			//masterCollection : "AppointmentSet",
			serviceUrl : "/sap/opu/odata/sap/CRM_APPOINTMENT_SRV/",
			isDefault : true,
			mockedDataSource : "model/metadatamock.xml"
		} ]
	},

	getServiceParams : function() {
		return this.oServiceParams;
	},

	/**
	 * @inherit
	 */
	getServiceList : function() {
		return this.getServiceParams().serviceList;
	},
	
	setApplicationFacade : function(oApplicationFacade) {
		sap.ca.scfld.md.ConfigurationBase.prototype.setApplicationFacade.call(this, oApplicationFacade);
		cus.crm.mycalendar.util.Util.setApplicationFacade(oApplicationFacade);
	}


});

},
	"cus/crm/mycalendar/i18n/i18n.properties":'# Texts for the CRM M Calendar App\n# __ldi.translation.uuid=fbb3dfa0-1959-11e3-8ffd-0800200c9a66\n\n#_YMSG Message other than an instruction \n#_YINS Instruction for a user \n#_XTOL Explanatory text for an UI element, such as a tooltip \n#_XFLD Label for a component other than buttons and titles; sample components: column heading \n#_XBUT Button \n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \n#_XLST Item in an enumeration, such as a list or a drop-down list \n#_XTIT Title or caption \n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \n#_XLNK Hyperlink \n#_XGRP Group header or table section header \n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \n\n\n#XTIT: Title of App\nview.Appointment.apptitle=Appointments\n\n#XTIT: Title of New Appointment screen\nview.Appointment.newapptitle=New Appointment\n\n#XFLD: tooltip  for create new appointment button\nview.Appointment.newapptm_tt=New Appointment\n\n#XTIT: Title of shared calendars\nview.Appointment.sharedCalendars=Shared Calendars\n\n#XBUT: Button text of my calendar\nview.Appointment.mycalendar=MyCalendar\n\n#XTIT: Title of infotoolbar \nview.Appointment.myTeam=My team members \n\n#XTIT: Appointment list description with location,account text and contact text\nview.Appointment.furtherDetails={0} | {1} ({2})\n\n#XTIT: Appointment list description with account text and contact text\nview.Appointment.furtherDetailsWithoutLoc={0} ({1})\n\n#XTIT: Appointment list description with loc  and account text\nview.Appointment.furtherDetailsWithoutContact={0} | {1}\n\n#YMSG: message that will be displayed in case of conflicting data during account editing\nMSG_CONFLICTING_DATA=Data has been changed by another user. Click OK to fetch the latest.\n#XTIT: Appointment list description without loc and cantact text\nview.Appointment.furtherDetailsWithoutContactAndLoc={0}\n\n#XTIT: Title of Timeline\nview.Appointment.Timeline=Timeline\n\n#XTIT: Title of Calendars\nview.Appointment.Calendars=Calendars\n\n#XFLD: tooltip for today button\nview.Appointment.today_tt=Today\n\n#XTIT: Header text of Appointment detail\nview.Appointment.detail=Appointment Detail\n\n#XFLD: Account field label\nview.Appointment.account=Account\n\n#XFLD: Contact field label\nview.Appointment.contact=Contact\n\n#XFLD: Employee Responsible field label\nview.Appointment.employeeResponsible=Employee Responsible\n\n#XFLD: Time field label\nview.Appointment.time=Time\n\n#XFLD: Description field label Subject / description / title\nview.Appointment.subject=Title\n\n#XFLD: Description field label Subject / description / title\nview.Appointment.title=Title\n\n#XFLD: Label for Start date and time\nview.Appointment.startdatetime=Start Date and Time\n\n#XFLD: Label for End date and time\nview.Appointment.enddatetime=End Date and Time\n\n#XFLD: Label for All day checkbox\nview.Appointment.alldayevent=All Day\n\n#YMSG: info message in case appointment occurs in the past\nview.Appointment.occurspast=Appointment occurs in the past\n\n#YMSG: info message in case no title entered\nview.Appointment.notitle=Enter an appointment title\n\n#XFLD: Label for Private checkbox\nview.Appointment.private=Private\n\n#XFLD: Location field label\nview.Appointment.location=Location\n\n#XFLD: Importance field label\nview.Appointment.importance=Importance\n\n#XFLD: Active Status field label\nview.Appointment.activeStatus=Active Status\n\n#XFLD: Notes field label\nview.Appointment.notes=Notes\n\n#XFLD: Note field label\nview.Appointment.note=Note\n\n#XFLD: Label for internal attendees\nview.Appointment.internal=Internal\n\n#XFLD: Label for external attendees\nview.Appointment.external=External\n\n#XGRP: Group header of the section for showing the general data\nview.Appointment.generalData=General\n\n#XGRP: Group header of the section for showing the contact data\nview.Appointment.contactData=Contact\n\n#XGRP: Group header of the section for showing the attendees\nview.Appointment.attendeeData=Attendees\n\n#XGRP: Group header attendees with number\nview.Appointment.attendeeDataNumber=Attendees ({0})\n\n#XGRP: Group header additional attendees with number\nview.Appointment.additionalAttendeeNumber=Additional Attendees ({0})\n\n#XGRP: Group header of the section for showing the details\nview.Appointment.detailData=Details\n\n#XTIT: Group header of the section for showing the details\nview.Appointment.appointmentDetail=Appointment\n#XTIT: Group header of the section for showing the details\nview.Appointment.Opportunity=Opportunity\n#XTIT: Group header of the section for showing the details\nview.Appointment.Task=Task\n\n#XGRP: Group header of the section for showing the details\nview.Appointment.attachmentData=Attachments\n\n#XGRP: Group header attachments with number how many\nview.Appointment.attachmentDataNumber=Attachments ({0})\n\n#XGRP: Group header attachments with request to save the appointment before file upload \nview.Appointment.attachmentSaveRequest=Attachments (Save First Before Uploading Attachments)\n\n#XBUT: Button text to Delete\nview.Appointment.delete=Delete\n\n#XBUT: Button text to Follow up\nview.Appointment.followup=Follow Up\n\n#YMSG: no transaction types  present\nview.Appointment.FOLLOWUPERROR = Either the current appointment has errors or there are no follow up transaction types maintained in the Customizing\n\n#YMSG: success save message in message toast\nview.Appointment.deletesuccess=Appointment deleted\n\n#YMSG: successful followup message in message toast\nview.Appointment.followupsuccessful=Follow up appointment saved\n\n#XBUT: Button text to Edit\nview.Appointment.edit=Edit\n\n#XBUT: Button text to Done\nview.Appointment.done=Done\n\n#XBUT: Button text to Cancel\nview.Appointment.cancel=Cancel\n\n#XBUT: Button text to Cancel\nview.Appointment.ok=OK\n\n#XBUT: Button text to Create\nview.Appointment.create=Create\n\n#YMSG: success save message in message toast\nview.Appointment.savesuccess=Appointment saved\n\n#XBUT: Button text to SAve\nview.Appointment.save=Save\n\n#XBUT: Button text for Day\nview.Appointment.day=Day\n\n#XBUT: Button text for week\nview.Appointment.week=Week\n\n#XBUT: Button text for month\nview.Appointment.month=Month\n\n#XFLD: loading text for the appointment list\nview.Appointment.loaddatatext=Loading...\n\n#XTIT: title of account search popup enhanced with total count\nview.Appointment.acsea_title=Accounts ({0})\n\n#XFLD: empty list text for account search popup\nview.Appointment.acsea_nodata=No Accounts found\n\n#XFLD: placeholdertext for search fields\nview.Appointment.searchfieldplaceholder=Search\n\n#XFLD: placeholdertext for search busy text\nview.Appointment.searchlistinfo=Searching...\n\n#XTIT: title of account search popup enhanced with total count\nview.Appointment.consea_title=Contacts ({0})\n\n#XTIT: title of the business card for accounts\nview.Appointment.account_title=Account\n\n#XTIT: title of the business card for employee\nview.Appointment.employee_title=Employee\n\n#XTIT: title of the business card for employee\nview.Appointment.contact_title=Contact\n\n#XFLD: empty list text for account search popup\nview.Appointment.consea_nodata=No Contacts found\n\n#XFLD: empty list text for account search popup\nview.Appointment.empsea_nodata=No Employees found\n\n#XTIT: title of internal attendees search popup\nview.Appointment.internal_title=Internal Attendees ({0})\n\n#XTIT: title of external attendees search popup\nview.Appointment.external_title=External Attendees ({0})\n\n#XTIT: title of internal attendees search popup enhanced with total count\nview.Appointment.internal_titlenew=New Internal Attendees ({0})\n\n#XTIT: title of external attendees search popup enhanced with total count\nview.Appointment.external_titlenew=New External Attendees ({0})\n\n#YMSG: Filtered by info bar text for contact search popup\nview.Appointment.filteredby=Filtered by\n\n#YMSG: filter line for cross navigation: Filter by Account \nview.Appointment.filteraccount=Filtered by Account\n\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\nview.Appointment.duration.min={0} min\n\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\nview.Appointment.duration.hour={0} h\n\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\nview.Appointment.duration.day={0} day\n\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\nview.Appointment.duration.days={0} days\n\n#XTIT: Button text to Delete \nview.Appointment.deleteTitle=Delete \n \n#YINS: Text for Pop Up action.  User to react (Yes/No) \nview.Appointment.deleteInstruction=Delete this appointment? \n \n#XBUT: User to react (positive) to delete action \nview.Appointment.deleteYes=Ok\n\n#XFLD: placeholder text for fiels adding external attendees\nview.Appointment.attexternaladd=Add external attendee\n\n#XFLD: placeholder text for fiels adding internal attendees\nview.Appointment.attinternaladd=Add a colleague\n\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\nview.Appointment.fromTimeDate=From {0} {1}\n\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\nview.Appointment.toTimeDate=To {0} {1}\n\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\nview.Appointment.timeToTime={0} to {1}\n\n#XFLD: empty appointment list text \nview.Appointment.appointment_nodata=No Appointments\n\n#XFLD: employee fullname: {0} firstname {1} lastname\nview.Appointment.employeename= {0} {1}\n\n#XTIT: Title for Edit Appointment page\nview.Appointment.editappointment=Edit Appointment\n\n#YMSG: Error when end time is before start time (on same day)\nview.Appointment.wrongTimes=End time is before start time\n\n#YMSG: Error when end date is before start date\nview.Appointment.wrongDates=End date is before start date\n\n#XBUT: Button text for Add Button\nview.Appointment.add=Add\n\n#XTIT: Shell Title of App\nview.Appointment.shelltitle=My Appointments\n\n#XFLD: empty list text for external attendee popup\nview.Appointment.noextattendees=No external attendees\n\n#XFLD: empty list text for internal attendee popup\nview.Appointment.nointattendees=No internal attendees\n\n# XFLD: Only your tasks are displayed\nLIST_FILTERED_BY_MYITEMS=Only your appointments are displayed \n\n#YMSG: info message in case edit page is left with back and data changed\nview.Appointment.leaveeditmessage=Your entries will be lost if you leave this page. Do you want to continue?\n\n#YMSG: info message in case of wrong format of Start Date\nview.Appointment.validStartDate=Enter a valid Start Date\n\n#YMSG: info message in case of wrong format of End Date\nview.Appointment.validEndDate=Enter a valid End Date\n\n#YMSG: info message in case of wrong format of Start Date and End Date\nview.Appointment.validStartEndDate=Enter a valid Start Date and End Date\n\n#XTIT: Title for Process type dialog\nview.Appointment.process_type=Select Transaction Type\n\n#XFLD: No Data text when loading/searching list\nview.Appointment.no_data_text=No items are currently available\n\n#XFLD: Transaction Type\nview.Appointment.TransactionType= Type\n\n#YMSG : PRIVATE appointment message\nview.Appointment.privateMessage=This is a private message\n\n#XFLD: Title for private appointment in shared calendar\nview.Appointment.privateAppointment=Private appointment\n#XTIT: this is the title for the Transaction History Tab\nTRANS_HISTORY=Transaction History\n\n#XFLD, 30: Field Transaction ID on List\nTRANS_ID=Transaction ID\n\n#XFLD, 30: Field Transaction Type on List\nTRANS_TYPE=Transaction Type\n\n#XFLD, 30: Field Description on List\nTRANS_DESC=Description\n\n#XFLD, 30: Field Created On on List\nCREATED_ON=Created On\n\n#XFLD, 30: Field Created On on List\nRELATIONSHIP=Relation Type\n\n#XFLD, 15: Priority label\nview.Appointment.priority=Priority\n\n#YMSG, 50:Customizing incomplete\nCUSTOMIZING_INCOMPLETE=Customizing Incomplete. Please contact system administrator\n\n#XBUT: Button text to Messages\nview.Appointment.messages=Messages\n\n#XGRP: Error message dialog title\nview.Appointment.errorMessage=Messages ({0})\n\n#YMSG: contact not assigned to this account\nNOT_IN_MAIN_CONTACT =You can only view business cards of contacts that has been assigned to this account',
	"cus/crm/mycalendar/i18n/i18n_ar.properties":'\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n\r\n#XTIT: Title of App\r\nview.Appointment.apptitle=\\u0627\\u0644\\u0645\\u0648\\u0627\\u0639\\u064A\\u062F\r\n\r\n#XTIT: Title of New Appointment screen\r\nview.Appointment.newapptitle=\\u0645\\u0648\\u0639\\u062F \\u062C\\u062F\\u064A\\u062F\r\n\r\n#XFLD: tooltip  for create new appointment button\r\nview.Appointment.newapptm_tt=\\u0645\\u0648\\u0639\\u062F \\u062C\\u062F\\u064A\\u062F\r\n\r\n#XTIT: Title of shared calendars\r\nview.Appointment.sharedCalendars=\\u0627\\u0644\\u062A\\u0642\\u0648\\u064A\\u0645\\u0627\\u062A \\u0627\\u0644\\u0645\\u0634\\u062A\\u0631\\u0643\\u0629\r\n\r\n#XBUT: Button text of my calendar\r\nview.Appointment.mycalendar=\\u0627\\u0644\\u062A\\u0642\\u0648\\u064A\\u0645 \\u0627\\u0644\\u062E\\u0627\\u0635 \\u0628\\u064A\r\n\r\n#XTIT: Title of infotoolbar \r\nview.Appointment.myTeam=\\u0623\\u0639\\u0636\\u0627\\u0621 \\u0641\\u0631\\u064A\\u0642\\u064A\r\n\r\n#XTIT: Appointment list description with location,account text and contact text\r\nview.Appointment.furtherDetails={0} | {1} ({2})\r\n\r\n#XTIT: Appointment list description with account text and contact text\r\nview.Appointment.furtherDetailsWithoutLoc={0} ({1})\r\n\r\n#XTIT: Appointment list description with loc  and account text\r\nview.Appointment.furtherDetailsWithoutContact={0} | {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=\\u062A\\u0645 \\u062A\\u063A\\u064A\\u064A\\u0631 \\u0627\\u0644\\u0628\\u064A\\u0627\\u0646\\u0627\\u062A \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629 \\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0622\\u062E\\u0631. \\u0627\\u062E\\u062A\\u0631 \'\\u0645\\u0648\\u0627\\u0641\\u0642\' \\u0644\\u0627\\u0633\\u062A\\u0631\\u062C\\u0627\\u0639 \\u0622\\u062E\\u0631 \\u0628\\u064A\\u0627\\u0646\\u0627\\u062A.\r\n#XTIT: Appointment list description without loc and cantact text\r\nview.Appointment.furtherDetailsWithoutContactAndLoc={0}\r\n\r\n#XTIT: Title of Timeline\r\nview.Appointment.Timeline=\\u0627\\u0644\\u0645\\u062E\\u0637\\u0637 \\u0627\\u0644\\u0632\\u0645\\u0646\\u064A\r\n\r\n#XTIT: Title of Calendars\r\nview.Appointment.Calendars=\\u0627\\u0644\\u062A\\u0642\\u0648\\u064A\\u0645\\u0627\\u062A\r\n\r\n#XFLD: tooltip for today button\r\nview.Appointment.today_tt=\\u0627\\u0644\\u064A\\u0648\\u0645\r\n\r\n#XTIT: Header text of Appointment detail\r\nview.Appointment.detail=\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u0645\\u0648\\u0639\\u062F\r\n\r\n#XFLD: Account field label\r\nview.Appointment.account=\\u0627\\u0644\\u0639\\u0645\\u064A\\u0644\r\n\r\n#XFLD: Contact field label\r\nview.Appointment.contact=\\u062C\\u0647\\u0629 \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644\r\n\r\n#XFLD: Employee Responsible field label\r\nview.Appointment.employeeResponsible=\\u0627\\u0644\\u0645\\u0648\\u0638\\u0641 \\u0627\\u0644\\u0645\\u0633\\u0624\\u0648\\u0644\r\n\r\n#XFLD: Time field label\r\nview.Appointment.time=\\u0627\\u0644\\u0648\\u0642\\u062A\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.subject=\\u0627\\u0644\\u0639\\u0646\\u0648\\u0627\\u0646\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.title=\\u0627\\u0644\\u0639\\u0646\\u0648\\u0627\\u0646\r\n\r\n#XFLD: Label for Start date and time\r\nview.Appointment.startdatetime=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0648\\u0648\\u0642\\u062A \\u0627\\u0644\\u0628\\u062F\\u0627\\u064A\\u0629\r\n\r\n#XFLD: Label for End date and time\r\nview.Appointment.enddatetime=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0648\\u0648\\u0642\\u062A \\u0627\\u0644\\u0627\\u0646\\u062A\\u0647\\u0627\\u0621\r\n\r\n#XFLD: Label for All day checkbox\r\nview.Appointment.alldayevent=\\u0637\\u0648\\u0627\\u0644 \\u0627\\u0644\\u064A\\u0648\\u0645\r\n\r\n#YMSG: info message in case appointment occurs in the past\r\nview.Appointment.occurspast=\\u0627\\u0644\\u0645\\u0648\\u0639\\u062F \\u064A\\u0642\\u0639 \\u0641\\u064A \\u0627\\u0644\\u0645\\u0627\\u0636\\u064A\r\n\r\n#YMSG: info message in case no title entered\r\nview.Appointment.notitle=\\u0623\\u062F\\u062E\\u0644 \\u0639\\u0646\\u0648\\u0627\\u0646\\u064B\\u0627\r\n\r\n#XFLD: Label for Private checkbox\r\nview.Appointment.private=\\u062E\\u0627\\u0635\r\n\r\n#XFLD: Location field label\r\nview.Appointment.location=\\u0627\\u0644\\u0645\\u0648\\u0642\\u0639\r\n\r\n#XFLD: Importance field label\r\nview.Appointment.importance=\\u0627\\u0644\\u0623\\u0647\\u0645\\u064A\\u0629\r\n\r\n#XFLD: Active Status field label\r\nview.Appointment.activeStatus=\\u0627\\u0644\\u062D\\u0627\\u0644\\u0629\r\n\r\n#XFLD: Notes field label\r\nview.Appointment.notes=\\u0645\\u0644\\u0627\\u062D\\u0638\\u0627\\u062A\r\n\r\n#XFLD: Note field label\r\nview.Appointment.note=\\u0645\\u0644\\u0627\\u062D\\u0638\\u0627\\u062A\r\n\r\n#XFLD: Label for internal attendees\r\nview.Appointment.internal=\\u062F\\u0627\\u062E\\u0644\\u064A\r\n\r\n#XFLD: Label for external attendees\r\nview.Appointment.external=\\u062E\\u0627\\u0631\\u062C\\u064A\r\n\r\n#XGRP: Group header of the section for showing the general data\r\nview.Appointment.generalData=\\u0628\\u064A\\u0627\\u0646\\u0627\\u062A \\u0639\\u0627\\u0645\\u0629\r\n\r\n#XGRP: Group header of the section for showing the contact data\r\nview.Appointment.contactData=\\u062C\\u0647\\u0629 \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644\r\n\r\n#XGRP: Group header of the section for showing the attendees\r\nview.Appointment.attendeeData=\\u0627\\u0644\\u062D\\u0627\\u0636\\u0631\\u0648\\u0646\r\n\r\n#XGRP: Group header attendees with number\r\nview.Appointment.attendeeDataNumber=\\u0627\\u0644\\u062D\\u0636\\u0648\\u0631 ({0})\r\n\r\n#XGRP: Group header additional attendees with number\r\nview.Appointment.additionalAttendeeNumber=\\u0627\\u0644\\u062D\\u0636\\u0648\\u0631 \\u0627\\u0644\\u0625\\u0636\\u0627\\u0641\\u064A ({0})\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.detailData=\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644\r\n\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.appointmentDetail=\\u0627\\u0644\\u0645\\u0648\\u0639\\u062F\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Opportunity=\\u0627\\u0644\\u0641\\u0631\\u0635\\u0629 \\u0627\\u0644\\u0628\\u064A\\u0639\\u064A\\u0629\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Task=\\u0627\\u0644\\u0645\\u0647\\u0645\\u0629\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.attachmentData=\\u0627\\u0644\\u0645\\u0631\\u0641\\u0642\\u0627\\u062A\r\n\r\n#XGRP: Group header attachments with number how many\r\nview.Appointment.attachmentDataNumber=\\u0627\\u0644\\u0645\\u0631\\u0641\\u0642\\u0627\\u062A ({0})\r\n\r\n#XGRP: Group header attachments with request to save the appointment before file upload \r\nview.Appointment.attachmentSaveRequest=\\u0627\\u0644\\u0645\\u0631\\u0641\\u0642\\u0627\\u062A (\\u062D\\u0641\\u0638 \\u0642\\u0628\\u0644 \\u0627\\u0644\\u062A\\u062D\\u0645\\u064A\\u0644)\r\n\r\n#XBUT: Button text to Delete\r\nview.Appointment.delete=\\u062D\\u0630\\u0641\r\n\r\n#XBUT: Button text to Follow up\r\nview.Appointment.followup=\\u0645\\u062A\\u0627\\u0628\\u0639\\u0629\r\n\r\n#YMSG: no transaction types  present\r\nview.Appointment.FOLLOWUPERROR=\\u0644\\u0645 \\u064A\\u062A\\u0645 \\u0627\\u0644\\u0639\\u062B\\u0648\\u0631 \\u0639\\u0644\\u0649 \\u0623\\u064A\\u0629 \\u0623\\u0646\\u0648\\u0627\\u0639 \\u0645\\u0639\\u0627\\u0645\\u064E\\u0644\\u0627\\u062A. \\u0627\\u0644\\u0631\\u062C\\u0627\\u0621 \\u0641\\u062D\\u0635 \\u062A\\u062E\\u0635\\u064A\\u0635 \\u0627\\u0644\\u0646\\u0638\\u0627\\u0645 \\u0627\\u0644\\u062E\\u0644\\u0641\\u064A \\u0627\\u0644\\u062E\\u0627\\u0635 \\u0628\\u0643.\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.deletesuccess=\\u062A\\u0645 \\u062D\\u0630\\u0641 \\u0627\\u0644\\u0645\\u0648\\u0639\\u062F\r\n\r\n#YMSG: successful followup message in message toast\r\nview.Appointment.followupsuccessful=\\u062A\\u0645 \\u062D\\u0641\\u0638 \\u0645\\u0648\\u0639\\u062F \\u0627\\u0644\\u0645\\u062A\\u0627\\u0628\\u0639\\u0629\r\n\r\n#XBUT: Button text to Edit\r\nview.Appointment.edit=\\u062A\\u062D\\u0631\\u064A\\u0631\r\n\r\n#XBUT: Button text to Done\r\nview.Appointment.done=\\u062A\\u0645\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.cancel=\\u0625\\u0644\\u063A\\u0627\\u0621\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.ok=\\u0645\\u0648\\u0627\\u0641\\u0642\r\n\r\n#XBUT: Button text to Create\r\nview.Appointment.create=\\u0625\\u0646\\u0634\\u0627\\u0621\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.savesuccess=\\u062A\\u0645 \\u062D\\u0641\\u0638 \\u0627\\u0644\\u0645\\u0648\\u0639\\u062F\r\n\r\n#XBUT: Button text to SAve\r\nview.Appointment.save=\\u062D\\u0641\\u0638\r\n\r\n#XBUT: Button text for Day\r\nview.Appointment.day=\\u0627\\u0644\\u064A\\u0648\\u0645\r\n\r\n#XBUT: Button text for week\r\nview.Appointment.week=\\u0627\\u0644\\u0623\\u0633\\u0628\\u0648\\u0639\r\n\r\n#XBUT: Button text for month\r\nview.Appointment.month=\\u0627\\u0644\\u0634\\u0647\\u0631\r\n\r\n#XFLD: loading text for the appointment list\r\nview.Appointment.loaddatatext=\\u062C\\u0627\\u0631\\u064D \\u0627\\u0644\\u062A\\u062D\\u0645\\u064A\\u0644...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.acsea_title=\\u0627\\u0644\\u0639\\u0645\\u0644\\u0627\\u0621 ({0})\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.acsea_nodata=\\u0644\\u0645 \\u064A\\u062A\\u0645 \\u0627\\u0644\\u0639\\u062B\\u0648\\u0631 \\u0639\\u0644\\u0649 \\u0623\\u064A \\u0639\\u0645\\u0644\\u0627\\u0621\r\n\r\n#XFLD: placeholdertext for search fields\r\nview.Appointment.searchfieldplaceholder=\\u0628\\u062D\\u062B\r\n\r\n#XFLD: placeholdertext for search busy text\r\nview.Appointment.searchlistinfo=\\u062C\\u0627\\u0631\\u064D \\u0627\\u0644\\u0628\\u062D\\u062B...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.consea_title=\\u062C\\u0647\\u0627\\u062A \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644 ({0})\r\n\r\n#XTIT: title of the business card for accounts\r\nview.Appointment.account_title=\\u0627\\u0644\\u0639\\u0645\\u064A\\u0644\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.employee_title=\\u0627\\u0644\\u0645\\u0648\\u0638\\u0641\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.contact_title=\\u062C\\u0647\\u0629 \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.consea_nodata=\\u0644\\u0627 \\u062A\\u0648\\u062C\\u062F \\u062C\\u0647\\u0627\\u062A \\u0627\\u062A\\u0635\\u0627\\u0644\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.empsea_nodata=\\u0644\\u0645 \\u064A\\u062A\\u0645 \\u0627\\u0644\\u0639\\u062B\\u0648\\u0631 \\u0639\\u0644\\u0649 \\u0623\\u064A \\u0645\\u0648\\u0638\\u0641\\u064A\\u0646\r\n\r\n#XTIT: title of internal attendees search popup\r\nview.Appointment.internal_title=\\u0627\\u0644\\u062D\\u0636\\u0648\\u0631 \\u0627\\u0644\\u062F\\u0627\\u062E\\u0644\\u064A ({0})\r\n\r\n#XTIT: title of external attendees search popup\r\nview.Appointment.external_title=\\u0627\\u0644\\u062D\\u0636\\u0648\\u0631 \\u0627\\u0644\\u062E\\u0627\\u0631\\u062C\\u064A {0})\r\n\r\n#XTIT: title of internal attendees search popup enhanced with total count\r\nview.Appointment.internal_titlenew=\\u0627\\u0644\\u062D\\u0636\\u0648\\u0631 \\u0627\\u0644\\u062F\\u0627\\u062E\\u0644\\u064A \\u0627\\u0644\\u062C\\u062F\\u064A\\u062F ({0})\r\n\r\n#XTIT: title of external attendees search popup enhanced with total count\r\nview.Appointment.external_titlenew=\\u0627\\u0644\\u062D\\u0636\\u0648\\u0631 \\u0627\\u0644\\u062E\\u0627\\u0631\\u062C\\u064A \\u0627\\u0644\\u062C\\u062F\\u064A\\u062F ({0})\r\n\r\n#YMSG: Filtered by info bar text for contact search popup\r\nview.Appointment.filteredby=\\u062A\\u0645\\u062A \\u0627\\u0644\\u062A\\u0635\\u0641\\u064A\\u0629 \\u062D\\u0633\\u0628\r\n\r\n#YMSG: filter line for cross navigation: Filter by Account \r\nview.Appointment.filteraccount=\\u062A\\u0645\\u062A \\u0627\\u0644\\u062A\\u0635\\u0641\\u064A\\u0629 \\u062D\\u0633\\u0628 \\u0627\\u0644\\u0639\\u0645\\u064A\\u0644\r\n\r\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\r\nview.Appointment.duration.min={0} \\u062F\\u0642\\u064A\\u0642\\u0629 (\\u062F\\u0642\\u0627\\u0626\\u0642)\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\r\nview.Appointment.duration.hour={0} \\u0633\\u0627\\u0639\\u0629 (\\u0633\\u0627\\u0639\\u0627\\u062A)\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.day={0} \\u064A\\u0648\\u0645 (\\u0623\\u064A\\u0627\\u0645)\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.days={0} \\u064A\\u0648\\u0645 (\\u0623\\u064A\\u0627\\u0645)\r\n\r\n#XTIT: Button text to Delete \r\nview.Appointment.deleteTitle=\\u062D\\u0630\\u0641\r\n\r\n#YINS: Text for Pop Up action.  User to react (Yes/No) \r\nview.Appointment.deleteInstruction=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u062D\\u0630\\u0641 \\u0647\\u0630\\u0627 \\u0627\\u0644\\u0645\\u0648\\u0639\\u062F\\u061F\r\n\r\n#XBUT: User to react (positive) to delete action \r\nview.Appointment.deleteYes=\\u0645\\u0648\\u0627\\u0641\\u0642\r\n\r\n#XFLD: placeholder text for fiels adding external attendees\r\nview.Appointment.attexternaladd=\\u0625\\u0636\\u0627\\u0641\\u0629 \\u062D\\u0627\\u0636\\u0631 \\u062E\\u0627\\u0631\\u062C\\u064A\r\n\r\n#XFLD: placeholder text for fiels adding internal attendees\r\nview.Appointment.attinternaladd=\\u0625\\u0636\\u0627\\u0641\\u0629 \\u0632\\u0645\\u064A\\u0644\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.fromTimeDate=\\u0645\\u0646 {0} {1}\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.toTimeDate=\\u0625\\u0644\\u0649 {0} {1}\r\n\r\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\r\nview.Appointment.timeToTime={0} \\u0625\\u0644\\u0649 {1}\r\n\r\n#XFLD: empty appointment list text \r\nview.Appointment.appointment_nodata=\\u0644\\u0627 \\u062A\\u0648\\u062C\\u062F \\u0645\\u0648\\u0627\\u0639\\u064A\\u062F\r\n\r\n#XFLD: employee fullname: {0} firstname {1} lastname\r\nview.Appointment.employeename={0} {1}\r\n\r\n#XTIT: Title for Edit Appointment page\r\nview.Appointment.editappointment=\\u062A\\u062D\\u0631\\u064A\\u0631 \\u0627\\u0644\\u0645\\u0648\\u0639\\u062F\r\n\r\n#YMSG: Error when end time is before start time (on same day)\r\nview.Appointment.wrongTimes=\\u064A\\u0642\\u0639 \\u0648\\u0642\\u062A \\u0627\\u0644\\u0627\\u0646\\u062A\\u0647\\u0627\\u0621 \\u0642\\u0628\\u0644 \\u0648\\u0642\\u062A \\u0627\\u0644\\u0628\\u062F\\u0627\\u064A\\u0629\r\n\r\n#YMSG: Error when end date is before start date\r\nview.Appointment.wrongDates=\\u064A\\u0642\\u0639 \\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0627\\u0646\\u062A\\u0647\\u0627\\u0621 \\u0642\\u0628\\u0644 \\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0628\\u062F\\u0627\\u064A\\u0629\r\n\r\n#XBUT: Button text for Add Button\r\nview.Appointment.add=\\u0625\\u0636\\u0627\\u0641\\u0629\r\n\r\n#XTIT: Shell Title of App\r\nview.Appointment.shelltitle=\\u0645\\u0648\\u0627\\u0639\\u064A\\u062F\\u064A\r\n\r\n#XFLD: empty list text for external attendee popup\r\nview.Appointment.noextattendees=\\u0644\\u0627 \\u064A\\u0648\\u062C\\u062F \\u062D\\u0627\\u0636\\u0631\\u0648\\u0646 \\u062E\\u0627\\u0631\\u062C\\u064A\\u0648\\u0646\r\n\r\n#XFLD: empty list text for internal attendee popup\r\nview.Appointment.nointattendees=\\u0644\\u0627 \\u064A\\u0648\\u062C\\u062F \\u062D\\u0627\\u0636\\u0631\\u0648\\u0646 \\u062F\\u0627\\u062E\\u0644\\u064A\\u0648\\u0646\r\n\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=\\u064A\\u062A\\u0645 \\u0639\\u0631\\u0636 \\u0645\\u0648\\u0627\\u0639\\u064A\\u062F\\u0643 \\u0641\\u0642\\u0637\r\n\r\n#YMSG: info message in case edit page is left with back and data changed\r\nview.Appointment.leaveeditmessage=\\u0633\\u062A\\u0641\\u0642\\u062F \\u0627\\u0644\\u0625\\u062F\\u062E\\u0627\\u0644\\u0627\\u062A \\u0625\\u0630\\u0627 \\u063A\\u0627\\u062F\\u0631\\u062A \\u0647\\u0630\\u0647 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629. \\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0627\\u0644\\u0645\\u062A\\u0627\\u0628\\u0639\\u0629\\u061F\r\n\r\n#YMSG: info message in case of wrong format of Start Date\r\nview.Appointment.validStartDate=\\u0623\\u062F\\u062E\\u0644 \\u062A\\u0627\\u0631\\u064A\\u062E \\u0628\\u062F\\u0627\\u064A\\u0629 \\u0635\\u0627\\u0644\\u062D\\u064B\\u0627\r\n\r\n#YMSG: info message in case of wrong format of End Date\r\nview.Appointment.validEndDate=\\u0623\\u062F\\u062E\\u0644 \\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0646\\u062A\\u0647\\u0627\\u0621 \\u0635\\u0627\\u0644\\u062D\\u064B\\u0627\r\n\r\n#YMSG: info message in case of wrong format of Start Date and End Date\r\nview.Appointment.validStartEndDate=\\u0623\\u062F\\u062E\\u0644 \\u062A\\u0627\\u0631\\u064A\\u062E \\u0628\\u062F\\u0627\\u064A\\u0629 \\u0648\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0646\\u062A\\u0647\\u0627\\u0621 \\u0635\\u0627\\u0644\\u062D\\u0627\\u0646\r\n\r\n#XTIT: Title for Process type dialog\r\nview.Appointment.process_type=\\u062A\\u062D\\u062F\\u064A\\u062F \\u0646\\u0648\\u0639 \\u0627\\u0644\\u0645\\u0639\\u0627\\u0645\\u0644\\u0629\r\n\r\n#XFLD: No Data text when loading/searching list\r\nview.Appointment.no_data_text=\\u0644\\u0627 \\u062A\\u062A\\u0648\\u0641\\u0631 \\u0623\\u064A\\u0629 \\u0639\\u0646\\u0627\\u0635\\u0631 \\u062D\\u0627\\u0644\\u064A\\u064B\\u0627\r\n\r\n#XFLD: Transaction Type\r\nview.Appointment.TransactionType=\\u0627\\u0644\\u0646\\u0648\\u0639\r\n\r\n#YMSG : PRIVATE appointment message\r\nview.Appointment.privateMessage=\\u0647\\u0630\\u0627 \\u0645\\u0648\\u0639\\u062F \\u062E\\u0627\\u0635\r\n\r\n#XFLD: Title for private appointment in shared calendar\r\nview.Appointment.privateAppointment=\\u0645\\u0648\\u0639\\u062F \\u062E\\u0627\\u0635\r\n#XTIT: this is the title for the Transaction History Tab\r\nTRANS_HISTORY=\\u0633\\u062C\\u0644 \\u0627\\u0644\\u0645\\u0639\\u0627\\u0645\\u064E\\u0644\\u0627\\u062A\r\n\r\n#XFLD, 30: Field Transaction ID on List\r\nTRANS_ID=\\u0645\\u0639\\u0631\\u0641 \\u0627\\u0644\\u0645\\u0639\\u0627\\u0645\\u0644\\u0629\r\n\r\n#XFLD, 30: Field Transaction Type on List\r\nTRANS_TYPE=\\u0646\\u0648\\u0639 \\u0627\\u0644\\u0645\\u0639\\u0627\\u0645\\u0644\\u0629\r\n\r\n#XFLD, 30: Field Description on List\r\nTRANS_DESC=\\u0627\\u0644\\u0648\\u0635\\u0641\r\n\r\n#XFLD, 30: Field Created On on List\r\nCREATED_ON=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0625\\u0646\\u0634\\u0627\\u0621\r\n\r\n#XFLD, 30: Field Created On on List\r\nRELATIONSHIP=\\u0646\\u0648\\u0639 \\u0627\\u0644\\u0639\\u0644\\u0627\\u0642\\u0629\r\n\r\n#XFLD, 15: Priority label\r\nview.Appointment.priority=\\u0627\\u0644\\u0623\\u0641\\u0636\\u0644\\u064A\\u0629\r\n\r\n#YMSG, 50:Customizing incomplete\r\nCUSTOMIZING_INCOMPLETE=\\u062A\\u062E\\u0635\\u064A\\u0635 \\u063A\\u064A\\u0631 \\u0645\\u0643\\u062A\\u0645\\u0644. \\u0628\\u0631\\u062C\\u0627\\u0621 \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644 \\u0628\\u0645\\u0633\\u0624\\u0648\\u0644 \\u0627\\u0644\\u0646\\u0638\\u0627\\u0645 \\u0627\\u0644\\u062E\\u0627\\u0635 \\u0628\\u0643.\r\n\r\n#XBUT: Button text to Messages\r\nview.Appointment.messages=\\u0627\\u0644\\u0631\\u0633\\u0627\\u0626\\u0644\r\n\r\n#XGRP: Error message dialog title\r\nview.Appointment.errorMessage=\\u0627\\u0644\\u0631\\u0633\\u0627\\u0626\\u0644 ({0})\r\n\r\n#YMSG: contact not assigned to this account\r\n',
	"cus/crm/mycalendar/i18n/i18n_bg.properties":'\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n\r\n#XTIT: Title of App\r\nview.Appointment.apptitle=\\u0421\\u0440\\u043E\\u043A\\u043E\\u0432\\u0435\r\n\r\n#XTIT: Title of New Appointment screen\r\nview.Appointment.newapptitle=\\u041D\\u043E\\u0432 \\u0441\\u0440\\u043E\\u043A\r\n\r\n#XFLD: tooltip  for create new appointment button\r\nview.Appointment.newapptm_tt=\\u041D\\u043E\\u0432 \\u0441\\u0440\\u043E\\u043A\r\n\r\n#XTIT: Title of shared calendars\r\nview.Appointment.sharedCalendars=\\u041E\\u0431\\u0449\\u0438 \\u043A\\u0430\\u043B\\u0435\\u043D\\u0434\\u0430\\u0440\\u0438\r\n\r\n#XBUT: Button text of my calendar\r\nview.Appointment.mycalendar=\\u041C\\u043E\\u044F \\u043A\\u0430\\u043B\\u0435\\u043D\\u0434\\u0430\\u0440\r\n\r\n#XTIT: Title of infotoolbar \r\nview.Appointment.myTeam=\\u0427\\u043B\\u0435\\u043D\\u043E\\u0432\\u0435 \\u043D\\u0430 \\u043C\\u043E\\u044F \\u0435\\u043A\\u0438\\u043F\r\n\r\n#XTIT: Appointment list description with location,account text and contact text\r\nview.Appointment.furtherDetails={0} | {1} ({2})\r\n\r\n#XTIT: Appointment list description with account text and contact text\r\nview.Appointment.furtherDetailsWithoutLoc={0} ({1})\r\n\r\n#XTIT: Appointment list description with loc  and account text\r\nview.Appointment.furtherDetailsWithoutContact={0} | {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=\\u0414\\u0430\\u043D\\u043D\\u0438\\u0442\\u0435 \\u0441\\u0430 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438 \\u043E\\u0442 \\u0434\\u0440\\u0443\\u0433 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B. \\u0418\\u0437\\u0431\\u0435\\u0440\\u0435\\u0442\\u0435 OK \\u0437\\u0430 \\u0434\\u0430 \\u0432\\u044A\\u0437\\u0441\\u0442\\u0430\\u043D\\u043E\\u0432\\u0438\\u0442\\u0435 \\u043F\\u043E\\u0441\\u043B\\u0435\\u0434\\u043D\\u0438\\u0442\\u0435 \\u0434\\u0430\\u043D\\u043D\\u0438.\r\n#XTIT: Appointment list description without loc and cantact text\r\nview.Appointment.furtherDetailsWithoutContactAndLoc={0}\r\n\r\n#XTIT: Title of Timeline\r\nview.Appointment.Timeline=\\u0412\\u0440\\u0435\\u043C\\u0435\\u0432\\u0430 \\u043B\\u0438\\u043D\\u0438\\u044F\r\n\r\n#XTIT: Title of Calendars\r\nview.Appointment.Calendars=\\u041A\\u0430\\u043B\\u0435\\u043D\\u0434\\u0430\\u0440\\u0438\r\n\r\n#XFLD: tooltip for today button\r\nview.Appointment.today_tt=\\u0414\\u043D\\u0435\\u0441\r\n\r\n#XTIT: Header text of Appointment detail\r\nview.Appointment.detail=\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438 \\u0437\\u0430 \\u0441\\u0440\\u0435\\u0449\\u0430\r\n\r\n#XFLD: Account field label\r\nview.Appointment.account=\\u0410\\u043A\\u0430\\u0443\\u043D\\u0442\r\n\r\n#XFLD: Contact field label\r\nview.Appointment.contact=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n\r\n#XFLD: Employee Responsible field label\r\nview.Appointment.employeeResponsible=\\u041E\\u0442\\u0433\\u043E\\u0432\\u043E\\u0440\\u0435\\u043D \\u0441\\u043B\\u0443\\u0436\\u0438\\u0442\\u0435\\u043B\r\n\r\n#XFLD: Time field label\r\nview.Appointment.time=\\u0412\\u0440\\u0435\\u043C\\u0435\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.subject=\\u0417\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.title=\\u0417\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435\r\n\r\n#XFLD: Label for Start date and time\r\nview.Appointment.startdatetime=\\u041D\\u0430\\u0447\\u0430\\u043B\\u043D\\u0430 \\u0434\\u0430\\u0442\\u0430 \\u0438 \\u0447\\u0430\\u0441\r\n\r\n#XFLD: Label for End date and time\r\nview.Appointment.enddatetime=\\u041A\\u0440\\u0430\\u0439\\u043D\\u0430 \\u0434\\u0430\\u0442\\u0430 \\u0438 \\u0447\\u0430\\u0441\r\n\r\n#XFLD: Label for All day checkbox\r\nview.Appointment.alldayevent=\\u0426\\u044F\\u043B \\u0434\\u0435\\u043D\r\n\r\n#YMSG: info message in case appointment occurs in the past\r\nview.Appointment.occurspast=\\u0421\\u0440\\u043E\\u043A\\u044A\\u0442 \\u0441\\u0435 \\u044F\\u0432\\u044F\\u0432\\u0430 \\u0432 \\u043C\\u0438\\u043D\\u0430\\u043B\\u043E\\u0442\\u043E\r\n\r\n#YMSG: info message in case no title entered\r\nview.Appointment.notitle=\\u0412\\u044A\\u0432\\u0435\\u0434\\u0435\\u0442\\u0435 \\u0437\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435\r\n\r\n#XFLD: Label for Private checkbox\r\nview.Appointment.private=\\u0427\\u0430\\u0441\\u0442\\u043D\\u043E\r\n\r\n#XFLD: Location field label\r\nview.Appointment.location=\\u041C\\u0435\\u0441\\u0442\\u043E\\u043F\\u043E\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0435\r\n\r\n#XFLD: Importance field label\r\nview.Appointment.importance=\\u0412\\u0430\\u0436\\u043D\\u043E\\u0441\\u0442\r\n\r\n#XFLD: Active Status field label\r\nview.Appointment.activeStatus=\\u0421\\u0442\\u0430\\u0442\\u0443\\u0441\r\n\r\n#XFLD: Notes field label\r\nview.Appointment.notes=\\u0411\\u0435\\u043B\\u0435\\u0436\\u043A\\u0438\r\n\r\n#XFLD: Note field label\r\nview.Appointment.note=\\u0411\\u0435\\u043B\\u0435\\u0436\\u043A\\u0438\r\n\r\n#XFLD: Label for internal attendees\r\nview.Appointment.internal=\\u0412\\u044A\\u0442\\u0440\\u0435\\u0448\\u0435\\u043D\r\n\r\n#XFLD: Label for external attendees\r\nview.Appointment.external=\\u0412\\u044A\\u043D\\u0448\\u0435\\u043D\r\n\r\n#XGRP: Group header of the section for showing the general data\r\nview.Appointment.generalData=\\u041E\\u0431\\u0449\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438\r\n\r\n#XGRP: Group header of the section for showing the contact data\r\nview.Appointment.contactData=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n\r\n#XGRP: Group header of the section for showing the attendees\r\nview.Appointment.attendeeData=\\u0423\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u0446\\u0438\r\n\r\n#XGRP: Group header attendees with number\r\nview.Appointment.attendeeDataNumber=\\u0423\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u0446\\u0438 ({0})\r\n\r\n#XGRP: Group header additional attendees with number\r\nview.Appointment.additionalAttendeeNumber=\\u0414\\u043E\\u043F\\u044A\\u043B\\u043D\\u0438\\u0442\\u0435\\u043B\\u043D\\u0438 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u0446\\u0438 ({0})\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.detailData=\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438\r\n\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.appointmentDetail=\\u0421\\u0440\\u0435\\u0449\\u0430\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Opportunity=\\u0412\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Task=\\u0417\\u0430\\u0434\\u0430\\u043D\\u0438\\u0435\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.attachmentData=\\u041F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F\r\n\r\n#XGRP: Group header attachments with number how many\r\nview.Appointment.attachmentDataNumber=\\u041F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F ({0})\r\n\r\n#XGRP: Group header attachments with request to save the appointment before file upload \r\nview.Appointment.attachmentSaveRequest=\\u041F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F (\\u0437\\u0430\\u043F\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435 \\u043F\\u0440\\u0435\\u0434\\u0438 \\u043A\\u0430\\u0447\\u0432\\u0430\\u043D\\u0435)\r\n\r\n#XBUT: Button text to Delete\r\nview.Appointment.delete=\\u0418\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435\r\n\r\n#XBUT: Button text to Follow up\r\nview.Appointment.followup=\\u041F\\u043E\\u0441\\u043B\\u0435\\u0434\\u0432\\u0430\\u0449\\u0430 \\u043E\\u0431\\u0440\\u0430\\u0431\\u043E\\u0442\\u043A\\u0430\r\n\r\n#YMSG: no transaction types  present\r\nview.Appointment.FOLLOWUPERROR=\\u041D\\u0435 \\u0441\\u0430 \\u043E\\u0442\\u043A\\u0440\\u0438\\u0442\\u0438 \\u0432\\u0438\\u0434\\u043E\\u0432\\u0435 \\u0442\\u0440\\u0430\\u043D\\u0437\\u0430\\u043A\\u0446\\u0438\\u0438. \\u041C\\u043E\\u043B\\u044F \\u043F\\u0440\\u043E\\u0432\\u0435\\u0440\\u0435\\u0442\\u0435 \\u0431\\u0435\\u043A\\u0435\\u043D\\u0434 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438\\u0442\\u0435 \\u0441\\u0438.\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.deletesuccess=\\u0421\\u0440\\u043E\\u043A\\u044A\\u0442 \\u0435 \\u0438\\u0437\\u0442\\u0440\\u0438\\u0442\r\n\r\n#YMSG: successful followup message in message toast\r\nview.Appointment.followupsuccessful=\\u041F\\u043E\\u0441\\u043B\\u0435\\u0434\\u0432\\u0430\\u0449\\u0438\\u044F\\u0442 \\u0441\\u0440\\u043E\\u043A \\u0435 \\u0437\\u0430\\u043F\\u0430\\u0437\\u0435\\u043D\r\n\r\n#XBUT: Button text to Edit\r\nview.Appointment.edit=\\u0420\\u0435\\u0434\\u0430\\u043A\\u0446\\u0438\\u044F\r\n\r\n#XBUT: Button text to Done\r\nview.Appointment.done=\\u0413\\u043E\\u0442\\u043E\\u0432\\u043E\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.cancel=\\u041E\\u0442\\u043A\\u0430\\u0437\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.ok=OK\r\n\r\n#XBUT: Button text to Create\r\nview.Appointment.create=\\u0421\\u044A\\u0437\\u0434\\u0430\\u0432\\u0430\\u043D\\u0435\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.savesuccess=\\u0421\\u0440\\u043E\\u043A\\u044A\\u0442 \\u0435 \\u0437\\u0430\\u043F\\u0430\\u0437\\u0435\\u043D\r\n\r\n#XBUT: Button text to SAve\r\nview.Appointment.save=\\u0417\\u0430\\u043F\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435\r\n\r\n#XBUT: Button text for Day\r\nview.Appointment.day=\\u0414\\u0435\\u043D\r\n\r\n#XBUT: Button text for week\r\nview.Appointment.week=\\u0421\\u0435\\u0434\\u043C\\u0438\\u0446\\u0430\r\n\r\n#XBUT: Button text for month\r\nview.Appointment.month=\\u041C\\u0435\\u0441\\u0435\\u0446\r\n\r\n#XFLD: loading text for the appointment list\r\nview.Appointment.loaddatatext=\\u0417\\u0430\\u0440\\u0435\\u0436\\u0434\\u0430\\u043D\\u0435...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.acsea_title=\\u0421\\u043C\\u0435\\u0442\\u043A\\u0438 ({0})\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.acsea_nodata=\\u041D\\u0435 \\u0441\\u0430 \\u043E\\u0442\\u043A\\u0440\\u0438\\u0442\\u0438 \\u0430\\u043A\\u0430\\u0443\\u043D\\u0442\\u0438\r\n\r\n#XFLD: placeholdertext for search fields\r\nview.Appointment.searchfieldplaceholder=\\u0422\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435\r\n\r\n#XFLD: placeholdertext for search busy text\r\nview.Appointment.searchlistinfo=\\u0422\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.consea_title=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438 ({0})\r\n\r\n#XTIT: title of the business card for accounts\r\nview.Appointment.account_title=\\u0410\\u043A\\u0430\\u0443\\u043D\\u0442\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.employee_title=\\u0421\\u043B\\u0443\\u0436\\u0438\\u0442\\u0435\\u043B\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.contact_title=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.consea_nodata=\\u041D\\u0435 \\u0441\\u0430 \\u043E\\u0442\\u043A\\u0440\\u0438\\u0442\\u0438 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.empsea_nodata=\\u041D\\u0435 \\u0441\\u0430 \\u043E\\u0442\\u043A\\u0440\\u0438\\u0442\\u0438 \\u0441\\u043B\\u0443\\u0436\\u0438\\u0442\\u0435\\u043B\\u0438\r\n\r\n#XTIT: title of internal attendees search popup\r\nview.Appointment.internal_title=\\u0412\\u044A\\u0442\\u0440\\u0435\\u0448\\u043D\\u0438 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u0446\\u0438 ({0})\r\n\r\n#XTIT: title of external attendees search popup\r\nview.Appointment.external_title=\\u0412\\u044A\\u043D\\u0448\\u043D\\u0438 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u0446\\u0438 ({0})\r\n\r\n#XTIT: title of internal attendees search popup enhanced with total count\r\nview.Appointment.internal_titlenew=\\u041D\\u043E\\u0432\\u0438 \\u0432\\u044A\\u0442\\u0440\\u0435\\u0448\\u043D\\u0438 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u0446\\u0438 ({0})\r\n\r\n#XTIT: title of external attendees search popup enhanced with total count\r\nview.Appointment.external_titlenew=\\u041D\\u043E\\u0432\\u0438 \\u0432\\u044A\\u043D\\u0448\\u043D\\u0438 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u0446\\u0438 ({0})\r\n\r\n#YMSG: Filtered by info bar text for contact search popup\r\nview.Appointment.filteredby=\\u0424\\u0438\\u043B\\u0442\\u0440\\u0438\\u0440\\u0430\\u043D\\u0438 \\u043F\\u043E\r\n\r\n#YMSG: filter line for cross navigation: Filter by Account \r\nview.Appointment.filteraccount=\\u0424\\u0438\\u043B\\u0442\\u0440\\u0438\\u0440\\u0430\\u043D\\u0438 \\u043F\\u043E \\u0430\\u043A\\u0430\\u0443\\u043D\\u0442\r\n\r\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\r\nview.Appointment.duration.min={0} \\u043C\\u0438\\u043D\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\r\nview.Appointment.duration.hour={0} \\u0447\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.day={0} \\u0434\\u0435\\u043D\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.days={0} \\u0434\\u043D\\u0438\r\n\r\n#XTIT: Button text to Delete \r\nview.Appointment.deleteTitle=\\u0418\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435\r\n\r\n#YINS: Text for Pop Up action.  User to react (Yes/No) \r\nview.Appointment.deleteInstruction=\\u0418\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0442\\u043E\\u0437\\u0438 \\u0441\\u0440\\u043E\\u043A?\r\n\r\n#XBUT: User to react (positive) to delete action \r\nview.Appointment.deleteYes=OK\r\n\r\n#XFLD: placeholder text for fiels adding external attendees\r\nview.Appointment.attexternaladd=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u0432\\u044A\\u043D\\u0448\\u0435\\u043D \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\r\n\r\n#XFLD: placeholder text for fiels adding internal attendees\r\nview.Appointment.attinternaladd=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u043A\\u043E\\u043B\\u0435\\u0433\\u0430\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.fromTimeDate=\\u041E\\u0442 {0} {1}\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.toTimeDate=\\u0414\\u043E {0} {1}\r\n\r\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\r\nview.Appointment.timeToTime={0} \\u0434\\u043E   {1}\r\n\r\n#XFLD: empty appointment list text \r\nview.Appointment.appointment_nodata=\\u041D\\u044F\\u043C\\u0430 \\u0441\\u0440\\u043E\\u043A\\u043E\\u0432\\u0435\r\n\r\n#XFLD: employee fullname: {0} firstname {1} lastname\r\nview.Appointment.employeename={0} {1}\r\n\r\n#XTIT: Title for Edit Appointment page\r\nview.Appointment.editappointment=\\u0420\\u0435\\u0434\\u0430\\u043A\\u0446\\u0438\\u044F \\u043D\\u0430 \\u0441\\u0440\\u043E\\u043A\\u043E\\u0432\\u0435\r\n\r\n#YMSG: Error when end time is before start time (on same day)\r\nview.Appointment.wrongTimes=\\u041A\\u0440\\u0430\\u0439\\u043D\\u0438\\u044F\\u0442 \\u0447\\u0430\\u0441 \\u0435 \\u043F\\u0440\\u0435\\u0434\\u0438 \\u043D\\u0430\\u0447\\u0430\\u043B\\u043D\\u0438\\u044F \\u0447\\u0430\\u0441\r\n\r\n#YMSG: Error when end date is before start date\r\nview.Appointment.wrongDates=\\u041A\\u0440\\u0430\\u0439\\u043D\\u0430\\u0442\\u0430 \\u0434\\u0430\\u0442\\u0430 \\u0435 \\u043F\\u0440\\u0435\\u0434\\u0438 \\u043D\\u0430\\u0447\\u0430\\u043B\\u043D\\u0430\\u0442\\u0430 \\u0434\\u0430\\u0442\\u0430\r\n\r\n#XBUT: Button text for Add Button\r\nview.Appointment.add=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435\r\n\r\n#XTIT: Shell Title of App\r\nview.Appointment.shelltitle=\\u041C\\u043E\\u0438\\u0442\\u0435 \\u0441\\u0440\\u043E\\u043A\\u043E\\u0432\\u0435\r\n\r\n#XFLD: empty list text for external attendee popup\r\nview.Appointment.noextattendees=\\u041D\\u044F\\u043C\\u0430 \\u0432\\u044A\\u043D\\u0448\\u043D\\u0438 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u0446\\u0438\r\n\r\n#XFLD: empty list text for internal attendee popup\r\nview.Appointment.nointattendees=\\u041D\\u044F\\u043C\\u0430 \\u0432\\u044A\\u0442\\u0440\\u0435\\u0448\\u043D\\u0438 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u0446\\u0438\r\n\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=\\u041F\\u043E\\u043A\\u0430\\u0437\\u0430\\u043D\\u0438 \\u0441\\u0430 \\u0441\\u0430\\u043C\\u043E \\u0432\\u0430\\u0448\\u0438\\u0442\\u0435 \\u0441\\u0440\\u043E\\u043A\\u043E\\u0432\\u0435\r\n\r\n#YMSG: info message in case edit page is left with back and data changed\r\nview.Appointment.leaveeditmessage=\\u0412\\u0430\\u0448\\u0438\\u0442\\u0435 \\u0437\\u0430\\u043F\\u0438\\u0441\\u0438 \\u0449\\u0435 \\u0431\\u044A\\u0434\\u0430\\u0442 \\u0438\\u0437\\u0433\\u0443\\u0431\\u0435\\u043D\\u0438, \\u0430\\u043A\\u043E \\u043D\\u0430\\u043F\\u0443\\u0441\\u043D\\u0435\\u0442\\u0435 \\u0442\\u0430\\u0437\\u0438 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430. \\u0416\\u0435\\u043B\\u0430\\u0435\\u0442\\u0435 \\u043B\\u0438 \\u0434\\u0430 \\u043F\\u0440\\u043E\\u0434\\u044A\\u043B\\u0436\\u0438\\u0442\\u0435?\r\n\r\n#YMSG: info message in case of wrong format of Start Date\r\nview.Appointment.validStartDate=\\u0412\\u044A\\u0432\\u0435\\u0434\\u0435\\u0442\\u0435 \\u0432\\u0430\\u043B\\u0438\\u0434\\u043D\\u0430 \\u043D\\u0430\\u0447\\u0430\\u043B\\u043D\\u0430 \\u0434\\u0430\\u0442\\u0430\r\n\r\n#YMSG: info message in case of wrong format of End Date\r\nview.Appointment.validEndDate=\\u0412\\u044A\\u0432\\u0435\\u0434\\u0435\\u0442\\u0435 \\u0432\\u0430\\u043B\\u0438\\u0434\\u043D\\u0430 \\u043A\\u0440\\u0430\\u0439\\u043D\\u0430 \\u0434\\u0430\\u0442\\u0430\r\n\r\n#YMSG: info message in case of wrong format of Start Date and End Date\r\nview.Appointment.validStartEndDate=\\u0412\\u044A\\u0432\\u0435\\u0434\\u0435\\u0442\\u0435 \\u0432\\u0430\\u043B\\u0438\\u0434\\u043D\\u0430 \\u043D\\u0430\\u0447\\u0430\\u043B\\u043D\\u0430 \\u0434\\u0430\\u0442\\u0430 \\u0438 \\u043A\\u0440\\u0430\\u0439\\u043D\\u0430 \\u0434\\u0430\\u0442\\u0430\r\n\r\n#XTIT: Title for Process type dialog\r\nview.Appointment.process_type=\\u0418\\u0437\\u0431\\u043E\\u0440 \\u043D\\u0430 \\u0432\\u0438\\u0434 \\u0442\\u0440\\u0430\\u043D\\u0437\\u0430\\u043A\\u0446\\u0438\\u044F\r\n\r\n#XFLD: No Data text when loading/searching list\r\nview.Appointment.no_data_text=\\u0412 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442\\u0430 \\u043D\\u044F\\u043C\\u0430 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u0438\r\n\r\n#XFLD: Transaction Type\r\nview.Appointment.TransactionType=\\u0412\\u0438\\u0434\r\n\r\n#YMSG : PRIVATE appointment message\r\nview.Appointment.privateMessage=\\u0422\\u043E\\u0432\\u0430 \\u0435 \\u043B\\u0438\\u0447\\u0435\\u043D \\u0441\\u0440\\u043E\\u043A\r\n\r\n#XFLD: Title for private appointment in shared calendar\r\nview.Appointment.privateAppointment=\\u041B\\u0438\\u0447\\u0435\\u043D \\u0441\\u0440\\u043E\\u043A\r\n#XTIT: this is the title for the Transaction History Tab\r\nTRANS_HISTORY=\\u0418\\u0441\\u0442\\u043E\\u0440\\u0438\\u044F \\u043D\\u0430 \\u0442\\u0440\\u0430\\u043D\\u0437\\u0430\\u043A\\u0446\\u0438\\u0438\r\n\r\n#XFLD, 30: Field Transaction ID on List\r\nTRANS_ID=\\u0418\\u0414 \\u043D\\u0430 \\u0442\\u0440\\u0430\\u043D\\u0437\\u0430\\u043A\\u0446\\u0438\\u044F\r\n\r\n#XFLD, 30: Field Transaction Type on List\r\nTRANS_TYPE=\\u0412\\u0438\\u0434 \\u0442\\u0440\\u0430\\u043D\\u0437\\u0430\\u043A\\u0446\\u0438\\u044F\r\n\r\n#XFLD, 30: Field Description on List\r\nTRANS_DESC=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\r\n\r\n#XFLD, 30: Field Created On on List\r\nCREATED_ON=\\u0421\\u044A\\u0437\\u0434\\u0430\\u0434\\u0435\\u043D \\u043D\\u0430\r\n\r\n#XFLD, 30: Field Created On on List\r\nRELATIONSHIP=\\u0412\\u0438\\u0434 \\u043E\\u0442\\u043D\\u043E\\u0448\\u0435\\u043D\\u0438\\u0435\r\n\r\n#XFLD, 15: Priority label\r\nview.Appointment.priority=\\u041F\\u0440\\u0438\\u043E\\u0440\\u0438\\u0442\\u0435\\u0442\r\n\r\n#YMSG, 50:Customizing incomplete\r\nCUSTOMIZING_INCOMPLETE=\\u041D\\u0435\\u043F\\u044A\\u043B\\u043D\\u0438 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438. \\u041C\\u043E\\u043B\\u044F \\u0441\\u0432\\u044A\\u0440\\u0436\\u0435\\u0442\\u0435 \\u0441\\u0435 \\u0441 \\u0432\\u0430\\u0448\\u0438\\u044F \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0435\\u043D \\u0430\\u0434\\u043C\\u0438\\u043D\\u0438\\u0441\\u0442\\u0440\\u0430\\u0442\\u043E\\u0440.\r\n\r\n#XBUT: Button text to Messages\r\nview.Appointment.messages=\\u0421\\u044A\\u043E\\u0431\\u0449\\u0435\\u043D\\u0438\\u044F\r\n\r\n#XGRP: Error message dialog title\r\nview.Appointment.errorMessage=\\u0421\\u044A\\u043E\\u0431\\u0449\\u0435\\u043D\\u0438\\u044F ({0})\r\n\r\n#YMSG: contact not assigned to this account\r\n',
	"cus/crm/mycalendar/i18n/i18n_cs.properties":'\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n\r\n#XTIT: Title of App\r\nview.Appointment.apptitle=Sch\\u016Fzky\r\n\r\n#XTIT: Title of New Appointment screen\r\nview.Appointment.newapptitle=Nov\\u00E1 sch\\u016Fzka\r\n\r\n#XFLD: tooltip  for create new appointment button\r\nview.Appointment.newapptm_tt=Nov\\u00E1 sch\\u016Fzka\r\n\r\n#XTIT: Title of shared calendars\r\nview.Appointment.sharedCalendars=Sd\\u00EDlen\\u00E9 kalend\\u00E1\\u0159e\r\n\r\n#XBUT: Button text of my calendar\r\nview.Appointment.mycalendar=M\\u016Fj kalend\\u00E1\\u0159\r\n\r\n#XTIT: Title of infotoolbar \r\nview.Appointment.myTeam=\\u010Clenov\\u00E9 m\\u00E9ho t\\u00FDmu\r\n\r\n#XTIT: Appointment list description with location,account text and contact text\r\nview.Appointment.furtherDetails={0} | {1} ({2})\r\n\r\n#XTIT: Appointment list description with account text and contact text\r\nview.Appointment.furtherDetailsWithoutLoc={0} ({1})\r\n\r\n#XTIT: Appointment list description with loc  and account text\r\nview.Appointment.furtherDetailsWithoutContact={0} | {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Data zm\\u011Bnil jin\\u00FD u\\u017Eivatel. Zvolte OK a na\\u010Dt\\u011Bte nejnov\\u011Bj\\u0161\\u00ED data.\r\n#XTIT: Appointment list description without loc and cantact text\r\nview.Appointment.furtherDetailsWithoutContactAndLoc={0}\r\n\r\n#XTIT: Title of Timeline\r\nview.Appointment.Timeline=\\u010Casov\\u00E1 osa\r\n\r\n#XTIT: Title of Calendars\r\nview.Appointment.Calendars=Kalend\\u00E1\\u0159e\r\n\r\n#XFLD: tooltip for today button\r\nview.Appointment.today_tt=Dnes\r\n\r\n#XTIT: Header text of Appointment detail\r\nview.Appointment.detail=Detaily sch\\u016Fzky\r\n\r\n#XFLD: Account field label\r\nview.Appointment.account=Z\\u00E1kazn\\u00EDk\r\n\r\n#XFLD: Contact field label\r\nview.Appointment.contact=Kontakt\r\n\r\n#XFLD: Employee Responsible field label\r\nview.Appointment.employeeResponsible=Odpov\\u011Bdn\\u00FD zam\\u011Bstnanec\r\n\r\n#XFLD: Time field label\r\nview.Appointment.time=Doba\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.subject=N\\u00E1zev\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.title=N\\u00E1zev\r\n\r\n#XFLD: Label for Start date and time\r\nview.Appointment.startdatetime=Po\\u010D\\u00E1te\\u010D.datum a \\u010Das\r\n\r\n#XFLD: Label for End date and time\r\nview.Appointment.enddatetime=Koncov\\u00E9 datum a \\u010Das\r\n\r\n#XFLD: Label for All day checkbox\r\nview.Appointment.alldayevent=Cel\\u00FD den\r\n\r\n#YMSG: info message in case appointment occurs in the past\r\nview.Appointment.occurspast=Sch\\u016Fzka se vyskytuje v minulosti\r\n\r\n#YMSG: info message in case no title entered\r\nview.Appointment.notitle=Zadejte titulek\r\n\r\n#XFLD: Label for Private checkbox\r\nview.Appointment.private=Soukrom\\u00E9\r\n\r\n#XFLD: Location field label\r\nview.Appointment.location=M\\u00EDsto\r\n\r\n#XFLD: Importance field label\r\nview.Appointment.importance=D\\u016Fle\\u017Eitost\r\n\r\n#XFLD: Active Status field label\r\nview.Appointment.activeStatus=Stav\r\n\r\n#XFLD: Notes field label\r\nview.Appointment.notes=Pozn\\u00E1mky\r\n\r\n#XFLD: Note field label\r\nview.Appointment.note=Pozn\\u00E1mky\r\n\r\n#XFLD: Label for internal attendees\r\nview.Appointment.internal=Intern\\u00ED\r\n\r\n#XFLD: Label for external attendees\r\nview.Appointment.external=Extern\\u00ED\r\n\r\n#XGRP: Group header of the section for showing the general data\r\nview.Appointment.generalData=Obecn\\u00E1 data\r\n\r\n#XGRP: Group header of the section for showing the contact data\r\nview.Appointment.contactData=Kontakt\r\n\r\n#XGRP: Group header of the section for showing the attendees\r\nview.Appointment.attendeeData=\\u00DA\\u010Dastn\\u00EDk\r\n\r\n#XGRP: Group header attendees with number\r\nview.Appointment.attendeeDataNumber=\\u00DA\\u010Dastn\\u00EDci ({0})\r\n\r\n#XGRP: Group header additional attendees with number\r\nview.Appointment.additionalAttendeeNumber=Dal\\u0161\\u00ED \\u00FA\\u010Dastn\\u00EDci ({0})\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.detailData=Detaily\r\n\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.appointmentDetail=Sch\\u016Fzka\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Opportunity=P\\u0159\\u00EDle\\u017Eitost\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Task=\\u00DAloha\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.attachmentData=P\\u0159\\u00EDlohy\r\n\r\n#XGRP: Group header attachments with number how many\r\nview.Appointment.attachmentDataNumber=P\\u0159\\u00EDlohy ({0})\r\n\r\n#XGRP: Group header attachments with request to save the appointment before file upload \r\nview.Appointment.attachmentSaveRequest=P\\u0159\\u00EDlohy (ulo\\u017Eit p\\u0159ed uploadem)\r\n\r\n#XBUT: Button text to Delete\r\nview.Appointment.delete=Smazat\r\n\r\n#XBUT: Button text to Follow up\r\nview.Appointment.followup=N\\u00E1sledn\\u00E1 \\u010Dinnost\r\n\r\n#YMSG: no transaction types  present\r\nview.Appointment.FOLLOWUPERROR=Nebyly nalezeny \\u017E\\u00E1dn\\u00E9 typy transakc\\u00ED. Zkontrolujte sv\\u00E9 p\\u0159izp\\u016Fsoben\\u00ED backendu.\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.deletesuccess=Sch\\u016Fzka vymaz\\u00E1na\r\n\r\n#YMSG: successful followup message in message toast\r\nview.Appointment.followupsuccessful=N\\u00E1sledn\\u00E1 sch\\u016Fzka byla ulo\\u017Eena\r\n\r\n#XBUT: Button text to Edit\r\nview.Appointment.edit=Upravit\r\n\r\n#XBUT: Button text to Done\r\nview.Appointment.done=Hotovo\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.cancel=Zru\\u0161it\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.ok=OK\r\n\r\n#XBUT: Button text to Create\r\nview.Appointment.create=Vytvo\\u0159it\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.savesuccess=Sch\\u016Fzka ulo\\u017Eena\r\n\r\n#XBUT: Button text to SAve\r\nview.Appointment.save=Ulo\\u017Eit\r\n\r\n#XBUT: Button text for Day\r\nview.Appointment.day=Den\r\n\r\n#XBUT: Button text for week\r\nview.Appointment.week=T\\u00FDden\r\n\r\n#XBUT: Button text for month\r\nview.Appointment.month=M\\u011Bs\\u00EDc\r\n\r\n#XFLD: loading text for the appointment list\r\nview.Appointment.loaddatatext=Zav\\u00E1d\\u00ED se...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.acsea_title=Z\\u00E1kazn\\u00EDci ({0})\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.acsea_nodata=Nebyli nalezeni \\u017E\\u00E1dn\\u00ED z\\u00E1kazn\\u00EDci\r\n\r\n#XFLD: placeholdertext for search fields\r\nview.Appointment.searchfieldplaceholder=Hledat\r\n\r\n#XFLD: placeholdertext for search busy text\r\nview.Appointment.searchlistinfo=Hled\\u00E1n\\u00ED...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.consea_title=Kontakty ({0})\r\n\r\n#XTIT: title of the business card for accounts\r\nview.Appointment.account_title=Z\\u00E1kazn\\u00EDk\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.employee_title=Zam\\u011Bstnanec\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.contact_title=Kontakt\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.consea_nodata=Nebyly nalezeny \\u017E\\u00E1dn\\u00E9 kontakty\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.empsea_nodata=Nebyly nalezeni \\u017E\\u00E1dn\\u00ED zam\\u011Bstnanci\r\n\r\n#XTIT: title of internal attendees search popup\r\nview.Appointment.internal_title=Intern\\u00ED \\u00FA\\u010Dastn\\u00EDci ({0})\r\n\r\n#XTIT: title of external attendees search popup\r\nview.Appointment.external_title=Extern\\u00ED \\u00FA\\u010Dastn\\u00EDci ({0})\r\n\r\n#XTIT: title of internal attendees search popup enhanced with total count\r\nview.Appointment.internal_titlenew=Nov\\u00ED intern\\u00ED \\u00FA\\u010Dastn\\u00EDci ({0})\r\n\r\n#XTIT: title of external attendees search popup enhanced with total count\r\nview.Appointment.external_titlenew=Nov\\u00ED extern\\u00ED \\u00FA\\u010Dastn\\u00EDci ({0})\r\n\r\n#YMSG: Filtered by info bar text for contact search popup\r\nview.Appointment.filteredby=Filtr podle\r\n\r\n#YMSG: filter line for cross navigation: Filter by Account \r\nview.Appointment.filteraccount=Filtrov\\u00E1no podle z\\u00E1kazn\\u00EDka\r\n\r\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\r\nview.Appointment.duration.min={0} min.\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\r\nview.Appointment.duration.hour={0} hod.\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.day={0} den\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.days={0} dn\\u00ED\r\n\r\n#XTIT: Button text to Delete \r\nview.Appointment.deleteTitle=Smazat\r\n\r\n#YINS: Text for Pop Up action.  User to react (Yes/No) \r\nview.Appointment.deleteInstruction=Vymazat tuto sch\\u016Fzku?\r\n\r\n#XBUT: User to react (positive) to delete action \r\nview.Appointment.deleteYes=OK\r\n\r\n#XFLD: placeholder text for fiels adding external attendees\r\nview.Appointment.attexternaladd=P\\u0159idat extern\\u00ED \\u00FA\\u010Dastn\\u00EDky\r\n\r\n#XFLD: placeholder text for fiels adding internal attendees\r\nview.Appointment.attinternaladd=P\\u0159idat kolegu\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.fromTimeDate=Od {0} {1}\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.toTimeDate=Do {0} {1}\r\n\r\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\r\nview.Appointment.timeToTime={0} do   {1}\r\n\r\n#XFLD: empty appointment list text \r\nview.Appointment.appointment_nodata=\\u017D\\u00E1dn\\u00E9 sch\\u016Fzky\r\n\r\n#XFLD: employee fullname: {0} firstname {1} lastname\r\nview.Appointment.employeename={0} {1}\r\n\r\n#XTIT: Title for Edit Appointment page\r\nview.Appointment.editappointment=Upravit sch\\u016Fzku\r\n\r\n#YMSG: Error when end time is before start time (on same day)\r\nview.Appointment.wrongTimes=Koncov\\u00FD \\u010Das p\\u0159edch\\u00E1z\\u00ED po\\u010D\\u00E1te\\u010Dn\\u00EDmu \\u010Dasu\r\n\r\n#YMSG: Error when end date is before start date\r\nview.Appointment.wrongDates=Koncov\\u00E9 datum p\\u0159edch\\u00E1z\\u00ED po\\u010D\\u00E1te\\u010Dn\\u00EDmu datu\r\n\r\n#XBUT: Button text for Add Button\r\nview.Appointment.add=P\\u0159idat\r\n\r\n#XTIT: Shell Title of App\r\nview.Appointment.shelltitle=Moje sch\\u016Fzky\r\n\r\n#XFLD: empty list text for external attendee popup\r\nview.Appointment.noextattendees=\\u017D\\u00E1dn\\u00ED extern\\u00ED \\u00FA\\u010Dastn\\u00EDci\r\n\r\n#XFLD: empty list text for internal attendee popup\r\nview.Appointment.nointattendees=\\u017D\\u00E1dn\\u00ED intern\\u00ED \\u00FA\\u010Dastn\\u00EDci\r\n\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Jsou zobrazeny pouze va\\u0161e sch\\u016Fzky\r\n\r\n#YMSG: info message in case edit page is left with back and data changed\r\nview.Appointment.leaveeditmessage=Pokud tuto str\\u00E1nku opust\\u00EDte, va\\u0161e vstupy budou ztraceny. Chcete pokra\\u010Dovat?\r\n\r\n#YMSG: info message in case of wrong format of Start Date\r\nview.Appointment.validStartDate=Zadejte platn\\u00E9 po\\u010D\\u00E1te\\u010Dn\\u00ED datum\r\n\r\n#YMSG: info message in case of wrong format of End Date\r\nview.Appointment.validEndDate=Zadejte platn\\u00E9 koncov\\u00E9 datum\r\n\r\n#YMSG: info message in case of wrong format of Start Date and End Date\r\nview.Appointment.validStartEndDate=Zadejte platn\\u00E9 po\\u010D\\u00E1ta\\u010Dn\\u00ED a koncov\\u00E9 datum\r\n\r\n#XTIT: Title for Process type dialog\r\nview.Appointment.process_type=Vybrat typ transakce\r\n\r\n#XFLD: No Data text when loading/searching list\r\nview.Appointment.no_data_text=V sou\\u010Dasn\\u00E9 dob\\u011B nejsou k dispozici \\u017E\\u00E1dn\\u00E9 polo\\u017Eky\r\n\r\n#XFLD: Transaction Type\r\nview.Appointment.TransactionType=Typ\r\n\r\n#YMSG : PRIVATE appointment message\r\nview.Appointment.privateMessage=Toto je soukrom\\u00E1 sch\\u016Fzka\r\n\r\n#XFLD: Title for private appointment in shared calendar\r\nview.Appointment.privateAppointment=Soukrom\\u00E1 sch\\u016Fzka\r\n#XTIT: this is the title for the Transaction History Tab\r\nTRANS_HISTORY=Historie transakc\\u00ED\r\n\r\n#XFLD, 30: Field Transaction ID on List\r\nTRANS_ID=ID transakce\r\n\r\n#XFLD, 30: Field Transaction Type on List\r\nTRANS_TYPE=Typ transakce\r\n\r\n#XFLD, 30: Field Description on List\r\nTRANS_DESC=Popis\r\n\r\n#XFLD, 30: Field Created On on List\r\nCREATED_ON=Vytvo\\u0159eno\r\n\r\n#XFLD, 30: Field Created On on List\r\nRELATIONSHIP=Typ vztahu\r\n\r\n#XFLD, 15: Priority label\r\nview.Appointment.priority=Priorita\r\n\r\n#YMSG, 50:Customizing incomplete\r\nCUSTOMIZING_INCOMPLETE=Ne\\u00FApln\\u00E9 p\\u0159izp\\u016Fsoben\\u00ED. Obra\\u0165te se na spr\\u00E1vce syst\\u00E9mu.\r\n\r\n#XBUT: Button text to Messages\r\nview.Appointment.messages=Zpr\\u00E1vy\r\n\r\n#XGRP: Error message dialog title\r\nview.Appointment.errorMessage=Zpr\\u00E1vy ({0})\r\n\r\n#YMSG: contact not assigned to this account\r\n',
	"cus/crm/mycalendar/i18n/i18n_de.properties":'\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n\r\n#XTIT: Title of App\r\nview.Appointment.apptitle=Termine\r\n\r\n#XTIT: Title of New Appointment screen\r\nview.Appointment.newapptitle=Neuer Termin\r\n\r\n#XFLD: tooltip  for create new appointment button\r\nview.Appointment.newapptm_tt=Neuer Termin\r\n\r\n#XTIT: Title of shared calendars\r\nview.Appointment.sharedCalendars=Freigegebene Kalender\r\n\r\n#XBUT: Button text of my calendar\r\nview.Appointment.mycalendar=Mein Kalender\r\n\r\n#XTIT: Title of infotoolbar \r\nview.Appointment.myTeam=Meine Teammitglieder\r\n\r\n#XTIT: Appointment list description with location,account text and contact text\r\nview.Appointment.furtherDetails={0} | {1} ({2})\r\n\r\n#XTIT: Appointment list description with account text and contact text\r\nview.Appointment.furtherDetailsWithoutLoc={0} ({1})\r\n\r\n#XTIT: Appointment list description with loc  and account text\r\nview.Appointment.furtherDetailsWithoutContact={0} | {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Daten wurden von einem anderen Benutzer ge\\u00E4ndert. W\\u00E4hlen Sie \'OK\', um die neuesten Daten abzurufen.\r\n#XTIT: Appointment list description without loc and cantact text\r\nview.Appointment.furtherDetailsWithoutContactAndLoc={0}\r\n\r\n#XTIT: Title of Timeline\r\nview.Appointment.Timeline=Zeitleiste\r\n\r\n#XTIT: Title of Calendars\r\nview.Appointment.Calendars=Kalender\r\n\r\n#XFLD: tooltip for today button\r\nview.Appointment.today_tt=Heute\r\n\r\n#XTIT: Header text of Appointment detail\r\nview.Appointment.detail=Termindetails\r\n\r\n#XFLD: Account field label\r\nview.Appointment.account=Account\r\n\r\n#XFLD: Contact field label\r\nview.Appointment.contact=Ansprechpartner\r\n\r\n#XFLD: Employee Responsible field label\r\nview.Appointment.employeeResponsible=Zust\\u00E4ndiger Mitarbeiter\r\n\r\n#XFLD: Time field label\r\nview.Appointment.time=Zeit\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.subject=Titel\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.title=Titel\r\n\r\n#XFLD: Label for Start date and time\r\nview.Appointment.startdatetime=Beginndatum/-uhrzeit\r\n\r\n#XFLD: Label for End date and time\r\nview.Appointment.enddatetime=Enddatum/-uhrzeit\r\n\r\n#XFLD: Label for All day checkbox\r\nview.Appointment.alldayevent=Ganzt\\u00E4gig\r\n\r\n#YMSG: info message in case appointment occurs in the past\r\nview.Appointment.occurspast=Termin findet in Vergangenheit statt\r\n\r\n#YMSG: info message in case no title entered\r\nview.Appointment.notitle=Geben Sie einen Titel ein\r\n\r\n#XFLD: Label for Private checkbox\r\nview.Appointment.private=Privat\r\n\r\n#XFLD: Location field label\r\nview.Appointment.location=Ort\r\n\r\n#XFLD: Importance field label\r\nview.Appointment.importance=Wichtigkeit\r\n\r\n#XFLD: Active Status field label\r\nview.Appointment.activeStatus=Status\r\n\r\n#XFLD: Notes field label\r\nview.Appointment.notes=Notizen\r\n\r\n#XFLD: Note field label\r\nview.Appointment.note=Notizen\r\n\r\n#XFLD: Label for internal attendees\r\nview.Appointment.internal=Intern\r\n\r\n#XFLD: Label for external attendees\r\nview.Appointment.external=Extern\r\n\r\n#XGRP: Group header of the section for showing the general data\r\nview.Appointment.generalData=Allgemeine Daten\r\n\r\n#XGRP: Group header of the section for showing the contact data\r\nview.Appointment.contactData=Ansprechpartner\r\n\r\n#XGRP: Group header of the section for showing the attendees\r\nview.Appointment.attendeeData=Teilnehmer\r\n\r\n#XGRP: Group header attendees with number\r\nview.Appointment.attendeeDataNumber=Teilnehmer ({0})\r\n\r\n#XGRP: Group header additional attendees with number\r\nview.Appointment.additionalAttendeeNumber=Weitere Teilnehmer ({0})\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.detailData=Details\r\n\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.appointmentDetail=Termin\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Opportunity=Opportunity\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Task=Aufgabe\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.attachmentData=Anlagen\r\n\r\n#XGRP: Group header attachments with number how many\r\nview.Appointment.attachmentDataNumber=Anlagen ({0})\r\n\r\n#XGRP: Group header attachments with request to save the appointment before file upload \r\nview.Appointment.attachmentSaveRequest=Anlagen (vor Hochladen sichern)\r\n\r\n#XBUT: Button text to Delete\r\nview.Appointment.delete=L\\u00F6schen\r\n\r\n#XBUT: Button text to Follow up\r\nview.Appointment.followup=Folgevorgang\r\n\r\n#YMSG: no transaction types  present\r\nview.Appointment.FOLLOWUPERROR=Keine Vorgangsarten gefunden. Pr\\u00FCfen Sie bitte Ihr Backend-Customizing.\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.deletesuccess=Termin gel\\u00F6scht\r\n\r\n#YMSG: successful followup message in message toast\r\nview.Appointment.followupsuccessful=Folgetermin gesichert\r\n\r\n#XBUT: Button text to Edit\r\nview.Appointment.edit=Bearbeiten\r\n\r\n#XBUT: Button text to Done\r\nview.Appointment.done=Fertig\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.cancel=Abbrechen\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.ok=OK\r\n\r\n#XBUT: Button text to Create\r\nview.Appointment.create=Anlegen\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.savesuccess=Termin gesichert\r\n\r\n#XBUT: Button text to SAve\r\nview.Appointment.save=Sichern\r\n\r\n#XBUT: Button text for Day\r\nview.Appointment.day=Tag\r\n\r\n#XBUT: Button text for week\r\nview.Appointment.week=Woche\r\n\r\n#XBUT: Button text for month\r\nview.Appointment.month=Monat\r\n\r\n#XFLD: loading text for the appointment list\r\nview.Appointment.loaddatatext=Ladevorgang l\\u00E4uft...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.acsea_title=Accounts ({0})\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.acsea_nodata=Keine Accounts gefunden\r\n\r\n#XFLD: placeholdertext for search fields\r\nview.Appointment.searchfieldplaceholder=Suchen\r\n\r\n#XFLD: placeholdertext for search busy text\r\nview.Appointment.searchlistinfo=Suche wird ausgef\\u00FChrt...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.consea_title=Ansprechpartner ({0})\r\n\r\n#XTIT: title of the business card for accounts\r\nview.Appointment.account_title=Account\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.employee_title=Mitarbeiter\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.contact_title=Ansprechpartner\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.consea_nodata=Keine Ansprechpartner gefunden\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.empsea_nodata=Keine Mitarbeiter gefunden\r\n\r\n#XTIT: title of internal attendees search popup\r\nview.Appointment.internal_title=Interne Teilnehmer ({0})\r\n\r\n#XTIT: title of external attendees search popup\r\nview.Appointment.external_title=Externe Teilnehmer ({0})\r\n\r\n#XTIT: title of internal attendees search popup enhanced with total count\r\nview.Appointment.internal_titlenew=Neue interne Teilnehmer ({0})\r\n\r\n#XTIT: title of external attendees search popup enhanced with total count\r\nview.Appointment.external_titlenew=Neue externe Teilnehmer ({0})\r\n\r\n#YMSG: Filtered by info bar text for contact search popup\r\nview.Appointment.filteredby=Gefiltert nach\r\n\r\n#YMSG: filter line for cross navigation: Filter by Account \r\nview.Appointment.filteraccount=Gefiltert nach Account\r\n\r\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\r\nview.Appointment.duration.min={0} Min\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\r\nview.Appointment.duration.hour={0} Std\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.day={0} Tag\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.days={0} Tage\r\n\r\n#XTIT: Button text to Delete \r\nview.Appointment.deleteTitle=L\\u00F6schen\r\n\r\n#YINS: Text for Pop Up action.  User to react (Yes/No) \r\nview.Appointment.deleteInstruction=Diesen Termin l\\u00F6schen?\r\n\r\n#XBUT: User to react (positive) to delete action \r\nview.Appointment.deleteYes=OK\r\n\r\n#XFLD: placeholder text for fiels adding external attendees\r\nview.Appointment.attexternaladd=Externen Teilnehmer hinzuf\\u00FCgen\r\n\r\n#XFLD: placeholder text for fiels adding internal attendees\r\nview.Appointment.attinternaladd=Kollege hinzuf\\u00FCgen\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.fromTimeDate=Von {0} {1}\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.toTimeDate=Bis {0} {1}\r\n\r\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\r\nview.Appointment.timeToTime={0} bis {1}\r\n\r\n#XFLD: empty appointment list text \r\nview.Appointment.appointment_nodata=Keine Termine\r\n\r\n#XFLD: employee fullname: {0} firstname {1} lastname\r\nview.Appointment.employeename={0} {1}\r\n\r\n#XTIT: Title for Edit Appointment page\r\nview.Appointment.editappointment=Termin bearbeiten\r\n\r\n#YMSG: Error when end time is before start time (on same day)\r\nview.Appointment.wrongTimes=Enduhrzeit liegt vor Beginnuhrzeit\r\n\r\n#YMSG: Error when end date is before start date\r\nview.Appointment.wrongDates=Enddatum liegt vor Beginndatum\r\n\r\n#XBUT: Button text for Add Button\r\nview.Appointment.add=Hinzuf\\u00FCgen\r\n\r\n#XTIT: Shell Title of App\r\nview.Appointment.shelltitle=Meine Termine\r\n\r\n#XFLD: empty list text for external attendee popup\r\nview.Appointment.noextattendees=Keine externen Teilnehmer\r\n\r\n#XFLD: empty list text for internal attendee popup\r\nview.Appointment.nointattendees=Keine internen Teilnehmer\r\n\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Nur Ihre Termine werden angezeigt\r\n\r\n#YMSG: info message in case edit page is left with back and data changed\r\nview.Appointment.leaveeditmessage=Ihre Eintr\\u00E4ge gehen verloren, wenn Sie diese Seite verlassen. M\\u00F6chten Sie fortfahren?\r\n\r\n#YMSG: info message in case of wrong format of Start Date\r\nview.Appointment.validStartDate=Geben Sie ein g\\u00FCltiges Beginndatum ein\r\n\r\n#YMSG: info message in case of wrong format of End Date\r\nview.Appointment.validEndDate=Geben Sie ein g\\u00FCltiges Enddatum ein\r\n\r\n#YMSG: info message in case of wrong format of Start Date and End Date\r\nview.Appointment.validStartEndDate=Geben Sie ein g\\u00FCltiges Beginn- und Enddatum ein\r\n\r\n#XTIT: Title for Process type dialog\r\nview.Appointment.process_type=Vorgangsart ausw\\u00E4hlen\r\n\r\n#XFLD: No Data text when loading/searching list\r\nview.Appointment.no_data_text=Derzeit sind keine Positionen verf\\u00FCgbar\r\n\r\n#XFLD: Transaction Type\r\nview.Appointment.TransactionType=Art\r\n\r\n#YMSG : PRIVATE appointment message\r\nview.Appointment.privateMessage=Dies ist ein privater Termin\r\n\r\n#XFLD: Title for private appointment in shared calendar\r\nview.Appointment.privateAppointment=Privater Termin\r\n#XTIT: this is the title for the Transaction History Tab\r\nTRANS_HISTORY=Vorgangshistorie\r\n\r\n#XFLD, 30: Field Transaction ID on List\r\nTRANS_ID=Vorgangs-ID\r\n\r\n#XFLD, 30: Field Transaction Type on List\r\nTRANS_TYPE=Vorgangsart\r\n\r\n#XFLD, 30: Field Description on List\r\nTRANS_DESC=Beschreibung\r\n\r\n#XFLD, 30: Field Created On on List\r\nCREATED_ON=Angelegt am\r\n\r\n#XFLD, 30: Field Created On on List\r\nRELATIONSHIP=Beziehungsart\r\n\r\n#XFLD, 15: Priority label\r\nview.Appointment.priority=Priorit\\u00E4t\r\n\r\n#YMSG, 50:Customizing incomplete\r\nCUSTOMIZING_INCOMPLETE=Unvollst\\u00E4ndige Customizing-Einstellungen. Bitte wenden Sie sich an Ihre Systemadministration.\r\n\r\n#XBUT: Button text to Messages\r\nview.Appointment.messages=Meldungen\r\n\r\n#XGRP: Error message dialog title\r\nview.Appointment.errorMessage=Nachrichten ({0})\r\n\r\n#YMSG: contact not assigned to this account\r\n',
	"cus/crm/mycalendar/i18n/i18n_en.properties":'\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n\r\n#XTIT: Title of App\r\nview.Appointment.apptitle=Appointments\r\n\r\n#XTIT: Title of New Appointment screen\r\nview.Appointment.newapptitle=New Appointment\r\n\r\n#XFLD: tooltip  for create new appointment button\r\nview.Appointment.newapptm_tt=New Appointment\r\n\r\n#XTIT: Title of shared calendars\r\nview.Appointment.sharedCalendars=Shared Calendars\r\n\r\n#XBUT: Button text of my calendar\r\nview.Appointment.mycalendar=My Calendar\r\n\r\n#XTIT: Title of infotoolbar \r\nview.Appointment.myTeam=My Team Members\r\n\r\n#XTIT: Appointment list description with location,account text and contact text\r\nview.Appointment.furtherDetails={0} | {1} ({2})\r\n\r\n#XTIT: Appointment list description with account text and contact text\r\nview.Appointment.furtherDetailsWithoutLoc={0} ({1})\r\n\r\n#XTIT: Appointment list description with loc  and account text\r\nview.Appointment.furtherDetailsWithoutContact={0} | {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Data has been changed by another user. Choose OK to retrieve the latest data.\r\n#XTIT: Appointment list description without loc and cantact text\r\nview.Appointment.furtherDetailsWithoutContactAndLoc={0}\r\n\r\n#XTIT: Title of Timeline\r\nview.Appointment.Timeline=Timeline\r\n\r\n#XTIT: Title of Calendars\r\nview.Appointment.Calendars=Calendars\r\n\r\n#XFLD: tooltip for today button\r\nview.Appointment.today_tt=Today\r\n\r\n#XTIT: Header text of Appointment detail\r\nview.Appointment.detail=Appointment Details\r\n\r\n#XFLD: Account field label\r\nview.Appointment.account=Account\r\n\r\n#XFLD: Contact field label\r\nview.Appointment.contact=Contact\r\n\r\n#XFLD: Employee Responsible field label\r\nview.Appointment.employeeResponsible=Employee Responsible\r\n\r\n#XFLD: Time field label\r\nview.Appointment.time=Time\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.subject=Title\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.title=Title\r\n\r\n#XFLD: Label for Start date and time\r\nview.Appointment.startdatetime=Start Date and Time\r\n\r\n#XFLD: Label for End date and time\r\nview.Appointment.enddatetime=End Date and Time\r\n\r\n#XFLD: Label for All day checkbox\r\nview.Appointment.alldayevent=All Day\r\n\r\n#YMSG: info message in case appointment occurs in the past\r\nview.Appointment.occurspast=Appointment occurs in the past\r\n\r\n#YMSG: info message in case no title entered\r\nview.Appointment.notitle=Enter a title\r\n\r\n#XFLD: Label for Private checkbox\r\nview.Appointment.private=Private\r\n\r\n#XFLD: Location field label\r\nview.Appointment.location=Location\r\n\r\n#XFLD: Importance field label\r\nview.Appointment.importance=Importance\r\n\r\n#XFLD: Active Status field label\r\nview.Appointment.activeStatus=Status\r\n\r\n#XFLD: Notes field label\r\nview.Appointment.notes=Notes\r\n\r\n#XFLD: Note field label\r\nview.Appointment.note=Notes\r\n\r\n#XFLD: Label for internal attendees\r\nview.Appointment.internal=Internal\r\n\r\n#XFLD: Label for external attendees\r\nview.Appointment.external=External\r\n\r\n#XGRP: Group header of the section for showing the general data\r\nview.Appointment.generalData=General Data\r\n\r\n#XGRP: Group header of the section for showing the contact data\r\nview.Appointment.contactData=Contact\r\n\r\n#XGRP: Group header of the section for showing the attendees\r\nview.Appointment.attendeeData=Attendees\r\n\r\n#XGRP: Group header attendees with number\r\nview.Appointment.attendeeDataNumber=Attendees ({0})\r\n\r\n#XGRP: Group header additional attendees with number\r\nview.Appointment.additionalAttendeeNumber=Additional Attendees ({0})\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.detailData=Details\r\n\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.appointmentDetail=Appointment\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Opportunity=Opportunity\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Task=Task\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.attachmentData=Attachments\r\n\r\n#XGRP: Group header attachments with number how many\r\nview.Appointment.attachmentDataNumber=Attachments ({0})\r\n\r\n#XGRP: Group header attachments with request to save the appointment before file upload \r\nview.Appointment.attachmentSaveRequest=Attachments (Save Before Upload)\r\n\r\n#XBUT: Button text to Delete\r\nview.Appointment.delete=Delete\r\n\r\n#XBUT: Button text to Follow up\r\nview.Appointment.followup=Follow Up\r\n\r\n#YMSG: no transaction types  present\r\nview.Appointment.FOLLOWUPERROR=No transaction types found. Please check your back-end customizing.\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.deletesuccess=Appointment deleted\r\n\r\n#YMSG: successful followup message in message toast\r\nview.Appointment.followupsuccessful=Follow-up appointment saved\r\n\r\n#XBUT: Button text to Edit\r\nview.Appointment.edit=Edit\r\n\r\n#XBUT: Button text to Done\r\nview.Appointment.done=Done\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.cancel=Cancel\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.ok=OK\r\n\r\n#XBUT: Button text to Create\r\nview.Appointment.create=Create\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.savesuccess=Appointment saved\r\n\r\n#XBUT: Button text to SAve\r\nview.Appointment.save=Save\r\n\r\n#XBUT: Button text for Day\r\nview.Appointment.day=Day\r\n\r\n#XBUT: Button text for week\r\nview.Appointment.week=Week\r\n\r\n#XBUT: Button text for month\r\nview.Appointment.month=Month\r\n\r\n#XFLD: loading text for the appointment list\r\nview.Appointment.loaddatatext=Loading...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.acsea_title=Accounts ({0})\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.acsea_nodata=No accounts found\r\n\r\n#XFLD: placeholdertext for search fields\r\nview.Appointment.searchfieldplaceholder=Search\r\n\r\n#XFLD: placeholdertext for search busy text\r\nview.Appointment.searchlistinfo=Searching...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.consea_title=Contacts ({0})\r\n\r\n#XTIT: title of the business card for accounts\r\nview.Appointment.account_title=Account\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.employee_title=Employee\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.contact_title=Contact\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.consea_nodata=No contacts found\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.empsea_nodata=No employees found\r\n\r\n#XTIT: title of internal attendees search popup\r\nview.Appointment.internal_title=Internal Attendees ({0})\r\n\r\n#XTIT: title of external attendees search popup\r\nview.Appointment.external_title=External Attendees ({0})\r\n\r\n#XTIT: title of internal attendees search popup enhanced with total count\r\nview.Appointment.internal_titlenew=New Internal Attendees ({0})\r\n\r\n#XTIT: title of external attendees search popup enhanced with total count\r\nview.Appointment.external_titlenew=New External Attendees ({0})\r\n\r\n#YMSG: Filtered by info bar text for contact search popup\r\nview.Appointment.filteredby=Filtered By\r\n\r\n#YMSG: filter line for cross navigation: Filter by Account \r\nview.Appointment.filteraccount=Filtered by Account\r\n\r\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\r\nview.Appointment.duration.min={0} min\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\r\nview.Appointment.duration.hour={0} h\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.day={0} day\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.days={0} days\r\n\r\n#XTIT: Button text to Delete \r\nview.Appointment.deleteTitle=Delete\r\n\r\n#YINS: Text for Pop Up action.  User to react (Yes/No) \r\nview.Appointment.deleteInstruction=Delete this appointment?\r\n\r\n#XBUT: User to react (positive) to delete action \r\nview.Appointment.deleteYes=OK\r\n\r\n#XFLD: placeholder text for fiels adding external attendees\r\nview.Appointment.attexternaladd=Add external attendee\r\n\r\n#XFLD: placeholder text for fiels adding internal attendees\r\nview.Appointment.attinternaladd=Add a colleague\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.fromTimeDate=From {0} {1}\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.toTimeDate=To {0} {1}\r\n\r\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\r\nview.Appointment.timeToTime={0} to {1}\r\n\r\n#XFLD: empty appointment list text \r\nview.Appointment.appointment_nodata=No appointments\r\n\r\n#XFLD: employee fullname: {0} firstname {1} lastname\r\nview.Appointment.employeename={0} {1}\r\n\r\n#XTIT: Title for Edit Appointment page\r\nview.Appointment.editappointment=Edit Appointment\r\n\r\n#YMSG: Error when end time is before start time (on same day)\r\nview.Appointment.wrongTimes=End time is before start time\r\n\r\n#YMSG: Error when end date is before start date\r\nview.Appointment.wrongDates=End date is before start date\r\n\r\n#XBUT: Button text for Add Button\r\nview.Appointment.add=Add\r\n\r\n#XTIT: Shell Title of App\r\nview.Appointment.shelltitle=My Appointments\r\n\r\n#XFLD: empty list text for external attendee popup\r\nview.Appointment.noextattendees=No external attendees\r\n\r\n#XFLD: empty list text for internal attendee popup\r\nview.Appointment.nointattendees=No internal attendees\r\n\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Only your appointments are displayed\r\n\r\n#YMSG: info message in case edit page is left with back and data changed\r\nview.Appointment.leaveeditmessage=Your entries will be lost if you leave this page. Do you want to continue?\r\n\r\n#YMSG: info message in case of wrong format of Start Date\r\nview.Appointment.validStartDate=Enter a valid start date\r\n\r\n#YMSG: info message in case of wrong format of End Date\r\nview.Appointment.validEndDate=Enter a valid end date\r\n\r\n#YMSG: info message in case of wrong format of Start Date and End Date\r\nview.Appointment.validStartEndDate=Enter a valid start date and end date\r\n\r\n#XTIT: Title for Process type dialog\r\nview.Appointment.process_type=Select Transaction Type\r\n\r\n#XFLD: No Data text when loading/searching list\r\nview.Appointment.no_data_text=No items are currently available\r\n\r\n#XFLD: Transaction Type\r\nview.Appointment.TransactionType=Type\r\n\r\n#YMSG : PRIVATE appointment message\r\nview.Appointment.privateMessage=This is a private appointment\r\n\r\n#XFLD: Title for private appointment in shared calendar\r\nview.Appointment.privateAppointment=Private Appointment\r\n#XTIT: this is the title for the Transaction History Tab\r\nTRANS_HISTORY=Transaction History\r\n\r\n#XFLD, 30: Field Transaction ID on List\r\nTRANS_ID=Transaction ID\r\n\r\n#XFLD, 30: Field Transaction Type on List\r\nTRANS_TYPE=Transaction Type\r\n\r\n#XFLD, 30: Field Description on List\r\nTRANS_DESC=Description\r\n\r\n#XFLD, 30: Field Created On on List\r\nCREATED_ON=Created On\r\n\r\n#XFLD, 30: Field Created On on List\r\nRELATIONSHIP=Relation Type\r\n\r\n#XFLD, 15: Priority label\r\nview.Appointment.priority=Priority\r\n\r\n#YMSG, 50:Customizing incomplete\r\nCUSTOMIZING_INCOMPLETE=Incomplete customizing. Please contact your system administrator.\r\n\r\n#XBUT: Button text to Messages\r\nview.Appointment.messages=Messages\r\n\r\n#XGRP: Error message dialog title\r\nview.Appointment.errorMessage=Messages ({0})\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=You can only view business cards of contacts that have been assigned to this account\r\n',
	"cus/crm/mycalendar/i18n/i18n_en_US_sappsd.properties":'\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n\r\n#XTIT: Title of App\r\nview.Appointment.apptitle=[[[\\u0100\\u03C1\\u03C1\\u014F\\u012F\\u014B\\u0163\\u0271\\u0113\\u014B\\u0163\\u015F]]]\r\n\r\n#XTIT: Title of New Appointment screen\r\nview.Appointment.newapptitle=[[[\\u0143\\u0113\\u0175 \\u0100\\u03C1\\u03C1\\u014F\\u012F\\u014B\\u0163\\u0271\\u0113\\u014B\\u0163]]]\r\n\r\n#XFLD: tooltip  for create new appointment button\r\nview.Appointment.newapptm_tt=[[[\\u0143\\u0113\\u0175 \\u0100\\u03C1\\u03C1\\u014F\\u012F\\u014B\\u0163\\u0271\\u0113\\u014B\\u0163]]]\r\n\r\n#XTIT: Title of shared calendars\r\nview.Appointment.sharedCalendars=[[[\\u015C\\u0125\\u0105\\u0157\\u0113\\u018C \\u0108\\u0105\\u013A\\u0113\\u014B\\u018C\\u0105\\u0157\\u015F]]]\r\n\r\n#XBUT: Button text of my calendar\r\nview.Appointment.mycalendar=[[[\\u039C\\u0177\\u0108\\u0105\\u013A\\u0113\\u014B\\u018C\\u0105\\u0157]]]\r\n\r\n#XTIT: Title of infotoolbar \r\nview.Appointment.myTeam=[[[\\u039C\\u0177 \\u0163\\u0113\\u0105\\u0271 \\u0271\\u0113\\u0271\\u0183\\u0113\\u0157\\u015F ]]]\r\n\r\n#XTIT: Appointment list description with location,account text and contact text\r\nview.Appointment.furtherDetails={0}[[[ | {1} ({2})]]]\r\n\r\n#XTIT: Appointment list description with account text and contact text\r\nview.Appointment.furtherDetailsWithoutLoc={0}[[[ ({1})]]]\r\n\r\n#XTIT: Appointment list description with loc  and account text\r\nview.Appointment.furtherDetailsWithoutContact={0}[[[ | ]]]{1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=[[[\\u010E\\u0105\\u0163\\u0105 \\u0125\\u0105\\u015F \\u0183\\u0113\\u0113\\u014B \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u018C \\u0183\\u0177 \\u0105\\u014B\\u014F\\u0163\\u0125\\u0113\\u0157 \\u0171\\u015F\\u0113\\u0157. \\u0108\\u013A\\u012F\\u010B\\u0137 \\u014E\\u0136 \\u0163\\u014F \\u0192\\u0113\\u0163\\u010B\\u0125 \\u0163\\u0125\\u0113 \\u013A\\u0105\\u0163\\u0113\\u015F\\u0163.]]]\r\n#XTIT: Appointment list description without loc and cantact text\r\nview.Appointment.furtherDetailsWithoutContactAndLoc={0}\r\n\r\n#XTIT: Title of Timeline\r\nview.Appointment.Timeline=[[[\\u0162\\u012F\\u0271\\u0113\\u013A\\u012F\\u014B\\u0113]]]\r\n\r\n#XTIT: Title of Calendars\r\nview.Appointment.Calendars=[[[\\u0108\\u0105\\u013A\\u0113\\u014B\\u018C\\u0105\\u0157\\u015F]]]\r\n\r\n#XFLD: tooltip for today button\r\nview.Appointment.today_tt=[[[\\u0162\\u014F\\u018C\\u0105\\u0177]]]\r\n\r\n#XTIT: Header text of Appointment detail\r\nview.Appointment.detail=[[[\\u0100\\u03C1\\u03C1\\u014F\\u012F\\u014B\\u0163\\u0271\\u0113\\u014B\\u0163 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A]]]\r\n\r\n#XFLD: Account field label\r\nview.Appointment.account=[[[\\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163]]]\r\n\r\n#XFLD: Contact field label\r\nview.Appointment.contact=[[[\\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163]]]\r\n\r\n#XFLD: Employee Responsible field label\r\nview.Appointment.employeeResponsible=[[[\\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113 \\u0158\\u0113\\u015F\\u03C1\\u014F\\u014B\\u015F\\u012F\\u0183\\u013A\\u0113]]]\r\n\r\n#XFLD: Time field label\r\nview.Appointment.time=[[[\\u0162\\u012F\\u0271\\u0113]]]\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.subject=[[[\\u0162\\u012F\\u0163\\u013A\\u0113]]]\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.title=[[[\\u0162\\u012F\\u0163\\u013A\\u0113]]]\r\n\r\n#XFLD: Label for Start date and time\r\nview.Appointment.startdatetime=[[[\\u015C\\u0163\\u0105\\u0157\\u0163 \\u010E\\u0105\\u0163\\u0113 \\u0105\\u014B\\u018C \\u0162\\u012F\\u0271\\u0113]]]\r\n\r\n#XFLD: Label for End date and time\r\nview.Appointment.enddatetime=[[[\\u0114\\u014B\\u018C \\u010E\\u0105\\u0163\\u0113 \\u0105\\u014B\\u018C \\u0162\\u012F\\u0271\\u0113]]]\r\n\r\n#XFLD: Label for All day checkbox\r\nview.Appointment.alldayevent=[[[\\u0100\\u013A\\u013A \\u010E\\u0105\\u0177]]]\r\n\r\n#YMSG: info message in case appointment occurs in the past\r\nview.Appointment.occurspast=[[[\\u0100\\u03C1\\u03C1\\u014F\\u012F\\u014B\\u0163\\u0271\\u0113\\u014B\\u0163 \\u014F\\u010B\\u010B\\u0171\\u0157\\u015F \\u012F\\u014B \\u0163\\u0125\\u0113 \\u03C1\\u0105\\u015F\\u0163]]]\r\n\r\n#YMSG: info message in case no title entered\r\nview.Appointment.notitle=[[[\\u0114\\u014B\\u0163\\u0113\\u0157 \\u0105\\u014B \\u0105\\u03C1\\u03C1\\u014F\\u012F\\u014B\\u0163\\u0271\\u0113\\u014B\\u0163 \\u0163\\u012F\\u0163\\u013A\\u0113]]]\r\n\r\n#XFLD: Label for Private checkbox\r\nview.Appointment.private=[[[\\u01A4\\u0157\\u012F\\u028B\\u0105\\u0163\\u0113]]]\r\n\r\n#XFLD: Location field label\r\nview.Appointment.location=[[[\\u013B\\u014F\\u010B\\u0105\\u0163\\u012F\\u014F\\u014B]]]\r\n\r\n#XFLD: Importance field label\r\nview.Appointment.importance=[[[\\u012C\\u0271\\u03C1\\u014F\\u0157\\u0163\\u0105\\u014B\\u010B\\u0113]]]\r\n\r\n#XFLD: Active Status field label\r\nview.Appointment.activeStatus=[[[\\u0100\\u010B\\u0163\\u012F\\u028B\\u0113 \\u015C\\u0163\\u0105\\u0163\\u0171\\u015F]]]\r\n\r\n#XFLD: Notes field label\r\nview.Appointment.notes=[[[\\u0143\\u014F\\u0163\\u0113\\u015F]]]\r\n\r\n#XFLD: Note field label\r\nview.Appointment.note=[[[\\u0143\\u014F\\u0163\\u0113]]]\r\n\r\n#XFLD: Label for internal attendees\r\nview.Appointment.internal=[[[\\u012C\\u014B\\u0163\\u0113\\u0157\\u014B\\u0105\\u013A]]]\r\n\r\n#XFLD: Label for external attendees\r\nview.Appointment.external=[[[\\u0114\\u03C7\\u0163\\u0113\\u0157\\u014B\\u0105\\u013A]]]\r\n\r\n#XGRP: Group header of the section for showing the general data\r\nview.Appointment.generalData=[[[\\u0122\\u0113\\u014B\\u0113\\u0157\\u0105\\u013A]]]\r\n\r\n#XGRP: Group header of the section for showing the contact data\r\nview.Appointment.contactData=[[[\\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163]]]\r\n\r\n#XGRP: Group header of the section for showing the attendees\r\nview.Appointment.attendeeData=[[[\\u0100\\u0163\\u0163\\u0113\\u014B\\u018C\\u0113\\u0113\\u015F]]]\r\n\r\n#XGRP: Group header attendees with number\r\nview.Appointment.attendeeDataNumber=[[[\\u0100\\u0163\\u0163\\u0113\\u014B\\u018C\\u0113\\u0113\\u015F ({0})]]]\r\n\r\n#XGRP: Group header additional attendees with number\r\nview.Appointment.additionalAttendeeNumber=[[[\\u0100\\u018C\\u018C\\u012F\\u0163\\u012F\\u014F\\u014B\\u0105\\u013A \\u0100\\u0163\\u0163\\u0113\\u014B\\u018C\\u0113\\u0113\\u015F ({0})]]]\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.detailData=[[[\\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F]]]\r\n\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.appointmentDetail=[[[\\u0100\\u03C1\\u03C1\\u014F\\u012F\\u014B\\u0163\\u0271\\u0113\\u014B\\u0163]]]\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Opportunity=[[[\\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u0177]]]\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Task=[[[\\u0162\\u0105\\u015F\\u0137]]]\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.attachmentData=[[[\\u0100\\u0163\\u0163\\u0105\\u010B\\u0125\\u0271\\u0113\\u014B\\u0163\\u015F]]]\r\n\r\n#XGRP: Group header attachments with number how many\r\nview.Appointment.attachmentDataNumber=[[[\\u0100\\u0163\\u0163\\u0105\\u010B\\u0125\\u0271\\u0113\\u014B\\u0163\\u015F ({0})]]]\r\n\r\n#XGRP: Group header attachments with request to save the appointment before file upload \r\nview.Appointment.attachmentSaveRequest=[[[\\u0100\\u0163\\u0163\\u0105\\u010B\\u0125\\u0271\\u0113\\u014B\\u0163\\u015F (\\u015C\\u0105\\u028B\\u0113 \\u0191\\u012F\\u0157\\u015F\\u0163 \\u0181\\u0113\\u0192\\u014F\\u0157\\u0113 \\u016E\\u03C1\\u013A\\u014F\\u0105\\u018C\\u012F\\u014B\\u011F \\u0100\\u0163\\u0163\\u0105\\u010B\\u0125\\u0271\\u0113\\u014B\\u0163\\u015F)]]]\r\n\r\n#XBUT: Button text to Delete\r\nview.Appointment.delete=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113]]]\r\n\r\n#XBUT: Button text to Follow up\r\nview.Appointment.followup=[[[\\u0191\\u014F\\u013A\\u013A\\u014F\\u0175 \\u016E\\u03C1]]]\r\n\r\n#YMSG: no transaction types  present\r\nview.Appointment.FOLLOWUPERROR=[[[\\u0114\\u012F\\u0163\\u0125\\u0113\\u0157 \\u0163\\u0125\\u0113 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163 \\u0105\\u03C1\\u03C1\\u014F\\u012F\\u014B\\u0163\\u0271\\u0113\\u014B\\u0163 \\u0125\\u0105\\u015F \\u0113\\u0157\\u0157\\u014F\\u0157\\u015F \\u014F\\u0157 \\u0163\\u0125\\u0113\\u0157\\u0113 \\u0105\\u0157\\u0113 \\u014B\\u014F \\u0192\\u014F\\u013A\\u013A\\u014F\\u0175 \\u0171\\u03C1 \\u0163\\u0157\\u0105\\u014B\\u015F\\u0105\\u010B\\u0163\\u012F\\u014F\\u014B \\u0163\\u0177\\u03C1\\u0113\\u015F \\u0271\\u0105\\u012F\\u014B\\u0163\\u0105\\u012F\\u014B\\u0113\\u018C \\u012F\\u014B \\u0163\\u0125\\u0113 \\u0108\\u0171\\u015F\\u0163\\u014F\\u0271\\u012F\\u017E\\u012F\\u014B\\u011F]]]\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.deletesuccess=[[[\\u0100\\u03C1\\u03C1\\u014F\\u012F\\u014B\\u0163\\u0271\\u0113\\u014B\\u0163 \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113\\u018C]]]\r\n\r\n#YMSG: successful followup message in message toast\r\nview.Appointment.followupsuccessful=[[[\\u0191\\u014F\\u013A\\u013A\\u014F\\u0175 \\u0171\\u03C1 \\u0105\\u03C1\\u03C1\\u014F\\u012F\\u014B\\u0163\\u0271\\u0113\\u014B\\u0163 \\u015F\\u0105\\u028B\\u0113\\u018C]]]\r\n\r\n#XBUT: Button text to Edit\r\nview.Appointment.edit=[[[\\u0114\\u018C\\u012F\\u0163]]]\r\n\r\n#XBUT: Button text to Done\r\nview.Appointment.done=[[[\\u010E\\u014F\\u014B\\u0113]]]\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.cancel=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A]]]\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.ok=[[[\\u014E\\u0136]]]\r\n\r\n#XBUT: Button text to Create\r\nview.Appointment.create=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113]]]\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.savesuccess=[[[\\u0100\\u03C1\\u03C1\\u014F\\u012F\\u014B\\u0163\\u0271\\u0113\\u014B\\u0163 \\u015F\\u0105\\u028B\\u0113\\u018C]]]\r\n\r\n#XBUT: Button text to SAve\r\nview.Appointment.save=[[[\\u015C\\u0105\\u028B\\u0113]]]\r\n\r\n#XBUT: Button text for Day\r\nview.Appointment.day=[[[\\u010E\\u0105\\u0177]]]\r\n\r\n#XBUT: Button text for week\r\nview.Appointment.week=[[[\\u0174\\u0113\\u0113\\u0137]]]\r\n\r\n#XBUT: Button text for month\r\nview.Appointment.month=[[[\\u039C\\u014F\\u014B\\u0163\\u0125]]]\r\n\r\n#XFLD: loading text for the appointment list\r\nview.Appointment.loaddatatext=[[[\\u013B\\u014F\\u0105\\u018C\\u012F\\u014B\\u011F...]]]\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.acsea_title=[[[\\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163\\u015F ({0})]]]\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.acsea_nodata=[[[\\u0143\\u014F \\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163\\u015F \\u0192\\u014F\\u0171\\u014B\\u018C]]]\r\n\r\n#XFLD: placeholdertext for search fields\r\nview.Appointment.searchfieldplaceholder=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125]]]\r\n\r\n#XFLD: placeholdertext for search busy text\r\nview.Appointment.searchlistinfo=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125\\u012F\\u014B\\u011F...]]]\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.consea_title=[[[\\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163\\u015F ({0})]]]\r\n\r\n#XTIT: title of the business card for accounts\r\nview.Appointment.account_title=[[[\\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163]]]\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.employee_title=[[[\\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113]]]\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.contact_title=[[[\\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163]]]\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.consea_nodata=[[[\\u0143\\u014F \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163\\u015F \\u0192\\u014F\\u0171\\u014B\\u018C]]]\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.empsea_nodata=[[[\\u0143\\u014F \\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113\\u015F \\u0192\\u014F\\u0171\\u014B\\u018C]]]\r\n\r\n#XTIT: title of internal attendees search popup\r\nview.Appointment.internal_title=[[[\\u012C\\u014B\\u0163\\u0113\\u0157\\u014B\\u0105\\u013A \\u0100\\u0163\\u0163\\u0113\\u014B\\u018C\\u0113\\u0113\\u015F ({0})]]]\r\n\r\n#XTIT: title of external attendees search popup\r\nview.Appointment.external_title=[[[\\u0114\\u03C7\\u0163\\u0113\\u0157\\u014B\\u0105\\u013A \\u0100\\u0163\\u0163\\u0113\\u014B\\u018C\\u0113\\u0113\\u015F ({0})]]]\r\n\r\n#XTIT: title of internal attendees search popup enhanced with total count\r\nview.Appointment.internal_titlenew=[[[\\u0143\\u0113\\u0175 \\u012C\\u014B\\u0163\\u0113\\u0157\\u014B\\u0105\\u013A \\u0100\\u0163\\u0163\\u0113\\u014B\\u018C\\u0113\\u0113\\u015F ({0})]]]\r\n\r\n#XTIT: title of external attendees search popup enhanced with total count\r\nview.Appointment.external_titlenew=[[[\\u0143\\u0113\\u0175 \\u0114\\u03C7\\u0163\\u0113\\u0157\\u014B\\u0105\\u013A \\u0100\\u0163\\u0163\\u0113\\u014B\\u018C\\u0113\\u0113\\u015F ({0})]]]\r\n\r\n#YMSG: Filtered by info bar text for contact search popup\r\nview.Appointment.filteredby=[[[\\u0191\\u012F\\u013A\\u0163\\u0113\\u0157\\u0113\\u018C \\u0183\\u0177]]]\r\n\r\n#YMSG: filter line for cross navigation: Filter by Account \r\nview.Appointment.filteraccount=[[[\\u0191\\u012F\\u013A\\u0163\\u0113\\u0157\\u0113\\u018C \\u0183\\u0177 \\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163]]]\r\n\r\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\r\nview.Appointment.duration.min={0}[[[ \\u0271\\u012F\\u014B]]]\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\r\nview.Appointment.duration.hour={0}[[[ \\u0125]]]\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.day={0}[[[ \\u018C\\u0105\\u0177]]]\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.days={0}[[[ \\u018C\\u0105\\u0177\\u015F]]]\r\n\r\n#XTIT: Button text to Delete \r\nview.Appointment.deleteTitle=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113 ]]]\r\n\r\n#YINS: Text for Pop Up action.  User to react (Yes/No) \r\nview.Appointment.deleteInstruction=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113 \\u0163\\u0125\\u012F\\u015F \\u0105\\u03C1\\u03C1\\u014F\\u012F\\u014B\\u0163\\u0271\\u0113\\u014B\\u0163? ]]]\r\n\r\n#XBUT: User to react (positive) to delete action \r\nview.Appointment.deleteYes=[[[\\u014E\\u0137]]]\r\n\r\n#XFLD: placeholder text for fiels adding external attendees\r\nview.Appointment.attexternaladd=[[[\\u0100\\u018C\\u018C \\u0113\\u03C7\\u0163\\u0113\\u0157\\u014B\\u0105\\u013A \\u0105\\u0163\\u0163\\u0113\\u014B\\u018C\\u0113\\u0113]]]\r\n\r\n#XFLD: placeholder text for fiels adding internal attendees\r\nview.Appointment.attinternaladd=[[[\\u0100\\u018C\\u018C \\u0105 \\u010B\\u014F\\u013A\\u013A\\u0113\\u0105\\u011F\\u0171\\u0113]]]\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.fromTimeDate=[[[\\u0191\\u0157\\u014F\\u0271 {0} ]]]{1}\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.toTimeDate=[[[\\u0162\\u014F {0} ]]]{1}\r\n\r\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\r\nview.Appointment.timeToTime={0}[[[ \\u0163\\u014F ]]]{1}\r\n\r\n#XFLD: empty appointment list text \r\nview.Appointment.appointment_nodata=[[[\\u0143\\u014F \\u0100\\u03C1\\u03C1\\u014F\\u012F\\u014B\\u0163\\u0271\\u0113\\u014B\\u0163\\u015F]]]\r\n\r\n#XFLD: employee fullname: {0} firstname {1} lastname\r\nview.Appointment.employeename={0}[[[ ]]]{1}\r\n\r\n#XTIT: Title for Edit Appointment page\r\nview.Appointment.editappointment=[[[\\u0114\\u018C\\u012F\\u0163 \\u0100\\u03C1\\u03C1\\u014F\\u012F\\u014B\\u0163\\u0271\\u0113\\u014B\\u0163]]]\r\n\r\n#YMSG: Error when end time is before start time (on same day)\r\nview.Appointment.wrongTimes=[[[\\u0114\\u014B\\u018C \\u0163\\u012F\\u0271\\u0113 \\u012F\\u015F \\u0183\\u0113\\u0192\\u014F\\u0157\\u0113 \\u015F\\u0163\\u0105\\u0157\\u0163 \\u0163\\u012F\\u0271\\u0113]]]\r\n\r\n#YMSG: Error when end date is before start date\r\nview.Appointment.wrongDates=[[[\\u0114\\u014B\\u018C \\u018C\\u0105\\u0163\\u0113 \\u012F\\u015F \\u0183\\u0113\\u0192\\u014F\\u0157\\u0113 \\u015F\\u0163\\u0105\\u0157\\u0163 \\u018C\\u0105\\u0163\\u0113]]]\r\n\r\n#XBUT: Button text for Add Button\r\nview.Appointment.add=[[[\\u0100\\u018C\\u018C]]]\r\n\r\n#XTIT: Shell Title of App\r\nview.Appointment.shelltitle=[[[\\u039C\\u0177 \\u0100\\u03C1\\u03C1\\u014F\\u012F\\u014B\\u0163\\u0271\\u0113\\u014B\\u0163\\u015F]]]\r\n\r\n#XFLD: empty list text for external attendee popup\r\nview.Appointment.noextattendees=[[[\\u0143\\u014F \\u0113\\u03C7\\u0163\\u0113\\u0157\\u014B\\u0105\\u013A \\u0105\\u0163\\u0163\\u0113\\u014B\\u018C\\u0113\\u0113\\u015F]]]\r\n\r\n#XFLD: empty list text for internal attendee popup\r\nview.Appointment.nointattendees=[[[\\u0143\\u014F \\u012F\\u014B\\u0163\\u0113\\u0157\\u014B\\u0105\\u013A \\u0105\\u0163\\u0163\\u0113\\u014B\\u018C\\u0113\\u0113\\u015F]]]\r\n\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=[[[\\u014E\\u014B\\u013A\\u0177 \\u0177\\u014F\\u0171\\u0157 \\u0105\\u03C1\\u03C1\\u014F\\u012F\\u014B\\u0163\\u0271\\u0113\\u014B\\u0163\\u015F \\u0105\\u0157\\u0113 \\u018C\\u012F\\u015F\\u03C1\\u013A\\u0105\\u0177\\u0113\\u018C ]]]\r\n\r\n#YMSG: info message in case edit page is left with back and data changed\r\nview.Appointment.leaveeditmessage=[[[\\u0176\\u014F\\u0171\\u0157 \\u0113\\u014B\\u0163\\u0157\\u012F\\u0113\\u015F \\u0175\\u012F\\u013A\\u013A \\u0183\\u0113 \\u013A\\u014F\\u015F\\u0163 \\u012F\\u0192 \\u0177\\u014F\\u0171 \\u013A\\u0113\\u0105\\u028B\\u0113 \\u0163\\u0125\\u012F\\u015F \\u03C1\\u0105\\u011F\\u0113. \\u010E\\u014F \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u010B\\u014F\\u014B\\u0163\\u012F\\u014B\\u0171\\u0113?]]]\r\n\r\n#YMSG: info message in case of wrong format of Start Date\r\nview.Appointment.validStartDate=[[[\\u0114\\u014B\\u0163\\u0113\\u0157 \\u0105 \\u028B\\u0105\\u013A\\u012F\\u018C \\u015C\\u0163\\u0105\\u0157\\u0163 \\u010E\\u0105\\u0163\\u0113]]]\r\n\r\n#YMSG: info message in case of wrong format of End Date\r\nview.Appointment.validEndDate=[[[\\u0114\\u014B\\u0163\\u0113\\u0157 \\u0105 \\u028B\\u0105\\u013A\\u012F\\u018C \\u0114\\u014B\\u018C \\u010E\\u0105\\u0163\\u0113]]]\r\n\r\n#YMSG: info message in case of wrong format of Start Date and End Date\r\nview.Appointment.validStartEndDate=[[[\\u0114\\u014B\\u0163\\u0113\\u0157 \\u0105 \\u028B\\u0105\\u013A\\u012F\\u018C \\u015C\\u0163\\u0105\\u0157\\u0163 \\u010E\\u0105\\u0163\\u0113 \\u0105\\u014B\\u018C \\u0114\\u014B\\u018C \\u010E\\u0105\\u0163\\u0113]]]\r\n\r\n#XTIT: Title for Process type dialog\r\nview.Appointment.process_type=[[[\\u015C\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0162\\u0157\\u0105\\u014B\\u015F\\u0105\\u010B\\u0163\\u012F\\u014F\\u014B \\u0162\\u0177\\u03C1\\u0113]]]\r\n\r\n#XFLD: No Data text when loading/searching list\r\nview.Appointment.no_data_text=[[[\\u0143\\u014F \\u012F\\u0163\\u0113\\u0271\\u015F \\u0105\\u0157\\u0113 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163\\u013A\\u0177 \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113]]]\r\n\r\n#XFLD: Transaction Type\r\nview.Appointment.TransactionType=[[[\\u0162\\u0177\\u03C1\\u0113]]]\r\n\r\n#YMSG : PRIVATE appointment message\r\nview.Appointment.privateMessage=[[[\\u0162\\u0125\\u012F\\u015F \\u012F\\u015F \\u0105 \\u03C1\\u0157\\u012F\\u028B\\u0105\\u0163\\u0113 \\u0271\\u0113\\u015F\\u015F\\u0105\\u011F\\u0113]]]\r\n\r\n#XFLD: Title for private appointment in shared calendar\r\nview.Appointment.privateAppointment=[[[\\u01A4\\u0157\\u012F\\u028B\\u0105\\u0163\\u0113 \\u0105\\u03C1\\u03C1\\u014F\\u012F\\u014B\\u0163\\u0271\\u0113\\u014B\\u0163]]]\r\n#XTIT: this is the title for the Transaction History Tab\r\nTRANS_HISTORY=[[[\\u0162\\u0157\\u0105\\u014B\\u015F\\u0105\\u010B\\u0163\\u012F\\u014F\\u014B \\u0124\\u012F\\u015F\\u0163\\u014F\\u0157\\u0177]]]\r\n\r\n#XFLD, 30: Field Transaction ID on List\r\nTRANS_ID=[[[\\u0162\\u0157\\u0105\\u014B\\u015F\\u0105\\u010B\\u0163\\u012F\\u014F\\u014B \\u012C\\u010E]]]\r\n\r\n#XFLD, 30: Field Transaction Type on List\r\nTRANS_TYPE=[[[\\u0162\\u0157\\u0105\\u014B\\u015F\\u0105\\u010B\\u0163\\u012F\\u014F\\u014B \\u0162\\u0177\\u03C1\\u0113]]]\r\n\r\n#XFLD, 30: Field Description on List\r\nTRANS_DESC=[[[\\u010E\\u0113\\u015F\\u010B\\u0157\\u012F\\u03C1\\u0163\\u012F\\u014F\\u014B]]]\r\n\r\n#XFLD, 30: Field Created On on List\r\nCREATED_ON=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113\\u018C \\u014E\\u014B]]]\r\n\r\n#XFLD, 30: Field Created On on List\r\nRELATIONSHIP=[[[\\u0158\\u0113\\u013A\\u0105\\u0163\\u012F\\u014F\\u014B \\u0162\\u0177\\u03C1\\u0113]]]\r\n\r\n#XFLD, 15: Priority label\r\nview.Appointment.priority=[[[\\u01A4\\u0157\\u012F\\u014F\\u0157\\u012F\\u0163\\u0177]]]\r\n\r\n#YMSG, 50:Customizing incomplete\r\nCUSTOMIZING_INCOMPLETE=[[[\\u0108\\u0171\\u015F\\u0163\\u014F\\u0271\\u012F\\u017E\\u012F\\u014B\\u011F \\u012C\\u014B\\u010B\\u014F\\u0271\\u03C1\\u013A\\u0113\\u0163\\u0113. \\u01A4\\u013A\\u0113\\u0105\\u015F\\u0113 \\u010B\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163 \\u015F\\u0177\\u015F\\u0163\\u0113\\u0271 \\u0105\\u018C\\u0271\\u012F\\u014B\\u012F\\u015F\\u0163\\u0157\\u0105\\u0163\\u014F\\u0157]]]\r\n\r\n#XBUT: Button text to Messages\r\nview.Appointment.messages=[[[\\u039C\\u0113\\u015F\\u015F\\u0105\\u011F\\u0113\\u015F]]]\r\n\r\n#XGRP: Error message dialog title\r\nview.Appointment.errorMessage=[[[\\u039C\\u0113\\u015F\\u015F\\u0105\\u011F\\u0113\\u015F ({0})]]]\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=[[[\\u0176\\u014F\\u0171 \\u010B\\u0105\\u014B \\u014F\\u014B\\u013A\\u0177 \\u028B\\u012F\\u0113\\u0175 \\u0183\\u0171\\u015F\\u012F\\u014B\\u0113\\u015F\\u015F \\u010B\\u0105\\u0157\\u018C\\u015F \\u014F\\u0192 \\u010B\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163\\u015F \\u0163\\u0125\\u0105\\u0163 \\u0125\\u0105\\u015F \\u0183\\u0113\\u0113\\u014B \\u0105\\u015F\\u015F\\u012F\\u011F\\u014B\\u0113\\u018C \\u0163\\u014F \\u0163\\u0125\\u012F\\u015F \\u0105\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163]]]\r\n',
	"cus/crm/mycalendar/i18n/i18n_en_US_saptrc.properties":'\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n\r\n#XTIT: Title of App\r\nview.Appointment.apptitle=qB37zpr6YPOwdIopi+MFVA_Appointments\r\n\r\n#XTIT: Title of New Appointment screen\r\nview.Appointment.newapptitle=EkO6Tllif9iH4p+kKwrb0A_New Appointment\r\n\r\n#XFLD: tooltip  for create new appointment button\r\nview.Appointment.newapptm_tt=S5/3UWbq07hOmtrXxiSFPw_New Appointment\r\n\r\n#XTIT: Title of shared calendars\r\nview.Appointment.sharedCalendars=g4GYa+9cOXgLBoFUxiRqXQ_Shared Calendars\r\n\r\n#XBUT: Button text of my calendar\r\nview.Appointment.mycalendar=F2oQ2L+b+riIDLvhq/wWPw_MyCalendar\r\n\r\n#XTIT: Title of infotoolbar \r\nview.Appointment.myTeam=a3sJsNmSWcSFFKo8AS2YkQ_My team members \r\n\r\n#XTIT: Appointment list description with location,account text and contact text\r\nview.Appointment.furtherDetails=ncXzjZvz/oYMr+mQNFWGng_{0} | {1} ({2})\r\n\r\n#XTIT: Appointment list description with account text and contact text\r\nview.Appointment.furtherDetailsWithoutLoc=Rs9U1tLnDNomO4vagNcalg_{0} ({1})\r\n\r\n#XTIT: Appointment list description with loc  and account text\r\nview.Appointment.furtherDetailsWithoutContact=I5NxNjwCPgIvDzfXfdhwYw_{0} | {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=8H+F/IB2J07Jv/d99oKSTQ_Data has been changed by another user. Click OK to fetch the latest.\r\n#XTIT: Appointment list description without loc and cantact text\r\nview.Appointment.furtherDetailsWithoutContactAndLoc=BQbiCsvtDi/fX0JySdX4rg_{0}\r\n\r\n#XTIT: Title of Timeline\r\nview.Appointment.Timeline=xWaq+mOwVF3IxROpZ5yugw_Timeline\r\n\r\n#XTIT: Title of Calendars\r\nview.Appointment.Calendars=ZffTI5BLTRe96Vof2yfzlQ_Calendars\r\n\r\n#XFLD: tooltip for today button\r\nview.Appointment.today_tt=1mzeHQtbVHUI1iN5BbhMlQ_Today\r\n\r\n#XTIT: Header text of Appointment detail\r\nview.Appointment.detail=J2mNm6Sri0QfnkepSjfUNQ_Appointment Detail\r\n\r\n#XFLD: Account field label\r\nview.Appointment.account=7l58MY2UiRuonqjZkb/USA_Account\r\n\r\n#XFLD: Contact field label\r\nview.Appointment.contact=pzqWF1bf49XviXG86bKz7w_Contact\r\n\r\n#XFLD: Employee Responsible field label\r\nview.Appointment.employeeResponsible=OO6wAGHzFTBlgspBHWwF9A_Employee Responsible\r\n\r\n#XFLD: Time field label\r\nview.Appointment.time=SOksQ7ukkLONuTfqEi21fA_Time\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.subject=y+npjHkBKrZyTYYYRZfDhg_Title\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.title=zriOBIIC3JRse9eSsoJceA_Title\r\n\r\n#XFLD: Label for Start date and time\r\nview.Appointment.startdatetime=3jA9EYeFjwrK6sJwuHnomw_Start Date and Time\r\n\r\n#XFLD: Label for End date and time\r\nview.Appointment.enddatetime=2sAISQVvqQ/Vkrfwk5uGYA_End Date and Time\r\n\r\n#XFLD: Label for All day checkbox\r\nview.Appointment.alldayevent=DNNz/ozsE7w9kodpAlbUmA_All Day\r\n\r\n#YMSG: info message in case appointment occurs in the past\r\nview.Appointment.occurspast=VpzXH/tTDqMsOayt+B1Nhg_Appointment occurs in the past\r\n\r\n#YMSG: info message in case no title entered\r\nview.Appointment.notitle=Q2TuZwrUMQUPWe3OMaRlGQ_Enter an appointment title\r\n\r\n#XFLD: Label for Private checkbox\r\nview.Appointment.private=WuqG3zCjM9aiQSNc9/RAFw_Private\r\n\r\n#XFLD: Location field label\r\nview.Appointment.location=+/mAx0r4swD+8Jel0uXL9g_Location\r\n\r\n#XFLD: Importance field label\r\nview.Appointment.importance=rxUGgEKDbs3+g24gVbWIgA_Importance\r\n\r\n#XFLD: Active Status field label\r\nview.Appointment.activeStatus=H5js0WUPxzPdUGWv0BEuSg_Active Status\r\n\r\n#XFLD: Notes field label\r\nview.Appointment.notes=n/jDDyXLJzJz71nlvhE1ZA_Notes\r\n\r\n#XFLD: Note field label\r\nview.Appointment.note=1aWeHDhWNZt64eUaW/XFGg_Note\r\n\r\n#XFLD: Label for internal attendees\r\nview.Appointment.internal=rLvz30D0HR1tf94UWwtyWA_Internal\r\n\r\n#XFLD: Label for external attendees\r\nview.Appointment.external=cm7poDxO1wEbfAjjdxlFzw_External\r\n\r\n#XGRP: Group header of the section for showing the general data\r\nview.Appointment.generalData=FrzaIreS5Vo3JSX5gcfzxQ_General\r\n\r\n#XGRP: Group header of the section for showing the contact data\r\nview.Appointment.contactData=owgZSndHjl/atDComb2yNw_Contact\r\n\r\n#XGRP: Group header of the section for showing the attendees\r\nview.Appointment.attendeeData=gIrBOu/5qzzxucd/0sKNww_Attendees\r\n\r\n#XGRP: Group header attendees with number\r\nview.Appointment.attendeeDataNumber=aYCxc48adVVIeox8e3BuVg_Attendees ({0})\r\n\r\n#XGRP: Group header additional attendees with number\r\nview.Appointment.additionalAttendeeNumber=ipnQd6yA2R7xveOFypaXbQ_Additional Attendees ({0})\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.detailData=VveGfyJxLjSpcDb95VUQHQ_Details\r\n\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.appointmentDetail=pW7u+cT5Q51eHk9dT/wdtA_Appointment\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Opportunity=OeF7NKYkN4pbWt6Am8lXkg_Opportunity\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Task=u2EdI3SkxRTldJ/1Ipfx4g_Task\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.attachmentData=bzoEF0tjZQT+eTUj6MA55w_Attachments\r\n\r\n#XGRP: Group header attachments with number how many\r\nview.Appointment.attachmentDataNumber=bLNkZaiqxAIY/1QC95JwqA_Attachments ({0})\r\n\r\n#XGRP: Group header attachments with request to save the appointment before file upload \r\nview.Appointment.attachmentSaveRequest=mjUh/FeUksdQJgqnDPNaIQ_Attachments (Save First Before Uploading Attachments)\r\n\r\n#XBUT: Button text to Delete\r\nview.Appointment.delete=dPkX/G8Yd6/VpC8Lim6IPQ_Delete\r\n\r\n#XBUT: Button text to Follow up\r\nview.Appointment.followup=1KKXB/kgGbNPUu9FYeIVCQ_Follow Up\r\n\r\n#YMSG: no transaction types  present\r\nview.Appointment.FOLLOWUPERROR=mYtAQZq1ten4nTubQaWjkQ_Either the current appointment has errors or there are no follow up transaction types maintained in the Customizing\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.deletesuccess=+ikL+xQIwpGahjvqxUGolg_Appointment deleted\r\n\r\n#YMSG: successful followup message in message toast\r\nview.Appointment.followupsuccessful=NHXV/kvRzTsrC/t2XweylQ_Follow up appointment saved\r\n\r\n#XBUT: Button text to Edit\r\nview.Appointment.edit=dtBAXVt6umZI8Vkgbp+L1Q_Edit\r\n\r\n#XBUT: Button text to Done\r\nview.Appointment.done=TFBeh8n/1bfuNS0xNzDqdg_Done\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.cancel=wn51WcxJ6GppnadX42DsAA_Cancel\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.ok=1MkdDUsnO6XK6s8kUSnvvg_OK\r\n\r\n#XBUT: Button text to Create\r\nview.Appointment.create=WLamiuEwuOg6ySUBksFDsw_Create\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.savesuccess=xHHoJ17og4N/wKPyC92kdw_Appointment saved\r\n\r\n#XBUT: Button text to SAve\r\nview.Appointment.save=bJdLbsqMGdeSF+Gdsy8Znw_Save\r\n\r\n#XBUT: Button text for Day\r\nview.Appointment.day=kqDRc+5lMc4Xn/LSXk7ICw_Day\r\n\r\n#XBUT: Button text for week\r\nview.Appointment.week=Q1QPjtsEyclkXeU37KirRQ_Week\r\n\r\n#XBUT: Button text for month\r\nview.Appointment.month=0MLgTQIzAhX2llTeSRCdFQ_Month\r\n\r\n#XFLD: loading text for the appointment list\r\nview.Appointment.loaddatatext=IjtzJ4iVNPRsDua6Wa6F7w_Loading...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.acsea_title=uwZNblZVO3Uc9wEN/SCiiQ_Accounts ({0})\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.acsea_nodata=w5AjYJXvsay8Z4El7Z2g5A_No Accounts found\r\n\r\n#XFLD: placeholdertext for search fields\r\nview.Appointment.searchfieldplaceholder=oTv5AkLxTWO/kDf13plAkA_Search\r\n\r\n#XFLD: placeholdertext for search busy text\r\nview.Appointment.searchlistinfo=1YYkvBgVrvlUbsDR0g+Mow_Searching...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.consea_title=ij1HPumiRUI1v4cuPvXUrg_Contacts ({0})\r\n\r\n#XTIT: title of the business card for accounts\r\nview.Appointment.account_title=Mp16WAwIqRT7hTCflp/zqQ_Account\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.employee_title=o+Dta3nLuZhmQy40bRF8hA_Employee\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.contact_title=zNaraCDWZMomz5vs2d2goQ_Contact\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.consea_nodata=eJJ+B64zCJEyzQoxjPjV2g_No Contacts found\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.empsea_nodata=7+ts+jzun1//CNce2g+xOA_No Employees found\r\n\r\n#XTIT: title of internal attendees search popup\r\nview.Appointment.internal_title=DrC/Du2PBqLmwQyuRsFwYQ_Internal Attendees ({0})\r\n\r\n#XTIT: title of external attendees search popup\r\nview.Appointment.external_title=wGf68+HZAG2HTJu888AHuw_External Attendees ({0})\r\n\r\n#XTIT: title of internal attendees search popup enhanced with total count\r\nview.Appointment.internal_titlenew=+9/HkLqixYba58+MtcCl6Q_New Internal Attendees ({0})\r\n\r\n#XTIT: title of external attendees search popup enhanced with total count\r\nview.Appointment.external_titlenew=Ha9raEkuR0Ee8D80cXpCLA_New External Attendees ({0})\r\n\r\n#YMSG: Filtered by info bar text for contact search popup\r\nview.Appointment.filteredby=MHddXpFWQxnO4ZWUOTq1Yg_Filtered by\r\n\r\n#YMSG: filter line for cross navigation: Filter by Account \r\nview.Appointment.filteraccount=CQtvDenniZrXU94kZHaeoA_Filtered by Account\r\n\r\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\r\nview.Appointment.duration.min=LAGl9tup8OZd7q5RRfhVMQ_{0} min\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\r\nview.Appointment.duration.hour=XZY8fCRYejMLZbAvGLIaVg_{0} h\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.day=hYN5xDkuhLSSKyXKGZqLAw_{0} day\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.days=4dcPZ5rR8XW7q5ltxkeg8w_{0} days\r\n\r\n#XTIT: Button text to Delete \r\nview.Appointment.deleteTitle=3uwk0pj6HFMYW0fu/9sEKw_Delete \r\n\r\n#YINS: Text for Pop Up action.  User to react (Yes/No) \r\nview.Appointment.deleteInstruction=vvTj7kDR2wQ3K2bH5IBt1Q_Delete this appointment? \r\n\r\n#XBUT: User to react (positive) to delete action \r\nview.Appointment.deleteYes=Ukyc54NHAtF44kn0Ds+0iA_Ok\r\n\r\n#XFLD: placeholder text for fiels adding external attendees\r\nview.Appointment.attexternaladd=t0+RtTUwZwwsFETH49hGgA_Add external attendee\r\n\r\n#XFLD: placeholder text for fiels adding internal attendees\r\nview.Appointment.attinternaladd=7BGJ91apwRTr9lFwiJvpBA_Add a colleague\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.fromTimeDate=eUEfHQ1jXIVOeZRvEuOXSQ_From {0} {1}\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.toTimeDate=47pBJCdkh/Wn4gGU6rW8Ng_To {0} {1}\r\n\r\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\r\nview.Appointment.timeToTime=SPS658QDVwBmkPd8JUY+Rg_{0} to {1}\r\n\r\n#XFLD: empty appointment list text \r\nview.Appointment.appointment_nodata=5KSIOwrf53biDxsoEL6v+w_No Appointments\r\n\r\n#XFLD: employee fullname: {0} firstname {1} lastname\r\nview.Appointment.employeename=ErjixCSCfjbgWuwA7PtRMA_{0} {1}\r\n\r\n#XTIT: Title for Edit Appointment page\r\nview.Appointment.editappointment=YIoWCqp7FoOArMoUC683VA_Edit Appointment\r\n\r\n#YMSG: Error when end time is before start time (on same day)\r\nview.Appointment.wrongTimes=JCN0VNANGwA0g0zbrdPIdA_End time is before start time\r\n\r\n#YMSG: Error when end date is before start date\r\nview.Appointment.wrongDates=ZbY+NJq6voFg+J5CH9obng_End date is before start date\r\n\r\n#XBUT: Button text for Add Button\r\nview.Appointment.add=KZ6ZgNEe+XTznEOGvIwm0g_Add\r\n\r\n#XTIT: Shell Title of App\r\nview.Appointment.shelltitle=yr+kNcZXVTCFRAtympJT0w_My Appointments\r\n\r\n#XFLD: empty list text for external attendee popup\r\nview.Appointment.noextattendees=8A71ZC2y/Act3kZq8YMKcA_No external attendees\r\n\r\n#XFLD: empty list text for internal attendee popup\r\nview.Appointment.nointattendees=tYJSWM7L9XvBT1e/+ScBVw_No internal attendees\r\n\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=mfgWUT66lCyFf/LvRtlvZg_Only your appointments are displayed \r\n\r\n#YMSG: info message in case edit page is left with back and data changed\r\nview.Appointment.leaveeditmessage=4JA0eIvEweE4t5Ni++sKsQ_Your entries will be lost if you leave this page. Do you want to continue?\r\n\r\n#YMSG: info message in case of wrong format of Start Date\r\nview.Appointment.validStartDate=hIHEWD4bVtdRQWdBQb5I3g_Enter a valid Start Date\r\n\r\n#YMSG: info message in case of wrong format of End Date\r\nview.Appointment.validEndDate=qN4KAiR5QSWI4mOqzADRSg_Enter a valid End Date\r\n\r\n#YMSG: info message in case of wrong format of Start Date and End Date\r\nview.Appointment.validStartEndDate=yDV2wXy2gizLmLZQkYkCCQ_Enter a valid Start Date and End Date\r\n\r\n#XTIT: Title for Process type dialog\r\nview.Appointment.process_type=/I1PtUP4oFL9CGLK9ZHGKQ_Select Transaction Type\r\n\r\n#XFLD: No Data text when loading/searching list\r\nview.Appointment.no_data_text=+uqdNCYFU0Uf/B/uLG7nLQ_No items are currently available\r\n\r\n#XFLD: Transaction Type\r\nview.Appointment.TransactionType=vU3Z6/HMjTQCbmGd/Oc0tA_Type\r\n\r\n#YMSG : PRIVATE appointment message\r\nview.Appointment.privateMessage=ddbDhGMSGJwz7+zTzW+FMw_This is a private message\r\n\r\n#XFLD: Title for private appointment in shared calendar\r\nview.Appointment.privateAppointment=Ed+64mQwBh9NERAffL+buA_Private appointment\r\n#XTIT: this is the title for the Transaction History Tab\r\nTRANS_HISTORY=ZQtS/Bh6DbBy7Avr8w3yDw_Transaction History\r\n\r\n#XFLD, 30: Field Transaction ID on List\r\nTRANS_ID=F64fysg113pNL/zEkHQOtQ_Transaction ID\r\n\r\n#XFLD, 30: Field Transaction Type on List\r\nTRANS_TYPE=Af2Zz/PROQ7U9GHlxckZiA_Transaction Type\r\n\r\n#XFLD, 30: Field Description on List\r\nTRANS_DESC=qk6kjuX4RTEgUEFesoGXzw_Description\r\n\r\n#XFLD, 30: Field Created On on List\r\nCREATED_ON=d1YJvfU/SahS+L7YK4bCcQ_Created On\r\n\r\n#XFLD, 30: Field Created On on List\r\nRELATIONSHIP=0jjFo3MvdOE6vZWy+bcjAQ_Relation Type\r\n\r\n#XFLD, 15: Priority label\r\nview.Appointment.priority=Ibc2JeAQ886b8fSZfpqpFQ_Priority\r\n\r\n#YMSG, 50:Customizing incomplete\r\nCUSTOMIZING_INCOMPLETE=un6NLm8/S/55QM8ojW/rVw_Customizing Incomplete. Please contact system administrator\r\n\r\n#XBUT: Button text to Messages\r\nview.Appointment.messages=Eb9E99Z1O+ixzAhYmHMP5w_Messages\r\n\r\n#XGRP: Error message dialog title\r\nview.Appointment.errorMessage=xQbr9uW219iuewfsDu2xvA_Messages ({0})\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=j8ou7IqqdBE/nRuw4Ef9GQ_You can only view business cards of contacts that has been assigned to this account\r\n',
	"cus/crm/mycalendar/i18n/i18n_es.properties":'\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n\r\n#XTIT: Title of App\r\nview.Appointment.apptitle=Citas\r\n\r\n#XTIT: Title of New Appointment screen\r\nview.Appointment.newapptitle=Nueva cita\r\n\r\n#XFLD: tooltip  for create new appointment button\r\nview.Appointment.newapptm_tt=Nueva cita\r\n\r\n#XTIT: Title of shared calendars\r\nview.Appointment.sharedCalendars=Calendarios compartidos\r\n\r\n#XBUT: Button text of my calendar\r\nview.Appointment.mycalendar=Mi calendario\r\n\r\n#XTIT: Title of infotoolbar \r\nview.Appointment.myTeam=Miembros de mi equipo\r\n\r\n#XTIT: Appointment list description with location,account text and contact text\r\nview.Appointment.furtherDetails={0} | {1} ({2})\r\n\r\n#XTIT: Appointment list description with account text and contact text\r\nview.Appointment.furtherDetailsWithoutLoc={0} ({1})\r\n\r\n#XTIT: Appointment list description with loc  and account text\r\nview.Appointment.furtherDetailsWithoutContact={0} | {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Otro usuario ha modificado los datos. Seleccione OK para recuperar los datos m\\u00E1s recientes.\r\n#XTIT: Appointment list description without loc and cantact text\r\nview.Appointment.furtherDetailsWithoutContactAndLoc={0}\r\n\r\n#XTIT: Title of Timeline\r\nview.Appointment.Timeline=Cronolog\\u00EDa\r\n\r\n#XTIT: Title of Calendars\r\nview.Appointment.Calendars=Calendarios\r\n\r\n#XFLD: tooltip for today button\r\nview.Appointment.today_tt=Hoy\r\n\r\n#XTIT: Header text of Appointment detail\r\nview.Appointment.detail=Detalles de la cita\r\n\r\n#XFLD: Account field label\r\nview.Appointment.account=Cuenta\r\n\r\n#XFLD: Contact field label\r\nview.Appointment.contact=Contacto\r\n\r\n#XFLD: Employee Responsible field label\r\nview.Appointment.employeeResponsible=Empleado responsable\r\n\r\n#XFLD: Time field label\r\nview.Appointment.time=Hora\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.subject=T\\u00EDtulo\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.title=T\\u00EDtulo\r\n\r\n#XFLD: Label for Start date and time\r\nview.Appointment.startdatetime=Fecha y hora de inicio\r\n\r\n#XFLD: Label for End date and time\r\nview.Appointment.enddatetime=Fecha y hora de fin\r\n\r\n#XFLD: Label for All day checkbox\r\nview.Appointment.alldayevent=Todo el d\\u00EDa\r\n\r\n#YMSG: info message in case appointment occurs in the past\r\nview.Appointment.occurspast=La cita se produce en el pasado\r\n\r\n#YMSG: info message in case no title entered\r\nview.Appointment.notitle=Introduzca un t\\u00EDtulo\r\n\r\n#XFLD: Label for Private checkbox\r\nview.Appointment.private=Privado\r\n\r\n#XFLD: Location field label\r\nview.Appointment.location=Ubicaci\\u00F3n\r\n\r\n#XFLD: Importance field label\r\nview.Appointment.importance=Importancia\r\n\r\n#XFLD: Active Status field label\r\nview.Appointment.activeStatus=Estado\r\n\r\n#XFLD: Notes field label\r\nview.Appointment.notes=Notas\r\n\r\n#XFLD: Note field label\r\nview.Appointment.note=Notas\r\n\r\n#XFLD: Label for internal attendees\r\nview.Appointment.internal=Internos\r\n\r\n#XFLD: Label for external attendees\r\nview.Appointment.external=Externos\r\n\r\n#XGRP: Group header of the section for showing the general data\r\nview.Appointment.generalData=Datos generales\r\n\r\n#XGRP: Group header of the section for showing the contact data\r\nview.Appointment.contactData=Contacto\r\n\r\n#XGRP: Group header of the section for showing the attendees\r\nview.Appointment.attendeeData=Participantes\r\n\r\n#XGRP: Group header attendees with number\r\nview.Appointment.attendeeDataNumber=Asistentes ({0})\r\n\r\n#XGRP: Group header additional attendees with number\r\nview.Appointment.additionalAttendeeNumber=Asistentes adicionales ({0})\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.detailData=Detalles\r\n\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.appointmentDetail=Cita\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Opportunity=Oportunidad\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Task=Tarea\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.attachmentData=Anexos\r\n\r\n#XGRP: Group header attachments with number how many\r\nview.Appointment.attachmentDataNumber=Anexos ({0})\r\n\r\n#XGRP: Group header attachments with request to save the appointment before file upload \r\nview.Appointment.attachmentSaveRequest=Anexos (guarde primero antes de cargar anexos)\r\n\r\n#XBUT: Button text to Delete\r\nview.Appointment.delete=Borrar\r\n\r\n#XBUT: Button text to Follow up\r\nview.Appointment.followup=Seguimiento\r\n\r\n#YMSG: no transaction types  present\r\nview.Appointment.FOLLOWUPERROR=No se han encontrado tipos de transacci\\u00F3n. Compruebe su Customizing de back end.\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.deletesuccess=Cita borrada\r\n\r\n#YMSG: successful followup message in message toast\r\nview.Appointment.followupsuccessful=Cita de seguimiento grabada\r\n\r\n#XBUT: Button text to Edit\r\nview.Appointment.edit=Editar\r\n\r\n#XBUT: Button text to Done\r\nview.Appointment.done=Fin\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.cancel=Cancelar\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.ok=OK\r\n\r\n#XBUT: Button text to Create\r\nview.Appointment.create=Crear\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.savesuccess=Cita guardada\r\n\r\n#XBUT: Button text to SAve\r\nview.Appointment.save=Guardar\r\n\r\n#XBUT: Button text for Day\r\nview.Appointment.day=D\\u00EDa\r\n\r\n#XBUT: Button text for week\r\nview.Appointment.week=Semana\r\n\r\n#XBUT: Button text for month\r\nview.Appointment.month=Mes\r\n\r\n#XFLD: loading text for the appointment list\r\nview.Appointment.loaddatatext=Cargando...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.acsea_title=Clientes ({0})\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.acsea_nodata=No hay cuentas\r\n\r\n#XFLD: placeholdertext for search fields\r\nview.Appointment.searchfieldplaceholder=Buscar\r\n\r\n#XFLD: placeholdertext for search busy text\r\nview.Appointment.searchlistinfo=Buscando...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.consea_title=Contactos ({0})\r\n\r\n#XTIT: title of the business card for accounts\r\nview.Appointment.account_title=Cliente\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.employee_title=Empleado\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.contact_title=Contacto\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.consea_nodata=No hay contactos\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.empsea_nodata=No hay empleados\r\n\r\n#XTIT: title of internal attendees search popup\r\nview.Appointment.internal_title=Asistentes internos ({0})\r\n\r\n#XTIT: title of external attendees search popup\r\nview.Appointment.external_title=Asistentes externos ({0})\r\n\r\n#XTIT: title of internal attendees search popup enhanced with total count\r\nview.Appointment.internal_titlenew=Asistentes internos nuevos ({0})\r\n\r\n#XTIT: title of external attendees search popup enhanced with total count\r\nview.Appointment.external_titlenew=Asistentes externos nuevos ({0})\r\n\r\n#YMSG: Filtered by info bar text for contact search popup\r\nview.Appointment.filteredby=Filtrado por\r\n\r\n#YMSG: filter line for cross navigation: Filter by Account \r\nview.Appointment.filteraccount=Filtrado por cuenta\r\n\r\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\r\nview.Appointment.duration.min={0} min\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\r\nview.Appointment.duration.hour={0} h\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.day={0} d\\u00EDa\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.days={0} d\\u00EDas\r\n\r\n#XTIT: Button text to Delete \r\nview.Appointment.deleteTitle=Borrar\r\n\r\n#YINS: Text for Pop Up action.  User to react (Yes/No) \r\nview.Appointment.deleteInstruction=\\u00BFBorrar esta cita?\r\n\r\n#XBUT: User to react (positive) to delete action \r\nview.Appointment.deleteYes=OK\r\n\r\n#XFLD: placeholder text for fiels adding external attendees\r\nview.Appointment.attexternaladd=A\\u00F1adir asistente externo\r\n\r\n#XFLD: placeholder text for fiels adding internal attendees\r\nview.Appointment.attinternaladd=A\\u00F1adir un colega\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.fromTimeDate=De {0} {1}\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.toTimeDate=A {0} {1}\r\n\r\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\r\nview.Appointment.timeToTime={0} a   {1}\r\n\r\n#XFLD: empty appointment list text \r\nview.Appointment.appointment_nodata=No hay citas\r\n\r\n#XFLD: employee fullname: {0} firstname {1} lastname\r\nview.Appointment.employeename={0} {1}\r\n\r\n#XTIT: Title for Edit Appointment page\r\nview.Appointment.editappointment=Editar cita\r\n\r\n#YMSG: Error when end time is before start time (on same day)\r\nview.Appointment.wrongTimes=La hora de fin es anterior a la hora de inicio\r\n\r\n#YMSG: Error when end date is before start date\r\nview.Appointment.wrongDates=La fecha de fin es anterior a la fecha de inicio\r\n\r\n#XBUT: Button text for Add Button\r\nview.Appointment.add=A\\u00F1adir\r\n\r\n#XTIT: Shell Title of App\r\nview.Appointment.shelltitle=Mis citas\r\n\r\n#XFLD: empty list text for external attendee popup\r\nview.Appointment.noextattendees=No hay asistentes externos\r\n\r\n#XFLD: empty list text for internal attendee popup\r\nview.Appointment.nointattendees=No hay asistentes internos\r\n\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Solo se visualizan sus citas\r\n\r\n#YMSG: info message in case edit page is left with back and data changed\r\nview.Appointment.leaveeditmessage=Si abandona esta p\\u00E1gina, se perder\\u00E1n sus entradas. \\u00BFDesea continuar?\r\n\r\n#YMSG: info message in case of wrong format of Start Date\r\nview.Appointment.validStartDate=Introduzca una fecha de inicio v\\u00E1lida\r\n\r\n#YMSG: info message in case of wrong format of End Date\r\nview.Appointment.validEndDate=Introduzca una fecha de fin v\\u00E1lida\r\n\r\n#YMSG: info message in case of wrong format of Start Date and End Date\r\nview.Appointment.validStartEndDate=Introduzca una fecha de inicio y una fecha de fin v\\u00E1lidas\r\n\r\n#XTIT: Title for Process type dialog\r\nview.Appointment.process_type=Seleccionar tipo de transacci\\u00F3n\r\n\r\n#XFLD: No Data text when loading/searching list\r\nview.Appointment.no_data_text=Actualmente no hay posiciones disponibles\r\n\r\n#XFLD: Transaction Type\r\nview.Appointment.TransactionType=Tipo\r\n\r\n#YMSG : PRIVATE appointment message\r\nview.Appointment.privateMessage=Se trata de una cita privada\r\n\r\n#XFLD: Title for private appointment in shared calendar\r\nview.Appointment.privateAppointment=Cita privada\r\n#XTIT: this is the title for the Transaction History Tab\r\nTRANS_HISTORY=Historial de operaci\\u00F3n\r\n\r\n#XFLD, 30: Field Transaction ID on List\r\nTRANS_ID=ID de operaci\\u00F3n\r\n\r\n#XFLD, 30: Field Transaction Type on List\r\nTRANS_TYPE=Clase de operaci\\u00F3n\r\n\r\n#XFLD, 30: Field Description on List\r\nTRANS_DESC=Descripci\\u00F3n\r\n\r\n#XFLD, 30: Field Created On on List\r\nCREATED_ON=Fecha de creaci\\u00F3n\r\n\r\n#XFLD, 30: Field Created On on List\r\nRELATIONSHIP=Tipo de relaci\\u00F3n\r\n\r\n#XFLD, 15: Priority label\r\nview.Appointment.priority=Prioridad\r\n\r\n#YMSG, 50:Customizing incomplete\r\nCUSTOMIZING_INCOMPLETE=Customizing incompleto. P\\u00F3ngase en contacto con el administrador del sistema.\r\n\r\n#XBUT: Button text to Messages\r\nview.Appointment.messages=Mensajes\r\n\r\n#XGRP: Error message dialog title\r\nview.Appointment.errorMessage=Mensajes ({0})\r\n\r\n#YMSG: contact not assigned to this account\r\n',
	"cus/crm/mycalendar/i18n/i18n_fr.properties":'\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n\r\n#XTIT: Title of App\r\nview.Appointment.apptitle=Rendez-vous\r\n\r\n#XTIT: Title of New Appointment screen\r\nview.Appointment.newapptitle=Nouveau rendez-vous\r\n\r\n#XFLD: tooltip  for create new appointment button\r\nview.Appointment.newapptm_tt=Nouveau rendez-vous\r\n\r\n#XTIT: Title of shared calendars\r\nview.Appointment.sharedCalendars=Calendriers partag\\u00E9s\r\n\r\n#XBUT: Button text of my calendar\r\nview.Appointment.mycalendar=Mon calendrier\r\n\r\n#XTIT: Title of infotoolbar \r\nview.Appointment.myTeam=Mes membres d\'\\u00E9quipe\r\n\r\n#XTIT: Appointment list description with location,account text and contact text\r\nview.Appointment.furtherDetails={0} | {1} ({2})\r\n\r\n#XTIT: Appointment list description with account text and contact text\r\nview.Appointment.furtherDetailsWithoutLoc={0} ({1})\r\n\r\n#XTIT: Appointment list description with loc  and account text\r\nview.Appointment.furtherDetailsWithoutContact={0} | {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Donn\\u00E9es modifi\\u00E9es par un autre utilisateur. S\\u00E9lectionnez OK pour r\\u00E9cup\\u00E9rer les donn\\u00E9es les plus r\\u00E9centes.\r\n#XTIT: Appointment list description without loc and cantact text\r\nview.Appointment.furtherDetailsWithoutContactAndLoc={0}\r\n\r\n#XTIT: Title of Timeline\r\nview.Appointment.Timeline=Chronologie\r\n\r\n#XTIT: Title of Calendars\r\nview.Appointment.Calendars=Calendriers\r\n\r\n#XFLD: tooltip for today button\r\nview.Appointment.today_tt=Aujourd\'hui\r\n\r\n#XTIT: Header text of Appointment detail\r\nview.Appointment.detail=D\\u00E9tails rendez-vous\r\n\r\n#XFLD: Account field label\r\nview.Appointment.account=Compte\r\n\r\n#XFLD: Contact field label\r\nview.Appointment.contact=Contact\r\n\r\n#XFLD: Employee Responsible field label\r\nview.Appointment.employeeResponsible=Responsable\r\n\r\n#XFLD: Time field label\r\nview.Appointment.time=Heure\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.subject=Titre\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.title=Titre\r\n\r\n#XFLD: Label for Start date and time\r\nview.Appointment.startdatetime=Date/heure de d\\u00E9but\r\n\r\n#XFLD: Label for End date and time\r\nview.Appointment.enddatetime=Date/heure de fin\r\n\r\n#XFLD: Label for All day checkbox\r\nview.Appointment.alldayevent=Toute la journ\\u00E9e\r\n\r\n#YMSG: info message in case appointment occurs in the past\r\nview.Appointment.occurspast=Le rendez-vous se situe dans le pass\\u00E9.\r\n\r\n#YMSG: info message in case no title entered\r\nview.Appointment.notitle=Saisissez un titre\r\n\r\n#XFLD: Label for Private checkbox\r\nview.Appointment.private=Priv\\u00E9\r\n\r\n#XFLD: Location field label\r\nview.Appointment.location=Lieu\r\n\r\n#XFLD: Importance field label\r\nview.Appointment.importance=Importance\r\n\r\n#XFLD: Active Status field label\r\nview.Appointment.activeStatus=Statut\r\n\r\n#XFLD: Notes field label\r\nview.Appointment.notes=Notes\r\n\r\n#XFLD: Note field label\r\nview.Appointment.note=Notes\r\n\r\n#XFLD: Label for internal attendees\r\nview.Appointment.internal=Interne\r\n\r\n#XFLD: Label for external attendees\r\nview.Appointment.external=Externe\r\n\r\n#XGRP: Group header of the section for showing the general data\r\nview.Appointment.generalData=Donn\\u00E9es g\\u00E9n\\u00E9rales\r\n\r\n#XGRP: Group header of the section for showing the contact data\r\nview.Appointment.contactData=Contact\r\n\r\n#XGRP: Group header of the section for showing the attendees\r\nview.Appointment.attendeeData=Participants\r\n\r\n#XGRP: Group header attendees with number\r\nview.Appointment.attendeeDataNumber=Participants ({0})\r\n\r\n#XGRP: Group header additional attendees with number\r\nview.Appointment.additionalAttendeeNumber=Participants suppl\\u00E9mentaires ({0})\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.detailData=D\\u00E9tails\r\n\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.appointmentDetail=Rendez-vous\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Opportunity=Opportunit\\u00E9\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Task=T\\u00E2che\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.attachmentData=Pi\\u00E8ces jointes\r\n\r\n#XGRP: Group header attachments with number how many\r\nview.Appointment.attachmentDataNumber=Pi\\u00E8ces jointes ({0})\r\n\r\n#XGRP: Group header attachments with request to save the appointment before file upload \r\nview.Appointment.attachmentSaveRequest=Pi\\u00E8ces jointes (sauvegarder avant de t\\u00E9l\\u00E9charger les pi\\u00E8ces jointes)\r\n\r\n#XBUT: Button text to Delete\r\nview.Appointment.delete=Supprimer\r\n\r\n#XBUT: Button text to Follow up\r\nview.Appointment.followup=Activit\\u00E9 suivante\r\n\r\n#YMSG: no transaction types  present\r\nview.Appointment.FOLLOWUPERROR=Aucun type de transaction trouv\\u00E9. Contr\\u00F4lez le Customizing du backend.\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.deletesuccess=Rendez-vous supprim\\u00E9\r\n\r\n#YMSG: successful followup message in message toast\r\nview.Appointment.followupsuccessful=Rendez-vous suivant sauvegard\\u00E9\r\n\r\n#XBUT: Button text to Edit\r\nview.Appointment.edit=Modifier\r\n\r\n#XBUT: Button text to Done\r\nview.Appointment.done=Termin\\u00E9\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.cancel=Interrompre\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.ok=OK\r\n\r\n#XBUT: Button text to Create\r\nview.Appointment.create=Cr\\u00E9er\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.savesuccess=Rendez-vous sauvegard\\u00E9\r\n\r\n#XBUT: Button text to SAve\r\nview.Appointment.save=Sauvegarder\r\n\r\n#XBUT: Button text for Day\r\nview.Appointment.day=Jour\r\n\r\n#XBUT: Button text for week\r\nview.Appointment.week=Semaine\r\n\r\n#XBUT: Button text for month\r\nview.Appointment.month=Mois\r\n\r\n#XFLD: loading text for the appointment list\r\nview.Appointment.loaddatatext=Chargement...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.acsea_title=Comptes ({0})\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.acsea_nodata=Aucun compte trouv\\u00E9\r\n\r\n#XFLD: placeholdertext for search fields\r\nview.Appointment.searchfieldplaceholder=Rechercher\r\n\r\n#XFLD: placeholdertext for search busy text\r\nview.Appointment.searchlistinfo=Recherche...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.consea_title=Contacts ({0})\r\n\r\n#XTIT: title of the business card for accounts\r\nview.Appointment.account_title=Compte\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.employee_title=Salari\\u00E9\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.contact_title=Contact\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.consea_nodata=Aucun contact trouv\\u00E9\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.empsea_nodata=Aucun salari\\u00E9 trouv\\u00E9\r\n\r\n#XTIT: title of internal attendees search popup\r\nview.Appointment.internal_title=Participants internes ({0})\r\n\r\n#XTIT: title of external attendees search popup\r\nview.Appointment.external_title=Participants externes ({0})\r\n\r\n#XTIT: title of internal attendees search popup enhanced with total count\r\nview.Appointment.internal_titlenew=Nouveaux participants internes ({0})\r\n\r\n#XTIT: title of external attendees search popup enhanced with total count\r\nview.Appointment.external_titlenew=Nouveaux participants externes ({0})\r\n\r\n#YMSG: Filtered by info bar text for contact search popup\r\nview.Appointment.filteredby=Filtr\\u00E9 par\r\n\r\n#YMSG: filter line for cross navigation: Filter by Account \r\nview.Appointment.filteraccount=Filtr\\u00E9 par compte\r\n\r\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\r\nview.Appointment.duration.min={0} mn.\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\r\nview.Appointment.duration.hour={0}\\u00A0h\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.day={0}\\u00A0jour\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.days={0}\\u00A0jours\r\n\r\n#XTIT: Button text to Delete \r\nview.Appointment.deleteTitle=Supprimer\r\n\r\n#YINS: Text for Pop Up action.  User to react (Yes/No) \r\nview.Appointment.deleteInstruction=Supprimer ce rendez-vous ?\r\n\r\n#XBUT: User to react (positive) to delete action \r\nview.Appointment.deleteYes=OK\r\n\r\n#XFLD: placeholder text for fiels adding external attendees\r\nview.Appointment.attexternaladd=Ajouter participant externe\r\n\r\n#XFLD: placeholder text for fiels adding internal attendees\r\nview.Appointment.attinternaladd=Ajouter un/une coll\\u00E8gue\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.fromTimeDate=De {0}, le{1}\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.toTimeDate=\\u00E0 {0}, le {1}\r\n\r\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\r\nview.Appointment.timeToTime={0} \\u00E0 {1}\r\n\r\n#XFLD: empty appointment list text \r\nview.Appointment.appointment_nodata=Aucun rendez-vous\r\n\r\n#XFLD: employee fullname: {0} firstname {1} lastname\r\nview.Appointment.employeename={0} {1}\r\n\r\n#XTIT: Title for Edit Appointment page\r\nview.Appointment.editappointment=Modifier le rendez-vous\r\n\r\n#YMSG: Error when end time is before start time (on same day)\r\nview.Appointment.wrongTimes=Heure de fin ant\\u00E9rieure \\u00E0 heure de d\\u00E9but\r\n\r\n#YMSG: Error when end date is before start date\r\nview.Appointment.wrongDates=Date de fin ant\\u00E9rieure \\u00E0 date de d\\u00E9but\r\n\r\n#XBUT: Button text for Add Button\r\nview.Appointment.add=Ajouter\r\n\r\n#XTIT: Shell Title of App\r\nview.Appointment.shelltitle=Mes rendez-vous\r\n\r\n#XFLD: empty list text for external attendee popup\r\nview.Appointment.noextattendees=Aucun participant externe\r\n\r\n#XFLD: empty list text for internal attendee popup\r\nview.Appointment.nointattendees=Aucun participant interne\r\n\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Seuls vos rendez-vous s\'affichent\r\n\r\n#YMSG: info message in case edit page is left with back and data changed\r\nview.Appointment.leaveeditmessage=Vos entr\\u00E9es seront perdues si vous quittez cette page. Poursuivre ?\r\n\r\n#YMSG: info message in case of wrong format of Start Date\r\nview.Appointment.validStartDate=Saisissez une date de d\\u00E9but valide.\r\n\r\n#YMSG: info message in case of wrong format of End Date\r\nview.Appointment.validEndDate=Saisissez une date de fin valide.\r\n\r\n#YMSG: info message in case of wrong format of Start Date and End Date\r\nview.Appointment.validStartEndDate=Saisissez des dates de d\\u00E9but et de fin valides.\r\n\r\n#XTIT: Title for Process type dialog\r\nview.Appointment.process_type=S\\u00E9lection du type de transaction\r\n\r\n#XFLD: No Data text when loading/searching list\r\nview.Appointment.no_data_text=Aucun poste disponible actuellement\r\n\r\n#XFLD: Transaction Type\r\nview.Appointment.TransactionType=Type\r\n\r\n#YMSG : PRIVATE appointment message\r\nview.Appointment.privateMessage=Il s\'agit d\'un rendez-vous priv\\u00E9.\r\n\r\n#XFLD: Title for private appointment in shared calendar\r\nview.Appointment.privateAppointment=Rendez-vous priv\\u00E9\r\n#XTIT: this is the title for the Transaction History Tab\r\nTRANS_HISTORY=Historique de la transaction\r\n\r\n#XFLD, 30: Field Transaction ID on List\r\nTRANS_ID=ID de transaction\r\n\r\n#XFLD, 30: Field Transaction Type on List\r\nTRANS_TYPE=Type de transaction\r\n\r\n#XFLD, 30: Field Description on List\r\nTRANS_DESC=Description\r\n\r\n#XFLD, 30: Field Created On on List\r\nCREATED_ON=Cr\\u00E9ation le\r\n\r\n#XFLD, 30: Field Created On on List\r\nRELATIONSHIP=Type de relation\r\n\r\n#XFLD, 15: Priority label\r\nview.Appointment.priority=Priorit\\u00E9\r\n\r\n#YMSG, 50:Customizing incomplete\r\nCUSTOMIZING_INCOMPLETE=Customizing incomplet. Contactez l\'administrateur syst\\u00E8me.\r\n\r\n#XBUT: Button text to Messages\r\nview.Appointment.messages=Messages\r\n\r\n#XGRP: Error message dialog title\r\nview.Appointment.errorMessage=Messages ({0})\r\n\r\n#YMSG: contact not assigned to this account\r\n',
	"cus/crm/mycalendar/i18n/i18n_hr.properties":'\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n\r\n#XTIT: Title of App\r\nview.Appointment.apptitle=Sastanci\r\n\r\n#XTIT: Title of New Appointment screen\r\nview.Appointment.newapptitle=Novi sastanak\r\n\r\n#XFLD: tooltip  for create new appointment button\r\nview.Appointment.newapptm_tt=Novi sastanak\r\n\r\n#XTIT: Title of shared calendars\r\nview.Appointment.sharedCalendars=Zajedni\\u010Dki kalendari\r\n\r\n#XBUT: Button text of my calendar\r\nview.Appointment.mycalendar=Moj kalendar\r\n\r\n#XTIT: Title of infotoolbar \r\nview.Appointment.myTeam=Moji \\u010Dlanovi tima\r\n\r\n#XTIT: Appointment list description with location,account text and contact text\r\nview.Appointment.furtherDetails={0} | {1} ({2})\r\n\r\n#XTIT: Appointment list description with account text and contact text\r\nview.Appointment.furtherDetailsWithoutLoc={0} ({1})\r\n\r\n#XTIT: Appointment list description with loc  and account text\r\nview.Appointment.furtherDetailsWithoutContact={0} | {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Podatke je promijenio drugi korisnik. Izaberite OK za dohva\\u0107anje najnovijih podataka.\r\n#XTIT: Appointment list description without loc and cantact text\r\nview.Appointment.furtherDetailsWithoutContactAndLoc={0}\r\n\r\n#XTIT: Title of Timeline\r\nview.Appointment.Timeline=Raspored\r\n\r\n#XTIT: Title of Calendars\r\nview.Appointment.Calendars=Kalendari\r\n\r\n#XFLD: tooltip for today button\r\nview.Appointment.today_tt=Danas\r\n\r\n#XTIT: Header text of Appointment detail\r\nview.Appointment.detail=Detalji sastanka\r\n\r\n#XFLD: Account field label\r\nview.Appointment.account=Klijent\r\n\r\n#XFLD: Contact field label\r\nview.Appointment.contact=Kontakt\r\n\r\n#XFLD: Employee Responsible field label\r\nview.Appointment.employeeResponsible=Odgovorni zaposlenik\r\n\r\n#XFLD: Time field label\r\nview.Appointment.time=Vrijeme\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.subject=Naslov\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.title=Naslov\r\n\r\n#XFLD: Label for Start date and time\r\nview.Appointment.startdatetime=Datum i vrijeme po\\u010Detka\r\n\r\n#XFLD: Label for End date and time\r\nview.Appointment.enddatetime=Datum i vrijeme zavr\\u0161etka\r\n\r\n#XFLD: Label for All day checkbox\r\nview.Appointment.alldayevent=Cijeli dan\r\n\r\n#YMSG: info message in case appointment occurs in the past\r\nview.Appointment.occurspast=Sastanak je u pro\\u0161losti\r\n\r\n#YMSG: info message in case no title entered\r\nview.Appointment.notitle=Unesi naslov\r\n\r\n#XFLD: Label for Private checkbox\r\nview.Appointment.private=Osobno\r\n\r\n#XFLD: Location field label\r\nview.Appointment.location=Lokacija\r\n\r\n#XFLD: Importance field label\r\nview.Appointment.importance=Va\\u017Enost\r\n\r\n#XFLD: Active Status field label\r\nview.Appointment.activeStatus=Status\r\n\r\n#XFLD: Notes field label\r\nview.Appointment.notes=Bilje\\u0161ke\r\n\r\n#XFLD: Note field label\r\nview.Appointment.note=Bilje\\u0161ke\r\n\r\n#XFLD: Label for internal attendees\r\nview.Appointment.internal=Interno\r\n\r\n#XFLD: Label for external attendees\r\nview.Appointment.external=Vanjski\r\n\r\n#XGRP: Group header of the section for showing the general data\r\nview.Appointment.generalData=Op\\u0107i podaci\r\n\r\n#XGRP: Group header of the section for showing the contact data\r\nview.Appointment.contactData=Kontakt\r\n\r\n#XGRP: Group header of the section for showing the attendees\r\nview.Appointment.attendeeData=Sudionici\r\n\r\n#XGRP: Group header attendees with number\r\nview.Appointment.attendeeDataNumber=Sudionici ({0})\r\n\r\n#XGRP: Group header additional attendees with number\r\nview.Appointment.additionalAttendeeNumber=Dodatni sudionici ({0})\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.detailData=Detalji\r\n\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.appointmentDetail=Sastanak\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Opportunity=Prilika\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Task=Zadatak\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.attachmentData=Prilozi\r\n\r\n#XGRP: Group header attachments with number how many\r\nview.Appointment.attachmentDataNumber=Prilozi ({0})\r\n\r\n#XGRP: Group header attachments with request to save the appointment before file upload \r\nview.Appointment.attachmentSaveRequest=Prilozi (snimi prije prijenosa na poslu\\u017Eitelj)\r\n\r\n#XBUT: Button text to Delete\r\nview.Appointment.delete=Izbri\\u0161i\r\n\r\n#XBUT: Button text to Follow up\r\nview.Appointment.followup=Sljede\\u0107a aktivnost\r\n\r\n#YMSG: no transaction types  present\r\nview.Appointment.FOLLOWUPERROR=Nisu na\\u0111eni tipovi transakcija. Provjerite back-end prilagodbu.\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.deletesuccess=Sastanak izbrisan\r\n\r\n#YMSG: successful followup message in message toast\r\nview.Appointment.followupsuccessful=Sljede\\u0107i sastanak snimljen\r\n\r\n#XBUT: Button text to Edit\r\nview.Appointment.edit=Uredi\r\n\r\n#XBUT: Button text to Done\r\nview.Appointment.done=Izvr\\u0161eno\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.cancel=Otka\\u017Ei\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.ok=U redu\r\n\r\n#XBUT: Button text to Create\r\nview.Appointment.create=Kreiraj\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.savesuccess=Sastanak snimljen\r\n\r\n#XBUT: Button text to SAve\r\nview.Appointment.save=Snimi\r\n\r\n#XBUT: Button text for Day\r\nview.Appointment.day=Dan\r\n\r\n#XBUT: Button text for week\r\nview.Appointment.week=Tjedan\r\n\r\n#XBUT: Button text for month\r\nview.Appointment.month=Mjesec\r\n\r\n#XFLD: loading text for the appointment list\r\nview.Appointment.loaddatatext=U\\u010Ditavanje...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.acsea_title=Klijenti ({0})\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.acsea_nodata=Klijenti nisu na\\u0111eni\r\n\r\n#XFLD: placeholdertext for search fields\r\nview.Appointment.searchfieldplaceholder=Tra\\u017Eenje\r\n\r\n#XFLD: placeholdertext for search busy text\r\nview.Appointment.searchlistinfo=Tra\\u017Eenje...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.consea_title=Kontakti ({0})\r\n\r\n#XTIT: title of the business card for accounts\r\nview.Appointment.account_title=Klijent\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.employee_title=Zaposlenik\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.contact_title=Kontakt\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.consea_nodata=Kontakti nisu na\\u0111eni\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.empsea_nodata=Zaposlenici nisu na\\u0111eni\r\n\r\n#XTIT: title of internal attendees search popup\r\nview.Appointment.internal_title=Interni sudionici ({0})\r\n\r\n#XTIT: title of external attendees search popup\r\nview.Appointment.external_title=Vanjski sudionici ({0})\r\n\r\n#XTIT: title of internal attendees search popup enhanced with total count\r\nview.Appointment.internal_titlenew=Novi interni sudionici ({0})\r\n\r\n#XTIT: title of external attendees search popup enhanced with total count\r\nview.Appointment.external_titlenew=Novi vanjski sudionici ({0})\r\n\r\n#YMSG: Filtered by info bar text for contact search popup\r\nview.Appointment.filteredby=Filtrirano po\r\n\r\n#YMSG: filter line for cross navigation: Filter by Account \r\nview.Appointment.filteraccount=Filtrirano po klijentu\r\n\r\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\r\nview.Appointment.duration.min={0} min\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\r\nview.Appointment.duration.hour={0} sati\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.day={0} dan\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.days={0} dana\r\n\r\n#XTIT: Button text to Delete \r\nview.Appointment.deleteTitle=Izbri\\u0161i\r\n\r\n#YINS: Text for Pop Up action.  User to react (Yes/No) \r\nview.Appointment.deleteInstruction=Izbrisati ovaj sastanak?\r\n\r\n#XBUT: User to react (positive) to delete action \r\nview.Appointment.deleteYes=U redu\r\n\r\n#XFLD: placeholder text for fiels adding external attendees\r\nview.Appointment.attexternaladd=Dodaj vanjskog sudionika\r\n\r\n#XFLD: placeholder text for fiels adding internal attendees\r\nview.Appointment.attinternaladd=Dodaj kolegu\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.fromTimeDate=Od {0} {1}\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.toTimeDate=Do {0} {1}\r\n\r\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\r\nview.Appointment.timeToTime={0} do {1}\r\n\r\n#XFLD: empty appointment list text \r\nview.Appointment.appointment_nodata=Nema sastanaka\r\n\r\n#XFLD: employee fullname: {0} firstname {1} lastname\r\nview.Appointment.employeename={0} {1}\r\n\r\n#XTIT: Title for Edit Appointment page\r\nview.Appointment.editappointment=Uredi sastanak\r\n\r\n#YMSG: Error when end time is before start time (on same day)\r\nview.Appointment.wrongTimes=Vrijeme zavr\\u0161etka je prije vremena po\\u010Detka\r\n\r\n#YMSG: Error when end date is before start date\r\nview.Appointment.wrongDates=Datum zavr\\u0161etka je prije datuma po\\u010Detka\r\n\r\n#XBUT: Button text for Add Button\r\nview.Appointment.add=Dodaj\r\n\r\n#XTIT: Shell Title of App\r\nview.Appointment.shelltitle=Moji sastanci\r\n\r\n#XFLD: empty list text for external attendee popup\r\nview.Appointment.noextattendees=Nema vanjskih sudionika\r\n\r\n#XFLD: empty list text for internal attendee popup\r\nview.Appointment.nointattendees=Nema internih sudionika\r\n\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Prikazani su samo va\\u0161i sastanci\r\n\r\n#YMSG: info message in case edit page is left with back and data changed\r\nview.Appointment.leaveeditmessage=Va\\u0161i \\u0107e se unosi izgubiti ako napustite stranicu. \\u017Delite li nastaviti?\r\n\r\n#YMSG: info message in case of wrong format of Start Date\r\nview.Appointment.validStartDate=Unesite va\\u017Ee\\u0107i datum po\\u010Detka\r\n\r\n#YMSG: info message in case of wrong format of End Date\r\nview.Appointment.validEndDate=Unesite va\\u017Ee\\u0107i datum zavr\\u0161etka\r\n\r\n#YMSG: info message in case of wrong format of Start Date and End Date\r\nview.Appointment.validStartEndDate=Unesite va\\u017Ee\\u0107i datum po\\u010Detka i datum zavr\\u0161etka\r\n\r\n#XTIT: Title for Process type dialog\r\nview.Appointment.process_type=Odaberi tip transakcije\r\n\r\n#XFLD: No Data text when loading/searching list\r\nview.Appointment.no_data_text=Stavke trenutno nisu raspolo\\u017Eive\r\n\r\n#XFLD: Transaction Type\r\nview.Appointment.TransactionType=Tip\r\n\r\n#YMSG : PRIVATE appointment message\r\nview.Appointment.privateMessage=Ovo je privatni sastanak\r\n\r\n#XFLD: Title for private appointment in shared calendar\r\nview.Appointment.privateAppointment=Privatni sastanak\r\n#XTIT: this is the title for the Transaction History Tab\r\nTRANS_HISTORY=Povijest transakcije\r\n\r\n#XFLD, 30: Field Transaction ID on List\r\nTRANS_ID=ID transakcije\r\n\r\n#XFLD, 30: Field Transaction Type on List\r\nTRANS_TYPE=Tip transakcije\r\n\r\n#XFLD, 30: Field Description on List\r\nTRANS_DESC=Opis\r\n\r\n#XFLD, 30: Field Created On on List\r\nCREATED_ON=Datum kreiranja\r\n\r\n#XFLD, 30: Field Created On on List\r\nRELATIONSHIP=Tip odnosa\r\n\r\n#XFLD, 15: Priority label\r\nview.Appointment.priority=Prioritet\r\n\r\n#YMSG, 50:Customizing incomplete\r\nCUSTOMIZING_INCOMPLETE=Prilagodba nepotpuna. Kontaktirajte svog administratora sustava.\r\n\r\n#XBUT: Button text to Messages\r\nview.Appointment.messages=Poruke\r\n\r\n#XGRP: Error message dialog title\r\nview.Appointment.errorMessage=Poruke ({0})\r\n\r\n#YMSG: contact not assigned to this account\r\n',
	"cus/crm/mycalendar/i18n/i18n_hu.properties":'\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n\r\n#XTIT: Title of App\r\nview.Appointment.apptitle=Tal\\u00E1lkoz\\u00F3k\r\n\r\n#XTIT: Title of New Appointment screen\r\nview.Appointment.newapptitle=\\u00DAj tal\\u00E1lkoz\\u00F3\r\n\r\n#XFLD: tooltip  for create new appointment button\r\nview.Appointment.newapptm_tt=\\u00DAj tal\\u00E1lkoz\\u00F3\r\n\r\n#XTIT: Title of shared calendars\r\nview.Appointment.sharedCalendars=Megosztott napt\\u00E1rak\r\n\r\n#XBUT: Button text of my calendar\r\nview.Appointment.mycalendar=Saj\\u00E1t napt\\u00E1r\r\n\r\n#XTIT: Title of infotoolbar \r\nview.Appointment.myTeam=Saj\\u00E1t csapattagok\r\n\r\n#XTIT: Appointment list description with location,account text and contact text\r\nview.Appointment.furtherDetails={0} | {1} ({2})\r\n\r\n#XTIT: Appointment list description with account text and contact text\r\nview.Appointment.furtherDetailsWithoutLoc={0} ({1})\r\n\r\n#XTIT: Appointment list description with loc  and account text\r\nview.Appointment.furtherDetailsWithoutContact={0} | {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Az adatokat egy m\\u00E1sik felhaszn\\u00E1l\\u00F3 m\\u00F3dos\\u00EDtotta. A legfrissebb adatok h\\u00EDv\\u00E1s\\u00E1hoz v\\u00E1lassza az OK-t.\r\n#XTIT: Appointment list description without loc and cantact text\r\nview.Appointment.furtherDetailsWithoutContactAndLoc={0}\r\n\r\n#XTIT: Title of Timeline\r\nview.Appointment.Timeline=\\u00DCtemterv\r\n\r\n#XTIT: Title of Calendars\r\nview.Appointment.Calendars=Napt\\u00E1rak\r\n\r\n#XFLD: tooltip for today button\r\nview.Appointment.today_tt=Ma\r\n\r\n#XTIT: Header text of Appointment detail\r\nview.Appointment.detail=Tal\\u00E1lkoz\\u00F3 r\\u00E9szletei\r\n\r\n#XFLD: Account field label\r\nview.Appointment.account=\\u00DCgyf\\u00E9l\r\n\r\n#XFLD: Contact field label\r\nview.Appointment.contact=T\\u00E1rgyal\\u00F3partner\r\n\r\n#XFLD: Employee Responsible field label\r\nview.Appointment.employeeResponsible=Illet\\u00E9kes dolgoz\\u00F3\r\n\r\n#XFLD: Time field label\r\nview.Appointment.time=Id\\u0151pont\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.subject=C\\u00EDm\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.title=C\\u00EDm\r\n\r\n#XFLD: Label for Start date and time\r\nview.Appointment.startdatetime=Kezd\\u0151 d\\u00E1tum \\u00E9s id\\u0151p.\r\n\r\n#XFLD: Label for End date and time\r\nview.Appointment.enddatetime=Z\\u00E1r\\u00F3 d\\u00E1tum \\u00E9s id\\u0151pont\r\n\r\n#XFLD: Label for All day checkbox\r\nview.Appointment.alldayevent=Eg\\u00E9sz nap\r\n\r\n#YMSG: info message in case appointment occurs in the past\r\nview.Appointment.occurspast=A tal\\u00E1lkoz\\u00F3 a m\\u00FAltban van\r\n\r\n#YMSG: info message in case no title entered\r\nview.Appointment.notitle=Adjon meg egy c\\u00EDmet\r\n\r\n#XFLD: Label for Private checkbox\r\nview.Appointment.private=Priv\\u00E1t\r\n\r\n#XFLD: Location field label\r\nview.Appointment.location=Hely\r\n\r\n#XFLD: Importance field label\r\nview.Appointment.importance=Fontoss\\u00E1g\r\n\r\n#XFLD: Active Status field label\r\nview.Appointment.activeStatus=St\\u00E1tus\r\n\r\n#XFLD: Notes field label\r\nview.Appointment.notes=Megjegyz\\u00E9sek\r\n\r\n#XFLD: Note field label\r\nview.Appointment.note=Megjegyz\\u00E9sek\r\n\r\n#XFLD: Label for internal attendees\r\nview.Appointment.internal=Bels\\u0151\r\n\r\n#XFLD: Label for external attendees\r\nview.Appointment.external=K\\u00FCls\\u0151\r\n\r\n#XGRP: Group header of the section for showing the general data\r\nview.Appointment.generalData=\\u00C1ltal\\u00E1nos adatok\r\n\r\n#XGRP: Group header of the section for showing the contact data\r\nview.Appointment.contactData=T\\u00E1rgyal\\u00F3partner\r\n\r\n#XGRP: Group header of the section for showing the attendees\r\nview.Appointment.attendeeData=R\\u00E9sztvev\\u0151k\r\n\r\n#XGRP: Group header attendees with number\r\nview.Appointment.attendeeDataNumber=R\\u00E9sztvev\\u0151k ({0})\r\n\r\n#XGRP: Group header additional attendees with number\r\nview.Appointment.additionalAttendeeNumber=Kieg\\u00E9sz\\u00EDt\\u0151 r\\u00E9sztvev\\u0151k ({0})\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.detailData=R\\u00E9szletek\r\n\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.appointmentDetail=Tal\\u00E1lkoz\\u00F3\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Opportunity=Opportunity\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Task=Feladat\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.attachmentData=Mell\\u00E9kletek\r\n\r\n#XGRP: Group header attachments with number how many\r\nview.Appointment.attachmentDataNumber=Mell\\u00E9kletek ({0})\r\n\r\n#XGRP: Group header attachments with request to save the appointment before file upload \r\nview.Appointment.attachmentSaveRequest=Mell\\u00E9kletek (ment\\u00E9s felt\\u00F6lt\\u00E9s el\\u0151tt)\r\n\r\n#XBUT: Button text to Delete\r\nview.Appointment.delete=T\\u00F6rl\\u00E9s\r\n\r\n#XBUT: Button text to Follow up\r\nview.Appointment.followup=K\\u00F6vet\\u0151 m\\u0171velet\r\n\r\n#YMSG: no transaction types  present\r\nview.Appointment.FOLLOWUPERROR=Nem tal\\u00E1lhat\\u00F3 m\\u0171veletfajta. K\\u00E9rem, ellen\\u0151rizze a back-end customizingot.\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.deletesuccess=Tal\\u00E1lkoz\\u00F3 t\\u00F6rl\\u0151d\\u00F6tt\r\n\r\n#YMSG: successful followup message in message toast\r\nview.Appointment.followupsuccessful=K\\u00F6vetkez\\u0151 id\\u0151pont mentve\r\n\r\n#XBUT: Button text to Edit\r\nview.Appointment.edit=Feldolgoz\\u00E1s\r\n\r\n#XBUT: Button text to Done\r\nview.Appointment.done=K\\u00E9sz\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.cancel=M\\u00E9gse\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.ok=OK\r\n\r\n#XBUT: Button text to Create\r\nview.Appointment.create=L\\u00E9trehoz\\u00E1s\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.savesuccess=Tal\\u00E1lkoz\\u00F3 elmentve\r\n\r\n#XBUT: Button text to SAve\r\nview.Appointment.save=Ment\\u00E9s\r\n\r\n#XBUT: Button text for Day\r\nview.Appointment.day=Nap\r\n\r\n#XBUT: Button text for week\r\nview.Appointment.week=H\\u00E9t\r\n\r\n#XBUT: Button text for month\r\nview.Appointment.month=H\\u00F3nap\r\n\r\n#XFLD: loading text for the appointment list\r\nview.Appointment.loaddatatext=Bet\\u00F6lt\\u00E9s...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.acsea_title=Sz\\u00E1ml\\u00E1k ({0})\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.acsea_nodata=Nem tal\\u00E1lhat\\u00F3k fi\\u00F3kok\r\n\r\n#XFLD: placeholdertext for search fields\r\nview.Appointment.searchfieldplaceholder=Keres\\u00E9s\r\n\r\n#XFLD: placeholdertext for search busy text\r\nview.Appointment.searchlistinfo=Keres\\u00E9s...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.consea_title=Kapcsolatok ({0})\r\n\r\n#XTIT: title of the business card for accounts\r\nview.Appointment.account_title=Fi\\u00F3k\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.employee_title=Dolgoz\\u00F3\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.contact_title=T\\u00E1rgyal\\u00F3partner\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.consea_nodata=Nem tal\\u00E1lhat\\u00F3k t\\u00E1rgyal\\u00F3partnerek\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.empsea_nodata=Nem tal\\u00E1lhat\\u00F3k dolgoz\\u00F3k\r\n\r\n#XTIT: title of internal attendees search popup\r\nview.Appointment.internal_title=Bels\\u0151 r\\u00E9sztvev\\u0151k ({0})\r\n\r\n#XTIT: title of external attendees search popup\r\nview.Appointment.external_title=K\\u00FCls\\u0151 r\\u00E9sztvev\\u0151k ({0})\r\n\r\n#XTIT: title of internal attendees search popup enhanced with total count\r\nview.Appointment.internal_titlenew=\\u00DAj bels\\u0151 r\\u00E9sztvev\\u0151k ({0})\r\n\r\n#XTIT: title of external attendees search popup enhanced with total count\r\nview.Appointment.external_titlenew=\\u00DAj k\\u00FCls\\u0151 r\\u00E9sztvev\\u0151k ({0})\r\n\r\n#YMSG: Filtered by info bar text for contact search popup\r\nview.Appointment.filteredby=Sz\\u0171r\\u00E9s a k\\u00F6vetkez\\u0151 szerint\\:\r\n\r\n#YMSG: filter line for cross navigation: Filter by Account \r\nview.Appointment.filteraccount=Sz\\u0171r\\u00E9s fi\\u00F3k szerint\r\n\r\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\r\nview.Appointment.duration.min={0} min\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\r\nview.Appointment.duration.hour={0} h\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.day={0} nap\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.days={0} nap\r\n\r\n#XTIT: Button text to Delete \r\nview.Appointment.deleteTitle=T\\u00F6rl\\u00E9s\r\n\r\n#YINS: Text for Pop Up action.  User to react (Yes/No) \r\nview.Appointment.deleteInstruction=T\\u00F6rli ezt a tal\\u00E1lkoz\\u00F3t?\r\n\r\n#XBUT: User to react (positive) to delete action \r\nview.Appointment.deleteYes=Rendben\r\n\r\n#XFLD: placeholder text for fiels adding external attendees\r\nview.Appointment.attexternaladd=K\\u00FCls\\u0151 r\\u00E9sztvev\\u0151 hozz\\u00E1ad\\u00E1sa\r\n\r\n#XFLD: placeholder text for fiels adding internal attendees\r\nview.Appointment.attinternaladd=Koll\\u00E9ga hozz\\u00E1ad\\u00E1sa\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.fromTimeDate=Kezdete {0} {1}\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.toTimeDate=V\\u00E9ge {0} {1}\r\n\r\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\r\nview.Appointment.timeToTime={0} V\\u00E9ge {1}\r\n\r\n#XFLD: empty appointment list text \r\nview.Appointment.appointment_nodata=Nincsenek tal\\u00E1lkoz\\u00F3k\r\n\r\n#XFLD: employee fullname: {0} firstname {1} lastname\r\nview.Appointment.employeename={0} {1}\r\n\r\n#XTIT: Title for Edit Appointment page\r\nview.Appointment.editappointment=Tal\\u00E1lkoz\\u00F3 feldolgoz\\u00E1sa\r\n\r\n#YMSG: Error when end time is before start time (on same day)\r\nview.Appointment.wrongTimes=A z\\u00E1r\\u00F3 id\\u0151pont a kezd\\u0151 id\\u0151pont el\\u0151tt van\r\n\r\n#YMSG: Error when end date is before start date\r\nview.Appointment.wrongDates=A z\\u00E1r\\u00F3 d\\u00E1tum a kezd\\u0151 d\\u00E1tum el\\u0151tt van\r\n\r\n#XBUT: Button text for Add Button\r\nview.Appointment.add=Hozz\\u00E1ad\\u00E1s\r\n\r\n#XTIT: Shell Title of App\r\nview.Appointment.shelltitle=Saj\\u00E1t tal\\u00E1lkoz\\u00F3k\r\n\r\n#XFLD: empty list text for external attendee popup\r\nview.Appointment.noextattendees=Nincs k\\u00FCls\\u0151 r\\u00E9sztvev\\u0151\r\n\r\n#XFLD: empty list text for internal attendee popup\r\nview.Appointment.nointattendees=Nincs bels\\u0151 r\\u00E9sztvev\\u0151\r\n\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Csak a saj\\u00E1t tal\\u00E1lkoz\\u00F3k megjelen\\u00EDt\\u00E9se\r\n\r\n#YMSG: info message in case edit page is left with back and data changed\r\nview.Appointment.leaveeditmessage=A megadott adatok elvesznek, ha elhagyja ezt az oldalt. Szeretn\\u00E9 folytatni?\r\n\r\n#YMSG: info message in case of wrong format of Start Date\r\nview.Appointment.validStartDate=Adjon meg \\u00E9rv\\u00E9nyes kezd\\u0151 d\\u00E1tumot\r\n\r\n#YMSG: info message in case of wrong format of End Date\r\nview.Appointment.validEndDate=Adjon meg \\u00E9rv\\u00E9nyes z\\u00E1r\\u00F3 d\\u00E1tumot\r\n\r\n#YMSG: info message in case of wrong format of Start Date and End Date\r\nview.Appointment.validStartEndDate=Adjon meg \\u00E9rv\\u00E9nyes kezd\\u0151 \\u00E9s z\\u00E1r\\u00F3 d\\u00E1tumot\r\n\r\n#XTIT: Title for Process type dialog\r\nview.Appointment.process_type=Tranzakci\\u00F3fajta kiv\\u00E1laszt\\u00E1sa\r\n\r\n#XFLD: No Data text when loading/searching list\r\nview.Appointment.no_data_text=Jelenleg nem \\u00E1ll rendelkez\\u00E9sre t\\u00E9tel\r\n\r\n#XFLD: Transaction Type\r\nview.Appointment.TransactionType=T\\u00EDpus\r\n\r\n#YMSG : PRIVATE appointment message\r\nview.Appointment.privateMessage=Ez egy priv\\u00E1t id\\u0151pont\r\n\r\n#XFLD: Title for private appointment in shared calendar\r\nview.Appointment.privateAppointment=Priv\\u00E1t id\\u0151pont\r\n#XTIT: this is the title for the Transaction History Tab\r\nTRANS_HISTORY=Tranzakci\\u00F3t\\u00F6rt\\u00E9net\r\n\r\n#XFLD, 30: Field Transaction ID on List\r\nTRANS_ID=Tranzakci\\u00F3azonos\\u00EDt\\u00F3\r\n\r\n#XFLD, 30: Field Transaction Type on List\r\nTRANS_TYPE=M\\u0171veletfajta\r\n\r\n#XFLD, 30: Field Description on List\r\nTRANS_DESC=Le\\u00EDr\\u00E1s\r\n\r\n#XFLD, 30: Field Created On on List\r\nCREATED_ON=L\\u00E9trehoz\\u00E1s d\\u00E1tuma\r\n\r\n#XFLD, 30: Field Created On on List\r\nRELATIONSHIP=Kapcsolat fajt\\u00E1ja\r\n\r\n#XFLD, 15: Priority label\r\nview.Appointment.priority=Priorit\\u00E1s\r\n\r\n#YMSG, 50:Customizing incomplete\r\nCUSTOMIZING_INCOMPLETE=A customizing hi\\u00E1nyos. K\\u00E9rem, \\u00E9rtes\\u00EDtse a rendszeradminisztr\\u00E1tort.\r\n\r\n#XBUT: Button text to Messages\r\nview.Appointment.messages=\\u00DCzenetek\r\n\r\n#XGRP: Error message dialog title\r\nview.Appointment.errorMessage=\\u00DCzenetek ({0})\r\n\r\n#YMSG: contact not assigned to this account\r\n',
	"cus/crm/mycalendar/i18n/i18n_it.properties":'\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n\r\n#XTIT: Title of App\r\nview.Appointment.apptitle=Appuntamenti\r\n\r\n#XTIT: Title of New Appointment screen\r\nview.Appointment.newapptitle=Nuovo appuntamento\r\n\r\n#XFLD: tooltip  for create new appointment button\r\nview.Appointment.newapptm_tt=Nuovo appuntamento\r\n\r\n#XTIT: Title of shared calendars\r\nview.Appointment.sharedCalendars=Calendari condivisi\r\n\r\n#XBUT: Button text of my calendar\r\nview.Appointment.mycalendar=Il mio calendario\r\n\r\n#XTIT: Title of infotoolbar \r\nview.Appointment.myTeam=I membri del mio team\r\n\r\n#XTIT: Appointment list description with location,account text and contact text\r\nview.Appointment.furtherDetails={0} | {1} ({2})\r\n\r\n#XTIT: Appointment list description with account text and contact text\r\nview.Appointment.furtherDetailsWithoutLoc={0} ({1})\r\n\r\n#XTIT: Appointment list description with loc  and account text\r\nview.Appointment.furtherDetailsWithoutContact={0} | {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Dati modificati da un altro utente. Fai clic su OK per chiamare gli ultimi dati.\r\n#XTIT: Appointment list description without loc and cantact text\r\nview.Appointment.furtherDetailsWithoutContactAndLoc={0}\r\n\r\n#XTIT: Title of Timeline\r\nview.Appointment.Timeline=Sequenza cronologica\r\n\r\n#XTIT: Title of Calendars\r\nview.Appointment.Calendars=Calendari\r\n\r\n#XFLD: tooltip for today button\r\nview.Appointment.today_tt=Oggi\r\n\r\n#XTIT: Header text of Appointment detail\r\nview.Appointment.detail=Dettagli appuntamento\r\n\r\n#XFLD: Account field label\r\nview.Appointment.account=Cliente\r\n\r\n#XFLD: Contact field label\r\nview.Appointment.contact=Contatto\r\n\r\n#XFLD: Employee Responsible field label\r\nview.Appointment.employeeResponsible=Dipendente responsabile\r\n\r\n#XFLD: Time field label\r\nview.Appointment.time=Ora\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.subject=Titolo\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.title=Titolo\r\n\r\n#XFLD: Label for Start date and time\r\nview.Appointment.startdatetime=Data e ora di inizio\r\n\r\n#XFLD: Label for End date and time\r\nview.Appointment.enddatetime=Data e ora di fine\r\n\r\n#XFLD: Label for All day checkbox\r\nview.Appointment.alldayevent=Tutto il giorno\r\n\r\n#YMSG: info message in case appointment occurs in the past\r\nview.Appointment.occurspast=L\'appuntamento ha luogo nel passato\r\n\r\n#YMSG: info message in case no title entered\r\nview.Appointment.notitle=Inserisci un titolo\r\n\r\n#XFLD: Label for Private checkbox\r\nview.Appointment.private=Privato\r\n\r\n#XFLD: Location field label\r\nview.Appointment.location=Ubicazione\r\n\r\n#XFLD: Importance field label\r\nview.Appointment.importance=Importanza\r\n\r\n#XFLD: Active Status field label\r\nview.Appointment.activeStatus=Stato\r\n\r\n#XFLD: Notes field label\r\nview.Appointment.notes=Note\r\n\r\n#XFLD: Note field label\r\nview.Appointment.note=Note\r\n\r\n#XFLD: Label for internal attendees\r\nview.Appointment.internal=Interno\r\n\r\n#XFLD: Label for external attendees\r\nview.Appointment.external=Esterno\r\n\r\n#XGRP: Group header of the section for showing the general data\r\nview.Appointment.generalData=Dati generali\r\n\r\n#XGRP: Group header of the section for showing the contact data\r\nview.Appointment.contactData=Contatto\r\n\r\n#XGRP: Group header of the section for showing the attendees\r\nview.Appointment.attendeeData=Partecipanti\r\n\r\n#XGRP: Group header attendees with number\r\nview.Appointment.attendeeDataNumber=Partecipanti ({0})\r\n\r\n#XGRP: Group header additional attendees with number\r\nview.Appointment.additionalAttendeeNumber=Partecipanti supplementari ({0})\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.detailData=Dettagli\r\n\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.appointmentDetail=Appuntamento\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Opportunity=Opportunit\\u00E0\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Task=Task\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.attachmentData=Allegati\r\n\r\n#XGRP: Group header attachments with number how many\r\nview.Appointment.attachmentDataNumber=Allegati ({0})\r\n\r\n#XGRP: Group header attachments with request to save the appointment before file upload \r\nview.Appointment.attachmentSaveRequest=Allegati (salva prima di caricare)\r\n\r\n#XBUT: Button text to Delete\r\nview.Appointment.delete=Elimina\r\n\r\n#XBUT: Button text to Follow up\r\nview.Appointment.followup=Task successivo\r\n\r\n#YMSG: no transaction types  present\r\nview.Appointment.FOLLOWUPERROR=Nessun tipo di transazione trovato; controlla il customizing back-end.\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.deletesuccess=Appuntamento eliminato\r\n\r\n#YMSG: successful followup message in message toast\r\nview.Appointment.followupsuccessful=Appuntamento successivo salvato\r\n\r\n#XBUT: Button text to Edit\r\nview.Appointment.edit=Elabora\r\n\r\n#XBUT: Button text to Done\r\nview.Appointment.done=Fatto\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.cancel=Annulla\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.ok=OK\r\n\r\n#XBUT: Button text to Create\r\nview.Appointment.create=Crea\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.savesuccess=Appuntamento salvato\r\n\r\n#XBUT: Button text to SAve\r\nview.Appointment.save=Salva\r\n\r\n#XBUT: Button text for Day\r\nview.Appointment.day=Giorno\r\n\r\n#XBUT: Button text for week\r\nview.Appointment.week=Settimana\r\n\r\n#XBUT: Button text for month\r\nview.Appointment.month=Mese\r\n\r\n#XFLD: loading text for the appointment list\r\nview.Appointment.loaddatatext=In caricamento...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.acsea_title=Clienti ({0})\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.acsea_nodata=Nessun cliente trovato\r\n\r\n#XFLD: placeholdertext for search fields\r\nview.Appointment.searchfieldplaceholder=Cerca\r\n\r\n#XFLD: placeholdertext for search busy text\r\nview.Appointment.searchlistinfo=Ricerca in corso...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.consea_title=Contatti ({0})\r\n\r\n#XTIT: title of the business card for accounts\r\nview.Appointment.account_title=Cliente\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.employee_title=Dipendente\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.contact_title=Contatto\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.consea_nodata=Nessun contatto trovato\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.empsea_nodata=Nessun dipendente trovato\r\n\r\n#XTIT: title of internal attendees search popup\r\nview.Appointment.internal_title=Partecipanti interni ({0})\r\n\r\n#XTIT: title of external attendees search popup\r\nview.Appointment.external_title=Partecipanti esterni ({0})\r\n\r\n#XTIT: title of internal attendees search popup enhanced with total count\r\nview.Appointment.internal_titlenew=Nuovi partecipanti interni ({0})\r\n\r\n#XTIT: title of external attendees search popup enhanced with total count\r\nview.Appointment.external_titlenew=Nuovi partecipanti esterni ({0})\r\n\r\n#YMSG: Filtered by info bar text for contact search popup\r\nview.Appointment.filteredby=Filtrato in base a\r\n\r\n#YMSG: filter line for cross navigation: Filter by Account \r\nview.Appointment.filteraccount=Filtrato in base al cliente\r\n\r\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\r\nview.Appointment.duration.min={0} min\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\r\nview.Appointment.duration.hour={0} h\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.day={0} giorno\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.days={0} giorni\r\n\r\n#XTIT: Button text to Delete \r\nview.Appointment.deleteTitle=Elimina\r\n\r\n#YINS: Text for Pop Up action.  User to react (Yes/No) \r\nview.Appointment.deleteInstruction=Eliminare questo appuntamento?\r\n\r\n#XBUT: User to react (positive) to delete action \r\nview.Appointment.deleteYes=OK\r\n\r\n#XFLD: placeholder text for fiels adding external attendees\r\nview.Appointment.attexternaladd=Aggiungi partecipante esterno\r\n\r\n#XFLD: placeholder text for fiels adding internal attendees\r\nview.Appointment.attinternaladd=Aggiungi un collega\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.fromTimeDate=Da {0} {1}\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.toTimeDate=A {0} {1}\r\n\r\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\r\nview.Appointment.timeToTime={0} a   {1}\r\n\r\n#XFLD: empty appointment list text \r\nview.Appointment.appointment_nodata=Nessun appuntamento\r\n\r\n#XFLD: employee fullname: {0} firstname {1} lastname\r\nview.Appointment.employeename={0} {1}\r\n\r\n#XTIT: Title for Edit Appointment page\r\nview.Appointment.editappointment=Elabora appuntamento\r\n\r\n#YMSG: Error when end time is before start time (on same day)\r\nview.Appointment.wrongTimes=L\'ora di fine precede l\'ora di inizio\r\n\r\n#YMSG: Error when end date is before start date\r\nview.Appointment.wrongDates=La data di fine precede la data di inizio\r\n\r\n#XBUT: Button text for Add Button\r\nview.Appointment.add=Aggiungi\r\n\r\n#XTIT: Shell Title of App\r\nview.Appointment.shelltitle=I miei appuntamenti\r\n\r\n#XFLD: empty list text for external attendee popup\r\nview.Appointment.noextattendees=Nessun partecipante esterno\r\n\r\n#XFLD: empty list text for internal attendee popup\r\nview.Appointment.nointattendees=Nessun partecipante interno\r\n\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Sono visualizzati solo i tuoi appuntamenti\r\n\r\n#YMSG: info message in case edit page is left with back and data changed\r\nview.Appointment.leaveeditmessage=L\'uscita dalla pagina causer\\u00E0 la perdita dei tuoi inserimenti. Proseguire?\r\n\r\n#YMSG: info message in case of wrong format of Start Date\r\nview.Appointment.validStartDate=Inserisci una data di inizio valida\r\n\r\n#YMSG: info message in case of wrong format of End Date\r\nview.Appointment.validEndDate=Inserisci una data di fine valida\r\n\r\n#YMSG: info message in case of wrong format of Start Date and End Date\r\nview.Appointment.validStartEndDate=Inserisci una data di inizio e di fine valide\r\n\r\n#XTIT: Title for Process type dialog\r\nview.Appointment.process_type=Seleziona tipo di transazione\r\n\r\n#XFLD: No Data text when loading/searching list\r\nview.Appointment.no_data_text=Nessuna posizione attualmente disponibile\r\n\r\n#XFLD: Transaction Type\r\nview.Appointment.TransactionType=Tipo\r\n\r\n#YMSG : PRIVATE appointment message\r\nview.Appointment.privateMessage=Si tratta di un appuntamento privato\r\n\r\n#XFLD: Title for private appointment in shared calendar\r\nview.Appointment.privateAppointment=Appuntamento privato\r\n#XTIT: this is the title for the Transaction History Tab\r\nTRANS_HISTORY=Storico transazioni\r\n\r\n#XFLD, 30: Field Transaction ID on List\r\nTRANS_ID=ID transazione\r\n\r\n#XFLD, 30: Field Transaction Type on List\r\nTRANS_TYPE=Tipo di transazione\r\n\r\n#XFLD, 30: Field Description on List\r\nTRANS_DESC=Descrizione\r\n\r\n#XFLD, 30: Field Created On on List\r\nCREATED_ON=Data di creazione\r\n\r\n#XFLD, 30: Field Created On on List\r\nRELATIONSHIP=Tipo di relazione\r\n\r\n#XFLD, 15: Priority label\r\nview.Appointment.priority=Priorit\\u00E0\r\n\r\n#YMSG, 50:Customizing incomplete\r\nCUSTOMIZING_INCOMPLETE=Customizing incompleto. Contatta l\'amministratore di sistema.\r\n\r\n#XBUT: Button text to Messages\r\nview.Appointment.messages=Messaggi\r\n\r\n#XGRP: Error message dialog title\r\nview.Appointment.errorMessage=Messaggi ({0})\r\n\r\n#YMSG: contact not assigned to this account\r\n',
	"cus/crm/mycalendar/i18n/i18n_iw.properties":'\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n\r\n#XTIT: Title of App\r\nview.Appointment.apptitle=\\u05E4\\u05D2\\u05D9\\u05E9\\u05D5\\u05EA\r\n\r\n#XTIT: Title of New Appointment screen\r\nview.Appointment.newapptitle=\\u05E4\\u05D2\\u05D9\\u05E9\\u05D4 \\u05D7\\u05D3\\u05E9\\u05D4\r\n\r\n#XFLD: tooltip  for create new appointment button\r\nview.Appointment.newapptm_tt=\\u05E4\\u05D2\\u05D9\\u05E9\\u05D4 \\u05D7\\u05D3\\u05E9\\u05D4\r\n\r\n#XTIT: Title of shared calendars\r\nview.Appointment.sharedCalendars=\\u05DC\\u05D5\\u05D7\\u05D5\\u05EA \\u05E9\\u05E0\\u05D4 \\u05DE\\u05E9\\u05D5\\u05EA\\u05E4\\u05D9\\u05DD\r\n\r\n#XBUT: Button text of my calendar\r\nview.Appointment.mycalendar=\\u05DC\\u05D5\\u05D7 \\u05D4\\u05E9\\u05E0\\u05D4 \\u05E9\\u05DC\\u05D9\r\n\r\n#XTIT: Title of infotoolbar \r\nview.Appointment.myTeam=\\u05D0\\u05E0\\u05E9\\u05D9 \\u05D4\\u05E6\\u05D5\\u05D5\\u05EA \\u05E9\\u05DC\\u05D9\r\n\r\n#XTIT: Appointment list description with location,account text and contact text\r\nview.Appointment.furtherDetails={0} | {1} ({2})\r\n\r\n#XTIT: Appointment list description with account text and contact text\r\nview.Appointment.furtherDetailsWithoutLoc={0} ({1})\r\n\r\n#XTIT: Appointment list description with loc  and account text\r\nview.Appointment.furtherDetailsWithoutContact={0} | {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=\\u05D4\\u05E0\\u05EA\\u05D5\\u05E0\\u05D9\\u05DD \\u05E9\\u05D5\\u05E0\\u05D5 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D0\\u05D7\\u05E8. \\u05D1\\u05D7\\u05E8 OK \\u05DB\\u05D3\\u05D9 \\u05DC\\u05D0\\u05D7\\u05D6\\u05E8 \\u05D0\\u05EA \\u05D4\\u05E0\\u05EA\\u05D5\\u05E0\\u05D9\\u05DD \\u05D4\\u05D0\\u05D7\\u05E8\\u05D5\\u05E0\\u05D9\\u05DD.\r\n#XTIT: Appointment list description without loc and cantact text\r\nview.Appointment.furtherDetailsWithoutContactAndLoc={0}\r\n\r\n#XTIT: Title of Timeline\r\nview.Appointment.Timeline=\\u05E6\\u05D9\\u05E8 \\u05D6\\u05DE\\u05DF\r\n\r\n#XTIT: Title of Calendars\r\nview.Appointment.Calendars=\\u05DC\\u05D5\\u05D7\\u05D5\\u05EA \\u05E9\\u05E0\\u05D4\r\n\r\n#XFLD: tooltip for today button\r\nview.Appointment.today_tt=\\u05D4\\u05D9\\u05D5\\u05DD\r\n\r\n#XTIT: Header text of Appointment detail\r\nview.Appointment.detail=\\u05E4\\u05E8\\u05D8\\u05D9 \\u05E4\\u05D2\\u05D9\\u05E9\\u05D4\r\n\r\n#XFLD: Account field label\r\nview.Appointment.account=\\u05DC\\u05E7\\u05D5\\u05D7\r\n\r\n#XFLD: Contact field label\r\nview.Appointment.contact=\\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8\r\n\r\n#XFLD: Employee Responsible field label\r\nview.Appointment.employeeResponsible=\\u05E2\\u05D5\\u05D1\\u05D3 \\u05D0\\u05D7\\u05E8\\u05D0\\u05D9\r\n\r\n#XFLD: Time field label\r\nview.Appointment.time=\\u05E9\\u05E2\\u05D4\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.subject=\\u05DB\\u05D5\\u05EA\\u05E8\\u05EA\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.title=\\u05DB\\u05D5\\u05EA\\u05E8\\u05EA\r\n\r\n#XFLD: Label for Start date and time\r\nview.Appointment.startdatetime=\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05D5\\u05E9\\u05E2\\u05EA \\u05D4\\u05EA\\u05D7\\u05DC\\u05D4\r\n\r\n#XFLD: Label for End date and time\r\nview.Appointment.enddatetime=\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05D5\\u05E9\\u05E2\\u05EA \\u05E1\\u05D9\\u05D5\\u05DD\r\n\r\n#XFLD: Label for All day checkbox\r\nview.Appointment.alldayevent=\\u05DB\\u05DC \\u05D4\\u05D9\\u05D5\\u05DD\r\n\r\n#YMSG: info message in case appointment occurs in the past\r\nview.Appointment.occurspast=\\u05D4\\u05E4\\u05D2\\u05D9\\u05E9\\u05D4 \\u05DE\\u05EA\\u05E8\\u05D7\\u05E9\\u05EA \\u05D1\\u05E2\\u05D1\\u05E8\r\n\r\n#YMSG: info message in case no title entered\r\nview.Appointment.notitle=\\u05D4\\u05D6\\u05DF \\u05DB\\u05D5\\u05EA\\u05E8\\u05EA\r\n\r\n#XFLD: Label for Private checkbox\r\nview.Appointment.private=\\u05E4\\u05E8\\u05D8\\u05D9\r\n\r\n#XFLD: Location field label\r\nview.Appointment.location=\\u05DE\\u05D9\\u05E7\\u05D5\\u05DD\r\n\r\n#XFLD: Importance field label\r\nview.Appointment.importance=\\u05D7\\u05E9\\u05D9\\u05D1\\u05D5\\u05EA\r\n\r\n#XFLD: Active Status field label\r\nview.Appointment.activeStatus=\\u05E1\\u05D8\\u05D0\\u05D8\\u05D5\\u05E1\r\n\r\n#XFLD: Notes field label\r\nview.Appointment.notes=\\u05D4\\u05E2\\u05E8\\u05D5\\u05EA\r\n\r\n#XFLD: Note field label\r\nview.Appointment.note=\\u05D4\\u05E2\\u05E8\\u05D5\\u05EA\r\n\r\n#XFLD: Label for internal attendees\r\nview.Appointment.internal=\\u05E4\\u05E0\\u05D9\\u05DE\\u05D9\r\n\r\n#XFLD: Label for external attendees\r\nview.Appointment.external=\\u05D7\\u05D9\\u05E6\\u05D5\\u05E0\\u05D9\r\n\r\n#XGRP: Group header of the section for showing the general data\r\nview.Appointment.generalData=\\u05E0\\u05EA\\u05D5\\u05E0\\u05D9\\u05DD \\u05DB\\u05DC\\u05DC\\u05D9\\u05D9\\u05DD\r\n\r\n#XGRP: Group header of the section for showing the contact data\r\nview.Appointment.contactData=\\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8\r\n\r\n#XGRP: Group header of the section for showing the attendees\r\nview.Appointment.attendeeData=\\u05DE\\u05E9\\u05EA\\u05EA\\u05E4\\u05D9\\u05DD\r\n\r\n#XGRP: Group header attendees with number\r\nview.Appointment.attendeeDataNumber=\\u05DE\\u05E9\\u05EA\\u05EA\\u05E4\\u05D9\\u05DD ({0})\r\n\r\n#XGRP: Group header additional attendees with number\r\nview.Appointment.additionalAttendeeNumber=\\u05DE\\u05E9\\u05EA\\u05EA\\u05E4\\u05D9\\u05DD \\u05E0\\u05D5\\u05E1\\u05E4\\u05D9\\u05DD ({0})\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.detailData=\\u05E4\\u05E8\\u05D8\\u05D9\\u05DD\r\n\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.appointmentDetail=\\u05E4\\u05D2\\u05D9\\u05E9\\u05D4\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Opportunity=\\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Task=\\u05DE\\u05E9\\u05D9\\u05DE\\u05D4\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.attachmentData=\\u05E7\\u05D1\\u05E6\\u05D9\\u05DD \\u05DE\\u05E6\\u05D5\\u05E8\\u05E4\\u05D9\\u05DD\r\n\r\n#XGRP: Group header attachments with number how many\r\nview.Appointment.attachmentDataNumber=\\u05E7\\u05D1\\u05E6\\u05D9\\u05DD \\u05DE\\u05E6\\u05D5\\u05E8\\u05E4\\u05D9\\u05DD ({0})\r\n\r\n#XGRP: Group header attachments with request to save the appointment before file upload \r\nview.Appointment.attachmentSaveRequest=\\u05E7\\u05D1\\u05E6\\u05D9\\u05DD \\u05DE\\u05E6\\u05D5\\u05E8\\u05E4\\u05D9\\u05DD (\\u05E9\\u05DE\\u05D5\\u05E8 \\u05DC\\u05E4\\u05E0\\u05D9 \\u05D4\\u05E2\\u05DC\\u05D0\\u05D4)\r\n\r\n#XBUT: Button text to Delete\r\nview.Appointment.delete=\\u05DE\\u05D7\\u05E7\r\n\r\n#XBUT: Button text to Follow up\r\nview.Appointment.followup=\\u05DE\\u05E2\\u05E7\\u05D1\r\n\r\n#YMSG: no transaction types  present\r\nview.Appointment.FOLLOWUPERROR=\\u05DC\\u05D0 \\u05E0\\u05DE\\u05E6\\u05D0\\u05D5 \\u05E1\\u05D5\\u05D2\\u05D9 \\u05E4\\u05E2\\u05D5\\u05DC\\u05D5\\u05EA. \\u05D1\\u05D3\\u05D5\\u05E7 \\u05D0\\u05EA \\u05D4\\u05EA\\u05D0\\u05DE\\u05EA \\u05D4-Back-End.\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.deletesuccess=\\u05D4\\u05E4\\u05D2\\u05D9\\u05E9\\u05D4 \\u05E0\\u05DE\\u05D7\\u05E7\\u05D4\r\n\r\n#YMSG: successful followup message in message toast\r\nview.Appointment.followupsuccessful=\\u05E4\\u05D2\\u05D9\\u05E9\\u05EA \\u05DE\\u05E2\\u05E7\\u05D1 \\u05E0\\u05E9\\u05DE\\u05E8\\u05D4\r\n\r\n#XBUT: Button text to Edit\r\nview.Appointment.edit=\\u05E2\\u05E8\\u05D5\\u05DA\r\n\r\n#XBUT: Button text to Done\r\nview.Appointment.done=\\u05D1\\u05D5\\u05E6\\u05E2\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.cancel=\\u05D1\\u05D8\\u05DC\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.ok=OK\r\n\r\n#XBUT: Button text to Create\r\nview.Appointment.create=\\u05E6\\u05D5\\u05E8\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.savesuccess=\\u05D4\\u05E4\\u05D2\\u05D9\\u05E9\\u05D4 \\u05E0\\u05E9\\u05DE\\u05E8\\u05D4\r\n\r\n#XBUT: Button text to SAve\r\nview.Appointment.save=\\u05E9\\u05DE\\u05D5\\u05E8\r\n\r\n#XBUT: Button text for Day\r\nview.Appointment.day=\\u05D9\\u05D5\\u05DD\r\n\r\n#XBUT: Button text for week\r\nview.Appointment.week=\\u05E9\\u05D1\\u05D5\\u05E2\r\n\r\n#XBUT: Button text for month\r\nview.Appointment.month=\\u05D7\\u05D5\\u05D3\\u05E9\r\n\r\n#XFLD: loading text for the appointment list\r\nview.Appointment.loaddatatext=\\u05D8\\u05D5\\u05E2\\u05DF...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.acsea_title=\\u05D7\\u05E9\\u05D1\\u05D5\\u05E0\\u05D5\\u05EA ({0})\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.acsea_nodata=\\u05DC\\u05D0 \\u05E0\\u05DE\\u05E6\\u05D0\\u05D5 \\u05DC\\u05E7\\u05D5\\u05D7\\u05D5\\u05EA\r\n\r\n#XFLD: placeholdertext for search fields\r\nview.Appointment.searchfieldplaceholder=\\u05D7\\u05E4\\u05E9\r\n\r\n#XFLD: placeholdertext for search busy text\r\nview.Appointment.searchlistinfo=\\u05DE\\u05D7\\u05E4\\u05E9...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.consea_title=\\u05D0\\u05E0\\u05E9\\u05D9 \\u05E7\\u05E9\\u05E8 ({0})\r\n\r\n#XTIT: title of the business card for accounts\r\nview.Appointment.account_title=\\u05DC\\u05E7\\u05D5\\u05D7\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.employee_title=\\u05E2\\u05D5\\u05D1\\u05D3\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.contact_title=\\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.consea_nodata=\\u05DC\\u05D0 \\u05E0\\u05DE\\u05E6\\u05D0\\u05D5 \\u05D0\\u05E0\\u05E9\\u05D9 \\u05E7\\u05E9\\u05E8\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.empsea_nodata=\\u05DC\\u05D0 \\u05E0\\u05DE\\u05E6\\u05D0\\u05D5 \\u05E2\\u05D5\\u05D1\\u05D3\\u05D9\\u05DD\r\n\r\n#XTIT: title of internal attendees search popup\r\nview.Appointment.internal_title=\\u05DE\\u05E9\\u05EA\\u05EA\\u05E4\\u05D9\\u05DD \\u05E4\\u05E0\\u05D9\\u05DE\\u05D9\\u05D9\\u05DD ({0})\r\n\r\n#XTIT: title of external attendees search popup\r\nview.Appointment.external_title=\\u05DE\\u05E9\\u05EA\\u05EA\\u05E4\\u05D9\\u05DD \\u05D7\\u05D9\\u05E6\\u05D5\\u05E0\\u05D9\\u05D9\\u05DD ({0})\r\n\r\n#XTIT: title of internal attendees search popup enhanced with total count\r\nview.Appointment.internal_titlenew=\\u05DE\\u05E9\\u05EA\\u05EA\\u05E4\\u05D9\\u05DD \\u05E4\\u05E0\\u05D9\\u05DE\\u05D9\\u05D9\\u05DD \\u05D7\\u05D3\\u05E9\\u05D9\\u05DD ({0})\r\n\r\n#XTIT: title of external attendees search popup enhanced with total count\r\nview.Appointment.external_titlenew=\\u05DE\\u05E9\\u05EA\\u05EA\\u05E4\\u05D9\\u05DD \\u05D7\\u05D9\\u05E6\\u05D5\\u05E0\\u05D9\\u05D9\\u05DD \\u05D7\\u05D3\\u05E9\\u05D9\\u05DD ({0})\r\n\r\n#YMSG: Filtered by info bar text for contact search popup\r\nview.Appointment.filteredby=\\u05E1\\u05D5\\u05E0\\u05DF \\u05DC\\u05E4\\u05D9\r\n\r\n#YMSG: filter line for cross navigation: Filter by Account \r\nview.Appointment.filteraccount=\\u05E1\\u05D5\\u05E0\\u05DF \\u05DC\\u05E4\\u05D9 \\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8\r\n\r\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\r\nview.Appointment.duration.min={0} \\u05D3\\u05E7\\u05D5\\u05EA\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\r\nview.Appointment.duration.hour={0} \\u05E9\\u05E2\\u05D5\\u05EA\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.day=\\u05D9\\u05D5\\u05DD {0} \r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.days={0} \\u05D9\\u05DE\\u05D9\\u05DD\r\n\r\n#XTIT: Button text to Delete \r\nview.Appointment.deleteTitle=\\u05DE\\u05D7\\u05E7\r\n\r\n#YINS: Text for Pop Up action.  User to react (Yes/No) \r\nview.Appointment.deleteInstruction=\\u05D4\\u05D0\\u05DD \\u05DC\\u05DE\\u05D7\\u05D5\\u05E7 \\u05E4\\u05D2\\u05D9\\u05E9\\u05D4 \\u05D6\\u05D5?\r\n\r\n#XBUT: User to react (positive) to delete action \r\nview.Appointment.deleteYes=OK\r\n\r\n#XFLD: placeholder text for fiels adding external attendees\r\nview.Appointment.attexternaladd=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05DE\\u05E9\\u05EA\\u05EA\\u05E3 \\u05D7\\u05D9\\u05E6\\u05D5\\u05E0\\u05D9\r\n\r\n#XFLD: placeholder text for fiels adding internal attendees\r\nview.Appointment.attinternaladd=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05E2\\u05DE\\u05D9\\u05EA \\u05DC\\u05E2\\u05D1\\u05D5\\u05D3\\u05D4\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.fromTimeDate=\\u05DE-{0} {1}\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.toTimeDate=\\u05E2\\u05D3 {0} {1}\r\n\r\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\r\nview.Appointment.timeToTime={0} \\u05E2\\u05D3   {1}\r\n\r\n#XFLD: empty appointment list text \r\nview.Appointment.appointment_nodata=\\u05D0\\u05D9\\u05DF \\u05E4\\u05D2\\u05D9\\u05E9\\u05D5\\u05EA\r\n\r\n#XFLD: employee fullname: {0} firstname {1} lastname\r\nview.Appointment.employeename={0} {1}\r\n\r\n#XTIT: Title for Edit Appointment page\r\nview.Appointment.editappointment=\\u05E2\\u05E8\\u05D5\\u05DA \\u05E4\\u05D2\\u05D9\\u05E9\\u05D4\r\n\r\n#YMSG: Error when end time is before start time (on same day)\r\nview.Appointment.wrongTimes=\\u05E9\\u05E2\\u05EA \\u05D4\\u05E1\\u05D9\\u05D5\\u05DD \\u05D7\\u05DC\\u05D4 \\u05DC\\u05E4\\u05E0\\u05D9 \\u05E9\\u05E2\\u05EA \\u05D4\\u05D4\\u05EA\\u05D7\\u05DC\\u05D4\r\n\r\n#YMSG: Error when end date is before start date\r\nview.Appointment.wrongDates=\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05D4\\u05E1\\u05D9\\u05D5\\u05DD \\u05D7\\u05DC \\u05DC\\u05E4\\u05E0\\u05D9 \\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05D4\\u05D4\\u05EA\\u05D7\\u05DC\\u05D4\r\n\r\n#XBUT: Button text for Add Button\r\nview.Appointment.add=\\u05D4\\u05D5\\u05E1\\u05E3\r\n\r\n#XTIT: Shell Title of App\r\nview.Appointment.shelltitle=\\u05D4\\u05E4\\u05D2\\u05D9\\u05E9\\u05D5\\u05EA \\u05E9\\u05DC\\u05D9\r\n\r\n#XFLD: empty list text for external attendee popup\r\nview.Appointment.noextattendees=\\u05D0\\u05D9\\u05DF \\u05DE\\u05E9\\u05EA\\u05EA\\u05E4\\u05D9\\u05DD \\u05D7\\u05D9\\u05E6\\u05D5\\u05E0\\u05D9\\u05D9\\u05DD\r\n\r\n#XFLD: empty list text for internal attendee popup\r\nview.Appointment.nointattendees=\\u05D0\\u05D9\\u05DF \\u05DE\\u05E9\\u05EA\\u05EA\\u05E4\\u05D9\\u05DD \\u05E4\\u05E0\\u05D9\\u05DE\\u05D9\\u05D9\\u05DD\r\n\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=\\u05E8\\u05E7 \\u05D4\\u05E4\\u05D2\\u05D9\\u05E9\\u05D5\\u05EA \\u05E9\\u05DC\\u05DA \\u05DE\\u05D5\\u05E6\\u05D2\\u05D5\\u05EA\r\n\r\n#YMSG: info message in case edit page is left with back and data changed\r\nview.Appointment.leaveeditmessage=\\u05D4\\u05D4\\u05D6\\u05E0\\u05D5\\u05EA \\u05E9\\u05DC\\u05DA \\u05D9\\u05D0\\u05D1\\u05D3\\u05D5 \\u05D0\\u05DD \\u05EA\\u05E6\\u05D0 \\u05DE\\u05D3\\u05E3 \\u05D6\\u05D4. \\u05D4\\u05D0\\u05DD \\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05D4\\u05DE\\u05E9\\u05D9\\u05DA?\r\n\r\n#YMSG: info message in case of wrong format of Start Date\r\nview.Appointment.validStartDate=\\u05D4\\u05D6\\u05DF \\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05D4\\u05EA\\u05D7\\u05DC\\u05D4 \\u05EA\\u05E7\\u05E3\r\n\r\n#YMSG: info message in case of wrong format of End Date\r\nview.Appointment.validEndDate=\\u05D4\\u05D6\\u05DF \\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05E1\\u05D9\\u05D5\\u05DD \\u05EA\\u05E7\\u05E3\r\n\r\n#YMSG: info message in case of wrong format of Start Date and End Date\r\nview.Appointment.validStartEndDate=\\u05D4\\u05D6\\u05DF \\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05D4\\u05EA\\u05D7\\u05DC\\u05D4 \\u05D5\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05E1\\u05D9\\u05D5\\u05DD \\u05EA\\u05E7\\u05E4\\u05D9\\u05DD\r\n\r\n#XTIT: Title for Process type dialog\r\nview.Appointment.process_type=\\u05D1\\u05D7\\u05E8 \\u05E1\\u05D5\\u05D2 \\u05EA\\u05E0\\u05D5\\u05E2\\u05D4\r\n\r\n#XFLD: No Data text when loading/searching list\r\nview.Appointment.no_data_text=\\u05D0\\u05D9\\u05DF \\u05DB\\u05E8\\u05D2\\u05E2 \\u05E4\\u05E8\\u05D9\\u05D8\\u05D9\\u05DD \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD\r\n\r\n#XFLD: Transaction Type\r\nview.Appointment.TransactionType=\\u05E1\\u05D5\\u05D2\r\n\r\n#YMSG : PRIVATE appointment message\r\nview.Appointment.privateMessage=\\u05D6\\u05D5\\u05D4\\u05D9 \\u05E4\\u05D2\\u05D9\\u05E9\\u05D4 \\u05E4\\u05E8\\u05D8\\u05D9\\u05EA\r\n\r\n#XFLD: Title for private appointment in shared calendar\r\nview.Appointment.privateAppointment=\\u05E4\\u05D2\\u05D9\\u05E9\\u05D4 \\u05E4\\u05E8\\u05D8\\u05D9\\u05EA\r\n#XTIT: this is the title for the Transaction History Tab\r\nTRANS_HISTORY=\\u05D4\\u05D9\\u05E1\\u05D8\\u05D5\\u05E8\\u05D9\\u05D9\\u05EA \\u05EA\\u05E0\\u05D5\\u05E2\\u05D5\\u05EA\r\n\r\n#XFLD, 30: Field Transaction ID on List\r\nTRANS_ID=\\u05D6\\u05D9\\u05D4\\u05D5\\u05D9 \\u05EA\\u05E0\\u05D5\\u05E2\\u05D4\r\n\r\n#XFLD, 30: Field Transaction Type on List\r\nTRANS_TYPE=\\u05E1\\u05D5\\u05D2 \\u05EA\\u05E0\\u05D5\\u05E2\\u05D4\r\n\r\n#XFLD, 30: Field Description on List\r\nTRANS_DESC=\\u05EA\\u05D9\\u05D0\\u05D5\\u05E8\r\n\r\n#XFLD, 30: Field Created On on List\r\nCREATED_ON=\\u05E0\\u05D5\\u05E6\\u05E8 \\u05D1\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA\r\n\r\n#XFLD, 30: Field Created On on List\r\nRELATIONSHIP=\\u05E1\\u05D5\\u05D2 \\u05E7\\u05E9\\u05E8\r\n\r\n#XFLD, 15: Priority label\r\nview.Appointment.priority=\\u05E2\\u05D3\\u05D9\\u05E4\\u05D5\\u05EA\r\n\r\n#YMSG, 50:Customizing incomplete\r\nCUSTOMIZING_INCOMPLETE=\\u05D4\\u05EA\\u05D0\\u05DE\\u05D4 \\u05D0\\u05D9\\u05E9\\u05D9\\u05EA \\u05DC\\u05D0 \\u05D4\\u05D5\\u05E9\\u05DC\\u05DE\\u05D4. \\u05E4\\u05E0\\u05D4 \\u05D0\\u05DC \\u05DE\\u05E0\\u05D4\\u05DC \\u05D4\\u05DE\\u05E2\\u05E8\\u05DB\\u05EA \\u05E9\\u05DC\\u05DA.\r\n\r\n#XBUT: Button text to Messages\r\nview.Appointment.messages=\\u05D4\\u05D5\\u05D3\\u05E2\\u05D5\\u05EA\r\n\r\n#XGRP: Error message dialog title\r\nview.Appointment.errorMessage=\\u05D4\\u05D5\\u05D3\\u05E2\\u05D5\\u05EA ({0})\r\n\r\n#YMSG: contact not assigned to this account\r\n',
	"cus/crm/mycalendar/i18n/i18n_ja.properties":'\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n\r\n#XTIT: Title of App\r\nview.Appointment.apptitle=\\u4E88\\u5B9A\r\n\r\n#XTIT: Title of New Appointment screen\r\nview.Appointment.newapptitle=\\u65B0\\u898F\\u4E88\\u5B9A\r\n\r\n#XFLD: tooltip  for create new appointment button\r\nview.Appointment.newapptm_tt=\\u65B0\\u898F\\u4E88\\u5B9A\r\n\r\n#XTIT: Title of shared calendars\r\nview.Appointment.sharedCalendars=\\u5171\\u6709\\u30AB\\u30EC\\u30F3\\u30C0\r\n\r\n#XBUT: Button text of my calendar\r\nview.Appointment.mycalendar=My \\u30AB\\u30EC\\u30F3\\u30C0\r\n\r\n#XTIT: Title of infotoolbar \r\nview.Appointment.myTeam=My \\u30C1\\u30FC\\u30E0\\u30E1\\u30F3\\u30D0\\u30FC\r\n\r\n#XTIT: Appointment list description with location,account text and contact text\r\nview.Appointment.furtherDetails={0} | {1} ({2})\r\n\r\n#XTIT: Appointment list description with account text and contact text\r\nview.Appointment.furtherDetailsWithoutLoc={0} ({1})\r\n\r\n#XTIT: Appointment list description with loc  and account text\r\nview.Appointment.furtherDetailsWithoutContact={0} | {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=\\u30C7\\u30FC\\u30BF\\u306F\\u5225\\u306E\\u30E6\\u30FC\\u30B6\\u306B\\u3088\\u308A\\u5909\\u66F4\\u3055\\u308C\\u3066\\u3044\\u307E\\u3059\\u3002OK \\u3092\\u9078\\u629E\\u3057\\u3066\\u6700\\u65B0\\u30C7\\u30FC\\u30BF\\u3092\\u53D6\\u5F97\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\r\n#XTIT: Appointment list description without loc and cantact text\r\nview.Appointment.furtherDetailsWithoutContactAndLoc={0}\r\n\r\n#XTIT: Title of Timeline\r\nview.Appointment.Timeline=\\u6642\\u7CFB\\u5217\r\n\r\n#XTIT: Title of Calendars\r\nview.Appointment.Calendars=\\u30AB\\u30EC\\u30F3\\u30C0\r\n\r\n#XFLD: tooltip for today button\r\nview.Appointment.today_tt=\\u672C\\u65E5\r\n\r\n#XTIT: Header text of Appointment detail\r\nview.Appointment.detail=\\u4E88\\u5B9A\\u8A73\\u7D30\r\n\r\n#XFLD: Account field label\r\nview.Appointment.account=\\u9867\\u5BA2\r\n\r\n#XFLD: Contact field label\r\nview.Appointment.contact=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\r\n\r\n#XFLD: Employee Responsible field label\r\nview.Appointment.employeeResponsible=\\u7BA1\\u7406\\u8CAC\\u4EFB\\u8005\r\n\r\n#XFLD: Time field label\r\nview.Appointment.time=\\u6642\\u9593\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.subject=\\u30BF\\u30A4\\u30C8\\u30EB\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.title=\\u30BF\\u30A4\\u30C8\\u30EB\r\n\r\n#XFLD: Label for Start date and time\r\nview.Appointment.startdatetime=\\u958B\\u59CB\\u65E5\\u4ED8/\\u6642\\u523B\r\n\r\n#XFLD: Label for End date and time\r\nview.Appointment.enddatetime=\\u7D42\\u4E86\\u65E5\\u4ED8/\\u6642\\u523B\r\n\r\n#XFLD: Label for All day checkbox\r\nview.Appointment.alldayevent=\\u7D42\\u65E5\r\n\r\n#YMSG: info message in case appointment occurs in the past\r\nview.Appointment.occurspast=\\u4E88\\u5B9A\\u306E\\u767A\\u751F\\u304C\\u904E\\u53BB\\u306B\\u306A\\u3063\\u3066\\u3044\\u307E\\u3059\r\n\r\n#YMSG: info message in case no title entered\r\nview.Appointment.notitle=\\u30BF\\u30A4\\u30C8\\u30EB\\u3092\\u5165\\u529B\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\r\n\r\n#XFLD: Label for Private checkbox\r\nview.Appointment.private=\\u975E\\u516C\\u958B\r\n\r\n#XFLD: Location field label\r\nview.Appointment.location=\\u30ED\\u30B1\\u30FC\\u30B7\\u30E7\\u30F3\r\n\r\n#XFLD: Importance field label\r\nview.Appointment.importance=\\u91CD\\u8981\\u6027\r\n\r\n#XFLD: Active Status field label\r\nview.Appointment.activeStatus=\\u30B9\\u30C6\\u30FC\\u30BF\\u30B9\r\n\r\n#XFLD: Notes field label\r\nview.Appointment.notes=\\u30E1\\u30E2\r\n\r\n#XFLD: Note field label\r\nview.Appointment.note=\\u30E1\\u30E2\r\n\r\n#XFLD: Label for internal attendees\r\nview.Appointment.internal=\\u5185\\u90E8\r\n\r\n#XFLD: Label for external attendees\r\nview.Appointment.external=\\u5916\\u90E8\r\n\r\n#XGRP: Group header of the section for showing the general data\r\nview.Appointment.generalData=\\u4E00\\u822C\\u30C7\\u30FC\\u30BF\r\n\r\n#XGRP: Group header of the section for showing the contact data\r\nview.Appointment.contactData=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\r\n\r\n#XGRP: Group header of the section for showing the attendees\r\nview.Appointment.attendeeData=\\u53C2\\u52A0\\u8005\r\n\r\n#XGRP: Group header attendees with number\r\nview.Appointment.attendeeDataNumber=\\u53C2\\u52A0\\u8005 ({0})\r\n\r\n#XGRP: Group header additional attendees with number\r\nview.Appointment.additionalAttendeeNumber=\\u8FFD\\u52A0\\u53C2\\u52A0\\u8005 ({0})\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.detailData=\\u8A73\\u7D30\r\n\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.appointmentDetail=\\u4E88\\u5B9A\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Opportunity=\\u6848\\u4EF6\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Task=\\u30BF\\u30B9\\u30AF\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.attachmentData=\\u6DFB\\u4ED8\\u6587\\u66F8\r\n\r\n#XGRP: Group header attachments with number how many\r\nview.Appointment.attachmentDataNumber=\\u6DFB\\u4ED8\\u6587\\u66F8 ({0})\r\n\r\n#XGRP: Group header attachments with request to save the appointment before file upload \r\nview.Appointment.attachmentSaveRequest=\\u6DFB\\u4ED8\\u6587\\u66F8 (\\u6DFB\\u4ED8\\u6587\\u66F8\\u3092\\u4FDD\\u5B58\\u3057\\u3066\\u304B\\u3089\\u30A2\\u30C3\\u30D7\\u30ED\\u30FC\\u30C9)\r\n\r\n#XBUT: Button text to Delete\r\nview.Appointment.delete=\\u524A\\u9664\r\n\r\n#XBUT: Button text to Follow up\r\nview.Appointment.followup=\\u30D5\\u30A9\\u30ED\\u30FC\\u30A2\\u30C3\\u30D7\r\n\r\n#YMSG: no transaction types  present\r\nview.Appointment.FOLLOWUPERROR=\\u30C8\\u30E9\\u30F3\\u30B6\\u30AF\\u30B7\\u30E7\\u30F3\\u30BF\\u30A4\\u30D7\\u304C\\u898B\\u3064\\u304B\\u308A\\u307E\\u305B\\u3093\\u3002\\u30D0\\u30C3\\u30AF\\u30A8\\u30F3\\u30C9\\u30AB\\u30B9\\u30BF\\u30DE\\u30A4\\u30B8\\u30F3\\u30B0\\u3092\\u30C1\\u30A7\\u30C3\\u30AF\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.deletesuccess=\\u4E88\\u5B9A\\u304C\\u524A\\u9664\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n#YMSG: successful followup message in message toast\r\nview.Appointment.followupsuccessful=\\u30D5\\u30A9\\u30ED\\u30FC\\u30A2\\u30C3\\u30D7\\u4E88\\u5B9A\\u304C\\u4FDD\\u5B58\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n#XBUT: Button text to Edit\r\nview.Appointment.edit=\\u7DE8\\u96C6\r\n\r\n#XBUT: Button text to Done\r\nview.Appointment.done=\\u5B8C\\u4E86\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.cancel=\\u4E2D\\u6B62\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.ok=OK\r\n\r\n#XBUT: Button text to Create\r\nview.Appointment.create=\\u767B\\u9332\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.savesuccess=\\u4E88\\u5B9A\\u304C\\u4FDD\\u5B58\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n#XBUT: Button text to SAve\r\nview.Appointment.save=\\u4FDD\\u5B58\r\n\r\n#XBUT: Button text for Day\r\nview.Appointment.day=\\u65E5\r\n\r\n#XBUT: Button text for week\r\nview.Appointment.week=\\u9031\r\n\r\n#XBUT: Button text for month\r\nview.Appointment.month=\\u6708\r\n\r\n#XFLD: loading text for the appointment list\r\nview.Appointment.loaddatatext=\\u30ED\\u30FC\\u30C9\\u4E2D...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.acsea_title=\\u9867\\u5BA2 ({0})\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.acsea_nodata=\\u9867\\u5BA2\\u304C\\u898B\\u3064\\u304B\\u308A\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n\r\n#XFLD: placeholdertext for search fields\r\nview.Appointment.searchfieldplaceholder=\\u691C\\u7D22\r\n\r\n#XFLD: placeholdertext for search busy text\r\nview.Appointment.searchlistinfo=\\u691C\\u7D22\\u3057\\u3066\\u3044\\u307E\\u3059...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.consea_title=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005 ({0})\r\n\r\n#XTIT: title of the business card for accounts\r\nview.Appointment.account_title=\\u9867\\u5BA2\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.employee_title=\\u5F93\\u696D\\u54E1\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.contact_title=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.consea_nodata=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\\u304C\\u898B\\u3064\\u304B\\u308A\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.empsea_nodata=\\u5F93\\u696D\\u54E1\\u304C\\u898B\\u3064\\u304B\\u308A\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n\r\n#XTIT: title of internal attendees search popup\r\nview.Appointment.internal_title=\\u5185\\u90E8\\u53C2\\u52A0\\u8005 ({0})\r\n\r\n#XTIT: title of external attendees search popup\r\nview.Appointment.external_title=\\u5916\\u90E8\\u53C2\\u52A0\\u8005 ({0})\r\n\r\n#XTIT: title of internal attendees search popup enhanced with total count\r\nview.Appointment.internal_titlenew=\\u65B0\\u898F\\u5185\\u90E8\\u53C2\\u52A0\\u8005 ({0})\r\n\r\n#XTIT: title of external attendees search popup enhanced with total count\r\nview.Appointment.external_titlenew=\\u65B0\\u898F\\u5916\\u90E8\\u53C2\\u52A0\\u8005 ({0})\r\n\r\n#YMSG: Filtered by info bar text for contact search popup\r\nview.Appointment.filteredby=\\u30D5\\u30A3\\u30EB\\u30BF\\u57FA\\u6E96\r\n\r\n#YMSG: filter line for cross navigation: Filter by Account \r\nview.Appointment.filteraccount=\\u9867\\u5BA2\\u306B\\u3088\\u308B\\u30D5\\u30A3\\u30EB\\u30BF\r\n\r\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\r\nview.Appointment.duration.min={0} \\u5206\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\r\nview.Appointment.duration.hour={0} \\u6642\\u9593\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.day={0} \\u65E5\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.days={0} \\u65E5\r\n\r\n#XTIT: Button text to Delete \r\nview.Appointment.deleteTitle=\\u524A\\u9664\r\n\r\n#YINS: Text for Pop Up action.  User to react (Yes/No) \r\nview.Appointment.deleteInstruction=\\u3053\\u306E\\u4E88\\u5B9A\\u3092\\u524A\\u9664\\u3057\\u307E\\u3059\\u304B\\u3002\r\n\r\n#XBUT: User to react (positive) to delete action \r\nview.Appointment.deleteYes=OK\r\n\r\n#XFLD: placeholder text for fiels adding external attendees\r\nview.Appointment.attexternaladd=\\u5916\\u90E8\\u53C2\\u52A0\\u8005\\u8FFD\\u52A0\r\n\r\n#XFLD: placeholder text for fiels adding internal attendees\r\nview.Appointment.attinternaladd=\\u540C\\u50DA\\u8FFD\\u52A0\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.fromTimeDate=\\u958B\\u59CB {0} {1}\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.toTimeDate=\\u7D42\\u4E86 {0} {1}\r\n\r\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\r\nview.Appointment.timeToTime={0} - {1}\r\n\r\n#XFLD: empty appointment list text \r\nview.Appointment.appointment_nodata=\\u4E88\\u5B9A\\u306A\\u3057\r\n\r\n#XFLD: employee fullname: {0} firstname {1} lastname\r\nview.Appointment.employeename={0} {1}\r\n\r\n#XTIT: Title for Edit Appointment page\r\nview.Appointment.editappointment=\\u4E88\\u5B9A\\u306E\\u7DE8\\u96C6\r\n\r\n#YMSG: Error when end time is before start time (on same day)\r\nview.Appointment.wrongTimes=\\u7D42\\u4E86\\u6642\\u523B\\u304C\\u958B\\u59CB\\u6642\\u523B\\u3088\\u308A\\u3082\\u524D\\u306B\\u306A\\u3063\\u3066\\u3044\\u307E\\u3059\r\n\r\n#YMSG: Error when end date is before start date\r\nview.Appointment.wrongDates=\\u7D42\\u4E86\\u65E5\\u4ED8\\u304C\\u958B\\u59CB\\u65E5\\u4ED8\\u3088\\u308A\\u3082\\u524D\\u306B\\u306A\\u3063\\u3066\\u3044\\u307E\\u3059\r\n\r\n#XBUT: Button text for Add Button\r\nview.Appointment.add=\\u8FFD\\u52A0\r\n\r\n#XTIT: Shell Title of App\r\nview.Appointment.shelltitle=\\u4E88\\u5B9A\r\n\r\n#XFLD: empty list text for external attendee popup\r\nview.Appointment.noextattendees=\\u5916\\u90E8\\u53C2\\u52A0\\u8005\\u306A\\u3057\r\n\r\n#XFLD: empty list text for internal attendee popup\r\nview.Appointment.nointattendees=\\u5185\\u90E8\\u53C2\\u52A0\\u8005\\u306A\\u3057\r\n\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=\\u30E6\\u30FC\\u30B6\\u306E\\u4E88\\u5B9A\\u306E\\u307F\\u304C\\u8868\\u793A\\u3055\\u308C\\u307E\\u3059\r\n\r\n#YMSG: info message in case edit page is left with back and data changed\r\nview.Appointment.leaveeditmessage=\\u3053\\u306E\\u30DA\\u30FC\\u30B8\\u3092\\u7D42\\u4E86\\u3059\\u308B\\u3068\\u30A8\\u30F3\\u30C8\\u30EA\\u304C\\u5931\\u308F\\u308C\\u307E\\u3059\\u3002\\u7D9A\\u884C\\u3057\\u307E\\u3059\\u304B\\u3002\r\n\r\n#YMSG: info message in case of wrong format of Start Date\r\nview.Appointment.validStartDate=\\u6709\\u52B9\\u306A\\u958B\\u59CB\\u65E5\\u4ED8\\u3092\\u5165\\u529B\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\r\n\r\n#YMSG: info message in case of wrong format of End Date\r\nview.Appointment.validEndDate=\\u6709\\u52B9\\u306A\\u7D42\\u4E86\\u65E5\\u4ED8\\u3092\\u5165\\u529B\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\r\n\r\n#YMSG: info message in case of wrong format of Start Date and End Date\r\nview.Appointment.validStartEndDate=\\u6709\\u52B9\\u306A\\u958B\\u59CB\\u65E5\\u4ED8\\u3068\\u7D42\\u4E86\\u65E5\\u4ED8\\u3092\\u5165\\u529B\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\r\n\r\n#XTIT: Title for Process type dialog\r\nview.Appointment.process_type=\\u30C8\\u30E9\\u30F3\\u30B6\\u30AF\\u30B7\\u30E7\\u30F3\\u30BF\\u30A4\\u30D7\\u9078\\u629E\r\n\r\n#XFLD: No Data text when loading/searching list\r\nview.Appointment.no_data_text=\\u73FE\\u5728\\u5229\\u7528\\u3067\\u304D\\u308B\\u30A2\\u30A4\\u30C6\\u30E0\\u306F\\u3042\\u308A\\u307E\\u305B\\u3093\r\n\r\n#XFLD: Transaction Type\r\nview.Appointment.TransactionType=\\u30BF\\u30A4\\u30D7\r\n\r\n#YMSG : PRIVATE appointment message\r\nview.Appointment.privateMessage=\\u3053\\u308C\\u306F\\u975E\\u516C\\u958B\\u306E\\u4E88\\u5B9A\\u3067\\u3059\r\n\r\n#XFLD: Title for private appointment in shared calendar\r\nview.Appointment.privateAppointment=\\u975E\\u516C\\u958B\\u306E\\u4E88\\u5B9A\r\n#XTIT: this is the title for the Transaction History Tab\r\nTRANS_HISTORY=\\u30C8\\u30E9\\u30F3\\u30B6\\u30AF\\u30B7\\u30E7\\u30F3\\u5C65\\u6B74\r\n\r\n#XFLD, 30: Field Transaction ID on List\r\nTRANS_ID=\\u30C8\\u30E9\\u30F3\\u30B6\\u30AF\\u30B7\\u30E7\\u30F3 ID\r\n\r\n#XFLD, 30: Field Transaction Type on List\r\nTRANS_TYPE=\\u30C8\\u30E9\\u30F3\\u30B6\\u30AF\\u30B7\\u30E7\\u30F3\\u30BF\\u30A4\\u30D7\r\n\r\n#XFLD, 30: Field Description on List\r\nTRANS_DESC=\\u30C6\\u30AD\\u30B9\\u30C8\r\n\r\n#XFLD, 30: Field Created On on List\r\nCREATED_ON=\\u767B\\u9332\\u65E5\\u4ED8\r\n\r\n#XFLD, 30: Field Created On on List\r\nRELATIONSHIP=\\u30EA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\\u30BF\\u30A4\\u30D7\r\n\r\n#XFLD, 15: Priority label\r\nview.Appointment.priority=\\u512A\\u5148\\u5EA6\r\n\r\n#YMSG, 50:Customizing incomplete\r\nCUSTOMIZING_INCOMPLETE=\\u30AB\\u30B9\\u30BF\\u30DE\\u30A4\\u30B8\\u30F3\\u30B0\\u304C\\u4E0D\\u5B8C\\u5168\\u3067\\u3059\\u3002\\u30B7\\u30B9\\u30C6\\u30E0\\u7BA1\\u7406\\u8005\\u306B\\u9023\\u7D61\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\r\n\r\n#XBUT: Button text to Messages\r\nview.Appointment.messages=\\u30E1\\u30C3\\u30BB\\u30FC\\u30B8\r\n\r\n#XGRP: Error message dialog title\r\nview.Appointment.errorMessage=\\u30E1\\u30C3\\u30BB\\u30FC\\u30B8 ({0})\r\n\r\n#YMSG: contact not assigned to this account\r\n',
	"cus/crm/mycalendar/i18n/i18n_no.properties":'\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n\r\n#XTIT: Title of App\r\nview.Appointment.apptitle=Avtaler\r\n\r\n#XTIT: Title of New Appointment screen\r\nview.Appointment.newapptitle=Ny avtale\r\n\r\n#XFLD: tooltip  for create new appointment button\r\nview.Appointment.newapptm_tt=Ny avtale\r\n\r\n#XTIT: Title of shared calendars\r\nview.Appointment.sharedCalendars=Delte kalendere\r\n\r\n#XBUT: Button text of my calendar\r\nview.Appointment.mycalendar=Min kalender\r\n\r\n#XTIT: Title of infotoolbar \r\nview.Appointment.myTeam=Mine teammedlemmer\r\n\r\n#XTIT: Appointment list description with location,account text and contact text\r\nview.Appointment.furtherDetails={0} | {1} ({2})\r\n\r\n#XTIT: Appointment list description with account text and contact text\r\nview.Appointment.furtherDetailsWithoutLoc={0} ({1})\r\n\r\n#XTIT: Appointment list description with loc  and account text\r\nview.Appointment.furtherDetailsWithoutContact={0} | {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Data er endret av en annen bruker. Velg OK for \\u00E5 hente siste data.\r\n#XTIT: Appointment list description without loc and cantact text\r\nview.Appointment.furtherDetailsWithoutContactAndLoc={0}\r\n\r\n#XTIT: Title of Timeline\r\nview.Appointment.Timeline=Tidslinje\r\n\r\n#XTIT: Title of Calendars\r\nview.Appointment.Calendars=Kalendre\r\n\r\n#XFLD: tooltip for today button\r\nview.Appointment.today_tt=I dag\r\n\r\n#XTIT: Header text of Appointment detail\r\nview.Appointment.detail=Avtaledetaljer\r\n\r\n#XFLD: Account field label\r\nview.Appointment.account=Kunde\r\n\r\n#XFLD: Contact field label\r\nview.Appointment.contact=Kontakt\r\n\r\n#XFLD: Employee Responsible field label\r\nview.Appointment.employeeResponsible=Ansvarlig medarbeider\r\n\r\n#XFLD: Time field label\r\nview.Appointment.time=Tid\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.subject=Tittel\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.title=Tittel\r\n\r\n#XFLD: Label for Start date and time\r\nview.Appointment.startdatetime=Startdato og -klokkeslett\r\n\r\n#XFLD: Label for End date and time\r\nview.Appointment.enddatetime=Sluttdato og -klokkeslett\r\n\r\n#XFLD: Label for All day checkbox\r\nview.Appointment.alldayevent=Hele dagen\r\n\r\n#YMSG: info message in case appointment occurs in the past\r\nview.Appointment.occurspast=Avtalen finner sted i fortiden\r\n\r\n#YMSG: info message in case no title entered\r\nview.Appointment.notitle=Oppgi en tittel\r\n\r\n#XFLD: Label for Private checkbox\r\nview.Appointment.private=Privat\r\n\r\n#XFLD: Location field label\r\nview.Appointment.location=Sted\r\n\r\n#XFLD: Importance field label\r\nview.Appointment.importance=Viktighet\r\n\r\n#XFLD: Active Status field label\r\nview.Appointment.activeStatus=Status\r\n\r\n#XFLD: Notes field label\r\nview.Appointment.notes=Merknader\r\n\r\n#XFLD: Note field label\r\nview.Appointment.note=Merknader\r\n\r\n#XFLD: Label for internal attendees\r\nview.Appointment.internal=Intern\r\n\r\n#XFLD: Label for external attendees\r\nview.Appointment.external=Ekstern\r\n\r\n#XGRP: Group header of the section for showing the general data\r\nview.Appointment.generalData=Generelle data\r\n\r\n#XGRP: Group header of the section for showing the contact data\r\nview.Appointment.contactData=Kontakt\r\n\r\n#XGRP: Group header of the section for showing the attendees\r\nview.Appointment.attendeeData=Deltakere\r\n\r\n#XGRP: Group header attendees with number\r\nview.Appointment.attendeeDataNumber=Deltakere ({0})\r\n\r\n#XGRP: Group header additional attendees with number\r\nview.Appointment.additionalAttendeeNumber=Andre deltakere ({0})\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.detailData=Detaljer\r\n\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.appointmentDetail=Avtale\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Opportunity=Salgsmulighet\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Task=Oppgave\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.attachmentData=Vedlegg\r\n\r\n#XGRP: Group header attachments with number how many\r\nview.Appointment.attachmentDataNumber=Vedlegg ({0})\r\n\r\n#XGRP: Group header attachments with request to save the appointment before file upload \r\nview.Appointment.attachmentSaveRequest=Vedlegg (lagre f\\u00F8r opplasting)\r\n\r\n#XBUT: Button text to Delete\r\nview.Appointment.delete=Slett\r\n\r\n#XBUT: Button text to Follow up\r\nview.Appointment.followup=Oppf\\u00F8lgingsaktivitet\r\n\r\n#YMSG: no transaction types  present\r\nview.Appointment.FOLLOWUPERROR=Finner ikke transaksjonstyper. Kontroller backendsystemtilpasning.\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.deletesuccess=Avtale slettet\r\n\r\n#YMSG: successful followup message in message toast\r\nview.Appointment.followupsuccessful=Oppf\\u00F8lgingsavtale er lagret\r\n\r\n#XBUT: Button text to Edit\r\nview.Appointment.edit=Rediger\r\n\r\n#XBUT: Button text to Done\r\nview.Appointment.done=Utf\\u00F8rt\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.cancel=Avbryt\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.ok=OK\r\n\r\n#XBUT: Button text to Create\r\nview.Appointment.create=Opprett\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.savesuccess=Avtale lagret\r\n\r\n#XBUT: Button text to SAve\r\nview.Appointment.save=Lagre\r\n\r\n#XBUT: Button text for Day\r\nview.Appointment.day=Dag\r\n\r\n#XBUT: Button text for week\r\nview.Appointment.week=Uke\r\n\r\n#XBUT: Button text for month\r\nview.Appointment.month=M\\u00E5ned\r\n\r\n#XFLD: loading text for the appointment list\r\nview.Appointment.loaddatatext=Laster ...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.acsea_title=Kunder ({0})\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.acsea_nodata=Finner ingen kunder\r\n\r\n#XFLD: placeholdertext for search fields\r\nview.Appointment.searchfieldplaceholder=S\\u00F8k\r\n\r\n#XFLD: placeholdertext for search busy text\r\nview.Appointment.searchlistinfo=S\\u00F8ker...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.consea_title=Kontakter ({0})\r\n\r\n#XTIT: title of the business card for accounts\r\nview.Appointment.account_title=Kunde\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.employee_title=Medarbeider\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.contact_title=Kontakt\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.consea_nodata=Finner ingen kontakter\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.empsea_nodata=Finner ingen medarbeidere\r\n\r\n#XTIT: title of internal attendees search popup\r\nview.Appointment.internal_title=Interne deltakere ({0})\r\n\r\n#XTIT: title of external attendees search popup\r\nview.Appointment.external_title=Eksterne deltakere ({0})\r\n\r\n#XTIT: title of internal attendees search popup enhanced with total count\r\nview.Appointment.internal_titlenew=Nye interne deltakere ({0})\r\n\r\n#XTIT: title of external attendees search popup enhanced with total count\r\nview.Appointment.external_titlenew=Nye eksterne deltakere ({0})\r\n\r\n#YMSG: Filtered by info bar text for contact search popup\r\nview.Appointment.filteredby=Filtrert etter\r\n\r\n#YMSG: filter line for cross navigation: Filter by Account \r\nview.Appointment.filteraccount=Filtrert etter kunde\r\n\r\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\r\nview.Appointment.duration.min={0} min\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\r\nview.Appointment.duration.hour={0} t\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.day={0} dag\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.days={0} dager\r\n\r\n#XTIT: Button text to Delete \r\nview.Appointment.deleteTitle=Slett\r\n\r\n#YINS: Text for Pop Up action.  User to react (Yes/No) \r\nview.Appointment.deleteInstruction=Vil du slette denne avtalen?\r\n\r\n#XBUT: User to react (positive) to delete action \r\nview.Appointment.deleteYes=OK\r\n\r\n#XFLD: placeholder text for fiels adding external attendees\r\nview.Appointment.attexternaladd=Tilf\\u00F8y ekstern deltaker\r\n\r\n#XFLD: placeholder text for fiels adding internal attendees\r\nview.Appointment.attinternaladd=Tilf\\u00F8y en kollega\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.fromTimeDate=Fra {0} {1}\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.toTimeDate=Til {0} {1}\r\n\r\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\r\nview.Appointment.timeToTime={0} til {1}\r\n\r\n#XFLD: empty appointment list text \r\nview.Appointment.appointment_nodata=Ingen avtaler\r\n\r\n#XFLD: employee fullname: {0} firstname {1} lastname\r\nview.Appointment.employeename={0} {1}\r\n\r\n#XTIT: Title for Edit Appointment page\r\nview.Appointment.editappointment=Rediger avtale\r\n\r\n#YMSG: Error when end time is before start time (on same day)\r\nview.Appointment.wrongTimes=Sluttidspunkt kommer f\\u00F8r starttidspunkt\r\n\r\n#YMSG: Error when end date is before start date\r\nview.Appointment.wrongDates=Sluttdato kommer f\\u00F8r startdato\r\n\r\n#XBUT: Button text for Add Button\r\nview.Appointment.add=Tilf\\u00F8y\r\n\r\n#XTIT: Shell Title of App\r\nview.Appointment.shelltitle=Mine avtaler\r\n\r\n#XFLD: empty list text for external attendee popup\r\nview.Appointment.noextattendees=Ingen eksterne deltakere\r\n\r\n#XFLD: empty list text for internal attendee popup\r\nview.Appointment.nointattendees=Ingen interne deltakere\r\n\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Bare dine avtaler vises\r\n\r\n#YMSG: info message in case edit page is left with back and data changed\r\nview.Appointment.leaveeditmessage=Du vil miste inndataene dine hvis du forlater denne siden. Vil du fortsette?\r\n\r\n#YMSG: info message in case of wrong format of Start Date\r\nview.Appointment.validStartDate=Oppgi en gyldig startdato\r\n\r\n#YMSG: info message in case of wrong format of End Date\r\nview.Appointment.validEndDate=Oppgi en gyldig sluttdato\r\n\r\n#YMSG: info message in case of wrong format of Start Date and End Date\r\nview.Appointment.validStartEndDate=Oppgi gyldig start- og sluttdato\r\n\r\n#XTIT: Title for Process type dialog\r\nview.Appointment.process_type=Velg transaksjonstype\r\n\r\n#XFLD: No Data text when loading/searching list\r\nview.Appointment.no_data_text=Ingen elementer er for \\u00F8yeblikket tilgjengelige\r\n\r\n#XFLD: Transaction Type\r\nview.Appointment.TransactionType=Type\r\n\r\n#YMSG : PRIVATE appointment message\r\nview.Appointment.privateMessage=Dette er en privat avtale\r\n\r\n#XFLD: Title for private appointment in shared calendar\r\nview.Appointment.privateAppointment=Privat avtale\r\n#XTIT: this is the title for the Transaction History Tab\r\nTRANS_HISTORY=Transaksjonshistorikk\r\n\r\n#XFLD, 30: Field Transaction ID on List\r\nTRANS_ID=Transaksjons-ID\r\n\r\n#XFLD, 30: Field Transaction Type on List\r\nTRANS_TYPE=Transaksjonstype\r\n\r\n#XFLD, 30: Field Description on List\r\nTRANS_DESC=Beskrivelse\r\n\r\n#XFLD, 30: Field Created On on List\r\nCREATED_ON=Opprettet den\r\n\r\n#XFLD, 30: Field Created On on List\r\nRELATIONSHIP=Relasjonstype\r\n\r\n#XFLD, 15: Priority label\r\nview.Appointment.priority=Prioritet\r\n\r\n#YMSG, 50:Customizing incomplete\r\nCUSTOMIZING_INCOMPLETE=Ufullstendig systemtilpasning. Kontakt systemansvarlig.\r\n\r\n#XBUT: Button text to Messages\r\nview.Appointment.messages=Meldinger\r\n\r\n#XGRP: Error message dialog title\r\nview.Appointment.errorMessage=Meldinger ({0})\r\n\r\n#YMSG: contact not assigned to this account\r\n',
	"cus/crm/mycalendar/i18n/i18n_pl.properties":'\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n\r\n#XTIT: Title of App\r\nview.Appointment.apptitle=Spotkania\r\n\r\n#XTIT: Title of New Appointment screen\r\nview.Appointment.newapptitle=Nowe spotkanie\r\n\r\n#XFLD: tooltip  for create new appointment button\r\nview.Appointment.newapptm_tt=Nowe spotkanie\r\n\r\n#XTIT: Title of shared calendars\r\nview.Appointment.sharedCalendars=Udost\\u0119pnione kalendarze\r\n\r\n#XBUT: Button text of my calendar\r\nview.Appointment.mycalendar=M\\u00F3j kalendarz\r\n\r\n#XTIT: Title of infotoolbar \r\nview.Appointment.myTeam=Moi cz\\u0142onkowie zespo\\u0142u\r\n\r\n#XTIT: Appointment list description with location,account text and contact text\r\nview.Appointment.furtherDetails={0} | {1} ({2})\r\n\r\n#XTIT: Appointment list description with account text and contact text\r\nview.Appointment.furtherDetailsWithoutLoc={0} ({1})\r\n\r\n#XTIT: Appointment list description with loc  and account text\r\nview.Appointment.furtherDetailsWithoutContact={0} | {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Dane zosta\\u0142y zmienione przez innego u\\u017Cytkownika. Wybierz OK, aby pobra\\u0107 najnowsze dane.\r\n#XTIT: Appointment list description without loc and cantact text\r\nview.Appointment.furtherDetailsWithoutContactAndLoc={0}\r\n\r\n#XTIT: Title of Timeline\r\nview.Appointment.Timeline=Harmonogram\r\n\r\n#XTIT: Title of Calendars\r\nview.Appointment.Calendars=Kalendarze\r\n\r\n#XFLD: tooltip for today button\r\nview.Appointment.today_tt=Dzisiaj\r\n\r\n#XTIT: Header text of Appointment detail\r\nview.Appointment.detail=Szczeg\\u00F3\\u0142y spotkania\r\n\r\n#XFLD: Account field label\r\nview.Appointment.account=Klient\r\n\r\n#XFLD: Contact field label\r\nview.Appointment.contact=Kontakt\r\n\r\n#XFLD: Employee Responsible field label\r\nview.Appointment.employeeResponsible=Odpowiedzialny pracownik\r\n\r\n#XFLD: Time field label\r\nview.Appointment.time=Czas\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.subject=Tytu\\u0142\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.title=Tytu\\u0142\r\n\r\n#XFLD: Label for Start date and time\r\nview.Appointment.startdatetime=Data i godzina rozpocz\\u0119cia\r\n\r\n#XFLD: Label for End date and time\r\nview.Appointment.enddatetime=Data i godzina zako\\u0144czenia\r\n\r\n#XFLD: Label for All day checkbox\r\nview.Appointment.alldayevent=Ca\\u0142y dzie\\u0144\r\n\r\n#YMSG: info message in case appointment occurs in the past\r\nview.Appointment.occurspast=Spotkanie wypada w przesz\\u0142o\\u015Bci\r\n\r\n#YMSG: info message in case no title entered\r\nview.Appointment.notitle=Wpisz tytu\\u0142\r\n\r\n#XFLD: Label for Private checkbox\r\nview.Appointment.private=Prywatne\r\n\r\n#XFLD: Location field label\r\nview.Appointment.location=Lokalizacja\r\n\r\n#XFLD: Importance field label\r\nview.Appointment.importance=Wa\\u017Cno\\u015B\\u0107\r\n\r\n#XFLD: Active Status field label\r\nview.Appointment.activeStatus=Status\r\n\r\n#XFLD: Notes field label\r\nview.Appointment.notes=Notatki\r\n\r\n#XFLD: Note field label\r\nview.Appointment.note=Notatki\r\n\r\n#XFLD: Label for internal attendees\r\nview.Appointment.internal=Wewn\\u0119trzne\r\n\r\n#XFLD: Label for external attendees\r\nview.Appointment.external=Zewn\\u0119trzne\r\n\r\n#XGRP: Group header of the section for showing the general data\r\nview.Appointment.generalData=Dane og\\u00F3lne\r\n\r\n#XGRP: Group header of the section for showing the contact data\r\nview.Appointment.contactData=Kontakt\r\n\r\n#XGRP: Group header of the section for showing the attendees\r\nview.Appointment.attendeeData=Uczestnicy\r\n\r\n#XGRP: Group header attendees with number\r\nview.Appointment.attendeeDataNumber=Uczestnicy ({0})\r\n\r\n#XGRP: Group header additional attendees with number\r\nview.Appointment.additionalAttendeeNumber=Dodatkowi uczestnicy ({0})\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.detailData=Szczeg\\u00F3\\u0142y\r\n\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.appointmentDetail=Spotkanie\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Opportunity=Szansa\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Task=Zadanie\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.attachmentData=Za\\u0142\\u0105czniki\r\n\r\n#XGRP: Group header attachments with number how many\r\nview.Appointment.attachmentDataNumber=Za\\u0142\\u0105czniki ({0})\r\n\r\n#XGRP: Group header attachments with request to save the appointment before file upload \r\nview.Appointment.attachmentSaveRequest=Za\\u0142\\u0105czniki (zapisz przed wczytaniem)\r\n\r\n#XBUT: Button text to Delete\r\nview.Appointment.delete=Usu\\u0144\r\n\r\n#XBUT: Button text to Follow up\r\nview.Appointment.followup=Kolejne dzia\\u0142anie\r\n\r\n#YMSG: no transaction types  present\r\nview.Appointment.FOLLOWUPERROR=Nie znaleziono rodzaj\\u00F3w operacji. Sprawd\\u017A konfiguracj\\u0119 backend.\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.deletesuccess=Spotkanie usuni\\u0119te\r\n\r\n#YMSG: successful followup message in message toast\r\nview.Appointment.followupsuccessful=Zapisano kolejne spotkanie\r\n\r\n#XBUT: Button text to Edit\r\nview.Appointment.edit=Edytuj\r\n\r\n#XBUT: Button text to Done\r\nview.Appointment.done=Gotowe\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.cancel=Anuluj\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.ok=OK\r\n\r\n#XBUT: Button text to Create\r\nview.Appointment.create=Utw\\u00F3rz\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.savesuccess=Zapisano spotkanie\r\n\r\n#XBUT: Button text to SAve\r\nview.Appointment.save=Zapisz\r\n\r\n#XBUT: Button text for Day\r\nview.Appointment.day=Dzie\\u0144\r\n\r\n#XBUT: Button text for week\r\nview.Appointment.week=Tydzie\\u0144\r\n\r\n#XBUT: Button text for month\r\nview.Appointment.month=Miesi\\u0105c\r\n\r\n#XFLD: loading text for the appointment list\r\nview.Appointment.loaddatatext=Wczytywanie...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.acsea_title=Klienci ({0})\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.acsea_nodata=Brak klient\\u00F3w\r\n\r\n#XFLD: placeholdertext for search fields\r\nview.Appointment.searchfieldplaceholder=Szukaj\r\n\r\n#XFLD: placeholdertext for search busy text\r\nview.Appointment.searchlistinfo=Wyszukiwanie...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.consea_title=Kontakty ({0})\r\n\r\n#XTIT: title of the business card for accounts\r\nview.Appointment.account_title=Klient\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.employee_title=Pracownik\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.contact_title=Kontakt\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.consea_nodata=Brak kontakt\\u00F3w\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.empsea_nodata=Brak pracownik\\u00F3w\r\n\r\n#XTIT: title of internal attendees search popup\r\nview.Appointment.internal_title=Uczestnicy wewn\\u0119trzni ({0})\r\n\r\n#XTIT: title of external attendees search popup\r\nview.Appointment.external_title=Uczestnicy zewn\\u0119trzni ({0})\r\n\r\n#XTIT: title of internal attendees search popup enhanced with total count\r\nview.Appointment.internal_titlenew=Nowi uczestnicy wewn\\u0119trzni ({0})\r\n\r\n#XTIT: title of external attendees search popup enhanced with total count\r\nview.Appointment.external_titlenew=Nowi uczestnicy zewn\\u0119trzni ({0})\r\n\r\n#YMSG: Filtered by info bar text for contact search popup\r\nview.Appointment.filteredby=Filtrowanie wed\\u0142ug\r\n\r\n#YMSG: filter line for cross navigation: Filter by Account \r\nview.Appointment.filteraccount=Filtrowane wed\\u0142ug klienta\r\n\r\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\r\nview.Appointment.duration.min={0} min\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\r\nview.Appointment.duration.hour={0} godz.\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.day={0} dzie\\u0144\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.days={0} dni\r\n\r\n#XTIT: Button text to Delete \r\nview.Appointment.deleteTitle=Usu\\u0144\r\n\r\n#YINS: Text for Pop Up action.  User to react (Yes/No) \r\nview.Appointment.deleteInstruction=Usun\\u0105\\u0107 to spotkanie?\r\n\r\n#XBUT: User to react (positive) to delete action \r\nview.Appointment.deleteYes=OK\r\n\r\n#XFLD: placeholder text for fiels adding external attendees\r\nview.Appointment.attexternaladd=Dodaj zewn\\u0119trznego uczestnika\r\n\r\n#XFLD: placeholder text for fiels adding internal attendees\r\nview.Appointment.attinternaladd=Dodaj wsp\\u00F3\\u0142pracownika\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.fromTimeDate=Od {0} {1}\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.toTimeDate=Do {0} {1}\r\n\r\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\r\nview.Appointment.timeToTime={0} do {1}\r\n\r\n#XFLD: empty appointment list text \r\nview.Appointment.appointment_nodata=Brak spotka\\u0144\r\n\r\n#XFLD: employee fullname: {0} firstname {1} lastname\r\nview.Appointment.employeename={0} {1}\r\n\r\n#XTIT: Title for Edit Appointment page\r\nview.Appointment.editappointment=Edytuj spotkanie\r\n\r\n#YMSG: Error when end time is before start time (on same day)\r\nview.Appointment.wrongTimes=Czas zako\\u0144czenia wypada przed czasem rozpocz\\u0119cia\r\n\r\n#YMSG: Error when end date is before start date\r\nview.Appointment.wrongDates=Data zako\\u0144czenia wypada przed dat\\u0105 rozpocz\\u0119cia\r\n\r\n#XBUT: Button text for Add Button\r\nview.Appointment.add=Dodaj\r\n\r\n#XTIT: Shell Title of App\r\nview.Appointment.shelltitle=Moje spotkania\r\n\r\n#XFLD: empty list text for external attendee popup\r\nview.Appointment.noextattendees=Brak zewn\\u0119trznych uczestnik\\u00F3w\r\n\r\n#XFLD: empty list text for internal attendee popup\r\nview.Appointment.nointattendees=Brak wewn\\u0119trznych uczestnik\\u00F3w\r\n\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Wy\\u015Bwietlane s\\u0105 tylko Twoje spotkania\r\n\r\n#YMSG: info message in case edit page is left with back and data changed\r\nview.Appointment.leaveeditmessage=Je\\u015Bli opu\\u015Bcisz t\\u0119 stron\\u0119, utracisz swoje wpisy. Czy chcesz kontynuowa\\u0107?\r\n\r\n#YMSG: info message in case of wrong format of Start Date\r\nview.Appointment.validStartDate=Wpisz prawid\\u0142ow\\u0105 dat\\u0119 rozpocz\\u0119cia\r\n\r\n#YMSG: info message in case of wrong format of End Date\r\nview.Appointment.validEndDate=Wpisz prawid\\u0142ow\\u0105 dat\\u0119 zako\\u0144czenia\r\n\r\n#YMSG: info message in case of wrong format of Start Date and End Date\r\nview.Appointment.validStartEndDate=Wpisz prawid\\u0142ow\\u0105 dat\\u0119 rozpocz\\u0119cia i dat\\u0119 zako\\u0144czenia\r\n\r\n#XTIT: Title for Process type dialog\r\nview.Appointment.process_type=Wybierz typ transakcji\r\n\r\n#XFLD: No Data text when loading/searching list\r\nview.Appointment.no_data_text=Obecnie brak dost\\u0119pnych pozycji\r\n\r\n#XFLD: Transaction Type\r\nview.Appointment.TransactionType=Rodzaj\r\n\r\n#YMSG : PRIVATE appointment message\r\nview.Appointment.privateMessage=To jest spotkanie prywatne\r\n\r\n#XFLD: Title for private appointment in shared calendar\r\nview.Appointment.privateAppointment=Spotkanie prywatne\r\n#XTIT: this is the title for the Transaction History Tab\r\nTRANS_HISTORY=Historia operacji\r\n\r\n#XFLD, 30: Field Transaction ID on List\r\nTRANS_ID=ID transakcji\r\n\r\n#XFLD, 30: Field Transaction Type on List\r\nTRANS_TYPE=Rodzaj operacji\r\n\r\n#XFLD, 30: Field Description on List\r\nTRANS_DESC=Opis\r\n\r\n#XFLD, 30: Field Created On on List\r\nCREATED_ON=Data utworzenia\r\n\r\n#XFLD, 30: Field Created On on List\r\nRELATIONSHIP=Typ relacji\r\n\r\n#XFLD, 15: Priority label\r\nview.Appointment.priority=Priorytet\r\n\r\n#YMSG, 50:Customizing incomplete\r\nCUSTOMIZING_INCOMPLETE=Niekompletne dostosowanie. Skontaktuj si\\u0119 z administratorem.\r\n\r\n#XBUT: Button text to Messages\r\nview.Appointment.messages=Komunikaty\r\n\r\n#XGRP: Error message dialog title\r\nview.Appointment.errorMessage=Komunikaty ({0})\r\n\r\n#YMSG: contact not assigned to this account\r\n',
	"cus/crm/mycalendar/i18n/i18n_pt.properties":'\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n\r\n#XTIT: Title of App\r\nview.Appointment.apptitle=Compromissos\r\n\r\n#XTIT: Title of New Appointment screen\r\nview.Appointment.newapptitle=Novo compromisso\r\n\r\n#XFLD: tooltip  for create new appointment button\r\nview.Appointment.newapptm_tt=Novo compromisso\r\n\r\n#XTIT: Title of shared calendars\r\nview.Appointment.sharedCalendars=Calend\\u00E1rios compartilhados\r\n\r\n#XBUT: Button text of my calendar\r\nview.Appointment.mycalendar=Meu calend\\u00E1rio\r\n\r\n#XTIT: Title of infotoolbar \r\nview.Appointment.myTeam=Meus membros da equipe\r\n\r\n#XTIT: Appointment list description with location,account text and contact text\r\nview.Appointment.furtherDetails={0} | {1} ({2})\r\n\r\n#XTIT: Appointment list description with account text and contact text\r\nview.Appointment.furtherDetailsWithoutLoc={0} ({1})\r\n\r\n#XTIT: Appointment list description with loc  and account text\r\nview.Appointment.furtherDetailsWithoutContact={0} | {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Dados modificados por outro usu\\u00E1rio. Selecione OK para chamar os dados mais recentes.\r\n#XTIT: Appointment list description without loc and cantact text\r\nview.Appointment.furtherDetailsWithoutContactAndLoc={0}\r\n\r\n#XTIT: Title of Timeline\r\nview.Appointment.Timeline=Linha do tempo\r\n\r\n#XTIT: Title of Calendars\r\nview.Appointment.Calendars=Calend\\u00E1rios\r\n\r\n#XFLD: tooltip for today button\r\nview.Appointment.today_tt=Hoje\r\n\r\n#XTIT: Header text of Appointment detail\r\nview.Appointment.detail=Detalhes do compromisso\r\n\r\n#XFLD: Account field label\r\nview.Appointment.account=Conta\r\n\r\n#XFLD: Contact field label\r\nview.Appointment.contact=Contato\r\n\r\n#XFLD: Employee Responsible field label\r\nview.Appointment.employeeResponsible=Funcion\\u00E1rio respons\\u00E1vel\r\n\r\n#XFLD: Time field label\r\nview.Appointment.time=Tempo\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.subject=T\\u00EDtulo\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.title=T\\u00EDtulo\r\n\r\n#XFLD: Label for Start date and time\r\nview.Appointment.startdatetime=Data e hora inicial\r\n\r\n#XFLD: Label for End date and time\r\nview.Appointment.enddatetime=Data e hora final\r\n\r\n#XFLD: Label for All day checkbox\r\nview.Appointment.alldayevent=O dia inteiro\r\n\r\n#YMSG: info message in case appointment occurs in the past\r\nview.Appointment.occurspast=Compromisso ocorre no passado\r\n\r\n#YMSG: info message in case no title entered\r\nview.Appointment.notitle=Insira o t\\u00EDtulo\r\n\r\n#XFLD: Label for Private checkbox\r\nview.Appointment.private=Privado\r\n\r\n#XFLD: Location field label\r\nview.Appointment.location=Local\r\n\r\n#XFLD: Importance field label\r\nview.Appointment.importance=Import\\u00E2ncia\r\n\r\n#XFLD: Active Status field label\r\nview.Appointment.activeStatus=Status\r\n\r\n#XFLD: Notes field label\r\nview.Appointment.notes=Notas\r\n\r\n#XFLD: Note field label\r\nview.Appointment.note=Notas\r\n\r\n#XFLD: Label for internal attendees\r\nview.Appointment.internal=Interno\r\n\r\n#XFLD: Label for external attendees\r\nview.Appointment.external=Externo\r\n\r\n#XGRP: Group header of the section for showing the general data\r\nview.Appointment.generalData=Dados gerais\r\n\r\n#XGRP: Group header of the section for showing the contact data\r\nview.Appointment.contactData=Contato\r\n\r\n#XGRP: Group header of the section for showing the attendees\r\nview.Appointment.attendeeData=Participantes\r\n\r\n#XGRP: Group header attendees with number\r\nview.Appointment.attendeeDataNumber=Participantes ({0})\r\n\r\n#XGRP: Group header additional attendees with number\r\nview.Appointment.additionalAttendeeNumber=Participantes adicionais ({0})\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.detailData=Detalhes\r\n\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.appointmentDetail=Compromisso\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Opportunity=Oportunidade\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Task=Tarefa\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.attachmentData=Anexos\r\n\r\n#XGRP: Group header attachments with number how many\r\nview.Appointment.attachmentDataNumber=Anexos ({0})\r\n\r\n#XGRP: Group header attachments with request to save the appointment before file upload \r\nview.Appointment.attachmentSaveRequest=Anexos (gravar primeiro antes de carregar anexos)\r\n\r\n#XBUT: Button text to Delete\r\nview.Appointment.delete=Excluir\r\n\r\n#XBUT: Button text to Follow up\r\nview.Appointment.followup=Atividade subsequente\r\n\r\n#YMSG: no transaction types  present\r\nview.Appointment.FOLLOWUPERROR=Nenhum tipo de transa\\u00E7\\u00E3o encontrado. Verifique seu customizing back-end.\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.deletesuccess=Compromisso exclu\\u00EDdo\r\n\r\n#YMSG: successful followup message in message toast\r\nview.Appointment.followupsuccessful=Compromisso seguinte gravado\r\n\r\n#XBUT: Button text to Edit\r\nview.Appointment.edit=Editar\r\n\r\n#XBUT: Button text to Done\r\nview.Appointment.done=Conclu\\u00EDdo\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.cancel=Anular\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.ok=OK\r\n\r\n#XBUT: Button text to Create\r\nview.Appointment.create=Criar\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.savesuccess=Compromisso gravado\r\n\r\n#XBUT: Button text to SAve\r\nview.Appointment.save=Gravar\r\n\r\n#XBUT: Button text for Day\r\nview.Appointment.day=Dia\r\n\r\n#XBUT: Button text for week\r\nview.Appointment.week=Semana\r\n\r\n#XBUT: Button text for month\r\nview.Appointment.month=M\\u00EAs\r\n\r\n#XFLD: loading text for the appointment list\r\nview.Appointment.loaddatatext=Carregando...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.acsea_title=Contas ({0})\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.acsea_nodata=Nenhuma conta encontrada\r\n\r\n#XFLD: placeholdertext for search fields\r\nview.Appointment.searchfieldplaceholder=Procurar\r\n\r\n#XFLD: placeholdertext for search busy text\r\nview.Appointment.searchlistinfo=Procurando...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.consea_title=Contatos ({0})\r\n\r\n#XTIT: title of the business card for accounts\r\nview.Appointment.account_title=Conta\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.employee_title=Funcion\\u00E1rio\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.contact_title=Contato\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.consea_nodata=Nenhum contato encontrado\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.empsea_nodata=Nenhum funcion\\u00E1rio encontrado\r\n\r\n#XTIT: title of internal attendees search popup\r\nview.Appointment.internal_title=Participantes internos ({0})\r\n\r\n#XTIT: title of external attendees search popup\r\nview.Appointment.external_title=Participantes externos ({0})\r\n\r\n#XTIT: title of internal attendees search popup enhanced with total count\r\nview.Appointment.internal_titlenew=Novos participantes internos ({0})\r\n\r\n#XTIT: title of external attendees search popup enhanced with total count\r\nview.Appointment.external_titlenew=Novos participantes externos ({0})\r\n\r\n#YMSG: Filtered by info bar text for contact search popup\r\nview.Appointment.filteredby=Filtrado por\r\n\r\n#YMSG: filter line for cross navigation: Filter by Account \r\nview.Appointment.filteraccount=Filtrado por conta\r\n\r\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\r\nview.Appointment.duration.min={0} min\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\r\nview.Appointment.duration.hour={0} h\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.day={0} dia\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.days={0} dias\r\n\r\n#XTIT: Button text to Delete \r\nview.Appointment.deleteTitle=Excluir\r\n\r\n#YINS: Text for Pop Up action.  User to react (Yes/No) \r\nview.Appointment.deleteInstruction=Excluir esse compromisso?\r\n\r\n#XBUT: User to react (positive) to delete action \r\nview.Appointment.deleteYes=OK\r\n\r\n#XFLD: placeholder text for fiels adding external attendees\r\nview.Appointment.attexternaladd=Adicionar participante externo\r\n\r\n#XFLD: placeholder text for fiels adding internal attendees\r\nview.Appointment.attinternaladd=Adicionar um colega\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.fromTimeDate=De {0} {1}\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.toTimeDate=At\\u00E9 {0} {1}\r\n\r\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\r\nview.Appointment.timeToTime={0} at\\u00E9 {1}\r\n\r\n#XFLD: empty appointment list text \r\nview.Appointment.appointment_nodata=Nenhum compromisso\r\n\r\n#XFLD: employee fullname: {0} firstname {1} lastname\r\nview.Appointment.employeename={0} {1}\r\n\r\n#XTIT: Title for Edit Appointment page\r\nview.Appointment.editappointment=Editar compromisso\r\n\r\n#YMSG: Error when end time is before start time (on same day)\r\nview.Appointment.wrongTimes=Hora final \\u00E9 anterior \\u00E0 hora inicial\r\n\r\n#YMSG: Error when end date is before start date\r\nview.Appointment.wrongDates=Data final \\u00E9 anterior \\u00E0 data inicial\r\n\r\n#XBUT: Button text for Add Button\r\nview.Appointment.add=Adicionar\r\n\r\n#XTIT: Shell Title of App\r\nview.Appointment.shelltitle=Meus compromissos\r\n\r\n#XFLD: empty list text for external attendee popup\r\nview.Appointment.noextattendees=Nenhum participante externo\r\n\r\n#XFLD: empty list text for internal attendee popup\r\nview.Appointment.nointattendees=Nenhum participante interno\r\n\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Apenas seus compromissos s\\u00E3o exibidos\r\n\r\n#YMSG: info message in case edit page is left with back and data changed\r\nview.Appointment.leaveeditmessage=Suas entradas se perder\\u00E3o se voc\\u00EA sair dessa p\\u00E1gina. Continuar?\r\n\r\n#YMSG: info message in case of wrong format of Start Date\r\nview.Appointment.validStartDate=Insira uma data de in\\u00EDcio v\\u00E1lida\r\n\r\n#YMSG: info message in case of wrong format of End Date\r\nview.Appointment.validEndDate=Insira uma data final v\\u00E1lida\r\n\r\n#YMSG: info message in case of wrong format of Start Date and End Date\r\nview.Appointment.validStartEndDate=Insira uma data de in\\u00EDcio e uma de fim v\\u00E1lidas\r\n\r\n#XTIT: Title for Process type dialog\r\nview.Appointment.process_type=Selecionar tipo de transa\\u00E7\\u00E3o\r\n\r\n#XFLD: No Data text when loading/searching list\r\nview.Appointment.no_data_text=Nenhum item atualmente dispon\\u00EDvel\r\n\r\n#XFLD: Transaction Type\r\nview.Appointment.TransactionType=Tipo\r\n\r\n#YMSG : PRIVATE appointment message\r\nview.Appointment.privateMessage=Este \\u00E9 um compromisso pessoal\r\n\r\n#XFLD: Title for private appointment in shared calendar\r\nview.Appointment.privateAppointment=Compromisso pessoal\r\n#XTIT: this is the title for the Transaction History Tab\r\nTRANS_HISTORY=Hist\\u00F3rico de transa\\u00E7\\u00F5es\r\n\r\n#XFLD, 30: Field Transaction ID on List\r\nTRANS_ID=ID da transa\\u00E7\\u00E3o\r\n\r\n#XFLD, 30: Field Transaction Type on List\r\nTRANS_TYPE=Tipo de transa\\u00E7\\u00E3o\r\n\r\n#XFLD, 30: Field Description on List\r\nTRANS_DESC=Descri\\u00E7\\u00E3o\r\n\r\n#XFLD, 30: Field Created On on List\r\nCREATED_ON=Criado em\r\n\r\n#XFLD, 30: Field Created On on List\r\nRELATIONSHIP=Tipo de rela\\u00E7\\u00E3o\r\n\r\n#XFLD, 15: Priority label\r\nview.Appointment.priority=Prioridade\r\n\r\n#YMSG, 50:Customizing incomplete\r\nCUSTOMIZING_INCOMPLETE=Customizing incompleto. Contate seu administrador de sistema.\r\n\r\n#XBUT: Button text to Messages\r\nview.Appointment.messages=Mensagens\r\n\r\n#XGRP: Error message dialog title\r\nview.Appointment.errorMessage=Mensagens ({0})\r\n\r\n#YMSG: contact not assigned to this account\r\n',
	"cus/crm/mycalendar/i18n/i18n_ro.properties":'\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n\r\n#XTIT: Title of App\r\nview.Appointment.apptitle=\\u00CEnt\\u00E2lniri fixate\r\n\r\n#XTIT: Title of New Appointment screen\r\nview.Appointment.newapptitle=\\u00CEnt\\u00E2lnire fixat\\u0103 nou\\u0103\r\n\r\n#XFLD: tooltip  for create new appointment button\r\nview.Appointment.newapptm_tt=\\u00CEnt\\u00E2lnire fixat\\u0103 nou\\u0103\r\n\r\n#XTIT: Title of shared calendars\r\nview.Appointment.sharedCalendars=Calendare partajate\r\n\r\n#XBUT: Button text of my calendar\r\nview.Appointment.mycalendar=Calendarul meu\r\n\r\n#XTIT: Title of infotoolbar \r\nview.Appointment.myTeam=Membrii mei de echip\\u0103\r\n\r\n#XTIT: Appointment list description with location,account text and contact text\r\nview.Appointment.furtherDetails={0} | {1} ({2})\r\n\r\n#XTIT: Appointment list description with account text and contact text\r\nview.Appointment.furtherDetailsWithoutLoc={0} ({1})\r\n\r\n#XTIT: Appointment list description with loc  and account text\r\nview.Appointment.furtherDetailsWithoutContact={0} | {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Datele au fost modificate de alt utilizator. Alege\\u0163i OK pt.a reg\\u0103si ultimele date.\r\n#XTIT: Appointment list description without loc and cantact text\r\nview.Appointment.furtherDetailsWithoutContactAndLoc={0}\r\n\r\n#XTIT: Title of Timeline\r\nview.Appointment.Timeline=Cronologie\r\n\r\n#XTIT: Title of Calendars\r\nview.Appointment.Calendars=Calendare\r\n\r\n#XFLD: tooltip for today button\r\nview.Appointment.today_tt=Ast\\u0103zi\r\n\r\n#XTIT: Header text of Appointment detail\r\nview.Appointment.detail=Detalii \\u00EEnt\\u00E2lnire fixat\\u0103\r\n\r\n#XFLD: Account field label\r\nview.Appointment.account=Cont\r\n\r\n#XFLD: Contact field label\r\nview.Appointment.contact=Persoan\\u0103 de contact\r\n\r\n#XFLD: Employee Responsible field label\r\nview.Appointment.employeeResponsible=Angajat responsabil\r\n\r\n#XFLD: Time field label\r\nview.Appointment.time=Or\\u0103\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.subject=Titlu\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.title=Titlu\r\n\r\n#XFLD: Label for Start date and time\r\nview.Appointment.startdatetime=Dat\\u0103 \\u015Fi or\\u0103 de \\u00EEnceput\r\n\r\n#XFLD: Label for End date and time\r\nview.Appointment.enddatetime=Dat\\u0103 \\u015Fi or\\u0103 de sf\\u00E2r\\u015Fit\r\n\r\n#XFLD: Label for All day checkbox\r\nview.Appointment.alldayevent=Toat\\u0103 ziua\r\n\r\n#YMSG: info message in case appointment occurs in the past\r\nview.Appointment.occurspast=\\u00CEnt\\u00E2lnirea fixat\\u0103 are loc \\u00EEn trecut\r\n\r\n#YMSG: info message in case no title entered\r\nview.Appointment.notitle=Introduce\\u0163i un titlu\r\n\r\n#XFLD: Label for Private checkbox\r\nview.Appointment.private=Privat\r\n\r\n#XFLD: Location field label\r\nview.Appointment.location=Loc\r\n\r\n#XFLD: Importance field label\r\nview.Appointment.importance=Importan\\u0163\\u0103\r\n\r\n#XFLD: Active Status field label\r\nview.Appointment.activeStatus=Stare\r\n\r\n#XFLD: Notes field label\r\nview.Appointment.notes=Note\r\n\r\n#XFLD: Note field label\r\nview.Appointment.note=Note\r\n\r\n#XFLD: Label for internal attendees\r\nview.Appointment.internal=Intern\r\n\r\n#XFLD: Label for external attendees\r\nview.Appointment.external=Extern\r\n\r\n#XGRP: Group header of the section for showing the general data\r\nview.Appointment.generalData=Date generale\r\n\r\n#XGRP: Group header of the section for showing the contact data\r\nview.Appointment.contactData=Persoan\\u0103 de contact\r\n\r\n#XGRP: Group header of the section for showing the attendees\r\nview.Appointment.attendeeData=Participan\\u0163i\r\n\r\n#XGRP: Group header attendees with number\r\nview.Appointment.attendeeDataNumber=Participan\\u0163i ({0})\r\n\r\n#XGRP: Group header additional attendees with number\r\nview.Appointment.additionalAttendeeNumber=Participan\\u0163i suplimentari ({0})\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.detailData=Detalii\r\n\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.appointmentDetail=\\u00CEnt\\u00E2lnire fixat\\u0103\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Opportunity=Oportunitate\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Task=Sarcin\\u0103\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.attachmentData=Anexe\r\n\r\n#XGRP: Group header attachments with number how many\r\nview.Appointment.attachmentDataNumber=Anexe ({0})\r\n\r\n#XGRP: Group header attachments with request to save the appointment before file upload \r\nview.Appointment.attachmentSaveRequest=Anexe (salvare \\u00EEnainte de \\u00EEnc\\u0103rcare)\r\n\r\n#XBUT: Button text to Delete\r\nview.Appointment.delete=\\u015Etergere\r\n\r\n#XBUT: Button text to Follow up\r\nview.Appointment.followup=Opera\\u0163ie succesiv\\u0103\r\n\r\n#YMSG: no transaction types  present\r\nview.Appointment.FOLLOWUPERROR=F\\u0103r\\u0103 tipuri de opera\\u0163ie g\\u0103site. Verifica\\u0163i customizarea dvs.de backend.\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.deletesuccess=\\u00CEnt\\u00E2lnire fixat\\u0103 \\u015Ftears\\u0103\r\n\r\n#YMSG: successful followup message in message toast\r\nview.Appointment.followupsuccessful=\\u00CEnt\\u00E2lnire fixat\\u0103 succesiv\\u0103 salvat\\u0103\r\n\r\n#XBUT: Button text to Edit\r\nview.Appointment.edit=Editare\r\n\r\n#XBUT: Button text to Done\r\nview.Appointment.done=Efectuat\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.cancel=Anulare\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.ok=OK\r\n\r\n#XBUT: Button text to Create\r\nview.Appointment.create=Creare\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.savesuccess=\\u00CEnt\\u00E2lnire fixat\\u0103 salvat\\u0103\r\n\r\n#XBUT: Button text to SAve\r\nview.Appointment.save=Salvare\r\n\r\n#XBUT: Button text for Day\r\nview.Appointment.day=Zi\r\n\r\n#XBUT: Button text for week\r\nview.Appointment.week=S\\u0103pt\\u0103m\\u00E2n\\u0103\r\n\r\n#XBUT: Button text for month\r\nview.Appointment.month=Lun\\u0103\r\n\r\n#XFLD: loading text for the appointment list\r\nview.Appointment.loaddatatext=\\u00CEnc\\u0103rcare ...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.acsea_title=Conturi ({0})\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.acsea_nodata=F\\u0103r\\u0103 conturi g\\u0103site\r\n\r\n#XFLD: placeholdertext for search fields\r\nview.Appointment.searchfieldplaceholder=C\\u0103utare\r\n\r\n#XFLD: placeholdertext for search busy text\r\nview.Appointment.searchlistinfo=C\\u0103utare...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.consea_title=Persoane de contact ({0})\r\n\r\n#XTIT: title of the business card for accounts\r\nview.Appointment.account_title=Cont\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.employee_title=Angajat\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.contact_title=Persoan\\u0103 de contact\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.consea_nodata=F\\u0103r\\u0103 persoane de contact g\\u0103site\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.empsea_nodata=F\\u0103r\\u0103 angaja\\u0163i g\\u0103si\\u0163i\r\n\r\n#XTIT: title of internal attendees search popup\r\nview.Appointment.internal_title=Participan\\u0163i interni ({0})\r\n\r\n#XTIT: title of external attendees search popup\r\nview.Appointment.external_title=Participan\\u0163i externi ({0})\r\n\r\n#XTIT: title of internal attendees search popup enhanced with total count\r\nview.Appointment.internal_titlenew=Participan\\u0163i interni noi ({0})\r\n\r\n#XTIT: title of external attendees search popup enhanced with total count\r\nview.Appointment.external_titlenew=Participan\\u0163i externi noi ({0})\r\n\r\n#YMSG: Filtered by info bar text for contact search popup\r\nview.Appointment.filteredby=Filtrat dup\\u0103\r\n\r\n#YMSG: filter line for cross navigation: Filter by Account \r\nview.Appointment.filteraccount=Filtrat dup\\u0103 cont\r\n\r\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\r\nview.Appointment.duration.min={0} min\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\r\nview.Appointment.duration.hour={0} h\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.day={0} zi\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.days={0} zile\r\n\r\n#XTIT: Button text to Delete \r\nview.Appointment.deleteTitle=\\u015Etergere\r\n\r\n#YINS: Text for Pop Up action.  User to react (Yes/No) \r\nview.Appointment.deleteInstruction=\\u015Eterge\\u0163i aceast\\u0103 \\u00EEnt\\u00E2lnire fixat\\u0103?\r\n\r\n#XBUT: User to react (positive) to delete action \r\nview.Appointment.deleteYes=OK\r\n\r\n#XFLD: placeholder text for fiels adding external attendees\r\nview.Appointment.attexternaladd=Ad\\u0103ugare participant extern\r\n\r\n#XFLD: placeholder text for fiels adding internal attendees\r\nview.Appointment.attinternaladd=Ad\\u0103ugare coleg\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.fromTimeDate=De la {0} {1}\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.toTimeDate=P\\u00E2n\\u0103 la {0} {1}\r\n\r\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\r\nview.Appointment.timeToTime={0} p\\u00E2n\\u0103 la   {1}\r\n\r\n#XFLD: empty appointment list text \r\nview.Appointment.appointment_nodata=F\\u0103r\\u0103 \\u00EEnt\\u00E2lniri fixate\r\n\r\n#XFLD: employee fullname: {0} firstname {1} lastname\r\nview.Appointment.employeename={0} {1}\r\n\r\n#XTIT: Title for Edit Appointment page\r\nview.Appointment.editappointment=Editare \\u00EEnt\\u00E2lnire fixat\\u0103\r\n\r\n#YMSG: Error when end time is before start time (on same day)\r\nview.Appointment.wrongTimes=Ora de sf\\u00E2r\\u015Fit este \\u00EEnainte de ora de \\u00EEnceput\r\n\r\n#YMSG: Error when end date is before start date\r\nview.Appointment.wrongDates=Data de sf\\u00E2r\\u015Fit este \\u00EEnainte de data de \\u00EEnceput\r\n\r\n#XBUT: Button text for Add Button\r\nview.Appointment.add=Ad\\u0103ugare\r\n\r\n#XTIT: Shell Title of App\r\nview.Appointment.shelltitle=Program\\u0103rile mele\r\n\r\n#XFLD: empty list text for external attendee popup\r\nview.Appointment.noextattendees=F\\u0103r\\u0103 participan\\u0163i externi\r\n\r\n#XFLD: empty list text for internal attendee popup\r\nview.Appointment.nointattendees=F\\u0103r\\u0103 participan\\u0163i interni\r\n\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Doar \\u00EEnt\\u00E2lnirile dvs.fixate sunt afi\\u015Fate\r\n\r\n#YMSG: info message in case edit page is left with back and data changed\r\nview.Appointment.leaveeditmessage=Intr\\u0103rile dvs.vor fi pierdute dac\\u0103 p\\u0103r\\u0103si\\u0163i aceast\\u0103 pagin\\u0103. Dori\\u0163i s\\u0103 continua\\u0163i?\r\n\r\n#YMSG: info message in case of wrong format of Start Date\r\nview.Appointment.validStartDate=Introduce\\u0163i o dat\\u0103 de \\u00EEnceput valabil\\u0103\r\n\r\n#YMSG: info message in case of wrong format of End Date\r\nview.Appointment.validEndDate=Introduce\\u0163i o dat\\u0103 de sf\\u00E2r\\u015Fit valabil\\u0103\r\n\r\n#YMSG: info message in case of wrong format of Start Date and End Date\r\nview.Appointment.validStartEndDate=Introduce\\u0163i o dat\\u0103 de \\u00EEnceput \\u015Fi o dat\\u0103 de sf\\u00E2r\\u015Fit valabile\r\n\r\n#XTIT: Title for Process type dialog\r\nview.Appointment.process_type=Selectare tip de opera\\u0163ie\r\n\r\n#XFLD: No Data text when loading/searching list\r\nview.Appointment.no_data_text=\\u00CEn prezent nu sunt disponibile pozi\\u0163ii\r\n\r\n#XFLD: Transaction Type\r\nview.Appointment.TransactionType=Tip\r\n\r\n#YMSG : PRIVATE appointment message\r\nview.Appointment.privateMessage=Aceasta este o \\u00EEnt\\u00E2lnire fixat\\u0103 privat\\u0103\r\n\r\n#XFLD: Title for private appointment in shared calendar\r\nview.Appointment.privateAppointment=\\u00CEnt\\u00E2lnire fixat\\u0103 privat\\u0103\r\n#XTIT: this is the title for the Transaction History Tab\r\nTRANS_HISTORY=Istoric de opera\\u0163ii\r\n\r\n#XFLD, 30: Field Transaction ID on List\r\nTRANS_ID=ID opera\\u0163ie\r\n\r\n#XFLD, 30: Field Transaction Type on List\r\nTRANS_TYPE=Tip opera\\u0163ie\r\n\r\n#XFLD, 30: Field Description on List\r\nTRANS_DESC=Descriere\r\n\r\n#XFLD, 30: Field Created On on List\r\nCREATED_ON=Creat pe\r\n\r\n#XFLD, 30: Field Created On on List\r\nRELATIONSHIP=Tip de rela\\u0163ie\r\n\r\n#XFLD, 15: Priority label\r\nview.Appointment.priority=Prioritate\r\n\r\n#YMSG, 50:Customizing incomplete\r\nCUSTOMIZING_INCOMPLETE=Customizare incomplet\\u0103. Contacta\\u0163i administratorul dvs.de sistem.\r\n\r\n#XBUT: Button text to Messages\r\nview.Appointment.messages=Mesaje\r\n\r\n#XGRP: Error message dialog title\r\nview.Appointment.errorMessage=Mesaje ({0})\r\n\r\n#YMSG: contact not assigned to this account\r\n',
	"cus/crm/mycalendar/i18n/i18n_ru.properties":'\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n\r\n#XTIT: Title of App\r\nview.Appointment.apptitle=\\u0412\\u0441\\u0442\\u0440\\u0435\\u0447\\u0438\r\n\r\n#XTIT: Title of New Appointment screen\r\nview.Appointment.newapptitle=\\u041D\\u043E\\u0432\\u0430\\u044F \\u0432\\u0441\\u0442\\u0440\\u0435\\u0447\\u0430\r\n\r\n#XFLD: tooltip  for create new appointment button\r\nview.Appointment.newapptm_tt=\\u041D\\u043E\\u0432\\u0430\\u044F \\u0432\\u0441\\u0442\\u0440\\u0435\\u0447\\u0430\r\n\r\n#XTIT: Title of shared calendars\r\nview.Appointment.sharedCalendars=\\u041E\\u0431\\u0449\\u0438\\u0435 \\u043A\\u0430\\u043B\\u0435\\u043D\\u0434\\u0430\\u0440\\u0438\r\n\r\n#XBUT: Button text of my calendar\r\nview.Appointment.mycalendar=\\u041C\\u043E\\u0439 \\u043A\\u0430\\u043B\\u0435\\u043D\\u0434\\u0430\\u0440\\u044C\r\n\r\n#XTIT: Title of infotoolbar \r\nview.Appointment.myTeam=\\u0423\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u0438 \\u043C\\u043E\\u0435\\u0439 \\u0433\\u0440\\u0443\\u043F\\u043F\\u044B\r\n\r\n#XTIT: Appointment list description with location,account text and contact text\r\nview.Appointment.furtherDetails={0} | {1} ({2})\r\n\r\n#XTIT: Appointment list description with account text and contact text\r\nview.Appointment.furtherDetailsWithoutLoc={0} ({1})\r\n\r\n#XTIT: Appointment list description with loc  and account text\r\nview.Appointment.furtherDetailsWithoutContact={0} | {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=\\u0414\\u0430\\u043D\\u043D\\u044B\\u0435 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u044B \\u0434\\u0440\\u0443\\u0433\\u0438\\u043C \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u0435\\u043C. \\u041D\\u0430\\u0436\\u043C\\u0438\\u0442\\u0435 \\u041E\\u041A \\u0434\\u043B\\u044F \\u043F\\u043E\\u043B\\u0443\\u0447\\u0435\\u043D\\u0438\\u044F \\u0430\\u043A\\u0442\\u0443\\u0430\\u043B\\u044C\\u043D\\u044B\\u0445 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0445.\r\n#XTIT: Appointment list description without loc and cantact text\r\nview.Appointment.furtherDetailsWithoutContactAndLoc={0}\r\n\r\n#XTIT: Title of Timeline\r\nview.Appointment.Timeline=\\u0413\\u0440\\u0430\\u0444\\u0438\\u043A\r\n\r\n#XTIT: Title of Calendars\r\nview.Appointment.Calendars=\\u041A\\u0430\\u043B\\u0435\\u043D\\u0434\\u0430\\u0440\\u0438\r\n\r\n#XFLD: tooltip for today button\r\nview.Appointment.today_tt=\\u0421\\u0435\\u0433\\u043E\\u0434\\u043D\\u044F\r\n\r\n#XTIT: Header text of Appointment detail\r\nview.Appointment.detail=\\u0412\\u0441\\u0442\\u0440\\u0435\\u0447\\u0430\\: \\u043F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u043E\r\n\r\n#XFLD: Account field label\r\nview.Appointment.account=\\u041A\\u043B\\u0438\\u0435\\u043D\\u0442\r\n\r\n#XFLD: Contact field label\r\nview.Appointment.contact=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n\r\n#XFLD: Employee Responsible field label\r\nview.Appointment.employeeResponsible=\\u041E\\u0442\\u0432\\u0435\\u0442\\u0441\\u0442\\u0432\\u0435\\u043D\\u043D\\u044B\\u0439 \\u0441\\u043E\\u0442\\u0440\\u0443\\u0434\\u043D\\u0438\\u043A\r\n\r\n#XFLD: Time field label\r\nview.Appointment.time=\\u0412\\u0440\\u0435\\u043C\\u044F\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.subject=\\u0417\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.title=\\u041D\\u0430\\u0437\\u0432\\u0430\\u043D\\u0438\\u0435\r\n\r\n#XFLD: Label for Start date and time\r\nview.Appointment.startdatetime=\\u0414\\u0430\\u0442\\u0430/\\u0432\\u0440\\u0435\\u043C\\u044F \\u043D\\u0430\\u0447\\u0430\\u043B\\u0430\r\n\r\n#XFLD: Label for End date and time\r\nview.Appointment.enddatetime=\\u0414\\u0430\\u0442\\u0430/\\u0432\\u0440\\u0435\\u043C\\u044F \\u043E\\u043A\\u043E\\u043D\\u0447\\u0430\\u043D\\u0438\\u044F\r\n\r\n#XFLD: Label for All day checkbox\r\nview.Appointment.alldayevent=\\u0412\\u0435\\u0441\\u044C \\u0434\\u0435\\u043D\\u044C\r\n\r\n#YMSG: info message in case appointment occurs in the past\r\nview.Appointment.occurspast=\\u0412\\u0441\\u0442\\u0440\\u0435\\u0447\\u0430 \\u0432 \\u043F\\u0440\\u043E\\u0448\\u043B\\u043E\\u043C\r\n\r\n#YMSG: info message in case no title entered\r\nview.Appointment.notitle=\\u0412\\u0432\\u0435\\u0441\\u0442\\u0438 \\u043D\\u0430\\u0437\\u0432\\u0430\\u043D\\u0438\\u0435\r\n\r\n#XFLD: Label for Private checkbox\r\nview.Appointment.private=\\u041B\\u0438\\u0447\\u043D\\u0430\\u044F\r\n\r\n#XFLD: Location field label\r\nview.Appointment.location=\\u041C\\u0435\\u0441\\u0442\\u043E\\u043F\\u043E\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0435\r\n\r\n#XFLD: Importance field label\r\nview.Appointment.importance=\\u0412\\u0430\\u0436\\u043D\\u043E\\u0441\\u0442\\u044C\r\n\r\n#XFLD: Active Status field label\r\nview.Appointment.activeStatus=\\u0421\\u0442\\u0430\\u0442\\u0443\\u0441\r\n\r\n#XFLD: Notes field label\r\nview.Appointment.notes=\\u041F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u044F\r\n\r\n#XFLD: Note field label\r\nview.Appointment.note=\\u041F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u044F\r\n\r\n#XFLD: Label for internal attendees\r\nview.Appointment.internal=\\u0412\\u043D\\u0443\\u0442\\u0440\\u0435\\u043D\\u043D\\u0438\\u0435\r\n\r\n#XFLD: Label for external attendees\r\nview.Appointment.external=\\u0412\\u043D\\u0435\\u0448\\u043D\\u0438\\u0435\r\n\r\n#XGRP: Group header of the section for showing the general data\r\nview.Appointment.generalData=\\u041E\\u0431\\u0449\\u0438\\u0435 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0435\r\n\r\n#XGRP: Group header of the section for showing the contact data\r\nview.Appointment.contactData=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n\r\n#XGRP: Group header of the section for showing the attendees\r\nview.Appointment.attendeeData=\\u0423\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u0438\r\n\r\n#XGRP: Group header attendees with number\r\nview.Appointment.attendeeDataNumber=\\u0423\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u0438 ({0})\r\n\r\n#XGRP: Group header additional attendees with number\r\nview.Appointment.additionalAttendeeNumber=\\u0414\\u043E\\u043F\\u043E\\u043B\\u043D\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u044B\\u0435 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u0438 ({0})\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.detailData=\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u043E\r\n\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.appointmentDetail=\\u0412\\u0441\\u0442\\u0440\\u0435\\u0447\\u0430\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Opportunity=\\u0412\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u044C\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Task=\\u0417\\u0430\\u0434\\u0430\\u0447\\u0430\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.attachmentData=\\u041F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F\r\n\r\n#XGRP: Group header attachments with number how many\r\nview.Appointment.attachmentDataNumber=\\u041F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F ({0})\r\n\r\n#XGRP: Group header attachments with request to save the appointment before file upload \r\nview.Appointment.attachmentSaveRequest=\\u041F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F (\\u0441\\u043E\\u0445\\u0440\\u0430\\u043D\\u0438\\u0442\\u044C \\u043F\\u0435\\u0440\\u0435\\u0434 \\u0437\\u0430\\u0433\\u0440\\u0443\\u0437\\u043A\\u043E\\u0439)\r\n\r\n#XBUT: Button text to Delete\r\nview.Appointment.delete=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C\r\n\r\n#XBUT: Button text to Follow up\r\nview.Appointment.followup=\\u041F\\u043E\\u0441\\u043B\\u0435\\u0434\\u0443\\u044E\\u0449\\u0430\\u044F \\u043E\\u043F\\u0435\\u0440\\u0430\\u0446\\u0438\\u044F\r\n\r\n#YMSG: no transaction types  present\r\nview.Appointment.FOLLOWUPERROR=\\u0422\\u0438\\u043F\\u044B \\u0442\\u0440\\u0430\\u043D\\u0437\\u0430\\u043A\\u0446\\u0438\\u0438 \\u043D\\u0435 \\u043D\\u0430\\u0439\\u0434\\u0435\\u043D\\u044B; \\u043F\\u0440\\u043E\\u0432\\u0435\\u0440\\u044C\\u0442\\u0435 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0443 \\u0431\\u044D\\u043A-\\u044D\\u043D\\u0434\\u0430\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.deletesuccess=\\u0412\\u0441\\u0442\\u0440\\u0435\\u0447\\u0430 \\u0443\\u0434\\u0430\\u043B\\u0435\\u043D\\u0430\r\n\r\n#YMSG: successful followup message in message toast\r\nview.Appointment.followupsuccessful=\\u041F\\u043E\\u0441\\u043B\\u0435\\u0434\\u0443\\u044E\\u0449\\u0430\\u044F \\u0432\\u0441\\u0442\\u0440\\u0435\\u0447\\u0430 \\u0441\\u043E\\u0445\\u0440\\u0430\\u043D\\u0435\\u043D\\u0430\r\n\r\n#XBUT: Button text to Edit\r\nview.Appointment.edit=\\u041E\\u0431\\u0440\\u0430\\u0431\\u043E\\u0442\\u0430\\u0442\\u044C\r\n\r\n#XBUT: Button text to Done\r\nview.Appointment.done=\\u0413\\u043E\\u0442\\u043E\\u0432\\u043E\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.cancel=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.ok=\\u041E\\u041A\r\n\r\n#XBUT: Button text to Create\r\nview.Appointment.create=\\u0421\\u043E\\u0437\\u0434\\u0430\\u0442\\u044C\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.savesuccess=\\u0412\\u0441\\u0442\\u0440\\u0435\\u0447\\u0430 \\u0441\\u043E\\u0445\\u0440\\u0430\\u043D\\u0435\\u043D\\u0430\r\n\r\n#XBUT: Button text to SAve\r\nview.Appointment.save=\\u0421\\u043E\\u0445\\u0440\\u0430\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XBUT: Button text for Day\r\nview.Appointment.day=\\u0414\\u0435\\u043D\\u044C\r\n\r\n#XBUT: Button text for week\r\nview.Appointment.week=\\u041D\\u0435\\u0434\\u0435\\u043B\\u044F\r\n\r\n#XBUT: Button text for month\r\nview.Appointment.month=\\u041C\\u0435\\u0441\\u044F\\u0446\r\n\r\n#XFLD: loading text for the appointment list\r\nview.Appointment.loaddatatext=\\u0417\\u0430\\u0433\\u0440\\u0443\\u0437\\u043A\\u0430...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.acsea_title=\\u041A\\u043B\\u0438\\u0435\\u043D\\u0442\\u044B ({0})\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.acsea_nodata=\\u041A\\u043B\\u0438\\u0435\\u043D\\u0442\\u044B \\u043D\\u0435 \\u043D\\u0430\\u0439\\u0434\\u0435\\u043D\\u044B\r\n\r\n#XFLD: placeholdertext for search fields\r\nview.Appointment.searchfieldplaceholder=\\u041F\\u043E\\u0438\\u0441\\u043A\r\n\r\n#XFLD: placeholdertext for search busy text\r\nview.Appointment.searchlistinfo=\\u041F\\u043E\\u0438\\u0441\\u043A...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.consea_title=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u044B ({0})\r\n\r\n#XTIT: title of the business card for accounts\r\nview.Appointment.account_title=\\u041A\\u043B\\u0438\\u0435\\u043D\\u0442\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.employee_title=\\u0421\\u043E\\u0442\\u0440\\u0443\\u0434\\u043D\\u0438\\u043A\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.contact_title=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.consea_nodata=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u044B \\u043D\\u0435 \\u043D\\u0430\\u0439\\u0434\\u0435\\u043D\\u044B\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.empsea_nodata=\\u0421\\u043E\\u0442\\u0440\\u0443\\u0434\\u043D\\u0438\\u043A\\u0438 \\u043D\\u0435 \\u043D\\u0430\\u0439\\u0434\\u0435\\u043D\\u044B\r\n\r\n#XTIT: title of internal attendees search popup\r\nview.Appointment.internal_title=\\u0412\\u043D\\u0443\\u0442\\u0440\\u0435\\u043D\\u043D\\u0438\\u0435 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u0438 ({0})\r\n\r\n#XTIT: title of external attendees search popup\r\nview.Appointment.external_title=\\u0412\\u043D\\u0435\\u0448\\u043D\\u0438\\u0435 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u0438 ({0})\r\n\r\n#XTIT: title of internal attendees search popup enhanced with total count\r\nview.Appointment.internal_titlenew=\\u041D\\u043E\\u0432\\u044B\\u0435 \\u0432\\u043D\\u0443\\u0442\\u0440\\u0435\\u043D\\u043D\\u0438\\u0435 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u0438 ({0})\r\n\r\n#XTIT: title of external attendees search popup enhanced with total count\r\nview.Appointment.external_titlenew=\\u041D\\u043E\\u0432\\u044B\\u0435 \\u0432\\u043D\\u0435\\u0448\\u043D\\u0438\\u0435 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u0438 ({0})\r\n\r\n#YMSG: Filtered by info bar text for contact search popup\r\nview.Appointment.filteredby=\\u041E\\u0442\\u0444\\u0438\\u043B\\u044C\\u0442\\u0440\\u043E\\u0432\\u0430\\u043D\\u043E \\u043F\\u043E\r\n\r\n#YMSG: filter line for cross navigation: Filter by Account \r\nview.Appointment.filteraccount=\\u041E\\u0442\\u0444\\u0438\\u043B\\u044C\\u0442\\u0440\\u043E\\u0432\\u0430\\u043D\\u043E \\u043F\\u043E \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0443\r\n\r\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\r\nview.Appointment.duration.min={0} \\u043C\\u0438\\u043D\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\r\nview.Appointment.duration.hour={0} \\u0447\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.day={0} \\u0434\\u0435\\u043D\\u044C\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.days={0} \\u0434.\r\n\r\n#XTIT: Button text to Delete \r\nview.Appointment.deleteTitle=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C\r\n\r\n#YINS: Text for Pop Up action.  User to react (Yes/No) \r\nview.Appointment.deleteInstruction=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C \\u0432\\u0441\\u0442\\u0440\\u0435\\u0447\\u0443?\r\n\r\n#XBUT: User to react (positive) to delete action \r\nview.Appointment.deleteYes=\\u041E\\u041A\r\n\r\n#XFLD: placeholder text for fiels adding external attendees\r\nview.Appointment.attexternaladd=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u0432\\u043D\\u0435\\u0448\\u043D\\u0435\\u0433\\u043E \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u0430\r\n\r\n#XFLD: placeholder text for fiels adding internal attendees\r\nview.Appointment.attinternaladd=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u043A\\u043E\\u043B\\u043B\\u0435\\u0433\\u0443\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.fromTimeDate=\\u0421 {0} {1}\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.toTimeDate=\\u041F\\u043E {0} {1}\r\n\r\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\r\nview.Appointment.timeToTime={0} \\u043F\\u043E   {1}\r\n\r\n#XFLD: empty appointment list text \r\nview.Appointment.appointment_nodata=\\u041D\\u0435\\u0442 \\u0432\\u0441\\u0442\\u0440\\u0435\\u0447\r\n\r\n#XFLD: employee fullname: {0} firstname {1} lastname\r\nview.Appointment.employeename={0} {1}\r\n\r\n#XTIT: Title for Edit Appointment page\r\nview.Appointment.editappointment=\\u041E\\u0431\\u0440\\u0430\\u0431\\u043E\\u0442\\u0430\\u0442\\u044C \\u0432\\u0441\\u0442\\u0440\\u0435\\u0447\\u0443\r\n\r\n#YMSG: Error when end time is before start time (on same day)\r\nview.Appointment.wrongTimes=\\u0412\\u0440\\u0435\\u043C\\u044F \\u043E\\u043A\\u043E\\u043D\\u0447\\u0430\\u043D\\u0438\\u044F \\u043F\\u043E\\u0441\\u043B\\u0435 \\u0432\\u0440\\u0435\\u043C\\u0435\\u043D\\u0438 \\u043D\\u0430\\u0447\\u0430\\u043B\\u0430\r\n\r\n#YMSG: Error when end date is before start date\r\nview.Appointment.wrongDates=\\u0414\\u0430\\u0442\\u0430 \\u043E\\u043A\\u043E\\u043D\\u0447\\u0430\\u043D\\u0438\\u044F \\u043F\\u043E\\u0441\\u043B\\u0435 \\u0434\\u0430\\u0442\\u044B \\u043D\\u0430\\u0447\\u0430\\u043B\\u0430\r\n\r\n#XBUT: Button text for Add Button\r\nview.Appointment.add=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C\r\n\r\n#XTIT: Shell Title of App\r\nview.Appointment.shelltitle=\\u041C\\u043E\\u0438 \\u0432\\u0441\\u0442\\u0440\\u0435\\u0447\\u0438\r\n\r\n#XFLD: empty list text for external attendee popup\r\nview.Appointment.noextattendees=\\u041D\\u0435\\u0442 \\u0432\\u043D\\u0435\\u0448\\u043D\\u0438\\u0445 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u043E\\u0432\r\n\r\n#XFLD: empty list text for internal attendee popup\r\nview.Appointment.nointattendees=\\u041D\\u0435\\u0442 \\u0432\\u043D\\u0443\\u0442\\u0440\\u0435\\u043D\\u043D\\u0438\\u0445 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u043E\\u0432\r\n\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=\\u041E\\u0442\\u043E\\u0431\\u0440\\u0430\\u0436\\u0430\\u044E\\u0442\\u0441\\u044F \\u0442\\u043E\\u043B\\u044C\\u043A\\u043E \\u0432\\u0430\\u0448\\u0438 \\u0432\\u0441\\u0442\\u0440\\u0435\\u0447\\u0438\r\n\r\n#YMSG: info message in case edit page is left with back and data changed\r\nview.Appointment.leaveeditmessage=\\u0412\\u0430\\u0448\\u0438 \\u0437\\u0430\\u043F\\u0438\\u0441\\u0438 \\u043D\\u0435 \\u0441\\u043E\\u0445\\u0440\\u0430\\u043D\\u044F\\u0442\\u0441\\u044F, \\u0435\\u0441\\u043B\\u0438 \\u0432\\u044B \\u043F\\u043E\\u043A\\u0438\\u043D\\u0435\\u0442\\u0435 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0443. \\u041F\\u0440\\u043E\\u0434\\u043E\\u043B\\u0436\\u0438\\u0442\\u044C?\r\n\r\n#YMSG: info message in case of wrong format of Start Date\r\nview.Appointment.validStartDate=\\u0412\\u0432\\u0435\\u0434\\u0438\\u0442\\u0435 \\u0434\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u0443\\u044E \\u0434\\u0430\\u0442\\u0443 \\u043D\\u0430\\u0447\\u0430\\u043B\\u0430\r\n\r\n#YMSG: info message in case of wrong format of End Date\r\nview.Appointment.validEndDate=\\u0412\\u0432\\u0435\\u0434\\u0438\\u0442\\u0435 \\u0434\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u0443\\u044E \\u0434\\u0430\\u0442\\u0443 \\u043E\\u043A\\u043E\\u043D\\u0447\\u0430\\u043D\\u0438\\u044F\r\n\r\n#YMSG: info message in case of wrong format of Start Date and End Date\r\nview.Appointment.validStartEndDate=\\u0412\\u0432\\u0435\\u0434\\u0438\\u0442\\u0435 \\u0434\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u0443\\u044E \\u0434\\u0430\\u0442\\u0443 \\u043D\\u0430\\u0447\\u0430\\u043B\\u0430 \\u0438 \\u043E\\u043A\\u043E\\u043D\\u0447\\u0430\\u043D\\u0438\\u044F\r\n\r\n#XTIT: Title for Process type dialog\r\nview.Appointment.process_type=\\u0412\\u044B\\u0431\\u043E\\u0440 \\u0442\\u0438\\u043F\\u0430 \\u0442\\u0440\\u0430\\u043D\\u0437\\u0430\\u043A\\u0446\\u0438\\u0438\r\n\r\n#XFLD: No Data text when loading/searching list\r\nview.Appointment.no_data_text=\\u0412 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0439 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442 \\u043D\\u0435\\u0442 \\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\\u0445 \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u0439\r\n\r\n#XFLD: Transaction Type\r\nview.Appointment.TransactionType=\\u0422\\u0438\\u043F\r\n\r\n#YMSG : PRIVATE appointment message\r\nview.Appointment.privateMessage=\\u042D\\u0442\\u043E \\u043B\\u0438\\u0447\\u043D\\u0430\\u044F \\u0432\\u0441\\u0442\\u0440\\u0435\\u0447\\u0430\r\n\r\n#XFLD: Title for private appointment in shared calendar\r\nview.Appointment.privateAppointment=\\u041B\\u0438\\u0447\\u043D\\u0430\\u044F \\u0432\\u0441\\u0442\\u0440\\u0435\\u0447\\u0430\r\n#XTIT: this is the title for the Transaction History Tab\r\nTRANS_HISTORY=\\u0418\\u0441\\u0442\\u043E\\u0440\\u0438\\u044F \\u0442\\u0440\\u0430\\u043D\\u0437\\u0430\\u043A\\u0446\\u0438\\u0439\r\n\r\n#XFLD, 30: Field Transaction ID on List\r\nTRANS_ID=\\u0418\\u0434. \\u043E\\u043F\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438\r\n\r\n#XFLD, 30: Field Transaction Type on List\r\nTRANS_TYPE=\\u0412\\u0438\\u0434 \\u043E\\u043F\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438\r\n\r\n#XFLD, 30: Field Description on List\r\nTRANS_DESC=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\r\n\r\n#XFLD, 30: Field Created On on List\r\nCREATED_ON=\\u0414\\u0430\\u0442\\u0430 \\u0441\\u043E\\u0437\\u0434\\u0430\\u043D\\u0438\\u044F\r\n\r\n#XFLD, 30: Field Created On on List\r\nRELATIONSHIP=\\u0412\\u0438\\u0434 \\u043E\\u0442\\u043D\\u043E\\u0448\\u0435\\u043D\\u0438\\u044F\r\n\r\n#XFLD, 15: Priority label\r\nview.Appointment.priority=\\u041F\\u0440\\u0438\\u043E\\u0440\\u0438\\u0442\\u0435\\u0442\r\n\r\n#YMSG, 50:Customizing incomplete\r\nCUSTOMIZING_INCOMPLETE=\\u041D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0430 \\u043D\\u0435 \\u0437\\u0430\\u0432\\u0435\\u0440\\u0448\\u0435\\u043D\\u0430. \\u041E\\u0431\\u0440\\u0430\\u0442\\u0438\\u0442\\u0435\\u0441\\u044C \\u043A \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u043D\\u043E\\u043C\\u0443 \\u0430\\u0434\\u043C\\u0438\\u043D\\u0438\\u0441\\u0442\\u0440\\u0430\\u0442\\u043E\\u0440\\u0443.\r\n\r\n#XBUT: Button text to Messages\r\nview.Appointment.messages=\\u0421\\u043E\\u043E\\u0431\\u0449\\u0435\\u043D\\u0438\\u044F\r\n\r\n#XGRP: Error message dialog title\r\nview.Appointment.errorMessage=\\u0421\\u043E\\u043E\\u0431\\u0449\\u0435\\u043D\\u0438\\u044F ({0})\r\n\r\n#YMSG: contact not assigned to this account\r\n',
	"cus/crm/mycalendar/i18n/i18n_sh.properties":'\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n\r\n#XTIT: Title of App\r\nview.Appointment.apptitle=Sastanci\r\n\r\n#XTIT: Title of New Appointment screen\r\nview.Appointment.newapptitle=Novi sastanak\r\n\r\n#XFLD: tooltip  for create new appointment button\r\nview.Appointment.newapptm_tt=Novi sastanak\r\n\r\n#XTIT: Title of shared calendars\r\nview.Appointment.sharedCalendars=Deljeni kalendari\r\n\r\n#XBUT: Button text of my calendar\r\nview.Appointment.mycalendar=Moj kalendar\r\n\r\n#XTIT: Title of infotoolbar \r\nview.Appointment.myTeam=Moji \\u010Dlanovi tima\r\n\r\n#XTIT: Appointment list description with location,account text and contact text\r\nview.Appointment.furtherDetails={0} | {1} ({2})\r\n\r\n#XTIT: Appointment list description with account text and contact text\r\nview.Appointment.furtherDetailsWithoutLoc={0} ({1})\r\n\r\n#XTIT: Appointment list description with loc  and account text\r\nview.Appointment.furtherDetailsWithoutContact={0} | {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Podatke je promenio drugi korisnik. Kliknite na dugme OK za pozivanje najnovijih podataka.\r\n#XTIT: Appointment list description without loc and cantact text\r\nview.Appointment.furtherDetailsWithoutContactAndLoc={0}\r\n\r\n#XTIT: Title of Timeline\r\nview.Appointment.Timeline=Vremenska linija\r\n\r\n#XTIT: Title of Calendars\r\nview.Appointment.Calendars=Kalendari\r\n\r\n#XFLD: tooltip for today button\r\nview.Appointment.today_tt=Danas\r\n\r\n#XTIT: Header text of Appointment detail\r\nview.Appointment.detail=Detalji sastanka\r\n\r\n#XFLD: Account field label\r\nview.Appointment.account=Ra\\u010Dun\r\n\r\n#XFLD: Contact field label\r\nview.Appointment.contact=Kontakt\r\n\r\n#XFLD: Employee Responsible field label\r\nview.Appointment.employeeResponsible=Odgovorni zaposleni\r\n\r\n#XFLD: Time field label\r\nview.Appointment.time=Vreme\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.subject=Naslov\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.title=Naslov\r\n\r\n#XFLD: Label for Start date and time\r\nview.Appointment.startdatetime=Datum i vreme po\\u010Detka\r\n\r\n#XFLD: Label for End date and time\r\nview.Appointment.enddatetime=Datum i vreme zavr\\u0161etka\r\n\r\n#XFLD: Label for All day checkbox\r\nview.Appointment.alldayevent=Ceo dan\r\n\r\n#YMSG: info message in case appointment occurs in the past\r\nview.Appointment.occurspast=Sastanak se de\\u0161ava u pro\\u0161losti\r\n\r\n#YMSG: info message in case no title entered\r\nview.Appointment.notitle=Unesite naslov\r\n\r\n#XFLD: Label for Private checkbox\r\nview.Appointment.private=Privatno\r\n\r\n#XFLD: Location field label\r\nview.Appointment.location=Lokacija\r\n\r\n#XFLD: Importance field label\r\nview.Appointment.importance=Va\\u017Enost\r\n\r\n#XFLD: Active Status field label\r\nview.Appointment.activeStatus=Status\r\n\r\n#XFLD: Notes field label\r\nview.Appointment.notes=Bele\\u0161ke\r\n\r\n#XFLD: Note field label\r\nview.Appointment.note=Bele\\u0161ke\r\n\r\n#XFLD: Label for internal attendees\r\nview.Appointment.internal=Interno\r\n\r\n#XFLD: Label for external attendees\r\nview.Appointment.external=Eksterno\r\n\r\n#XGRP: Group header of the section for showing the general data\r\nview.Appointment.generalData=Op\\u0161ti podaci\r\n\r\n#XGRP: Group header of the section for showing the contact data\r\nview.Appointment.contactData=Kontakt\r\n\r\n#XGRP: Group header of the section for showing the attendees\r\nview.Appointment.attendeeData=U\\u010Desnici\r\n\r\n#XGRP: Group header attendees with number\r\nview.Appointment.attendeeDataNumber=U\\u010Desnici ({0})\r\n\r\n#XGRP: Group header additional attendees with number\r\nview.Appointment.additionalAttendeeNumber=Dodatni u\\u010Desnici ({0})\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.detailData=Detalji\r\n\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.appointmentDetail=Sastanak\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Opportunity=Prilika\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Task=Zadatak\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.attachmentData=Dodaci\r\n\r\n#XGRP: Group header attachments with number how many\r\nview.Appointment.attachmentDataNumber=Dodaci ({0})\r\n\r\n#XGRP: Group header attachments with request to save the appointment before file upload \r\nview.Appointment.attachmentSaveRequest=Dodaci (sa\\u010Duvaj pre prenosa na server)\r\n\r\n#XBUT: Button text to Delete\r\nview.Appointment.delete=Izbri\\u0161i\r\n\r\n#XBUT: Button text to Follow up\r\nview.Appointment.followup=Naredna aktivnost\r\n\r\n#YMSG: no transaction types  present\r\nview.Appointment.FOLLOWUPERROR=Tipovi transakcije nisu na\\u0111eni. Proverite prilago\\u0111avanje back-end-a.\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.deletesuccess=Sastanak izbrisan\r\n\r\n#YMSG: successful followup message in message toast\r\nview.Appointment.followupsuccessful=Naredni sastanak sa\\u010Duvan\r\n\r\n#XBUT: Button text to Edit\r\nview.Appointment.edit=Uredi\r\n\r\n#XBUT: Button text to Done\r\nview.Appointment.done=Izvr\\u0161eno\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.cancel=Odustani\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.ok=OK\r\n\r\n#XBUT: Button text to Create\r\nview.Appointment.create=Kreiraj\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.savesuccess=Sastanak sa\\u010Duvan\r\n\r\n#XBUT: Button text to SAve\r\nview.Appointment.save=Sa\\u010Duvaj\r\n\r\n#XBUT: Button text for Day\r\nview.Appointment.day=Dan\r\n\r\n#XBUT: Button text for week\r\nview.Appointment.week=Nedelja\r\n\r\n#XBUT: Button text for month\r\nview.Appointment.month=Mesec\r\n\r\n#XFLD: loading text for the appointment list\r\nview.Appointment.loaddatatext=U\\u010Ditavanje...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.acsea_title=Klijenti {0}\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.acsea_nodata=Klijenti nisu na\\u0111eni\r\n\r\n#XFLD: placeholdertext for search fields\r\nview.Appointment.searchfieldplaceholder=Tra\\u017Ei\r\n\r\n#XFLD: placeholdertext for search busy text\r\nview.Appointment.searchlistinfo=Tra\\u017Eenje...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.consea_title=Kontakti ({0})\r\n\r\n#XTIT: title of the business card for accounts\r\nview.Appointment.account_title=Ra\\u010Dun\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.employee_title=Zaposleni\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.contact_title=Kontakt\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.consea_nodata=Kontakti nisu na\\u0111eni\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.empsea_nodata=Zaposleni nisu na\\u0111eni\r\n\r\n#XTIT: title of internal attendees search popup\r\nview.Appointment.internal_title=Interni u\\u010Desnici ({0})\r\n\r\n#XTIT: title of external attendees search popup\r\nview.Appointment.external_title=Eksterni u\\u010Desnici ({0})\r\n\r\n#XTIT: title of internal attendees search popup enhanced with total count\r\nview.Appointment.internal_titlenew=Novi interni u\\u010Desnici ({0})\r\n\r\n#XTIT: title of external attendees search popup enhanced with total count\r\nview.Appointment.external_titlenew=Novi eksterni u\\u010Desnici ({0})\r\n\r\n#YMSG: Filtered by info bar text for contact search popup\r\nview.Appointment.filteredby=Filtrirano po\r\n\r\n#YMSG: filter line for cross navigation: Filter by Account \r\nview.Appointment.filteraccount=Filtrirano po klijentu\r\n\r\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\r\nview.Appointment.duration.min={0} min\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\r\nview.Appointment.duration.hour={0} s\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.day={0} dan\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.days={0} dana\r\n\r\n#XTIT: Button text to Delete \r\nview.Appointment.deleteTitle=Izbri\\u0161i\r\n\r\n#YINS: Text for Pop Up action.  User to react (Yes/No) \r\nview.Appointment.deleteInstruction=Izbrisati ovaj sastanak?\r\n\r\n#XBUT: User to react (positive) to delete action \r\nview.Appointment.deleteYes=OK\r\n\r\n#XFLD: placeholder text for fiels adding external attendees\r\nview.Appointment.attexternaladd=Dodaj eksternog u\\u010Desnika\r\n\r\n#XFLD: placeholder text for fiels adding internal attendees\r\nview.Appointment.attinternaladd=Dodaj kolegu\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.fromTimeDate=Od {0} {1}\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.toTimeDate=Do {0} {1}\r\n\r\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\r\nview.Appointment.timeToTime={0} do {1}\r\n\r\n#XFLD: empty appointment list text \r\nview.Appointment.appointment_nodata=Nema sastanaka\r\n\r\n#XFLD: employee fullname: {0} firstname {1} lastname\r\nview.Appointment.employeename={0} {1}\r\n\r\n#XTIT: Title for Edit Appointment page\r\nview.Appointment.editappointment=Uredi sastanak\r\n\r\n#YMSG: Error when end time is before start time (on same day)\r\nview.Appointment.wrongTimes=Vreme zavr\\u0161etka je pre vremena po\\u010Detka\r\n\r\n#YMSG: Error when end date is before start date\r\nview.Appointment.wrongDates=Datum zavr\\u0161etka je pre datuma po\\u010Detka\r\n\r\n#XBUT: Button text for Add Button\r\nview.Appointment.add=Dodaj\r\n\r\n#XTIT: Shell Title of App\r\nview.Appointment.shelltitle=Moji sastanci\r\n\r\n#XFLD: empty list text for external attendee popup\r\nview.Appointment.noextattendees=Nema eksternih u\\u010Desnika\r\n\r\n#XFLD: empty list text for internal attendee popup\r\nview.Appointment.nointattendees=Nema internih u\\u010Desnika\r\n\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Prikazani su samo va\\u0161i sastanci\r\n\r\n#YMSG: info message in case edit page is left with back and data changed\r\nview.Appointment.leaveeditmessage=Va\\u0161i unosi \\u0107e biti izgubljeni ako napustite ovu stranicu. Da li \\u017Eelite da nastavite?\r\n\r\n#YMSG: info message in case of wrong format of Start Date\r\nview.Appointment.validStartDate=Unesite va\\u017Ee\\u0107i datum po\\u010Detka\r\n\r\n#YMSG: info message in case of wrong format of End Date\r\nview.Appointment.validEndDate=Unesite va\\u017Ee\\u0107i datum zavr\\u0161etka\r\n\r\n#YMSG: info message in case of wrong format of Start Date and End Date\r\nview.Appointment.validStartEndDate=Unesite va\\u017Ee\\u0107i datum po\\u010Detka i datum zavr\\u0161etka\r\n\r\n#XTIT: Title for Process type dialog\r\nview.Appointment.process_type=Odaberi tip transakcije\r\n\r\n#XFLD: No Data text when loading/searching list\r\nview.Appointment.no_data_text=Stavke trenutno nisu dostupne\r\n\r\n#XFLD: Transaction Type\r\nview.Appointment.TransactionType=Tip\r\n\r\n#YMSG : PRIVATE appointment message\r\nview.Appointment.privateMessage=Ovo je privatni sastanak\r\n\r\n#XFLD: Title for private appointment in shared calendar\r\nview.Appointment.privateAppointment=Privatni sastanak\r\n#XTIT: this is the title for the Transaction History Tab\r\nTRANS_HISTORY=Istorija transakcije\r\n\r\n#XFLD, 30: Field Transaction ID on List\r\nTRANS_ID=ID transakcije\r\n\r\n#XFLD, 30: Field Transaction Type on List\r\nTRANS_TYPE=Tip transakcije\r\n\r\n#XFLD, 30: Field Description on List\r\nTRANS_DESC=Opis\r\n\r\n#XFLD, 30: Field Created On on List\r\nCREATED_ON=Datum kreiranja\r\n\r\n#XFLD, 30: Field Created On on List\r\nRELATIONSHIP=Tip odnosa\r\n\r\n#XFLD, 15: Priority label\r\nview.Appointment.priority=Prioritet\r\n\r\n#YMSG, 50:Customizing incomplete\r\nCUSTOMIZING_INCOMPLETE=Nepotpuno prilago\\u0111avanje. Obavestite sistemskog administratora.\r\n\r\n#XBUT: Button text to Messages\r\nview.Appointment.messages=Poruke\r\n\r\n#XGRP: Error message dialog title\r\nview.Appointment.errorMessage=Poruke ({0})\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=Mo\\u017Eete da pogledate samo vizitkarte kontakata koji su dodeljeni ovom klijentu\r\n',
	"cus/crm/mycalendar/i18n/i18n_sk.properties":'\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n\r\n#XTIT: Title of App\r\nview.Appointment.apptitle=Sch\\u00F4dzky\r\n\r\n#XTIT: Title of New Appointment screen\r\nview.Appointment.newapptitle=Nov\\u00E1 sch\\u00F4dzka\r\n\r\n#XFLD: tooltip  for create new appointment button\r\nview.Appointment.newapptm_tt=Nov\\u00E1 sch\\u00F4dzka\r\n\r\n#XTIT: Title of shared calendars\r\nview.Appointment.sharedCalendars=Zdie\\u013Ean\\u00E9 kalend\\u00E1re\r\n\r\n#XBUT: Button text of my calendar\r\nview.Appointment.mycalendar=M\\u00F4j kalend\\u00E1r\r\n\r\n#XTIT: Title of infotoolbar \r\nview.Appointment.myTeam=\\u010Clenovia m\\u00F4jho t\\u00EDmu\r\n\r\n#XTIT: Appointment list description with location,account text and contact text\r\nview.Appointment.furtherDetails={0} | {1} ({2})\r\n\r\n#XTIT: Appointment list description with account text and contact text\r\nview.Appointment.furtherDetailsWithoutLoc={0} ({1})\r\n\r\n#XTIT: Appointment list description with loc  and account text\r\nview.Appointment.furtherDetailsWithoutContact={0} | {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=D\\u00E1ta zmenil in\\u00FD pou\\u017E\\u00EDvate\\u013E. Zvo\\u013Ete OK, aby sa na\\u010D\\u00EDtali najnov\\u0161ie d\\u00E1ta.\r\n#XTIT: Appointment list description without loc and cantact text\r\nview.Appointment.furtherDetailsWithoutContactAndLoc={0}\r\n\r\n#XTIT: Title of Timeline\r\nview.Appointment.Timeline=\\u010Casov\\u00E1 os\r\n\r\n#XTIT: Title of Calendars\r\nview.Appointment.Calendars=Kalend\\u00E1re\r\n\r\n#XFLD: tooltip for today button\r\nview.Appointment.today_tt=Dnes\r\n\r\n#XTIT: Header text of Appointment detail\r\nview.Appointment.detail=Detaily sch\\u00F4dzky\r\n\r\n#XFLD: Account field label\r\nview.Appointment.account=Z\\u00E1kazn\\u00EDk\r\n\r\n#XFLD: Contact field label\r\nview.Appointment.contact=Kontakt\r\n\r\n#XFLD: Employee Responsible field label\r\nview.Appointment.employeeResponsible=Zodpovedn\\u00FD zamestnanec\r\n\r\n#XFLD: Time field label\r\nview.Appointment.time=\\u010Cas\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.subject=N\\u00E1zov\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.title=N\\u00E1zov\r\n\r\n#XFLD: Label for Start date and time\r\nview.Appointment.startdatetime=Po\\u010Diato\\u010Dn\\u00FD d\\u00E1tum a \\u010Das\r\n\r\n#XFLD: Label for End date and time\r\nview.Appointment.enddatetime=Koncov\\u00FD d\\u00E1tum a \\u010Das\r\n\r\n#XFLD: Label for All day checkbox\r\nview.Appointment.alldayevent=Cel\\u00FD de\\u0148\r\n\r\n#YMSG: info message in case appointment occurs in the past\r\nview.Appointment.occurspast=Sch\\u00F4dzka sa vyskytuje v minulosti\r\n\r\n#YMSG: info message in case no title entered\r\nview.Appointment.notitle=Zadajte n\\u00E1zov\r\n\r\n#XFLD: Label for Private checkbox\r\nview.Appointment.private=S\\u00FAkromn\\u00E9\r\n\r\n#XFLD: Location field label\r\nview.Appointment.location=Miesto\r\n\r\n#XFLD: Importance field label\r\nview.Appointment.importance=D\\u00F4le\\u017Eitos\\u0165\r\n\r\n#XFLD: Active Status field label\r\nview.Appointment.activeStatus=Stav\r\n\r\n#XFLD: Notes field label\r\nview.Appointment.notes=Pozn\\u00E1mky\r\n\r\n#XFLD: Note field label\r\nview.Appointment.note=Pozn\\u00E1mky\r\n\r\n#XFLD: Label for internal attendees\r\nview.Appointment.internal=Intern\\u00E9\r\n\r\n#XFLD: Label for external attendees\r\nview.Appointment.external=Extern\\u00E9\r\n\r\n#XGRP: Group header of the section for showing the general data\r\nview.Appointment.generalData=V\\u0161eobecn\\u00E9 d\\u00E1ta\r\n\r\n#XGRP: Group header of the section for showing the contact data\r\nview.Appointment.contactData=Kontakt\r\n\r\n#XGRP: Group header of the section for showing the attendees\r\nview.Appointment.attendeeData=\\u00DA\\u010Dastn\\u00EDci\r\n\r\n#XGRP: Group header attendees with number\r\nview.Appointment.attendeeDataNumber=\\u00DA\\u010Dastn\\u00EDci ({0})\r\n\r\n#XGRP: Group header additional attendees with number\r\nview.Appointment.additionalAttendeeNumber=\\u010Eal\\u0161\\u00ED \\u00FA\\u010Dastn\\u00EDci ({0})\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.detailData=Detaily\r\n\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.appointmentDetail=Sch\\u00F4dzka\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Opportunity=Pr\\u00EDle\\u017Eitos\\u0165\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Task=\\u00DAloha\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.attachmentData=Pr\\u00EDlohy\r\n\r\n#XGRP: Group header attachments with number how many\r\nview.Appointment.attachmentDataNumber=Pr\\u00EDlohy ({0})\r\n\r\n#XGRP: Group header attachments with request to save the appointment before file upload \r\nview.Appointment.attachmentSaveRequest=Pr\\u00EDlohy (ulo\\u017Ei\\u0165 pred odovzdan\\u00EDm)\r\n\r\n#XBUT: Button text to Delete\r\nview.Appointment.delete=Odstr\\u00E1ni\\u0165\r\n\r\n#XBUT: Button text to Follow up\r\nview.Appointment.followup=N\\u00E1sledn\\u00E1 oper\\u00E1cia\r\n\r\n#YMSG: no transaction types  present\r\nview.Appointment.FOLLOWUPERROR=Neboli n\\u00E1jden\\u00E9 \\u017Eiadne typy transakci\\u00ED. Skontrolujte svoje prisp\\u00F4sobenie backendu.\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.deletesuccess=Sch\\u00F4dzka odstr\\u00E1nen\\u00E1\r\n\r\n#YMSG: successful followup message in message toast\r\nview.Appointment.followupsuccessful=N\\u00E1sledn\\u00E1 sch\\u00F4dzka ulo\\u017Een\\u00E1\r\n\r\n#XBUT: Button text to Edit\r\nview.Appointment.edit=Upravi\\u0165\r\n\r\n#XBUT: Button text to Done\r\nview.Appointment.done=Hotovo\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.cancel=Zru\\u0161i\\u0165\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.ok=OK\r\n\r\n#XBUT: Button text to Create\r\nview.Appointment.create=Vytvori\\u0165\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.savesuccess=Sch\\u00F4dzka ulo\\u017Een\\u00E1\r\n\r\n#XBUT: Button text to SAve\r\nview.Appointment.save=Ulo\\u017Ei\\u0165\r\n\r\n#XBUT: Button text for Day\r\nview.Appointment.day=De\\u0148\r\n\r\n#XBUT: Button text for week\r\nview.Appointment.week=T\\u00FD\\u017Ede\\u0148\r\n\r\n#XBUT: Button text for month\r\nview.Appointment.month=Mesiac\r\n\r\n#XFLD: loading text for the appointment list\r\nview.Appointment.loaddatatext=Na\\u010D\\u00EDtava sa...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.acsea_title=Z\\u00E1kazn\\u00EDci ({0})\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.acsea_nodata=Neboli n\\u00E1jden\\u00ED \\u017Eiadni z\\u00E1kazn\\u00EDci\r\n\r\n#XFLD: placeholdertext for search fields\r\nview.Appointment.searchfieldplaceholder=H\\u013Eada\\u0165\r\n\r\n#XFLD: placeholdertext for search busy text\r\nview.Appointment.searchlistinfo=Vyh\\u013Ead\\u00E1va sa...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.consea_title=Kontakty ({0})\r\n\r\n#XTIT: title of the business card for accounts\r\nview.Appointment.account_title=Z\\u00E1kazn\\u00EDk\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.employee_title=Pracovn\\u00EDk\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.contact_title=Kontakt\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.consea_nodata=Neboli n\\u00E1jden\\u00E9 \\u017Eiadne kontakty\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.empsea_nodata=Neboli n\\u00E1jden\\u00ED \\u017Eiadni zamestnanci\r\n\r\n#XTIT: title of internal attendees search popup\r\nview.Appointment.internal_title=Intern\\u00ED \\u00FA\\u010Dastn\\u00EDci ({0})\r\n\r\n#XTIT: title of external attendees search popup\r\nview.Appointment.external_title=Extern\\u00ED \\u00FA\\u010Dastn\\u00EDci ({0})\r\n\r\n#XTIT: title of internal attendees search popup enhanced with total count\r\nview.Appointment.internal_titlenew=Nov\\u00ED intern\\u00ED \\u00FA\\u010Dastn\\u00EDci ({0})\r\n\r\n#XTIT: title of external attendees search popup enhanced with total count\r\nview.Appointment.external_titlenew=Nov\\u00ED extern\\u00ED \\u00FA\\u010Dastn\\u00EDci ({0})\r\n\r\n#YMSG: Filtered by info bar text for contact search popup\r\nview.Appointment.filteredby=Filtrovan\\u00E9 pod\\u013Ea\r\n\r\n#YMSG: filter line for cross navigation: Filter by Account \r\nview.Appointment.filteraccount=Filtrovan\\u00E9 pod\\u013Ea z\\u00E1kazn\\u00EDka\r\n\r\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\r\nview.Appointment.duration.min={0} min\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\r\nview.Appointment.duration.hour={0} hod\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.day={0} de\\u0148\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.days={0} dn\\u00ED\r\n\r\n#XTIT: Button text to Delete \r\nview.Appointment.deleteTitle=Odstr\\u00E1ni\\u0165\r\n\r\n#YINS: Text for Pop Up action.  User to react (Yes/No) \r\nview.Appointment.deleteInstruction=Odstr\\u00E1ni\\u0165 t\\u00FAto sch\\u00F4dzku?\r\n\r\n#XBUT: User to react (positive) to delete action \r\nview.Appointment.deleteYes=OK\r\n\r\n#XFLD: placeholder text for fiels adding external attendees\r\nview.Appointment.attexternaladd=Prida\\u0165 extern\\u00E9ho \\u00FA\\u010Dastn\\u00EDka\r\n\r\n#XFLD: placeholder text for fiels adding internal attendees\r\nview.Appointment.attinternaladd=Prida\\u0165 kolegu\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.fromTimeDate=Od {0} {1}\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.toTimeDate=Do {0} {1}\r\n\r\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\r\nview.Appointment.timeToTime={0} do {1}\r\n\r\n#XFLD: empty appointment list text \r\nview.Appointment.appointment_nodata=\\u017Diadne sch\\u00F4dzky\r\n\r\n#XFLD: employee fullname: {0} firstname {1} lastname\r\nview.Appointment.employeename={0} {1}\r\n\r\n#XTIT: Title for Edit Appointment page\r\nview.Appointment.editappointment=Upravi\\u0165 sch\\u00F4dzku\r\n\r\n#YMSG: Error when end time is before start time (on same day)\r\nview.Appointment.wrongTimes=Koncov\\u00FD \\u010Das je pred po\\u010Diato\\u010Dn\\u00FDm \\u010Dasom\r\n\r\n#YMSG: Error when end date is before start date\r\nview.Appointment.wrongDates=Koncov\\u00FD d\\u00E1tum je pred po\\u010Diato\\u010Dn\\u00FDm d\\u00E1tumom\r\n\r\n#XBUT: Button text for Add Button\r\nview.Appointment.add=Prida\\u0165\r\n\r\n#XTIT: Shell Title of App\r\nview.Appointment.shelltitle=Moje sch\\u00F4dzky\r\n\r\n#XFLD: empty list text for external attendee popup\r\nview.Appointment.noextattendees=\\u017Diadni extern\\u00ED \\u00FA\\u010Dastn\\u00EDci\r\n\r\n#XFLD: empty list text for internal attendee popup\r\nview.Appointment.nointattendees=\\u017Diadni intern\\u00ED \\u00FA\\u010Dastn\\u00EDci\r\n\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Zobrazuj\\u00FA sa len va\\u0161e sch\\u00F4dzky\r\n\r\n#YMSG: info message in case edit page is left with back and data changed\r\nview.Appointment.leaveeditmessage=Ke\\u010F opust\\u00EDte t\\u00FAto str\\u00E1nku, va\\u0161e z\\u00E1znamy sa stratia. Chcete pokra\\u010Dova\\u0165?\r\n\r\n#YMSG: info message in case of wrong format of Start Date\r\nview.Appointment.validStartDate=Zadajte platn\\u00FD po\\u010Diato\\u010Dn\\u00FD d\\u00E1tum\r\n\r\n#YMSG: info message in case of wrong format of End Date\r\nview.Appointment.validEndDate=Zadajte platn\\u00FD koncov\\u00FD d\\u00E1tum\r\n\r\n#YMSG: info message in case of wrong format of Start Date and End Date\r\nview.Appointment.validStartEndDate=Zadajte platn\\u00FD po\\u010Diato\\u010Dn\\u00FD a koncov\\u00FD d\\u00E1tum\r\n\r\n#XTIT: Title for Process type dialog\r\nview.Appointment.process_type=Vybra\\u0165 typ transakcie\r\n\r\n#XFLD: No Data text when loading/searching list\r\nview.Appointment.no_data_text=Aktu\\u00E1lne nie s\\u00FA k dispoz\\u00EDcii \\u017Eiadne polo\\u017Eky\r\n\r\n#XFLD: Transaction Type\r\nview.Appointment.TransactionType=Typ\r\n\r\n#YMSG : PRIVATE appointment message\r\nview.Appointment.privateMessage=Toto je s\\u00FAkromn\\u00E1 sch\\u00F4dzka\r\n\r\n#XFLD: Title for private appointment in shared calendar\r\nview.Appointment.privateAppointment=S\\u00FAkromn\\u00E1 sch\\u00F4dzka\r\n#XTIT: this is the title for the Transaction History Tab\r\nTRANS_HISTORY=Hist\\u00F3ria transakcie\r\n\r\n#XFLD, 30: Field Transaction ID on List\r\nTRANS_ID=ID transakcie\r\n\r\n#XFLD, 30: Field Transaction Type on List\r\nTRANS_TYPE=Typ transakcie\r\n\r\n#XFLD, 30: Field Description on List\r\nTRANS_DESC=Popis\r\n\r\n#XFLD, 30: Field Created On on List\r\nCREATED_ON=Vytvoren\\u00E9 d\\u0148a\r\n\r\n#XFLD, 30: Field Created On on List\r\nRELATIONSHIP=Typ vz\\u0165ahu\r\n\r\n#XFLD, 15: Priority label\r\nview.Appointment.priority=Priorita\r\n\r\n#YMSG, 50:Customizing incomplete\r\nCUSTOMIZING_INCOMPLETE=Ne\\u00FApln\\u00E9 prisp\\u00F4sobenie. Obr\\u00E1\\u0165te sa na spr\\u00E1vcu syst\\u00E9mu.\r\n\r\n#XBUT: Button text to Messages\r\nview.Appointment.messages=Spr\\u00E1vy\r\n\r\n#XGRP: Error message dialog title\r\nview.Appointment.errorMessage=Spr\\u00E1vy ({0})\r\n\r\n#YMSG: contact not assigned to this account\r\n',
	"cus/crm/mycalendar/i18n/i18n_sl.properties":'\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n\r\n#XTIT: Title of App\r\nview.Appointment.apptitle=Termini\r\n\r\n#XTIT: Title of New Appointment screen\r\nview.Appointment.newapptitle=Nov termin\r\n\r\n#XFLD: tooltip  for create new appointment button\r\nview.Appointment.newapptm_tt=Nov termin\r\n\r\n#XTIT: Title of shared calendars\r\nview.Appointment.sharedCalendars=Koledarji v skupni rabi\r\n\r\n#XBUT: Button text of my calendar\r\nview.Appointment.mycalendar=Moj koledar\r\n\r\n#XTIT: Title of infotoolbar \r\nview.Appointment.myTeam=Moji \\u010Dlani tima\r\n\r\n#XTIT: Appointment list description with location,account text and contact text\r\nview.Appointment.furtherDetails={0} | {1} ({2})\r\n\r\n#XTIT: Appointment list description with account text and contact text\r\nview.Appointment.furtherDetailsWithoutLoc={0} ({1})\r\n\r\n#XTIT: Appointment list description with loc  and account text\r\nview.Appointment.furtherDetailsWithoutContact={0} | {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Podatke je spremenil drug uporabnik. Izberite OK za priklic najnovej\\u0161ih podatkov.\r\n#XTIT: Appointment list description without loc and cantact text\r\nview.Appointment.furtherDetailsWithoutContactAndLoc={0}\r\n\r\n#XTIT: Title of Timeline\r\nview.Appointment.Timeline=\\u010Casovna premica\r\n\r\n#XTIT: Title of Calendars\r\nview.Appointment.Calendars=Koledarji\r\n\r\n#XFLD: tooltip for today button\r\nview.Appointment.today_tt=Danes\r\n\r\n#XTIT: Header text of Appointment detail\r\nview.Appointment.detail=Detajli termina\r\n\r\n#XFLD: Account field label\r\nview.Appointment.account=Stranka\r\n\r\n#XFLD: Contact field label\r\nview.Appointment.contact=Kontakt\r\n\r\n#XFLD: Employee Responsible field label\r\nview.Appointment.employeeResponsible=Odgovorni zaposleni\r\n\r\n#XFLD: Time field label\r\nview.Appointment.time=\\u010Cas\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.subject=Naslov\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.title=Naslov\r\n\r\n#XFLD: Label for Start date and time\r\nview.Appointment.startdatetime=Za\\u010Detni datum in \\u010Das\r\n\r\n#XFLD: Label for End date and time\r\nview.Appointment.enddatetime=Kon\\u010Dni datum in \\u010Das\r\n\r\n#XFLD: Label for All day checkbox\r\nview.Appointment.alldayevent=Ves dan\r\n\r\n#YMSG: info message in case appointment occurs in the past\r\nview.Appointment.occurspast=Termin je v preteklosti\r\n\r\n#YMSG: info message in case no title entered\r\nview.Appointment.notitle=Vnesite naslov\r\n\r\n#XFLD: Label for Private checkbox\r\nview.Appointment.private=Privatno\r\n\r\n#XFLD: Location field label\r\nview.Appointment.location=Lokacija\r\n\r\n#XFLD: Importance field label\r\nview.Appointment.importance=Pomembnost\r\n\r\n#XFLD: Active Status field label\r\nview.Appointment.activeStatus=Status\r\n\r\n#XFLD: Notes field label\r\nview.Appointment.notes=Zabele\\u017Eke\r\n\r\n#XFLD: Note field label\r\nview.Appointment.note=Zabele\\u017Eke\r\n\r\n#XFLD: Label for internal attendees\r\nview.Appointment.internal=Interno\r\n\r\n#XFLD: Label for external attendees\r\nview.Appointment.external=Eksterno\r\n\r\n#XGRP: Group header of the section for showing the general data\r\nview.Appointment.generalData=Splo\\u0161ni podatki\r\n\r\n#XGRP: Group header of the section for showing the contact data\r\nview.Appointment.contactData=Kontakt\r\n\r\n#XGRP: Group header of the section for showing the attendees\r\nview.Appointment.attendeeData=Udele\\u017Eenci\r\n\r\n#XGRP: Group header attendees with number\r\nview.Appointment.attendeeDataNumber=Udele\\u017Eenci ({0})\r\n\r\n#XGRP: Group header additional attendees with number\r\nview.Appointment.additionalAttendeeNumber=Dodatni udele\\u017Eenci ({0})\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.detailData=Detajli\r\n\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.appointmentDetail=Termin\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Opportunity=Prilo\\u017Enost\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Task=Naloga\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.attachmentData=Priloge\r\n\r\n#XGRP: Group header attachments with number how many\r\nview.Appointment.attachmentDataNumber=Priloge ({0})\r\n\r\n#XGRP: Group header attachments with request to save the appointment before file upload \r\nview.Appointment.attachmentSaveRequest=Priloge (shrani pred nalaganjem v stre\\u017Enik)\r\n\r\n#XBUT: Button text to Delete\r\nview.Appointment.delete=Brisanje\r\n\r\n#XBUT: Button text to Follow up\r\nview.Appointment.followup=Slede\\u010Da aktivnost\r\n\r\n#YMSG: no transaction types  present\r\nview.Appointment.FOLLOWUPERROR=Ni najdenih tipov transakcij. Preverite svoj backend Customizing.\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.deletesuccess=Termin izbrisan\r\n\r\n#YMSG: successful followup message in message toast\r\nview.Appointment.followupsuccessful=Slede\\u010Di termin shranjen\r\n\r\n#XBUT: Button text to Edit\r\nview.Appointment.edit=Obdelava\r\n\r\n#XBUT: Button text to Done\r\nview.Appointment.done=Zaklju\\u010Deno\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.cancel=Prekinitev\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.ok=OK\r\n\r\n#XBUT: Button text to Create\r\nview.Appointment.create=Kreiranje\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.savesuccess=Termin shranjen\r\n\r\n#XBUT: Button text to SAve\r\nview.Appointment.save=Shranjevanje\r\n\r\n#XBUT: Button text for Day\r\nview.Appointment.day=Dan\r\n\r\n#XBUT: Button text for week\r\nview.Appointment.week=Teden\r\n\r\n#XBUT: Button text for month\r\nview.Appointment.month=Mesec\r\n\r\n#XFLD: loading text for the appointment list\r\nview.Appointment.loaddatatext=Nalaganje poteka ...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.acsea_title=Stranke ({0})\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.acsea_nodata=Stranke niso najdene\r\n\r\n#XFLD: placeholdertext for search fields\r\nview.Appointment.searchfieldplaceholder=Iskanje\r\n\r\n#XFLD: placeholdertext for search busy text\r\nview.Appointment.searchlistinfo=Iskanje ...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.consea_title=Kontakti ({0})\r\n\r\n#XTIT: title of the business card for accounts\r\nview.Appointment.account_title=Stranka\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.employee_title=Zaposleni\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.contact_title=Kontakt\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.consea_nodata=Kontakti niso najdeni\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.empsea_nodata=Zaposleni niso najdeni\r\n\r\n#XTIT: title of internal attendees search popup\r\nview.Appointment.internal_title=Interni udele\\u017Eenci ({0})\r\n\r\n#XTIT: title of external attendees search popup\r\nview.Appointment.external_title=Zunanji udele\\u017Eenci ({0})\r\n\r\n#XTIT: title of internal attendees search popup enhanced with total count\r\nview.Appointment.internal_titlenew=Novi interni udele\\u017Eenci ({0})\r\n\r\n#XTIT: title of external attendees search popup enhanced with total count\r\nview.Appointment.external_titlenew=Novi zunanji udele\\u017Eenci ({0})\r\n\r\n#YMSG: Filtered by info bar text for contact search popup\r\nview.Appointment.filteredby=Filtrirano po\r\n\r\n#YMSG: filter line for cross navigation: Filter by Account \r\nview.Appointment.filteraccount=Filtrirano po strankah\r\n\r\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\r\nview.Appointment.duration.min={0} min\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\r\nview.Appointment.duration.hour={0} h\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.day={0} dan\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.days={0} dni\r\n\r\n#XTIT: Button text to Delete \r\nview.Appointment.deleteTitle=Brisanje\r\n\r\n#YINS: Text for Pop Up action.  User to react (Yes/No) \r\nview.Appointment.deleteInstruction=Brisanje tega termina?\r\n\r\n#XBUT: User to react (positive) to delete action \r\nview.Appointment.deleteYes=OK\r\n\r\n#XFLD: placeholder text for fiels adding external attendees\r\nview.Appointment.attexternaladd=Dodajanje eksternega udele\\u017Eenca\r\n\r\n#XFLD: placeholder text for fiels adding internal attendees\r\nview.Appointment.attinternaladd=Dodajanje sodelavca\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.fromTimeDate=Od {0} {1}\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.toTimeDate=Do {0} {1}\r\n\r\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\r\nview.Appointment.timeToTime={0} do   {1}\r\n\r\n#XFLD: empty appointment list text \r\nview.Appointment.appointment_nodata=Brez terminov\r\n\r\n#XFLD: employee fullname: {0} firstname {1} lastname\r\nview.Appointment.employeename={0} {1}\r\n\r\n#XTIT: Title for Edit Appointment page\r\nview.Appointment.editappointment=Urejanje termina\r\n\r\n#YMSG: Error when end time is before start time (on same day)\r\nview.Appointment.wrongTimes=\\u010Cas konca je pred \\u010Dasom za\\u010Detka\r\n\r\n#YMSG: Error when end date is before start date\r\nview.Appointment.wrongDates=Datum konca je pred datumom za\\u010Detka\r\n\r\n#XBUT: Button text for Add Button\r\nview.Appointment.add=Dodajanje\r\n\r\n#XTIT: Shell Title of App\r\nview.Appointment.shelltitle=Moji termini\r\n\r\n#XFLD: empty list text for external attendee popup\r\nview.Appointment.noextattendees=Brez eksternih udele\\u017Eencev\r\n\r\n#XFLD: empty list text for internal attendee popup\r\nview.Appointment.nointattendees=Brez internih udele\\u017Eencev\r\n\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Prikazani so samo va\\u0161i termini\r\n\r\n#YMSG: info message in case edit page is left with back and data changed\r\nview.Appointment.leaveeditmessage=Va\\u0161i vnosi bodo izgubljeni, \\u010De zapustite to stran. \\u017Delite nadaljevati?\r\n\r\n#YMSG: info message in case of wrong format of Start Date\r\nview.Appointment.validStartDate=Vnesite veljavni datum za\\u010Detka\r\n\r\n#YMSG: info message in case of wrong format of End Date\r\nview.Appointment.validEndDate=Vnesite veljavni datum konca\r\n\r\n#YMSG: info message in case of wrong format of Start Date and End Date\r\nview.Appointment.validStartEndDate=Vnesite veljaven datum za\\u010Detka in datum konca\r\n\r\n#XTIT: Title for Process type dialog\r\nview.Appointment.process_type=Izberite tip transakcije\r\n\r\n#XFLD: No Data text when loading/searching list\r\nview.Appointment.no_data_text=Trenutno ni razpolo\\u017Eljivih postavk\r\n\r\n#XFLD: Transaction Type\r\nview.Appointment.TransactionType=Tip\r\n\r\n#YMSG : PRIVATE appointment message\r\nview.Appointment.privateMessage=To je privatni termin\r\n\r\n#XFLD: Title for private appointment in shared calendar\r\nview.Appointment.privateAppointment=Privatni termin\r\n#XTIT: this is the title for the Transaction History Tab\r\nTRANS_HISTORY=Zgodovina transakcije\r\n\r\n#XFLD, 30: Field Transaction ID on List\r\nTRANS_ID=ID transakcije\r\n\r\n#XFLD, 30: Field Transaction Type on List\r\nTRANS_TYPE=Tip transakcije\r\n\r\n#XFLD, 30: Field Description on List\r\nTRANS_DESC=Opis\r\n\r\n#XFLD, 30: Field Created On on List\r\nCREATED_ON=Kreirano dne\r\n\r\n#XFLD, 30: Field Created On on List\r\nRELATIONSHIP=Tip odnosa\r\n\r\n#XFLD, 15: Priority label\r\nview.Appointment.priority=Prioriteta\r\n\r\n#YMSG, 50:Customizing incomplete\r\nCUSTOMIZING_INCOMPLETE=Nepopoln Customizing. Prosim, obrnite se na svojega administratorja sistema.\r\n\r\n#XBUT: Button text to Messages\r\nview.Appointment.messages=Sporo\\u010Dila\r\n\r\n#XGRP: Error message dialog title\r\nview.Appointment.errorMessage=Sporo\\u010Dila ({0})\r\n\r\n#YMSG: contact not assigned to this account\r\n',
	"cus/crm/mycalendar/i18n/i18n_tr.properties":'\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n\r\n#XTIT: Title of App\r\nview.Appointment.apptitle=Randevular\r\n\r\n#XTIT: Title of New Appointment screen\r\nview.Appointment.newapptitle=Yeni randevu\r\n\r\n#XFLD: tooltip  for create new appointment button\r\nview.Appointment.newapptm_tt=Yeni randevu\r\n\r\n#XTIT: Title of shared calendars\r\nview.Appointment.sharedCalendars=Payla\\u015F\\u0131lan takvimler\r\n\r\n#XBUT: Button text of my calendar\r\nview.Appointment.mycalendar=Takvimim\r\n\r\n#XTIT: Title of infotoolbar \r\nview.Appointment.myTeam=Ekip \\u00FCyelerim\r\n\r\n#XTIT: Appointment list description with location,account text and contact text\r\nview.Appointment.furtherDetails={0} | {1} ({2})\r\n\r\n#XTIT: Appointment list description with account text and contact text\r\nview.Appointment.furtherDetailsWithoutLoc={0} ({1})\r\n\r\n#XTIT: Appointment list description with loc  and account text\r\nview.Appointment.furtherDetailsWithoutContact={0} | {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Veriler ba\\u015Fka kullan\\u0131c\\u0131 taraf\\u0131ndan de\\u011Fi\\u015Ftirildi. En son verileri almak i\\u00E7in Tamam\'\\u0131 se\\u00E7in.\r\n#XTIT: Appointment list description without loc and cantact text\r\nview.Appointment.furtherDetailsWithoutContactAndLoc={0}\r\n\r\n#XTIT: Title of Timeline\r\nview.Appointment.Timeline=Zaman \\u00E7izelgesi\r\n\r\n#XTIT: Title of Calendars\r\nview.Appointment.Calendars=Takvimler\r\n\r\n#XFLD: tooltip for today button\r\nview.Appointment.today_tt=Bug\\u00FCn\r\n\r\n#XTIT: Header text of Appointment detail\r\nview.Appointment.detail=Randevu ayr\\u0131nt\\u0131lar\\u0131\r\n\r\n#XFLD: Account field label\r\nview.Appointment.account=M\\u00FC\\u015Fteri\r\n\r\n#XFLD: Contact field label\r\nview.Appointment.contact=\\u0130lgili ki\\u015Fi\r\n\r\n#XFLD: Employee Responsible field label\r\nview.Appointment.employeeResponsible=Sorumlu \\u00E7al\\u0131\\u015Fan\r\n\r\n#XFLD: Time field label\r\nview.Appointment.time=Saat\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.subject=Ba\\u015Fl\\u0131k\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.title=Ba\\u015Fl\\u0131k\r\n\r\n#XFLD: Label for Start date and time\r\nview.Appointment.startdatetime=Ba\\u015Flang\\u0131\\u00E7 tarihi ve saati\r\n\r\n#XFLD: Label for End date and time\r\nview.Appointment.enddatetime=Biti\\u015F tarihi ve saati\r\n\r\n#XFLD: Label for All day checkbox\r\nview.Appointment.alldayevent=T\\u00FCm g\\u00FCn\r\n\r\n#YMSG: info message in case appointment occurs in the past\r\nview.Appointment.occurspast=Randevu ge\\u00E7mi\\u015Fte yer al\\u0131yor\r\n\r\n#YMSG: info message in case no title entered\r\nview.Appointment.notitle=Ba\\u015Fl\\u0131k gir\r\n\r\n#XFLD: Label for Private checkbox\r\nview.Appointment.private=Ki\\u015Fisel\r\n\r\n#XFLD: Location field label\r\nview.Appointment.location=Yer\r\n\r\n#XFLD: Importance field label\r\nview.Appointment.importance=\\u00D6nem\r\n\r\n#XFLD: Active Status field label\r\nview.Appointment.activeStatus=Durum\r\n\r\n#XFLD: Notes field label\r\nview.Appointment.notes=Notlar\r\n\r\n#XFLD: Note field label\r\nview.Appointment.note=Notlar\r\n\r\n#XFLD: Label for internal attendees\r\nview.Appointment.internal=Dahili\r\n\r\n#XFLD: Label for external attendees\r\nview.Appointment.external=Harici\r\n\r\n#XGRP: Group header of the section for showing the general data\r\nview.Appointment.generalData=Genel veriler\r\n\r\n#XGRP: Group header of the section for showing the contact data\r\nview.Appointment.contactData=\\u0130lgili ki\\u015Fi\r\n\r\n#XGRP: Group header of the section for showing the attendees\r\nview.Appointment.attendeeData=Kat\\u0131lanlar\r\n\r\n#XGRP: Group header attendees with number\r\nview.Appointment.attendeeDataNumber=Kat\\u0131l\\u0131mc\\u0131lar ({0})\r\n\r\n#XGRP: Group header additional attendees with number\r\nview.Appointment.additionalAttendeeNumber=Ek kat\\u0131l\\u0131mc\\u0131lar ({0})\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.detailData=Ayr\\u0131nt\\u0131lar\r\n\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.appointmentDetail=Randevu\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Opportunity=F\\u0131rsat\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Task=G\\u00F6rev\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.attachmentData=Ekler\r\n\r\n#XGRP: Group header attachments with number how many\r\nview.Appointment.attachmentDataNumber=Ekler ({0})\r\n\r\n#XGRP: Group header attachments with request to save the appointment before file upload \r\nview.Appointment.attachmentSaveRequest=Ekler (y\\u00FCklemeden \\u00F6nce kaydet)\r\n\r\n#XBUT: Button text to Delete\r\nview.Appointment.delete=Sil\r\n\r\n#XBUT: Button text to Follow up\r\nview.Appointment.followup=Sonraki i\\u015Flem\r\n\r\n#YMSG: no transaction types  present\r\nview.Appointment.FOLLOWUPERROR=\\u0130\\u015Flem t\\u00FCr\\u00FC bulunamad\\u0131. Arka u\\u00E7 uyarlaman\\u0131z\\u0131 kontrol edin.\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.deletesuccess=Randevu silindi\r\n\r\n#YMSG: successful followup message in message toast\r\nview.Appointment.followupsuccessful=Sonraki randevu kaydedildi\r\n\r\n#XBUT: Button text to Edit\r\nview.Appointment.edit=D\\u00FCzenle\r\n\r\n#XBUT: Button text to Done\r\nview.Appointment.done=Tamam\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.cancel=\\u0130ptal\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.ok=Tamam\r\n\r\n#XBUT: Button text to Create\r\nview.Appointment.create=Olu\\u015Ftur\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.savesuccess=Randevu kaydedildi\r\n\r\n#XBUT: Button text to SAve\r\nview.Appointment.save=Kaydet\r\n\r\n#XBUT: Button text for Day\r\nview.Appointment.day=G\\u00FCn\r\n\r\n#XBUT: Button text for week\r\nview.Appointment.week=Hafta\r\n\r\n#XBUT: Button text for month\r\nview.Appointment.month=Ay\r\n\r\n#XFLD: loading text for the appointment list\r\nview.Appointment.loaddatatext=Y\\u00FCkleniyor...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.acsea_title=M\\u00FC\\u015Fteriler ({0})\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.acsea_nodata=Hesap bulunamad\\u0131\r\n\r\n#XFLD: placeholdertext for search fields\r\nview.Appointment.searchfieldplaceholder=Ara\r\n\r\n#XFLD: placeholdertext for search busy text\r\nview.Appointment.searchlistinfo=Aran\\u0131yor...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.consea_title=\\u0130lgili ki\\u015Filer ({0})\r\n\r\n#XTIT: title of the business card for accounts\r\nview.Appointment.account_title=M\\u00FC\\u015Fteri\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.employee_title=\\u00C7al\\u0131\\u015Fan\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.contact_title=\\u0130lgili ki\\u015Fi\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.consea_nodata=\\u0130lgili ki\\u015Fi bulunamad\\u0131\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.empsea_nodata=\\u00C7al\\u0131\\u015Fan bulunamad\\u0131\r\n\r\n#XTIT: title of internal attendees search popup\r\nview.Appointment.internal_title=Dahili kat\\u0131l\\u0131mc\\u0131lar ({0})\r\n\r\n#XTIT: title of external attendees search popup\r\nview.Appointment.external_title=Harici kat\\u0131l\\u0131mc\\u0131lar ({0})\r\n\r\n#XTIT: title of internal attendees search popup enhanced with total count\r\nview.Appointment.internal_titlenew=Yeni dahili kat\\u0131l\\u0131mc\\u0131lar ({0})\r\n\r\n#XTIT: title of external attendees search popup enhanced with total count\r\nview.Appointment.external_titlenew=Yeni harici kat\\u0131l\\u0131mc\\u0131lar ({0})\r\n\r\n#YMSG: Filtered by info bar text for contact search popup\r\nview.Appointment.filteredby=Filtreleme \\u00F6l\\u00E7\\u00FCt\\u00FC\r\n\r\n#YMSG: filter line for cross navigation: Filter by Account \r\nview.Appointment.filteraccount=M\\u00FC\\u015Fteriye g\\u00F6re filtrelendi\r\n\r\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\r\nview.Appointment.duration.min={0} dak\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\r\nview.Appointment.duration.hour={0} s\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.day={0} g\\u00FCn\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.days={0} g\\u00FCn\r\n\r\n#XTIT: Button text to Delete \r\nview.Appointment.deleteTitle=Sil\r\n\r\n#YINS: Text for Pop Up action.  User to react (Yes/No) \r\nview.Appointment.deleteInstruction=Bu randevuyu sil?\r\n\r\n#XBUT: User to react (positive) to delete action \r\nview.Appointment.deleteYes=Tamam\r\n\r\n#XFLD: placeholder text for fiels adding external attendees\r\nview.Appointment.attexternaladd=Harici kat\\u0131l\\u0131mc\\u0131 ekle\r\n\r\n#XFLD: placeholder text for fiels adding internal attendees\r\nview.Appointment.attinternaladd=\\u0130\\u015F arkada\\u015F\\u0131 ekle\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.fromTimeDate=Ba\\u015Flang\\u0131\\u00E7 {0} {1}\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.toTimeDate=Biti\\u015F {0} {1}\r\n\r\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\r\nview.Appointment.timeToTime={0} Biti\\u015F {1}\r\n\r\n#XFLD: empty appointment list text \r\nview.Appointment.appointment_nodata=Randevu yok\r\n\r\n#XFLD: employee fullname: {0} firstname {1} lastname\r\nview.Appointment.employeename={0} {1}\r\n\r\n#XTIT: Title for Edit Appointment page\r\nview.Appointment.editappointment=Randevuyu d\\u00FCzenle\r\n\r\n#YMSG: Error when end time is before start time (on same day)\r\nview.Appointment.wrongTimes=Biti\\u015F zaman\\u0131 ba\\u015Flang\\u0131\\u00E7 zaman\\u0131ndan \\u00F6nce\r\n\r\n#YMSG: Error when end date is before start date\r\nview.Appointment.wrongDates=Biti\\u015F tarihi ba\\u015Flang\\u0131\\u00E7 tarihinden \\u00F6nce\r\n\r\n#XBUT: Button text for Add Button\r\nview.Appointment.add=Ekle\r\n\r\n#XTIT: Shell Title of App\r\nview.Appointment.shelltitle=Randevular\\u0131m\r\n\r\n#XFLD: empty list text for external attendee popup\r\nview.Appointment.noextattendees=Harici kat\\u0131l\\u0131mc\\u0131 yok\r\n\r\n#XFLD: empty list text for internal attendee popup\r\nview.Appointment.nointattendees=Dahili kat\\u0131l\\u0131mc\\u0131 yok\r\n\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=Yaln\\u0131z randevular\\u0131n\\u0131z g\\u00F6r\\u00FCnt\\u00FCleniyor\r\n\r\n#YMSG: info message in case edit page is left with back and data changed\r\nview.Appointment.leaveeditmessage=Bu sayfadan \\u00E7\\u0131karsan\\u0131z giri\\u015Fleriniz kaybolacak. Devam etmek istiyor musunuz?\r\n\r\n#YMSG: info message in case of wrong format of Start Date\r\nview.Appointment.validStartDate=Ge\\u00E7erli ba\\u015Flang\\u0131\\u00E7 tarihi girin\r\n\r\n#YMSG: info message in case of wrong format of End Date\r\nview.Appointment.validEndDate=Ge\\u00E7erli biti\\u015F tarihi girin\r\n\r\n#YMSG: info message in case of wrong format of Start Date and End Date\r\nview.Appointment.validStartEndDate=Ge\\u00E7erli ba\\u015Flang\\u0131\\u00E7 tarihi ve biti\\u015F tarihi girin\r\n\r\n#XTIT: Title for Process type dialog\r\nview.Appointment.process_type=\\u0130\\u015Flem t\\u00FCr\\u00FC se\\u00E7\r\n\r\n#XFLD: No Data text when loading/searching list\r\nview.Appointment.no_data_text=\\u015Eu anda kalem yok\r\n\r\n#XFLD: Transaction Type\r\nview.Appointment.TransactionType=T\\u00FCr\r\n\r\n#YMSG : PRIVATE appointment message\r\nview.Appointment.privateMessage=Bu \\u00F6zel randevudur\r\n\r\n#XFLD: Title for private appointment in shared calendar\r\nview.Appointment.privateAppointment=\\u00D6zel randevu\r\n#XTIT: this is the title for the Transaction History Tab\r\nTRANS_HISTORY=\\u0130\\u015Flem ge\\u00E7mi\\u015Fi\r\n\r\n#XFLD, 30: Field Transaction ID on List\r\nTRANS_ID=\\u0130\\u015Flem tan\\u0131t\\u0131c\\u0131s\\u0131\r\n\r\n#XFLD, 30: Field Transaction Type on List\r\nTRANS_TYPE=\\u0130\\u015Flem t\\u00FCr\\u00FC\r\n\r\n#XFLD, 30: Field Description on List\r\nTRANS_DESC=Tan\\u0131m\r\n\r\n#XFLD, 30: Field Created On on List\r\nCREATED_ON=Olu\\u015Fturma tarihi\r\n\r\n#XFLD, 30: Field Created On on List\r\nRELATIONSHIP=\\u0130li\\u015Fki t\\u00FCr\\u00FC\r\n\r\n#XFLD, 15: Priority label\r\nview.Appointment.priority=\\u00D6ncelik\r\n\r\n#YMSG, 50:Customizing incomplete\r\nCUSTOMIZING_INCOMPLETE=Uyarlama tamamlanmad\\u0131. Sistem y\\u00F6neticinizle irtibata ge\\u00E7in.\r\n\r\n#XBUT: Button text to Messages\r\nview.Appointment.messages=\\u0130letiler\r\n\r\n#XGRP: Error message dialog title\r\nview.Appointment.errorMessage=\\u0130letiler ({0})\r\n\r\n#YMSG: contact not assigned to this account\r\n',
	"cus/crm/mycalendar/i18n/i18n_zh_CN.properties":'\r\n#_YMSG Message other than an instruction \r\n#_YINS Instruction for a user \r\n#_XTOL Explanatory text for an UI element, such as a tooltip \r\n#_XFLD Label for a component other than buttons and titles; sample components: column heading \r\n#_XBUT Button \r\n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \r\n#_XLST Item in an enumeration, such as a list or a drop-down list \r\n#_XTIT Title or caption \r\n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \r\n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \r\n#_XLNK Hyperlink \r\n#_XGRP Group header or table section header \r\n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \r\n\r\n\r\n#XTIT: Title of App\r\nview.Appointment.apptitle=\\u9884\\u7EA6\r\n\r\n#XTIT: Title of New Appointment screen\r\nview.Appointment.newapptitle=\\u65B0\\u5EFA\\u9884\\u7EA6\r\n\r\n#XFLD: tooltip  for create new appointment button\r\nview.Appointment.newapptm_tt=\\u65B0\\u5EFA\\u9884\\u7EA6\r\n\r\n#XTIT: Title of shared calendars\r\nview.Appointment.sharedCalendars=\\u5171\\u4EAB\\u65E5\\u5386\r\n\r\n#XBUT: Button text of my calendar\r\nview.Appointment.mycalendar=\\u6211\\u7684\\u65E5\\u5386\r\n\r\n#XTIT: Title of infotoolbar \r\nview.Appointment.myTeam=\\u6211\\u7684\\u56E2\\u961F\\u6210\\u5458\r\n\r\n#XTIT: Appointment list description with location,account text and contact text\r\nview.Appointment.furtherDetails={0} | {1} ({2})\r\n\r\n#XTIT: Appointment list description with account text and contact text\r\nview.Appointment.furtherDetailsWithoutLoc={0} ({1})\r\n\r\n#XTIT: Appointment list description with loc  and account text\r\nview.Appointment.furtherDetailsWithoutContact={0} | {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=\\u5176\\u4ED6\\u7528\\u6237\\u5DF2\\u66F4\\u6539\\u6570\\u636E\\u3002\\u8BF7\\u9009\\u62E9\\u201C\\u786E\\u5B9A\\u201D\\u83B7\\u53D6\\u6700\\u65B0\\u6570\\u636E\\u3002\r\n#XTIT: Appointment list description without loc and cantact text\r\nview.Appointment.furtherDetailsWithoutContactAndLoc={0}\r\n\r\n#XTIT: Title of Timeline\r\nview.Appointment.Timeline=\\u65F6\\u95F4\\u8868\r\n\r\n#XTIT: Title of Calendars\r\nview.Appointment.Calendars=\\u65E5\\u5386\r\n\r\n#XFLD: tooltip for today button\r\nview.Appointment.today_tt=\\u4ECA\\u5929\r\n\r\n#XTIT: Header text of Appointment detail\r\nview.Appointment.detail=\\u9884\\u7EA6\\u8BE6\\u7EC6\\u4FE1\\u606F\r\n\r\n#XFLD: Account field label\r\nview.Appointment.account=\\u5BA2\\u6237\r\n\r\n#XFLD: Contact field label\r\nview.Appointment.contact=\\u8054\\u7CFB\\u4EBA\r\n\r\n#XFLD: Employee Responsible field label\r\nview.Appointment.employeeResponsible=\\u8D1F\\u8D23\\u4EBA\r\n\r\n#XFLD: Time field label\r\nview.Appointment.time=\\u65F6\\u95F4\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.subject=\\u6807\\u9898\r\n\r\n#XFLD: Description field label Subject / description / title\r\nview.Appointment.title=\\u6807\\u9898\r\n\r\n#XFLD: Label for Start date and time\r\nview.Appointment.startdatetime=\\u5F00\\u59CB\\u65E5\\u671F\\u548C\\u65F6\\u95F4\r\n\r\n#XFLD: Label for End date and time\r\nview.Appointment.enddatetime=\\u7ED3\\u675F\\u65E5\\u671F\\u548C\\u65F6\\u95F4\r\n\r\n#XFLD: Label for All day checkbox\r\nview.Appointment.alldayevent=\\u5168\\u5929\r\n\r\n#YMSG: info message in case appointment occurs in the past\r\nview.Appointment.occurspast=\\u9884\\u7EA6\\u53D1\\u751F\\u5728\\u8FC7\\u53BB\r\n\r\n#YMSG: info message in case no title entered\r\nview.Appointment.notitle=\\u8F93\\u5165\\u6807\\u9898\r\n\r\n#XFLD: Label for Private checkbox\r\nview.Appointment.private=\\u79C1\\u4EBA\r\n\r\n#XFLD: Location field label\r\nview.Appointment.location=\\u5730\\u70B9\r\n\r\n#XFLD: Importance field label\r\nview.Appointment.importance=\\u91CD\\u8981\\u6027\r\n\r\n#XFLD: Active Status field label\r\nview.Appointment.activeStatus=\\u72B6\\u6001\r\n\r\n#XFLD: Notes field label\r\nview.Appointment.notes=\\u6CE8\\u91CA\r\n\r\n#XFLD: Note field label\r\nview.Appointment.note=\\u6CE8\\u91CA\r\n\r\n#XFLD: Label for internal attendees\r\nview.Appointment.internal=\\u5185\\u90E8\r\n\r\n#XFLD: Label for external attendees\r\nview.Appointment.external=\\u5916\\u90E8\r\n\r\n#XGRP: Group header of the section for showing the general data\r\nview.Appointment.generalData=\\u5E38\\u89C4\\u6570\\u636E\r\n\r\n#XGRP: Group header of the section for showing the contact data\r\nview.Appointment.contactData=\\u8054\\u7CFB\\u4EBA\r\n\r\n#XGRP: Group header of the section for showing the attendees\r\nview.Appointment.attendeeData=\\u53C2\\u4E0E\\u4EBA\r\n\r\n#XGRP: Group header attendees with number\r\nview.Appointment.attendeeDataNumber=\\u53C2\\u4E0E\\u4EBA ({0})\r\n\r\n#XGRP: Group header additional attendees with number\r\nview.Appointment.additionalAttendeeNumber=\\u9644\\u52A0\\u53C2\\u4E0E\\u4EBA ({0})\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.detailData=\\u8BE6\\u7EC6\\u4FE1\\u606F\r\n\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.appointmentDetail=\\u9884\\u7EA6\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Opportunity=\\u673A\\u4F1A\r\n#XTIT: Group header of the section for showing the details\r\nview.Appointment.Task=\\u4EFB\\u52A1\r\n\r\n#XGRP: Group header of the section for showing the details\r\nview.Appointment.attachmentData=\\u9644\\u4EF6\r\n\r\n#XGRP: Group header attachments with number how many\r\nview.Appointment.attachmentDataNumber=\\u9644\\u4EF6 ({0})\r\n\r\n#XGRP: Group header attachments with request to save the appointment before file upload \r\nview.Appointment.attachmentSaveRequest=\\u9644\\u4EF6\\uFF08\\u4E0A\\u4F20\\u9644\\u4EF6\\u524D\\u5148\\u4FDD\\u5B58\\uFF09\r\n\r\n#XBUT: Button text to Delete\r\nview.Appointment.delete=\\u5220\\u9664\r\n\r\n#XBUT: Button text to Follow up\r\nview.Appointment.followup=\\u8DDF\\u8FDB\r\n\r\n#YMSG: no transaction types  present\r\nview.Appointment.FOLLOWUPERROR=\\u672A\\u627E\\u5230\\u4E8B\\u52A1\\u7C7B\\u578B\\u3002\\u8BF7\\u68C0\\u67E5\\u540E\\u7AEF\\u5B9A\\u5236\\u3002\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.deletesuccess=\\u5DF2\\u5220\\u9664\\u9884\\u7EA6\r\n\r\n#YMSG: successful followup message in message toast\r\nview.Appointment.followupsuccessful=\\u8DDF\\u8FDB\\u9884\\u7EA6\\u5DF2\\u4FDD\\u5B58\r\n\r\n#XBUT: Button text to Edit\r\nview.Appointment.edit=\\u7F16\\u8F91\r\n\r\n#XBUT: Button text to Done\r\nview.Appointment.done=\\u5B8C\\u6210\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.cancel=\\u53D6\\u6D88\r\n\r\n#XBUT: Button text to Cancel\r\nview.Appointment.ok=\\u786E\\u5B9A\r\n\r\n#XBUT: Button text to Create\r\nview.Appointment.create=\\u521B\\u5EFA\r\n\r\n#YMSG: success save message in message toast\r\nview.Appointment.savesuccess=\\u5DF2\\u4FDD\\u5B58\\u9884\\u7EA6\r\n\r\n#XBUT: Button text to SAve\r\nview.Appointment.save=\\u4FDD\\u5B58\r\n\r\n#XBUT: Button text for Day\r\nview.Appointment.day=\\u5929\r\n\r\n#XBUT: Button text for week\r\nview.Appointment.week=\\u5468\r\n\r\n#XBUT: Button text for month\r\nview.Appointment.month=\\u6708\r\n\r\n#XFLD: loading text for the appointment list\r\nview.Appointment.loaddatatext=\\u6B63\\u5728\\u52A0\\u8F7D...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.acsea_title=\\u5BA2\\u6237 ({0})\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.acsea_nodata=\\u672A\\u627E\\u5230\\u5BA2\\u6237\r\n\r\n#XFLD: placeholdertext for search fields\r\nview.Appointment.searchfieldplaceholder=\\u641C\\u7D22\r\n\r\n#XFLD: placeholdertext for search busy text\r\nview.Appointment.searchlistinfo=\\u6B63\\u5728\\u641C\\u7D22...\r\n\r\n#XTIT: title of account search popup enhanced with total count\r\nview.Appointment.consea_title=\\u8054\\u7CFB\\u4EBA ({0})\r\n\r\n#XTIT: title of the business card for accounts\r\nview.Appointment.account_title=\\u5BA2\\u6237\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.employee_title=\\u5458\\u5DE5\r\n\r\n#XTIT: title of the business card for employee\r\nview.Appointment.contact_title=\\u8054\\u7CFB\\u4EBA\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.consea_nodata=\\u672A\\u627E\\u5230\\u8054\\u7CFB\\u4EBA\r\n\r\n#XFLD: empty list text for account search popup\r\nview.Appointment.empsea_nodata=\\u672A\\u627E\\u5230\\u5458\\u5DE5\r\n\r\n#XTIT: title of internal attendees search popup\r\nview.Appointment.internal_title=\\u5185\\u90E8\\u53C2\\u4E0E\\u4EBA ({0})\r\n\r\n#XTIT: title of external attendees search popup\r\nview.Appointment.external_title=\\u5916\\u90E8\\u53C2\\u4E0E\\u4EBA ({0})\r\n\r\n#XTIT: title of internal attendees search popup enhanced with total count\r\nview.Appointment.internal_titlenew=\\u65B0\\u5185\\u90E8\\u53C2\\u4E0E\\u4EBA ({0})\r\n\r\n#XTIT: title of external attendees search popup enhanced with total count\r\nview.Appointment.external_titlenew=\\u65B0\\u5916\\u90E8\\u53C2\\u4E0E\\u4EBA ({0})\r\n\r\n#YMSG: Filtered by info bar text for contact search popup\r\nview.Appointment.filteredby=\\u7B5B\\u9009\\u6761\\u4EF6\r\n\r\n#YMSG: filter line for cross navigation: Filter by Account \r\nview.Appointment.filteraccount=\\u6309\\u5BA2\\u6237\\u7B5B\\u9009\r\n\r\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\r\nview.Appointment.duration.min={0} \\u5206\\u949F\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\r\nview.Appointment.duration.hour={0} \\u5C0F\\u65F6\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.day={0} \\u5929\r\n\r\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\r\nview.Appointment.duration.days={0} \\u5929\r\n\r\n#XTIT: Button text to Delete \r\nview.Appointment.deleteTitle=\\u5220\\u9664\r\n\r\n#YINS: Text for Pop Up action.  User to react (Yes/No) \r\nview.Appointment.deleteInstruction=\\u662F\\u5426\\u5220\\u9664\\u6B64\\u9884\\u7EA6\\uFF1F\r\n\r\n#XBUT: User to react (positive) to delete action \r\nview.Appointment.deleteYes=\\u786E\\u5B9A\r\n\r\n#XFLD: placeholder text for fiels adding external attendees\r\nview.Appointment.attexternaladd=\\u6DFB\\u52A0\\u5916\\u90E8\\u53C2\\u4E0E\\u4EBA\r\n\r\n#XFLD: placeholder text for fiels adding internal attendees\r\nview.Appointment.attinternaladd=\\u6DFB\\u52A0\\u540C\\u4E8B\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.fromTimeDate=\\u4ECE {0} {1}\r\n\r\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\r\nview.Appointment.toTimeDate=\\u5230 {0} {1}\r\n\r\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\r\nview.Appointment.timeToTime={0} \\u5230 {1}\r\n\r\n#XFLD: empty appointment list text \r\nview.Appointment.appointment_nodata=\\u65E0\\u9884\\u7EA6\r\n\r\n#XFLD: employee fullname: {0} firstname {1} lastname\r\nview.Appointment.employeename={0} {1}\r\n\r\n#XTIT: Title for Edit Appointment page\r\nview.Appointment.editappointment=\\u7F16\\u8F91\\u9884\\u7EA6\r\n\r\n#YMSG: Error when end time is before start time (on same day)\r\nview.Appointment.wrongTimes=\\u7ED3\\u675F\\u65F6\\u95F4\\u5728\\u5F00\\u59CB\\u65F6\\u95F4\\u4E4B\\u524D\r\n\r\n#YMSG: Error when end date is before start date\r\nview.Appointment.wrongDates=\\u7ED3\\u675F\\u65E5\\u671F\\u5728\\u5F00\\u59CB\\u65E5\\u671F\\u4E4B\\u524D\r\n\r\n#XBUT: Button text for Add Button\r\nview.Appointment.add=\\u6DFB\\u52A0\r\n\r\n#XTIT: Shell Title of App\r\nview.Appointment.shelltitle=\\u6211\\u7684\\u9884\\u7EA6\r\n\r\n#XFLD: empty list text for external attendee popup\r\nview.Appointment.noextattendees=\\u65E0\\u5916\\u90E8\\u53C2\\u4E0E\\u4EBA\r\n\r\n#XFLD: empty list text for internal attendee popup\r\nview.Appointment.nointattendees=\\u65E0\\u5185\\u90E8\\u53C2\\u4E0E\\u4EBA\r\n\r\n# XFLD: Only your tasks are displayed\r\nLIST_FILTERED_BY_MYITEMS=\\u4EC5\\u663E\\u793A\\u60A8\\u7684\\u9884\\u7EA6\r\n\r\n#YMSG: info message in case edit page is left with back and data changed\r\nview.Appointment.leaveeditmessage=\\u5982\\u679C\\u79BB\\u5F00\\u6B64\\u9875\\u9762\\uFF0C\\u8F93\\u5165\\u5185\\u5BB9\\u5C06\\u4E22\\u5931\\u3002\\u662F\\u5426\\u7EE7\\u7EED\\uFF1F\r\n\r\n#YMSG: info message in case of wrong format of Start Date\r\nview.Appointment.validStartDate=\\u8F93\\u5165\\u6709\\u6548\\u7684\\u5F00\\u59CB\\u65E5\\u671F\r\n\r\n#YMSG: info message in case of wrong format of End Date\r\nview.Appointment.validEndDate=\\u8F93\\u5165\\u6709\\u6548\\u7684\\u7ED3\\u675F\\u65E5\\u671F\r\n\r\n#YMSG: info message in case of wrong format of Start Date and End Date\r\nview.Appointment.validStartEndDate=\\u8F93\\u5165\\u6709\\u6548\\u7684\\u5F00\\u59CB\\u65E5\\u671F\\u548C\\u7ED3\\u675F\\u65E5\\u671F\r\n\r\n#XTIT: Title for Process type dialog\r\nview.Appointment.process_type=\\u9009\\u62E9\\u4EA4\\u6613\\u7C7B\\u578B\r\n\r\n#XFLD: No Data text when loading/searching list\r\nview.Appointment.no_data_text=\\u5F53\\u524D\\u65E0\\u53EF\\u7528\\u9879\\u76EE\r\n\r\n#XFLD: Transaction Type\r\nview.Appointment.TransactionType=\\u7C7B\\u578B\r\n\r\n#YMSG : PRIVATE appointment message\r\nview.Appointment.privateMessage=\\u8FD9\\u662F\\u4E00\\u9879\\u79C1\\u4EBA\\u9884\\u7EA6\r\n\r\n#XFLD: Title for private appointment in shared calendar\r\nview.Appointment.privateAppointment=\\u79C1\\u4EBA\\u9884\\u7EA6\r\n#XTIT: this is the title for the Transaction History Tab\r\nTRANS_HISTORY=\\u4EA4\\u6613\\u5386\\u53F2\\u8BB0\\u5F55\r\n\r\n#XFLD, 30: Field Transaction ID on List\r\nTRANS_ID=\\u4EA4\\u6613\\u6807\\u8BC6\r\n\r\n#XFLD, 30: Field Transaction Type on List\r\nTRANS_TYPE=\\u4EA4\\u6613\\u7C7B\\u578B\r\n\r\n#XFLD, 30: Field Description on List\r\nTRANS_DESC=\\u63CF\\u8FF0\r\n\r\n#XFLD, 30: Field Created On on List\r\nCREATED_ON=\\u521B\\u5EFA\\u65E5\\u671F\r\n\r\n#XFLD, 30: Field Created On on List\r\nRELATIONSHIP=\\u5173\\u7CFB\\u7C7B\\u578B\r\n\r\n#XFLD, 15: Priority label\r\nview.Appointment.priority=\\u4F18\\u5148\\u7EA7\r\n\r\n#YMSG, 50:Customizing incomplete\r\nCUSTOMIZING_INCOMPLETE=\\u5B9A\\u5236\\u4E0D\\u5B8C\\u6574\\u3002\\u8BF7\\u8054\\u7CFB\\u7CFB\\u7EDF\\u7BA1\\u7406\\u5458\\u3002\r\n\r\n#XBUT: Button text to Messages\r\nview.Appointment.messages=\\u6D88\\u606F\r\n\r\n#XGRP: Error message dialog title\r\nview.Appointment.errorMessage=\\u6D88\\u606F ({0})\r\n\r\n#YMSG: contact not assigned to this account\r\n',
	"cus/crm/mycalendar/i18n/i18n_zh_CN_.properties":'\n#_YMSG Message other than an instruction \n#_YINS Instruction for a user \n#_XTOL Explanatory text for an UI element, such as a tooltip \n#_XFLD Label for a component other than buttons and titles; sample components: column heading \n#_XBUT Button \n#_XMIT Menu item, either top-level like "File" or lower-level like "Save as..." \n#_XLST Item in an enumeration, such as a list or a drop-down list \n#_XTIT Title or caption \n#_XACT Text with explicit importance for accessibility (sounds like cross-classification since, \n#for example, and "alt" text for a HTML-related image may be an "explanation" with special relevance for accessibility) \n#_XLNK Hyperlink \n#_XGRP Group header or table section header \n#_XSEL Value such as a status.  For example: "In Process", "Shipped" or "Open" \n\n\n#XTIT: Title of App\nview.Appointment.apptitle=\\u9884\\u7EA6\n\n#XTIT: Title of New Appointment screen\nview.Appointment.newapptitle=\\u65B0\\u5EFA\\u9884\\u7EA6\n\n#XFLD: tooltip for create new appointment butten\nview.Appointment.newapptm_tt=\\u65B0\\u5EFA\\u9884\\u7EA6\n\n#XFLD: tooltip for today button\nview.Appointment.today_tt=\\u4ECA\\u5929\n\n#XTIT: Header text of Appointment detail\nview.Appointment.detail=\\u9884\\u7EA6\\u8BE6\\u7EC6\\u4FE1\\u606F\n\n#XFLD: Account field label\nview.Appointment.account=\\u5BA2\\u6237\n\n#XFLD: Contact field label\nview.Appointment.contact=\\u8054\\u7CFB\\u4EBA\n\n#XFLD: Employee Responsible field label\nview.Appointment.employeeResponsible=\\u8D1F\\u8D23\\u4EBA\n\n#XFLD: Time field label\nview.Appointment.time=\\u65F6\\u95F4\n\n#XFLD: Description field label Subject / description / title\nview.Appointment.subject=\\u6807\\u9898\n\n#XFLD: Description field label Subject / description / title\nview.Appointment.title=\\u6807\\u9898\n\n#XFLD: Label for Start date and time\nview.Appointment.startdatetime=\\u5F00\\u59CB\\u65E5\\u671F\\u548C\\u65F6\\u95F4\n\n#XFLD: Label for End date and time\nview.Appointment.enddatetime=\\u7ED3\\u675F\\u65E5\\u671F\\u548C\\u65F6\\u95F4\n\n#XFLD: Label for All day checkbox\nview.Appointment.alldayevent=\\u5168\\u5929\n\n#YMSG: info message in case appointment occurs in the past\nview.Appointment.occurspast=\\u9884\\u7EA6\\u53D1\\u751F\\u5728\\u8FC7\\u53BB\n\n#YMSG: info message in case no title entered\nview.Appointment.notitle=\\u8F93\\u5165\\u6807\\u9898\n\n#XFLD: Label for Private checkbox\nview.Appointment.private=\\u79C1\\u4EBA\n\n#XFLD: Location field label\nview.Appointment.location=\\u5730\\u70B9\n\n#XFLD: Importance field label\nview.Appointment.importance=\\u91CD\\u8981\\u6027\n\n#XFLD: Active Status field label\nview.Appointment.activeStatus=\\u72B6\\u6001\n\n#XFLD: Notes field label\nview.Appointment.notes=\\u6CE8\\u91CA\n\n#XFLD: Note field label\nview.Appointment.note=\\u6CE8\\u91CA\n\n#XFLD: Label for internal attendees\nview.Appointment.internal=\\u5185\\u90E8\n\n#XFLD: Label for external attendees\nview.Appointment.external=\\u5916\\u90E8\n\n#XGRP: Group header of the section for showing the general data\nview.Appointment.generalData=\\u5E38\\u89C4\\u6570\\u636E\n\n#XGRP: Group header of the section for showing the contact data\nview.Appointment.contactData=\\u8054\\u7CFB\\u4EBA\n\n#XGRP: Group header of the section for showing the attendees\nview.Appointment.attendeeData=\\u53C2\\u4E0E\\u4EBA\n\n#XGRP: Group header attendees with number\nview.Appointment.attendeeDataNumber=\\u53C2\\u4E0E\\u4EBA ({0})\n\n#XGRP: Group header additional attendees with number\nview.Appointment.additionalAttendeeNumber=\\u9644\\u52A0\\u53C2\\u4E0E\\u4EBA ({0})\n\n#XGRP: Group header of the section for showing the details\nview.Appointment.detailData=\\u8BE6\\u7EC6\\u4FE1\\u606F\n\n#XTIT: Group header of the section for showing the details\nview.Appointment.appointmentDetail=\\u9884\\u7EA6\n\n#XGRP: Group header of the section for showing the details\nview.Appointment.attachmentData=\\u9644\\u4EF6\n\n#XGRP: Group header attachments with number how many\nview.Appointment.attachmentDataNumber=\\u9644\\u4EF6 ({0})\n\n#XGRP: Group header attachments with request to save the appointment before file upload \nview.Appointment.attachmentSaveRequest=\\u9644\\u4EF6\\uFF08\\u4E0A\\u4F20\\u9644\\u4EF6\\u524D\\u5148\\u4FDD\\u5B58\\uFF09\n\n#XBUT: Button text to Delete\nview.Appointment.delete=\\u5220\\u9664\n\n#YMSG: success save message in message toast\nview.Appointment.deletesuccess=\\u5DF2\\u5220\\u9664\\u9884\\u7EA6\n\n#XBUT: Button text to Edit\nview.Appointment.edit=\\u7F16\\u8F91\n\n#XBUT: Button text to Done\nview.Appointment.done=\\u5B8C\\u6210\n\n#XBUT: Button text to Cancel\nview.Appointment.cancel=\\u53D6\\u6D88\n\n#XBUT: Button text to Cancel\nview.Appointment.ok=\\u786E\\u5B9A\n\n#XBUT: Button text to Create\nview.Appointment.create=\\u521B\\u5EFA\n\n#YMSG: success save message in message toast\nview.Appointment.savesuccess=\\u5DF2\\u4FDD\\u5B58\\u9884\\u7EA6\n\n#XBUT: Button text to SAve\nview.Appointment.save=\\u4FDD\\u5B58\n\n#XBUT: Button text for Day\nview.Appointment.day=\\u5929\n\n#XBUT: Button text for week\nview.Appointment.week=\\u5468\n\n#XBUT: Button text for month\nview.Appointment.month=\\u6708\n\n#XFLD: loading text for the appointment list\nview.Appointment.loaddatatext=\\u52A0\\u8F7D\\u4E2D...\n\n#XTIT: title of account search popup enhanced with total count\nview.Appointment.acsea_title=\\u5BA2\\u6237 ({0})\n\n#XFLD: empty list text for account search popup\nview.Appointment.acsea_nodata=\\u672A\\u627E\\u5230\\u5BA2\\u6237\n\n#XFLD: placeholdertext for search fields\nview.Appointment.searchfieldplaceholder=\\u641C\\u7D22\n\n#XFLD: placeholdertext for search busy text\nview.Appointment.searchlistinfo=\\u6B63\\u5728\\u641C\\u7D22...\n\n#XTIT: title of account search popup enhanced with total count\nview.Appointment.consea_title=\\u8054\\u7CFB\\u4EBA ({0})\n\n#XTIT: title of the business card for accounts\nview.Appointment.account_title=\\u5BA2\\u6237\n\n#XTIT: title of the business card for employee\nview.Appointment.employee_title=\\u5458\\u5DE5\n\n#XTIT: title of the business card for employee\nview.Appointment.contact_title=\\u8054\\u7CFB\\u4EBA\n\n#XFLD: empty list text for account search popup\nview.Appointment.consea_nodata=\\u672A\\u627E\\u5230\\u8054\\u7CFB\\u4EBA\n\n#XFLD: empty list text for account search popup\nview.Appointment.empsea_nodata=\\u672A\\u627E\\u5230\\u5458\\u5DE5\n\n#XTIT: title of internal attendees search popup\nview.Appointment.internal_title=\\u5185\\u90E8\\u53C2\\u4E0E\\u4EBA ({0})\n\n#XTIT: title of external attendees search popup\nview.Appointment.external_title=\\u5916\\u90E8\\u53C2\\u4E0E\\u4EBA ({0})\n\n#XTIT: title of internal attendees search popup enhanced with total count\nview.Appointment.internal_titlenew=\\u65B0\\u5185\\u90E8\\u53C2\\u4E0E\\u4EBA ({0})\n\n#XTIT: title of external attendees search popup enhanced with total count\nview.Appointment.external_titlenew=\\u65B0\\u5916\\u90E8\\u53C2\\u4E0E\\u4EBA ({0})\n\n#YMSG: Filtered by info bar text for contact search popup\nview.Appointment.filteredby=\\u8FC7\\u6EE4\\u6761\\u4EF6\n\n#YMSG: filter line for cross navigation: Filter by Account \nview.Appointment.filteraccount=\\u6309\\u5BA2\\u6237\\u8FC7\\u6EE4\n\n#XFLD: loading text for the appointment list. Abbreviation of minutes with placeholder for the number of minutes\nview.Appointment.duration.min={0} \\u5206\\u949F\n\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in hours only, eg. "1 h"\nview.Appointment.duration.hour={0} \\u5C0F\\u65F6\n\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\nview.Appointment.duration.day={0} \\u5929\n\n#XFLD: loading text for the appointment list. Indicates the duration of an appointment in days only\nview.Appointment.duration.days={0} \\u5929\n\n#XTIT: Button text to Delete \nview.Appointment.deleteTitle=\\u5220\\u9664\n\n#YINS: Text for Pop Up action.  User to react (Yes/No) \nview.Appointment.deleteInstruction=\\u662F\\u5426\\u5220\\u9664\\u6B64\\u9884\\u7EA6\\uFF1F\n\n#XBUT: User to react (positive) to delete action \nview.Appointment.deleteYes=\\u786E\\u5B9A\n\n#XFLD: placeholder text for fiels adding external attendees\nview.Appointment.attexternaladd=\\u6DFB\\u52A0\\u5916\\u90E8\\u53C2\\u4E0E\\u4EBA\n\n#XFLD: placeholder text for fiels adding internal attendees\nview.Appointment.attinternaladd=\\u6DFB\\u52A0\\u540C\\u4E8B\n\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\nview.Appointment.fromTimeDate=\\u4ECE {0} {1}\n\n#XFLD: Start Time and Date of an Appointment. 1st Value is time, 2nd is Date\nview.Appointment.toTimeDate=\\u5230 {0} {1}\n\n#XFLD: Start Time and End Time of an appointment (no date!). 1st value is start time, 2nd is end time\nview.Appointment.timeToTime={0} \\u5230 {1}\n\n#XFLD: empty appointment list text \nview.Appointment.appointment_nodata=\\u65E0\\u9884\\u7EA6\n\n#XFLD: employee fullname: {0} firstname {1} lastname\nview.Appointment.employeename={0} {1}\n\n#XTIT: Title for Edit Appointment page\nview.Appointment.editappointment=\\u7F16\\u8F91\\u9884\\u7EA6\n\n#YMSG: Error when end time is before start time (on same day)\nview.Appointment.wrongTimes=\\u7ED3\\u675F\\u65F6\\u95F4\\u5728\\u5F00\\u59CB\\u65F6\\u95F4\\u4E4B\\u524D\n\n#YMSG: Error when end date is before start date\nview.Appointment.wrongDates=\\u7ED3\\u675F\\u65E5\\u671F\\u5728\\u5F00\\u59CB\\u65E5\\u671F\\u4E4B\\u524D\n\n#XBUT: Button text for Add Button\nview.Appointment.add=\\u6DFB\\u52A0\n\n#XTIT: Shell Title of App\nview.Appointment.shelltitle=\\u6211\\u7684\\u9884\\u7EA6\n\n#XFLD: empty list text for external attendee popup\nview.Appointment.noextattendees=\\u65E0\\u5916\\u90E8\\u53C2\\u4E0E\\u4EBA\n\n#XFLD: empty list text for internal attendee popup\nview.Appointment.nointattendees=\\u65E0\\u5185\\u90E8\\u53C2\\u4E0E\\u4EBA\n\n# XFLD: Only your tasks are displayed\nLIST_FILTERED_BY_MYITEMS=\\u4EC5\\u663E\\u793A\\u60A8\\u7684\\u9884\\u7EA6\n\n#YMSG: info message in case edit page is left with back and data changed\nview.Appointment.leaveeditmessage=\\u5982\\u679C\\u79BB\\u5F00\\u6B64\\u9875\\u9762\\uFF0C\\u8F93\\u5165\\u5185\\u5BB9\\u5C06\\u4E22\\u5931\\u3002\\u662F\\u5426\\u7EE7\\u7EED\\uFF1F\n\n#YMSG: info message in case of wrong format of Start Date\nview.Appointment.validStartDate=\\u8F93\\u5165\\u6709\\u6548\\u7684\\u5F00\\u59CB\\u65E5\\u671F\n\n#YMSG: info message in case of wrong format of End Date\nview.Appointment.validEndDate=\\u8F93\\u5165\\u6709\\u6548\\u7684\\u7ED3\\u675F\\u65E5\\u671F\n\n#YMSG: info message in case of wrong format of Start Date and End Date\nview.Appointment.validStartEndDate=\\u8F93\\u5165\\u6709\\u6548\\u7684\\u5F00\\u59CB\\u65E5\\u671F\\u548C\\u7ED3\\u675F\\u65E5\\u671F\n\n#XTIT: Title for Process type dialog\n\n#XFLD: No Data text when loading/searching list\n',
	"cus/crm/mycalendar/util/ApptListItem.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mycalendar.util.ApptListItem");
jQuery.sap.require("sap.m.ListItemBase");

sap.m.ListItemBase.extend("cus.crm.mycalendar.util.ApptListItem", {

	metadata : {
		// ---- control specific ----
		library : "cus.crm.mycalendar.util",
		defaultAggregation : "content",
		aggregations : {
			"content" : {
				type : "sap.ui.core.Control",
				multiple : true,
				singularName : "content",
				bindable : "bindable"
			}
		},

		properties : {
			"title" : {
				type : "string"
			},
			"subtitle" : {
				type : "string"
			},
			"account" : {
				type : "string"
			},
			"location" : {
				type : "string"
			},
			"time" : {
				type : "string"
			},
			"duration" : {
				type : "string"
			},
			"privat" : {
				type : "boolean"
			}
		}
	},

	renderer : {

		renderLIContent : function(oRm, oControl) {
          
			var bRTL = sap.ui.getCore().getConfiguration().getRTL();
            
			oRm.write("<div class='listItemCSS'");
			oRm.write(">");			

			oRm.write("<div ");
			oRm.addClass("cusMyApptLiOutter");
			oRm.writeClasses();
			oRm.write(">");
			
			// attachment needle first
			oRm.write("<div ");
			oRm.addClass("cusMyApptLiAttch");
			
			if(bRTL){
			   oRm.addClass("cusMyApptLiAttchRTL");	
			}
			oRm.writeClasses();
			oRm.write(">");
			oRm.renderControl(oControl.getContent()[1]); 
			oRm.write("</div>");			
			
			// - left part of item
			oRm.write("<div ");
			oRm.addClass("cusMyApptLiLeft");
			if (jQuery.device.is.phone) {
				oRm.addClass("cusMyApptLiLeftPhone");// different width as no Duration is needed
			}
			oRm.addClass("cusMyApptLiPadding");
			oRm.writeClasses();
			oRm.write(">");
			// -- Time
			oRm.write("<div ");
			oRm.addClass("cusMyApptLiTime");
			oRm.addClass("cusMyApptLiEllipsis");
			oRm.addClass("sapMSLITitle");
			oRm.addClass("sapThemeText-asColor");
			oRm.writeClasses();
			oRm.write(">");
			if (oControl.getTime()) {
				oRm.writeEscaped(oControl.getTime());
			}
			oRm.write("</div>");

			// -- Duration
			if (!jQuery.device.is.phone) { // Duration is not shown in phone layout
				oRm.write("<div ");
				oRm.addClass("cusMyApptLiEllipsis");
				oRm.addClass("sapMSLIDescription");
				oRm.writeClasses();
				oRm.write(">");
				if (oControl.getDuration()) {
					oRm.writeEscaped(oControl.getDuration());
				}
				oRm.write("</div>");
			}
			oRm.write("</div>");

			// - middle part Item

			oRm.write("<div ");
			oRm.addClass("cusMyApptLiMiddle");
			oRm.addClass("cusMyApptLiPadding");
			if (jQuery.device.is.phone) {
				oRm.addClass("cusMyApptLiMiddlePhone");// different width as there is no right part
			}
			oRm.writeClasses();
			oRm.write(">");

			// -- Titel
			oRm.write("<div ");
			oRm.addClass("cusMyApptLiEllipsis");
			oRm.addClass("cusMyApptLiTitel");
			oRm.addClass("sapThemeFontSize");
			oRm.addClass("sapMSLITitle");
			oRm.writeClasses();
			oRm.write(">");
			if (oControl.getTitle()) {
				oRm.writeEscaped(oControl.getTitle());
			}
			oRm.write("</div>");

			// -- Subtitle
			if (jQuery.device.is.phone) {
				// --- Phone--> Location only
				oRm.write("<div ");
				oRm.addClass("sapMSLIDescription");
				oRm.addClass("cusMyApptLiEllipsis");
				oRm.writeClasses();
				oRm.write(">");
				if (oControl.getLocation()) {
					oRm.writeEscaped(oControl.getLocation());
				}
				oRm.write("</div>");
			} else { // Desktop + Tablet
				oRm.write("<div ");
				oRm.addClass("sapMSLIDescription");
				oRm.addClass("cusMyApptLiEllipsis");
				oRm.writeClasses();
				oRm.write(">");
				if (oControl.getSubtitle()) {
					oRm.writeEscaped(oControl.getSubtitle());
				}
				oRm.write("</div>");
			}
			oRm.write("</div>");

			// - right part of item
			// is not relevant in phone layout
			if (!jQuery.device.is.phone) {
				oRm.write("<div ");
				oRm.addClass("cusMyApptLiRight");
				oRm.addClass("cusMyApptLiPadding");
				oRm.writeClasses();
				oRm.write(">");

				// Status
				oRm.write("<div ");
				oRm.addClass("cusMyApptLiEllipsis");
				oRm.addClass("cusMyApptLiStatus");
				oRm.addClass("sapMSLIDescription");
				oRm.writeClasses();
				oRm.write(">");
				if (oControl.getContent()[0]) {
					oRm.renderControl(oControl.getContent()[0]);
				}
				oRm.write("</div>");

				// private Icon
				oRm.write("<div ");
				oRm.addClass("cusMyApptLiEllipsis");
				oRm.addClass("sapMSLIDescription");
				oRm.writeClasses();
				oRm.write(">");
				if (oControl.getPrivat()) {
					oRm.writeEscaped(cus.crm.mycalendar.util.Util.geti18NText("view.Appointment.private"));
				}
				oRm.write("</div>");

				oRm.write("</div>");
			}

			oRm.write("</div>");
			oRm.write("</div>");
		}
	}

});

},
	"cus/crm/mycalendar/util/Conversions.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("cus.crm.mycalendar.util.Util");
jQuery.sap.require("sap.ui.core.format.NumberFormat");
jQuery.sap.declare("cus.crm.mycalendar.util.Conversions");

cus.crm.mycalendar.util.Conversions = {
		
	formatDateTime : function(oDateTime) {
			if (oDateTime !== null ) {
				if (typeof oDateTime === "string") {

					oDateTime = oDateTime.replace("/Date(", "").replace(")/", "");
					oDateTime = parseInt(oDateTime); // number ms
					oDateTime = new Date(oDateTime);
					
					
				}
				
				var dateTimeFormatter = sap.ui.core.format.DateFormat.getDateTimeInstance({
					style : "short" });
			    return dateTimeFormatter.format(oDateTime); }				
					else {
				return;
				}
	},
	
	formatDateTimeAllDay : function(oDateTime, bAllDay) {
		if (oDateTime !== null && bAllDay !== null ) {
			if (typeof oDateTime === "string") {

				oDateTime = oDateTime.replace("/Date(", "").replace(")/", "");
				oDateTime = parseInt(oDateTime); // number ms
				oDateTime = new Date(oDateTime);
				
				
			}
			
			var dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({
				style : "short" });
			var oDate = dateFormatter.format(oDateTime);			
			
			if (bAllDay) {
				var allDay = cus.crm.mycalendar.util.Util.geti18NText("view.Appointment.alldayevent");
				 return oDate + " " + allDay;	}
				else {
					var timeFormatter = sap.ui.core.format.DateFormat.getTimeInstance({
						style : "short" });
					var oTime = timeFormatter.format(oDateTime); 
				return oDate + " " + oTime;
				}
			
			}
},
	
	
	formatDate : function(date) {

		var sDate = "";
		if (date) {
			
		
			if (typeof date === "string"){
				
				if ( date.substring(0,6) === "/Date(" ){
					// for mockmode
					date = date.replace("/Date(", "").replace(")/", "");
					date = parseInt(date); // number ms
					date = new Date(date);
				}else{
					// datepicker issue -> maybe remove when fixed
				  // Wed Sep 18 2013 00:00:00 GMT+0200 (W. Europe Daylight
					// Time)
					date = new Date(date);					
				}
			} 	
			
			if (typeof date === "object") {

				var dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({
					style : "long" });
				sDate = dateFormatter.format(date);
				
			}
		}
		return sDate;
	},
	
	formatDateDay : function(date) {

		var sDate = "";
		if (date) {
			
		
			if (typeof date === "string"){
				
				if ( date.substring(0,6) === "/Date(" ){
					// for mockmode
					date = date.replace("/Date(", "").replace(")/", "");
					date = parseInt(date); // number ms
					date = new Date(date);
				}else{
					// datepicker issue -> maybe remove when fixed
				  // Wed Sep 18 2013 00:00:00 GMT+0200 (W. Europe Daylight
					// Time)
					date = new Date(date);					
				}
			} 	
			
			if (typeof date === "object") {

				var dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({
					style : "full" });
				sDate = dateFormatter.format(date);
				
			}
		}
		return sDate;
	},
	

	
	formatTime : function(datetime,bAllDay) {
		if(bAllDay) {
			// return string "All Day"
			return cus.crm.mycalendar.util.Util.geti18NText("view.Appointment.alldayevent");
		}
		else if (datetime) {
			if (typeof datetime === "string") {
				// mock data json now "FromDate": "/Date(1356998400000)/",

				datetime = datetime.replace("/Date(", "").replace(")/", "");
				datetime = parseInt(datetime); // number ms
				datetime = new Date(datetime);

			}
			
			//
			var locale = new sap.ui.core.LocaleData(sap.ui.getCore().getConfiguration().getLocale());
		    var pattern = locale.getTimePattern("short");
			var formatter = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: pattern });
			var sTime = formatter.format(datetime);
			return sTime;
		}
	},
	
	formatAccountContact : function(loc, acctxt, acc, contxt,isSharedCalendar) {
		var sResult = "";
		/*sResult = loc;*/
        if(isSharedCalendar){
        	var bindingContext=this.getBindingContext().getObject();
			if(bindingContext){
			var bPrivate = this.getBindingContext().getObject().PrivatFlag;
	    	
			if(bPrivate){
				
				return "";
			}
			}
			else
				return;
				
		}
        if(loc!=="") {
        	if(acctxt!=="") {
        		if(contxt!=="")
        			sResult=cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.furtherDetails", [loc, acctxt,contxt]);
        		else
        			sResult=cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.furtherDetailsWithoutContact", [loc, acctxt]);
        	}
        	else {
        		if(contxt!=="")
        			sResult=cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.furtherDetails", [loc, acc,contxt]);
        		else
        			sResult=cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.furtherDetailsWithoutContact", [loc, acc]);
        	}
        } else {        	
        	if(acctxt!==""){
        		if(contxt!=="")
        			sResult=cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.furtherDetailsWithoutLoc", [acctxt,contxt]);
        		else
        			sResult=cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.furtherDetailsWithoutContactAndLoc", [acctxt]);
        	}
        		
        	else
        		{
        		if(contxt!=="")
        			sResult=cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.furtherDetailsWithoutLoc", [acc,contxt]);
        		else
        			sResult=cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.furtherDetailsWithoutContactAndLoc", [acc]);
        
        		}
        }
        
		/*if(acctxt !== ""){
			sResult ? sResult = sResult + " | " + acctxt : sResult = acctxt;
			cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.furtherDetails", [loc,acctxt,contxt]);
		}
		else{
			sResult ? sResult = sResult + " | " + acc : sResult = acc;
			cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.furtherDetailsWithoutLoc", [acc,contxt]);
		}
		if (contxt) {
			sResult ? sResult = sResult + " (" + contxt + ")"
					: sResult = contxt;
		}*/
		
		return sResult;
	},
	
	formatDuration : function(from, to) {
	
		if (from !== null && to !== null && from !== undefined && to !== undefined ) {
			var diffmin;
			var diffms;
		
			if (typeof from === "string") {
				from = cus.crm.mycalendar.util.Conversions.getDatefromString(from);
			}

			if (typeof to === "string") {
				to = cus.crm.mycalendar.util.Conversions.getDatefromString(to);
			}

			diffms = to.getTime() - from.getTime();

			// in minutes ->
			diffmin = Math.round(diffms / 60000);

			if (diffmin < 60) {
				var number = diffmin.toString();
				var min = cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.duration.min", number);
				return min;
			} else {
			// rule for >= 1 Hour and < 24 hours
				if (diffmin < 1440 ) { 

					var diffHalfHours = Math.round(diffmin / 30 );
					var diffHours = diffHalfHours / 2;
					var numberFormatter = sap.ui.core.format.NumberFormat.getFloatInstance();
					var diffHoursLocal = numberFormatter.format(diffHours);
					number = diffHoursLocal.toString();
					var hour = cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.duration.hour", number);
				
					return hour;
				}
				else {
			// rule for > 1 day
					var days = Math.ceil(diffmin / 1440 );
					number = days.toString();
					if (days == "1") {
					var day = cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.duration.day", number);
					}
					else {
						var day = cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.duration.days", number);						
					}
					return day;
				
				}
			}
		}
	},

	
	
	getDatefromString : function(datetime) {
		// mock data json now "FromDate": "/Date(1356998400000)/",
		datetime = datetime.replace("/Date(", "").replace(")/", "");
		datetime = parseInt(datetime); // number ms
		datetime = new Date(datetime);

		return datetime;
	},	
	
	formatStatusText : function(oStatus) {
		switch(oStatus){
			case 'E0001':    // Status Open -> black
				return sap.ui.core.ValueState.Neutral;
			case 	'E0002':    // Status In Process -> black
				return sap.ui.core.ValueState.Neutral;
			case 	'E0003':    // Status Completed -> green
				return sap.ui.core.ValueState.Success;	
			case 	'E0007':    // Status Rejected -> red
				return sap.ui.core.ValueState.Error;	
			default:					// for other not specified status
				return sap.ui.core.ValueState.None;
		}
	},
	
	formatPrivateIcon : function(oPrivate) {
		if (oPrivate !== null) {
			if (oPrivate) {
				return "sap-icon://private";
			} else {
				return "sap-icon://unlocked";
			}
		}
	},
	
	formatPrivateDescription : function(oPrivate) {
		if (oPrivate !== null) {
			if (oPrivate) {
				return cus.crm.mycalendar.util.Util.geti18NText("view.Appointment.private");
			} else {
				return "";
			}
		}
	},	
	
	formatContactTxt : function(oContactTxt) {
			if (oContactTxt) {
				var oContactLabel = cus.crm.mycalendar.util.Util.geti18NText("view.Appointment.contact") + ":\u00A0";
				return oContactLabel + oContactTxt;
			} else {
				return "";
			}
	},	
	
	formatResponsibleTxt : function(oResponsibleTxt) {
		if (oResponsibleTxt) {
			var oResponsibleLabel = cus.crm.mycalendar.util.Util.geti18NText("view.Appointment.employeeResponsible") + ":\u00A0";
			return oResponsibleLabel + oResponsibleTxt;
		} else {
			return "";
		}
	},	
	
	
	formatPhotoUrl : function(mediaUrl) {
		return mediaUrl ? mediaUrl : "sap-icon://person-placeholder";
	},
	
	 getRelativePathFromURL : function(absoluteURL){
			var url =  document.createElement('a');
			url.href = absoluteURL;
			if(url.pathname.substring(0, 1) == "/")
				return url.pathname;
			else
				return "/" + url.pathname;
		},


	urlConverter : function(value) {

		var sapServer = jQuery.sap.getUriParameters().get("sap-server");
		var sapHost = jQuery.sap.getUriParameters().get("sap-host");
		var sapHostHttp = jQuery.sap.getUriParameters().get("sap-host-http");
		var sapClient = jQuery.sap.getUriParameters().get("sap-client");
		var oUriString;
							
       var oUri = URI(location.protocol + "//" + location.hostname + (location.port ? ':'+location.port: '') + cus.crm.mycalendar.util.Conversions.getRelativePathFromURL(value));
		var sCurrentProtocol = location.protocol.replace(':','');
		if (sCurrentProtocol !== oUri.protocol()) {
				oUri.protocol(sCurrentProtocol);
		}
		if (sapServer) {
			oUri.addSearch('sap-server', sapServer);
		}
		if (sapHost) {
			oUri.addSearch('sap-host', sapHost);		
		}
		if (sapHostHttp) {
			oUri.addSearch('sap-host-http', sapHostHttp);
		}
		if (sapClient) {
			oUri.addSearch('sap-client', sapClient);		
		}
		oUriString = oUri.toString();
		if (oUriString == "") {
			value = value.replace("https", "http");
			return value;
		}
		else {
			return oUri.toString();
		}
			
	},
	
	mimeTypeConverter : function(value) {

		switch (value)
		{
			case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
			case 'application/vnd.ms-powerpoint':			
				return 'pptx';
				break;
			case 'application/msword':
			case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
				return 'doc';
				break;
			case 'application/vnd.ms-excel':
			case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
				return 'xls';
				break;			
			case 'image/jpeg':
			case 'image/png':
			case 'image/tiff':
			case 'image/gif':		
				return 'jpg';
				break;
			case 'application/pdf':	
				return 'pdf';
				break;
			case 'text/plain':	
				return 'txt';
				break;
			default:
				return 'unknown'; 	
		}
	},
	
	uploadUrlConverter : function(value) {
		value = "/sap/opu/odata/sap/CRM_APPOINTMENT_SRV" + value + "/AppointmentToAttachment";
		return value;
	},
	formatAccountText : function(sAccountTxt,sAccount){
		if(sAccountTxt !== ""){
			return sAccountTxt;
		}
		return sAccount;
	},
	
	formatTypeTxt : function(oTypeTxt) {
		if (oTypeTxt !== "") {
			var oTypeLabel = cus.crm.mycalendar.util.Util.geti18NText("view.Appointment.TransactionType") + ":\u00A0";
			return oTypeLabel + oTypeTxt;
		} else {
			return "";
		}
	},
	
	FormatDocHistory: function (value) {
        if (value === "BUS2000111" || value === "BUS2000125" || value === "BUS2000126" || value ==="BUS2000108"){
        	return true;
        }
        else
        {
            return false;
        }
    },
	
	formatDescrType : function(oDescTxt , oTypeTxt,isSharedCalendar) {
		
		if(isSharedCalendar){
			var bindingContext=this.getBindingContext().getObject();
			if(bindingContext){
			var bPrivate = this.getBindingContext().getObject().PrivatFlag;
	    	
			if(bPrivate){
				var text=cus.crm.mycalendar.util.Util.geti18NText("view.Appointment.privateAppointment");
				return text;
			}
			}
			else
				return;
				
		}
		
		return oDescTxt;
		
	}

};

},
	"cus/crm/mycalendar/util/Schema.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mycalendar.util.Schema");

cus.crm.mycalendar.util.Schema = {
		
		_getEntityAnnotation : function(oModel, sAnnotationName,
				sEntityName) {
			// retrieve the metadata of the passed OData model
			var oModelMetadata = oModel.getServiceMetadata();
			// check for proper metadata structure
			if ((oModelMetadata != null)
					&& (oModelMetadata.dataServices != null)
					&& (oModelMetadata.dataServices.schema != null)
					&& (oModelMetadata.dataServices.schema.length > 0)
					&& (oModelMetadata.dataServices.schema[0].entityType != null)) {
				// determine the annotation by name using the first
				// annotated entity
				var entityTypes = oModelMetadata.dataServices.schema[0].entityType;
				// loop the entities
				for ( var i = 0; i < entityTypes.length; i++) {
					if (sEntityName === entityTypes[i].name
							&& entityTypes[i].extensions != null)
						// loop the annotations of the the entity
						for ( var j = 0; j < entityTypes[i].extensions.length; j++) {
							if (entityTypes[i].extensions[j].name === sAnnotationName)
								return entityTypes[i].extensions[j].value;
						}

				}
			}
			return null;
		},

		_getServiceSchemaVersion : function(oModel, sEntityName) { 
			var version = this._getEntityAnnotation(oModel,
					"service-schema-version", sEntityName);
			// defaults to initial service schema version (1)
			return (version != null) ? version : "1";
		},

		_getServiceVersion : function(oModel, sEntityName) {
			var version = this._getEntityAnnotation(oModel,
					"service-version", sEntityName);
			// defaults to initial service version (1)
			return (version != null) ? parseInt(version) : 1;
		}
      
	
};
},
	"cus/crm/mycalendar/util/Util.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mycalendar.util.Util");

cus.crm.mycalendar.util.Util = {


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

	geti18NText1 : function(key, replace) {
		if (this.geti18NResourceBundle()) {
			return this.geti18NResourceBundle().getText(key, replace);
		} else {
			return null ;
		}
	},

	// search function object to attach to search dialogs
	getSearch : function(sAttr, oList) {

		var doSearch = function(oEvent) {

			jQuery.sap.log.info("in do search");
			var aFilter = [];
			var itemsBinding;
			var sVal;

			if (oList) {
				sVal = oEvent.getSource().getValue();
			} else {
				sVal = oEvent.getParameter("value");
			}

			if (sVal !== undefined) {
				// Get the binded items
				if (oList) {
					itemsBinding = oList.getBinding("items");
				} else {
					// for the SearchDialog
					itemsBinding = oEvent.getParameter("itemsBinding");
				}

				//clear aApplicationFilters
			    itemsBinding.aApplicationFilters = [];
			    
				// filter on lastName -> anyway search on all attr due to enterprise search
				var selectFilter = new sap.ui.model.Filter(sAttr, sap.ui.model.FilterOperator.Contains, sVal);
				aFilter.push(selectFilter);

				// and apply the filter to the bound items, and the Select Dialog will update
				itemsBinding.filter(aFilter);
			}

		};

		return doSearch;

	},

	// live search function object to attach to search dialogs
	getLiveSearch : function(sAttr, oList) {
		var liveChangeTimer;
		var doSearch = function(oEvent) {

			jQuery.sap.log.info("in do live search");
			var aFilter = [];
			var itemsBinding;
			var sVal;

			if (oList) {
				sVal = oEvent.getSource().getValue();
			} else {
				sVal = oEvent.getParameter("value");
			}

			if (sVal.length === 0 || sVal.length > 3) {
				// Get the binded items
				// Get the binded items
				if (oList) {
					itemsBinding = oList.getBinding("items");
				} else {
					itemsBinding = oEvent.getParameter("itemsBinding");
				}

				// filter on lastName -> anyway search on all attr due to
				// enterprise search
				var selectFilter = new sap.ui.model.Filter(sAttr, sap.ui.model.FilterOperator.Contains, sVal);
				aFilter.push(selectFilter);

				// and apply the filter to the bound items, and the Select
				// Dialog will update
				clearTimeout(liveChangeTimer);
				liveChangeTimer = setTimeout(function(oEvent) {
					itemsBinding.filter(aFilter);
				}, 1000);
			}
		};

		return doSearch;
	},

	// creates a contactsearch fragment with a given id
	createContactSearchFragment : function(id, oController) {

		var oFragment = sap.ui.xmlfragment(id, "cus.crm.mycalendar.view.ContactSearch", oController);
		var oSearchList = sap.ui.core.Fragment.byId(id, "lsc");
		var oIB = oSearchList.getInfoToolbar();
		var oLIT = sap.ui.core.Fragment.byId(id, "lsci");
		var oSF = sap.ui.core.Fragment.byId(id, "sfc");
		
		oSearchList.removeItem(oLIT);
		// get function object for search and keep it in the fragment
		oFragment.onContactSearch = cus.crm.mycalendar.util.Util.getSearch("lastName", oSearchList);
		oFragment.onContactLiveChange = cus.crm.mycalendar.util.Util.getLiveSearch("lastName", oSearchList);

		// helper method to trigger contact search -> 2 different collections
		oFragment.triggerSearch = function(input) {
			var aFilter = [];
			
		  // remove template, because data binding will clone this template / avoid empty oData call
			oSearchList.removeItem(oLIT);
			if (input.searchvalue) {
				var selectFilter = new sap.ui.model.Filter("lastName", sap.ui.model.FilterOperator.Contains, input.searchvalue);
				aFilter.push(selectFilter);
				oSF.setValue(input.searchvalue);
			} else {
				oSF.setValue("");
			}

			if (input.accountid) {

				// add account txt to the label of the info tool bar
				var sFilteredby = oController.oBundle.getText("view.Appointment.filteredby");
				sFilteredby = sFilteredby + " " + (input.accounttext === "" ? input.accountid : input.accounttext);
				oIB.getContent()[0].setProperty("text", sFilteredby);
				oSearchList.getInfoToolbar().setVisible(true);

				// and set search collection to the Contacts collection of the specific account
				var sPath = "sm>/AccountCollection('" + input.accountid + "')/Contacts";
				oSearchList.bindAggregation("items", {
					path : sPath,
					template : oLIT,
					filters : aFilter
				});

			} else {
				// no account info passed -> normal f4 contact collection
				oIB.setVisible(false);
				var sPath = "sm>/ContactCollection";
				oSearchList.bindAggregation("items", {
					path : sPath,
					template : oLIT,
					filters : aFilter
				});
			}

		};

		return oFragment;
	},

	// keep an own search model for the search helps because of the count issue
	// and because to keep the app model separated -> refresh of bindings
	// same oData service of course
	getSearchModel : function(oModel, isMock) {

		if (this.oSearchModel === undefined) {

			if (isMock) {
				// mock mode / default mode
				this.oSearchModel = new sap.ui.model.json.JSONModel();
				this.oSearchModel.loadData("/cus.crm.mycalendar/model/SearchModel.json", "", true);

			} else {

				this.oSearchModel = oModel;
				this.oSearchModel.attachRequestFailed(this, this.onRequestFailed, this);
			}
		}

		return this.oSearchModel;
	},

	onRequestFailed : function(oError) {
		jQuery.sap.log.error("oData search request failed");
		this.showErrorMessagePopup(oError);
	},
	//added some function
  formatAccountPlace: function(city, country){
		
		var sResult = city;
		
		if (country) {
			if (city) {
				sResult = sResult + ", " + country;
			} else {
				sResult = country;
			}
		}
		return sResult;
	},
	getAccountF4Description : function (city, country, accountID) {
		var text = "";
		var idPrefix = "";
		
		if (accountID){
			idPrefix = accountID + " / ";
			text = accountID;
		}
		if(!city && country){
			text = idPrefix + country;
		}
		else if(!country && city){
			text = idPrefix + city;
		}
		else if(country && city){
			text = idPrefix + city +", " + country;
		}
		return text;
	},
	getAccountF4Title : function(fullName){
		var text = "";
		if (fullName){
			text = fullName;
		}
		else{
			text = " ";
		}
		return text;
	},
	
	///////////////////////////////////
	


	showErrorMessagePopup : function(oError) {

		var sDetails = "", sMessage = "";

		if (oError.response && oError.response.body) {

			try{
				var oResponse = JSON.parse(oError.response.body);
				if (oResponse.error && oResponse.error.message) {
	        // directly display this as message
					sMessage = oResponse.error.message.value;
				} else {
					sMessage = oError.message;
					sDetails = oError.response.body;
				}
      }catch(e){
        // catch json parse error  
        sMessage = oError.message;
        sDetails = oError.response.body;
      }
		
		}

	/*	if (oError.mParameters) {
			sMessage = oError.mParameters.message;

			if (oError.mParameters.responseText) {
				sDetails = oError.mParameters.responseText;
			}
		}*/

		sap.ca.ui.message.showMessageBox({
			type : sap.ca.ui.message.Type.ERROR,
			message : sMessage,
			details : sDetails
		});

	},
	
	initEmployeeF4 : function(oController,oSource,oModel){
		
		    var oResourceBundle = oController.getView().getModel('i18n').getResourceBundle();
		    oController.onEmpSelect = this.getEmployeeSelect(oController,oSource,oModel);
		    oController.searchEmp   = this.getEmployeeSearch(oController,oSource);
		    oController.searchEmpLive = this.getEmployeeSearchLive(oController);
		    oController.onEmpToolbarClose = this.getEmpInfoBarClose(oController);
		    oController.closeEmpF4 = this.getCloseEmpF4(oController);
			oController.oEmpF4 = new sap.ui.xmlfragment("cus.crm.mycalendar.view.EmployeeF4",oController);
			oController.oEmpF4.setModel(new sap.ui.model.json.JSONModel(),"json");
			oController.oEmpF4.getModel('json').setSizeLimit(5000);
			oController.oEmpF4.setModel(oController.getView().getModel('i18n'),"i18n");
			oController.oEmpF4._list = oController.oEmpF4.getContent()[0];
		    oController.oEmpF4._infoToolbar = oController.oEmpF4._list.getInfoToolbar();
		    oController.oEmpF4._infoBarLabel = oController.oEmpF4._infoToolbar.getContent()[0];
		    oController.oEmpF4._searchField = oController.oEmpF4.getSubHeader().getContentLeft()[0];
		    oController.oEmpF4._loadingText = oResourceBundle.getText('view.Appointment.loaddatatext');
		    oController.oEmpF4._noDataText = oResourceBundle.getText('view.Appointment.empsea_nodata');
	},  
	
	
	showEmployeeF4 : function(oController,sEmpText,sAccount,sAccountTxt){
	   
		var oModel = oController.getView().getModel();
	    var aFilters = [];
	    var sPath = "";
	    if(sEmpText !== ""){
	    	aFilters.push(new sap.ui.model.Filter("fullName",sap.ui.model.FilterOperator.Contains,sEmpText));
	    	
	    }
	    oController.oEmpF4._searchField.setValue(sEmpText);
	    
	    if(sAccount !== "" ){
	    	sPath = "AccountCollection(accountID='"+ sAccount + "')/EmployeeResponsibles";
	    	var sFilterText = oController.getView().getModel('i18n').getResourceBundle().getText('view.Appointment.filteredby') + " ";
	         sFilterText +=  (sAccountTxt === "") ?  sAccount : sAccountTxt;
	    	oController.oEmpF4._infoBarLabel.setText(sFilterText);
	    	oController.oEmpF4._infoToolbar.setVisible(true);
	    	
	    }
	    else{
	    	sPath = "EmployeeCollection";
	    	oController.oEmpF4._infoToolbar.setVisible(false);
	    }
	    oController.oEmpF4._list.setNoDataText(oController.oEmpF4._loadingText);
	    oController.oEmpF4.getModel('json').setData({EmployeeCollection : []});
	    oModel.read(sPath,{
            async : true,
            context : null,
            urlParameters : null,
            filters : aFilters,
	    	success : function(odata,response){
	    	
	        oController.oEmpF4._list.setNoDataText(oController.oEmpF4._noDataText);	
	    	oController.oEmpF4.getModel('json').setData({ 
	    		 EmployeeCollection :   response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]	        		
	    	 });
	                   },
	        error : function(oError){
	        	
	                }
	    });
		oController.oEmpF4.data('account',sAccount);
		oController.oEmpF4.open();
	},
	
	getEmployeeSelect : function(oController,oSource,oModel){ var that = this ;
		return function(oEvent){
	        var oSelectedItem =  oEvent.getParameter('listItem');
	        var oData = oSelectedItem.getBindingContext('json').getObject();
	        
			if(oSource instanceof sap.m.Input){
	             oSource.setValue((oData.fullName === "") ? oData.employeeID : oData.fullName);	 
	         }   		
			oModel.oData.Responsible = oData.employeeID;
			oModel.oData.ResponsibleTxt = oData.fullName;
           
			// disable private flag if not login Employee
			if(parseFloat(oController.sBackendVersion) >= 4.0){
				oController._setPrivateFlag(oData);
			}

			oController.oEmpF4._list.removeSelections();
			oController.oEmpF4.close();
		};
	},
	

	getEmployeeSearch : function(oController){
		return function(oEvent){
			var oModel = oController.getView().getModel();
			var sEmpText = oController.oEmpF4._searchField.getValue();
			var sPath = "";
			var sAccount = oController.oEmpF4.data('account');
			var aFilters = [];
			
			if(sAccount !== ""){
				 sPath = "/AccountCollection(accountID='" + sAccount + "')/EmployeeResponsibles";
			}
			else{
				sPath = "/EmployeeCollection";
			}
			
			if(sEmpText !== ""){
				aFilters.push(new sap.ui.model.Filter("fullName",sap.ui.model.FilterOperator.Contains, sEmpText));
			}
		  
		  oController.oEmpF4._list.setNoDataText(oController.oEmpF4._loadingText);	
		  oController.oEmpF4.getModel('json').setData({EmployeeCollection : []});
		  oModel.read(sPath,{
			  async : true,
			  context : null,
			  urlParameters : null,
			  filters : aFilters,
			  success : function(oData,response){
				   oController.oEmpF4._list.setNoDataText(oController.oEmpF4._noDataText);
					oController.oEmpF4.getModel('json').setData({ 
			    		 EmployeeCollection :   response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]	        		
			    	 });
			              },
			  error : function(oError){
					
				        }
			  
		  });
		};
	},
	
	getEmpInfoBarClose : function(oController){
		return function(oEvent){
		var oModel = oController.getView().getModel();
		var sEmpText = oController.oEmpF4._searchField.getValue();
		var sPath = "/EmployeeCollection";	
		var aFilters = [];
		
		oController.oEmpF4.data('account',"");
		if(sEmpText !== ""){
			aFilters.push(new sap.ui.model.Filter("fullName",sap.ui.model.FilterOperator.Contains,sEmpText));
		}
		
		oController.oEmpF4._list.setNoDataText(oController.oEmpF4._loadingText);
		oController.oEmpF4.getModel('json').setData({EmployeeCollection : []});
		
		oModel.read(sPath,{
			async : true,
			urlParameters : null,
			context : null,
			filters : aFilters,
			success : function(oData,response){
				
				 oController.oEmpF4._list.setNoDataText(oController.oEmpF4._noDataText);
				oController.oEmpF4.getModel('json').setData({ 
		    		 EmployeeCollection :   response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]	        		
		    	 });
		              },
			error : function(oError){
				
			        }
		});
		oController.oEmpF4._infoToolbar.setVisible(false);
	};
		
	},
	
	getEmployeeSearchLive : function(oController){
		return function(oEvent){
			
			var oModel = oController.getView().getModel();
			var sEmpText = oController.oEmpF4._searchField.getValue();
			
			if(sEmpText.length > 0 &&sEmpText.length <= 3){
				return;
			}
			var sPath = "";
			var sAccount = oController.oEmpF4.data('account');
			var aFilters = [];
			
			if(sAccount !== ""){
				 sPath = "/AccountCollection(accountID='" + sAccount + "')/EmployeeResponsibles";
			}
			else{
				sPath = "/EmployeeCollection";
			}
			
			if(sEmpText !== ""){
				aFilters.push("$filter=substringof('" + sEmpText + "',fullName)");
			}
		  
		  oController.oEmpF4._list.setNoDataText(oController.oEmpF4._loadingText);	
		  oController.oEmpF4.getModel('json').setData({EmployeeCollection : []});
		  oModel.read(sPath,null,aFilters,true,
			   function(oData,response){
				   oController.oEmpF4._list.setNoDataText(oController.oEmpF4._noDataText);
					oController.oEmpF4.getModel('json').setData({ 
			    		 EmployeeCollection :   response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]	        		
			    	 });
			              },
			   function(oError){
					
				        }
			  
		  );
		};
	},
	
	getCloseEmpF4 : function(oController){
	   return function(){
		oController.oEmpF4._list.removeSelections();
		oController.oEmpF4.close();
		
	   };
	},
	filterStatusesByProcessType : function(aStatuses,sProcessType){
		
	},
	
	handleErrors : function(oError){
		
		jQuery.sap.log.error(JSON.stringify(oError));
		sap.ca.ui.message
				.showMessageBox(
						{
							type : sap.ca.ui.message.Type.ERROR,
							message : oError.message,
							details : JSON
									.parse(oError.response.body).error.message.value
						}, function(oResult) {
							
						});

	},
	
	initCustomizingModel : function(oController){
		
		oController.oApplicationFacade.setApplicationModel("customizing",new sap.ui.model.json.JSONModel({}));
	},
	
	getStatusesForTxType : function(aStatuses,sTxType){
		var i = 0; 
		var aFilteredStatuses = [];
		var length = aStatuses.length;
		for(;i<length;i++){
			if(aStatuses[i].TransactionType === sTxType){
				aFilteredStatuses.push(aStatuses[i]);
			}
		}
		
		if(aFilteredStatuses.length === 0){
			return null;
		}
		
		return aFilteredStatuses;
	},
	
	getDefaultStatus : function(aStatuses){
		
		for(var i = 0; i < aStatuses.length; i++){
			if(aStatuses[i].Default === true){
				return aStatuses[i];
			}
		}
		
		return null;
	},
	
	getPrioritiesForTxType : function(aPriorities,sTxType){
		
	},
	
	getDefaultPriority : function(sTxType,oController){
		var oCustModel = oController.oApplicationFacade.getApplicationModel("customizing");
		var oData = oCustModel.oData;
        var sDefaultPrio = "";
		if(oData.TransactionTypeSet && oData.TransactionTypeSet.length !== 0){
			    
	            for(var i = 0; i < oData.TransactionTypeSet.length; i++){
	                  if(oData.TransactionTypeSet[i].ProcessTypeCode === sTxType){
	                	  sDefaultPrio =  oData.TransactionTypeSet[i].Priority
	                	  break;
	                  }            	
	            }
	            
	            if(sDefaultPrio !== "" && oData.UserPriorities){	
	            	for(var i = 0 ;  i < oData.UserPriorities.length;i++){
	            		if(oData.UserPriorities[i].Priority === sDefaultPrio){
	            			return oData.UserPriorities[i];
	            		}
	            	}
	            	
	            }
	            else{
	            	return null;
	            }
		}
		
		else{
			return null;
		}
		
	},
	
	showErrMsgBox : function(sErrMsg){
		sap.ca.ui.message.showMessageBox({
			type : sap.ca.ui.message.Type.ERROR,
			message : sErrMsg,
		}, function(oResult) {
			
		});
	},
	
	handleBatchCustomizingRead : function(aResponses,oController){
		
		var oCustModel = oController.oApplicationFacade.getApplicationModel("customizing");
		var oData = oCustModel.oData;
		var bFail = false;
		var sErrTitle = "";
		var sErrMsg = "";
		
		if(parseInt(aResponses.__batchResponses[0].statusCode) >= 400){
			sErrTitle = oResponses.__batchResponses[0].statusText;
			sErrMsg = JSON.parse(oResponses.__batchResponses[0].response.body).error.message.value + "\n";
			bFail = true;
		}
		
		else{
			oData.UserPriorities = aResponses.__batchResponses[0].data.results;
		}
		
		if(parseInt(aResponses.__batchResponses[1].statusCode) >= 400){
			sErrTitle = oResponses.__batchResponses[1].statusText;
			sErrMsg = JSON.parse(oResponses.__batchResponses[1].response.body).error.message.value + "\n";
			bFail = true;
		}
		
		else{
			oData.UserStatuses = aResponses.__batchResponses[1].data.results;
		}
		if(!oData.TransactionTypeSet){
		if(parseInt(aResponses.__batchResponses[2].statusCode) >= 400){
			sErrTitle = oResponses.__batchResponses[2].statusText;
			sErrMsg = JSON.parse(oResponses.__batchResponses[2].response.body).error.message.value + "\n";
			bFail = true;
		}
		
		else{
			oData.TransactionTypeSet = aResponses.__batchResponses[2].data.results;
		}
		}
		
		if(bFail){
			//this.showErrMsgBox(sErrTitle,sErrMsg);
			if(oController._setViewMode){
				oController._setViewMode("ERROR");
				oController.sErrMsg = sErrMsg;
				return !bFail;
			}
			this.showErrMsgBox(sErrMsg);
			
		}
		
		return !bFail;
	},
	filterDropDowns : function(sTxType,oController){
		
		var oCustModel = oController.oApplicationFacade.getApplicationModel("customizing");
		var oData = oCustModel.oData;
	
		if(oData.UserPriorities && oData.UserPriorities.length === 0){
		  //  var sErrTitle = "Error";
		    var sErrMsg = oController.getView().getModel("i18n").getResourceBundle().getText("CUSTOMIZING_INCOMPLETE");
			//this.showErrMsgBox(sErrTitle,sErrMsg);
		    if(oController._setViewMode){
				oController._setViewMode("ERROR");
				oController.sErrMsg = sErrMsg;
				return false;
			}
		    this.showErrMsgBox(sErrMsg);
			return false;
		}
		var aFilteredStatuses = this.getStatusesForTxType(oData.UserStatuses, sTxType);
		
		if(aFilteredStatuses === null){
			//var sErrTitle = "Error";
			 var sErrMsg = oController.getView().getModel("i18n").getResourceBundle().getText("CUSTOMIZING_INCOMPLETE");
			//this.showErrMsgBox(sErrTitle,sErrMsg);
			 if(oController._setViewMode){
					oController._setViewMode("ERROR");
					oController.sErrMsg = sErrMsg;
					return false;
				}
			 this.showErrMsgBox(sErrMsg);
			return false;
		}
		
		if(!oData.mStatuses){
			oData.mStatuses = {};
		}
		oData.mStatuses[sTxType] = aFilteredStatuses;
			
		return true;
		
		
	},
	isTransactionTypeActive : function(sTransactionType,oController){
		
		var bReturn;
	
		oController.oModel.read("readAppointStatusCust",null,{Guid : "''",TransactionType : "'" + sTransactionType + "'"},false,function(oData,response){
			
			bReturn = true;
			var oCustomizingModel = oController.oApplicationFacade.getApplicationModel("customizing");
			var oCustData = oCustomizingModel.oData;
			if(!oCustData.mStatuses){
				oCustData.mStatuses = {};
			}
			oCustomizingModel.oData.mStatuses[sTransactionType] = oData.results;
			
		},function(oError){
		   cus.crm.mycalendar.util.Util.handleErrors(oError);	
		   bReturn  = false;
		});
		
		return bReturn;
	},
getCustomizing : function(sTransactionType,oController){
	
	if(parseFloat(oController.sBackendVersion)  >= 4){
		 var bReturn;
		var oCustModel = oController.oApplicationFacade.getApplicationModel("customizing");
		var oData = oCustModel.oData
		if(oController._getViewMode){
			var i = 0;
			var mRequests = {
					
			};
			var sViewState = oController._getViewMode();
			if(sViewState === "EDIT"){
				  if(!oData.mNextPossibleStatuses){
					  oData.mNextPossibleStatuses = {};
				  }
				  
				  if(!oData.mNextPossibleStatuses[sTransactionType]){
					  oController.oModel.addBatchReadOperations([oController.oModel.createBatchOperation(oController.sEntityPath.substr(1) + "/AppointmentStatuses", "GET")]);
					  mRequests["NEXTSTATUS"] = i;
					  i++;
				  }
				  
				  if(!oData.UserPriorities){
					  oController.oModel.addBatchReadOperations([oController.oModel.createBatchOperation("UserPriorities","GET")]);
					  mRequests["PRIO"] = i;
					  i++;
				  }
				  
				  if(i > 0){
					  oController.oModel.submitBatch(function(aResponses){
						  
						  var bFail = false;
						  var sErrTitle = "";
						  var sErrMsg = "";
						  var key;
						  //if(parseInt(aResponses.__batchResponses[0].statusCode) >= 400){
						  
						  if(mRequests["NEXTSTATUS"] !== null && mRequests["NEXTSTATUS"] !== undefined){
							  var index = mRequests["NEXTSTATUS"];
							  if(parseInt(aResponses.__batchResponses[index].statusCode) >= 400){
								  bFail = true;
								  sErrTitle = oResponses.__batchResponses[index].statusText;
								  sErrMsg = JSON.parse(oResponses.__batchResponses[index].response.body).error.message.value + "\n";
								  
							  }
							  else{
								  
								  oData.mNextPossibleStatuses[sTransactionType] = aResponses.__batchResponses[index].data.results;
							  }
						  }
						  if(mRequests["PRIO"] !==null && mRequests["PRIO"] !== undefined){
							  var index = mRequests["PRIO"];
							  if(parseInt(aResponses.__batchResponses[index].statusCode) >= 400){
								  bFail = true;
								  sErrTitle = oResponses.__batchResponses[index].statusText;
								  sErrMsg = JSON.parse(oResponses.__batchResponses[index].response.body).error.message.value + "\n";
								  
							  }
							  else{
								  
								  oData.UserPriorities = aResponses.__batchResponses[index].data.results;
							  }
						  }
						  
						  if(bFail){
							  cus.crm.mycalendar.util.Util.showErrMsgBox(sErrMsg);
							  return !bFail;
						  }
						  
					  },function(oError){
						  cus.crm.mycalendar.util.Util.handleErrors(oError);
						  bReturn = false;
					  },false);
					  
					  if(bReturn === false){
						  return false;
					  }
				  }
			}
		}
		
		if(!oData.UserStatuses || !oData.UserPriorities){
		 oController.oModel.addBatchReadOperations([oController.oModel.createBatchOperation("UserPriorities","GET")]);
		 oController.oModel.addBatchReadOperations([oController.oModel.createBatchOperation("UserStatuses","GET")]);
		 
		 if(!oData.TransactionTypeSet){
			 oController.oModel.addBatchReadOperations([oController.oModel.createBatchOperation("TransactionTypes","GET")]);
		 }
		 var that = oController;
		 
		 
		 oController.oModel.submitBatch(function(aResponses){
			bReturn =  cus.crm.mycalendar.util.Util.handleBatchCustomizingRead(aResponses,that);
			
			if(bReturn === true){
			bReturn = cus.crm.mycalendar.util.Util.filterDropDowns(sTransactionType,oController);
			}
		 },function(oError){
			 cus.crm.mycalendar.util.Util.handleErrors(oError);
			 bReturn = false;
		 },false);
		 
		 if(bReturn === false){
			 return false;
		 }
		}
		else{
			bReturn = cus.crm.mycalendar.util.Util.filterDropDowns(sTransactionType,oController);
			
			if(bReturn === false){
				return false
			}
		}
	}
	else{
 	var bTransactionActive  = cus.crm.mycalendar.util.Util.isTransactionTypeActive(sTransactionType,oController);
	
 	
	if(!bTransactionActive){
		return false;
	}
	
}
	
},

initControllersModel : function(oController){
	var oControllersModel = new sap.ui.model.json.JSONModel({});
	oController.oApplicationFacade.setApplicationModel("controllers",oControllersModel);
	
	return oControllersModel
},

_fetchETag : function(sEntityPath,oModel){
	
	var oContext = oModel.getContext(sEntityPath);

	if(oContext){
		oModel.deleteCreatedEntry(oContext);
	}
	
     oModel.createBindingContext(sEntityPath,null,function(oContext){
		cus.crm.mycalendar.util.Util._saveETag(oContext.getObject().__metadata.etag);
	},true);
},


_saveETag  : function(sETag){
	this.sETag = sETag;
},

_getETag : function(){
	return this.sETag;
}
	
	
	
	

};

},
	"cus/crm/mycalendar/view/AccountSearch.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<SelectDialog xmlns="sap.m" xmlns:core="sap.ui.core"\n\tnoDataText="{i18n>view.Appointment.acsea_nodata}"\n\t>\n\t<StandardListItem id="lsai" title="{fullName}"\n\t     description= "{parts:[{path:\'MainAddress/city\'}, {path:\'MainAddress/country\'}], formatter: \'cus.crm.mycalendar.util.Util.formatAccountPlace\'}">\n\t\t\n\t\t<customData>\n\t\t\t<core:CustomData key="accountID" value="{accountID}" />\n\t\t</customData>\n\t</StandardListItem>\n</SelectDialog>',
	"cus/crm/mycalendar/view/AppointmentDetail.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");
jQuery.sap.require("cus.crm.mycalendar.util.Conversions");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.ExpansibleFeedListItem");
jQuery.sap.require("cus.crm.mycalendar.util.Schema");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("cus.crm.mycalendar.view.AppointmentDetail", {
	
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created. Can be used to
	 * modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 */
	onInit : function() {
		sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit.call(this);
		
		if(!this.oApplicationFacade.getApplicationModel("customizing")){
			cus.crm.mycalendar.util.Util.initCustomizingModel(this);
		}
		
	
		
		var oControllers = new sap.ui.model.json.JSONModel({detailController : this});						
		this.oApplicationFacade.setApplicationModel("detailController",oControllers);
		
		this.oModel = this.oApplicationFacade.getODataModel();
		this.isMock = this.oApplicationFacade.isMock();
		this.getView().setModel(this.oModel);
		this.followUpButton=this.byId("followup");
		var sBackendVersion = cus.crm.mycalendar.util.Schema._getServiceSchemaVersion(this.oModel,"Appointment");
		if(parseFloat(sBackendVersion) >= 3){
			this.followUpButton.setVisible(true);
		}
		else{
			this.followUpButton.setVisible(false);
		}
		
		if(parseFloat(sBackendVersion) >= 4){
			this.byId('transactionHistoryData').setVisible(true);
		    this.getView().byId("messages").setVisible(true);
		}
		else
			{
			this.byId('transactionHistoryData').setVisible(false);
			// error handling button interoperability
		      this.getView().byId("messages").setVisible(false);
			
			}

		this.oBundle = this.oApplicationFacade.getResourceBundle();
		this.marginStyle = jQuery.device.is.phone ? "sapUiSmallMargin" : "sapUiMediumMargin";
		this.byId("ohdetail").addStyleClass(this.marginStyle);
		
		//for error handling fragment dialog
		this.showErrorMsgFragment = sap.ui.xmlfragment(this.createId("show_Error_Msg_Fragment"),
                "cus.crm.mycalendar.view.ShowErrorMsg",this);
		

		// navigation call back
		this.oRouter.attachRouteMatched(function(oEvent) {
			jQuery.sap.log.info("### nav target:  " + oEvent.getParameter("name"));
			this.sBackendVersion = cus.crm.mycalendar.util.Schema._getServiceSchemaVersion(this.oModel,"Appointment");
			if (oEvent.getParameter("name") === "appointment") {
				this.Context = "/AppointmentSet(guid'" + oEvent.getParameter("arguments").AppointmentID + "')";

				var that = this;
				// closing doc history panel expansion
				if(this.byId("transactionHistoryData").setExpanded)
					 this.byId("transactionHistoryData").setExpanded(false);
				// adapt context for mock
				if (this.isMock){
					this.Context = "/AppointmentSet(Guid='" + oEvent.getParameter("arguments").AppointmentID + "')";
				}
				
				var sExpand = "Attendee,AccountRel/Logo,AppointmentToAttachment";

                 if(parseFloat(that.sBackendVersion) >=4) {

                        sExpand += ",DocumentHistory,AppointmentLogSet";
                }

					
				// read all data on this screen
				this.oModel.createBindingContext(this.Context, "", {
						expand : sExpand
				}, function(oContext) {
						that.getView().bindElement(that.Context);
						if(parseFloat(that.sBackendVersion) >=4) {
							var appList= that.getView().getBindingContext().getObject().AppointmentLogSet.__list;
							var errcount=appList.length;
							if (errcount != 0) {
								that.getView().byId("messages").setEnabled(true);
							} else
								that.getView().byId("messages").setEnabled(false);
						}
						that.onDataReceived();
				}, true);
				
				
				var oStartupParameter = this.getView().getModel("startupParameters");
				if (oStartupParameter && oStartupParameter.oData) {
					if (oStartupParameter.oData.parameters) {
						for ( var param in oStartupParameter.oData.parameters) {	
						}
					}
					delete oStartupParameter.oData.parameters[param];
				}
				
				this.getView().byId("delbut").setVisible(true);
				this.getView().byId("followup").setVisible(true);
			}
		
			
			
			
		}, this);
		
		
	},

	onDataReceived : function() {
		var sPath = this.Context;
		var oData = this.getView().getModel().getData(sPath, null, true);
		if (oData) {
			// success read
			// construct attendees and account logo
			// Hide Process Type description, in case if it is null
			if (oData.ProcessTypeDescription == null){
				this.getView().byId("ProcessTypeDescription").setVisible(false);
			}
			else{
				//HACK: not honoring the oData binding
				
				this.byId("ProcessTypeDescription").setText(cus.crm.mycalendar.util.Conversions.formatTypeTxt(oData.ProcessTypeDescription));
				
			}
			this.setAttendees_AccountLogo(oData);
			// get attachments
			this.getAttachments(oData.AppointmentToAttachment);
			//get DocumentHistory
			if(parseFloat(this.sBackendVersion) >=4) {
				this.setDocumentHistory(oData);
			}
		} else {
			// error read / path does not exist
			this.getView().unbindElement();
			this.clearAttendees_AccountLogo();
			this.clearAttachments();
		}
	},

	onBack : function() {
		
		var oHistory = sap.ui.core.routing.History.getInstance();
		var sPreviousHash=oHistory.getPreviousHash();
		
		if(sPreviousHash==""){
			window.history.back();
		}
		else 
		if(sPreviousHash){
		 if(sPreviousHash.search("appointment")!==-1){
			 window.history.back();
			// window.history.go(-2);
		}
		
		else
		window.history.go(-2);
		 }
		else
			window.history.back();
		
	},
	
	getDateParameterfromDate : function(d) {
		// format: Date --> yyymmdd
		var sDay = d.getDate().toString();
		sDay = (sDay.length === 1) ? "0" + sDay : sDay;
		var sMonth = d.getMonth() + 1; // Months are zero based
		sMonth = sMonth.toString();
		sMonth = (sMonth.length === 1) ? "0" + sMonth : sMonth;
		var sYear = d.getFullYear();
		var sDate = "" + sYear + sMonth + sDay;
		return sDate;
	},

	// edit button handler - navigate to edit screen
	onUpdate : function(oEvent) {
	//	var bc = oEvent.oSource.getBindingContext().getPath();
		var bc = this.Context ; 
		var sUUID = this.oModel.getProperty(bc).Guid;
		
		var oModel = this.oModel;
		
		var that = this;
		
		var oCUS = cus.crm.mycalendar.util.Schema;
		
		if(parseFloat(oCUS._getServiceSchemaVersion(this.oModel,"Appointment")) >= 3){
		
		oModel.read("EditAuthorizationCheck", null, {
			ObjectGuid : oModel.formatValue(sUUID,
			"Edm.Guid")},
				false, function(oData, resp){
					if(resp.data.EditAuthorizationCheck.ActionSuccessful == "X"){
						that.oRouter.navTo("editappointment", {AppointmentID : sUUID}, false); 
					}
					else{
						//cus.crm.mycalendar.util.Util.showErrorMessagePopup(resp.data.EditAuthorizationCheck.Message);
						sap.ca.ui.message.showMessageBox({
							type : sap.ca.ui.message.Type.ERROR,
							message : resp.data.EditAuthorizationCheck.Message,
							details : null
						});
					}		
				},null);
		}
		else{
			this.oRouter.navTo("editappointment", {AppointmentID : sUUID}, false); 
		}

	},

	// delete button handler - confirmation popup
	onDelete : function(oEvent) {
		// get the entity to delete
		var oContext = this.Context;
		var fnClose = jQuery.proxy(function(oResult) {
			if (oResult.isConfirmed) {
				this.deleteAppointment(oContext);
			}
		}, this);

		var oDelText = this.oBundle.getText("view.Appointment.deleteTitle");
		var oDelInstruction = this.oBundle.getText("view.Appointment.deleteInstruction");
		var oDelYes = this.oBundle.getText("view.Appointment.deleteYes");

		sap.ca.ui.dialog.confirmation.open({
			question : oDelInstruction,
			showNote : false,
			title : oDelText,
			confirmButtonLabel : oDelYes
		}, fnClose);
	},
	
	onFollowup : function(oEvent) {

		var that = this;
		this._actionSheet = new sap.m.ActionSheet({
			// title : "Choose Your Action",
			// showCancelButton: true,
			placement : sap.m.PlacementType.Top,

			// Adding create an appointment / task buttons

			buttons : [
					new sap.m.Button({
						text : this.getView().getModel("i18n")
								.getProperty("Appointment"),
						press : function(evt) {

							that.navToAppointmentDialog(evt);

						},

					}),
					new sap.m.Button({
						text : this.getView().getModel("i18n")
								.getProperty("Task"),
						press : function(evt) {

							that.navToTaskDialog(evt);
						},

					}),

					new sap.m.Button({
						text : this.getView().getModel("i18n")
								.getProperty(
										"Opportunity"),
						press : function(evt) {
							that.navToOpptDialog(evt);

						},

					}),

			]

		});
		
		//EXTENSION POINT to be able to extend follow up action list
		/**
		 * @ControllerHook extHookHandleOpen is the controller hook that provides for extension of newly added follow up buttons.
		 *                                   
		 * @callback cus.crm.mycalendar.AppointmentDetail.controller~extHookHandleOpen
		 * @param {object}
		 *           oEvent
		 * @return {void}
		 */
		if (this.extHookHandleOpen){
			this.extHookHandleOpen(oEvent);
		}

		this._actionSheet.openBy(oEvent.getSource());

	},

	
	navToAppointmentDialog : function(oEvent) {

		var oModel = this.getView().getModel();
		var oHeader = this.oModel.getContext("/" + this.sPath)
				.getObject();
		// this.headerGuid = oHeader.Guid;
		// this.transactionType = oHeader.ProcessType;

		// var oGuid =
		// this.byId('info').getModel('json').getData().Guid;
		// var oTransType =
		// this.byId('info').getModel('json').getData().ProcessType;
		var apptData;
		/*oModel.read("TransactionTypeSet", null, null, false,
				function(oData, resp) // [
										// "$filter=ProcessType
										// eq '" + pType+ "'" ]
				{
					apptData = {
							TransactionTypeSet : resp.data.results
					};

				});*/
		var bc = this.Context;
		var oGuid = this.oModel.getProperty(bc).Guid;
		var oTransType = this.oModel.getProperty(bc).TransactionType;
		
		

		
		oModel.read("AppFollowupTransTypes" ,
				null, {
					Guid : oModel.formatValue(oGuid,
					"Edm.Guid"),
			TransactionType : oModel.formatValue(
					oTransType,
					"Edm.String")
		}, false, function(oData, resp)						// eq '" + pType+ "'" ]
				{
					apptData = {
							TransactionTypeSet : resp.data.results
					};

				});
		this.appointmentFlag = true;
		if(apptData.TransactionTypeSet.length == 0)
		{
			 sap.ca.ui.message.showMessageBox({
		            type: sap.ca.ui.message.Type.ERROR,
		            message: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("view.Appointment.FOLLOWUPERROR")
		            
		        });
			 this.appointmentFlag = false;
		}
		else if (apptData.TransactionTypeSet.length == 1) {
			this.onlyOneProcessType = true;
			this.processType = apptData.TransactionTypeSet[0].ProcessTypeCode;
			this.ProcessTypeDescription = apptData.TransactionTypeSet[0].Description;
			this.PrivateFlag = apptData.TransactionTypeSet[0].PrivateFlag;
			this.selectProcess();

		} else {

			this.oActionSheet = sap.ui
					.xmlfragment(
							"cus.crm.mycalendar.view.ProcessTypeDialog",

							this);
			this.oActionSheet.setModel(this.getView().getModel(
					"i18n"), "i18n");
			var jsonModel = new sap.ui.model.json.JSONModel();
			jsonModel.setData(apptData);
			this.oActionSheet.setModel(jsonModel, "json");
			this.oActionSheet._searchField
					.setPlaceholder(sap.ca.scfld.md.app.Application
							.getImpl().getResourceBundle()
							.getText("SEARCH"));
			this.oActionSheet._list
					.setGrowingScrollToLoad(true);

			this.oActionSheet._dialog
					.setVerticalScrolling(true);
			this.oActionSheet.open();

		}

		// setting appointment flag to navigate to Appointment
		// application

	},
	navToTaskDialog : function(oEvent) {

		var oModel = this.getView().getModel();

		var bc = this.Context;
		var oGuid = this.oModel.getProperty(bc).Guid;
		var oTransType = this.oModel.getProperty(bc).TransactionType;
		var taskData;
		oModel.read("TaskFollowupTransTypes", null, {
			Guid : oModel.formatValue(oGuid,
			"Edm.Guid"),
	TransactionType : oModel.formatValue(
			oTransType,
			"Edm.String")
},
				false, function(oData, resp) // [
												// "$filter=ProcessType
												// eq '" +
												// pType+ "'" ]
				{
					taskData = {
							TransactionTypeSet : resp.data.results
					};

				});

		this.taskFlag = true;
		if(taskData.TransactionTypeSet.length == 0)
		{
			 sap.ca.ui.message.showMessageBox({
		            type: sap.ca.ui.message.Type.ERROR,
		            message: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("view.Appointment.FOLLOWUPERROR")
		            
		        });
			 this.taskFlag = false;
		
		}

		else if (taskData.TransactionTypeSet.length == 1) {
			this.onlyOneTaskProcessType = true;
			this.processType = taskData.TransactionTypeSet[0].ProcessTypeCode;
			this.ProcessTypeDescription = taskData.TransactionTypeSet[0].Description; 
			this.selectProcess();
		} else {
			this.oActionSheet = sap.ui
					.xmlfragment(
							"cus.crm.mycalendar.view.ProcessTypeDialog",

							this);
			var jsonModel = new sap.ui.model.json.JSONModel();
			jsonModel.setData(taskData);
			this.oActionSheet.setModel(jsonModel, "json");

			this.oActionSheet._searchField
					.setPlaceholder(sap.ca.scfld.md.app.Application
							.getImpl().getResourceBundle()
							.getText("SEARCH"));
			this.oActionSheet._list
					.setGrowingScrollToLoad(true);

			this.oActionSheet._dialog
					.setVerticalScrolling(true);

			this.oActionSheet.open();

			// setting appointment flag to navigate to
			// Appointment application

		}
	},
	navToOpptDialog : function(oEvent) {

		var oModel = this.getView().getModel();
		var bc = this.Context;
		var oGuid = this.oModel.getProperty(bc).Guid;
		var oTransType = this.oModel.getProperty(bc).TransactionType;
		var opptData;
		oModel.read("OpptFollowupTransTypes" ,
				null, {
					Guid : oModel.formatValue(oGuid,
					"Edm.Guid"),
			TransactionType : oModel.formatValue(
					oTransType,
					"Edm.String")
		}, false, function(oData, resp) // [
															// "$filter=ProcessType
															// eq
															// '" +
															// pType+
															// "'"
															// ]
				{
					opptData = {
							TransactionTypeSet : resp.data.results
					};

				});
		this.oppFlag = true;
		if(opptData.TransactionTypeSet.length == 0)
		{
			 sap.ca.ui.message.showMessageBox({
		            type: sap.ca.ui.message.Type.ERROR,
		            message: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("view.Appointment.FOLLOWUPERROR")
		            
		        });
			 this.oppFlag = false;
		
		}
		else if (opptData.TransactionTypeSet.length == 1) {
			this.onlyOneOppProcessType = true;
			this.processType = opptData.TransactionTypeSet[0].ProcessTypeCode;
			this.ProcessTypeDescription = opptData.TransactionTypeSet[0].Description;
			this.selectProcess();

		} else {

			this.oActionSheet = sap.ui
					.xmlfragment(
							"cus.crm.mycalendar.view.ProcessTypeDialog",

							this);
			this.oActionSheet.setModel(this.getView().getModel(
					"i18n"), "i18n");
			var jsonModel = new sap.ui.model.json.JSONModel();
			jsonModel.setData(opptData);
			this.oActionSheet.setModel(jsonModel, "json");
			this.oActionSheet._searchField
					.setPlaceholder(sap.ca.scfld.md.app.Application
							.getImpl().getResourceBundle()
							.getText("SEARCH"));
			this.oActionSheet._list
					.setGrowingScrollToLoad(true);
			this.oActionSheet._dialog
					.setVerticalScrolling(true);
			this.oActionSheet.open();

		}
	},
	cancelProcess: function(oEvent) {
		this.oppFlag = false;
		this.taskFlag = false;
		this.appointmentFlag = false;
	},
	selectProcess : function(oEvent) {

		// Getting context path
		var bc = this.Context;

		var headerGuid = this.oModel.getProperty(bc).Guid;
		var sPath = "/AppointmentSet(guid'" + headerGuid + "')";

		// common parameters from opportunity to appointment
		// console.log("title="+this.byId('opportunityHeader').getModel('json').getData().Description);
		var appointmentId = this.oModel.getProperty(bc).Id;
		var status = this.oModel.getProperty(bc).StatusTxt;
		var StartDate = this.oModel.getProperty(bc).FromDate;
		var AccountId = this.oModel.getProperty(bc).Account;
		var AccountName = this.oModel.getProperty(bc).AccountTxt;
		var ContactId = this.oModel.getProperty(bc).Contact;
		var ContactName = this.oModel.getProperty(bc).ContactTxt;
		var title = this.oModel.getProperty(bc).Description;
		var Guid = this.oModel.getProperty(bc).Guid;
		var Responsible=this.oModel.getProperty(bc).Responsible;
		var ResponsibleTxt=this.oModel.getProperty(bc).ResponsibleTxt;
		// console.log("AccountName"+AccountName+
		// "ContactName"+ContactName+"opportunity_id"+opportunityId+"status"+status+"StartDate"+StartDate+"ClosingDate"+ClosingDate);
		if (!(this.onlyOneOppProcessType
				|| this.onlyOneTaskProcessType || this.onlyOneProcessType))

		{
			var selectedItem = oEvent
					.getParameter("selectedItem");
			if (selectedItem) {
				this.processType = selectedItem
						.data("ProcessTypeCode");
				this.ProcessTypeDescription = selectedItem
				.data("ProcessTypeDescription");
				this.PrivateFlag = selectedItem
				.data("PrivateFlag");
			}
		}

		// console.log("window location" + this.processType);
		// console.log("window location" + oEvent);

		// var aItemPaths =
		// this.getView().getBindingContext().sPath.substr(1);

		// *XNav* (1) obtain cross app navigation interface
		var fgetService = sap.ushell && sap.ushell.Container
				&& sap.ushell.Container.getService;
		this.oCrossAppNavigator = fgetService
				&& fgetService("CrossApplicationNavigation");
		// console.log("window location" +this.appointmentFlag);

		if (this.appointmentFlag) {
			/*
			 * var ctx = this.oModel.getProperty(bc).Guid;
			 * this.oRouter.navTo("followupappointment", {
			 * contextPath : ctx, processType :
			 * this.processType, }, !jQuery.device.is.phone);
			 * 
			 * this.appointmentFlag=false;
			 */
			var bc = this.Context;
			var sUUID = this.oModel.getProperty(bc).Guid;
			// this.oRouter.navTo("editappointment",
			// {AppointmentID : sUUID}, false);
			sap.ca.ui.utils.busydialog.requireBusyDialog();
			this.PrivateFlag=false;
			this.oRouter.navTo("followupappointment", {
				// contextPath : cPath,
				processType : this.processType,
				AppointmentGuid : sUUID,
				privateFlag : this.PrivateFlag
			}, true);
			this.appointmentFlag = false;
			this.onlyOneProcessType = false;
			/*var message = this.oBundle.getText(
			"view.Appointment.followupsuccess");
			 sap.m.MessageToast.show(message, {
			   closeOnBrowserNavigation : false
			});*/
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
		}

		else if (this.oppFlag) {

			// *XNav (2) generate cross application link
			var toApp = this.oCrossAppNavigator
					&& this.oCrossAppNavigator
							.hrefForExternal({
								target : {
									/*  semanticObject :
									"Opportunity",
									 action: "Master"*/
									semanticObject : "Opportunity",
									action : "manageOpportunity"
										
								},
								// TODO
								 appSpecificRoute :[
													"&", "fulScrCreateFollowup",
													this.Context.substr(1), this.processType ]
													.join("/"),
								params : {
									"createFromAppt" : "X",
									"AccountName" : AccountName,
									"ContactName" : ContactName,
									"processType" : this.processType,
									"selectprocess_oEvent" : oEvent,
									"appointmentId" : appointmentId,
									"StartDate" : StartDate,
									"title" : title,
									"appointmentGuid": Guid,
									"Responsible":Responsible,
									"ResponsibleTxt":ResponsibleTxt,
									"AccountId":AccountId,
									"ContactId":ContactId,
									"ProcessTypeDescription": this.ProcessTypeDescription
								// "itemPaths" : aItemPaths
								}
							}) || "";

			this.oppFlag = false;
			this.onlyOneOppProcessType = false;
			// Navigate to the target
			window.location = toApp;
			/*var message = this.oBundle.getText(
					"view.Appointment.followupsuccess");
	     sap.m.MessageToast.show(message, {
		   closeOnBrowserNavigation : false
	});*/

		}

		else if (this.taskFlag) {
			// *XNav (2) generate cross application link
			var toApp = this.oCrossAppNavigator
					&& this.oCrossAppNavigator
							.hrefForExternal({
								target : {
									 semanticObject : "Task",
									 action: "manageTasks"
									/*semanticObject : "Task",
									action : "Master"*/
								},
								params : {
									"createFromAppt" : "X",
									"AccountId" : AccountId,
									"ContactId" : ContactId,
									"appointmentId" : appointmentId,
									"appointmentGuid": Guid,
									"title" : title,
									// "itemPaths" : aItemPaths
								},
								appSpecificRoute : [ "&",
										"newTask",
										this.processType ]
										.join("/")
							}) || "";

			this.taskFlag = false;
			this.onlyOneTaskProcessType = false;
			// Navigate to the target
			window.location = toApp;
			//
			/*var message = this.oBundle.getText(
			"view.Appointment.followupsuccess");
			 sap.m.MessageToast.show(message, {
			   closeOnBrowserNavigation : false
			});*/
		}

	},
	searchProcess : function(oEvent){
		var sValue = oEvent.getParameter("value");
		if (sValue !== undefined) {
			// apply the filter to the bound items, and the Select Dialog will update
			oEvent.getParameter("itemsBinding").filter([new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, sValue)]);
		}
	},

	/*selectProcess : function(oEvent) {
		if(!this.onlyOneProcessType)
		{
		var selectedItem = oEvent.getParameter("selectedItem");
		if (selectedItem) {
			this.processType= selectedItem.data("ProcessTypeCode");
		}
		}

		//this.getView().getController().setBtnEnabled("sort", false);
		//this.getView().getController().setBtnEnabled("BTN_S2_ADD", false);
		
		//Enable footer buttons in Set ListItem
		//this.firstCall="X";
		//sap.ui.getCore().byId('ProcessDialog').close();
	
		
//		var oCreateDate = this.oCal.getSelectedDates()[0] || this.oCal.getCurrentDate();
//		if (typeof oCreateDate === "string") {
//			oCreateDate = new Date(oCreateDate);
//		}
//		var sCreateDate = this.getDateParameterfromDate(oCreateDate);
//		
		var bc = this.Context ; 
		var sUUID = this.oModel.getProperty(bc).Guid;
		//this.oRouter.navTo("editappointment", {AppointmentID : sUUID}, false); 
		sap.ca.ui.utils.busydialog.requireBusyDialog();
		this.oRouter.navTo("followupappointment", {
			//contextPath : cPath,
			processType : this.processType,
			AppointmentID : sUUID
		},true);
		
		this.onlyOneProcessType=false;
		sap.ca.ui.utils.busydialog.releaseBusyDialog();
	},
	*/
	onAccount : function() {
		// show the business card of an account
		var oModel = this.getView().getModel();
		var oContext = this.getView().getBindingContext();
		var oDataEntry = oContext.getObject();
		var sPath = "/AccountCollection('" + oDataEntry.Account + "')";
		var sURLparameters = "$expand=MainAddress,MainContact/WorkAddress,Logo";
		if (this.isMock){
			sPath = "/AccountCollection(accountID='" + oDataEntry.Account + "')";
			sURLparameters = "";
		}
		var that = this;
		oModel.read(sPath, null, [sURLparameters], true, function(odata, response) {
			jQuery.sap.log.info("oData account response");
			
			var fnCallbackNavParaComp = jQuery
			.proxy(
					function(
							oEvent) {

						var oNavConfig = {};
						oNavConfig.target = {};
						oNavConfig.target.semanticObject = "Account";
						oNavConfig.target.action = "MyAccounts&/detail/AccountCollection('" + oDataEntry.Account + "')";
//						oNavConfig.params = {
//							accountID : this.accountNum
//						};
						this.navToOtherApp = true;
						
						return oNavConfig;

					},
					this);

			// initializing the attributes used for the business card
			var oTitle = that.oBundle.getText("view.Appointment.account_title");
			var oCompanyAddress = "";
			var oCompanyPhone = "";
			var oContactName = "";
			var oMobilePhone = "";
			var oOfficePhone = "";
			var oEmailAdress = "";
			var oCompanyName = "";
			var oLogo = "";

			if (odata.MainAddress) {
				oCompanyAddress = odata.MainAddress.address;
				oCompanyPhone = odata.MainAddress.phone;
			}
			if (odata.MainContact) {
				oContactName = odata.MainContact.fullName;
				if (odata.MainContact.WorkAddress !== null) {
					oMobilePhone = odata.MainContact.WorkAddress.mobilePhone;
					oOfficePhone = odata.MainContact.WorkAddress.phone;
					oEmailAdress = odata.MainContact.WorkAddress.email;
				}
			}
			if (odata.name1 && odata.name1 !== "") {
				oCompanyName = odata.name1;
			}
			// get account logo
			if (odata.Logo && odata.Logo.__metadata) {
				// defaul account log tbd
				var oMetadata = cus.crm.mycalendar.util.Conversions.formatPhotoUrl(odata.Logo.__metadata.media_src);
				oLogo = cus.crm.mycalendar.util.Conversions.urlConverter(oMetadata);
			}
			var oCompConfig = {
				title : oTitle,
				imgurl : oLogo,
				companyname : oCompanyName,
				companyphone : oCompanyPhone,
				companyaddress : oCompanyAddress,
				maincontactname : oContactName,
				maincontactmobile : oMobilePhone,
				maincontactphone : oOfficePhone,
				maincontactemail : oEmailAdress,
				beforeExtNav:fnCallbackNavParaComp
			};
			// get control that triggers the BusinessCard
			var oControl = that.getView().byId("accountField");
			// call 'Business Card' reuse component
			var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(oCompConfig);
			oCompanyLaunch.openBy(oControl);
		}, function(oError) {
			jQuery.sap.log.error("oData request for Account failed");
		});
	},

	onExtAttendee : function(oEvt) {
		// show the business card of an external attendee		
		var oContext = this.getView().getBindingContext();
		var appoitmentAccount=oContext.getObject().Account;
        var externalPartnerAccount=oEvt.getSource().AccountNo;
        if(appoitmentAccount==externalPartnerAccount||externalPartnerAccount==""){

		if (oEvt.getSource().PartnerNo !== '') {
			var oAccountContact = "contactID='" + oEvt.getSource().PartnerNo + "',accountID='" + appoitmentAccount;
			var sPath = "/ContactCollection(" + oAccountContact + "')";
			var sURLparameters = "$expand=WorkAddress,Account/MainAddress,Photo";
			if (this.isMock){
				sURLparameters = "";
			}
			var oSource = oEvt.getSource();
			var that = this;
			this.oModel.read(sPath, null, [sURLparameters], true, function(odata, response) {
				jQuery.sap.log.info("oData account response");

				// initializing the attributes used for the business card
				var oJSON = new sap.ui.model.json.JSONModel(odata);
				// using JSON model is just a workaround since function is a key word in JS
				var oContactFunction = oJSON.getProperty("/function");
				var oTitle = that.oBundle.getText("view.Appointment.contact_title");
				var oContactMobile = "";
				var oContactPhone = "";
				var oContactEmail = "";
				var oCompanyAddress = "";
				var oCompanyName = "";
				var oContactName = "";
				var oPhoto = "";

				if (odata.WorkAddress) {
					oContactMobile = odata.WorkAddress.mobilePhone;
					oContactPhone = odata.WorkAddress.phone;
					oContactEmail = odata.WorkAddress.email;
				}
				if (odata.Account) {
					if (odata.Account.MainAddress) {
						oCompanyAddress = odata.Account.MainAddress.address;
					}
					if (odata.Account.name1 && odata.Account.name1 !== "") {
						oCompanyName = odata.Account.name1;
					}
				}
				if (odata.fullName && odata.fullName !== "") {
					oContactName = odata.fullName;
				}
				// get contact photo
				if (odata.Photo && odata.Photo.__metadata) {
					var oMetadata = cus.crm.mycalendar.util.Conversions.formatPhotoUrl(odata.Photo.__metadata.media_src);
					oPhoto = cus.crm.mycalendar.util.Conversions.urlConverter(oMetadata);
				}
				var oEmpConfig = {
					title : oTitle,
					name : oContactName,
					imgurl : oPhoto,
					department : oContactFunction,
					contactmobile : oContactMobile,
					contactphone : oContactPhone,
					contactemail : oContactEmail,
					contactemailsubj : "",
					companyname : oCompanyName,
					companyaddress : oCompanyAddress
				};
				// call 'Business Card' reuse component
				var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(oEmpConfig);
				oEmployeeLaunch.openBy(oSource);
			}, function(oError) {
				if(oError.response.body.search("Specify at least one number for the business partner")){
				var sMessage = sap.ca.scfld.md.app.Application.getImpl().AppI18nModel.getResourceBundle().getText("NOT_IN_MAIN_CONTACT");
	            sap.ca.ui.message.showMessageToast(sMessage);
			}else{
				
			jQuery.sap.log.error("oData request for Contact failed");
			}
		});
	
    }
    }
	else{
        var sMessage = sap.ca.scfld.md.app.Application.getImpl().AppI18nModel.getResourceBundle().getText("NOT_IN_MAIN_CONTACT");
        sap.ca.ui.message.showMessageToast(sMessage);
        
 }
	},

	onIntAttendee : function(oEvt) {
		// show the business card of an internal attendee

		if (oEvt.getSource().PartnerNo !== '') {
			var sPath = "/EmployeeCollection('" + oEvt.getSource().PartnerNo + "')";
			var sURLparameters = "$expand=WorkAddress,Company,Photo";
			if (this.isMock){
				sPath = "/EmployeeCollection(employeeID='" + oEvt.getSource().PartnerNo + "')";
				sURLparameters = "";
			}			
			var oSource = oEvt.getSource();
			var that = this;
			this.oModel.read(sPath, null, [sURLparameters], true, function(odata, response) {
				jQuery.sap.log.info("oData employee response");

				// initializing the attributes used for the business card
				var oTitle = that.oBundle.getText("view.Appointment.employee_title");
				var oEmployeeMobile = "";
				var oEmployeePhone = "";
				var oEmployeeEmail = "";
				var oEmployeeDepartment = "";
				var oCompanyAddress = "";
				var oCompanyName = "";
				var oEmployeeName = "";
				var oPhoto = "";

				if (odata.WorkAddress) {
					oEmployeeMobile = odata.WorkAddress.mobilePhone;
					oEmployeePhone = odata.WorkAddress.phone;
					oEmployeeEmail = odata.WorkAddress.email;
					oEmployeeDepartment = odata.WorkAddress.department;
					oCompanyAddress = odata.WorkAddress.address;
				}
				// get company name
				if (odata.Company && odata.Company.name1) {
					oCompanyName = odata.Company.name1;
				}
				if (odata.fullName && odata.fullName !== "") {
					oEmployeeName = odata.fullName;
				}
				// get employee photo
				if (odata.Photo && odata.Photo.__metadata) {
					var oMetadata = cus.crm.mycalendar.util.Conversions.formatPhotoUrl(odata.Photo.__metadata.media_src);
					oPhoto = cus.crm.mycalendar.util.Conversions.urlConverter(oMetadata);
				}
				var oEmpConfig = {
					title : oTitle,
					name : oEmployeeName,
					imgurl : oPhoto,
					department : oEmployeeDepartment,
					contactmobile : oEmployeeMobile,
					contactphone : oEmployeePhone,
					contactemail : oEmployeeEmail,
					contactemailsubj : "",
					companyname : oCompanyName,
					companyaddress : oCompanyAddress
				};
				// call 'Business Card' reuse component
				var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(oEmpConfig);
				oEmployeeLaunch.openBy(oSource);
			}, function(oError) {
				jQuery.sap.log.error("oData request for employee failed");
			});
		}
	},

	onContact : function() {
		// show the business card of an account contact
		var oModel = this.getView().getModel();
		var oContext = this.getView().getBindingContext();
		var oDataEntry = oContext.getObject();
		var oAccountContact = "";
		if (oDataEntry.Contact !== '') {	
			if (oDataEntry.ContactAccount !== '') {
// first to check whether the contact is already assigned to a certain account in the edit view. If yes, use this account
				oAccountContact = "contactID='" + oDataEntry.Contact + "',accountID='" + oDataEntry.ContactAccount;
			} else if (oDataEntry.Account !== '') {
// if no account is assigned to the contact, use the account of the appointment for the business card of the contact if such an account exists
				oAccountContact = "contactID='" + oDataEntry.Contact + "',accountID='" + oDataEntry.Account;
			} 
			if (oAccountContact !== '') {
				var sPath = "/ContactCollection(" + oAccountContact + "')";
				var sURLparameters = "$expand=WorkAddress,Account/MainAddress,Photo";
				if (this.isMock){
					sURLparameters = "";
				}
				var that = this;
				oModel.read(sPath, null, [sURLparameters], true, function(odata, response) {
				jQuery.sap.log.info("oData account response");
				var oJSON = new sap.ui.model.json.JSONModel(odata);
				
				var fnCallbackNavPara = jQuery
				.proxy(
						function(
								oEvent) {

							var oNavConfig = {};
							oNavConfig.target = {};
							oNavConfig.target.semanticObject = "ContactPerson";
							if (oDataEntry.ContactAccount !== '') {
							oNavConfig.target.action = "MyContacts&/display/ContactCollection(contactID='" + oDataEntry.Contact + "',accountID='" + oDataEntry.ContactAccount + "')";
							}
							else if (oDataEntry.Account !== '') {
								oNavConfig.target.action = "MyContacts&/display/ContactCollection(contactID='" + oDataEntry.Contact + "',accountID='" + oDataEntry.Account + "')";
							}
						
						this.navToOtherApp = true;
							
							return oNavConfig;

						},
						this);

				// initializing the attributes used for the business card
				var oTitle = that.oBundle.getText("view.Appointment.contact_title");
				// using JSON model is just a workaround since function is a key word in JS
				var oContactFunction = oJSON.getProperty("/function");
				var oContactMobile = "";
				var oContactPhone = "";
				var oContactEmail = "";
				var oCompanyAddress = "";
				var oCompanyName = "";
				var oContactName = "";
				var oPhoto = "";

				if (odata.WorkAddress !== null) {
					oContactMobile = odata.WorkAddress.mobilePhone;
					oContactPhone = odata.WorkAddress.phone;
					oContactEmail = odata.WorkAddress.email;
				}
				if (odata.Account !== null) {
					if (odata.Account.MainAddress !== null) {
						oCompanyAddress = odata.Account.MainAddress.address;
					}
					if (odata.Account.name1 !== null) {
						oCompanyName = odata.Account.name1;
					}
				}
				if (odata.fullName !== null && odata.fullName !== "") {
					oContactName = odata.fullName;
				}
				// get contact photo
				if (odata.Photo && odata.Photo.__metadata) {
					var oMetadata = cus.crm.mycalendar.util.Conversions.formatPhotoUrl(odata.Photo.__metadata.media_src);
					oPhoto = cus.crm.mycalendar.util.Conversions.urlConverter(oMetadata);
				}
				var oContactConfig = {
					title : oTitle,
					name : oContactName,
					imgurl : oPhoto,
					department : oContactFunction,
					contactmobile : oContactMobile,
					contactphone : oContactPhone,
					contactemail : oContactEmail,
					contactemailsubj : "",
					companyname : oCompanyName,
					companyaddress : oCompanyAddress,
					beforeExtNav:fnCallbackNavPara
				};
				// get control that triggers the BusinessCard
				var oControl = that.getView().byId("contactField");
				// call 'Business Card' reuse component
				var oContactLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(oContactConfig);
				oContactLaunch.openBy(oControl);
			}, function(oError) {
				jQuery.sap.log.error("oData request for Contact failed");
			});
		}
	  }	
	},

	onResponsible : function() {
		// show the business card of an employee responsible
		var oEvt;
		var oModel = this.getView().getModel();
		var oContext = this.getView().getBindingContext();
		var oDataEntry = oContext.getObject();
		if (oDataEntry.Responsible !== '') {
			var sPath = "/EmployeeCollection('" + oDataEntry.Responsible + "')";
			var sURLparameters = "$expand=WorkAddress,Company,Photo";
			if (this.isMock){
				sPath = "/EmployeeCollection(employeeID='" + oEvt.getSource().PartnerNo + "')";
				sURLparameters = "";
			}			
			var that = this;
			this.oModel.read(sPath, null, [sURLparameters], true, function(odata, response) {
				jQuery.sap.log.info("oData employee response");

				// initializing the attributes used for the business card
				var oTitle = that.oBundle.getText("view.Appointment.employee_title");
				var oEmployeeMobile = "";
				var oEmployeePhone = "";
				var oEmployeeEmail = "";
				var oEmployeeDepartment = "";
				var oCompanyAddress = "";
				var oCompanyName = "";
				var oEmployeeName = "";
				var oPhoto = "";

				if (odata.WorkAddress) {
					oEmployeeMobile = odata.WorkAddress.mobilePhone;
					oEmployeePhone = odata.WorkAddress.phone;
					oEmployeeEmail = odata.WorkAddress.email;
					oEmployeeDepartment = odata.WorkAddress.department;
					oCompanyAddress = odata.WorkAddress.address;
				}
				// get company name
				if (odata.Company && odata.Company.name1) {
					oCompanyName = odata.Company.name1;
				}
				if (odata.fullName && odata.fullName !== "") {
					oEmployeeName = odata.fullName;
				}
				// get employee photo
				if (odata.Photo && odata.Photo.__metadata) {
					var oMetadata = cus.crm.mycalendar.util.Conversions.formatPhotoUrl(odata.Photo.__metadata.media_src);
					oPhoto = cus.crm.mycalendar.util.Conversions.urlConverter(oMetadata);
				}
				var oEmpConfig = {
					title : oTitle,
					name : oEmployeeName,
					imgurl : oPhoto,
					department : oEmployeeDepartment,
					contactmobile : oEmployeeMobile,
					contactphone : oEmployeePhone,
					contactemail : oEmployeeEmail,
					contactemailsubj : "",
					companyname : oCompanyName,
					companyaddress : oCompanyAddress
				};
				// get control that triggers the BusinessCard
				var oControl = that.getView().byId("responsibleField");
				// call 'Business Card' reuse component
				var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(oEmpConfig);
				oEmployeeLaunch.openBy(oControl);
			}, function(oError) {
				jQuery.sap.log.error("oData request for employee failed");
			});
		}
	},
	
    // Document HIstory is selected
    setDocumentHistory : function(odata){
           
                  var dataResults = odata.DocumentHistory.results;
                  this.newResult = odata.DocumentHistory.results;
           var that = this;
           var tab = that
                        .getView()
                        .byId(
                                      "DocHistory_Tab");
           var dataLength =  odata.DocumentHistory.results.length;
           var dataOppo = {
                  AppointmentDocHistory : []
           };
           for (var i = 0; i < dataLength; i++) {
                  var oppo = dataResults[i];
                  dataOppo.AppointmentDocHistory
                               .push(oppo);
           }
           var jsonModel = new sap.ui.model.json.JSONModel();

           jsonModel.setData(dataOppo);
           tab.setModel(
                                      jsonModel,
                                      "json");

           

    },     
    
    navigateDocHistory : function(oEvent) {
           var transactionID = oEvent.getSource().getText();
           var ObjectType = "";
           var sGuid = "";

           for (var i = 0; i < this.newResult.length; i++) {
                  if (transactionID == this.newResult[i].ObjectId) {
                        ObjectType = this.newResult[i].ObjectType;
                        sGuid = this.newResult[i].Guid;
                        break;
                  }
           }
           // Inter app navigation
           var fgetService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
           this.oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");
           
     if (ObjectType === "BUS2000111") {
     
                  var toApp = this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ 
                         target: { 
                                semanticObject : "Opportunity", 
                                action: "manageOpportunity&/display/Opportunities(guid'" + sGuid + "')"
                         }
                  }) || "";
                  
             window.location = toApp ;
     
      
           
       } else if (ObjectType === "BUS2000125") {  //Task
             
                  var toApp = this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ 
                         target: { 
                                semanticObject : "Task", 
                                action: "manageTasks&/taskOverview/Tasks(guid'"+ sGuid +"')"
                         }
                  }) || "";
                  
             window.location = toApp ;
             
       } else if (ObjectType === "BUS2000126") {  //Activity
     	  
           var toApp = this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ 
   		target: { 
   			semanticObject : "Appointment", 
   			action: "myAppointments&/appointment/"+sGuid
   		}
   	}) || "";
       window.location = toApp ;

     }else if (ObjectType === "BUS2000108") {  //Lead
   	  
           var toApp = this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ 
   		target: { 
   			semanticObject : "Lead", 
   			action: "manageLead&/display/Leads(guid'" + sGuid + "')"
   		}
   	}) || "";
       window.location = toApp ;

     }

},


	setAttendees_AccountLogo : function(odata) {
		this.getView().byId("attContainer").setVisible(true);
		this.getView().byId("noteContainer").setVisible(true);
		this.getView().byId("note").removeAllFields();
		var extAttList = this.getView().byId("externalAtt");
		// reset extAttList
		extAttList.removeAllFields();
		extAttList.destroyLabel();
		var intAttList = this.getView().byId("internalAtt");
		// reset intAttList
		intAttList.removeAllFields();
		intAttList.destroyLabel();

		var attList = [];
		attList = odata.Attendee.results;
		var oAttNum = 0;
		var oCounterExt = 0;
		var oCounterInt = 0;
		var oHLExt = new sap.ui.layout.HorizontalLayout({
			allowWrapping : true
		});
		var oHLInt = new sap.ui.layout.HorizontalLayout({
			allowWrapping : true
		});
		if (attList && attList !== []) {
			// get positions of last external and last internal attendee
			// get total number of attendees with a fullname
			for ( var i = 0; i < attList.length; i++) {
				if (!attList[i].IntAttendee && attList[i].FullName !== "") {
					// this is an external attendee
					oCounterExt = i;
					oAttNum++;
				} else if (attList[i].IntAttendee && attList[i].FullName !== "") {
					// this is an internal attendee
					oCounterInt = i;
					oAttNum++;
				}
			}
			for ( var i = 0; i < attList.length; i++) {
				var fullName;
				if (!attList[i].IntAttendee && attList[i].FullName !== "") {
					// this is an external attendee
					if (i < oCounterExt) {
						// unicode \u00A0 as whitespace is valid for chome, IE and firefox
						fullName = attList[i].FullName + ";\u00A0";
					} else {
						fullName = attList[i].FullName;
					}
					var extAttName = new sap.m.Link({
						press : [this.onExtAttendee, this],
						text : fullName
					});
					// get ContactID/PartnerNo and AccountNo to be used in the business card for contacts
					extAttName.PartnerNo = attList[i].PartnerNo;
					extAttName.AccountNo = attList[i].AccountNo;
					oHLExt.addContent(extAttName);
					if (i === oCounterExt) {
						extAttList.addField(oHLExt);
						// only show "external" label if there is at least one external attendee
						extAttList.setLabel(new sap.m.Label({
							text : "{i18n>view.Appointment.external}"
						}));
					}
				} else if (attList[i].IntAttendee && attList[i].FullName !== "") {
					// this is an internal attendee
					if (i < oCounterInt) {
						fullName = attList[i].FullName + ";\u00A0";
					} else {
						fullName = attList[i].FullName;
					}
					var intAttName = new sap.m.Link({
						press : [this.onIntAttendee, this],
						text : fullName
					});
					// get EmployeeID/PartnerNo to be used in the business card for employees
					intAttName.PartnerNo = attList[i].PartnerNo;
					oHLInt.addContent(intAttName);
					if (i === oCounterInt) {
						intAttList.addField(oHLInt);
						// only show "internal" label if there is at least one internal attendee
						intAttList.setLabel(new sap.m.Label({
							text : "{i18n>view.Appointment.internal}"
						}));
					}
				}
			}
			if (oAttNum === 0) {
				// show no attendee container if there is no attendee at all
				this.getView().byId("attContainer").setVisible(false);
			}
			var oTitle = this.oBundle.getText("view.Appointment.additionalAttendeeNumber", [oAttNum]);
			this.getView().byId("formAtt").setTitle(oTitle);
		}
		if (odata.Note === "") {
			// show no note container if there is no note at all
			this.getView().byId("noteContainer").setVisible(false);
		} else {
			var oNote = new sap.ca.ui.ExpansibleFeedListItem({
				showIcon : false,
				maxLines : 5,
				text : odata.Note
			});
			this.getView().byId("note").addField(oNote);
		}

		// if there is an account logo, show it in the appointment header else show the default logo for appointments
		var oAppointmentHD = this.getView().byId("ohdetail");
		oAppointmentHD.setIcon("sap-icon://appointment");

		if (odata.AccountRel.results && odata.AccountRel.results[0] && odata.AccountRel.results[0].Logo) {
			var oMetadata = odata.AccountRel.results[0].Logo.__metadata;
			if (oMetadata) {
				var oLogo = cus.crm.mycalendar.util.Conversions.urlConverter(cus.crm.mycalendar.util.Conversions
						.formatPhotoUrl(oMetadata.media_src));
				oAppointmentHD.setIcon(oLogo);
			}
		}
	},

	clearAttendees_AccountLogo : function() {
		this.getView().byId("formAtt").setTitle(this.oBundle.getText("view.Appointment.attendeeDataNumber", ["0"]));
		this.getView().byId("externalAtt").removeAllFields();
		this.getView().byId("internalAtt").removeAllFields();
		var oAppointmentHD = this.getView().byId("ohdetail");
		oAppointmentHD.setIcon("sap-icon://appointment");
	},

	clearAttachments : function() {
		if (this.isMock){
			return;
		}
		var oDataEmpty = {
			results : []
		};
		var oAttView = this.byId("attachmentsView");
		var oAttCont = oAttView.getController();
		oAttCont.refresh("", oDataEmpty);
	},

	getAttachments : function(attachments) {
		if (this.isMock){
			return;
		}
		// trigger refresh in attachment view
		var oAttView = this.byId("attachmentsView");
		var oAttCont = oAttView.getController();
		oAttCont.refresh(this.Context, attachments);
	},

	deleteAppointment : function(sContextPath) {
		
	  //unbindElement needed here due to some strange effect of rereading before getting to success callback
		this.getView().unbindElement();
		
		if (this.isMock) {
			sap.ca.ui.message.showMessageToast("Not suppported in mock mode");
			// back navigation
			window.history.go(-1);
		} else {
			// single calls will be wrapped into batch by sapui5 v. 16
			this.oModel.remove(sContextPath, {
				fnSuccess : jQuery.proxy(this.successDelete, this),
				fnError : jQuery.proxy(this.errorSave, this)
			});
		}
	},

	successDelete : function(oData, response) {
		// Notify listeners for the event that appointment has been deleted.
		sap.ui.getCore().getEventBus().publish("cus.crm.mycalendar", "appointmentDeleted");

		// message toast
		var sMessage = this.oBundle.getText("view.Appointment.deletesuccess");
		sap.ca.ui.message.showMessageToast(sMessage);
	
		// back navigation
		// unbind model from views
		this.getView().unbindElement();
		this.clearAttendees_AccountLogo();
		this.clearAttachments();

		// navigate
		var h =  new sap.ui.core.routing.History.getInstance();
		var dir = h.getDirection(""); 
		if (dir && dir !== sap.ui.core.routing.HistoryDirection.Unknown ) { //} && h._aHistory.length > 0) {
			window.history.go(-1);
		} else {
			// navigate to calendar
			var sDate = this.getDateParameterfromDate(new Date());
			this.oRouter.navTo("week", {Date: sDate}, true);  	// overwrite url
		}
	},

	
	// callback method in error case
	errorSave : function(oError) {
		// bind element again, as we do not navigate away.
		this.getView().bindElement(this.Context, {
			expand : "Attendee,AccountRel/Logo,AppointmentToAttachment"
		});
		jQuery.sap.log.error("oData delete failed");
		cus.crm.mycalendar.util.Util.showErrorMessagePopup(oError);
	},

	// Format of "From" and "To" Time and Date in Detail view Object Header depends upon From and To are on same Date
	// (day)
	// For same day, 1st field is the full date and 2nd field is time from to.
	// For different days, first field is From time and full date, second field is To time and full date
	formatFromDateInHeader : function(fromDate, toDate, allDay) {

		var sDate = "";
		var fromDatetimeOffset;
		var toDatetimeOffset;		
		if (fromDate !== null && toDate !== null && allDay !== null) {

			if (typeof fromDate === "string") {

				if (fromDate.substring(0, 6) === "/Date(") {
					// for mockmode
					fromDate = fromDate.replace("/Date(", "").replace(")/", "");
					fromDate = parseInt(fromDate); // number ms
					fromDate = new Date(fromDate);
				} else {
					// datepicker issue -> maybe remove when fixed
					// Wed Sep 18 2013 00:00:00 GMT+0200 (W. Europe Daylight Time)
					fromDate = new Date(fromDate);
				}
			}

			if (typeof toDate === "string") {

				if (toDate.substring(0, 6) === "/Date(") {
					// for mockmode
					toDate = toDate.replace("/Date(", "").replace(")/", "");
					toDate = parseInt(toDate); // number ms
					toDate = new Date(toDate);
				} else {
					// datepicker issue -> maybe remove when fixed
					// Wed Sep 18 2013 00:00:00 GMT+0200 (W. Europe Daylight Time)
					toDate = new Date(toDate);
				}
			}
			// Make new dates for formatting. Keep original date from binding as they are so it is not necessary
			// to make assumptions on order of formatiing From- and To- Dates in the header.
			var fromDisDate = new Date(fromDate);
			var toDisDate = new Date(toDate);

			// In the case of allDay appointments, backend has no time set, just date. JS assumes this is UTC and
			// converts to the browsers time zone. Therefore as workaround, take away time offset.
			if (allDay) {
			// timestamp of all day is based in UTC + 0 in oData, so ensure that implicit time conversion
			// is offset to ensure correct DATE.
				fromDatetimeOffset = fromDisDate.getTimezoneOffset();
				toDatetimeOffset = toDisDate.getTimezoneOffset();
				
				fromDisDate.setTime( fromDisDate.getTime() + fromDatetimeOffset * 60 * 1000 );
				toDisDate.setTime( toDisDate.getTime() + toDatetimeOffset * 60 * 1000 );				
			}

			// Determine if fromDate and toDate are the same day
			var fromDateOnly = new Date(fromDisDate);
			fromDateOnly.setHours(0, 0, 0, 0);
			var fromDateOnlyMs = fromDateOnly.getTime();

			var toDateOnly = new Date(toDisDate);
			toDateOnly.setHours(0, 0, 0, 0);
			var toDateOnlyMs = toDateOnly.getTime();

			var locale = new sap.ui.core.LocaleData(sap.ui.getCore().getConfiguration().getLocale());
			var pattern = locale.getDatePattern("full");
			var dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({
				pattern : pattern
			});

			var sDateOnly = dateFormatter.format(fromDateOnly);

			if (toDateOnlyMs == fromDateOnlyMs) {
				// The appointment starts and ends on the same day
				sDate = sDateOnly;
			} else {
				// The appointment starts and ends on a different day
				// var timeFormatter = sap.ui.core.format.DateFormat.getTimeInstance({
				// style : "short"
				// });

				var timePattern = locale.getTimePattern("short");
				var formatter = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern : timePattern
				});

				if (!allDay) {
					var sTime = formatter.format(fromDate);
					sDate = this.oBundle.getText("view.Appointment.fromTimeDate", [sTime, sDateOnly]);
				} else {
					sDate = sDateOnly;
				}

			}
		}
		return sDate;
	},

	// Format of "From" and "To" Time and Date in Detail view Object Header depends upon From and To are on same Date
	// (day)
	// For same day, 1st field is the full date and 2nd field is time from to.
	// For different days, first field is From time and full date, second field is To time and full date
	formatToDateInHeader : function(fromDate, toDate, allDay) {
		var date;
		var sDate = "";
		var fromDatetimeOffset;
		var toDatetimeOffset;		

		if (fromDate !== null && toDate !== null && allDay !== null) {

			if (typeof fromDate === "string") {

				if (fromDate.substring(0, 6) === "/Date(") {
					// for mockmode
					fromDate = fromDate.replace("/Date(", "").replace(")/", "");
					fromDate = parseInt(fromDate); // number ms
					fromDate = new Date(fromDate);
				} else {
					// datepicker issue -> maybe remove when fixed
					// Wed Sep 18 2013 00:00:00 GMT+0200 (W. Europe Daylight Time)
					fromDate = new Date(date);
				}
			}

			if (typeof toDate === "string") {

				if (toDate.substring(0, 6) === "/Date(") {
					// for mockmode
					toDate = toDate.replace("/Date(", "").replace(")/", "");
					toDate = parseInt(toDate); // number ms
					toDate = new Date(toDate);
				} else {
					// datepicker issue -> maybe remove when fixed
					// Wed Sep 18 2013 00:00:00 GMT+0200 (W. Europe Daylight Time)
					toDate = new Date(toDate);
				}
			}

			var fromDisDate = new Date(fromDate);
			var toDisDate = new Date(toDate);

			// In the case of allDay appointments, backend has no time set, just date. JS assumes this is UTC and
			// converts to the browsers time zone. Therefore as workaround, take away time offset (minutes)
			if (allDay) {
				fromDatetimeOffset = fromDisDate.getTimezoneOffset();
				toDatetimeOffset = toDisDate.getTimezoneOffset();				
				
				fromDisDate.setTime( fromDisDate.getTime() + fromDatetimeOffset * 60 * 1000 );
				toDisDate.setTime( toDisDate.getTime() + toDatetimeOffset * 60 * 1000 );				

			}

			// Determine if fromDate and toDate are the same day

			var fromDateOnly = new Date(fromDisDate);
			fromDateOnly.setHours(0, 0, 0, 0);
			var fromDateOnlyMs = fromDateOnly.getTime();

			var toDateOnly = new Date(toDisDate);
			toDateOnly.setHours(0, 0, 0, 0);
			var toDateOnlyMs = toDateOnly.getTime();

			var locale = new sap.ui.core.LocaleData(sap.ui.getCore().getConfiguration().getLocale());
			var pattern = locale.getTimePattern("short");

			var timeFormatter = sap.ui.core.format.DateFormat.getTimeInstance({
				pattern : pattern
			});

			var sTimeTo = timeFormatter.format(toDate);

			if (toDateOnlyMs == fromDateOnlyMs) {
				// The appointment starts and ends on the same day
				if (!allDay) {
					var sTimeStart = timeFormatter.format(fromDate);
					sDate = this.oBundle.getText("view.Appointment.timeToTime", [sTimeStart, sTimeTo]);
				} else {
					sDate = this.oBundle.getText("view.Appointment.alldayevent");
				}
			} else {
				// The appointment starts and ends on a different day
				pattern = locale.getDatePattern("full");
				var dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({
					pattern : pattern
				});

				var sDateOnly = dateFormatter.format(toDateOnly);

				if (!allDay) {
					sDate = this.oBundle.getText("view.Appointment.toTimeDate", [sTimeTo, sDateOnly]);
				} else {
					sDate = sDateOnly;
				}
			}
		}
		return sDate;
	},

/**
 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered (NOT before the
 * first rendering! onInit() is used for that one!).
 */
// onBeforeRendering : function() {
// },
/**
 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the
 * HTML could be done here. This hook is the same one that SAPUI5 controls get after being rendered.
 */
// onAfterRendering : function() {
// },
/**
 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
 */
// onExit: function() {
//
// }
	
	/* handling of backend error messages */

					openErrorFrag : function(oEvent) {

						this.errorDetails();

						this.showErrorMsgFragment.open();

					},


							errorDetails : function(oEvent) {
						var that = this;
						var oModel = this.getView().getModel();
						var oView = this.getView();

						var omsgcount;

						var oViewObject = oView.getBindingContext();

						var errorMSG;

						oModel

						.read(oViewObject.getPath() + "/" +

						"AppointmentLogSet",

						null,

						null,

						false,

						function(oData, resp) {

							errorMSG = {

								AppointmentLogSet : resp.data.results

							};

							that.omsgcount = resp.data.results.length;

						});

						this.showErrorMsgFragment.setModel(this.getView()

						.getModel("i18n"), "i18n");
                         //2q compatible
                        var msgtitle = cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.errorMessage",this.omsgcount);
						this.showErrorMsgFragment.setTitle(msgtitle);

						var jsonModel = new sap.ui.model.json.JSONModel();

						jsonModel.setData(errorMSG);

						this.showErrorMsgFragment.setModel(jsonModel, "json");
					},

					
       closeErrorFrag : function() {

						this.showErrorMsgFragment.close();
					},

});

},
	"cus/crm/mycalendar/view/AppointmentDetail.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View controllerName="cus.crm.mycalendar.view.AppointmentDetail"\n\txmlns="sap.m" xmlns:me="sap.me" xmlns:form="sap.ui.layout.form"\n\txmlns:element="sap.ui.layout.form.FormElement" xmlns:dlg="sap.m.dialog"\n\txmlns:layout="sap.ui.layout" xmlns:mvc="sap.ui.core.mvc" xmlns:core="sap.ui.core"\n\txmlns:caui="sap.ca.ui">\n\n\t<Page title="{i18n>view.Appointment.appointmentDetail}"\n\t\tshowNavButton="true" navButtonPress="onBack" id="detail">\n\t\t<content>\n\t\t\t<!-- Extension point to add additional detail -->\n\t\t\t<core:ExtensionPoint name="extensionDetail1">\n\n\t\t\t\t<ObjectHeader title="{Description}" titleActive="false"\n\t\t\t\t\tid="ohdetail"\n\t\t\t\t\tnumberUnit="{parts:[ {path:\'FromDate\'}, {path:\'ToDate\'}], formatter: \'cus.crm.mycalendar.util.Conversions.formatDuration\'}">\n\t\t\t\t\t<ObjectAttribute id="ProcessTypeDescription">\n\t\t\t\t\t</ObjectAttribute>\n\t\t\t\t\t<statuses>\n\t\t\t\t\t\t<ObjectStatus id="statusText_Detail" text="{StatusTxt}"\n\t\t\t\t\t\t\tstate="{path:\'Status\', formatter:\'cus.crm.mycalendar.util.Conversions.formatStatusText\'}"></ObjectStatus>\n\t\t\t\t\t\t<ObjectStatus id="prioText_Detail" text="{PriorityTxt}"></ObjectStatus>\n\t\t\t\t\t\t<ObjectStatus id="pf_Detail"\n\t\t\t\t\t\t\ttext="{path:\'PrivatFlag\', formatter:\'cus.crm.mycalendar.util.Conversions.formatPrivateDescription\'}"></ObjectStatus>\n\t\t\t\t\t</statuses>\n\t\t\t\t\t<attributes>\n\n\n\t\t\t\t\t\t<ObjectAttribute id="accountField"\n\t\t\t\t\t\t\ttext="{parts :[{path : \'AccountTxt\'},{path : \'Account\'}],formatter : \'cus.crm.mycalendar.util.Conversions.formatAccountText\'}"\n\t\t\t\t\t\t\tactive="true" press="onAccount"></ObjectAttribute>\n\t\t\t\t\t\t<ObjectAttribute id="location" text="{Location}"></ObjectAttribute>\n\t\t\t\t\t\t<ObjectAttribute id="contactField"\n\t\t\t\t\t\t\ttext="{path:\'ContactTxt\', formatter:\'cus.crm.mycalendar.util.Conversions.formatContactTxt\'}"\n\t\t\t\t\t\t\tactive="true" press="onContact"></ObjectAttribute>\n\t\t\t\t\t\t<ObjectAttribute id="responsibleField"\n\t\t\t\t\t\t\ttext="{path:\'ResponsibleTxt\', formatter:\'cus.crm.mycalendar.util.Conversions.formatResponsibleTxt\'}"\n\t\t\t\t\t\t\tactive="true" press="onResponsible"></ObjectAttribute>\n\t\t\t\t\t\t<ObjectAttribute id="fromDateInHeader"\n\t\t\t\t\t\t\ttext="{parts:[{path: \'FromDate\'}, {path: \'ToDate\'}, {path: \'AllDay\'}], formatter: \'.formatFromDateInHeader\'}"></ObjectAttribute>\n\t\t\t\t\t\t<ObjectAttribute id="toDateInHeader"\n\t\t\t\t\t\t\ttext="{parts:[{path: \'FromDate\'}, {path: \'ToDate\'}, {path: \'AllDay\'}], formatter: \'.formatToDateInHeader\'}"></ObjectAttribute>\n\t\t\t\t\t\t<!-- <ObjectAttribute text="{parts:[{path: \'ToDate\'}, {path: \'FromDate}], \n\t\t\t\t\t\t\tformatter: \'cus.crm.mycalendar.util.Conversions.formatToDateInHeader\'}"></ObjectAttribute> -->\n\n\t\t\t\t\t</attributes>\n\n\t\t\t\t</ObjectHeader>\n\n\t\t\t</core:ExtensionPoint>\n\t\t\t<!-- Extension point to add additional detail -->\n\t\t\t<core:ExtensionPoint name="extensionDetail2">\n\n\t\t\t\t<form:Form id="formAtt" visible="true">\n\t\t\t\t\t<form:formContainers>\n\t\t\t\t\t\t<form:FormContainer id="attContainer">\n\t\t\t\t\t\t\t<form:formElements>\n\t\t\t\t\t\t\t\t<form:FormElement id="externalAtt">\n\t\t\t\t\t\t\t\t\t<!-- fields of the formElement -->\n\t\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\t<form:FormElement id="internalAtt">\n\t\t\t\t\t\t\t\t\t<!-- fields of the formElement -->\n\t\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t</form:formElements>\n\t\t\t\t\t\t</form:FormContainer>\n\t\t\t\t\t</form:formContainers>\n\t\t\t\t\t<form:layout>\n\t\t\t\t\t\t<form:ResponsiveGridLayout id="responsiveGrid_Detail"\n\t\t\t\t\t\t\tlabelSpanM="12" labelSpanL="12" />\n\t\t\t\t\t</form:layout>\n\t\t\t\t</form:Form>\n\n\t\t\t</core:ExtensionPoint>\n\n\t\t\t<form:Form title="{i18n>view.Appointment.notes}" visible="true">\n\t\t\t\t<form:formContainers>\n\t\t\t\t\t<form:FormContainer id="noteContainer">\n\t\t\t\t\t\t<form:formElements>\n\t\t\t\t\t\t\t<form:FormElement id="note">\n\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t<!-- define the field for Notes in the controller and do reseting \n\t\t\t\t\t\t\t\t\t\tbefore showing a new note -->\n\t\t\t\t\t\t\t\t\t<!-- <caui:ExpansibleFeedListItem showIcon="false" maxLines="5" \n\t\t\t\t\t\t\t\t\t\ttext="{Note}" /> -->\n\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t</form:formElements>\n\t\t\t\t\t</form:FormContainer>\n\t\t\t\t</form:formContainers>\n\t\t\t\t<form:layout>\n\t\t\t\t\t<form:ResponsiveGridLayout />\n\t\t\t\t</form:layout>\n\t\t\t</form:Form>\n\n\t\t\t<!-- <form:SimpleForm maxContainerCols="2"> <form:content> -->\n\t\t\t<mvc:XMLView id="attachmentsView" viewName="cus.crm.mycalendar.view.Attachments" />\n\t\t\t<!-- </form:content> </form:SimpleForm> -->\n\t\t\t<!-- Extension point to add additional detail -->\n\t\t\t<core:ExtensionPoint name="extensionDetail3" />\n\t\t</content>\n\t\t\n\t\t<core:ExtensionPoint name="extBeforeDocHistory" />\n\t\t<Panel id="transactionHistoryData" expandable="true" expanded="false">\n\t\t\t<headerToolbar>\n\t\t\t\t<Toolbar>\n\t\t\t\t\t<Text text="{i18n>TRANS_HISTORY}" class="sapMH4FontSize" />\n\t\t\t\t</Toolbar>\n\t\t\t</headerToolbar>\n\t\t\t<content>\n\t\t\t\t<!-- Extension point to add additional Doc History Content -->\n\t\t\t\t<core:ExtensionPoint name="AppDocHistContentExtension"></core:ExtensionPoint>\n\t\t\t\t<Table id="DocHistory_Tab" inset="false"\n\t\t\t\t\titems="{json>/AppointmentDocHistory}" growing="true"\n\t\t\t\t\tgrowingThreshold="10" growingScrollToLoad="false">\n\t\t\t\t\t<columns>\n\t\t\t\t\t\t<!-- Additional column labels to be displayed when the user view the \n\t\t\t\t\t\t\ttransaction history -->\n\t\t\t\t\t\t<core:ExtensionPoint name="extDHLabelsStart" />\n\t\t\t\t\t\t<Column minScreenWidth="Tablet" demandPopin="true" hAlign="Center">\n\t\t\t\t\t\t\t<Text text="{i18n>TRANS_ID}" />\n\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t<Column minScreenWidth="Tablet" demandPopin="true" hAlign="Center">\n\t\t\t\t\t\t\t<Text text="{i18n>TRANS_TYPE}" />\n\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t<Column minScreenWidth="Tablet" demandPopin="true" hAlign="Center">\n\t\t\t\t\t\t\t<Text text="{i18n>TRANS_DESC}" />\n\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t<Column minScreenWidth="Tablet" demandPopin="true" hAlign="Center">\n\t\t\t\t\t\t\t<Text text="{i18n>CREATED_ON}" />\n\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t<Column minScreenWidth="Tablet" demandPopin="true" hAlign="Center">\n\t\t\t\t\t\t\t<Text text="{i18n>RELATIONSHIP}" />\n\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t<core:ExtensionPoint name="extDHLabelsEnd" />\n\t\t\t\t\t</columns>\n\t\t\t\t\t<items>\n\t\t\t\t\t\t<ColumnListItem>\n\t\t\t\t\t\t\t<cells>\n\t\t\t\t\t\t\t\t<!-- Additional column cells to be displayed when the user view the \n\t\t\t\t\t\t\t\t\ttransaction history -->\n\t\t\t\t\t\t\t\t<core:ExtensionPoint name="extDHValuesstart" />\n\t\t\t\t\t\t\t\t<Link id="TransactionIDText" text="{json>ObjectId}" press="navigateDocHistory"\n\t\t\t\t\t\t\t\t\tenabled="{path:\'json>ObjectType\' , formatter: \'cus.crm.mycalendar.util.Conversions.FormatDocHistory\'}" />\n\t\t\t\t\t\t\t\t<Text id="TransactionDesText" text="{json>TransTypeDesc}" />\n\t\t\t\t\t\t\t\t<Text id="DescriptionText" text="{json>Description}" />\n\t\t\t\t\t\t\t\t<Text id="CreatedOnText"\n\t\t\t\t\t\t\t\t\ttext="{path: \'json>CreatedAt\',  type:\'sap.ca.ui.model.type.Date\', formatOptions:{style:\'medium\'}}" />\n\t\t\t\t\t\t\t\t<Text id="relationship" text="{json>Relationship}" />\n\t\t\t\t\t\t\t\t<!-- Additional column cells to be displayed when the user view the \n\t\t\t\t\t\t\t\t\ttransaction history -->\n\t\t\t\t\t\t\t\t<core:ExtensionPoint name="extDHValuesEnd" />\n\n\t\t\t\t\t\t\t</cells>\n\t\t\t\t\t\t</ColumnListItem>\n\t\t\t\t\t</items>\n\t\t\t\t</Table>\n\t\t\t</content>\n\t\t</Panel>\n\n\n\t\t<footer>\n\t\t\t<Bar id="bar_Detail" translucent="false">\n\t\t\t\t<contentRight>\n\t\t\t\t\t<!-- Extension point to add additional footer content on right -->\n\t\t\t\t\t<core:ExtensionPoint name="extensionFooterContentRight" />\n\t\t\t\t\t<Button id="update" press="onUpdate" text="{i18n>view.Appointment.edit}"\n\t\t\t\t\t\ttype="Emphasized" />\n\t\t\t\t\t<Button id="delbut" text="{i18n>view.Appointment.delete}"\n\t\t\t\t\t\tpress="onDelete" />\n\t\t\t\t\t<Button id="followup" text="{i18n>view.Appointment.followup}"\n\t\t\t\t\t\tpress="onFollowup" />\n\t\t\t\t\t<Button id="messages" text="{i18n>view.Appointment.messages}"\n\t\t\t\t\t\tenabled="false" press="openErrorFrag" />\n\t\t\t\t</contentRight>\n\n\t\t\t</Bar>\n\t\t</footer>\n\n\t</Page>\n\n</core:View>\n',
	"cus/crm/mycalendar/view/AppointmentList.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("cus.crm.mycalendar.util.Util");
jQuery.sap.require("cus.crm.mycalendar.util.Conversions");
jQuery.sap.require("sap.ca.ui.utils.busydialog");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("cus.crm.mycalendar.util.Schema");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("cus.crm.mycalendar.view.AppointmentList", {

	filterAccountID : null, // cross nav filter : AccountID
	filterDate : new Date(), // cross nav filter : DisplayDate
	createFromNote: false,
	bTodayClicked : false, //up-port
	
	createFromOppt: false,
				processType : null,
				AccountName: null,
				title:null,
				ContactName: null,
			opportunityId:null,
			StartDate:null,
	
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created. Can be used to
	 * modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 */
	onInit : function() {
		sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit.call(this);
		
		if(!this.oApplicationFacade.getApplicationModel("customizing")){
			cus.crm.mycalendar.util.Util.initCustomizingModel(this);
		}
		

		this.calendarType = "W"; // calendar type W=week, M=month, D=day
		
		this.isMock = this.oApplicationFacade.isMock();
		this.bIsPhone = jQuery.device.is.phone;
        
		
		this.oPage = this.byId("appointmentListPage");
		this.oList = this.byId("l");
		
		//setting viem model to appointment list view
	    this.getView().setModel(new sap.ui.model.json.JSONModel({isSharedCalendar : false}),"vm");	
	
		this.sharedCalendar = sap.ui.xmlfragment(this
				.createId("sharedCalendarFragment"),
				"cus.crm.mycalendar.view.sharedDialog",
		
				this);
		this.oActionSheet = sap.ui.xmlfragment(
				"cus.crm.mycalendar.view.ProcessTypeDialog",
		
				this);
		this.mycalendar=this.byId("mycalendar");
		
		//up-port onAfter Rendering delegate for list - used when today button is clicked
		this.oList.addEventDelegate({onAfterRendering : jQuery.proxy(function(){
			
			//var ref = new sap.ushell.services.URLParsing();
			//var refString = ref.getHash(location.href);
			
			
			var now = new Date(new Date().toDateString());
			if(this.oList.getItems().length > 0 && this.bTodayClicked){
			
				window.setTimeout(jQuery.proxy(function(){this.oCal.fireTapOnDate({
				didSelect : true,
				date : now
			           });
				},this),100);
			
			this.bTodayClicked = false;
			}
		   },this) });
		
		this.oCal = this.byId("cal");
		this.oScroll = this.byId("scroll");
		this.oFilterBar = this.byId("filterPanel");
		this.oFilterText = this.byId("filtertext");
		this.oFooterBar = this.byId("master_footer");
		this.osbtnTimeSwitch = this.byId("sbtnTimeSwitch");

		this.oBundle = this.oApplicationFacade.getResourceBundle();

		var locale = new sap.ui.core.LocaleData(sap.ui.getCore().getConfiguration().getLocale());
		this.oCal.setFirstDayOffset(locale.getFirstDayOfWeek());

		// in phone mode icon, else text for add appointment button
		//this.bIsPhone ? this.byId("btnAdd").setIcon("sap-icon://add") : this.byId("btnAdd").setText(this.oBundle.getText("view.Appointment.add"));
		this.byId("btnAdd").setIcon("sap-icon://add");
		this.oModel = this.oApplicationFacade.getODataModel();
		this.oModel.attachRequestCompleted(this, this.onRequestCompleted, this);
		this.oModel.setCountSupported(false);
		this.oModel.setSizeLimit(5000);
		this.calendarsButton=this.byId("Calendar_type");
		var sBackendVersion = cus.crm.mycalendar.util.Schema._getServiceSchemaVersion(this.oModel,"Appointment");
		
		this.sBackendVersion = sBackendVersion;
		
		if(parseFloat(sBackendVersion) >= 3){
			this.calendarsButton.setVisible(true);
		}
		else{
			this.calendarsButton.setVisible(false);
		}

		// register for navigation
		this.oRouter.attachRouteMatched(function(oEvent) {
			jQuery.sap.log.info("### nav target:  " + oEvent.getParameter("name"));
			var dDate; 
			
			
			if (oEvent.getParameter("name") === "start" || oEvent.getParameter("name") === "catchall") {
				// check parameter is to early in cross app navigation use-case
				// this.checkStartupParameter();
				jQuery.sap.log.info("### AppointmentList Calendar   ### reRendering");
				this.onDisplayWeek();
				// required to get correct scroll view size
				this.oCal.rerender();
				this.filterDate = new Date(new Date().toDateString()); // today without time
				this.oCal.toggleDatesSelection([this.filterDate], true);
				this.getAppointmentList();
			}

			if ((oEvent.getParameter("name") === "month") || (oEvent.getParameter("name") === "month_phone")) {
				/*this.osbtnTimeSwitch.setSelectedButton(this.byId("btnMonth").getId());
				*/this.onDisplayMonth();
				
				if (oEvent.getParameter("arguments").Date) {
					if (oEvent.getParameter("arguments").Date.charAt(0) === "_"){
						dDate = this.getDatefromParameterString(oEvent.getParameter("arguments").Date.substring(1));
						this.oCal.toggleDatesSelection(this.oCal.getSelectedDates(), false);
					} else{
						dDate = this.getDatefromParameterString(oEvent.getParameter("arguments").Date);
						this.oCal.toggleDatesSelection([dDate], true);
						this.filterDate = dDate;
					}
					
					this.oCal.setCurrentDate(dDate);					
				
					if (oEvent.getParameter("name") === "month_phone") {
						//--up-port display appointment list in month view in mobile -SV 786701/2014
						this.oList.setVisible(true);
						this.oPage.setEnableScrolling(true);
					} else {
						this.oPage.setEnableScrolling(false);
						this.oList.setVisible(true);
					}
					jQuery.sap.log.info("### AppointmentList Calendar   ### reRendering");
					// required to get correct scroll view size
					this.oCal.rerender();
					this.getAppointmentList();
				}
			}
			if (oEvent.getParameter("name") === "week") {
				/*this.osbtnTimeSwitch.setSelectedButton(this.byId("btnWeek").getId());
				*/this.onDisplayWeek();
				
				if (oEvent.getParameter("arguments").Date) {
					
					if (oEvent.getParameter("arguments").Date.charAt(0) === "_"){
						dDate = this.getDatefromParameterString(oEvent.getParameter("arguments").Date.substring(1));
						this.oCal.toggleDatesSelection(this.oCal.getSelectedDates(), false);
					} else{
						dDate = this.getDatefromParameterString(oEvent.getParameter("arguments").Date);
						this.oCal.toggleDatesSelection([dDate], true);
						this.filterDate = dDate;
					}
					
					this.oCal.setCurrentDate(dDate);					
					this.oList.setVisible(true);

					jQuery.sap.log.info("### AppointmentList Calendar   ### reRendering");
					// required to get correct scroll view size
					this.oCal.rerender();
					this.getAppointmentList();
				}
			}
			
			if ((oEvent.getParameter("name") === "month/account") || (oEvent.getParameter("name") === "month_phone/account")) {
				/*this.osbtnTimeSwitch.setSelectedButton(this.byId("btnMonth").getId());
				*/this.onDisplayMonth();
				
				if (oEvent.getParameter("arguments").AccountID) {
					this.filterAccountID = oEvent.getParameter("arguments").AccountID;
					this.setAccountFilterText();
				}
				
				if (oEvent.getParameter("arguments").Date) {
				
					if (oEvent.getParameter("arguments").Date.charAt(0) === "_"){
						dDate = this.getDatefromParameterString(oEvent.getParameter("arguments").Date.substring(1));
						this.oCal.toggleDatesSelection(this.oCal.getSelectedDates(), false);
					} else{
						dDate = this.getDatefromParameterString(oEvent.getParameter("arguments").Date);
						this.oCal.toggleDatesSelection([dDate], true);
						this.filterDate = dDate;
					}
					
					this.oCal.setCurrentDate(dDate);
					
					if (oEvent.getParameter("name") === "month_phone/account") {
						this.oList.setVisible(false);
					} else {
						this.oList.setVisible(true);
					}
					jQuery.sap.log.info("### AppointmentList Calendar   ### reRendering");
					// required to get correct scroll view size
					this.oCal.rerender();
					this.getAppointmentList();
				}
			}
			if (oEvent.getParameter("name") === "week/account") {
				/*this.osbtnTimeSwitch.setSelectedButton(this.byId("btnWeek").getId());
				*/this.onDisplayWeek();
				
				if (oEvent.getParameter("arguments").AccountID) {
					this.filterAccountID = oEvent.getParameter("arguments").AccountID;
					this.setAccountFilterText();
				}
				
				if (oEvent.getParameter("arguments").Date) {
				
					if (oEvent.getParameter("arguments").Date.charAt(0) === "_"){
						dDate = this.getDatefromParameterString(oEvent.getParameter("arguments").Date.substring(1));
						this.oCal.toggleDatesSelection(this.oCal.getSelectedDates(), false);
					} else{
						dDate = this.getDatefromParameterString(oEvent.getParameter("arguments").Date);
						this.oCal.toggleDatesSelection([dDate], true);
						this.filterDate = dDate;
					}
					
					this.oCal.setCurrentDate(dDate);
				
					this.oList.setVisible(true);

					jQuery.sap.log.info("### AppointmentList Calendar   ### reRendering");
					// required to get correct scroll view size
					this.oCal.rerender();
					this.getAppointmentList();
				}
			}

			// scroll to filterDate
			var that = this;
			if (this.filterDate) {
				window.setTimeout(function() {
					jQuery.sap.log.info("### AppointmentList Calendar   ### scroll timer");
					that.scrollToDate(that.filterDate, that);
					that.filterDate = null;
					that.setScrollSize();
				}, 1800);
			}

		}, this);

		// correct size after reSize
		var that = this;
		window.onresize = function(evt) {
			that.setScrollSize();
		};
		
		var sBackendVersion = cus.crm.mycalendar.util.Schema._getServiceSchemaVersion(this.oModel,"Appointment");
		this.oVersioningModel = new sap.ui.model.json.JSONModel({});
		this._loadVersionSpecificUI(sBackendVersion);

	},
	
	_loadVersionSpecificUI : function(sBackendVersion){	
		
		if(sBackendVersion>=2)
			this._loadWave4UI();
		else
			this._loadWave3UI();		
		 	
	},	
		 	
	_loadWave3UI : function(){	

		this.byId('btnAdd').attachPress(jQuery.proxy(this.onCreate1,this)	);
		
		
	},	
		    	
	_loadWave4UI : function(){	

		this.byId('btnAdd').attachPress(jQuery.proxy(this.onCreate,this)	);
	},

	onBeforeRendering : function() {
		jQuery.sap.log.info("### AppointmentList Controller   ### beforeRendering");
		// add settings button & todays button in footer
		
		this.getView().getModel('controllers').getData().apptListController = this;
		this.defineButtons();
		// interpret startup parameter from cross app navigation
		this.checkStartupParameter();
		// set filter text if required (cross nav)
		this.setAccountFilterText();
	},

	onAfterRendering : function() {
		jQuery.sap.log.info("### AppointmentList Controller   ### afterRendering");
		
		if (this.createFromNote) {
			
			this.oRouter.navTo("newappointmentfromnote",{
				processType: this.processType,
				
		});
			
			this.createFromNote = false;
		}
			if (this.createFromOppt) {
		 						
		 			
		 					
		 					//this.oRouter.navTo("newappointmentfromoppt");
		 					this.oRouter.navTo("newappointmentfromoppt", {
		 						processType:this.processType,
		 										
		 					});
		 					
		 					this.createFromOppt = false;
			
		}
	},

	setAccountFilterText : function() {
		var sText = this.oBundle.getText("view.Appointment.filteraccount");

		if (this.filterAccountID) {
			this.oFilterText.setText(sText + " " + this.filterAccountID);
			this.oFilterBar.setHeight("32px");
			this.oFilterBar.setVisible(true);
		} else {
			this.oFilterBar.setVisible(false);
		}
		// read name of account
		if (this.filterAccountID && !this.isMock) {
			var oSearchModel = this.oModel;
			var that = this;
			oSearchModel.read("/AccountCollection('" + this.filterAccountID + "')", null, null, false, function(data, response) {
				if (data.name1) {
					var sText = that.oBundle.getText("view.Appointment.filteraccount");
					that.oFilterText.setText(sText + " " + data.name1);
				}
			});
		}
	},

	checkStartupParameter : function() {
		if (!this.firstTime) {
			this.firstTime = true;
			var oStartupParameter = this.getView().getModel("startupParameters");
			this.filterAccountID = null;
			if (oStartupParameter && oStartupParameter.oData) {
				if (oStartupParameter.oData.parameters) {
					for ( var param in oStartupParameter.oData.parameters) {
						if (oStartupParameter.oData.parameters[param].key == "createFromNote") {
							this.createFromNote = true;
							
						}
						
					if (oStartupParameter.oData.parameters[param].key == "createFromOppt") {
							this.createFromOppt = true;
						}
						if (oStartupParameter.oData.parameters[param].key == "processType") {
							this.processType = oStartupParameter.oData.parameters[param].value;
						}
						if (oStartupParameter.oData.parameters[param].key == "AccountName") {
							this.AccountName = oStartupParameter.oData.parameters[param].value;
						}
						if (oStartupParameter.oData.parameters[param].key == "title") {
							this.title = oStartupParameter.oData.parameters[param].value;
						}
						if (oStartupParameter.oData.parameters[param].key == "ContactName") {
							this.ContactName = oStartupParameter.oData.parameters[param].value;
						}
						if (oStartupParameter.oData.parameters[param].key == "opportunityId") {
							this.opportunityId = oStartupParameter.oData.parameters[param].value;
						}
						if (oStartupParameter.oData.parameters[param].key == "StartDate") {
							this.StartDate = oStartupParameter.oData.parameters[param].value;
//							delete oStartupParameter.oData.parameters[param];
						}

						if (oStartupParameter.oData.parameters[param].key == "accountID") {
							this.filterAccountID = oStartupParameter.oData.parameters[param].value;
//							delete oStartupParameter.oData.parameters[param];
						}
						if (oStartupParameter.oData.parameters[param].key == "Date") {
							this.filterDate = oStartupParameter.oData.parameters[param].value;
//							delete oStartupParameter.oData.parameters[param];
						}

					}
					if (this.filterDate) {
						var dDate = this.getDatefromParameterString(this.filterDate);
						if (dDate) {
							this.oCal.setCurrentDate(dDate);
						}
					}
					if (this.filterAccountID) {
						// reload of data with correct selection criteria required
						this.getAppointmentList();
					}
				}
			}
//			if ( !this.createFromNote ) {
//				delete oStartupParameter.oData.parameters[param];
//			}
		}
	},

	// callback for odata model
	onRequestCompleted : function(ev) {
		jQuery.sap.log.info("### AppointmentList Controller   ### oData request completed");
		var sText = this.oBundle.getText("view.Appointment.appointment_nodata");
		this.oList.setNoDataText(sText);
		this.setScrollSize();

		if (this.oList.getBinding('items')) {
			var numberOfAppointments = this.oList.getBinding('items').getLength();
			if (typeof cus.crm.myaccounts !== 'undefined' && typeof cus.crm.myaccounts.NavigationHelper !== 'undefined'
					&& typeof cus.crm.myaccounts.NavigationHelper.qty !== 'undefined' ) {
				if (cus.crm.myaccounts.NavigationHelper.qty > numberOfAppointments &&  typeof this.filterAccountID  !== 'undefined') {
					sap.ca.ui.message.showMessageToast(this.oApplicationFacade.getResourceBundle().getText("LIST_FILTERED_BY_MYITEMS",
							[numberOfAppointments, cus.crm.myaccounts.NavigationHelper.qty]));

				}
				// Not needed again. Clear the variable
				cus.crm.myaccounts.NavigationHelper.qty = undefined;			
			}
		}
	},

	// read data
	getAppointmentList : function() {
		jQuery.sap.log.info("### AppointmentList Controller   ### getAppointmentList");
		var that=this;
		if(this.selectedEmp){
			this.oPage.setTitle(that.employeeName+" "+that.oBundle.getText("view.Appointment.apptitle"));
		}
		else{
			this.oPage.setTitle(that.oBundle.getText("view.Appointment.apptitle"));
			
		}

		var sText = this.oBundle.getText("view.Appointment.loaddatatext");
		this.oList.setNoDataText(sText);
		var oListItem = this.byId("AppListItem");
		// remove template, because data binding will clone this template / avoid empty AppointmentSet oData call
		this.oList.removeItem(oListItem);

		var aFilter = this.getViewFilters();

		var that = this;
		var oDateSorter = new sap.ui.model.Sorter("FromDate", false, function(oContext) {
			
			var sDate = oContext.getProperty("FromDate");
			var sDateEnd = oContext.getProperty("ToDate");	
			
			if (typeof sDate === "string") {
				// for mock data
				sDate = sDate.replace("/Date(", "").replace(")/", "");
				var iDate = parseInt(sDate);
			  sDate = new Date(iDate);
				sDateEnd = sDateEnd.replace("/Date(", "").replace(")/", "");
			  iDate = parseInt(sDateEnd);
			  sDateEnd = new Date(iDate);				
			} 			
			
			// Try All Day Stuff
			var sAllDayFlag = oContext.getProperty("AllDay");
			
			if (sAllDayFlag) {
				// If true, then adjust the startdate according to the offsets, because all day comes from back end
				// with datetime stamp at GMT				
				var fromDatetimeOffset = sDate.getTimezoneOffset();
				var toDatetimeOffset = sDateEnd.getTimezoneOffset();
				
				sDate.setTime( sDate.getTime() + fromDatetimeOffset * 60 * 1000 );
				sDateEnd.setTime( sDateEnd.getTime() + toDatetimeOffset * 60 * 1000 );			
			}
			
			var dtformatter = sap.ui.core.format.DateFormat.getDateInstance({
				style : "full"
			});

			return {
				key : that.getDateString(sDate),
				text : dtformatter.format(sDate)
			};
		});

		// delete all markers in calendar
		this.oCal.removeTypesOfAllDates(); // is not working for own Types like
		// TypeDot
		this.oCal._removeStyleClassOfAllDates("sapMeCalendarTypeDot");

		// bind data
		this.oList.bindAggregation("items", {
			path : "/AppointmentSet",
			template : oListItem,
			sorter : oDateSorter,
			filters : aFilter,
			groupHeaderFactory : function(oGroup) {
				var header = new sap.m.GroupHeaderListItem({
					title : oGroup.text
				});
				if (oGroup.key === that.getDateString(new Date())) {
					// add style for todays group header
					header.addStyleClass("sapMLabelBold");
				}
				// mark day in calendar
				that.oCal.toggleDatesType([oGroup.key], "TypeDot", true);
				header.setUpperCase(false);
				return header;
			}
		});
	},

	onTodayClick : function(targetDate) {
		// today without timepart
		var now;
		if (targetDate) {
			now = targetDate;
		} else {
			now = new Date(new Date().toDateString());
		}

		if (now < this.calFromRange || this.calToRange < now) {
			// load data --> date/now is not loaded
			this.getAppointmentList();
			//up-port
			this.bTodayClicked = true;
		}
		else{
			// simulate tap on todays day to scroll
			this.oCal.fireTapOnDate({
				didSelect : true,
				date : now
			});
			
		}
		this.filterDate = now;
	},

	onDateClicked : function(oEvent) {
		if (this.calendarType == "D") {
			this.getAppointmentList();
		}
		if (this.bIsPhone && this.calendarType == "M") {
			// navigate to week view only for Phone
			var oClickDate = new Date(oEvent.getParameter("date"));
			this.oCal.setCurrentDate(oClickDate);
			this._buttonDisplayWeek();
			return;
		}
		if (this.calendarType !== "D") {
			// scroll to day in list
			var oClickDate = new Date(oEvent.getParameter("date"));
			
			if (oEvent.getSource().getSelectedDates.length == 0) {
				this.oCal.toggleDatesSelection([oClickDate], true);
			}
			this.scrollToDate(oClickDate, this);
		}
	},

	scrollToDate : function(date, that) {

		
		  var dateTimeFormatter = sap.ui.core.format.DateFormat.getDateInstance({style : 'full'});
		  var dateText = dateTimeFormatter.format(date);
		  var items = that.oList.getItems();
		  var start = items[0].getDomRef().getBoundingClientRect().top;
		  var end = 0;
		  var bFound = false;
		  for(var i = 0; i < items.length; i++){
		  
		      if(!items[i].getBindingContext()){
		    	 items[i].removeStyleClass("sapMLabelBold");
			     if( items[i].getTitle() === dateText){
			      bFound = true;
		          end  = items[i].getDomRef().getBoundingClientRect().top;
		          items[i].addStyleClass("sapMLabelBold");
		       }
			     
		      }
		  
		  }
		  if(bFound){
		  that.byId('scroll').scrollTo(0,that.modulus(start - end),500);
		  }
		
	
	},

	setScrollSize : function() {
		// correct size for startup
		var pFooterRef = this.oFooterBar.getDomRef();
		var pCalRef = this.oCal.getDomRef();

		if (pFooterRef && pCalRef) {
			var posFooter = pFooterRef.getBoundingClientRect();
			var posCal = pCalRef.getBoundingClientRect();
			var size = (posFooter.top - posCal.bottom);
			var sSize = "" + size + "px";
			if (size > 0 && sSize != this.oScroll.getHeight()) {
				this.oScroll.setHeight(sSize);
				jQuery.sap.log.info("### Set scroll size   ### size -- " + size);
				this.oScroll.rerender();
			}
		}
	},

	defineButtons : function() {
		this.oFooterBar.destroyContentLeft();
		// add settings button
		
		
		/*try {
			var oSettingsButton = sap.ushell.services.AppConfiguration.getSettingsControl();
			oSettingsButton.setText("");
			oSettingsButton.setWidth("");
			this.oFooterBar.addContentLeft(oSettingsButton);
		} catch (err) {
			jQuery.sap.log.warning("### Setting button from uShell could not be added  ###");
		}

        */
		
		
		
		// add todays button manually because settings button shall be most left button
		var oBtnToday;
		if (this.bIsPhone) {
			//this.oPage.setShowHeader(false);

			oBtnToday = new sap.m.Button({
				press : jQuery.proxy(this._buttonToday, this),
				icon : "sap-icon://appointment-2"
			});
		} else {
			oBtnToday = new sap.m.Button({
				press : jQuery.proxy(this._buttonToday, this),
				text : "{i18n>view.Appointment.today_tt}"
			});

		}
		this.oFooterBar.addContentLeft(oBtnToday);

		// boarder for calendar
		this.oCal.addStyleClass("calendarBoarder");
	},

	// /////////////////////////////////////////////
	// event handler from sap.me.calendar
	onCurrentDateChanged : function(oEvent) {
		this.getAppointmentList();
		this.oCal.toggleDatesSelection(this.oCal.getSelectedDates(), false);
	},

	onDateRangeChanged : function() {
	},
	// /////////////////////////////////////////////

	onDisplayMonth : function(oEvent) {
		this.oCal.setMonthsPerRow(1);
		this.oCal.setWeeksPerRow(1);
		this.oCal.setSingleRow(false);
		this.oCal.setVisible(true);
		this.calendarType = "M";
		this.oCal.setSwipeToNavigate(true);
		this.oCal.unselectAllDates();
			
	},

	onDisplayDay : function(oEvent) {
		this.oCal.setMonthsPerRow(1);
		this.oCal.setWeeksPerRow(1);
		this.oCal.setSingleRow(true);
		this.oCal.setVisible(true);
		this.calendarType = "D";
		this.oCal.setSwipeToNavigate(true);
		this.oCal.unselectAllDates();
	},

	onDisplayWeek : function(oEvent) {
		this.oCal.setMonthsPerRow(1);
		this.oCal.setWeeksPerRow(1);
		this.oCal.setSingleRow(true);
		this.oCal.setVisible(true);
		this.calendarType = "W";
		this.oCal.setSwipeToNavigate(true);
		this.oCal.unselectAllDates();
	},

	// returns relevant filters for the appointment list
	getViewFilters : function() {
		var aDateFilter = [];
 
		var cal = this.byId("cal");
		var sDate = cal.getCurrentDate();
		var oSelDate = new Date(sDate);
		var oDateFrom = new Date(sDate);
		var oDateTo = new Date(sDate);
		var iDayIndex = oSelDate.getDay(); // 0 Sun, 1 Mon....
		var oFromOffset = 0;
		var oToOffset = 0;

    if (this.isMock){
    	// filter not yet supported in mockmode
    	return aDateFilter;
    }		
		
		if (this.calendarType == "W") {
			// week mode
			var iOffset = cal.getFirstDayOffset(); // 0 sunday
			var iOffsetFrom = iDayIndex - iOffset;
			var iOffsetTo = 7 - iOffsetFrom; // 7 days a week

			oDateFrom.setDate(oSelDate.getDate() - iOffsetFrom);
			oDateTo.setDate(oSelDate.getDate() + iOffsetTo); // weekslot
			// minus 1 sec
			oDateTo.setTime(oDateTo.getTime() - 1);

			this.calFromRange = oDateFrom;
			this.calToRange = oDateTo;
		} else if (this.calendarType == "M") {
			// month mode
			var year = oSelDate.getFullYear();
			var month = oSelDate.getMonth();

			oDateFrom = new Date(year, month, 1);
			oDateTo = new Date(year, month + 1, 1); // 1 month + 1 day
			oDateTo.setTime(oDateTo.getTime() - 1); // minus 1 sec

			this.calFromRange = oDateFrom;
			this.calToRange = oDateTo;
		} else if (this.calendarType == "D") {
			// day mode --- just show first selected date
			var sSelection = this.oCal.getSelectedDates()[0];
			if (!sSelection) {
				sSelection = cal.getCurrentDate();
			}
			var oSelection = new Date(sSelection);
			oDateFrom = oSelection;
			oDateTo = oSelection;
			oDateTo.setDate(oDateTo.getDate() + 1); // 1 day
			oDateTo.setTime(oDateTo.getTime() - 1); // minus 1 sec

			this.calFromRange = oSelection;
			this.calToRange = oSelection;
		}

		var oFilter;
			jQuery.sap.log.info("### Query filter   ### search from    -- " + oDateFrom);
			jQuery.sap.log.info("### Query filter   ### search to      -- " + oDateTo);

			oFilter = new sap.ui.model.odata.Filter("FromDate", [{
				operator : "BT",
				value1 : oDateFrom,
				value2 : oDateTo
			}]);
			aDateFilter.push(oFilter);
// Add the user (frontend) timezone offset so that backend can
// look for the time zone adjusted appoinments
			oFromOffset = oDateFrom.getTimezoneOffset();
			oToOffset = oDateTo.getTimezoneOffset();
			oFilter = new sap.ui.model.odata.Filter("FromOffset", [{
				operator : "EQ",
				value1 : oFromOffset			}]);
			aDateFilter.push(oFilter);
			oFilter = new sap.ui.model.odata.Filter("ToOffset", [{
				operator : "EQ",
				value1 : oToOffset			}]);
			aDateFilter.push(oFilter);
			
			
			
			// filter for cross nav use case
			if (this.filterAccountID) {
				oFilter = new sap.ui.model.odata.Filter("Account", [{
					operator : "EQ",
					value1 : this.filterAccountID
				}]);
				aDateFilter.push(oFilter);
			}

			/*// to see only "my appointments"
			// all -> ResponsArea EQ 0
			// my -> ResponsArea EQ X
			oFilter = new sap.ui.model.odata.Filter("ResponsArea", [{
				operator : "EQ",
				value1 : 'X'
			}]);
			aDateFilter.push(oFilter);
		*/

			// to see only "my appointments"
			// all -> ResponsArea EQ 0
			// my -> ResponsArea EQ X
			
			
			if(this.selectedEmp)
				{
				oFilter = new sap.ui.model.odata.Filter("ResponsArea", [{
					operator : "EQ",
					value1 : '0'
				}]);
				aDateFilter.push(oFilter);
				var aFilter1 = new sap.ui.model.Filter("Responsible",
						sap.ui.model.FilterOperator.EQ, this.selectedEmp);
				aDateFilter.push(aFilter1);
				
			
				}
			else{
				oFilter = new sap.ui.model.odata.Filter("ResponsArea", [{
					operator : "EQ",
					value1 : 'X'
				}]);
				aDateFilter.push(oFilter);
			}
		return aDateFilter;
	},

	// ///////////////////////////////////////////////////////////////////////////////
	// conversion functions
	// ///////////////////////////////////////////////////////////////////////////////

	getDateString : function(d) {
		var sDay = d.getDate().toString();
		sDay = (sDay.length === 1) ? "0" + sDay : sDay;
		var sMonth = d.getMonth() + 1; // Months are zero based
		sMonth = sMonth.toString();
		sMonth = (sMonth.length === 1) ? "0" + sMonth : sMonth;
		var sYear = d.getFullYear();
		// Safari browser: The pattern yyyy-MM-dd isn't an officially supported format for Date constructor but yyyy/MM/dd
		var sDate = sYear + "/" + sMonth + "/" + sDay;
		return sDate;
	},

	getDatefromString : function(datetime) {
		// mock data json now "FromDate":
		// "/Date(1356998400000)/",
		datetime = datetime.replace("/Date(", "").replace(")/", "");
		datetime = parseInt(datetime); // number ms
		datetime = new Date(datetime);
		return datetime;
	},

	getDatefromParameterString : function parse(str) {
		// format: yyymmdd --> Date
		if (!/^(\d){8}$/.test(str))
			return null;
		var y = str.substr(0, 4), m = str.substr(4, 2) - 1, d = str.substr(6, 2);
		return new Date(y, m, d);
	},

	getDateParameterfromDate : function(d) {
		// format: Date --> yyymmdd
		var sDay = d.getDate().toString();
		sDay = (sDay.length === 1) ? "0" + sDay : sDay;
		var sMonth = d.getMonth() + 1; // Months are zero based
		sMonth = sMonth.toString();
		sMonth = (sMonth.length === 1) ? "0" + sMonth : sMonth;
		var sYear = d.getFullYear();
		var sDate = "" + sYear + sMonth + sDay;
		return sDate;
	},

	// ///////////////////////////////////////////////////////////////////////////////
	// view interactions
	// ///////////////////////////////////////////////////////////////////////////////

	// Displaying an Appointment
	onAppointmentClicked : function(oEvt) {
		
		var oContext = oEvt.getSource().getBindingContext();
		var bc = oContext.getPath();
		var oData = oContext.getObject(); 
		var checkPrivate = oData.PrivatFlag;
		var description = oData.Description;
		if(checkPrivate==true && this.selectedEmp){
			sap.ca.ui.message.showMessageToast(this.oApplicationFacade.getResourceBundle().getText("view.Appointment.privateMessage"));
			
		}
		else{
			if(this.dayActionSheet != undefined)	//Clearing action sheet button when navigating to detail
				this.dayActionSheet = undefined;
			
			var sUUID = this.oModel.getProperty(bc).Guid;
			this.oRouter.navTo("appointment", {
				AppointmentID : sUUID
			},false);}
	},
	onDay:function(oEvent) {
		var that = this;
		if(!this.dayActionSheet){
		this.dayActionSheet = new sap.m.ActionSheet({
			// title : "Choose Your Action",
			// showCancelButton: true,
			placement : sap.m.PlacementType.Top,

			// Adding create an appointment / task buttons

			buttons : [
					new sap.m.Button({
						text : this.getView().getModel("i18n")
								.getProperty("view.Appointment.week"),
								enabled:false,
						press : function(evt) {

							that._buttonDisplayWeek();

						},

					}),
					new sap.m.Button({
						text : this.getView().getModel("i18n")
								.getProperty("view.Appointment.month"),
						press : function(evt) {

							that._buttonDisplayMonth();
						},

					}),

					
					]

		});
		}

		this.dayActionSheet.openBy(oEvent.getSource());

	
	},
	onCalendar:function(oEvent) {
		var that = this;
		if(!this.calendarActionSheet){
		this.calendarActionSheet = new sap.m.ActionSheet({
			// title : "Choose Your Action",
			// showCancelButton: true,
			placement : sap.m.PlacementType.Top,

			// Adding create an appointment / task buttons

			buttons : [
					new sap.m.Button({
						
						text : this.getView().getModel("i18n")
								.getProperty("view.Appointment.mycalendar"),
						
						enabled:false,
						press : function(evt) {

							that._buttonDisplayMyCalendar();

						},

					}),
					new sap.m.Button({
						
						text : this.getView().getModel("i18n")
								.getProperty("view.Appointment.sharedCalendars"),
						
						press : function(evt) {

							that._buttonDisplaySharedCalendar();
						},

					}),

					
					]

		});
		}

		this.calendarActionSheet.openBy(oEvent.getSource());

	
	},

	// button click: clear Account Filterbar (from CrossApp Navigation)
	onClearFilter : function() {
		this.filterAccountID = null;
		// navigat to get bookmark ... after navigation data is loaded
		//up-port also close the toolbar - set it to visible false 
		this.byId('filterbar').setVisible(false);
		
		if (this.calendarType == "M") {
			this._buttonDisplayMonth();
		} else if (this.calendarType == "W") {
			this._buttonDisplayWeek();
		} else if (this.calendarType == "D") {
			this._buttonDisplayDay();
		}
	},
	
	
	onCreate : function(oEvent) {
		
		//if (!this.oActionSheet) {
			
			 var oModel = this.getView().getModel();
			
			var data1;
			var sBackendVersion = cus.crm.mycalendar.util.Schema._getServiceSchemaVersion(this.oModel,"Appointment");
			
			var sUrl;
			if(parseFloat(sBackendVersion) >= 4.0){
			sUrl = "TransactionTypes";
			
			}
			else{
			sUrl = "TransactionTypeSet";			
			}
			var that = this;
			oModel.read( sUrl,null,null,false,function(oData,resp) //[ "$filter=ProcessType eq '" + pType+ "'" ]
					{ 
		                 data1 = {
		                		 TransactionTypeSet : resp.data.results
					    };
		                 
		                 if(parseFloat(sBackendVersion) >= 4){
		                	
		                	 var oCustModel = that.oApplicationFacade.getApplicationModel("customizing");
		                	 var oData = oCustModel.oData;
		                	 oData.TransactionTypeSet = data1.TransactionTypeSet;
		                	 
		                 }
		                
					});
		
			if(data1.TransactionTypeSet.length==1)
			{
			this.onlyOneProcessType=true;
			this.processType=data1.TransactionTypeSet[0].ProcessTypeCode;
			this.ProcessTypeDescription = data1.TransactionTypeSet[0].Description;
			this.PrivateFlag = data1.TransactionTypeSet[0].PrivateFlag;
			this.selectProcess();
			
			}
			else
				{
				
			this.oActionSheet = sap.ui.xmlfragment(
					"cus.crm.mycalendar.view.ProcessTypeDialog",
			
					this);
			this.oActionSheet.setModel(this.getView().getModel(
			"i18n"), "i18n");
			var jsonModel = new sap.ui.model.json.JSONModel();
			jsonModel.setData(data1);
            this.oActionSheet.setModel(jsonModel,"json"); 
			this.oActionSheet._searchField.setPlaceholder(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SEARCH"));
			this.oActionSheet._list.setGrowingScrollToLoad(true);
			
			
			this.oActionSheet._dialog.setVerticalScrolling(true);
			this.oActionSheet.open();
				}
	},
	
	selectProcess : function(oEvent) {
		
		var sTransactionType;
		if(this.onlyOneProcessType){
			sTransactionType = this.processType;
		}
		else{
			sTransactionType = oEvent.getParameters().selectedItem.getBindingContext("json").getObject().ProcessTypeCode;
		}
		
		var bReturn = cus.crm.mycalendar.util.Util.getCustomizing(sTransactionType,this);
		
		if(bReturn === false){
			return;
		}
		
		if(this.dayActionSheet != undefined) 	//Clearing action sheet button when navigating to NewAppointment
			this.dayActionSheet = undefined;
		
		if(!this.onlyOneProcessType)
		{
		var selectedItem = oEvent.getParameter("selectedItem");
		if (selectedItem) {
			this.processType= selectedItem.data("ProcessTypeCode");
			this.processTypeDesc = selectedItem.data("ProcessTypeDescription");
			this.PrivateFlag = selectedItem.data("PrivateFlag");
		}
		}

		//this.getView().getController().setBtnEnabled("sort", false);
		//this.getView().getController().setBtnEnabled("BTN_S2_ADD", false);
		
		//Enable footer buttons in Set ListItem
		//this.firstCall="X";
		//sap.ui.getCore().byId('ProcessDialog').close();
	
	   	
		var oCreateDate = this.oCal.getSelectedDates()[0] || this.oCal.getCurrentDate();
		if (typeof oCreateDate === "string") {
			oCreateDate = new Date(oCreateDate);
		}
		var sCreateDate = this.getDateParameterfromDate(oCreateDate);
		
		
		sap.ca.ui.utils.busydialog.requireBusyDialog();
		 if(this.createFromOppt ==="X")
		 					{
		 					this.oRouter.navTo("newappointmentfromnote",
		 					{processType : this.processType
		 					},true);
		 						
		 					}
		else if(this.createFromNote ==="X")
			{
			this.oRouter.navTo("newappointmentfromnote",
			{processType : this.processType
			
			},true);
			
			}
		
		else {
			if(this.PrivateFlag == undefined)
				this.PrivateFlag = false;
		this.oRouter.navTo("newappointment", {
			//contextPath : cPath,
			Date : sCreateDate,
			processType : this.processType,
			privateFlag: this.PrivateFlag
		},false);
		
		}
		 this.onlyOneProcessType=false;
		sap.ca.ui.utils.busydialog.releaseBusyDialog();
	},
	
	
	
//search in process type dialog
	/*searchProcess : function(oEvent){
		var sValue = oEvent.getParameter("value");
		if (sValue !== undefined) {
			// apply the filter to the bound items, and the Select Dialog will update
			oEvent.getParameter("itemsBinding").filter([new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, sValue)]);
		}
	},*/
	searchProcess : function(oEvent){
		var itemsBinding = oEvent
		.getParameter("itemsBinding");
		var that=this;
		var data_len;
		var sText = this.oBundle.getText("view.Appointment.loaddatatext");
		
		this.oActionSheet.setNoDataText(sText);
		var sValue = oEvent.getParameter("value");
		if (sValue !== undefined) {
			// apply the filter to the bound items, and the Select Dialog will update
			itemsBinding.filter([new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, sValue)]);
			data_len=itemsBinding.filter([new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, sValue)]);
		
		if(data_len.iLength==0){
			var sText = this.oBundle.getText("view.Appointment.no_data_text");
			that.oActionSheet.setNoDataText(sText);
		
		}}},
		onSharedSearch : function(oEvent){
			//this.isSearch=false;
			var aFilters = [];
			var sPath="";
			/*var sValue = oEvent.oSource.getValue();*/
			var sValue = this.sharedCalendar.getSubHeader().getContentLeft()[0].getValue();
			
			var infoTool = this.sharedCalendar.getContent()[0].getInfoToolbar();
			
			var oModel = this.getView().getModel();
			
			var data1;
			if(sValue==""){
				sPath = "EmployeeCollection?$filter=IsMyEmployee eq true";
				infoTool.setVisible(true);
			}
			else{
			 sPath = "EmployeeCollection";
			 infoTool.setVisible(false);
			}
			if(sValue!=""){
			aFilters.push(new sap.ui.model.Filter("fullName",sap.ui.model.FilterOperator.Contains, sValue));
			}
			
			var that=this;
			oModel.read(sPath,{
				  async : true,
				  context : null,
				  urlParameters : null,
				  filters : aFilters,
				  success : function(oData,response){
					  
					  data1 = {
			            		
				    		 EmployeeCollection :   response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]	        		
				    	
					  }; 
					  var jsonModel = new sap.ui.model.json.JSONModel();
						jsonModel.setData(data1);
					    that.sharedCalendar.setModel(jsonModel,"showJson");},
				  error : function(oError){
						
					        }
				  
			  });
			this.sharedCalendar.setModel(this.getView().getModel("i18n"), "i18n");
			//	this.sharedCalendar.setModel(cus.crm.mycalendar.util.Util.getSearchModel(this.oModel.sServiceUrl, this.isMock), "sm");
				/*var jsonModel = new sap.ui.model.json.JSONModel();
				jsonModel.setData(data1);
			    this.sharedCalendar.setModel(jsonModel,"showJson");*/
			
			
			
		},
	
	

	// button click: Create New Appointment --> navigate to create screen
	onCreate1 : function(oEvent) {

		var oCreateDate = this.oCal.getSelectedDates()[0] || this.oCal.getCurrentDate();
		if (typeof oCreateDate === "string") {
			oCreateDate = new Date(oCreateDate);
		}
		var sCreateDate = this.getDateParameterfromDate(oCreateDate);
		this.oRouter.navTo("newappointmentw3", {
			Date : sCreateDate
		}, 
		false); // do not write entry in browser history 
	},
	_buttonDisplaySharedCalendar : function(oEvent){
		var oModel = this.getView().getModel();
		
		var data1;
		
			oModel.read("EmployeeCollection?$filter=IsMyEmployee eq true",null,null,false,function(oData,resp) //[ "$filter=ProcessType eq '" + pType+ "'" ]
					{ 
			             data1 = {
			            		 EmployeeCollection : resp.data.results
					    };
			            
					});
			
		
		
		this.sharedCalendar.setModel(this.getView().getModel("i18n"), "i18n");
	
		var jsonModel = new sap.ui.model.json.JSONModel();
		jsonModel.setData(data1);
	    this.sharedCalendar.setModel(jsonModel,"showJson");
	    this.getView().getModel("vm").oData.isSharedCalendar = false;
	    
	  /*  var aFilter=[];
		var that=this;
		
		aFilter.push(new sap.ui.model.Filter("IsMyEmployee",sap.ui.model.FilterOperator.EQ, true));
			oModel.read("EmployeeCollection",null,null,false,function(oData,resp) //[ "$filter=ProcessType eq '" + pType+ "'" ]
					{ 
			             data1 = {
			            		 EmployeeCollection : resp.data.results
					    };
			            
					});
		oModel.read("EmployeeCollection",{
			  async : true,
			  context : null,
			  urlParameters : null,
			  filters : aFilter,
			  success : function(oData,response){
				  
				  data1 = {
		            		
			    		 EmployeeCollection :   response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]	        		
			    	
				  };
				  that.sharedCalendar.setModel(this.getView().getModel("i18n"), "i18n");
					
					var jsonModel = new sap.ui.model.json.JSONModel();
					jsonModel.setData(data1);
				    that.sharedCalendar.setModel(jsonModel,"showJson");
				  
				  },
				  error : function(oError){
						
			        }
				 
			  
		  });*/
			
		
	    //this.sharedCalendar.mAggregations.subHeader.mAggregations.contentLeft[0].setValue("");       //---> prio1 Code check error
	    this.sharedCalendar.getAggregation("subHeader").getAggregation("contentLeft")[0].setValue("");
	    this.onSharedSearch();
		this.sharedCalendar.open();
	},
	closeSharedCalendar : function(oEvent){
		
		this.sharedCalendar.close();
	},
sharedAppointment : function(oEvent){
		
		var selectedItem = oEvent.getParameter("listItem");
		if (selectedItem) {
			this.selectedEmp= selectedItem.getBindingContext('showJson').getObject().employeeID;
			this.employeeName=selectedItem.getBindingContext('showJson').getObject().fullName;
			this.getAppointmentList();
			/*this.mycalendar.setEnabled(true);*/
			this.calendarActionSheet.getAggregation("buttons")[0].setEnabled(true);
			this.getView().getModel("vm").oData.isSharedCalendar = true;
		}
		else{
			this.getView().getModel("vm").oData.isSharedCalendar = false;	
		}
		
		//this.getAppointmentList(this.selectedEmp);
		this.sharedCalendar.close();
	},
_buttonDisplayMyCalendar: function(oEvent) {
	    this.getView().getModel("vm").oData.isSharedCalendar = false;
		this.selectedEmp=null;
		
		this.getAppointmentList();
		this.calendarActionSheet.getAggregation("buttons")[0].setEnabled(false);
		/*this.calendarActionSheet.getAggregation("buttons")[0].setProperty(Enabled,false);*/
		/*this.mycalendar.setEnabled(false);*/
	},
	
	// button click: show todays week/month and todays appointments
	_buttonToday : function() {
		this.oCal.setCurrentDate(new Date()); // navigate to todays month/week
		this.oCal.unselectAllDates();
		this.oCal.toggleDatesSelection([new Date()], true); // mark day as
		// selected
		this.onTodayClick(); // load data
	},

	// button click: calendar in Month View
	_buttonDisplayMonth : function() {
		var sDate; 
		this.dayActionSheet.getAggregation("buttons")[0].setEnabled(true);
		this.dayActionSheet.getAggregation("buttons")[1].setEnabled(false);
		// try to get selected day
		if (this.oCal.getSelectedDates().length > 0) {
			sDate = this.getDateParameterfromDate(new Date(this.oCal.getSelectedDates()[0]));
		} else {
		// indicator _ for not to mark day in target view
			sDate = "_" + this.getDateParameterfromDate(this.calToRange);
		}
		this.onDisplayMonth(null);
		// navigate
		if (this.bIsPhone) {
			if (!this.filterAccountID) {
				this.oRouter.navTo("month_phone", {
					Date : sDate
				},true);
			} else {
				this.oRouter.navTo("month_phone/account", {
					Date : sDate,
					AccountID : this.filterAccountID
				},true);
			}
		} else {
			if (!this.filterAccountID) {
				this.oRouter.navTo("month", {
					Date : sDate
				},true);
			} else {
				this.oRouter.navTo("month/account", {
					Date : sDate,
					AccountID : this.filterAccountID
				},true);
			}
		}
	},

	// button click: calendar in Week View
	_buttonDisplayWeek : function() {
		var sDate;
		this.dayActionSheet.getAggregation("buttons")[0].setEnabled(false);
		this.dayActionSheet.getAggregation("buttons")[1].setEnabled(true);
		// try to get selected day
		if (this.oCal.getSelectedDates().length > 0) {
			sDate = this.getDateParameterfromDate(new Date(this.oCal.getSelectedDates()[0]));
		} else {
			// indicator _ for not to mark day in target view
			sDate = "_" + this.getDateParameterfromDate(this.calFromRange);
		}
		this.onDisplayWeek(null);
		// navigate
		if (!this.filterAccountID) {
			this.oRouter.navTo("week", {
				Date : sDate
			},true);
		} else {
			this.oRouter.navTo("week/account", {
				Date : sDate,
				AccountID : this.filterAccountID
			},true);
		}
	},
	_expandFollowup : function(oEvent) {
		
		  var that=this;
   	      this._actionSheet = new sap.m.ActionSheet({
	      // title: "Choose Your Action",
	      //showCancelButton: true,
	      placement: sap.m.PlacementType.Top,
	
	  // Adding create an appointment / task buttons
	      
	      buttons: [
	        new sap.m.Button({
	        text : this
			.getView().getModel("i18n")
			.getProperty("Appointment"),
			press: function(evt) {
				
	             that.navToAppointmentDialog(evt);
	     	        
			},
	        
	        }),
	      
	      ]
	       
	    });
	     
	
	 this._actionSheet.openBy(oEvent.getSource());
		
	},
	
    navToAppointmentDialog : function(oEvent) {
    	
		 var oModel = this.getView().getModel();
		 var oHeader = this.oModel.getContext("/" + this.sPath).getObject();
		 //this.headerGuid = oHeader.Guid;
		 //this.transactionType = oHeader.ProcessType;
		
		 //var oGuid = this.byId('info').getModel('json').getData().Guid;
		 //var oTransType = this.byId('info').getModel('json').getData().ProcessType;
		var data1;
        var sBackendVersion = cus.crm.mycalendar.util.Schema._getServiceSchemaVersion(this.oModel,"Appointment");
		
		oModel.read(((parseFloat(sBackendVersion) >= 4.0)) ? "TransactionTypes" : "TransactionTypeSet",null,null,false,function(oData,resp) 
				{ 
	                 data1 = {
	                		 TransactionTypeSet : resp.data.results
				    };
	                
				});
		
				
				if(data1.TransactionTypeSet.length==1)
				{
				this.onlyOneProcessType=true;
				this.processType=data1.TransactionTypeSet[0].ProcessTypeCode;
				this.selectProcess();
				
				}
				else
					{
					
				this.oActionSheet = sap.ui.xmlfragment(
						"cus.crm.mycalendar.view.ProcessTypeDialog",
				
						this);
				this.oActionSheet.setModel(this.getView().getModel(
				"i18n"), "i18n");
				var jsonModel = new sap.ui.model.json.JSONModel();
				jsonModel.setData(data1);
	            this.oActionSheet.setModel(jsonModel,"json"); 
				this.oActionSheet._searchField.setPlaceholder(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SEARCH"));
				this.oActionSheet._list.setGrowingScrollToLoad(true);
				
				
				this.oActionSheet._dialog.setVerticalScrolling(true);
				this.oActionSheet.open();
					
			}
		
		
		
	// setting appointment flag to navigate to Appointment application	
		
		
   },

	// button click: calendar in Day View
	_buttonDisplayDay : function() {
		// navigate
	},
	modulus : function(number){

		 if(number < 0){
		   return -number;
		 }
		return number;
		},
		
		
		
});

},
	"cus/crm/mycalendar/view/AppointmentList.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" xmlns:me="sap.me" xmlns:util="cus.crm.mycalendar.util" controllerName="cus.crm.mycalendar.view.AppointmentList" xmlns:html="http://www.w3.org/1999/xhtml">\n\t<!-- displayBlock="true" -->\n\n\t<Page id="appointmentListPage" enableScrolling="false" title="{i18n>view.Appointment.apptitle}" navButtonPress="_navBack" \n\t\t\tshowNavButton="true"> \n\t\t<content>\n \n\t\t\t<Panel id="filterPanel">\n\t\t\t\t<infoToolbar>\n\t\t\t\t\t<Toolbar id="filterbar" visible="true" press="onClearFilter" active="true">\n\t\t\t\t\t\t<Label id="filtertext" text="{i18n>view.Appointment.filteraccount}" />\n\t\t\t\t\t\t<ToolbarSpacer />\n\t\t\t\t\t\t<core:Icon src="sap-icon://sys-cancel" />\n\t\t\t\t\t</Toolbar>\n\t\t\t\t</infoToolbar>\n\t\t\t</Panel>\n\n\n\t\t\t<me:Calendar width="100%" id="cal" singleRow="true" firstDayOffset="1" tapOnDate="onDateClicked" changeRange="onDateRangeChanged" changeCurrentDate="onCurrentDateChanged" visible="true">\n\t\t\t</me:Calendar>\n\n\t\t\t<ScrollContainer id="scroll" width="100%" horizontal="false" vertical="true">\n\t\t\t\t<content>\n\t\t\t\t\t<List id="l" noDataText="{i18n>view.Appointment.appointment_nodata}">\n\t\t\t\t\t\t<items>\n\t\t\t\t\t\t<!-- Extension point to add additional list item -->\n\t\t\t\t\t\t  \t<core:ExtensionPoint name="extensionListItem">\n\t\t\t\t\t\t  \t\n\t\t\t\t\t\t\t\t<util:ApptListItem id="AppListItem" \n\t\t\t\t\t\t\t\t\ttitle="{parts:[{path: \'Description\'},{path: \'ProcessTypeDescription\'}, {path : \'vm>/isSharedCalendar\'}], formatter: \'cus.crm.mycalendar.util.Conversions.formatDescrType\'}" \n\t\t\t\t\t\t\t\t\tpress="onAppointmentClicked" \n\t\t\t\t\t\t\t\t\tsubtitle="{parts:[ {path:\'Location\'}, {path:\'AccountTxt\'}, {path : \'Account\'}, {path:\'ContactTxt\'},{path : \'vm>/isSharedCalendar\'}], formatter: \'cus.crm.mycalendar.util.Conversions.formatAccountContact\'}" \n\t\t\t\t\t\t\t\t\tlocation="{Location}" \n\t\t\t\t\t\t\t\t\ttime="{parts:[{path: \'FromDate\'},{path: \'AllDay\'}], formatter: \'cus.crm.mycalendar.util.Conversions.formatTime\'}" \n\t\t\t\t\t\t\t\t\tduration="{parts:[ {path:\'FromDate\'}, {path:\'ToDate\'}], formatter: \'cus.crm.mycalendar.util.Conversions.formatDuration\'}"\n\t\t\t\t\t\t\t\t\ttype="Active"  \n\t\t\t\t\t\t\t\t\tprivat="{PrivatFlag}"> \n\t\t\t\t\t\t\t\t\t<util:content>\n\t\t\t\t\t\t\t\t\t\t<ObjectStatus id="statusText" text="{StatusTxt}" state="{path:\'Status\', formatter:\'cus.crm.mycalendar.util.Conversions.formatStatusText\'}"></ObjectStatus>\n\t\t\t\t\t\t\t\t\t</util:content>\n\t\t\t\t\t\t\t\t\t<util:content>\n\t\t\t\t\t\t\t\t\t\t<core:Icon id="attachmentIcon" src="sap-icon://attachment" size="1rem" visible="{path:\'HasAttachment\'}"> \n\t\t\t\t\t\t\t\t\t\t</core:Icon>\n\t\t\t\t\t\t\t\t\t</util:content>\n\t\t\t\t\t\t\t\t</util:ApptListItem>\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t</core:ExtensionPoint>\n\t\t\t\t\t\t</items>\n\t\t\t\t\t</List>\n\n\t\t\t\t</content>\n\t\t\t</ScrollContainer>\n\n\t\t</content>\n\n\t\t<footer>\n\t\t\t<Bar translucent="false" id="master_footer">\n\t\t\t\t<contentMiddle>\n\t\t\t\t\t<!-- <SegmentedButton id="sbtnTimeSwitch" selectedButton=\'btnWeek\'>\n\t\t\t\t\t\t<buttons> -->\n\t\t\t\t\t\t\t<!-- <Button id="btnWeek" text="{i18n>view.Appointment.week}" tap="_buttonDisplayWeek" width="40%"/>\n\t\t\t\t\t\t\t<Button id="btnMonth" text="{i18n>view.Appointment.month}" tap="_buttonDisplayMonth" width="40%"/>\n\t\t\t\t\t\t\t<Button id="btnShared" text="{i18n>view.Appointment.sharedCalendar}" tap="_buttonDisplaySharedCalendar" width="40%"/>\n\t\t\t\t\t -->\t<!-- </buttons>\n\t\t\t\t\t</SegmentedButton> -->\n\t\t\t\t\t<Button id="Days_type"  text="{i18n>view.Appointment.Timeline}" tooltip="Timeline" press="onDay" />\n\t\t\t\t\t<Button id="Calendar_type"  text="{i18n>view.Appointment.Calendars}" tooltip="Calendars" press="onCalendar" />\n\t\t\t\t\t\n\t\t\t\t</contentMiddle>\n\t\t\t\t<contentRight>\n\t\t\t\t<!-- Extension point to add additional footer content on right -->\n\t\t\t\t  \t<core:ExtensionPoint name="extensionFooterContentRight"/>\n\t\t\t\t  <Button id="btnAdd"  tooltip="{i18n>view.Appointment.newapptm_tt}" />\n\t\t\t\t\t\n\t\t\t\t</contentRight>\n\t\t\t</Bar>\n\t\t</footer>\n\n\t</Page>\n\n\n</core:View>\n',
	"cus/crm/mycalendar/view/Attachments.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");
jQuery.sap.require("cus.crm.mycalendar.util.Conversions");
jQuery.sap.require("sap.ca.ui.model.format.FileSizeFormat");
jQuery.sap.require("sap.ca.ui.model.type.FileSize");
jQuery.sap.require("cus.crm.mycalendar.util.Util");

sap.ui.controller("cus.crm.mycalendar.view.Attachments", {

	onInit : function() {
	},

	refresh : function(sContextPath, attachments, mode) {
		var _uploadUrl = cus.crm.mycalendar.util.Conversions.uploadUrlConverter(sContextPath);
		var sUrlParams = this.getView().getModel().sUrlParams;
		
		var oAtt = this.byId('attachments');
		oAtt.setXsrfToken(this.getXsrfToken());
		oAtt.setEncodeUrl("/sap/bc/ui2/encode_file" + (sUrlParams ? '?' + sUrlParams : ''));
		var attTitle;
		
				var data = {
					AppointmentToAttachment : []
				};
				
				
			
				
				$.each(attachments.results, function(index, value) {
					var o = {
						name : value.RelativeUrl,
						size : value.FileSize,
						url : (value.UrlAttachment === "") ? cus.crm.mycalendar.util.Conversions.urlConverter(value.__metadata.media_src) : value.UrlAttachment , // value.__metadata.media_src, // value.Url,
						uploadedDate : value.UploadedDate, //cus.crm.mycalendar.util.Conversions.formatDateDay(value.UploadedDate), // value.UploadedDate, // cus.crm.mycontacts.formatter.ReleaseFormatter.dateFormatter(value.createdAt),
						contributor : value.CreatedBy, // value.Contributor,
						fileExtension : cus.crm.mycalendar.util.Conversions.mimeTypeConverter(value.Mimetype), // value.FileExtension,
						fileId : value.Id,
						media_src : value.__metadata.media_src
					};
					data.AppointmentToAttachment.push(o);
				});
				this.byId('attachments').setModel(new sap.ui.model.json.JSONModel(data));
				this.byId('attachments').setUploadUrl(_uploadUrl);
				this.getView().byId("attConti").setVisible(true);
				
				if(data.AppointmentToAttachment.length == 0){
					attTitle = cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.attachmentDataNumber", "0");
					if(!mode) {
						this.getView().byId("attConti").setVisible(false);
					}
				}
				else{
					attTitle = cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.attachmentDataNumber", data.AppointmentToAttachment.length);
				}

				if(mode)
					{   
						var attCntrl = this.byId('attachments');
						attCntrl.setUploadEnabled(true);  
						attCntrl.setRenameEnabled(true);  
						
					}
			//	if(this.byId('attachments').getEditMode() && !this.byId('attachments').getUploadEnabled()){
				//	this.byId('attachments').setUploadEnabled(true);
				//}
				if(sContextPath == "" && mode){
					this.byId('attachments').setUploadEnabled(false);
					this.byId('attachments').setShowNoData(false);
					attTitle = cus.crm.mycalendar.util.Util.geti18NText("view.Appointment.attachmentSaveRequest");
				}
				this.getView().byId("attTitle").setTitle(attTitle);

},
	

	 onUploadFile : function(oEventData) {
		 
		   //fetch etag
		 cus.crm.mycalendar.util.Util._fetchETag(this.getView().getBindingContext().getPath(),this.getView().getModel());
		 	var oData; // = oEventData.getParameters().d;
		 	if (oEventData.getParameters() && oEventData.getParameters().d) {
				oData = oEventData.getParameters().d;
			} else {
				oData = oEventData.getParameters();
			}
		 	this.value=oData;
		 	var oFile = this.buildFileDescriptorObject(oData);
			this.byId('attachments').commitFileUpload(oFile);
			
			this.countAttachments("1");
			this.byId('attachments').setRenameEnabled(true);
			
		},
	    
	 buildFileDescriptorObject : function(value) {
			
			var oFile = {
				name : value.Filename,
				size : value.FileSize,
				url : cus.crm.mycalendar.util.Conversions.urlConverter(value.__metadata.media_src), //value.url
				uploadedDate : value.UploadedDate, //cus.crm.mycontacts.formatter.ReleaseFormatter.dateFormatter(value.createdAt),
				contributor : value.Contributor,
				fileExtension : value.FileExtension, //cus.crm.mycontacts.formatter.ReleaseFormatter.mimeTypeFormatter(value.mimeType),
				fileId : value.Id,
				xsrfToken : this.getView().getModel().refreshSecurityToken()
			};
		
			return oFile;
		},
		
		onBeforeUploadFile : function(oEventData) {
			//var AppSet = this.byId("attachments").mProperties.uploadUrl;
			var AppSet = this.byId("attachments").getProperty("uploadUrl");
			var AppSetSplit = AppSet.split("'");
			AppSet = oEventData.getParameter("name") + ";" + "AppointmentMain" + ";" + AppSetSplit[1].replace(/-/g, "");
			this.byId("attachments").setCustomHeader("slug", AppSet);
		},
		



		onRenameFile : function(oEventData) {

					var that = this;
					var oModel = this.getView().getModel();
					//No infinite loop on adding a new attachment
					var url = oEventData.getParameter("media_src");
					var value=1;
					if(!url){
						
						var url1=this.value.DocId;
						url=url1.split('/').join('%2F');
						value=0;
						
					}
					var AppSetSplit = url.split("'");
					var docId = AppSetSplit[value];
					var AppSet ;
					docId = docId.split('%2F').join('/');

					var oEntry = {
						RelativeUrl : oEventData.getParameter("newFilename"),
						Description : oEventData.getParameter("newFilename"),
						DocId : docId
					};

					AppSet = "/AttachmentSet('" + AppSetSplit[value] + "')";
					oModel.update(AppSet, oEntry, null, function(oData,
							response) {
						//fetch etag
						 cus.crm.mycalendar.util.Util._fetchETag(that.getView().getBindingContext().getPath(),that.getView().getModel());
						
					}, function(oMessage) {
						
						  
						that.displayResponseErrorMessage(oMessage,
								sap.ca.scfld.md.app.Application.getImpl()
										.getResourceBundle().getText(
												'SAVE_FAILED'));

					});
				},


		onSaveClicked : function() {
		      //save to server here and determine success
	
	  var success = true;
		 
		      var fileUploadControl = this.byId("attachments");
		 
		      if (success) {
		         fileUploadControl.commitPendingRenames();
		      } else {
		         fileUploadControl.abandonPendingRenames();
		      }
		  },
		
		onDeleteFile : function(oEventData) {
			var AppSet;
			this.byId("attachments").removeFile(
					oEventData.getParameters().fileId);
			var oModel = this.getView().getModel();
			var aBatchOp = [];
			if(oEventData.getParameters().media_src)
			{
			 AppSet = oEventData.getParameters().media_src;
			}
			else{
			 AppSet = oEventData.getParameters().url;
			}
			var AppSetSplit = AppSet.split("'");
			AppSet = "/AttachmentSet('" + AppSetSplit[1] + "')";
			var attachBatchOp = oModel.createBatchOperation(AppSet,
					"DELETE");
			aBatchOp.push(attachBatchOp);
			oModel.addBatchChangeOperations(aBatchOp);
			oModel.submitBatch(
					jQuery.proxy(this.successSave, this), jQuery
							.proxy(this.errorSave, this));			

			this.countAttachments("0");
		},

		displayResponseErrorMessage : function(oMessage,
				sDefaultMessage) {
			var sMessage;
			if (oMessage.response) {
				sMessage = jQuery.parseJSON(oMessage.response.body).error.message.value;
			} else
				sMessage = sDefaultMessage;
			sap.ca.ui.message.showMessageBox({
				type : sap.ca.ui.message.Type.ERROR,
				message : sMessage,
			});
		},
		getXsrfToken: function() {
			var sToken = this.getView().getModel().getHeaders()['x-csrf-token'];
			if (!sToken) {
				
				this.getView().getModel().refreshSecurityToken( 
					function(e, o) {					
						sToken = o.headers['x-csrf-token'];					
					}, 
					function() {
						throw new Error('could not refresh XSRF token');
					}, 
					false);
			}	
			return sToken;
		},
		
//      Interim Solution of countAttachments		
		countAttachments : function(value) {
			var that = this;
			var attTitleM = that.byId("attTitle").getTitle();
			var attTitleB = attTitleM.split("(");
			attTitleB = attTitleB[1].split(")");
			attTitleM = attTitleB[0];
			if (value == "0") {
				attTitleM = Number(attTitleM) - 1;
			}
			else {
				attTitleM = Number(attTitleM) + 1;
			}
			if(isNaN(attTitleM)){

			}
			else {
				var attTitle = cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.attachmentDataNumber", attTitleM);
				if(attTitleM === 0){
					attTitle = cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.attachmentDataNumber", "0");
				}
				that.byId("attTitle").setTitle(attTitle);
				that.byId('attachments').setRenameEnabled(false);
			}
		},
		successSave : function(aResponses){
			//fetch etag
			 cus.crm.mycalendar.util.Util._fetchETag(this.getView().getBindingContext().getPath(),this.getView().getModel());

		}
		
});

},
	"cus/crm/mycalendar/view/Attachments.view.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<core:View controllerName="cus.crm.mycalendar.view.Attachments"\r\n\t\t   xmlns="sap.m"\r\n\t\t   xmlns:me="sap.me"\r\n\t\t   xmlns:form="sap.ui.layout.form"\r\n       \t   xmlns:dlg="sap.m.dialog"\r\n       \t   xmlns:layout="sap.ui.layout"\r\n\t\t   xmlns:core="sap.ui.core" \r\n\t\t   xmlns:mvc="sap.ui.core.mvc" \t    \r\n\t\t   xmlns:caui="sap.ca.ui" \r\n           xmlns:html="http://www.w3.org/1999/xhtml">\r\n           \r\n           <form:Form id="attTitle">\r\n\t\t\t\t<form:layout>\r\n\t\t\t\t\t<form:ResponsiveGridLayout id="responsiveGrid_Attachments"></form:ResponsiveGridLayout>\r\n\t\t\t\t</form:layout>\r\n\t\t\t\t<form:formContainers>\r\n\t\t\t\t\t<form:FormContainer id="attConti">\r\n\t  \t\t\t\t\t<form:formElements>\r\n\t\t\t\t\t\t\t<form:FormElement id="attachmentsContainer">\r\n           \r\n\t\t\t\t\t           <caui:FileUpload id="attachments"  \r\n  \t        \t\t\t\t\t \titems="/AppointmentToAttachment" \r\n\t\t              \t\t\t\tuploadUrl="name"\r\n\t\t              \t\t\t\tfileName="name"\r\n\t\t              \t\t\t\tsize="size"\r\n\t\t              \t\t\t\turl="url"\r\n\t\t              \t\t\t\tuploadedDate="uploadedDate"\r\n\t\t              \t\t\t\tuploadEnabled="false"\r\n\t\t\t               \t\t\tcontributor="contributor"\r\n\t\t\t               \t\t\tfileExtension="fileExtension"\r\n\t\t\t               \t\t\tfileId="fileId"\r\n\t\t\t               \t\t\teditMode="false"\r\n\t\t\t               \t\t\tshowAttachmentsLabel="false"\r\n\t\t\t              \t\t  > \r\n\t\t  \t\t\t\t\t   </caui:FileUpload >\r\n\t\t   \r\n\t\t   \t\t\t\t\t</form:FormElement>\r\n\t\t\t\t\t\t</form:formElements>  \r\n\t\t\t\t\t</form:FormContainer>\r\n\t\t\t\t</form:formContainers>\r\n\t\t\t</form:Form>\r\n           \r\n           \r\n</core:View>',
	"cus/crm/mycalendar/view/Attachments_chg.view.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<core:View controllerName="cus.crm.mycalendar.view.Attachments"\r\n\t\t   xmlns="sap.m"\r\n\t\t   xmlns:me="sap.me"\r\n\t\t   xmlns:form="sap.ui.layout.form"\r\n       \t   xmlns:dlg="sap.m.dialog"\r\n       \t   xmlns:layout="sap.ui.layout"\r\n\t\t   xmlns:core="sap.ui.core" \r\n\t\t   xmlns:mvc="sap.ui.core.mvc" \t    \r\n\t\t   xmlns:caui="sap.ca.ui" \r\n           xmlns:html="http://www.w3.org/1999/xhtml">\r\n           \r\n           <form:Form id="attTitle">\r\n\t\t\t\t<form:layout>\r\n\t\t\t\t\t<core:Fragment fragmentName="cus.crm.mycalendar.view.EditLayout" type="XML" />\r\n\t\t\t\t</form:layout>\r\n\t\t\t\t<form:formContainers>\r\n\t\t\t\t\t<form:FormContainer id="attConti">\r\n\t  \t\t\t\t\t<form:formElements>\r\n\t\t\t\t\t\t\t<form:FormElement>\r\n\r\n  \t\t\t\t\t \t         <caui:FileUpload \r\n  \t\t\t\t\t \t            id="attachments"  \r\n  \t        \t\t\t \t\t\titems="/AppointmentToAttachment"\r\n\t\t              \t\t\t\tfileName="name"\r\n\t\t              \t\t\t\tsize="size"\r\n\t\t              \t\t\t\turl="url"\r\n\t\t              \t\t\t\tuploadUrl=""\r\n\t\t              \t\t\t\tuploadedDate="uploadedDate"\r\n\t\t\t               \t\t\tcontributor="contributor"\r\n\t\t\t               \t\t\tfileExtension="fileExtension"\r\n\t\t\t               \t\t\tfileId="fileId"\r\n\t\t\t               \t\t\tuploadEnabled="true"\r\n\t\t\t               \t\t\tacceptRequestHeader="application/json"\r\n\t\t\t               \t\t\tbeforeUploadFile="onBeforeUploadFile"\r\n\t\t\t               \t\t\tuploadFile="onUploadFile"\r\n\t\t\t               \t\t\tuseMultipart="false"\r\n\t\t\t               \t\t\trenameEnabled="true"\r\n\t\t\t               \t\t\trenameFile="onRenameFile"\r\n\t\t\t               \t\t\tuseEditControls="true"\r\n\t\t\t               \t\t\tdeleteFile="onDeleteFile"\r\n\t\t\t               \t\t\txsrfToken="xsrfToken"\r\n\t\t\t               \t\t\tshowNoData="false"\r\n\t\t\t               \t\t    saveClicked="onSaveClicked"\r\n\t\t\t               \t\t    editMode="true"\r\n\t\t\t               \t\t    showAttachmentsLabel="false"\r\n\t\t\t              \t\t   \t  > \r\n\t\t \t\t\t\t\t  \t</caui:FileUpload >\r\n\r\n \t         \t\t\t\t</form:FormElement>\r\n\t\t\t\t\t\t</form:formElements>  \r\n\t\t\t\t\t</form:FormContainer>\r\n\t\t\t\t</form:formContainers>\r\n\t\t\t</form:Form>\r\n           \r\n</core:View>',
	"cus/crm/mycalendar/view/AttendeeEdit.fragment.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<!-- Dialog view for the Edit of attendees -->\r\n<!-- consists of a list with the available attendees to delete -->\r\n<!-- and a navigation to a search view to search for new ones and to add \r\n\tthem to the list -->\r\n<Dialog xmlns="sap.m" contentWidth="480px" contentHeight="1000px"\r\n\tshowHeader="false">\r\n\t<content>\r\n\t\t<NavContainer xmlns="sap.m">\r\n\t\t\t<pages>\r\n\t\t\t\t<!-- first page for the attendee list -->\r\n\t\t\t\t<Page id="p1" xmlns="sap.m">\r\n\t\t\t\t\t<customHeader>\r\n\t\t\t\t\t\t<Bar xmlns="sap.m">\r\n\t\t\t\t\t\t\t<contentMiddle>\r\n\t\t\t\t\t\t\t\t<Label id="tit" text="">\r\n\t\t\t\t\t\t\t\t</Label>\r\n\t\t\t\t\t\t\t</contentMiddle>\r\n\t\t\t\t\t\t\t<contentRight>\r\n\t\t\t\t\t\t\t\t<Button icon="sap-icon://add" press="onAddClicked">\r\n\t\t\t\t\t\t\t\t</Button>\r\n\t\t\t\t\t\t\t</contentRight>\r\n\t\t\t\t\t\t</Bar>\r\n\t\t\t\t\t</customHeader>\r\n\t\t\t\t\t<content>\r\n\t\t\t\t\t\t<List id="al" xmlns="sap.m" items="{em>/Attendee}" mode="Delete"\r\n\t\t\t\t\t\t\tdelete="onDeleteAttendee">\r\n\t\t\t\t\t\t\t<items>\r\n\t\t\t\t\t\t\t\t<StandardListItem id="ali" xmlns="sap.m"\r\n\t\t\t\t\t\t\t\t\ttitle="{em>FullName}" description="{em>Function}">\r\n\t\t\t\t\t\t\t\t</StandardListItem>\r\n\t\t\t\t\t\t\t</items>\r\n\t\t\t\t\t\t</List>\r\n\t\t\t\t\t</content>\r\n\t\t\t\t\t<!-- own footer for the first page -->\r\n\t\t\t\t\t<footer>\r\n\t\t\t\t\t\t<Bar xmlns="sap.m">\r\n\t\t\t\t\t\t\t<!-- to have the buttons stretched Fix for msg: 1482014480--> \r\n\t\t\t\t\t\t\t<contentRight>\r\n\t\t\t\t\t\t\t\t<Button text="{i18n>view.Appointment.ok}"\r\n\t\t\t\t\t\t\t\t\tpress="onOKDialog">\r\n\t\t\t\t\t\t\t\t</Button>\r\n\t\t\t\t\t\t\t\t<Button text="{i18n>view.Appointment.cancel}"\r\n\t\t\t\t\t\t\t\t\tpress="onCancelDialog">\r\n\t\t\t\t\t\t\t\t</Button>\r\n\t\t\t\t\t\t\t</contentRight>\r\n\t\t\t\t\t\t</Bar>\r\n\t\t\t\t\t</footer>\r\n\t\t\t\t</Page>\r\n\r\n\t\t\t\t<!-- second page for the respective search, that is contact or employee -->\r\n\t\t\t\t<Page id="p2" xmlns="sap.m" showNavButton="true" title=""\r\n\t\t\t\t\tnavButtonPress="onNavBack">\r\n\t\t\t\t\t<!-- the content is intended to be set dynamically -->\r\n\t\t\t\t\t<content>\r\n\t\t\t\t\t</content>\r\n\t\t\t\t\t<footer>\r\n\t\t\t\t\t\t<Bar xmlns="sap.m">\r\n\t\t\t\t\t\t\t<contentMiddle>\r\n\t\t\t\t\t\t\t\t<Button width="100%" text="{i18n>view.Appointment.cancel}"\r\n\t\t\t\t\t\t\t\t\tpress="onCancelSearch">\r\n\t\t\t\t\t\t\t\t</Button>\r\n\t\t\t\t\t\t\t</contentMiddle>\r\n\t\t\t\t\t\t</Bar>\r\n\t\t\t\t\t</footer>\r\n\r\n\t\t\t\t</Page>\r\n\t\t\t</pages>\r\n\r\n\t\t</NavContainer>\r\n\t</content>\r\n</Dialog>\r\n\r\n',
	"cus/crm/mycalendar/view/ContactSearch.fragment.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<core:FragmentDefinition xmlns="sap.m"\r\n\txmlns:core="sap.ui.core">\r\n\t<SearchField id="sfc" xmlns="sap.m" search="onContactSearch"\r\n\t    placeholder="{i18n>view.Appointment.searchfieldplaceholder}"\r\n\t\tliveChange="onContactLiveChange">\r\n\t</SearchField>\r\n\t\r\n<!-- Using growingThreshold = 40 for the following dialog list as a workaround for still showing scrollbar in the dialog window  -->\r\n<!-- if Chrome is zoomed <= 50%  -->\r\n<!-- the problem shall be fixed with SAPUI5 1.20 -->\r\n\t\r\n\t<List xmlns="sap.m" id="lsc" \r\n\t\tgrowing="true" growingThreshold="40" \r\n\t\tgrowingScrollToLoad="true"\r\n\t\tupdateStarted="onContactListUpdateStart"\r\n\t\tupdateFinished="onContactListUpdateFinished"\r\n\t\tnoDataText="{i18n>view.Appointment.consea_nodata}"\r\n\t\tmode="SingleSelectMaster" selectionChange="onSelectContact">\r\n\t\t\r\n\t\t<infoToolbar>\r\n\t\t\t<Toolbar id="tb" xmlns="sap.m" active="true" visible="false" press="onContactFilterHide">\r\n\t\t\t\t<Label id="tbl" text="{i18n>view.Appointment.filteredby}"></Label>\r\n\t\t\t\t<ToolbarSpacer></ToolbarSpacer>\r\n\t\t\t\t<core:Icon xmlns:core="sap.ui.core" src="sap-icon://sys-cancel"></core:Icon>\r\n\t\t\t</Toolbar>\r\n\t\t</infoToolbar>\r\n\t\t\r\n\t\t<ObjectListItem xmlns="sap.m" id="lsci"\r\n\t\t\ttitle="{parts:[{path:\'sm>fullName\'},{path:\'sm>contactID\'}], formatter: \'.formatContactName\'}">\r\n\t\t\t<attributes>\r\n\t\t\t\t<ObjectAttribute text="{sm>company}">\r\n\t\t\t\t</ObjectAttribute>\r\n\t\t\t\t<ObjectAttribute text="{sm>function}">\r\n\t\t\t\t</ObjectAttribute>\r\n\t\t\t</attributes>\r\n\t\t</ObjectListItem>\r\n\r\n\t</List>\r\n\r\n</core:FragmentDefinition>',
	"cus/crm/mycalendar/view/EditLayout.fragment.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<!-- fragment for layout used in edit forms -->\r\n<form:ResponsiveGridLayout xmlns:form="sap.ui.layout.form"\r\n\tlabelSpanL="3" \r\n\tlabelSpanM="3" \r\n\temptySpanL="4" \r\n\temptySpanM="4" \r\n\tcolumnsL="1"\r\n\tcolumnsM="1">\r\n</form:ResponsiveGridLayout>\r\n',
	"cus/crm/mycalendar/view/EmployeeF4.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<Dialog  xmlns="sap.m" title="{i18n>view.Appointment.employeeResponsible}"\n\tcontentWidth="480px" contentHeight="720px" class="DialogPadding">\n\t<subHeader>\n\t\t<Bar>\n\t\t\t<contentLeft>\n\t\t\t\t<SearchField placeholder="{i18n>view.Appointment.searchfieldplaceholder}"\n\t\t\t\t\tsearch="searchEmp" liveChange="searchEmpLive"></SearchField>\n\t\t\t</contentLeft>\n\t\t</Bar>\n\n\t</subHeader>\n\t<content>\n\t\t<List  noDataText="{i18n>view.Appointment.loaddatatext}" mode="SingleSelectMaster"\n\t\t\titems="{json>/EmployeeCollection}" selectionChange="onEmpSelect"\n\t\t\tgrowing="true" value="true">\n\t\t\t<items>\n\t\t\t\t<ObjectListItem\n\t\t\t\t\ttitle="{path:\'json>fullName\'}">\n\t\t\t\t\t<attributes>\n\t\t\t\t\t\t<ObjectAttribute text="{json>employeeID}">\n\t\t\t\t\t\t</ObjectAttribute>\n\t\t\t\t\t\t\n\t\t\t\t\t</attributes>\n\t\t\t\t</ObjectListItem>\n\t\t\t</items>\n\t\t\t<infoToolbar>\n\t\t\t\t<Toolbar  active="false">\n\t\t\t\t\t<content>\n\t\t\t\t\t\t<Label  text=""></Label>\n\t\t\t\t\t\t<ToolbarSpacer></ToolbarSpacer>\n\t\t\t\t\t\t<Button  type="Transparent" icon="sap-icon://sys-cancel-2"\n\t\t\t\t\t\t\tpress="onEmpToolbarClose"></Button>\n\n\t\t\t\t\t</content>\n\t\t\t\t</Toolbar>\n\t\t\t</infoToolbar>\n\t\t</List>\n\t</content>\n\n\t<beginButton>\n\t\t<Button text="{i18n>view.Appointment.cancel}" press="closeEmpF4" />\n\t</beginButton>\n\n</Dialog>\n',
	"cus/crm/mycalendar/view/EmployeeSearch.fragment.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<core:FragmentDefinition xmlns="sap.m"\r\n\txmlns:core="sap.ui.core">\r\n\t<SearchField id="sfe" xmlns="sap.m" search="onEmployeeSearch"\r\n\t    placeholder="{i18n>view.Appointment.searchfieldplaceholder}"\r\n\t\tliveChange="onEmployeeLiveChange">\r\n\t</SearchField>\r\n\t<List xmlns="sap.m" id="lse"\r\n\t\t\r\n\t\tgrowing="true" growingThreshold="20"\r\n\t\tgrowingScrollToLoad="true" \r\n\t\tupdateStarted="onEmployeeListUpdateStart"\r\n\t\tupdateFinished="onEmployeeListUpdateFinished"\r\n\t\tnoDataText="{i18n>view.Appointment.nointattendees}"\r\n\t\tmode="SingleSelectMaster" \r\n\t\tselectionChange="onSelectEmployee">\r\n\r\n\t\t<ObjectListItem xmlns="sap.m" id="lsei"\r\n\t\t\ttitle="{parts:[{path:\'sm>firstName\'},{path:\'sm>lastName\'}], formatter: \'.formatEmployeeName\'}">\r\n\t\t\t<attributes>\r\n\t\t\t\t<ObjectAttribute text="{sm>Company/name1}">\r\n\t\t\t\t</ObjectAttribute>\r\n\t\t\t\t<ObjectAttribute text="{sm>WorkAddress/function}">\r\n\t\t\t\t</ObjectAttribute>\r\n\t\t\t</attributes>\r\n\t\t\t<customData>\r\n\t\t\t\t<core:CustomData key="empid" value="{sm>employeeID}"></core:CustomData>\r\n\t\t\t\t<core:CustomData key="func" value="{sm>WorkAddress/function}"></core:CustomData>\r\n\t\t\t\t<core:CustomData key="compid" value="{sm>Company/accountID}"></core:CustomData>\r\n\t\t\t</customData>\r\n\t\t</ObjectListItem>\r\n\r\n\t</List>\r\n</core:FragmentDefinition>',
	"cus/crm/mycalendar/view/Main.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("cus.crm.mycalendar.util.Util");
jQuery.sap.require("sap.ca.ui.message.message");

sap.ui.controller("cus.crm.mycalendar.view.Main", {
	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 */
	onInit : function() {
		jQuery.sap.require("sap.ca.scfld.md.Startup");
		sap.ca.scfld.md.Startup.init('cus.crm.mycalendar', this);
	}

});

},
	"cus/crm/mycalendar/view/Main.view.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<core:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" displayBlock="true"  height="100%" xmlns="sap.m" controllerName="cus.crm.mycalendar.view.Main" xmlns:html="http://www.w3.org/1999/xhtml">\r\n\t<App id="fioriContent" class="cusCrmMyCalendar" showHeader="false">\r\n\t</App>    \r\n</core:View> \r\n\r\n\r\n',
	"cus/crm/mycalendar/view/NewAppointment.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("cus.crm.mycalendar.util.Conversions");
jQuery.sap.require("cus.crm.mycalendar.util.Util");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.utils.resourcebundle");
jQuery.sap.require("cus.crm.mycalendar.util.Schema");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("cus.crm.mycalendar.util.Schema");

jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("cus.crm.mycalendar.view.NewAppointment", {
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created. Can be used to
	 * modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 */	
	onInit : function() {
		sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit.call(this);
		
		if(!this.oApplicationFacade.getApplicationModel("customizing")){
			cus.crm.mycalendar.util.Util.initCustomizingModel(this);
		}
		
		this.oModel = this.oApplicationFacade.getODataModel();
		
		this.oModel.setRefreshAfterChange(false);
		this.isMock = this.oApplicationFacade.isMock();
		this.getView().setModel(this.oModel);
		this.sBackendVersion = cus.crm.mycalendar.util.Schema._getServiceSchemaVersion(this.oModel,"Appointment");
		this.followupappointment=false;
		this.followupappointmentfromtask=false;
		this.newappointmentfromoppt=false;
		this.newappointmentfromaccount = false;
		this.createFromAccount = false;
		this.newAppointment = false;
		// needed to prefix the fragments
		this.sViewId = this.getView().getId();
		// BusyDialog
		this.oBusyDialog = new sap.m.BusyDialog();
        
		//employee field responds to enter press
		/*this.byId('responsibleText').attachBrowserEvent("keyup",jQuery.proxy(function(oEvent){
			
			if(oEvent.keyCode === 13){
			this.onF4Employee({oSource : this.byId('responsibleText')});
			}
			
		},this));*/
		
		//getting logged in emp resp Id
		if(parseFloat(this.sBackendVersion) >= 4.0){
		 this.oModel.read("AppPartnerSet",null, [],true,jQuery.proxy(function(odata,response){
             
      	   this.EmpResId = odata.results[0].PartnerNo;
             
         },this),jQuery.proxy(function(oError){},this));
		 }
		this.oRouter.attachRouteMatched(function(oEvent) {
			jQuery.sap.log.info("### nav target:  " + oEvent.getParameter("name"));

			this._interopChecks(this.sBackendVersion);
			
			var oStartupParameter = this.getView().getModel("startupParameters");
			if (oEvent.getParameter("name") === "newappointmentfromnote") {
				// date parameter for the new appointment
				this.byId("p").scrollTo(0);
				
				if (oStartupParameter && oStartupParameter.oData) {
					if (oStartupParameter.oData.parameters) {
						for ( var param in oStartupParameter.oData.parameters) {
							if (oStartupParameter.oData.parameters[param].key == "itemPaths" ) {
								this.createdfromNotes = true;
								var aItemPaths = oStartupParameter.oData.parameters[param].value.split(",");
								this.oModelHandler = new cus.crm.notes.handler.ModelHandler();
								this.sNote = this.oModelHandler.getSectionsText(aItemPaths);
							}
							
						//	if (oStartupParameter.oData.parameters[param].key == "ProcessTypeDescription") {
							//	this.processTypeDesFromNote = oStartupParameter.oData.parameters[param].value;
								//console.log("createFromOppt"+this.createFromOppt);
															
							//}

							if (oStartupParameter.oData.parameters[param].key == "privateFlag") {
								this.privateFlag = jQuery.parseJSON(oStartupParameter.oData.parameters[param].value);
								//console.log("createFromOppt"+this.createFromOppt);
															
							}	
							
							if (oStartupParameter.oData.parameters[param].key == "processType") {
						 										this.processType = oStartupParameter.oData.parameters[param].value;
						 										
						 								}
						}
					}
					delete oStartupParameter.oData.parameters[param];
				}
				
var that = this;
				
				var aBatchReads = [];
				var oModel = this.getView().getModel();
				
				
				 var sPath4  = "/TransactionTypes" ;
			    
			     
			     aBatchReads.push(oModel
                         .createBatchOperation(
                                       sPath4, "GET"));
			     
			     
			     oModel.addBatchReadOperations(aBatchReads);
			     
			     var index = 1;
			     var old = this;
			    oModel.submitBatch(jQuery.proxy(function(oResponses){
                 	   

                      //  that.AccountName = oResponses.__batchResponses[0].data.fullName ; 
                       // that.ContactName = oResponses.__batchResponses[1].data.fullName;
                   	   // that.ResponsibleTxt = oResponses.__batchResponses[2].data.fullName;
                   	    if(oResponses.__batchResponses[0].data)
                   	    	{
                   	    	for (var i=0; i < oResponses.__batchResponses[0].data.results.length; i++) {
            					if(oResponses.__batchResponses[0].data.results[i].ProcessTypeCode === old.processType) {
            						old.processTypeDesFromNote = oResponses.__batchResponses[0].data.results[i].Description;
            						old.privateFlag = oResponses.__batchResponses[0].data.results[i].PrivateFlag;
            						break;

            						
                   	    	}
            					

                   	    	}
                   	    	}
                 },this),jQuery.proxy(function(){},this),false);
				
		
				
				
				
				var processType = oEvent.getParameter("arguments").processType;
				
				this.createAppointment(new Date(),processType);

				if ( this.sNote ) {
					var oVM = this.getView().getModel("vm");
					oVM.oData.Note = this.sNote; 
					}
				window.setTimeout(jQuery.proxy(this._scrollToTop,this),10);
			}
			if (oEvent.getParameter("name") === "followupappointmentfromtask") {
				this.followupappointmentfromtask=true;
				// date parameter for the new appointment
				this.byId("p").scrollTo(0);
				if (oStartupParameter && oStartupParameter.oData) {
					if (oStartupParameter.oData.parameters) {
						for ( var param in oStartupParameter.oData.parameters) {
							
							
						//	if (oStartupParameter.oData.parameters[param].key == "AccountName") {
							//	this.AccountName = oStartupParameter.oData.parameters[param].value;
								//console.log("AccountName"+this.AccountName);
															
							//}
							if (oStartupParameter.oData.parameters[param].key == "taskId") {
								this.taskId = oStartupParameter.oData.parameters[param].value;
								//console.log("opportunityId"+this.opportunityId);
															
							}
							if (oStartupParameter.oData.parameters[param].key == "title") {
								this.title = oStartupParameter.oData.parameters[param].value;
								//console.log("title"+this.title);
															
							}
							if (oStartupParameter.oData.parameters[param].key == "FUA") {
								this.createFromTasks = oStartupParameter.oData.parameters[param].value;
								//console.log("createFromOppt"+this.createFromOppt);
															
							}
						//	if (oStartupParameter.oData.parameters[param].key == "ContactName") {
							//	this.ContactName = oStartupParameter.oData.parameters[param].value;
							//	console.log("ContactName"+this.ContactName);
						//	}
							//if (oStartupParameter.oData.parameters[param].key == "processType") {
							//	this.processTypeDesFromTask = oStartupParameter.oData.parameters[param].value;
								//console.log("createFromOppt"+this.createFromOppt);
															
							//}
							if (oStartupParameter.oData.parameters[param].key == "AccountID") {
								this.AccountID = oStartupParameter.oData.parameters[param].value;
								//console.log("createFromOppt"+this.createFromOppt);
															
							}
							if (oStartupParameter.oData.parameters[param].key == "ContactID") {
								this.ContactID = oStartupParameter.oData.parameters[param].value;
							//	console.log("ContactName"+this.ContactName);
							}
					//		if (oStartupParameter.oData.parameters[param].key == "privateFlag") {
						//		this.privateFlag = jQuery.parseJSON(oStartupParameter.oData.parameters[param].value);
							//	console.log("ContactName"+this.ContactName);
						//	}
							
						}
					}
					delete oStartupParameter.oData.parameters[param];
				}
				//var sDate = oEvent.getParameter("arguments").Date;
				
				var processType = oEvent.getParameter("arguments").processType;
				this.processTypeDesFromTask=processType;
				
var that = this;

var aBatchReads = [];
var oModel = this.getView().getModel();
 var aPrerequisitePaths=[];
 aPrerequisitePaths.push("/TransactionTypes");
 if (this.AccountID!=="")
        aPrerequisitePaths.push("/AccountCollection("
                      + oModel.formatValue(this.AccountID,
                                   "Edm.String") + ")");
 if(this.ContactID!==""){
        var sFormattedString = oModel.formatValue(
                      this.ContactID, "Edm.String");
        var sEncodedURL = jQuery.sap.encodeURL("contactID eq "
                      + sFormattedString);
        aPrerequisitePaths
                      .push("/ContactCollection?$filter="
                                   + sEncodedURL);
 }
 for ( var i = 0; i < aPrerequisitePaths.length; i++) {
     aBatchReads.push(oModel
                   .createBatchOperation(
                                aPrerequisitePaths[i], "GET"));

     
     
}


 
 oModel.addBatchReadOperations(aBatchReads);
 
 
 var index = 3;
 var old = this;
oModel.submitBatch(jQuery.proxy(function(oResponses){
    for ( var j = 0; j < oResponses.__batchResponses.length; j++) {
        
        switch (j) {
        case 0:
               if (oResponses.__batchResponses[0].data) {
                      for ( var i = 0; i < oResponses.__batchResponses[0].data.results.length; i++) {
                             if (oResponses.__batchResponses[0].data.results[i].ProcessTypeCode === old.processTypeDesFromTask) {
                                    old.processTypeDesFromTask = oResponses.__batchResponses[0].data.results[i].Description;
                                    old.privateFlag = oResponses.__batchResponses[0].data.results[i].PrivateFlag;
                                    }

                      }
               }
               
               break;
        
        
        default:
               if(oResponses.__batchResponses[j].data.__metadata)
               if (oResponses.__batchResponses[j].data.__metadata.type.search("Account")!== -1)
                      this.AccountName =oResponses.__batchResponses[j].data.fullName;
        if(oResponses.__batchResponses[j].data.results)
        if (oResponses.__batchResponses[j].data.results[0].__metadata.type.search("Contact") !== -1)
               this.ContactName = oResponses.__batchResponses[j].data.results[0].fullName;
               
               break;
        }
        
 }
                 },this),jQuery.proxy(function(){},this),false);
				
		
				
				
				
				
				this.createAppointment(new Date(), processType);
				window.setTimeout(jQuery.proxy(this._scrollToTop,this),10);
			}

			if (oEvent.getParameter("name") === "newappointmentfromoppt") {
				this.newappointmentfromoppt=true;
				// date parameter for the new appointment
				this.byId("p").scrollTo(0);
				if (oStartupParameter && oStartupParameter.oData) {
					if (oStartupParameter.oData.parameters) {
						for ( var param in oStartupParameter.oData.parameters) {
							
							
						//	if (oStartupParameter.oData.parameters[param].key == "AccountName") {
							//	this.AccountName = oStartupParameter.oData.parameters[param].value;
								//console.log("AccountName"+this.AccountName);
															
						//	}
							if (oStartupParameter.oData.parameters[param].key == "AccountID") {
								this.AccountID = oStartupParameter.oData.parameters[param].value;
								//console.log("createFromOppt"+this.createFromOppt);
															
							}
						//	if (oStartupParameter.oData.parameters[param].key == "EmpName") {
							//	this.ResponsibleTxt = oStartupParameter.oData.parameters[param].value;
								//console.log("createFromOppt"+this.createFromOppt);
															
							//}
							if (oStartupParameter.oData.parameters[param].key == "EmpID") {
								this.Responsible = oStartupParameter.oData.parameters[param].value;
								//console.log("createFromOppt"+this.createFromOppt);
															
							}
							if (oStartupParameter.oData.parameters[param].key == "opportunityId") {
								this.opportunityId = oStartupParameter.oData.parameters[param].value;
								//console.log("opportunityId"+this.opportunityId);
															
							}
							if (oStartupParameter.oData.parameters[param].key == "title") {
								this.title = oStartupParameter.oData.parameters[param].value;
								//console.log("title"+this.title);
															
							}
							if (oStartupParameter.oData.parameters[param].key == "createFromOppt") {
								this.createFromOppt = oStartupParameter.oData.parameters[param].value;
								//console.log("createFromOppt"+this.createFromOppt);
															
							}
						//	if (oStartupParameter.oData.parameters[param].key == "ContactName") {
						//		this.ContactName = oStartupParameter.oData.parameters[param].value;
							//	console.log("ContactName"+this.ContactName);
						//	}
							if (oStartupParameter.oData.parameters[param].key == "ContactID") {
								this.ContactID = oStartupParameter.oData.parameters[param].value;
								//console.log("createFromOppt"+this.createFromOppt);
															
							}
							if (oStartupParameter.oData.parameters[param].key == "processType") {
								this.processTypefromoppt = oStartupParameter.oData.parameters[param].value;
							//	console.log("ContactName"+this.ContactName);
							}
							//if (oStartupParameter.oData.parameters[param].key == "privateFlag") {
							//	this.privateFlag = jQuery.parseJSON(oStartupParameter.oData.parameters[param].value);
							//	console.log("ContactName"+this.ContactName);
							//}
						}
					}
					delete oStartupParameter.oData.parameters[param];
				}
				
				var that = this;
				
				var aBatchReads = [];
				var oModel = this.getView().getModel();
				
				 var sPath = "/AccountCollection('" + this.AccountID + "')" ;
				 var sPath2 = "/ContactCollection(contactID='" + this.ContactID +  "',accountID='" + this.AccountID +"')" ;
				 var sPath3 = "/EmployeeCollection('" + this.Responsible + "')" ; 
				 var sPath4  = "/TransactionTypes" ;
			     aBatchReads.push(oModel
                         .createBatchOperation(
                                       sPath, "GET"));
			     
			     aBatchReads.push(oModel
                         .createBatchOperation(
                                       sPath2, "GET"));
			     
			     aBatchReads.push(oModel
                         .createBatchOperation(
                                       sPath3, "GET"));
			     
			     aBatchReads.push(oModel
                         .createBatchOperation(
                                       sPath4, "GET"));
			     
			     
			     oModel.addBatchReadOperations(aBatchReads);
			     
			     var index = 4;
			     var old = this;
			    oModel.submitBatch(jQuery.proxy(function(oResponses){
                 	   

                        that.AccountName = oResponses.__batchResponses[0].data.fullName ; 
                        that.ContactName = oResponses.__batchResponses[1].data.fullName;
                   	    that.ResponsibleTxt = oResponses.__batchResponses[2].data.fullName;
                   	    if(oResponses.__batchResponses[3].data)
                   	    	{
                   	    	for (var i=0; i < oResponses.__batchResponses[3].data.results.length; i++) {
            					if(oResponses.__batchResponses[3].data.results[i].ProcessTypeCode === old.processTypefromoppt) {
            						old.processTypeDescriptionfromoppt = oResponses.__batchResponses[3].data.results[i].Description;
            						old.privateFlag = oResponses.__batchResponses[3].data.results[i].PrivateFlag;
            						break;

            						
                   	    	}
            					

                   	    	}
                   	    	}
                 },this),jQuery.proxy(function(){},this),false);
				
		
				
				//var sDate = oEvent.getParameter("arguments").Date;
				var processType = oEvent.getParameter("arguments").processType;
				this.createAppointment(new Date(), processType);
				window.setTimeout(jQuery.proxy(this._scrollToTop,this),10);
			}
			
			if (oEvent.getParameter("name") === "newappointmentfromaccount") {
				this.byId("p").scrollTo(0);
				this.newappointmentfromaccount = true; 
				this.createFromAccount = true;

				var oModel = this.oConnectionManager.getModel();

				var processType = oEvent.getParameter("arguments").processType;
				var oProcessTypes = oModel.getProperty("TransactionTypeSet");
				var sBackendVersion = cus.crm.mycalendar.util.Schema._getServiceSchemaVersion(this.oModel,"Appointment");
				
				if (!oProcessTypes)
					oModel.read(((parseFloat(sBackendVersion) >= 4.0)) ? "TransactionTypes" : "TransactionTypeSet", null, null, false,
						function(oData, oResponse) {
							oProcessTypes = { TransactionTypeSet : oResponse.data.results };
						}
					);
				for (var i=0; i < oProcessTypes.TransactionTypeSet.length; i++) {
					if(oProcessTypes.TransactionTypeSet[i].ProcessTypeCode === processType) {
						this.processTypeDescriptionFromAccount = oProcessTypes.TransactionTypeSet[i].Description;
						this.privateFlag = oProcessTypes.TransactionTypeSet[i].PrivateFlag;
						break;
					}
				};

				var accountContextPath = oEvent.getParameter("arguments").accountContextPath;
				var oAccount = oModel.getProperty(accountContextPath);
				var that = this;
				var fnSetAccount = function(oAccount) {
					that.AccountID = oAccount.accountID;
					if(oAccount.fullName)
						that.AccountName = oAccount.fullName;
					else
						that.AccountName = oAccount.name1;
				};

				if(!oAccount){
					oModel.createBindingContext("/"+accountContextPath, "",
						function() {
							oAccount = oModel.getProperty("/"+accountContextPath);
							fnSetAccount(oAccount);
							/*this.createAppointment(, processType);*/
							that.createAppointment(null, processType);
							window.setTimeout(jQuery.proxy(that._scrollToTop,that),10);
						},
						true
					);
				} else {
					fnSetAccount(oAccount);
					/*this.createAppointment(new Date(), processType);*/
					this.createAppointment(null, processType);
					window.setTimeout(jQuery.proxy(that._scrollToTop,that),10);
				}
			}

			if (oEvent.getParameter("name") === "newappointment") {
				// date parameter for the new appointment
				this.newAppointment=true;
				this.byId("p").scrollTo(0);
				var sDate = oEvent.getParameter("arguments").Date;
				var processType = oEvent.getParameter("arguments").processType;
				this.privateFlag = jQuery.parseJSON(oEvent.getParameter("arguments").privateFlag);
				/*this.createAppointment(new Date(), processType);*/
				this.createAppointment(this.getDatefromParameterString(sDate), processType);
				window.setTimeout(jQuery.proxy(this._scrollToTop,this),10);
			}
			if (oEvent.getParameter("name") === "editappointment") {
				this.byId("p").scrollTo(0);
				var sApptGuid = oEvent.getParameter("arguments").AppointmentID;
				
				this.Context = "/AppointmentSet(guid'" + sApptGuid + "')";
				// adapt context for mock
				if (this.isMock){
					this.Context = "/AppointmentSet(Guid='" + sApptGuid + "')";
				}
				this.getView().bindElement(this.Context);
				this.editAppointment(this.Context, sApptGuid);
				window.setTimeout(jQuery.proxy(this._scrollToTop,this),10);
			}
			if (oEvent.getParameter("name") === "followupappointment") {
				this.followupappointment=true;
				this.byId("p").scrollTo(0);
				var sApptGuid = oEvent.getParameter("arguments").AppointmentGuid;
				var processType = oEvent.getParameter("arguments").processType; 
				this.privateFlag = jQuery.parseJSON(oEvent.getParameter("arguments").privateFlag);
				this.Context = "/AppointmentSet(guid'" + sApptGuid + "')";
				// adapt context for mock
				if (this.isMock){
					this.Context = "/AppointmentSet(Guid='" + sApptGuid + "')";
				}
				this.getView().bindElement(this.Context);
				this.followupAppointment(this.Context, sApptGuid,processType);
				window.setTimeout(jQuery.proxy(this._scrollToTop,this),10);
			}
			 /**
			 * @ControllerHook extHookCustomLogicOnRouteMatched provides for any additional logic customer can implement when loading the new appointments page.
			 * @callback sap.ca.scfld.md.controller.BaseFullScreenController~extHookCustomLogicOnRouteMatched
			 * @param {object}
			 *           oEvent
			 * @return {void}
			 */
		  if (this.extHookCustomLogicOnRouteMatched){
				this.extHookCustomLogicOnRouteMatched(oEvent);
			}
		}, this);
          
		// for the customizing status values
		var statusmodel = new sap.ui.model.json.JSONModel({});
		this.getView().setModel(statusmodel, "statusmodel");
		
		//for the customizing priority values
		if(parseFloat(this.sBackendVersion) >= 4){
		
		var priomodel = new sap.ui.model.json.JSONModel({});
		this.getView().setModel(priomodel,"priomodel");
		
		}
		

		// decoupled model for view display
		this.oViewModel = new sap.ui.model.json.JSONModel({});
		this.getView().setModel(this.oViewModel, "vm");

		// decoupled helper model for time display
		this.getView().setModel(new sap.ui.model.json.JSONModel({}), "vmh");

		//any additional parameters that determine the logical state of this view can be set here
		this.getView().setModel(new sap.ui.model.json.JSONModel({}),"viewState");
		
		this.bUpdate = false;
		this.followup = false;
		this.oBundle = this.oApplicationFacade.getResourceBundle();
	
	},

	getDatefromParameterString : function parse(str) {
		// format: yyymmdd --> Date
		if (!/^(\d){8}$/.test(str))
			return null;
		var y = str.substr(0, 4), m = str.substr(4, 2) - 1, d = str.substr(6, 2);
		return new Date(y, m, d);
		
		
	},

	/**
	 * 
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered (NOT before the
	 * first rendering! onInit() is used for that one!).
	 */
	 onBeforeRendering : function() {
			// initialize first day of week for the date picker value helps
			var locale = new sap.ui.core.LocaleData(sap.ui.getCore().getConfiguration().getLocale());
			this.byId("fd").setFirstDayOffset(locale.getFirstDayOfWeek());
			this.byId("td").setFirstDayOffset(locale.getFirstDayOfWeek());
			
			if(this.createFromOppt)
				{
			
			 					if(this.AccountName!=null)
			 						{
			 					//	console.log("account name "+this.AccountName);
			 						this.byId("ia").setValue(this.AccountName);
			 						
			 						//account field not being set properly from model and formatter, setting it explicitly
			 						this.getView().getModel('vm').oData.AccountTxt = this.AccountName;
			 						}
			 					if(this.ContactName!=null)
			 						{
			 							//console.log("account name"+this.ContactName);
			 							this.byId("ic").setValue(this.ContactName);
			 							}
			 					if(this.title!=null)
			 						{
			 						//console.log("title"+this.title);
			 					this.byId("desc").setValue(this.title);
			 						} 					
			
			 	}
			if(this.createFromTasks)
			{
		
		 					//if(this.AccountName!="" )
		 				//		{
		 					//	console.log("account name "+this.AccountName);
		 					//	this.byId("ia").setValue(this.AccountName1);
		 					//	}
		 					//if(this.ContactName!="")
		 						//{
		 							//console.log("account name"+this.ContactName);
		 							//this.byId("ic").setValue(this.ContactName1);
		 							//}
		 					if(this.title!="")
		 					{
		 						//console.log("title"+this.title);
		 					this.byId("desc").setValue(this.title);
		 						} 					
		
		 	}
			this.enableSaveBtn();
			
			
			
			
			
	 },
	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the
	 * HTML could be done here. This hook is the same one that SAPUI5 controls get after being rendered.
	 */
	 onAfterRendering : function() {
		 
		 
		
			
		 
		 
			 },
	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 */
	// onExit : function() {
	// },
	// return the entity displayed in the view -> viewmodel entity
	getViewEntity : function() {
		return this.getView().getModel("vm").getData();
	},

	// entry point for create navigation
	createAppointment : function(oStartDate, oProcessType) {
		var that = this;
		// Set Logged in employee as initial employee for new appointment
		if(parseFloat(this.sBackendVersion) >= 4.0){ 
			this.oModel.read("AppPartnerSet",null, [],true,jQuery.proxy(function(odata,response){	             
	      	   that.EmpResId = odata.results[0].PartnerNo;
	      	   that.Responsible = odata.results[0].PartnerNo;
	      	   that.ResponsibleTxt = odata.results[0].Fullname;	
	      	   oNewAppointment.Responsible = that.EmpResId;
	      	   oNewAppointment.ResponsibleTxt = that.ResponsibleTxt;
	      	   this.byId("responsibleText").setValue(that.ResponsibleTxt);
	         },this),jQuery.proxy(function(oError){},this));
		}

		var dFrom, dTo;
		this.bUpdate = false;
		this.followup = false;
		this.iCounter = 50;
		
		this._setViewMode("CREATE");
		
		if(this.privateFlag == false){
			this.byId("pf").setEnabled(false);
		}
		else{
			this.byId("pf").setEnabled(true);
		}
		
		if(oProcessType === undefined){ //old backend
			var oNewAppointment = {
					// "Guid" : "",
					"Description" : "",
					"PrivatFlag" : false,
					"AllDay" : false,
					"FromDate" : "",
					"ToDate" : "",
					"Location" : "",
					"Account" : (this.AccountID!=null) ? this.AccountID : "",
					"AccountTxt" : (this.AccountName!=null) ? this.AccountName : "",
					"Contact" : (this.ContactID!=null) ? this.ContactID : "",
					"ContactTxt" : "",
					"Note" : "",
					"Status" : "",
					"StatusTxt" : ""
				};
		}
		else{
		var PredecessorID="";
 					if(this.createFromOppt)
 						{
 						PredecessorID =this.opportunityId;
 						//console.log("predecessor id "+this.opportunityId);
 					}
 					if(this.createFromTasks)
						{
						PredecessorID =this.taskId;
						//console.log("predecessor id "+this.opportunityId);
					}

	// create new Appointment entity
		var oNewAppointment = { 
			// "Guid" : "",
			"Description" : "",
			"PrivatFlag" : false,
			"AllDay" : false,
			"FromDate" : "",
			"ToDate" : "",
			"Location" : "",
			"Responsible" : (this.Responsible) ? this.Responsible : "",
			"ResponsibleTxt" : (this.ResponsibleTxt) ? this.ResponsibleTxt : "",	 	
			"Account" : (this.AccountID) ? this.AccountID : "",
			"AccountTxt" : (this.AccountName) ? this.AccountName : "",
			"Contact" : (this.ContactID) ? this.ContactID : "",
			"ContactTxt" : (this.ContactName) ? this.ContactName : "",
			"Note" : "",
			"Status" : "",
			"StatusTxt" : "",
			"TransactionType" : oProcessType,
	 					"PredecessorID":PredecessorID,
	 				
		};
	    this._removeCrossAppAttributes();
		}
		// for create it is sufficient to load status from back end only once
		if (!this.oNewStatus) {
			
			if (this.isMock){
				
				this.getView().getModel("statusmodel").loadData("/cus.crm.mycalendar/model/Status.json", "", true );
				this.getView().getModel("statusmodel").attachRequestCompleted(this, function() {
					that.oNewStatus = that.getView().getModel("statusmodel").getData(); 
					oNewAppointment.Status = that.oNewStatus.results[0].StatusID;
					
					//account field not being set properly from model and formatter, setting it explicitly
					var oData = that.getView().getModel('vm').oData;
					var accountTxt = oData.AccountTxt;
					var account = oData.Account;
				    that.byId('ia').setValue(cus.crm.mycalendar.util.Conversions.formatAccountText(accountTxt,account));
				    var contactTxt=oData.ContactTxt;
				    that.byId("ic").setValue(contactTxt);
				    window.setTimeout(function(){
						  that.oStartEntityString = JSON.stringify(oData);
						  // disable SaveButton as long as required fields are empty
						  that.enableSaveBtn();
							
					  },10);
				    
				}, this);
				
			} else	{
				
//				that = this;
//			  this.oModel.callFunction("readAppointStatusCust", "GET", {
//			   	Guid : "",
//			   	TransactionType : oProcessType
//			  }, null, function(oData, response) {
//				   jQuery.sap.log.info("oData function call for status success");
//				   that.oNewStatus = oData;
//				   that.getView().getModel("statusmodel").setData(that.oNewStatus);
//				   if (that.oNewStatus.results){
//					   var i;
//					   for(i=0;i< that.oNewStatus.results.length;i++){
//					   if(that.oNewStatus.results[i].Default == true){
//						   oNewAppointment.Status = that.oNewStatus.results[i].StatusID;
//						   that.byId("st").setSelectedKey(oNewAppointment.Status);
//						   break;
//					   }
//					   }
//					   
//					
//					   //account field not being set properly from model and formatter, setting it explicitly
//						var oData = that.getView().getModel('vm').oData;
//						var accountTxt = oData.AccountTxt;
//						var account = oData.Account;
//					    that.byId('ia').setValue(cus.crm.mycalendar.util.Conversions.formatAccountText(accountTxt,account));
//					    var contactTxt=oData.ContactTxt;
//					    that.byId("ic").setValue(contactTxt);
//					    window.setTimeout(function(){
//							  that.oStartEntityString = JSON.stringify(oData);
//							  // disable SaveButton as long as required fields are empty
//							  that.enableSaveBtn();
//								
//						  },10);
//					    
//				   }
//			  }, function(oError) {
//				   jQuery.sap.log.error("oData function call for status failed");
//				   cus.crm.mycalendar.util.Util.handleErrors(oError);
//			  });
				
				var bReturn = cus.crm.mycalendar.util.Util.getCustomizing(oProcessType,this);
				
				if(bReturn === false){
					
					window.setTimeout(jQuery.proxy(function(){
			    		var sViewState = this._getViewMode();
			    		
			    		if(sViewState === "ERROR"){
			    			cus.crm.mycalendar.util.Util.showErrMsgBox(this.sErrMsg);
			    		}
			    	},this),10);
					return;
				}
				
				var oVM = this.getView().getModel("vm");
				
				if(parseFloat(this.sBackendVersion) >=4 ){
					
					var oCustModel = this.oApplicationFacade.getApplicationModel("customizing");
					var oData = oCustModel.oData;
					var statusmodel = this.getView().getModel("statusmodel");
					var priomodel = this.getView().getModel("priomodel");
					
					
					priomodel.setData({results : oData.UserPriorities});
					statusmodel.setData({results : oData.mStatuses[oProcessType]});
					
					var oDefaultPrio = cus.crm.mycalendar.util.Util.getDefaultPriority(oProcessType,this);
					
					if(oDefaultPrio !== null && oDefaultPrio !== undefined){
						 oNewAppointment.Priority = oDefaultPrio.Priority;
						 oNewAppointment.PriorityTxt = oDefaultPrio.TxtLong;
					}
					else{
						oNewAppointment.Priority = oData.UserPriorities[0].Priority;
						oNewAppointment.PriorityTxt = oData.UserPriorities[0].TxtLong;
					}
					
					var oDefaultStatus = cus.crm.mycalendar.util.Util.getDefaultStatus(oData.mStatuses[oProcessType]);
					
					if(oDefaultStatus !== null && oDefaultStatus !== undefined){
						oNewAppointment.Status = oDefaultStatus.statusID;
						oNewAppointment.StatusTxt = oDefaultStatus.StatusTxt;
					}
					else{
						oNewAppointment.Status = oData.mStatuses[oProcessType].statusID;
						oNewAppointment.StatusTxt = oData.mStatuses[oProcessType].StatusTxt;
					}
				}
				
				else{
					var oCustModel = this.oApplicationFacade.getApplicationModel("customizing");
					var oData = oCustModel.oData;
					var statusmodel = this.getView().getModel("statusmodel");
					statusmodel.setData({results : oData.mStatuses[oProcessType]});
					var oDefaultStatus = cus.crm.mycalendar.util.Util.getDefaultStatus(oData.mStatuses[oProcessType]);
					
					if(oDefaultStatus !== null){
						oNewAppointment.Status = oDefaultStatus.statusID;
						oNewAppointment.StatusTxt = oDefaultStatus.StatusTxt;
					}
					
				}
				var that = this;
				
				var accountTxt = oVM.oData.AccountTxt;
				var account = oVM.oData.Account;
			    this.byId('ia').setValue(cus.crm.mycalendar.util.Conversions.formatAccountText(accountTxt,account));
			    var contactTxt= oVM.oData.ContactTxt;
			    this.byId("ic").setValue(contactTxt);
			    window.setTimeout(function(){
					  that.oStartEntityString = JSON.stringify(oData);
					  // disable SaveButton as long as required fields are empty
					  that.enableSaveBtn();
						
				  },10);
			    
			    
				oVM.updateBindings();
				
			} 

		} else {
			this.getView().getModel("statusmodel").setData(this.oNewStatus);
			// set the status for the object stringify back navigation check
			if (this.oNewStatus.results){
				 var i;
				   for(i=0;i< this.oNewStatus.results.length;i++){
				   if(this.oNewStatus.results[i].Default == true){
					   oNewAppointment.Status = this.oNewStatus.results[i].StatusID;
					   this.byId("st").setSelectedKey(oNewAppointment.Status);
					   break;
				   }
			}
			}
		}
		if(oProcessType !== undefined){   //new backend
		oNewAppointment.TransactionType = oProcessType ; 
		}
		// initialize date for create
		if (oStartDate) {
			dFrom = new Date(oStartDate.getFullYear(), oStartDate.getMonth(), oStartDate.getDate());
			dTo = new Date(oStartDate.getFullYear(), oStartDate.getMonth(), oStartDate.getDate());
		} else {
			dFrom = new Date();
			dTo = new Date();
		}
		this.setDefaultTimes(dFrom, dTo);
		this.setTimeHelperModel(dFrom, dTo);

		oNewAppointment.FromDate = dFrom;
		oNewAppointment.ToDate = dTo;

		this.byId("p").bindProperty("title", "i18n>view.Appointment.newapptitle");

		// replaces data in view model before
		this.getView().getModel("vm").setData(oNewAppointment);
		this.getView().getModel("vm").updateBindings();
   
		this.setAllDay(oNewAppointment.AllDay);

		if (!this.isMock){
		  var oDataEmpty = {
		 	  results : []
		  };
		  var oAttView = this.byId("attachmentsView_chg1");
		  var oAttCont = oAttView.getController();
		  var mode = 1;
		  oAttCont.refresh("", oDataEmpty, mode);
		}

		// default the non-bound attendee fields
		var oDisplayAttendee = this.getAttendeeStrings(oNewAppointment.Attendee);
		this.byId("atin").setText(oDisplayAttendee.internal);
		this.byId("atex").setText(oDisplayAttendee.external);

		// didn't work directly in view because data not set on init
		this.byId("desc").setMaxLength(40);
		this.byId("loc").setMaxLength(100);
		
		//account field not being set properly from model and formatter, setting it explicitly
		var oData = that.getView().getModel('vm').oData;
		var accountTxt = oData.AccountTxt;
		var account = oData.Account;
	    that.byId('ia').setValue(cus.crm.mycalendar.util.Conversions.formatAccountText(accountTxt,account));
	    var contactTxt=oData.ContactTxt;
	    that.byId("ic").setValue(contactTxt);
		// set ProcessType Description.
	    
	   
		this.getView().byId("TypecFormElement").setVisible(false);
		this.getView().byId("ProcessTypeLabel").setVisible(false);
		this.getView().byId("ProcessTypeText").setVisible(false);
		var processTypeDescr = null;
		if(this.createFromTasks)
			processTypeDescr = this.processTypeDesFromTask;
		else if(this.createFromOppt)
			processTypeDescr = this.processTypeDescriptionfromoppt;
		else if(this.createdfromNotes)
			processTypeDescr = this.processTypeDesFromNote;
		else if(this.createFromAccount)
			processTypeDescr = this.processTypeDescriptionFromAccount;
		else {
			if (this.getView().getModel("controllers"))  {
				var listController = this.getView().getModel("controllers").getData().apptListController;
				if (listController != null	|| listController != undefined) {
					processTypeDescr = listController.processTypeDesc;
					
				}
			}
		
		}
			if (processTypeDescr != null) {
				this.getView().byId("TypecFormElement").setVisible(true);
				this.getView().byId("ProcessTypeLabel").setVisible(true);
				this.getView().byId("ProcessTypeText").setVisible(true);
				this.getView().byId("ProcessTypeText").setText(processTypeDescr);
			}
		
		
			window.setTimeout(function(){
			  that.oStartEntityString = JSON.stringify(oData);
			  // disable SaveButton as long as required fields are empty
			  that.enableSaveBtn();
				
		  },10);
		 /**
		 * @ControllerHook extHookCreateAppointment provides for any additional logic customer can implement in the createAppointment function.
		 *                 
		 * @callback sap.ca.scfld.md.controller.BaseFullScreenController~extHookCreateAppointment
		 * 
		 * @return {void}
		 */
	  if (this.extHookCreateAppointment){
		    this.extHookCreateAppointment();
		}
	    
	},

	// entry point for edit navigation
	editAppointment : function(sEntityPath, sApptGuid) {

		var startTimezoneOffset;
		var endTimezoneOffset;
		var startTimezoneOffsetMs;
		var endTimezoneOffsetMs;		
		
		this.sEntityPath = sEntityPath;
		this.sApptGuid = sApptGuid;
		this._setViewMode("EDIT");
		this.followup = false;
		this.bUpdate = true;
		this.iCounter = 50; // for new AttendeeSet Partnerguid
		// show employee responsible
		this.byId("responsible").setVisible(true);
			
		var that = this;
		var oProcessType; 
		if (this.oModel.read) {
			// read the data from backend, could be changed in the meanwhile:

			this.oModel.read(sEntityPath, null, ["$expand=Attendee,AppointmentToAttachment"], false, function(odata, response) {
				// success call back, set entity and bind
				jQuery.sap.log.info("edit view - oData read success");

				
				//save eTag 
				if(parseFloat(that.sBackendVersion) >=4){
				cus.crm.mycalendar.util.Util._saveETag(odata.__metadata.etag);
				}
				var aAttendees = odata.Attendee.results;
				var oEditAppointment = odata;
				oProcessType = odata.TransactionType;
				oEditAppointment.Attendee = aAttendees;
				
				if (odata.ProcessTypeDescription ==  null ){
					that.getView().byId("TypecFormElement").setVisible(false);
					that.getView().byId("ProcessTypeLabel").setVisible(false);
					that.getView().byId("ProcessTypeText").setVisible(false);
				}else{
					that.getView().byId("TypecFormElement").setVisible(true);
					that.getView().byId("ProcessTypeLabel").setVisible(true);
					that.getView().byId("ProcessTypeText").setVisible(true);
					that.getView().byId("ProcessTypeText").setText(	odata.ProcessTypeDescription);
				}
				
				if(parseFloat(that.sBackendVersion) >= 3){
					if(oEditAppointment.PrivateAllowed == false){
						that.byId("responsibleText").setEnabled(true);
					}
					else{ //private flag and Employee field status
						if(odata.MyOwn == false)			
						{	//Shared Calendar
							that.byId("pf").setEnabled(false);
							that.byId("responsibleText").setEnabled(true);
						}
						else						
						{ 	//My Calendar
							if(that.byId("pf").getState()){
								that.byId("responsibleText").setEnabled(false);}
							else{
								that.byId("responsibleText").setEnabled(true);}
							that.byId("pf").setEnabled(true);
						}
					}
				}
				
				if (that.isMock){
					// adapt dates for mockmode...
					odata.FromDate = that.adaptMockDate(odata.FromDate);
					odata.ToDate = that.adaptMockDate(odata.ToDate);	
				}
				
				// replaces data in view model before

				// In case of all day appointment, add back in offset to GMT
				
				if (oEditAppointment.AllDay) {
				
					startTimezoneOffset = oEditAppointment.FromDate.getTimezoneOffset();
					endTimezoneOffset = oEditAppointment.ToDate.getTimezoneOffset();	
				
					startTimezoneOffsetMs = startTimezoneOffset * 60 * 1000;
					endTimezoneOffsetMs = endTimezoneOffset * 60 * 1000;			
				
					oEditAppointment.FromDate.setTime( oEditAppointment.FromDate.getTime() + startTimezoneOffsetMs );
					oEditAppointment.ToDate.setTime( oEditAppointment.ToDate.getTime() + endTimezoneOffsetMs );
					}
				
				that.getView().getModel("vm").setData(oEditAppointment);				
				that.getView().getModel("vm").updateBindings();
				
				//save status code - needed for rebinding later
				that.statusCode = that.getView().getModel("vm").oData.Status;
				
				that.setTimeHelperModel(oEditAppointment.FromDate, oEditAppointment.ToDate);

				that.byId("ft").setVisible(!oEditAppointment.AllDay);
				that.byId("tt").setVisible(!oEditAppointment.AllDay);
				
//				//Deeplinking of edit button in My appointments
//				that.oModel.createBindingContext(that.Context, "", {
//                    expand : "Attendee,AccountRel/Logo,AppointmentToAttachment"
//			 }, function(oContext) {
//                    that.getView().bindElement(that.Context);

				//var sPath = that.getView().getBindingContext().getPath();
				//var oData = that.getView().getModel().getData(sPath, null, true);

                if (!that.isMock){
                    var oAttView2 = that.byId("attachmentsView_chg1");
                    var oAttCont2 = oAttView2.getController();
                    //oAttView2.bindElement(sEntityPath);
                    var mode = 1;
                    oAttCont2.refresh(sEntityPath, odata.AppointmentToAttachment, mode);
                  }
		//	 }, false);
			
				// the attendee string for display
				var oDisplayAttendee = that.getAttendeeStrings(oEditAppointment.Attendee);
				that.byId("atin").setText(oDisplayAttendee.internal);
				that.byId("atex").setText(oDisplayAttendee.external);
				that.byId("p").bindProperty("title", "i18n>view.Appointment.editappointment");
				// didn't work directly in view because data not set on init
				that.byId("desc").setMaxLength(40);
				that.byId("loc").setMaxLength(100);
				
				//account field not being set properly from model and formatter, setting it explicitly
				var oData = that.getView().getModel('vm').oData;
				var accountTxt = oData.AccountTxt;
				var account = oData.Account;
			    that.byId('ia').setValue(cus.crm.mycalendar.util.Conversions.formatAccountText(accountTxt,account));
			    
			
				
			}, function(oError) {
				jQuery.sap.log.error("edit view - oData read request failed");
			});

	    if (this.isMock){
				
	    	if(!this.oNewStatus){
				  this.getView().getModel("statusmodel").loadData("/cus.crm.mycalendar/model/Status.json", "", true );
				  this.getView().getModel("statusmodel").attachRequestCompleted(this, function() {
					  this.oNewStatus = this.getView().getModel("statusmodel").getData(); 
				  }, this);
	    	}
				
			} else	{
			  
				    var bReturn = cus.crm.mycalendar.util.Util.getCustomizing(oProcessType,this);
				    if(bReturn === false){
				    	window.setTimeout(jQuery.proxy(function(){
				    		var sViewState = this._getViewMode();
				    		
				    		if(sViewState === "ERROR"){
				    			cus.crm.mycalendar.util.Util.showErrMsgBox(this.sErrMsg);
				    		}
				    	},this),10);
				    	return;
				    }
					var oVM = this.getView().getModel("vm");
					var oCustModel = this.oApplicationFacade.getApplicationModel("customizing");
					var oData = oCustModel.oData;
					var statusmodel = this.getView().getModel("statusmodel");
					
					var aStatuses = (parseFloat(this.sBackendVersion) >= 4) ? oData.mNextPossibleStatuses[oProcessType] : oData.mStatuses[oProcessType];
					statusmodel.setData({results : aStatuses});
					
					if(parseFloat(this.sBackendVersion) >= 4){
						
					var priomodel = this.getView().getModel("priomodel");
					priomodel.setData({results : oData.UserPriorities});
					
                  
					}
					
					oVM.updateBindings();
			}
		}
		
		 /**
		 * @ControllerHook extHookEditAppointment provides for any additional logic customer can implement in the editAppointment function. 
		 * @callback sap.ca.scfld.md.controller.BaseFullScreenController~extHookEditAppointment
		 * @param {string} sEntityPath 
		 * @param {string} sApptGuid
		 *          
		 * @return {void}
		 */
	  if (this.extHookEditAppointment){
			this.extHookEditAppointment(sEntityPath,sApptGuid);
		}
		
		

	},
	
	followupAppointment : function(sEntityPath,sApptGuid,processType)
	{
		var startTimezoneOffset;
		var endTimezoneOffset;
		var startTimezoneOffsetMs;
		var endTimezoneOffsetMs;		
		
		this.bUpdate = false;
		this._setViewMode("CREATE");
		this.followup = true;
		this.iCounter = 50; // for new AttendeeSet Partnerguid
		// show employee responsible
		this.byId("responsible").setVisible(true);
		
		var that = this;
		var oProcessType; 
		if (this.oModel.read) {
			// read the data from backend, could be changed in the meanwhile:

			this.oModel.read(sEntityPath, null, ["$expand=Attendee,AppointmentToAttachment"], false, function(odata, response) {
				// success call back, set entity and bind
				jQuery.sap.log.info("edit view - oData read success");

				var aAttendees = odata.Attendee.results;
				var oEditAppointment = odata;
				oProcessType = processType;
				oEditAppointment.TransactionType = processType;
				oEditAppointment.PrivatFlag = that.privateFlag;
				oEditAppointment.Attendee = aAttendees;
                oEditAppointment.PredecessorGUID = sApptGuid;
				if (that.isMock){
					// adapt dates for mockmode...
					odata.FromDate = that.adaptMockDate(odata.FromDate);
					odata.ToDate = that.adaptMockDate(odata.ToDate);	
				}
				//since this is a new appointment
				var dFrom = new Date();
				var dTo = new Date();
				
				that.setDefaultTimes(dFrom, dTo);
				oEditAppointment.FromDate = dFrom; 
				oEditAppointment.ToDate = dTo;
				oEditAppointment.Guid = undefined; 
				that.getView().getModel("vm").setData(oEditAppointment);				
				that.getView().getModel("vm").updateBindings();
				that.setTimeHelperModel(oEditAppointment.FromDate, oEditAppointment.ToDate);

				that.byId("ft").setVisible(!oEditAppointment.AllDay);
				that.byId("tt").setVisible(!oEditAppointment.AllDay);

				var sPath = that.getView().getBindingContext().getPath();

				/*if (!that.isMock){
				  var oAttView2 = that.byId("attachmentsView_chg1");
				  var oAttCont2 = oAttView2.getController();
				  oAttView2.bindElement(sPath);
				  var mode = 1;
				  oAttCont2.refresh(sPath, odata.AppointmentToAttachment, mode);
				}
*/
				// the attendee string for display
				var oDisplayAttendee = that.getAttendeeStrings(oEditAppointment.Attendee);
				that.byId("atin").setText(oDisplayAttendee.internal);
				that.byId("atex").setText(oDisplayAttendee.external);
				that.byId("p").bindProperty("title", "i18n>view.Appointment.newapptitle");
				/*that.byId("p").bindProperty("title", "i18n>view.Appointment.editappointment");*/
				// didn't work directly in view because data not set on init
				that.byId("desc").setMaxLength(40);
				that.byId("loc").setMaxLength(100);
				that.byId("loc").setValue("");
				//account field not being set properly from model and formatter, setting it explicitly
				var oData = that.getView().getModel('vm').oData;
				var accountTxt = oData.AccountTxt;
				var account = oData.Account;
			    that.byId('ia').setValue(cus.crm.mycalendar.util.Conversions.formatAccountText(accountTxt,account));
			    
				// set ProcessType Description.
				that.getView().byId("TypecFormElement").setVisible(false);
				that.getView().byId("ProcessTypeLabel").setVisible(false);
				that.getView().byId("ProcessTypeText").setVisible(false);
				var processTypeDescr = null;
			
				var detailController = that.oApplicationFacade.getApplicationModel("detailController").getData().detailController;
				if (detailController != null	|| detailController != undefined) {
					processTypeDescr = detailController.ProcessTypeDescription;
					if (processTypeDescr != null) {
						that.getView().byId("TypecFormElement").setVisible(true);
						that.getView().byId("ProcessTypeLabel").setVisible(true);
						that.getView().byId("ProcessTypeText").setVisible(true);
						that.getView().byId("ProcessTypeText").setText(processTypeDescr);
					}
				}
				
			    
				window.setTimeout(function(){
				  that.oStartEntityString = JSON.stringify(oData);
				// disable SaveButton as long as required fields are empty
				  that.enableSaveBtn();
					
			  },10);
				
			}, function(oError) {
				jQuery.sap.log.error("edit view - oData read request failed");
			});

	    if (this.isMock){
				
	    	if(!this.oNewStatus){
				  this.getView().getModel("statusmodel").loadData("/cus.crm.mycalendar/model/Status.json", "", true );
				  this.getView().getModel("statusmodel").attachRequestCompleted(this, function() {
					  this.oNewStatus = this.getView().getModel("statusmodel").getData(); 
				  }, this);
	    	}
				
			} else	{
				var bReturn = cus.crm.mycalendar.util.Util.getCustomizing(processType,this);
				
				if(bReturn === false){
					
					window.setTimeout(jQuery.proxy(function(){
			    		var sViewState = this._getViewMode();
			    		
			    		if(sViewState === "ERROR"){
			    			cus.crm.mycalendar.util.Util.showErrMsgBox(this.sErrMsg);
			    		}
			    	},this),10);
					return;
				}
				    var oVM = this.getView().getModel("vm");
					var oCustModel = this.oApplicationFacade.getApplicationModel("customizing");
					var oData = oCustModel.oData;
					var statusmodel = this.getView().getModel("statusmodel");
					
					if(parseFloat(this.sBackendVersion) >=4 ){
						
				  	 var priomodel = this.getView().getModel("priomodel");
					 priomodel.setData({results : oData.UserPriorities});
					
				    }
					statusmodel.setData({results : oData.mStatuses[processType]});
				    oVM.updateBindings();
			  
			
			}
		}
		
		// disable SaveButton as long as required fields are empty
		this.enableSaveBtn();
		
		

	},

	// raw and not final, just to have a first display
	getAttendeeStrings : function(aAttendee) {
		var sInternal = "", sExternal = "", sAttendeeCount = 0;
		if (aAttendee) {
			for ( var i = 0, l = aAttendee.length; i < l; i++) {
				if (aAttendee[i].IntAttendee) {
					if(sInternal){
						sInternal += "; " + aAttendee[i].FullName;
					}
					else{
						sInternal = aAttendee[i].FullName;
					}
					
				} else {
					if(sExternal){
						sExternal += "; " + aAttendee[i].FullName;
					}
					else{
						sExternal = aAttendee[i].FullName;
					}
					
				}
			}
			sAttendeeCount = aAttendee.length;
		}

		sInternal = sInternal || this.oBundle.getText("view.Appointment.attinternaladd");
		sExternal = sExternal || this.oBundle.getText("view.Appointment.attexternaladd");

		// adapt the attendee title
		this.byId("atttit").setTitle(this.oBundle.getText("view.Appointment.additionalAttendeeNumber", [sAttendeeCount]));

		return {
			internal : sInternal,
			external : sExternal
		};
	},

	// event handler for allDay switch button
	onAllDayChanged : function(oEv) {
		var bAllDay = oEv.getParameter("state");
		this.setAllDay(bAllDay);
	},

	setAllDay : function(bAllDay) {
		// disable the time input fields
		var bState = bAllDay; // value of control
		this.byId("ft").setVisible(!bState);
		this.byId("tt").setVisible(!bState);
		

		if (bState) {
			var data = this.oViewModel.getData(), h, m, oHelper = this.getView().getModel("vmh");

			data.FromDate.setHours(0, 0, 0, 0);
			data.ToDate.setHours(23, 59, 59, 0);

//			this.byId("ft").setValue("00:00");
//			this.byId("tt").setValue("00:00");
		} else {
			var data = this.oViewModel.getData();
			
			var vmData = this.getView().getModel("vmh").getData();
			var m = vmData.FromDateTime.getMinutes();
			var h = vmData.FromDateTime.getHours();
			data.FromDate.setHours(h, m, 0, 0);
			
			 m = vmData.ToDateTime.getMinutes();
			 h = vmData.ToDateTime.getHours();
			 data.ToDate.setHours(h, m, 0, 0);
			
//			this.byId("ft").setDisplayFormat(locale.getTimePattern("short"));
//			this.byId("tt").setDisplayFormat(locale.getTimePattern("short"));

			// When switch to non AllDay, get default appointment times
//			var current = this.oViewModel.getData();
//			var fDate = current.FromDate;
//			var tDate = current.ToDate;
//			this.setDefaultTimes(fDate, tDate);
//			
//			var timePattern = this.byId("ft").getValueFormat();
//			var timeFormatter = sap.ui.core.format.DateFormat.getTimeInstance({
//				// style : "short"
//				pattern : timePattern
//			});
//			// set value has to be called with format of control - getValueFormat
//			this.byId("ft").setValue(timeFormatter.format(fDate));
//			this.byId("tt").setValue(timeFormatter.format(tDate));
		}

	},

	// helper method to determine a start time for new appointments
	// -> start time : next half hour of system time
	// 7:38 -> 8:00 -> 8:30
	// 7:24 -> 7:30 -> 8:00
	setDefaultTimes : function(oStartDate, oToDate) {

		var oDummyDate = new Date(), ht = oDummyDate.getHours(), h = ht, mt = oDummyDate.getMinutes(), m = mt;

		if (m > 30) {
			// 7:38 -> 8:00 -> 8:30
			ht = h = h + 1;
			m = 0;
			mt = 30;
		} else {
			// 7:24 -> 7:30 -> 8:00
			ht = h + 1;
			m = 30;
			mt = 0;
		}

		oStartDate.setHours(h);
		oStartDate.setMinutes(m);
		oToDate.setHours(ht);
		oToDate.setMinutes(mt);

	},

	setTimeHelperModel : function(oFrom, oTo) {
		var oFromTime = new Date(oFrom), oToTime = new Date(oTo);
		this.getView().getModel("vmh").setData({
			FromDateTime : oFromTime,
			ToDateTime : oToTime
		});
	},

	onTimeToChanged : function() {
		// put time values from helper model to data model
		var data = this.oViewModel.getData(), h, m, oHelper = this.getView().getModel("vmh");

		m = oHelper.oData.FromDateTime.getMinutes();
		h = oHelper.oData.FromDateTime.getHours();
		data.FromDate.setHours(h, m, 0, 0);

		m = oHelper.oData.ToDateTime.getMinutes();
		h = oHelper.oData.ToDateTime.getHours();
		data.ToDate.setHours(h, m, 0, 0);

		// If appointment is on one day, check if end time is after start time
		var startDate = new Date(data.FromDate);
		var endDate = new Date(data.ToDate);

		startDate.setHours(0, 0, 0, 0);
		endDate.setHours(0, 0, 0, 0);

		var startDateMs = startDate.getTime();
		var endDateMs = endDate.getTime();

		if (startDateMs == endDateMs) {

			var startHours = data.FromDate.getHours();
			var startMins = data.FromDate.getMinutes();
			var endHours = data.ToDate.getHours();
			var endMins = data.ToDate.getMinutes();

			if ((startHours * 60 + startMins) > (endHours * 60 + endMins))
			// If end time is before start time, set end time to start time plus 30 minutes
			{
				data.FromDate = new Date(data.ToDate.getTime() - 30 * 60000);
				h = data.FromDate.getHours();
				m = data.FromDate.getMinutes();
				oHelper.oData.FromDateTime.setHours(h, m, 0, 0);
				var DateValue = new Date(oHelper.oData.FromDateTime);

				var locale = new sap.ui.core.LocaleData(sap.ui.getCore().getConfiguration().getLocale());
				var valueFormat =  this.byId("tt").getValueFormat();
				var timeFormatter = sap.ui.core.format.DateFormat.getTimeInstance({
					pattern : valueFormat
				});
				this.byId("ft").setValue(timeFormatter.format(DateValue));
			
			}
		}

	},

	onTimeFromChanged : function() {
		// put time values from helper model to data model
		var data = this.oViewModel.getData(), h, m, oHelper = this.getView().getModel("vmh");

		m = oHelper.oData.FromDateTime.getMinutes();
		h = oHelper.oData.FromDateTime.getHours();
		data.FromDate.setHours(h, m, 0, 0);

		m = oHelper.oData.ToDateTime.getMinutes();
		h = oHelper.oData.ToDateTime.getHours();
		data.ToDate.setHours(h, m, 0, 0);

		// If appointment is on one day, check if end time is after start time
		var startDate = new Date(data.FromDate);
		var endDate = new Date(data.ToDate);

		startDate.setHours(0, 0, 0, 0);
		endDate.setHours(0, 0, 0, 0);

		var startDateMs = startDate.getTime();
		var endDateMs = endDate.getTime();

		if (startDateMs == endDateMs) {

			var startHours = data.FromDate.getHours();
			var startMins = data.FromDate.getMinutes();
			var endHours = data.ToDate.getHours();
			var endMins = data.ToDate.getMinutes();

			if ((startHours * 60 + startMins) > (endHours * 60 + endMins))
			// If end time is before start time, set end time to start time plus 30 minutes
			{
				data.ToDate = new Date(data.FromDate.getTime() + 30 * 60000);
				h = data.ToDate.getHours();
				m = data.ToDate.getMinutes();
				oHelper.oData.ToDateTime.setHours(h, m, 0, 0);
				var DateValue = new Date(oHelper.oData.ToDateTime);

				var locale = new sap.ui.core.LocaleData(sap.ui.getCore().getConfiguration().getLocale());
				var valueFormat =  this.byId("tt").getValueFormat();
				var timeFormatter = sap.ui.core.format.DateFormat.getTimeInstance({
					pattern : valueFormat
				});
				this.byId("tt").setValue(timeFormatter.format(DateValue));
				
			}
		}

	},

	isStartEndDateCorrect: function() {
		// check from date
		var dateFrom = this.byId("fd").getValue();
		var pDateFrom = this.parseDate(dateFrom);
		// check to date
		var dateTo = this.byId("td").getValue();
		var pDateTo = this.parseDate(dateTo);
		// both dates are invalid
		if (!pDateFrom && !pDateTo) {
			sap.ca.ui.message.showMessageBox({
				type : sap.ca.ui.message.Type.WARNING,
				message : this.oBundle.getText("view.Appointment.validStartEndDate")
			});
			return false;
		}
		// start date is invalid
		if (!pDateFrom ) {
			sap.ca.ui.message.showMessageBox({
				type : sap.ca.ui.message.Type.WARNING,
				message : this.oBundle.getText("view.Appointment.validStartDate")
			});
			return false;
		}
		// end date is invalid
		if (!pDateTo ) {
			sap.ca.ui.message.showMessageBox({
				type : sap.ca.ui.message.Type.WARNING,
				message : this.oBundle.getText("view.Appointment.validEndDate")
			});
			return false;
		}
	
		return true;
	},
	
	onFromDateChanged : function(oEvent) {
		
	// disable SaveButton as long as required fields are empty
		this.enableSaveBtn();		
		
		if (!this.isStartEndDateCorrect()) {
			return;
		}

		var datein = this.byId("fd").getValue();
		var pDate = this.parseDate(datein);

		var oDateNow = new Date(), datevalue = this.byId("fd").getValue(), date, data, h, m, y, mo, day, oTimeModel, mf, hf;
		oDateNow.setHours(0, 0, 0, 0);

//      Date entered in control and parsed to give a date object
		date = new Date(pDate);
		
		data = this.oViewModel.getData();

		// to save the h and m -> get them from vmh
		oTimeModel = this.getView().getModel("vmh").getData();
		m = oTimeModel.FromDateTime.getMinutes();
		h = oTimeModel.FromDateTime.getHours();
		data.FromDate.setHours(h, m, 0, 0);

		if (data.FromDate.getTime() > data.ToDate.getTime()) {
			this.byId("td").setValue(datevalue);
			y = date.getFullYear();
			mo = date.getMonth();
			day = date.getDate();
			m = oTimeModel.ToDateTime.getMinutes();
			h = oTimeModel.ToDateTime.getHours();
			data.ToDate.setFullYear(y, mo, day);
			data.ToDate.setHours(h, m, 0, 0);
		// Now check that the start time is before the end time
			mf = oTimeModel.FromDateTime.getMinutes();
			hf = oTimeModel.FromDateTime.getHours();
			
			// Appointment now has same start and end date.  In case that the start time is before end time
			if ((hf * 60 + mf) > (h * 60 + m)) {
				// Make end time = start time plus 30 mins
				data.ToDate = new Date(data.FromDate.getTime() + 30 * 60000);
				oTimeModel.ToDateTime.setMinutes(data.ToDate.getMinutes());
				oTimeModel.ToDateTime.setHours(data.ToDate.getHours());
				var locale = new sap.ui.core.LocaleData(sap.ui.getCore().getConfiguration().getLocale());
				var valueFormat = this.byId("tt").getValueFormat();
				var timeFormatter = sap.ui.core.format.DateFormat.getTimeInstance({pattern: valueFormat});
				this.byId("tt").setValue(timeFormatter.format(oTimeModel.ToDateTime));
//				this.byId("tt").setDisplayFormat(locale.getTimePattern("short"));				
				
			}

			
		}

		// message in case appointment is in the past
		if (date < oDateNow) {
			sap.ca.ui.message.showMessageBox({
				type : sap.ca.ui.message.Type.WARNING,
				message : this.oBundle.getText("view.Appointment.occurspast")
			});
		}
	},

	onToDateChanged : function(oEvent) {
		
		// disable SaveButton as long as required fields are empty
		this.enableSaveBtn();
		
		if (!this.isStartEndDateCorrect()) {
			return;
		}

		var datein = this.byId("td").getValue();
		var pDate = this.parseDate(datein);

		var y, mo, day, m, h, mf, hf, date, qDate, oTimeModel, datevalue, data = this.oViewModel.getData();

		// getValue -> datevalue is a string, pure date with hours 00:00:00
		date = new Date(pDate);

		y = date.getFullYear();
		mo = date.getMonth();
		day = date.getDate();

		data.ToDate.setFullYear(y, mo, day);

		// and get the current time from time helper object
		oTimeModel = this.getView().getModel("vmh").getData();
		m = oTimeModel.ToDateTime.getMinutes();
		h = oTimeModel.ToDateTime.getHours();

		data.ToDate.setHours(h, m, 0, 0);
		
		if (data.FromDate.getTime() > data.ToDate.getTime()) {
			datevalue = this.byId("fd").getValue();
			this.byId("td").setValue(datevalue);
			qDate = this.parseDate(datevalue);

			y = qDate.getFullYear();
			mo = qDate.getMonth();
			day = qDate.getDate();
			data.ToDate.setFullYear(y, mo, day);
			
		// Now check that the start time is before the end time
			mf = oTimeModel.FromDateTime.getMinutes();
			hf = oTimeModel.FromDateTime.getHours();
			
		// In case the start time is after the end time, use start time and add 30 mins for end time	
			if ((hf * 60 + mf) > (h * 60 + m)) {
				data.ToDate = new Date(data.FromDate.getTime() + 30 * 60000);
				oTimeModel.ToDateTime.setMinutes(data.ToDate.getMinutes());
				oTimeModel.ToDateTime.setHours(data.ToDate.getHours());
				var locale = new sap.ui.core.LocaleData(sap.ui.getCore().getConfiguration().getLocale());
				var valueFormat = this.byId("tt").getValueFormat();
				var timeFormatter = sap.ui.core.format.DateFormat.getTimeInstance({pattern: valueFormat});
				this.byId("tt").setValue(timeFormatter.format(oTimeModel.ToDateTime));
//				this.byId("tt").setDisplayFormat(locale.getTimePattern("short"));				
				
			}
			
		}
	},
		
	initAccountF4 : function(oInput) {
		var sAccountAnnotation = cus.crm.mycalendar.util.Schema._getEntityAnnotation(this.oModel,"service-schema-version","Account");
	   cus.crm.mycalendar.util.AccountF4 = {

			getLIItem : function() {

				var oLITemplate = new sap.m.StandardListItem(
						{
							//title :"{parts:[{path:'fullName'}], formatter: 'cus.crm.mycalendar.util.Util.getAccountF4Title'}",
							title :  (sAccountAnnotation === null) ? "{parts:[{path:'name1'}], formatter: 'cus.crm.mycalendar.util.Util.getAccountF4Title'}" : "{parts:[{path:'fullName'}], formatter: 'cus.crm.mycalendar.util.Util.getAccountF4Title'}",
							//description : "{parts:['MainAddress/city', 'MainAddress/country'], formatter: 'cus.crm.mycalendar.util.Formatter.getAccountF4Description'}",
							description : (sAccountAnnotation === null) ? "{parts:['MainAddress/city', 'MainAddress/country'], formatter: 'cus.crm.mycalendar.util.Util.formatAccountPlace'}":"{parts:[{path:'MainAddress/city'}, {path:'MainAddress/country'}, {path:'accountID'}], formatter: 'cus.crm.mycalendar.util.Util.getAccountF4Description'}",
							
							active : true
						});

				return oLITemplate;
			},

			create : function() {
				
				var oAccountF4 = new sap.m.SelectDialog();
				oAccountF4.myLItemplate = this.getLIItem();
             	// attach the filtering functions
				oAccountF4.attachSearch(cus.crm.mycalendar.util.Util.getSearch( (sAccountAnnotation === null) ? "name1" : "fullName"));
				oAccountF4.attachLiveChange(cus.crm.mycalendar.util.Util
						.getLiveSearch((sAccountAnnotation === null) ? "name1" : "fullName"));

				// that = this;
				oAccountF4.triggerSearch = function(value) {

					// Get the binded items
					var itemsBinding = this.getBinding("items");
					var aFilter = [];

					if (value) {
						var selectFilter = new sap.ui.model.Filter( (sAccountAnnotation === null) ? "name1" : "fullName",
								sap.ui.model.FilterOperator.Contains, value);
						
						aFilter.push(selectFilter);
					}

					if (itemsBinding !== undefined) {
						// no binding yet -> binding
						itemsBinding.aApplicationFilters = [];
					}
						this
								.bindAggregation(
										"items",
										{
											path : "/AccountCollection",
											parameters : {
												expand : 'MainAddress',
												select : 'accountID,MainAddress/city,MainAddress/country,' + ((sAccountAnnotation === null) ?'name1' : 'fullName')
											},
											template : this.myLItemplate,
											filters : aFilter
										});
					    
						      itemsBinding = this.getBinding("items");
					    	
						// itemsBinding.filter(aFilter);
			
				};

				return oAccountF4;
			}

		};
	this.oAccF4 = cus.crm.mycalendar.util.AccountF4.create();
	this.oAccF4.setModel(this.getView().getModel("i18n"), "i18n");
	this.oAccF4.setModel(cus.crm.mycalendar.util.Util.getSearchModel(this.oModel, this.isMock));
	
	
	if (this.oAccF4._searchField){
		this.oAccF4._searchField.setPlaceholder(this.oBundle.getText("view.Appointment.searchfieldplaceholder"));			
	}
	if (this.oAccF4._dialog){
		  // fix size 
		  this.oAccF4._dialog.setContentWidth("480px");
		  // a workaround for showing scrollbar in the SelectDialog also with a zoom <65%
		  // the problem shall be fixed with SAPUI5 1.20 
		  this.oAccF4._list.setGrowingThreshold(40);
		//set account f4 help depending on backend version
		  
		
		  
		  
		
		}
	var that = this;
	// attach close handler only once..
	this.oAccF4.attachConfirm(function(evt) {
		var selectedItem = evt.getParameter("selectedItem");
		if (selectedItem) {
			var oAccount = selectedItem.getBindingContext().getObject();
			var sAccount;
		   sAccount =  (sAccountAnnotation !== null) ?  oAccount.fullName :  oAccount.name1;
		   if(sAccount === ""){ 
			   oInput.setValue(oAccount.accountID); 
		   }
		   else{
			   oInput.setValue(sAccount);
		   }
			var data = that.oViewModel.getData();
			data.Account = oAccount.accountID;
            data.AccountTxt = sAccount;
		}
	});
	this.oAccF4.attachCancel(function(evt) {
		// clear the input fields, this is the wanted behaviour now.
		/*that.byId("ia").setValue("");*/
		var oEntity = that.getViewEntity();
		oEntity.Account = "";
		oEntity.AccountTxt = "";
	});
	this.oAccF4._list.attachUpdateStarted(function(oEvent){
		oEvent.getSource().setNoDataText(that.oBundle.getText("view.Appointment.searchlistinfo"));
	  // experimental enhance title with number of hits
		that.oAccF4.setTitle(that.oBundle.getText("view.Appointment.acsea_title", ["0"]));
	});
	this.oAccF4._list.attachUpdateFinished(function(oEvent){
		oEvent.getSource().setNoDataText(that.oBundle.getText("view.Appointment.acsea_nodata"));
		// experimental enhance title with number of hits
		that.oAccF4.setTitle(that.oBundle.getText("view.Appointment.acsea_title", [oEvent.getParameter("total")]));
		
	});
		
	

},
	onF4Account : function(oEvent) {
		var oInput = oEvent.getSource();
		var sValue = oInput.getValue();
		if (!this.oAccF4) {
			this.initAccountF4(oInput);
		}
		
		this.oAccF4.triggerSearch(sValue);
		this.oAccF4.open(sValue);
	},

	// trigger f4 help on input if input available
	onAccountChanged : function(oEvent) {
		if (oEvent.getSource().getValue()) {
		  this.onF4Account(oEvent);
		}
	},
	
	
	// ///////////////////////////////////////////////////////////////////////////////
	// typeahead for account
	// ///////////////////////////////////////////////////////////////////////////////

	   onAccountInputFieldChanged: function(oEvent) {
	       	var accountInput = oEvent.getSource();
	      
	       	this._setAccount("", accountInput.getValue());
	      
	      accountInput.setShowSuggestion(true);
	       //to refresh in same list on press of backspace
	       //	accountInput.removeAllSuggestionItems();
	       	accountInput.setFilterSuggests(false);
	       	var fnCheckAccount = function(aAccounts) {
	       		accountInput.removeAllSuggestionItems();
	       		if(accountInput.getValue().length>0){
	       		for(var i=0 in aAccounts) {
	       			var oAccount = aAccounts[i];
	       			if(oAccount.fullName.toUpperCase() == accountInput.getValue().toUpperCase()) {
	       				this._setAccount(oAccount.accountID, oAccount.fullName);
	       			}
	       			var oCustomData = new sap.ui.core.CustomData({key:"oAccount", value:oAccount});
	       		    if(oAccount.fullName!=""){
		       			var oItem = new sap.ui.core.Item({text:oAccount.fullName, customData:oCustomData});
		       			accountInput.addSuggestionItem(oItem);
		       			}
		       				//if fullname is empty, display account id
		       			
		       			else{
		       				var oItem1 = new sap.ui.core.Item({text:oAccount.accountID, customData:oCustomData});
		       				accountInput.addSuggestionItem(oItem1);
		       			}
	       			
	     
	       		}
	       		}
	       	};
	       	this._readAccount(accountInput.getValue(),fnCheckAccount);
	       },

			_setAccount: function(accountID,account) {
				var data = this.oViewModel.getData();
	      	var accountIDInput = this.getView().byId("accountIDInput");
	      if(accountIDInput){
	       		//accountIDInput.setValue(accountID);
	       		data.Account = accountID;
	      }
	       	var accountInput = this.getView().byId("ia");
	  	     if(account!=""){
		       	accountInput.setValue(account);
		       	 data.AccountTxt = account;
		       	}else{ 
		       	accountInput.setValue(accountID);
	            data.AccountTxt = accountID; 
		       	}
	      
 	
	       },
	       

	     _readAccount: function(searchString,callbackRead) {
	       	var that = this;
	       //	var delay = (searchString ? 100 : 0);
        	//clearTimeout(this.liveChangeTimer);
        	//if(delay) {
        	//this.liveChangeTimer = setTimeout(function () {
		this.oModel.read("/AccountCollection", null,'$top=10&$filter=substringof(%27'+encodeURIComponent(searchString)+'%27,fullName,accountID)', true,
		function(oData, oResponse) {
		var accountData = jQuery.parseJSON(JSON.stringify(oData));
							if(callbackRead)
								callbackRead.call(that,accountData.results);
						},
						function(oError) {
							
							jQuery.sap.log.error("Read failed in NewAppointment->_readAccount:"+oError.response.body);
						}
				);
        		//}, delay);
        	//}
	       },

	       onAccountSuggestItemSelected: function(oEvent) {
	       	var oItem = oEvent.getParameter("selectedItem");
	       
	       	var oAccount = null;
	       	for(var i in oItem.getCustomData()) {
	       		var oCustomData = oItem.getCustomData()[i];
	       		if (oCustomData.getKey() == "oAccount")
	       			oAccount = oCustomData.getValue();
	       		
	       	}
	       /*	if(oAccount.fullName == ""){
	       		this._setAccount(oAccount.accountID,"");
	       		
	       	}*/
	       	this._setAccount(oAccount.accountID, oAccount.fullName);
	       	
	       },
	       
	       	// ///////////////////////////////////////////////////////////////////////////////
	       	// typeahead for contact
	       	// /////////////////////////////////////////////////////////////////////////////// 
	      _setContact : function(contact){
	           var contactInput = this.getView().byId("ic");
	    if(contactInput)
	           contactInput.setValue(contact);
	  },
	    
	  onContactSuggestItemSelected: function(oEvent) {
	   var oItem = oEvent.getParameter("selectedItem");
	   var oContact = null;
	   for(var i in oItem.getCustomData()) {
	           var oCustomData = oItem.getCustomData()[i];
	           if (oCustomData.getKey() == "oContact")
	                  oContact = oCustomData.getValue();
	   }
	 
	   this.byId('ic').setValue(oContact.fullName);
	             //  this.ContactName = oContact.fullName;
	   var data = this.getViewEntity();
	               data.ContactTxt = oContact.fullName;
	   			// get contact ID selected
	   			data.Contact = oContact.contactID;
	   
	   },
	   
	   onContactInputFieldChanged: function(oEvent) {
	     this.byId('ic').setValueState(sap.ui.core.ValueState.None);
	     var contactInput = oEvent.getSource();
	    this._setContact(contactInput.getValue());
	   contactInput.setShowSuggestion(true);
	    //to refresh in same list on press of backspace
	  // contactInput.removeAllSuggestionItems();
	   contactInput.setFilterSuggests(false);
	   var fnCheckContact = function(aContacts) {
           contactInput.removeAllSuggestionItems();
		   if(contactInput.getValue().length>0){
	           for(var i=0 in aContacts) {
	                  var oContact = aContacts[i];
	                  if(oContact.fullName.toUpperCase() == contactInput.getValue().toUpperCase()) {
	                         this._setContact(oContact.fullName);
	                  }
	                  var oCustomData = new sap.ui.core.CustomData({key:"oContact", value:oContact});
	                  var oItem = new sap.ui.core.Item({text:oContact.fullName, customData:oCustomData});
	                  contactInput.addSuggestionItem(oItem);
	           }
		   }
	   };
	   this._readContact(contactInput.getValue(),fnCheckContact);
	   },
	   
	   _readContact: function(searchString,callbackRead) {
	     var that = this.oModel=this.getView().getModel();
	 	//var delay = (searchString ? 500 : 0);
    	//clearTimeout(this.liveChangeTimer);
    	//if(delay) {
    		//this.liveChangeTimer = setTimeout(function () {
	     this.oModel.read("/ContactCollection", null,'$top=10&$filter=substringof(%27'+encodeURIComponent(searchString)+'%27,fullName)', true,
	                                function(oData, oResponse) {
	                                       var contactData = jQuery.parseJSON(JSON.stringify(oData));
	                                       if(callbackRead)
	                                              callbackRead.call(that,contactData.results);
	                                },
	                                function(oError) {
	                                       jQuery.sap.log.error("Read failed in NewAppointment->_readContact:"+oError.response.body);
	                                }
	                  );
    		//}, delay);
    	//}
	           } ,
	           
	           
	       	// ///////////////////////////////////////////////////////////////////////////////
	       	// typeahead for employee
	       	// ///////////////////////////////////////////////////////////////////////////////      
	      
	           _setEmployee : function(employee){
	               var employeeInput = this.getView().byId("responsibleText");
	        if(employeeInput)
	               employeeInput.setValue(employee);
	      },
	        
	        
	      onEmployeeSuggestItemSelected: function(oEvent) {
	       var oItem = oEvent.getParameter("selectedItem");
	       var oEmployee = null;
	       for(var i in oItem.getCustomData()) {
	               var oCustomData = oItem.getCustomData()[i];
	               if (oCustomData.getKey() == "oEmployee")
	                      oEmployee = oCustomData.getValue();
	       }
	       this.byId('responsibleText').setValue(oEmployee.fullName);
	     //change private flaf field based on employee responsible
	       this._setPrivateFlag(oEmployee);
	                   var data = this.getViewEntity();
	                   data.ResponsibleTxt = oEmployee.fullName;
	       			// get contact ID selected
	       			data.Responsible = oEmployee.employeeID;
	       },
	       
	       _setPrivateFlag : function(oEmployee){	    		
		    	if(oEmployee.employeeID !== this.EmpResId )
		        {
		     	   this.byId("pf").setEnabled(false); 
		        }
		        else
		        { 	
		     	   this.byId("pf").setEnabled(true);   
		        }
		    },
		    
	       onEmployeeInputFieldChanged: function(oEvent) {
	         this.byId('responsibleText').setValueState(sap.ui.core.ValueState.None);
	         var employeeInput = oEvent.getSource();
	        this._setEmployee(employeeInput.getValue());
	       //this._adaptAddressFields(false, true);
	       employeeInput.setShowSuggestion(true);
	        //to refresh in same list on press of backspace
	     //  employeeInput.removeAllSuggestionItems();
	       employeeInput.setFilterSuggests(false);
	       var fnCheckEmployee = function(aEmployees) {
	    	   employeeInput.removeAllSuggestionItems();
	    	   if(employeeInput.getValue().length>0){
	               for(var i=0 in aEmployees) {
	                      var oEmployee = aEmployees[i];
	                      if(oEmployee.fullName.toUpperCase() == employeeInput.getValue().toUpperCase()) {
	                             this._setEmployee(oEmployee.fullName);
	                      }
	                      var oCustomData = new sap.ui.core.CustomData({key:"oEmployee", value:oEmployee});
	                      var oItem = new sap.ui.core.Item({text:oEmployee.fullName, customData:oCustomData});
	                      employeeInput.addSuggestionItem(oItem);
	               }
	    	   }
	       };
	       this._readEmployee(employeeInput.getValue(),fnCheckEmployee);
	       },
	       
	       _readEmployee: function(searchString,callbackRead) {
	         var that = this.oModel=this.getView().getModel();
	        // var delay = (searchString ? 500 : 0);
	        	//clearTimeout(this.liveChangeTimer);
	        	//if(delay) {
	        		//this.liveChangeTimer = setTimeout(function () {
	         this.oModel.read("/EmployeeCollection", null,'$top=10&$filter=substringof(%27'+encodeURIComponent(searchString)+'%27,fullName)', true,

	                                    function(oData, oResponse) {
	                                           var employeeData = jQuery.parseJSON(JSON.stringify(oData));
	                                           if(callbackRead)
	                                                  callbackRead.call(that,employeeData.results);
	                                    },
	                                    function(oError) {
	                                           jQuery.sap.log.error("Read failed in NewAppointment->_readEmployee:"+oError.response.body);
	                                    }
	                      );
	        	//	}, delay);
	        	//}
	               } ,
	               
       

	// ///////////////////////////////////////////////////////////////////////////////
	// contact f4
	// ///////////////////////////////////////////////////////////////////////////////
	initContactF4 : function(oInput) {

		if (!this.contactF4Frag) {
			this.initConSearchFragment();
		}

		var oLeftButton = new sap.m.Button();

		// with id
		this.oConF4 = new sap.m.Dialog(this.sViewId + "cd", {
			stretch : jQuery.device.is.phone,
			title: this.oBundle.getText("view.Appointment.consea_title", [ "0" ]), //initial
			content : [this.contactF4Frag[1]],
			leftButton : oLeftButton,
			contentWidth : "480px",
			contentHeight : "2000px",
			subHeader : new sap.m.Bar({
				contentMiddle : [this.contactF4Frag[0]]
			})
		});
		// taken from sap.m.Dialog
		// internally set top and bottom margin of the dialog to 4rem respectively
		this.oConF4.addStyleClass("sapMSelectDialog");
		this.oConF4._iVMargin = 8 * parseInt(sap.ui.core.theming.Parameters.get("sapUiFontSize") || 16, 10);
		this.oConF4.setModel(this.getView().getModel("i18n"), "i18n");
		this.oConF4.setModel(cus.crm.mycalendar.util.Util.getSearchModel(this.oModel, this.isMock), "sm");
		oLeftButton.bindProperty("text", "i18n>view.Appointment.cancel");
		var that = this;
		oLeftButton.attachPress(function(oEvent) {

			that.oConF4.close();
			that.bConF4clicked = false;
			
			// clear the input fields, this is the wanted behaviour now.
			//up-port contact field should not be cleared
			/*that.byId("ic").setValue("");
			var oEntity = that.getViewEntity();
			oEntity.Contact = "";
			oEntity.ContactTxt = "";*/

		});
	},

	onF4Contact : function(oEvent) {

		var oInput = oEvent.getSource();
		if (!this.oConF4) {
			this.initContactF4(oInput);
		}
		var sValue = oInput.getValue();
		var data = this.getViewEntity();
  
		this.bConF4clicked = true;
		this.contactF4Frag.triggerSearch({
			accountid : data.Account,
			accounttext : data.AccountTxt,
			searchvalue : sValue
		});
		this.oConF4.open();
	},

	// trigger f4 help on input if input available
	onContactChanged : function(oEvent) {
		if (oEvent.getSource().getValue()) {
		   this.onF4Contact(oEvent);
		}
	},

	// ///////////////////////////////////////////////////////////

	// adds a new attendee to the helper edit model
	addNewAttendee : function(id, internal, fullname, accountid, sfunctiontxt) {

		var data = this.getViewEntity(), guid = data.Guid, sEnd = "";

		if (!guid) {
			// dummy empty guid in case of create
			guid = "00000000-0000-0000-0000-000000000001";
		}

		if (data.Attendee === undefined) {
			data.Attendee = [];
		}

		this.iCounter += 1;
		sEnd = '000000000000' + this.iCounter;
		sEnd = sEnd.slice(-12); // last 12 places

		// build a attendee object and add it to the collection
		var oAttendee = {
			// dummy empty guid in case of create
			Guid : guid,
			// some dummy generated non existent guid for the partner guid
			PartnerGuid : "00000000-0000-0000-0000-" + sEnd,
			PartnerNo : id,
			IntAttendee : internal,
			Function : sfunctiontxt,
			AccountNo : accountid,
			FullName : fullname
		};

		var oData = this.oEditAttendeeModel.getData();
		oData.Attendee.splice(0, 0, oAttendee);
		this.oEditAttendeeModel.setData(oData);
		
		// adapt title of popup
		this.adaptAttendeePopupTitle();		
	},

	// ///////////////////////////////////////////////////////////////////////////////
	// Edit Attendees parts
	// ///////////////////////////////////////////////////////////////////////////////
	initAttEditFragment : function() {
		this.oAttFrag = sap.ui.xmlfragment(this.sViewId + "attFrag", "cus.crm.mycalendar.view.AttendeeEdit", this);
		this.oAttFrag.setStretch(jQuery.device.is.phone);
		this.oAttFrag.addStyleClass("sapMSelectDialog");
		this.oAttFrag._iVMargin = 8 * parseInt(sap.ui.core.theming.Parameters.get("sapUiFontSize") || 16, 10);

		// a temporary model for the Attendees to be able to revert the changes
		this.oEditAttendeeModel = new sap.ui.model.json.JSONModel({});
		this.oAttFrag.setModel(this.oEditAttendeeModel, "em");
		this.oAttFrag.setModel(this.getView().getModel("i18n"), "i18n");
		this.oAttFrag.setModel(cus.crm.mycalendar.util.Util.getSearchModel(this.oModel, this.isMock), "sm");
	},

	initConSearchFragment : function() {
		this.contactF4Frag = cus.crm.mycalendar.util.Util.createContactSearchFragment(this.sViewId + "contF4", this);
	},

	// does the settings for the edit attendees popup and also opens it
	openEditAttendeeInput : function(searchfragment, bInternal) {

		// init edit helper model
		this.oEditAttendeeModel.setData({});
		var oHelperData = {
			Attendee : []
		};
		// a clone of the attendee
		var data = this.getViewEntity();
		if (data.Attendee) {
			jQuery.each(data.Attendee, function(key, value) {
				var oValueClone = jQuery.extend({}, value);
				oHelperData.Attendee.push(oValueClone);
			});
		}
		this.oEditAttendeeModel.setData(oHelperData);

		var p2 = sap.ui.core.Fragment.byId(this.sViewId + "attFrag", "p2");
		p2.removeAllContent();
		// add the elements of the fragment to the page content, search field to subheader so it does not scroll
		p2.setSubHeader(new sap.m.Bar({
			contentMiddle : [searchfragment[0]]
		}));
		p2.addContent(searchfragment[1]);

		var oList = this.oAttFrag.getContent()[0].getPages()[0].getContent()[0];

		var listbinding = oList.getBinding("items");
		var aFilter = [];
		var oFilter = new sap.ui.model.Filter("IntAttendee", sap.ui.model.FilterOperator.EQ, bInternal);
		aFilter.push(oFilter);
		listbinding.filter(aFilter);
		
		// to have later simple access in which mode the list is in the popup
		oList.data("internal", bInternal);
		// popup title with count
		this.adaptAttendeePopupTitle();
		
		// initial title for search page, to be improved
		var sKey;
		if(bInternal){ 
			sKey = "view.Appointment.internal_titlenew";
			}
		else{
			sKey = "view.Appointment.external_titlenew";
		}
		
		sap.ui.core.Fragment.byId(this.sViewId + "attFrag", "p2").setTitle(this.oBundle.getText(sKey));

		var sText;
		if(bInternal){
			sText = this.oBundle.getText("view.Appointment.nointattendees");
			}
		else{
			sText = this.oBundle.getText("view.Appointment.noextattendees");
		}
				
		oList.setNoDataText(sText);

		this.oAttFrag.open();

		// directly navigate to the search list (p2) in case no employees yet
		if (listbinding.getLength() === 0) {
			this.onAddClicked();
		}

	},

	// this is a workaround for contacts where fullname is not filled
	formatContactName : function(fullname, id) {
		return fullname || ("Name not available " + id);
	},

	// workaround as fullname wasnt available in ES searches
	formatEmployeeName : function(firstname, lastname) {
		return this.oBundle.getText("view.Appointment.employeename", [firstname, lastname]);
	},

	onEditExternalAttendees : function(oEvent) {

		// to be sure, not nice
		this.bExternalSearch = true;
		this.bConF4clicked = false;

		if (!this.extAttF4Frag) {
			this.extAttF4Frag = cus.crm.mycalendar.util.Util.createContactSearchFragment(this.sViewId + "extAttF4", this);
		}

		if (!this.oAttFrag) {
			this.initAttEditFragment();
		}

		this.openEditAttendeeInput(this.extAttF4Frag, false);

	},

	// for the Account filter toolbar -> when clicked -> disappears and back to contact search
	onContactFilterHide : function(oEvent) {
		oEvent.getSource().setVisible(false);
		// back to ContactCollection
		var aFilter = [];
		var sPath = "sm>/ContactCollection";

		// get fragment info from id...
		var sId = oEvent.getSource().getId();
		var sFragId = sId.split("--")[0];
		var oLIT = sap.ui.core.Fragment.byId(sFragId, "lsci");
		var oSF = sap.ui.core.Fragment.byId(sFragId, "sfc");
		
		// take into consideration the value that might be present in the search field
		if (oSF.getValue()){
			aFilter.push(new sap.ui.model.Filter("lastName", sap.ui.model.FilterOperator.Contains, oSF.getValue()));
		}

		oEvent.getSource().getParent().bindAggregation("items", {
			path : sPath,
			template : oLIT,
			filters : aFilter
		});
	},

	onSelectContact : function(oEvent) {

		jQuery.sap.log.info("External Attendee / contact selected");
		var oSelCont = oEvent.getParameter("listItem").getBindingContext("sm").getObject();

		if (this.bConF4clicked) {
			// from the contact F4
			var oInput = this.byId("ic");
			if(oSelCont.fullName){ 
				oInput.setValue(oSelCont.fullName);
				}
			else{ 
				oInput.setValue(oSelCont.contactID);
				}
			var data = this.getViewEntity();
			// get contact ID selected
			data.Contact = oSelCont.contactID;
			// get account ID assigned to the contact
			data.ContactAccount = oSelCont.accountID;
			this.oConF4.close();
			this.bConF4clicked = false;
		} else {
			// in the external attendees popup..
			// workaround for stupid attribute function
			this.addNewAttendee(oSelCont.contactID, false, oSelCont.fullName, oSelCont.accountID, oSelCont["function"]);
			var oNavCont = this.oAttFrag.getContent()[0];
			oNavCont.backToPage(this.sViewId + "attFrag--p1");
		}

	},

	onEditEmployees : function(oEvent) {
		this.bExternalSearch = false;
		if (!this.employeeF4Frag) {

			this.employeeF4Frag = sap.ui.xmlfragment(this.sViewId + "emplSearch", "cus.crm.mycalendar.view.EmployeeSearch",
					this);

			var mySearchList = sap.ui.core.Fragment.byId(this.sViewId + "emplSearch", "lse");
			// get function object for employee search
			this.onEmployeeSearch = cus.crm.mycalendar.util.Util.getSearch("lastName", mySearchList);
			this.onEmployeeLiveChange = cus.crm.mycalendar.util.Util.getLiveSearch("lastName", mySearchList);
			var that = this;
			this.employeeF4Frag.triggerSearch = function() {
				var oSF = sap.ui.core.Fragment.byId(that.sViewId + "emplSearch", "sfe");
				var oLIT = sap.ui.core.Fragment.byId(that.sViewId + "emplSearch", "lsei");
				oSF.setValue("");
			// remove template, because data binding will clone this template / avoid empty oData call
				mySearchList.removeItem(oLIT);
				mySearchList.bindAggregation("items", {
					path : "sm>/EmployeeCollection",
					parameters : {
						expand : 'WorkAddress,Company'						
					},
					template : oLIT
				});
				
			};
		}

		if (!this.oAttFrag) {
			this.initAttEditFragment();
		}

		this.openEditAttendeeInput(this.employeeF4Frag, true);

	},

	onNavBack : function(oEvent) {
		// navigate to search page
		var oNavCont = this.oAttFrag.getContent()[0];
		oNavCont.backToPage(this.sViewId + "attFrag--p1");
	},

	onOKDialog : function(oEvent) {
		this.oAttFrag.close();

		// take over the edit Attendee model to the view entity.
		var oEditData = this.oEditAttendeeModel.getData();
		var data = this.getViewEntity();
		data.Attendee = oEditData.Attendee;

		// take over the ones to delete
		if(data.delAttendee){
			data.delAttendee = data.delAttendee.concat(data.delAttendeeTemp);
		}
		else{
			data.delAttendee = data.delAttendeeTemp;
		}
		delete data.delAttendeeTemp;

		// adapt attendee strings.
		var oDisplayAttendee = this.getAttendeeStrings(data.Attendee);
		this.byId("atin").setText(oDisplayAttendee.internal);
		this.byId("atex").setText(oDisplayAttendee.external);
	},

	onCancelDialog : function(oEvent) {
		this.oAttFrag.close();
		var data = this.getViewEntity();
		delete data.delAttendeeTemp;
	},

	onDeleteAttendee : function(oEvent) {

		var oItem = oEvent.getParameter("listItem");
		var oList = oItem.getParent();
		var oSelAttendee = oItem.getBindingContext("em").getObject();
        
		if (oSelAttendee.PartnerGuid.substring(0, 23) !== "00000000-0000-0000-0000") {
			// an already saved one, keep it for deletion
			var oDelAttendee = {
				Guid : oSelAttendee.Guid,
				PartnerGuid : oSelAttendee.PartnerGuid,
				PartnerNo : "",
				PartnerPft : "",
				PartnerFct : ""
			};
			var data = this.getViewEntity();
			if (!data.delAttendeeTemp) {
				data.delAttendeeTemp = [];
			}
			data.delAttendeeTemp.push(oDelAttendee);
		}

		var data = this.oEditAttendeeModel.getData();
		for ( var i = 0; i < data.Attendee.length; i++) {
			if (data.Attendee[i].PartnerGuid === oSelAttendee.PartnerGuid) {
				data.Attendee.splice(i, 1);
				break;
			}
		}
/*	Commented for INternal incident:1472000838 
 * 	oList.setMode(sap.m.ListMode.None);
		
		
		oList.attachEventOnce("updateFinished",null,function(){
			oList.setMode(sap.m.ListMode.Delete);
		},oList);*/
		
		this.oEditAttendeeModel.refresh();
		
		
		
		
		// adapt title of popup
		this.adaptAttendeePopupTitle();

	},

	adaptAttendeePopupTitle: function(){
		
		var oList = this.oAttFrag.getContent()[0].getPages()[0].getContent()[0];
		var bInternal = oList.data("internal");
		var sKey;
		if(bInternal){ 
			sKey = "view.Appointment.internal_title";
			}
		else{
			sKey = "view.Appointment.external_title";
		}
		
		var listbinding = oList.getBinding("items");
		var sAttLength = listbinding.getLength();
		var sTitle = this.oBundle.getText(sKey, [sAttLength]);
		
		sap.ui.core.Fragment.byId(this.sViewId + "attFrag", "tit").setText(sTitle);
		
	},
	
	onSelectEmployee : function(oEvent) {

		var oLI = oEvent.getParameter("listItem"), fulln = oLI.getTitle();
		// read the custom data from the list item
		var sAccountID = oLI.data("compid"), sFunction = oLI.data("func"), sEmployeeID = oLI.data("empid");
		this.addNewAttendee(sEmployeeID, true, fulln, sAccountID, sFunction);
		this.oAttFrag.getContent()[0].backToPage(this.sViewId + "attFrag--p1");

	},

	onCancelSearch : function(oEvent) {
		// TODO when no attendees maybe directly go back
		//this.onNavBack(oEvent);
	    //WHEN USER CLICKS ON CANCEL,THE ACTION CLOSES THE POPUP.
		this.oAttFrag.close();
		var data = this.getViewEntity();
		delete data.delAttendeeTemp;
	},
	
	onPrivateChanged : function(oEvent)
    {            
          var oData = this.getView().getModel("vm").oData;
          if(this.newAppointment){   //Fix for message:1482000731
                 this.byId("responsibleText").setValue(this.ResponsibleTxt);
          }
          if(oData.Responsible !== "" && oData.Responsible !== null && oData.Responsible !== undefined &&
                        oData.Responsible == this.EmpResId  && this.byId("pf").getState())
          {      //disable Employee field
                 this.byId("responsibleText").setEnabled(false);
          }
          else 
          {      //enable Employee field
                 this.byId("responsibleText").setEnabled(true);
          }
    },

	onAddClicked : function(oEvent) {
		// navigate to search page

		// initialize search:
		if (this.bExternalSearch) {
			// check if account id available:
			var data = this.getViewEntity();
			this.extAttF4Frag.triggerSearch({
				accountid : data.Account,
				accounttext : data.AccountTxt
			});
		} else {
			// trigger internal initial search
			this.employeeF4Frag.triggerSearch();
		}

		var oNavCont = this.oAttFrag.getContent()[0];
		oNavCont.to(this.sViewId + "attFrag--p2");
	},

	onEmployeeSearch : function(oEvent) {
		this.onEmployeeSearch(oEvent);
	},

	onEmployeeLiveChange : function(oEvent) {
		this.onEmployeeLiveChange(oEvent);
	},

	onContactSearch : function(oEvent) {
		// get fragment info from oEvent? not so nice

		if (this.bConF4clicked) {
			this.contactF4Frag.onContactSearch(oEvent);
		} else {
			this.extAttF4Frag.onContactSearch(oEvent);
		}
	},

	onContactLiveChange : function(oEvent) {
		// get fragment info
		if (this.bConF4clicked) {
			this.contactF4Frag.onContactLiveChange(oEvent);
		} else {
			this.extAttF4Frag.onContactLiveChange(oEvent);
		}
	},
	
	onContactListUpdateStart: function(oEvent){
		var sTitle = "";
		oEvent.getSource().setNoDataText(this.oBundle.getText("view.Appointment.searchlistinfo"));
	// experimental - set count in title
		if (this.bConF4clicked) {
		  sTitle = this.oBundle.getText("view.Appointment.consea_title", ["0"]);
		  this.oConF4.setTitle(sTitle);
		} else {
			sTitle = this.oBundle.getText("view.Appointment.external_titlenew", ["0"]);
			sap.ui.core.Fragment.byId(this.sViewId + "attFrag", "p2").setTitle(sTitle);
		}
	},
	
	onContactListUpdateFinished: function(oEvent){
		var sTitle = "";
		oEvent.getSource().setNoDataText(this.oBundle.getText("view.Appointment.consea_nodata"));
		// experimental - set count in title
		if (this.bConF4clicked) {
		  sTitle = this.oBundle.getText("view.Appointment.consea_title", [oEvent.getParameter("total")]);
		  this.oConF4.setTitle(sTitle);
		} else {
			sTitle = this.oBundle.getText("view.Appointment.external_titlenew", [oEvent.getParameter("total")]);
			sap.ui.core.Fragment.byId(this.sViewId + "attFrag", "p2").setTitle(sTitle);
		}
	},
	
	onEmployeeListUpdateStart: function(oEvent){
		oEvent.getSource().setNoDataText(this.oBundle.getText("view.Appointment.searchlistinfo"));
		var sTitle = this.oBundle.getText("view.Appointment.internal_titlenew", ["0"]);
		sap.ui.core.Fragment.byId(this.sViewId + "attFrag", "p2").setTitle(sTitle);
	},
	
	onEmployeeListUpdateFinished: function(oEvent){
		oEvent.getSource().setNoDataText(this.oBundle.getText("view.Appointment.nointattendees"));
		var sTitle = this.oBundle.getText("view.Appointment.internal_titlenew", [oEvent.getParameter("total")]);
		sap.ui.core.Fragment.byId(this.sViewId + "attFrag", "p2").setTitle(sTitle);
	},
	
	// //////////////////////////END EDIT Attendees ////////////////////////////////

	getParentApptId : function(){
		
		var str = this.getView().getBindingContext().getPath();
		str = str.slice(21);
		str = str.slice(0,-2);
		return str;
	},
	
	onBackNavigate: function(){
		var sGUID = this.getAppointment().Guid;
		if(this.followup)
			{
			sGUID = this.getParentApptId();
			}
		
		// unbind model from views
		this.getView().unbindElement();
		var oAttView2 = this.byId("attachmentsView_chg1");
		oAttView2.unbindElement();

		// navigate
		var h =  new sap.ui.core.routing.History.getInstance();
		if (this.bUpdate) {
			  // update mode: check if appointment detail is last view in history
				var sDetailURL = this.oRouter.getURL("appointment", {AppointmentID: sGUID});
				if (h.getDirection(sDetailURL) === sap.ui.core.routing.HistoryDirection.Backwards) {
					// appointment detail was last view in history
					window.history.go(-1);
				} else if (h.getDirection("") == sap.ui.core.routing.HistoryDirection.Unknown) {
					// cross app navigation use case
					window.history.go(-1);
				} else {
					// deep linking use case
					this.oRouter.navTo("appointment", {AppointmentID: sGUID}, true); // overwrite url	
				}
		}
		else if (this.followup)
		{
			this.oRouter.navTo("appointment", {AppointmentID: sGUID}, true);
		}
		else {
			// create mode: check if history exists then nav back else nav to calendar
			var dir = h.getDirection(""); 
			if (dir && dir == sap.ui.core.routing.HistoryDirection.Unknown) {
				if ( this.createdfromNotes ) 
				 { window.history.go(-2);
				   this.createdfromNotes = false;
				 }
				else if ( this.createFromOppt ) 
			 		{ window.history.go(-2);
			 		  this.createFromOppt = false;
			 		}
				else if ( this.createFromTasks ) 
					 { window.history.back();
					   this.createFromTasks = false;
					 }
				else if ( this.createFromAccount ) 
					 { window.history.go(-1);
					   this.createFromAccount = false;
					 }
				else
				{ 
					//window.history.go(-1); 
					 var oDateFrom = this.getAppointment().FromDate;
					var sDate = this.getDateParameterfromDate(oDateFrom);
						this.oRouter.navTo("week", {Date: sDate}, true);
					
					}
			} else {
				if ( this.createdfromNotes ) 
				 { window.history.go(-2);
				   this.createdfromNotes = false;
				 }
				else if ( this.createFromOppt ) 
			 							 { window.history.go(-2);
			 							   this.createFromOppt = false;
			 							 }
				else if(this.createFromTasks)
				{
					window.history.back();
					//console.log("navigating to opportunity"+this.createFromOppt);
					this.createFromTasks = false;
				 }
				else if ( this.createFromAccount ) 
				{ 
					window.history.go(-1);
					this.createFromAccount = false;
				}
				else
				this.navigateToCalendar();
			}
		}		
	},
	
	onBack : function(oEvent) {
		var that = this;
		var sViewMode = this._getViewMode();
		if (this.checkEntityChanged() || sViewMode === "CREATE"){
			//	sap.ca.ui.dialog.confirmation.open didnt match exactly our mockup
			sap.m.MessageBox.show(
					this.oBundle.getText("view.Appointment.leaveeditmessage"),
		      sap.m.MessageBox.Icon.WARNING,
		      sap.ca.ui.utils.resourcebundle.getText("messagetype.warning"), //ähem..
		      [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
		      function(oAction) { 
						if (oAction === sap.m.MessageBox.Action.OK){
							that.onBackNavigate();
						}
					}
			 );
		} else {
		   this.onBackNavigate();
		}
	},

	// a simple method to compare if changes have been done to the object in the view.
	checkEntityChanged: function() {
		var bChanged = false;
		
		if (this.oStartEntityString){
			
			 var oStartEntity = JSON.parse(this.oStartEntityString);
			 var oViewEntity = this.getViewEntity();
			 var key;
			
			 //do a sanity check on the start entity to be compared 
//			 for(key in oStartEntity){
//				 if(!oViewEntity.hasOwnProperty(key)){
//					 delete oStartEntity[key];
//				 }
//			 }
			 
			 this._deepSanitize(oStartEntity,oViewEntity);
			
			if(JSON.stringify(oStartEntity) === JSON.stringify(oViewEntity) ){
				bChanged = false;
			} else {
				bChanged = true;
			}
		}		
		return bChanged;
	},
	
	onCancel : function(oEvent) {
		this.onBack();
		this.followupappointment=false;
		this.followupappointmentfromtask=false;
		this.newappointmentfromoppt=false;
		this.newappointmentfromaccount=false;
		this.newAppointment=false;
	},

	// ///////////////////////////////////////////////////////////////////////////////
	// save Appointment part:
	// ///////////////////////////////////////////////////////////////////////////////

	onSave : function(oEvent) {
	// publish entity after validation
		if (this.validateNewAppointment()) {
			var oEntity = this.getAppointment();
			this.saveAppointment(oEntity);
			this.byId("responsibleText").setEnabled(true);
		}
	},
	
//Enable the Savebutton only when all mandatory fields are filled	
	enableSaveBtn:function () {		
		var oEntity = this.getAppointment();
		if (oEntity){
			if (oEntity.Description !== "" 
					&& oEntity.FromDate !== null
					&& oEntity.ToDate !== null) {
				this.byId("bs").setEnabled(true);
			} else {
				this.byId("bs").setEnabled(false);
			}
		}
		 /**
		 * @ControllerHook extHookEnableSaveBtn provides the flexibility to decide if the save button has to be enabled for the fields added by the customer to the new appointments page.
		 *                 
		 *                 
		 * @callback sap.ca.scfld.md.controller.BaseFullScreenController~extHookEnableSaveBtn
		 * @return {void}
		 */
	  if (this.extHookEnableSaveBtn){
			this.extHookEnableSaveBtn();
		}	
	},


	// validation method, implement in a suitable way
	validateNewAppointment : function() {

		var bOk = true, oEntity = this.getAppointment();
		var startTimezoneOffset;
		var endTimezoneOffset;
		var startTimezoneOffsetMs;
		var endTimezoneOffsetMs;
		
		

		// remove leading / trailing spaces from entity description aka title
		oEntity.Description = jQuery.trim(oEntity.Description);
		// and from location
		oEntity.Location = jQuery.trim(oEntity.Location);

		// check validity of dates
		if (!this.isStartEndDateCorrect()) {
			bOk = false;
		}
		
		if (oEntity.AllDay) {
// All Day processing in oData Requires the original date according to the user time zone is supplied
// Offset is returned in mins
//			oEntity.FromDate.setHours(0, 0, 0, 0);
//			oEntity.ToDate.setHours(23, 59, 59, 0);

			startTimezoneOffset = oEntity.FromDate.getTimezoneOffset();
			endTimezoneOffset = oEntity.ToDate.getTimezoneOffset();	
			
			startTimezoneOffsetMs = startTimezoneOffset * 60 * 1000;
			endTimezoneOffsetMs = endTimezoneOffset * 60 * 1000;			
			
			oEntity.FromDate.setTime( oEntity.FromDate.getTime() - startTimezoneOffsetMs );
			oEntity.ToDate.setTime( oEntity.ToDate.getTime() - endTimezoneOffsetMs );

		}
		
		if (!oEntity.Description) {
			sap.ca.ui.message.showMessageBox({
				type : sap.ca.ui.message.Type.WARNING,
				message : this.oBundle.getText("view.Appointment.notitle")
			});
			bOk = false;
		}
		 /**
		 * @ControllerHook extHookValidateAdditionalFields provides for client side validations of the fields added by the customer to the new appointments page.
		 * @callback sap.ca.scfld.md.controller.BaseFullScreenController~extHookValidateAdditionalFields
		 * @return {void}
		 */
	  if (this.extHookValidateAdditionalFields){
			bOk = this.extHookValidateAdditionalFields();
		}
		return bOk;
	},

	// returns a the appointment entity for later save call
	getAppointment : function() {
		var oEntity = this.getViewEntity();
		oEntity = this.prepareEntity(oEntity);
		return oEntity;
	},

	prepareEntity : function(oEntity) {

		// make entity small

		// maybe not necessary, just in case
		if (oEntity.Attendee) {
			for ( var i = 0; i < oEntity.Attendee.length; i++) {
				delete oEntity.Attendee[i].__metadata;
			}
		}

		

		// logic for deletion, tbc
		if (oEntity.Contact && !oEntity.ContactTxt) {
			oEntity.Contact = "";
		}

		// simplify oEntity ---
		delete oEntity.AppointmentToAttachment;

		// not needed info
		delete oEntity.PriorityTxt;
		delete oEntity.StatusTxt;

		// delete oEntity.Attendee;
		delete oEntity.__metadata;
		delete oEntity.AccountRel;
		delete oEntity.ContactRel;
		delete oEntity.EmployeeRel;

		 /**
		 * @ControllerHook extHookPrepareEntity provides for additional properties that can be added to or removed from the Appointment entity json.
		 *                 
		 * @callback sap.ca.scfld.md.controller.BaseFullScreenController~extHookPrepareEntity
		 * @param {object}
		 *           oEntity
		 * @return {void}
		 */
	  if (this.extHookPrepareEntity){
			oEntity = this.extHookPrepareEntity(oEntity);
		}
		return oEntity;
	},

	// listener to the create/update from the NewAppointmentView
	saveAppointment : function(oEntity) {

		// array for batch operations
		var aBatch = [], that = this;

		this.oBusyDialog.open();
		
		if (this.isMock) {
			// back navigation
			this.successSave({}, null);
			return;
	  } 

		if (oEntity.Guid) {
				// update case -> we need to update /AppointmentSet and /AttendeeSet if necessary

        // for backend, send "first" the deletions
				if (oEntity.delAttendee) {
					this.oDelAttendeeBackup = oEntity.delAttendee;
					
					jQuery.each(oEntity.delAttendee, function(indx, val) {
						// val -> AttendeeSet / currently take only new ones but with put.
						aBatch.push(that.oModel.createBatchOperation("/AttendeeSet(Guid=guid'" + val.Guid + "',PartnerGuid=guid'"
								+ val.PartnerGuid + "')", "PUT", val));
					});

			  }

				delete oEntity.delAttendee;
				delete oEntity.delAttendeeTemp; // just in case
				
				
				// for backend, and "then" the  creates
				var aAttendeesToUpdate = oEntity.Attendee;
				// to keep state for save error case
				this.oAttendeesToUpdateBackup = oEntity.Attendee;

				if (aAttendeesToUpdate) {

					that = this;
					jQuery.each(aAttendeesToUpdate, function(indx, val) {
						// val -> AttendeeSet / currently take only new ones but with put.
						
					
						if (val.PartnerGuid.substring(0, 23) === "00000000-0000-0000-0000") {
							aBatch.push(that.oModel.createBatchOperation("/AttendeeSet(Guid=guid'" + val.Guid + "',PartnerGuid=guid'"
									+ val.PartnerGuid + "')", "PUT", val));
						}
					});
				}
				delete oEntity.Attendee;
				
                  
				var oETag = null;
				
				if(parseFloat(this.sBackendVersion) >= 4.0){
				         oETag = { sETag : cus.crm.mycalendar.util.Util._getETag()};	
				}
				aBatch.push(this.oModel.createBatchOperation("/AppointmentSet(guid'" + oEntity.Guid + "')", "PUT", oEntity,oETag));
			
				/**
				 * @ControllerHook extHookSaveAppointmentOnEdit provides the flexibility to add additonal update requests to the custom fields added as a part of the $batch request. This is provided while editing an existing appointment.
				 * @callback sap.ca.scfld.md.controller.BaseFullScreenController~extHookSaveAppointmentOnEdit
				 * @param {object} oEntity
				 * @param {object} aBatch  
				 * @return {void}
				 */
			  if (this.extHookSaveAppointmentOnEdit){
					 this.extHookSaveAppointmentOnEdit(oEntity,aBatch);
				}
			  
				this.oModel.addBatchChangeOperations(aBatch);
				this.oModel.submitBatch(jQuery.proxy(this.successSave, this), jQuery.proxy(this.errorSave, this));

			} else {
				// create case
				delete oEntity.Id;
				  delete oEntity.delAttendee; // just in case
				  delete oEntity.delAttendeeTemp; // just in case
				  aBatch.push(this.oModel.createBatchOperation("/AppointmentSet", "POST", oEntity));
				
				  /**
					 * @ControllerHook extHookSaveAppointmentOnCreate provides the flexibility to add additonal update requests to the custom fields added as a part of the $batch request. This is provided while creating an existing appointment.
					 * @callback sap.ca.scfld.md.controller.BaseFullScreenController~extHookSaveAppointmentOnCreate
					 * @param {object} oEntity
					 * @param {object} aBatch  
					 * @return {void}
					 */
				  if (this.extHookSaveAppointmentOnCreate){
						 this.extHookSaveAppointmentOnCreate(oEntity,aBatch);
					}
				  
				  this.oModel.addBatchChangeOperations(aBatch);
				  this.oModel.submitBatch(jQuery.proxy(this.successSave, this), jQuery.proxy(this.errorSave, this));
				
			}

	},

	// success message
	successSave : function(oData, response) {
		// message toast
		var that = this, bError = false, batchResp, sMessage;
		var followUpGuid;
		var b412Error = false;
		var sViewMode = this._getViewMode();
		if(sViewMode === "CREATE"){
        followUpGuid = response.data.__batchResponses[0].__changeResponses[0].data.Guid;
		}
		else{
			followUpGuid=this.getParentApptId();
		}
		this.oBusyDialog.close();

		if (oData.hasOwnProperty("__batchResponses")) {
			// result from a batch call
			jQuery.sap.log.info("start read batch responses");

			for ( var i = 0; i < oData.__batchResponses.length; i++) {
				batchResp = oData.__batchResponses[i];
				if (batchResp.hasOwnProperty("response") && batchResp.response.statusCode >= '400') {
					
					
					if(batchResp.response.statusCode === '412'){
						b412Error = true;
						break;
					}
					// resp with error -> message
					jQuery.sap.log.error("response error from batch call");
					that.errorSave(batchResp);
					bError = true;
				}
			}
		}

	    if(b412Error){
	    	
	    	
	    	sap.ca.ui.message.showMessageBox({
				type : sap.ca.ui.message.Type.ERROR,
				message : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('MSG_CONFLICTING_DATA')
			},jQuery.proxy(function(){
				this._refreshAppointment();
			},this));
	    	
	    	return;
	    }
		if (!bError) {
			jQuery.sap.log.info("all responses ok");
			if (this.isMock){
			  sap.ca.ui.message.showMessageToast("Not yet suppported in mock mode");
			} else {
			  
				if(this.followupappointment || this.followupappointmentfromtask || this.newappointmentfromoppt
						|| this.newappointmentfromaccount)
				{
					
					if(this.newappointmentfromaccount){			
						// Notify listeners for the event that appointment has been created.
						sap.ui.getCore().getEventBus().publish("cus.crm.mycalendar", "appointmentCreated");
						
						var message = this.oBundle.getText(
						"view.Appointment.savesuccess");
						sap.m.MessageToast.show(message, {
						closeOnBrowserNavigation : false
						});
					} else {
						// Notify listeners for the event that appointment has been created as follow up.
						sap.ui.getCore().getEventBus().publish("cus.crm.mycalendar", "followUpAppointmentCreated");
	
						var message = this.oBundle.getText(
						"view.Appointment.followupsuccessful");
						sap.m.MessageToast.show(message, {
						closeOnBrowserNavigation : false
						});
					};
				}
			else{
				// Notify listeners for the event that appointment has been edited.
				if(this.Context) {
					sap.ui.getCore().getEventBus().publish("cus.crm.mycalendar", "appointmentChanged", {
						contextPath : this.Context
					});
				}

				sMessage = this.oBundle.getText("view.Appointment.savesuccess");
				sap.ca.ui.message.showMessageToast(sMessage);}
		
			}
			// clear references
			if(this.followup || this.createFromOppt ||this.createFromTasks ||this.createdfromNotes ||this.newAppointment)
				{
				var sGUID = followUpGuid;
				}
			this.getView().unbindElement();
			var oAttView2 = this.byId("attachmentsView_chg1");
			oAttView2.unbindElement();
			// navigate back to week calendar after save
			
			if (this.createdfromNotes) {
				/*window.history.go(-2);*/
				this.oRouter.navTo("appointment", {AppointmentID: sGUID}, true);
				
				this.createdfromNotes = false;
			} 
			else if(this.followup)
			{
			this.oRouter.navTo("appointment", {AppointmentID: sGUID}, true);
			
			}
			else if(this.createFromOppt)
		 						{
									/*window.history.go(-2);*/
									this.oRouter.navTo("appointment", {AppointmentID: sGUID}, true);
		 							//console.log("navigating to opportunity"+this.createFromOppt);
		 							this.createFromOppt = false;
		 						}
			else if(this.createFromTasks)
				{
					/*window.history.go(-2);*/
					this.oRouter.navTo("appointment", {AppointmentID: sGUID}, true);
					//console.log("navigating to opportunity"+this.createFromOppt);
					this.createFromTasks = false;
				}
			else if(this.newAppointment)
			{
				/*window.history.go(-2);*/
				this.oRouter.navTo("appointment", {AppointmentID: sGUID}, true);
				//console.log("navigating to opportunity"+this.createFromOppt);
				this.newAppointment = false;
			}
			else if(this.createFromAccount)
			{
				window.history.back();
				this.createFromAccount = false;
			}
				
			else {
			this.navigateToCalendar();
			}
		}

		this.followupappointment=false;
		this.followupappointmentfromtask=false;
		this.newappointmentfromoppt=false;
		this.newappointmentfromaccount=false;
		this.newAppointment=false;
		
		
	},
	
	navigateToCalendar: function() {
		var oDateFrom = this.getViewEntity().FromDate;
		if (!oDateFrom) {
			oDateFrom = new Date();
		}
		var sDate = this.getDateParameterfromDate(oDateFrom);
		//this.oRouter.navTo("week", {Date: sDate}, true);  // overwrite url	
		if(this.bUpdate)
			window.history.go(-1);
		else if (this.followup)
			{this.oRouter.navTo("week", {Date: sDate}, true);}//window.history.go(-1);
		else
			this.oRouter.navTo("week", {Date: sDate}, true);
	},

	// callback method in save error case, TODO clarify what to display
	errorSave : function(oError) {
		var oEntity = this.getViewEntity();
		// restore attendee stuff lost in saveAppointment method.
		oEntity.Attendee = this.oAttendeesToUpdateBackup;
		oEntity.delAttendee = this.oDelAttendeeBackup;
		jQuery.sap.log.error("oData batch save failed");
		this.oBusyDialog.close();
		cus.crm.mycalendar.util.Util.showErrorMessagePopup(oError);
	},

	validateTimes : function(start, end) {

		var startDate = new Date(start);
		var endDate = new Date(end);

		startDate.setHours(0, 0, 0, 0);
		endDate.setHours(0, 0, 0, 0);

		var startDateMs = startDate.getTime();
		var endDateMs = endDate.getTime();

		// Check first that Start Date is not after End Date
		if (startDateMs > endDateMs) {
			sap.ca.ui.message.showMessageBox({
				type : sap.ca.ui.message.Type.ERROR,
				message : this.oBundle.getText("view.Appointment.wrongDates")
			});
			return false;
		}

		// Check that for an Appointment on One Date, End Time is after Start Time
		if (startDateMs === endDateMs) {
			var startDateTime = new Date(start);
			var endDateTime = new Date(end);

			startDateTime.setSeconds(0, 0);
			endDateTime.setSeconds(0, 0);

			if (startDateTime.getTime() > endDateTime.getTime()) {
				sap.ca.ui.message.showMessageBox({
					type : sap.ca.ui.message.Type.ERROR,
					message : this.oBundle.getText("view.Appointment.wrongTimes")
				});
				return false;
			}
		}
		return true;

	},

	parseDate : function(dateString) {

		var dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({
			style : "long"
		});

		var oDate = dateFormatter.parse(dateString);

		return oDate;
	},
	
	getDateParameterfromDate : function(d) {
		// format: Date --> yyymmdd
		var sDay = d.getDate().toString();
		sDay = (sDay.length === 1) ? "0" + sDay : sDay;
		var sMonth = d.getMonth() + 1; // Months are zero based
		sMonth = sMonth.toString();
		sMonth = (sMonth.length === 1) ? "0" + sMonth : sMonth;
		var sYear = d.getFullYear();
		var sDate = "" + sYear + sMonth + sDay;
		return sDate;
	},
	
		// transformation of datestring in mockmode
	adaptMockDate: function(sDate){
		var oDate = sDate.replace("/Date(", "").replace(")/", "");
		oDate = parseInt(oDate); // number ms
		return oDate = new Date(oDate);		
	},
    descriptionChanged : function(oEvent){
	    
		var sText = oEvent.getParameters().newValue;
	    var oData = this.getView().getModel('vm').oData;
	    oData.Description = sText;
	    this.enableSaveBtn();
	},
onF4Employee : function(oEvent){
		
	    var oModel = this.getView().getModel('vm'); 
	    var sEmpText = this.byId('responsibleText').getValue();
	    var oData = oModel.oData;
		if(!this.oEmpF4){
	    	  cus.crm.mycalendar.util.Util.initEmployeeF4(this,oEvent.getSource(),oModel);
	      }
	      
	    cus.crm.mycalendar.util.Util.showEmployeeF4(this,sEmpText,oData.Account,oData.AccountTxt);
	   this.ResponsibleID =  oData.Responsible ; 
	},
	
	_removeCrossAppAttributes : function(){
		delete this.Responsible;
		delete this.ResponsibleTxt;
		delete this.ContactName;
		delete this.ContactID;
		delete this.AccountName;
		delete this.AccountID;
	},
	
	_deepSanitize : function(a,b){
		var k;
		if(a instanceof Array && b instanceof Array){
		   for(k in b){
			   this._deepSanitize(a[k],b[k]);
		   }	
		   return;
		}
		
		if(a instanceof Object && b instanceof Object){
			for(k in a){
				 if(!b.hasOwnProperty(k)){
					 delete a[k];
				 }
				 else{
					 this._deepSanitize(a[k],b[k]);
				 }
			}
		}
		},
		
		_scrollToTop : function(){
			this.byId("p").scrollTo(0);
		},
		
		_setViewMode : function(sMode){
			this.getView().getModel("viewState").oData.Mode = sMode;
		},
		
		_getViewMode : function(){
			return this.getView().getModel("viewState").oData.Mode;
		},
		
		_interopChecks : function(sBackendVersion){
			
			if(parseFloat(sBackendVersion) >= 4){
				this.byId("priority").setVisible(true);
			}
			else{
				this.byId("priority").setVisible(false);
			}
		},
		
		_refreshAppointment : function(){
			this.editAppointment(this.sEntityPath, this.sApptGuid);
			//this.oModel.refresh();
			cus.crm.mycalendar.util.Util._fetchETag(this.sEntityPath,this.oModel);
		}
		
		

});

},
	"cus/crm/mycalendar/view/NewAppointment.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc"\n\txmlns="sap.m" xmlns:me="sap.me" xmlns:form="sap.ui.layout.form"\n\txmlns:layout="sap.ui.layout" xmlns:caui="sap.ca.ui"\n\tcontrollerName="cus.crm.mycalendar.view.NewAppointment" xmlns:html="http://www.w3.org/1999/xhtml">\n \n\t<Page id="p" showNavButton="true" navButtonPress="onBack">\n\t\t<content>\n\n\t\t\t<!-- description of appointment -->\n\n\t\t\t<form:Form id="tit" class="sapUiFormEdit sapUiFormEdit-CTX">\n\t\t\t\t<form:layout>\n\t\t\t\t\t<core:Fragment fragmentName="cus.crm.mycalendar.view.EditLayout"\n\t\t\t\t\t\ttype="XML" />\n\t\t\t\t</form:layout>\n\t\t\t\t<form:formContainers>\n\t\t\t\t\t<form:FormContainer id="descContainer">\n\t\t\t\t\t\t<form:formElements>\n\t\t\t\t\t\t\t<form:FormElement id="TypecFormElement">\n\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t<Label id="ProcessTypeLabel" text="{i18n>view.Appointment.TransactionType}" >\n\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t<Text id="ProcessTypeText" type="Text" value="{vm>/TransactionType}" class="TypePad"></Text>\n\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t<form:FormElement id="descFormElement">\n\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t<Label id="apptLabel" text="{i18n>view.Appointment.subject}" required="true">\n\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t<Input id="desc" type="Text" value="{vm>/Description}"\n\t\t\t\t\t\t\t\t\t\tliveChange="descriptionChanged"></Input>\n\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t<!-- Extension point to add additional edit header -->\n\t\t\t\t\t\t\t<core:ExtensionPoint name="extensionEditHeader" />\n\t\t\t\t\t\t</form:formElements>\n\t\t\t\t\t</form:FormContainer>\n\t\t\t\t</form:formContainers>\n\t\t\t</form:Form>\n\n\n\t\t\t<!-- General form -->\n\t\t\t<form:Form id="general" title="{i18n>view.Appointment.generalData}"\n\t\t\t\tclass="sapUiFormEdit sapUiFormEdit-CTX">\n\n\t\t\t\t<form:layout>\n\t\t\t\t\t<core:Fragment fragmentName="cus.crm.mycalendar.view.EditLayout"\n\t\t\t\t\t\ttype="XML" />\n\t\t\t\t</form:layout>\n\n\t\t\t\n\t\t\t\t<form:formContainers>\n\t\t\t\t\n\t\t\t\t\t<form:FormContainer id="statusContainer">\n\t\t\t\t\t\t<form:formElements>\n\t\t\t\t\t\t\t<!-- status label + drop down -->\n\t\t\t\t\t\t\t<form:FormElement id="status">\n\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t<Label id="statusLabel" text="{i18n>view.Appointment.activeStatus}"\n\t\t\t\t\t\t\t\t\t\trequired="true">\n\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t<Select  width="100%" id="st" items="{statusmodel>/results}"\n\t\t\t\t\t\t\t\t\t\tselectedKey="{vm>/Status}">\n\t\t\t\t\t\t\t\t\t\t<core:Item text="{statusmodel>StatusTxt}" key="{statusmodel>StatusID}" />\n\t\t\t\t\t\t\t\t\t</Select>\n\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<form:FormElement id="priority">\n\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t<Label id="priorityLabel" text="{i18n>view.Appointment.priority}"\n\t\t\t\t\t\t\t\t\t\trequired="true">\n\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t<Select  width="100%" id="pr" items="{priomodel>/results}"\n\t\t\t\t\t\t\t\t\t\tselectedKey="{vm>/Priority}">\n\t\t\t\t\t\t\t\t\t\t<core:Item text="{priomodel>TxtLong}" key="{priomodel>Priority}" />\n\t\t\t\t\t\t\t\t\t</Select>\n\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t</form:FormElement>\n\n\t\t\t\t\t\t\t<!-- private -->\n\t\t\t\t\t\t\t<form:FormElement id="privateLabel" label="{i18n>view.Appointment.private}">\n\t\t\t\t\t\t\t\t<Switch id="pf" enabled="true" state="{vm>/PrivatFlag}" change="onPrivateChanged">\n\t\t\t\t\t\t\t\t</Switch>\n\t\t\t\t\t\t\t</form:FormElement>\n\n\t\t\t\t\t\t\t<!-- start date time fields -->\n\t\t\t\t\t\t\t<form:FormElement id="startDateFormElement">\n\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t<Label id="startDateLabel" text="{i18n>view.Appointment.startdatetime}"\n\t\t\t\t\t\t\t\t\t\trequired="true">\n\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t<caui:DatePicker id="fd"\n\t\t\t\t\t\t\t\t\t\tvalue="{path: \'vm>/FromDate\',  type:\'sap.ui.model.type.Date\', formatOptions: { style: \'long\'}}"\n\t\t\t\t\t\t\t\t\t\tchange="onFromDateChanged"></caui:DatePicker>\n\t\t\t\t\t\t\t\t\t<DateTimeInput id="ft" type="Time"\n\t\t\t\t\t\t\t\t\t\tvalue="{path: \'vmh>/FromDateTime\',  type:\'sap.ui.model.type.Time\', formatOptions: {style: \'short\'}}"\n\t\t\t\t\t\t\t\t\t\tchange="onTimeFromChanged">\n\n\t\t\t\t\t\t\t\t\t</DateTimeInput>\n\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t</form:FormElement>\n\n\t\t\t\t\t\t\t<!-- end date time fields -->\n\t\t\t\t\t\t\t<form:FormElement id="endDateFormElement">\n\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t<Label id="endDateLabel" text="{i18n>view.Appointment.enddatetime}"\n\t\t\t\t\t\t\t\t\t\trequired="true">\n\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t<caui:DatePicker id="td"\n\t\t\t\t\t\t\t\t\t\tvalue="{path: \'vm>/ToDate\', type:\'sap.ui.model.type.Date\', formatOptions: { style: \'long\'}}"\n\t\t\t\t\t\t\t\t\t\tchange="onToDateChanged"></caui:DatePicker>\n\t\t\t\t\t\t\t\t\t<DateTimeInput id="tt" type="Time"\n\t\t\t\t\t\t\t\t\t\tvalue="{path: \'vmh>/ToDateTime\',  type:\'sap.ui.model.type.Time\', formatOptions: {style: \'short\'}}"\n\t\t\t\t\t\t\t\t\t\tchange="onTimeToChanged">\n\t\t\t\t\t\t\t\t\t</DateTimeInput>\n\n\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t</form:FormElement>\n\n\n\t\t\t\t\t\t\t<!-- all day -->\n\t\t\t\t\t\t\t<form:FormElement id="allDayFormElement" label="{i18n>view.Appointment.alldayevent}">\n\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t<Switch id="ad" enabled="true" state="{vm>/AllDay}" change="onAllDayChanged">\n\t\t\t\t\t\t\t\t\t</Switch>\n\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t</form:FormElement>\n\n\t\t\t\t\t\t\t<!-- location -->\n\t\t\t\t\t\t\t<form:FormElement id="locationFormElement" label="{i18n>view.Appointment.location}">\n\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t<Input id="loc" type="Text" value="{vm>/Location}"></Input>\n\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t</form:FormElement>\n<!-- Extension point to add additional edit content -->\n\t\t\t\t\t\t\t<core:ExtensionPoint name="extensionEdit1" />\n\n\t\t\t\t\t\t</form:formElements>\n\t\t\t\t\t</form:FormContainer>\n\t\t\t\t</form:formContainers>\n\t\t\t</form:Form>\n\t\t\t<!-- end General form -->\n\n\n\t\t\t<!-- account, contact and employee responsible -->\n\t\t\t<form:Form id="cont" title="{i18n>view.Appointment.contact}"\n\t\t\t\tclass="sapUiFormEdit sapUiFormEdit-CTX cusFormlabelPadding">\n\t\t\t\t<form:layout>\n\t\t\t\t\t<core:Fragment fragmentName="cus.crm.mycalendar.view.EditLayout"\n\t\t\t\t\t\ttype="XML" />\n\t\t\t\t</form:layout>\n\t\t\t\t<form:formContainers>\n\t\t\t\t\t<form:FormContainer id="accountFormContainer">\n\t\t\t\t\t\t<form:formElements>\n\t\t\t\t\t\t\t<form:FormElement id="accountLabel" label="{i18n>view.Appointment.account}">\n\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t<Input\n\t\t\t\t\t\t\t\t\t\tvalue="{parts : [{path :\'vm>/AccountTxt\'},{path : \'vm>/Account\'}],formatter : \'cus.crm.mycalendar.util.Conversions.formatAccountText\'}"\n\n\t\t\t\t\t\t\t\t\t\tid="ia" showValueHelp="true" valueHelpOnly="false"\n\t\t\t\t\t\t\t\t\t\tvalueHelpRequest="onF4Account" liveChange="onAccountInputFieldChanged"\n\t\t\t\t\t\t\t\t\t\tsuggestionItemSelected="onAccountSuggestItemSelected">\n\n\t\t\t\t\t\t\t\t\t</Input>\n\n\t\t\t\t\t\t\t\t\t<Input id="accountIDInput" value="{vm>/Account}" type="Text"\n\t\t\t\t\t\t\t\t\t\tvisible="false">\n\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<layout:GridData span="L5 M6 S10" />\n\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t</Input>\n\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t</form:FormElement>\n\n\t\t\t\t\t\t\t<form:FormElement id="contactLabel" label="{i18n>view.Appointment.contact}">\n\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t<Input id="ic" type="Text" showValueHelp="true"\n\t\t\t\t\t\t\t\t\t\tvalueHelpOnly="false" valueHelpRequest="onF4Contact" value="{vm>/ContactTxt}"\n\t\t\t\t\t\t\t\t\t\tliveChange="onContactInputFieldChanged"\n\t\t\t\t\t\t\t\t\t\tsuggestionItemSelected="onContactSuggestItemSelected">\n\n\t\t\t\t\t\t\t\t\t</Input>\n\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t<form:FormElement id="responsible"\n\t\t\t\t\t\t\t\tlabel="{i18n>view.Appointment.employeeResponsible}">\n\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t<Input id="responsibleText" value="{vm>/ResponsibleTxt}"\n\t\t\t\t\t\t\t\t\t\tshowValueHelp="true" valueHelpOnly="false"\n\t\t\t\t\t\t\t\t\t\tliveChange="onEmployeeInputFieldChanged"\n\t\t\t\t\t\t\t\t\t\tsuggestionItemSelected="onEmployeeSuggestItemSelected"\n\t\t\t\t\t\t\t\t\t\tvalueHelpRequest="onF4Employee">\n\t\t\t\t\t\t\t\t\t</Input>\n\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t</form:formElements>\n\t\t\t\t\t</form:FormContainer>\n\t\t\t\t</form:formContainers>\n\t\t\t</form:Form>\n\n\t\t\t<!-- end account, contact and employee responsible -->\n\n   <!-- Extension point to add additional edit content -->\n\t\t\t<core:ExtensionPoint name="extensionEdit2" />\n\n\t\t\t<!-- attendees / title change dynamically in view -->\n\t\t\t<form:Form id="atttit" title=""\n\t\t\t\tclass="sapUiFormEdit sapUiFormEdit-CTX cusFormlabelPadding">\n\t\t\t\t<form:layout>\n\t\t\t\t\t<core:Fragment fragmentName="cus.crm.mycalendar.view.EditLayout"\n\t\t\t\t\t\ttype="XML" />\n\t\t\t\t</form:layout>\n\t\t\t\t<form:formContainers>\n\t\t\t\t\t<form:FormContainer id="externalFormContainer">\n\t\t\t\t\t\t<form:formElements>\n\t\t\t\t\t\t\t<form:FormElement id="externalFormElement" label="{i18n>view.Appointment.external}">\n\t\t\t\t\t\t\t\t<form:fields>\n\n\t\t\t\t\t\t\t\t\t<Text id="atex">\n\n\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t<Button id="editAttendeesIcon" icon="sap-icon://edit" type="Transparent"\n\t\t\t\t\t\t\t\t\t\tpress="onEditExternalAttendees">\n\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<layout:GridData span="L1 M1 S12">\n\t\t\t\t\t\t\t\t\t\t\t</layout:GridData>\n\t\t\t\t\t\t\t\t\t\t</layoutData>\n\n\t\t\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t</form:FormElement>\n\n\t\t\t\t\t\t\t<form:FormElement id="internalFormElement" label="{i18n>view.Appointment.internal}">\n\n\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t<Text id="atin">\n\n\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t<Button id="editInternalIcon" icon="sap-icon://edit" type="Transparent" press="onEditEmployees">\n\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<layout:GridData span="L1 M1 S12">\n\t\t\t\t\t\t\t\t\t\t\t</layout:GridData>\n\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t</Button>\n\n\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t</form:formElements>\n\t\t\t\t\t</form:FormContainer>\n\t\t\t\t</form:formContainers>\n\t\t\t</form:Form>\n\t\t\t<!-- end attendees -->\n\n<!-- Extension point to add additional edit content -->\n\t\t\t<core:ExtensionPoint name="extensionEdit3" />\n\n\t\t\t<!-- notes -->\n\t\t\t<form:Form id="notes" title="{i18n>view.Appointment.notes}"\n\t\t\t\tclass="sapUiFormEdit sapUiFormEdit-CTX">\n\t\t\t\t<form:layout>\n\t\t\t\t\t<core:Fragment fragmentName="cus.crm.mycalendar.view.EditLayout"\n\t\t\t\t\t\ttype="XML" />\n\t\t\t\t</form:layout>\n\t\t\t\t<form:formContainers>\n\t\t\t\t\t<form:FormContainer id="noteFormContainer">\n\t\t\t\t\t\t<form:formElements>\n\t\t\t\t\t\t\t<form:FormElement id="noteFormElement">\n\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t<TextArea  id="noteTextArea" value="{vm>/Note}" rows="4"></TextArea>\n\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t</form:FormElement>\n\n\t\t\t\t\t\t</form:formElements>\n\t\t\t\t\t</form:FormContainer>\n\t\t\t\t</form:formContainers>\n\t\t\t</form:Form>\n\t\t\t<!-- end notes -->\n\n\t\t\t<!-- attachments view contains own form -->\n\t\t\t<mvc:XMLView id="attachmentsView_chg1" viewName="cus.crm.mycalendar.view.Attachments_chg"></mvc:XMLView>\n\n\t\t</content>\n\n\t\t<footer>\n\t\t\t<Bar  id="editBar" translucent="false">\n\t\t\t\t<contentRight>\n\t\t\t\t\t<Button id="bs" press="onSave" text="{i18n>view.Appointment.save}"\n\t\t\t\t\t\ttype="Emphasized" />\n\t\t\t\t\t<Button id="bc" press="onCancel" text="{i18n>view.Appointment.cancel}" />\n\t\t\t\t</contentRight>\n\t\t\t</Bar>\n\t\t</footer>\n\n\t</Page>\n\n</core:View>\n',
	"cus/crm/mycalendar/view/ProcessTypeDialog.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<SelectDialog\n        xmlns="sap.m"\n        xmlns:core="sap.ui.core"\n        \n        title="{i18n>view.Appointment.process_type}"\n       \n        multiSelect=""\n        items="{json>/TransactionTypeSet}"\n       \tsearch="searchProcess"\n        confirm="selectProcess"\n        cancel="cancelProcess">\n    <StandardListItem title="{json>Description}" description="{json>ProcessTypeCode}">\n        <customData>\n            <core:CustomData key="ProcessTypeCode" value="{json>ProcessTypeCode}"/>\n            <core:CustomData key="ProcessTypeDescription" value="{json>Description}" />\n            <core:CustomData key="PrivateFlag" value="{json>PrivateFlag}" />\n        </customData>\n    </StandardListItem>\n</SelectDialog>',
	"cus/crm/mycalendar/view/ShowErrorMsg.fragment.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<Dialog xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:l="sap.ui.layout"\r\n\ttitle="{i18n>view.Appointment.messages}" class="DialogPadding">\r\n\r\n\t<content>\r\n\r\n\t<l:VerticalLayout width="100%" content="{json>/AppointmentLogSet}"\r\n\t\tid="logsList">\r\n\t\t<l:content>\r\n\t\t\t<l:HorizontalLayout>\r\n\t\t\t\t<l:content>\r\n\t\t\t\t\t<core:Icon size="1.375rem" width="3rem" height="3rem"\r\n\t\t\t\t\t\tcolor="red" src="sap-icon://error" allowWrapping="true" />\r\n\t\t\t\t\t<Text class="AppErrorMsg" textAlign="Left" text="{json>LogMessage}" />\r\n\t\t\t\t</l:content>\r\n\t\t\t</l:HorizontalLayout>\r\n\t\t</l:content>\r\n\t</l:VerticalLayout>\r\n\t\t\r\n\r\n\t</content>\r\n\r\n\t<beginButton>\r\n\t\t<Button id="myclosebutton" text="{i18n>view.Appointment.ok}"\r\n\t\t\tpress="closeErrorFrag" />\r\n\t</beginButton>\r\n\r\n</Dialog>\r\n\r\n ',
	"cus/crm/mycalendar/view/sharedDialog.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<Dialog  xmlns="sap.m" title="{i18n>view.Appointment.sharedCalendars}"\n\tcontentWidth="480px" contentHeight="720px" class="DialogPadding">\n\t<subHeader>\n\t\t<Bar>\n\t\t\t<contentLeft>\n\t\t\t\t<SearchField placeholder="{i18n>view.Appointment.searchfieldplaceholder}"\n\t\t\t\t\tsearch="onSharedSearch"></SearchField>\n\t\t\t</contentLeft>\n\t\t</Bar>\n\n\t</subHeader>\n\t<content>\n\t\t<List  noDataText="{i18n>view.Appointment.empsea_nodata}" mode="SingleSelectMaster"\n\t\t\titems="{showJson>/EmployeeCollection}" selectionChange="sharedAppointment"\n\t\t\tgrowing="true" value="true">\n\t\t\t<items>\n\t\t\t\t<ObjectListItem\n\t\t\t\t\ttitle="{path:\'showJson>fullName\'}">\n\t\t\t\t\t<attributes>\n\t\t\t\t\t\t<ObjectAttribute text="{showJson>employeeID}">\n\t\t\t\t\t\t</ObjectAttribute>\n\t\t\t\t\t\t\n\t\t\t\t\t</attributes>\n\t\t\t\t</ObjectListItem>\n\t\t\t</items>\n\t\t\t<infoToolbar>\n\t\t\t\t<Toolbar  active="false" visible="true" >\n\t\t\t\t\t<content>\n\t\t\t\t\t\t<Label  text="{i18n>view.Appointment.myTeam}"></Label>\n\t\t\t\t\t\t<ToolbarSpacer></ToolbarSpacer>\n\t\t\t\t\t\n\n\t\t\t\t\t</content>\n\t\t\t\t</Toolbar>\n\t\t\t</infoToolbar>\n\t\t</List>\n\t</content>\n\n\t<beginButton>\n\t\t<Button text="{i18n>view.Appointment.cancel}" press="closeSharedCalendar" />\n\t</beginButton>\n\n</Dialog>\n'
}});
