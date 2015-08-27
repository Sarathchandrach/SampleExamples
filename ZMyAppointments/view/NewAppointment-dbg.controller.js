/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("cus.crm.mycalendar.util.Conversions");
jQuery.sap.require("cus.crm.mycalendar.util.Util");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.utils.resourcebundle");
jQuery.sap.require("cus.crm.mycalendar.util.Schema");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("cus.crm.mycalendar.util.Schema");

jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("cus.crm.mycalendar.view.NewAppointment", {
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created. Can be used to
	 * modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 */	
	onInit : function() {
		sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit.call(this);
		
		if(!this.oApplicationFacade.getApplicationModel("customizing")){
			cus.crm.mycalendar.util.Util.initCustomizingModel(this);
		}
		
		this.oModel = this.oApplicationFacade.getODataModel();
		
		this.oModel.setRefreshAfterChange(false);
		this.isMock = this.oApplicationFacade.isMock();
		this.getView().setModel(this.oModel);
		this.sBackendVersion = cus.crm.mycalendar.util.Schema._getServiceSchemaVersion(this.oModel,"Appointment");
		this.followupappointment=false;
		this.followupappointmentfromtask=false;
		this.newappointmentfromoppt=false;
		this.newappointmentfromaccount = false;
		this.createFromAccount = false;
		this.newAppointment = false;
		// needed to prefix the fragments
		this.sViewId = this.getView().getId();
		// BusyDialog
		this.oBusyDialog = new sap.m.BusyDialog();
        
		//employee field responds to enter press
		/*this.byId('responsibleText').attachBrowserEvent("keyup",jQuery.proxy(function(oEvent){
			
			if(oEvent.keyCode === 13){
			this.onF4Employee({oSource : this.byId('responsibleText')});
			}
			
		},this));*/
		
		//getting logged in emp resp Id
		if(parseFloat(this.sBackendVersion) >= 4.0){
		 this.oModel.read("AppPartnerSet",null, [],true,jQuery.proxy(function(odata,response){
             
      	   this.EmpResId = odata.results[0].PartnerNo;
             
         },this),jQuery.proxy(function(oError){},this));
		 }
		this.oRouter.attachRouteMatched(function(oEvent) {
			jQuery.sap.log.info("### nav target:  " + oEvent.getParameter("name"));

			this._interopChecks(this.sBackendVersion);
			
			var oStartupParameter = this.getView().getModel("startupParameters");
			if (oEvent.getParameter("name") === "newappointmentfromnote") {
				// date parameter for the new appointment
				this.byId("p").scrollTo(0);
				
				if (oStartupParameter && oStartupParameter.oData) {
					if (oStartupParameter.oData.parameters) {
						for ( var param in oStartupParameter.oData.parameters) {
							if (oStartupParameter.oData.parameters[param].key == "itemPaths" ) {
								this.createdfromNotes = true;
								var aItemPaths = oStartupParameter.oData.parameters[param].value.split(",");
								this.oModelHandler = new cus.crm.notes.handler.ModelHandler();
								this.sNote = this.oModelHandler.getSectionsText(aItemPaths);
							}
							
						//	if (oStartupParameter.oData.parameters[param].key == "ProcessTypeDescription") {
							//	this.processTypeDesFromNote = oStartupParameter.oData.parameters[param].value;
								//console.log("createFromOppt"+this.createFromOppt);
															
							//}

							if (oStartupParameter.oData.parameters[param].key == "privateFlag") {
								this.privateFlag = jQuery.parseJSON(oStartupParameter.oData.parameters[param].value);
								//console.log("createFromOppt"+this.createFromOppt);
															
							}	
							
							if (oStartupParameter.oData.parameters[param].key == "processType") {
						 										this.processType = oStartupParameter.oData.parameters[param].value;
						 										
						 								}
						}
					}
					delete oStartupParameter.oData.parameters[param];
				}
				
var that = this;
				
				var aBatchReads = [];
				var oModel = this.getView().getModel();
				
				
				 var sPath4  = "/TransactionTypes" ;
			    
			     
			     aBatchReads.push(oModel
                         .createBatchOperation(
                                       sPath4, "GET"));
			     
			     
			     oModel.addBatchReadOperations(aBatchReads);
			     
			     var index = 1;
			     var old = this;
			    oModel.submitBatch(jQuery.proxy(function(oResponses){
                 	   

                      //  that.AccountName = oResponses.__batchResponses[0].data.fullName ; 
                       // that.ContactName = oResponses.__batchResponses[1].data.fullName;
                   	   // that.ResponsibleTxt = oResponses.__batchResponses[2].data.fullName;
                   	    if(oResponses.__batchResponses[0].data)
                   	    	{
                   	    	for (var i=0; i < oResponses.__batchResponses[0].data.results.length; i++) {
            					if(oResponses.__batchResponses[0].data.results[i].ProcessTypeCode === old.processType) {
            						old.processTypeDesFromNote = oResponses.__batchResponses[0].data.results[i].Description;
            						old.privateFlag = oResponses.__batchResponses[0].data.results[i].PrivateFlag;
            						break;

            						
                   	    	}
            					

                   	    	}
                   	    	}
                 },this),jQuery.proxy(function(){},this),false);
				
		
				
				
				
				var processType = oEvent.getParameter("arguments").processType;
				
				this.createAppointment(new Date(),processType);

				if ( this.sNote ) {
					var oVM = this.getView().getModel("vm");
					oVM.oData.Note = this.sNote; 
					}
				window.setTimeout(jQuery.proxy(this._scrollToTop,this),10);
			}
			if (oEvent.getParameter("name") === "followupappointmentfromtask") {
				this.followupappointmentfromtask=true;
				// date parameter for the new appointment
				this.byId("p").scrollTo(0);
				if (oStartupParameter && oStartupParameter.oData) {
					if (oStartupParameter.oData.parameters) {
						for ( var param in oStartupParameter.oData.parameters) {
							
							
						//	if (oStartupParameter.oData.parameters[param].key == "AccountName") {
							//	this.AccountName = oStartupParameter.oData.parameters[param].value;
								//console.log("AccountName"+this.AccountName);
															
							//}
							if (oStartupParameter.oData.parameters[param].key == "taskId") {
								this.taskId = oStartupParameter.oData.parameters[param].value;
								//console.log("opportunityId"+this.opportunityId);
															
							}
							if (oStartupParameter.oData.parameters[param].key == "title") {
								this.title = oStartupParameter.oData.parameters[param].value;
								//console.log("title"+this.title);
															
							}
							if (oStartupParameter.oData.parameters[param].key == "FUA") {
								this.createFromTasks = oStartupParameter.oData.parameters[param].value;
								//console.log("createFromOppt"+this.createFromOppt);
															
							}
						//	if (oStartupParameter.oData.parameters[param].key == "ContactName") {
							//	this.ContactName = oStartupParameter.oData.parameters[param].value;
							//	console.log("ContactName"+this.ContactName);
						//	}
							//if (oStartupParameter.oData.parameters[param].key == "processType") {
							//	this.processTypeDesFromTask = oStartupParameter.oData.parameters[param].value;
								//console.log("createFromOppt"+this.createFromOppt);
															
							//}
							if (oStartupParameter.oData.parameters[param].key == "AccountID") {
								this.AccountID = oStartupParameter.oData.parameters[param].value;
								//console.log("createFromOppt"+this.createFromOppt);
															
							}
							if (oStartupParameter.oData.parameters[param].key == "ContactID") {
								this.ContactID = oStartupParameter.oData.parameters[param].value;
							//	console.log("ContactName"+this.ContactName);
							}
					//		if (oStartupParameter.oData.parameters[param].key == "privateFlag") {
						//		this.privateFlag = jQuery.parseJSON(oStartupParameter.oData.parameters[param].value);
							//	console.log("ContactName"+this.ContactName);
						//	}
							
						}
					}
					delete oStartupParameter.oData.parameters[param];
				}
				//var sDate = oEvent.getParameter("arguments").Date;
				
				var processType = oEvent.getParameter("arguments").processType;
				this.processTypeDesFromTask=processType;
				
var that = this;

var aBatchReads = [];
var oModel = this.getView().getModel();
 var aPrerequisitePaths=[];
 aPrerequisitePaths.push("/TransactionTypes");
 if (this.AccountID!=="")
        aPrerequisitePaths.push("/AccountCollection("
                      + oModel.formatValue(this.AccountID,
                                   "Edm.String") + ")");
 if(this.ContactID!==""){
        var sFormattedString = oModel.formatValue(
                      this.ContactID, "Edm.String");
        var sEncodedURL = jQuery.sap.encodeURL("contactID eq "
                      + sFormattedString);
        aPrerequisitePaths
                      .push("/ContactCollection?$filter="
                                   + sEncodedURL);
 }
 for ( var i = 0; i < aPrerequisitePaths.length; i++) {
     aBatchReads.push(oModel
                   .createBatchOperation(
                                aPrerequisitePaths[i], "GET"));

     
     
}


 
 oModel.addBatchReadOperations(aBatchReads);
 
 
 var index = 3;
 var old = this;
oModel.submitBatch(jQuery.proxy(function(oResponses){
    for ( var j = 0; j < oResponses.__batchResponses.length; j++) {
        
        switch (j) {
        case 0:
               if (oResponses.__batchResponses[0].data) {
                      for ( var i = 0; i < oResponses.__batchResponses[0].data.results.length; i++) {
                             if (oResponses.__batchResponses[0].data.results[i].ProcessTypeCode === old.processTypeDesFromTask) {
                                    old.processTypeDesFromTask = oResponses.__batchResponses[0].data.results[i].Description;
                                    old.privateFlag = oResponses.__batchResponses[0].data.results[i].PrivateFlag;
                                    }

                      }
               }
               
               break;
        
        
        default:
               if(oResponses.__batchResponses[j].data.__metadata)
               if (oResponses.__batchResponses[j].data.__metadata.type.search("Account")!== -1)
                      this.AccountName =oResponses.__batchResponses[j].data.fullName;
        if(oResponses.__batchResponses[j].data.results)
        if (oResponses.__batchResponses[j].data.results[0].__metadata.type.search("Contact") !== -1)
               this.ContactName = oResponses.__batchResponses[j].data.results[0].fullName;
               
               break;
        }
        
 }
                 },this),jQuery.proxy(function(){},this),false);
				
		
				
				
				
				
				this.createAppointment(new Date(), processType);
				window.setTimeout(jQuery.proxy(this._scrollToTop,this),10);
			}

			if (oEvent.getParameter("name") === "newappointmentfromoppt") {
				this.newappointmentfromoppt=true;
				// date parameter for the new appointment
				this.byId("p").scrollTo(0);
				if (oStartupParameter && oStartupParameter.oData) {
					if (oStartupParameter.oData.parameters) {
						for ( var param in oStartupParameter.oData.parameters) {
							
							
						//	if (oStartupParameter.oData.parameters[param].key == "AccountName") {
							//	this.AccountName = oStartupParameter.oData.parameters[param].value;
								//console.log("AccountName"+this.AccountName);
															
						//	}
							if (oStartupParameter.oData.parameters[param].key == "AccountID") {
								this.AccountID = oStartupParameter.oData.parameters[param].value;
								//console.log("createFromOppt"+this.createFromOppt);
															
							}
						//	if (oStartupParameter.oData.parameters[param].key == "EmpName") {
							//	this.ResponsibleTxt = oStartupParameter.oData.parameters[param].value;
								//console.log("createFromOppt"+this.createFromOppt);
															
							//}
							if (oStartupParameter.oData.parameters[param].key == "EmpID") {
								this.Responsible = oStartupParameter.oData.parameters[param].value;
								//console.log("createFromOppt"+this.createFromOppt);
															
							}
							if (oStartupParameter.oData.parameters[param].key == "opportunityId") {
								this.opportunityId = oStartupParameter.oData.parameters[param].value;
								//console.log("opportunityId"+this.opportunityId);
															
							}
							if (oStartupParameter.oData.parameters[param].key == "title") {
								this.title = oStartupParameter.oData.parameters[param].value;
								//console.log("title"+this.title);
															
							}
							if (oStartupParameter.oData.parameters[param].key == "createFromOppt") {
								this.createFromOppt = oStartupParameter.oData.parameters[param].value;
								//console.log("createFromOppt"+this.createFromOppt);
															
							}
						//	if (oStartupParameter.oData.parameters[param].key == "ContactName") {
						//		this.ContactName = oStartupParameter.oData.parameters[param].value;
							//	console.log("ContactName"+this.ContactName);
						//	}
							if (oStartupParameter.oData.parameters[param].key == "ContactID") {
								this.ContactID = oStartupParameter.oData.parameters[param].value;
								//console.log("createFromOppt"+this.createFromOppt);
															
							}
							if (oStartupParameter.oData.parameters[param].key == "processType") {
								this.processTypefromoppt = oStartupParameter.oData.parameters[param].value;
							//	console.log("ContactName"+this.ContactName);
							}
							//if (oStartupParameter.oData.parameters[param].key == "privateFlag") {
							//	this.privateFlag = jQuery.parseJSON(oStartupParameter.oData.parameters[param].value);
							//	console.log("ContactName"+this.ContactName);
							//}
						}
					}
					delete oStartupParameter.oData.parameters[param];
				}
				
				var that = this;
				
				var aBatchReads = [];
				var oModel = this.getView().getModel();
				
				 var sPath = "/AccountCollection('" + this.AccountID + "')" ;
				 var sPath2 = "/ContactCollection(contactID='" + this.ContactID +  "',accountID='" + this.AccountID +"')" ;
				 var sPath3 = "/EmployeeCollection('" + this.Responsible + "')" ; 
				 var sPath4  = "/TransactionTypes" ;
			     aBatchReads.push(oModel
                         .createBatchOperation(
                                       sPath, "GET"));
			     
			     aBatchReads.push(oModel
                         .createBatchOperation(
                                       sPath2, "GET"));
			     
			     aBatchReads.push(oModel
                         .createBatchOperation(
                                       sPath3, "GET"));
			     
			     aBatchReads.push(oModel
                         .createBatchOperation(
                                       sPath4, "GET"));
			     
			     
			     oModel.addBatchReadOperations(aBatchReads);
			     
			     var index = 4;
			     var old = this;
			    oModel.submitBatch(jQuery.proxy(function(oResponses){
                 	   

                        that.AccountName = oResponses.__batchResponses[0].data.fullName ; 
                        that.ContactName = oResponses.__batchResponses[1].data.fullName;
                   	    that.ResponsibleTxt = oResponses.__batchResponses[2].data.fullName;
                   	    if(oResponses.__batchResponses[3].data)
                   	    	{
                   	    	for (var i=0; i < oResponses.__batchResponses[3].data.results.length; i++) {
            					if(oResponses.__batchResponses[3].data.results[i].ProcessTypeCode === old.processTypefromoppt) {
            						old.processTypeDescriptionfromoppt = oResponses.__batchResponses[3].data.results[i].Description;
            						old.privateFlag = oResponses.__batchResponses[3].data.results[i].PrivateFlag;
            						break;

            						
                   	    	}
            					

                   	    	}
                   	    	}
                 },this),jQuery.proxy(function(){},this),false);
				
		
				
				//var sDate = oEvent.getParameter("arguments").Date;
				var processType = oEvent.getParameter("arguments").processType;
				this.createAppointment(new Date(), processType);
				window.setTimeout(jQuery.proxy(this._scrollToTop,this),10);
			}
			
			if (oEvent.getParameter("name") === "newappointmentfromaccount") {
				this.byId("p").scrollTo(0);
				this.newappointmentfromaccount = true; 
				this.createFromAccount = true;

				var oModel = this.oConnectionManager.getModel();

				var processType = oEvent.getParameter("arguments").processType;
				var oProcessTypes = oModel.getProperty("TransactionTypeSet");
				var sBackendVersion = cus.crm.mycalendar.util.Schema._getServiceSchemaVersion(this.oModel,"Appointment");
				
				if (!oProcessTypes)
					oModel.read(((parseFloat(sBackendVersion) >= 4.0)) ? "TransactionTypes" : "TransactionTypeSet", null, null, false,
						function(oData, oResponse) {
							oProcessTypes = { TransactionTypeSet : oResponse.data.results };
						}
					);
				for (var i=0; i < oProcessTypes.TransactionTypeSet.length; i++) {
					if(oProcessTypes.TransactionTypeSet[i].ProcessTypeCode === processType) {
						this.processTypeDescriptionFromAccount = oProcessTypes.TransactionTypeSet[i].Description;
						this.privateFlag = oProcessTypes.TransactionTypeSet[i].PrivateFlag;
						break;
					}
				};

				var accountContextPath = oEvent.getParameter("arguments").accountContextPath;
				var oAccount = oModel.getProperty(accountContextPath);
				var that = this;
				var fnSetAccount = function(oAccount) {
					that.AccountID = oAccount.accountID;
					if(oAccount.fullName)
						that.AccountName = oAccount.fullName;
					else
						that.AccountName = oAccount.name1;
				};

				if(!oAccount){
					oModel.createBindingContext("/"+accountContextPath, "",
						function() {
							oAccount = oModel.getProperty("/"+accountContextPath);
							fnSetAccount(oAccount);
							/*this.createAppointment(, processType);*/
							that.createAppointment(null, processType);
							window.setTimeout(jQuery.proxy(that._scrollToTop,that),10);
						},
						true
					);
				} else {
					fnSetAccount(oAccount);
					/*this.createAppointment(new Date(), processType);*/
					this.createAppointment(null, processType);
					window.setTimeout(jQuery.proxy(that._scrollToTop,that),10);
				}
			}

			if (oEvent.getParameter("name") === "newappointment") {
				// date parameter for the new appointment
				this.newAppointment=true;
				this.byId("p").scrollTo(0);
				var sDate = oEvent.getParameter("arguments").Date;
				var processType = oEvent.getParameter("arguments").processType;
				this.privateFlag = jQuery.parseJSON(oEvent.getParameter("arguments").privateFlag);
				/*this.createAppointment(new Date(), processType);*/
				this.createAppointment(this.getDatefromParameterString(sDate), processType);
				window.setTimeout(jQuery.proxy(this._scrollToTop,this),10);
			}
			if (oEvent.getParameter("name") === "editappointment") {
				this.byId("p").scrollTo(0);
				var sApptGuid = oEvent.getParameter("arguments").AppointmentID;
				
				this.Context = "/AppointmentSet(guid'" + sApptGuid + "')";
				// adapt context for mock
				if (this.isMock){
					this.Context = "/AppointmentSet(Guid='" + sApptGuid + "')";
				}
				this.getView().bindElement(this.Context);
				this.editAppointment(this.Context, sApptGuid);
				window.setTimeout(jQuery.proxy(this._scrollToTop,this),10);
			}
			if (oEvent.getParameter("name") === "followupappointment") {
				this.followupappointment=true;
				this.byId("p").scrollTo(0);
				var sApptGuid = oEvent.getParameter("arguments").AppointmentGuid;
				var processType = oEvent.getParameter("arguments").processType; 
				this.privateFlag = jQuery.parseJSON(oEvent.getParameter("arguments").privateFlag);
				this.Context = "/AppointmentSet(guid'" + sApptGuid + "')";
				// adapt context for mock
				if (this.isMock){
					this.Context = "/AppointmentSet(Guid='" + sApptGuid + "')";
				}
				this.getView().bindElement(this.Context);
				this.followupAppointment(this.Context, sApptGuid,processType);
				window.setTimeout(jQuery.proxy(this._scrollToTop,this),10);
			}
			 /**
			 * @ControllerHook extHookCustomLogicOnRouteMatched provides for any additional logic customer can implement when loading the new appointments page.
			 * @callback sap.ca.scfld.md.controller.BaseFullScreenController~extHookCustomLogicOnRouteMatched
			 * @param {object}
			 *           oEvent
			 * @return {void}
			 */
		  if (this.extHookCustomLogicOnRouteMatched){
				this.extHookCustomLogicOnRouteMatched(oEvent);
			}
		}, this);
          
		// for the customizing status values
		var statusmodel = new sap.ui.model.json.JSONModel({});
		this.getView().setModel(statusmodel, "statusmodel");
		
		//for the customizing priority values
		if(parseFloat(this.sBackendVersion) >= 4){
		
		var priomodel = new sap.ui.model.json.JSONModel({});
		this.getView().setModel(priomodel,"priomodel");
		
		}
		

		// decoupled model for view display
		this.oViewModel = new sap.ui.model.json.JSONModel({});
		this.getView().setModel(this.oViewModel, "vm");

		// decoupled helper model for time display
		this.getView().setModel(new sap.ui.model.json.JSONModel({}), "vmh");

		//any additional parameters that determine the logical state of this view can be set here
		this.getView().setModel(new sap.ui.model.json.JSONModel({}),"viewState");
		
		this.bUpdate = false;
		this.followup = false;
		this.oBundle = this.oApplicationFacade.getResourceBundle();
	
	},

	getDatefromParameterString : function parse(str) {
		// format: yyymmdd --> Date
		if (!/^(\d){8}$/.test(str))
			return null;
		var y = str.substr(0, 4), m = str.substr(4, 2) - 1, d = str.substr(6, 2);
		return new Date(y, m, d);
		
		
	},

	/**
	 * 
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered (NOT before the
	 * first rendering! onInit() is used for that one!).
	 */
	 onBeforeRendering : function() {
			// initialize first day of week for the date picker value helps
			var locale = new sap.ui.core.LocaleData(sap.ui.getCore().getConfiguration().getLocale());
			this.byId("fd").setFirstDayOffset(locale.getFirstDayOfWeek());
			this.byId("td").setFirstDayOffset(locale.getFirstDayOfWeek());
			
			if(this.createFromOppt)
				{
			
			 					if(this.AccountName!=null)
			 						{
			 					//	console.log("account name "+this.AccountName);
			 						this.byId("ia").setValue(this.AccountName);
			 						
			 						//account field not being set properly from model and formatter, setting it explicitly
			 						this.getView().getModel('vm').oData.AccountTxt = this.AccountName;
			 						}
			 					if(this.ContactName!=null)
			 						{
			 							//console.log("account name"+this.ContactName);
			 							this.byId("ic").setValue(this.ContactName);
			 							}
			 					if(this.title!=null)
			 						{
			 						//console.log("title"+this.title);
			 					this.byId("desc").setValue(this.title);
			 						} 					
			
			 	}
			if(this.createFromTasks)
			{
		
		 					//if(this.AccountName!="" )
		 				//		{
		 					//	console.log("account name "+this.AccountName);
		 					//	this.byId("ia").setValue(this.AccountName1);
		 					//	}
		 					//if(this.ContactName!="")
		 						//{
		 							//console.log("account name"+this.ContactName);
		 							//this.byId("ic").setValue(this.ContactName1);
		 							//}
		 					if(this.title!="")
		 					{
		 						//console.log("title"+this.title);
		 					this.byId("desc").setValue(this.title);
		 						} 					
		
		 	}
			this.enableSaveBtn();
			
			
			
			
			
	 },
	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the
	 * HTML could be done here. This hook is the same one that SAPUI5 controls get after being rendered.
	 */
	 onAfterRendering : function() {
		 
		 
		
			
		 
		 
			 },
	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 */
	// onExit : function() {
	// },
	// return the entity displayed in the view -> viewmodel entity
	getViewEntity : function() {
		return this.getView().getModel("vm").getData();
	},

	// entry point for create navigation
	createAppointment : function(oStartDate, oProcessType) {
		var that = this;
		// Set Logged in employee as initial employee for new appointment
		if(parseFloat(this.sBackendVersion) >= 4.0){ 
			this.oModel.read("AppPartnerSet",null, [],true,jQuery.proxy(function(odata,response){	             
	      	   that.EmpResId = odata.results[0].PartnerNo;
	      	   that.Responsible = odata.results[0].PartnerNo;
	      	   that.ResponsibleTxt = odata.results[0].Fullname;	
	      	   oNewAppointment.Responsible = that.EmpResId;
	      	   oNewAppointment.ResponsibleTxt = that.ResponsibleTxt;
	      	   this.byId("responsibleText").setValue(that.ResponsibleTxt);
	         },this),jQuery.proxy(function(oError){},this));
		}

		var dFrom, dTo;
		this.bUpdate = false;
		this.followup = false;
		this.iCounter = 50;
		
		this._setViewMode("CREATE");
		
		if(this.privateFlag == false){
			this.byId("pf").setEnabled(false);
		}
		else{
			this.byId("pf").setEnabled(true);
		}
		
		if(oProcessType === undefined){ //old backend
			var oNewAppointment = {
					// "Guid" : "",
					"Description" : "",
					"PrivatFlag" : false,
					"AllDay" : false,
					"FromDate" : "",
					"ToDate" : "",
					"Location" : "",
					"Account" : (this.AccountID!=null) ? this.AccountID : "",
					"AccountTxt" : (this.AccountName!=null) ? this.AccountName : "",
					"Contact" : (this.ContactID!=null) ? this.ContactID : "",
					"ContactTxt" : "",
					"Note" : "",
					"Status" : "",
					"StatusTxt" : ""
				};
		}
		else{
		var PredecessorID="";
 					if(this.createFromOppt)
 						{
 						PredecessorID =this.opportunityId;
 						//console.log("predecessor id "+this.opportunityId);
 					}
 					if(this.createFromTasks)
						{
						PredecessorID =this.taskId;
						//console.log("predecessor id "+this.opportunityId);
					}

	// create new Appointment entity
		var oNewAppointment = { 
			// "Guid" : "",
			"Description" : "",
			"PrivatFlag" : false,
			"AllDay" : false,
			"FromDate" : "",
			"ToDate" : "",
			"Location" : "",
			"Responsible" : (this.Responsible) ? this.Responsible : "",
			"ResponsibleTxt" : (this.ResponsibleTxt) ? this.ResponsibleTxt : "",	 	
			"Account" : (this.AccountID) ? this.AccountID : "",
			"AccountTxt" : (this.AccountName) ? this.AccountName : "",
			"Contact" : (this.ContactID) ? this.ContactID : "",
			"ContactTxt" : (this.ContactName) ? this.ContactName : "",
			"Note" : "",
			"Status" : "",
			"StatusTxt" : "",
			"TransactionType" : oProcessType,
	 					"PredecessorID":PredecessorID,
	 				
		};
	    this._removeCrossAppAttributes();
		}
		// for create it is sufficient to load status from back end only once
		if (!this.oNewStatus) {
			
			if (this.isMock){
				
				this.getView().getModel("statusmodel").loadData("/cus.crm.mycalendar/model/Status.json", "", true );
				this.getView().getModel("statusmodel").attachRequestCompleted(this, function() {
					that.oNewStatus = that.getView().getModel("statusmodel").getData(); 
					oNewAppointment.Status = that.oNewStatus.results[0].StatusID;
					
					//account field not being set properly from model and formatter, setting it explicitly
					var oData = that.getView().getModel('vm').oData;
					var accountTxt = oData.AccountTxt;
					var account = oData.Account;
				    that.byId('ia').setValue(cus.crm.mycalendar.util.Conversions.formatAccountText(accountTxt,account));
				    var contactTxt=oData.ContactTxt;
				    that.byId("ic").setValue(contactTxt);
				    window.setTimeout(function(){
						  that.oStartEntityString = JSON.stringify(oData);
						  // disable SaveButton as long as required fields are empty
						  that.enableSaveBtn();
							
					  },10);
				    
				}, this);
				
			} else	{
				
//				that = this;
//			  this.oModel.callFunction("readAppointStatusCust", "GET", {
//			   	Guid : "",
//			   	TransactionType : oProcessType
//			  }, null, function(oData, response) {
//				   jQuery.sap.log.info("oData function call for status success");
//				   that.oNewStatus = oData;
//				   that.getView().getModel("statusmodel").setData(that.oNewStatus);
//				   if (that.oNewStatus.results){
//					   var i;
//					   for(i=0;i< that.oNewStatus.results.length;i++){
//					   if(that.oNewStatus.results[i].Default == true){
//						   oNewAppointment.Status = that.oNewStatus.results[i].StatusID;
//						   that.byId("st").setSelectedKey(oNewAppointment.Status);
//						   break;
//					   }
//					   }
//					   
//					
//					   //account field not being set properly from model and formatter, setting it explicitly
//						var oData = that.getView().getModel('vm').oData;
//						var accountTxt = oData.AccountTxt;
//						var account = oData.Account;
//					    that.byId('ia').setValue(cus.crm.mycalendar.util.Conversions.formatAccountText(accountTxt,account));
//					    var contactTxt=oData.ContactTxt;
//					    that.byId("ic").setValue(contactTxt);
//					    window.setTimeout(function(){
//							  that.oStartEntityString = JSON.stringify(oData);
//							  // disable SaveButton as long as required fields are empty
//							  that.enableSaveBtn();
//								
//						  },10);
//					    
//				   }
//			  }, function(oError) {
//				   jQuery.sap.log.error("oData function call for status failed");
//				   cus.crm.mycalendar.util.Util.handleErrors(oError);
//			  });
				
				var bReturn = cus.crm.mycalendar.util.Util.getCustomizing(oProcessType,this);
				
				if(bReturn === false){
					
					window.setTimeout(jQuery.proxy(function(){
			    		var sViewState = this._getViewMode();
			    		
			    		if(sViewState === "ERROR"){
			    			cus.crm.mycalendar.util.Util.showErrMsgBox(this.sErrMsg);
			    		}
			    	},this),10);
					return;
				}
				
				var oVM = this.getView().getModel("vm");
				
				if(parseFloat(this.sBackendVersion) >=4 ){
					
					var oCustModel = this.oApplicationFacade.getApplicationModel("customizing");
					var oData = oCustModel.oData;
					var statusmodel = this.getView().getModel("statusmodel");
					var priomodel = this.getView().getModel("priomodel");
					
					
					priomodel.setData({results : oData.UserPriorities});
					statusmodel.setData({results : oData.mStatuses[oProcessType]});
					
					var oDefaultPrio = cus.crm.mycalendar.util.Util.getDefaultPriority(oProcessType,this);
					
					if(oDefaultPrio !== null && oDefaultPrio !== undefined){
						 oNewAppointment.Priority = oDefaultPrio.Priority;
						 oNewAppointment.PriorityTxt = oDefaultPrio.TxtLong;
					}
					else{
						oNewAppointment.Priority = oData.UserPriorities[0].Priority;
						oNewAppointment.PriorityTxt = oData.UserPriorities[0].TxtLong;
					}
					
					var oDefaultStatus = cus.crm.mycalendar.util.Util.getDefaultStatus(oData.mStatuses[oProcessType]);
					
					if(oDefaultStatus !== null && oDefaultStatus !== undefined){
						oNewAppointment.Status = oDefaultStatus.statusID;
						oNewAppointment.StatusTxt = oDefaultStatus.StatusTxt;
					}
					else{
						oNewAppointment.Status = oData.mStatuses[oProcessType].statusID;
						oNewAppointment.StatusTxt = oData.mStatuses[oProcessType].StatusTxt;
					}
				}
				
				else{
					var oCustModel = this.oApplicationFacade.getApplicationModel("customizing");
					var oData = oCustModel.oData;
					var statusmodel = this.getView().getModel("statusmodel");
					statusmodel.setData({results : oData.mStatuses[oProcessType]});
					var oDefaultStatus = cus.crm.mycalendar.util.Util.getDefaultStatus(oData.mStatuses[oProcessType]);
					
					if(oDefaultStatus !== null){
						oNewAppointment.Status = oDefaultStatus.statusID;
						oNewAppointment.StatusTxt = oDefaultStatus.StatusTxt;
					}
					
				}
				var that = this;
				
				var accountTxt = oVM.oData.AccountTxt;
				var account = oVM.oData.Account;
			    this.byId('ia').setValue(cus.crm.mycalendar.util.Conversions.formatAccountText(accountTxt,account));
			    var contactTxt= oVM.oData.ContactTxt;
			    this.byId("ic").setValue(contactTxt);
			    window.setTimeout(function(){
					  that.oStartEntityString = JSON.stringify(oData);
					  // disable SaveButton as long as required fields are empty
					  that.enableSaveBtn();
						
				  },10);
			    
			    
				oVM.updateBindings();
				
			} 

		} else {
			this.getView().getModel("statusmodel").setData(this.oNewStatus);
			// set the status for the object stringify back navigation check
			if (this.oNewStatus.results){
				 var i;
				   for(i=0;i< this.oNewStatus.results.length;i++){
				   if(this.oNewStatus.results[i].Default == true){
					   oNewAppointment.Status = this.oNewStatus.results[i].StatusID;
					   this.byId("st").setSelectedKey(oNewAppointment.Status);
					   break;
				   }
			}
			}
		}
		if(oProcessType !== undefined){   //new backend
		oNewAppointment.TransactionType = oProcessType ; 
		}
		// initialize date for create
		if (oStartDate) {
			dFrom = new Date(oStartDate.getFullYear(), oStartDate.getMonth(), oStartDate.getDate());
			dTo = new Date(oStartDate.getFullYear(), oStartDate.getMonth(), oStartDate.getDate());
		} else {
			dFrom = new Date();
			dTo = new Date();
		}
		this.setDefaultTimes(dFrom, dTo);
		this.setTimeHelperModel(dFrom, dTo);

		oNewAppointment.FromDate = dFrom;
		oNewAppointment.ToDate = dTo;

		this.byId("p").bindProperty("title", "i18n>view.Appointment.newapptitle");

		// replaces data in view model before
		this.getView().getModel("vm").setData(oNewAppointment);
		this.getView().getModel("vm").updateBindings();
   
		this.setAllDay(oNewAppointment.AllDay);

		if (!this.isMock){
		  var oDataEmpty = {
		 	  results : []
		  };
		  var oAttView = this.byId("attachmentsView_chg1");
		  var oAttCont = oAttView.getController();
		  var mode = 1;
		  oAttCont.refresh("", oDataEmpty, mode);
		}

		// default the non-bound attendee fields
		var oDisplayAttendee = this.getAttendeeStrings(oNewAppointment.Attendee);
		this.byId("atin").setText(oDisplayAttendee.internal);
		this.byId("atex").setText(oDisplayAttendee.external);

		// didn't work directly in view because data not set on init
		this.byId("desc").setMaxLength(40);
		this.byId("loc").setMaxLength(100);
		
		//account field not being set properly from model and formatter, setting it explicitly
		var oData = that.getView().getModel('vm').oData;
		var accountTxt = oData.AccountTxt;
		var account = oData.Account;
	    that.byId('ia').setValue(cus.crm.mycalendar.util.Conversions.formatAccountText(accountTxt,account));
	    var contactTxt=oData.ContactTxt;
	    that.byId("ic").setValue(contactTxt);
		// set ProcessType Description.
	    
	   
		this.getView().byId("TypecFormElement").setVisible(false);
		this.getView().byId("ProcessTypeLabel").setVisible(false);
		this.getView().byId("ProcessTypeText").setVisible(false);
		var processTypeDescr = null;
		if(this.createFromTasks)
			processTypeDescr = this.processTypeDesFromTask;
		else if(this.createFromOppt)
			processTypeDescr = this.processTypeDescriptionfromoppt;
		else if(this.createdfromNotes)
			processTypeDescr = this.processTypeDesFromNote;
		else if(this.createFromAccount)
			processTypeDescr = this.processTypeDescriptionFromAccount;
		else {
			if (this.getView().getModel("controllers"))  {
				var listController = this.getView().getModel("controllers").getData().apptListController;
				if (listController != null	|| listController != undefined) {
					processTypeDescr = listController.processTypeDesc;
					
				}
			}
		
		}
			if (processTypeDescr != null) {
				this.getView().byId("TypecFormElement").setVisible(true);
				this.getView().byId("ProcessTypeLabel").setVisible(true);
				this.getView().byId("ProcessTypeText").setVisible(true);
				this.getView().byId("ProcessTypeText").setText(processTypeDescr);
			}
		
		
			window.setTimeout(function(){
			  that.oStartEntityString = JSON.stringify(oData);
			  // disable SaveButton as long as required fields are empty
			  that.enableSaveBtn();
				
		  },10);
		 /**
		 * @ControllerHook extHookCreateAppointment provides for any additional logic customer can implement in the createAppointment function.
		 *                 
		 * @callback sap.ca.scfld.md.controller.BaseFullScreenController~extHookCreateAppointment
		 * 
		 * @return {void}
		 */
	  if (this.extHookCreateAppointment){
		    this.extHookCreateAppointment();
		}
	    
	},

	// entry point for edit navigation
	editAppointment : function(sEntityPath, sApptGuid) {

		var startTimezoneOffset;
		var endTimezoneOffset;
		var startTimezoneOffsetMs;
		var endTimezoneOffsetMs;		
		
		this.sEntityPath = sEntityPath;
		this.sApptGuid = sApptGuid;
		this._setViewMode("EDIT");
		this.followup = false;
		this.bUpdate = true;
		this.iCounter = 50; // for new AttendeeSet Partnerguid
		// show employee responsible
		this.byId("responsible").setVisible(true);
			
		var that = this;
		var oProcessType; 
		if (this.oModel.read) {
			// read the data from backend, could be changed in the meanwhile:

			this.oModel.read(sEntityPath, null, ["$expand=Attendee,AppointmentToAttachment"], false, function(odata, response) {
				// success call back, set entity and bind
				jQuery.sap.log.info("edit view - oData read success");

				
				//save eTag 
				if(parseFloat(that.sBackendVersion) >=4){
				cus.crm.mycalendar.util.Util._saveETag(odata.__metadata.etag);
				}
				var aAttendees = odata.Attendee.results;
				var oEditAppointment = odata;
				oProcessType = odata.TransactionType;
				oEditAppointment.Attendee = aAttendees;
				
				if (odata.ProcessTypeDescription ==  null ){
					that.getView().byId("TypecFormElement").setVisible(false);
					that.getView().byId("ProcessTypeLabel").setVisible(false);
					that.getView().byId("ProcessTypeText").setVisible(false);
				}else{
					that.getView().byId("TypecFormElement").setVisible(true);
					that.getView().byId("ProcessTypeLabel").setVisible(true);
					that.getView().byId("ProcessTypeText").setVisible(true);
					that.getView().byId("ProcessTypeText").setText(	odata.ProcessTypeDescription);
				}
				
				if(parseFloat(that.sBackendVersion) >= 3){
					if(oEditAppointment.PrivateAllowed == false){
						that.byId("responsibleText").setEnabled(true);
					}
					else{ //private flag and Employee field status
						if(odata.MyOwn == false)			
						{	//Shared Calendar
							that.byId("pf").setEnabled(false);
							that.byId("responsibleText").setEnabled(true);
						}
						else						
						{ 	//My Calendar
							if(that.byId("pf").getState()){
								that.byId("responsibleText").setEnabled(false);}
							else{
								that.byId("responsibleText").setEnabled(true);}
							that.byId("pf").setEnabled(true);
						}
					}
				}
				
				if (that.isMock){
					// adapt dates for mockmode...
					odata.FromDate = that.adaptMockDate(odata.FromDate);
					odata.ToDate = that.adaptMockDate(odata.ToDate);	
				}
				
				// replaces data in view model before

				// In case of all day appointment, add back in offset to GMT
				
				if (oEditAppointment.AllDay) {
				
					startTimezoneOffset = oEditAppointment.FromDate.getTimezoneOffset();
					endTimezoneOffset = oEditAppointment.ToDate.getTimezoneOffset();	
				
					startTimezoneOffsetMs = startTimezoneOffset * 60 * 1000;
					endTimezoneOffsetMs = endTimezoneOffset * 60 * 1000;			
				
					oEditAppointment.FromDate.setTime( oEditAppointment.FromDate.getTime() + startTimezoneOffsetMs );
					oEditAppointment.ToDate.setTime( oEditAppointment.ToDate.getTime() + endTimezoneOffsetMs );
					}
				
				that.getView().getModel("vm").setData(oEditAppointment);				
				that.getView().getModel("vm").updateBindings();
				
				//save status code - needed for rebinding later
				that.statusCode = that.getView().getModel("vm").oData.Status;
				
				that.setTimeHelperModel(oEditAppointment.FromDate, oEditAppointment.ToDate);

				that.byId("ft").setVisible(!oEditAppointment.AllDay);
				that.byId("tt").setVisible(!oEditAppointment.AllDay);
				
//				//Deeplinking of edit button in My appointments
//				that.oModel.createBindingContext(that.Context, "", {
//                    expand : "Attendee,AccountRel/Logo,AppointmentToAttachment"
//			 }, function(oContext) {
//                    that.getView().bindElement(that.Context);

				//var sPath = that.getView().getBindingContext().getPath();
				//var oData = that.getView().getModel().getData(sPath, null, true);

                if (!that.isMock){
                    var oAttView2 = that.byId("attachmentsView_chg1");
                    var oAttCont2 = oAttView2.getController();
                    //oAttView2.bindElement(sEntityPath);
                    var mode = 1;
                    oAttCont2.refresh(sEntityPath, odata.AppointmentToAttachment, mode);
                  }
		//	 }, false);
			
				// the attendee string for display
				var oDisplayAttendee = that.getAttendeeStrings(oEditAppointment.Attendee);
				that.byId("atin").setText(oDisplayAttendee.internal);
				that.byId("atex").setText(oDisplayAttendee.external);
				that.byId("p").bindProperty("title", "i18n>view.Appointment.editappointment");
				// didn't work directly in view because data not set on init
				that.byId("desc").setMaxLength(40);
				that.byId("loc").setMaxLength(100);
				
				//account field not being set properly from model and formatter, setting it explicitly
				var oData = that.getView().getModel('vm').oData;
				var accountTxt = oData.AccountTxt;
				var account = oData.Account;
			    that.byId('ia').setValue(cus.crm.mycalendar.util.Conversions.formatAccountText(accountTxt,account));
			    
			
				
			}, function(oError) {
				jQuery.sap.log.error("edit view - oData read request failed");
			});

	    if (this.isMock){
				
	    	if(!this.oNewStatus){
				  this.getView().getModel("statusmodel").loadData("/cus.crm.mycalendar/model/Status.json", "", true );
				  this.getView().getModel("statusmodel").attachRequestCompleted(this, function() {
					  this.oNewStatus = this.getView().getModel("statusmodel").getData(); 
				  }, this);
	    	}
				
			} else	{
			  
				    var bReturn = cus.crm.mycalendar.util.Util.getCustomizing(oProcessType,this);
				    if(bReturn === false){
				    	window.setTimeout(jQuery.proxy(function(){
				    		var sViewState = this._getViewMode();
				    		
				    		if(sViewState === "ERROR"){
				    			cus.crm.mycalendar.util.Util.showErrMsgBox(this.sErrMsg);
				    		}
				    	},this),10);
				    	return;
				    }
					var oVM = this.getView().getModel("vm");
					var oCustModel = this.oApplicationFacade.getApplicationModel("customizing");
					var oData = oCustModel.oData;
					var statusmodel = this.getView().getModel("statusmodel");
					
					var aStatuses = (parseFloat(this.sBackendVersion) >= 4) ? oData.mNextPossibleStatuses[oProcessType] : oData.mStatuses[oProcessType];
					statusmodel.setData({results : aStatuses});
					
					if(parseFloat(this.sBackendVersion) >= 4){
						
					var priomodel = this.getView().getModel("priomodel");
					priomodel.setData({results : oData.UserPriorities});
					
                  
					}
					
					oVM.updateBindings();
			}
		}
		
		 /**
		 * @ControllerHook extHookEditAppointment provides for any additional logic customer can implement in the editAppointment function. 
		 * @callback sap.ca.scfld.md.controller.BaseFullScreenController~extHookEditAppointment
		 * @param {string} sEntityPath 
		 * @param {string} sApptGuid
		 *          
		 * @return {void}
		 */
	  if (this.extHookEditAppointment){
			this.extHookEditAppointment(sEntityPath,sApptGuid);
		}
		
		

	},
	
	followupAppointment : function(sEntityPath,sApptGuid,processType)
	{
		var startTimezoneOffset;
		var endTimezoneOffset;
		var startTimezoneOffsetMs;
		var endTimezoneOffsetMs;		
		
		this.bUpdate = false;
		this._setViewMode("CREATE");
		this.followup = true;
		this.iCounter = 50; // for new AttendeeSet Partnerguid
		// show employee responsible
		this.byId("responsible").setVisible(true);
		
		var that = this;
		var oProcessType; 
		if (this.oModel.read) {
			// read the data from backend, could be changed in the meanwhile:

			this.oModel.read(sEntityPath, null, ["$expand=Attendee,AppointmentToAttachment"], false, function(odata, response) {
				// success call back, set entity and bind
				jQuery.sap.log.info("edit view - oData read success");

				var aAttendees = odata.Attendee.results;
				var oEditAppointment = odata;
				oProcessType = processType;
				oEditAppointment.TransactionType = processType;
				oEditAppointment.PrivatFlag = that.privateFlag;
				oEditAppointment.Attendee = aAttendees;
                oEditAppointment.PredecessorGUID = sApptGuid;
				if (that.isMock){
					// adapt dates for mockmode...
					odata.FromDate = that.adaptMockDate(odata.FromDate);
					odata.ToDate = that.adaptMockDate(odata.ToDate);	
				}
				//since this is a new appointment
				var dFrom = new Date();
				var dTo = new Date();
				
				that.setDefaultTimes(dFrom, dTo);
				oEditAppointment.FromDate = dFrom; 
				oEditAppointment.ToDate = dTo;
				oEditAppointment.Guid = undefined; 
				that.getView().getModel("vm").setData(oEditAppointment);				
				that.getView().getModel("vm").updateBindings();
				that.setTimeHelperModel(oEditAppointment.FromDate, oEditAppointment.ToDate);

				that.byId("ft").setVisible(!oEditAppointment.AllDay);
				that.byId("tt").setVisible(!oEditAppointment.AllDay);

				var sPath = that.getView().getBindingContext().getPath();

				/*if (!that.isMock){
				  var oAttView2 = that.byId("attachmentsView_chg1");
				  var oAttCont2 = oAttView2.getController();
				  oAttView2.bindElement(sPath);
				  var mode = 1;
				  oAttCont2.refresh(sPath, odata.AppointmentToAttachment, mode);
				}
*/
				// the attendee string for display
				var oDisplayAttendee = that.getAttendeeStrings(oEditAppointment.Attendee);
				that.byId("atin").setText(oDisplayAttendee.internal);
				that.byId("atex").setText(oDisplayAttendee.external);
				that.byId("p").bindProperty("title", "i18n>view.Appointment.newapptitle");
				/*that.byId("p").bindProperty("title", "i18n>view.Appointment.editappointment");*/
				// didn't work directly in view because data not set on init
				that.byId("desc").setMaxLength(40);
				that.byId("loc").setMaxLength(100);
				that.byId("loc").setValue("");
				//account field not being set properly from model and formatter, setting it explicitly
				var oData = that.getView().getModel('vm').oData;
				var accountTxt = oData.AccountTxt;
				var account = oData.Account;
			    that.byId('ia').setValue(cus.crm.mycalendar.util.Conversions.formatAccountText(accountTxt,account));
			    
				// set ProcessType Description.
				that.getView().byId("TypecFormElement").setVisible(false);
				that.getView().byId("ProcessTypeLabel").setVisible(false);
				that.getView().byId("ProcessTypeText").setVisible(false);
				var processTypeDescr = null;
			
				var detailController = that.oApplicationFacade.getApplicationModel("detailController").getData().detailController;
				if (detailController != null	|| detailController != undefined) {
					processTypeDescr = detailController.ProcessTypeDescription;
					if (processTypeDescr != null) {
						that.getView().byId("TypecFormElement").setVisible(true);
						that.getView().byId("ProcessTypeLabel").setVisible(true);
						that.getView().byId("ProcessTypeText").setVisible(true);
						that.getView().byId("ProcessTypeText").setText(processTypeDescr);
					}
				}
				
			    
				window.setTimeout(function(){
				  that.oStartEntityString = JSON.stringify(oData);
				// disable SaveButton as long as required fields are empty
				  that.enableSaveBtn();
					
			  },10);
				
			}, function(oError) {
				jQuery.sap.log.error("edit view - oData read request failed");
			});

	    if (this.isMock){
				
	    	if(!this.oNewStatus){
				  this.getView().getModel("statusmodel").loadData("/cus.crm.mycalendar/model/Status.json", "", true );
				  this.getView().getModel("statusmodel").attachRequestCompleted(this, function() {
					  this.oNewStatus = this.getView().getModel("statusmodel").getData(); 
				  }, this);
	    	}
				
			} else	{
				var bReturn = cus.crm.mycalendar.util.Util.getCustomizing(processType,this);
				
				if(bReturn === false){
					
					window.setTimeout(jQuery.proxy(function(){
			    		var sViewState = this._getViewMode();
			    		
			    		if(sViewState === "ERROR"){
			    			cus.crm.mycalendar.util.Util.showErrMsgBox(this.sErrMsg);
			    		}
			    	},this),10);
					return;
				}
				    var oVM = this.getView().getModel("vm");
					var oCustModel = this.oApplicationFacade.getApplicationModel("customizing");
					var oData = oCustModel.oData;
					var statusmodel = this.getView().getModel("statusmodel");
					
					if(parseFloat(this.sBackendVersion) >=4 ){
						
				  	 var priomodel = this.getView().getModel("priomodel");
					 priomodel.setData({results : oData.UserPriorities});
					
				    }
					statusmodel.setData({results : oData.mStatuses[processType]});
				    oVM.updateBindings();
			  
			
			}
		}
		
		// disable SaveButton as long as required fields are empty
		this.enableSaveBtn();
		
		

	},

	// raw and not final, just to have a first display
	getAttendeeStrings : function(aAttendee) {
		var sInternal = "", sExternal = "", sAttendeeCount = 0;
		if (aAttendee) {
			for ( var i = 0, l = aAttendee.length; i < l; i++) {
				if (aAttendee[i].IntAttendee) {
					if(sInternal){
						sInternal += "; " + aAttendee[i].FullName;
					}
					else{
						sInternal = aAttendee[i].FullName;
					}
					
				} else {
					if(sExternal){
						sExternal += "; " + aAttendee[i].FullName;
					}
					else{
						sExternal = aAttendee[i].FullName;
					}
					
				}
			}
			sAttendeeCount = aAttendee.length;
		}

		sInternal = sInternal || this.oBundle.getText("view.Appointment.attinternaladd");
		sExternal = sExternal || this.oBundle.getText("view.Appointment.attexternaladd");

		// adapt the attendee title
		this.byId("atttit").setTitle(this.oBundle.getText("view.Appointment.additionalAttendeeNumber", [sAttendeeCount]));

		return {
			internal : sInternal,
			external : sExternal
		};
	},

	// event handler for allDay switch button
	onAllDayChanged : function(oEv) {
		var bAllDay = oEv.getParameter("state");
		this.setAllDay(bAllDay);
	},

	setAllDay : function(bAllDay) {
		// disable the time input fields
		var bState = bAllDay; // value of control
		this.byId("ft").setVisible(!bState);
		this.byId("tt").setVisible(!bState);
		

		if (bState) {
			var data = this.oViewModel.getData(), h, m, oHelper = this.getView().getModel("vmh");

			data.FromDate.setHours(0, 0, 0, 0);
			data.ToDate.setHours(23, 59, 59, 0);

//			this.byId("ft").setValue("00:00");
//			this.byId("tt").setValue("00:00");
		} else {
			var data = this.oViewModel.getData();
			
			var vmData = this.getView().getModel("vmh").getData();
			var m = vmData.FromDateTime.getMinutes();
			var h = vmData.FromDateTime.getHours();
			data.FromDate.setHours(h, m, 0, 0);
			
			 m = vmData.ToDateTime.getMinutes();
			 h = vmData.ToDateTime.getHours();
			 data.ToDate.setHours(h, m, 0, 0);
			
//			this.byId("ft").setDisplayFormat(locale.getTimePattern("short"));
//			this.byId("tt").setDisplayFormat(locale.getTimePattern("short"));

			// When switch to non AllDay, get default appointment times
//			var current = this.oViewModel.getData();
//			var fDate = current.FromDate;
//			var tDate = current.ToDate;
//			this.setDefaultTimes(fDate, tDate);
//			
//			var timePattern = this.byId("ft").getValueFormat();
//			var timeFormatter = sap.ui.core.format.DateFormat.getTimeInstance({
//				// style : "short"
//				pattern : timePattern
//			});
//			// set value has to be called with format of control - getValueFormat
//			this.byId("ft").setValue(timeFormatter.format(fDate));
//			this.byId("tt").setValue(timeFormatter.format(tDate));
		}

	},

	// helper method to determine a start time for new appointments
	// -> start time : next half hour of system time
	// 7:38 -> 8:00 -> 8:30
	// 7:24 -> 7:30 -> 8:00
	setDefaultTimes : function(oStartDate, oToDate) {

		var oDummyDate = new Date(), ht = oDummyDate.getHours(), h = ht, mt = oDummyDate.getMinutes(), m = mt;

		if (m > 30) {
			// 7:38 -> 8:00 -> 8:30
			ht = h = h + 1;
			m = 0;
			mt = 30;
		} else {
			// 7:24 -> 7:30 -> 8:00
			ht = h + 1;
			m = 30;
			mt = 0;
		}

		oStartDate.setHours(h);
		oStartDate.setMinutes(m);
		oToDate.setHours(ht);
		oToDate.setMinutes(mt);

	},

	setTimeHelperModel : function(oFrom, oTo) {
		var oFromTime = new Date(oFrom), oToTime = new Date(oTo);
		this.getView().getModel("vmh").setData({
			FromDateTime : oFromTime,
			ToDateTime : oToTime
		});
	},

	onTimeToChanged : function() {
		// put time values from helper model to data model
		var data = this.oViewModel.getData(), h, m, oHelper = this.getView().getModel("vmh");

		m = oHelper.oData.FromDateTime.getMinutes();
		h = oHelper.oData.FromDateTime.getHours();
		data.FromDate.setHours(h, m, 0, 0);

		m = oHelper.oData.ToDateTime.getMinutes();
		h = oHelper.oData.ToDateTime.getHours();
		data.ToDate.setHours(h, m, 0, 0);

		// If appointment is on one day, check if end time is after start time
		var startDate = new Date(data.FromDate);
		var endDate = new Date(data.ToDate);

		startDate.setHours(0, 0, 0, 0);
		endDate.setHours(0, 0, 0, 0);

		var startDateMs = startDate.getTime();
		var endDateMs = endDate.getTime();

		if (startDateMs == endDateMs) {

			var startHours = data.FromDate.getHours();
			var startMins = data.FromDate.getMinutes();
			var endHours = data.ToDate.getHours();
			var endMins = data.ToDate.getMinutes();

			if ((startHours * 60 + startMins) > (endHours * 60 + endMins))
			// If end time is before start time, set end time to start time plus 30 minutes
			{
				data.FromDate = new Date(data.ToDate.getTime() - 30 * 60000);
				h = data.FromDate.getHours();
				m = data.FromDate.getMinutes();
				oHelper.oData.FromDateTime.setHours(h, m, 0, 0);
				var DateValue = new Date(oHelper.oData.FromDateTime);

				var locale = new sap.ui.core.LocaleData(sap.ui.getCore().getConfiguration().getLocale());
				var valueFormat =  this.byId("tt").getValueFormat();
				var timeFormatter = sap.ui.core.format.DateFormat.getTimeInstance({
					pattern : valueFormat
				});
				this.byId("ft").setValue(timeFormatter.format(DateValue));
			
			}
		}

	},

	onTimeFromChanged : function() {
		// put time values from helper model to data model
		var data = this.oViewModel.getData(), h, m, oHelper = this.getView().getModel("vmh");

		m = oHelper.oData.FromDateTime.getMinutes();
		h = oHelper.oData.FromDateTime.getHours();
		data.FromDate.setHours(h, m, 0, 0);

		m = oHelper.oData.ToDateTime.getMinutes();
		h = oHelper.oData.ToDateTime.getHours();
		data.ToDate.setHours(h, m, 0, 0);

		// If appointment is on one day, check if end time is after start time
		var startDate = new Date(data.FromDate);
		var endDate = new Date(data.ToDate);

		startDate.setHours(0, 0, 0, 0);
		endDate.setHours(0, 0, 0, 0);

		var startDateMs = startDate.getTime();
		var endDateMs = endDate.getTime();

		if (startDateMs == endDateMs) {

			var startHours = data.FromDate.getHours();
			var startMins = data.FromDate.getMinutes();
			var endHours = data.ToDate.getHours();
			var endMins = data.ToDate.getMinutes();

			if ((startHours * 60 + startMins) > (endHours * 60 + endMins))
			// If end time is before start time, set end time to start time plus 30 minutes
			{
				data.ToDate = new Date(data.FromDate.getTime() + 30 * 60000);
				h = data.ToDate.getHours();
				m = data.ToDate.getMinutes();
				oHelper.oData.ToDateTime.setHours(h, m, 0, 0);
				var DateValue = new Date(oHelper.oData.ToDateTime);

				var locale = new sap.ui.core.LocaleData(sap.ui.getCore().getConfiguration().getLocale());
				var valueFormat =  this.byId("tt").getValueFormat();
				var timeFormatter = sap.ui.core.format.DateFormat.getTimeInstance({
					pattern : valueFormat
				});
				this.byId("tt").setValue(timeFormatter.format(DateValue));
				
			}
		}

	},

	isStartEndDateCorrect: function() {
		// check from date
		var dateFrom = this.byId("fd").getValue();
		var pDateFrom = this.parseDate(dateFrom);
		// check to date
		var dateTo = this.byId("td").getValue();
		var pDateTo = this.parseDate(dateTo);
		// both dates are invalid
		if (!pDateFrom && !pDateTo) {
			sap.ca.ui.message.showMessageBox({
				type : sap.ca.ui.message.Type.WARNING,
				message : this.oBundle.getText("view.Appointment.validStartEndDate")
			});
			return false;
		}
		// start date is invalid
		if (!pDateFrom ) {
			sap.ca.ui.message.showMessageBox({
				type : sap.ca.ui.message.Type.WARNING,
				message : this.oBundle.getText("view.Appointment.validStartDate")
			});
			return false;
		}
		// end date is invalid
		if (!pDateTo ) {
			sap.ca.ui.message.showMessageBox({
				type : sap.ca.ui.message.Type.WARNING,
				message : this.oBundle.getText("view.Appointment.validEndDate")
			});
			return false;
		}
	
		return true;
	},
	
	onFromDateChanged : function(oEvent) {
		
	// disable SaveButton as long as required fields are empty
		this.enableSaveBtn();		
		
		if (!this.isStartEndDateCorrect()) {
			return;
		}

		var datein = this.byId("fd").getValue();
		var pDate = this.parseDate(datein);

		var oDateNow = new Date(), datevalue = this.byId("fd").getValue(), date, data, h, m, y, mo, day, oTimeModel, mf, hf;
		oDateNow.setHours(0, 0, 0, 0);

//      Date entered in control and parsed to give a date object
		date = new Date(pDate);
		
		data = this.oViewModel.getData();

		// to save the h and m -> get them from vmh
		oTimeModel = this.getView().getModel("vmh").getData();
		m = oTimeModel.FromDateTime.getMinutes();
		h = oTimeModel.FromDateTime.getHours();
		data.FromDate.setHours(h, m, 0, 0);

		if (data.FromDate.getTime() > data.ToDate.getTime()) {
			this.byId("td").setValue(datevalue);
			y = date.getFullYear();
			mo = date.getMonth();
			day = date.getDate();
			m = oTimeModel.ToDateTime.getMinutes();
			h = oTimeModel.ToDateTime.getHours();
			data.ToDate.setFullYear(y, mo, day);
			data.ToDate.setHours(h, m, 0, 0);
		// Now check that the start time is before the end time
			mf = oTimeModel.FromDateTime.getMinutes();
			hf = oTimeModel.FromDateTime.getHours();
			
			// Appointment now has same start and end date.  In case that the start time is before end time
			if ((hf * 60 + mf) > (h * 60 + m)) {
				// Make end time = start time plus 30 mins
				data.ToDate = new Date(data.FromDate.getTime() + 30 * 60000);
				oTimeModel.ToDateTime.setMinutes(data.ToDate.getMinutes());
				oTimeModel.ToDateTime.setHours(data.ToDate.getHours());
				var locale = new sap.ui.core.LocaleData(sap.ui.getCore().getConfiguration().getLocale());
				var valueFormat = this.byId("tt").getValueFormat();
				var timeFormatter = sap.ui.core.format.DateFormat.getTimeInstance({pattern: valueFormat});
				this.byId("tt").setValue(timeFormatter.format(oTimeModel.ToDateTime));
//				this.byId("tt").setDisplayFormat(locale.getTimePattern("short"));				
				
			}

			
		}

		// message in case appointment is in the past
		if (date < oDateNow) {
			sap.ca.ui.message.showMessageBox({
				type : sap.ca.ui.message.Type.WARNING,
				message : this.oBundle.getText("view.Appointment.occurspast")
			});
		}
	},

	onToDateChanged : function(oEvent) {
		
		// disable SaveButton as long as required fields are empty
		this.enableSaveBtn();
		
		if (!this.isStartEndDateCorrect()) {
			return;
		}

		var datein = this.byId("td").getValue();
		var pDate = this.parseDate(datein);

		var y, mo, day, m, h, mf, hf, date, qDate, oTimeModel, datevalue, data = this.oViewModel.getData();

		// getValue -> datevalue is a string, pure date with hours 00:00:00
		date = new Date(pDate);

		y = date.getFullYear();
		mo = date.getMonth();
		day = date.getDate();

		data.ToDate.setFullYear(y, mo, day);

		// and get the current time from time helper object
		oTimeModel = this.getView().getModel("vmh").getData();
		m = oTimeModel.ToDateTime.getMinutes();
		h = oTimeModel.ToDateTime.getHours();

		data.ToDate.setHours(h, m, 0, 0);
		
		if (data.FromDate.getTime() > data.ToDate.getTime()) {
			datevalue = this.byId("fd").getValue();
			this.byId("td").setValue(datevalue);
			qDate = this.parseDate(datevalue);

			y = qDate.getFullYear();
			mo = qDate.getMonth();
			day = qDate.getDate();
			data.ToDate.setFullYear(y, mo, day);
			
		// Now check that the start time is before the end time
			mf = oTimeModel.FromDateTime.getMinutes();
			hf = oTimeModel.FromDateTime.getHours();
			
		// In case the start time is after the end time, use start time and add 30 mins for end time	
			if ((hf * 60 + mf) > (h * 60 + m)) {
				data.ToDate = new Date(data.FromDate.getTime() + 30 * 60000);
				oTimeModel.ToDateTime.setMinutes(data.ToDate.getMinutes());
				oTimeModel.ToDateTime.setHours(data.ToDate.getHours());
				var locale = new sap.ui.core.LocaleData(sap.ui.getCore().getConfiguration().getLocale());
				var valueFormat = this.byId("tt").getValueFormat();
				var timeFormatter = sap.ui.core.format.DateFormat.getTimeInstance({pattern: valueFormat});
				this.byId("tt").setValue(timeFormatter.format(oTimeModel.ToDateTime));
//				this.byId("tt").setDisplayFormat(locale.getTimePattern("short"));				
				
			}
			
		}
	},
		
	initAccountF4 : function(oInput) {
		var sAccountAnnotation = cus.crm.mycalendar.util.Schema._getEntityAnnotation(this.oModel,"service-schema-version","Account");
	   cus.crm.mycalendar.util.AccountF4 = {

			getLIItem : function() {

				var oLITemplate = new sap.m.StandardListItem(
						{
							//title :"{parts:[{path:'fullName'}], formatter: 'cus.crm.mycalendar.util.Util.getAccountF4Title'}",
							title :  (sAccountAnnotation === null) ? "{parts:[{path:'name1'}], formatter: 'cus.crm.mycalendar.util.Util.getAccountF4Title'}" : "{parts:[{path:'fullName'}], formatter: 'cus.crm.mycalendar.util.Util.getAccountF4Title'}",
							//description : "{parts:['MainAddress/city', 'MainAddress/country'], formatter: 'cus.crm.mycalendar.util.Formatter.getAccountF4Description'}",
							description : (sAccountAnnotation === null) ? "{parts:['MainAddress/city', 'MainAddress/country'], formatter: 'cus.crm.mycalendar.util.Util.formatAccountPlace'}":"{parts:[{path:'MainAddress/city'}, {path:'MainAddress/country'}, {path:'accountID'}], formatter: 'cus.crm.mycalendar.util.Util.getAccountF4Description'}",
							
							active : true
						});

				return oLITemplate;
			},

			create : function() {
				
				var oAccountF4 = new sap.m.SelectDialog();
				oAccountF4.myLItemplate = this.getLIItem();
             	// attach the filtering functions
				oAccountF4.attachSearch(cus.crm.mycalendar.util.Util.getSearch( (sAccountAnnotation === null) ? "name1" : "fullName"));
				oAccountF4.attachLiveChange(cus.crm.mycalendar.util.Util
						.getLiveSearch((sAccountAnnotation === null) ? "name1" : "fullName"));

				// that = this;
				oAccountF4.triggerSearch = function(value) {

					// Get the binded items
					var itemsBinding = this.getBinding("items");
					var aFilter = [];

					if (value) {
						var selectFilter = new sap.ui.model.Filter( (sAccountAnnotation === null) ? "name1" : "fullName",
								sap.ui.model.FilterOperator.Contains, value);
						
						aFilter.push(selectFilter);
					}

					if (itemsBinding !== undefined) {
						// no binding yet -> binding
						itemsBinding.aApplicationFilters = [];
					}
						this
								.bindAggregation(
										"items",
										{
											path : "/AccountCollection",
											parameters : {
												expand : 'MainAddress',
												select : 'accountID,MainAddress/city,MainAddress/country,' + ((sAccountAnnotation === null) ?'name1' : 'fullName')
											},
											template : this.myLItemplate,
											filters : aFilter
										});
					    
						      itemsBinding = this.getBinding("items");
					    	
						// itemsBinding.filter(aFilter);
			
				};

				return oAccountF4;
			}

		};
	this.oAccF4 = cus.crm.mycalendar.util.AccountF4.create();
	this.oAccF4.setModel(this.getView().getModel("i18n"), "i18n");
	this.oAccF4.setModel(cus.crm.mycalendar.util.Util.getSearchModel(this.oModel, this.isMock));
	
	
	if (this.oAccF4._searchField){
		this.oAccF4._searchField.setPlaceholder(this.oBundle.getText("view.Appointment.searchfieldplaceholder"));			
	}
	if (this.oAccF4._dialog){
		  // fix size 
		  this.oAccF4._dialog.setContentWidth("480px");
		  // a workaround for showing scrollbar in the SelectDialog also with a zoom <65%
		  // the problem shall be fixed with SAPUI5 1.20 
		  this.oAccF4._list.setGrowingThreshold(40);
		//set account f4 help depending on backend version
		  
		
		  
		  
		
		}
	var that = this;
	// attach close handler only once..
	this.oAccF4.attachConfirm(function(evt) {
		var selectedItem = evt.getParameter("selectedItem");
		if (selectedItem) {
			var oAccount = selectedItem.getBindingContext().getObject();
			var sAccount;
		   sAccount =  (sAccountAnnotation !== null) ?  oAccount.fullName :  oAccount.name1;
		   if(sAccount === ""){ 
			   oInput.setValue(oAccount.accountID); 
		   }
		   else{
			   oInput.setValue(sAccount);
		   }
			var data = that.oViewModel.getData();
			data.Account = oAccount.accountID;
            data.AccountTxt = sAccount;
		}
	});
	this.oAccF4.attachCancel(function(evt) {
		// clear the input fields, this is the wanted behaviour now.
		/*that.byId("ia").setValue("");*/
		var oEntity = that.getViewEntity();
		oEntity.Account = "";
		oEntity.AccountTxt = "";
	});
	this.oAccF4._list.attachUpdateStarted(function(oEvent){
		oEvent.getSource().setNoDataText(that.oBundle.getText("view.Appointment.searchlistinfo"));
	  // experimental enhance title with number of hits
		that.oAccF4.setTitle(that.oBundle.getText("view.Appointment.acsea_title", ["0"]));
	});
	this.oAccF4._list.attachUpdateFinished(function(oEvent){
		oEvent.getSource().setNoDataText(that.oBundle.getText("view.Appointment.acsea_nodata"));
		// experimental enhance title with number of hits
		that.oAccF4.setTitle(that.oBundle.getText("view.Appointment.acsea_title", [oEvent.getParameter("total")]));
		
	});
		
	

},
	onF4Account : function(oEvent) {
		var oInput = oEvent.getSource();
		var sValue = oInput.getValue();
		if (!this.oAccF4) {
			this.initAccountF4(oInput);
		}
		
		this.oAccF4.triggerSearch(sValue);
		this.oAccF4.open(sValue);
	},

	// trigger f4 help on input if input available
	onAccountChanged : function(oEvent) {
		if (oEvent.getSource().getValue()) {
		  this.onF4Account(oEvent);
		}
	},
	
	
	// ///////////////////////////////////////////////////////////////////////////////
	// typeahead for account
	// ///////////////////////////////////////////////////////////////////////////////

	   onAccountInputFieldChanged: function(oEvent) {
	       	var accountInput = oEvent.getSource();
	      
	       	this._setAccount("", accountInput.getValue());
	      
	      accountInput.setShowSuggestion(true);
	       //to refresh in same list on press of backspace
	       //	accountInput.removeAllSuggestionItems();
	       	accountInput.setFilterSuggests(false);
	       	var fnCheckAccount = function(aAccounts) {
	       		accountInput.removeAllSuggestionItems();
	       		if(accountInput.getValue().length>0){
	       		for(var i=0 in aAccounts) {
	       			var oAccount = aAccounts[i];
	       			if(oAccount.fullName.toUpperCase() == accountInput.getValue().toUpperCase()) {
	       				this._setAccount(oAccount.accountID, oAccount.fullName);
	       			}
	       			var oCustomData = new sap.ui.core.CustomData({key:"oAccount", value:oAccount});
	       		    if(oAccount.fullName!=""){
		       			var oItem = new sap.ui.core.Item({text:oAccount.fullName, customData:oCustomData});
		       			accountInput.addSuggestionItem(oItem);
		       			}
		       				//if fullname is empty, display account id
		       			
		       			else{
		       				var oItem1 = new sap.ui.core.Item({text:oAccount.accountID, customData:oCustomData});
		       				accountInput.addSuggestionItem(oItem1);
		       			}
	       			
	     
	       		}
	       		}
	       	};
	       	this._readAccount(accountInput.getValue(),fnCheckAccount);
	       },

			_setAccount: function(accountID,account) {
				var data = this.oViewModel.getData();
	      	var accountIDInput = this.getView().byId("accountIDInput");
	      if(accountIDInput){
	       		//accountIDInput.setValue(accountID);
	       		data.Account = accountID;
	      }
	       	var accountInput = this.getView().byId("ia");
	  	     if(account!=""){
		       	accountInput.setValue(account);
		       	 data.AccountTxt = account;
		       	}else{ 
		       	accountInput.setValue(accountID);
	            data.AccountTxt = accountID; 
		       	}
	      
 	
	       },
	       

	     _readAccount: function(searchString,callbackRead) {
	       	var that = this;
	       //	var delay = (searchString ? 100 : 0);
        	//clearTimeout(this.liveChangeTimer);
        	//if(delay) {
        	//this.liveChangeTimer = setTimeout(function () {
		this.oModel.read("/AccountCollection", null,'$top=10&$filter=substringof(%27'+encodeURIComponent(searchString)+'%27,fullName,accountID)', true,
		function(oData, oResponse) {
		var accountData = jQuery.parseJSON(JSON.stringify(oData));
							if(callbackRead)
								callbackRead.call(that,accountData.results);
						},
						function(oError) {
							
							jQuery.sap.log.error("Read failed in NewAppointment->_readAccount:"+oError.response.body);
						}
				);
        		//}, delay);
        	//}
	       },

	       onAccountSuggestItemSelected: function(oEvent) {
	       	var oItem = oEvent.getParameter("selectedItem");
	       
	       	var oAccount = null;
	       	for(var i in oItem.getCustomData()) {
	       		var oCustomData = oItem.getCustomData()[i];
	       		if (oCustomData.getKey() == "oAccount")
	       			oAccount = oCustomData.getValue();
	       		
	       	}
	       /*	if(oAccount.fullName == ""){
	       		this._setAccount(oAccount.accountID,"");
	       		
	       	}*/
	       	this._setAccount(oAccount.accountID, oAccount.fullName);
	       	
	       },
	       
	       	// ///////////////////////////////////////////////////////////////////////////////
	       	// typeahead for contact
	       	// /////////////////////////////////////////////////////////////////////////////// 
	      _setContact : function(contact){
	           var contactInput = this.getView().byId("ic");
	    if(contactInput)
	           contactInput.setValue(contact);
	  },
	    
	  onContactSuggestItemSelected: function(oEvent) {
	   var oItem = oEvent.getParameter("selectedItem");
	   var oContact = null;
	   for(var i in oItem.getCustomData()) {
	           var oCustomData = oItem.getCustomData()[i];
	           if (oCustomData.getKey() == "oContact")
	                  oContact = oCustomData.getValue();
	   }
	 
	   this.byId('ic').setValue(oContact.fullName);
	             //  this.ContactName = oContact.fullName;
	   var data = this.getViewEntity();
	               data.ContactTxt = oContact.fullName;
	   			// get contact ID selected
	   			data.Contact = oContact.contactID;
	   
	   },
	   
	   onContactInputFieldChanged: function(oEvent) {
	     this.byId('ic').setValueState(sap.ui.core.ValueState.None);
	     var contactInput = oEvent.getSource();
	    this._setContact(contactInput.getValue());
	   contactInput.setShowSuggestion(true);
	    //to refresh in same list on press of backspace
	  // contactInput.removeAllSuggestionItems();
	   contactInput.setFilterSuggests(false);
	   var fnCheckContact = function(aContacts) {
           contactInput.removeAllSuggestionItems();
		   if(contactInput.getValue().length>0){
	           for(var i=0 in aContacts) {
	                  var oContact = aContacts[i];
	                  if(oContact.fullName.toUpperCase() == contactInput.getValue().toUpperCase()) {
	                         this._setContact(oContact.fullName);
	                  }
	                  var oCustomData = new sap.ui.core.CustomData({key:"oContact", value:oContact});
	                  var oItem = new sap.ui.core.Item({text:oContact.fullName, customData:oCustomData});
	                  contactInput.addSuggestionItem(oItem);
	           }
		   }
	   };
	   this._readContact(contactInput.getValue(),fnCheckContact);
	   },
	   
	   _readContact: function(searchString,callbackRead) {
	     var that = this.oModel=this.getView().getModel();
	 	//var delay = (searchString ? 500 : 0);
    	//clearTimeout(this.liveChangeTimer);
    	//if(delay) {
    		//this.liveChangeTimer = setTimeout(function () {
	     this.oModel.read("/ContactCollection", null,'$top=10&$filter=substringof(%27'+encodeURIComponent(searchString)+'%27,fullName)', true,
	                                function(oData, oResponse) {
	                                       var contactData = jQuery.parseJSON(JSON.stringify(oData));
	                                       if(callbackRead)
	                                              callbackRead.call(that,contactData.results);
	                                },
	                                function(oError) {
	                                       jQuery.sap.log.error("Read failed in NewAppointment->_readContact:"+oError.response.body);
	                                }
	                  );
    		//}, delay);
    	//}
	           } ,
	           
	           
	       	// ///////////////////////////////////////////////////////////////////////////////
	       	// typeahead for employee
	       	// ///////////////////////////////////////////////////////////////////////////////      
	      
	           _setEmployee : function(employee){
	               var employeeInput = this.getView().byId("responsibleText");
	        if(employeeInput)
	               employeeInput.setValue(employee);
	      },
	        
	        
	      onEmployeeSuggestItemSelected: function(oEvent) {
	       var oItem = oEvent.getParameter("selectedItem");
	       var oEmployee = null;
	       for(var i in oItem.getCustomData()) {
	               var oCustomData = oItem.getCustomData()[i];
	               if (oCustomData.getKey() == "oEmployee")
	                      oEmployee = oCustomData.getValue();
	       }
	       this.byId('responsibleText').setValue(oEmployee.fullName);
	     //change private flaf field based on employee responsible
	       this._setPrivateFlag(oEmployee);
	                   var data = this.getViewEntity();
	                   data.ResponsibleTxt = oEmployee.fullName;
	       			// get contact ID selected
	       			data.Responsible = oEmployee.employeeID;
	       },
	       
	       _setPrivateFlag : function(oEmployee){	    		
		    	if(oEmployee.employeeID !== this.EmpResId )
		        {
		     	   this.byId("pf").setEnabled(false); 
		        }
		        else
		        { 	
		     	   this.byId("pf").setEnabled(true);   
		        }
		    },
		    
	       onEmployeeInputFieldChanged: function(oEvent) {
	         this.byId('responsibleText').setValueState(sap.ui.core.ValueState.None);
	         var employeeInput = oEvent.getSource();
	        this._setEmployee(employeeInput.getValue());
	       //this._adaptAddressFields(false, true);
	       employeeInput.setShowSuggestion(true);
	        //to refresh in same list on press of backspace
	     //  employeeInput.removeAllSuggestionItems();
	       employeeInput.setFilterSuggests(false);
	       var fnCheckEmployee = function(aEmployees) {
	    	   employeeInput.removeAllSuggestionItems();
	    	   if(employeeInput.getValue().length>0){
	               for(var i=0 in aEmployees) {
	                      var oEmployee = aEmployees[i];
	                      if(oEmployee.fullName.toUpperCase() == employeeInput.getValue().toUpperCase()) {
	                             this._setEmployee(oEmployee.fullName);
	                      }
	                      var oCustomData = new sap.ui.core.CustomData({key:"oEmployee", value:oEmployee});
	                      var oItem = new sap.ui.core.Item({text:oEmployee.fullName, customData:oCustomData});
	                      employeeInput.addSuggestionItem(oItem);
	               }
	    	   }
	       };
	       this._readEmployee(employeeInput.getValue(),fnCheckEmployee);
	       },
	       
	       _readEmployee: function(searchString,callbackRead) {
	         var that = this.oModel=this.getView().getModel();
	        // var delay = (searchString ? 500 : 0);
	        	//clearTimeout(this.liveChangeTimer);
	        	//if(delay) {
	        		//this.liveChangeTimer = setTimeout(function () {
	         this.oModel.read("/EmployeeCollection", null,'$top=10&$filter=substringof(%27'+encodeURIComponent(searchString)+'%27,fullName)', true,

	                                    function(oData, oResponse) {
	                                           var employeeData = jQuery.parseJSON(JSON.stringify(oData));
	                                           if(callbackRead)
	                                                  callbackRead.call(that,employeeData.results);
	                                    },
	                                    function(oError) {
	                                           jQuery.sap.log.error("Read failed in NewAppointment->_readEmployee:"+oError.response.body);
	                                    }
	                      );
	        	//	}, delay);
	        	//}
	               } ,
	               
       

	// ///////////////////////////////////////////////////////////////////////////////
	// contact f4
	// ///////////////////////////////////////////////////////////////////////////////
	initContactF4 : function(oInput) {

		if (!this.contactF4Frag) {
			this.initConSearchFragment();
		}

		var oLeftButton = new sap.m.Button();

		// with id
		this.oConF4 = new sap.m.Dialog(this.sViewId + "cd", {
			stretch : jQuery.device.is.phone,
			title: this.oBundle.getText("view.Appointment.consea_title", [ "0" ]), //initial
			content : [this.contactF4Frag[1]],
			leftButton : oLeftButton,
			contentWidth : "480px",
			contentHeight : "2000px",
			subHeader : new sap.m.Bar({
				contentMiddle : [this.contactF4Frag[0]]
			})
		});
		// taken from sap.m.Dialog
		// internally set top and bottom margin of the dialog to 4rem respectively
		this.oConF4.addStyleClass("sapMSelectDialog");
		this.oConF4._iVMargin = 8 * parseInt(sap.ui.core.theming.Parameters.get("sapUiFontSize") || 16, 10);
		this.oConF4.setModel(this.getView().getModel("i18n"), "i18n");
		this.oConF4.setModel(cus.crm.mycalendar.util.Util.getSearchModel(this.oModel, this.isMock), "sm");
		oLeftButton.bindProperty("text", "i18n>view.Appointment.cancel");
		var that = this;
		oLeftButton.attachPress(function(oEvent) {

			that.oConF4.close();
			that.bConF4clicked = false;
			
			// clear the input fields, this is the wanted behaviour now.
			//up-port contact field should not be cleared
			/*that.byId("ic").setValue("");
			var oEntity = that.getViewEntity();
			oEntity.Contact = "";
			oEntity.ContactTxt = "";*/

		});
	},

	onF4Contact : function(oEvent) {

		var oInput = oEvent.getSource();
		if (!this.oConF4) {
			this.initContactF4(oInput);
		}
		var sValue = oInput.getValue();
		var data = this.getViewEntity();
  
		this.bConF4clicked = true;
		this.contactF4Frag.triggerSearch({
			accountid : data.Account,
			accounttext : data.AccountTxt,
			searchvalue : sValue
		});
		this.oConF4.open();
	},

	// trigger f4 help on input if input available
	onContactChanged : function(oEvent) {
		if (oEvent.getSource().getValue()) {
		   this.onF4Contact(oEvent);
		}
	},

	// ///////////////////////////////////////////////////////////

	// adds a new attendee to the helper edit model
	addNewAttendee : function(id, internal, fullname, accountid, sfunctiontxt) {

		var data = this.getViewEntity(), guid = data.Guid, sEnd = "";

		if (!guid) {
			// dummy empty guid in case of create
			guid = "00000000-0000-0000-0000-000000000001";
		}

		if (data.Attendee === undefined) {
			data.Attendee = [];
		}

		this.iCounter += 1;
		sEnd = '000000000000' + this.iCounter;
		sEnd = sEnd.slice(-12); // last 12 places

		// build a attendee object and add it to the collection
		var oAttendee = {
			// dummy empty guid in case of create
			Guid : guid,
			// some dummy generated non existent guid for the partner guid
			PartnerGuid : "00000000-0000-0000-0000-" + sEnd,
			PartnerNo : id,
			IntAttendee : internal,
			Function : sfunctiontxt,
			AccountNo : accountid,
			FullName : fullname
		};

		var oData = this.oEditAttendeeModel.getData();
		oData.Attendee.splice(0, 0, oAttendee);
		this.oEditAttendeeModel.setData(oData);
		
		// adapt title of popup
		this.adaptAttendeePopupTitle();		
	},

	// ///////////////////////////////////////////////////////////////////////////////
	// Edit Attendees parts
	// ///////////////////////////////////////////////////////////////////////////////
	initAttEditFragment : function() {
		this.oAttFrag = sap.ui.xmlfragment(this.sViewId + "attFrag", "cus.crm.mycalendar.view.AttendeeEdit", this);
		this.oAttFrag.setStretch(jQuery.device.is.phone);
		this.oAttFrag.addStyleClass("sapMSelectDialog");
		this.oAttFrag._iVMargin = 8 * parseInt(sap.ui.core.theming.Parameters.get("sapUiFontSize") || 16, 10);

		// a temporary model for the Attendees to be able to revert the changes
		this.oEditAttendeeModel = new sap.ui.model.json.JSONModel({});
		this.oAttFrag.setModel(this.oEditAttendeeModel, "em");
		this.oAttFrag.setModel(this.getView().getModel("i18n"), "i18n");
		this.oAttFrag.setModel(cus.crm.mycalendar.util.Util.getSearchModel(this.oModel, this.isMock), "sm");
	},

	initConSearchFragment : function() {
		this.contactF4Frag = cus.crm.mycalendar.util.Util.createContactSearchFragment(this.sViewId + "contF4", this);
	},

	// does the settings for the edit attendees popup and also opens it
	openEditAttendeeInput : function(searchfragment, bInternal) {

		// init edit helper model
		this.oEditAttendeeModel.setData({});
		var oHelperData = {
			Attendee : []
		};
		// a clone of the attendee
		var data = this.getViewEntity();
		if (data.Attendee) {
			jQuery.each(data.Attendee, function(key, value) {
				var oValueClone = jQuery.extend({}, value);
				oHelperData.Attendee.push(oValueClone);
			});
		}
		this.oEditAttendeeModel.setData(oHelperData);

		var p2 = sap.ui.core.Fragment.byId(this.sViewId + "attFrag", "p2");
		p2.removeAllContent();
		// add the elements of the fragment to the page content, search field to subheader so it does not scroll
		p2.setSubHeader(new sap.m.Bar({
			contentMiddle : [searchfragment[0]]
		}));
		p2.addContent(searchfragment[1]);

		var oList = this.oAttFrag.getContent()[0].getPages()[0].getContent()[0];

		var listbinding = oList.getBinding("items");
		var aFilter = [];
		var oFilter = new sap.ui.model.Filter("IntAttendee", sap.ui.model.FilterOperator.EQ, bInternal);
		aFilter.push(oFilter);
		listbinding.filter(aFilter);
		
		// to have later simple access in which mode the list is in the popup
		oList.data("internal", bInternal);
		// popup title with count
		this.adaptAttendeePopupTitle();
		
		// initial title for search page, to be improved
		var sKey;
		if(bInternal){ 
			sKey = "view.Appointment.internal_titlenew";
			}
		else{
			sKey = "view.Appointment.external_titlenew";
		}
		
		sap.ui.core.Fragment.byId(this.sViewId + "attFrag", "p2").setTitle(this.oBundle.getText(sKey));

		var sText;
		if(bInternal){
			sText = this.oBundle.getText("view.Appointment.nointattendees");
			}
		else{
			sText = this.oBundle.getText("view.Appointment.noextattendees");
		}
				
		oList.setNoDataText(sText);

		this.oAttFrag.open();

		// directly navigate to the search list (p2) in case no employees yet
		if (listbinding.getLength() === 0) {
			this.onAddClicked();
		}

	},

	// this is a workaround for contacts where fullname is not filled
	formatContactName : function(fullname, id) {
		return fullname || ("Name not available " + id);
	},

	// workaround as fullname wasnt available in ES searches
	formatEmployeeName : function(firstname, lastname) {
		return this.oBundle.getText("view.Appointment.employeename", [firstname, lastname]);
	},

	onEditExternalAttendees : function(oEvent) {

		// to be sure, not nice
		this.bExternalSearch = true;
		this.bConF4clicked = false;

		if (!this.extAttF4Frag) {
			this.extAttF4Frag = cus.crm.mycalendar.util.Util.createContactSearchFragment(this.sViewId + "extAttF4", this);
		}

		if (!this.oAttFrag) {
			this.initAttEditFragment();
		}

		this.openEditAttendeeInput(this.extAttF4Frag, false);

	},

	// for the Account filter toolbar -> when clicked -> disappears and back to contact search
	onContactFilterHide : function(oEvent) {
		oEvent.getSource().setVisible(false);
		// back to ContactCollection
		var aFilter = [];
		var sPath = "sm>/ContactCollection";

		// get fragment info from id...
		var sId = oEvent.getSource().getId();
		var sFragId = sId.split("--")[0];
		var oLIT = sap.ui.core.Fragment.byId(sFragId, "lsci");
		var oSF = sap.ui.core.Fragment.byId(sFragId, "sfc");
		
		// take into consideration the value that might be present in the search field
		if (oSF.getValue()){
			aFilter.push(new sap.ui.model.Filter("lastName", sap.ui.model.FilterOperator.Contains, oSF.getValue()));
		}

		oEvent.getSource().getParent().bindAggregation("items", {
			path : sPath,
			template : oLIT,
			filters : aFilter
		});
	},

	onSelectContact : function(oEvent) {

		jQuery.sap.log.info("External Attendee / contact selected");
		var oSelCont = oEvent.getParameter("listItem").getBindingContext("sm").getObject();

		if (this.bConF4clicked) {
			// from the contact F4
			var oInput = this.byId("ic");
			if(oSelCont.fullName){ 
				oInput.setValue(oSelCont.fullName);
				}
			else{ 
				oInput.setValue(oSelCont.contactID);
				}
			var data = this.getViewEntity();
			// get contact ID selected
			data.Contact = oSelCont.contactID;
			// get account ID assigned to the contact
			data.ContactAccount = oSelCont.accountID;
			this.oConF4.close();
			this.bConF4clicked = false;
		} else {
			// in the external attendees popup..
			// workaround for stupid attribute function
			this.addNewAttendee(oSelCont.contactID, false, oSelCont.fullName, oSelCont.accountID, oSelCont["function"]);
			var oNavCont = this.oAttFrag.getContent()[0];
			oNavCont.backToPage(this.sViewId + "attFrag--p1");
		}

	},

	onEditEmployees : function(oEvent) {
		this.bExternalSearch = false;
		if (!this.employeeF4Frag) {

			this.employeeF4Frag = sap.ui.xmlfragment(this.sViewId + "emplSearch", "cus.crm.mycalendar.view.EmployeeSearch",
					this);

			var mySearchList = sap.ui.core.Fragment.byId(this.sViewId + "emplSearch", "lse");
			// get function object for employee search
			this.onEmployeeSearch = cus.crm.mycalendar.util.Util.getSearch("lastName", mySearchList);
			this.onEmployeeLiveChange = cus.crm.mycalendar.util.Util.getLiveSearch("lastName", mySearchList);
			var that = this;
			this.employeeF4Frag.triggerSearch = function() {
				var oSF = sap.ui.core.Fragment.byId(that.sViewId + "emplSearch", "sfe");
				var oLIT = sap.ui.core.Fragment.byId(that.sViewId + "emplSearch", "lsei");
				oSF.setValue("");
			// remove template, because data binding will clone this template / avoid empty oData call
				mySearchList.removeItem(oLIT);
				mySearchList.bindAggregation("items", {
					path : "sm>/EmployeeCollection",
					parameters : {
						expand : 'WorkAddress,Company'						
					},
					template : oLIT
				});
				
			};
		}

		if (!this.oAttFrag) {
			this.initAttEditFragment();
		}

		this.openEditAttendeeInput(this.employeeF4Frag, true);

	},

	onNavBack : function(oEvent) {
		// navigate to search page
		var oNavCont = this.oAttFrag.getContent()[0];
		oNavCont.backToPage(this.sViewId + "attFrag--p1");
	},

	onOKDialog : function(oEvent) {
		this.oAttFrag.close();

		// take over the edit Attendee model to the view entity.
		var oEditData = this.oEditAttendeeModel.getData();
		var data = this.getViewEntity();
		data.Attendee = oEditData.Attendee;

		// take over the ones to delete
		if(data.delAttendee){
			data.delAttendee = data.delAttendee.concat(data.delAttendeeTemp);
		}
		else{
			data.delAttendee = data.delAttendeeTemp;
		}
		delete data.delAttendeeTemp;

		// adapt attendee strings.
		var oDisplayAttendee = this.getAttendeeStrings(data.Attendee);
		this.byId("atin").setText(oDisplayAttendee.internal);
		this.byId("atex").setText(oDisplayAttendee.external);
	},

	onCancelDialog : function(oEvent) {
		this.oAttFrag.close();
		var data = this.getViewEntity();
		delete data.delAttendeeTemp;
	},

	onDeleteAttendee : function(oEvent) {

		var oItem = oEvent.getParameter("listItem");
		var oList = oItem.getParent();
		var oSelAttendee = oItem.getBindingContext("em").getObject();
        
		if (oSelAttendee.PartnerGuid.substring(0, 23) !== "00000000-0000-0000-0000") {
			// an already saved one, keep it for deletion
			var oDelAttendee = {
				Guid : oSelAttendee.Guid,
				PartnerGuid : oSelAttendee.PartnerGuid,
				PartnerNo : "",
				PartnerPft : "",
				PartnerFct : ""
			};
			var data = this.getViewEntity();
			if (!data.delAttendeeTemp) {
				data.delAttendeeTemp = [];
			}
			data.delAttendeeTemp.push(oDelAttendee);
		}

		var data = this.oEditAttendeeModel.getData();
		for ( var i = 0; i < data.Attendee.length; i++) {
			if (data.Attendee[i].PartnerGuid === oSelAttendee.PartnerGuid) {
				data.Attendee.splice(i, 1);
				break;
			}
		}
/*	Commented for INternal incident:1472000838 
 * 	oList.setMode(sap.m.ListMode.None);
		
		
		oList.attachEventOnce("updateFinished",null,function(){
			oList.setMode(sap.m.ListMode.Delete);
		},oList);*/
		
		this.oEditAttendeeModel.refresh();
		
		
		
		
		// adapt title of popup
		this.adaptAttendeePopupTitle();

	},

	adaptAttendeePopupTitle: function(){
		
		var oList = this.oAttFrag.getContent()[0].getPages()[0].getContent()[0];
		var bInternal = oList.data("internal");
		var sKey;
		if(bInternal){ 
			sKey = "view.Appointment.internal_title";
			}
		else{
			sKey = "view.Appointment.external_title";
		}
		
		var listbinding = oList.getBinding("items");
		var sAttLength = listbinding.getLength();
		var sTitle = this.oBundle.getText(sKey, [sAttLength]);
		
		sap.ui.core.Fragment.byId(this.sViewId + "attFrag", "tit").setText(sTitle);
		
	},
	
	onSelectEmployee : function(oEvent) {

		var oLI = oEvent.getParameter("listItem"), fulln = oLI.getTitle();
		// read the custom data from the list item
		var sAccountID = oLI.data("compid"), sFunction = oLI.data("func"), sEmployeeID = oLI.data("empid");
		this.addNewAttendee(sEmployeeID, true, fulln, sAccountID, sFunction);
		this.oAttFrag.getContent()[0].backToPage(this.sViewId + "attFrag--p1");

	},

	onCancelSearch : function(oEvent) {
		// TODO when no attendees maybe directly go back
		//this.onNavBack(oEvent);
	    //WHEN USER CLICKS ON CANCEL,THE ACTION CLOSES THE POPUP.
		this.oAttFrag.close();
		var data = this.getViewEntity();
		delete data.delAttendeeTemp;
	},
	
	onPrivateChanged : function(oEvent)
    {            
          var oData = this.getView().getModel("vm").oData;
          if(this.newAppointment){   //Fix for message:1482000731
                 this.byId("responsibleText").setValue(this.ResponsibleTxt);
          }
          if(oData.Responsible !== "" && oData.Responsible !== null && oData.Responsible !== undefined &&
                        oData.Responsible == this.EmpResId  && this.byId("pf").getState())
          {      //disable Employee field
                 this.byId("responsibleText").setEnabled(false);
          }
          else 
          {      //enable Employee field
                 this.byId("responsibleText").setEnabled(true);
          }
    },

	onAddClicked : function(oEvent) {
		// navigate to search page

		// initialize search:
		if (this.bExternalSearch) {
			// check if account id available:
			var data = this.getViewEntity();
			this.extAttF4Frag.triggerSearch({
				accountid : data.Account,
				accounttext : data.AccountTxt
			});
		} else {
			// trigger internal initial search
			this.employeeF4Frag.triggerSearch();
		}

		var oNavCont = this.oAttFrag.getContent()[0];
		oNavCont.to(this.sViewId + "attFrag--p2");
	},

	onEmployeeSearch : function(oEvent) {
		this.onEmployeeSearch(oEvent);
	},

	onEmployeeLiveChange : function(oEvent) {
		this.onEmployeeLiveChange(oEvent);
	},

	onContactSearch : function(oEvent) {
		// get fragment info from oEvent? not so nice

		if (this.bConF4clicked) {
			this.contactF4Frag.onContactSearch(oEvent);
		} else {
			this.extAttF4Frag.onContactSearch(oEvent);
		}
	},

	onContactLiveChange : function(oEvent) {
		// get fragment info
		if (this.bConF4clicked) {
			this.contactF4Frag.onContactLiveChange(oEvent);
		} else {
			this.extAttF4Frag.onContactLiveChange(oEvent);
		}
	},
	
	onContactListUpdateStart: function(oEvent){
		var sTitle = "";
		oEvent.getSource().setNoDataText(this.oBundle.getText("view.Appointment.searchlistinfo"));
	// experimental - set count in title
		if (this.bConF4clicked) {
		  sTitle = this.oBundle.getText("view.Appointment.consea_title", ["0"]);
		  this.oConF4.setTitle(sTitle);
		} else {
			sTitle = this.oBundle.getText("view.Appointment.external_titlenew", ["0"]);
			sap.ui.core.Fragment.byId(this.sViewId + "attFrag", "p2").setTitle(sTitle);
		}
	},
	
	onContactListUpdateFinished: function(oEvent){
		var sTitle = "";
		oEvent.getSource().setNoDataText(this.oBundle.getText("view.Appointment.consea_nodata"));
		// experimental - set count in title
		if (this.bConF4clicked) {
		  sTitle = this.oBundle.getText("view.Appointment.consea_title", [oEvent.getParameter("total")]);
		  this.oConF4.setTitle(sTitle);
		} else {
			sTitle = this.oBundle.getText("view.Appointment.external_titlenew", [oEvent.getParameter("total")]);
			sap.ui.core.Fragment.byId(this.sViewId + "attFrag", "p2").setTitle(sTitle);
		}
	},
	
	onEmployeeListUpdateStart: function(oEvent){
		oEvent.getSource().setNoDataText(this.oBundle.getText("view.Appointment.searchlistinfo"));
		var sTitle = this.oBundle.getText("view.Appointment.internal_titlenew", ["0"]);
		sap.ui.core.Fragment.byId(this.sViewId + "attFrag", "p2").setTitle(sTitle);
	},
	
	onEmployeeListUpdateFinished: function(oEvent){
		oEvent.getSource().setNoDataText(this.oBundle.getText("view.Appointment.nointattendees"));
		var sTitle = this.oBundle.getText("view.Appointment.internal_titlenew", [oEvent.getParameter("total")]);
		sap.ui.core.Fragment.byId(this.sViewId + "attFrag", "p2").setTitle(sTitle);
	},
	
	// //////////////////////////END EDIT Attendees ////////////////////////////////

	getParentApptId : function(){
		
		var str = this.getView().getBindingContext().getPath();
		str = str.slice(21);
		str = str.slice(0,-2);
		return str;
	},
	
	onBackNavigate: function(){
		var sGUID = this.getAppointment().Guid;
		if(this.followup)
			{
			sGUID = this.getParentApptId();
			}
		
		// unbind model from views
		this.getView().unbindElement();
		var oAttView2 = this.byId("attachmentsView_chg1");
		oAttView2.unbindElement();

		// navigate
		var h =  new sap.ui.core.routing.History.getInstance();
		if (this.bUpdate) {
			  // update mode: check if appointment detail is last view in history
				var sDetailURL = this.oRouter.getURL("appointment", {AppointmentID: sGUID});
				if (h.getDirection(sDetailURL) === sap.ui.core.routing.HistoryDirection.Backwards) {
					// appointment detail was last view in history
					window.history.go(-1);
				} else if (h.getDirection("") == sap.ui.core.routing.HistoryDirection.Unknown) {
					// cross app navigation use case
					window.history.go(-1);
				} else {
					// deep linking use case
					this.oRouter.navTo("appointment", {AppointmentID: sGUID}, true); // overwrite url	
				}
		}
		else if (this.followup)
		{
			this.oRouter.navTo("appointment", {AppointmentID: sGUID}, true);
		}
		else {
			// create mode: check if history exists then nav back else nav to calendar
			var dir = h.getDirection(""); 
			if (dir && dir == sap.ui.core.routing.HistoryDirection.Unknown) {
				if ( this.createdfromNotes ) 
				 { window.history.go(-2);
				   this.createdfromNotes = false;
				 }
				else if ( this.createFromOppt ) 
			 		{ window.history.go(-2);
			 		  this.createFromOppt = false;
			 		}
				else if ( this.createFromTasks ) 
					 { window.history.back();
					   this.createFromTasks = false;
					 }
				else if ( this.createFromAccount ) 
					 { window.history.go(-1);
					   this.createFromAccount = false;
					 }
				else
				{ 
					//window.history.go(-1); 
					 var oDateFrom = this.getAppointment().FromDate;
					var sDate = this.getDateParameterfromDate(oDateFrom);
						this.oRouter.navTo("week", {Date: sDate}, true);
					
					}
			} else {
				if ( this.createdfromNotes ) 
				 { window.history.go(-2);
				   this.createdfromNotes = false;
				 }
				else if ( this.createFromOppt ) 
			 							 { window.history.go(-2);
			 							   this.createFromOppt = false;
			 							 }
				else if(this.createFromTasks)
				{
					window.history.back();
					//console.log("navigating to opportunity"+this.createFromOppt);
					this.createFromTasks = false;
				 }
				else if ( this.createFromAccount ) 
				{ 
					window.history.go(-1);
					this.createFromAccount = false;
				}
				else
				this.navigateToCalendar();
			}
		}		
	},
	
	onBack : function(oEvent) {
		var that = this;
		var sViewMode = this._getViewMode();
		if (this.checkEntityChanged() || sViewMode === "CREATE"){
			//	sap.ca.ui.dialog.confirmation.open didnt match exactly our mockup
			sap.m.MessageBox.show(
					this.oBundle.getText("view.Appointment.leaveeditmessage"),
		      sap.m.MessageBox.Icon.WARNING,
		      sap.ca.ui.utils.resourcebundle.getText("messagetype.warning"), //ähem..
		      [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
		      function(oAction) { 
						if (oAction === sap.m.MessageBox.Action.OK){
							that.onBackNavigate();
						}
					}
			 );
		} else {
		   this.onBackNavigate();
		}
	},

	// a simple method to compare if changes have been done to the object in the view.
	checkEntityChanged: function() {
		var bChanged = false;
		
		if (this.oStartEntityString){
			
			 var oStartEntity = JSON.parse(this.oStartEntityString);
			 var oViewEntity = this.getViewEntity();
			 var key;
			
			 //do a sanity check on the start entity to be compared 
//			 for(key in oStartEntity){
//				 if(!oViewEntity.hasOwnProperty(key)){
//					 delete oStartEntity[key];
//				 }
//			 }
			 
			 this._deepSanitize(oStartEntity,oViewEntity);
			
			if(JSON.stringify(oStartEntity) === JSON.stringify(oViewEntity) ){
				bChanged = false;
			} else {
				bChanged = true;
			}
		}		
		return bChanged;
	},
	
	onCancel : function(oEvent) {
		this.onBack();
		this.followupappointment=false;
		this.followupappointmentfromtask=false;
		this.newappointmentfromoppt=false;
		this.newappointmentfromaccount=false;
		this.newAppointment=false;
	},

	// ///////////////////////////////////////////////////////////////////////////////
	// save Appointment part:
	// ///////////////////////////////////////////////////////////////////////////////

	onSave : function(oEvent) {
	// publish entity after validation
		if (this.validateNewAppointment()) {
			var oEntity = this.getAppointment();
			this.saveAppointment(oEntity);
			this.byId("responsibleText").setEnabled(true);
		}
	},
	
//Enable the Savebutton only when all mandatory fields are filled	
	enableSaveBtn:function () {		
		var oEntity = this.getAppointment();
		if (oEntity){
			if (oEntity.Description !== "" 
					&& oEntity.FromDate !== null
					&& oEntity.ToDate !== null) {
				this.byId("bs").setEnabled(true);
			} else {
				this.byId("bs").setEnabled(false);
			}
		}
		 /**
		 * @ControllerHook extHookEnableSaveBtn provides the flexibility to decide if the save button has to be enabled for the fields added by the customer to the new appointments page.
		 *                 
		 *                 
		 * @callback sap.ca.scfld.md.controller.BaseFullScreenController~extHookEnableSaveBtn
		 * @return {void}
		 */
	  if (this.extHookEnableSaveBtn){
			this.extHookEnableSaveBtn();
		}	
	},


	// validation method, implement in a suitable way
	validateNewAppointment : function() {

		var bOk = true, oEntity = this.getAppointment();
		var startTimezoneOffset;
		var endTimezoneOffset;
		var startTimezoneOffsetMs;
		var endTimezoneOffsetMs;
		
		

		// remove leading / trailing spaces from entity description aka title
		oEntity.Description = jQuery.trim(oEntity.Description);
		// and from location
		oEntity.Location = jQuery.trim(oEntity.Location);

		// check validity of dates
		if (!this.isStartEndDateCorrect()) {
			bOk = false;
		}
		
		if (oEntity.AllDay) {
// All Day processing in oData Requires the original date according to the user time zone is supplied
// Offset is returned in mins
//			oEntity.FromDate.setHours(0, 0, 0, 0);
//			oEntity.ToDate.setHours(23, 59, 59, 0);

			startTimezoneOffset = oEntity.FromDate.getTimezoneOffset();
			endTimezoneOffset = oEntity.ToDate.getTimezoneOffset();	
			
			startTimezoneOffsetMs = startTimezoneOffset * 60 * 1000;
			endTimezoneOffsetMs = endTimezoneOffset * 60 * 1000;			
			
			oEntity.FromDate.setTime( oEntity.FromDate.getTime() - startTimezoneOffsetMs );
			oEntity.ToDate.setTime( oEntity.ToDate.getTime() - endTimezoneOffsetMs );

		}
		
		if (!oEntity.Description) {
			sap.ca.ui.message.showMessageBox({
				type : sap.ca.ui.message.Type.WARNING,
				message : this.oBundle.getText("view.Appointment.notitle")
			});
			bOk = false;
		}
		 /**
		 * @ControllerHook extHookValidateAdditionalFields provides for client side validations of the fields added by the customer to the new appointments page.
		 * @callback sap.ca.scfld.md.controller.BaseFullScreenController~extHookValidateAdditionalFields
		 * @return {void}
		 */
	  if (this.extHookValidateAdditionalFields){
			bOk = this.extHookValidateAdditionalFields();
		}
		return bOk;
	},

	// returns a the appointment entity for later save call
	getAppointment : function() {
		var oEntity = this.getViewEntity();
		oEntity = this.prepareEntity(oEntity);
		return oEntity;
	},

	prepareEntity : function(oEntity) {

		// make entity small

		// maybe not necessary, just in case
		if (oEntity.Attendee) {
			for ( var i = 0; i < oEntity.Attendee.length; i++) {
				delete oEntity.Attendee[i].__metadata;
			}
		}

		

		// logic for deletion, tbc
		if (oEntity.Contact && !oEntity.ContactTxt) {
			oEntity.Contact = "";
		}

		// simplify oEntity ---
		delete oEntity.AppointmentToAttachment;

		// not needed info
		delete oEntity.PriorityTxt;
		delete oEntity.StatusTxt;

		// delete oEntity.Attendee;
		delete oEntity.__metadata;
		delete oEntity.AccountRel;
		delete oEntity.ContactRel;
		delete oEntity.EmployeeRel;

		 /**
		 * @ControllerHook extHookPrepareEntity provides for additional properties that can be added to or removed from the Appointment entity json.
		 *                 
		 * @callback sap.ca.scfld.md.controller.BaseFullScreenController~extHookPrepareEntity
		 * @param {object}
		 *           oEntity
		 * @return {void}
		 */
	  if (this.extHookPrepareEntity){
			oEntity = this.extHookPrepareEntity(oEntity);
		}
		return oEntity;
	},

	// listener to the create/update from the NewAppointmentView
	saveAppointment : function(oEntity) {

		// array for batch operations
		var aBatch = [], that = this;

		this.oBusyDialog.open();
		
		if (this.isMock) {
			// back navigation
			this.successSave({}, null);
			return;
	  } 

		if (oEntity.Guid) {
				// update case -> we need to update /AppointmentSet and /AttendeeSet if necessary

        // for backend, send "first" the deletions
				if (oEntity.delAttendee) {
					this.oDelAttendeeBackup = oEntity.delAttendee;
					
					jQuery.each(oEntity.delAttendee, function(indx, val) {
						// val -> AttendeeSet / currently take only new ones but with put.
						aBatch.push(that.oModel.createBatchOperation("/AttendeeSet(Guid=guid'" + val.Guid + "',PartnerGuid=guid'"
								+ val.PartnerGuid + "')", "PUT", val));
					});

			  }

				delete oEntity.delAttendee;
				delete oEntity.delAttendeeTemp; // just in case
				
				
				// for backend, and "then" the  creates
				var aAttendeesToUpdate = oEntity.Attendee;
				// to keep state for save error case
				this.oAttendeesToUpdateBackup = oEntity.Attendee;

				if (aAttendeesToUpdate) {

					that = this;
					jQuery.each(aAttendeesToUpdate, function(indx, val) {
						// val -> AttendeeSet / currently take only new ones but with put.
						
					
						if (val.PartnerGuid.substring(0, 23) === "00000000-0000-0000-0000") {
							aBatch.push(that.oModel.createBatchOperation("/AttendeeSet(Guid=guid'" + val.Guid + "',PartnerGuid=guid'"
									+ val.PartnerGuid + "')", "PUT", val));
						}
					});
				}
				delete oEntity.Attendee;
				
                  
				var oETag = null;
				
				if(parseFloat(this.sBackendVersion) >= 4.0){
				         oETag = { sETag : cus.crm.mycalendar.util.Util._getETag()};	
				}
				aBatch.push(this.oModel.createBatchOperation("/AppointmentSet(guid'" + oEntity.Guid + "')", "PUT", oEntity,oETag));
			
				/**
				 * @ControllerHook extHookSaveAppointmentOnEdit provides the flexibility to add additonal update requests to the custom fields added as a part of the $batch request. This is provided while editing an existing appointment.
				 * @callback sap.ca.scfld.md.controller.BaseFullScreenController~extHookSaveAppointmentOnEdit
				 * @param {object} oEntity
				 * @param {object} aBatch  
				 * @return {void}
				 */
			  if (this.extHookSaveAppointmentOnEdit){
					 this.extHookSaveAppointmentOnEdit(oEntity,aBatch);
				}
			  
				this.oModel.addBatchChangeOperations(aBatch);
				this.oModel.submitBatch(jQuery.proxy(this.successSave, this), jQuery.proxy(this.errorSave, this));

			} else {
				// create case
				delete oEntity.Id;
				  delete oEntity.delAttendee; // just in case
				  delete oEntity.delAttendeeTemp; // just in case
				  aBatch.push(this.oModel.createBatchOperation("/AppointmentSet", "POST", oEntity));
				
				  /**
					 * @ControllerHook extHookSaveAppointmentOnCreate provides the flexibility to add additonal update requests to the custom fields added as a part of the $batch request. This is provided while creating an existing appointment.
					 * @callback sap.ca.scfld.md.controller.BaseFullScreenController~extHookSaveAppointmentOnCreate
					 * @param {object} oEntity
					 * @param {object} aBatch  
					 * @return {void}
					 */
				  if (this.extHookSaveAppointmentOnCreate){
						 this.extHookSaveAppointmentOnCreate(oEntity,aBatch);
					}
				  
				  this.oModel.addBatchChangeOperations(aBatch);
				  this.oModel.submitBatch(jQuery.proxy(this.successSave, this), jQuery.proxy(this.errorSave, this));
				
			}

	},

	// success message
	successSave : function(oData, response) {
		// message toast
		var that = this, bError = false, batchResp, sMessage;
		var followUpGuid;
		var b412Error = false;
		var sViewMode = this._getViewMode();
		if(sViewMode === "CREATE"){
        followUpGuid = response.data.__batchResponses[0].__changeResponses[0].data.Guid;
		}
		else{
			followUpGuid=this.getParentApptId();
		}
		this.oBusyDialog.close();

		if (oData.hasOwnProperty("__batchResponses")) {
			// result from a batch call
			jQuery.sap.log.info("start read batch responses");

			for ( var i = 0; i < oData.__batchResponses.length; i++) {
				batchResp = oData.__batchResponses[i];
				if (batchResp.hasOwnProperty("response") && batchResp.response.statusCode >= '400') {
					
					
					if(batchResp.response.statusCode === '412'){
						b412Error = true;
						break;
					}
					// resp with error -> message
					jQuery.sap.log.error("response error from batch call");
					that.errorSave(batchResp);
					bError = true;
				}
			}
		}

	    if(b412Error){
	    	
	    	
	    	sap.ca.ui.message.showMessageBox({
				type : sap.ca.ui.message.Type.ERROR,
				message : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('MSG_CONFLICTING_DATA')
			},jQuery.proxy(function(){
				this._refreshAppointment();
			},this));
	    	
	    	return;
	    }
		if (!bError) {
			jQuery.sap.log.info("all responses ok");
			if (this.isMock){
			  sap.ca.ui.message.showMessageToast("Not yet suppported in mock mode");
			} else {
			  
				if(this.followupappointment || this.followupappointmentfromtask || this.newappointmentfromoppt
						|| this.newappointmentfromaccount)
				{
					
					if(this.newappointmentfromaccount){			
						// Notify listeners for the event that appointment has been created.
						sap.ui.getCore().getEventBus().publish("cus.crm.mycalendar", "appointmentCreated");
						
						var message = this.oBundle.getText(
						"view.Appointment.savesuccess");
						sap.m.MessageToast.show(message, {
						closeOnBrowserNavigation : false
						});
					} else {
						// Notify listeners for the event that appointment has been created as follow up.
						sap.ui.getCore().getEventBus().publish("cus.crm.mycalendar", "followUpAppointmentCreated");
	
						var message = this.oBundle.getText(
						"view.Appointment.followupsuccessful");
						sap.m.MessageToast.show(message, {
						closeOnBrowserNavigation : false
						});
					};
				}
			else{
				// Notify listeners for the event that appointment has been edited.
				if(this.Context) {
					sap.ui.getCore().getEventBus().publish("cus.crm.mycalendar", "appointmentChanged", {
						contextPath : this.Context
					});
				}

				sMessage = this.oBundle.getText("view.Appointment.savesuccess");
				sap.ca.ui.message.showMessageToast(sMessage);}
		
			}
			// clear references
			if(this.followup || this.createFromOppt ||this.createFromTasks ||this.createdfromNotes ||this.newAppointment)
				{
				var sGUID = followUpGuid;
				}
			this.getView().unbindElement();
			var oAttView2 = this.byId("attachmentsView_chg1");
			oAttView2.unbindElement();
			// navigate back to week calendar after save
			
			if (this.createdfromNotes) {
				/*window.history.go(-2);*/
				this.oRouter.navTo("appointment", {AppointmentID: sGUID}, true);
				
				this.createdfromNotes = false;
			} 
			else if(this.followup)
			{
			this.oRouter.navTo("appointment", {AppointmentID: sGUID}, true);
			
			}
			else if(this.createFromOppt)
		 						{
									/*window.history.go(-2);*/
									this.oRouter.navTo("appointment", {AppointmentID: sGUID}, true);
		 							//console.log("navigating to opportunity"+this.createFromOppt);
		 							this.createFromOppt = false;
		 						}
			else if(this.createFromTasks)
				{
					/*window.history.go(-2);*/
					this.oRouter.navTo("appointment", {AppointmentID: sGUID}, true);
					//console.log("navigating to opportunity"+this.createFromOppt);
					this.createFromTasks = false;
				}
			else if(this.newAppointment)
			{
				/*window.history.go(-2);*/
				this.oRouter.navTo("appointment", {AppointmentID: sGUID}, true);
				//console.log("navigating to opportunity"+this.createFromOppt);
				this.newAppointment = false;
			}
			else if(this.createFromAccount)
			{
				window.history.back();
				this.createFromAccount = false;
			}
				
			else {
			this.navigateToCalendar();
			}
		}

		this.followupappointment=false;
		this.followupappointmentfromtask=false;
		this.newappointmentfromoppt=false;
		this.newappointmentfromaccount=false;
		this.newAppointment=false;
		
		
	},
	
	navigateToCalendar: function() {
		var oDateFrom = this.getViewEntity().FromDate;
		if (!oDateFrom) {
			oDateFrom = new Date();
		}
		var sDate = this.getDateParameterfromDate(oDateFrom);
		//this.oRouter.navTo("week", {Date: sDate}, true);  // overwrite url	
		if(this.bUpdate)
			window.history.go(-1);
		else if (this.followup)
			{this.oRouter.navTo("week", {Date: sDate}, true);}//window.history.go(-1);
		else
			this.oRouter.navTo("week", {Date: sDate}, true);
	},

	// callback method in save error case, TODO clarify what to display
	errorSave : function(oError) {
		var oEntity = this.getViewEntity();
		// restore attendee stuff lost in saveAppointment method.
		oEntity.Attendee = this.oAttendeesToUpdateBackup;
		oEntity.delAttendee = this.oDelAttendeeBackup;
		jQuery.sap.log.error("oData batch save failed");
		this.oBusyDialog.close();
		cus.crm.mycalendar.util.Util.showErrorMessagePopup(oError);
	},

	validateTimes : function(start, end) {

		var startDate = new Date(start);
		var endDate = new Date(end);

		startDate.setHours(0, 0, 0, 0);
		endDate.setHours(0, 0, 0, 0);

		var startDateMs = startDate.getTime();
		var endDateMs = endDate.getTime();

		// Check first that Start Date is not after End Date
		if (startDateMs > endDateMs) {
			sap.ca.ui.message.showMessageBox({
				type : sap.ca.ui.message.Type.ERROR,
				message : this.oBundle.getText("view.Appointment.wrongDates")
			});
			return false;
		}

		// Check that for an Appointment on One Date, End Time is after Start Time
		if (startDateMs === endDateMs) {
			var startDateTime = new Date(start);
			var endDateTime = new Date(end);

			startDateTime.setSeconds(0, 0);
			endDateTime.setSeconds(0, 0);

			if (startDateTime.getTime() > endDateTime.getTime()) {
				sap.ca.ui.message.showMessageBox({
					type : sap.ca.ui.message.Type.ERROR,
					message : this.oBundle.getText("view.Appointment.wrongTimes")
				});
				return false;
			}
		}
		return true;

	},

	parseDate : function(dateString) {

		var dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({
			style : "long"
		});

		var oDate = dateFormatter.parse(dateString);

		return oDate;
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
	
		// transformation of datestring in mockmode
	adaptMockDate: function(sDate){
		var oDate = sDate.replace("/Date(", "").replace(")/", "");
		oDate = parseInt(oDate); // number ms
		return oDate = new Date(oDate);		
	},
    descriptionChanged : function(oEvent){
	    
		var sText = oEvent.getParameters().newValue;
	    var oData = this.getView().getModel('vm').oData;
	    oData.Description = sText;
	    this.enableSaveBtn();
	},
onF4Employee : function(oEvent){
		
	    var oModel = this.getView().getModel('vm'); 
	    var sEmpText = this.byId('responsibleText').getValue();
	    var oData = oModel.oData;
		if(!this.oEmpF4){
	    	  cus.crm.mycalendar.util.Util.initEmployeeF4(this,oEvent.getSource(),oModel);
	      }
	      
	    cus.crm.mycalendar.util.Util.showEmployeeF4(this,sEmpText,oData.Account,oData.AccountTxt);
	   this.ResponsibleID =  oData.Responsible ; 
	},
	
	_removeCrossAppAttributes : function(){
		delete this.Responsible;
		delete this.ResponsibleTxt;
		delete this.ContactName;
		delete this.ContactID;
		delete this.AccountName;
		delete this.AccountID;
	},
	
	_deepSanitize : function(a,b){
		var k;
		if(a instanceof Array && b instanceof Array){
		   for(k in b){
			   this._deepSanitize(a[k],b[k]);
		   }	
		   return;
		}
		
		if(a instanceof Object && b instanceof Object){
			for(k in a){
				 if(!b.hasOwnProperty(k)){
					 delete a[k];
				 }
				 else{
					 this._deepSanitize(a[k],b[k]);
				 }
			}
		}
		},
		
		_scrollToTop : function(){
			this.byId("p").scrollTo(0);
		},
		
		_setViewMode : function(sMode){
			this.getView().getModel("viewState").oData.Mode = sMode;
		},
		
		_getViewMode : function(){
			return this.getView().getModel("viewState").oData.Mode;
		},
		
		_interopChecks : function(sBackendVersion){
			
			if(parseFloat(sBackendVersion) >= 4){
				this.byId("priority").setVisible(true);
			}
			else{
				this.byId("priority").setVisible(false);
			}
		},
		
		_refreshAppointment : function(){
			this.editAppointment(this.sEntityPath, this.sApptGuid);
			//this.oModel.refresh();
			cus.crm.mycalendar.util.Util._fetchETag(this.sEntityPath,this.oModel);
		}
		
		

});
