/*
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