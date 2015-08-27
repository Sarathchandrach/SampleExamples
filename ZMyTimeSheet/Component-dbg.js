/*
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