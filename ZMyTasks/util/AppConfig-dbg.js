/*
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