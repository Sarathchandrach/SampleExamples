/*
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