/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mytasks.util.Attachments");
jQuery.sap.require("cus.crm.mytasks.util.Formatter");
jQuery.sap.require("cus.crm.mytasks.util.Schema");

cus.crm.mytasks.util.Attachments = {
	NAVLINK : "Attachments",
	OverviewPage : {
		showOrHidePanel : function(oView) {
			var oFileUpload = oView.byId("attachmentOverview"), oFileUploadPanel = oView
					.byId("attachmentData"), oCUS = cus.crm.mytasks.util.Schema;
			if (oCUS.getServiceVersion() == 1
					&& oCUS.getServiceSchemaVersion() >= 4) {
				oFileUploadPanel.setVisible(true);
				if (sap.ui.version < "1.22") {
					oFileUpload.preventEdits(true);
					oFileUpload.setEditMode(false);
					oFileUpload.setShowAttachmentsLabelInEditMode(false);
				} // else if(sap.ui.version < "1.26"){
				else {
					oFileUpload.preventEdits(true);
					// oFileUpload._oToolbar.setVisible(false);
					oFileUpload.setDeleteEnabled(false);
					oFileUpload.setShowAttachmentsLabel(false);
				}
			} else
				oFileUploadPanel.setVisible(false);
		},

		bindData : function(oController, oParams) {
			var oTempState = {}, oView = oController.getView(), oModel = oView
					.getModel(), oCU = cus.crm.mytasks.util;
			var oFileUploadControl = oView.byId("attachmentOverview"), oRB = oCU.Formatter
					.getResourceBundle(), oAttachmentPanel = oView
					.byId("attachmentData"), oCUAtt = oCU.Attachments;
			if (oParams.bExpandCall) {
				oTempState.paths = oController.oOverviewTask[oCUAtt.NAVLINK]["__list"]
						|| [];
				oTempState.controlval = [];
				for ( var i = -1, sPath; sPath = oTempState.paths[++i];)
					oTempState.controlval.push(oCUAtt
							.buildFileDescriptorForObject(oModel.getObject('/'
									+ sPath)));
			} else {
				oTempState = oCUAtt._addDataToODataModel(oModel,
						oParams.curResults);
				// oController.oOverviewTask[oCUAtt.NAVLINK]["__list"] =
				// oTempState.paths;
			}
			oCUAtt._aPaths = oTempState.paths;
			oFileUploadControl.setModel(new sap.ui.model.json.JSONModel({
				Attachments : oTempState.controlval
			}));
			oAttachmentPanel.setHeaderText(oRB.getText("S4_TASK_ATTACHMENTS",
					[ oTempState.paths.length ]));
		}
	},
	EditPage : {
		showOrHidePanel : function(oView) {
			var oFileUpload = oView.byId("attachmentEdit"), oCU = cus.crm.mytasks.util, oFileUploadPanel = oView
					.byId("attachmentEditData"), oCUAtt = oCU.Attachments, oModel = oView
					.getModel(), oCUS = oCU.Schema, sPath = oView
					.getBindingContext().getPath();
			if (oCUS.getServiceVersion() == 1
					&& oCUS.getServiceSchemaVersion() >= 4) {
				if (sPath === "/new")
					oFileUploadPanel.setVisible(false);
				else {
					oFileUploadPanel.setVisible(true);
					// oFileUpload.preventEdits(true);
					if (sap.ui.version < "1.22") {
						oFileUpload.setEditMode(true);
						oFileUpload.setShowAttachmentsLabelInEditMode(false);
					} // else if(sap.ui.version < "1.26"){
					else {
						// oFileUpload._oToolbar.setVisible(false);
						oFileUpload.setDeleteEnabled(true);
						oFileUpload.setShowAttachmentsLabel(false);
					}
					oFileUpload.setUploadUrl([ oModel.sServiceUrl,
							sPath.substr(1), oCUAtt.NAVLINK ].join("/"));
					if (oFileUpload.getUploadEnabled()) {
						// Set XSRF token & base 64 encoding URL service for IE9
						oFileUpload.setXsrfToken(oCUAtt.getXSRFToken(oModel));
						oFileUpload.setEncodeUrl("/sap/bc/ui2/encode_file"
								+ (oModel.aUrlParams
										&& oModel.aUrlParams.length > 0 ? "?"
										+ oModel.aUrlParams.join("&") : ""));
					}
				}
			} else
				oFileUploadPanel.setVisible(false);
		},

		bindData : function(oController, oParamResults) {
			var oCU = cus.crm.mytasks.util, oView = oController.getView(), oModel = oView
					.getModel(), oFileUploadControl = oView
					.byId("attachmentEdit"), oRB = oCU.Formatter
					.getResourceBundle(), oAttachmentPanel = oView
					.byId("attachmentEditData"), oTempState = {
				Attachments : []
			}, oCUAtt = oCU.Attachments;
			for ( var i = -1, sPath; sPath = oCUAtt._aPaths[++i];)
				oTempState.Attachments.push(oCUAtt
						.buildFileDescriptorForObject(oModel.getObject('/'
								+ sPath)));
			oFileUploadControl.setModel(new sap.ui.model.json.JSONModel(
					oTempState));
			if (oTempState.Attachments.length == 0) {
				oAttachmentPanel.setHeaderText(oRB.getText(
						"S4_TASK_ATTACHMENTS", "0"));
			} else
				oAttachmentPanel.setHeaderText(oRB.getText(
						"S4_TASK_ATTACHMENTS", oTempState.Attachments.length));
			oFileUploadControl.setCustomHeader("slug",
					oController.oSavedTask.Guid.replace(/-/g, ''));
		},

		uploadFileToTask : function(oController, oCurrentAttachment) {
			if (oController instanceof sap.ca.scfld.md.controller.BaseFullscreenController) {
				var oCU = cus.crm.mytasks.util, oView = oController.getView(), oFileUpload = oView
						.byId("attachmentEdit"), oCUAtt = oCU.Attachments, oAttachmentPanel = oView
						.byId("attachmentEditData");
				oFileUpload.commitFileUpload(oCUAtt
						.buildFileDescriptorForObject(oCurrentAttachment,
								"POST"));
				var aAttachmentList = oFileUpload.getModel().getProperty(
						'/' + oCUAtt.NAVLINK);
				oAttachmentPanel.setHeaderText(oCU.Formatter
						.getResourceBundle().getText("S4_TASK_ATTACHMENTS",
								[ aAttachmentList.length ]));
			}
		},

		renameFileOfTask : function(oController, oParams) {
			if (oController instanceof sap.ca.scfld.md.controller.BaseFullscreenController) {
				var oModel = oController.getView().getModel();
				if (oParams) {
					oModel.setHeaders(oParams.headers);
					var fnSuccess = function(oData, oResponse) {
						this.getView().byId("attachmentEdit")
								.commitPendingRenames();
						var oRB = cus.crm.mytasks.util.Formatter
								.getResourceBundle();
						sap.m.MessageToast.show(oRB
								.getText("S3_RENAME_ATTACHMENT_SUCCESS"));
					}, fnError = function(oError) {
						this.getView().byId("attachmentEdit")
								.abandonPendingRenames();
						var oCU = cus.crm.mytasks.util, oObject = {
							msg : oCU.Formatter.getResourceBundle().getText(
									"S3_RENAME_ATTACHMENT_FAILED")
						};
						oCU.Util.onRequestFailed(oError,
								"Renaming of a file attachment FAILED!",
								oObject);
					};
					oModel.update(oParams.path, oParams.entry, null, jQuery
							.proxy(fnSuccess, oController), jQuery.proxy(
							fnError, oController), false);
				}
			}
		},

		deleteFileFromTask : function(oController, oCurrentAttachment) {
			if (oController instanceof sap.ca.scfld.md.controller.BaseFullscreenController) {
				var oModel = oController.getView().getModel(), sUrl = oCurrentAttachment.mediaURL;
				if (!sUrl)
					sUrl = oCurrentAttachment.url;
				var aDummy = sUrl.split("/"), sPathToDelete = [
						aDummy[aDummy.length - 2], aDummy[aDummy.length - 1] ]
						.join("/"), fnSuccess = function(oParams, oData,
						oResponse) {
					if (oParams) {
						var oCU = cus.crm.mytasks.util, oView = oParams.controller
								.getView(), oRB = oCU.Formatter
								.getResourceBundle(), oFileUpload = oView
								.byId("attachmentEdit");
						oFileUpload.removeFile(oParams.curAttachment.fileId);
						var aAttachmentList = oFileUpload.getModel()
								.getProperty('/' + oCU.Attachments.NAVLINK);
						oView.byId("attachmentEditData").setHeaderText(
								oRB.getText("S4_TASK_ATTACHMENTS",
										[ aAttachmentList.length ]));
					}
				}, fnError = function(oError) {
					cus.crm.mytasks.util.Util.onRequestFailed(oError,
							"DELETE Attachment FAILED!");
				};
				oModel.remove(sPathToDelete, null, jQuery.proxy(fnSuccess,
						this, {
							controller : oController,
							curAttachment : oCurrentAttachment
						}), fnError);
			}
		},
	},

	_aPaths : [],
	buildFileDescriptorForObject : function(oCurrentAttachment, sMethod) {
		var oCUF = cus.crm.mytasks.util.Formatter;
		var oObject = {
			name : oCurrentAttachment.Name,
			url : oCurrentAttachment.Url ? oCurrentAttachment.Url
					: oCUF
							.formatAttachmentURL(oCurrentAttachment.__metadata.media_src),
			// size : oCurrentAttachment.fileSize,
			uploadedDate : oCurrentAttachment.CreatedAt,
			contributor : oCurrentAttachment.CreatedBy,
			mimeType : oCurrentAttachment.MimeType,
			fileId : oCurrentAttachment.Documentid,
			fileExtension : oCUF.formatMimeType(oCurrentAttachment.MimeType),
			mediaURL : oCUF
					.formatAttachmentURL(oCurrentAttachment.__metadata.media_src),
			docClass : oCurrentAttachment.Documentclass,
			taskGuid : oCurrentAttachment.HeaderGuid
		}, aDummy = oObject.name.split(".");
		if (aDummy.length > 1) {
			var sDummy = aDummy.pop();
			oObject.fileExtension = /[a-z]/.test(sDummy) ? sDummy.toLowerCase()
					: sDummy.toUpperCase();
		}
		oObject.name = [ aDummy.join("."), oObject.fileExtension ].join(".");
		if (sMethod === "POST") {
			// convert JSON date format into JS date format
			oObject.uploadedDate = new Date(parseInt(oObject.uploadedDate
					.substr(6)));
			oObject.name = decodeURIComponent(oObject.name);
		}
		return oObject;
	},

	_addDataToODataModel : function(oModel, aAttachmentData) {
		var aDummy = undefined, sPath = undefined;
		var aAttachmentPaths = [], aReturnAttachmentList = [];
		for ( var i = -1, oCurObject; oCurObject = aAttachmentData[++i];) {
			aDummy = oCurObject.__metadata.id.split("/");
			sPath = aDummy[aDummy.length - 1];
			aAttachmentPaths.push(sPath);
			aReturnAttachmentList.push(cus.crm.mytasks.util.Attachments
					.buildFileDescriptorForObject(oCurObject));
			oModel.oData[sPath] = oCurObject;
		}
		return {
			paths : aAttachmentPaths,
			controlval : aReturnAttachmentList
		};
	},

	getXSRFToken : function(oModel) {
		var oCU = cus.crm.mytasks.util, sCsrfToken = "";
		if (!oModel)
			oModel = oCU.Schema.getModel() || oCU.Util.getMainModel();
		if (oModel.getSecurityToken)
			sCsrfToken = oModel.getSecurityToken();
		else {
			oModel.refreshSecurityToken();
			sCsrfToken = oModel.oServiceData.securityToken;
		}
		return sCsrfToken;
	},
};