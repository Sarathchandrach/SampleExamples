/*
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