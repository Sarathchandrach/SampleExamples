/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("hcm.emp.mytimesheet.model.TimeEntry");
jQuery.sap.require("hcm.emp.mytimesheet.utils.ConnectionHelper");
jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.require("sap.ca.ui.dialog.Dialog");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("hcm.emp.mytimesheet.utils.InitialConfigHelper");
jQuery.sap.require("sap.ca.ui.model.type.Number");//Note dot-comma issue

sap.ca.scfld.md.controller.BaseFullscreenController
		.extend(
				"hcm.emp.mytimesheet.view.S3",
				{
					//Controller Hook method definitions
					extHookReleaseEntriesSummary: null,
					extHookOnSubmit: null,
					extHookOnItemSelect: null,
					extHookUpdateData: null,
					extHookGetTimeSheetCalendar: null,
					extHookLoadList: null,
					extHookUpdatePageData: null,
					
					onInit : function() {
						// code in the constructor in wave 1 below

						// execute the onInit for the base class
						// BaseFullscreenController
						sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit.call(this);

						// Get connection manager/resource bundle
						
						//ApplicationFacade
						this.oApplication = this.oApplicationFacade.oApplicationImplementation;
						//this.oConfiguration = this.oApplication.oConfiguration;
						this.oConfiguration = new hcm.emp.mytimesheet.utils.InitialConfigHelper();
						this.oConnectionManager = this.oApplication
								.oConnectionManager;
						this.oBundle = this.oApplicationFacade.oApplicationImplementation.getResourceBundle();
						this.oConfiguration.setResourceBundle(this.oBundle);
						var self = this;
						var oModel = new sap.ui.model.json.JSONModel({
							phone : jQuery.device.is.phone
						});
						//sap.ui.getCore().setModel(oModel, "TSM_WEEKLY");
						//Application Facade changes
						this.oApplication.setModel(oModel, "TSM_WEEKLY");
						
						if (!this.oService) {
							this.oService = new hcm.emp.mytimesheet.Service();
						}
						

						
						// already existing code in init method

						// jQuery.sap.measure.start(hcm.emp.mytimesheet.utils.PerfUtils.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_LOAD));
						var self = this;
						var oModel = this.oApplication.getModel("TSM_WEEKLY");

						this.oRouter.attachRouteMatched(function(oEvent) {

							if (oEvent.getParameter("name") === "S3") {

																
								var context = oEvent.getParameter("arguments").context;
								/*var offSet = parseInt(context[context.indexOf("offset") + 6], 10);*///Note
								var firstDayOffSet = parseInt(context[context.indexOf("offset") + 6], 10);
								var dateStr = context.replace("offset", "");
								dateStr = dateStr.slice(0, -1);

								var date = new Date(dateStr);

								var startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - self.getActualOffset(firstDayOffSet,date.getDay()));
								var endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 6);

								// logic brought from main screen
								var opayLoad = {
									// main : self,
									startDate : self.getDateStr(startDate),
									endDate : self.getDateStr(endDate),
									month : date.getMonth(),
									date : date,
									dateStr : dateStr,
									year : date.getFullYear(),
								// week : date.getWeek()
								};
								var localEventdata = opayLoad;

								/*
								 * oModel.setProperty("/main", localEventdata.main);
								 */
								self.oApplication.getModel('TSM_WEEKLY').setProperty("/firstDayOffset",firstDayOffSet);//Note
								oModel.setProperty("/showSubmit", false);
								oModel.setProperty("/selected", localEventdata.dateStr);
								oModel.setProperty("/year", localEventdata.year);
								oModel.setProperty("/week", localEventdata.week);
								oModel.setProperty("/start", localEventdata.startDate);
								oModel.setProperty("/end", localEventdata.endDate);
								self.lastSelected = localEventdata.dateStr;
								self.lastYear = localEventdata.year;
								self.lastWeek = localEventdata.week;
								self.lastStartDate = localEventdata.startDate;
								self.lastEndDate = localEventdata.endDate;

								var InitalInfoModel = self.oApplication.getModel(
								"timesheet_initialInfo");
	
								//when called form a book mark model is not initialized yet
								if(!InitalInfoModel){
									self.oService.getInitialInfos(self,self
											.getDateStr(startDate), self.getDateStr(date),
											function(){
												var InitalInfoModel = self.oApplication.getModel(
												"timesheet_initialInfo");
												var releaseAllowed = InitalInfoModel.getData().releaseAllowed;
												var releaseFuture = InitalInfoModel.getData().releaseFuture;
												self.checkboxList = [];
												oModel.setProperty("/releaseAllowed", releaseAllowed);
												oModel.setProperty("/releaseFuture", releaseFuture);
												self.setBtnEnabled("SUBMIT_BTN", false);
												
												//Note 1959135: decimal time entry field
												var decimalTimeEntry = InitalInfoModel.getData().decimalTimeEntry;
												oModel.setProperty("/decimalTimeEntry", decimalTimeEntry);
												
												self.clockEntry = InitalInfoModel.getData().clockEntry;
												oModel.setProperty("/clockEntry", self.clockEntry);
												self.oConfiguration.setInitialInfoModel(InitalInfoModel);
									});
								}else{
																		
									var releaseAllowed = InitalInfoModel.getData().releaseAllowed;
									var releaseFuture = InitalInfoModel.getData().releaseFuture;
									self.checkboxList = [];
									oModel.setProperty("/releaseAllowed", releaseAllowed);
									oModel.setProperty("/releaseFuture", releaseFuture);
									self.setBtnEnabled("SUBMIT_BTN", false);
									
									//Note 1959135: decimal time entry field
									var decimalTimeEntry = InitalInfoModel.getData().decimalTimeEntry;
									oModel.setProperty("/decimalTimeEntry", decimalTimeEntry);
									
									self.clockEntry = InitalInfoModel.getData().clockEntry;
									oModel.setProperty("/clockEntry", self.clockEntry);
									self.oConfiguration.setInitialInfoModel(InitalInfoModel);
									
								}																			
								
								self.updateData();
								self.getView().setModel(oModel);
//								self.loadListWithoModel();
								self.checkSubmit();
								self.onAfterRendering();
															
								
								//Reseting the Delete Button text when navigation back to this screen and disbaling the button
								self.setBtnText("deleteBtn", self.oApplicationFacade.getResourceBundle().getText("DELETE"));
								self.setBtnEnabled("deleteBtn", false);
								//Resetting the Submit Button
								if(self.oApplication.getModel("timesheet_initialInfo").getData().releaseAllowed){
									self.setBtnText("SUBMIT_BTN", self	.oApplicationFacade.getResourceBundle().getText("SUBMIT"));
									self.setBtnEnabled("SUBMIT_BTN", false);
								}
								this.checkboxList = [];
									
							}

						});
						

						this.getView().addEventDelegate({
							// TODO on before has been changed from wave1
							onBeforeShow : function(oEvent) {
							
							}
						});

						// trick needed to show back button in ipad mode
						var oPage = this.byId("WEEKLY_PAGE");
						oPage.addEventDelegate({
							onAfterRendering : function() {
								// TODO
								// oPage._navBtn.removeStyleClass("sapMSplitAppHiddenChild");
							}
						});

						if (!jQuery.device.is.phone) {
							var footer = this.byId("WEEKLY_FOOTER");
							// footer.insertContentRight(this.byId("SUBMIT_BTN"), 0);
							// footer.removeAllContentMiddle();
						}
						if (jQuery.device.is.tablet && jQuery.device.is.portrait) {
							this.byId("WEEKLY_PAGE").addStyleClass("sapTSM-TabletPortrait");
						} else {
							this.byId("WEEKLY_PAGE").removeStyleClass("sapTSM-TabletPortrait");
						}

						// new model for data excahnge with s31
						var S31modelexch = new sap.ui.model.json.JSONModel();
						this.oApplication.setModel(S31modelexch, "S31modelexch");

					},
					getActualOffset: function(firstDayOffset,currentDay){
						var constantOffset=7;
						if(firstDayOffset>currentDay)
						{
							return currentDay+constantOffset-firstDayOffset;
						}
						else
						{
							return currentDay-firstDayOffset;
						}
					},

					/*getDateStr : function(date) {
						return "" + date.getFullYear() + ("" + (date.getMonth() + 101)).substring(1)
								+ ("" + (date.getDate() + 100)).substring(1);
					},*/ //Repeated function
 
					parseDateYYYYMMdd : function(dateString) {
						var dateParse = sap.ui.core.format.DateFormat.getDateInstance({
							pattern : "YYYYMMdd"
						});
						return dateParse.parse(dateString);
					},
					parseDateddMMYYYY : function(dateString) {
						var dateParse = sap.ui.core.format.DateFormat.getDateInstance({
							pattern : "dd-MM-YYYY"
						});
						return dateParse.parse(dateString);
					},
					formatDateYYYYMMdd : function(oDate) {
						if (typeof oDate === "string") {
							oDate = new Date(oDate);
						}

						var dateParse = sap.ui.core.format.DateFormat.getDateInstance({
							pattern : "YYYYMMdd"
						});
						return dateParse.format(oDate);
					},

					onAfterRendering : function() {
						var self = this;
						/*setTimeout(function() {
							self.scrollerResize();
						}, 200);*/
					},
					/*getDateStr : function(date) {
						return "" + date.getFullYear()
								+ ("" + (date.getMonth() + 101)).substring(1)
								+ ("" + (date.getDate() + 100)).substring(1);
					},*/ //Repeated function

					checkCanLeave : function(callback, prevent) {
						var allSuggestions = true;
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						var days = oModel.getData().days;
						//Check whether anything is checked or not 
						var oTableRef = this.byId("ENTRY_LIST_CONTENTS");
						var selectedItems = [];
						selectedItems = oTableRef.getSelectedItems();
						//if (oModel.getData().showSubmit && !allSuggestions) {
						//Note 1994402: comment forre moving warning message
						/*if(selectedItems.length != 0){
							// if some selections is enabled we need to warn the user that there
							// are unsaved changes							
							
							var oSettings = {
									question : this.oBundle.getText('CONFIRM_LEAVE_PAGE'),
									additionalInformation : [],
									showNote : false,
									title : this.oConfiguration.getText("UNSAVED_CHANGES"),
									confirmButtonLabel : this.oBundle.getText("OK")
								};

								var _this = this;
								sap.ca.ui.dialog.factory.confirm(oSettings, function(response) {
									if (response.isConfirmed == true) {
										
										_this.setBtnText("deleteBtn", _this.oApplicationFacade.getResourceBundle().getText("DELETE"));
										
										//_this._submit();
										sap.ui.getCore().lock();
										callback();
										setTimeout(function() {
											sap.ui.getCore().unlock();
										}, 500);
									}
									else {
										sap.ui.getCore().lock();
										prevent();
										setTimeout(function() {
											sap.ui.getCore().unlock();
										}, 500);
									} 
									
								}); 
							
							
						} else {
							sap.ui.getCore().lock();
							callback();
							setTimeout(function() {
								sap.ui.getCore().unlock();
							}, 500);
						}*/
						sap.ui.getCore().lock();
						callback();
						setTimeout(function() {
							sap.ui.getCore().unlock();
						}, 500);
					},

					/*getDateStr : function(date1) {
						return "" + date1.getFullYear() + ("" + (date1.getMonth() + 101)).substring(1)
								+ ("" + (date1.getDate() + 100)).substring(1);
					},*/ ////Repeated function

					getPostData : function(day, entry) {
						var post = {};

						post.day = day;
						post.entry = entry;

						return post;

					},
					
					//Calculation for Release Entries
					releaseEntriesSummary : function(bUpdatePageData){
						
						var oTableRef = this.byId("ENTRY_LIST_CONTENTS");
						var selectedItems = [];
						selectedItems = oTableRef.getSelectedItems();
						// Deleted Hours Summary
						var deletedHours = 0;
						var deletedMinutes = 0;
						var deletedTime = 0;
						//var numberOfItemsGettingReleased;
						var numberOfItemsSelectedForSubmittion;//NOTE added count for submitting drafts
						var dayIndex;
						var entryIndex;
						var entry;
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						var oPageData = oModel.getData();
						var releaseFutureDates = oModel.getProperty("/releaseFuture");//NOTE future dates
						var cur_date;
						var sel_date;
						//numberOfItemsGettingReleased = selectedItems.length;
						numberOfItemsSelectedForSubmittion = 0;
						for ( var i = 0; i < selectedItems.length; i++) {
							dayIndex = selectedItems[i].data().day;
							entryIndex = selectedItems[i].data().entry;
							entry = oPageData.days[dayIndex].entries[entryIndex];
							sel_date = oPageData.days[dayIndex].date;
							cur_date=new Date();
							// when new entry line has been selected
							if(!entry){
								continue;
							}
							//[i].entries[j].status == "Draft saved"
							//updating the pagedata with Boolean Release Allowed as true 
							if(bUpdatePageData){
								this.updatePageData(false, dayIndex, entry,true);	
							}
							if(!releaseFutureDates && (sel_date>cur_date)){
								//Do nothing if the dates are in the future
							}
							else if(entry.statusId == 'MSAVE'){
							jQuery.sap.log.info("Hours : " + entry.hours);
							deletedHours += entry.hours;
							deletedMinutes += entry.minutes;
							deletedTime += entry.time;
							deletedTime = parseFloat(deletedTime.toFixed(2));
							jQuery.sap.log.info("Minutes : " + entry.minutes);
							jQuery.sap.log.info("Decimal Time : " + entry.time);
							numberOfItemsSelectedForSubmittion++;//count for submitted entries
							}
							else if(entry.statusId == "REJECTED"){
								deletedHours += entry.hours;
								deletedMinutes += entry.minutes;
								deletedTime += entry.time;
								deletedTime = parseFloat(deletedTime.toFixed(2));
								numberOfItemsSelectedForSubmittion++;//count for submitted entries
							}
							/*else{
								numberOfItemsGettingReleased--;
							}*/
							if (deletedMinutes > 59) {
								deletedMinutes -= 60;
								deletedHours++;
							}
						}
						var releaseData = [];
						if(this.isClockEntry())
						{
							deletedTime = deletedHours;
							deletedTime+=(deletedMinutes/60);//Note: display total decimal time
							deletedTime = parseFloat(deletedTime.toFixed(2));
						}
						
						releaseData.push(numberOfItemsSelectedForSubmittion);
						releaseData.push(deletedHours);
						releaseData.push(deletedMinutes);
						releaseData.push(deletedTime);//Note: display total decimal time
						return releaseData;

						/**
					     * @ControllerHook Extend behavior of Release Entries Summary
					     * This hook method can be used to add UI or business logic 
					     * It is called when the ReleaseEntriesSummary method executes
					     * @callback hcm.emp.mytimesheet.view.S3~extHookReleaseEntriesSummary
					     */
							if(this.extHookReleaseEntriesSummary) {
								this.extHookReleaseEntriesSummary();
					  	};
					},

					onSubmit : function() {
						
						var releaseData = [];
						var oSettings = null;
						releaseData = this.releaseEntriesSummary(true);
						
						/*Note:display total decimal time*/
                        if(!this.clockEntry)
                        {
                        	var txt_tot_duration = this.oBundle.getText('TOTAL_DURATION');//NOTE CODE ADDED TO COMPENSATE FOR MISSING TEXT IN i18 file...Replace this as soon as the translations have come
                            if(txt_tot_duration.indexOf('_')!=(-1)){
                            	txt_tot_duration = "Total Duration";
                            }
                        	oSettings = {
                               question : this.oBundle.getText('SUBMISSION_CONFIRMATION_SUMMARY'),
                               //additionalInformation : [],
                               additionalInformation : [
                                                                               {
                                                                                      label : this.oBundle.getText('DELETE_CONFIRMATION_SUMMARY_ENTRIES'),
                                                                                      text : releaseData[0].toString()
                                                                               },
                                                                               {
                                                                                      label : txt_tot_duration ,
                                                                                      text : sap.ca.ui.model.format.NumberFormat.getInstance({style:'standard'}).format(releaseData[3].toString())//Note: dot-comma issue
                                                                               }],
                               showNote : false,
                               title : this.oConfiguration.getText("SUBMISSION_CONFIRMATION"),
                               confirmButtonLabel : this.oBundle.getText("OK")
                        };
                        }
                        else
                        {
                        oSettings = {
                               question : this.oBundle.getText('SUBMISSION_CONFIRMATION_SUMMARY'),
                               //additionalInformation : [],
                               additionalInformation : [
                                                                               {
                                                                                      label : this.oBundle.getText('DELETE_CONFIRMATION_SUMMARY_ENTRIES'),
                                                                                      text : releaseData[0].toString()
                                                                               },
                                                                               {
                                                                                      label : this.oBundle.getText('DELETE_CONFIRMATION_SUMMARY_HOURS'),
                                                                                      text : this.oBundle.getText('FULL_CONCATENATE_HOURSMIN',[releaseData[1],releaseData[2]])
                                                                               }],
                               showNote : false,
                               title : this.oConfiguration.getText("SUBMISSION_CONFIRMATION"),
                               confirmButtonLabel : this.oBundle.getText("OK")
                        };
                        }
                        /*Note: End display total decimal time*/


						var _this = this;
						sap.ca.ui.dialog.factory.confirm(oSettings, function(response) {
							if (response.isConfirmed == true) {
								_this._submit();
							}
						});

						/**
					     * @ControllerHook Extend behavior of On Submit
					     * This hook method can be used to add UI or business logic 
					     * It is called when the OnSubmit method executes
					     * @callback hcm.emp.mytimesheet.view.S3~extHookOnSubmit
					     */
							if(this.extHookOnSubmit) {
								this.extHookOnSubmit();
					  	};
					},

					_submit : function(numberOfEntries, deletedHours, deletedMinutes) {

						// var eventSubmit = true ;
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						var newDays = oModel.getData().days;
						this.errors = null;

						var createdDays = [];
						var updatedDays = [];
						var deletedDays = [];
						var draftedDays = [];

						for ( var i = 0; i < newDays.length; i++) {

							for ( var j = 0; j < newDays[i].entries.length; j++) {

								if ((newDays[i].entries[j].counter === null || newDays[i].entries[j].counter === "")
										&& !(newDays[i].entries[j].deleted) && newDays[i].entries[j].mainItem !== null) {

									createdDays.push(this.getPostData(newDays[i].dateStr, newDays[i].entries[j]));
								}

								if (newDays[i].entries[j].deleted
										&& (newDays[i].entries[j].counter !== "" || newDays[i].entries[j].counter === null)) {
									deletedDays.push(this.getPostData(newDays[i].dateStr, newDays[i].entries[j]));
								} else {
									if (this.oldDays[i]) {
										for ( var k = 0; k < this.oldDays[i].entries.length; k++) {
											if (newDays[i].entries[j].counter === this.oldDays[i].entries[k].counter
													&& newDays[i].entries[j].counter !== "") {

												var item1 = newDays[i].entries[j];
												var item2 = this.oldDays[i].entries[k];

												if (item1.time !== item2.time || item1.notes !== item2.notes
														|| item1.mainItem !== item2.mainItem || item1.subItems !== item2.subItems
														|| item1.hours !== item2.hours || item1.minutes !== item2.minutes
														|| item1.startTime !== item2.startTime || item1.endTime !== item2.endTime) {

													if (!newDays[i].entries[j].deleted) {

														updatedDays.push(this.getPostData(newDays[i].dateStr, newDays[i].entries[j]));

													}
												}
											}
										}
									}
								}
								if (newDays[i].entries[j].statusId == "MSAVE" && newDays[i].entries[j].bToBeReleased){
									draftedDays.push(this.getPostData(newDays[i].dateStr,

									newDays[i].entries[j]));

									// add the drafted entries to updated entries

									updatedDays.push(this.getPostData(newDays[i].dateStr,

									newDays[i].entries[j]));

									}


							}
						}

						var self = this;
						var confirmationDialog = null;
								

						confirmationDialog = new sap.m.Dialog({

							title : this.oConfiguration.getText("DELETE_CONFIRMATION"),
							leftButton : new sap.m.Button({
								text : this.oBundle.getText("OK"),
								press : function() {

									confirmationDialog.close();

								}
							}),
							rightButton : new sap.m.Button({
								text : this.oConfiguration.getText("CANCEL"),
								press : function() {
									//eventSubmit = false;
									sap.ui.getCore().lock();
									confirmationDialog.close();
									setTimeout(function() {
										sap.ui.getCore().unlock();
									}, 500);
								}
							}),
						});

						// lock UI until submit is done to prevent double click
						sap.ui.getCore().lock();

						jQuery.sap.measure.start(hcm.emp.mytimesheet.utils.PerfUtils
								.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));

						var batchUpdate = [];
						var batchCreate = [];
						var batchDelete = [];

						if (createdDays.length !== 0) {

							for (i = 0; i < createdDays.length; i++) {
								createdDays[i].entry = this.replaceSpecialChar(createdDays[i].entry); 			//Note 1994402: Replacing Special Character

								batchCreate.push(self.setPostObject(createdDays[i].entry.counter, "C", createdDays[i].day,
										createdDays[i].entry.time, createdDays[i].entry.mainName, createdDays[i].entry.mainCode,
										createdDays[i].entry.notes, createdDays[i].entry.startTime, createdDays[i].entry.endTime,
										createdDays[i].entry.subItems, createdDays[i].entry.childCodes, createdDays[i].entry.childNames));

							};
						}

						if (updatedDays.length !== 0) {

							for (i = 0; i < updatedDays.length; i++) {
								updatedDays[i].entry = this.replaceSpecialChar(updatedDays[i].entry); 			//Note 1994402: Replacing Special Character

								batchUpdate.push(self.setPostObject(updatedDays[i].entry.counter, "U", updatedDays[i].day,
										updatedDays[i].entry.time, updatedDays[i].entry.mainName, updatedDays[i].entry.mainCode,
										updatedDays[i].entry.notes, updatedDays[i].entry.startTime, updatedDays[i].entry.endTime,
										updatedDays[i].entry.subItems, updatedDays[i].entry.childCodes, updatedDays[i].entry.childNames));
							}
						}

						if (deletedDays.length !== 0) {

							for (i = 0; i < deletedDays.length; i++) {
								deletedDays[i].entry = this.replaceSpecialChar(deletedDays[i].entry); 			//Note 1994402: Replacing Special Character

								batchDelete.push(self.setPostObject(deletedDays[i].entry.counter, "D", deletedDays[i].day,
										deletedDays[i].entry.time, deletedDays[i].entry.mainName, deletedDays[i].entry.mainCode,
										deletedDays[i].entry.notes, deletedDays[i].entry.startTime, deletedDays[i].entry.endTime,
										deletedDays[i].entry.subItems, deletedDays[i].entry.childCodes, deletedDays[i].entry.childNames));

							}
						}

						if (batchCreate.length === 0 && batchUpdate.length === 0 && batchDelete.length === 0) {
							// if there is nothing to submit, just act like a cancel
							sap.ui.getCore().lock();
							confirmationDialog.close();
							setTimeout(function() {
								sap.ui.getCore().unlock();
							}, 500);
						} else {
							// only submit if there is something to submit, otherwise SAP UI5 does not give a response
							self.oService.submitTimeEntry(self,batchCreate, batchUpdate, batchDelete, function() {
								sap.ui.getCore().unlock();
								jQuery.sap.measure.end(hcm.emp.mytimesheet.utils.PerfUtils
										.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));
								sap.m.MessageToast.show(self.oConfiguration.getText("SUBMIT_SUCCESS"));
								sap.ui.getCore().lock();
								setTimeout(function() {
									// success refresh week entry page
									if (!self.errors) {
										self.updateData();
									}
									sap.ui.getCore().unlock();
								}, 500);
							}, function(errs, response) {
								sap.ui.getCore().unlock();
								jQuery.sap.measure.end(hcm.emp.mytimesheet.utils.PerfUtils
										.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_SUBMIT));
								// some error messages to display
								self.errors = errs;
								self.displayInlineMessages(errs, response);
								self.updateData();
							});
						}

						// confirmationDialog.addContent(oDialogForm);
						var list_items = [];
						var list_item_entry = null;
						var days = oModel.getData().days;
						for (i = 0; i < days.length; i++) {

							for ( var j = 0; j < days[i].entries.length; j++) {

								list_item_entry = days[i].entries[j];
								// skip if deleted
								if (!list_item_entry.deleted) {

									if (list_item_entry.subItems === null) {
										list_item_entry.subItems = "";
									}
									// add to list if there were no such entry and it is not "New
									// Entry"
									// and list_item does not have this element yet
									if (list_item_entry.mainItem) {
										var alreadyThere = false;
										var index = -1;
										for ( var k = 0; k < list_items.length; k++) {
											if (list_items[k].subItems === null) {
												list_items[k].subItems = "";
											}
											if (list_items[k].mainItem === list_item_entry.mainItem) {
												alreadyThere = true;
												index = k;
											}
										}
										if (!alreadyThere) {
											list_items.push({
												mainItem : list_item_entry.mainItem,
												subItems : list_item_entry.subItems,
												time : list_item_entry.time,
												hours : parseFloat(list_item_entry.hours),
												minutes : parseFloat(list_item_entry.minutes)
											});
										} else {
											// add time
											list_items[index].time += list_item_entry.time;
											list_items[index].hours += parseFloat(list_item_entry.hours);
											list_items[index].minutes += parseFloat(list_item_entry.minutes);
											if (list_items[index].minutes > 59) {
												list_items[index].minutes -= 60;
												list_items[index].hours++;
											}
										}
									}
								}
							}
						}
						var targetHours = 0;
						for ( var day = 0; day < days.length; day++) {
							targetHours = targetHours + days[day].targetHours;
						}
					},

					setPostObject : function(Counter, TimeEntryOperation, WORKDATE, CATSAMOUNT, Name, Code, notes, startTime,
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
						
						// always setting to X for second screen
						if(TimeEntryOperation !="D")
						timeEntryUpdated.TimeEntryRelease = "X";

						if(this.checkFieldName(Name) === true){					//Note 1959135: Added additional check
							timeEntryUpdated.TimeEntryDataFields[Name] = Code;
						}
						
						if (subItems && subItems !== "") {
							for ( var i = 0; i < childNames.length; i++) {
								if(this.checkFieldName(childNames[i]) === true){			//Note 1959135: Added additional check
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

					//Note 1994402: Replaceing special charater '/' with '-'
					replaceAllOccurances : function(iString){
						if(typeof iString=="undefined"){
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
						if(typeof entry.mainName != "undefined"){
							entry.mainName = this.replaceAllOccurances(entry.mainName);
						}
						if(typeof entry.subItems != "undefined"){
							entry.subItems = this.replaceAllOccurances(entry.subItems);
						}
						if(typeof entry.childNames != "undefined"){
							for(var i = 0; i < entry.childNames.length ; i++){
								entry.childNames[i] = this.replaceAllOccurances(entry.childNames[i]);
							}
						}
						
						return entry;
					},
					
					// function called on browser event click of an entry in the
					// list
					onItemSelectGotoEdit : function(oEvent) {
						var item = oEvent.getSource();
						var tableref = item.getParent();
							if (item instanceof sap.m.ColumnListItem) {
								var customData = item.getCustomData();
								var dayIndex = 0, entryIndex = 0;		
								for(var i = 0; i < customData.length; i++) {
									if(customData[i].getKey()==="day") {
										dayIndex = customData[i].getValue();
									} else if(customData[i].getKey()==="entry") {
										entryIndex = customData[i].getValue();
									}
								}
								var oModel = this.oApplication.getModel("TSM_WEEKLY");
								
								this.oApplication.getModel('S31modelexch').setProperty('/recentlyUsedSelected',false);
								this.oApplication.getModel('S31modelexch').setProperty('/manualEntrySelected',true);
								
								
								var oPageData = oModel.getData();

								var oViewData = {
							       entry: oPageData.days[dayIndex].entries[entryIndex],
							       pageData: oPageData,
							       dayIndex: dayIndex,
							       entryIndex: entryIndex
							   };
								
								this.oApplication.getModel('S31modelexch').setProperty('/editeddata',oViewData);
								this.oApplication.getModel('S31modelexch').setProperty('/editentryview',true);
								this.oApplication.getModel('S31modelexch').setProperty('/viewDataS3',oViewData);
								var selctedDate = (new Date(item.data().selectedDate.substr(0,4),
										parseInt(item.data().selectedDate.substr(4,2),10) - 1,
										item.data().selectedDate.substr(6,2)) + "").substr(0,15);
																
								var dateParse = sap.ui.core.format.DateFormat.getDateInstance({
									pattern : "YYYYMMdd"
								});
								var selctedDate = dateParse.parse(item.data().selectedDate);
																
								this.oApplication.getModel('S31modelexch').setProperty('/selectedDates', [selctedDate]);
															
								this.oRouter.navTo("S31",{},true);
							}
						},

					onItemSelect : function(oEvent) {
					  this.selectDateOnAllCheckBoxSelection(oEvent.getSource(), oEvent.mParameters.listItem);
						this.manageChecklist(oEvent.getSource().getItems(), "", "", "");
						
						
						if (oEvent.getSource().getSelectedItems().length === 0) {
							this.setBtnText("deleteBtn", this.oApplicationFacade.getResourceBundle().getText("DELETE"));
							this.setBtnEnabled("deleteBtn", false);
							//Submit Button text manipulate based on selection
							if(this.oApplication.getModel("timesheet_initialInfo").getData().releaseAllowed){
								this.setBtnText("SUBMIT_BTN", this.oApplicationFacade.getResourceBundle().getText("SUBMIT"));
								this.setBtnEnabled("SUBMIT_BTN", false);
							}
						} else {
							//Release Summmary Information call and text update
							if(this.oApplication.getModel("timesheet_initialInfo").getData().releaseAllowed){
								var releaseSummaryInfo = this.releaseEntriesSummary(false);
								
								if(releaseSummaryInfo[0] == 0 ){
									this.setBtnText("SUBMIT_BTN", this.oApplicationFacade.getResourceBundle().getText("SUBMIT"));
									this.setBtnEnabled("SUBMIT_BTN", false);	
								}else{
									this.setBtnText("SUBMIT_BTN", this.oApplicationFacade.getResourceBundle().getText("SUBMIT")+ '('
											+ releaseSummaryInfo[0] + ')');
									this.setBtnEnabled("SUBMIT_BTN", true);
								}
								
							}
							
							
							var selList = oEvent.getSource().getSelectedItems();
							var actualCount = 0;
							for(var i=0;i<selList.length;i++){
								if(selList[i].mAggregations.cells[0].mProperties.text != this.oApplicationFacade.getResourceBundle().getText("ADD_NEW")){
								actualCount++;	
							  }
							}							
							
							
							if(actualCount == 0){
							this.setBtnText("deleteBtn", this.oApplicationFacade.getResourceBundle().getText("DELETE"));
							this.setBtnEnabled("deleteBtn", false);
							}else{
								this.setBtnText("deleteBtn", this.oApplicationFacade.getResourceBundle().getText("DELETE") + '('
										+ actualCount + ')');
								this.setBtnEnabled("deleteBtn", true);
							}
						}
						/**
					     * @ControllerHook Extend behavior of On Item Select
					     * This hook method can be used to add UI or business logic 
					     * It is called when the OnItemSelect method executes
					     * @callback hcm.emp.mytimesheet.view.S3~extHookOnItemSelect
					     */
							if(this.extHookOnItemSelect) {
								this.extHookOnItemSelect();
					  	};

					},

						onSelect : function(oEvent) {
						var selectedDate = new Date(oEvent.getParameter("date"));
						var didSelect = oEvent.getParameter("didSelect");
						this.selectDate(selectedDate, didSelect);
					},

					selectDate : function(selectedDate, fromClick) {
						var dateStr = null;
						if (selectedDate instanceof Date) {
							dateStr = this.formatDateYYYYMMdd(selectedDate);
						} else {
							dateStr = selectedDate;
							selectedDate = new Date(parseInt(dateStr.substring(0, 4), 10), parseInt(dateStr.substring(4, 6), 10) - 1,
									parseInt(dateStr.substring(6, 8), 10));
						}
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						oModel.setProperty("/selected", dateStr);
						var self = this;
						var valuesPresent = false;
						var indexValue;
						if (this.entryListContents) {
							var items = this.entryListContents.getItems();
							var dateArray = [selectedDate];
							valuesPresent = this.manageSelection(items, selectedDate, fromClick);
							
							var selList = this.byId("ENTRY_LIST_CONTENTS").getSelectedItems();
							var actualCount = 0;
							for(var i=0;i<selList.length;i++){
								if(selList[i].mAggregations.cells[0].mProperties.text != this.oApplicationFacade.getResourceBundle().getText("ADD_NEW")){
								actualCount++;	
							  }
							}
							
							if(actualCount == 0 ){
								this.setBtnText("deleteBtn", this.oApplicationFacade.getResourceBundle().getText("DELETE"));
								this.setBtnEnabled("deleteBtn", false);	
							}else{
								this.setBtnText("deleteBtn", this.oApplicationFacade.getResourceBundle().getText("DELETE") + '('
										+ actualCount + ')');
								this.setBtnEnabled("deleteBtn", true);
							}
							
							//Release Summmary Information call and text update
							if(this.oApplication.getModel("timesheet_initialInfo").getData().releaseAllowed){
								var releaseSummaryInfo = this.releaseEntriesSummary(false);
								if(releaseSummaryInfo[0] == 0 ){
									this.setBtnText("SUBMIT_BTN", this.oApplicationFacade.getResourceBundle().getText("SUBMIT"));
									this.setBtnEnabled("SUBMIT_BTN", false);	
								}else{
									this.setBtnText("SUBMIT_BTN", this.oApplicationFacade.getResourceBundle().getText("SUBMIT")+ '('
											+ releaseSummaryInfo[0] + ')');
									this.setBtnEnabled("SUBMIT_BTN", true);
								}
							}
							if (valuesPresent) {
								return;
							}
							//deleteButton Text
							
							
							// the date is not in the list, so this must be a non-working day
							if (this.oConfiguration.getAllowNonWorkingDays()) {
								var oPageData = oModel.getData();
								var oDayData = {
									date : selectedDate,
									dateStr : dateStr,
									dateFormatted : this.convertDateFormat(selectedDate),
									targetHours : 0,
									entries : []
								};
								var newEntry = new hcm.emp.mytimesheet.model.TimeEntry(0, this.oBundle.getText("ADD_NEW"));
								oDayData.entries.push(newEntry);
								oPageData.days.push(oDayData);
								// order list of days by date
								function compareDays(a, b) {
									if (parseInt(a.dateStr) > parseInt(b.dateStr)) {
										return 1;
									} else {
										return -1;
									}
								}
								oPageData.days.sort(compareDays);
								this.loadListWithoModel();
								for (i = 0; i < items.length; i++) {
									if (items[i] instanceof sap.m.GroupHeaderListItem
											&& items[i].getTitle() === this.convertDateFormat(selectedDate)) {
										items[i].setSelected(true);
										setTimeout(function() {
											self.jumpToIndex(i);
										}, 100);
										return;
									}
								}
							}
						}
					},

					// this method checks to see if there is a new entry for this day displayed. If not, it will add it as
					// overtime
					checkOvertime : function(date) {
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						var days = oModel.getData().days;
						for ( var i = 0; i < days.length; i++) {
							if (days[i].date.getTime() === date.getTime()) {
								// we have found the right day
								if (days[i].entries.length > 0 && days[i].entries[days[i].entries.length - 1].newEntry) {
									// the last entry is already a new entry, so no need to add anything
									return false;
								}
								// add a new entry
								var newEntry = new hcm.emp.mytimesheet.model.TimeEntry(0, this.oBundle.getText("ADD_NEW"));
								if (this.oConfiguration.getClockEntry()) {
									newEntry.setStartEndTimes(date, days[i].entries, 0, days[i].workingDay);
								}
								days[i].entries.push(newEntry);
								this.loadListWithoModel();
								return true;
							}
						}
						return false;
					},

					// update list Data with in-line messages
					displayInlineMessages : function(errors, responseData) {
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						var days = oModel.getData().days;
						for ( var i = 0; i < days.length; i++) {
							for ( var j = 0; j < days[i].entries.length; j++) {
								var bFoundError = false;
								for ( var k = 0; k < errors.length; k++) {
									if (days[i].entries[j].counter === errors[k].counter && days[i].dateStr === errors[k].workdate
											&& days[i].entries[j].time === parseFloat(errors[k].time)) {
										days[i].entries[j].showError = true;
										days[i].entries[j].error = errors[k].message;
										bFoundError = true;
										break;
									}
								}
								if (!bFoundError) {
									for (k = 0; k < responseData.length; k++) {
										if (days[i].entries[j].counter === ""
												&& days[i].dateStr === responseData[k].TimeEntryDataFields.WORKDATE
												&& days[i].entries[j].time === parseFloat(responseData[k].TimeEntryDataFields.CATSAMOUNT)) {
											// there previously was no counter, but now this has been accepted, add one
											days[i].entries[j].counter = responseData[k].Counter;
										}
									}
								}
							}
						}
						this.oldDays = jQuery.extend(true, {}, days);
						oModel.setProperty("/showSubmit", false);
						oModel.setProperty("/days", days);
						this.loadListWithoModel();
					},

					// update calendar Data
					updateData : function() {
						// clean calendar
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						oModel.setProperty("/red", "");
						oModel.setProperty("/green", "");
						oModel.setProperty("/grey", "");
						oModel.setProperty("/yellow", "");
						oModel.setProperty("/rejected", "");

						var weeklyCalendar = this.byId("WEEKLY_CALENDAR");
						weeklyCalendar.removeTypesOfAllDates();
						weeklyCalendar.unselectAllDates();
						oModel.setProperty("/activities", null);
						oModel.setProperty("/workingDayList", null);

						var self = this;

						// update calendar
						this.oService.getWorkDays(this,oModel.getData().start, oModel.getData().end, function(data) {
							self.getTimeSheetCalendar(data);
							if (oModel.getData().activities) {
								self.setWeeklyData(oModel.getData().activities);
							}
							self.monitorPageRefreshEnded();
						});

						// update list
						this.oService.getWorkListCollection(this,oModel.getData().start, oModel.getData().end, function(data) {
							oModel.setProperty("/activities", data);
							if (oModel.getData().workingDayList) {
								self.setWeeklyData(data);
							}
							self.monitorPageRefreshEnded();
						});
						//Reseting Delete button on Submit and delete
						self.setBtnText("deleteBtn", self.oApplicationFacade.getResourceBundle().getText("DELETE"));
						self.setBtnEnabled("deleteBtn", false);
						
						//Resetting the Submit Button
						if(self.oApplication.getModel("timesheet_initialInfo").getData().releaseAllowed){
							self.setBtnText("SUBMIT_BTN", this.oApplicationFacade.getResourceBundle().getText("SUBMIT"));
							self.setBtnEnabled("SUBMIT_BTN", false);
						}
						/**
					     * @ControllerHook Extend behavior of Update Data
					     * This hook method can be used to add UI or business logic 
					     * It is called when the UpdateData method executes
					     * @callback hcm.emp.mytimesheet.view.S3~extHookUpdateData
					     */
							if(this.extHookUpdateData) {
								this.extHookUpdateData();
					  	};
						
					},

					monitorPageRefreshEnded : function() {
						var ownPointer = this;
						/*if (typeof self !== 'undefined') {
							ownPointer = self;
						} else {
							ownPointer = this;
						}*/
						if ("pageRefreshPartOneEnded" in ownPointer) {
							jQuery.sap.measure.end(hcm.emp.mytimesheet.utils.PerfUtils
									.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.WEEK_ENTRY_LOAD));
							delete ownPointer.pageRefreshPartOneEnded;
						} else {
							ownPointer.pageRefreshPartOneEnded = true;
						}
					},

					getTimeSheetCalendar : function(data) {

						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						var now = new Date(), grey = [], red = [], green = [], yellow = [], rejected = [], currentSelectedDay = oModel
								.getData().selected, firstWorkingDay = null, missingdays = [], hasSelectedDay = false;

						var workingDayList = [];
						oModel.setProperty("/workingDayList", workingDayList);

						// get first day of the week
						var firstDayOff = -1;
						if (data.length > 0) {
							var firstDay = data[0].FirstDayOfWeek;
							if (firstDay === null) {
								firstDayOff = -1;
							} else if (firstDay === "MONDAY") {
								firstDayOff = 1;
							} else if (firstDay === "TUESDAY") {
								firstDayOff = 2;
							} else if (firstDay === "WEDNESDAY") {
								firstDayOff = 3;
							} else if (firstDay === "THURSDAY") {
								firstDayOff = 4;
							} else if (firstDay === "FRIDAY") {
								firstDayOff = 5;
							} else if (firstDay === "SATURDAY") {
								firstDayOff = 6;
							} else if (firstDay === "SUNDAY") {
								firstDayOff = 0;
							}
						}

						for ( var i = 0; i < data.length; i++) {
							var dateToWork = data[i].Date;
							var workingDay = data[i].WorkingDay === "TRUE";
							var date = new Date(parseInt(dateToWork.substring(0, 4), 10),
									parseInt(dateToWork.substring(4, 6), 10) - 1, parseInt(dateToWork.substring(6, 8), 10));
							workingDayList.push({
								date : dateToWork,
								workingDay : workingDay,
								targetHours : parseFloat(data[i].TargetHours.trim()),
								startTime : data[i].StartTime,
								endTime : data[i].EndTime,
								lunchStart : data[i].BreakStart,
								lunchEnd : data[i].BreakEnd
							});

							var status = data[i].Status;

							if (!workingDay) {
								// add to holidays to grey out
								grey.push(date);
							} else {
								if (!firstWorkingDay) {
									firstWorkingDay = dateToWork;
								}
								if (!hasSelectedDay && currentSelectedDay === dateToWork) {
									hasSelectedDay = true;
								}
								if (status === "YACTION") {
									// add missing days as red
									missingdays.push(data[i].Date);
									// fill red only if earlier then today
									if (now.getTime() > date.getTime()) {
										red.push(date);
									}
								} else if (status === "MACTION") {
									// add missing days as green with yellow
									yellow.push(date);
								} else if (status === "REJECTED") {
									// add rejected days
									rejected.push(date);
								} else if (status === "DONE") {
									// add filled days as green
									green.push(date);
								}
							}

						}


						var weeklyCal = this.byId("WEEKLY_CALENDAR");
						// set in calendar only if get meaningful value from service
						if (firstDayOff > 0) {
							weeklyCal.setFirstDayOffset(firstDayOff);
						}

						weeklyCal.toggleDatesType(yellow, sap.me.CalendarEventType.Type04, true);
						weeklyCal.toggleDatesType(green, sap.me.CalendarEventType.Type01, true);
						weeklyCal.toggleDatesType(grey, sap.me.CalendarEventType.Type00, true);
						weeklyCal.toggleDatesType(red, sap.me.CalendarEventType.Type07, true);
						weeklyCal.toggleDatesType(rejected, sap.me.CalendarEventType.Type06, true);

						// TODO
						// set array of legend to global model
						var aLegend = {
							'yellow' : yellow,
							'green' : green,
							'grey' : grey,
							'red' : red,
							'rejected' : rejected
						};
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						oModel.setProperty("/legendforS31", aLegend);
						/**
					     * @ControllerHook Extend behavior of  get TimeSheet Calendar
					     * This hook method can be used to add UI or business logic 
					     * It is called when the getTimeSheetCalendar method executes
					     * @callback hcm.emp.mytimesheet.view.S3~extHookGetTimeSheetCalendar
					     */
							if(this.extHookGetTimeSheetCalendar) {
								this.extHookGetTimeSheetCalendar();
					  	};

					},

					// new mothod add ofr create scenario
					onAddNewEntry : function(oEvent) {

						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						oModel.setProperty('/recentlyUsedSelected', true);
						oModel.setProperty('/manualEntrySelected', false);
						this.oApplication.getModel('S31modelexch').setProperty('/recentlyUsedSelected', true);
						this.oApplication.getModel('S31modelexch').setProperty('/manualEntrySelected', false);

						var oPageData = oModel.getData();
						var entry = new hcm.emp.mytimesheet.model.TimeEntry(0, this.oBundle.getText("ADD_NEW"));
						if (this.byId("WEEKLY_CALENDAR").getSelectedDates().length > 0) {
							entry.selectedDate = this.byId("WEEKLY_CALENDAR").getSelectedDates()[0];
						}

						var oViewData = {
							entry : entry,
							dayIndex : -1,
							entryIndex : -1,
							pageData : oPageData
						};

						this.oApplication.getModel('S31modelexch').setProperty('/recentlyUsedSelected', true);
						this.oApplication.getModel('S31modelexch').setProperty('/manualEntrySelected', false);
						this.oApplication.getModel('S31modelexch').setProperty('/viewDataS3', oViewData);
																							
						var selectedDatesFromCalendar = this.byId('WEEKLY_CALENDAR').getSelectedDates();
						
						if(this.byId('ENTRY_LIST_CONTENTS').getSelectedItems()){
							for(var i=0; i < this.byId('ENTRY_LIST_CONTENTS').getSelectedItems().length ;i++){
							var selectedItem = 	this.byId('ENTRY_LIST_CONTENTS').getSelectedItems()[i];
							var refToNewEntryType = selectedItem.getType();
								if(refToNewEntryType == 'Inactive'){
									var datefromNewEntry = selectedItem.data().selectedDate;
									var dateParse = sap.ui.core.format.DateFormat.getDateInstance({
										pattern : "YYYYMMdd"
									});
									var selctedDate = dateParse.parse(datefromNewEntry);
									if(selectedDatesFromCalendar.indexOf(selctedDate) == -1){
										selectedDatesFromCalendar.push(selctedDate);
									}
								}
							}
						}
						
						this.oApplication.getModel('S31modelexch').setProperty('/selectedDates',selectedDatesFromCalendar);
														
						this.oRouter.navTo("S31",{},true);

					},

					createPageforS31 : function(pageId) {
						var self = this;
						var s31Controller = sap.ui.controller('hcm.emp.mytimesheet.view.S31');
						var navContainerRef = this.navContainerRef;
						var createPage = new sap.m.Page(pageId, {
							// showNavButton:true,
							showHeader : false,
							enablScrolling : false,
							navButtonTap : function() {
								navContainerRef.back();
								navContainerRef.removePage(navContainerRef.getPages()[1]);
							},

							footer : {
								contentRight : [new sap.m.Button({
									text : self.oBundle.getText('SUBMIT'),
									press : [s31Controller.updatePageData, s31Controller]
								}), new sap.m.Button({
									text : this.oBundle.getText('CANCEL'),
									press : function() {
										navContainerRef.back();
										navContainerRef.removePage(navContainerRef.getPages()[1]);
									}
								})]
							}
						});
						return createPage;

					},

					onCalendarWeekChange : function(oEv) {
						
											
						var self = this, oDate = new Date(oEv.getParameter("currentDate"));
						var oModel = this.oApplication.getModel("TSM_WEEKLY");

						this.checkCanLeave(function() {
							oModel.setProperty("/start", self.formatDateYYYYMMdd(oDate));
							oDate.setDate(oDate.getDate() + 6);
							oModel.setProperty("/end", self.formatDateYYYYMMdd(oDate));
							self.lastSelected = oModel.getData().selected;
							self.lastYear = oModel.getData().year;
							self.lastWeek = oModel.getData().week;
							self.lastStartDate = oModel.getData().start;
							self.lastEndDate = oModel.getData().end;
							oModel.setProperty("/showSubmit", false);// when we change week,
							// we need to reset the
							// submit button
							self.updateData();
						}, function() {

							var reverseStart = oModel.getData().start;
							var date = new Date(parseInt(reverseStart.substring(0, 4), 10),
									parseInt(reverseStart.substring(4, 6), 10) - 1, parseInt(reverseStart.substring(6, 8), 10));
							self.byId("WEEKLY_CALENDAR").setCurrentDate(date.toDateString());
							oModel.setProperty("/year", self.lastYear);
							oModel.setProperty("/week", self.lastWeek);

						});
					},

					onNavButton : function() {
						// alert("2: to be handled for wave2");
						this.oRouter.navTo("S2", {
							context : {}
						},true);

					},

					getDateStr : function(date) {
						return "" + date.getFullYear() + ("" + (date.getMonth() + 101)).substring(1)
								+ ("" + (date.getDate() + 100)).substring(1);
					},

					setWeeklyData : function(data) {
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						// initial submit button status
						oModel.setProperty("/showSubmit", false);

						var oPageData = {
							days : []
						};

						var lastRecordNumber = null;
						var lastDate = null;
						var oEntryData = {};
						var oDayData = null;
						var workingDayList = oModel.getData().workingDayList;
						for ( var i = 0; i < data.length; i++) {
							if (lastDate === null || data[i].WorkDate !== lastDate) {
								lastDate = data[i].WorkDate;
								var date = new Date(parseInt(data[i].WorkDate.substring(0, 4), 10), parseInt(data[i].WorkDate
										.substring(4, 6), 10) - 1, parseInt(data[i].WorkDate.substring(6, 8), 10));
								oDayData = {
									date : date,
									dateStr : data[i].WorkDate,
									dateFormatted : this.convertDateFormat(date),
									targetHours : this.getTargetHours(data[i].WorkDate, workingDayList),
									entries : [],
									workingDay : this.getWorkingDay(data[i].WorkDate, workingDayList)
								}; 
								oPageData.days.push(oDayData);
								lastRecordNumber = null;
							}
							if (lastRecordNumber === null || data[i].RecordNumber !== lastRecordNumber) {
								lastRecordNumber = data[i].RecordNumber;
								oEntryData = new hcm.emp.mytimesheet.model.TimeEntry(0, "", data[i].Suggested === "TRUE", true);
								// if there were suggested items enable submit button
								if (oEntryData.suggestion) {
									oModel.setProperty("/showSubmit", true);
								}
								oDayData.entries.push(oEntryData);
							}
							oEntryData.setData(data[i]);
						}

						// order list of days by date
						function compareDays(a, b) {
							if (parseInt(a.dateStr) > parseInt(b.dateStr)) {
								return 1;
							} else {
								return -1;
							}
						}
						oPageData.days.sort(compareDays);

						for (i = 0; i < workingDayList.length; i++) {
							if (workingDayList[i].workingDay) {
								var bHasEntries = false;
								var insertPosition = oPageData.days.length;
								for ( var j = 0; j < oPageData.days.length; j++) {
									if (workingDayList[i].date === oPageData.days[j].dateStr) {
										bHasEntries = true;
										break;
									}
									if (workingDayList[i].date < oPageData.days[j].dateStr) {
										insertPosition = j;
										break;
									}
								}
								if (!bHasEntries) {
									// this is a working day which is not in the list, so we
									// need to add a blank entry
									var date = new Date(parseInt(workingDayList[i].date.substring(0, 4), 10), parseInt(
											workingDayList[i].date.substring(4, 6), 10) - 1, parseInt(workingDayList[i].date.substring(6, 8),
											10));
									oDayData = {
										date : date,
										dateStr : workingDayList[i].date,
										dateFormatted : this.convertDateFormat(date),
										targetHours : this.getTargetHours(workingDayList[i].date, workingDayList),
										workingDay : workingDayList[i],
										entries : []
									};
									oPageData.days.splice(insertPosition, 0, oDayData);
								}
								// check the hours against target and insert new entry template
								// for missing hours
								for ( var day = 0; day < oPageData.days.length; day++) {
									var hours = 0;
									for ( var j = 0; j < oPageData.days[day].entries.length; j++) {
										hours += oPageData.days[day].entries[j].time;
									}
									if (hours < workingDayList[i].targetHours) {
										var missingTime = workingDayList[i].targetHours - hours;
										var newEntry = new hcm.emp.mytimesheet.model.TimeEntry(missingTime, this.oBundle.getText("ADD_NEW"));
										if (this.oConfiguration.getClockEntry()) {
											newEntry.setStartEndTimes(oDayData.date, oPageData.days[day].entries, missingTime,
													workingDayList[i]);
										}
										oPageData.days[day].entries.push(newEntry);
									}
								}

							}
						}
						// check the hours against target and insert new entry template
						// for missing hours
						var selectedDate = null;
						for ( var day = 0; day < oPageData.days.length; day++) {
							this.checkHours(oPageData, day);
							if (selectedDate == null) {
								for ( var i = 0; i < oPageData.days[day].entries.length; i++) {
									if (oPageData.days[day].entries[i].newEntry) {
										selectedDate = oPageData.days[day].date;
									}
								}
							}
						}

						this.oldDays = jQuery.extend(true, {}, oPageData.days);
						oModel.setProperty("/days", oPageData.days);

						this.loadListWithoPageData(oPageData);
						
						
					},

					checkHours : function(pageData, dayIndex) {
						// we now need to work out if we need a new entry line or not
						var totalHours = 0;
						var newEntryIndex = -1;
						for ( var i = 0; i < pageData.days[dayIndex].entries.length; i++) {
							if (pageData.days[dayIndex].entries[i].newEntry) {
								newEntryIndex = i;
							} else if (!pageData.days[dayIndex].entries[i].deleted) {
								totalHours += pageData.days[dayIndex].entries[i].time;
							}
						}
						var entriesUpdated = false;
						var missingTime = pageData.days[dayIndex].targetHours - totalHours;

						var undeletedEntries = pageData.days[dayIndex].entries.length;
						for (i = 0; i < pageData.days[dayIndex].entries.length; i++) {
							if (pageData.days[dayIndex].entries[i].deleted) {
								undeletedEntries--;
							}
						}

						// if there were no target hours and it's a working day and there is no entry, we need to add a new entry
						// template
						if (missingTime > 0 || (pageData.days[dayIndex].targetHours === 0 && undeletedEntries === 0)) {
							// new entry line is needed
							if (newEntryIndex >= 0) {
								pageData.days[dayIndex].entries[newEntryIndex].time = missingTime;
								pageData.days[dayIndex].entries[newEntryIndex].hours = Math.floor(missingTime);
								pageData.days[dayIndex].entries[newEntryIndex].minutes = Math.round((missingTime - Math
										.floor(missingTime)) * 60);
							} else {
								// there was no new entry previously, but we need one
								var newEntry = new hcm.emp.mytimesheet.model.TimeEntry(missingTime, this.oBundle.getText("ADD_NEW"));
								pageData.days[dayIndex].entries.push();
								entriesUpdated = true;
								if (this.oConfiguration.getClockEntry()) {
									newEntry.setStartEndTimes(pageData.days[dayIndex].date, pageData.days[dayIndex].entries, missingTime,
											pageData.days[dayIndex].workingDay);
								}
								pageData.days[dayIndex].entries.push(newEntry);
							}
						} else {/*
										 * // commented as new line is always needed // new entry line not needed for ( var i = 0; i <
										 * pageData.days[dayIndex].entries.length; i++) { if (pageData.days[dayIndex].entries[i].newEntry) { //
										 * if there is a new entry, remove it as we have now put the // common item there //TODO changing as
										 * new entries are required //pageData.days[dayIndex].entries.splice(i, 1);
										 * pageData.days[dayIndex].entries.push(newEntry); entriesUpdated = true; } }
										 */
						}
						return entriesUpdated;
					},

					getWorkingDay : function(date, workingDayList) {
						if (workingDayList) {
							for ( var i = 0; i < workingDayList.length; i++) {
								if (workingDayList[i].date == date) {
									return workingDayList[i];
								}
							}
						}
						return null;
					},

					getTargetHours : function(date, workingDayList) {
						var workingDay = this.getWorkingDay(date, workingDayList);
						if (workingDay) {
							return workingDay.targetHours;
						}
						return 0;
					},

					checkSubmit : function(oldDays, missingDays) {
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						if (oldDays == undefined) {
							oldDays = this.oldDays;
						}
						if (missingDays == undefined) {
							missingDays = oModel.getData().days;
						}
						if (missingDays == undefined || oldDays == undefined) {
							return;
						}

						for ( var i = 0; i < missingDays.length; i++) {

							for ( var j = 0; j < missingDays[i].entries.length; j++) {
								if (oldDays[i] && j < oldDays[i].entries.length) {
									var item1 = oldDays[i].entries[j];
									var item2 = missingDays[i].entries[j];

									if (item2.deleted || item2.counter == null || item2.suggestion || item1.mainItem != item2.mainItem
											|| item1.subItems != item2.subItems || item1.notes != item2.notes || item1.hours != item2.hours
											|| item1.minutes != item2.minutes || item1.startTime != item2.startTime
											|| item1.endTime != item2.endTime) {
										oModel.setProperty("/showSubmit", true);
										return;

									}
								} else {
									oModel.setProperty("/showSubmit", true);
									return;
								}
							}
						}

						oModel.setProperty("/showSubmit", false);
					},

					convertDateFormat : function(date) {
						return sap.ui.core.format.DateFormat.getDateInstance({
							style : "medium"
						}).format(date);
					},

					YYYYMMDDtoDate : function(date_str) {
						// check
						if (date_str == undefined)
							date_str = "";

						var y = parseInt(date_str.substr(0, 4), 10);
						var m = parseInt(date_str.substr(4, 2), 10) - 1;
						var d = parseInt(date_str.substr(6, 2), 10);

						return new Date(y, m, d, 0, 0, 0, 0);
					},

					jumpListToYYYYMMDD : function(date_str, item) {
						try {
							var oModel = this.oApplication.getModel("TSM_WEEKLY");
							var days = oModel.getData().days;

							var selected_date = this.convertDateFormat(this.YYYYMMDDtoDate(oModel.getData().selected));

							for ( var i = 0; i < days.length; i++) {
								var oDay = days[i];

								if (selected_date != this.convertDateFormat(oDay.date))
									continue;
								var items = this.entryListContents.getItems();
								for ( var j = 0; j < items.length; j++) {
									if (items[j] instanceof sap.m.GroupHeaderListItem) {
										if (items[j].getTitle() == this.convertDateFormat(/*selectedDate*/selected_date)) {
										}
									}
								}
							}
						} catch (e) {
						}
					},


					loadListWithoModel : function() {
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						this.loadListWithoPageData(oModel.getData());
					},

					loadListWithoPageData : function(oPageData) {
						if (oPageData.days == null) {
							return;
						}

						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						var selected_date = this.convertDateFormat(this.YYYYMMDDtoDate(oModel.getData().selected));
						for ( var i = 0; i < oPageData.days.length; i++) {
							var oDay = oPageData.days[i];
							oDay.selected = (selected_date == oDay.dateFormatted);
						}
						this.loadList(oPageData.days);
					},

					listSmartClick : function(oItem, clickFunc) {
						var downFunc = function(oEvent) {
							oEvent.currentTarget.downed_y = oEvent.pageY;
						};

						var upFunc = function(oEvent) {
							// hack fix to stop dialog event pass throughs
							// if(oApp.dialogIsVisible()) return;

							if (Math.abs(oEvent.currentTarget.downed_y - oEvent.pageY) < 40)
								clickFunc(oEvent);
						};

						oItem.attachBrowserEvent("mousedown", downFunc);
						oItem.attachBrowserEvent("mouseup", upFunc);
						oItem.attachBrowserEvent("touchstart", downFunc);
						oItem.attachBrowserEvent("touchend", upFunc);
					},


					// crtl+shift+f makes this function hard to read
					loadList : function(list_data) {
						// grab the entry list contents vbox for populating
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						var days = oModel.getData().days;
						var self = this;
						this.entryListContents = this.byId("ENTRY_LIST_CONTENTS");
						this.entryListContents.destroyItems();

						for ( var i = 0; i < days.length; i++) {
							// var sheaderData = (!days[i].entries[0].mainItem)? " (No Data)": "";
							// create and prepare a day entry
							var oWeekEntryDayHeader = new sap.m.GroupHeaderListItem({
								title : this.convertDateFormat(days[i].date)
							// + sheaderData
							});
							
							
							oWeekEntryDayHeader.addCustomData(new sap.ui.core.CustomData({
								key : "day",
								value : days[i].date
							}));
							
							this.entryListContents.addItem(oWeekEntryDayHeader);

							// Commenting the No Data Header
							/*
							 * var oSingleListEntry = new sap.m.GroupHeaderListItem({title : "No Data "});
							 * 
							 * (!days[i].entries[0].mainItem)? this.entryListContents.addItem(oSingleListEntry): "";
							 */

							// set whether this day is selected or not
							oWeekEntryDayHeader.setSelected(days[i].selected);

							// TODO added for new entries always
							if (!days[i].entries[days[i].entries.length]) {
								if (days[i].entries[days[i].entries.length - 1]) {
									if (days[i].entries[days[i].entries.length - 1].newEntry) {

									}
									// Changed New Entry to false
									else {
										days[i].entries.push({
											newEntry : true
										});
									}
								}
							}

							// load the items for this day entry
							for ( var j = 0; j < days[i].entries.length; j++) {
								var list_item_entry = days[i].entries[j];

								if (list_item_entry.deleted) {
									continue;
								}
								var oSingleListEntry = new sap.m.ColumnListItem({
									type : "Inactive",
									tap : function(oEvent) {
										self.onItemSelectGotoEdit(oEvent);
									}
								});
								oSingleListEntry.addCustomData(new sap.ui.core.CustomData({
									key : "day",
									value : i
								}));
								oSingleListEntry.addCustomData(new sap.ui.core.CustomData({
									key : "entry",
									value : j
								}));
								oSingleListEntry.addCustomData(new sap.ui.core.CustomData({
									key : "dateformated",
									value : days[i].dateFormatted
								}));
								oSingleListEntry.addCustomData(new sap.ui.core.CustomData({
									key : "selectedDate",
									value : days[i].dateStr
								}));

								if (list_item_entry.newEntry) {
									// Removing adding of New Cell for New entry as it is not required for new Mockup
									oSingleListEntry.addCell(new sap.m.Label({
										text : this.oBundle.getText("ADD_NEW")
									}));
									// var cell = new sap.ui.layout.VerticalLayout();
									// cell.addContent(new sap.m.ObjectStatus());
									oSingleListEntry.addCell(new sap.m.Label());
									//two Extra labels 
									oSingleListEntry.addCell(new sap.m.Label());
									oSingleListEntry.addCell(new sap.m.Label());
									oSingleListEntry.addCell(new sap.m.ObjectStatus());
								} else {
									var oObject = new sap.m.ObjectIdentifier({
										title : list_item_entry.mainItem,
										text : list_item_entry.subItems,
										badgeNotes : list_item_entry.hasNotes
									});
									if (list_item_entry.showError || list_item_entry.rejectionReason) {
										var cell = new sap.ui.layout.VerticalLayout();
										cell.addContent(oObject);

										if (list_item_entry.showError) {
											cell.addContent(new sap.m.ObjectStatus({
												text : list_item_entry.error,
												state : sap.ui.core.ValueState.Error
											}));
										} else {
											cell.addContent(new sap.m.ObjectStatus({
												text : list_item_entry.rejectionReason,
												state : sap.ui.core.ValueState.Error
											}));
										}										
										oSingleListEntry.addCell(cell);
									} else {
										oSingleListEntry.addCell(oObject);
									}
									var hrsMinText = list_item_entry.hours + this.oBundle.getText("HOURS_LABEL") + " "
											+ list_item_entry.minutes + this.oBundle.getText("MINUTES_LABEL");
									//Datetime
									var timeParser = sap.ca.ui.model.format.DateFormat.getTimeInstance({pattern : "HHmmss"});
									var timeFormatter = sap.ca.ui.model.format.DateFormat.getTimeInstance({style:"medium"});
									var startTimeFormatted ;
									var endTimeFormatted;
									if(this.clockEntry){
										startTimeFormatted = timeParser.parse(list_item_entry.startTime);
										oSingleListEntry.addCell(new sap.m.Label({text:timeFormatter.format(startTimeFormatted)}));
										endTimeFormatted = timeParser.parse(list_item_entry.endTime);
										oSingleListEntry.addCell(new sap.m.Label({text:timeFormatter.format(endTimeFormatted)}));
									}
									else{
										oSingleListEntry.addCell(new sap.m.Label());
										oSingleListEntry.addCell(new sap.m.Label());
									}
									
									//Note 1959135: Display decimal time format or HH:MM time format
									var InitalInfoModel = self.oApplication.getModel("timesheet_initialInfo");
									var decimalTimeEntry = InitalInfoModel.getData().decimalTimeEntry;
									
									if(decimalTimeEntry){
										oSingleListEntry.addCell(new sap.m.Label({
											text : sap.ca.ui.model.format.NumberFormat.getInstance({style:'standard'}).format(list_item_entry.time),//dot-comma issue
											visible : list_item_entry.showTime
										}));										
									}else{
										oSingleListEntry.addCell(new sap.m.Label({
											text : hrsMinText,
											visible : list_item_entry.showTime
										}));
									}
									
									// Adding the status in the table
									var stateOfStatus;
									if (list_item_entry.statusId == "REJECTED" || list_item_entry.statusId == "MSAVE") { //Note:save should also be in red color	
										stateOfStatus = sap.ui.core.ValueState.Error;
									} else {
										stateOfStatus = sap.ui.core.ValueState.Success;
									}
									oSingleListEntry.setType("Navigation");
									oSingleListEntry.addCell(new sap.m.ObjectStatus({
										text : list_item_entry.status,
										state : stateOfStatus
									}));
								}
								// TODO Check

								this.entryListContents.addItem(oSingleListEntry);
								/*
								 * if(list_item_entry.mainItem){ this.entryListContents.addItem(oSingleListEntry); }else{
								 *  };
								 */

							}
						}
						if (jQuery.device.is.phone) {
							this.byId("WEEKLY_PAGE").setTitle(
									this.oBundle.getText("SUMMARY", [
											this.convertDateFormat(this.parseDateYYYYMMdd(oModel.getData().start)),
											this.convertDateFormat(this.parseDateYYYYMMdd(oModel.getData().end))]));
						}
						if (jQuery.device.is.phone || jQuery.device.is.tablet) {
							var oSwipeContent = new sap.m.Button({
								text : this.oBundle.getText("DELETE"),
								type : "Reject"
							});
							var self = this;
							oSwipeContent.attachPress(function() {
								var oData = oModel.getData();
								oData.days[self.dayIndex].entries[self.entryIndex].deleted = true;
								self.checkHours(oData, self.dayIndex);
								self.loadListWithoModel();
								self.checkSubmit();
							});
							this.byId("ENTRY_LIST_CONTENTS").setSwipeContent(oSwipeContent);
						}

						// this sets the size of the status bar to fill the height of the whole row
						setTimeout(function() {
							$(".sapTSM-WPEntryColor").each(function(index, value) {
								var $value = $(this);
								var height = $value.parent().parent().height();
								$value.height(height);
							});
						}, 500);
						/**
					     * @ControllerHook Extend behavior of Load List
					     * This hook method can be used to add UI or business logic 
					     * It is called when the LoadList method executes
					     * @callback hcm.emp.mytimesheet.view.S3~extHookLoadList
					     */
							if(this.extHookLoadList) {
								this.extHookLoadList();
					  	};
					},

					// end of changed to load list for multiple edits

					// TODO code added for delete functionailty
					onDelete : function(oEvent) {
						var oTableRef = this.byId("ENTRY_LIST_CONTENTS");
						var selectedItems = [];
						selectedItems = oTableRef.getSelectedItems();
						// Deleted Hours Summary
						var deletedHours = 0;
						var deletedMinutes = 0;
						var deletedTime = 0;
						var numberOfItemsGettingDeleted;
						var dayIndex;
						var entryIndex;
						var entry;
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						var oPageData = oModel.getData();
						var oSettings = null;
						numberOfItemsGettingDeleted = selectedItems.length;
						for ( var i = 0; i < selectedItems.length; i++) {
							dayIndex = selectedItems[i].data().day;
							entryIndex = selectedItems[i].data().entry;
							entry = oPageData.days[dayIndex].entries[entryIndex];
							this.updatePageData(true, dayIndex, entry,false);
							if(entry.subItems != this.oApplicationFacade.getResourceBundle().getText("ADD_NEW")){
							jQuery.sap.log.info("Hours : " + entry.hours);
							deletedHours += entry.hours;
							deletedMinutes += entry.minutes;
							jQuery.sap.log.info("Minutes : " + entry.minutes);
							deletedTime += entry.time;
							deletedTime = parseFloat(deletedTime.toFixed(2));
							jQuery.sap.log.info("Duration : " + entry.time);
							}else{
								numberOfItemsGettingDeleted--;
							}
							/*
							 * if(entry.newEntry == true){ numberOfItemsGettingDeleted--; }
							 */
							if (deletedMinutes > 59) {
								deletedMinutes -= 60;
								deletedHours++;
							}
						}
						if(this.isClockEntry()){

						oSettings = {
							question : this.oBundle.getText('DELETE_CONFIRMATION_SUMMARY'),
							additionalInformation : [
									{
										label : this.oBundle.getText('DELETE_CONFIRMATION_SUMMARY_ENTRIES'),
										text : numberOfItemsGettingDeleted.toString()
									},
									{
										label : this.oBundle.getText('DELETE_CONFIRMATION_SUMMARY_HOURS'),
										text : this.oBundle.getText('FULL_CONCATENATE_HOURSMIN',[deletedHours,deletedMinutes])
									}],
							showNote : false,
							title : this.oConfiguration.getText("DELETE_CONFIRMATION"),
							confirmButtonLabel : this.oBundle.getText("OK")
						};
						}
						else{
							var txt_tot_duration = this.oBundle.getText('TOTAL_DURATION');//NOTE CODE ADDED TO COMPENSATE FOR MISSING TEXT IN i18 file...Replace this as soon as the translations have come
                            if(txt_tot_duration.indexOf('_')!=(-1)){
                            	txt_tot_duration = "Total Duration";
                            }
							oSettings = {
							question : this.oBundle.getText('DELETE_CONFIRMATION_SUMMARY'),
							additionalInformation : [
									{
										label : this.oBundle.getText('DELETE_CONFIRMATION_SUMMARY_ENTRIES'),
										text : numberOfItemsGettingDeleted.toString()
									},
									{
										label : txt_tot_duration,
										text : sap.ca.ui.model.format.NumberFormat.getInstance({style:'standard'}).format(deletedTime.toString())
									}],
							showNote : false,
							title : this.oConfiguration.getText("DELETE_CONFIRMATION"),
							confirmButtonLabel : this.oBundle.getText("OK")
						};
						}

						var _this = this;
						sap.ca.ui.dialog.factory.confirm(oSettings, function(response) {
							if (response.isConfirmed == true) {
								_this._submit(selectedItems.length, deletedHours, deletedMinutes);
							}
						});

						// this.loadListWithoModel();
						// this.getView().setModel(oModel);

						// Loading list after data for all the selected entries is updated

					},

					isClockEntry : function() {
						return this.oConfiguration.getClockEntry();
					},

					updatePageData : function(bDeleted, dayIndex, entry,bToBeReleased) {
						//return when new entry has been selectd and sent for submitting
						//
						if(!entry){
							return;
						}
						
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						var pageData_update = oModel.getData();
						this.entry = entry;
						this.dayIndex = dayIndex;
						if (bDeleted) {
							this.entry.deleted = true;
						}
						if(bToBeReleased){
							this.entry.bToBeReleased = true;
						}

						// Prepare entry
						this.entry.newEntry = false;
						this.entry.showTime = true;
						if (!this.isClockEntry()) {
							this.entry.hours = parseInt(this.entry.hours, 10);
							this.entry.minutes = parseInt(this.entry.minutes, 10);
						} else {
						//	var startTime = this.byId("startTime").getDateValue(), endTime = this.byId("endTime").getDateValue();

							this.entry.startTime = entry.startTime;
							this.entry.endTime = entry.endTime;

						//	var durationInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
/*
							var iStart = startTime.getHours() * 60 + startTime.getMinutes();
							var iEnd = endTime.getHours() * 60 + endTime.getMinutes();
							var iLunchStart = parseInt(this.workingDay.lunchStart.substring(0, 2), 10) * 60
									+ parseInt(this.workingDay.lunchStart.substring(2, 4), 10);
							var iLunchEnd = parseInt(this.workingDay.lunchEnd.substring(0, 2), 10) * 60
									+ parseInt(this.workingDay.lunchEnd.substring(2, 4), 10);

							if (iStart < iLunchStart && iEnd > iLunchEnd) {
								// deduct lunch time from duration
								durationInMinutes -= (iLunchEnd - iLunchStart);
							}
							if (durationInMinutes < 0) {
								durationInMinutes += (24 * 60);
							}*/
							this.entry.hours = entry.hours;
							this.entry.minutes = entry.minutes;
							this.entry.time = entry.time;
						}
						

						this.entry.hasNotes = (this.entry.notes && this.entry.notes.length > 0) ? true : false;

						if (this.dayIndex < 0) {
							// this is a multi-day entry
							var calendar = this.byId("weeklyCalendar");
							var selectedDates = calendar.getSelectedDates();
							for ( var i = 0; i < selectedDates.length; i++) {
								var entries = this.getDateEntries(selectedDates[i]);
								entries.push(jQuery.extend(true, {}, this.entry));
								for ( var k = 0; k < entries.length; k++) {
									if (entries[k].newEntry) {
										// if there is a new entry, remove it as we have now put the common item there
										entries.splice(k, 1);
									}
								}
							}
						} else {
							pageData_update.days[this.dayIndex].entries[this.entryIndex] = this.entry;

							// we now need to work out if we need a new entry line or not
							var totalHours = 0;
							var newEntryIndex = -1;
							for ( var i = 0; i < pageData_update.days[this.dayIndex].entries.length; i++) {
								if (pageData_update.days[this.dayIndex].entries[i].newEntry) {
									newEntryIndex = i;
								} else {
									totalHours += pageData_update.days[this.dayIndex].entries[i].time;
								}
							}
							var missingTime = pageData_update.days[this.dayIndex].targetHours - totalHours;
							if (missingTime > 0) {
								// new entry line is needed
								if (newEntryIndex >= 0) {
									pageData_update.days[this.dayIndex].entries[newEntryIndex].time = missingTime;
									pageData_update.days[this.dayIndex].entries[newEntryIndex].hours = Math.floor(missingTime);
									pageData_update.days[this.dayIndex].entries[newEntryIndex].time = Math.round((missingTime - Math
											.floor(missingTime)) * 60);
								} else {
									// there was no new entry previously, but we need one
									var newEntry = new hcm.emp.mytimesheet.model.TimeEntry(missingTime, this.oBundle.getText("ADD_NEW"));
									if (this.isClockEntry()) {
										newEntry.setStartEndTimes(pageData_update.days[this.dayIndex].date,
												pageData_update.days[this.dayIndex].entries, missingTime, this.workingDay);
									}
									pageData_update.days[this.dayIndex].entries.push(newEntry);
								}
							} else {
								// new entry line not needed
								for ( var i = 0; i < pageData_update.days[this.dayIndex].entries.length; i++) {
									if (pageData_update.days[this.dayIndex].entries[i].newEntry) {
										// if there is a new entry, remove it as we have now put the common item there
										pageData_update.days[this.dayIndex].entries.splice(i, 1);
									}
								}
							}
						}

						// calling check Select Entries to form the necessary checks
						this.checkSelectedEntry({
							pageData : pageData_update,
							dayIndex : this.dayIndex
						});
						/**
					     * @ControllerHook Extend behavior of Update Page Data
					     * This hook method can be used to add UI or business logic 
					     * It is called when the UpdatePageData method executes
					     * @callback hcm.emp.mytimesheet.view.S3~extHookUpdatePageData
					     */
							if(this.extHookUpdatePageData) {
								this.extHookUpdatePageData();
					  	};
					},

					// Function similar to fromPopOver Which will do the necessary checks
					checkSelectedEntry : function(oData) {
						var oModel = this.oApplication.getModel("TSM_WEEKLY");
						var localEventdata;
						localEventdata = oData;
						if (localEventdata.dayIndex !== undefined) {
							if (localEventdata.dayIndex >= 0) {
								this.checkHours(localEventdata.pageData, localEventdata.dayIndex);
								//TODO: chk this
								//this.selectDate(localEventdata.pageData.days[localEventdata.dayIndex].date);
							} else {
								// if we returned to this page from using the plus, then we need to check hours for all days
								for ( var i = 0; i < localEventdata.pageData.days.length; i++) {
									this.checkHours(localEventdata.pageData, i);
								}
							}
							this.checkSubmit(this.oldDays, localEventdata.pageData.days);
							/*
							 * this.loadListWithoModel(); this.getView().setModel(oModel);
							 */
						}
					},

					manageChecklist : function(objectlistItems, objectItem, operation) {
						var indexValue;

						if (null !== objectlistItems && "" !== objectlistItems) {
							for ( var it = 0; it < objectlistItems.length; it++) {
								if (objectlistItems[it] instanceof sap.m.GroupHeaderListItem) {
									if (!objectlistItems[it].getSelected()) {
										if ((indexValue = jQuery.inArray(objectlistItems[it], this.checkboxList)) !== -1) {
											this.checkboxList.splice(indexValue, 1);
										}
									} else {
										if ((indexValue = jQuery.inArray(objectlistItems[it], this.checkboxList)) === -1) {
											this.checkboxList.push(objectlistItems[it]);
										}
									}
								}
							}

						} else {
							if (operation === "pop") {
								if ((indexValue = jQuery.inArray(objectItem, this.checkboxList)) !== -1) {
									this.checkboxList.splice(indexValue, 1);
								}
							}
							if (operation === "push") {
								if ((indexValue = jQuery.inArray(objectItem, this.checkboxList)) === -1) {
									this.checkboxList.push(objectItem);
								}
							}
						}
					},

					manageSelection : function(listItems, dateRefernce, fromClick) {
						var valuesPresent = false;
						// var groupNameFlag=[].concat(dateRefernces);
						var indexValue;

						for ( var i = 0; i < listItems.length; i++) {
							if (listItems[i].mAggregations.customData.length === 4) {
								if (listItems[i].mAggregations.customData[2].mProperties.value === this.convertDateFormat(dateRefernce)) {
									if (listItems[i].getSelected() && !fromClick) {
										listItems[i].setSelected(false);
										this.manageChecklist(null, listItems[i], "pop");
									} else if ((!listItems[i].getSelected() && fromClick)){
										listItems[i].setSelected(true);
										this.manageChecklist(null, listItems[i], "push");
										// if((indexValue=jQuery.inArray(dateRefernce,groupNameFlag))!==-1){
										// groupNameFlag.slice(indexValue,1);
										// }
									}
									if (fromClick) {
										// if the user clicked to select this date, we see if we should add an entry for overtime.
										// if it was from a navigation, we don't do anything
										this.checkOvertime(dateRefernce);
									}
								}
							}
						}

						valuesPresent = true;


						return valuesPresent;
					},

	selectDateOnAllCheckBoxSelection : function(tblCntrl, curntListItem) {
						
						var listItems = tblCntrl.getItems();
						var selItems = tblCntrl.getSelectedItems();
						var curntSelIndex = tblCntrl.indexOfItem(curntListItem);
						var headerIndexes = [];
						var currentHeaderIndex = null;
						for ( var i = 0; i < listItems.length; i++) {
							if (listItems[i] instanceof sap.m.GroupHeaderListItem) {
								headerIndexes.push(i);
								jQuery.sap.log.info(i + "Items is a header" + listItems[i].getTitle());
							} else if (listItems[i] instanceof sap.m.ColumnListItem) {
								jQuery.sap.log.info(i + "Items is a list items");
							}
							
							if(curntSelIndex === i){
								currentHeaderIndex = headerIndexes.length-1;
							}
						}
						//var k = 0;
						var noOfHeaders = headerIndexes.length;
						jQuery.sap.log.info("Number of Header :" + noOfHeaders);
						var startIndex=null;
						var endIndex=null;
						startIndex = headerIndexes[currentHeaderIndex] + 1;
						if(startIndex===undefined){
							startIndex = headerIndexes[currentHeaderIndex];
						}
						endIndex = headerIndexes[currentHeaderIndex + 1];
						if(endIndex===undefined){
							endIndex = headerIndexes[currentHeaderIndex];
						}
						var isPeerUnchkd = false;
						var selectedDates = [];
						var unSelectedDates = [];
						if(endIndex<startIndex){							
							for ( var j = startIndex; j < listItems.length; j++) {
								if (!listItems[j].getSelected()) {
									isPeerUnchkd = true;
								}			
							}
							
						}else{
							for ( var j = startIndex; j < endIndex; j++) {
								if (!listItems[j].getSelected()) {
									isPeerUnchkd = true;
								} 			
							}
						}
						
						var dateFormatter = sap.ca.ui.model.format.DateFormat.getInstance();
						
						if(!curntSelIndex==0){
							var selDate = dateFormatter.convertToDate(this._getHeaderDate(listItems[headerIndexes[currentHeaderIndex]]));
							if (!isPeerUnchkd) {
								selectedDates.push(selDate);
							}else{
								unSelectedDates.push(selDate);
							}
							}
						else{
							// select all case
							if (tblCntrl._selectAllCheckBox.getSelected()) {
								for ( var i = 0; i < headerIndexes.length; i++) {
									var crntDate = dateFormatter.convertToDate(this._getHeaderDate(listItems[headerIndexes[i]]));
									selectedDates.push(crntDate);
								}
							}else{
								for ( var i = 0; i < headerIndexes.length; i++) {
									var crntDate = dateFormatter.convertToDate(this._getHeaderDate(listItems[headerIndexes[i]]));
									unSelectedDates.push(crntDate);
								}
							}
						}
						
						// unselect all case
						// selectAllCheckBox in table should be expose public api
						if(curntSelIndex==1 && !tblCntrl._selectAllCheckBox.getSelected() && selItems.length == 0){
							for ( var i = 0; i < headerIndexes.length; i++) {
								var curntDate = dateFormatter.convertToDate(this._getHeaderDate(listItems[headerIndexes[i]]));
								unSelectedDates.push(curntDate);
							}
						}
						
						this.byId("WEEKLY_CALENDAR").toggleDatesSelection(selectedDates, true);
						this.byId("WEEKLY_CALENDAR").toggleDatesSelection(unSelectedDates, false);
						selectedDates = [];
						unSelectedDates =[];
					},
					
					_getHeaderDate : function(headerItem){
						var customData = headerItem.getCustomData();
						for(var i = 0; i < customData.length; i++) {
							if(customData[i].getKey()==="day") {
								return customData[i].getValue();
							}
						}						
					},


					unselectTopDates : function(groupNames) {
						this.byId("WEEKLY_CALENDAR").toggleDatesSelection(groupNames, false);
					},

					
					getHeaderFooterOptions : function() {

						var that = this;
						return {
							sI18NFullscreenTitle : "TIMESHEET_TITLE",

							oEditBtn : {
								id : "QUICK_FILL_BTN",
								sI18nBtnTxt : "CREATE",
								onBtnPressed : function(evt) {
									that.onAddNewEntry(evt);
								}
							},

							buttonList : [

							{
								sId : "deleteBtn",
								sI18nBtnTxt : "DELETE",
								onBtnPressed : function(evt) {
									// that.onQuickEntry(evt);
									that.onDelete(evt);
								}
							}, {
								sId : "SUBMIT_BTN",
								sI18nBtnTxt : "SUBMIT",
								onBtnPressed : function(evt) {
									// that.onQuickEntry(evt);
									that.onSubmit(evt);
								}
							}],
													
							  onBack: jQuery.proxy(function() {	
					                var sDir = sap.ui.core.routing.History.getInstance().getDirection(""); // dummy call
					                if (sDir && sDir !== "Unknown") {	
					                    window.history.go(-1);	
					                } else {	
					                    this.oRouter.navTo("S2", {}, true);	
					                }	
							}, this)
					        
							
						};

					}

				});