/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// jQuery.sap.require("sap.ca.scfld.md.controller.BaseMasterController");
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");

// sap.ca.scfld.md.controller.BaseMasterController
sap.ca.scfld.md.controller.ScfldMasterController
		.extend(
				"cus.crm.mytasks.view.S2",
				{
					_sSearchPattern : "",
					aLastFilters : undefined,
					aLastSorters : undefined,
					_bIsRefreshRequested : false,
					_timestampCompletedTask : undefined,
					accountID : undefined,
					accountName : undefined,
					scrollTo : undefined,
					scrollToCounter : 0,
					scrollMax : false,
					SCROLL_TO_BOTTOM : -1,
					bIsFirstCallInTasksApp : false,
					oMHFOptions : {
						sI18NMasterTitle : "LIST_PAGE_TITLE_WITH_NUMBER"
					},
					oStatusDDLB : {
						bNotRetrieved : false,
						errorObj : null
					},

					// Controller Methods - onInit
					onInit : function() {
						jQuery.sap.log.debug("BEGINN onInit s2");
						// execute the onInit for the base class
						// ScfldMasterController
						sap.ca.scfld.md.controller.ScfldMasterController.prototype.onInit
								.call(this);

						var oControllers = new sap.ui.model.json.JSONModel({
							s2Controller : this,
							s3Controller : undefined,
							s4Controller : undefined
						});
						this.oApplicationFacade.setApplicationModel(
								"controllers", oControllers);
						var oCU = cus.crm.mytasks.util, oView = this.getView(), oModel = oView
								.getModel(), oCUS = oCU.Schema;
						if (!oCUS.getServiceVersion())
							oCUS.initServiceSchemaVersion(oModel, "Task");

						this._getTechAndPrioListInfo(oModel);
						// TODO: remove workarounds
						this.overrideDefineFooter();
						this.overrideCreateMasterPullToRefresh();
						this.overrideRefreshHandling();
						// Get accountID query parameter
						var myComponent = sap.ui
								.component(sap.ui.core.Component
										.getOwnerIdFor(oView)), fnResize = jQuery
								.proxy(function(evt) {
									cus.crm.mytasks.util.Util
											.logObjectToConsole(
													"Resize Event: ", evt);
									if (evt.size && evt.size.height != 0
											&& evt.size.width != 0)
										this.fixDisplayOfDirectInput();
								}, this), oParams = undefined;
						if (myComponent && myComponent.getComponentData())
							oParams = myComponent.getComponentData().startupParameters;
						this.oRouter.attachRouteMatched(jQuery.proxy(
								this.handleNavigationWithTaskList, this,
								oParams));
						this.resizeHandlerDeRegisterToken = sap.ui.core.ResizeHandler
								.register(this.getPage(), fnResize);
						this.bIsFirstCallInTasksApp = true;
						jQuery.sap.log.debug("END onInit s2");
					},

					handleNavigationWithTaskList : function(oParams, oEvent) {
						var sRouteName = oEvent.getParameter("name");
						switch (sRouteName) {
						case "taskList":
							if (oParams) {
								jQuery.sap.log
										.debug("startup parameters of CRM-MyTasks are "
												+ JSON.stringify(oParams));
								if (oParams.processType)
									this.processType = oParams.processType
											.toString();
								if (oParams.accountID)
									this.accountID = oParams.accountID
											.toString();
							}
							if (this.bIsFirstCallInTasksApp) {
								this.getView().getModel()
										.attachRequestCompleted(
												this._onRequestCompleted, this)
										.attachRequestSent(this._onRequestSent,
												this).attachRequestFailed(
												this._onRequestFailed, this);
								this
										.getList()
										.attachUpdateFinished(
												this._onListUpdateFinished,
												this)
										.attachUpdateStarted(
												this._onListUpdateStarted, this);
								this.setInitialFilters();
								this.bIsFirstCallInTasksApp = false;
							}
							break;
						case "fullScreen":
							this.getList().attachUpdateFinished(
									this.scrollToPositionAfterUpdate, this);
							break;
						}
					},

					// Controller Methods - onBeforeRendering
					onBeforeRendering : function() {

					},

					// Controller Methods - onAFterRendering
					onAfterRendering : function() {
						jQuery.sap.log.debug("on after render s2");
						this.scrollToPosition();
						cus.crm.mytasks.util.Util.releaseBusyDialog();
					},

					// Controller Methods - onExit
					onExit : function() {

					},

					/*
					 * FIORI WAVE 2 - Branch : Rel - 1.0 START of INITAL
					 * DEVELOPMENT for MyTasks
					 */
					// START of SCAFFOLDNG over-riding methods
					isBackendSearch : function() {
						return true;
					},

					getHeaderFooterOptions : function() {
						return this.oMHFOptions;
					},

					applyBackendSearchPattern : function(sFilterPattern,
							oBinding) {
						this._sSearchPattern = sFilterPattern;
						// filter considers search as well
						this.handleFilter();
					},

					/**
					 * Overrides the Scaffold code's createMasterPullToRefresh
					 * method. We use we have to move the pull to refresh from
					 * the page to the scrollcontainer
					 */
					overrideCreateMasterPullToRefresh : function() {
						var oMHFHelper = this.oApplicationFacade.oApplicationImplementation.oMHFHelper;
						this.superCreatePTR = oMHFHelper.createMasterPullToRefresh;
						oMHFHelper.createMasterPullToRefresh = jQuery.proxy(
								this.injectPTRToScrollContainer, oMHFHelper);
					},

					injectPTRToScrollContainer : function(oController, oPage) {
						var scollContainer = oController.byId("scroll");
						oController.superCreatePTR.call(this, oController,
								scollContainer);
					},

					/**
					 * In case of the refresh button is pressed, the scaffolding
					 * does not call the search logic of application, but simply
					 * refreshes the list, so that TOP parameter is reset.
					 */
					overrideRefreshHandling : function() {
						var oMHFHelper = this.oApplicationFacade.oApplicationImplementation.oMHFHelper;
						oMHFHelper.handleMasterSearch = jQuery.proxy(
								this.injectRefreshList, oMHFHelper);
					},

					injectRefreshList : function(oController, bIsRefresh) {
						// this refers to oMHFHelper.
						this.refreshList(oController, false);
					},

					/**
					 * Overrides the Scaffold code's defineFooter method. We use
					 * our own footer and just decorate it with the settings
					 * button.
					 */
					overrideDefineFooter : function() {
						var oMHFHelper = this.oApplicationFacade.oApplicationImplementation.oMHFHelper;
						oMHFHelper.defineFooter = jQuery.proxy(
								this.injectGenericSettingsButtonToMyTaskFooter,
								oMHFHelper);
					},

					/**
					 * @override Override default data loaded behaviour
					 */
					onDataLoaded : function() {
						jQuery.sap.log.debug("dataload");
						var aLM = [ "cus.crm.mytasks.customizing",
								"cus.crm.mytasks" ];
						for ( var i = -1, c; c = sap.ui.getCore().getModel(
								aLM[++i]);)
							cus.crm.mytasks.util.Util.logObjectToConsole(
									"Model with name '" + aLM[i] + "': ", c,
									"info");
					},

					injectGenericSettingsButtonToMyTaskFooter : function(
							oController, oPage) {
						// get my task footer and inject it
						// into the scaffolding
						var oBar = oController.byId("dummyFooter");
						oController._oControlStore.oButtonListHelper.oBar = oBar;

						// remember the already defined left content
						// and clean the bar, so that settings button is first
						// button, when added
						var oContentLeft = {};
						if (oBar) { // FIXME: quickfix
							oContentLeft = oBar.getContentLeft();
							oBar.removeAllContentLeft();
						}
						// let the scaffolding define the
						// settings button (this =
						// this.oApplicationFacade.oApplicationImplementation.oMHFHelper)
						this.defineSettingsButton(oController);
						// now add my task specific left content again
						for ( var ii = 0; ii < oContentLeft.length; ii++) {
							var oControl = oContentLeft[ii];
							if (this.oApplicationImplementation.bIsPhone)
								oBar.addContentRight(oControl);
							else
								oBar.addContentLeft(oControl);
						}

						// propagate the my task footer to the page
						if (oBar) { // FIXME: quickfix
							var oPage = oController.byId("page");
							oPage.setFooter(oBar);
						}
					},
					// END of SCAFFOLDNG over-riding methods

					_onListUpdateFinished : function(oEvent) {
						cus.crm.mytasks.util.Util.releaseBusyDialog();
						this.fixDisplayOfDirectInput();
					},

					_onListUpdateStarted : function(oEvent) {
						cus.crm.mytasks.util.Util.requestBusyDialog();
					},

					_onRequestCompleted : function(oEvent) {
						var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCUF = oCU.Formatter, oBundle = oCUF
								.getResourceBundle(), sLog = "Operation successful: Executing Task oData service.";
						oCUU.logObjectToConsole(sLog, oEvent.getSource());
						// refresh title
						var numberOfTasks = this.getList().getBinding('items')
								.getLength();
						jQuery.sap.log.debug("# objects=" + numberOfTasks);
						this.oApplicationFacade.oApplicationImplementation.oMHFHelper
								.setMasterTitle(this, numberOfTasks);
						if (this.accountID) {
							var bIsFromAccounts = cus.crm.myaccounts
									&& cus.crm.myaccounts.NavigationHelper
									&& cus.crm.myaccounts.NavigationHelper.qty;
							if (bIsFromAccounts
									&& cus.crm.myaccounts.NavigationHelper.qty > numberOfTasks) {
								var aParams = [ numberOfTasks,
										cus.crm.myaccounts.NavigationHelper.qty ], message = oBundle
										.getText("LIST_FILTERED_BY_MYITEMS",
												aParams);
								sap.m.MessageToast.show(message, {
									closeOnBrowserNavigation : false
								});
								// sap.ca.ui.message.showMessageToast(message);
								// Not needed again. Clear the variable
								cus.crm.myaccounts.NavigationHelper.qty = undefined;
							}
							var oTaskData = oEvent.getSource().oData, aTaskList = Object
									.getOwnPropertyNames(oTaskData);
							if (aTaskList && aTaskList.length > 0) {
								this.accountName = oTaskData[aTaskList[0]].AccountName;
								var oFL = this.getView().byId("filterLabel");
								oFL.setText(oBundle.getText(
										"LIST_FILTER_BAR_ACCOUNT",
										this.accountName));
							}
						}
						oCUU.releaseBusyDialog();
					},

					_onRequestSent : function(oEvent) {
						jQuery.sap.log.debug("Firing oData");
						cus.crm.mytasks.util.Util.requestBusyDialog();
					},

					_onRequestFailed : function(oEvent) {
						cus.crm.mytasks.util.Util
								.onRequestFailed(oEvent,
										"Operation failed: Executing Task oData service.");
					},

					setInitialFilters : function() {
						jQuery.sap.log.debug("setInitialFilters");
						var oSelect = this.getView().byId("filterSelect");
						oSelect.setSelectedKey(this.getDefaultFilterKey());
						this.applyDefaultFilter();
					},

					refreshTaskList : function() {
						var limit = this._timestampCompletedTask + 1500;
						var actualTime = new Date().getTime();
						if (limit > actualTime) {
							var delay = limit - actualTime;
							jQuery.sap.log.debug("Delay Refresh list by "
									+ delay + "ms: " + limit + " > "
									+ actualTime);
							jQuery.sap.delayedCall(delay, this,
									this.refreshTaskList);
						} else {
							jQuery.sap.log.debug("Execute Refresh list: "
									+ limit + " < " + actualTime);
							this.rememberScrollPosition();
							this.getList().attachUpdateFinished(
									this.scrollToPositionAfterUpdate, this);
							this.getView().getModel().refresh();
							this._bIsRefreshRequested = false;
						}
					},

					fixDisplayOfDirectInput : function() {
						var aXMLids = [ "scroll", "taskInput", "dummyFooter" ], aDIVs = [];
						for ( var i = -1, c; c = aXMLids[++i];)
							aDIVs.push(this.getJQueryElemtById(c));

						var iScrollTop = aDIVs[0].offset().top, iNewTaskHeight = aDIVs[1]
								.height(), iWindowHeight = $(window).height();
						var iFooterHeight = aDIVs[2] ? aDIVs[2].height() : 48;
						// add the footer
						var diff = iScrollTop + iFooterHeight;
						if (this.getView().byId(aXMLids[1]).getVisible())
							diff += iNewTaskHeight;

						var newHeight = iWindowHeight - diff;
						var values = [ iScrollTop, iNewTaskHeight,
								iFooterHeight, iWindowHeight ];
						jQuery.sap.log.debug("Values for calculating size: "
								+ values);

						this.getView().byId(aXMLids[0]).setHeight(
								(newHeight / 16) + "rem");
						jQuery.sap.log.debug("Setting new Scroll box height: "
								+ newHeight + "px");
					},

					getJQueryElemtById : function(id) {
						var oElement = this.getView().byId(id);
						if (!oElement)
							return undefined;
						var oId = oElement.sId;
						return $("#" + oId);
					},

					// START of SCROLL CONTAINER operations
					rememberScrollPosition : function(max) {
						this.resetScrolling();
						var oScrollDelegate = this.getView().byId("scroll")
								.getScrollDelegate();
						this.scrollTo = max ? oScrollDelegate.getMaxScrollTop()
								: oScrollDelegate.getScrollTop();
						this.scrollMax = max;
						jQuery.sap.log.debug("scroll position: "
								+ this.scrollTo);
					},

					scrollToPosition : function() {
						if ((this.scrollTo && this.scrollTo > 0)
								|| this.scrollMax) {
							jQuery.sap.log.debug("scrollTo=" + this.scrollTo
									+ "; scrollMax=" + this.scrollMax);
							this.ensureScrolling();
						}
					},

					scrollToPositionAfterUpdate : function() {
						if (sap.ui.Device.support.touch)
							this.byId("scroll").getContent()[0].hide();
						this.getList().detachUpdateFinished(
								this.scrollToPositionAfterUpdate, this);
						this.scrollToPosition();
					},

					ensureScrolling : function() {
						this.scrollToCounter++;
						var oScrollCon = this.getView().byId("scroll"), oScrollDelegate = oScrollCon
								.getScrollDelegate(), iMaxVal = oScrollDelegate
								.getMaxScrollTop();
						if (this.scrollMax && iMaxVal > this.scrollTo)
							this.scrollTo = iMaxVal;
						oScrollCon.scrollTo(0, this.scrollTo, 0);
						// this is ugly, there seems to be various timing issues
						// especially on iPad and iPhone. Scrolling my only work
						// if list is already rendered. So we just re-check
						// periodically if scrolling was applied
						var iOffset = oScrollDelegate.getScrollTop(), bIsScrollRequired = this.scrollTo
								&& iOffset != this.scrollTo, bIsMaxScrollCheck = this.scrollMax
								&& iMaxVal < 0, bIsNumberOfTriesExceeded = this.scrollToCounter < 20;
						(bIsMaxScrollCheck || bIsScrollRequired)
								&& bIsNumberOfTriesExceeded ? jQuery.sap
								.delayedCall(250, this, this.ensureScrolling)
								: this.resetScrolling();
					},

					resetScrolling : function() {
						this.scrollTo = undefined;
						this.scrollToCounter = 0;
						this.scrollMax = false;
					},
					// END of SCROLL CONTAINER operations

					// START of COMPLETION operation of TASK object
					markTaskCompleted : function(oEvent) {
						var oLI = oEvent.getParameter("listItem");
						var oCurrentTask = oLI.getBindingContext().getObject();
						if (oCurrentTask.Completed)
							cus.crm.mytasks.util.Util
									.logObjectToConsole(
											"Task is already completed: ",
											oCurrentTask);
						else {
							this._timestampCompletedTaskCompletedTask = new Date()
									.getTime();
							jQuery.sap.log.debug("completed pressed:"
									+ this._timestampCompletedTask);
							this._greyOutItem(oLI);
							this.rememberScrollPosition();
							this._completeSelectedTask(oCurrentTask, oLI);
							if (!this._bIsRefreshRequested) {
								this._bIsRefreshRequested = true;
								jQuery.sap.delayedCall(1500, this,
										this.refreshTaskList);
							}
						}
					},

					_completeSelectedTask : function(oTask, oLI) {
						var oCUU = cus.crm.mytasks.util.Util;
						oCUU.requestBusyDialog();
						oTask.Completed = true;
						oCUU.logObjectToConsole("Mark Task as completed: ",
								oTask);
						var fnSuccess = function(oTask, oData, oResponses,
								aErrorResponses) {
							var oCU = cus.crm.mytasks.util, oCUU = oCU.Util;
							if (aErrorResponses && aErrorResponses.length > 0)
								oCUU.onRequestFailed(aErrorResponses[0],
										"Operation failed: Delete Task");
							else {
								var oRB = oCU.Formatter.getResourceBundle(), sMsg = [
										"'", oTask.Description, "'" ].join(""), message = oRB
										.getText("LIST_COMPLETE_CONFIRMATION",
												[ sMsg ]);
								oCUU.logObjectToConsole(
										"Operation successful: Complete Task",
										oTask);
								sap.ca.ui.message.showMessageToast(message);
								oCUU.releaseBusyDialog();
							}
						}, fnError = function(oError) {
							cus.crm.mytasks.util.Util.onRequestFailed(oError,
									"Operation failed: Complete Task");
							this.getView().getModel().refresh();
						};
						oCUU.saveTaskAndUpdateTaskList(false, oTask, oLI,
								jQuery.proxy(fnSuccess, this, oTask), jQuery
										.proxy(fnError, this));
					},

					_greyOutItem : function(oItem) {
						var bgColor = sap.ui.core.theming.Parameters
								.get("sapUiExtraLightBG");
						oItem.$().css("background-color", bgColor);
						var txtColor = sap.ui.core.theming.Parameters
								.get("sapUiExtraLightText");
						oItem.$().find("span").css("color", txtColor);
						oItem.$().find("span").css("opacity", "0.8");
					},

					handleListItemPress : function(oEvent) {
						var oCUU = cus.crm.mytasks.util.Util, oList = oEvent
								.getSource(), oContext = oList
								.getBindingContext(), sPath = oContext
								.getPath(), oTaskPressed = oContext.getObject();
						oCUU.requestBusyDialog();
						if (oTaskPressed.Completed)
							oCUU.logObjectToConsole(
									"No nav to completed Task: ", oTaskPressed);
						else {
							this.rememberScrollPosition();
							oCUU.logObjectToConsole("Selected Task: ",
									oTaskPressed);
							this.oRouter.navTo("taskOverview", {
								contextPath : sPath.substr(1)
							});
							// this.oRouter.navTo("taskDetail", {
							// contextPath : sPath.substr(1)
							// });
						}
					},
					// END of COMPLETETION operation of TASK object

					quickCreateTask : function(oEvent) {
						var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCUS = oCU.Schema, oView = this
								.getView();
						oCUU.requestBusyDialog();
						oView.byId("taskInput").setEnabled(false);
						this.rememberScrollPosition(true);
						this.setPartialLoad(false);
						// No need to pass Process Type as a parameter
						var oTaskParams = {
							accountID : this.accountID,
							accountName : this.accountName,
							desc : oEvent.getParameter("newValue"),
						}, oTaskToCreate = oCUU.createEmptyTaskObject(oCUS,
								oTaskParams), oView = this.getView(), fnSuccess = function(
								oData, oResponse, aErrorResponses) {
							var oCUU = cus.crm.mytasks.util.Util;
							if (aErrorResponses && aErrorResponses.length > 0)
								oCUU.onRequestFailed(aErrorResponses[0],
										"Operation failed: Quick Create Task");
							else {
								oCUU
										.logObjectToConsole(
												"Operation successful: Quick Create Task",
												oData);
								oCUU.releaseBusyDialog();
							}
						}, fnError = function(oError) {
							cus.crm.mytasks.util.Util.onRequestFailed(oError,
									"Operation failed: Quick Create Task");
						};
						oView.byId("taskInput").setEnabled(false);
						this.getList().attachUpdateFinished(
								this.scrollToPositionAfterUpdate, this);
						oCUU.saveTaskAndUpdateTaskList(true, oTaskToCreate,
								oView, jQuery.proxy(fnSuccess, this), jQuery
										.proxy(fnError, this));
						oView.byId("taskInput").setEnabled(true).setValue("");
					},

					// START of FILTER operations on TASKS
					getDefaultFilterKey : function() {
						/**
						 * @ControllerHook Provision for getting the default
						 *                 filter key for TASKS. If an
						 *                 additional filter key is provided by
						 *                 the customer, tasks can be filtered
						 *                 by this new key when the end user
						 *                 selects one of these new types. This
						 *                 is called when the Filter key is
						 *                 changed by the user.
						 * @callback sap.ca.scfld.md.controller.BaseMasterController~extHookGetDefaultFilterKey
						 * @return {string}
						 */
						if (this.extHookGetDefaultFilterKey)
							return this.extHookGetDefaultFilterKey();
						else
							return "open";
					},

					applyDefaultFilter : function() {
						/**
						 * @ControllerHook Provision for applying the default
						 *                 filter for TASKS. Additional filter
						 *                 types can be added to tasks by the
						 *                 customer by providing their logic in
						 *                 the Hook implementation. Tasks can be
						 *                 filtered by this additional filter
						 *                 type when the end user selects one of
						 *                 these new types. This is called when
						 *                 the default filter type on TASKS is
						 *                 selected by the user.
						 * @callback sap.ca.scfld.md.controller.BaseMasterController~extHookApplyDefaultFilter
						 * @return {void}
						 */
						if (this.extHookApplyDefaultFilter)
							this.extHookApplyDefaultFilter();
						else
							this.filterTasksOpen();
					},

					createDefaultFilters : function() {
						var oDF = {
							SearchField : this._sSearchPattern.length > 0 ? new sap.ui.model.Filter(
									"Description",
									sap.ui.model.FilterOperator.EQ,
									this._sSearchPattern)
									: null,
							Account : this.accountID ? new sap.ui.model.Filter(
									"AccountId",
									sap.ui.model.FilterOperator.EQ,
									this.accountID) : null,
							MyTask : new sap.ui.model.Filter("MyTask",
									sap.ui.model.FilterOperator.EQ, true)
						}, aFilters = [];
						for ( var sProp in oDF)
							if (oDF[sProp])
								aFilters.push(oDF[sProp]);

						return aFilters;
					},

					handleFilter : function() {
						cus.crm.mytasks.util.Util.requestBusyDialog();
						// get selected key
						this.setPartialLoad(true);
						var select = this.getView().byId("filterSelect");
						var selectedFilterKey = select.getSelectedKey();
						jQuery.sap.log.debug("Selected Filter:"
								+ selectedFilterKey);
						this.resetScrolling();
						switch (selectedFilterKey) {
						case "open":
							jQuery.sap.log.debug("filter tasks open");
							this.filterTasksOpen();
							break;
						case "dueToday":
							jQuery.sap.log.debug("filter tasks due today");
							this.filterTasksToday();
							break;
						case "dueThisWeek":
							jQuery.sap.log.debug("filter tasks due this week");
							this.filterTasksThisWeek();
							break;
						case "completed":
							jQuery.sap.log.debug("filter tasks due this week");
							this.filterTasksCompleted();
							break;
						case this.getDefaultFilterKey():
							jQuery.sap.log.debug("default filter");
							this.applyDefaultFilter();
							break;
						default:
							jQuery.sap.log.debug("custom filter");
							/**
							 * @ControllerHook Provision for Additional Filters
							 *                 on TASKS. Additional filter types
							 *                 can be provided by customer and
							 *                 tasks can be filtered by these
							 *                 new types when the end user
							 *                 selects one of these new types.
							 *                 This is called when the Facet
							 *                 Filter button on the Footer bar
							 *                 is selected.
							 * @callback sap.ca.scfld.md.controller.BaseMasterController~extHookHandleCustomFilter
							 * @param {string}
							 *            sSelectedKey
							 * @return {void}
							 */
							if (this.extHookHandleCustomFilter)
								this
										.extHookHandleCustomFilter(selectedFilterKey);
							break;
						// this.handleCustomFilter(selectedFilterKey);
						}
					},

					filterTasksOpen : function() {
						var aSorters = [ new sap.ui.model.Sorter("CreatedAt") ];
						var aFilters = this.createDefaultFilters();
						aFilters.push(new sap.ui.model.Filter("Completed",
								sap.ui.model.FilterOperator.EQ, false));
						var ret = this.handleAccountNameForDefaultFilter();
						this.setUiMode(true, true, true, ret.title,
								ret.filterBarLabel, ret.aFilterBarLabelParams);
						this._applyFilters(aFilters, aSorters);
					},

					filterTasksCompleted : function() {
						// completed date is changedAt date for completed tasks
						// var oSorter = new sap.ui.model.Sorter("ChangedAt");
						var fnGroupping = function(oContext) {
							var oDateChangedAt = oContext
									.getProperty("ChangedAt");
							var groupHeader = cus.crm.mytasks.util.Formatter
									.formatDate(oDateChangedAt);
							return groupHeader;
						};
						var aSorters = [ new sap.ui.model.Sorter("ChangedAt",
								true, fnGroupping) ];
						var aFilters = this.createDefaultFilters();
						aFilters.push(new sap.ui.model.Filter("Completed",
								sap.ui.model.FilterOperator.EQ, true));
						this.setUiMode(false, false, false,
								"LIST_FILTER_TITLE_COMPLETED",
								"LIST_FILTER_BAR_COMPLETED");
						this._applyFilters(aFilters, aSorters);
					},

					filterTasksToday : function(evt) {
						var aSorters = [ new sap.ui.model.Sorter("DueDate") ];
						var aFilters = this.createDefaultFilters();
						aFilters.push(new sap.ui.model.Filter("Completed",
								sap.ui.model.FilterOperator.EQ, false));
						var today = cus.crm.mytasks.util.Formatter
								.getCurrentDate();
						today = this.setToEndOfDay(today);
						aFilters.push(new sap.ui.model.Filter("DueDate",
								sap.ui.model.FilterOperator.LE, today));
						this.setUiMode(true, false, false,
								"LIST_FILTER_TITLE_TODAY",
								"LIST_FILTER_BAR_TODAY");
						this._applyFilters(aFilters, aSorters);
					},

					filterTasksThisWeek : function(evt) {
						var aSorters = [ new sap.ui.model.Sorter("DueDate") ];
						var aFilters = this.createDefaultFilters();
						aFilters.push(new sap.ui.model.Filter("Completed",
								sap.ui.model.FilterOperator.EQ, false));
						var endOfTheWeek = cus.crm.mytasks.util.Formatter
								.getDateEndOfTheWeek();
						endOfTheWeek = this.setToEndOfDay(endOfTheWeek);
						aFilters.push(new sap.ui.model.Filter("DueDate",
								sap.ui.model.FilterOperator.LE, endOfTheWeek));
						this.setUiMode(true, false, false,
								"LIST_FILTER_TITLE_THIS_WEEK",
								"LIST_FILTER_BAR_THIS_WEEK");
						this._applyFilters(aFilters, aSorters);
					},

					_applyFilters : function(aFilters, aSorters) {
						cus.crm.mytasks.util.Util.logObjectToConsole(
								"Applying Filtering with Sorting: ", {
									filters : aFilters,
									sorters : aSorters
								});
						if (this._haveFiltersOrSortersChanged(aFilters,
								aSorters)) {
							this.setPartialLoad(true);
							this.resetScrolling();
							var oList = this.getList();
							if (!this.template)
								this.template = oList.getItems()[0].clone();

							var oTemplate = this.template.clone();
							jQuery.sap.log
									.debug("creating new binding for task list");
							oList.bindAggregation("items", {
								path : "/Tasks",
								template : oTemplate,
								sorter : aSorters,
								filters : aFilters,
							});
						} else {
							jQuery.sap.log
									.debug("refreshing existing task list");
							this.rememberScrollPosition();
							this.getList().attachUpdateFinished(
									this.scrollToPositionAfterUpdate, this);
							this.getView().getModel().refresh(true);
						}
					},

					handleAccountNameForDefaultFilter : function() {
						var ret = {
							title : "LIST_PAGE_TITLE_WITH_NUMBER",
							filterBarLabel : undefined,
							aFilterBarLabelParams : undefined,
						};
						if (this.accountID) {
							ret.filterBarLabel = "LIST_FILTER_BAR_ACCOUNT";
							if (this.accountName)
								ret.aFilterBarLabelParams = [ this.accountName ];
							else if (cus.crm.myaccounts
									&& cus.crm.myaccounts.NavigationHelper
									&& cus.crm.myaccounts.NavigationHelper.accountName) {
								this.accountName = cus.crm.myaccounts.NavigationHelper.accountName;
								ret.aFilterBarLabelParams = [ this.accountName ];
								cus.crm.myaccounts.NavigationHelper.accountName = undefined;
							} else
								// default
								ret.aFilterBarLabelParams = [ this.accountID ];
						}
						return ret;
					},

					_haveFiltersOrSortersChanged : function(aFilters, aSorters) {
						if (!aSorters)
							aSorters = [];
						if (!aFilters)
							aFilters = [];
						var bIsChanged;
						if (!this.aLastFilters || !this.aLastSorters) {
							jQuery.sap.log.debug("initial call");
							bIsChanged = true;
						} else
							bIsChanged = this._hasArrayChanged(
									this.aLastFilters, aFilters)
									|| this._hasArrayChanged(this.aLastSorters,
											aSorters);

						this.aLastFilters = aFilters;
						this.aLastSorters = aSorters;
						jQuery.sap.log.debug("filters- or sorters changed: "
								+ bIsChanged);
						return bIsChanged;
					},

					_hasArrayChanged : function(aLA, aA) {
						var bIsChanged = false;
						if (aLA.length != aA.length) {
							bIsChanged = true;
							cus.crm.mytasks.util.Util.logObjectToConsole(
									"Arrays have different size ", [ aLA, aA ]);
						} else
							for ( var ii = 0; ii < aA.length; ii++) {
								var oE = aA[ii], oLE = aLA[ii];
								if (JSON.stringify(oLE) != JSON.stringify(oE)) {
									bIsChanged = true;
									cus.crm.mytasks.util.Util
											.logObjectToConsole(
													"Array Elements are different",
													[ oLE, oE ]);
									break;
								}
							}
						if (!bIsChanged)
							cus.crm.mytasks.util.Util.logObjectToConsole(
									"Arrays aren't different", [ aLA, aA ]);
						return bIsChanged;
					},

					setUiMode : function(navToDetailEnabled,
							quickOrderEntryEnabled, forceDefaultState,
							masterTitle, filterBarLabel, aFilterBarLabelParams) {
						var oList = this.getList(), oView = this.getView(), oFilterBar = oView
								.byId("filterToolBar");
						if (navToDetailEnabled)
							oList.setMode(sap.m.ListMode.MultiSelect);
						else
							oList.setMode(sap.m.ListMode.None);
						oView.byId("taskInput").setVisible(
								quickOrderEntryEnabled);
						oView.byId("showEmptyTask").setVisible(
								quickOrderEntryEnabled);

						if (filterBarLabel) {
							jQuery.sap.log.debug("show filter");
							oFilterBar.setVisible(true);
							var oBundle = cus.crm.mytasks.util.Formatter
									.getResourceBundle();
							oView.byId("filterLabel").setText(
									oBundle.getText(filterBarLabel,
											aFilterBarLabelParams));
						} else {
							jQuery.sap.log.debug("hide filter");
							oFilterBar.setVisible(false);
						}
						if (forceDefaultState)
							oView.byId("filterSelect").setSelectedKey(
									this.getDefaultFilterKey());

						this.oMHFOptions.sI18NMasterTitle = masterTitle;
					},

					removeFilter : function(oEvent) {
						// var key = this.getView().byId("filterSelect")
						// .getSelectedKey();
						// var iIndexOfQ = location.hash.indexOf("?");
						// location.hash = location.hash.substr(0, iIndexOfQ);
						// if (key == this.getDefaultFilterKey()) {
						// remove filter action if we are already in open
						// task view, means to remove account filter as
						// well.
						this.accountID = undefined;
						this.accountName = undefined;
						this.resetScrolling();
						this.applyDefaultFilter();
					},
					// END of FILTER operations on TASKS

					setToEndOfDay : function(oDate) {
						oDate.setHours(23);
						oDate.setMinutes(59);
						return oDate;
					},

					showEmptyTask : function(evt) {
						// Applicable from WAVE 4 onwards
						var oCU = cus.crm.mytasks.util, oCUS = oCU.Schema, oCUT = oCU.TechnicalInfoUtil;
						if (oCUS.getServiceVersion() == 1
								&& oCUS.getServiceSchemaVersion() >= 2) {
							this.oActionSheet = sap.ui.xmlfragment(
									"cus.crm.mytasks.view.ProcessTypeDialog",
									this);
							this.oActionSheet.setModel(this.getView().getModel(
									"i18n"), "i18n");
							var data1 = null, jsonModel = new sap.ui.model.json.JSONModel(), oModel = this
									.getView().getModel(), fnSuccess = function(
									oData, resp) {
								data1 = {
									ProcessTypes : resp.data.results
								};
							}, fnError = function(oError) {
								cus.crm.mytasks.util.Util.onRequestFailed(
										oError,
										"Reading Transaction types failed");
							}, sPath = oCUS.getServiceSchemaVersion() >= 4 ? "TransactionTypes"
									: "TaskTransTypes";
							oModel.read(sPath, null, null, false, jQuery.proxy(
									fnSuccess, this), jQuery.proxy(fnError,
									this));

							if (data1.ProcessTypes.length == 1) {
								this.processType = data1.ProcessTypes[0].ProcessTypeCode;
								this.processTypeDesc = data1.ProcessTypes[0].Description;
								if (oCUS.getServiceSchemaVersion() >= 3)
									oCUT
											.setPrivacyForSelectedTask(data1.ProcessTypes[0].PrivateFlag);
								if (oCUS.getServiceSchemaVersion() >= 4)
									this.processTypePrio = data1.ProcessTypes[0].Priority;
								this.selectProcess();
							} else
								this.oActionSheet.open();

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
						} else {
							if (!this.accountID)
								this.oRouter.navTo("newTask", {
									processType : "noProcType"
								});
							else
								this.oRouter.navTo("newTaskWithAccount", {
									processType : "noProcType",
									accountName : this.accountName
								});
						}
					},

					setPartialLoad : function(loadPartial) {
						var oList = this.getList();
						oList.setGrowing(loadPartial);
					},

					/*
					 * FIORI WAVE 2 - Branch : Rel - 1.0 END of INITAL
					 * DEVELOPMENT for MyTasks
					 */

					/*
					 * FIORI WAVE 4 - Branch : Rel - 1.2 START of ENHANCEMENTS
					 * for MyTasks
					 */

					// EXTENSION METHODS
					/*
					 * @ControllerHook Provision for Additional Filters on
					 * TASKS. Additional filter types can be provided by
					 * customer and Tasks can be filtered on these new types
					 * when the end user selects one of these new types. This is
					 * called when the Facet Filter button on the Footer bar is
					 * selected. The hook must be documented like: @callback
					 * sap.ca.scfld.md.controller.BaseMasterController~extHookHandleCustomFilter
					 * @param {string} sSelectedKey @return {void}
					 */
					// implement in case Ui-extension-Point
					// "extensionFilterOptions" is used
					// extHookHandleCustomFilter : function(sSelectedKey) {
					//						
					// },
					/*
					 * @ControllerHook Provision for getting the default filter
					 * key for TASKS. Additional filter key can be provided by
					 * customer and Tasks can be filtered on this new key when
					 * the end user selects one of these new types. This is
					 * called when the Filter key is changed by the user. The
					 * hook must be documented like: @callback
					 * sap.ca.scfld.md.controller.BaseMasterController~extHookGetDefaultFilterKey
					 * @return {string}
					 */
					// extHookGetDefaultFilterKey : function() {
					// return "";
					// },
					/*
					 * @ControllerHook Provision for applying the default filter
					 * for TASKS. Additional filter on TASKS can be done by the
					 * customer by providing their logic in the Hook
					 * implentation and tasks can be filtered on this filter
					 * type when the end user selects one of these new types.
					 * This is called when the default filter type on TASKS is
					 * selected by the user. The hook must be documented like:
					 * @callback
					 * sap.ca.scfld.md.controller.BaseMasterController~extHookApplyDefaultFilter
					 * @return {void}
					 */
					// extHookApplyDefaultFilter : function() {
					// },
					// Select process before create
					selectProcess : function(oEvent) {
						var oCU = cus.crm.mytasks.util, oCUS = oCU.Schema, oCUT = oCU.TechnicalInfoUtil, oCUU = oCU.Util;
						if (oEvent) {
							var selectedItem = oEvent
									.getParameter("selectedItem");
							if (selectedItem) {
								this.processType = selectedItem
										.data("ProcessTypeCode");
								this.processTypeDesc = selectedItem
										.data("ProcessTypeDescription");
								if (oCUS.getServiceVersion() == 1) {
									if(oCUS.getServiceSchemaVersion() >= 3)
										oCUT.setPrivacyForSelectedTask(selectedItem
												.data("PrivacyAllowed"));
									if (oCUS.getServiceSchemaVersion() >= 4)
										this.processTypePrio = selectedItem.data("Priority");
								}
										
							}
						}
						// Enable footer buttons in Set ListItem
						oCUU.requestBusyDialog();
						this.setPartialLoad(false);
						this.rememberScrollPosition(true);
						var bErrorShown = false;
						if (oCUS.getServiceVersion() == 1
								&& oCUS.getServiceSchemaVersion() == 3)
							bErrorShown = this._getStatusValues(oCU);
						if (!bErrorShown) {
							if (!this.accountID)
								this.oRouter.navTo("newTask", {
									processType : this.processType
								});
							else
								this.oRouter.navTo("newTaskWithAccount", {
									processType : this.processType,
									accountName : this.accountName
								});
							oCUU.releaseBusyDialog();
						}
					},

					// search in process type dialog
					searchProcess : function(oEvent) {
						var sValue = oEvent.getParameter("value"), itemsBinding = oEvent
								.getParameter("itemsBinding"), aFilter = [];
						if (sValue && sValue != "")
							aFilter.push(new sap.ui.model.Filter("Description",
									sap.ui.model.FilterOperator.Contains,
									sValue));
						itemsBinding.aApplicationFilters = [];
						itemsBinding.filter(aFilter,
								sap.ui.model.FilterType.Application);
					},

					/*
					 * FIORI WAVE 4 - Branch : Rel - 1.2 END of ENHANCEMENTS for
					 * MyTasks
					 */
					/*
					 * FIORI WAVE 5 - Branch : Rel - 1.3 END of ENHANCEMENTS for
					 * MyTasks
					 */
					/*
					 * FIORI WAVE 5 - Branch : Rel - 1.3 END of ENHANCEMENTS for
					 * MyTasks
					 */
					/*
					 * FIORI WAVE 6 - Branch : Rel - 1.4 END of ENHANCEMENTS for
					 * MyTasks
					 */
					_getStatusValues : function(oCU) {
						var oCUSL = oCU.StatusListUtil, oCUS = oCU.Schema, oCUU = oCU.Util, bReturn = false;
						if (oCUS.getServiceVersion() == 1
								&& oCUS.getServiceSchemaVersion() >= 3) {
							oCUSL.getStatusValues(this, {
								procType : this.processType,
								bIsNew : true
							});
							if (this.oStatusDDLB.bNotRetrieved) {
								oCUU
										.onRequestFailed(
												this.oStatusDDLB.errorObj,
												"Operation failed: Read status customizing.");
								this.oStatusDDLB.errorObj = null;
								this.oStatusDDLB.bNotRetrieved = false;
								bReturn = true;
							}
						}
						return bReturn;
					},

					_getTechAndPrioListInfo : function(oModel) {
						var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCUS = oCU.Schema;
						oCUU.requestBusyDialog();
						var fnSuccess = function(oData, oResponse,
								aErrorResponses) {
							var oCU = cus.crm.mytasks.util;
							if (aErrorResponses && aErrorResponses.length > 0)
								oCU.Util
										.onRequestFailed(aErrorResponses[0],
												"Operation failed: Priority list and Technical Information");
							else {
								for ( var i = -1, oCurrentData; oCurrentData = oData.__batchResponses[++i];)
									switch (i) {
									case 0:
										if (oCU.Schema.getServiceVersion() == 1
												&& oCU.Schema
														.getServiceSchemaVersion() >= 4)
											oCU.TechnicalInfoUtil
													.parseTechInfoOData({
														retrieveTaskTech : jQuery
																.extend(
																		{},
																		oCurrentData.data.results[0],
																		true)
													});
										else
											oCU.TechnicalInfoUtil
													.parseTechInfoOData(oCurrentData.data);
										break;
									case 1:
										oCU.PriorityListUtil
												.parsePrioListOData(oCurrentData.data);
										break;
									case 2:
										oCU.StatusListUtil
												.setStatusValuesAgainstTransactionType(jQuery
														.extend(
																[],
																oCurrentData.data.results,
																true));
										break;
									default:
										break;
									}
								oCU.Util.releaseBusyDialog();
							}
						}, fnError = function(oError) {
							cus.crm.mytasks.util.Util
									.onRequestFailed(oError,
											"Operation failed: Priority list and Technical Information");
						}, aPrerequisites = oCUS.getServiceVersion() == 1
								&& oCUS.getServiceSchemaVersion() >= 4 ? [
								"TechnicalDetails", "UserPriorities",
								"UserStatuses" ] : [ "retrieveTaskTech",
								"retrieveTaskPrioCustomizing" ];
						oCUU.getAllPrerequisites(oModel, aPrerequisites, {
							success : fnSuccess,
							error : fnError,
							async : false
						});
						oCUU.bindCustomizingModel(this.getView());
					}
				/*
				 * FIORI WAVE 6 - Branch : Rel - 1.4 END of ENHANCEMENTS for
				 * MyTasks
				 */
				/*
				 * FIORI WAVE 7 - Branch : Rel - 1.5 END of ENHANCEMENTS for
				 * MyTasks
				 */
				/*
				 * FIORI WAVE 7 - Branch : Rel - 1.5 END of ENHANCEMENTS for
				 * MyTasks
				 */
				});