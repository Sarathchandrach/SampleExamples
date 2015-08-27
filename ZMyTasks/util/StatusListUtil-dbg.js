/*
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