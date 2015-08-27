/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("cus.crm.myaccounts.util.Util");
jQuery.sap.require("cus.crm.myaccounts.util.formatter");
jQuery.sap.require("cus.crm.myaccounts.util.Constants");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.m.MessageBox");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("cus.crm.myaccounts.view.maintain.GeneralDataEdit", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.maintain.GeneralDataEdit
*/
	onInit: function() {
		this.editMode = true;
		this.oDataModel = null;
		this.valueHelpCountry = null;
		this.valueHelpRegion = null;
		this.countryIDUsedForRegion = undefined;
		this.countryIDUsedForRegionSuggestion = undefined;
		this.customizingModel = new sap.ui.model.json.JSONModel({TitleCustomizing: [], AcademicTitleCustomizing: []});
		this.getView().setModel(this.customizingModel, "Customizing");
		
		if(!this.oDataModel)
			this.oDataModel = this.getView().getModel();
		
		var constants = new sap.ui.model.json.JSONModel(cus.crm.myaccounts.util.Constants);
		this.getView().setModel(constants, "constants");	
		this._readCustomizing();
		
		this.oRouter.attachRouteMatched(function (oEvent) {
			if (oEvent.getParameter("name") === "edit") {
				this.editMode = true;
				this._cleanUp();
				var oArguments = oEvent.getParameter("arguments");
				var oModel = this.oDataModel;
				this.getView().setModel(oModel);
				var contextPath = "/"+oArguments.contextPath;
				var oContext = oModel.getContext(contextPath);
				this.getView().setBindingContext(oContext);
				var that = this;
				if(!oContext.getObject()){ //if context has no account object (if the view has been called directly with a link)
					oModel.createBindingContext(contextPath, "", {
						expand : this._getExpandForDataBinding()}, 
						function() {
							var oContext = that.getView().getBindingContext();
							var oModel = that.getView().getModel();
							var countryID = oModel.getProperty(oContext.sPath+"/MainAddress/countryID");
							if (countryID && countryID != "")
								that._setAddressFieldsEnabled(true);
							else
								that._setAddressFieldsEnabled(false);
						}, 
						true); 
				}
				else{
					this._toggleAddressFields();
				}
			}
			if (oEvent.getParameter("name") === "new") {
				this.editMode = false;
				this._cleanUp();
				var accountCategory = oEvent.getParameter("arguments").accountCategory;
				if( accountCategory != cus.crm.myaccounts.util.Constants.accountCategoryPerson && accountCategory != cus.crm.myaccounts.util.Constants.accountCategoryCompany && accountCategory != cus.crm.myaccounts.util.Constants.accountCategoryGroup)
					accountCategory = cus.crm.myaccounts.util.Constants.accountCategoryCompany;
				this._setEmptyScreen(accountCategory);
				this._toggleAddressFields();
			}
		}, this);
	},
	
	_setEmptyScreen: function(accountCategory){
		var oAccountTemplate = this._getTemplateForAccount(accountCategory);
		
		var aDependentRelations = this._getDependentRelations();
		for(var i in aDependentRelations){
			oAccountTemplate[aDependentRelations[i]] = this._getTemplateForDependentObject(aDependentRelations[i]);
		}
		
		var oNewAccountModel = new sap.ui.model.json.JSONModel({NewAccount: oAccountTemplate});
		oNewAccountModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay); //to be similar to oData model
		this.getView().setModel(oNewAccountModel);
		this.getView().setBindingContext(oNewAccountModel.getContext("/NewAccount"));
	},
	
	_getExpandForDataBinding: function(){
		var expandString='Logo';
		var aDependentRelations = this._getDependentRelations();
		for(var i in aDependentRelations){
			expandString = expandString + "," + aDependentRelations[i];
		}
		return expandString;
	},
	
	_getDependentRelations: function(){
		var oDependentRelations = ["MainAddress"];
		var oDependentCustomRelations = [];
		if (this.extHookGetDependentCustomRelations)
			/** * @ControllerHook extHookGetDependentCustomRelations * 
			 * The method extHookGetDependentCustomRelations should return an array with dependent relations to the AccountCollection, which should be considered in the create/update process * 
			 * @callback cus.crm.myaccounts.view.maintain.GeneralDataEdit~extHookGetDependentCustomRelations *
			 * @return {array} */
			oDependentCustomRelations = this.extHookGetDependentCustomRelations();
		for(var i in oDependentCustomRelations){
			oDependentRelations.push(oDependentCustomRelations[i]);
		}
			
		return oDependentRelations;
	},

	_getTemplateForAccount: function(accountCategory){
		var oAccountTemplate = this._generateTemplateUsingMetadata("AccountCollection");
		oAccountTemplate.isMyAccount = true;
		oAccountTemplate.category = accountCategory;
		if(oAccountTemplate.birthDate == "")
			oAccountTemplate.birthDate = null;
		return oAccountTemplate;
	},
	
	_getTemplateForDependentObject: function(relationName){
		switch (relationName) {
			default:
				return this._generateTemplateUsingMetadata("AccountCollection/"+relationName);
				break;
		}
	},
	
	_generateTemplateUsingMetadata: function(path){
		var oEntityMetadata = this.oDataModel.oMetadata._getEntityTypeByPath(path);
		var oTemplate={};
		for(var i in oEntityMetadata.property){
			oTemplate[oEntityMetadata.property[i].name] = "";
		}
		return oTemplate;
	},
	
	_objectKeyIsInitial: function(object, path){
		var oEntityMetadata = this.oDataModel.oMetadata._getEntityTypeByPath(path);
		for(var i in oEntityMetadata.key.propertyRef)
			if(object[oEntityMetadata.key.propertyRef[i].name] != "")
				return false;
		
		return true;
	},
	
	_fillNewObject: function(sourceObject, targetObject, fieldPrefix, fragmentName){
		
		var changesExist = false;
		var inputFieldId = "";
		for (var key in sourceObject) {
			
			if(fragmentName)
				inputFieldId = this.getView().getId()+"--"+fragmentName+"--"+fieldPrefix+key+"Input";
			else
				inputFieldId = this.getView().getId()+"--"+fieldPrefix+key+"Input";
			
			if(typeof sourceObject[key] != "object" || key == "birthDate")
				targetObject[key] = sourceObject[key];
			
			var oInputField = this.byId(inputFieldId);
			if (oInputField){
				var newValue = "";
				if(oInputField.getDateValue){	//special logic for dates
					newValue = oInputField.getValue();
					if(newValue == ""){
						newValue = null;
					}
					else{
						var oNewDate = new Date();
						var dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({style : "long"});
						var oDate = dateFormatter.parse(newValue);
						if(!oDate){
							dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({style : "short"});
							oDate = dateFormatter.parse(newValue);
						}
						if(!oDate){
							dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({style : "medium"});
							oDate = dateFormatter.parse(newValue);
						}
						if(oDate){
							oNewDate.setUTCFullYear(oDate.getFullYear());
							oNewDate.setUTCDate(oDate.getDate());
							oNewDate.setUTCMonth(oDate.getMonth());
							oNewDate.setUTCHours(0);
							oNewDate.setUTCMinutes(0);
							oNewDate.setUTCSeconds(0);
							oNewDate.setUTCMilliseconds(0);
							newValue = oNewDate;
						}
						else{
							newValue = null;
						}
					}
				}
					
				else if (oInputField.getSelectedKey)
					newValue = oInputField.getSelectedKey();
				else if (oInputField.getValue) 
					newValue = oInputField.getValue();
				if(targetObject[key] != newValue){
					changesExist = true;
					targetObject[key] = newValue;
				}
			}		
		}
		return changesExist;
	},

	_onAfterSave: function(responseObject){
		this._setBusy(false);
		if (this.editMode)
			window.history.back();
		else
			this.oRouter.navTo("detail", {
			    contextPath : "AccountCollection('"+responseObject.accountID+"')"
			}, true);
	},

	onSaveButtonPressed: function(oEvent){
		if(!this._checkSavePossible())
			return;
		
		this._setBusy(true);
		var oModel = this.getView().getModel();
		var oAccountContext = this.getView().getBindingContext();
		var oAccount = oAccountContext.getObject();
		var oNewAccount = {};
		
		var changesInAccount=false, changesInAccountSpecificFields=false, changesForDependentRelations=false;
		
		changesInAccount = this._fillNewObject(oAccount, oNewAccount, "");
		if(oAccount.category == cus.crm.myaccounts.util.Constants.accountCategoryPerson)
			changesInAccountSpecificFields = this._fillNewObject(oNewAccount, oNewAccount, "", "personFragment");
		if(oAccount.category != cus.crm.myaccounts.util.Constants.accountCategoryPerson)
			changesInAccountSpecificFields = this._fillNewObject(oNewAccount, oNewAccount, "", "companyFragment");
		if(changesInAccountSpecificFields)
			changesInAccount = changesInAccountSpecificFields;
		
		changesForDependentRelations = this._changesForDependentRelationsExists();
		
		if(!changesInAccount && !changesForDependentRelations)
			return;	
		
		var oBatchOperation, sRequestURL;
		var aBatchOperation = [];
		
		if(this.editMode){
			
			if (changesInAccount) {
				sRequestURL = oAccountContext.sPath;
				oBatchOperation = oModel.createBatchOperation(sRequestURL, "PUT", oNewAccount);
				aBatchOperation.push(oBatchOperation);
			}

			if(changesForDependentRelations) {
				this._createBatchOperationForDependentRelations(aBatchOperation);
			}
			
			var oRefreshUIObject = cus.crm.myaccounts.util.Util.getRefreshUIObject(oModel, oAccountContext.sPath, this._getExpandForDataBinding());
			this._submitBatchOperation(aBatchOperation, function(){ oRefreshUIObject.refresh(); this._onAfterSave();}, function(){ oRefreshUIObject.destroy(); this._setBusy(false);});
			
		}
		else {
	
			sRequestURL = "/AccountCollection";
			oBatchOperation = this.oDataModel.createBatchOperation(sRequestURL, "POST", oNewAccount);
			
			if(changesForDependentRelations) {
				this._adaptAccountWithDependentRelationsBeforeCreate(oNewAccount);
			}
			
			aBatchOperation.push(oBatchOperation);
			this._submitBatchOperation(aBatchOperation, this._onAfterSave, function(){this._setBusy(false);});
		}
	},
	
	_adaptAccountWithDependentRelationsBeforeCreate: function(oNewAccount){
		
		var aDependentRelations = this._getDependentRelations();
		for(var i in aDependentRelations){
			var oDependentObject = this._getTemplateForDependentObject(aDependentRelations[i]);
			var oNewDependentObject = {};
			var changesInDependentObject = this._fillNewObject(oDependentObject, oNewDependentObject, aDependentRelations[i]+".");
			if(changesInDependentObject)
				oNewAccount[aDependentRelations[i]] = oNewDependentObject;
		}	
	},
	
	_createBatchOperationForDependentRelations: function(aBatchOperation){
		var oModel = this.getView().getModel();
		var oAccountContext = this.getView().getBindingContext();
		var oAccount = oAccountContext.getObject();
		
		
		var aDependentRelations = this._getDependentRelations();
		for(var i in aDependentRelations){
			var oDependentObject = oModel.getProperty(oAccountContext+"/"+aDependentRelations[i]);
			var oDependentObjectContext = null;
			if (oDependentObject)
				oDependentObjectContext = oModel.getContext("/"+oAccount[aDependentRelations[i]]["__ref"]); 
			var oNewDependentObject = {};
			
			var changesInDependentObject=false;
			
			var dependentObjectToBeCreated = false;
			if(!oDependentObject || this._objectKeyIsInitial(oDependentObject, "AccountCollection/"+aDependentRelations[i])){	//odata contains initial address with no keys -> only if user comes from search result list
				dependentObjectToBeCreated = true;
				oDependentObject = this._getTemplateForDependentObject(aDependentRelations[i]);
				if(oDependentObject.accountID != null && oDependentObject.accountID != undefined)
					oDependentObject.accountID = oAccount.accountID;
			}
			changesInDependentObject = this._fillNewObject(oDependentObject, oNewDependentObject, aDependentRelations[i]+".");
			
			var oBatchOperation, requestURL;
			if(changesInDependentObject){
				var httpMethod;
				if(dependentObjectToBeCreated){
					httpMethod = "POST";
					var oEntityMetadata = this.oDataModel.oMetadata._getEntityTypeByPath("AccountCollection/"+aDependentRelations[i]);
					requestURL = oEntityMetadata.name+"Collection";
				}
				else{
					httpMethod = "PUT";
					requestURL = oDependentObjectContext.sPath;
				}
				oBatchOperation = oModel.createBatchOperation(requestURL, httpMethod, oNewDependentObject);
				aBatchOperation.push(oBatchOperation);
			}			
		}
	},
	
	_changesForDependentRelationsExists: function(){
		var oModel = this.oDataModel;
		var oAccountContext = this.getView().getBindingContext();
		var changesInDependentObject = false;
		var aDependentRelations = this._getDependentRelations();
		for(var i in aDependentRelations){
			var oDependentObject = oModel.getProperty(oAccountContext+"/"+aDependentRelations[i]);
			if(!oDependentObject)
				oDependentObject = this._getTemplateForDependentObject(aDependentRelations[i]);
			var oNewDependentObject = {};
			changesInDependentObject = this._fillNewObject(oDependentObject, oNewDependentObject, aDependentRelations[i]+".");
			if(changesInDependentObject)
				return changesInDependentObject;
		}

		return changesInDependentObject;
	},
	
	
	_submitBatchOperation: function(aBatchOperation, callbackSuccess, callbackError){
		var oModel = this.oDataModel;
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
					if(this.editMode)
						sap.m.MessageToast.show(cus.crm.myaccounts.util.Util.geti18NText("MSG_UPDATE_SUCCESS"));
					else
						sap.m.MessageToast.show(cus.crm.myaccounts.util.Util.geti18NText("MSG_CREATION_SUCCESS"));
					if (callbackSuccess)
						callbackSuccess.call(that, responseObject);
				}
				else {
					sap.m.MessageBox.alert(sErrorMessage);
					if (callbackError)
						callbackError.call(that);
				}

			}, this),
			jQuery.proxy(function () {
				if(this.editMode)
					sap.m.MessageBox.alert(cus.crm.myaccounts.util.Util.geti18NText("MSG_UPDATE_ERROR"));
				else
					sap.m.MessageBox.alert(cus.crm.myaccounts.util.Util.geti18NText("MSG_CREATION_ERROR"));

				if (callbackError)
					callbackError.call(that);
			}, this),
		true);
	},

	onCancelButtonPressed: function(){
		
		if(!this._checkSaveNeeded()){
			window.history.back();
			return;
		}

		sap.m.MessageBox.confirm(
			cus.crm.myaccounts.util.Util.geti18NText("MSG_CONFIRM_CANCEL"),
			jQuery.proxy(function (confirmed) {
				if (confirmed === "OK") {
					window.history.back();
				}
			}, this)
		);
	},
	
	onInputFieldChanged:function (oEvent) {
		this._toggleSubmit();
	},
		
	_toggleSubmit:function () {
		if (this._checkMandatoryFieldsFilled() && this._checkSaveNeeded())
			this.setBtnEnabled("saveButton", true);
		else
			this.setBtnEnabled("saveButton", false);
	},

	_checkMandatoryFieldsFilled: function() {
		var oAccount = this.getView().getBindingContext().getObject();
		if(oAccount.category == cus.crm.myaccounts.util.Constants.accountCategoryPerson)
			return this.byId(sap.ui.core.Fragment.createId("personFragment","name1Input")).getValue().length !== 0;
		else
			return this.byId(sap.ui.core.Fragment.createId("companyFragment","name1Input")).getValue().length !== 0;
	},

	_checkSavePossible: function(){
		var inputField, countryID, country, regionID, region;
		
		inputField = this.getView().byId("MainAddress.countryIDInput");
		if(inputField)
			countryID = inputField.getValue();
		
		inputField = this.getView().byId("MainAddress.countryInput");
		if(inputField)
			country = inputField.getValue();
		
		if(country && !countryID){
			sap.m.MessageBox.alert( cus.crm.myaccounts.util.Util.geti18NText1("MSG_WRONG_COUNTRY_ERROR", country));
			return false;
		}
			
		inputField = this.getView().byId("MainAddress.regionIDInput");
		if(inputField)
			regionID = inputField.getValue();
		
		inputField = this.getView().byId("MainAddress.regionInput");
		if(inputField)
			region = inputField.getValue();
		
		if(region && !regionID){
			sap.m.MessageBox.alert( cus.crm.myaccounts.util.Util.geti18NText1("MSG_WRONG_REGION_ERROR", region));
			return false;
		}
		
		return true;
	},
	
	_checkSaveNeeded: function(){
		var oAccountContext = this.getView().getBindingContext();
		var oAccount = oAccountContext.getObject();
		var oNewAccount = {};

		var changesInAccount=false, changesForDependentRelations=false;

		changesInAccount = this._fillNewObject(oAccount, oNewAccount, "");
		if(changesInAccount)
			return true;
		
		if(oAccount.category == cus.crm.myaccounts.util.Constants.accountCategoryPerson)
			changesInAccount = this._fillNewObject(oNewAccount, oNewAccount, "", "personFragment");
		if(oAccount.category != cus.crm.myaccounts.util.Constants.accountCategoryPerson)
			changesInAccount = this._fillNewObject(oNewAccount, oNewAccount, "", "companyFragment");
		
		if(changesInAccount)
			return true;

		changesForDependentRelations = this._changesForDependentRelationsExists();
		if(!changesForDependentRelations)
			return false;
		else
			return true;
	},
	
	_cleanUp: function(){
		this.getView().setModel(null);
		this.setBtnEnabled("saveButton", false);
	},
	
	_setBusy: function(busy){
		this.getView().setBusy(busy);
		if(busy){
			this.setBtnEnabled("saveButton", !busy);
			this.setBtnEnabled("cancelButton", !busy);
		}
		else{
			this._toggleSubmit();
			this.setBtnEnabled("cancelButton", !busy);
		}
	},


	// ############################### address specific methods: ################################################################

	_setCountry: function(countryID, country){
		var countryInput = this.getView().byId("MainAddress.countryInput");
		var countryIDInput = this.getView().byId("MainAddress.countryIDInput");
		
    	var oldCountryID = countryIDInput.getValue();
    	if (oldCountryID != countryID){
    		this._setRegion("", ""); //clear region
    	}
    	
    	countryInput.setValue(country);
    	countryIDInput.setValue(countryID);
    	this._toggleSubmit();

    	//enable address input field
    	this._toggleAddressFields();
	},

	_readCountries: function(callbackCountryRead){
		var that = this;
		this.valueHelpCountry.setModel(new sap.ui.model.json.JSONModel({CountryCustomizing: []}));
		this.oDataModel.read("/CountryCustomizing", null, undefined, true,
			function(oData, oResponse){
				var countryCustomizing = jQuery.parseJSON(JSON.stringify(oData));
				countryCustomizing.results.unshift({country:"", countryID:""});
				that.valueHelpCountry.setModel(new sap.ui.model.json.JSONModel({CountryCustomizing: countryCustomizing.results}));
				if (callbackCountryRead)
					callbackCountryRead.call(that);
			},
			function(oError){
				jQuery.sap.log.error("Read failed in GeneralDateEdit->_readCountries:"+oError.response.body);
			}
		);
	},

	_setRegion: function(regionID, region){
		var regionInput = this.getView().byId("MainAddress.regionInput");
		regionInput.setValue(region);
		var regionIDInput = this.getView().byId("MainAddress.regionIDInput");
    	regionIDInput.setValue(regionID);
    	this._toggleSubmit();
	},

	_readRegions: function(callbackRegionRead){
		var that = this;
		var currentCountryID = this.getView().byId("MainAddress.countryIDInput").getValue();
		
		if(!that.aRegionCallback)
			that.aRegionCallback = [];
		
		if(that.regionReadRunning && callbackRegionRead){
			that.aRegionCallback.push(callbackRegionRead);
			return;
		}

		if(this.countryIDUsedForRegion == currentCountryID){
			if (callbackRegionRead)
				callbackRegionRead.call(that);
			return;
		}
		
		if (callbackRegionRead)
			that.aRegionCallback.push(callbackRegionRead);
		that.regionReadRunning = true;

		this.countryIDUsedForRegion = currentCountryID;
		this.valueHelpRegion.setModel(new sap.ui.model.json.JSONModel({RegionCustomizing: []}));	
		this.oDataModel.read("/RegionCustomizing", null, ["countryID='"+currentCountryID+"'"], true,
			function(oData, oResponse){
				var regionCustomizing = jQuery.parseJSON(JSON.stringify(oData));
				regionCustomizing.results.unshift({region:"", regionID:""});
				that.valueHelpRegion.setModel(new sap.ui.model.json.JSONModel({RegionCustomizing: regionCustomizing.results}));
				that.regionReadRunning = false;
				
				for(var i in that.aRegionCallback)
					that.aRegionCallback[i].call(that);
		},
			function(oError){
				jQuery.sap.log.error("Read failed in GeneralDateEdit->_readRegions: "+oError.response.body);
				that.regionReadRunning = false;
			}
		);
	},

	_toggleAddressFields: function(){
				
		var countryID = this.getView().byId("MainAddress.countryIDInput").getValue();

		if (countryID && countryID != "")
			this._setAddressFieldsEnabled(true);
		else
			this._setAddressFieldsEnabled(false);
	},

	_setAddressFieldsEnabled:function (enabled){
		var oAddressContainer = this.getView().byId("editFormAddress");
		if(!oAddressContainer)
			return;
		var aFormElements = oAddressContainer.getFormElements();
		var viewId = this.getView().getId();
		for(var i in aFormElements){
			var aFields = aFormElements[i].getFields();
			for(var z in aFields){
				var regEx = new RegExp(viewId+"--MainAddress.[A-z0-9]+Input","g");
				var elementId = aFields[z].getId();
				if(elementId == viewId+"--MainAddress.countryInput")
					continue;
				if(regEx.test(elementId))
					aFields[z].setEnabled(enabled);
			}
		}
	},

	// ############################### country value help: ################################################################

	onCountryValueHelpSelected: function(oEvent){
		if (!this.valueHelpCountry) {
			this._createValueHelpCountry();
		   // this.getView().addDependent(this.valueHelpCountry);
		    this._readCountries();
		}
	    this.valueHelpCountry.open();
	},

	_createValueHelpCountry: function(){
		if(!this.valueHelpCountry)
			this.valueHelpCountry = sap.ui.xmlfragment( "cus.crm.myaccounts.view.maintain.ValueHelpCountry", this);
	},

	onCountryValueHelpSearch: function(oEvent){
		var searchValue = oEvent.getParameter("value");
	    var oFilter = new sap.ui.model.Filter("country", sap.ui.model.FilterOperator.Contains, searchValue);
	    oEvent.getSource().getBinding("items").filter([oFilter]);
	},

	onCountryValueHelpClose: function(oEvent){
		var oSelectedItem = oEvent.getParameter("selectedItem");
	    if (oSelectedItem) {
	    	var oSelectedObject = oSelectedItem.getBindingContext().getObject();
	    	this._setCountry(oSelectedObject.countryID, oSelectedObject.country);
	    }
	    oEvent.getSource().getBinding("items").filter([]);
	},
	
	onCountryValueHelpCancel: function(oEvent){
	    oEvent.getSource().getBinding("items").filter([]);
	},
	
	// ############################### region value help: ################################################################

	onRegionValueHelpSelected: function(oEvent){
		if (!this.valueHelpRegion) {
			this._createValueHelpRegion();
		    //this.getView().addDependent(this.valueHelpRegion);
		}
		this._readRegions();
	    this.valueHelpRegion.open();
	},

	_createValueHelpRegion: function(){
		if(!this.valueHelpRegion)
			this.valueHelpRegion = sap.ui.xmlfragment( "cus.crm.myaccounts.view.maintain.ValueHelpRegion", this);
	},
	
	onRegionValueHelpSearch: function(oEvent){
		var searchValue = oEvent.getParameter("value");
	    var oFilter = new sap.ui.model.Filter("region", sap.ui.model.FilterOperator.Contains, searchValue);
	    oEvent.getSource().getBinding("items").filter([oFilter]);
	},
	
	onRegionValueHelpClose: function(oEvent){
		var oSelectedItem = oEvent.getParameter("selectedItem");
	    if (oSelectedItem) {
	    	var oSelectedObject = oSelectedItem.getBindingContext().getObject();
	    	this._setRegion(oSelectedObject.regionID, oSelectedObject.region);
	    }
	    oEvent.getSource().getBinding("items").filter([]);
	},

	onRegionValueHelpCancel: function(oEvent){
		oEvent.getSource().getBinding("items").filter([]);
	},
	
	
	// ############################### country suggestion: ################################################################
	
	onCountrySuggest: function(oEvent){
		var countryInput = oEvent.getSource();
		var fnDisplaySuggestion = function(){
			var oModel = this.valueHelpCountry.getModel();
			if(countryInput.getSuggestionItems().length > 0)
				return;
			var aCountries = oModel.getProperty("/CountryCustomizing");
			for(var i=0 in aCountries){
				var oCountry = aCountries[i];
				var oCustomData = new sap.ui.core.CustomData({key:"countryID", value:oCountry.countryID});
				var oItem = new sap.ui.core.Item({text: oCountry.country, customData:oCustomData});
				countryInput.addSuggestionItem(oItem);
			}
		};
		if (!this.valueHelpCountry) {
			this._createValueHelpCountry();
		    this._readCountries(fnDisplaySuggestion);
		}
		else{
			fnDisplaySuggestion.call(this);
		}
	},
	
	onCountrySuggestItemSelected: function(oEvent){
		var oItem = oEvent.getParameter("selectedItem");
		var countryID = null;
		for(var i in oItem.getCustomData()){
			var oCustomData = oItem.getCustomData()[i];
			if (oCustomData.getKey() == "countryID")
				countryID = oCustomData.getValue();
		}
		this._setCountry(countryID, oItem.getText());
	},

	onCountryInputFieldChanged:function (oEvent) {
		this.onInputFieldChanged();
		var countryInput = oEvent.getSource();
		this._setCountry("", countryInput.getValue());
		
		var fnCheckCountry = function(){
			var oModel = this.valueHelpCountry.getModel();
			var aCountries = oModel.getProperty("/CountryCustomizing");
			for(var i=0 in aCountries){
				var oCountry = aCountries[i];
				if (oCountry.country == countryInput.getValue())
					this._setCountry(oCountry.countryID, countryInput.getValue());
			}
		};
		if (!this.valueHelpCountry) {
			this._createValueHelpCountry();
		    this._readCountries(fnCheckCountry);
		}
		else{
			fnCheckCountry.call(this);
		}
	},
	
	// ############################### region suggestion: ################################################################
	
	onRegionSuggest: function(oEvent){
		var regionInput = oEvent.getSource();
		var fnDisplaySuggestion = function(){
			if(this.countryIDUsedForRegionSuggestion == this.countryIDUsedForRegion)
				return;
			this.countryIDUsedForRegionSuggestion = this.countryIDUsedForRegion;
			var oModel = this.valueHelpRegion.getModel();
			var aRegions = oModel.getProperty("/RegionCustomizing");
			regionInput.removeAllSuggestionItems();
			for(var i=0 in aRegions){
				var oRegion = aRegions[i];
				var oCustomData = new sap.ui.core.CustomData({key:"regionID", value:oRegion.regionID});
				var oItem = new sap.ui.core.Item({text: oRegion.region, customData:oCustomData});
				regionInput.addSuggestionItem(oItem);
			}
		};
		if (!this.valueHelpRegion)
			this._createValueHelpRegion();
		
		this._readRegions(fnDisplaySuggestion);
		
	},

	onRegionSuggestItemSelected: function(oEvent){
		var oItem = oEvent.getParameter("selectedItem");
		var regionID = null;
		for(var i in oItem.getCustomData()){
			var oCustomData = oItem.getCustomData()[i];
			if (oCustomData.getKey() == "regionID")
				regionID = oCustomData.getValue();
		}
		this._setRegion(regionID, oItem.getText());
	},

	onRegionInputFieldChanged:function (oEvent) {
		this.onInputFieldChanged();
		var regionInput = oEvent.getSource();
		this._setRegion("", regionInput.getValue());
		
		var fnCheckRegion = function(){
			var oModel = this.valueHelpRegion.getModel();
			var aRegions = oModel.getProperty("/RegionCustomizing");
			for(var i=0 in aRegions){
				var oRegion = aRegions[i];
				if (oRegion.region == regionInput.getValue()){
					this._setRegion(oRegion.regionID, regionInput.getValue());
				}
					
			}
		};
		if (!this.valueHelpRegion) {
			this._createValueHelpRegion();
		    this._readRegions(fnCheckRegion);
		}
		else{
			fnCheckRegion.call(this);
		}
	},
	
	// ############################### customizing for title and academic title: ################################################################
	
	_readCustomizing: function(callbackCountryRead){
		
	},

	// ############################### redefinition of framework methods: ################################################################
	getHeaderFooterOptions: function(){
		var that = this;
		return {
			sI18NFullscreenTitle : "DETAIL_TITLE",
			buttonList : [
				{
					sI18nBtnTxt : "BUTTON_SAVE",
					sId : "saveButton",
					onBtnPressed : jQuery.proxy(this.onSaveButtonPressed, this),
					bDisabled : "true"
				},
				{
					sI18nBtnTxt : "BUTTON_CANCEL",
					sId : "cancelButton",
					onBtnPressed : jQuery.proxy(this.onCancelButtonPressed, this),
				},
			],
			onBack : function(oEvent) {
				that.onCancelButtonPressed();
			},
                             
		};
	},	
	

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.maintain.GeneralDataEdit
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.maintain.GeneralDataEdit
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.maintain.GeneralDataEdit
*/
//	onExit: function() {
//
//	}

});
