/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
// To circumvent check of scaffolding API from UI5 1.24 onwards
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");

sap.ca.scfld.md.controller.BaseFullscreenController
		.extend(
				"cus.crm.mytasks.view.S3",
				{
					enterDueDatePressed : false,
					createdfromNotes : false,
					createdfromAccounts : false,
					bIsBookmarkUsed : false,
					bIsFollowupFromTasks : false,
					bIsFollowupFromOthers : false,
					oStatusDDLB : {
						bNotRetrieved : false,
						errorObj : null,
					},

					// Controller Methods - onInit
					onInit : function() {
						// execute the onInit for the base class
						// BaseFullScreenController
						jQuery.sap.log.debug("begin on init s3");
						sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit
								.call(this);

						this._getApplicationModel().setProperty(
								"/s3Controller", this);
						var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCUC = oCU.ContactF4, oView = this
								.getView(), oCUE = oCU.EmployeeF4, oCUA = oCU.AccountF4, oStartupParams = undefined, oModel = oView
								.getModel();
						if (!oCU.Schema.getServiceVersion())
							oCU.Schema.initServiceSchemaVersion(oModel, "Task");

						this.oSavedTask = this.oNewTask = undefined;
						// Get accountID query parameter
						oCUA.create(this);
						oCUC.create(this);
						oCUE.create(this);
						var myComponent = sap.ui
								.component(sap.ui.core.Component
										.getOwnerIdFor(this.getView()));
						if (myComponent && myComponent.getComponentData())
							oStartupParams = myComponent.getComponentData().startupParameters;
						this.oRouter.attachRouteMatched(jQuery.proxy(
								this.handleNavigationWithTasks, this,
								oStartupParams));
						oCUU.logObjectToConsole("S3 View Model after init: ",
								oModel);
						var oEventDelegate = {
							onsapenter : this._onEnterPressed
						};
						// oView.byId("accountInput").addEventDelegate(
						// oEventDelegate, this);
						// oView.byId("contactInput").addEventDelegate(
						// oEventDelegate, this);
						oView.byId("dueDateInput").addEventDelegate(
								oEventDelegate, this);
						if (sap.ui.Device.system.phone)
							oView.byId("TxtTypeInput").removeStyleClass(
									"TaskTypePad").addStyleClass(
									"TaskTypePadMobile");
						jQuery.sap.log.debug("end on init s3");
					},

					// Controller Methods - onBeforeRendering
					onBeforeRendering : function() {
						jQuery.sap.log.debug("on before render s3");
						// TO get the Button List of SCAFFOLDING: If component
						// extended && over-ridden Master Header Footer, this
						// may break
						// this._oControlStore.oButtonListHelper.aButtons[1].oButton
						// .setType(sap.m.ButtonType.Reject);
					},

					// Controller Methods - onAfterRendering
					onAfterRendering : function(e) {
						jQuery.sap.log.debug("on after render s3");
						if (this.oStatusDDLB.bNotRetrieved) {
							cus.crm.mytasks.util.Util
									.onRequestFailed(this.oStatusDDLB.errorObj,
											"Operation failed: Read status customizing.");
							this.oStatusDDLB.errorObj = null;
							this.oStatusDDLB.bNotRetrieved = false;
						}
						// if (this.oSavedTask && this.oSavedTask.Completed)
						// this.oRouter.navTo("taskList");
					},

					// Controller Methods - onExit
					onExit : function() {
						var oCU = cus.crm.mytasks.util, aArrayVH = [
								oCU.AccountF4.getValueHelp(),
								oCU.ContactF4.getValueHelp(),
								oCU.EmployeeF4.getValueHelp() ];
						for ( var i = -1, oCurValueHelp; oCurValueHelp = aArrayVH[++i];)
							for ( var j in oCurValueHelp.mEventRegistry)
								delete oCurValueHelp.mEventRegistry[j];
					},

					/*
					 * FIORI WAVE 2 - Branch : Rel - 1.0 START of INITAL
					 * DEVELOPMENT for MyTasks
					 */
					handleNavigationWithTasks : function(oStartupParams, oEvent) {
						this.onBeforeRendering();
						jQuery.sap.log.debug("on route matched s3");
						var oCU = cus.crm.mytasks.util, oCUS = oCU.Schema, oCUU = oCU.Util, oView = this
								.getView(), oBundle = oCU.Formatter
								.getResourceBundle(), sRouteName = oEvent
								.getParameter("name"), oArgs = oEvent
								.getParameter("arguments"), oPrivateFlag = undefined;
						var note = undefined, oContext = undefined, accountId = undefined, accountName = undefined, oTaskParams = undefined;
						var aPrerequisitePaths = this
								._checkIfPrerequisitesExist();
						switch (sRouteName) {
						case "taskDetail":
							jQuery.sap.log
									.debug("S3 page called with task object");
							oContext = new sap.ui.model.Context(oView
									.getModel(), '/' + oArgs.contextPath);
							oView.setBindingContext(oContext);
							// Make sure the master is here
							this.oSavedTask = oContext.getObject();
							if (!this.oSavedTask) {
								jQuery.sap.log
										.debug("S3 page called via bookmark");
								this._getTaskHeaderInfo();
								// oView.getModel().read(oContext.getPath(),
								// null, null, false, fnSuccess, fnError);
								this.bIsBookmarkUsed = true;
								this.prepareNewTask(this.oSavedTask);
							}
							if (this.oSavedTask.Completed) {
								var sMsg = [ "'", "'" ]
										.join(this.oSavedTask.Description), messageToShow = oBundle
										.getText("LIST_COMPLETE_CONFIRMATION",
												[ sMsg ]);
								sap.m.MessageToast.show(messageToShow, {
									closeOnBrowserNavigation : false
								});
							}
							this.initializeDetailsPage(this.oSavedTask);
							oPrivateFlag = {
								curType : typeof this.oSavedTask.PrivateAllowed,
								curValue : this.oSavedTask.PrivateAllowed
							};
							this._setPrivacyForTask(oPrivateFlag, oCUS,
									oCU.TechnicalInfoUtil);
							if (oCUS.getServiceVersion() == 1
									&& oCUS.getServiceSchemaVersion() >= 4)
								oCU.Attachments.EditPage.bindData(this);
							// if (this.oSavedTask) {
							// this.initializeDetailsPage(this.oSavedTask);
							// jQuery.sap.log.debug("S3 page called with task
							// object");
							// } else {
							// jQuery.sap.log.debug("S3 page called via
							// bookmark");
							// this.navBack = true;
							// }
							break;
						case "newTask":
						case "newTaskFromNote":
						case "newTaskWithAccount":
							jQuery.sap.log
									.debug("S3 page called with empty object");
							oContext = new sap.ui.model.Context(oView
									.getModel(), '/new');
							oView.setBindingContext(oContext);
							// WAVE 7 ENHANCEMENT
							this._checkIfFollowupFromTasks();
							if (this.oParamsToPass) {
								// FOLLOWUP of TASK from TASKS app
								this.bIsFollowupFromTasks = true;
								oTaskParams = {
									accountID : this.oParamsToPass.AccountID,
									accountName : this.oParamsToPass.AccountName,
									contactID : this.oParamsToPass.ContactID,
									contactName : this.oParamsToPass.ContactName,
									desc : this.oParamsToPass.title,
									note : this.oParamsToPass.Note,
									// ID not needed, GUID more than enough
									predecessorID : this.oParamsToPass.taskId,
									predecessorGUID : this.oParamsToPass.taskGuid,
									priority : this.oParamsToPass.priority,
									procType : oArgs.processType,
									ProcessTypeDescription : this.oParamsToPass.ProcessTypeDescription
								};
								oPrivateFlag = {
									curType : typeof this.oParamsToPass.privateFlag,
									curValue : this.oParamsToPass.privateFlag
								};
								this._setPrivacyForTask(oPrivateFlag, oCUS,
										oCU.TechnicalInfoUtil);
							} else if (oStartupParams) {
								if (oStartupParams.createFromOppt
										&& oStartupParams.createFromOppt[0]) {
									// Create from Opportunity
									// this.createdfromOppt = true;
									this.bIsFollowupFromOthers = true;
									oTaskParams = {
										accountID : oStartupParams.AccountId
												&& oStartupParams.AccountId[0],
										// accountName :
										// oStartupParams.AccountName
										// && oStartupParams.AccountName[0],
										contactID : oStartupParams.ContactId
												&& oStartupParams.ContactId[0],
										// contactName :
										// oStartupParams.ContactName
										// && oStartupParams.ContactName[0],
										desc : oStartupParams.title
												&& oStartupParams.title[0],
										procType : oArgs.processType
									};
									this._getPrerequisiteInfoForNewTask(
											aPrerequisitePaths, oTaskParams);
									if (oCUS.getServiceVersion() == 1
											&& oCUS.getServiceSchemaVersion() >= 2) {
										if (oCUS.getServiceSchemaVersion() >= 3) {
											oTaskParams.predecessorGUID = oStartupParams.opportunityGuid
													&& oStartupParams.opportunityGuid[0];
											oPrivateFlag = {
												curType : typeof oTaskParams.privateFlag,
												curValue : oTaskParams.privateFlag
											};
											this._setPrivacyForTask(
													oPrivateFlag, oCUS,
													oCU.TechnicalInfoUtil);
										} else
											oTaskParams.predecessorID = oStartupParams.opportunityId
													&& oStartupParams.opportunityId[0];
									}
								} else if (oStartupParams.itemPaths
										&& cus.crm.notes
										&& cus.crm.notes.handler) {
									// Create from Notes
									this.createdfromNotes = true;
									oTaskParams = {
										accountID : accountId,
										accountName : accountName,
										note : (new cus.crm.notes.handler.ModelHandler())
												.getSectionsText(oStartupParams.itemPaths),
										procType : oArgs.processType
									};
									this._getPrerequisiteInfoForNewTask(
											aPrerequisitePaths, oTaskParams);
									if (oCUS.getServiceVersion() == 1
											&& oCUS.getServiceSchemaVersion() >= 3) {
										oPrivateFlag = {
											curType : typeof oTaskParams.privateFlag,
											curValue : oTaskParams.privateFlag
										};
										this._setPrivacyForTask(oPrivateFlag,
												oCUS, oCU.TechnicalInfoUtil);
									}
								} else if (oStartupParams.createFromAppt
										&& oStartupParams.createFromAppt[0]) {
									// Create from Appointment
									// this.createdFromAppt = true;
									this.bIsFollowupFromOthers = true;
									oTaskParams = {
										accountID : oStartupParams.AccountId
												&& oStartupParams.AccountId[0],
										// accountName :
										// oStartupParams.AccountName
										// && oStartupParams.AccountName[0],
										contactID : oStartupParams.ContactId
												&& oStartupParams.ContactId[0],
										// contactName :
										// oStartupParams.ContactName
										// && oStartupParams.ContactName[0],
										desc : oStartupParams.title
												&& oStartupParams.title[0],
										procType : oArgs.processType,
										predecessorGUID : oStartupParams.appointmentGuid
												&& oStartupParams.appointmentGuid[0],
									};
									this._getPrerequisiteInfoForNewTask(
											aPrerequisitePaths, oTaskParams);
									oPrivateFlag = {
										curType : typeof oTaskParams.privateFlag,
										curValue : oTaskParams.privateFlag
									};
									this._setPrivacyForTask(oPrivateFlag, oCUS,
											oCU.TechnicalInfoUtil);
								} else if (oStartupParams.createFromAccount
										&& oStartupParams.createFromAccount[0]) {
									this.createdfromAccounts = true;
									oTaskParams = {
										accountID : oStartupParams.accountID
												&& oStartupParams.accountID[0],
										// accountName :
										// oStartupParams.AccountName
										// && oStartupParams.AccountName[0],
										procType : oArgs.processType,
									};
									this._getPrerequisiteInfoForNewTask(
											aPrerequisitePaths, oTaskParams);
									oPrivateFlag = {
										curType : typeof oTaskParams.privateFlag,
										curValue : oTaskParams.privateFlag
									};
									this._setPrivacyForTask(oPrivateFlag, oCUS,
											oCU.TechnicalInfoUtil);
								} else if (oStartupParams.fromAccount
										&& oStartupParams.fromAccount[0]) {
									// FOLLOWUP of TASK from TASKS app with
									// param fromAccount
									this.bIsFollowupFromTasks = true;
									oTaskParams = this.oParamsToPass ? {
										accountID : this.oParamsToPass.AccountID,
										accountName : this.oParamsToPass.AccountName,
										contactID : this.oParamsToPass.ContactID,
										contactName : this.oParamsToPass.ContactName,
										desc : this.oParamsToPass.title,
										note : this.oParamsToPass.Note,
										// ID not needed, GUID sufficient
										predecessorID : this.oParamsToPass.taskId,
										predecessorGUID : this.oParamsToPass.taskGuid,
										priority : this.oParamsToPass.priority,
										procType : oArgs.processType,
										ProcessTypeDescription : this.oParamsToPass.ProcessTypeDescription
									}
											: {
												accountID : accountId,
												accountName : accountName,
												procType : oArgs.processType,
												ProcessTypeDescription : processTypeDescr,
												note : note
											};
									this._getPrerequisiteInfoForNewTask(
											aPrerequisitePaths, oTaskParams);
									oPrivateFlag = this.oParamsToPass ? {
										curType : typeof this.oParamsToPass.privateFlag,
										curValue : this.oParamsToPass.privateFlag
									}
											: {
												curType : typeof oTaskParams.privateFlag,
												curValue : oTaskParams.privateFlag
											};
									this._setPrivacyForTask(oPrivateFlag, oCUS,
											oCU.TechnicalInfoUtil);
								} else {
									// Create from Account
									oTaskParams = {
										accountID : oStartupParams.accountID
												&& oStartupParams.accountID[0],
										accountName : oArgs.accountName,
										procType : oArgs.processType,
										note : note
									};
								}
							} else {
								// NEW TASK from TASKS app
								var s2Controller = this._getApplicationModel()
										.getProperty("/s2Controller"), processTypeDescr = s2Controller
										&& s2Controller.processTypeDesc, processTypePrio = s2Controller
										&& s2Controller.processTypePrio;
								oTaskParams = {
									accountID : accountId,
									accountName : accountName,
									procType : oArgs.processType,
									ProcessTypeDescription : processTypeDescr,
									priority : processTypePrio,
									note : note
								};
								this._getPrerequisiteInfoForNewTask(
										aPrerequisitePaths, oTaskParams);
							}
							this.oNewTask = oCUU.createEmptyTaskObject(oCUS,
									oTaskParams);
							this.prepareNewTask(this.oNewTask);
							this.initializeDetailsPage(this.oNewTask);
							break;
						}
						oCUU.releaseBusyDialog();
					},

					_onEnterPressed : function(oEvent) {
						var oView = this.getView();
						if (oEvent.srcControl == oView.byId("accountInput"))
							this._onEnterPressedForAccount();
						else if (oEvent.srcControl == oView
								.byId("contactInput"))
							this._onEnterPressedForContact();
						else if (oEvent.srcControl == oView
								.byId("dueDateInput"))
							this._onEnterPressedForDueDate();
						else
							this._onEnterPressedForEmployee();
					},

					_setFullScreenTitle : function(oTask) {
						var title = cus.crm.mytasks.util.Formatter
								.showTaskTitle(oTask.Description, oTask.Id);
						this._oControlStore.oTitle.setText(title);
					},

					// TODO: Not yet covered!!
					onLifeChange : function(e) {
						var textarea = jQuery(e.getSource().$()).children(
								"textarea")[0];
						this.autoResize(textarea);
					},

					autoResize : function(textarea) {
						textarea.style.overflow = "auto";
						textarea.style.height = "100%";
						textarea.style.height = textarea.scrollHeight + 'px';
						textarea.style.overflow = "hidden";
					},
					// TODO: Not yet covered!!

					// START of operations on a TASK
					initializeDetailsPage : function(oTask) {
						var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oView = this
								.getView(), oCUA = oCU.AccountF4, oCUC = oCU.ContactF4;
						oCUU.logObjectToConsole("task: ", oTask);
						this._initHFOptions(oView.getBindingContext());
						this._setFullScreenTitle(oTask);
						oCUA.setId(oTask.AccountId).setName(
								oTask.AccountName ? oTask.AccountName
										: oTask.AccountId);
						oCUC.setId(oTask.ContactId).setName(
								oTask.ContactName ? oTask.ContactName
										: oTask.ContactId);
						if (this._getApplicationModel().getProperty(
								"/s4Controller")) {
							oView.byId("accountInput").setValue(oCUA.getName());
							oView.byId("contactInput").setValue(oCUC.getName());
						}
						// oCUE.setId(oTask.ResponsibleId).setName(oTask.ResponsibleName);
						// By default, style is medium, changing to long;
						var oDIF = oView.byId("dueDateInput");
						if (!oDIF._dateType)
							oDIF._dateType = new sap.ca.ui.model.type.Date({
								style : "long",
								UTC : false
							});
						// oDIF.fireChange(oTask.DueDate);
						// WAVE 6 ENHANCEMENT
						this.setBtnEnabled("assignTask", !oView.byId(
								"privateSwitch").getState());
						this._showOrHideStatusField([ "statSelect",
								"laStatSelect", "hboxStatus", ], oTask);
						this._showOrHideTransactionType([ "laTypeInput",
								"TxtTypeInput", "TxtTypeHBox" ]);
						// WAVE 7 ENHANCEMENT
						oCU.Attachments.EditPage.showOrHidePanel(oView);
					},

					_checkIfNewTask : function(oTask) {
						var idIsEmpty = (oTask.Id === "");
						cus.crm.mytasks.util.Util.logObjectToConsole(
								"task idIsEmpty=" + idIsEmpty + "; ", oTask);
						return idIsEmpty;
					},

					getTask : function() {
						var oCU = cus.crm.mytasks.util, oCUF = oCU.Formatter, oCUU = oCU.Util, oView = this
								.getView(), oCUS = oCU.Schema, oContext = oView
								.getBindingContext(), dSavedDate = undefined, oTask = null;
						if (oContext == "/new")
							oTask = jQuery.extend(this.oNewTask, {});
						else
							oTask = jQuery.extend(oContext.getObject(), {});
						oCUU.logObjectToConsole("oTask: ", oTask);
						dSavedDate = oTask.DueDate;

						oTask.Description = oView.byId("descInput").getValue();
						oTask.DueDate = oView.byId("dueDateInput").getValue();
						oTask.Priority = oView.byId("prioSelect")
								.getSelectedKey();
						oTask.Private = oView.byId("privateSwitch").getState();
						oTask.Note = oView.byId("noteTa").getValue();
						var oAccInfo = this.getCurrentAccount(), oConInfo = this
								.getCurrentContact();
						oTask.AccountId = oAccInfo.AccountId;
						oTask.AccountName = oAccInfo.AccountName;
						oTask.ContactId = oConInfo.ContactId;
						oTask.ContactName = oConInfo.ContactName;
						if (oCUS.getServiceVersion() == 1) {
							if (oCUS.getServiceSchemaVersion() >= 3)
								oTask.UserStatusCode = oView.byId("statSelect")
										.getSelectedKey();
							if (oCUS.getServiceSchemaVersion() >= 4
									&& oContext.getPath() !== "/new") {
								var aNavLinks = [ oCU.Attachments.NAVLINK,
										oCU.DocumentHistory.NAVLINK,
										"TaskLogSet", "TaskStatuses" ];
								for ( var i = 0, j = aNavLinks.length; i < j; i++)
									oTask[aNavLinks[i]] = oCUU
											.getDeferredObject(oContext
													.getPath().substr(1),
													aNavLinks[i]);
							}
						}

						// Needed because we use getValue() and not
						// getDateValue()
						if (typeof oTask.DueDate === "string"
								&& oTask.DueDate !== "") {
							var oTempDate = oCUF.parseLongDate(oTask.DueDate);
							oTask.DueDate = oTempDate ? oTempDate : dSavedDate;
						}

						if (oCUF.getDiffInDays(dSavedDate, oTask.DueDate) == 0)
							oTask.DueDate = dSavedDate;
						else if (oTask.DueDate === "")
							oTask.DueDate = null;

						/**
						 * @ControllerHook Provision for getting the additional
						 *                 fields to add to the Task object.
						 *                 Additional fields added to the Task
						 *                 Entity Type are got by this Hook
						 *                 method. This is called when the Task
						 *                 object is needed. The hook must be
						 *                 documented like:
						 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookGetCustomFields
						 * @param {object}
						 *            oTask
						 * @return {void}
						 */
						if (this.extHookGetCustomFields)
							this.extHookGetCustomFields(oTask);
						return oTask;
					},

					saveTask : function(oEvent) {
						var oSaveButton = oEvent.getSource(), oTaskToSave = this
								.getTask(), fnSuccess = function(oCO, oData,
								oResponse, aErrorResponses) {
							var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oRB = oCU.Formatter
									.getResourceBundle();
							oCO.curBtn.setEnabled(true);
							if (aErrorResponses && aErrorResponses.length > 0)
								this._checkFor412StatusCode(aErrorResponses[0],
										"Operation failed: Update Task");
							else {
								oCUU.logObjectToConsole(
										"Operation successful: Update Task",
										oCO.curTask);
								var sKey = oCO.isFollowupActivity ? "FOLLOWUP_TASK_SAVED"
										: "CURRENT_TASK_SAVED";
								var bINT = this._checkIfNewTask(oCO.curTask), oCurrentTask = !bINT ? oCO.curTask
										: oData.__batchResponses[0].__changeResponses[0].data;
								sap.m.MessageToast.show(oRB.getText(sKey), {
									closeOnBrowserNavigation : false
								});
								this._showOverviewOrGoBack(this.getView(), {
									bINT : bINT,
									curTask : oCurrentTask,
									scenario : "CLICKEDSAVE"
								});
								oCUU.releaseBusyDialog();
							}
						}, fnError = function(oBtn, oError) {
							cus.crm.mytasks.util.Util.onRequestFailed(oError,
									"Operation failed: Update Task");
							oBtn.setEnabled(true);
						}, oCurObject = {
							curTask : oTaskToSave,
							curBtn : oSaveButton,
							isFollowupActivity : this.bIsFollowupFromOthers
									|| this.bIsFollowupFromTasks ? true : false
						}, oUpdateParams = {
							success : fnSuccess,
							error : fnError,
							async : true
						};
						this._commonWayToSaveTask(oCurObject, oUpdateParams);
					},

					checkUIValues : function(oTask) {
						var oReturn = {}, oCUF = cus.crm.mytasks.util.Formatter;
						oReturn.hasErrors = false;
						oReturn.messages = new Array();

						var sDateFromUI = this.getView().byId("dueDateInput")
								.getValue(), oDateFromUI = oCUF
								.parseLongDate(sDateFromUI);
						if (!oDateFromUI && sDateFromUI !== "") {
							var messageDate = oCUF.getResourceBundle().getText(
									"DETAILS_MESSAGETEXT_DATE");
							oReturn.messages.push(messageDate);
							oReturn.hasErrors = true;
						}

						var currentAccount = this.getCurrentAccount().AccountName, accountOnUI = this
								.getView().byId("accountInput").getValue();
						if (currentAccount != accountOnUI) {
							var messageAccount = oCUF.getResourceBundle()
									.getText("DETAILS_MESSAGETEXT_ACCOUNT");
							oReturn.messages.push(messageAccount);
							oReturn.hasErrors = true;
						}

						var currentContact = this.getCurrentContact().ContactName, contactOnUI = this
								.getView().byId("contactInput").getValue();
						if (currentContact != contactOnUI) {
							var messageContact = oCUF.getResourceBundle()
									.getText("DETAILS_MESSAGETEXT_CONTACT");
							oReturn.messages.push(messageContact);
							oReturn.hasErrors = true;
						}

						/**
						 * @ControllerHook Provision for checking the values of
						 *                 the additional fields of the Task
						 *                 object. Formatting of the various
						 *                 fields added by the customer can be
						 *                 done here. This is called when
						 *                 checking the UI values of the Task
						 *                 object.
						 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookCheckUIValues
						 * @param {object}
						 *            oReturn
						 * @return {void}
						 */
						if (this.extHookCheckUIValues)
							this.extHookCheckUIValues(oReturn);
						return oReturn;
					},

					cancelTask : function(evt) {
						var oCUU = cus.crm.mytasks.util.Util, oView = this
								.getView();
						oCUU.requestBusyDialog();
						if (this.oSavedTask) {
							oView.byId("descInput").setValue(
									this.oSavedTask.Description);
							this.setFormattedDueDate(this.oSavedTask.DueDate);
							oView.byId("prioSelect").setSelectedKey(
									this.oSavedTask.Priority);
							oView.byId("privateSwitch").setState(
									this.oSavedTask.Private);
							oView.byId("accountInput").setValue(
									this.oSavedTask.AccountName);
							oView.byId("contactInput").setValue(
									this.oSavedTask.ContactName);
							oView.byId("noteTa").setValue(this.oSavedTask.Note);

							/**
							 * @ControllerHook Provision for negating the
							 *                 changes made to the additional
							 *                 fields of the Task object. Revert
							 *                 to the previous values in the
							 *                 custom fields when the Task is
							 *                 not meant to be saved. This is
							 *                 called when canceling changes
							 *                 made to an existing task.
							 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookCancelCustomFields
							 * @param {object}
							 *            oCancelTask
							 * @return {void}
							 */
							if (this.extHookCancelCustomFields)
								this.extHookCancelCustomFields(this.oSavedTask);
						}

						oCUU.logObjectToConsole("old task: ", this.oSavedTask);
						// WAVE 7 ENHANCEMENT
						this._showOverviewOrGoBack(oView, {
							bINT : this.oSavedTask ? false : true,
							curTask : this.oSavedTask || this.oNewTask,
							scenario : "CLICKEDCANCEL"
						});
						this.oSavedTask = this.oNewTask = undefined;
						oCUU.releaseBusyDialog();
					},

					prepareNewTask : function(oNewTask) {
						var oView = this.getView(), oCUS = cus.crm.mytasks.util.Schema;
						oView.byId("descInput").setValue(oNewTask.Description);
						this.setFormattedDueDate(oNewTask.DueDate);
						oView.byId("prioSelect").setSelectedKey(
								oNewTask.Priority);
						oView.byId("privateSwitch").setState(oNewTask.Private);
						oView.byId("accountInput").setValue(
								oNewTask.AccountName ? oNewTask.AccountName
										: oNewTask.AccountId);
						oView.byId("contactInput").setValue(
								oNewTask.ContactName ? oNewTask.ContactName
										: oNewTask.ContactId);
						oView.byId("noteTa").setValue(oNewTask.Note);
						if (oCUS.getServiceVersion() == 1
								&& oCUS.getServiceSchemaVersion() >= 3) {
							oView.byId("statSelect").setSelectedKey(
									oNewTask.UserStatusCode);
							oView.byId("TxtTypeInput").setText(
									oNewTask.ProcessTypeDescription);
						}

						/**
						 * @ControllerHook Provision for managing the additional
						 *                 fields to add to the Task object.
						 *                 Filter types can be provided by the
						 *                 customer and tasks can be filtered by
						 *                 these new types when the end user
						 *                 selects one of these new types. This
						 *                 is called when the Facet Filter
						 *                 button on the Footer bar is selected.
						 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookPrepareCustomFields
						 * @param {object}
						 *            oNewTask
						 * @return {void}
						 */
						if (this.extHookPrepareCustomFields)
							this.extHookPrepareCustomFields(oNewTask);
					},
					// END of operations on a TASK

					// START of methods modifying CONTACT details
					_onEnterPressedForContact : function() {
						var input = this.getView().byId("contactInput");
						this.onF4Contact({
							getSource : function() {
								return input;
							}
						});
					},

					onF4Contact : function(oEvent) {
						// To manage both Actual event & sapenter event
						var oInput = oEvent.getSource(), oAccInfo = this
								.getCurrentAccount(), oCUC = cus.crm.mytasks.util.ContactF4;
						oCUC.getValueHelp().open(oInput.getValue());
						oCUC.triggerSearch({
							accountid : oAccInfo.AccountId,
							accounttext : oAccInfo.AccountName,
							contactid : this.getCurrentContact().ContactId,
							searchvalue : oInput.getValue()
						});
					},

					getCurrentContact : function() {
						var oView = this.getView(), sConVH = oView.byId(
								"contactInput").getValue(), activeTask = oView
								.getBindingContext().getObject() ? oView
								.getBindingContext().getObject()
								: this.oNewTask, oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCUC = oCU.ContactF4;
						oCUU.logObjectToConsole("active task: ", activeTask);

						if (sConVH === "")
							oCUC.setId("").setName("");
						else if (this.__onlyOneContactSuggested) {
							var oSuggestedContact = jQuery.extend({},
									this.__onlyOneContactSuggested, true);
							// Check if toLocaleLowerCase is to be used or not
							if ((oSuggestedContact[oCUC.getFilterString()] || oSuggestedContact.contactID)
									.toLowerCase() === sConVH.toLowerCase()) {
								oCUC.setId(oSuggestedContact.contactID)
										.setName(
												oSuggestedContact[oCUC
														.getFilterString()]);
								if (oCUC.getName() === "")
									oCUC.setName(oSuggestedContact.contactID);
								oView.byId("contactInput").setValue(
										oCUC.getName());
								oCUC._setAccountIfNotSetAlready(this,
										oSuggestedContact);
							}
							this.__onlyOneContactSuggested = undefined;
						}
						return {
							ContactId : oCUC.getId(),
							ContactName : oCUC.getName()
						};
					},

					openBusinessCardContact : function(oData, oResponse) {
						var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCUF = oCU.Formatter;
						var oConDetails = {};
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
						var oConLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
								oConDetails), oOpenBy = this.getView().byId(
								"showContact");
						oConLaunch.openBy(oOpenBy);
						oCUU.releaseBusyDialog();
					},
					// END of methods modifying CONTACT details

					// START of methods modifying ACCOUNT details
					_onEnterPressedForAccount : function() {
						var input = this.getView().byId("accountInput");
						this.onF4Account({
							getSource : function() {
								return input;
							}
						});
					},

					onF4Account : function(oEvent) {
						// To manage both Actual event & sapenter event
						var oInput = oEvent.getSource(), oCU = cus.crm.mytasks.util, oCUA = oCU.AccountF4;
						// Method Chaining allowed; see control API reference
						oCUA.getValueHelp().open(oInput.getValue());
						oCUA.triggerSearch(oInput.getValue());
					},

					getCurrentAccount : function() {
						var oView = this.getView(), activeTask = oView
								.getBindingContext().getObject() ? oView
								.getBindingContext().getObject()
								: this.oNewTask, sInputField = oView.byId(
								"accountInput").getValue(), oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCUA = oCU.AccountF4;
						oCUU.logObjectToConsole("active task: ", activeTask);

						if (sInputField === "")
							oCUA.setId("").setName("");
						else if (this.__onlyOneAccountSuggested) {
							var oSuggestedAccount = {
								id : this.__onlyOneAccountSuggested.accountID,
								name : this.__onlyOneAccountSuggested[oCUA
										.getFilterString()]
										|| this.__onlyOneAccountSuggested.accountID
							};
							// Check if toLocaleLowerCase is to be used or not
							if (oSuggestedAccount.name.toLowerCase() === sInputField
									.toLowerCase()) {
								oCUA.setId(oSuggestedAccount.id).setName(
										oSuggestedAccount.name);
								oView.byId("accountInput").setValue(
										oCUA.getName());
							}
							this.__onlyOneAccountSuggested = undefined;
						}
						return {
							AccountId : oCUA.getId(),
							AccountName : oCUA.getName()
						};
					},

					openBusinessCardCompany : function(oData, oResponse) {
						var oCU = cus.crm.mytasks.util, oView = this.getView(), sAccSchema = oCU.AccountF4
								.getFilterString(), oCUU = oCU.Util, oCUF = oCU.Formatter;
						oCUU.logObjectToConsole(
								"open Business card with this data: ", oData);
						var oAccDetails = {};
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
						var oAccLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
								oAccDetails), oOpenBy = oView
								.byId("showAccount");
						oAccLaunch.openBy(oOpenBy);
						oCUU.releaseBusyDialog();
					},
					// END of methods modifying ACCOUNT details

					// START of methods modifying EMPLOYEE details
					_onEnterPressedForEmployee : function() {
						var input = this._oDlAssignTask.getContent()[1];
						this.onF4Employee({
							getSource : function() {
								return input;
							}
						});
					},

					onF4Employee : function(oEvent) {
						// To manage both Actual event & sapenter event
						var oInput = oEvent.getSource(), oCUE = cus.crm.mytasks.util.EmployeeF4;
						oCUE.getValueHelp().open(oInput.getValue());
						oCUE.triggerSearch(oInput.getValue());
					},

					_confirmEmployeeFromValueHelp : function(oEvent) {
						var oEmpDL = this._oDlAssignTask, sEmpValue = oEmpDL
								.getContent()[1].getValue(), oCU = cus.crm.mytasks.util, oRB = oCU.Formatter
								.getResourceBundle(), oCUE = oCU.EmployeeF4;
						if (sEmpValue !== "")
							if (sEmpValue === oCUE.getName()) {
								oEmpDL.close();
								this.assignTaskToEmployee();
							} else
								sap.ca.ui.message.showMessageToast(oRB
										.getText("DETAILS_VALIDATION_TITLE"));
						else
							sap.ca.ui.message.showMessageToast(oRB
									.getText("DETAILS_VALIDATION_TITLE"));
						// var bIsEmployeeAssignable = this.isEmployeeChosen();
						// if (bIsEmployeeAssignable) {
						// this._oDlAssignTask.close();
						// this.assignTaskToEmployee();
						// } else
						// this.onF4Employee(this._oDlAssignTask.getContent()[1]);
					},

					selectAssignTask : function(oEvent) {
						// make sure that EmployeeName is known for forward by
						// text
						var oCU = cus.crm.mytasks.util, oCUT = oCU.TechnicalInfoUtil, oCUF = oCU.Formatter, oRB = oCUF
								.getResourceBundle();
						oCUT.read(this.getView());
						if (!this._oDlAssignTask) {
							this._oDlAssignTask = new sap.m.Dialog(
									{
										title : oRB
												.getText("DETAILS_ASSIGNTO_TITLE"),
										content : [
												new sap.m.Label(
														{
															text : oRB
																	.getText("DETAILS_ASSIGNTO_TEXT")
														}),
												new sap.m.Input(
														{
															showValueHelp : true,
															valueHelpRequest : jQuery
																	.proxy(
																			function(
																					oEvent) {
																				this
																						.onF4Employee(oEvent);
																			},
																			this)
														}) ],
										beginButton : new sap.m.Button(
												{
													text : oRB
															.getText("DIALOG_ASSIGNTO_BUTTON_OK"),
													press : jQuery
															.proxy(
																	this._confirmEmployeeFromValueHelp,
																	this)
												}),
										endButton : new sap.m.Button(
												{
													text : oRB
															.getText("DIALOG_ASSIGNTO_BUTTON_CANCEL"),
													press : jQuery
															.proxy(
																	function(
																			oEvent) {
																		this._oDlAssignTask
																				.getContent()[1]
																				.setValue("");
																		this._oDlAssignTask
																				.close();
																	}, this)
												})
									});
							this._oDlAssignTask.getContent()[1]
									.addEventDelegate({
										onsapenter : this._onEnterPressed
									}, this);
							this._oDlAssignTask
									.addStyleClass("sapUiPopupWithPadding");
						}
						this._oDlAssignTask.open();
					},

					assignTaskToEmployee : function() {
						var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCUE = oCU.EmployeeF4, oTaskToAssign = this
								.getTask(), oCUF = oCU.Formatter, oCUT = oCU.TechnicalInfoUtil, sFromEmployee = oCUT
								.getEmployeeName(), oDF = sap.ca.ui.model.format.DateFormat
								.getDateInstance({
									style : "medium"
								}), sForwardedDate = oDF.format(new Date());
						oCUU.requestBusyDialog();
						oTaskToAssign.ResponsibleId = oCUE.getId();
						// oTaskToAssign.ResponsibleName = oCUE.getName();
						var sNoteToPrefix = oCUF.getResourceBundle().getText(
								"DETAILS_ASSIGNTO_FORWARDED_BY_WITH_DATE",
								[ sFromEmployee, sForwardedDate ]), bIsNewTask = this
								._checkIfNewTask(oTaskToAssign), sPreviousNote = oTaskToAssign.Note;
						if (oTaskToAssign.Note !== "")
							oTaskToAssign.Note = [ oTaskToAssign.Note,
									sNoteToPrefix ].join("\n");
						else
							oTaskToAssign.Note = sNoteToPrefix;
						oCUU.logObjectToConsole("task to assign: ",
								oTaskToAssign);
						var fnSuccess = function(oCO, oData, oResponses,
								aErrorResponses) {
							var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oRB = oCU.Formatter
									.getResourceBundle(), oCUE = oCU.EmployeeF4;
							// When leaving assign employee dialog, reset
							// the input value
							this._oDlAssignTask.getContent()[1].setValue("");
							if (aErrorResponses && aErrorResponses.length > 0)
								this._checkFor412StatusCode(aErrorResponses[0],
										"Operation failed: Assign Task");
							else {
								oCUU.logObjectToConsole(
										"Operation successful: Assign Task",
										oCO.curTask);
								var sMsg = [ "'", "'" ].join(oCUE.getName()), message = oRB
										.getText(
												"DETAILS_ASSIGNTO_CONFIRMATION",
												[ sMsg ]);
								sap.m.MessageToast.show(message, {
									closeOnBrowserNavigation : false
								});
								var bINT = this._checkIfNewTask(oCO.curTask), oCurrentTask = !bINT ? oCO.curTask
										: oData.__batchResponses[0].__changeResponses[0].data;
								this._showOverviewOrGoBack(this.getView(), {
									bINT : bINT,
									curTask : oCurrentTask,
									scenario : "CLICKEDASSIGNTO"
								});
								oCUU.releaseBusyDialog();
							}
						}, fnError = function(oCO, oError) {
							var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCustomizingModel = oCUU
									.getCustomizingModel();
							oCUU.onRequestFailed(oError,
									"Operation failed: Assign Task");
							oCO.curTask.Note = oCO.prevNote;
							oCO.curTask.ResponsibleId = oCustomizingModel
									.getProperty("/techInfo/ResponsibleId");
							oCO.curTask.ResponsibleName = oCustomizingModel
									.getProperty("/techInfo/ResponsibleName");
						}, oCurObject = {
							curTask : oTaskToAssign,
							prevNote : sPreviousNote
						};
						oCUU.saveTaskAndUpdateTaskList(bIsNewTask,
								oCurObject.curTask, this.getView(), jQuery
										.proxy(fnSuccess, this, oCurObject),
								jQuery.proxy(fnError, this, oCurObject), true);
					},
					// END of methods modifying EMPLOYEE details

					// START of methods modifying DUEDATE of TASK
					_onEnterPressedForDueDate : function() {
						// var dueDateField =
						// this.getView().byId("dueDateInput");
						// oDateString = dueDateField.getValue();
						this.enterDueDatePressed = true;
					},

					formatDateManually : function(oEvent) {
						var oDate = undefined, dueDateField = this.getView()
								.byId("dueDateInput");
						oDate = dueDateField._validateDate(oEvent
								.getParameter("newValue"));
						if (oDate)
							this.setFormattedDueDate(oDate);
						else
						// dueDateField._calendarIconPress();
						if (this.enterDueDatePressed)
							this.enterDueDatePressed = false;
					},

					setFormattedDueDate : function(oDate) {
						var sFormattedDate = cus.crm.mytasks.util.Formatter
								.formatDate(oDate);
						this.getView().byId("dueDateInput").setDateValue(oDate)
								.setValue(sFormattedDate);// .setDateValue(oDate.toString());
					},
					// END of methods modifying DUEDATE of TASK

					// START of methods showing BUSINESS CARDS
					// a. ACCOUNT details
					onShowAccount : function(oEvent) {
						var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oAccountInfo = this
								.getCurrentAccount(), oBundle = oCU.Formatter
								.getResourceBundle(), sInputField = this
								.getView().byId("accountInput").getValue();
						if (oAccountInfo.AccountName !== sInputField) {
							sap.ca.ui.message.showMessageBox({
								type : sap.ca.ui.message.Type.WARNING,
								message : oBundle
										.getText("DETAILS_VALIDATION_TITLE"),
								details : oBundle
										.getText("DETAILS_MESSAGETEXT_ACCOUNT")
							});
						} else if (oAccountInfo.AccountId !== "") {
							oCUU.requestBusyDialog();
							var sPath = "/AccountCollection('"
									+ oAccountInfo.AccountId + "')", oParams = {
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
							}, oModel = this.getView().getModel();
							/**
							 * @ControllerHook Provision for getting the Account
							 *                 Photo of the Task object. An
							 *                 Overview of the account details
							 *                 are shown via a pop-over
							 *                 including the photo if enabled.
							 *                 This is called when the user
							 *                 clicks on the help icon beside
							 *                 the account field of the task
							 *                 object. The hook must be
							 *                 documented like:
							 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookGetS3AccountPhoto
							 * @return {boolean}
							 */
							oParams["$expand"] = this.extHookGetS3AccountPhoto ? this
									.extHookGetS3AccountPhoto() ? [
									"MainAddress", "MainContact/WorkAddress",
									"Logo" ].join(",") : [ "MainAddress",
									"MainContact/WorkAddress" ].join(",")
									: [ "MainAddress",
											"MainContact/WorkAddress", "Logo" ]
											.join(",");
							jQuery.sap.log.debug("oData request to be fired:"
									+ sPath);
							oModel.read(sPath, null, oParams, true, jQuery
									.proxy(fnSuccess, this), jQuery.proxy(
									fnError, this));
						}
					},

					// b. CONTACT details
					onShowContact : function(oEvent) {
						var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oBundle = oCU.Formatter
								.getResourceBundle(), oContactInfo = this
								.getCurrentContact(), oAccountInfo = this
								.getCurrentAccount(), sInputField = this
								.getView().byId("contactInput").getValue();
						if (oContactInfo.ContactName !== sInputField) {
							sap.ca.ui.message.showMessageBox({
								type : sap.ca.ui.message.Type.WARNING,
								message : oBundle
										.getText("DETAILS_VALIDATION_TITLE"),
								details : oBundle
										.getText("DETAILS_MESSAGETEXT_CONTACT")
							});
						} else if (oContactInfo.ContactId !== "") {
							oCUU.requestBusyDialog();
							var sPath = "/ContactCollection(contactID='"
									+ oContactInfo.ContactId + "',accountID='"
									+ oAccountInfo.AccountId + "')", oParams = {
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
									this.openBusinessCardContact(oData,
											oResponse);
								else {
									sap.m.MessageToast
											.show(oCU.Formatter
													.getResourceBundle()
													.getText(
															"S3_ACCOUNT_CONTACT_NOREL"));
									oCU.Util.releaseBusyDialog();
								}
							}, oModel = this.getView().getModel();
							/**
							 * @ControllerHook Provision for getting the Contact
							 *                 Photo of the Task object. Contact
							 *                 details are shown via a pop-over &
							 *                 additionally the photo of the
							 *                 contact. This is called when the
							 *                 user clicks on the help icon
							 *                 beside the contact field of the
							 *                 task object. The hook must be
							 *                 documented like:
							 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookGetS3ContactPhoto
							 * @return {boolean}
							 */
							oParams["$expand"] = this.extHookGetS3ContactPhoto ? this
									.extHookGetS3ContactPhoto() ? [
									"WorkAddress", "Photo" ].join(",")
									: "WorkAddress"
									: [ "WorkAddress", "Photo" ].join(",");
							jQuery.sap.log.debug("oData request to be fired:"
									+ sPath);
							oModel.read(sPath, null, oParams, true, jQuery
									.proxy(fnSuccess, this), jQuery.proxy(
									fnError, this));
						}
					},
					// END of methods showing BUSINESS CARDS

					/*
					 * FIORI WAVE 2 - Branch : Rel - 1.0 END of INITAL
					 * DEVELOPMENT for MyTasks
					 */

					/*
					 * FIORI WAVE 4 - Branch : Rel - 1.2 START of ENHANCEMENTS
					 * for MyTasks
					 */

					/*
					 * @ControllerHook Provision for getting the additional
					 * fields to add to the Task object. Additional fields added
					 * to the Task Entity Type are got by this Hook method. This
					 * is called when the Task object is needed. The hook must
					 * be documented like: @callback
					 * sap.ca.scfld.md.controller.BaseFullscreenController~extHookGetCustomFields
					 * @param {object} oTask @return {void}
					 */
					// extHookGetCustomFields:function(oTask) {
					//		
					// },
					/*
					 * @ControllerHook Provision for checking the values of the
					 * additional fields of the Task object. Formatting of the
					 * various fields added by the customer can be done here.
					 * This is called when the checking the UI values of the
					 * Task object. The hook must be documented like: @callback
					 * sap.ca.scfld.md.controller.BaseFullscreenController~extHookCheckUIValues
					 * @param {object} oReturn @return {void}
					 */
					// extHookCheckUIValues : function(oReturn) {
					//
					// },
					/*
					 * @ControllerHook Provision for negating the changes made
					 * to the additional fields of the Task object. Revert to
					 * the old values of the custom fields when the Task is not
					 * meant to be saved. This is called when the canceling
					 * changes made to the Task object. The hook must be
					 * documented like: @callback
					 * sap.ca.scfld.md.controller.BaseFullscreenController~extHookCancelCustomFields
					 * @param {object} oCancelTask @return {void}
					 */
					// extHookCancelCustomFields : function(oCancelTask) {
					//
					// },
					/*
					 * @ControllerHook Provision for mangaing the additional
					 * fields to add to the Task object. filter types can be
					 * provided by customer and Tasks can be filtered on these
					 * new types when the end user selects one of these new
					 * types. This is called when the Facet Filter button on the
					 * Footer bar is selected. The hook must be documented like:
					 * @callback
					 * sap.ca.scfld.md.controller.BaseFullscreenController~extHookPrepareCustomFields
					 * @param {object} oNewTask @return {void}
					 */
					// extHookPrepareCustomFields:function(oNewTask) {
					//		
					// },
					/*
					 * FIORI WAVE 4 - Branch : Rel - 1.2 END of ENHANCEMENTS for
					 * MyTasks
					 */
					/*
					 * FIORI WAVE 5 - Branch : Rel - 1.3 START of ENHANCEMENTS
					 * for MyTasks
					 */
					_navToOriginatingApp : function(oAdditionalParams) {
						if (oAdditionalParams) {
							var oCP = {
								contextPath : oAdditionalParams.sPath
							};
							switch (oAdditionalParams.sScenario) {
							case "CLICKEDASSIGNTO":
								if (this.bIsBookmarkUsed)
									// Bookmark should also nav back to previous
									// screen
									this.bIsBookmarkUsed = false;
								if (this.createdfromAccounts)
									this.createdfromAccounts = false;
								this._navBack();
								break;
							case "CLICKEDSAVE":
								if (this.bIsBookmarkUsed) {
									// Bookmark should also nav back to previous
									// screen
									this.bIsBookmarkUsed = false;
									this._navBack();
								} else if (this.createdfromAccounts) {
									this.createdfromAccounts = false;
									this._navBack();
								} else
									this.oRouter.navTo("taskOverview", oCP,
											true);
								break;
							case "CLICKEDCANCEL":
							default:
								if (oAdditionalParams.bIsNewTask) {
									if (this.createdfromNotes) {
										this.createdfromNotes = false;
										this._navBack();
									} else if (this.bIsFollowupFromTasks) {
										// WAVE 6 ENHANCEMENT
										if (this.bIsBookmarkUsed)
											this.bIsBookmarkUsed = false;
										this.bIsFollowupFromTasks = false;
										this.oParamsToPass = undefined;
										this._navBack();
									} else {
										// Bookmark should also nav back to
										// previous screen
										if (this.bIsBookmarkUsed)
											this.bIsBookmarkUsed = false;
										// WAVE 6 ENHANCEMENT
										if (this.bIsFollowupFromOthers)
											this.bIsFollowupFromOthers = false;
										this._navBack();
									}
								} else {
									if (this.bIsBookmarkUsed) {
										this.bIsBookmarkUsed = false;
										this._navBack();
									} else
										this.oRouter.navTo("taskOverview", oCP,
												true);
								}
								break;
							}
						}
					},
					/*
					 * FIORI WAVE 5 - Branch : Rel - 1.3 END of ENHANCEMENTS for
					 * MyTasks
					 */
					/*
					 * FIORI WAVE 6 - Branch : Rel - 1.4 START of ENHANCEMENTS
					 * for MyTasks
					 */
					_initHFOptions : function(oContext) {
						var oCancelOption = {
							sId : "cancelTask",
							sI18nBtnTxt : "DETAILS_BUTTONS_CANCEL",
							onBtnPressed : jQuery.proxy(this.cancelTask, this),
						}, oAssignOption = {
							sId : "assignTask",
							sI18nBtnTxt : "DETAILS_BUTTONS_ASSIGNTO",
							onBtnPressed : jQuery.proxy(this.selectAssignTask,
									this),
						};
						var oOptions = {
							// unfortunately the default action button, has
							// to be provided as 'oEditBtn', although its
							// the save in our case ...
							oEditBtn : {
								sId : "saveTask",
								sI18nBtnTxt : "DETAILS_BUTTONS_SAVE",
								onBtnPressed : jQuery
										.proxy(this.saveTask, this),
							},
							buttonList : [ oCancelOption, oAssignOption ],
							bSuppressBookmarkButton : true,
							sI18NFullscreenTitle : "NEW_TASK_PAGE_TITLE",
							onBack : jQuery.proxy(this.navBackEditOrCreate,
									this),
						}, oCUS = cus.crm.mytasks.util.Schema;
						// WAVE 6 ENHANCEMENT; check does not work for book
						// mark scenario if schema versions are not
						// initialized
						if (!oCUS.getServiceVersion())
							oCUS.initServiceSchemaVersion(this.getView()
									.getModel(), "Task");
						var sContext = oContext.getPath().search("Tasks") !== -1 ? "detail"
								: "new";
						/**
						 * @ControllerHook Provision for customizing the header
						 *                 footer options of the page when
						 *                 editing TASKS. In both the CREATE and
						 *                 EDIT scenarions, it can be used to
						 *                 display or hide various pushbuttons,
						 *                 and to create new pushbuttons. This
						 *                 is called when the user is creating a
						 *                 new Task or modifying an existing
						 *                 Task. Context is passed to see which
						 *                 pushbuttons can appear during both
						 *                 the CREATE and EDIT scenarios
						 * 
						 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookCustomizeS3HFOptions
						 * @param {object}
						 *            oOptions
						 * @param {string}
						 *            sContext
						 * @return {void}
						 */
						if (this.extHookCustomizeS3HFOptions)
							this
									.extHookCustomizeS3HFOptions(oOptions,
											sContext);
						this.setHeaderFooterOptions(oOptions);
					},

					_getApplicationModel : function() {
						var oAMcontrollers = this.oApplicationFacade
								.getApplicationModel("controllers");
						if (!oAMcontrollers) {
							var jModel = new sap.ui.model.json.JSONModel({
								s2Controller : undefined,
								s3Controller : this,
								// WAVE 7 ENHANCEMENT
								s4Controller : undefined,
							});
							this.oApplicationFacade.setApplicationModel(
									"controllers", jModel);
							oAMcontrollers = this.oApplicationFacade
									.getApplicationModel("controllers");
						}
						return oAMcontrollers;
					},

					_checkIfPrerequisitesExist : function() {
						var oCU = cus.crm.mytasks.util, oCustomizingModel = oCU.Util
								.getCustomizingModel(), aPaths = [];
						if (!oCustomizingModel.getProperty("/techInfo")
								&& !oCustomizingModel.getProperty("/prioList"))
							aPaths = oCU.Schema.getServiceVersion() == 1
									&& oCU.Schema.getServiceSchemaVersion() >= 4 ? [
									"TechnicalDetails", "UserPriorities" ]
									: [ "retrieveTaskTech",
											"retrieveTaskPrioCustomizing" ];
						else
							aPaths = [];
						return aPaths;
					},

					_setPrivacyForTask : function(oPE, oCUS, oCUT) {
						var sPE = undefined, oError = undefined, bPrivateEnabled = undefined;
						if (oPE.curType === "undefined")
							oCUT.setPrivacyForSelectedTask(false);
						else {
							try {
								sPE = Array.isArray(oPE.curValue) ? oPE.curValue[0]
										: oPE.curValue;
								bPrivateEnabled = jQuery.parseJSON(sPE);
							} catch (oException) {
								oError = oException;
							}
							if (typeof oError !== "undefined")
								oCUT.setPrivacyForSelectedTask(false);
							else if (typeof bPrivateEnabled === "boolean")
								oCUT.setPrivacyForSelectedTask(bPrivateEnabled);
							else
								oCUT.setPrivacyForSelectedTask(false);
						}
					},

					_showOrHideTransactionType : function(aStrIds) {
						var oCUS = cus.crm.mytasks.util.Schema, oView = this
								.getView();
						for ( var i = 0, j = aStrIds.length; i < j; i++)
							oView.byId(aStrIds[i]).setVisible(false);
						if (oCUS.getServiceVersion() == 1
								&& oCUS.getServiceSchemaVersion() >= 3)
							for ( var i = 0, j = aStrIds.length; i < j; i++)
								oView.byId(aStrIds[i]).setVisible(true);
					},

					_showOrHideStatusField : function(aStrIds, oTask) {
						var oCU = cus.crm.mytasks.util, oCUS = oCU.Schema, oView = this
								.getView(), oCUSL = oCU.StatusListUtil;
						for ( var i = 0, j = aStrIds.length; i < j; i++)
							oView.byId(aStrIds[i]).setVisible(false);
						if (oCUS.getServiceVersion() == 1) {
							var bIsNewTask = this._checkIfNewTask(oTask);
							if (oCUS.getServiceSchemaVersion() >= 4) {
								oCU.Util.bindCustomizingModel(oView);
								if (bIsNewTask) {
									var oCM = oCU.Util.getCustomizingModel(), aStatList = oCM
											.getProperty("/masterStatusSet/"
													+ oTask.TransactionType);
									oCM.setProperty("/statList", jQuery.extend(
											[], aStatList, true));
									oCUSL.setInitialStatus(oCM);
									oView.byId("statSelect").setSelectedKey(
											oCUSL.getInitialStatus().statID);
								} else
									oView.byId("statSelect").setSelectedKey(
											oTask.UserStatusCode);
							} else if (oCUS.getServiceSchemaVersion() >= 3) {
								var s2Controller = this._getApplicationModel()
										.getProperty("/s2Controller"), oParams = undefined, sKey = undefined;
								if (s2Controller
										&& s2Controller.oStatusDDLB
										&& !s2Controller.oStatusDDLB.bNotRetrieved) {
									// Navigated from TaskList screen
									oParams = {
										procType : oTask.TransactionType,
										guid : oTask.Guid,
										bIsNew : bIsNewTask
									};
									if (!oParams.bIsNew
											|| this.bIsFollowupFromTasks
											|| this.createdfromNotes) {
										oCUSL.getStatusValues(this, oParams);
										sKey = this.bIsFollowupFromTasks
												|| this.createdfromNotes ? oCUSL
												.getInitialStatus().statID
												: oTask.UserStatusCode;
										oView.byId("statSelect")
												.setSelectedKey(sKey);
									}
								} else {
									// Bookmark scenario
									oParams = {
										procType : oTask.TransactionType,
										guid : oTask.Guid,
										bIsNew : bIsNewTask
									};
									oCUSL.getStatusValues(this, oParams);
									sKey = oParams.bIsNew ? oCUSL
											.getInitialStatus().statID
											: oTask.UserStatusCode;
									oView.byId("statSelect").setSelectedKey(
											sKey);
									if (this.oStatusDDLB.bNotRetrieved) {
										oCU.Util
												.onRequestFailed(
														this.oStatusDDLB.errorObj,
														"Operation failed: Read status customizing.");
										this.oStatusDDLB.errorObj = null;
										this.oStatusDDLB.bNotRetrieved = false;
									}
								}
							}
							for ( var i = 0, j = aStrIds.length; i < j; i++)
								oView.byId(aStrIds[i]).setVisible(true);
						}
					},

					_commonWayToSaveTask : function(oCO, oUpdateParams) {
						var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCUF = oCU.Formatter;
						oCUU.requestBusyDialog();
						oCO.curBtn.setEnabled(false);
						oCUU.logObjectToConsole("task to save: ", oCO.curTask);
						var oReturn = this.checkUIValues(oCO.curTask), title = oCUF
								.getResourceBundle().getText(
										"DETAILS_VALIDATION_TITLE");

						if (oReturn.hasErrors) {
							// show messages
							sap.ca.ui.message.showMessageBox({
								type : sap.ca.ui.message.Type.ERROR,
								message : title,
								details : oReturn.messages.toString()
							});
							oCO.curBtn.setEnabled(true);
							oCUU.releaseBusyDialog();
						} else {
							var bIsNewTask = this._checkIfNewTask(oCO.curTask);
							jQuery.sap.log
									.debug("Assure description of Task if it a new task!");
							oCUU.saveTaskAndUpdateTaskList(bIsNewTask,
									oCO.curTask, this.getView(), jQuery.proxy(
											oUpdateParams.success, this, oCO),
									jQuery.proxy(oUpdateParams.error, this,
											oCO.curBtn), oUpdateParams.async);
						}
					},

					createFollowUpObject : function(oEvent) {
						var bIsTaskModified = !this
								._checkIfExistingTaskModified(this.oSavedTask), oBundle = cus.crm.mytasks.util.Formatter
								.getResourceBundle(), sBtnText = oEvent
								.getSource().getText();
						if (bIsTaskModified) {
							var sQuestion = oBundle
									.getText("DETAILS_FOLLOWUP_MESSAGE"), mOptions = {
								// icon : sap.m.MessageBox.Icon.WARNING,
								icon : sap.m.MessageBox.Icon.QUESTION,
								title : oBundle
										.getText("DETAILS_FOLLOWUP_TITLE"),
								actions : [ sap.m.MessageBox.Action.YES,
										sap.m.MessageBox.Action.NO,
										sap.m.MessageBox.Action.CANCEL ],
								onClose : jQuery.proxy(this._confirmOnFollowup,
										this, sBtnText)
							};
							sap.m.MessageBox.confirm(sQuestion, mOptions);
						} else
							this._confirmOnFollowup(sBtnText, undefined);
					},

					_confirmOnFollowup : function(sFollowupType, sAction) {
						var oCUU = cus.crm.mytasks.util.Util;
						oCUU.requestBusyDialog();
						// if task is modified; 3 options are provided otherwise
						// proceed with follow up
						if (sAction) {
							switch (sAction) {
							case sap.m.MessageBox.Action.YES:
								// SAVE current state of Task object
								var fnSuccess = function(oCO, oData, oResponse,
										aErrorResponses) {
									var oCU = cus.crm.mytasks.util, oCUU = oCU.Util;
									oCO.curBtn.setEnabled(true);
									if (aErrorResponses
											&& aErrorResponses.length > 0)
										oCUU
												.onRequestFailed(
														aErrorResponses[0],
														"Operation failed: Update Task");
									else {
										oCUU
												.logObjectToConsole(
														"Operation successful: Update Task",
														oCO.curTask);
										var oRB = oCU.Formatter
												.getResourceBundle(), sMsg = oRB
												.getText("CURRENT_TASK_SAVED");
										sap.m.MessageToast.show(sMsg, {
											closeOnBrowserNavigation : false
										});
										oCUU.releaseBusyDialog();
										this._performFollowUp(oCO);
									}
								}, fnError = function(oBtn, oError) {
									cus.crm.mytasks.util.Util.onRequestFailed(
											oError,
											"Operation failed: Update Task");
									oBtn.setEnabled(true);
								}, oCurObj = {
									curTask : this.getTask(),
									curBtn : this.getPage().getFooter()
											.getContentRight()[0],
									followupType : sFollowupType,
								}, oUpdateParams = {
									success : fnSuccess,
									error : fnError,
									async : false,
								};
								this._commonWayToSaveTask(oCurObj,
										oUpdateParams);
								break;
							case sap.m.MessageBox.Action.NO:
								// SAVE previous state of Task object
								this._performFollowUp({
									curTask : this.oSavedTask,
									followupType : sFollowupType
								});
								break;
							case sap.m.MessageBox.Action.CANCEL:
							default:
								// REMAIN in the same view
								oCUU.releaseBusyDialog();
								break;
							}
						} else
							this._performFollowUp({
								curTask : this.oSavedTask,
								followupType : sFollowupType
							});
					},

					_performFollowUp : function(oCO) {
						var sPath = undefined, oCU = cus.crm.mytasks.util, oCUF = oCU.Formatter, oBundle = oCUF
								.getResourceBundle(), aStrIds = [
								"DETAILS_BUTTONS_FOLLOWUP_TASK",
								"DETAILS_BUTTONS_FOLLOWUP_OPPT",
								"DETAILS_BUTTONS_FOLLOWUP_APPT" ], aChecks = [];
						for ( var i = 0; i < aStrIds.length; i++)
							aChecks.push(oBundle.getText(aStrIds[i]));
						switch (oCO.followupType) {
						case aChecks[0]:
							sPath = "TaskFollowupTransTypes";
							break;
						case aChecks[1]:
							sPath = "OpptFollowupTransTypes";
							break;
						case aChecks[2]:
							sPath = "AppFollowupTransTypes";
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
							}, oView = this.getView(), oModel = oView
									.getModel(), fnSuccessFT = function(oData,
									oResponse) {
								aTransactionTypes = oData.results;
								cus.crm.mytasks.util.Util.releaseBusyDialog();
							}, fnErrorFT = function(oCurObject, oError) {
								var oCU = cus.crm.mytasks.util, oCUS = oCU.Schema, oRB = oCU.Formatter
										.getResourceBundle(), sMsg = [ "'", "'" ]
										.join(oCurObject.curTask.Description), oFollowup = {
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
								Guid : oModel.formatValue(oCO.curTask.Guid,
										oCUF.EDM_GUID),
								TransactionType : oModel.formatValue(
										oCO.curTask.TransactionType,
										oCUF.EDM_STRING)
							};
							oModel.read(sPath, null, mParams, false, jQuery
									.proxy(fnSuccessFT, this), jQuery.proxy(
									fnErrorFT, this, oCO));
							// CallFunction is always asynchronous
							// oModel.callFunction(sPath, "GET",
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
									this._oDlFollowupTT._sFollowupType = oCO.followupType;
									this._oDlFollowupTT.open();
								}
							if (oProcType.key !== "")
								this._onSelectedFollowUpType(oProcType, oCO);
						} else
							jQuery.sap.log
									.debug("## Incorrect way to perform a Follow up ##");
					},

					_checkIfExistingTaskModified : function(oTask) {
						var bReturn = true, oView = this.getView(), sDescription = oView
								.byId("descInput").getValue(), sDueDate = oView
								.byId("dueDateInput").getValue(), sPriority = oView
								.byId("prioSelect").getSelectedKey(), bPrivate = oView
								.byId("privateSwitch").getState(), sAccName = oView
								.byId("accountInput").getValue(), sConName = oView
								.byId("contactInput").getValue(), sNote = oView
								.byId("noteTa").getValue();
						var oCU = cus.crm.mytasks.util, oDF = oCU.Formatter
								.getDateFormatter(), oCUS = oCU.Schema, sStatus = undefined;
						bReturn = bReturn
								&& sDescription === oTask.Description
								&& sPriority === oTask.Priority
								&& bPrivate === oTask.Private
								&& sAccName === (oTask.AccountName ? oTask.AccountName
										: oTask.AccountId)
								&& sConName === (oTask.ContactName ? oTask.ContactName
										: oTask.ContactId)
								&& sNote === oTask.Note;
						if (oCUS.getServiceVersion() == 1
								&& oCUS.getServiceSchemaVersion() >= 3) {
							sStatus = oView.byId("statSelect").getSelectedKey();
							bReturn = bReturn
									&& sStatus === oTask.UserStatusCode;
						}
						// To care of Task objects that have null value
						bReturn = oTask.DueDate ? bReturn
								&& sDueDate === oDF.format(oTask.DueDate)
								: bReturn && "" === sDueDate;
						return bReturn;
					},

					navBackEditOrCreate : function(oEvent) {
						var bIsTaskModified = this.oSavedTask ? !this
								._checkIfExistingTaskModified(this.oSavedTask)
								: true, oRB = cus.crm.mytasks.util.Formatter
								.getResourceBundle(), sQuestion = oRB
								.getText("NAVBACK_WARNING_MESSAGE"), mOptions = {
							icon : sap.m.MessageBox.Icon.WARNING,
							title : oRB.getText("NAVBACK_WARNING_TITLE"),
							actions : [ sap.m.MessageBox.Action.OK,
									sap.m.MessageBox.Action.CANCEL ],
							onClose : jQuery.proxy(function(sAction) {
								if (sAction === sap.m.MessageBox.Action.OK)
									this.cancelTask();
								else
									jQuery.sap.log.debug("Nav Back cancelled");
							}, this)
						};
						if (bIsTaskModified)
							sap.m.MessageBox.confirm(sQuestion, mOptions);
						else
							this.cancelTask();
					},

					privatizeTask : function(oEvent) {
						this.setBtnEnabled("assignTask", !oEvent
								.getParameter("state"));
					},

					_getPrerequisiteInfoForNewTask : function(
							aPrerequisitePaths, oTaskParams) {
						var sFormattedString, sEncodedURL, oCU = cus.crm.mytasks.util, oModel = this
								.getView().getModel(), oCUF = oCU.Formatter, oCUS = oCU.Schema;
						if (oCUS.getServiceVersion() == 1)
							if (oCUS.getServiceSchemaVersion() >= 4) {
								if (typeof oTaskParams.ProcessTypeDescription === "undefined")
									aPrerequisitePaths.push("TransactionTypes");
								if (!oCU.Util.getCustomizingModel()
										.getProperty("/masterStatusSet"))
									aPrerequisitePaths.push("UserStatuses");
							} else if (oCUS.getServiceSchemaVersion() >= 3) {
								if (typeof oTaskParams.ProcessTypeDescription === "undefined")
									aPrerequisitePaths.push("TaskTransTypes");
							}

						if (oTaskParams.accountID)
							aPrerequisitePaths
									.push([ "AccountCollection(", ")" ]
											.join(oModel.formatValue(
													oTaskParams.accountID,
													oCUF.EDM_STRING)));
						if (oTaskParams.contactID) {
							sFormattedString = oModel.formatValue(
									oTaskParams.contactID, oCUF.EDM_STRING);
							sEncodedURL = jQuery.sap.encodeURL("contactID eq "
									+ sFormattedString);
							aPrerequisitePaths
									.push("ContactCollection?$filter="
											+ sEncodedURL);
						}
						var fnSucess = function(oTaskParams, oData, oResponse,
								aErrorResponses) {
							var oCU = cus.crm.mytasks.util;
							if (aErrorResponses && aErrorResponses.length > 0)
								oCU.Util.onRequesFailed(aErrorResponses[0],
										"Prerequisite Info READ Failed!");
							else {
								for ( var i = -1, oCurResponse; oCurResponse = oData.__batchResponses[++i];)
									switch (i) {
									case 0:
										oCU.TechnicalInfoUtil
												.parseTechInfoOData(oCurResponse.data);
										break;
									case 1:
										oCU.PriorityListUtil
												.parsePrioListOData(oCurResponse.data);
										break;
									case 2:
										for ( var j = -1, oTT; oTT = oCurResponse.data.results[++j];)
											if (oTT.ProcessTypeCode === oTaskParams.procType) {
												oTaskParams.ProcessTypeDescription = oTT.Description;
												oTaskParams.privateFlag = oTT.PrivateFlag;
												if (oCU.Schema
														.getServiceVersion() == 1
														&& oCU.Schema
																.getServiceSchemaVersion() >= 4)
													oTaskParams.priority = oTT.Priority;
												break;
											}
										oCU.TechnicalInfoUtil
												.setPrivacyForSelectedTask(oTaskParams.privateFlag);
										break;
									default:
										if (oCurResponse.data.__metadata)
											// Account Info
											oTaskParams.accountName = oCurResponse.data[oCU.AccountF4
													.getFilterString()] ? oCurResponse.data[oCU.AccountF4
													.getFilterString()]
													: oTaskParams.accountID;
										else {
											if (oCurResponse.data.results[0].__metadata.type
													.search("Contact") !== -1)
												// Contact Collection
												oTaskParams.contactName = oCurResponse.data.results[0][oCU.ContactF4
														.getFilterString()] ? oCurResponse.data.results[0][oCU.ContactF4
														.getFilterString()]
														: oTaskParams.contactID;
											else
												// UserStatuses in new task
												oCU.StatusListUtil
														.setStatusValuesAgainstTransactionType(jQuery
																.extend(
																		[],
																		oCurResponse.data.results,
																		true));
										}
										break;
									}
							}
						}, fnError = function(oError) {
							cus.crm.mytasks.util.Util.onRequesFailed(oError,
									"Prerequisite Info READ Failed!");
						};
						oCU.Util.getAllPrerequisites(oModel,
								aPrerequisitePaths, {
									success : jQuery.proxy(fnSucess, this,
											oTaskParams),
									error : fnError,
									async : false
								});
						oCU.Util.bindCustomizingModel(this.getView());
					},

					_getTaskHeaderInfo : function() {
						var oView = this.getView(), oCU = cus.crm.mytasks.util, aPrerequisitePaths = this
								._checkIfPrerequisitesExist(), oContext = oView
								.getBindingContext(), sPathToRead = oContext
								.getPath().substr(1);
						aPrerequisitePaths.splice(0, 0, sPathToRead);
						if (oCU.Schema.getServiceVersion() == 1
								&& oCU.Schema.getServiceSchemaVersion() >= 4
								&& !this.oSavedTask)
							aPrerequisitePaths.push([ sPathToRead,
									oCU.Attachments.NAVLINK ].join("/"), [
									sPathToRead, "TaskStatuses" ].join("/"));
						var fnSuccess = function(oData, oResponse,
								aErrorResponses) {
							var oCU = cus.crm.mytasks.util;
							if (aErrorResponses && aErrorResponses.length > 0)
								oCU.Util
										.onRequestFailed(aErrorResponses[0],
												"Prerequisites READ plus Bookmark READ failed!");
							else {
								var oView = this.getView(), oContext = oView
										.getBindingContext(), sKey = oContext
										.getPath().substr(1);
								for ( var i = -1, oCurResponse; oCurResponse = oData.__batchResponses[++i];)
									switch (i) {
									case 0:
										// TASK HEADER INFO
										oView.getModel().oData[sKey] = jQuery
												.extend({}, oCurResponse.data,
														true);
										this.oSavedTask = oContext.getObject();
										break;
									case 1:
										// Prerequisites have not been read
										if (oCU.Schema.getServiceVersion() == 1
												&& oCU.Schema
														.getServiceSchemaVersion() >= 4)
											oCU.TechnicalInfoUtil
													.parseTechInfoOData({
														retrieveTaskTech : jQuery
																.extend(
																		{},
																		oCurResponse.data.results[0],
																		true)
													});
										else
											oCU.TechnicalInfoUtil
													.parseTechInfoOData(oCurResponse.data);
										break;
									case 2:
										oCU.PriorityListUtil
												.parsePrioListOData(oCurResponse.data);
										break;
									case 3:
										// TASK Attachments
										oCU.Attachments._aPaths = oCU.Attachments
												._addDataToODataModel(
														oView.getModel(),
														oCurResponse.data.results)["paths"];
										break;
									case 4:
										// TASK Next Possible Statuses
										oCU.StatusListUtil
												.bindStatusValuesToTask(
														oContext.getModel(),
														{
															bExpandCall : false,
															curResults : oCurResponse.data.results
														});
										break;
									default:
										break;
									}
							}
						}, fnError = function(oError) {
							cus.crm.mytasks.util.Util
									.onRequestFailed(oError,
											"Prerequisites READ plus Bookmark READ failed!");
						};
						oCU.Util.getAllPrerequisites(oView.getModel(),
								aPrerequisitePaths, {
									success : jQuery.proxy(fnSuccess, this),
									error : fnError,
									async : false
								});
					},
					/*
					 * FIORI WAVE 6 - Branch : Rel - 1.4 END of ENHANCEMENTS for
					 * MyTasks
					 */
					/*
					 * FIORI WAVE 7 - Branch : Rel - 1.5 END of ENHANCEMENTS for
					 * MyTasks
					 */
					_checkIfFollowupFromTasks : function() {
						var oOverviewController = this._getApplicationModel()
								.getProperty("/s4Controller");
						if (oOverviewController
								&& oOverviewController.oParamsToPass) {
							this.oParamsToPass = jQuery.extend(
									oOverviewController.oParamsToPass, {});
							oOverviewController.oParamsToPass = undefined;
						}
					},

					_showOverviewOrGoBack : function(oView, oParams) {
						var sGuid = undefined, oCUF = cus.crm.mytasks.util.Formatter, oModel = oView
								.getModel();
						if (typeof oParams.curTask.Guid === "undefined"
								&& typeof oParams.curTask.PredecessorGUID !== "undefined")
							sGuid = oParams.curTask.PredecessorGUID;
						else
							sGuid = oParams.curTask.Guid;
						var oAdditionalParams = {
							sScenario : oParams.scenario,
							bIsNewTask : oParams.bINT,
							sPath : sGuid ? [ "Tasks(", ")" ].join(oModel
									.formatValue(sGuid, oCUF.EDM_GUID))
									: undefined
						};
						if (oParams.bINT
								&& (oParams.scenario === "CLICKEDSAVE" || oParams.scenario === "CLICKEDASSIGNTO"))
							oModel.oData[oAdditionalParams.sPath] = oParams.curTask;
						if (this.createdfromAccounts)
							sap.ui.getCore().getEventBus().publish(
									"cus.crm.mytasks", "taskCreated");
						this._navToOriginatingApp(oAdditionalParams);
					},

					// START OF TYPE-AHEAD OF VALUE HELPS
					// TYPE-AHEAD for the account field of a TASK
					liveChangeAccount : function(oEvent) {
						var oAccInput = oEvent.getSource(), sCurValue = oAccInput
								.getValue();
						oAccInput.removeAllSuggestionItems();
						if (oAccInput.setFilterSuggests)
							oAccInput.setFilterSuggests(false);
						var fnTimeoutToDelayKeyStroke = function(sCurValue) {
							var fnSuccess = function(oData, oResponse) {
								var oAccInput = this.getView().byId(
										"accountInput");
								for ( var i = 0; i < oData.results.length; i++) {
									var oAccountResult = oData.results[i], sAccountNameToDisplay = oAccountResult[cus.crm.mytasks.util.AccountF4
											.getFilterString()]
											|| oAccountResult.accountID, oCustomDataObject = {
										key : "taskAccount",
										value : oAccountResult
									}, oItemObject = {
										text : sAccountNameToDisplay,
										customData : new sap.ui.core.CustomData(
												oCustomDataObject)
									};
									oAccInput.setShowSuggestion(true);
									oAccInput
											.addSuggestionItem(new sap.ui.core.Item(
													oItemObject));
								}
								this.__onlyOneAccountSuggested = oData.results.length == 1 ? oData.results[0]
										: undefined;
							}, oModel = this.getView().getModel(), fnError = function(
									oError) {
								cus.crm.mytasks.util.Util
										.onRequestFailed(oError,
												"Read of Suggestion items for account failed");
							}, oCU = cus.crm.mytasks.util, sFilterStringFormat = [
									oModel.formatValue(sCurValue,
											oCU.Formatter.EDM_STRING),
									oCU.AccountF4.getFilterString() ].join(","), mParams = {
								"$top" : 10,
								"$filter" : [ "substringof(", ")" ]
										.join(sFilterStringFormat)
							};
							oModel.read("/AccountCollection", null, mParams,
									true, jQuery.proxy(fnSuccess, this),
									fnError);
						};

						var iDelay = sCurValue !== "" ? 500 : 0;
						clearTimeout(this._fnTimeOut);
						if (iDelay !== 0) {
							this._fnTimeOut = setTimeout(
									jQuery.proxy(fnTimeoutToDelayKeyStroke,
											this, sCurValue), iDelay);
						}
					},

					// Selected an account from the list of suggestion items
					// either through click/tap or keyboard
					suggestedAccountSelected : function(oEvent) {
						var oItem = oEvent.getParameter("selectedItem"), oAccountInfo = oItem
								.getCustomData()[0].getValue(), oCUA = cus.crm.mytasks.util.AccountF4, sAccountNameToSet = oAccountInfo[oCUA
								.getFilterString()]
								|| oAccountInfo.accountID;
						// Set AccountF4 util
						oCUA.setId(oAccountInfo.accountID).setName(
								sAccountNameToSet);
						// Set input field to match case letters of contact
						oEvent.getSource().setValue(sAccountNameToSet);
					},

					// TYPE-AHEAD for the contact field of a TASK
					liveChangeContact : function(oEvent) {
						var oConInput = oEvent.getSource(), sCurValue = oConInput
								.getValue();
						oConInput.removeAllSuggestionItems();
						if (oConInput.setFilterSuggests)
							oConInput.setFilterSuggests(false);
						var fnTimeoutToDelayKeyStroke = function(sCurValue) {
							var fnSuccess = function(oData, oResponse) {
								var oConInput = this.getView().byId(
										"contactInput");
								for ( var i = 0; i < oData.results.length; i++) {
									var oContactResult = oData.results[i], sContactNameToDisplay = oContactResult[cus.crm.mytasks.util.ContactF4
											.getFilterString()]
											|| oContactResult.contactID, oCustomDataObject = {
										key : "taskContact",
										value : oContactResult
									}, oItemObject = {
										text : sContactNameToDisplay,
										customData : new sap.ui.core.CustomData(
												oCustomDataObject)
									};
									oConInput.setShowSuggestion(true);
									oConInput
											.addSuggestionItem(new sap.ui.core.Item(
													oItemObject));
								}
								this.__onlyOneContactSuggested = oData.results.length == 1 ? oData.results[0]
										: undefined;
							}, fnError = function(oError) {
								cus.crm.mytasks.util.Util
										.onRequestFailed(oError,
												"Read of Suggestion items for contact failed");
							}, oCU = cus.crm.mytasks.util, oModel = this
									.getView().getModel(), sFilterStringFormat = [
									oModel.formatValue(sCurValue,
											oCU.Formatter.EDM_STRING),
									oCU.ContactF4.getFilterString() ].join(","), mParams = {
								"$top" : 10,
								"$filter" : [ "substringof(", ")" ]
										.join(sFilterStringFormat)
							};
							oModel.read("/ContactCollection", null, mParams,
									true, jQuery.proxy(fnSuccess, this),
									fnError);
						};

						var iDelay = sCurValue !== "" ? 500 : 0;
						clearTimeout(this._fnTimeOutC);
						if (iDelay !== 0) {
							this._fnTimeOutC = setTimeout(
									jQuery.proxy(fnTimeoutToDelayKeyStroke,
											this, sCurValue), iDelay);
						}
					},

					// Selected a contact from the list of suggestion items
					// either through click/tap or keyboard
					suggestedContactSelected : function(oEvent) {
						var oCUC = cus.crm.mytasks.util.ContactF4, oItem = oEvent
								.getParameter("selectedItem"), oContactInfo = oItem
								.getCustomData()[0].getValue(), sContactNameToSet = oContactInfo[oCUC
								.getFilterString()]
								|| oContactInfo.contactID;
						// Set ContactF4 util
						oCUC.setId(oContactInfo.contactID).setName(
								sContactNameToSet);
						// Set input field to match case letters of contact
						oEvent.getSource().setValue(sContactNameToSet);
						oCUC._setAccountIfNotSetAlready(this, oContactInfo);
					},
					// END OF TYPE-AHEAD OF VALUE HELPS

					// START OF ATTACHMENTS
					onUploadFile : function(oEvent) {
						var oAttachmentInfo = oEvent.getParameter("d");
						if (!oAttachmentInfo)
							oAttachmentInfo = oEvent.getParameters();
						cus.crm.mytasks.util.Attachments.EditPage
								.uploadFileToTask(this, oAttachmentInfo);
					},

					onRenameFile : function(oEvent) {
						var oAttachmentInfo = oEvent.getParameter("d");
						if (!oAttachmentInfo)
							oAttachmentInfo = oEvent.getParameters();
						var aDummy = (oAttachmentInfo.mediaURL || oAttachmentInfo.url)
								.split("/");
						// oParams2 can be used for TaskAttachmentSet entity
						var oParams2 = {
							path : aDummy[aDummy.length - 2],
							entry : {
								Name : oAttachmentInfo.newFilename
										+ oAttachmentInfo.parsedFileExtension,
								Documentid : oAttachmentInfo.fileId,
								Documentclass : oAttachmentInfo.docClass,
								HeaderGuid : oAttachmentInfo.taskGuid
							}
						};
						var sPathToUpdate = [ aDummy[aDummy.length - 2],
								aDummy[aDummy.length - 1] ].join("/"), oParams = {
							entry : {
								newfilename : oAttachmentInfo.newFilename
										+ oAttachmentInfo.parsedFileExtension,
								fileId : oAttachmentInfo.fileId,
								fileExtension : oAttachmentInfo.fileExtension
							},
							headers : {
								newfilename : oAttachmentInfo.newFilename
							},
							path : sPathToUpdate
						};
						cus.crm.mytasks.util.Attachments.EditPage
								.renameFileOfTask(this, oParams);
					},

					onDeleteFile : function(oEvent) {
						var oAttachmentInfo = oEvent.getParameter("d");
						if (!oAttachmentInfo)
							oAttachmentInfo = oEvent.getParameters();
						cus.crm.mytasks.util.Attachments.EditPage
								.deleteFileFromTask(this, oAttachmentInfo);
					},

					onFileUploadFailed : function(oEvent) {
						var sHighLevelMsg = oEvent.getParameter("exception").message;
						var oJQResponse = oEvent.getParameter("response")
								.response(), oErrorResponse = oJQResponse.jqXHR.responseJSON
								&& oJQResponse.jqXHR.responseJSON.error;
						sap.ca.ui.message.showMessageBox({
							type : sap.ca.ui.message.Type.ERROR,
							message : sHighLevelMsg,
							details : oErrorResponse
									&& oErrorResponse.message.value
						});
					},

					onBeforeFileUpload : function(oEvent) {
						var oAttachmentInfo = oEvent.getParameters(), sFilename = oAttachmentInfo.name, aDummy = sFilename
								.split(".");
						if (aDummy.length > 1
								&& aDummy[aDummy.length - 1] === "rar")
							this.getView().getModel().setHeaders({
								"Content-Type" : "application/x-rar-compressed"
							});
					},

					onSaveClicked : function(oEvent) {
						if (sap.ui.version < "1.21.1") {

						} else
							jQuery.sap.log
									.debug("## Event has been deprecated from UI5 1.21.1 onwards");
					},

					onCancelClicked : function(oEvent) {
						if (sap.ui.version < "1.21.1") {

						} else
							jQuery.sap.log
									.debug("## Event has been deprecated from UI5 1.21.1 onwards");
					},
					// END OF ATTACHMENTS

					_checkFor412StatusCode : function(oError, sLogMsg) {
						var oCU = cus.crm.mytasks.util, oBundle = oCU.Formatter
								.getResourceBundle();
						if (oError.response.statusCode === "412") {
							jQuery.sap.log.debug("412 error occurred during"
									+ sLogMsg);
							var fnClose = function(oAction) {
								var oCU = cus.crm.mytasks.util;
								oCU.Util.requestBusyDialog();
								this.oSavedTask = undefined;
								// this.oRouter.navTo("taskDetail", temp, true);
								this._getTaskHeaderInfo();
								this.prepareNewTask(this.oSavedTask);
								this.initializeDetailsPage(this.oSavedTask);
								var oPrivateFlag = {
									curType : typeof this.oSavedTask.PrivateAllowed,
									curValue : this.oSavedTask.PrivateAllowed
								};
								this._setPrivacyForTask(oPrivateFlag,
										oCU.Schema, oCU.TechnicalInfoUtil);
								oCU.Util.releaseBusyDialog();
							}, mOptions = {
								icon : sap.m.MessageBox.Icon.ERROR,
								title : oBundle.getText("S3_412_TITLE"),
								actions : [ sap.m.MessageBox.Action.OK ],
								onClose : jQuery.proxy(fnClose, this),
							};
							sap.m.MessageBox.show(oBundle
									.getText("S3_412_ERRORMSG"), mOptions);
							oCU.Util.releaseBusyDialog();
						} else
							oCU.Util.onRequestFailed(oError, sLogMsg);
					},
				/*
				 * FIORI WAVE 7 - Branch : Rel - 1.5 END of ENHANCEMENTS for
				 * MyTasks
				 */
				});