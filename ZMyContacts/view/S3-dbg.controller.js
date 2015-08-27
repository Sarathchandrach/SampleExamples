/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/*global jQuery: false, sap: false, cus: false, console: false */
(function () {
	'use strict';

	jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
	jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");
	jQuery.sap.require("sap.ca.ui.message.message");
	jQuery.sap.require("sap.ca.ui.model.type.DateTime");
	jQuery.sap.require("sap.m.MessageBox");

	sap.ca.scfld.md.controller.BaseDetailController.extend("cus.crm.mycontacts.view.S3", {

		onInit:function () {

			this.fullScreenMode = false;


			// execute the onInit for the base class BaseDetailController
			sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);

			this.oFileUpload = this.byId('fileupload');

			var oView = this.getView(), oFileUpload = this.byId('fileupload'), sUrlParams = this.getView().getModel().sUrlParams;

			// if upload enabled, must set xsrf token and the base64 encodingUrl service for IE9 support!
			if (oFileUpload.getUploadEnabled()) {
				oFileUpload.setXsrfToken(this.getXsrfToken());
				oFileUpload.setEncodeUrl("/sap/bc/ui2/encode_file" + (sUrlParams ? '?' + sUrlParams : ''));
			}

			this.oRouter.attachRouteMatched(function (oEvent) {

				var eventParameterName = oEvent.getParameter("name");

				if(eventParameterName === "detail2" || eventParameterName === "display") {

					if(eventParameterName === "display") {
						this.fullScreenMode = true;
					} else {
						this.fullScreenMode = false;
					}

					var oModel = this.getView().getModel(); 
					var oArguments = oEvent.getParameter("arguments"); 
					var oContext = new sap.ui.model.Context(oModel, '/' + oArguments.contextPath);

					if(eventParameterName === "detail2") {
						this.sFilter    = oArguments.filter;
						this.sSort      = oArguments.sort;
						this.bIsSearch  = oArguments.isSearch;
						this.sSearch    = oArguments.search;
						this.iAccountID = oArguments.accountID;
						this.iContactID = oArguments.contactID;
						this.iItemCount = oArguments.itemCount;
					}

					if(!oContext.getObject()) { 
						//if context has no account object
						// this happens 
						// - if the view has been called directly with a link
						// - or after saving the new contact --> has to be read from backend
						var that = this;
						oModel.createBindingContext(oContext.sPath, "", {
							expand : this._getExpandForDataBinding()}, 
							function() {
								oView.setBindingContext(oContext);
								that._bindSelectedTab(oModel, oContext);
							}, 
							true); 
					} else {
						if(eventParameterName === "detail2") {
							oView.setBindingContext(oContext);
							this.byId("iconTabBar").setSelectedKey("details");
							this._bindSelectedTab(oModel, oContext); 
						}
					}
				} 
			}, this);
		},

		onUploadFile:function (oEvent) {
			var oData, oFile;
			// with some browsers (eg. IE9) the data comes in a different property!
			oData = oEvent.getParameters() && oEvent.getParameters().d ? oEvent.getParameters().d : oEvent.getParameters();

			oFile = this.buildFileDescriptorObject(oData);

			// commit the file descriptor object to the FileUpload control
			this.byId('fileupload').commitFileUpload(oFile);
			// Model has to be refreshed due to upload of attachment.
			// Since getRefreshUIObject does bindElement with attachment and
			// a new attachment has been created, no further refresh is necessary.
			cus.crm.mycontacts.util.Util.getRefreshUIObject(this.getView().getModel(), "/AttachmentCollection(documentID='"+oData.documentID+"',documentClass='"+oData.documentClass+"',businessPartnerID='"+oData.businessPartnerID+"')");
		},

		onFileUploadFailed:function (e) {
			sap.ca.ui.message.showMessageBox({
				type:sap.ca.ui.message.Type.ERROR,
				message:e.getParameters().exception.message,
				details: e.getParameters().response
			});
		},
		

		/**
		 *  builds a file descriptor object based on the incoming OData response
		 */
		buildFileDescriptorObject:function (value) {
			
			var oFile, url;
			if(value["URL"])
				url = value["URL"];
			else
				url = cus.crm.mycontacts.formatter.ReleaseFormatter.urlFormatter(value.__metadata.media_src);
			var oFile;
			oFile = {
				name:value.name,
				size:value.fileSize,
				url:url,
				uploadedDate:value.createdAt,
				contributor:value.createdBy,
				mimeType:value.mimeType,
				fileId:value.documentID,
				mediaURL:cus.crm.mycontacts.formatter.ReleaseFormatter.urlFormatter(value.__metadata.media_src)
			};

			return oFile;
		},
		
		onRenameFile: function(oEvent){
			var parameters = oEvent.getParameters();
			var removStartVal = "";
			if(parameters.mediaURL)
				removStartVal = parameters.mediaURL.split("(").pop();
			else
				removStartVal = parameters.url.split("(").pop();
		 	
		    var path = "AttachmentCollection(";
		    removStartVal = removStartVal.replace(/%27/g, "'");
		    this._renameFile((path + removStartVal).split("/")[0] , parameters.newFilename + parameters.parsedFileExtension);
		 },

		_renameFile: function(contextPath, attachmentName, forceRename){
			var eTagString = null;
	    	if(forceRename)
	    		eTagString = "*";
			
	    	var oModel = this.getView().getModel();
	    	var oAttachment = {};
	    	oAttachment.name = attachmentName;
	    	var url = contextPath;
	 
	    	var aBatchOperation = [];
	    	var oBatchOperation = oModel.createBatchOperation(url, "PUT", oAttachment, {sETag: eTagString});
	    	aBatchOperation.push(oBatchOperation);	  
	    	var that = this;
	    	cus.crm.mycontacts.util.Util.sendBatchChangeOperations(oModel, aBatchOperation, 
	    			function(){
	    		 		that._onAfterRename(contextPath);
	    	 		}, 
	    	 		function(oError){
	    	 			oError.newAttachmentName = attachmentName;
	    	 			that._onAfterRename(contextPath, oError);
	    	 		});
	    },
	    
	    _onAfterRename: function(contextPath, oError){
	 		if(oError){
	 			if(this["_onAfterSaveHandleErrorCode_"+oError.statusCode])
	 				this["_onAfterSaveHandleErrorCode_"+oError.statusCode](contextPath, oError);
	 			else{
	 				sap.m.MessageBox.alert(oError.message.value);
	 				this.oFileUpload.abandonPendingRenames();
	 			}
	 		}
	 		else{
	 			cus.crm.mycontacts.util.Util.getRefreshUIObject(this.getView().getModel(), "/"+contextPath).refresh();
	 			this.oFileUpload.commitPendingRenames();
	 		}
	 	},
	 	
	 	_onAfterSaveHandleErrorCode_412: function(contextPath, oError){
			var that = this;
			sap.m.MessageBox.show(cus.crm.mycontacts.util.Util.geti18NText("MSG_CONFLICTING_FILE_NAME"), {
			    title: cus.crm.mycontacts.util.Util.geti18NText("CONFIRM_TITLE"),
			    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			    onClose: function (confirmed) {
					if(confirmed == sap.m.MessageBox.Action.YES){
						that._renameFile(contextPath, oError.newAttachmentName, true);
					}
					else{
						that.oFileUpload.abandonPendingRenames();
						that._bindAttachments(that.getView().getModel(), that.getView().getBindingContext()); 
					}
				},
			});
		},
    
    onDeleteFile : function(oEvent){
    	var oModel = this.getView().getModel(); 
    	var parameters = oEvent.getParameters();
        var removStartVal = "";
        if (parameters.mediaURL)
        	removStartVal = parameters.mediaURL.split("(").pop();
        else
        	removStartVal = parameters.url.split("(").pop();
        	
        var path = "AttachmentCollection(";

        var url = path + removStartVal ;

        var aBatchOperation = [];
		var oBatchOperation = oModel.createBatchOperation(url, "DELETE", undefined, {sETag: "*"});
	    aBatchOperation.push(oBatchOperation);	
	    this._submitBatchOperation(aBatchOperation,  function(){this.oFileUpload.removeFile([parameters.fileId]);});

     },
     
     
    _submitBatchOperation: function(aBatchOperation, callbackSuccess, callbackError){
		var oModel = this.getView().getModel();
		oModel.clearBatch();
		oModel.addBatchChangeOperations(aBatchOperation);
		var that = this;
		oModel.submitBatch(
			jQuery.proxy(function (data) {
				var sErrorMessage = null;
				var aBatchResponse = data.__batchResponses;
				var responseObject = null;
				for (var i = 0; i < aBatchResponse.length; i++) {
					if (aBatchResponse[i].response) {
						sErrorMessage = jQuery.parseJSON(aBatchResponse[i].response.body).error.message.value;
					}
					if (aBatchResponse[i].__changeResponses &&
						aBatchResponse[i].__changeResponses.length > 0 && 
						aBatchResponse[i].__changeResponses[0].statusCode == 201){
						responseObject = aBatchResponse[i].__changeResponses[0].data;
					}
				}
				if (!sErrorMessage) {
					if (callbackSuccess)
						callbackSuccess.call(that, responseObject);
				}
				else {
					sap.m.MessageBox.alert(sErrorMessage);
					if (callbackError)
						callbackError.call(that);
				}

			}, this),
			true);
    	},


		/**
		 * gets the Xsrf token if it exists, if not, request it explicitly
		 */
		getXsrfToken:function () {
			var sToken = this.getView().getModel().getHeaders()['x-csrf-token'];
			if (!sToken) {

				this.getView().getModel().refreshSecurityToken(function (e, o) {
					sToken = o.headers['x-csrf-token'];
				}, function () {
					sap.ca.ui.message.showMessageBox({
						type:sap.ca.ui.message.Type.ERROR,
						message:'Could not get XSRF token',
						details:''
					});
				}, false);
			}
			return sToken;
		},

		/*
		 * handler for business card
		 */
		onShowBusinessCard:function () {
			var oModel = this.getView().getModel(),
				oContext = this.getView().getBindingContext(),
				sAccountId = oModel.getProperty("accountID", oContext),
				sContactId = oModel.getProperty("contactID", oContext),
				sPath = "/AccountCollection('" + sAccountId + "')",
				oAccount = oModel.getProperty(sPath),
				oDummy = new sap.m.Button(), oBinding, fnReceivedHandler;

			// Use dummy control to bind account data for business card
			oDummy.setModel(oModel);

			if (oAccount) {
				this.showBusinessCard(oAccount);
			} else {
				fnReceivedHandler = jQuery.proxy(function () {
					var oAccount = oModel.getProperty(sPath, null);
					if (oAccount) {
						this.showBusinessCard(oAccount);
					}

					// Use dummy control for unbinding
					// If this.byId("company") is used, then business closes after unbinding 
					oDummy.unbindElement();
					oBinding.detachDataReceived(fnReceivedHandler);
				}, this);
				oDummy.bindElement("/ContactCollection(contactID='" + sContactId + "',accountID='" + sAccountId + "')/Account", {
					expand:'MainAddress,MainContact,MainContact/WorkAddress,Logo'
				});
				oBinding = oDummy.getElementBinding();
				oBinding.attachDataReceived(fnReceivedHandler);
			}
		},

		showBusinessCard:function (oAccount) {
			var oModel, sPath, companyName, oMainAddress, oLogo, fnCallbackNavParaComp, oCompanyData, oControl, oCompanyLaunch, bcModel;

			oModel = this.getView().getModel();
			sPath = "/AccountCollection('" + oAccount.accountID + "')";
			oLogo = oModel.getProperty(sPath + "/Logo");
			fnCallbackNavParaComp = function () {
				// callback function for providing external navigation
				var oNavConfig = {};
				oNavConfig.target = {};
				oNavConfig.target.semanticObject = "Account";
				oNavConfig.target.action = "MyAccounts&/detail/AccountCollection('" + oAccount.accountID + "')";
				return oNavConfig;
			};
			companyName = oModel.getProperty(sPath + "/fullName");
			if (!companyName){
				companyName = oModel.getProperty(sPath + "/name1");	
			}			
			oMainAddress = oModel.getProperty(sPath + "/MainAddress");

			bcModel = new sap.ui.model.json.JSONModel();
			bcModel.setData(oMainAddress);

			this.resourceBundle = this.oApplicationFacade.getResourceBundle();

			oCompanyData = {
				popoverHeight:"22rem",
				title:this.resourceBundle.getText("CONTACT_ACCOUNT"),
				headerNoIcon:false,
				headerImgURL:cus.crm.mycontacts.formatter.ReleaseFormatter.logoUrlFormatter(oLogo),
				headerTitle:companyName,
				subViewName:"cus.crm.mycontacts.view.AccountBusinessCard",
				beforeExtNav:fnCallbackNavParaComp,
				oModel:bcModel
			};

			// get control that triggers the BusinessCard
			oControl = this.byId("company");

			// call 'Business Card' component. The use of Quickoverview is because CompanyLaunch cannot handle empty main contact data
			oCompanyLaunch = new sap.ca.ui.quickoverview.Quickoverview(oCompanyData);

			oCompanyLaunch.openBy(oControl);
		},

		getHeaderFooterOptions:function () {
			var that = this;
			return {

				buttonList:[
					{
						sI18nBtnTxt:"S3_EDIT",
						onBtnPressed:function () {
							var oParameter;
							if(that.fullScreenMode){
								oParameter = {
										contextPath:that.getView().getBindingContext().getPath().substr(1),
								};
								// edit a contact
								that.oRouter.navTo("edit", oParameter, false);	
							}
							else{
								oParameter = {
										editPath:that.getView().getBindingContext().getPath().substr(1),
										filter:that.sFilter,
										sort:that.sSort,
										isSearch:that.bIsSearch,
										search:that.sSearch,
										accountID:that.iAccountID,
										contactID:that.iContactID,
										itemCount:that.iItemCount
									};

								// edit a contact
								that.oRouter.navTo("subDetail", oParameter, true);	
							}
						}
					}
				],
				oAddBookmarkSettings:{
					icon:"sap-icon://Fiori2/F0004"
				},
				onBack: that._getBackFunction(),
			};
		},
		
		_getBackFunction: function(){
			if (this.fullScreenMode)
				return function(){window.history.back(1);};
			else
				return undefined;
		},
		
		onSelectTab:function (oEvent) {
			var oModel, oContext;
			oModel = oEvent.getSource().getModel();
			oContext = oEvent.getSource().getBindingContext();
			this._bindSelectedTab(oModel, oContext);
		},

		_bindSelectedTab:function (oModel, oContext) {
			switch (this.byId("iconTabBar").getSelectedKey()) {
				case "details":
					break;
				case "attachments":
					this._bindAttachments(oModel, oContext);
					break;
				case "notes":
					this._bindNotes(oContext);
					break;
			}

		},

		_bindAttachments:function (oModel, oContext) {
			var self = this; 
			var urlParams = oModel.sUrlParams;
			var oData2 = {Attachments:[]};

			// clear bound data		
			self.oFileUpload.setModel(new sap.ui.model.json.JSONModel(oData2));

			// set the upload URL for the current account
			if (self.oFileUpload.getUploadEnabled()) {
				self.oFileUpload.setUploadUrl(oContext.getModel().sServiceUrl + oContext.getPath() + '/Attachments' + (urlParams ? '?' + urlParams : ''));
			}	

			cus.crm.mycontacts.util.Util.readODataObjects(oContext, "Attachments", function (results) {
				// build json model
				jQuery.each(results, function (index, value) {
					oData2.Attachments.push(self.buildFileDescriptorObject(oModel.getProperty("/"+value)));
				});

				// bind json model to control
				self.oFileUpload.setModel(new sap.ui.model.json.JSONModel(oData2));
			});
		},

		_bindNotes:function (oContext) {
			var oTemplate, oModel;
			oTemplate = new sap.ca.ui.ExpansibleFeedListItem({
				type:sap.m.ListType.Inactive, // sap.m.ListType
				activeIcon:undefined, // sap.ui.core.URI
				sender:"{CRM_BUPA_ODATA_CREATE>creator}", // string
				text:"{CRM_BUPA_ODATA_CREATE>content}", // string
				timestamp:"{path:'CRM_BUPA_ODATA_CREATE>createdAt', type:'sap.ca.ui.model.type.DateTime', formatOptions : { style:'medium'}}", // string
				senderActive:false, // boolean
				iconActive:true, // boolean
				showIcon:false, // boolean
				maxLines:3
				// int
			});
			oModel = this.oConnectionManager.getModel("CRM_BUPA_ODATA_CREATE");
			this.byId("myNotes").reset();
			this.byId("myNotes").destroyAggregation("items");
			this.byId("myNotes").setBindingContext(oContext);
			this.byId("myNotes").bindAggregation("items", {
				path:"CRM_BUPA_ODATA_CREATE>" + oContext.getPath() + "/Notes",
				template:oTemplate

			});

			this.byId("myNotes").setModel(oModel);
		},

		_handleAddNote:function (oEvent) {
            var sText, oView, oModel, contactId = "", oNote, oContext, oNoteCreateError;
            // sText is the string you entered in the textarea.
            sText = oEvent.getParameter("value");
            
            //Trim text and do not create note if string is empty
            sText = jQuery.trim(sText);
            if(sText.length == 0){
                            return; 
            }
            
            oView = this.getView();
            oModel = oView.getModel("CRM_BUPA_ODATA_CREATE");
            oNote = {
                            "tdname":contactId, // must not be null, but
                            "tdid":"",
                            "tdspras":"",
                            "content":sText,
                            "createdAt":null, // must be null (or set)
                            "creator":""
            };

            oContext = oView.getBindingContext();
            oNoteCreateError = jQuery.proxy(function (oError) {
                            var sMessage;
                            if (oError.response) {
                                           sMessage = jQuery.parseJSON(oError.response.body).error.message.value;
                            }
                            sap.ca.ui.message.showMessageBox({
                                           type:sap.ca.ui.message.Type.ERROR,
                                           message:sMessage
                            });           
            }, this);
            oModel.forceNoCache(true);
            oModel.create("Notes", oNote, oContext, undefined, oNoteCreateError);
		},

		_getExpandForDataBinding: function(){
			var expandString='Photo';
			var aDependentRelations = this._getDependentRelations();
			for(var i in aDependentRelations){
				expandString = expandString + "," + aDependentRelations[i];
			}
			return expandString;
		},

		_getDependentRelations: function(){
			var oDependentRelations = ["WorkAddress"];
			var oDependentCustomRelations = [];
			/** * @ControllerHook extHookGetDependentCustomRelations
			 * The method extHookGetDependentCustomRelations should return an array 
			 * with additional navigation properties for the ContactCollection, which should be considered in the read process 
			 * @callback cus.crm.mycontacts.view.S3~extHookGetDependentCustomRelations
			 * @return {array} */
			if (this.extHookGetDependentCustomRelations)
				oDependentCustomRelations = this.extHookGetDependentCustomRelations();
			for(var i in oDependentCustomRelations){
				oDependentRelations.push(oDependentCustomRelations[i]);
			}

			return oDependentRelations;
		},
	});

}());
