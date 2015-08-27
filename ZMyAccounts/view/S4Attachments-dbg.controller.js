/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("cus.crm.myaccounts.util.formatter");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("cus.crm.myaccounts.view.S4Attachments", {

	onInit : function() {
		this.oRouter.attachRouteMatched(this.handleNavTo, this);

	},
	handleNavTo : function(oEvent){
		if (oEvent.getParameter("name") === "AccountAttachments") {	
			var oView = this.getView();
			var contextPath = oEvent.getParameter("arguments").contextPath;
//          Unused variable
//			var oPage = this.byId("page");
    		var oModel = this.getView().getModel();
    		var sPath = '/' + oEvent.getParameter("arguments").contextPath;
    		var context = new sap.ui.model.Context(oModel, '/' + oEvent.getParameter("arguments").contextPath);
    		var fnBindViewContext = function(){
    			oView.setBindingContext(context);
    		}
    		oModel.createBindingContext(sPath, "", {expand: 'Attachments'},fnBindViewContext,true);

			var oModel = this.getView().getModel();
			var that=this;

			if (oModel instanceof sap.ui.model.odata.ODataModel){
				oModel.read(contextPath+"/Attachments", null, null, true, function(oData, oResponse){   
					var attachments= JSON.parse(JSON.stringify(oData));
					var data = { Attachments : [] };
					$.each( attachments.results, function(index, value) 
							{
						var o = {name : value.name,
								size : value.fileSize,
								url : cus.crm.myaccounts.util.formatter.urlFormatter(value.__metadata.media_src),
								uploadedDate :value.createdAt,
								contributor : value.createdBy,
								fileExtension : cus.crm.myaccounts.util.formatter.mimeTypeFormatter(value.mimeType),
								fileId : value.documentId
						};
						data.Attachments.push(o);								
							}
					);
					that.byId('fileupload').setModel(new sap.ui.model.json.JSONModel(data));

				});
			}
		}

	},
	handleNavBack: function(oEvent){
		window.history.back();
	},

	_refresh : function(channelId, eventId, data) {

		var that = this;

		if (data && data.context) {

			this.getView().setBindingContext(data.context);

			var oModel = this.getView().getModel();			
			if (oModel instanceof sap.ui.model.odata.ODataModel){
				oModel.read(data.context.getPath()+"/Attachments", null, null, true, function(oData, oResponse){   
					var attachments= JSON.parse(JSON.stringify(oData));
					var data = { Attachments : [] };
					$.each( attachments.results, function(index, value) 
							{
						var o = {name : value.name,
								size : value.fileSize,
								url : cus.crm.myaccounts.util.formatter.getRelativePathFromURL(value.__metadata.media_src),
								uploadedDate : cus.crm.mycontacts.formatter.ReleaseFormatter.dateFormatter(value.createdAt),
								contributor : value.createdBy,
								fileExtension : cus.crm.mycontacts.formatter.ReleaseFormatter.mimeTypeFormatter(value.mimeType),
								fileId : value.documentId
						};
						data.Attachments.push(o);								
							}
					);
					that.byId('fileupload').setModel(new sap.ui.model.json.JSONModel(data));
				});
			}
		}

	},

});
