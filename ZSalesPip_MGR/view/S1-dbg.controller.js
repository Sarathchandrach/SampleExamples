/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("sap.ca.ui.message.message");

sap.ca.scfld.md.controller.BaseFullscreenController
		.extend(
				"cus.crm.ppm.mgr.view.S1",
				{
					// Controller Methods - onInit
					onInit : function() {
						sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit
								.call(this);
						this._initControllerVariables();
						var oDevice = sap.ui.Device, oBrowser = oDevice.browser;
						// WAVE 4 EHANCEMENT
						if (this.getServiceVersion() == 1
								&& this.getServiceSchemaVersion() >= 2) {
							var oChartChange = this.getView().byId("sSP2");
							var oItem = new sap.ui.core.ListItem("liBarChart",
									{
										key : "BarChart",
										text : this.oBundle
												.getText("BTN_SELECT_BARCHART")
									});
							oChartChange.addItem(oItem);
							if (this._bIsRTL && !oDevice.system.phone)
								this.getView().byId("fvbChart")._oChartPopover
										.attachAfterOpen(jQuery.proxy(
												this._checkForPopoverArrow,
												this));
						}

						this.loaddata();
						if (oBrowser.BROWSER.INTERNET_EXPLORER == oBrowser.name
								&& oBrowser.version < 10) {
							var oSliderLayout = this.getView().byId(
									"opportunitySlider");
							oSliderLayout.removeStyleClass("alignRight");
							oSliderLayout.addStyleClass("alignRightIE9");
						}
						this._initializeAllControllerFragments();
						sap.ui.getCore().byId("dlSalesPeriodSet")
								.addStyleClass("sapcrmMDialogCont");
						sap.ui.getCore().byId("poPage").addStyleClass(
								"sapUiStdPage");
						this.byId("page").addStyleClass("sapUiStdPage");
						this.byId("objectStatus").addStyleClass("boldText");

						// Changes for no text selection on controls
						this.disableTextSelection();
						window.addEventListener("orientationchange",
								function() {
									if (sap.ui.getCore().byId("po").isOpen())
										sap.ui.getCore().byId("po").close();

								}, false);
						this.filteredOpportunities = this.Opportunities
								.slice(0);
						this.OpportunitiesAll_chart = this.Opportunities
								.slice(0);
					},

					// Introduced this method to work with UI5 1.22.0 onwards
					_initControllerVariables : function() {
						this.oBundle = this.oApplicationFacade
								.getResourceBundle();
						this.oDataModel = this.oApplicationFacade
								.getODataModel();
						this._iServiceSchemaVersion = this
								._getServiceSchemaVersion(this.oDataModel,
										"Opportunity");
						this._iServiceVersion = this._getServiceVersion(
								this.oDataModel, "Opportunity");
						// Changes for Bar Graph
						this.data = {
							results : []
						};
						this.filteredData = {
							results : []
						};
						this.graphDataToShow = {
							results : []
						};
						this.oApplicationFacade.oApplicationImplementation.oCurController.FullCtrl = this;
						this.viewType = {};
						this.ptGroup = {};
						this.ptGroup_chart = {};
						this.filteredOpportunities = false;
						this.OpportunitiesAll_chart = false;
						this.reRenderTopNSlider = true;
						this._bIsRTL = sap.ui.getCore().getConfiguration()
								.getRTL();
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
						// TOP N Slider
						sap.ui.getCore().byId('popup')
								.allowTextSelection(false);
					},

					// Controller Methods - onExit
					onExit : function() {
						this._destroyAllControllerFragments();
						if (this._bIsRTL && !sap.ui.Device.system.phone)
							this.getView().byId("fvbChart")._oChartPopover
									.detachAfterOpen(jQuery.proxy(
											this._checkForPopoverArrow, this));
						// May work in Main.controller.js
						if (sap.ui.getCore().byId("liBarChart"))
							sap.ui.getCore().byId("liBarChart").destroy();
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
					 * DEVELOPMENT for TrackSalesPipeline
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
							msgShown = errorDetails.message.value;
						} else
							msgShown = oError.message;
						sap.ca.ui.message.showMessageBox({
							type : sap.ca.ui.message.Type.ERROR,
							message : msgShown
						});
					},

					// READ all the Services using BATCH - App Settings,
					// Periodicity Texts, Time Intervals, Year Ranges,
					// Currencies
					batchRead : function() {
						var that = this;
						var oModel = this.oDataModel;
						var aReadOp = [
								oModel.createBatchOperation(
										"SalesPipelineSettings", "GET"),
								oModel.createBatchOperation("PeriodicityTexts",
										"GET"),
								oModel.createBatchOperation("TimeIntervals",
										"GET"),
								oModel
										.createBatchOperation("YearRanges",
												"GET"),
								oModel
										.createBatchOperation("Currencies",
												"GET"),
								oModel.createBatchOperation("Opportunities",
										"GET"),
								oModel.createBatchOperation("UserStatusCodes",
										"GET") ];

						// Applicable from WAVE 4 onwards
						if (this.getServiceVersion() == 1
								&& this.getServiceSchemaVersion() >= 2) {
							aReadOp.push(oModel.createBatchOperation(
									"OrganizationSalesTargets", "GET"));
							aReadOp.push(oModel.createBatchOperation(
									"SalesStages", "GET"));
						}
						oModel.addBatchReadOperations(aReadOp);
						oModel.setHeaders({
							"X-REQUESTED-WITH" : "XMLHttpRequest"
						});
						var fnSuccess = function(odata, response) {
							var batchResults = odata.__batchResponses;
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
									that.SalesPipelineSetting = currentData[0];
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
										for ( var l = 0; l < TimeIntervalsTemp.length; l += 2) {
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
										currentDate = cus.crm.ppm.mgr.util.formatter
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
									jModel.setData(currentData);
									that.getView().setModel(jModel,
											"Opportunities");
									that.Opportunities = currentData;
									// that.copyOpportunities("OpportunitiesOld");
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
												.push(item.BusinessTcode);
									}
									break;
								case 7:
									jModel.setData(currentData);
									that.getView().setModel(jModel,
											"OrganizationSalesTargets");
									that.OrganizationSalesTargets = currentData;
									// that.copyOpportunities("OpportunitiesOld");
									break;
								case 8:
									for ( var i = 0; i < currentData.length; i++) {
										var item = currentData[i];
										if (!that.ptGroup_chart[item.ProcessType]) {
											that.ptGroup_chart[item.ProcessType] = new Object(
													{
														"ProcessType" : "",
														"SalesStage" : []
													});
											that.ptGroup_chart[item.ProcessType].ProcessType = item.ProcessType;
										}
										that.ptGroup_chart[item.ProcessType].SalesStage
												.push(item);
									}
									break;
								}
							}
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						oModel.refreshSecurityToken();
						oModel.submitBatch(fnSuccess, fnError, false);
					},

					// Load all application-specific Data
					loaddata : function() {
						// this.LoadSalesPipelineSettings(false);
						// this.LoadPeriodicityTexts(false);
						// this.LoadTimeIntervals(false);
						// this.LoadYearRanges(false);
						// this.LoadCurrencyList(false);
						// this.LoadOpportunities(false);
						this.batchRead();
						this.LoadFacetFilter();
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
						var jModel = new sap.ui.model.json.JSONModel(settings);
						if (modelname == "SettingsForDisplay")
							jModel
									.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);

						this.getView().setModel(jModel, modelname);
					},

					// Single Service READ - Application Settings
					LoadSalesPipelineSettings : function(bSync) {
						var that = this;
						this.SalesPipelineSetting = false;
						var fnSuccess = function(odata, response) {
							odata.results[0].STP2 = that.viewType;
							var jModel = new sap.ui.model.json.JSONModel(
									odata.results[0]);

							that.getView().setModel(jModel,
									"SalesPipelineSetting");
							that.SalesPipelineSetting = odata.results[0];
							that.copysetting("SettingsForDisplay");
							var oChartSim = that.getView().byId("chart_sim");

							oChartSim
									.setMaxBubbleValue(odata.results[0].OpportunityMaxValue);

							oChartSim
									.setMinBubbleValue(odata.results[0].OpportunityMinValue);
							oChartSim
									.setBubbleStepValue(odata.results[0].OpportunityStepValue);
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
						this.Opportunities = false;
						var fnSuccess = function(odata, response) {
							var jModel = new sap.ui.model.json.JSONModel(
									odata.results);
							that.getView().setModel(jModel, "Opportunities");
							that.Opportunities = odata.results;
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						this.oDataModel.read("Opportunities", null, null,
								bSync, fnSuccess, fnError);
					},

					// Single Service READ - Time Intervals
					LoadTimeIntervals : function(bSync, peroidcity) {
						var that = this;
						this.TimeIntervals = false;
						var filter = null;
						if (peroidcity) {
							filter = [];
							filter[0] = "$filter=PeriodicityType eq '"
									+ peroidcity + "'";
						}
						var fnSuccess = function(odata, response) {
							var TimeIntervalsTemp = odata.results;
							var TimeIntervalsData = TimeIntervalsTemp;
							if (TimeIntervalsTemp.length > 100) {
								TimeIntervalsData = [];
								var r = 0;
								for ( var l = 0; l < TimeIntervalsTemp.length; l = l + 2) {
									TimeIntervalsData[r] = TimeIntervalsTemp[l];
									r++;
								}
								TimeIntervalsData[r] = TimeIntervalsTemp[TimeIntervalsTemp.length - 1];
							}
							var jModel = new sap.ui.model.json.JSONModel(
									TimeIntervalsData);
							that.getView().setModel(jModel, "TimeIntervals");
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
									jModel.setData(TimeIntervals);
									that.getView().setModel(jModel,
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
								currentDate = cus.crm.ppm.mgr.util.formatter
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

							jModel = new sap.ui.model.json.JSONModel(
									sliderValues);
							that.getView().setModel(jModel, "sliderValues");

							that.getView().byId("name").setValue(
									sliderValues.value);
							that.getView().byId("name").setValue2(
									sliderValues.value2);

							jModel = new sap.ui.model.json.JSONModel(
									labelsValues);
							that.getView().setModel(jModel, "xLabelValues");

							jModel = new sap.ui.model.json.JSONModel(
									labelsTexts);
							that.getView().setModel(jModel, "xLabelTexts");
							that.TimeIntervals = true;
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						this.oDataModel.read("TimeIntervals", null, filter,
								bSync, fnSuccess, fnError);

					},

					// Single Service READ - Periodicity Texts
					LoadPeriodicityTexts : function(bSync) {
						var that = this;
						var fnSuccess = function(odata, response) {
							var jModel = new sap.ui.model.json.JSONModel(
									odata.results);
							that.getView().setModel(jModel, "PeriodicityTexts");
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						this.oDataModel.read("PeriodicityTexts", null, null,
								bSync, fnSuccess, fnError);
					},

					// Single Service READ - Year Ranges
					LoadYearRanges : function(bSync) {
						var that = this;
						var fnSuccess = function(odata, response) {
							var jModel = new sap.ui.model.json.JSONModel(
									odata.results);
							that.getView().setModel(jModel, "YearRanges");
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						this.oDataModel.read("YearRanges", null, null, true,
								fnSuccess, fnError);
					},

					// Single Service READ - Currencies
					LoadCurrencyList : function(bSync) {
						var that = this;
						var fnSuccess = function(odata, response) {
							var jModel = new sap.ui.model.json.JSONModel(
									odata.results);
							that.getView().setModel(jModel, "CurrencyList");
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						this.oDataModel.read("Currencies", null, null, true,
								fnSuccess, fnError);
					},

					// GENERIC FILTER initialization that can be used by
					// Customer when adding data to NEW FACET FILTER
					_initValuesToFacetFilter : function(aFilteredArr, iIndex,
							Opportunities, sId, sName) {
						var oCurrObject = new Object(), bNewArrValue = true;
						for ( var j = -1, oFilteredObj; oFilteredObj = aFilteredArr[++j];)
							if (oFilteredObj.Id == Opportunities[iIndex][sId]) {
								oFilteredObj.Opportunities
										.push(Opportunities[iIndex]);
								bNewArrValue = false;
								break;
							}
						if (bNewArrValue) {
							oCurrObject.Name = Opportunities[iIndex][sName];
							if (oCurrObject.Name == "")
								oCurrObject.Name = this.oBundle
										.getText("LBL_OTHERS");
							oCurrObject.Id = Opportunities[iIndex][sId];
							oCurrObject.Opportunities = [];
							oCurrObject.Opportunities
									.push(Opportunities[iIndex]);
							aFilteredArr.push(oCurrObject);
						}
					},

					// BIND the FACET FILTER DATA generically
					_bindFacetFilterData : function(oFacetFilterData,
							oControllerObj, sModelName, sKey, fnClose) {
						var jModel = new sap.ui.model.json.JSONModel(
								oFacetFilterData);
						// "{/name}", "/values", "{Name}", "{Id}",
						oControllerObj = new sap.m.FacetFilterList({
							title : "{" + sModelName + ">/name}",
							key : sKey,
							items : {
								path : sModelName + ">/values",
								template : new sap.m.FacetFilterItem({
									text : "{" + sModelName + ">Name}",
									key : "{" + sModelName + ">Id}"
								})
							}
						});
						oControllerObj.setModel(jModel, sModelName);
						this.byId("facetFilter").addList(oControllerObj);
						oControllerObj.attachListClose(jQuery.proxy(fnClose,
								this));
					},

					LoadFacetFilter : function() {
						this.byId("facetFilter").removeAllLists();
						// var Opportunities = this.Opportunities;
						var Opportunities = this.getView().getModel(
								"Opportunities").getData();
						this.OpportunitiesAllForFacetFilter = Opportunities;

						// Load INITAL set of Facet Filters
						// a. Employees Responsible
						var EmployeeResponsiblesData = [], AccountsData = [], OrgData = [];
						for ( var i = 0; i < Opportunities.length; i++)
							this._initValuesToFacetFilter(
									EmployeeResponsiblesData, i, Opportunities,
									"EmployeeID", "EmployeeName");
						var DataEmployeeResponsible = {
							name : this.oBundle.getText("EMPLOYEE_RESPONSIBLE"),
							values : EmployeeResponsiblesData
						};
						this._bindFacetFilterData(DataEmployeeResponsible,
								this.oFacetListEmployeeResponsibles, "EmpResp",
								"emp_responsible", this.closeListEmployees);

						// var oModelEmployeeResponsibles = new
						// sap.ui.model.json.JSONModel(
						// DataEmployeeResponsible);
						// this.oFacetListEmployeeResponsibles = new
						// sap.m.FacetFilterList(
						// {
						// title : "{EmpReponsible>/name}",
						// key : "emp_responsible",
						// items : {
						// path : "EmpResp>/values",
						// template : new sap.m.FacetFilterItem({
						// text : "{EmpResp>Name}",
						// key : "{EmpResp>Id}"
						// })
						// }
						// });
						// this.oFacetListEmployeeResponsibles.setModel(
						// oModelEmployeeResponsibles, "EmpResp");
						// this.byId("facetFilter").addList(
						// this.oFacetListEmployeeResponsibles);
						// this.oFacetListEmployeeResponsibles
						// .attachListClose(jQuery.proxy(
						// this.closeListEmployees, this));

						// Load INITAL set of Facet Filters
						// b. Accounts
						for ( var i = 0; i < Opportunities.length; i++)
							this._initValuesToFacetFilter(AccountsData, i,
									Opportunities, "AccountID", "AccountName");
						var DataAccounts = {
							name : this.oBundle.getText("ACCOUNTS"),
							values : AccountsData
						};
						this._bindFacetFilterData(DataAccounts,
								this.oFacetListAccounts, "OppAccount",
								"accounts", this.closeListAccounts);

						// Load INITAL set of Facet Filters
						// c. Sales Organizations
						// WAVE 4 ENHANCEMENT
						var DataORG = {};
						if (this.getServiceVersion() == 1
								&& this.getServiceSchemaVersion() >= 2) {
							for ( var i = 0; i < Opportunities.length; i++)
								this._initValuesToFacetFilter(OrgData, i,
										Opportunities, "SalesOrganizationUnit",
										"SalesOrganizationUnitText");
							DataORG = {
								name : this.oBundle.getText("LBL_ORG"),
								values : OrgData
							};
							this._bindFacetFilterData(DataORG,
									this.oFacetListORG, "OppOrgData", "org",
									this.closeListORG);
						}

						// WAVE 3 ENHANCEMENT
						/**
						 * @ControllerHook Provision for Additional Facet
						 *                 Filters. If required, additional
						 *                 filters can be added to perform
						 *                 analysis on the Manager's Sales
						 *                 Pipeline. This is called when you
						 *                 select the Facet Filter button on the
						 *                 top-right.
						 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookAddFacetFilter
						 * @return {void}
						 */
						if (this.extHookAddFacetFilter)
							this.extHookAddFacetFilter();
					},

					// RESET the selected Filters from the existing
					// FILTER CRITERIA
					resetFunc : function(oEvent) {
						var oFF = this.byId("facetFilter");
						var aFFLists = oFF.getLists();
						for ( var i = 0; i < aFFLists.length; i++) {
							var aItems = aFFLists[i].getItems();
							for ( var j = 0; j < aItems.length; j++) {
								aItems[j].setSelected(false);
							}
							aFFLists[i].getBinding("items").filter([]);
						}
						var OpportunitiesAll = this.OpportunitiesAllForFacetFilter;
						this.filteredOpportunities = OpportunitiesAll;
						this.showTopNOpp();
						this.calculateProgress();
					},

					// Display the default set of VIEWS shown by SAP
					chartChange : function(e) {
						var key = undefined;
						if (e && e.getParameter
								&& e.getParameter('selectedItem'))
							key = e.getParameter('selectedItem').getKey();
						else
							key = this.getView().byId('sSP2').getSelectedKey();

						switch (key) {
						case "SalesPipeline":
						case "Top10Opportunities":
							this.byId("filterButton").setEnabled(true);
							this.showBubbleChart(e);
							if (key == "SalesPipeline")
								this.filteredOpportunities = this.Opportunities;
							this.showTopNOpp();
							// Already calculated in showTopNOpp
							// this.LoadFacetFilter();
							this.calculateProgress();
							break;
						case "BarChart":
							// WAVE 4 ENHANCEMENT
							// Will only execute if ListItem with key BarChart
							// is added to sSP2
							this.reRenderTopNSlider = false;
							this.byId("filterButton").setEnabled(false);
							this.showBarChart(e);
							this.resetFunc(e);
							this.getView().byId("FilterPanel")
									.setVisible(false);
							break;
						}

						// WAVE 3 ENHANCEMENT
						/**
						 * @ControllerHook Provision for Additional Views. If
						 *                 required, additional Views can be
						 *                 added to display the direct results
						 *                 of the Sales Pipeline when the view
						 *                 is selected. This is called when you
						 *                 select a value from the drop-down
						 *                 list for VIEWS.
						 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookAddViews
						 * @return {void}
						 */
						if (this.extHookAddViews)
							this.extHookAddViews();
					},

					// DISPLAY/HIDE the Facet Filters that can be used by the
					// SALES MANAGER to perform further analysis
					toggleButtons : function(e) {
						var filterPanel = this.getView().byId("FilterPanel");
						if (filterPanel.getVisible())
							filterPanel.setVisible(false);
						else
							filterPanel.setVisible(true);
					},

					// Filter based on EMPLOYEES RESPONSIBLE when the selected
					// Popover is closed
					closeListEmployees : function(oEvent) {
						// var OpportunitiesAll = that.Opportunities;
						var oFF = this.byId("facetFilter");
						var aFFLists = oFF.getLists();
						for ( var i = 0; i < aFFLists.length; i++) {
							if (aFFLists[i].getKey() == "emp_responsible")
								continue;
							var aItems = aFFLists[i].getItems();
							for ( var j = 0; j < aItems.length; j++) {
								aItems[j].setSelected(false);
							}
							aFFLists[i].getBinding("items").filter([]);

						}
						oFF.rerender();
						var OpportunitiesAll = this.OpportunitiesAllForFacetFilter;
						var selItemsLength = oEvent
								.getParameter("selectedItems").length;
						if (selItemsLength == 0) {
							var jModelAll = new sap.ui.model.json.JSONModel(
									OpportunitiesAll);
							this.getView().setModel(jModelAll, "Opportunities");
							this.filteredOpportunities = OpportunitiesAll;
							this.showTopNOpp();
							this.calculateProgress();
							return;
						}
						var Ids = [];
						for ( var i = 0; i < selItemsLength; i++)
							Ids[i] = oEvent.getParameter("selectedItems")[i]
									.getKey();
						var Opportunities = [];
						var data = oEvent.getSource().getModel("EmpResp").oData.values;
						// data = this.oFacetListEmployeeResponsibles
						// .getModel("EmpResp").oData.values;
						for ( var i = 0; i < Ids.length; i++) {
							for ( var j = 0; j < data.length; j++)
								if (Ids[i] == data[j].Id) {
									for ( var r = 0; r < data[j].Opportunities.length; r++)
										Opportunities
												.push(data[j].Opportunities[r]);

								}
						}

						this.filteredOpportunities = Opportunities;
						this.showTopNOpp();
						this.calculateProgress();
					},

					// Filter based on ACCOUNTS when the selected Popover is
					// closed
					closeListAccounts : function(oEvent) {
						// var OpportunitiesAll = that.Opportunities;
						var oFF = this.byId("facetFilter");
						var aFFLists = oFF.getLists();
						for ( var i = 0; i < aFFLists.length; i++) {
							if (aFFLists[i].getKey() == "accounts")
								continue;
							var aItems = aFFLists[i].getItems();
							for ( var j = 0; j < aItems.length; j++) {
								aItems[j].setSelected(false);
							}
							aFFLists[i].getBinding("items").filter([]);

						}
						oFF.rerender();
						var OpportunitiesAll = this.OpportunitiesAllForFacetFilter;
						var selItemsLength = oEvent
								.getParameter("selectedItems").length;
						if (selItemsLength == 0) {
							var jModelAll = new sap.ui.model.json.JSONModel(
									OpportunitiesAll);
							this.getView().setModel(jModelAll, "Opportunities");
							this.filteredOpportunities = OpportunitiesAll;
							this.showTopNOpp();
							this.calculateProgress();
							return;
						}
						var Ids = [];
						for ( var i = 0; i < selItemsLength; i++)
							Ids[i] = oEvent.getParameter("selectedItems")[i]
									.getKey();
						var Opportunities = [];
						var data = oEvent.getSource().getModel("OppAccount").oData.values;
						// data =
						// this.oFacetListAccounts.getModel().oData.values;
						for ( var i = 0; i < Ids.length; i++) {
							for ( var j = 0; j < data.length; j++)
								if (Ids[i] == data[j].Id) {
									for ( var r = 0; r < data[j].Opportunities.length; r++)
										Opportunities
												.push(data[j].Opportunities[r]);

								}
						}
						this.filteredOpportunities = Opportunities;
						this.showTopNOpp();
						this.calculateProgress();
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

					_getSalesStage : function(oOpport) {
						var oProcType = undefined, sStageDescription = "";
						for ( var pt in this.ptGroup_chart)
							if (pt == oOpport.ProcessType) {
								oProcType = this.ptGroup_chart[pt];
								break;
							}

						if (oProcType != undefined
								&& oOpport.SalesStageCode != undefined)
							for ( var j = 0; j < oProcType.SalesStage.length; j++)
								if (oProcType.SalesStage[j].SalesStageCode == oOpport.SalesStageCode) {
									sStageDescription = oProcType.SalesStage[j].SalesStageDescription;
									break;
								}
						return sStageDescription;
					},

					// Progress Achievement for the Sales Manager
					calculateProgress : function() {
						var SalesSettings = this.getView().getModel(
								"SalesPipelineSetting").oData;
						var SalesPeriodBegin = SalesSettings.StartOfPeriod;
						var SalesPeriodEnd = SalesSettings.EndOfPeriod;
						var oppModel = this.getView().getModel("Opportunities");
						if (oppModel != undefined) {
							var Opportunites = oppModel.oData;
							var Percentage = 0.0, Text = null, TotalActualRevenue = 0.0;
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
							if (SalesSettings.SalesTarget > 0)
								Percentage = (TotalActualRevenue / SalesSettings.SalesTarget) * 100;
							Percentage = Math.round(Percentage);
							var utilForm = cus.crm.ppm.mgr.util.formatter;
							var valueA = 0, valueB = 0;
							if (sap.ui.Device.system.phone == true) {
								valueA = utilForm.displayTargetNumbers(Math
										.ceil(TotalActualRevenue));
								valueB = utilForm.displayTargetNumbers(Math
										.ceil(SalesSettings.SalesTarget));
							} else {
								valueA = utilForm.displayNumbers(Math
										.ceil(TotalActualRevenue));
								valueB = utilForm.displayNumbers(Math
										.ceil(SalesSettings.SalesTarget));
							}
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
						if (this.oFragmentList.salesPeriodSettings)
							this.oFragmentList.salesPeriodSettings.setModel(
									oSettingsSave, "SettingsForSave");
						this.oFragmentList.appSettings.open();
					},

					selectDlgSetting : function(oEvent) {
						this.oFragmentList.appSettings.close();
						var listSett = this.oFragmentList.appSettings
								.getContent()[0];
						if (listSett.getItems()[0].isSelected())
							this.oFragmentList.salesPeriodSettings.open();
						listSett.getSelectedItem().setSelected(false);
					},

					closeAppSettDialog : function(oEvent) {
						this.oFragmentList.appSettings.close();
					},

					navBack : function(oEvent) {
						var oSettingsSave = this.getView().getModel(
								"SettingsForSave").oData;
						oSettingsSave["SalesTarget"] = this.oSalesSettings.SalesTarget;
						oSettingsSave["CurrencyCode"] = this.oSalesSettings.CurrencyCode;
						oSettingsSave["SalesTargetPeriodicity"] = this.oSalesSettings.SalesTargetPeriodicity;
						oSettingsSave["TimeFrom"] = this.oSalesSettings.TimeFrom;
						oSettingsSave["TimeTo"] = this.oSalesSettings.TimeTo;
						sap.ui.getCore().byId("sliSaTa").setSelected(false);
						// if (sap.ui.getCore().byId("SPnavBack") ==
						// oEvent.oSource) {
						this.oFragmentList.salesPeriodSettings.close();
						this.oFragmentList.appSettings.open();
						// }
					},

					// Setting the Minimum & Maximum Opportunity Value to impose
					// UI restrictions so that it does not become unusable to
					// the Sales Manager
					setMinMax : function() {
						if (this.getView().getModel("Opportunities") != undefined) {
							var Opportunities = this.getView().getModel(
									"Opportunities").oData;
							var expRevOpp = [];
							for ( var i = 0; i < Opportunities.length; i++)
								expRevOpp
										.push(parseFloat(Opportunities[i].ExpectedSalesVolume));

							expRevOpp.sort(function(a, b) {
								return a - b;
							});

							var chart = this.byId("chart_sim");
							chart
									.setMaxBubbleValue(3 * expRevOpp[expRevOpp.length - 1]);
							chart.setMinBubbleValue(0.25 * expRevOpp[0]);
						}
					},

					// Save Application Settings for Sales Manager
					saveAppSetChange : function(oEvent) {
						var that = this, oControl = oEvent.getSource();
						this.reRenderTopNSlider = true;
						var oEntry = this.getView().getModel("SettingsForSave").oData;
						var utilForm = cus.crm.ppm.mgr.util.formatter;
						if (oControl == sap.ui.getCore().byId("spButSave")) {
							oEntry.TimeFrom = new Date(oEntry.TimeFrom);
							oEntry.TimeTo = new Date(oEntry.TimeTo);
							this.viewType = oEntry.STP2;
							delete oEntry.STP2;
							var valST = sap.ui.getCore().byId("iST").getValue();
							oEntry.SalesTarget = utilForm.reverseNumbers(valST)
									+ ".0";
							var oParams = {};
							oParams.bMerge = false;
							oParams.fnSuccess = function() {

								if (sap.ui.getCore().byId("spButSave") == oControl)
									that.oFragmentList.salesPeriodSettings
											.close();

								sap.ca.ui.message.showMessageToast(that.oBundle
										.getText("LBL_SUCCESSUPDATE"));
								that.LoadSalesPipelineSettings(false);
								that.LoadOpportunities(false);
								that.setMinMax();
								that.LoadTimeIntervals(false, that.viewType);
								if (that.getServiceVersion() == 1
										&& that.getServiceSchemaVersion() >= 2)
									that.LoadOrgData(false);
								that.chartChange();
								that.calculateProgress();
							};
							oParams.fnError = function() {
								var errMsg = that.oBundle
										.getText("LBL_FAILEDUPDATE");
								// show the erorr message in a MessageBox
								sap.ca.ui.message.showMessageBox({
									type : sap.ca.ui.message.Type.ERROR,
									message : errMsg
								});
							};
							var updateUrl = "/SalesPipelineSettings('"
									+ oEntry.UserName + "')";

							this.oDataModel.update(updateUrl, oEntry, oParams);
							this.LoadFacetFilter();
						} else {
							oEntry["SalesTarget"] = this.oSalesSettings.SalesTarget;
							oEntry["CurrencyCode"] = this.oSalesSettings.CurrencyCode;
							oEntry["SalesTargetPeriodicity"] = this.oSalesSettings.SalesTargetPeriodicity;
							oEntry["TimeFrom"] = this.oSalesSettings.TimeFrom;
							oEntry["TimeTo"] = this.oSalesSettings.TimeTo;
							this.oFragmentList.salesPeriodSettings.close();
						}
					},

					// Cancel of SAVE in Application Settings of Sales Manager
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
							this.oFragmentList.salesPeriodSettings.close();
					},

					/*
					 * settCheck : function(oEvent) { var that = this; var
					 * settingVal = that.oFragmentList.salesPeriodSettings
					 * .getModel("SettingsForSave").oData; var utilForm =
					 * cus.crm.ppm.mgr.util.formatter; var dateFromVal = new
					 * Date(settingVal.TimeFrom .getFullYear(), 0, 1); var
					 * dateToVal = new Date(settingVal.TimeTo .getFullYear(),
					 * 11, 31); dateToVal =
					 * utilForm.convFromSixZeros(dateToVal); dateFromVal =
					 * utilForm.convFromSixZeros(dateFromVal); if
					 * (String(dateFromVal) != String(settingVal.TimeFrom))
					 * settingVal.TimeFrom = dateFromVal; if (String(dateToVal) !=
					 * String(settingVal.TimeTo)) settingVal.TimeTo = dateToVal;
					 * that.oFragmentList.salesPeriodSettings.getModel(
					 * "SettingsForSave").setData(settingVal); },
					 */

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
					// END OF DIALOGS for APP Settings

					// DUAL SLIDER Control
					dualsliderchange : function() {
						var chart = this.getView().byId("chart_sim");
						var value = arguments[0].getParameter("value");
						var value2 = arguments[0].getParameter("value2");
						var units = this.byId("name").getUnits();
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

					// Change the x-AXIS ticks when changing the view in
					// BUBBLE CHART
					onPeriodicityChange : function(oEvent) {
						this.LoadTimeIntervals(true, oEvent.getSource()
								.getSelectedKey());
						this.reRenderTopNSlider = true;
					},

					// START of OPPORTUNITY POPOVER
					bubbleclick : function(oEvent) {
						var that = this;
						if (!this.oFragmentList.Opportunity) {
							this.oFragmentList.Opportunity = new sap.ui.xmlfragment(
									'cus.crm.ppm.mgr.view.Opportunity', this);
							this.oFragmentList.Opportunity.setModel(this
									.getView().getModel("i18n"), "i18n");
						}

						var ec = this.oFragmentList.Opportunity;
						ec.close();
						var oModel = this.oDataModel;
						oModel.setCountSupported(false);
						var opp = this.getView().getModel("Opportunities").oData;
						this.guidVal = oEvent.getParameter('item').key;
						var pType = undefined, pCurrCode = undefined, oppSalesTeam = undefined;
						// BY Default, turn the layout visibility off for Main
						// Contact, Employee Responsible
						sap.ui.getCore().byId("mainContact").setVisible(false);
						sap.ui.getCore().byId("empResp").setVisible(false);
						var selOpp = undefined, pEmpRespName = undefined, pContactname = undefined;
						var pAccountName = undefined, pOppId = undefined, pOppDescription = undefined;
						var pSalesStage = undefined, pStatus = undefined;

						for ( var i = 0; i < opp.length; i++) {
							if (opp[i].Guid === this.guidVal) {
								selOpp = opp[i];
								pType = selOpp.ProcessType;
								pCurrCode = selOpp.CurrencyCode;
								pEmpRespName = selOpp.EmployeeName;
								pContactname = selOpp.ContactPersonName;
								this.pContactId = selOpp.ContactPersonID;
								pAccountName = selOpp.AccountName;
								this.pAccountId = selOpp.AccountID;
								pOppId = selOpp.Id;
								pOppDescription = selOpp.Description;
								pSalesStage = selOpp.SalesStageCode;
								pStatus = selOpp.UserStatusText;

								break;

							}
						}

						sap.ui.getCore().byId("OppId").setText(pOppId);
						sap.ui.getCore().byId("status").setValue(pStatus);
						sap.ui.getCore().byId("OppDescription").setText(
								pOppDescription);

						// Currency text
						var currCode = " (" + pCurrCode + ")";
						var LBexpRev = sap.ui.getCore().byId("lblExpRev");
						var LBwgtRev = sap.ui.getCore().byId("lblWgtRev");
						LBexpRev.setText(this.oBundle
								.getText("LBL_OD_EXPECTEDREVENUE")
								+ currCode);
						LBwgtRev.setText(this.oBundle
								.getText("LBL_OD_WEIGHTEDREVENUE")
								+ currCode);

						// drop down for sales stages
						var oppRead = [
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
						var stagesData = null;
						var fnS2 = function(odata, response) {
							var batchResults = odata.__batchResponses;
							for ( var i = 0; i < batchResults.length; i++) {
								if (parseInt(batchResults[i].statusCode) !== 200) {
									// var errMsg = that.oBundle
									// .getText("LBL_FAILEDREAD");
									// sap.ca.ui.message.showMessageBox({
									// type : sap.ca.ui.message.Type.ERROR,
									// message : errMsg
									// });
									that.showErrorMsg(batchResults[i], true);
									break;
								} else
									switch (i) {
									case 0:
										stagesData = {
											stageValues : batchResults[i].data.results

										};
										break;
									case 1:
										oppSalesTeam = batchResults[i].data.SalesTeam.results;
										break;
									}
							}
						};
						var fnE2 = function(oerror) {
							that.showErrorMsg(oerror, true);
						};
						oModel.submitBatch(fnS2, fnE2, false);

						var utilForm = cus.crm.ppm.mgr.util.formatter;
						sap.ui.getCore().byId("salesStage").setValue("");
						// switch value for forecast relevance
						for ( var i = 0; i < stagesData.stageValues.length; i++) {
							if (pSalesStage == stagesData.stageValues[i].SalesStageCode) {
								sap.ui
										.getCore()
										.byId("salesStage")
										.setValue(
												stagesData.stageValues[i].SalesStageDescription);
								break;
							}
						}

						if (selOpp.ForecastRelevance == "X")
							sap.ui.getCore().byId("forecastId").setState(true);
						else if (selOpp.ForecastRelevance == "")
							sap.ui.getCore().byId("forecastId").setState(false);

						// Chance of Success
						var x = parseFloat(selOpp.ChanceOfSuccess) + "%";
						sap.ui.getCore().byId("chanceOfSucc").setValue(x);
						// Start date

						var d1 = new Date(selOpp.StartDate.toDateString());
						sap.ui.getCore().byId("d1").setValue(
								utilForm.displayDates(d1));

						// End date
						var d2 = new Date(selOpp.ClosingDate.toDateString());
						sap.ui.getCore().byId("d2").setValue(
								utilForm.displayDates(d2));

						// Expected Revenue
						var expRev = sap.ui.getCore().byId("expRevId");
						expRev.setValue(utilForm
								.displayNumbers(selOpp.ExpectedSalesVolume));

						// calculating weighted revenue
						var wtRevVal = (selOpp.ExpectedSalesVolume * selOpp.ChanceOfSuccess) / 100;
						sap.ui.getCore().byId("wgtRevId").setValue(
								utilForm.displayNumbers(wtRevVal));

						// sales team data
						var aEmployeeIds = [ "empResp", "empRespName",
								"empRespEmail", "empRespPhone" ];
						var aMainContactIds = [ "mainContact",
								"mainContactName", "mcEmail", "mcPhone" ];
						// If valid names, only then show the name of Employee
						// Responsible & set phone, email visibility off by
						// default
						if (pEmpRespName != "") {
							for ( var i = -1, oEmpControl; oEmpControl = sap.ui
									.getCore().byId(aEmployeeIds[++i]);)
								switch (aEmployeeIds[i]) {
								case "empResp":
								case "empRespName":
									oEmpControl.setVisible(true);
									if (aEmployeeIds[i] === "empRespName")
										oEmpControl.setText(pEmpRespName);
									break;
								case "empRespEmail":
								case "empRespPhone":
									oEmpControl.setVisible(false);
									break;
								}
						}
						// If valid names, only then show the name of Main
						// Contact & set phone, email visibility off by default
						if (pContactname != "") {
							for ( var i = -1, oEmpControl; oEmpControl = sap.ui
									.getCore().byId(aMainContactIds[++i]);)
								switch (aMainContactIds[i]) {
								case "mainContact":
								case "mainContactName":
									oEmpControl.setVisible(true);
									if (aMainContactIds[i] === "mainContactName")
										oEmpControl.setText(pContactname);
									break;
								case "mcEmail":
								case "mcPhone":
									oEmpControl.setVisible(false);
									break;
								}
						}
						// sales team data
						if (oppSalesTeam != undefined) {
							for ( var i = -1, oSalesMember; oSalesMember = oppSalesTeam[++i];) {
								var oSMEmail = null, oSMPhone = null, iPartnerID = parseInt(oSalesMember.PartnerFuntionCode);
								switch (iPartnerID) {
								case 14:
									oSMEmail = sap.ui.getCore().byId(
											aEmployeeIds[2]);
									oSMPhone = sap.ui.getCore().byId(
											aEmployeeIds[3]);
									break;
								case 15:
									oSMEmail = sap.ui.getCore().byId(
											aMainContactIds[2]);
									oSMPhone = sap.ui.getCore().byId(
											aMainContactIds[3]);
									break;
								default:
									break;
								}
								if (iPartnerID == 14 || iPartnerID == 15) {
									if (oSalesMember.Email
											&& oSalesMember.Email != "")
										oSMEmail.setVisible(true).setText(
												oSalesMember.Email);
									if (oSalesMember.Telephone
											&& oSalesMember.Telephone != "")
										oSMPhone.setVisible(true).setText(
												oSalesMember.Telephone);
								}
							}
						}

						sap.ui.getCore().byId("accName").setText(pAccountName);
						this.selectedbubble = oEvent.getParameter('item').key;
						if (sap.ui.Device.system.phone == false) {
							var titleOpp = sap.ui.getCore().byId("poBar");
							this.overlappingBubbles = oEvent
									.getParameter('item').overlappedbubbles;
							if (this.overlappingBubbles.length > 1) {
								sap.ui.getCore().byId("upBtn").setVisible(true);
								sap.ui.getCore().byId("downBtn").setVisible(
										true);
								titleOpp.addContentLeft(sap.ui.getCore().byId(
										"oppDetails"));
								titleOpp.removeAllContentMiddle();

							} else {
								sap.ui.getCore().byId("upBtn")
										.setVisible(false);
								sap.ui.getCore().byId("downBtn").setVisible(
										false);
								titleOpp.addContentMiddle(sap.ui.getCore()
										.byId("oppDetails"));
								titleOpp.removeAllContentLeft();

							}
						} else {
							sap.ui.getCore().byId("upBtn").setVisible(true);
							sap.ui.getCore().byId("downBtn").setVisible(true);
						}

						// WAVE 3 ENHANCEMENT
						/**
						 * @ControllerHook Provision for Additional Fields in
						 *                 the Opportunity Popover. If you want
						 *                 to see the additional fields
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

					closePopover : function() {
						sap.ui.getCore().byId("po").close();
					},

					moveUp : function() {
						var value = this.byId("name").getValue();
						var value2 = this.byId("name").getValue2();
						var units = this.byId("name").getUnits();
						var FilteredOpportunites = [], labelsTexts = [], labelsValues = [];
						var startDate = undefined, endDate = undefined, index = undefined;

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
										&& (Opportunites[i].ClosingDate <= endDate))
									FilteredOpportunites.push(Opportunites[i]);

							for ( var i = 0; i < FilteredOpportunites.length; i++)
								if (FilteredOpportunites[i].Guid === this.selectedbubble) {
									index = i + 1;
									if (index >= FilteredOpportunites.length)
										index = 0;
								}
							var chart = this.byId("chart_sim");
							// this.closePopover();
							chart
									.setSelection(FilteredOpportunites[index].Guid);
						} else {
							for ( var i = 0; i < this.overlappingBubbles.length; i++)
								if (this.overlappingBubbles[i].id === this.selectedbubble) {
									index = i + 1;
									if (index >= this.overlappingBubbles.length)
										index = 0;
								}
							var chart = this.byId("chart_sim");
							// this.closePopover();
							chart
									.setSelection(this.overlappingBubbles[index].id);
						}
					},

					moveDown : function() {
						var Opportunites = this.getView().getModel(
								"Opportunities").oData;
						var that = this;
						var value = this.byId("name").getValue();
						var value2 = this.byId("name").getValue2();
						var units = this.byId("name").getUnits();
						var FilteredOpportunites = [], labelsTexts = [], labelsValues = [];
						var startDate = undefined, endDate = undefined, index = undefined;
						var timeinterval = this.getView().getModel(
								"TimeIntervals");
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
										&& (Opportunites[i].ClosingDate <= endDate))
									FilteredOpportunites.push(Opportunites[i]);

							for ( var i = 0; i < FilteredOpportunites.length; i++)
								if (FilteredOpportunites[i].Guid === that.selectedbubble) {
									index = i - 1;
									if (index < 0)
										index = FilteredOpportunites.length - 1;
								}
							var chart = this.byId("chart_sim");
							// this.closePopover();
							chart
									.setSelection(FilteredOpportunites[index].Guid);
						} else {
							for ( var i = 0; i < that.overlappingBubbles.length; i++)
								if (that.overlappingBubbles[i].id === that.selectedbubble) {
									index = i - 1;
									if (index < 0)
										index = that.overlappingBubbles.length - 1;
								}
							var chart = this.byId("chart_sim");
							// this.closePopover();
							chart
									.setSelection(that.overlappingBubbles[index].id);
						}
					},
					// END OF Opportunity POPOVER

					// CROSS-APP Navigation to other Fiori Applications -
					// (1) Accounts
					toAccountApp : function() {
						var fgetService = sap.ushell && sap.ushell.Container
								&& sap.ushell.Container.getService;
						var oCrossAppNavigator = fgetService
								&& fgetService("CrossApplicationNavigation");
						var sAccParam = isNaN(parseInt(this.pAccountId)) ? this.pAccountId
								: parseInt(this.pAccountId).toString();
						var toMyAccountsApp = oCrossAppNavigator
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
						this.closePopover();
						window.location = toMyAccountsApp;
					},

					// CROSS-APP Navigation to other Fiori Applications -
					// (2) Opportunities
					toOppApp : function() {
						var fgetService = sap.ushell && sap.ushell.Container
								&& sap.ushell.Container.getService;
						var oCrossAppNavigator = fgetService
								&& fgetService("CrossApplicationNavigation");

						var toOppApp = oCrossAppNavigator
								&& oCrossAppNavigator.hrefForExternal({
									target : {
										semanticObject : "Opportunity",
										action : "manageOpportunity"
									},
									params : {
										guid : this.guidVal
									}
								}) || "";

						this.closePopover();
						window.location = toOppApp;

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
						var toContactApp = oCrossAppNavigator
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

						this.closePopover();
						window.location = toContactApp;
					},

					/*
					 * FIORI WAVE 2 - Branch : Rel - 1.0 END of INITAL
					 * DEVELOPMENT for TrackSalesPipeline
					 */

					/*
					 * FIORI WAVE 3 - Branch : Rel - 1.1 START of ENHANCEMENTS
					 * for TrackSalesPipeline
					 */

					// EXTENSION POINT to provide additional Facet Filters
					/*
					 * @ControllerHook Provision for Additional Facet Filters.
					 * Additional filters can be added if required to perform
					 * analysis on the Manager's Sales Pipeline. This is called
					 * when the Facet Filter button on the top-right is
					 * selected. The hook must be documented like: @callback
					 * sap.ca.scfld.md.controller.BaseFullscreenController~extHookAddFacetFilter
					 */
					// extHookAddFacetFilter : function() {
					//
					// },
					// EXTENSION POINT to provide additional views created by
					// CUSTOMER and view the user-chosen view provided by
					// CUSTOMER
					/*
					 * @ControllerHook Provision for Additional Views.
					 * Additional Views can be added if required to see the
					 * direct results of the Sales Pipeline when the view is
					 * selected. This is called when the drop-down list for
					 * VIEWS is selected and a value from it is chosen. The hook
					 * must be documented like: @callback
					 * sap.ca.scfld.md.controller.BaseFullscreenController~extHookAddViews
					 * @param {void} @return {void}
					 */
					// extHookAddViews : function() {
					//
					// },
					// EXTENSION method to show ADDITIONAL fields in the
					// Opportunity Popover when a BUBBLE is selected
					/*
					 * @ControllerHook Provision for Additional Fields in the
					 * Opportunity Popover. If required to see the additional
					 * fields directly, this methods enables you to set the data
					 * to those additional fields. This is called when the
					 * bubble in the Sales Pipeline is selected. The hook must
					 * be documented like: @callback
					 * sap.ca.scfld.md.controller.BaseFullscreenController~extHookOpportunityPopover
					 * @param {void} @return {void}
					 */
					// extHookOpportunityPopover : function() {
					//
					// },
					/*
					 * FIORI WAVE 3 - Branch : Rel - 1.1 END of ENHANCEMENTS for
					 * TrackSalesPipeline
					 */

					/*
					 * FIORI WAVE 4 - Branch : Rel - 1.2 START of ENHANCEMENTS
					 * for TrackSalesPipeline
					 */

					// Filter based on SALES ORG when the selected popover is
					// selected
					closeListORG : function(oEvent) {
						// var OpportunitiesAll = that.Opportunities;
						var oFF = this.byId("facetFilter");
						var aFFLists = oFF.getLists();
						for ( var i = 0; i < aFFLists.length; i++) {
							if (aFFLists[i].getKey() == "org")
								continue;
							var aItems = aFFLists[i].getItems();
							for ( var j = 0; j < aItems.length; j++) {
								aItems[j].setSelected(false);
							}
							aFFLists[i].getBinding("items").filter([]);

						}
						oFF.rerender();
						var OpportunitiesAll = this.OpportunitiesAllForFacetFilter;
						var selItemsLength = oEvent
								.getParameter("selectedItems").length;
						if (selItemsLength == 0) {
							var jModelAll = new sap.ui.model.json.JSONModel(
									OpportunitiesAll);
							this.getView().setModel(jModelAll, "Opportunities");
							this.filteredOpportunities = OpportunitiesAll;
							this.showTopNOpp();
							this.calculateProgress();
							return;
						}
						var Ids = [];
						for ( var i = 0; i < selItemsLength; i++)
							Ids[i] = oEvent.getParameter("selectedItems")[i]
									.getKey();
						var Opportunities = [];
						var data = oEvent.getSource().getModel("OppOrgData").oData.values;
						// data = this.oFacetListORG.getModel().oData.values;
						for ( var i = 0; i < Ids.length; i++) {
							for ( var j = 0; j < data.length; j++) {
								if (Ids[i] == data[j].Id) {
									for ( var r = 0; r < data[j].Opportunities.length; r++) {
										Opportunities
												.push(data[j].Opportunities[r]);
									}
								}
							}
						}
						this.filteredOpportunities = Opportunities;
						this.showTopNOpp();
						this.calculateProgress();
					},

					// Display the BUBBLE CHART which shows the Opportunities of
					// Sales Representatives under him/her over the CURRENT time
					// frame
					showBubbleChart : function(oEvent) {
						this.getView().byId("barChartPanel").setVisible(false);
						this.getView().byId("sSP1").setVisible(true);
						this.getView().byId("chart_sim").setVisible(true);
						this.getView().byId("name").setVisible(true);
						this.getView().byId("opportunitySlider").setVisible(
								true);
					},

					// Display the BAR CHART which shows aggregation of
					// Opportunities measuring both Total & Weighted
					// Revenue based on Sales Organization
					showBarChart : function(oEvent) {
						this.chart = this.getView().byId("fvbChart");
						var that = this;
						if (sap.ui.Device.orientation.landscape)
							that.chart.setHeight(0.6 * window.innerHeight
									+ "px");
						$(window)
								.on(
										"orientationchange",
										function(event) {
											if (event.orientation == "landscape") {
												that.chart.setHeight(0.6
														* window.innerHeight
														+ "px");
											} else if (event.orientation == "portrait") {
												that.chart.setHeight("100%");
											}
										});
						this.getView().byId("sSP1").setVisible(false);
						// var ssp2 = this.getView().byId("sSP2");
						// ssp2.setVisible(false);
						this.getView().byId("chart_sim").setVisible(false);
						this.getView().byId("name").setVisible(false);
						this.getView().byId("barChartPanel").setVisible(true);
						this.getView().byId("opportunitySlider").setVisible(
								false);

						var opp = this.OpportunitiesAll_chart;
						for ( var oppIndx = 0; oppIndx < opp.length; oppIndx++)
							this.data.results[oppIndx] = opp[oppIndx];
						this.chart.setShowPopover(false);
						this.chart.setModel(this.formatOdata(),
								"opportunityGraph");
						// this.oApplicationFacade.oApplicationImplementation.oCurController.FullCtrl
						// = this;
						var flatdataset = new sap.viz.ui5.data.FlattenedDataset();
						var dimension = new sap.viz.ui5.data.DimensionDefinition(
								{
									axis : 1,
									name : this.oBundle
											.getText("OPPORTUNITY_ITEM"),
									value : '{opportunityGraph>SalesOrganizationUnitText}'
								});
						var measures1 = new sap.viz.ui5.data.MeasureDefinition(
								{
									name : this.oBundle.getText("LBL_TARGET"),
									value : '{opportunityGraph>SalesTarget}'
								});

						var measures2 = new sap.viz.ui5.data.MeasureDefinition(
								{
									name : this.oBundle
											.getText("LBL_OD_WEIGHTEDREVENUE"),
									value : '{opportunityGraph>WeightedRevenue}'
								});

						var measures3 = new sap.viz.ui5.data.MeasureDefinition(
								{
									name : this.oBundle.getText("LBL_EXPECTED"),
									value : '{opportunityGraph>ExpectedSalesVolume}'
								});

						// Set the Data set
						flatdataset.addDimension(dimension);
						flatdataset.addMeasure(measures1);
						flatdataset.addMeasure(measures2);
						flatdataset.addMeasure(measures3);
						flatdataset.bindData({
							path : "opportunityGraph>/results"
						});
						this.chart.setDataset(flatdataset);
						/*
						 * sap.viz.format.FormatManager .formatFunc({ format :
						 * function(v, p) { if (p == "0") { var cd =
						 * that.getView().getModel(
						 * 'SalesPipelineSetting').oData.CurrencyCode; v =
						 * sap.ca.ui.model.format.AmountFormat
						 * .FormatAmountShort(v, cd, 2); return v; } else return
						 * v; } });
						 */
						var cc = that.getView()
								.getModel('SalesPipelineSetting').oData.CurrencyCode;
						var oCa = {
							dataLabel : {
								visible : true,
								position : "inside"
							},
							interaction : {
								supportLassoEvent : false,
								selectability : {
									mode : "single"
								},
							},
							xAxis : {
								title : {
									visible : true,
									text : this.oBundle.getText("LBL_ORG")
								}
							},
							yAxis : {
								title : {
									visible : true,
									text : this.oBundle.getText(
											"LBL_REVENUE_BAR_CHART", [ cc ])
								}
							},
						};
						this.chart.setAdvancedChartSettings(oCa);
					},

					// Formation of dataset that is to render the chart as
					// viewed by the END USER
					_filterOpportunitiesBasedOnOrg : function(OrgData, iIndex,
							Opportunities) {
						var oCurrOrg = new Object(), bIsNewOrg = true;
						for ( var w = -1, oSelOrg; oSelOrg = OrgData[++w];)
							if (oSelOrg.Id == Opportunities[iIndex].SalesOrganizationUnit) {
								oSelOrg.ExpectedSalesVolume += parseFloat(Opportunities[iIndex]["ExpectedSalesVolume"]);
								oSelOrg.WeightedRevenue += parseFloat(Opportunities[iIndex]["ExpectedSalesVolume"])
										* (parseFloat(Opportunities[iIndex]["ChanceOfSuccess"]) / 100);
								Opportunities[iIndex].SalesStageDescription = this
										._getSalesStage(Opportunities[iIndex]);
								oSelOrg.Opportunities
										.push(Opportunities[iIndex]);
								bIsNewOrg = false;
								break;
							}
						if (bIsNewOrg) {
							oCurrOrg.ExpectedSalesVolume = parseFloat(Opportunities[iIndex]["ExpectedSalesVolume"]);
							oCurrOrg.WeightedRevenue = parseFloat(Opportunities[iIndex]["ExpectedSalesVolume"])
									* (parseFloat(Opportunities[iIndex]["ChanceOfSuccess"]) / 100);
							if (Opportunities[iIndex].SalesOrganizationUnitText == "")
								Opportunities[iIndex].SalesOrganizationUnitText = this.oBundle
										.getText("LBL_OTHERS");
							oCurrOrg.SalesOrganizationUnitText = Opportunities[iIndex].SalesOrganizationUnitText;
							oCurrOrg.Id = Opportunities[iIndex].SalesOrganizationUnit;
							oCurrOrg.Opportunities = [];
							Opportunities[iIndex].SalesStageDescription = this
									._getSalesStage(Opportunities[iIndex]);
							oCurrOrg.Opportunities.push(Opportunities[iIndex]);
							OrgData.push(oCurrOrg);
						}
					},

					_initSalesTargetToJsonData : function(aListOrgs, OrgData) {
						for ( var j = -1, cc; cc = OrgData[++j];) {
							cc.WeightedRevenue = parseFloat(cc.WeightedRevenue
									.toFixed(2));
							cc.ExpectedSalesVolume = parseFloat(cc.ExpectedSalesVolume
									.toFixed(2));
							if (cc.Id == "" || cc.SalesTarget <= 0)
								cc.SalesTarget = "";
							else {
								for ( var i = -1, dd; dd = aListOrgs[++i];)
									if (cc.Id == dd.SalesOrganizationUnit) {
										cc.SalesTarget = parseFloat(dd.Revenue);
										break;
									}
							}
						}
					},

					formatOdata : function() {
						var OrgData = [];
						for ( var i = 0; i < this.Opportunities.length; i++)
							this._filterOpportunitiesBasedOnOrg(OrgData, i,
									this.Opportunities);
						this._initSalesTargetToJsonData(
								this.OrganizationSalesTargets, OrgData);
						this.graphDataToShow = {
							results : OrgData
						};
						var Model = new sap.ui.model.json.JSONModel(
								this.graphDataToShow);
						Model
								.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
						return Model;
					},

					// Display the list of Opportunities under the SALES ORG
					// when the user clicks on any column in the BAR CHART
					onSelectDataPoint : function(oEvent) {
						if (oEvent.getParameter("srcEvent").sId == "deselectData")
							return;
						var oEPPopover = oEvent.getParameter('popover'), oSI = oEvent
								.getParameter('selectedItem');
						oEPPopover.setPlacement(sap.m.PlacementType.Auto)
								.getContent()[0].getParent().addStyleClass(
								'overflowx');
						oEPPopover.removeAllContent();
						var aListItemsPO = [], oLIinP = undefined, sSelColumn = Object
								.keys(oSI.data)[1];
						var sLblTarget = this.oBundle.getText("LBL_TARGET"), sLblWR = this.oBundle
								.getText("LBL_OD_WEIGHTEDREVENUE"), sLblER = this.oBundle
								.getText("LBL_EXPECTED"), sLblClose = this.oBundle
								.getText("BTN_TBT_CLOSE"), sDimension = this.oBundle
								.getText("OPPORTUNITY_ITEM");

						var ModelForPopOver = new sap.ui.model.json.JSONModel();
						var popOverHeader = undefined;
						var cd = this.getView()
								.getModel('SalesPipelineSetting').oData.CurrencyCode;
						if (sSelColumn == sLblWR || sSelColumn == sLblER) {
							popOverHeader = this.oBundle
									.getText("LBL_ALLTO_SELECTED");
							for ( var i = -1, oCurGR; oCurGR = this.graphDataToShow.results[++i];)
								if (oCurGR["SalesOrganizationUnitText"] == oSI.data[sDimension]) {
									for ( var j = -1, oCurOpp; oCurOpp = oCurGR.Opportunities[++j];) {
										var oCurrentItem = {};
										oCurrentItem["title"] = oCurOpp["Description"];
										oCurrentItem["value"] = oCurOpp["SalesStageDescription"];
										if (sSelColumn == sLblWR) {
											var fESV = parseFloat(oCurOpp["ExpectedSalesVolume"]);
											var fCOS = parseFloat(oCurOpp["ChanceOfSuccess"]) / 100;
											oCurrentItem["Revenue"] = sap.ca.ui.model.format.AmountFormat
													.FormatAmountShortWithCurrency(
															fESV * fCOS, cd, 2);
										} else
											oCurrentItem["Revenue"] = sap.ca.ui.model.format.AmountFormat
													.FormatAmountShortWithCurrency(
															parseFloat(oCurOpp["ExpectedSalesVolume"]),
															cd, 2);
										oCurrentItem["guId"] = oCurOpp["Guid"];
										oCurrentItem["opportunityId"] = oCurOpp["Id"];
										aListItemsPO.push(oCurrentItem);
									}
									break;
								}

							ModelForPopOver.setData({
								results : aListItemsPO
							});
							ModelForPopOver
									.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
							oLIinP = new sap.m.List(
									{
										mode : sap.m.ListMode.SingleSelectMaster,
										select : jQuery.proxy(
												this.selectOppNav, this,
												aListItemsPO),
										items : {
											path : "popoverGraph>/results",
											template : new sap.m.ObjectListItem(
													{
														title : "{popoverGraph>title}",
														firstStatus : new sap.m.ObjectStatus(
																{
																	text : "{popoverGraph>Revenue}",
																}),
														secondStatus : new sap.m.ObjectStatus(
																{
																	text : "{popoverGraph>value}",
																}),
														attributes : [
																new sap.m.ObjectAttribute(
																		{
																			text : sSelColumn == sLblWR ? sLblWR
																					: sLblER
																		}),
																new sap.m.ObjectAttribute(
																		{
																			text : this.oBundle
																					.getText("LBL_SALESSTAGE")
																		}) ]
													})
										}
									});
						} else if (sSelColumn == sLblTarget) {
							popOverHeader = this.oBundle
									.getText("SALESTARGET_ITEM");
							aListItemsPO
									.push({
										"SalesTarget" : sap.ca.ui.model.format.AmountFormat
												.FormatAmountShortWithCurrency(
														oSI.data[sSelColumn],
														cd, 2)
									});
							ModelForPopOver.setData({
								results : aListItemsPO
							});
							oLIinP = new sap.m.List(
									{
										mode : sap.m.ListMode.SingleSelectMaster,
										items : {
											path : "popoverGraph>/results",
											template : new sap.m.ObjectListItem(
													{
														firstStatus : new sap.m.ObjectStatus(
																{
																	text : "{popoverGraph>SalesTarget}",
																}),
														attributes : [ new sap.m.ObjectAttribute(
																{
																	text : popOverHeader
																}) ]
													})
										}
									});
						}

						var oHeader = new sap.m.Bar({
							contentMiddle : [ new sap.m.Label({
								text : popOverHeader
							}) ]
						});
						var oFooter = new sap.m.Bar({
							contentLeft : [ new sap.m.Button(
									{
										text : this.oBundle
												.getText("BTN_VIEW_DETAILS"),
										press : jQuery.proxy(
												this.enablePopoverFooter, this,
												oSI.data[sDimension])
									}) ],
							contentRight : [ new sap.m.Button({
								text : sLblClose,
								press : jQuery.proxy(this.enablePopoverFooter,
										this, oSI.data[sDimension])
							// function(oEvent) {
							// sap.ui.getCore().byId(sIdPopover)
							// .close();
							// this.getParent().getParent().close();
							// }
							}) ]
						});

						this.chart.setPopoverFooter(oFooter);
						oEPPopover.setCustomHeader(oHeader);
						oLIinP.setModel(ModelForPopOver, "popoverGraph");
						oEPPopover.addContent(oLIinP);
						// oEvent.oSource._invalidatePopover();
						// oEvent.getParameter('popover').getContent()[0].addStyleClass('overflowx');
						var idPopContent = [ oEPPopover.getId(), "popover",
								"cont" ].join("-");
						$("#" + idPopContent).css("overflow-y", 'auto');
						oEPPopover.openBy(oEvent.getParameter('srcEvent')
								.getParameter('data')[0].target);
					},

					enablePopoverFooter : function(sSelOpp, oEvent) {
						oEvent.getSource().getParent().getParent().close();
						if (oEvent.getSource().sParentAggregationName == "contentLeft") {
							this.showBubbleChart(oEvent);
							this.getView().byId("sSP2").setSelectedKey(
									"SalesPipeline");
							this.byId("filterButton").setEnabled(true);
							this.getView().byId("FilterPanel").setVisible(true);
							var oFF = this.byId("facetFilter");
							for ( var i = -1, oCurFF; oCurFF = oFF.getLists()[++i];) {
								if (oCurFF.getKey() == "org") {
									for ( var j = -1, oCurListFF; oCurListFF = oCurFF
											.getItems()[++j];)
										if (oCurListFF.getText() == sSelOpp) {
											oCurListFF.setSelected(true);
											break;
										}
									break;
								} else {
									for ( var j = -1, oCurListFF; oCurListFF = oCurFF
											.getItems()[++j];)
										oCurListFF.setSelected(false);
									oCurFF.getBinding('items').filter([]);
								}
							}
							oFF.rerender();
							for ( var i = -1, oCurGR; oCurGR = this.graphDataToShow.results[++i];)
								if (oCurGR["SalesOrganizationUnitText"] == sSelOpp)
									this.filteredOpportunities = oCurGR.Opportunities;
							this.showTopNOpp();
							var jModel = new sap.ui.model.json.JSONModel(
									this.filteredOpportunities);
							this.getView().setModel(jModel, "Opportunities");
							this.calculateProgress();
						}
					},

					selectOppNav : function(listArr, oEvent) {
						var selectedItemContextPath = oEvent.getParameter(
								'listItem').getBindingContext('popoverGraph').sPath;
						var resArray = selectedItemContextPath.split("/");
						var listArrIndex = resArray[resArray.length - 1];
						var selectedItem = listArr[listArrIndex];
						this.guidVal = selectedItem["guId"];
						this.toOppApp();
						this.popover.close();
					},

					renderTopNSlider : function(oEvent) {
						if (!this.oFragmentList.topNSlider) {
							this.oFragmentList.topNSlider = new sap.ui.xmlfragment(
									'cus.crm.ppm.mgr.view.opportunitySlider',
									this);
							this.oFragmentList.topNSlider.setModel(this
									.getView().getModel("i18n"), "i18n");
						}
						this.oFragmentList.topNSlider
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
							if (excludeLost == true && bTCode == "LOST")
								return true;
							if (excludeWon == true && bTCode == "WINN")
								return true;
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
						var isTopTen = false;
						var slider = sap.ui.getCore().byId('opportunitySlider');
						var sliderVal = sap.ui.getCore().byId(
								'opportunitySlider').getValue();
						var sliderMax = sap.ui.getCore().byId(
								'opportunitySlider').getMax();
						if (this.getView().byId('sSP2').getSelectedItem()
								.getKey() == "Top10Opportunities")
							isTopTen = true;

						var localOpportunity = this
								._getCurrFilteredOpp(this.OpportunitiesAll_chart
										.slice(0));
						var noOfFilteredOpp = localOpportunity.length;
						if (isTopTen) {
							if (sliderVal >= 10)
								sliderVal = 10;
							if (noOfFilteredOpp > 10)
								noOfFilteredOpp = 10;
							if (slider.getMax() == sliderVal)
								sliderVal = noOfFilteredOpp;
							this
									._setTopNSliderLabel(noOfFilteredOpp,
											sliderVal);
							localOpportunity = localOpportunity.slice(0,
									sliderVal);
						} else if ((sliderVal == sliderMax)
								|| (sliderVal >= noOfFilteredOpp)
								|| (noOfFilteredOpp == sliderVal)
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
							if (oContrl.sId == "opportunitySlider")
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
						// this.copyOpportunities("OpportunitiesOld");
						// if ((isSliding || isSelected) && bIsSalesPeriodSeen)
						this.calculateProgress();
						this.LoadFacetFilter();
					},

					LoadOrgData : function(bSync) {
						var that = this;
						var fnSuccess = function(odata, response) {
							var jModel = new sap.ui.model.json.JSONModel(
									odata.results);
							that.getView().setModel(jModel,
									"OrganizationSalesTargets");
							that.OrganizationSalesTargets = odata.results;
						};
						var fnError = function(oError) {
							that.showErrorMsg(oError, true);
						};
						this.oDataModel.read("OrganizationSalesTargets", null,
								null, bSync, fnSuccess, fnError);
					},

					_initializeAllControllerFragments : function() {
						var i18nModel = this.getView().getModel("i18n");
						// Making it work with the latest UI5 1.22.0 onwards
						this.oFragmentList = {};
						if (!this.oFragmentList.Opportunity) {
							this.oFragmentList.Opportunity = new sap.ui.xmlfragment(
									'cus.crm.ppm.mgr.view.Opportunity', this);
							this.oFragmentList.Opportunity.setModel(i18nModel,
									"i18n");
						}
						if (!this.oFragmentList.topNSlider) {
							this.oFragmentList.topNSlider = new sap.ui.xmlfragment(
									'cus.crm.ppm.mgr.view.opportunitySlider',
									this);
							this.oFragmentList.topNSlider.setModel(i18nModel,
									"i18n");
						}
						if (!this.oFragmentList.salesPeriodSettings) {
							this.oFragmentList.salesPeriodSettings = new sap.ui.xmlfragment(
									'cus.crm.ppm.mgr.view.salesPeriodSettings',
									this);
							this.oFragmentList.salesPeriodSettings.setModel(
									i18nModel, "i18n");
							this.oFragmentList.salesPeriodSettings
									.setModel(this.getView().getModel(
											"PeriodicityTexts"),
											"PeriodicityTexts");
							this.oFragmentList.salesPeriodSettings.setModel(
									this.getView().getModel("CurrencyList"),
									"CurrencyList");
							this.oFragmentList.salesPeriodSettings.setModel(
									this.getView().getModel("YearRanges"),
									"YearRanges");
							if (sap.ui.Device.system.desktop
									|| sap.ui.Device.system.tablet)
								this.oFragmentList.salesPeriodSettings
										.setContentWidth("30em");
						}
						if (!this.oFragmentList.appSettings) {
							this.oFragmentList.appSettings = new sap.ui.xmlfragment(
									'cus.crm.ppm.mgr.view.appSettings', this);
							this.oFragmentList.appSettings.setModel(i18nModel,
									"i18n");
							if (sap.ui.Device.system.desktop
									|| sap.ui.Device.system.tablet) {
								this.oFragmentList.appSettings
										.setContentWidth("30em");
							}
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
							sap.m.URLHelper.triggerEmail(oSrc.getText());
							break;
						case oCore.byId(aId[2]):
						case oCore.byId(aId[3]):
							sap.m.URLHelper.triggerTel(oSrc.getText());
							break;
						}
					},

					_checkForPopoverArrow : function(oEvent) {
						var oEPPopover = oEvent.getSource(), sIdArrow = [
								oEPPopover.getId(), "popover", "arrow" ]
								.join("-"), oDivElem = $("#" + sIdArrow);
						// This check is used only for RTL scenarios where
						// the arrow is placed wrongly by Chart Popover
						if (oDivElem.hasClass("sapMPopoverArrRight"))
							oDivElem.removeClass("sapMPopoverArrRight")
									.addClass("sapMPopoverArrLeft");
						else if (oDivElem.hasClass("sapMPopoverArrLeft"))
							oDivElem.removeClass("sapMPopoverArrLeft")
									.addClass("sapMPopoverArrRight");
					}
				/*
				 * FIORI WAVE 4 - Branch : Rel - 1.2 END of ENHANCEMENTS for
				 * TrackSalesPipeline
				 */
				});