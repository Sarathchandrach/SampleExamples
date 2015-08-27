/*
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