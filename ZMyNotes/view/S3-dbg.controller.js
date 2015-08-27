/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("cus.crm.notes.control.SectionList");
jQuery.sap.require("cus.crm.notes.handler.ModelHandler");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.model.type.Date");
jQuery.sap.require("sap.ca.ui.model.type.DateTime");
jQuery.sap.require("sap.ca.ui.model.type.Time");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("cus.crm.notes.util.Schema");
jQuery.sap.require("cus.crm.notes.util.Util");

// Used for image upload functionality
// define = undefined;
jQuery.sap.require("sap.ca.ui.JS.jquery-ui-widget");
jQuery.sap.require("sap.ca.ui.JS.jquery-iframe-transport");
jQuery.sap.require("sap.ca.ui.JS.jquery-fileupload");

sap.ca.scfld.md.controller.BaseDetailController
		.extend(
				"cus.crm.notes.view.S3",
				{

					oModelHandler : null,

					onExit : function() {
						// clean up on exit
						this.oModelHandler.onExit();

						// clean up dialogs
						if (this.oCreateAppointmentDialog) {
							this.oCreateAppointmentDialog.destroy();
						}
						if (this.oCreateTaskDialog) {
							this.oCreateTaskDialog.destroy();
						}
						if (this.oContactSelectDialog) {
							this.oContactSelectDialog.destroy();
						}
						if (this.oAddToDialog) {
							this.oAddToDialog.destroy();
						}
						if (this.oAccountSelectDialog) {
							this.oAccountSelectDialog.destroy();
						}
						if (this.oDataLossDialog) {
							this.oDataLossDialog.destroy();
						}
					},

					onInit : function() {
						// execute the onInit for the base class
						// BaseDetailController
						sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit
								.call(this);

						this.oModelHandler = new cus.crm.notes.handler.ModelHandler();
						this.oModelHandler.networkErrorCallback = jQuery.proxy(
								this.openNetworkErrorDialog, this);
						this.oModelHandler.exceptionCallback = jQuery.proxy(
								this.openExceptionDialog, this);
						this.oModel = this.getView().getModel();

						this.oRouter
								.attachRouteMatched(
										jQuery
												.proxy(
														function(oEvent) {
															if (oEvent
																	.getParameter("name") === "detail") {
																this.oModelHandler
																		.attachView(
																				oEvent
																						.getParameter("arguments").contextPath,
																				this
																						.getView());
																
																if(this.getView().getModel().getProperty("/" + oEvent.getParameter("arguments").contextPath)){
																	this._saveETag(this.getView().getModel().getProperty("/" + oEvent.getParameter("arguments").contextPath).Etag);
																	}else{
																		
																		this.oModel.read("/NoteHeaders", null, null, false,
																				function(oData, resp){
																					
																		for (var k = 0; k < oData.results.length; k++) {
																			
																			
																				if("NoteHeaders('"+oData.results[k].NoteGuid+"')"==oEvent.getParameter("arguments").contextPath)
																					if(this._saveETag){
																					this._saveETag(oData.results[k].Etag);
																					}else{
																						this.sETag = oData.results[k].Etag;
																						
																					}
															
																		}
		
																	});
																	}
												
																this._oSectionList
																		.removeSelections(true);
																this.oHeaderFooterOptions.sDetailTitle = this.oModelHandler
																		.getTeaserText();
																this
																		.setHeaderFooterOptions(this.oHeaderFooterOptions);
																this._iTextAreaToFocus = 0;
																this._iTextAreaToFocusCursorPos = 0;

																// Invalidate if
																// coming back
																// from noData
																// as the
																// rerendering
																// is setting
																// all textarea
																// height to
																// zero
																jQuery.sap
																		.delayedCall(
																				20,
																				this,
																				function() {
																					if (this.noDataFlag) {
																						this.noDataFlag = false;
																						this._oSectionList
																								.invalidate();
																					}
																				});
															} else if (oEvent
																	.getParameter("name") === "noData") {
																this.noDataFlag = true;
															}
														}, this), this);

						// workaround: fixing exception on startup
						/*
						 * this.oApplicationImplementation.registerExitModule =
						 * function(fExitModule){ console.log("skipping
						 * registerExitModule"); };
						 */

						this._iAutoSaveTimeout = 30000; // 5s for test purposes
														// only
						this._iAutoSaveID = -1;
						this._bWaitingToAutoSave = false;

						this._isBlurCalled = false; // flag to indicate if
													// jQuery.blur was called to
													// enable scrolling after
													// split/merge on
													// touchscreen devices

						this._oSectionList = this.byId("sectionList");
						this._iTextAreaToFocus = -1;
						this._iTextAreaToFocusCursorPos = -1;
						this._oListOnAfterRenderingDelegate = {
							onAfterRendering : function() {
								if (this._oSectionList.getItems().length > 0
										&& this._iTextAreaToFocus >= 0) {
									// var $textArea =
									// this._oSectionList.getItems()[this._iTextAreaToFocus].$().find("textarea");
									// if(!jQuery.device.is.ipad){
									setTimeout(jQuery.proxy(this.handleFocus,
											this), 150);
									// }
								}
							}
						};
						this._oSectionList.addEventDelegate(
								this._oListOnAfterRenderingDelegate, this);

						// Footer options are now handled in the controller
						var that = this;
						this.oHeaderFooterOptions3UI = {
								buttonList : [
										{
											// sI18nBtnTxt :
											// this._get_i18n_Text("DETAIL_BUTTON_ADDPICTURE"),
											// onBtnPressed : function(evt) {
											// that.handleSectionAddPicture(evt);
											// }
											// }, {
											sI18nBtnTxt : this
													._get_i18n_Text("DETAIL_BUTTON_DELETE"),
											onBtnPressed : function(evt) {
												that.displayDataLoss(evt);
											}
										},
										{
											sI18nBtnTxt : this
													._get_i18n_Text("DETAIL_BUTTON_ADDTO"),
											onBtnPressed : function(evt) {
												that.openAddToDialog(evt);
											}
										},
										{
											sI18nBtnTxt : this
													._get_i18n_Text("DETAIL_BUTTON_CREATEAPPOINTMENT"),
											onBtnPressed : function(evt) {
												that.navToAppointments(evt);
											},
										},
										{
											sI18nBtnTxt : this
													._get_i18n_Text("DETAIL_BUTTON_CREATETASK"),
											onBtnPressed : function(evt) {
												that.navToTasks(evt);
											}
										} ],
								oJamOptions : {
									oShareSettings : {
										object : {
											id : "",
											share : ""
										}
									},
									fGetShareSettings : function() {
										return {
											object : {
												id : "",
												share : that._getSelectedText()
											}
										};
									}
								},
								oEmailSettings : {
									// sSubject :
									// this._get_i18n_Text("EMAIL_HEADER"),
									// sRecepient :
									// this._get_i18n_Text("EMAIL_DEFAULT_RECEIVER"),
									fGetMailBody : function() {
										return that._getSelectedText();
									}
								},
								oAddBookmarkSettings : {
									icon : "sap-icon://Fiori2/F0006"
								},
								sDetailTitle : ""
							};

							this.oHeaderFooterOptions4UI = {
									buttonList : [
											{
												// sI18nBtnTxt :
												// this._get_i18n_Text("DETAIL_BUTTON_ADDPICTURE"),
												// onBtnPressed : function(evt) {
												// that.handleSectionAddPicture(evt);
												// }
												// }, {
												sI18nBtnTxt : this
														._get_i18n_Text("DETAIL_BUTTON_DELETE"),
												onBtnPressed : function(evt) {
													that.displayDataLoss(evt);
												}
											},
											{
												sI18nBtnTxt : this
														._get_i18n_Text("DETAIL_BUTTON_ADDTO"),
												onBtnPressed : function(evt) {
													that.openAddToDialog(evt);
												}
											},
											{
												sI18nBtnTxt : this
														._get_i18n_Text("DETAIL_BUTTON_CREATEAPPOINTMENT"),
												onBtnPressed : function(evt) {
													that.navToAppointmentDialog(evt);
												},
											},
											{
												sI18nBtnTxt : this
														._get_i18n_Text("DETAIL_BUTTON_CREATETASK"),
												onBtnPressed : function(evt) {
													that.navToTaskDialog(evt);
												}
											} ],
									oJamOptions : {
										oShareSettings : {
											object : {
												id : "",
												share : ""
											}
										},
										fGetShareSettings : function() {
											return {
												object : {
													id : "",
													share : that._getSelectedText()
												}
											};
										}
									},
									oEmailSettings : {
										// sSubject :
										// this._get_i18n_Text("EMAIL_HEADER"),
										// sRecepient :
										// this._get_i18n_Text("EMAIL_DEFAULT_RECEIVER"),
										fGetMailBody : function() {
											return that._getSelectedText();
										}
									},
									oAddBookmarkSettings : {
										icon : "sap-icon://Fiori2/F0006"
									},
									sDetailTitle : ""
								};
							
							this.sBackendVersion = cus.crm.notes.util.Schema._getServiceSchemaVersion(this.oModel,"NoteHeader");
							this.oVersioningModel = new sap.ui.model.json.JSONModel({});
							this._loadVersionSpecificUI(this.sBackendVersion);


						
						// EXTENSION POINT to be able to extend header footer
						// options
						/**
						 * @ControllerHook extHookGetHeaderFooterOptions is the
						 *                 controller hook where the
						 *                 headerFooterOptions can be extended.
						 *                 Attributes like add note, delete note
						 *                 can be defined in addition to
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

						this.setHeaderFooterOptions(this.oHeaderFooterOptions);

					},

					_loadVersionSpecificUI : function(sBackendVersion){	
						
						
						if(parseFloat(sBackendVersion) >= 2){
							this.oHeaderFooterOptions = this.oHeaderFooterOptions4UI;
						}
						else{
							this.oHeaderFooterOptions = this.oHeaderFooterOptions3UI;
						}
						 
						 	
					},	
					
					_loadWave3UI :function()
					{
						
					},
					
					_loadWave4UI :function()
					{
						
					},
					


					handleFocus : function() {
						var $textArea = this._oSectionList.getItems()[this._iTextAreaToFocus]
								.$().find("textarea");
						/*
						 * use triggerHandler instead of focus() as bug reported
						 * in IE check doc in http://api.jquery.com/focus/
						 */

						$textArea.focus();
						// $textArea.triggerHandler("focus");
						$textArea.prop("selectionStart",
								this._iTextAreaToFocusCursorPos);
						$textArea.prop("selectionEnd",
								this._iTextAreaToFocusCursorPos);
					},

					navToSubview : function() {
						this.oRouter.navTo("subDetail",
								{
									contextPath : this.getView()
											.getBindingContext().sPath
											.substr(1)
								});
					},

					navToEmpty : function() {
						this.oRouter.navTo("noData");
					},

					destroy : function() {
						if (sap.ca.scfld.md.controller.BaseDetailController.prototype.destroy) {
							sap.ca.scfld.md.controller.BaseDetailController.prototype.destroy
									.apply(this);
						}
						this._oSectionList
								.removeEventDelegate(this._oListOnAfterRenderingDelegate);
						if (this._oNetworkErrorMessageDialog)
							this._oNetworkErrorMessageDialog.destroy();
						if (this.oSharingDialogComponent)
							this.oSharingDialogComponent.destroy();
					},
					checkEtag :function(bForceUpdate){

						 this.bForceUpdate = bForceUpdate;
				         
					       var nBackendVersion = parseFloat(this.sBackendVersion);
					       var oETag = null;
					        //INTEROP CHECK - for waves 6 and below bForceUpdate must not be honored
					        	
								if(nBackendVersion >= 2.0){
									oETag = {sETag : ((bForceUpdate) ? "*" : null)};
									
								}
								else{
									bForceUpdate = false;
									
								}
								
								
						 this.oETag = oETag;
						 
					},

					handleSectionChange : function(evt) {
						if (!this._isBlurCalled) {
							this._cancelAutoSave();
							var path = evt.getSource()
									.getBindingContext("json").getPath();

							this.checkEtag(false);
							this.oModelHandler.updateSection(path,false, this.oETag,this);
							this.refreshDetailTitle();
							// trigger event for New Changed
							sap.ui.getCore().getEventBus().publish(
									"cus.crm.notes", "SectionChanged", {
										context : true
									});
						} else {
							this._isBlurCalled = false;
						}
					},

					handleSectionLiveChange : function(evt) {
						this.checkEtag(false);
						var textArea = evt.getSource();
						var path = textArea.getBindingContext("json").getPath();
						var textValue = textArea.getValue();
						var iSplitPosition = textValue.indexOf("\n\n");
						var domRefTextArea = textArea.getDomRef();
						var textarea = $(domRefTextArea).find("textarea");

						var scrollDelegate = undefined;

						if (iSplitPosition != -1) { // Double return pressed
							var list = this.getView().byId("sectionList");
							var index = list.indexOfItem(textArea.getParent());

							this._cancelAutoSave();
							this._iTextAreaToFocus = index + 1;
							this._iTextAreaToFocusCursorPos = 0;
							// trigger event for New Changed
							sap.ui.getCore().getEventBus().publish(
									"cus.crm.notes", "SectionChanged", {
										context : true
									});

							this.oModelHandler.splitSection(path,
									iSplitPosition);
							this.refreshDetailTitle();
							setTimeout(this.enableScrolling(this.getPage()
									.getScrollDelegate()), 50);
						} else { // this is just a regular insert, we need to
									// run the autosave function.

							this._iTextAreaToFocusCursorPos = textarea
									.prop("selectionStart"); // keep cursor
																// pos in case
																// of
																// handleFocus
																// is triggered

							textarea[0].style.overflow = "auto";
							textarea[0].style.height = "100%";
							textarea[0].style.height = textarea[0].scrollHeight
									+ 'px';
							textarea[0].style.overflow = "hidden";

							// Need to store the scrollheight in the cuastom
							// data attribute
							// textArea.data('scrollValue',
							// textarea[0].scrollHeight);

							if (!this._bWaitingToAutoSave) {
								this._bWaitingToAutoSave = true;
								this._iAutoSaveID = setTimeout(jQuery.proxy(
										function() {
											this._autoSave(textArea);
										}, this), this._iAutoSaveTimeout);
							}
						}
					},

					enableScrolling : function(scrollDelegate) {
						scrollDelegate.onBeforeRendering();
						scrollDelegate.onAfterRendering();
					},

					handleDeleteSection : function() {
						if(this.oDataLossDialog)
							this.oDataLossDialog.close();
						
						var list = this.getView().byId("sectionList"), listItems = list
								.getItems(), iIndexOfItemToFocus = undefined;

						if (1 === 1) { // add check, if mock mode is off here
							var aBindingPaths = [];

							for ( var i = listItems.length - 1; i >= 0; i--) {
								if (listItems[i].getSelected() == true) {
									iIndexOfItemToFocus = i - 1;
									var path = listItems[i].getBindingContext(
											"json").getPath();
									aBindingPaths.push(path);
								}
							}
							if (iIndexOfItemToFocus < 0) {
								this._iTextAreaToFocus = 0;
							} else {
								this._iTextAreaToFocus = iIndexOfItemToFocus;
							}
							if (aBindingPaths.length === 0
									|| aBindingPaths.length === listItems.length
									|| listItems === 0) {
								// delete complete note
								sap.ui.getCore().getEventBus().publish(
										"cus.crm.notes",
										"DeleteNote",
										{
											path : this.getView()
													.getBindingContext()
													.getPath()
										});
								this.oModelHandler.oJSONModel.getData().navNoteSection = [];// TODO:
																							// remove
																							// or
																							// refactor
								if (jQuery.device.is.phone) {
									this._navBack();
								}
							} else {
								this.oModelHandler
								.deleteSections(aBindingPaths);
								this.refreshDetailTitle();
							}
							this._oSectionList.removeSelections(true);
						}
					},

					cancelDeleteSection : function() {
						this.oDataLossDialog.close();
					},

					mergeHandler : function(evt) {
						this._cancelAutoSave();
						
						var path = evt.getSource().getBindingContext("json")
								.getPath();
						var sFirstPath = null;
						var sSecondPath = null;

						var list = this.getView().byId("sectionList");
						var listItems = list.getItems();

						switch (evt.getParameter("Key")) {
						case "backspace":
							sSecondPath = path;

							for ( var i = 1; i < listItems.length; i++) {
								if (listItems[i].getBindingContext("json")
										.getPath() == sSecondPath) {
									sFirstPath = listItems[i - 1]
											.getBindingContext("json")
											.getPath();

									this._iTextAreaToFocus = i - 1;
									this._iTextAreaToFocusCursorPos = listItems[i - 1]
											.$().find("textarea").val().length;
									// listItems[i-1].$().find("textarea").blur();
									listItems[i].setSelected(false);
								}
							}

							break;
						case "delete":
							sFirstPath = path;

							for ( var i = 0; i < listItems.length - 1; i++) {
								if (listItems[i].getBindingContext("json")
										.getPath() == sFirstPath) {
									sSecondPath = listItems[i + 1]
											.getBindingContext("json")
											.getPath();

									this._iTextAreaToFocus = i;
									this._iTextAreaToFocusCursorPos = listItems[i]
											.$().find("textarea").val().length;
									// listItems[i].$().find("textarea").blur();
									listItems[i + 1].setSelected(false);
								}
							}

							break;
						}

						if (sFirstPath != null && sSecondPath != null) {
							this.oModelHandler.mergeSection(sFirstPath,
									sSecondPath);
							this.refreshDetailTitle();
						}
						setTimeout(this.enableScrolling(this.getPage()
								.getScrollDelegate()), 50);
					},

					_autoSave : function(oTextArea) {
						var path = oTextArea.getBindingContext("json")
								.getPath();

						this.checkEtag(false);
						this.oModelHandler.updateSection(path,false, this.oETag,this);
						this.refreshDetailTitle();

						this._bWaitingToAutoSave = false;
					},

					_cancelAutoSave : function() {
						clearTimeout(this._iAutoSaveID);
						this._bWaitingToAutoSave = false;
					},

					displayDataLoss : function(evt) {
						// display DataLossPopup as xml fragment
						if (!this.oDataLossDialog) {
							this.oDataLossDialog = sap.ui.xmlfragment(
									"cus.crm.notes.view.DataLossDialog", this);

							this.oDataLossDialog.setModel(this.getView()
									.getModel());
							this.oDataLossDialog.setModel(this.getView()
									.getModel("i18n"), "i18n");
						}
						var list = this.getView().byId("sectionList"), listItems = list
						.getSelectedItems().length;
						if(listItems>=1){
							this.oDataLossDialog.getContent()[0].getContent()[0].setText( sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("DELETE_SELECTED_NOTE_QUESTION"));
						}else{
							this.oDataLossDialog.getContent()[0].getContent()[0].setText( sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("DELETE_ALL_NOTE_QUESTION"));
						}
						this.oDataLossDialog.open();
					},

					// Appointment Process Type Dialog when click on create an
					// appointment

					navToAppointmentDialog : function(oEvent) {
						this.oActionSheet = sap.ui.xmlfragment(
								"cus.crm.notes.view.ProcessTypeDialog",

								this);
						this.oActionSheet.setModel(this.getView().getModel(
								"i18n"), "i18n");
						var oModel = this.getView().getModel();
						var jsonModel = new sap.ui.model.json.JSONModel();
						var data1;
						oModel.read( ((parseFloat(this.sBackendVersion) >= 3) ? "ApptTransactionTypeSet": "ApptTransactionTypes"), null, null, false,
								function(oData, resp) // [
														// "$filter=ProcessType
														// eq '" + pType+ "'" ]
								{
									data1 = {
										ProcessTypes : resp.data.results
									};

								});
						
						this.appointmentFlag = true;
						
						if(data1.ProcessTypes.length == 0)
						{ 
							this.appointmentFlag = false;
							sap.ca.ui.message.showMessageBox({
						            type: sap.ca.ui.message.Type.ERROR,
						            message: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("FOLLOWUPERROR"),
						            details: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("FOLLOWUPERROR")
						        });
						
						}
						else if(data1.ProcessTypes.length==1)
							{
								this.onlyOneAppointmentProcessType=true;
								this.processType = data1.ProcessTypes[0].ProcessTypeCode;
								this.ProcessTypeDescription = data1.ProcessTypes[0].Description;
								this.privateFlag = data1.ProcessTypes[0].PrivateFlag;
								this.selectProcess();
							}
						else{
								jsonModel.setData(data1);
								this.oActionSheet.setModel(jsonModel, "json");
		
								this.oActionSheet._searchField
										.setPlaceholder(sap.ca.scfld.md.app.Application
												.getImpl().getResourceBundle().getText(
														"SEARCH"));
								this.oActionSheet._list.setGrowingScrollToLoad(true);
		
								this.oActionSheet._dialog.setVerticalScrolling(true);
		
								this.oActionSheet.open();
						}

						// setting appointment flag to navigate to Appointment
						// application
						

					},

					navToTaskDialog : function(oEvent) {
						this.oActionSheet = sap.ui.xmlfragment(
								"cus.crm.notes.view.ProcessTypeDialog",

								this);
						this.oActionSheet.setModel(this.getView().getModel(
								"i18n"), "i18n");
						var oModel = this.getView().getModel();
						var jsonModel = new sap.ui.model.json.JSONModel();
						var data1;
						oModel.read(( (parseFloat(this.sBackendVersion) >= 3) ? "TaskTransactionTypeSet" : "TaskTransactionTypes"), null, null, false,
								function(oData, resp) // [
														// "$filter=ProcessType
														// eq '" + pType+ "'" ]
								{
									data1 = {
										ProcessTypes : resp.data.results
									};

								});
						
						this.appointmentFlag = false;
						
						if(data1.ProcessTypes.length == 0)
						{ 
							sap.ca.ui.message.showMessageBox({
						            type: sap.ca.ui.message.Type.ERROR,
						            message: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("FOLLOWUPERROR"),
						            details: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("FOLLOWUPERROR")
						        });
						
						}
						else if(data1.ProcessTypes.length==1)
						{
							this.onlyOneTaskProcessType=true;
							this.processType = data1.ProcessTypes[0].ProcessTypeCode;
							this.ProcessTypeDescription = data1.ProcessTypes[0].Description;
							this.privateFlag = data1.ProcessTypes[0].PrivateFlag;
							this.selectProcess();
						}
					else{
						jsonModel.setData(data1);
						this.oActionSheet.setModel(jsonModel, "json");

						this.oActionSheet._searchField
								.setPlaceholder(sap.ca.scfld.md.app.Application
										.getImpl().getResourceBundle().getText(
												"SEARCH"));
						this.oActionSheet._list.setGrowingScrollToLoad(true);

						this.oActionSheet._dialog.setVerticalScrolling(true);

						this.oActionSheet.open();

						// setting appointment flag to navigate to Appointment
						// application
					}
						

					},

					// search in process type dialog
					searchProcess : function(oEvent) {
						var sValue = oEvent.getParameter("value");
						if (sValue !== undefined) {
							// apply the filter to the bound items, and the
							// Select Dialog will update
							oEvent
									.getParameter("itemsBinding")
									.filter(
											[ new sap.ui.model.Filter(
													"Description",
													sap.ui.model.FilterOperator.Contains,
													sValue) ]);
						}
					},

					selectProcess : function(oEvent) {

						// Getting context path

						var aItemPaths = this._getSelectedItemPaths();

						if(!(this.onlyOneAppointmentProcessType || this.onlyOneTaskProcessType) ){
						var selectedItem = oEvent.getParameter("selectedItem");
						if (selectedItem) {
							this.processType = selectedItem.data("ProcessTypeCode");
							this.ProcessTypeDescription = selectedItem.data("ProcessTypeDescription");
							this.privateFlag = selectedItem.data("PrivateFlag");
						}
						}

						// console.log("window location" + this.processType);
						// console.log("window location" + oEvent);

						// var aItemPaths =
						// this.getView().getBindingContext().sPath.substr(1);

						// *XNav* (1) obtain cross app navigation interface
						var fgetService = sap.ushell && sap.ushell.Container
								&& sap.ushell.Container.getService;
						this.oCrossAppNavigator = fgetService
								&& fgetService("CrossApplicationNavigation");
						// console.log("window location" +this.appointmentFlag);

						if (this.appointmentFlag) {

							// *XNav (2) generate cross application link
							
							var toApp = this.oCrossAppNavigator
									&& this.oCrossAppNavigator
											.hrefForExternal({
												target : {
													// semanticObject :
													// "Appointment",
													// action: "myAppointments"
													semanticObject : "Appointment",
													action : "myAppointments"
												},												
												params : {
													"processType" : this.processType,
												//	"ProcessTypeDescription" : this.ProcessTypeDescription,
													"createFromNote" : "X",
													"itemPaths" : aItemPaths,
												//	"privateFlag" : this.privateFlag
												// "itemPaths" : aItemPaths
												}
											}) || "";

							// Navigate to the target
							window.location = toApp;
							this.appointmentFlag = false;
						}

						else {
							// *XNav (2) generate cross application link
							var oContext = this.getView().getBindingContext();
							var toApp = this.oCrossAppNavigator
									&& this.oCrossAppNavigator
											.hrefForExternal({
												target : {
													semanticObject : "Task",
													action : "manageTasks"
												},
												appSpecificRoute : [ "&", "newTask",
																		this.processType ].join("/"),
												params : {
													"processType" : this.processType,
												//	"ProcessTypeDescription" : this.ProcessTypeDescription,
													"createFromNote" : "X",
													"itemPaths" : aItemPaths
												}												
											}) || "";

							// Navigate to the target
							window.location = toApp;
							//
							this.appointmentFlag = false;

						}

					},

					/**
					 * Cross navigation to the appointment app to create an
					 * appointment
					 * 
					 * @param oEvent
					 */

					navToAppointments : function(oEvent) 
					{ 
						var aItemPaths =	  this._getSelectedItemPaths();
						// XNav (1) obtain cross app navigation interface var
						var fgetService = sap.ushell && sap.ushell.Container &&
						sap.ushell.Container.getService; this.oCrossAppNavigator =
							fgetService && fgetService("CrossApplicationNavigation");
						// XNav (2) generate cross application link 
						var toApp = 	  this.oCrossAppNavigator &&
						this.oCrossAppNavigator.hrefForExternal({ target: {
							semanticObject : "Appointment", action: "myAppointments" },
							params : { "createFromNote" : "X", "itemPaths" :
								aItemPaths} }) || "";

						//Navigate to the target 
						window.location = toApp ;
						
					},

						// Cross navigation to the appointment app to create an
						//appointment @param oEvent / 
						navToTasks :	  function(oEvent)

						{ var aItemPaths =
							this._getSelectedItemPaths();
						// XNav (1) obtain cross app navigation interface var
						var fgetService = sap.ushell && sap.ushell.Container &&
						sap.ushell.Container.getService; this.oCrossAppNavigator =
							fgetService && fgetService("CrossApplicationNavigation");
						// XNav (2) generate cross application link 
						var toApp =
						this.oCrossAppNavigator &&
						this.oCrossAppNavigator.hrefForExternal({ target: {
							semanticObject : "Task", action: "manageTasks" }, params : {
								"createFromNote" : "X", "itemPaths" : aItemPaths } }) ||
								"";

						//Navigate to the target 

						window.location = toApp ;

						},





					/**
					 * Helper function to read text out of i18n. This is needed
					 * in a controller, because coding is not being parsed like
					 * in the xml views.
					 */
					_get_i18n_Text : function(textName) {
						return this.oApplicationFacade.getResourceBundle()
								.getText(textName);
					},

					/**
					 * Reads the selected texts in the section list. If no item
					 * is selected, the text of all items will be returned.
					 * 
					 * @returns {String}
					 */
					_getSelectedText : function() {
						var aItemPaths = this._getSelectedItemPaths();
						var selectedText = this.oModelHandler
								.getSectionsText(aItemPaths);

						return selectedText;
					},

					/**
					 * Returns the selected item paths in the section list. If
					 * no item is selected, all items will be returned.
					 * 
					 * @returns {Array}
					 */
					_getSelectedItemPaths : function() {
						var list = this.getView().byId("sectionList");
						var listItems = list.getItems();
						var aAllPaths = [];
						var aItemPaths = [];
						var selectAll = true;
						var path = null;

						// Loop over all sections and check if section has been
						// checked
						for ( var i = 0; i < listItems.length; i++) {
							path = listItems[i].getBindingContext("json")
									.getPath();

							if (listItems[i].getSelected()) {
								selectAll = false;

								aItemPaths.push(path);
							}

							if (selectAll) {
								aAllPaths.push(path);
							}
						}

						if (selectAll) {
							aItemPaths = aAllPaths;
						}

						return aItemPaths;
					},

					refreshDetailTitle : function() {
						this._setDetailTitel(null, null, {
							context : this.oModelHandler.getFirstSectionText()
						});
					},

					_setDetailTitel : function(channelId, eventId, data) {
						if (data.context === "") {
							data.context = this._get_i18n_Text("DETAIL_TITLE");
						}
						this.oHeaderFooterOptions.sDetailTitle = data.context;
						this.setHeaderFooterOptions(this.oHeaderFooterOptions);
					},

					/***********************************************************
					 * Common Dialog functions
					 **********************************************************/

					/**
					 * Open a dialog with a specific fragmentName. If the dialog
					 * was not already create, a new instance is built.
					 * 
					 * @param oDialog
					 * @param sFragmentName
					 * @param oModel
					 * @param sBindingPath
					 * @param oFilter
					 * @returns
					 */
					openDialog : function(oDialog, sFragmentName, oModel,
							sBindingPath, bGrowing, oFilter) {
						oDialog = this.getDialog(oDialog, sFragmentName);

						if (bGrowing) {
							// TODO: This is a Workaround because the growing
							// options are not exposed to the SelectDialog.
							// This will be implemented by the core team
							// directly in the select dialog
							oDialog._list.setGrowing(true);
							oDialog._list.setGrowingScrollToLoad(true);
							oDialog._list.setGrowingThreshold(20);
						}

						this.bindAggregation(oDialog, sBindingPath, oFilter);

						// It is important to set all binding, filter and
						// sorting informations before this call will be
						// executed
						oDialog.setModel(this.getView().getModel());
						oDialog.setModel(this.getView().getModel("i18n"),
								"i18n");
						oDialog.setModel(oModel, "model");

						if (oFilter) {
							oDialog.open(oFilter.oValue1);
						} else {
							oDialog.open();
						}

						return oDialog;
					},

					/**
					 * Get dialog. If the dialog does not exist, it will be
					 * created by given fragment name
					 * 
					 * @param oDialog
					 * @param sFragmentName
					 * @returns
					 */
					getDialog : function(oDialog, sFragmentName) {
						if (!oDialog) {
							oDialog = sap.ui.xmlfragment(sFragmentName, this);
						}

						return oDialog;
					},

					/**
					 * Set the binding path and the filter and triggers a
					 * reloading
					 * 
					 * @param oDialog
					 * @param sBindingPath
					 * @param oFilter
					 */
					bindAggregation : function(oDialog, sBindingPath, oFilter) {
						var aFilters = [];

						if (oFilter) {
							aFilters.push(oFilter);
						}

						if (sBindingPath) {
							oDialog
									.bindAggregation(
											"items",
											{
												path : sBindingPath,
												template : oDialog
														.getBindingInfo("items").template,
												filters : aFilters
											});
						} else {
							if (aFilters.length > 0) {
								oDialog.getBinding("items").filter(aFilters);
							}
						}
					},

					/**
					 * Creates an entry (with the parameters in the object
					 * oEntry) for the given binding path and the model of the
					 * current view
					 * 
					 * @param oEntry
					 * @param bindingPath
					 */
					createEntry : function(oEntry, bindingPath) {
						var that = this;
						var oModel = this.getView().getModel();

						jQuery.sap.require("sap.m.MessageToast");
						var messageText = this
								._get_i18n_Text("MSG_CREATION_OBJECT_SUCCESS"); // 'Entry
																				// created
																				// successfully!';

						if (bindingPath === "/Appointments") {
							messageText = this
									._get_i18n_Text("MSG_UPDATING_APPOINTMENT_SUCCESS"); // 'Appointment
																							// created
																							// successfully!';
						} else {
							if (bindingPath === "/Tasks") {
								messageText = this
										._get_i18n_Text("MSG_UPDATING_TASK_SUCCESS"); // 'Task
																						// created
																						// successfully!';
							}
						}

						oModel
								.create(
										bindingPath,
										oEntry,
										null,
										function() {
											// console.log('Entry created
											// successfully!');
											sap.m.MessageToast
													.show(messageText);

										},
										jQuery
												.proxy(function() {
													// sap.ca.ui.message.showMessageBox({
													// type:
													// sap.ca.ui.message.Type.ERROR,
													// message:
													// that._get_i18n_Text("MSG_CREATION_OBJECT_FAILED"),
													// details:
													// that._get_i18n_Text("MSG_LONG_CREATION_OBJECT_FAILED")
													// });
													sap.m.MessageToast
															.show(that
																	._get_i18n_Text("MSG_CREATION_OBJECT_FAILED"));
												}));

						oModel.refresh();
					},

					/**
					 * Run a search by a given filter name on a select dialog
					 * 
					 * @param oDialog
					 * @param sFilterName
					 */
					doSelectDialogSearch : function(oDialog, sFilterName) {
						var sSearchValue = oDialog._searchField
								.getProperty("value");
						var oIdFilter = new sap.ui.model.Filter(sFilterName,
								sap.ui.model.FilterOperator.Contains,
								sSearchValue);
						oDialog.getBinding("items").filter([ oIdFilter ]);
					},

					/**
					 * Update a property of the local json model "model"
					 * 
					 * @param oDialog
					 * @param sPropertyName
					 * @param sPropertyValue
					 */
					updateProperty : function(oDialog, sPropertyName,
							sPropertyValue) {
						if (oDialog) {
							var oModel = oDialog.getModel('model');
							oModel.setProperty(sPropertyName, sPropertyValue);
							oDialog.setModel(oModel, 'model');
						}
					},

					/***********************************************************
					 * Controller functions for the Network Error Dialog
					 **********************************************************/

					openNetworkErrorDialog : function(sErrorMessage) {
						// show the erorr message in a MessageBox
						sap.ca.ui.message.showMessageBox({
							type : sap.ca.ui.message.Type.ERROR,
							message : this._get_i18n_Text("NETWORK_ERROR_MSG"),
							details : sErrorMessage
						}, jQuery.proxy(this.okNetworkErrorDialog, this));
					},

					okNetworkErrorDialog : function(oEvent) {
						var that = this;
						var fnSuccess = jQuery
								.proxy(function() {
									sap.m.MessageToast
											.show(
													that
															._get_i18n_Text("MSG_SYNCHRONIZATION_SUCCEEDED"),
													{
														at : sap.ui.core.Popup.Dock.CenterCenter
													});
								});

						this.oModelHandler.retryBatchOperations(fnSuccess);
					},

					/***********************************************************
					 * Controller functions for the Exception Dialog
					 **********************************************************/

					openExceptionDialog : function(sErrorMessage) {
						// show the erorr message in a MessageBox
						sap.ca.ui.message.showMessageBox({
							type : sap.ca.ui.message.Type.ERROR,
							message : this
									._get_i18n_Text("EXCEPTION_ERROR_MSG"),
							details : sErrorMessage
						}, jQuery.proxy(this.okExceptionDialog, this));
					},

					okExceptionDialog : function(oEvent) {
						var that = this;
						var fnSuccess = jQuery.proxy(function() {
							sap.m.MessageToast.show(that
									._get_i18n_Text("MSG_CHANGES_DISCARDED"), {
								at : sap.ui.core.Popup.Dock.CenterCenter
							});
						});

						this.oModelHandler.discardBatchOperations(fnSuccess);
					},

					/***********************************************************
					 * Controller functions for fragment
					 * AddToDialog.fragment.xml
					 **********************************************************/

					openAddToDialog : function(oEvent) {
						this.getView().getModel().setCountSupported(true); // no
																			// inlinecount
																			// supported
						var oModel = new sap.ui.model.json.JSONModel();
						var oData = {
							text : this._getSelectedText()
						};
						oModel.setData(oData);

						this.oAddToDialog = this.openDialog(this.oAddToDialog,
								"cus.crm.notes.view.AddToDialog", oModel);
					},

					getOpportunityList : function() {
						return sap.ui.getCore().byId("opportunityList");
					},

					doSearchOpportunity : function(oEvent) {
						var sFilterPattern = oEvent.getParameters().query;
						var oBinding = this.getOpportunityList().getBinding(
								"items");
						var oDescriptionFilter = new sap.ui.model.Filter(
								"Description",
								sap.ui.model.FilterOperator.Contains,
								sFilterPattern);
						var aFilters = [ oDescriptionFilter ];
						oBinding.filter(aFilters);
					},

					cancelAddToDialog : function(oEvent) {
						// TODO Show data loss popup
						this.closeAddToDialog();
					},

					closeAddToDialog : function() {
						this.oAddToDialog.close();
						this.oAddToDialog.destroy();
						this.oAddToDialog = undefined;
						this.getView().getModel().setCountSupported(false); // reset
					},

					navigateToOpportunities : function(oEvent) {
						var navContainer = this.oAddToDialog.getContent()[0];
						navContainer.to("page2", "slide",
								oEvent.getSource().getBindingContext());
					},

					navigateFromOpportunities : function(oEvent) {
						var navContainer = this.oAddToDialog.getContent()[0];
						navContainer.back(oEvent.getSource().getBindingContext());
					},

					triggerOkButtonVisibility : function(oEvent) {

						if (oEvent.getParameter('fromId') == 'page2') {
							this.oAddToDialog.destroyBeginButton();
						} else {
							this.oAddToDialog.setBeginButton(new sap.m.Button({
								text : this._get_i18n_Text('ADD_TO_OK'),
								enabled: false,
							    press : jQuery.proxy(function() {
									this.okAddToDialog();
								}, this)
							}));
						}
					},

					handleOpportunityPress : function(oEvent) {
						var isSelected = oEvent.getSource().getSelected();
						oEvent.getSource().setSelected(!isSelected);
						
						if(isSelected == false)
							{
							this.oAddToDialog.getBeginButton().setEnabled(true);
							}else{
								this.oAddToDialog.getBeginButton().setEnabled(false);
							};
					},

					okAddToDialog : function(oEvent) {
						var oModel = this.getView().getModel();
						var oParams = null;
						var oEntry = null;
						var that = this;
						var oOpportunityList = this.getOpportunityList();
						var aSelectedItems = oOpportunityList
								.getSelectedItems();

						for ( var i = 0; i < aSelectedItems.length; i++) {
							oParams = {
								fnSuccess : jQuery
										.proxy(function() {
											sap.m.MessageToast
													.show(that
															._get_i18n_Text(
																	"MSG_UPDATING_OPPORTUNITY_SUCCEEDED")
															.replace(
																	"{0}",
																	aSelectedItems[i]
																			.getProperty("title")));
										}),
								fnError : jQuery
										.proxy(function() {
											sap.m.MessageToast
													.show(that
															._get_i18n_Text(
																	"MSG_UPDATING_OPPORTUNITY_FAILED")
															.replace(
																	"{0}",
																	aSelectedItems[i]
																			.getProperty("title")));
										})
							};

							oEntry = {
								Guid : aSelectedItems[i].getBindingContext()
										.getProperty('Guid'),
								Content : this.oAddToDialog.getModel('model')
										.getData().text
							};

							oModel.update(aSelectedItems[i].getBindingContext()
									.getPath(), oEntry, oParams);
						}

						this.closeAddToDialog();
					},

					/***********************************************************
					 * Controller functions for fragment
					 * AccountSelectDialog.fragment.xml
					 **********************************************************/

					displayAccounts : function(oEvent) {
						var oModel = oEvent.getSource().getModel('model');
						var accountName = oModel.getData().accountName;
						var oFilter = null;
						var sBindingPath = "/AccountCollection";

						if (accountName) {
							oFilter = new sap.ui.model.Filter("name1",
									sap.ui.model.FilterOperator.Contains,
									accountName);
						}

						this.oAccountSelectDialog = this.openDialog(
								this.oAccountSelectDialog,
								"cus.crm.notes.view.AccountSelectDialog",
								oModel, sBindingPath, true, oFilter);
					},

					doSearchAccount : function(oEvent) {
						this.doSelectDialogSearch(oEvent.getSource(), "name1");
					},

					selectAccount : function(oEvent) {
						var oDialog = null;

						if (this.oCreateAppointmentDialog
								&& this.oCreateAppointmentDialog.isOpen())
							oDialog = this.oCreateAppointmentDialog;
						else if (this.oCreateTaskDialog
								&& this.oCreateTaskDialog.isOpen())
							oDialog = this.oCreateTaskDialog;

						if (oDialog) {
							if (oEvent.getParameter("selectedItem").data("id") != oDialog
									.getModel('model').getData().accountId) {
								// Account has changed -> Delete Contact
								this.updateProperty(oDialog, "/contactEntered",
										false);
								this.updateProperty(oDialog, "/contactId", "");
								this
										.updateProperty(oDialog,
												"/contactName", "");
							}
							;

							var horizontalLayoutId = '#accountHorizontalLayout'
									+ oDialog.getModel('model').getData().id;
							cus.crm.notes.util.DomHelper.replaceCssClassById(
									horizontalLayoutId, 'customSelectField',
									'customSelectFieldRemoveIcon');
							this.updateProperty(oDialog, "/accountEntered",
									true);
							this.updateProperty(oDialog, "/accountId", oEvent
									.getParameter("selectedItem").data("id"));
							this.updateProperty(oDialog, "/accountName", oEvent
									.getParameter("selectedItem").getProperty(
											'title'));

							oDialog.getModel('model').refresh();
						}
					},

					deleteAccount : function(oEvent) {
						var oDialog = null;

						if (this.oCreateAppointmentDialog
								&& this.oCreateAppointmentDialog.isOpen())
							oDialog = this.oCreateAppointmentDialog;
						else if (this.oCreateTaskDialog
								&& this.oCreateTaskDialog.isOpen())
							oDialog = this.oCreateTaskDialog;

						if (oDialog) {

							var horizontalLayoutId = '#accountHorizontalLayout'
									+ oDialog.getModel('model').getData().id;
							cus.crm.notes.util.DomHelper.replaceCssClassById(
									horizontalLayoutId,
									'customSelectFieldRemoveIcon',
									'customSelectField');
							this.updateProperty(oDialog, "/accountEntered",
									false);
							this.updateProperty(oDialog, "/accountId", "");
							this.updateProperty(oDialog, "/accountName", "");

							// No account => No contact
							var contactHorizontalLayoutId = '#contactHorizontalLayout'
									+ oDialog.getModel('model').getData().id;
							cus.crm.notes.util.DomHelper.replaceCssClassById(
									contactHorizontalLayoutId,
									'customSelectFieldRemoveIcon',
									'customSelectField');
							this.updateProperty(oDialog, "/contactEntered",
									false);
							this.updateProperty(oDialog, "/contactId", "");
							this.updateProperty(oDialog, "/contactName", "");

							oDialog.getModel('model').refresh();
						}
					},

					/***********************************************************
					 * Controller functions for fragment
					 * ContactSelectDialog.fragment.xml
					 **********************************************************/

					displayContacts : function(oEvent) {
						var oModel = oEvent.getSource().getModel('model');
						var accountId = oModel.getData().accountId;
						var accountName = oModel.getData().accountName;
						var contactName = oModel.getData().contactName;
						var oFilter = null;
						var sBindingPath = null;
						var showInfoToolbar = false;

						// Filter the contact data by account id - don't bind
						// path if empty string
						if (accountId && accountId !== "") {
							sBindingPath = "/AccountCollection('" + accountId
									+ "')/Contacts";
							showInfoToolbar = true;
						} else {
							sBindingPath = "/ContactCollection";
						}

						if (contactName) {
							oFilter = new sap.ui.model.Filter("lastName",
									sap.ui.model.FilterOperator.Contains,
									contactName);
						}

						this.oContactSelectDialog = this.openDialog(
								this.oContactSelectDialog,
								"cus.crm.notes.view.ContactSelectDialog",
								oModel, sBindingPath, true, oFilter);

						// TODO: Unfortunately it is not possible to add this
						// toolbar directly in the SelectDialog (in the XML
						// fragment),
						// because there is no Getter/Setter for the Toolbar
						// object in the SelectDialog
						this.oContactSelectDialog._list
								.setInfoToolbar(new sap.m.Toolbar(
										{
											visible : showInfoToolbar,
											active : true,
											content : [ new sap.m.Label(
													{
														text : this
																._get_i18n_Text("CONTACT_SEARCH_FILTERED")
																+ ": "
																+ accountName
													})
											// We don't want to be able to
											// remove the filter on the contact
											// view once an account has been
											// entered.
											/*
											 * , new sap.m.ToolbarSpacer(), new
											 * sap.ui.core.Icon({ src :
											 * "sap-icon://decline" })
											 */
											]
										/*
										 * , press : this.removeContactFilter
										 */}));
					},

					removeContactFilter : function(oEvent) {
						oEvent.getSource().setVisible(false);

						// if the toolbar creation is moved to the XML, this
						// coding can be replaced by the function usage
						// this.setBindingPath
						oEvent.getSource().getParent().bindAggregation("items", {
							path : "/ContactCollection",
							template : oEvent.getSource().getParent()
									.getBindingInfo("items").template,
							filters : oEvent.getSource().getParent()
									.getBindingInfo("items").filters
						});
					},

					doSearchContact : function(oEvent) {
						this.doSelectDialogSearch(oEvent.getSource(),
								"lastName");
					},

					selectContact : function(oEvent) {
						var oDialog = null;

						if (this.oCreateAppointmentDialog
								&& this.oCreateAppointmentDialog.isOpen())
							oDialog = this.oCreateAppointmentDialog;
						else if (this.oCreateTaskDialog
								&& this.oCreateTaskDialog.isOpen())
							oDialog = this.oCreateTaskDialog;

						if (oDialog) {
							var horizontalLayoutId = '#contactHorizontalLayout'
									+ oDialog.getModel('model').getData().id;
							cus.crm.notes.util.DomHelper.replaceCssClassById(
									horizontalLayoutId, 'customSelectField',
									'customSelectFieldRemoveIcon');
							this.updateProperty(oDialog, "/contactEntered",
									true);
							this.updateProperty(oDialog, "/contactId", oEvent
									.getParameter("selectedItem").data("id"));
							this.updateProperty(oDialog, "/contactName", oEvent
									.getParameter("selectedItem").getProperty(
											'title'));

							if (oDialog.getModel('model').getData().accountId == null
									|| oDialog.getModel('model').getData().accountId == "") {
								this.updateProperty(oDialog,
										"/accountFieldWidth", "22rem");
								this.updateProperty(oDialog, "/accountEntered",
										true);
								this.updateProperty(oDialog, "/accountId",
										oEvent.getParameter("selectedItem")
												.data("accountId"));
								this.updateProperty(oDialog, "/accountName",
										oEvent.getParameter("selectedItem")
												.data("accountName"));
							}

							oDialog.getModel('model').refresh();
						}
					},

					deleteContact : function(oEvent) {
						var oDialog = null;

						if (this.oCreateAppointmentDialog
								&& this.oCreateAppointmentDialog.isOpen())
							oDialog = this.oCreateAppointmentDialog;
						else if (this.oCreateTaskDialog
								&& this.oCreateTaskDialog.isOpen())
							oDialog = this.oCreateTaskDialog;

						if (oDialog) {
							var horizontalLayoutId = '#contactHorizontalLayout'
									+ oDialog.getModel('model').getData().id;
							cus.crm.notes.util.DomHelper.replaceCssClassById(
									horizontalLayoutId,
									'customSelectFieldRemoveIcon',
									'customSelectField');
							this.updateProperty(oDialog, "/contactEntered",
									false);
							this.updateProperty(oDialog, "/contactId", "");
							this.updateProperty(oDialog, "/contactName", "");

							oDialog.getModel('model').refresh();
						}
					},

					/***********************************************************
					 * Controller functions for section attachment upload
					 **********************************************************/

					handleSectionAddPicture : function(oEvent) {
						var list = this.getView().byId("sectionList");
						var listItems = list.getItems();
						var sUploadUrl = null;
						var path = null;
						var sectionSelected = 0;

						// Loop over all sections and check if section has been
						// checked
						for ( var i = 0; i < listItems.length; i++) {
							if (listItems[i].getSelected()) {
								sectionSelected++;
								path = listItems[i].getBindingContext("json")
										.getPath();
								sUploadUrl = this.oModelHandler
										.getSectionAttachmentUploadUrl(path);
							}
						}

						if (sectionSelected === 0) {
							// No section has been selected or this simply no
							// section
							// TODO Create new section (directly with the
							// attachment or upload the attachment after the
							// creation)
						} else if (sectionSelected === 1) {
							this.uploadFile(sUploadUrl);
						} else {
							sap.ca.ui.message
									.showMessageBox({
										type : sap.ca.ui.message.Type.ERROR,
										message : this
												._get_i18n_Text("MSG_SELECT_ONE_SECTION")
									// ,details: sErrorMessage
									});
						}

					},

					/**
					 * Upload the file from the hidden input field to the given
					 */
					uploadFile : function(sUploadUrl) {
						var sHiddenInputFieldId = this.getView().getId()
								+ '--addPicture' + '-capture';
						var oHiddenInputField = jQuery("#"
								+ sHiddenInputFieldId);

						// Set the upload url in the fileupload input field
						oHiddenInputField.fileupload({
							multipart : false,
							url : sUploadUrl,
							type : "PUT",
							add : jQuery.proxy(function(e, data) {
								this.onAdd(e, data);
							}, this),
							done : jQuery.proxy(function(e, data) {
								this.uploadDone(e, data);
							}, this),
							fail : jQuery.proxy(function(e, data) {
								this.handleUploadFailure(e, data);
							}, this),
							beforeSend : jQuery.proxy(function(xhr, data) {
								// allow consumer to handle before file upload
								// in case they want to set custom headers based
								// on file info
								// this.fireBeforeUploadFile(data.files[0]);
								this._setRequestHeaders(xhr);
							}, this)
						});

						// Fire click event on the fileupload input field to
						// upload the attachment
						jQuery.sap.domById(sHiddenInputFieldId).click();
					},

					/***********************************************************
					 * Controller functions for image upload
					 **********************************************************/

					onAfterRendering : function(oEvt) {
						// var sId =
						// '#'+this.getView().getId()+'--addPicture-capture';
						// jQuery(sId).focusin(function(evt) {
						// $(sId).click();
						// //release the focus
						// $(sId).blur();
						// });
						// var that = this;
						// console.error('aaaa');
						// setTimeout(function() {
						// sectionList = that._oSectionList;
						// that._oSectionList.invalidate();
						// },10);
					},

					/**
					 * set common request headers
					 */
					_setRequestHeaders : function(xhr) {

						xhr.setRequestHeader("Accept", "application/json");

						if (this.getXsrfToken()) {
							xhr.setRequestHeader('x-csrf-token', this
									.getXsrfToken());
						}
					},

					/**
					 * gets the Xsrf token if it exists, if not, request it
					 * explicitly
					 */
					getXsrfToken : function() {
						var sToken = this.getView().getModel().getHeaders()['x-csrf-token'];
						if (!sToken) {

							this
									.getView()
									.getModel()
									.refreshSecurityToken(
											function(e, o) {
												sToken = o.headers['x-csrf-token'];
											},
											function() {
												sap.ca.ui.message
														.showMessageBox({
															type : sap.ca.ui.message.Type.ERROR,
															message : 'Could not get XSRF token',
															details : ''
														});
											}, false);
						}
						return sToken;
					},

					/**
					 * Handles error uploading pictures
					 * 
					 * @param e
					 * @param data
					 */
					handleUploadFailure : function(e, data) {
					},

					/**
					 * Execute before upload a picture to the server
					 * 
					 * @param e
					 * @param data
					 */
					onAdd : function(e, data) {
						data.submit();
					},

					/**
					 * Executes when the upload is finish
					 * 
					 * @param e
					 * @param data
					 */
					uploadDone : function(e, data) {
						this.oModelHandler.readSections();
					},
		
					_saveETag : function(sETag){
						this.sETag = sETag;
					}

				});
