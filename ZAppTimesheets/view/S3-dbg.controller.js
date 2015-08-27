/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("hcm.mgr.approve.timesheet.utility.Parser");
jQuery.sap.require("sap.ca.ui.message.message");

sap.ca.scfld.md.controller.BaseDetailController
.extend(
		"hcm.mgr.approve.timesheet.view.S3",
		{
			//Controller Hook method definitions
			extHookShowWeekData: null,
			extHookShowPeopleData: null,
			onInit : function() {
				// execute the onInit for the base class
				// BaseDetailController
				sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit
				.call(this);

				this.oBundle = this.oApplicationFacade
				.getResourceBundle();
				this.oDataModel = this.oApplicationFacade
				.getODataModel();

				this.self = this;
				this.selection = "";
				this.busyDialog = new sap.m.BusyDialog({customIcon: sap.ca.ui.images.images.Flower});
				hcm.mgr.approve.timesheet.utility.Parser.setControllerInstance(this);
				this.oRouter
				.attachRouteMatched(

						function(oEvent) {

							if (oEvent.getParameter("name") === "detail") {

								this.busyDialog.open();
								var contextPath = decodeURIComponent(oEvent
										.getParameter("arguments").contextPath);
								this.selection = contextPath
								.split("/")[1];
								var val = contextPath
								.split("/")[2];
								var cachedOData = hcm.mgr.approve.timesheet.utility.Parser
								.getCachedData();
								var onRequestSuccess = function(
										oData, oResponse) {
									var that = hcm.mgr.approve.timesheet.utility.Parser.getControllerInstance();
									var obj = oData.results;
									var timeModelData = new Object();
									var Employee = "";
									var Cost = "";
									that.model = new sap.ui.model.json.JSONModel();

									if (that.selection === "Employee") {
										Employee = hcm.mgr.approve.timesheet.utility.Parser
										.EmployeeData(obj);
										that.busyDialog.close();
										timeModelData.Employee = Employee;
										timeModelData.Employee[val].CostVisible = false;
										timeModelData.Employee[val].PeopleVisible = true;
										that.model
										.setData(timeModelData.Employee[val]);

										that.getView().byId(
										"operations")
										.setVisible(
												true);
										that.getView().byId(
										"cost")
										.setVisible(
												false);
									} else {
										Cost = hcm.mgr.approve.timesheet.utility.Parser
										.CostAssignmentData(obj);
										that.busyDialog.close();
										timeModelData.CA = Cost;
										timeModelData.CA[val].CostVisible = true;
										timeModelData.CA[val].PeopleVisible = false;
										that.model
										.setData(timeModelData.CA[val]);

										that.getView().byId(
										"cost")
										.setVisible(
												true);
										that.getView().byId(
										"operations")
										.setVisible(
												false);
									}
									that.getView().setModel(
											that.model,
									"DetailModel");

								};
								var onRequestFailed = function(
										oError) {
									//Note: 2052226 (error modifcation)
									/*
									sap.ca.ui.message
									.showMessageBox({
										type : sap.ca.ui.message.Type.ERROR,
										message : oError.message,
										details : oError.response.body
									});

									 */
									this.processError(oError);
									//Note: end 2052226 (error modifcation)
								};

								if(cachedOData){
									onRequestSuccess(cachedOData,this);
								}
								else{
									this.oDataModel
									.read(
											"Time_Pending",
											null,
											null,
											true,
											jQuery
											.proxy(
													onRequestSuccess,
													this),
													jQuery
													.proxy(
															onRequestFailed,
															this));
								}
							}
						}, this);

				this.oNotesList = new sap.m.List({
					inset : true
				});

				var oNoteLayout = new sap.m.VBox({
					items : [ this.oNotesList ]
				});
				var closePopover = function(that) {
					this.oPopoverNotes.close();
				};
				this.oPopoverNotes = new sap.m.ResponsivePopover({
					placement : sap.m.PlacementType.Bottom,
					title : this.oBundle.getText("TSA_DETAILS"),
					showHeader : true,
					content : [ oNoteLayout ],
					beginButton : new sap.m.Button({
						text : this.oBundle.getText("TSA_ACCEPT"),
						press : jQuery.proxy(closePopover, this)
					})
				});

				this.fetchRejectionReasons();
			},
			/**
			 * @private [fetchRejectionReasons fetch the rejection
			 *          reasons for rejection a time record]
			 */
			fetchRejectionReasons : function() {
				var that = this;
				var onRequestSuccess = function(oData, oResponse) {
					that._setRejection(oData, oResponse);
				};

				var onRequestFailed = function(oError) {
					//Note:2052226 (error modifcation)
					/*  		
					sap.ca.ui.message.showMessageBox({
						type : sap.ca.ui.message.Type.ERROR,
						message : oError.message,
						details : oError.response.body
					});
					 */
					this.processError(oError);
					//Note: end 2052226 (error modifcation)
				};
				this.oDataModel.read("Rej_Reason", null, null, true,
						jQuery.proxy(onRequestSuccess, this), jQuery
						.proxy(onRequestFailed, this));

			},
			/**
			 * @private [_setRejection display list of rejection
			 *          reasons]
			 * @param {[type]}
			 *            data
			 */
			_setRejection : function(data) {
				var that = this;
				var handler = this.self;
				//var selectedtype = this.selection;

				this.oReasons = data;
				var ojson = new sap.ui.model.json.JSONModel(
						this.oReasons);
				var oTitle = this.oBundle
				.getText("TSA_TIT_REJECTION_REASON");

				this.oDialog = new sap.m.SelectDialog({
					title : oTitle
				});
				var oItemTemplate1 = new sap.m.StandardListItem({
					title : "{Text}",
					type : "Active",
				});
				// attach close listener
				this.oDialog.attachConfirm(function(evt) {
					var selectedItem = evt.getParameter("id");
					if (selectedItem) {
						//note: set the correct rejection list item index
						/*	var len = selectedItem.length;
								len = len - 1;
								var list_index = selectedItem.charAt(len);*/
						var listSPath = evt.getParameters().selectedContexts[0].sPath;
						var listSPathSplit=listSPath.split("/");
						var list_index = listSPathSplit[2];
						//end note: set the correct rejection list item index
											that._onTap(list_index, /*event*/evt);//Note:2052226 event didn't exist in firefox, whereas evt existed in chrome, IE and Firefox

					}
				});

				this.oDialog
				.attachCancel(function(evt) {

					var path = "";
					var data = "";
					var modelName = "";

					if (/*selectedtype*/this.selection === "Employee") {    //Note: 2030153 the current selected model is reflected in this.selection
						modelName = "WeekModel";
					} else {
						modelName = "PeopleModel";
					}
					path = handler.getView()
					.getModel(modelName).oData.selectedPath;
					data = handler.getView()
					.getModel(modelName).oData.Days[path];
					data.Status = "A";
					that.switched.setState(true);//The switch should be set back to approve when the rejection reason popup is cancelled
					/*if(that.status === "R"){
						that.switched.setState(true);
					}*/
					data.RejectionReason = "";
					data.RejectionReasonText = "";
					handler.getView().getModel(modelName)
					.getData().Days[path] = data;
				},this); 													//Note: 2030153 

				//Note: 2030153  adding search functionality for rejection reason pop-up
				this.oDialog                                               
				.attachSearch(function(evt){
					var sValue = evt.getParameter("value");
					var oFilter = new sap.ui.model.Filter("Text", sap.ui.model.FilterOperator.Contains, sValue);
					var oBinding = evt.getSource().getBinding("items");
					oBinding.filter([oFilter]);
				});	
				//Note: 2030153  end adding search functionality for rejection reason pop-up						

				this.oDialog.setModel(ojson);
				this.oDialog.bindAggregation("items", "/results",
						oItemTemplate1);
			},
			/**
			 * @private [_onTap set the rejection reason for rejecting a
			 *          time record]
			 * @param list_index -
			 *            index of the selected item, oEvent - event
			 *            object
			 */
			_onTap : function(list_index, oEvent) {
				var modelName = "";

				if (this.selection == "Employee") {
					modelName = "WeekModel";
				} else {
					modelName = "PeopleModel";
				}
				var path = this.getView().getModel(modelName).oData.selectedPath;
				var data = this.getView().getModel(modelName).oData.Days[path];

				var listData = this.oDialog.getModel().oData.results[list_index];
				data.RejectionReason = listData.Reason;
				data.RejectionReasonText = listData.Text;

				this.getView().getModel(modelName).oData.Days[path] = data;
			},
			/**
			 * @private [showWeekData to display time recording for a
			 *          week based on employee]
			 * @param oEvent -
			 *            event object
			 */
			showWeekData : function(oEvent) {
				var text_day_visible = oEvent.oSource.mProperties.text;
				var selectedWeekPath = oEvent.oSource.oPropagatedProperties.oBindingContexts.DetailModel.sPath;
				var hidingData = this.getView().oModels.DetailModel.oData.Weeks;
				var index = selectedWeekPath.substring("7");
				var selectedWeekData = hidingData[index];

				if (text_day_visible === this.oBundle
						.getText("TSA_HIDE")) {
					selectedWeekData.DayVisible = false;
					selectedWeekData.DayVisibleText = this.oBundle
					.getText("TSA_SHOW");
				} else if (text_day_visible === this.oBundle
						.getText("TSA_SHOW")) {
					selectedWeekData.DayVisible = true;
					selectedWeekData.DayVisibleText = this.oBundle
					.getText("TSA_HIDE");
				}
				var weekJsonModel = new sap.ui.model.json.JSONModel();
				var data = this.getView().getModel("DetailModel")
				.getData();
				data.selectedWeek = selectedWeekData;

				weekJsonModel.setData(data);
				//this.getView().setModel(weekJsonModel, "DetailModel");
				oEvent.oSource.oParent.setModel(weekJsonModel, "DetailModel");
				var weekJsonModel2 = new sap.ui.model.json.JSONModel();
				weekJsonModel2.setData(selectedWeekData);
				this.getView().setModel(weekJsonModel2, "WeekModel");//uncommented to make WeekModel available in the view level
				oEvent.oSource.oParent.setModel(weekJsonModel2, "WeekModel");
				/**
				 * @ControllerHook Extend behavior of Show Week Data
				 * This hook method can be used to add UI or business logic 
				 * It is called when the ShowWeekData method executes
				 * @callback hcm.mgr.approve.timesheet.view.S3~extHookShowWeekData
				 */
				if(this.extHookShowWeekData) {
					this.extHookShowWeekData();
				};
			},
			/**
			 * @private [showPeopleData to display time recording for a
			 *          week based on cost assignment]
			 * @param oEvent -
			 *            event object
			 */
			showPeopleData : function(oEvent) {
				var text_day_visible = oEvent.oSource.mProperties.text;
				var selectedWeekPath = oEvent.oSource.oPropagatedProperties.oBindingContexts.DetailModel.sPath;
				var hidingData = this.getView().oModels.DetailModel.oData.Peoples;
				var index = selectedWeekPath.substring("9");
				var selectedWeekData = hidingData[index];

				if (text_day_visible === this.oBundle
						.getText("TSA_HIDE")) {
					selectedWeekData.DayVisible = false;
					selectedWeekData.DayVisibleText = this.oBundle
					.getText("TSA_SHOW");
				} else if (text_day_visible === this.oBundle
						.getText("TSA_SHOW")) {

					selectedWeekData.DayVisible = true;
					selectedWeekData.DayVisibleText = this.oBundle
					.getText("TSA_HIDE");
				}
				var weekJsonModel = new sap.ui.model.json.JSONModel();
				var data = this.getView().getModel("DetailModel")
				.getData();

				data.selectedWeek = selectedWeekData;

				weekJsonModel.setData(data);
				//	this.getView().setModel(weekJsonModel, "DetailModel");
				oEvent.oSource.oParent.setModel(weekJsonModel, "DetailModel");
				var weekJsonModel2 = new sap.ui.model.json.JSONModel();
				weekJsonModel2.setData(selectedWeekData);
				this.getView().setModel(weekJsonModel2, "PeopleModel");//uncommented to make PeopleModel available in the view level
				oEvent.oSource.oParent.setModel(weekJsonModel2, "PeopleModel");
				/**
				 * @ControllerHook Extend behavior of Show People Data
				 * This hook method can be used to add UI or business logic 
				 * It is called when the extHookShowPeopleData method executes
				 * @callback hcm.mgr.approve.timesheet.view.S3~extHookShowPeopleData
				 */
				if(this.extHookShowPeopleData) {
					this.extHookShowPeopleData();
				};
			},
			/**
			 * @private [displayNotesEmployee to display notes popover
			 *          for an employee]
			 * @param oEvent -
			 *            event object
			 */
			displayNotesEmployee : function(oEvent) {
				var notes = [];
				var oItemTemplateNote = new sap.m.StandardListItem({
					title : "{title}",
					description : "{description}"
				});

				var data = this.getView().getModel("DetailModel")
				.getData();
				var path = oEvent.oSource.oPropagatedProperties.oBindingContexts.WeekModel.sPath;
				var day_idx = path.split("/")[2];
				var week_idx = oEvent.oSource.oPropagatedProperties.oBindingContexts.DetailModel.sPath
				.split("/")[2];

				var selectedDay = data.Weeks[week_idx].Days[day_idx];
				notes.push({
					"title" : this.oBundle.getText("TSA_COST_ASSGNT"),
					"description" : selectedDay.Cotype + "-"
					+ selectedDay.Codesc
				});
				/*notes
								.push({
									"title" : this.oBundle.getText("TSA_DATE"),
									"description" : hcm.mgr.approve.timesheet.utility.Parser
											.parseDateDay(selectedDay.Workdate)
								});

						notes
								.push({
									"title" : this.oBundle
											.getText("TSA_ACTUAL_HOURS"),
									"description" : hcm.mgr.approve.timesheet.utility.Parser
											.parseTimeDisplay(selectedDay.Actualhours)
								});*/
				if (selectedDay.CatsText !== "") {
					notes.push({
						"title" : this.oBundle.getText("TSA_NOTE"),
						"description" : selectedDay.CatsText
					});
				}

				if (selectedDay.RejectionReasonText !== "") {
					notes.push({
						"title" : this.oBundle
						.getText("TSA_REJECTION_REASON"),
						"description" : selectedDay.RejectionReasonText
					});
				}

				if (selectedDay.Lgart !== "") {
					notes.push({
						"title" : this.oBundle
						.getText("TSA_WAGE_TYPE"),
						"description" : selectedDay.Lgart
					});
				}

				if (selectedDay.Lstar !== "") {
					notes.push({
						"title" : this.oBundle
						.getText("TSA_ACTIVITY_TYPE"),
						"description" : selectedDay.Lstar
					});
				}

				var noteJsonModel = new sap.ui.model.json.JSONModel();
				data.EmployeeNotes = notes;
				noteJsonModel.setData(data);
				this.oNotesList.bindAggregation("items",
						"/EmployeeNotes", oItemTemplateNote);
				this.oNotesList.setModel(noteJsonModel);
				this.oPopoverNotes
				.setPlacement(sap.m.PlacementType.Left);
				this.oPopoverNotes.openBy(sap.ui.getCore().byId(
						oEvent.mParameters.id));

			},
			/**
			 * @private [displayNotesCost to display notes popover for
			 *          cost assignment view]
			 * @param oEvent -
			 *            event object
			 */
			displayNotesCost : function(oEvent) {
				var notes = [];
				var oItemTemplateNote = new sap.m.StandardListItem({
					title : "{title}",
					description : "{description}"
				});

				var data = this.getView().getModel("DetailModel")
				.getData();
				var path = oEvent.oSource.oPropagatedProperties.oBindingContexts.PeopleModel.sPath;
				var day_idx = path.split("/")[2];
				var week_idx = oEvent.oSource.oPropagatedProperties.oBindingContexts.DetailModel.sPath
				.split("/")[2];

				var selectedDay = data.Peoples[week_idx].Days[day_idx];
				notes.push({
					"title" : this.oBundle.getText("TSA_COST_ASSGNT"),
					"description" : data.Cotype + "-"
					+ data.Codesc
				});
				/*notes
								.push({
									"title" : this.oBundle.getText("TSA_DATE"),
									"description" : hcm.mgr.approve.timesheet.utility.Parser
											.parseDateDay(selectedDay.Workdate)
								});

						notes
								.push({
									"title" : this.oBundle
											.getText("TSA_ACTUAL_HOURS"),
									"description" : hcm.mgr.approve.timesheet.utility.Parser
											.parseTimeDisplay(selectedDay.Actualhours)
								});*/
				if (selectedDay.CatsText !== "") {
					notes.push({
						"title" : this.oBundle.getText("TSA_NOTE"),
						"description" : selectedDay.CatsText
					});
				}

				if (selectedDay.RejectionReasonText !== "") {
					notes.push({
						"title" : this.oBundle
						.getText("TSA_REJECTION_REASON"),
						"description" : selectedDay.RejectionReasonText
					});
				}
				if (selectedDay.Lgart !== "") {
					notes.push({
						"title" : this.oBundle
						.getText("TSA_WAGE_TYPE"),
						"description" : selectedDay.Lgart
					});
				}

				if (selectedDay.Lstar !== "") {
					notes.push({
						"title" : this.oBundle
						.getText("TSA_ACTIVITY_TYPE"),
						"description" : selectedDay.Lstar
					});
				}

				var noteJsonModel = new sap.ui.model.json.JSONModel();
				data.CostNotes = notes;
				noteJsonModel.setData(data);
				this.oNotesList.bindAggregation("items", "/CostNotes",
						oItemTemplateNote);
				this.oNotesList.setModel(noteJsonModel);
				this.oPopoverNotes
				.setPlacement(sap.m.PlacementType.Left);
				this.oPopoverNotes.openBy(sap.ui.getCore().byId(
						oEvent.mParameters.id));

			},
			/**
			 * @private [updateStatus change handler for switch in
			 *          employee detail]
			 * @param oEvent -
			 *            event object
			 */
			updateStatus : function(oEvent) {
				//Note: WeekModel update
				var selectedWeekPath = oEvent.oSource.oPropagatedProperties.oBindingContexts.DetailModel.sPath;
				var hidingData = this.getView().oModels.DetailModel.oData.Weeks;
				var index = selectedWeekPath.substring("7");
				var selectedWeekData = hidingData[index];
				var data1 = this.getView().getModel("DetailModel").getData();
				data1.selectedWeek = selectedWeekData;
				var weekJsonModel2 = new sap.ui.model.json.JSONModel();
				weekJsonModel2.setData(selectedWeekData);
				this.getView().setModel(weekJsonModel2, "WeekModel");//uncommented to make WeekModel available in the view level
				//Note: end WeekModel update
				var pathEmp = oEvent.oSource.oPropagatedProperties.oBindingContexts.WeekModel.sPath
				.split("/")[2];
				var data = oEvent.oSource.oPropagatedProperties.oBindingContexts.WeekModel.oModel.oData.Days[pathEmp];
				var currentStatus = data.Status;
				this.switched = oEvent.oSource;
				// set the rejection status to 'A' or 'R' based on the
				// current status value
				var newStatus = (currentStatus === "A") ? "R" : "A";
				this.status = currentStatus;
				data.Status = newStatus;
				var model = this.getView().getModel("WeekModel").oData;
				model.selectedPath = pathEmp;
				this.getView().getModel("WeekModel").oData = model;

				if (newStatus === "A") {
					data.RejectionReason = "";
					data.RejectionReasonText = "";
					oEvent.oSource.oPropagatedProperties.oBindingContexts.WeekModel.oModel.oData.Days[pathEmp] = data;
				} else {
					// open the rejection dialog
					this.oDialog.open();
				}
			},
			/**
			 * @private [updateStatus_CA change handler for switch in
			 *          cost assignment detail]
			 * @param oEvent -
			 *            event object
			 */
			updateStatus_CA : function(oEvent) {
				//Note: WeekModel update
				var selectedWeekPath = oEvent.oSource.oPropagatedProperties.oBindingContexts.DetailModel.sPath;
				var hidingData = this.getView().oModels.DetailModel.oData.Peoples;
				var index = selectedWeekPath.substring("9");
				var selectedWeekData = hidingData[index];
				var data1 = this.getView().getModel("DetailModel").getData();
				data1.selectedWeek = selectedWeekData;
				var weekJsonModel2 = new sap.ui.model.json.JSONModel();
				weekJsonModel2.setData(selectedWeekData);
				this.getView().setModel(weekJsonModel2, "PeopleModel");//uncommented to make PeopleModel available in the view level
				//Note: end WeekModel update
				var pathCA = oEvent.oSource.oPropagatedProperties.oBindingContexts.PeopleModel.sPath
				.split("/")[2];
				var data = oEvent.oSource.oPropagatedProperties.oBindingContexts.PeopleModel.oModel.oData.Days[pathCA];
				var currentStatus = data.Status;
				this.switched = oEvent.oSource;
				// set the rejection status to 'A' or 'R' based on the
				// current status value
				var newStatus = (currentStatus === "A") ? "R" : "A";
				this.status = currentStatus;
				data.Status = newStatus;
				var model = this.getView().getModel("PeopleModel").oData;
				model.selectedPath = pathCA;
				this.getView().getModel("PeopleModel").oData = model;

				if (newStatus === "A") {
					data.RejectionReason = "";
					data.RejectionReasonText = "";
					oEvent.oSource.oPropagatedProperties.oBindingContexts.WeekModel.oModel.oData.Days[pathCA] = data;
				} else {
					// open the rejection dialog
					this.oDialog.open();
				}
			},
			/**
			 * @public [getHeaderFooterOptions Define header & footer
			 *         options]
			 */
			getHeaderFooterOptions : function() {
				var that = this;
				return {
					sI18NDetailTitle : "TSA_APP",
					oEditBtn : {
						sI18nBtnTxt : "TSA_SUBMIT",
						onBtnPressed : function(evt) {
							that.openDialog(evt);
						}
					},
					oAddBookmarkSettings : {
						title : that.oBundle.getText("TSA_APP"),
						icon : "sap-icon://entry-request"
					},
					onBack : jQuery.proxy(function() {
						// Check if a navigation to master is the
						// previous entry in the history
						var sDir = sap.ui.core.routing.History
						.getInstance().getDirection(
								this.oRouter.getURL("master"));
						if (sDir === "Backwards") {
							window.history.go(-1);
						} else {
							// we came from somewhere else - create the
							// master view
							this.oRouter.navTo("master");
						}
					}, this)

				};
			},
			/**
			 * @private [openDialog confirmation dialog to approve the
			 *          time records]
			 * @param oEvent -
			 *            event object
			 */
			openDialog : function(event) {
				var that = this.self;

				var text_1 = this.oBundle.getText("TSA_CONF");
				var selectedtype = this.selection;
				// provide your callback function, so that you can get
				// informed if the enduser confirms or cancels the
				// dialog
				var fnClose = function(oResult) {
					if (oResult) {

						if (oResult.isConfirmed == true) {
							if (selectedtype === "Employee")
								that.peopleSubmit();
							else
								that.costSubmit();
						}
					}
				};

				// open the confirmation dialog
				sap.ca.ui.dialog.confirmation.open({
					question : text_1,
					title : this.oBundle.getText("TSA_CONF_HEADER"),
					confirmButtonLabel : this.oBundle
					.getText("TSA_ACCEPT")
				}, jQuery.proxy(fnClose, this));

			},
			/**
			 * @private [peopleSubmit approve the time records for
			 *          employee]
			 */
			peopleSubmit : function() {
				var str = "cats='";
				var sendData = this.getView().getModel("DetailModel").oData;

				for ( var i = 0; i < sendData.Weeks.length; i++) {
					var res = sendData.Weeks[i].Days;
					for ( var j = 0; j < res.length; j++) {
						str += sendData.Pernr + "," + res[j].Counter+ "," + res[j].Status + ","+ res[j].RejectionReason + "/";
					}
				}
				str += "'";
				var collection = "Cats_Action?" + str;

				/*
				 * success handler,navigate to master -reload the list
				 */
				var onRequestSuccess = function(oData, oResponse) {
					hcm.mgr.approve.timesheet.utility.Parser
					.setCachedData(oData);
					sap.ca.ui.message.showMessageToast(this.oBundle
							.getText("CATS_SUCCESS_MESSAGE"));
					this.self.oRouter.navTo("master");
				};
				/*
				 * failure handler
				 */
				var onRequestFailed = function(oError) {
					//Note:2052226 (error modifcation)
					/*
					sap.ca.ui.message.showMessageBox({
						type : sap.ca.ui.message.Type.ERROR,
						message : oError.message,
						details : oError.response.body
					});
					 */
					this.processError(oError);
					//Note: end 2052226 (error modifcation)
				};

				// make post service call
				this.oDataModel.create(collection, null, null, jQuery
						.proxy(onRequestSuccess, this), jQuery.proxy(
								onRequestFailed, this));

			},
			/**
			 * @private [costSubmit approve the time records for cost
			 *          assignment view]
			 */
			costSubmit : function() {

				var str = "cats='";
				var sendData = this.getView().getModel("DetailModel").oData;

				for ( var i = 0; i < sendData.Peoples.length; i++) {
					var res = sendData.Peoples[i].Days;
					for ( var j = 0; j < res.length; j++) {
						str += sendData.Peoples[i].Pernr + ","+ res[j].Counter + "," + res[j].Status+ "," + res[j].RejectionReason + "/";
					}
				}
				str += "'";
				var collection = "Cats_Action?" + str;

				/*
				 * success handler,navigate to master -reload the list
				 */
				var onRequestSuccess = function(oData, oResponse) {
					hcm.mgr.approve.timesheet.utility.Parser
					.setCachedData(null);
					sap.ca.ui.message.showMessageToast(this.oBundle
							.getText("CATS_SUCCESS_MESSAGE"));
					this.self.oRouter.navTo("master");
				};
				/*
				 * failure handler
				 */
				var onRequestFailed = function(oError) {
					//Note: 2052226 (error modifcation)
					/*
					sap.ca.ui.message.showMessageBox({
						type : sap.ca.ui.message.Type.ERROR,
						message : oError.message,
						details : oError.response.body
					});
					 */
					this.processError(oError);
					//Note: end 2052226 (error modifcation)
				};

				// make post service call
				this.oDataModel.create(collection, null, null, jQuery
						.proxy(onRequestSuccess, this), jQuery.proxy(
								onRequestFailed, this));
			},
			/**
			 * @public [isMainScreen describe whether this view is the main detail (S3) screen or a screen on deeper hierarchy level]
			 */
			isMainScreen : function(){
				return true;
			},

			//Processes the error    								Note: 2052226 (error modifcation)
			processError : function(oError) {

				var errorBody = jQuery.parseJSON(oError.valueOf().response.body);
				var errorValue = errorBody.error.message.value;
				var messageDetails = "";
				var innerError = errorBody.error.innererror;
				var length = innerError.errordetails.length;
				for(var i=0 ;i<length; i++){
					messageDetails = messageDetails + innerError.errordetails[i].message + "\n";
				}
				sap.ca.ui.message.showMessageBox({
					type : sap.ca.ui.message.Type.ERROR,
					message : errorValue,
					details : messageDetails
				});

			},
			//Note: end 2052226 (error modifcation)
		});