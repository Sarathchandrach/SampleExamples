/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");
jQuery.sap.require("cus.crm.mycalendar.util.Conversions");
jQuery.sap.require("sap.ca.ui.model.format.FileSizeFormat");
jQuery.sap.require("sap.ca.ui.model.type.FileSize");
jQuery.sap.require("cus.crm.mycalendar.util.Util");

sap.ui.controller("cus.crm.mycalendar.view.Attachments", {

	onInit : function() {
	},

	refresh : function(sContextPath, attachments, mode) {
		var _uploadUrl = cus.crm.mycalendar.util.Conversions.uploadUrlConverter(sContextPath);
		var sUrlParams = this.getView().getModel().sUrlParams;
		
		var oAtt = this.byId('attachments');
		oAtt.setXsrfToken(this.getXsrfToken());
		oAtt.setEncodeUrl("/sap/bc/ui2/encode_file" + (sUrlParams ? '?' + sUrlParams : ''));
		var attTitle;
		
				var data = {
					AppointmentToAttachment : []
				};
				
				
			
				
				$.each(attachments.results, function(index, value) {
					var o = {
						name : value.RelativeUrl,
						size : value.FileSize,
						url : (value.UrlAttachment === "") ? cus.crm.mycalendar.util.Conversions.urlConverter(value.__metadata.media_src) : value.UrlAttachment , // value.__metadata.media_src, // value.Url,
						uploadedDate : value.UploadedDate, //cus.crm.mycalendar.util.Conversions.formatDateDay(value.UploadedDate), // value.UploadedDate, // cus.crm.mycontacts.formatter.ReleaseFormatter.dateFormatter(value.createdAt),
						contributor : value.CreatedBy, // value.Contributor,
						fileExtension : cus.crm.mycalendar.util.Conversions.mimeTypeConverter(value.Mimetype), // value.FileExtension,
						fileId : value.Id,
						media_src : value.__metadata.media_src
					};
					data.AppointmentToAttachment.push(o);
				});
				this.byId('attachments').setModel(new sap.ui.model.json.JSONModel(data));
				this.byId('attachments').setUploadUrl(_uploadUrl);
				this.getView().byId("attConti").setVisible(true);
				
				if(data.AppointmentToAttachment.length == 0){
					attTitle = cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.attachmentDataNumber", "0");
					if(!mode) {
						this.getView().byId("attConti").setVisible(false);
					}
				}
				else{
					attTitle = cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.attachmentDataNumber", data.AppointmentToAttachment.length);
				}

				if(mode)
					{   
						var attCntrl = this.byId('attachments');
						attCntrl.setUploadEnabled(true);  
						attCntrl.setRenameEnabled(true);  
						
					}
			//	if(this.byId('attachments').getEditMode() && !this.byId('attachments').getUploadEnabled()){
				//	this.byId('attachments').setUploadEnabled(true);
				//}
				if(sContextPath == "" && mode){
					this.byId('attachments').setUploadEnabled(false);
					this.byId('attachments').setShowNoData(false);
					attTitle = cus.crm.mycalendar.util.Util.geti18NText("view.Appointment.attachmentSaveRequest");
				}
				this.getView().byId("attTitle").setTitle(attTitle);

},
	

	 onUploadFile : function(oEventData) {
		 
		   //fetch etag
		 cus.crm.mycalendar.util.Util._fetchETag(this.getView().getBindingContext().getPath(),this.getView().getModel());
		 	var oData; // = oEventData.getParameters().d;
		 	if (oEventData.getParameters() && oEventData.getParameters().d) {
				oData = oEventData.getParameters().d;
			} else {
				oData = oEventData.getParameters();
			}
		 	this.value=oData;
		 	var oFile = this.buildFileDescriptorObject(oData);
			this.byId('attachments').commitFileUpload(oFile);
			
			this.countAttachments("1");
			this.byId('attachments').setRenameEnabled(true);
			
		},
	    
	 buildFileDescriptorObject : function(value) {
			
			var oFile = {
				name : value.Filename,
				size : value.FileSize,
				url : cus.crm.mycalendar.util.Conversions.urlConverter(value.__metadata.media_src), //value.url
				uploadedDate : value.UploadedDate, //cus.crm.mycontacts.formatter.ReleaseFormatter.dateFormatter(value.createdAt),
				contributor : value.Contributor,
				fileExtension : value.FileExtension, //cus.crm.mycontacts.formatter.ReleaseFormatter.mimeTypeFormatter(value.mimeType),
				fileId : value.Id,
				xsrfToken : this.getView().getModel().refreshSecurityToken()
			};
		
			return oFile;
		},
		
		onBeforeUploadFile : function(oEventData) {
			//var AppSet = this.byId("attachments").mProperties.uploadUrl;
			var AppSet = this.byId("attachments").getProperty("uploadUrl");
			var AppSetSplit = AppSet.split("'");
			AppSet = oEventData.getParameter("name") + ";" + "AppointmentMain" + ";" + AppSetSplit[1].replace(/-/g, "");
			this.byId("attachments").setCustomHeader("slug", AppSet);
		},
		



		onRenameFile : function(oEventData) {

					var that = this;
					var oModel = this.getView().getModel();
					//No infinite loop on adding a new attachment
					var url = oEventData.getParameter("media_src");
					var value=1;
					if(!url){
						
						var url1=this.value.DocId;
						url=url1.split('/').join('%2F');
						value=0;
						
					}
					var AppSetSplit = url.split("'");
					var docId = AppSetSplit[value];
					var AppSet ;
					docId = docId.split('%2F').join('/');

					var oEntry = {
						RelativeUrl : oEventData.getParameter("newFilename"),
						Description : oEventData.getParameter("newFilename"),
						DocId : docId
					};

					AppSet = "/AttachmentSet('" + AppSetSplit[value] + "')";
					oModel.update(AppSet, oEntry, null, function(oData,
							response) {
						//fetch etag
						 cus.crm.mycalendar.util.Util._fetchETag(that.getView().getBindingContext().getPath(),that.getView().getModel());
						
					}, function(oMessage) {
						
						  
						that.displayResponseErrorMessage(oMessage,
								sap.ca.scfld.md.app.Application.getImpl()
										.getResourceBundle().getText(
												'SAVE_FAILED'));

					});
				},


		onSaveClicked : function() {
		      //save to server here and determine success
	
	  var success = true;
		 
		      var fileUploadControl = this.byId("attachments");
		 
		      if (success) {
		         fileUploadControl.commitPendingRenames();
		      } else {
		         fileUploadControl.abandonPendingRenames();
		      }
		  },
		
		onDeleteFile : function(oEventData) {
			var AppSet;
			this.byId("attachments").removeFile(
					oEventData.getParameters().fileId);
			var oModel = this.getView().getModel();
			var aBatchOp = [];
			if(oEventData.getParameters().media_src)
			{
			 AppSet = oEventData.getParameters().media_src;
			}
			else{
			 AppSet = oEventData.getParameters().url;
			}
			var AppSetSplit = AppSet.split("'");
			AppSet = "/AttachmentSet('" + AppSetSplit[1] + "')";
			var attachBatchOp = oModel.createBatchOperation(AppSet,
					"DELETE");
			aBatchOp.push(attachBatchOp);
			oModel.addBatchChangeOperations(aBatchOp);
			oModel.submitBatch(
					jQuery.proxy(this.successSave, this), jQuery
							.proxy(this.errorSave, this));			

			this.countAttachments("0");
		},

		displayResponseErrorMessage : function(oMessage,
				sDefaultMessage) {
			var sMessage;
			if (oMessage.response) {
				sMessage = jQuery.parseJSON(oMessage.response.body).error.message.value;
			} else
				sMessage = sDefaultMessage;
			sap.ca.ui.message.showMessageBox({
				type : sap.ca.ui.message.Type.ERROR,
				message : sMessage,
			});
		},
		getXsrfToken: function() {
			var sToken = this.getView().getModel().getHeaders()['x-csrf-token'];
			if (!sToken) {
				
				this.getView().getModel().refreshSecurityToken( 
					function(e, o) {					
						sToken = o.headers['x-csrf-token'];					
					}, 
					function() {
						throw new Error('could not refresh XSRF token');
					}, 
					false);
			}	
			return sToken;
		},
		
//      Interim Solution of countAttachments		
		countAttachments : function(value) {
			var that = this;
			var attTitleM = that.byId("attTitle").getTitle();
			var attTitleB = attTitleM.split("(");
			attTitleB = attTitleB[1].split(")");
			attTitleM = attTitleB[0];
			if (value == "0") {
				attTitleM = Number(attTitleM) - 1;
			}
			else {
				attTitleM = Number(attTitleM) + 1;
			}
			if(isNaN(attTitleM)){

			}
			else {
				var attTitle = cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.attachmentDataNumber", attTitleM);
				if(attTitleM === 0){
					attTitle = cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.attachmentDataNumber", "0");
				}
				that.byId("attTitle").setTitle(attTitle);
				that.byId('attachments').setRenameEnabled(false);
			}
		},
		successSave : function(aResponses){
			//fetch etag
			 cus.crm.mycalendar.util.Util._fetchETag(this.getView().getBindingContext().getPath(),this.getView().getModel());

		}
		
});
