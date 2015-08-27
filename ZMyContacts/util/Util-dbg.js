/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mycontacts.util.Util");

cus.crm.mycontacts.util.Util = {
		
	setApplicationFacade : function(oApplicationFacade) {
		this.oApplicationFacade = oApplicationFacade;
	},

	geti18NResourceBundle : function() {
		if (this.oApplicationFacade) {
			return this.oApplicationFacade.getResourceBundle();
		} else {
			return null ;
		}
	},

	geti18NText : function(key) {
		if (this.geti18NResourceBundle()) {
			return this.geti18NResourceBundle().getText(key);
		} else {
			return null ;
		}
	},

	readODataObjects: function(oContext, relationshipName, callbackFunction){

		var oContextObject = oContext.getModel().getProperty(oContext.sPath);

		if (oContext.getModel().getProperty(oContext.sPath+"/"+relationshipName)){
			callbackFunction(oContext.getModel().getProperty(oContext.sPath+"/"+relationshipName));
			return;
		}

		var oItemTemplate = new sap.m.StandardListItem({text:""});
    	var oList = new sap.m.List({
    	    items: {
    			path: relationshipName,
    			template: oItemTemplate
    		}
    	});
    	oList.setModel(oContext.getModel());
    	oList.setBindingContext(oContext);

    	var oBinding = oList.getBinding("items");
    	var fnReceivedHandler = null;
    	fnReceivedHandler = jQuery.proxy(function (response) {

//    		if (response.getSource().aKeys.length > 0)
//    			oContextObject[relationshipName] = {__list: response.getSource().aKeys};
//    		else
//    			oContextObject[relationshipName] = null;

    		oBinding.detachDataReceived(fnReceivedHandler);
    		oList.destroy();

    		callbackFunction(response.getSource().aKeys);

//    		oContextObject[relationshipName] = null;

    	}, this);

    	oBinding.attachDataReceived(fnReceivedHandler);
	},

	readODataObject: function(oContext, relationshipName, callbackFunction){

		var oContextObject = oContext.getModel().getProperty(oContext.sPath);

		if (oContext.getModel().getProperty(oContext.sPath+"/"+relationshipName)){
			callbackFunction(oContext.getModel().getProperty(oContext.sPath+"/"+relationshipName));
			return;
		}

    	var oLabel = new sap.m.List();
    	oLabel.bindElement(oContext.sPath + "/" + relationshipName);

    	oLabel.setModel(oContext.getModel());
    	oLabel.setBindingContext(oContext);

    	var oBinding = oLabel.getElementBinding();
    	var fnReceivedHandler = null;
    	fnReceivedHandler = jQuery.proxy(function (response) {

    		if (response.getSource().getBoundContext())
    			oContextObject[relationshipName] = {__ref: response.getSource().getBoundContext().sPath.substr(1)};
    		else
    			oContextObject[relationshipName] = null;

    		oBinding.detachDataReceived(fnReceivedHandler);
    		oLabel.destroy();

    		callbackFunction(oContext.getModel().getProperty(oContext.sPath+"/"+relationshipName));

    		oContextObject[relationshipName] = null;

    	}, this);

    	oBinding.attachDataReceived(fnReceivedHandler);
	},
	
	getRefreshUIObject: function(oModel, contextPath, expand) {

		if(!this.refreshList)
			this.refreshList = new sap.m.List();
		else{
			this.refreshList.unbindElement();
			this.refreshList.setModel(null);
		}

		var oList = this.refreshList;

		if(expand)
			oList.bindElement(contextPath, {expand: expand});
		else
			oList.bindElement(contextPath);

		oList.setModel(oModel);
		var oBinding = oList.getElementBinding();

		var oRefreshObject = {
			refresh: function(fnDataReceived){
				if(fnDataReceived)
					oBinding.attachDataReceived(fnDataReceived);
				if(oBinding)
					oBinding.refresh();
			},
			destroy: function(){
				oBinding = null;
			},
		};

		return oRefreshObject;
	},

	sendBatchReadOperations: function(oModel, aRequestURLs, callbackFunction){
		oModel.clearBatch();
		for(var i in aRequestURLs){
			var oReadOp = oModel.createBatchOperation(aRequestURLs[i], "GET");
			oModel.addBatchReadOperations([oReadOp]);
		}
				
		oModel.submitBatch(
				function(data){
					var oError = null;
					var aBatchResponse = data.__batchResponses;
					var responseObjects = {};
					for (var i = 0; i < aBatchResponse.length; i++) {
						
						if(aBatchResponse[i].statusCode == "200"){
							if(aBatchResponse[i].data.__metadata)
								responseObjects[aBatchResponse[i].data.__metadata.type] = aBatchResponse[i].data.results;
							else 
                                responseObjects[aBatchResponse[i].data[Object.keys(aBatchResponse[i].data)[0]][0].__metadata.type] = aBatchResponse[i].data[Object.keys(aBatchResponse[i].data)[0]];

							
						}
						else{
							var oResponse = jQuery.parseJSON(aBatchResponse[i].response.body);
							oError = {
									type : sap.ca.ui.message.Type.ERROR,
									message : oResponse.error.message.value,
									details : oResponse.error.innererror.Error_Resolution.SAP_Note
									};
						}
					}
					if (oError) {
						sap.ca.ui.message.showMessageBox(oError);
					}
					else {
						callbackFunction(responseObjects);
					}
				}, 
				function(data){
					jQuery.sap.log.error("Read failed in Util.js->sendBatchReadOperations");
				}, true);		
	},
	
	sendBatchChangeOperations: function(oModel, aBatchOperation, callbackSuccess, callbackError){
		oModel.clearBatch();
		oModel.addBatchChangeOperations(aBatchOperation);
		var that = this;
		oModel.submitBatch(
			jQuery.proxy(function (data) {
				var oError = {};
				var aBatchResponse = data.__batchResponses;
				var responseObject = null;
				for (var i = 0; i < aBatchResponse.length; i++) {
					if (aBatchResponse[i].response) {
						oError = jQuery.parseJSON(aBatchResponse[i].response.body).error;
						oError.statusCode = aBatchResponse[i].response.statusCode;
						oError.statusText = aBatchResponse[i].response.statusText;
					}
					if (aBatchResponse[i].__changeResponses &&
						aBatchResponse[i].__changeResponses.length > 0 && 
						aBatchResponse[i].__changeResponses[0].statusCode == 201){
						responseObject = aBatchResponse[i].__changeResponses[0].data;
					}
				}
				if (!oError.message) {
					if (callbackSuccess)
						callbackSuccess.call(that, responseObject);
				}
				else {
					if (callbackError)
						callbackError.call(that, oError);
					else
						sap.m.MessageBox.alert(oError.message.value);
				}

			}, this),
			true);
	},
};
