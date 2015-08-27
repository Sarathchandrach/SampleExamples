/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseMasterController");
jQuery.sap.require("hcm.mgr.approve.timesheet.utility.Parser");
jQuery.sap.require("sap.ca.ui.utils.busydialog");
jQuery.sap.require("sap.ca.ui.message.message");

sap.ca.scfld.md.controller.BaseMasterController
		.extend(
				"hcm.mgr.approve.timesheet.view.S2",
				{
					//Controller Hook method definitions
					extHookDisplayEmployeeList: null,
					extHookDisplayCostAssignmentList: null,

					onInit : function() {
						// execute the onInit for the base class
						// BaseDetailController
						sap.ca.scfld.md.controller.BaseMasterController.prototype.onInit
								.call(this);

						this.oBundle = this.oApplicationFacade
								.getResourceBundle();
						this.oDataModel = this.oApplicationFacade
								.getODataModel();

						this.readEmployeeListData(true);
						this.selection = "";
						var self = this;
						this.oRouter
								.attachRouteMatched(
										function(oEvent) {
											if (oEvent.getParameter("name") === "masterDetail") {
												if (oEvent
														.getParameter("arguments").contextPath === undefined) {
													if (this.selection == "Employee") {
														self
																.readEmployeeListData(false);
													} else if (this.selection == "CA") {
														self
																.readCostAssisgnmentListData(false);
													}
												}
											}
										}, this);
					},

					/*
					 * override BaseMasterController method in order to decode
					 * the JSONModel based contextPath Crossroads.js does not
					 * allow slashes in the navigation hash, JSON contextPath
					 * contains
					 */
					resolveHash : function(oEvent) {
						return decodeURIComponent(oEvent
								.getParameter("arguments").contextPath);
					},
					/**
					 * @public [setListItem select first row]
					 * @param {[type]}
					 *            oItem
					 */
					setListItem : function(oItem) {
						this.selection = oItem
								.getBindingContext(this.modelName).getPath()
								.split("/")[1];
						this.index = oItem.getBindingContext(this.modelName)
								.getPath().split("/")[2];
						if (oItem !== undefined) {
							oItem.setSelected(true);
							this.oRouter.navTo("detail", {
								contextPath : encodeURIComponent(oItem
										.getBindingContext(this.sModelName)
										.getPath())
							}, !jQuery.device.is.phone);
						}
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
							if (sFilterPattern === "") {
								return true;
							}

							var sPath = oItem.getBindingContext().sPath
									.split("/")[1];
							if (sPath == "Employee")
								var oIteshellata = oItem.getBindingContext()
										.getModel().getData().Employee;
							else
								var oIteshellata = oItem.getBindingContext()
										.getModel().getData().CA;

							for ( var sKey in oIteshellata) {
								var sValue = oIteshellata[sKey];
								if (typeof sValue == "string") {
									if (sValue.toLowerCase().indexOf(
											sFilterPattern) != -1) {
										return true;
									}
								}
							}
							// if nothing found in unformatted data, check UI
							// elements
							if ((oItem.getIntro() && oItem.getIntro()
									.toLowerCase().indexOf(sFilterPattern) != -1)
									|| (oItem.getTitle() && oItem.getTitle()
											.toLowerCase().indexOf(
													sFilterPattern) != -1)
									|| (oItem.getNumber() && oItem.getNumber()
											.toLowerCase().indexOf(
													sFilterPattern) != -1)
									|| (oItem.getNumberUnit() && oItem
											.getNumberUnit().toLowerCase()
											.indexOf(sFilterPattern) != -1)
									|| (oItem.getFirstStatus() && oItem
											.getFirstStatus().getText()
											.toLowerCase().indexOf(
													sFilterPattern) != -1)
									|| (oItem.getSecondStatus() && oItem
											.getSecondStatus().getText()
											.toLowerCase().indexOf(
													sFilterPattern) != -1)) {
								return true;
							}
							// last source is attribute array
							var aAttributes = oItem.getAttributes();
							for ( var j = 0; j < aAttributes.length; j++) {
								if (aAttributes[j].getText().toLowerCase()
										.indexOf(sFilterPattern) != -1) {
									return true;
								}
							}
							return false;
						}

					},
					/**
					 * @public [getHeaderFooterOptions Define header & footer
					 *         options]
					 */
					getHeaderFooterOptions : function() {
						var that = this;
						return {
							sI18NMasterTitle : "MASTER_TITLE",
							onRefresh : function(sSearchFieldContent,
									fRefreshCompleted) {
								// start asynchronous refresh
								var successCallback = function(oData, oResponse) {
									hcm.mgr.approve.timesheet.utility.Parser
									.setCachedData(oData);
									if (fRefreshCompleted) {
										fRefreshCompleted();
									}
									if (that.selection === "Employee" || that.selection=="")
										that.displayEmployeeList(oData, false);
									else
										that.displayCostAssignmentList(oData,
												false);
								};
								/*
								 * failure handler
								 */
								var onRequestFailed = function(oError) {
									sap.ca.ui.message.showMessageBox({
										type : sap.ca.ui.message.Type.ERROR,
										message : oError.message,
										details : oError.response.body
									});
								};
								that.oDataModel.read("Time_Pending", null,
										null, false, successCallback, jQuery
												.proxy(onRequestFailed, this));

								// return -1 to indicate that scaffolding should
								// not go on with the refresh
								return -1;
							},
							oGroupOptions : {
								aGroupItems : [ {
									text : "{i18n>TSA_PEOPLE}",
									key : "PEOPLE"
								}, {
									text : "{i18n>TSA_COST_ASSGNT}",
									key : "Cost Assignment"
								} ],
								onGroupSelected : function(sKey) {
									if (sKey == "PEOPLE") {
										that.readEmployeeListData(true);
									} else {
										that.readCostAssisgnmentListData(true);

									}
								}
							},

						};
					},
					/**
					 * @private [readEmployeeListData to fetch the odata]
					 * @param indicator
					 *            -true select first item in the list,false
					 *            select indexed value
					 */
					readEmployeeListData : function(indicator) {
						sap.ca.ui.utils.busydialog.requireBusyDialog();
						/*
						 * success handler,parse the odata and restructure into
						 * employee model
						 */
						var onRequestSuccess = function(oData, oResponse) {
							hcm.mgr.approve.timesheet.utility.Parser
							.setCachedData(oData);
							this.displayEmployeeList(oData, indicator);
							sap.ca.ui.utils.busydialog.releaseBusyDialog();

						};
						/*
						 * failure handler
						 */
						var onRequestFailed = function(oError) {
							sap.ca.ui.message.showMessageBox({
								type : sap.ca.ui.message.Type.ERROR,
								message : oError.message,
								details : oError.response.body
							});
						};
						this.oDataModel.read("Time_Pending", null, null, true,
								jQuery.proxy(onRequestSuccess, this), jQuery
										.proxy(onRequestFailed, this));
					},
					/**
					 * @private [displayEmployeeList restructure into employee
					 *          model and bind the model to master list]
					 * @param oData
					 *            -data to be parsed indicator -true select
					 *            first item in the list,false select indexed
					 *            value
					 */
					displayEmployeeList : function(oData, indicator) {
						var oList=this.getList();
						oList.destroyItems();
						var modelData = oData.results;

						var Employee = hcm.mgr.approve.timesheet.utility.Parser
								.EmployeeData(modelData);
						var length = Employee.length;
						this.oApplicationFacade.oApplicationImplementation.oMHFHelper
								.setMasterTitle(this, length);

						if (length > 0) {
							var timeModelData = new Object();
							timeModelData.Employee = Employee;
							timeModelData.PeopleVisible = true;
							timeModelData.CostVisible = false;
							var timeJsonModel = new sap.ui.model.json.JSONModel();

							timeJsonModel.setData(timeModelData);
							oList.setModel(timeJsonModel);
							oList
									.bindAggregation(
											"items",
											{

												path : "/Employee",

												template : new sap.m.ObjectListItem(
														{
															type : "Active",
															title : "{EmpName}",
															number : "{Completion}",
															numberUnit : "{i18n>TSA_COMPLETED}",
															numberState : "{NumberState}",
															attributes : [
																	new sap.m.ObjectAttribute(
																			{
																				text : "{Posname}"
																			}),
																	new sap.m.ObjectAttribute(
																			{
																				text : "{No_Week}"
																			}) ],
															press : jQuery
																	.proxy(
																			this._handleItemPress,
																			this)
														})
											});

							var oList = this.getList();
							this.registerMasterListBind(oList);
							if (indicator)
								this.selectInitialEmployeeItem();
							else
								this.selectIndexedValue();

						} else {
							this.noDataRouting();
						}
						/**
					     * @ControllerHook Extend behavior of Display Employee List
					     * This hook method can be used to add UI or business logic 
					     * It is called when the displayEmployeeList method executes
					     * @callback hcm.mgr.approve.timesheet.view.S2~extHookDisplayEmployeeList
					     */
							if(this.extHookDisplayEmployeeList) {
								this.extHookDisplayEmployeeList();
					  	};
					},
					/**
					 * @private [selectIndexedValue check index and set the
					 *          corresponding item in the master list]
					 */
					selectIndexedValue : function() {
						if (!jQuery.device.is.phone) {
							var oIndexedItem = this
									.retrieveIndexedItem(this.index);
							if (oIndexedItem) {
								this.setListItem(oIndexedItem);
							} else {
								this.conditionalSelection();
							}
						}
					},
					/**
					 * @private [retrieveIndexedItem return indexed item from
					 *          the master list]
					 * @param index -
					 *            index of item
					 * @return oIndexedItem - item from list at specific index
					 */
					retrieveIndexedItem : function(index) {
						var oList = this.getView().byId("list");
						var oIndexedItem = oList.getItems()[index];
						return oIndexedItem;
					},
					/**
					 * @private [conditionalSelection selection of item based on
					 *          item for employee and cost assignment model]
					 */
					conditionalSelection : function() {
						var oList = this.getView().byId("list");
						var length = oList.getItems().length;

						if (length == 1) {
							var oIndexedItem = this.retrieveIndexedItem(0);
							this.setListItem(oIndexedItem);

						} else if (length > 1) {
							var oIndexedItem = this
									.retrieveIndexedItem(this.index - 1);
							this.setListItem(oIndexedItem);
						} else {
							this.noDataRouting();
						}
					},
					/**
					 * @private [noDataRouting route to no data view in case the
					 *          list has no records]
					 */
					noDataRouting : function() {
						// route to no data route
						var oList = this.getList();
						oList.removeAllItems();
						oList.setShowNoData(true);
						oList.setNoDataText(this.oBundle
								.getText("NO_ITEMS_AVAILABLE"));
						this.oApplicationFacade.oApplicationImplementation.oMHFHelper
								.setMasterTitle(this, 0);
						if (!sap.ui.Device.system.phone) {
							this.navToEmptyView();
						}
					},
					/**
					 * @private [selectInitialEmployeeItem select first element
					 *          in the employee list]
					 */
					selectInitialEmployeeItem : function() {
						if (!jQuery.device.is.phone) {
							var oList = this.getList();
							var oFirstItem = oList.getItems()[0];
							if (oFirstItem !== undefined)
								this.setListItem(oFirstItem);
						}

					},
					/**
					 * @private [selectInitialCostItem select first element in
					 *          the cost assignment list]
					 */
					selectInitialCostItem : function() {
						if (!jQuery.device.is.phone) {
							var oList = this.getList();
							var oFirstItem = oList.getItems()[0];
							if (oFirstItem !== undefined)
								this.setListItem(oFirstItem);
						}
					},
					/**
					 * @private [readCostAssisgnmentListData to fetch the odata]
					 * @param indicator
					 *            -true select first item in the list,false
					 *            select indexed value
					 */
					readCostAssisgnmentListData : function(indicator) {
						sap.ca.ui.utils.busydialog.requireBusyDialog();
						/*
						 * success handler,parse the odata and restructure into
						 * cost assignment model
						 */
						var onRequestSuccess = function(oData, oResponse) {
							hcm.mgr.approve.timesheet.utility.Parser
							.setCachedData(oData);
							this.displayCostAssignmentList(oData, indicator);
							sap.ca.ui.utils.busydialog.releaseBusyDialog();
						};
						/*
						 * failure handler
						 */
						var onRequestFailed = function(oError) {
							sap.ca.ui.message.showMessageBox({
								type : sap.ca.ui.message.Type.ERROR,
								message : oError.message,
								details : oError.response.body
							});
						};
						this.oDataModel.read("Time_Pending", null, null, true,
								jQuery.proxy(onRequestSuccess, this), jQuery
										.proxy(onRequestFailed, this));

					},
					/**
					 * @private [displayCostAssignmentList restructure into cost
					 *          assignment model and bind the model to master
					 *          list]
					 * @param oData -
					 *            data to be parsed and displayed in master list
					 *            indicator -true select first item in the
					 *            list,false select indexed value
					 */
					displayCostAssignmentList : function(oData, indicator) {
						var oList=this.getList();
						oList.destroyItems();
						var modelData = oData.results;

						var CostAssignment = hcm.mgr.approve.timesheet.utility.Parser
								.CostAssignmentData(modelData);
						if (CostAssignment.length > 0) {
							var timeModelData = new Object();
							timeModelData.CA = CostAssignment;
							timeModelData.CostVisible = true;
							timeModelData.PeopleVisible = false;
							var timeJsonModel = new sap.ui.model.json.JSONModel();
							timeJsonModel.setData(timeModelData);
							oList.setModel(timeJsonModel);

							this.oApplicationFacade.oApplicationImplementation.oMHFHelper
									.setMasterTitle(this, CostAssignment.length);

							oList
									.bindAggregation(
											"items",
											{

												path : "/CA",

												template : new sap.m.ObjectListItem(
														{
															type : "Active",
															title : "{Cotype}:{Codesc}",
															number : "{No_People}",
															numberUnit : "{i18n>TSA_PEOPLE}",
															press : jQuery
																	.proxy(
																			this._handleItemPress,
																			this)
														})
											});

							var oList = this.getList();
							this.registerMasterListBind(oList);
							if (indicator)
								this.selectInitialCostItem();
							else
								this.selectIndexedValue();
						} else {
							this.noDataRouting();

						}
						/**
					     * @ControllerHook Extend behavior of Display Cost Assignment List
					     * This hook method can be used to add UI or business logic 
					     * It is called when the displayCostAssignmentList method executes
					     * @callback hcm.mgr.approve.timesheet.view.S2~extHookDisplayCostAssignmentList
					     */
							if(this.extHookDisplayCostAssignmentList) {
								this.extHookDisplayCostAssignmentList();
					  	};

					},
					/**
					 * @private [_submit handler for list row swipe for
					 *          approval]
					 * @param oEvent -
					 *            event handler
					 */
					_submit : function(oEvent) {
						var olist = this.getView().byId("list");
						var swipeItem = olist.getSwipedItem();
						var str = "cats='";

						var data = swipeItem.getBindingContext().getModel();
						var path = swipeItem.getBindingContext().getPath();
						olist.swipeOut();
						var data_all = data.getProperty(path);

						var selection = path.split("/")[1];
						var selectedData;
						var Pernr;
						if (selection == "Employee")
							selectedData = data_all.Weeks;
						else
							selectedData = data_all.Peoples;

						// check the selection and call respective functions
						for ( var g = 0; g < selectedData.length; g++) {

							if (selection == "Employee")
								Pernr = data_all.Pernr;
							else
								Pernr = selectedData[g].Pernr;

							var f = selectedData[g].Days;
							for ( var j = 0; j < f.length; j++) {

								str += Pernr + "," + f[j].Counter + ","
										+ f[j].Status + ","
										+ f[j].RejectionReason + "/";
							}

							str += "'";

							// prepare for the post call
							var collection = "Cats_Action?" + str;

							var onRequestSuccess = function(oData, oResponse) {
								/*var n2 = path.split("/")[2];
								var nmod = this.getView().getModel();
								var nm = nmod.getData();
								if (nm) {
									if (selection == "Employee")
										nm.Employee.splice(n2, 1);
									else
										nm.CA.splice(n2, 1);

									nmod.setData(nm);
									sap.ca.ui.message
											.showMessageToast(this.oBundle
													.getText("CATS_SUCCESS_MESSAGE"));

									this.getView().setModel(nmod);

								}*/
								sap.ca.ui.message.showMessageToast(this.oBundle
										.getText("CATS_SUCCESS_MESSAGE"));
								if (selection == "Employee")
									this.readEmployeeListData(false);
								else if (selection == "CA")
									this.readCostAssisgnmentListData(false);
							};

							var onRequestFailed = function(oError) {
								sap.ca.ui.message.showMessageBox({
									type : sap.ca.ui.message.Type.ERROR,
									message : oError.message,
									details : oError.response.body
								});
							};

							// make post service call
							this.oDataModel.create(collection, null, null,
									jQuery.proxy(onRequestSuccess, this),
									jQuery.proxy(onRequestFailed, this));

						}
						;
					}
				});