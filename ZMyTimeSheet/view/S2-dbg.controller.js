/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("hcm.emp.mytimesheet.model.TimeEntry");
jQuery.sap.require("hcm.emp.mytimesheet.utils.ConnectionHelper");
jQuery.sap.require("hcm.emp.mytimesheet.utils.InitialConfigHelper");

sap.ca.scfld.md.controller.BaseFullscreenController
		.extend(
				"hcm.emp.mytimesheet.view.S2",
				{
	
//					Controller Hook method definitions
					extHookCalendarMonthChange: null,
					extHookGetUserInfo: null,
					extHookGetTimeSheetCalendar: null,
					extHookUpdateData: null,
					
					
					onInit : function() {
						// execute the onInit for the base class
						// BaseDetailController
						sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit
								.call(this);

						this.oApplication = this.oApplicationFacade.oApplicationImplementation;
						//this.oConfiguration = this.oApplication.oConfiguration;
						this.oConfiguration = new hcm.emp.mytimesheet.utils.InitialConfigHelper();
						
						this.oConnectionManager = this.oApplication.oConnectionManager;
						this.oBundle = this.oApplicationFacade.getResourceBundle();
						this.oConfiguration.setResourceBundle(this.oBundle);
						// Listener for navigation 37
						this.isRoot = true;
						var self = this;
						//var view = this.getView();
						this.oRouter
								.attachRouteMatched(
										function(oEvent) {
											if (oEvent.getParameter("name") === "S2") {
												this.isRoot = false;
												
												self.refreshPage();
												var calendar = self.byId("calendar");
												calendar.unselectAllDates();
												/*if(this.oApplication.getModel("TSM_WEEKLY")){
													var startDay=this.oApplication.getModel("TSM_WEEKLY").getData().start;
													var selectedDate=sap.ui.core.format.DateFormat.getDateInstance({style:"short"}).parse(startDay);
													this.oModel.setProperty("/month", selectedDate.getMonth());
													this.oModel.setProperty("/year", selectedDate.getFullYear());
													this.updateData(selectedDate.getMonth());
													calendar.setCurrentDate(selectedDate);
												}*/

											}
											//self.refreshPage();
										}, this);

						this.oModel = new sap.ui.model.json.JSONModel();
						var now = new Date();
						this.oModel.setData({
							quickEntryAllowed : true,
							year : now.getFullYear(),
							month : now.getMonth(),
							allAllowed : true,
							weekAllowed : true,
							monthAllowed : true
						});
						//For legends to work for first time 
						//this.updateData(this.oModel.getData().month);
						
						if (!this.oService) {
							this.oService = new hcm.emp.mytimesheet.Service();
						}

						
						//code copied from copmpoenent.js since it changed 
/*						sap.ui.core.UIComponent.prototype.init.apply(this,
								arguments); // calls createContent (among others)

						this.getRouter().attachRouteMatched(
								this._handleRouteMatched);

						// this component should automatically initialize the router!
						this.getRouter().initialize();*/

						//code copied from init of Descriptor.js of wave1 application

/*						var oDataServiceURI = "/sap/opu/odata/sap/SRA002_TIMESHEET_SRV/";
						if (window.location.href.indexOf("local") > -1) {
							//oDataServiceURI = "proxy/http/ldcigm6.wdf.sap.corp:50033/sap/opu/odata/sap/SRA002_TIMESHEET_SRV/";
							oDataServiceURI = "/sap/opu/odata/sap/SRA002_TIMESHEET_SRV/?sap-server=gm6-http";
						}

						var mainModel = new sap.ui.model.odata.ODataModel(
								oDataServiceURI, true);
						mainModel
								.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
						var missingDays = 0;*/
						
						
						/*var initialInfoModel = new sap.ui.model.json.JSONModel(
								{
									//newItemCount : this.getText('MISSING_DAYS', [ 0 ]),
									itemCount : missingDays,
									//applicationIcon : this.oHomeIcon['phone'],
									showBusyIndicator : false
								});*/

						/*sap.ui.getCore().setModel(initialInfoModel,
								"timesheet_initialInfo");*/
		
					},

					onCalendarMonthChange : function(oEvent) {
						var date = new Date(oEvent.getParameters().currentDate);
						this.oModel.setProperty("/month", date.getMonth());
						this.oModel.setProperty("/year", date.getFullYear());
						this.updateData(date.getMonth());

						/**
					     * @ControllerHook Extend behavior of Calendar Month Change
					     * This hook method can be used to add UI or business logic 
					     * It is called when the CalendarMonthChange method executes
					     * @callback hcm.emp.mytimesheet.view.S2~extHookCalendarMonthChange
					     */
							if(this.extHookCalendarMonthChange) {
								this.extHookCalendarMonthChange();
					  	};
					},

					refreshPage : function() {
						this.updateData(this.oModel.getData().month);
						this.getUserInfo();
					},

					getUserInfo : function() {
						var oModel = this.oModel;
						var mainItem = null;
						var subItems = null;
						var date = new Date();
						var month = this.oModel.getData().month;
						var year = this.oModel.getData().year;
						var startDate = new Date(year, month, 1);
						var self = this;

						var ofuncSuccess = function(data) {
							
							var initialInfoData= data[0];
							
							if(initialInfoData){

							if (data[0]) {
								oModel.setProperty("/quickEntryAllowed",
										data[0].Counter != null
												&& data[0].Counter.length > 0);

							}


							for ( var i = 0; i < data.length; i++) {
								if (data[i].FieldName == "TIME") {
								} else if (data[i].Level.trim() == "0") {// this is
									// the Bold
									// item
									mainItem = data[i].FieldValueText;
								} else {
									if (subItems) {
										subItems += ", "
												+ data[i].FieldValueText;
									} else {
										subItems = data[i].FieldValueText;
									}
								}
							}

							oModel.setProperty("/mainItem", mainItem);
							oModel.setProperty("/subItems", subItems);
							
							var InitalInfoModel = self.oApplication.getModel("timesheet_initialInfo");
							self.oConfiguration.setInitialInfoModel(InitalInfoModel);
							self.monitorPageRefreshEnded();
							}
						};

						if (!this.oService) {
							this.oService = new hcm.emp.mytimesheet.Service();
						}

						this.oService.getInitialInfos(this,this
								.getDateStr(startDate), this.getDateStr(date),
								ofuncSuccess);

						/**
					     * @ControllerHook Extend behavior of get user info
					     * This hook method can be used to add UI or business logic 
					     * It is called when the getUserInfo method executes
					     * @callback hcm.emp.mytimesheet.view.S2~extHookGetUserInfo
					     */
							if(this.extHookGetUserInfo) {
								this.extHookGetUserInfo();
					  	};

					},

					onWeeklyEntry : function(oEvent) {

						if (sap.ui.getCore().isLocked()) {
							return;
						}
						// logic is move form this view to week entry view
						// to accommodate the new navigation logic
						var dateStr = oEvent.getParameter("date");
						var date = new Date();
						date = date + "";
						var datastr = date.substring(0, 15);
						// get first day of week from calendar
						var calendar = this.byId("calendar");

						if (jQuery.sap.getUriParameters().get("old")) {
							this.oRouter.navTo("WeekEntry", {
								context : dateStr + 'offset'
										+ calendar.getFirstDayOffset()
							},true);

						}else{
						
		
						this.oRouter.navTo("S3", {
							context : dateStr + 'offset'
									+ calendar.getFirstDayOffset()
						},true);

						}
					},

					getTimeSheetCalendar : function(data) {
						// analyze data
						var calendar = this.byId("calendar");
						calendar.removeTypesOfAllDates();

						var now = new Date();
						var grey = [];
						var red = [];
						var green = [];
						var yellow = [];
						var rejected = [];
						var futureWorkDays = [];

						// get first day of the week
						var firstDayOff = -1;
						if (data.length > 0) {
							var firstDay = data[0].FirstDayOfWeek;
							if (firstDay == null) {
								firstDayOff = -1;
							} else if (firstDay == "MONDAY") {
								firstDayOff = 1;
							} else if (firstDay == "TUESDAY") {
								firstDayOff = 2;
							} else if (firstDay == "WEDNESDAY") {
								firstDayOff = 3;
							} else if (firstDay == "THURSDAY") {
								firstDayOff = 4;
							} else if (firstDay == "FRIDAY") {
								firstDayOff = 5;
							} else if (firstDay == "SATURDAY") {
								firstDayOff = 6;
							} else if (firstDay == "SUNDAY") {
								firstDayOff = 0;
							}
						}

						// set in calendar only if get meaningful value from
						// service
						if (firstDayOff > 0) {
							calendar.setFirstDayOffset(firstDayOff);
						}

						for ( var i = 0; i < data.length; i++) {
							var dateToWork = data[i].Date;
							var workingDay = data[i].WorkingDay == "TRUE";
							var status = data[i].Status;
							var date = new Date(parseInt(dateToWork.substring(
									0, 4), 10), parseInt(dateToWork.substring(
									4, 6), 10) - 1, parseInt(dateToWork
									.substring(6, 8), 10));
							if (!workingDay) {
								// add to holidays to grey out
								grey.push(date);
							}
							if(status == "NONE"){
								//do nothing
							}
							if (status == "YACTION" && workingDay) {
								// fill red only if earlier then today
								if (now.getTime() > date.getTime()) {
									red.push(date);
								}
								else{
                                    futureWorkDays.push(date);
								}
							}
							if (status == "MACTION" && workingDay) {
								// add missing days as green with yellow
								yellow.push(date);
							}
							if (status == "DONE" && workingDay) {
								// add filled days as green
								green.push(date);
							}
							if (status == "REJECTED") {
								rejected.push(date);
							}

						}
						calendar.toggleDatesType(yellow,
								sap.me.CalendarEventType.Type04, true);
						calendar.toggleDatesType(green,
								sap.me.CalendarEventType.Type01, true);
						calendar.toggleDatesType(grey,
								sap.me.CalendarEventType.Type00, true);
						calendar.toggleDatesType(red,
								sap.me.CalendarEventType.Type07, true);
						calendar.toggleDatesType(rejected,
								sap.me.CalendarEventType.Type06, true);
						calendar.toggleDatesType(futureWorkDays, 
								sap.me.CalendarEventType.Type10, true);
						
						var oLegendControl = this.byId("LEGEND");
						oLegendControl
								.setLegendForType01(green.length > 0 ? this.oConfiguration
										.getText("FILLED_DAY")
										: null);
						oLegendControl
								.setLegendForType04(yellow.length > 0 ? this.oConfiguration
										.getText("FILLED_MANAGER")
										: null);
						oLegendControl
								.setLegendForType07(red.length > 0 ? this.oConfiguration
										.getText("MISSING_DAY")
										: null);
						oLegendControl
								.setLegendForType06(rejected.length > 0 ? this.oConfiguration
										.getText("REJECTED")
										: null);
						oLegendControl
                        		.setLegendForNormal(futureWorkDays.length > 0 ? this.oConfiguration  
                                      .getText("WORKING_DAY")
                                      : null);
						oLegendControl
								.setLegendForType00(grey.length > 0 ? this.oConfiguration
										.getText("NON_WORKING_DAY")
										: null);


						this.oModel.setProperty("/filledDayVisible",
								green.length > 0);
						this.oModel.setProperty("/approvalVisible",
								yellow.length > 0);
						this.oModel.setProperty("/missingDayVisible",
								red.length > 0);
						this.oModel.setProperty("/rejectedVisible",
								rejected.length > 0);
						this.monitorPageRefreshEnded();

						/**
					     * @ControllerHook Extend behavior of  get TimeSheet Calendar
					     * This hook method can be used to add UI or business logic 
					     * It is called when the getTimeSheetCalendar method executes
					     * @callback hcm.emp.mytimesheet.view.S2~extHookGetTimeSheetCalendar
					     */
							if(this.extHookGetTimeSheetCalendar) {
								this.extHookGetTimeSheetCalendar();
					  	};

					},
					parseDateYYYYMMdd : function(dateString) {
						var dateParse = sap.ui.core.format.DateFormat
								.getDateInstance({
									pattern : "YYYYMMdd"
								});

						var selectedDate = new Date(dateString);

						return dateParse.format(selectedDate);
					},
					updateData : function(month) {
						// define date range to retrieve data
						var prevMonth = new Date();
						prevMonth.setDate(1);
						prevMonth.setYear(this.oModel.getData().year);
						prevMonth.setMonth(month);
						prevMonth.setDate(0); // To go to last day of previous
						// month
						var lastDayOfPrevMonth = prevMonth.getDate();
						var startDate = new Date();
						startDate.setYear(this.oModel.getData().year);
						startDate.setMonth(month);
						startDate.setDate(1);
						var firstDayOfWeek = startDate.getDay();
						var startDay = lastDayOfPrevMonth
								- (firstDayOfWeek - 1);
						if (startDay != 1) {
							prevMonth.setDate(startDay);
							startDate = prevMonth;
						}

						// end date in calendar - first try 5 weeks from start
						// date, then check if
						// one more week is needed
						var endDate = new Date();
						endDate.setFullYear(startDate.getFullYear());
						endDate.setMonth(startDate.getMonth());
						endDate.setDate(startDate.getDate() + 34);
						var lastDayHelp = new Date();
						lastDayHelp.setFullYear(endDate.getFullYear());
						month++;
						lastDayHelp.setMonth(month);
						lastDayHelp.setDate(0);
						if (endDate.getTime() < lastDayHelp.getTime()) {
							// add one more week
							endDate.setDate(endDate.getDate() + 7);
						}
						var self = this;
						if (!this.oService) {
							this.oService = new hcm.emp.mytimesheet.Service();
						}
						this.oService.getWorkDays(this,""
								+ this.getDateStr(startDate), ""
								+ this.getDateStr(endDate), function(data) {
							self.getTimeSheetCalendar(data);
							self.getTimeSheetCalendar(data);
						});
						/**
					     * @ControllerHook Extend behavior of Update Data
					     * This hook method can be used to add UI or business logic 
					     * It is called when the UpdateData method executes
					     * @callback hcm.emp.mytimesheet.view.S2~extHookUpdateData
					     */
							if(this.extHookUpdateData) {
								this.extHookUpdateData();
					  	};
					},
					monitorPageRefreshEnded : function() {
						var ownPointer = this;
/*						if (typeof self != 'undefined') {
							ownPointer = self;
						} else {
							ownPointer = this;
						}*/
						if ("pageRefreshPartOneEnded" in ownPointer) {

							delete ownPointer.pageRefreshPartOneEnded;
						} else {
							ownPointer.pageRefreshPartOneEnded = true;
						}
					},
					getDateStr : function(date) {
						return "" + date.getFullYear()
								+ ("" + (date.getMonth() + 101)).substring(1)
								+ ("" + (date.getDate() + 100)).substring(1);
					},
					setPostObject : function(Counter, TimeEntryOperation,
							WORKDATE, CATSAMOUNT, Name, Code, notes, startTime,
							endTime, subItems, childCodes, childNames) {
						var timeEntryUpdated = {
							Counter : Counter, 
							TimeEntryOperation : TimeEntryOperation,
							TimeEntryDataFields : {
								WORKDATE : WORKDATE,
								CATSAMOUNT : "" + CATSAMOUNT,
								BEGUZ : startTime,
								ENDUZ : endTime
							},

						};
 
						// always send as blank						
						//timeEntryUpdated.TimeEntryRelease = " ";

						/*
						 * if(this.releaseAllowed){
						 * timeEntryUpdated.TimeEntryRelease = " "; }else{
						 * timeEntryUpdated.TimeEntryRelease = "X"; }
						 */

						if(this.checkFieldName(Name) === true){
							timeEntryUpdated.TimeEntryDataFields[Name] = Code;
						}

						if (subItems && subItems !== "") {
							for ( var i = 0; i < childNames.length; i++) {
								if(this.checkFieldName(childNames[i]) === true){
									timeEntryUpdated.TimeEntryDataFields[childNames[i]] = childCodes[i];
								}
							}
						}
						if (notes && notes !== "") {
							timeEntryUpdated.TimeEntryDataFields.LONGTEXT_DATA = notes;
							timeEntryUpdated.TimeEntryDataFields.LONGTEXT = "X";

						}

						return timeEntryUpdated;
					},
					//Note 1959135: Check for special fieldnames
					checkFieldName : function(fieldName){
					    var checkString = new String(fieldName);
					    if(checkString.match("DISPTEXT")){
					                    return false;
					    }
					    if(checkString.match("CPR_OBJTEXT")){
					                    return false;
					    }
					    if(checkString.match("CPR_TEXT")){
					                    return false;
					    }
					    return true;
					},
					/**
					 * @override
					 * 
					 * @param sFilterPattern
					 * @returns {*}
					 */
					applySearchPattern : function(sFilterPattern) {

						sFilterPattern = sFilterPattern.toLowerCase();

						if (this.getList()) {
							var aListItems = this.getList().getItems();
							var bVisibility;

							var iCount = 0;
							for ( var i = 0; i < aListItems.length; i++) {
								bVisibility = this
										.applySearchPatternToListItem(
												aListItems[i], sFilterPattern);
								aListItems[i].setVisible(bVisibility);
								if (bVisibility) {
									iCount++;
								}
							}
							// TODO
							// todo: this.setListCount(iCount);
						}
					},
								
					onQuickEntryWithvalueHelp : function() {
                        var self = this;
                        self.getWorkListCollection();
                        var mainModel = self.oApplication.getModel(
                                      "timesheet_initialInfo");
                        if (mainModel.getData().allHours) {
                               this.oModel.setProperty("/allAllowed", true);
                               this.oModel.setProperty("/all", this.oBundle
                                             .getText("ALL_MISSING", [ mainModel
                                                          .getData().allHours ]));
                        } else {
                               this.oModel.setProperty("/allAllowed", false);
                        }
                        if (mainModel.getData().weekHours) {
                               this.oModel.setProperty("/weekAllowed", true);
                               this.oModel.setProperty("/week", this.oBundle
                                             .getText("THIS_WEEK",
                                                          [ mainModel.getData().weekHours ]));
                        } else {
                               this.oModel.setProperty("/weekAllowed", false);
                        }
                        if (mainModel.getData().monthHours) {
                               var month = this.oModel.getData().month;
                               var year = this.oModel.getData().year;
                               this.oModel.setProperty("/monthAllowed", true);
                               this.oModel.setProperty("/month_year", this.oBundle
                                            .getText("MONTH_YEAR").replace(
                                                          "{0}",
                                                           this.oBundle.getText("MONTH_FULL_"
                                                                        + month)).replace("{1}",
                                                          year).replace("{2}",
                                                           mainModel.getData().monthHours));
                        } else {
                               this.oModel.setProperty("/monthAllowed", false);
                        }
                        this.oHelp = new sap.m.Input(
                                      {
                                             type : sap.m.InputType.Text,
                                             placeholder : self.oBundle
                                                          .getText('SELECT_PLACEHOLDER')
                                                          + " "
                                                          + self.oBundle
                                                                        .getText('RECENTLY_USED'),
                                             showSuggestion : true,
                                             suggestionItems : {
                                                    path : "/projects",
                                                    template : new sap.ui.core.Item({
                                                          text : "{name}"
                                                    })
                                             },
                                             showValueHelp : true,
                                             suggestionItemSelected : function(oEvent) {
                                                    self.leftButton.setProperty('enabled',
                                                                 true);
                                             },
                                             liveChange : function(oEvent) {
                                                    var inputValue = oEvent.oSource
                                                                 ._getInputValue();
                                                    var flag = false;
                                                    if (inputValue == "")
                                                          self.leftButton.setProperty(
                                                                        "enabled", false);
                                                    var suggestedItems = this.getModel()
                                                                 .getData().projects;
                                                    suggestedItems.forEach(function(item) {
                                                          if (item.name == inputValue)
                                                                 flag = true;
                                                    });
                                                    if (flag)
                                                          self.leftButton.setProperty(
                                                                        "enabled", true);
                                                    else
                                                          self.leftButton.setProperty(
                                                                        "enabled", false);
                                             },
                                             valueHelpRequest : function(oEvent) {
                                            	 	var handleClose;
                                                    handleClose = jQuery
                                                                 .proxy(
                                                                               function(oEvent) {
                                                                                      var oSelectedItem = oEvent
                                                                                                    .getParameter("selectedItem");
                                                                                      if (oSelectedItem) {
                                                                                             self.oHelp
                                                                                                           .setValue(oSelectedItem
                                                                                                                        .getTitle() + ", " + oSelectedItem
                                                                                                                        .getDescription());
                                                                                             self.leftButton
                                                                                                           .setProperty(
                                                                                                                        'enabled',
                                                                                                                        true); // changes
                                                                                             for(var index =0;index < self.workList.length; index++){
																									if(oSelectedItem.getTitle() == self.workList[index].name){
																										self.selectedWorklist = self.workList[index];
																										break;
																									}
																								}
                                                                                      }
                                                                                      oEvent
                                                                                                    .getSource()
                                                                                                    .getBinding(
                                                                                                                 "items")
                                                                                                    .filter([]);
                                                                               }, this);
                                                    if (!this._valueHelpSelectDialog) {
                                                          this._valueHelpSelectDialog = new sap.m.SelectDialog(
                                                                        {
                                                                               title : self.oBundle
                                                                                             .getText('COST_ASSIGNMENT'),
                                                                               items : {
                                                                                      path : "/projects",
                                                                                      template : new sap.m.StandardListItem(
                                                                                                    {
                                                                                                           title : "{name}",
                                                                                                           description : "{others}",
                                                                                                           adaptTitleSize : false,
                                                                                                           active : true
                                                                                                    })
                                                                               },
                                                                               search : function(
                                                                                             oEvent) {
                                                                                      var sValue = oEvent
                                                                                                    .getParameter("value");
                                                                                      var oFilter = new sap.ui.model.Filter(
                                                                                                    "name",
                                                                                                    sap.ui.model.FilterOperator.Contains,
                                                                                                    sValue);
                                                                                      oEvent
                                                                                                    .getSource()
                                                                                                    .getBinding(
                                                                                                                 "items")
                                                                                                    .filter(
                                                                                                                 [ oFilter ]);
                                                                               },
                                                                               confirm : handleClose,
                                                                               cancel : handleClose
                                                                        });
                                                          this._valueHelpSelectDialog
                                                                        .setModel(this.getModel());
                                                    }
                                                    this._valueHelpSelectDialog.open();
                                             }
                                      });
                        this.label1 = new sap.m.Label({
                               text : self.oBundle.getText('COST_ASSIGNMENT'),
                               required : true
                        });
                        this.label2 = new sap.m.Label({
                               text : self.oBundle.getText('ENTRY_VIEW_APPLY_TO')
                        });
                        this.oSelect = new sap.m.Select({
                               width : "100%"
                        });
                        var selectWeek = new sap.ui.core.Item({
                               text : this.oModel.getProperty("/week"),
                               key : "week"
                        });
                        var selectMonth = new sap.ui.core.Item({
                               text : this.oModel.getProperty("/month_year"),
                               key : "month"
                        });
                        var selectAll = new sap.ui.core.Item({
                               text : this.oModel.getProperty("/all"),
                               key : "all"
                        });
                        if (this.oModel.getProperty("/week"))
                               this.oSelect.addItem(selectWeek);
                        if (this.oModel.getProperty("/month_year"))
                               this.oSelect.addItem(selectMonth);
                        if (this.oModel.getProperty("/all"))
                               this.oSelect.addItem(selectAll);
                        this.leftButton = new sap.m.Button(
                                      {
                                             text : self.oBundle.getText('SUBMIT'),
                                             enabled : false,
                                             press : jQuery
                                                          .proxy(
                                                                        function() {
                                                                            //   sap.ui.getCore().lock();
                                                                              
                                                                               var selectedKey = this.oSelect
                                                                                             .getSelectedKey(); // changes
                                                                               //var startDate = null, endDate = null;
                                                                               var cur_date = new Date();
                                                                               var operation = null;
                                                                               if (selectedKey == "week") {
                                                                            	   operation = "W";
                                                                                     /* var date = new Date();
                                                                                      startDate = new Date(
                                                                                                    date
                                                                                                                 .getFullYear(),
                                                                                                    date
                                                                                                                 .getMonth(),
                                                                                                    date
                                                                                                                 .getDate()
                                                                                                                 - date
                                                                                                                               .getDay());
                                                                                      endDate = new Date();
                                                                                      startDate = self
                                                                                                    .getDateStr(startDate);
                                                                                      endDate = self
                                                                                                    .getDateStr(endDate);*/
                                                                            	   
                                                                               } else if (selectedKey == "month") {
                                                                            	   operation = "M";
                                                                            	   /*
                                                                                      var month = self.oModel
                                                                                                    .getData().month;
                                                                                      var year = self.oModel
                                                                                                    .getData().year;
                                                                                      startDate = new Date(
                                                                                                    year,
                                                                                                    month, 1);
                                                                                      endDate = new Date(
                                                                                                    year,
                                                                                                    month + 1,
                                                                                                    0);
                                                                                      var date1 = new Date();
                                                                                      var m = date1
                                                                                                    .getMonth();
                                                                                      if (month >= m) {
                                                                                             var year = date1
                                                                                                           .getFullYear();
                                                                                             if (year >= year) {
                                                                                                    startDate = new Date(
                                                                                                                 date1
                                                                                                                               .getFullYear(),
                                                                                                                 m,
                                                                                                                 1);
                                                                                                    endDate = date1;
                                                                                             }
                                                                                      }
                                                                                      startDate = self
                                                                                                    .getDateStr(startDate);
                                                                                      endDate = self
                                                                                                    .getDateStr(endDate);
                                                                               */} else if (selectedKey == "all") {
                                                                            	   operation="A";
                                                                            	   /*
                                                                                      var mainModel = self.oApplication
                                                                                                    .getModel(
                                                                                                                 "timesheet_initialInfo");
                                                                                      startDate = mainModel
                                                                                                    .getData().startDate;
                                                                                      endDate = mainModel
                                                                                                    .getData().endDate;
                                                                               */}
                                                                               


                                           									// lock UI until submit is done
                                           									// to prevent double click
                                           									// sap.ui.getCore().lock();

                                           									jQuery.sap.measure
                                           											.start(hcm.emp.mytimesheet.utils.PerfUtils
                                           													.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));

                                           									var batchCreate = [];
                                           									
                                           											batchCreate
                                           													.push(self
                                           															.setPostObject(
                                           																	"",
                                           																	operation,
                                           																	self.parseDateYYYYMMdd(cur_date.toDateString()),
                                           																	"",
                                           																	self.selectedWorklist.fieldName,
                                           																	self.selectedWorklist.fieldValue,
                                           																	"",
                                           																	"",
                                           																	"",
                                           																	self.selectedWorklist.childs,
                                           																	"",
                                           																	""));

                                           									
                                           									if (batchCreate.length === 0) {
                                           										// if there is nothing to
                                           										// submit, just act like a
                                           										// cancel
                                           										sap.ui.getCore().lock();
                                           									//	confirmationDialog.close();       not used in this controller
                                           										setTimeout(function() {
                                           											// sap.ui.getCore().unlock();
                                           										}, 500);
                                           									} else {
                                           										// only submit if there is
                                           										// something to submit,
                                           										// otherwise SAP UI5 does
                                           										// not give a response
                                           										self.oService
                                           												.submitTimeEntry(
                                           														self,
                                           														batchCreate,
                                           														[],
                                           														[],
                                           														function() {
                                           															// sap.ui.getCore().unlock();
                                           															jQuery.sap.measure
                                           																	.end(hcm.emp.mytimesheet.utils.PerfUtils
                                           																			.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));
                                           															var InitalInfoModel = self.oApplication
                                           															.getModel("timesheet_initialInfo");
                                           													var releaseAllowed = InitalInfoModel.getData().releaseAllowed;

                                           													var toastMsg;
                                           													if (releaseAllowed) {
                                           														toastMsg = self.oBundle
                                           																.getText('DRAFT_SUCCESS');	
                                           													} else {
                                           														toastMsg = self.oBundle.getText('SUBMIT_SUCCESS');
                                           													}
                                           															sap.m.MessageToast
                                           																	.show(toastMsg);//changed toast text
                                           															// sap.ui.getCore().lock();
                                           															/*setTimeout(
                                           																	function() {

                                           																		var calendar = self
                                           																				.byId("weeklyCalendar");
                                           																		var selectedDates = calendar
                                           																				.getSelectedDates();
                                           																		var dateStr;
                                           																		dateStr = selectedDates[0];

                                           																		var selectedDate = dateStr
                                           																				+ 'offset'
                                           																				+ calendar
                                           																						.getFirstDayOffset();

                                           																		self.oRouter
                                           																				.navTo(
                                           																						"S3",
                                           																						{
                                           																							context : selectedDate
                                           																						},true);

                                           																	},
                                           																	500);*/

                                           														},
                                           														function(
                                           																errs,
                                           																response) {
                                           															// sap.ui.getCore().unlock();
                                           															jQuery.sap.measure
                                           																	.end(hcm.emp.mytimesheet.utils.PerfUtils
                                           																			.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));
                                           															// some
                                           															// error
                                           															// messages
                                           															// to
                                           															// display
                                           															self.errors = errs;

                                           														});
                                           									}

                                           								//NOTE end of submit time entry code
                                                                               
                                                                               
                                                                             /*  jQuery.sap.measure
                                                                                             .start(hcm.emp.mytimesheet.utils.PerfUtils
                                                                                                           .getStartId(hcm.emp.mytimesheet.utils.PerfUtils.TIMESHEET_MAIN_QUICK_ENTRY_SUBMIT));
                                                                             
                                                                               
                                                                                 this.oService = new hcm.emp.mytimesheet.Service();
                                                                               this.oService
                                                                                             .submitQuickEntry(
                                                                                            		 		self,
                                                                                                           startDate,
                                                                                                           endDate,
                                                                                                           function() {
                                                                                                                 self
                                                                                                                               .refreshPage();
                                                                                                                 self.dialog
                                                                                                                               .close();
                                                                                                                 jQuery.sap.measure
                                                                                                                               .end(hcm.emp.mytimesheet.utils.PerfUtils
                                                                                                                                             .getEndId(hcm.emp.mytimesheet.utils.PerfUtils.TIMESHEET_MAIN_QUICK_ENTRY_SUBMIT));
                                                                                                                 setTimeout(
                                                                                                                               function() {
                                                                                                                                      sap.ui
                                                                                                                                                    .getCore()
                                                                                                                                                    .unlock();
                                                                                                                               },
                                                                                                                               500);
                                                                                                           },
                                                                                                           function() {
                                                                                                                 jQuery.sap.measure
                                                                                                                               .end(hcm.emp.mytimesheet.utils.PerfUtils
                                                                                                                                             .getEndId(hcm.emp.mytimesheet.utils.PerfUtils.TIMESHEET_MAIN_QUICK_ENTRY_SUBMIT));
                                                                                                                 self.dialog
                                                                                                                               .close();
                                                                                                                 setTimeout(
                                                                                                                               function() {
                                                                                                                                      sap.ui
                                                                                                                                                    .getCore()
                                                                                                                                                    .unlock();
                                                                                                                               },
                                                                                                                               500);
                                                                                                           });*/
                                                                        }, this)
                                      });
                        var rightButton = new sap.m.Button({
                               text : self.oBundle.getText('CANCEL'),
                               tap : jQuery.proxy(function() {
                                      this.dialog.close();
                               }, this)
                        });
                        var oSimpleForm = new sap.ui.layout.form.SimpleForm();
                        oSimpleForm.addContent(this.label1);
                        oSimpleForm.setModel(self.oModel);
                        oSimpleForm.addContent(this.oHelp);
                        oSimpleForm.addContent(this.label2);
                        oSimpleForm.addContent(this.oSelect);
                        this.dialog = new sap.m.Dialog({
                               contentHeight : "470px",
                               content : [ oSimpleForm ],
                               title : self.oBundle.getText('QUICK_FILL'),
                               afterOpen : function(oEvent) {
                                      jQuery.sap.log
                                                    .info("dialog is opened properly");
                               },
                               afterClose : function(oEvent) {
                                      jQuery.sap.log
                                                    .info("dialog is closed properly");
                               },
                               beginButton : this.leftButton,
                               endButton : rightButton
                        });
                        this.dialog.open();
                 },




					// to get f4 help for suggested entries code copied from s31
					// conteollr.js
					getWorkListCollection : function(oselectedItem) {

					this.workList = [];
					this.workListType = [];
					var self = this;
					var d = new Date();//Note: get the current date as begDa and endDa
					var dd = ('0' + d.getDate()).slice(-2).toString();
					var mm = ('0' + (d.getMonth() + 1)).slice(-2).toString();
					var yyyy = d.getFullYear();
					self.searchField_begDa=self.searchField_endDa=yyyy+mm+dd;

					this.oService
							.getCostAssignmentWorkListCollection(self,self.searchField_begDa,self.searchField_endDa,function(
									data) {
								// Create new worklist items for every item
								// with
								// Level 0
								var workListCounter = 0;
								for ( var i = 0; i < data.length; i++) {
									if (data[i].Level.trim() === "0") {
										self.workList[workListCounter] = {
											name : data[i].FieldValueText,
											childs : [],
											fieldName : data[i].FieldName,
											fieldValue : data[i].FieldValue,
											recordNumber : data[i].RecordNumber
										};
										workListCounter++;
									}
								}

								// Add other items with non Level 0
								// FieldText
								// into the
								// previously created Level 0 item.
								for ( var i = 0; i < data.length; i++) {
									if (data[i].Level.trim() !== "0") {
										for ( var j = 0; j < self.workList.length; j++) {
											if (self.workList[j].recordNumber === data[i].RecordNumber)
												self.workList[j].childs
														.push({
															name : data[i].FieldValueText,
															fieldName : data[i].FieldName,
															fieldValue : data[i].FieldValue
														});
										}
									}
								}

								// Add the recently used list to the
								// worklist
/*
 * for ( var i = 0; i < self.recentlyUsedCostAssignmentList.length; i++) {
 * self.workList .push(self.recentlyUsedCostAssignmentList[i]); }
 */

								// Populate the HTML view model with the
								// data
								var projects = [];
								for ( var i = 0; i < self.workList.length; i++) {
									var currentChildItems = [];
									var currentChildNames = [];
									var currentChildCodes = [];
									for ( var j = 0; j < self.workList[i].childs.length; j++) {
										currentChildItems
												.push(self.workList[i].childs[j].name);
										currentChildNames
												.push(self.workList[i].childs[j].fieldName);
										currentChildCodes
												.push(self.workList[i].childs[j].fieldValue);
									}
									projects
											.push({
												name : self.workList[i].name,
												others : currentChildItems
														.join(", "),
												childs : self.workList[i].childs,
												fieldName : self.workList[i].fieldName,
												fieldValue : self.workList[i].fieldValue
											});
									// Check if the current cost assignment
									// type
									// matches
									// something on the recently used list
									if ("selectedMainItem" in self
											&& self.selectedMainItem) {
										if (self.workList[i].name === self.selectedMainItem
												&& self.workList[i].fieldName === self.selectedMainName
												&& self.workList[i].fieldValue === self.selectedMainCode) {
											if ("selectedChildItems" in self) {
												var childItems = [];
												var childNames = [];
												var childCodes = [];
												for ( var j = 0; j < self.selectedChildItems.length; j++) {
													childItems
															.push(self.selectedChildItems[j]);
													childNames
															.push(self.selectedChildNames[j]);
													childCodes
															.push(self.selectedChildCodes[j]);
												}
												if ($(currentChildItems)
														.not(childItems).length == 0
														&& $(childItems)
																.not(
																		currentChildItems).length == 0) {
													if ($(currentChildNames)
															.not(childNames).length == 0
															&& $(childNames)
																	.not(
																			currentChildNames).length == 0) {
														if ($(
																currentChildCodes)
																.not(
																		childCodes).length == 0
																&& $(
																		childCodes)
																		.not(
																				currentChildCodes).length == 0) {
															self.previouslySelectedIndex = i;
														}
													}
												}
											} else {
												if (currentChildItems.length === 0) {
													// Match found in
													// recently used
													// list
													// since subItems is
													// empty
													self.previouslySelectedIndex = i;
												}
											}
										}
									}
								}


								self.workList = projects;


								self.oModel.setProperty("/projects",
										self.workList);
								// self.oModel.setData(localdata);
								// self.getWorkListTypeCollection();
							// }),
														
					});

					},

					getHeaderFooterOptions : function() {
                        var that = this;
                        return {
                        	sI18NFullscreenTitle : "TIMESHEET_TITLE",
                        	
                        	oEditBtn : 
                                                      
                                                      {
                                                         sId: "SMART_ENTRY",
                                                         sI18nBtnTxt : "QUICK_FILL",
                                                         onBtnPressed : function(evt){
                                                                that.onQuickEntryWithvalueHelp(evt);
                                                         }
                                                      }
                        };
                             


				},
				});
