/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.mytimesheet.utils.ConnectionHelper");
jQuery.sap.require("sap.ui.model.odata.datajs");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("hcm.emp.mytimesheet.utils.PerfUtils");
jQuery.sap.require("sap.ui.base.EventProvider");
jQuery.sap.require("hcm.emp.mytimesheet.utils.InitialConfigHelper");
jQuery.sap.require("sap.ca.ui.utils.busydialog");


// code form descriptor.js has been put here as this is not available in wave 2

sap.ui.base.EventProvider
		.extend(
				"hcm.emp.mytimesheet.Service",
				{
					metadata : {
						publicMethods : [ "getModel", "getGeneralParameters",
								"getSpendingDataByHierarhyNodesAndPeriod",
								"getGenericLineItemsByHierNodesAndPeriod",
								"getTrendDataByHierarchyNodes", "setBundle" ]
					},
					constructor : function() {
						this._nCounter = 0;
						//this._busyDialog = new sap.m.BusyDialog();
					},

					_initialize : function(appController) {
						if (!this.oApplication) {
							this.oApplication = appController.oApplicationFacade.oApplicationImplementation;
							this.oConfiguration = new hcm.emp.mytimesheet.utils.InitialConfigHelper();
							this.oConnectionManager = appController.oApplication
									.getConnectionManager();
						}

						if (!this.oBundle) {
							// this.setBundle(this.oApplication.getResourceBundle());
							this.oBundle = appController.oApplicationFacade.oApplicationImplementation.getResourceBundle();
						}
						this.oConfiguration.setResourceBundle(this.oBundle);
						//var serviceName = this.oConfiguration.getServiceList()[0].name;
						//this.oDataModel = this.oConnectionManager.modelList[serviceName];
						this.oDataModel = this.oConnectionManager.getModel();
						this.oDataModel
								.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
					},

					processError : function(oError) {
						var message = "";
						var messageDetails = "";
						if (oError.response) {
							// initially take status text as a general message
							message = oError.response.statusText;
							var body = oError.response.body;
							// look for message title in
							// message":{"lang":"en","value":"User SEQUEIRAC
							// does not exist in this period"} format
							var indexValue = body.indexOf("value");
							var indexValueEnd = body.substring(indexValue)
									.indexOf("}");
							if (indexValueEnd > -1) {
								message = body.substring(indexValue + 8,
										indexValue + indexValueEnd - 1);
							}
							// look for message details in
							// "errordetails":[{"code":"5A/359","message":"User
							// SEQUEIRAC does not exist in this
							// period","propertyref":"","severity":"error"}]}
							// format
							var indexErr = body.indexOf("errordetails");
							var indexStart = body.substring(indexErr).indexOf(
									"message");
							var indexEnd = body
									.substring(indexErr + indexStart).indexOf(
											",");
							if (indexEnd > -1) {
								messageDetails = body.substring(indexErr
										+ indexStart + 10, indexErr
										+ indexStart + indexEnd - 1);
							}
						}
												
						var oMessage = {
								message : message,
								details : messageDetails,
								type : sap.ca.ui.message.Type.ERROR
							};
							
							
							  sap.ca.ui.message.showMessageBox({
			                       type: oMessage.type,
			                       message: oMessage.message,
			                       details: oMessage.details
			                   });
						
						
						
						
					},

					getWorkDays : function(appController,begda, endda, fSuccess) {
						this.showBusy();
						var self = this;
						if (jQuery.sap.getUriParameters().get("responderOn")) {
							var jsonModel = new sap.ui.model.json.JSONModel();
							jsonModel.loadData("resources/model/workdays.json",
									{}, false);
							var items = jsonModel.getData();
							var newItems = [];
							// we only want to have fake data for the dates in
							// the request
							for ( var i = 0; i < items.length; i++) {
								if (items[i].date >= begda
										&& items[i].date <= endda) {
									newItems.push(items[i]);
								}
							}
							fSuccess(newItems);
							self.hideBusy();
						}

						else {
							this._initialize(appController);

							jQuery.sap.measure
									.start(hcm.emp.mytimesheet.utils.PerfUtils
											.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_WORK_DAYS));
							this.oDataModel
									.read(
											"/WorkCalendars",
											null,
											[ "$filter=StartDate eq '" + begda
													+ "' and EndDate eq '"
													+ endda + "'" ],
											true,
											function(oData, oResponse) {

												// mainModel.oHeaders =
												// oResponse.headers["x-csrf-token"];
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_WORK_DAYS));
												fSuccess(oData.results);
												self.hideBusy();
											},
											function(oError) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_PROJECT_SUMMARY));
												self.hideBusy(true);
												self.processError(oError);
											});
						}
					},
					// method not called
