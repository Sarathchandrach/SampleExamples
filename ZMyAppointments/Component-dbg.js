/*
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
