/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
 jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.utils.busydialog");
jQuery.sap.require("cus.crm.opportunity.util.schema");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("cus.crm.opportunity.util.Formatter");
jQuery.sap.require("cus.crm.opportunity.util.Util");
sap.ca.scfld.md.controller.BaseDetailController
.extend(
		"cus.crm.opportunity.view.S5",
		{   s3Controller : {},
			oSelectedEmployee : {},
			oSelectedAccount : {},
			oSelectedContact : {},
			s2Controller : {},
			ContextPath : "",
			processType : "",
			StatusProfile : "",
			UserStatusCode : "",
			UserStatusText : "",
			WinStatusCode: "",
			LostStatusCode: "",
			oldcosValue: "",
			OldvolumeValue: "",
			ContactCollection : [],
			Currencies : [] ,
			currencymessage : "", 
			s3Controller_contact :"", 
			accountf4open:"",
			partnerDeterminationMap : {},
			oPartnerFunctionsTemplate : new sap.m.StandardListItem({title : "{json>PartnerFunctionName}",key : "{json>PartnerFunctionCategory}"}),
			accountListItemTemplate2 : new sap.m.StandardListItem({
				title : '{PartnersBasedOnType>account2FullName}',
				description : '{PartnersBasedOnType>account2ID}'
			}),
			accountListItemTemplate : new sap.m.ObjectListItem(	{title : '{json>name1}'})
			.addAttribute(new sap.m.ObjectAttribute ({text : '{json>accountID}'}))
			.addCustomData(new sap.ui.core.CustomData({key : 'ID', value : '{json>accountID}'})),
		    
		    
		    contactListItemTemplate : new sap.m.ObjectListItem({title : '{json>fullName}'})
			.addAttribute(new sap.m.ObjectAttribute ({text : '{json>contactID}'}))
			.addCustomData(new sap.ui.core.CustomData({key : 'ID', value : '{json>contactID}'})),			
		    
		
			employeeListItemTemplate : new sap.m.ObjectListItem({title : '{json>fullName}'})
			.addAttribute(new sap.m.ObjectAttribute ({text : '{json>employeeID}'}))
			.addCustomData(new sap.ui.core.CustomData({key : 'ID', value : '{json>employeeID}'})),
			
			
			

			accountListItemTemplate1 : new sap.m.StandardListItem({
				title : '{PartnersBasedOnType>fullName}',
				description : '{PartnersBasedOnType>accountID}'
			}),

			
			contactListItemTemplate1 : new sap.m.StandardListItem({
				title : '{PartnersBasedOnType>fullName}',
				description : '{PartnersBasedOnType>contactID}'
			}),

			employeeListItemTemplate1 : new sap.m.StandardListItem({
				title : '{PartnersBasedOnType>fullName}',
				description : '{PartnersBasedOnType>employeeID}'
			}),

			

			
			
			
			onInit : function() {
				sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
				
				var bRTL = sap.ui.getCore().getConfiguration().getRTL();
				var sCss = (bRTL) ? "OpportunityRTL" : "Opportunity";
				
				jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("cus.crm.opportunity.css." + sCss,".css"),"sap-ui-theme-sap.crm");
				var that = this;
				//this.getView().getModel('controllers').getData().s5Controller = this;
				 this.oResourceBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle() ;
				this.byId('productBasket').setModel(new sap.ui.model.json.JSONModel(),"json");
				this.byId('partnerBasket').setModel(new sap.ui.model.json.JSONModel(), "json");
				this.followUp=false;
				
				this.contactF4Fragment  =  new sap.ui.xmlfragment(this.createId("contactF4"), 'cus.crm.opportunity.view.ContactF4', this);
				this.contactF4Fragment.setModel(new sap.ui.model.json.JSONModel(),"json");
				this.oI18nModel = this.getView().getModel('i18n');
				this.contactF4Fragment.setModel(this.oI18nModel,'i18n');
				this.oModel = this.getView().getModel();
				this.oAppImplementation = sap.ca.scfld.md.app.Application.getImpl();
				this.oDateFormatter = sap.ca.ui.model.format.DateFormat.getDateInstance({style : "medium"},new sap.ui.core.Locale(this.oAppImplementation.getResourceBundle().sLocale));
				
				//interoperability
				 this.sBackendVersion = cus.crm.opportunity.util.schema
					._getServiceSchemaVersion(this.oModel,
					"Opportunity");
				 this.oVersioningModel = new sap.ui.model.json.JSONModel({BackendSchemaVersion : this.sBackendVersion});	
					this.oVersioningModel.updateBindings();
					this.getView().setModel(this.oVersioningModel,"versioning");
				this._versionSpecificInitializations(this.sBackendVersion);
				//storing context to go back on cancel 
				this.oRouter.attachRouteMatched(function(oEvent) {
					if (oEvent.getParameter("name") === "create") { this.followupOppt = false;
						this.ContextPath = oEvent.getParameter("arguments").contextPath;
						this.processType = oEvent.getParameter("arguments").processType;
						//Always clear the form on load
						this._clear_data();
						
						//Fetching Partner Function Type for the Opportunity Transaction Type
				
						
//						Filling cutomizing in dropdowns
						var s3Controller = this.getView().getModel('controllers').getData().s3Controller;
						
						if(s3Controller === null){
							this.callController(s3Controller);
							/*var oModel = this.getView().getModel();
							var aBatchCustomizationReads = [
							                                oModel.createBatchOperation("SalesStages","GET"),
							                                oModel.createBatchOperation("Priorities","GET"),
							                                oModel.createBatchOperation("UserStatuses","GET"),
							                                oModel.createBatchOperation("Currencies","GET")
							                                ];
							oModel.addBatchReadOperations(aBatchCustomizationReads);
							s3Controller = {
									SalesStages:[],
									Priorities:[],
									UserStatuses:[],
									Currencies : []
							};

							oModel.submitBatch(jQuery.proxy(function(oResponses){
								if(oResponses.__batchResponses[0].statusCode === "200"){
									s3Controller.SalesStages  = oResponses.__batchResponses[0].data.results;
								}
								else
									this.handleErrors(oResponses,true);

								if(oResponses.__batchResponses[1].statusCode === "200"){
									s3Controller.Priorities = oResponses.__batchResponses[1].data.results;

								}
								else
									this.handleErrors(oResponses,true);
								if(oResponses.__batchResponses[2].statusCode === "200"){
									s3Controller.UserStatuses = oResponses.__batchResponses[2].data.results;
								}
								else 
									this.handleErrors(oResponses,true);
								
								if(oResponses.__batchResponses[3].statusCode === "200"){
									this.Currencies = oResponses.__batchResponses[3].data.results;

								}
								else
									this.handleErrors(oResponses,true);

								this.fill_dropDowns(s3Controller);
							},this),jQuery.proxy(this.handleErrors,this),true);*/

						}
						else
						{
							this.Currencies = s3Controller.Currencies;
							
							this.byId("currency").setModel(new sap.ui.model.json.JSONModel({Currencies : this.Currencies}),"json");
							this.ContactCollection = s3Controller.ContactCollection;
							this.s3Controller_contact = s3Controller;
							this.fill_dropDowns(s3Controller);
							
							
							if(parseFloat(this.sBackendVersion) >= 4){
								var oUTIL = cus.crm.opportunity.util.Util;
						    	
						    	if(oUTIL.getPartnerFunctions() === null){
						    		oUTIL.fetchPartnerFunctions(this.oModel);
						    	}
						    	this.partnerDeterminationMap = oUTIL.getPartnerFunctions();
							}
							else{
							if(!this.partnerDeterminationMap[this.processType]){
								
								
								this.oModel.read("OpptPartnerFctTypes",null,["TransactionType='" + this.processType +"'"],false,jQuery.proxy(function(odata,response){
				            			
				            		this.partnerDeterminationMap[this.processType] = response.data.results;
				            	},this),jQuery.proxy(function(oError){},this));
							
							}
							}
						}

						//set the default date
						this.byId('inputEmpResponsible_S5').setValue("");
						this.oSelectedEmployee = {};
						this.byId('datePickerStartDate').setValue(cus.crm.opportunity.util.Formatter.dateFormatter(new Date()));
						this.getView().byId('datePickerCloseDate').setValue(cus.crm.opportunity.util.Formatter.dateFormatter(new Date()));
						
						
						// set ProcessType Description.
						this.getView().byId("laTypeInput").setVisible(false);
						this.getView().byId("TxtTypeInput").setVisible(false);
						var processTypeDescr = null;
						var s2Controller = this.oApplicationFacade.getApplicationModel("s2Controller").getData().s2Controller;
						if (s2Controller != null	|| s2Controller != undefined) {
							processTypeDescr = s2Controller.processTypeDesc;
							if (processTypeDescr != null || parseFloat( this.sBackendVersion ) >= 3) {
								this.getView().byId("laTypeInput").setVisible(true);
								this.getView().byId("TxtTypeInput").setVisible(true);
								this.getView().byId("TxtTypeInput").setText(processTypeDescr);
							}
						}
					
						//EXTENSION POINT
						  /**
						 * @ControllerHook extHookCustomLogicForAttachRouteMatch is the controller hook that provides for using custom logic for newly added extension points.
					 *                  For example, set values for dropdown lists.
						 *                
						 * @callback cus.crm.opportunity.S5.controller~extHookCustomLogicForAttachRouteMatch
						 * @param  {object} oEvent 
						 * @return {void}
						 */
						if (this.extHookCustomLogicForAttachRouteMatch){
							this.extHookCustomLogicForAttachRouteMatch(oEvent);
						}
					}
					else if(oEvent.getParameter("name") === "fulScrCreateFollowup")
						
					{  
					this.fullScreen = true;
					this.oHeaderFooterOptions.onBack =  jQuery.proxy(this.onCancel,this);
					
					
					
                 var oStartupParameter = this.getView().getModel("startupParameters");
					
					if (oStartupParameter && oStartupParameter.oData) {
						if (oStartupParameter.oData.parameters) {
							for ( var param in oStartupParameter.oData.parameters) {
								
								
							//	if (oStartupParameter.oData.parameters[param].key == "AccountName") {
							//		this.AccountName = oStartupParameter.oData.parameters[param].value;
									//console.log("AccountName"+this.AccountName);
																
							//	}
							//	if (oStartupParameter.oData.parameters[param].key == "ContactName") {
							//		this.ContactName = oStartupParameter.oData.parameters[param].value;
									//console.log("opportunityId"+this.opportunityId);
																
							//	}
								if (oStartupParameter.oData.parameters[param].key == "processType") {
									this.processType = oStartupParameter.oData.parameters[param].value;
									//console.log("opportunityId"+this.opportunityId);
																
								}
								if (oStartupParameter.oData.parameters[param].key == "StartDate") {
									this.StartDate = oStartupParameter.oData.parameters[param].value;
									//console.log("opportunityId"+this.opportunityId);
																
								}
								if (oStartupParameter.oData.parameters[param].key == "title") {
									this.title = oStartupParameter.oData.parameters[param].value;
									//console.log("opportunityId"+this.opportunityId);
																
								}
						//		if (oStartupParameter.oData.parameters[param].key == "ProcessTypeDescription") {
						//			this.ProcessTypeDescription = oStartupParameter.oData.parameters[param].value;
									//console.log("opportunityId"+this.opportunityId);
																
							//	}
								if (oStartupParameter.oData.parameters[param].key == "appointmentGuid") {
									this.appointmentGuid = oStartupParameter.oData.parameters[param].value;
									//console.log("opportunityId"+this.opportunityId);
																
								}
								if (oStartupParameter.oData.parameters[param].key == "Responsible") {
									this.Responsible = oStartupParameter.oData.parameters[param].value;
									//console.log("opportunityId"+this.opportunityId);
																
								}
							//	if (oStartupParameter.oData.parameters[param].key == "ResponsibleTxt") {
							//		this.ResponsibleTxt = oStartupParameter.oData.parameters[param].value;
									//console.log("opportunityId"+this.opportunityId);
																
							//	}
								if (oStartupParameter.oData.parameters[param].key == "AccountId") {
									this.AccountId = oStartupParameter.oData.parameters[param].value;
									//console.log("opportunityId"+this.opportunityId);
																
								}
								if (oStartupParameter.oData.parameters[param].key == "ContactId") {
									this.contactId = oStartupParameter.oData.parameters[param].value;
									//console.log("opportunityId"+this.opportunityId);
																
								}
								
							}
							
						}
						
					}

					this.ContextPath = oEvent.getParameter("arguments").contextPath;
					//this.processType = oEvent.getParameter("arguments").processType;
					 var that = this ; 
					 
					 var aBatchReads = [];
						var oModel = this.getView().getModel();
						
						 var sPath = "/AccountCollection('" + this.AccountId + "')" ;
						 var sPath2 = "/ContactCollection(contactID='" + this.contactId +  "',accountID='" + this.AccountId +"')" ;
						 var sPath3 = "/EmployeeCollection('" + this.Responsible + "')" ; 
						 var sPath4  = "/ProcessTypes" ;
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
		                   	    if(oResponses.__batchResponses[3])
		                   	    	{
		                   	    	for (var i=0; i < oResponses.__batchResponses[3].data.results.length; i++) {
		            					if(oResponses.__batchResponses[3].data.results[i].ProcessTypeCode === old.processType) {
		            						old.ProcessTypeDescription = oResponses.__batchResponses[3].data.results[i].Description;
		            					//	old.privateFlag = oResponses.__batchResponses[3].data.results[i].PrivateFlag;
		            						break;

		            						
		                   	    	}
		            					

		                   	    	}
		                   	    	}
		                 },this),jQuery.proxy(function(){},this),false);
						
				
					
					that.s3Controller = this.getView().getModel('controllers').getData().s3Controller;
					if(that.s3Controller === null){
						this.callController(that.s3Controller);
					
				
					}
					
					sap.ca.ui.utils.busydialog.requireBusyDialog();
					this.followUpView();
					sap.ca.ui.utils.busydialog.releaseBusyDialog();
					
					
				}
				else if (oEvent.getParameter("name") === "fulScrOpptFollowup" )
				{
					
					this.followupOppt = true;
		
					
					this.fullfollowupOppt = true;
					this.ContextPath = oEvent.getParameter("arguments").contextPath;
					this.processType = oEvent.getParameter("arguments").processType;
					var that = this ;

					that.s3Controller =	this.getView().getModel('controllers').getData().s3Controller;
					if(that.s3Controller === null){
					  this.callController(that.s3Controller);
					}

					sap.ca.ui.utils.busydialog.requireBusyDialog();
					this.bindEditView();
					sap.ca.ui.utils.busydialog.releaseBusyDialog();
					
					
					}
				else if(oEvent.getParameter("name") === "FollowupFromTask")
					
				{  
				this.fullScreenFromTask = true;
				this.oHeaderFooterOptions.onBack =  jQuery.proxy(this.onCancel,this);
				
				
				//startupparameter
				
             var oStartupParameter = this.getView().getModel("startupParameters");
				
				if (oStartupParameter && oStartupParameter.oData) {
					if (oStartupParameter.oData.parameters) {
						for ( var param in oStartupParameter.oData.parameters) {
							
							if (oStartupParameter.oData.parameters[param].key == "AccountID") {
								this.AccountId = oStartupParameter.oData.parameters[param].value;
								//console.log("AccountName"+this.AccountName);
															
							}
							//if (oStartupParameter.oData.parameters[param].key == "AccountName") {
							//	this.AccountName = oStartupParameter.oData.parameters[param].value;
								//console.log("AccountName"+this.AccountName);
															
							//}
							if (oStartupParameter.oData.parameters[param].key == "ContactID") {
								this.contactId = oStartupParameter.oData.parameters[param].value;
								//console.log("AccountName"+this.AccountName);
															
							}
						//	if (oStartupParameter.oData.parameters[param].key == "ContactName") {
							//	this.ContactName = oStartupParameter.oData.parameters[param].value;
								//console.log("opportunityId"+this.opportunityId);
															
						//	}
							if (oStartupParameter.oData.parameters[param].key == "FUO") {
								this.FUO = oStartupParameter.oData.parameters[param].value;
								//console.log("opportunityId"+this.opportunityId);
															
							}
					//		if (oStartupParameter.oData.parameters[param].key == "ProcessTypeDescription") {
					//			this.ProcessTypeDescription = oStartupParameter.oData.parameters[param].value;
								//console.log("opportunityId"+this.opportunityId);
															
						//	}
							if (oStartupParameter.oData.parameters[param].key == "taskGuid") {
								this.taskGuid = oStartupParameter.oData.parameters[param].value;
								//console.log("opportunityId"+this.opportunityId);
															
							}
							if (oStartupParameter.oData.parameters[param].key == "taskId") {
								this.taskId = oStartupParameter.oData.parameters[param].value;
								//console.log("opportunityId"+this.opportunityId);
															
							}
							/*if (oStartupParameter.oData.parameters[param].key == "StartDate") {
								this.StartDate = oStartupParameter.oData.parameters[param].value;
								//console.log("opportunityId"+this.opportunityId);
															
							}*/
							if (oStartupParameter.oData.parameters[param].key == "title") {
								this.title = oStartupParameter.oData.parameters[param].value;
								//console.log("opportunityId"+this.opportunityId);
															
							}
							
							
							
							
							
						}
						
					}
					
				}
				
				
				
				
				this.ContextPath = oEvent.getParameter("arguments").contextPath;
				this.processType = oEvent.getParameter("arguments").processType;
				 var that = this ;
				 var aBatchReads = [];
					var oModel = this.getView()
							.getModel();
					
					var aPrerequisitePaths=[];
					
					aPrerequisitePaths.push("/ProcessTypes");
					if (this.AccountId!=="")
						aPrerequisitePaths.push("/AccountCollection("
								+ oModel.formatValue(this.AccountId,
										"Edm.String") + ")");
					if(this.contactId!==""){
						var sFormattedString = oModel.formatValue(
								this.contactId, "Edm.String");
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
					oModel
					.addBatchReadOperations(aBatchReads);

			var index = 3;
			var old = this;
			oModel
					.submitBatch(
							jQuery
									.proxy(
											function(
													oResponses) {
												for ( var j = 0; j < oResponses.__batchResponses.length; j++) {
													
													switch (j) {
													case 0:
														if (oResponses.__batchResponses[0]) {
															for ( var i = 0; i < oResponses.__batchResponses[0].data.results.length; i++) {
																if (oResponses.__batchResponses[0].data.results[i].ProcessTypeCode === old.processType) {
																	old.ProcessTypeDescription = oResponses.__batchResponses[0].data.results[i].Description;
																	}

															}
														}
														
														break;
													
													
													default:
														if(oResponses.__batchResponses[j].data.__metadata)
														if (oResponses.__batchResponses[j].data.__metadata.type.search("Account")!== -1)
															that.AccountName =oResponses.__batchResponses[j].data.fullName;
													if(oResponses.__batchResponses[j].data.results)
													if (oResponses.__batchResponses[j].data.results[0].__metadata.type.search("Contact") !== -1)
														that.ContactName = oResponses.__batchResponses[j].data.results[0].fullName;
														
														break;
													}
													
												}

											},
											this),
							jQuery
									.proxy(
											function() {
											},
											this),
							false);
				
			
				 
				 
					
					that.s3Controller = this.getView().getModel('controllers').getData().s3Controller;
					if(that.s3Controller === null){
						this.callController(that.s3Controller);
					/*var oModel = this.getView().getModel();
					var aBatchCustomizationReads = [
					                                oModel.createBatchOperation("SalesStages","GET"),
					                                oModel.createBatchOperation("Priorities","GET"),
					                                oModel.createBatchOperation("UserStatuses","GET"),
					                                oModel.createBatchOperation("Currencies","GET")
					                                ];
					oModel.addBatchReadOperations(aBatchCustomizationReads);
					that.s3Controller = {
							SalesStages:[],
							Priorities:[],
							UserStatuses:[],
							Currencies : []
					};

					oModel.submitBatch(jQuery.proxy(function(oResponses){
						if(oResponses.__batchResponses[0].statusCode === "200"){
							that.s3Controller.SalesStages  = oResponses.__batchResponses[0].data.results;
						}
						else
							this.handleErrors(oResponses,true);

						if(oResponses.__batchResponses[1].statusCode === "200"){
							that.s3Controller.Priorities = oResponses.__batchResponses[1].data.results;

						}
						else
							this.handleErrors(oResponses,true);
						if(oResponses.__batchResponses[2].statusCode === "200"){
							that.s3Controller.UserStatuses = oResponses.__batchResponses[2].data.results;
						}
						else 
							this.handleErrors(oResponses,true);
						
						if(oResponses.__batchResponses[3].statusCode === "200"){
							this.Currencies = oResponses.__batchResponses[3].data.results;

						}
						else
							this.handleErrors(oResponses,true);

						this.fill_dropDowns(that.s3Controller);
					},this),jQuery.proxy(this.handleErrors,this),true);*/
						

				
					}
					
					sap.ca.ui.utils.busydialog.requireBusyDialog();
					this.fromTaskFollowUpView();
					sap.ca.ui.utils.busydialog.releaseBusyDialog();
					
					
					
					}
					else if (oEvent.getParameter("name") === "createFollowup" )
					{
						
						this.followupOppt = true;
			
						
						this.ContextPath = oEvent.getParameter("arguments").contextPath;
						this.processType = oEvent.getParameter("arguments").processType;
						
						sap.ca.ui.utils.busydialog.requireBusyDialog();
						this.bindEditView();
						sap.ca.ui.utils.busydialog.releaseBusyDialog();
						
						
						}
						
				}, this);
        
				this.oAppImplementation = sap.ca.scfld.md.app.Application.getImpl();
				this.oNav = this.oAppImplementation.oAppNavigator;

				/*Scaffolding buttons*/
				that = this;
				this.oHeaderFooterOptions =
				{
						onBack : (jQuery.device.is.phone || this.fullScreen || this.fullScreenFromTask) ? jQuery.proxy(this.onCancel,this) : null,
						oEditBtn : {
							sId : "sv",
							sI18nBtnTxt : "SAVE",
							onBtnPressed : function(evt) {
								that.getController().onSave();
							},
							bDisabled : true, // default true
						},
						buttonList : [ {
							sI18nBtnTxt : "CANCEL",
							onBtnPressed : function(evt) {
								that.getController().onCancel();
							}
						}],

				};

				/*Selection on stagedropdown, chance of sccuess should change*/
				var that = this.getView();
				this.getView().byId('stagedropdown').attachChange( null, function(oEvent){
					if(that.byId('statusdropdown').getSelectedKey()!=that.getController().WinStatusCode && that.byId('statusdropdown').getSelectedKey()!=that.getController().LostStatusCode ){
						var data=this.getModel("json").getData();
						var length = data.SalesStages.length;
						for (var i=0; i<length;i++){
							if  (data.SalesStages[i].ProcessType=== that.getController().processType && data.SalesStages[i].SalesStageCode === oEvent.getParameter("selectedItem").getKey()){
								that.byId("chanceofSuccess").setValue( Number(data.SalesStages[i].ChanceOfSuccess));
							}
						}
					}
				});

				//
				//Chance of Success based on userStatus
				this.getView().byId('statusdropdown').attachChange( null, function(oEvent){
					if  (that.getController().WinStatusCode === oEvent.getParameter("selectedItem").getKey()){
						that.byId("chanceofSuccess").setValue( 100);
					}
					if  (that.getController().LostStatusCode === oEvent.getParameter("selectedItem").getKey()){
						that.byId("chanceofSuccess").setValue(0);
					}

				});

				//Prevent manual entry in Date
				this.byId('datePickerCloseDate').attachBrowserEvent("keydown",jQuery.proxy(function(oEvent)
						{
					//oEvent.preventDefault();
					  this.setValueState(sap.ui.core.ValueState.None);
						},this.byId('datePickerCloseDate')));

				this.byId('datePickerStartDate').attachBrowserEvent("keydown",jQuery.proxy(function(oEvent)
						{
					//oEvent.preventDefault();
					  this.setValueState(sap.ui.core.ValueState.None);
						},this.byId('datePickerStartDate')));
				
				//F4 needed on enter in contact field
				/*this.byId('inputMainContact').attachBrowserEvent("keyup",function(oEvent){ 
		            //keycode for enter is 13
		            if(oEvent.keyCode === 13)
		            {
		                  this.showContactF4();
		            }},this
				);	

				//Prevent manual entry in account f4
				this.byId('customer').attachBrowserEvent("keydown",jQuery.proxy(function(oEvent)
						{
					         if(oEvent.keyCode === 13){
					        	 this.showAccountF4(); 
					         }
						},this));*/

				/*Date validation*/
				this.getView().byId('datePickerCloseDate').attachChange(null,function(oEvent) {
					 var dateString= oEvent.getParameter('newYyyymmdd');
					 if(dateString !== null){
					  var tempDate = new Date(parseInt(dateString.substr(0,4)),
							                  parseInt(dateString.substr(4,2) - 1),
							                  parseInt(dateString.substr(6,2)));
				     this.byId('datePickerCloseDate').setValue(this.oDateFormatter.format(tempDate));   } 
					 this.byId('datePickerCloseDate').setValueState(sap.ui.core.ValueState.None);
					 this.byId('datePickerStartDate').setValueState(sap.ui.core.ValueState.None);

				}, this);
				this.getView().byId('datePickerStartDate').attachChange(null,function(oEvent) {
					this.byId('datePickerStartDate').setValueState(sap.ui.core.ValueState.None);
					  this.byId('datePickerCloseDate').setValueState(sap.ui.core.ValueState.None);
					  var dateString= oEvent.getParameter('newYyyymmdd');
					  if(dateString !== null){
					  var tempDate = new Date(parseInt(dateString.substr(0,4)),
							                  parseInt(dateString.substr(4,2) - 1),
							                  parseInt(dateString.substr(6,2)));
					this.byId('datePickerStartDate').setValue(this.oDateFormatter.format(tempDate));}

				}, this);
			},
			
			_versionSpecificInitializations : function(sBackendVersion){
				
				var sAccountAnnotation = cus.crm.opportunity.util.schema._getEntityAnnotation(this.oModel,'service-schema-version','Account');
				this.accountF4Template = new sap.m.StandardListItem({
					//title : (sAccountAnnotation === null) ? "{name1}" : "{fullName}",
					title : (parseFloat(sBackendVersion) <= 1) ? "{parts:[{path:'name1'}],formatter : 'cus.crm.opportunity.util.Formatter.getAccountF4Title'}" : "{parts:[{path:'fullName'}],formatter : 'cus.crm.opportunity.util.Formatter.getAccountF4Title'}",
							
					description : "{parts:[{path : 'accountID'},{path : 'MainAddress/city'},{path : 'MainAddress/country'}],formatter : 'cus.crm.opportunity.util.Formatter.formatAccountF4Description'}",
				    active : true
				});
				
				this.accountF4Template.data("NAME",( (sAccountAnnotation === null) ? "{name1}" : "{fullName}"));
				this.accountF4Template.data("ID","{accountID}");
				//Interoperability for Sales Area Tab	
				 if(parseFloat(sBackendVersion) >= 4){
						this.byId("tit1").setVisible(true);
					}
					else{
						this.byId("tit1").setVisible(false);
						this.byId("partnerBasket").setVisible(false);
						
					}	
		},
			fill_dropDowns: function(s3Controller)
			{
				
				// NLUN - CodeScan Changes - length is javascrip keyword
				var i,statusLength;
				var jsonModel =new sap.ui.model.json.JSONModel();
				var jsonModel1 =new sap.ui.model.json.JSONModel();
				var jsonModel2 =new sap.ui.model.json.JSONModel();
				
				//set userstatus
				statusLength = s3Controller.UserStatuses.length;
				// NLUN - CodeScan Changes - Global Variables
				var data1 = {
						UserStatuses : [
						                {
						                	BusinessTransaction: "",
						                	LanguageCode: "",
						                	ProcessType: this.processType,
						                	StatusProfile: "",
						                	UserStatusCode: "",
						                	UserStatusText: "",
						                }
						                ]
				};
				
				var initialStatus= "";
				
				for(i=0;i< statusLength;i++){
					if (s3Controller.UserStatuses[i].ProcessType === this.processType){
						data1.UserStatuses.push(s3Controller.UserStatuses[i]);
						
						if(parseFloat(this.sBackendVersion) >= 3){ 
							
							if(s3Controller.UserStatuses[i].InitialStatus == true)
								initialStatus = s3Controller.UserStatuses[i].UserStatusCode;
						}
							
						
						if(this.UserStatusCode==="" && s3Controller.UserStatuses[i].UserStatusCode!=""){
							this.UserStatusCode=s3Controller.UserStatuses[i].UserStatusCode;
							this.UserStatusText=s3Controller.UserStatuses[i].UserStatusText;
						}
						
						if (s3Controller.UserStatuses[i].BusinessTransaction === "WINN"){
							this.getView().getController().WinStatusCode =  s3Controller.UserStatuses[i].UserStatusCode ;
						}
						if (s3Controller.UserStatuses[i].BusinessTransaction === "LOST"){
							this.getView().getController().LostStatusCode =  s3Controller.UserStatuses[i].UserStatusCode ;
						}
						this.StatusProfile = s3Controller.UserStatuses[i].StatusProfile;
					}
				}
				jsonModel.setData(data1);
				this.byId('statusdropdown').setModel(jsonModel,"json");
				this.byId('statusdropdown').setSelectedKey(initialStatus);
				
				//set priority
				var data2 = {
						Priorities : [
						              {
						            	  LanguageCode: "",
						            	  PriorityCode: "",
						            	  PriorityText: "",
						              }
						              ]

				};
				statusLength = s3Controller.Priorities.length;
				for(i=0;i< statusLength;i++){
					data2.Priorities.push(s3Controller.Priorities[i]);
				};
				jsonModel1.setData(data2);
				this.byId('priority_val').setModel(jsonModel1,"json");
				//set salesStage
				statusLength = s3Controller.SalesStages.length;
				var stagearray=new Array();
				var sortedArray=new Array();
				var sortedArrayItem;
				var salesCode;
				var successchance;
				// NLUN - CodeScan Changes - Global Variables
				var data3 = {
						SalesStages :[{
							ChanceOfSuccess: "",
							LanguageCode: "",
							ProcessType: this.processType,
							SalesStageCode: "",
							SalesStageDescription: "",
							SalesStageOrder: "",
						}]
				};
				for(i=0;i< statusLength;i++){
					if (s3Controller.SalesStages[i].ProcessType === this.processType){
						data3.SalesStages.push(s3Controller.SalesStages[i]); 
						//defaulting of salesstage dropdown and chance of success 
						stagearray.push(s3Controller.SalesStages[i].SalesStageOrder);
						sortedArray=stagearray.sort();
						sortedArrayItem=sortedArray[0];
					
						if(s3Controller.SalesStages[i].SalesStageOrder==sortedArrayItem){
							
							salesCode=s3Controller.SalesStages[i].SalesStageCode;
							successchance=Number(s3Controller.SalesStages[i].ChanceOfSuccess);
						}
					}
				}
				jsonModel2.setData(data3);
				this.byId('stagedropdown').setModel(jsonModel2,"json");
				this.byId('stagedropdown').setSelectedKey(salesCode);
				this.getView().byId("chanceofSuccess").setValue(successchance);
			},
			/*Workaround for enabling footer*/
			onAfterRendering: function() {
				cus.crm.opportunity.util.Formatter.resetFooterContentRightWidth(this);

			},
			
			onBeforeRendering : function(){
				
				this.getView().getModel("controllers").getData().s5Controller = this;
			},

			//Enable buttons using scaffolding
			getHeaderFooterOptions : function() {
				return this.oHeaderFooterOptions;
				var that = this;	
				return {
					oPositiveAction : {
						sId : "sv",
						sI18nBtnTxt : "SAVE",
						onBtnPressed : function() {
							this.onSave();
						},
					},

					oNegativeAction : {
						sI18nBtnTxt : "CANCEL",
						// sBtnTxt : "",
						onBtnPressed : function(evt) {
							this.onCancel();
						},
					},
				};
			},


			/*Nav Back button*/
			toDetail : function() {
				this.onCancel();

			},
			
			//Oncancel button
			onCancel : function() {
				sap.ca.ui.dialog.confirmation.open({
					question :sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('DATA_LOSS'),
					title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('WARNING'),
					confirmButtonLabel : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTINUE')  	

				},jQuery.proxy(this.datalossDismissed,this));
			},
			datalossDismissed : function(oResult)
			{
				if(oResult.isConfirmed === false)
					return;	
				if(!this.followupOppt)
					var ctx = this.ContextPath;
					else 
				  var 	ctx = "Opportunities(guid'" + this.ContextPath + "')" ;
				if(!jQuery.device.is.phone && !this.fullScreen && !this.fullScreenFromTask){
					this.oRouter.navTo("detail", {
						contextPath : ctx },!jQuery.device.is.phone);
				}
				else if(!jQuery.device.is.phone && this.fullScreen){
					window.history.back();
				}
				else if(!jQuery.device.is.phone && this.fullScreenFromTask){
					window.history.go(-2);
				}
				else
					this._navBack();
				this._clear_data();
				this._enableMasterFooter("");
			},

			
			//OPen Dialog on Add
			onAddProduct : function(oEvent) {
				
				if(!this.oAddProductsFragment){
					 
						this.oAddProductsFragment = sap.ui.xmlfragment("cus.crm.opportunity.view.ProductBasketDialog", this);
						this.oAddProductsFragment.setModel(new sap.ui.model.json.JSONModel(),"json");
						this.oAddProductsFragment.setModel(this.getView().getModel("i18n"), "i18n");
						
				 }
	            
				this.oAddProductsFragment.getBeginButton().setEnabled(false);
				this.oAddProductsFragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING_TEXT')); 
				this.oAddProductsFragment.getSubHeader().getContentLeft()[0].clear();
				this.oModel.read("Products",null,null,true,jQuery.proxy(function(odata,response){
					
					if(response.data.results.length === 0)
						this.oAddProductsFragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_DATA_TEXT'));
					this.oAddProductsFragment.getModel("json").setData({Products : response.data.results});
					
				},this),function(oError){
					
					
					
				});   
				
				this.oAddProductsFragment.open();
			},


			//handle click of save
			onSave : function() {
				
				
				//EXTENSION POINT
				var bValue = true;
				 /**
				 * @ControllerHook extHookOnSave is the controller hook that provides for validation of the extended data before saving.
				 * @callback cus.crm.opportunity.S5.controller~extHookOnSave
				 * @return {boolean}
				 */
				if (this.extHookOnSave){
					bValue =  this.extHookOnSave();
				}
				if(!bValue){
					return;
				}
				//save only if if all data is validated
				if(this.validateDates()===false)
					return;
				//Check if contact is filled correctly
				if((this.byId('inputMainContact').getValue() !== "" && this.contactId===undefined)){		
					this.showContactF4();
					return;
				}
				if(this.byId('inputMainContact').getValue() === "")
					{
					this.contactId=undefined;
					}
				
				if(this.validateSavePage() === false){
					sap.ca.ui.message.showMessageToast(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('MANDAT_FIELD'));
					return;
				}
				
				if(this.validateCurrency()===true){

					sap.ca.ui.dialog.confirmation.open({
						question : this.currencyMessage,
						title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('WARNING'),
						confirmButtonLabel : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTINUE')   
					
					},jQuery.proxy(this.dataConfirm,this));
				}
				else
					this.dataConfirm({isConfirmed : true});
				
				
				
			},
			
			//Enable the Savebutton only when all mandatory fields are filled
			enableSaveBtn:function (oEvent) {		
				
				if (this.byId("desc").getValue() !== "" 
					&& this.byId("customer").getValue() !== ""
					&&  this.byId("datePickerCloseDate").getValue() !== "") {
	    	   if(!this.followUp){
	    	   this.setBtnEnabled("sv",true);
	    	   }else{
	    	   this.oHeaderFooterOptions.oEditBtn.bDisabled=false;
	    	   this.followUp=false;
	    	   }
			} else {
				this.setBtnEnabled("sv",false);
			}
					
					/**
					 * @ControllerHook extHookEnableSaveBtn provides the flexibility to decide if the save button has to be enabled for the fields added by the customer to the new opportunity page.
					 *                 
					 *                 
					 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookEnableSaveBtn
					 * @return {void}
					 */
				  if (this.extHookEnableSaveBtn){
						this.extHookEnableSaveBtn();
					}	
				},
			
			
			dataConfirm :function(oResult)
			
			{
				 if(oResult.isConfirmed){

				
				//Fixing the chance of success if oppo win or lost
				if  (this.WinStatusCode === this.byId('statusdropdown').getSelectedKey()){
					this.getView().byId("chanceofSuccess").setValue(100);

				}
				if  (this.LostStatusCode === this.byId('statusdropdown').getSelectedKey()){
					this.getView().byId("chanceofSuccess").setValue(0);

				}
				var userStatusKey = "";
				var userStatusText = "";
				// set default values
				if(this.byId('statusdropdown').getSelectedKey()==""){
					userStatusKey = this.UserStatusCode;
					userStatusText = this.UserStatusText;
				}
				else
				{
					userStatusKey = this.byId('statusdropdown').getSelectedKey();
					userStatusText = this.byId('statusdropdown').getSelectedItem().getText();
				}

				var formatter=sap.ca.ui.model.format.DateFormat.getDateInstance({style : "medium"},new sap.ui.core.Locale(this.oAppImplementation.getResourceBundle().sLocale));
				var start_date = new Date(formatter.parse(this.byId('datePickerStartDate').getValue()));
				var end_date = new Date(formatter.parse(this.byId('datePickerCloseDate').getValue()));

				var start_date_string = start_date.getFullYear() + "-"
				+ (start_date.getMonth()+1) + "-"
				+ start_date.getDate() + "T00:00:00";	

				var end_date_string = end_date.getFullYear() + "-"
				+ (end_date.getMonth()+1) + "-"
				+ end_date.getDate() + "T00:00:00";
				var emptyGuid ="00000000-0000-0000-0000-000000000000";
				var oModel = this.getView().getModel();
				var that=this;
				if(this.followupOppt){
					this.PredecessorGUID=this.ContextPath ;
					
				}
				else if(this.fullScreen){
					this.PredecessorGUID=this.appointmentGuid;
					this.accountId=this.AccountId;
				//	this.contactId=this.ContactId;
					
				}
				else if(this.fullScreenFromTask){
					this.PredecessorGUID=this.taskGuid;
					this.accountId=this.AccountID;
				//	this.contactId=this.ContactID;
				}
				else{
					this.PredecessorGUID=null;
				}
				var oEntry = {
						Description : this.byId('desc').getValue(),
						ProcessType :  this.processType,

						StartDate : start_date_string,
						ClosingDate : end_date_string,

						ExpectedSalesVolume : this.byId('volume')
						.getValue(),
						SalesStageCode : this.byId('stagedropdown')
						.getSelectedKey(),

						UserStatusCode :userStatusKey,
						UserStatusText :userStatusText,
						PriorityCode : this.byId('priority_val')
						.getSelectedKey(),
						PriorityText : this.byId('priority_val')
						.getSelectedItem().getText(),
						ProspectName : this.byId('customer').getValue(),
						ProspectNumber : this.accountId,
						MainContactId : this.contactId,
						MainContactName : this.byId('inputMainContact').getValue(),
						ChanceOfSuccess : this.byId('chanceofSuccess').getValue(),
						ForecastRelevance : this.byId('Switch').getState(),
						CurrencyCode :  this.byId('currency').getValue(),
//						sales area
//						SalesOrganization: this.acc_salesorgid,
//						SalesOrganizationDescription: this.acc_salesorgdesc,
//						DistributionChannel: this.acc_dischaid,
//						DistributionChannelDescription: this.acc_dischadesc,
//						Division: this.acc_divid,
//						DivisionDescription: this.acc_divdesc,

						//PredecessorGUID :this.PredecessorGUID,
						//PredecessorGUID : (this.followupOppt) ? this.ContextPath : null  ,
						Guid : emptyGuid,
						Statuses : [ {
							HeaderGuid :emptyGuid,
							StatusProfile : this.StatusProfile ,//"CRMOPPOR",
							UserStatusCode :userStatusKey,
							UserStatusText : userStatusText,
							StatusOrderNumber : "01",
						} ],
						Products : [

						            ],
						            SalesTeam : [

													],


				};
           if(parseFloat(this.sBackendVersion)>=4.0){
					
					
					
					oEntry.SalesOrganization= this.acc_salesorgid;
					oEntry.SalesOrganizationDescription=this.acc_salesorgdesc;
					oEntry.DistributionChannel= this.acc_dischaid;
					oEntry.DistributionChannelDescription= this.acc_dischadesc;
					oEntry.Division= this.acc_divid;
					oEntry.DivisionDescription= this.acc_divdesc;

				}
				if(parseFloat(this.sBackendVersion) >= 2.0){
				  oEntry["EmployeeResponsibleNumber"]  =  this.oSelectedEmployee.employeeID;
				}
                if(parseFloat(this.sBackendVersion) >= 3.0){
				  oEntry["PredecessorGUID"]  =  this.PredecessorGUID ; 
				}
				var productList = this.getView().byId("productBasket")
				.getModel("json").getData().Products;
				var i = 0;
				if(productList && productList.length ){
					var length = productList.length;
					var oListItem;
					for (i = 0; i < length; i++) {
						oListItem = productList[i];
						var pushObject = {
								HeaderGuid : emptyGuid,
								ProcessingMode : "A",
								ProductGuid : oListItem.ProductGuid,
								ProductId : oListItem.ProductId,
								ProductName : oListItem.ProductName,
								Quantity :  oListItem.Quantity,
								TotalExpectedNetValue :  oListItem.TotalExpectedNetValue,
								Unit : oListItem.Unit
						};
						
						/**
						 * @ControllerHook extHookExtendProductEntry is the controller hook that provides for extension of pushObject. 
						 *                 This enables modification of the product entry that is being updated.
						 *                
						 *                                   
						 * @callback cus.crm.opportunity.S5.controller~extHookExtendProductEntry
						 * @param {object} pushObject
						 * @param {object} oListItem        
						 * @return {void}
						 */
						if(this.extHookExtendProductEntry){
							this.extHookExtendProductEntry(pushObject,oListItem);
						}
						oEntry.Products.push(pushObject);
					}
				}
				if(parseFloat(this.sBackendVersion)>=4.0){
				if (this.getView().byId("partnerBasket").getModel(
				"json").getData().SalesTeam) {
			var partnerList = this.getView().byId(
					"partnerBasket").getModel("json")
					.getData().SalesTeam;
		} else {
			var partnerList = "";
		}

		if (partnerList.length > 0) {
			var i = 0;
			var aPartnerFunctions = this.participantsF4MultiselectFragment
					.getModel("json").getProperty(
							"/PartnerFunctions");
			var aPartners = this.participantsF4MultiselectFragment
					.getModel("PartnersBasedOnType");
			if (partnerList && partnerList.length) {
				var length = partnerList.length;
				// var oListItem;
				for (i = 0; i < length; i++) {
					var oListItem = partnerList[i];
					var partnerFunctionCodeValue;
					for ( var int2 = 0; int2 < aPartnerFunctions.length; int2++) {

						if (aPartnerFunctions[int2].PartnerFunctionName == oListItem.PartnerFunction) {
							partnerFunctionCodeValue = aPartnerFunctions[int2].PartnerFunctionCode;
						}

					}

					var pushObject = {
						HeaderGuid : emptyGuid,
						PartnerFunctionCode : partnerFunctionCodeValue,
						PartnerNumber : oListItem.Key,
						PartnerName : oListItem.Name,
						PartnerFunctionText : oListItem.PartnerFunction,

					};
					if (this.extHookExtendProductEntry) {
						this.extHookExtendProductEntry(
								pushObject, oListItem);
					}
					/**
					 * @ControllerHook extHookExtendSalesItemEntry
					 *                 is the controller
					 *                 hook that provides
					 *                 for extension of
					 *                 pushObject. This
					 *                 enables modification
					 *                 of the Sales Item
					 *                 entry that is being
					 *                 updated.
					 * 
					 * 
					 * @callback cus.crm.opportunity.S5.controller~extHookExtendProductEntry
					 * @param {object}
					 *            pushObject
					 * @param {object}
					 *            oListItem
					 * @return {void}
					 */
					if (this.extHookExtendProductEntry) {
						this.extHookExtendProductEntry(
								pushObject, oListItem);
					}
					oEntry.SalesTeam.push(pushObject);

				}
			}

			// Destroying All Saved Data and Removing
			// Unwanted
			// Entries From DOM
			var item = this.getView().byId("partnerBasket")
					.getItems();
			for ( var int3 = 0; int3 < item.length; int3++) {

				this.getView().byId("partnerBasket")
						.removeItem(item[int3]);
				item[int3].destroy();
			}
			this.participantsF4MultiselectFragment.getModel('json')
			.getData().PartnerFunctions=this.partnerDeterminationMap[this.processType];

			var partnersList = this.participantsF4MultiselectFragment
					.getModel("json").getProperty(
							"/PartnerFunctions");
			
			for ( var int4 = 0; int4 < partnersList.length; int4++) {
				if(this.participantsF4MultiselectFragment
						.getContent()[0].getPages()[0]
				.getContent()[0].getItems()[int4])
				this.participantsF4MultiselectFragment
						.getContent()[0].getPages()[0]
						.getContent()[0].getItems()[int4]
						.setInfo(" ");
			}
			this.participantsF4MultiselectFragment
					.getModel("json").destroy();
			if(this.participantsF4MultiselectFragment
					.getModel("PartnersBasedOnType"))
			this.participantsF4MultiselectFragment
					.getModel("PartnersBasedOnType")
					.destroy();
			this.participantsF4MultiselectFragment
					.getModel("SelectedPartnerCategory")
					.destroy();
			this.byId('partnerBasket').getModel("json")
					.updateBindings();

		}
				}
				
				// EXTENSION POINT to be able to extend oEntry 
				/**
				 * @ControllerHook extHookSaveOentry is the controller
				 *                 hook where the oEntry can be 
				 *                 extended. New Attributes can be defined in addition to the 
				 *                 existing oEntry attributes. 
				 *                                   
				 * @callback cus.crm.opportunity.S5.controller~extHookSaveOentry
				 * @param {object}
				 *           oEntry
				 * @return {void}
				 */
			
				if(this.extHookSaveOentry){
					this.extHookSaveOentry(oEntry);
				}
				oModel.refreshSecurityToken();
				// Here we need to disable the save button to prevent multi-click issue.
				this.setBtnEnabled("sv",false);
				sap.ca.ui.utils.busydialog.requireBusyDialog();
				var prev = this;
				oModel.create('/Opportunities',oEntry,null,
						function (oData, response) {
					
					var s2Controller = that.getView().getModel("controllers").getData().s2Controller;
					
					if(s2Controller){
						s2Controller.opportunityID = oData.Id;
					}
					if(!prev.fullScreen && !prev.fullScreenFromTask && !prev.fullfollowupOppt)
					that._enableMasterFooter(response.data.Guid);
					that.ContextPath = "Opportunities(guid'" + response.data.Guid + "')";
					if(prev.followupOppt || prev.fullScreen || prev.fullScreenFromTask)
						{
						// Notify listeners for the event that opportunity has been created as follow up.
						sap.ui.getCore().getEventBus().publish("cus.crm.opportunity", "followUpOpportunityCreated", {
							contextPath : that.ContextPath
						});

						var message = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('followupsuccessful');
					     sap.m.MessageToast.show(message, {
						   closeOnBrowserNavigation : false
					});
						}
					else
					sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('SAVE_SUCCESS'));
					that._clear_data();
					sap.ca.ui.utils.busydialog.releaseBusyDialog();
					var ctx = that.ContextPath;
					if(!jQuery.device.is.phone && (!prev.fullScreen) && (!prev.fullScreenFromTask) && (!prev.fullfollowupOppt))
						that.oRouter.navTo("detail", {
							contextPath : ctx },true);
					else if(!jQuery.device.is.phone && (prev.fullScreen))
						{ /*window.history.back();*/
						
						that.oRouter.navTo("display", {
							contextPath : ctx },true);
						}
					else if(!jQuery.device.is.phone && (prev.fullfollowupOppt))
					{ /*window.history.back();*/
					
					that.oRouter.navTo("display", {
						contextPath : ctx },true);
					}
					else if(!jQuery.device.is.phone && (prev.fullScreenFromTask))
					{ 
						//window.history.go(-2);;
						that.oRouter.navTo("display", {
							contextPath : ctx },true);
					}
					else
						that._navBack();
					
					
				}, 
				function (oMessage) {
					that.displayResponseErrorMessage(oMessage, sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('SAVE_FAILED'));
					sap.ca.ui.utils.busydialog.releaseBusyDialog();
					that.setBtnEnabled("sv",true);					
				}
				);
				 }
				 else
					 return;
				 this.fullScreen=false;
				 this.followupOppt=false;
				 this.fullScreenFromTask=false;
				 this.fullfollowupOppt=false;
			},

			displayResponseErrorMessage:function (oMessage, sDefaultMessage) {
				var sMessage;
				if (oMessage.response) {
					sMessage = jQuery.parseJSON(oMessage.response.body).error.message.value;
				}
				else
					sMessage = sDefaultMessage;
				sap.ca.ui.message
				.showMessageBox({
					type : sap.ca.ui.message.Type.ERROR,
					message : sMessage,
				});
			},

			//Enable add and sort buttons
			_enableMasterFooter : function(guidValue){
				//Enable footer buttons of Master
				
				var s2Controller  = this.getView().getModel('controllers').getData().s2Controller;
				s2Controller.setBtnEnabled("sort", true);
				s2Controller.setBtnEnabled("BTN_S2_ADD", true);
				s2Controller.setBtnEnabled("BTN_S2_SHOW", true);

				//Apply search on master list
				var descripion = this.byId('desc').getValue();
				if(descripion!=""){
					s2Controller.desc=descripion;
					s2Controller.nGuid = guidValue;
					s2Controller.bCreateOppt = true; 
					s2Controller._modifyListAfterCreate();

				}
			},
			

			callController:function(s3Controller){
				var oModel = this.getView().getModel();
				var aBatchCustomizationReads = [
				                                oModel.createBatchOperation("SalesStages","GET"),
				                                oModel.createBatchOperation("Priorities","GET"),
				                                oModel.createBatchOperation("UserStatuses","GET"),
				                                oModel.createBatchOperation("Currencies","GET")
				                                ];
				
				if(parseFloat(this.sBackendVersion) >= 4){
				     var oUTIL = cus.crm.opportunity.util.Util;
				     if(oUTIL.getPartnerFunctions() === null){
				    	 aBatchCustomizationReads.push(oModel.createBatchOperation("PartnerFunctions","GET"));
				     }
				}
				oModel.addBatchReadOperations(aBatchCustomizationReads);
				s3Controller = {
						SalesStages:[],
						Priorities:[],
						UserStatuses:[],
						Currencies : []
				};

				oModel.submitBatch(jQuery.proxy(function(oResponses){
					if(oResponses.__batchResponses[0].statusCode === "200"){
						s3Controller.SalesStages  = oResponses.__batchResponses[0].data.results;
					}
					else
						this.handleErrors(oResponses,true);

					if(oResponses.__batchResponses[1].statusCode === "200"){
						s3Controller.Priorities = oResponses.__batchResponses[1].data.results;

					}
					else
						this.handleErrors(oResponses,true);
					if(oResponses.__batchResponses[2].statusCode === "200"){
						s3Controller.UserStatuses = oResponses.__batchResponses[2].data.results;
					}
					else 
						this.handleErrors(oResponses,true);
					
					if(oResponses.__batchResponses[3].statusCode === "200"){
						this.Currencies = oResponses.__batchResponses[3].data.results;
						this.byId("currency").setModel(new sap.ui.model.json.JSONModel({Currencies : this.Currencies}),"json");

					}
					else
						this.handleErrors(oResponses,true);

					if(parseFloat(this.sBackendVersion) >= 4){
						
						if(oResponses.__batchResponses[4] && oResponses.__batchResponses[4].statusCode === "200"){
							var oUTIL = cus.crm.opportunity.util.Util;
							oUTIL.aggregatePartnerFunctions(oResponses.__batchResponses[4].data.results);
							this.partnerDeterminationMap = oUTIL.getPartnerFunctions();
						}
					}
					this.fill_dropDowns(s3Controller);
				},this),jQuery.proxy(this.handleErrors,this),true);
			},

			//Clear Data of Create Form
			_clear_data : function(){
				this.byId('desc').setValue("");
				this.byId('desc').setValueState(sap.ui.core.ValueState.None);
				this.byId('volume').setValue("");
				this.byId('inputMainContact').setValue("");
				this.byId('customer').setValue("");
				this.byId('customer').setValueState(sap.ui.core.ValueState.None);
				this.byId('currency').setValue("");
				this.byId('chanceofSuccess').setValue("");
				this.byId('datePickerStartDate').setValueState(sap.ui.core.ValueState.None);
				this.byId('datePickerCloseDate').setValueState(sap.ui.core.ValueState.None);
				this.byId('datePickerStartDate').setValue("");
				this.byId('datePickerCloseDate').setValue("");
				this.byId('statusdropdown').setSelectedKey();
				this.byId('priority_val').setSelectedKey("");
				this.byId('stagedropdown').setSelectedKey("");
				this.getView().byId("salesorganization_Text").setText("");
				this.getView().byId("salesOrganization").setValue("");
				this.getView().byId("distributionchannel_Text").setText("");
				this.getView().byId("division_Text").setText("");
				this.followUp=false;

				this.byId('Switch').setState(true);
				var data = {
						Products : [
						            ],
				};
				this.byId('productBasket').getModel("json").setData(
						data);
				this.accountId = undefined;
				this.accountName = "";
				var item = this.getView().byId("partnerBasket")
				.getItems();
		for ( var int3 = 0; int3 < item.length; int3++) {

			this.getView().byId("partnerBasket").removeItem(
					item[int3]);
			item[int3].destroy();
		}
		if(this.participantsF4MultiselectFragment){
		var partnersList = this.participantsF4MultiselectFragment.getContent()[0]
		.getPages()[0].getContent()[0].getItems();
		if(partnersList)
		for ( var int4 = 0; int4 < partnersList.length; int4++) {
			this.participantsF4MultiselectFragment.getContent()[0]
					.getPages()[0].getContent()[0].getItems()[int4]
					.setInfo(" ");
		}
        if(this.participantsF4MultiselectFragment.getModel("json"))
		this.participantsF4MultiselectFragment.getModel("json")
				.destroy();
		if(this.participantsF4MultiselectFragment.getModel(
		"PartnersBasedOnType"))
		this.participantsF4MultiselectFragment.getModel(
				"PartnersBasedOnType").destroy();
	    if(this.participantsF4MultiselectFragment.getModel(
		"SelectedPartnerCategory"))
		this.participantsF4MultiselectFragment.getModel(
				"SelectedPartnerCategory").destroy();
		this.byId('partnerBasket').getModel("json")
				.updateBindings();
        }
			},

			//Search products in produc popup
			onSearchProduct : function(oEvent) {
				
				//filter products based on Product description
				this.oAddProductsFragment.getBeginButton().setEnabled(false);
				this.oAddProductsFragment.getContent()[0].removeSelections();
				this.oAddProductsFragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING_TEXT'));
				this.oAddProductsFragment.getModel('json').setData({Products : []});
				var aFilters = [];
				var sQuery = oEvent.getParameter("query");
				
				if(sQuery !== ""){
					aFilters.push("$filter=substringof('" + sQuery + "',ProductDescription)");
				}
				
				
				this.oModel.read("Products",null,aFilters,true,jQuery.proxy(function(odata,response){
					
					if(response.data.results.length === 0){
						this.oAddProductsFragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_DATA_TEXT'));
					}
					this.oAddProductsFragment.getModel('json').setData({Products : response.data.results});
					
					
				},this),jQuery.proxy(function(oError){
					
					this.oAddProductsFragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_DATA_TEXT'));
					
				},this));
			},

