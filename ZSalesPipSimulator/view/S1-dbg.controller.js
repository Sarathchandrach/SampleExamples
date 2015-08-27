/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ui.core.format.NumberFormat");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseMasterController");
jQuery.sap.require("sap.ca.ui.message.message");

sap.ca.scfld.md.controller.BaseFullscreenController
		.extend(
				"cus.crm.salespipeline.sim.view.S1",
				{
					// Controller Methods - onInit
					onInit : function() {
						sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit
								.call(this);
						this._initControllerVariables();
						this.loadData();
						this._initializeAllControllerFragments();
						var ftCL = this.getView().byId("butChangelog");
						var ftSV = this.getView().byId("butSave");
						var ftRT = this.getView().byId("butReset");
						if (sap.ui.Device.system.phone) {
							ftCL.setIcon("sap-icon://activities");
							ftSV.setIcon("sap-icon://save");
							ftRT.setIcon("sap-icon://undo");
						} else {
							ftCL.setText(this.oBundle
									.getText("BTN_SHOW_CHANGELOG"));
							ftSV.setText(this.oBundle
									.getText("BTN_SAVE_OPPORT"));
							ftRT.setText(this.oBundle.getText("BTN_RESET"));
						}
						if (sap.ui.Device.browser.BROWSER.INTERNET_EXPLORER == sap.ui.Device.browser.name
								&& sap.ui.Device.browser.version < 10) {
							var oSliderLayout = this.getView().byId(
									"hlOppSlider");
							oSliderLayout.removeStyleClass("alignRight");
							oSliderLayout.addStyleClass("alignRightIE9");
						}
						sap.ui.getCore().byId("poPage").addStyleClass(
								"sapUiStdPage");
						this.getView().byId("page").addStyleClass(
								"sapUiStdPage");
						// Changes for no text selection on controls
						this.disableTextSelection();
						window.addEventListener("orientationchange",
								function() {
									if (sap.ui.getCore().byId("po").isOpen())
										sap.ui.getCore().byId("po").close();

								}, false);
					},

					_initControllerVariables : function() {
						this.oDataModel = this.oApplicationFacade
								.getODataModel();
						this.oBundle = this.oApplicationFacade
								.getResourceBundle();
						this.oApplicationFacade.oApplicationImplementation.oCurController.FullCtrl = this;
						this.aChangeablePropsTexts = [
								{
									"property" : "StartDate",
									"displayText" : this.oBundle
											.getText("LBL_OD_STARTDATE")
								},
								{
									"property" : "ClosingDate",
									"displayText" : this.oBundle
											.getText("LBL_OD_ENDDATE")
								},
								{
									"property" : "ExpectedSalesVolume",
									"displayText" : this.oBundle
											.getText("LBL_OD_EXPECTEDREVENUEHEADER")
								},
								{
									"property" : "ForecastRelevance",
									"displayText" : this.oBundle
											.getText("LBL_OD_FORECASTRELEVANCE")
								},
								{
									"property" : "SalesStageCode",
									"displayText" : this.oBundle
											.getText("LBL_OD_SALESSTAGE")
								},
								{
									"property" : "ChanceOfSuccess",
									"displayText" : this.oBundle
											.getText("LBL_OD_CHANCEOFSUCCESS")
								},
								{
									"property" : "UserStatusCode",
									"displayText" : this.oBundle
											.getText("LBL_OD_STATUS")
								} ];

						this._iServiceSchemaVersion = this
								._getServiceSchemaVersion(this.oDataModel,
										"Opportunity");
						this._iServiceVersion = this._getServiceVersion(
								this.oDataModel, "Opportunity");
						this.viewType = {};
						this.iChangeStartDate = 0;
						this.iChangeEndDate = 0;
						this.arrStatusPros = [];
						this.arrStagesPros = [];
						this.ptGroup = {};
						this.reRenderTopNSlider = true;
						this.oNavParams = {
							"toOppApp" : "",
							"toContactApp" : "",
							"toAccountApp" : "",
							"telCall" : "",
							"sendMail" : ""
						};
						this.iChangeCOS = 0;
						this.iChangeExpRev = 0;
						this.oFragmentList = {};
					},

					// Controller Methods - onBeforeRendering
					onBeforeRendering : function() {
						this.defineButtons();
						this.calculateProgress();
					},

					disableTextSelection : function() {
						// View Controls
						this.getView().byId('page').allowTextSelection(false);
						this.getView().byId('objectHeader').allowTextSelection(
								false);

						// Opportunity Popover Details
						sap.ui.getCore().byId('po').allowTextSelection(false);
						// Settings Dialog
						sap.ui.getCore().byId('dlAppSettings')
								.allowTextSelection(false);
						// Salse Target Dialog
						sap.ui.getCore().byId('dlSalesPeriodSet')
								.allowTextSelection(false);
						// Change Log Dialog
						sap.ui.getCore().byId('changeLogDialog')
								.allowTextSelection(false);
						// TOP N Slider
						sap.ui.getCore().byId('popup')
								.allowTextSelection(false);
					},

					// Controller Methods - onExit
					onExit : function() {
						if (this.getView().byId("acButAppS") != undefined)
							this.getView().byId("acButAppS").destroy();
						this._destroyAllControllerFragments();
					},

					getServiceVersion : function() {
						return this._iServiceVersion;
					},

					getServiceSchemaVersion : function() {
						return this._iServiceSchemaVersion;
					},

					_getEntityAnnotation : function(oModel, sAnnotationName,
							sEntityName) {
						// retrieve the metadata of the passed OData model
						var oModelMetadata = oModel.getServiceMetadata();
						// check for proper metadata structure
						if (oModelMetadata
								&& oModelMetadata.dataServices
								&& oModelMetadata.dataServices.schema
								&& oModelMetadata.dataServices.schema.length > 0
								&& oModelMetadata.dataServices.schema[0].entityType) {
							var aEntityTypes = oModelMetadata.dataServices.schema[0].entityType;
							for ( var i = -1, oCurEntity; oCurEntity = aEntityTypes[++i];)
								if (sEntityName === oCurEntity.name
										&& oCurEntity.extensions)
									for ( var j = -1, oCurExtn; oCurExtn = oCurEntity.extensions[++j];)
										if (oCurExtn.name === sAnnotationName)
											return oCurExtn.value;
						}
						return null;
					},

					_getServiceSchemaVersion : function(oModel, sEntityName) {
						var version = this._getEntityAnnotation(oModel,
								"service-schema-version", sEntityName);
						// defaults to initial service schema version (1)
						return (version != null) ? parseInt(version) : 1;
					},

					_getServiceVersion : function(oModel, sEntityName) {
						var version = this._getEntityAnnotation(oModel,
								"service-version", sEntityName);
						// defaults to initial service version (1)
						return (version != null) ? parseInt(version) : 1;
					},

					/*
					 * FIORI WAVE 2 - Branch : Rel - 1.0 START of INITAL
					 * DEVELOPMENT for SimulateSalesPipeline
					 */
					defineButtons : function() {
						var oAppSettings = new sap.m.Button("acButAppS", {
							press : jQuery.proxy(this.selectActSetting, this),
							icon : "sap-icon://settings",
							text : this.oBundle.getText("BTN_APPSETTINGS"),
						});
						if (sap.ui.version < "1.19.0") {
							var oSettingsButton = null;
							var oFB = this.getView().byId("masterFooter");
							oFB.destroyContentLeft();
							oSettingsButton = sap.ushell.services.AppConfiguration
									.getSettingsControl();
							oSettingsButton.setText("").setWidth("");
							oSettingsButton.setMenuItems([ oAppSettings ]);
							oFB.addContentLeft(oSettingsButton);
						} else {
							// API change that is used in UI5 1.19.0 onwards
							sap.ushell.services.AppConfiguration
									.addApplicationSettingsButtons([ oAppSettings ]);
						}
					},

					// Error Handling method for All oData calls
					showErrorMsg : function(oError, isRead) {
						var errorDetails = null, msgShown = null;
						if (oError.response) {
							errorDetails = jQuery
									.parseJSON(oError.response.body).error;
							var msgClassNo = errorDetails.code.split("/");
							if (msgClassNo.length == 2)
								msgShown = errorDetails.message.value;
							else {
								if (isRead)
									msgShown = this.oBundle
											.getText("LBL_FAILEDREAD");
								else
									msgShown = this.oBundle
											.getText("LBL_FAILEDUPDATE");
							}
						} else
							msgShown = oError.message;

						var msg = errorDetails.message.value;
						sap.ca.ui.message.showMessageBox({
							type : sap.ca.ui.message.Type.ERROR,
							message : msgShown,
							details : msg
						});
					},

					// Formatting to display and reverse the changable
					// properties in Change Log
					formatChangeLog : function(name, input, key) {
						var utilForm = cus.crm.salespipeline.sim.util.formatter;
						switch (name) {
						case "StartDate":
							return utilForm.dispCLDate(input);
						case "ClosingDate":
							return utilForm.dispCLDate(input);
						case "ExpectedSalesVolume":
							return utilForm.displayNumbers(input);
						case "ForecastRelevance":
							if (input)
								return true;
							else
								return false;
						case "ChanceOfSuccess":
							return parseFloat(input) + "%";
						case "SalesStageCode":
							for ( var i = 0; i < this.arrStagesPros.length; i++)
								if (this.arrStagesPros[i].guidVal == key) {
									var aStages = this.arrStagesPros[i].Stages;
									for ( var k = 0; k < aStages.length; k++)
										if (input == aStages[k].SalesStageCode) {
											return aStages[k].SalesStageDescription;
											break;
										}
									break;
								}
						case "UserStatusCode":
							for ( var i = 0; i < this.arrStatusPros.length; i++)
								if (this.arrStatusPros[i].HeaderGuid == key) {
									var aStatuses = this.arrStatusPros[i].Statuses;
									for ( var k = 0; k < aStatuses.length; k++)
										if (input == aStatuses[k].UserStatusCode) {
											return aStatuses[k].UserStatusText;
											break;
										}
									break;
								}
						default:
							return input;
						}
					},

					unformatChangeLog : function(name, input, key) {
						var utilForm = cus.crm.salespipeline.sim.util.formatter;
						switch (name) {
						case "StartDate":
							return utilForm.revCLDate(input);
						case "ClosingDate":
							return utilForm.revCLDate(input);
						case "ExpectedSalesVolume":
							return utilForm.reverseNumbers(input);
						case "ForecastRelevance":
							if (input)
								return 'X';
							else
								return ' ';
						case "SalesStageCode":
							for ( var i = 0; i < this.arrStagesPros.length; i++)
								if (this.arrStagesPros[i].guidVal == key) {
									var aStages = this.arrStagesPros[i].Stages;
									for ( var k = 0; k < aStages.length; k++)
										if (input == aStages[k].SalesStageDescription) {
											return aStages[k].SalesStageCode;
											break;
										}
									break;
								}
						case "UserStatusCode":
							for ( var i = 0; i < this.arrStatusPros.length; i++)
								if (this.arrStatusPros[i].HeaderGuid == key) {
									var aStatuses = this.arrStatusPros[i].Statuses;
									for ( var k = 0; k < aStatuses.length; k++)
										if (input == aStatuses[k].UserStatusText) {
											return aStatuses[k].UserStatusCode;
											break;
										}
									break;
								}
						case "ChanceOfSuccess":
							var output = input.split("%");
							return output[0];
						}
					},

					// READ all the Services using BATCH - App Settings,
					// Periodicity Texts, Time Intervals, Year Ranges,
					// Currencies
					batchRead : function() {
						var that = this;
						var aReadOp = [
								this.oDataModel.createBatchOperation(
										"SalesPipelineSettings", "GET"),
								this.oDataModel.createBatchOperation(
										"PeriodicityTexts", "GET"),
								this.oDataModel.createBatchOperation(
										"TimeIntervals", "GET"),
								this.oDataModel.createBatchOperation(
										"YearRanges", "GET"),
								this.oDataModel.createBatchOperation(
										"Currencies", "GET"),
								this.oDataModel.createBatchOperation(
										"Opportunities", "GET"),
								this.oDataModel.createBatchOperation(
										"UserStatusCodes", "GET"),
								this.oDataModel.createBatchOperation(
										"SalesStages", "GET") ];
						this.oDataModel.addBatchReadOperations(aReadOp);
						this.oDataModel.setHeaders({
							"X-REQUESTED-WITH" : "XMLHttpRequest"
						});
						var fnSuccess = function(oData, oResponses) {
							var batchResults = oData.__batchResponses;
							// TODO: Change For Loop to Best Practice
							for ( var btIdx = 0; btIdx < batchResults.length; btIdx++) {
								if (parseInt(batchResults[btIdx].statusCode) !== 200) {
									that
											.showErrorMsg(batchResults[btIdx],
													true);
									break;
								}
								var currentData = batchResults[btIdx].data.results;
								var jModel = new sap.ui.model.json.JSONModel();
								switch (btIdx) {
								case 0:
									currentData[0].STP2 = currentData[0].SalesTargetPeriodicity;
									jModel.setData(currentData[0]);
									that.getView().setModel(jModel,
											"SalesPipelineSetting");
									that.oAppSettings = currentData[0];
									that.copysetting("SettingsForDisplay");
									var oChartSim = that.getView().byId(
											"chart_sim");
									oChartSim
											.setMaxBubbleValue(currentData[0].OpportunityMaxValue);
									oChartSim
											.setMinBubbleValue(currentData[0].OpportunityMinValue);
									oChartSim
											.setBubbleStepValue(currentData[0].OpportunityStepValue);
									break;
								case 1:
									jModel.setData(currentData);
									that.getView().setModel(jModel,
											"PeriodicityTexts");
									break;
								case 2:
									var TimeIntervalsTemp = currentData;
									var TimeIntervalsData = TimeIntervalsTemp;
									if (TimeIntervalsTemp.length > 100) {
										TimeIntervalsData = [];
										var r = 0;
										for ( var l = 0, m = TimeIntervalsTemp.length; l < m; l += 2) {
											TimeIntervalsData[r] = TimeIntervalsTemp[l];
											r++;
										}
										TimeIntervalsData[r] = TimeIntervalsTemp[TimeIntervalsTemp.length - 1];
									}
									jModel.setData(TimeIntervalsData);
									that.getView().setModel(jModel,
											"TimeIntervals");
									var labelsTexts = [];
									var labelsValues = [];
									var TimeIntervals = that.getView()
											.getModel("TimeIntervals").oData;

									var sliderValues = {
										"value" : "",
										"value2" : ""
									};
									var oChartSim = that.getView().byId(
											"chart_sim");
									var salesSettings = that.getView()
											.getModel('SalesPipelineSetting').oData;

									var peroidcity = salesSettings.SalesTargetPeriodicity;
									if (TimeIntervals.length == 1) {
										sliderValues.value = 0;
										sliderValues.value2 = TimeIntervals.length - 1;
										if (sliderValues.value2 == 0) {
											sliderValues.value2 = 1;
											TimeIntervals
													.push(TimeIntervals[0]);
											jModel.setData(TimeIntervals);
											that.getView().setModel(jModel,
													"TimeIntervals");
										}
										var jMod2 = new sap.ui.model.json.JSONModel(
												sliderValues);
										that.getView().setModel(jMod2,
												"sliderValue");

										for ( var i = 0, j = TimeIntervals.length; i < j; i++) {
											labelsTexts[i] = TimeIntervals[i].Label;
											labelsValues[i] = TimeIntervals[i].TimeFrom;
										}
										oChartSim.setXStart(labelsValues[0]);
										oChartSim
												.setXEnd(TimeIntervals[TimeIntervals.length - 1].TimeTo);
									} else {
										var currentDate = new Date(), j = 0;
										currentDate.setHours(0);
										currentDate.setMinutes(0);
										currentDate.setSeconds(0);
										currentDate.setMilliseconds(0);
										currentDate = cus.crm.salespipeline.sim.util.formatter
												.convFromSixZeros(currentDate);
										if (TimeIntervalsTemp.length > 100) {
											for (; j < TimeIntervalsTemp.length - 1; j++) {
												if ((currentDate >= TimeIntervalsTemp[j].TimeFrom)
														&& (currentDate <= TimeIntervalsTemp[j].TimeTo)) {
													break;
												}
											}
											j = parseInt(j / 2);
										} else {
											for (; j < TimeIntervals.length - 1; j++) {
												if ((currentDate >= TimeIntervals[j].TimeFrom)
														&& (currentDate <= TimeIntervals[j].TimeTo)) {
													break;
												}
											}
										}
										if (j == TimeIntervals.length - 1) {
											if (currentDate.getFullYear() < new Date(
													TimeIntervals[1].TimeFrom)
													.getFullYear()) {
												j = 0;
											}
											if (currentDate.getFullYear() > new Date(
													TimeIntervals[1].TimeFrom)
													.getFullYear()) {
												switch (peroidcity) {
												case "1":
													j = TimeIntervals.length - 5;
													break;
												case "2":
													j = TimeIntervals.length - 4;
													break;
												case "3":
													j = TimeIntervals.length - 2;
													break;
												case "4":
													j = TimeIntervals.length - 2;
													break;
												}
											}
										}

										sliderValues.value = j;
										switch (peroidcity) {
										case "1":
											sliderValues.value2 = j + 4;
											break;
										case "2":
											sliderValues.value2 = j + 3;
											break;
										case "3":
											sliderValues.value2 = j + 1;
											break;
										case "4":
											sliderValues.value2 = j + 1;
											break;
										}
										if (sliderValues.value2 >= TimeIntervals.length) {

											sliderValues.value2 = TimeIntervals.length - 1;
											switch (peroidcity) {
											case "1":
												sliderValues.value = TimeIntervals.length - 5;
												break;
											case "2":
												sliderValues.value = TimeIntervals.length - 4;
												break;
											case "3":
												sliderValues.value = TimeIntervals.length - 2;
												break;
											case "4":
												sliderValues.value = TimeIntervals.length - 2;
												break;
											}

										}
										if (sliderValues.value2 == sliderValues.value) {
											sliderValues.value2 = sliderValues.value + 1;
											TimeIntervals
													.push(TimeIntervals[sliderValues.value]);
											jModel.setData(TimeIntervals);
											that.getView().setModel(jModel,
													"TimeIntervals");
										}
										for ( var i = sliderValues.value; i <= sliderValues.value2; i++) {
											labelsTexts[i - sliderValues.value] = TimeIntervals[i].Label;
											labelsValues[i - sliderValues.value] = TimeIntervals[i].TimeFrom;
											if (i == sliderValues.value)
												oChartSim
														.setXStart(TimeIntervals[i].TimeFrom);
											if (i == sliderValues.value2)
												oChartSim
														.setXEnd(TimeIntervals[i].TimeTo);
										}
									}

									that.getView().setModel(
											new sap.ui.model.json.JSONModel(
													sliderValues),
											"sliderValues");
									that.getView().byId("name").setValue(
											sliderValues.value);
									that.getView().byId("name").setValue2(
											sliderValues.value2);

									that.getView().setModel(
											new sap.ui.model.json.JSONModel(
													labelsValues),
											"xLabelValues");

									that
											.getView()
											.setModel(
													new sap.ui.model.json.JSONModel(
															labelsTexts),
													"xLabelTexts");
									break;
								case 3:
									jModel.setData(currentData);
									that.getView().setModel(jModel,
											"YearRanges");
									break;
								case 4:
									jModel.setData(currentData);
									that.getView().setModel(jModel,
											"CurrencyList");
									break;
								case 5:
									var resultList = currentData;
									var appCurr = that.getView().getModel(
											"SalesPipelineSetting").oData.CurrencyCode;
									var maintCurrList = [];
									var iIgnoreOpp = 0;
									for ( var i = 0; i < resultList.length; i++)
										if (resultList[i].CurrencyCode != appCurr) {
											var bCheck = false;
											for ( var j = 0; j < maintCurrList.length; j++)
												if (maintCurrList[j] == resultList[i].CurrencyCode) {
													bCheck = true;
													break;
												}
											if (!bCheck)
												maintCurrList
														.push(resultList[i].CurrencyCode);
											iIgnoreOpp++;
											resultList.splice(i--, 1);
										}
									var msgA = null, msgB = null, msgValue = "";
									var i18nRB = that.oBundle;
									if (maintCurrList.length == 1) {
										if (iIgnoreOpp == 1)
											msgA = i18nRB
													.getText("LBL_ONE_CURR");
										else
											msgA = i18nRB.getText(
													"LBL_MULTI_CURR",
													iIgnoreOpp);
										msgValue += maintCurrList[0];
										msgB = i18nRB.getText(
												"LBL_MAINTAIN_CURR", msgValue);
									} else if (maintCurrList.length > 1) {
										msgA = i18nRB.getText("LBL_MULTI_CURR",
												iIgnoreOpp);
										var ctMinusOne = maintCurrList.length - 1;
										for ( var i = 0; i < ctMinusOne; i++)
											msgValue += maintCurrList[i] + ", ";
										msgValue += maintCurrList[ctMinusOne];
										msgB = i18nRB.getText(
												"LBL_MAINTAIN_CURR", msgValue);
									}
									if (maintCurrList.length > 0)
										/*
										 * sap.m.MessageToast.show(msgA + " " +
										 * msgB, { duration : 10000 });
										 */
										sap.ca.ui.message.showMessageBox({
											type : sap.ca.ui.message.Type.INFO,
											message : msgA + " " + msgB
										});
									jModel.setData(resultList);
									that.getView().setModel(jModel,
											"Opportunities");
									that.Opportunities = resultList;
									that.initChangedata();
									that.copyOpportunities("OpportunitiesOld");
									break;
								case 6:
									for ( var i = 0; i < currentData.length; i++) {
										var item = currentData[i];
										if (!that.ptGroup[item.ProcessType]) {
											that.ptGroup[item.ProcessType] = new Object(
													{
														"StatusProfile" : "",
														"StatusCodes" : [],
														"BusinessTxn" : [],
													});
											that.ptGroup[item.ProcessType].StatusProfile = item.StatusProfile;
										}
										that.ptGroup[item.ProcessType].StatusCodes
												.push(item.StatusCode);
										that.ptGroup[item.ProcessType].BusinessTxn
												.push(item.BusinessTransactionCode);
									}
									break;
								}
							}
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						this.oDataModel.refreshSecurityToken();
						this.oDataModel.submitBatch(fnSuccess, fnError, false);
					},

					// Initialize the Change Log
					initChangedata : function() {
						this.changeData = {
							"discardcount" : 0,
							"changescount" : 0,
							"opportunity" : []
						};
						this.changeDataOld = {
							"discardcount" : 0,
							"changescount" : 0,
							"opportunity" : []
						};
						this.changelogModel = new sap.ui.model.json.JSONModel(
								this.changeData);
						if (!this.oFragmentList.changeLogDialog) {
							this.oFragmentList.changeLogDialog = new sap.ui.xmlfragment(
									'cus.crm.salespipeline.sim.view.changeLogDialog',
									this);
							this.oFragmentList.changeLogDialog.setModel(this
									.getView().getModel("i18n"), "i18n");
							if (sap.ui.Device.system.desktop
									|| sap.ui.Device.system.tablet)
								this.oFragmentList.changeLogDialog
										.setContentWidth("30em");
							if (sap.ui.version > "1.21.0") {
								var oCLDFL = this.oFragmentList.changeLogDialog
										.getContent()[0].getFooter()
										.getContentLeft();
								for ( var i = -1, oButton; oButton = oCLDFL[++i];)
									oButton.setWidth("32%");
							}
						}
						this.oFragmentList.changeLogDialog.setModel(
								this.changelogModel, "changeModel1");
						this.getView().setModel(this.changelogModel,
								"changeModel1");
					},

					// Updated the Change Log
					updateChangedData : function(key, index) {
						var oDataOpp = this.getView().getModel("Opportunities").oData;
						if (arguments.length == 1) {
							for ( var i = 0; i < oDataOpp.length; i++)
								if (oDataOpp[index].key == key)
									index = i;
						}
						var newopp = oDataOpp[index];
						var oldopp = {};
						var allOldOpp = this.getView().getModel(
								"OpportunitiesOld").oData;// newopp.AccountID
						for ( var obj in allOldOpp)
							if (allOldOpp[obj].Id == newopp.Id)
								oldopp = allOldOpp[obj];

						var opportunityObject = {
							"items" : [],
							"Name" : newopp.Description,
							"key" : newopp.Guid,
						// "oldStartDate" : oldopp.StartDate,
						// "oldEndDate" : oldopp.ClosingDate
						};
						var oEntry = {};
						var bIsOpportunityChanged = false;
						for ( var i = -1, oCP; oCP = this.aChangeablePropsTexts[++i];) {
							// To tackle null object
							bIsOpportunityChanged = false;
							if (newopp[oCP.property] == null
									|| oldopp[oCP.property] == null) {
								if (newopp[oCP.property] != oldopp[oCP.property])
									bIsOpportunityChanged = true;
							} else {
								if (oCP.property == "ExpectedSalesVolume") {
									newopp[oCP.property] = Math.round(
											newopp[oCP.property]).toFixed(2);
									oldopp[oCP.property] = Math.round(
											oldopp[oCP.property]).toFixed(2);
								}
								if (newopp[oCP.property].valueOf() != oldopp[oCP.property]
										.valueOf())
									bIsOpportunityChanged = true;
							}
							if (bIsOpportunityChanged) {
								switch (oCP.property) {
								case "ClosingDate":
									oEntry = {
										"checked" : false,
										"text" : oCP.property,
										"propertyText" : oCP.displayText,
										"OldValue" : this.formatChangeLog(
												oCP.property,
												oldopp[oCP.property],
												opportunityObject.key),
										"NewValue" : this.formatChangeLog(
												oCP.property,
												newopp[oCP.property],
												opportunityObject.key),
										"StartDate" : this.formatChangeLog(
												oCP.property,
												oldopp["StartDate"],
												opportunityObject.oldStartDate),
									};
									for ( var z = -1, oCurChangedProperty; oCurChangedProperty = opportunityObject.items[++z];)
										if (oCurChangedProperty.text == "StartDate") {
											oEntry.StartDate = oCurChangedProperty.NewValue;
											break;
										}
									break;
								default:
									oEntry = {
										"checked" : false,
										"text" : oCP.property,
										"propertyText" : oCP.displayText,
										"OldValue" : this.formatChangeLog(
												oCP.property,
												oldopp[oCP.property],
												opportunityObject.key),
										"NewValue" : this.formatChangeLog(
												oCP.property,
												newopp[oCP.property],
												opportunityObject.key)
									};
									break;
								}
								opportunityObject.items.push(oEntry);
							}
						}
						var bIsOppPresentInChangeLog = false;
						for ( var i = -1, oChangedOpp; oChangedOpp = this.changeData.opportunity[++i];)
							if (oChangedOpp.key == opportunityObject.key
									&& opportunityObject.items.length != 0) {
								if (opportunityObject.items.length > 0) {
									bIsOppPresentInChangeLog = true;
									this.changeData.changescount += opportunityObject.items.length
											- oChangedOpp.items.length;
									this.changeData.opportunity.splice(i, 1,
											opportunityObject);
								} else {
									this.changeData.changescount -= oChangedOpp.items.length;
									this.changeData.opportunity.splice(i, 1);
								}
								break;
							}

						if (!bIsOppPresentInChangeLog
								&& opportunityObject.items.length != 0) {
							this.changeData.opportunity.push(opportunityObject);
							this.changeData.changescount += opportunityObject.items.length;
						}
						this.getView().getModel("changeModel1").refresh();
						this.oFragmentList.changeLogDialog.getModel(
								"changeModel1").refresh();
					},

					// Load all application-specific Data
					loadData : function() {
						// this.LoadSalesPipelineSettings(false);
						// this.LoadPeriodicityTexts(false);
						// this.LoadTimeIntervals(false);
						// this.LoadYearRanges(false);
						// this.LoadCurrencyList(false);
						// this.LoadOpportunities(false);
						this.batchRead();
						this.setMinMax();
						var yValues = null, yTexts = null;
						if (sap.ui.Device.system.phone) {
							yValues = new sap.ui.model.json.JSONModel([ 0, 50,
									100 ]);
							yTexts = new sap.ui.model.json.JSONModel([ "0%",
									"50%", "100%" ]);
						} else {
							var aValues = [ 0, 20, 40, 60, 80, 100 ];
							var aTexts = [ "0%", "20%", "40%", "60%", "80%",
									"100%" ];
							yValues = new sap.ui.model.json.JSONModel(aValues);
							yTexts = new sap.ui.model.json.JSONModel(aTexts);
						}
						this.getView().setModel(yValues, "yLabelValues");
						this.getView().setModel(yTexts, "yLabelTexts");
					},

					// Copy application settings data for the user
					copysetting : function(modelname) {
						var settings = new Object({});
						settings = this.getView().getModel(
								"SalesPipelineSetting").oData;
						var jMod = new sap.ui.model.json.JSONModel(settings);
						if (modelname == "SettingsForDisplay")
							jMod
									.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
						this.getView().setModel(jMod, modelname);
					},

					copyOpportunities : function(modelname) {
						/* Make copy from Odata for changes */
						var Opportunities = [];
						var oppModel = this.getView().getModel("Opportunities");
						if (oppModel != undefined) {
							jQuery.extend(true, Opportunities, oppModel.oData);
							var jMod = new sap.ui.model.json.JSONModel(
									Opportunities);
							this.getView().setModel(jMod, modelname);
						}
					},

					// Single Service READ - Application Settings
					LoadSalesPipelineSettings : function(bSync) {
						var that = this;
						this.oAppSettings = false;
						var fnSuccess = function(oData, oResponse) {
							oData.results[0].STP2 = that.viewType;
							var jMod = new sap.ui.model.json.JSONModel(
									oData.results[0]);
							that.getView().setModel(jMod,
									"SalesPipelineSetting");
							that.oAppSettings = oData.results[0];
							that.copysetting("SettingsForDisplay");
							var oChartSim = that.getView().byId("chart_sim");
							oChartSim
									.setMaxBubbleValue(oData.results[0].OpportunityMaxValue);
							oChartSim
									.setMinBubbleValue(oData.results[0].OpportunityMinValue);
							oChartSim
									.setBubbleStepValue(oData.results[0].OpportunityStepValue);
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						this.oDataModel.read("SalesPipelineSettings", null,
								null, bSync, fnSuccess, fnError);
					},

					// Single Service READ - Opportunities
					LoadOpportunities : function(bSync) {
						var that = this;
						that.Opportunities = false;
						var fnSuccess = function(oData, oResponse) {
							var resultList = oData.results;
							var appCurr = that.getView().getModel(
									"SalesPipelineSetting").oData.CurrencyCode;
							var maintCurrList = [];
							var iIgnoreOpp = 0;
							for ( var i = 0; i < resultList.length; i++)
								if (resultList[i].CurrencyCode != appCurr) {
									var bCheck = false;
									for ( var j = 0; j < maintCurrList.length; j++)
										if (maintCurrList[j] == resultList[i].CurrencyCode) {
											bCheck = true;
											break;
										}
									if (!bCheck)
										maintCurrList
												.push(resultList[i].CurrencyCode);
									iIgnoreOpp++;
									resultList.splice(i--, 1);
								}
							var msgA = null, msgB = null, msgValue = "", i18nRB = that.oBundle;
							if (maintCurrList.length == 1) {
								if (iIgnoreOpp == 1)
									msgA = i18nRB.getText("LBL_ONE_CURR");
								else
									msgA = i18nRB.getText("LBL_MULTI_CURR",
											iIgnoreOpp);
								msgValue += maintCurrList[0];
								msgB = i18nRB.getText("LBL_MAINTAIN_CURR",
										msgValue);
							} else if (maintCurrList.length > 1) {
								msgA = i18nRB.getText("LBL_MULTI_CURR",
										iIgnoreOpp);
								var ctMinusOne = maintCurrList.length - 1;
								for ( var i = 0; i < ctMinusOne; i++)
									msgValue += maintCurrList[i] + ", ";
								msgValue += maintCurrList[ctMinusOne];
								msgB = i18nRB.getText("LBL_MAINTAIN_CURR",
										msgValue);
							}
							if (maintCurrList.length > 0)
								/*
								 * sap.m.MessageToast.show(msgA + " " + msgB, {
								 * duration : 10000 });
								 */
								sap.ca.ui.message.showMessageBox({
									type : sap.ca.ui.message.Type.INFO,
									message : msgA + " " + msgB
								});
							var jMod = new sap.ui.model.json.JSONModel(
									resultList);
							that.getView().setModel(jMod, "Opportunities");
							that.Opportunities = resultList;
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						that.oDataModel.read("Opportunities", null, null,
								bSync, fnSuccess, fnError);
						that.initChangedata();
						that.copyOpportunities("OpportunitiesOld");
					},

					// Single Service READ - Time Intervals
					LoadTimeIntervals : function(bSync, peroidcity) {
						var that = this;
						var filter = null;
						if (peroidcity) {
							filter = [];
							filter[0] = "$filter=PeriodicityType eq '"
									+ peroidcity + "'";
						}
						var fnSuccess = function(oData, oResponse) {
							var TimeIntervalsTemp = oData.results;
							var TimeIntervalsData = TimeIntervalsTemp;
							if (TimeIntervalsTemp.length > 100) {
								TimeIntervalsData = [];
								var r = 0;
								for ( var l = 0; l < TimeIntervalsTemp.length; l += 2) {
									TimeIntervalsData[r] = TimeIntervalsTemp[l];
									r++;
								}
								TimeIntervalsData[r] = TimeIntervalsTemp[TimeIntervalsTemp.length - 1];
							}
							var jMod = new sap.ui.model.json.JSONModel(
									TimeIntervalsData);
							that.getView().setModel(jMod, "TimeIntervals");
							var labelsTexts = [];
							var labelsValues = [];
							var TimeIntervals = that.getView().getModel(
									"TimeIntervals").oData;
							var sliderValues = {
								"value" : "",
								"value2" : ""
							};
							var oChartSim = that.getView().byId("chart_sim");
							if (TimeIntervals.length == 1) {
								sliderValues.value = 0;
								sliderValues.value2 = TimeIntervals.length - 1;
								if (sliderValues.value2 == 0) {
									sliderValues.value2 = 1;
									TimeIntervals.push(TimeIntervals[0]);
									jMod.setData(TimeIntervals);
									that.getView().setModel(jMod,
											"TimeIntervals");
								}
								var jMod2 = new sap.ui.model.json.JSONModel(
										sliderValues);
								that.getView().setModel(jMod2, "sliderValue");

								for ( var i = 0, j = TimeIntervals.length; i < j; i++) {
									labelsTexts[i] = TimeIntervals[i].Label;
									labelsValues[i] = TimeIntervals[i].TimeFrom;
								}
								oChartSim.setXStart(labelsValues[0]);
								oChartSim
										.setXEnd(TimeIntervals[TimeIntervals.length - 1].TimeTo);
							} else {
								var currentDate = new Date(), j = 0;
								currentDate.setHours(0);
								currentDate.setMinutes(0);
								currentDate.setSeconds(0);
								currentDate.setMilliseconds(0);
								currentDate = cus.crm.salespipeline.sim.util.formatter
										.convFromSixZeros(currentDate);
								if (TimeIntervalsTemp.length > 100) {
									for (; j < TimeIntervalsTemp.length - 1; j++) {
										if ((currentDate >= TimeIntervalsTemp[j].TimeFrom)
												&& (currentDate <= TimeIntervalsTemp[j].TimeTo)) {
											break;
										}
									}
									j = parseInt(j / 2);
								} else {
									for (; j < TimeIntervals.length - 1; j++) {
										if ((currentDate >= TimeIntervals[j].TimeFrom)
												&& (currentDate <= TimeIntervals[j].TimeTo)) {
											break;
										}
									}
								}
								if (j == TimeIntervals.length - 1) {
									if (currentDate.getFullYear() < new Date(
											TimeIntervals[1].TimeFrom)
											.getFullYear()) {
										j = 0;
									}
									if (currentDate.getFullYear() > new Date(
											TimeIntervals[1].TimeFrom)
											.getFullYear()) {
										switch (peroidcity) {
										case "1":
											j = TimeIntervals.length - 5;
											break;
										case "2":
											j = TimeIntervals.length - 4;
											break;
										case "3":
											j = TimeIntervals.length - 2;
											break;
										case "4":
											j = TimeIntervals.length - 2;
											break;
										}
									}
								}

								sliderValues.value = j;
								switch (peroidcity) {
								case "1":
									sliderValues.value2 = j + 4;
									break;
								case "2":
									sliderValues.value2 = j + 3;
									break;
								case "3":
									sliderValues.value2 = j + 1;
									break;
								case "4":
									sliderValues.value2 = j + 1;
									break;
								}
								if (sliderValues.value2 >= TimeIntervals.length) {
									sliderValues.value2 = TimeIntervals.length - 1;
									switch (peroidcity) {
									case "1":
										sliderValues.value = TimeIntervals.length - 5;
										break;
									case "2":
										sliderValues.value = TimeIntervals.length - 4;
										break;
									case "3":
										sliderValues.value = TimeIntervals.length - 2;
										break;
									case "4":
										sliderValues.value = TimeIntervals.length - 2;
										break;
									}
								}
								if (sliderValues.value2 == sliderValues.value) {
									sliderValues.value2 = sliderValues.value + 1;
									TimeIntervals
											.push(TimeIntervals[sliderValues.value]);
									jMod.setData(TimeIntervals);
									that.getView().setModel(jMod,
											"TimeIntervals");
								}
								for ( var i = sliderValues.value; i <= sliderValues.value2; i++) {
									labelsTexts[i - sliderValues.value] = TimeIntervals[i].Label;
									labelsValues[i - sliderValues.value] = TimeIntervals[i].TimeFrom;
									if (i == sliderValues.value)
										oChartSim
												.setXStart(TimeIntervals[i].TimeFrom);
									if (i == sliderValues.value2)
										oChartSim
												.setXEnd(TimeIntervals[i].TimeTo);
								}
							}

							that.getView().byId("name").setValue(
									sliderValues.value);
							that.getView().byId("name").setValue2(
									sliderValues.value2);
							jMod = new sap.ui.model.json.JSONModel(labelsValues);
							that.getView().setModel(jMod, "xLabelValues");
							jMod = new sap.ui.model.json.JSONModel(labelsTexts);
							that.getView().setModel(jMod, "xLabelTexts");
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						that.oDataModel.read("TimeIntervals", null, filter,
								bSync, fnSuccess, fnError);
					},

					// Single Service READ - Periodicity Texts
					LoadPeriodicityTexts : function(bSync) {
						var that = this;
						var fnSuccess = function(oData, oResponse) {
							var jMod = new sap.ui.model.json.JSONModel(
									oData.results);
							that.getView().setModel(jMod, "PeriodicityTexts");
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						that.oDataModel.read("PeriodicityTexts", null, null,
								bSync, fnSuccess, fnError);
					},

					// Single Service READ - Year Ranges
					LoadYearRanges : function(bSync) {
						var that = this;
						var fnSuccess = function(oData, oReponse) {
							var jMod = new sap.ui.model.json.JSONModel(
									oData.results);
							that.getView().setModel(jMod, "YearRanges");
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						that.oDataModel.read("YearRanges", null, null, true,
								fnSuccess, fnError);
					},

					// Single Service READ - Currencies
					LoadCurrencyList : function(bSync) {
						var that = this;
						var fnSuccess = function(oData, oResponse) {
							var jMod = new sap.ui.model.json.JSONModel(
									oData.results);
							that.getView().setModel(jMod, "CurrencyList");
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						that.oDataModel.read("Currencies", null, null, true,
								fnSuccess, fnError);
					},

					_getBTCode : function(oOpport) {
						var oProcType = undefined, sBusinessTxn = "";
						for ( var pt in this.ptGroup)
							if (pt == oOpport.ProcessType) {
								oProcType = this.ptGroup[pt];
								break;
							}

						if (oProcType != undefined
								&& oOpport.UserStatusCode != undefined)
							for ( var j = 0; j < oProcType.StatusCodes.length; j++)
								if (oProcType.StatusCodes[j] == oOpport.UserStatusCode) {
									sBusinessTxn = oProcType.BusinessTxn[j];
									break;
								}
						return sBusinessTxn;
					},

					// Progress Achievement for the Sales Representative
					calculateProgress : function() {
						var SalesSettings = this.getView().getModel(
								"SalesPipelineSetting").oData;
						var SalesPeriodBegin = SalesSettings.StartOfPeriod;
						var SalesPeriodEnd = SalesSettings.EndOfPeriod;
						var oppModel = this.getView().getModel("Opportunities");
						if (oppModel != undefined) {
							var Opportunites = oppModel.oData;
							var Percentage = 0.0;
							var Text = null;
							var utilForm = cus.crm.salespipeline.sim.util.formatter;
							var TotalActualRevenue = 0.0;
							for ( var i = 0; i < Opportunites.length; i++) {
								var isAtrue = Opportunites[i].ClosingDate >= SalesPeriodBegin;
								var isBtrue = Opportunites[i].ClosingDate <= SalesPeriodEnd;
								var isCtrue = true;
								var bTCode = this._getBTCode(Opportunites[i]);
								if (bTCode == 'LOST')
									isCtrue = false;

								if (isAtrue && isBtrue && isCtrue)
									TotalActualRevenue += ((Opportunites[i].ExpectedSalesVolume * Opportunites[i].ChanceOfSuccess) / 100);
							}

							var Pg = this.getView().byId("pg");
							var Lb = this.getView().byId("objectStatus");
							Lb.addStyleClass("progressBarText");
							if (SalesSettings.SalesTarget > 0)
								Percentage = (TotalActualRevenue / SalesSettings.SalesTarget) * 100;
							Percentage = Math.round(Percentage);

							var valueA = utilForm.displayNumbersShort(Math
									.ceil(TotalActualRevenue));
							var valueB = utilForm.displayNumbersShort(Math
									.ceil(SalesSettings.SalesTarget));
							Text = valueA + " "
									+ this.oBundle.getText("LBL_OF") + " "
									+ valueB;
							if (Percentage >= 100)
								Pg.setPercentValue(100);
							else
								Pg.setPercentValue(Percentage);

							Pg.setDisplayValue(Percentage + "%");
							Lb.setText(Text + " (" + SalesSettings.CurrencyCode
									+ ")");
						}
					},

					// START OF Footer Actions in Main View
					showSettings : function(oEvent) {
						if (!this.oFragmentList.settingsDialog) {
							this.oFragmentList.settingsDialog = new sap.ui.xmlfragment(
									"cus.crm.salespipeline.sim.view.settingsDialog",
									this);
							this.oFragmentList.settingsDialog.setModel(this
									.getView().getModel("i18n"), "i18n");
						}
						this.getView().byId("actSettings").openBy(
								oEvent.getSource());
					},

					showChangeLog : function(oEvent) {
						if (!this.oFragmentList.changeLogDialog) {
							this.oFragmentList.changeLogDialog = new sap.ui.xmlfragment(
									'cus.crm.salespipeline.sim.view.changeLogDialog',
									this);
							this.oFragmentList.changeLogDialog.setModel(this
									.getView().getModel("i18n"), "i18n");
							this.oFragmentList.changeLogDialog.setModel(this
									.getView().getModel("changeModel1"),
									"changeModel1");
						}

						// this.setDiscardButton();
						// this.setSelectAllCheckbox();
						this.setDiscardButton(this.changeData.discardcount);
						this.setSelectAllCheckbox(this.changeData.discardcount,
								this.changeData.changescount);
						/* if (this.changeData.changescount > 0) */
						/* this.getView().byId("changeLogDialog").open(); */
						this.oFragmentList.changeLogDialog.open();
						/*
						 * else sap.m.MessageToast.show(this.oBundle
						 * .getText("LBL_NOCHANGELOG"));
						 */
					},
					// END OF Footer Actions in Main View

					// START OF DIALOGS for APP Settings
					selectActSetting : function(oEvent) {
						this.copysetting("SettingsForSave");
						var oSettingsSave = this.getView().getModel(
								"SettingsForSave"), oNewObj = {};
						oNewObj["SalesTarget"] = oSettingsSave.oData.SalesTarget;
						oNewObj["CurrencyCode"] = oSettingsSave.oData.CurrencyCode;
						oNewObj["SalesTargetPeriodicity"] = oSettingsSave.oData.SalesTargetPeriodicity;
						oNewObj["TimeFrom"] = oSettingsSave.oData.TimeFrom;
						oNewObj["TimeTo"] = oSettingsSave.oData.TimeTo;
						this.oSalesSettings = oNewObj;
						if (this.oFragmentList.SalesTargetDialog)
							this.oFragmentList.SalesTargetDialog.setModel(
									oSettingsSave, "SettingsForSave");
						this.oFragmentList.settingsDialog.open();
					},

					selectDlgSetting : function(oEvent) {
						this.oFragmentList.settingsDialog.close();
						var listSett = this.oFragmentList.settingsDialog
								.getContent()[0];
						if (listSett.getItems()[0].isSelected())
							this.oFragmentList.SalesTargetDialog.open();
						/*
						 * else if (listSett.getItems()[1].isSelected())
						 * this.getView().byId("dlOpportunitySet").open();
						 */
						listSett.getSelectedItem().setSelected(false);
					},

					closeAppSettDialog : function(oEvent) {
						this.oFragmentList.settingsDialog.close();
					},

					resetAllOpp : function(oEvent) {
						if (!this.oFragmentList.resetDialog) {
							this.oFragmentList.resetDialog = new sap.ui.xmlfragment(
									"cus.crm.salespipeline.sim.view.resetDialog",
									this);
							this.oFragmentList.resetDialog.setModel(this
									.getView().getModel("i18n"), "i18n");
							if (sap.ui.Device.system.desktop
									|| sap.ui.Device.system.tablet)
								this.oFragmentList.resetDialog
										.setContentWidth("30em");
						}
						this.isNavButtonClicked = !(this.getView().byId(
								"butReset") == oEvent.getSource());
						if (this.getView().byId("butSave").getVisible()) {
							this.oFragmentList.resetDialog.open();
							// Reset Dialog -- Disable text selection
							sap.ui.getCore().byId('RefreshDialog')
									.allowTextSelection(false);
						} else
							this._navBack();

					},

					// START OF DIALOG for Refresh
					refreshDlg : function(oEvent) {
						this.oFragmentList.resetDialog.close();
						if (sap.ui.getCore().byId("rfButOK") == oEvent
								.getSource()) {
							if (this.oNavParams.toOppApp != "")
								window.location = this.oNavParams.toOppApp;
							else if (this.oNavParams.toContactApp != "")
								window.location = this.oNavParams.toContactApp;
							else if (this.oNavParams.toAccountApp != "")
								window.location = this.oNavParams.toAccountApp;
							else if (this.oNavParams.telCall != "")
								sap.m.URLHelper
										.triggerTel(this.oNavParams.telCall);
							else if (this.oNavParams.sendMail != "")
								sap.m.URLHelper
										.triggerMail(this.oNavParams.sendMail);
							else if (!this.isNavButtonClicked) {
								// this.loadData();
								// this.calculateProgress();
								// this.initChangedata();
								this.LoadOpportunities(false);
								this.getView().getModel("Opportunities")
										.refresh();
								this.setMinMax();
								this.resetChangeLog();
								this.showTopNOpp();
							} else
								this._navBack();
						}
						this.oNavParams = {
							"toOppApp" : "",
							"toContactApp" : "",
							"toAccountApp" : "",
							"telCall" : "",
							"sendMail" : "",
						};
					},
					// END OF DIALOG for Refresh

					navBack : function(oEvent) {
						var oSettingsSave = this.getView().getModel(
								"SettingsForSave").oData;
						oSettingsSave["SalesTarget"] = this.oSalesSettings.SalesTarget;
						oSettingsSave["CurrencyCode"] = this.oSalesSettings.CurrencyCode;
						oSettingsSave["SalesTargetPeriodicity"] = this.oSalesSettings.SalesTargetPeriodicity;
						oSettingsSave["TimeFrom"] = this.oSalesSettings.TimeFrom;
						oSettingsSave["TimeTo"] = this.oSalesSettings.TimeTo;
						// if (sap.ui.getCore().byId("SPnavBack") ==
						// oEvent.oSource) {
						this.oFragmentList.SalesTargetDialog.close();
						this.oFragmentList.settingsDialog.open();
						// }
					},

					// Change in the YEARS of Timespan in Application Settings
					// of Sales Representative
					TimespanChange : function(oEvent) {
						var selUiFrom = sap.ui.getCore().byId("sFrom");
						var selUiTo = sap.ui.getCore().byId("sTo");
						var timeToItems = [], timeFromItems = [];
						for ( var i = -1, c; c = selUiTo.getItems()[++i];) {
							var pVal = parseInt(c.getText());
							timeToItems.push(new Object({
								"dispText" : pVal ? pVal : c.getText(),
								"key" : c.getKey()
							}));
						}
						for ( var i = -1, c; c = selUiFrom.getItems()[++i];) {
							var pVal = parseInt(c.getText());
							timeFromItems.push(new Object({
								"dispText" : pVal ? pVal : c.getText(),
								"key" : c.getKey()
							}));
						}
						var selDispText = oEvent.getParameter("selectedItem")
								.getText();
						selDispText = parseInt(selDispText) ? parseInt(selDispText)
								: selDispText;
						if (selUiFrom == oEvent.getSource()) {
							for ( var i = 0; i < timeFromItems.length; i++)
								if (selDispText == timeFromItems[i]["dispText"])
									break;
							var otherText = selUiTo.getSelectedItem().getText();
							var selObj = new Object(
									{
										"key" : selUiTo.getSelectedKey(),
										"dispText" : parseInt(otherText) ? parseInt(otherText)
												: otherText
									});
							if (!(selDispText <= selObj["dispText"]))
								selUiTo.setSelectedKey(timeToItems[i]["key"]);
						} else {
							for ( var i = 0; i < timeToItems.length; i++)
								if (selDispText == timeToItems[i]["dispText"])
									break;
							var otherText = selUiFrom.getSelectedItem()
									.getText();
							var selObj = new Object(
									{
										"key" : selUiFrom.getSelectedKey(),
										"dispText" : parseInt(otherText) ? parseInt(otherText)
												: otherText
									});
							if (!(selObj["dispText"] <= selDispText))
								selUiFrom
										.setSelectedKey(timeFromItems[i]["key"]);
						}
					},

					// Setting the Minimum & Maximum Opportunity Value to impose
					// UI restrictions so that it does not become unusable to
					// the Sales Representative
					setMinMax : function() {
						var oppModel = this.getView().getModel("Opportunities");
						if (oppModel != undefined) {
							var Opportunities = oppModel.oData;
							var expRevOpp = [];
							for ( var i = 0; i < Opportunities.length; i++)
								expRevOpp
										.push(parseFloat(Opportunities[i].ExpectedSalesVolume));

							expRevOpp.sort(function(a, b) {
								return a - b;
							});

							var chart = this.getView().byId("chart_sim");
							this.minOpp = 0.25 * expRevOpp[0];
							this.maxOpp = 3 * expRevOpp[Opportunities.length - 1];
							chart.setMinBubbleValue(this.minOpp);
							chart.setMaxBubbleValue(this.maxOpp);
						}
					},

					// Check the value entered in Input controls and reformat
					// them to the logon language of the Sales Representative
					checkValue : function(oEvent) {
						var oControl = oEvent.getSource(), utilForm = cus.crm.salespipeline.sim.util.formatter;
						var parsedNum = utilForm.reverseNumbers(oControl
								.getValue());
						oControl.setValue(utilForm.displayNumbers(parsedNum));
					},

					// Save Application Settings for Sales Representative
					saveAppSetChange : function(oEvent) {
						var that = this, oControl = oEvent.getSource();
						this.reRenderTopNSlider = true;
						var utilForm = cus.crm.salespipeline.sim.util.formatter;
						var oEntry = this.getView().getModel("SettingsForSave").oData;
						if (oControl == sap.ui.getCore().byId("spButSave")) {
							oEntry.TimeFrom = new Date(oEntry.TimeFrom);
							/*
							 * switch (dtType) { case "string": oEntry.TimeFrom =
							 * new Date(oEntry.TimeFrom); break; case "object":
							 * dateFrom = oEntry.TimeFrom.getFullYear();
							 * oEntry.TimeFrom = new Date(dateFrom, 0, 1);
							 * oEntry.TimeFrom = utilForm
							 * .convFromSixZeros(oEntry.TimeFrom); break;
							 * default: break; }
							 */
							oEntry.TimeTo = new Date(oEntry.TimeTo);
							/*
							 * switch (dtType) { case "string": oEntry.TimeTo =
							 * new Date(oEntry.TimeTo); break; case "object":
							 * dateTo = oEntry.TimeTo.getFullYear();
							 * oEntry.TimeTo = new Date(dateTo, 11, 31);
							 * oEntry.TimeTo = utilForm
							 * .convFromSixZeros(oEntry.TimeTo); break; default:
							 * break; }
							 */
							this.viewType = oEntry.STP2;
							delete oEntry.STP2;
							// var valST =
							// that.getView().byId("iST").getValue();
							var valST = sap.ui.getCore().byId("iST").getValue();
							oEntry.SalesTarget = utilForm.reverseNumbers(valST)
									+ ".0";

							var oParams = {};
							oParams.bMerge = false;
							oParams.fnSuccess = function() {
								if (sap.ui.getCore().byId("spButSave") == oControl)
									that.oFragmentList.SalesTargetDialog
											.close();
								/*
								 * sap.m.MessageToast.show(that.oBundle
								 * .getText("LBL_SUCCESSUPDATE"));
								 */
								sap.ca.ui.message.showMessageToast(that.oBundle
										.getText("LBL_SUCCESSUPDATE"));
								that.LoadSalesPipelineSettings(false);
								that.LoadOpportunities(false);
								that.setMinMax();
								that.LoadTimeIntervals(false, that.viewType);
								that.calculateProgress();
							};
							oParams.fnError = function(oError) {
								that.showErrorMsg(oError, false);
							};
							var updateUrl = "/SalesPipelineSettings('"
									+ oEntry.UserName + "')";
							this.oDataModel.update(updateUrl, oEntry, oParams);
						} else {
							oEntry["SalesTarget"] = this.oSalesSettings.SalesTarget;
							oEntry["CurrencyCode"] = this.oSalesSettings.CurrencyCode;
							oEntry["SalesTargetPeriodicity"] = this.oSalesSettings.SalesTargetPeriodicity;
							oEntry["TimeFrom"] = this.oSalesSettings.TimeFrom;
							oEntry["TimeTo"] = this.oSalesSettings.TimeTo;
							this.oFragmentList.SalesTargetDialog.close();
						}
					},

					// Cancel of SAVE in Application Settings of Sales
					// Representative
					cancelAppSetChange : function(oEvent) {
						var oSettingsSave = this.getView().getModel(
								"SettingsForSave").oData;
						oSettingsSave["SalesTarget"] = this.oSalesSettings.SalesTarget;
						oSettingsSave["CurrencyCode"] = this.oSalesSettings.CurrencyCode;
						oSettingsSave["SalesTargetPeriodicity"] = this.oSalesSettings.SalesTargetPeriodicity;
						oSettingsSave["TimeFrom"] = this.oSalesSettings.TimeFrom;
						oSettingsSave["TimeTo"] = this.oSalesSettings.TimeTo;
						if (sap.ui.getCore().byId("spButCancel") == oEvent
								.getSource())
							this.oFragmentList.SalesTargetDialog.close();
					},

					/*
					 * settCheck : function(oEvent) { var settingModel =
					 * this.getView().getModel( "SettingsForSave"); var
					 * settingVal = settingModel.oData; var utilForm =
					 * cus.crm.salespipeline.sim.util.formatter; var dateFromVal =
					 * new Date(settingVal.TimeFrom .getFullYear(), 0, 1); var
					 * dateToVal = new Date(settingVal.TimeTo .getFullYear(),
					 * 11, 31); dateToVal =
					 * utilForm.convFromSixZeros(dateToVal); dateFromVal =
					 * utilForm.convFromSixZeros(dateFromVal); if
					 * (String(dateFromVal) != String(settingVal.TimeFrom))
					 * settingVal.TimeFrom = dateFromVal;
					 * 
					 * if (String(dateToVal) != String(settingVal.TimeTo))
					 * settingVal.TimeTo = dateToVal;
					 * settingModel.setData(settingVal); },
					 */
					// END OF DIALOGS for APP Settings
					// START OF DIALOG for Change Log
					onDiscardAllChecked : function(oEvent) {
						this.changeData.discardcount = 0;
						for ( var i = -1, oChangedOpp; oChangedOpp = this.changeData.opportunity[++i];)
							for ( var j = -1, oCurItem; oCurItem = oChangedOpp.items[++j];) {
								oCurItem.checked = oEvent
										.getParameter('selected');
								if (oCurItem.checked)
									this.changeData.discardcount += 1;
							}
						this.setDiscardButton(this.changeData.discardcount);
						this.getView().getModel("changeModel1").refresh();
						this.oFragmentList.changeLogDialog.getModel(
								"changeModel1").refresh();
						this.getView().getModel("Opportunities").refresh();
					},

					onDiscardChecked : function(oEvent) {
						if (oEvent.getParameter('selected'))
							this.changeData.discardcount += 1;
						else
							this.changeData.discardcount -= 1;
						this.setDiscardButton(this.changeData.discardcount);
						this.setSelectAllCheckbox(this.changeData.discardcount,
								this.changeData.changescount);
						this.getView().getModel("changeModel1").refresh();
						this.oFragmentList.changeLogDialog.getModel(
								"changeModel1").refresh();
					},

					setDiscardButton : function(iDiscardCount) {
						var sDiscardText = this.oBundle
								.getText("BTN_CL_DISCARD"), sSaveText = this.oBundle
								.getText("BTN_SAVE_OPPORT");
						var btnDiscard = sap.ui.getCore().byId("discardBtn"), btnSave = sap.ui
								.getCore().byId("saveBtn");
						if (iDiscardCount > 0) {
							sDiscardText = this.oBundle
									.getText("BTN_CL_DISCARDSEL")
									+ " (" + iDiscardCount + ")";
							sSaveText += " (" + iDiscardCount + ")";
							btnDiscard.setEnabled(true);
							btnSave.setEnabled(true);
						} else {
							btnDiscard.setEnabled(false);
							btnSave.setEnabled(false);
						}
						btnDiscard.setText(sDiscardText);
						btnSave.setText(sSaveText);
					},

					setSelectAllCheckbox : function(iDiscardCount, iChangeCount) {
						// var changeList = this.getView().byId("cbAllChanges");
						var changeList = sap.ui.getCore().byId("cbAllChanges");
						if (iChangeCount == 0) {
							changeList.setEnabled(false);
							changeList.setSelected(false);
							return;
						} else
							changeList.setEnabled(true);

						if (iDiscardCount < iChangeCount)
							changeList.setSelected(false);
						else
							changeList.setSelected(true);
					},

					resetChangeLog : function() {
						for ( var i = this.changeData.opportunity.length - 1; i >= 0; i--)
							this.changeData.opportunity.splice(i, 1);
						this.changeData.changescount = 0;
						this.changeData.discardcount = 0;
						this.setDiscardButton(this.changeData.discardcount);
						this.setSelectAllCheckbox(this.changeData.discardcount,
								this.changeData.changescount);
						this.getView().getModel("changeModel1").refresh();
						this.oFragmentList.changeLogDialog.getModel(
								"changeModel1").refresh();
						this.getView().getModel("Opportunities").refresh();
					},

					resetChangeLog2 : function() {
						for ( var i = this.changeData.opportunity.length - 1; i >= 0; i--) {
							for ( var j = this.changeData.opportunity[i].items.length - 1; j >= 0; j--)
								if (this.changeData.opportunity[i].items[j].checked == true)
									this.changeData.opportunity[i].items
											.splice(j, 1);

							if (this.changeData.opportunity[i].items.length == 0)
								this.changeData.opportunity.splice(i, 1);
						}

						/*
						 * if (this.getView().byId("cbAllChanges").getSelected() ==
						 * true) this.getView().byId("changeLogDialog").close();
						 */
						if (sap.ui.getCore().byId("cbAllChanges").getSelected() == true)
							this.oFragmentList.changeLogDialog.close();

						this.changeData.changescount -= this.changeData.discardcount;
						this.changeData.discardcount = 0;
						this.setDiscardButton(this.changeData.discardcount);
						this.setSelectAllCheckbox(this.changeData.discardcount,
								this.changeData.changescount);
						this.getView().getModel("changeModel1").refresh();
						this.oFragmentList.changeLogDialog.getModel(
								"changeModel1").refresh();
						this.getView().getModel("Opportunities").refresh();
					},

					onDiscard : function() {
						var originalData = this.getView().getModel(
								"Opportunities").oData;
						for ( var i = -1, oCurrentOpp; oCurrentOpp = this.changeData.opportunity[++i];) {
							for ( var j = oCurrentOpp.items.length, oCurOppItem; oCurOppItem = oCurrentOpp.items[--j];)
								if (oCurOppItem.checked == true) {
									for ( var k = -1, oOriginalOpp; oOriginalOpp = originalData[++k];)
										if (oOriginalOpp.Guid == oCurrentOpp.key)
											oOriginalOpp[oCurOppItem.text] = this
													.unformatChangeLog(
															oCurOppItem.text,
															oCurOppItem.OldValue,
															oCurrentOpp.key);
									oCurrentOpp.items.splice(j, 1);
								}
							if (oCurrentOpp.items.length == 0)
								this.changeData.opportunity.splice(i, 1);
						}

						if (sap.ui.getCore().byId("cbAllChanges").getSelected() == true)
							sap.ui.getCore().byId("changeLogDialog").close();

						this.changeData.changescount -= this.changeData.discardcount;
						this.changeData.discardcount = 0;
						// this.setDiscardButton();
						// this.setSelectAllCheckbox();
						this.setDiscardButton(this.changeData.discardcount);
						this.setSelectAllCheckbox(this.changeData.discardcount,
								this.changeData.changescount);
						this.getView().getModel("changeModel1").refresh();
						this.oFragmentList.changeLogDialog.getModel(
								"changeModel1").refresh();
						this.getView().getModel("Opportunities").refresh();
						this.calculateProgress();
					},

					// Dialog Box Cancel Button
					onClose : function() {
						for ( var i = 0; i < this.changeData.opportunity.length; i++)
							for ( var j = 0; j < this.changeData.opportunity[i].items.length; j++)
								this.changeData.opportunity[i].items[j].checked = false;
						this.changeData.discardcount = 0;
						this.setDiscardButton(this.changeData.discardcount);
						/*
						 * this.getView().byId("cbAllChanges").setSelected(false);
						 * this.getView().byId("changeLogDialog").close();
						 */
						sap.ui.getCore().byId("cbAllChanges")
								.setSelected(false);
						this.oFragmentList.changeLogDialog.close();

						this.getView().getModel("changeModel1").refresh();
						this.oFragmentList.changeLogDialog.getModel(
								"changeModel1").refresh();
					},
					// END OF DIALOG for Change Log

					// DUAL SLIDER Control
					dualsliderchange : function() {
						var chart = this.getView().byId("chart_sim");
						var value = arguments[0].getParameter("value");
						var value2 = arguments[0].getParameter("value2");
						var units = this.getView().byId("name").getUnits();
						var timeinterval = this.getView().getModel(
								"TimeIntervals");
						var labelsTexts = [];
						var labelsValues = [];

						for ( var i = value; i <= value2; i++) {
							labelsTexts[i - value] = units[i].getValue();
							labelsValues[i - value] = units[i].getKey();

							if (i == value)
								chart.setXStart(units[i].getKey());
							if (i == value2)
								chart.setXEnd(timeinterval.oData[i].TimeTo);

						}
						chart.setXLabelTexts(labelsTexts);
						chart.setXLabelValues(labelsValues);
					},

					onPeriodicityChange : function(oEvent) {
						this.LoadTimeIntervals(true, oEvent.getSource()
								.getSelectedKey());
						this.reRenderTopNSlider = true;
					},
					bubblechange : function(oEvent) {
						var Opportunites = this.getView().getModel(
								"Opportunities").oData;

						for ( var i = 0; i < Opportunites.length; i++)
							if (Opportunites[i].Guid == oEvent
									.getParameter('item')['key']) {
								if (oEvent.getParameter('item')['z']) {
									Opportunites[i].ExpectedSalesVolume = oEvent
											.getParameter('item')['z'];
								} else {
									Opportunites[i].ChanceOfSuccess = oEvent
											.getParameter('item')['y'];
									Opportunites[i].ClosingDate = oEvent
											.getParameter('item')['x'];
								}
								this.updateChangedData(oEvent
										.getParameter('item')['key'], i);
							}
						var jMod = new sap.ui.model.json.JSONModel(Opportunites);
						this.getView().setModel(jMod, "Opportunities");
						this.calculateProgress();
					},

					// Opportunity Click
					bubbleclick : function(oEvent) {
						this.iChangeStartDate = 0;
						this.iChangeEndDate = 0;

						// var ec = this.getView().byId("po");
						var ec = this.oFragmentList.opportunityPopover;
						ec.close();
						var oModel = this.oDataModel;
						oModel.setCountSupported(false);
						var opp = this.getView().getModel("Opportunities").oData;
						this.guidVal = oEvent.getParameter('item').key;
						var that = this;
						var pType, pStageCode, pForecast, pSuccess, pStatusCode, pCurrCode, pAccountName;
						var pExpRev, oppSalesTeam, pOppId, pOppDescription, pEmpRespName, pContactname, pContactId;

						// that.getView().byId("mainContact").setVisible(false);
						// that.getView().byId("empResp").setVisible(false);
						sap.ui.getCore().byId("mainContact").setVisible(false);
						sap.ui.getCore().byId("empResp").setVisible(false);

						var Actualopp = this.getView().getModel(
								"OpportunitiesOld").oData;

						for ( var i = 0; i < opp.length; i++) {
							if (Actualopp[i].Guid === this.guidVal) {
								this.actualStartDate = Actualopp[i].StartDate;
								this.actualEndDate = Actualopp[i].ClosingDate;
								this.actualExpRevval = Actualopp[i].ExpectedSalesVolume;
							}
							if (opp[i].Guid === this.guidVal) {
								this.selOpp = opp[i];
								pStatusCode = this.selOpp.UserStatusCode;
								pStageCode = this.selOpp.SalesStageCode;
								pType = this.selOpp.ProcessType;
								pCurrCode = this.selOpp.CurrencyCode;
								pEmpRespName = this.selOpp.EmployeeName;
								pContactname = this.selOpp.ContactPersonName;
								pContactId = this.selOpp.ContactPersonID;
								pAccountName = this.selOpp.AccountName;
								this.pAccountId = this.selOpp.AccountID;
								this.pContactId = this.selOpp.ContactPersonID;
								pOppId = this.selOpp.Id;
								pOppDescription = this.selOpp.Description;
								break;
							}
						}

						// that.getView().byId("OppId").setText(pOppId);
						// that.getView().byId("OppDescription").setText(
						// pOppDescription);
						sap.ui.getCore().byId("OppId").setText(pOppId);
						sap.ui.getCore().byId("OppDescription").setText(
								pOppDescription);

						// Currency text
						var currCode = " (" + pCurrCode + ")";
						// var LBexpRev = that.getView().byId("lblExpRev");
						// var LBwgtRev = that.getView().byId("lblWgtRev");
						var LBexpRev = sap.ui.getCore().byId("lblExpRev");
						var LBwgtRev = sap.ui.getCore().byId("lblWgtRev");
						LBexpRev.setText(this.oBundle
								.getText("LBL_OD_EXPECTEDREVENUE")
								+ currCode);
						LBwgtRev.setText(this.oBundle
								.getText("LBL_OD_WEIGHTEDREVENUE")
								+ currCode);

						var oppRead = [
								oModel
										.createBatchOperation(
												"OpportunityStatuses?$filter="
														+ jQuery.sap
																.encodeURL("HeaderGuid eq guid'"
																		+ this.guidVal
																		+ "'"),
												"GET"),
								oModel
										.createBatchOperation(
												"SalesStages?$filter="
														+ jQuery.sap
																.encodeURL("ProcessType eq '"
																		+ pType
																		+ "'"),
												"GET"),
								oModel
										.createBatchOperation(
												"Opportunities(guid'"
														+ this.guidVal
														+ "')?$expand=SalesTeam",
												"GET") ];
						oModel.addBatchReadOperations(oppRead);
						oModel.setHeaders({
							"X-REQUESTED-WITH" : "XMLHttpRequest"
						});
						this.selOpp.StatusEmpty = true;
						this.selOpp.SalesStageEmpty = true;
						var fnS2 = function(odata, response) {
							var batchResults = odata.__batchResponses;
							for ( var i = 0; i < batchResults.length; i++) {
								if (parseInt(batchResults[i].statusCode) !== 200) {
									that.showErrorMsg(batchResults[i], true);
									break;
								} else
									switch (i) {
									case 0:
										var statusModel = new sap.ui.model.json.JSONModel(
												batchResults[i].data.results);
										// var statuses1 = that.getView().byId(
										// "status1");
										var statuses1 = sap.ui.getCore().byId(
												"status1");
										statuses1.setModel(statusModel,
												"StatusMgt");
										var objStatusProfile = null, bCheck = false;
										for ( var j = -1, oCurStatus; oCurStatus = that.arrStatusPros[++j];)
											if (batchResults[i].data.results[0].HeaderGuid == oCurStatus.HeaderGuid) {
												bCheck = true;
												break;
											}
										if (!bCheck) {
											objStatusProfile = new Object(
													{
														"HeaderGuid" : batchResults[i].data.results[0].HeaderGuid,
														"StatusProfile" : batchResults[i].data.results[0].StatusProfile,
														"Statuses" : batchResults[i].data.results
													});
											that.arrStatusPros
													.push(objStatusProfile);
										}
										var aItemList = null;
										for ( var j = -1; aItemList = statuses1
												.getItems()[++j];)
											if (aItemList.getKey() == pStatusCode) {
												that.selOpp.StatusEmpty = false;
												break;
											}
										if (that.selOpp.StatusEmpty)
											statuses1.setSelectedItem(statuses1
													.getItems()[0]);
										else
											statuses1
													.setSelectedItem(aItemList);
										// NOT WORKING several times
										// statuses1.setSelectedKey(pStatusCode);

										break;
									case 1:
										var StagesModel = new sap.ui.model.json.JSONModel(
												batchResults[i].data.results);
										// var stages = that.getView().byId(
										// "salesStage1");
										var stages = sap.ui.getCore().byId(
												"salesStage1");
										stages
												.setModel(StagesModel,
														"SalesOpp");
										var objStagesProfile = null, bCheck = false;
										for ( var j = -1, oCurStage; oCurStage = that.arrStagesPros[++j];)
											if (that.guidVal == oCurStage.guidVal) {
												bCheck = true;
												break;
											}
										if (!bCheck) {
											objStagesProfile = new Object(
													{
														"guidVal" : that.guidVal,
														"ProcessType" : batchResults[i].data.results[0].ProcessType,
														"Stages" : batchResults[i].data.results
													});
											that.arrStagesPros
													.push(objStagesProfile);
										}
										var aItemList = null;
										for ( var j = -1; aItemList = stages
												.getItems()[++j];)
											if (aItemList.getKey() == pStageCode) {
												that.selOpp.SalesStageEmpty = false;
												break;
											}
										if (that.selOpp.SalesStageEmpty)
											stages.setSelectedItem(stages
													.getItems()[0]);
										else
											stages.setSelectedItem(aItemList);
										// NOT WORKING several times
										// stages.setSelectedKey(pStageCode);
										break;
									case 2:
										oppSalesTeam = batchResults[i].data.SalesTeam.results;
										break;
									}
							}
						};
						var fnE2 = function(oError) {
							that.showErrorMsg(oError, true);
						};
						oModel.submitBatch(fnS2, fnE2, false);

						var utilForm = cus.crm.salespipeline.sim.util.formatter;
						// switch value for forecast relevance
						// if (this.selOpp.ForecastRelevance == "X")
						// that.getView().byId("forecastId").setState(true);
						// else if (this.selOpp.ForecastRelevance == "")
						// that.getView().byId("forecastId").setState(false);
						if (this.selOpp.ForecastRelevance == "X")
							sap.ui.getCore().byId("forecastId").setState(true);
						else if (this.selOpp.ForecastRelevance == "")
							sap.ui.getCore().byId("forecastId").setState(false);

						// Chance of Success
						var x = parseFloat(this.selOpp.ChanceOfSuccess) + "%";
						// that.getView().byId("chanceOfSucc").setValue(x);
						sap.ui.getCore().byId("chanceOfSucc").setValue(x);

						// Start date
						var d1 = new Date(this.selOpp.StartDate.toDateString());
						// that.getView().byId("d1").setValue(
						// utilForm.displayDates(d1));
						// that.getView().byId("calStart").setCurrentDate(
						// d1.toDateString());
						sap.ui.getCore().byId("d1").setValue(
								utilForm.displayDates(d1));
						sap.ui.getCore().byId("calStart").setCurrentDate(
								d1.toDateString());

						// End date
						var d2 = new Date(this.selOpp.ClosingDate
								.toDateString());
						// that.getView().byId("d2").setValue(
						// utilForm.displayDates(d2));
						// that.getView().byId("calEnd").setCurrentDate(
						// d2.toDateString());
						sap.ui.getCore().byId("d2").setValue(
								utilForm.displayDates(d2));
						sap.ui.getCore().byId("calEnd").setCurrentDate(
								d2.toDateString());

						// Expected Revenue
						// var expRev = that.getView().byId("expRevId");
						var expRev = sap.ui.getCore().byId("expRevId");
						expRev.setValue(utilForm.displayNumbers(Math
								.round(this.selOpp.ExpectedSalesVolume)));

						// Weighted revenue
						var wtRevVal = (this.selOpp.ExpectedSalesVolume * this.selOpp.ChanceOfSuccess) / 100;
						// that.getView().byId("wgtRevId").setValue(
						// utilForm.displayNumbers(wtRevVal));
						sap.ui.getCore().byId("wgtRevId").setValue(
								utilForm.displayNumbers(wtRevVal));

						// Sales Team data
						if (oppSalesTeam != undefined) {
							for ( var i = -1, oCurST; oCurST = oppSalesTeam[++i];) {
								switch (parseInt(oCurST.PartnerFuntionCode)) {
								case 14:
									sap.ui.getCore().byId("empResp")
											.setVisible(true);
									sap.ui.getCore().byId("empRespName")
											.setText(oCurST.PartnerName);
									if (oCurST.Email != undefined
											&& oCurST.Email != "") {
										var oEREmail = sap.ui.getCore().byId(
												"empRespEmail");
										oEREmail.setVisible(true);
										oEREmail.setText(oCurST.Email);
									}
									if (oCurST.Telephone != undefined
											&& oCurST.Telephone != "") {
										var oERPhone = sap.ui.getCore().byId(
												"empRespPhone");
										oERPhone.setVisible(true);
										oERPhone.setText(oCurST.Telephone);
									}
									break;
								case 15:
									sap.ui.getCore().byId("mainContact")
											.setVisible(true);
									sap.ui.getCore().byId("mainContactName")
											.setText(oCurST.PartnerName);
									if (oCurST.Email != undefined
											&& oCurST.Email != "") {
										var oMCEmail = sap.ui.getCore().byId(
												"mcEmail");
										oMCEmail.setVisible(true);
										oMCEmail.setText(oCurST.Email);
									}
									if (oCurST.Telephone != undefined
											&& oCurST.Telephone != "") {
										var oMCPhone = sap.ui.getCore().byId(
												"mcPhone");
										oMCPhone.setVisible(true);
										oMCPhone.setText(oCurST.Telephone);
									}
									break;
								default:
									break;
								}
							}
						}

						// that.getView().byId("accName").setText(pAccountName);
						sap.ui.getCore().byId("accName").setText(pAccountName);
						that.selectedbubble = oEvent.getParameter('item').key;
						if (sap.ui.Device.system.phone) {
							// that.getView().byId("upBtn").setVisible(true);
							// that.getView().byId("downBtn").setVisible(true);
							sap.ui.getCore().byId("upBtn").setVisible(true);
							sap.ui.getCore().byId("downBtn").setVisible(true);
						} else {
							that.overlappingBubbles = oEvent
									.getParameter('item').overlappedbubbles;
							var titleOpp = sap.ui.getCore().byId("poBar");
							if (that.overlappingBubbles.length > 1) {
								// that.getView().byId("upBtn").setVisible(true);
								// that.getView().byId("downBtn").setVisible(true);
								// titleOpp.addContentLeft(that.getView().byId(
								// "oppDetails"));
								sap.ui.getCore().byId("upBtn").setVisible(true);
								sap.ui.getCore().byId("downBtn").setVisible(
										true);
								titleOpp.addContentLeft(sap.ui.getCore().byId(
										"oppDetails"));
								titleOpp.removeAllContentMiddle();
							} else {
								// that.getView().byId("upBtn").setVisible(false);
								// that.getView().byId("downBtn")
								// .setVisible(false);
								// titleOpp.addContentMiddle(that.getView().byId(
								// "oppDetails"));
								sap.ui.getCore().byId("upBtn")
										.setVisible(false);
								sap.ui.getCore().byId("downBtn").setVisible(
										false);
								titleOpp.addContentMiddle(sap.ui.getCore()
										.byId("oppDetails"));
								titleOpp.removeAllContentLeft();
							}
						}

						/**
						 * @ControllerHook Provision for Additional Fields in
						 *                 the Opportunity Popover. If you need
						 *                 to display the additional fields
						 *                 directly, this method enables you to
						 *                 set the data to those additional
						 *                 fields. This is called when you
						 *                 select the bubble in the Sales
						 *                 Pipeline.
						 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookOpportunityPopover
						 * @return {void}
						 */
						if (this.extHookOpportunityPopover)
							this.extHookOpportunityPopover();
						ec.openBy(oEvent.getParameter('item').selected);
					},

					cancelChangeOpp : function() {
						// this.getView().byId("po").close();
						this.oFragmentList.opportunityPopover.close();
					},

					moveUp : function() {
						var that = this;
						var nameVal = this.getView().byId("name");
						var value = nameVal.getValue();
						var value2 = nameVal.getValue2();
						var units = nameVal.getUnits();
						var FilteredOpportunites = [];
						var labelsTexts = [];
						var labelsValues = [];
						var startDate = null;
						var endDate = null;
						var chart = this.getView().byId("chart_sim");
						var index = 0;
						if (sap.ui.Device.system.phone == true) {
							var timeinterval = this.getView().getModel(
									"TimeIntervals");
							var Opportunites = this.getView().getModel(
									"Opportunities").oData;

							for ( var i = value; i <= value2; i++) {
								labelsTexts[i - value] = units[i].getValue();
								labelsValues[i - value] = units[i].getKey();
								if (i == value)
									startDate = units[i].getKey();
								if (i == value2)
									endDate = timeinterval.oData[i].TimeTo;
							}

							for ( var i = 0; i < Opportunites.length; i++)
								if ((Opportunites[i].ClosingDate >= startDate)
										&& (Opportunites[i].ClosingDate <= endDate)) {
									FilteredOpportunites.push(Opportunites[i]);
								}

							for ( var i = 0; i < FilteredOpportunites.length; i++)
								if (FilteredOpportunites[i].Guid === that.selectedbubble) {
									index = i + 1;
									if (index >= FilteredOpportunites.length)
										index = 0;
								}
							chart
									.setSelection(FilteredOpportunites[index].Guid);
						} else {
							for ( var i = 0; i < that.overlappingBubbles.length; i++)
								if (that.overlappingBubbles[i].id === that.selectedbubble) {
									index = i + 1;
									if (index >= that.overlappingBubbles.length)
										index = 0;
								}
							chart
									.setSelection(that.overlappingBubbles[index].id);
						}
					},

					moveDown : function() {
						var that = this;
						var value = this.getView().byId("name").getValue();
						var value2 = this.getView().byId("name").getValue2();
						var units = this.getView().byId("name").getUnits();
						var FilteredOpportunites = [];
						var labelsTexts = [];
						var labelsValues = [];
						var startDate = null;
						var endDate = null;

						var timeinterval = this.getView().getModel(
								"TimeIntervals");
						var Opportunites = this.getView().getModel(
								"Opportunities").oData;
						var chart = this.getView().byId("chart_sim");
						var index = 0;
						if (sap.ui.Device.system.phone == true) {
							for ( var i = value; i <= value2; i++) {
								labelsTexts[i - value] = units[i].getValue();
								labelsValues[i - value] = units[i].getKey();

								if (i == value)
									startDate = units[i].getKey();
								if (i == value2)
									endDate = timeinterval.oData[i].TimeTo;
							}

							for ( var i = 0; i < Opportunites.length; i++)
								if ((Opportunites[i].ClosingDate >= startDate)
										&& (Opportunites[i].ClosingDate <= endDate)) {
									FilteredOpportunites.push(Opportunites[i]);
								}
							for ( var i = 0; i < FilteredOpportunites.length; i++)
								if (FilteredOpportunites[i].Guid === that.selectedbubble) {
									index = i - 1;
									if (index < 0)
										index = FilteredOpportunites.length - 1;
								}

							chart
									.setSelection(FilteredOpportunites[index].Guid);
						} else {
							for ( var i = 0; i < that.overlappingBubbles.length; i++)
								if (that.overlappingBubbles[i].id === that.selectedbubble) {
									index = i - 1;
									if (index < 0)
										index = that.overlappingBubbles.length - 1;
								}
							chart
									.setSelection(that.overlappingBubbles[index].id);
						}
					},

					// Apply all changes made in the Opportunity Popover to the
					// bubble and register the changes in Change Log
					submitChangeOpp : function(oEvent) {
						var Opportunites = this.getView().getModel(
								"Opportunities").oData;
						// var pExpRev = that.getView().byId("expRevId")
						// .getValue();

						var pExpRev = sap.ui.getCore().byId("expRevId")
								.getValue();
						for ( var i = 0; i < Opportunites.length; i++) {
							if (Opportunites[i].Guid == this.guidVal) {
								if (this.iChangeStartDate == 1)
									Opportunites[i].StartDate = this.currStartDate;
								if (this.iChangeEndDate == 1)
									Opportunites[i].ClosingDate = this.currEndDate;
								if (this.iChangeCOS == 0) {
									Opportunites[i].ChanceOfSuccess = parseFloat(this
											.unformatChangeLog(
													"ChanceOfSuccess",
													// that.getView().byId(
													// "chanceOfSucc")
													// .getValue()));
													sap.ui.getCore().byId(
															"chanceOfSucc")
															.getValue()));
								}
								if (this.compose(pExpRev) != this.actualExpRevval
										&& this.iChangeExpRev == 0) {
									if (isNaN(this.compose(pExpRev)))
										Opportunites[i].ExpectedSalesVolume = this.actualExpRevval;
									else
										Opportunites[i].ExpectedSalesVolume = this
												.compose(pExpRev);
								} else
									this.selOpp.ExpectedSalesVolume = this.actualExpRevval;

								if (!this.selOpp.SalesStageEmpty)
									Opportunites[i].SalesStageCode = sap.ui
											.getCore().byId("salesStage1")
											.getSelectedKey();

								if (!this.selOpp.StatusEmpty)
									Opportunites[i].UserStatusCode = sap.ui
											.getCore().byId("status1")
											.getSelectedKey();

								if (sap.ui.getCore().byId("forecastId")
										.getState())
									Opportunites[i].ForecastRelevance = "X";
								else
									Opportunites[i].ForecastRelevance = "";

								this.updateChangedData(this.guidVal, i);
								// this.getView().byId("po").close();
								this.oFragmentList.opportunityPopover.close();
								this.getView().getModel("Opportunities")
										.refresh();
								this.calculateProgress();
							}
						}

					},

					// Save all the changed Opportunities using BATCH operation
					// and commit them to the CRM backend
					saveAllOpp : function() {
						var that = this, isDateValid = true, endDateErrorOpportunities = [], item = {};
						var fnSuccess = function(oResponses) {
							sap.ca.ui.message.showMessageToast(that.oBundle
									.getText("LBL_SUCCESSUPDATE"));

							that.LoadOpportunities(false);
							that.getView().getModel("Opportunities").refresh();
							that.setMinMax();
							that.resetChangeLog();
							that.showTopNOpp();
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, false);
						};
						for ( var i = 0; i < this.changeData.opportunity.length; i++) {
							// isDateValid = true;
							var oppCount = 0;
							var oEntry = new Object({
								"Guid" : "",
							});
							for ( var j = 0; j < this.changeData.opportunity[i].items.length; j++) {
								var changedData = this.changeData.opportunity[i].items[j];
								if ("UserStatusCode" == this.changeData.opportunity[i].items[j].text) {
									var oStatusEntry = new Object({
										"HeaderGuid" : "",
										"StatusProfile" : "",
										"UserStatusCode" : ""
									});
									oStatusEntry.HeaderGuid = this.changeData.opportunity[i].key;
									for ( var k = 0; k < that.arrStatusPros.length; k++)
										if (that.arrStatusPros[k].HeaderGuid == oStatusEntry.HeaderGuid) {
											oStatusEntry.StatusProfile = that.arrStatusPros[k].StatusProfile;
											break;
										}
									oStatusEntry.UserStatusCode = this
											.unformatChangeLog(
													changedData.text,
													changedData.NewValue,
													oStatusEntry.HeaderGuid);

									var statusUpdateUrl = "/OpportunityStatuses(StatusProfile='"
											+ oStatusEntry.StatusProfile
											+ "',UserStatusCode='"
											+ oStatusEntry.UserStatusCode
											+ "',HeaderGuid=guid'"
											+ oStatusEntry.HeaderGuid + "')";
									this.oDataModel
											.addBatchChangeOperations([ this.oDataModel
													.createBatchOperation(
															statusUpdateUrl,
															"MERGE",
															oStatusEntry, null) ]);
									continue;
								} else if (oppCount == 0) {
									oEntry.Guid = this.changeData.opportunity[i].key;
									oppCount++;
								}
								switch (this.changeData.opportunity[i].items[j].text) {
								case "ChanceOfSuccess":
									oEntry.ChanceOfSuccess = this
											.unformatChangeLog(
													changedData.text,
													changedData.NewValue);
									break;
								case "ClosingDate":
									if (typeof changedData.NewValue === "string") {
										var newEndDate = this
												.unformatChangeLog(
														"ClosingDate",
														changedData.NewValue,
														this.changeData.opportunity[i].key);
										var oldStartDate = this
												.unformatChangeLog(
														"ClosingDate",
														changedData.StartDate,
														this.changeData.opportunity[i].key);
										if (newEndDate < oldStartDate) {
											isDateValid = false;
											item = {};
											item["opportunityName"] = this.changeData.opportunity[i].Name;
											item["opportunityKey"] = this.changeData.opportunity[i].key;

											endDateErrorOpportunities
													.push(item);
										} else {
											oEntry.ClosingDate = this
													.unformatChangeLog(
															changedData.text,
															changedData.NewValue);
										}
									}
									break;
								case "StartDate":
									if (typeof changedData.NewValue === "string") {
										oEntry.StartDate = this
												.unformatChangeLog(
														changedData.text,
														changedData.NewValue);
									}
									break;
								case "ExpectedSalesVolume":
									oEntry.ExpectedSalesVolume = this
											.unformatChangeLog(
													changedData.text,
													changedData.NewValue)
											+ ".0";
									oEntry.CurrencyCode = this.getView()
											.getModel("SalesPipelineSetting").oData.CurrencyCode;
									break;
								case "ForecastRelevance":
									oEntry.ForecastRelevance = this
											.unformatChangeLog(
													changedData.text,
													changedData.NewValue);
									break;
								case "SalesStageCode":
									oEntry.SalesStageCode = this
											.unformatChangeLog(
													changedData.text,
													changedData.NewValue,
													oEntry.Guid);
									break;
								}
								changedData = null;
							}

							if (isDateValid)
								if (oEntry.Guid != "") {
									var updateUrl = "/Opportunities(guid'"
											+ oEntry.Guid + "')";
									this.oDataModel
											.addBatchChangeOperations([ this.oDataModel
													.createBatchOperation(
															updateUrl, "MERGE",
															oEntry, null) ]);
								}
						}

						if (isDateValid) {
							this.oDataModel.setHeaders({
								"X-REQUESTED-WITH" : "XMLHttpRequest"
							});
							this.oDataModel.submitBatch(fnSuccess, fnError,
									false);
						} else {
							var errorMessage = this.oBundle
									.getText("LBL_ENDDATE_ERROR_LOPP")
									+ ": \n\n";
							for ( var i = 0; i < endDateErrorOpportunities.length; i++)
								errorMessage += endDateErrorOpportunities[i].opportunityName
										+ "\n";

							sap.ca.ui.message.showMessageBox({
								type : sap.ca.ui.message.Type.WARNING,
								message : errorMessage
							});
						}
					},

					changeLogSave : function() {
						var that = this, isDateValid = true, endDateErrorOpportunities = [], item = {};
						var fnSuccess = function(oResponses) {
							sap.ca.ui.message.showMessageToast(that.oBundle
									.getText("LBL_SUCCESSUPDATE"));
							// that.getView().getModel("Opportunities").refresh();
							that.setMinMax();
							that.resetChangeLog2();
							that.showTopNOpp();
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, false);
						};
						for ( var i = 0; i < this.changeData.opportunity.length; i++) {
							var oppCount = 0;
							var oEntry = new Object({
								"Guid" : "",
							});
							for ( var j = 0; j < this.changeData.opportunity[i].items.length; j++) {
								if (this.changeData.opportunity[i].items[j].checked == true) {
									var changedData = this.changeData.opportunity[i].items[j];
									if ("UserStatusCode" == this.changeData.opportunity[i].items[j].text) {
										var oStatusEntry = new Object({
											"HeaderGuid" : "",
											"StatusProfile" : "",
											"UserStatusCode" : ""
										});
										oStatusEntry.HeaderGuid = this.changeData.opportunity[i].key;
										for ( var k = 0; k < that.arrStatusPros.length; k++)
											if (that.arrStatusPros[k].HeaderGuid == oStatusEntry.HeaderGuid) {
												oStatusEntry.StatusProfile = that.arrStatusPros[k].StatusProfile;
												break;
											}
										oStatusEntry.UserStatusCode = this
												.unformatChangeLog(
														changedData.text,
														changedData.NewValue,
														oStatusEntry.HeaderGuid);

										var statusUpdateUrl = "/OpportunityStatuses(StatusProfile='"
												+ oStatusEntry.StatusProfile
												+ "',UserStatusCode='"
												+ oStatusEntry.UserStatusCode
												+ "',HeaderGuid=guid'"
												+ oStatusEntry.HeaderGuid
												+ "')";
										this.oDataModel
												.addBatchChangeOperations([ this.oDataModel
														.createBatchOperation(
																statusUpdateUrl,
																"MERGE",
																oStatusEntry,
																null) ]);
										continue;
									} else if (oppCount == 0) {
										oEntry.Guid = this.changeData.opportunity[i].key;
										oppCount++;
									}
									switch (this.changeData.opportunity[i].items[j].text) {
									case "ChanceOfSuccess":
										oEntry.ChanceOfSuccess = this
												.unformatChangeLog(
														changedData.text,
														changedData.NewValue);
										break;
									case "ClosingDate":
										if (typeof changedData.NewValue === "string") {
											var newEndDate = this
													.unformatChangeLog(
															"ClosingDate",
															changedData.NewValue,
															this.changeData.opportunity[i].key);
											var oldStartDate = this
													.unformatChangeLog(
															"ClosingDate",
															changedData.StartDate,
															this.changeData.opportunity[i].key);
											if (newEndDate < oldStartDate) {
												isDateValid = false;
												item = {};
												item["opportunityName"] = this.changeData.opportunity[i].Name;
												item["opportunityKey"] = this.changeData.opportunity[i].key;
												endDateErrorOpportunities
														.push(item);
											} else {
												oEntry.ClosingDate = this
														.unformatChangeLog(
																changedData.text,
																changedData.NewValue);
											}
										}
										break;
									case "StartDate":
										if (typeof changedData.NewValue === "string") {
											oEntry.StartDate = this
													.unformatChangeLog(
															changedData.text,
															changedData.NewValue);
										}
										break;
									case "ExpectedSalesVolume":
										oEntry.ExpectedSalesVolume = this
												.unformatChangeLog(
														changedData.text,
														changedData.NewValue)
												+ ".0";
										oEntry.CurrencyCode = this.getView()
												.getModel(
														"SalesPipelineSetting").oData.CurrencyCode;
										break;
									case "ForecastRelevance":
										oEntry.ForecastRelevance = this
												.unformatChangeLog(
														changedData.text,
														changedData.NewValue);
										break;
									case "SalesStageCode":
										oEntry.SalesStageCode = this
												.unformatChangeLog(
														changedData.text,
														changedData.NewValue,
														oEntry.Guid);
										break;
									}
									changedData = null;
								}
							}
							if (isDateValid)
								if (oEntry.Guid != "") {
									var updateUrl = "/Opportunities(guid'"
											+ oEntry.Guid + "')";
									this.oDataModel
											.addBatchChangeOperations([ this.oDataModel
													.createBatchOperation(
															updateUrl, "MERGE",
															oEntry, null) ]);
								}
						}
						if (isDateValid) {
							this.oDataModel.setHeaders({
								"X-REQUESTED-WITH" : "XMLHttpRequest"
							});
							this.oDataModel.submitBatch(fnSuccess, fnError,
									false);
						} else {
							var errorMessage = this.oBundle
									.getText("LBL_ENDDATE_ERROR_LOPP")
									+ ": \n\n";
							for ( var i = 0; i < endDateErrorOpportunities.length; i++)
								errorMessage += endDateErrorOpportunities[i].opportunityName
										+ "\n";

							sap.ca.ui.message.showMessageBox({
								type : sap.ca.ui.message.Type.WARNING,
								message : errorMessage
							});
						}
					},

					// Start Date & End Date Validation in the Opportunity
					// Popover
					checkStartDate : function(oEvent) {
						var that = this;
						var paramDate = oEvent.getParameters(), oControl = oEvent
								.getSource();
						var utilForm = cus.crm.salespipeline.sim.util.formatter;
						var pInitialStartDate = this.selOpp.StartDate;

						if (paramDate.newValue != undefined) {
							var parsedDate = new Date(paramDate.newValue);

							if (parsedDate.toDateString() == "Invalid Date") {
								oControl.setValue(utilForm
										.displayDates(this.selOpp.StartDate));
								this.currStartDate = this.selOpp.StartDate;
							} else {
								var endDate = new Date(sap.ui.getCore().byId(
										'd2').getValue());
								var comparableStartDate = new Date(parsedDate);

								if (endDate < comparableStartDate) {
									sap.ui.getCore().byId('d1').setValue(
											pInitialStartDate);
									/*
									 * sap.m.MessageToast.show(that.oBundle
									 * .getText("LBL_ENDDATE_ERROR"), { duration :
									 * 10000
									 * 
									 * });
									 */
									sap.ca.ui.message.showMessageBox({
										type : sap.ca.ui.message.Type.WARNING,
										message : that.oBundle
												.getText("LBL_STARTDATE_ERROR")
									});
									oControl.setValue(utilForm
											.displayDates(pInitialStartDate));
									this.currStartDate = utilForm
											.convFromSixZeros(pInitialStartDate);
								} else {
									parsedDate = utilForm
											.convFromSixZeros(parsedDate);
									oControl.setValue(utilForm
											.displayDates(parsedDate));
									this.currStartDate = parsedDate;
								}
							}
						} else {
							var endDate = new Date(sap.ui.getCore().byId('d2')
									.getValue());
							var comparableStartDate = new Date(paramDate);

							if (endDate < comparableStartDate) {
								sap.ui.getCore().byId('d1').setValue(
										pInitialStartDate);
								/*
								 * sap.m.MessageToast.show(that.oBundle
								 * .getText("LBL_ENDDATE_ERROR"), { duration :
								 * 10000 });
								 */
								sap.ca.ui.message.showMessageBox({
									type : sap.ca.ui.message.Type.WARNING,
									message : that.oBundle
											.getText("LBL_STARTDATE_ERROR")
								});
								oControl.setValue(utilForm
										.displayDates(pInitialStartDate));
								this.currStartDate = utilForm
										.convFromSixZeros(pInitialStartDate);
							} else {
								paramDate = utilForm
										.convFromSixZeros(paramDate);
								oControl.setValue(utilForm
										.displayDates(paramDate));
								this.currStartDate = paramDate;
							}
						}

						if (this.currStartDate.toDateString() == this.actualStartDate
								.toDateString()) {
							this.iChangeStartDate = 0;
							this.selOpp.StartDate = this.actualStartDate;
						} else if (this.currStartDate.toDateString() == this.selOpp.StartDate
								.toDateString())
							this.iChangeStartDate = 0;
						else
							this.iChangeStartDate = 1;
					},

					checkEndDate : function(oEvent) {
						var that = this, oControl = oEvent.getSource();
						var paramDate = oEvent.getParameters();
						var pInitialEndDate = this.selOpp.ClosingDate;
						var utilForm = cus.crm.salespipeline.sim.util.formatter;
						if (paramDate.newValue != undefined) {
							var parsedDate = new Date(paramDate.newValue);
							if (parsedDate.toDateString() == "Invalid Date") {
								oControl.setValue(utilForm
										.displayDates(this.selOpp.EndDate));
								this.currEndDate = this.selOpp.EndDate;
							} else {

								var startDate = new Date(sap.ui.getCore().byId(
										'd1').getValue());
								var comparableEndDate = new Date(parsedDate);

								if (startDate > comparableEndDate) {
									sap.ui.getCore().byId('d2').setValue(
											pInitialEndDate);
									/*
									 * sap.m.MessageToast.show(that.oBundle
									 * .getText("LBL_STARTDATE_ERROR"), {
									 * duration : 10000 });
									 */
									sap.ca.ui.message.showMessageBox({
										type : sap.ca.ui.message.Type.WARNING,
										message : that.oBundle
												.getText("LBL_ENDDATE_ERROR")
									});
									oControl.setValue(utilForm
											.displayDates(pInitialEndDate));
									this.currEndDate = utilForm
											.convFromSixZeros(pInitialEndDate);
								} else {

									parsedDate = utilForm
											.convFromSixZeros(parsedDate);
									oControl.setValue(utilForm
											.displayDates(parsedDate));
									this.currEndDate = parsedDate;
								}

							}
						} else {

							var startDate = new Date(sap.ui.getCore()
									.byId('d1').getValue());
							var comparableEndDate = new Date(paramDate);

							if (startDate > comparableEndDate) {
								sap.ui.getCore().byId('d2').setValue(
										pInitialEndDate);
								/*
								 * sap.m.MessageToast.show(that.oBundle
								 * .getText("LBL_STARTDATE_ERROR"), { duration :
								 * 10000 });
								 */
								sap.ca.ui.message.showMessageBox({
									type : sap.ca.ui.message.Type.WARNING,
									message : that.oBundle
											.getText("LBL_ENDDATE_ERROR")
								});
								oControl.setValue(utilForm
										.displayDates(pInitialEndDate));
								this.currEndDate = utilForm
										.convFromSixZeros(pInitialEndDate);
							} else {

								paramDate = utilForm
										.convFromSixZeros(paramDate);
								oControl.setValue(utilForm
										.displayDates(paramDate));
								this.currEndDate = paramDate;
							}

						}

						if (this.currEndDate.toDateString() == this.actualEndDate
								.toDateString()) {
							this.iChangeEndDate = 0;
							this.selOpp.ClosingDate = this.actualEndDate;
						} else if (this.currEndDate.toDateString() == this.selOpp.ClosingDate
								.toDateString())
							this.iChangeEndDate = 0;
						else
							this.iChangeEndDate = 1;
					},

					showDD : function(oEvent) {
						// if (oEvent.oSource == this.getView().byId("d1")) {
						// this.getView().byId("calStart").setVisible(true);
						// } else if (oEvent.oSource ==
						// this.getView().byId("d2")) {
						// this.getView().byId("calEnd").setVisible(true);
						// }
						var oCalendar = null, oControl = oEvent.getSource();
						if (oControl == sap.ui.getCore().byId("d1"))
							oCalendar = sap.ui.getCore().byId("calStart");
						else if (oControl == sap.ui.getCore().byId("d2"))
							oCalendar = sap.ui.getCore().byId("calEnd");

						if (oCalendar.getVisible())
							oCalendar.setVisible(false);
						else
							oCalendar.setVisible(true);
					},

					closeOpport : function(oEvent) {
						// this.getView().byId("calStart").setVisible(false);
						// this.getView().byId("calEnd").setVisible(false);
						sap.ui.getCore().byId("calStart").setVisible(false);
						sap.ui.getCore().byId("calEnd").setVisible(false);
					},

					// Change Start & End Date in the Opportunity Popover
					changeStartDate : function(oEvent) {
						var oControl = oEvent.getSource();
						if (oControl.getSelectedDates().length == 1) {
							oControl
									.setCurrentDate(oControl.getSelectedDates()[0]);
							var changedDate = new Date(oControl
									.getCurrentDate());
							// this.getView().byId("d1").setValue(this.displayDates(changedDate));
							// this.getView().byId("d1").fireChange(changedDate);
							sap.ui.getCore().byId("d1").fireChange(changedDate);
						}
						oControl.setVisible(false);
					},

					changeEndDate : function(oEvent) {
						var oControl = oEvent.getSource();
						if (oControl.getSelectedDates().length == 1) {
							oControl
									.setCurrentDate(oControl.getSelectedDates()[0]);
							var changedDate = new Date(oControl
									.getCurrentDate());
							// this.getView().byId("d2").setValue(this.displayDates(changedDate));
							// this.getView().byId("d2").fireChange(changedDate);
							sap.ui.getCore().byId("d2").fireChange(changedDate);
						}
						oControl.setVisible(false);
					},

					// Check & Change Unweighted Expected Sales Volume in the
					// Opportunity Popover
					changeExpectedSV : function(oEvent) {
						var oControl = oEvent.getSource(), utilForm = cus.crm.salespipeline.sim.util.formatter;
						var parsedNum = utilForm.reverseNumbers(oControl
								.getValue());

						if (isNaN(parsedNum))
							/*
							 * sap.m.MessageToast.show(this.oBundle
							 * .getText("LBL_VAL_MSG"));
							 */
							sap.ca.ui.message.showMessageBox({
								type : sap.ca.ui.message.Type.WARNING,
								message : this.oBundle.getText("LBL_VAL_MSG")
							});
						else {
							if (parsedNum < this.minOpp) {
								oControl.setValue(utilForm
										.displayNumbers(this.minOpp));
								/*
								 * sap.m.MessageToast.show(this.oBundle
								 * .getText("LBL_VAL_MINEXPREV"), { duration :
								 * 15000 });
								 */
								sap.ca.ui.message.showMessageBox({
									type : sap.ca.ui.message.Type.WARNING,
									message : this.oBundle
											.getText("LBL_VAL_MINEXPREV")
								});
							} else if (parsedNum > this.maxOpp) {
								oControl.setValue(utilForm
										.displayNumbers(this.maxOpp));
								/*
								 * sap.m.MessageToast.show(this.oBundle
								 * .getText("LBL_VAL_MAXEXPREV"), { duration :
								 * 15000 });
								 */
								sap.ca.ui.message.showMessageBox({
									type : sap.ca.ui.message.Type.WARNING,
									message : this.oBundle
											.getText("LBL_VAL_MAXEXPREV")
								});
							} else
								oControl.setValue(utilForm
										.displayNumbers(parsedNum));
						}
					},

					// Check & Change Chance of Success in the Opportunity
					// Popover
					changeCOS : function(oEvent) {
						var oControl = oEvent.getSource(), successNum = oControl
								.getValue();
						var numbers = "^[0-9]+$";
						var numbers2 = "(\[0-9]{1,3})\%";

						if (isNaN(successNum))
							if (parseFloat(successNum) < 0) {
								oControl.setValue("0");
								/*
								 * sap.m.MessageToast.show(this.oBundle
								 * .getText("LBL_VAL_MINCHANCE"));
								 */
								sap.ca.ui.message.showMessageBox({
									type : sap.ca.ui.message.Type.INFO,
									message : this.oBundle
											.getText("LBL_VAL_MINCHANCE")
								});

							}
						if (parseFloat(successNum) > 100) {
							oControl.setValue("100");
							/*
							 * sap.m.MessageToast.show(this.oBundle
							 * .getText("LBL_VAL_MAXCHANCE"));
							 */
							sap.ca.ui.message.showMessageBox({
								type : sap.ca.ui.message.Type.INFO,
								message : this.oBundle
										.getText("LBL_VAL_MAXCHANCE")
							});
						}

						var successNum = oControl.getValue();
						if (successNum.match(numbers)
								|| successNum.match(numbers2))
							this.iChangeCOS = 0;
						else {
							this.iChangeCOS = 1;
							/*
							 * sap.m.MessageToast.show(this.oBundle
							 * .getText("LBL_VAL_MSG"));
							 */
							sap.ca.ui.message.showMessageBox({
								type : sap.ca.ui.message.Type.WARNING,
								message : this.oBundle.getText("LBL_VAL_MSG")
							});
						}
					},

					// Change Sales Stage in the Opportunity Popover and set the
					// Chance of Success if any pre-set value is available
					changeSalesStage : function(oEvent) {
						var selectedStage = oEvent.getParameter('selectedItem')
								.getKey();
						var salesStages = sap.ui.getCore().byId("salesStage1")
								.getModel("SalesOpp").oData;
						for ( var i = 0; i < salesStages.length; i++)
							if (salesStages[i].SalesStageCode == selectedStage) {
								sap.ui
										.getCore()
										.byId("chanceOfSucc")
										.setValue(
												parseFloat(salesStages[i].ChanceOfSuccess)
														+ "%");
								break;
							}
					},

					compose : function(i) {
						var utilForm = cus.crm.salespipeline.sim.util.formatter;
						var composedNum = utilForm.reverseNumbers(i);
						// var dispNum = numFormat.format(composedNum);
						return composedNum + ".00";
					},

					// CROSS-APP Navigation to other Fiori Applications -
					// (1) Accounts
					toAccountApp : function() {
						var fgetService = sap.ushell && sap.ushell.Container
								&& sap.ushell.Container.getService;
						var oCrossAppNavigator = fgetService
								&& fgetService("CrossApplicationNavigation");
						var sAccParam = isNaN(parseInt(this.pAccountId)) ? this.pAccountId
								: parseInt(this.pAccountId).toString();
						var sAccountApp = oCrossAppNavigator
								&& oCrossAppNavigator.hrefForExternal({
									target : {
										semanticObject : "Account",
										action : "MyAccounts"
									},
									appSpecificRoute : [
											"&",
											"detail",
											"AccountCollection('" + sAccParam
													+ "')" ].join("/"),
								// params : {
								// accountID : sAccParam
								// }
								}) || "";

						this.cancelChangeOpp();
						if (!this.getView().byId("butSave").getVisible())
							window.location = sAccountApp;
						else {
							this.oNavParams.toAccountApp = sAccountApp;
							this.oFragmentList.resetDialog.open();
						}
					},

					// CROSS-APP Navigation to other Fiori Applications -
					// (2) Opportunities
					toOppApp : function() {
						var fgetService = sap.ushell && sap.ushell.Container
								&& sap.ushell.Container.getService;
						var oCrossAppNavigator = fgetService
								&& fgetService("CrossApplicationNavigation");
						var sOppApp = oCrossAppNavigator
								&& oCrossAppNavigator.hrefForExternal({
									target : {
										semanticObject : "Opportunity",
										action : "manageOpportunity"
									},
									params : {
										guid : this.guidVal
									}
								}) || "";
						this.cancelChangeOpp();
						if (!this.getView().byId("butSave").getVisible())
							window.location = sOppApp;
						else {
							this.oNavParams.toOppApp = sOppApp;
							this.oFragmentList.resetDialog.open();
						}
					},

					// CROSS-APP Navigation to other Fiori Applications -
					// (3) Contacts
					toContactApp : function() {

						var fgetService = sap.ushell && sap.ushell.Container
								&& sap.ushell.Container.getService;
						var oCrossAppNavigator = fgetService
								&& fgetService("CrossApplicationNavigation");
						var sAccParam = isNaN(parseInt(this.pAccountId)) ? this.pAccountId
								: parseInt(this.pAccountId).toString();
						var sConParam = isNaN(parseInt(this.pContactId)) ? this.pContactId
								: parseInt(this.pContactId).toString();
						var sContactApp = oCrossAppNavigator
								&& oCrossAppNavigator.hrefForExternal({
									target : {
										semanticObject : "ContactPerson",
										action : "MyContacts"
									},
									params : {
										accountID : sAccParam,
										contactID : sConParam,
									}
								}) || "";

						this.cancelChangeOpp();
						if (!this.getView().byId("butSave").getVisible())
							window.location = sContactApp;
						else {
							this.oNavParams.toContactApp = sContactApp;
							this.oFragmentList.resetDialog.open();
						}
					},

					/*
					 * FIORI WAVE 2 - Branch : Rel - 1.0 END of INITAL
					 * DEVELOPMENT for SimulateSalesPipeline
					 */

					/*
					 * FIORI WAVE 3 - Branch : Rel - 1.1 START of ENHANCEMENTS
					 * for SimulateSalesPipeline
					 */
					/*
					 * @ControllerHook Provision for Additional Fields in the
					 * Opportunity Popover. If required to see the additional
					 * fields directly, this methods enables you to set the data
					 * to those additional fields. This is called when the
					 * bubble in the Sales Pipeline is selected. The hook must
					 * be documented like: @callback
					 * sap.ca.scfld.md.controller.BaseFullscreenController~extHookOpportunityPopover
					 * @return {void}
					 */
					// extHookOpportunityPopover : function() {
					//
					// },
					/*
					 * FIORI WAVE 3 - Branch : Rel - 1.1 END of ENHANCEMENTS for
					 * SimulateSalesPipeline
					 */

					/*
					 * FIORI WAVE 4 - Branch : Rel - 1.2 START of ENHANCEMENTS
					 * for SimulateSalesPipeline
					 */

					renderTopNSlider : function(oEvent) {
						if (!this.oFragmentList.TopNSlider) {
							this.oFragmentList.TopNSlider = new sap.ui.xmlfragment(
									'cus.crm.salespipeline.sim.view.opportunitySlider',
									this);
							this.oFragmentList.TopNSlider.setModel(this
									.getView().getModel("i18n"), "i18n");
						}
						this.oFragmentList.TopNSlider
								.openBy(oEvent.getSource());
					},

					_setTopNSliderLabel : function(maxValue, value) {
						var core = sap.ui.getCore();
						if (value == undefined)
							value = maxValue;
						if (maxValue > 0) {
							core.byId('opportunitySlider').setEnabled(true)
									.setMin(1).setMax(maxValue).setValue(value);
							if (maxValue > 1) {
								core.byId('exLostCheck').setEnabled(true);
								core.byId('exWonCheck').setEnabled(true);
							}
							if (maxValue > value) {
								var noOfTopOppText = this.oBundle.getText(
										"LBL_NOOFTO_SELECTED", value);
								core.byId('sliderLabel')
										.setText(noOfTopOppText);
							} else {
								var allOppText = this.oBundle
										.getText("LBL_ALLTO_SELECTED");
								core.byId('sliderLabel').setText(allOppText);
							}
						} else {
							core.byId('opportunitySlider').setMin(0).setMax(0)
									.setValue(0).setEnabled(false);
							var noOppText = this.oBundle
									.getText("LBL_NOTO_SELECTED");
							core.byId('sliderLabel').setText(noOppText);
							if (!(core.byId('exLostCheck').getSelected() || core
									.byId('exWonCheck').getSelected())) {
								core.byId('exLostCheck').setEnabled(false);
								core.byId('exWonCheck').setEnabled(false);
							}
						}
					},

					_isFilteredStatus : function(opportunity) {
						var excludeLost = sap.ui.getCore().byId('exLostCheck')
								.getSelected();
						var excludeWon = sap.ui.getCore().byId('exWonCheck')
								.getSelected();
						if (excludeLost == true || excludeWon == true) {
							var bTCode = this._getBTCode(opportunity);
							if (excludeLost == true) {
								if (bTCode == "LOST") {
									return true;
								}
							}
							if (excludeWon == true) {
								if (bTCode == "WINN") {
									return true;
								}
							}
						}
						return false;
					},

					_getCurrFilteredOpp : function(localOpportunity) {
						var dateSlider = this.getView().byId("chart_sim");
						var dateSliderStartDate = dateSlider._xAxis.xStart;
						var dateSliderEndDate = dateSlider._xAxis.xEnd;
						localOpportunity.sort(function(a, b) {
							return b.ExpectedSalesVolume
									- a.ExpectedSalesVolume;
						});
						var length = localOpportunity.length;
						for ( var i = 0; i < length; i++) {
							var currOppEndDate = localOpportunity[i].ClosingDate;
							if (!((dateSliderStartDate <= currOppEndDate) && (currOppEndDate <= dateSliderEndDate))) {
								localOpportunity.splice(i, 1);
								i--;
								length--;
								continue;
							}
							if (this._isFilteredStatus(localOpportunity[i])) {
								localOpportunity.splice(i, 1);
								i--;
								length--;
							}
						}
						return localOpportunity;
					},

					_getTopNOpp : function(isSliding, isSelected) {
						var slider = sap.ui.getCore().byId('opportunitySlider');
						var sliderVal = sap.ui.getCore().byId(
								'opportunitySlider').getValue();
						var localOpportunity = this
								._getCurrFilteredOpp(this.Opportunities
										.slice(0));
						var noOfFilteredOpp = localOpportunity.length;
						if ((sliderVal >= noOfFilteredOpp)
								|| (slider.getMax() == sliderVal)
								|| (sliderVal == 0))
							this._setTopNSliderLabel(noOfFilteredOpp);
						else {
							this
									._setTopNSliderLabel(noOfFilteredOpp,
											sliderVal);
							localOpportunity = localOpportunity.slice(0,
									sliderVal);
						}
						return localOpportunity;
					},

					showTopNOpp : function(oEvent) {
						var isSliding = false, isSelected = false, bIsSalesPeriodSeen = true;
						if (oEvent != undefined) {
							var oControl = oEvent.getSource();
							if (oControl.sId == "opportunitySlider")
								isSliding = true;
							if (oControl.sId == 'exLostCheck'
									|| oEvent.getSource().sId == 'exWonCheck')
								isSelected = true;
							var oSettings = this.getView().getModel(
									"SalesPipelineSetting").oData, oSlider = this
									.getView().byId("name");
							var dSOP = oSettings.StartOfPeriod, dEOP = oSettings.EndOfPeriod;
							var dSS = oSlider.getUnits()[oSlider.getValue()]
									.getKey(), dSE = oSlider.getUnits()[oSlider
									.getValue2()].getKey();
							if (dSOP >= dSE || dEOP <= dSS)
								bIsSalesPeriodSeen = false;
						}
						var localOpportunity = this._getTopNOpp(isSliding,
								isSelected);
						var jModelForTopOpportunities = new sap.ui.model.json.JSONModel(
								localOpportunity);
						this.getView().setModel(jModelForTopOpportunities,
								"Opportunities");
						this.copyOpportunities("OpportunitiesOld");
						if ((isSliding || isSelected) && bIsSalesPeriodSeen)
							this.calculateProgress();
					},

					_initializeAllControllerFragments : function() {
						var i18nModel = this.getView().getModel("i18n");
						// Making it work with the latest UI5 1.22.0 onwards
						// this.oFragmentList = {};
						if (!this.oFragmentList.TopNSlider) {
							this.oFragmentList.TopNSlider = new sap.ui.xmlfragment(
									'cus.crm.salespipeline.sim.view.opportunitySlider',
									this);
							this.oFragmentList.TopNSlider.setModel(i18nModel,
									"i18n");
						}
						if (!this.oFragmentList.SalesTargetDialog) {
							this.oFragmentList.SalesTargetDialog = new sap.ui.xmlfragment(
									"cus.crm.salespipeline.sim.view.SalesTargetDialog",
									this);
							this.oFragmentList.SalesTargetDialog.setModel(
									i18nModel, "i18n");
							this.oFragmentList.SalesTargetDialog.setModel(this
									.getView().getModel("PeriodicityTexts"),
									"PeriodicityTexts");
							this.oFragmentList.SalesTargetDialog.setModel(this
									.getView().getModel("CurrencyList"),
									"CurrencyList");
							this.oFragmentList.SalesTargetDialog.setModel(this
									.getView().getModel("YearRanges"),
									"YearRanges");
							if (sap.ui.Device.system.desktop
									|| sap.ui.Device.system.tablet)
								this.oFragmentList.SalesTargetDialog
										.setContentWidth("30em");
						}
						if (!this.oFragmentList.opportunityPopover) {
							this.oFragmentList.opportunityPopover = new sap.ui.xmlfragment(
									"cus.crm.salespipeline.sim.view.opportunityPopover",
									this);
							this.oFragmentList.opportunityPopover.setModel(
									i18nModel, "i18n");
							this.oFragmentList.opportunityPopover
									.setModel(this.getView().getModel(
											"SalesOpp"), "SalesOpp");
							this.oFragmentList.opportunityPopover.setModel(this
									.getView().getModel("StatusMgt"),
									"StatusMgt");
						}
						if (!this.oFragmentList.settingsDialog) {
							this.oFragmentList.settingsDialog = new sap.ui.xmlfragment(
									"cus.crm.salespipeline.sim.view.settingsDialog",
									this);
							this.oFragmentList.settingsDialog.setModel(
									i18nModel, "i18n");
							if (sap.ui.Device.system.desktop
									|| sap.ui.Device.system.tablet)
								this.oFragmentList.settingsDialog
										.setContentWidth("30em");
						}
						if (!this.oFragmentList.resetDialog) {
							this.oFragmentList.resetDialog = new sap.ui.xmlfragment(
									"cus.crm.salespipeline.sim.view.resetDialog",
									this);
							this.oFragmentList.resetDialog.setModel(i18nModel,
									"i18n");
							if (sap.ui.Device.system.desktop
									|| sap.ui.Device.system.tablet)
								this.oFragmentList.resetDialog
										.setContentWidth("30em");
						}
					},

					_destroyAllControllerFragments : function() {
						if (this.oFragmentList)
							for ( var sFragment in this.oFragmentList)
								this.oFragmentList[sFragment].destroy();
						// Making it work with the latest UI5 1.22.0 onwards
						this.oFragmentList = null;
					},

					pressLinkToEmailOrCall : function(oEvent) {
						var oCore = sap.ui.getCore(), aId = [ "mcEmail",
								"empRespEmail", "mcPhone", "empRespPhone" ], oSrc = oEvent
								.getSource();
						switch (oSrc) {
						case oCore.byId(aId[0]):
						case oCore.byId(aId[1]):
							if (!this.getView().byId("butSave").getVisible())
								sap.m.URLHelper.triggerEmail(oSrc.getText());
							else
								this.oNavParams.sendMail = oSrc.getText();
							break;
						case oCore.byId(aId[2]):
						case oCore.byId(aId[3]):
							if (!this.getView().byId("butSave").getVisible())
								sap.m.URLHelper.triggerTel(oSrc.getText());
							else
								this.oNavParams.telCall = oSrc.getText();
							break;
						}
					}

				/*
				 * FIORI WAVE 4 - Branch : Rel - 1.2 END of ENHANCEMENTS for
				 * SimulateSalesPipeline
				 */
				});
