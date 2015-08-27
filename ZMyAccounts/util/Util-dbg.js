/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.myaccounts.util.Util");
jQuery.sap.require("sap.ca.ui.quickoverview.Quickoverview");

cus.crm.myaccounts.util.Util = {


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

	geti18NText1 : function(key, replace) {
		if (this.geti18NResourceBundle()) {
			return this.geti18NResourceBundle().getText(key, replace);
		} else {
			return null ;
		}
	},
	
	openQuickoverview : function(
			popoverTitle, title, subtitle, imageURL,
			oContextPerson, pathToPerson, pathToPersonDependentObject,
			oContextCompany, pathToCompany,
			triggeringObject){
		
		// Set path and model for retrieving data of person 
		var contextPathPerson = oContextPerson.getPath();
		var oModelPerson = oContextPerson.getModel();
		
		// Set path and model for retrieving data of company
		var contextPathCompany = oContextCompany.getPath();
		var oModelCompany = oContextCompany.getModel();
		
		// Collect all data for business card in one model
		var oModelData = {};
		oModelData.Company = {};
		oModelData.Company.Address = oModelCompany.getProperty(contextPathCompany+"/"+pathToCompany);
		oModelData.Company.name = cus.crm.myaccounts.util.formatter.AccountNameFormatter( oModelCompany.getProperty(contextPathCompany).fullName, oModelCompany.getProperty(contextPathCompany).name1);
		oModelData.Person = oModelPerson.getProperty(contextPathPerson+ "/"+pathToPerson);
		var personDependentObject = "";
		if(oModelData.Person && pathToPersonDependentObject) {
			personDependentObject = oModelPerson.getProperty(contextPathPerson+ "/"+pathToPerson+"/"+pathToPersonDependentObject);
			oModelData.Person.Address = personDependentObject;
		}
		
		// Set the model used for the business card
		var oBusinessCardModel = new sap.ui.model.json.JSONModel();
		oBusinessCardModel.setData(oModelData);
		
		// Determine the icon of the header in the business card
		var isNoHeaderIcon, headerImgURL;
		if(imageURL){
			isNoHeaderIcon = false;
			headerImgURL = imageURL;
		}
		else{
			isNoHeaderIcon = true;
			headerImgURL = "";
		}
		
		// Use the quickoverview control for displaying the business card
		var oBusinessCardDefinition = {
				popoverHeight:"32rem",
				title:popoverTitle,
				headerNoIcon:isNoHeaderIcon,
				headerImgURL:headerImgURL,
				headerTitle:title,
				headerSubTitle:subtitle,
				subViewName:"cus.crm.myaccounts.view.overview.Quickoverview",
				oModel:oBusinessCardModel
			};
		var oBusinessCard = new sap.ca.ui.quickoverview.Quickoverview(oBusinessCardDefinition);
		oBusinessCard.openBy(triggeringObject);
		
		// Check whether any data of the person is missing and has to be read from odata model
		if(!oModelData.Person || !personDependentObject){
			oModelPerson.read(pathToPerson, oContextPerson, ["$expand="+pathToPersonDependentObject], true,
				function(oData, oResponse){	
					var oPerson = jQuery.parseJSON(JSON.stringify(oData));
					oModelData.Person = oPerson;
					oModelData.Person.Address = oPerson[pathToPersonDependentObject];
					var form = sap.ui.getCore().byId("cus.crm.myaccounts.view.overview.Quickoverview").byId("quickOverviewForm1");
					var item;
					for(var i in form.getContent()){
						item = sap.ui.getCore().byId(form.getContent()[i].getId());
						var textBinding = item.getBindingInfo("text");
						if (textBinding)
							textBinding.binding.refresh();
					}
				},
				function(oError){
					jQuery.sap.log.error("Read failed in Util.js:"+oError.response.body);
				}
			);
		}
		// Check whether any data of the company is missing and has to be read from odata model
		if(!oModelData.Company.Address){
			this.readODataObject(oContextCompany, pathToCompany, function(){});
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

    		if (response.getSource().aKeys.length > 0)
    			oContextObject[relationshipName] = {__list: response.getSource().aKeys};
    		else
    			oContextObject[relationshipName] = null;
    
    		oBinding.detachDataReceived(fnReceivedHandler);
    		oList.destroy();
    		
    		callbackFunction(oContext.getModel().getProperty(oContext.sPath+"/"+relationshipName));
    		
    	}, this);
    	
    	oBinding.attachDataReceived(fnReceivedHandler);
	},
	
	readODataObject: function(oContext, relationshipName, callbackFunction, forceRead){
		
		var oContextObject = oContext.getModel().getProperty(oContext.sPath);
		
		if (oContext.getModel().getProperty(oContext.sPath+"/"+relationshipName) && !forceRead){
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
    		
    	}, this);
    	
    	oBinding.attachDataReceived(fnReceivedHandler);
	},

	getRefreshUIObject: function(oModel, contextPath, expand){
		
		if(!this.refreshList)
			this.refreshList = new sap.m.List();
		var oList = this.refreshList;
		
		if(expand)
			oList.bindElement(contextPath, {expand: expand});
		else
			oList.bindElement(contextPath);
		
		oList.setModel(oModel);
		var oBinding = oList.getElementBinding();
		
		var fnCleanUp = null;
		fnCleanUp = jQuery.proxy(function (response) {
			if(oBinding)
				oBinding.detachDataRequested(fnCleanUp);
			oBinding = null;
		}, this);
		oBinding.attachDataRequested(fnCleanUp);
		
		var oRefreshObject = {
			refresh: function(){
				if(oBinding)
					oBinding.refresh();
			},
			destroy: function(){
				fnCleanUp();
			},
		};
		
		return oRefreshObject;
	},
	
	getServiceSchemaVersion: function(oModel, entityType){
		var version = 0;
		var oEntityModel = oModel.oMetadata._getEntityTypeByPath(entityType);
		for(var i in oEntityModel.extensions){
			if(oEntityModel.extensions[i].name == "service-schema-version")
				version = oEntityModel.extensions[i].value;
		}
		return version;
	}

};