/*					getProjectSummary : function(begda, endda, fSuccess) {
						this.showBusy();
						var self = this;
						if (jQuery.sap.getUriParameters().get("responderOn")) {
							var jsonModel = new sap.ui.model.json.JSONModel();
							jsonModel.loadData(
									"resources/model/projectsummary.json", {},
									false);
							fSuccess(jsonModel.getData());
							self.hideBusy();
						}

						else {
							this._initialize(appController);
							jQuery.sap.measure
									.start(hcm.emp.mytimesheet.utils.PerfUtils
											.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_PROJECT_SUMMARY));
							this.oDataModel
									.read(
											"/ProjectSummaries",
											null,
											[ "$filter=StartDate eq '" + begda
													+ "' and EndDate eq '"
													+ endda + "'" ],
											true,
											function(oData) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_PROJECT_SUMMARY));
												fSuccess(oData.results);
												self.hideBusy();
											},
											function(oError) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_PROJECT_SUMMARY));
												self.hideBusy(true);
												self.processError(oError);
											});
						}
					},*/

					getWorkListCollection : function(appController,begda, endda, fSuccess) {
						this.showBusy();
						var self = this;
						if (jQuery.sap.getUriParameters().get("responderOn")) {
							var jsonModel = new sap.ui.model.json.JSONModel();
							jsonModel.loadData("resources/model/worklist.json",
									{}, false);
							var items = jsonModel.getData();
							var newItems = [];
							// we only want to have fake data for the dates in
							// the request
							for ( var i = 0; i < items.length; i++) {
								if (items[i].WorkDate >= begda
										&& items[i].WorkDate <= endda) {
									newItems.push(items[i]);
								}
							}
							fSuccess(newItems);
							self.hideBusy();
						} else {
							this._initialize(appController);
							jQuery.sap.measure
									.start(hcm.emp.mytimesheet.utils.PerfUtils
											.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_PROJECT_SUMMARY));
							this.oDataModel
									.read(
											"/TimeDataList",
											null,
											[ "$filter=StartDate eq '" + begda
													+ "' and EndDate eq '"
													+ endda + "'" ],
											true,
											function(oData) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_WORKLIST_COLLECTION));
												for(var i=0;i<oData.results.length;i++){
													oData.results[i].Level=oData.results[i].Level.toString().trim();
												}
												fSuccess(oData.results);
												self.hideBusy();

											},
											function(oError) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_WORKLIST_COLLECTION));
												self.hideBusy(true);
												self.processError(oError);
											});
						}
					},

					getCostAssignmentWorkListCollection : function(appController,  begDa, endDa, fSuccess) {
						this.showBusy();
						var self = this;
						if (jQuery.sap.getUriParameters().get("responderOn")) {
							var jsonModel = new sap.ui.model.json.JSONModel();
							jsonModel
									.loadData(
											"resources/model/CostAssignmentWorkList.json",
											{}, false);
							fSuccess(jsonModel.getData());
							self.hideBusy();
						} else {
							this._initialize(appController);
							jQuery.sap.measure
									.start(hcm.emp.mytimesheet.utils.PerfUtils
											.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_PROJECT_SUMMARY));
							this.oDataModel
									.read(
											"/WorkListCollection",
											null,
											[ "$filter=StartDate eq '" + begDa + "' and EndDate eq '"
												+ endDa + "'" ],
											true,
											function(oData) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_COST_ASSIGNMENT_WORKLIST_COLLECTION));
												for(var i=0;i<oData.results.length;i++){
													oData.results[i].Level=oData.results[i].Level.toString().trim();
												}
												fSuccess(oData.results);
												self.hideBusy();
											},
											function(oError) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_COST_ASSIGNMENT_WORKLIST_COLLECTION));
												self.hideBusy(true);
												self.processError(oError);
											});
						}
					},

					getCostAssignmentWorkListTypeCollection : function(appController,fSuccess) {
						this.showBusy();
						var self = this;
						if (jQuery.sap.getUriParameters().get("responderOn")) {
							var jsonModel = new sap.ui.model.json.JSONModel();
							jsonModel
									.loadData(
											"resources/model/CostAssignmentWorkListType.json",
											{}, false);
							fSuccess(jsonModel.getData());
							self.hideBusy();
						} else {
							this._initialize(appController);
							jQuery.sap.measure
									.start(hcm.emp.mytimesheet.utils.PerfUtils
											.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_PROJECT_SUMMARY));
							this.oDataModel
									.read(
											"/ProfileFields",
											null,
											[],
											true,
											function(oData) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_COST_ASSIGNMENT_WORKLIST_TYPE_COLLECTION));
												fSuccess(oData.results);
												self.hideBusy();
											},
											function(oError) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_COST_ASSIGNMENT_WORKLIST_TYPE_COLLECTION));
												self.hideBusy(true);
												self.processError(oError);
											});
						}
					},

					getCostAssignmentTypeListCollection : function(fieldName,
							top, skip, searchString, fieldRelated, begDa, endDa, fSuccess) {
						this.showBusy();
						var self = this;
						if (jQuery.sap.getUriParameters().get("responderOn")) {
							var jsonModel = new sap.ui.model.json.JSONModel();
							jsonModel
									.loadData(
											"resources/model/CostAssignmentTypeList.json",
											{}, false);
							fSuccess(jsonModel.getData());
							self.hideBusy();
						} else {
							var queryString = [ "$filter=FieldName eq '"
									+ fieldName + "'" ];
							queryString[0] += " and StartDate eq '" + encodeURIComponent(begDa) + "'"+" and EndDate eq '" + encodeURIComponent(endDa) + "' ";//adding begin and end dates to the filter
							
							if (searchString) {
								queryString[0] += "and substringof('"
										+ encodeURIComponent(searchString)
										+ "',FieldValue)";
							}
							//NOTE related input help
							if(fieldRelated){
                                queryString[0] += "and FieldRelated eq '" + encodeURIComponent(fieldRelated) + "'";
                        }
							//End of NOTE related input help
							queryString[0] += "&$top=" + top + "&$skip=" + skip;
							this._initialize();

							jQuery.sap.measure
									.start(hcm.emp.mytimesheet.utils.PerfUtils
											.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_WORK_DAYS));
							this.oDataModel
									.read(
											"/ValueHelpList",
											null,
											queryString,
											true,
											function(oData) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_COST_ASSIGNMENT_TYPE_LIST_COLLECTION));
												fSuccess(oData.results);
												self.hideBusy();
											},
											function(oError) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_COST_ASSIGNMENT_TYPE_LIST_COLLECTION));
												self.hideBusy(true);
												self.processError(oError);
											});
						}
					},

					getInitialInfos : function(appController,begda, endda, fSuccess) {
						if (jQuery.sap.getUriParameters().get("responderOn")) {
							var jsonModel = new sap.ui.model.json.JSONModel();
							jsonModel.loadData(
									"resources/model/InitialInfos.json", {},
									false);
							fSuccess(jsonModel.getData());
						}

						else {
							this._initialize(appController);
							var self = this;
							jQuery.sap.measure
									.start(hcm.emp.mytimesheet.utils.PerfUtils
											.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_WORK_DAYS));
							this.oDataModel
									.read(
											"/InitialInfos",
											null,
											[ "$filter=StartDate eq '" + begda
													+ "' and EndDate eq '"
													+ endda + "'" ],
											false,
											function(oData) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_INITIAL_INFOS));
												var data = oData.results[0];
												if (data) {
													
													var initialInfoModel = new sap.ui.model.json.JSONModel(
															{
																newItemCount : self.oBundle.getText(
																		'MISSING_DAYS', [ 0 ]),
																//itemCount : missingDays,
																showBusyIndicator : false,
																modellingName:"initialInfoModel"
															});

													initialInfoModel
															.setProperty(
																	"/quickEntryCounter",
																	data.Counter);// the
																					// quick
																					// entry
																					// counter
																					// is
													// needed when we submit the
													// quick entry
													initialInfoModel
															.setProperty(
																	"/startDate",
																	data.StartDate);
													initialInfoModel
															.setProperty(
																	"/endDate",
																	data.EndDate);
													initialInfoModel
															.setProperty(
																	"/clockEntry",
																	data.ClockEntry == "TRUE");
													initialInfoModel							//Note 1959135: Quantity input field
															.setProperty(
																	"/decimalTimeEntry", true);
													initialInfoModel
															.setProperty(
																	"/allowNonWorkingDays",
																	data.AllowNonWorkingDays == "TRUE");
													initialInfoModel
															.setProperty(
																	"/itemCount",
																	parseInt(data.MissingDays
																			.trim()));
													initialInfoModel
															.setProperty(
																	"/allHours",
																	parseFloat(data.AllHours
																			.trim()));
													initialInfoModel
															.setProperty(
																	"/weekHours",
																	parseFloat(data.WeekHours
																			.trim()));
													initialInfoModel
															.setProperty(
																	"/monthHours",
																	parseFloat(data.MonthHours
																			.trim()));
													//Adding Release Allowed property to the initial info Model
													initialInfoModel
													.setProperty(
															"/releaseAllowed",
															data.ReleaseAllowed == "TRUE");
													
													//NOTE Adding Release Future property to the initial info Model
													initialInfoModel
													.setProperty(
															"/releaseFuture",
															data.ReleaseFuture == "TRUE");
													
													appController.oApplication.setModel(initialInfoModel,"timesheet_initialInfo");
													
												}
												for(var i=0;i<oData.results.length;i++){
													oData.results[i].Level=oData.results[i].Level.toString().trim();
												}
												fSuccess(oData.results);
											},
											function(oError) {
												jQuery.sap.measure
														.end(hcm.emp.mytimesheet.utils.PerfUtils
																.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_INITIAL_INFOS));
												self.processError(oError);
											});
						}
					},

					submitQuickEntry : function(appController,begda, endda, fnSuccess,
							fnFailure) {

						
						this._initialize(appController);
						var mainModel = appController.oApplication.getModel("timesheet_initialInfo");
						var data = {};
						data.EndDate = endda;
						data.StartDate = begda;
						data.Counter = mainModel.getData().quickEntryCounter;
						if (jQuery.sap.getUriParameters().get("responderOn")) {
							fnSuccess();
							return;// no posting with mock data
						}
						this.showBusy();
						var self = this;
						var oModel = this.oDataModel;
						
						 	oModel.refreshSecurityToken(
										function(oData, oResponse) {
											oModel.oHeaders = {
														"x-csrf-token" : oResponse.headers["x-csrf-token"],
														"Accept" : "application/json"
													};
													jQuery.sap.measure.start(hcm.emp.mytimesheet.utils.PerfUtils.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_SUBMIT_QUICK_ENTRY));
											oModel.create(
															"/InitialInfos",
															data,
															null,
															function(oData,
																	oResponse) {
																jQuery.sap.measure
																		.end(hcm.emp.mytimesheet.utils.PerfUtils
																				.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_SUBMIT_QUICK_ENTRY));
																fnSuccess();
																self._initialize();
																self
																		.hideBusy(true);
																sap.m.MessageToast
																		.show(self.oConfiguration
																				.getText("SUBMIT_SUCCESS"));
															},
															function(oError) {
																jQuery.sap.measure
																		.end(hcm.emp.mytimesheet.utils.PerfUtils
																				.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_SUBMIT_QUICK_ENTRY));
																self
																		.hideBusy(true);
																var messageDetails = "";
																if (oError.response) {
																	var body = oError.response.body;
																	var indexErr = body
																			.indexOf("errordetails");
																	var msgs = body
																			.substring(
																					indexErr)
																			.split(
																					"message");
																	for ( var i = 1; i < msgs.length; i++) {
																		var msg = msgs[i];
																		var indexEnd = msg
																				.indexOf(",");
																		if (indexEnd > -1) {
																			messageDetails = messageDetails
																					+ msg
																							.substring(
																									3,
																									indexEnd - 1)
																					+ '\r\n';
																		}
																	}
																}
																/*var bundle = self.oDescriptor
																		.getBundle();*/
																self._initialize(appController);
																var bundle = self.oBundle;
																var oMessage = {
																	message : self.oConfiguration
																			.getText("ERROR_SUBMIT_AUTO_ENTRY"),
																	details : messageDetails,
																	type : sap.ca.ui.message.Type.ERROR
																};
																
																
																  sap.ca.ui.message.showMessageBox({
												                       type: oMessage.type,
												                       message: oMessage.message,
												                       details: oMessage.details
												                   });

																fnFailure();
															});

										}, function(oError) {
											self.hideBusy(true);
											self.processError(oError);
											fnFailure();
										}, true);

					},
					checkSubmittedTime : function(appController,timeEntryCreated,
							timeEntryUpdated, timeEntryDeleted, fnSuccess,
							fnFailure) {
						this.showBusy();
						
						this._initialize(appController);
						var self = this;

						var arrEntry1 = timeEntryCreated
								.concat(timeEntryUpdated);
						var finalEntry = arrEntry1.concat(timeEntryDeleted);
						
						var mainModel = this.oDataModel;
						// keep posts with errors
						this.errors = [];
						this.responseData = [];
							
							mainModel
								.refreshSecurityToken(
										function(oData, oResponse) {
											var str = JSON.stringify(finalEntry);
											var str1 = {
													"checkTimeString":str
													};
											
											mainModel.create("/CheckTimeEntries",str1,null,function(){
												
												fnSuccess();
												self.hideBusy(true);
												
											},function(oData) {
												
												

												   
												if(oData.response){
													
													var message = oData.message;
													  			
													// parse error from response
													var body = oData.response.body;
													var jsonData = JSON.parse(body);
													var jsonDataLength=(jsonData.error.innererror.errordetails.length-1);//last error msg is meaningless for the end user and henced removed
													var errcode="";
													for(var i = 0; i<jsonDataLength;i++){//checking for multiple errors
													
														message=jsonData.error.innererror.errordetails[i].message;
														errcode=jsonData.error.innererror.errordetails[i].code;
													self.errors.push({
														
														code : errcode,
														message : message
													});	
													}
												}

											// after submit release busy icon and call fail functions
												if(oData.response){
											self.hideBusy(true);
											if (self.errors.length > 0) {
												var messageList = "";
												for ( var i = 0; i < self.errors.length; i++) {
													messageList = messageList + self.errors[i].code + ": " + self.errors[i].message + '\r\n';
												}
												var oMessage = {
														message : self.oConfiguration
																.getText("ERROR_SUBMIT"),
														details : messageList,
														type : sap.ca.ui.message.Type.ERROR
													};
													
													sap.ca.ui.message.showMessageBox({
									                       type: oMessage.type,
									                       message: oMessage.message,
									                       details: oMessage.details
									                   });
												fnFailure(self.errors, self.responseData);
											}
												}
										},true);
										
										}, function(oError) {
											//error function for mainModel.refreshSecurityToken
											self.hideBusy(true);
										}, true);

					},

					submitTimeEntry : function(appController,timeEntryCreated,
							timeEntryUpdated, timeEntryDeleted, fnSuccess,
							fnFailure) {
						this.showBusy();
						
						this._initialize(appController);
						var self = this;

						var arrEntry1 = timeEntryCreated
								.concat(timeEntryUpdated);
						var finalEntry = arrEntry1.concat(timeEntryDeleted);
						
						var mainModel = this.oDataModel;
						// keep posts with errors
						this.errors = [];
						this.responseData = [];
							
							mainModel
								.refreshSecurityToken(
										function(oData, oResponse) {
											for ( var i = 0; i < finalEntry.length; i++) {
												self.data = finalEntry[i];
												var batch = mainModel
														.createBatchOperation(
																"/TimeEntries",
																"POST",
																self.data);
												var batchchanges = [];
												batchchanges.push(batch);
												mainModel
														.addBatchChangeOperations(batchchanges);
											}

											mainModel
													.submitBatch(
															function(oData,
																	oResponse,
																	aErrorResponses) {
																for ( var i = 0; i < oData.__batchResponses.length; i++) {

																	if (oData.__batchResponses[i].response) {

																		var message = oData.__batchResponses[i].message;
																		var status;
																		status = oData.__batchResponses[i].response.statusText;
																		// parse
																		// error
																		// from
																		// response
																		var body = oData.__batchResponses[i].response.body;
																		var indexErr = body
																				.indexOf("errordetails");
																		if (indexErr > -1) {
																			var indexMsg = body
																					.substring(
																							indexErr)
																					.indexOf(
																							"message");
																			var indexEnd = body
																					.substring(
																							indexErr
																									+ indexMsg)
																					.indexOf(
																							",");
																			if (indexEnd > -1) {
																				message = body
																						.substring(
																								indexErr
																										+ indexMsg
																										+ 10,
																								indexErr
																										+ indexMsg
																										+ indexEnd
																										- 1);
																			}
																		}

																		self.errors
																				.push({
																					counter : finalEntry[i].Counter,
																					workdate : finalEntry[i].TimeEntryDataFields.WORKDATE,
																					time : finalEntry[i].TimeEntryDataFields.CATSHOURS,
																					message : message
																				});

																	} else if (oData.__batchResponses[i].__changeResponses) {
																		self.responseData
																				.push(oData.__batchResponses[i].__changeResponses[0].data);
																	}

																}

																// after submit release busy icon and call success/fail functions
																self.hideBusy(true);
																
																self._initialize();

																var bundle = self.oBundle;
																if (self.errors.length > 0) {
																	var messageList = "";
																	for ( var i = 0; i < self.errors.length; i++) {
																		var date_str = self.errors[i].workdate;
																		var y = parseInt(
																				date_str
																						.substr(
																								0,
																								4),
																				10);
																		var m = parseInt(
																				date_str
																						.substr(
																								4,
																								2),
																				10) - 1;
																		var d = parseInt(
																				date_str
																						.substr(
																								6,
																								2),
																				10);

																		var dateError = sap.ui.core.format.DateFormat
																				.getDateInstance(
																						{
																							style : "short"
																						})
																				.format(
																						new Date(
																								y,
																								m,
																								d,
																								0,
																								0,
																								0,
																								0));

																		messageList = messageList
																				+ dateError
																				+ ": "
																				+ self.errors[i].message
																				+ '\r\n';
																	}
																	var oMessage = {
																		message : self.oConfiguration
																				.getText("ERROR_SUBMIT"),
																		details : messageList,
																		type : sap.ca.ui.message.Type.ERROR
																	};
																	
																	sap.ca.ui.message.showMessageBox({
													                       type: oMessage.type,
													                       message: oMessage.message,
													                       details: oMessage.details
													                   });

																	fnFailure(
																			self.errors,
																			self.responseData);
																} else {
																	fnSuccess();
																}

															},
															function(oError) {
																//error function for mainModel.submitBatch
																self
																		.hideBusy(true);

															});

										}, function(oError) {
											//error function for mainModel.refreshSecurityToken
											self.hideBusy(true);
										}, true);

					},

					showBusy : function() {
						this._nCounter++;
						if (this._nCounter == 1) {
							//this._busyDialog.open();
						sap.ca.ui.utils.busydialog.requireBusyDialog();

						}
					},

					hideBusy : function(forceHide) {
						if(this._nCounter==0)
							return;
						this._nCounter = forceHide ? 0 : Math.max(0,
								this._nCounter - 1);
						if (this._nCounter > 0) {
							return;
						}
						sap.ca.ui.utils.busydialog.releaseBusyDialog();

						//this._busyDialog.close();
					},

				});
