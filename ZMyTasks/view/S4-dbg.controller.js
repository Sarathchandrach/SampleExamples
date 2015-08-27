/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");

sap.ca.scfld.md.controller.BaseFullscreenController
		.extend(
				"cus.crm.mytasks.view.S4",
				{
					navFromAccounts : false,
					_sETag : "",
					// Controller Methods - onInit
					onInit : function() {
						// execute the onInit for the base class
						// BaseFullScreenController
						jQuery.sap.log.debug("begin on init s4");
						sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit
								.call(this);

						this._getApplicationModel().setProperty(
								"/s4Controller", this);
						var oCU = cus.crm.mytasks.util, oView = this.getView(), oModel = oView
								.getModel();
						if (!oCU.Schema.getServiceVersion())
							oCU.Schema.initServiceSchemaVersion(oModel, "Task");

						this._checkIfPrerequisitesExist(oView, oCU);
						var oStartupParams = undefined, myComponent = sap.ui
								.component(sap.ui.core.Component
										.getOwnerIdFor(this.getView()));
						if (myComponent && myComponent.getComponentData())
							oStartupParams = myComponent.getComponentData().startupParameters;
						this.oRouter.attachRouteMatched(jQuery.proxy(
								this.handleNavigationWithTaskOverview, this,
								oStartupParams));
						oCU.Util.logObjectToConsole(
								"S4 View Model after init: ", oModel);
						jQuery.sap.log.debug("end on init s4");
					},

					// Controller Methods - onBeforeRendering
					onBeforeRendering : function() {
						jQuery.sap.log.debug("on before render s4");
					},

					// Controller Methods - onAfterRendering
					onAfterRendering : function() {
						jQuery.sap.log.debug("on after render s4");
					},

					// Controller Methods - onExit
					onExit : function() {
						jQuery.sap.log.debug("on exit s4");
					},

					handleNavigationWithTaskOverview : function(oStartupParams,
							oEvent) {
						jQuery.sap.log.debug("on route matched s3");
						var oCU = cus.crm.mytasks.util, oContext = undefined, oView = this
								.getView(), oModel = oView.getModel(), oCUU = oCU.Util, sRouteName = oEvent
								.getParameter("name"), oCUS = oCU.Schema, oArgs = oEvent
								.getParameter("arguments");
						switch (sRouteName) {
						case "taskOverview":
							oContext = new sap.ui.model.Context(oModel, '/'
									+ oArgs.contextPath);
							oView.setBindingContext(oContext);
							this.oOverviewTask = oContext.getObject();
							if (oStartupParams && oStartupParams.fromAccount
									&& oStartupParams.fromAccount[0])
								this.navFromAccounts = true;
							if (!this.oOverviewTask) {
								jQuery.sap.log
										.debug("S4 page called via bookmark");
								this._getOverviewTask(false);
							} else {
								// TODO: Change schema version to 4
								if (oCUS.getServiceVersion() == 1
										&& oCUS.getServiceSchemaVersion() >= 4) {
									this._getRelatedInformationOfTask(oContext);
									this._sETag = this.oOverviewTask.Etag;
								}
								this.initializeOverviewPage(this.oOverviewTask);
							}
							break;
						default:
							break;
						}
						oCUU.releaseBusyDialog();
					},

					getHeaderFooterOptions : function() {
						var oMessageOption = {
							sId : "error",
							sI18nBtnTxt : "DETAILS_FOOTER_BUTTON_MESSAGE",
							onBtnPressed : jQuery.proxy(this.showTaskErrors,
									this),
						}, oDeleteOption = {
							sId : "deleteTask",
							sI18nBtnTxt : "DETAILS_FOOTER_BUTTON_DELETE",
							onBtnPressed : jQuery.proxy(this.confirmDeleteTask,
									this)
						}, oFollowupOption = {
							sId : "followupOptions",
							sI18nBtnTxt : "DETAILS_BUTTONS_FOLLOWUP",
							onBtnPressed : jQuery.proxy(
									this.openFollowupActivity, this),
						}, oCUS = cus.crm.mytasks.util.Schema, oOptions = {
							oEditBtn : {
								sId : "editTask",
								sI18nBtnTxt : "S4_FOOTER_BUTTON_EDIT",
								onBtnPressed : jQuery
										.proxy(this.editTask, this),
							},
							buttonList : [ oDeleteOption, oFollowupOption ],
							bSuppressBookmarkButton : true,
							onBack : jQuery.proxy(this.navBackOverview, this)
						// sI18NFullscreenTitle : "NEW_TASK_PAGE_TITLE",
						};
						if (!oCUS.getServiceVersion())
							oCUS.initServiceSchemaVersion(this.getView()
									.getModel(), "Task");
						if (oCUS.getServiceVersion() == 1
								&& oCUS.getServiceSchemaVersion() >= 4)
							oOptions.buttonList.splice(0, 0, oMessageOption);
						// TODO: Give extension point & Hook for extra header
						// footer options
						return oOptions;
					},

					_checkIfPrerequisitesExist : function(oView, oCU) {
						var oCustomizingModel = oCU.Util.getCustomizingModel(), fnSuccess = function(
								oData, oResponse, aErrorResponses) {
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
									case 3:
										this._sETag = oCurrentData.data.Etag;
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
						}, aPrerequisites = [], aDummy = sap.ushell.Container
								.getService("URLParsing").getHash(location)
								.split("/");
						if (!oCustomizingModel.getProperty("/techInfo")
								&& !oCustomizingModel.getProperty("/prioList"))
							aPrerequisites = oCU.Schema.getServiceVersion() == 1
									&& oCU.Schema.getServiceSchemaVersion() >= 4 ? [
									"TechnicalDetails", "UserPriorities",
									"UserStatuses", aDummy[aDummy.length - 1] ]
									: [ "retrieveTaskTech",
											"retrieveTaskPrioCustomizing" ];

						oCU.Util.getAllPrerequisites(this.getView().getModel(),
								aPrerequisites, {
									success : jQuery.proxy(fnSuccess, this),
									error : fnError,
									async : false
								});
						oCU.Util.bindCustomizingModel(oView);
						// oCustomizingModel.refresh();
					},

					initializeOverviewPage : function(oTask) {
						var oCU = cus.crm.mytasks.util, oCUS = oCU.Schema, oView = this
								.getView();
						this._setFullScreenTitle(oTask);
						if (oTask.Note !== "") {
							oView.byId("notesS4").setVisible(true);
							oView.byId("notesS4").setValue(oTask.Note);
						} else
							oView.byId("notesS4").setVisible(false);
						oView.byId("osStatus").setVisible(false);
						oView.byId("oaTaskType").setVisible(false);
						oView.byId("attachmentData").setVisible(false);
						if (oCUS.getServiceVersion() == 1
								&& oCUS.getServiceSchemaVersion() >= 3) {
							oView.byId("osStatus").setVisible(true);
							oView.byId("oaTaskType").setVisible(true);
						}
						oCU.Attachments.OverviewPage.showOrHidePanel(oView);
						oCU.DocumentHistory.showOrHidePanel(oView);
					},

					navBackOverview : function(oEvent) {
						var s3Controller = this._getApplicationModel()
								.getProperty("/s3Controller");
						if (s3Controller && s3Controller.createdfromNotes) {
							s3Controller.createdfromNotes = false;
							this._navBack();
						} else if (s3Controller
								&& s3Controller.bIsFollowupFromTasks) {
							// WAVE 6 ENHANCEMENT
							if (this.bIsBookmarkUsed)
								this.bIsBookmarkUsed = false;
							if (this.navFromAccounts) {
								this.navFromAccounts = false;
								sap.ui.getCore().getEventBus().publish(
										"cus.crm.mytasks",
										"followUpTaskCreated");
							}
							s3Controller.bIsFollowupFromTasks = false;
							s3Controller.oParamsToPass = undefined;
							this._navBack();
						} else {
							// WAVE 6 ENHANCEMENT
							if (s3Controller
									&& s3Controller.bIsFollowupFromOthers)
								s3Controller.bIsFollowupFromOthers = false;
							if (this.navFromAccounts) {
								this.navFromAccounts = false;
								var oContext = {
									contextPath : this.getView()
											.getBindingContext().getPath()
								};
								sap.ui.getCore().getEventBus().publish(
										"cus.crm.mytasks", "taskChanged",
										oContext);
							}
							this._navBack();
						}
					},

					_setFullScreenTitle : function(oTask) {
						var title = cus.crm.mytasks.util.Formatter
								.showTaskTitle(oTask.Description, oTask.Id);
						this._oControlStore.oTitle.setText(title);
					},

					_getApplicationModel : function() {
						var oAMcontrollers = this.oApplicationFacade
								.getApplicationModel("controllers");
						if (!oAMcontrollers) {
							var jModel = new sap.ui.model.json.JSONModel({
								s2Controller : undefined,
								s3Controller : undefined,
								s4Controller : this,
							});
							this.oApplicationFacade.setApplicationModel(
									"controllers", jModel);
							oAMcontrollers = this.oApplicationFacade
									.getApplicationModel("controllers");
						}
						return oAMcontrollers;
					},

					_getRelatedInformationOfTask : function(oContext) {
						var oView = this.getView(), oModel = oContext ? oContext
								.getModel()
								: oView.getModel(), fnSuccess = function(
								oExtraObject, oData, oResponse, aErrorResponses) {
							if (aErrorResponses && aErrorResponses.length > 0)
								cus.crm.mytasks.util.Util
										.onRequestFailed(aErrorResponses[0],
												"Reading related information of tasks failed");
							else {
								var aNavLinks = oExtraObject.navlinks, oRelatedInfoOfTask = {};
								for ( var i = -1, oCurResponse; oCurResponse = oData.__batchResponses[++i];)
									oRelatedInfoOfTask[aNavLinks[i]] = oCurResponse.data.results;
								this
										._bindRelatedInformationOfTask(oRelatedInfoOfTask);

							}
						}, fnError = function(oError) {
							cus.crm.mytasks.util.Util
									.onRequestFailed(oError,
											"Reading related information of tasks failed");
						}, oCU = cus.crm.mytasks.util, aRelatedInfoPaths = [], aNavLinks = [
								oCU.Attachments.NAVLINK,
								oCU.DocumentHistory.NAVLINK, "TaskLogSet",
								"TaskStatuses" ];
						for ( var i = 0; i < aNavLinks.length; i++)
							if (aNavLinks[i])
								aRelatedInfoPaths.push([ oContext.getPath(),
										aNavLinks[i] ].join("/"));
						oView.byId("attachmentOverview").setBusy(true);
						oView.byId("tabDocHistory").setBusy(true);
						oCU.Util.getAllPrerequisites(oModel, aRelatedInfoPaths,
								{
									success : jQuery.proxy(fnSuccess, this, {
										navlinks : aNavLinks,
										paths : aRelatedInfoPaths
									}),
									error : fnError,
									basync : true
								});
					},

					_bindRelatedInformationOfTask : function(oFetchedData) {
						var oCU = cus.crm.mytasks.util, oParams = undefined, oView = this
								.getView(), oCUAtt = oCU.Attachments, oCUDoc = oCU.DocumentHistory;
						for ( var sProperty in oFetchedData) {
							oParams = {
								bExpandCall : false,
								curResults : oFetchedData[sProperty]
							};
							switch (sProperty) {
							case oCUAtt.NAVLINK:
								oView.byId("attachmentOverview").setBusy(false);
								oCUAtt.OverviewPage.bindData(this, oParams);
								break;
							case oCUDoc.NAVLINK:
								oView.byId("tabDocHistory").setBusy(false);
								oCUDoc.bindDataToTable(this, oParams);
								break;
							case "TaskLogSet":
								this.bindTaskErrors(oParams);
								break;
							case "TaskStatuses":
								oCU.StatusListUtil.bindStatusValuesToTask(this
										.getView().getModel(), oParams);
								break;
							default:
								oParams = {
									bExpandCall : false,
									curResults : oFetchedData[sProperty]
								};
								break;
							}
						}
					},

					editTask : function(oEvent) {
						var oCUU = cus.crm.mytasks.util.Util, oView = this
								.getView(), sPath = oView.getBindingContext()
								.getPath();
						oCUU.requestBusyDialog();
						this.oRouter.navTo("taskDetail", {
							contextPath : sPath.substr(1)
						}, true);
					},

					showAccountOverview : function(oEvent) {
						var oCUU = cus.crm.mytasks.util.Util, oView = this
								.getView(), oModel = oView.getModel(), oCurrentTask = oView
								.getBindingContext().getObject(), sPath = "/AccountCollection('"
								+ oCurrentTask.AccountId + "')", oParams = {
							"$expand" : ""
						}, fnError = function(oError) {
							cus.crm.mytasks.util.Util
									.onRequestFailed(oError,
											"Operation failed: Read data for business card. ");
						}, fnSuccess = function(oData, oResponse) {
							cus.crm.mytasks.util.Util
									.logObjectToConsole(
											"Operation successful: Read data for business card. ",
											oData);
							this.openBusinessCardCompany(oData, oResponse);
						};
						/**
						 * @ControllerHook Provision for getting the Account
						 *                 Photo of the Task object. An Overview
						 *                 of the account details are shown via
						 *                 a pop-over including the photo if
						 *                 enabled. This is called when the user
						 *                 clicks on the account attribute of
						 *                 the task object if available. The
						 *                 hook must be documented like:
						 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookGetS4AccountPhoto
						 * @return {boolean}
						 */
						oParams["$expand"] = this.extHookGetS4AccountPhoto ? this
								.extHookGetS4AccountPhoto() ? [ "MainAddress",
								"MainContact/WorkAddress", "Logo" ].join(",")
								: [ "MainAddress", "MainContact/WorkAddress" ]
										.join(",")
								: [ "MainAddress", "MainContact/WorkAddress",
										"Logo" ].join(",");
						jQuery.sap.log.debug("oData request to be fired:"
								+ sPath);
						oCUU.requestBusyDialog();
						oModel.read(sPath, null, oParams, true, jQuery.proxy(
								fnSuccess, this), jQuery.proxy(fnError, this));

					},

					openBusinessCardCompany : function(oData, oResponse) {
						var oCU = cus.crm.mytasks.util, oView = this.getView(), oCUU = oCU.Util, sAccSchema = oCU.AccountF4
								.getFilterString(), oCUF = oCU.Formatter;
						oCUU.logObjectToConsole(
								"open Business card with this data: ", oData);
						var oAccDetails = {}, fnCallbackNavParaComp = jQuery
								.proxy(
										function(oEvent) {
											var sKey = [ "'", "'" ]
													.join(oData.accountID);
											return {
												target : {
													semanticObject : "Account",
													action : [
															"MyAccounts&/detail/AccountCollection(",
															")" ].join(sKey)
												}
											};
										}, this);
						oAccDetails.title = oCUF.getResourceBundle().getText(
								"DETAILS_BCARD_ACCOUNT");
						oAccDetails.imgurl = oCUF.logoUrlFormatter(oData.Logo);
						oAccDetails.companyname = oData[sAccSchema];
						if (oData.MainAddress) {
							var oMA = oData.MainAddress;
							oAccDetails.companyphone = oMA.phone;
							oAccDetails.companyaddress = oMA.address;
						}
						if (oData.MainContact) {
							var oMC = oData.MainContact, oMCA = oMC.WorkAddress;
							oAccDetails.maincontactname = oMC.fullName;
							if (oMCA) {
								oAccDetails.maincontactphone = oMCA.phone;
								oAccDetails.maincontactmobile = oMCA.mobilePhone;
								oAccDetails.maincontactemail = oMCA.email;
							}
						}
						oAccDetails.beforeExtNav = fnCallbackNavParaComp;
						var oAccLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
								oAccDetails), oOpenBy = oView.byId("oaAccount");
						oAccLaunch.openBy(oOpenBy);
						oCUU.releaseBusyDialog();
					},

					showContactOverview : function(oEvent) {
						var oCUU = cus.crm.mytasks.util.Util, oView = this
								.getView(), oModel = oView.getModel(), oCurrentTask = oView
								.getBindingContext().getObject(), sPath = "/ContactCollection(contactID='"
								+ oCurrentTask.ContactId
								+ "',accountID='"
								+ oCurrentTask.AccountId + "')", oParams = {
							"$expand" : ""
						}, fnError = function(oError) {
							cus.crm.mytasks.util.Util
									.onRequestFailed(oError,
											"Operation failed: Read data for business card of Contact. ");
						}, fnSuccess = function(oData, oResponse) {
							var oCU = cus.crm.mytasks.util;
							oCU.Util
									.logObjectToConsole(
											"Operation successful: Read data for business card of Contact. ",
											oData);
							if (oData.accountID !== ""
									&& oData.contactID !== "")
								this.openBusinessCardContact(oData, oResponse);
							else {
								sap.m.MessageToast.show(oCU.Formatter
										.getResourceBundle().getText(
												"S4_ACCOUNT_CONTACT_NOREL"));
								oCU.Util.releaseBusyDialog();
							}
						};
						/**
						 * @ControllerHook Provision for getting the Contact
						 *                 Photo of the Task object. Contact
						 *                 details are shown via a pop-over &
						 *                 additionally the photo of the
						 *                 contact. This is called when the user
						 *                 clicks on the Contact attribute of
						 *                 the task object if available. The
						 *                 hook must be documented like:
						 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookGetS4ContactPhoto
						 * @return {boolean}
						 */
						oParams["$expand"] = this.extHookGetS4ContactPhoto ? this
								.extHookGetS4ContactPhoto() ? [ "WorkAddress",
								"Photo" ].join(",") : "WorkAddress"
								: [ "WorkAddress", "Photo" ].join(",");
						jQuery.sap.log.debug("oData request to be fired:"
								+ sPath);
						oCUU.requestBusyDialog();
						oModel.read(sPath, null, oParams, true, jQuery.proxy(
								fnSuccess, this), jQuery.proxy(fnError, this));
					},

					openBusinessCardContact : function(oData, oResponse) {
						var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCUF = oCU.Formatter;
						var oConDetails = {}, fnCallbackNavParaComp = jQuery
								.proxy(
										function(oEvent) {
											var sKey = [
													[ "accountID='", "'" ]
															.join(oData.accountID),
													[ "contactID='", "'" ]
															.join(oData.contactID) ]
													.join(",");
											return {
												target : {
													semanticObject : "ContactPerson",
													action : [
															"MyContacts&/display/ContactCollection(",
															")" ].join(sKey)
												}
											};
										}, this);
						oConDetails.title = oCUF.getResourceBundle().getText(
								"DETAILS_BCARD_CONTACT");
						oConDetails.name = oData.fullName;
						oConDetails.imgurl = oCUF
								.photoUrlFormatter(oData.Photo);
						oConDetails.department = oData.department;
						oConDetails.companyname = oData.company;
						if (oData.WorkAddress) {
							var oWA = oData.WorkAddress;
							oConDetails.companyaddress = oWA.address;
							oConDetails.contactemail = oWA.email;
							oConDetails.contactphone = oWA.phone;
							oConDetails.contactmobile = oWA.mobilePhone;
						}
						oConDetails.beforeExtNav = fnCallbackNavParaComp;
						var oConLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
								oConDetails), oOpenBy = this.getView().byId(
								"oaContact");
						oConLaunch.openBy(oOpenBy);
						oCUU.releaseBusyDialog();
					},

					confirmDeleteTask : function(oEvent) {
						var oResourceBundle = cus.crm.mytasks.util.Formatter
								.getResourceBundle();
						var fnConfirmDelete = jQuery.proxy(function(sAction) {
							if (sAction === sap.m.MessageBox.Action.OK)
								this.deleteTask(sAction);
							else
								jQuery.sap.log.debug("delete task: cancelled");
						}, this);
						var sQuestion = oResourceBundle
								.getText("DETAILS_MESSAGEBOX_TEXT"), mOptions = {
							icon : sap.m.MessageBox.Icon.QUESTION,
							title : oResourceBundle
									.getText("DETAILS_MESSAGEBOX_TITLE"),
							actions : [ sap.m.MessageBox.Action.OK,
									sap.m.MessageBox.Action.CANCEL ],
							onClose : fnConfirmDelete
						};
						sap.m.MessageBox.confirm(sQuestion, mOptions);
					},

					deleteTask : function(oAction) {
						var oCU = cus.crm.mytasks.util, oCUU = oCU.Util;
						oCUU.requestBusyDialog();
						var oContext = this.getView().getBindingContext(), taskToDelete = oContext
								.getObject();
						if (oCU.Schema.getServiceVersion() == 1
								&& oCU.Schema.getServiceSchemaVersion() >= 4) {
							var aNavLinks = [ oCU.Attachments.NAVLINK,
									oCU.DocumentHistory.NAVLINK, "TaskLogSet",
									"TaskStatuses" ];
							for ( var i = -1, sNavLink; sNavLink = aNavLinks[++i];)
								taskToDelete[sNavLink] = oCUU
										.getDeferredObject(oContext.getPath()
												.substr(1), sNavLink);
						}
						oCUU.logObjectToConsole("delete task: started",
								taskToDelete);
						oCUU.deleteTaskAndUpdateTaskList(taskToDelete, this);
					},

					openFollowupActivity : function(oEvent) {
						if (!this._oFollowupAS) {
							var oCU = cus.crm.mytasks.util, oBundle = oCU.Formatter
									.getResourceBundle(), aFollowupTexts = [
									"S4_BUTTONS_FOLLOWUPTOTASK",
									"S4_BUTTONS_FOLLOWUPTOOPPT",
									"S4_BUTTONS_FOLLOWUPTOAPPT" ], aButtons = [];
							/**
							 * @ControllerHook Provision for creating other
							 *                 follow-up documents from the
							 *                 current document or transaction.
							 *                 The follow-up pop-over displays
							 *                 the list of all possible
							 *                 follow-up documents that can be
							 *                 created. This is called when the
							 *                 user clicks on the Follow up
							 *                 pushbutton at footer of the
							 *                 Overview page. The hook must be
							 *                 documented like:
							 * 
							 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookAddAdditionalFollowupTypes
							 * @param {array}
							 *            aFollowupTexts Array of i18n resource
							 *            texts
							 * @return {void}
							 */
							if (this.extHookAddAdditionalFollowupTypes) {
								this
										.extHookAddAdditionalFollowupTypes(aFollowupTexts);
							}
							for ( var i = 0, j = aFollowupTexts.length; i < j; i++)
								aButtons.push(new sap.m.Button({
									text : oBundle.getText(aFollowupTexts[i]),
									press : jQuery.proxy(
											this.createFollowUpObject, this)
								}));
							this._oFollowupAS = new sap.m.ActionSheet({
								placement : sap.m.PlacementType.Top,
								buttons : aButtons
							});
						}
						this._oFollowupAS.openBy(oEvent.getSource());
					},

					createFollowUpObject : function(oEvent) {
						var oCU = cus.crm.mytasks.util, oCUF = oCU.Formatter, oView = this
								.getView(), oModel = oView.getModel(), sPath = undefined, sBtnText = oEvent
								.getSource().getText(), oCurObject = {
							curTask : oView.getBindingContext().getObject(),
							followupType : sBtnText
						}, oBundle = oCUF.getResourceBundle();
						oCU.Util.requestBusyDialog();
						switch (sBtnText) {
						case oBundle.getText("S4_BUTTONS_FOLLOWUPTOTASK"):
							sPath = "TaskFollowupTransTypes";
							break;
						case oBundle.getText("S4_BUTTONS_FOLLOWUPTOOPPT"):
							sPath = "OpptFollowupTransTypes";
							break;
						case oBundle.getText("S4_BUTTONS_FOLLOWUPTOAPPT"):
							sPath = "AppFollowupTransTypes";
							break;
						default:
							/**
							 * @ControllerHook Provision for implementing own
							 *                 logic to create a follow-up
							 *                 document or object. The list of
							 *                 follow-up transaction types, if
							 *                 more than one, are listed in a
							 *                 dialog. If there is just one
							 *                 transaction type, the user can be
							 *                 directed to the Fiori app that
							 *                 allows creation of such a
							 *                 document. This is called when the
							 *                 user selects the type of
							 *                 follow-up document that the user
							 *                 would like to create. The hook
							 *                 must be documented like:
							 * 
							 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookCreateFollowupObject
							 * @param {object}
							 *            oEvent Event triggered when selecting
							 *            the type of follow up object to create
							 * @return {void}
							 */
							if (this.extHookCreateFollowupObject)
								this.extHookCreateFollowupObject(oEvent);
							break;
						}
						if (sPath) {
							// sPath += "?Guid=guid'" + oCO.curTask.Guid
							// + "'&TransactionType='"
							// + oCO.curTask.TransactionType + "'";
							var aTransactionTypes = undefined, oProcType = {
								key : "",
								value : "",
								privateEnabled : "",
							}, fnSuccessFT = function(oData, oResponse) {
								aTransactionTypes = oData.results;
								cus.crm.mytasks.util.Util.releaseBusyDialog();
							}, fnErrorFT = function(oCurObject, oError) {
								var oCU = cus.crm.mytasks.util, oCUS = oCU.Schema, oRB = oCU.Formatter
										.getResourceBundle(), sMsg = [ "'",
										oCurObject.curTask.Description, "'" ]
										.join(""), oFollowup = {
									sv : oCUS.getServiceVersion(),
									ssv : oCUS.getServiceSchemaVersion(),
									msg : oRB.getText("FOLLOWUP_ERROR_MSG",
											[ sMsg ])
								};
								oCU.Util.onRequestFailed(oError,
										"Operation Failed: Read Transaction Types for '"
												+ oCurObject.followupType
												+ "'.", oFollowup);
							}, mParams = {
								Guid : oModel.formatValue(
										oCurObject.curTask.Guid, oCUF.EDM_GUID),
								TransactionType : oModel.formatValue(
										oCurObject.curTask.TransactionType,
										oCUF.EDM_STRING)
							};
							oModel.read(sPath, null, mParams, false, jQuery
									.proxy(fnSuccessFT, this), jQuery.proxy(
									fnErrorFT, this, oCurObject));
							// CallFunction is always asynchronous
							// oModel
							// .callFunction(
							// sPath,
							// "GET",
							// {
							// Guid : oCO.curTask.Guid,
							// TransactionType : oCO.curTask.TransactionType
							// }, null, jQuery.proxy(fnSuccessFT,
							// this), jQuery.proxy(
							// fnErrorFT, this, sPT),
							// false);
							if (!this._oDlFollowupTT) {
								this._oDlFollowupTT = new sap.ui.xmlfragment(
										"cus.crm.mytasks.view.FollowupDialog",
										this);
								this._oDlFollowupTT.setModel(oView
										.getModel("i18n"), "i18n");
							}
							if (Array.isArray(aTransactionTypes))
								if (aTransactionTypes.length == 1) {
									oProcType.key = aTransactionTypes[0].ProcessTypeCode;
									oProcType.value = aTransactionTypes[0].Description;
									oProcType.privateEnabled = aTransactionTypes[0].PrivateFlag;
								} else {
									this._oDlFollowupTT.setModel(
											new sap.ui.model.json.JSONModel(
													aTransactionTypes),
											"FollowupTypes");
									this._oDlFollowupTT._sFollowupType = oCurObject.followupType;
									this._oDlFollowupTT.open();
								}
							if (oProcType.key !== "")
								this._onSelectedFollowUpType(oProcType,
										oCurObject);
						} else
							jQuery.sap.log
									.debug("## Incorrect way to perform a Follow up ##");
					},

					liveSearchFollowUpType : function(oEvent) {
						var sVal = oEvent.getParameter("value");
						if (sVal.length == 0 || (sVal && sVal.length > 3))
							this._commonSearchForFollowUpType(sVal, [], oEvent
									.getParameter("itemsBinding"));
					},

					searchFollowUpType : function(oEvent) {
						var sVal = oEvent.getParameter("value");
						this._commonSearchForFollowUpType(sVal, [], oEvent
								.getParameter("itemsBinding"));
					},

					_commonSearchForFollowUpType : function(sVal, aFilter,
							itemsBinding) {
						if (sVal !== "")
							aFilter
									.push(new sap.ui.model.Filter(
											"Description",
											sap.ui.model.FilterOperator.Contains,
											sVal));
						itemsBinding.aApplicationFilters = [];
						itemsBinding.filter(aFilter,
								sap.ui.model.FilterType.Application);

					},

					selectFollowUpType : function(oEvent) {
						var oContext = this.getView().getBindingContext(), oCT = oContext
								.getObject(), oSI = oEvent
								.getParameter("selectedItem"), oCO = {
							curTask : oCT,
							followupType : oEvent.getSource()._sFollowupType
						}, oProcType = {
							key : oSI.getDescription(),
							value : oSI.getTitle(),
							privateEnabled : oSI.data("PrivacyAllowed")
						};
						this._onSelectedFollowUpType(oProcType, oCO);
					},

					_onSelectedFollowUpType : function(oProcType, oCO) {
						var oBundle = cus.crm.mytasks.util.Formatter
								.getResourceBundle(), oContext = this.getView()
								.getBindingContext(), aStrIds = [
								"S4_BUTTONS_FOLLOWUPTOTASK",
								"S4_BUTTONS_FOLLOWUPTOOPPT",
								"S4_BUTTONS_FOLLOWUPTOAPPT" ], aChecks = [];
						for ( var i = 0; i < aStrIds.length; i++)
							aChecks.push(oBundle.getText(aStrIds[i]));

						switch (oCO.followupType) {
						case aChecks[0]:
							this.oParamsToPass = {
								FUT : "X",
								AccountID : oCO.curTask.AccountId,
								AccountName : oCO.curTask.AccountName,
								Note : oCO.curTask.Note,
								ContactID : oCO.curTask.ContactId,
								ContactName : oCO.curTask.ContactName,
								priority : oCO.curTask.Priority,
								title : oCO.curTask.Description,
								taskId : oCO.curTask.Id,
								taskGuid : oCO.curTask.Guid,
								ProcessTypeDescription : oProcType.value,
								privateFlag : oProcType.privateEnabled,
							};

							// WAVE 7 ENHANCEMENT
							this.oRouter.navTo("newTask", {
								processType : oProcType.key
							});
							break;
						case aChecks[1]:
						case aChecks[2]:
							var sSemanticObject = undefined, sAction = undefined, sAppSpecificRoute = undefined, oParamsToPass = undefined;
							if (oCO.followupType === aChecks[1]) {
								sSemanticObject = "Opportunity";
								sAction = "manageOpportunity";
								sAppSpecificRoute = [ "&", "followupfromtask",
										oContext.getPath().substr(1),
										oProcType.key ].join("/");
								oParamsToPass = {
									FUO : "X",
									AccountID : oCO.curTask.AccountId,
									ContactID : oCO.curTask.ContactId,
									title : oCO.curTask.Description,
									taskId : oCO.curTask.Id,
									taskGuid : oCO.curTask.Guid,
								};
							} else {
								sSemanticObject = "Appointment";
								sAction = "myAppointments";
								sAppSpecificRoute = [
										"&",
										"newappointmentfromtask",
										(new Date()).toJSON().split("T")[0]
												.replace(/-/g, ""),
										oProcType.key ].join("/");
								oParamsToPass = {
									FUA : "X",
									AccountID : oCO.curTask.AccountId,
									ContactID : oCO.curTask.ContactId,
									title : oCO.curTask.Description,
									taskId : oCO.curTask.Id,
									taskGuid : oCO.curTask.Guid,
								};
							}
							var fGetService = sap
									&& sap.ushell
									&& sap.ushell.Container
									&& sap.ushell.Container.getService
									&& sap.ushell.Container
											.getService("CrossApplicationNavigation");
							var sLoc = fGetService.hrefForExternal({
								target : {
									semanticObject : sSemanticObject,
									action : sAction
								},
								params : oParamsToPass,
								appSpecificRoute : sAppSpecificRoute
							}) || "";
							window.location = sLoc;
							break;
						}
						// var message = oBundle.getText("FOLLOWUP_COMPLETED");
						// sap.m.MessageToast.show(message, {
						// closeOnBrowserNavigation : false
						// });
					},

					_getOverviewTask : function(bHasETagErrorOccurred) {
						var oCU = cus.crm.mytasks.util, fnBindingOverviewTask, oView = this
								.getView(), mParams, oContext = oView
								.getBindingContext();
						if (bHasETagErrorOccurred) {
							jQuery.sap.log
									.debug("S4 page called again due to ETag mismatch");
							oContext.getModel().deleteCreatedEntry(oContext);
							mParams = null;
							fnBindingOverviewTask = function(oContext) {
								if (oContext) {
									this.getView().bindElement(
											oContext.getPath());
									this.oOverviewTask = oContext.getObject();
									this
											.initializeOverviewPage(this.oOverviewTask);
								}
							};
						} else {
							jQuery.sap.log.debug("S4 page called via bookmark");
							// TODO: Provide hooks for additional oData calls
							if (oCU.Schema.getServiceVersion() == 1
									&& oCU.Schema.getServiceSchemaVersion() >= 4) {
								mParams = {
									expand : [ oCU.Attachments.NAVLINK,
											oCU.DocumentHistory.NAVLINK,
											"TaskLogSet", "TaskStatuses" ]
											.join(",")
								};
								oView.byId("attachmentOverview").setBusy(true);
								oView.byId("tabDocHistory").setBusy(true);
							} else
								mParams = null;
							fnBindingOverviewTask = function(oContext) {
								if (oContext) {
									var oCUAtt = oCU.Attachments, oCUS = oCU.Schema, oView = this
											.getView(), aNavLinks = [], aDummy = [], oParams = undefined, oCUDoc = oCU.DocumentHistory;
									oView.bindElement(oContext.getPath());
									this.oOverviewTask = oContext.getObject();
									if (oCUS.getServiceVersion() == 1
											&& oCUS.getServiceSchemaVersion() >= 4) {
										aNavLinks = [ oCU.Attachments.NAVLINK,
												oCU.DocumentHistory.NAVLINK,
												"TaskLogSet", "TaskStatuses" ];
										if (this.oOverviewTask.Etag !== this._sETag) {
											aDummy = this.oOverviewTask.__metadata.etag
													.split("'");
											if (aDummy.length > 1) {
												aDummy
														.splice(1, 1,
																this._sETag);
												this.oOverviewTask.Etag = this._sETag;
												this.oOverviewTask.__metadata.etag = aDummy
														.join("'");
											}
										}
										this._sETag = "";
									}
									for ( var i = 0; i < aNavLinks.length; i++) {
										oParams = {
											bExpandCall : true,
											curResults : this.oOverviewTask[aNavLinks[i]]["__list"]
										};
										switch (i) {
										case 0:
											oView.byId("attachmentOverview")
													.setBusy(false);
											oCUAtt.OverviewPage.bindData(this,
													oParams);
											break;
										case 1:
											oView.byId("tabDocHistory")
													.setBusy(false);
											oCUDoc.bindDataToTable(this,
													oParams);
											break;
										case 2:
											this.bindTaskErrors(oParams);
											break;
										case 3:
											oCU.StatusListUtil
													.bindStatusValuesToTask(
															oContext.getModel(),
															oParams);
											break;
										default:
											break;
										}
									}
									this.bIsBookmarkUsed = true;
									this
											.initializeOverviewPage(this.oOverviewTask);
								}
							};
						}
						oContext.getModel().createBindingContext(
								oContext.getPath(), null, mParams,
								jQuery.proxy(fnBindingOverviewTask, this),
								false);
					},

					_checkFor412StatusCode : function(oError, sLogMsg) {
						var oCU = cus.crm.mytasks.util, oBundle = oCU.Formatter
								.getResourceBundle();
						if (oError.response.statusCode === "412") {
							jQuery.sap.log.debug("412 error occurred during"
									+ sLogMsg);
							var fnClose = function(oAction) {
								jQuery.sap.log
										.debug("S4 page called again due to ETag mismatch");
								var oCUU = cus.crm.mytasks.util.Util;
								oCUU.requestBusyDialog();
								this.oOverviewTask = undefined;
								this._getOverviewTask(true);
								oCUU.releaseBusyDialog();
							}, mOptions = {
								icon : sap.m.MessageBox.Icon.ERROR,
								title : oBundle.getText("S3_412_TITLE"),
								actions : [ sap.m.MessageBox.Action.OK ],
								onClose : jQuery.proxy(fnClose, this),
							};
							sap.m.MessageBox.show(oBundle
									.getText("S3_412_ERRORMSG"), mOptions);
							oCU.Util.releaseBusyDialog();
						} else {
							if (this.navFromAccounts || this.bIsBookmarkUsed) {
								var aDummy = sap.ushell.Container.getService(
										"URLParsing").getHash(location).split(
										"/"), oView = this.getView(), oContext = new sap.ui.model.Context(
										oView.getModel(), '/'
												+ aDummy[aDummy.length - 1]);
								oView.setBindingContext(oContext);
							}
							oCU.Util.onRequestFailed(oError, sLogMsg);
						}
					},

					navToRelatedDocument : function(oEvent) {
						var bNavToWithinTasks = false, oDocHistoryTable = this
								.getView().byId("tabDocHistory"), sTransactionID = oEvent
								.getSource().getText(), aDummy = [], aTransactionData = oDocHistoryTable
								.getModel("docHistory").getProperty(
										"/transactions"), sLocation = "";
						for ( var i = -1, oCurDocument; oCurDocument = aTransactionData[++i];)
							if (oCurDocument.ObjectId === sTransactionID) {
								if (oCurDocument.bWithinApp)
									bNavToWithinTasks = true;
								sLocation = oCurDocument.navToURL;
								break;
							}
						if (bNavToWithinTasks) {
							aDummy = sLocation.split("/");
							this.oRouter.navTo(aDummy[1], {
								contextPath : aDummy[2]
							});
						} else
							window.location = sLocation;
					},

					// START of TASK ERRORS
					showTaskErrors : function(oEvent) {
						this._oDlTaskErrors.open();
					},

					closeErrorMsg : function(oEvent) {
						this._oDlTaskErrors.close();
					},

					_addTaskErrorObject : function(oTaskError) {
						var oObject = {};
						jQuery.extend(oObject, oTaskError, true);
						switch (oObject.LogType) {
						case "E":
							oObject.Icon = "sap-icon://error";
							oObject.IconColor = "red";
							break;
						case "W":
							oObject.Icon = "sap-icon://warning";
							oObject.IconColor = "orange";
							break;
						default:
							oObject.Icon = "sap-icon://hint";
							oObject.IconColor = "gray";
							break;
						}
						return oObject;
					},

					bindTaskErrors : function(oParams) {
						if (oParams) {
							var oTempState = {}, oModel = this.getView()
									.getModel();
							if (oParams.bExpandCall) {
								oTempState.paths = oParams.curResults || [];
								oTempState.controlval = [];
								for ( var i = -1, sPath; sPath = oTempState.paths[++i];)
									oTempState.controlval.push(this
											._addTaskErrorObject(oModel
													.getObject('/' + sPath)));
							} else {
								oTempState.paths = [];
								oTempState.controlval = [];
								var aDummy = undefined, sPath = undefined;
								for ( var i = -1, oCurObject; oCurObject = oParams.curResults[++i];) {
									aDummy = oCurObject.__metadata.id
											.split("/");
									oTempState.controlval.push(this
											._addTaskErrorObject(oCurObject));
									sPath = aDummy[aDummy.length - 1];
									oTempState.paths.push(sPath);
								}
							}
							var jsonModel = new sap.ui.model.json.JSONModel({
								list : oTempState.controlval
							}), sTitle = cus.crm.mytasks.util.Formatter
									.getResourceBundle().getText(
											"S4_MESSAGES_TITLE",
											[ oTempState.controlval.length ]);

							this.setBtnEnabled("error",
									!(oTempState.controlval.length === 0));
							if (!this._oDlTaskErrors) {
								// error Message
								this._oDlTaskErrors = new sap.ui.xmlfragment(
										"cus.crm.mytasks.view.ErrorMessageDialog",
										this);
								this._oDlTaskErrors.setModel(this.getView()
										.getModel("i18n"), "i18n");
								if (sap.ui.Device.system.desktop
										|| sap.ui.Device.system.tablet)
									this._oDlTaskErrors
											.setContentWidth("30rem");
							}
							this._oDlTaskErrors.setModel(jsonModel, "TaskLogs");
							this._oDlTaskErrors.setTitle(sTitle);
						}
					}
				// END of TASK ERRORS
				});