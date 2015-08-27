/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");
jQuery.sap.require("cus.crm.mycalendar.util.Conversions");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.ExpansibleFeedListItem");
jQuery.sap.require("cus.crm.mycalendar.util.Schema");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("cus.crm.mycalendar.view.AppointmentDetail", {
	
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created. Can be used to
	 * modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 */
	onInit : function() {
		sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit.call(this);
		
		if(!this.oApplicationFacade.getApplicationModel("customizing")){
			cus.crm.mycalendar.util.Util.initCustomizingModel(this);
		}
		
	
		
		var oControllers = new sap.ui.model.json.JSONModel({detailController : this});						
		this.oApplicationFacade.setApplicationModel("detailController",oControllers);
		
		this.oModel = this.oApplicationFacade.getODataModel();
		this.isMock = this.oApplicationFacade.isMock();
		this.getView().setModel(this.oModel);
		this.followUpButton=this.byId("followup");
		var sBackendVersion = cus.crm.mycalendar.util.Schema._getServiceSchemaVersion(this.oModel,"Appointment");
		if(parseFloat(sBackendVersion) >= 3){
			this.followUpButton.setVisible(true);
		}
		else{
			this.followUpButton.setVisible(false);
		}
		
		if(parseFloat(sBackendVersion) >= 4){
			this.byId('transactionHistoryData').setVisible(true);
		    this.getView().byId("messages").setVisible(true);
		}
		else
			{
			this.byId('transactionHistoryData').setVisible(false);
			// error handling button interoperability
		      this.getView().byId("messages").setVisible(false);
			
			}

		this.oBundle = this.oApplicationFacade.getResourceBundle();
		this.marginStyle = jQuery.device.is.phone ? "sapUiSmallMargin" : "sapUiMediumMargin";
		this.byId("ohdetail").addStyleClass(this.marginStyle);
		
		//for error handling fragment dialog
		this.showErrorMsgFragment = sap.ui.xmlfragment(this.createId("show_Error_Msg_Fragment"),
                "cus.crm.mycalendar.view.ShowErrorMsg",this);
		

		// navigation call back
		this.oRouter.attachRouteMatched(function(oEvent) {
			jQuery.sap.log.info("### nav target:  " + oEvent.getParameter("name"));
			this.sBackendVersion = cus.crm.mycalendar.util.Schema._getServiceSchemaVersion(this.oModel,"Appointment");
			if (oEvent.getParameter("name") === "appointment") {
				this.Context = "/AppointmentSet(guid'" + oEvent.getParameter("arguments").AppointmentID + "')";

				var that = this;
				// closing doc history panel expansion
				if(this.byId("transactionHistoryData").setExpanded)
					 this.byId("transactionHistoryData").setExpanded(false);
				// adapt context for mock
				if (this.isMock){
					this.Context = "/AppointmentSet(Guid='" + oEvent.getParameter("arguments").AppointmentID + "')";
				}
				
				var sExpand = "Attendee,AccountRel/Logo,AppointmentToAttachment";

                 if(parseFloat(that.sBackendVersion) >=4) {

                        sExpand += ",DocumentHistory,AppointmentLogSet";
                }

					
				// read all data on this screen
				this.oModel.createBindingContext(this.Context, "", {
						expand : sExpand
				}, function(oContext) {
						that.getView().bindElement(that.Context);
						if(parseFloat(that.sBackendVersion) >=4) {
							var appList= that.getView().getBindingContext().getObject().AppointmentLogSet.__list;
							var errcount=appList.length;
							if (errcount != 0) {
								that.getView().byId("messages").setEnabled(true);
							} else
								that.getView().byId("messages").setEnabled(false);
						}
						that.onDataReceived();
				}, true);
				
				
				var oStartupParameter = this.getView().getModel("startupParameters");
				if (oStartupParameter && oStartupParameter.oData) {
					if (oStartupParameter.oData.parameters) {
						for ( var param in oStartupParameter.oData.parameters) {	
						}
					}
					delete oStartupParameter.oData.parameters[param];
				}
				
				this.getView().byId("delbut").setVisible(true);
				this.getView().byId("followup").setVisible(true);
			}
		
			
			
			
		}, this);
		
		
	},

	onDataReceived : function() {
		var sPath = this.Context;
		var oData = this.getView().getModel().getData(sPath, null, true);
		if (oData) {
			// success read
			// construct attendees and account logo
			// Hide Process Type description, in case if it is null
			if (oData.ProcessTypeDescription == null){
				this.getView().byId("ProcessTypeDescription").setVisible(false);
			}
			else{
				//HACK: not honoring the oData binding
				
				this.byId("ProcessTypeDescription").setText(cus.crm.mycalendar.util.Conversions.formatTypeTxt(oData.ProcessTypeDescription));
				
			}
			this.setAttendees_AccountLogo(oData);
			// get attachments
			this.getAttachments(oData.AppointmentToAttachment);
			//get DocumentHistory
			if(parseFloat(this.sBackendVersion) >=4) {
				this.setDocumentHistory(oData);
			}
		} else {
			// error read / path does not exist
			this.getView().unbindElement();
			this.clearAttendees_AccountLogo();
			this.clearAttachments();
		}
	},

	onBack : function() {
		
		var oHistory = sap.ui.core.routing.History.getInstance();
		var sPreviousHash=oHistory.getPreviousHash();
		
		if(sPreviousHash==""){
			window.history.back();
		}
		else 
		if(sPreviousHash){
		 if(sPreviousHash.search("appointment")!==-1){
			 window.history.back();
			// window.history.go(-2);
		}
		
		else
		window.history.go(-2);
		 }
		else
			window.history.back();
		
	},
	
	getDateParameterfromDate : function(d) {
		// format: Date --> yyymmdd
		var sDay = d.getDate().toString();
		sDay = (sDay.length === 1) ? "0" + sDay : sDay;
		var sMonth = d.getMonth() + 1; // Months are zero based
		sMonth = sMonth.toString();
		sMonth = (sMonth.length === 1) ? "0" + sMonth : sMonth;
		var sYear = d.getFullYear();
		var sDate = "" + sYear + sMonth + sDay;
		return sDate;
	},

	// edit button handler - navigate to edit screen
	onUpdate : function(oEvent) {
	//	var bc = oEvent.oSource.getBindingContext().getPath();
		var bc = this.Context ; 
		var sUUID = this.oModel.getProperty(bc).Guid;
		
		var oModel = this.oModel;
		
		var that = this;
		
		var oCUS = cus.crm.mycalendar.util.Schema;
		
		if(parseFloat(oCUS._getServiceSchemaVersion(this.oModel,"Appointment")) >= 3){
		
		oModel.read("EditAuthorizationCheck", null, {
			ObjectGuid : oModel.formatValue(sUUID,
			"Edm.Guid")},
				false, function(oData, resp){
					if(resp.data.EditAuthorizationCheck.ActionSuccessful == "X"){
						that.oRouter.navTo("editappointment", {AppointmentID : sUUID}, false); 
					}
					else{
						//cus.crm.mycalendar.util.Util.showErrorMessagePopup(resp.data.EditAuthorizationCheck.Message);
						sap.ca.ui.message.showMessageBox({
							type : sap.ca.ui.message.Type.ERROR,
							message : resp.data.EditAuthorizationCheck.Message,
							details : null
						});
					}		
				},null);
		}
		else{
			this.oRouter.navTo("editappointment", {AppointmentID : sUUID}, false); 
		}

	},

	// delete button handler - confirmation popup
	onDelete : function(oEvent) {
		// get the entity to delete
		var oContext = this.Context;
		var fnClose = jQuery.proxy(function(oResult) {
			if (oResult.isConfirmed) {
				this.deleteAppointment(oContext);
			}
		}, this);

		var oDelText = this.oBundle.getText("view.Appointment.deleteTitle");
		var oDelInstruction = this.oBundle.getText("view.Appointment.deleteInstruction");
		var oDelYes = this.oBundle.getText("view.Appointment.deleteYes");

		sap.ca.ui.dialog.confirmation.open({
			question : oDelInstruction,
			showNote : false,
			title : oDelText,
			confirmButtonLabel : oDelYes
		}, fnClose);
	},
	
	onFollowup : function(oEvent) {

		var that = this;
		this._actionSheet = new sap.m.ActionSheet({
			// title : "Choose Your Action",
			// showCancelButton: true,
			placement : sap.m.PlacementType.Top,

			// Adding create an appointment / task buttons

			buttons : [
					new sap.m.Button({
						text : this.getView().getModel("i18n")
								.getProperty("Appointment"),
						press : function(evt) {

							that.navToAppointmentDialog(evt);

						},

					}),
					new sap.m.Button({
						text : this.getView().getModel("i18n")
								.getProperty("Task"),
						press : function(evt) {

							that.navToTaskDialog(evt);
						},

					}),

					new sap.m.Button({
						text : this.getView().getModel("i18n")
								.getProperty(
										"Opportunity"),
						press : function(evt) {
							that.navToOpptDialog(evt);

						},

					}),

			]

		});
		
		//EXTENSION POINT to be able to extend follow up action list
		/**
		 * @ControllerHook extHookHandleOpen is the controller hook that provides for extension of newly added follow up buttons.
		 *                                   
		 * @callback cus.crm.mycalendar.AppointmentDetail.controller~extHookHandleOpen
		 * @param {object}
		 *           oEvent
		 * @return {void}
		 */
		if (this.extHookHandleOpen){
			this.extHookHandleOpen(oEvent);
		}

		this._actionSheet.openBy(oEvent.getSource());

	},

	
	navToAppointmentDialog : function(oEvent) {

		var oModel = this.getView().getModel();
		var oHeader = this.oModel.getContext("/" + this.sPath)
				.getObject();
		// this.headerGuid = oHeader.Guid;
		// this.transactionType = oHeader.ProcessType;

		// var oGuid =
		// this.byId('info').getModel('json').getData().Guid;
		// var oTransType =
		// this.byId('info').getModel('json').getData().ProcessType;
		var apptData;
		/*oModel.read("TransactionTypeSet", null, null, false,
				function(oData, resp) // [
										// "$filter=ProcessType
										// eq '" + pType+ "'" ]
				{
					apptData = {
							TransactionTypeSet : resp.data.results
					};

				});*/
		var bc = this.Context;
		var oGuid = this.oModel.getProperty(bc).Guid;
		var oTransType = this.oModel.getProperty(bc).TransactionType;
		
		

		
		oModel.read("AppFollowupTransTypes" ,
				null, {
					Guid : oModel.formatValue(oGuid,
					"Edm.Guid"),
			TransactionType : oModel.formatValue(
					oTransType,
					"Edm.String")
		}, false, function(oData, resp)						// eq '" + pType+ "'" ]
				{
					apptData = {
							TransactionTypeSet : resp.data.results
					};

				});
		this.appointmentFlag = true;
		if(apptData.TransactionTypeSet.length == 0)
		{
			 sap.ca.ui.message.showMessageBox({
		            type: sap.ca.ui.message.Type.ERROR,
		            message: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("view.Appointment.FOLLOWUPERROR")
		            
		        });
			 this.appointmentFlag = false;
		}
		else if (apptData.TransactionTypeSet.length == 1) {
			this.onlyOneProcessType = true;
			this.processType = apptData.TransactionTypeSet[0].ProcessTypeCode;
			this.ProcessTypeDescription = apptData.TransactionTypeSet[0].Description;
			this.PrivateFlag = apptData.TransactionTypeSet[0].PrivateFlag;
			this.selectProcess();

		} else {

			this.oActionSheet = sap.ui
					.xmlfragment(
							"cus.crm.mycalendar.view.ProcessTypeDialog",

							this);
			this.oActionSheet.setModel(this.getView().getModel(
					"i18n"), "i18n");
			var jsonModel = new sap.ui.model.json.JSONModel();
			jsonModel.setData(apptData);
			this.oActionSheet.setModel(jsonModel, "json");
			this.oActionSheet._searchField
					.setPlaceholder(sap.ca.scfld.md.app.Application
							.getImpl().getResourceBundle()
							.getText("SEARCH"));
			this.oActionSheet._list
					.setGrowingScrollToLoad(true);

			this.oActionSheet._dialog
					.setVerticalScrolling(true);
			this.oActionSheet.open();

		}

		// setting appointment flag to navigate to Appointment
		// application

	},
	navToTaskDialog : function(oEvent) {

		var oModel = this.getView().getModel();

		var bc = this.Context;
		var oGuid = this.oModel.getProperty(bc).Guid;
		var oTransType = this.oModel.getProperty(bc).TransactionType;
		var taskData;
		oModel.read("TaskFollowupTransTypes", null, {
			Guid : oModel.formatValue(oGuid,
			"Edm.Guid"),
	TransactionType : oModel.formatValue(
			oTransType,
			"Edm.String")
},
				false, function(oData, resp) // [
												// "$filter=ProcessType
												// eq '" +
												// pType+ "'" ]
				{
					taskData = {
							TransactionTypeSet : resp.data.results
					};

				});

		this.taskFlag = true;
		if(taskData.TransactionTypeSet.length == 0)
		{
			 sap.ca.ui.message.showMessageBox({
		            type: sap.ca.ui.message.Type.ERROR,
		            message: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("view.Appointment.FOLLOWUPERROR")
		            
		        });
			 this.taskFlag = false;
		
		}

		else if (taskData.TransactionTypeSet.length == 1) {
			this.onlyOneTaskProcessType = true;
			this.processType = taskData.TransactionTypeSet[0].ProcessTypeCode;
			this.ProcessTypeDescription = taskData.TransactionTypeSet[0].Description; 
			this.selectProcess();
		} else {
			this.oActionSheet = sap.ui
					.xmlfragment(
							"cus.crm.mycalendar.view.ProcessTypeDialog",

							this);
			var jsonModel = new sap.ui.model.json.JSONModel();
			jsonModel.setData(taskData);
			this.oActionSheet.setModel(jsonModel, "json");

			this.oActionSheet._searchField
					.setPlaceholder(sap.ca.scfld.md.app.Application
							.getImpl().getResourceBundle()
							.getText("SEARCH"));
			this.oActionSheet._list
					.setGrowingScrollToLoad(true);

			this.oActionSheet._dialog
					.setVerticalScrolling(true);

			this.oActionSheet.open();

			// setting appointment flag to navigate to
			// Appointment application

		}
	},
	navToOpptDialog : function(oEvent) {

		var oModel = this.getView().getModel();
		var bc = this.Context;
		var oGuid = this.oModel.getProperty(bc).Guid;
		var oTransType = this.oModel.getProperty(bc).TransactionType;
		var opptData;
		oModel.read("OpptFollowupTransTypes" ,
				null, {
					Guid : oModel.formatValue(oGuid,
					"Edm.Guid"),
			TransactionType : oModel.formatValue(
					oTransType,
					"Edm.String")
		}, false, function(oData, resp) // [
															// "$filter=ProcessType
															// eq
															// '" +
															// pType+
															// "'"
															// ]
				{
					opptData = {
							TransactionTypeSet : resp.data.results
					};

				});
		this.oppFlag = true;
		if(opptData.TransactionTypeSet.length == 0)
		{
			 sap.ca.ui.message.showMessageBox({
		            type: sap.ca.ui.message.Type.ERROR,
		            message: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("view.Appointment.FOLLOWUPERROR")
		            
		        });
			 this.oppFlag = false;
		
		}
		else if (opptData.TransactionTypeSet.length == 1) {
			this.onlyOneOppProcessType = true;
			this.processType = opptData.TransactionTypeSet[0].ProcessTypeCode;
			this.ProcessTypeDescription = opptData.TransactionTypeSet[0].Description;
			this.selectProcess();

		} else {

			this.oActionSheet = sap.ui
					.xmlfragment(
							"cus.crm.mycalendar.view.ProcessTypeDialog",

							this);
			this.oActionSheet.setModel(this.getView().getModel(
					"i18n"), "i18n");
			var jsonModel = new sap.ui.model.json.JSONModel();
			jsonModel.setData(opptData);
			this.oActionSheet.setModel(jsonModel, "json");
			this.oActionSheet._searchField
					.setPlaceholder(sap.ca.scfld.md.app.Application
							.getImpl().getResourceBundle()
							.getText("SEARCH"));
			this.oActionSheet._list
					.setGrowingScrollToLoad(true);
			this.oActionSheet._dialog
					.setVerticalScrolling(true);
			this.oActionSheet.open();

		}
	},
	cancelProcess: function(oEvent) {
		this.oppFlag = false;
		this.taskFlag = false;
		this.appointmentFlag = false;
	},
	selectProcess : function(oEvent) {

		// Getting context path
		var bc = this.Context;

		var headerGuid = this.oModel.getProperty(bc).Guid;
		var sPath = "/AppointmentSet(guid'" + headerGuid + "')";

		// common parameters from opportunity to appointment
		// console.log("title="+this.byId('opportunityHeader').getModel('json').getData().Description);
		var appointmentId = this.oModel.getProperty(bc).Id;
		var status = this.oModel.getProperty(bc).StatusTxt;
		var StartDate = this.oModel.getProperty(bc).FromDate;
		var AccountId = this.oModel.getProperty(bc).Account;
		var AccountName = this.oModel.getProperty(bc).AccountTxt;
		var ContactId = this.oModel.getProperty(bc).Contact;
		var ContactName = this.oModel.getProperty(bc).ContactTxt;
		var title = this.oModel.getProperty(bc).Description;
		var Guid = this.oModel.getProperty(bc).Guid;
		var Responsible=this.oModel.getProperty(bc).Responsible;
		var ResponsibleTxt=this.oModel.getProperty(bc).ResponsibleTxt;
		// console.log("AccountName"+AccountName+
		// "ContactName"+ContactName+"opportunity_id"+opportunityId+"status"+status+"StartDate"+StartDate+"ClosingDate"+ClosingDate);
		if (!(this.onlyOneOppProcessType
				|| this.onlyOneTaskProcessType || this.onlyOneProcessType))

		{
			var selectedItem = oEvent
					.getParameter("selectedItem");
			if (selectedItem) {
				this.processType = selectedItem
						.data("ProcessTypeCode");
				this.ProcessTypeDescription = selectedItem
				.data("ProcessTypeDescription");
				this.PrivateFlag = selectedItem
				.data("PrivateFlag");
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
			/*
			 * var ctx = this.oModel.getProperty(bc).Guid;
			 * this.oRouter.navTo("followupappointment", {
			 * contextPath : ctx, processType :
			 * this.processType, }, !jQuery.device.is.phone);
			 * 
			 * this.appointmentFlag=false;
			 */
			var bc = this.Context;
			var sUUID = this.oModel.getProperty(bc).Guid;
			// this.oRouter.navTo("editappointment",
			// {AppointmentID : sUUID}, false);
			sap.ca.ui.utils.busydialog.requireBusyDialog();
			this.PrivateFlag=false;
			this.oRouter.navTo("followupappointment", {
				// contextPath : cPath,
				processType : this.processType,
				AppointmentGuid : sUUID,
				privateFlag : this.PrivateFlag
			}, true);
			this.appointmentFlag = false;
			this.onlyOneProcessType = false;
			/*var message = this.oBundle.getText(
			"view.Appointment.followupsuccess");
			 sap.m.MessageToast.show(message, {
			   closeOnBrowserNavigation : false
			});*/
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
		}

		else if (this.oppFlag) {

			// *XNav (2) generate cross application link
			var toApp = this.oCrossAppNavigator
					&& this.oCrossAppNavigator
							.hrefForExternal({
								target : {
									/*  semanticObject :
									"Opportunity",
									 action: "Master"*/
									semanticObject : "Opportunity",
									action : "manageOpportunity"
										
								},
								// TODO
								 appSpecificRoute :[
													"&", "fulScrCreateFollowup",
													this.Context.substr(1), this.processType ]
													.join("/"),
								params : {
									"createFromAppt" : "X",
									"AccountName" : AccountName,
									"ContactName" : ContactName,
									"processType" : this.processType,
									"selectprocess_oEvent" : oEvent,
									"appointmentId" : appointmentId,
									"StartDate" : StartDate,
									"title" : title,
									"appointmentGuid": Guid,
									"Responsible":Responsible,
									"ResponsibleTxt":ResponsibleTxt,
									"AccountId":AccountId,
									"ContactId":ContactId,
									"ProcessTypeDescription": this.ProcessTypeDescription
								// "itemPaths" : aItemPaths
								}
							}) || "";

			this.oppFlag = false;
			this.onlyOneOppProcessType = false;
			// Navigate to the target
			window.location = toApp;
			/*var message = this.oBundle.getText(
					"view.Appointment.followupsuccess");
	     sap.m.MessageToast.show(message, {
		   closeOnBrowserNavigation : false
	});*/

		}

		else if (this.taskFlag) {
			// *XNav (2) generate cross application link
			var toApp = this.oCrossAppNavigator
					&& this.oCrossAppNavigator
							.hrefForExternal({
								target : {
									 semanticObject : "Task",
									 action: "manageTasks"
									/*semanticObject : "Task",
									action : "Master"*/
								},
								params : {
									"createFromAppt" : "X",
									"AccountId" : AccountId,
									"ContactId" : ContactId,
									"appointmentId" : appointmentId,
									"appointmentGuid": Guid,
									"title" : title,
									// "itemPaths" : aItemPaths
								},
								appSpecificRoute : [ "&",
										"newTask",
										this.processType ]
										.join("/")
							}) || "";

			this.taskFlag = false;
			this.onlyOneTaskProcessType = false;
			// Navigate to the target
			window.location = toApp;
			//
			/*var message = this.oBundle.getText(
			"view.Appointment.followupsuccess");
			 sap.m.MessageToast.show(message, {
			   closeOnBrowserNavigation : false
			});*/
		}

	},
	searchProcess : function(oEvent){
		var sValue = oEvent.getParameter("value");
		if (sValue !== undefined) {
			// apply the filter to the bound items, and the Select Dialog will update
			oEvent.getParameter("itemsBinding").filter([new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, sValue)]);
		}
	},

	/*selectProcess : function(oEvent) {
		if(!this.onlyOneProcessType)
		{
		var selectedItem = oEvent.getParameter("selectedItem");
		if (selectedItem) {
			this.processType= selectedItem.data("ProcessTypeCode");
		}
		}

		//this.getView().getController().setBtnEnabled("sort", false);
		//this.getView().getController().setBtnEnabled("BTN_S2_ADD", false);
		
		//Enable footer buttons in Set ListItem
		//this.firstCall="X";
		//sap.ui.getCore().byId('ProcessDialog').close();
	
		
//		var oCreateDate = this.oCal.getSelectedDates()[0] || this.oCal.getCurrentDate();
//		if (typeof oCreateDate === "string") {
//			oCreateDate = new Date(oCreateDate);
//		}
//		var sCreateDate = this.getDateParameterfromDate(oCreateDate);
//		
		var bc = this.Context ; 
		var sUUID = this.oModel.getProperty(bc).Guid;
		//this.oRouter.navTo("editappointment", {AppointmentID : sUUID}, false); 
		sap.ca.ui.utils.busydialog.requireBusyDialog();
		this.oRouter.navTo("followupappointment", {
			//contextPath : cPath,
			processType : this.processType,
			AppointmentID : sUUID
		},true);
		
		this.onlyOneProcessType=false;
		sap.ca.ui.utils.busydialog.releaseBusyDialog();
	},
	*/
	onAccount : function() {
		// show the business card of an account
		var oModel = this.getView().getModel();
		var oContext = this.getView().getBindingContext();
		var oDataEntry = oContext.getObject();
		var sPath = "/AccountCollection('" + oDataEntry.Account + "')";
		var sURLparameters = "$expand=MainAddress,MainContact/WorkAddress,Logo";
		if (this.isMock){
			sPath = "/AccountCollection(accountID='" + oDataEntry.Account + "')";
			sURLparameters = "";
		}
		var that = this;
		oModel.read(sPath, null, [sURLparameters], true, function(odata, response) {
			jQuery.sap.log.info("oData account response");
			
			var fnCallbackNavParaComp = jQuery
			.proxy(
					function(
							oEvent) {

						var oNavConfig = {};
						oNavConfig.target = {};
						oNavConfig.target.semanticObject = "Account";
						oNavConfig.target.action = "MyAccounts&/detail/AccountCollection('" + oDataEntry.Account + "')";
//						oNavConfig.params = {
//							accountID : this.accountNum
//						};
						this.navToOtherApp = true;
						
						return oNavConfig;

					},
					this);

			// initializing the attributes used for the business card
			var oTitle = that.oBundle.getText("view.Appointment.account_title");
			var oCompanyAddress = "";
			var oCompanyPhone = "";
			var oContactName = "";
			var oMobilePhone = "";
			var oOfficePhone = "";
			var oEmailAdress = "";
			var oCompanyName = "";
			var oLogo = "";

			if (odata.MainAddress) {
				oCompanyAddress = odata.MainAddress.address;
				oCompanyPhone = odata.MainAddress.phone;
			}
			if (odata.MainContact) {
				oContactName = odata.MainContact.fullName;
				if (odata.MainContact.WorkAddress !== null) {
					oMobilePhone = odata.MainContact.WorkAddress.mobilePhone;
					oOfficePhone = odata.MainContact.WorkAddress.phone;
					oEmailAdress = odata.MainContact.WorkAddress.email;
				}
			}
			if (odata.name1 && odata.name1 !== "") {
				oCompanyName = odata.name1;
			}
			// get account logo
			if (odata.Logo && odata.Logo.__metadata) {
				// defaul account log tbd
				var oMetadata = cus.crm.mycalendar.util.Conversions.formatPhotoUrl(odata.Logo.__metadata.media_src);
				oLogo = cus.crm.mycalendar.util.Conversions.urlConverter(oMetadata);
			}
			var oCompConfig = {
				title : oTitle,
				imgurl : oLogo,
				companyname : oCompanyName,
				companyphone : oCompanyPhone,
				companyaddress : oCompanyAddress,
				maincontactname : oContactName,
				maincontactmobile : oMobilePhone,
				maincontactphone : oOfficePhone,
				maincontactemail : oEmailAdress,
				beforeExtNav:fnCallbackNavParaComp
			};
			// get control that triggers the BusinessCard
			var oControl = that.getView().byId("accountField");
			// call 'Business Card' reuse component
			var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(oCompConfig);
			oCompanyLaunch.openBy(oControl);
		}, function(oError) {
			jQuery.sap.log.error("oData request for Account failed");
		});
	},

	onExtAttendee : function(oEvt) {
		// show the business card of an external attendee		
		var oContext = this.getView().getBindingContext();
		var appoitmentAccount=oContext.getObject().Account;
        var externalPartnerAccount=oEvt.getSource().AccountNo;
        if(appoitmentAccount==externalPartnerAccount||externalPartnerAccount==""){

		if (oEvt.getSource().PartnerNo !== '') {
			var oAccountContact = "contactID='" + oEvt.getSource().PartnerNo + "',accountID='" + appoitmentAccount;
			var sPath = "/ContactCollection(" + oAccountContact + "')";
			var sURLparameters = "$expand=WorkAddress,Account/MainAddress,Photo";
			if (this.isMock){
				sURLparameters = "";
			}
			var oSource = oEvt.getSource();
			var that = this;
			this.oModel.read(sPath, null, [sURLparameters], true, function(odata, response) {
				jQuery.sap.log.info("oData account response");

				// initializing the attributes used for the business card
				var oJSON = new sap.ui.model.json.JSONModel(odata);
				// using JSON model is just a workaround since function is a key word in JS
				var oContactFunction = oJSON.getProperty("/function");
				var oTitle = that.oBundle.getText("view.Appointment.contact_title");
				var oContactMobile = "";
				var oContactPhone = "";
				var oContactEmail = "";
				var oCompanyAddress = "";
				var oCompanyName = "";
				var oContactName = "";
				var oPhoto = "";

				if (odata.WorkAddress) {
					oContactMobile = odata.WorkAddress.mobilePhone;
					oContactPhone = odata.WorkAddress.phone;
					oContactEmail = odata.WorkAddress.email;
				}
				if (odata.Account) {
					if (odata.Account.MainAddress) {
						oCompanyAddress = odata.Account.MainAddress.address;
					}
					if (odata.Account.name1 && odata.Account.name1 !== "") {
						oCompanyName = odata.Account.name1;
					}
				}
				if (odata.fullName && odata.fullName !== "") {
					oContactName = odata.fullName;
				}
				// get contact photo
				if (odata.Photo && odata.Photo.__metadata) {
					var oMetadata = cus.crm.mycalendar.util.Conversions.formatPhotoUrl(odata.Photo.__metadata.media_src);
					oPhoto = cus.crm.mycalendar.util.Conversions.urlConverter(oMetadata);
				}
				var oEmpConfig = {
					title : oTitle,
					name : oContactName,
					imgurl : oPhoto,
					department : oContactFunction,
					contactmobile : oContactMobile,
					contactphone : oContactPhone,
					contactemail : oContactEmail,
					contactemailsubj : "",
					companyname : oCompanyName,
					companyaddress : oCompanyAddress
				};
				// call 'Business Card' reuse component
				var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(oEmpConfig);
				oEmployeeLaunch.openBy(oSource);
			}, function(oError) {
				if(oError.response.body.search("Specify at least one number for the business partner")){
				var sMessage = sap.ca.scfld.md.app.Application.getImpl().AppI18nModel.getResourceBundle().getText("NOT_IN_MAIN_CONTACT");
	            sap.ca.ui.message.showMessageToast(sMessage);
			}else{
				
			jQuery.sap.log.error("oData request for Contact failed");
			}
		});
	
    }
    }
	else{
        var sMessage = sap.ca.scfld.md.app.Application.getImpl().AppI18nModel.getResourceBundle().getText("NOT_IN_MAIN_CONTACT");
        sap.ca.ui.message.showMessageToast(sMessage);
        
 }
	},

	onIntAttendee : function(oEvt) {
		// show the business card of an internal attendee

		if (oEvt.getSource().PartnerNo !== '') {
			var sPath = "/EmployeeCollection('" + oEvt.getSource().PartnerNo + "')";
			var sURLparameters = "$expand=WorkAddress,Company,Photo";
			if (this.isMock){
				sPath = "/EmployeeCollection(employeeID='" + oEvt.getSource().PartnerNo + "')";
				sURLparameters = "";
			}			
			var oSource = oEvt.getSource();
			var that = this;
			this.oModel.read(sPath, null, [sURLparameters], true, function(odata, response) {
				jQuery.sap.log.info("oData employee response");

				// initializing the attributes used for the business card
				var oTitle = that.oBundle.getText("view.Appointment.employee_title");
				var oEmployeeMobile = "";
				var oEmployeePhone = "";
				var oEmployeeEmail = "";
				var oEmployeeDepartment = "";
				var oCompanyAddress = "";
				var oCompanyName = "";
				var oEmployeeName = "";
				var oPhoto = "";

				if (odata.WorkAddress) {
					oEmployeeMobile = odata.WorkAddress.mobilePhone;
					oEmployeePhone = odata.WorkAddress.phone;
					oEmployeeEmail = odata.WorkAddress.email;
					oEmployeeDepartment = odata.WorkAddress.department;
					oCompanyAddress = odata.WorkAddress.address;
				}
				// get company name
				if (odata.Company && odata.Company.name1) {
					oCompanyName = odata.Company.name1;
				}
				if (odata.fullName && odata.fullName !== "") {
					oEmployeeName = odata.fullName;
				}
				// get employee photo
				if (odata.Photo && odata.Photo.__metadata) {
					var oMetadata = cus.crm.mycalendar.util.Conversions.formatPhotoUrl(odata.Photo.__metadata.media_src);
					oPhoto = cus.crm.mycalendar.util.Conversions.urlConverter(oMetadata);
				}
				var oEmpConfig = {
					title : oTitle,
					name : oEmployeeName,
					imgurl : oPhoto,
					department : oEmployeeDepartment,
					contactmobile : oEmployeeMobile,
					contactphone : oEmployeePhone,
					contactemail : oEmployeeEmail,
					contactemailsubj : "",
					companyname : oCompanyName,
					companyaddress : oCompanyAddress
				};
				// call 'Business Card' reuse component
				var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(oEmpConfig);
				oEmployeeLaunch.openBy(oSource);
			}, function(oError) {
				jQuery.sap.log.error("oData request for employee failed");
			});
		}
	},

	onContact : function() {
		// show the business card of an account contact
		var oModel = this.getView().getModel();
		var oContext = this.getView().getBindingContext();
		var oDataEntry = oContext.getObject();
		var oAccountContact = "";
		if (oDataEntry.Contact !== '') {	
			if (oDataEntry.ContactAccount !== '') {
// first to check whether the contact is already assigned to a certain account in the edit view. If yes, use this account
				oAccountContact = "contactID='" + oDataEntry.Contact + "',accountID='" + oDataEntry.ContactAccount;
			} else if (oDataEntry.Account !== '') {
// if no account is assigned to the contact, use the account of the appointment for the business card of the contact if such an account exists
				oAccountContact = "contactID='" + oDataEntry.Contact + "',accountID='" + oDataEntry.Account;
			} 
			if (oAccountContact !== '') {
				var sPath = "/ContactCollection(" + oAccountContact + "')";
				var sURLparameters = "$expand=WorkAddress,Account/MainAddress,Photo";
				if (this.isMock){
					sURLparameters = "";
				}
				var that = this;
				oModel.read(sPath, null, [sURLparameters], true, function(odata, response) {
				jQuery.sap.log.info("oData account response");
				var oJSON = new sap.ui.model.json.JSONModel(odata);
				
				var fnCallbackNavPara = jQuery
				.proxy(
						function(
								oEvent) {

							var oNavConfig = {};
							oNavConfig.target = {};
							oNavConfig.target.semanticObject = "ContactPerson";
							if (oDataEntry.ContactAccount !== '') {
							oNavConfig.target.action = "MyContacts&/display/ContactCollection(contactID='" + oDataEntry.Contact + "',accountID='" + oDataEntry.ContactAccount + "')";
							}
							else if (oDataEntry.Account !== '') {
								oNavConfig.target.action = "MyContacts&/display/ContactCollection(contactID='" + oDataEntry.Contact + "',accountID='" + oDataEntry.Account + "')";
							}
						
						this.navToOtherApp = true;
							
							return oNavConfig;

						},
						this);

				// initializing the attributes used for the business card
				var oTitle = that.oBundle.getText("view.Appointment.contact_title");
				// using JSON model is just a workaround since function is a key word in JS
				var oContactFunction = oJSON.getProperty("/function");
				var oContactMobile = "";
				var oContactPhone = "";
				var oContactEmail = "";
				var oCompanyAddress = "";
				var oCompanyName = "";
				var oContactName = "";
				var oPhoto = "";

				if (odata.WorkAddress !== null) {
					oContactMobile = odata.WorkAddress.mobilePhone;
					oContactPhone = odata.WorkAddress.phone;
					oContactEmail = odata.WorkAddress.email;
				}
				if (odata.Account !== null) {
					if (odata.Account.MainAddress !== null) {
						oCompanyAddress = odata.Account.MainAddress.address;
					}
					if (odata.Account.name1 !== null) {
						oCompanyName = odata.Account.name1;
					}
				}
				if (odata.fullName !== null && odata.fullName !== "") {
					oContactName = odata.fullName;
				}
				// get contact photo
				if (odata.Photo && odata.Photo.__metadata) {
					var oMetadata = cus.crm.mycalendar.util.Conversions.formatPhotoUrl(odata.Photo.__metadata.media_src);
					oPhoto = cus.crm.mycalendar.util.Conversions.urlConverter(oMetadata);
				}
				var oContactConfig = {
					title : oTitle,
					name : oContactName,
					imgurl : oPhoto,
					department : oContactFunction,
					contactmobile : oContactMobile,
					contactphone : oContactPhone,
					contactemail : oContactEmail,
					contactemailsubj : "",
					companyname : oCompanyName,
					companyaddress : oCompanyAddress,
					beforeExtNav:fnCallbackNavPara
				};
				// get control that triggers the BusinessCard
				var oControl = that.getView().byId("contactField");
				// call 'Business Card' reuse component
				var oContactLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(oContactConfig);
				oContactLaunch.openBy(oControl);
			}, function(oError) {
				jQuery.sap.log.error("oData request for Contact failed");
			});
		}
	  }	
	},

	onResponsible : function() {
		// show the business card of an employee responsible
		var oEvt;
		var oModel = this.getView().getModel();
		var oContext = this.getView().getBindingContext();
		var oDataEntry = oContext.getObject();
		if (oDataEntry.Responsible !== '') {
			var sPath = "/EmployeeCollection('" + oDataEntry.Responsible + "')";
			var sURLparameters = "$expand=WorkAddress,Company,Photo";
			if (this.isMock){
				sPath = "/EmployeeCollection(employeeID='" + oEvt.getSource().PartnerNo + "')";
				sURLparameters = "";
			}			
			var that = this;
			this.oModel.read(sPath, null, [sURLparameters], true, function(odata, response) {
				jQuery.sap.log.info("oData employee response");

				// initializing the attributes used for the business card
				var oTitle = that.oBundle.getText("view.Appointment.employee_title");
				var oEmployeeMobile = "";
				var oEmployeePhone = "";
				var oEmployeeEmail = "";
				var oEmployeeDepartment = "";
				var oCompanyAddress = "";
				var oCompanyName = "";
				var oEmployeeName = "";
				var oPhoto = "";

				if (odata.WorkAddress) {
					oEmployeeMobile = odata.WorkAddress.mobilePhone;
					oEmployeePhone = odata.WorkAddress.phone;
					oEmployeeEmail = odata.WorkAddress.email;
					oEmployeeDepartment = odata.WorkAddress.department;
					oCompanyAddress = odata.WorkAddress.address;
				}
				// get company name
				if (odata.Company && odata.Company.name1) {
					oCompanyName = odata.Company.name1;
				}
				if (odata.fullName && odata.fullName !== "") {
					oEmployeeName = odata.fullName;
				}
				// get employee photo
				if (odata.Photo && odata.Photo.__metadata) {
					var oMetadata = cus.crm.mycalendar.util.Conversions.formatPhotoUrl(odata.Photo.__metadata.media_src);
					oPhoto = cus.crm.mycalendar.util.Conversions.urlConverter(oMetadata);
				}
				var oEmpConfig = {
					title : oTitle,
					name : oEmployeeName,
					imgurl : oPhoto,
					department : oEmployeeDepartment,
					contactmobile : oEmployeeMobile,
					contactphone : oEmployeePhone,
					contactemail : oEmployeeEmail,
					contactemailsubj : "",
					companyname : oCompanyName,
					companyaddress : oCompanyAddress
				};
				// get control that triggers the BusinessCard
				var oControl = that.getView().byId("responsibleField");
				// call 'Business Card' reuse component
				var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(oEmpConfig);
				oEmployeeLaunch.openBy(oControl);
			}, function(oError) {
				jQuery.sap.log.error("oData request for employee failed");
			});
		}
	},
	
    // Document HIstory is selected
    setDocumentHistory : function(odata){
           
                  var dataResults = odata.DocumentHistory.results;
                  this.newResult = odata.DocumentHistory.results;
           var that = this;
           var tab = that
                        .getView()
                        .byId(
                                      "DocHistory_Tab");
           var dataLength =  odata.DocumentHistory.results.length;
           var dataOppo = {
                  AppointmentDocHistory : []
           };
           for (var i = 0; i < dataLength; i++) {
                  var oppo = dataResults[i];
                  dataOppo.AppointmentDocHistory
                               .push(oppo);
           }
           var jsonModel = new sap.ui.model.json.JSONModel();

           jsonModel.setData(dataOppo);
           tab.setModel(
                                      jsonModel,
                                      "json");

           

    },     
    
    navigateDocHistory : function(oEvent) {
           var transactionID = oEvent.getSource().getText();
           var ObjectType = "";
           var sGuid = "";

           for (var i = 0; i < this.newResult.length; i++) {
                  if (transactionID == this.newResult[i].ObjectId) {
                        ObjectType = this.newResult[i].ObjectType;
                        sGuid = this.newResult[i].Guid;
                        break;
                  }
           }
           // Inter app navigation
           var fgetService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
           this.oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");
           
     if (ObjectType === "BUS2000111") {
     
                  var toApp = this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ 
                         target: { 
                                semanticObject : "Opportunity", 
                                action: "manageOpportunity&/display/Opportunities(guid'" + sGuid + "')"
                         }
                  }) || "";
                  
             window.location = toApp ;
     
      
           
       } else if (ObjectType === "BUS2000125") {  //Task
             
                  var toApp = this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ 
                         target: { 
                                semanticObject : "Task", 
                                action: "manageTasks&/taskOverview/Tasks(guid'"+ sGuid +"')"
                         }
                  }) || "";
                  
             window.location = toApp ;
             
       } else if (ObjectType === "BUS2000126") {  //Activity
     	  
           var toApp = this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ 
   		target: { 
   			semanticObject : "Appointment", 
   			action: "myAppointments&/appointment/"+sGuid
   		}
   	}) || "";
       window.location = toApp ;

     }else if (ObjectType === "BUS2000108") {  //Lead
   	  
           var toApp = this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ 
   		target: { 
   			semanticObject : "Lead", 
   			action: "manageLead&/display/Leads(guid'" + sGuid + "')"
   		}
   	}) || "";
       window.location = toApp ;

     }

},


	setAttendees_AccountLogo : function(odata) {
		this.getView().byId("attContainer").setVisible(true);
		this.getView().byId("noteContainer").setVisible(true);
		this.getView().byId("note").removeAllFields();
		var extAttList = this.getView().byId("externalAtt");
		// reset extAttList
		extAttList.removeAllFields();
		extAttList.destroyLabel();
		var intAttList = this.getView().byId("internalAtt");
		// reset intAttList
		intAttList.removeAllFields();
		intAttList.destroyLabel();

		var attList = [];
		attList = odata.Attendee.results;
		var oAttNum = 0;
		var oCounterExt = 0;
		var oCounterInt = 0;
		var oHLExt = new sap.ui.layout.HorizontalLayout({
			allowWrapping : true
		});
		var oHLInt = new sap.ui.layout.HorizontalLayout({
			allowWrapping : true
		});
		if (attList && attList !== []) {
			// get positions of last external and last internal attendee
			// get total number of attendees with a fullname
			for ( var i = 0; i < attList.length; i++) {
				if (!attList[i].IntAttendee && attList[i].FullName !== "") {
					// this is an external attendee
					oCounterExt = i;
					oAttNum++;
				} else if (attList[i].IntAttendee && attList[i].FullName !== "") {
					// this is an internal attendee
					oCounterInt = i;
					oAttNum++;
				}
			}
			for ( var i = 0; i < attList.length; i++) {
				var fullName;
				if (!attList[i].IntAttendee && attList[i].FullName !== "") {
					// this is an external attendee
					if (i < oCounterExt) {
						// unicode \u00A0 as whitespace is valid for chome, IE and firefox
						fullName = attList[i].FullName + ";\u00A0";
					} else {
						fullName = attList[i].FullName;
					}
					var extAttName = new sap.m.Link({
						press : [this.onExtAttendee, this],
						text : fullName
					});
					// get ContactID/PartnerNo and AccountNo to be used in the business card for contacts
					extAttName.PartnerNo = attList[i].PartnerNo;
					extAttName.AccountNo = attList[i].AccountNo;
					oHLExt.addContent(extAttName);
					if (i === oCounterExt) {
						extAttList.addField(oHLExt);
						// only show "external" label if there is at least one external attendee
						extAttList.setLabel(new sap.m.Label({
							text : "{i18n>view.Appointment.external}"
						}));
					}
				} else if (attList[i].IntAttendee && attList[i].FullName !== "") {
					// this is an internal attendee
					if (i < oCounterInt) {
						fullName = attList[i].FullName + ";\u00A0";
					} else {
						fullName = attList[i].FullName;
					}
					var intAttName = new sap.m.Link({
						press : [this.onIntAttendee, this],
						text : fullName
					});
					// get EmployeeID/PartnerNo to be used in the business card for employees
					intAttName.PartnerNo = attList[i].PartnerNo;
					oHLInt.addContent(intAttName);
					if (i === oCounterInt) {
						intAttList.addField(oHLInt);
						// only show "internal" label if there is at least one internal attendee
						intAttList.setLabel(new sap.m.Label({
							text : "{i18n>view.Appointment.internal}"
						}));
					}
				}
			}
			if (oAttNum === 0) {
				// show no attendee container if there is no attendee at all
				this.getView().byId("attContainer").setVisible(false);
			}
			var oTitle = this.oBundle.getText("view.Appointment.additionalAttendeeNumber", [oAttNum]);
			this.getView().byId("formAtt").setTitle(oTitle);
		}
		if (odata.Note === "") {
			// show no note container if there is no note at all
			this.getView().byId("noteContainer").setVisible(false);
		} else {
			var oNote = new sap.ca.ui.ExpansibleFeedListItem({
				showIcon : false,
				maxLines : 5,
				text : odata.Note
			});
			this.getView().byId("note").addField(oNote);
		}

		// if there is an account logo, show it in the appointment header else show the default logo for appointments
		var oAppointmentHD = this.getView().byId("ohdetail");
		oAppointmentHD.setIcon("sap-icon://appointment");

		if (odata.AccountRel.results && odata.AccountRel.results[0] && odata.AccountRel.results[0].Logo) {
			var oMetadata = odata.AccountRel.results[0].Logo.__metadata;
			if (oMetadata) {
				var oLogo = cus.crm.mycalendar.util.Conversions.urlConverter(cus.crm.mycalendar.util.Conversions
						.formatPhotoUrl(oMetadata.media_src));
				oAppointmentHD.setIcon(oLogo);
			}
		}
	},

	clearAttendees_AccountLogo : function() {
		this.getView().byId("formAtt").setTitle(this.oBundle.getText("view.Appointment.attendeeDataNumber", ["0"]));
		this.getView().byId("externalAtt").removeAllFields();
		this.getView().byId("internalAtt").removeAllFields();
		var oAppointmentHD = this.getView().byId("ohdetail");
		oAppointmentHD.setIcon("sap-icon://appointment");
	},

	clearAttachments : function() {
		if (this.isMock){
			return;
		}
		var oDataEmpty = {
			results : []
		};
		var oAttView = this.byId("attachmentsView");
		var oAttCont = oAttView.getController();
		oAttCont.refresh("", oDataEmpty);
	},

	getAttachments : function(attachments) {
		if (this.isMock){
			return;
		}
		// trigger refresh in attachment view
		var oAttView = this.byId("attachmentsView");
		var oAttCont = oAttView.getController();
		oAttCont.refresh(this.Context, attachments);
	},

	deleteAppointment : function(sContextPath) {
		
	  //unbindElement needed here due to some strange effect of rereading before getting to success callback
		this.getView().unbindElement();
		
		if (this.isMock) {
			sap.ca.ui.message.showMessageToast("Not suppported in mock mode");
			// back navigation
			window.history.go(-1);
		} else {
			// single calls will be wrapped into batch by sapui5 v. 16
			this.oModel.remove(sContextPath, {
				fnSuccess : jQuery.proxy(this.successDelete, this),
				fnError : jQuery.proxy(this.errorSave, this)
			});
		}
	},

	successDelete : function(oData, response) {
		// Notify listeners for the event that appointment has been deleted.
		sap.ui.getCore().getEventBus().publish("cus.crm.mycalendar", "appointmentDeleted");

		// message toast
		var sMessage = this.oBundle.getText("view.Appointment.deletesuccess");
		sap.ca.ui.message.showMessageToast(sMessage);
	
		// back navigation
		// unbind model from views
		this.getView().unbindElement();
		this.clearAttendees_AccountLogo();
		this.clearAttachments();

		// navigate
		var h =  new sap.ui.core.routing.History.getInstance();
		var dir = h.getDirection(""); 
		if (dir && dir !== sap.ui.core.routing.HistoryDirection.Unknown ) { //} && h._aHistory.length > 0) {
			window.history.go(-1);
		} else {
			// navigate to calendar
			var sDate = this.getDateParameterfromDate(new Date());
			this.oRouter.navTo("week", {Date: sDate}, true);  	// overwrite url
		}
	},

	
	// callback method in error case
	errorSave : function(oError) {
		// bind element again, as we do not navigate away.
		this.getView().bindElement(this.Context, {
			expand : "Attendee,AccountRel/Logo,AppointmentToAttachment"
		});
		jQuery.sap.log.error("oData delete failed");
		cus.crm.mycalendar.util.Util.showErrorMessagePopup(oError);
	},

	// Format of "From" and "To" Time and Date in Detail view Object Header depends upon From and To are on same Date
	// (day)
	// For same day, 1st field is the full date and 2nd field is time from to.
	// For different days, first field is From time and full date, second field is To time and full date
	formatFromDateInHeader : function(fromDate, toDate, allDay) {

		var sDate = "";
		var fromDatetimeOffset;
		var toDatetimeOffset;		
		if (fromDate !== null && toDate !== null && allDay !== null) {

			if (typeof fromDate === "string") {

				if (fromDate.substring(0, 6) === "/Date(") {
					// for mockmode
					fromDate = fromDate.replace("/Date(", "").replace(")/", "");
					fromDate = parseInt(fromDate); // number ms
					fromDate = new Date(fromDate);
				} else {
					// datepicker issue -> maybe remove when fixed
					// Wed Sep 18 2013 00:00:00 GMT+0200 (W. Europe Daylight Time)
					fromDate = new Date(fromDate);
				}
			}

			if (typeof toDate === "string") {

				if (toDate.substring(0, 6) === "/Date(") {
					// for mockmode
					toDate = toDate.replace("/Date(", "").replace(")/", "");
					toDate = parseInt(toDate); // number ms
					toDate = new Date(toDate);
				} else {
					// datepicker issue -> maybe remove when fixed
					// Wed Sep 18 2013 00:00:00 GMT+0200 (W. Europe Daylight Time)
					toDate = new Date(toDate);
				}
			}
			// Make new dates for formatting. Keep original date from binding as they are so it is not necessary
			// to make assumptions on order of formatiing From- and To- Dates in the header.
			var fromDisDate = new Date(fromDate);
			var toDisDate = new Date(toDate);

			// In the case of allDay appointments, backend has no time set, just date. JS assumes this is UTC and
			// converts to the browsers time zone. Therefore as workaround, take away time offset.
			if (allDay) {
			// timestamp of all day is based in UTC + 0 in oData, so ensure that implicit time conversion
			// is offset to ensure correct DATE.
				fromDatetimeOffset = fromDisDate.getTimezoneOffset();
				toDatetimeOffset = toDisDate.getTimezoneOffset();
				
				fromDisDate.setTime( fromDisDate.getTime() + fromDatetimeOffset * 60 * 1000 );
				toDisDate.setTime( toDisDate.getTime() + toDatetimeOffset * 60 * 1000 );				
			}

			// Determine if fromDate and toDate are the same day
			var fromDateOnly = new Date(fromDisDate);
			fromDateOnly.setHours(0, 0, 0, 0);
			var fromDateOnlyMs = fromDateOnly.getTime();

			var toDateOnly = new Date(toDisDate);
			toDateOnly.setHours(0, 0, 0, 0);
			var toDateOnlyMs = toDateOnly.getTime();

			var locale = new sap.ui.core.LocaleData(sap.ui.getCore().getConfiguration().getLocale());
			var pattern = locale.getDatePattern("full");
			var dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({
				pattern : pattern
			});

			var sDateOnly = dateFormatter.format(fromDateOnly);

			if (toDateOnlyMs == fromDateOnlyMs) {
				// The appointment starts and ends on the same day
				sDate = sDateOnly;
			} else {
				// The appointment starts and ends on a different day
				// var timeFormatter = sap.ui.core.format.DateFormat.getTimeInstance({
				// style : "short"
				// });

				var timePattern = locale.getTimePattern("short");
				var formatter = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern : timePattern
				});

				if (!allDay) {
					var sTime = formatter.format(fromDate);
					sDate = this.oBundle.getText("view.Appointment.fromTimeDate", [sTime, sDateOnly]);
				} else {
					sDate = sDateOnly;
				}

			}
		}
		return sDate;
	},

	// Format of "From" and "To" Time and Date in Detail view Object Header depends upon From and To are on same Date
	// (day)
	// For same day, 1st field is the full date and 2nd field is time from to.
	// For different days, first field is From time and full date, second field is To time and full date
	formatToDateInHeader : function(fromDate, toDate, allDay) {
		var date;
		var sDate = "";
		var fromDatetimeOffset;
		var toDatetimeOffset;		

		if (fromDate !== null && toDate !== null && allDay !== null) {

			if (typeof fromDate === "string") {

				if (fromDate.substring(0, 6) === "/Date(") {
					// for mockmode
					fromDate = fromDate.replace("/Date(", "").replace(")/", "");
					fromDate = parseInt(fromDate); // number ms
					fromDate = new Date(fromDate);
				} else {
					// datepicker issue -> maybe remove when fixed
					// Wed Sep 18 2013 00:00:00 GMT+0200 (W. Europe Daylight Time)
					fromDate = new Date(date);
				}
			}

			if (typeof toDate === "string") {

				if (toDate.substring(0, 6) === "/Date(") {
					// for mockmode
					toDate = toDate.replace("/Date(", "").replace(")/", "");
					toDate = parseInt(toDate); // number ms
					toDate = new Date(toDate);
				} else {
					// datepicker issue -> maybe remove when fixed
					// Wed Sep 18 2013 00:00:00 GMT+0200 (W. Europe Daylight Time)
					toDate = new Date(toDate);
				}
			}

			var fromDisDate = new Date(fromDate);
			var toDisDate = new Date(toDate);

			// In the case of allDay appointments, backend has no time set, just date. JS assumes this is UTC and
			// converts to the browsers time zone. Therefore as workaround, take away time offset (minutes)
			if (allDay) {
				fromDatetimeOffset = fromDisDate.getTimezoneOffset();
				toDatetimeOffset = toDisDate.getTimezoneOffset();				
				
				fromDisDate.setTime( fromDisDate.getTime() + fromDatetimeOffset * 60 * 1000 );
				toDisDate.setTime( toDisDate.getTime() + toDatetimeOffset * 60 * 1000 );				

			}

			// Determine if fromDate and toDate are the same day

			var fromDateOnly = new Date(fromDisDate);
			fromDateOnly.setHours(0, 0, 0, 0);
			var fromDateOnlyMs = fromDateOnly.getTime();

			var toDateOnly = new Date(toDisDate);
			toDateOnly.setHours(0, 0, 0, 0);
			var toDateOnlyMs = toDateOnly.getTime();

			var locale = new sap.ui.core.LocaleData(sap.ui.getCore().getConfiguration().getLocale());
			var pattern = locale.getTimePattern("short");

			var timeFormatter = sap.ui.core.format.DateFormat.getTimeInstance({
				pattern : pattern
			});

			var sTimeTo = timeFormatter.format(toDate);

			if (toDateOnlyMs == fromDateOnlyMs) {
				// The appointment starts and ends on the same day
				if (!allDay) {
					var sTimeStart = timeFormatter.format(fromDate);
					sDate = this.oBundle.getText("view.Appointment.timeToTime", [sTimeStart, sTimeTo]);
				} else {
					sDate = this.oBundle.getText("view.Appointment.alldayevent");
				}
			} else {
				// The appointment starts and ends on a different day
				pattern = locale.getDatePattern("full");
				var dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({
					pattern : pattern
				});

				var sDateOnly = dateFormatter.format(toDateOnly);

				if (!allDay) {
					sDate = this.oBundle.getText("view.Appointment.toTimeDate", [sTimeTo, sDateOnly]);
				} else {
					sDate = sDateOnly;
				}
			}
		}
		return sDate;
	},

