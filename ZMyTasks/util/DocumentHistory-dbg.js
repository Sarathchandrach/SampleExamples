/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mytasks.util.DocumentHistory");

cus.crm.mytasks.util.DocumentHistory = {
	NAVLINK : "DocumentHistory",
	aRelatedDocTypes : [ {
		busType : "BUS2000125",
		bWithinApp : true,
		semanticObject : "Task",
		action : "manageTasks",
		appSpecificRoute : [ "&/taskOverview/Tasks(guid'", "')" ]
	}, {
		busType : "BUS2000126",
		bWithinApp : false,
		semanticObject : "Appointment",
		action : "myAppointments",
		appSpecificRoute : [ "&/appointment/" ]
	}, {
		busType : "BUS2000111",
		bWithinApp : false,
		semanticObject : "Opportunity",
		action : "manageOpportunity",
		appSpecificRoute : [ "&/display/Opportunities(guid'", "')" ]
	}, {
		busType : "BUS2000108",
		bWithinApp : false,
		semanticObject : "Lead",
		action : "manageLead",
		appSpecificRoute : [ "&/display/Leads(guid'", "')" ]
	} ],

	showOrHidePanel : function(oView) {
		if (oView) {
			var oCUS = cus.crm.mytasks.util.Schema, oDocHistoryPanel = oView
					.byId("transactionHistoryData");
			// TODO: Change service schema version to 4
			if (oCUS.getServiceVersion() == 1
					&& oCUS.getServiceSchemaVersion() >= 4){
				oDocHistoryPanel.setVisible(true);
				if(oDocHistoryPanel.setExpanded)
					oDocHistoryPanel.setExpanded(false);
			}
			else
				oDocHistoryPanel.setVisible(false);
		}
	},

	bindDataToTable : function(oController, oParams) {
		var oTempState = {}, oView = oController.getView(), oDocHistoryTable = oView
				.byId("tabDocHistory"), oModel = oView.getModel(), oCUDoc = cus.crm.mytasks.util.DocumentHistory;
		if (oParams.bExpandCall) {
			oTempState.paths = oController.oOverviewTask[oCUDoc.NAVLINK]["__list"]
					|| [];
			oTempState.controlval = [];
			for ( var i = -1, sPath; sPath = oTempState.paths[++i];)
				oTempState.controlval.push(oCUDoc.buildDocumentObject(oModel
						.getObject('/' + sPath)));
		} else
			oTempState = oCUDoc
					._addDataToODataModel(oModel, oParams.curResults);

		oDocHistoryTable.setModel(new sap.ui.model.json.JSONModel({
			transactions : oTempState.controlval
		}), "docHistory");
	},

	_addDataToODataModel : function(oModel, aTransactionHistoryData) {
		var aDummy = undefined, sPath = undefined;
		var aDocHistoryPaths = [], aReturnDocHistory = [];
		for ( var i = -1, oCurObject; oCurObject = aTransactionHistoryData[++i];) {
			aDummy = oCurObject.__metadata.id.split("/");
			sPath = aDummy[aDummy.length - 1];
			aDocHistoryPaths.push(sPath);
			aReturnDocHistory.push(cus.crm.mytasks.util.DocumentHistory
					.buildDocumentObject(oCurObject));
			oModel.oData[sPath] = oCurObject;
		}
		return {
			paths : aDocHistoryPaths,
			controlval : aReturnDocHistory
		};
	},

	addOrModifyDocumentType : function(oNewProperties) {
		var aDocTypes = cus.crm.mytasks.util.DocumentHistory.aRelatedDocTypes;
		if (oNewProperties && jQuery.type(oNewProperties) === "object") {
			// Remove invalid Properties from parameter passed
			for ( var sProp in oNewProperties)
				if (!aDocTypes[0][sProp])
					delete oNewProperties[sProp];
				else if (typeof aDocTypes[0][sProp] !== typeof oNewProperties[sProp])
					delete oNewProperties[sProp];
			if (oNewProperties["busType"]
					&& Object.keys(oNewProperties).length !== 0
					&& Object.keys(oNewProperties).length === Object
							.keys(aDocTypes[0])) {
				var iIndexOfDocType = -1;
				for ( var i = 0, j = aDocTypes.length; i < j; i++)
					if (aDocTypes[i]["busType"] === oNewProperties["busType"]) {
						iIndexOfDocType = i;
						break;
					}
				if (iIndexOfDocType > -1)
					aDocTypes[i] = oNewProperties;
				else
					aDocTypes.push(oNewProperties);
			} else
				for ( var i = 0, j = aDocTypes.length; i < j; i++)
					if (aDocTypes[i]["busType"] === oNewProperties["busType"]) {
						for ( var sProp in oNewProperties)
							aDocTypes[i][sProp] = oNewProperties[sProp];
						break;
					}
		}
	},

	buildDocumentObject : function(oDocument) {
		var oObjectToReturn = {
			CreatedAt : oDocument.CreatedAt,
			Description : oDocument.Description,
			Guid : oDocument.Guid,
			ObjectId : oDocument.ObjectId,
			ProcessType : oDocument.ProcessType,
			ProcessTypeDescription : oDocument.TransTypeDesc,
			RelType : oDocument.Relationship,
			navToURL : "",
			enableLink : false
		}, oCUDoc = cus.crm.mytasks.util.DocumentHistory;
		for ( var i = -1, oCurDocType; oCurDocType = oCUDoc.aRelatedDocTypes[++i];) {
			var sAppSpecificRoute = undefined, aTemp = [];
			if (oCurDocType["busType"] === oDocument.ObjectType) {
				oObjectToReturn.enableLink = true;
				oObjectToReturn.bWithinApp = oCurDocType.bWithinApp;
				if (oCurDocType.appSpecificRoute.length === 1)
					sAppSpecificRoute = oCurDocType.appSpecificRoute[0]
							+ oObjectToReturn.Guid;
				else {
					aTemp = oCurDocType.appSpecificRoute.slice(0);
					aTemp.splice(1, 0, oObjectToReturn.Guid);
					sAppSpecificRoute = aTemp.join("");
				}
				oObjectToReturn.navToURL = "#"
						+ [ oCurDocType.semanticObject, oCurDocType.action ]
								.join("-") + sAppSpecificRoute;
				break;
			}
		}
		return oObjectToReturn;
	},
};