onCancelDialog : function(oEvent) {
				
				this.oAddProductsFragment.close();
				this.oAddProductsFragment.getContent()[0].removeSelections();
			},


			onAddDialog : function(oEvent) {
				var oProductList = this.oAddProductsFragment.getContent()[0];
				var oSelectedItems = oProductList.getSelectedItems();
				var productBasketData = {
						Products : []
				};
				var data = this.byId('productBasket').getModel("json").getData();
				if(data && data.hasOwnProperty("Products"))
					productBasketData.Products = data.Products;
				var i = 0;
				var length = oSelectedItems.length;
				var oListItem;
				for (i = 0; i < length; i++) {
					oListItem = oSelectedItems[i];
				 var tempObject = oListItem.getBindingContext("json").getObject();
					// Need Clarification when there is no unit
					/*if(tempObject.Unit===""){
						 return;
					}*/
					var pushObject = {
							ItemGuid : "",
							ProcessingMode : "",
							ProductGuid : tempObject.ProductGuid,
							ProductId : tempObject.ProductId,
							ProductName : tempObject.ProductDescription,
							Quantity : "1",
							Unit : tempObject.Unit,
					};
					/**
					 * @ControllerHook extHookExtendProductEntryOnAdd is the controller hook that provides for addition of extra fields to the product entry for the product basket.
					 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookExtendProductEntryOnAdd
					 * @param {object} pushObject
					 * @param {object} tempObject       
					 */
					if (this.extHookExtendProductEntryOnAdd){
					     this.extHookExtendProductEntryOnAdd(pushObject,tempObject);
					}
					productBasketData.Products.push(pushObject);
				}
				var productBasketModel = new sap.ui.model.json.JSONModel(
						productBasketData);
				this.byId('productBasket').setModel(productBasketModel,"json");

				this.byId('productBasket').getModel("json").setData(
						productBasketData);
				oProductList.removeSelections();
				oEvent.getSource().getParent().close();
			},

			deleteProduct : function(oEvent) {
				var data = oEvent.getSource().getModel("json").getData();
				var product = oEvent.getSource().getBindingContext("json")
				.getObject();
				var i;
				var length = data.Products.length;
				var s5Controller = this.getView().getController();
				for (i = 0; i < length; i++)
					if (product === data.Products[i]) {
						data.Products.splice(i, 1);

					}
				s5Controller.byId('productBasket').getModel("json").setData(
						data);

			},

			showContactF4 : function(oEvent) {
				var oModel = this.getView().getModel();
				this.contactF4Fragment.getContent()[0].removeSelections();
				this.contactF4Fragment.setModel(new sap.ui.model.json.JSONModel());
				this.contactF4Fragment.setModel(this.getView().getModel(
				"i18n"), "i18n");
				this.contactF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('LOADING_TEXT'));
				var toolbar = this.contactF4Fragment.getContent()[0].getInfoToolbar();
				var toolbarLabel = toolbar.getContent()[0];
				toolbar.setVisible(false);
				var searchtxt = this.byId('inputMainContact')._lastValue;
		        var Text = searchtxt.split('/'); 
		        var searchstrng = Text[0].replace(/\s+$/,"");
		        this.contactF4Fragment.getSubHeader().getContentLeft()[0].setValue(searchstrng);
		        this.contactF4Fragment.open();
				var jsonModel = new sap.ui.model.json.JSONModel();
				this.contactF4Fragment.setModel(jsonModel,"json");
				if(this.accountId !== "" && this.acoundId !== null && this.accountId !== undefined)
				{
					toolbar.setVisible(true);
					
					
					toolbarLabel.setText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('FILTER') + " " +  this.accountName );	
					oModel.read("/AccountCollection(accountID='" + this.accountId + "')/Contacts",null,["$filter=substringof('"+searchstrng+"'"+",fullName)"],true,jQuery.proxy(function(odata,response) {
						this.contactF4Fragment.getModel('json').setData({ 
							ContactCollection : response.data.results 	        		
						});
						if(response.data.results.length === 0)
							this.contactF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NO_CONTACTS'));

					},this),jQuery.proxy(function(oError)
							{
						this.contactF4Fragment.getModel('json').setData({
							ContactCollection : []
						});
						this.contactF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NO_CONTACTS'));
							},this));
					
		     }
		     else
		     {
		    	 toolbar.setVisible(false);
		    	 this.contactF4Fragment.getModel('json').setData({ContactCollection : []});
			     this.contactF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('LOADING_TEXT'));
			    oModel.read("ContactCollection",null,["$filter=substringof('"+searchstrng+"'"+",fullName)"],true,jQuery.proxy(function(odata,response)
			    		 {
			    	  	  this.contactF4Fragment.getModel('json').setData({ 
		                  ContactCollection : response.data.results 	        		
		        });
			    	  if(response.data.results.length === 0)
		    	        	this.contactF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NO_CONTACTS'));     
			    		 },this),jQuery.proxy(function(oError)
			    	        {
			                	this.contactF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NO_CONTACTS'));
			    	        	
			    	        },this));
		     }
			},

			showAccountF4 : function(oEvent) {
				
				if(!this._accountSelectDialog){
					this._accountSelectDialog = new sap.ui.xmlfragment("cus.crm.opportunity.view.AccountSelectDialog", this);
					this._accountSelectDialog.setModel(this.getView().getModel());
					this._accountSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");
					this._accountSelectDialog._searchField.setPlaceholder(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SEARCH"));
					this._accountSelectDialog._list.setGrowingScrollToLoad(true);
					//need to check again
					this._accountSelectDialog._list.setGrowingThreshold(20);
					
					sap.ca.scfld.md.app.Application.getImpl().getConnectionManager().getModel().attachRequestSent(
							function () {
								if (this._list) {
									this._list.setNoDataText(this.getModel("i18n").getResourceBundle().getText("LOADING_TEXT"));
								}
							}
							, this._accountSelectDialog);
					
					sap.ca.scfld.md.app.Application.getImpl().getConnectionManager().getModel().attachRequestCompleted(
							function () {
								if (this._list) {
									this._list.setNoDataText(this.getModel("i18n").getResourceBundle().getText("NO_DATA_TEXT"));
								}
							}
							, this._accountSelectDialog);
					
					this._accountSelectDialog._dialog.setVerticalScrolling(true);
					}
				
				this._accountSelectDialog.getModel().attachRequestCompleted(null,this._setAccountF4Text,this);
				
				var aFilters = [];
				var sAccountAnnotation = cus.crm.opportunity.util.schema._getEntityAnnotation(this.oModel,'service-schema-version','Account');
				
				var sText = this.byId('customer').getValue();
				
				if(sText !== ""){
					aFilters.push(new sap.ui.model.Filter(((sAccountAnnotation === null) ? "name1" : "fullName"), sap.ui.model.FilterOperator.Contains, sText));	
				}
				
				this._accountSelectDialog._list.bindAggregation("items",{
					  path : "/AccountCollection",
					  parameters : {
						  expand : "MainAddress",
						  select : "accountID,MainAddress/city,MainAddress/country," + ((sAccountAnnotation === null) ? "name1" : "fullName")
					  },
					  filters : aFilters,
					  template : this.accountF4Template,
					 
				});

				
				this._accountSelectDialog.open();	
			},

			closeAccountF4 : function(oEvent) {
				this.byId('dialogAccountF4').close();
				this.accountf4open="";
			},

			closeContactF4 : function(oEvent) {
				var jsonModel = new sap.ui.model.json.JSONModel();
				jsonModel.setData({ContactCollection : []});
				this.contactF4Fragment.setModel(jsonModel,"json");
				this.contactF4Fragment.close();
			},

			setAccount : function(oEvent) {

				var selectedItem = oEvent.getParameter("selectedItem");
				var accountName = selectedItem.data('NAME');
				var accountId = selectedItem.data("ID");
				
				if(accountName !== ""){
					this.byId('customer').setValue(accountName);
					this.accountName = accountName;
				}
				else{
					//the accountId is set to the account field when the name is empty
					this.byId('customer').setValue(accountId);
				    this.accountName = accountId;			
			 	}			
				
				this.accountId = accountId;
				this.byId('customer').setValueState(sap.ui.core.ValueState.None);
			
				this.enableSaveBtn();
			},

			closeSalesAreaF4 : function(oEvent)
			{
				if(this.salesareaF4Fragment !== undefined){
					this.salesareaF4Fragment.close();
				if(this.salesareaF4Fragment.getSubHeader().getContentLeft()[0].getValue()!="")
					this.salesareaF4Fragment.getSubHeader().getContentLeft()[0].setValue("");
				}
			},

			setSalesArea : function(oEvent) {
				this.oSelectedContact = oEvent.getSource().getSelectedItem().getBindingContext("json").getObject();
				
				this.acc_salesorgid = this.oSelectedContact.SalesOrganizationId;
				this.acc_salesorgdesc = this.oSelectedContact.SalesOrganizationText;
				var salesorganization = cus.crm.opportunity.util.Formatter.formatSalesOrganization(this.acc_salesorgdesc, this.acc_salesorgid);
				this.getView().byId("salesOrganization").setValue(salesorganization);
				
				this.acc_dischaid = this.oSelectedContact.DistrubutionChannelId;
				this.acc_dischadesc = this.oSelectedContact.DistrubutionChannelText;
				var distributionchannel = cus.crm.opportunity.util.Formatter.formatDistributionChannel(this.acc_dischadesc, this.acc_dischaid);
				this.getView().byId("distributionchannel_Text").setText(distributionchannel);

				this.acc_divid = this.oSelectedContact.DivisionId;
				this.acc_divdesc = this.oSelectedContact.DivisionText;
				var division = cus.crm.opportunity.util.Formatter.formatDivision(this.acc_divdesc, this.acc_divid);
				this.getView().byId("division_Text").setText(division);

				this.salesareaF4Fragment.getContent()[0].removeSelections();
				this.closeSalesAreaF4(oEvent);
			},
			//Search in Sales Area pop up
			searchSalesArea : function(oEvent) {
				var sValue = oEvent.getParameter("query").toLowerCase();
				var salesAreaList=this.salesareaF4Fragment.getContent()[0].getModel("SalesArea").getProperty("/SalesAreaList").results;
				
				var searchPush= new Array();
				for ( var k = 0; k < salesAreaList.length; k++) {
					
					if(salesAreaList[k].SalesOrganizationText.toLowerCase().search(sValue)!= -1 ||
							salesAreaList[k].DistrubutionChannelText.toLowerCase().search(sValue)!= -1 ||
							salesAreaList[k].DivisionText.toLowerCase().search(sValue)!= -1 ){
					searchPush.push(salesAreaList[k]);

						
					}
					
				}
				this.salesareaF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_DATA_TEXT'));
				this.salesareaF4Fragment.getModel('json').setData({ 
					SalesAreaCollection :  searchPush        		
				});
				
				
			    this.salesareaF4Fragment.getModel('json').updateBindings();
			
				
			},

			//show sales area f4 help (open and load) after entering account id
			showSalesAreaF4 : function(oEvent)
			{
				
				var accountName = this.byId('customer').getValue();
				
				if(accountName.length==0){
					
						 var sMessage =this.oResourceBundle.getText('NO_ACCOUNT');
						    sap.m.MessageToast.show(sMessage);
						    
				     
					return;
				}

				if(!this.salesareaF4Fragment){
					this.salesareaF4Fragment  =  new sap.ui.xmlfragment(this.createId("salesareaF4"), 'cus.crm.opportunity.view.SalesAreaDialog', this);
					this.salesareaF4Fragment.setModel(new sap.ui.model.json.JSONModel(),"json");
					this.salesareaF4Fragment.setModel(this.oI18nModel,'i18n');
					
				}
				this.salesareaF4Fragment.getContent()[0].removeSelections();
				this.salesareaF4Fragment.setModel(this.oI18nModel, "i18n");
				
				this.salesareaF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('LOADING_TEXT'));
				var toolbar = this.salesareaF4Fragment.getContent()[0].getInfoToolbar();
				var toolbarLabel = toolbar.getContent()[0];

				if(this.accountId !== "" && this.accountId !== null && this.accountId !== undefined)
				{
					toolbar.setVisible(true);
					toolbarLabel.setText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('FILTER') + " " + this.accountName);	
					this.oModel.read("/SalesAreas",null,["$filter=ProspectNumber eq '"+ this.accountId + "'"],false,jQuery.proxy(function(odata,response) {
					
						this.salesareaF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_DATA_TEXT'));
						//Search in Sales Area pop up
						if (!this.salesareaF4Fragment
								.getModel("SalesArea")) {
							this.salesareaF4Fragment.setModel(
									new sap.ui.model.json.JSONModel(),
									"SalesArea");
						}
						var salesArea=this.salesareaF4Fragment.getContent()[0].getModel("SalesArea");
						salesArea.setProperty("/SalesAreaList",response.data);
					},this),jQuery.proxy(function(oError)
							{
						this.salesareaF4Fragment.getModel('json').setData({
							SalesAreaCollection : []
						});
						this.salesareaF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_DATA_TEXT'));
							},this));
				}
					
				
				
				var sValue = this.byId("salesOrganization").getValue().toLowerCase();
				 this.salesareaF4Fragment.getSubHeader().getContentLeft()[0].setValue(sValue);
				var salesAreaList=this.salesareaF4Fragment.getContent()[0].getModel("SalesArea").getProperty("/SalesAreaList").results;
				
				var searchPush= new Array();
				for ( var k = 0; k < salesAreaList.length; k++) {
					
					if(salesAreaList[k].SalesOrganizationText.toLowerCase().search(sValue)!= -1 ||
							salesAreaList[k].DistrubutionChannelText.toLowerCase().search(sValue)!= -1 ||
							salesAreaList[k].DivisionText.toLowerCase().search(sValue)!= -1 ){
					searchPush.push(salesAreaList[k]);

						
					}

				}
				this.salesareaF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_DATA_TEXT'));
				this.salesareaF4Fragment.getModel('json').setData({ 
					SalesAreaCollection :  searchPush        		
				});
				
				
			    this.salesareaF4Fragment.getModel('json').updateBindings();
				
				
					this.salesareaF4Fragment.open();
					
					
					
				
			}, 
		              
			closeEmployeeF4 : function(oEvent)
			{
				
				this.employeeF4Fragment.close();
			},
			
			//Handling employee f4 help (open and load)
			showEmployeeF4 : function(oEvent)
			{
				
				if(!this.employeeF4Fragment){
					this.employeeF4Fragment  =  new sap.ui.xmlfragment(this.createId("employeeF4"), 'cus.crm.opportunity.view.EmployeeF4', this);
					this.employeeF4Fragment.setModel(new sap.ui.model.json.JSONModel(),"json");
					this.employeeF4Fragment.setModel(this.oI18nModel,'i18n');
					
				}
				this.employeeF4Fragment.getContent()[0].removeSelections();
				this.employeeF4Fragment.setModel(this.oI18nModel, "i18n");
				
				this.employeeF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('LOADING_TEXT'));
				var toolbar = this.employeeF4Fragment.getContent()[0].getInfoToolbar();
				var toolbarLabel = toolbar.getContent()[0];
				toolbar.setVisible(false);
				var searchtxt = this.byId('inputEmpResponsible_S5').getValue();
		        var Text = searchtxt.split('/'); 
		        var searchstrng = Text[0].replace(/\s+$/,"");
		        this.employeeF4Fragment.getSubHeader().getContentLeft()[0].setValue(searchstrng);
				var opportunity_Data =this.HeaderObject;
				
			
				if(this.accountId !== undefined && this.accountId !== null && this.accountId !== "")
				{
					toolbar.setVisible(true);
					toolbarLabel.setText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('FILTER') + " " + this.accountName);	
					this.oModel.read("/AccountCollection(accountID='" + this.accountId + "')/EmployeeResponsibles",null,["$filter=substringof('"+this.byId('inputEmpResponsible_S5').getValue()+"'"+",fullName)"],true,jQuery.proxy(function(odata,response) {
					
						this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_DATA_TEXT'));
						this.employeeF4Fragment.getModel('json').setData({ 
							EmployeeCollection :  response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]        		
						});
					    this.employeeF4Fragment.getModel('json').updateBindings();
					},this),jQuery.proxy(function(oError)
							{
						this.employeeF4Fragment.getModel('json').setData({
							EmployeeCollection : []
						});
						this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_DATA_TEXT'));
							},this));
					
		     }
		     else{
		    	 toolbar.setVisible(false);
		    	 this.employeeF4Fragment.getModel('json').setData({EmployeeCollection : []});
			     this.employeeF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('LOADING_TEXT'));
			    this.oModel.read("EmployeeCollection",null,["$filter=substringof('"+this.byId('inputEmpResponsible_S5').getValue()+"'"+",fullName)"],true,jQuery.proxy(function(odata,response)
			    		 {
			    	  this.employeeF4Fragment.getModel('json').setData({ 
		                  EmployeeCollection :   response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]	        		
		                    });
			    	   	this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_DATA_TEXT'));     
			    		 },this),jQuery.proxy(function(oError)
			    	        {
			                	this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_DATA_TEXT'));
			    	        	
			    	        },this));
		     }
				this.employeeF4Fragment.open();
			},
			closeEmpToolbar : function(oEvent)
			{
				var toolbar = this.employeeF4Fragment.getContent()[0].getInfoToolbar();
				var olist =  this.employeeF4Fragment.getContent()[0];
				var searchText = this.employeeF4Fragment.getSubHeader().getContentLeft()[0].getValue();
				toolbar.setVisible(false);
				olist.getBinding("items").aFilters = [];
				olist.getBinding("items").sFilterParams = "";
				olist.getBinding("items").refresh();
				this.employeeF4Fragment.getModel('json').setData({EmployeeCollection : []});
				olist.setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('LOADING_TEXT'));
				this.oModel.read("EmployeeCollection",null,["$filter=substringof('" + searchText + "',fullName)"],true,jQuery.proxy(function(odata,response)
						{
					this.employeeF4Fragment.getModel('json').setData({ 
						EmployeeCollection : response.data.results 	        		
					});
							
					if(response.data.results.length === 0)
						this.employeeF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NO_DATA_TEXT'));     
						},this),jQuery.proxy(function(oError)
								{
							this.employeeF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NO_DATA_TEXT'));

								},this));
				
			},
			searchEmployee : function(oEvent)
			{
				var sValue = oEvent.getParameter("query");
				this.employeeF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('LOADING_TEXT'));
				var toolbar = this.employeeF4Fragment.getContent()[0].getInfoToolbar();
				if(toolbar.getVisible()===false){
					this.oModel.read("EmployeeCollection",null,["$filter=substringof('"+sValue+"'"+",fullName)"],true,jQuery.proxy(function(odata,response) {
					
						this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_DATA_TEXT'));
					 this.employeeF4Fragment.getModel('json').setData({ 
						 EmployeeCollection : (response.data.hasOwnProperty("results")) ? response.data.results : [response.data] 	        		
					 });
					
						

				 },this),jQuery.proxy(function(oError)
						 {
					 this.employeeF4Fragment.getModel('json').setData({

						 EmployeeCollection : []
					 });
					 this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_DATA_TEXT'));

						 },this));
				}
				else
					{		
					this.oModel.read("/AccountCollection(accountID='" + this.accountId + "')/EmployeeResponsibles",null,["$filter=substringof('"+sValue+"'"+",fullName)"],true,jQuery.proxy(function(odata,response) {
					
						this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_DATA_TEXT'));
						this.employeeF4Fragment.getModel('json').setData({ 
						 EmployeeCollection : (response.data.hasOwnProperty("results")) ? response.data.results : [response.data] 	        		
					 });
					 
						 

				 },this),jQuery.proxy(function(oError)
						 {
					 this.employeeF4Fragment.getModel('json').setData({

						 EmployeeCollection : []
					 });
					 this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_DATA_TEXT'));

						 },this));
				}
				
			},
			setEmployee : function(oEvent)
			{
				this.oSelectedEmployee = oEvent.getSource().getSelectedItem().getBindingContext("json").getObject();
				if(this.oSelectedEmployee.fullName !== "")
					this.byId('inputEmpResponsible_S5').setValue(this.oSelectedEmployee.fullName);
				else 
					this.byId('inputEmpResponsible_S5').setValue(this.oSelectedEmployee.employeeID);
				this.employeeF4Fragment.getContent()[0].removeSelections();
				var jsonModel = new sap.ui.model.json.JSONModel();
				jsonModel.setData({EmployeeCollection : []});
				this.employeeF4Fragment.setModel(jsonModel,"json");
				this.employeeF4Fragment.close();

			},

			setContact : function(oEvent) {
				this.oSelectedContact = oEvent.getSource().getSelectedItem().getBindingContext("json").getObject();
				if(this.oSelectedContact.fullName !== "")
					this.byId('inputMainContact').setValue(this.oSelectedContact.fullName);
				else 
					this.byId('inputMainContact').setValue(this.oSelectedContact.contactID);
				this.contactId = this.oSelectedContact.contactID;
				this.contactF4Fragment.getContent()[0].removeSelections();
				var jsonModel = new sap.ui.model.json.JSONModel();
				jsonModel.setData({ContactCollection : []});
				this.contactF4Fragment.setModel(jsonModel,"json");
				this.contactF4Fragment.close();

			},

			searchAccount : function(oEvent){
				
				var sValue = oEvent.getParameter("value");
				var aFilters = [];
				
				if (sValue !== "") {
					
				    var sAccountAnnotation = cus.crm.opportunity.util.schema._getEntityAnnotation(this.oModel,'service-schema-version','Account');
					//push the necessary filter
					aFilters.push(new sap.ui.model.Filter(((sAccountAnnotation === null) ? "name1" : "fullName"), sap.ui.model.FilterOperator.Contains, sValue));
				}
				
				    var itemsBinding = oEvent.getParameter("itemsBinding");
				    
				    if(itemsBinding){
				            itemsBinding.aApplicationFilters = [];  
				            itemsBinding.filter(aFilters);
				    		
				    }
				
				
			},

			searchContact : function(oEvent)
			{
				var sValue = oEvent.getParameter("query");
				this.contactF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('LOADING_TEXT'));
				var toolbar = this.contactF4Fragment.getContent()[0].getInfoToolbar();
				if(toolbar.getVisible()===false){
					this.getView().getModel().read("ContactCollection",null,["$filter=substringof('"+sValue+"'"+",fullName)"],true,jQuery.proxy(function(odata,response) {
					 this.contactF4Fragment.getModel('json').setData({ 
						 ContactCollection : response.data.results 	        		
					 });
					 if(response.data.results.length === 0)
						 this.contactF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NO_CONTACTS'));

				 },this),jQuery.proxy(function(oError)
						 {
					 this.contactF4Fragment.getModel('json').setData({

						 ContactCollection : []
					 });
					 this.contactF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NO_CONTACTS'));

						 },this));
				}
				else
					{		
					this.getView().getModel().read("/AccountCollection(accountID='" + this.accountId + "')/Contacts",null,["$filter=substringof('"+sValue+"'"+",fullName)"],true,jQuery.proxy(function(odata,response) {
					 this.contactF4Fragment.getModel('json').setData({ 
						 ContactCollection : response.data.results 	        		
					 });
					 if(response.data.results.length === 0)
						 this.contactF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NO_CONTACTS'));

				 },this),jQuery.proxy(function(oError)
						 {
					 this.contactF4Fragment.getModel('json').setData({

						 ContactCollection : []
					 });
					 this.contactF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NO_CONTACTS'));

						 },this));
				}
				
			},

			closeToolbar : function(oEvent)
			{
				var toolbar = this.contactF4Fragment.getContent()[0].getInfoToolbar();
				var olist =  this.contactF4Fragment.getContent()[0];
				var searchText = this.contactF4Fragment.getSubHeader().getContentLeft()[0].getValue();
				toolbar.setVisible(false);
				olist.getBinding("items").aFilters = [];
				olist.getBinding("items").sFilterParams = "";
				olist.getBinding("items").refresh();
				this.contactF4Fragment.getModel('json').setData({ContactCollection : []});
				olist.setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('LOADING_TEXT'));
				this.getView().getModel().read("ContactCollection",null,["$filter=substringof('" + searchText + "',fullName)"],true,jQuery.proxy(function(odata,response)
						{
					this.contactF4Fragment.getModel('json').setData({ 
						ContactCollection : response.data.results 	        		
					});
					if(response.data.results.length === 0)
						this.contactF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NO_CONTACTS'));     
						},this),jQuery.proxy(function(oError)
								{
							this.contactF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NO_CONTACTS'));
								},this));
			},


			showCurrencyF4 : function(){
				
				var sText = this.byId('currency').getValue();
				
				if(!this.oCurrencyF4Fragment){
				this.oCurrencyF4Fragment = sap.ui.xmlfragment(
						"cus.crm.opportunity.view.CurrencySelectDialog",
						this);
				this.oCurrencyF4Fragment.setModel(this.getView().getModel(
				"i18n"), "i18n");
				var jsonModel = new sap.ui.model.json.JSONModel({Currencies : this.Currencies});
				
				this.oCurrencyF4Fragment.setModel(jsonModel,"json");
				
//				this.oCurrencyF4Fragment.getBinding("items").attachChange(function(oEvent){
//					
//					if(sText === ""){
//						this.oCurrencyF4Fragment._searchField.setPlaceholder(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SEARCH"));
//					}
//					else{
//						this.oCurrencyF4Fragment._searchField.setValue(sText);
//					} 
//				},this);
                
				}
				
				var aFilters = [];
				
				if(sText === ""){
					this.oCurrencyF4Fragment._searchField.setPlaceholder(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SEARCH"));
					}
					else{
						this.oCurrencyF4Fragment._searchField.setValue(sText);	
						 aFilters = new sap.ui.model.Filter([
							       								new sap.ui.model.Filter("CurrencyText",
							       										sap.ui.model.FilterOperator.Contains,
							       										sText),
							       								new sap.ui.model.Filter("CurrencyKey",
							       										sap.ui.model.FilterOperator.Contains,
							       										sText) ], false);
					}
					
			 
				 this.oCurrencyF4Fragment.getBinding("items").filter(aFilters);
				 
				 
				 //HACK: issue with select dialog not setting search value when binding is being refreshed
				 window.setTimeout(jQuery.proxy(function(){
					 
					 if(sText === ""){
						this.oCurrencyF4Fragment._searchField.setPlaceholder(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SEARCH"));
						}
						else{
							this.oCurrencyF4Fragment._searchField.setValue(sText);
						} 
					
					 
				 },this),10);
				 this.oCurrencyF4Fragment.open();
			},

			setCurrency : function(oEvent) {
				var selectedItem = oEvent.getParameter("selectedItem");
				this.byId('currency').setValue(selectedItem.data("CurrencyKey"));
			},

			searchCurrency : function(oEvent) {

				var sValue = oEvent.getParameter("value");
				if (sValue !== undefined) {
					// apply the filter to the bound items, and the Select Dialog will update
					var filters = new sap.ui.model.Filter([
					       								new sap.ui.model.Filter("CurrencyText",
					       										sap.ui.model.FilterOperator.Contains,
					       										sValue),
					       								new sap.ui.model.Filter("CurrencyKey",
					       										sap.ui.model.FilterOperator.Contains,
					       										sValue) ], false);
					oEvent.getParameter("itemsBinding").filter([filters]);
				}

			
			},

			closeCurrencyF4 : function(oEvent) {
				this.byId('dialogCurrencyF4').close();
			},

			//Validation on Form
			descriptionChanged : function(oEvent)
			{
				var descriptionField = this.byId('desc');
				if(oEvent.getParameter('newValue').length > 40)
				{
					descriptionField.setValueState(sap.ui.core.ValueState.Error);
				}
				else
					descriptionField.setValueState(sap.ui.core.ValueState.None);
				this.enableSaveBtn();
			},

			quantityChanged : function(oEvent)
			{
				var data = oEvent.getSource().getBindingContext("json").getObject();
				var newValue = oEvent.getParameter('newValue'); 
				var pattern = /[^0-9.]/;
				if(pattern.test(newValue) === false)
				{
					if(newValue.split(".").length > 2)  //error
					{
						oEvent.getSource().setValue(data.OldValue);
					}
					else // no error 
					{
						data.OldValue = newValue;
						oEvent.getSource().setValueState(sap.ui.core.ValueState.None);

					}

				}
				else //error 
				{
					if(data.OldValue===undefined)
						data.OldValue=1;
					oEvent.getSource().setValue(data.OldValue);
				}
			},

			chanceOfSuccessChanged : function(oEvent)
			{
				var newValue = oEvent.getParameter('newValue'); 
				var pattern = /[^0-9.]/;
				if(pattern.test(newValue) === false)
				{
					if(newValue.split(".").length > 2)  //error
					{
						oEvent.getSource().setValue(this.OldcosValue);
					}
					else // no error 
					{
						this.OldcosValue = newValue;
						oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
					}

				}
				else //error 
				{
					oEvent.getSource().setValue(this.OldcosValue);
				}
			},

			volumeChanged : function(oEvent)
			{
				var newValue = oEvent.getParameter('newValue'); 
				var pattern = /[^0-9.]/;
				var checkPattern = newValue.charAt(0);
				if(pattern.test(newValue) === false)
				{
					if(newValue.split(".").length > 2)  //error
					{
						oEvent.getSource().setValue(this.OldvolumeValue);
					}
					else // no error 
					{
						this.OldvolumeValue = newValue;
						oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
					}

				}
				else if(pattern.test(checkPattern) === true){
					oEvent.getSource().setValue("");
				}
				else //error 
				{
					oEvent.getSource().setValue(this.OldvolumeValue);
				}
			},

			
			validateCurrency : function(){
				
				
				var currLenght = this.Currencies.length;
				var bReturnError = true;
				var currencyInput = this.getView().byId("currency").getValue().trim();
				currencyInput = currencyInput.toLocaleUpperCase();
				this.currencyMessage = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('INVALID_CURRENCY');
				if(currencyInput!=""){
					for (var i=0;i<currLenght; i++){
						if(this.Currencies[i].CurrencyKey===currencyInput){
							bReturnError = false;
							return;
						}
					}
				}
				else
					this.currencyMessage = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NULL_CURRENCY');
				return bReturnError;
			},	

			
			
			
			//Validate the data
			validateSavePage : function()
			{ var check_error = false;

			if(this.byId('desc').getValue() === ""){
				this.byId('desc').setValueState(sap.ui.core.ValueState.Error);
				check_error = true; 
			}
			//account field validation
			if(this.byId('customer').getValue() === ""){
				this.byId('customer').setValueState(sap.ui.core.ValueState.Error);
				check_error = true; 
			}
			//account field validation 
			if(this.accountName !== this.byId('customer').getValue()){
				this.byId('customer').setValueState(sap.ui.core.ValueState.Error);
				check_error = true; 
			}
			if(this.byId('volume').getValue() === ""){
				this.byId('volume').setValue(0);

			}

			if(this.byId('desc').getValueState() === sap.ui.core.ValueState.Error)
				check_error = true; 
			if((this.byId('datePickerStartDate').getValueState() === sap.ui.core.ValueState.Error) || (this.byId('datePickerCloseDate').getValueState() === sap.ui.core.ValueState.Error)){
				/*this.oAppImpl = sap.ca.scfld.md.app.Application.getImpl();
				sap.ca.ui.message.showMessageBox({type: sap.ca.ui.message.Type.ERROR,
					message: this.oAppImpl.getResourceBundle().getText('INVALID_DATE')
				});*/
				check_error = true;
			}

			if(this.byId('chanceofSuccess').getValueState() === sap.ui.core.ValueState.Error)
				check_error = true; 
			if(this.byId('volume').getValueState() === sap.ui.core.ValueState.Error)
				check_error = true; 
			
			var datePickerClose = this.byId('datePickerCloseDate');
			var closingDateLabel = $('#' + datePickerClose.getIdForLabel()).val();
			if(closingDateLabel === ""){
				this.byId('datePickerCloseDate').setValueState(sap.ui.core.ValueState.Error);
				check_error = true;   
			}
			
			if(this.validateProductBasket() === false){
				check_error = true;
			}
			if (check_error == true ){
				return false;
			}
			return true;		
			},
			
			validateProductBasket : function(){
				
				var items = this.byId('productBasket').getItems();
				var i,length;
				length = items.length;
				var check_error = false;
				
				if(length <= 0){
					return  !check_error;
				}
				
				//search the cell position of the Quantity layout! the same index can be reused in other table items
				var index = null;
				var cells = items[0].getCells();
				for(i = 0; i < cells.length; i++){
					if(cells[i].data("field") === "QUANTITY"){
						index = i;
						var qtyField = cells[i].getContent()[0];
						var val = parseFloat(qtyField.getValue()) + "";
						if(val === "NaN"){
						    qtyField.setValueState(sap.ui.core.ValueState.Error);
						    check_error = true;
						}
					}
				}
		      if(index){
				
		    	  for(i = 1; i < items.length; i++){
		    		  var qtyField = items[i].getCells()[index].getContent()[0];
		    			var val = parseFloat(qtyField.getValue()) + "";
						if(val === "NaN"){
						    qtyField.setValueState(sap.ui.core.ValueState.Error);
						    check_error = true;
						}
		    	  }
		    	  
		      }	
				return !check_error;
			},
			validateDates : function(){
				 //date validations for edit page - called on save
				   var datePickerStart = this.byId('datePickerStartDate');
				   var datePickerEnd = this.byId('datePickerCloseDate');
				   var labelStart = $('#' + datePickerStart.getIdForLabel()).val();
				   var labelEnd = $('#' + datePickerEnd.getIdForLabel()).val();
				   var bInvalidDates = false;
				   
				   //invalid start date
				   if(labelStart !== "" && (this.oDateFormatter.parse(labelStart)   === null))
					   {
					   bInvalidDates = true;
					   datePickerStart.setValueState(sap.ui.core.ValueState.Error);
					   sap.ca.ui.message.showMessageBox({
			               type: sap.ca.ui.message.Type.ERROR,
			               message: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('JUNK_DATE')
			             });
					 
					  
					   }
				 
				  //invalid end date
				   if(labelEnd !== "" && (this.oDateFormatter.parse(labelEnd)   === null))
				   {
				      bInvalidDates = true;
					   sap.ca.ui.message.showMessageBox({
			               type: sap.ca.ui.message.Type.ERROR,
			               message: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('JUNK_DATE')
			             });

				   datePickerEnd.setValueState(sap.ui.core.ValueState.Error);
				   
				   }
				   
				   if(bInvalidDates)
					   return false;
				   
				   //start date greater than end date
				   if(labelStart !== "" && labelEnd !== "" && this.oDateFormatter.parse(labelStart) > this.oDateFormatter.parse(labelEnd))
					   {
					   
					   sap.ca.ui.message.showMessageBox({
			               type: sap.ca.ui.message.Type.ERROR,
			               message: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('INVALID_DATE')
			             });
					    
					   datePickerEnd.setValueState(sap.ui.core.ValueState.Error);
					  
					   return false;
					   
					   }
				   return true;		
				
			},
			
			handleErrors : function(oError)
			{
				sap.ca.ui.utils.busydialog.releaseBusyDialog();
				jQuery.sap.log.error(JSON.stringify(oError));
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message : oError.message,
					details: JSON.parse(oError.response.body).error.message.value
				},function(oResult){});
			},
			_setAccountF4Text : function(oEvent){
				this._accountSelectDialog._searchField.setValue(this.byId('customer').getValue());
				
				this._accountSelectDialog.getModel().detachRequestCompleted(this._setAccountF4Text,this);
			},
			
			followUpView : function() {
				this.byId('desc').setValue(this.title); 
				this.byId('customer').setValue(this.AccountName);
				this.accountName = this.AccountName ;
				this.byId('inputMainContact').setValue(this.ContactName);
				this.byId('inputEmpResponsible_S5').setValue(this.ResponsibleTxt);
				this.byId('datePickerStartDate').setValue(cus.crm.opportunity.util.Formatter.dateFormatter(this.StartDate));
				this.getView().byId('datePickerCloseDate').setValue(cus.crm.opportunity.util.Formatter.dateFormatter(new Date()));
				this.byId('datePickerStartDate').setValueState(sap.ui.core.ValueState.None);
				this.byId('datePickerCloseDate').setValueState(sap.ui.core.ValueState.None);
				this.byId('datePickerStartDate').fireChange(this.byId('datePickerStartDate'));
				//this.byId('datePickerCloseDate').fireChange( this.byId('datePickerCloseDate'));
				this.getView().byId("TxtTypeInput").setText(this.ProcessTypeDescription);
				this.byId('Switch').setState(true);
				
			},
			fromTaskFollowUpView : function() {
				this.byId('desc').setValue(this.title); 
				this.byId('customer').setValue(this.AccountName);
				this.accountName = this.AccountName ;
				
				this.byId('inputMainContact').setValue(this.ContactName);
				this.byId('datePickerStartDate').setValue(cus.crm.opportunity.util.Formatter.dateFormatter(new Date()));
				this.getView().byId('datePickerCloseDate').setValue(cus.crm.opportunity.util.Formatter.dateFormatter(new Date()));
				this.byId('datePickerStartDate').setValueState(sap.ui.core.ValueState.None);
				this.byId('datePickerCloseDate').setValueState(sap.ui.core.ValueState.None);
				//this.byId('datePickerStartDate').fireChange(this.byId('datePickerStartDate'));
				//this.byId('datePickerCloseDate').fireChange( this.byId('datePickerCloseDate'));
				this.getView().byId("TxtTypeInput").setText(this.ProcessTypeDescription);
				this.byId('Switch').setState(true);
			},
			
			bindEditView : function(){
				var s3Controller;

				s3Controller = this.getView().getModel('controllers')
						.getData().s3Controller;
				var s3Object = {};
				// always keep the delete buffer to empty
				this.deleteBuffer = [];
				this.controller = s3Controller;
				s3Object.Header = s3Controller.byId('info').getModel(
						'json').getData();
				this.HeaderObject = s3Object.Header;
				this.headerGuid = s3Object.Header.Guid;
				;
				this.userStatusCode = s3Object.Header.UserStatusCode;
				this.UserStatuses = s3Object.UserStatuses;
				this.Currencies = s3Controller.Currencies;

				// this.oSelectedAccount.accountID =
				// s3Object.Header.ProspectNumber;
				this.currentDescription = s3Object.Header.Description;
				this.byId('desc').setValue(s3Object.Header.Description);
				// filling account id if account name is empty - for
				// edit page
				this.accountName = s3Object.Header.ProspectName;
				this.byId('customer').setValue(
						s3Object.Header.ProspectName);
				if (s3Object.Header.ProspectName === "")
					this.byId('customer').setValue(
							s3Object.Header.ProspectNumber);
				this.byId('inputEmpResponsible_S5').setValue(
						s3Object.Header.EmployeeResponsibleName);
				// this.byId('customer').setEditable(false);

				// this.byId('volume').setValue(s3Object.Header.ExpectedSalesVolume);
				// this.byId('id').setText(s3Object.Header.Id);
				// this.byId('chanceofSuccess').setValue(cus.crm.opportunity.util.Formatter.texttonumber(s3Object.Header.ChanceOfSuccess));
				this
						.byId('datePickerStartDate')
						.setValue(
								cus.crm.opportunity.util.Formatter
										.dateFormatter(s3Object.Header.StartDate));// Formatting
																					// the
																					// dates
				// this.byId('datePickerCloseDate').setValue(cus.crm.opportunity.util.Formatter.dateFormatter(s3Object.Header.ClosingDate));
				this.getView().byId('datePickerCloseDate').setValue(
						cus.crm.opportunity.util.Formatter
								.dateFormatter(new Date()));
				this.byId('datePickerStartDate').setValueState(
						sap.ui.core.ValueState.None);
				this.byId('datePickerCloseDate').setValueState(
						sap.ui.core.ValueState.None);
				// this.byId('datePickerCloseDate').fireChange(
				// this.byId('datePickerCloseDate'));
				this.byId('currency').setValue(
						s3Object.Header.CurrencyCode);
				this.byId('Switch').setState(
						s3Object.Header.ForecastRelevance);
				// this.byId('wtVol').setText(cus.crm.opportunity.util.Formatter.weightedvolume((s3Object.Header.ExpectedSalesVolume),Number(s3Object.Header.ChanceOfSuccess),s3Object.Header.CurrencyCode));

				// Opp to opp Follow Up in Sales Area

				this.getView().byId('salesOrganization').setValue(
						s3Object.Header.SalesOrganizationDescription);
				this.byId('distributionchannel_Text').setText(
						s3Object.Header.DistributionChannelDescription);
				this.byId('division_Text').setText(
						s3Object.Header.DivisionDescription);

				var oModel = s3Controller.getView().getModel();
				// this.byId('dialogContactF4').setModel(oModel);
				this.byId('inputMainContact').setValue(
						s3Object.Header.MainContactName);
				this.oSelectedContact.contactID = s3Object.Header.MainContactId;
				this.oSelectedContact.fullName = s3Object.Header.MainContactName;
				this.contactId = s3Object.Header.MainContactId;
				this.accountId = s3Object.Header.ProspectNumber;
				// set ProcessType Description.
				this.getView().byId("laTypeInput").setVisible(false);
				this.getView().byId("TxtTypeInput").setVisible(false);
				var processTypeDescr = null;
				if (s3Controller != null || s3Controller != undefined) {
					processTypeDescr = s3Controller.processTypeDesc;
					if (processTypeDescr != null) {
						this.getView().byId("laTypeInput").setVisible(
								true);
						this.getView().byId("TxtTypeInput").setVisible(
								true);
						this.getView().byId("TxtTypeInput").setText(
								processTypeDescr);
					}
				}
				// employee responsible - valid only since backend
				// schema version 2.0
				if (parseFloat(this.oVersioningModel.getData().BackendSchemaVersion) >= 2.0) {

					this.byId('inputEmpResponsible_S5').setValue(
							s3Object.Header.EmployeeResponsibleName);
					this.oSelectedAccount.accountID = s3Object.Header.ProspectNumber;
					this.oSelectedEmployee.employeeID = s3Object.Header.EmployeeResponsibleNumber;
				}

				// this.oSelectedEmployee.employeeID =
				// s3Object.Header.EmployeeResponsibleNumber;
				this.oSelectedEmployee.fullName = s3Object.Header.EmployeeResponsibleName;
				// this.processType =
				// oEvent.getParameter("arguments").processType;
				this.OldcosValue = this.byId('chanceofSuccess')
						.getValue();
				this.OldvolumeValue = this.byId('volume').getValue();
				this.ContactCollection = s3Controller.ContactCollection;
				this.EmployeeCollection = s3Controller.EmployeeCollection;
				// Set dropdowns (by kamal)
				// NLUN - CodeScan Changes - length is javascrip keyword
				var i, statusLength;
				var jsonModel = new sap.ui.model.json.JSONModel();
				var jsonModel1 = new sap.ui.model.json.JSONModel();
				var jsonModel2 = new sap.ui.model.json.JSONModel();
				var jsonModel3 = new sap.ui.model.json.JSONModel();
				// set userstatus
				statusLength = s3Controller.UserStatuses.length;
				// NLUN - CodeScan Changes - Global Variables
				var data1 = {
					UserStatuses : [ {
						BusinessTransaction : "",
						LanguageCode : "",
						ProcessType : this.processType,
						StatusProfile : "",
						UserStatusCode : "",
						UserStatusText : "",
					} ]
				};

				var initialStatus = "";
				for (i = 0; i < statusLength; i++) {
					if (s3Controller.UserStatuses[i].ProcessType === this.processType) {
						data1.UserStatuses
								.push(s3Controller.UserStatuses[i]);

						if (parseFloat(this.sBackendVersion) >= 3) {

							if (s3Controller.UserStatuses[i].InitialStatus == true)
								initialStatus = s3Controller.UserStatuses[i].UserStatusCode;
						}

						if (this.UserStatusCode === ""
								&& s3Controller.UserStatuses[i].UserStatusCode != "") {
							this.UserStatusCode = s3Controller.UserStatuses[i].UserStatusCode;
							this.UserStatusText = s3Controller.UserStatuses[i].UserStatusText;
						}

						if (s3Controller.UserStatuses[i].BusinessTransaction === "WINN") {
							this.getView().getController().WinStatusCode = s3Controller.UserStatuses[i].UserStatusCode;
						}
						if (s3Controller.UserStatuses[i].BusinessTransaction === "LOST") {
							this.getView().getController().LostStatusCode = s3Controller.UserStatuses[i].UserStatusCode;
						}
						this.StatusProfile = s3Controller.UserStatuses[i].StatusProfile;
					}
				}
				jsonModel.setData(data1);
				this.byId('statusdropdown').setModel(jsonModel, "json");
				this.byId('statusdropdown').setSelectedKey(
						initialStatus);
				// set priority
				var data2 = {
					Priorities : [ {
						LanguageCode : "",
						PriorityCode : "",
						PriorityText : "",
					} ]

				};
				statusLength = s3Controller.Priorities.length;
				for (i = 0; i < statusLength; i++) {
					data2.Priorities.push(s3Controller.Priorities[i]);
				}
				;
				jsonModel1.setData(data2);
				this.byId('priority_val').setModel(jsonModel1, "json");
				// set salesStage
				statusLength = s3Controller.SalesStages.length;
				var stagearray = new Array();
				var sortedArray = new Array();
				var sortedArrayItem;
				var salesCode;
				var successchance;
				// NLUN - CodeScan Changes - Global Variables
				var data3 = {
					SalesStages : [ {
						ChanceOfSuccess : "",
						LanguageCode : "",
						ProcessType : this.processType,
						SalesStageCode : "",
						SalesStageDescription : "",
						SalesStageOrder : "",
					} ]
				};
				for (i = 0; i < statusLength; i++) {
					if (s3Controller.SalesStages[i].ProcessType === this.processType) {
						data3.SalesStages
								.push(s3Controller.SalesStages[i]);

						// defaulting of sales stage area and chance of
						// success
						stagearray
								.push(s3Controller.SalesStages[i].SalesStageOrder);
						sortedArray = stagearray.sort();
						sortedArrayItem = sortedArray[0];

						if (s3Controller.SalesStages[i].SalesStageOrder == sortedArrayItem) {

							salesCode = s3Controller.SalesStages[i].SalesStageCode;
							successchance = Number(s3Controller.SalesStages[i].ChanceOfSuccess);
						}
					}
				}
				jsonModel2.setData(data3);
				this.byId('stagedropdown').setModel(jsonModel2, "json");
				this.byId('stagedropdown').setSelectedKey(salesCode);
				this.getView().byId("chanceofSuccess").setValue(
						successchance);
				// --- end of dropdowns----

				/*
				 * Disable the Add product button when status is
				 * WON/Lost
				 */
				if (this.byId('statusdropdown').getSelectedKey() === this.WinStatusCode
						|| this.byId('statusdropdown').getSelectedKey() === this.LostStatusCode) {
					this.byId('opportunityAddProd_Button').setVisible(
							false);
				} else
					this.byId('opportunityAddProd_Button').setVisible(
							true);
				// this.getView().getModel().setData(s3Object);
				var expandEntities = "Statuses";
				var data = s3Controller.byId('Product_Tab').getModel(
						'json').getData();
				if (data && data.hasOwnProperty("Products")) {
					var s3ObjectClone = JSON
							.parse(JSON.stringify(data));
					for (i = 0; i < s3ObjectClone.Products.length; i++) {
						if (s3ObjectClone.Products[i].ProductGuid === null)
							s3ObjectClone.Products[i].Backend = "CATEGORY";
						else
							s3ObjectClone.Products[i].Backend = "X";
						s3ObjectClone.Products[i].OldValue = s3ObjectClone.Products[i].Quantity;
						s3ObjectClone.Products[i].NetValue = 0;
						// this.BackendProducts[s3ObjectClone.Products[i].ItemGuid]
						// =
						// JSON.parse(JSON.stringify(s3ObjectClone.Products[i]));
					}
					jsonModel3.setData(s3ObjectClone);
					this.byId('productBasket').setModel(jsonModel3,
							"json");
				}
				if (!this.participantsF4MultiselectFragment) {
					this.participantsF4MultiselectFragment = new sap.ui.xmlfragment(
							this
									.createId("participantsF4Multiselect_S5"),
							'cus.crm.opportunity.view.ParticipantsF4Multiselect',
							this);
					this.participantsF4MultiselectFragment
							.setModel(new sap.ui.model.json.JSONModel(
									{}), "json");
					this.participantsF4MultiselectFragment.setModel(
							this.oI18nModel, 'i18n');

					}
				var data = s3Controller.byId('Sales_Team').getModel(
						'json').getData();
				if (!this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategory")) {
					this.participantsF4MultiselectFragment.setModel(
							new sap.ui.model.json.JSONModel(),
							"SelectedPartnerCategory");
				}
				
			    var	oSelectedPartnerModel = this.participantsF4MultiselectFragment
				.getModel("SelectedPartnerCategory");
			   // this.partnerDeterminationMap[this.processType]=[];
				
			    if(parseFloat(this.sBackendVersion) >= 4){
			    	
			    	var oUTIL = cus.crm.opportunity.util.Util;
			    	
			    	if(oUTIL.getPartnerFunctions() === null){
			    		oUTIL.fetchPartnerFunctions(this.oModel);
			    	}
			    	this.partnerDeterminationMap = oUTIL.getPartnerFunctions();
			    }
			    else{
				if (!this.partnerDeterminationMap[this.processType]) {

					this.oModel
							.read(
									"OpptPartnerFctTypes",
									null,
									[ "TransactionType='"
											+ this.processType + "'" ],
									false,
									jQuery
											.proxy(
													function(odata,
															response) {

														this.partnerDeterminationMap[this.processType] = response.data.results;
													}, this), jQuery
											.proxy(function(oError) {
											}, this));

				}
			    }
				this.participantsF4MultiselectFragment.getModel('json')
						.getData().PartnerFunctions = this.partnerDeterminationMap[this.processType];

				var aPartners = this.participantsF4MultiselectFragment
						.getModel("json").getProperty(
								"/PartnerFunctions");
				if (data
						&& data
								.hasOwnProperty("OpportunitySalesTeamSet")) {
					var participantsBasketData = {
						SalesTeam : []
					};

					this.byId('partnerBasket').getModel("json")
							.setData(participantsBasketData);
					var data1 = this.byId('partnerBasket').getModel(
							"json").getData();

					for ( var int2 = 0; int2 < data.OpportunitySalesTeamSet.length; int2++) {
						for ( var int3 = 0; int3 < aPartners.length; int3++) {
							
						
						if (data.OpportunitySalesTeamSet[int2].PartnerFunctionText == aPartners[int3].PartnerFunctionName){
						
						var pushObject = {
							Name : data.OpportunitySalesTeamSet[int2].PartnerName,
							Key : data.OpportunitySalesTeamSet[int2].PartnerNumber,
							PartnerFunction : data.OpportunitySalesTeamSet[int2].PartnerFunctionText,
						};

						participantsBasketData.SalesTeam
								.push(pushObject);
						}
						}

					}
					var dataCompetetors = s3Controller.byId('tab_competitor').getModel(
					'json').getData();
					if (dataCompetetors
							&& dataCompetetors
									.hasOwnProperty("Competitors")){
						for ( var int2 = 0; int2 < dataCompetetors.Competitors.results.length; int2++) {
							for ( var int3 = 0; int3 < aPartners.length; int3++) {
								
							
							if ("Competitor" == aPartners[int3].PartnerFunctionName){
							
							var pushObject = {
								Name : dataCompetetors.Competitors.results[int2].PartnerName,
								Key : dataCompetetors.Competitors.results[int2].PartnerNumber,
								PartnerFunction : "Competitor",
							};

							participantsBasketData.SalesTeam
									.push(pushObject);
							}
							}

						}
						
						
						
						
					}

					this.byId('partnerBasket').getModel("json")
							.setProperty('/SalesTeam',
									participantsBasketData.SalesTeam);

					for ( var k = 0; k < aPartners.length; k++) {
						
						var Value = new Array();

						for ( var l = 0; l < participantsBasketData.SalesTeam.length; l++) {
							if (participantsBasketData.SalesTeam[l].PartnerFunction == aPartners[k].PartnerFunctionName) {
								var pushObject = {
									key : participantsBasketData.SalesTeam[l].Key,
									value : participantsBasketData.SalesTeam[l].Name,
								};
								Value.push(pushObject)
							}
						}

						oSelectedPartnerModel.setProperty("/"
								+ aPartners[k].PartnerFunctionName,
								Value);

					}

				} else {
					

					this.oModel
							.read(
									"Opportunities(guid'"
											+ this.headerGuid + "')",
									null,
									[ "$expand=SalesTeam" ],
									false,
									jQuery
											.proxy(
													function(odata,
															response) {

														var participantsBasketData = {
															SalesTeam : []
														};

														this
																.byId(
																		'partnerBasket')
																.getModel(
																		"json")
																.setData(
																		participantsBasketData);
														var data1 = this
																.byId(
																		'partnerBasket')
																.getModel(
																		"json")
																.getData();

														for ( var int2 = 0; int2 < odata.SalesTeam.results.length; int2++) {
															for ( var int4 = 0; int4 < aPartners.length; int4++) {
																
															
															if (odata.SalesTeam.results[int2].PartnerFunctionText == aPartners[int4].PartnerFunctionName) {
															var pushObject = {
																Name : odata.SalesTeam.results[int2].PartnerName,
																Key : odata.SalesTeam.results[int2].PartnerNumber,
																PartnerFunction : odata.SalesTeam.results[int2].PartnerFunctionText,
															};

															participantsBasketData.SalesTeam
																	.push(pushObject);
															}
															}

														}
														var dataCompetetors = s3Controller.byId('tab_competitor').getModel(
														'json').getData();
														if (dataCompetetors
																&& dataCompetetors
																		.hasOwnProperty("Competitors")){
															for ( var int2 = 0; int2 < dataCompetetors.Competitors.results.length; int2++) {
																for ( var int3 = 0; int3 < aPartners.length; int3++) {
																	
																
																if ("Competitor" == aPartners[int3].PartnerFunctionName){
																
																var pushObject = {
																	Name : dataCompetetors.Competitors.results[int2].PartnerName,
																	Key : dataCompetetors.Competitors.results[int2].PartnerNumber,
																	PartnerFunction : "Competitor",
																};

																participantsBasketData.SalesTeam
																		.push(pushObject);
																}
																}

															}
															
															
															
															
														}
														

														this
																.byId(
																		'partnerBasket')
																.getModel(
																		"json")
																.setProperty(
																		'/SalesTeam',
																		participantsBasketData.SalesTeam);
														

														for ( var k = 0; k < aPartners.length; k++) {

															var Value = new Array();

															for ( var l = 0; l < participantsBasketData.SalesTeam.length; l++) {
																if (participantsBasketData.SalesTeam[l].PartnerFunction == aPartners[k].PartnerFunctionName) {
																	var pushObject = {
																		key : participantsBasketData.SalesTeam[l].Key,
																		value : participantsBasketData.SalesTeam[l].Name,
																	};
																	Value
																			.push(pushObject)
																}
															}

															oSelectedPartnerModel
																	.setProperty(
																			"/"
																					+ aPartners[k].PartnerFunctionName,
																			Value);

														}
													}, this), jQuery
											.proxy(function(oError) {

											}, this));
				}
				
				this.followUp=true;
				this.enableSaveBtn();

			},
			enableProductsAddButton : function(oEvent){
		    	
			       if(this.oAddProductsFragment.getContent()[0].getSelectedItems().length > 0){
			    	   this.oAddProductsFragment.getBeginButton().setEnabled(true);
			       }
			       else{
			    	   this.oAddProductsFragment.getBeginButton().setEnabled(false);
			       }
			    },
			    
			    onShowParticipants : function(oEvent) {
					var selectParticipants;
					if (!this.participantsF4MultiselectFragment) {
						this.participantsF4MultiselectFragment = new sap.ui.xmlfragment(
								this
										.createId("participantsF4Multiselect_S5"),
								'cus.crm.opportunity.view.ParticipantsF4Multiselect',
								this);
						this.participantsF4MultiselectFragment
								.setModel(new sap.ui.model.json.JSONModel(
										{}), "json");
						this.participantsF4MultiselectFragment.setModel(
								this.oI18nModel, 'i18n');

						// attach change event
						selectParticipants = this.participantsF4MultiselectFragment
								.getContent()[0];

					}

					// the customizing of partner functions
					selectParticipants = this.participantsF4MultiselectFragment
							.getContent()[0];
					this.participantsF4MultiselectFragment.getModel('json')
							.getData().PartnerFunctions = [];
					
					if(parseFloat(this.sBackendVersion) >= 4){
						var oUTIL = cus.crm.opportunity.util.Util;
						if(oUTIL.getPartnerFunctions() === null){
							oUTIL.fetchPartnerFunctions(this.oModel);
						}
						this.partnerDeterminationMap = oUTIL.getPartnerFunctions();
					}
					else{
					if (!this.partnerDeterminationMap[this.processType]) {

						this.oModel
								.read(
										"OpptPartnerFctTypes",
										null,
										[ "TransactionType='"
												+ this.processType + "'" ],
										false,
										jQuery
												.proxy(
														function(odata,
																response) {

															this.partnerDeterminationMap[this.processType] = response.data.results;
														}, this), jQuery
												.proxy(function(oError) {
												}, this));

					}
					}
					this.participantsF4MultiselectFragment.getModel('json')
							.getData().PartnerFunctions = this.partnerDeterminationMap[this.processType];
					this.participantsF4MultiselectFragment.getModel('json')
							.updateBindings();

					this.participantsF4MultiselectFragment.getContent()[0]
							.getPages()[0].getContent()[0].bindItems(
							"json>/PartnerFunctions",
							this.oPartnerFunctionsTemplate, null, []);
					// To Update Count
					if (this.participantsF4MultiselectFragment
							.getModel("SelectedPartnerCategory")) {
						var oSelectedPartnerModel = this.participantsF4MultiselectFragment
								.getModel("SelectedPartnerCategory");

						var aPartners = this.participantsF4MultiselectFragment
								.getModel("json").getProperty(
										"/PartnerFunctions");
						var tempSelectedPartners = new Array();
						for ( var k = 0; k < aPartners.length; k++) {

							if (this.participantsF4MultiselectFragment
									.getModel("SelectedPartnerCategory")
									.getProperty(
											"/"
													+ aPartners[k].PartnerFunctionName)) {
								tempSelectedPartners
										.push(aPartners[k].PartnerFunctionName);
							}

						}

						var items = this.participantsF4MultiselectFragment
								.getContent()[0].getPages()[0].getContent()[0]
								.getItems();

						for ( var k = 0; k < items.length; k++) {

							for ( var int3 = 0; int3 < tempSelectedPartners.length; int3++) {

								if (items[k].getBindingContext('json')
										.getObject().PartnerFunctionName == tempSelectedPartners[int3]) {

									var count = oSelectedPartnerModel
											.getProperty("/"
													+ tempSelectedPartners[int3]).length;
									if (count > 0) {
										items[k].setInfo(count);
									} else {

										items[k].setInfo(" ");
									}

								}

							}
						}

					}
					this.participantsF4MultiselectFragment.open();
				},

			
			handleConfirm: function (oEvent) {
			    jQuery.sap.require("sap.m.MessageToast");
			    if (oEvent.getParameters().filterString) {
			      sap.m.MessageToast.show(oEvent.getParameters().filterString);
			    }
		   },
		   
		   
			
			onCancelParticipantDialog : function(oEvent) {
				
                // To Remove Focus On Selected 
				if (this.participantsF4MultiselectFragment.getContent()[0]
						.getPages()[1].getId() == oEvent.getSource()
						.getParent().getParent().getId()) {

					this.participantsF4MultiselectFragment.getContent()[0]
							.getPages()[0].getContent()[0]
							.getSelectedItem().setSelected(false);

				}
                // To set Count
//				if (!this.participantsF4MultiselectFragment
//						.getModel("SelectedPartnerCategoryTemp")) {
//					this.participantsF4MultiselectFragment.setModel(
//							new sap.ui.model.json.JSONModel(),
//							"SelectedPartnerCategoryTemp");
//				}
//				if (this.participantsF4MultiselectFragment
//						.getModel("SelectedPartnerCategoryDeletedTemp")) {
//					this.participantsF4MultiselectFragment
//					.getModel("SelectedPartnerCategoryDeletedTemp").destroy();
//				}
//				var oSelectedPartnerModelTemp = this.participantsF4MultiselectFragment
//						.getModel("SelectedPartnerCategoryTemp");
//
//				var aPartners = this.participantsF4MultiselectFragment
//						.getModel("json").getProperty(
//								"/PartnerFunctions");
//				var tempSelectedPartners = new Array();
//				for ( var k = 0; k < aPartners.length; k++) {
//
//					if (this.participantsF4MultiselectFragment
//							.getModel("SelectedPartnerCategoryTemp")
//							.getProperty(
//									"/"
//											+ aPartners[k].PartnerFunctionName)) {
//						tempSelectedPartners
//								.push(aPartners[k].PartnerFunctionName);
//					}
//
//				}
//
//				var items = this.participantsF4MultiselectFragment
//						.getContent()[0].getPages()[0].getContent()[0]
//						.getItems();
//
//				for ( var k = 0; k < items.length; k++) {
//
//					for ( var int3 = 0; int3 < tempSelectedPartners.length; int3++) {
//
//						if (items[k].getBindingContext('json')
//								.getObject().PartnerFunctionName == tempSelectedPartners[int3]) {
//							items[k].setInfo(" ");
//
//						}
//
//					}
//				}
                
				
				// To Remove Temp Data
				if (this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategoryTemp")) {

					this.participantsF4MultiselectFragment.getModel(
							"SelectedPartnerCategoryTemp").destroy();
				}
				if (this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategoryDeletedTemp")) {

					this.participantsF4MultiselectFragment.getModel(
							"SelectedPartnerCategoryDeletedTemp").destroy();
				}

				if (this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategoryTemp1")) {

					this.participantsF4MultiselectFragment.getModel(
							"SelectedPartnerCategoryTemp1").destroy();
				}
				if (this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategoryTemp2")) {

					this.participantsF4MultiselectFragment.getModel();
				}
				
				

				var oNavCont = this.participantsF4MultiselectFragment
						.getContent()[0];
				oNavCont.to(this.participantsF4MultiselectFragment
						.getContent()[0].getPages()[0]);
				this.participantsF4MultiselectFragment.close();
			},
			
			onOKParticipantDialog : function(oEvent) {

				if (!this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategory")) {
					this.participantsF4MultiselectFragment.setModel(
							new sap.ui.model.json.JSONModel(),
							"SelectedPartnerCategory");
				}
				var aPartners = this.participantsF4MultiselectFragment
				.getModel("json").getProperty(
						"/PartnerFunctions");
				
				
				
				if(this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategoryDeletedTemp")){
					
					
					for ( var k = 0; k < aPartners.length; k++) {
						if(this.participantsF4MultiselectFragment
								.getModel("SelectedPartnerCategoryDeletedTemp")
								.getProperty("/" + aPartners[k].PartnerFunctionName)){
							
							var itemList=this.participantsF4MultiselectFragment
							.getModel("SelectedPartnerCategoryDeletedTemp")
							.getProperty("/" + aPartners[k].PartnerFunctionName);
							
							for ( var int2 = 0; int2 < itemList.length; int2++) {
								
								var selectedPartner=this.participantsF4MultiselectFragment
										.getModel("SelectedPartnerCategory")
										.getProperty("/" + aPartners[k].PartnerFunctionName);
								
								for ( var int3 = 0; int3 < selectedPartner.length; int3++) {
									if(selectedPartner[int3].key==itemList[int2].getDescription())
									this.participantsF4MultiselectFragment
									.getModel("SelectedPartnerCategory")
									.getProperty(
											"/" + aPartners[k].PartnerFunctionName)
									.splice(int3, 1);
									
								}
								
								
								
							}
							
							
							
							
						}
						
					
						
						
					}
					
					
					
					
				}
				
				this.participantsF4MultiselectFragment
				.getModel("SelectedPartnerCategoryDeletedTemp").destroy();	
				
				var oSelectedPartnerModel = this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategory");
				
				//To Add Temp Entry to Main Model,To Set Count and To Remove Focus From Selected when OK clicked From Partner List Page
				if (this.participantsF4MultiselectFragment.getContent()[0]
						.getPages()[1].getId() == oEvent.getSource()
						.getParent().getParent().getId()) {
					var sSelectedCategory = this.participantsF4MultiselectFragment
							.getContent()[0]._sSelectedPartnerCategory;
					var aEmployeeIds = [];

					if (!this.participantsF4MultiselectFragment
							.getModel("SelectedPartnerCategoryTemp")) {
						this.participantsF4MultiselectFragment
								.setModel(
										new sap.ui.model.json.JSONModel(),
										"SelectedPartnerCategoryTemp");
					}
					var oSelectedPartnerModelTemp = this.participantsF4MultiselectFragment
							.getModel("SelectedPartnerCategoryTemp");
					
					var oListPartnerFct = this.participantsF4MultiselectFragment
							.getContent()[0].getPages()[0].getContent()[0];
					

					oListPartnerFct.getSelectedItem()
							.setSelected(false);
				}
				
				
				var tempSelectedPartners = new Array();
				

				var oSelectedPartnerModelTemp = this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategoryTemp");

				
				for ( var k = 0; k < aPartners.length; k++) {

					if (this.participantsF4MultiselectFragment
							.getModel("SelectedPartnerCategoryTemp")
							.getProperty(
									"/"
											+ aPartners[k].PartnerFunctionName)) {
						tempSelectedPartners
								.push(aPartners[k].PartnerFunctionName);
						if(oSelectedPartnerModel
								.getProperty(
										"/"
												+ aPartners[k].PartnerFunctionName)){
							for ( var int2 = 0; int2 < oSelectedPartnerModelTemp.getProperty("/"+ aPartners[k].PartnerFunctionName).length; int2++) {
								
								
							
						oSelectedPartnerModel
								.getProperty(
										"/"
												+ aPartners[k].PartnerFunctionName).push(
										oSelectedPartnerModelTemp
												.getProperty("/"
														+ aPartners[k].PartnerFunctionName)[int2]);
					}
							}
						else{
							
							oSelectedPartnerModel
							.setProperty(
									"/"
											+ aPartners[k].PartnerFunctionName,
									oSelectedPartnerModelTemp
											.getProperty("/"
													+ aPartners[k].PartnerFunctionName));
							
						}
					}

				}

				oSelectedPartnerModelTemp.destroy();
				//Pushing Values To Partner Table
				var selectedParticipants = this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategory");
				var availableParticipants = this.participantsF4MultiselectFragment
						.getModel("json").getProperty(
								"/PartnerFunctions");
				var participantsBasketData = {
					SalesTeam : []
				};

				this.byId('partnerBasket').getModel("json").setData(
						participantsBasketData);
				var data = this.byId('partnerBasket').getModel("json")
						.getData();
				if (data && data.hasOwnProperty("SalesTeam"))
					participantsBasketData.SalesTeam = data.SalesTeam;

				for ( var k = 0; k < availableParticipants.length; k++) {
					if (selectedParticipants.getProperty("/"+availableParticipants[k].PartnerFunctionName)) {
						for ( var int2 = 0; int2 < selectedParticipants.getProperty("/"+availableParticipants[k].PartnerFunctionName).length; int2++) {
							var pushObject = {
								Name : selectedParticipants.getProperty("/"+availableParticipants[k].PartnerFunctionName)[int2].value,
								Key : selectedParticipants.getProperty("/"+availableParticipants[k].PartnerFunctionName)[int2].key,
								PartnerFunction : availableParticipants[k].PartnerFunctionName,
							};

							participantsBasketData.SalesTeam
									.push(pushObject);
						}
					}

				}

				this.byId('partnerBasket').getModel("json")
						.setProperty('/SalesTeam',
								participantsBasketData.SalesTeam);
				var oNavCont = this.participantsF4MultiselectFragment
						.getContent()[0];
				oNavCont._sSelectedPartnerCategoryAndParticipants = oSelectedPartnerModel;
				oNavCont.to(this.participantsF4MultiselectFragment
						.getContent()[0].getPages()[0]);
				this.participantsF4MultiselectFragment.close();

			},
			onNavBack : function(oEvent) {
				this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getSubHeader().getContentLeft()[0].clear();

				var sSelectedCategory = this.participantsF4MultiselectFragment
						.getContent()[0]._sSelectedPartnerCategory;
				
				//Storing Temp Values
				var oSelectedPartnerModel;
				if (this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategoryTemp")) {
					oSelectedPartnerModel= this.participantsF4MultiselectFragment
					.getModel("SelectedPartnerCategoryTemp");
				}
				
				if(this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategory"))
				var selected=this.participantsF4MultiselectFragment
				.getModel("SelectedPartnerCategory");
				if(this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategoryDeletedTemp"))
				var delected=this.participantsF4MultiselectFragment
				.getModel("SelectedPartnerCategoryDeletedTemp");
				
				
			
				
				// Set the count
				var count = 0;
				if(this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategoryTemp"))
				
				if(this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategoryTemp").getProperty("/"+sSelectedCategory))
					count = count+oSelectedPartnerModel.getProperty("/"+sSelectedCategory).length;
				if(selected)
				if(selected.getProperty("/"+sSelectedCategory))
					count = count+selected.getProperty("/"+sSelectedCategory).length;
				
				if(delected)
					if(delected.getProperty("/"+sSelectedCategory))
						count = count-delected.getProperty("/"+sSelectedCategory).length;
				
				
				
				var oListPartnerFct = this.participantsF4MultiselectFragment
						.getContent()[0].getPages()[0].getContent()[0];
				if (count != 0) {
					oListPartnerFct.getSelectedItem().setInfo(count);
				} else if (oListPartnerFct.getSelectedItem()) {
					oListPartnerFct.getSelectedItem().setInfo(" ");
				}
				oListPartnerFct.getSelectedItem().setSelected(false);

				// navigate to search page
				var oNavCont = this.participantsF4MultiselectFragment
						.getContent()[0];
				oNavCont._sSelectedPartnerCategoryAndParticipants = oSelectedPartnerModel;
				oNavCont.to(this.participantsF4MultiselectFragment
						.getContent()[0].getPages()[0]);
				// }

			},
			
		   onExit : function () {
			    if (this._oDialog) {
			      this._oDialog.destroy();
			    }
			  },
			  searchEmployeeList : function(oEvent) {

					var searchText = oEvent.getParameter("query");
					var filters = new sap.ui.model.Filter([
							new sap.ui.model.Filter("fullName",
									sap.ui.model.FilterOperator.Contains,
									searchText),
							new sap.ui.model.Filter("accountID",
									sap.ui.model.FilterOperator.Contains,
									searchText),
							new sap.ui.model.Filter("contactID",
									sap.ui.model.FilterOperator.Contains,
									searchText),
							new sap.ui.model.Filter("employeeID",
									sap.ui.model.FilterOperator.Contains,
									searchText) ], false);

					this.participantsF4MultiselectFragment.getContent()[0]
							.getPages()[1].getContent()[0].getBinding(
							'items').filter(
							(searchText !== "") ? [ filters ] : []);

				},
			  onParticipantDelete : function(oEvent) {
					var oItemToDelete = oEvent.getParameter("listItem");
					var oPartnerBasket = oEvent.getSource();
					var oParticipantList = this.byId('partnerBasket')
							.getItems();

					for ( var i = 0; i < oParticipantList.length; i++) {
						if (oParticipantList[i] == oItemToDelete) {
							var itemIndex = i;

						}
					}
					oEvent.getSource().removeItem(
							oEvent.getParameter("listItem"));
					oEvent.getParameter("listItem").destroy();

					var deletedValueName = this.byId('partnerBasket')
							.getModel("json").getData().SalesTeam[itemIndex].Name;
					var deletedValueParticipant = this
							.byId('partnerBasket').getModel("json")
							.getData().SalesTeam[itemIndex].PartnerFunction;
					var deletedValueParticipantKey = this.byId(
							'partnerBasket').getModel("json").getData().SalesTeam[itemIndex].Key;
					var items = this.participantsF4MultiselectFragment
							.getModel("SelectedPartnerCategory")
							.getProperty("/" + deletedValueParticipant);

					for ( var i = 0; i < items.length; i++) {
						if (items[i].key == deletedValueParticipantKey) {
							this.participantsF4MultiselectFragment
									.getModel("SelectedPartnerCategory")
									.getProperty(
											"/" + deletedValueParticipant)
									.splice(i, 1);
						}
					}
					this.byId('partnerBasket').getModel("json").getData().SalesTeam
							.splice(itemIndex, 1);
					var rPartnerFunctionList = this.participantsF4MultiselectFragment
							.getContent()[0].getPages()[0].getContent()[0]
							.getItems();
					for ( var i = 0; i < rPartnerFunctionList.length; i++) {
						if (rPartnerFunctionList[i].getBindingContext(
								"json").getObject().PartnerFunctionName == deletedValueParticipant) {
							var count = this.participantsF4MultiselectFragment
									.getContent()[0].getPages()[0]
									.getContent()[0].getItems()[i]
									.getInfo();
							if (count - 1 != 0) {
								this.participantsF4MultiselectFragment
										.getContent()[0].getPages()[0]
										.getContent()[0].getItems()[i]
										.setInfo(count - 1);
							}

							else if (count - 1 == 0) {
								this.participantsF4MultiselectFragment
										.getContent()[0].getPages()[0]
										.getContent()[0].getItems()[i]
										.setInfo(" ");
							}
						}
					}
					this.participantsF4MultiselectFragment.getContent()[0]
							.getPages()[0].getContent()[0].getItems();

				},
			  
						
			  onPartnerFunctionChange : function(oEvent) {
				 if (this.participantsF4MultiselectFragment
							.getModel("SelectedPartnerCategoryTemp1")) {
						this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategoryTemp1").destroy();
					}
					if (this.participantsF4MultiselectFragment
							.getModel("SelectedPartnerCategoryTemp2")) {
						this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategoryTemp2").destroy();
					}
					var searchText="",dummy;
					if(oEvent.getSource().getId().substring(oEvent.getSource().getId().length-11)=="searchField"){
					var searchText = oEvent.getParameter("query");
					if(searchText=="")
						searchText=" ";
					oSelectPartnerTypeContext =this.selectedBuffer.getBindingContext("json");
					dummy=true;
					if (!this.participantsF4MultiselectFragment
							.getModel("SelectedPartnerCategoryTemp1")) {
						this.participantsF4MultiselectFragment.setModel(
								new sap.ui.model.json.JSONModel(),
								"SelectedPartnerCategoryTemp1");
					}
					var oSelectedPartnerModel = this.participantsF4MultiselectFragment
							.getModel("SelectedPartnerCategoryTemp1");
					var oListPartner = this.participantsF4MultiselectFragment
							.getContent()[0].getPages()[1].getContent()[0], aEmployeeIds = [];

					for ( var i = 0; i < oListPartner.getSelectedItems().length; i++) {
						aEmployeeIds.push({
							key : oListPartner.getSelectedItems()[i]
									.getDescription(),
							value : oListPartner.getSelectedItems()[i]
									.getTitle()
						});
					}
					oSelectedPartnerModel.setProperty("/"
							+ this.PartnerName, aEmployeeIds);
					
					}
					var toolBar,oSelectPartnerTypeContext;
					if(oEvent.getSource().getId().substring(oEvent.getSource().getId().length-7)=="XButton"){
						this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getSubHeader().getContentLeft()[0].clear();
						if (!this.participantsF4MultiselectFragment
								.getModel("SelectedPartnerCategoryTemp2")) {
							this.participantsF4MultiselectFragment.setModel(
									new sap.ui.model.json.JSONModel(),
									"SelectedPartnerCategoryTemp2");
						}
						var oSelectedPartnerModel = this.participantsF4MultiselectFragment
								.getModel("SelectedPartnerCategoryTemp2");
						var oListPartner = this.participantsF4MultiselectFragment
								.getContent()[0].getPages()[1].getContent()[0], aEmployeeIds = [];

						for ( var i = 0; i < oListPartner.getSelectedItems().length; i++) {
							aEmployeeIds.push({
								key : oListPartner.getSelectedItems()[i]
										.getDescription(),
								value : oListPartner.getSelectedItems()[i]
										.getTitle()
							});
						}
						oSelectedPartnerModel.setProperty("/"
								+ this.PartnerName, aEmployeeIds);
						  this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().setVisible(false);
						  toolBar=false;
						  oSelectPartnerTypeContext =this.selectedBuffer.getBindingContext("json");
						    }else if(dummy){
						    	
						    	
						    	
						    }else{
						    	this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getSubHeader().getContentLeft()[0].clear();
						  this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().setVisible(true);
						  var oSelectedItem = oEvent.getParameter("listItem");
						  this.selectedBuffer=oSelectedItem;
						  oSelectPartnerTypeContext = oSelectedItem
							.getBindingContext("json");
						  toolBar=true;
					  }
					//this.accountId="3272";
				var sSelectedPartnerCategoryAndParticipants = this.participantsF4MultiselectFragment
				.getModel("SelectedPartnerCategory");
		        var sSelectedPartnerCategoryAndParticipantsTemp = this.participantsF4MultiselectFragment
				.getModel("SelectedPartnerCategoryTemp");
                
		       var aPartnerTypes = this.participantsF4MultiselectFragment
				.getModel("json").getProperty(
						"/PartnerFunctions"), oNavCont = this.participantsF4MultiselectFragment
				.getContent()[0];
		        if (!this.participantsF4MultiselectFragment
						.getModel("PartnersBasedOnType")) {
					this.participantsF4MultiselectFragment.setModel(
							new sap.ui.model.json.JSONModel(),
							"PartnersBasedOnType");
				}
		        
		        if(this.accountId){
					
				}else{
					
					toolBar=false;
					this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().setVisible(false);
				}
		        
		        if (aPartnerTypes.indexOf(oSelectPartnerTypeContext
						.getObject()) !== -1) {
					var iIndex = aPartnerTypes
							.indexOf(oSelectPartnerTypeContext
									.getObject());
									this.PartnerName=aPartnerTypes[iIndex]["PartnerFunctionName"];
					switch (aPartnerTypes[iIndex]["PartnerFunctionCategory"]) {
					case "0005":
					case "0008":
						
						var fnSuccess, fnError;
						
							fnSuccess = jQuery
									.proxy(
											function(sCategory, oData,
													oResponse) {
												var oCurPartnerModel = this.participantsF4MultiselectFragment
														.getModel("PartnersBasedOnType");
												oCurPartnerModel
														.setProperty(
																"/"
																		+ sCategory,
																oData.results);
												for ( var x = 0; x < oData.results.length; x++) {
													if(oData.results[x].fullName=="")
														oData.results[x].fullName=" ";
													
												}
												this.participantsF4MultiselectFragment
														.getContent()[0]
														.getPages()[1]
														.getContent()[0]
														.bindItems(
																"PartnersBasedOnType>/"
																		+ sCategory,
																this.employeeListItemTemplate1,
																null,
																[]);

											},
											this,
											aPartnerTypes[iIndex]["PartnerFunctionName"]);
							fnError = jQuery.proxy(function(oError) {
}, this);
							if(toolBar){
								this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().setVisible(true);
								 this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().getContent()[0].setText("Filtered By Account ID :"+this.accountName);
								  
							this.oModel.read("/AccountCollection(accountID='" + this.accountId + "')/EmployeeResponsibles",	null, null, false, fnSuccess,
									fnError);
							} else if(this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().getVisible()&&searchText){
								
								this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().getContent()[0].setText("Filtered By Account ID :"+this.accountName);
								
							this.oModel.read("/AccountCollection(accountID='" + this.accountId + "')/EmployeeResponsibles",	null, '$top=200&$filter=substringof(%27'+encodeURIComponent(searchText)+'%27,fullName)', false, fnSuccess,
									fnError);
							}
							else if(searchText.length>0){
								this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().setVisible(false);
								this.oModel.read("/EmployeeCollection",	null, '$top=200&$filter=substringof(%27'+encodeURIComponent(searchText)+'%27,fullName)', false, fnSuccess,
										fnError);
								
							}else{
								this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().setVisible(false);
								this.oModel.read("/EmployeeCollection",	null, null, false, fnSuccess,
										fnError);
							}
						
						
						
						this.participantsF4MultiselectFragment
						.getContent()[0].getPages()[1]
						.getContent()[0].destroyItems();
				this.participantsF4MultiselectFragment
						.getContent()[0].getPages()[1]
						.getContent()[0]
						.bindItems(
								"PartnersBasedOnType>/"
										+ aPartnerTypes[iIndex]["PartnerFunctionName"],
								this.employeeListItemTemplate1,
								null, []);
				var aPartnersBasedOnType = this.participantsF4MultiselectFragment
						.getContent()[0].getPages()[1]
						.getContent()[0].getItems();
				var modelValue = this.participantsF4MultiselectFragment
						.getModel("PartnersBasedOnType")
						.getProperty(
								"/"
										+ aPartnerTypes[iIndex]["PartnerFunctionName"]);
				var aEmployeeIds;
				if (this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategory")) {
					var aSelectedPartnerBasedOnType = sSelectedPartnerCategoryAndParticipants
							.getProperty("/"
									+ aPartnerTypes[iIndex]["PartnerFunctionName"]);
					if (aSelectedPartnerBasedOnType)
						for ( var i = 0; i < aPartnersBasedOnType.length; i++){
							for ( var k = 0; k < aSelectedPartnerBasedOnType.length; k++) {
								
							
							if (aSelectedPartnerBasedOnType[k]["key"] === aPartnersBasedOnType[i]
									.getDescription()) {
								aPartnersBasedOnType[i]
										.setSelected(true);
								
							}
							}
						}
				}

				if (this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategoryDeletedTemp")) {
					var aSelectedPartnerBasedOnTypeTemp = this.participantsF4MultiselectFragment
					.getModel("SelectedPartnerCategoryDeletedTemp").getProperty("/"
									+ aPartnerTypes[iIndex]["PartnerFunctionName"]);
					if (aSelectedPartnerBasedOnTypeTemp)
						for ( var i = 0;i < aPartnersBasedOnType.length; i++){
							
							for ( var k = 0; k < aSelectedPartnerBasedOnTypeTemp.length; k++) {
								if (aSelectedPartnerBasedOnTypeTemp[k].getDescription() === aPartnersBasedOnType[i]
								.getDescription()) {
									aPartnersBasedOnType[i]
									.setSelected(false);
								}
							}
						}
							

				}

				if (this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategoryTemp")) {
					var aSelectedPartnerBasedOnTypeTemp = this.participantsF4MultiselectFragment
					.getModel("SelectedPartnerCategoryTemp").getProperty("/"
									+ aPartnerTypes[iIndex]["PartnerFunctionName"]);
					if (aSelectedPartnerBasedOnTypeTemp)
						for ( var i = 0;i < aPartnersBasedOnType.length; i++){
							
							for ( var k = 0; k < aSelectedPartnerBasedOnTypeTemp.length; k++) {
								if (aSelectedPartnerBasedOnTypeTemp[k]["key"] === aPartnersBasedOnType[i]
								.getDescription()) {
									aPartnersBasedOnType[i]
									.setSelected(true);
								}
							}
						}
							

				}
				if (this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategoryTemp1")) {
					var aSelectedPartnerBasedOnTypeTemp = this.participantsF4MultiselectFragment
					.getModel("SelectedPartnerCategoryTemp1").getProperty("/"
									+ aPartnerTypes[iIndex]["PartnerFunctionName"]);
					if (aSelectedPartnerBasedOnTypeTemp)
						for ( var i = 0;i < aPartnersBasedOnType.length; i++){
							
							for ( var k = 0; k < aSelectedPartnerBasedOnTypeTemp.length; k++) {
								if (aSelectedPartnerBasedOnTypeTemp[k]["key"] === aPartnersBasedOnType[i]
								.getDescription()) {
									aPartnersBasedOnType[i]
									.setSelected(true);
								}
							}
						}
							

				}
				if (this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategoryTemp2")) {
					var aSelectedPartnerBasedOnTypeTemp = this.participantsF4MultiselectFragment
					.getModel("SelectedPartnerCategoryTemp2").getProperty("/"
									+ aPartnerTypes[iIndex]["PartnerFunctionName"]);
					if (aSelectedPartnerBasedOnTypeTemp)
						for ( var i = 0;i < aPartnersBasedOnType.length; i++){
							
							for ( var k = 0; k < aSelectedPartnerBasedOnTypeTemp.length; k++) {
								if (aSelectedPartnerBasedOnTypeTemp[k]["key"] === aPartnersBasedOnType[i]
								.getDescription()) {
									aPartnersBasedOnType[i]
									.setSelected(true);
								}
							}
						}
							

				}
						
						
					
						
						break;
						
					case "0007":
						var fnSuccess, fnError;
						
						fnSuccess = jQuery
								.proxy(
										function(sCategory, oData,
												oResponse) {
											var oCurPartnerModel = this.participantsF4MultiselectFragment
													.getModel("PartnersBasedOnType");
											oCurPartnerModel
													.setProperty(
															"/"
																	+ sCategory,
															oData.results);
											for ( var x = 0; x < oData.results.length; x++) {
												if(oData.results[x].fullName=="")
													oData.results[x].fullName=" ";
												
											}
											this.participantsF4MultiselectFragment
													.getContent()[0]
													.getPages()[1]
													.getContent()[0]
													.bindItems(
															"PartnersBasedOnType>/"
																	+ sCategory,
															this.contactListItemTemplate1,
															null,
															[]);

										},
										this,
										aPartnerTypes[iIndex]["PartnerFunctionName"]);
						fnError = jQuery.proxy(function(oError) {
}, this);
						if(toolBar){
							
							this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().getContent()[0].setText("Filtered By Account ID :"+this.accountName);
							 
							this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().setVisible(true);
						this.oModel.read("AccountCollection('"+this.accountId+"')/Contacts",	null, null, false, fnSuccess,
								fnError);
						}else if(this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().getVisible()&&searchText){
							
							this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().getContent()[0].setText("Filtered By Account ID :"+this.accountName);
							
							this.oModel.read("AccountCollection('"+this.accountId+"')/Contacts",	null, '$top=200&$filter=substringof(%27'+encodeURIComponent(searchText)+'%27,fullName)', false, fnSuccess,
									fnError);
						}
						else if(searchText.length>0){
							this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().setVisible(false);
							this.oModel.read("/ContactCollection",	null, '$top=200&$filter=substringof(%27'+encodeURIComponent(searchText)+'%27,fullName)', false, fnSuccess,
									fnError);
							
						}else{
							this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().setVisible(false);
							this.oModel.read("/ContactCollection",	null, null, false, fnSuccess,
									fnError);
						}
					
					
					
					this.participantsF4MultiselectFragment
					.getContent()[0].getPages()[1]
					.getContent()[0].destroyItems();
			this.participantsF4MultiselectFragment
					.getContent()[0].getPages()[1]
					.getContent()[0]
					.bindItems(
							"PartnersBasedOnType>/"
									+ aPartnerTypes[iIndex]["PartnerFunctionName"],
							this.contactListItemTemplate1,
							null, []);
			var aPartnersBasedOnType = this.participantsF4MultiselectFragment
					.getContent()[0].getPages()[1]
					.getContent()[0].getItems();
			var modelValue = this.participantsF4MultiselectFragment
					.getModel("PartnersBasedOnType")
					.getProperty(
							"/"
									+ aPartnerTypes[iIndex]["PartnerFunctionName"]);
			var aEmployeeIds;
			if (this.participantsF4MultiselectFragment
					.getModel("SelectedPartnerCategory")) {
				var aSelectedPartnerBasedOnType = sSelectedPartnerCategoryAndParticipants
						.getProperty("/"
								+ aPartnerTypes[iIndex]["PartnerFunctionName"]);
				if (aSelectedPartnerBasedOnType)
					for ( var i = 0; i < aPartnersBasedOnType.length; i++){
						for ( var k = 0; k < aSelectedPartnerBasedOnType.length; k++) {
							
						
						if (aSelectedPartnerBasedOnType[k]["key"] === aPartnersBasedOnType[i]
								.getDescription()) {
							aPartnersBasedOnType[i]
									.setSelected(true);
							
						}
						}
					}
			}
			if (this.participantsF4MultiselectFragment
					.getModel("SelectedPartnerCategoryDeletedTemp")) {
				var aSelectedPartnerBasedOnTypeTemp = this.participantsF4MultiselectFragment
				.getModel("SelectedPartnerCategoryDeletedTemp").getProperty("/"
								+ aPartnerTypes[iIndex]["PartnerFunctionName"]);
				if (aSelectedPartnerBasedOnTypeTemp)
					for ( var i = 0;i < aPartnersBasedOnType.length; i++){
						
						for ( var k = 0; k < aSelectedPartnerBasedOnTypeTemp.length; k++) {
							if (aSelectedPartnerBasedOnTypeTemp[k].getDescription() === aPartnersBasedOnType[i]
							.getDescription()) {
								aPartnersBasedOnType[i]
								.setSelected(false);
							}
						}
					}
						

			}

			if (this.participantsF4MultiselectFragment
					.getModel("SelectedPartnerCategoryTemp")) {
				var aSelectedPartnerBasedOnTypeTemp = this.participantsF4MultiselectFragment
				.getModel("SelectedPartnerCategoryTemp").getProperty("/"
								+ aPartnerTypes[iIndex]["PartnerFunctionName"]);
				if (aSelectedPartnerBasedOnTypeTemp)
					for ( var i = 0;i < aPartnersBasedOnType.length; i++){
						
						for ( var k = 0; k < aSelectedPartnerBasedOnTypeTemp.length; k++) {
							if (aSelectedPartnerBasedOnTypeTemp[k]["key"] === aPartnersBasedOnType[i]
							.getDescription()) {
								aPartnersBasedOnType[i]
								.setSelected(true);
							}
						}
					}
						

			}
			if (this.participantsF4MultiselectFragment
					.getModel("SelectedPartnerCategoryTemp1")) {
				var aSelectedPartnerBasedOnTypeTemp = this.participantsF4MultiselectFragment
				.getModel("SelectedPartnerCategoryTemp1").getProperty("/"
								+ aPartnerTypes[iIndex]["PartnerFunctionName"]);
				if (aSelectedPartnerBasedOnTypeTemp)
					for ( var i = 0;i < aPartnersBasedOnType.length; i++){
						
						for ( var k = 0; k < aSelectedPartnerBasedOnTypeTemp.length; k++) {
							if (aSelectedPartnerBasedOnTypeTemp[k]["key"] === aPartnersBasedOnType[i]
							.getDescription()) {
								aPartnersBasedOnType[i]
								.setSelected(true);
							}
						}
					}
						

			}
			
			if (this.participantsF4MultiselectFragment
					.getModel("SelectedPartnerCategoryTemp2")) {
				var aSelectedPartnerBasedOnTypeTemp = this.participantsF4MultiselectFragment
				.getModel("SelectedPartnerCategoryTemp2").getProperty("/"
								+ aPartnerTypes[iIndex]["PartnerFunctionName"]);
				if (aSelectedPartnerBasedOnTypeTemp)
					for ( var i = 0;i < aPartnersBasedOnType.length; i++){
						
						for ( var k = 0; k < aSelectedPartnerBasedOnTypeTemp.length; k++) {
							if (aSelectedPartnerBasedOnTypeTemp[k]["key"] === aPartnersBasedOnType[i]
							.getDescription()) {
								aPartnersBasedOnType[i]
								.setSelected(true);
							}
						}
					}
						

			}
					
					
				
					
					break;
						default:
var fnSuccess, fnError;
						
						fnSuccess = jQuery
								.proxy(
										function(sCategory, oData,
												oResponse) {
											var oCurPartnerModel = this.participantsF4MultiselectFragment
													.getModel("PartnersBasedOnType");
											oCurPartnerModel
													.setProperty(
															"/"
																	+ sCategory,
															oData.results);
											for ( var x = 0; x < oData.results.length; x++) {
												if(oData.results[x].fullName=="")
													oData.results[x].fullName=" ";
												
											}
											if(toolBar&&this.sBackendVersion==4){
												this.participantsF4MultiselectFragment
												.getContent()[0]
												.getPages()[1]
												.getContent()[0]
												.bindItems(
														"PartnersBasedOnType>/"
																+ sCategory,
														this.accountListItemTemplate2,
														null,
														[]);
											}
											else if(searchText.length>0&&this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().getVisible()){
												
												this.participantsF4MultiselectFragment
												.getContent()[0]
												.getPages()[1]
												.getContent()[0]
												.bindItems(
														"PartnersBasedOnType>/"
																+ sCategory,
														this.accountListItemTemplate2,
														null,
														[]);
												
											}
											else if(searchText.length>0){
												this.participantsF4MultiselectFragment
												.getContent()[0]
												.getPages()[1]
												.getContent()[0]
												.bindItems(
														"PartnersBasedOnType>/"
																+ sCategory,
														this.accountListItemTemplate1,
														null,
														[]);
												
											}else{
												this.participantsF4MultiselectFragment
												.getContent()[0]
												.getPages()[1]
												.getContent()[0]
												.bindItems(
														"PartnersBasedOnType>/"
																+ sCategory,
														this.accountListItemTemplate1,
														null,
														[]);
												
											}

										},
										this,
										aPartnerTypes[iIndex]["PartnerFunctionName"]);
						fnError = jQuery.proxy(function(oError) {
}, this);
						
						if(toolBar&&this.sBackendVersion==4){
							 this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().getContent()[0].setText("Filtered By Account ID :"+this.accountName);
							 this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().setVisible(true);
							  
							 this.oModel.read("AccountCollection('"+this.accountId+"')/Relationships?$filter=relationshipCategory eq '"+aPartnerTypes[iIndex].RelationshipCategory+"' ",	null, null, false, fnSuccess,
										fnError);
						}
						else if(searchText.length>0&&this.sBackendVersion==4&&this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().getVisible()){
							this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().setVisible(true);
							this.oModel.read("AccountCollection('"+this.accountId+"')/Relationships?$filter=relationshipCategory eq '"+aPartnerTypes[iIndex].RelationshipCategory+"'and substringof('"+searchText+"',account2FullName) ",	null, null, false, fnSuccess,
									fnError);
							
						}
						else if(searchText.length>0){
							this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().setVisible(false);
							this.oModel.read("/AccountCollection",	null, '$top=200&$filter=substringof(%27'+encodeURIComponent(searchText)+'%27,fullName)', false, fnSuccess,
									fnError);
							
						}else{
							this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().setVisible(false);
							this.oModel.read("/AccountCollection",	null,null, false, fnSuccess,
									fnError);
							
						}
						
					
					
					
					this.participantsF4MultiselectFragment
					.getContent()[0].getPages()[1]
					.getContent()[0].destroyItems();
					if(toolBar){
						this.participantsF4MultiselectFragment
						.getContent()[0].getPages()[1]
						.getContent()[0]
						.bindItems(
								"PartnersBasedOnType>/"
										+ aPartnerTypes[iIndex]["PartnerFunctionName"],
								this.accountListItemTemplate2,
								null, []);
					}
					else if(searchText.length>0&&this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().getVisible()){
						
						this.participantsF4MultiselectFragment
						.getContent()[0].getPages()[1]
						.getContent()[0]
						.bindItems(
								"PartnersBasedOnType>/"
										+ aPartnerTypes[iIndex]["PartnerFunctionName"],
								this.accountListItemTemplate2,
								null, []);
						
					}
					
					else if(searchText.length>0){
						this.participantsF4MultiselectFragment
						.getContent()[0].getPages()[1]
						.getContent()[0]
						.bindItems(
								"PartnersBasedOnType>/"
										+ aPartnerTypes[iIndex]["PartnerFunctionName"],
								this.accountListItemTemplate1,
								null, []);
					}else{
						this.participantsF4MultiselectFragment
						.getContent()[0].getPages()[1]
						.getContent()[0]
						.bindItems(
								"PartnersBasedOnType>/"
										+ aPartnerTypes[iIndex]["PartnerFunctionName"],
								this.accountListItemTemplate1,
								null, []);
						
					}
			var aPartnersBasedOnType = this.participantsF4MultiselectFragment
					.getContent()[0].getPages()[1]
					.getContent()[0].getItems();
			var modelValue = this.participantsF4MultiselectFragment
					.getModel("PartnersBasedOnType")
					.getProperty(
							"/"
									+ aPartnerTypes[iIndex]["PartnerFunctionName"]);
			var aEmployeeIds;
			if (this.participantsF4MultiselectFragment
					.getModel("SelectedPartnerCategory")) {
				var aSelectedPartnerBasedOnType = sSelectedPartnerCategoryAndParticipants
						.getProperty("/"
								+ aPartnerTypes[iIndex]["PartnerFunctionName"]);
				if (aSelectedPartnerBasedOnType)
					for ( var i = 0; i < aPartnersBasedOnType.length; i++){
						for ( var k = 0; k < aSelectedPartnerBasedOnType.length; k++) {
							
						
						if (aSelectedPartnerBasedOnType[k]["key"] === aPartnersBasedOnType[i]
								.getDescription()) {
							aPartnersBasedOnType[i]
									.setSelected(true);
							
						}
						}
					}
			}
			if (this.participantsF4MultiselectFragment
					.getModel("SelectedPartnerCategoryDeletedTemp")) {
				var aSelectedPartnerBasedOnTypeTemp = this.participantsF4MultiselectFragment
				.getModel("SelectedPartnerCategoryDeletedTemp").getProperty("/"
								+ aPartnerTypes[iIndex]["PartnerFunctionName"]);
				if (aSelectedPartnerBasedOnTypeTemp)
					for ( var i = 0;i < aPartnersBasedOnType.length; i++){
						
						for ( var k = 0; k < aSelectedPartnerBasedOnTypeTemp.length; k++) {
							if (aSelectedPartnerBasedOnTypeTemp[k].getDescription() === aPartnersBasedOnType[i]
							.getDescription()) {
								aPartnersBasedOnType[i]
								.setSelected(false);
							}
						}
					}
						

			}

			if (this.participantsF4MultiselectFragment
					.getModel("SelectedPartnerCategoryTemp")) {
				var aSelectedPartnerBasedOnTypeTemp = this.participantsF4MultiselectFragment
				.getModel("SelectedPartnerCategoryTemp").getProperty("/"
								+ aPartnerTypes[iIndex]["PartnerFunctionName"]);
				if (aSelectedPartnerBasedOnTypeTemp)
					for ( var i = 0;i < aPartnersBasedOnType.length; i++){
						
						for ( var k = 0; k < aSelectedPartnerBasedOnTypeTemp.length; k++) {
							if (aSelectedPartnerBasedOnTypeTemp[k]["key"] === aPartnersBasedOnType[i]
							.getDescription()) {
								aPartnersBasedOnType[i]
								.setSelected(true);
							}
						}
					}
						

			}
			
			if (this.participantsF4MultiselectFragment
					.getModel("SelectedPartnerCategoryTemp1")) {
				var aSelectedPartnerBasedOnTypeTemp = this.participantsF4MultiselectFragment
				.getModel("SelectedPartnerCategoryTemp1").getProperty("/"
								+ aPartnerTypes[iIndex]["PartnerFunctionName"]);
				if (aSelectedPartnerBasedOnTypeTemp)
					for ( var i = 0;i < aPartnersBasedOnType.length; i++){
						
						for ( var k = 0; k < aSelectedPartnerBasedOnTypeTemp.length; k++) {
							if (aSelectedPartnerBasedOnTypeTemp[k]["key"] === aPartnersBasedOnType[i]
							.getDescription()) {
								aPartnersBasedOnType[i]
								.setSelected(true);
							}
						}
					}
						

			}
			if (this.participantsF4MultiselectFragment
					.getModel("SelectedPartnerCategoryTemp2")) {
				var aSelectedPartnerBasedOnTypeTemp = this.participantsF4MultiselectFragment
				.getModel("SelectedPartnerCategoryTemp2").getProperty("/"
								+ aPartnerTypes[iIndex]["PartnerFunctionName"]);
				if (aSelectedPartnerBasedOnTypeTemp)
					for ( var i = 0;i < aPartnersBasedOnType.length; i++){
						
						for ( var k = 0; k < aSelectedPartnerBasedOnTypeTemp.length; k++) {
							if (aSelectedPartnerBasedOnTypeTemp[k]["key"] === aPartnersBasedOnType[i]
							.getDescription()) {
								aPartnersBasedOnType[i]
								.setSelected(true);
							}
						}
					}
						

			}
							break;
			
					}
		        }
		        this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].setTitle(this.oResourceBundle.getText('PARTNERS')+" "+aPartnerTypes[iIndex]["PartnerFunctionName"]);
		        oNavCont._sSelectedPartnerCategory = aPartnerTypes[iIndex]["PartnerFunctionName"];
				oNavCont.to(this.participantsF4MultiselectFragment
						.getContent()[0].getPages()[1]);
				
			},
                   
         			onSelectParticipantMinMax : function(oEvent) {
         				var deleteNeeded=true;
         				var currentPartnerFunctionCode = this.participantsF4MultiselectFragment
						.getContent()[0].getPages()[0].getContent()[0]
						.getSelectedItem().getBindingContext('json')
						.getObject().PartnerFunctionCode;
				var currentPartnerFunctionName = this.participantsF4MultiselectFragment
						.getContent()[0].getPages()[0].getContent()[0]
						.getSelectedItem().getBindingContext('json')
						.getObject().PartnerFunctionName;
				
				if(this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategoryTemp"))
					if(this.participantsF4MultiselectFragment
							.getModel("SelectedPartnerCategoryTemp")
							.getProperty("/" + currentPartnerFunctionName))
				
         				if(!oEvent.getParameters().selected){
         					var itemUnchecked=oEvent.getParameters().listItem.getDescription();
         					var items = this.participantsF4MultiselectFragment
							.getModel("SelectedPartnerCategoryTemp")
							.getProperty("/" + currentPartnerFunctionName);
         					if(items){
         					for ( var k = 0; k < items.length; k++) {
						if (items[k].key == itemUnchecked) {
							this.participantsF4MultiselectFragment
									.getModel("SelectedPartnerCategoryTemp")
									.getProperty(
											"/" + currentPartnerFunctionName)
									.splice(k, 1);
							deleteNeeded=false;
						}
					}
         					
         					}
         					
					}
				
				
				if (!this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategoryDeletedTemp")) {
					this.participantsF4MultiselectFragment.setModel(
							new sap.ui.model.json.JSONModel(),
							"SelectedPartnerCategoryDeletedTemp");
				}
				
				if(this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategory"))
					if(deleteNeeded)
					if(!oEvent.getParameters().selected){
     					var itemUnchecked=oEvent.getParameters().listItem.getDescription();
     					var items = this.participantsF4MultiselectFragment
						.getModel("SelectedPartnerCategoryDeletedTemp")
						.getProperty("/" + currentPartnerFunctionName);
     					if(this.participantsF4MultiselectFragment
 								.getModel("SelectedPartnerCategoryDeletedTemp")
 								.getProperty("/" + currentPartnerFunctionName)){
     						this.participantsF4MultiselectFragment
 									.getModel("SelectedPartnerCategoryDeletedTemp")
 									.getProperty("/" + currentPartnerFunctionName).push(oEvent.getParameters().listItem);
     					}else{
     						
     						 var aList=[oEvent.getParameters().listItem];
					this.participantsF4MultiselectFragment
								.getModel("SelectedPartnerCategoryDeletedTemp")
								.setProperty(
										"/" + currentPartnerFunctionName,aList);
								
					
     					}
     						 
     						
     						
     					
     					
     					
				}
				
				
				
				
				
				
				
         				//Reading Selected Items Count
					

					var selectParticipants = this.participantsF4MultiselectFragment
							.getContent()[0].getPages()[0].getContent()[0];
					var index = selectParticipants
							.indexOfItem(selectParticipants
									.getSelectedItem());
					//Reading Min And Max Values
					var selectedPartnerFunction = this.participantsF4MultiselectFragment
							.getModel('json').getData().PartnerFunctions[index];
					var PartnerFunctionCode = selectedPartnerFunction.PartnerFunctionCode;

					var CountHigh = selectedPartnerFunction.CountHigh;
					var CountLow = selectedPartnerFunction.CountLow;
					var numberOfSelecteditems=0;
					if(this.participantsF4MultiselectFragment
							.getModel("SelectedPartnerCategoryTemp")){
						if(this.participantsF4MultiselectFragment
								.getModel("SelectedPartnerCategoryTemp")
								.getProperty("/" + currentPartnerFunctionName)){
					numberOfSelecteditems = this.participantsF4MultiselectFragment
					.getModel("SelectedPartnerCategoryTemp").getProperty("/"+currentPartnerFunctionName).length;
					}else{
						numberOfSelecteditems=0;
						}
					}else{
					numberOfSelecteditems=0;
					}
					var numberOfSelecteditems1=0;
					if(this.participantsF4MultiselectFragment
							.getModel("SelectedPartnerCategory")){
						if(this.participantsF4MultiselectFragment
								.getModel("SelectedPartnerCategory")
								.getProperty("/" + currentPartnerFunctionName))
					numberOfSelecteditems1 = this.participantsF4MultiselectFragment
					.getModel("SelectedPartnerCategory").getProperty("/"+currentPartnerFunctionName).length;
					}else{
					numberOfSelecteditems1=0;
					}
					var itemsDeletedTemp=0;
					if(this.participantsF4MultiselectFragment
							.getModel("SelectedPartnerCategoryDeletedTemp"))
						if(this.participantsF4MultiselectFragment
								.getModel("SelectedPartnerCategoryDeletedTemp")
								.getProperty("/" + currentPartnerFunctionName))
							itemsDeletedTemp = this.participantsF4MultiselectFragment
					.getModel("SelectedPartnerCategoryDeletedTemp")
					.getProperty("/" + currentPartnerFunctionName).length;
					
					

					if (numberOfSelecteditems+numberOfSelecteditems1-itemsDeletedTemp >= CountHigh) {
						// Too many participants for the current partner
						// function
						if (oEvent) {
							oEvent.getParameters().listItem
									.setSelected(false);
						}
						if (CountHigh === 1) {
							sap.m.MessageToast.show(this.oResourceBundle
									.getText('TOO_MANY_PARTICIPANTS_1',
											[ CountHigh ]), {
								duration : 3500
							});
						} else {
							sap.m.MessageToast.show(this.oResourceBundle
									.getText('TOO_MANY_PARTICIPANTS',
											[ CountHigh ]), {
								duration : 3500
							});
						}

						return;
					}else{
						if(oEvent.getParameters().selected){
							if (!this.participantsF4MultiselectFragment
									.getModel("SelectedPartnerCategoryTemp")) {
								this.participantsF4MultiselectFragment.setModel(
										new sap.ui.model.json.JSONModel(),
										"SelectedPartnerCategoryTemp");
							}
		 					var itemCheckedID=oEvent.getParameters().listItem.getDescription();
		 					var itemCheckedName=oEvent.getParameters().listItem.getTitle();
		 					var aEmployeeIds=[];
		 					aEmployeeIds.push({
								key : itemCheckedID,
								value : itemCheckedName
							});
		 					if(this.participantsF4MultiselectFragment
		 							.getModel("SelectedPartnerCategoryTemp")
		 							.getProperty("/" + currentPartnerFunctionName)){
		 					this.participantsF4MultiselectFragment
							.getModel("SelectedPartnerCategoryTemp")
							.getProperty("/" + currentPartnerFunctionName).push(aEmployeeIds[0]);
		 					}else{
		 						
		 						this.participantsF4MultiselectFragment
		 						.getModel("SelectedPartnerCategoryTemp")
		 						.setProperty("/" + currentPartnerFunctionName,aEmployeeIds);
		 						
		 					}

					
					}
					}

				},
                 
// //code for typeahead in account field
				 _setAccount: function(sAccountName) { 	        	
				 		 var accountInput = this.getView().byId("customer");
				         	if(accountInput)
				         		accountInput.setValue(sAccountName);
				         },
				         
				         
				         onAccountSuggestItemSelected: function(oEvent) {
				           	var oItem = oEvent.getParameter("selectedItem");
				           	var oAccount = null;             	
				            oAccount = oItem.data('oAccount');
				            //the accountId is set to the account field when the name is empty
								this.byId('customer').setValue(oAccount.fullName);
							    this.accountName = (oAccount.fullName === "") ? oAccount.accountID : oAccount.fullName;
							    this.accountId = oAccount.accountID;
							    this.enableSaveBtn();

				           },
				
				
                 onAccountInputFieldChanged : function(oEvent) {
                	 this.byId('customer').setValueState(sap.ui.core.ValueState.None);
                	 var accountInput = oEvent.getSource();
                	 
                     if(accountInput.getValue() === ""){
                    	 this.accountId = "";
                    	 this.accountName = "";
                     }
                 	this._setAccount(accountInput.getValue()); 
                 	if(accountInput.getValue().length==0)
             		{
             		this.enableSaveBtn();
             		return;
             		}
                	accountInput.setShowSuggestion(true);
                 	accountInput.setFilterSuggests(false);
                 	var fnCheckAccount = function(aAccounts) {
                 		accountInput.removeAllSuggestionItems();
                 
                 		if(accountInput.getValue().length>0){
                 		for(var i=0 in aAccounts) {
                 			var oAccount = aAccounts[i];
                 			
                 			if(oAccount.fullName.toUpperCase() == accountInput.getValue().toUpperCase()) {
                 				this._setAccount(oAccount.fullName);
                 			
                 			
                 				}
                 			var oCustomData = new sap.ui.core.CustomData({key:"oAccount", value:oAccount});
                 			var oItem = new sap.ui.core.Item({text:oAccount.fullName, customData:oCustomData});
                 			if (oAccount.fullName != ""){
                     			accountInput.addSuggestionItem(oItem);}
                 			
                 			//this.enableSaveBtn();
                 		}}
                 		//this.enableSaveBtn();
                 	};
                 	this._readAccount(accountInput.getValue(),fnCheckAccount);
                 },

                 _readAccount: function(searchString,callbackRead) {
                	
                	 var that = this,oModel=this.getView().getModel();
                 	  this.oModel.read("/AccountCollection", null,'$top=10&$filter=substringof(%27'+encodeURIComponent(searchString)+'%27,fullName,accountID)', true,

                 					function(oData, oResponse) {
                 						var accountData = jQuery.parseJSON(JSON.stringify(oData));
                 						if(callbackRead)
                 							callbackRead.call(that,accountData.results);
                 					},
                 					function(oError) {
                 						jQuery.sap.log.error("Read failed in S4->_readAccount:"+oError.response.body);
                 					}
                 			);
                 		},
                 	
                
                 		//code for typeahead in main contact field
                 		
                 
                 		_setContact : function(contact){                 			
                 			var contactInput = this.getView().byId("inputMainContact");
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
                          	this.byId('inputMainContact').setValue(oContact.fullName);
        				    this.contactName = oContact.fullName;
        				    this.contactId = oContact.contactID;
                  			
                          },
                          
                          
                          onContactInputFieldChanged: function(oEvent) {
                         	 this.byId('inputMainContact').setValueState(sap.ui.core.ValueState.None);
                         	 var contactInput = oEvent.getSource();
                          	this._setContact(contactInput.getValue());
                         	contactInput.setShowSuggestion(true);
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
                          		}}
                          	};
                          	this._readContact(contactInput.getValue(),fnCheckContact);
                          },
                          
                          _readContact: function(searchString,callbackRead) {
                          	
                         	 var that = this,oModel=this.getView().getModel();
                        	 this.oModel.read("/ContactCollection", null,'$top=10&$filter=substringof(%27'+encodeURIComponent(searchString)+'%27,fullName)', true,

                          					function(oData, oResponse) {
                          						var contactData = jQuery.parseJSON(JSON.stringify(oData));
                          						if(callbackRead)
                          							callbackRead.call(that,contactData.results);
                          					},
                          					function(oError) {
                          						jQuery.sap.log.error("Read failed in S4->_readContact:"+oError.response.body);
                          					}
                          			);
                          		} ,
                          		
                          		
        //code for typeahead search in employee responsible field
                          		
                          		
                          		
                          		_setEmployee : function(employee){                         			
                         			var employeeInput = this.getView().byId("inputEmpResponsible_S5");
                                 	if(employeeInput)
                                 		employeeInput.setValue(employee);
                                 },
                         		
                         		
                                 onEmployeeSuggestItemSelected: function(oEvent) {
                                  	var oItem = oEvent.getParameter("selectedItem");
                                  	var oemployee = null;
                                  	for(var i in oItem.getCustomData()) {
                                  		var oCustomData = oItem.getCustomData()[i];
                                  		if (oCustomData.getKey() == "oemployee")
                                  			oemployee = oCustomData.getValue();
                                  	}
                                                                    	
                                  	this.byId('inputEmpResponsible_S5').setValue(oemployee.fullName);
                				    this.employeeName = oemployee.fullName;                				    
                				    this.oSelectedEmployee.employeeID = oemployee.employeeID;             				    
                				                                  
                                                 				    
                                  },
                                  
                                  
                                  onEmployeeInputFieldChanged: function(oEvent) {
                                 	 this.byId('inputEmpResponsible_S5').setValueState(sap.ui.core.ValueState.None);
                                 	 var employeeInput = oEvent.getSource();
                                  	this._setEmployee (employeeInput.getValue());                                  	
                                  	employeeInput.setShowSuggestion(true);
                                  	employeeInput.setFilterSuggests(false);
                                  	var fnCheckemployee = function(aEmployees) {
                                  		employeeInput.removeAllSuggestionItems();
                                  		if(employeeInput.getValue().length>0){
                                  		for(var i=0 in aEmployees) {
                                  			var oemployee = aEmployees[i];
                                  			if(oemployee.fullName.toUpperCase() == employeeInput.getValue().toUpperCase()) {
                                  				this._setEmployee (oemployee.fullName);
                                  			}
                                  			var oCustomData = new sap.ui.core.CustomData({key:"oemployee", value:oemployee});
                                  			var oItem = new sap.ui.core.Item({text:oemployee.fullName, customData:oCustomData});
                                  			employeeInput.addSuggestionItem(oItem);
                                  		}}
                                  	};
                                  	this._reademployee(employeeInput.getValue(),fnCheckemployee);
                                  },
                                  
                                  _reademployee: function(searchString,callbackRead) {
                                  	
                                 	 var that = this,oModel=this.getView().getModel();                                  	
                                 	 this.oModel.read("/EmployeeCollection", null,'$top=10&$filter=substringof(%27'+encodeURIComponent(searchString)+'%27,fullName)', true,

                                  					function(oData, oResponse) {
                                  						var employeeData = jQuery.parseJSON(JSON.stringify(oData));
                                  						if(callbackRead)
                                  							callbackRead.call(that,employeeData.results);
                                  					},
                                  					function(oError) {
                                  						jQuery.sap.log.error("Read failed in S4->_reademployee:"+oError.response.body);
                                  					}
                                  			);
                                  		},     
                                  
                                  		           
                                  	// type ahead search in currency field	
                                  		
                                  		_setCurrency : function(curr){                         			
                                 			var currencyInput = this.getView().byId("currency");
                                         	if(currencyInput)
                                         		currencyInput.setValue(curr);
                                         },
                                 		
                                 		
                                         onCurrencySuggestItemSelected: function(oEvent) {
                                          	var oItem = oEvent.getParameter("selectedItem");
                                          	var oCurrency = null;
                                          	for(var i in oItem.getCustomData()) {
                                          		var oCustomData = oItem.getCustomData()[i];
                                          		if (oCustomData.getKey() == "oCurrency")
                                          			oCurrency = oCustomData.getValue();
                                          	}
                                          	                          	
                                          	
                                          	              				    
                                          	this.byId('currency').attachBrowserEvent("keydown",jQuery.proxy(function(oEvent)
                            						{
                            					         if(oEvent.keyCode === 13){
                            					        	 this.byId('currency').setValue(oCurrency.CurrencyKey);
                            					        	 this.CurrencyKey = oCurrency.CurrencyKey; 
                            					         }
                            						},this));        				    
                        				                                  
                                                         				    
                                          },
                                          
                                          
                                          onCurrencyInputFieldChanged: function(oEvent) {
                                         	 this.byId('currency').setValueState(sap.ui.core.ValueState.None);
                                         	 var currencyInput = oEvent.getSource();
                                         	 
                                         	                                  	
                                          },
                                          
                                                       	
                   // Code for 4 letter search in Account field
                                          		
                                          		liveSearchAccount : function(oEvent){
                                    				var sVal = oEvent.getParameter("value"), aFilters = [];
                                    				if (sVal.length == 0 || (sVal && sVal.length > 3)) {
                                    					var itemsBinding = oEvent.getParameter("itemsBinding");
                                    					var sAccountAnnotation = cus.crm.opportunity.util.schema._getEntityAnnotation(this.oModel,'service-schema-version','Account');
                                    					aFilters.push(new sap.ui.model.Filter(((sAccountAnnotation === null) ? "name1" : "fullName"), sap.ui.model.FilterOperator.Contains, sVal));
                                    					if(itemsBinding){
                                    			            itemsBinding.aApplicationFilters = [];  
                                    			            itemsBinding.filter(aFilters);
                                    			    		
                                    			    }
                                    					}
                                    			},
                                          		
           //code for 4 letter search in main contact field 
                                    			
                                          		liveSearchContact : function(oEvent){
                                          			var sText = oEvent.getParameters().newValue;
                                          			var oSearchField = this.contactF4Fragment.getSubHeader().getContentLeft()[0];
                                          			if(sText.length === 0  || sText.length > 3){
                                          				oSearchField.fireSearch({query : sText});
                                          			}
                                          		},
                                          		
                                          		
                                          		
                                          		
                                          		
           // code for 4 letter search in employee field
                                          		
                                          		liveSearchEmployee : function(oEvent){
                                          			var sText = oEvent.getParameters().newValue;
                                          			var oSearchField = this.employeeF4Fragment.getSubHeader().getContentLeft()[0];
                                          			if(sText.length === 0  || sText.length > 3){
                                          				oSearchField.fireSearch({query : sText});
                                          			}
                                          			
                                          		},
                                          		
           // live search for currency field  
                                          		
                                          		liveSearchCurrency : function(oEvent){

                                          			var sVal = oEvent.getParameter("value");

                                          			if (sVal.length == 0 || (sVal && sVal.length > 3)) {
                                          			var filters = new sap.ui.model.Filter([
                                          					new sap.ui.model.Filter("CurrencyText",
                                          					sap.ui.model.FilterOperator.Contains,
                                          					sVal)], false);
                                          			oEvent.getParameter("itemsBinding").filter([filters]);


                                          			}


                                          			}

			
			
		});
