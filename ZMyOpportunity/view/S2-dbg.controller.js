/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("cus.crm.opportunity.util.Formatter");
jQuery.sap.require("sap.ca.ui.utils.busydialog");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseMasterController");
jQuery.sap.require("cus.crm.opportunity.util.schema");
jQuery.sap.require("cus.crm.opportunity.util.Util");

sap.ca.scfld.md.controller.BaseMasterController
		.extend(
				"cus.crm.opportunity.view.S2",
				{
					processType : "",
					numberOfOpportunity : 0,
					firstCall : "",
					desc : undefined,
					nGuid : undefined,
					bAppLaunched : true,
					onInit : function() {

						// execute the onInit for the base class
						// BaseDetailController
						sap.ca.scfld.md.controller.BaseMasterController.prototype.onInit
								.call(this);
						var oControllers = new sap.ui.model.json.JSONModel({s2Controller : this});						
						this.oApplicationFacade.setApplicationModel("s2Controller",oControllers);
						
						var view = this.getView();
						var self = this;
						this.guid = undefined;
						this.accountID = undefined;
						this.opportunityID = undefined;

						// When Coming from Account app
						// Get accountID query parameter
						this.oModel = this.getView().getModel();
						var sComponentId = sap.ui.core.Component
								.getOwnerIdFor(this.getView());
						var myComponent = sap.ui.component(sComponentId);

						this.oResourceBundle = sap.ca.scfld.md.app.Application
								.getImpl().getResourceBundle();

						if (myComponent
								&& myComponent.getComponentData()
								&& myComponent.getComponentData().startupParameters) {
							var startupParameters = myComponent
									.getComponentData().startupParameters;
							jQuery.sap.log.debug("startup parameters are "
									+ JSON.stringify(startupParameters));
							if (myComponent.QtyForAccountID) {
								this.QtyForAccountID = myComponent.QtyForAccountID;
							}
							if (startupParameters.accountID != null) {
								if (undefined != startupParameters.accountID) {
									this.accountID = startupParameters.accountID[0];
								}
							} else if (startupParameters.opportunityID != null) {
								this.opportunityID = startupParameters.opportunityID[0];
							} else {
								if (startupParameters.guid != null) {
									if (undefined != startupParameters.guid) {
										this.guid = startupParameters.guid[0];
									}
								}
							}

						}
						this.oShowSheet = sap.ui.xmlfragment(this
								.createId("showFragment"),
								"cus.crm.opportunity.view.showMaxHit",

								this);
						// Binding moved to here from xml so that filters can be
						// dynamically(Needed to pass account id dynamically)
						var oList = this.getList();
						var oTemplate = oList.getItems()[0].clone();
						var afilters = this.getFilters();
						oList.bindAggregation("items", {
							path : '/Opportunities',
							template : oTemplate,
							filters : afilters
						});
						var oModel = this.getView().getModel();

						oModel.bRefreshAfterChange = false;
						// register success handler

						var successHandler = function(oEvent) {
							var numberOfOpps = this.getList().getBinding(
									'items').getLength();

							if (this.nGuid !== undefined) {
								this.byId("labelInfo").setText(this.desc);
								this.byId("toolbarInfo").setVisible(true);

							}
							if (this.accountID != undefined
									&& this.desc === undefined) {
								if (!this.bAccountNameFound) {
									this.setAccountName();
								} else {
									this.byId("labelInfo").setText(
											this.sProspectName);
									this.byId('toolbarInfo').setVisible(true);
								}
							}
							if (typeof cus.crm.myaccounts !== 'undefined'
									&& typeof cus.crm.myaccounts.NavigationHelper !== 'undefined'
									&& typeof cus.crm.myaccounts.NavigationHelper.qty !== 'undefined') {
								if (cus.crm.myaccounts.NavigationHelper.qty > numberOfOpps
										&& typeof this.accountID !== 'undefined') {
									sap.ca.ui.message
											.showMessageToast(this.oApplicationFacade
													.getResourceBundle()
													.getText(
															"LIST_FILTERED_BY_MYITEMS",
															[
																	numberOfOpps,
																	cus.crm.myaccounts.NavigationHelper.qty ]));

								}
								;

								// Not needed again. Clear the variable
								cus.crm.myaccounts.NavigationHelper.qty = undefined;
							}
							;
						};

						if (oModel != undefined)
							oModel.attachRequestCompleted(jQuery.proxy(
									successHandler, this));

						var numberOfOpps = this.getList().getBinding('items')
								.getLength();
						/* Set No data text when zero opp found */
						if (numberOfOpps <= 0) {
							this.getList().setNoDataText(
									sap.ca.scfld.md.app.Application.getImpl()
											.getResourceBundle().getText(
													"NO_DATA_TEXT"));
						}
						this.sBackendVersion = cus.crm.opportunity.util.schema
						._getServiceSchemaVersion(this.oModel,
						"Opportunity");
					},

					setAccountName : function() {
						var oList = this.getList(), aItems = oList.getItems(), oBindingContext, oElement;
						if (aItems.length > 0) {
							oBindingContext = aItems[0].getBindingContext();
							if (oBindingContext && oBindingContext.sPath) {
								this.byId("toolbarInfo").setVisible(true);
								oElement = oList.getModel().getProperty(
										oBindingContext.sPath);
								if (oElement
										&& oElement.ProspectNumber === this.accountID) {
									this.byId("labelInfo").setText(
											sap.ca.scfld.md.app.Application
													.getImpl()
													.getResourceBundle()
													.getText('FILTER')
													+ " "
													+ oElement.ProspectName);
									this.bAccountNameFound = true;
									this.sProspectName = (oElement.ProspectName !== "") ? oElement.ProspectName
											: oElement.ProspectNumber;
								} else {
									this.bAccountNameFound = false;
									this.byId("toolbarInfo").setVisible(false);
								}
							}
						}
					},

					onBeforeRendering : function() {

						this.getView().getModel("controllers").getData().s2Controller = this;
					},
					// get filter to set Accound(needed for cross app nav)
					getFilters : function() {
						var filters = [];

						if (undefined != this.accountID
								&& this.nGuid === undefined) {
							// Guid from create screen gets preference over
							// accountID
							filters.push(new sap.ui.model.Filter(
									"ProspectNumber",
									sap.ui.model.FilterOperator.EQ,
									this.accountID));
						}

						if (undefined != this.opportunityID) {
							filters.push(new sap.ui.model.Filter("Id",
									sap.ui.model.FilterOperator.EQ,
									this.opportunityID));
						}
						if (undefined != this.nGuid) {
							filters
									.push(new sap.ui.model.Filter("Guid",
											sap.ui.model.FilterOperator.EQ,
											this.nGuid));
						}
						if (undefined != this.guid) {
							filters.push(new sap.ui.model.Filter("Guid",
									sap.ui.model.FilterOperator.EQ, this.guid));
						}
						return filters;
					},

					// Select Item to set the detail in S3
					setListItem : function(oItem) {
						if (this.bAppLaunched)
							this.prevItem = oItem;
						this.oItem = oItem;
						this.getList().removeSelections();

						if (this.prevItem) {
							this.getList().setSelectedItem(this.prevItem);
						}

						var currentDetailPage = sap.ca.scfld.md.app.Application
								.getImpl().oSplitContainer
								.getCurrentDetailPage();
						var editController = this.getView().getModel(
								'controllers').getData().s4Controller;
						var createController = this.getView().getModel(
								'controllers').getData().s5Controller;
						if (!this.bAppLaunched
								&& currentDetailPage
								&& editController
								&& (editController.getView() === currentDetailPage)) {
							// we are in the edit page

							var s4Controller = this.getS4Controller();
							if (s4Controller && s4Controller._checkDataLoss()) {
								sap.ca.ui.dialog.confirmation
										.open(
												{
													question : sap.ca.scfld.md.app.Application
															.getImpl()
															.getResourceBundle()
															.getText(
																	'DATA_LOSS'),
													title : sap.ca.scfld.md.app.Application
															.getImpl()
															.getResourceBundle()
															.getText('WARNING'),
													confirmButtonLabel : sap.ca.scfld.md.app.Application
															.getImpl()
															.getResourceBundle()
															.getText('CONTINUE')

												}, jQuery.proxy(
														this.datalossDismissed,
														this));

								return;
							}

						}
						if (!this.bAppLaunched
								&& currentDetailPage
								&& createController
								&& (createController.getView() === currentDetailPage)) {

							sap.ca.ui.dialog.confirmation
									.open(
											{
												question : sap.ca.scfld.md.app.Application
														.getImpl()
														.getResourceBundle()
														.getText('DATA_LOSS'),
												title : sap.ca.scfld.md.app.Application
														.getImpl()
														.getResourceBundle()
														.getText('WARNING'),
												confirmButtonLabel : sap.ca.scfld.md.app.Application
														.getImpl()
														.getResourceBundle()
														.getText('CONTINUE')

											}, jQuery.proxy(
													this.datalossDismissed,
													this));
							return;
						}
						this.goToDetailPage(oItem);

					},

					goToDetailPage : function(oItem) {

						var oList = this.getList();
						oList.removeSelections();
						oItem.setSelected(true);
						oList.setSelectedItem(oItem, true);
						this.prevItem = oItem;
						// needed to enable the buttons, when list is selected
						// again during create
						if (this.firstCall != "") {
							this.firstCall = "";
							this.setBtnEnabled("sort", true);
							this.setBtnEnabled("BTN_S2_ADD", true);
							this.setBtnEnabled("BTN_S2_SHOW", true);
						}
						var sComponentId = sap.ui.core.Component
								.getOwnerIdFor(this.getView());
						var myComponent = sap.ui.component(sComponentId);

						// not coming from sp, need master deail both

						this.oRouter.navTo("detail", {
							contextPath : oItem.getBindingContext().sPath
									.substr(1)
						},true);

					},
					datalossDismissed : function(oResult) {
						var s4Controller = this.getS4Controller();
						// clear batch anyway that was framed during
						// pageNeedsUpate of s4 controller
						this.getList().getModel().clearBatch();
						if (oResult.isConfirmed === false) {
							this.getList().setSelectedItem(this.prevItem);
							return;
						}

						// cleaning up buffer as we move to another page and
						// discard any changes in edit page
						if (s4Controller)
							s4Controller.deleteBuffer = [];
						this.goToDetailPage(this.oItem);
					},

					getS3Controller : function() {

						return this.getView().getModel('controllers').getData().s3Controller;
					},

					getS4Controller : function() {
						return this.getView().getModel('controllers').getData().s4Controller;

					},

					// To get the Header(search) and footer part
					getHeaderFooterOptions : function() {
						var that = this;
						var numberofOpportunity = 0;
						var oBinding = this.byId("list").getBinding("items");
						if (oBinding != undefined && oBinding != "") {
							numberofOpportunity = oBinding.length;
						}
						var oHeaderFooterOptions = {
							onBack : jQuery.proxy(this.onBack, this),
							sI18NMasterTitle : this.oApplicationFacade
									.getResourceBundle()
									.getText("MASTER_TITLE",
											numberofOpportunity),
							oSortOptions : {
								sId : "sort",
								aSortItems : [
										{
											text : sap.ca.scfld.md.app.Application
													.getImpl()
													.getResourceBundle()
													.getText('CLSDATEASC'),
											key : "ClosingDate"
										},
										{
											text : sap.ca.scfld.md.app.Application
													.getImpl()
													.getResourceBundle()
													.getText('CLSDATEDESC'),
											key : "ClosingDate2"
										},
										{
											text : sap.ca.scfld.md.app.Application
													.getImpl()
													.getResourceBundle()
													.getText('ACTASC'),
											key : "ProspectName"
										},
										{
											text : sap.ca.scfld.md.app.Application
													.getImpl()
													.getResourceBundle()
													.getText('ACTDESC'),
											key : "ProspectName2"
										},
										{
											text : sap.ca.scfld.md.app.Application
													.getImpl()
													.getResourceBundle()
													.getText('STATASC'),
											key : "UserStatusText"
										},
										{
											text : sap.ca.scfld.md.app.Application
													.getImpl()
													.getResourceBundle()
													.getText('STATDESC'),
											key : "UserStatusText2"
										} ],
								onSortSelected : function(key) {

									that.applySort(key);

								}
							},
							aAdditionalSettingButtons : [ {
								sI18nBtnTxt : sap.ca.scfld.md.app.Application
								.getImpl()
								.getResourceBundle()
								.getText('LIST_SETTING'),
								sId : "BTN_S2_SHOW",
								sIcon : "sap-icon://settings",
								onBtnPressed : function(sKey) {
									jQuery.proxy(that.onShow(sKey), this);
								}
							}, ],
							oAddOptions : {
								sId : "BTN_S2_ADD",
								onBtnPressed : function(sKey) {
									jQuery.proxy(that.onCreate(sKey), this);
								}
							}
						};
						// EXTENSION POINT to be able to extend header footer
						// options
						/**
						 * @ControllerHook extHookGetHeaderFooterOptions is the
						 *                 controller hook where the
						 *                 headerFooterOptions can be extended.
						 *                 Attributes like master list title,
						 *                 filters can be defined in addition to
						 *                 the existing headerFooterOptions
						 * 
						 * @callback cus.crm.opportunity.S2.controller~extHookGetHeaderFooterOptions
						 * @param {object}
						 *            oHeaderFooterOptions
						 * @return {void}
						 */
						if (this.extHookGetHeaderFooterOptions)
							this
									.extHookGetHeaderFooterOptions(oHeaderFooterOptions);
						return oHeaderFooterOptions;
					},

					// Handle Sort
					applySort : function(key) {
						if (key === "ProspectName2"
								|| key === "UserStatusText2"
								|| key === "ClosingDate2") {
							if (key === "ProspectName2") {
								key = "ProspectName";
							} else if (key === "UserStatusText2") {
								key = "UserStatusText";
							} else
								key = "ClosingDate";
							var oSorter = new sap.ui.model.Sorter(key, true,
									false);
						} else
							var oSorter = new sap.ui.model.Sorter(key, false,
									false);
						this.getHeaderFooterOptions().oSortOptions.sSelectedItemKey = key;
						this.getView().byId('list').getBinding("items").aSorters = [];
						this.getView().byId('list').getBinding("items").aSorters = [ oSorter ];
						this.getView().byId('list').getBinding("items").sort(
								oSorter);
					},

					/**
					 * @override
					 * 
					 * @param oItem
					 * @param sFilterPattern
					 * @returns {*}
					 */
					isBackendSearch : function() {
						sap.ca.scfld.md.controller.BaseMasterController.prototype.applyBackendSearchPattern
								.call(this);
						return true;
					},

					// For backend Search
					applyBackendSearchPattern : function(sFilterPattern,
							oBinding) {
						var filters = this.getFilters();
						var olist = this.getList();
						this.getList().setNoDataText(
								sap.ca.scfld.md.app.Application.getImpl()
										.getResourceBundle().getText(
												"LOADING_TEXT"));
						var sValue = sFilterPattern;
						if (sValue && sValue.length > 0) {
							filters.push(new sap.ui.model.Filter("Description",
									sap.ui.model.FilterOperator.Contains,
									sValue));
						}
						oBinding.aApplicationFilters = [];
						// update master list binding
						oBinding.filter(filters);

						var oListBinding = this.getList().getBinding("items");
						if (!jQuery.device.is.phone) {
							// oListBinding.attachChange(this._selectFirstElement,
							// this);
						}
						if (this.nGuid != undefined)
							oListBinding.attachChange(this._selectContextPath,
									this);
						this.getView().byId("toolbarInfo").setVisible(false);

					},

					// Click on create button
					onCreate : function(oEvent) {

						// if (!this.oActionSheet) {
  
						var oModel = this.getView().getModel();
                    	var data1;
						oModel.read("ProcessTypes", null, null, false,
								jQuery.proxy(function(oData, resp) // [
														// "$filter=ProcessType
														// eq '" + pType+ "'" ]
								{
									data1 = {
										ProcessTypes : resp.data.results
									};
									
									if (data1.ProcessTypes.length == 1) {
										this.onlyOneProcessType = true;
										this.processType = data1.ProcessTypes[0].ProcessTypeCode;
										this.processTypeDesc = data1.ProcessTypes[0].ProcessTypeDescription;
										this.selectProcess();

									} else {

										this.oActionSheet = sap.ui
												.xmlfragment(
														"cus.crm.opportunity.view.ProcessTypeDialog",

														this);
										this.oActionSheet.setModel(this.getView().getModel(
												"i18n"), "i18n");
										var jsonModel = new sap.ui.model.json.JSONModel();
										jsonModel.setData(data1);
										this.oActionSheet.setModel(jsonModel, "json");
										this.oActionSheet._searchField
												.setPlaceholder(sap.ca.scfld.md.app.Application
														.getImpl().getResourceBundle()
														.getText("SEARCH"));
										this.oActionSheet._list
												.setGrowingScrollToLoad(true);
										this.oActionSheet._dialog
												.setVerticalScrolling(true);
										this.oActionSheet.open();
									}

								},this),jQuery.proxy(function(oError){
							        this.handleErrors(oError);
								},this));

				
					},
					handleErrors : function(oError) {
						sap.ca.ui.utils.busydialog.releaseBusyDialog();
						jQuery.sap.log.error(JSON.stringify(oError));
						sap.ca.ui.message
								.showMessageBox(
										{
											type : sap.ca.ui.message.Type.ERROR,
											message : oError.message,
											details : JSON
													.parse(oError.response.body).error.message.value
										}, function(oResult) {

										});

					},
					onShow : function(oEvent) {
						var that = this;
						var oModel = this.getView().getModel();
						var maxHitData;
 
						oModel
								.read(
										(parseFloat(this.sBackendVersion) >= 4) ? "RetrieveMaxHitSet" : "RetrieveMaxHit",
										null,
										null,
										false,
										function(oData, resp) {
											maxHitData = {
												RetrieveMaxHit : resp.data.results[0]
											};

										});
						this.oldValue = maxHitData.RetrieveMaxHit.MaxHitNumber;

						this.oShowSheet.setModel(this.getView()
								.getModel("i18n"), "i18n");
						var jsonModel = new sap.ui.model.json.JSONModel();
						jsonModel.setData(maxHitData);
						this.oShowSheet.setModel(jsonModel, "showJson");

						this.oShowSheet.open();

					},

					closeShow : function(oEvent) {

						this.oShowSheet.close();
					},

					saveMaxHit : function(oEvent) {

						this.oModel = this.getView().getModel();
						var value = this.oShowSheet.getContent()[1].getValue();
						var that = this;
						if (value != this.oldValue)

							this.oModel.create("UpdateMaxHit", null, {
								success : jQuery.proxy(function() {

									this.oModel.bRefreshAfterChange = false;
									this.oModel.refresh();

								}, this),
								error : jQuery.proxy(function(oError) {
									this.handleErrors(oError);

									this.oModel.bRefreshAfterChange = false;
								}, this),
								async : true,
								urlParameters : [ "MaxHitNumber='" + value
										+ "'" ]
							});

						this.oShowSheet.close();
					},
					// Select process before create
					selectProcess : function(oEvent) {
						if (!this.onlyOneProcessType) {
							var selectedItem = oEvent
									.getParameter("selectedItem");
							if (selectedItem) {
								this.processType = selectedItem
										.data("ProcessTypeCode");
								this.processTypeDesc = selectedItem
										.data("ProcessTypeDescription");
							}
						}

						this.getView().getController().setBtnEnabled("sort",
								false);
						this.getView().getController().setBtnEnabled(
								"BTN_S2_ADD", false);
						this.getView().getController().setBtnEnabled(
								"BTN_S2_SHOW", false);

						// Enable footer buttons in Set ListItem
						this.firstCall = "X";
						// sap.ui.getCore().byId('ProcessDialog').close();
						var oList = this.getList();
						var oItem = oList.getSelectedItem();
						if (oItem) {
							var cPath = oItem.getBindingContext().sPath
									.substr(1);
						} else
							var cPath = " ";
						sap.ca.ui.utils.busydialog.requireBusyDialog();
						this.oRouter.navTo("create", {
							contextPath : cPath,
							processType : this.processType
						}, !jQuery.device.is.phone);
						this.onlyOneProcessType = false;
						sap.ca.ui.utils.busydialog.releaseBusyDialog();
					},
					// search in process type dialog
					searchProcess : function(oEvent) {
						var itemsBinding = oEvent.getParameter("itemsBinding");
						var that = this;
						var data_len;
						this.getList().setNoDataText(
								sap.ca.scfld.md.app.Application.getImpl()
										.getResourceBundle().getText(
												"LOADING_TEXT"));
						var sValue = oEvent.getParameter("value");
						if (sValue !== undefined) {
							// apply the filter to the bound items, and the
							// Select Dialog will update
							itemsBinding.filter([ new sap.ui.model.Filter(
									"Description",
									sap.ui.model.FilterOperator.Contains,
									sValue) ]);
							data_len = itemsBinding
									.filter([ new sap.ui.model.Filter(
											"Description",
											sap.ui.model.FilterOperator.Contains,
											sValue) ]);

							if (data_len.iLength == 0) {
								this.getList().setNoDataText(
										sap.ca.scfld.md.app.Application
												.getImpl().getResourceBundle()
												.getText("NO_DATA_TEXT"));

							}
						}
					},

					// toolbar only when coming back from save
					_handleToolBar : function() {
						var aFilters, oListBinding;
						this.byId("toolbarInfo").setVisible(false);
						var bDescCleared = false;

						if (this.desc !== undefined) {
							if (this.accountID !== undefined) {
								// clear desc filter first then retain account
								// filter

								this.nGuid = undefined;
							} else {
								// no application filters exist, we can safely
								// hide the toolbar
								this.byId("toolbarInfo").setVisible(false);

							}
							this.nGuid = undefined;
							this.desc = undefined;
							bDescCleared = true;
						}

						if (!bDescCleared) {
							if (this.accountID !== undefined) {
								this.accountID = undefined;
								// no more application filters exist, hide the
								// toolbar
								this.byId("toolbarInfo").setVisible(false);
							}
						}

						aFilters = this.getFilters();

						var searchPattern = this._oControlStore.oMasterSearchField
								.getValue();

						if (searchPattern && searchPattern.length > 0) {
							aFilters.push(new sap.ui.model.Filter(
									"Description",
									sap.ui.model.FilterOperator.Contains,
									searchPattern));
						}
						oListBinding = this.getList().getBinding("items");
						if (oListBinding) {
							oListBinding.aApplicationFilters = [];

							// update master list binding
							oListBinding.filter(aFilters);

							if (!jQuery.device.is.phone) {
								// oListBinding.attachChange(this._selectFirstElement,
								// this);
							}
							// this.updateMasterTitle();
						}
					},

					_selectContextPath : function(oEvent) {
						var oList = this.getList(), aItems = oList.getItems(), oModel, oElement, i, len, sPath, oBindingContext;
						// this.byId("toolbarInfo").setVisible(false);
						if (aItems.length > 0 && this.nGuid) {
							oEvent.getSource().detachChange(
									this._selectContextPath, this);
							oModel = oList.getModel();
							sPath = "/Opportunities(guid'" + this.nGuid + "')";
							oElement = oModel.getProperty(sPath);
							if (oElement) {
								for (i = 0, len = aItems.length; i < len; i++) {
									oBindingContext = aItems[i]
											.getBindingContext();
									if (oBindingContext
											&& oBindingContext.sPath === sPath) {
										if (!jQuery.device.is.phone)
											this.setListItem(aItems[i],
													jQuery.device.is.phone);
										this.byId("toolbarInfo").setVisible(
												true);
										this.byId("labelInfo").setText(
												this.desc);
										return;
									}
								}
							} else {
								if (oList._oGrowingDelegate._iItemCount < this.iNumberOfContacts) {
									oList._oGrowingDelegate.requestNewPage();
									oEvent.getSource().attachChange(
											this._selectContextPath, this);
								} else {
									this.navToEmptyView();
								}
							}
						}
					},

					// always selecting first item of list
					_selectFirstElement : function(oEvent) {
						var oList = this.getList(), aItems = oList.getItems(), oBinding, i, len, sPath, oBindingContext, oElement;
						var currentDetailPage = sap.ca.scfld.md.app.Application
								.getImpl().oSplitContainer
								.getCurrentDetailPage();
						var createController = this.getView().getModel(
								'controllers').getData().s5Controller;
						if (currentDetailPage
								&& createController
								&& (createController.getView() === currentDetailPage))
							return;
						if (aItems.length > 0) {
							oEvent.getSource().detachChange(
									this._selectFirstElement, this);
							for (i = 0, len = aItems.length; i < len; i++) {
								oBindingContext = aItems[i].getBindingContext();
								if (oBindingContext && oBindingContext.sPath) {

									this.setListItem(aItems[i],
											jQuery.device.is.phone);
									return;
								}
							}
						}

						this.navToEmptyView();
					},
					// nav to empty page
					navToEmptyView : function() {

						var s4Controller = this.getView().getModel(
								'controllers').getData().s4Controller;
						if (s4Controller && s4Controller.bEmployeeUpdateSuccess) {
							s4Controller.bEmployeeUpdateSuccess = false;
							return;
						}
						var s3controller = this.getView().getModel(
								'controllers').getData().s3Controller;

						if (this.bCreateOppt) {
							this.bCreateOppt = false;
							return;
						} else if (s3controller && s3controller.navToOtherApp) {

							s3controller.navToOtherApp = false;
							return;

						}

						this.getList().setNoDataText(
								sap.ca.scfld.md.app.Application.getImpl()
										.getResourceBundle().getText(
												"NO_DATA_TEXT"));
						this.oRouter.navTo("noData", {
							viewTitle : "DETAIL_TITLE",
							languageKey : "NO_ITEMS_AVAILABLE"
						});
					},

					_modifyListAfterCreate : function() {
						var aFilters, oListBinding;
						aFilters = this.getFilters();
						oListBinding = this.getList().getBinding("items");
						if (oListBinding) {
							oListBinding.aApplicationFilters = [];
							/* update master list binding */
							oListBinding.filter(aFilters);
							this.byId("toolbarInfo").setVisible(true);
							this.byId("labelInfo").setText(this.desc);
							if (!jQuery.device.is.phone)
								oListBinding.attachChange(
										this._selectContextPath, this);
						}
					},
					onDataLoaded : function() {
						if (this.bAppLaunched) {
							// attaching leadsRefreshed as callback whenever the
							// list gets refreshed,filtered,searched
							this.getList().getBinding('items').attachChange(
									this.opptListRefreshed, this);

							// selectDetail selects ths first element of the
							// list if any, shows empty view otherwise - only on
							// app launch
							this._selectDetail();

							// app has launched - all one time operations are
							// prevented from further execution with an if check
							// upon this attribute
							this.bAppLaunched = false;
						} else {
							if (this.getList().getBinding('items').getLength() === 0) {
								this.getList().setNoDataText(
										this.oResourceBundle
												.getText('NO_DATA_TEXT'));

								// navigate to empty view only on contextual
								// filter
								// - accountID
								if (this.accountID !== undefined)
									this.navToEmptyView();

							} else {
								// checking the possibility of a selected list
								// item
								// with an empty detail page - changing to
								// detail
								// page if so
								var item = this.getList().getSelectedItem();
								if (item
										&& this.getSplitContainer()
												.getCurrentDetailPage().sViewName === "sap.ca.scfld.md.view.empty") {
									if (!jQuery.device.is.phone
											&& this.getS3Controller())

										this.oRouter.navTo("detail", {
											contextPath : item
													.getBindingContext().sPath
													.substr(1)
										}, !jQuery.device.is.phone);

								}

							}
						}
					},
					opptListRefreshed : function(oEvent) {
						this.getList().setNoDataText(
								this.oResourceBundle.getText('LOADING_TEXT'));
					},

					applyFilterFromContext : function(sContext) {
						// to allow bookmarking for growing list
						// if(!jQuery.device.is.phone)
						this.sContext = sContext;

						var list = this.getList();
						if (list.attachUpdateFinished) {
							list.attachUpdateFinished(null,
									this.onGrowingFinished, this);
						}

						if (this.getS3Controller()) {
							this.oRouter.navTo("detail", {
								contextPath : sContext.substr(1)
							}, !jQuery.device.is.phone);
						}
					},
					onBack : function(oEvent) {
						var currentDetailPage = sap.ca.scfld.md.app.Application
								.getImpl().oSplitContainer
								.getCurrentDetailPage();
						var editController = this.getView().getModel(
								'controllers').getData().s4Controller;

						if (currentDetailPage
								&& editController
								&& (editController.getView() === currentDetailPage)) {
							if (editController._checkDataLoss()) {
								this.getList().getModel().clearBatch();
								sap.ca.ui.dialog.confirmation
										.open(
												{
													question : sap.ca.scfld.md.app.Application
															.getImpl()
															.getResourceBundle()
															.getText(
																	'DATA_LOSS'),
													title : sap.ca.scfld.md.app.Application
															.getImpl()
															.getResourceBundle()
															.getText('WARNING'),
													confirmButtonLabel : sap.ca.scfld.md.app.Application
															.getImpl()
															.getResourceBundle()
															.getText('CONTINUE')

												}, jQuery.proxy(
														this.dataLossForExit,
														this));

								return;
							}
						}
						var createController = this.getView().getModel(
								'controllers').getData().s5Controller;
						if (currentDetailPage
								&& createController
								&& (createController.getView() === currentDetailPage)) {
							sap.ca.ui.dialog.confirmation
									.open(
											{
												question : sap.ca.scfld.md.app.Application
														.getImpl()
														.getResourceBundle()
														.getText('DATA_LOSS'),
												title : sap.ca.scfld.md.app.Application
														.getImpl()
														.getResourceBundle()
														.getText('WARNING'),
												confirmButtonLabel : sap.ca.scfld.md.app.Application
														.getImpl()
														.getResourceBundle()
														.getText('CONTINUE')

											}, jQuery.proxy(
													this.dataLossForExit, this));

							return;
						}
						window.history.back(1);
					},
					dataLossForExit : function(oResult) {
						if (oResult.isConfirmed === true) {
							window.history.back(1);
						}
					},
					onGrowingFinished : function(oEvent) {
						if (this.sContext) {
							var list = this.getList();
							var items = list.getItems();
							for (var i = 0; i < items.length; i++) {
								if (this.sContext === items[i]
										.getBindingContextPath()) {
									items[i].setSelected(true);
									this.sContext = null;
									list.detachUpdateFinished(
											this.onGrowingFinished, this);
									this.prevItem = items[i];
								} else {
									items[i].setSelected(false);
								}
							}
						}
					}
				});
