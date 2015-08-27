/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/*global jQuery: false, sap: false, cus: false, console: false, window: false */
/*jslint plusplus: true */
(function () {
	'use strict';
	jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
	jQuery.sap.require("sap.ca.ui.model.type.Date");

	jQuery.sap.require("sap.m.MessageToast");
	jQuery.sap.require("sap.m.MessageBox");

	jQuery.sap.require("cus.crm.mycontacts.formatter.ReleaseFormatter");
	jQuery.sap.require("cus.crm.mycontacts.util.Constants");
	jQuery.sap.require("cus.crm.mycontacts.util.Util");

	sap.ca.scfld.md.controller.BaseDetailController.extend("cus.crm.mycontacts.view.S4", {
		
		/**
         * @memberOf view.S4
         * */  
        onInit: function() {
        	this.fullScreenMode = false;
			this.editMode = true;

			this.oDataModel = this.getView().getModel();

			this.pictureModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.pictureModel, "pictureModel");

			this.customizingModel = new sap.ui.model.json.JSONModel({TitleCustomizing: [], AcademicTitleCustomizing: []});
			this.getView().setModel(this.customizingModel, "Customizing");
			this._readCustomizing(this._refreshDropDownBoxes);

			var that = this;
			this.oRouter.attachRouteMatched(function (oEvent) {
				var oArguments = oEvent.getParameter("arguments");
				if(oEvent.getParameter("name") === "subDetail") {
					that.fullScreenMode = false;
					that.editMode = (oArguments.editPath.substring(0, 3) !== "Old");

					that.filter = oArguments.filter;
					that.sort = oArguments.sort;
					that.isSearch = oArguments.isSearch;
					that.search = oArguments.search;
					that.accountID = oArguments.accountID;
					that.contactID = oArguments.contactID;
					that.itemCount = oArguments.itemCount;

					that._cleanUp();

					// case: detail view and edit mode
					if(that.editMode) {
						var oModel = that.oConnectionManager.getModel();
						var contextPath = "/" + oArguments.editPath;
						that._fillScreen(oModel, contextPath);
					}
					// case: detail view and create mode
					else {
						that.oldContextPath = oArguments.editPath.substring(3, oArguments.editPath.length);
						that._setEmptyScreen();
					}
				} else {
					// case: full screen mode and edit mode
					if (oEvent.getParameter("name") === "edit") {
						that.fullScreenMode = true;
						that.editMode = true;
						that._cleanUp();
						var oModel = that.oDataModel;
						var contextPath = "/"+oEvent.getParameter("arguments").contextPath;
						that._fillScreen(oModel, contextPath);
					} else {
						// case: full screen mode and create mode
						if (oEvent.getParameter("name") === "new") {
							that.fullScreenMode = true;
							that.editMode = false;
							that._cleanUp();
							that._setEmptyScreen("/"+oArguments.accountContextPath);
						}
					}
				}
			});
		},

		_fillScreen: function(oModel, contextPath) {
			var oContext = oModel.getContext(contextPath);
			this.getView().setModel(oModel);
			this.getView().setBindingContext(oContext);
			var that = this;
			if(!oContext.getObject()){ //if context has no contact object (if the view has been called directly with a link)
				oModel.createBindingContext(contextPath, "", {
					expand : that._getExpandForDataBinding() + ",Account,Account/Addresses"},
					function() {
						that._updateAddresses(oContext.getObject().accountID);
						that._updatePicture();
					},
					true);
			} else {
				that._updateAddresses(oContext.getObject().accountID);
				that._updatePicture();
			}
		},

		_setEmptyScreen: function(accountContextPath) {
			var oContactTemplate = this._getTemplateForContact();

			var aDependentRelations = this._getDependentRelations();
			for(var i in aDependentRelations) {
				oContactTemplate[aDependentRelations[i]] = this._getTemplateForDependentObject("ContactCollection/" + aDependentRelations[i]);
			}

			var oNewContactModel = new sap.ui.model.json.JSONModel({NewContact: oContactTemplate});
			oNewContactModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay); //to be similar to oData model
			this.getView().setModel(oNewContactModel);
			this.getView().setBindingContext(oNewContactModel.getContext("/NewContact"));

			// In case of full screen mode, the company and address field are prefilled
			if(this.fullScreenMode) {
				if(accountContextPath && accountContextPath.split("'").length > 0) {
					var oModel = this.oDataModel;
					var oAccountContext = new sap.ui.model.Context(oModel, accountContextPath);
					var oAccount = oAccountContext.getObject();
					var accountID = accountContextPath.split("'")[1];
					if(!oAccount) {
						var that = this;
						oModel.createBindingContext(accountContextPath, "",
							{expand : "MainAddress,Addresses"},
							function() {
								var oAccount = oModel.getProperty(accountContextPath);
								// Update company and addresses based on accountID
								that._setDefaultCompany(oAccount.accountID, oAccount.fullName);
								that._updateAddresses(accountID);
							},
							true
						);
					} else {
						// Update company and addresses based on accountID
						this._setDefaultCompany(oAccount.accountID, oAccount.fullName);
						this._updateAddresses(accountID);
					}
				}
			} else {
				this._adaptAddressFields(false, true);
			}
		},

		_getTemplateForContact: function() {
			var oContactTemplate = this._generateTemplateUsingMetadata("ContactCollection");
			oContactTemplate.isMyContact = false;
			oContactTemplate.isMainContact = false;
			if(oContactTemplate.birthDate == "")
				oContactTemplate.birthDate = null;
			return oContactTemplate;
		},

		_generateTemplateUsingMetadata: function(path){
			var oEntityMetadata = this.oDataModel.oMetadata._getEntityTypeByPath(path);
			var oTemplate = {};
			for(var i in oEntityMetadata.property) {
				oTemplate[oEntityMetadata.property[i].name] = "";
			}
			return oTemplate;
		},

		_setBusy: function(busy){
			this.setBtnEnabled("saveButton", !busy);
			this.setBtnEnabled("cancelButton", !busy);
			if(!this.oBusyDialog)
				this.oBusyDialog = new sap.m.BusyDialog();			
			if(busy)
				this.oBusyDialog.open();
			else{
				var that = this;
				window.setTimeout(function() {
					that.oBusyDialog.close();
				},300);
			}
		},
		
		_cleanUp: function() {
			this.getView().setModel(null);

			this.pictureModel.setProperty("/Pictures", []);
			this.pictureModel.setProperty("/PictureSrc", undefined);
			this.pictureModel.setProperty("/OldPictureSrc", undefined);
			this._setContactPictureEditable(true);
			this.byId("contactPicture").removeAllPictures();

			var oLastNameInput = this.byId("lastNameInput");
            oLastNameInput.setShowSuggestion(!this.editMode);
			this.byId('lastNameInput').setValueState(sap.ui.core.ValueState.None);
        	
			var oCompanyInput = this.byId("companyValueHelp");
			oCompanyInput.setEnabled(!this.fullScreenMode && !this.editMode);
			oCompanyInput.setEditable(!this.fullScreenMode && !this.editMode);
			oCompanyInput.setShowSuggestion(!this.fullScreenMode && !this.editMode);
			this.byId('companyValueHelp').setValueState(sap.ui.core.ValueState.None);

			var oAddressSelect = this.byId("addressSelect");
			oAddressSelect.setBindingContext(undefined);
			oAddressSelect.removeAllItems();
		},

		// #############################################################################################
		// Picture
		// #############################################################################################

		onPictureSelected: function(oEvent) {
			this._toggleContactPictureFieldStatus();
		},

		onRemoveContactPicture: function(oEvent) {
			if(!this.pictureModel.getProperty("/OldPictureSrc")) {
				this.pictureModel.setProperty("/OldPictureSrc", this.pictureModel.getProperty("/PictureSrc"));
			}
			this._toggleContactPictureFieldStatus();
		},

		_toggleContactPictureFieldStatus: function() {
			this._setContactPictureEditable(!this.byId("contactPicture").getEditable());
		},

		_setContactPictureEditable: function(isEditable) {
			this.byId("contactPicture").setEditable(isEditable);
			this.byId("removeContactPictureButton").setVisible(!isEditable);
			if(isEditable) {
				this.byId("contactPicture").destroyPictures();
			}
		},

		_updatePicture: function() {
			var oModel = this.getView().getModel();
			var oContext = this.getView().getBindingContext();
			var oPicture = oModel.getProperty("Photo", oContext);
			if(oPicture) {
				if(oPicture.mimeType) {
					var pictureSrc = cus.crm.mycontacts.formatter.ReleaseFormatter.getRelativePathFromURL(oPicture.__metadata.media_src);
					this.pictureModel.setProperty("/Pictures", [{src: pictureSrc}]);
					this.pictureModel.setProperty("/PictureSrc", pictureSrc);
					this._setContactPictureEditable(false);
				}
			} else {
				this._setContactPictureEditable(true);
			}
		},

		_sendPictureRequests: function(oContact, changesInContact) {
			if(this._changeForPictureExists()) {
				var oModel = this.oConnectionManager.getModel(),
				    aPictures = this.byId("contactPicture").getPictures(),
					oPicture = (aPictures && aPictures.length > 0) ? aPictures[0] : undefined,
					token,
					oDeleteParameters = {},
					oAddParameters = {},
					pictureHasBeenAdded = aPictures && aPictures.length > 0 && oPicture.isSourceDataUri(),
					pictureHasBeenDeleted = this.pictureModel.getProperty("/OldPictureSrc") && this.pictureModel.getProperty("/OldPictureSrc").length > 0;
				if(pictureHasBeenAdded || pictureHasBeenDeleted) {
					token = oModel.oHeaders["x-csrf-token"];
					if (!token) {
						oModel.refreshSecurityToken();
						token = oModel.oHeaders["x-csrf-token"];
					}
					// If picture shall be deleted, set parameters for sending picture request to backend
					if(pictureHasBeenDeleted) {
						oDeleteParameters.pictureURL = this.pictureModel.getProperty("/OldPictureSrc");
						oDeleteParameters.type = "DELETE";
						oDeleteParameters.oHeaders = {
							"X-CSRF-Token":token,
							"If-Match": "*"
						};
						oDeleteParameters.data = "";
					}
					// If picture shall be added, set parameters for sending picture request to backend
					if(pictureHasBeenAdded) {
						oAddParameters.pictureURL = oModel.sServiceUrl + "/ContactCollection(contactID='" + oContact.contactID + "',accountID='" + oContact.accountID + "')/Attachments";
						oAddParameters.type = "POST";
						oAddParameters.oHeaders = {
							"Content-Type": oPicture.getMimeType(),
							"Content-Encoding": "base64",
							"Content-Disposition": 'attachment; filename="' + oPicture.getName() + '"',
							"slug": "isImage",
							"X-CSRF-Token": token
						};
						oAddParameters.data = oPicture.getBase64Encoding();
					}
					var fnOnAfterSave = function() {
						this._updatePicture();
						this._onAfterSave(oContact, true, changesInContact);
					};
					if(pictureHasBeenDeleted) {
						if(pictureHasBeenAdded) {
							// If both a picture has been deleted and a picture has been added,
							// then first a deletion request is sent to the backend and
							// in case of success a POST request is sent to the backend
							this._sendPictureRequest(oContact, oDeleteParameters, function() {
								this._sendPictureRequest(oContact, oAddParameters, fnOnAfterSave);
							});
						} else {
							this._sendPictureRequest(oContact, oDeleteParameters, fnOnAfterSave);
						}
					} else {
						this._sendPictureRequest(oContact, oAddParameters, fnOnAfterSave);
					}
				} else {
					this._onAfterSave(oContact, true, changesInContact);
				}
			} else {
				this._onAfterSave(oContact, true, changesInContact);
			}
		},

		_sendPictureRequest: function(oContact, oParameters, fnSuccess) {
			jQuery.ajax({
				url: oParameters.pictureURL,
				type: oParameters.type,
				headers: oParameters.oHeaders,
				success: jQuery.proxy(fnSuccess, this),
				error: jQuery.proxy(
					function(oMessage) {
						this.oBusyDialog.close();
						this._displayResponseErrorMessage(oMessage, cus.crm.mycontacts.util.Util.geti18NText("UPDATE_PHOTO_ERROR"));
					}
					, this),
				dataType: "json",
				data: oParameters.data
			});
		},

		_changeForPictureExists: function() {
			var pictureSrc = this.pictureModel.getProperty("/PictureSrc");
			var oldPictureSrc = this.pictureModel.getProperty("/OldPictureSrc");
			var aPictures = this.byId("contactPicture").getPictures();
			if((!pictureSrc && aPictures.length > 0 && aPictures[0].getMimeType()) || oldPictureSrc) {
				return true;
			}
			return false;
		},

		// #############################################################################################
		// Account
		// #############################################################################################

		/**
		 * Select accounts in a selectDialog control
		 */
		displayAccount: function(oEvent) {

			if(!this._accountSelectDialog) {
				this._accountSelectDialog = sap.ui.xmlfragment("cus.crm.mycontacts.view.AccountSelectDialog", this);
				//filter for category is set to NE (not equal) to 1 (Individual Account)
				var aFilters = [];
				aFilters.push(new sap.ui.model.Filter("category", sap.ui.model.FilterOperator.NE, "1"));
				this._accountSelectDialog.bindAggregation("items", {
					path : '/AccountCollection',
					template : this._accountSelectDialog.getItems()[0].clone(),
					parameters: {expand: 'MainAddress'},
					filters : aFilters,
					sorter : new sap.ui.model.Sorter("name1", false, this.groupAccount),
				});
				this._accountSelectDialog.setModel(this.oConnectionManager.getModel());
				this._accountSelectDialog.setModel(oEvent.getSource().getModel("i18n"), "i18n");

				//Ux requirement : Display "Loading..." as no data text when searching
				this.getView().getModel().attachRequestSent(
						function() {
							if(this._list) {
								this._list.setNoDataText(cus.crm.mycontacts.util.Util.geti18NText("LOADING_TEXT"));
							}
						}
						, this._accountSelectDialog);
				this.getView().getModel().attachRequestCompleted(
						function() {
							if(this._list) {
								this._list.setNoDataText(cus.crm.mycontacts.util.Util.geti18NText("NO_DATA_TEXT"));
							}
						}
						, this._accountSelectDialog);
			} else {
				this._accountSelectDialog._list.getBinding("items").filter([]);
			}

			this._accountSelectDialog.open(this.getView().getModel().getProperty("/Account"));
		},

		/**
		 * Update selected account
		 */
        selectAccount: function(oEvent) {
        	//Retrieve the selected item
        	var oSelectedItem = oEvent.getParameter("selectedItem");
        	if(oSelectedItem) {
        		var oSelectedObject = oSelectedItem.getBindingContext().getObject();
        		this._setCompany(oSelectedObject.accountID, oSelectedObject.fullName);
				this._updateAddresses(oSelectedObject.accountID);
        	}
        	this.closeAccountSelectDialog(oEvent);
        },

        closeAccountSelectDialog: function(oEvent) {
        	if(oEvent.getSource().getBinding("items").aFilters.length){
    	    	oEvent.getSource().destroyItems();
    	    }
        },

        searchAccount: function(oEvent) {
			var value = oEvent.getParameter("value");
			if(value === "") {
				oEvent.getParameter("itemsBinding").filter([]);
			} else {
				if(value !== undefined) {
					// apply the filter to the bound items, and the Select Dialog will update
					oEvent.getParameter("itemsBinding").filter([new sap.ui.model.Filter("name1", sap.ui.model.FilterOperator.Contains, value)]);
				}
			}
		},

		/**
		 * Groups the accounts alphabetically
		 */
		groupAccount: function(oContext) {
			var oText = oContext.getProperty("name1");
			if(oText && typeof oText === "string") {
				return oText.charAt(0).toUpperCase();
			}
			return "";
		},

		// #############################################################################################
		// Address
		// #############################################################################################

		_updateAddresses: function(accountID) {
			var oModel = this.oDataModel;
			var oAccountContext = new sap.ui.model.Context(oModel, "/AccountCollection('" + accountID + "')");
			var oAccount = oAccountContext.getObject();

			var fnUpdateAddresses = function(oAccount) {
				if(oAccount.category != cus.crm.mycontacts.util.Constants.accountCategoryPerson) {
					this._setAddressSelect(oAccount.accountID);
					this.byId("addressSelect").setEnabled(true);
				}
				else {
					this._adaptAddressFields(false, true);
					this.byId("addressSelect").setEnabled(false);
				}
			};

			// In case of my contact -> account context not yet bound
			if(!oAccount) {
				var oAccountPath = oAccountContext.getPath();
				var that = this;
				oModel.createBindingContext(oAccountPath, "",
					{expand : "MainAddress,Addresses"},
					function() {
						var oAccount = oModel.getProperty(oAccountPath);
						fnUpdateAddresses.call(that, oAccount);
					},
					true
				);
			} else {
				fnUpdateAddresses.call(this, oAccount);
			}
        },

        _setAddressSelect: function(accountID) {
        	var oModel = this.oDataModel;
        	var oContext = this.getView().getBindingContext();
        	var oAccountContext = new sap.ui.model.Context(oModel, "/AccountCollection('" + accountID + "')");
        	var oSelect = this.byId('addressSelect');
        	oSelect.unbindProperty("selectedKey");
    		oSelect.unbindAggregation("items");
        	if (oSelect && accountID && accountID.length > 0) {
        		var addressKey = oModel.getProperty(oContext.getPath()+"/WorkAddress/addressNumber");
        		
        		if(addressKey) {
        			this._adaptAddressFields(true, false);
        			this._bindAddressSelect(oAccountContext, addressKey);
        		} else {
        			if(this.editMode) {
        				this._adaptAddressFields(false, false);
	    				this._bindAddressSelect(oAccountContext, addressKey);
        			} else {
		        		//If contact has no work address, then use main address of account
	        			var that = this;
		    			cus.crm.mycontacts.util.Util.readODataObject(oAccountContext, "MainAddress", function(address) {
		    				addressKey = address.addressNumber;
		    				// In case address is not filled, the address fields should be read-only
		    				that._adaptAddressFields(addressKey != "", false);
		    				that._bindAddressSelect(oAccountContext, addressKey);
		    			});
        			}
        		}
        	}
        },

        _bindAddressSelect: function(oAccountContext, addressKey) {
        	var oSelect = this.byId('addressSelect');
			oSelect.setModel(this.oConnectionManager.getModel());
			oSelect.bindAggregation("items", {path: oAccountContext.getPath() + "/Addresses", template:new sap.ui.core.Item({
				key:"{addressNumber}",
				text:"{path: 'address', formatter:'cus.crm.mycontacts.formatter.ReleaseFormatter.addressFormatter'}"
			})});
			// Insert an empty entry to the drop-down list for addresses
			oSelect.insertItem(new sap.ui.core.Item({key: "", text: ""}), 0);

    		if(addressKey) {
    			oSelect.bindProperty("selectedKey", addressKey);
    			oSelect.setSelectedKey(addressKey);
    			// In case of create and full screen mode, the address field
    			// is set to the default address.
    			if(!this.editMode && this.fullScreenMode)
    				this._setDefaultAddressNumberInput(addressKey);
    			else
    				this._setAddressNumberInput(addressKey);
		    }
        },

        onAddressSelectInputFieldChanged: function(oEvent) {
        	var addressKey = oEvent.getParameter("selectedItem").getProperty('key');
            this._setAddressNumberInput(addressKey);
            // In case contact has no work address, the address fields should be read-only
            this._adaptAddressFields(addressKey != "", false);
		},

		_setDefaultAddressNumberInput: function(addressKey) {
			this.getView().getModel().setProperty(this.getView().getBindingContext().getPath() + "/WorkAddress/addressNumber", addressKey);
			this._setAddressNumberInput(addressKey);
		},
		
		_setAddressNumberInput: function(addressKey) {
			var addressNumberInput = this.getView().byId("WorkAddress.addressNumberInput");
			if(addressNumberInput)
				addressNumberInput.setValue(addressKey);
		},

		/**
		 * Adapts all address fields. First parameter is a Boolean, which determines
		 * if the fields are set to be enabled or not. Second parameter is a Boolean,
		 * which determines if the fields are emptied or not. 
		 */
		_adaptAddressFields: function(isEnabled, emptyFields) {
			var oForm = this.byId("editForm");
			if(!oForm)
				return;
			var aFormElements = oForm.getContent();
			var viewId = this.getView().getId();
			for(var i in aFormElements) {
				var oField = aFormElements[i];
				var fieldId = oField.getId();
				var regEx = new RegExp(viewId+"--WorkAddress.[A-z0-9]+Input","g");
				if(regEx.test(fieldId)) {
					oField.setEnabled(isEnabled);
					if(emptyFields)
						oField.setValue("");
				}
				if(fieldId == viewId+"--addressSelect"){
					if(emptyFields)
						oField.setSelectedKey("");
				}
			}
		},

		// #############################################################################################
		// Field checks
		// #############################################################################################

		_checkSaveNeeded: function(){
			var oContactContext = this.getView().getBindingContext();
			var oContact = oContactContext.getObject();
			var oNewContact = {};

			var changesInContact=false, changesForDependentRelations=false, changesForPicture=false;

			changesInContact = this._fillNewObject(oContact, oNewContact, "");
			if(changesInContact)
				return true;
			
			changesForDependentRelations = this._changesForDependentRelationsExists();
			if(changesForDependentRelations)
				return true;
			
			 changesForPicture = this._changeForPictureExists();
			 if(changesForPicture)
				 return true;
			 else
				 return false;
			 
			
		},

		_checkSavePossible: function(){
			//Check if all mandatory fields are filled
			var isMandatoryFieldsFilled = true;
			if(!this.editMode) {
				if (!this.byId("accountIDInput").getValue()){
					this.byId('companyValueHelp').setValueState(sap.ui.core.ValueState.Error);
					isMandatoryFieldsFilled = false;	
				}
			}
			if (this.byId("lastNameInput").getValue().length === 0){
				this.byId('lastNameInput').setValueState(sap.ui.core.ValueState.Error);
				isMandatoryFieldsFilled = false;	
			}
			
			if(!isMandatoryFieldsFilled)
				sap.m.MessageBox.alert( cus.crm.mycontacts.util.Util.geti18NText("MSG_MANDATORY_FIELDS"));
			
			return isMandatoryFieldsFilled;
		},

		_fillNewObject: function(sourceObject, targetObject, fieldPrefix) {
			var changesExist = false;
			var inputFieldId = "";
			for (var key in sourceObject) {
				inputFieldId = this.getView().getId()+"--"+fieldPrefix+key+"Input";

				if(typeof sourceObject[key] != "object" || key == "birthDate")
					targetObject[key] = sourceObject[key];

				//get new value from input field
				var oInputField = this.byId(inputFieldId);
				if (oInputField){
					var newValue = "";
					if(oInputField.getDateValue){	//special logic for dates
						newValue = oInputField.getValue();
						if(newValue == ""){
							newValue = null;
						}
						else{
							var dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({style : "medium"});
							var oDate = dateFormatter.parse(newValue);
							if(oDate){
								var oNewDate = new Date();
								oNewDate.setUTCFullYear(oDate.getFullYear());
								oNewDate.setUTCMonth(oDate.getMonth());
								oNewDate.setUTCDate(oDate.getDate());
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
					else if (oInputField.getSelectedKey) //special logic for select field
						newValue = oInputField.getSelectedKey();
					else if (oInputField.getValue) 	//special logic for input field
						newValue = oInputField.getValue();

					//check if the new value is different from the original value
					if (newValue && newValue.getTime){
						if(!targetObject[key] || newValue.getTime() != targetObject[key].getTime()){
							changesExist = true;
							targetObject[key] = newValue;
						}
					}
					else if(targetObject[key] != newValue){
						changesExist = true;
						targetObject[key] = newValue;
					}
				}		
			}
			return changesExist;
		},

		// #############################################################################################
		// Dependent relations
		// #############################################################################################

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
			 * with additional navigation properties for the ContactCollection, which should be considered in the create/update process 
			 * @callback cus.crm.mycontacts.view.S4~extHookGetDependentCustomRelations
			 * @return {array} */
			if (this.extHookGetDependentCustomRelations)
				oDependentCustomRelations = this.extHookGetDependentCustomRelations();
			for(var i in oDependentCustomRelations){
				oDependentRelations.push(oDependentCustomRelations[i]);
			}

			return oDependentRelations;
		},

		_getTemplateForDependentObject: function(relationName){
			return this._generateTemplateUsingMetadata("ContactCollection/"+relationName);
		},
		
		_changesForDependentRelationsExists: function(saveMode){
			var oModel = this.oDataModel;
			var oContactContext = this.getView().getBindingContext();
			var changesInDependentObject = false;
			var aDependentRelations = this._getDependentRelations();
			for(var i in aDependentRelations){
				var oDependentObject = oModel.getProperty(oContactContext+"/"+aDependentRelations[i]);	//check if entity exists. In create case it will be always empty
				if(!saveMode)
					oDependentObject = oContactContext.getProperty(aDependentRelations[i]);	//check if entity exists. In create case it will be always filled
				if(!oDependentObject)
					oDependentObject = this._getTemplateForDependentObject("ContactCollection/" + aDependentRelations[i]);	//if the entity does not exist -> use template
				var oNewDependentObject = {};
				changesInDependentObject = this._fillNewObject(oDependentObject, oNewDependentObject, aDependentRelations[i]+".");
				if(changesInDependentObject)
					return changesInDependentObject;
			}

			return changesInDependentObject;
		},

		_adaptContactWithDependentRelationsBeforeCreate: function(oNewContact) {
			var aDependentRelations = this._getDependentRelations();
			for(var i in aDependentRelations){
				var oDependentObject = this._getTemplateForDependentObject("ContactCollection/" + aDependentRelations[i]);
				var oNewDependentObject = {};
				var changesInDependentObject = this._fillNewObject(oDependentObject, oNewDependentObject, aDependentRelations[i]+".");
				if (changesInDependentObject)		
					oNewContact[aDependentRelations[i]] = oNewDependentObject;
			}
		},

		// #############################################################################################
		// Save
		// #############################################################################################

		onSaveButtonPressed: function(oEvent){
			this._saveData(false);
		},
		
		_saveData: function(forceSave){
			var eTagString = null;
			if(forceSave)
				eTagString = "*";
			
			// In case contact has no work address, the address fields are emptied
			if(!this.byId('addressSelect').getSelectedKey()) {
				this._adaptAddressFields(false, true);
			}

			if(!this._checkSavePossible())
				return;

			this._setBusy(true);
			var oModel = this.getView().getModel();
			var oContactContext = this.getView().getBindingContext();
			var oContact = oContactContext.getObject();
			var oNewContact = {};

			var changesInContact=false, changesForDependentRelations=false;

			changesInContact = this._fillNewObject(oContact, oNewContact, "");

			changesForDependentRelations = this._changesForDependentRelationsExists("saveMode");
			
			if(!changesInContact && !changesForDependentRelations && !this._changeForPictureExists()) {
				sap.m.MessageToast.show(cus.crm.mycontacts.util.Util.geti18NText("NO_CHANGE"));
				this._setBusy(false);
				this._onAfterSave(oContact, false, changesInContact);
			} else {

				var oBatchOperation, requestURL;
				var aBatchOperation = [];
				var that = this;
				if(this.editMode){
	
					if (changesInContact) {
						requestURL = oContactContext.sPath;
						oBatchOperation = oModel.createBatchOperation(requestURL, "PUT", oNewContact, {sETag: eTagString});
						aBatchOperation.push(oBatchOperation);
					}
	
					if(changesForDependentRelations) {
						this._createBatchOperationForDependentRelations(aBatchOperation, eTagString);
					}
	
					if(!changesInContact && !changesForDependentRelations && this._changeForPictureExists()){
						this._sendPictureRequests(oContact, changesInContact);
					}
					else {
						cus.crm.mycontacts.util.Util.sendBatchChangeOperations(
							this.oDataModel,
							aBatchOperation,
							function() {
								that._sendPictureRequests(oContact, changesInContact);
								sap.m.MessageToast.show(cus.crm.mycontacts.util.Util.geti18NText("UPDATE_SUCCESS"));
							},
							function(oError) {
								that._onAfterSave(null, false, changesInContact, oError);
							}
						); 
					}
				}
				else {
	
					requestURL = "/ContactCollection";
					oBatchOperation = this.oDataModel.createBatchOperation(requestURL, "POST", oNewContact);
	
					if(changesForDependentRelations){
						this._adaptContactWithDependentRelationsBeforeCreate(oNewContact);
					}
	
					aBatchOperation.push(oBatchOperation);
					cus.crm.mycontacts.util.Util.sendBatchChangeOperations(
							this.oDataModel,
							aBatchOperation,
							function(responseObject) {
								that._sendPictureRequests(responseObject, changesInContact);
								// Before navigation to display screen, a check if data has been changed is done.
								// In this check, object belonging to current binding context is
								// compared to input fields. Therefore, binding context is set to new contact.
								that.getView().setBindingContext(new sap.ui.model.Context(oModel, "/ContactCollection(contactID='" + responseObject.contactID + "',accountID='" + responseObject.accountID + "')"));
								sap.m.MessageToast.show(cus.crm.mycontacts.util.Util.geti18NText("CREATION_SUCCESS"));
							},
							function(oError) {
								that._onAfterSave(null, false, changesInContact, oError);
							}
					);
				}
			}
		},

		/**
		 * After having saved the changes of a contact, refresh contact
		 * if necessary and navigate to the display screen.
		 * @param {object} responseObject: Contact object
		 * @param {Boolean} changesExist: Indicates if contact has been changed
		 * @param {Boolean} changesInContact: Indicates if contact entity has been
		 *        changed directy (e.g. function) without considering dependent
		 *        relations (e.g. WorkAddress)
		 * @param {object} oError: Error object returned by the save process
		 */
		_onAfterSave: function(responseObject, changesExist, changesInContact, oError){
			this._setBusy(false);
			
			if(oError){
				if(this["_onAfterSaveHandleErrorCode_"+oError.statusCode])
					this["_onAfterSaveHandleErrorCode_"+oError.statusCode]();
				else
					sap.m.MessageBox.alert(oError.message.value);
				return;
			}

			var oBus = sap.ui.getCore().getEventBus();

			if(changesExist && this.editMode) {
				var contextPath = "ContactCollection(contactID='" + responseObject.contactID + "',accountID='" + responseObject.accountID + "')";
				// In case, dependent relations (e.g. WorkAddress) have been changed,
				// but the contact entity has not been changed directly (e.g. function),
				// a refresh of the contact is triggered.
				// In case, the contact entity has been changed directly, the framework
				// triggeres a refesh of the contact with dependent relations and the
				// master list.
				if(!changesInContact)
					cus.crm.mycontacts.util.Util.getRefreshUIObject(this.oConnectionManager.getModel(), "/"+contextPath , this._getExpandForDataBinding()).refresh();
				oBus.publish("cus.crm.mycontacts", "contactChanged", {
					contextPath : contextPath
				});
			}
			if(!this.editMode)
				oBus.publish("cus.crm.mycontacts", "contactCreated");
			if(this.fullScreenMode)
				window.history.back();
			else {
				if(this.editMode) {	
					var oParameter = {
						contextPath: "ContactCollection(contactID='" + responseObject.contactID + "',accountID='" + responseObject.accountID + "')",
						filter: this.filter,
						sort: this.sort,
						isSearch: this.isSearch,
						search: this.search,
						accountID: this.accountID,
						contactID: this.contactID,
						itemCount: this.itemCount
					};
					this.oRouter.navTo("detail2", oParameter, true);
				}
				else {

					var contextPath = "ContactCollection(contactID='" + responseObject.contactID + "',accountID='" + responseObject.accountID + "')";
					var searchString = (responseObject.firstName != "") 
						? responseObject.firstName + " " + responseObject.lastName
						: responseObject.lastName;					

					this.oRouter.navTo("selected", {contextPath: contextPath, name: searchString}, true);	
				}
			}
		},
		
		_onAfterSaveHandleErrorCode_412: function(){
			var that = this;
			sap.m.MessageBox.show(cus.crm.mycontacts.util.Util.geti18NText("MSG_CONFLICTING_DATA"), {
			    title: cus.crm.mycontacts.util.Util.geti18NText("CONFIRM_TITLE"),
			    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			    onClose: function (confirmed) {
					if(confirmed == sap.m.MessageBox.Action.YES){
						that._saveData(true);
					}
					else{
						var oRefreshUIObject = cus.crm.mycontacts.util.Util.getRefreshUIObject(that.getView().getModel(), that.getView().getBindingContext().sPath, that._getExpandForDataBinding());
						oRefreshUIObject.refresh(function(){
							that._setAddressSelect(that.getView().getBindingContext().getProperty("accountID"));
						}); 
					}
				},
			});
		},

		_createBatchOperationForDependentRelations: function(aBatchOperation, eTagString){
			var oModel = this.getView().getModel();
			var oContactContext = this.getView().getBindingContext();
			var oContact = oContactContext.getObject();

			var aDependentRelations = this._getDependentRelations();
			for(var i in aDependentRelations){
				var oDependentObject = oModel.getProperty(oContactContext+"/"+aDependentRelations[i]);
				var oDependentObjectContext = null;
				if (oDependentObject)
					oDependentObjectContext = oModel.getContext("/"+oContact[aDependentRelations[i]]["__ref"]); 
				var oNewDependentObject = {};

				var changesInDependentObject=false;

				var dependentObjectToBeCreated = false;
				if(!oDependentObject || this._objectKeyIsInitial(oDependentObject, "ContactCollection/"+aDependentRelations[i])){	//odata contains initial address with no keys -> only if user comes from search result list
					dependentObjectToBeCreated = true;
					oDependentObject = this._getTemplateForDependentObject(aDependentRelations[i]);
					if(oDependentObject.contactID != null && oDependentObject.contactID != undefined)
						oDependentObject.contactID = oContact.contactID;
					if(oDependentObject.personID != null && oDependentObject.personID != undefined)  //Address entity has property personID instead of contactID
						oDependentObject.personID = oContact.contactID;
					if(oDependentObject.accountID != null && oDependentObject.accountID != undefined)
						oDependentObject.accountID = oContact.accountID;
				}
				changesInDependentObject = this._fillNewObject(oDependentObject, oNewDependentObject, aDependentRelations[i]+".");

				var oBatchOperation, requestURL;
				if(changesInDependentObject){
					var httpMethod;
					if(dependentObjectToBeCreated){
						httpMethod = "POST";
						var oEntityMetadata = this.oDataModel.oMetadata._getEntityTypeByPath("ContactCollection/"+aDependentRelations[i]);
						requestURL = oEntityMetadata.name+"Collection";
					}
					else{
						httpMethod = "PUT";
						requestURL = oDependentObjectContext.sPath;
					}
					oBatchOperation = oModel.createBatchOperation(requestURL, httpMethod, oNewDependentObject, {sETag: eTagString});
					aBatchOperation.push(oBatchOperation);
				}			
			}
		},

		_objectKeyIsInitial: function(object, path){
			var oEntityMetadata = this.oDataModel.oMetadata._getEntityTypeByPath(path);
			for(var i in oEntityMetadata.key.propertyRef)
				if(object[oEntityMetadata.key.propertyRef[i].name] != "")
					return false;

			return true;
		},

		// #############################################################################################
		// Cancel
		// #############################################################################################

		onCancelButtonPressed: function() {
			var oContact = this.getView().getBindingContext().getObject();
			if(!this._checkSaveNeeded()){
				this._onAfterCancel(oContact);
				return;
			}

			sap.m.MessageBox.confirm(
				cus.crm.mycontacts.util.Util.geti18NText("CONFIRM_CANCEL"),
				jQuery.proxy(function (confirmed) {
					if(confirmed === "OK") {
						this._onAfterCancel(oContact);
					}
				}, this)
			);
		},

		_onAfterCancel: function(oContact) {
			if(this.fullScreenMode)
				window.history.back();
			else {
				if(jQuery.device.is.phone && !this.editMode) {
					this.oRouter.navTo("master", undefined, true);
				} else {
					var oParameter = {
							contextPath: this.editMode ? "ContactCollection(contactID='" + oContact.contactID + "',accountID='" + oContact.accountID + "')"
					                   				   : this.oldContextPath,
							filter: this.filter,
							sort: this.sort,
							isSearch: this.isSearch,
							search: this.search,
							accountID: this.accountID,
							contactID: this.contactID,
							itemCount: this.itemCount
					};
					this.oRouter.navTo("detail2", oParameter, true);
				}
			}
		},

		// #############################################################################################
		// Back
		// #############################################################################################

		_navBack: function() {
			if(this._checkSaveNeeded()) {
				sap.m.MessageBox.confirm(
						cus.crm.mycontacts.util.Util.geti18NText("CONFIRM_CANCEL"),
						jQuery.proxy(function (confirmed) {
							if(confirmed === "OK")
								window.history.back(1);
							}, this)
						);
			} else
				window.history.back(1);
		},

		// #############################################################################################
		// Error Handling
		// #############################################################################################

		/**
		 * Display the error message contained in the message or a default one
		 * @param oMessage
		 * @param sDefaultMessage
		 */
		_displayResponseErrorMessage:function (oMessage, sDefaultMessage) {
			var sMessage;
			if (oMessage.response) {
				sMessage = jQuery.parseJSON(oMessage.response.body).error.message.value;
			}
			sap.m.MessageBox.alert(sMessage || sDefaultMessage);
		},

		// #############################################################################################
		// Customizing for title and academic title
		// #############################################################################################

		_readCustomizing: function(callbackCustomizingRead) {
			var that = this;
			cus.crm.mycontacts.util.Util.sendBatchReadOperations(this.oDataModel, ["CustomizingTitleCollection", "CustomizingAcademicTitleCollection"], function(oResponses) {

				var aTitles = oResponses["CRM_BUPA_ODATA.CustomizingTitle"];			
				aTitles.unshift({title:"", titleDescription:"", person:"X", organization:"X", group:"X"});
				that.customizingModel.setProperty("/TitleCustomizing", aTitles);

				var aAcademicTitles = oResponses["CRM_BUPA_ODATA.CustomizingAcademicTitle"];			
				aAcademicTitles.unshift({title:"", titleDescription:""});
				that.customizingModel.setProperty("/AcademicTitleCustomizing", aAcademicTitles);

				if (callbackCustomizingRead)
					callbackCustomizingRead.call(that);
			});
		},

		_refreshDropDownBoxes: function() {
			var aDropDownBoxesIDs = this._getIDForDropDownBoxes();
			for(var i in aDropDownBoxesIDs) {
				var oDropDownBox = this.byId(this.getView().getId() + "--" + aDropDownBoxesIDs[i]);
				if(oDropDownBox) {
					var oBinding = oDropDownBox.getBinding("selectedKey");
					if(oBinding) {
						oDropDownBox.bindProperty("selectedKey", oBinding.sPath);
					}
				}
			}
		},

		_getIDForDropDownBoxes: function() {
			return ["titleIDInput", "academicTitleIDInput"];
		},

		// #############################################################################################
		// Suggestion for account
		// #############################################################################################

		_setDefaultCompany: function(accountID, company) {
			var oModel = this.getView().getModel();
			var contactContextPath = this.getView().getBindingContext().getPath();
        	oModel.setProperty(contactContextPath + "/accountID", accountID);
        	oModel.setProperty(contactContextPath + "/company", company);
        	this._setCompany(accountID, company);
        },

		_setCompany: function(accountID, company) {
			var accountIDInput = this.getView().byId("accountIDInput");
        	if(accountIDInput)
        		accountIDInput.setValue(accountID);
        	var companyInput = this.getView().byId("companyValueHelp");
        	if(companyInput)
        		companyInput.setValue(company);
        },

        onCompanySuggestItemSelected: function(oEvent) {
        	var oItem = oEvent.getParameter("selectedItem");
        	var oAccount = null;
        	for(var i in oItem.getCustomData()) {
        		var oCustomData = oItem.getCustomData()[i];
        		if (oCustomData.getKey() == "oAccount")
        			oAccount = oCustomData.getValue();
        	}
        	this._setCompany(oAccount.accountID, oAccount.fullName);
			this._updateAddresses(oAccount.accountID);
        },

        onCompanyInputFieldChanged: function(oEvent) {
        	this.byId('companyValueHelp').setValueState(sap.ui.core.ValueState.None);
        	var companyInput = oEvent.getSource();
        	this._setCompany("", companyInput.getValue());
        	this._adaptAddressFields(false, true);
        	
        	companyInput.removeAllSuggestionItems();
        	companyInput.setFilterSuggests(false);
        	var fnCheckAccount = function(aAccounts) {
        		for(var i=0; i<aAccounts.length; i++) {
        			var oAccount = aAccounts[i];
        			if(oAccount.fullName.toUpperCase() == companyInput.getValue().toUpperCase()) {
        				this._setCompany(oAccount.accountID, oAccount.fullName);
        			}
        			var oCustomData = new sap.ui.core.CustomData({key:"oAccount", value:oAccount});
        			var oItem = new sap.ui.core.Item({text:oAccount.fullName, customData:oCustomData});
        			companyInput.addSuggestionItem(oItem);
        		}
        	};
        	this._readCompany(companyInput.getValue(),fnCheckAccount);
        },

        _readCompany: function(searchString,callbackRead) {
        	var that = this;
        	var delay = (searchString ? 500 : 0);
        	window.clearTimeout(this.liveChangeTimer);
        	if(delay) {
        		this.liveChangeTimer = window.setTimeout(function () {
        			// /AccountCollection?$filter=category ne '1' andsubstringof('XXXsearchstringXXX',name1)
        			that.oDataModel.read("/AccountCollection", null, '$top=10&$filter=category%20ne%20%27'+cus.crm.mycontacts.util.Constants.accountCategoryPerson+'%27%20and%20substringof(%27'+encodeURIComponent(searchString)+'%27,name1)', true,
        					function(oData, oResponse) {
        						var accountData = jQuery.parseJSON(JSON.stringify(oData));
        						if(callbackRead)
        							callbackRead.call(that,accountData.results);
        					},
        					function(oError) {
        						jQuery.sap.log.error("Read failed in S4->_readCompany:"+oError.response.body);
        					}
        			);
        		}, delay);
        	}
        },
        
        // #############################################################################################
		// Suggestion for last name.
		// #############################################################################################

        _setContact: function(oContact, contactID) {
        	var contactIDInput = this.getView().byId("contactIDInput");
        	var titleIDInput = this.getView().byId("titleIDInput");
        	var academicTitleIDInput = this.getView().byId("academicTitleIDInput");
        	var birthDateInput = this.getView().byId("birthDateInput");

        	if(oContact) {
        		if(contactIDInput)
        			contactIDInput.setValue(oContact.accountID);
        		var lastNameInput = this.getView().byId("lastNameInput");
        		if(lastNameInput)
        			lastNameInput.setValue(oContact.name1);

        		var firstNameInput = this.getView().byId("firstNameInput");
        		if(firstNameInput)
        			firstNameInput.setValue(oContact.name2);
        		if(titleIDInput)
        			titleIDInput.setSelectedKey(oContact.titleID);
        		if(academicTitleIDInput)
        			academicTitleIDInput.setSelectedKey(oContact.academicTitleID);
        		
        		var oDate = cus.crm.mycontacts.formatter.ReleaseFormatter.formatMediumDate(oContact.birthDate);
        		if(birthDateInput)
         			birthDateInput.setValue(oDate.toString());
      		} else {
        		var oldContactID = contactIDInput.getValue();
        		// In case the app is in creation mode and the user has changed
        		// the first time the first or last name of a suggested contact, the id,
        		// title, academic title and date of birth have to be reset.
        		if(!this.editMode && oldContactID && !contactID) {
        			titleIDInput.setSelectedKey("");
        			academicTitleIDInput.setSelectedKey("");
        			birthDateInput.setValue("");
        		}
        		contactIDInput.setValue(contactID);
        	}
        },

        onLastNameSuggestItemSelected: function(oEvent) {
        	var oItem = oEvent.getParameter("selectedItem");
        	var oContact = null;
        	for(var i in oItem.getCustomData()) {
        		var oCustomData = oItem.getCustomData()[i];
        		if (oCustomData.getKey() == "oContact")
        			oContact = oCustomData.getValue();
        	}
        	this._setContact(oContact, "");
        },

        onLastNameInputFieldChanged: function(oEvent) {
        	this.byId('lastNameInput').setValueState(sap.ui.core.ValueState.None);
        	if(this.editMode){
        		this._setContact("", this.byId("contactIDInput").getValue());
        	}else{
        		// In case, the user has selected a suggested contact while being in creation mode,
    			// but then changes first or last name, a new contact with newly generated contactID will be created.
        		this._setContact("", "");
        	}
        	
        	var lastNameInput = oEvent.getSource();
        	lastNameInput.removeAllSuggestionItems();
        	lastNameInput.setFilterSuggests(false);
        	var fnCheckContact = function(aContacts) {
        		for(var i=0; i<aContacts.length; i++) {
        			var oContact = aContacts[i];
        			var oCustomData = new sap.ui.core.CustomData({key:"oContact", value:oContact});
        			var oItem = new sap.ui.core.Item({text:oContact.fullName, customData:oCustomData});
        			lastNameInput.addSuggestionItem(oItem);
        		}
        	};
        	this._readContact(lastNameInput.getValue(),fnCheckContact);
        },

        onFirstNameInputFieldChanged: function(oEvent) {
        	if(this.editMode){
        		this._setContact("", this.byId("contactIDInput").getValue());
        	}else{
        		// In case, the user has selected a suggested contact while being in creation mode,
    			// but then changes first or last name, a new contact with newly generated contactID will be created.
        		this._setContact("", "");
        	}
        },

        _readContact:function(searchString,callbackRead) {
        	var that = this;
        	var delay = (searchString ? 500 : 0);
        	window.clearTimeout(this.liveChangeTimer);
        	if(delay) {
        		this.liveChangeTimer = window.setTimeout(function () {
        			// /AccountCollection?$filter=category eq '1' and substringof('XXXsearchstringXXX',name1)
        			that.oDataModel.read("/AccountCollection", null, '$top=10&$filter=category%20eq%20%27'+cus.crm.mycontacts.util.Constants.accountCategoryPerson+'%27%20and%20substringof(%27'+encodeURIComponent(searchString)+'%27,name1)', true,
        					function(oData, oResponse) {
        						var contactData = jQuery.parseJSON(JSON.stringify(oData));
        						if(callbackRead)
        							callbackRead.call(that,contactData.results);
        					},
        					function(oError) {
        						jQuery.sap.log.error("Read failed in S4->_readContact:"+oError.response.body);
        					}
        			);
        		}, delay);
        	}
        },

        // #############################################################################################
		// redefinition of framework methods
		// #############################################################################################

		getHeaderFooterOptions: function() {
			var that = this;
			return {
				sI18NFullscreenTitle : "DETAIL_TITLE",
				buttonList : [
					{
						sI18nBtnTxt : "S4_SAVE",
						sId : "saveButton",
						onBtnPressed : jQuery.proxy(this.onSaveButtonPressed, this)
					},
					{
						sI18nBtnTxt : "S4_CANCEL",
						sId : "cancelButton",
						onBtnPressed : jQuery.proxy(this.onCancelButtonPressed, this),
					},
				],
				onBack: that._getBackFunction(),
				oAddBookmarkSettings : {
					icon : "sap-icon://Fiori2/F0004"
				},
			};
		},

		_getBackFunction: function() {
			if (this.fullScreenMode || jQuery.device.is.phone){
				var that = this;
				return function(){that.onCancelButtonPressed();};
			}
			else
				return undefined;
		},

	});

}());

