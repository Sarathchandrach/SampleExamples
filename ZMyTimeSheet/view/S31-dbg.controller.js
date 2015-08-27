/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("sap.ui.model.odata.datajs");
jQuery.sap.require("hcm.emp.mytimesheet.utils.PerfUtils");
jQuery.sap.require("hcm.emp.mytimesheet.utils.ConnectionHelper");
jQuery.sap.require("sap.ca.ui.model.type.Number");//Note: dot-comma issue

sap.ca.scfld.md.controller.BaseFullscreenController
		.extend(
				"hcm.emp.mytimesheet.view.S31",
				{
//					Controller Hook method definitions
					extHookOnSuggestedInputHelp: null,
					extHookOnInputHelp:null,
					extHookUpdateData: null,

					RESULTS_TOP : 30,
					MODEL_SIZE_LIMIT : 1000,
					gv_fieldRelated : "",
					searchField_begDa : "",
					searchField_endDa : "",
					//NOTE Date Formatter
					/*parseDateYYYYMMdd : function(dateString) {
						var dateParse = sap.ui.core.format.DateFormat.getDateInstance({
							pattern : "YYYYMMdd"
						});
						return dateParse.parse(dateString);
					},*///END NOTE Date Formatter					//Repeated function
					//NOTE lunch time validator
					validateLunchBreak : function() {
						if(this.isClockEntry()) {
							if(this.entry) {
								// for clock entry employees, a task cannot start or end during the lunch break, otherwise it will be rejected
								
						
								
								if(this.entry.startTime>=this.entry.selectedDate[0].lunchStart && 
										this.entry.startTime<=this.entry.selectedDate[0].lunchEnd) {
									this.entry.startTime = this.entry.selectedDate[0].lunchEnd;
							    	this.byId("startTime").setValue(this.entry.startTime);
									
								}
								if(this.entry.endTime>=this.entry.selectedDate[0].lunchStart && 
										this.entry.endTime<=this.entry.selectedDate[0].lunchEnd) {
									this.entry.endTime = this.entry.selectedDate[0].lunchStart;
									this.byId("endTime").setValue(this.entry.endTime);
									
								}
							}
							
							if(this.entry.startTime===this.entry.endTime) {
								this.setBtnEnabled('SUBMIT_BTN', false);// disable submit if start and end time are the same
								return false;
							}
						}
						return true;
					},
					//End of NOTE lunch time validator
					//deep copy of objects
					clone : function(obj) {
					    // Handle the 3 simple types, and null or undefined
					    if (null === obj || "object" !== typeof obj) {return obj;}

					     // Handle Object
					    if (obj instanceof Object) {
					        var copy = {};
					        var attr=null;
					        for (attr in obj) {
					            if (obj.hasOwnProperty(attr)){ 
					            	copy[attr] = this.clone(obj[attr]);
					            }
					        }
					        return copy;
					    }

					    throw new Error("Unable to copy obj! Its type isn't supported.");
					},
					onInit : function() {

						jQuery.sap.measure
								.start(hcm.emp.mytimesheet.utils.PerfUtils
										.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.COST_ASSIGNMENT_SEARCH_LOAD));

						this._initialize();
						this.oModel = new sap.ui.model.json.JSONModel();
						this.oModel.setSizeLimit(this.MODEL_SIZE_LIMIT);
						this.top = this.RESULTS_TOP;
						this.localSkip = 0;
						this.remoteSkip = 0;
						this.pagingEnabled = false;
						this.localTypeList = [];
						this.remoteTypeList = [];
						this.resultsTotalCount = 0;
						this.remoteSearchPhrase = "";
						this.continueSearchOnServerActive = false;
						this.noneText = "(" + this.oBundle.getText("None")+ ")";

						this.typeListControl = this
								.byId("COST_ASSIGNMENT_TYPE_LIST");

						var self = this;
						this.scrollContainer = this
								.byId("COST_ASSIGNMENT_TYPE_SCROLL_CONTAINER");
						
						/*
						 * this.scrollContainer.addEventDelegate({
						 * onAfterRendering : function() {
						 * self.scrollerResize(); } });
						 */

						// added for dynamic f4 help
						this.recentlyUsedCostAssignmentList = [];

						// Getting the initial info model to get CLOCK_ENTRY
						// value
						var InitalInfoModel = self.oApplication
								.getModel("timesheet_initialInfo");
						var clockEntry = InitalInfoModel.getData().clockEntry;

						/*
						 * Note 1959135: Changes for visibility of clockEntry
						 * and decimalTimeEntry display
						 */
						this.oModel.setProperty("/clockEntry", false);
						this.oModel.setProperty("/decimalTimeEntryVisible",
								false);
						this.oModel.setProperty("/durationVisible", false);

						if (clockEntry) {
							this.oModel.setProperty("/clockEntry", true);
						} else {
							var decimalTimeEntry = InitalInfoModel.getData().decimalTimeEntry;
							if (decimalTimeEntry) {
								this.oModel.setProperty(
										"/decimalTimeEntryVisible", true);
							} else {
								this.oModel.setProperty("/durationVisible",
										true);
							}
						}
						/*
						 * this.oModel.setProperty("/clockEntry",clockEntry);
						 * this.oModel.setProperty("/durationVisible",!clockEntry);
						 */

						this
								.getView()
								.addEventDelegate(
										{
											onBeforeShow : function(oEvent) {
												self.firstRemoteSearch = true;

												// Check
												self.overrideNavController = self.oService;
												self.insidePopover = false;
												if (oEvent.data.overrideNavController)
													{self.overrideNavController = oEvent.data.overrideNavController;}
												if (oEvent.data.insidePopover)
													{self.insidePopover = oEvent.data.insidePopover;}

												self.oModel
														.setProperty(
																"pageTitle",
																oEvent.data.costAssignmentType);
												self.fieldName = oEvent.data.costAssignmentFieldName;
												if (oEvent.data.costAssignmentFieldValue) {
													self.fieldValue = oEvent.data.costAssignmentFieldValue;
													self.fieldValueText = oEvent.data.costAssignmentFieldValueText;
												} else {
													self.fieldValue = "";
													self.fieldValueText = "";
												}
												self.localTypeList = [];
												self.remoteTypeList = [];
												self.gv_fieldRelated = oEvent.data.costAssignmentFieldRelated; //NOTE
												self.getWorkListCollection();//Note 
												// self.getTypeListCollection();
												// self.getView().setModel(self.oModel);

												setTimeout(function() {
													self.scrollerResize();
												}, 100);
												self.initialiseView();	//Note 1959135: Reload the view
											}
										});

						$(window).resize(function() {
							self.scrollerResize();
						});

						self.recentlyUsedList = self
								.byId("COST_ASSIGNMENT_RECENTLY_USED_LIST");

						//self.getWorkListCollection();                  Note 1994402

						// set select suggested entry text
						self.oModel.setProperty("/sel_sugg_txt", self.oBundle
								.getText('SELECT_PLACEHOLDER')+ " " + self.oBundle.getText('RECENTLY_USED'));

						self.getView().setModel(self.oModel);

						var dynamictypes = new sap.ui.model.json.JSONModel();

						self.getView()
								.setModel(dynamictypes, 'fordynamictypes');

						this.viewDatafromS3 = this.oApplication.getModel(
								'S31modelexch').getData().viewDataS3;

						self.entry = (this.viewDatafromS3 && this.viewDatafromS3.entry) || {};

						// copied from editentry controller for intialising
						// duration

						this.getView().setModel(
								new sap.ui.model.json.JSONModel(self.entry),
								"entry");

						this.workListTypeNew = [];

						// code copied from cost assignment controller

						// Process data from weekentry / editentry
						// self.originalFromId = self.fromId;

						if ("mainItem" in self.entry) {
							self.selectedMainItem = self.entry.mainItem;
							self.selectedMainName = self.entry.mainName;
							self.selectedMainCode = self.entry.mainCode;
							if ("childItems" in self.entry) {
								self.selectedChildItems = self.entry.childItems;
								self.selectedChildNames = self.entry.childNames;
								self.selectedChildCodes = self.entry.childCodes;
							}
							/*
							 * var manualButton = self
							 * .byId("MANUAL_COST_ASSIGNMENT_SEGMENTED_BUTTON");
							 */
							if (self.selectedMainItem) {
								self.editCostAssignment = true;
								/*
								 * manualButton.setText(self.oBundle
								 * .getText("MANUAL_INPUT_EDIT"));
								 */
							} else {
								self.editCostAssignment = false;
								/*
								 * manualButton.setText(self.oBundle
								 * .getText("MANUAL_INPUT_ADD"));
								 */
							}
						}

						self.childItemsInitialized = false;

						this.entry = this.prepareModelData(jQuery.extend(
								new hcm.emp.mytimesheet.model.TimeEntry(), {
									newEntry : true
								}));

						/*this.oRouter.attachRouteMatched(function(oEvent) {
							if (oEvent.getParameter("name") === "S31") {

							}
						});*/

						this.editdatafroms3 = this.oApplication.getModel(
								'S31modelexch').getData().editeddata;

					},

					_initialize : function() {
						if (!this.oApplication) {

							this.oApplication = this.oApplicationFacade.oApplicationImplementation;
							this.oConfiguration = this.oApplication.oConfiguration;
							this.oConfiguration = new hcm.emp.mytimesheet.utils.InitialConfigHelper();
							this.oConfiguration
									.setInitialInfoModel(this.oApplication
											.getModel("timesheet_initialInfo"));
							this.oConnectionManager = this.oApplication.oConnectionManager;
							this.oBundle = this.oApplicationFacade.oApplicationImplementation
									.getResourceBundle();
							this.oConfiguration.setResourceBundle(this.oBundle);
							this.oService = new hcm.emp.mytimesheet.Service();

						}

					},

					/**
					 * Similar to onAfterRendering, but this hook is invoked
					 * before the controller's View is re-rendered (NOT before
					 * the first rendering! onInit() is used for that one!).
					 * 
					 * @memberOf test_mytimesheet.test
					 */

					//Note 1959135: New method for initializing the view
					initialiseView : function() {

						// to set text for the page
						var HFoption = this.getHeaderFooterOptions();
						this.dateTimeModified = false;
						if (this.oApplication.getModel('S31modelexch')
								.getData().recentlyUsedSelected) {
							HFoption.sI18NFullscreenTitle = this.oApplicationFacade
									.getResourceBundle().getText(
											"TIMESHEET_CREATE_ENTRY_TITLE");
						} else {
							HFoption.sI18NFullscreenTitle = this.oApplicationFacade
									.getResourceBundle()
									.getText(
											"TIMESHEET_EDIT_ENTRY_TITLE_SCREEN");
						}

						this.setHeaderFooterOptions(HFoption);

						// clear value of suggested values
						this.byId('COST_ASSIGNMENT_RECENTLY_USED_LIST')
								.setValue("");

						// data from prev view data of calnedar set here
						var weeklyCal = this.byId("weeklyCalendar");
						weeklyCal.setEnableMultiselection(true);

						// set selected dates from previous screen
						weeklyCal.unselectAllDates();
						weeklyCal.toggleDatesSelection(
								this.oApplication.getModel('S31modelexch')
										.getData().selectedDates, true);
						weeklyCal.setFirstDayOffset(this.oApplication.getModel('TSM_WEEKLY').getProperty("/firstDayOffset"));//Note
						// set title

						if (weeklyCal.getSelectedDates().length > 1) {
							this
									.byId('createformtitle')
									.setTitle(
											this.oBundle
													.getText(
															'SUBMIT_HEADER_TEXT',
															[		this.getDateinCurrentLanguage( weeklyCal.getSelectedDates()[0] ),	//Note 1959135
																	weeklyCal.getSelectedDates().length - 1 ] ));
							
						} else if (weeklyCal.getSelectedDates().length === 1) {
							this
									.byId('createformtitle')
									.setTitle(
											this.oBundle
													.getText(
															'SUBMIT_HEADER_TEXT_SINGLE',
															[ this.getDateinCurrentLanguage( weeklyCal.getSelectedDates()[0] ) ]));		//Note 1959135
							
						} else if (weeklyCal.getSelectedDates().length === 0) {
							this.byId('createformtitle').setTitle(
									this.oBundle.getText('ENTRY_DETAILS'));
							this.setBtnEnabled('SUBMIT_BTN', false);
						}

						var legendArray = this.viewDatafromS3.pageData.legendforS31;
						weeklyCal.toggleDatesType(legendArray['yellow'],
								sap.me.CalendarEventType.Type04, true);
						weeklyCal.toggleDatesType(legendArray['green'],
								sap.me.CalendarEventType.Type01, true);
						weeklyCal.toggleDatesType(legendArray['grey'],
								sap.me.CalendarEventType.Type00, true);
						weeklyCal.toggleDatesType(legendArray['red'],
								sap.me.CalendarEventType.Type07, true);
						weeklyCal.toggleDatesType(legendArray['rejected'],
								sap.me.CalendarEventType.Type06, true);

						var dateString = this.viewDatafromS3.pageData.start;
						var dateParse = sap.ui.core.format.DateFormat
								.getDateInstance({
									pattern : "YYYYMMdd"
								});
						var startDateS31 = dateParse.parse(dateString);
						weeklyCal.setCurrentDate(startDateS31);

						// set duration
						this.viewDatafromS3 = this.oApplication.getModel(
								'S31modelexch').getData().viewDataS3;

						this.entry = this.viewDatafromS3 && this.viewDatafromS3.entry || {};
								this.entry.time=sap.ca.ui.model.format.NumberFormat.getInstance({style:'standard'}).format(this.entry.time);//Note: dot-comma issue
						this.getView().setModel(
								new sap.ui.model.json.JSONModel(this.entry),
								"entry");

						// set value help
						var recentlyUsedSelected = this.oApplication.getModel(
								'S31modelexch').getData().recentlyUsedSelected;
						if (recentlyUsedSelected) {
							this.onRecentUsedSelect();
						}
						var manualEntrySelected = this.oApplication.getModel(
								'S31modelexch').getData().manualEntrySelected;
						if (manualEntrySelected) {

							this.onManualEntrySelect();
							var editdatafroms3 = this.oApplication.getModel(
									'S31modelexch').getData().editeddata;

							var worklisttype = this.getView().getModel(
									'fordynamictypes').getData().types;

							if (worklisttype) {
								var k;
								for ( k = 0; k < worklisttype.length; k++) {
									worklisttype[k].value = '';
									worklisttype[k].valueStateText = '';
								}

								// when only main item exists

								if (editdatafroms3.entry.childItems) {
									var i;
									for ( i = 0; i < worklisttype.length; i++) {

										if (worklisttype[i].fieldName === editdatafroms3.entry.mainName) {
											worklisttype[i].value = editdatafroms3.entry.mainItem+ ' ('+
													 editdatafroms3.entry.mainCode+
													 ')';
											worklisttype[i].valueStateText = editdatafroms3.entry.mainCode;
											continue;
										}

										var code = editdatafroms3.entry.childCodes[editdatafroms3.entry.childNames
												.indexOf(worklisttype[i].fieldName)];
										var item = editdatafroms3.entry.childItems[editdatafroms3.entry.childNames
												.indexOf(worklisttype[i].fieldName)];
										if (code) {
											worklisttype[i].value = item + ' ('+ code + ')';
										}
										if (item) {
											worklisttype[i].valueStateText = code;
										}

									}
								} else {

									for ( i = 0; i < worklisttype.length; i++) {

										if (worklisttype[i].fieldName === editdatafroms3.entry.mainName) {
											worklisttype[i].value = editdatafroms3.entry.mainItem+
													 ' ('+
													 editdatafroms3.entry.mainCode+
													 ')';
											worklisttype[i].valueStateText = editdatafroms3.entry.mainCode;
											break;
										}
									}
								}
								this.getView().getModel('fordynamictypes')
										.setProperty('/types', worklisttype);
								this.getView().setModel(
										this.getView().getModel(
												'fordynamictypes'),
										'fordynamictypes');
								weeklyCal.setEnableMultiselection(false);

							}

							// disable calendar in edit mode
							var days = [ "Sun", "Mon", "Tue", "Wed", "Thu",
									"Fri", "Sat" ];
							var selectedDay = weeklyCal.getSelectedDates()
									.toString().substr(0, 3);
							var disableDates = [];
							for ( var key in days) {
								if (!(selectedDay === days[key]))
									disableDates.push(key);
							}
							var disable = selectedDay ? disableDates : null;
							weeklyCal.setDisabledWeekDays(disable);

						} else {
							// enable all week days
							weeklyCal.setDisabledWeekDays(null);
						}
						this.getView().getModel('fordynamictypes').setProperty(
								"/recentlyUsedSelected", recentlyUsedSelected);
						this.getView().getModel('fordynamictypes').setProperty(
								"/manualEntrySelected", manualEntrySelected);

						// to set the new entry list for edit mode the second
						// tims screen is rendered
						self.manualEntrySelected = this.oApplication.getModel(
								'S31modelexch').getData().manualEntrySelected;
						if (self.manualEntrySelected) {
							editdatafroms3 = this.oApplication.getModel(
									'S31modelexch').getData().editeddata;

							if (!self.workListTypeNew) {
								self.workListTypeNew = [];
							}
							if (editdatafroms3 && editdatafroms3.entry && editdatafroms3.entry.childItems) {

								for ( i = 0; i < editdatafroms3.entry.childItems.length; i++) {
									// if(self.workListTypeNew){

									self.workListTypeNew
											.push({
												name : editdatafroms3.entry.childItems[i],
												fieldName : editdatafroms3.entry.childNames[i],
												fieldValue : editdatafroms3.entry.childCodes[i]
											});

									// }

								}
							}

						}
						else{
							this.onRecentUsedSelect();
						}
						this.validateSaveBtnVisibility();
						//NOTE checking for edit/new entry
						if(editdatafroms3){
							this.edit_entry=true;
							this.edit_entry_data = this.clone(editdatafroms3);
						}
						else{
							this.edit_entry=false;
						}
					},
					validate:function(){
						this.dateTimeModified=true;
						this.validateSaveBtnVisibility();
					},
					check_for_changed_data: function(){
						var calendar = this.byId("weeklyCalendar");
						var selectedDates = calendar.getSelectedDates();
						var duration=null;
						if(this.isClockEntry()){
								var startTime=this.byId('startTime').getValue();
								var endTime=this.byId('endTime').getValue();
								
							}
							else{
								duration=this.byId('decimalTimeEntryValue').getValue();
							}
						var note_text = this.byId('S31TextArea').getValue();
						var suggested_cost_assignment_data = this.byId('COST_ASSIGNMENT_RECENTLY_USED_LIST').getValue();
						

						
						if(this.edit_entry){
							//for edit entry check for any changed data
							var edit_entry_data = this.edit_entry_data;//has the original data
							var new_selectedDates=this.getDateStr(new Date(selectedDates[0]));
							var original_date = edit_entry_data.pageData.days[edit_entry_data.dayIndex].dateStr;
							var original_notes = edit_entry_data.entry.notes;
							var original_main_name = edit_entry_data.entry.mainName;
							var original_main_code = edit_entry_data.entry.mainCode;
							var accounting_infos = this.getView().getModel('fordynamictypes').getData().types;//current values
							var itemName;
							var itemCode;
							var selected_accounting_info;
							var startString,endString;
							var index,index2;
							//checking for any change in the time entered
							if(this.isClockEntry()){
								var original_start_time=edit_entry_data.entry.startTime;
								var original_end_time=edit_entry_data.entry.endTime;
								if(original_start_time!==startTime || original_end_time!==endTime)
									return true;
							}
							else{
								var original_duration = edit_entry_data.entry.time;
								if(original_duration!==duration)
								return true;
							}
							
								//checking if there is any change in the accounting infos
								for(index = 0; index < accounting_infos.length; index++){
									
									itemName = accounting_infos[index].fieldName;
									//comparing the main item to check for any change
									if(itemName === original_main_name){
										selected_accounting_info = accounting_infos[index].value;
										startString = accounting_infos[index].value.indexOf('(');
										endString = accounting_infos[index].value.indexOf(')');
										itemCode = accounting_infos[index].value.substring(startString+1,endString);
										if(itemCode !== original_main_code){
											return true;
										}
									}
									//checking the child items for any change
									for(index2=0;edit_entry_data.entry.childItems && edit_entry_data.entry.childItems[index2]; index2++){
										if(edit_entry_data.entry.childNames[index2]=== itemName){
											selected_accounting_info = accounting_infos[index].value;
											startString = accounting_infos[index].value.indexOf('(');
											endString = accounting_infos[index].value.indexOf(')');
											itemCode = accounting_infos[index].value.substring(startString+1,endString);
											if(edit_entry_data.entry.childCodes[index2]!==itemCode){
												return true;
											}
										}
									}
								}
							
							if(selectedDates.length>1 || original_date!==new_selectedDates || original_notes!==note_text){
								return true;
							}
								//Incase no items have changed
								return false;
							}	
						else{
							//for new entries check for any data entered
							var manual_cost_assignment_data=false;
						
							var typesArray = this.getView().getModel('fordynamictypes').getData().types;
							if (typesArray) {
								for ( var i = 0; i < typesArray.length; i++)
									if (typesArray[i].value.trim())
										manual_cost_assignment_data = true;
							}
							//checking if any of the fields have some value or not
							if(this.isClockEntry()){
							if(selectedDates.length!==0 || startTime!=="" || endTime!=="" || suggested_cost_assignment_data!=="" || manual_cost_assignment_data)
							return true;
							}
							else{
								if(selectedDates.length!==0 || (duration!=="0" && duration!=="") || suggested_cost_assignment_data!=="" || manual_cost_assignment_data)
							return true;
							}
							return false;
						}
					},
					onBeforeRendering : function() {
						this.initialiseView();				//Note 1959135
					},
					
					// DATA/MODEL HANDLING
					prepareModelData : function(data) {
						var hours, minutes;

						// remove new entry text from structure
						if (!data.mainItem) {
							data.subItems = "";
						}

						// Add missing fields with useful defaults
						if (data.hours === undefined || data.hours === "") {
							hours = parseInt(this.getTargetHours(), 10);
							data.hours = hours;
						}
						if (data.minutes === undefined || data.minutes === "") {
							minutes = parseInt(
									(this.getTargetHours() % 1) * 60, 10);
							data.minutes = minutes;
						}

						// TODO: Use default start/end time when available
						/*if (this.isClockEntry() && (!data.startTime || data.startTime === "000000")) {
							// data.startTime = this.workingDay.startTime;
						}*/
						/*if (this.isClockEntry() && (!data.endTime || data.endTime === "000000")) {
							// data.endTime = this.workingDay.endTime;
						}*/

						return data;
					},
					
					//Note 1959135: Date Language Translation
					getDateinCurrentLanguage: function(dateSelected){
						var tempModel = new sap.ui.model.json.JSONModel();
						var odataq = {	dateValue: new Date(dateSelected) };
						
						tempModel.setData(odataq);
						var tempTextView = new sap.m.Text({ text:{path:"/dateValue", 
															type:new sap.ui.model.type.Date({style:"full"})}}).setModel(tempModel);
						return tempTextView.getText();
					},
					
					onTapOnDate : function(oEvent) {
						this.validateSaveBtnVisibility(oEvent);
						var dateSelected = oEvent.getSource()
								.getSelectedDates();
						var numberOfDatesSelected = dateSelected.length;
						if (numberOfDatesSelected > 1) {

							this
									.byId('createformtitle')
									.setTitle(
											this.oBundle
													.getText(
															'SUBMIT_HEADER_TEXT',
															[
																	this.getDateinCurrentLanguage(dateSelected[0]),				//Note 1959135
																	numberOfDatesSelected - 1 ]));
						} else if (numberOfDatesSelected === 1) {
							this.byId('createformtitle').setTitle(
									this.oBundle.getText(
											'SUBMIT_HEADER_TEXT_SINGLE',[ this.getDateinCurrentLanguage(dateSelected[0]) ]));	//Note 1959135
							
						} else if (numberOfDatesSelected === 0) {
							this.byId('createformtitle').setTitle(
									this.oBundle.getText('ENTRY_DETAILS'));
						}

					},
					validateSaveBtnVisibility : function(oEvent) {
						var timeFlag = false;
						//checking the type of time entry and setting the flag true only for valid times
						if(this.isClockEntry()){
							var startTime = this.byId('startTime').getValue();
							var endTime = this.byId('endTime').getValue();
							if(((startTime && endTime) && startTime !== endTime)){
								timeFlag=true;
							}
							else{
								timeFlag = false;
							}
								
						}
						else{
							//condition for decimal inputs
							var decimalTimeEntryValue = this.byId(
								'decimalTimeEntryValue').getValue();
							if((decimalTimeEntryValue!=="0") && decimalTimeEntryValue!==''){
								//if condition checks if any value has been entered for the decimal input control
								if(this._isValidDecimalNumber(decimalTimeEntryValue)){
									timeFlag=true;
								}
								else{
									timeFlag = false;
								}
								
							}
							else{
								timeFlag = false;
							}
						}
						var selectedDate = this.byId('weeklyCalendar')
								.getSelectedDates().length;
						//var dateTimeValue = this.byId('DateTimeInputValue')
						//		.getValue();
						
						

						var flag = false;
						if (this.recentlyUsedButtonSelected) {
							flag = this.byId(
									'COST_ASSIGNMENT_RECENTLY_USED_LIST')
									.getValue() ? true : false;
						} else {
							flag = false;
							var typesArray = this.getView().getModel(
									'fordynamictypes').getData().types;
							if (typesArray) {
								for ( var i = 0; i < typesArray.length; i++){
									if (typesArray[i].value.trim() || typesArray[i].valueStateText.trim())
									{
										flag = true;
										break;
									}
								}
							}

						}

				// Note 1959135: added decimalTimeEntryValue field for button enable check
						if (flag && selectedDate && timeFlag) {					
							this.setBtnEnabled('SUBMIT_BTN', true);
						} else {
							this.setBtnEnabled('SUBMIT_BTN', false);
						}
					},
					/*validateSaveBtnVisibility : function(oEvent) {
						
						var selectedDate = this.byId('weeklyCalendar')
								.getSelectedDates().length;
						var dateTimeValue = this.byId('DateTimeInputValue')
								.getValue();
						var startTime = this.byId('startTime').getValue();
						var endTime = this.byId('endTime').getValue();
						var decimalTimeEntryValue = this.byId(
								'decimalTimeEntryValue').getValue(); 	// Note 1959135

						var flag = false;
						if (this.recentlyUsedButtonSelected) {
							flag = this.byId(
									'COST_ASSIGNMENT_RECENTLY_USED_LIST')
									.getValue() ? true : false;
						} else {
							flag = false;
							var typesArray = this.getView().getModel(
									'fordynamictypes').getData().types;
							if (typesArray) {
								for ( var i = 0; i < typesArray.length; i++)
									if (typesArray[i].value.trim())
										flag = true;
							}

						}

				// Note 1959135: added decimalTimeEntryValue field for button enable check
						if (flag
								&& selectedDate
								&& ( (dateTimeValue != "00:00" && dateTimeValue != "0:0" && dateTimeValue) || 
									 ((startTime && endTime) && startTime != endTime) || 						//Note 1959135
									 (decimalTimeEntryValue!="0") ||
									 (this._isValidDecimalNumber(decimalTimeEntryValue)) ) ) {					//Note 1959135
							this.setBtnEnabled('SUBMIT_BTN', true);
						} else {
							this.setBtnEnabled('SUBMIT_BTN', false);
						}
					},*/

					suggestionHelpChange : function(oEvent) {
						oEvent.getSource().setValue("");
						this.validateSaveBtnVisibility(oEvent);
					},

					onSuggestedItemSelection : function(oEvent) {
						this.validateSaveBtnVisibility(oEvent);
					},
					onManualItemSelection : function(oEvent) {
						this.validateSaveBtnVisibility(oEvent);
						
					},

					manualHelpChange : function(oEvent) {
						oEvent.getSource().setValueStateText(
								oEvent.getSource().getValue());
						this.validateSaveBtnVisibility(oEvent);
					},

					onDurationValueChange : function(oEvent) {
						this.validateSaveBtnVisibility(oEvent);
					},

					// Note 1959135: decimalTimeEntry Validation
					onDecimalTimeValueChange : function(oEvent) {
						this.dateTimeModified=true;
						// this.validateSaveBtnVisibility(oEvent);
						var decimalTimeEntryValue = this.byId(
								'decimalTimeEntryValue').getValue();
						if (this._isValidDecimalNumber(decimalTimeEntryValue))
							this.validateSaveBtnVisibility(oEvent);//NOTE if input is a decimal number then it should call the validate save button
							//this.setBtnEnabled('SUBMIT_BTN', true);
						else
							this.setBtnEnabled('SUBMIT_BTN', false);
					},

					// Note 1959135: decimalTimeEntry Validation
					_isValidDecimalNumber : function(number) {
						var numberString = number.toString();
						var decimalIndex = numberString.indexOf(".");
						/*Note: dot-comma issue*/
						var commaIndex=numberString.indexOf(",");
						if(decimalIndex>0&&commaIndex>0)return false;//to make sure that user has entered either dot/comma but not both
						var seperatorIndex = decimalIndex;
						if(seperatorIndex<0)
						{
							seperatorIndex =numberString.indexOf(",");
						}
						var strCheck = "0123456789";
						var integerPart;
						var fractionalPart;
						var index=0;
						var hasValue = false;
						if (seperatorIndex === -1) {
							integerPart = numberString;
							fractionalPart = "";
						} else {
							integerPart = numberString.slice(0, seperatorIndex);
							fractionalPart = numberString.slice(
									seperatorIndex + 1, numberString.length);
						}
						/*Note: End dot-comma issue*/
						if (integerPart.length > 5)
							return false;
						for (index = 0; index < integerPart.length; index++) {
							if (integerPart[index] === "0") {
								// Do Nothing
							} else if (strCheck.indexOf(integerPart[index]) === -1)
								return false;
							else
								hasValue = true;
						}
						/*if (parseInt(integerPart) > 23) // Check for twenty four
														// hours
							return false;
*///Note: customer wants to enter any number of hours.So restriction removed
						if (fractionalPart.length > 2)
							return false;
						for (index = 0; index < fractionalPart.length; index++) {
							if (fractionalPart[index] === "0") {
								// Do Nothing
							} else if (strCheck.indexOf(fractionalPart[index]) === -1)
								return false;
							else
								hasValue = true;
						}
						if (hasValue === false)
							return false;

						return true;
					},

					scrollerResize : function() {
						try {
							var costAssignmentTypeSearchPage = this
									.byId("COST_ASSIGNMENT_TYPE_SEARCH_PAGE");
							var $CostAssignmentTypeSearchPage = costAssignmentTypeSearchPage
									.$();
							var $CostAssignmentTypeVSearchField = this.byId(
									"COST_ASSIGNMENT_TYPE_SEARCH_FIELD").$();
							var $CostAssignmentTypeScrollContainer = this.byId(
									"COST_ASSIGNMENT_TYPE_SCROLL_CONTAINER")
									.$();

							var costAssignmentTypeSearchPageHeight = $CostAssignmentTypeSearchPage
									.parent().height();
							var costAssignmentTypeSearchPageHeaderHeight = costAssignmentTypeSearchPage.mAggregations.internalHeader
									.$().height();
							var costAssignmentTypeVSearchFieldHeight = $CostAssignmentTypeVSearchField.height();

							// Skip resize if height is zero, which happens
							// sometimes and cause a
							// blank screen
							if (costAssignmentTypeSearchPageHeight > 0) {
								$CostAssignmentTypeScrollContainer
										.height(costAssignmentTypeSearchPageHeight - costAssignmentTypeSearchPageHeaderHeight - costAssignmentTypeVSearchFieldHeight);
							}
						} catch (e) {
						}
						// this.byId("COST_ASSIGNMENT_TYPE_SEARCH_PAGE").destroyFooter();
					},

					onNavButton : function() {/*
												 * this.cleanUpOnBack(); if
												 * (this.fieldValue) {
												 * this.overrideNavController
												 * .navigateBack(
												 * "CostAssignment", {
												 * costAssignmentReturnType : {
												 * fieldValueText :
												 * this.fieldValueText,
												 * fieldValue : this.fieldValue }
												 * }); } else {
												 * this.overrideNavController.navigateBack(
												 * "CostAssignment", {
												 * costAssignmentReturnType : ""
												 * }); }
												 */

						var calendar = this.byId("weeklyCalendar");
						var selectedDates = calendar.getSelectedDates();
						var selectedDate;
						if(selectedDates.length>0)
						{
						var dateStr=selectedDates[0];
						//this.oApplication.getModel("S31modelexch").getData().viewDataS3.pageData.start
						
						selectedDate = dateStr + 'offset'+ calendar.getFirstDayOffset();
						}
						else{//Note
							// when there are no selected dates then pass the first date of the selected week
							var startDay=this.oApplication.getModel("S31modelexch").getData().viewDataS3.pageData.start;
							selectedDate=sap.ui.core.format.DateFormat.getDateInstance({style:"short"}).parse(startDay);
							selectedDate=selectedDate.toDateString()+ 'offset'+calendar.getFirstDayOffset();
						}
						
							//checking for changes
							if(this.check_for_changed_data()){
							var oSettings = {
									question : this.oBundle.getText("CONFIRM_LEAVE_PAGE"),
									showNote : false,
									title : this.oBundle.getText("UNSAVED_CHANGES"),
									confirmButtonLabel : this.oBundle.getText("OK")
								};
								var self=this;
									sap.ca.ui.dialog.factory
											.confirm(
												oSettings,
												function(response) {
													if (response.isConfirmed === true) {
														self.oRouter.navTo("S3", {
															context : selectedDate
													},true);
													}
													
												});
							}
							else{
							
									//navigate to S3
									this.oRouter.navTo("S3",{
										context : selectedDate
									},true);
							}

					},

					/*cleanUpOnBack : function() {
						this.localSkip = 0;
						this.remoteSkip = 0;
						this.pagingEnabled = false;
						this.localTypeList = [];
						this.remoteTypeList = [];
						this.resultsTotalCount = 0;
						this.remoteSearchPhrase = "";
						this.searchPhrase = "";
						this.oModel.setProperty("typeList", []);
						this.clearSearchField();
						this.continueSearchOnServerActive = false;
					},		*/										//Repeated  functiom

					getTypeListCollection : function(oselectedItem) {

						var self = this;
						var skip = 0;
						var selectedFieldName = (oselectedItem && oselectedItem.fieldName);
						if (this.remoteSearchPhrase) {
							skip = this.remoteSkip;
						} else {
							skip = this.localSkip;
						}
						//NOTE related input help
						var lc_separator = ";;";
						var lv_search_str = "";
						var length=this.getView().getModel('fordynamictypes').getData().types.length;
						for(var i=0;i<length;i++)
							{
							var fieldValue=this.getView().getModel('fordynamictypes').getData().types[i].valueStateText;
							var fieldName=this.getView().getModel('fordynamictypes').getData().types[i].fieldName;
							if(fieldValue.length!==0 && fieldName!==selectedFieldName)
								{
								
								var lv_search_str_temp = fieldName + "=" + fieldValue;
								if(lv_search_str)
								lv_search_str+=lc_separator + lv_search_str_temp;
								else
								lv_search_str+=lv_search_str_temp;
								}
							}
						this.gv_fieldRelated=lv_search_str;
						
						//End of NOTE related input help
						
						// Check //Temporary field set to check Odata
						// this.fieldName= "RKOSTL";
						//NOTE getting the begining and end dates
						var calendarRef = this.byId('weeklyCalendar');
						var selectedDates = calendarRef.getSelectedDates();
						if(selectedDates[0]){
						var len=selectedDates.length;
						this.searchField_begDa=this.parseDateYYYYMMdd(selectedDates[0]);
						this.searchField_endDa=this.parseDateYYYYMMdd(selectedDates[len-1]);
						}
						else
						{
							var oModel = this.oApplication.getModel("TSM_WEEKLY");
							var workingDates=oModel.getData().workingDayList;
							 len=workingDates.length;
							this.searchField_begDa=workingDates[0].date;
							this.searchField_endDa=workingDates[len-1].date;
						}
						//End of NOTE
						this.oService
								.getCostAssignmentTypeListCollection(
										(selectedFieldName || this.fieldName),
										// 'RKOSTL
										this.top,
										skip,
										this.remoteSearchPhrase,
										this.gv_fieldRelated, //NOTE
										this.searchField_begDa,
										this.searchField_endDa,
										function(data) {
											self.remoteSearchActive = false;
											var typeList = [];
											// typeList =
											// self.oModel.getData()[(oselectedItem
											// && oselectedItem.fieldName)];
											if (self.remoteSearch()) {
												//self.typeBinding.filter([]);					//Note 1959135
												//NOTE Removing remoteTypeList
												//typeList = self.remoteTypeList;
												typeList = self.localTypeList;
												self.remoteSearchActive = true;
												self.lastRemoteSearchPhrase = self.remoteSearchPhrase;
											} else {
												typeList = self.localTypeList;
											}
											//NOTE NONE text issue
											// Add a "None" item to the list for
											// user to unselect
											// any type
											if (data.length > 0 && typeList.length === 0) {
												
												  typeList .push({ fieldValueId :
												  self.noneText, fieldValue :
												  self.noneText, fieldId : ""
												  });
												 
											}
											
											
											var flag;
											for ( var i = 0; i < data.length; i++) {
												//Checking for duplicate values
												flag=1;
												for(var j=0;j<typeList.length;j++){
													var vCheckFieldId = "(" + data[i].FieldId + ")";											//Note 1994402: Duplicate entry in search help
													if(typeList[j].fieldValue===data[i].FieldValue && typeList[j].fieldId===vCheckFieldId){
														flag=0;
														break;
													}
												}
												if(flag===1){
												typeList
														.push({
															fieldValue : data[i].FieldValue,
															fieldId : "("+
																	 data[i].FieldId+
																	 ")",
															fieldValueId : data[i].FieldValue+
																	 " ("+
																	 data[i].FieldId+
																	 ")"
														});
											}
											}
											
											function dynamicSort(property) {
												var sortOrder = 1;
												if(property[0] === "-") {
													sortOrder = -1;
													property = property.substr(1);
												}
												return function (a,b) {
													var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
													return result * sortOrder;
												};
											}
												typeList.sort(dynamicSort("fieldId"));
											// Check
											// self.oModel.setProperty("/typeList",
											self.oModel
													.setProperty("/"+ (oselectedItem && oselectedItem.fieldName),
															typeList);
											self.selectCostObject();
											self.oModel.updateBindings();
											if (self.remoteSearch()) {
												self.remoteResultsLength = data.length;
												self
														.checkRemotePaging(self.remoteResultsLength);
											} else {
												self.localResultsLength = data.length;
												self
														.checkLocalPaging(
																self.localResultsLength,
																oselectedItem && oselectedItem.fieldName);
											}
											jQuery.sap.measure
													.end(hcm.emp.mytimesheet.utils.PerfUtils
															.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.COST_ASSIGNMENT_SEARCH_LOAD));
										});
					},

					selectCostObject : function() {
						/* Do Nothing... */
					},

					remoteSearch : function() {
						if ("remoteSearchPhrase" in self) {
							if (self.remoteSearchPhrase) {
								return self.remoteSearchPhrase;
							}
						} else if ("remoteSearchPhrase" in this) {
							if (this.remoteSearchPhrase) {
								return this.remoteSearchPhrase;
							}
						}
						return false;
					},

					checkLocalPaging : function(recordCount, selectedFieldName) {
						//this.typeListControl = this.listOfManualItems[selectedFieldName];
						var typeListArray = this.typeListControl //this.listOfManualItems[selectedFieldName]
								.getItems();
						var typeListArrayLength = typeListArray.length;

						if (typeListArrayLength === 0 || typeListArrayLength >= this.MODEL_SIZE_LIMIT) {
							return;
						}

						if (typeListArray) {
							if (typeListArray[typeListArrayLength - 1]
									.getTitle() === this.oBundle
									.getText("TAP_TO_LOAD_MORE_LOADING")) {
								this.typeListControl
										.removeItem(typeListArray[typeListArrayLength - 1]);
							}
						}
						//NOTE Removing load more after number of hits < 30
						if (recordCount < this.top) {
							
							if (typeListArray[typeListArrayLength - 1].getTitle() === this.oBundle.getText("TAP_TO_LOAD_MORE") || 
									  typeListArray[typeListArrayLength - 1].getTitle() === this.oBundle.getText("CONTINUE_SEARCH_ON_SERVER"))
							{
							  this.typeListControl
							  .removeItem(typeListArray[typeListArrayLength -
							  1]); }
							//END of NOTE Removing load more after number of hits < 30
						} else if (recordCount >= this.top) {
							// If tap to load more item is found in the list, do
							// nothing.
							if (typeListArray[typeListArrayLength - 1]
									.getTitle() === this.oBundle
									.getText("TAP_TO_LOAD_MORE")) {
								return;
							} else {
								// If continue search on server item is found in
								// the list, replace
								// with tap to load more item, else, add the tap
								// to load more item
								// to the list.
								if (typeListArray[typeListArrayLength - 1]
										.getTitle() === this.oBundle
										.getText("CONTINUE_SEARCH_ON_SERVER")) {
									typeListArray[typeListArrayLength - 1]
											.setTitle(this.oBundle
													.getText("TAP_TO_LOAD_MORE"));
								} else {

									this.loadMoreItem = new sap.m.StandardListItem(
											{
												title : this.oBundle
														.getText("TAP_TO_LOAD_MORE"),
												active : true
											});

									this.typeListControl
											.addItem(this.loadMoreItem);
								}
							}
						}
					},

					checkRemotePaging : function(recordCount) {
						if (recordCount >= this.top ||
								 !this.remoteSearchActive ||
								 this.lastRemoteSearchPhrase !== this.remoteSearchPhrase) {
							var typeListArray = this.typeListControl.getItems();
							var typeListArrayLength = typeListArray.length;

							// Add continue search on server item if there is
							// nothing in the list.
							if (typeListArrayLength === 0 ||
									 typeListArrayLength >= this.MODEL_SIZE_LIMIT) {
								this.noneTextItem = new sap.m.StandardListItem(
										{
											title : this.noneText,
											active : true
											});

										this.typeListControl.insertItem(this.noneTextItem,0);
								this.addContinueSearchItem(this.oBundle
										.getText("CONTINUE_SEARCH_ON_SERVER"));
								
								return;
							}
						
								
							// If continue search on server item is found in the
							// list, do nothing.
							if (typeListArray[typeListArrayLength - 1]
									.getTitle() === this.oBundle
									.getText("CONTINUE_SEARCH_ON_SERVER")) {
								return;
							} else {
								// If tap to load more item is found in the
								// list, replace with
								// continue search on server item, else add the
								// continue search on
								// server item.
								if (typeListArray[typeListArrayLength - 1]
										.getTitle() === this.oBundle
										.getText("TAP_TO_LOAD_MORE")) {
									typeListArray[typeListArrayLength - 1]
											.setTitle(this.oBundle
													.getText("CONTINUE_SEARCH_ON_SERVER"));
								} else {
									this
											.addContinueSearchItem(this.oBundle
													.getText("CONTINUE_SEARCH_ON_SERVER"));
								}
							}
						}
						//NOTE Removing continue load on server if number of hits less than top
						else{
							typeListArray = this.typeListControl.getItems();
							typeListArrayLength = typeListArray.length;
							if (typeListArray[typeListArrayLength - 1].getTitle() === this.oBundle.getText("CONTINUE_SEARCH_ON_SERVER") && recordCount < this.top) {
							  this.typeListControl.removeItem(typeListArray[typeListArrayLength - 1]); }
						}
						//End of NOTE Removing continue load on server if number of hits less than top
					},

					addContinueSearchItem : function(title) {

						this.continueSearchItem = new sap.m.StandardListItem({
							title : this.oBundle
									.getText("CONTINUE_SEARCH_ON_SERVER"),
							active : true
						});

						this.typeListControl.addItem(this.continueSearchItem);

						// Merge the 2 columns in the column list item directly
						// in the HTML so
						// that the continue search on server words don't wrap
						// in a single column.
						this.continueSearchItem
								.addEventDelegate(
										{
											onAfterRendering : function(oEvent) {
												$(
														this.continueSearchItem
																.$().context.firstChild)
														.attr("colspan", "2");
											}
										}, this);
					},

					tapToLoadMore : function(selectedItem) {
						/*this.loadMoreItem.setTitle(this.oBundle
								.getText("TAP_TO_LOAD_MORE_LOADING"));*/
						this.localSkip += this.top;
						this.getTypeListCollection(selectedItem);
					},

					continueSearchOnServer : function(selectedItem) {
						/*this.continueSearchItem
								&& this.continueSearchItem
										.setTitle(this.oBundle
												.getText("CONTINUE_SEARCH_ON_SERVER_LOADING"));*/
						this.remoteSearchPhrase = this.searchPhrase;

						if (this.firstRemoteSearch) {
							this.firstRemoteSearch = false;
							this.continueSearchOnServerActive = true;
						} else {
							this.remoteSkip += this.top;
						}

						this.getTypeListCollection(selectedItem);
						return this.remoteSearchPhrase; //NOTE Search Help Disappearing Issue
					},

					refineSearchResult : function() {
						this.typeBinding = this.typeListControl
								.getBinding("items");
						var filters = [];
						if (this.searchPhrase) {
							filters.push(new sap.ui.model.Filter(
									"fieldValueId",
									sap.ui.model.FilterOperator.Contains,
									this.searchPhrase));
							filters.push(new sap.ui.model.Filter(
									"fieldValueId",
									sap.ui.model.FilterOperator.Contains,
									this.noneText));
						}
						this.typeBinding.filter(filters);
					},

					onLiveChange : function(oEvent) {

						var sValue = oEvent.getParameter("value");
						var oFilters = [];
						oFilters.push(new sap.ui.model.Filter("fieldValueId",
								sap.ui.model.FilterOperator.Contains, sValue));
						oEvent.getSource().getBinding("items").filter(oFilters);
						if (oEvent.getSource().getBinding("items").filter(
								oFilters).getLength() < 1) {
							oEvent.getSource().setNoDataText();
						}

						this.searchPhrase = oEvent.getParameter("value");
						this.searchField = oEvent.getSource();
						if (this.searchPhrase) {
							//if (!this.continueSearchOnServerActive) {
								this.refineSearchResult();//refreshes the filter->adds NONE text and the current search string
							//}
							if (this.searchPhrase !== this.remoteSearchPhrase) {
								this.resetRemoteSearch();
							}
							this.remoteSearchPhrase = this.searchPhrase;
							this.checkRemotePaging(this.remoteResultsLength);
							this.selectCostObject();
						} else {
							// User has deleted all search phrase, revert to
							// local model
							this.refineSearchResult();
							this.remoteSearchPhrase = "";
							this.oModel.setProperty("typeList",
									this.localTypeList);
							this.remoteSearchActive = false;
							this.checkLocalPaging(this.localResultsLength);
							this.resetRemoteSearch();
						}
					},

					resetRemoteSearch : function() {
						this.firstRemoteSearch = true;
						this.remoteSkip = 0;
						this.remoteTypeList = [];
						this.continueSearchOnServerActive = false;
						this.remoteSearchPhrase = "";
						this.remoteSearchActive = false;
					},

					onSelectType : function(oEvent) {
						// Check if it is the load more or continue to server
						// button
						var itemTitle = oEvent.mParameters.listItem.getTitle();
						var itemText = oEvent.mParameters.listItem.getText();
						if (itemTitle === this.oBundle
								.getText("TAP_TO_LOAD_MORE")) {
							this.tapToLoadMore();
							return;
						} else if (itemTitle === this.oBundle
								.getText("CONTINUE_SEARCH_ON_SERVER")) {
							this.continueSearchOnServer();
							return;
						}

						// If it is not one of those buttons, send the cost
						// assignment type back to the previous view
						var fieldValueText = itemTitle;
						var fieldValue = itemText
								.substr(1, itemText.length - 2);
						this.cleanUpOnBack();
						if (fieldValueText === this.noneText) {
							this.overrideNavController.navigateBack(
									"CostAssignment", {
										costAssignmentReturnType : ""
									});
						} else {
							this.cleanUpOnBack();
							this.overrideNavController.navigateBack(
									"CostAssignment", {
										costAssignmentReturnType : {
											fieldValueText : fieldValueText,
											fieldValue : fieldValue
										}
									});
						}
						this.clearSearchField();
					},

					clearSearchField : function() {
						if ("searchField" in this) {
							this.searchField.setValue("");
							this.typeBinding.filter([]);
						}
					},

					onSuggestedInputHelp : function(oEvent) {
						var self = this;

						/*
						 * 1) select dialog with list binding and static
						 * parameters
						 */

						var selectedLItem = {};
						selectedLItem.fieldName = oEvent.getSource().getModel()
								.getProperty(
										'fieldName',
										arguments[0].getSource()
												.getBindingContext());
						selectedLItem.name = oEvent.getSource().getParent()
								.getLabel().getText();
						var DialogHeader = oEvent.getSource().getPlaceholder();
						var oSelectDialog1 = new sap.m.SelectDialog({
							title : DialogHeader,
							// noDataText :
							// this.oBundle.getText('TAP_TO_LOAD_MORE_LOADING'),
							search : this.onLiveChange,
							liveChange : this.onLiveChange

						});

						var itemTemplate = new sap.m.StandardListItem({
							title : "{name}",
							description : "{others}",
							active : true
						});
						// selectedLItem.fieldName = "";
						// self.getTypeListCollection(selectedLItem);
						// self.getWorkListCollection(selectedLItem);

						// set model & bind Aggregation
						oSelectDialog1.setModel(self.oModel);
						oSelectDialog1.bindAggregation("items", "/projects",

						itemTemplate);

						oSelectDialog1.open();

						var input = arguments[0].getSource();
						self = this;
						// attach close listener
						oSelectDialog1
								.attachConfirm(function(evt) {

									var selectedItem = evt
											.getParameter("selectedItem");
									if (selectedItem) {
										self.selectedIndex = evt
												.getParameter("selectedItem")
												.getParent()
												.indexOfItem(
														evt
																.getParameter("selectedItem"));
										if (selectedItem.getDescription()) {
											input.setValue(selectedItem
													.getTitle() +
													 ", " +
													 selectedItem
															.getDescription());
										} else {
											input.setValue(selectedItem
													.getTitle());
										}
										self.validateSaveBtnVisibility(evt);
									}

									oSelectDialog1.destroy();
									oSelectDialog1 = null;
								});
						/**
					     * @ControllerHook Extend behavior of On Suggested Input Help
					     * This hook method can be used to add UI or business logic 
					     * It is called when the OnSuggestedInputHelp method executes
					     * @callback hcm.emp.mytimesheet.view.S31~extHookOnSuggestedInputHelp
					     */
							if(this.extHookOnSuggestedInputHelp) {
								this.extHookOnSuggestedInputHelp();
					  	}
					},
					//listOfManualItems : {},
					onInputHelp : function() {
						var self = this;

						/*
						 * 1) select dialog with list binding and static
						 * parameters
						 */

						var selectedLItem = {};
						selectedLItem.fieldName = arguments[0].getSource()
								.getModel().getProperty(
										'fieldName',
										arguments[0].getSource()
												.getBindingContext());
						selectedLItem.name = arguments[0].getSource()
								.getValueStateText();
						selectedLItem.fieldName = arguments[0].getSource()
								.getName();

						var SelectTile = arguments[0].getSource().getParent()
								.getLabel().getText();

						var oSelectDialog1 = new sap.m.SelectDialog({
							title : SelectTile,
							/*noDataText : this.oBundle
									.getText('TAP_TO_LOAD_MORE_LOADING'),*/
							search : [ this.onLiveChange, this ],
							liveChange : [ this.onLiveChange, this ]
						});

						var itemTemplate = new sap.m.StandardListItem({
							title : "{fieldValue}",
							description : "{fieldId}",
							active : true
						});

						//self.listOfManualItems[selectedLItem.fieldName] = oSelectDialog1;
						self.typeListControl = oSelectDialog1;
						self.getTypeListCollection(selectedLItem);

						// set model & bind Aggregation
						oSelectDialog1.setModel(self.oModel);

						oSelectDialog1.bindAggregation("items", "/" +
								 selectedLItem.fieldName, itemTemplate);

						oSelectDialog1.open();

						var input = arguments[0].getSource();

						// attach close listener
						oSelectDialog1
								.attachConfirm(function(evt) {
									var selectedItemEvent = evt
											.getParameter("selectedItem");
									if (selectedItemEvent) {
										self.selectedIndex = evt
												.getParameter("selectedItem")
												.getParent()
												.indexOfItem(
														evt
																.getParameter("selectedItem"));

										// when clciked on load more

										if (selectedItemEvent.getTitle() === self.oBundle
												.getText("TAP_TO_LOAD_MORE")) {
											self.tapToLoadMore(selectedLItem);
											oSelectDialog1.open();
											return;
										} else if (selectedItemEvent.getTitle() === self.oBundle
												.getText("CONTINUE_SEARCH_ON_SERVER")) {
											//NOTE Search Help disappearing problem
											var searchtxt = self.continueSearchOnServer(selectedLItem);
											oSelectDialog1.open(searchtxt);
											//End NOTE Search Help disappearing problem
											return;
										}
										//NOTE  NONE Issue
										else if(selectedItemEvent.getTitle() === "(None)")
										{
											input.setValue("");
                                            input.setValueStateText("");
										}
										else{
											//End of NOTE  NONE Issue
										input.setValue(selectedItemEvent
												.getTitle()+
												 " "+
												 selectedItemEvent
														.getDescription());
										input
												.setValueStateText(selectedItemEvent
														.getDescription()
														.replace('(', "")
														.replace(")", ""));
										}
										/*
										 * var fieldId =
										 * evt.getParameter("selectedItem").getModel().getProperty('fieldId',evt.getParameter("selectedItem").getBindingContext());
										 * var fieldValue =
										 * evt.getParameter("selectedItem").getModel().getProperty('fieldValue',evt.getParameter("selectedItem").getBindingContext());
										 * var fieldValueId =
										 * evt.getParameter("selectedItem").getModel().getProperty('fieldValueId',evt.getParameter("selectedItem").getBindingContext());
										 * var fieldName = input.getName(); var
										 * name = input.getPlaceholder();
										 * self.workListTypeNew.push({
										 * name:fieldName, fieldName:fieldName,
										 * fieldValue:selectedItem.getDescription().replace('(',"").replace(")","")
										 * 
										 * }); input.data({ 'key':fieldName,
										 * 'value':selectedItem.getDescription().replace('(',"").replace(")","")
										 * });
										 */
										self.validateSaveBtnVisibility(evt);

									}
									oSelectDialog1.destroy();

									oSelectDialog1 = null;
									self.localTypeList = [];				//Note 1959135
									self.remoteTypeList = [];
									self.resetRemoteSearch();
									self.top = self.RESULTS_TOP;					
									self.remoteSkip = 0;
									self.localSkip = 0;
								});

						oSelectDialog1.attachCancel(function(evt) {
							oSelectDialog1 = null;
							self.localTypeList = [];						//Note 1959135
							self.remoteTypeList = [];
							self.resetRemoteSearch();
							self.top = self.RESULTS_TOP;					
							self.remoteSkip = 0;
							self.localSkip = 0;


						});
						/**
					     * @ControllerHook Extend behavior of On Input Help
					     * This hook method can be used to add UI or business logic 
					     * It is called when the OnInputHelp method executes
					     * @callback hcm.emp.mytimesheet.view.S31~extHookOnInputHelp
					     */
							if(this.extHookOnInputHelp) {
								this.extHookOnInputHelp();
					  	}

					},
					/*initializeChildItems : function() {
						this.entry.childItems = [];
						this.entry.childNames = [];
						this.entry.childCodes = [];
					},	*/	//Repeated function
					
					// method added for f4 help
					getWorkListCollection : function(oselectedItem) {
						this.getWorkListTypeCollection();
						this.workList = [];
						this.workListType = [];
						var self = this;
						//NOTE getting the begining and end dates
						
							var oModel = this.oApplication.getModel("TSM_WEEKLY");
							var workingDates=oModel.getData().workingDayList;
							var len=workingDates.length;
							this.searchField_begDa=workingDates[0].date;
							this.searchField_endDa=workingDates[len-1].date;
						
						//End of NOTE
						this.oService
								.getCostAssignmentWorkListCollection(
										this,
										this.searchField_begDa,
										this.searchField_endDa,
										function(data) {
											// Create new worklist items for
											// every item
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
											for ( i = 0; i < data.length; i++) {
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
											for ( i = 0; i < self.recentlyUsedCostAssignmentList.length; i++) {
												self.workList
														.push(self.recentlyUsedCostAssignmentList[i]);
											}

											// Populate the HTML view model with
											// the
											// data
											var projects = [];
											for (  i = 0; i < self.workList.length; i++) {
												var currentChildItems = [];
												var currentChildNames = [];
												var currentChildCodes = [];
												for (  j = 0; j < self.workList[i].childs.length; j++) {
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
															fieldValue : self.workList[i].fieldValue,
															fieldValueId : self.workList[i].name +
																	 currentChildItems
																			.join(", ")
														});
												// Check if the current cost
												// assignment
												// type
												// matches
												// something on the recently
												// used list
												if ("selectedMainItem" in self && self.selectedMainItem) {
													if (self.workList[i].name === self.selectedMainItem &&
															 self.workList[i].fieldName === self.selectedMainName &&
															 self.workList[i].fieldValue === self.selectedMainCode) {
														if ("selectedChildItems" in self) {
															var childItems = [];
															var childNames = [];
															var childCodes = [];
															for ( j = 0; j < self.selectedChildItems.length; j++) {
																childItems
																		.push(self.selectedChildItems[j]);
																childNames
																		.push(self.selectedChildNames[j]);
																childCodes
																		.push(self.selectedChildCodes[j]);
															}
															if ($(
																	currentChildItems)
																	.not(
																			childItems).length === 0 &&
																	 $(
																			childItems)
																			.not(
																					currentChildItems).length === 0) {
																if ($(
																		currentChildNames)
																		.not(
																				childNames).length === 0 &&
																		 $(
																				childNames)
																				.not(
																						currentChildNames).length === 0) {
																	if ($(
																			currentChildCodes)
																			.not(
																					childCodes).length === 0 &&
																			 $(
																					childCodes)
																					.not(
																							currentChildCodes).length === 0) {
																		self.previouslySelectedIndex = i;
																	}
																}
															}
														} else {
															if (currentChildItems.length === 0) {
																// Match found
																// in
																// recently used
																// list
																// since
																// subItems is
																// empty
																self.previouslySelectedIndex = i;
															}
														}
													}
												}
											}

											// If selected cost assignment is
											// not in the
											// recently
											// used list, add it
											if (!("previouslySelectedIndex" in self) &&
													 "selectedMainItem" in self &&
													 self.selectedMainItem) {

												var newCostAssignmentType = self
														.createNewCostAssignmentType(
																self.selectedMainItem,
																self.selectedMainName,
																self.selectedMainCode,
																self.selectedChildItems,
																self.selectedChildNames,
																self.selectedChildCodes);

												projects
														.push(newCostAssignmentType);
												self.recentlyUsedCostAssignmentList
														.push(newCostAssignmentType);

												self.previouslySelectedIndex = self.selectedIndex = projects.length - 1;
											}

											self.workList = projects;
											var localdata = {
												projects : self.workList
											};

											self.oModel.setProperty(
													"/projects", self.workList);
											// self.oModel.setData(localdata);
											//self.getWorkListTypeCollection();
										});
					},

					valueHelpDataForamtter : function(fieldName, fieldValue) {
						if (fieldName) {
							return fieldName + " (" + fieldValue + ")";

						}
					},

					durationDateForamtter : function(h, m) {
						return h + ":" + m;
					},

					getWorkListTypeCollection : function() {
						this.workListType = [];
						var self = this;

						this.oService
								.getCostAssignmentWorkListTypeCollection(
										this,
										function(data) {

											var editdatafroms3 = {};
											// this logic will be excuted the
											// first time the view is called

											var manualEntrySelected = self.oApplication
													.getModel('S31modelexch')
													.getData().manualEntrySelected;
											if (manualEntrySelected) {
												editdatafroms3 = self.oApplication
														.getModel(
																'S31modelexch')
														.getData().editeddata;

												if (!self.workListTypeNew) {
													self.workListTypeNew = [];
												}
												if (editdatafroms3) {
													if (editdatafroms3.entry.childItems) {
														for ( var i = 0; i < editdatafroms3.entry.childItems.length; i++) {
															self.workListTypeNew
																	.push({
																		name : editdatafroms3.entry.childItems[i],
																		fieldName : editdatafroms3.entry.childNames[i],
																		fieldValue : editdatafroms3.entry.childCodes[i]
																	});
														}
													}
												}

												self.validateSaveBtnVisibility();
											}

											for (  i = 0; i < data.length; i++) {
												var name = data[i].FieldText;
												var fieldName = data[i].FieldName;
												var selectedName = self.NON_BREAKING_SPACE;
												var fieldValue = "";
												var readOnly = data[i].READONLY;			//Note: Addition of ReadOnly field
												if (self.editCostAssignment) {
													if (self.selectedMainName === fieldName) {
														fieldValue = self.selectedMainCode;
														selectedName = self.selectedMainItem;
													} else {
														if ("selectedChildItems" in self) {
															for ( var j = 0; j < self.selectedChildNames.length; j++) {
																if (self.selectedChildNames[j] === fieldName) {
																	fieldValue = self.selectedChildCodes[j];
																	selectedName = self.selectedChildItems[j];
																}
															}
														}
													}
												}
												/*name = self.oBundle
														.getText("SELECT_PLACEHOLDER")
														+ " " + name;*/			//Select keyword not required
												var valurforEntry = "";
												var valurforStateText = "";
												if (editdatafroms3 &&
														editdatafroms3.entry) {
													if (editdatafroms3.entry.childItems) {
														var code = editdatafroms3.entry.childCodes[editdatafroms3.entry.childNames
																.indexOf(fieldName)];
														var item = editdatafroms3.entry.childItems[editdatafroms3.entry.childNames
																.indexOf(fieldName)];
														if (code) {
															valurforEntry = item +
																	 ' (' +
																	 code +
																	 ')';
														}
														if (item) {
															valurforStateText = code;
														}

														if (!valurforEntry) {
															if (fieldName === editdatafroms3.entry.mainName) {
																valurforEntry = editdatafroms3.entry.mainItem +
																		 ' (' +
																		 editdatafroms3.entry.mainCode +
																		 ')';
																valurforStateText = editdatafroms3.entry.mainCode;
															}
														}

													} else {
														// miancode to be
														// handled
														if (fieldName === editdatafroms3.entry.mainName) {
															valurforEntry = editdatafroms3.entry.mainItem +
																	 ' (' +
																	 editdatafroms3.entry.mainCode +
																	 ')';
															valurforStateText = editdatafroms3.entry.mainCode;
														}
													}
												}

												self.workListType
														.push({
															name : name,
															selectedName : selectedName,
															fieldName : fieldName,
															listType : "Active",
															labelVisible : true,
															typeVisible : true,
															fieldValue : fieldValue,
															value : valurforEntry,
															valueStateText : valurforStateText,
															READONLY : readOnly.toLowerCase()==="true"? false:true	//Note: Addition of ReadOnly Field
														});

											}				
											self.getView().getModel(
													'fordynamictypes')
													.setProperty("/types",
															self.workListType);
											// Selected the appropriate item in
											// the list that
											// was
											// previously selected
											if ("previouslySelectedIndex" in self) {
												// it is possible that this list
												// doesn't exist
												// anymore by this time
												try {
													self.recentlyUsedList.mAggregations.items[self.previouslySelectedIndex]
															.setSelected(true);
												} catch (e) {
												}
												self.oModel.setProperty(
														"/doneButtonEnabled",
														true);
												self.recentlyUsedButtonDoneEnabled = true;
											}

											jQuery.sap.measure
													.end(hcm.emp.mytimesheet.utils.PerfUtils
															.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.COST_ASSIGNMENT_LOAD));
										});

					},
					createNewCostAssignmentType : function(mainItem, mainName,
							mainCode, childItems, childNames, childCodes) {
						var childList = [];
						var tempChildItems = [];
						if (typeof childItems !== 'undefined') {
							for ( var i = 0; i < childItems.length; i++) {
								childList.push({
									name : childItems[i],
									fieldName : childNames[i],
									fieldValue : childCodes[i]
								});
								tempChildItems.push(childItems[i]);
							}
							
						}
						return {
							name : mainItem,
							others : tempChildItems.join(", "),
							childs : childList,
							fieldName : mainName,
							fieldValue : mainCode
						};
					},
					onRecentUsedSelect : function() {
						this.recentlyUsedButtonSelected = true;
						this.setBtnEnabled('SUBMIT_BTN', false);
						this.byId("COST_ASSIGNMENT_RECENTLY_USED_LIST_ELEMENT")
								.setVisible(true);
						this.byId("COST_ASSIGNMENT_MANUAL_INPUT_LIST")
								.setVisible(false);

						// reset the types set for manual entry
						var typesArray = this.getView().getModel(
								'fordynamictypes').getData().types;
						if (typesArray) {
							for ( var i = 0; i < typesArray.length; i++) {
								typesArray[i].value = "";
							}

							this
									.getView()
									.getModel('fordynamictypes')
									.setProperty('/fordynamictypes', typesArray);
						}
					},

					onManualEntrySelect : function() {
						this.recentlyUsedButtonSelected = false;
						this.byId("COST_ASSIGNMENT_MANUAL_INPUT_LIST")
								.setVisible(true);
						// this.byId("COST_ASSIGNMENT_RECENTLY_USED_LIST").setVisible(false);
						this.byId("COST_ASSIGNMENT_RECENTLY_USED_LIST_ELEMENT")
								.setVisible(false);

						// reset data of the form
						this.byId('COST_ASSIGNMENT_RECENTLY_USED_LIST')
								.setValue('');
					},

					onDone : function() {
						// clean in-line error message for the entry
						this.entry.showError = false;
						this.entry.error = "";

						this.cleanUpOnBack();
						this.resetMainAndChildItems();
						var mainItemFound = true;
						this.entry.notes = this.byId('S31TextArea').getValue();
						// When user press done, check if user is in recent /
						// add list and
						// process
						// data accordingly.
						if (this.recentlyUsedButtonSelected) {
							this.entry.mainItem = this.workList[this.selectedIndex].name;
							this.entry.mainName = this.workList[this.selectedIndex].fieldName;
							this.entry.mainCode = this.workList[this.selectedIndex].fieldValue;
							if (this.workList[this.selectedIndex].others) {
								this.initializeChildItems();
								this.entry.subItems = this.workList[this.selectedIndex].others;

								for ( var i = 0; i < this.workList[this.selectedIndex].childs.length; i++) {
									this.entry.childItems
											.push(this.workList[this.selectedIndex].childs[i].name);
									this.entry.childNames
											.push(this.workList[this.selectedIndex].childs[i].fieldName);
									this.entry.childCodes
											.push(this.workList[this.selectedIndex].childs[i].fieldValue);
								}
							}
						} else {
							mainItemFound = false;
							/*
							 * for ( var i = 0; i < this.workListTypeNew.length;
							 * i++) { if (!mainItemFound) { this.entry.mainItem =
							 * this.workListTypeNew[i].name; this.entry.mainName =
							 * this.workListTypeNew[i].fieldName;
							 * this.entry.mainCode =
							 * this.workListTypeNew[i].fieldValue; mainItemFound =
							 * true; } else { if (!this.entry.childItems) {
							 * this.initializeChildItems();
							 * this.childItemsInitialized = true; }
							 * this.entry.childItems.push(this.workListTypeNew[i].name);
							 * this.entry.childNames
							 * .push(this.workListTypeNew[i].fieldName);
							 * this.entry.childCodes
							 * .push(this.workListTypeNew[i].fieldValue); } }
							 * 
							 */

							// logic fetching data directly from input fields
							var inputList = this.byId(
									'COST_ASSIGNMENT_MANUAL_INPUT_LIST')
									.getFormElements();
							for ( var j = 0; j < inputList.length; j++) {
								/*
								 * var key =
								 * inputList[j].getFields()[0].data('key'); var
								 * value =
								 * inputList[j].getFields()[0].data('value');
								 */
								var key = inputList[j].getFields()[0].getName();
								var value = inputList[j].getFields()[0]
										.getValue() &&
										 inputList[j].getFields()[0]
												.getValueStateText();
								if (!value) {
									value = inputList[j].getFields()[0]
											.getValue();
								}
								if (value) {
									if (!mainItemFound) {
										this.entry.mainItem = key;
										this.entry.mainName = key;
										this.entry.mainCode = value;
										mainItemFound = true;
									} else {
										if (!this.entry.childItems) {
											this.initializeChildItems();
											this.childItemsInitialized = true;
										}
										this.entry.childItems.push(key);
										this.entry.childNames.push(key);
										this.entry.childCodes.push(value);
									}
								}
							}

							if ("childItems" in this.entry) {
								if (this.entry.childItems.length > 1) {
									this.entry.subItems = this.entry.childItems
											.join(", ");
								} else if (this.entry.childItems.length === 1) {
									this.entry.subItems = this.entry.childItems[0];
								}
							}
						}

						// Do something only if a mainItem exist.
						if (mainItemFound) {
							this.setEntryChanged();
							this.onSubmit();
						} else {
							this.initializeChildItems();
						}
					},

					onSubmit : function() {
						// clean in-line error message for the entry
						this.entry.showError = false;
						this.entry.error = "";
						this.entry.rejectionReason = undefined;

						// return original data with the new/edited entry
						this.updatePageData();


					},

					updatePageData : function(bDeleted) {
						if (bDeleted) {
							this.entry.deleted = true;
						}

						// Prepare entry
						this.entry.newEntry = false;
						this.entry.showTime = true;
						//NOTE lunch time
						var calendarRef = this.byId('weeklyCalendar');
						var selectedDates = calendarRef.getSelectedDates();
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						var workingDates=oModel.getData().workingDayList;
						var selDatesObj=new Array(),c=0;
						//End of NOTE
			//Note 1959135: Added an additional check for decimalTimeEntry field
						if ((this.isDecimalTimeEntry()) &&
								 (!this.isClockEntry())) {
							/*Note: dot-comma issue*/
							//this.entry.time = this.byId("decimalTimeEntryValue").getValue();
							var lv_Duration=this.byId("decimalTimeEntryValue").getValue();
							if(lv_Duration.indexOf(",")>0) lv_Duration=lv_Duration.replace(",",".");
							this.entry.time =lv_Duration;
							/*Note: end dot-comma issue*/
						} else {
							if (!this.isClockEntry()) {
								var dateTimevalue = this.byId(
										"DateTimeInputValue").getValue();
								this.entry.hours = dateTimevalue.split(':')[0];
								this.entry.minutes = dateTimevalue.split(':')[1];
								this.entry.time = parseFloat(this.entry.hours) +
										 parseFloat(this.entry.minutes) / 60;
								//Note 1959135: rounding off to two decimals
								this.entry.time = this.entry.time.toFixed(2); 

							} else {
								//NOTE Updating entry.selected date
								
								for(var i=0;i<selectedDates.length;i++)
								{
									
									var datStr = this.parseDateYYYYMMdd(selectedDates[i]);
								    
								    $.each(workingDates,function(key,value){
								       
								       if(value.date===datStr)
								       {
								          selDatesObj[c++]=value;
								         } 
								    });
								    
								    
								}
								this.entry.selectedDate=selDatesObj;
								//END of NOTE
								var startTime = this.byId("startTime")
										.getDateValue(), endTime = this.byId(
										"endTime").getDateValue();

								this.entry.startTime = this
										.convertTime(startTime);
								this.entry.endTime = this.convertTime(endTime);

								var durationInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

								this.entry.hours = parseInt(
										(durationInMinutes / 60), 10);
								this.entry.minutes = durationInMinutes % 60;
								//Note 1959135: Let the backend calculate the time
								this.entry.time = "0.0"; 
							}
						}
						this.entry.hasNotes = (this.entry.notes && this.entry.notes.length > 0) ? true
								: false;

						this.submitToOdata();
						/**

					     * @ControllerHook Extend behavior of Update Data
					     * This hook method can be used to add UI or business logic 
					     * It is called when the UpdateData method executes
					     * @callback hcm.emp.mytimesheet.view.S31~extHookUpdateData
					     */
							if(this.extHookUpdateData) {
								this.extHookUpdateData();
					  	}

					},
					convertTime : function(date) {
						var timeFormat = sap.ui.core.format.DateFormat
								.getTimeInstance({
									pattern : "HHmmss"
								});
						return timeFormat.format(date);
					},

					 formatAMPM: function(date) {
					  var hours = date.getHours();
					  var minutes = date.getMinutes();
					  var ampm = hours >= 12 ? 'PM' : 'AM';
					  hours = hours % 12;
					  hours = hours ? hours : 12; // the hour '0' should be '12'
					  minutes = minutes < 10 ? '0'+minutes : minutes;
					  var strTime = hours + ':' + minutes + ' ' + ampm;
					  return strTime;
					},

					submitToOdata : function() {
						this.validateLunchBreak();//NOTE Checking if the input times are between the lunch hour
						var self = this;
						var calendarRef = this.byId('weeklyCalendar');
						var selectedDates = calendarRef.getSelectedDates();
						this.errors = null;
						var summaryText = new sap.m.Text({
							text : this.byId('createformtitle').getTitle()
						});
						self = this;
						var confirmationDialog = null;
						var i = 0;

						// Adding Dialog Factoy instead of Dialog
						// Calculation of Number of Hours to be displayed in the
						// Confirmation Dialog
						var hours;
						var minutes;
						var noOfSelection = selectedDates.length;
						if (!this.isClockEntry()) {
							var dateTimevalue = this.byId("DateTimeInputValue")
									.getValue();
							hours = dateTimevalue.split(':')[0];
							
							minutes = dateTimevalue.split(':')[1];
							hours = hours * noOfSelection;
							minutes = minutes * noOfSelection;
							if (minutes > 59) {
								minutes = minutes % 60;
								hours += Math.round(minutes / 60);
							}
						} else {
							var startTime = this.byId("startTime")
							.getDateValue(), endTime = this.byId(
							"endTime").getDateValue();
					var durationInMinutes = (endTime.getTime() - startTime
							.getTime()) / (1000 * 60);
					durationInMinutes = durationInMinutes * noOfSelection;
							//lunch calc
					var iStart = startTime.getHours()*60 + startTime.getMinutes();
					var iEnd = endTime.getHours()*60 + endTime.getMinutes();
					for( i=0;i<this.entry.selectedDate.length;i++){
					var iLunchStart = parseInt(this.entry.selectedDate[i].lunchStart.substring(0, 2), 10) * 60 + 
						parseInt(this.entry.selectedDate[i].lunchStart.substring(2, 4), 10);
					var iLunchEnd = parseInt(this.entry.selectedDate[i].lunchEnd.substring(0, 2), 10) * 60 + 
						parseInt(this.entry.selectedDate[i].lunchEnd.substring(2, 4), 10);
					
					/*var iLunchStart=720;
					var iLunchEnd=780;*/
					if(iStart<iLunchStart && iEnd>iLunchEnd) {
						// deduct lunch time from duration
						durationInMinutes-=(iLunchEnd - iLunchStart);
					}
					if(durationInMinutes<0) {
						durationInMinutes+=(24*60);
							}
					}//end of for loop
							//end of lunch calc
					hours = parseInt((durationInMinutes / 60), 10);
					minutes = durationInMinutes % 60;

					/*hours = hours * noOfSelection;
					minutes = minutes * noOfSelection;*/
					if (minutes > 59) {
						minutes = minutes % 60;
						hours += Math.round(minutes / 60);
					}
					}

						// Note 1959135
						var summaryHoursText;
						if (this.isDecimalTimeEntry() && !this.isClockEntry()) {
							/*Note: dot-coma issue*/
							var decimalTimeEntryValue=this.getView().byId('decimalTimeEntryValue').getValue();
							if(decimalTimeEntryValue.indexOf(",")>-1) decimalTimeEntryValue=decimalTimeEntryValue.replace(",",".");
							//decimalTimeEntryValue = parseFloat(decimalTimeEntryValue) * noOfSelection;
							//showing duration for only one day
							decimalTimeEntryValue = parseFloat(decimalTimeEntryValue);
							decimalTimeEntryValue = decimalTimeEntryValue.toFixed(2);
							var formattedDecimal=sap.ca.ui.model.format.NumberFormat.getInstance({style:'standard'}).format(decimalTimeEntryValue);
							summaryHoursText = formattedDecimal;
							/*Note: End dot-coma issue*/
						} else {
							summaryHoursText = this.oBundle.getText(
									'FULL_CONCATENATE_HOURSMIN', [ hours,
											minutes ]);
						}
						var InitalInfoModel = this.oApplication
						.getModel("timesheet_initialInfo");
				var releaseAllowed = InitalInfoModel.getData().releaseAllowed;

				var popupHeader;
				var popupTitle;
				if (releaseAllowed) {
					popupHeader = this.oBundle
							.getText('DRAFT_CONFIRMATION_SUMMARY');
					popupTitle = this.oConfiguration
							.getText("DRAFT_CONFIRMATION");		
				} else {
					popupHeader = this.oBundle.getText('SUBMISSION_CONFIRMATION_SUMMARY');
					popupTitle = this.oConfiguration.getText("SUBMISSION_CONFIRMATION");
				}
				var summaryDurationText="";
				var start_time=null;
				var end_time=null;
				if(this.isClockEntry())
				{
					if(this.byId("startTime").getDisplayFormat() === "hh:mm a" || this.byId("startTime").getDisplayFormat() === "h:mm a"){
						start_time=this.formatAMPM(startTime);
						end_time=this.formatAMPM(endTime);
					}
					else{
						start_time= startTime.getHours() + ":" + startTime.getMinutes();
						end_time = endTime.getHours() + ":" + endTime.getMinutes();
					}
					var oSettings = {
					question : popupHeader,
					// question :
					// this.byId('createformtitle').getTitle(),
					// additionalInformation : [],
					additionalInformation : [
							{
								label : this.oBundle
										.getText('DELETE_CONFIRMATION_SUMMARY_ENTRIES'),
								text : selectedDates.length.toString()
							},
							{
								label : this.oBundle
										.getText('START_TIME'),
								text : start_time
							
							},
							{
								label : this.oBundle
										.getText('END_TIME'),
								text : end_time
							} ],
					showNote : false,
					title : popupTitle,
					confirmButtonLabel : this.oBundle.getText("OK")
				};
				
				}
				else{
					
					 oSettings = {
					question : popupHeader,
					// question :
					// this.byId('createformtitle').getTitle(),
					// additionalInformation : [],
					additionalInformation : [
							{
								label : this.oBundle
										.getText('DELETE_CONFIRMATION_SUMMARY_ENTRIES'),
								text : selectedDates.length.toString()
							},
							{
								label : this.oBundle
										.getText('DURATION'),
								text : summaryHoursText
							// this.oBundle.getText('FULL_CONCATENATE_HOURSMIN',[hours,minutes])
							} ],
					showNote : false,
					title : popupTitle,
					confirmButtonLabel : this.oBundle.getText("OK")
				};
				}
				//Introducing Check  Time Entry


				// lock UI until submit is done
				// to prevent double click
				// sap.ui.getCore().lock();

				jQuery.sap.measure
						.start(hcm.emp.mytimesheet.utils.PerfUtils
								.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));

				var batchCreate = [];
				var operation = (self.oApplication
						.getModel(
								'S31modelexch')
						.getData().manualEntrySelected) ? "U"
						: "C";
				if (selectedDates.length !== 0) {

					for (i = 0; i < selectedDates.length; i++) {
						self.entry = this.replaceSpecialChar(self.entry); 			//Note 1994402: Replacing Special Character

						batchCreate
								.push(self
										.setPostObject(
												self.entry.counter,
												operation,
												self
														.parseDateYYYYMMdd(selectedDates[i]),
												self.entry.time,
												self.entry.mainName,
												self.entry.mainCode,
												self.entry.notes,
												self.entry.startTime,
												self.entry.endTime,
												self.entry.subItems,
												self.entry.childCodes,
												self.entry.childNames));

					}

				}

				if (batchCreate.length === 0) {
					// if there is nothing to
					// submit, just act like a
					// cancel
					sap.ui.getCore().lock();
					confirmationDialog.close();
					setTimeout(function() {
						// sap.ui.getCore().unlock();
					}, 500);
				} else {
					// only submit if there is
					// something to submit,
					// otherwise SAP UI5 does
					// not give a response
					self.oService
							.checkSubmittedTime(
									self,
									batchCreate,
									[],
									[],
									function() {
										jQuery.sap.measure
										.end(hcm.emp.mytimesheet.utils.PerfUtils
												.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));
										
										sap.ca.ui.dialog.factory
										.confirm(
												oSettings,
												function(response) {
													if (response.isConfirmed === true) {

														// lock UI until submit is done
														// to prevent double click
														// sap.ui.getCore().lock();

														jQuery.sap.measure
																.start(hcm.emp.mytimesheet.utils.PerfUtils
																		.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));

														var batchCreate = [];
														var operation = (self.oApplication
																.getModel(
																		'S31modelexch')
																.getData().manualEntrySelected) ? "U"
																: "C";
														if (selectedDates.length !== 0) {

															for (i = 0; i < selectedDates.length; i++) {

																batchCreate
																		.push(self
																				.setPostObject(
																						self.entry.counter,
																						operation,
																						self
																								.parseDateYYYYMMdd(selectedDates[i]),
																						self.entry.time,
																						self.entry.mainName,
																						self.entry.mainCode,
																						self.entry.notes,
																						self.entry.startTime,
																						self.entry.endTime,
																						self.entry.subItems,
																						self.entry.childCodes,
																						self.entry.childNames));

															}

														}

														if (batchCreate.length === 0) {
															// if there is nothing to
															// submit, just act like a
															// cancel
															sap.ui.getCore().lock();
															confirmationDialog.close();
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
																				setTimeout(
																						function() {

																							var calendar = self
																									.byId("weeklyCalendar");
																							var selectedDates = calendar
																									.getSelectedDates();
																							var dateStr;
																							dateStr = selectedDates[0];

																							var selectedDate = dateStr+
																									 'offset'+
																									 calendar
																											.getFirstDayOffset();

																							self.oRouter
																									.navTo(
																											"S3",
																											{
																												context : selectedDate
																											});

																						},
																						500);

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

													}
												});

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
					//NOTE End of Check Time Entries
					/*//NOTE: NORMAL EXECUTION FLOW WITHOUT CHECKTIME
					jQuery.sap.measure
					.end(hcm.emp.mytimesheet.utils.PerfUtils
							.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));
					
					sap.ca.ui.dialog.factory
					.confirm(
							oSettings,
							function(response) {
								if (response.isConfirmed == true) {

									// lock UI until submit is done
									// to prevent double click
									// sap.ui.getCore().lock();

									jQuery.sap.measure
											.start(hcm.emp.mytimesheet.utils.PerfUtils
													.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));

									var batchCreate = [];
									var operation = (self.oApplication
											.getModel(
													'S31modelexch')
											.getData().manualEntrySelected) ? "U"
											: "C";
									if (selectedDates.length !== 0) {

										for (i = 0; i < selectedDates.length; i++) {

											batchCreate
													.push(self
															.setPostObject(
																	self.entry.counter,
																	operation,
																	self
																			.parseDateYYYYMMdd(selectedDates[i]),
																	self.entry.time,
																	self.entry.mainName,
																	self.entry.mainCode,
																	self.entry.notes,
																	self.entry.startTime,
																	self.entry.endTime,
																	self.entry.subItems,
																	self.entry.childCodes,
																	self.entry.childNames));

										}
										;

									}

									if (batchCreate.length === 0) {
										// if there is nothing to
										// submit, just act like a
										// cancel
										sap.ui.getCore().lock();
										confirmationDialog.close();
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
															setTimeout(
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
																	500);

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

								}
							});


							//Note: end removal of check time entry odata call
							*/
					

				
				}
				
				
				
					},

					//Note 1994402: Replaceing special charater '/' with '-'
					replaceAllOccurances : function(iString){
						if(typeof iString==="undefined"){
							return;
						}
						var vSearch = '/';
						var vReplace = '-';
						while( iString.indexOf(vSearch) > -1){
							iString = iString.replace(vSearch, vReplace);
						}
						return iString;
					},
					replaceSpecialChar : function(entry){
						if(typeof entry.mainName !== "undefined"){
							entry.mainName = this.replaceAllOccurances(entry.mainName);
						}
						if(typeof entry.subItems !== "undefined"){
							entry.subItems = this.replaceAllOccurances(entry.subItems);
						}
						if(typeof entry.childNames !== "undefined"){
							for(var i = 0; i < entry.childNames.length ; i++){
								entry.childNames[i] = this.replaceAllOccurances(entry.childNames[i]);
							}
						}
						
						return entry;
					},

					getDateStr : function(date1) {
						return "" + date1.getFullYear()+
								 ("" + (date1.getMonth() + 101)).substring(1)+
								 ("" + (date1.getDate() + 100)).substring(1);
					},

					getPostData : function(day, entry) {
						var post = {};
						post.day = day;
						post.entry = entry;
						return post;
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
							}

						};

						// always send as blank						
						timeEntryUpdated.TimeEntryRelease = " ";

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

					parseDateYYYYMMdd : function(dateString) {
						var dateParse = sap.ui.core.format.DateFormat
								.getDateInstance({
									pattern : "YYYYMMdd"
								});

						var selectedDate = new Date(dateString);

						return dateParse.format(selectedDate);
					},

					onReset : function(oEvent) {
						// reset calendar
						var calendarRef = this.byId('weeklyCalendar');
						var selectedDates = calendarRef.getSelectedDates();
						calendarRef.toggleDatesSelection(selectedDates);

						//NOTE reset selectedDates titlebar
						this.byId('createformtitle').setTitle(
									this.oBundle.getText('ENTRY_DETAILS'));
						
						// reset duration
						this.byId('DateTimeInputValue').setValue('now');

						// Note 1959135: reset decimalTimeEntry
						if(this.isDecimalTimeEntry()){
						this.byId('decimalTimeEntryValue').setValue('');
						}
						// reset start and end time
						if(this.isClockEntry()){
						this.byId('startTime').setValue('');
						this.byId('endTime').setValue('');
						}
						// reset text area
						this.byId('S31TextArea').setValue('');

						// reset suugest value input
						this.byId('COST_ASSIGNMENT_RECENTLY_USED_LIST')
								.setValue('');

						// reset manual value input
						var typesArray = this.getView().getModel(
								'fordynamictypes').getData().types;
						if (typesArray) {
							for ( var i = 0; i < typesArray.length; i++) {
								typesArray[i].value = "";
							}
							this
									.getView()
									.getModel('fordynamictypes')
									.setProperty('/fordynamictypes', typesArray);
						}
						this.validateSaveBtnVisibility(oEvent);
					},

					isClockEntry : function() {
						return this.oConfiguration.getClockEntry();
					},

					// Note 1959135
					isDecimalTimeEntry : function() {
						return this.oConfiguration.getDecimalTimeEntry();
					},

					setEntryChanged : function() {
						this.entry.suggestion = false;
						this.entry.showTime = true;
					},

					resetMainAndChildItems : function() {
						if ("mainItem" in this.entry) {
							this.deleteMainItem();
						}
						if ("subItems" in this.entry) {
							this.deleteSubItems();
						}
					},

					deleteMainItem : function() {
						delete this.entry.mainItem;
						delete this.entry.mainName;
						delete this.entry.mainCode;
					},

					deleteSubItems : function() {
						delete this.entry.subItems;
						delete this.entry.childItems;
						delete this.entry.childNames;
						delete this.entry.childCodes;
					},

					initializeChildItems : function() {
						this.entry.childItems = [];
						this.entry.childNames = [];
						this.entry.childCodes = [];
					},

					cleanUpOnBack : function() {
						if ("previouslySelectedIndex" in this) {
							delete this.previouslySelectedIndex;
						}
						if ("selectedMainItem" in this) {
							delete this.selectedMainItem;
							delete this.selectedMainName;
							delete this.selectedMainCode;
						}
						if ("selectedChildItems" in this) {
							delete this.selectedChildItems;
							delete this.selectedChildNames;
							delete this.selectedChildCodes;
						}
						// this.unselecteAllRecentlyUsedListItems();
						this.recentlyUsedButtonDoneEnabled = false;
					},

					getHeaderFooterOptions : function() {

						this._initialize();

						var InitalInfoModel = this.oApplication
								.getModel("timesheet_initialInfo");
						var releaseAllowed = InitalInfoModel.getData().releaseAllowed;

						var submitButtonText;
						if (releaseAllowed) {
							submitButtonText = this.oApplicationFacade
									.getResourceBundle().getText("SAVE_DRAFT");
						} else {
							submitButtonText = this.oApplicationFacade
									.getResourceBundle().getText("SUBMIT");
						}
						var screenTitleText;
						if (this.oApplicationFacade.oApplicationImplementation
								.getModel('S31modelexch').getData().recentlyUsedSelected) {
							screenTitleText = this.oApplicationFacade
									.getResourceBundle().getText(
											"TIMESHEET_CREATE_ENTRY_TITLE");
						} else {
							screenTitleText = this.oApplicationFacade
									.getResourceBundle()
									.getText(
											"TIMESHEET_EDIT_ENTRY_TITLE_SCREEN");
						}

						var valueforbutton = {
							sId : "SUBMIT_BTN",
							sI18nBtnTxt : submitButtonText,
							onBtnPressed : function(evt) {
								that.onDone(evt);
							}
						};

						var that = this;
						return {
							sI18NFullscreenTitle : screenTitleText,

							oEditBtn : valueforbutton,

							buttonList : [

							{
								sId : "cancelBtn",
								sI18nBtnTxt : "RESET",
								onBtnPressed : function(evt) {
									// that.onCancel(evt);
									that.onReset(evt);
								}
							} ],
							onBack: jQuery.proxy(function() { //Note: overriding the back function
				                	this.onNavButton();
						}, this)
				        
						};

					}, 

					/**
					 * Called when the View has been rendered (so its HTML is
					 * part of the document). Post-rendering manipulations of
					 * the HTML could be done here. This hook is the same one
					 * that SAPUI5 controls get after being rendered.
					 * 
					 * @memberOf test_mytimesheet.test
					 */
					// onAfterRendering: function() {
					//
					// },
					/**
					 * Called when the Controller is destroyed. Use this one to
					 * free resources and finalize activities.
					 * 
					 * @memberOf test_mytimesheet.test
					 */
					onExit : function() {
						self.workListTypeNew = [];
						/*
						 * this.byId('COST_ASSIGNMENT_RECENTLY_USED_LIST').destroy();
						 * this.byId('COST_ASSIGNMENT_MANUAL_INPUT_LIST').destroy();
						 */
					}
				});