/**
 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered (NOT before the
 * first rendering! onInit() is used for that one!).
 */
// onBeforeRendering : function() {
// },
/**
 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the
 * HTML could be done here. This hook is the same one that SAPUI5 controls get after being rendered.
 */
// onAfterRendering : function() {
// },
/**
 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
 */
// onExit: function() {
//
// }
	
	/* handling of backend error messages */

					openErrorFrag : function(oEvent) {

						this.errorDetails();

						this.showErrorMsgFragment.open();

					},


							errorDetails : function(oEvent) {
						var that = this;
						var oModel = this.getView().getModel();
						var oView = this.getView();

						var omsgcount;

						var oViewObject = oView.getBindingContext();

						var errorMSG;

						oModel

						.read(oViewObject.getPath() + "/" +

						"AppointmentLogSet",

						null,

						null,

						false,

						function(oData, resp) {

							errorMSG = {

								AppointmentLogSet : resp.data.results

							};

							that.omsgcount = resp.data.results.length;

						});

						this.showErrorMsgFragment.setModel(this.getView()

						.getModel("i18n"), "i18n");
                         //2q compatible
                        var msgtitle = cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.errorMessage",this.omsgcount);
						this.showErrorMsgFragment.setTitle(msgtitle);

						var jsonModel = new sap.ui.model.json.JSONModel();

						jsonModel.setData(errorMSG);

						this.showErrorMsgFragment.setModel(jsonModel, "json");
					},

					
       closeErrorFrag : function() {

						this.showErrorMsgFragment.close();
					},

});
