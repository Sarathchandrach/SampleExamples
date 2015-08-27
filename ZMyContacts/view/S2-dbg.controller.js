/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/*global jQuery: false, sap: false, cus: false, console: false, window : false */
/*jslint plusplus: true */
(function () {
	'use strict';
	jQuery.sap.require("sap.ca.scfld.md.controller.BaseMasterController");

	sap.ca.scfld.md.controller.BaseMasterController.extend("cus.crm.mycontacts.view.S2", {
		sDefaultValue:"-1",
		iAccountID:undefined,
		iContactID:undefined,
		bToolbarInfo:false,

		aFilterKey:{
			sAll:"All",
			sMy:"My Contacts"
		},

		aSorterKey:{
			sLastName:"lastName",
			sFirstName:"firstName",
			sCompany:"company"
		},

		constructor:function () {
			this.bHasInit = true;
		},

		onInit:function () {
			var self = this;
			// get routing object for navigation
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			this.oApplicationImplementation = sap.ca.scfld.md.app.Application.getImpl();
			this.oApplicationFacade = this.oApplicationImplementation.oConfiguration.oApplicationFacade;

			// Retrieve the application bundle
			this.resourceBundle = this.oApplicationFacade.getResourceBundle();

			this._initHeaderFooterOptions();

			// get account or contact id : if there is the cross application,
			// the account or contact id are gave
			this._getParameters();

			this.oRouter.attachRouteMatched(this._handleRouteMatched, this);
			
			this.oApplicationImplementation.oMHFHelper.defineMasterHeaderFooter(this);
		},

		getHeaderFooterOptions:function () {
			return this.oHeaderFooterOptions;
		},

		setListItem: function(oItem, bNotNav) {
			var that = this;
			this._handleUnsavedChanges(
				function() {
					that._handleSetListItem(oItem, bNotNav);
				},
				function() {
					if(that.prevItem) {
						var oList = that.getList();
						oList.removeSelections();
						oList.setSelectedItem(that.prevItem, true);
					}
				}
			);
		},

		_handleSetListItem: function(oItem, bNotNav) {
			if (oItem) {
				var oList = this.getList(), oParameter;
				oList.removeSelections();
				oList.setSelectedItem(oItem, true);

				if (!bNotNav) {
					oParameter = {
						contextPath:oItem.getBindingContext().sPath.substr(1)
					};
					
					this.sContext = oItem.getBindingContext().sPath.substr(1);

					this._updateParameter(oParameter);

					// Store oItem as previous item. In case of future navigation to
					// another item with unsaved changes for previous item,
					// the user might cancel the navigation and want to stay at previous
					// item to e.g. save changes.
					this.prevItem = oItem;
					this.oRouter.navTo("detail2", oParameter, !jQuery.device.is.phone);
				}
			}
		},
		
		_handleUnsavedChanges: function(fnConfirmed, fnRejected) {
			// In case navigation to another list item is triggered
			// and there are unsaved changes on edit screen,
			// data loss pop up is opened.
			var oCurrentDetailPage = sap.ca.scfld.md.app.Application.getImpl().oSplitContainer.getCurrentDetailPage();
			// Check if the controller of the current detail page is the edit controller.
			if(oCurrentDetailPage && oCurrentDetailPage.getController() && oCurrentDetailPage.getController()._checkSaveNeeded) {
				var oCurrentDetailController = oCurrentDetailPage.getController();
				// Check if the edit controller has unsaved changes.
				if(oCurrentDetailController.getView().getBindingContext() && oCurrentDetailController._checkSaveNeeded()) {
					var that = this;
                    sap.m.MessageBox.confirm(
                       cus.crm.mycontacts.util.Util.geti18NText("CONFIRM_CANCEL"),
                       jQuery.proxy(function (confirmed) {
                              if(confirmed === "OK") {
                                    oCurrentDetailController.getView().setBindingContext(null);
                                    if(oCurrentDetailController._cleanUp && oCurrentDetailController._setEmptyScreen) {
                                    	// Effects of clean up are only visible in creation mode.
                                        oCurrentDetailController.editMode = false;
                                        oCurrentDetailController._cleanUp();
                                        oCurrentDetailController._setEmptyScreen();	
                                    }
                                    fnConfirmed();
                              } else {
                                    fnRejected();
                              }
                       }, that));
				} else {
                  fnConfirmed();
				}
			} else {
				fnConfirmed();
			}
		},

		navToEmpty:function () {
			this.updateMasterTitle();
			this._showLoadingText(false);
			if (!jQuery.device.is.phone) {
				this.oRouter.navTo("noData", {
					viewTitle:"DETAIL_TITLE",
					languageKey:"NO_ITEMS_AVAILABLE"
				}, true);
			}
		},

		/**
		 * Display "Loading..." when the list is loading after search, filter,
		 * sort ... and display usual "No data" after
		 *
		 * @param bLoading
		 * @private
		 */
		_showLoadingText:function (bLoading) {
			if (bLoading) {
				this.getList().setNoDataText(this.resourceBundle.getText("LOADING_TEXT"));
			} else {
				this.getList().setNoDataText(this.resourceBundle.getText("NO_DATA_TEXT"));
			}
		},

		/**
		 * @Override contains the server filter
		 */
		applyBackendSearchPattern:function () {
			this._applyFilter();
		},

		/**
		 * Handle for master list sort
		 */
		handleSort:function (sKey) {
			this._setSelectedSort(sKey);
			var oSorter = this._createSorter(), oListBinding;

			// update master list binding
			oListBinding = this.getList().getBinding("items");
			if (oListBinding) {
				oListBinding.aSorters = oSorter;
				oListBinding.sort(oSorter);
				if (!jQuery.device.is.portrait)
					oListBinding.attachChange(this._selectFirstElement, this);
			}
		},

		/**
		 * determines whether search (triggered by search field) is performed on
		 * backend or frontend (frontend being default behavior).
		 */
		isBackendSearch:function () {
			return true;
		},

		handleFilter:function (sKey) {
			this._setSelectedFilter(sKey);
			this._applyFilter();
		},

		updateMasterTitle:function () {
			var iNumberOfContacts, oScaffold;
			iNumberOfContacts = this.getList().getBinding('items').getLength();
			oScaffold = this.oApplicationImplementation.oMHFHelper;
			oScaffold.setMasterTitle.apply(oScaffold, [ this, iNumberOfContacts ]);
			this._showLoadingText(true);
		},

		/**
		 * Handle for adding
		 */
		onAddButtonPressed:function () {
			var that = this;
			this._handleUnsavedChanges(function() {that._handleAdd();}, function() {});
		},

		/**
		 * Handle for adding
		 */
		_handleAdd: function() {
			var oParameter = {
				editPath:"Old" + this.sContext
			};
			this._updateParameter(oParameter);
			this.oRouter.navTo("subDetail", oParameter, true);
		},

		_createSorter:function () {
			var oSorter, oSelectedSort = this._getSelectedSort();
			switch (oSelectedSort) {
				case this.aSorterKey.sCompany:
					oSorter = [ new sap.ui.model.Sorter(oSelectedSort, false, this._handleCompanyGroup), new sap.ui.model.Sorter("lastName", false, false) ];
					break;
				case this.aSorterKey.sLastName:
					oSorter = [ new sap.ui.model.Sorter(oSelectedSort, false, this._handleLastNameGroup) ];
					break;
				default:
					oSorter = [ new sap.ui.model.Sorter(oSelectedSort, false, this._handleFirstNameGroup) ];
			}

			return oSorter;
		},

		_handleFirstNameGroup:function (oContext) {
			var oText = oContext.getProperty("firstName");
			if (oText && typeof oText === "string") {
				return oText.charAt(0).toUpperCase();
			}
			return "";
		},

		_handleLastNameGroup:function (oContext) {
			var oText = oContext.getProperty("lastName");
			if (oText && typeof oText === "string") {
				return oText.charAt(0).toUpperCase();
			}
			return "";
		},

		_handleCompanyGroup:function (oContext) {
			return oContext.getProperty("company");
		},

		_getParameters:function () {
			var sComponentId, oMyComponent, aStartupParameters;
			sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
			oMyComponent = sap.ui.component(sComponentId);

			if (oMyComponent && oMyComponent.getComponentData()) {
				aStartupParameters = oMyComponent.getComponentData().startupParameters;

				if (aStartupParameters) {
					jQuery.sap.log.debug("startup parameters of CRM-MyContacts are " + JSON.stringify(aStartupParameters));

					if (aStartupParameters.accountID && aStartupParameters.accountID[0]) {
						this.iAccountID = aStartupParameters.accountID[0];
					}

					if (aStartupParameters.contactID && aStartupParameters.contactID[0]) {
						this.iContactID = aStartupParameters.contactID[0];
					}

					if (this.iAccountID || this.iContactID) {
						this._setSelectedSort(this.aSorterKey.sLastName);
						this._setSelectedFilter(this.aFilterKey.sAll);
					}
				}
			}
		},

		_getFilters:function () {
			var aFilters = [], bIsMyContact = this._getSelectedFilter() !== this.aFilterKey.sAll, sSearch;

			sSearch = this._getSearchText();

			aFilters.push(new sap.ui.model.Filter("isMyContact", sap.ui.model.FilterOperator.EQ, bIsMyContact));

			if (this.iAccountID) {
				aFilters.push(new sap.ui.model.Filter("accountID", sap.ui.model.FilterOperator.EQ, this.iAccountID));
			}

			if (this.iContactID) {
				aFilters.push(new sap.ui.model.Filter("contactID", sap.ui.model.FilterOperator.EQ, this.iContactID));
			}

			// add filter from search
			if (sSearch) {
				aFilters.push(new sap.ui.model.Filter("fullName", sap.ui.model.FilterOperator.Contains, sSearch));
			}

			return aFilters;
		},

		_selectContextPath:function (oEvent) {
			var oList = this.getList(), aItems, oModel, oElement, i, len, sPath, oBindingContext;
			if(oList) {
				aItems = oList.getItems();
			}
			this.byId("toolbarInfo").setVisible(this.bToolbarInfo);
			if(this.contextPath) {
				if(aItems && aItems.length > 0) {
					oEvent.getSource().detachChange(this._selectContextPath, this);
					oModel = oList.getModel();
					sPath = "/" + this.contextPath;
					oElement = oModel.getProperty(sPath);
					if (oElement) {
						//Set the contextual filtering
						//In case of cross-navigation, the app might be started with given accountID or contactID
						if(this.bToolbarInfo) {
							this._setToolbarInfoText(oElement.fullName, oElement.company);
						}
						
						for (i = 0, len = aItems.length; i < len; i++) {
							oBindingContext = aItems[i].getBindingContext();
							if (oBindingContext && oBindingContext.sPath === sPath) {
								this.contextPath = undefined;
								this.setListItem(aItems[i], jQuery.device.is.phone);
								this._setFocus(oList, aItems[i]);
								this.updateMasterTitle();
								return;
							}
						}
					} else {
						if (oList._oGrowingDelegate._iItemCount < this.getList().getBinding('items').getLength()) {
							oList._oGrowingDelegate.requestNewPage();
							oEvent.getSource().attachChange(this._selectContextPath, this);
						} else {
							this.navToEmpty();
						}
					}
				} else {
					this.navToEmpty();
				}
			}
		},

		_selectFirstElement:function (oEvent) {
			var oList = this.getList(), aItems = oList.getItems(), i, len, oBindingContext, oElement;
			oEvent.getSource().detachChange(this._selectFirstElement, this);
			if (aItems.length > 0) {
				for (i = 0, len = aItems.length; i < len; i++) {
					oBindingContext = aItems[i].getBindingContext();
					if (oBindingContext && oBindingContext.sPath) {
						this.setListItem(aItems[i], jQuery.device.is.phone);
						//Set the contextual filtering
						//In case of cross-navigation, the app might be started with given accountID or contactID
						this.byId("toolbarInfo").setVisible(this.bToolbarInfo);
						if(this.bToolbarInfo) {
							oElement = oList.getModel().getProperty(oBindingContext.sPath);
							if (oElement) {
								this._setToolbarInfoText(oElement.fullName, oElement.company);
							}
						}
						
						this.updateMasterTitle();
						return;
					}
				}
			}

			this.navToEmpty();
		},

		_initHeaderFooterOptions:function () {
			var that = this;
			this.oHeaderFooterOptions = {
				sI18NMasterTitle:"MASTER_TITLE_FOR_MY_CONTACTS",
				buttonList:[],
				onBack: that._getBackFunction(),
				oFilterOptions:{
					aFilterItems:[
						{
							key:this.aFilterKey.sAll,
							text:this.resourceBundle.getText("ALL_CONTACTS")
						},
						{
							key:this.aFilterKey.sMy,
							text:this.resourceBundle.getText("MY_CONTACTS")
						}
					],
					sSelectedItemKey:this.aFilterKey.sMy,
					onFilterSelected:jQuery.proxy(this.handleFilter, this)
				},
				oSortOptions:{
					aSortItems:[
						{
							key:this.aSorterKey.sLastName,
							text:this.resourceBundle.getText("CONTACT_LAST_NAME")
						},
						{
							key:this.aSorterKey.sFirstName,
							text:this.resourceBundle.getText("CONTACT_FIRST_NAME")
						},
						{
							key:this.aSorterKey.sCompany,
							text:this.resourceBundle.getText("CONTACT_ACCOUNT")
						}
					],
					sSelectedItemKey:this.aSorterKey.sLastName,
					onSortSelected:jQuery.proxy(this.handleSort, this)
				},
				onAddPress:jQuery.proxy(this.onAddButtonPressed, this)
			};
		},

		_getSelectedFilter:function () {
			return this.oHeaderFooterOptions.oFilterOptions.sSelectedItemKey;
		},

		_setSelectedFilter:function (sKey) {
			if (this.oHeaderFooterOptions) {
				this.oHeaderFooterOptions.oFilterOptions.sSelectedItemKey = sKey;

				switch (sKey) {
					case this.aFilterKey.sAll:
						this.oHeaderFooterOptions.sI18NMasterTitle = "MASTER_TITLE";
						break;
					default:
						this.oHeaderFooterOptions.sI18NMasterTitle = "MASTER_TITLE_FOR_MY_CONTACTS";
						break;
				}
			}
		},

		_getSelectedSort:function () {
			return this.oHeaderFooterOptions.oSortOptions.sSelectedItemKey;
		},

		_setSelectedSort:function (sKey) {
			if (this.oHeaderFooterOptions) {
				this.oHeaderFooterOptions.oSortOptions.sSelectedItemKey = sKey;
			}
		},

		_handleRouteMatched:function (oEvent) {
			var name = oEvent.getParameter("name");
			switch (name) {
				case "master":
					this._masterRouteMatched(oEvent);
					break;
				case "selected":
					this._selectedRouteMatched(oEvent);
					break;
			}
		},

		_masterRouteMatched:function (oEvent) {
			var oList = this.getList(), oBinding, oArguments;
			if (this.bHasInit) {
				this.bHasInit = false;

				oArguments = oEvent.getParameter("arguments");

				this._initState(oArguments);

				this._createBindAggregation();

				if (oArguments.itemCount) {
					oList._oGrowingDelegate._iItemCount = oArguments.itemCount;
				}

				this.oApplicationImplementation.setModels(this);

				oBinding = oList.getBinding("items");
				if (this.contextPath) {
					oBinding.attachChange(this._selectContextPath, this);
				} else if (!this.editPath) {
					oBinding.attachChange(this._selectFirstElement, this);
				}
				// Fix for issue with PullToRefresh control
				// Hiding behavior does only work as expected
				// if this._oMasterListBinding is set 
				this._oMasterListBinding = this.getList().getBinding("items");
			}
		},

		_initState:function (oState) {
			if (oState) {

				if (oState.contextPath) {
					this.contextPath = oState.contextPath;
				}

				if (oState.editPath) {
					this.editPath = oState.editPath;
				}

				if (oState.filter) {
					this._setSelectedFilter(oState.filter);
				}

				if (oState.sort) {
					this._setSelectedSort(oState.sort);
				}

				if (oState.accountID && oState.accountID !== this.sDefaultValue) {
					this.iAccountID = oState.accountID;
					this.bToolbarInfo = true;
				}

				if (oState.contactID && oState.contactID !== this.sDefaultValue) {
					this.iContactID = oState.contactID;
					this.bToolbarInfo = true;
				}
				
				if (oState.itemCount && oState.itemCount !== this.sDefaultValue) {
					this.iItemCount = parseInt(oState.itemCount, 0);
				}

				if (oState.isSearch && oState.isSearch === "true" && this._oControlStore && this._oControlStore.oMasterSearchField) {
					this._oControlStore.oMasterSearchField.setValue(oState.search);
				}

				this.oApplicationImplementation.oMHFHelper.defineMasterHeaderFooter(this);
			}
		},

		_selectedRouteMatched:function (oEvent) {
			var oArguments, oList, oBinding, aFilters;

			oArguments = {
				contextPath:oEvent.getParameter("arguments").contextPath,
				filter:this.aFilterKey.sAll,
				isSearch:"true",
				search:oEvent.getParameter("arguments").name
			};

			this._initState(oArguments);

			this.iAccountID = undefined;
			this.iContactID = undefined;

			oList = this.getList();
			oBinding = oList.getBinding("items");
			if (oBinding) {
				oBinding.aApplicationFilters = [];

				aFilters = this._getFilters();

				// update master list binding
				oBinding.filter(aFilters);

				oBinding.attachChange(this._selectContextPath, this);
			}
		},

		_createBindAggregation:function () {
			var oTemplate, aFilters, aSorter, oList;
			oTemplate = this.getList().getItems()[0].clone();
			aFilters = this._getFilters();
			aSorter = this._createSorter();
			oList = this.getList();
			oList.bindAggregation("items", {
				path:'/ContactCollection',
				template:oTemplate,
				filters:aFilters,
				sorter:aSorter,
				parameters:{
					expand:'Photo,WorkAddress'
				}
			});
		},

		_getSearchText:function () {
			return this._oControlStore && this._oControlStore.oMasterSearchField && this._oControlStore.oMasterSearchField.getValue();
		},

		_updateParameter:function (oParameter) {
			var iAccountID = this.sDefaultValue, iContactID = this.sDefaultValue, sSearch = this.sDefaultValue, bIsSearch = false;
			if (this.iAccountID) {
				iAccountID = this.iAccountID;
			}
			if (this.iContactID) {
				iContactID = this.iContactID;
			}

			if (this._getSearchText()) {
				sSearch = this._getSearchText();
				bIsSearch = true;
			}

			oParameter.filter = this._getSelectedFilter();
			oParameter.sort = this._getSelectedSort();
			oParameter.isSearch = bIsSearch;
			oParameter.search = sSearch;
			oParameter.accountID = iAccountID;
			oParameter.contactID = iContactID;
			oParameter.itemCount = this.getList()._oGrowingDelegate._iItemCount;
		},

		_setFocus:function (oList, oItem) {
			// fix for ipad. This timeout solution is defined by Internal
			// Message 3789770/2013
			jQuery.sap.delayedCall(500, this, function () {
				this.getView().byId("page").getScrollDelegate().scrollTo(0, oItem.$().offset().top - oList.$().offset().top);
			});
		},

		_handleToolBar:function () {
			this.byId("toolbarInfo").setVisible(false);
			this.bToolbarInfo = false;
			this.iAccountID = undefined;
			this.iContactID = undefined;
			this._applyFilter();
		},
		
		/**
		 * Set the text of the info-toolbar.
		 * Text depends on whether contactID or accountID is given when launching the app.
		 *
		 * @param contactName
		 * @param companyName 
		 * @private
		 */
		_setToolbarInfoText:function(contactName, companyName) {
			if(this.iContactID && this.iAccountID) {
				this.byId("labelInfo").setText(this.resourceBundle.getText('FILTERED_BY', [contactName + ", " + companyName]));
			}
			else if(this.iContactID) {
				this.byId("labelInfo").setText(this.resourceBundle.getText('FILTERED_BY', [contactName]));
			}
			else if(this.iAccountID) {
				this.byId("labelInfo").setText(this.resourceBundle.getText('FILTERED_BY', [companyName]));
			}
		},

		_applyFilter:function () {
			var aFilters = this._getFilters(), oListBinding;

			// HACK: Remove initial filter (Status = New) which is by default
			// concatenated (or) to custom filters
			oListBinding = this.getList().getBinding("items");

			if (oListBinding) {
				oListBinding.aApplicationFilters = [];

				// update master list binding
				oListBinding.filter(aFilters);

				if (jQuery.device.is.portrait) {
					var that = this;
					oListBinding.attachChange(function () {
						that._showLoadingText(false);
					});
				}
				else {
					oListBinding.attachChange(this._selectFirstElement, this);
				}

				this.updateMasterTitle();
			}
		},

		_getBackFunction: function() {
			return function(){
				var oCurrentDetailPage = sap.ca.scfld.md.app.Application.getImpl().oSplitContainer.getCurrentDetailPage();
				if(oCurrentDetailPage && oCurrentDetailPage.getControllerName() == "cus.crm.mycontacts.view.S4") {
					var oCurrentDetailController = oCurrentDetailPage.getController();
					oCurrentDetailController._navBack();
				} else {
					window.history.back(1);
				}
			};
		}

	});
}());
