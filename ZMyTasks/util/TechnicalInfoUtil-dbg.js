/*
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