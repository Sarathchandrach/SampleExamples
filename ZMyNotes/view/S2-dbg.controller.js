/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
jQuery.sap.require("cus.crm.notes.handler.ModelHandler");
jQuery.sap.require("sap.ca.ui.model.type.Date");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("cus.crm.notes.util.Util");

sap.ca.scfld.md.controller.ScfldMasterController
		.extend(
				"cus.crm.notes.view.S2",
				{

					oModelHandler : null,

					/***********************************************************
					 * overriding functions of base class
					 **********************************************************/

					onInit : function() {

						var oView = this.getView();

						this.oModelHandler = new cus.crm.notes.handler.ModelHandler();

						// TODO Workaround, because in function
						// sap.ui.model.odata.ODataModel.prototype._isRefreshNeeded
						// is an unnecessary refresh
						oView.getModel()._isRefreshNeeded = function(oRequest) {
							if (oRequest.requestUri.indexOf("$batch") != -1
									&& oRequest.async == true) {
								return false;
							}

							return sap.ui.model.odata.ODataModel.prototype
									._isRefreshNeeded(oRequest);
						};

						// handle sorting here
						this.oSortingOptions = {
							alphabetical : {
								path : "TeaserText",
								descending : false
							},
							date : {
								path : "ChangedAt",
								descending : true
							},
						};
						this.oDefaultSorting = this.oSortingOptions.date;
						this.oCurrentSorting = this.oDefaultSorting;

						// subscribe for events triggered from S3 controller
						var oBus = sap.ui.getCore().getEventBus();
						oBus.subscribe("cus.crm.notes", "SectionChanged",
								this.handleSectionChanged, this);
						oBus.subscribe("cus.crm.notes", "DeleteNote",
								this.handleDeleteNote, this);

						// flags for handling deletion of empty notes
						this.bSectionChanged = false;
						this.bHeaderAdded = false;
						this.bHeaderAddedListed = false;

						// flags for routing control
						// indicates whether deletion/search has taken place and
						// first item has to be selected
						this.bSelectFirstItemAfterChange = false;
						// indicates whether adding has taken place and the
						// details of first item has to be shown
						this.bSelectFirstItemAfterAdd = false;

						// required for initial creation of empty note
						// indicates whether request to backend was done
						// in case of count==0 this is ommitted by model
						this.bRequestCompleted = false;
						
						// flag whether search is active
						this.bFilterActive = false;

						oView.getModel().attachRequestSent(
								this.handleRequestSent, this);
						oView.getModel().attachRequestCompleted(
								this.handleRequestCompleted, this);

						// force completion of S3 batch queue, before executing
						// refresh of S2 master list
						this.oMHFHelper = this.oApplicationFacade.oApplicationImplementation.oMHFHelper;
						this.fnSuperHandleMasterSearch = this.oMHFHelper.handleMasterSearch;

						// override event handler for master list refresh event
						this.oMHFHelper.handleMasterSearch = jQuery
								.proxy(
										function(oController, oEvent) {
											var oSearchEvent = jQuery.extend(
													{}, oEvent); // unfortunately original event gets somehow corrupted
											this.oModelHandler.emptyBatchCallback = jQuery
													.proxy(
															function() {
																this.oModelHandler.emptyBatchCallback = function() {
																}; // clear callback
																this.fnSuperHandleMasterSearch
																		.call(
																				this.oMHFHelper,
																				oController,
																				oSearchEvent);
															}, this);
										}, this);

						//make restoring of selected item in scfld switchable
						//in case of added note etc. we want to omit this behaviour
						this.bPreventSetStoredSelectedItem = false;
						this.fnSuperSetStoredSelectedItem = this.oApplicationFacade.oApplicationImplementation.setStoredSelectedItem;
						this.oApplicationFacade.oApplicationImplementation.setStoredSelectedItem = jQuery.proxy(function(oController) {
								if(this.bPreventSetStoredSelectedItem){
									this.bPreventSetStoredSelectedItem = false;
								} else {
									this.fnSuperSetStoredSelectedItem.call(this.oApplicationImplementation, this);
								}	
							}, this);
						
   					    this.getList().getBinding("items").attachChange(this.handleMasterListChanged, this);
   					    
   					 sap.ca.ui.utils.busydialog.releaseBusyDialog();
					},

					onExit : function() {
						this.checkDeleteAddedNote();
						// unsubscribe from events in order to prevent issues
						// after reentering from shell
						var oBus = sap.ui.getCore().getEventBus();
						oBus.unsubscribe("cus.crm.notes", "SectionChanged",
								this.handleSectionChanged, this);
						oBus.unsubscribe("cus.crm.notes", "DeleteNote",
								this.handleDeleteNote, this);
						this.getView().getModel().detachRequestCompleted(
								this.handleRequestCompleted, this);
						this.getView().getModel().detachRequestSent(
								this.handleRequestSent, this);
   					    this.getList().getBinding("items").detachChange(this.handleMasterListChanged, this);
						// unsubscribe scfld events causing issues after leaving
						this._oMasterListBinding.detachChange(
								this._onMasterListChanged, this);
						// reset to original handler function
						this.oMHFHelper.handleMasterSearch = this.fnSuperHandleMasterSearch;
						this.oApplicationFacade.oApplicationImplementation.setStoredSelectedItem = this.fnSuperSetStoredSelectedItem;
  
					},

					/**
					 * @override
					 * 
					 */
					onDataLoaded : function() {
						sap.ca.scfld.md.controller.ScfldMasterController.prototype.onDataLoaded
								.call(this);
						//when using separate count request(isCountSupported===true) - no request completed is triggered 
						// and we have to add the initial empty note here 
						if (!this.bRequestCompleted){
							if (this.getList().getItems().length === 0){								
								this.addNote();
							}
						}
						this.bRequestCompleted = false;
						if (this.getList().getItems().length === 0){
							this.navToEmptyView();
						}

					},

					setListItem : function(oItem) {

						if (oItem === null) {
							return;
						}
						var path = oItem.getBindingContext().getPath();
						this.selectedNoteGuid = oItem.getModel().getProperty(
								path).NoteGuid;
						sap.ca.scfld.md.controller.ScfldMasterController.prototype.setListItem
								.call(this, oItem);
						if (!this.bIsReturningFromAddInSearch)
							this.checkDeleteAddedNote();
						else
							this.bIsReturningFromAddInSearch = false;
					},

					/**
					 * @override
					 * 
					 * @param oItem
					 * @param sFilterPattern
					 * @returns {*}
					 */
					applySearchPatternToListItem : function(oItem,
							sFilterPattern) {

						if (sFilterPattern.substring(0, 1) === "#") {
							var sTail = sFilterPattern.substr(1);
							var sDescr = oItem.getBindingContext().getProperty(
									"Name").toLowerCase();
							return sDescr.indexOf(sTail) === 0;
						} else {
							return sap.ca.scfld.md.controller.ScfldMasterController.prototype.applySearchPatternToListItem
									.call(null, oItem, sFilterPattern);
						}

					},

					/**
					 * @override
					 * 
					 * @param sFilterPattern
					 *            the content of the search field
					 * @param oBinding
					 *            the context binding of the list items to be
					 *            modified.
					 */
					applyBackendSearchPattern : function(sFilterPattern,
							oBinding) {
						this.checkDeleteAddedNote();	//Added to remove added note before searching
						
						this.bSelectFirstItemAfterChange = true;
						this.bFilterActive = (sFilterPattern != "");
						if (sFilterPattern != "") {
							// console.log(sFilterPattern);
							var oTeaserTextFilter = new sap.ui.model.Filter(
									"TeaserText",
									sap.ui.model.FilterOperator.Contains,
									sFilterPattern);
							var aFilters = [ oTeaserTextFilter ];
							oBinding.filter(aFilters);
							// force selection of first item after search
						} else {
							var aFilters = [];
							oBinding.filter(aFilters);
						}
					},

					/**
					 * @override
					 * 
					 */
					isBackendSearch : function() {
						return true;
					},
					
					/**
					 * @override
					 * 
					 * @param sContext
					 *          contains the hash provided via bookmark navigation Deeplink navigation with backend search
					 *          active: when navigating to the app via bookmark, the bookmarked item might not be part of the
					 *          initially loaded list items (usually the case for scenarios where more items exist in the
					 *          backend than shown at once in the list). The assumption in this case is that the backend search
					 *          is active in order to be able to retrieve further list items. If the check on the initial list
					 *          against the navigation context value gives no result, this method is being called. This method
					 *          needs to be overridden by apps where this scenario applies; the app has then to take care about
					 *          retrieving the correct item via backend search
					 */
					applyFilterFromContext : function(sContext) {
						//this.showEmptyView();
					},

					getHeaderFooterOptions : function() {
						var oHeaderFooterOptions = {
							sI18NMasterTitle : "MASTER_TITLE",
							sI18NSearchFieldPlaceholder : this
									.get_i18n_Text("NOTE_SEARCH_PLACEHOLDER"),
							oSortOptions : {
								aSortItems : [
										{
											key : this.oSortingOptions.alphabetical.path,
											text : this
													.get_i18n_Text("SORTING_POPOVER_ALPHABETICAL")
										},
										{
											key : this.oSortingOptions.date.path,
											text : this
													.get_i18n_Text("SORTING_POPOVER_DATE")
										} ],
								sSelectedItemKey : this.oCurrentSorting.path, // this.selectedSorter,
								onSortSelected : jQuery.proxy(this.handleSort,
										this)
							},
							onAddPress : jQuery
									.proxy(this.handleAddPress, this)
						};
						
						// EXTENSION POINT to be able to extend header footer
						// options
						/**
						 * @ControllerHook extHookGetHeaderFooterOptions is the
						 *                 controller hook where the
						 *                 headerFooterOptions can be extended.
						 *                 Attributes like master list title,
						 *                 sorting can be defined in addition to
						 *                 the existing headerFooterOptions
						 * 
						 * @callback sap.ca.scfld.md.controller.BaseMasterController~extHookGetHeaderFooterOptions
						 * @param {object}
						 *            oHeaderFooterOptions
						 * @return {void}
						 */
						if (this.extHookGetHeaderFooterOptions)
							this
									.extHookGetHeaderFooterOptions(oHeaderFooterOptions);
						
						return oHeaderFooterOptions;
					},
					
					navToEmptyView : function() {
						var oList = this.getList();
						oList.removeSelections();
					
						//only replace the hash here, adding another history entry for not found is bad, 
						//since if the user goes back in history he will end up getting forwarded again
						this.oRouter.navTo("noData", {
							viewTitle : "DETAIL_TITLE",
							languageKey : "NO_ITEMS_AVAILABLE"
						}, true);
						return this;
					},
					
					/***********************************************************
					 * event handlers
					 **********************************************************/
					
					handleMasterListChanged : function (oEvent) {
						var oList = this.getList();
						if (oList.getItems().length > 0) {
							if (this.bSelectFirstItemAfterChange) {
								oList.removeSelections(true); 
								if (jQuery.device.is.phone){
									oList.getItems()[0].setSelected(true);
								} else {
									this.selectFirstItem();									
								}
								this.bSelectFirstItemAfterChange = false;
								this.bPreventSetStoredSelectedItem = true;
							} else if (this.bSelectFirstItemAfterAdd) {
								this.selectFirstItem();
								this.bSelectFirstItemAfterAdd = false;	
								this.bPreventSetStoredSelectedItem = true;
							}
						}
					},
					
					handleRequestSent : function() {
						this.getList().setNoDataText(
								this.get_i18n_Text("LOADING_TEXT"));
					},

					handleRequestCompleted : function() {
						this.bRequestCompleted = true;
						
						if (this.bFilterActive) {
							this.getList().setNoDataText(
									this.get_i18n_Text("NO_MATCHING_ITEMS"));
						} else {
							this.getList().setNoDataText(
									this.get_i18n_Text("NO_DATA_TEXT"));
						}
					},

					handleAddPress : function() {
						this.oModelHandler.emptyBatchCallback = jQuery
								.proxy(
										function() {
											this.oModelHandler.emptyBatchCallback = function() {
											}; // clear function
											this.addNote(); // set new function
										}, this);
					},

					handleSort : function(sKey) {
						if (sKey === this.oSortingOptions.alphabetical.path) {
							this.oCurrentSorting = this.oSortingOptions.alphabetical;
						} else {
							this.oCurrentSorting = this.oSortingOptions.date;
						}
						this.updateSorting(this.oCurrentSorting.path,
								this.oCurrentSorting.descending, false);

					},

					handleSectionChanged : function(channelId, eventId, data) {
						this.bSectionChanged = data;

						if (this.bSectionChanged) {
							this.bSectionChanged = false;
							this.bHeaderAdded = false;
							this.bHeaderAddedListed = false;

							// section has been edited
							this.sAddedNoteGuid = undefined;
						}
					},

					handleDeleteNote : function(channelId, eventId, data) {

						var oModel = this.getView().getModel();
						
						// delete saved Note Guid
						var nGuid = oModel.getData(data.path).NoteGuid;
						if (nGuid === this.sAddedNoteGuid) {
							this.sAddedNoteGuid = undefined;
						}
						
						this.addDeleteNoteOperation(oModel, data.path);
						if (this.getList().getItems()
								&& this.getList().getItems().length === 1
								&& !this.bFilterActive) {
							this.addCreateNoteOperation(oModel);
						}
						var fnError = jQuery
								.proxy(
										function() {
											sap.ca.ui.message
													.showMessageBox({
														type : sap.ca.ui.message.Type.ERROR,
														message : this
																.get_i18n_Text("MSG_DELETION_NOTE_FAILED"),
														details : this
																.get_i18n_Text("MSG_LONG_DELETION_OBJECT_FAILED")
													});
										}, this);
						oModel.submitBatch(jQuery.proxy(function(oData,
								response, aErrorResponses) {
							if (aErrorResponses.length > 0) {
								fnError.call();
							} else {
								this.successBatchAdd(oData, 1);
								this.getList().getBinding("items").refresh();   //Refresh the list after delete, added after UI5 upgrade
								this.bSelectFirstItemAfterChange = true;
							}
						}, this), fnError, false);// execute synchronously

					},

					/***********************************************************
					 * helper functions
					 **********************************************************/

					get_i18n_Text : function(textName) {
						return this.oApplicationFacade.getResourceBundle().getText(textName);
					},

					updateSorting : function(sPath, bDescending, bRefresh) {
						var oList = this.getList();
						var oBinding = oList.getBinding("items");
						var oSorter = new sap.ui.model.Sorter(sPath,
								bDescending);
						oBinding.sort([ oSorter ]);
						if (bRefresh)
							oBinding.refresh();
					},

					addNote : function() {
						// switch off Searching ...
						if (this.bFilterActive) {
							 if (this._oMasterListBinding !== undefined) {
								 // delete Search string
								 this._oControlStore.oMasterSearchField.clear();						
								 this.handleSort(this.oSortingOptions.date.path);
								 // this.bIsReturningFromAddInSearch is used in function setListItem to manage
								 // the check of deletion of empty notes. When a search is successful (items>0)
								 // this.checkDeleteAddedNote() should be NOT called. Otherwise the newly added note 
								 // is deleted immediately ....
								 this.bIsReturningFromAddInSearch = (this.getList().getItems().length > 0);
							 }
						}
						
						var oModel = this.getView().getModel();
						this.addCreateNoteOperation(oModel);

						var fnError = jQuery
								.proxy(
										function() {
											sap.ca.ui.message
													.showMessageBox({
														type : sap.ca.ui.message.Type.ERROR,
														message : this
																.get_i18n_Text("MSG_CREATION_NOTE_FAILED"),
														details : this
																.get_i18n_Text("MSG_LONG_CREATION_NOTE_FAILED")
													});
										}, this);
						oModel.submitBatch(jQuery.proxy(function(oData,
								response, aErrorResponses) {
							if (aErrorResponses.length > 0) {
								fnError.call();
							} else {
								this.successBatchAdd(oData, 0);
								this.getList().getBinding("items").refresh();   //Refresh the list after add, added after UI5 upgrade
								this.bSelectFirstItemAfterAdd = true;
							}
						}, this), fnError, false);// execute synchronously

						// we might need the two following lines in the future
						// in case we have some sorting type that would push the
						// newest node away from the first position
						// if (this._oCurrentSorting !==
						// this._oSortingOptions.date)
						// this.updateSorting(this._oSortingOptions.date.path,
						// this._oSortingOptions.date.descending, false);

					},

					successBatchAdd : function(oData, batchOpIndex) {
						if (!oData.__batchResponses[batchOpIndex]) {
							return;
						}
						var oDataOp = oData.__batchResponses[batchOpIndex].__changeResponses[0].data;
						var sAddedNoteGuid = oDataOp.NoteGuid;
						if (this.sAddedNoteGuid === undefined) {
							// when addNote is pressed twice, the first added
							// note should be deleted
							this.sAddedNoteGuid = sAddedNoteGuid;
							this.sAddedNoteGuidStore = undefined;
						} else {
							this.sAddedNoteGuidStore = sAddedNoteGuid;
						}
						this.bHeaderAdded = true;
						this.oModelHandler.injectFirstSectionFromMaster(this.getView().getModel(), sAddedNoteGuid);
					},

					addDeleteNoteOperation : function(oModel, path) {
						var aChangeOperations = [];
						var oParams = {};
						var oEntry = {};
						var oOperation = oModel.createBatchOperation(path,
								"DELETE", oEntry, oParams);
						aChangeOperations.push(oOperation);
						oModel.addBatchChangeOperations(aChangeOperations);
					},

					addCreateNoteOperation : function(oModel) {
						var aChangeOperations = [];
						var oParams = {};
						var oEntry = {};
						oEntry.TeaserType = "T";
						oEntry.TeaserText = "";//this.get_i18n_Text("DETAIL_TITLE");
						var oOperation = oModel.createBatchOperation(
								'/NoteHeaders', "POST", oEntry, oParams);
						aChangeOperations.push(oOperation);
						oModel.addBatchChangeOperations(aChangeOperations);
					},

					checkDeleteAddedNote : function() {
						if (this.bHeaderAddedListed && !this.bSectionChanged) {
							this.bHeaderAddedListed = false;
							var oModel = undefined;
							var path = undefined;
							var list = this.getView().byId("list");
							var listItems = list.getItems();
							for ( var i = 0; i < listItems.length; i++) {
								var localGuid = listItems[i]
										.getBindingContext().getProperty().NoteGuid;
								if (localGuid === this.sAddedNoteGuid) {
									oModel = listItems[i].getBindingContext()
											.getModel();
									path = listItems[i].getBindingContext()
											.getPath();
									break;
								}
							}

							if (oModel === undefined) {
								// if search result is positive, newly added note is not available
								// check for deletion should be running next time again (next round)
								if (this.bFilterActive === true) {
									  this.bHeaderAddedListed = true;
								}
								return;
							}

							var oParams = {
								fnSuccess : function() {
								},
								fnError : jQuery
										.proxy(
												function() {
													sap.ca.ui.message
															.showMessageBox({
																type : sap.ca.ui.message.Type.ERROR,
																message : this
																		.get_i18n_Text("MSG_DELETION_NOTE_FAILED"),
																details : this
																		.get_i18n_Text("MSG_LONG_DELETION_OBJECT_FAILED")
															});
												}, this)
							};
							oModel.remove(path, oParams);
							this.getList().getBinding("items").refresh();   //Refresh the list after delete, added after UI5 upgrade

							if (this.sAddedNoteGuidStore === undefined) {
								this.sAddedNoteGuid = undefined;
								this.bHeaderAddedListed = false;
							} else {
								this.sAddedNoteGuid = this.sAddedNoteGuidStore;
								this.sAddedNoteGuidStore = undefined;
								// AddNote-Modus still active
								this.bHeaderAddedListed = true;
							}
							this.bSectionChanged = false;

						} else if (this.bHeaderAdded) {
							this.bHeaderAddedListed = true;
							this.bHeaderAdded = false;
						}
					},

				});
